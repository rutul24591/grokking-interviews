import type { ReactNode } from 'react';

export type ModalType = 'confirm' | 'alert' | 'custom';

export type ModalResult = true | false | null;

export interface ModalOptions {
  id: string;
  type: ModalType;
  title?: string;
  message?: string;
  content?: ReactNode; // For custom modals
  confirmLabel?: string;
  cancelLabel?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventDismiss?: boolean; // Disables backdrop click, escape, and close button
  zIndex?: number;
}

export interface ModalState {
  currentModal: ModalOptions | null;
  isOpen: boolean;
  zIndex: number;
}

export const BASE_Z_INDEX = 1000;

export const DEFAULT_CONFIRM_LABELS = {
  confirm: 'Yes',
  cancel: 'No',
};

export const DEFAULT_ALERT_LABEL = 'OK';
