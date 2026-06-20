import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-[#E5E5EA]'
          )}
        />
      ))}
    </div>
  );
}
