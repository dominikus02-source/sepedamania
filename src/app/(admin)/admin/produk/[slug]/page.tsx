'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Plus, X, ChevronDown, ChevronUp, Tag, Building2, Sparkles } from 'lucide-react';
import { ProductMediaUploader } from '@/components/admin/product-media-uploader';

interface ApiVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
  price: number | null;
  sku?: string;
}

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  salePrice: number | null;
  weight: number;
  stock: number;
  isActive: boolean;
  images: string[];
  videoUrls: string[];
  variants: ApiVariant[];
}

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
  const [loadError, setLoadError] = useState('');
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brandId: '',
    price: '', salePrice: '', weight: '', stock: '', isActive: true,
    metaTitle: '', metaDescription: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [originalSlug, setOriginalSlug] = useState('');

  // Cascade: filter categories by selected brand
  const filteredCats = form.brandId
    ? categories.filter((c) => c.brandId === form.brandId || c.brandId === null)
    : categories;

  const selectedCategory = form.categoryId
    ? categories.find((c) => c.id === form.categoryId) ?? null
    : null;

  // ── Inline category ──
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // ── Inline brand ──
  const [brdDialogOpen, setBrdDialogOpen] = useState(false);
  const [newBrdName, setNewBrdName] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      // Categories and brands come from the database so their ids match what
      // the product API will accept on save.
      try {
        const [catRes, brdRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);
        if (catRes.ok) {
          const json = await catRes.json();
          if (!cancelled && json.categories) {
            setCategories(json.categories.map((c: CatalogCategory) => ({
              ...c,
              options: Array.isArray(c.options) ? c.options : [],
            })));
          }
        }
        if (brdRes.ok) {
          const json = await brdRes.json();
          const list = Array.isArray(json) ? json : json.brands;
          if (!cancelled && list) setBrands(list);
        }
      } catch {
        // Non-fatal: the selects stay empty and the user sees the load error below.
      }

      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Gagal memuat produk');
        const json = await res.json();
        const product = (json.products || []).find((p: ApiProduct) => p.slug === slug);
        if (!product) {
          if (!cancelled) setNotFoundState(true);
          return;
        }
        if (cancelled) return;

        setProductId(product.id);
        setOriginalSlug(product.slug);
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
        setVideoUrls(product.videoUrls || []);
        setVariants(
          (product.variants || []).map((v: ApiVariant) => ({
            id: v.id,
            name: v.name,
            value: v.value,
            stock: v.stock,
            price: v.price,
            sku: v.sku || '',
          })),
        );
        setReady(true);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Gagal memuat produk');
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  if (loadError) {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="text-xl font-bold text-[#1C1C1E]">Gagal memuat produk</h1>
        <p className="text-sm text-[#64748B]">{loadError}</p>
        <div className="flex gap-3">
          <Button variant="accent" onClick={() => router.refresh()}>Coba lagi</Button>
          <Link href="/admin/produk"><Button variant="outline">Kembali</Button></Link>
        </div>
      </div>
    );
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
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'brandId' && prev.categoryId) {
        const cat = categories.find((c) => c.id === prev.categoryId);
        if (cat && cat.brandId && cat.brandId !== val) {
          next.categoryId = '';
        }
      }
      return next;
    });
  };

  const updateVariant = (id: string, field: string, val: string | number) => {
    setVariants((prev) => prev.map((v) => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // ── Inline category ──
  // Goes through the API so the new id exists server-side; a locally minted id
  // would be rejected on save with "Kategori tidak ditemukan".
  const handleAddCategory = async () => {
    if (!newCatName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), brandId: form.brandId || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menyimpan kategori');
      setCategories((prev) => [...prev, { ...json.category, options: [] }]);
      setForm((prev) => ({ ...prev, categoryId: json.category.id }));
      setCatDialogOpen(false);
      setNewCatName('');
      toast(`Kategori "${json.category.name}" ditambahkan`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Gagal menyimpan kategori', 'error');
    }
  };

  // ── Inline brand ──
  const handleAddBrand = async () => {
    if (!newBrdName.trim()) { toast('Nama merek wajib diisi', 'error'); return; }
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrdName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menyimpan merek');
      setBrands((prev) => [...prev, json.brand]);
      setForm((prev) => ({ ...prev, brandId: json.brand.id }));
      setBrdDialogOpen(false);
      setNewBrdName('');
      toast(`Merek "${json.brand.name}" ditambahkan`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Gagal menyimpan merek', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      toast('Tunggu media selesai diunggah', 'error');
      return;
    }
    if (!productId) {
      toast('Produk belum termuat', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
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
        videoUrls,
        variants: variants.map((v) => ({
          name: v.name,
          value: v.value,
          stock: v.stock,
          price: v.price,
          sku: v.sku,
        })),
      };
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = json.details?.map((d: { message: string }) => d.message).join(', ');
        throw new Error(details || json.error || `Gagal menyimpan produk (${res.status})`);
      }
      toast('Produk berhasil disimpan', 'success');
      router.push('/admin/produk');
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Gagal menyimpan produk', 'error');
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
              <Label>Merek</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={form.brandId}
                    onChange={update('brandId')}
                    options={brands.map((b) => ({ value: b.id, label: b.name }))}
                    placeholder="Pilih merek"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setBrdDialogOpen(true)}
                  className="flex-shrink-0 w-10 h-10 rounded-lg border border-dashed border-[#E5E5EA] flex items-center justify-center hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all"
                  title="Tambah merek baru"
                >
                  <Plus className="w-4 h-4 text-[#8E8E93]" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={form.categoryId}
                    onChange={update('categoryId')}
                    options={filteredCats.map((c) => ({
                      value: c.id,
                      label: `${c.name}${(c.options?.length ?? 0) > 0 ? ` (${c.options?.length ?? 0} opsi)` : ''}`,
                    }))}
                    placeholder={form.brandId ? 'Pilih kategori' : 'Pilih merek dulu'}
                    disabled={!form.brandId}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCatDialogOpen(true)}
                  className="flex-shrink-0 w-10 h-10 rounded-lg border border-dashed border-[#E5E5EA] flex items-center justify-center hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all"
                  title="Tambah kategori baru"
                >
                  <Plus className="w-4 h-4 text-[#8E8E93]" />
                </button>
              </div>
              {selectedCategory?.options?.length ? (
                <p className="text-[10px] text-[#0EA5E9] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {selectedCategory.options.length} opsi ({(selectedCategory.options ?? []).map((o) => o.name).join(', ')})
                </p>
              ) : null}
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

        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6">
          <ProductMediaUploader
            images={images}
            onImagesChange={setImages}
            videos={videoUrls}
            onVideosChange={setVideoUrls}
            folder={originalSlug || 'produk'}
            onUploadingChange={setUploading}
          />
        </section>

        {/* Varian / Opsi */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5EA] bg-[#FAFAFA]">
            <h2 className="text-sm font-semibold text-[#1C1C1E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F5A623]" /> Opsi / Varian
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={() => {
              const id = 'v' + Math.random().toString(36).slice(2, 8);
              setVariants((prev) => [...prev, { id, name: '', value: '', stock: 0, price: null, sku: '' }]);
            }}>
              <Plus className="w-3 h-3 mr-1" /> Tambah Baris
            </Button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-[#8E8E93] py-6 text-center">
              {selectedCategory?.options?.length
                ? 'Pilih ulang kategori untuk mengisi opsi otomatis'
                : 'Belum ada opsi. Tambah baris manual.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-2 font-medium text-[#8E8E93]">Nama Opsi</th>
                    <th className="text-left p-2 font-medium text-[#8E8E93]">Nilai</th>
                    <th className="text-right p-2 font-medium text-[#8E8E93]">Stok</th>
                    <th className="text-left p-2 font-medium text-[#8E8E93]">SKU</th>
                    <th className="text-right p-2 font-medium text-[#8E8E93]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} className="border-b border-[#E5E5EA] last:border-0">
                      <td className="p-1.5">
                        <Input value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} placeholder="Ukuran" className="text-xs" />
                      </td>
                      <td className="p-1.5">
                        <Input value={v.value} onChange={(e) => updateVariant(v.id, 'value', e.target.value)} placeholder="M" className="text-xs" />
                      </td>
                      <td className="p-1.5 w-20">
                        <Input type="number" value={v.stock} onChange={(e) => updateVariant(v.id, 'stock', Number(e.target.value))} className="text-xs text-right" />
                      </td>
                      <td className="p-1.5">
                        <Input value={v.sku} onChange={(e) => updateVariant(v.id, 'sku', e.target.value)} placeholder="SKU-001" className="text-xs font-mono" />
                      </td>
                      <td className="p-1.5 text-right">
                        <button type="button" onClick={() => removeVariant(v.id)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10">
                          <X className="w-3.5 h-3.5 text-[#FF3B30]" />
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
          <Button type="submit" variant="accent" disabled={loading || uploading}>
            <Save className="w-4 h-4 mr-1" />
            {loading ? 'Menyimpan...' : uploading ? 'Mengunggah gambar...' : 'Simpan'}
          </Button>
          <Link href="/admin/produk">
            <Button variant="outline" type="button">Batal</Button>
          </Link>
        </div>
      </form>

      {/* ── Inline Add Category Dialog ── */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#F5A623]" /> Tambah Kategori Baru
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">
              {form.brandId
                ? `Kategori akan terhubung ke "${brands.find((b) => b.id === form.brandId)?.name}".`
                : 'Ketik nama kategori baru.'}
            </p>
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Contoh: Sepeda Gunung" autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setCatDialogOpen(false); setNewCatName(''); }}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleAddCategory}>Tambah</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Inline Add Brand Dialog ── */}
      <Dialog open={brdDialogOpen} onOpenChange={setBrdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#F5A623]" /> Tambah Merek Baru
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">Ketik nama merek. Langsung tersedia untuk dipilih.</p>
            <div className="space-y-2">
              <Label>Nama Merek</Label>
              <Input value={newBrdName} onChange={(e) => setNewBrdName(e.target.value)} placeholder="Contoh: Polygon" autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBrand(); } }} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setBrdDialogOpen(false); setNewBrdName(''); }}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleAddBrand}>Tambah</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
