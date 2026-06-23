interface SeedOption { id: string; name: string; values: string[] }

export const seedCategoryOptions: Record<string, SeedOption[]> = {
  'cat-1': [ // MTB
    { id: 'opt-ukuran-mtb', name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] },
    { id: 'opt-warna-mtb', name: 'Warna', values: ['Merah', 'Hitam', 'Putih', 'Biru'] },
  ],
  'cat-2': [ // Road Bike
    { id: 'opt-ukuran-road', name: 'Ukuran', values: ['48', '50', '52', '54', '56'] },
    { id: 'opt-warna-road', name: 'Warna', values: ['Putih', 'Hitam', 'Merah'] },
  ],
  'cat-3': [ // BMX
    { id: 'opt-ukuran-bmx', name: 'Ukuran', values: ['20"', '20.5"', '21"'] },
    { id: 'opt-warna-bmx', name: 'Warna', values: ['Hitam', 'Putih', 'Kuning'] },
  ],
  'cat-4': [ // Fixie
    { id: 'opt-ukuran-fixie', name: 'Ukuran', values: ['49', '52', '55', '58'] },
    { id: 'opt-warna-fixie', name: 'Warna', values: ['Hitam', 'Putih', 'Merah', 'Biru'] },
  ],
  'cat-5': [ // City Bike
    { id: 'opt-ukuran-city', name: 'Ukuran', values: ['S', 'M', 'L'] },
    { id: 'opt-warna-city', name: 'Warna', values: ['Hitam', 'Putih', 'Cokelat'] },
  ],
  'cat-6': [ // Sepeda Anak
    { id: 'opt-ukuran-anak', name: 'Ukuran', values: ['12"', '16"', '18"', '20"'] },
    { id: 'opt-warna-anak', name: 'Warna', values: ['Merah', 'Biru', 'Pink', 'Hijau'] },
  ],
};

export const seedCategories = [
  { id: 'cat-1', name: 'MTB', slug: 'mtb', image: null, brandId: 'brd-1', options: seedCategoryOptions['cat-1'] },
  { id: 'cat-2', name: 'Road Bike', slug: 'road-bike', image: null, brandId: 'brd-1', options: seedCategoryOptions['cat-2'] },
  { id: 'cat-3', name: 'BMX', slug: 'bmx', image: null, brandId: 'brd-2', options: seedCategoryOptions['cat-3'] },
  { id: 'cat-4', name: 'Fixie', slug: 'fixie', image: null, brandId: 'brd-2', options: seedCategoryOptions['cat-4'] },
  { id: 'cat-5', name: 'City Bike', slug: 'city-bike', image: null, brandId: 'brd-3', options: seedCategoryOptions['cat-5'] },
  { id: 'cat-6', name: 'Sepeda Anak', slug: 'sepeda-anak', image: null, brandId: 'brd-4', options: seedCategoryOptions['cat-6'] },
  { id: 'cat-7', name: 'Aksesoris', slug: 'aksesoris', image: null, brandId: null as string | null, options: [] },
  { id: 'cat-8', name: 'Suku Cadang', slug: 'suku-cadang', image: null, brandId: null as string | null, options: [] },
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
