import { VoteChoice, UserVoteState, VoteStats } from '../types';

const STORAGE_KEY_VOTE = 'ancom_vote_choice';
const STORAGE_KEY_TIME = 'ancom_vote_time';
const STORAGE_KEY_TOKEN = 'ancom_device_token';
const STORAGE_KEY_STATS = 'ancom_cached_stats';
const STORAGE_KEY_DAY = 'ancom_stats_day';
const COOKIE_KEY_VOTED = 'ancom_voted';

// Real counters start at zero — no fake seeded numbers.
export const DEFAULT_STATS: VoteStats = {
  ateCount: 0,
  notAteCount: 0,
  totalVotes: 0,
  percentageAte: 0,
};

/**
 * Returns today's date (YYYY-MM-DD) in Vietnam time (Asia/Ho_Chi_Minh, UTC+7),
 * regardless of the visitor's own system timezone. This is what drives the
 * daily reset at 00:00 Vietnam time.
 */
export const getVietnamDateString = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const clearVoteCookie = (): void => {
  document.cookie = `${COOKIE_KEY_VOTED}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

/**
 * Checks whether Vietnam-local calendar day has rolled over since the last
 * recorded interaction. If so, resets vote counts to zero and clears the
 * "already voted" state so the user can vote again today. Safe to call on
 * every app load and periodically while the tab stays open.
 */
export const ensureDailyReset = (): void => {
  const today = getVietnamDateString();
  const lastDay = localStorage.getItem(STORAGE_KEY_DAY);

  if (lastDay === today) return;

  localStorage.setItem(STORAGE_KEY_DAY, today);
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(DEFAULT_STATS));
  localStorage.removeItem(STORAGE_KEY_VOTE);
  localStorage.removeItem(STORAGE_KEY_TIME);
  clearVoteCookie();
};

export const getDeviceToken = (): string => {
  let token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (!token) {
    token = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  }
  return token;
};

export const getStoredVoteState = (): UserVoteState => {
  ensureDailyReset();

  const savedChoice = localStorage.getItem(STORAGE_KEY_VOTE) as VoteChoice | null;
  const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
  const cookieExists = document.cookie.split(';').some((c) => c.trim().startsWith(`${COOKIE_KEY_VOTED}=`));

  const hasVoted = Boolean(savedChoice || cookieExists);

  return {
    hasVoted,
    choice: savedChoice,
    votedAt: savedTime || undefined,
  };
};

export const saveVoteState = (choice: VoteChoice): void => {
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY_VOTE, choice);
  localStorage.setItem(STORAGE_KEY_TIME, now);

  // Cookie kept only as a redundant same-day marker; daily reset clears it anyway.
  document.cookie = `${COOKIE_KEY_VOTED}=${choice}; path=/; SameSite=Lax`;
};

export const getCachedStats = (): VoteStats => {
  ensureDailyReset();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse cached stats:', err);
  }
  return DEFAULT_STATS;
};

export const saveCachedStats = (stats: VoteStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats to localStorage:', err);
  }
};

/**
 * Records a vote for real: increments the persisted local counters and
 * returns the updated stats. Pure client-side — no network call.
 */
export const recordVoteLocally = (choice: VoteChoice): VoteStats => {
  ensureDailyReset();

  const current = getCachedStats();
  const newAte = choice === 'ate' ? current.ateCount + 1 : current.ateCount;
  const newNotAte = choice === 'not_yet' ? current.notAteCount + 1 : current.notAteCount;
  const newTotal = newAte + newNotAte;
  const newPercentage = newTotal > 0 ? Number(((newAte / newTotal) * 100).toFixed(1)) : 0;

  const updated: VoteStats = {
    ateCount: newAte,
    notAteCount: newNotAte,
    totalVotes: newTotal,
    percentageAte: newPercentage,
    lastUpdated: new Date().toISOString(),
  };

  saveCachedStats(updated);
  return updated;
};
