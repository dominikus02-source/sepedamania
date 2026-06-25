'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/customer/product-card';
import { FilterBar } from './filter-bar';
import { getCategoryBySlug, getProductsByCategoryFromApi, CatalogProduct } from '@/lib/catalog-data';
import { LoaderCircle } from 'lucide-react';

export function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = getCategoryBySlug(slug);
    if (cat) setCategoryName(cat.name);
    getProductsByCategoryFromApi(slug).then((result) => {
      setProducts(result);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle className="w-8 h-8 animate-spin text-[#F5A623]" />
        <p className="text-sm text-[#8E8E93]">Memuat produk...</p>
      </div>
    </div>
  );

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
