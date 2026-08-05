import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !type) return null;

  const isPrivacy = type === 'privacy';
  const titleKey = isPrivacy ? 'legal.privacy.title' : 'legal.terms.title';
  const updatedKey = isPrivacy ? 'legal.privacy.lastUpdated' : 'legal.terms.lastUpdated';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl apple-glass apple-border bg-white dark:bg-zinc-900 text-apple-text dark:text-apple-darkText shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center space-x-2.5">
              {isPrivacy ? (
                <ShieldCheck className="w-5 h-5 text-apple-accent" />
              ) : (
                <FileText className="w-5 h-5 text-apple-accent" />
              )}
              <h2 className="text-lg font-bold tracking-tight">{t(titleKey)}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-secondary transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-apple-text/90 dark:text-apple-darkText/90">
            <p className="text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-2">
              {t(updatedKey)}
            </p>

            {isPrivacy ? (
              <>
                <p>{t('legal.privacy.p1')}</p>
                <p>{t('legal.privacy.p2')}</p>
                <p>{t('legal.privacy.p3')}</p>
                <p>{t('legal.privacy.p4')}</p>
              </>
            ) : (
              <>
                <p>{t('legal.terms.p1')}</p>
                <p>{t('legal.terms.p2')}</p>
                <p>{t('legal.terms.p3')}</p>
                <p>{t('legal.terms.p4')}</p>
              </>
            )}
          </div>

          {/* Modal Footer */}
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
    </AnimatePresence>
  );
};
