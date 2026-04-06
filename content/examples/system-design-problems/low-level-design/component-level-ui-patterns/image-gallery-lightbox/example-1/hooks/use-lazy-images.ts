import { useEffect, useRef, useState, useCallback } from 'react';

interface LazyImageState {
  isVisible: boolean;
  isLoaded: boolean;
  hasError: boolean;
}

/**
 * IntersectionObserver-based lazy loading hook for gallery images.
 *
 * Manages a Map of element refs to their visibility state.
 * When an image enters the viewport, triggers the actual
 * image fetch. Supports rootMargin for preloading images
 * just before they become visible.
 *
 * @param rootMargin - Margin around the root element (default: '200px')
 * @returns A callback ref and the lazy loading state
 */
export function useLazyImage(rootMargin: string = '200px') {
  const [state, setState] = useState<LazyImageState>({
    isVisible: false,
    isLoaded: false,
    hasError: false,
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) {
        elementRef.current = null;
        return;
      }

      elementRef.current = node;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setState((prev) => ({ ...prev, isVisible: true }));
            // Once visible, stop observing — we only need to know once
            observerRef.current?.disconnect();
          }
        },
        { rootMargin }
      );

      observerRef.current.observe(node);
    },
    [rootMargin]
  );

  const markLoaded = useCallback(() => {
    setState((prev) => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  const markError = useCallback(() => {
    setState((prev) => ({ ...prev, hasError: true }));
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    ref: callbackRef,
    isVisible: state.isVisible,
    isLoaded: state.isLoaded,
    hasError: state.hasError,
    markLoaded,
    markError,
  };
}

/**
 * Hook for managing a batch of lazy images (e.g., the gallery grid).
 *
 * @param count - Total number of images
 * @param rootMargin - Margin around the root element
 * @returns An array of refs and visibility states
 */
export function useLazyImageBatch(
  count: number,
  rootMargin: string = '200px'
) {
  const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-image-index'));
          if (entry.isIntersecting && !isNaN(index)) {
            setVisibleIndices((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });
            // Disconnect after visible — one-shot observation
            observersRef.current.get(index)?.disconnect();
            observersRef.current.delete(index);
          }
        });
      },
      { rootMargin }
    );

    // Observe all image cards
    for (let i = 0; i < count; i++) {
      const element = document.querySelector<HTMLElement>(
        `[data-image-index="${i}"]`
      );
      if (element) {
        observer.observe(element);
        observersRef.current.set(i, observer);
      }
    }

    return () => {
      observer.disconnect();
      observersRef.current.clear();
    };
  }, [count, rootMargin]);

  return { visibleIndices };
}
