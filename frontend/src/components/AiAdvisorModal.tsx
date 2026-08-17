import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';
import { AdviceType } from '../types';
import { getAiAdvice } from '../lib/api';

export interface AdvisorFieldOption {
  value: string;
  labelKey: string;
}

export interface AdvisorField {
  key: string;
  kind: 'textarea' | 'text' | 'number' | 'select';
  labelKey: string;
  placeholderKey?: string;
  options?: AdvisorFieldOption[];
  maxLength?: number;
  required?: boolean;
}

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  adviceType: AdviceType;
  icon: React.ReactNode;
  titleKey: string;
  subtitleKey: string;
  submitLabelKey: string;
  accentGradient: string;
  fields: AdvisorField[];
}

/**
 * Generic "AI tư vấn" modal — one form-driven component reused for all four
 * check-ins (rice/water/exercise/sleep), each with its own field set and
 * DeepSeek prompt on the backend (POST /api/advice/:type). Only the fields
 * and copy differ per question; the request/loading/result/error/quota
 * handling is identical, so it lives here once instead of four times.
 */
export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  adviceType,
  icon,
  titleKey,
  subtitleKey,
  submitLabelKey,
  accentGradient,
  fields,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);

  const setValue = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const payload: Record<string, string> = {};
      for (const f of fields) payload[f.key] = (values[f.key] || '').trim();

      const data = await getAiAdvice(adviceType, payload, lang);
      setResult(data.suggestion);
      setRemainingToday(data.remainingToday);
    } catch (err: any) {
      console.error(`AI advice (${adviceType}) error:`, err);
      setErrorMessage(err?.message || t('advisorCommon.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

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
                <h2 className="text-lg font-bold tracking-tight">{t(titleKey)}</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-secondary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-apple-secondary leading-relaxed mb-5">{t(subtitleKey)}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label
                      htmlFor={`advisor-field-${f.key}`}
                      className="block text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-1.5"
                    >
                      {t(f.labelKey)}
                    </label>

                    {f.kind === 'textarea' && (
                      <textarea
                        id={`advisor-field-${f.key}`}
                        value={values[f.key] || ''}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        placeholder={f.placeholderKey ? t(f.placeholderKey) : undefined}
                        maxLength={f.maxLength}
                        rows={2}
                        required={f.required}
                        className="w-full p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-apple-text dark:text-apple-darkText placeholder:text-apple-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-accent/40 resize-none"
                      />
                    )}

                    {(f.kind === 'text' || f.kind === 'number') && (
                      <input
                        id={`advisor-field-${f.key}`}
                        type={f.kind}
                        value={values[f.key] || ''}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        placeholder={f.placeholderKey ? t(f.placeholderKey) : undefined}
                        maxLength={f.maxLength}
                        required={f.required}
                        className="w-full p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-apple-text dark:text-apple-darkText placeholder:text-apple-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-accent/40"
                      />
                    )}

                    {f.kind === 'select' && (
                      <select
                        id={`advisor-field-${f.key}`}
                        value={values[f.key] || ''}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        required={f.required}
                        className="w-full p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-apple-text dark:text-apple-darkText focus:outline-none focus:ring-2 focus:ring-apple-accent/40"
                      >
                        <option value="" disabled>
                          {f.placeholderKey ? t(f.placeholderKey) : '—'}
                        </option>
                        {f.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r ${accentGradient} text-white font-bold text-sm shadow-glowRice hover:shadow-xl transition-all duration-300 disabled:opacity-60`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('advisorCommon.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t(submitLabelKey)}
                    </>
                  )}
                </motion.button>
              </form>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20"
                >
                  <h3 className="text-sm font-bold text-apple-text dark:text-apple-darkText mb-2">
                    ✨ {t('advisorCommon.resultTitle')}
                  </h3>
                  <p className="text-sm text-apple-text/90 dark:text-apple-darkText/90 leading-relaxed whitespace-pre-line">
                    {result}
                  </p>
                  {remainingToday !== null && (
                    <p className="mt-4 text-[11px] text-apple-secondary font-medium">
                      {t('advisorCommon.remainingToday', { count: remainingToday })}
                    </p>
                  )}
                </motion.div>
              )}

              <p className="mt-4 text-[11px] text-apple-secondary/70 leading-relaxed">
                {t('advisorCommon.disclaimer')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
