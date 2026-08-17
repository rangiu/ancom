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

// ---- Generic daily wellness check-in (Water, Sleep, ...) ----
// Same "vote once per Vietnam-local day" shape as rice/exercise above, just
// with a shared generic schema instead of a bespoke one per question.

export type CheckinChoice = 'yes' | 'not_yet';

export interface CheckinStats {
  yesCount: number;
  noCount: number;
  totalVotes: number;
  percentageYes: number;
  lastUpdated?: string;
}

export interface CheckinVoteState {
  hasVoted: boolean;
  choice: CheckinChoice | null;
  votedAt?: string;
}

// ---- AI advice — one shape, four domains (rice, water, exercise, sleep) ----

export type AdviceType = 'rice' | 'water' | 'exercise' | 'sleep';

export interface AiAdviceResult {
  suggestion: string;
  remainingToday: number;
}
