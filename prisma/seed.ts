import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@sepedamania.com' },
    update: {},
    create: {
      email: 'admin@sepedamania.com',
      name: 'Admin SEPEDAMANIA',
      password: '$2a$10$...',
      role: 'ADMIN',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'MTB', slug: 'mtb', image: '/images/categories/mtb.jpg' },
    }),
    prisma.category.create({
      data: { name: 'Road Bike', slug: 'road-bike', image: '/images/categories/road.jpg' },
    }),
    prisma.category.create({
      data: { name: 'BMX', slug: 'bmx', image: '/images/categories/bmx.jpg' },
    }),
    prisma.category.create({
      data: { name: 'Fixie', slug: 'fixie', image: '/images/categories/fixie.jpg' },
    }),
    prisma.category.create({
      data: { name: 'City Bike', slug: 'city-bike', image: '/images/categories/city.jpg' },
    }),
    prisma.category.create({
      data: { name: 'Aksesoris', slug: 'aksesoris', image: '/images/categories/accessories.jpg' },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Polygon', slug: 'polygon', logo: '/images/brands/polygon.png' } }),
    prisma.brand.create({ data: { name: 'United', slug: 'united', logo: '/images/brands/united.png' } }),
    prisma.brand.create({ data: { name: 'Wimcycle', slug: 'wimcycle', logo: '/images/brands/wimcycle.png' } }),
    prisma.brand.create({ data: { name: 'Pacific', slug: 'pacific', logo: '/images/brands/pacific.png' } }),
    prisma.brand.create({ data: { name: 'Element', slug: 'element', logo: '/images/brands/element.png' } }),
  ]);

  // Create products
  const products = [
    {
      name: 'Polygon Xtrada 7',
      slug: 'polygon-xtrada-7',
      sku: 'PLG-XTR7-001',
      description: 'Sepeda gunung profesional dengan frame aluminium hydroformed 29er, fork udara Suntour XCR32, dan drivetrain Shimano Deore 12-speed. Cocok untuk trail riding dan kompetisi XC.',
      categoryId: categories[0].id,
      brandId: brands[0].id,
      price: 8499000,
      salePrice: 7999000,
      weight: 13500,
      images: ['/images/products/xtrada-7-1.jpg', '/images/products/xtrada-7-2.jpg'],
      stock: 15,
      sold: 47,
      isActive: true,
      variants: {
        create: [
          { name: 'Ukuran Frame', value: 'S (15.5")', stock: 5, sku: 'PLG-XTR7-S' },
          { name: 'Ukuran Frame', value: 'M (17.5")', stock: 6, sku: 'PLG-XTR7-M' },
          { name: 'Ukuran Frame', value: 'L (19")', stock: 4, sku: 'PLG-XTR7-L' },
        ],
      },
    },
    {
      name: 'United Miami 2.0',
      slug: 'united-miami-2',
      sku: 'UNT-MIA2-001',
      description: 'Road bike entry-level dengan frame aluminium 6061, groupset Shimano Claris 2x8-speed, dan wheelset aero profil. Cocok untuk daily commute dan weekend ride.',
      categoryId: categories[1].id,
      brandId: brands[1].id,
      price: 5499000,
      salePrice: null,
      weight: 10500,
      images: ['/images/products/miami-2-1.jpg', '/images/products/miami-2-2.jpg'],
      stock: 10,
      sold: 23,
      isActive: true,
      variants: {
        create: [
          { name: 'Ukuran Frame', value: 'XS (47cm)', stock: 3, sku: 'UNT-MIA2-XS' },
          { name: 'Ukuran Frame', value: 'S (50cm)', stock: 4, sku: 'UNT-MIA2-S' },
          { name: 'Ukuran Frame', value: 'M (53cm)', stock: 3, sku: 'UNT-MIA2-M' },
        ],
      },
    },
    {
      name: 'Wimcycle Next BMX',
      slug: 'wimcycle-next-bmx',
      sku: 'WIM-BMX-001',
      description: 'BMX profesional dengan frame chromoly 4130, fork tapered, rims double wall, dan hub cassette 9T. Siap untuk park, street, dan flatland.',
      categoryId: categories[2].id,
      brandId: brands[2].id,
      price: 3499000,
      salePrice: 2999000,
      weight: 11500,
      images: ['/images/products/next-bmx-1.jpg', '/images/products/next-bmx-2.jpg'],
      stock: 8,
      sold: 31,
      isActive: true,
      variants: {
        create: [
          { name: 'Ukuran Frame', value: '20"', stock: 4, sku: 'WIM-BMX-20' },
          { name: 'Ukuran Frame', value: '20.5"', stock: 4, sku: 'WIM-BMX-205' },
        ],
      },
    },
    {
      name: 'Pacific Eclipse Fixie',
      slug: 'pacific-eclipse-fixie',
      sku: 'PAC-ECL-001',
      description: 'Fixie urban stylish dengan frame Hi-Ten steel, wheelset double wall 32H, crankset Prowheel, dan flip-flop hub. Warna glossy elegan.',
      categoryId: categories[3].id,
      brandId: brands[3].id,
      price: 2499000,
      salePrice: null,
      weight: 12000,
      images: ['/images/products/eclipse-1.jpg', '/images/products/eclipse-2.jpg'],
      stock: 20,
      sold: 56,
      isActive: true,
      variants: {
        create: [
          { name: 'Ukuran Frame', value: 'S (49cm)', stock: 7, sku: 'PAC-ECL-S' },
          { name: 'Ukuran Frame', value: 'M (52cm)', stock: 8, sku: 'PAC-ECL-M' },
          { name: 'Ukuran Frame', value: 'L (55cm)', stock: 5, sku: 'PAC-ECL-L' },
        ],
      },
    },
    {
      name: 'Element Urban 7',
      slug: 'element-urban-7',
      sku: 'ELM-URB-001',
      description: 'City bike nyaman dengan frame low step-through, ban 700x38c, drivetrain Shimano Nexus 7-speed internal gear, dan full fender set. Ideal untuk jalanan kota.',
      categoryId: categories[4].id,
      brandId: brands[4].id,
      price: 4499000,
      salePrice: 3999000,
      weight: 14000,
      images: ['/images/products/urban-7-1.jpg', '/images/products/urban-7-2.jpg'],
      stock: 12,
      sold: 19,
      isActive: true,
      variants: {
        create: [
          { name: 'Ukuran Frame', value: 'S (43cm)', stock: 4, sku: 'ELM-URB-S' },
          { name: 'Ukuran Frame', value: 'M (48cm)', stock: 5, sku: 'ELM-URB-M' },
          { name: 'Ukuran Frame', value: 'L (53cm)', stock: 3, sku: 'ELM-URB-L' },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create store settings
  await prisma.storeSettings.create({
    data: {
      storeName: 'SEPEDAMANIA',
      waNumber: '6281234567890',
      storeAddress: 'Jl. Sepeda No. 1',
      storeCity: 'Jakarta Pusat',
      storeProvince: 'DKI Jakarta',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
