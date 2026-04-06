import { useRef, useEffect, memo } from 'react';
import type { GalleryImage } from '../lib/gallery-types';
import { useGalleryStore } from '../lib/gallery-store';

interface ThumbnailStripProps {
  images: GalleryImage[];
  activeIndex: number;
}

/**
 * Horizontal scrollable strip of mini thumbnails at the bottom
 * of the lightbox. Highlights the active image and auto-scrolls
 * to keep it visible.
 */
export const ThumbnailStrip = memo(function ThumbnailStrip({
  images,
  activeIndex,
}: ThumbnailStripProps) {
  const goTo = useGalleryStore((state) => state.goTo);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to keep active thumbnail visible
  useEffect(() => {
    if (activeThumbRef.current && scrollContainerRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  if (images.length <= 1) return null;

  return (
    <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto overflow-y-hidden px-4 py-2 scrollbar-thin"
        role="tablist"
        aria-label="Image thumbnails"
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={image.id}
              ref={isActive ? activeThumbRef : undefined}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to image: ${image.title}`}
              className={`flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-200 ${
                isActive
                  ? 'border-white shadow-lg shadow-white/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              style={{ width: 64, height: 48 }}
              onClick={() => goTo(index)}
            >
              <img
                src={image.thumbnailSrc}
                alt={image.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
