import Link from 'next/link';
import { Bike, ArrowUpRight, Route, Flag, Navigation, Settings2, Baby, Wrench, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  color?: string;
}

const categoryIcons: Record<string, typeof Bike> = {
  mtb: ArrowUpRight,
  'road-bike': Route,
  bmx: Bike,
  fixie: Flag,
  'city-bike': Navigation,
  aksesoris: Settings2,
  'sepeda-anak': Baby,
  'suku-cadang': Wrench,
};

const categoryColors: Record<string, string> = {
  mtb: '#F97316',
  'road-bike': '#0284C7',
  bmx: '#EF4444',
  fixie: '#7C3AED',
  'city-bike': '#16A34A',
  'sepeda-anak': '#EC4899',
  aksesoris: '#D97706',
  'suku-cadang': '#64748B',
};

const MAX_VISIBLE = 8;

export function CategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const visible = categories.slice(0, MAX_VISIBLE);
  const hasMore = categories.length > MAX_VISIBLE;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
      {visible.map((cat) => {
        const Icon = categoryIcons[cat.slug] || Bike;
        const color = cat.color || categoryColors[cat.slug] || '#64748B';
        return (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color }} />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-[#0F172A] text-center leading-tight line-clamp-2 max-w-[72px] sm:max-w-none">
              {cat.name}
            </span>
          </Link>
        );
      })}
      {hasMore && (
        <Link
          href="/kategori"
          className="flex flex-col items-center justify-center gap-1.5 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-dashed border-[#E2E8F0] hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all duration-200"
        >
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#F1F5F9] flex items-center justify-center">
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#64748B]" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-[#64748B] text-center leading-tight">
            Lihat Semua
          </span>
        </Link>
      )}
    </div>
  );
}
