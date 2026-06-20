import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-[#111827] mb-4 font-display">Merek Ternama</h2>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 w-28 h-14 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center px-4 card-hover"
            >
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={80} height={32} className="object-contain max-h-8" loading="lazy" />
              ) : (
                <span className="text-sm font-semibold text-[#6B7280]">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
