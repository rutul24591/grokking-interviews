/**
 * Resizable Split Pane — Handles keyboard resize with boundary constraints.
 *
 * Interview edge case: User focuses the divider and presses ArrowRight to increase
 * the first panel. If the first panel is already at max width, the resize should
 * stop. If the user presses ArrowLeft when at min width, it should also stop.
 */

import { useState, useCallback } from 'react';

interface SplitPaneKeyboardConfig {
  minFirst: number;
  maxFirst: number;
  step: number;
  containerSize: number;
}

/**
 * Hook that manages keyboard-based resize of a split pane.
 */
export function useSplitPaneKeyboardResize(config: SplitPaneKeyboardConfig) {
  const [dividerPosition, setDividerPosition] = useState(
    Math.max(config.minFirst, Math.min(config.maxFirst, config.containerSize / 2)),
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newPosition = dividerPosition;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newPosition = dividerPosition - (e.shiftKey ? config.step * 5 : config.step);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      newPosition = dividerPosition + (e.shiftKey ? config.step * 5 : config.step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      newPosition = config.minFirst;
    } else if (e.key === 'End') {
      e.preventDefault();
      newPosition = config.maxFirst;
    } else {
      return;
    }

    // Enforce boundaries
    newPosition = Math.max(config.minFirst, Math.min(config.maxFirst, newPosition));
    setDividerPosition(newPosition);
  }, [dividerPosition, config]);

  return { dividerPosition, setDividerPosition, onKeyDown };
}
