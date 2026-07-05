'use client';

import type { ReturnReason } from '@prisma/client';
import { RETURN_REASON_LABELS } from '@/lib/returns-shared';

interface ReturnReasonLabelProps {
  reason: ReturnReason;
  className?: string;
}

export function ReturnReasonLabel({ reason, className }: ReturnReasonLabelProps) {
  return <span className={className}>{RETURN_REASON_LABELS[reason]}</span>;
}
