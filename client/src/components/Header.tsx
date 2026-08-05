import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ancom_user_language', lang);
  };

  const currentLang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  return (
    <header className="sticky top-0 z-40 w-full apple-glass apple-border border-b border-x-0 border-t-0 shadow-sm transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            🍚
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-apple-text dark:text-apple-darkText">
              {t('header.brand')}
            </span>
            <span className="text-xs text-apple-secondary font-medium hidden sm:block">
              {t('header.tagline')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="relative inline-flex items-center p-1 rounded-2xl bg-gray-200/60 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10">
            <button
              onClick={() => changeLanguage('vi')}
              id="lang-vi-btn"
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentLang === 'vi'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
              aria-label="Chuyển sang Tiếng Việt"
            >
              <span className="text-sm">🇻🇳</span>
              <span>VI</span>
            </button>

            <button
              onClick={() => changeLanguage('en')}
              id="lang-en-btn"
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentLang === 'en'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              <span className="text-sm">🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          {/* Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            id="dark-mode-toggle-btn"
            className="w-9 h-9 rounded-2xl bg-gray-200/60 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-300/60 dark:hover:bg-zinc-700 transition-colors duration-200"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
