import type { Metadata } from 'next';
import { Container, SectionHeader } from '@/components/ui/container';
import { getAllProducts } from '@/lib/catalog-data';
import { AllProductsClient } from './all-products-client';

export const metadata: Metadata = {
  title: 'Semua Produk | SEPEDAMANIA',
  description: 'Jelajahi semua koleksi sepeda dan aksesoris terlengkap di SEPEDAMANIA.',
};

export default function AllCategoriesPage() {
  const products = getAllProducts();
  return (
    <Container className="py-6">
      <SectionHeader title="Semua Produk" />
      <AllProductsClient products={products} />
    </Container>
  );
}
