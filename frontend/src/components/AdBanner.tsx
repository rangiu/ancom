import React from 'react';
import { useTranslation } from 'react-i18next';

interface AdBannerProps {
  slotId?: string;
  position: 'top' | 'middle' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotId = '1234567890', position }) => {
  const { t } = useTranslation();

  return (
    <div
      id={`adsense-banner-${position}`}
      className="w-full my-6 flex flex-col items-center justify-center"
    >
      <span className="text-[10px] uppercase tracking-wider font-medium text-apple-secondary mb-1">
        {t('adsense.sponsored')}
      </span>
      <div className="w-full max-w-4xl min-h-[90px] p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 flex items-center justify-center text-center transition-all duration-300">
        {/* Real Google AdSense Tag Wrapper */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-9103455158021249'}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="text-xs font-medium text-apple-secondary pointer-events-none">
          {t('adsense.placeholder')} ({position.toUpperCase()})
        </div>
      </div>
    </div>
  );
};
