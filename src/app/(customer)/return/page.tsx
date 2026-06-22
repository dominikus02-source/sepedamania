import { Suspense } from 'react';
import { MyReturnsClient } from './my-returns-client';
import { Loading } from '@/components/ui/loading';

export default function MyReturnsPage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Suspense fallback={<Loading />}>
        <MyReturnsClient />
      </Suspense>
    </div>
  );
}
