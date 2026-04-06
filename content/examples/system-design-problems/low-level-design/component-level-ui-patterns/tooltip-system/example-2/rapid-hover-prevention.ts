/**
 * Rapid Hover Flicker Prevention — Debounces show/hide with cancelable timers.
 *
 * Interview edge case: User rapidly moves mouse across multiple tooltip triggers.
 * Without debouncing, each tooltip flashes briefly. Solution: show delay (300ms)
 * and hide delay (100ms) with cancel-on-hover-change. Only one tooltip globally.
 */

import { useRef, useCallback, useState, useEffect } from 'react';

interface TooltipState {
  activeTriggerId: string | null;
  isShowing: boolean;
}

/**
 * Hook that manages tooltip visibility with show/hide delays and global singleton enforcement.
 */
export function useTooltipDelay(
  showDelayMs: number = 300,
  hideDelayMs: number = 100,
) {
  const [state, setState] = useState<TooltipState>({ activeTriggerId: null, isShowing: false });
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const globalActiveRef = useRef<string | null>(null);

  /**
   * Called on mouse enter. Schedules tooltip show after showDelayMs.
   * Cancels any pending hide timer.
   */
  const onMouseEnter = useCallback((triggerId: string) => {
    // Cancel pending hide
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    // If another tooltip is already showing, don't show this one
    if (globalActiveRef.current && globalActiveRef.current !== triggerId) return;

    // Schedule show
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    showTimerRef.current = setTimeout(() => {
      globalActiveRef.current = triggerId;
      setState({ activeTriggerId: triggerId, isShowing: true });
    }, showDelayMs);
  }, [showDelayMs]);

  /**
   * Called on mouse leave. Schedules tooltip hide after hideDelayMs.
   * Cancels any pending show timer.
   */
  const onMouseLeave = useCallback(() => {
    // Cancel pending show
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    // Schedule hide
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      globalActiveRef.current = null;
      setState({ activeTriggerId: null, isShowing: false });
    }, hideDelayMs);
  }, [hideDelayMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return { ...state, onMouseEnter, onMouseLeave };
}
