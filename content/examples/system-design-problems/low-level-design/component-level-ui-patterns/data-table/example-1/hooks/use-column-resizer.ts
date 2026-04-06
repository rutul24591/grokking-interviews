import { useCallback, useRef, useEffect } from 'react';
import type { RowData } from '../lib/table-types';
import type { UseStoreApi } from 'zustand';

interface ResizeState {
  field: string;
  startX: number;
  startWidth: number;
  minWidth: number;
}

/**
 * Custom hook for column resizing via drag.
 * Returns props to attach to the resize handle on each column header.
 * Uses pointer events for touch support.
 */
export function useColumnResizer<T extends RowData>(
  store: UseStoreApi<{
    columnWidths: Record<string, number>;
    setColumnWidth: (field: string, width: number) => void;
  }>,
  field: string,
  minWidth: number = 80,
) {
  const stateRef = useRef<ResizeState | null>(null);
  const columnWidths = store((s) => s.columnWidths);
  const setColumnWidth = store((s) => s.setColumnWidth);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const currentWidth = columnWidths[field] ?? minWidth;

      stateRef.current = {
        field,
        startX: e.clientX,
        startWidth: currentWidth,
        minWidth,
      };

      // Capture pointer to receive events outside the element
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [field, minWidth, columnWidths],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!stateRef.current) return;

      const delta = e.clientX - stateRef.current.startX;
      const newWidth = Math.max(
        stateRef.current.startWidth + delta,
        stateRef.current.minWidth,
      );

      setColumnWidth(stateRef.current.field, newWidth);
    },
    [setColumnWidth],
  );

  const handlePointerUp = useCallback(() => {
    stateRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return {
    onPointerDown: handlePointerDown,
    width: columnWidths[field] ?? minWidth,
  };
}
