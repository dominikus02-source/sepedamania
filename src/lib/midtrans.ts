const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BASE_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1';

export function getMidtransClientKey() {
  return MIDTRANS_CLIENT_KEY;
}

interface SnapTransactionParams {
  orderId: string;
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
}

interface SnapTransactionResponse {
  token: string;
  redirect_url: string;
}

export async function createSnapTransaction(params: SnapTransactionParams): Promise<SnapTransactionResponse> {
  const auth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');

  const body = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      email: params.customerDetails.email,
      phone: params.customerDetails.phone,
    },
    item_details: params.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_URL || ''}/pesanan/${params.orderId}?status=success`,
      error: `${process.env.NEXT_PUBLIC_URL || ''}/pesanan/${params.orderId}?status=failed`,
      pending: `${process.env.NEXT_PUBLIC_URL || ''}/pesanan/${params.orderId}?status=pending`,
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

interface MidtransNotification {
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
}

export function verifySignatureKey(notification: MidtransNotification): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;
  const input = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
  const hash = require('crypto').createHash('sha512').update(input).digest('hex');
  return hash === signature_key;
}

export function mapMidtransStatus(transactionStatus: string, fraudStatus: string): {
  paymentStatus: string;
  orderStatus: string;
} {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'accept') {
        return { paymentStatus: 'PAID', orderStatus: 'PROCESSING' };
      }
      if (fraudStatus === 'challenge') {
        return { paymentStatus: 'CHALLENGE', orderStatus: 'PENDING_PAYMENT' };
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
    case 'partial_refund':
      return { paymentStatus: 'REFUND', orderStatus: 'CANCELLED' };

    default:
      return { paymentStatus: 'UNPAID', orderStatus: 'PENDING_PAYMENT' };
  }
}
