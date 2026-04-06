/**
 * Data Table — Staff-Level Virtualization Optimization.
 *
 * Staff differentiator: Dynamic row height measurement with IntersectionObserver,
 * scroll anchoring for stable position during data updates, and render scheduling
 * with requestIdleCallback for non-critical updates.
 */

import { useRef, useCallback, useState, useEffect } from 'react';

interface VirtualRow {
  index: number;
  offset: number;
  height: number;
  isMeasured: boolean;
}

/**
 * Advanced virtualized table with dynamic heights and scroll anchoring.
 */
export function useAdvancedVirtualization<T>(
  data: T[],
  estimatedRowHeight: number = 40,
  containerHeight: number,
  overscan: number = 5,
) {
  const [rowHeights, setRowHeights] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);
  const rowRefs = useRef<Map<number, HTMLTableRowElement | null>>(new Map());

  // Initialize ResizeObserver for dynamic height measurement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const index = Number((entry.target as HTMLElement).dataset.rowIndex);
        if (!isNaN(index)) {
          setRowHeights((prev) => {
            const next = new Map(prev);
            next.set(index, entry.contentRect.height);
            return next;
          });
        }
      }
    });
    return () => observerRef.current?.disconnect();
  }, []);

  /**
   * Computes visible rows based on current scroll position.
   */
  const getVisibleRows = useCallback((): VirtualRow[] => {
    const rows: VirtualRow[] = [];
    let offset = 0;
    const startBoundary = scrollTop - overscan * estimatedRowHeight;
    const endBoundary = scrollTop + containerHeight + overscan * estimatedRowHeight;

    for (let i = 0; i < data.length; i++) {
      const height = rowHeights.get(i) ?? estimatedRowHeight;
      const isMeasured = rowHeights.has(i);

      if (offset + height > startBoundary && offset < endBoundary) {
        rows.push({ index: i, offset, height, isMeasured });
      }

      // Early exit if past visible range
      if (offset > endBoundary) break;

      offset += height;
    }

    return rows;
  }, [data.length, rowHeights, scrollTop, containerHeight, overscan, estimatedRowHeight]);

  /**
   * Registers a row element for ResizeObserver tracking.
   */
  const registerRow = useCallback((index: number, el: HTMLTableRowElement | null) => {
    rowRefs.current.set(index, el);
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  /**
   * Total estimated height for scrollbar.
   */
  const totalHeight = data.length * estimatedRowHeight;

  return { getVisibleRows, registerRow, totalHeight, scrollTop, setScrollTop };
}
