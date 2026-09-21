'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import SpiroSpinner from '@/components/SpiroSpinner';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Check if already logged in (localStorage first for 0ms, then verify with API)
  useEffect(() => {
    let resolved = false;
    const cached = localStorage.getItem('sasumaa_auth_user');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u && (u.email || u.id)) {
          resolved = true;
          const target =
            redirectPath && redirectPath !== '/login' && redirectPath !== '/signup'
              ? redirectPath
              : u.role === 'admin'
              ? '/admin'
              : '/account';
          router.replace(target);
          return;
        }
      } catch (e) {}
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          resolved = true;
          const target =
            redirectPath && redirectPath !== '/login' && redirectPath !== '/signup'
              ? redirectPath
              : data.user?.role === 'admin'
              ? '/admin'
              : '/account';
          router.replace(target);
        } else {
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (!resolved) {
          setIsCheckingAuth(false);
        }
      });
  }, [router, redirectPath]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          purpose: 'signup',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.cooldown) {
          setCooldown(data.remainingSeconds || 60);
          setStep('otp');
        }
        setErrorMsg(data.error || 'Failed to send verification code.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(`We sent a 6-digit code to ${email}`);
      setStep('otp');
      setCooldown(data.cooldownSeconds || 60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMsg('Network error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Box Typing
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMsg('');

    // Advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    const combined = newDigits.join('');
    if (combined.length === 6) {
      handleVerifyOtp(combined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const split = pasteData.split('');
      setOtpDigits(split);
      handleVerifyOtp(pasteData);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: code,
          purpose: 'signup',
          fullName: fullName.trim(),
          phone: phone.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Verification failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('sasumaa_auth_user', JSON.stringify(data.user));
      }

      setSuccessMsg('Account created successfully! Taking you in...');
      window.location.href = redirectPath;
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="auth-page-wrapper">
        <div className="account-loading-box">
          <SpiroSpinner size={76} label="Verifying session..." />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-glow-top"></div>
      <div className="auth-glow-bottom"></div>

      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link href="/" className="auth-brand-logo-link">
            <Image
              src="/images/logo.jpg"
              alt="सासू माँ का अचार Logo"
              width={64}
              height={64}
              className="auth-brand-logo-img"
              priority
            />
          </Link>
          <h1 className="auth-brand-title">सासू माँ का अचार</h1>
          <p className="auth-brand-subtitle">Join the Saasu Maa Family • Pure Authentic Flavors</p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-heading">
              {step === 'details' ? 'Create Your Account' : 'Verify Your Email'}
            </h2>
            <p className="auth-card-desc">
              {step === 'details'
                ? 'Sign up in seconds. We will send a secure one-time code to your email.'
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {/* Feedback alerts */}
          {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
          {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

          {step === 'details' ? (
            /* STEP 1: Details Form */
            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="auth-field-group">
                <label htmlFor="signup-name" className="auth-label">
                  Full Name <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrorMsg('');
                    }}
                    className="auth-input"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label htmlFor="signup-email" className="auth-label">
                  Email Address <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    placeholder="e.g. ramesh@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    className="auth-input"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label htmlFor="signup-phone" className="auth-label">
                  Phone Number <span className="auth-optional">(Optional, for delivery updates)</span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">📞</span>
                  <input
                    id="signup-phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                className="auth-submit-btn primary-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-spinner-wrap">
                    <span className="auth-spinner"></span> Sending Code...
                  </span>
                ) : (
                  'Continue with Email OTP ➔'
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP Verification */
            <div className="auth-otp-step">
              <div className="otp-inputs-grid" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="otp-digit-input"
                    disabled={isLoading}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="button"
                id="signup-verify-btn"
                onClick={() => handleVerifyOtp()}
                className="auth-submit-btn primary-btn"
                disabled={isLoading || otpDigits.join('').length !== 6}
              >
                {isLoading ? (
                  <span className="auth-spinner-wrap">
                    <span className="auth-spinner"></span> Creating Account...
                  </span>
                ) : (
                  'Verify & Create Account ➔'
                )}
              </button>

              <div className="otp-actions-bar">
                {cooldown > 0 ? (
                  <span className="otp-cooldown-text">
                    Resend code in <strong>{cooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="auth-text-link-btn"
                    disabled={isLoading}
                  >
                    🔄 Resend Code
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="auth-text-link-btn"
                >
                  ✏️ Edit Details
                </button>
              </div>
            </div>
          )}

          {/* Switch to Login */}
          <div className="auth-card-footer">
            <p>
              Already have an account?{' '}
              <Link
                href={redirectPath !== '/' ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login'}
                className="auth-accent-link"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="auth-home-link-wrap">
          <Link href="/" className="auth-back-home-link">
            ← Back to Saasu Maa Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page-wrapper">
          <SpiroSpinner size={76} />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

