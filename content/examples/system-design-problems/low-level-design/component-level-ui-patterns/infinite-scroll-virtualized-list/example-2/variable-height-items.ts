/**
 * Variable Height Virtualization — Handles items with unknown/variable heights.
 *
 * Interview edge case: In a virtualized list, item heights aren't known until they
 * render. The total scroll height must be estimated upfront. When an item renders
 * and its actual height differs from the estimate, the scroll position can jump.
 * Solution: measure rendered heights and adjust the scroll offset anchor.
 */

import { useRef, useCallback, useState, useEffect } from 'react';

interface VirtualItem {
  index: number;
  offset: number;
  height: number;
  isMeasured: boolean;
}

/**
 * Hook for virtualizing items with variable heights.
 * Uses estimated height for unmeasured items, updates offset when items are measured.
 */
export function useVariableHeightVirtualization(
  totalItems: number,
  estimatedHeight: number = 50,
  containerHeight: number,
  overscan: number = 5,
) {
  const [heights, setHeights] = useState<Map<number, number>>(new Map());
  const scrollOffsetRef = useRef(0);

  /**
   * Computes the virtual items (visible + overscan) based on current scroll offset.
   */
  const getVisibleItems = useCallback((scrollOffset: number): VirtualItem[] => {
    const items: VirtualItem[] = [];
    let currentOffset = 0;

    for (let i = 0; i < totalItems; i++) {
      const measuredHeight = heights.get(i);
      const height = measuredHeight ?? estimatedHeight;
      const isMeasured = measuredHeight !== undefined;

      // Check if this item is in the visible + overscan range
      const itemEnd = currentOffset + height;
      const startVisible = currentOffset >= scrollOffset - overscan * estimatedHeight;
      const endVisible = currentOffset <= scrollOffset + containerHeight + overscan * estimatedHeight;

      if (startVisible && endVisible) {
        items.push({ index: i, offset: currentOffset, height, isMeasured });
      }

      // Optimization: skip ahead if we're past the visible range
      if (!startVisible && currentOffset > scrollOffset + containerHeight + overscan * estimatedHeight) {
        break;
      }

      currentOffset += height;
    }

    return items;
  }, [totalItems, estimatedHeight, containerHeight, overscan, heights]);

  /**
   * Called when an item renders with its actual height.
   * Updates the height map and adjusts scroll position if needed.
   */
  const onItemMeasure = useCallback((index: number, actualHeight: number) => {
    setHeights((prev) => {
      const next = new Map(prev);
      const prevHeight = prev.get(index) ?? estimatedHeight;
      next.set(index, actualHeight);

      // Adjust scroll offset if a previously measured item changed height
      if (prev.has(index) && prevHeight !== actualHeight) {
        scrollOffsetRef.current += actualHeight - prevHeight;
      }

      return next;
    });
  }, [estimatedHeight]);

  /**
   * Estimated total height for the scrollbar.
   */
  const estimatedTotalHeight = totalItems * estimatedHeight;

  return { getVisibleItems, onItemMeasure, estimatedTotalHeight, scrollOffsetRef };
}
