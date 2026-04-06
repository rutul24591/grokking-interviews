/**
 * Half-Star Detection — Determines 0.5 vs 1.0 fill based on mouse position.
 *
 * Interview edge case: User hovers on the left half of a star — should show
 * half-star fill. User hovers on the right half — should show full-star fill.
 * Must also handle touch (no hover) and keyboard (step increment).
 */

import { useCallback, useState } from 'react';

/**
 * Hook that computes fill state based on hover position within a star.
 */
export function useHalfStarDetection(
  maxStars: number = 5,
  step: 0.5 | 1 = 0.5,
) {
  const [value, setValue] = useState(0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  /**
   * Called on mouse move over a star element.
   * Calculates fill based on horizontal position within the star.
   */
  const onMouseMove = useCallback((e: React.MouseEvent, starIndex: number) => {
    if (step === 1) {
      setHoverValue(starIndex + 1);
      return;
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const ratio = relativeX / rect.width;

    // Left half = 0.5, right half = 1.0
    const fill = ratio < 0.5 ? 0.5 : 1.0;
    setHoverValue(starIndex + fill);
  }, [step]);

  /**
   * Called on click to commit the value.
   */
  const onClick = useCallback((starIndex: number) => {
    const newValue = hoverValue ?? starIndex + 1;
    setValue(newValue);
    setHoverValue(null);
  }, [hoverValue]);

  /**
   * Called on mouse leave to revert to committed value.
   */
  const onMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  /**
   * Keyboard handler: ArrowRight increments by step, ArrowLeft decrements.
   */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setValue((prev) => Math.min(maxStars, prev + step));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setValue((prev) => Math.max(0, prev - step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setValue(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setValue(maxStars);
    }
  }, [maxStars, step]);

  const displayValue = hoverValue ?? value;

  return { value, displayValue, onMouseMove, onClick, onMouseLeave, onKeyDown };
}
