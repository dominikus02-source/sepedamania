import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CompareClient } from './compare-client';

export const metadata: Metadata = {
  title: 'Bandingkan Produk | SEPEDAMANIA',
  description:
    'Bandingkan spesifikasi, harga, dan fitur produk sepeda pilihan Anda di SEPEDAMANIA.',
  openGraph: {
    title: 'Bandingkan Produk | SEPEDAMANIA',
    description:
      'Bandingkan spesifikasi, harga, dan fitur produk sepeda pilihan Anda di SEPEDAMANIA.',
  },
};

export default function ComparePage() {
  return (
    <div className="p-4">
      <Suspense fallback={<div className="py-16 text-center text-sm text-[#8E8E93]">Memuat perbandingan...</div>}>
        <CompareClient />
      </Suspense>
    </div>
  );
}
