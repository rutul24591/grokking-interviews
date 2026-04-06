'use client';

import { StarIcon } from './star-icon';
import { RatingLabel } from './rating-label';
import type { RatingSize } from '../lib/rating-types';

interface RatingDisplayProps {
  value: number;
  max?: number;
  size?: RatingSize;
  filledColor?: string;
  emptyColor?: string;
  showLabel?: boolean;
  label?: string;
}

/**
 * Read-only fractional rating display.
 * Renders stars without interaction handlers.
 * Supports arbitrary fractional values (e.g., 3.7).
 */
export function RatingDisplay({
  value,
  max = 5,
  size = 'md',
  filledColor = '#f59e0b',
  emptyColor = '#d1d5db',
  showLabel = true,
  label,
}: RatingDisplayProps) {
  const clampedValue = Math.min(Math.max(0, value), max);

  return (
    <div className="inline-flex flex-col items-start" aria-label={label ?? 'Rating'}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`${clampedValue} out of ${max} stars`}>
        {Array.from({ length: max }, (_, i) => {
          const starNumber = i + 1;

          if (clampedValue >= starNumber) {
            // Full star
            return (
              <StarIcon
                key={i}
                index={i}
                fillState="filled"
                size={size}
                filledColor={filledColor}
                emptyColor={emptyColor}
              />
            );
          }

          if (clampedValue > i) {
            // Partial star — compute fractional fill
            const fractionalFill = clampedValue - i;
            return (
              <StarIcon
                key={i}
                index={i}
                fillState="half"
                fractionalFill={fractionalFill}
                size={size}
                filledColor={filledColor}
                emptyColor={emptyColor}
              />
            );
          }

          // Empty star
          return (
            <StarIcon
              key={i}
              index={i}
              fillState="empty"
              size={size}
              filledColor={filledColor}
              emptyColor={emptyColor}
            />
          );
        })}
      </div>
      {showLabel && (
        <RatingLabel value={clampedValue} max={max} customLabel={label} />
      )}
    </div>
  );
}
