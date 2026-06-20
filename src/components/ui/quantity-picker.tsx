import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface QuantityPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export function QuantityPicker({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}: QuantityPickerProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center border border-[#E5E5EA] rounded-lg overflow-hidden',
        size === 'sm' ? 'h-8' : 'h-10'
      )}
    >
      <button
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-[#F2F2F7] disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        )}
      >
        <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
      <span
        className={cn(
          'font-medium text-[#1C1C1E] text-center border-x border-[#E5E5EA] min-w-[40px]',
          size === 'sm' ? 'text-sm h-8 leading-8' : 'text-base h-10 leading-10'
        )}
      >
        {value}
      </span>
      <button
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-[#F2F2F7] disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        )}
      >
        <Plus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
    </div>
  );
}
