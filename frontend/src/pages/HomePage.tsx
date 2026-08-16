import React, { useEffect, useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { ExerciseOfTheDay } from '../components/ExerciseOfTheDay';
import { ExerciseQuestionCard } from '../components/ExerciseQuestionCard';
import { ExerciseLibraryModal } from '../components/ExerciseLibraryModal';
import { AdBanner } from '../components/AdBanner';
import { MetaHead } from '../components/MetaHead';
import { VoteStats, VoteChoice, ExerciseStats, ExerciseChoice } from '../types';
import { fetchVoteStats, fetchExerciseStats } from '../lib/api';
import {
  getStoredVoteState,
  getCachedStats,
  saveCachedStats,
  getStoredExerciseVoteState,
  getCachedExerciseStats,
  saveCachedExerciseStats,
} from '../lib/storage';

export const HomePage: React.FC = () => {
  // Vote state from storage
  const [userVote, setUserVote] = useState(() => getStoredVoteState());

  // Statistics state initialized from persistent local cache
  const [stats, setStats] = useState<VoteStats>(() => getCachedStats());

  // Exercise question state — fully independent from the rice question above.
  const [exerciseVote, setExerciseVote] = useState(() => getStoredExerciseVoteState());
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(() => getCachedExerciseStats());

  // Exercise Library Modal State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Poll the real backend for live global stats, and independently expire
  // the local "already voted" state at the Vietnam-local day boundary (the
  // backend resets its own counters at that same 00:00 boundary), so the
  // UI stays correct without requiring a manual page reload.
  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      const [freshStats, freshExerciseStats] = await Promise.all([fetchVoteStats(), fetchExerciseStats()]);
      if (isMounted) {
        setStats(freshStats);
        setExerciseStats(freshExerciseStats);
      }
    };

    const refreshVoteState = () => {
      setUserVote(getStoredVoteState());
      setExerciseVote(getStoredExerciseVoteState());
    };

    loadStats();
    refreshVoteState();

    const statsInterval = setInterval(loadStats, 10000);
    const dayCheckInterval = setInterval(refreshVoteState, 30000);
    window.addEventListener('focus', loadStats);

    return () => {
      isMounted = false;
      clearInterval(statsInterval);
      clearInterval(dayCheckInterval);
      window.removeEventListener('focus', loadStats);
    };
  }, []);

  const handleVoteSuccess = (newStats: VoteStats, choice: VoteChoice) => {
    saveCachedStats(newStats);
    setStats(newStats);
    setUserVote({
      hasVoted: true,
      choice,
      votedAt: new Date().toISOString(),
    });
  };

  const handleExerciseVoteSuccess = (newStats: ExerciseStats, choice: ExerciseChoice) => {
    saveCachedExerciseStats(newStats);
    setExerciseStats(newStats);
    setExerciseVote({
      hasVoted: true,
      choice,
      votedAt: new Date().toISOString(),
    });
  };

  return (
    <>
      <MetaHead />

      {/* Top AdSense Banner */}
      <AdBanner position="top" slotId="1000000001" />

      {/* Central Question & Statistics Card */}
      <QuestionCard
        hasVoted={userVote.hasVoted}
        userChoice={userVote.choice}
        stats={stats}
        onVoteSuccess={handleVoteSuccess}
      />

      {/* Exercise Question & Daily Suggestion */}
      {!exerciseVote.hasVoted && <ExerciseOfTheDay onOpenLibrary={() => setIsLibraryOpen(true)} />}
      <ExerciseQuestionCard
        hasVoted={exerciseVote.hasVoted}
        userChoice={exerciseVote.choice}
        stats={exerciseStats}
        onVoteSuccess={handleExerciseVoteSuccess}
        onOpenLibrary={() => setIsLibraryOpen(true)}
      />

      {/* Bottom AdSense Banner */}
      <AdBanner position="bottom" slotId="1000000002" />

      {/* Exercise Library Modal */}
      <ExerciseLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </>
  );
};

export default HomePage;
