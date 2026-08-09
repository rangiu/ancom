import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExerciseStats, ExerciseChoice } from '../types';
import { Users, CheckCircle2, XCircle, Activity, LayoutGrid } from 'lucide-react';

interface ExerciseStatsDisplayProps {
  stats: ExerciseStats;
  userChoice?: ExerciseChoice | null;
  onOpenLibrary?: () => void;
}

export const ExerciseStatsDisplay: React.FC<ExerciseStatsDisplayProps> = ({ stats, userChoice, onOpenLibrary }) => {
  const { t } = useTranslation();

  const didPercent = Math.min(100, Math.max(0, stats.percentageDid));
  const notDidPercent = 100 - didPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto mt-6"
    >
      <div className="p-6 sm:p-8 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-apple-accent animate-pulse" />
            <h3 className="text-lg font-bold text-apple-text dark:text-apple-darkText tracking-tight">
              {t('exercise.stats.title')}
            </h3>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator"></span>
            <span>{t('stats.live')}</span>
          </div>
        </div>

        {userChoice && (
          <div className="mb-6 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center space-x-2 text-sm font-semibold">
            <span>{t('exercise.alreadyVotedTag')}:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-apple-accent/10 text-apple-accent">
              {userChoice === 'did' ? `💪 ${t('exercise.btnDid')}` : `🛌 ${t('exercise.btnNotYet')}`}
            </span>
          </div>
        )}

        <div className="mb-8 p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-inner">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight">
              {didPercent.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
              {t('exercise.stats.percentageDid')}
            </span>
          </div>
          <p className="text-xs text-apple-secondary mb-4">{t('exercise.stats.ratioLabel')}</p>

          <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden p-0.5 flex">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-glowRice"
              initial={{ width: '0%' }}
              animate={{ width: `${didPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500 shadow-glowNotYet ml-0.5"
              initial={{ width: '0%' }}
              animate={{ width: `${notDidPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold mt-2 text-apple-secondary">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                💪 {t('exercise.stats.didCount')}: {didPercent.toFixed(1)}%
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>
                🛌 {t('exercise.stats.notDidCount')}: {notDidPercent.toFixed(1)}%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.didCount.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('exercise.stats.didCount')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-slate-500">
              <XCircle className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.notDidCount.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('exercise.stats.notDidCount')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-apple-accent">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.totalVotes.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('exercise.stats.totalVotes')}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-center text-xs text-apple-secondary font-medium">
          <span>✓ {t('stats.updating')}</span>
          {onOpenLibrary && (
            <button onClick={onOpenLibrary} className="flex items-center gap-1 font-semibold text-apple-accent">
              <LayoutGrid className="w-3 h-3" />
              {t('exercise.library.viewAll')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
