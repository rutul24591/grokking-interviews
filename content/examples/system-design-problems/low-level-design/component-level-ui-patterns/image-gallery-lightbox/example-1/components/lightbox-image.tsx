import { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { GalleryImage, ZoomState } from '../lib/gallery-types';
import { useGalleryStore } from '../lib/gallery-store';
import { SwipeDetector } from '../lib/swipe-detector';
import { ZoomManager } from '../lib/zoom-manager';

interface LightboxImageProps {
  image: GalleryImage;
}

/**
 * Zoomable/pannable image component within the lightbox.
 *
 * Applies CSS transforms from the store's zoom state.
 * Attaches the swipe detector and zoom manager to its
 * container element. Handles fit-to-screen calculation
 * on mount and on viewport resize.
 */
export const LightboxImage = memo(function LightboxImage({
  image,
}: LightboxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const zoom = useGalleryStore((state) => state.zoom);
  const setZoom = useGalleryStore((state) => state.setZoom);
  const next = useGalleryStore((state) => state.next);
  const prev = useGalleryStore((state) => state.prev);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  const swipeDetectorRef = useRef<SwipeDetector | null>(null);
  const zoomManagerRef = useRef<ZoomManager | null>(null);

  // Track pinch-to-zoom state
  const initialPinchDistanceRef = useRef<number>(0);

  // Measure container size on mount and resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Initialize zoom manager when container and image sizes are known
  useEffect(() => {
    if (
      !containerRef.current ||
      containerSize.width === 0 ||
      containerSize.height === 0
    )
      return;

    zoomManagerRef.current = new ZoomManager(
      containerSize.width,
      containerSize.height,
      image.width,
      image.height,
      (partialZoom) => setZoom(partialZoom)
    );

    // Set initial fit-to-screen zoom
    const fitScale = zoomManagerRef.current.calculateFitScale();
    setZoom({ scale: fitScale, translateX: 0, translateY: 0 });
  }, [containerSize, image, setZoom]);

  // Initialize swipe detector
  useEffect(() => {
    if (!containerRef.current) return;

    // Only enable swipe when zoom is at 1x (no panning conflict)
    const isZoomed = zoom.scale > 1;

    swipeDetectorRef.current = new SwipeDetector(containerRef.current, {
      threshold: 50,
      velocityThreshold: 0.3,
      onSwipeLeft: () => {
        if (!isZoomed) next();
      },
      onSwipeRight: () => {
        if (!isZoomed) prev();
      },
    });

    return () => {
      swipeDetectorRef.current?.destroy();
      swipeDetectorRef.current = null;
    };
  }, [zoom.scale, next, prev]);

  // Touch handlers for pinch-to-zoom
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start — measure initial distance
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && zoomManagerRef.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        const newZoom = zoomManagerRef.current.handlePinchZoom(
          initialPinchDistanceRef.current,
          currentDistance,
          zoom
        );
        setZoom(newZoom);
      }
    },
    [zoom, setZoom]
  );

  // Wheel handler for scroll-zoom (desktop)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!zoomManagerRef.current) return;
      e.preventDefault();

      const newZoom = zoomManagerRef.current.handleWheelZoom(e.deltaY, zoom);
      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  // Double-click to zoom
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!zoomManagerRef.current) return;
      const newZoom = zoomManagerRef.current.handleDoubleClickZoom(zoom);
      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  // Pan handler (mouse drag when zoomed)
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom.scale <= 1) return;
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    },
    [zoom.scale]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current || !zoomManagerRef.current) return;

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      const newZoom = zoomManagerRef.current.handlePan(deltaX, deltaY, zoom);
      setZoom(newZoom);

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    },
    [zoom, setZoom]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Build transform string
  const transform = zoomManagerRef.current
    ? zoomManagerRef.current.buildTransform(zoom)
    : `scale(${zoom.scale}) translate(${zoom.translateX}px, ${zoom.translateY}px)`;

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ touchAction: zoom.scale > 1 ? 'none' : 'auto' }}
    >
      {!hasError ? (
        <img
          ref={imageRef}
          src={image.fullSrc}
          alt={image.title}
          className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
          style={{
            transform,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          draggable={false}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-white/70">
          <svg
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>Failed to load image</p>
          <button
            className="rounded bg-white/20 px-4 py-2 text-sm hover:bg-white/30"
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              // Force reload with cache busting
              if (imageRef.current) {
                imageRef.current.src = `${image.fullSrc}?t=${Date.now()}`;
              }
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
});
