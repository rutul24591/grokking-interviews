import { create } from 'zustand';
import type { ModalOptions, ModalResult } from './modal-types';
import { BASE_Z_INDEX, DEFAULT_CONFIRM_LABELS, DEFAULT_ALERT_LABEL } from './modal-types';

type Resolver = (value: ModalResult) => void;

interface ModalStoreState {
  currentModal: ModalOptions | null;
  isOpen: boolean;
  zIndex: number;
  resolver: Resolver | null;
  timeoutId: ReturnType<typeof setTimeout> | null;

  openConfirm: (
    message: string,
    options?: Partial<ModalOptions>
  ) => Promise<ModalResult>;
  openAlert: (message: string, options?: Partial<ModalOptions>) => void;
  openCustom: (content: ModalOptions['content'], options?: Partial<ModalOptions>) => void;
  close: () => void;
  confirm: () => void;
  cancel: () => void;
}

let idCounter = 0;

export const useModalStore = create<ModalStoreState>((set, get) => ({
  currentModal: null,
  isOpen: false,
  zIndex: BASE_Z_INDEX,
  resolver: null,
  timeoutId: null,

  openConfirm: (message, options) => {
    return new Promise<ModalResult>((resolve) => {
      const id = `modal-${++idCounter}`;
      const zIndex = get().zIndex + 1;

      const modalOptions: ModalOptions = {
        id,
        type: 'confirm',
        title: options?.title ?? 'Confirm',
        message,
        confirmLabel: options?.confirmLabel ?? DEFAULT_CONFIRM_LABELS.confirm,
        cancelLabel: options?.cancelLabel ?? DEFAULT_CONFIRM_LABELS.cancel,
        closeOnBackdropClick: options?.closeOnBackdropClick ?? true,
        closeOnEscape: options?.closeOnEscape ?? true,
        preventDismiss: options?.preventDismiss ?? false,
        zIndex,
      };

      // Auto-resolve with null after 30s to prevent unhandled pending promises
      const timeoutId = setTimeout(() => {
        set((state) => {
          state.resolver?.(null);
          return {
            currentModal: null,
            isOpen: false,
            resolver: null,
            timeoutId: null,
            zIndex: Math.max(BASE_Z_INDEX, state.zIndex - 1),
          };
        });
      }, 30_000);

      set({
        currentModal: modalOptions,
        isOpen: true,
        zIndex,
        resolver: resolve,
        timeoutId,
      });
    });
  },

  openAlert: (message, options) => {
    const id = `modal-${++idCounter}`;
    const zIndex = get().zIndex + 1;

    const modalOptions: ModalOptions = {
      id,
      type: 'alert',
      title: options?.title ?? 'Alert',
      message,
      confirmLabel: options?.confirmLabel ?? DEFAULT_ALERT_LABEL,
      closeOnBackdropClick: options?.closeOnBackdropClick ?? true,
      closeOnEscape: options?.closeOnEscape ?? true,
      preventDismiss: options?.preventDismiss ?? false,
      zIndex,
    };

    set({
      currentModal: modalOptions,
      isOpen: true,
      zIndex,
      resolver: null,
      timeoutId: null,
    });
  },

  openCustom: (content, options) => {
    const id = `modal-${++idCounter}`;
    const zIndex = get().zIndex + 1;

    const modalOptions: ModalOptions = {
      id,
      type: 'custom',
      title: options?.title,
      content,
      closeOnBackdropClick: options?.closeOnBackdropClick ?? true,
      closeOnEscape: options?.closeOnEscape ?? true,
      preventDismiss: options?.preventDismiss ?? false,
      zIndex,
    };

    set({
      currentModal: modalOptions,
      isOpen: true,
      zIndex,
      resolver: null,
      timeoutId: null,
    });
  },

  close: () => {
    set((state) => {
      // Resolve any pending promise with null (dismissal without explicit choice)
      state.resolver?.(null);
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      return {
        currentModal: null,
        isOpen: false,
        resolver: null,
        timeoutId: null,
        zIndex: Math.max(BASE_Z_INDEX, state.zIndex - 1),
      };
    });
  },

  confirm: () => {
    set((state) => {
      state.resolver?.(true);
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      return {
        currentModal: null,
        isOpen: false,
        resolver: null,
        timeoutId: null,
        zIndex: Math.max(BASE_Z_INDEX, state.zIndex - 1),
      };
    });
  },

  cancel: () => {
    set((state) => {
      state.resolver?.(false);
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      return {
        currentModal: null,
        isOpen: false,
        resolver: null,
        timeoutId: null,
        zIndex: Math.max(BASE_Z_INDEX, state.zIndex - 1),
      };
    });
  },
}));

/**
 * Convenience API — call this from anywhere without React imports.
 *
 * Usage:
 *   import { modal } from './modal-store';
 *
 *   const result = await modal.confirm('Are you sure?');
 *   if (result === true) { /* proceed *\/ }
 *
 *   modal.alert('Operation completed');
 *
 *   modal.open(<MyCustomContent />, { title: 'Settings' });
 */
export const modal = {
  confirm: (message: string, options?: Partial<ModalOptions>) =>
    useModalStore.getState().openConfirm(message, options),
  alert: (message: string, options?: Partial<ModalOptions>) =>
    useModalStore.getState().openAlert(message, options),
  open: (content: ModalOptions['content'], options?: Partial<ModalOptions>) =>
    useModalStore.getState().openCustom(content, options),
  close: () => useModalStore.getState().close(),
};
