/**
 * Touch Gesture Conflicts: Swipe vs Zoom vs Pan Disambiguation,
 * Gesture Priority, Pinch-to-Zoom with Two-Finger Pan
 *
 * EDGE CASE: In an image gallery lightbox, multiple touch gestures compete:
 * - Single-finger swipe → navigate to next/prev image
 * - Pinch (two-finger) → zoom in/out
 * - Two-finger pan → pan around a zoomed image
 * - Single-finger tap → toggle UI chrome (show/hide controls)
 * - Double-tap → zoom to fit / zoom out
 *
 * The problem: these gestures share the same touch surface and can conflict.
 * A pinch gesture might start as a two-finger tap. A swipe might be confused
 * with a pan. The browser's native scroll might interfere.
 *
 * SOLUTION: Implement a gesture state machine with priority levels:
 * 1. Gesture starts → detect intent (number of pointers, initial movement)
 * 2. Once a gesture is "locked in," ignore competing gestures
 * 3. On gesture end, reset to detection state
 *
 * INTERVIEW FOLLOW-UP: "How do you distinguish a swipe from a pan?"
 * "What happens when the user pinches while swiping?"
 */

import { useState, useRef, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

type GestureType =
  | "none"
  | "detecting"
  | "tap"
  | "double-tap"
  | "swipe"
  | "pinch-zoom"
  | "two-finger-pan";

interface GestureState {
  /** Current active gesture */
  activeGesture: GestureType;
  /** Number of active touch pointers */
  pointerCount: number;
  /** Distance between two pointers (for pinch) */
  pinchDistance: number;
  /** Total movement since gesture start (for swipe detection) */
  totalMovement: number;
  /** Direction of movement (for swipe: "left" | "right" | "up" | "down") */
  movementDirection: string | null;
  /** Whether the current gesture is locked in (no longer competing) */
  isLocked: boolean;
}

interface GestureCallbacks {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinchZoom?: (scale: number) => void;
  onTwoFingerPan?: (deltaX: number, deltaY: number) => void;
}

interface UseTouchGesturesOptions {
  /** Minimum distance (px) to consider a movement a swipe */
  swipeThreshold?: number;
  /** Maximum distance (px) for a tap (beyond this = swipe) */
  tapThreshold?: number;
  /** Max time (ms) between taps for double-tap detection */
  doubleTapWindowMs?: number;
  /** Minimum pinch distance change (px) before firing onPinchZoom */
  pinchThreshold?: number;
  /** Current zoom level (0-1, where 1 = not zoomed) */
  zoomLevel?: number;
  /** Callbacks for gesture events */
  callbacks?: GestureCallbacks;
}

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/** Calculate distance between two touch points */
function getDistance(
  touch1: React.Touch | Touch,
  touch2: React.Touch | Touch
): number {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Calculate the midpoint between two touch points */
function getMidpoint(
  touch1: React.Touch | Touch,
  touch2: React.Touch | Touch
): { clientX: number; clientY: number } {
  return {
    clientX: (touch1.clientX + touch2.clientX) / 2,
    clientY: (touch1.clientY + touch2.clientY) / 2,
  };
}

/** Determine the dominant direction of movement */
function getMovementDirection(
  deltaX: number,
  deltaY: number
): "left" | "right" | "up" | "down" | null {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX < 5 && absY < 5) return null; // Too small to determine

  if (absX > absY) {
    return deltaX > 0 ? "right" : "left";
  }
  return deltaY > 0 ? "down" : "up";
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages touch gesture disambiguation for image galleries.
 *
 * Gesture detection pipeline:
 *
 * 1. onTouchStart → record initial positions, set state to "detecting"
 * 2. onTouchMove → analyze movement patterns:
 *    - 1 pointer + horizontal movement > threshold → "swipe" (locked)
 *    - 1 pointer + minimal movement → "tap" (not locked until touchend)
 *    - 2 pointers + distance changing → "pinch-zoom" (locked)
 *    - 2 pointers + distance stable + movement → "two-finger-pan" (locked)
 * 3. onTouchEnd → fire the appropriate callback, reset to "none"
 *
 * Key insight: once a gesture is LOCKED, competing gestures are ignored
 * until the current gesture ends. This prevents a swipe from becoming
 * a pan mid-gesture.
 */
export function useTouchGestures({
  swipeThreshold = 50,
  tapThreshold = 10,
  doubleTapWindowMs = 300,
  pinchThreshold = 10,
  zoomLevel = 1,
  callbacks = {},
}: UseTouchGesturesOptions = {}) {
  const [gestureState, setGestureState] = useState<GestureState>({
    activeGesture: "none",
    pointerCount: 0,
    pinchDistance: 0,
    totalMovement: 0,
    movementDirection: null,
    isLocked: false,
  });

  // Refs for tracking gesture state across events (avoid stale closures)
  const stateRef = useRef<GestureState>(gestureState);
  const startPointersRef = useRef<React.TouchList | null>(null);
  const startPinchDistanceRef = useRef<number>(0);
  const lastPinchDistanceRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const elementRef = useRef<HTMLElement | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    stateRef.current = gestureState;
  }, [gestureState]);

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const touches = event.touches;

      if (touches.length === 1 && stateRef.current.activeGesture === "none") {
        // Single touch starting — could be tap or swipe
        startPointersRef.current = touches;
        setGestureState({
          activeGesture: "detecting",
          pointerCount: 1,
          pinchDistance: 0,
          totalMovement: 0,
          movementDirection: null,
          isLocked: false,
        });
      } else if (
        touches.length === 2 &&
        stateRef.current.activeGesture === "none"
      ) {
        // Two-finger touch — could be pinch or two-finger pan
        startPointersRef.current = touches;
        const initialDistance = getDistance(touches[0], touches[1]);
        startPinchDistanceRef.current = initialDistance;
        lastPinchDistanceRef.current = initialDistance;

        setGestureState({
          activeGesture: "detecting",
          pointerCount: 2,
          pinchDistance: initialDistance,
          totalMovement: 0,
          movementDirection: null,
          isLocked: false,
        });
      }
    },
    []
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const current = stateRef.current;
      if (current.activeGesture === "none") return;

      const touches = event.touches;

      // Prevent default to stop browser scrolling
      if (current.pointerCount >= 1) {
        event.preventDefault();
      }

      if (current.pointerCount === 1 && touches.length === 1) {
        // Single pointer — determine swipe vs tap
        const startTouch = startPointersRef.current?.[0];
        if (!startTouch) return;

        const deltaX = touches[0].clientX - startTouch.clientX;
        const deltaY = touches[0].clientY - startTouch.clientY;
        const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const direction = getMovementDirection(deltaX, deltaY);

        if (!current.isLocked && movement > tapThreshold) {
          // Past tap threshold — could be a swipe
          if (movement > swipeThreshold) {
            // Locked in as swipe
            setGestureState({
              ...current,
              activeGesture: "swipe",
              totalMovement: movement,
              movementDirection: direction,
              isLocked: true,
            });
          } else {
            // Still in detection zone
            setGestureState({
              ...current,
              totalMovement: movement,
              movementDirection: direction,
            });
          }
        } else if (current.isLocked && current.activeGesture === "swipe") {
          setGestureState({
            ...current,
            totalMovement: movement,
            movementDirection: direction,
          });
        }
      } else if (current.pointerCount === 2 && touches.length === 2) {
        // Two pointers — determine pinch vs two-finger pan
        const currentDistance = getDistance(touches[0], touches[1]);
        const distanceDelta = Math.abs(
          currentDistance - startPinchDistanceRef.current
        );

        if (!current.isLocked) {
          if (distanceDelta > pinchThreshold) {
            // Locked in as pinch-zoom
            setGestureState({
              ...current,
              activeGesture: "pinch-zoom",
              pinchDistance: currentDistance,
              isLocked: true,
            });
            lastPinchDistanceRef.current = currentDistance;

            const scale = currentDistance / startPinchDistanceRef.current;
            callbacks.onPinchZoom?.(scale);
          } else if (distanceDelta <= pinchThreshold) {
            // Check for movement (two-finger pan)
            const startMidpoint = getMidpoint(
              startPointersRef.current![0],
              startPointersRef.current![1]
            );
            const currentMidpoint = getMidpoint(touches[0], touches[1]);
            const panDeltaX = currentMidpoint.clientX - startMidpoint.clientX;
            const panDeltaY = currentMidpoint.clientY - startMidpoint.clientY;
            const panDistance = Math.sqrt(
              panDeltaX * panDeltaX + panDeltaY * panDeltaY
            );

            if (panDistance > tapThreshold) {
              // Locked in as two-finger pan
              setGestureState({
                ...current,
                activeGesture: "two-finger-pan",
                totalMovement: panDistance,
                isLocked: true,
              });
              callbacks.onTwoFingerPan?.(panDeltaX, panDeltaY);
            }
          }
        } else if (current.isLocked && current.activeGesture === "pinch-zoom") {
          const scale = currentDistance / startPinchDistanceRef.current;
          callbacks.onPinchZoom?.(scale);
          lastPinchDistanceRef.current = currentDistance;
          setGestureState({ ...current, pinchDistance: currentDistance });
        } else if (current.isLocked && current.activeGesture === "two-finger-pan") {
          const startMidpoint = getMidpoint(
            startPointersRef.current![0],
            startPointersRef.current![1]
          );
          const currentMidpoint = getMidpoint(touches[0], touches[1]);
          callbacks.onTwoFingerPan?.(
            currentMidpoint.clientX - startMidpoint.clientX,
            currentMidpoint.clientY - startMidpoint.clientY
          );
        }
      }
    },
    [swipeThreshold, tapThreshold, pinchThreshold, callbacks]
  );

  const onTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const current = stateRef.current;

      if (current.activeGesture === "detecting" && current.pointerCount === 1) {
        // Single finger, minimal movement → tap
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTimeRef.current;

        if (timeSinceLastTap < doubleTapWindowMs) {
          // Double tap detected
          callbacks.onDoubleTap?.();
          lastTapTimeRef.current = 0;
        } else {
          callbacks.onTap?.();
          lastTapTimeRef.current = now;
        }
      } else if (current.activeGesture === "swipe") {
        if (current.movementDirection === "left") {
          callbacks.onSwipeLeft?.();
        } else if (current.movementDirection === "right") {
          callbacks.onSwipeRight?.();
        }
      }

      // Reset gesture state
      setGestureState({
        activeGesture: "none",
        pointerCount: 0,
        pinchDistance: 0,
        totalMovement: 0,
        movementDirection: null,
        isLocked: false,
      });
      startPointersRef.current = null;
    },
    [doubleTapWindowMs, callbacks]
  );

  return {
    gestureState,
    ref: elementRef,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
