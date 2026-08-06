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
