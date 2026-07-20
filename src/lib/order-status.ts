/** Shared order status vocabulary. Kept in one place so the admin list, the
 *  detail page and the dashboard never drift apart. */

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  PAID: 'Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  RETURN_REQUESTED: 'Pengembalian Diajukan',
  RETURNED: 'Dikembalikan',
  REFUNDED: 'Refund',
};

/** Hex colours for chart segments — the chart library needs literal values. */
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: '#F5A623',
  PAID: '#0EA5E9',
  PROCESSING: '#6366F1',
  SHIPPED: '#8B5CF6',
  DELIVERED: '#34C759',
  COMPLETED: '#34C759',
  CANCELLED: '#FF3B30',
  RETURN_REQUESTED: '#F97316',
  RETURNED: '#EF4444',
  REFUNDED: '#64748B',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: 'Lunas',
  UNPAID: 'Belum Dibayar',
  EXPIRED: 'Kadaluarsa',
  FAILED: 'Gagal',
  CANCELLED: 'Dibatalkan',
  REFUNDED: 'Refund',
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function orderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status] ?? '#8E8E93';
}
