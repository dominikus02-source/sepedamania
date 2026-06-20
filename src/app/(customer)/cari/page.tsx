import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchContent } from './search-content';
import { ProductCardSkeleton } from '@/components/customer/product-skeleton';

export const metadata: Metadata = {
  title: 'Cari Produk',
  description: 'Cari sepeda MTB, Road Bike, BMX, Fixie, dan aksesoris terlengkap di SEPEDAMANIA.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4"><ProductCardSkeleton /><ProductCardSkeleton /></div>}>
      <SearchContent />
    </Suspense>
  );
}
