'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import type { Product } from '@/lib/admin-store';
import { getAllCategories, getAllBrands, getCategoryById, addCategory, addBrand } from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Plus, X, Upload, ChevronDown, ChevronUp, Tag, Building2, Sparkles, Video, Camera } from 'lucide-react';

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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const slug = params?.slug as string | undefined;
  const [ready, setReady] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const refreshCats = () => setCategories(getAllCategories());
  const refreshBrands = () => setBrands(getAllBrands());

  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brandId: '',
    price: '', salePrice: '', weight: '', stock: '', isActive: true,
    metaTitle: '', metaDescription: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [originalSlug, setOriginalSlug] = useState('');

  // Cascade: filter categories by selected brand
  const filteredCats = form.brandId
    ? categories.filter((c) => c.brandId === form.brandId || c.brandId === null)
    : categories;

  const selectedCategory = form.categoryId ? getCategoryById(form.categoryId) : null;

  // ── Inline category ──
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // ── Inline brand ──
  const [brdDialogOpen, setBrdDialogOpen] = useState(false);
  const [newBrdName, setNewBrdName] = useState('');

  useEffect(() => {
    refreshCats();
    refreshBrands();
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
    setVideoUrl(product.videoUrl || '');
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
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'brandId' && prev.categoryId) {
        const cat = getCategoryById(prev.categoryId);
        if (cat && cat.brandId && cat.brandId !== val) {
          next.categoryId = '';
        }
      }
      return next;
    });
  };

  const readFileAsDataUrl = (file: File) => {
    if (!file.type.startsWith('image/')) { toast('Hanya file gambar yang diizinkan', 'error'); return; }
    if (images.length >= MAX_IMAGES) { toast(`Maksimal ${MAX_IMAGES} gambar`, 'error'); return; }
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

  const addImage = () => {
    if (!imageUrl.trim()) return;
    if (images.length >= MAX_IMAGES) { toast(`Maksimal ${MAX_IMAGES} gambar`, 'error'); return; }
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  // ── Video upload ──
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { toast('Hanya file video yang diizinkan', 'error'); return; }
    if (file.size > 50 * 1024 * 1024) { toast('Video maksimal 50MB', 'error'); return; }
    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) setVideoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeVideo = () => { setVideoUrl(''); setVideoFileName(''); };

  const updateVariant = (id: string, field: string, val: string | number) => {
    setVariants((prev) => prev.map((v) => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // ── Inline category ──
  const handleAddCategory = () => {
    if (!newCatName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    const cat = addCategory({ name: newCatName.trim(), brandId: form.brandId || null });
    refreshCats();
    setForm((prev) => ({ ...prev, categoryId: cat.id }));
    setCatDialogOpen(false);
    setNewCatName('');
    toast(`Kategori "${cat.name}" ditambahkan`, 'success');
  };

  // ── Inline brand ──
  const handleAddBrand = () => {
    if (!newBrdName.trim()) { toast('Nama merek wajib diisi', 'error'); return; }
    const brd = addBrand({ name: newBrdName.trim() });
    refreshBrands();
    setForm((prev) => ({ ...prev, brandId: brd.id }));
    setBrdDialogOpen(false);
    setNewBrdName('');
    toast(`Merek "${brd.name}" ditambahkan`, 'success');
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
        videoUrl: videoUrl || undefined,
        variants,
        category: categories.find((c) => c.id === form.categoryId) || { id: '', name: '', slug: '' },
        brand: brands.find((b) => b.id === form.brandId) || { id: '', name: '', slug: '' },
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
                  <Sparkles className="w-3 h-3" /> {selectedCategory.options.length} opsi ({selectedCategory.options.map((o) => o.name).join(', ')})
                </p>
              )}
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1C1C1E]">Gambar Produk</h2>
            <span className="text-[10px] text-[#8E8E93]">{images.length}/{MAX_IMAGES}</span>
          </div>
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
            {images.length < MAX_IMAGES && (
              <div className="flex gap-2">
                <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 hover:border-[#F5A623] hover:bg-[#FFF9E6] transition-all duration-200 cursor-pointer">
                  <Camera className="w-5 h-5 text-[#8E8E93]" />
                  <span className="text-[10px] text-[#8E8E93] font-medium">Kamera</span>
                </button>
                <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-1 hover:border-[#F5A623] hover:bg-[#FFF9E6] transition-all duration-200 cursor-pointer">
                  <Upload className="w-5 h-5 text-[#8E8E93]" />
                  <span className="text-[10px] text-[#8E8E93] font-medium">Galeri</span>
                </button>
              </div>
            )}
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGalleryPick} className="hidden" />
          </div>
          {images.length < MAX_IMAGES && (
            <div className="flex gap-2">
              <Input
                placeholder="Atau masukkan URL gambar..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button type="button" variant="outline" size="sm" onClick={addImage} disabled={!imageUrl.trim()}>
                Tambah URL
              </Button>
            </div>
          )}
        </section>

        {/* Video */}
        <section className="bg-white rounded-xl border border-[#E5E5EA] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1C1C1E]">Video Produk</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input placeholder="URL video (YouTube/Vimeo atau link langsung)" value={videoUrl.startsWith('data:') ? '' : videoUrl}
                onChange={(e) => { if (!videoFileName) setVideoUrl(e.target.value); }} />
            </div>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex-shrink-0 h-10 px-3 rounded-lg border border-dashed border-[#E5E5EA] flex items-center gap-1.5 hover:border-[#F5A623] hover:bg-[#FFF9E6] transition-all duration-200 cursor-pointer text-xs text-[#8E8E93]"
            >
              <Video className="w-4 h-4" /> Upload
            </button>
            <input ref={videoInputRef} type="file" accept="video/*" capture="environment" onChange={handleVideoUpload} className="hidden" />
          </div>
          {videoFileName && (
            <div className="flex items-center gap-2 bg-[#FFF7ED] rounded-lg px-3 py-2">
              <Video className="w-4 h-4 text-[#F97316]" />
              <span className="text-xs text-[#1C1C1E] flex-1 truncate">{videoFileName}</span>
              <button type="button" onClick={removeVideo} className="p-1 rounded-lg hover:bg-[#FF3B30]/10">
                <X className="w-3.5 h-3.5 text-[#FF3B30]" />
              </button>
            </div>
          )}
          {videoUrl && videoUrl.startsWith('data:') && (
            <video src={videoUrl} className="w-full max-h-48 rounded-lg object-cover" controls />
          )}
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
              {selectedCategory && selectedCategory.options.length > 0
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
          <Button type="submit" variant="accent" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? 'Menyimpan...' : 'Simpan'}
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
