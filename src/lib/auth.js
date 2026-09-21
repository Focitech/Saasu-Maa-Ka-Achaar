import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from './supabase/admin';

export const SESSION_COOKIE_NAME = 'sasumaa_auth_session';
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_COOLDOWN_SECONDS = 60;
export const MAX_OTP_ATTEMPTS = 5;

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'sasumaa_production_grade_secret_salt_2026_bareilly';

// In-Memory Dev Store Fallback (active only when Supabase is not configured locally)
const devOtpStore = new Map();
const devProfileStore = new Map();

/**
 * Generates a cryptographically secure 6-digit numeric OTP.
 */
export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hashes an OTP with HMAC-SHA256 bound to the user's email.
 */
export function hashOtp(email, otp) {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${email.toLowerCase().trim()}:${otp}`)
    .digest('hex');
}

/**
 * Creates a signed session token: base64(payload).signature
 */
export function createSessionToken(user, expiresInHours = 72) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role || 'customer',
    fullName: user.full_name || '',
    phone: user.phone || '',
    exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
    iat: Math.floor(Date.now() / 1000),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a signed session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Retrieves the current authenticated user session from HTTP cookies.
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySessionToken(token);
}

/**
 * Sets the session cookie on a Next.js NextResponse.
 */
export function setSessionCookie(response, token) {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 72 * 3600, // 3 days
  });
}

/**
 * Clears the session cookie.
 */
export function clearSessionCookie(response) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Checks cooldown and persists OTP in Supabase (or fallback dev store).
 */
export async function saveOtp({ email, otp, purpose = 'login' }) {
  const normalizedEmail = email.toLowerCase().trim();
  const otpHash = hashOtp(normalizedEmail, otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    // Dev fallback store
    const existing = devOtpStore.get(normalizedEmail);
    if (existing && existing.createdAt) {
      const elapsedSec = (now.getTime() - existing.createdAt.getTime()) / 1000;
      if (elapsedSec < OTP_COOLDOWN_SECONDS) {
        const remaining = Math.ceil(OTP_COOLDOWN_SECONDS - elapsedSec);
        return {
          cooldown: true,
          remainingSeconds: remaining,
          error: `Please wait ${remaining}s before requesting a new code.`,
        };
      }
    }

    devOtpStore.set(normalizedEmail, {
      otpHash,
      purpose,
      attempts: 0,
      expiresAt,
      createdAt: now,
    });
    return { success: true };
  }

  // Check rate limit / cooldown from Supabase
  const cooldownThreshold = new Date(now.getTime() - OTP_COOLDOWN_SECONDS * 1000).toISOString();
  const { data: recentOtps } = await supabase
    .from('email_otps')
    .select('created_at')
    .eq('email', normalizedEmail)
    .gte('created_at', cooldownThreshold)
    .order('created_at', { ascending: false })
    .limit(1);

  if (recentOtps && recentOtps.length > 0) {
    const lastCreated = new Date(recentOtps[0].created_at).getTime();
    const remaining = Math.ceil(OTP_COOLDOWN_SECONDS - (now.getTime() - lastCreated) / 1000);
    return {
      cooldown: true,
      remainingSeconds: Math.max(1, remaining),
      error: `Please wait ${remaining}s before requesting a new code.`,
    };
  }

  // Delete older expired OTPs for this email to keep table clean
  await supabase
    .from('email_otps')
    .delete()
    .eq('email', normalizedEmail);

  // Insert new OTP record
  const { error: insertError } = await supabase.from('email_otps').insert({
    email: normalizedEmail,
    otp_hash: otpHash,
    purpose,
    attempts: 0,
    expires_at: expiresAt.toISOString(),
  });

  if (insertError) {
    console.error('[Supabase OTP Save Error]', insertError);
    return { success: false, error: 'Database error saving verification code.' };
  }

  return { success: true };
}

/**
 * Validates OTP against stored hash, enforces attempt limits, deletes OTP on success,
 * and retrieves or creates the user profile in Supabase (or dev store).
 */
export async function verifyAndConsumeOtp({ email, otp, purpose = 'login', fullName, phone }) {
  const normalizedEmail = email.toLowerCase().trim();
  const incomingHash = hashOtp(normalizedEmail, otp.trim());
  const now = new Date();

  const supabase = getSupabaseAdmin();

  // 1. Dev Fallback Store handling
  if (!supabase) {
    const record = devOtpStore.get(normalizedEmail);
    if (!record) {
      return { success: false, error: 'No verification code found. Please request a new code.' };
    }

    if (now > record.expiresAt) {
      devOtpStore.delete(normalizedEmail);
      return { success: false, error: 'This code has expired. Please request a new one.' };
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      devOtpStore.delete(normalizedEmail);
      return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
    }

    if (record.otpHash !== incomingHash) {
      record.attempts += 1;
      const remaining = MAX_OTP_ATTEMPTS - record.attempts;
      return {
        success: false,
        error: `Incorrect verification code. ${remaining} attempts remaining.`,
      };
    }

    // Success: Delete OTP immediately (replay prevention)
    devOtpStore.delete(normalizedEmail);

    // Get or create dev profile
    let user = devProfileStore.get(normalizedEmail);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        full_name: fullName || (normalizedEmail.split('@')[0].charAt(0).toUpperCase() + normalizedEmail.split('@')[0].slice(1)),
        phone: phone || '',
        role: 'customer',
        created_at: now.toISOString(),
      };
      devProfileStore.set(normalizedEmail, user);
    } else if (fullName || phone) {
      user.full_name = fullName || user.full_name;
      user.phone = phone || user.phone;
    }

    return { success: true, user };
  }

  // 2. Production Supabase Handling
  const { data: otps, error: fetchError } = await supabase
    .from('email_otps')
    .select('id, otp_hash, attempts, expires_at')
    .eq('email', normalizedEmail)
    .gt('expires_at', now.toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError || !otps || otps.length === 0) {
    return { success: false, error: 'Invalid or expired verification code. Please request a new one.' };
  }

  const activeOtp = otps[0];

  if (activeOtp.attempts >= MAX_OTP_ATTEMPTS) {
    await supabase.from('email_otps').delete().eq('id', activeOtp.id);
    return { success: false, error: 'Maximum attempts reached. Please request a new code.' };
  }

  // Check code match
  if (activeOtp.otp_hash !== incomingHash) {
    // Atomically increment attempt count
    await supabase
      .from('email_otps')
      .update({ attempts: activeOtp.attempts + 1 })
      .eq('id', activeOtp.id);

    const remaining = MAX_OTP_ATTEMPTS - (activeOtp.attempts + 1);
    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Match confirmed: Atomically delete OTP to ensure single-use
  await supabase.from('email_otps').delete().eq('id', activeOtp.id);

  // Find or Create Profile in `profiles`
  const { data: existingProfiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, role, created_at')
    .eq('email', normalizedEmail)
    .limit(1);

  let user = existingProfiles && existingProfiles[0];

  if (!user) {
    const emailPrefix = normalizedEmail.split('@')[0];
    const cleanFallbackName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const newProfile = {
      email: normalizedEmail,
      full_name: fullName || cleanFallbackName,
      phone: phone || null,
      role: 'customer',
      last_login_at: now.toISOString(),
    };

    const { data: created, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('id, email, full_name, phone, role, created_at')
      .single();

    if (createError) {
      console.error('[Supabase Create Profile Error]', createError);
      return { success: false, error: 'Failed to create user profile. Please try again.' };
    }
    user = created;
  } else {
    // Update existing profile with latest login timestamp and any new details
    const updates = {
      last_login_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    if (fullName && !user.full_name) updates.full_name = fullName;
    if (phone && !user.phone) updates.phone = phone;

    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
  }

  return { success: true, user };
}
