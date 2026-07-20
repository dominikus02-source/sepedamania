// Server-only: imports the Prisma client.
import { prisma } from '@/lib/prisma';
import {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from '@/lib/email';

/** Everything the email templates need, loaded in one query. */
const ORDER_EMAIL_SELECT = {
  id: true,
  orderNumber: true,
  subtotal: true,
  shippingCost: true,
  discount: true,
  total: true,
  shippingAddress: true,
  courier: true,
  courierService: true,
  paymentMethod: true,
  trackingNumber: true,
  guestEmail: true,
  guestName: true,
  user: { select: { name: true, email: true } },
  items: { select: { name: true, qty: true, price: true, image: true } },
} as const;

type ShippingAddress = {
  detail?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
};

async function loadOrderForEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: ORDER_EMAIL_SELECT,
  });
  if (!order) return null;

  return {
    // Customers recognise the invoice number, not the internal cuid.
    id: order.orderNumber,
    orderUrl: `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/pesanan/${order.id}`,
    guestEmail: order.guestEmail ?? undefined,
    guestName: order.guestName ?? undefined,
    user: order.user
      ? { name: order.user.name ?? undefined, email: order.user.email ?? undefined }
      : undefined,
    items: order.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: Number(i.price),
      image: i.image,
    })),
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discount: Number(order.discount),
    total: Number(order.total),
    shippingAddress: (order.shippingAddress as ShippingAddress) ?? undefined,
    courier: order.courier,
    courierService: order.courierService,
    paymentMethod: order.paymentMethod,
    trackingNumber: order.trackingNumber ?? undefined,
  };
}

type Notification = 'confirmation' | 'shipped' | 'delivered';

const SENDERS = {
  confirmation: sendOrderConfirmationEmail,
  shipped: sendOrderShippedEmail,
  delivered: sendOrderDeliveredEmail,
} as const;

/**
 * Sends a transactional email for an order.
 *
 * Never throws: a mail outage must not fail a payment webhook or block an
 * admin from updating a status. Failures are logged for follow-up instead.
 */
export async function notifyOrder(orderId: string, kind: Notification): Promise<void> {
  try {
    const order = await loadOrderForEmail(orderId);
    if (!order) {
      console.warn(`[Notify] Order ${orderId} not found for ${kind} email`);
      return;
    }
    await SENDERS[kind](order);
  } catch (err) {
    console.error(`[Notify] Failed to send ${kind} email for order ${orderId}:`, err);
  }
}
