import { VoteStats, VoteChoice, ApiResponse } from '../types';
import { getDeviceToken } from './storage';

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
      return data.data;
    }
    throw new Error(data.error || 'Failed to parse stats payload');
  } catch (error) {
    console.warn('API error fetching stats, using fallback defaults:', error);
    return {
      ateCount: 1248,
      notAteCount: 312,
      totalVotes: 1560,
      percentageAte: 80.0,
      lastUpdated: new Date().toISOString(),
    };
  }
};

export const submitVoteChoice = async (choice: VoteChoice): Promise<VoteStats> => {
  const deviceToken = getDeviceToken();

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

  return data.data;
};
