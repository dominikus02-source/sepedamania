import type { Metadata } from 'next';
import { ProductCard } from '@/components/customer/product-card';
import { Container, Section } from '@/components/ui/container';
import { mockProducts } from '@/lib/mock-data';
import { Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flash Sale | SEPEDAMANIA',
  description: 'Penawaran flash sale terbatas — diskon spesial untuk sepeda dan aksesoris pilihan.',
};

const flashSaleProducts = [...mockProducts].filter((p) => p.salePrice && p.salePrice < p.price);

export default function FlashSalePage() {
  return (
    <div className="pb-8">
      <Section className="bg-gradient-to-r from-[#FEE2E2] via-[#FFFBEB] to-[#FEF3C7] -mt-6 pt-8">
        <Container>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Flash Sale</h1>
              <p className="text-xs text-[#EF4444] font-medium">Promo terbatas — jangan sampai kehabisan!</p>
            </div>
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          {flashSaleProducts.length === 0 ? (
            <div className="text-center py-16">
              <Zap className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
              <p className="text-[#64748B]">Belum ada produk flash sale saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {flashSaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
