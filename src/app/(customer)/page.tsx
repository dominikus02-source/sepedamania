import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { CategoryChips } from '@/components/customer/category-chips';
import { FlashSale } from '@/components/customer/flash-sale';
import { BrandStrip } from '@/components/customer/brand-strip';
import { ProductCard } from '@/components/customer/product-card';
import { mockCategories, mockBrands, mockProducts } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
  description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA. Harga terbaik, original, pengiriman ke seluruh Indonesia.',
  openGraph: {
    title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
    description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
};

export const dynamic = 'force-dynamic';

const bestSellers = [...mockProducts].sort((a, b) => b.sold - a.sold).slice(0, 10);
const newArrivals = [...mockProducts].reverse().slice(0, 8);

export default function HomePage() {
  return (
    <div className="space-y-6 pb-6">
      <HeroBanner />
      <section className="px-4">
        <CategoryChips categories={mockCategories} />
      </section>
      <FlashSale products={bestSellers.slice(0, 5)} />
      <BrandStrip brands={mockBrands} />
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C1C1E]">Terlaris</h2>
          <button className="text-xs text-[#F5A623] font-medium">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[160px] max-w-[160px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C1C1E]">Baru</h2>
          <button className="text-xs text-[#F5A623] font-medium">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} variant="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
}
