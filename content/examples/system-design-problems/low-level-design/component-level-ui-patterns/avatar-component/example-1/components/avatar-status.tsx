import { useAvatarStatus } from '../../hooks/use-avatar-status';
import type { UserStatus, AvatarSize } from '../../lib/avatar-types';

interface AvatarStatusProps {
  status: UserStatus;
  size: AvatarSize;
}

// Status dot size relative to avatar size
const STATUS_DOT_SIZE: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
};

// Border width for the white ring around the status dot
const STATUS_BORDER: Record<AvatarSize, number> = {
  xs: 1,
  sm: 1.5,
  md: 2,
  lg: 2,
  xl: 2.5,
};

/**
 * AvatarStatus renders a colored dot at the bottom-right edge of the avatar.
 *
 * - Color is determined by the UserStatus (green, gray, yellow, red)
 * - Includes a white border ring for visibility against any avatar background
 * - Provides tooltip title for hover accessibility
 */
export default function AvatarStatus({ status, size }: AvatarStatusProps) {
  const { colorClass, tooltipTitle } = useAvatarStatus(status);

  const dotSize = STATUS_DOT_SIZE[size];
  const borderWidth = STATUS_BORDER[size];

  return (
    <span
      className={`absolute bottom-0 right-0 block ${colorClass} rounded-full ring-2 ring-white dark:ring-gray-900`}
      style={{
        width: dotSize,
        height: dotSize,
        borderWidth: borderWidth,
      }}
      title={tooltipTitle}
      aria-hidden="true"
    />
  );
}
