import { useState, useEffect, useCallback } from 'react';
import { mockProducts, mockCategories, mockBrands } from './mock-data';
import { mockOrders, AdminOrder } from './mock-admin-data';
import { slugify } from './utils';

export interface Product {
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
  isActive: boolean;
  specs: Record<string, string>;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  variants: { id: string; name: string; value: string; stock: number; price: number | null; sku: string; productId?: string }[];
  reviews: { id: string; userId: string; productId: string; rating: number; comment: string; images: string[]; createdAt: string; user: { name: string; image: string | null } }[];
  rating: number;
  reviewCount: number;
}

const STORAGE_KEY = 'spm-admin-store';

function readStore(): { products: Product[]; orders: AdminOrder[] } {
  if (typeof window === 'undefined') {
    return { products: mockProducts as unknown as Product[], orders: mockOrders };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { products: Product[]; orders: AdminOrder[] };
  } catch {}
  return { products: mockProducts as unknown as Product[], orders: mockOrders };
}

function writeStore(data: { products: Product[]; orders: AdminOrder[] }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function randId() {
  return Math.random().toString(36).slice(2, 10);
}

export const AdminStore = {
  getProducts: (): Product[] => readStore().products,

  getProductBySlug: (slug: string): Product | null =>
    readStore().products.find((p) => p.slug === slug) || null,

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
  }): Product {
    const store = readStore();
    const slug = slugify(input.name);
    const cat = mockCategories.find((c) => c.id === input.categoryId) || mockCategories[0];
    const brd = mockBrands.find((b) => b.id === input.brandId) || mockBrands[0];
    const product: Product = {
      id: 'p' + randId(),
      name: input.name,
      slug,
      sku: input.sku,
      description: input.description,
      categoryId: input.categoryId,
      brandId: input.brandId,
      price: input.price,
      salePrice: input.salePrice,
      weight: input.weight,
      stock: input.stock,
      sold: 0,
      images: [],
      isActive: true,
      specs: {},
      category: { id: cat.id, name: cat.name, slug: cat.slug },
      brand: { id: brd.id, name: brd.name, slug: brd.slug },
      variants: [],
      reviews: [],
      rating: 0,
      reviewCount: 0,
    };
    store.products.push(product);
    writeStore(store);
    return product;
  },

  updateProduct(slug: string, updates: Partial<Product>): boolean {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.slug === slug);
    if (idx === -1) return false;
    store.products[idx] = { ...store.products[idx], ...updates };
    writeStore(store);
    return true;
  },

  deleteProduct(id: string): boolean {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    store.products.splice(idx, 1);
    writeStore(store);
    return true;
  },

  getOrders: (): AdminOrder[] => readStore().orders,

  getOrder: (id: string): AdminOrder | null =>
    readStore().orders.find((o) => o.id === id) || null,

  updateOrder(id: string, updates: Partial<AdminOrder>): boolean {
    const store = readStore();
    const idx = store.orders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    store.orders[idx] = { ...store.orders[idx], ...updates, updatedAt: new Date().toISOString() };
    writeStore(store);
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

export type { AdminOrder };
