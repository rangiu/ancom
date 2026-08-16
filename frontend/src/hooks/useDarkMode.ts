import { useEffect, useState } from 'react';

/**
 * Dark mode state with system preference auto-detection, persisted to
 * localStorage. Extracted out of App.tsx so every route (Home, Privacy,
 * Terms, ...) can share the exact same theme instead of resetting on
 * navigation.
 */
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ancom_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ancom_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ancom_theme', 'light');
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
};
