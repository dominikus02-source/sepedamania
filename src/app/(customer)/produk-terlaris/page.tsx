import type { Metadata } from 'next';
import { ProductCard } from '@/components/customer/product-card';
import { Container, Section } from '@/components/ui/container';
import { mockProducts } from '@/lib/mock-data';
import { Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Produk Terlaris | SEPEDAMANIA',
  description: 'Koleksi produk terlaris di SEPEDAMANIA — sepeda dan aksesoris pilihan pelanggan.',
};

const bestSellers = [...mockProducts].sort((a, b) => b.sold - a.sold);

export default function ProdukTerlarisPage() {
  return (
    <div className="pb-8">
      <Section>
        <Container>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EF4444] flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">Produk Terlaris</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Produk favorit pelanggan SEPEDAMANIA</p>
            </div>
          </div>
          {bestSellers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#64748B]">Belum ada data produk terlaris.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
