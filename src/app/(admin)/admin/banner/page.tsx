'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { Plus, GripVertical, Trash2, Eye } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

const defaultBanners: Banner[] = [
  {
    id: 'b1',
    title: 'Sepeda Gunung Diskon 50%',
    image: '/images/placeholder.svg',
    link: '/produk/sepeda-gunung-xtreme-29',
    active: true,
    order: 1,
  },
  {
    id: 'b2',
    title: 'Koleksi Sepeda Lipat Terbaru',
    image: '/images/placeholder.svg',
    link: '/kategori/sepeda-lipat',
    active: true,
    order: 2,
  },
  {
    id: 'b3',
    title: 'Free Helm Pembelian Sepeda',
    image: '/images/placeholder.svg',
    link: '/produk/sepeda-balap-speed-3000',
    active: false,
    order: 3,
  },
];

export default function AdminBannerPage() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);

  const toggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      toast(
        `Banner "${banner.title}" ${banner.active ? 'dinonaktifkan' : 'diaktifkan'}`,
        'success'
      );
    }
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast('Banner dihapus', 'success');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Banner</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Banner
        </Button>
      </div>

      <div className="space-y-3">
        {banners
          .sort((a, b) => a.order - b.order)
          .map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-[#94A3B8] cursor-grab shrink-0" />
                  <div className="relative w-24 h-16 rounded-lg bg-[#F1F5F9] overflow-hidden shrink-0">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">
                      {banner.title}
                    </p>
                    <p className="text-xs text-[#64748B] truncate mt-0.5">
                      {banner.link}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBanner(banner.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        banner.active ? 'bg-[#34C759]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                          banner.active ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="p-2 rounded-lg hover:bg-[#FEF2F2] text-[#EF4444]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16">
          <Eye className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <p className="text-[#64748B]">Belum ada banner</p>
          <p className="text-xs text-[#94A3B8] mt-1">
            Tambah banner untuk tampil di halaman utama
          </p>
        </div>
      )}
    </div>
  );
}
