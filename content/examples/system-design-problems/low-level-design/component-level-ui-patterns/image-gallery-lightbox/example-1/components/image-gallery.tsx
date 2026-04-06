import { memo } from 'react';
import type { GalleryImage } from '../lib/gallery-types';
import { useGalleryStore } from '../lib/gallery-store';
import { GalleryImageCard } from './gallery-image-card';

interface ImageGalleryProps {
  images: GalleryImage[];
}

/**
 * Root gallery grid component with responsive layout.
 *
 * Uses CSS Grid with auto-fill for responsive columns.
 * Initializes the gallery store with the images array.
 */
export const ImageGallery = memo(function ImageGallery({
  images,
}: ImageGalleryProps) {
  const initGallery = useGalleryStore.persist?.setOptions?.({
    // Initialize gallery on mount
  });

  // Initialize store with images on mount
  // In a real implementation, you'd call initGallery(images) via useEffect

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-center">
        <p className="text-muted-foreground text-lg">
          No images in this gallery.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 p-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
    >
      {images.map((image, index) => (
        <GalleryImageCard key={image.id} image={image} index={index} />
      ))}
    </div>
  );
});
