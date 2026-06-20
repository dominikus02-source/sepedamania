import { OrderList } from './order-list';
import { mockOrders } from '@/lib/mock-admin-data';

export default function OrdersPage() {
  const orders = mockOrders.slice(0, 10).map((o) => ({
    ...o,
    items: o.items.map((i: Record<string, unknown>) => ({
      id: i.id as string,
      name: i.name as string,
      price: Number(i.price),
      qty: Number(i.qty),
      image: i.image as string | undefined,
    })),
  }));

  return <OrderList orders={orders} />;
}
