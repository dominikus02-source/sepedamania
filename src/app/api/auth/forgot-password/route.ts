import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`forgot-password:${ip}`, 3, 3600000)) {
      return NextResponse.json({ error: 'Terlalu banyak request. Coba lagi nanti.' }, { status: 429 });
    }

    const parsed = forgotPasswordSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    try {
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

      if (!user) {
        return NextResponse.json({ success: true, message: 'Jika email terdaftar, link reset akan dikirim' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000);

      await prisma.verificationToken.create({
        data: {
          identifier: email.toLowerCase(),
          token,
          expires,
        },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'https://sepedamania.com'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      console.log('[Forgot Password] Reset URL:', resetUrl);

    } catch {
      console.warn('Database unavailable for forgot password - silently succeeding for security');
    }

    return NextResponse.json({ success: true, message: 'Jika email terdaftar, link reset akan dikirim' });
  } catch {
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}
