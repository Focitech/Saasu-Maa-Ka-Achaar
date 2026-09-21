import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    clearSessionCookie(response);
    return response;
  } catch (err) {
    console.error('[API auth/logout error]', err);
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
  }
}
