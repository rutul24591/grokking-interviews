/**
 * Delay Threshold — Conditional skeleton rendering based on fetch duration.
 *
 * If content loads in <200ms, showing a skeleton causes a perceptible flash.
 * If content takes >200ms, users expect feedback — show skeleton.
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Returns whether to show a loading skeleton based on how long loading has been in progress.
 * - < delayMs: return false (content likely loaded, skip skeleton)
 * - >= delayMs: return true (content taking time, show skeleton)
 * - >= maxMs: return true but also signal to show fallback "still loading" message
 */
export function useLoadingThreshold(isLoading: boolean, delayMs = 200, maxMs = 3000) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setShowSkeleton(false);
      setShowFallback(false);

      const skeletonTimer = setTimeout(() => setShowSkeleton(true), delayMs);
      const fallbackTimer = setTimeout(() => setShowFallback(true), maxMs);

      return () => {
        clearTimeout(skeletonTimer);
        clearTimeout(fallbackTimer);
      };
    }

    startTimeRef.current = null;
    setShowSkeleton(false);
    setShowFallback(false);
    return undefined;
  }, [isLoading, delayMs, maxMs]);

  return { showSkeleton, showFallback, elapsed: startTimeRef.current ? Date.now() - startTimeRef.current : 0 };
}
