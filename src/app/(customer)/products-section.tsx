'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/customer/product-card';
import { CategoryChips } from '@/components/customer/category-chips';
import { FlashSale } from '@/components/customer/flash-sale';
import { BrandStrip } from '@/components/customer/brand-strip';
import { Container, Section, SectionHeader } from '@/components/ui/container';
import {
  getAllProductsFromApi,
  getActiveCategories,
  getActiveBrands,
  CatalogProduct,
  CatalogCategory,
  CatalogBrand,
} from '@/lib/catalog-data';
import { ChevronRight, LoaderCircle } from 'lucide-react';

export function ProductsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProductsFromApi().then((all) => {
      setProducts(all.filter((p) => p.isActive));
      setCategories(getActiveCategories());
      setBrands(getActiveBrands());
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 10);
  const newArrivals = [...products].reverse().slice(0, 8);
  const flashSaleProducts = [...products]
    .filter((p) => p.salePrice && p.salePrice < p.price)
    .slice(0, 5);

  return (
    <>
      <Section>
        <Container>
          <SectionHeader title="Kategori" />
          <CategoryChips categories={categories} />
        </Container>
      </Section>

      <Section>
        <Container>
          <FlashSale products={flashSaleProducts} />
        </Container>
      </Section>

      <Section>
        <Container>
          <BrandStrip brands={brands} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            title="Terlaris"
            action={
              <Link href="/kategori" className="flex items-center gap-0.5 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors">
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

      <Section>
        <Container>
          <SectionHeader
            title="Baru"
            action={
              <Link href="/kategori" className="flex items-center gap-0.5 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors">
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
    </>
  );
}
