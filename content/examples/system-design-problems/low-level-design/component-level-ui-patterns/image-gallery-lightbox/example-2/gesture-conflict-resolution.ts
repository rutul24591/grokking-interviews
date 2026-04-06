/**
 * Touch Gesture Conflict Resolution — Disambiguates swipe vs zoom vs pan in lightbox.
 *
 * Interview edge case: User touches the image with two fingers. Is this a zoom gesture
 * or a scroll? The system must disambiguate based on: finger distance change (zoom),
 * finger movement direction (swipe), and current zoom level (pan).
 */

import { useRef, useCallback, useState } from 'react';

interface TouchState {
  initialDistance: number;
  initialCenter: { x: number; y: number };
  isZooming: boolean;
  isSwiping: boolean;
}

/**
 * Calculates the distance between two touch points.
 */
function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Hook that resolves gesture conflicts: two-finger pinch = zoom, one-finger swipe = navigate.
 * Uses a threshold-based approach: if finger distance changes >10%, it's zoom.
 */
export function useLightboxGestureures(
  onNext: () => void,
  onPrev: () => void,
  onZoom: (scale: number) => void,
  swipeThreshold: number = 50,
  zoomThreshold: number = 0.1,
) {
  const touchStateRef = useRef<TouchState | null>(null);
  const [scale, setScale] = useState(1);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two-finger gesture — potential zoom
      touchStateRef.current = {
        initialDistance: getTouchDistance(e.touches[0], e.touches[1]),
        initialCenter: {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        },
        isZooming: false,
        isSwiping: false,
      };
    } else if (e.touches.length === 1 && scale <= 1) {
      // One-finger gesture at normal scale — potential swipe
      touchStateRef.current = {
        initialDistance: 0,
        initialCenter: { x: e.touches[0].clientX, y: e.touches[0].clientY },
        isZooming: false,
        isSwiping: false,
      };
    }
  }, [scale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStateRef.current || e.touches.length === 0) return;

    const state = touchStateRef.current;

    if (e.touches.length === 2 && !state.isSwiping) {
      // Two-finger zoom
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const scaleChange = (currentDistance - state.initialDistance) / state.initialDistance;

      if (Math.abs(scaleChange) > zoomThreshold) {
        state.isZooming = true;
        const newScale = Math.max(1, Math.min(5, scale * (1 + scaleChange)));
        setScale(newScale);
        onZoom(newScale);
      }
    } else if (e.touches.length === 1 && !state.isZooming && scale <= 1) {
      // One-finger horizontal swipe
      const dx = e.touches[0].clientX - state.initialCenter.x;
      if (Math.abs(dx) > swipeThreshold) {
        state.isSwiping = true;
        if (dx > 0) onPrev();
        else onNext();
      }
    }
  }, [scale, swipeThreshold, zoomThreshold, onNext, onPrev, onZoom]);

  const onTouchEnd = useCallback(() => {
    touchStateRef.current = null;
  }, []);

  return { onTouchStart, onTouchMove, onTouchEnd, scale, setScale };
}
