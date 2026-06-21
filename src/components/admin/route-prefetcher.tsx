'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES_PRELOAD } from '@/config/admin-navigation';

export function AdminRoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      ADMIN_ROUTES_PRELOAD.forEach((route) => router.prefetch(route));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
