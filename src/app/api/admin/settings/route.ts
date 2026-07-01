import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';

// C5: Zod validation schema
const settingsSchema = z.object({
  storeName: z.string().optional(),
  waNumber: z.string().optional(),
  storeAddress: z.string().optional(),
  storeCity: z.string().optional(),
  storeProvince: z.string().optional(),
  rajaongkirKey: z.string().optional(),
  rajaongkirOriginCity: z.string().optional(),
  xenditSecretKey: z.string().optional(),
  xenditWebhookToken: z.string().optional(),
});

export async function PUT(req: Request) {
  // C3: CSRF origin check
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // C5: Validate request body with Zod
    const parsed = settingsSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'store' },
      update: data,
      create: { id: 'store', ...data },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
