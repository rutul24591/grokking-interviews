import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import AvatarImage from './avatar-image';
import AvatarFallback from './avatar-fallback';
import AvatarStatus from './avatar-status';
import AvatarGroup from './avatar-group';
import { useAvatarStatus } from '../../hooks/use-avatar-status';
import {
  AVATAR_SHAPE_CLASSES,
  type AvatarProps,
  type AvatarSize,
  type AvatarShape,
  type UserStatus,
} from '../../lib/avatar-types';

interface AvatarCompositionProps {
  children: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

/**
 * Avatar.Image — sub-component for the compound API.
 * Renders the image with lazy loading and error handling.
 */
function AvatarImageWrapper({
  src,
  alt,
  size,
  shape,
}: {
  src?: string;
  alt?: string;
  size: AvatarSize;
  shape: AvatarShape;
}) {
  if (!src) return null;

  return (
    <AvatarImage
      src={src}
      alt={alt || ''}
      size={size}
      shapeClass={AVATAR_SHAPE_CLASSES[shape]}
    />
  );
}

/**
 * Avatar.Fallback — sub-component for the compound API.
 * Renders initials or generic icon when image fails.
 */
function AvatarFallbackWrapper({
  name,
  size,
  shape,
}: {
  name?: string;
  size: AvatarSize;
  shape: AvatarShape;
}) {
  return <AvatarFallback name={name} size={size} shape={shape} />;
}

/**
 * Main Avatar component with fallback chain:
 * image -> initials -> generic icon
 *
 * Uses the compound component pattern for flexible composition.
 */
export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
  onError,
  onLoaded,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { ariaLabelSuffix } = useAvatarStatus(status);

  const shapeClass = AVATAR_SHAPE_CLASSES[shape];

  const handleError = useCallback(() => {
    setImageFailed(true);
    onError?.(src || '');
  }, [src, onError]);

  const handleLoaded = useCallback(() => {
    setImageFailed(false);
    onLoaded?.(src || '');
  }, [src, onLoaded]);

  const ariaLabel = `${name || 'Anonymous user'}${ariaLabelSuffix}`;

  const containerClass = onClick
    ? 'relative inline-block cursor-pointer'
    : 'relative inline-block';

  return (
    <div
      className={`${containerClass} ${className}`}
      role="img"
      aria-label={ariaLabel}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {src && !imageFailed ? (
        <AvatarImage
          src={src}
          alt={alt || name || ''}
          size={size}
          shapeClass={shapeClass}
          onError={handleError}
          onLoaded={handleLoaded}
        />
      ) : (
        <AvatarFallback
          name={name}
          size={size}
          shape={shape}
          onRetry={src ? () => setImageFailed(false) : undefined}
        />
      )}

      {status && <AvatarStatus status={status} size={size} />}
    </div>
  );
}

// Attach sub-components for compound component API
Avatar.Image = AvatarImageWrapper;
Avatar.Fallback = AvatarFallbackWrapper;
Avatar.Status = AvatarStatus;
Avatar.Group = AvatarGroup;
