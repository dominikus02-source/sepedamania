export const seedCategories = [
  { id: 'cat-1', name: 'MTB', slug: 'mtb', image: null },
  { id: 'cat-2', name: 'Road Bike', slug: 'road-bike', image: null },
  { id: 'cat-3', name: 'BMX', slug: 'bmx', image: null },
  { id: 'cat-4', name: 'Fixie', slug: 'fixie', image: null },
  { id: 'cat-5', name: 'City Bike', slug: 'city-bike', image: null },
  { id: 'cat-6', name: 'Sepeda Anak', slug: 'sepeda-anak', image: null },
  { id: 'cat-7', name: 'Aksesoris', slug: 'aksesoris', image: null },
  { id: 'cat-8', name: 'Suku Cadang', slug: 'suku-cadang', image: null },
];

export const seedBrands = [
  { id: 'brd-1', name: 'Polygon', slug: 'polygon', logo: null },
  { id: 'brd-2', name: 'United', slug: 'united', logo: null },
  { id: 'brd-3', name: 'Wimcycle', slug: 'wimcycle', logo: null },
  { id: 'brd-4', name: 'Pacific', slug: 'pacific', logo: null },
  { id: 'brd-5', name: 'Element', slug: 'element', logo: null },
  { id: 'brd-6', name: 'ASC', slug: 'asc', logo: null },
  { id: 'brd-7', name: 'ProMax', slug: 'promax', logo: null },
  { id: 'brd-8', name: 'XDS', slug: 'xds', logo: null },
  { id: 'brd-9', name: 'Shimano', slug: 'shimano', logo: null },
  { id: 'brd-10', name: 'SRAM', slug: 'sram', logo: null },
];

export const mockCategories = [...seedCategories];
export const mockBrands = [...seedBrands];

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
