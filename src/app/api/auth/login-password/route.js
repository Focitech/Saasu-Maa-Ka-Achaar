import { NextResponse } from "next/server";
import {
  sanitizeInput,
  isValidEmail,
  verifyPassword,
  generateOtp,
  saveOtp,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { sendOtpEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = sanitizeInput(body.email || "").toLowerCase();
    const password = sanitizeInput(body.password || "");

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, password_hash, is_active")
      .eq("email", email)
      .limit(1);

    if (fetchError || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const user = profiles[0];

    if (!user.is_active) {
      return NextResponse.json({ error: "Your account has been suspended. Contact support." }, { status: 403 });
    }

    if (!user.password_hash) {
      // User signed up via OTP and hasn't created a password yet.
      // Automatically send OTP to verify their identity before allowing password setup.
      const otp = generateOtp();
      const saveResult = await saveOtp({ email: user.email, otp, purpose: "login" });

      if (!saveResult.success) {
        if (saveResult.cooldown) {
          return NextResponse.json({
            needsPasswordSetup: true,
            cooldown: true,
            remainingSeconds: saveResult.remainingSeconds,
            email: user.email,
            message: `Please enter the 6-digit code sent to ${user.email} to verify your identity.`,
          });
        }
        return NextResponse.json({ error: saveResult.error || "Failed to generate verification code." }, { status: 500 });
      }

      const emailResult = await sendOtpEmail({ email: user.email, otp, purpose: "login" });
      if (!emailResult.success) {
        return NextResponse.json({ error: emailResult.error || "Failed to deliver verification email." }, { status: 500 });
      }

      return NextResponse.json({
        needsPasswordSetup: true,
        otpSent: true,
        email: user.email,
        cooldownSeconds: 60,
        message: `Your account was created via OTP. We sent a 6-digit verification code to ${user.email}. Verify it to set your password.`,
      });
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    await supabase
      .from("profiles")
      .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", user.id);

    const sessionUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
    };

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({ success: true, user: sessionUser });
    setSessionCookie(response, token);
    return response;
  } catch (err) {
    console.error("[Login Password Error]", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
