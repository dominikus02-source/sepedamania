'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TrustBadges } from '@/components/customer/trust-badges';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';
import { ChevronLeft, ChevronRight, MapPin, Package, CreditCard, Truck, Banknote, Smartphone, QrCode, Loader2, LogIn, Search, Check } from 'lucide-react';
import type { Destination } from '@/lib/rajaongkir';

const addressSchema = z.object({
  recipient: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^08\d{8,11}$/, 'Format: 08xxxxxxxxxx'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  destinationId: z.string().min(1, 'Cari dan pilih kecamatan tujuan'),
  province: z.string().min(1, 'Pilih provinsi'),
  city: z.string().min(1, 'Pilih kota'),
  district: z.string().min(2, 'Isi kecamatan'),
  postalCode: z.string().length(5, 'Kode pos 5 digit').regex(/^\d{5}$/, 'Hanya angka'),
  detail: z.string().min(10, 'Alamat minimal 10 karakter'),
});

type AddressForm = z.infer<typeof addressSchema>;

const PAYMENT_METHODS = [
  { id: 'bca_va', label: 'BCA Virtual Account', icon: Banknote },
  { id: 'bni_va', label: 'BNI Virtual Account', icon: Banknote },
  { id: 'bri_va', label: 'BRI Virtual Account', icon: Banknote },
  { id: 'mandiri_va', label: 'Mandiri Virtual Account', icon: Banknote },
  { id: 'qris', label: 'QRIS (Semua E-Wallet)', icon: QrCode },
  { id: 'ovo', label: 'OVO', icon: Smartphone },
  { id: 'gopay', label: 'GoPay', icon: Smartphone },
  { id: 'dana', label: 'DANA', icon: Smartphone },
  { id: 'shopeepay', label: 'ShopeePay', icon: Smartphone },
  { id: 'credit_card', label: 'Kartu Kredit/Debit', icon: CreditCard },
];

const COURIERS = [
  { id: 'jne', label: 'JNE' },
  { id: 'jnt', label: 'J&T' },
  { id: 'sicepat', label: 'SiCepat' },
  { id: 'anteraja', label: 'Anteraja' },
  { id: 'pos', label: 'Pos Indonesia' },
  { id: 'ninja', label: 'Ninja Xpress' },
  { id: 'lion', label: 'Lion Parcel' },
];


export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, getTotalWeight, voucherDiscount, voucherCode, clearCart } = useCartStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [destQuery, setDestQuery] = useState('');
  const [destResults, setDestResults] = useState<Destination[]>([]);
  const [destLoading, setDestLoading] = useState(false);
  const [destPicked, setDestPicked] = useState<Destination | null>(null);
  const [shippingError, setShippingError] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  interface ShippingRate {
    courier?: string;
    courierName?: string;
    service: string;
    description: string;
    cost: number;
    etd: string;
  }

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const isLoggedIn = !!session;

  const subtotal = getTotal();
  const totalWeight = getTotalWeight();
  const total = subtotal + shippingCost - voucherDiscount;

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { recipient: '', phone: '', email: session?.user?.email || '', destinationId: '', province: '', city: '', district: '', postalCode: '', detail: '' },
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  // Debounced destination lookup. Picking a result fills in the whole address
  // and gives us the id RajaOngkir needs to quote a real rate.
  useEffect(() => {
    const q = destQuery.trim();
    if (q.length < 3) {
      // Clearing happens in the same async slot as the fetch results, so the
      // effect body itself never triggers a synchronous re-render.
      const clear = setTimeout(() => setDestResults([]), 0);
      return () => clearTimeout(clear);
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setDestLoading(true);
      try {
        const res = await fetch(`/api/shipping/destinations?search=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error || 'Gagal mencari alamat');
        setDestResults(json.destinations ?? []);
        setShippingError('');
      } catch (err) {
        if (cancelled) return;
        setDestResults([]);
        setShippingError(err instanceof Error ? err.message : 'Gagal mencari alamat');
      } finally {
        if (!cancelled) setDestLoading(false);
      }
    }, 350);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [destQuery]);

  const pickDestination = (d: Destination) => {
    setDestPicked(d);
    setDestResults([]);
    setDestQuery('');
    setValue('destinationId', String(d.id), { shouldValidate: true });
    setValue('province', d.provinceName, { shouldValidate: true });
    setValue('city', d.cityName, { shouldValidate: true });
    setValue('district', d.districtName, { shouldValidate: true });
    setValue('postalCode', d.zipCode, { shouldValidate: true });
    // Any previously chosen service belongs to the old destination.
    setSelectedService('');
    setShippingCost(0);
    setShippingRates([]);
  };

  useEffect(() => {
    if (!selectedCourier || !destPicked) return;
    let cancelled = false;

    (async () => {
      setSelectedService('');
      setShippingCost(0);
      setShippingRates([]);
      setShippingLoading(true);
      setShippingError('');
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationId: String(destPicked.id),
            weight: totalWeight,
            couriers: [selectedCourier],
          }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error || 'Gagal menghitung ongkir');

        const rates: ShippingRate[] = json.data?.rates ?? [];
        setShippingRates(rates);
        if (rates.length === 0) {
          setShippingError('Kurir ini belum melayani tujuan tersebut. Coba kurir lain.');
        }
      } catch (err) {
        if (cancelled) return;
        setShippingRates([]);
        // Surfaced rather than swallowed: charging a guessed rate is worse
        // than telling the buyer to retry.
        setShippingError(err instanceof Error ? err.message : 'Gagal menghitung ongkir');
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedCourier, totalWeight, destPicked]);

  const onAddressSubmit = () => setStep(2);

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const addr = getValues();
      const customerEmail = session?.user?.email || addr.email || '';
      const customerName = session?.user?.name || addr.recipient;
      const customerPhone = (session?.user as { phone?: string } | undefined)?.phone || addr.phone;

      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
        })),
        customerName,
        customerEmail,
        customerPhone,
        address: {
          recipient: addr.recipient,
          phone: addr.phone,
          email: customerEmail,
          detail: addr.detail,
          district: addr.district,
          city: addr.city,
          province: addr.province,
          postalCode: addr.postalCode,
        },
        courier: selectedCourier,
        courierService: selectedService,
        shippingCost,
        paymentMethod,
        voucherCode,
      };

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal membuat pesanan');

      clearCart();

      if (result.snapRedirectUrl) {
        window.location.href = result.snapRedirectUrl;
      } else if (result.orderNumber) {
        router.push(`/pesanan/${result.orderNumber}`);
      } else {
        router.push('/pesanan');
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Gagal membuat pesanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Masuk untuk Checkout</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Kamu perlu masuk terlebih dahulu untuk melanjutkan proses checkout
          </p>
          <Link
            href="/masuk?callbackUrl=/checkout"
            className="block w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-3 rounded-xl transition-colors text-center"
          >
            Masuk Sekarang
          </Link>
          <Link
            href="/"
            className="block w-full mt-3 border border-[#E2E8F0] text-[#0F172A] font-medium py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors text-center"
          >
            Kembali Berbelanja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 text-center py-16">
        <Package className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
        <p className="text-[#64748B]">Keranjang kosong. Mulai belanja dulu!</p>
        <Button className="mt-4 bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={() => router.push('/')}>Belanja Sekarang</Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { num: 1, label: 'Alamat', icon: MapPin },
          { num: 2, label: 'Kirim', icon: Truck },
          { num: 3, label: 'Bayar', icon: CreditCard },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s.num ? 'bg-[#FBBF24] text-[#0F172A]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
              {step > s.num ? <ChevronRight className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{s.label}</span>
            {i < 2 && <div className={`w-8 sm:w-12 h-0.5 ${step > s.num ? 'bg-[#FBBF24]' : 'bg-[#E2E8F0]'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Alamat Pengiriman</h2>
          <div className="space-y-3 bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div>
              <Label>Nama Penerima</Label>
              <Input {...register('recipient')} placeholder="Nama lengkap" />
              {errors.recipient && <p className="text-xs text-[#EF4444] mt-1">{errors.recipient.message}</p>}
            </div>
            <div>
              <Label>No. HP</Label>
              <Input {...register('phone')} placeholder="08123456789" type="tel" />
              {errors.phone && <p className="text-xs text-[#EF4444] mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Kecamatan Tujuan</Label>
              {destPicked ? (
                <div className="flex items-start justify-between gap-3 rounded-lg border border-[#34C759] bg-[#F0FDF4] px-3 py-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#166534] leading-snug">{destPicked.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDestPicked(null);
                      setValue('destinationId', '');
                      setShippingRates([]);
                      setSelectedService('');
                      setShippingCost(0);
                    }}
                    className="text-xs font-medium text-[#F5A623] shrink-0"
                  >
                    Ubah
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                  <Input
                    className="pl-9"
                    placeholder="Ketik kelurahan, kecamatan, atau kode pos..."
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {destLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] animate-spin" />
                  )}
                  {destResults.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-[#E2E8F0] bg-white shadow-lg">
                      {destResults.map((d) => (
                        <li key={d.id}>
                          <button
                            type="button"
                            onClick={() => pickDestination(d)}
                            className="w-full text-left px-3 py-2 text-sm text-[#1C1C1E] hover:bg-[#FFFBEB] transition-colors"
                          >
                            {d.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {errors.destinationId && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.destinationId.message}</p>
              )}
              <p className="text-[10px] text-[#8E8E93] mt-1">
                Provinsi, kota, kecamatan, dan kode pos terisi otomatis dari pilihan ini.
              </p>
            </div>

            {!session?.user?.email && (
              <div>
                <Label>Email</Label>
                <Input {...register('email')} placeholder="email@contoh.com" type="email" />
                {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>}
              </div>
            )}
            <div>
              <Label>Kecamatan</Label>
              <Input {...register('district')} placeholder="Terisi dari kecamatan tujuan" readOnly className="bg-[#F8FAFC] text-[#64748B]" />
              {errors.district && <p className="text-xs text-[#EF4444] mt-1">{errors.district.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Kode Pos</Label>
                <Input {...register('postalCode')} placeholder="Otomatis" maxLength={5} readOnly className="bg-[#F8FAFC] text-[#64748B]" />
                {errors.postalCode && <p className="text-xs text-[#EF4444] mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <Label>Label Alamat</Label>
                <select className="w-full h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#FBBF24]" defaultValue="Rumah">
                  <option>Rumah</option>
                  <option>Kantor</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Alamat Lengkap</Label>
              <textarea {...register('detail')} className="w-full min-h-[80px] rounded-lg border border-[#E2E8F0] p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-[#FBBF24]" placeholder="Jalan, nomor, RT/RW, gedung, dll." />
              {errors.detail && <p className="text-xs text-[#EF4444] mt-1">{errors.detail.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white">
            Lanjut ke Pengiriman <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Pilih Jasa Pengiriman</h2>
          <div className="space-y-2">
            <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
              {COURIERS.map((c) => (
                <RadioGroupItem key={c.id} value={c.id}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#F97316]" />
                      <span className="font-medium text-sm">{c.label}</span>
                    </div>
                    {selectedCourier === c.id && (
                      <div className="mt-3 space-y-2 pl-8">
                        {shippingLoading ? (
                          <div className="flex items-center gap-2 text-sm text-[#64748B] py-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menghitung ongkir...
                          </div>
                        ) : shippingRates.length > 0 ? (
                          shippingRates.map((rate) => (
                            <button
                              key={rate.service}
                              type="button"
                              onClick={() => { setSelectedService(rate.service); setShippingCost(rate.cost); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                                selectedService === rate.service
                                  ? 'border-[#FBBF24] bg-[#FFFBEB]'
                                  : 'border-[#E2E8F0] bg-white'
                              }`}
                            >
                              <div className="text-left">
                                <p className="font-medium text-[#0F172A]">{rate.service}</p>
                                <p className="text-xs text-[#64748B]">{rate.description} — {rate.etd}</p>
                              </div>
                              <span className="font-semibold">{formatPrice(rate.cost)}</span>
                            </button>
                          ))
                        ) : shippingError ? (
                          <div className="py-3 space-y-2">
                            <p className="text-sm text-[#991B1B]">{shippingError}</p>
                            <button
                              type="button"
                              onClick={() => setSelectedCourier((c) => c)}
                              className="text-xs font-medium text-[#F5A623]"
                            >
                              Coba lagi
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-[#64748B] py-3">Tidak ada layanan tersedia</p>
                        )}
                      </div>
                    )}
                  </div>
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button className="flex-1 h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={() => setStep(3)} disabled={!selectedService}>
              Lanjut ke Pembayaran <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Metode Pembayaran</h2>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    paymentMethod === pm.id ? 'bg-[#FFFBEB]' : ''
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === pm.id ? 'border-[#FBBF24]' : 'border-[#CBD5E1]'
                  }`}>
                    {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />}
                  </div>
                  <Icon className="w-5 h-5 text-[#F97316]" />
                  <span className="text-sm font-medium">{pm.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-2">
            <h3 className="font-semibold text-sm text-[#0F172A] mb-2">Ringkasan Pesanan</h3>
            {items.map((item) => (
              <div key={`${item.productId}::${item.variantId || ''}`} className="flex items-center gap-2 text-sm">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                  <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.name}</p>
                  {item.variantLabel && <p className="text-[10px] text-[#64748B]">{item.variantLabel}</p>}
                  <p className="text-xs text-[#64748B]">{item.qty}x {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm"><span className="text-[#64748B]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#64748B]">Ongkos Kirim ({selectedCourier.toUpperCase()} {selectedService})</span><span>{formatPrice(shippingCost)}</span></div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-sm"><span className="text-[#16A34A]">Diskon ({voucherCode})</span><span className="text-[#16A34A]">-{formatPrice(voucherDiscount)}</span></div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg text-[#0F172A]"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <div className="mt-4">
            <TrustBadges variant="full" />
          </div>
          <div className="mt-2 text-center">
            <Link href="/pengembalian" className="text-xs text-[#64748B] hover:text-[#F97316] transition-colors">
              Kebijakan Pengembalian Barang
            </Link>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button className="flex-1 h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={handleCreateOrder} disabled={!paymentMethod || loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
              ) : (
                <>Bayar {formatPrice(total)}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
