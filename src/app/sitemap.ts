import type { MetadataRoute } from 'next'
import { mockProducts, mockCategories } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'

  const productEntries = mockProducts.filter(p => p.isActive).map(p => ({
    url: `${baseUrl}/produk/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryEntries = mockCategories.map(c => ({
    url: `${baseUrl}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cari`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/keranjang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...categoryEntries,
    ...productEntries,
  ]
}
