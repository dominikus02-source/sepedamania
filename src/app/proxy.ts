import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/csrf';

export const { auth } = NextAuth(authConfig);

const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function addSecurityHeaders(response: NextResponse): NextResponse {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-src 'self' https://vercel.live",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '0');

  return response;
}

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!req.auth;
  const isApiRoute = pathname.startsWith('/api/');
  const isApiAdmin = pathname.startsWith('/api/admin');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/masuk') || pathname.startsWith('/daftar');
  const method = req.method;

  // ── Rate limiting for API routes ──────────────────────────
  if (isApiRoute && MUTATING_METHODS.includes(method)) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const rateLimitKey = `${pathname}:${ip}`;

    const limits: Record<string, { max: number; window: number }> = {
      '/api/auth/register': { max: 3, window: 60000 },
      '/api/checkout/create-payment': { max: 10, window: 60000 },
      '/api/vouchers/validate': { max: 20, window: 60000 },
      '/api/webhooks/midtrans': { max: 30, window: 60000 },
    };

    const matchedKey = Object.keys(limits).find((k) => pathname.startsWith(k));
    if (matchedKey) {
      const { max, window: windowMs } = limits[matchedKey];
      if (!checkRateLimit(rateLimitKey, max, windowMs)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }
  }

  // ── CSRF protection for mutating API routes ───────────────
  if (isApiRoute && MUTATING_METHODS.includes(method)) {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // ── Auth redirects ────────────────────────────────────────
  if (isLoggedIn && isAuthRoute) {
    const response = NextResponse.redirect(new URL('/', nextUrl));
    return addSecurityHeaders(response);
  }

  if (isAdminRoute && !isLoggedIn) {
    const response = NextResponse.redirect(new URL('/masuk', nextUrl));
    return addSecurityHeaders(response);
  }

  if (isAdminRoute && isLoggedIn && req.auth?.user?.role !== 'ADMIN') {
    const response = NextResponse.redirect(new URL('/', nextUrl));
    return addSecurityHeaders(response);
  }

  if (isApiAdmin && (!isLoggedIn || req.auth?.user?.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|images).*)'],
};
