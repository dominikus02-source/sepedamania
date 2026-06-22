'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import type { Product } from '@/lib/admin-store';
import { mockCategories, mockBrands } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Save, ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  value: string;
  stock: number;
  price: number | null;
  sku: string;
  productId?: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params?.slug as string | undefined;
  const [ready, setReady] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brandId: '',
    price: '', salePrice: '', weight: '', stock: '', isActive: true,
    metaTitle: '', metaDescription: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [originalSlug, setOriginalSlug] = useState('');

  // New variant form
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({ name: '', value: '', stock: '', sku: '' });

  useEffect(() => {
    if (!slug) return;
    const product = AdminStore.getProductBySlug(slug);
    if (!product) {
      setNotFoundState(true);
      return;
    }
    setOriginalSlug(slug);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      weight: String(product.weight),
      stock: String(product.stock),
      isActive: product.isActive,
      metaTitle: product.name,
      metaDescription: product.description.slice(0, 160),
    });
    setImages(product.images || []);
    setVariants(product.variants || []);
    setReady(true);
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-96 bg-[#F2F2F7] rounded animate-pulse" />
      </div>
    );
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.value || !newVariant.sku) {
      toast('Nama, value, dan SKU varian wajib diisi', 'error');
      return;
    }
    setVariants((prev) => [
      ...prev,
      {
        id: 'v' + Math.random().toString(36).slice(2, 8),
        name: newVariant.name,
        value: newVariant.value,
        stock: Number(newVariant.stock) || 0,
        price: null,
        sku: newVariant.sku,
        productId: '',
      },
    ]);
    setNewVariant({ name: '', value: '', stock: '', sku: '' });
    setShowVariantForm(false);
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated: Record<string, unknown> = {
        name: form.name,
        sku: form.sku,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        weight: Number(form.weight),
        stock: Number(form.stock),
        isActive: form.isActive,
        images,
        variants,
        category: mockCategories.find((c) => c.id === form.categoryId) || { id: '', name: '', slug: '' },
        brand: mockBrands.find((b) => b.id === form.brandId) || { id: '', name: '', slug: '' },
      };
      // If slug changed, update it
      const newSlug = form.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      if (newSlug !== originalSlug) {
        updated.slug = newSlug;
      }
      const ok = AdminStore.updateProduct(originalSlug, updated);
      if (!ok) throw new Error('Produk tidak ditemukan');
      toast('Produk berhasil disimpan', 'success');
      router.push('/admin/produk');
    } catch {
      toast('Gagal menyimpan produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produk">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Edit Produk</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Informasi Dasar */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1C1C1E]">Informasi Produk</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Produk</Label>
              <Input value={form.name} onChange={update('name')} required />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={form.sku} onChange={update('sku')} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={update('description')} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={form.categoryId}
                onChange={update('categoryId')}
                options={mockCategories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Pilih kategori"
              />
            </div>
            <div className="space-y-2">
              <Label>Merek</Label>
              <Select
                value={form.brandId}
                onChange={update('brandId')}
                options={mockBrands.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Pilih merek"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Harga</Label>
              <Input type="number" value={form.price} onChange={update('price')} required />
            </div>
            <div className="space-y-2">
              <Label>Harga Coret / Sale</Label>
              <Input type="number" value={form.salePrice} onChange={update('salePrice')} />
            </div>
            <div className="space-y-2">
              <Label>Berat (gram)</Label>
              <Input type="number" value={form.weight} onChange={update('weight')} required />
            </div>
            <div className="space-y-2">
              <Label>Stok</Label>
              <Input type="number" value={form.stock} onChange={update('stock')} required />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label>Status Produk</Label>
            <select
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === 'active' }))}
              className="flex h-10 rounded-lg border border-[#E5E5EA] bg-white px-3 py-2 text-sm text-[#1C1C1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </section>

        {/* Gambar */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1C1C1E]">Gambar Produk</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 group w-24 h-24">
                <Image
                  src={img}
                  alt={`Gambar ${i + 1}`}
                  fill
                  className="rounded-lg object-cover border border-[#E5E5EA]"
                  sizes="96px"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF3B30] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#F5A623] hover:bg-[#FFF9E6] transition-all duration-200">
              <Plus className="w-5 h-5 text-[#8E8E93]" />
              <span className="text-[10px] text-[#8E8E93] font-medium">Tambah Gambar</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="URL gambar..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={addImage} disabled={!imageUrl.trim()}>
              Tambah
            </Button>
          </div>
          <p className="text-xs text-[#8E8E93]">Masukkan URL gambar untuk ditambahkan. Upload file akan diintegrasikan dengan Cloudinary.</p>
        </section>

        {/* Varian */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1C1C1E]">Varian Produk</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowVariantForm(!showVariantForm)}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Varian
            </Button>
          </div>

          {showVariantForm && (
            <div className="bg-[#F2F2F7] rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nama</Label>
                  <Input
                    placeholder="Ukuran"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    placeholder="M"
                    value={newVariant.value}
                    onChange={(e) => setNewVariant((prev) => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Stok</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant((prev) => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">SKU</Label>
                  <Input
                    placeholder="PRD-XL"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant((prev) => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowVariantForm(false)}>
                  Batal
                </Button>
                <Button type="button" variant="accent" size="sm" onClick={addVariant}>
                  <Plus className="w-3 h-3 mr-1" /> Tambah
                </Button>
              </div>
            </div>
          )}

          {variants.length === 0 ? (
            <p className="text-sm text-[#8E8E93] py-4 text-center">Belum ada varian. Klik &quot;Tambah Varian&quot; untuk menambahkan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-2 font-medium text-[#8E8E93]">Nama</th>
                    <th className="text-left p-2 font-medium text-[#8E8E93]">Value</th>
                    <th className="text-right p-2 font-medium text-[#8E8E93]">Stok</th>
                    <th className="text-left p-2 font-medium text-[#8E8E93]">SKU</th>
                    <th className="text-right p-2 font-medium text-[#8E8E93]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} className="border-b border-[#E5E5EA] last:border-0">
                      <td className="p-2 text-[#1C1C1E]">{v.name}</td>
                      <td className="p-2 text-[#8E8E93]">{v.value}</td>
                      <td className="p-2 text-right">{v.stock}</td>
                      <td className="p-2 text-[#8E8E93] font-mono text-xs">{v.sku}</td>
                      <td className="p-2 text-right">
                        <button type="button" className="text-[#FF3B30] text-xs hover:underline" onClick={() => removeVariant(v.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between p-6 hover:bg-[#F2F2F7]/50 transition-colors"
            onClick={() => setSeoOpen(!seoOpen)}
          >
            <h2 className="text-lg font-semibold text-[#1C1C1E]">SEO</h2>
            {seoOpen ? <ChevronUp className="w-5 h-5 text-[#8E8E93]" /> : <ChevronDown className="w-5 h-5 text-[#8E8E93]" />}
          </button>
          {seoOpen && (
            <div className="px-6 pb-6 space-y-4 border-t border-[#E5E5EA] pt-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={form.metaTitle} onChange={update('metaTitle')} placeholder="Judul untuk SEO" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={form.metaDescription} onChange={update('metaDescription')} rows={3} placeholder="Deskripsi untuk SEO" />
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" variant="accent" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Link href="/admin/produk">
            <Button variant="outline" type="button">Batal</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
