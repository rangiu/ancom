import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './lib/i18n';
import { Layout } from './components/Layout';
import { Analytics } from './components/Analytics';
import { useDarkMode } from './hooks/useDarkMode';
import { HomePage } from './pages/HomePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export const App: React.FC = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <HelmetProvider>
      <Analytics />
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Layout>
    </HelmetProvider>
  );
};

export default App;
