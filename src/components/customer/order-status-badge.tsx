import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'primary' | 'success' | 'default' | 'destructive' }> = {
  PENDING_PAYMENT: { label: 'Menunggu Bayar', variant: 'warning' },
  PAID: { label: 'Dibayar', variant: 'info' },
  PROCESSING: { label: 'Diproses', variant: 'primary' },
  SHIPPED: { label: 'Dikirim', variant: 'success' },
  DELIVERED: { label: 'Selesai', variant: 'success' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
  REFUNDED: { label: 'Refund', variant: 'destructive' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, variant: 'default' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
