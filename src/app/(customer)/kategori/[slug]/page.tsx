import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/customer/product-card';
import { FilterBar } from './filter-bar';
import { mockCategories, getMockProductsByCategory } from '@/lib/mock-data';

interface Props {
  params: Promise<{ slug: string }>;
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
