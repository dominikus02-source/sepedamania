'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const articleTitles: Record<string, string> = {
  'memilih-sepeda-pertama': 'Panduan Memilih Sepeda Pertama',
  'cara-merawat-sepeda': 'Cara Merawat Sepeda Agar Awet',
  'tips-keamanan-berkendara': 'Tips Keamanan Berkendara',
  'panduan-ukuran-sepeda': 'Panduan Ukuran Sepeda',
};

export function PanduanBreadcrumb({ articles }: { articles?: { slug: string; title: string }[] }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Only show on /panduan/* routes
  if (segments.length < 2 || segments[0] !== 'panduan') return null;

  const isIndex = segments.length === 1;

  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="flex items-center gap-1.5 text-sm text-[#64748B]">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-[#2563EB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
        </li>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <li>
          <Link
            href="/panduan"
            className={`hover:text-[#2563EB] transition-colors ${segments.length === 1 ? 'text-[#0F172A] font-medium' : ''}`}
          >
            Panduan
          </Link>
        </li>
        {segments.length >= 2 && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <li className="text-[#0F172A] font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
              {articleTitles[segments[1]] || 'Artikel'}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
