const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1';

export function getMidtransClientKey() {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const seq = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${y}${m}${d}-${seq}`;
}

interface SnapTransactionParams {
  orderId: string;
  orderNumber: string;
  grossAmount: number;
  customerDetails: {
    firstName: string;
    email?: string;
    phone?: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  shippingCost?: number;
  discount?: number;
}

interface SnapTransactionResponse {
  token: string;
  redirect_url: string;
}

export async function createSnapTransaction(params: SnapTransactionParams): Promise<SnapTransactionResponse> {
  const auth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');

  const itemDetails = [...params.items];

  if (params.shippingCost && params.shippingCost > 0) {
    itemDetails.push({
      id: 'SHIPPING',
      name: 'Ongkos Kirim',
      price: params.shippingCost,
      quantity: 1,
    });
  }

  if (params.discount && params.discount > 0) {
    itemDetails.push({
      id: 'DISCOUNT',
      name: 'Diskon',
      price: -Math.abs(params.discount),
      quantity: 1,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const body = {
    transaction_details: {
      order_id: params.orderNumber,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      email: params.customerDetails.email,
      phone: params.customerDetails.phone,
    },
    item_details: itemDetails,
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: `${siteUrl}/pesanan/${params.orderNumber}?status=success`,
      error: `${siteUrl}/pesanan/${params.orderNumber}?status=failed`,
      pending: `${siteUrl}/pesanan/${params.orderNumber}?status=pending`,
    },
  };

  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Midtrans error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export interface MidtransNotification {
  transaction_status: string;
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_id: string;
  payment_type: string;
  fraud_status: string;
  settlement_time?: string;
  expiry_time?: string;
  transaction_time?: string;
}

export function verifySignatureKey(notification: MidtransNotification): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;
  const input = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
  const hash = require('crypto').createHash('sha512').update(input).digest('hex');
  return hash === signature_key;
}

export function mapMidtransStatus(transactionStatus: string, fraudStatus: string): {
  paymentStatus: 'PAID' | 'UNPAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  orderStatus: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'CANCELLED' | 'REFUNDED';
} {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'accept') {
        return { paymentStatus: 'PAID', orderStatus: 'PROCESSING' };
      }
      if (fraudStatus === 'challenge') {
        return { paymentStatus: 'UNPAID', orderStatus: 'PENDING_PAYMENT' };
      }
      return { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' };

    case 'settlement':
      return { paymentStatus: 'PAID', orderStatus: 'PROCESSING' };

    case 'pending':
      return { paymentStatus: 'UNPAID', orderStatus: 'PENDING_PAYMENT' };

    case 'deny':
    case 'cancel':
      return { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' };

    case 'expire':
      return { paymentStatus: 'EXPIRED', orderStatus: 'CANCELLED' };

    case 'refund':
      return { paymentStatus: 'REFUNDED', orderStatus: 'REFUNDED' };

    case 'partial_refund':
      return { paymentStatus: 'REFUNDED', orderStatus: 'REFUNDED' };

    default:
      return { paymentStatus: 'UNPAID', orderStatus: 'PENDING_PAYMENT' };
  }
}
