import type { Metadata } from 'next';
import { ProductDetail } from './product-detail';
import { getMockProduct } from '@/lib/mock-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProduct(slug);
  if (!product) return { title: 'Produk tidak ditemukan' };

  const price = product.salePrice || product.price;
  const title = `${product.name} — Rp ${Number(price).toLocaleString('id-ID')} | SEPEDAMANIA`;
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
      canonical: `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/produk/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
