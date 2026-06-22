'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/customer/product-card';
import { FilterBar } from './filter-bar';
import { getProductsByCategory, getCategoryBySlug, CatalogProduct } from '@/lib/catalog-data';

export function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = getCategoryBySlug(slug);
    if (cat) setCategoryName(cat.name);
    setProducts(getProductsByCategory(slug));
    setLoading(false);
  }, [slug]);

  if (loading) return <p className="text-center text-[#8E8E93] py-12">Memuat...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-4">{categoryName}</h1>
      <FilterBar />
      {products.length === 0 ? (
        <p className="text-center text-[#8E8E93] py-12">Tidak ada produk dalam kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
