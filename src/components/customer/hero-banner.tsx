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
    gradient: 'from-blue-600/90 to-blue-900/90',
  },
  {
    id: 2,
    image: '/images/banners/banner-2.jpg',
    title: 'Road Bike Premium',
    subtitle: 'Kecepatan tanpa batas. Mulai dari Rp 4,5 Juta',
    link: '/kategori/road-bike',
    gradient: 'from-slate-800/90 to-slate-900/90',
  },
  {
    id: 3,
    image: '/images/banners/banner-3.jpg',
    title: 'Fixie Urban Style',
    subtitle: 'Tampil beda di jalanan kota. Free helmet!',
    link: '/kategori/fixie',
    gradient: 'from-amber-800/90 to-amber-900/90',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 bg-[#111827]">
      <div className="relative h-52 sm:h-64 lg:h-80">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-r', banner.gradient)} />
            {banner.image && (
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover mix-blend-overlay"
                sizes="100vw"
                priority={index === 0}
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
              <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-2">
                {index === 0 ? 'Featured' : index === 1 ? 'Premium' : 'New'}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 font-display">
                {banner.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-5 max-w-md">{banner.subtitle}</p>
              <span className="inline-flex items-center text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full w-fit hover:bg-white/30 transition-colors">
                Lihat Koleksi
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-[#111827]" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-[#111827]" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === current ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </div>
  );
}
