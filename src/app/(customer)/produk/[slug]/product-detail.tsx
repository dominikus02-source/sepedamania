'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantityPicker } from '@/components/ui/quantity-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductCard } from '@/components/customer/product-card';
import { StarRating } from '@/components/customer/star-rating';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';
import { ShoppingCart, ChevronLeft, Share2, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  stock: number;
  weight: number;
  sold: number;
  rating?: number;
  reviewCount?: number;
  description: string;
  brand: { name: string };
  category: { name: string };
  variants?: { id: string; name: string; value: string; stock: number; price?: number | null; sku: string }[];
  reviews?: { id: string; rating: number; comment?: string; user: { name: string } }[];
  [key: string]: unknown;
}

export function ProductDetail({ product, relatedProducts }: { product: ProductData; relatedProducts: ProductData[] }) {
  const [selImg, setSelImg] = useState(0);
  const [selVar, setSelVar] = useState<{ name: string; value: string } | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('deskripsi');
  const addItem = useCartStore(s => s.addItem);
  const { toast } = useToast();
  const router = useRouter();

  const isSale = product.salePrice && product.salePrice < product.price;
  const dp = Number(isSale ? product.salePrice! : product.price);

  const gv = (product.variants || []).reduce((acc: Record<string, { id: string; name: string; value: string; stock: number; price?: number | null; sku: string }[]>, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v); return acc;
  }, {} as Record<string, { id: string; name: string; value: string; stock: number; price?: number | null; sku: string }[]>);

  const handleAdd = () => {
    const hasVariants = Object.keys(gv).length > 0;
    if (hasVariants && !selVar) {
      toast('Pilih ukuran/varian terlebih dahulu', 'error');
      return;
    }
    const variant = selVar ? (product.variants || []).find((v) => v.value === selVar.value) : null;
    const stockToCheck = variant ? variant.stock : product.stock;
    if (stockToCheck <= 0) {
      toast('Stok produk habis', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: variant?.id || undefined,
      name: product.name + (selVar ? ` (${selVar.value})` : ''),
      slug: product.slug,
      price: Number(isSale ? product.salePrice! : product.price),
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: stockToCheck,
      variantLabel: selVar ? `${selVar.name}: ${selVar.value}` : undefined,
      weight: product.weight,
      qty,
    });
    toast('Produk ditambahkan ke keranjang!', 'success');
  };

  const handleBuy = () => { handleAdd(); router.push('/keranjang'); };

  return (
    <div className="pb-24">
      <div className="relative">
        <div className="relative aspect-square bg-[#F2F2F7]">
          <Image src={product.images[selImg] || '/images/placeholder.svg'} alt={product.name} fill className="object-cover" sizes="100vw" priority />
          <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
          <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"><Share2 className="w-4 h-4" /></button>
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button key={i} onClick={() => setSelImg(i)} className={cn('relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors', selImg === i ? 'border-[#F5A623]' : 'border-transparent')}>
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-[#8E8E93] mb-1">{product.brand.name}</p>
            <h1 className="text-xl font-bold text-[#1C1C1E] leading-tight">{product.name}</h1>
            <p className="text-xs text-[#8E8E93] mt-1">SKU: {product.sku}</p>
          </div>
          <button className="w-9 h-9 rounded-full border border-[#E5E5EA] flex items-center justify-center flex-shrink-0"><Heart className="w-4 h-4 text-[#8E8E93]" /></button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1"><StarRating rating={Math.round(product.rating || 0)} size="sm" /><span className="text-xs text-[#8E8E93] ml-1">{product.rating || 0}</span></div>
          <span className="text-xs text-[#8E8E93]">| Terjual {product.sold}</span>
          {product.reviewCount ? <span className="text-xs text-[#8E8E93]">({product.reviewCount} ulasan)</span> : null}
          <Badge variant={product.stock > 5 ? 'success' : 'destructive'}>Stok {product.stock > 5 ? 'Tersedia' : `Sisa ${product.stock}`}</Badge>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
                          <span className="text-2xl font-bold text-[#1C1C1E] font-mono">{formatPrice(dp)}</span>
          {isSale && <><span className="text-sm text-[#8E8E93] line-through">{formatPrice(product.price)}</span><Badge variant="destructive">-{Math.round((1 - product.salePrice! / product.price) * 100)}%</Badge></>}
        </div>
      </div>

      {Object.keys(gv).length > 0 && (
        <div className="px-4 mt-4">
          {Object.entries(gv).map(([name, values]) => (
            <div key={name} className="mb-3">
              <p className="text-sm font-medium text-[#1C1C1E] mb-2">{name}</p>
              <div className="flex flex-wrap gap-2">
                {values.map((v) => (
                  <button key={v.id} onClick={() => setSelVar({ name: v.name, value: v.value })}
                    className={cn('px-4 py-2 rounded-lg border text-sm font-medium transition-all', selVar?.value === v.value ? 'border-[#F5A623] bg-[#F5A623]/5 text-[#F5A623]' : 'border-[#E5E5EA] text-[#1C1C1E] hover:border-[#F5A623]')}
                    disabled={v.stock <= 0}>{v.value}{v.stock <= 0 && <span className="text-xs text-[#8E8E93] ml-1">(Habis)</span>}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 mt-4 flex items-center gap-3">
        <QuantityPicker value={qty} min={1} max={product.stock} onChange={setQty} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="px-4 mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
          <TabsTrigger value="spesifikasi">Spesifikasi</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan ({(product.reviews ?? []).length})</TabsTrigger>
        </TabsList>
        <TabsContent value="deskripsi"><p className="text-sm text-[#1C1C1E] leading-relaxed whitespace-pre-line">{product.description}</p></TabsContent>
        <TabsContent value="spesifikasi">
          <div className="space-y-2">
            {[{ label: 'Berat', val: `${(product.weight / 1000).toFixed(1)} kg` }, { label: 'Merek', val: product.brand.name }, { label: 'Kategori', val: product.category.name }].map((s) => (
              <div key={s.label} className="flex justify-between py-2 border-b border-[#E5E5EA]">
                <span className="text-sm text-[#8E8E93]">{s.label}</span>
                <span className="text-sm text-[#1C1C1E] font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ulasan">
          {(product.reviews ?? []).length === 0 ? (
            <p className="text-sm text-[#8E8E93] text-center py-8">Belum ada ulasan untuk produk ini.</p>
          ) : (
            <div className="space-y-4">
              {(product.reviews ?? []).map((review) => (
                <div key={review.id} className="p-3 rounded-lg bg-[#F2F2F7]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center text-xs font-medium">{review.user.name.charAt(0)}</div>
                    <div><p className="text-sm font-medium text-[#1C1C1E]">{review.user.name}</p><StarRating rating={review.rating} size="sm" /></div>
                  </div>
                  {review.comment && <p className="text-sm text-[#1C1C1E]">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="px-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: Truck, text: 'Gratis Ongkir*' }, { icon: Shield, text: 'Garansi Resmi' }, { icon: RotateCcw, text: '30 Hari Retur' }].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[#F2F2F7]">
              <Icon className="w-5 h-5 text-[#F5A623]" />
              <span className="text-[10px] text-[#8E8E93] text-center">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-[#1C1C1E] mb-3">Produk Terkait</h2>
          <div className="grid grid-cols-2 gap-3">{relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5EA] px-4 py-3 pb-safe">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button variant="outline" className="flex-1" onClick={handleAdd}><ShoppingCart className="w-4 h-4 mr-2" />Keranjang</Button>
          <Button variant="accent" className="flex-1" onClick={handleBuy}>Beli Sekarang</Button>
        </div>
      </div>
    </div>
  );
}
