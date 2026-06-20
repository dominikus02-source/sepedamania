'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';
import { ChevronLeft, ChevronRight, MapPin, Package, CreditCard, Truck, Banknote, Smartphone, QrCode, Loader2, Clock, CheckCircle, Copy } from 'lucide-react';

const addressSchema = z.object({
  recipient: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^08\d{8,11}$/, 'Format: 08xxxxxxxxxx'),
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
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getTotalWeight, voucherDiscount, voucherCode, clearCart } = useCartStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [provinces, setProvinces] = useState<{ province_id: string; province: string }[]>([]);
  const [cities, setCities] = useState<{ city_id: string; city_name: string }[]>([]);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(24 * 60 * 60);

  // Countdown timer untuk step 4
  useEffect(() => {
    if (step !== 4 || !orderResult) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, orderResult]);

  const subtotal = getTotal();
  const totalWeight = getTotalWeight();
  const total = subtotal + shippingCost - voucherDiscount;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { recipient: '', phone: '', province: '', city: '', district: '', postalCode: '', detail: '' },
  });

  const selectedProvince = watch('province');

  // Load provinces
  useEffect(() => {
    fetch('/api/shipping')
      .then((r) => r.json())
      .then((data) => {
        if (data.provinces) setProvinces(data.provinces);
      })
      .catch(() => {});
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (!selectedProvince) { setCities([]); return; }
    fetch(`/api/shipping/cities?provinceId=${selectedProvince}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.cities) setCities(data.cities);
      })
      .catch(() => setCities([]));
    setValue('city', '');
  }, [selectedProvince, setValue]);

  const fetchShippingCost = useCallback(async (courierId: string) => {
    setShippingLoading(true);
    setSelectedService('');
    setShippingCost(0);
    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier: courierId, weight: totalWeight }),
      });
      const data = await res.json();
      setShippingRates(data.costs || []);
    } catch {
      setShippingRates([]);
    } finally {
      setShippingLoading(false);
    }
  }, [totalWeight]);

  useEffect(() => {
    if (selectedCourier) fetchShippingCost(selectedCourier);
  }, [selectedCourier, fetchShippingCost]);

  const onAddressSubmit = () => setStep(2);

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const addr = watch();
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
        })),
        address: addr,
        courier: selectedCourier,
        courierService: selectedService,
        shippingCost,
        paymentMethod,
        voucherCode,
        voucherDiscount,
      };

      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal membuat pesanan');

      setOrderResult(result.order);
      setStep(4);
      clearCart();
    } catch (err: any) {
      toast(err.message || 'Gagal membuat pesanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderResult) return;
    setConfirmLoading(true);
    try {
      await fetch(`/api/orders/${orderResult.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID', status: 'PROCESSING' }),
      });
      router.push(`/pesanan/${orderResult.id}`);
    } catch {
      toast('Gagal konfirmasi pembayaran', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0 && !orderResult) {
    return (
      <div className="p-4 text-center py-16">
        <Package className="w-12 h-12 text-[#E5E5EA] mx-auto mb-3" />
        <p className="text-[#8E8E93]">Keranjang kosong. Mulai belanja dulu!</p>
        <Button variant="accent" className="mt-4" onClick={() => router.push('/')}>Belanja Sekarang</Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { num: 1, label: 'Alamat', icon: MapPin },
          { num: 2, label: 'Kirim', icon: Truck },
          { num: 3, label: 'Bayar', icon: CreditCard },
          { num: 4, label: 'Konfirmasi', icon: CheckCircle },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s.num ? 'bg-[#F5A623] text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}>{s.label}</span>
            {i < 3 && <div className={`w-8 sm:w-12 h-0.5 ${step > s.num ? 'bg-[#F5A623]' : 'bg-[#E5E5EA]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Alamat */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
          <h2 className="text-lg font-bold text-[#1C1C1E]">Alamat Pengiriman</h2>
          <div className="space-y-3 bg-white rounded-xl border border-[#E5E5EA] p-4">
            <div>
              <Label>Nama Penerima</Label>
              <Input {...register('recipient')} placeholder="Nama lengkap" />
              {errors.recipient && <p className="text-xs text-[#FF3B30] mt-1">{errors.recipient.message}</p>}
            </div>
            <div>
              <Label>No. HP</Label>
              <Input {...register('phone')} placeholder="08123456789" type="tel" />
              {errors.phone && <p className="text-xs text-[#FF3B30] mt-1">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Provinsi</Label>
                <select {...register('province')} className="w-full h-10 rounded-lg border border-[#E5E5EA] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#F5A623]">
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                </select>
                {errors.province && <p className="text-xs text-[#FF3B30] mt-1">{errors.province.message}</p>}
              </div>
              <div>
                <Label>Kota</Label>
                <select {...register('city')} className="w-full h-10 rounded-lg border border-[#E5E5EA] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#F5A623]" disabled={!selectedProvince}>
                  <option value="">Pilih Kota</option>
                  {cities.map((c) => <option key={c.city_id} value={c.city_name}>{c.city_name}</option>)}
                </select>
                {errors.city && <p className="text-xs text-[#FF3B30] mt-1">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <Label>Kecamatan</Label>
              <Input {...register('district')} placeholder="Menteng" />
              {errors.district && <p className="text-xs text-[#FF3B30] mt-1">{errors.district.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Kode Pos</Label>
                <Input {...register('postalCode')} placeholder="12345" maxLength={5} />
                {errors.postalCode && <p className="text-xs text-[#FF3B30] mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <Label>Label Alamat</Label>
                <select className="w-full h-10 rounded-lg border border-[#E5E5EA] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#F5A623]" defaultValue="Rumah">
                  <option>Rumah</option>
                  <option>Kantor</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Alamat Lengkap</Label>
              <textarea {...register('detail')} className="w-full min-h-[80px] rounded-lg border border-[#E5E5EA] p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-[#F5A623]" placeholder="Jalan, nomor, RT/RW, gedung, dll." />
              {errors.detail && <p className="text-xs text-[#FF3B30] mt-1">{errors.detail.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full h-12">
            Lanjut ke Pengiriman <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}

      {/* Step 2: Pengiriman */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1C1C1E]">Pilih Jasa Pengiriman</h2>
          <div className="space-y-2">
            <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
              {COURIERS.map((c) => (
                <RadioGroupItem key={c.id} value={c.id}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#F5A623]" />
                      <span className="font-medium text-sm">{c.label}</span>
                    </div>
                    {selectedCourier === c.id && (
                      <div className="mt-3 space-y-2 pl-8">
                        {shippingLoading ? (
                          <div className="flex items-center gap-2 text-sm text-[#8E8E93] py-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menghitung ongkir...
                          </div>
                        ) : shippingRates.length > 0 ? (
                          shippingRates.map((rate: any) => (
                            <button
                              key={rate.service}
                              type="button"
                              onClick={() => { setSelectedService(rate.service); setShippingCost(rate.cost); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                                selectedService === rate.service
                                  ? 'border-[#F5A623] bg-[#F5A623]/5'
                                  : 'border-[#E5E5EA] bg-white'
                              }`}
                            >
                              <div className="text-left">
                                <p className="font-medium text-[#1C1C1E]">{rate.service}</p>
                                <p className="text-xs text-[#8E8E93]">{rate.description} — {rate.etd}</p>
                              </div>
                              <span className="font-semibold">{formatPrice(rate.cost)}</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-[#8E8E93] py-3">Tidak ada layanan tersedia</p>
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
            <Button className="flex-1 h-12" onClick={() => setStep(3)} disabled={!selectedService}>
              Lanjut ke Pembayaran <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Pembayaran */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1C1C1E]">Metode Pembayaran</h2>
          <div className="bg-white rounded-xl border border-[#E5E5EA] divide-y divide-[#E5E5EA]">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    paymentMethod === pm.id ? 'bg-[#F5A623]/5' : ''
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === pm.id ? 'border-[#F5A623]' : 'border-[#C7C7CC]'
                  }`}>
                    {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-[#F5A623]" />}
                  </div>
                  <Icon className="w-5 h-5 text-[#F5A623]" />
                  <span className="text-sm font-medium">{pm.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-[#E5E5EA] p-4 space-y-2">
            <h3 className="font-semibold text-sm text-[#1C1C1E] mb-2">Ringkasan Pesanan</h3>
            {items.map((item) => (
              <div key={`${item.productId}::${item.variantId || ''}`} className="flex items-center gap-2 text-sm">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0">
                  <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.name}</p>
                  <p className="text-xs text-[#8E8E93]">{item.qty}x {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Ongkos Kirim ({selectedCourier.toUpperCase()} {selectedService})</span><span>{formatPrice(shippingCost)}</span></div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-sm"><span className="text-[#34C759]">Diskon ({voucherCode})</span><span className="text-[#34C759]">-{formatPrice(voucherDiscount)}</span></div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg text-[#1C1C1E]"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button variant="accent" className="flex-1 h-12" onClick={handleCreateOrder} disabled={!paymentMethod || loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
              ) : (
                <>Bayar {formatPrice(total)}</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Konfirmasi Pembayaran */}
      {step === 4 && orderResult && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-[#34C759]" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1C1E]">Pesanan Dibuat!</h2>
            <p className="text-sm text-[#8E8E93] mt-1">Silakan selesaikan pembayaran</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E5EA] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">ID Pesanan</span>
              <span className="text-sm font-mono font-bold">{orderResult.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Total Bayar</span>
              <span className="text-lg font-bold text-[#FF3B30]">{formatPrice(orderResult.total)}</span>
            </div>
            <Separator />

            <div>
              <h3 className="font-semibold text-sm text-[#1C1C1E] mb-2">Instruksi Pembayaran</h3>
              <div className="bg-[#F2F2F7] rounded-xl p-4 space-y-3">
                {orderResult.paymentInstructions?.bank && (
                  <div>
                    <p className="text-xs text-[#8E8E93] mb-1">Bank</p>
                    <p className="font-semibold text-[#1C1C1E]">{orderResult.paymentInstructions.bank}</p>
                  </div>
                )}
                {orderResult.paymentInstructions?.vaNumber && (
                  <div>
                    <p className="text-xs text-[#8E8E93] mb-1">Nomor Virtual Account</p>
                    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-[#E5E5EA]">
                      <p className="text-xl font-bold font-mono text-[#1C1C1E] tracking-wider flex-1">{orderResult.paymentInstructions.vaNumber}</p>
                      <button onClick={() => copyToClipboard(orderResult.paymentInstructions.vaNumber)} className="p-2 rounded-lg hover:bg-[#F2F2F7] transition-colors">
                        {copied ? <CheckCircle className="w-5 h-5 text-[#34C759]" /> : <Copy className="w-5 h-5 text-[#8E8E93]" />}
                      </button>
                    </div>
                  </div>
                )}
                {orderResult.paymentInstructions?.qr && (
                  <div className="flex flex-col items-center py-3">
                    <Image src={orderResult.paymentInstructions.qr} alt="QRIS" width={160} height={160} className="rounded-xl" />
                    <p className="text-xs text-[#8E8E93] mt-2">Scan QRIS dengan e-wallet</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#8E8E93] mb-1.5">Langkah-langkah:</p>
                  <ol className="space-y-1.5">
                    {orderResult.paymentInstructions?.instructions?.map((inst: string, i: number) => (
                      <li key={i} className="text-sm text-[#1C1C1E] flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FFF3E0]">
              <Clock className="w-4 h-4 text-[#F5A623] shrink-0" />
              <span className="text-xs text-[#8E8E93]">
                Sisa waktu: <strong>{Math.floor(countdown / 3600)}j {Math.floor((countdown % 3600) / 60)}m {countdown % 60}d</strong> — Pesanan akan dibatalkan jika tidak dibayar.
              </span>
            </div>
          </div>

          <Button variant="accent" className="w-full h-12" onClick={handleConfirmPayment} disabled={confirmLoading}>
            {confirmLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
            ) : (
              'Saya Sudah Bayar'
            )}
          </Button>
          <p className="text-xs text-[#8E8E93] text-center">Setelah transfer, klik tombol di atas untuk konfirmasi pembayaran</p>
        </div>
      )}
    </div>
  );
}
