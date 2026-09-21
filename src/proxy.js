import { NextResponse } from 'next/server';

/**
 * Decodes base64url string in Edge-compatible standard Web API
 */
function decodeBase64Url(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;
  const sessionToken = request.cookies.get('sasumaa_auth_session')?.value;

  // Protect /login and /signup from already authenticated users
  if (sessionToken && (pathname === '/login' || pathname === '/signup')) {
    try {
      const [payloadB64] = sessionToken.split('.');
      if (payloadB64) {
        const payloadJson = decodeBase64Url(payloadB64);
        const payload = JSON.parse(payloadJson);
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp > now) {
          const redirectParam = searchParams.get('redirect');
          let target = payload.role === 'admin' ? '/admin' : '/account';

          if (
            redirectParam &&
            redirectParam.startsWith('/') &&
            !redirectParam.startsWith('/login') &&
            !redirectParam.startsWith('/signup')
          ) {
            target = redirectParam;
          }

          return NextResponse.redirect(new URL(target, request.url));
        }
      }
    } catch (err) {
      // Invalid token format - proceed to login/signup normally
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};
