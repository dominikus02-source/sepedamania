export const mockCategories: {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}[] = [];

export const mockBrands: {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}[] = [];

const reviewsData: Record<string, { rating: number; comment: string; userName: string; createdAt: string }[]> = {};

const productImages: Record<string, string[]> = {};

function computeRating(slug: string): { rating: number; reviewCount: number } {
  const r = reviewsData[slug] || [];
  if (r.length === 0) return { rating: 0, reviewCount: 0 };
  const avg = r.reduce((s, rv) => s + rv.rating, 0) / r.length;
  return { rating: Math.round(avg * 10) / 10, reviewCount: r.length };
}

export const mockProducts: {
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
  variants: { id: string; name: string; value: string; stock: number; price: number | null; sku: string; productId: string }[];
  reviews: { id: string; userId: string; productId: string; rating: number; comment: string; images: string[]; createdAt: string; user: { name: string; image: string | null } }[];
  rating: number;
  reviewCount: number;
}[] = [];

export function getMockProduct(slug: string) {
  return mockProducts.find((p) => p.slug === slug) || null;
}

export function getMockProductsByCategory(categorySlug: string) {
  const cat = mockCategories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return mockProducts.filter((p) => p.categoryId === cat.id);
}

export function getMockRelatedProducts(productId: string) {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return [];
  return mockProducts.filter((p) => p.categoryId === product.categoryId && p.id !== productId).slice(0, 6);
}