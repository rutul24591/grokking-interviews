import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string | ReactNode;
  duration?: number; // ms, undefined = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  position?: ToastPosition;
  persistent?: boolean;
  createdAt: number;
}

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 5000,
  error: 10000,
  warning: 8000,
  info: 5000,
  custom: 5000,
};

export const VISIBLE_LIMIT = 3;
