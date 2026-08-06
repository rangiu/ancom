import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { VoteChoice, VoteStats } from '../types';
import { saveVoteState, recordVoteLocally } from '../lib/storage';
import { StatsDisplay } from './StatsDisplay';
import { Sparkles } from 'lucide-react';

interface QuestionCardProps {
  hasVoted: boolean;
  userChoice: VoteChoice | null;
  stats: VoteStats;
  onVoteSuccess: (newStats: VoteStats, choice: VoteChoice) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  hasVoted,
  userChoice,
  stats,
  onVoteSuccess,
}) => {
  const { t } = useTranslation();

  const handleVote = (choice: VoteChoice) => {
    if (hasVoted) return;

    const newStats = recordVoteLocally(choice);
    saveVoteState(choice);
    onVoteSuccess(newStats, choice);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-4">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="question-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark text-center relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('questionCard.badge')}</span>
            </div>

            {/* Main Question Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight mb-3">
              🍚 {t('questionCard.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-apple-secondary font-normal max-w-md mx-auto mb-8 leading-relaxed">
              {t('questionCard.subtitle')}
            </p>

            {/* Voting Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button 1: Ate Rice */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('ate')}
                id="btn-ate-rice"
                className="group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg shadow-glowRice hover:shadow-xl transition-all duration-300"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  🍚
                </span>
                <span>{t('questionCard.btnAte')}</span>
              </motion.button>

              {/* Button 2: Not Yet */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('not_yet')}
                id="btn-not-yet"
                className="group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-lg shadow-glowNotYet hover:shadow-xl transition-all duration-300"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  😢
                </span>
                <span>{t('questionCard.btnNotYet')}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <StatsDisplay key="stats-card" stats={stats} userChoice={userChoice} />
        )}
      </AnimatePresence>
    </div>
  );
};
