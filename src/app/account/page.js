'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SpiroSpinner from '@/components/SpiroSpinner';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace('/login?redirect=/account');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.replace('/login?redirect=/account');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sasumaa_auth_user');
      }
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-page-wrapper">
        <div className="account-loading-box">
          <SpiroSpinner size={76} label="Loading your profile..." />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="auth-page-wrapper">
      <div className="auth-glow-top"></div>
      <div className="auth-glow-bottom"></div>

      <div className="auth-container account-container">
        {/* Header */}
        <div className="auth-brand-header">
          <Link href="/" className="auth-brand-logo-link">
            <Image
              src="/images/logo.jpg"
              alt="सासू माँ का अचार Logo"
              width={56}
              height={56}
              className="auth-brand-logo-img"
              priority
            />
          </Link>
          <h1 className="auth-brand-title">My Account</h1>
          <p className="auth-brand-subtitle">Saasu Maa&apos;s Food • Customer Portal</p>
        </div>

        {/* Profile Card */}
        <div className="auth-card account-card">
          <div className="account-avatar-banner">
            <div className="account-avatar">
              {(user.fullName ? user.fullName[0] : user.email[0]).toUpperCase()}
            </div>
            <div className="account-meta">
              <h2 className="account-name">{user.fullName || 'Valued Customer'}</h2>
              <span className="account-badge">✓ Verified Member</span>
            </div>
          </div>

          <div className="account-info-grid">
            <div className="account-info-tile">
              <span className="account-info-label">Email Address</span>
              <span className="account-info-value">{user.email}</span>
            </div>

            <div className="account-info-tile">
              <span className="account-info-label">Phone</span>
              <span className="account-info-value">{user.phone || 'Not provided'}</span>
            </div>

            <div className="account-info-tile">
              <span className="account-info-label">Account Role</span>
              <span className="account-info-value account-role-badge">
                {user.role === 'admin' ? '🛡️ Administrator' : '👤 Customer'}
              </span>
            </div>

            <div className="account-info-tile">
              <span className="account-info-label">Delivery Hub</span>
              <span className="account-info-value">📍 Bareilly, Uttar Pradesh</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="account-actions-section">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="primary-btn"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #aa8010 100%)',
                  color: '#1a0407',
                  fontWeight: '800',
                  textAlign: 'center',
                  textDecoration: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #ffe699',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                }}
              >
                🛡️ Open Admin Management Console
              </Link>
            )}

            <Link href="/#varieties" className="primary-btn account-order-btn">
              🛍️ Order Homemade Achar
            </Link>

            <a
              href="https://wa.me/918979319003?text=Namaste%20Saasu%20Maa%2C%20I%20have%20an%20order%20query"
              target="_blank"
              rel="noopener noreferrer"
              className="account-whatsapp-btn"
            >
              💬 WhatsApp Concierge
            </a>
          </div>

          {/* Logout Button */}
          <div className="account-logout-wrapper">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="account-logout-btn"
            >
              {isLoggingOut ? 'Logging out...' : '🚪 Sign Out of Account'}
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="auth-home-link-wrap">
          <Link href="/" className="auth-back-home-link">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
