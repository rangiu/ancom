export type VoteChoice = 'ate' | 'not_yet';

export interface VoteStats {
  ateCount: number;
  notAteCount: number;
  totalVotes: number;
  percentageAte: number;
  lastUpdated?: string;
}

export interface UserVoteState {
  hasVoted: boolean;
  choice: VoteChoice | null;
  votedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ---- Exercise ("Hôm nay bạn đã tập thể dục chưa?") ----

export type ExerciseChoice = 'did' | 'not_yet';

export interface ExerciseStats {
  didCount: number;
  notDidCount: number;
  totalVotes: number;
  percentageDid: number;
  lastUpdated?: string;
}

export interface ExerciseVoteState {
  hasVoted: boolean;
  choice: ExerciseChoice | null;
  votedAt?: string;
}
