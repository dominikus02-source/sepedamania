import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    emailVerified: Date | null;
    failedLoginAttempts?: number;
    lockedUntil?: Date | null;
    totpEnabled?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    emailVerified: Date | null;
  }
}
