import { seedCategories, seedBrands } from './mock-data';
import { slugify } from './utils';

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CatalogBrand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface CatalogProduct {
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

interface CatalogStore {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  products: CatalogProduct[];
}

const STORAGE_KEY = 'spm-catalog';

function defaultStore(): CatalogStore {
  return {
    categories: seedCategories as CatalogCategory[],
    brands: seedBrands as CatalogBrand[],
    products: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readStore(): CatalogStore {
  if (!isBrowser()) return defaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CatalogStore;
      return {
        categories: parsed.categories?.length ? parsed.categories : seedCategories as CatalogCategory[],
        brands: parsed.brands?.length ? parsed.brands : seedBrands as CatalogBrand[],
        products: parsed.products || [],
      };
    }
  } catch {}
  return defaultStore();
}

function writeStore(data: CatalogStore) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function randId() {
  return Math.random().toString(36).slice(2, 10);
}

// ========== Categories ==========

export function getAllCategories(): CatalogCategory[] {
  return readStore().categories;
}

export function getCategoryById(id: string): CatalogCategory | undefined {
  return readStore().categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return readStore().categories.find((c) => c.slug === slug);
}

export function addCategory(input: { name: string; image?: string }): CatalogCategory {
  const store = readStore();
  const slug = slugify(input.name);
  const cat: CatalogCategory = {
    id: 'cat-' + randId(),
    name: input.name,
    slug,
    image: input.image || null,
  };
  store.categories.push(cat);
  writeStore(store);
  return cat;
}

export function updateCategory(id: string, updates: Partial<CatalogCategory>): boolean {
  const store = readStore();
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.categories[idx] = { ...store.categories[idx], ...updates };
  writeStore(store);
  return true;
}

export function deleteCategory(id: string): boolean {
  const store = readStore();
  const used = store.products.some((p) => p.categoryId === id);
  if (used) return false;
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.categories.splice(idx, 1);
  writeStore(store);
  return true;
}

// ========== Brands ==========

export function getAllBrands(): CatalogBrand[] {
  return readStore().brands;
}

export function getBrandById(id: string): CatalogBrand | undefined {
  return readStore().brands.find((b) => b.id === id);
}

export function getBrandBySlug(slug: string): CatalogBrand | undefined {
  return readStore().brands.find((b) => b.slug === slug);
}

export function addBrand(input: { name: string; logo?: string }): CatalogBrand {
  const store = readStore();
  const slug = slugify(input.name);
  const brd: CatalogBrand = {
    id: 'brd-' + randId(),
    name: input.name,
    slug,
    logo: input.logo || null,
  };
  store.brands.push(brd);
  writeStore(store);
  return brd;
}

export function updateBrand(id: string, updates: Partial<CatalogBrand>): boolean {
  const store = readStore();
  const idx = store.brands.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  store.brands[idx] = { ...store.brands[idx], ...updates };
  writeStore(store);
  return true;
}

export function deleteBrand(id: string): boolean {
  const store = readStore();
  const used = store.products.some((p) => p.brandId === id);
  if (used) return false;
  const idx = store.brands.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  store.brands.splice(idx, 1);
  writeStore(store);
  return true;
}

// ========== Products ==========

export function getAllProducts(): CatalogProduct[] {
  return readStore().products;
}

export function getProductBySlug(slug: string): CatalogProduct | null {
  return readStore().products.find((p) => p.slug === slug) || null;
}

export function getProductById(id: string): CatalogProduct | null {
  return readStore().products.find((p) => p.id === id) || null;
}

export function getProductsByCategory(categorySlug: string): CatalogProduct[] {
  const store = readStore();
  const cat = store.categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return store.products.filter((p) => p.categoryId === cat.id && p.isActive);
}

export function getRelatedProducts(productId: string, limit = 6): CatalogProduct[] {
  const store = readStore();
  const product = store.products.find((p) => p.id === productId);
  if (!product) return [];
  return store.products
    .filter((p) => p.categoryId === product.categoryId && p.id !== productId && p.isActive)
    .slice(0, limit);
}

export function addProduct(input: {
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
}): CatalogProduct {
  const store = readStore();
  const slug = slugify(input.name);
  const cat = store.categories.find((c) => c.id === input.categoryId) || store.categories[0];
  const brd = store.brands.find((b) => b.id === input.brandId) || store.brands[0];
  const product: CatalogProduct = {
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
    images: input.images || [],
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
}

export function updateProduct(slug: string, updates: Partial<CatalogProduct>): boolean {
  const store = readStore();
  const idx = store.products.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;

  const updated = { ...store.products[idx], ...updates };

  if (updates.name && updates.name !== store.products[idx].name) {
    updated.slug = slugify(updates.name);
  }
  if (updates.categoryId) {
    const cat = store.categories.find((c) => c.id === updates.categoryId);
    if (cat) updated.category = { id: cat.id, name: cat.name, slug: cat.slug };
  }
  if (updates.brandId) {
    const brd = store.brands.find((b) => b.id === updates.brandId);
    if (brd) updated.brand = { id: brd.id, name: brd.name, slug: brd.slug };
  }

  store.products[idx] = updated;
  writeStore(store);
  return true;
}

export function deleteProduct(id: string): boolean {
  const store = readStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.products.splice(idx, 1);
  writeStore(store);
  return true;
}

// ========== Server-safe defaults (for server components / API routes) ==========

export function getServerCategories(): CatalogCategory[] {
  return seedCategories as CatalogCategory[];
}

export function getServerBrands(): CatalogBrand[] {
  return seedBrands as CatalogBrand[];
}

export { slugify } from './utils';
