import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('DialogTrigger must be used within Dialog');

  return (
    <div onClick={() => ctx.onOpenChange(true)}>
      {children}
    </div>
  );
}

function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('DialogContent must be used within Dialog');

  if (!ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => ctx.onOpenChange(false)}
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6 mx-4 animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        <button
          onClick={() => ctx.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-[#F2F2F7] transition-colors"
        >
          <X className="w-4 h-4 text-[#8E8E93]" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-semibold text-[#1C1C1E]', className)}>{children}</h2>;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
