import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetaHead } from '../components/MetaHead';

/** Real, crawlable /terms route — see PrivacyPage.tsx for why this matters. */
export const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MetaHead
        path="/terms"
        titleOverride={`${t('legal.terms.title')} | ${t('header.brand')}`}
        descriptionOverride={t('legal.terms.p1')}
      />
      <div className="w-full max-w-2xl rounded-3xl apple-glass apple-border bg-white dark:bg-zinc-900 text-apple-text dark:text-apple-darkText shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5">
          <FileText className="w-5 h-5 text-apple-accent" />
          <h1 className="text-lg font-bold tracking-tight">{t('legal.terms.title')}</h1>
        </div>
        <p className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
          {t('legal.terms.lastUpdated')}
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-apple-text/90 dark:text-apple-darkText/90">
          <p>{t('legal.terms.p1')}</p>
          <p>{t('legal.terms.p2')}</p>
          <p>{t('legal.terms.p3')}</p>
          <p>{t('legal.terms.p4')}</p>
        </div>
        <Link
          to="/"
          className="inline-block pt-2 text-sm font-semibold text-apple-accent hover:underline underline-offset-4"
        >
          &larr; {t('exercise.library.back')}
        </Link>
      </div>
    </>
  );
};

export default TermsPage;
