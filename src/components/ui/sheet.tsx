'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type Side = 'left' | 'right';

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: Side;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

function Sheet({ children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange, side: 'left' }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error('SheetTrigger must be used within Sheet');

  return <div onClick={() => ctx.onOpenChange(true)}>{children}</div>;
}

function SheetContent({ children, className, side = 'left' }: {
  children: React.ReactNode;
  className?: string;
  side?: Side;
}) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error('SheetContent must be used within Sheet');

  React.useEffect(() => {
    if (ctx.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [ctx.open]);

  if (!ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => ctx.onOpenChange(false)} />
      <div
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-300',
          side === 'left' ? 'left-0 w-[280px]' : 'right-0 w-[280px]',
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

function SheetClose({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error('SheetClose must be used within Sheet');

  return <div onClick={() => ctx.onOpenChange(false)}>{children}</div>;
}

export { Sheet, SheetTrigger, SheetContent, SheetClose };
