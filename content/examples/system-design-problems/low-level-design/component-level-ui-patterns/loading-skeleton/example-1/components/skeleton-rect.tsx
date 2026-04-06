import type { SkeletonRectProps } from '../lib/skeleton-types';

const BASE_CLASSES = 'block';

/**
 * SkeletonRect renders a rectangular placeholder for images, cards, or banners.
 *
 * Supports configurable width, height, and border-radius. The shimmer animation
 * sweeps across the rectangle via the `animate-shimmer` CSS class.
 *
 * Usage:
 *   <SkeletonRect width="w-full" height="h-48" radius={8} />
 *   <SkeletonRect width="w-64" height="h-32" radius={4} />
 */
export function SkeletonRect({
  width = 'w-full',
  height = 'h-48',
  radius = 0,
  animated = true,
  className = '',
  ariaLabel,
}: SkeletonRectProps) {
  const shimmerClass = animated ? 'animate-shimmer' : '';

  // Tailwind width/height classes or arbitrary values
  const isTailwindClass = (val: string) =>
    val.startsWith('w-') || val.startsWith('h-');

  const widthStyle = isTailwindClass(width) ? undefined : { width };
  const heightStyle = isTailwindClass(height) ? undefined : { height };

  const widthClass = isTailwindClass(width) ? width : '';
  const heightClass = isTailwindClass(height) ? height : '';

  return (
    <div
      className={`${BASE_CLASSES} ${shimmerClass} ${widthClass} ${heightClass} ${className}`}
      style={{
        ...widthStyle,
        ...heightStyle,
        borderRadius: radius,
      }}
      role="status"
      aria-label={ariaLabel ?? 'Loading image'}
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
