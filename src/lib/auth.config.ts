import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/masuk',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isAdmin = (auth?.user as any)?.role === 'ADMIN';

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (!isAdmin) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
