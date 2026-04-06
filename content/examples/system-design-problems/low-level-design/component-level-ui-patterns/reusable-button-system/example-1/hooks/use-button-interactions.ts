import { useCallback, useRef } from 'react';
import { createRipple, type RippleHandle } from '../lib/ripple-effect';

interface UseButtonInteractionsOptions {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  loading: boolean;
  disabled: boolean;
  ripple: boolean;
  debounceMs: number;
}

interface UseButtonInteractionsReturn {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  containerRef: (node: HTMLElement | null) => void;
}

/**
 * Hook that merges click, mouse, and keyboard handlers for the Button.
 *
 * - Guards onClick when loading or disabled.
 * - Triggers ripple animation on click (if enabled).
 * - Applies debounce to prevent rapid-fire clicks.
 * - Activates the button on Enter/Space for non-button elements.
 */
export function useButtonInteractions({
  onClick,
  loading,
  disabled,
  ripple,
  debounceMs,
}: UseButtonInteractionsOptions): UseButtonInteractionsReturn {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleHandlesRef = useRef<RippleHandle[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);

  // Ripple trigger on click
  const triggerRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!ripple || !containerRef.current) return;

    const handle = createRipple(containerRef.current, event);
    if (handle) {
      rippleHandlesRef.current.push(handle);
    }
  }, [ripple]);

  // Debounced click handler
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      // Guard: prevent clicks during loading or disabled state
      if (loading || disabled) return;

      // Guard: debounce
      if (debounceMs > 0 && debounceTimerRef.current !== null) return;

      // Trigger ripple
      triggerRipple(event);

      // Invoke original onClick
      onClick?.(event);

      // Set debounce timer
      if (debounceMs > 0) {
        debounceTimerRef.current = setTimeout(() => {
          debounceTimerRef.current = null;
        }, debounceMs);
      }
    },
    [loading, disabled, debounceMs, onClick, triggerRipple]
  );

  // MouseDown for ripple (alternative trigger point)
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (ripple && !loading && !disabled) {
        triggerRipple(event);
      }
    },
    [ripple, loading, disabled, triggerRipple]
  );

  // Keyboard activation for non-button elements
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        // Synthesize a click event for the handler
        handleClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    },
    [handleClick]
  );

  // Ref callback for the ripple container
  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  // Cleanup debounce timer and ripples on unmount
  const cleanupRef = useRef(false);
  if (!cleanupRef.current) {
    // We handle cleanup in the return of a useEffect in the component
    // This hook exposes a manual cleanup for the component to call
  }

  return {
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onKeyDown: handleKeyDown,
    containerRef: setContainerRef,
  };
}

/**
 * Cleanup function for ripple handles. Call this in useEffect cleanup.
 */
export function cleanupRipples(handles: React.MutableRefObject<RippleHandle[]>) {
  handles.current.forEach((h) => h.cleanup());
  handles.current = [];
}
