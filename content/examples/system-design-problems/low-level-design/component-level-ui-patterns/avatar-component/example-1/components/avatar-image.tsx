import { memo } from 'react';
import { useAvatarImage } from '../../hooks/use-avatar-image';
import { AVATAR_SIZE_PX, type AvatarSize } from '../../lib/avatar-types';

interface AvatarImageProps {
  src: string;
  alt: string;
  size: AvatarSize;
  shapeClass: string;
  onError?: (src: string) => void;
  onLoaded?: (src: string) => void;
}

/**
 * AvatarImage component handles lazy loading, error detection, and retry logic.
 *
 * - Renders a skeleton placeholder while not in view or loading
 * - Renders the actual image when in view and loaded
 * - Triggers fallback on error by calling onError callback
 * - Supports retry on hover via the useAvatarImage hook
 */
const AvatarImage = memo(function AvatarImage({
  src,
  alt,
  size,
  shapeClass,
  onError,
  onLoaded,
}: AvatarImageProps) {
  const { isInView, isLoading, hasError, shouldAttemptLoad, retry, imageRef } =
    useAvatarImage(src, onError, onLoaded);

  const px = AVATAR_SIZE_PX[size];

  // If error, notify parent so it can switch to fallback
  if (hasError && !shouldAttemptLoad) {
    onError?.(src);
    return null;
  }

  // If not in view yet, render a skeleton placeholder
  if (!isInView) {
    return (
      <div
        className={`${shapeClass} bg-gray-200 dark:bg-gray-700 animate-pulse`}
        style={{ width: px, height: px }}
        aria-hidden="true"
      />
    );
  }

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div
        className={`${shapeClass} bg-gray-200 dark:bg-gray-700 animate-pulse`}
        style={{ width: px, height: px }}
        aria-hidden="true"
      />
    );
  }

  // Attempt to load the image
  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      loading="lazy"
      className={`${shapeClass} object-cover`}
      style={{ width: px, height: px }}
      onLoad={() => {
        // Image loaded successfully — parent will handle state update
      }}
      onError={() => {
        // Image failed — trigger fallback
        retry();
      }}
      draggable={false}
    />
  );
});

export default AvatarImage;
