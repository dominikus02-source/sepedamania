import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SettingsForm } from './settings-form';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/masuk');

  let settings = await prisma.storeSettings.findUnique({ where: { id: 'store' } });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: 'store' },
    });
  }

  const serialized = {
    id: settings.id,
    storeName: settings.storeName,
    storeLogo: settings.storeLogo,
    storeDescription: settings.metaDescription || '',
    storeAddress: settings.storeAddress || '',
    storeCity: settings.storeCity || '',
    storeProvince: settings.storeProvince || '',
    storePostalCode: settings.storePostalCode || '',
    waNumber: settings.waNumber,
    email: settings.email || '',
    rajaongkirKey: settings.rajaongkirKey || '',
    rajaongkirOriginCity: settings.rajaongkirOriginCity || '',
    midtransMerchantId: settings.midtransMerchantId || '',
    midtransNotificationAuthKey: settings.midtransNotificationAuthKey || '',
    codEnabled: settings.codActive,
    maintenanceMode: settings.maintenanceMode,
    updatedAt: settings.updatedAt.toISOString(),
  };

  return <SettingsForm settings={serialized} />;
}
