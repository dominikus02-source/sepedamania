import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { revalidateCatalog } from '@/lib/revalidate-catalog';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
  brandId: z.string().nullable().optional(),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
  description: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { brand: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ categories }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ error: 'Gagal mengambil kategori' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    const existingSlug = await prisma.category.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const existingName = await prisma.category.findFirst({ where: { name: { equals: data.name, mode: 'insensitive' } } });
    if (existingName) {
      return NextResponse.json({ error: 'Nama kategori sudah ada' }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        image: data.image ?? null,
        brandId: data.brandId ?? null,
        color: data.color ?? '#F5A623',
        sortOrder: data.sortOrder ?? 999,
        description: data.description ?? '',
      },
      include: { brand: { select: { id: true, name: true, slug: true } } },
    });

    revalidateCatalog({ categorySlug: slug, includeAdmin: true });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error('POST /api/categories error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan kategori' }, { status: 500 });
  }
}
