import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminOrdersClient } from './admin-orders-client';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/masuk');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  const mappedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    userId: o.userId,
    guestName: o.guestName,
    guestEmail: o.guestEmail,
    guestPhone: o.guestPhone,
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    paymentProvider: o.paymentProvider,
    subtotal: Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    discount: Number(o.discount),
    total: Number(o.total),
    courier: o.courier,
    courierService: o.courierService,
    trackingNumber: o.trackingNumber,
    shippingAddress: o.shippingAddress as Record<string, string>,
    voucherCode: o.voucherCode,
    notes: o.notes,
    snapToken: o.snapToken,
    redirectUrl: o.redirectUrl,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    paidAt: o.paidAt?.toISOString() || null,
    cancelledAt: o.cancelledAt?.toISOString() || null,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      variantId: i.variantId,
      name: i.name,
      productSlug: i.productSlug,
      price: Number(i.price),
      qty: i.qty,
      subtotal: Number(i.subtotal),
      image: i.image,
      selectedVariantName: i.selectedVariantName,
    })),
  }));

  return <AdminOrdersClient orders={mappedOrders} />;
}
