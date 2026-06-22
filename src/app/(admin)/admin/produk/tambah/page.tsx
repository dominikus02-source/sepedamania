'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import { getAllCategories, getAllBrands } from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setCategories(getAllCategories());
    setBrands(getAllBrands());
  }, []);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    categoryId: '',
    brandId: '',
    price: '',
    salePrice: '',
    weight: '',
    stock: '',
    isActive: true,
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.brandId) {
      toast('Harap pilih kategori dan merek', 'error');
      return;
    }
    setLoading(true);
    try {
      const product = AdminStore.addProduct({
        name: form.name,
        sku: form.sku,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        weight: Number(form.weight),
        stock: Number(form.stock),
      });
      if (images.length > 0) {
        AdminStore.updateProduct(product.slug, { images });
      }
      toast('Produk berhasil ditambahkan', 'success');
      router.push('/admin/produk');
    } catch {
      toast('Gagal menyimpan produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin/produk">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Tambah Produk</h1>
        </div>
        <p className="ml-1 text-sm text-[#64748B]">Lengkapi informasi produk yang akan tampil di toko.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Produk</Label>
            <Input value={form.name} onChange={update('name')} required />
            {form.name && (
              <p className="text-xs text-[#8E8E93]">Slug: {slugify(form.name)}</p>
            )}
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
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Pilih kategori"
            />
          </div>
          <div className="space-y-2">
            <Label>Merek</Label>
            <Select
              value={form.brandId}
              onChange={update('brandId')}
              options={brands.map((b) => ({ value: b.id, label: b.name }))}
              placeholder="Pilih merek"
            />
          </div>
        </div>

        {/* Gambar */}
        <div className="space-y-2">
          <Label>Gambar Produk</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E5E5EA] group">
                <img
                  src={img}
                  alt={`Gambar ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF3B30] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#E5E5EA] flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#8E8E93]" />
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
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Harga</Label>
            <Input type="number" value={form.price} onChange={update('price')} required />
          </div>
          <div className="space-y-2">
            <Label>Harga Coret</Label>
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
