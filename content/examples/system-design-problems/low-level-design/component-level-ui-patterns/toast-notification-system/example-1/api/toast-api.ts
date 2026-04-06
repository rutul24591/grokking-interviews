/**
 * Toast API — Singleton convenience functions.
 *
 * Import this file from anywhere in the application to trigger toasts.
 * No React imports needed.
 *
 * Usage:
 *   import { toast } from '@/api/toast-api';
 *
 *   toast.success('Order placed successfully');
 *   toast.error('Payment failed', { duration: 8000 });
 *   toast.warning('Session expiring in 5 minutes');
 *   toast.info('File synced');
 *   toast.dismiss(id);
 *   toast.dismissAll();
 */

import { toast } from '../lib/toast-store';

// Re-export — the singleton is already defined in toast-store.ts
// This file exists as a clean public API boundary so consumers
// don't need to know about the internal store implementation.
export { toast };
export type { ToastOptions, ToastType } from '../lib/toast-types';
