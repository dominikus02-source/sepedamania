import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateOrderNumber, createSnapTransaction } from '@/lib/midtrans';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    variantId: z.string().nullable().optional(),
    qty: z.number().int().positive().max(999),
  })).min(1, 'Minimal 1 item'),
  customerName: z.string().min(1, 'Nama wajib diisi'),
  customerEmail: z.string().email('Email tidak valid'),
  customerPhone: z.string().min(1, 'No HP wajib diisi'),
  address: z.object({
    recipient: z.string().min(1, 'Nama penerima wajib diisi'),
    phone: z.string().min(1, 'No HP penerima wajib diisi'),
    detail: z.string().min(1, 'Alamat lengkap wajib diisi'),
    district: z.string().min(1, 'Kecamatan wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    province: z.string().min(1, 'Provinsi wajib diisi'),
    postalCode: z.string().min(1, 'Kode pos wajib diisi'),
  }),
  courier: z.string().min(1, 'Kurir wajib dipilih'),
  courierService: z.string().min(1, 'Layanan kurir wajib dipilih'),
  shippingCost: z.number().min(0),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  voucherCode: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`checkout:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const session = await auth();
    const userId = session?.user?.id || null;

    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { variants: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produk tidak ditemukan atau tidak aktif: ${item.productId}` },
          { status: 400 },
        );
      }

      let availableStock = product.stock;
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Varian tidak ditemukan untuk produk ${product.name}` },
            { status: 400 },
          );
        }
        availableStock = variant.stock;
      }

      if (item.qty > availableStock) {
        return NextResponse.json(
          { error: `Stok ${product.name} tidak mencukupi. Tersedia: ${availableStock}` },
          { status: 400 },
        );
      }
    }

    let subtotal = 0;
    const orderItemsData: {
      productId: string;
      variantId: string | null;
      name: string;
      productSlug: string;
      price: number;
      qty: number;
      subtotal: number;
      image: string;
      selectedVariantName: string | null;
    }[] = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId)!;
      let price = Number(product.salePrice || product.price);
      let variantName: string | null = null;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          price = variant.price ? Number(variant.price) : price;
          variantName = `${variant.name}: ${variant.value}`;
        }
      }

      const lineSubtotal = price * item.qty;
      subtotal += lineSubtotal;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        productSlug: product.slug,
        price,
        qty: item.qty,
        subtotal: lineSubtotal,
        image: product.images[0] || '/images/placeholder.svg',
        selectedVariantName: variantName,
      });
    }

    let discountAmount = 0;
    if (data.voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: data.voucherCode },
      });

      if (voucher && voucher.isActive && subtotal >= Number(voucher.minPurchase)) {
        if (!voucher.expiresAt || voucher.expiresAt > new Date()) {
          if (voucher.quota === null || voucher.used < voucher.quota) {
            if (voucher.type === 'PERCENTAGE') {
              discountAmount = Math.round(subtotal * Number(voucher.value) / 100);
              if (voucher.maxDiscount) {
                discountAmount = Math.min(discountAmount, Number(voucher.maxDiscount));
              }
            } else {
              discountAmount = Number(voucher.value);
            }
            await prisma.voucher.update({
              where: { id: voucher.id },
              data: { used: { increment: 1 } },
            });
          }
        }
      }
    }

    const shippingCost = data.shippingCost;
    const total = subtotal + shippingCost - discountAmount;
    const grossAmount = Math.round(total);

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        guestEmail: data.customerEmail,
        guestName: data.customerName,
        guestPhone: data.customerPhone,
        subtotal,
        shippingCost,
        discount: discountAmount,
        total: grossAmount,
        shippingAddress: data.address as object,
        courier: data.courier,
        courierService: data.courierService,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'UNPAID',
        status: 'PENDING_PAYMENT',
        voucherCode: data.voucherCode || null,
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            productSlug: item.productSlug,
            price: item.price,
            qty: item.qty,
            subtotal: item.subtotal,
            image: item.image,
            selectedVariantName: item.selectedVariantName,
          })),
        },
      },
      include: { items: true },
    });

    let snapToken = '';
    let snapRedirectUrl = '';

    try {
      const snapResult = await createSnapTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        grossAmount,
        customerDetails: {
          firstName: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        items: orderItemsData.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        shippingCost,
        discount: discountAmount,
      });
      snapToken = snapResult.token;
      snapRedirectUrl = snapResult.redirect_url;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          midtransOrderId: orderNumber,
          snapToken,
          redirectUrl: snapRedirectUrl,
        },
      });
    } catch (snapError) {
      console.error('Midtrans Snap error:', snapError);
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      snapToken,
      snapRedirectUrl,
      total: grossAmount,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
