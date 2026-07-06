'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Bike } from 'lucide-react';

const STORAGE_KEY = 'sepedamania-launch-banner-dismissed';

export function LaunchBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!show) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-[#FBBF24]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Bike className="w-4 h-4 text-[#FBBF24] shrink-0 hidden sm:block" />
          <p className="text-xs sm:text-sm text-[#F8FAFC] truncate">
            <span className="font-semibold text-[#FBBF24]">SEPEDAMANIA</span>
            {' — '}Temukan sepeda yang cocok untuk gaya hidupmu.{' '}
            <Link
              href="/kategori"
              className="inline-flex items-center gap-1 text-[#FBBF24] hover:text-[#F59E0B] font-medium underline underline-offset-2 transition-colors"
            >
              Lihat Katalog
            </Link>
          </p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ml-2"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5 text-[#94A3B8]" />
        </button>
      </div>
    </div>
  );
}
