import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Loads gtag.js and reports page views on every route change — but only if
 * VITE_GA_MEASUREMENT_ID is actually configured. With no ID set this
 * component does nothing, so local dev and any deploy without a GA4
 * property stays exactly as before (no script injected, no tracking).
 */
export const Analytics: React.FC = () => {
  const location = useLocation();

  // Inject gtag.js once, on mount, only when an ID is configured.
  useEffect(() => {
    if (!GA_ID || document.getElementById('ga4-gtag-script')) return;

    const script = document.createElement('script');
    script.id = 'ga4-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    // Send the initial page_view ourselves (see effect below) instead of
    // letting the default config call double-fire it on route changes.
    window.gtag('config', GA_ID, { send_page_view: false });
  }, []);

  // Report a page_view on every route change (including the first one).
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
};

export default Analytics;
