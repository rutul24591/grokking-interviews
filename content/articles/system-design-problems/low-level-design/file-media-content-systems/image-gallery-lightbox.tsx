"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-image-gallery-lightbox",
  title: "Design an Image Gallery / Lightbox",
  description:
    "LLD for an image gallery with lightbox: lazy loading, responsive srcset, zoom, swipe, keyboard navigation, focus trap, and accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "image-gallery-lightbox",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-29",
  tags: ["lld", "image-gallery", "lightbox", "lazy-loading", "zoom", "react"],
  relatedTopics: [
    "carousel-slider",
    "modal-component",
    "infinite-scroll-virtualized-list",
  ],
};

export default function ImageGalleryLightboxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing an image gallery with a
          lightbox — the grid of thumbnails that opens
          into a full-screen image viewer when clicked.
          The component is the standard UI for photo
          collections, product galleries, asset
          libraries, social feeds&rsquo; image attachments,
          and any UI where users browse images. Done well
          it feels native (smooth swipe, instant zoom,
          keyboard navigation); done poorly it&rsquo;s
          slow, mobile-broken, and inaccessible.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems are: lazy-loading thumbnails
          and full images at the right times; serving
          appropriately-sized images via srcset;
          supporting pinch-to-zoom on touch and scroll-
          wheel zoom on desktop; focus trap and keyboard
          navigation in the lightbox; pre-loading
          adjacent images for smooth swipe transitions;
          and integration with deep-link URLs so a
          specific image can be shared.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users browse galleries on every device.
          They expect lightbox to open instantly, swipe
          smoothly, zoom fluently, and close cleanly.
          Engineering teams consume the gallery via a
          hook-based API: declare the image set, an
          onActivate handler; the runtime handles
          everything else.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Images come with multiple sizes (original,
          large, medium, thumbnail) and srcset metadata.
          Modern browsers; we use IntersectionObserver
          for lazy load, the Pointer Events API for
          touch and mouse, and CSS transforms for zoom.
          Deep-link via URL fragment or query parameter.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement image upload (separate),
          server-side image processing (consumed via
          provided URLs), or video playback (separate
          Audio/Video Player). The grid layout and
          virtualization integrate with infinite scroll
          patterns when galleries are very large.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Grid of thumbnails (responsive columns based
          on viewport). Lazy-load thumbnails as they
          enter viewport. Click thumbnail opens
          lightbox at that image. Lightbox: full-screen
          (or modal-sized) view of the current image,
          with previous/next controls. Swipe left/right
          on touch; arrow keys on desktop. Pinch to
          zoom on touch; scroll-wheel zoom on desktop;
          double-click to zoom in/out. Pan when zoomed.
          Close via Escape, swipe down, or close button.
          Pre-load adjacent images. Deep-link: URL
          encodes the active image id so sharing the
          URL opens to that image. Loading and error
          states. Keyboard focus management.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Caption display below or overlaid. Image
          metadata (dimensions, file size, EXIF where
          available). Thumbnail strip at the bottom of
          the lightbox for quick navigation. Rotate
          buttons. Download action. Slideshow mode
          (auto-advance). Fullscreen API integration.
          Image comparison mode (side by side).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Image editing (crop, filter), upload, server-
          side processing.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Thumbnail grid renders smoothly during scroll;
          thumbnails load asynchronously. Lightbox open
          under 100 ms. Swipe transitions at 60 fps.
          Pre-load adjacent images so swipe doesn&rsquo;t
          flash blank. Memory bounded — we don&rsquo;t
          hold every full-size image in memory.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Failed image loads show fallback. Network
          interruption mid-load gracefully retries.
          Zoom/pan never gets into an unrecoverable
          state.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Image URLs treated as untrusted input;
          rendered via <code>img</code> with
          appropriate sandbox. Captions render as text
          (HTML opt-in via sanitizer).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Lightbox is a modal dialog with focus trap.
          Each image has alt text. Navigation
          announces position (&ldquo;Image 5 of
          20&rdquo;). All controls keyboard-accessible.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Image source adapter for variant URLs and
          metadata. Renderers for thumbnail and
          lightbox decoupled. Plugins for slideshow,
          compare mode.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/image-gallery-lightbox-architecture.svg"
        alt="Image Gallery / Lightbox Architecture"
        caption="Image source (with srcset variants) → Thumbnail grid (responsive, lazy via IntersectionObserver) → Lightbox modal (focus trap, swipe/keyboard nav, zoom/pan, pre-load adjacent). Deep-link via URL fragment."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="important">
          The system has two main surfaces: the
          <strong> thumbnail grid</strong> and the
          <strong> lightbox</strong>. They share an
          <strong> image source</strong> (list of images
          with metadata and variant URLs) and a
          <strong> navigation model</strong> (which image
          is active, how to move between them).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The <strong>thumbnail grid</strong> uses CSS
          Grid with responsive columns (e.g.
          <code> repeat(auto-fill, minmax(150px, 1fr))</code>).
          For very large galleries, we virtualize via
          the patterns from the Infinite Scroll
          Virtualized List. Each thumbnail uses
          <code> srcset</code> with multiple sizes so
          the browser picks the right one for the
          viewport and pixel density.
          IntersectionObserver triggers thumbnail
          loading as items enter the viewport;
          off-screen thumbnails defer until needed.
          Failed loads show a fallback (broken-image
          icon).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>lightbox</strong> opens when a
          thumbnail is activated. It mounts as a portal
          to the document body to escape parent CSS
          constraints. It traps focus (no tab escape
          while open) and listens for keyboard events
          (arrows, Escape) globally. The current image
          renders at full size with srcset; loading
          state shows a placeholder. Adjacent images
          (previous, next) preload in the background so
          swipe transitions are instant.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Swipe/keyboard navigation</strong>:
          touchstart/touchmove/touchend track the swipe;
          if the horizontal delta exceeds a threshold
          (e.g. 50 px), commit to the next or previous
          image. Mouse drag works the same way on
          desktop. Arrow keys (Left/Right) navigate
          without animation; the transition feels
          instant. Page Up/Down jump by N. Home/End go
          to first/last.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Zoom and pan</strong>: pinch gesture on
          touch (two pointers) tracks distance to
          compute scale. Scroll-wheel zooms on desktop
          centered on the cursor. Double-tap toggles
          between 1x and a fit-to-screen zoom level.
          When zoomed, drag pans. We use CSS
          <code> transform: scale() translate()</code>{" "}
          for hardware acceleration. Bounds prevent
          panning beyond the image edges. Reset zoom on
          navigation between images.
        </HighlightBlock>
        <p>
          <strong>Pre-loading</strong>: when the user
          opens an image, we initiate background fetches
          for the next and previous images. We use
          <code> Image</code> objects (not DOM elements)
          so the browser caches them without rendering.
          Adjacent thumbnails on the grid (within
          viewport) also pre-fetch larger sizes
          opportunistically.
        </p>
        <p>
          <strong>Deep-linking</strong>: the active
          image id encodes in the URL fragment (e.g.
          <code> #image=abc123</code>). On mount, if the
          URL has an image id, the gallery opens
          directly to the lightbox at that image. The
          URL updates as the user navigates between
          images. Sharing the URL takes recipients to
          the same view.
        </p>
        <p>
          <strong>Focus trap</strong>: when the lightbox
          opens, focus moves to the close button (or
          the image container, depending on
          configuration). Tab cycles through controls
          inside the lightbox. Escape closes and
          returns focus to the originating thumbnail.
          The trap uses standard modal patterns (focus
          sentinels at the boundaries, focus delegation
          on Tab key).
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong>LightboxImage</strong>{" "}
          renders the current image with zoom/pan.
          <strong> NavigationControls</strong> renders
          prev/next buttons.
          <strong> ZoomController</strong></HighlightBlock>
<HighlightBlock as="p" tier="important">handles
          pinch/wheel/double-tap.
          <Highlight tier="important"><strong> PreloadManager</strong></Highlight> prefetches
          adjacent images.
          <strong> URLBridge</strong> syncs active id
          with URL fragment.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The active image id, lightbox open state,
          zoom/pan state live in an <Highlight tier="important">external store.
          Subscribers re-render only on</Highlight> relevant changes.
          URL fragment is the source of truth for the
          active id.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Image shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, alt, sources: { thumbnail, medium, large, original }, width, height, caption? } `}</code>
          </Highlight>
          . Source contract: <code>{` { items, totalCount? } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="crucial">Thumbnails lazy-load via IntersectionObserver.
          Lightbox transitions use CSS transforms</HighlightBlock>
<HighlightBlock as="p" tier="important">(hardware-accelerated). Pre-loading adjacent
          images keeps swipe instant.</HighlightBlock>
<HighlightBlock as="p" tier="important">Zoom uses
          transform (no relayout). Memory bounded —
          we hold the current image plus prev/next; older
          images release.</HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Zoom feels tactile (CSS
          transforms align with pointer movement). Close
          via Escape or</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">swipe-down. Caption fades in
          below or overlaid. Counter (&ldquo;5 / 20&rdquo;)
          shows position.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Navigation announces position
          via live region (&ldquo;Image 5 of 20:
          [alt]&rdquo;). Zoom and pan controls</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">keyboard-accessible (+/- keys to zoom; arrow
          keys to pan when zoomed). Captions are
          accessible.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Image URLs from trusted sources or CSP-
          enforced. Captions <Highlight tier="important">sanitized if HTML.
          Cross-origin images that</Highlight> need to be exported
          (e.g. download) require server cooperation.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Integration tests:
          thumbnail lazy load, lightbox open with deep
          link, swipe gestures via</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">simulated pointers,
          focus trap. Accessibility tests for ARIA
          attributes and keyboard parity.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Open lightbox while another is
          opening: the second supersedes; one lightbox
          at a time. Deep-link to a non-existent image</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">id: open gallery without lightbox; surface a
          banner. Mobile orientation change: layout
          recomputes; zoom resets if disorienting.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over image source; works <Highlight tier="important">for any
          collection of images. Plugins</Highlight> for slideshow,
          compare mode, EXIF display.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Counter formatted via
          <Highlight tier="important"><code>Intl.NumberFormat</code></Highlight>. Captions
          consumer-controlled. <Highlight tier="important">RTL flips swipe
          direction expectation; arrow</Highlight> keys still
          navigate left/right semantically.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Modal lightbox vs full-page</h3>
        <HighlightBlock as="p" tier="important">
          Modal preserves browser back-button context
          and feels lightweight. Full-page is more
          immersive but breaks back navigation. We
          default to modal with URL fragment for
          deep-link.
        </HighlightBlock>

        <h3>Pre-load adjacent vs all</h3>
        <HighlightBlock as="p" tier="important">
          Pre-loading the next and previous keeps
          swipe instant; pre-loading all wastes
          bandwidth for galleries the user
          won&rsquo;t fully browse. We pre-load the
          immediate neighbors only.
        </HighlightBlock>

        <h3>CSS transform vs canvas for zoom</h3>
        <HighlightBlock as="p" tier="crucial">
          CSS transform is hardware-accelerated and
          composable. Canvas gives more control (e.g.
          for image filters) but adds complexity. We
          use CSS transform; canvas is opt-in for
          advanced uses.
        </HighlightBlock>

        <h3>srcset vs single source</h3>
        <HighlightBlock as="p" tier="important">
          srcset lets the browser pick the right
          resolution for the device, saving bandwidth
          on mobile and improving sharpness on
          retina. Single source either wastes
          bandwidth or looks blurry. We always use
          srcset.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          AVIF / WebP format negotiation. Progressive
          loading with low-quality <Highlight tier="important">placeholder
          (LQIP). Image comparison slider mode.</Highlight> AR/3D
          view for product galleries. Offline-first
          caching via service worker.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How are thumbnails lazy-loaded?</strong>{" "}
          IntersectionObserver per thumbnail; src is
          set when the thumbnail enters viewport.
          <code> loading=&quot;lazy&quot;</code> as a
          fallback.
        </HighlightBlock>

        <p>
          <strong>2. How does swipe navigation work?</strong>{" "}
          Pointer Events track horizontal delta; if it
          exceeds a threshold on touchend, commit to
          next or previous. Below threshold, snap back.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>3. How is zoom implemented?</strong>{" "}
          CSS transform: scale() with double-tap toggle
          and pinch-to-scale on touch (two-pointer
          tracking). Pan via translate() when zoomed,
          bounded to image edges.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How does pre-loading work?</strong>{" "}
          Next and previous images fetched as
          <code> Image</code> objects (browser cache);
          when user navigates, the cached image
          renders instantly.
        </HighlightBlock>

        <p>
          <strong>5. How is deep-linking handled?</strong>{" "}
          URL fragment encodes active image id. On
          mount, parse and open lightbox if present.
          Update fragment on navigation. Sharing URL
          takes recipient to same view.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>6. How is focus trapped in the
          lightbox?</strong> Standard modal pattern:
          focus moves to lightbox on open; Tab cycles
          within; Escape closes and returns focus.
        </HighlightBlock>

        <p>
          <strong>7. How does srcset improve
          performance?</strong> The browser picks the
          right image size for the viewport and pixel
          density. Mobile gets smaller; retina gets
          higher resolution. Bandwidth saved without
          sacrificing quality.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>8. How is this accessible?</strong>{" "}
          Modal dialog with focus trap. Alt text on
          every image. Position announced via live
          region. Keyboard parity with mouse for all
          interactions including zoom and pan.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Focus trap and
          deep-link URL fragments handle accessibility
          and shareability. The result</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">feels native
          everywhere — fast on desktop, fluid on
          touch, navigable by keyboard.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
