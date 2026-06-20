import Xendit from 'xendit-node';

const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! });

interface CreateInvoiceParams {
  orderId: string;
  amount: number;
  payerEmail?: string;
  payerName?: string;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    category?: string;
  }>;
}

export async function createXenditInvoice(params: CreateInvoiceParams) {
  const { Invoice } = xendit;

  const invoice = await Invoice.createInvoice({
    data: {
      externalId: params.orderId,
      amount: params.amount,
      payerEmail: params.payerEmail,
      description: params.description,
      successRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/pesanan/${params.orderId}?status=success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/pesanan/${params.orderId}?status=failed`,
      currency: 'IDR',
      invoiceDuration: 86400,
      customer: params.payerName ? { givenNames: params.payerName } : undefined,
      items: params.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category || 'Bicycle',
      })),
    },
  });

  return invoice;
}

export function verifyWebhookToken(token: string | null): boolean {
  if (!token) return false;
  return token === process.env.XENDIT_WEBHOOK_TOKEN;
}
