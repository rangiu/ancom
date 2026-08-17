import {
  VoteStats,
  VoteChoice,
  ExerciseStats,
  ExerciseChoice,
  ApiResponse,
  CheckinChoice,
  CheckinStats,
  RecipeSuggestionResult,
} from '../types';
import {
  getDeviceToken,
  getCachedStats,
  saveCachedStats,
  getCachedExerciseStats,
  saveCachedExerciseStats,
  waterStorage,
  sleepStorage,
} from './storage';

// Real global backend — a small Node/Express service on the project's own
// VPS, reachable over HTTPS via a Cloudflare Tunnel. Counts are shared by
// every visitor and reset to 0 at 00:00 Vietnam time on the server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ancom-api.sumflow.online/api';

export const fetchVoteStats = async (): Promise<VoteStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<VoteStats> = await response.json();
    if (data.success && data.data) {
      saveCachedStats(data.data);
      return data.data;
    }
    throw new Error(data.error || 'Failed to parse stats payload');
  } catch (error) {
    console.error('Error fetching live stats, showing last known value:', error);
    return getCachedStats();
  }
};

export const submitVoteChoice = async (choice: VoteChoice): Promise<VoteStats> => {
  const deviceToken = getDeviceToken();

  const response = await fetch(`${API_BASE_URL}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice, deviceToken }),
  });

  const data: ApiResponse<VoteStats> = await response.json();

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.error || 'Failed to record vote');
  }

  saveCachedStats(data.data);
  return data.data;
};

// ---- Exercise ("Hôm nay bạn đã tập thể dục chưa?") — same backend, a
// separate pair of endpoints and counters. ----

export const fetchExerciseStats = async (): Promise<ExerciseStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise/stats`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<ExerciseStats> = await response.json();
    if (data.success && data.data) {
      saveCachedExerciseStats(data.data);
      return data.data;
    }
    throw new Error(data.error || 'Failed to parse exercise stats payload');
  } catch (error) {
    console.error('Error fetching live exercise stats, showing last known value:', error);
    return getCachedExerciseStats();
  }
};

export const submitExerciseChoice = async (choice: ExerciseChoice): Promise<ExerciseStats> => {
  const deviceToken = getDeviceToken();

  const response = await fetch(`${API_BASE_URL}/exercise/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice, deviceToken }),
  });

  const data: ApiResponse<ExerciseStats> = await response.json();

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.error || 'Failed to record exercise vote');
  }

  saveCachedExerciseStats(data.data);
  return data.data;
};

// ---- Generic wellness check-in API (Water, Sleep, ...) — one factory
// instead of another hand-copied fetch/submit pair per question. ----

const createCheckinApi = (routeSegment: string, storage: typeof waterStorage) => {
  const fetchStats = async (): Promise<CheckinStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeSegment}/stats`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: ApiResponse<CheckinStats> = await response.json();
      if (data.success && data.data) {
        storage.saveCachedStats(data.data);
        return data.data;
      }
      throw new Error(data.error || 'Failed to parse stats payload');
    } catch (error) {
      console.error(`Error fetching ${routeSegment} stats, showing last known value:`, error);
      return storage.getCachedStats();
    }
  };

  const submitChoice = async (choice: CheckinChoice): Promise<CheckinStats> => {
    const deviceToken = getDeviceToken();

    const response = await fetch(`${API_BASE_URL}/${routeSegment}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, deviceToken }),
    });

    const data: ApiResponse<CheckinStats> = await response.json();
    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.error || 'Failed to record vote');
    }

    storage.saveCachedStats(data.data);
    return data.data;
  };

  return { fetchStats, submitChoice };
};

export const waterApi = createCheckinApi('water', waterStorage);
export const sleepApi = createCheckinApi('sleep', sleepStorage);

// ---- AI recipe suggestion — nhập nguyên liệu/giá cả, DeepSeek gợi ý món ăn.
// Rate-limited per device by the backend; remainingToday tells the UI how
// many more suggestions this device can ask for before the VN-midnight reset. ----

export const suggestRecipe = async (
  ingredients: string,
  budget: string,
  lang: 'vi' | 'en'
): Promise<RecipeSuggestionResult> => {
  const deviceToken = getDeviceToken();

  const response = await fetch(`${API_BASE_URL}/recipe/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, budget, deviceToken, lang }),
  });

  const data: ApiResponse<RecipeSuggestionResult> = await response.json();
  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.error || 'Failed to get a recipe suggestion');
  }

  return data.data;
};
