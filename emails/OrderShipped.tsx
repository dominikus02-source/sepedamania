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

interface OrderShippedProps {
  customerName: string;
  orderId: string;
  trackingNumber: string;
  courier: string;
  courierService: string;
  orderUrl: string;
}

const COURIER_TRACKING_URLS: Record<string, string> = {
  JNE: 'https://www.jne.co.id/id/tracking/trace',
  'J&T': 'https://jet.co.id/track',
  SiCepat: 'https://www.sicepat.com/checkAwb',
  Anteraja: 'https://anteraja.id/tracking',
  'Pos Indonesia': 'https://www.posindonesia.co.id/tracking',
};

export default function OrderShipped({
  customerName,
  orderId,
  trackingNumber,
  courier,
  courierService,
  orderUrl,
}: OrderShippedProps) {
  const trackingUrl = COURIER_TRACKING_URLS[courier] || '#';

  return (
    <Html>
      <Head />
      <Preview>Pesanan #{orderId} sudah dalam perjalanan! 🚚</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ── Dark Header ── */}
          <Section style={headerBg}>
            <Heading style={headerTitle}>SEPEDAMANIA</Heading>
          </Section>

          {/* ── Body ── */}
          <Section style={bodySection}>
            <Heading style={greeting}>
              Pesanan kamu sudah dikirim! 🚚
            </Heading>
            <Text style={paragraph}>
              Halo <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Kabar baik! Pesanan kamu sudah dikirim dan sedang dalam
              perjalanan menuju alamat tujuan.
            </Text>

            {/* Order ID */}
            <Section style={orderIdBox}>
              <Text style={orderIdLabel}>Order ID</Text>
              <Text style={orderIdValue}>#{orderId}</Text>
            </Section>

            {/* Tracking Number — prominently displayed */}
            <Section style={trackingBox}>
              <Text style={trackingLabel}>Nomor Resi</Text>
              <Text style={trackingNumberValue}>{trackingNumber}</Text>
              <Text style={trackingCourier}>
                {courier} — {courierService}
              </Text>
            </Section>

            {/* Courier Tracking Links */}
            <Section style={courierLinksSection}>
              <Text style={courierLinksTitle}>
                Link Lacak per Kurir:
              </Text>
              {Object.entries(COURIER_TRACKING_URLS).map(([name, url]) => (
                <Row key={name} style={courierLinkRow}>
                  <Column style={courierLinkName}>{name}</Column>
                  <Column style={courierLinkUrlCol}>
                    <a href={url} style={courierLinkUrl}>
                      {url}
                    </a>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={trackingUrl} style={ctaButton}>
                Lacak Paket
              </Button>
              <Text style={ctaHelper}>
                atau{' '}
                <a href={orderUrl} style={orderLink}>
                  cek status pesanan
                </a>
              </Text>
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

const trackingBox: React.CSSProperties = {
  backgroundColor: '#FEF7E6',
  borderRadius: 12,
  border: '2px solid #F5A623',
  padding: '20px',
  textAlign: 'center',
  margin: '20px 0',
};

const trackingLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#8E8E93',
  textTransform: 'uppercase',
  letterSpacing: 1,
  margin: '0 0 8px',
};

const trackingNumberValue: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: '#1A1A1A',
  letterSpacing: 2,
  margin: '0 0 6px',
};

const trackingCourier: React.CSSProperties = {
  fontSize: 14,
  color: '#8E8E93',
  margin: 0,
};

const courierLinksSection: React.CSSProperties = {
  margin: '20px 0',
  padding: 16,
  backgroundColor: '#F2F2F7',
  borderRadius: 12,
};

const courierLinksTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1C1C1E',
  margin: '0 0 12px',
};

const courierLinkRow: React.CSSProperties = {
  marginBottom: 8,
};

const courierLinkName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1C1C1E',
  width: 100,
};

const courierLinkUrlCol: React.CSSProperties = {
  fontSize: 12,
  color: '#F5A623',
};

const courierLinkUrl: React.CSSProperties = {
  color: '#F5A623',
  textDecoration: 'none',
  wordBreak: 'break-all',
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

const ctaHelper: React.CSSProperties = {
  fontSize: 13,
  color: '#8E8E93',
  margin: '10px 0 0',
};

const orderLink: React.CSSProperties = {
  color: '#F5A623',
  textDecoration: 'underline',
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
