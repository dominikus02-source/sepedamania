import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold text-[#1C1C1E] mb-3">Merek Ternama</h2>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 w-24 h-12 rounded-lg bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center px-3"
            >
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={80} height={32} className="object-contain" />
              ) : (
                <span className="text-xs font-semibold text-[#8E8E93]">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
