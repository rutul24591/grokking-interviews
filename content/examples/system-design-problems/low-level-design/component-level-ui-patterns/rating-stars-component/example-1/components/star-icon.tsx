'use client';

import { STAR_PATH, HALF_CLIP_RECT, clipPathId } from '../lib/star-path-data';
import type { RatingSize } from '../lib/rating-types';
import { SIZE_MAP } from '../lib/rating-types';

interface StarIconProps {
  index: number;
  fillState: 'filled' | 'half' | 'empty';
  /** Fractional fill amount (0-1). Only used for half state in read-only mode. */
  fractionalFill?: number;
  size: RatingSize;
  filledColor: string;
  emptyColor: string;
  hoverColor?: string;
  isHovered?: boolean;
  onMouseMove?: (index: number, e: React.MouseEvent<SVGElement>) => void;
  onMouseLeave?: () => void;
  onClick?: (index: number, e: React.MouseEvent<SVGElement>) => void;
}

const sizeToPixels: Record<RatingSize, number> = SIZE_MAP;

export function StarIcon({
  index,
  fillState,
  fractionalFill,
  size,
  filledColor,
  emptyColor,
  hoverColor,
  isHovered,
  onMouseMove,
  onMouseLeave,
  onClick,
}: StarIconProps) {
  const pixelSize = sizeToPixels[size];
  const id = clipPathId(index);

  // Determine colors
  const fillColor = isHovered ? (hoverColor ?? filledColor) : filledColor;
  const baseColor = isHovered ? (hoverColor ?? filledColor) : emptyColor;

  const handlers = {
    onMouseMove: onMouseMove ? (e: React.MouseEvent<SVGElement>) => onMouseMove(index, e) : undefined,
    onMouseLeave: onMouseLeave,
    onClick: onClick ? (e: React.MouseEvent<SVGElement>) => onClick(index, e) : undefined,
  };

  if (fillState === 'empty') {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={baseColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="transition-colors duration-150 ease-out cursor-pointer"
        {...handlers}
      >
        <path d={STAR_PATH} />
      </svg>
    );
  }

  if (fillState === 'half') {
    // For read-only fractional display, use dynamic clip width
    const clipWidth = fractionalFill !== undefined
      ? 24 * fractionalFill
      : HALF_CLIP_RECT.width;

    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        className="relative transition-colors duration-150 ease-out cursor-pointer"
        {...handlers}
      >
        <defs>
          <clipPath id={id}>
            <rect
              x="0"
              y="0"
              width={clipWidth}
              height="24"
            />
          </clipPath>
        </defs>
        {/* Empty star background */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke={emptyColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Filled star clipped to fraction */}
        <path
          d={STAR_PATH}
          fill={fillColor}
          stroke="none"
          clipPath={`url(#${id})`}
        />
      </svg>
    );
  }

  // Fully filled
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill={fillColor}
      stroke="none"
      className="transition-colors duration-150 ease-out cursor-pointer"
      {...handlers}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}
