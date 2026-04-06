import type { ComponentProps } from 'react';
import { SkeletonLine } from './skeleton-line';
import { SkeletonRect } from './skeleton-rect';
import { SkeletonCircle } from './skeleton-circle';
import type { SkeletonProps } from '../lib/skeleton-types';

const SHIMMER_CLASS = 'animate-shimmer';
const BASE_CLASS = 'rounded-md';

/**
 * Root Skeleton component that dispatches to type-specific sub-components.
 *
 * Usage:
 *   <Skeleton type="text" count={3} widths={['100%', '85%', '60%']} />
 *   <Skeleton type="image" width="w-full" height="h-48" radius={8} />
 *   <Skeleton type="avatar" size={48} />
 */
export function Skeleton({
  type,
  animated = true,
  className = '',
  ariaLabel,
  ...rest
}: SkeletonProps) {
  const shimmerClass = animated ? SHIMMER_CLASS : '';

  switch (type) {
    case 'text': {
      const { count = 1, widths, gap = 8 } = rest as ComponentProps<
        typeof SkeletonLine
      >;
      return (
        <SkeletonLine
          count={count}
          widths={widths}
          gap={gap}
          animated={animated}
          className={className}
          ariaLabel={ariaLabel}
        />
      );
    }
    case 'image': {
      const { width = 'w-full', height = 'h-48', radius = 8 } =
        rest as ComponentProps<typeof SkeletonRect>;
      return (
        <SkeletonRect
          width={width}
          height={height}
          radius={radius}
          animated={animated}
          className={`${shimmerClass} ${className}`}
          ariaLabel={ariaLabel}
        />
      );
    }
    case 'avatar': {
      const { size = 48 } = rest as ComponentProps<typeof SkeletonCircle>;
      return (
        <SkeletonCircle
          size={size}
          animated={animated}
          className={`${shimmerClass} ${className}`}
          ariaLabel={ariaLabel}
        />
      );
    }
    case 'custom': {
      const {
        width = 'w-full',
        height = 'h-24',
        radius = 8,
      } = rest as ComponentProps<typeof SkeletonRect>;
      return (
        <SkeletonRect
          width={width}
          height={height}
          radius={radius}
          animated={animated}
          className={`${shimmerClass} ${className}`}
          ariaLabel={ariaLabel}
        />
      );
    }
    default: {
      const _exhaustive: never = type;
      throw new Error(`Unknown skeleton type: ${_exhaustive}`);
    }
  }
}
