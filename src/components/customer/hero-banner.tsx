'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ShieldCheck, PackageCheck, Truck, CreditCard } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Upgrade Gowesmu Hari Ini',
    subtitle: 'Pilihan sepeda MTB, road bike, fixie, BMX, dan aksesoris terbaik untuk semua gaya berkendara.',
    cta: 'Belanja Sekarang',
    ctaLink: '/kategori',
    secondaryCta: 'Lihat Flash Sale',
    secondaryLink: '#flash-sale',
    image: '/images/banners/banner-1.jpg',
    gradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
  },
  {
    id: 2,
    title: 'Koleksi Road Bike Premium',
    subtitle: 'Kecepatan tanpa batas. Dari Polygon hingga United, semua tersedia di sini.',
    cta: 'Lihat Koleksi',
    ctaLink: '/kategori/road-bike',
    secondaryCta: 'Mulai dari Rp 4,5 Juta',
    secondaryLink: '/kategori/road-bike',
    image: '/images/banners/banner-2.jpg',
    gradient: 'from-[#1E3A5F] via-[#1E293B] to-[#0F172A]',
  },
  {
    id: 3,
    title: 'Style Urban dengan Fixie',
    subtitle: 'Tampil beda di jalanan kota. Koleksi Fixie terbaru dengan harga spesial.',
    cta: 'Lihat Fixie',
    ctaLink: '/kategori/fixie',
    secondaryCta: 'Free Helmet',
    secondaryLink: '/kategori/fixie',
    image: '/images/banners/banner-3.jpg',
    gradient: 'from-[#1A1A2E] via-[#16213E] to-[#0F172A]',
  },
];

const trustBadges = [
  { icon: ShieldCheck, text: 'Produk Original' },
  { icon: PackageCheck, text: 'Siap Kirim Cepat' },
  { icon: CreditCard, text: 'Bayar Aman' },
  { icon: Truck, text: 'Gratis Ongkir*' },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0F172A]">
      {/* Desktop: 2-column */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-[420px]">
        {/* Left: Content */}
        <div className="relative z-10 flex flex-col justify-center px-10 py-12">
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-[0.2em] mb-3">
            {current === 0 ? 'Featured' : current === 1 ? 'Premium' : 'New Collection'}
          </p>
          <h1 className="text-4xl font-bold text-white font-display leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-[#94A3B8] text-base mb-6 max-w-md leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-1.5 bg-white text-[#0F172A] font-semibold px-6 py-3 rounded-xl hover:bg-[#F1F5F9] transition-colors text-sm"
            >
              {slide.cta} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href={slide.secondaryLink}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#94A3B8] hover:text-white px-4 py-3 transition-colors"
            >
              {slide.secondaryCta}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.text} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Icon className="w-3.5 h-3.5" />
                  {badge.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative h-full min-h-[420px]">
          <div className={cn('absolute inset-0 bg-gradient-to-r', slide.gradient)} />
          {slide.image && (
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover mix-blend-overlay"
              sizes="50vw"
              priority={current === 0}
            />
          )}
        </div>
      </div>

      {/* Mobile: Full-width carousel */}
      <div className="lg:hidden">
        <div className="relative h-64 sm:h-72">
          {slides.map((s, index) => (
            <Link
              key={s.id}
              href={s.ctaLink}
              className={cn(
                'absolute inset-0 transition-all duration-500',
                index === current ? 'opacity-100' : 'opacity-0 pointer-events-none',
              )}
            >
              <div className={cn('absolute inset-0 bg-gradient-to-r', s.gradient)} />
              {s.image && (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover mix-blend-overlay"
                  sizes="100vw"
                  priority={index === 0}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-center px-6">
                <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest mb-2">
                  {index === 0 ? 'Featured' : index === 1 ? 'Premium' : 'New'}
                </p>
                <h2 className="text-2xl font-bold text-white font-display mb-2">{s.title}</h2>
                <p className="text-sm text-[#94A3B8] mb-4 max-w-xs">{s.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full w-fit">
                  {s.cta} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === current ? 'bg-white w-5' : 'bg-white/30 w-1.5',
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Desktop dots */}
      <div className="hidden lg:flex absolute bottom-4 left-10 gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn('h-1.5 rounded-full transition-all', index === current ? 'bg-white w-5' : 'bg-white/30 w-1.5')}
          />
        ))}
      </div>
    </div>
  );
}
