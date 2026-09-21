import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    let role = session.role;
    let fullName = session.fullName;
    let phone = session.phone;

    // Fetch live profile so role promotion reflects immediately on browser refresh
    const adminClient = getSupabaseAdmin();
    if (adminClient && session.email) {
      try {
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role, full_name, phone')
          .eq('email', session.email.toLowerCase().trim())
          .maybeSingle();

        if (profile) {
          role = profile.role || role;
          fullName = profile.full_name || fullName;
          phone = profile.phone || phone;
        }
      } catch (dbErr) {
        console.warn('Live profile fetch fallback to session');
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.sub,
        email: session.email,
        fullName,
        phone,
        role,
      },
    });
  } catch (err) {
    console.error('[API auth/me error]', err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
