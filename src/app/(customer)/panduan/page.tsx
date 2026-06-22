import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Bike, Wrench, Shield, Ruler, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panduan & Tips Sepeda',
  description: 'Kumpulan artikel dan panduan lengkap seputar sepeda untuk membantu Anda mendapatkan pengalaman bersepeda terbaik.',
};

const articles = [
  {
    slug: 'memilih-sepeda-pertama',
    title: 'Panduan Memilih Sepeda Pertama',
    excerpt: 'Bingung memilih sepeda pertama? Simak panduan lengkap mulai dari menentukan budget, jenis sepeda, ukuran frame, hingga tips test ride.',
    readTime: '8 menit',
    icon: Bike,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    color: 'from-amber-400/20 to-amber-500/10',
  },
  {
    slug: 'cara-merawat-sepeda',
    title: 'Cara Merawat Sepeda Agar Awet',
    excerpt: 'Pelajari cara merawat sepeda yang benar agar tetap awet dan selalu siap pakai. Dari membersihkan, melumasi, hingga penyimpanan.',
    readTime: '7 menit',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1557803178-4cf46c63cef6?w=600&q=80',
    color: 'from-blue-400/20 to-blue-500/10',
  },
  {
    slug: 'tips-keamanan-berkendara',
    title: 'Tips Keamanan Berkendara',
    excerpt: 'Keselamatan adalah prioritas utama. Simak tips penting untuk berkendara sepeda yang aman di jalan raya dan area publik.',
    readTime: '6 menit',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1557683311-e1ea197b1e9d?w=600&q=80',
    color: 'from-emerald-400/20 to-emerald-500/10',
  },
  {
    slug: 'panduan-ukuran-sepeda',
    title: 'Panduan Ukuran Sepeda',
    excerpt: 'Temukan ukuran frame sepeda yang paling pas untuk tubuh Anda. Panduan lengkap dengan tabel ukuran untuk berbagai jenis sepeda.',
    readTime: '5 menit',
    icon: Ruler,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80',
    color: 'from-purple-400/20 to-purple-500/10',
  },
];

export default function PanduanIndexPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A]">
          Panduan &amp; Tips Sepeda
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
          Kumpulan artikel dan panduan lengkap seputar sepeda untuk membantu Anda mendapatkan
          pengalaman bersepeda terbaik.
        </p>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {articles.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.slug}
              href={`/panduan/${article.slug}`}
              className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden card-hover hover:border-[#F5A623]/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
            >
              {/* Image */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${article.color}`} />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#F5A623] transition-colors line-clamp-2">
                  {article.title}
                </h2>

                <p className="mt-1.5 text-sm text-[#64748B] leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity">
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
