'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore, toast } from '../lib/toast-store';
import { ToastItem } from './toast-item';
import { VISIBLE_LIMIT } from '../lib/toast-types';

const positionClasses: Record<string, string> = {
  'top-right': 'fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm',
  'top-left': 'fixed top-4 left-4 z-50 flex flex-col gap-3 max-w-sm',
  'bottom-right': 'fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm',
  'bottom-left': 'fixed bottom-4 left-4 z-50 flex flex-col gap-3 max-w-sm',
  'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-sm',
  'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-sm',
};

export function ToastContainer() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore((state) => state.toasts.slice(0, VISIBLE_LIMIT));
  const dismissToast = useToastStore((state) => state.dismissToast);
  const pauseTimer = useToastStore((state) => state.pauseTimer);
  const resumeTimer = useToastStore((state) => state.resumeTimer);

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for pause/resume events from ToastItem
  useEffect(() => {
    const onPause = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      pauseTimer(id);
    };
    const onResume = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      resumeTimer(id);
    };

    window.addEventListener('toast:pause', onPause);
    window.addEventListener('toast:resume', onResume);

    return () => {
      window.removeEventListener('toast:pause', onPause);
      window.removeEventListener('toast:resume', onResume);
    };
  }, [pauseTimer, resumeTimer]);

  // Global Escape key handler — dismiss most recent toast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        const lastToast = toasts[toasts.length - 1];
        dismissToast(lastToast.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toasts, dismissToast]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      useToastStore.getState().dismissAll();
    };
  }, []);

  if (!mounted) return null;

  // Default position (can be extended for multi-position support)
  const containerClass = positionClasses['top-right'];

  return createPortal(
    <div className={containerClass} aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onDismiss={() => dismissToast(t.id)}
        />
      ))}
    </div>,
    document.body
  );
}

// Re-export the convenience API so consumers only need one import
export { toast };
