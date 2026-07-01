import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyTotp } from '@/lib/totp';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.totpSecret) {
    return NextResponse.json({ error: '2FA not configured' }, { status: 400 });
  }

  if (!verifyTotp(token, user.totpSecret)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
