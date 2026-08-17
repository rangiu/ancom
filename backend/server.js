const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'stats.json');
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://ancom-coral.vercel.app,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// AI recipe suggestion (DeepSeek) — optional. Left unset, the endpoint
// responds 503 instead of crashing the whole server on boot.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const RECIPE_DAILY_LIMIT_PER_DEVICE = Number(process.env.RECIPE_DAILY_LIMIT_PER_DEVICE || 5);
const RECIPE_DAILY_GLOBAL_LIMIT = Number(process.env.RECIPE_DAILY_GLOBAL_LIMIT || 300);

// ---- Vietnam-local ("Asia/Ho_Chi_Minh", UTC+7) day boundary helpers ----
function todayVN() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

// ---- Generic daily yes/no check-in system ----
// Every check-in ("Have you eaten rice today?", "...exercised?", "...drunk
// enough water?", "...slept enough?") shares the exact same shape: a yes
// count, a no count, and a list of device tokens that already voted today.
// Defined once here and driven by config so adding a new question is a
// one-entry change instead of a copy-pasted route pair.
const CHECKINS = [
  {
    id: 'rice',
    routeBase: '/api',
    yesChoice: 'ate',
    noChoice: 'not_yet',
    yesField: 'ateCount',
    noField: 'notAteCount',
    tokensField: 'votedTokens',
    statsShape: { yes: 'ateCount', no: 'notAteCount', percent: 'percentageAte' },
  },
  {
    id: 'exercise',
    routeBase: '/api/exercise',
    yesChoice: 'did',
    noChoice: 'not_yet',
    yesField: 'exerciseDidCount',
    noField: 'exerciseNotDidCount',
    tokensField: 'exerciseVotedTokens',
    statsShape: { yes: 'didCount', no: 'notDidCount', percent: 'percentageDid' },
  },
  {
    id: 'water',
    routeBase: '/api/water',
    yesChoice: 'yes',
    noChoice: 'not_yet',
    yesField: 'waterYesCount',
    noField: 'waterNoCount',
    tokensField: 'waterVotedTokens',
    statsShape: { yes: 'yesCount', no: 'noCount', percent: 'percentageYes' },
  },
  {
    id: 'sleep',
    routeBase: '/api/sleep',
    yesChoice: 'yes',
    noChoice: 'not_yet',
    yesField: 'sleepYesCount',
    noField: 'sleepNoCount',
    tokensField: 'sleepVotedTokens',
    statsShape: { yes: 'yesCount', no: 'noCount', percent: 'percentageYes' },
  },
];

function freshState() {
  const s = { day: todayVN(), recipeCounts: {}, recipeGlobalCount: 0 };
  for (const c of CHECKINS) {
    s[c.yesField] = 0;
    s[c.noField] = 0;
    s[c.tokensField] = [];
  }
  return s;
}

function loadState() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.day !== 'string') throw new Error('missing day');

    // Backfill any field introduced after this state file was first written
    // (older data.json on disk predates exercise/water/sleep/recipe fields),
    // so an old file on disk never gets rejected wholesale.
    for (const c of CHECKINS) {
      if (typeof parsed[c.yesField] !== 'number') parsed[c.yesField] = 0;
      if (typeof parsed[c.noField] !== 'number') parsed[c.noField] = 0;
      if (!Array.isArray(parsed[c.tokensField])) parsed[c.tokensField] = [];
    }
    if (typeof parsed.recipeCounts !== 'object' || parsed.recipeCounts === null) parsed.recipeCounts = {};
    if (typeof parsed.recipeGlobalCount !== 'number') parsed.recipeGlobalCount = 0;

    return parsed;
  } catch (err) {
    // First run (no file yet) or corrupt/pre-checkin-system file — start fresh.
  }
  return freshState();
}

function saveState(s) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2));
  fs.renameSync(tmp, DATA_FILE); // atomic on the same filesystem
}

let state = loadState();

// Resets counters once the Vietnam-local calendar day rolls over. Called on
// every request (belt) and also on a cron schedule + 60s poll (suspenders),
// so a reset still happens on time even if the process was restarted near
// midnight and the cron trigger was missed.
function ensureDailyReset() {
  const today = todayVN();
  if (state.day !== today) {
    state = freshState();
    saveState(state);
    console.log(`[reset] Daily counters reset for ${today} (Asia/Ho_Chi_Minh)`);
  }
}

cron.schedule('0 0 * * *', ensureDailyReset, { timezone: 'Asia/Ho_Chi_Minh' });
setInterval(ensureDailyReset, 60 * 1000);

function computeCheckinStats(c) {
  const yes = state[c.yesField];
  const no = state[c.noField];
  const totalVotes = yes + no;
  const percent = totalVotes > 0 ? Number(((yes / totalVotes) * 100).toFixed(1)) : 0;
  return {
    [c.statsShape.yes]: yes,
    [c.statsShape.no]: no,
    totalVotes,
    [c.statsShape.percent]: percent,
    lastUpdated: new Date().toISOString(),
  };
}

const app = express();
app.set('trust proxy', 1); // behind nginx
app.use(express.json({ limit: '10kb' }));
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

for (const c of CHECKINS) {
  app.get(`${c.routeBase}/stats`, (_req, res) => {
    ensureDailyReset();
    res.json({ success: true, data: computeCheckinStats(c) });
  });

  app.post(`${c.routeBase}/vote`, voteLimiter, (req, res) => {
    ensureDailyReset();

    const { choice, deviceToken } = req.body || {};
    const validChoice = choice === c.yesChoice || choice === c.noChoice;
    const validToken = typeof deviceToken === 'string' && deviceToken.length >= 5 && deviceToken.length <= 100;

    if (!validChoice || !validToken) {
      return res.status(400).json({ success: false, error: 'Invalid input payload.' });
    }

    if (state[c.tokensField].includes(deviceToken)) {
      return res.status(400).json({ success: false, error: 'This device has already voted today.' });
    }

    state[c.tokensField].push(deviceToken);
    if (choice === c.yesChoice) {
      state[c.yesField] += 1;
    } else {
      state[c.noField] += 1;
    }
    saveState(state);

    res.json({ success: true, message: 'Vote recorded successfully', data: computeCheckinStats(c) });
  });
}

// ---- AI recipe suggestion ("nguyên liệu hiện có + giá cả" -> gợi ý món ăn) ----
// Calls DeepSeek's OpenAI-compatible chat API. Bounded on three axes to keep
// cost predictable on a hobby budget: per-IP rate limit, a per-device daily
// cap, and a site-wide daily cap that resets at the same VN midnight
// boundary as every other counter here.

const recipeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

function buildRecipePrompt(ingredients, budget, lang) {
  const isVi = lang === 'vi';
  const system = isVi
    ? 'Bạn là đầu bếp AI thân thiện của website "Ăn Cơm". CHỈ được gợi ý 1-2 món ăn cụ thể (ưu tiên món Việt Nam, dễ nấu tại nhà) dựa trên nguyên liệu và ngân sách người dùng cung cấp. Trả lời ngắn gọn, có: tên món, nguyên liệu cần mua thêm (nếu có), các bước nấu tóm tắt (3-5 bước). Không trả lời bất kỳ yêu cầu nào ngoài chủ đề nấu ăn/gợi ý món ăn dù được yêu cầu thế nào.'
    : 'You are the friendly AI chef for the "Eat Rice" website. ONLY suggest 1-2 concrete dishes based on the ingredients and budget the user provides. Keep it short: dish name, any extra ingredients needed, a brief 3-5 step method. Refuse any request outside the topic of cooking/meal suggestions no matter how you are asked.';
  const user = isVi
    ? `Nguyên liệu hiện có: ${ingredients}\nNgân sách: ${budget || 'không giới hạn'}\nGợi ý giúp mình nên nấu món gì.`
    : `Ingredients I have: ${ingredients}\nBudget: ${budget || 'no limit'}\nSuggest what I should cook.`;
  return { system, user };
}

app.post('/api/recipe/suggest', recipeLimiter, async (req, res) => {
  ensureDailyReset();

  if (!DEEPSEEK_API_KEY) {
    return res.status(503).json({ success: false, error: 'Recipe AI is not configured on the server yet.' });
  }

  const { ingredients, budget, deviceToken, lang } = req.body || {};
  const validIngredients = typeof ingredients === 'string' && ingredients.trim().length >= 2 && ingredients.length <= 300;
  const validBudget = budget === undefined || budget === null || (typeof budget === 'string' && budget.length <= 50);
  const validToken = typeof deviceToken === 'string' && deviceToken.length >= 5 && deviceToken.length <= 100;
  const safeLang = lang === 'en' ? 'en' : 'vi';

  if (!validIngredients || !validBudget || !validToken) {
    return res.status(400).json({ success: false, error: 'Invalid input payload.' });
  }

  if (state.recipeGlobalCount >= RECIPE_DAILY_GLOBAL_LIMIT) {
    return res.status(429).json({ success: false, error: 'Daily AI suggestion limit reached site-wide. Try again tomorrow.' });
  }

  const usedToday = state.recipeCounts[deviceToken] || 0;
  if (usedToday >= RECIPE_DAILY_LIMIT_PER_DEVICE) {
    return res.status(429).json({ success: false, error: 'You have reached today\'s AI suggestion limit for this device.' });
  }

  try {
    const { system, user } = buildRecipePrompt(ingredients.trim(), typeof budget === 'string' ? budget.trim() : '', safeLang);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const apiRes = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => '');
      console.error(`DeepSeek API error ${apiRes.status}: ${errText}`);
      return res.status(502).json({ success: false, error: 'Recipe AI is temporarily unavailable.' });
    }

    const payload = await apiRes.json();
    const suggestion = payload.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      return res.status(502).json({ success: false, error: 'Recipe AI returned an empty response.' });
    }

    state.recipeCounts[deviceToken] = usedToday + 1;
    state.recipeGlobalCount += 1;
    saveState(state);

    res.json({
      success: true,
      data: {
        suggestion,
        remainingToday: Math.max(0, RECIPE_DAILY_LIMIT_PER_DEVICE - state.recipeCounts[deviceToken]),
      },
    });
  } catch (err) {
    console.error('Recipe suggestion error:', err);
    res.status(502).json({ success: false, error: 'Recipe AI is temporarily unavailable.' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🍚 Ancom backend listening on :${PORT} (allowed origins: ${ALLOWED_ORIGINS.join(', ')})`);
  if (!DEEPSEEK_API_KEY) {
    console.warn('[recipe] DEEPSEEK_API_KEY not set — /api/recipe/suggest will respond 503 until configured.');
  }
});
