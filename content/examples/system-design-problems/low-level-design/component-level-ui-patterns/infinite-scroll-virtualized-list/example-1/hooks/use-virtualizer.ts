// useVirtualizer — Main hook integrating scroll tracking, height measurement,
// and visible window computation.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VirtualItem } from '../lib/virtualization-types';
import {
  buildVirtualItems,
  computeTotalHeight,
  computeVisibleWindow,
  getItemOffset,
  getItemSize,
  updateHeightCache,
} from '../lib/virtualization-engine';

interface UseVirtualizerOptions<T> {
  /** The full data array */
  data: T[];
  /** Ref to the scroll container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Estimated item size in pixels (used before measurement) */
  estimatedItemSize?: number;
  /** Number of items to render above and below the visible window */
  overscan?: number;
}

interface UseVirtualizerReturn<T> {
  /** Items currently visible (to be rendered) */
  virtualItems: VirtualItem<T>[];
  /** Total height of all items (for outer spacer) */
  totalHeight: number;
  /** Callback to report a measured item size */
  updateItemSize: (index: number, size: number) => void;
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
}

export function useVirtualizer<T>(
  options: UseVirtualizerOptions<T>,
): UseVirtualizerReturn<T> {
  const {
    data,
    containerRef,
    estimatedItemSize = 100,
    overscan = 5,
  } = options;

  // Height cache persists across renders
  const heightCacheRef = useRef<Map<number, number>>(new Map());
  const itemCountRef = useRef(data.length);

  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Track if we've initialized the viewport dimensions
  const initializedRef = useRef(false);

  // Initialize viewport on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Set initial dimensions
    setViewportHeight(container.clientHeight);
    initializedRef.current = true;

    // Scroll listener — throttled via requestAnimationFrame
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return; // Already scheduled

      rafId = requestAnimationFrame(() => {
        rafId = null;
        setScrollTop(container.scrollTop);
      });
    };

    // Resize observer to track container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setViewportHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  // Invalidate height cache entries beyond the old item count when data changes
  useEffect(() => {
    const oldCount = itemCountRef.current;
    const newCount = data.length;

    if (newCount < oldCount) {
      // Remove cache entries for removed items
      for (let i = newCount; i < oldCount; i++) {
        heightCacheRef.current.delete(i);
      }
    }

    itemCountRef.current = newCount;
  }, [data.length]);

  // Compute the visible window
  const { virtualItems, totalHeight } = useMemo(() => {
    if (!initializedRef.current || data.length === 0) {
      return { virtualItems: [], totalHeight: 0 };
    }

    const visibleWindow = computeVisibleWindow(
      scrollTop,
      viewportHeight,
      data.length,
      heightCacheRef.current,
      estimatedItemSize,
      overscan,
    );

    const items = buildVirtualItems(
      visibleWindow.startIndex,
      visibleWindow.endIndex,
      data,
      heightCacheRef.current,
      estimatedItemSize,
    );

    return {
      virtualItems: items,
      totalHeight: visibleWindow.totalHeight,
    };
  }, [scrollTop, viewportHeight, data, estimatedItemSize, overscan]);

  // Callback to update item size when ResizeObserver reports a measurement
  const updateItemSize = useCallback(
    (index: number, size: number) => {
      const previousSize = heightCacheRef.current.get(index);
      const changed = updateHeightCache(
        heightCacheRef.current,
        index,
        size,
        previousSize,
      );

      if (changed) {
        // Trigger a re-computation — the total height and offsets have changed
        // We force a re-render by updating scroll position (which triggers useMemo recalc)
        // Using a functional update to avoid stale closure
        setScrollTop((prev) => prev);
      }
    },
    [],
  );

  // Scroll to a specific item index
  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      const container = containerRef.current;
      if (!container || index < 0 || index >= data.length) return;

      const offset = getItemOffset(
        index,
        heightCacheRef.current,
        estimatedItemSize,
      );
      const itemSize = getItemSize(
        index,
        heightCacheRef.current,
        estimatedItemSize,
      );

      let targetScroll = offset;
      if (align === 'center') {
        targetScroll = offset - viewportHeight / 2 + itemSize / 2;
      } else if (align === 'end') {
        targetScroll = offset - viewportHeight + itemSize;
      }

      container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    },
    [containerRef, data.length, estimatedItemSize, viewportHeight],
  );

  return { virtualItems, totalHeight, updateItemSize, scrollToIndex };
}
