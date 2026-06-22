'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, TrendingUp, Star, ShieldCheck } from 'lucide-react';

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
    accent: '#2563EB',
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
    accent: '#7C3AED',
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
    accent: '#DC2626',
  },
];

const stats = [
  { icon: Star, value: '500+', label: 'Produk' },
  { icon: TrendingUp, value: '10rb+', label: 'Pelanggan' },
  { icon: ShieldCheck, value: '5', label: 'Brand Ternama' },
  { icon: ChevronRight, value: 'Gratis*', label: 'Ongkir' },
];

function ChainringPattern({ className }: { className?: string }) {
  return (
    <svg className={cn('absolute opacity-[0.04] pointer-events-none', className)} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="0.5" />
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1={100 + 55 * Math.cos((i * 30 * Math.PI) / 180)}
          y1={100 + 55 * Math.sin((i * 30 * Math.PI) / 180)}
          x2={100 + 70 * Math.cos((i * 30 * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((i * 30 * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(18)].map((_, i) => (
        <circle
          key={i}
          cx={100 + 85 * Math.cos((i * 20 * Math.PI) / 180)}
          cy={100 + 85 * Math.sin((i * 20 * Math.PI) / 180)}
          r="3"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

function SpeedLines({ className }: { className?: string }) {
  return (
    <svg className={cn('absolute pointer-events-none', className)} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1={50 + i * 45}
          y1={40 + i * 15}
          x2={50 + i * 55}
          y2={40 + i * 15}
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-[0.06]"
          strokeLinecap="round"
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <line
          key={i}
          x1={60 + i * 55}
          y1={130 - i * 10}
          x2={60 + i * 70}
          y2={130 - i * 10}
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-[0.04]"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

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
    <div className="relative overflow-hidden rounded-2xl bg-[#0F172A]">
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
          </div>
        ))}

        {/* Chainring decorative */}
        <ChainringPattern className="text-white right-4 top-4 w-40 h-40 hidden xl:block" />
        <SpeedLines className="text-white bottom-0 left-1/2 w-full h-24" />

        {/* Left: Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-14">
          <div className="mb-5">
            <Image
              src="/images/logo-sepedamania.png"
              alt="SEPEDAMANIA"
              width={180}
              height={48}
              className="h-10 w-auto brightness-0 invert"
              priority
            />
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5 w-fit">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              current === 0 ? 'bg-[#2563EB]' : current === 1 ? 'bg-[#7C3AED]' : 'bg-[#DC2626]',
            )} />
            {slide.badge}
          </p>

          <h1 className="text-5xl font-extrabold text-white font-display leading-[1.1] mb-1">
            {slide.title}
          </h1>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-display leading-[1.1] mb-4">
            {slide.titleAccent}
          </h1>
          <p className="text-[#94A3B8] text-base mb-7 max-w-md leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 bg-white text-[#0F172A] font-semibold px-7 py-3.5 rounded-xl hover:bg-[#F1F5F9] transition-all text-sm active:scale-[0.97]"
            >
              {slide.cta} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#94A3B8] hover:text-white px-4 py-3.5 transition-colors"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>

        {/* Right: Stats + visual */}
        <div className="relative z-10 flex flex-col justify-end px-12 py-14">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={cn(
                  'rounded-xl border p-4 backdrop-blur-sm',
                  'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors',
                )}>
                  <Icon className="w-4 h-4 text-[#94A3B8] mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-12 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current ? 'bg-white w-6 h-2' : 'bg-white/30 w-2 h-2 hover:bg-white/50',
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
            <ChainringPattern className="text-white right-0 top-0 w-32 h-32" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16">
              <div className="mb-3">
                <Image
                  src="/images/logo-sepedamania.png"
                  alt="SEPEDAMANIA"
                  width={140}
                  height={36}
                  className="h-8 w-auto brightness-0 invert"
                  priority
                />
              </div>
              <p className={cn(
                'inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3 w-fit',
              )}>
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  i === 0 ? 'bg-[#2563EB]' : i === 1 ? 'bg-[#7C3AED]' : 'bg-[#DC2626]',
                )} />
                {s.badge}
              </p>
              <h2 className="text-3xl font-extrabold text-white font-display leading-tight mb-1">
                {s.title}
              </h2>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-display leading-tight mb-2">
                {s.titleAccent}
              </h2>
              <p className="text-sm text-[#94A3B8] mb-5 max-w-xs">
                {s.subtitle}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl w-fit active:scale-[0.97] transition-transform">
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
                i === current ? 'bg-white w-5 h-1.5' : 'bg-white/30 w-1.5 h-1.5',
              )}
            />
          ))}
        </div>

        {/* Mobile stats row */}
        <div className="grid grid-cols-4 gap-1.5 px-4 py-3 bg-[#0F172A]">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-3 h-3 text-[#94A3B8] mx-auto mb-0.5" />
                <p className="text-xs font-bold text-white">{stat.value}</p>
                <p className="text-[9px] text-[#64748B]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
