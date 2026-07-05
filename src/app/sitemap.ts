import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.sepedamania.com'

const staticPages = [
  { url: baseUrl, priority: 1, freq: 'daily' as const },
  { url: `${baseUrl}/cari`, priority: 0.8, freq: 'daily' as const },
  { url: `${baseUrl}/flash-sale`, priority: 0.9, freq: 'daily' as const },
  { url: `${baseUrl}/produk-terlaris`, priority: 0.9, freq: 'daily' as const },
  { url: `${baseUrl}/bike-finder`, priority: 0.7, freq: 'weekly' as const },
  { url: `${baseUrl}/pengembalian`, priority: 0.5, freq: 'monthly' as const },
  { url: `${baseUrl}/pengiriman`, priority: 0.5, freq: 'monthly' as const },
  { url: `${baseUrl}/syarat-ketentuan`, priority: 0.3, freq: 'monthly' as const },
  { url: `${baseUrl}/kebijakan-privasi`, priority: 0.3, freq: 'monthly' as const },
  { url: `${baseUrl}/kontak`, priority: 0.5, freq: 'monthly' as const },
  { url: `${baseUrl}/panduan`, priority: 0.6, freq: 'weekly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categoryEntries: MetadataRoute.Sitemap = []
  let productEntries: MetadataRoute.Sitemap = []

  try {
    const categories = await prisma.category.findMany({ select: { slug: true, createdAt: true } })
    categoryEntries = categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch {
    // Database unavailable — skip dynamic entries
  }

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 1000,
    })
    productEntries = products.map((p) => ({
      url: `${baseUrl}/produk/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Database unavailable — skip dynamic entries
  }

  return [
    ...staticPages.map((p) => ({ url: p.url, lastModified: new Date(), changeFrequency: p.freq, priority: p.priority })),
    ...categoryEntries,
    ...productEntries,
  ]
}
