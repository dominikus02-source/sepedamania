import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderList } from './order-list';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/masuk?callbackUrl=/pesanan');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect('/masuk?callbackUrl=/pesanan');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  const mappedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    paymentStatus: o.paymentStatus,
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    discount: Number(o.discount),
    courier: o.courier,
    courierService: o.courierService,
    paymentMethod: o.paymentMethod,
    paymentProvider: o.paymentProvider,
    snapToken: o.snapToken,
    redirectUrl: o.redirectUrl,
    voucherCode: o.voucherCode,
    shippingAddress: o.shippingAddress as Record<string, string>,
    trackingNumber: o.trackingNumber,
    notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    paidAt: o.paidAt?.toISOString() || null,
    cancelledAt: o.cancelledAt?.toISOString() || null,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
      qty: i.qty,
      image: i.image,
      productSlug: i.productSlug || '',
    })),
  }));

  return <OrderList orders={mappedOrders} />;
}
