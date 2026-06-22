import { mockProducts } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BikeFinderOptions {
  height: number; // cm
  budget: number; // max price in IDR
  usage: 'trail' | 'road' | 'city' | 'freestyle' | 'daily';
  roadType: 'offroad' | 'asphalt' | 'mixed' | 'paved';
  preference: 'speed' | 'comfort' | 'durability' | 'style' | 'allround';
}

export interface BikeMatch {
  product: (typeof mockProducts)[0];
  score: number;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Mapping tables
// ---------------------------------------------------------------------------

/** Usage → matching category IDs */
const usageMap: Record<string, string[]> = {
  trail: ['1'], // MTB
  road: ['2'], // Road Bike
  freestyle: ['3'], // BMX
  city: ['4', '5'], // Fixie, City Bike
  daily: ['4', '5'], // Fixie, City Bike
};

/** Road type → matching category IDs */
const roadMap: Record<string, string[]> = {
  offroad: ['1'], // MTB
  asphalt: ['2', '4'], // Road Bike, Fixie
  mixed: ['5'], // City Bike
  paved: ['1', '2', '3', '4', '5'], // all bikes
};

/** Preference → matching category IDs */
const prefMap: Record<string, string[]> = {
  speed: ['2', '4'], // Road Bike, Fixie
  comfort: ['5'], // City Bike
  durability: ['1'], // MTB
  style: ['4', '3'], // Fixie, BMX
  allround: ['1', '2', '3', '4', '5'], // any bike
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

/**
 * Maps rider height (cm) to a generalised frame-size letter.
 */
function heightToFrame(height: number): 'S' | 'M' | 'L' {
  if (height <= 160) return 'S';
  if (height <= 175) return 'M';
  return 'L';
}

/**
 * Checks whether the product lists a variant whose value starts with a size
 * letter that matches the rider's height.
 */
function frameFits(product: (typeof mockProducts)[0], height: number): boolean {
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

/** Effective price the customer would pay. */
function realPrice(p: (typeof mockProducts)[0]): number {
  return p.salePrice ?? p.price;
}

/** Short currency string e.g. Rp4,5jt or Rp599rb */
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

export function findBikes(options: BikeFinderOptions): BikeMatch[] {
  const { height, budget, usage, roadType, preference } = options;

  const scored: BikeMatch[] = mockProducts.map((product) => {
    const reasons: string[] = [];
    let score = 0;
    const catId = product.categoryId;

    // 1. Usage match  ──  max 35 pts
    const useCats = usageMap[usage];
    if (useCats.includes(catId)) {
      score += 35;
      reasons.push(`Cocok untuk penggunaan ${USAGE_LABELS[usage]}`);
    }

    // 2. Road-type match  ──  max 25 pts
    const rc = roadMap[roadType];
    if (rc.includes(catId)) {
      score += 25;
      reasons.push(`Sesuai untuk medan ${ROAD_LABELS[roadType]}`);
    }

    // 3. Preference match  ──  max 25 pts
    const pc = prefMap[preference];
    if (pc.includes(catId)) {
      score += 25;
      reasons.push(`Prioritas ${PREF_LABELS[preference]}`);
    }

    // 4. Budget fit  ──  max 10 pts
    const price = realPrice(product);
    if (price <= budget) {
      score += 10;
      reasons.push(`Harga ${shortPrice(price)} sesuai budget`);
    } else if (price <= budget * 1.2) {
      score += 5;
      reasons.push(`Harga ${shortPrice(price)} — sedikit di atas budget`);
    }

    // 5. Frame-size fit  ──  max 5 pts
    if (frameFits(product, height)) {
      score += 5;
      const sizeLetter = heightToFrame(height);
      reasons.push(`Tersedia ukuran frame ${sizeLetter} untuk tinggi Anda`);
    }

    return { product, score, reasons };
  });

  // Sort descending by score, return top 3
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
