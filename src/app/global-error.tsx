'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#1C1C1E] mb-2">Terjadi Kesalahan</h1>
          <p className="text-sm text-[#64748B] mb-6">Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#F5A623] text-white rounded-xl font-medium hover:bg-[#E09600] transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
