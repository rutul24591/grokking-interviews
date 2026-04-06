/**
 * Context Menu — Staff-Level Touch Device Adaptation.
 *
 * Staff differentiator: Adapts context menu for touch devices using
 * long-press detection, bottom sheet pattern for mobile, and
 * gesture-based dismissal.
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Hook that adapts context menu behavior for touch vs mouse devices.
 * Touch: long-press to open, bottom sheet pattern.
 * Mouse: right-click to open, positioned dropdown.
 */
export function useAdaptiveContextMenu(isTouchDevice: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const LONG_PRESS_DELAY = 500;

  /**
   * For mouse: right-click handler.
   * For touch: long-press start handler.
   */
  const onTriggerStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isTouchDevice && 'touches' in e) {
      // Touch: start long-press timer
      const touch = e.touches[0];
      longPressTimerRef.current = setTimeout(() => {
        setPosition({ x: touch.clientX, y: touch.clientY });
        setIsOpen(true);
      }, LONG_PRESS_DELAY);
    } else if (!isTouchDevice && 'button' in e) {
      // Mouse: right-click
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    }
  }, [isTouchDevice]);

  /**
   * Cancels long-press timer on touch move or touch end.
   */
  const onTriggerCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  /**
   * Closes the context menu.
   */
  const close = useCallback(() => {
    setIsOpen(false);
    onTriggerCancel();
  }, [onTriggerCancel]);

  return { isOpen, position, onTriggerStart, onTriggerCancel, close };
}
