import React, { useEffect, useState } from 'react';
import { Droplet, Moon } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import { ExerciseOfTheDay } from '../components/ExerciseOfTheDay';
import { ExerciseQuestionCard } from '../components/ExerciseQuestionCard';
import { ExerciseLibraryModal } from '../components/ExerciseLibraryModal';
import { CheckinCard, CheckinTheme } from '../components/CheckinCard';
import { AdBanner } from '../components/AdBanner';
import { MetaHead } from '../components/MetaHead';
import { VoteStats, VoteChoice, ExerciseStats, ExerciseChoice, CheckinStats, CheckinChoice } from '../types';
import { fetchVoteStats, fetchExerciseStats, waterApi, sleepApi } from '../lib/api';
import {
  getStoredVoteState,
  getCachedStats,
  saveCachedStats,
  getStoredExerciseVoteState,
  getCachedExerciseStats,
  saveCachedExerciseStats,
  waterStorage,
  sleepStorage,
} from '../lib/storage';

const WATER_THEME: CheckinTheme = {
  badgeIcon: <Droplet className="w-3.5 h-3.5" />,
  badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  titleEmoji: '💧',
  yesEmoji: '💧',
  noEmoji: '🥵',
  yesGradient: 'from-sky-400 to-blue-500',
  noGradient: 'from-amber-400 to-orange-500',
};

const SLEEP_THEME: CheckinTheme = {
  badgeIcon: <Moon className="w-3.5 h-3.5" />,
  badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  titleEmoji: '😴',
  yesEmoji: '😴',
  noEmoji: '🥱',
  yesGradient: 'from-indigo-400 to-violet-500',
  noGradient: 'from-slate-400 to-slate-500',
};

export const HomePage: React.FC = () => {
  // Vote state from storage
  const [userVote, setUserVote] = useState(() => getStoredVoteState());

  // Statistics state initialized from persistent local cache
  const [stats, setStats] = useState<VoteStats>(() => getCachedStats());

  // Exercise question state — fully independent from the rice question above.
  const [exerciseVote, setExerciseVote] = useState(() => getStoredExerciseVoteState());
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(() => getCachedExerciseStats());

  // Water & Sleep check-ins — same independent-per-question pattern as above.
  const [waterVote, setWaterVote] = useState(() => waterStorage.getStoredVoteState());
  const [waterStats, setWaterStats] = useState<CheckinStats>(() => waterStorage.getCachedStats());
  const [sleepVote, setSleepVote] = useState(() => sleepStorage.getStoredVoteState());
  const [sleepStats, setSleepStats] = useState<CheckinStats>(() => sleepStorage.getCachedStats());

  // Exercise Library Modal State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Poll the real backend for live global stats, and independently expire
  // the local "already voted" state at the Vietnam-local day boundary (the
  // backend resets its own counters at that same 00:00 boundary), so the
  // UI stays correct without requiring a manual page reload.
  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      const [freshStats, freshExerciseStats, freshWaterStats, freshSleepStats] = await Promise.all([
        fetchVoteStats(),
        fetchExerciseStats(),
        waterApi.fetchStats(),
        sleepApi.fetchStats(),
      ]);
      if (isMounted) {
        setStats(freshStats);
        setExerciseStats(freshExerciseStats);
        setWaterStats(freshWaterStats);
        setSleepStats(freshSleepStats);
      }
    };

    const refreshVoteState = () => {
      setUserVote(getStoredVoteState());
      setExerciseVote(getStoredExerciseVoteState());
      setWaterVote(waterStorage.getStoredVoteState());
      setSleepVote(sleepStorage.getStoredVoteState());
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

  const handleWaterVoteSuccess = (newStats: CheckinStats, choice: CheckinChoice) => {
    setWaterStats(newStats);
    waterStorage.saveVoteState(choice);
    setWaterVote({ hasVoted: true, choice, votedAt: new Date().toISOString() });
  };

  const handleSleepVoteSuccess = (newStats: CheckinStats, choice: CheckinChoice) => {
    setSleepStats(newStats);
    sleepStorage.saveVoteState(choice);
    setSleepVote({ hasVoted: true, choice, votedAt: new Date().toISOString() });
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

      {/* Water & Sleep Check-ins */}
      <CheckinCard
        i18nPrefix="water"
        theme={WATER_THEME}
        hasVoted={waterVote.hasVoted}
        userChoice={waterVote.choice}
        stats={waterStats}
        onSubmitVote={waterApi.submitChoice}
        onVoteSuccess={handleWaterVoteSuccess}
        adviceType="water"
        advisorFields={[
          {
            key: 'age',
            kind: 'number',
            labelKey: 'water.advisor.ageLabel',
            placeholderKey: 'water.advisor.agePlaceholder',
            maxLength: 10,
            required: true,
          },
          {
            key: 'activityLevel',
            kind: 'select',
            labelKey: 'water.advisor.activityLabel',
            placeholderKey: 'water.advisor.activityLabel',
            required: true,
            options: [
              { value: 'low', labelKey: 'water.advisor.activityOptions.low' },
              { value: 'normal', labelKey: 'water.advisor.activityOptions.normal' },
              { value: 'high', labelKey: 'water.advisor.activityOptions.high' },
            ],
          },
        ]}
      />
      <CheckinCard
        i18nPrefix="sleep"
        theme={SLEEP_THEME}
        hasVoted={sleepVote.hasVoted}
        userChoice={sleepVote.choice}
        stats={sleepStats}
        onSubmitVote={sleepApi.submitChoice}
        onVoteSuccess={handleSleepVoteSuccess}
        adviceType="sleep"
        advisorFields={[
          {
            key: 'currentSleepHours',
            kind: 'number',
            labelKey: 'sleep.advisor.hoursLabel',
            placeholderKey: 'sleep.advisor.hoursPlaceholder',
            maxLength: 10,
            required: true,
          },
          {
            key: 'issue',
            kind: 'select',
            labelKey: 'sleep.advisor.issueLabel',
            placeholderKey: 'sleep.advisor.issueLabel',
            required: true,
            options: [
              { value: 'hard_to_fall_asleep', labelKey: 'sleep.advisor.issueOptions.hard_to_fall_asleep' },
              { value: 'wake_up_early', labelKey: 'sleep.advisor.issueOptions.wake_up_early' },
              { value: 'irregular', labelKey: 'sleep.advisor.issueOptions.irregular' },
              { value: 'none', labelKey: 'sleep.advisor.issueOptions.none' },
            ],
          },
        ]}
      />

      {/* Bottom AdSense Banner */}
      <AdBanner position="bottom" slotId="1000000002" />

      {/* Exercise Library Modal */}
      <ExerciseLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </>
  );
};

export default HomePage;
