import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#F2F2F7] text-[#1C1C1E]',
        primary: 'bg-[#1A1A1A] text-white',
        success: 'bg-[#34C759]/10 text-[#34C759]',
        warning: 'bg-[#F5A623]/10 text-[#F5A623]',
        destructive: 'bg-[#FF3B30]/10 text-[#FF3B30]',
        info: 'bg-[#007AFF]/10 text-[#007AFF]',
        outline: 'border border-[#E5E5EA] text-[#8E8E93]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
