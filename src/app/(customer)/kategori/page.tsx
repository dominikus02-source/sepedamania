import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container, SectionHeader } from '@/components/ui/container';
import { AllProductsClient } from './all-products-client';

export const metadata: Metadata = {
  title: 'Semua Produk | SEPEDAMANIA',
  description: 'Jelajahi semua koleksi sepeda dan aksesoris terlengkap di SEPEDAMANIA.',
};

export default function AllCategoriesPage() {
  return (
    <Container className="py-6">
      <SectionHeader title="Semua Produk" />
      <Suspense fallback={<div className="py-12 text-center text-[#64748B]">Memuat produk...</div>}>
        <AllProductsClient />
      </Suspense>
    </Container>
  );
}
