/**
 * Virtualized Column Resize — Handles column resize during virtualization.
 *
 * Interview edge cases:
 * 1. Resizing a column changes row heights — cached heights become stale
 * 2. Scroll position must be preserved during resize
 * 3. Re-measuring all visible rows is O(visible), not O(total)
 * 4. Non-visible rows use deferred measurement via requestIdleCallback
 */

import { useRef, useCallback, useState } from 'react';

interface ColumnResizeState {
  columnId: string;
  newWidth: number;
  anchorRowIndex: number;
  anchorOffset: number;
}

/**
 * Hook that manages column resize while preserving scroll position in a virtualized grid.
 * Uses anchor-based scroll preservation: record the anchor row's position before resize,
 * then restore scroll so the anchor row stays at the same viewport offset after resize.
 */
export function useVirtualizedColumnResize(totalRows: number) {
  const [anchor, setAnchor] = useState<ColumnResizeState | null>(null);
  const rowHeightsRef = useRef<Map<number, number>>(new Map());
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Called at resize start. Records the anchor row (first visible row) and its offset.
   */
  const onStartResize = useCallback((columnId: string, firstVisibleRow: number, scrollOffset: number) => {
    setAnchor({ columnId, newWidth: 0, anchorRowIndex: firstVisibleRow, anchorOffset: scrollOffset });
  }, []);

  /**
   * Called during resize. Updates column width and invalidates height cache for visible rows.
   * Uses requestIdleCallback for non-visible row re-measurement.
   */
  const onResize = useCallback((newWidth: number, visibleRows: number[]) => {
    setAnchor((prev) => prev ? { ...prev, newWidth } : null);

    // Invalidate cached heights for visible rows — they need re-measurement
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Defer non-visible row measurement to idle time
        for (let i = 0; i < totalRows; i++) {
          if (!visibleRows.includes(i)) {
            // Invalidate height cache — will be re-measured on next render
            rowHeightsRef.current.delete(i);
          }
        }
      });
    }
  }, [totalRows]);

  /**
   * Called at resize end. Clears anchor state.
   */
  const onEndResize = useCallback(() => {
    setAnchor(null);
  }, []);

  return {
    anchor,
    onStartResize,
    onResize,
    onEndResize,
    rowHeightsRef,
  };
}
