'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '../lib/modal-store';
import { ModalBackdrop } from './modal-backdrop';
import { ModalPanel } from './modal-component';

export function ModalContainer() {
  const [mounted, setMounted] = useState(false);
  const currentModal = useModalStore((state) => state.currentModal);
  const isOpen = useModalStore((state) => state.isOpen);
  const zIndex = useModalStore((state) => state.zIndex);
  const close = useModalStore((state) => state.close);
  const confirm = useModalStore((state) => state.confirm);
  const cancel = useModalStore((state) => state.cancel);

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock on body when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Global Escape key handler
  useEffect(() => {
    if (!isOpen || !currentModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentModal.closeOnEscape !== false && !currentModal.preventDismiss) {
        e.stopPropagation();
        close();
      }
    };

    // Use capture phase to intercept before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, currentModal, close]);

  if (!mounted || !isOpen || !currentModal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ zIndex: currentModal.zIndex }}
    >
      {/* Backdrop */}
      <ModalBackdrop
        zIndex={currentModal.zIndex ?? zIndex}
        onDismiss={
          currentModal.closeOnBackdropClick && !currentModal.preventDismiss
            ? close
            : undefined
        }
        closeOnBackdropClick={currentModal.closeOnBackdropClick}
      />

      {/* Modal Panel */}
      <ModalPanel
        modal={currentModal}
        onConfirm={confirm}
        onCancel={cancel}
        onClose={close}
      />
    </div>,
    document.body
  );
}
