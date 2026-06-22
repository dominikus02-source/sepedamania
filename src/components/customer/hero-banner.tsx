'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Zap, Star, ShieldCheck } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'New Collection',
    title: 'Gowes Lebih Jauh,',
    titleAccent: 'Lebih Cepat',
    subtitle: 'Dari MTB trail hingga road bike aerodinamis — temukan sepeda yang cocok dengan gaya ridingmu.',
    cta: 'Jelajahi Sekarang',
    ctaLink: '/kategori',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80',
  },
  {
    id: 2,
    badge: 'Premium Pick',
    title: 'Road Bike Pilihan',
    titleAccent: 'Untuk Juara',
    subtitle: 'Polygon, United, dan merek ternama siap menemani perjalananmu. Mulai dari Rp 4,5 Juta.',
    cta: 'Lihat Road Bike',
    ctaLink: '/kategori/road-bike',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f79d9d13?w=1200&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1485965120184-e220f79d9d13?w=600&q=80',
  },
  {
    id: 3,
    badge: 'Best Deal',
    title: 'Flash Sale Spesial,',
    titleAccent: 'Diskon hingga 15%',
    subtitle: 'Jangan lewatkan penawaran terbatas untuk sepeda pilihan. Stok terbatas, cepat checkout!',
    cta: 'Lihat Flash Sale',
    ctaLink: '/kategori?sort=flash-sale',
    image: 'https://images.unsplash.com/photo-1576435778678-68b69c49e36e?w=1200&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1576435778678-68b69c49e36e?w=600&q=80',
  },
];

const stats = [
  { icon: Star, value: '500+', label: 'Produk', color: '#FBBF24' },
  { icon: Zap, value: '10rb+', label: 'Pelanggan', color: '#F97316' },
  { icon: ShieldCheck, value: '5', label: 'Brand Ternama', color: '#0EA5E9' },
  { icon: ChevronRight, value: 'Gratis*', label: 'Ongkir', color: '#22C55E' },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEF3C7] via-[#FFEDD5] to-[#FEE2E2]">
      {/* Desktop layout */}
      <div className="hidden lg:relative lg:grid lg:grid-cols-2 lg:min-h-[500px]">
        {/* Background image */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          >
            <Image
              src={s.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FEF3C7]/95 via-[#FFEDD5]/90 to-transparent" />
          </div>
        ))}

        {/* Left: Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-14">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] bg-[#FEF3C7] px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3 text-[#F97316]" />
              {slide.badge}
            </span>
            <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-3 py-1.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Produk Original
            </span>
          </div>

          <h1 className="text-5xl font-extrabold text-[#0F172A] font-display leading-[1.1] mb-1">
            {slide.title}
          </h1>
          <h1 className="text-5xl font-extrabold text-[#F97316] font-display leading-[1.1] mb-4">
            {slide.titleAccent}
          </h1>
          <p className="text-[#64748B] text-base mb-7 max-w-md leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#1E293B] transition-all text-sm active:scale-[0.97]"
            >
              {slide.cta} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/flash-sale"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#EF4444] bg-white/80 px-5 py-3.5 rounded-xl hover:bg-white transition-all"
            >
              <Zap className="w-4 h-4" />
              Flash Sale
            </Link>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="relative z-10 flex flex-col justify-end px-12 py-14">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 p-4 hover:bg-white/90 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: stat.color + '20' }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-12 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current ? 'bg-[#F97316] w-6 h-2' : 'bg-[#0F172A]/20 w-2 h-2 hover:bg-[#0F172A]/40',
              )}
            />
          ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden relative">
        {slides.map((s, i) => (
          <Link
            key={s.id}
            href={s.ctaLink}
            className={cn(
              'relative h-[420px] transition-opacity duration-500',
              i === current ? 'block' : 'hidden',
            )}
          >
            <Image
              src={s.mobileImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBEB] via-[#FEF3C7]/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  {s.badge}
                </span>
                <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-1 rounded-full">
                  Original
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] font-display leading-tight mb-1">
                {s.title}
              </h2>
              <h2 className="text-3xl font-extrabold text-[#F97316] font-display leading-tight mb-2">
                {s.titleAccent}
              </h2>
              <p className="text-sm text-[#64748B] mb-5 max-w-xs">
                {s.subtitle}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-[#0F172A] px-5 py-3 rounded-xl w-fit active:scale-[0.97] transition-transform">
                {s.cta} <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current ? 'bg-[#F97316] w-5 h-1.5' : 'bg-[#0F172A]/20 w-1.5 h-1.5',
              )}
            />
          ))}
        </div>

        {/* Mobile stats row */}
        <div className="grid grid-cols-4 gap-1.5 px-4 py-3 bg-white border-t border-[#E2E8F0]">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center mx-auto mb-0.5" style={{ backgroundColor: stat.color + '20' }}>
                  <Icon className="w-3 h-3" style={{ color: stat.color }} />
                </div>
                <p className="text-xs font-bold text-[#0F172A]">{stat.value}</p>
                <p className="text-[9px] text-[#64748B]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
