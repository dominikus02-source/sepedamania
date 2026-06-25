'use client';

import { useState, useEffect } from 'react';

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  salePrice: number | null;
  weight: number;
  stock: number;
  sold: number;
  images: string[];
  videoUrls: string[];
  isActive: boolean;
  specs: Record<string, string>;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  variants: { id: string; name: string; value: string; stock: number; price: number | null; sku: string; productId?: string }[];
  reviews: { id: string; userId: string; productId: string; rating: number; comment: string; images: string[]; createdAt: string; user: { name: string; image: string | null } }[];
  rating: number;
  reviewCount: number;
}

export function useApiProducts(params?: {
  q?: string;
  categoryId?: string;
  brandId?: string;
  sort?: string;
  limit?: number;
}) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams();
        if (params?.q) searchParams.set('q', params.q);
        if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
        if (params?.brandId) searchParams.set('brandId', params.brandId);
        if (params?.sort) searchParams.set('sort', params.sort);
        if (params?.limit) searchParams.set('limit', String(params.limit));
        else searchParams.set('limit', '100');

        const res = await fetch(`/api/products?${searchParams}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setProducts(json.products || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat produk');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [params?.q, params?.categoryId, params?.brandId, params?.sort, params?.limit]);

  return { products, loading, error };
}
