'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-[#E5E5EA] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/images/logo-sepedamania.png" alt="SEPEDAMANIA" width={100} height={24} className="h-6 w-auto object-contain" priority />
          <span className="text-xs text-[#F5A623] font-medium bg-[#F5A623]/10 px-2 py-0.5 rounded-full">Admin</span>
        </Link>
        <span className="text-sm text-[#8E8E93]">/ {displayTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xs text-[#8E8E93] hover:text-[#1C1C1E] flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> Lihat Toko
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-xs font-bold text-white">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
