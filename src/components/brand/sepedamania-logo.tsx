import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function SepedamaniaLogo({ variant = 'default', className }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={cn('flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F172A]', className)}>
        <span className="text-white font-bold text-sm tracking-tight">S</span>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href="/" className={cn('flex items-center gap-0', className)}>
        <span className="text-[#0F172A] font-extrabold text-lg tracking-tight">Sepeda</span>
        <span className="text-[#2563EB] font-semibold text-lg tracking-tight">mania</span>
      </Link>
    );
  }

  return (
    <Link href="/" className={cn('flex items-center gap-3 group', className)}>
      {/* Icon mark */}
      <div className="w-8 h-8 rounded-xl bg-[#0F172A] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-0">
          <span className="text-[#0F172A] font-extrabold text-xl tracking-[-0.03em] leading-none">Sepeda</span>
          <span className="text-[#2563EB] font-semibold text-xl tracking-[-0.02em] leading-none">mania</span>
        </div>
        <span className="text-[10px] text-[#94A3B8] font-medium tracking-[0.15em] uppercase mt-0.5">Premium Bicycle Store</span>
      </div>
    </Link>
  );
}
