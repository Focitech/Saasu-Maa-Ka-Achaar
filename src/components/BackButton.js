'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({
  label = 'Back',
  fallbackHref = '/',
  className = '',
  style = {},
}) {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    // If button specifically designates a destination like Home or Store, navigate directly
    const lowerLabel = label.toLowerCase();
    if (fallbackHref && (lowerLabel.includes('home') || lowerLabel.includes('store') || lowerLabel.includes('order'))) {
      router.push(fallbackHref);
      return;
    }

    const referrer = document.referrer;
    const isSameDomain = referrer && referrer.startsWith(window.location.origin);
    const hasHistoryState = window.history.state && window.history.state.idx > 0;

    if (isSameDomain || hasHistoryState) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`universal-back-btn ${className}`}
      style={style}
      title={`Go back (${label})`}
      aria-label={label}
    >
      <span className="back-arrow-icon" aria-hidden="true">←</span>
      <span className="back-btn-text">{label}</span>
    </button>
  );
}
