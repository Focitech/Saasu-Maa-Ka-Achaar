import { NextResponse } from "next/server";
import {
  sanitizeInput,
  isValidEmail,
  validatePasswordStrength,
  hashPassword,
  verifyAndConsumeOtp,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/auth/setup-password
 * Atomic OTP verification and password creation for accounts created via OTP.
 * Requires: email, otp (6-digit), password, confirmPassword.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const email = sanitizeInput(body.email || "").toLowerCase();
    const otp = sanitizeInput(String(body.otp || "")).trim();
    const password = sanitizeInput(body.password || "");
    const confirmPassword = sanitizeInput(body.confirmPassword || "");

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit verification code." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const { valid, error: strengthError } = validatePasswordStrength(password);
    if (!valid) {
      return NextResponse.json({ error: strengthError }, { status: 400 });
    }

    // 1. Securely verify and consume the OTP (prevents replays and brute-force)
    const verifyResult = await verifyAndConsumeOtp({
      email,
      otp,
      purpose: "login",
    });

    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.error }, { status: 400 });
    }

    const user = verifyResult.user;

    // 2. Hash the new password securely
    const passwordHash = await hashPassword(password);

    // 3. Atomically update the user's password in database
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          password_hash: passwordHash,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("[Setup Password Error]", updateError);
        return NextResponse.json({ error: "Failed to save password. Please try again." }, { status: 500 });
      }
    }

    // 4. Issue authenticated session token & cookie
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name || user.fullName || "",
      phone: user.phone || "",
      role: user.role || "customer",
    };

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({
      success: true,
      message: "Password created successfully. Logging you in...",
      user: sessionUser,
    });

    setSessionCookie(response, token);
    return response;
  } catch (err) {
    console.error("[Setup Password Route Error]", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
