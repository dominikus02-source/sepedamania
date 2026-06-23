'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import { getAllCategories, getAllBrands, addCategory, addBrand } from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Plus, X, Upload, Tag, Building2 } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

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

  const refreshCats = () => setCategories(getAllCategories());
  const refreshBrands = () => setBrands(getAllBrands());
  useEffect(() => { refreshCats(); refreshBrands(); }, []);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brandId: '',
    price: '', salePrice: '', weight: '', stock: '', isActive: true,
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

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

  // ── Inline category creation ──
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = () => {
    if (!newCatName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    const cat = addCategory({ name: newCatName.trim() });
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

        {/* Kategori & Merek — with inline add */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={form.categoryId}
                  onChange={update('categoryId')}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Pilih kategori"
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
          </div>
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
              {/* Kamera */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 hover:border-[#F5A623] hover:bg-[#FFFBEB] transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-[#8E8E93]" />
                <span className="text-[10px] text-[#8E8E93] font-medium">Kamera</span>
              </button>
              {/* Galeri */}
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
            <p className="text-xs text-[#64748B]">Ketik nama kategori yang ingin ditambahkan. Kategori akan langsung tersedia untuk dipilih.</p>
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
            <p className="text-xs text-[#64748B]">Ketik nama merek yang ingin ditambahkan. Merek akan langsung tersedia untuk dipilih.</p>
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
