import { Suspense } from 'react';
import { OrderDetailClient } from './order-detail-client';
import { Loading } from '@/components/ui/loading';

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <OrderDetailClient orderId={orderId} />
    </Suspense>
  );
}
