import { memo } from 'react';
import type { GalleryImage } from '../lib/gallery-types';
import { useGalleryStore } from '../lib/gallery-store';
import { useLazyImage } from '../hooks/use-lazy-images';
import { decodeBlurhash } from '../lib/blurhash-utils';

interface GalleryImageCardProps {
  image: GalleryImage;
  index: number;
}

/**
 * Individual gallery image card with lazy loading and click-to-open.
 *
 * Displays a blurhash placeholder initially, then fades in the
 * thumbnail once loaded. On click, opens the lightbox.
 */
export const GalleryImageCard = memo(function GalleryImageCard({
  image,
  index,
}: GalleryImageCardProps) {
  const openLightbox = useGalleryStore((state) => state.openLightbox);
  const { ref, isVisible, isLoaded, hasError, markLoaded, markError } =
    useLazyImage('200px');

  const placeholderSrc = image.blurhash
    ? decodeBlurhash(image.blurhash, 32, 20)
    : undefined;

  const handleClick = () => {
    openLightbox(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(index);
    }
  };

  return (
    <div
      ref={ref}
      data-image-index={index}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.title} in lightbox`}
      className="relative cursor-pointer overflow-hidden rounded-lg border border-theme transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Placeholder (blurhash or solid color) */}
      {placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      )}

      {/* Actual thumbnail (loaded lazily) */}
      {isVisible && !hasError && (
        <img
          src={image.thumbnailSrc}
          alt={image.title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={markLoaded}
          onError={markError}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      )}

      {/* Image metadata overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <p className="text-sm font-medium text-white truncate">
          {image.title}
        </p>
        {image.photographer && (
          <p className="text-xs text-white/80 truncate">
            by {image.photographer}
          </p>
        )}
      </div>
    </div>
  );
});
