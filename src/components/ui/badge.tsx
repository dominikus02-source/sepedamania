import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#F1F5F9] text-[#0F172A]',
        primary: 'bg-[#0F172A] text-white',
        success: 'bg-[#DCFCE7] text-[#16A34A]',
        warning: 'bg-[#FEF3C7] text-[#D97706]',
        destructive: 'bg-[#FEE2E2] text-[#DC2626]',
        info: 'bg-[#E0F2FE] text-[#0284C7]',
        outline: 'border border-[#E2E8F0] text-[#64748B]',
        sale: 'bg-[#EF4444] text-white font-semibold',
        yellow: 'bg-[#FBBF24] text-[#0F172A] font-semibold',
        orange: 'bg-[#F97316] text-white font-semibold',
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
