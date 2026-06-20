import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/customer/product-card';
import { FilterBar } from './filter-bar';
import { mockCategories, getMockProductsByCategory } from '@/lib/mock-data';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) return { title: 'Kategori tidak ditemukan' };
  const title = `${category.name} Terbaik | SEPEDAMANIA`;
  const description = `Temukan koleksi ${category.name} terlengkap di SEPEDAMANIA. Harga kompetitif, produk original, pengiriman ke seluruh Indonesia.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: '/og-default.jpg', width: 1200, height: 630 }] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = getMockProductsByCategory(slug);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-4">{category.name}</h1>
      <FilterBar />
      {products.length === 0 ? (
        <p className="text-center text-[#8E8E93] py-12">Tidak ada produk dalam kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
