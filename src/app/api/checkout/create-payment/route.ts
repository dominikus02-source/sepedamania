import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMockOrder, setMockOrder, generateOrderId } from '@/lib/mock-orders';
import { mockProducts } from '@/lib/mock-data';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

// C5: Zod validation schema for order creation
const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    qty: z.number().int().positive(),
  })).min(1, 'Minimal 1 item'),
  shippingAddress: z.object({
    recipient: z.string().min(1, 'Nama penerima wajib diisi'),
    phone: z.string().min(1, 'No HP wajib diisi'),
    detail: z.string().min(1, 'Alamat lengkap wajib diisi'),
    district: z.string().min(1, 'Kecamatan wajib diisi'),
    cityName: z.string().min(1, 'Kota wajib diisi'),
    provinceName: z.string().min(1, 'Provinsi wajib diisi'),
    postalCode: z.string().min(1, 'Kode pos wajib diisi'),
  }),
  courier: z.string().min(1, 'Kurir wajib dipilih'),
  courierService: z.string().min(1, 'Layanan kurir wajib dipilih'),
  shippingCost: z.number(),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  voucherCode: z.string().nullable().optional(),
  guestEmail: z.string().email('Email tidak valid').optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  notes: z.string().optional(),
});

const paymentInstructions: Record<string, { bank?: string; vaNumber?: string; qr?: string; ewallet?: string; instructions: string[] }> = {
  bca_va: { bank: 'BCA', vaNumber: '700' + 'XXXXXXXXXX', instructions: ['Buka mobile banking BCA', 'Pilih m-Transfer > BCA Virtual Account', 'Masukkan nomor VA', 'Konfirmasi pembayaran'] },
  bni_va: { bank: 'BNI', vaNumber: '800' + 'XXXXXXXXXX', instructions: ['Buka mobile banking BNI', 'Pilih Transfer > Virtual Account', 'Masukkan nomor VA', 'Konfirmasi pembayaran'] },
  bri_va: { bank: 'BRI', vaNumber: '900' + 'XXXXXXXXXX', instructions: ['Buka mobile banking BRI', 'Pilih Pembayaran > BRIVA', 'Masukkan nomor VA', 'Konfirmasi pembayaran'] },
  mandiri_va: { bank: 'Mandiri', vaNumber: '600' + 'XXXXXXXXXX', instructions: ['Buka mobile banking Mandiri', 'Pilih Pembayaran > Virtual Account', 'Masukkan nomor VA', 'Konfirmasi pembayaran'] },
  qris: { qr: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=', instructions: ['Buka aplikasi e-wallet (GoPay/OVO/DANA/ShopeePay)', 'Pilih Scan QRIS', 'Scan kode QR di atas', 'Konfirmasi pembayaran'] },
  ovo: { ewallet: 'OVO', instructions: ['Buka aplikasi OVO', 'Pilih Transfer > Ke Rekening Bank', 'Masukkan nomor rekening tujuan', 'Konfirmasi pembayaran'] },
  gopay: { ewallet: 'GoPay', instructions: ['Buka aplikasi Gojek', 'Pilih GoPay > Bayar', 'Masukkan jumlah pembayaran', 'Konfirmasi pembayaran'] },
  dana: { ewallet: 'DANA', instructions: ['Buka aplikasi DANA', 'Pilih Kirim Uang', 'Masukkan nomor tujuan', 'Konfirmasi pembayaran'] },
  shopeepay: { ewallet: 'ShopeePay', instructions: ['Buka aplikasi Shopee', 'Pilih ShopeePay > Bayar', 'Konfirmasi pembayaran'] },
  credit_card: { instructions: ['Kartu kredit akan diproses', 'Klik bayar untuk melanjutkan ke halaman pembayaran'] },
};

export async function POST(req: Request) {
  try {
    // C3: CSRF origin check
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    // Handle payment confirmation
    if (data.action === 'confirm') {
      if (!data.orderId) {
        return NextResponse.json({ error: 'Order ID wajib diisi' }, { status: 400 });
      }
      const order = getMockOrder(data.orderId);
      if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      order.paymentStatus = 'PAID';
      order.status = 'PROCESSING';
      return NextResponse.json({ success: true, order });
    }

    // C5: Validate with Zod schema for new orders
    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const validatedData = parsed.data;

    // C6: Rate limiting — 5 checkout attempts per IP per minute
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`checkout:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // C4: Look up prices from server-side mock data (don't trust client prices)
    // Build a price map from mockProducts for quick lookup
    const serverPriceMap = new Map<string, number>();
    for (const product of mockProducts) {
      const price = product.salePrice ?? product.price;
      serverPriceMap.set(product.id, price);
      // Map variantId -> product's base price (or variant-specific price if available)
      for (const variant of product.variants || []) {
        serverPriceMap.set(`${product.id}-${variant.id}`, variant.price ?? price);
      }
    }

    // Calculate subtotal exclusively from server prices
    const subtotal = validatedData.items.reduce((sum, item) => {
      const priceKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
      const serverPrice = serverPriceMap.get(priceKey) ?? serverPriceMap.get(item.productId);
      if (!serverPrice) {
        throw new Error(`Product ${item.productId} not found`);
      }
      return sum + serverPrice * item.qty;
    }, 0);

    const total = subtotal + (validatedData.shippingCost || 0); // discount applied separately
    const newOrderId = generateOrderId();

    // Build VA numbers with the actual order ID
    const instructionsWithId: typeof paymentInstructions = {};
    for (const [method, tmpl] of Object.entries(paymentInstructions)) {
      instructionsWithId[method] = { ...tmpl };
      if (tmpl.vaNumber) {
        instructionsWithId[method].vaNumber = tmpl.vaNumber.replace('XXXXXXXXXX', newOrderId.slice(-10));
      }
      if (tmpl.qr) {
        instructionsWithId[method].qr = tmpl.qr + newOrderId;
      }
    }

    // Build order items with server-side data
    const orderItems = validatedData.items.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      const serverPrice = serverPriceMap.get(
        item.variantId ? `${item.productId}-${item.variantId}` : item.productId,
      ) ?? serverPriceMap.get(item.productId) ?? 0;

      return {
        productId: item.productId,
        variantId: item.variantId || undefined,
        name: product?.name || 'Produk',
        price: serverPrice,
        qty: item.qty,
        image: product?.images?.[0] || '/images/placeholder.svg',
      };
    });

    const order = {
      id: newOrderId,
      userId: null,
      guestName: validatedData.shippingAddress?.recipient,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.shippingAddress?.phone,
      subtotal,
      shippingCost: validatedData.shippingCost || 0,
      discount: 0,
      total,
      shippingAddress: validatedData.shippingAddress || {},
      courier: validatedData.courier,
      courierService: validatedData.courierService,
      paymentMethod: validatedData.paymentMethod,
      voucherCode: validatedData.voucherCode || null,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      paymentInstructions: instructionsWithId[validatedData.paymentMethod] || { instructions: ['Silakan lakukan pembayaran'] },
      items: orderItems,
      createdAt: new Date().toISOString(),
      trackingNumber: null,
    };

    setMockOrder(order);

    return NextResponse.json({
      orderId: order.id,
      order,
      message: 'Pesanan berhasil dibuat, silakan lakukan pembayaran',
    });
  } catch {
    console.error('Checkout error');
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
