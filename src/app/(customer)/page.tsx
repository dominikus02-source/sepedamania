import Link from 'next/link';
import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { CategoryChips } from '@/components/customer/category-chips';
import { FlashSale } from '@/components/customer/flash-sale';
import { BrandStrip } from '@/components/customer/brand-strip';
import { ProductCard } from '@/components/customer/product-card';
import { mockCategories, mockBrands, mockProducts } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
  description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA. Harga terbaik, original, pengiriman ke seluruh Indonesia.',
  openGraph: {
    title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
    description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
};

export const revalidate = 60;

const bestSellers = [...mockProducts].sort((a, b) => b.sold - a.sold).slice(0, 10);
const newArrivals = [...mockProducts].reverse().slice(0, 8);

export default function HomePage() {
  return (
    <div className="space-y-8 pb-8">
      <HeroBanner />

      <section className="px-4 sm:px-6 lg:px-8">
        <CategoryChips categories={mockCategories} />
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <FlashSale products={bestSellers.slice(0, 5)} />
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <BrandStrip brands={mockBrands} />
      </section>

      {/* Best Sellers */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#111827] font-display">Terlaris</h2>
          <Link href="/kategori?sort=sold" className="flex items-center gap-1 text-sm font-medium text-[#0EA5E9] hover:text-[#0284C7] transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[170px] sm:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#111827] font-display">Baru</h2>
          <Link href="/kategori?sort=newest" className="flex items-center gap-1 text-sm font-medium text-[#0EA5E9] hover:text-[#0284C7] transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
