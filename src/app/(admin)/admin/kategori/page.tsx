'use client';

import { useState, useEffect } from 'react';
import {
  getAllCategories, getAllBrands,
  addCategory, updateCategory, deleteCategory,
  addCategoryOption, updateCategoryOption, deleteCategoryOption,
  addBrand, updateBrand, deleteBrand,
} from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand, CatalogOption } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Tag, Building2, Settings2, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);

  const refresh = () => {
    setCategories(getAllCategories());
    setBrands(getAllBrands());
  };

  useEffect(refresh, []);

  // Brand filter
  const [brandFilter, setBrandFilter] = useState<string>('all');

  const filteredCategories = brandFilter === 'all'
    ? categories
    : categories.filter((c) => c.brandId === brandFilter);

  // Category dialog
  const [catOpen, setCatOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<CatalogCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catBrandId, setCatBrandId] = useState('');

  const openAddCat = () => {
    setCatEdit(null);
    setCatName('');
    setCatImage('');
    setCatBrandId('');
    setCatOpen(true);
  };

  const openEditCat = (c: CatalogCategory) => {
    setCatEdit(c);
    setCatName(c.name);
    setCatImage(c.image || '');
    setCatBrandId(c.brandId || '');
    setCatOpen(true);
  };

  const handleSaveCat = () => {
    if (!catName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    const updates: { name: string; image?: string | null; brandId?: string | null } = {
      name: catName.trim(),
      image: catImage || undefined,
      brandId: catBrandId || null,
    };
    if (catEdit) {
      updateCategory(catEdit.id, updates);
      toast('Kategori berhasil diperbarui', 'success');
    } else {
      addCategory({ name: updates.name, image: updates.image, brandId: updates.brandId });
      toast('Kategori berhasil ditambahkan', 'success');
    }
    setCatOpen(false);
    refresh();
  };

  const handleDeleteCat = (id: string, name: string) => {
    if (!window.confirm(`Hapus kategori "${name}"?`)) return;
    const ok = deleteCategory(id);
    if (!ok) { toast('Tidak bisa menghapus: masih ada produk dalam kategori ini', 'error'); return; }
    toast('Kategori berhasil dihapus', 'success');
    refresh();
  };

  // Brand dialog
  const [brdOpen, setBrdOpen] = useState(false);
  const [brdEdit, setBrdEdit] = useState<CatalogBrand | null>(null);
  const [brdName, setBrdName] = useState('');
  const [brdLogo, setBrdLogo] = useState('');

  const openAddBrd = () => {
    setBrdEdit(null);
    setBrdName('');
    setBrdLogo('');
    setBrdOpen(true);
  };

  const openEditBrd = (b: CatalogBrand) => {
    setBrdEdit(b);
    setBrdName(b.name);
    setBrdLogo(b.logo || '');
    setBrdOpen(true);
  };

  const handleSaveBrd = () => {
    if (!brdName.trim()) { toast('Nama merek wajib diisi', 'error'); return; }
    if (brdEdit) {
      updateBrand(brdEdit.id, { name: brdName.trim(), logo: brdLogo || null });
      toast('Merek berhasil diperbarui', 'success');
    } else {
      addBrand({ name: brdName.trim(), logo: brdLogo || undefined });
      toast('Merek berhasil ditambahkan', 'success');
    }
    setBrdOpen(false);
    refresh();
  };

  const handleDeleteBrd = (id: string, name: string) => {
    if (!window.confirm(`Hapus merek "${name}"?`)) return;
    const ok = deleteBrand(id);
    if (!ok) { toast('Tidak bisa menghapus: masih ada produk dengan merek ini', 'error'); return; }
    toast('Merek berhasil dihapus', 'success');
    refresh();
  };

  // Options editor
  const [optCategory, setOptCategory] = useState<CatalogCategory | null>(null);
  const [optOpen, setOptOpen] = useState(false);

  const openOptions = (c: CatalogCategory) => {
    setOptCategory(c);
    setOptOpen(true);
  };

  const [addingOpt, setAddingOpt] = useState(false);
  const [newOptName, setNewOptName] = useState('');
  const [newOptValues, setNewOptValues] = useState('');

  const handleAddOption = () => {
    if (!optCategory || !newOptName.trim()) return;
    const values = newOptValues.split(',').map((v) => v.trim()).filter(Boolean);
    const updated = addCategoryOption(optCategory.id, newOptName.trim(), values);
    if (updated) {
      setOptCategory(updated);
      setNewOptName('');
      setNewOptValues('');
      setAddingOpt(false);
      refresh();
      toast('Opsi berhasil ditambahkan', 'success');
    }
  };

  const handleDeleteOption = (optId: string) => {
    if (!optCategory) return;
    const updated = deleteCategoryOption(optCategory.id, optId);
    if (updated) {
      setOptCategory(updated);
      refresh();
      toast('Opsi berhasil dihapus', 'success');
    }
  };

  const handleUpdateOptionValues = (opt: CatalogOption, raw: string) => {
    if (!optCategory) return;
    const values = raw.split(',').map((v) => v.trim()).filter(Boolean);
    const updated = updateCategoryOption(optCategory.id, opt.id, { values });
    if (updated) {
      setOptCategory(updated);
      refresh();
    }
  };

  const handleUpdateOptionName = (opt: CatalogOption, name: string) => {
    if (!optCategory || !name.trim()) return;
    const updated = updateCategoryOption(optCategory.id, opt.id, { name: name.trim() });
    if (updated) {
      setOptCategory(updated);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Brands */}
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-lg font-bold text-[#1C1C1E]">Merek</h2>
            <span className="text-xs text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{brands.length}</span>
          </div>
          <Button variant="accent" size="sm" onClick={openAddBrd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </div>
        {brands.length === 0 ? (
          <p className="text-sm text-[#8E8E93] text-center py-8">Belum ada merek.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {brands.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E5EA] hover:bg-[#F2F2F7]/50 transition-colors group">
                {b.logo ? (
                  <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-lg object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#0EA5E9]/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1E] truncate">{b.name}</p>
                  <p className="text-[10px] text-[#8E8E93] font-mono">{b.slug}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditBrd(b)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]">
                    <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                  </button>
                  <button onClick={() => handleDeleteBrd(b.id, b.name)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10">
                    <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-lg font-bold text-[#1C1C1E]">Kategori</h2>
            <span className="text-xs text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{filteredCategories.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="text-xs border border-[#E5E5EA] rounded-lg px-2 py-1.5 bg-white text-[#1C1C1E]"
            >
              <option value="all">Semua Merek</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value="__none__">Tanpa Merek</option>
            </select>
            <Button variant="accent" size="sm" onClick={openAddCat}>
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </div>
        </div>
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-[#8E8E93] text-center py-8">Belum ada kategori.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCategories.map((c) => {
              const brand = brands.find((b) => b.id === c.brandId);
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E5EA] hover:bg-[#F2F2F7]/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-[#F97316]/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1E] truncate">{c.name}</p>
                    <p className="text-[10px] text-[#8E8E93] font-mono truncate">
                      {brand ? brand.name : 'Tanpa Merek'} &middot; {c.options.length} opsi
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openOptions(c)} className="p-1.5 rounded-lg hover:bg-[#EFF6FF]" title="Atur Opsi">
                      <Settings2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    </button>
                    <button onClick={() => openEditCat(c)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]">
                      <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                    </button>
                    <button onClick={() => handleDeleteCat(c.id, c.name)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10">
                      <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{catEdit ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Contoh: Sepeda Listrik" />
            </div>
            <div className="space-y-2">
              <Label>Induk Merek</Label>
              <select
                value={catBrandId}
                onChange={(e) => setCatBrandId(e.target.value)}
                className="w-full border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm bg-white text-[#1C1C1E]"
              >
                <option value="">-- Tanpa Merek --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>URL Gambar (opsional)</Label>
              <Input value={catImage} onChange={(e) => setCatImage(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCatOpen(false)}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleSaveCat}>
                {catEdit ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Options Dialog */}
      <Dialog open={optOpen} onOpenChange={setOptOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#F5A623]" />
              Opsi: {optCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Opsi adalah variasi produk seperti ukuran, warna, dll. Opsi akan otomatis tersedia saat menambah produk di kategori ini.
            </p>

            {/* Existing options */}
            {optCategory && optCategory.options.length > 0 ? (
              <div className="space-y-3">
                {optCategory.options.map((opt) => (
                  <div key={opt.id} className="border border-[#E5E5EA] rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={opt.name}
                        onChange={(e) => handleUpdateOptionName(opt, e.target.value)}
                        className="flex-1 text-sm font-medium bg-transparent border-b border-transparent hover:border-[#E5E5EA] focus:border-[#F5A623] outline-none px-1 py-0.5"
                      />
                      <button onClick={() => handleDeleteOption(opt.id)} className="p-1 rounded-lg hover:bg-[#FF3B30]/10">
                        <X className="w-3.5 h-3.5 text-[#FF3B30]" />
                      </button>
                    </div>
                    <input
                      value={opt.values.join(', ')}
                      onChange={(e) => handleUpdateOptionValues(opt, e.target.value)}
                      placeholder="Nilai (pisahkan dengan koma)"
                      className="w-full text-xs border border-[#E5E5EA] rounded-lg px-2 py-1.5 bg-[#FAFAFA] outline-none focus:border-[#F5A623]"
                    />
                    <p className="text-[10px] text-[#8E8E93]">
                      {opt.values.length} nilai: {opt.values.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8E8E93] text-center py-6">Belum ada opsi untuk kategori ini.</p>
            )}

            {/* Add option form */}
            {addingOpt ? (
              <div className="border border-dashed border-[#E5E5EA] rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Nama Opsi</Label>
                  <Input value={newOptName} onChange={(e) => setNewOptName(e.target.value)} placeholder="Contoh: Ukuran" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nilai (pisahkan dengan koma)</Label>
                  <Input value={newOptValues} onChange={(e) => setNewOptValues(e.target.value)} placeholder="Contoh: S, M, L, XL" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAddingOpt(false); setNewOptName(''); setNewOptValues(''); }}>Batal</Button>
                  <Button variant="accent" size="sm" onClick={handleAddOption}>Tambah</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setAddingOpt(true)}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Opsi
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={brdOpen} onOpenChange={setBrdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{brdEdit ? 'Edit Merek' : 'Tambah Merek'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Merek</Label>
              <Input value={brdName} onChange={(e) => setBrdName(e.target.value)} placeholder="Contoh: Polygon" />
            </div>
            <div className="space-y-2">
              <Label>URL Logo (opsional)</Label>
              <Input value={brdLogo} onChange={(e) => setBrdLogo(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setBrdOpen(false)}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleSaveBrd}>
                {brdEdit ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
