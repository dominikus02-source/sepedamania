'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/customer/order-status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, Clock, Truck, CheckCircle } from 'lucide-react';

interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; price: number; qty: number; image?: string; productSlug?: string }[];
  [key: string]: unknown;
}

const statusIcons: Record<string, typeof Clock> = {
  PENDING_PAYMENT: Clock,
  PAID: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: Package,
};

export function OrderList({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#111827] mb-6 font-display">Histori Pembelian</h1>
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Belum Ada Pesanan"
          description="Kamu belum melakukan pemesanan apapun."
          action={<Link href="/"><Button variant="accent">Mulai Belanja</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#111827] mb-6 font-display">Histori Pembelian</h1>
      <div className="space-y-3">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status] || Package;
          return (
            <Link
              key={order.id}
              href={`/pesanan/${order.orderNumber || order.id}`}
              className="block bg-white rounded-xl border border-[#E5E7EB] card-hover overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-xs text-[#6B7280] font-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>

              {/* Items */}
              <div className="px-4 py-3 space-y-2">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{item.name}</p>
                      <p className="text-xs text-[#6B7280]">{item.qty}x {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-[#6B7280] text-center">
                    +{order.items.length - 3} item lainnya
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <span className="text-xs text-[#6B7280]">Total Pesanan</span>
                <span className="text-sm font-bold text-[#111827]">{formatPrice(order.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
