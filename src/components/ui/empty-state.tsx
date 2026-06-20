import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="w-16 h-16 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8 text-[#8E8E93]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#1C1C1E] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#8E8E93] text-center max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
