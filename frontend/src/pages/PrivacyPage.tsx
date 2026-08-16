import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetaHead } from '../components/MetaHead';

/**
 * Real, crawlable /privacy route (not a JS-only modal). AdSense's site
 * reviewer and search crawlers need an actual indexable URL to find this
 * content — a modal that only ever appears on top of "/" doesn't give them
 * one.
 */
export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MetaHead
        path="/privacy"
        titleOverride={`${t('legal.privacy.title')} | ${t('header.brand')}`}
        descriptionOverride={t('legal.privacy.p1')}
      />
      <div className="w-full max-w-2xl rounded-3xl apple-glass apple-border bg-white dark:bg-zinc-900 text-apple-text dark:text-apple-darkText shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-apple-accent" />
          <h1 className="text-lg font-bold tracking-tight">{t('legal.privacy.title')}</h1>
        </div>
        <p className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
          {t('legal.privacy.lastUpdated')}
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-apple-text/90 dark:text-apple-darkText/90">
          <p>{t('legal.privacy.p1')}</p>
          <p>{t('legal.privacy.p2')}</p>
          <p>{t('legal.privacy.p3')}</p>
          <p>{t('legal.privacy.p4')}</p>
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

export default PrivacyPage;
