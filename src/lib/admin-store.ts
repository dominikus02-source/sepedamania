import { useState, useEffect, useCallback } from 'react';
import { mockOrders, AdminOrder } from './mock-admin-data';
import {
  addProduct as catalogAddProduct,
  updateProduct as catalogUpdateProduct,
  deleteProduct as catalogDeleteProduct,
  getProductBySlug,
  getAllProducts,
} from './catalog-data';
import type { CatalogProduct as Product } from './catalog-data';

const ORDER_STORAGE_KEY = 'spm-admin-store';

function readOrders(): AdminOrder[] {
  if (typeof window === 'undefined') return mockOrders;
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { orders: AdminOrder[] };
      if (parsed.orders?.length) return parsed.orders;
    }
  } catch {}
  return mockOrders;
}

function writeOrders(orders: AdminOrder[]) {
  if (typeof window === 'undefined') return;
  const existing = (() => {
    try {
      const raw = localStorage.getItem(ORDER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  })();
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify({ ...existing, orders }));
}

export const AdminStore = {
  getProducts: (): Product[] => getAllProducts(),

  getProductBySlug: (slug: string): Product | null => getProductBySlug(slug),

  addProduct(input: {
    name: string;
    sku: string;
    description: string;
    categoryId: string;
    brandId: string;
    price: number;
    salePrice: number | null;
    weight: number;
    stock: number;
    images?: string[];
    videoUrls?: string[];
  }): Product {
    return catalogAddProduct(input);
  },

  updateProduct(slug: string, updates: Partial<Product>): boolean {
    return catalogUpdateProduct(slug, updates);
  },

  deleteProduct(id: string): boolean {
    return catalogDeleteProduct(id);
  },

  getOrders: (): AdminOrder[] => readOrders(),

  getOrder: (id: string): AdminOrder | null =>
    readOrders().find((o) => o.id === id) || null,

  updateOrder(id: string, updates: Partial<AdminOrder>): boolean {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
    writeOrders(orders);
    return true;
  },
};

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setProducts(AdminStore.getProducts());
    setLoading(false);
  }, []);
  const refresh = useCallback(() => {
    setProducts(AdminStore.getProducts());
  }, []);
  return { products, loading, refresh };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setOrders(AdminStore.getOrders());
    setLoading(false);
  }, []);
  const refresh = useCallback(() => {
    setOrders(AdminStore.getOrders());
  }, []);
  return { orders, loading, refresh };
}

export type { Product };
export type { AdminOrder };
