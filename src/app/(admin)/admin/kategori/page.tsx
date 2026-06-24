'use client';

import { useState, useEffect } from 'react';
import {
  getAllCategories, getAllBrands,
  addCategory, updateCategory, deleteCategory,
  addCategoryOption, updateCategoryOption, deleteCategoryOption,
  addBrand, updateBrand, deleteBrand,
  getActiveCategories,
  normalizeCategoryName,
} from '@/lib/catalog-data';
import type { CatalogCategory, CatalogBrand, CatalogOption } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Tag, Building2, Settings2, X, ChevronDown, ChevronUp, Eye, EyeOff, Search, ArrowUpDown } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [catSearch, setCatSearch] = useState('');
  const [brdSearch, setBrdSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'category' | 'brand'>('category');
  const [counts, setCounts] = useState<Record<string, number>>({});

  const refresh = () => {
    const cats = getAllCategories();
    const brds = getAllBrands();
    setCategories(cats);
    setBrands(brds);
    const prods = JSON.parse(localStorage.getItem('spm-catalog') || '{}').products || [];
    const c: Record<string, number> = {};
    for (const p of prods) {
      c[p.categoryId] = (c[p.categoryId] || 0) + 1;
      c[`brd:${p.brandId}`] = (c[`brd:${p.brandId}`] || 0) + 1;
    }
    setCounts(c);
  };

  useEffect(refresh, []);

  const filteredCats = categories.filter((c) =>
    !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase()) || c.slug.includes(catSearch.toLowerCase())
  );

  const filteredBrds = brands.filter((b) =>
    !brdSearch || b.name.toLowerCase().includes(brdSearch.toLowerCase()) || b.slug.includes(brdSearch.toLowerCase())
  );

  // ── Category CRUD ──
  const [catOpen, setCatOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<CatalogCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catColor, setCatColor] = useState('#F5A623');
  const [catBrandId, setCatBrandId] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(999);
  const [catSuggest, setCatSuggest] = useState('');

  const openAddCat = () => {
    setCatEdit(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatImage('');
    setCatColor('#F5A623');
    setCatBrandId('');
    setCatSortOrder(categories.length + 1);
    setCatSuggest('');
    setCatOpen(true);
  };

  const openEditCat = (c: CatalogCategory) => {
    setCatEdit(c);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatDesc(c.description || '');
    setCatImage(c.image || '');
    setCatColor(c.color || '#F5A623');
    setCatBrandId(c.brandId || '');
    setCatSortOrder(c.sortOrder ?? 999);
    setCatSuggest('');
    setCatOpen(true);
  };

  const handleCatNameChange = (val: string) => {
    setCatName(val);
    if (!catEdit) {
      setCatSlug(val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''));
    }
    // Check for similar existing category
    const normalized = normalizeCategoryName(val);
    if (normalized !== val.trim()) {
      setCatSuggest(`Mungkin maksud Anda "${normalized}"?`);
    } else {
      const lower = val.toLowerCase();
      const similar = categories.find(
        (c) => c.name.toLowerCase() === lower && (!catEdit || c.id !== catEdit.id)
      );
      setCatSuggest(similar ? `Kategori "${similar.name}" sudah ada` : '');
    }
  };

  const handleSaveCat = () => {
    if (!catName.trim()) { toast('Nama kategori wajib diisi', 'error'); return; }
    if (!catSlug.trim()) { toast('Slug wajib diisi', 'error'); return; }
    try {
      // Check duplicate slug
      const dupSlug = categories.find(
        (c) => c.slug === catSlug.trim().toLowerCase().replace(/[^\w-]/g, '') && (!catEdit || c.id !== catEdit.id)
      );
      if (dupSlug) { toast('Slug sudah digunakan kategori lain', 'error'); return; }

      const normalized = normalizeCategoryName(catName);
      if (catEdit) {
        const updates: Partial<CatalogCategory> = {
          name: normalized,
          slug: catSlug.trim().toLowerCase().replace(/[^\w-]/g, ''),
          description: catDesc,
          image: catImage || null,
          color: catColor,
          brandId: catBrandId || null,
          sortOrder: catSortOrder,
        };
        updateCategory(catEdit.id, updates);
        toast('Kategori berhasil diperbarui', 'success');
      } else {
        addCategory({
          name: normalized,
          image: catImage || undefined,
          brandId: catBrandId || null,
          description: catDesc,
          color: catColor,
          sortOrder: catSortOrder,
        });
        toast('Kategori berhasil ditambahkan', 'success');
      }
      setCatOpen(false);
      refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Gagal menyimpan kategori', 'error');
    }
  };

  const handleToggleCatActive = (c: CatalogCategory) => {
    updateCategory(c.id, { isActive: !c.isActive });
    refresh();
    toast(c.isActive ? 'Kategori dinonaktifkan' : 'Kategori diaktifkan', 'success');
  };

  const handleDeleteCat = (id: string, name: string) => {
    if (!window.confirm(`Hapus kategori "${name}"?`)) return;
    const ok = deleteCategory(id);
    if (!ok) { toast('Tidak bisa menghapus: masih ada produk dalam kategori ini', 'error'); return; }
    toast('Kategori berhasil dihapus', 'success');
    refresh();
  };

  // ── Brand CRUD ──
  const [brdOpen, setBrdOpen] = useState(false);
  const [brdEdit, setBrdEdit] = useState<CatalogBrand | null>(null);
  const [brdName, setBrdName] = useState('');
  const [brdSlug, setBrdSlug] = useState('');
  const [brdDesc, setBrdDesc] = useState('');
  const [brdLogo, setBrdLogo] = useState('');
  const [brdSortOrder, setBrdSortOrder] = useState(999);

  const openAddBrd = () => {
    setBrdEdit(null);
    setBrdName('');
    setBrdSlug('');
    setBrdDesc('');
    setBrdLogo('');
    setBrdSortOrder(brands.length + 1);
    setBrdOpen(true);
  };

  const openEditBrd = (b: CatalogBrand) => {
    setBrdEdit(b);
    setBrdName(b.name);
    setBrdSlug(b.slug);
    setBrdDesc(b.description || '');
    setBrdLogo(b.logo || '');
    setBrdSortOrder(b.sortOrder ?? 999);
    setBrdOpen(true);
  };

  const handleBrdNameChange = (val: string) => {
    setBrdName(val);
    if (!brdEdit) {
      setBrdSlug(val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''));
    }
  };

  const handleSaveBrd = () => {
    if (!brdName.trim()) { toast('Nama merek wajib diisi', 'error'); return; }
    if (!brdSlug.trim()) { toast('Slug wajib diisi', 'error'); return; }
    try {
      const dupSlug = brands.find(
        (b) => b.slug === brdSlug.trim().toLowerCase().replace(/[^\w-]/g, '') && (!brdEdit || b.id !== brdEdit.id)
      );
      if (dupSlug) { toast('Slug sudah digunakan merek lain', 'error'); return; }

      if (brdEdit) {
        updateBrand(brdEdit.id, {
          name: brdName.trim(),
          slug: brdSlug.trim().toLowerCase().replace(/[^\w-]/g, ''),
          description: brdDesc,
          logo: brdLogo || null,
          sortOrder: brdSortOrder,
        });
        toast('Merek berhasil diperbarui', 'success');
      } else {
        addBrand({
          name: brdName.trim(),
          logo: brdLogo || undefined,
          description: brdDesc,
          sortOrder: brdSortOrder,
        });
        toast('Merek berhasil ditambahkan', 'success');
      }
      setBrdOpen(false);
      refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Gagal menyimpan merek', 'error');
    }
  };

  const handleToggleBrdActive = (b: CatalogBrand) => {
    updateBrand(b.id, { isActive: !b.isActive });
    refresh();
    toast(b.isActive ? 'Merek dinonaktifkan' : 'Merek diaktifkan', 'success');
  };

  const handleDeleteBrd = (id: string, name: string) => {
    if (!window.confirm(`Hapus merek "${name}"?`)) return;
    const ok = deleteBrand(id);
    if (!ok) { toast('Tidak bisa menghapus: masih ada produk dengan merek ini', 'error'); return; }
    toast('Merek berhasil dihapus', 'success');
    refresh();
  };

  // ── Options Editor ──
  const [optCategory, setOptCategory] = useState<CatalogCategory | null>(null);
  const [optOpen, setOptOpen] = useState(false);
  const [addingOpt, setAddingOpt] = useState(false);
  const [newOptName, setNewOptName] = useState('');
  const [newOptValues, setNewOptValues] = useState('');

  const openOptions = (c: CatalogCategory) => {
    setOptCategory(c);
    setOptOpen(true);
  };

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
    if (updated) { setOptCategory(updated); refresh(); }
  };

  const handleUpdateOptionName = (opt: CatalogOption, name: string) => {
    if (!optCategory || !name.trim()) return;
    const updated = updateCategoryOption(optCategory.id, opt.id, { name: name.trim() });
    if (updated) { refresh(); }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-[#E5E5EA] pb-0">
        <button
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'category' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-[#64748B] hover:text-[#1C1C1E]'}`}
        >
          <Tag className="w-4 h-4" /> Kategori
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'brand' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-[#64748B] hover:text-[#1C1C1E]'}`}
        >
          <Building2 className="w-4 h-4" /> Merek
        </button>
      </div>

      {/* ── KATEGORI TAB ── */}
      {activeTab === 'category' && (
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-[#E5E5EA] bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1C1C1E]">Kategori</h2>
              <span className="text-xs text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{categories.length}</span>
              <span className="text-xs text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-full">{getActiveCategories().length} aktif</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E8E93]" />
                <input
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Cari kategori..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E5EA] rounded-lg bg-white w-full sm:w-48 outline-none focus:border-[#F5A623]"
                />
              </div>
              <Button variant="accent" size="sm" onClick={openAddCat}>
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            </div>
          </div>

          {filteredCats.length === 0 ? (
            <p className="text-sm text-[#8E8E93] text-center py-12">
              {catSearch ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori. Tambah kategori pertama!'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-3 font-medium text-[#8E8E93]">Nama</th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] hidden md:table-cell">Slug</th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] hidden sm:table-cell">Merek</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93]">Produk</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93] hidden lg:table-cell">Urutan</th>
                    <th className="text-right p-3 font-medium text-[#8E8E93]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCats.map((c) => (
                    <tr key={c.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color || '#F5A623' }} />
                          <span className="font-medium text-[#1C1C1E]">{c.name}</span>
                          {c.options.length > 0 && (
                            <span className="text-[10px] bg-[#EFF6FF] text-[#0284C7] px-1.5 py-0.5 rounded font-medium hidden sm:inline">{c.options.length} opsi</span>
                          )}
                        </div>
                        {c.description && <p className="text-[10px] text-[#8E8E93] mt-0.5 hidden md:block">{c.description}</p>}
                      </td>
                      <td className="p-3 text-[#8E8E93] font-mono text-xs hidden md:table-cell">{c.slug}</td>
                      <td className="p-3 text-[#8E8E93] text-xs hidden sm:table-cell">{brands.find((b) => b.id === c.brandId)?.name || '-'}</td>
                      <td className="p-3 text-center">
                        <span className="text-xs font-medium text-[#1C1C1E]">{counts[c.id] || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleToggleCatActive(c)} className="inline-flex">
                          <Badge variant={c.isActive ? 'success' : 'default'} className="cursor-pointer">
                            {c.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </button>
                      </td>
                      <td className="p-3 text-center text-xs text-[#8E8E93] hidden lg:table-cell">{c.sortOrder}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openOptions(c)} className="p-1.5 rounded-lg hover:bg-[#EFF6FF]" title="Atur Opsi">
                            <Settings2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                          </button>
                          <button onClick={() => openEditCat(c)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]" title="Edit">
                            <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                          </button>
                          <button onClick={() => handleToggleCatActive(c)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]" title={c.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                            {c.isActive ? <EyeOff className="w-3.5 h-3.5 text-[#8E8E93]" /> : <Eye className="w-3.5 h-3.5 text-[#22C55E]" />}
                          </button>
                          <button onClick={() => handleDeleteCat(c.id, c.name)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MEREK TAB ── */}
      {activeTab === 'brand' && (
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-[#E5E5EA] bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1C1C1E]">Merek</h2>
              <span className="text-xs text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">{brands.length}</span>
              <span className="text-xs text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-full">{brands.filter((b) => b.isActive).length} aktif</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E8E93]" />
                <input
                  value={brdSearch}
                  onChange={(e) => setBrdSearch(e.target.value)}
                  placeholder="Cari merek..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E5EA] rounded-lg bg-white w-full sm:w-48 outline-none focus:border-[#F5A623]"
                />
              </div>
              <Button variant="accent" size="sm" onClick={openAddBrd}>
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            </div>
          </div>

          {filteredBrds.length === 0 ? (
            <p className="text-sm text-[#8E8E93] text-center py-12">
              {brdSearch ? 'Tidak ada merek yang cocok' : 'Belum ada merek.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-3 font-medium text-[#8E8E93]">Nama</th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] hidden md:table-cell">Slug</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93]">Produk</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93] hidden lg:table-cell">Urutan</th>
                    <th className="text-right p-3 font-medium text-[#8E8E93]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrds.map((b) => (
                    <tr key={b.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                            {b.logo ? <img src={b.logo} alt={b.name} className="w-6 h-6 object-contain" /> : <Building2 className="w-4 h-4 text-[#0EA5E9]/40" />}
                          </div>
                          <div>
                            <span className="font-medium text-[#1C1C1E]">{b.name}</span>
                            {b.description && <p className="text-[10px] text-[#8E8E93] hidden md:block">{b.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-[#8E8E93] font-mono text-xs hidden md:table-cell">{b.slug}</td>
                      <td className="p-3 text-center">
                        <span className="text-xs font-medium text-[#1C1C1E]">{counts[`brd:${b.id}`] || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleToggleBrdActive(b)} className="inline-flex">
                          <Badge variant={b.isActive ? 'success' : 'default'} className="cursor-pointer">
                            {b.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </button>
                      </td>
                      <td className="p-3 text-center text-xs text-[#8E8E93] hidden lg:table-cell">{b.sortOrder}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditBrd(b)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]" title="Edit">
                            <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                          </button>
                          <button onClick={() => handleToggleBrdActive(b)} className="p-1.5 rounded-lg hover:bg-[#F2F2F7]" title={b.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                            {b.isActive ? <EyeOff className="w-3.5 h-3.5 text-[#8E8E93]" /> : <Eye className="w-3.5 h-3.5 text-[#22C55E]" />}
                          </button>
                          <button onClick={() => handleDeleteBrd(b.id, b.name)} className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── CATEGORY DIALOG ── */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{catEdit ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
          </DialogHeader>
          {catSuggest && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-3 py-2 text-xs text-[#92400E]">
              {catSuggest}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input value={catName} onChange={(e) => handleCatNameChange(e.target.value)} placeholder="Contoh: Sepeda Listrik" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="contoh: sepeda-listrik" className="font-mono text-xs" />
              {catEdit && <p className="text-[10px] text-[#F97316]">Mengubah slug dapat merusak link yang sudah ada</p>}
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} rows={2} placeholder="Deskripsi singkat kategori..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Warna Accent</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={catColor} onChange={(e) => setCatColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[#E5E5EA] cursor-pointer" />
                  <input value={catColor} onChange={(e) => setCatColor(e.target.value)} className="flex-1 border border-[#E5E5EA] rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:border-[#F5A623]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Urutan Tampil</Label>
                <Input type="number" value={catSortOrder} onChange={(e) => setCatSortOrder(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Induk Merek</Label>
              <select
                value={catBrandId}
                onChange={(e) => setCatBrandId(e.target.value)}
                className="w-full border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm bg-white text-[#1C1C1E] outline-none focus:border-[#F5A623]"
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
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setCatOpen(false)}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleSaveCat}>
                {catEdit ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── BRAND DIALOG ── */}
      <Dialog open={brdOpen} onOpenChange={setBrdOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{brdEdit ? 'Edit Merek' : 'Tambah Merek'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Merek</Label>
              <Input value={brdName} onChange={(e) => handleBrdNameChange(e.target.value)} placeholder="Contoh: Polygon" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={brdSlug} onChange={(e) => setBrdSlug(e.target.value)} placeholder="contoh: polygon" className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={brdDesc} onChange={(e) => setBrdDesc(e.target.value)} rows={2} placeholder="Deskripsi singkat merek..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Urutan Tampil</Label>
                <Input type="number" value={brdSortOrder} onChange={(e) => setBrdSortOrder(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL Logo (opsional)</Label>
              <Input value={brdLogo} onChange={(e) => setBrdLogo(e.target.value)} placeholder="https://..." />
              {brdLogo && (
                <div className="w-12 h-12 rounded-lg border border-[#E5E5EA] overflow-hidden mt-1">
                  <img src={brdLogo} alt="Preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setBrdOpen(false)}>Batal</Button>
              <Button variant="accent" className="flex-1" onClick={handleSaveBrd}>
                {brdEdit ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── OPTIONS DIALOG ── */}
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
            {optCategory && optCategory.options.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
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
                    <p className="text-[10px] text-[#8E8E93]">{opt.values.length} nilai: {opt.values.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8E8E93] text-center py-6">Belum ada opsi untuk kategori ini.</p>
            )}
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
    </div>
  );
}
