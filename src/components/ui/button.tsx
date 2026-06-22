import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm',
        destructive: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
        outline: 'border border-[#E2E8F0] bg-white hover:bg-[#FFFBEB] hover:border-[#FBBF24] text-[#0F172A]',
        secondary: 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]',
        ghost: 'hover:bg-[#FEF3C7] text-[#0F172A]',
        link: 'text-[#F97316] underline-offset-4 hover:underline',
        accent: 'bg-[#FBBF24] text-[#0F172A] hover:bg-[#F59E0B] font-semibold shadow-sm',
        sale: 'bg-[#EF4444] text-white hover:bg-[#DC2626] font-semibold shadow-sm',
        success: 'bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
