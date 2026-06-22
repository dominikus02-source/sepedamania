import Link from 'next/link';
import { Bike, ArrowUpRight, Route, Flag, Navigation, Settings2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

const categoryIcons: Record<string, typeof Bike> = {
  mtb: ArrowUpRight,
  'road-bike': Route,
  bmx: Bike,
  fixie: Flag,
  'city-bike': Navigation,
  aksesoris: Settings2,
};

const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  mtb: { bg: '#FEF3C7', icon: '#F97316', border: '#FDE68A' },
  'road-bike': { bg: '#E0F2FE', icon: '#0284C7', border: '#BAE6FD' },
  bmx: { bg: '#FEE2E2', icon: '#EF4444', border: '#FECACA' },
  fixie: { bg: '#EDE9FE', icon: '#7C3AED', border: '#DDD6FE' },
  'city-bike': { bg: '#DCFCE7', icon: '#16A34A', border: '#BBF7D0' },
  aksesoris: { bg: '#FEF3C7', icon: '#D97706', border: '#FDE68A' },
};

export function CategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.slug] || Bike;
        const colors = categoryColors[cat.slug] || { bg: '#F1F5F9', icon: '#64748B', border: '#E2E8F0' };
        return (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-white rounded-2xl border border-[#E2E8F0] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: colors.bg }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: colors.icon }} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#0F172A] text-center">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
