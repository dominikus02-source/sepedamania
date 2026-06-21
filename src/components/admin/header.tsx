'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface AdminUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export function AdminHeader({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const title = pathname.split('/').filter(Boolean).pop() || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-sm font-bold text-[#0F172A]">Sepedamania</span>
          <span className="text-[10px] text-[#2563EB] font-medium bg-[#EFF6FF] px-1.5 py-0.5 rounded-md">Admin</span>
        </Link>
        <span className="text-sm text-[#94A3B8]">/ {displayTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xs text-[#94A3B8] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Lihat Toko
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-xs font-bold text-white">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
