import { useState, useEffect, useRef, useCallback } from 'react';
import { useAvatarStore } from '../lib/avatar-store';

interface UseAvatarImageReturn {
  isInView: boolean;
  isLoading: boolean;
  hasError: boolean;
  shouldAttemptLoad: boolean;
  retry: () => void;
  imageRef: (node: HTMLImageElement | null) => void;
}

/**
 * Custom hook for avatar image loading lifecycle.
 *
 * - Uses IntersectionObserver for lazy loading (50px rootMargin for preloading)
 * - Integrates with avatar store for error tracking and retry logic
 * - Returns isInView, isLoading, hasError, shouldAttemptLoad, retry, and imageRef
 */
export function useAvatarImage(
  src: string | undefined,
  onError?: (src: string) => void,
  onLoaded?: (src: string) => void,
): UseAvatarImageReturn {
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const elementRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getEntry = useAvatarStore((state) => state.getEntry);
  const markError = useAvatarStore((state) => state.markError);
  const markLoaded = useAvatarStore((state) => state.markLoaded);
  const requestRetry = useAvatarStore((state) => state.requestRetry);

  // Track mount status to prevent state updates on unmounted components
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Set up IntersectionObserver
  useEffect(() => {
    if (!src) {
      // No src means skip image loading entirely
      if (mountedRef.current) {
        setHasError(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (mountedRef.current) {
              setIsInView(true);
            }
            // Once triggered, disconnect — no need to keep observing
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }, // Start loading when within 50px of viewport
    );

    observerRef.current = observer;

    // We observe a sentinel element — the avatar container — which will be
    // passed via the imageRef callback. For simplicity, we trigger on mount
    // by observing the image element once it's attached.
    // In a shared-observer optimization, this would register with a module-level singleton.

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [src]);

  // Handle image load attempt when in view
  useEffect(() => {
    if (!src || !isInView) return;

    const entry = getEntry(src);

    // If already cached as loaded, skip loading state
    if (entry?.cacheStatus === 'loaded') {
      if (mountedRef.current) {
        setIsLoading(false);
        setHasError(false);
      }
      return;
    }

    // If cached as error with max retries, don't attempt
    if (entry?.cacheStatus === 'error' && entry.errorCount >= 3) {
      if (mountedRef.current) {
        setHasError(true);
        setIsLoading(false);
      }
      return;
    }

    // Attempt loading
    if (mountedRef.current) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, isInView, getEntry]);

  // Callback ref for the image element
  const imageRef = useCallback(
    (node: HTMLImageElement | null) => {
      elementRef.current = node;

      if (node && observerRef.current) {
        observerRef.current.observe(node);
      }
    },
    [],
  );

  // Retry function — called on hover over fallback
  const retry = useCallback(() => {
    if (!src) return;

    const allowed = requestRetry(src);
    if (allowed && mountedRef.current) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, requestRetry]);

  // Handlers for the img element
  const handleLoad = useCallback(() => {
    if (!src) return;
    if (!mountedRef.current) return;

    markLoaded(src);
    setIsLoading(false);
    setHasError(false);
    onLoaded?.(src);
  }, [src, markLoaded, onLoaded]);

  const handleError = useCallback(() => {
    if (!src) return;
    if (!mountedRef.current) return;

    markError(src);
    setIsLoading(false);
    setHasError(true);
    onError?.(src);
  }, [src, markError, onError]);

  // If no src, treat as error (skip to fallback)
  if (!src) {
    return {
      isInView: true,
      isLoading: false,
      hasError: true,
      shouldAttemptLoad: false,
      retry,
      imageRef,
    };
  }

  return {
    isInView,
    isLoading,
    hasError,
    shouldAttemptLoad: isInView && !hasError,
    retry,
    imageRef,
  };
}
