import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = ({ value, onValueChange, children, className }: RadioGroupProps) => {
  return (
    <div className={cn('space-y-2', className)} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioGroupItemProps>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  checked?: boolean;
  onChange?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const RadioGroupItem = ({ checked, onChange, children, className }: RadioGroupItemProps) => {
  return (
    <label
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg border border-[#E5E5EA] cursor-pointer transition-all duration-200 hover:border-[#F5A623]',
        checked && 'border-[#F5A623] bg-[#F5A623]/5',
        className
      )}
      onClick={onChange}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 border-[#E5E5EA] flex items-center justify-center flex-shrink-0 transition-colors',
          checked && 'border-[#F5A623]'
        )}
      >
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />}
      </div>
      {children}
    </label>
  );
};

export { RadioGroup, RadioGroupItem };
