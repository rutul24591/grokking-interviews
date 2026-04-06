'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ModalOptions } from '../lib/modal-types';
import { useFocusTrap } from '../hooks/use-focus-trap';

type ModalPanelProps = {
  modal: ModalOptions;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
};

export function ModalPanel({
  modal,
  onConfirm,
  onCancel,
  onClose,
}: ModalPanelProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Activate focus trap
  useFocusTrap(containerRef, true);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // matches transition duration
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 300);
  }, [onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && !modal.preventDismiss) {
        e.stopPropagation();
        handleDismiss();
      }
    },
    [handleDismiss, modal.preventDismiss]
  );

  // Generate unique IDs for ARIA attributes
  const titleId = `${modal.id}-title`;
  const contentId = `${modal.id}-content`;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      onKeyDown={handleKeyDown}
      className={`
        relative mx-auto w-full max-w-lg rounded-xl border
        bg-white shadow-2xl
        dark:border-gray-700 dark:bg-gray-800
        transition-all duration-300 ease-out
        ${isEntering ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'}
        ${isExiting ? 'scale-95 translate-y-4 opacity-0' : ''}
      `}
      style={{ zIndex: modal.zIndex }}
    >
      {/* Header */}
      {modal.title && (
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2
            id={titleId}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {modal.title}
          </h2>
          {!modal.preventDismiss && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close dialog"
              className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-5 w-5"
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
          )}
        </div>
      )}

      {/* Content */}
      <div id={contentId} className="px-6 py-4">
        {modal.type === 'confirm' && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {modal.message}
          </p>
        )}

        {modal.type === 'alert' && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {modal.message}
          </p>
        )}

        {modal.type === 'custom' && <div>{modal.content}</div>}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        {modal.type === 'confirm' && (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {modal.cancelLabel || 'No'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {modal.confirmLabel || 'Yes'}
            </button>
          </>
        )}

        {modal.type === 'alert' && (
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {modal.confirmLabel || 'OK'}
          </button>
        )}

        {modal.type === 'custom' && (
          /* Custom modals can provide their own footer via content */
          <div className="flex w-full justify-end gap-3">{/* Custom footer slot */}</div>
        )}
      </div>
    </div>
  );
}
