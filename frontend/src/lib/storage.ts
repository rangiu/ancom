import { VoteChoice, UserVoteState, VoteStats } from '../types';

const STORAGE_KEY_VOTE = 'ancom_vote_choice';
const STORAGE_KEY_TIME = 'ancom_vote_time';
const STORAGE_KEY_TOKEN = 'ancom_device_token';
const STORAGE_KEY_STATS = 'ancom_cached_stats';
const STORAGE_KEY_DAY = 'ancom_vote_day';
const COOKIE_KEY_VOTED = 'ancom_voted';

// Shown only until the first real fetch from the backend completes.
export const DEFAULT_STATS: VoteStats = {
  ateCount: 0,
  notAteCount: 0,
  totalVotes: 0,
  percentageAte: 0,
};

/**
 * Today's date (YYYY-MM-DD) in Vietnam time (Asia/Ho_Chi_Minh, UTC+7),
 * regardless of the visitor's own system timezone. The backend resets the
 * global counters at this same boundary (00:00 Asia/Ho_Chi_Minh); this
 * helper lets the client independently expire its own "already voted"
 * state at the same boundary so users can vote again the next day even
 * before their next successful stats fetch.
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
 * Checks whether the Vietnam-local calendar day has rolled over since the
 * last vote. If so, clears the local "already voted" state (the backend
 * has independently reset the real counters at the same boundary). Safe to
 * call on every app load and periodically while the tab stays open.
 */
export const ensureDailyReset = (): void => {
  const today = getVietnamDateString();
  const lastDay = localStorage.getItem(STORAGE_KEY_DAY);

  if (lastDay === today) return;

  localStorage.setItem(STORAGE_KEY_DAY, today);
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

  // Session-ish marker kept in sync with the daily reset above.
  document.cookie = `${COOKIE_KEY_VOTED}=${choice}; path=/; SameSite=Lax`;
};

/** Last stats successfully fetched from the backend — used as a fallback while offline/loading. */
export const getCachedStats = (): VoteStats => {
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
