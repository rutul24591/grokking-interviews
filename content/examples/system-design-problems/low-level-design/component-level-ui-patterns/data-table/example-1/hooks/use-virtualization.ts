import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_ROW_HEIGHT, OVERSCAN_ROWS } from '../lib/table-types';

interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  totalScrollHeight: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for row virtualization.
 * Computes which rows are visible based on scroll position and container height.
 * Supports fixed row heights with an estimated fallback for variable heights.
 */
export function useVirtualization(
  totalRows: number,
  rowHeight: number = DEFAULT_ROW_HEIGHT,
  enabled: boolean = true,
): VirtualizationResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Map<number, number>>(new Map());

  const totalScrollHeight = useMemo(() => {
    if (!enabled) return totalRows * rowHeight;
    // Use measured heights where available, estimate for the rest
    let height = 0;
    for (let i = 0; i < totalRows; i++) {
      height += measuredHeights.get(i) ?? rowHeight;
    }
    return height;
  }, [totalRows, rowHeight, measuredHeights, enabled]);

  const startIndex = useMemo(() => {
    if (!enabled || containerHeight === 0) return 0;
    return Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS);
  }, [scrollTop, rowHeight, containerHeight, enabled]);

  const endIndex = useMemo(() => {
    if (!enabled || containerHeight === 0) return Math.min(totalRows, OVERSCAN_ROWS * 2);
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    return Math.min(totalRows, Math.ceil(scrollTop / rowHeight) + visibleRows + OVERSCAN_ROWS);
  }, [scrollTop, rowHeight, containerHeight, totalRows, enabled]);

  const offsetY = useMemo(() => {
    if (!enabled) return startIndex * rowHeight;
    let offset = 0;
    for (let i = 0; i < startIndex; i++) {
      offset += measuredHeights.get(i) ?? rowHeight;
    }
    return offset;
  }, [startIndex, rowHeight, measuredHeights, enabled]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // ResizeObserver for container height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(container);
    setContainerHeight(container.clientHeight);

    return () => observer.disconnect();
  }, []);

  // Measure row heights after render (for variable height support)
  const measureRow = useCallback(
    (index: number, height: number) => {
      setMeasuredHeights((prev) => {
        if (prev.get(index) === height) return prev; // No change
        const next = new Map(prev);
        next.set(index, height);
        return next;
      });
    },
    [],
  );

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    startIndex: enabled ? startIndex : 0,
    endIndex: enabled ? endIndex : totalRows,
    totalScrollHeight: enabled ? totalScrollHeight : totalRows * rowHeight,
    offsetY: enabled ? offsetY : 0,
    containerRef,
  };
}
