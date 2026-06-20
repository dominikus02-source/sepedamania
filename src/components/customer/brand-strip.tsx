import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <div>
      <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-3">Merek pilihan pesepeda Indonesia</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex items-center justify-center h-14 sm:h-16 bg-white rounded-2xl border border-[#E2E8F0] px-4 card-hover"
          >
            {brand.logo ? (
              <Image src={brand.logo} alt={brand.name} width={80} height={32} className="object-contain max-h-8" loading="lazy" />
            ) : (
              <span className="text-sm font-semibold text-[#64748B]">{brand.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
