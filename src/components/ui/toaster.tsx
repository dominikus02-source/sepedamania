'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200',
              toast.type === 'success' && 'bg-[#34C759] text-white',
              toast.type === 'error' && 'bg-[#FF3B30] text-white',
              toast.type === 'info' && 'bg-[#1A1A1A] text-white',
              toast.type === 'warning' && 'bg-[#F97316] text-white'
            )}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
