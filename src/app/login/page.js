"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SpiroSpinner from "@/components/SpiroSpinner";

// ── Client-side input sanitizer (mirrors server-side) ──────────────────────
function sanitize(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/<[^>]*>/g, "");
}

// ── Password strength engine ────────────────────────────────────────────────
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const map = [
    { label: "", color: "" },
    { label: "Very Weak", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
    { label: "Very Strong", color: "#16a34a" },
  ];
  return { score, ...map[score] };
}

// ── Password strength bar ───────────────────────────────────────────────────
function StrengthBar({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="pwd-strength-wrap">
      <div className="pwd-strength-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="pwd-strength-segment"
            style={{ background: i <= score ? color : "rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>
      <span className="pwd-strength-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// ── Main Login Form ─────────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // mode: "otp" | "password"
  const [mode, setMode] = useState("otp");

  // shared
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // OTP mode state
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Password mode state
  const [pwStep, setPwStep] = useState("enter"); // "enter" | "verify-otp" | "create"
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwOtpDigits, setPwOtpDigits] = useState(["", "", "", "", "", ""]);
  const pwOtpRefs = useRef([]);
  const [verifiedUser, setVerifiedUser] = useState(null);

  // ── Cooldown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // ── Auth gate: redirect if already logged in ──────────────────────────────
  useEffect(() => {
    let resolved = false;
    const cached = localStorage.getItem("sasumaa_auth_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u && (u.email || u.id)) {
          resolved = true;
          const target =
            redirectPath && redirectPath !== "/login" && redirectPath !== "/signup"
              ? redirectPath
              : u.role === "admin"
              ? "/admin"
              : "/account";
          router.replace(target);
          return;
        }
      } catch (_) {}
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          resolved = true;
          const target =
            redirectPath && redirectPath !== "/login" && redirectPath !== "/signup"
              ? redirectPath
              : data.user?.role === "admin"
              ? "/admin"
              : "/account";
          router.replace(target);
        } else {
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (!resolved) setIsCheckingAuth(false);
      });
  }, [router, redirectPath]);

  // Clear errors on mode switch
  const switchMode = (m) => {
    setMode(m);
    setErrorMsg("");
    setSuccessMsg("");
    setStep("email");
    setOtpDigits(["", "", "", "", "", ""]);
    setPassword("");
    setConfirmPassword("");
    setPwOtpDigits(["", "", "", "", "", ""]);
    setPwStep("enter");
    setVerifiedUser(null);
  };

  // ── Shared post-login handler ─────────────────────────────────────────────
  function onLoginSuccess(user) {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("sasumaa_auth_user", JSON.stringify(user));
    }
    setSuccessMsg(user?.role === "admin" ? "Welcome Admin! Opening console..." : "Welcome back! Logging you in...");
    const target = user?.role === "admin" ? "/admin" : redirectPath;
    window.location.href = target;
  }

  // ── OTP: Step 1 — Send OTP ────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = sanitize(email).toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.cooldown) { setCooldown(data.remainingSeconds || 60); setStep("otp"); }
        setErrorMsg(data.error || "Failed to send verification code.");
        return;
      }
      setSuccessMsg(`We sent a 6-digit code to ${cleanEmail}`);
      setStep("otp");
      setCooldown(data.cooldownSeconds || 60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setErrorMsg("Network error. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP: Step 2 — Verify OTP ──────────────────────────────────────────────
  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length !== 6) { setErrorMsg("Please enter the full 6-digit code."); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitize(email).toLowerCase(), otp: code, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Verification failed. Please try again."); setIsLoading(false); return; }
      onLoginSuccess(data.user);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMsg("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    const combined = newDigits.join("");
    if (combined.length === 6) handleVerifyOtp(combined);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) { const s = paste.split(""); setOtpDigits(s); handleVerifyOtp(paste); }
  };

  // ── Password login ────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = sanitize(email).toLowerCase();
    const cleanPwd = sanitize(password);
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!cleanPwd || cleanPwd.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPwd }),
      });
      const data = await res.json();

      // OTP-only account detected: OTP was dispatched to email. Transition to verify-otp step.
      if (data.needsPasswordSetup) {
        setPassword("");
        setConfirmPassword("");
        setPwOtpDigits(["", "", "", "", "", ""]);
        setPwStep("verify-otp");
        if (data.cooldown) {
          setCooldown(data.remainingSeconds || 60);
          setSuccessMsg(data.message || `Your account was created via OTP. Enter the 6-digit code sent to ${cleanEmail} to set a password.`);
        } else {
          setCooldown(data.cooldownSeconds || 60);
          setSuccessMsg(data.message || `Your account was created via OTP. We sent a 6-digit verification code to ${cleanEmail}. Verify it to create your password.`);
        }
        setIsLoading(false);
        setTimeout(() => pwOtpRefs.current[0]?.focus(), 100);
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }
      onLoginSuccess(data.user);
    } catch {
      setErrorMsg("Network error. Please check your internet connection.");
      setIsLoading(false);
    }
  };

  // ── Password mode: OTP verification for OTP-only accounts ─────────────────
  const handlePwOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...pwOtpDigits];
    newDigits[index] = value.slice(-1);
    setPwOtpDigits(newDigits);
    setErrorMsg("");
    if (value && index < 5) pwOtpRefs.current[index + 1]?.focus();
    const combined = newDigits.join("");
    if (combined.length === 6) handleVerifyPwOtp(combined);
  };

  const handlePwKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pwOtpDigits[index] && index > 0)
      pwOtpRefs.current[index - 1]?.focus();
  };

  const handlePwPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const s = paste.split("");
      setPwOtpDigits(s);
      handleVerifyPwOtp(paste);
    }
  };

  const handleResendPwOtp = async () => {
    const cleanEmail = sanitize(email).toLowerCase();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.cooldown) { setCooldown(data.remainingSeconds || 60); }
        setErrorMsg(data.error || "Failed to resend verification code.");
        return;
      }
      setSuccessMsg(`A fresh 6-digit code has been sent to ${cleanEmail}`);
      setCooldown(data.cooldownSeconds || 60);
      setPwOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => pwOtpRefs.current[0]?.focus(), 100);
    } catch {
      setErrorMsg("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPwOtp = async (codeToVerify) => {
    const code = codeToVerify || pwOtpDigits.join("");
    if (code.length !== 6) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitize(email).toLowerCase(), otp: code, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Verification failed. Please check the code and try again.");
        setIsLoading(false);
        return;
      }
      // OTP verified successfully! Active session cookie is now set.
      setVerifiedUser(data.user);
      setPwStep("create");
      setPassword("");
      setConfirmPassword("");
      setErrorMsg("");
      setSuccessMsg("Identity verified! Now create a password for your account.");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Setup password for verified OTP-only accounts ────────────────────────
  const handleSetupPassword = async (e) => {
    e.preventDefault();
    const cleanPwd = sanitize(password);
    const cleanConfirm = sanitize(confirmPassword);
    if (!cleanPwd || cleanPwd.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (cleanPwd !== cleanConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: cleanPwd, confirmPassword: cleanConfirm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to set password. Please try again.");
        setIsLoading(false);
        return;
      }
      onLoginSuccess(verifiedUser || { email: sanitize(email).toLowerCase() });
    } catch {
      setErrorMsg("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  // ── Loading gate ──────────────────────────────────────────────────────────
  if (isCheckingAuth) {
    return (
      <div className="auth-page-wrapper">
        <div className="account-loading-box">
          <SpiroSpinner size={76} label="Verifying session..." />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="auth-page-wrapper">
      <div className="auth-glow-top" />
      <div className="auth-glow-bottom" />

      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link href="/" className="auth-brand-logo-link">
            <Image src="/images/logo.jpg" alt="सासू माँ का अचार Logo" width={64} height={64} className="auth-brand-logo-img" priority />
          </Link>
          <h1 className="auth-brand-title">सासू माँ का अचार</h1>
          <p className="auth-brand-subtitle">Saasu Maa&apos;s Food • Traditional Homemade Flavors</p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-heading">Welcome Back</h2>
            <p className="auth-card-desc">Sign in to your account using your preferred method.</p>
          </div>

          {/* Mode Tabs */}
          <div className="login-mode-tabs">
            <button
              type="button"
              className={`login-mode-tab ${mode === "otp" ? "active" : ""}`}
              onClick={() => switchMode("otp")}
            >
              📧 Sign in with OTP
            </button>
            <button
              type="button"
              className={`login-mode-tab ${mode === "password" ? "active" : ""}`}
              onClick={() => switchMode("password")}
            >
              🔐 Sign in with Password
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
          {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

          {/* ── OTP Mode ── */}
          {mode === "otp" && (
            <>
              {step === "email" ? (
                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="auth-field-group">
                    <label htmlFor="login-email" className="auth-label">
                      Email Address <span className="auth-required">*</span>
                    </label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉️</span>
                      <input
                        id="login-email"
                        type="email"
                        required
                        placeholder="e.g. yourname@gmail.com"
                        value={email}
                        onChange={(e) => { setEmail(sanitize(e.target.value)); setErrorMsg(""); }}
                        className="auth-input"
                        disabled={isLoading}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="submit" id="send-otp-btn" className="auth-submit-btn primary-btn" disabled={isLoading}>
                    {isLoading ? <span className="auth-spinner-wrap"><span className="auth-spinner" /> Sending Code...</span> : "Send Verification Code ➔"}
                  </button>
                </form>
              ) : (
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
                    id="verify-otp-btn"
                    onClick={() => handleVerifyOtp()}
                    className="auth-submit-btn primary-btn"
                    disabled={isLoading || otpDigits.join("").length !== 6}
                  >
                    {isLoading ? <span className="auth-spinner-wrap"><span className="auth-spinner" /> Verifying...</span> : "Verify & Log In ➔"}
                  </button>
                  <div className="otp-actions-bar">
                    {cooldown > 0 ? (
                      <span className="otp-cooldown-text">Resend code in <strong>{cooldown}s</strong></span>
                    ) : (
                      <button type="button" onClick={() => handleSendOtp()} className="auth-text-link-btn" disabled={isLoading}>
                        🔄 Resend Code
                      </button>
                    )}
                    <button type="button" onClick={() => { setStep("email"); setErrorMsg(""); setSuccessMsg(""); }} className="auth-text-link-btn">
                      ✏️ Change Email
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Password Mode ── */}
          {mode === "password" && (
            <>
              {pwStep === "enter" && (
                /* Step 1: Normal sign-in form */
                <form onSubmit={handlePasswordLogin} className="auth-form">
                  <div className="auth-field-group">
                    <label htmlFor="pw-email" className="auth-label">
                      Email Address <span className="auth-required">*</span>
                    </label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉️</span>
                      <input
                        id="pw-email"
                        type="email"
                        required
                        placeholder="e.g. yourname@gmail.com"
                        value={email}
                        onChange={(e) => { setEmail(sanitize(e.target.value)); setErrorMsg(""); }}
                        className="auth-input"
                        disabled={isLoading}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="pw-password" className="auth-label">
                      Password <span className="auth-required">*</span>
                    </label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        id="pw-password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                        className="auth-input"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button type="button" className="pwd-toggle-btn" onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button type="submit" id="pw-login-btn" className="auth-submit-btn primary-btn" disabled={isLoading}>
                    {isLoading ? <span className="auth-spinner-wrap"><span className="auth-spinner" /> Signing In...</span> : "Sign In ➔"}
                  </button>

                  <p className="auth-hint-text">
                    Don&apos;t have a password yet?{" "}
                    <button type="button" className="auth-text-link-btn inline" onClick={() => switchMode("otp")}>
                      Log in with OTP instead
                    </button>
                  </p>
                </form>
              )}

              {pwStep === "verify-otp" && (
                /* Step 2: OTP Verification for OTP-only accounts */
                <div className="auth-otp-step">
                  <div className="pw-setup-notice" style={{ marginBottom: "20px" }}>
                    <span className="pw-setup-notice-icon">✉️</span>
                    <div>
                      <strong>Verify Your Identity</strong>
                      <p>
                        Your account <em>{email}</em> was registered with OTP. Please enter the 6-digit code sent to your email to verify your identity before creating a password.
                      </p>
                    </div>
                  </div>

                  <div className="otp-inputs-grid" onPaste={handlePwPaste}>
                    {pwOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (pwOtpRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePwOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handlePwKeyDown(idx, e)}
                        className="otp-digit-input"
                        disabled={isLoading}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    id="pw-verify-otp-btn"
                    onClick={() => handleVerifyPwOtp()}
                    className="auth-submit-btn primary-btn"
                    disabled={isLoading || pwOtpDigits.join("").length !== 6}
                  >
                    {isLoading ? (
                      <span className="auth-spinner-wrap"><span className="auth-spinner" /> Verifying...</span>
                    ) : (
                      "Verify OTP & Continue ➔"
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
                        onClick={handleResendPwOtp}
                        className="auth-text-link-btn"
                        disabled={isLoading}
                      >
                        🔄 Resend Code
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPwStep("enter");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="auth-text-link-btn"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {pwStep === "create" && (
                /* Step 3: Create password step — after OTP is verified */
                <form onSubmit={handleSetupPassword} className="auth-form">
                  <div className="pw-setup-notice">
                    <span className="pw-setup-notice-icon">🔑</span>
                    <div>
                      <strong>Create Your Password</strong>
                      <p>
                        Identity verified! Set a password for <em>{email}</em> so you can sign in with your password anytime.
                      </p>
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="new-password" className="auth-label">
                      New Password <span className="auth-required">*</span>
                    </label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Min 8 chars, uppercase, number, symbol"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                        className="auth-input"
                        disabled={isLoading}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="pwd-toggle-btn"
                        onClick={() => setShowPassword((p) => !p)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide" : "Show"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <StrengthBar password={password} />
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="confirm-password" className="auth-label">
                      Confirm Password <span className="auth-required">*</span>
                    </label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✅</span>
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(""); }}
                        className="auth-input"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="pwd-toggle-btn"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Hide" : "Show"}
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="setup-password-btn"
                    className="auth-submit-btn primary-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="auth-spinner-wrap"><span className="auth-spinner" /> Setting Password...</span>
                    ) : (
                      "Set Password & Complete Login ➔"
                    )}
                  </button>

                  <button
                    type="button"
                    className="auth-text-link-btn"
                    style={{ textAlign: "center", marginTop: "8px" }}
                    onClick={() => {
                      setPwStep("enter");
                      setPassword("");
                      setConfirmPassword("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                  >
                    ← Cancel
                  </button>
                </form>
              )}
            </>
          )}


          {/* Card Footer */}
          <div className="auth-card-footer">
            <p>
              Don&apos;t have an account yet?{" "}
              <Link
                href={redirectPath !== "/" ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : "/signup"}
                className="auth-accent-link"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="auth-home-link-wrap">
          <Link href="/" className="auth-back-home-link">← Back to Saasu Maa Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper"><SpiroSpinner size={76} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
