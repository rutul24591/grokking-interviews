/**
 * Flash Prevention — Ensures skeleton doesn't flicker when content loads quickly.
 *
 * Interview edge case: If content loads in <200ms, showing a skeleton creates a flash
 * (skeleton appears then immediately disappears). The fix: track mount time and only
 * show skeleton if content hasn't loaded within a minimum display threshold.
 */

import { useState, useEffect, useRef } from 'react';

interface UseFlashPreventionConfig {
  minDisplayTime?: number;
  delayThreshold?: number;
}

export function useFlashPrevention(isLoading: boolean, config: UseFlashPreventionConfig = {}) {
  const { minDisplayTime = 300, delayThreshold = 200 } = config;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showContent, setShowContent] = useState(!isLoading);
  const skeletonShowTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        skeletonShowTimeRef.current = Date.now();
        setShowSkeleton(true);
        setShowContent(false);
      }, delayThreshold);
      return () => clearTimeout(timer);
    }

    if (showSkeleton && skeletonShowTimeRef.current) {
      const elapsed = Date.now() - skeletonShowTimeRef.current;
      if (elapsed < minDisplayTime) {
        const remaining = minDisplayTime - elapsed;
        const timer = setTimeout(() => {
          setShowSkeleton(false);
          setShowContent(true);
          skeletonShowTimeRef.current = null;
        }, remaining);
        return () => clearTimeout(timer);
      }
    }

    setShowSkeleton(false);
    setShowContent(true);
    skeletonShowTimeRef.current = null;
    return undefined;
  }, [isLoading, showSkeleton, delayThreshold, minDisplayTime]);

  return { showSkeleton, showContent };
}
