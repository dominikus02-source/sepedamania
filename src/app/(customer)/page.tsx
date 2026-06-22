import type { Metadata } from 'next';
import { HeroBanner } from '@/components/customer/hero-banner';
import { TrustBadges } from '@/components/customer/trust-badges';
import { Container, Section } from '@/components/ui/container';
import { ProductsSection } from './products-section';

export const metadata: Metadata = {
  title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
  description: 'Temukan sepeda MTB, Road Bike, BMX, Fixie, City Bike & aksesoris terlengkap di SEPEDAMANIA.',
};

export default function HomePage() {
  return (
    <div className="pb-8">
      <Container className="mt-4 sm:mt-6">
        <HeroBanner />
      </Container>

      <ProductsSection />

      <Section>
        <Container>
          <TrustBadges variant="full" />
        </Container>
      </Section>
    </div>
  );
}
