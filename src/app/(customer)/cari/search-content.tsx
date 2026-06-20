'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/customer/product-card';
import { ProductCardSkeleton } from '@/components/customer/product-skeleton';
import { Search, X, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { mockCategories } from '@/lib/mock-data';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  sold: number;
  rating?: number;
  category?: { name: string };
  stock: number;
  weight: number;
}

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sepedamania-recent-searches');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    startTransition(() => { setLoading(true); });
    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=20`)
      .then((r) => r.json())
      .then((data) => { setResults(data.products || data || []); })
      .catch(() => setResults([]))
      .finally(() => startTransition(() => setLoading(false)));
  }, [debouncedQuery]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('sepedamania-recent-searches', JSON.stringify(updated));
    router.push(`/cari?q=${encodeURIComponent(term)}`);
  };

  const clearRecent = () => { setRecentSearches([]); localStorage.removeItem('sepedamania-recent-searches'); };

  const handleCategoryClick = (slug: string) => { router.push(`/kategori/${slug}`); };

  return (
    <div className="p-4">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari sepeda, aksesoris..."
          className="pl-9 pr-8 h-11 rounded-xl bg-[#F2F2F7] border-0 focus-visible:ring-1 focus-visible:ring-[#F5A623]"
          autoFocus
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-[#8E8E93]" />
          </button>
        )}
      </form>

      {!query && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[#1C1C1E] mb-2">Kategori</h3>
          <div className="flex flex-wrap gap-2">
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="px-4 py-2 rounded-full bg-[#F2F2F7] text-sm text-[#1C1C1E] font-medium hover:bg-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && recentSearches.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#8E8E93]" />
              <h3 className="text-sm font-medium text-[#1C1C1E]">Pencarian Terakhir</h3>
            </div>
            <button onClick={clearRecent} className="text-xs text-[#8E8E93]">Hapus</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="px-3 py-1.5 rounded-full bg-white border border-[#E5E5EA] text-xs text-[#1C1C1E]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div>
          <p className="text-xs text-[#8E8E93] mb-3">Menampilkan hasil untuk &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-xs text-[#8E8E93] mb-3">{results.length} hasil untuk &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : query && !loading ? (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-[#E5E5EA] mx-auto mb-3" />
          <p className="text-[#8E8E93]">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-[#8E8E93] mt-1">Coba kata kunci lain</p>
        </div>
      ) : null}
    </div>
  );
}
