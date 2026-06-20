import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isApiAdmin = nextUrl.pathname.startsWith('/api/admin');
  const isAuthRoute = nextUrl.pathname.startsWith('/masuk') || nextUrl.pathname.startsWith('/daftar');

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL('/masuk', nextUrl));
  }

  if (isAdminRoute && isLoggedIn && req.auth?.user?.role !== 'ADMIN') {
    return Response.redirect(new URL('/', nextUrl));
  }

  if (isApiAdmin && (!isLoggedIn || req.auth?.user?.role !== 'ADMIN')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|images).*)'],
};
