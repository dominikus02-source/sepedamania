import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Img,
  Hr,
  Preview,
} from '@react-email/components';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: string;
  courier: string;
  courierService: string;
  paymentMethod: string;
  orderUrl: string;
}

const formatRp = (amount: number): string =>
  `Rp ${amount.toLocaleString('id-ID')}`;

export default function OrderConfirmation({
  customerName,
  orderId,
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  shippingAddress,
  courier,
  courierService,
  paymentMethod,
  orderUrl,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Pembayaran untuk pesanan #{orderId} telah diterima!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ── Dark Header ── */}
          <Section style={headerBg}>
            <Heading style={headerTitle}>SEPEDAMANIA</Heading>
          </Section>

          {/* ── Body ── */}
          <Section style={bodySection}>
            <Heading style={greeting}>
              Pembayaran Diterima! 🎉
            </Heading>
            <Text style={paragraph}>
              Halo <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Pembayaran untuk pesanan kamu sudah kami terima. Pesanan
              sekarang akan segera diproses!
            </Text>

            {/* Order ID */}
            <Section style={orderIdBox}>
              <Text style={orderIdLabel}>Order ID</Text>
              <Text style={orderIdValue}>#{orderId}</Text>
            </Section>

            {/* Items Table */}
            <Section style={tableSection}>
              <Heading style={sectionTitle}>Daftar Produk</Heading>
              {items.map((item, idx) => (
                <Row key={idx} style={itemRow}>
                  <Column style={itemImageCol}>
                    {item.image ? (
                      <Img
                        src={item.image}
                        alt={item.name}
                        width="48"
                        height="48"
                        style={itemImage}
                      />
                    ) : (
                      <Section style={itemPlaceholder} />
                    )}
                  </Column>
                  <Column style={itemInfoCol}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQty}>Qty: {item.qty}</Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>
                      {formatRp(item.price * item.qty)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Summary */}
            <Section style={summarySection}>
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Subtotal</Column>
                <Column style={summaryValue}>{formatRp(subtotal)}</Column>
              </Row>
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Ongkos Kirim</Column>
                <Column style={summaryValue}>{formatRp(shippingCost)}</Column>
              </Row>
              {discount > 0 && (
                <Row style={summaryRow}>
                  <Column style={summaryLabelDiscount}>Diskon</Column>
                  <Column style={summaryValueDiscount}>
                    -{formatRp(discount)}
                  </Column>
                </Row>
              )}
              <Row style={summaryRowTotal}>
                <Column style={summaryLabelTotal}>Total</Column>
                <Column style={summaryValueTotal}>{formatRp(total)}</Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Shipping Info */}
            <Heading style={sectionTitle}>Informasi Pengiriman</Heading>
            <Text style={infoLine}>
              <strong>Kurir:</strong> {courier} — {courierService}
            </Text>
            <Text style={infoLine}>
              <strong>Alamat:</strong> {shippingAddress}
            </Text>

            <Hr style={divider} />

            {/* Payment Method */}
            <Text style={infoLine}>
              <strong>Metode Pembayaran:</strong> {paymentMethod}
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={orderUrl} style={ctaButton}>
                Cek Status Pesanan
              </Button>
            </Section>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Butuh bantuan? Hubungi kami via{' '}
              <a
                href="https://wa.me/6281234567890"
                style={footerLink}
              >
                WhatsApp
              </a>
            </Text>
            <Text style={footerCopy}>
              &copy; {new Date().getFullYear()} SEPEDAMANIA. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: '#F2F2F7',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: '24px 0',
};

const container: React.CSSProperties = {
  maxWidth: 600,
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  overflow: 'hidden',
};

const headerBg: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '32px 24px',
  textAlign: 'center',
};

const headerTitle: React.CSSProperties = {
  color: '#F5A623',
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: 1,
  margin: 0,
};

const bodySection: React.CSSProperties = {
  padding: '32px 24px',
};

const greeting: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#1C1C1E',
  margin: '0 0 16px',
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: '24px',
  color: '#1C1C1E',
  margin: '0 0 12px',
};

const orderIdBox: React.CSSProperties = {
  backgroundColor: '#F2F2F7',
  borderRadius: 12,
  padding: '16px',
  textAlign: 'center',
  margin: '20px 0',
};

const orderIdLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#8E8E93',
  textTransform: 'uppercase',
  letterSpacing: 1,
  margin: '0 0 4px',
};

const orderIdValue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#F5A623',
  margin: 0,
};

const tableSection: React.CSSProperties = {
  margin: '24px 0',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1C1C1E',
  margin: '0 0 16px',
};

const itemRow: React.CSSProperties = {
  borderBottom: '1px solid #E5E5EA',
  padding: '8px 0',
};

const itemImageCol: React.CSSProperties = {
  width: 56,
  verticalAlign: 'middle',
};

const itemImage: React.CSSProperties = {
  borderRadius: 8,
  objectFit: 'cover',
};

const itemPlaceholder: React.CSSProperties = {
  width: 48,
  height: 48,
  backgroundColor: '#F2F2F7',
  borderRadius: 8,
};

const itemInfoCol: React.CSSProperties = {
  paddingLeft: 8,
  verticalAlign: 'middle',
};

const itemName: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1C1C1E',
  margin: 0,
};

const itemQty: React.CSSProperties = {
  fontSize: 13,
  color: '#8E8E93',
  margin: '2px 0 0',
};

const itemPriceCol: React.CSSProperties = {
  width: 100,
  textAlign: 'right',
  verticalAlign: 'middle',
};

const itemPrice: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1C1C1E',
  margin: 0,
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #E5E5EA',
  margin: '20px 0',
};

const summarySection: React.CSSProperties = {
  margin: '16px 0',
};

const summaryRow: React.CSSProperties = {
  marginBottom: 6,
};

const summaryLabel: React.CSSProperties = {
  fontSize: 14,
  color: '#8E8E93',
};

const summaryValue: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1C1C1E',
  textAlign: 'right',
};

const summaryLabelDiscount: React.CSSProperties = {
  fontSize: 14,
  color: '#34C759',
};

const summaryValueDiscount: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#34C759',
  textAlign: 'right',
};

const summaryRowTotal: React.CSSProperties = {
  marginTop: 10,
};

const summaryLabelTotal: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#1C1C1E',
};

const summaryValueTotal: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: '#F5A623',
  textAlign: 'right',
};

const infoLine: React.CSSProperties = {
  fontSize: 14,
  color: '#1C1C1E',
  margin: '0 0 6px',
  lineHeight: '22px',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0 16px',
};

const ctaButton: React.CSSProperties = {
  backgroundColor: '#F5A623',
  color: '#1A1A1A',
  fontSize: 16,
  fontWeight: 700,
  padding: '14px 32px',
  borderRadius: 12,
  textDecoration: 'none',
  display: 'inline-block',
};

const footerSection: React.CSSProperties = {
  backgroundColor: '#F2F2F7',
  padding: '24px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  fontSize: 13,
  color: '#8E8E93',
  margin: '0 0 4px',
};

const footerLink: React.CSSProperties = {
  color: '#F5A623',
  textDecoration: 'underline',
};

const footerCopy: React.CSSProperties = {
  fontSize: 12,
  color: '#8E8E93',
  margin: 0,
};
