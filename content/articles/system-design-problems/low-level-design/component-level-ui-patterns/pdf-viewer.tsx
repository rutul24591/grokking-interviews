"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pdf-viewer",
  title: "Design a PDF Viewer Component",
  description:
    "Production-grade PDF viewer covering PDF.js rendering pipeline, virtualized page rendering with IntersectionObserver, text layer for accessibility and search, annotation SVG overlay, password-protected document handling, and progressive loading strategy.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "pdf-viewer",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "pdf", "pdf.js", "canvas", "virtualization", "annotations", "accessibility"],
  relatedTopics: ["code-editor-component", "image-gallery-lightbox", "rich-text-editor"],
};

export default function PDFViewerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A PDF viewer is one of the harder document rendering components to build correctly. The challenges are not
        just functional — page navigation, zoom, search — but architectural: how to render 500-page documents
        without exhausting memory, how to make canvas-rendered content accessible to screen readers, how to overlay
        annotations on top of rendered content, and how to handle the wide variation in PDF complexity. Staff-level
        interviews test whether you know the PDF.js rendering model, virtual rendering strategy, and text layer
        architecture.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/pdf-viewer-architecture.svg"
        alt="PDF viewer component architecture"
        caption="PDF.js pipeline, virtualized page rendering, text layer, and annotation overlay"
      />

      <h2>PDF.js Rendering Model</h2>
      <p>
        PDF.js is the standard browser-side PDF rendering library (originally by Mozilla). Understanding its
        architecture is essential because it directly shapes the component design.
      </p>
      <p>
        PDF.js operates asynchronously at every level. Loading a document, parsing a page, and rendering a page
        are all Promise-based operations. The rendering happens in two phases: parsing (extracting the page's
        vector instructions from the PDF byte stream) and rendering (executing those instructions onto a Canvas
        element). Both phases are computationally expensive and should never block the main thread.
      </p>
      <p>
        PDF.js supports a Worker mode where rendering runs in a Web Worker, offloading the heavy computation
        from the main thread. Always use this in production — without the worker, scrolling through a
        PDF causes visible frame drops because the main thread is busy rendering canvas pixels.
      </p>
      <p>
        The rendering pipeline for a single page:
      </p>
      <ol>
        <li>Call <code>pdfDoc.getPage(pageNum)</code> — returns a <code>PDFPageProxy</code> object with
        page dimensions and metadata.</li>
        <li>Create a Canvas element sized to <code>page.viewport.width × page.viewport.height × devicePixelRatio</code>.</li>
        <li>Call <code>page.render({'{'} canvasContext, viewport {'}'}).promise</code> — renders the page onto
        the canvas via the worker.</li>
        <li>When rendering completes, the canvas displays the page content.</li>
      </ol>

      <HighlightBlock as="p" tier="crucial">
        Always render at <code>viewport.scale × devicePixelRatio</code> to get sharp rendering on high-DPI displays.
        Without the DPR multiplier, text looks blurry on Retina screens because the canvas has half the required
        pixel density.
      </HighlightBlock>

      <h2>Virtualized Page Rendering</h2>
      <p>
        A 200-page PDF rendered as 200 simultaneous Canvas elements would consume several gigabytes of GPU memory
        and make the browser unresponsive. Virtualization renders only the pages currently visible in the viewport,
        plus a small buffer of adjacent pages to prevent flicker during fast scrolling.
      </p>

      <h3>IntersectionObserver Strategy</h3>
      <p>
        Each page is represented by a placeholder <code>&lt;div&gt;</code> with the correct dimensions. An
        IntersectionObserver watches all placeholders. When a placeholder enters the viewport (or the configured
        root margin buffer), the page is queued for rendering. When it exits, the canvas is detached and the
        placeholder reverts to showing a skeleton or the last-rendered thumbnail.
      </p>
      <p>
        Root margin configuration: set a root margin of <code>200px</code> above and below the visible area.
        Pages within 200px of the viewport are pre-rendered before the user scrolls to them, preventing the
        flash of unrendered content. Increase this for fast-scrolling behavior, decrease it to conserve memory
        on low-end devices.
      </p>

      <h3>Render Queue and Concurrency Control</h3>
      <p>
        Never kick off all visible pages' render calls simultaneously. PDF rendering is CPU/GPU intensive — five
        simultaneous render calls cause frame drops. Use a render queue with a concurrency limit of 2–3 concurrent
        renders. When a page becomes visible, enqueue its render task. The queue processes at most N tasks at once.
        When a page scrolls out before its render completes, cancel the render (PDF.js returns a cancellable
        render task).
      </p>
      <p>
        Prioritize the current page above all others. If the user navigates to page 50 and pages 1–5 are in the
        queue, insert page 50 at the front of the queue and cancel renders for pages not near the current position.
      </p>

      <h3>Memory Management</h3>
      <p>
        Canvas elements hold pixel buffers in GPU memory. A rendered page at 1× zoom on a standard document (A4 at
        96 DPI × 2 DPR) is approximately 4 MB. Keeping 20 rendered pages in memory simultaneously consumes 80 MB of
        GPU memory — problematic on mobile. Active memory management:
      </p>
      <ul>
        <li>Keep at most N rendered pages in memory (configurable based on device memory: <code>navigator.deviceMemory</code>
        — 2 GB device keeps 5, 8 GB keeps 15).</li>
        <li>When a new page is rendered and the limit is exceeded, evict the rendered page farthest from the
        current scroll position.</li>
        <li>Eviction: detach the canvas element; call <code>page.cleanup()</code> on the PDFPageProxy to release
        the rendering resources.</li>
        <li>Store a low-resolution thumbnail (rendered once at 0.2× scale) as the placeholder when the full
        canvas is evicted.</li>
      </ul>

      <h2>Text Layer for Accessibility and Search</h2>
      <p>
        Canvas rendering produces pixels — screen readers cannot read pixels. Without a text layer, a PDF viewer
        is inaccessible to the 1 in 8 people who use assistive technology. The text layer also enables text
        selection and in-document search.
      </p>
      <p>
        PDF.js provides <code>page.getTextContent()</code> which returns the positions and content of all text
        items on the page. These text items are rendered as absolutely positioned, transparent HTML elements
        layered directly over the corresponding canvas areas. The text elements are invisible visually (zero
        opacity or matching the canvas background) but present in the DOM and accessible to screen readers and
        browser find-in-page.
      </p>

      <h3>Text Layer Positioning Accuracy</h3>
      <p>
        Text items must be positioned to pixel accuracy relative to the canvas. The transform matrix for each text
        item maps from PDF coordinate space (origin at bottom-left) to screen coordinate space (origin at top-left).
        PDF.js's <code>TextLayerBuilder</code> utility handles this transform automatically — use it rather than
        reimplementing the coordinate mapping manually.
      </p>
      <p>
        When the user zooms, the canvas is re-rendered at the new scale and the text layer elements must be
        repositioned. Scaling both canvas and text layer by the same viewport scale factor keeps them aligned.
      </p>

      <h3>In-Document Text Search</h3>
      <p>
        Text search implementation:
      </p>
      <ol>
        <li>On document load, extract text content from all pages concurrently (throttled to avoid main thread
        saturation). Store the text for each page in an array.</li>
        <li>When the user types a search query, search all pages' text arrays for matches. Use a case-insensitive
        regex that handles partial word matches.</li>
        <li>For each match, compute its position on the page using the text item's transform data.</li>
        <li>In the text layer for each page with matches, wrap the matching text in a highlighted <code>&lt;mark&gt;</code>
        element.</li>
        <li>Provide navigation: "Match 3 of 17" with prev/next buttons that scroll to and highlight each match
        in sequence.</li>
      </ol>
      <p>
        Critical performance consideration: text extraction for 200 pages can take 2–3 seconds. Run it in the Web
        Worker (PDF.js worker supports text extraction) and stream results page by page rather than waiting for all
        pages to complete before enabling search.
      </p>

      <h2>Annotation Layer</h2>
      <p>
        Annotations — highlights, sticky notes, freehand drawings, shapes — sit in a third layer above both the
        canvas and the text layer. The annotation layer is an SVG element (or a Canvas element for freehand)
        positioned to cover exactly the same area as the page canvas.
      </p>

      <h3>Annotation Data Model</h3>
      <p>
        Each annotation stores its position in PDF coordinate space, not screen coordinates. This ensures
        annotations remain correctly positioned when the user changes zoom level or page size. Storing pixel
        coordinates would require recomputing all annotation positions on every zoom change.
      </p>
      <p>
        Annotation schema:
      </p>
      <ul>
        <li><code>id</code>: UUID generated on creation.</li>
        <li><code>type</code>: highlight | note | shape | drawing.</li>
        <li><code>page</code>: 1-indexed page number.</li>
        <li><code>bounds</code>: bounding box in PDF coordinates (x, y, width, height — origin bottom-left).</li>
        <li><code>data</code>: type-specific data (highlight color, note text, shape points).</li>
        <li><code>author</code>, <code>createdAt</code>, <code>updatedAt</code>: metadata.</li>
      </ul>

      <h3>Highlight Annotations</h3>
      <p>
        Highlights are rectangles drawn over selected text. The selection uses the text layer — the user's text
        selection event provides the selected text items and their bounding boxes. Convert the bounding boxes
        from screen coordinates to PDF coordinates using the inverse viewport transform. Store the PDF-coordinate
        bounds. Render as a semi-transparent SVG rectangle (<code>opacity: 0.3</code>) in the annotation layer.
      </p>

      <h3>Collaborative Annotations</h3>
      <p>
        For collaborative annotation (multiple users annotating the same document simultaneously), use WebSocket
        to broadcast annotation events: annotation created, edited, deleted. Each annotation has a unique ID.
        Conflicts (two users editing the same annotation simultaneously) are resolved with last-write-wins for
        simple note edits, and operational transform for concurrent position changes.
      </p>

      <h2>Zoom and Viewport Management</h2>
      <p>
        Zoom is implemented by changing the scale factor in the PDF.js viewport. All visual elements — canvas
        size, text layer positions, annotation positions — scale proportionally.
      </p>
      <p>
        Zoom modes:
      </p>
      <ul>
        <li><strong>Fit to width:</strong> Scale = <code>containerWidth / page.view[2]</code> (page.view[2] is
        the page width in PDF units). Every page is the same visual width as the container.</li>
        <li><strong>Fit to page:</strong> Scale = min(containerWidth / pageWidth, containerHeight / pageHeight).
        The entire page fits in the viewport.</li>
        <li><strong>Custom percentage:</strong> Scale = <code>percentage / 100</code>. Standard levels: 50%,
        75%, 100%, 125%, 150%, 200%.</li>
      </ul>
      <p>
        When zoom changes, trigger a re-render of all visible pages at the new scale. Pages not currently visible
        have their cached render invalidated. On next scroll to those pages, they render at the new scale.
      </p>
      <p>
        Pinch-to-zoom on mobile: detect pinch gesture with <code>touchstart</code> / <code>touchmove</code> events,
        compute the scale factor from the finger distance ratio, apply it as the zoom level. Debounce the re-render
        trigger — re-render only when the pinch gesture completes, not on every touchmove event.
      </p>

      <h2>Page Navigation</h2>
      <p>
        Two navigation patterns serve different user intents:
      </p>
      <ul>
        <li><strong>Scroll-based navigation:</strong> The user scrolls continuously through the document. The
        current page number indicator updates based on which page occupies the most viewport space. Use an
        IntersectionObserver with <code>threshold: [0.25, 0.5, 0.75]</code> to determine the dominant page.</li>
        <li><strong>Direct page navigation:</strong> The user types a page number or clicks a thumbnail.
        Scroll the page container to the target page's top position. Use
        <code>element.scrollIntoView({'{'} behavior: 'instant' {'}'})</code> for direct jumps (smooth scroll
        for 500-page documents would be disorienting).</li>
      </ul>
      <p>
        Thumbnail sidebar: render each page at 0.1–0.15× scale (low-res) in a scrollable sidebar. Thumbnails are
        rendered lazily — only the visible thumbnails in the sidebar are rendered. Clicking a thumbnail navigates
        the main viewer to that page. The active page's thumbnail is highlighted.
      </p>

      <h2>Password-Protected PDFs</h2>
      <p>
        PDF.js throws a <code>PasswordException</code> when attempting to load a password-protected PDF without
        the password. The correct handling:
      </p>
      <ol>
        <li>Catch the <code>PasswordException</code> in the document loading logic.</li>
        <li>Show a password prompt modal. Never disable the rest of the UI — the user needs to enter the password.</li>
        <li>When the user submits a password, retry loading: <code>pdfjs.getDocument({'{'} url, password {'}'})</code>.</li>
        <li>If the password is wrong, PDF.js throws again with a different error code — show "Incorrect password"
        and allow re-entry.</li>
        <li>Never log or store the password anywhere — it's sensitive data.</li>
      </ol>

      <h2>Accessibility</h2>
      <p>
        A PDF viewer's a11y strategy:
      </p>
      <ul>
        <li><strong>Document role:</strong> The viewer container has <code>role="document"</code> and
        <code>aria-label="PDF document: [filename]"</code>. Each page region has <code>role="region"</code>
        and <code>aria-label="Page [N] of [total]"</code>.</li>
        <li><strong>Text layer reading order:</strong> Text layer elements are in DOM order matching the PDF's
        logical reading order. Screen readers read the text layer, not the canvas.</li>
        <li><strong>Keyboard navigation:</strong> Page Up/Down or arrow keys scroll by page. Ctrl+F opens the
        search panel. Ctrl+Plus/Minus or Ctrl+scroll zooms. Tab focuses the toolbar and controls.</li>
        <li><strong>Focus management:</strong> When the user navigates to a page via the page number input or
        thumbnail, move focus to the start of that page's text layer.</li>
        <li><strong>Search result announcement:</strong> When search finds matches, announce via an ARIA live
        region: "Found 17 matches. Viewing match 1."</li>
      </ul>

      <h2>Interview Q&A</h2>

      <h3>Q: How would you handle a 500-page PDF without the page crashing?</h3>
      <p>
        Three mechanisms working together: virtualized rendering (only 3–5 pages in the viewport are ever
        rendered as full-resolution canvas elements), memory capping (evict rendered pages beyond a limit based
        on device memory), and render cancellation (cancel in-progress renders for pages that have scrolled off
        before the render completes).
      </p>
      <p>
        For the thumbnail sidebar with 500 thumbnails: render thumbnails at 0.1× scale and virtualize the sidebar
        independently. Only the visible thumbnails in the sidebar render — the same IntersectionObserver pattern
        applies to the thumbnail list.
      </p>
      <p>
        Text extraction for search across 500 pages: stream extraction page by page in the worker, enabling
        search as pages are processed rather than waiting for all 500.
      </p>

      <h3>Q: Why is canvas-based rendering inaccessible and how do you fix it?</h3>
      <p>
        Canvas elements are rasterized bitmap images from the browser's perspective — they have no text content,
        no semantic structure, and no accessibility tree representation. A screen reader sees a canvas element as
        a generic interactive region with no describable content.
      </p>
      <p>
        The fix is the text layer: extract all text items from the PDF using PDF.js's <code>getTextContent()</code>,
        render them as absolutely positioned transparent HTML elements precisely overlaid on the corresponding
        canvas areas. Screen readers read the HTML text elements; sighted users see the canvas rendering. The
        two representations must be kept in sync — when canvas re-renders at a new zoom level, the text layer
        repositions to match.
      </p>

      <h3>Q: How do you implement annotations that survive zoom changes?</h3>
      <p>
        Store all annotation positions in PDF coordinate space (the coordinate system used inside the PDF file,
        origin at bottom-left, units in PDF points). When rendering an annotation, transform from PDF coordinates
        to screen coordinates using the current viewport transform matrix. When the user zooms, apply the new
        viewport transform to all stored PDF-coordinate positions — no stored data changes, only the rendering
        transform.
      </p>
      <p>
        This is the same principle PDF.js uses internally: all PDF content is in PDF coordinates, the viewport
        transform maps it to screen pixels. Your annotation layer applies the same viewport transform.
      </p>

      <h3>Q: How would you build a PDF form filling feature?</h3>
      <p>
        PDF files can contain form field definitions (AcroForm or XFA forms) specifying text inputs, checkboxes,
        radio buttons, dropdowns, and signature fields with their positions and sizes in PDF coordinates.
        PDF.js's <code>page.getAnnotations()</code> returns these field definitions.
      </p>
      <p>
        Render HTML form elements as an overlay layer (above canvas and text, below annotation layer) at the
        PDF-coordinate positions transformed to screen space. Each form field type maps to an HTML form element:
        text field → <code>&lt;input type="text"&gt;</code>, checkbox → <code>&lt;input type="checkbox"&gt;</code>.
        Style each element to match the PDF's original field styling.
      </p>
      <p>
        Saving the filled form: PDF.js cannot modify PDF files. Use a server-side PDF manipulation library
        (PDFKit, PyPDF2, iText) to apply the form values to the PDF and return a new PDF. The client sends the
        form field values as JSON; the server produces the filled PDF.
      </p>
    </ArticleLayout>
  );
}
