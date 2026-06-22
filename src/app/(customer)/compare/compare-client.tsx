'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useCompareStore } from '@/store/compare-store';
import { useToast } from '@/components/ui/toaster';
import {
  BarChart3,
  Trash2,
  X,
  ShoppingBag,
  Star,
  Plus,
} from 'lucide-react';

export function CompareClient() {
  const { items, removeItem, clearAll } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-sm text-[#8E8E93]">
        Memuat perbandingan...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-8 h-8 text-[#8E8E93]" />}
        title="Belum Ada Produk"
        description="Tambahkan produk untuk membandingkan spesifikasi dan harga"
        action={
          <Link href="/">
            <Button variant="accent">Jelajahi Produk</Button>
          </Link>
        }
      />
    );
  }

  // Collect all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specs || {})))
  );

  // Fixed row labels that are always shown
  const fixedRows = [
    { label: 'Harga', key: 'price' },
    { label: 'Kategori', key: 'category' },
    { label: 'Merek', key: 'brand' },
    { label: 'Stok', key: 'stock' },
    { label: 'Berat', key: 'weight' },
    { label: 'Rating', key: 'rating' },
  ] as const;

  const renderCell = (item: (typeof items)[0], key: string) => {
    switch (key) {
      case 'price':
        return (
          <div>
            {item.salePrice && item.salePrice < item.price ? (
              <>
                <span className="text-base font-bold text-[#EF4444]">
                  {formatPrice(item.salePrice)}
                </span>
                <span className="block text-[10px] text-[#94A3B8] line-through">
                  {formatPrice(item.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-[#0F172A]">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
        );
      case 'category':
        return (
          <span className="text-sm text-[#0F172A]">{item.category}</span>
        );
      case 'brand':
        return (
          <span className="text-sm text-[#0F172A]">{item.brand}</span>
        );
      case 'stock':
        return (
          <span
            className={`text-sm font-medium ${
              item.stock > 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'
            }`}
          >
            {item.stock > 0 ? `${item.stock} tersedia` : 'Habis'}
          </span>
        );
      case 'weight':
        return (
          <span className="text-sm text-[#0F172A]">
            {(item.weight / 1000).toFixed(1)} kg
          </span>
        );
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
            <span className="text-sm font-medium">{item.rating || '-'}</span>
            {item.reviewCount > 0 && (
              <span className="text-[10px] text-[#8E8E93]">
                ({item.reviewCount})
              </span>
            )}
          </div>
        );
      default:
        // Dynamic spec row
        return (
          <span className="text-sm text-[#0F172A]">
            {item.specs?.[key] || '-'}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1E]">
            Bandingkan Produk
          </h1>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            {items.length} dari 3 produk
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearAll();
            toast('Perbandingan dikosongkan', 'info');
          }}
          className="text-xs"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Hapus Semua
        </Button>
      </div>

      {/* Minimum products warning */}
      {items.length < 2 && (
        <div className="mb-4 p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <p className="text-xs text-[#92400E]">
            Tambahkan minimal 2 produk untuk membandingkan
          </p>
        </div>
      )}

      {/* Comparison Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div
          className="min-w-[640px]"
          style={
            {
              '--cols': items.length + 1,
            } as React.CSSProperties
          }
        >
          {/* Product header row */}
          <div
            className="grid gap-px bg-[#E2E8F0] rounded-t-2xl overflow-hidden"
            style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}
          >
            {/* Empty top-left cell */}
            <div className="bg-[#F8FAFC] p-3 flex items-end">
              <span className="text-[10px] font-medium text-[#8E8E93] uppercase tracking-wider">
                Produk
              </span>
            </div>

            {/* Product columns */}
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-3 flex flex-col items-center text-center relative"
              >
                <button
                  onClick={() => {
                    removeItem(item.productId);
                    toast('Produk dihapus dari perbandingan', 'info');
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#FF3B30]/10 transition-colors"
                  aria-label={`Hapus ${item.name}`}
                >
                  <X className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>

                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F1F5F9] mb-2">
                  <Image
                    src={item.image || '/images/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <Link
                  href={`/produk/${item.slug}`}
                  className="text-xs font-semibold text-[#0F172A] leading-snug line-clamp-2 hover:text-[#2563EB] transition-colors"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Fixed data rows */}
          {fixedRows.map((row) => (
            <div
              key={row.key}
              className="grid gap-px bg-[#E2E8F0]"
              style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}
            >
              <div className="bg-[#F8FAFC] p-3 flex items-center">
                <span className="text-xs font-medium text-[#64748B]">
                  {row.label}
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${row.key}`}
                  className="bg-white p-3 flex items-center"
                >
                  {renderCell(item, row.key)}
                </div>
              ))}
            </div>
          ))}

          {/* Dynamic spec rows */}
          {allSpecKeys.map((specKey) => (
            <div
              key={specKey}
              className="grid gap-px bg-[#E2E8F0]"
              style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}
            >
              <div className="bg-[#F8FAFC] p-3 flex items-center">
                <span className="text-xs font-medium text-[#64748B]">
                  {specKey}
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${specKey}`}
                  className="bg-white p-3 flex items-center"
                >
                  {renderCell(item, specKey)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar with rounded corners */}
      <div
        className="grid gap-px bg-[#E2E8F0] rounded-b-2xl overflow-hidden"
        style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}
      >
        <div className="bg-[#F8FAFC] p-3" />
        {items.map((item) => (
          <div key={item.productId} className="bg-white p-3 flex justify-center">
            <Link href={`/produk/${item.slug}`}>
              <Button variant="accent" size="sm" className="text-xs whitespace-nowrap">
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                Detail
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Add more products hint */}
      {items.length < 3 && (
        <div className="mt-4 p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-white text-center">
          <Plus className="w-5 h-5 text-[#94A3B8] mx-auto mb-1" />
          <p className="text-xs text-[#64748B]">
            Tambahkan hingga {3 - items.length} produk lagi untuk dibandingkan
          </p>
          <Link href="/">
            <Button variant="outline" size="sm" className="mt-2 text-xs">
              Cari Produk Lain
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
