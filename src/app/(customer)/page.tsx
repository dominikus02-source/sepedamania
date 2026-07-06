import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { LaunchBanner } from '@/components/customer/launch-banner';
import { TrustSection } from '@/components/customer/trust-section';
import { TrustBadges } from '@/components/customer/trust-badges';
import { Container, Section } from '@/components/ui/container';
import { ProductsSection } from './products-section';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Temukan Sepeda yang Cocok untuk Gaya Hidupmu',
  description:
    'Toko sepeda online terlengkap. Temukan MTB, Road Bike, BMX, Fixie, City Bike & aksesoris original. Pembayaran aman via Midtrans, pengiriman ke seluruh Indonesia.',
};

export default function HomePage() {
  return (
    <div className="pb-8">
      <LaunchBanner />

      <Container className="mt-4 sm:mt-6">
        <HeroBanner />
      </Container>

      <TrustSection />

      <ProductsSection />

      <Section>
        <Container>
          <TrustBadges variant="full" />
        </Container>
      </Section>
    </div>
  );
}
