import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';
import { getMockProduct, getMockRelatedProducts } from '@/lib/mock-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getMockProduct(slug);
  if (!product || !product.isActive) notFound();

  const sp = { ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null, variants: product.variants.map(v => ({ ...v, price: v.price ? Number(v.price) : null })), reviews: product.reviews.map(r => ({ ...r })) };
  const sr = getMockRelatedProducts(product.id).map(p => ({ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }));

  return <ProductDetail product={sp} relatedProducts={sr} />;
}
