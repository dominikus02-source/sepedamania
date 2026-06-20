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

export function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.slug] || Bike;
        return (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-white rounded-2xl border border-[#E2E8F0] hover:shadow-md hover:border-[#0F172A]/20 transition-all duration-200"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#64748B]" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#0F172A] text-center">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
