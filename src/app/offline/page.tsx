'use client';

import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E2E8F0] p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-5">
          <WifiOff className="w-7 h-7 text-[#64748B]" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Kamu sedang offline</h1>
        <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
          Beberapa fitur belanja membutuhkan internet.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="mt-3 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
