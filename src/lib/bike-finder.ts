// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BikeFinderOptions {
  height: number;
  budget: number;
  usage: 'trail' | 'road' | 'city' | 'freestyle' | 'daily';
  roadType: 'offroad' | 'asphalt' | 'mixed' | 'paved';
  preference: 'speed' | 'comfort' | 'durability' | 'style' | 'allround';
}

export interface BikeFinderProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  images: string[];
  variants: { id: string; name: string; value: string; stock: number; price: number | null; sku: string; productId?: string }[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
  stock: number;
  weight: number;
  sold: number;
  rating: number;
  reviewCount: number;
  description: string;
}

export interface BikeMatch {
  product: BikeFinderProduct;
  score: number;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Mapping tables
// ---------------------------------------------------------------------------

const usageMap: Record<string, string[]> = {
  trail: ['cat-1'],
  road: ['cat-2'],
  freestyle: ['cat-3'],
  city: ['cat-4', 'cat-5'],
  daily: ['cat-4', 'cat-5'],
};

const roadMap: Record<string, string[]> = {
  offroad: ['cat-1'],
  asphalt: ['cat-2', 'cat-4'],
  mixed: ['cat-5'],
  paved: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5'],
};

const prefMap: Record<string, string[]> = {
  speed: ['cat-2', 'cat-4'],
  comfort: ['cat-5'],
  durability: ['cat-1'],
  style: ['cat-4', 'cat-3'],
  allround: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5'],
};

// ---------------------------------------------------------------------------
// Labels (Bahasa Indonesia)
// ---------------------------------------------------------------------------

export const USAGE_LABELS: Record<string, string> = {
  trail: 'Trail / Gunung',
  road: 'Road / Jalan Raya',
  freestyle: 'Freestyle / BMX',
  city: 'Kota',
  daily: 'Harian',
};

export const ROAD_LABELS: Record<string, string> = {
  offroad: 'Offroad',
  asphalt: 'Aspal',
  mixed: 'Campuran',
  paved: 'Beraspal',
};

export const PREF_LABELS: Record<string, string> = {
  speed: 'Kecepatan',
  comfort: 'Kenyamanan',
  durability: 'Ketahanan',
  style: 'Gaya',
  allround: 'Serba Bisa',
};

export const USAGE_DESCRIPTIONS: Record<string, string> = {
  trail: 'Medan berat, jalur offroad',
  road: 'Jarak jauh, aspal mulus',
  freestyle: 'Trik, park, street',
  city: 'Mobilitas perkotaan',
  daily: 'Ke kantor, kuliah, santai',
};

export const ROAD_DESCRIPTIONS: Record<string, string> = {
  offroad: 'Tanah, kerikil, hutan',
  asphalt: 'Jalan raya beraspal',
  mixed: 'Aspal & tanah bergantian',
  paved: 'Semua jenis jalan',
};

export const PREF_DESCRIPTIONS: Record<string, string> = {
  speed: 'Kebut-kebutan di jalan',
  comfort: 'Nyaman seharian',
  durability: 'Tangguh dan awet',
  style: 'Tampilan kece',
  allround: 'Semua dalam satu',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function heightToFrame(height: number): 'S' | 'M' | 'L' {
  if (height <= 160) return 'S';
  if (height <= 175) return 'M';
  return 'L';
}

function frameFits(product: BikeFinderProduct, height: number): boolean {
  const target = heightToFrame(height);
  if (!product.variants || product.variants.length === 0) return false;

  for (const v of product.variants) {
    const val = v.value;
    if (target === 'S' && (val.startsWith('XS') || val.startsWith('S'))) return true;
    if (target === 'M' && val.startsWith('M')) return true;
    if (target === 'L' && (val.startsWith('XL') || val.startsWith('L'))) return true;
  }
  return false;
}

function realPrice(p: BikeFinderProduct): number {
  return p.salePrice ?? p.price;
}

function shortPrice(n: number): string {
  if (n >= 1_000_000) {
    const juta = n / 1_000_000;
    return `Rp${Number.isInteger(juta) ? juta : juta.toFixed(1)}jt`;
  }
  if (n >= 1_000) {
    const ribu = n / 1_000;
    return `Rp${Number.isInteger(ribu) ? ribu : ribu.toFixed(0)}rb`;
  }
  return `Rp${n}`;
}

// ---------------------------------------------------------------------------
// Rule Engine
// ---------------------------------------------------------------------------

export function findBikes(options: BikeFinderOptions, products: BikeFinderProduct[]): BikeMatch[] {
  const { height, budget, usage, roadType, preference } = options;

  const scored: BikeMatch[] = products.map((product) => {
    const reasons: string[] = [];
    let score = 0;
    const catId = product.categoryId;

    const useCats = usageMap[usage];
    if (useCats.includes(catId)) {
      score += 35;
      reasons.push(`Cocok untuk penggunaan ${USAGE_LABELS[usage]}`);
    }

    const rc = roadMap[roadType];
    if (rc.includes(catId)) {
      score += 25;
      reasons.push(`Sesuai untuk medan ${ROAD_LABELS[roadType]}`);
    }

    const pc = prefMap[preference];
    if (pc.includes(catId)) {
      score += 25;
      reasons.push(`Prioritas ${PREF_LABELS[preference]}`);
    }

    const price = realPrice(product);
    if (price <= budget) {
      score += 10;
      reasons.push(`Harga ${shortPrice(price)} sesuai budget`);
    } else if (price <= budget * 1.2) {
      score += 5;
      reasons.push(`Harga ${shortPrice(price)} — sedikit di atas budget`);
    }

    if (frameFits(product, height)) {
      score += 5;
      const sizeLetter = heightToFrame(height);
      reasons.push(`Tersedia ukuran frame ${sizeLetter} untuk tinggi Anda`);
    }

    return { product, score, reasons };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
