import type { SkeletonCircleProps } from '../lib/skeleton-types';

/**
 * SkeletonCircle renders a circular placeholder for avatars, profile photos,
 * or circular icons.
 *
 * Uses border-radius: 50% and a configurable size (defaults to 48px, matching
 * common avatar sizes in design systems).
 *
 * Usage:
 *   <SkeletonCircle size={48} />
 *   <SkeletonCircle size={96} />
 */
export function SkeletonCircle({
  size = 48,
  animated = true,
  className = '',
  ariaLabel,
}: SkeletonCircleProps) {
  const shimmerClass = animated ? 'animate-shimmer' : '';

  return (
    <div
      className={`${shimmerClass} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
      }}
      role="status"
      aria-label={ariaLabel ?? 'Loading avatar'}
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
