import Link from 'next/link';
import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { CategoryChips } from '@/components/customer/category-chips';
import { FlashSale } from '@/components/customer/flash-sale';
import { BrandStrip } from '@/components/customer/brand-strip';
import { ProductCard } from '@/components/customer/product-card';
import { mockCategories, mockBrands, mockProducts } from '@/lib/mock-data';
import { ChevronRight, TrendingUp, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
  description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA.',
};

export const revalidate = 60;

const bestSellers = [...mockProducts].sort((a, b) => b.sold - a.sold).slice(0, 10);
const newArrivals = [...mockProducts].reverse().slice(0, 8);

export default function HomePage() {
  return (
    <div className="space-y-10 pb-8">
      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <HeroBanner />
      </div>

      {/* Category */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0F172A] font-display">Kategori</h2>
          <Link href="/kategori" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
            Lihat Semua
          </Link>
        </div>
        <CategoryChips categories={mockCategories} />
      </section>

      {/* Flash Sale */}
      <section className="px-4 sm:px-6 lg:px-8">
        <FlashSale products={bestSellers.slice(0, 5)} />
      </section>

      {/* Brands */}
      <section className="px-4 sm:px-6 lg:px-8">
        <BrandStrip brands={mockBrands} />
      </section>

      {/* Best Sellers */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0F172A]" />
            <h2 className="text-xl font-bold text-[#0F172A] font-display">Terlaris</h2>
          </div>
          <Link href="/kategori?sort=sold" className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0F172A]" />
            <h2 className="text-xl font-bold text-[#0F172A] font-display">Baru</h2>
          </div>
          <Link href="/kategori?sort=newest" className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
