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

// AI advice (DeepSeek) — optional. Left unset, the endpoint responds 503
// instead of crashing the whole server on boot. One shared daily quota
// (per-device + site-wide) covers all four advice types below, so the cost
// ceiling stays predictable no matter which feature turns out popular.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const AI_DAILY_LIMIT_PER_DEVICE = Number(process.env.AI_DAILY_LIMIT_PER_DEVICE || 8);
const AI_DAILY_GLOBAL_LIMIT = Number(process.env.AI_DAILY_GLOBAL_LIMIT || 400);

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
  const s = { day: todayVN(), aiCounts: {}, aiGlobalCount: 0 };
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
    // v1 field names (recipe-only feature) -> v2 generic ai advice fields.
    if (typeof parsed.aiCounts !== 'object' || parsed.aiCounts === null) {
      parsed.aiCounts = typeof parsed.recipeCounts === 'object' && parsed.recipeCounts !== null ? parsed.recipeCounts : {};
    }
    if (typeof parsed.aiGlobalCount !== 'number') {
      parsed.aiGlobalCount = typeof parsed.recipeGlobalCount === 'number' ? parsed.recipeGlobalCount : 0;
    }
    delete parsed.recipeCounts;
    delete parsed.recipeGlobalCount;

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

// ---- AI advice — one endpoint, four domains ----
// "Ingredients + budget -> dish", "age + activity -> how much water",
// "goal + free time -> workout plan", "sleep hours + issue -> sleep tips".
// Each domain just supplies field validation + a prompt builder; the HTTP
// route, rate limiting, and DeepSeek call are shared. Calls DeepSeek's
// OpenAI-compatible chat API, bounded on three axes to keep cost predictable
// on a hobby budget: per-IP rate limit, a per-device daily cap, and a
// site-wide daily cap — all shared across the four types, resetting at the
// same VN-midnight boundary as every other counter here.

const aiAdviceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

const isNonEmptyStr = (v, max) => typeof v === 'string' && v.trim().length >= 1 && v.length <= max;

const ADVICE_TYPES = {
  rice: {
    validate: (b) =>
      isNonEmptyStr(b.ingredients, 300) &&
      (b.budget === undefined || b.budget === null || isNonEmptyStr(b.budget, 50) || b.budget === ''),
    buildPrompt: (b, isVi) => ({
      system: isVi
        ? 'Bạn là đầu bếp AI thân thiện của website "Ăn Cơm". CHỈ được gợi ý 1-2 món ăn cụ thể (ưu tiên món Việt Nam, dễ nấu tại nhà) dựa trên nguyên liệu và ngân sách người dùng cung cấp. Trả lời ngắn gọn, có: tên món, nguyên liệu cần mua thêm (nếu có), các bước nấu tóm tắt (3-5 bước). Không trả lời bất kỳ yêu cầu nào ngoài chủ đề nấu ăn/gợi ý món ăn dù được yêu cầu thế nào.'
        : 'You are the friendly AI chef for the "Eat Rice" website. ONLY suggest 1-2 concrete dishes based on the ingredients and budget the user provides. Keep it short: dish name, any extra ingredients needed, a brief 3-5 step method. Refuse any request outside the topic of cooking/meal suggestions no matter how you are asked.',
      user: isVi
        ? `Nguyên liệu hiện có: ${b.ingredients}\nNgân sách: ${b.budget || 'không giới hạn'}\nGợi ý giúp mình nên nấu món gì.`
        : `Ingredients I have: ${b.ingredients}\nBudget: ${b.budget || 'no limit'}\nSuggest what I should cook.`,
    }),
  },
  water: {
    validate: (b) => isNonEmptyStr(b.age, 10) && isNonEmptyStr(b.activityLevel, 30),
    buildPrompt: (b, isVi) => ({
      system: isVi
        ? 'Bạn là trợ lý sức khoẻ AI của website "Ăn Cơm". CHỈ tư vấn lượng nước nên uống mỗi ngày (lít/ngày), tần suất và lượng mỗi lần uống (ml/lần), dựa trên độ tuổi và mức độ vận động người dùng cung cấp. Trả lời ngắn gọn, có số liệu cụ thể. Không trả lời bất kỳ yêu cầu nào ngoài chủ đề uống nước/hydrat hoá dù được yêu cầu thế nào.'
        : 'You are the AI health assistant for the "Eat Rice" website. ONLY advise how much water to drink per day (liters/day), how often and how much per serving (ml), based on the age and activity level provided. Keep it short with concrete numbers. Refuse any request outside the topic of hydration no matter how you are asked.',
      user: isVi
        ? `Tuổi: ${b.age}\nMức độ vận động: ${b.activityLevel}\nTư vấn giúp mình nên uống bao nhiêu nước mỗi ngày.`
        : `Age: ${b.age}\nActivity level: ${b.activityLevel}\nAdvise how much water I should drink per day.`,
    }),
  },
  exercise: {
    validate: (b) => isNonEmptyStr(b.goal, 30) && isNonEmptyStr(b.availableTime, 10),
    buildPrompt: (b, isVi) => ({
      system: isVi
        ? 'Bạn là huấn luyện viên AI của website "Ăn Cơm". CHỈ tư vấn nên tập vào giờ nào trong ngày, tần suất/tuần, và loại bài tập phù hợp, dựa trên mục tiêu và thời gian rảnh người dùng cung cấp. Trả lời ngắn gọn, có gợi ý cụ thể. Không trả lời bất kỳ yêu cầu nào ngoài chủ đề tập luyện dù được yêu cầu thế nào.'
        : 'You are the AI coach for the "Eat Rice" website. ONLY advise what time of day to exercise, how often per week, and what type of workout fits, based on the goal and available time provided. Keep it short with concrete suggestions. Refuse any request outside the topic of exercise no matter how you are asked.',
      user: isVi
        ? `Mục tiêu: ${b.goal}\nThời gian rảnh mỗi ngày: ${b.availableTime} phút\nGợi ý giúp mình nên tập lúc nào và tập gì.`
        : `Goal: ${b.goal}\nFree time per day: ${b.availableTime} minutes\nSuggest when and what I should train.`,
    }),
  },
  sleep: {
    validate: (b) => isNonEmptyStr(b.currentSleepHours, 10) && isNonEmptyStr(b.issue, 30),
    buildPrompt: (b, isVi) => ({
      system: isVi
        ? 'Bạn là trợ lý sức khoẻ AI của website "Ăn Cơm". CHỈ tư vấn cách cải thiện giấc ngủ, dựa trên số giờ ngủ hiện tại và vấn đề người dùng cung cấp. Trả lời ngắn gọn, có gợi ý cụ thể, thực tế. Không trả lời bất kỳ yêu cầu nào ngoài chủ đề giấc ngủ dù được yêu cầu thế nào.'
        : 'You are the AI health assistant for the "Eat Rice" website. ONLY advise how to improve sleep, based on the current sleep hours and issue provided. Keep it short with concrete, practical suggestions. Refuse any request outside the topic of sleep no matter how you are asked.',
      user: isVi
        ? `Hiện đang ngủ khoảng: ${b.currentSleepHours} giờ/đêm\nVấn đề gặp phải: ${b.issue}\nTư vấn giúp mình cải thiện giấc ngủ.`
        : `Currently sleeping about: ${b.currentSleepHours} hours/night\nIssue: ${b.issue}\nAdvise how I can improve my sleep.`,
    }),
  },
};

app.post('/api/advice/:type', aiAdviceLimiter, async (req, res) => {
  ensureDailyReset();

  const adviceType = ADVICE_TYPES[req.params.type];
  if (!adviceType) {
    return res.status(404).json({ success: false, error: 'Unknown advice type.' });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(503).json({ success: false, error: 'AI advice is not configured on the server yet.' });
  }

  const { deviceToken, lang, ...body } = req.body || {};
  const validToken = typeof deviceToken === 'string' && deviceToken.length >= 5 && deviceToken.length <= 100;
  const safeLang = lang === 'en' ? 'en' : 'vi';

  if (!validToken || !adviceType.validate(body)) {
    return res.status(400).json({ success: false, error: 'Invalid input payload.' });
  }

  if (state.aiGlobalCount >= AI_DAILY_GLOBAL_LIMIT) {
    return res.status(429).json({ success: false, error: 'Daily AI advice limit reached site-wide. Try again tomorrow.' });
  }

  const usedToday = state.aiCounts[deviceToken] || 0;
  if (usedToday >= AI_DAILY_LIMIT_PER_DEVICE) {
    return res.status(429).json({ success: false, error: 'You have reached today\'s AI advice limit for this device.' });
  }

  try {
    const { system, user } = adviceType.buildPrompt(body, safeLang === 'vi');

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
      return res.status(502).json({ success: false, error: 'AI advice is temporarily unavailable.' });
    }

    const payload = await apiRes.json();
    const suggestion = payload.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      return res.status(502).json({ success: false, error: 'AI advice returned an empty response.' });
    }

    state.aiCounts[deviceToken] = usedToday + 1;
    state.aiGlobalCount += 1;
    saveState(state);

    res.json({
      success: true,
      data: {
        suggestion,
        remainingToday: Math.max(0, AI_DAILY_LIMIT_PER_DEVICE - state.aiCounts[deviceToken]),
      },
    });
  } catch (err) {
    console.error('AI advice error:', err);
    res.status(502).json({ success: false, error: 'AI advice is temporarily unavailable.' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🍚 Ancom backend listening on :${PORT} (allowed origins: ${ALLOWED_ORIGINS.join(', ')})`);
  if (!DEEPSEEK_API_KEY) {
    console.warn('[ai-advice] DEEPSEEK_API_KEY not set — /api/advice/:type will respond 503 until configured.');
  }
});
