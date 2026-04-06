/**
 * Hover Preview Race — Prevents flicker from rapid hover across stars.
 *
 * Interview edge case: User moves mouse quickly across 5 stars. Each star
 * triggers a hover preview. Without debouncing, the preview flickers between
 * 1, 2, 3, 4, 5 stars rapidly. Solution: debounce hover state changes.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook that debounces hover state changes to prevent flicker.
 */
export function useHoverDebounce<T>(
  delayMs: number = 50,
) {
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValueRef = useRef<T | null>(null);

  /**
   * Called on hover start. Debounces the value change.
   */
  const onHoverStart = useCallback((value: T) => {
    lastValueRef.current = value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setHoveredValue(value);
    }, delayMs);
  }, [delayMs]);

  /**
   * Called on hover end. Immediately clears if no new hover started.
   */
  const onHoverEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredValue(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { hoveredValue, onHoverStart, onHoverEnd };
}
