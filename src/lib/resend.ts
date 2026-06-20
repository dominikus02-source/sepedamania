import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmation(params: {
  email: string;
  name: string;
  orderId: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number }>;
}) {
  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5ea;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5ea; text-align: center;">${item.qty}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5ea; text-align: right;">Rp ${item.price.toLocaleString('id-ID')}</td>
        </tr>`
    )
    .join('');

  await resend.emails.send({
    from: 'SEPEDAMANIA <noreply@sepedamania.com>',
    to: params.email,
    subject: `Konfirmasi Pesanan #${params.orderId}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A1A1A; padding: 24px; text-align: center;">
          <h1 style="color: #F5A623; margin: 0; font-size: 24px;">SEPEDAMANIA</h1>
        </div>
        <div style="padding: 24px;">
          <h2>Hai ${params.name},</h2>
          <p>Pesanan kamu telah berhasil dibuat!</p>
          <div style="background: #f8f8f8; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0 0 8px;"><strong>Order ID:</strong> #${params.orderId}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 8px; border-bottom: 2px solid #e5e5ea; text-align: left;">Produk</th>
                  <th style="padding: 8px; border-bottom: 2px solid #e5e5ea; text-align: center;">Qty</th>
                  <th style="padding: 8px; border-bottom: 2px solid #e5e5ea; text-align: right;">Harga</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: #F5A623;">
                    Rp ${params.total.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p>Silakan selesaikan pembayaran untuk memproses pesanan kamu.</p>
          <a href="${process.env.NEXT_PUBLIC_URL}/pesanan/${params.orderId}"
             style="display: inline-block; background: #F5A623; color: #1A1A1A; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Lihat Pesanan
          </a>
        </div>
      </div>
    `,
  });
}
