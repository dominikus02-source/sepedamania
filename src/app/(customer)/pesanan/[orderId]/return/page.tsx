import { Suspense } from 'react';
import { ReturnFormClient } from './return-form-client';
import { Loading } from '@/components/ui/loading';

export default async function ReturnFormPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Suspense fallback={<Loading />}>
        <ReturnFormClient orderId={orderId} />
      </Suspense>
    </div>
  );
}
