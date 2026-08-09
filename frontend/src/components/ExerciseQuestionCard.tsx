import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseChoice, ExerciseStats } from '../types';
import { submitExerciseChoice } from '../lib/api';
import { saveExerciseVoteState } from '../lib/storage';
import { ExerciseStatsDisplay } from './ExerciseStatsDisplay';
import { Loader2, Flame } from 'lucide-react';

interface ExerciseQuestionCardProps {
  hasVoted: boolean;
  userChoice: ExerciseChoice | null;
  stats: ExerciseStats;
  onVoteSuccess: (newStats: ExerciseStats, choice: ExerciseChoice) => void;
}

export const ExerciseQuestionCard: React.FC<ExerciseQuestionCardProps> = ({
  hasVoted,
  userChoice,
  stats,
  onVoteSuccess,
}) => {
  const { t } = useTranslation();
  const [loadingChoice, setLoadingChoice] = useState<ExerciseChoice | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVote = async (choice: ExerciseChoice) => {
    if (hasVoted || loadingChoice) return;

    setLoadingChoice(choice);
    setErrorMessage(null);

    try {
      const newStats = await submitExerciseChoice(choice);
      saveExerciseVoteState(choice);
      onVoteSuccess(newStats, choice);
    } catch (err: any) {
      console.error('Exercise voting API error:', err);
      setErrorMessage(err?.message || t('questionCard.errorGeneric'));
    } finally {
      setLoadingChoice(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-4">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="exercise-question-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark text-center relative overflow-hidden"
          >
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-6">
              <Flame className="w-3.5 h-3.5" />
              <span>{t('exercise.badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight mb-3">
              💪 {t('exercise.title')}
            </h1>

            <p className="text-sm text-apple-secondary font-normal max-w-md mx-auto mb-8 leading-relaxed">
              {t('exercise.subtitle')}
            </p>

            {errorMessage && (
              <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('did')}
                disabled={Boolean(loadingChoice)}
                id="btn-exercise-did"
                className="group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-lg shadow-glowRice hover:shadow-xl transition-all duration-300 disabled:opacity-60"
              >
                {loadingChoice === 'did' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">💪</span>
                    <span>{t('exercise.btnDid')}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('not_yet')}
                disabled={Boolean(loadingChoice)}
                id="btn-exercise-not-yet"
                className="group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r from-slate-400 to-slate-500 text-white font-bold text-lg shadow-glowNotYet hover:shadow-xl transition-all duration-300 disabled:opacity-60"
              >
                {loadingChoice === 'not_yet' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🛌</span>
                    <span>{t('exercise.btnNotYet')}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <ExerciseStatsDisplay key="exercise-stats-card" stats={stats} userChoice={userChoice} />
        )}
      </AnimatePresence>
    </div>
  );
};
