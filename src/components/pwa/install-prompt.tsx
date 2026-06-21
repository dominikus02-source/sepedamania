'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const STORAGE_KEY = 'pwa-install-dismissed';

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInStandaloneMode()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOS()) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    };
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
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

  const iOS = isIOS();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0F172A]">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#0F172A]">
              Install Sepedamania di HP
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              {iOS
                ? 'Tap Share lalu Add to Home Screen'
                : 'Akses lebih cepat lewat layar utama HP kamu'}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F5F9]"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {iOS ? (
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
        ) : null}
      </div>
    </div>
  );
}
