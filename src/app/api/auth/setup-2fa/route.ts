import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateTotpSecret, getTotpUri, generateQrCode } from '@/lib/totp';

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = generateTotpSecret();
  const uri = getTotpUri(secret, session.user.email ?? '');

  // Save secret temporarily (will be confirmed on verify)
  const qrCode = await generateQrCode(uri);

  return NextResponse.json({ secret, uri, qrCode });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { secret, token } = await req.json();
  if (!secret || !token) {
    return NextResponse.json({ error: 'Secret and token required' }, { status: 400 });
  }

  const { verifyTotp } = await import('@/lib/totp');
  if (!verifyTotp(token, secret)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: secret, totpEnabled: true },
  });

  return NextResponse.json({ success: true });
}
