import type { Metadata } from 'next';
import { mockCategories } from '@/lib/mock-data';
import { CategoryProducts } from './category-products';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) return { title: 'Kategori tidak ditemukan' };
  const title = `${category.name} Terbaik | SEPEDAMANIA`;
  const description = `Temukan koleksi ${category.name} terlengkap di SEPEDAMANIA. Harga kompetitif, produk original, pengiriman ke seluruh Indonesia.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: '/og-default.jpg', width: 1200, height: 630 }] },
  };
}

export default function CategoryPage() {
  return <CategoryProducts />;
}
