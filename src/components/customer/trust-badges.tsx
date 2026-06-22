import { cn } from '@/lib/utils';
import { ShieldCheck, Truck, Wallet, MessageCircle } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const badges = [
  { icon: ShieldCheck, label: 'Garansi 100% Original' },
  { icon: Truck, label: 'Pengiriman Cepat' },
  { icon: Wallet, label: 'Bisa COD' },
  { icon: MessageCircle, label: 'Konsultasi Gratis' },
];

export function TrustBadges({ variant = 'full', className }: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[#F5A623]" />
              <span className="text-xs text-[#64748B]">{badge.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3',
        className
      )}
    >
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]"
          >
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#F5A623]" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#92400E] leading-tight">
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
