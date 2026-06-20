import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-[#1A1A1A] text-white hover:bg-[#333] shadow-sm',
        destructive: 'bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90',
        outline: 'border border-[#E5E5EA] bg-white hover:bg-[#F2F2F7] text-[#1C1C1E]',
        secondary: 'bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA]',
        ghost: 'hover:bg-[#F2F2F7] text-[#1C1C1E]',
        link: 'text-[#F5A623] underline-offset-4 hover:underline',
        accent: 'bg-[#F5A623] text-[#1A1A1A] hover:bg-[#F5A623]/90 font-semibold shadow-sm',
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
