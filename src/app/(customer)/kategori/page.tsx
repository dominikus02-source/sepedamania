import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/customer/product-card';
import { Container, SectionHeader } from '@/components/ui/container';
import { mockProducts } from '@/lib/mock-data';
import { AllProductsClient } from './all-products-client';

export const metadata: Metadata = {
  title: 'Semua Produk | SEPEDAMANIA',
  description: 'Jelajahi semua koleksi sepeda dan aksesoris terlengkap di SEPEDAMANIA.',
};

export const revalidate = 60;

export default function AllCategoriesPage() {
  return (
    <Container className="py-6">
      <SectionHeader title="Semua Produk" />
      <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4"><LoadingGrid /></div>}>
        <AllProductsClient products={mockProducts} />
      </Suspense>
    </Container>
  );
}

function LoadingGrid() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 animate-pulse">
          <div className="aspect-square rounded-xl bg-[#F1F5F9] mb-2.5" />
          <div className="h-3 w-16 bg-[#F1F5F9] rounded mb-2" />
          <div className="h-4 w-full bg-[#F1F5F9] rounded mb-1" />
          <div className="h-3 w-24 bg-[#F1F5F9] rounded" />
        </div>
      ))}
    </>
  );
}
