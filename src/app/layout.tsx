import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from '@/components/providers'
import { WhatsAppFloating } from '@/components/customer/whatsapp-floating'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
    template: '%s | SEPEDAMANIA',
  },
  description:
    'Beli sepeda MTB, Road Bike, BMX, Fixie & aksesoris terlengkap di SEPEDAMANIA. Harga terbaik, original, pengiriman ke seluruh Indonesia.',
  keywords: [
    'toko sepeda online',
    'beli sepeda',
    'MTB',
    'road bike',
    'BMX',
    'fixie',
    'sepeda gunung',
    'sepeda balap',
  ],
  authors: [{ name: 'SEPEDAMANIA' }],
  creator: 'SEPEDAMANIA',
  publisher: 'SEPEDAMANIA',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'SEPEDAMANIA',
    title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
    description:
      'Beli sepeda MTB, Road Bike, BMX, Fixie & aksesoris terlengkap di SEPEDAMANIA.',
    images: [
      { url: '/og-default.jpg', width: 1200, height: 630, alt: 'SEPEDAMANIA' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEPEDAMANIA — Toko Sepeda Online Terlengkap',
    description:
      'Beli sepeda MTB, Road Bike, BMX, Fixie & aksesoris terlengkap di SEPEDAMANIA.',
    images: ['/og-default.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SEPEDAMANIA',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-180.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-167.png', sizes: '167x167' },
      { url: '/icons/apple-touch-icon-152.png', sizes: '152x152' },
    ],
  },
  other: {
    'msapplication-TileColor': '#1A1A1A',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="SEPEDAMANIA" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E]`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-400 text-black px-4 py-2 rounded-lg z-50 font-medium"
        >
          Langsung ke konten
        </a>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main id="main-content">
              {children}
              <WhatsAppFloating />
            </main>
            <Toaster />
            <ServiceWorkerRegistration />
            <InstallPrompt />
          </ThemeProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
