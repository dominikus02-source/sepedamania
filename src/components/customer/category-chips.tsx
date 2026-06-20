import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 pb-1">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-1.5 min-w-[72px]"
          >
            <div className="w-16 h-16 rounded-full bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center text-xs font-medium text-[#1C1C1E] hover:border-[#F5A623] transition-colors">
              <span className="text-center px-1 leading-tight text-[10px]">{cat.name}</span>
            </div>
            <span className="text-[11px] text-[#8E8E93] font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
