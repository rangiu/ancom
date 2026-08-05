import { VoteStats, VoteChoice, ApiResponse } from '../types';
import { getDeviceToken, getCachedStats, saveCachedStats } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchVoteStats = async (): Promise<VoteStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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
    // Return cached stats instead of resetting to hardcoded default
    return getCachedStats();
  }
};

export const submitVoteChoice = async (choice: VoteChoice): Promise<VoteStats> => {
  const deviceToken = getDeviceToken();

  try {
    const response = await fetch(`${API_BASE_URL}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        choice,
        deviceToken,
      }),
    });

    const data: ApiResponse<VoteStats> = await response.json();

    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.error || 'Failed to record vote');
    }

    saveCachedStats(data.data);
    return data.data;
  } catch (err) {
    // Offline / Standalone Fallback: Increment local stats persistently
    const current = getCachedStats();
    const newAte = choice === 'ate' ? current.ateCount + 1 : current.ateCount;
    const newNotAte = choice === 'not_yet' ? current.notAteCount + 1 : current.notAteCount;
    const newTotal = current.totalVotes + 1;
    const newPercentage = Number(((newAte / newTotal) * 100).toFixed(1));

    const updated: VoteStats = {
      ateCount: newAte,
      notAteCount: newNotAte,
      totalVotes: newTotal,
      percentageAte: newPercentage,
      lastUpdated: new Date().toISOString(),
    };

    saveCachedStats(updated);
    return updated;
  }
};
