import Link from 'next/link';
import Image from 'next/image';

const LEGAL_TABS = [
  { id: 'terms', label: '📜 Terms & Conditions', href: '/terms' },
  { id: 'privacy', label: '🔒 Privacy Policy', href: '/privacy' },
  { id: 'refund', label: '↩️ Refund & Cancellation', href: '/refund' },
  { id: 'shipping', label: '🚚 Shipping & Delivery', href: '/shipping' },
];

export default function LegalLayout({ title, subtitle, activeTab, children }) {
  return (
    <div className="legal-page-wrap">
      {/* Top Navbar */}
      <nav className="legal-top-nav">
        <div className="legal-top-nav-inner">
          <Link href="/" className="legal-brand-link">
            <Image
              src="/images/logo.jpg"
              alt="Saasu Maa Logo"
              width={38}
              height={38}
              style={{ borderRadius: '50%', border: '1.5px solid var(--gold-accent)' }}
            />
            <span className="legal-brand-name">सासू माँ का अचार</span>
          </Link>

          <Link href="/" className="legal-home-btn">
            🏪 Back to Storefront
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="legal-hero">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div className="legal-updated-badge">
          Last Updated: September 2026 • Valid for Saasu Maa&apos;s Food, Bareilly, UP
        </div>
      </header>

      {/* Switcher Tabs */}
      <div className="legal-nav-tabs">
        {LEGAL_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`legal-tab-chip ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Main Content Card */}
      <main className="legal-content-card">
        {children}
      </main>
    </div>
  );
}
