'use client';

import type { ReturnReason } from '@/lib/mock-returns';
import { RETURN_REASON_LABELS } from '@/lib/mock-returns';

interface ReturnReasonLabelProps {
  reason: ReturnReason;
  className?: string;
}

export function ReturnReasonLabel({ reason, className }: ReturnReasonLabelProps) {
  return <span className={className}>{RETURN_REASON_LABELS[reason]}</span>;
}
