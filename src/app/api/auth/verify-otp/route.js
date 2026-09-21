import { NextResponse } from 'next/server';
import { verifyAndConsumeOtp, createSessionToken, setSessionCookie, sanitizeInput, isValidEmail } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body.email || '').toLowerCase();
    const otp = sanitizeInput(String(body.otp || ''));
    const purpose = sanitizeInput(body.purpose || 'login') === 'signup' ? 'signup' : 'login';
    const fullName = sanitizeInput(body.fullName || '');
    const phone = sanitizeInput(body.phone || '');

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit numeric code.' },
        { status: 400 }
      );
    }

    const verifyResult = await verifyAndConsumeOtp({
      email,
      otp: cleanOtp,
      purpose,
      fullName,
      phone,
    });

    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error },
        { status: 400 }
      );
    }

    const { user } = verifyResult;

    // Issue signed session token
    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    setSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error('[API verify-otp error]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying code.' },
      { status: 500 }
    );
  }
}
