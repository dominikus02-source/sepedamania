import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <Skeleton className="aspect-square rounded-xl mb-2" />
      <Skeleton className="h-3 w-16 mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-24 mb-1" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="aspect-square rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
