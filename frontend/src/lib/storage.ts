import { VoteChoice, UserVoteState, VoteStats } from '../types';

const STORAGE_KEY_VOTE = 'ancom_vote_choice';
const STORAGE_KEY_TIME = 'ancom_vote_time';
const STORAGE_KEY_TOKEN = 'ancom_device_token';
const STORAGE_KEY_STATS = 'ancom_cached_stats';
const COOKIE_KEY_VOTED = 'ancom_voted';

export const DEFAULT_STATS: VoteStats = {
  ateCount: 1248,
  notAteCount: 312,
  totalVotes: 1560,
  percentageAte: 80.0,
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

  // Set Cookie for 30 days
  const d = new Date();
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_KEY_VOTED}=${choice}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
};

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
