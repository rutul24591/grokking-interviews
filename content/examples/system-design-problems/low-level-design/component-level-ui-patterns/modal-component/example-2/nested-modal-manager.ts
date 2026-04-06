/**
 * Nested Modal Manager — Handles z-index stacking and independent focus traps.
 *
 * Interview edge cases:
 * 1. Multiple modals open simultaneously — each needs its own focus trap
 * 2. Z-index stacking — each nested modal gets higher z-index
 * 3. Escape only closes the topmost modal, not all modals
 * 4. Backdrop visibility — lower modals should be visible but dimmed
 */

import { useState, useCallback, useRef } from 'react';

interface ModalEntry {
  id: string;
  zIndex: number;
  focusTrap: { activate: () => void; deactivate: () => void };
}

const BASE_Z_INDEX = 1000;
const Z_INDEX_INCREMENT = 100;

/**
 * Manages a stack of nested modals with independent focus traps and z-index stacking.
 */
export function useNestedModalManager() {
  const [stack, setStack] = useState<ModalEntry[]>([]);
  const stackRef = useRef<ModalEntry[]>([]);

  const openModal = useCallback((id: string, focusTrap: { activate: () => void; deactivate: () => void }) => {
    const entry: ModalEntry = {
      id,
      zIndex: BASE_Z_INDEX + (stackRef.current.length + 1) * Z_INDEX_INCREMENT,
      focusTrap,
    };
    stackRef.current = [...stackRef.current, entry];
    setStack([...stackRef.current]);
    focusTrap.activate();
  }, []);

  const closeModal = useCallback((id: string) => {
    const idx = stackRef.current.findIndex((e) => e.id === id);
    if (idx === -1) return;

    const entry = stackRef.current[idx];
    entry.focusTrap.deactivate();

    stackRef.current = stackRef.current.filter((e) => e.id !== id);
    setStack([...stackRef.current]);

    // Activate focus trap of new topmost modal
    if (stackRef.current.length > 0) {
      stackRef.current[stackRef.current.length - 1].focusTrap.activate();
    }
  }, []);

  const handleEscape = useCallback(() => {
    if (stackRef.current.length === 0) return;
    const top = stackRef.current[stackRef.current.length - 1];
    closeModal(top.id);
  }, [closeModal]);

  return {
    stack,
    openModal,
    closeModal,
    handleEscape,
    topZIndex: stack.length > 0 ? stack[stack.length - 1].zIndex : 0,
  };
}
