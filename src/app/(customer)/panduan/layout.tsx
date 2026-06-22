import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PanduanSidebar } from './panduan-sidebar';
import { PanduanBreadcrumb } from './panduan-breadcrumb';

export const metadata: Metadata = {
  title: {
    template: '%s | Panduan | SEPEDAMANIA',
    default: 'Panduan & Tips Sepeda | SEPEDAMANIA',
  },
  description: 'Kumpulan artikel dan panduan lengkap seputar sepeda untuk membantu Anda mendapatkan pengalaman bersepeda terbaik.',
};

const articles = [
  { slug: 'memilih-sepeda-pertama', title: 'Panduan Memilih Sepeda Pertama', description: 'Tips memilih sepeda yang sesuai dengan kebutuhan dan budget Anda.' },
  { slug: 'cara-merawat-sepeda', title: 'Cara Merawat Sepeda Agar Awet', description: 'Panduan perawatan sepeda agar tetap prima dan tahan lama.' },
  { slug: 'tips-keamanan-berkendara', title: 'Tips Keamanan Berkendara', description: 'Tips penting untuk keselamatan saat bersepeda di jalan raya.' },
  { slug: 'panduan-ukuran-sepeda', title: 'Panduan Ukuran Sepeda', description: 'Cara memilih ukuran frame sepeda yang tepat untuk kenyamanan maksimal.' },
];

export default function PanduanLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-4 sm:py-6 lg:py-8">
      <PanduanBreadcrumb articles={articles} />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-4">
        {/* Sidebar — desktop: vertical, mobile: horizontal scroll */}
        <aside className="lg:w-72 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <h2 className="hidden lg:block text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Daftar Panduan
            </h2>
            <PanduanSidebar articles={articles} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </Container>
  );
}
