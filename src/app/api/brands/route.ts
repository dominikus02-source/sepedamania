import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { revalidateCatalog } from '@/lib/revalidate-catalog';
import { z } from 'zod';

const createBrandSchema = z.object({
  name: z.string().min(1, 'Nama merek wajib diisi'),
  slug: z.string().optional(),
  logo: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  description: z.string().optional(),
});

const updateBrandSchema = createBrandSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(brands, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('GET /api/brands error:', err);
    return NextResponse.json({ error: 'Gagal mengambil merek' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createBrandSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    const existingSlug = await prisma.brand.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const existingName = await prisma.brand.findFirst({ where: { name: { equals: data.name, mode: 'insensitive' } } });
    if (existingName) {
      return NextResponse.json({ error: 'Nama merek sudah ada' }, { status: 409 });
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo ?? null,
        sortOrder: data.sortOrder ?? 999,
        description: data.description ?? '',
      },
    });

    revalidateCatalog({ includeAdmin: true });
    return NextResponse.json({ brand }, { status: 201 });
  } catch (err) {
    console.error('POST /api/brands error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan merek' }, { status: 500 });
  }
}
