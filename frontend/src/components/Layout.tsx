import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  children: React.ReactNode;
}

/**
 * Shared page chrome (Header + Footer) used by every route so Home, Privacy
 * and Terms all look and feel like the same site, not three disconnected
 * pages.
 */
export const Layout: React.FC<LayoutProps> = ({ darkMode, setDarkMode, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-apple-bg dark:bg-apple-darkBg text-apple-text dark:text-apple-darkText transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};
