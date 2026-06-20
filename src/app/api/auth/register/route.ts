import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashedPassword, phone } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
