import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import viTranslation from '../locales/vi.json';

const resources = {
  en: { translation: enTranslation },
  vi: { translation: viTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['vi', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ancom_user_language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
