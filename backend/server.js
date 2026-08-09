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

// ---- Vietnam-local ("Asia/Ho_Chi_Minh", UTC+7) day boundary helpers ----
function todayVN() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function freshState() {
  return {
    day: todayVN(),
    ateCount: 0,
    notAteCount: 0,
    votedTokens: [],
    exerciseDidCount: 0,
    exerciseNotDidCount: 0,
    exerciseVotedTokens: [],
  };
}

function loadState() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.day === 'string' &&
      typeof parsed.ateCount === 'number' &&
      typeof parsed.notAteCount === 'number' &&
      Array.isArray(parsed.votedTokens)
    ) {
      // Backfill exercise fields for state files written before this feature
      // existed, so an older data.json on disk doesn't get rejected wholesale.
      if (typeof parsed.exerciseDidCount !== 'number') parsed.exerciseDidCount = 0;
      if (typeof parsed.exerciseNotDidCount !== 'number') parsed.exerciseNotDidCount = 0;
      if (!Array.isArray(parsed.exerciseVotedTokens)) parsed.exerciseVotedTokens = [];
      return parsed;
    }
  } catch (err) {
    // First run (no file yet) or corrupt file — start fresh.
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

function computeStats() {
  const totalVotes = state.ateCount + state.notAteCount;
  const percentageAte = totalVotes > 0 ? Number(((state.ateCount / totalVotes) * 100).toFixed(1)) : 0;
  return {
    ateCount: state.ateCount,
    notAteCount: state.notAteCount,
    totalVotes,
    percentageAte,
    lastUpdated: new Date().toISOString(),
  };
}

function computeExerciseStats() {
  const totalVotes = state.exerciseDidCount + state.exerciseNotDidCount;
  const percentageDid = totalVotes > 0 ? Number(((state.exerciseDidCount / totalVotes) * 100).toFixed(1)) : 0;
  return {
    didCount: state.exerciseDidCount,
    notDidCount: state.exerciseNotDidCount,
    totalVotes,
    percentageDid,
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

app.get('/api/stats', (_req, res) => {
  ensureDailyReset();
  res.json({ success: true, data: computeStats() });
});

const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

app.post('/api/vote', voteLimiter, (req, res) => {
  ensureDailyReset();

  const { choice, deviceToken } = req.body || {};
  const validChoice = choice === 'ate' || choice === 'not_yet';
  const validToken = typeof deviceToken === 'string' && deviceToken.length >= 5 && deviceToken.length <= 100;

  if (!validChoice || !validToken) {
    return res.status(400).json({ success: false, error: 'Invalid input payload.' });
  }

  if (state.votedTokens.includes(deviceToken)) {
    return res.status(400).json({ success: false, error: 'This device has already voted today.' });
  }

  state.votedTokens.push(deviceToken);
  if (choice === 'ate') {
    state.ateCount += 1;
  } else {
    state.notAteCount += 1;
  }
  saveState(state);

  res.json({ success: true, message: 'Vote recorded successfully', data: computeStats() });
});

app.get('/api/exercise/stats', (_req, res) => {
  ensureDailyReset();
  res.json({ success: true, data: computeExerciseStats() });
});

app.post('/api/exercise/vote', voteLimiter, (req, res) => {
  ensureDailyReset();

  const { choice, deviceToken } = req.body || {};
  const validChoice = choice === 'did' || choice === 'not_yet';
  const validToken = typeof deviceToken === 'string' && deviceToken.length >= 5 && deviceToken.length <= 100;

  if (!validChoice || !validToken) {
    return res.status(400).json({ success: false, error: 'Invalid input payload.' });
  }

  if (state.exerciseVotedTokens.includes(deviceToken)) {
    return res.status(400).json({ success: false, error: 'This device has already voted today.' });
  }

  state.exerciseVotedTokens.push(deviceToken);
  if (choice === 'did') {
    state.exerciseDidCount += 1;
  } else {
    state.exerciseNotDidCount += 1;
  }
  saveState(state);

  res.json({ success: true, message: 'Vote recorded successfully', data: computeExerciseStats() });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🍚 Ancom backend listening on :${PORT} (allowed origins: ${ALLOWED_ORIGINS.join(', ')})`);
});
