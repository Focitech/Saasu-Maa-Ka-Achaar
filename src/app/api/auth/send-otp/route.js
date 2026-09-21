import { NextResponse } from 'next/server';
import { generateOtp, saveOtp } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/resend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, purpose = 'login' } = body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPurpose = purpose === 'signup' ? 'signup' : 'login';

    // 1. Generate 6-digit OTP
    const otp = generateOtp();

    // 2. Persist with cooldown check
    const saveResult = await saveOtp({
      email: cleanEmail,
      otp,
      purpose: cleanPurpose,
    });

    if (!saveResult.success) {
      if (saveResult.cooldown) {
        return NextResponse.json(
          {
            success: false,
            cooldown: true,
            remainingSeconds: saveResult.remainingSeconds,
            error: saveResult.error,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, error: saveResult.error || 'Failed to generate code.' },
        { status: 500 }
      );
    }

    // 3. Send via Resend
    const emailResult = await sendOtpEmail({
      email: cleanEmail,
      otp,
      purpose: cleanPurpose,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Unable to deliver verification email. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      cooldownSeconds: 60,
    });
  } catch (err) {
    console.error('[API send-otp error]', err);
    return NextResponse.json(
      { success: false, error: 'Server error processing request. Please try again.' },
      { status: 500 }
    );
  }
}
