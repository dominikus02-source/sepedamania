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
  Hr,
  Preview,
} from '@react-email/components';

interface WelcomeEmailProps {
  customerName: string;
  loginUrl: string;
}

export default function WelcomeEmail({
  customerName,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Selamat datang di SEPEDAMANIA! 🚴</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ── Dark Header ── */}
          <Section style={headerBg}>
            <Heading style={headerTitle}>SEPEDAMANIA</Heading>
          </Section>

          {/* ── Body ── */}
          <Section style={bodySection}>
            <Heading style={greeting}>
              Selamat datang di SEPEDAMANIA! 🚴
            </Heading>
            <Text style={paragraph}>
              Halo <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Terima kasih sudah bergabung dengan{' '}
              <strong>SEPEDAMANIA</strong> — toko sepeda online
              terlengkap di Indonesia!
            </Text>
            <Text style={paragraph}>
              Di sini, kamu bisa menemukan berbagai macam sepeda dan
              aksesoris dari merek-merek ternama. Dari MTB, Road Bike,
              BMX, Fixie, hingga City Bike — semua ada!
            </Text>

            {/* WOW Section */}
            <Section style={wowSection}>
              <Text style={wowTitle}>✨ Yang bisa kamu lakukan:</Text>
              <Row style={wowRow}>
                <Column style={wowIcon}>🚲</Column>
                <Column style={wowDesc}>
                  Jelajahi koleksi sepeda terbaru dari berbagai brand
                </Column>
              </Row>
              <Row style={wowRow}>
                <Column style={wowIcon}>🏷️</Column>
                <Column style={wowDesc}>
                  Dapatkan diskon dan promo spesial untuk member
                </Column>
              </Row>
              <Row style={wowRow}>
                <Column style={wowIcon}>📦</Column>
                <Column style={wowDesc}>
                  Pengiriman cepat ke seluruh Indonesia
                </Column>
              </Row>
              <Row style={wowRow}>
                <Column style={wowIcon}>🔧</Column>
                <Column style={wowDesc}>
                  Layanan purna jual dan garansi resmi
                </Column>
              </Row>
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={loginUrl} style={ctaButton}>
                Mulai Belanja
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={smallText}>
              Jika kamu memiliki pertanyaan, jangan ragu untuk
              menghubungi kami via{' '}
              <a
                href="https://wa.me/6281234567890"
                style={smallLink}
              >
                WhatsApp
              </a>
              .
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerSection}>
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

const wowSection: React.CSSProperties = {
  backgroundColor: '#F2F2F7',
  borderRadius: 12,
  padding: '20px',
  margin: '24px 0',
};

const wowTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#1C1C1E',
  margin: '0 0 16px',
};

const wowRow: React.CSSProperties = {
  marginBottom: 12,
};

const wowIcon: React.CSSProperties = {
  width: 36,
  fontSize: 20,
  verticalAlign: 'top',
};

const wowDesc: React.CSSProperties = {
  fontSize: 14,
  color: '#1C1C1E',
  lineHeight: '20px',
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
  padding: '14px 40px',
  borderRadius: 12,
  textDecoration: 'none',
  display: 'inline-block',
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #E5E5EA',
  margin: '20px 0',
};

const smallText: React.CSSProperties = {
  fontSize: 13,
  color: '#8E8E93',
  textAlign: 'center',
  lineHeight: '20px',
};

const smallLink: React.CSSProperties = {
  color: '#F5A623',
  textDecoration: 'underline',
};

const footerSection: React.CSSProperties = {
  backgroundColor: '#F2F2F7',
  padding: '24px',
  textAlign: 'center',
};

const footerCopy: React.CSSProperties = {
  fontSize: 12,
  color: '#8E8E93',
  margin: 0,
};
