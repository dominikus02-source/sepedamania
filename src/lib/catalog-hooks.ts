'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CatalogProduct, CatalogCategory, CatalogBrand } from './catalog-data';

function readProducts(): CatalogProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('spm-catalog');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.products || [];
    }
  } catch {}
  return [];
}

function readCategories(): CatalogCategory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('spm-catalog');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.categories || [];
    }
  } catch {}
  return [];
}

function readBrands(): CatalogBrand[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('spm-catalog');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.brands || [];
    }
  } catch {}
  return [];
}

export function useCatalogProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setProducts(readProducts());
    setLoading(false);
  }, []);
  const refresh = useCallback(() => {
    setProducts(readProducts());
  }, []);
  return { products, loading, refresh };
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setCategories(readCategories());
    setLoading(false);
  }, []);
  const refresh = useCallback(() => {
    setCategories(readCategories());
  }, []);
  return { categories, loading, refresh };
}

export function useCatalogBrands() {
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setBrands(readBrands());
    setLoading(false);
  }, []);
  const refresh = useCallback(() => {
    setBrands(readBrands());
  }, []);
  return { brands, loading, refresh };
}
