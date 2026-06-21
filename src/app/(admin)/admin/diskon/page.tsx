import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function OldDiskonRedirect() {
  redirect('/admin/voucher');
  return null;
}