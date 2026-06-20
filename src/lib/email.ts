import { Resend } from 'resend';
import { render } from '@react-email/render';

import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import OrderShippedEmail from '@/emails/OrderShipped';
import OrderDeliveredEmail from '@/emails/OrderDelivered';
import WelcomeEmailTemplate from '@/emails/WelcomeEmail';

interface OrderEmail {
  id: string;
  guestEmail?: string;
  guestName?: string;
  user?: { name?: string; email?: string };
  items?: { name: string; quantity?: number; qty?: number; price: number; image?: string }[];
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
  shippingAddress?: {
    detail?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  courier?: string;
  courierService?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  orderUrl?: string;
}

const resend =
  typeof process !== 'undefined' && process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM = 'SEPEDAMANIA <noreply@sepedamania.com>';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

// ─── Order Confirmation ─────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(order: OrderEmail) {
  const email = order.guestEmail || order.user?.email;

  if (!email) {
    console.warn('[Email] No recipient email for order confirmation', order.id);
    return { success: false };
  }

  const emailItems: OrderItem[] = (order.items || []).map((item) => ({
    name: item.name,
    qty: item.qty ?? item.quantity ?? 1,
    price: Number(item.price),
    image: item.image || '',
  }));

  const shippingAddressStr = order.shippingAddress
    ? `${order.shippingAddress.detail || ''}, ${order.shippingAddress.district || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.province || ''} ${order.shippingAddress.postalCode || ''}`
    : '';

  const orderUrl =
    order.orderUrl ||
    `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/pesanan/${order.id}`;

  if (!resend) {
    console.log(`[Email] Order Confirmation sent to ${email} for order #${order.id}`);
    console.log(`[Email] Total: Rp ${Number(order.total).toLocaleString('id-ID')}`);
    return { success: true, email, mock: true };
  }

  const html = await render(
    OrderConfirmationEmail({
      customerName: order.user?.name || order.guestName || 'Pelanggan',
      orderId: order.id,
      items: emailItems,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount ?? 0),
      total: Number(order.total),
      shippingAddress: shippingAddressStr,
      courier: order.courier || '',
      courierService: order.courierService || '',
      paymentMethod: order.paymentMethod || '',
      orderUrl,
    })
  );

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `✅ Pembayaran Diterima — Pesanan #${order.id} — SEPEDAMANIA`,
      html,
    });
    return { success: true, email };
  } catch (error) {
    console.error('[Email] Failed to send order confirmation:', error);
    return { success: false, error };
  }
}

// ─── Order Shipped ──────────────────────────────────────────────────────

export async function sendOrderShippedEmail(order: OrderEmail) {
  const email = order.guestEmail || order.user?.email;

  if (!email) {
    console.warn('[Email] No recipient email for shipped notification', order.id);
    return { success: false };
  }

  const orderUrl =
    order.orderUrl ||
    `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/pesanan/${order.id}`;

  if (!resend) {
    console.log(`[Email] Order Shipped sent to ${email} for order #${order.id}`);
    console.log(`[Email] Tracking: ${order.trackingNumber} (${order.courier})`);
    return { success: true, email, mock: true };
  }

  const html = await render(
    OrderShippedEmail({
      customerName: order.user?.name || order.guestName || 'Pelanggan',
      orderId: order.id,
      trackingNumber: order.trackingNumber || '',
      courier: order.courier || '',
      courierService: order.courierService || '',
      orderUrl,
    })
  );

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `🚚 Pesanan #${order.id} Telah Dikirim — SEPEDAMANIA`,
      html,
    });
    return { success: true, email };
  } catch (error) {
    console.error('[Email] Failed to send shipped notification:', error);
    return { success: false, error };
  }
}

// ─── Order Delivered ────────────────────────────────────────────────────

export async function sendOrderDeliveredEmail(order: OrderEmail) {
  const email = order.guestEmail || order.user?.email;

  if (!email) {
    console.warn('[Email] No recipient email for delivered notification', order.id);
    return { success: false };
  }

  const orderUrl =
    order.orderUrl ||
    `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/pesanan/${order.id}`;

  if (!resend) {
    console.log(`[Email] Order Delivered sent to ${email} for order #${order.id}`);
    return { success: true, email, mock: true };
  }

  const html = await render(
    OrderDeliveredEmail({
      customerName: order.user?.name || order.guestName || 'Pelanggan',
      orderId: order.id,
      orderUrl,
    })
  );

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `🎉 Pesanan #${order.id} Sudah Sampai — SEPEDAMANIA`,
      html,
    });
    return { success: true, email };
  } catch (error) {
    console.error('[Email] Failed to send delivered notification:', error);
    return { success: false, error };
  }
}

// ─── Welcome Email ──────────────────────────────────────────────────────

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  const { name, email } = user;

  if (!email) {
    console.warn('[Email] No recipient email for welcome email');
    return { success: false };
  }

  const loginUrl =
    `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/login`;

  if (!resend) {
    console.log(`[Email] Welcome sent to ${email} for user ${name}`);
    return { success: true, email, mock: true };
  }

  const html = await render(
    WelcomeEmailTemplate({
      customerName: name,
      loginUrl,
    })
  );

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `🚴 Selamat Datang di SEPEDAMANIA!`,
      html,
    });
    return { success: true, email };
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error);
    return { success: false, error };
  }
}
