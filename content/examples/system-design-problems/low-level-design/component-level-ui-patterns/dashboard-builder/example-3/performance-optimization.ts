/**
 * Dashboard Builder — Staff-Level Performance Optimization.
 *
 * Staff differentiator: RequestAnimationFrame-based render scheduling,
 * widget rendering throttling, and intersection observer for lazy widget
 * initialization.
 */

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Hook that throttles widget rendering using requestAnimationFrame.
 * Prevents multiple re-renders within the same animation frame.
 */
export function useThrottledWidgetRender<T>(data: T, renderInterval: number = 16) {
  const [renderedData, setRenderedData] = useState<T | null>(null);
  const lastRenderRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastRenderRef.current;

    if (elapsed >= renderInterval) {
      setRenderedData(data);
      lastRenderRef.current = now;
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setRenderedData(data);
        lastRenderRef.current = Date.now();
      });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [data, renderInterval]);

  return renderedData;
}

/**
 * Hook that lazily initializes widgets when they enter the viewport.
 * Uses IntersectionObserver with a root margin for pre-loading.
 */
export function useLazyWidgetInitialization(
  widgetId: string,
  onInitialize: (widgetId: string) => void,
  rootMargin: string = '200px',
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isInitialized) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInitialized(true);
            onInitialize(widgetId);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [widgetId, isInitialized, onInitialize, rootMargin]);

  return { containerRef, isInitialized };
}
