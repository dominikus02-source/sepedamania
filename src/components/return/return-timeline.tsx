'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import type { ReturnStatus } from '@prisma/client';
import { RETURN_STATUS_LABELS } from '@/lib/returns-shared';
import { formatDate } from '@/lib/utils';

interface ReturnTimelineProps {
  status: ReturnStatus;
  createdAt?: string | null;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  receivedAt?: string | null;
  completedAt?: string | null;
}

interface TimelineStep {
  key: string;
  label: string;
  timestamp: string | null | undefined;
  isRejection?: boolean;
  rejectionReason?: string | null;
}

export function ReturnTimeline({
  status,
  createdAt,
  reviewedAt,
  approvedAt,
  rejectionReason,
  receivedAt,
  completedAt,
}: ReturnTimelineProps) {
  const statusOrder: ReturnStatus[] = [
    'REQUESTED',
    'UNDER_REVIEW',
    'APPROVED',
    'WAITING_FOR_ITEM',
    'ITEM_RECEIVED',
    'REFUND_PROCESSING',
    'REPLACEMENT_SHIPPING',
    'COMPLETED',
  ];

  const currentStepIndex = statusOrder.indexOf(status);

  const isRejected = status === 'REJECTED';
  const isCancelled = status === 'CANCELLED';

  const steps: TimelineStep[] = [
    { key: 'submitted', label: RETURN_STATUS_LABELS['REQUESTED'], timestamp: createdAt },
    { key: 'review', label: RETURN_STATUS_LABELS['UNDER_REVIEW'], timestamp: reviewedAt },
    {
      key: 'decision',
      label: isRejected ? RETURN_STATUS_LABELS['REJECTED'] : RETURN_STATUS_LABELS['APPROVED'],
      timestamp: isRejected ? reviewedAt : approvedAt,
      isRejection: isRejected,
      rejectionReason: isRejected ? rejectionReason : null,
    },
  ];

  // Only show the rest if not rejected or cancelled
  if (!isRejected && !isCancelled) {
    steps.push(
      { key: 'waiting', label: RETURN_STATUS_LABELS['WAITING_FOR_ITEM'], timestamp: approvedAt },
      { key: 'received', label: RETURN_STATUS_LABELS['ITEM_RECEIVED'], timestamp: receivedAt },
      {
        key: 'resolution',
        label:
          status === 'REFUND_PROCESSING'
            ? RETURN_STATUS_LABELS['REFUND_PROCESSING']
            : status === 'REPLACEMENT_SHIPPING'
              ? RETURN_STATUS_LABELS['REPLACEMENT_SHIPPING']
              : 'Refund / Penggantian',
        timestamp: null,
      },
      { key: 'completed', label: RETURN_STATUS_LABELS['COMPLETED'], timestamp: completedAt }
    );
  }

  // For cancelled, add a cancelled step
  if (isCancelled) {
    steps.push({ key: 'cancelled', label: RETURN_STATUS_LABELS['CANCELLED'], timestamp: null });
  }

  const getStepState = (stepIndex: number) => {
    const terminalReached = isRejected
      ? statusOrder.indexOf('UNDER_REVIEW')
      : isCancelled
        ? statusOrder.indexOf('REQUESTED')
        : currentStepIndex;

    if (stepIndex < terminalReached) return 'completed';
    if (stepIndex === terminalReached) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const state = getStepState(i);

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ring-2 transition-all duration-300 ${
                  state === 'completed'
                    ? 'bg-[#34C759] ring-[#34C759]/20'
                    : state === 'current'
                      ? 'bg-[#F5A623] ring-[#F5A623]/30'
                      : 'bg-[#F2F2F7] ring-[#E5E5EA]'
                }`}
              >
                {state === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : step.isRejection && state === 'current' ? (
                  <XCircle className="w-4 h-4 text-white" />
                ) : (
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      state === 'current' ? 'bg-white' : 'bg-[#C7C7CC]'
                    }`}
                  />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-[2px] h-7 transition-colors duration-300 ${
                    state === 'completed' ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
                  }`}
                />
              )}
            </div>
            <div className={`pb-5 pt-0.5 ${state === 'current' ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}>
              <p
                className={`text-sm ${
                  state === 'current' ? 'font-semibold text-[#1C1C1E]' : 'font-medium'
                }`}
              >
                {step.label}
              </p>
              {step.timestamp && (
                <p className="text-xs text-[#8E8E93] mt-0.5">{formatDate(step.timestamp)}</p>
              )}
              {step.isRejection && step.rejectionReason && state === 'current' && (
                <p className="text-xs text-[#FF3B30] mt-1 italic">
                  Alasan: {step.rejectionReason}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
