'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    metaTitle: '',
    metaDescription: '',
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {
        // Fallback: if API not ready, use mock data
        console.warn('API /api/categories not available');
      });
    fetch('/api/brands')
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {
        console.warn('API /api/brands not available');
      });
  }, []);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Auto-generate slug from name
      ...(field === 'name' ? { metaTitle: value } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        weight: Number(form.weight),
        stock: Number(form.stock),
        slug: slugify(form.name),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan produk');
      toast('Produk berhasil ditambahkan', 'success');
      router.push('/admin/produk');
    } catch (err: any) {
      toast(err.message || 'Gagal menyimpan produk', 'error');
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
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Tambah Produk</h1>
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
            <Button variant="outline" type="button">
              Batal
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
