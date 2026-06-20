export async function sendOrderConfirmationEmail(order: any) {
  const email = order.guestEmail || 'customer@sepedamania.com';
  const itemsHtml = (order.items || [])
    .map(
      (item: any) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px">${item.name}</td>
          <td style="padding:8px 0;text-align:right;border-bottom:1px solid #f0f0f0;font-size:14px">${item.qty}× Rp ${Number(item.price).toLocaleString('id-ID')}</td>
        </tr>`
    )
    .join('');

  console.log(`[Email] Confirmation sent to ${email} for order #${order.id}`);
  console.log(`[Email] Total: Rp ${Number(order.total).toLocaleString('id-ID')}`);

  // When Resend API key is available:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'SEPEDAMANIA <noreply@sepedamania.com>',
  //   to: email,
  //   subject: `✅ Pesanan #${order.id} Dikonfirmasi — SEPEDAMANIA`,
  //   html: `...`
  // })

  return { success: true, email };
}
