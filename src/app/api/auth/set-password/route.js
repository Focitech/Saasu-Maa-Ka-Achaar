import { NextResponse } from "next/server";
import {
  sanitizeInput,
  validatePasswordStrength,
  hashPassword,
  getSessionUser,
} from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// POST — set or update password for authenticated user
export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await request.json();
    const password = sanitizeInput(body.password || "");
    const confirmPassword = sanitizeInput(body.confirmPassword || "");

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const { valid, error: strengthError } = validatePasswordStrength(password);
    if (!valid) {
      return NextResponse.json({ error: strengthError }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const passwordHash = await hashPassword(password);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq("id", session.sub);

    if (updateError) {
      console.error("[Set Password Error]", updateError);
      return NextResponse.json({ error: "Failed to update password. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Password set successfully." });
  } catch (err) {
    console.error("[Set Password Error]", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
