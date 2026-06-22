'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const STORAGE_KEY = 'pwa-install-dismissed';

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<(Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }) | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInStandaloneMode()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const ev = e as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
      setDeferredPrompt(ev);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOS()) {
      const timer = setTimeout(() => {
        setShowIOSPrompt(true);
        setShowPrompt(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    if (isAndroid()) {
      const timer = setTimeout(() => {
        if (!deferredPrompt) {
          setShowPrompt(true);
        }
      }, 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-[#E2E8F0]">
            <Image
              src="/icons/icon-192.png"
              alt="SEPEDAMANIA"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#0F172A]">
              Install SEPEDAMANIA
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              {showIOSPrompt
                ? 'Tap tombol Share  ➔  pilih Add to Home Screen'
                : 'Akses lebih cepat lewat layar utama HP kamu'}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F5F9]"
            aria-label="Tutup"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {showIOSPrompt ? (
          <button
            onClick={handleDismiss}
            className="mt-3 w-full rounded-xl bg-[#0F172A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            Mengerti
          </button>
        ) : deferredPrompt ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-[#0F172A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-xl border border-[#E2E8F0] py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
            >
              Nanti
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-xs text-[#64748B] text-center">
              Buka menu browser dan pilih &ldquo;Add to Home Screen&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
