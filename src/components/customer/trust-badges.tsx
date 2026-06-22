import { cn } from '@/lib/utils';
import { ShieldCheck, Truck, Wallet, MessageCircle } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const badges = [
  { icon: ShieldCheck, label: 'Garansi 100% Original', bg: '#E0F2FE', iconColor: '#0284C7', text: '#0369A1' },
  { icon: Truck, label: 'Pengiriman Cepat', bg: '#FEF3C7', iconColor: '#F97316', text: '#C2410C' },
  { icon: Wallet, label: 'Bisa COD', bg: '#DCFCE7', iconColor: '#16A34A', text: '#15803D' },
  { icon: MessageCircle, label: 'Konsultasi Gratis', bg: '#FEE2E2', iconColor: '#EF4444', text: '#B91C1C' },
];

export function TrustBadges({ variant = 'full', className }: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: badge.iconColor }} />
              <span className="text-xs text-[#64748B]">{badge.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3', className)}>
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl bg-white border border-[#E2E8F0"
            style={{ borderColor: badge.bg }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: badge.bg }}
            >
              <Icon className="w-4 h-4" style={{ color: badge.iconColor }} />
            </div>
            <span className="text-xs sm:text-sm font-medium leading-tight" style={{ color: badge.text }}>
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
