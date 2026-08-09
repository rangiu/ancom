import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Target } from 'lucide-react';
import { EXERCISES, Exercise } from '../data/exercises';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExerciseThumb: React.FC<{ exercise: Exercise; lang: 'vi' | 'en'; onClick: () => void }> = ({
  exercise,
  lang,
  onClick,
}) => {
  const [errored, setErrored] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-apple-accent/40 transition-colors"
    >
      <div className="aspect-square overflow-hidden bg-white dark:bg-zinc-900">
        <img
          src={errored ? exercise.image : exercise.gif}
          alt={exercise.name[lang]}
          loading="lazy"
          onError={() => setErrored(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-apple-text dark:text-apple-darkText leading-tight line-clamp-2">
          {exercise.name[lang]}
        </p>
        <p className="text-[10px] text-apple-secondary mt-0.5">{exercise.bodyPart[lang]}</p>
      </div>
    </button>
  );
};

export const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<Exercise | null>(null);
  const lang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const handleClose = () => {
    onClose();
    setSelected(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl apple-glass apple-border bg-white dark:bg-zinc-900 text-apple-text dark:text-apple-darkText shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center space-x-2.5">
              {selected && (
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label={t('exercise.library.back')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold tracking-tight">
                {selected ? selected.name[lang] : t('exercise.library.title')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-secondary transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {!selected ? (
              <>
                <p className="text-xs text-apple-secondary mb-4">{t('exercise.library.subtitle')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {EXERCISES.map((ex) => (
                    <ExerciseThumb key={ex.id} exercise={ex} lang={lang} onClick={() => setSelected(ex)} />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 aspect-video mb-4">
                  <img
                    src={selected.gif}
                    alt={selected.name[lang]}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-apple-accent/10 text-apple-accent text-xs font-medium">
                    {selected.bodyPart[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-apple-secondary text-xs font-medium">
                    <Target className="w-3 h-3" />
                    {selected.target[lang]}
                  </span>
                </div>
                <ol className="space-y-2">
                  {selected.steps[lang].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-apple-secondary leading-relaxed">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-apple-accent/10 text-apple-accent text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
