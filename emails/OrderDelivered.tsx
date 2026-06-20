import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from '@react-email/components';

interface OrderDeliveredProps {
  customerName: string;
  orderId: string;
  orderUrl: string;
}

export default function OrderDelivered({
  customerName,
  orderId,
  orderUrl,
}: OrderDeliveredProps) {
  return (
    <Html>
      <Head />
      <Preview>Pesanan #{orderId} sudah sampai! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ── Dark Header ── */}
          <Section style={headerBg}>
            <Heading style={headerTitle}>SEPEDAMANIA</Heading>
          </Section>

          {/* ── Body ── */}
          <Section style={bodySection}>
            <Heading style={greeting}>
              Pesanan sudah sampai! 🎉
            </Heading>
            <Text style={paragraph}>
              Halo <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Pesanan kamu dengan ID <strong>#{orderId}</strong> sudah
              sampai di tujuan.
            </Text>
            <Text style={paragraphHighlight}>
              Semoga produknya sesuai ekspektasi dan bisa menemani
              petualangan bersepeda kamu! 🚴
            </Text>

            {/* Illustration / decorative */}
            <Section style={illustrationBox}>
              <Text style={illustrationEmoji}>🎉🚚✅</Text>
            </Section>

            {/* CTA Buttons */}
            <Section style={ctaSection}>
              <Button href={orderUrl} style={ctaButtonPrimary}>
                Beri Ulasan
              </Button>
            </Section>
            <Section style={ctaSectionSecondary}>
              <Button
                href="https://sepedamania.store"
                style={ctaButtonSecondary}
              >
                Beli Lagi
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={followUpText}>
              Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi
              kami via{' '}
              <a
                href="https://wa.me/6281234567890"
                style={followUpLink}
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

const paragraphHighlight: React.CSSProperties = {
  fontSize: 16,
  lineHeight: '26px',
  color: '#1C1C1E',
  fontWeight: 600,
  margin: '20px 0',
  textAlign: 'center',
  backgroundColor: '#FEF7E6',
  padding: '16px',
  borderRadius: 12,
};

const illustrationBox: React.CSSProperties = {
  textAlign: 'center',
  padding: '16px 0',
};

const illustrationEmoji: React.CSSProperties = {
  fontSize: 40,
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0 12px',
};

const ctaButtonPrimary: React.CSSProperties = {
  backgroundColor: '#F5A623',
  color: '#1A1A1A',
  fontSize: 16,
  fontWeight: 700,
  padding: '14px 32px',
  borderRadius: 12,
  textDecoration: 'none',
  display: 'inline-block',
};

const ctaSectionSecondary: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 24px',
};

const ctaButtonSecondary: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#1A1A1A',
  fontSize: 14,
  fontWeight: 600,
  padding: '12px 28px',
  borderRadius: 12,
  border: '2px solid #E5E5EA',
  textDecoration: 'none',
  display: 'inline-block',
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #E5E5EA',
  margin: '20px 0',
};

const followUpText: React.CSSProperties = {
  fontSize: 13,
  color: '#8E8E93',
  textAlign: 'center',
  margin: 0,
  lineHeight: '20px',
};

const followUpLink: React.CSSProperties = {
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
