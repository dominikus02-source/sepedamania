import NextAuth from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Prisma } from '@prisma/client';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { authStoreUsers } from './auth-store';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

// Demo accounts for development/fallback only
function getDemoUsers(): Map<string, { name: string; password: string; role: string }> {
  const users = new Map<string, { name: string; password: string; role: string }>();
  users.set('sepedamania7@gmail.com', {
    name: 'Super Admin SEPEDAMANIA',
    password: bcrypt.hashSync('admin123', 12),
    role: 'ADMIN',
  });
  users.set('admin@sepedamania.com', {
    name: 'Admin SEPEDAMANIA',
    password: bcrypt.hashSync('admin123', 12),
    role: 'ADMIN',
  });
  users.set('user@sepedamania.com', {
    name: 'User Sepedamania',
    password: bcrypt.hashSync('user123', 12),
    role: 'CUSTOMER',
  });
  return users;
}

let adapter: Adapter | undefined = undefined;
try {
  adapter = PrismaAdapter(prisma);
} catch {
  // Database not available — will use demo accounts
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/masuk',
    newUser: '/daftar',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const plainPassword = credentials.password as string;

        // Check demo accounts first
        const demo = getDemoUsers().get(email);
        if (demo) {
          const isValid = bcrypt.compareSync(plainPassword, demo.password);
          if (!isValid) return null;

          return {
            id: email,
            email,
            name: demo.name,
            role: demo.role,
            image: null,
            emailVerified: null,
          };
        }

        // Try database for non-demo accounts
        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !user.password) return null;

          if (user.lockedUntil && new Date() < user.lockedUntil) {
            const remainingMs = user.lockedUntil.getTime() - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            throw new Error(`Akun terkunci. Coba lagi dalam ${remainingMin} menit.`);
          }

          const isValid = await bcrypt.compare(plainPassword, user.password);

          if (!isValid) {
            const attempts = (user.failedLoginAttempts ?? 0) + 1;
            const updateData: Record<string, unknown> = { failedLoginAttempts: attempts };
            if (attempts >= MAX_FAILED_ATTEMPTS) {
              updateData.lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
            }
            await prisma.user.update({ where: { id: user.id }, data: updateData as Prisma.UserUpdateInput });
            return null;
          }

          if (user.failedLoginAttempts || user.lockedUntil) {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: 0, lockedUntil: null },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
          };
        } catch {
          // Database unavailable — check shared in-memory store
          const fallbackUser = authStoreUsers.find((u) => u.email === email);
          if (fallbackUser) {
            const isValid = bcrypt.compareSync(plainPassword, fallbackUser.password);
            if (!isValid) return null;
            return {
              id: email,
              email,
              name: fallbackUser.name,
              role: 'CUSTOMER',
              image: null,
              emailVerified: null,
            };
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        token.emailVerified = session.emailVerified;
        return token;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
});
