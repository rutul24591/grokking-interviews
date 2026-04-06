# Image Gallery / Lightbox — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + portal + hooks** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  ImageGallery   │     │  Zustand Store   │     │    Lightbox     │
│   (grid grid)   │────▶│ (lightbox state) │────▶│    (Portal)     │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
   ┌─────┴─────┐          ┌─────┴─────┐           ┌──────┴──────┐
   │           │          │           │           │             │
GalleryCard  GalleryCard  Zoom      Swipe      LightboxImage  ThumbnailStrip
   │                       Manager   Detector   ImageCaption
   │
useLazyImage
useImagePreload
```

### Design Decisions

1. **Zustand for state management** — Zero boilerplate, selector-based subscriptions prevent unnecessary re-renders. The lightbox state (isOpen, currentIndex, zoom) is decoupled from the gallery grid state.

2. **Portal rendering for lightbox** — The lightbox renders directly to `document.body`, escaping parent CSS constraints (overflow: hidden, z-index stacking contexts).

3. **IntersectionObserver for lazy loading** — Only images within the viewport (plus a 200px margin) are fetched. This reduces initial network load from 500+ concurrent requests to ~20.

4. **CSS transforms for zoom/pan** — `transform: scale(S) translate(X, Y)` runs on the GPU compositor thread, ensuring 60fps zoom and pan animations.

5. **Modular swipe and zoom utilities** — `SwipeDetector` and `ZoomManager` are standalone classes that can be tested in isolation and reused across components.

## File Structure

```
example-1/
├── lib/
│   ├── gallery-types.ts       # TypeScript interfaces: GalleryImage, ZoomState, LightboxState
│   ├── gallery-store.ts       # Zustand store + convenience API
│   ├── blurhash-utils.ts      # Blurhash decode/encode, solid color fallback
│   ├── swipe-detector.ts      # Touch/mouse swipe detection with velocity tracking
│   └── zoom-manager.ts        # Pinch-to-zoom, scroll-zoom, pan bounds calculation
├── hooks/
│   ├── use-lazy-images.ts     # IntersectionObserver-based lazy loading
│   └── use-image-preload.ts   # Preload adjacent images, cleanup on index change
├── components/
│   ├── image-gallery.tsx      # Root gallery grid with responsive layout
│   ├── gallery-image-card.tsx # Individual image with lazy loading, click-to-open
│   ├── lightbox.tsx           # Full-screen lightbox with portal, focus trap, keyboard nav
│   ├── lightbox-image.tsx     # Zoomable/pannable image with transform handling
│   ├── thumbnail-strip.tsx    # Mini thumbnails with active indicator
│   └── image-caption.tsx      # Overlay with title, description, metadata
└── EXPLANATION.md             # This file
```

## Key Implementation Details

### Zustand Store (lib/gallery-store.ts)

The store is the single source of truth for lightbox state. Key aspects:

- **openLightbox(index)**: Sets isOpen true, currentIndex to the clicked index, resets zoom to 1x. Clamps index within bounds.
- **closeLightbox()**: Sets isOpen false, resets zoom.
- **next()/prev()**: Increments/decrements currentIndex with bounds checking. Resets zoom on every navigation (prevents disorientation).
- **setZoom(partial)**: Merges partial zoom updates for ergonomic manipulation. Clamps scale between MIN_ZOOM (1) and MAX_ZOOM (5).
- **goTo(index)**: Jumps to a specific index (used by thumbnail strip).

The exported `gallery` singleton wraps store actions for convenient imperative API:
```ts
gallery.open(5);
gallery.close();
gallery.zoomIn();
```

### Swipe Detector (lib/swipe-detector.ts)

A class-based utility that attaches to a DOM element and emits swipe events. Key aspects:

1. **Touch support**: Tracks single-finger swipes via touchstart/touchmove/touchend. Ignores multi-finger swipes (those are handled by zoom manager for pinch-to-zoom).

2. **Mouse support**: Tracks mouse drag via mousedown/mousemove/mouseup for desktop users.

3. **Velocity tracking**: Computes velocity as deltaX / duration (px/ms). A fast swipe with distance below the threshold still triggers navigation (momentum-based).

4. **Thresholds**: Distance threshold (default 50px) and velocity threshold (default 0.3px/ms) are configurable. Both must be exceeded OR velocity alone must exceed its threshold.

5. **Cleanup**: The `destroy()` method removes all event listeners. Called when the LightboxImage component unmounts.

### Zoom Manager (lib/zoom-manager.ts)

Handles all zoom-related calculations. Key aspects:

1. **Fit-to-screen**: `calculateFitScale()` computes the scale that makes the entire image visible within the container while maintaining aspect ratio. Never exceeds 1x (no upscaling for fit).

2. **Pinch-to-zoom**: `handlePinchZoom()` computes the scale ratio from the change in distance between two touch points. The ratio is multiplied by the current scale.

3. **Wheel zoom**: `handleWheelZoom()` adjusts scale by ZOOM_STEP (0.5) per wheel tick, clamped between MIN_ZOOM and MAX_ZOOM.

4. **Pan bounds**: `calculatePanBounds()` ensures the image cannot be dragged completely off-screen. When the image exceeds the container at zoom level S, the maximum pan offset is half the excess: `(renderedSize - containerSize) / 2`.

5. **Transform composition**: `buildTransform()` produces `scale(S) translate(X, Y)`. The order is critical — scale first, then translate, so the translate offsets are in the scaled coordinate space.

### Lazy Loading Hook (hooks/use-lazy-images.ts)

Two hooks are provided:

- **useLazyImage**: For individual image cards. Returns a callback ref, visibility state, loaded state, and error state. Uses IntersectionObserver with configurable rootMargin (default 200px preloading).

- **useLazyImageBatch**: For the entire gallery grid. Observes all image cards by their `data-image-index` attribute. Returns a Set of visible indices. More efficient for large galleries since it uses a single IntersectionObserver instance.

### Image Preload Hook (hooks/use-image-preload.ts)

Subscribes to the store's currentIndex. When it changes:

1. Creates `new Image()` instances for adjacent images (N-1 and N+1 by default).
2. Sets `fetchPriority = 'low'` to avoid competing with the current image.
3. Tracks preloaded URLs in a Set to avoid duplicate fetches.
4. Evicts images outside a broader window (±2 beyond preloadWindow) to prevent memory leaks.

### Lightbox Container (components/lightbox.tsx)

The most complex component. Key aspects:

1. **SSR safety**: Uses `useState(false)` + `useEffect(setMounted(true))` pattern. During SSR, returns null.

2. **Portal**: Renders to `document.body` via `createPortal()`.

3. **Focus trap**: Tab and Shift+Tab cycle within the lightbox. The first and last focusable elements are identified, and focus wraps between them.

4. **Keyboard navigation**: Escape closes, ArrowLeft/Right navigates, +/- zooms in/out.

5. **Focus restoration**: On close, focus returns to the gallery image card that triggered the lightbox.

6. **Backdrop click**: Clicking the dark backdrop (not the image or controls) closes the lightbox.

### Lightbox Image (components/lightbox-image.tsx)

Handles zoom and pan interactions. Key aspects:

1. **Touch events**: `onTouchStart` tracks initial pinch distance. `onTouchMove` computes current distance and updates zoom via zoom manager.

2. **Wheel events**: `onWheel` triggers scroll-zoom via zoom manager.

3. **Double-click**: `onDoubleClick` toggles between 1x and 2x zoom.

4. **Mouse drag**: When zoomed beyond 1x, mouse drag pans the image. `onMouseDown` starts dragging, `onMouseMove` updates pan offsets, `onMouseUp` ends dragging.

5. **Swipe vs pan conflict**: Swipe navigation is disabled when zoom > 1x (to avoid conflicting with pan). The swipe detector is re-initialized when zoom level changes.

6. **Error handling**: On image load failure, renders an error placeholder with a retry button that appends a cache-busting timestamp.

### Thumbnail Strip (components/thumbnail-strip.tsx)

Horizontal scrollable strip. Key aspects:

1. **Active indicator**: The active thumbnail has a white border and shadow. Inactive thumbnails are semi-transparent.

2. **Auto-scroll**: When the active index changes, `scrollIntoView({ inline: 'center' })` scrolls the strip to center the active thumbnail.

3. **Accessibility**: Uses `role="tablist"` and `role="tab"` with `aria-selected` for screen reader support.

### Image Caption (components/image-caption.tsx)

Overlay with metadata. Key aspects:

1. **Toggle visibility**: A small info button appears when the caption is hidden. Clicking it shows the caption. A collapse arrow hides it again.

2. **Gradient background**: Uses `bg-gradient-to-t from-black/80 via-black/50 to-transparent` for readability over any image.

3. **Metadata display**: Shows photographer, date, camera, and tags in a responsive flex layout.

## Usage

### 1. Initialize the gallery

```tsx
import { ImageGallery } from '@/components/image-gallery';
import { initGallery } from '@/lib/gallery-store';

function GalleryPage({ images }) {
  useEffect(() => {
    initGallery(images);
  }, [images]);

  return <ImageGallery images={images} />;
}
```

### 2. Render the lightbox at the app root

```tsx
// app/layout.tsx
import { Lightbox } from '@/components/lightbox';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Lightbox />
      </body>
    </html>
  );
}
```

### 3. Gallery image cards handle click-to-open

Clicking any `GalleryImageCard` calls `openLightbox(index)` on the store, which opens the lightbox with the corresponding image.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Image fails to load (404) | Error placeholder with retry button (cache-busted URL) |
| Extremely large image (10000x8000) | Zoom/pan handled via CSS transforms (GPU-composited). Memory managed via preload eviction. |
| Rapid swipe/click navigation | Store updates currentIndex immediately. CSS transitions handle smooth animation cancellation. |
| Mixed aspect ratios | Each card uses `aspect-ratio` CSS property. Grid cells adapt to image dimensions. |
| Viewport resize during lightbox | Resize listener remeasures container, recalculates pan bounds, clamps translate offsets. |
| Touch + mouse input (Surface) | SwipeDetector handles both input modalities independently. ZoomManager only activates on two-finger touch. |
| Route change with open lightbox | Lightbox component cleans up on unmount — closes lightbox, restores focus. |
| Memory pressure on mobile | Preload hook evicts images outside ±2 window. On memory pressure, aggressively evict all except current. |

## Performance Characteristics

- **openLightbox**: O(1) — set flags
- **navigate (next/prev)**: O(1) — index increment
- **zoom update**: O(1) — merge partial state
- **pan bounds calculation**: O(1) — arithmetic
- **preload adjacent images**: O(k) — k adjacent images (k = 2 by default)
- **IntersectionObserver callback**: O(1) per observed element
- **Animation**: GPU-composited (transform + opacity only)

## Testing Strategy

1. **Unit tests**: Test store actions (open, close, next, prev, goTo, setZoom), zoom bounds calculation, swipe detector with simulated touch events, blurhash decode/encode.

2. **Integration tests**: Render ImageGallery with 10 images, click the 5th card, assert lightbox opens with correct image. Navigate with arrows, assert currentIndex updates. Test zoom with wheel events.

3. **Accessibility tests**: Run axe-core on the lightbox, verify role="dialog", aria-modal, focus trap, aria-label on images.

4. **Edge case tests**: Image load failure (404 URL), rapid navigation (10 next() in 100ms), touch gestures via Playwright device emulation, viewport resize during lightbox.
