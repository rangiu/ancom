import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-auto py-8 border-t border-black/5 dark:border-white/10 text-xs text-apple-secondary transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <div className="text-center sm:text-left font-medium">
          {t('footer.copyright')}
        </div>

        {/* Right: Legal links */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onOpenLegal('privacy')}
            id="footer-link-privacy"
            className="hover:text-apple-text dark:hover:text-apple-darkText transition-colors underline-offset-4 hover:underline"
          >
            {t('legal.privacyPolicy')}
          </button>
          <span className="opacity-30">•</span>
          <button
            onClick={() => onOpenLegal('terms')}
            id="footer-link-terms"
            className="hover:text-apple-text dark:hover:text-apple-darkText transition-colors underline-offset-4 hover:underline"
          >
            {t('legal.termsOfService')}
          </button>
        </div>
      </div>
    </footer>
  );
};
