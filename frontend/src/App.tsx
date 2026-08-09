import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './lib/i18n';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { ExerciseOfTheDay } from './components/ExerciseOfTheDay';
import { ExerciseQuestionCard } from './components/ExerciseQuestionCard';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { MetaHead } from './components/MetaHead';
import { VoteStats, VoteChoice, ExerciseStats, ExerciseChoice } from './types';
import { fetchVoteStats, fetchExerciseStats } from './lib/api';
import {
  getStoredVoteState,
  getCachedStats,
  saveCachedStats,
  getStoredExerciseVoteState,
  getCachedExerciseStats,
  saveCachedExerciseStats,
} from './lib/storage';

export const App: React.FC = () => {
  // Dark mode state with system preference auto-detection
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ancom_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ancom_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ancom_theme', 'light');
    }
  }, [darkMode]);

  // Vote state from storage
  const [userVote, setUserVote] = useState(() => getStoredVoteState());

  // Statistics state initialized from persistent local cache
  const [stats, setStats] = useState<VoteStats>(() => getCachedStats());

  // Exercise question state — fully independent from the rice question above.
  const [exerciseVote, setExerciseVote] = useState(() => getStoredExerciseVoteState());
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(() => getCachedExerciseStats());

  // Legal Modal State
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

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
    <HelmetProvider>
      <MetaHead />
      <div className="min-h-screen flex flex-col bg-apple-bg dark:bg-apple-darkBg text-apple-text dark:text-apple-darkText transition-colors duration-300">
        {/* Navigation Header */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center items-center">
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
          {!exerciseVote.hasVoted && <ExerciseOfTheDay />}
          <ExerciseQuestionCard
            hasVoted={exerciseVote.hasVoted}
            userChoice={exerciseVote.choice}
            stats={exerciseStats}
            onVoteSuccess={handleExerciseVoteSuccess}
          />

          {/* Bottom AdSense Banner */}
          <AdBanner position="bottom" slotId="1000000002" />
        </main>

        {/* Footer */}
        <Footer onOpenLegal={(type) => setModalType(type)} />

        {/* Legal Policy Modals */}
        <LegalModal
          isOpen={Boolean(modalType)}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      </div>
    </HelmetProvider>
  );
};

export default App;
