import { Children, isValidElement, cloneElement } from 'react';
import type { ReactNode } from 'react';
import { AVATAR_SIZE_PX, type AvatarSize } from '../../lib/avatar-types';

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
  overflowLabel?: string;
}

// Negative margin values for overlap effect (relative to avatar size)
const OVERLAP_MARGIN: Record<AvatarSize, string> = {
  xs: '-ml-1',
  sm: '-ml-1.5',
  md: '-ml-2',
  lg: '-ml-2.5',
  xl: '-ml-3',
};

// Padding for the first avatar (to counteract the negative margin)
const FIRST_CHILD_PADDING: Record<AvatarSize, string> = {
  xs: 'ml-0',
  sm: 'ml-0',
  md: 'ml-0',
  lg: 'ml-0',
  xl: 'ml-0',
};

// Overflow badge text size
const BADGE_TEXT_SIZE: Record<AvatarSize, string> = {
  xs: 'text-[8px]',
  sm: 'text-[9px]',
  md: 'text-[10px]',
  lg: 'text-xs',
  xl: 'text-sm',
};

/**
 * AvatarGroup renders an overlapping stack of avatars with an overflow badge.
 *
 * - Caps visible children at `max` (default: 4)
 * - Renders "+N more" badge for remaining children
 * - Uses negative margin for overlap effect
 * - The badge matches the avatar size for visual consistency
 */
export default function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className = '',
  overflowLabel,
}: AvatarGroupProps) {
  const childArray = Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = Math.max(0, childArray.length - max);
  const px = AVATAR_SIZE_PX[size];
  const overlapClass = OVERLAP_MARGIN[size];
  const badgeTextClass = BADGE_TEXT_SIZE[size];

  return (
    <div className={`flex items-center ${className}`} role="group" aria-label="Avatar group">
      {visibleChildren.map((child, index) => {
        if (!isValidElement(child)) return child;

        // Apply negative margin to all except the first child
        const marginClass = index === 0 ? FIRST_CHILD_PADDING[size] : overlapClass;

        return cloneElement(child, {
          ...child.props,
          className: `${marginClass} ${child.props.className || ''}`,
          key: child.key ?? index,
        });
      })}

      {remainingCount > 0 && (
        <div
          className={`${FIRST_CHILD_PADDING[size]} ${overlapClass} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-900`}
          style={{ width: px, height: px }}
          aria-label={`${remainingCount} more ${remainingCount === 1 ? 'person' : 'people'}`}
        >
          <span className={badgeTextClass}>
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
