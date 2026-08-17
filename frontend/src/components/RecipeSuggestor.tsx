import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChefHat, Loader2, Sparkles } from 'lucide-react';
import { suggestRecipe } from '../lib/api';

/**
 * "Nguyên liệu hiện có + giá cả -> AI gợi ý món ăn" — a real, recurring-use
 * utility feature (as opposed to a one-tap daily vote), backed by DeepSeek.
 * Rate-limited server-side per device/day; remainingToday only becomes known
 * after the first successful call this session.
 */
export const RecipeSuggestor: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const [ingredients, setIngredients] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !ingredients.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await suggestRecipe(ingredients.trim(), budget.trim(), lang);
      setResult(data.suggestion);
      setRemainingToday(data.remainingToday);
    } catch (err: any) {
      console.error('Recipe suggestion error:', err);
      setErrorMessage(err?.message || t('recipe.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 sm:p-8 rounded-3xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark relative overflow-hidden"
      >
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold mb-4">
          <ChefHat className="w-3.5 h-3.5" />
          <span>{t('recipe.badge')}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-apple-text dark:text-apple-darkText tracking-tight mb-2">
          🧑‍🍳 {t('recipe.title')}
        </h2>
        <p className="text-sm text-apple-secondary leading-relaxed mb-6">{t('recipe.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipe-ingredients" className="block text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-1.5">
              {t('recipe.ingredientsLabel')}
            </label>
            <textarea
              id="recipe-ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={t('recipe.ingredientsPlaceholder')}
              maxLength={300}
              rows={2}
              className="w-full p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-apple-text dark:text-apple-darkText placeholder:text-apple-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-accent/40 resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="recipe-budget" className="block text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-1.5">
              {t('recipe.budgetLabel')}
            </label>
            <input
              id="recipe-budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t('recipe.budgetPlaceholder')}
              maxLength={50}
              className="w-full p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-apple-text dark:text-apple-darkText placeholder:text-apple-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-accent/40"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !ingredients.trim()}
            id="btn-suggest-recipe"
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-sm shadow-glowRice hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('recipe.loading')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t('recipe.submitBtn')}
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
            <h3 className="text-sm font-bold text-apple-text dark:text-apple-darkText mb-2 flex items-center gap-1.5">
              🍽️ {t('recipe.resultTitle')}
            </h3>
            <p className="text-sm text-apple-text/90 dark:text-apple-darkText/90 leading-relaxed whitespace-pre-line">
              {result}
            </p>
            {remainingToday !== null && (
              <p className="mt-4 text-[11px] text-apple-secondary font-medium">
                {t('recipe.remainingToday', { count: remainingToday })}
              </p>
            )}
          </motion.div>
        )}

        <p className="mt-4 text-[11px] text-apple-secondary/70 leading-relaxed">{t('recipe.disclaimer')}</p>
      </motion.div>
    </div>
  );
};
