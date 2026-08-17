import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export interface InfoSection {
  heading?: string;
  items: string[];
}

export interface InfoSource {
  label: string;
  url: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  sections: InfoSection[];
  /** Credible sources this content is based on (WHO, CDC, NASEM, ...), shown as links. */
  sources?: InfoSource[];
}

/**
 * Generic "Thông tin hữu ích" modal — static reference content (nutrition,
 * hydration, exercise timing, sleep guidelines), no AI call, no cost. Shared
 * by all four check-ins; only the icon/title/sections/sources differ per
 * question. Organized into headed sections (rather than one flat paragraph
 * list) so longer, source-backed content stays scannable.
 */
export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, icon, title, sections, sources }) => {
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

            <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed text-apple-text/90 dark:text-apple-darkText/90">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h3 className="text-xs font-bold uppercase tracking-wider text-apple-accent mb-2">
                      {section.heading}
                    </h3>
                  )}
                  <ul className="space-y-1.5 list-disc list-outside pl-4 marker:text-apple-secondary/50">
                    {section.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {sources && sources.length > 0 && (
                <div className="pt-3 border-t border-black/5 dark:border-white/10">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-2">
                    {t('infoCommon.sourcesLabel')}
                  </h3>
                  <ul className="space-y-1">
                    {sources.map((src, i) => (
                      <li key={i}>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-apple-accent hover:underline underline-offset-2"
                        >
                          {src.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-apple-secondary/70">{t('infoCommon.disclaimer')}</p>
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
