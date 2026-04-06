import { memo } from 'react';
import type { GalleryImage } from '../lib/gallery-types';
import { useGalleryStore } from '../lib/gallery-store';

interface ImageCaptionProps {
  image: GalleryImage;
}

/**
 * Overlay component displaying title, description, photographer
 * name, and other metadata. Positioned at the bottom of the
 * lightbox above the thumbnail strip.
 */
export const ImageCaption = memo(function ImageCaption({
  image,
}: ImageCaptionProps) {
  const showCaption = useGalleryStore((state) => state.showCaption);
  const setShowCaption = useGalleryStore((state) => state.setShowCaption);

  if (!showCaption) {
    return (
      <button
        aria-label="Show image caption"
        className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={() => setShowCaption(true)}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-16 z-40 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-6 py-4">
      <div className="mx-auto max-w-2xl">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white">{image.title}</h3>

        {/* Description */}
        {image.description && (
          <p className="mt-1 text-sm text-white/80">{image.description}</p>
        )}

        {/* Metadata row */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
          {image.photographer && (
            <span>
              <span className="font-medium text-white/80">Photographer: </span>
              {image.photographer}
            </span>
          )}
          {image.dateTaken && (
            <span>
              <span className="font-medium text-white/80">Date: </span>
              {image.dateTaken}
            </span>
          )}
          {image.camera && (
            <span>
              <span className="font-medium text-white/80">Camera: </span>
              {image.camera}
            </span>
          )}
        </div>

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {image.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toggle caption visibility */}
      <button
        aria-label="Hide image caption"
        className="absolute -top-8 right-0 rounded-full bg-white/10 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={() => setShowCaption(false)}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
});
