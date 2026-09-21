import { NextResponse } from "next/server";
import {
  sanitizeInput,
  isValidEmail,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
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
      return NextResponse.json(
        { error: "This account uses OTP login. Please use the Sign in with OTP method." },
        { status: 400 }
      );
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
