'use client';

import { Badge } from '@/components/ui/badge';
import type { ReturnStatus } from '@/lib/mock-returns';
import { RETURN_STATUS_LABELS, RETURN_STATUS_VARIANTS } from '@/lib/mock-returns';

const VARIANT_MAP: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'> = {
  blue: 'info',
  amber: 'warning',
  green: 'success',
  red: 'destructive',
  purple: 'primary',
  sky: 'info',
  orange: 'warning',
  indigo: 'primary',
  emerald: 'success',
  slate: 'default',
};

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
  className?: string;
}

export function ReturnStatusBadge({ status, className }: ReturnStatusBadgeProps) {
  const variantKey = RETURN_STATUS_VARIANTS[status] || 'slate';
  const badgeVariant = VARIANT_MAP[variantKey] ?? 'default';

  return (
    <Badge variant={badgeVariant} className={className}>
      {RETURN_STATUS_LABELS[status]}
    </Badge>
  );
}
