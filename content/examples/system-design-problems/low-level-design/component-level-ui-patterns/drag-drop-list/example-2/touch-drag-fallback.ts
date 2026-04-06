/**
 * Touch Drag Fallback — Implements drag-and-drop for touch devices.
 *
 * Interview edge case: HTML5 Drag and Drop API doesn't work on touch devices.
 * Solution: use Pointer Events for unified mouse/touch support, with long-press
 * initiation for drag to distinguish from scroll.
 */

import { useRef, useCallback, useState } from 'react';

interface TouchDragState {
  isDragging: boolean;
  dragItemId: string | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * Hook that provides touch-compatible drag-and-drop.
 * Uses long-press (300ms) to initiate drag, preventing conflict with scroll.
 */
export function useTouchDrag(
  longPressDelay: number = 300,
  dragThreshold: number = 5,
) {
  const [state, setState] = useState<TouchDragState>({
    isDragging: false,
    dragItemId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  /**
   * Called on pointer down. Starts long-press timer.
   */
  const onPointerDown = useCallback((e: React.PointerEvent, itemId: string) => {
    if (e.pointerType === 'touch') {
      // Start long-press timer for touch devices
      longPressTimerRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isDragging: true,
          dragItemId: itemId,
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
        }));
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        pointerIdRef.current = e.pointerId;
      }, longPressDelay);
    } else {
      // Mouse devices — drag immediately
      setState((prev) => ({
        ...prev,
        isDragging: true,
        dragItemId: itemId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
      pointerIdRef.current = e.pointerId;
    }
  }, [longPressDelay]);

  /**
   * Called on pointer move. Updates drag position.
   */
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!state.isDragging || e.pointerId !== pointerIdRef.current) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    // Only start dragging if moved beyond threshold
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
      setState((prev) => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    }
  }, [state.isDragging, state.startX, state.startY, dragThreshold]);

  /**
   * Called on pointer up. Ends drag operation.
   */
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (state.isDragging) {
      setState((prev) => ({ ...prev, isDragging: false, dragItemId: null }));
    }
  }, [state.isDragging]);

  /**
   * Cancels long-press timer (called on scroll).
   */
  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return {
    state,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    cancelLongPress,
  };
}
