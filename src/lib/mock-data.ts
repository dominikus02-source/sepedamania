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

export const seedCategories: {
  id: string; name: string; slug: string; image: string | null; brandId: string | null;
  options: { id: string; name: string; values: string[] }[];
  isActive: boolean; sortOrder: number; description: string; color: string;
}[] = [
  { id: 'cat-1', name: 'MTB', slug: 'mtb', image: null, brandId: 'brd-1', options: seedCategoryOptions['cat-1'], isActive: true, sortOrder: 1, description: 'Sepeda gunung untuk trail dan medan berat', color: '#F97316' },
  { id: 'cat-2', name: 'Road Bike', slug: 'road-bike', image: null, brandId: 'brd-1', options: seedCategoryOptions['cat-2'], isActive: true, sortOrder: 2, description: 'Sepeda balap untuk kecepatan di aspal', color: '#0284C7' },
  { id: 'cat-3', name: 'BMX', slug: 'bmx', image: null, brandId: 'brd-2', options: seedCategoryOptions['cat-3'], isActive: true, sortOrder: 3, description: 'Sepeda aksi untuk street dan park', color: '#EF4444' },
  { id: 'cat-4', name: 'Fixie', slug: 'fixie', image: null, brandId: 'brd-2', options: seedCategoryOptions['cat-4'], isActive: true, sortOrder: 4, description: 'Sepeda gigi tetap, simpel dan stylish', color: '#7C3AED' },
  { id: 'cat-5', name: 'City Bike', slug: 'city-bike', image: null, brandId: 'brd-3', options: seedCategoryOptions['cat-5'], isActive: true, sortOrder: 5, description: 'Sepeda kota untuk riding santai', color: '#16A34A' },
  { id: 'cat-6', name: 'Sepeda Anak', slug: 'sepeda-anak', image: null, brandId: 'brd-4', options: seedCategoryOptions['cat-6'], isActive: true, sortOrder: 6, description: 'Sepeda khusus untuk anak-anak', color: '#EC4899' },
  { id: 'cat-7', name: 'Aksesoris', slug: 'aksesoris', image: null, brandId: null as string | null, options: [], isActive: true, sortOrder: 7, description: 'Perlengkapan dan aksesoris sepeda', color: '#D97706' },
  { id: 'cat-8', name: 'Suku Cadang', slug: 'suku-cadang', image: null, brandId: null as string | null, options: [], isActive: true, sortOrder: 8, description: 'Spare part dan komponen sepeda', color: '#64748B' },
];

export const seedBrands: {
  id: string; name: string; slug: string; logo: string | null;
  isActive: boolean; sortOrder: number; description: string;
}[] = [
  { id: 'brd-1', name: 'Polygon', slug: 'polygon', logo: null, isActive: true, sortOrder: 1, description: 'Merek sepeda asli Indonesia, kualitas dunia' },
  { id: 'brd-2', name: 'United', slug: 'united', logo: null, isActive: true, sortOrder: 2, description: 'Sepeda gaya hidup perkotaan' },
  { id: 'brd-3', name: 'Wimcycle', slug: 'wimcycle', logo: null, isActive: true, sortOrder: 3, description: 'Sepeda klasik dan lipat' },
  { id: 'brd-4', name: 'Pacific', slug: 'pacific', logo: null, isActive: true, sortOrder: 4, description: 'Sepeda anak dan keluarga' },
  { id: 'brd-5', name: 'Element', slug: 'element', logo: null, isActive: true, sortOrder: 5, description: 'Sepeda performa tinggi' },
  { id: 'brd-6', name: 'ASC', slug: 'asc', logo: null, isActive: true, sortOrder: 6, description: 'Sepeda premium enduro dan gravel' },
  { id: 'brd-7', name: 'ProMax', slug: 'promax', logo: null, isActive: true, sortOrder: 7, description: 'Komponen dan aksesoris sepeda' },
  { id: 'brd-8', name: 'XDS', slug: 'xds', logo: null, isActive: true, sortOrder: 8, description: 'Sepeda trail dan MTB' },
  { id: 'brd-9', name: 'Shimano', slug: 'shimano', logo: null, isActive: true, sortOrder: 9, description: 'Komponen drivetrain dan brake terdepan' },
  { id: 'brd-10', name: 'SRAM', slug: 'sram', logo: null, isActive: true, sortOrder: 10, description: 'Komponen sepeda performa tinggi' },
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
