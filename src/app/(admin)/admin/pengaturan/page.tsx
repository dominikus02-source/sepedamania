'use client';

import { storeSettings } from '@/lib/mock-admin-data';
import { SettingsForm } from './settings-form';

export default function AdminSettingsPage() {
  return <SettingsForm settings={storeSettings} />;
}
