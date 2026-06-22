import type { Metadata } from 'next';
import { BikeFinderClient } from './bike-finder-client';

export const metadata: Metadata = {
  title: 'Bike Finder — Cari Sepeda Impianmu | SEPEDAMANIA',
  description:
    'Temukan sepeda yang cocok untukmu! Jawab beberapa pertanyaan dan dapatkan rekomendasi sepeda terbaik dari SEPEDAMANIA.',
};

export default function BikeFinderPage() {
  return <BikeFinderClient />;
}
