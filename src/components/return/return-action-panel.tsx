'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ReturnStatus } from '@prisma/client';
import {
  RETURN_STATUS_LABELS,
  VALID_RETURN_TRANSITIONS,
  RETURN_STATUS_VARIANTS,
} from '@/lib/returns-shared';
import { ChevronDown, Loader2 } from 'lucide-react';

interface ReturnActionPanelProps {
  currentStatus: ReturnStatus;
  onStatusChange: (newStatus: ReturnStatus) => void;
  isLoading?: boolean;
}

export function ReturnActionPanel({
  currentStatus,
  onStatusChange,
  isLoading = false,
}: ReturnActionPanelProps) {
  const [open, setOpen] = useState(false);
  const transitions = (VALID_RETURN_TRANSITIONS[currentStatus] || []) as ReturnStatus[];

  if (!transitions || transitions.length === 0) {
    return (
      <p className="text-xs text-[#8E8E93] italic text-center py-2">
        Tidak ada tindakan tersedia untuk status ini.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {transitions.length <= 2 ? (
          // Show inline buttons for 1-2 transitions
          transitions.map((targetStatus) => (
            <Button
              key={targetStatus}
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onStatusChange(targetStatus)}
              className="text-xs"
            >
              {isLoading && (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              )}
              {getActionLabel(currentStatus, targetStatus)}
            </Button>
          ))
        ) : (
          // Dropdown for 3+ transitions
          <div className="relative inline-block">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => setOpen(!open)}
              className="text-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <ChevronDown className="w-3 h-3 mr-1" />
              )}
              Ubah Status
            </Button>
            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg border border-[#E5E5EA] shadow-lg py-1 min-w-[180px]">
                  {transitions.map((targetStatus) => (
                    <button
                      key={targetStatus}
                      className="w-full text-left px-3 py-2 text-sm text-[#1C1C1E] hover:bg-[#F2F2F7] transition-colors flex items-center gap-2"
                      onClick={() => {
                        setOpen(false);
                        onStatusChange(targetStatus);
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: getStatusColor(targetStatus),
                        }}
                      />
                      {getActionLabel(currentStatus, targetStatus)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getActionLabel(from: ReturnStatus, to: ReturnStatus): string {
  const prefixMap: Partial<Record<ReturnStatus, string>> = {
    UNDER_REVIEW: 'Tinjau',
    APPROVED: 'Setujui',
    REJECTED: 'Tolak',
    WAITING_FOR_ITEM: 'Minta Kirim Barang',
    ITEM_RECEIVED: 'Terima Barang',
    REFUND_PROCESSING: 'Proses Refund',
    REPLACEMENT_SHIPPING: 'Kirim Pengganti',
    COMPLETED: 'Selesaikan',
    CANCELLED: 'Batalkan',
  };

  const prefix = prefixMap[to];
  if (prefix) return prefix;

  return `Ubah ke ${RETURN_STATUS_LABELS[to]}`;
}

function getStatusColor(status: ReturnStatus): string {
  const colorMap: Record<string, string> = {
    blue: '#007AFF',
    amber: '#F5A623',
    green: '#34C759',
    red: '#FF3B30',
    purple: '#AF52DE',
    sky: '#5AC8FA',
    orange: '#FF9500',
    indigo: '#5856D6',
    emerald: '#34C759',
    slate: '#8E8E93',
  };
  return colorMap[RETURN_STATUS_VARIANTS[status]] || '#8E8E93';
}
