import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { getMockOrder, setMockOrder, generateOrderId } from '@/lib/mock-orders';
import { getServerCategories } from '@/lib/catalog-data';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { createSnapTransaction } from '@/lib/midtrans';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    qty: z.number().int().positive(),
  })).min(1, 'Minimal 1 item'),
  address: z.object({
    recipient: z.string().min(1, 'Nama penerima wajib diisi'),
    phone: z.string().min(1, 'No HP wajib diisi'),
    detail: z.string().min(1, 'Alamat lengkap wajib diisi'),
    district: z.string().min(1, 'Kecamatan wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    province: z.string().min(1, 'Provinsi wajib diisi'),
    postalCode: z.string().min(1, 'Kode pos wajib diisi'),
  }),
  courier: z.string().min(1, 'Kurir wajib dipilih'),
  courierService: z.string().min(1, 'Layanan kurir wajib dipilih'),
  shippingCost: z.number(),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  voucherCode: z.string().nullable().optional(),
  voucherDiscount: z.number().optional(),
  // Fallback prices from client (trusted as source of truth when no server-side product data)
  itemPrices: z.record(z.string(), z.number()).optional(),
});

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`checkout:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const validatedData = parsed.data;

    const clientPriceMap = new Map(Object.entries(validatedData.itemPrices || {}));

    const subtotal = validatedData.items.reduce((sum, item) => {
      const priceKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
      const price = clientPriceMap.get(priceKey) ?? clientPriceMap.get(item.productId) ?? 0;
      return sum + price * item.qty;
    }, 0);

    const discount = validatedData.voucherDiscount || 0;
    const total = subtotal + validatedData.shippingCost - discount;
    const newOrderId = generateOrderId();

    const orderItems = validatedData.items.map((item) => {
      const priceKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
      const price = clientPriceMap.get(priceKey) ?? clientPriceMap.get(item.productId) ?? 0;

      return {
        productId: item.productId,
        variantId: item.variantId || undefined,
        name: 'Produk',
        price,
        qty: item.qty,
        image: '/images/placeholder.svg',
      };
    });

    const order = {
      id: newOrderId,
      userId: null,
      guestName: validatedData.address.recipient,
      guestEmail: undefined as string | undefined,
      guestPhone: validatedData.address.phone,
      subtotal,
      shippingCost: validatedData.shippingCost,
      discount,
      total,
      shippingAddress: validatedData.address as unknown as Record<string, string>,
      courier: validatedData.courier,
      courierService: validatedData.courierService,
      paymentMethod: validatedData.paymentMethod,
      voucherCode: validatedData.voucherCode || null,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      paymentInstructions: {},
      items: orderItems,
      createdAt: new Date().toISOString(),
      trackingNumber: null,
    };

    setMockOrder(order);

    let snapToken = '';
    let snapRedirectUrl = '';

    try {
      const snapResult = await createSnapTransaction({
        orderId: order.id,
        grossAmount: total,
        customerDetails: {
          firstName: validatedData.address.recipient,
          phone: validatedData.address.phone,
        },
        items: orderItems.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
      });
      snapToken = snapResult.token;
      snapRedirectUrl = snapResult.redirect_url;
    } catch (snapError) {
      console.error('Midtrans Snap error:', snapError);
    }

    return NextResponse.json({
      orderId: order.id,
      order,
      snapToken,
      snapRedirectUrl,
      message: 'Pesanan berhasil dibuat',
    });
  } catch {
    console.error('Checkout error');
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    if (!data.orderId) {
      return NextResponse.json({ error: 'Order ID wajib diisi' }, { status: 400 });
    }

    const order = getMockOrder(data.orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: 'Gagal update pesanan' }, { status: 500 });
  }
}
