import { useEffect, useRef } from 'react';
import { useGalleryStore } from '../lib/gallery-store';

/**
 * Hook that preloads adjacent images when the lightbox currentIndex changes.
 *
 * Uses `new Image()` to preload the full-resolution images at N-1 and N+1
 * into the browser cache. Maintains a Set of preloaded URLs to avoid
 * duplicate fetches. Cleans up references for images that fall outside
 * the preload window.
 *
 * @param preloadWindow - Number of adjacent images to preload on each side (default: 1)
 */
export function useImagePreload(preloadWindow: number = 1) {
  const currentIndex = useGalleryStore((state) => state.currentIndex);
  const images = useGalleryStore((state) => state.images);
  const isOpen = useGalleryStore((state) => state.isOpen);
  const preloadedRef = useRef<Set<string>>(new Set());
  const imageRefsRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!isOpen || images.length === 0) return;

    const start = Math.max(0, currentIndex - preloadWindow);
    const end = Math.min(images.length - 1, currentIndex + preloadWindow);

    // Preload images in the window
    for (let i = start; i <= end; i++) {
      if (i === currentIndex) continue; // Current image is already loaded by <img>
      const image = images[i];
      if (!image || preloadedRef.current.has(image.fullSrc)) continue;

      const img = new Image();
      img.src = image.fullSrc;
      img.fetchPriority = 'low'; // Low priority for adjacent images
      preloadedRef.current.add(image.fullSrc);
      imageRefsRef.current.push(img);
    }

    // Evict images outside the preload window
    const evictStart = Math.max(0, currentIndex - preloadWindow - 2);
    const evictEnd = Math.min(images.length - 1, currentIndex + preloadWindow + 2);

    // We keep a broader window (±2 beyond preloadWindow) to avoid
    // aggressive eviction when the user navigates back and forth
    for (let i = 0; i < evictStart; i++) {
      evictImage(i);
    }
    for (let i = evictEnd + 1; i < images.length; i++) {
      evictImage(i);
    }
  }, [currentIndex, images, isOpen, preloadWindow]);

  const evictImage = (index: number) => {
    const image = images[index];
    if (!image) return;

    // Remove from preloaded set
    preloadedRef.current.delete(image.fullSrc);

    // Dereference the Image object — allows GC of decoded bitmap
    const imgIndex = imageRefsRef.current.findIndex(
      (img) => img.src === image.fullSrc
    );
    if (imgIndex !== -1) {
      imageRefsRef.current.splice(imgIndex, 1);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      imageRefsRef.current.forEach((img) => {
        img.src = ''; // Dereference
      });
      imageRefsRef.current = [];
      preloadedRef.current.clear();
    };
  }, []);

  return { preloadedCount: preloadedRef.current.size };
}
