import Link from 'next/link';
import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { CategoryChips } from '@/components/customer/category-chips';
import { FlashSale } from '@/components/customer/flash-sale';
import { BrandStrip } from '@/components/customer/brand-strip';
import { ProductCard } from '@/components/customer/product-card';
import { Container, Section, SectionHeader } from '@/components/ui/container';
import { mockCategories, mockBrands, mockProducts } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
  description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA.',
};

export const revalidate = 60;

const bestSellers = [...mockProducts].sort((a, b) => b.sold - a.sold).slice(0, 10);
const newArrivals = [...mockProducts].reverse().slice(0, 8);

export default function HomePage() {
  return (
    <div className="pb-8">
      {/* Hero */}
      <Container className="mt-4 sm:mt-6">
        <HeroBanner />
      </Container>

      {/* Category */}
      <Section>
        <Container>
          <SectionHeader title="Kategori" />
          <CategoryChips categories={mockCategories} />
        </Container>
      </Section>

      {/* Flash Sale */}
      <Section>
        <Container>
          <FlashSale products={bestSellers.slice(0, 5)} />
        </Container>
      </Section>

      {/* Brands */}
      <Section>
        <Container>
          <BrandStrip brands={mockBrands} />
        </Container>
      </Section>

      {/* Best Sellers */}
      <Section>
        <Container>
          <SectionHeader
            title="Terlaris"
            action={
              <Link href="/kategori?sort=sold" className="flex items-center gap-0.5 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      {/* New Arrivals */}
      <Section>
        <Container>
          <SectionHeader
            title="Baru"
            action={
              <Link href="/kategori?sort=newest" className="flex items-center gap-0.5 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
