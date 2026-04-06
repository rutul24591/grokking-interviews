import type { ReactNode } from 'react';

export type SkeletonType = 'text' | 'image' | 'avatar' | 'custom';

export interface BaseSkeletonProps {
  /** Width of the skeleton (CSS value, e.g. '100%', '200px', 'w-full') */
  width?: string;
  /** Height of the skeleton (CSS value, e.g. '16px', 'h-48') */
  height?: string;
  /** Whether the shimmer animation is enabled (default: true) */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
}

export interface SkeletonLineProps extends BaseSkeletonProps {
  /** Number of text lines to render (default: 1) */
  count?: number;
  /** Width of each line as a percentage or CSS value (default: ['100%']) */
  widths?: string[];
  /** Gap between lines in pixels (default: 8) */
  gap?: number;
}

export interface SkeletonRectProps extends BaseSkeletonProps {
  /** Border radius in pixels (default: 0) */
  radius?: number;
}

export interface SkeletonCircleProps extends BaseSkeletonProps {
  /** Diameter of the circle in pixels (default: 48) */
  size?: number;
}

export interface SkeletonCustomProps extends BaseSkeletonProps {
  /** Border radius for custom shapes (default: 8) */
  radius?: number;
}

export interface SkeletonProps extends BaseSkeletonProps {
  /** Type of skeleton to render */
  type: SkeletonType;
  /** Number of text lines (for type='text') */
  count?: number;
  /** Width of each line (for type='text') */
  widths?: string[];
  /** Border radius (for type='image' or type='custom') */
  radius?: number;
  /** Circle diameter (for type='avatar') */
  size?: number;
  /** Gap between text lines (for type='text') */
  gap?: number;
}

export interface SkeletonWrapperProps {
  /** Whether content is still loading */
  loading: boolean;
  /** Skeleton children to show while loading */
  skeleton?: ReactNode;
  /** Actual content to show when loaded */
  children: ReactNode;
  /** Accessibility label for the loading container */
  ariaLabel?: string;
  /** Delay in ms before showing skeleton (prevents flash on fast loads) */
  delay?: number;
  /** Additional CSS classes for the container */
  className?: string;
}
