import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-3">Merek pilihan pesepeda Indonesia</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {brands.map((brand, i) => {
          const colors = [
            { bg: '#FEF3C7', text: '#D97706' },
            { bg: '#E0F2FE', text: '#0284C7' },
            { bg: '#FEE2E2', text: '#DC2626' },
            { bg: '#EDE9FE', text: '#7C3AED' },
            { bg: '#DCFCE7', text: '#16A34A' },
          ];
          const c = colors[i % colors.length];
          return (
            <div
              key={brand.id}
              className="flex items-center justify-center h-14 sm:h-16 bg-white rounded-2xl border border-[#E2E8F0] px-4 card-hover hover:border-[#FDE68A]"
            >
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={80} height={32} className="object-contain max-h-8" loading="lazy" />
              ) : (
                <span className="text-sm font-semibold" style={{ color: c.text }}>{brand.name}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
