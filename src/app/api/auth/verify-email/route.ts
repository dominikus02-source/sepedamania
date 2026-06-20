import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verification || verification.expires < new Date()) {
    return NextResponse.json({ error: 'Token tidak valid atau sudah kadaluarsa' }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: verification.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}

export async function PUT(_req: Request) {
  const session = await (await import('@/lib/auth')).auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: session.user.email ?? '',
      token,
      expires,
    },
  });

  const { sendVerificationEmail } = await import('@/lib/email');
  await sendVerificationEmail({ email: session.user.email ?? '', name: session.user.name ?? '', token });

  return NextResponse.json({ success: true, message: 'Email verifikasi telah dikirim' });
}
