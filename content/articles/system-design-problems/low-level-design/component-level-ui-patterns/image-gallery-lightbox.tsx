"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-image-gallery-lightbox",
  title: "Design an Image Gallery / Lightbox",
  description:
    "Complete LLD solution for a production-grade image gallery with lightbox, zoom, swipe, lazy loading, thumbnail strip, keyboard navigation, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "image-gallery-lightbox",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "image-gallery",
    "lightbox",
    "zoom",
    "swipe",
    "lazy-loading",
    "accessibility",
    "touch-gestures",
  ],
  relatedTopics: [
    "modal-component",
    "carousel-slider",
    "lazy-loading-strategies",
    "touch-gesture-handling",
  ],
};

export default function ImageGalleryLightboxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable image gallery and lightbox system for a
          large-scale React application. The gallery displays a responsive grid of
          images with lazy loading and placeholder previews. Clicking any image opens
          a full-screen lightbox overlay that supports zoom (pinch-to-zoom on touch,
          click to zoom in/out, pan when zoomed), swipe navigation between images
          (touch swipe with momentum scrolling), keyboard navigation (arrow keys,
          escape, +/- for zoom), a thumbnail strip for quick navigation, and caption
          overlays with metadata. The system must be performant with large image sets
          (hundreds of images), accessible (focus trap, ARIA attributes, screen reader
          support), and handle real-world constraints like varying image aspect ratios,
          slow network conditions, and memory management for high-resolution images.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Images are hosted on a CDN and accessible via URL. Multiple resolutions
            may be available (thumbnail, medium, full).
          </li>
          <li>
            The gallery may contain anywhere from a dozen to several hundred images.
          </li>
          <li>
            Placeholder previews use blurhash or solid color fallback while images load.
          </li>
          <li>
            Touch devices must support pinch-to-zoom and swipe gestures.
          </li>
          <li>
            Desktop users must support mouse wheel zoom, click-to-zoom, and keyboard
            navigation.
          </li>
          <li>
            The lightbox must trap focus while open and restore focus to the triggering
            element on close.
          </li>
          <li>
            Adjacent images (previous + next) are preloaded when the lightbox is open
            to ensure smooth transitions.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Gallery Grid:</strong> Responsive grid layout (CSS Grid or masonry)
            displaying image thumbnails with lazy loading via IntersectionObserver.
          </li>
          <li>
            <strong>Placeholder Previews:</strong> Show blurhash-decoded image or solid
            color placeholder while the actual image loads.
          </li>
          <li>
            <strong>Lightbox Open:</strong> Clicking any gallery image opens a full-screen
            lightbox overlay with that image displayed at fit-to-screen size.
          </li>
          <li>
            <strong>Navigation:</strong> Previous/Next buttons, swipe gestures (touch),
            and keyboard arrows (Left/Right) navigate between images.
          </li>
          <li>
            <strong>Zoom:</strong> Pinch-to-zoom on touch devices, double-click or scroll
            wheel on desktop, +/- keys. Zoom supports panning when zoom level exceeds
            1x (drag to pan on desktop, two-finger pan on touch).
          </li>
          <li>
            <strong>Thumbnail Strip:</strong> A horizontal strip of mini thumbnails at the
            bottom of the lightbox for quick navigation, with an active indicator.
          </li>
          <li>
            <strong>Caption/Metadata Overlay:</strong> Displays image title, description,
            photographer name, and other metadata as an overlay.
          </li>
          <li>
            <strong>Keyboard Support:</strong> ArrowLeft/Right for navigation, Escape to
            close, +/- for zoom.
          </li>
          <li>
            <strong>Image Preloading:</strong> When viewing image at index N, pre-load
            images at N-1 and N+1 in the background.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Gallery must render 500+ images without jank.
            Lazy loading ensures only visible images are fetched. Lightbox transitions
            must run at 60fps using GPU-accelerated properties (transform, opacity).
          </li>
          <li>
            <strong>Memory Management:</strong> High-resolution images consume significant
            GPU memory. The system must evict decoded images that are far from the current
            index to prevent out-of-memory crashes on mobile devices.
          </li>
          <li>
            <strong>Network Efficiency:</strong> Load appropriately sized images based on
            viewport. Thumbnails for the gallery grid, medium resolution for lightbox at
            1x zoom, full resolution only when zoomed in beyond 2x.
          </li>
          <li>
            <strong>Accessibility:</strong> Focus trap within lightbox, aria-label for
            each image, role="dialog" for the lightbox, keyboard navigation, screen
            reader announcements for image changes.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for GalleryImage,
            LightboxState, ZoomState, and all component props.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Image fails to load (404, network error) — show error placeholder with retry
            option.
          </li>
          <li>
            Extremely large image (e.g., 10000x8000) — must handle zoom/pan without
            crashing the browser.
          </li>
          <li>
            Rapid swipe/click navigation — must debounce or queue transitions to prevent
            animation glitches.
          </li>
          <li>
            Gallery with mixed aspect ratios — grid layout must handle portrait, landscape,
            and square images gracefully.
          </li>
          <li>
            User resizes viewport while lightbox is open — image must re-center and
            re-fit.
          </li>
          <li>
            Touch device with both touch and mouse input (e.g., Surface) — must handle
            both input modalities without conflicts.
          </li>
          <li>
            User navigates away (route change) while lightbox is open — lightbox must
            close cleanly and release all resources.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>gallery rendering</strong> from the
          <strong>lightbox state management</strong> using a global store (Zustand) and
          a portal-based lightbox rendering strategy. The gallery grid handles lazy
          loading, placeholder display, and click-to-open. The lightbox handles zoom
          calculations, swipe detection, image preloading, keyboard navigation, and
          focus management. Zoom state (scale, translateX, translateY) is managed
          independently from lightbox state (isOpen, currentIndex) to avoid coupling.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Native CSS scroll-snap gallery:</strong> Works well for simple
            carousels but lacks zoom, pan, and thumbnail strip. Insufficient for our
            requirements.
          </li>
          <li>
            <strong>Third-party library (e.g., PhotoSwipe, react-image-lightbox):</strong>
            Production-ready but adds significant bundle size and removes control over
            accessibility, customization, and state management. For a large application
            that needs tight integration with existing state (Zustand), a custom
            implementation is preferable.
          </li>
          <li>
            <strong>Canvas-based rendering:</strong> Could handle zoom/pan at the pixel
            level but adds complexity, loses native image decoding optimizations, and
            makes accessibility significantly harder.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + CSS Transform + Portal is optimal:</strong> Zustand
          provides a lightweight, selector-based global store for lightbox state. CSS
          transforms (scale + translate) handle zoom and pan on the GPU compositor thread,
          ensuring 60fps. The lightbox renders via React Portal to ensure z-index
          isolation and escape parent CSS constraints. Touch gestures are handled by a
          dedicated swipe detector module that calculates velocity and direction, while
          zoom is managed by a separate zoom-manager module that computes the transform
          matrix from pinch distance ratios.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Gallery Types &amp; Interfaces (<code>gallery-types.ts</code>)</h4>
          <p>
            Defines the <code>GalleryImage</code> interface with fields for id, src,
            thumbnailSrc, fullSrc, blurhash, width, height, title, description,
            photographer, and aspectRatio. The <code>LightboxState</code> interface
            tracks isOpen, currentIndex, and transitionDirection. The <code>ZoomState</code>
            interface tracks scale, translateX, translateY, and panBounds. See the
            Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Gallery Store (<code>gallery-store.ts</code>)</h4>
          <p>
            Manages the global lightbox state using Zustand. Exposes actions for opening,
            closing, navigating (next/prev/goTo), and updating zoom state. The store is
            the single source of truth for which image is currently displayed and at what
            zoom level. Components subscribe via selectors to avoid unnecessary re-renders.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>isOpen: boolean</code> — whether lightbox is open
            </li>
            <li>
              <code>currentIndex: number</code> — index into the images array
            </li>
            <li>
              <code>zoom: ZoomState</code> — current zoom scale and pan offsets
            </li>
            <li>
              <code>images: GalleryImage[]</code> — all gallery images
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>openLightbox(index: number)</code> — sets isOpen, currentIndex, resets zoom
            </li>
            <li>
              <code>closeLightbox()</code> — sets isOpen false, resets zoom
            </li>
            <li>
              <code>next()</code> — increments currentIndex (wraps or clamps)
            </li>
            <li>
              <code>prev()</code> — decrements currentIndex
            </li>
            <li>
              <code>goTo(index: number)</code> — jumps to specific index
            </li>
            <li>
              <code>setZoom(zoom: Partial&lt;ZoomState&gt;)</code> — updates zoom state
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Blurhash Utilities (<code>blurhash-utils.ts</code>)</h4>
          <p>
            Handles blurhash decode/encode for placeholder previews. Blurhash is a
            compact representation of a blurred image (typically 20-30 characters) that
            can be decoded into a small canvas pixel buffer. The module exposes
            <code>decodeBlurhash(hash, width, height)</code> which returns a data URL
            suitable as an <code>&lt;img&gt;</code> src. Falls back to a solid color
            extracted from the blurhash if decoding fails.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Swipe Detector (<code>swipe-detector.ts</code>)</h4>
          <p>
            A reusable touch/mouse swipe detection utility. Tracks touchstart, touchmove,
            touchend events, calculates delta X/Y, velocity, and direction. Fires callbacks
            for swipe-left, swipe-right, swipe-up, swipe-down when the movement exceeds
            a configurable threshold (default: 50px) and velocity threshold. Supports
            momentum tracking — fast swipes trigger navigation even if distance is below
            threshold.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Zoom Manager (<code>zoom-manager.ts</code>)</h4>
          <p>
            Handles pinch-to-zoom calculations. On touch devices, tracks the distance
            between two touch points and computes the scale ratio relative to the initial
            pinch distance. On desktop, handles wheel events for scroll-zoom and
            double-click events. Computes pan bounds to prevent panning the image outside
            the viewport — when zoomed, the image can only pan within the rectangle that
            keeps at least some portion of the image visible.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Lazy Loading Hook (<code>use-lazy-images.ts</code>)</h4>
          <p>
            Custom React hook wrapping IntersectionObserver for lazy loading gallery
            images. Maintains a Map of element refs to their visibility state. When an
            image enters the viewport, the hook triggers the actual image fetch. Supports
            a rootMargin for preloading images just before they become visible (e.g.,
            200px rootMargin loads images 200px before they scroll into view).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Image Preload Hook (<code>use-image-preload.ts</code>)</h4>
          <p>
            Custom React hook that preloads adjacent images when the lightbox currentIndex
            changes. Uses <code>new Image()</code> to preload the full-resolution images
            at N-1 and N+1 into the browser cache. Cleans up references when the index
            changes to prevent memory leaks from holding decoded image data.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Tree</h3>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <code>ImageGallery</code> — root gallery grid with responsive layout
          </li>
          <li>
            <code>GalleryImageCard</code> — individual image card with lazy loading, click handler
          </li>
          <li>
            <code>Lightbox</code> — full-screen lightbox container with portal, backdrop, focus trap
          </li>
          <li>
            <code>LightboxImage</code> — zoomable/pannable image with transform handling
          </li>
          <li>
            <code>ThumbnailStrip</code> — mini thumbnails with active indicator
          </li>
          <li>
            <code>ImageCaption</code> — overlay with title, description, metadata
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store holds lightbox state (isOpen, currentIndex, zoom). The
          gallery grid itself is stateless — it receives the images array as props and
          renders cards. Each card uses the lazy loading hook independently. When the
          lightbox opens, the preload hook activates and begins loading adjacent images.
          Zoom state is decoupled from navigation state — navigating to a different
          image resets zoom to 1x and centers the image.
        </p>
        <p>
          The most complex interaction is zoom + pan bounds calculation. When the image
          is zoomed to scale S, the rendered dimensions become originalWidth * S and
          originalHeight * S. The pan bounds are computed as the maximum offset that
          keeps the image within the viewport: maxX = (renderedWidth - viewportWidth) / 2,
          maxY = (renderedHeight - viewportHeight) / 2. If the image is smaller than the
          viewport even when zoomed, translateX/Y remain 0 (no panning needed).
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/image-gallery-lightbox-architecture.svg"
          alt="Image Gallery Lightbox Architecture"
          caption="Architecture of the image gallery and lightbox showing lazy-loaded grid, portal-based lightbox, and zoom/pan management"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User scrolls the gallery grid. IntersectionObserver fires for visible image
            cards.
          </li>
          <li>
            Each visible GalleryImageCard loads its thumbnailSrc. Placeholder (blurhash)
            displays until the image loads.
          </li>
          <li>
            User clicks an image card. <code>openLightbox(index)</code> is called on the
            store.
          </li>
          <li>
            Zustand updates isOpen to true, currentIndex to the clicked index, resets zoom.
          </li>
          <li>
            Lightbox component renders via portal with backdrop. Focus trap activates.
          </li>
          <li>
            LightboxImage renders the full-resolution image with CSS transform for fit-to-screen.
          </li>
          <li>
            Preload hook triggers, loading images at currentIndex-1 and currentIndex+1.
          </li>
          <li>
            User swipes right or presses ArrowRight: store calls next(), currentIndex
            increments, zoom resets, new image renders with slide transition.
          </li>
          <li>
            User pinches to zoom: zoom-manager computes new scale from pinch distance
            ratio, updates zoom state, LightboxImage applies CSS transform: scale(S)
            translate(X, Y).
          </li>
          <li>
            User presses Escape: store calls closeLightbox(), portal unmounts, focus
            returns to the triggering image card.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. Gallery rendering
          flows from the images array prop through IntersectionObserver-triggered lazy
          loading. Lightbox state flows through the Zustand store, and all rendering
          flows from store subscriptions. This ensures predictable behavior and makes
          the system testable in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Image load failure:</strong> If an image fails to load (404, network
            error), the LightboxImage component catches the onError event and renders an
            error placeholder with a retry button. The retry triggers a fresh fetch with
            cache busting.
          </li>
          <li>
            <strong>Rapid navigation:</strong> When the user swipes rapidly, the store
            updates currentIndex immediately. The LightboxImage component uses a CSS
            transition with <code>transition: transform 300ms ease-out</code>. If a new
            navigation occurs during the transition, the previous transition is cancelled
            and the new one begins. This is acceptable — the user perceives smooth motion.
          </li>
          <li>
            <strong>Viewport resize during lightbox:</strong> A resize listener recalculates
            pan bounds and re-centers the image. The zoom scale is preserved but translate
            offsets are clamped to the new bounds.
          </li>
          <li>
            <strong>Memory pressure on mobile:</strong> The preload hook maintains a
            maximum cache size (default: 5 images — current, ±2 adjacent). When the index
            moves beyond this range, images outside the window are dereferenced, allowing
            the browser to garbage-collect the decoded bitmap data.
          </li>
          <li>
            <strong>Route change with open lightbox:</strong> The Lightbox component
            registers a cleanup effect that closes the lightbox on unmount. This ensures
            the portal is removed and focus is restored even during navigation.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 15 files: type
            definitions, Zustand store with zoom management, blurhash utilities, swipe
            detector, zoom manager, lazy loading hook, image preload hook, gallery grid,
            image cards, lightbox container, lightbox image with zoom/pan, thumbnail
            strip, image caption overlay, and a full EXPLANATION.md walkthrough. Click
            the <strong>Example</strong> toggle at the top of the article to view all
            source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Gallery Types (gallery-types.ts)</h3>
        <p>
          Defines the <code>GalleryImage</code> interface with multiple URL variants
          (thumbnail, medium, full), blurhash placeholder, dimensions, and metadata.
          The <code>ZoomState</code> interface tracks scale (min: 1, max: 5), translateX,
          and translateY. The <code>LightboxState</code> interface tracks open/close
          state and current index.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (gallery-store.ts)</h3>
        <p>
          The store manages lightbox open/close, current image index, navigation, and
          zoom state. Key design decisions include: resetting zoom to 1x on every
          navigation (prevents disorientation), clamping currentIndex within bounds,
          and providing a <code>setZoom</code> action that merges partial updates for
          ergonomic zoom manipulation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Blurhash Utilities (blurhash-utils.ts)</h3>
        <p>
          Decodes blurhash strings into small canvas images (typically 32x20 pixels)
          which are then upscaled via CSS <code>image-render: auto</code> to fill the
          image container. The blurhash is a perceptual hash — it preserves the dominant
          colors and light/dark regions of the original image, giving users an immediate
          sense of the image content before it loads.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Swipe Detector (swipe-detector.ts)</h3>
        <p>
          A class-based utility that attaches to a DOM element and emits events for
          swipe directions. Tracks touchstart/touchmove/touchend timestamps to compute
          velocity. Supports both touch and mouse (drag) input. Configurable thresholds
          for distance (default 50px) and velocity (default 0.3px/ms). Includes a
          cleanup method to remove event listeners.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Zoom Manager (zoom-manager.ts)</h3>
        <p>
          Computes zoom scale from pinch distance ratio (touch) or wheel delta (desktop).
          Calculates pan bounds to prevent the image from being dragged completely off-screen.
          Handles the transform matrix composition: <code>transform: scale(S) translate(X, Y)</code>.
          Supports zoom-to-point (double-click zooms into the clicked coordinates).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Lazy Loading Hook (use-lazy-images.ts)</h3>
        <p>
          Wraps IntersectionObserver to detect when image cards enter the viewport.
          Uses <code>useRef</code> for each card element and a callback ref pattern
          to dynamically register/unregister observers. Supports rootMargin for
          preloading images before they become visible.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Image Preload Hook (use-image-preload.ts)</h3>
        <p>
          Subscribes to the store's currentIndex. When it changes, creates
          <code>new Image()</code> instances for the adjacent images' full-resolution
          URLs. Maintains a Set of preloaded URLs to avoid duplicate fetches. Cleans
          up references for images that fall outside the preload window.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Image Gallery (image-gallery.tsx)</h3>
        <p>
          Renders the responsive grid using CSS Grid with <code>grid-template-columns:
          repeat(auto-fill, minmax(250px, 1fr))</code>. Accepts an images array prop
          and renders GalleryImageCard for each image. Uses the lazy loading hook to
          manage visibility.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Gallery Image Card (gallery-image-card.tsx)</h3>
        <p>
          Individual image card component. Displays the blurhash placeholder initially,
          then fades in the thumbnailSrc once loaded. On click, calls
          <code>openLightbox(index)</code>. Uses aspect-ratio CSS to prevent layout
          shifts during image loading.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Lightbox Container (lightbox.tsx)</h3>
        <p>
          Full-screen lightbox rendered via React Portal. Handles backdrop click to
          close, focus trap (Tab/Shift-Tab cycles within lightbox), keyboard event
          listeners (arrows, escape, +/-), and renders the thumbnail strip and caption
          overlay. Uses <code>useEffect</code> for SSR-safe mounting.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: Lightbox Image (lightbox-image.tsx)</h3>
        <p>
          The core zoomable/pannable image component. Applies CSS transforms from the
          store's zoom state. Attaches the swipe detector and zoom manager to its
          container element. Handles the fit-to-screen calculation on mount and on
          viewport resize. Manages the transition between images with slide animations.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: Thumbnail Strip (thumbnail-strip.tsx)</h3>
        <p>
          Horizontal scrollable strip of mini thumbnails at the bottom of the lightbox.
          Highlights the active image. Clicking a thumbnail navigates to that image.
          Auto-scrolls to keep the active thumbnail visible.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 13: Image Caption (image-caption.tsx)</h3>
        <p>
          Overlay component displaying title, description, photographer name, and other
          metadata. Positioned at the bottom of the lightbox above the thumbnail strip.
          Supports show/hide toggle. Fades in/out with CSS transitions.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">openLightbox</td>
                <td className="p-2">O(1) — set flags</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">navigate (next/prev)</td>
                <td className="p-2">O(1) — index increment</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">zoom update</td>
                <td className="p-2">O(1) — merge partial</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">pan bounds calculation</td>
                <td className="p-2">O(1) — arithmetic</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">preload adjacent images</td>
                <td className="p-2">O(k) — k adjacent images</td>
                <td className="p-2">O(k) — k decoded bitmaps</td>
              </tr>
              <tr>
                <td className="p-2">IntersectionObserver callback</td>
                <td className="p-2">O(1) per observed element</td>
                <td className="p-2">O(n) — n observed elements</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>k</code> is the preload window size (typically 2) and <code>n</code>
          is the total number of images in the gallery. All store operations are O(1).
          The gallery grid scales linearly with the number of images, but only visible
          images consume memory and network bandwidth.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Image decoding at high zoom:</strong> Browsers decode images to
            bitmap buffers in main memory. A 10000x8000 image at 32-bit color depth
            consumes ~320 MB. Zooming beyond 3x on large images can trigger memory
            pressure on mobile devices. Mitigation: serve progressive JPEGs or WebP
            with multiple resolution tiers, and only load full resolution when zoom
            exceeds 2x.
          </li>
          <li>
            <strong>Gallery grid with 500+ images:</strong> Even with lazy loading,
            rendering 500+ DOM nodes causes initial paint delay. Mitigation: virtualize
            the grid using a windowing library (react-window) or implement custom
            virtualization — only render DOM nodes for images within the viewport plus
            a buffer.
          </li>
          <li>
            <strong>Swipe gesture on low-end devices:</strong> Touch event handlers
            running on the main thread can cause scroll jank. Mitigation: use
            <code>touch-action: none</code> on the lightbox image container to prevent
            browser scroll interference, and use <code>passive: true</code> on
            touchmove listeners where possible.
          </li>
          <li>
            <strong>Blurhash decode on main thread:</strong> Decoding blurhash for 500+
            images synchronously blocks the main thread. Mitigation: decode blurhash
            values in a Web Worker or lazily decode only when the image card enters the
            viewport.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Responsive image srcset:</strong> Use <code>srcset</code> and
            <code>sizes</code> attributes to let the browser choose the appropriate
            image resolution based on viewport width and device pixel ratio.
          </li>
          <li>
            <strong>GPU-accelerated transforms:</strong> All zoom and pan animations
            use CSS <code>transform</code> (scale + translate), which runs on the
            compositor thread. Avoid animating <code>width</code>, <code>height</code>,
            or <code>top/left</code>.
          </li>
          <li>
            <strong>Image preloading with priority hints:</strong> Use
            <code>{"<link rel='preload' as='image'>"}</code> for the adjacent images
            to signal browser priority. For the current image, use <code>fetchpriority="high"</code>.
          </li>
          <li>
            <strong>Memory eviction:</strong> The preload hook evicts images that fall
            outside the ±2 window. On memory pressure events (detectable via
            <code>performance.memory</code> in Chrome), aggressively evict all cached
            images except the current one.
          </li>
          <li>
            <strong>Debounced resize:</strong> The resize listener that recalculates
            pan bounds is debounced at 100ms to avoid thrashing during continuous
            resize (e.g., window drag-resize).
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Image URL Validation</h3>
        <p>
          Image URLs sourced from user-generated content (e.g., user-uploaded photos)
          must be validated to prevent open redirect or XSS via malicious URLs. Ensure
          all image URLs point to trusted CDN domains or pass through a URL allowlist.
          Never use <code>dangerouslySetInnerHTML</code> with image URLs or metadata
          from untrusted sources.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Content Security Policy</h3>
        <p>
          The application's CSP must include <code>img-src</code> directives allowing
          the CDN domain. If images are loaded from external sources (e.g., Unsplash,
            Pexels), those domains must also be whitelisted. Blob URLs for blurhash
          placeholders require <code>img-src 'self' blob:</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowLeft</kbd> /
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowRight</kbd> —
              navigate to previous/next image.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> —
              close the lightbox.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">+</kbd> /
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">-</kbd> —
              zoom in/out by 0.5x increments.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> —
              focus cycles within the lightbox (focus trap). Backdrop and page content
              behind the lightbox are inert.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The lightbox uses <code>role="dialog"</code> with <code>aria-modal="true"</code>
              to signal to assistive technologies that this is a modal overlay.
            </li>
            <li>
              The current image has <code>aria-label</code> set to the image title and
              description. When navigating, the new image's <code>aria-label</code> is
              updated, triggering a screen reader announcement.
            </li>
            <li>
              The lightbox has <code>aria-labelledby</code> pointing to the caption
              title element, providing context when the dialog opens.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Focus Management</h4>
          <p>
            When the lightbox opens, focus moves to the lightbox container. A focus trap
            ensures that Tab and Shift+Tab cycle only within the lightbox elements
            (navigation buttons, thumbnail strip, close button). On close, focus returns
            to the gallery image card that triggered the lightbox. This is essential for
            keyboard users to maintain their position in the gallery.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Privacy</h3>
        <ul className="space-y-2">
          <li>
            <strong>EXIF data:</strong> Full-resolution images may contain EXIF metadata
            including GPS coordinates. The CDN should strip EXIF data on upload, or the
            application should warn users that full-resolution downloads include EXIF data.
          </li>
          <li>
            <strong>Image URL leakage:</strong> If image URLs contain signed tokens or
            session identifiers, they should have short expiration times to prevent
            unauthorized sharing.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test openLightbox sets isOpen true and
            currentIndex, closeLightbox resets state, next/prev increment/decrement
            index with bounds checking, setZoom merges partial updates correctly.
          </li>
          <li>
            <strong>Zoom bounds calculation:</strong> Verify pan bounds are computed
            correctly for various image sizes and viewport dimensions. Test that an
            image smaller than the viewport has zero pan range.
          </li>
          <li>
            <strong>Swipe detector:</strong> Simulate touch events with known deltas
            and velocities. Assert that swipe-left fires when deltaX exceeds threshold
            moving left, and does not fire for small movements.
          </li>
          <li>
            <strong>Blurhash decode:</strong> Test decode with valid blurhash strings
            returns a valid data URL. Test with invalid input returns a solid color
            fallback.
          </li>
          <li>
            <strong>Lazy loading hook:</strong> Mock IntersectionObserver, trigger
            intersect callbacks, verify that the image src is set only after intersection.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Gallery to lightbox flow:</strong> Render ImageGallery with 10 images,
            click the 5th image card, assert lightbox opens with the correct image,
            assert focus is within the lightbox.
          </li>
          <li>
            <strong>Lightbox navigation:</strong> Open lightbox, press ArrowRight, assert
            currentIndex is 6, assert image src updated. Press Escape, assert lightbox
            is closed and focus returned to the 5th card.
          </li>
          <li>
            <strong>Zoom interaction:</strong> Open lightbox, simulate wheel event with
            positive delta, assert zoom scale increased. Simulate drag after zoom, assert
            translate offsets updated and clamped within bounds.
          </li>
          <li>
            <strong>Preload verification:</strong> Open lightbox at index 5, intercept
            network requests, assert images 4 and 6 are fetched. Navigate to index 6,
            assert image 7 is fetched and image 3 is no longer referenced.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify Lightbox returns null during SSR and mounts correctly
            on hydration.
          </li>
          <li>
            Image load failure: replace image URL with a 404 endpoint, assert error
            placeholder renders with retry button.
          </li>
          <li>
            Rapid navigation: fire 10 next() calls in 100ms, assert currentIndex is
            correct and no crashes occur.
          </li>
          <li>
            Accessibility: run axe-core automated checks on the lightbox, verify
            role="dialog", aria-modal, focus trap, and aria-label on images.
          </li>
          <li>
            Touch gestures: use Playwright's device emulation to simulate swipe and
            pinch-to-zoom on mobile viewports.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Loading full-resolution images in the gallery grid:</strong> Candidates
            often set the image src to the full-resolution URL for every card in the grid.
            For 500 images, this means 500 concurrent network requests and massive bandwidth
            waste. Interviewers expect candidates to discuss thumbnail URLs, lazy loading,
            and IntersectionObserver.
          </li>
          <li>
            <strong>Not resetting zoom on navigation:</strong> If a user zooms into image 5
            and then navigates to image 6, the zoomed viewport on image 6 is disorienting
            (they might be looking at a corner of the image without context). Always reset
            zoom to 1x and center the image on navigation.
          </li>
          <li>
            <strong>Animating width/height instead of transform:</strong> Animating layout
            properties triggers expensive layout recalculations. Interviewers look for
            candidates who know to use CSS <code>transform: scale() translate()</code> for
            zoom and pan, which runs on the GPU compositor.
          </li>
          <li>
            <strong>Ignoring focus trap in lightbox:</strong> Without a focus trap, Tab
            key can focus elements behind the lightbox, confusing keyboard users. This is
            a critical accessibility oversight.
          </li>
          <li>
            <strong>No image preloading:</strong> Without preloading adjacent images, the
            user sees a loading spinner on every navigation. Interviewers expect candidates
            to discuss preloading strategies (adjacent N images, progressive loading).
          </li>
          <li>
            <strong>Memory leaks from decoded images:</strong> Keeping references to all
            preloaded <code>Image()</code> objects prevents garbage collection. Candidates
            should discuss eviction strategies (LRU cache, window-based eviction).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS Grid vs Masonry Layout</h4>
          <p>
            CSS Grid with <code>auto-fill</code> creates a uniform grid where all cells in
            a row have the same height. For images with varying aspect ratios, this means
            cropping or letterboxing. CSS Masonry (available in Firefox behind a flag,
            not yet in Chrome) handles varying heights natively. The alternative is a
            JavaScript-based masonry layout (e.g., react-masonry-css), which calculates
            column heights dynamically. The trade-off: JS masonry adds computation cost
            and layout thrashing on resize, while CSS Grid is fast but may crop images.
            For a gallery where preserving the full image is important, masonry is
            preferred. For uniform thumbnails (e.g., all cropped to 4:3), CSS Grid is
            simpler and faster.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Blurhash vs Solid Color Placeholder</h4>
          <p>
            Blurhash provides a perceptually meaningful preview of the actual image — users
            can discern colors, light/dark regions, and general composition. The cost is
            the blurhash string (adds ~30 bytes per image to the metadata payload) and
            decode computation (~1ms per image on main thread, or near-zero in a Web
            Worker). Solid color placeholders (dominant color extracted via k-means or
            from image metadata) are computationally cheaper and require zero extra
            metadata, but provide a less informative preview. For a photography portfolio,
            blurhash is worth the cost. For an e-commerce product gallery, solid color
            is sufficient.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Pinch-to-Zoom: CSS Transform vs Canvas</h4>
          <p>
            CSS <code>transform: scale()</code> leverages the browser's image decoding and
            GPU compositing. The browser automatically handles bilinear filtering and
            quality at different zoom levels. The limitation is that the browser loads the
            full image into memory at its native resolution — zooming beyond 3x shows
            pixelation. Canvas-based rendering gives pixel-level control — you can load
            higher-resolution tiles on demand (like Google Maps) and composite them. The
            trade-off: Canvas adds significant complexity, loses native accessibility
            (screen readers cannot see canvas content), and requires manual handling of
            image decoding, caching, and tile management. For most gallery use cases,
            CSS transforms are the right choice. Canvas/tiling is justified only for
            extremely high-resolution images (e.g., art galleries, medical imaging) where
            zoom levels exceed 10x.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a gallery with 10,000+ images?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualize the grid — only render DOM nodes for images within the
              viewport plus a buffer (e.g., 2 rows above and below). Use a windowing
              library or implement custom virtualization with absolute positioning and
              dynamic top offsets. Paginate or infinite-scroll the data layer — fetch
              images in batches of 50-100 from the API. Use a virtual list for the
              thumbnail strip as well, rendering only visible thumbnails. Consider
              server-side blurhash generation to avoid client-side decode cost.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement progressive image loading (blur to sharp)?
            </p>
            <p className="mt-2 text-sm">
              A: Use a three-tier approach: (1) Show blurhash or solid color immediately
              (zero network cost). (2) Load a tiny low-res image (e.g., 50px wide JPEG,
              ~2KB) and crossfade it over the blurhash. (3) Load the full-resolution image
              and crossfade it over the low-res version. Each tier replaces the previous
              one with a CSS opacity transition. This gives the user a progressively
              sharpening preview. The blurhash tier is instant, the low-res tier loads
              in ~100ms on 4G, and the full-res tier loads in ~500ms-2s depending on
              image size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add image sharing (deep linking to a specific image)?
            </p>
            <p className="mt-2 text-sm">
              A: Update the URL when the lightbox opens to include the image index or ID
              as a query parameter or hash fragment (e.g., <code>?image=42</code> or
              <code>#image-42</code>). On page load, check for the parameter and
              automatically open the lightbox at that index. Use <code>history.pushState</code>
              to update the URL without a page reload. When the lightbox closes, restore
              the previous URL. This allows users to share a link that opens the gallery
              directly to a specific image.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle offline support for a gallery?
            </p>
            <p className="mt-2 text-sm">
              A: Use a Service Worker to cache gallery metadata (image list, blurhash
              strings, metadata) in the Cache API or IndexedDB. Cache thumbnail images
              for recently viewed galleries. When offline, serve cached thumbnails and
              metadata. The lightbox can display cached images but full-resolution images
              may not be available. Show an offline indicator and queue any user actions
              (e.g., favorites, annotations) for sync when online again.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement gesture-based image rotation?
            </p>
            <p className="mt-2 text-sm">
              A: Extend the zoom manager to track two-finger rotation angle. On touchmove
              with two fingers, compute the angle between the current finger positions and
              the initial positions. Apply <code>transform: rotate(deg) scale(S)
              translate(X, Y)</code> to the image. The rotation origin should be the
              midpoint between the two touch points. Limit rotation to a reasonable range
              (e.g., -45 to +45 degrees) to prevent disorientation. On desktop, support
              rotation via a UI slider or keyboard shortcut. Be aware that rotation
              changes the pan bounds calculation — the bounding rectangle of a rotated
              image is larger than the unbounded rectangle.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React's rendering cycle,
              so it works correctly with concurrent features. The Lightbox uses
              useSyncExternalStore for subscription synchronization. Image loading and
              zoom calculations are side effects that run in effects, wrapped in
              <code>startTransition</code> for non-urgent updates (e.g., updating pan
              bounds during resize). CSS transitions run on the compositor thread
              independent of React's scheduler. The gallery grid renders can be
              deprioritized with <code>startTransition</code> since thumbnail loading is
              not time-critical.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://photoswipe.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PhotoSwipe — Reference Lightbox Implementation
            </a>
          </li>
          <li>
            <a
              href="https://wavedeck.net/blurhash/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blurhash — Compact Image Placeholder Algorithm
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Dialog (Modal) Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/fast-loading-images"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Fast Loading Images and Optimization Strategies
            </a>
          </li>
          <li>
            <a
              href="https://zustand-demo.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
