/**
 * Shared in-memory store for fallback auth users.
 * Used by both register route and authorize callback when database is unavailable.
 */
export interface AuthStoreUser {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

export const authStoreUsers: AuthStoreUser[] = [];
