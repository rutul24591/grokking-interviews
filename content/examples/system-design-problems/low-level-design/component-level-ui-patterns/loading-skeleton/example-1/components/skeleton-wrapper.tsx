import { useState, useEffect, type ReactNode } from 'react';
import type { SkeletonWrapperProps } from '../lib/skeleton-types';

/**
 * SkeletonWrapper handles loading-state composition.
 *
 * When `loading` is true, it renders the skeleton children.
 * When `loading` is false, it renders the actual content children.
 *
 * Wraps output in a container with `aria-busy` set appropriately.
 *
 * Supports an optional `delay` prop that prevents skeleton flashing for
 * fast resolutions by only rendering skeletons if loading persists beyond
 * the delay threshold.
 *
 * Usage:
 *   <SkeletonWrapper loading={isLoading} ariaLabel="Loading user profile">
 *     <Skeleton type="avatar" size={48} />
 *     <Skeleton type="text" count={2} widths={['80%', '60%']} />
 *   </SkeletonWrapper>
 */
export function SkeletonWrapper({
  loading,
  skeleton,
  children,
  ariaLabel = 'Loading content',
  delay = 0,
  className = '',
}: SkeletonWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowSkeleton(false);
      return;
    }

    if (delay > 0) {
      const timer = window.setTimeout(() => {
        setShowSkeleton(true);
      }, delay);
      return () => window.clearTimeout(timer);
    }

    setShowSkeleton(true);
  }, [loading, delay]);

  if (!loading || !showSkeleton) {
    return (
      <div aria-busy="false" aria-label={ariaLabel} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      role="status"
      className={className}
    >
      {skeleton ?? children}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
