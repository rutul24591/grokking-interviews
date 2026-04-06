import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useGalleryStore } from '../lib/gallery-store';
import { LightboxImage } from './lightbox-image';
import { ThumbnailStrip } from './thumbnail-strip';
import { ImageCaption } from './image-caption';

/**
 * Full-screen lightbox container with portal, backdrop, focus trap,
 * and keyboard navigation.
 *
 * Renders via React Portal to ensure z-index isolation.
 * Manages focus trap, keyboard events, and backdrop click to close.
 */
export const Lightbox = memo(function Lightbox() {
  const isOpen = useGalleryStore((state) => state.isOpen);
  const closeLightbox = useGalleryStore((state) => state.closeLightbox);
  const next = useGalleryStore((state) => state.next);
  const prev = useGalleryStore((state) => state.prev);
  const currentIndex = useGalleryStore((state) => state.currentIndex);
  const images = useGalleryStore((state) => state.images);

  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // SSR-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Store the element that had focus when lightbox opened
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case '+':
        case '=':
          e.preventDefault();
          useGalleryStore.getState().setZoom({
            scale: Math.min(
              5,
              useGalleryStore.getState().zoom.scale + 0.5
            ),
          });
          break;
        case '-':
          e.preventDefault();
          useGalleryStore.getState().setZoom({
            scale: Math.max(
              1,
              useGalleryStore.getState().zoom.scale - 0.5
            ),
          });
          break;
      }
    },
    [closeLightbox, next, prev]
  );

  // Focus trap — Tab cycles within the lightbox
  const handleFocusTrap = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !overlayRef.current) return;

      const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);

    // Focus the lightbox container on open
    requestAnimationFrame(() => {
      overlayRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, handleKeyDown, handleFocusTrap]);

  if (!isOpen || !isMounted) return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image: ${currentImage?.title ?? ''}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 outline-none"
      onClick={(e) => {
        // Close on backdrop click (only if clicking the backdrop, not content)
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
    >
      {/* Close button */}
      <button
        aria-label="Close lightbox"
        className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={closeLightbox}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={prev}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={next}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Main image area */}
      <div className="flex-1 overflow-hidden">
        <LightboxImage image={currentImage!} />
      </div>

      {/* Caption overlay */}
      <ImageCaption image={currentImage!} />

      {/* Thumbnail strip */}
      <ThumbnailStrip images={images} activeIndex={currentIndex} />
    </div>,
    document.body
  );
});
