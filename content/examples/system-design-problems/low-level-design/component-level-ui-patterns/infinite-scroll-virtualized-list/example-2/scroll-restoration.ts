/**
 * Scroll Position Restoration — Preserves scroll position across page changes.
 *
 * Interview edge case: User scrolls down in a chat, navigates to another page,
 * then navigates back. The scroll position should be restored to where they left off.
 * Solution: save scroll position in history state or sessionStorage, restore on return.
 */

import { useRef, useEffect, useCallback } from 'react';

interface ScrollState {
  scrollTop: number;
  scrollHeight: number;
  firstVisibleItemId: string | null;
  offsetFromTop: number;
}

/**
 * Hook that saves and restores scroll position using history state.
 */
export function useScrollRestoration(scrollContainerRef: React.RefObject<HTMLElement | null>) {
  const savedStateRef = useRef<ScrollState | null>(null);

  /**
   * Saves the current scroll position to history state.
   */
  const saveScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const state: ScrollState = {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      firstVisibleItemId: null,
      offsetFromTop: container.scrollTop,
    };

    // Save to history state
    if (window.history.state?.scrollState) {
      savedStateRef.current = window.history.state.scrollState;
    }

    window.history.replaceState(
      { ...window.history.state, scrollState: state },
      '',
    );
  }, [scrollContainerRef]);

  /**
   * Restores the saved scroll position.
   * Uses scrollHeight to adjust for content that may have changed size.
   */
  const restoreScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const saved = savedStateRef.current || window.history.state?.scrollState;
    if (!saved) return;

    // Calculate scroll position proportion (handles content size changes)
    const scrollRatio = saved.scrollTop / saved.scrollHeight;
    const newScrollTop = scrollRatio * container.scrollHeight;

    container.scrollTop = Math.min(newScrollTop, container.scrollHeight - container.clientHeight);
  }, [scrollContainerRef]);

  /**
   * Saves scroll position on scroll event (debounced).
   */
  const onScroll = useCallback(() => {
    requestAnimationFrame(saveScrollPosition);
  }, [saveScrollPosition]);

  /**
   * Save position before page unload.
   */
  useEffect(() => {
    const handler = () => saveScrollPosition();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveScrollPosition]);

  return { saveScrollPosition, restoreScrollPosition, onScroll };
}
