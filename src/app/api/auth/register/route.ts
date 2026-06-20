import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

// C5: Zod validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // C3: CSRF origin check
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // C6: Rate limiting — 3 registrations per IP per minute
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`register:${ip}`, 3, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // C5: Validate request body with Zod
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashedPassword, phone } });

    // Send welcome email asynchronously (don't block registration)
    try {
      await sendWelcomeEmail({ name, email });
    } catch (e) {
      console.warn('Welcome email failed', e);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
