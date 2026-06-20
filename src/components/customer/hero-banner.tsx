'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: '/images/banners/banner-1.jpg',
    title: 'Koleksi MTB 2025',
    subtitle: 'Siap taklukkan trail dengan diskon hingga 30%',
    link: '/kategori/mtb',
    bg: 'from-orange-500 to-amber-600',
  },
  {
    id: 2,
    image: '/images/banners/banner-2.jpg',
    title: 'Road Bike Premium',
    subtitle: 'Kecepatan tanpa batas. Mulai dari Rp 4,5 Juta',
    link: '/kategori/road-bike',
    bg: 'from-blue-600 to-blue-800',
  },
  {
    id: 3,
    image: '/images/banners/banner-3.jpg',
    title: 'Fixie Urban Style',
    subtitle: 'Tampil beda di jalanan kota. Free helmet!',
    link: '/kategori/fixie',
    bg: 'from-gray-800 to-gray-900',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div className="relative h-48 sm:h-56">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-r', banner.bg)} />
            {banner.image && (
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover mix-blend-overlay opacity-50"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-center p-6">
              <h2 className="text-2xl font-bold text-white mb-1">{banner.title}</h2>
              <p className="text-sm text-white/80 mb-4">{banner.subtitle}</p>
              <span className="inline-flex items-center text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                Lihat Koleksi →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % banners.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === current ? 'bg-white w-6' : 'bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
