import { Suspense } from 'react';
import { ReturnDetailClient } from './return-detail-client';
import { Loading } from '@/components/ui/loading';

export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ returnNumber: string }>;
}) {
  const { returnNumber } = await params;
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Suspense fallback={<Loading />}>
        <ReturnDetailClient returnNumber={returnNumber} />
      </Suspense>
    </div>
  );
}
