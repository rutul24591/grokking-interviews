'use client';

import { useEffect, useMemo, useState } from 'react';
import { createRatingStore } from '../lib/rating-store';
import type { RatingConfig, RatingChangeHandler, RatingSize } from '../lib/rating-types';
import { DEFAULT_CONFIG, DEFAULT_COLORS } from '../lib/rating-types';
import { StarIcon } from './star-icon';
import { RatingLabel } from './rating-label';
import { useRatingInteractions } from '../hooks/use-rating-interactions';
import { useRatingAria } from '../hooks/use-rating-aria';

interface RatingStarsProps {
  /** Current rating value (controlled mode) */
  value?: number;
  /** Callback when rating changes */
  onChange?: RatingChangeHandler;
  /** Maximum rating value */
  max?: number;
  /** Star size variant */
  size?: RatingSize;
  /** Color customization */
  colors?: Partial<typeof DEFAULT_COLORS>;
  /** Whether the rating is read-only */
  readOnly?: boolean;
  /** Accessible label for screen readers */
  label?: string;
  /** Whether to show the text label below stars */
  showLabel?: boolean;
}

/**
 * Interactive rating component with half-star support,
 * keyboard navigation, hover preview, and full ARIA support.
 */
export function RatingStars({
  value: controlledValue,
  onChange,
  max = DEFAULT_CONFIG.max,
  size = DEFAULT_CONFIG.size,
  colors,
  readOnly = false,
  label,
  showLabel = true,
}: RatingStarsProps) {
  const [mounted, setMounted] = useState(false);

  // Create a scoped store for this instance
  const store = useMemo(() => {
    const config: RatingConfig = {
      max,
      size,
      colors: { ...DEFAULT_COLORS, ...colors },
      readOnly,
      label,
      value: controlledValue ?? 0,
    };
    return createRatingStore(config);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync controlled value into store
  useEffect(() => {
    if (controlledValue !== undefined) {
      store.getState().setValue(controlledValue);
    }
  }, [controlledValue, store]);

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read store state
  const storeValue = store((s) => s.value);
  const storeConfig = store((s) => s.config);

  const {
    handleMouseMove,
    handleMouseLeave,
    handleClick,
    handleKeyDown,
    displayValue,
  } = useRatingInteractions(store);

  const ariaAttrs = useRatingAria(
    readOnly ? storeValue : displayValue,
    max,
    label,
    readOnly
  );

  // Compute fill state for each star
  const stars = Array.from({ length: max }, (_, i) => {
    const starNumber = i + 1;
    let fillState: 'filled' | 'half' | 'empty';
    let fractionalFill: number | undefined;

    if (displayValue >= starNumber) {
      fillState = 'filled';
    } else if (displayValue > i) {
      fillState = 'half';
      // In interactive mode, half stars are always 0.5
      // In read-only mode, compute actual fractional amount
      fractionalFill = readOnly ? displayValue - i : 0.5;
    } else {
      fillState = 'empty';
    }

    return { index: i, fillState, fractionalFill };
  });

  // Notify parent of changes
  useEffect(() => {
    if (onChange && !readOnly) {
      onChange(storeValue);
    }
  }, [storeValue, onChange, readOnly]);

  const { filledColor, emptyColor, hover: hoverColor } = storeConfig.colors;

  if (!mounted) {
    // SSR: render read-only stars
    return (
      <div className="inline-flex flex-col items-start">
        <div className="flex items-center gap-0.5">
          {stars.map(({ index, fillState, fractionalFill }) => (
            <StarIcon
              key={index}
              index={index}
              fillState={fillState}
              fractionalFill={fractionalFill}
              size={size}
              filledColor={filledColor}
              emptyColor={emptyColor}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start">
      <div
        className="flex items-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-yellow-400 rounded"
        onKeyDown={handleKeyDown}
        {...ariaAttrs}
      >
        {stars.map(({ index, fillState, fractionalFill }) => {
          const isHovered = store.getState().hoverValue !== null &&
            store.getState().hoverValue! > index;

          return (
            <StarIcon
              key={index}
              index={index}
              fillState={fillState}
              fractionalFill={fractionalFill}
              size={size}
              filledColor={filledColor}
              emptyColor={emptyColor}
              hoverColor={hoverColor}
              isHovered={isHovered}
              onMouseMove={readOnly ? undefined : handleMouseMove}
              onMouseLeave={readOnly ? undefined : handleMouseLeave}
              onClick={readOnly ? undefined : handleClick}
            />
          );
        })}
      </div>
      {showLabel && (
        <RatingLabel
          value={readOnly ? storeValue : displayValue}
          max={max}
          customLabel={label}
        />
      )}
    </div>
  );
}
