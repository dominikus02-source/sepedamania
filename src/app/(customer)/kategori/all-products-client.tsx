'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/customer/product-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getAllProducts } from '@/lib/catalog-data';
import { SlidersHorizontal, Search, PackageOpen } from 'lucide-react';

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'discount';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Terpopuler' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-asc', label: 'Harga Terendah' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'discount', label: 'Diskon' },
];

interface AllProductsClientProps {
  products: Array<{
    id: string; name: string; slug: string; price: number;
    salePrice?: number | null; images: string[]; sold: number;
    rating?: number; category?: { name: string }; stock: number; weight: number;
  }>;
}

export function AllProductsClient({ products }: AllProductsClientProps) {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get('sort') as SortOption | null;
  const [localProducts, setLocalProducts] = useState(products);
  const [sort, setSort] = useState<SortOption>(sortParam || 'popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalProducts(getAllProducts());
  }, []);

  const filtered = useMemo(() => {
    let result = [...localProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'popular': result.sort((a, b) => b.sold - a.sold); break;
      case 'newest': result.reverse(); break;
      case 'price-asc': result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case 'price-desc': result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      case 'discount': result.sort((a, b) => {
        const da = a.salePrice ? a.price - a.salePrice : 0;
        const db = b.salePrice ? b.price - b.salePrice : 0;
        return db - da;
      }); break;
    }
    return result;
  }, [localProducts, sort, searchQuery]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E5E5EA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30 focus:border-[#F5A623]"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Urutkan
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                sort === opt.value
                  ? 'bg-[#F5A623] border-[#F5A623] text-white'
                  : 'border-[#E5E5EA] text-[#1C1C1E] hover:border-[#F5A623]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {searchQuery.trim() && (
        <p className="text-xs text-[#8E8E93] mb-3">
          Hasil untuk &ldquo;{searchQuery}&rdquo; ({filtered.length} produk)
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="w-8 h-8 text-[#8E8E93]" />}
          title="Produk tidak ditemukan"
          description={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada produk'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                salePrice: product.salePrice ? Number(product.salePrice) : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
