import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/checkout', '/pesanan', '/profil'] },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.store'}/sitemap.xml`,
  }
}
