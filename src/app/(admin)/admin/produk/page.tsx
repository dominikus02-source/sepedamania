'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useAdminProducts } from '@/lib/admin-store';
import { getAllCategories, getAllBrands } from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Search, Image as ImageIcon, ChevronLeft, ChevronRight, Trash2, Eye, EyeOff, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { AdminStore } from '@/lib/admin-store';

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const { products, loading, refresh } = useAdminProducts();
  const [allCats, setAllCats] = useState<CatalogCategory[]>([]);
  const [allBrands, setAllBrands] = useState<CatalogBrand[]>([]);
  useEffect(() => {
    setAllCats(getAllCategories());
    setAllBrands(getAllBrands());
  }, []);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];
    if (q) {
      const query = q.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
    }
    if (category) {
      result = result.filter((p) => p.categoryId === category);
    }
    if (brand) {
      result = result.filter((p) => p.brandId === brand);
    }
    if (status === 'active') {
      result = result.filter((p) => p.isActive);
    } else if (status === 'inactive') {
      result = result.filter((p) => !p.isActive);
    }
    return result;
  }, [products, q, category, brand, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const getCatName = (id: string) => allCats.find((c) => c.id === id)?.name || '-';
  const getBrandName = (id: string) => allBrands.find((b) => b.id === id)?.name || '-';
  const { toast } = useToast();

  const handleToggleActive = (slug: string, current: boolean) => {
    AdminStore.updateProduct(slug, { isActive: !current });
    refresh();
    toast(`Produk ${current ? 'dinonaktifkan' : 'diaktifkan'}`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Hapus "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    AdminStore.deleteProduct(id);
    refresh();
    toast('Produk berhasil dihapus', 'success');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-10 w-full bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-64 bg-[#F2F2F7] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Produk</h1>
          <p className="mt-1 text-sm text-[#64748B]">Kelola katalog produk, harga, stok, dan status toko.</p>
        </div>
        <Link href="/admin/produk/tambah">
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-1" /> Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap items-end">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <Input
            placeholder="Cari produk..."
            className="pl-9"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-[180px]">
          <Select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Semua Kategori' },
              ...allCats.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
        <div className="w-[150px]">
          <Select
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Semua Merek' },
              ...allBrands.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
        </div>
        <div className="w-[140px]">
          <Select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Semua Status' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Nonaktif' },
            ]}
          />
        </div>
        {filtered.length > 0 && (
          <p className="text-xs text-[#8E8E93] whitespace-nowrap">
            {filtered.length} produk
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
              <th className="text-left p-3 font-medium text-[#8E8E93] w-12">Gbr</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Produk</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">SKU</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Kategori</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Merek</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Harga</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Stok</th>
              <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                <td className="p-3">
                  {p.images && p.images.length > 0 ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover border border-[#E5E5EA]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#F2F2F7] flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-[#8E8E93]" />
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className="font-medium text-[#1C1C1E]">{p.name}</span>
                </td>
                <td className="p-3 text-[#8E8E93] font-mono text-xs">{p.sku}</td>
                <td className="p-3 text-[#8E8E93]">{getCatName(p.categoryId)}</td>
                <td className="p-3 text-[#8E8E93]">{getBrandName(p.brandId)}</td>
                <td className="p-3 text-right font-medium">
                  {p.salePrice ? (
                    <span>
                      <span className="text-[#FF3B30]">{formatPrice(p.salePrice)}</span>{' '}
                      <span className="text-[#8E8E93] line-through text-xs">{formatPrice(p.price)}</span>
                    </span>
                  ) : (
                    formatPrice(p.price)
                  )}
                </td>
                <td className="p-3 text-right">
                  <Badge variant={p.stock > 5 ? 'success' : 'destructive'}>{p.stock}</Badge>
                </td>
                <td className="p-3 text-center">
                  <Badge variant={p.isActive ? 'success' : 'default'}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleToggleActive(p.slug, p.isActive)}
                      className="p-1.5 rounded-lg hover:bg-[#F2F2F7] transition-colors"
                      title={p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {p.isActive ? <EyeOff className="w-3.5 h-3.5 text-[#8E8E93]" /> : <Eye className="w-3.5 h-3.5 text-[#34C759]" />}
                    </button>
                    <Link
                      href={`/admin/produk/${p.slug}`}
                      className="p-1.5 rounded-lg hover:bg-[#F2F2F7] transition-colors"
                      title="Edit"
                    >
                      <span className="text-xs font-medium text-[#F5A623]">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="text-center py-12 text-[#8E8E93] text-sm">
            {q || category || status ? 'Tidak ada produk yang cocok dengan filter.' : 'Belum ada produk.'}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
          </Button>
          <span className="text-sm text-[#8E8E93]">
            Halaman {safePage} dari {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
            Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
