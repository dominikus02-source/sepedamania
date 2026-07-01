'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getProductBySlugFromApi, getRelatedProducts } from '@/lib/catalog-data';
import { useRouter } from 'next/navigation';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductCard } from '@/components/customer/product-card';
import { StarRating } from '@/components/customer/star-rating';
import { TrustBadges } from '@/components/customer/trust-badges';
import { useCartStore } from '@/store/cart';
import { useCompareStore } from '@/store/compare-store';
import { useToast } from '@/components/ui/toaster';
import { ShoppingCart, ChevronLeft, Heart, Truck, Shield, RotateCcw, Minus, Plus, BarChart3 } from 'lucide-react';

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
  videoUrl?: string;
  videoUrls?: string[];
  variants?: { id: string; name: string; value: string; stock: number; price?: number | null; sku: string }[];
  reviews?: { id: string; rating: number; comment?: string; user: { name: string } }[];
  [key: string]: unknown;
}

export function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selImg, setSelImg] = useState(0);
  const [selVar, setSelVar] = useState<{ name: string; value: string } | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('deskripsi');
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const addItem = useCartStore(s => s.addItem);
  const { addItem: addCompareItem, isInCompare } = useCompareStore();
  const { toast } = useToast();

  useEffect(() => {
    getProductBySlugFromApi(slug).then((p) => {
      if (p) {
        setProduct({
          ...p,
          price: Number(p.price),
          salePrice: p.salePrice ? Number(p.salePrice) : null,
          variants: p.variants.map(v => ({ ...v, price: v.price ? Number(v.price) : null })),
          reviews: p.reviews.map(r => ({ ...r })),
        } as ProductData);
        setRelatedProducts(
        getRelatedProducts(p.id).map(r => ({
          ...r,
          price: Number(r.price),
          salePrice: r.salePrice ? Number(r.salePrice) : null,
        })) as ProductData[]
      );
    }
    setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 text-center py-20">
        <p className="text-[#8E8E93]">Produk tidak ditemukan</p>
        <Link href="/" className="text-sm text-[#F5A623] font-medium mt-2 inline-block">Kembali ke Beranda</Link>
      </div>
    );
  }

  const isSale = product.salePrice && product.salePrice < product.price;
  const dp = Number(isSale ? product.salePrice! : product.price);

  const gv = (product.variants || []).reduce((acc, v) => {
    const group = acc[v.name];
    if (group) {
      group.push(v);
    } else {
      acc[v.name] = [v];
    }
    return acc;
  }, {} as Record<string, NonNullable<typeof product.variants>>);

  const selectedVariant = selVar
    ? (product.variants || []).find((v) => v.value === selVar.value) ?? null
    : null;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentPrice = selectedVariant?.price ?? dp;

  const handleAdd = () => {
    const hasVariants = Object.keys(gv).length > 0;
    if (hasVariants && !selVar) {
      toast('Pilih ukuran/varian terlebih dahulu', 'error');
      return;
    }
    if (currentStock <= 0) {
      toast('Stok produk habis', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || undefined,
      name: product.name + (selVar ? ` (${selVar.value})` : ''),
      slug: product.slug,
      price: currentPrice,
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: currentStock,
      variantLabel: selVar ? `${selVar.name}: ${selVar.value}` : undefined,
      weight: product.weight,
      qty,
    });
    toast('Produk ditambahkan ke keranjang!', 'success');
  };

  const handleBuy = () => {
    const hasVariants = Object.keys(gv).length > 0;
    if (hasVariants && !selVar) {
      toast('Pilih ukuran/varian terlebih dahulu', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || undefined,
      name: product.name + (selVar ? ` (${selVar.value})` : ''),
      slug: product.slug,
      price: currentPrice,
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: currentStock,
      variantLabel: selVar ? `${selVar.name}: ${selVar.value}` : undefined,
      weight: product.weight,
      qty,
    });
    router.push('/checkout');
  };

  const renderImage = (src: string, index: number, className: string, opts?: { priority?: boolean; sizes?: string }) => {
    if (imgError[index]) {
      return (
        <div className={`absolute inset-0 bg-gradient-to-br from-[#E5E7EB] to-[#F3F4F6] flex items-center justify-center ${className}`}>
          <div className="text-center">
            <ShoppingCart className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
            <span className="text-sm text-[#9CA3AF]">{product.name}</span>
          </div>
        </div>
      );
    }
    return (
      <Image
        src={src}
        alt={product.name}
        fill
        className={className}
        sizes={opts?.sizes || '100vw'}
        priority={opts?.priority}
        onError={() => setImgError((prev) => ({ ...prev, [index]: true }))}
      />
    );
  };

  return (
    <div className="pb-32">
      {/* Image Gallery */}
      <div className="relative">
        <div className="relative aspect-square bg-[#F3F4F6]">
          {renderImage(product.images[selImg] || '', selImg, 'object-cover', { priority: true })}
          <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelImg(i)}
                className={cn(
                  'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                  selImg === i ? 'border-[#0EA5E9] ring-1 ring-[#0EA5E9]/30' : 'border-transparent',
                )}
              >
                {renderImage(img, i, 'object-cover', { sizes: '64px' })}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      {(product.videoUrls?.filter(Boolean).length || product.videoUrl) && (
        <div className="px-4 mt-2 space-y-2">
          {(product.videoUrls?.filter(Boolean).length ? product.videoUrls : [product.videoUrl]).filter(Boolean).map((v, i) => (
            <div key={i}>
              {v!.startsWith('data:') ? (
                <video src={v} className="w-full aspect-video rounded-xl object-cover" controls />
              ) : (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  <video src={v} className="w-full h-full object-contain" controls />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="px-4 mt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-[#6B7280] mb-1 font-medium uppercase tracking-wider">{product.brand.name}</p>
            <h1 className="text-xl font-bold text-[#111827] leading-tight font-display">{product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <StarRating rating={Math.round(product.rating || 0)} size="sm" />
            <span className="text-xs text-[#6B7280] ml-1">{product.rating || '-'}</span>
          </div>
          <span className="text-xs text-[#9CA3AF]">|</span>
          <span className="text-xs text-[#6B7280]">Terjual {product.sold}</span>
          {product.reviewCount ? (
            <>
              <span className="text-xs text-[#9CA3AF]">|</span>
              <span className="text-xs text-[#6B7280]">{product.reviewCount} ulasan</span>
            </>
          ) : null}
          <Badge variant={currentStock > 5 ? 'success' : 'destructive'} className="text-[10px]">
            {currentStock > 5 ? 'Stok Tersedia' : currentStock > 0 ? `Sisa ${currentStock}` : 'Habis'}
          </Badge>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold text-[#111827] font-mono">{formatPrice(currentPrice)}</span>
          {isSale && (
            <>
              <span className="text-sm text-[#9CA3AF] line-through">{formatPrice(product.price)}</span>
              <Badge variant="destructive" className="text-[10px]">
                -{Math.round((1 - product.salePrice! / product.price) * 100)}%
              </Badge>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-4">
          <TrustBadges variant="full" />
        </div>
      </div>

      {/* Variations */}
      {Object.keys(gv).length > 0 && (
        <div className="px-4 mt-5">
          {Object.entries(gv).map(([name, values]) => (
            <div key={name} className="mb-3">
              <p className="text-sm font-medium text-[#111827] mb-2">{name}</p>
              <div className="flex flex-wrap gap-2">
                {values.map((v) => {
                  const isSelected = selVar?.value === v.value;
                  const isOutOfStock = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        if (!isOutOfStock) setSelVar({ name: v.name, value: v.value });
                      }}
                      disabled={isOutOfStock}
                      className={cn(
                        'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                        isSelected
                          ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 text-[#0EA5E9] ring-1 ring-[#0EA5E9]/20'
                          : isOutOfStock
                            ? 'border-[#E5E7EB] text-[#D1D5DB] cursor-not-allowed line-through'
                            : 'border-[#E5E7EB] text-[#111827] hover:border-[#0EA5E9] hover:bg-[#F9FAFB]',
                      )}
                    >
                      {v.value}
                      {isOutOfStock && <span className="text-[10px] ml-1">(Habis)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity */}
      <div className="px-4 mt-5">
        <p className="text-sm font-medium text-[#111827] mb-2">Jumlah</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F3F4F6] rounded-xl p-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
              disabled={qty <= 1}
            >
              <Minus className="w-4 h-4 text-[#6B7280]" />
            </button>
            <span className="w-10 text-center font-semibold text-[#111827]">{qty}</span>
            <button
              onClick={() => setQty(Math.min(currentStock, qty + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
              disabled={qty >= currentStock}
            >
              <Plus className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
          <span className="text-xs text-[#6B7280]">Sisa {currentStock}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="px-4 mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
          <TabsTrigger value="spesifikasi">Spesifikasi</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan ({(product.reviews ?? []).length})</TabsTrigger>
        </TabsList>
        <TabsContent value="deskripsi">
          <p className="text-sm text-[#111827] leading-relaxed whitespace-pre-line">{product.description}</p>
        </TabsContent>
        <TabsContent value="spesifikasi">
          <div className="space-y-2">
            {[
              { label: 'Berat', val: `${(product.weight / 1000).toFixed(1)} kg` },
              { label: 'Merek', val: product.brand.name },
              { label: 'Kategori', val: product.category.name },
            ].map((s) => (
              <div key={s.label} className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-sm text-[#6B7280]">{s.label}</span>
                <span className="text-sm text-[#111827] font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ulasan">
          {(product.reviews ?? []).length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-8">Belum ada ulasan untuk produk ini.</p>
          ) : (
            <div className="space-y-4">
              {(product.reviews ?? []).map((review) => (
                <div key={review.id} className="p-3 rounded-lg bg-[#F3F4F6]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-medium text-[#111827]">
                      {review.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{review.user.name}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-[#111827]">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Service Features */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, text: 'Gratis Ongkir*', href: '/pengiriman' },
            { icon: Shield, text: 'Garansi Resmi', href: '#' },
            { icon: RotateCcw, text: '30 Hari Retur', href: '/pengembalian' },
          ].map(({ icon: Icon, text, href }) => (
            <Link key={text} href={href} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#F3F4F6] hover:bg-[#FDE68A] transition-colors">
              <Icon className="w-5 h-5 text-[#0EA5E9]" />
              <span className="text-[10px] text-[#6B7280] text-center">{text}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-[#111827] mb-3 font-display">Produk Terkait</h2>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] px-4 py-3 pb-[72px] lg:pb-safe">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-11 px-2.5 text-xs"
            onClick={() => {
              const inCompare = isInCompare(product.id);
              if (inCompare) {
                router.push('/compare');
              } else {
                const result = addCompareItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  image: product.images[0] || '/images/placeholder.svg',
                  price: Number(product.price),
                  salePrice: product.salePrice ? Number(product.salePrice) : null,
                  specs: (product.specs as Record<string, string>) || {},
                  category: product.category?.name || '',
                  brand: product.brand?.name || '',
                  stock: product.stock,
                  weight: product.weight || 0,
                  rating: product.rating || 0,
                  reviewCount: product.reviewCount || 0,
                });
                if (result.success) {
                  toast('Ditambahkan ke perbandingan', 'success');
                  router.push('/compare');
                } else {
                  toast(result.message || 'Gagal menambahkan', 'error');
                }
              }
            }}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            {isInCompare(product.id) ? 'Lihat' : 'Bandingkan'}
          </Button>
          <Button variant="outline" className="flex-1 h-11 text-sm" onClick={handleAdd}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Keranjang
          </Button>
          <Button
            className="flex-1 h-11 text-sm font-semibold bg-[#0F172A] hover:bg-[#1E293B] text-white"
            onClick={handleBuy}
          >
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
