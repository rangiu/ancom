import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const MetaHead: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const siteTitle = t('site.title');
  const siteDescription = t('site.description');
  const baseUrl = 'https://ancom-coral.vercel.app/';

  const keywords = currentLang === 'vi'
    ? 'hôm nay bạn đã ăn cơm chưa, ăn cơm, dự án ăn cơm, điểm danh ăn cơm, thống kê ăn cơm, eat rice, have you eaten rice today, hôm nay bạn đã tập thể dục chưa, bài tập thể dục tại nhà, thư viện bài tập'
    : 'have you eaten rice today, eat rice, global rice checkin, rice community, daily rice checkin, have you exercised today, home workout exercises, bodyweight exercise library';

  // Schema.org Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Dự Án Ăn Cơm | Eat Rice Project',
    'url': baseUrl,
    'description': siteDescription,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'inLanguage': [
      { '@type': 'Language', 'name': 'Vietnamese', 'alternateName': 'vi' },
      { '@type': 'Language', 'name': 'English', 'alternateName': 'en' }
    ],
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': currentLang === 'vi' ? 'Hôm nay bạn đã ăn cơm chưa?' : 'Have you eaten rice today?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': currentLang === 'vi'
              ? 'Điểm danh hàng ngày cùng hàng triệu người trên thế giới với câu hỏi: Hôm nay bạn đã ăn cơm chưa?'
              : 'Join millions worldwide in answering the daily question: Have you eaten rice today?'
          }
        },
        {
          '@type': 'Question',
          'name': currentLang === 'vi' ? 'Hôm nay bạn đã tập thể dục chưa?' : 'Have you exercised today?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': currentLang === 'vi'
              ? 'Điểm danh vận động mỗi ngày, xem gợi ý bài tập không cần dụng cụ và duyệt thư viện 40 bài tập tại nhà.'
              : 'Check in daily on movement, see a no-equipment exercise suggestion, and browse a library of 40 home workout exercises.'
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={`${baseUrl}og-image.png`} />
      <meta property="og:locale" content={currentLang === 'vi' ? 'vi_VN' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={baseUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={`${baseUrl}og-image.png`} />

      {/* Canonical and Alternate Language Links */}
      <link rel="canonical" href={baseUrl} />
      <link rel="alternate" hrefLang="vi" href={`${baseUrl}?lang=vi`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* JSON-LD Rich Snippet Script */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
