import type { SkeletonLineProps } from '../lib/skeleton-types';

const SHIMMER_CLASS = 'animate-shimmer';
const BASE_CLASSES = 'rounded-md block';

/**
 * SkeletonLine renders one or more horizontal bars representing text lines.
 *
 * Supports a `count` prop for multi-line text, a `widths` array for varying
 * line widths (e.g., [100%, 85%, 60%] to mimic natural text paragraph shapes),
 * and a configurable `gap` between lines.
 *
 * Usage:
 *   <SkeletonLine count={3} widths={['100%', '85%', '60%']} />
 *   <SkeletonLine count={1} width="w-3/4" />
 */
export function SkeletonLine({
  count = 1,
  widths,
  gap = 8,
  animated = true,
  className = '',
  ariaLabel,
}: SkeletonLineProps) {
  const shimmerClass = animated ? SHIMMER_CLASS : '';

  const lineElements = Array.from({ length: count }, (_, index) => {
    const lineWidth = widths?.[index] ?? '100%';
    const isLast = index === count - 1;
    // Make the last line shorter if widths not explicitly provided
    const effectiveWidth =
      !widths && isLast && count > 1 ? '60%' : lineWidth;

    return (
      <div
        key={index}
        className={`${BASE_CLASSES} ${shimmerClass} h-4 ${className}`}
        style={{
          width: effectiveWidth,
          marginBottom: isLast ? 0 : gap,
        }}
        role="presentation"
        aria-hidden="true"
      />
    );
  });

  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Loading text content'}
      aria-busy="true"
      className="flex flex-col"
    >
      {lineElements}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
