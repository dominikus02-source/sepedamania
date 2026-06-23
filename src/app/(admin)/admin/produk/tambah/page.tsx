'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import { getAllCategories, getAllBrands, getCategoryById, addCategory, addBrand } from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Plus, X, Upload, Tag, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

interface Variant {
  id: string;
  name: string;
  value: string;
  stock: number;
  price: number | null;
  sku: string;
}

let vid = 0;
const nextVid = () => `v${++vid}-${Math.random().toString(36).slice(2, 6)}`;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);

  const refreshCats = () => setCategories(getAllCategories());
  const refreshBrands = () => setBrands(getAllBrands());
  useEffect(() => { refreshCats(); refreshBrands(); }, []);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brandId: '',
    price: '', salePrice: '', weight: '', stock: '', isActive: true,
  });

  // Cascade: filter categories by selected brand
  const filteredCats = form.brandId
    ? categories.filter((c) => c.brandId === form.brandId || c.brandId === null)
    : categories;

  const selectedCategory = form.categoryId ? getCategoryById(form.categoryId) : null;

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      // Clear category when brand changes (if category doesn't belong to new brand)
      if (field === 'brandId' && prev.categoryId) {
        const cat = getCategoryById(prev.categoryId);
        if (cat && cat.brandId && cat.brandId !== val) {
          next.categoryId = '';
        }
      }
      return next;
    });
  };

  // ─️ Auto-suggest variants from category options ──
  useEffect(() => {
    if (!selectedCategory || selectedCategory.options.length === 0) return;
    // Only suggest if variants are empty
    if (variants.length > 0) return;
    const suggested: Variant[] = [];
    for (const opt of selectedCategory.options) {
      for (const val of opt.values) {
        suggested.push({
          id: nextVid(),
          name: opt.name,
          value: val,
          stock: 0,
          price: null,
          sku: '',
        });
      }
    }
    if (suggested.length > 0) {
      setVariants(suggested);
      toast(`Opsi "${selectedCategory.name}" siap diisi`, 'success');
    }
  }, [form.categoryId]);

  // ── Image upload ──
  const readFileAsDataUrl = (file: File) => {
    if (!file.type.startsWith('image/')) { toast('Hanya file gambar yang diizinkan', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) setImages((prev) => [...prev, dataUrl]);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file);
    e.target.value = '';
  };

  const handleGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file);
    e.target.value = '';
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // ── Variant management ──
  const addVariant = () => {
    setVariants((prev) => [...prev, { id: nextVid(), name: '', value: '', stock: 0, price: null, sku: '' }]);
  };

  const updateVariant = (id: string, field: string, val: string | number) => {
    setVariants((prev) => prev.map((v) => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // ── Inline category creation ──
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = () => {
    if (!newCatName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    const cat = addCategory({ name: newCatName.trim(), brandId: form.brandId || null });
    refreshCats();
    setForm((prev) => ({ ...prev, categoryId: cat.id }));
    setCatDialogOpen(false);
    setNewCatName('');
    toast(`Kategori "${cat.name}" ditambahkan`, 'success');
  };

  // ── Inline brand creation ──
  const [brdDialogOpen, setBrdDialogOpen] = useState(false);
  const [newBrdName, setNewBrdName] = useState('');

  const handleAddBrand = () => {
    if (!newBrdName.trim()) { toast('Nama merek wajib diisi', 'error'); return; }
    const brd = addBrand({ name: newBrdName.trim() });
    refreshBrands();
    setForm((prev) => ({ ...prev, brandId: brd.id }));
    setBrdDialogOpen(false);
    setNewBrdName('');
    toast(`Merek "${brd.name}" ditambahkan`, 'success');
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.brandId) {
      toast('Harap pilih kategori dan merek', 'error');
      return;
    }
    setLoading(true);
    try {
      const product = AdminStore.addProduct({
        name: form.name, sku: form.sku, description: form.description,
        categoryId: form.categoryId, brandId: form.brandId,
        price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null,
        weight: Number(form.weight), stock: Number(form.stock),
      });
      if (images.length > 0) AdminStore.updateProduct(product.slug, { images });
      // Save variants
      if (variants.length > 0) {
        AdminStore.updateProduct(product.slug, { variants: variants as any });
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
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Tambah Produk</h1>
        </div>
        <p className="ml-1 text-sm text-[#64748B]">Lengkapi informasi produk yang akan tampil di toko.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {/* Nama & SKU */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Produk</Label>
            <Input value={form.name} onChange={update('name')} required />
            {form.name && <p className="text-xs text-[#8E8E93]">Slug: {slugify(form.name)}</p>}
          </div>
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input value={form.sku} onChange={update('sku')} required />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea value={form.description} onChange={update('description')} rows={4} />
        </div>

        {/* Merek & Kategori — cascade */}
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
            {form.brandId && (
              <p className="text-[10px] text-[#8E8E93]">
                {categories.filter((c) => c.brandId === form.brandId).length} kategori tersedia untuk merek ini
              </p>
            )}
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
                    label: `${c.name}${c.options.length > 0 ? ` (${c.options.length} opsi)` : ''}`,
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
            {selectedCategory && selectedCategory.options.length > 0 && (
              <p className="text-[10px] text-[#0EA5E9] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {selectedCategory.options.length} opsi ({selectedCategory.options.map((o) => o.name).join(', ')}) — terisi otomatis
              </p>
            )}
          </div>
        </div>

        {/* Gambar */}
        <div className="space-y-2">
          <Label>Gambar Produk</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5EA] group bg-[#F8FAFC]">
                <img src={img} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF3B30] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-[#8E8E93]" />
                <span className="text-[10px] text-[#8E8E93] font-medium">Kamera</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-[#8E8E93]" />
                <span className="text-[10px] text-[#8E8E93] font-medium">Galeri</span>
              </button>
            </div>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGalleryPick} className="hidden" />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Atau masukkan URL gambar..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <Button type="button" variant="outline" size="sm" onClick={addImageUrl} disabled={!imageUrl.trim()}>Tambah URL</Button>
          </div>
        </div>

        {/* Harga & Stok */}
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

        {/* Variants / Opsi */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5EA] bg-[#FAFAFA]">
            <h2 className="text-sm font-semibold text-[#1C1C1E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F5A623]" /> Opsi / Varian
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="w-3 h-3 mr-1" /> Tambah Baris
            </Button>
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-[#8E8E93] py-6 text-center">
              {selectedCategory && selectedCategory.options.length > 0
                ? `Klik "Gunakan Opsi" di atas atau tambah baris manual`
                : 'Belum ada opsi. Pilih kategori untuk opsi otomatis.'}
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

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="accent" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Link href="/admin/produk"><Button variant="outline" type="button">Batal</Button></Link>
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
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: Sepeda Gunung"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
              />
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
            <p className="text-xs text-[#64748B]">Ketik nama merek yang ingin ditambahkan.</p>
            <div className="space-y-2">
              <Label>Nama Merek</Label>
              <Input
                value={newBrdName}
                onChange={(e) => setNewBrdName(e.target.value)}
                placeholder="Contoh: Polygon"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBrand(); } }}
              />
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
