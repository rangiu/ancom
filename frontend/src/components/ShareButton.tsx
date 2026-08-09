import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Send, MessageCircle, Link2, Check } from 'lucide-react';

interface ShareButtonProps {
  /** Nội dung chia sẻ (tiêu đề câu hỏi khảo sát). */
  title: string;
  className?: string;
}

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ZaloIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} style={{ fontWeight: 800, fontSize: '0.95rem' }}>
    Z
  </span>
);

/**
 * Bảng chia sẻ nổi — render qua Portal thẳng vào `document.body`, định vị
 * bằng toạ độ thật của nút bấm. Cách này để dropdown KHÔNG bị các card cha
 * có `overflow-hidden` (rất phổ biến trong app) cắt mất một phần.
 */
const SharePopover: React.FC<{
  anchorRect: DOMRect;
  platforms: Array<{ name: string; icon: React.ReactNode; href: string; colorClass: string }>;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}> = ({ anchorRect, platforms, copied, onCopy, onClose }) => {
  const { t } = useTranslation();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onClose]);

  const popoverWidth = 208;
  const left = Math.min(Math.max(8, anchorRect.right - popoverWidth), window.innerWidth - popoverWidth - 8);
  const top = anchorRect.bottom + 8;

  return createPortal(
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.15 }}
      style={{ position: 'fixed', top, left, width: popoverWidth, zIndex: 100 }}
      className="rounded-2xl apple-glass apple-border shadow-appleCard dark:shadow-appleCardDark p-2"
    >
      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-apple-secondary">
        {t('share.title')}
      </p>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm text-apple-text dark:text-apple-darkText"
        >
          <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${p.colorClass}`}>
            {p.icon}
          </span>
          {p.name}
        </a>
      ))}
      <button
        type="button"
        onClick={onCopy}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm text-apple-text dark:text-apple-darkText"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 bg-apple-accent/10 text-apple-accent">
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </span>
        {copied ? t('share.copied') : t('share.copyLink')}
      </button>
    </motion.div>,
    document.body
  );
};

export const ShareButton: React.FC<ShareButtonProps> = ({ title, className }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleTriggerClick = async () => {
    // Trên thiết bị hỗ trợ (chủ yếu mobile), dùng khay chia sẻ gốc của hệ điều
    // hành — tự động liệt kê Zalo, Messenger, v.v. nếu đã cài trên máy.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // Người dùng bấm huỷ — không cần xử lý gì thêm.
      }
      return;
    }
    setOpen((v) => !v);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API không khả dụng — bỏ qua, người dùng vẫn thấy link trong URL bar.
    }
  };

  const platforms = [
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-4 h-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      colorClass: 'bg-[#1877F2]/10 text-[#1877F2]',
    },
    {
      name: 'Zalo',
      icon: <ZaloIcon className="text-[#0068FF]" />,
      href: `https://zalo.me/share?u=${encodedUrl}`,
      colorClass: 'bg-[#0068FF]/10 text-[#0068FF]',
    },
    {
      name: 'X (Twitter)',
      icon: <XIcon className="w-3.5 h-3.5" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      colorClass: 'bg-black/10 text-black dark:bg-white/10 dark:text-white',
    },
    {
      name: 'Telegram',
      icon: <Send className="w-4 h-4" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      colorClass: 'bg-[#26A5E4]/10 text-[#26A5E4]',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      colorClass: 'bg-[#25D366]/10 text-[#25D366]',
    },
  ];

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleTriggerClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={t('share.button')}
        className={`flex items-center justify-center w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 text-apple-secondary hover:text-apple-accent transition-colors ${className || ''}`}
      >
        <Share2 className="w-4 h-4" strokeWidth={1.75} />
      </motion.button>

      <AnimatePresence>
        {open && buttonRef.current && (
          <SharePopover
            anchorRect={buttonRef.current.getBoundingClientRect()}
            platforms={platforms}
            copied={copied}
            onCopy={handleCopy}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
