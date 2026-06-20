import { NextResponse } from 'next/server';
import { getMockOrder, setMockOrder, generateOrderId } from '@/lib/mock-orders';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Handle payment confirmation
    if (data.action === 'confirm') {
      const order = getMockOrder(data.orderId);
      if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      order.paymentStatus = 'PAID';
      order.status = 'PROCESSING';
      return NextResponse.json({ success: true, order });
    }

    // Handle new order creation
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    const subtotal = data.items.reduce((sum: number, item: any) => sum + (item.salePrice || item.price) * item.qty, 0);
    const total = subtotal + (data.shippingCost || 0) - (data.voucherDiscount || 0);
    const newOrderId = generateOrderId();

    const paymentInstructions: Record<string, { bank?: string; vaNumber?: string; qr?: string; ewallet?: string; instructions: string[] }> = {
      bca_va: { bank: 'BCA', vaNumber: '700' + newOrderId.slice(-10), instructions: ['Buka mobile banking BCA', 'Pilih m-Transfer > BCA Virtual Account', 'Masukkan nomor VA: 700' + newOrderId.slice(-10), 'Konfirmasi pembayaran'] },
      bni_va: { bank: 'BNI', vaNumber: '800' + newOrderId.slice(-10), instructions: ['Buka mobile banking BNI', 'Pilih Transfer > Virtual Account', 'Masukkan nomor VA: 800' + newOrderId.slice(-10), 'Konfirmasi pembayaran'] },
      bri_va: { bank: 'BRI', vaNumber: '900' + newOrderId.slice(-10), instructions: ['Buka mobile banking BRI', 'Pilih Pembayaran > BRIVA', 'Masukkan nomor VA: 900' + newOrderId.slice(-10), 'Konfirmasi pembayaran'] },
      mandiri_va: { bank: 'Mandiri', vaNumber: '600' + newOrderId.slice(-10), instructions: ['Buka mobile banking Mandiri', 'Pilih Pembayaran > Virtual Account', 'Masukkan nomor VA: 600' + newOrderId.slice(-10), 'Konfirmasi pembayaran'] },
      qris: { qr: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + newOrderId, instructions: ['Buka aplikasi e-wallet (GoPay/OVO/DANA/ShopeePay)', 'Pilih Scan QRIS', 'Scan kode QR di atas', 'Konfirmasi pembayaran'] },
      ovo: { ewallet: 'OVO', instructions: ['Buka aplikasi OVO', 'Pilih Transfer > Ke Rekening Bank', 'Masukkan nomor rekening tujuan', 'Konfirmasi pembayaran'] },
      gopay: { ewallet: 'GoPay', instructions: ['Buka aplikasi Gojek', 'Pilih GoPay > Bayar', 'Masukkan jumlah pembayaran', 'Konfirmasi pembayaran'] },
      dana: { ewallet: 'DANA', instructions: ['Buka aplikasi DANA', 'Pilih Kirim Uang', 'Masukkan nomor tujuan', 'Konfirmasi pembayaran'] },
      shopeepay: { ewallet: 'ShopeePay', instructions: ['Buka aplikasi Shopee', 'Pilih ShopeePay > Bayar', 'Konfirmasi pembayaran'] },
      credit_card: { instructions: ['Kartu kredit akan diproses', 'Klik bayar untuk melanjutkan ke halaman pembayaran'] },
    };

    const order = {
      id: newOrderId,
      userId: null,
      guestName: data.address?.recipient,
      guestEmail: data.guestEmail,
      guestPhone: data.address?.phone,
      subtotal,
      shippingCost: data.shippingCost || 0,
      discount: data.voucherDiscount || 0,
      total,
      shippingAddress: data.address || {},
      courier: data.courier,
      courierService: data.courierService,
      paymentMethod: data.paymentMethod,
      voucherCode: data.voucherCode || null,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      paymentInstructions: paymentInstructions[data.paymentMethod] || { instructions: ['Silakan lakukan pembayaran'] },
      items: data.items.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: item.salePrice || item.price,
        qty: item.qty,
        image: item.image || '/images/placeholder.svg',
      })),
      createdAt: new Date().toISOString(),
      trackingNumber: null,
    };

    setMockOrder(order);

    return NextResponse.json({
      orderId: order.id,
      order,
      message: 'Pesanan berhasil dibuat, silakan lakukan pembayaran',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
