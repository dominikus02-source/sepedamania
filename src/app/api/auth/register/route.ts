import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  phone: z.string().optional(),
});

// In-memory mock store for demo when no database
const mockUsers: { email: string; name: string; password: string; phone?: string }[] = [];

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`register:${ip}`, 3, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Try Prisma first, fall back to mock if database unavailable
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.create({ data: { name, email, password: hashedPassword, phone } });
    } catch {
      // Database not available — use mock store for demo
      const existing = mockUsers.find((u) => u.email === email);
      if (existing) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      mockUsers.push({ name, email, password: hashedPassword, phone });
    }

    try {
      await sendWelcomeEmail({ name, email });
    } catch {
      console.warn('Welcome email failed (expected in demo)');
    }

    return NextResponse.json({ success: true, message: 'Pendaftaran berhasil! Silakan login.' });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan. Silakan coba lagi.' }, { status: 500 });
  }
}
