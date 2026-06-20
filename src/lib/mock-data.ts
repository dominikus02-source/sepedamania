export const mockCategories = [
  { id: '1', name: 'MTB', slug: 'mtb', image: null },
  { id: '2', name: 'Road Bike', slug: 'road-bike', image: null },
  { id: '3', name: 'BMX', slug: 'bmx', image: null },
  { id: '4', name: 'Fixie', slug: 'fixie', image: null },
  { id: '5', name: 'City Bike', slug: 'city-bike', image: null },
  { id: '6', name: 'Aksesoris', slug: 'aksesoris', image: null },
];

export const mockBrands = [
  { id: '1', name: 'Polygon', slug: 'polygon', logo: null },
  { id: '2', name: 'United', slug: 'united', logo: null },
  { id: '3', name: 'Wimcycle', slug: 'wimcycle', logo: null },
  { id: '4', name: 'Pacific', slug: 'pacific', logo: null },
  { id: '5', name: 'Element', slug: 'element', logo: null },
];

const reviewsData: Record<string, { rating: number; comment: string; userName: string; createdAt: string }[]> = {
  'polygon-xtrada-7': [
    { rating: 5, comment: 'Sepeda luar biasa! Handling di trail sangat responsif.', userName: 'Budi S.', createdAt: '2025-06-15T10:00:00Z' },
    { rating: 4, comment: 'Kualitas oke, pengiriman cepat. Worth it!', userName: 'Andi R.', createdAt: '2025-06-10T14:30:00Z' },
    { rating: 5, comment: 'Frame ringan, cocok buat XC.', userName: 'Dimas P.', createdAt: '2025-06-05T08:00:00Z' },
  ],
  'united-miami-2': [
    { rating: 4, comment: 'Road bike pertama saya, sangat nyaman.', userName: 'Rina D.', createdAt: '2025-06-12T09:00:00Z' },
    { rating: 5, comment: 'Gesit dan ringan, recommended!', userName: 'Fajar H.', createdAt: '2025-06-08T11:00:00Z' },
    { rating: 4, comment: 'Bagus untuk pemula yang serius di road bike.', userName: 'Dewi K.', createdAt: '2025-06-01T16:00:00Z' },
  ],
  'wimcycle-next-bmx': [
    { rating: 5, comment: 'Tingkat! Frame kokoh buat park.', userName: 'Rizky A.', createdAt: '2025-06-14T13:00:00Z' },
    { rating: 4, comment: 'Mantap buat latihan flatland.', userName: 'Irfan M.', createdAt: '2025-06-09T10:00:00Z' },
  ],
  'pacific-eclipse-fixie': [
    { rating: 5, comment: 'Tampilan keren banget, cocok buat harian.', userName: 'Rina D.', createdAt: '2025-06-11T07:00:00Z' },
    { rating: 4, comment: 'Warna oke, tinggal upgrade pedal aja.', userName: 'Tono S.', createdAt: '2025-06-07T15:00:00Z' },
    { rating: 5, comment: 'Fixie keren dengan harga terjangkau!', userName: 'Sari M.', createdAt: '2025-06-03T12:00:00Z' },
  ],
  'element-urban-7': [
    { rating: 5, comment: 'Sepeda nya keren banget! Nyaman dipake harian.', userName: 'Budi S.', createdAt: '2025-06-01T00:00:00Z' },
    { rating: 4, comment: 'Bagus, cuma warna kurang variasi.', userName: 'Ani W.', createdAt: '2025-05-20T00:00:00Z' },
  ],
  'polygon-monarch-3': [
    { rating: 4, comment: 'Cocok buat beginner yang mau serius MTB.', userName: 'Hendra G.', createdAt: '2025-06-13T09:00:00Z' },
    { rating: 5, comment: 'Bangga punya ini sebagai MTB pertama!', userName: 'Yoga P.', createdAt: '2025-06-06T14:00:00Z' },
  ],
  'united-milano-disc': [
    { rating: 4, comment: 'Rem disc-nya mantap, nyaman di jalan menurun.', userName: 'Cahyo R.', createdAt: '2025-06-10T08:00:00Z' },
  ],
  'helm-sepedamania-pro': [
    { rating: 5, comment: 'Ringan dan nyaman, ventilasi bagus.', userName: 'Sari M.', createdAt: '2025-06-12T10:00:00Z' },
    { rating: 5, comment: 'Desain aerodinamis, recommended!', userName: 'Adi N.', createdAt: '2025-06-05T09:00:00Z' },
    { rating: 4, comment: 'Ukuran M pas di kepala, bahan bagus.', userName: 'Putri A.', createdAt: '2025-05-28T11:00:00Z' },
    { rating: 5, comment: 'Helm terbaik yang pernah saya pakai.', userName: 'Doni K.', createdAt: '2025-05-15T14:00:00Z' },
  ],
};

const productImages: Record<string, string[]> = {
  'polygon-xtrada-7': [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80',
    'https://images.unsplash.com/photo-1576435778678-68b69c49e36e?w=600&q=80',
    'https://images.unsplash.com/photo-1511993243378-f5b6967cd0d9?w=600&q=80',
  ],
  'united-miami-2': [
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
    'https://images.unsplash.com/photo-1562355653-1b898b3d9738?w=600&q=80',
  ],
  'wimcycle-next-bmx': [
    'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&q=80',
    'https://images.unsplash.com/photo-1536684071977-53bc2cb8e04b?w=600&q=80',
  ],
  'pacific-eclipse-fixie': [
    'https://images.unsplash.com/photo-1575585269294-7d28e30a5fce?w=600&q=80',
    'https://images.unsplash.com/photo-1593638380389-9f835ec477a7?w=600&q=80',
  ],
  'element-urban-7': [
    'https://images.unsplash.com/photo-1485965120184-e220f79d9d13?w=600&q=80',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80',
  ],
  'polygon-monarch-3': [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    'https://images.unsplash.com/photo-1605264386833-0bfc561d6c2a?w=600&q=80',
  ],
  'united-milano-disc': [
    'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?w=600&q=80',
    'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=600&q=80',
  ],
  'helm-sepedamania-pro': [
    'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?w=600&q=80',
    'https://images.unsplash.com/photo-1599733589046-10c7f0d8e4e2?w=600&q=80',
  ],
};

function computeRating(slug: string): { rating: number; reviewCount: number } {
  const r = reviewsData[slug] || [];
  if (r.length === 0) return { rating: 0, reviewCount: 0 };
  const avg = r.reduce((s, rv) => s + rv.rating, 0) / r.length;
  return { rating: Math.round(avg * 10) / 10, reviewCount: r.length };
}

export const mockProducts = [
  {
    id: 'p1', name: 'Polygon Xtrada 7', slug: 'polygon-xtrada-7', sku: 'PLG-XTR7-001',
    description: 'Sepeda gunung profesional dengan frame aluminium hydroformed 29er, fork udara Suntour XCR32, dan drivetrain Shimano Deore 12-speed. Cocok untuk trail riding dan kompetisi XC.',
    categoryId: '1', brandId: '1', price: 8499000, salePrice: 7999000, weight: 13500, stock: 15, sold: 47,
    images: productImages['polygon-xtrada-7'], isActive: true, specs: { Frame: 'Aluminium 6061 Hydroformed', Fork: 'Suntour XCR32 Air', Drivetrain: 'Shimano Deore 12-speed', 'Ukuran Roda': '29"', Rem: 'Shimano Deore Disc Brake' },
    category: { id: '1', name: 'MTB', slug: 'mtb' },
    brand: { id: '1', name: 'Polygon', slug: 'polygon' },
    variants: [
      { id: 'v1', name: 'Ukuran Frame', value: 'S (15.5")', stock: 5, price: null, sku: 'PLG-XTR7-S', productId: 'p1' },
      { id: 'v2', name: 'Ukuran Frame', value: 'M (17.5")', stock: 6, price: null, sku: 'PLG-XTR7-M', productId: 'p1' },
      { id: 'v3', name: 'Ukuran Frame', value: 'L (19")', stock: 4, price: null, sku: 'PLG-XTR7-L', productId: 'p1' },
    ],
    reviews: (reviewsData['polygon-xtrada-7'] || []).map((r, i) => ({ id: `r-p1-${i}`, userId: `u${i}`, productId: 'p1', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('polygon-xtrada-7').rating,
    reviewCount: computeRating('polygon-xtrada-7').reviewCount,
  },
  {
    id: 'p2', name: 'United Miami 2.0', slug: 'united-miami-2', sku: 'UNT-MIA2-001',
    description: 'Road bike entry-level dengan frame aluminium 6061, groupset Shimano Claris 2x8-speed, dan wheelset aero profil. Cocok untuk pemula yang ingin serius di dunia road cycling.',
    categoryId: '2', brandId: '2', price: 5499000, salePrice: null, weight: 10500, stock: 10, sold: 23,
    images: productImages['united-miami-2'], isActive: true, specs: { Frame: 'Aluminium 6061', Groupset: 'Shimano Claris 2x8-speed', 'Ukuran Roda': '700c', Rem: 'Caliper Brake', Fork: 'Carbon Aero' },
    category: { id: '2', name: 'Road Bike', slug: 'road-bike' },
    brand: { id: '2', name: 'United', slug: 'united' },
    variants: [
      { id: 'v4', name: 'Ukuran Frame', value: 'XS (47cm)', stock: 3, price: null, sku: 'UNT-MIA2-XS', productId: 'p2' },
      { id: 'v5', name: 'Ukuran Frame', value: 'S (50cm)', stock: 4, price: null, sku: 'UNT-MIA2-S', productId: 'p2' },
    ],
    reviews: (reviewsData['united-miami-2'] || []).map((r, i) => ({ id: `r-p2-${i}`, userId: `u${i + 5}`, productId: 'p2', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('united-miami-2').rating,
    reviewCount: computeRating('united-miami-2').reviewCount,
  },
  {
    id: 'p3', name: 'Wimcycle Next BMX', slug: 'wimcycle-next-bmx', sku: 'WIM-BMX-001',
    description: 'BMX profesional dengan frame chromoly 4130, fork tapered, rims double wall. Siap untuk park, street, dan flatland.',
    categoryId: '3', brandId: '3', price: 3499000, salePrice: 2999000, weight: 11500, stock: 8, sold: 31,
    images: productImages['wimcycle-next-bmx'], isActive: true, specs: { Frame: 'Chromoly 4130', Fork: 'Tapered Chromoly', Rims: 'Double Wall 36H', 'Ukuran Roda': '20"', Crankset: '3-piece Chromoly' },
    category: { id: '3', name: 'BMX', slug: 'bmx' },
    brand: { id: '3', name: 'Wimcycle', slug: 'wimcycle' },
    variants: [
      { id: 'v6', name: 'Ukuran Frame', value: '20"', stock: 4, price: null, sku: 'WIM-BMX-20', productId: 'p3' },
    ],
    reviews: (reviewsData['wimcycle-next-bmx'] || []).map((r, i) => ({ id: `r-p3-${i}`, userId: `u${i + 8}`, productId: 'p3', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('wimcycle-next-bmx').rating,
    reviewCount: computeRating('wimcycle-next-bmx').reviewCount,
  },
  {
    id: 'p4', name: 'Pacific Eclipse Fixie', slug: 'pacific-eclipse-fixie', sku: 'PAC-ECL-001',
    description: 'Fixie urban stylish dengan frame Hi-Ten steel, wheelset double wall 32H, crankset Prowheel, dan flip-flop hub. Pilihan tepat untuk kawula muda perkotaan.',
    categoryId: '4', brandId: '4', price: 2499000, salePrice: null, weight: 12000, stock: 20, sold: 56,
    images: productImages['pacific-eclipse-fixie'], isActive: true, specs: { Frame: 'Hi-Ten Steel', 'Ukuran Roda': '700c', Crankset: 'Prowheel 46T', Hub: 'Flip-Flop', Rem: 'Caliper Brake' },
    category: { id: '4', name: 'Fixie', slug: 'fixie' },
    brand: { id: '4', name: 'Pacific', slug: 'pacific' },
    variants: [
      { id: 'v7', name: 'Ukuran Frame', value: 'S (49cm)', stock: 7, price: null, sku: 'PAC-ECL-S', productId: 'p4' },
      { id: 'v8', name: 'Ukuran Frame', value: 'M (52cm)', stock: 8, price: null, sku: 'PAC-ECL-M', productId: 'p4' },
    ],
    reviews: (reviewsData['pacific-eclipse-fixie'] || []).map((r, i) => ({ id: `r-p4-${i}`, userId: `u${i + 10}`, productId: 'p4', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('pacific-eclipse-fixie').rating,
    reviewCount: computeRating('pacific-eclipse-fixie').reviewCount,
  },
  {
    id: 'p5', name: 'Element Urban 7', slug: 'element-urban-7', sku: 'ELM-URB-001',
    description: 'City bike nyaman dengan frame low step-through, ban 700x38c, drivetrain Shimano Nexus 7-speed internal gear. Ideal untuk jalanan kota.',
    categoryId: '5', brandId: '5', price: 4499000, salePrice: 3999000, weight: 14000, stock: 12, sold: 19,
    images: productImages['element-urban-7'], isActive: true, specs: { Frame: 'Low Step-Through Aluminium', Drivetrain: 'Shimano Nexus 7-speed IGH', 'Ukuran Roda': '700c x 38c', Rem: 'V-Brake', Aksesoris: 'Rack + Mudguard' },
    category: { id: '5', name: 'City Bike', slug: 'city-bike' },
    brand: { id: '5', name: 'Element', slug: 'element' },
    variants: [
      { id: 'v9', name: 'Ukuran Frame', value: 'S (43cm)', stock: 4, price: null, sku: 'ELM-URB-S', productId: 'p5' },
      { id: 'v10', name: 'Ukuran Frame', value: 'M (48cm)', stock: 5, price: null, sku: 'ELM-URB-M', productId: 'p5' },
    ],
    reviews: (reviewsData['element-urban-7'] || []).map((r, i) => ({ id: `r-p5-${i}`, userId: `u${i + 13}`, productId: 'p5', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('element-urban-7').rating,
    reviewCount: computeRating('element-urban-7').reviewCount,
  },
  {
    id: 'p6', name: 'Polygon Monarch 3', slug: 'polygon-monarch-3', sku: 'PLG-MON3-001',
    description: 'MTB hardtail dengan frame aluminium dan fork suspensi. Cocok untuk pemula yang ingin serius di dunia trail.',
    categoryId: '1', brandId: '1', price: 4299000, salePrice: 3899000, weight: 14000, stock: 7, sold: 38,
    images: productImages['polygon-monarch-3'], isActive: true, specs: { Frame: 'Aluminium', Fork: 'Suspension 100mm', Drivetrain: 'Shimano Altus 3x8-speed', 'Ukuran Roda': '27.5"', Rem: 'Mechanical Disc' },
    category: { id: '1', name: 'MTB', slug: 'mtb' },
    brand: { id: '1', name: 'Polygon', slug: 'polygon' },
    variants: [],
    reviews: (reviewsData['polygon-monarch-3'] || []).map((r, i) => ({ id: `r-p6-${i}`, userId: `u${i + 15}`, productId: 'p6', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('polygon-monarch-3').rating,
    reviewCount: computeRating('polygon-monarch-3').reviewCount,
  },
  {
    id: 'p7', name: 'United Milano Disc', slug: 'united-milano-disc', sku: 'UNT-MIL-001',
    description: 'Road bike dengan rem disc mekanis dan groupset Shimano Sora, cocok untuk weekend warrior.',
    categoryId: '2', brandId: '2', price: 6799000, salePrice: null, weight: 11000, stock: 5, sold: 15,
    images: productImages['united-milano-disc'], isActive: true, specs: { Frame: 'Aluminium 6061', Groupset: 'Shimano Sora 3x9-speed', 'Ukuran Roda': '700c', Rem: 'Mechanical Disc', Fork: 'Carbon' },
    category: { id: '2', name: 'Road Bike', slug: 'road-bike' },
    brand: { id: '2', name: 'United', slug: 'united' },
    variants: [],
    reviews: (reviewsData['united-milano-disc'] || []).map((r, i) => ({ id: `r-p7-${i}`, userId: `u${i + 17}`, productId: 'p7', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('united-milano-disc').rating,
    reviewCount: computeRating('united-milano-disc').reviewCount,
  },
  {
    id: 'p8', name: 'Helm SEPEDAMANIA Pro', slug: 'helm-sepedamania-pro', sku: 'SPM-HELM-001',
    description: 'Helm sepeda aerodinamis dengan sistem ventilasi 12 lubang. Ringan dan nyaman untuk semua jenis sepeda.',
    categoryId: '6', brandId: '5', price: 599000, salePrice: 499000, weight: 300, stock: 50, sold: 120,
    images: productImages['helm-sepedamania-pro'], isActive: true, specs: { 'Sistem Ventilasi': '12 Lubang', Berat: '250g', Material: 'In-Mold PC + EPS', 'Sistem Pengunci': 'Ratchet Buckle', Sertifikasi: 'CPSC, EN 1078' },
    category: { id: '6', name: 'Aksesoris', slug: 'aksesoris' },
    brand: { id: '5', name: 'Element', slug: 'element' },
    variants: [
      { id: 'v11', name: 'Ukuran', value: 'M (55-58cm)', stock: 20, price: null, sku: 'SPM-HELM-M', productId: 'p8' },
      { id: 'v12', name: 'Ukuran', value: 'L (59-62cm)', stock: 30, price: null, sku: 'SPM-HELM-L', productId: 'p8' },
    ],
    reviews: (reviewsData['helm-sepedamania-pro'] || []).map((r, i) => ({ id: `r-p8-${i}`, userId: `u${i + 18}`, productId: 'p8', rating: r.rating, comment: r.comment, images: [], createdAt: r.createdAt, user: { name: r.userName, image: null } })),
    rating: computeRating('helm-sepedamania-pro').rating,
    reviewCount: computeRating('helm-sepedamania-pro').reviewCount,
  },
];

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
