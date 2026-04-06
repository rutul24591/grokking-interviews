'use client';
import { useRef, useCallback, useEffect, useState } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  momentum?: boolean;
  directionLock?: boolean;
  disabled?: boolean;
}

interface SwipeState {
  isSwiping: boolean;
  deltaX: number;
  deltaY: number;
  velocity: number;
  direction: 'left' | 'right' | null;
}

interface UseSwipeReturn {
  state: SwipeState;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
}

/**
 * Hook for touch/mouse swipe detection with momentum tracking,
 * configurable threshold, and optional direction locking.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  momentum = true,
  directionLock = true,
  disabled = false,
}: UseSwipeOptions = {}): UseSwipeReturn {
  const [state, setState] = useState<SwipeState>({
    isSwiping: false,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null,
  });

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      isSwipingRef.current = false;
      directionLockedRef.current = null;

      // Capture pointer for reliable move/up events outside element
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture not supported in some environments
      }
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current || disabled) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Direction lock: once we determine the primary axis, ignore the other
      if (directionLock && directionLockedRef.current === null && absDx > 5 && absDy > 5) {
        directionLockedRef.current = absDx > absDy ? 'horizontal' : 'vertical';
      }

      // Only process horizontal swipes when locked
      if (directionLock && directionLockedRef.current === 'vertical') return;
      if (directionLock && directionLockedRef.current === null && absDy > absDx && absDy > 5) return;

      const now = performance.now();
      const lastPos = lastPosRef.current;
      let velocity = 0;

      if (momentum && lastPos) {
        const dt = now - lastPos.time;
        if (dt > 0) {
          const dxSinceLast = e.clientX - lastPos.x;
          velocity = Math.abs(dxSinceLast) / dt; // pixels per ms
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      isSwipingRef.current = absDx > 5;

      const direction: 'left' | 'right' | null =
        absDx > threshold ? (dx < 0 ? 'left' : 'right') : null;

      setState({
        isSwiping: isSwipingRef.current,
        deltaX: dx,
        deltaY: dy,
        velocity,
        direction,
      });
    },
    [disabled, momentum, directionLock, threshold]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current || disabled) return;

      const dx = e.clientX - startPosRef.current.x;
      const absDx = Math.abs(dx);

      // Fire swipe callbacks if threshold exceeded
      if (absDx >= threshold) {
        if (dx < 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }

      startPosRef.current = null;
      lastPosRef.current = null;
      isSwipingRef.current = false;
      directionLockedRef.current = null;

      setState({
        isSwiping: false,
        deltaX: 0,
        deltaY: 0,
        velocity: 0,
        direction: null,
      });
    },
    [disabled, threshold, onSwipeLeft, onSwipeRight]
  );

  const handlePointerCancel = useCallback(() => {
    startPosRef.current = null;
    lastPosRef.current = null;
    isSwipingRef.current = false;
    directionLockedRef.current = null;

    setState({
      isSwiping: false,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null,
    });
  }, []);

  return {
    state,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
