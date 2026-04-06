// ScrollRestoration — Restores scroll position from history state.
// Reads saved scroll offset after items are loaded and scrolls to the position.

'use client';

import { useEffect, useRef } from 'react';

const SCROLL_POSITION_KEY = '__virtualized_list_scroll_position__';

interface ScrollRestorationProps {
  /** Ref to the scroll container */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Current items array — used to wait until enough items are loaded */
  items: unknown[];
}

interface SavedScrollState {
  /** Pixel offset from the top */
  scrollTop: number;
  /** Index of the first visible item */
  firstVisibleIndex: number;
  /** Timestamp when the state was saved */
  savedAt: number;
}

export function ScrollRestoration({
  containerRef,
  items,
}: ScrollRestorationProps) {
  const restoredRef = useRef(false);
  const stateRef = useRef<SavedScrollState | null>(null);

  // Read saved state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (restoredRef.current) return;

    try {
      const saved = window.history.state?.[SCROLL_POSITION_KEY];
      if (saved && typeof saved === 'object') {
        stateRef.current = saved as SavedScrollState;
      }
    } catch {
      // Ignore errors reading history state
    }
  }, []);

  // Restore scroll position once we have enough items
  useEffect(() => {
    if (restoredRef.current) return;
    if (!stateRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    // Wait until we have at least as many items as the saved index
    const { scrollTop, firstVisibleIndex } = stateRef.current;

    if (items.length > firstVisibleIndex || scrollTop > 0) {
      // Use requestAnimationFrame to ensure the DOM has updated
      const rafId = requestAnimationFrame(() => {
        container.scrollTo({
          top: scrollTop,
          behavior: 'auto', // Instant scroll — no animation on restoration
        });
        restoredRef.current = true;
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  }, [containerRef, items, items.length]);

  // Save scroll position before unload / route change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const handleBeforeUnload = () => {
      try {
        const currentState: SavedScrollState = {
          scrollTop: container.scrollTop,
          firstVisibleIndex: 0, // Approximation — could be computed from virtualizer
          savedAt: Date.now(),
        };

        // Merge with existing state to avoid overwriting other keys
        const existingState = window.history.state || {};
        window.history.replaceState(
          { ...existingState, [SCROLL_POSITION_KEY]: currentState },
          '',
        );
      } catch {
        // Ignore errors writing history state
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [containerRef]);

  // This component renders nothing — it's a side-effect-only component
  return null;
}
