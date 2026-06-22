'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Bike, Wrench, Shield, Ruler } from 'lucide-react';

const articleIcons: Record<string, React.ReactNode> = {
  'memilih-sepeda-pertama': <Bike className="w-4 h-4" />,
  'cara-merawat-sepeda': <Wrench className="w-4 h-4" />,
  'tips-keamanan-berkendara': <Shield className="w-4 h-4" />,
  'panduan-ukuran-sepeda': <Ruler className="w-4 h-4" />,
};

interface Article {
  slug: string;
  title: string;
  description: string;
}

export function PanduanSidebar({ articles }: { articles: Article[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto scrollbar-hide pb-2 lg:pb-0" aria-label="Panduan navigation">
      {/* "Semua Panduan" link — visible on mobile in the scroll, hidden on desktop (shown as heading) */}
      <Link
        href="/panduan"
        className={cn(
          'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors lg:hidden',
          pathname === '/panduan'
            ? 'bg-[#F5A623]/10 text-[#F5A623]'
            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
        )}
      >
        <Bike className="w-4 h-4" />
        Semua Panduan
      </Link>

      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/panduan/${article.slug}`}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
            pathname === `/panduan/${article.slug}`
              ? 'bg-[#F5A623]/10 text-[#F5A623] lg:bg-[#F5A623]/10 lg:text-[#F5A623] lg:border-l-2 lg:border-[#F5A623] lg:rounded-l-none lg:rounded-r-xl'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          )}
        >
          <span className="hidden sm:inline">{articleIcons[article.slug]}</span>
          <span className="truncate">{article.title}</span>
        </Link>
      ))}
    </nav>
  );
}
