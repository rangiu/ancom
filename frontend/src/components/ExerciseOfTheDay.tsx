import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Dumbbell, Target } from 'lucide-react';
import { getExerciseOfTheDay } from '../data/exercises';

export const ExerciseOfTheDay: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [gifErrored, setGifErrored] = useState(false);

  // Chọn 1 lần khi component mount — cùng 1 bài trong suốt ngày hôm đó.
  const exercise = useMemo(() => getExerciseOfTheDay(), []);
  const lang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-4">
      <div className="p-6 sm:p-8 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark relative overflow-hidden">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-5 w-fit">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>{t('exercise.ofTheDay.badge')}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-40 shrink-0 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 aspect-square">
            {!gifErrored ? (
              <img
                src={exercise.gif}
                alt={exercise.name[lang]}
                loading="lazy"
                onError={() => setGifErrored(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={exercise.image}
                alt={exercise.name[lang]}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 text-left">
            <h4 className="text-xl font-bold text-apple-text dark:text-apple-darkText tracking-tight">
              {exercise.name[lang]}
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-apple-accent/10 text-apple-accent text-xs font-medium">
                {exercise.bodyPart[lang]}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-apple-secondary text-xs font-medium">
                <Target className="w-3 h-3" />
                {exercise.target[lang]}
              </span>
            </div>

            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-apple-accent"
            >
              {t('exercise.ofTheDay.howTo')}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 space-y-2 overflow-hidden"
            >
              {exercise.steps[lang].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-apple-secondary leading-relaxed">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-apple-accent/10 text-apple-accent text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
