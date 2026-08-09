import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { VoteStats, VoteChoice } from '../types';
import { ShareButton } from './ShareButton';
import { Users, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface StatsDisplayProps {
  stats: VoteStats;
  userChoice?: VoteChoice | null;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, userChoice }) => {
  const { t } = useTranslation();

  const atePercent = Math.min(100, Math.max(0, stats.percentageAte));
  const notAtePercent = 100 - atePercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto mt-6"
    >
      <div className="p-6 sm:p-8 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark relative overflow-hidden">
        {/* Header Title with Live Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-apple-accent animate-pulse" />
            <h3 className="text-lg font-bold text-apple-text dark:text-apple-darkText tracking-tight">
              {t('stats.title')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator"></span>
              <span>{t('stats.live')}</span>
            </div>
            <ShareButton title={t('questionCard.title')} />
          </div>
        </div>

        {/* User Choice Badge if voted */}
        {userChoice && (
          <div className="mb-6 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center space-x-2 text-sm font-semibold">
            <span>{t('questionCard.alreadyVotedTag')}:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-apple-accent/10 text-apple-accent">
              {userChoice === 'ate' ? `🍚 ${t('questionCard.btnAte')}` : `😢 ${t('questionCard.btnNotYet')}`}
            </span>
          </div>
        )}

        {/* Main Ratio Bar Card */}
        <div className="mb-8 p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-inner">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight">
              {atePercent.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
              {t('stats.percentageAte')}
            </span>
          </div>
          <p className="text-xs text-apple-secondary mb-4">
            {t('stats.ratioLabel')}
          </p>

          {/* Animated Stacked Progress Bar */}
          <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden p-0.5 flex">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-glowRice"
              initial={{ width: '0%' }}
              animate={{ width: `${atePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-500 shadow-glowNotYet ml-0.5"
              initial={{ width: '0%' }}
              animate={{ width: `${notAtePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold mt-2 text-apple-secondary">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>🍚 {t('stats.ateCount')}: {atePercent.toFixed(1)}%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>😢 {t('stats.notAteCount')}: {notAtePercent.toFixed(1)}%</span>
            </span>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Ate Count */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-amber-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.ateCount.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('stats.ateCount')}
            </div>
          </div>

          {/* Card 2: Not Yet Count */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-rose-500">
              <XCircle className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.notAteCount.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('stats.notAteCount')}
            </div>
          </div>

          {/* Card 3: Total Votes */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="flex items-center justify-center mb-1 text-apple-accent">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
              {stats.totalVotes.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
              {t('stats.totalVotes')}
            </div>
          </div>
        </div>

        {/* Live status subtext */}
        <div className="mt-6 text-center text-xs text-apple-secondary font-medium">
          ✓ {t('stats.updating')}
        </div>
      </div>
    </motion.div>
  );
};
