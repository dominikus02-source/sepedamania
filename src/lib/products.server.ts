// Server-side product data layer using Prisma as the single source of truth
import { prisma } from '@/lib/prisma';
import { slugify } from './utils';
import { CatalogProduct, CatalogCategory, CatalogBrand } from './catalog-data';
import { CatalogOption } from './catalog-data';

export interface ProductWithRelations {
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
  videoUrls?: string[];
  isActive: boolean;
  specs: Record<string, string>;
  metaTitle?: string | null;
  metaDescription?: string | null;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  variants: any[];
  reviews: any[];
  rating: number;
  reviewCount: number;
}

export async function getServerProducts(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map(mapPrismaProductToCatalog);
}

export async function getPublicProducts(params: {
  q?: string;
  categoryId?: string;
  brandId?: string;
  categorySlug?: string;
  brandSlug?: string;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'sold' | 'rating' | 'newest';
  featured?: boolean;
  flashSale?: boolean;
} = {}): Promise<CatalogProduct[]> {
  const {
    q,
    categoryId,
    brandId,
    categorySlug,
    brandSlug,
    limit = 50,
    sort,
    featured,
    flashSale,
  } = params;

  const where: any = { isActive: true };

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (category) {
      where.categoryId = category.id;
    }
  } else if (categoryId) {
    where.categoryId = categoryId;
  }

  if (brandSlug) {
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
    });
    if (brand) {
      where.brandId = brand.id;
    }
  } else if (brandId) {
    where.brandId = brandId;
  }

  // featured and flashSale filters excluded — fields not in Prisma schema

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  switch (sort) {
    case 'price_asc':
      orderBy.price = 'asc';
      break;
    case 'price_desc':
      orderBy.price = 'desc';
      break;
    case 'sold':
      orderBy.sold = 'desc';
      break;
    case 'rating':
      orderBy.rating = 'desc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
  });

  return products.map(mapPrismaProductToCatalog);
}

export async function getPublicProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
  });

  if (!product) return null;
  return mapPrismaProductToCatalog(product);
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<CatalogProduct[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return [];

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map(mapPrismaProductToCatalog);
}

export async function createAdminProduct(data: {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  salePrice?: number | null;
  weight: number;
  stock: number;
  images?: string[];
  videoUrls?: string[];
  specs?: Record<string, string>;
  isActive?: boolean;
  featured?: boolean;
  flashSale?: boolean;
  variants?: any[];
}): Promise<ProductWithRelations> {
  const slug = slugify(data.name);

  const existingBySlug = await prisma.product.findUnique({ where: { slug } });
  if (existingBySlug) {
    throw new Error('Slug sudah digunakan');
  }

  const existingBySku = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingBySku) {
    throw new Error('SKU sudah digunakan');
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    throw new Error('Kategori tidak ditemukan');
  }

  const brand = await prisma.brand.findUnique({
    where: { id: data.brandId },
  });
  if (!brand) {
    throw new Error('Merek tidak ditemukan');
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku: data.sku,
      description: data.description,
      categoryId: data.categoryId,
      brandId: data.brandId,
      price: data.price,
      salePrice: data.salePrice ?? null,
      weight: data.weight,
      stock: data.stock,
      images: data.images || [],
      specs: data.specs || {},
      isActive: data.isActive ?? true,
      variants: {
        create: data.variants?.map((v) => ({
          name: v.name,
          value: v.value,
          stock: v.stock,
          price: v.price,
          sku: v.sku,
        })) || [],
      },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
    },
  });

  return mapPrismaProductToCatalog(product);
}

export async function updateAdminProduct(
  id: string,
  updates: Partial<ProductWithRelations>
): Promise<ProductWithRelations | null> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return null;

  if (updates.name) {
    updates.slug = slugify(updates.name);
    const existingBySlug = await prisma.product.findUnique({
      where: { slug: updates.slug },
    });
    if (existingBySlug && existingBySlug.id !== id) {
      throw new Error('Slug sudah digunakan');
    }
  }

  if (updates.sku) {
    const existingBySku = await prisma.product.findUnique({
      where: { sku: updates.sku },
    });
    if (existingBySku && existingBySku.id !== id) {
      throw new Error('SKU sudah digunakan');
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: updates as any,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
  });

  return mapPrismaProductToCatalog(product);
}

export async function getAdminProducts(): Promise<ProductWithRelations[]> {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map(mapPrismaProductToCatalog);
}

export async function getCategories(): Promise<CatalogCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    brandId: null,
    options: [],
    isActive: true,
    sortOrder: 0,
    description: '',
    color: '#F97316',
  }));
}

export async function getBrands(): Promise<CatalogBrand[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    isActive: true,
    sortOrder: 0,
    description: '',
  }));
}

export async function addCategory(input: {
  name: string;
  brandId?: string | null;
  image?: string | null;
  description?: string;
  color?: string;
  sortOrder?: number;
}): Promise<CatalogCategory> {
  const slug = slugify(input.name);

  const existing = await prisma.category.findFirst({
    where: { name: { equals: input.name, mode: 'insensitive' } },
  });
  if (existing) {
    throw new Error(`Kategori "${input.name}" sudah ada`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await (prisma.category.create as any)({
    data: {
      name: input.name,
      slug,
      image: input.image || null,
    },
  });

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
    brandId: null,
    options: [],
    isActive: true,
    sortOrder: 0,
    description: '',
    color: '#F5A623',
  };
}

export async function addBrand(input: {
  name: string;
  logo?: string | null;
  description?: string;
  sortOrder?: number;
}): Promise<CatalogBrand> {
  const slug = slugify(input.name);

  const existing = await prisma.brand.findFirst({
    where: { name: { equals: input.name, mode: 'insensitive' } },
  });
  if (existing) {
    throw new Error(`Merek "${input.name}" sudah ada`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brand = await (prisma.brand.create as any)({
    data: {
      name: input.name,
      slug,
      logo: input.logo || null,
    },
  });

  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo,
    isActive: true,
    sortOrder: 0,
    description: '',
  };
}

function mapPrismaProductToCatalog(product: any): CatalogProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    categoryId: product.categoryId,
    brandId: product.brandId,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    weight: product.weight,
    stock: product.stock,
    sold: product.sold,
    images: product.images,
    videoUrls: [],
    isActive: product.isActive,
    specs: (product.specs as Record<string, string>) || {},
    featured: false,
    flashSale: false,
    category: product.category,
    brand: product.brand,
    variants: product.variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      stock: v.stock,
      price: v.price ? Number(v.price) : null,
      sku: v.sku || '',
      productId: v.productId,
    })),
    reviews: product.reviews.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      productId: product.id,
      rating: r.rating,
      comment: r.comment || '',
      images: r.images,
      createdAt: r.createdAt.toISOString(),
      user: { name: '', image: null },
    })),
    rating: product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
  };
}

export { slugify } from './utils';
