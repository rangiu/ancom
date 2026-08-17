import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  /** Each entry renders as its own paragraph. */
  body: string[];
}

/**
 * Generic "Thông tin hữu ích" modal — static reference content (nutrition,
 * hydration, exercise timing, sleep guidelines), no AI call, no cost. Shared
 * by all four check-ins; only the icon/title/body differ per question.
 */
export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, icon, title, body }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl apple-glass apple-border bg-white dark:bg-zinc-900 text-apple-text dark:text-apple-darkText shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                {icon}
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-secondary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-sm leading-relaxed text-apple-text/90 dark:text-apple-darkText/90">
              {body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-black/5 dark:border-white/10 flex justify-end bg-black/5 dark:bg-white/5">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-apple-accent text-white font-semibold text-sm hover:bg-apple-accentHover transition-colors shadow-sm"
              >
                {t('legal.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
