import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Users, CheckCircle2, XCircle, Activity, Info } from 'lucide-react';
import { CheckinChoice, CheckinStats, AdviceType } from '../types';
import { ShareButton } from './ShareButton';
import { InfoModal, InfoSection, InfoSource } from './InfoModal';
import { AiAdvisorModal, AdvisorField } from './AiAdvisorModal';

/** Visual identity for one check-in question — keeps every question looking
 * distinct (own color, own emoji) while sharing one implementation. */
export interface CheckinTheme {
  badgeIcon: React.ReactNode;
  badgeClass: string;
  titleEmoji: string;
  yesEmoji: string;
  noEmoji: string;
  yesGradient: string;
  noGradient: string;
}

interface CheckinCardProps {
  /** i18next namespace holding this question's copy, e.g. 'water' or 'sleep'.
   * Also drives the info/advisor translation keys by convention:
   * `${i18nPrefix}.infoBtn`, `.info.title`, `.info.body`, `.advisorBtn`,
   * `.advisor.title`, `.advisor.subtitle`, `.advisor.submitBtn`. */
  i18nPrefix: string;
  theme: CheckinTheme;
  hasVoted: boolean;
  userChoice: CheckinChoice | null;
  stats: CheckinStats;
  onSubmitVote: (choice: CheckinChoice) => Promise<CheckinStats>;
  onVoteSuccess: (newStats: CheckinStats, choice: CheckinChoice) => void;
  /** POST /api/advice/:type this question's AI advisor calls. */
  adviceType: AdviceType;
  /** Field set for that AI advisor's form — differs per question (water asks
   * age+activity, sleep asks hours+issue). */
  advisorFields: AdvisorField[];
}

/**
 * Generic daily yes/no wellness check-in card (vote form + live stats),
 * used for Water and Sleep. Rice and Exercise keep their own hand-written
 * components since they predate this and each grew bespoke copy/behavior —
 * this one exists so a *third* and *fourth* near-identical question don't
 * turn into two more full copy-pasted files.
 */
export const CheckinCard: React.FC<CheckinCardProps> = ({
  i18nPrefix,
  theme,
  hasVoted,
  userChoice,
  stats,
  onSubmitVote,
  onVoteSuccess,
  adviceType,
  advisorFields,
}) => {
  const { t } = useTranslation();
  const [loadingChoice, setLoadingChoice] = useState<CheckinChoice | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  const tt = (key: string) => t(`${i18nPrefix}.${key}`);

  const handleVote = async (choice: CheckinChoice) => {
    if (hasVoted || loadingChoice) return;

    setLoadingChoice(choice);
    setErrorMessage(null);

    try {
      const newStats = await onSubmitVote(choice);
      onVoteSuccess(newStats, choice);
    } catch (err: any) {
      console.error(`${i18nPrefix} voting API error:`, err);
      setErrorMessage(err?.message || t('questionCard.errorGeneric'));
    } finally {
      setLoadingChoice(null);
    }
  };

  const yesPercent = Math.min(100, Math.max(0, stats.percentageYes));
  const noPercent = 100 - yesPercent;

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-4">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key={`${i18nPrefix}-question-card`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark text-center relative overflow-hidden"
          >
            <ShareButton title={tt('title')} className="absolute top-5 right-5" />

            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-6 ${theme.badgeClass}`}>
              {theme.badgeIcon}
              <span>{tt('badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight mb-3">
              {theme.titleEmoji} {tt('title')}
            </h1>

            <p className="text-sm text-apple-secondary font-normal max-w-md mx-auto mb-8 leading-relaxed">
              {tt('subtitle')}
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
                onClick={() => handleVote('yes')}
                disabled={Boolean(loadingChoice)}
                id={`btn-${i18nPrefix}-yes`}
                className={`group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r ${theme.yesGradient} text-white font-bold text-lg shadow-glowRice hover:shadow-xl transition-all duration-300 disabled:opacity-60`}
              >
                {loadingChoice === 'yes' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {theme.yesEmoji}
                    </span>
                    <span>{tt('btnYes')}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleVote('not_yet')}
                disabled={Boolean(loadingChoice)}
                id={`btn-${i18nPrefix}-not-yet`}
                className={`group relative flex items-center justify-center space-x-3 p-5 rounded-2xl bg-gradient-to-r ${theme.noGradient} text-white font-bold text-lg shadow-glowNotYet hover:shadow-xl transition-all duration-300 disabled:opacity-60`}
              >
                {loadingChoice === 'not_yet' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {theme.noEmoji}
                    </span>
                    <span>{tt('btnNotYet')}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`${i18nPrefix}-stats-card`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-apple-accent animate-pulse" />
                <h3 className="text-lg font-bold text-apple-text dark:text-apple-darkText tracking-tight">
                  {tt('stats.title')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator"></span>
                  <span>{t('stats.live')}</span>
                </div>
                <ShareButton title={tt('title')} />
              </div>
            </div>

            {userChoice && (
              <div className="mb-6 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center space-x-2 text-sm font-semibold">
                <span>{tt('alreadyVotedTag')}:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-apple-accent/10 text-apple-accent">
                  {userChoice === 'yes' ? `${theme.yesEmoji} ${tt('btnYes')}` : `${theme.noEmoji} ${tt('btnNotYet')}`}
                </span>
              </div>
            )}

            {Boolean(stats.streak) && (
              <div className="mb-6 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold">
                  🔥 {t('streak.label', { count: stats.streak })}
                </span>
              </div>
            )}

            <div className="mb-8 p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-inner">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight">
                  {yesPercent.toFixed(1)}%
                </span>
                <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
                  {tt('stats.percentageYes')}
                </span>
              </div>
              <p className="text-xs text-apple-secondary mb-4">{tt('stats.ratioLabel')}</p>

              <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden p-0.5 flex">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${theme.yesGradient} shadow-glowRice`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${yesPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${theme.noGradient} shadow-glowNotYet ml-0.5`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${noPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold mt-2 text-apple-secondary">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{theme.yesEmoji} {tt('stats.yesCount')}: {yesPercent.toFixed(1)}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{theme.noEmoji} {tt('stats.noCount')}: {noPercent.toFixed(1)}%</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="flex items-center justify-center mb-1 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
                  {stats.yesCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
                  {tt('stats.yesCount')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                <div className="flex items-center justify-center mb-1 text-rose-500">
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-apple-text dark:text-apple-darkText">
                  {stats.noCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-medium text-apple-secondary mt-0.5 truncate">
                  {tt('stats.noCount')}
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
                  {tt('stats.totalVotes')}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-apple-secondary font-medium">
              ✓ {t('stats.updating')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
        <button
          onClick={() => setInfoOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-semibold text-apple-secondary hover:text-apple-text dark:hover:text-apple-darkText transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          {tt('infoBtn')}
        </button>
        <button
          onClick={() => setAdvisorOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${theme.badgeClass}`}
        >
          {theme.badgeIcon}
          {tt('advisorBtn')}
        </button>
      </div>

      <InfoModal
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        icon={theme.badgeIcon}
        title={tt('info.title')}
        sections={t(`${i18nPrefix}.info.sections`, { returnObjects: true }) as InfoSection[]}
        sources={t(`${i18nPrefix}.info.sources`, { returnObjects: true }) as InfoSource[]}
      />
      <AiAdvisorModal
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
        adviceType={adviceType}
        icon={theme.badgeIcon}
        titleKey={`${i18nPrefix}.advisor.title`}
        subtitleKey={`${i18nPrefix}.advisor.subtitle`}
        submitLabelKey={`${i18nPrefix}.advisor.submitBtn`}
        accentGradient={theme.yesGradient}
        fields={advisorFields}
      />
    </div>
  );
};
