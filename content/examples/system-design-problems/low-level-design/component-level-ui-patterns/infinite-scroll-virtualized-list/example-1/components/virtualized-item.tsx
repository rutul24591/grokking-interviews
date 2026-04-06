// VirtualizedItem — Individual rendered item with absolute positioning,
// height measurement via ResizeObserver.

'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import type { VirtualItem } from '../../lib/virtualization-types';

interface VirtualizedItemProps<T = unknown> {
  /** The virtual item metadata */
  item: VirtualItem<T>;
  /** Callback to report measured height */
  updateItemSize: (index: number, size: number) => void;
  /** Child content to render */
  children: React.ReactNode;
  /** CSS class for the item wrapper */
  className?: string;
}

export function VirtualizedItem<T>({
  item,
  updateItemSize,
  children,
  className = '',
}: VirtualizedItemProps<T>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Measure height after mount and on content changes
  const measureHeight = useCallback(() => {
    if (!contentRef.current) return;
    const height = contentRef.current.offsetHeight;
    if (height > 0) {
      updateItemSize(item.index, height);
    }
  }, [item.index, updateItemSize]);

  // Set up ResizeObserver to detect height changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = contentRef.current;
    if (!element) return;

    // Initial measurement after paint
    measureHeight();

    // Observe size changes
    resizeObserverRef.current = new ResizeObserver(() => {
      measureHeight();
    });

    resizeObserverRef.current.observe(element);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [measureHeight]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(${item.offset}px)`,
        willChange: 'transform',
      }}
      role="listitem"
      className={className}
    >
      {/* Inner content wrapper — this is what ResizeObserver measures */}
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
