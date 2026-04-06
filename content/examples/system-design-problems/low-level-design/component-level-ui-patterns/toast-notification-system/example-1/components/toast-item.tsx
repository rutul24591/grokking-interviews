'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Toast } from '../lib/toast-types';
import { ToastIcon } from './toast-icon';

type ToastItemProps = {
  toast: Toast;
  onDismiss: () => void;
};

const typeStyles: Record<string, string> = {
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  custom:
    'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200',
};

const ariaRole: Record<string, string> = {
  success: 'status',
  error: 'alert',
  warning: 'alert',
  info: 'status',
  custom: 'status',
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const isPausedRef = useRef(false);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 300); // matches transition duration
  }, [onDismiss]);

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
    // Dispatch custom event to pause timer in store
    window.dispatchEvent(
      new CustomEvent('toast:pause', { detail: { id: toast.id } })
    );
  }, [toast.id]);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    window.dispatchEvent(
      new CustomEvent('toast:resume', { detail: { id: toast.id } })
    );
  }, [toast.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  const role = ariaRole[toast.type] || 'status';

  return (
    <div
      role={role}
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className={`
        relative w-full max-w-sm rounded-lg border p-4 shadow-lg
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${typeStyles[toast.type] || typeStyles.info}
        ${isEntering ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${isExiting ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <ToastIcon type={toast.type} />

        {/* Content */}
        <div className="flex-1">
          {toast.title && (
            <p className="mb-1 text-sm font-semibold">{toast.title}</p>
          )}
          <p className="text-sm leading-relaxed">{toast.message}</p>

          {/* Optional action button */}
          {toast.action && (
            <button
              type="button"
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline underline-offset-2 hover:opacity-80"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="ml-2 flex-shrink-0 rounded p-1 opacity-60 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
