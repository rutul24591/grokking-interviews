import { create } from 'zustand';
import type { Toast, ToastOptions } from './toast-types';
import { DEFAULT_DURATION } from './toast-types';

interface TimerInfo {
  id: ReturnType<typeof setTimeout>;
  remaining: number;
}

interface ToastState {
  toasts: Toast[];
  timers: Map<string, TimerInfo>;
  addToast: (toast: Partial<Toast> & { message: string }) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  timers: new Map(),

  addToast: (partial) => {
    const id = crypto.randomUUID();
    const type = partial.type || 'info';
    const duration = partial.persistent
      ? undefined
      : partial.duration ?? DEFAULT_DURATION[type];

    const toast: Toast = {
      id,
      type,
      message: partial.message,
      title: partial.title,
      duration,
      action: partial.action,
      onDismiss: partial.onDismiss,
      position: partial.position || 'top-right',
      persistent: partial.persistent || false,
      createdAt: Date.now(),
    };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    if (duration) {
      const timerId = window.setTimeout(() => {
        get().dismissToast(id);
      }, duration);

      set((state) => ({
        timers: new Map(state.timers).set(id, { id: timerId, remaining: duration }),
      }));
    }

    return id;
  },

  dismissToast: (id) => {
    set((state) => {
      const timers = new Map(state.timers);
      const timer = timers.get(id);

      if (timer) {
        clearTimeout(timer.id);
        timers.delete(id);
      }

      // Call onDismiss callback if provided
      const toast = state.toasts.find((t) => t.id === id);
      if (toast?.onDismiss) {
        toast.onDismiss();
      }

      return {
        toasts: state.toasts.filter((t) => t.id !== id),
        timers,
      };
    });
  },

  dismissAll: () => {
    set((state) => {
      state.timers.forEach((timer) => clearTimeout(timer.id));
      return { toasts: [], timers: new Map() };
    });
  },

  pauseTimer: (id) => {
    set((state) => {
      const timers = new Map(state.timers);
      const timer = timers.get(id);

      if (timer) {
        clearTimeout(timer.id);
        const toast = state.toasts.find((t) => t.id === id);
        if (toast) {
          const elapsed = Date.now() - toast.createdAt;
          const remaining = Math.max(0, timer.remaining - elapsed);
          timers.set(id, { id: 0, remaining });
        }
      }

      return { timers };
    });
  },

  resumeTimer: (id) => {
    set((state) => {
      const timers = new Map(state.timers);
      const timer = timers.get(id);

      if (timer && timer.remaining > 0) {
        const timerId = window.setTimeout(() => {
          get().dismissToast(id);
        }, timer.remaining);

        timers.set(id, { id: timerId, remaining: timer.remaining });
      }

      return { timers };
    });
  },
}));

/**
 * Convenience API — call this from anywhere without React imports.
 *
 * Usage:
 *   import { toast } from './toast-store';
 *   toast.success('Saved!');
 *   toast.error('Failed', { duration: 8000 });
 */
export const toast = {
  success: (message: string, opts?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'success', message, ...opts }),
  error: (message: string, opts?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'error', message, ...opts }),
  warning: (message: string, opts?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'warning', message, ...opts }),
  info: (message: string, opts?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'info', message, ...opts }),
  custom: (message: string, opts?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'custom', message, ...opts }),
  dismiss: (id: string) => useToastStore.getState().dismissToast(id),
  dismissAll: () => useToastStore.getState().dismissAll(),
};
