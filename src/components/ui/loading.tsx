import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className="w-6 h-6 animate-spin text-[#F5A623]" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
        <p className="text-sm text-[#8E8E93] font-medium">Memuat...</p>
      </div>
    </div>
  );
}
