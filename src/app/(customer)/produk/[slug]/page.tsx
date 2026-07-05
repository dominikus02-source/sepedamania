import type { Metadata } from 'next';
import { ProductDetail } from './product-detail';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, price: true, salePrice: true, images: true, brand: { select: { name: true } }, category: { select: { name: true } } },
  });
  if (!product) return { title: 'Produk tidak ditemukan' };

  const price = product.salePrice || product.price;
  const title = `${product.name} — Rp ${Number(price).toLocaleString('id-ID')}`;
  const description = `Beli ${product.name} di SEPEDAMANIA. ${product.brand?.name} ${product.category?.name}. Harga terbaik, pengiriman cepat ke seluruh Indonesia.`;

  return {
    title,
    description,
    keywords: [product.name, product.brand?.name || '', product.category?.name || '', 'sepeda online', 'beli sepeda'],
    openGraph: {
      title,
      description,
      images: [{ url: product.images[0] || '/og-default.jpg', width: 800, height: 800, alt: product.name }],
      type: 'website',
      locale: 'id_ID',
      siteName: 'SEPEDAMANIA',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0] || '/og-default.jpg'],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL || 'https://www.sepedamania.com'}/produk/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true, price: true, salePrice: true, description: true, images: true, stock: true, sku: true,
      brand: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.sepedamania.com';

  let productJsonLd = null;
  let breadcrumbJsonLd = null;

  if (product) {
    const price = product.salePrice || product.price;
    productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images[0] || `${baseUrl}/og-default.jpg`,
      description: product.description?.slice(0, 300),
      sku: product.sku,
      brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/produk/${slug}`,
        priceCurrency: 'IDR',
        price: Number(price),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };

    breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        ...(product.category ? [{ '@type': 'ListItem', position: 2, name: product.category.name, item: `${baseUrl}/kategori/${product.category.slug}` }] : []),
        { '@type': 'ListItem', position: product.category ? 3 : 2, name: product.name, item: `${baseUrl}/produk/${slug}` },
      ],
    };
  }

  return (
    <>
      {productJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      )}
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}
      <ProductDetail slug={slug} />
    </>
  );
}
