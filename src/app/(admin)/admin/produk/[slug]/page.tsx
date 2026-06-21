'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Save, ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { mockProducts, mockCategories, mockBrands } from '@/lib/mock-data';

interface Variant {
  id: string;
  name: string;
  value: string;
  stock: number;
  price: number | null;
  sku: string;
}

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
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
    metaTitle: '',
    metaDescription: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [categories] = useState(mockCategories);
  const [brands] = useState(mockBrands);

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => {
      const product = mockProducts.find((p) => p.slug === resolvedSlug);
      if (!product) {
        notFound();
        return;
      }
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
        metaTitle: product.name,
        metaDescription: product.description.slice(0, 160),
      });
      setImages(product.images || []);
      setVariants(product.variants || []);
    });
  }, [params]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    toast('Produk berhasil disimpan', 'success');
    setLoading(false);
    router.push('/admin/produk');
  };

  return (
    <div>
      {/* Header */}
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
            <label className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#F5A623] hover:bg-[#FFF9E6] transition-all duration-200">
              <Plus className="w-5 h-5 text-[#8E8E93]" />
              <span className="text-[10px] text-[#8E8E93] font-medium">Tambah Gambar</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <p className="text-xs text-[#8E8E93]">Upload gambar akan diintegrasikan dengan Cloudinary.</p>
        </section>

        {/* Varian */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1C1C1E]">Varian Produk</h2>
            <Button type="button" variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Tambah Varian
            </Button>
          </div>
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
                        <button type="button" className="text-[#FF3B30] text-xs hover:underline">Hapus</button>
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
