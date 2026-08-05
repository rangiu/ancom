import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const MetaHead: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'vi';

  const siteTitle = t('site.title');
  const siteDescription = t('site.description');
  const currentUrl = 'https://ancom.vercel.app/';

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content="https://ancom.vercel.app/og-image.png" />
      <meta property="og:locale" content={currentLang === 'vi' ? 'vi_VN' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content="https://ancom.vercel.app/og-image.png" />

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};
