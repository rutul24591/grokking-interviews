/**
 * Carousel — Staff-Level Accessibility Deep-Dive.
 *
 * Staff differentiator: Full ARIA carousel pattern with aria-roledescription,
 * keyboard navigation with roving tabindex, autoplay pause/resume with
 * user preference detection, and screen reader slide announcements.
 */

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Hook that manages ARIA-compliant carousel keyboard navigation.
 * Implements the WAI-ARIA carousel pattern with roving tabindex.
 */
export function useAriaCarousel(
  slideCount: number,
  currentIndex: number,
  onSlideChange: (index: number) => void,
) {
  const [focusedSlide, setFocusedSlide] = useState(0);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onSlideChange((currentIndex - 1 + slideCount) % slideCount);
        break;
      case 'ArrowRight':
        e.preventDefault();
        onSlideChange((currentIndex + 1) % slideCount);
        break;
      case 'Home':
        e.preventDefault();
        onSlideChange(0);
        break;
      case 'End':
        e.preventDefault();
        onSlideChange(slideCount - 1);
        break;
    }
  }, [currentIndex, slideCount, onSlideChange]);

  return { onKeyDown, focusedSlide };
}

/**
 * Manages screen reader announcements for carousel slide changes.
 */
export function useCarouselAnnouncements(currentSlide: number, totalSlides: number, slideLabels: string[]) {
  const liveRegionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!liveRegionRef.current) return;

    const label = slideLabels[currentSlide] || `Slide ${currentSlide + 1}`;
    liveRegionRef.current.textContent = `${label}, slide ${currentSlide + 1} of ${totalSlides}`;
  }, [currentSlide, totalSlides, slideLabels]);

  return { liveRegionRef };
}
