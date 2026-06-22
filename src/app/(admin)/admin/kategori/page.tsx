'use client';

import { useState, useEffect } from 'react';
import {
  getAllCategories, getAllBrands,
  addCategory, updateCategory, deleteCategory,
  addBrand, updateBrand, deleteBrand,
} from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon, Tag, Building2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);

  const refresh = () => {
    setCategories(getAllCategories());
    setBrands(getAllBrands());
  };

  useEffect(refresh, []);

  // Category dialog
  const [catOpen, setCatOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<CatalogCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  const openAddCat = () => {
    setCatEdit(null);
    setCatName('');
    setCatImage('');
    setCatOpen(true);
  };

  const openEditCat = (c: CatalogCategory) => {
    setCatEdit(c);
    setCatName(c.name);
    setCatImage(c.image || '');
    setCatOpen(true);
  };

  const handleSaveCat = () => {
    if (!catName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    if (catEdit) {
      updateCategory(catEdit.id, { name: catName.trim(), image: catImage || null });
      toast('Kategori berhasil diperbarui', 'success');
    } else {
      addCategory({ name: catName.trim(), image: catImage || undefined });
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

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-lg font-bold text-[#1C1C1E]">Kategori</h2>
            <span className="text-xs text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{categories.length}</span>
          </div>
          <Button variant="accent" size="sm" onClick={openAddCat}>
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-[#8E8E93] text-center py-8">Belum ada kategori.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E5EA] hover:bg-[#F2F2F7]/50 transition-colors group">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                    <Tag className="w-5 h-5 text-[#F97316]/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1E] truncate">{c.name}</p>
                  <p className="text-[10px] text-[#8E8E93] font-mono">{c.slug}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditCat(c)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]">
                    <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                  </button>
                  <button onClick={() => handleDeleteCat(c.id, c.name)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10">
                    <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
