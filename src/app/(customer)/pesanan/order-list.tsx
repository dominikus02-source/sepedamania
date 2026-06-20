'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/customer/order-status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface OrderListItem {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; price: number; qty: number; image?: string }[];
  [key: string]: unknown;
}

export function OrderList({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-[#1C1C1E] mb-4">Pesanan Saya</h1>
        <EmptyState icon={<Package className="w-8 h-8" />} title="Belum Ada Pesanan" description="Kamu belum melakukan pemesanan apapun." action={<Link href="/"><Button variant="accent">Mulai Belanja</Button></Link>} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-4">Pesanan Saya</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/pesanan/${order.id}`} className="block bg-white rounded-xl border border-[#E5E5EA] p-4 active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8E8E93] font-mono">#{order.id.slice(0, 8)}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            {order.items.slice(0, 3).map((item: { id: string; name: string; price: number; qty: number; image?: string }) => (
              <div key={item.id} className="flex items-center gap-2 py-1">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0">
                  <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1E] truncate">{item.name}</p>
                  <p className="text-xs text-[#8E8E93]">{item.qty}x {formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && <p className="text-xs text-[#8E8E93] mt-1">+{order.items.length - 3} produk lainnya</p>}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5EA]">
              <span className="text-xs text-[#8E8E93]">{formatDate(order.createdAt)}</span>
              <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
