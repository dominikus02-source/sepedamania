'use client';
import { useState, useEffect } from 'react';
import { getAllProductsFromApi, getAllProducts as getLocalProducts } from '@/lib/catalog-data';
import { ProductWithRelations } from '@/lib/products.server';

export async function getAllProductsForServer(): Promise<ProductWithRelations[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products?limit=200`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      return data.products || [];
    }
  } catch (err) {
    console.log('API failed, falling back to local storage for server:', err);
  }
  return [];
}

export async function syncProductsFromApiToLocal() {
  try {
    const res = await fetch('/api/products?limit=200', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return { error: 'Failed to fetch products from API' };
    }

    const { products } = await res.json();
    if (!products || products.length === 0) {
      return { error: 'No products returned from API' };
    }

    localStorage.setItem('spm-catalog-synced', 'true');
    return { success: true, count: products.length };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
