import { useCallback, useRef } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import { getHoverFillValue, computeHoverValue } from '../lib/hover-position';

interface RatingStoreState {
  value: number;
  hoverValue: number | null;
  config: { max: number; readOnly: boolean };
  setValue: (value: number) => void;
  setHover: (value: number | null) => void;
}

/**
 * Hook that wires up mouse and keyboard interactions for the rating component.
 *
 * Returns handlers to attach to star elements and the computed effective display value.
 */
export function useRatingInteractions(
  store: UseBoundStore<StoreApi<RatingStoreState>>
) {
  const lastHoverRef = useRef<number | null>(null);

  const value = store((s) => s.value);
  const hoverValue = store((s) => s.hoverValue);
  const max = store((s) => s.config.max);
  const readOnly = store((s) => s.config.readOnly);
  const setValue = store((s) => s.setValue);
  const setHover = store((s) => s.setHover);

  /**
   * Mouse move handler — computes hover value only when it actually changes.
   */
  const handleMouseMove = useCallback(
    (starIndex: number, e: React.MouseEvent<SVGElement>) => {
      if (readOnly) return;

      const fillValue = getHoverFillValue(e.clientX, e.currentTarget);
      const newHover = computeHoverValue(starIndex, fillValue);

      // Only update if the hover value actually changed (prevents excessive re-renders)
      if (newHover !== lastHoverRef.current) {
        lastHoverRef.current = newHover;
        setHover(newHover);
      }
    },
    [readOnly, setHover]
  );

  /**
   * Mouse leave handler — clears hover preview.
   */
  const handleMouseLeave = useCallback(() => {
    if (readOnly) return;
    lastHoverRef.current = null;
    setHover(null);
  }, [readOnly, setHover]);

  /**
   * Click handler — commits the current hover value to the selected rating.
   */
  const handleClick = useCallback(
    (starIndex: number, e: React.MouseEvent<SVGElement>) => {
      if (readOnly) return;

      const fillValue = getHoverFillValue(e.clientX, e.currentTarget);
      const newValue = computeHoverValue(starIndex, fillValue);
      setValue(newValue);
    },
    [readOnly, setValue]
  );

  /**
   * Keyboard handler for the rating container.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (readOnly) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          setValue(value + 0.5);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          setValue(value - 0.5);
          break;
        case 'Home':
          e.preventDefault();
          setValue(0);
          break;
        case 'End':
          e.preventDefault();
          setValue(max);
          break;
      }
    },
    [readOnly, value, max, setValue]
  );

  // Effective display value: hover value if actively hovering, otherwise selected value
  const displayValue = hoverValue !== null ? hoverValue : value;

  return {
    handleMouseMove,
    handleMouseLeave,
    handleClick,
    handleKeyDown,
    displayValue,
  };
}
