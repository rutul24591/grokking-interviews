import { useCallback } from 'react';
import type { SplitPaneOrientation } from '../lib/split-pane-types';

/**
 * Hook that returns a keyboard event handler for resize via Arrow keys.
 * When the divider is focused, Arrow keys resize by step increments.
 *
 * @param orientation - horizontal or vertical split
 * @param step - pixel increment per key press (default 10, 50 with Shift)
 * @param onResize - callback with delta in pixels (positive = pane1 grows)
 */
export function usePaneKeyboard(
  orientation: SplitPaneOrientation,
  step: number,
  onResize: (delta: number) => void,
) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isShift = e.shiftKey;
      const increment = isShift ? step * 5 : step; // 50px vs 10px

      let delta = 0;

      if (orientation === 'horizontal') {
        // Horizontal: Left shrinks pane1, Right grows pane1
        switch (e.key) {
          case 'ArrowLeft':
            delta = -increment;
            break;
          case 'ArrowRight':
            delta = increment;
            break;
          default:
            return; // not a resize key
        }
      } else {
        // Vertical: Up shrinks pane1, Down grows pane1
        switch (e.key) {
          case 'ArrowUp':
            delta = -increment;
            break;
          case 'ArrowDown':
            delta = increment;
            break;
          default:
            return; // not a Resize key
        }
      }

      e.preventDefault();
      onResize(delta);
    },
    [orientation, step, onResize],
  );

  return handleKeyDown;
}
