"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pdf-viewer",
  title: "Design a PDF Viewer",
  description:
    "LLD for an embedded PDF viewer: page rendering, zoom, search, annotations, lazy page loading, accessibility, and integration with PDF.js or native viewer.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "pdf-viewer",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-29",
  tags: ["lld", "pdf-viewer", "annotations", "search", "react"],
  relatedTopics: [
    "image-gallery-lightbox",
    "code-editor-component",
    "infinite-scroll-virtualized-list",
  ],
};

export default function PDFViewerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing an embedded PDF viewer — the
          component that renders PDF documents inline in
          a web app, with page navigation, zoom, search,
          and annotation. The viewer is the standard UI
          for legal documents, financial statements,
          academic papers, contracts, and any product
          where users need to read PDFs without
          downloading. Done well it feels like Adobe
          Reader; done poorly it&rsquo;s a slow,
          inaccessible iframe.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems are: rendering PDFs in the
          browser (typically via PDF.js, which uses
          WebAssembly internally); virtualizing pages so
          large documents (hundreds of pages) don&rsquo;t
          mount everything; in-document search across
          page boundaries; annotation overlays
          (highlights, comments, drawings) that survive
          page re-render; text selection that maps to
          PDF coordinates; and accessibility (PDFs are
          notoriously hostile to screen readers; we need
          to expose extracted text).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users read PDFs inline — review contracts,
          read manuals, browse academic papers. They
          expect zoom, page navigation, search, and
          (for some products) annotation. Engineering
          teams consume the viewer via a hook-based API:
          provide a PDF URL or buffer, optional initial
          page and zoom, and the viewer handles
          rendering and interaction.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          PDF.js (Mozilla) is the rendering engine; we
          embed and configure it. PDFs may be large
          (hundreds of pages, tens of MB). Modern
          browsers; we use Web Workers for PDF parsing
          (PDF.js does this internally) and Canvas/SVG
          for page rendering.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement PDF parsing — we use
          PDF.js. We do not implement PDF generation
          (server concern). We do not implement
          full-fidelity Adobe-extension features (forms,
          digital signatures verification at the level
          Adobe Reader does); we support the common
          subset.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Render PDF pages with crisp text via PDF.js.
          Page navigation: next/prev, jump to page,
          scroll-driven. Zoom: in, out, fit-to-width,
          fit-to-page, custom percentage. In-document
          search: find a query, highlight matches,
          jump to next/prev. Text selection that copies
          to clipboard correctly. Outline/bookmark
          panel (PDF table of contents). Thumbnails
          panel for quick navigation. Lazy-page rendering
          — only mount nearby pages. Page rotation.
          Print, download.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Annotations: highlight, comment, drawing,
          stamp. Annotation persistence per user.
          Form filling for fillable PDFs.
          Read-aloud (text-to-speech). Side-by-side
          two-page view. Continuous vs single-page
          modes. Sync between thumbnail panel and
          page view (current page highlighted).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          PDF generation, complex form processing
          (advanced JavaScript-in-PDF), digital
          signature creation/verification beyond
          display, PDF/A compliance validation.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Initial render under 1 second for typical
          PDFs (assuming network and PDF.js init are
          parallel). Scroll at 60 fps. Zoom updates
          smoothly. Search results return within ~500
          ms for typical documents.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Failed PDF loads show error with retry.
          Rendering errors on individual pages
          isolate (one bad page doesn&rsquo;t break the
          viewer). Annotations persist across reloads
          via the persistence layer.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          PDF.js sandboxes JavaScript-in-PDF (which
          should never run by default). PDF URLs
          authenticated; same-origin or with proper
          CORS. Annotations sanitized at storage.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Extracted text exposed to screen readers
          (PDF.js provides text layer). Page navigation
          announces position. Search results
          announce. Zoom level announces. Keyboard
          shortcuts for all common actions.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          PDF.js as a vendored dependency with a
          stable wrapping layer so version upgrades
          don&rsquo;t cascade. Annotation types in a
          registry. Persistence adapter for
          annotations.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/pdf-viewer-architecture.svg"
        alt="PDF Viewer Architecture"
        caption="PDF source → PDF.js worker (parse, page render to canvas) → Page virtualizer (lazy-mount near-viewport pages) + Text layer (selectable, screen-reader accessible) + Annotation overlay → Toolbar (zoom, search, navigate)."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="important">
          The viewer wraps PDF.js with a React
          component that provides a familiar viewer
          UI. PDF.js handles the heavy lifting (parsing,
          rendering pages to canvas, text extraction);
          our layer handles navigation, virtualization,
          annotations, and integration. The architecture
          has four main parts: <strong>document
          loader</strong>, <strong>page virtualizer</strong>,
          <strong> page renderer</strong> (with text
          and annotation layers), and <strong>toolbar
          and panels</strong>.
        </HighlightBlock>
        <p>
          The <strong>document loader</strong> initializes
          PDF.js with the document URL or buffer. This
          spawns a Web Worker that parses the PDF and
          exposes a document object with metadata
          (page count, outline, etc.). We display a
          loading state until the document is ready;
          first-page rendering can happen in parallel.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The <strong>page virtualizer</strong> renders
          only pages near the viewport (current ±2
          typically). Each page reserves its display
          dimensions (computed from PDF page size and
          current zoom) so scroll position is accurate
          even for unrendered pages. As pages enter
          the near-viewport, they mount and request
          rendering from PDF.js. Off-screen pages
          unmount their canvas after a delay (releasing
          memory) but keep the placeholder.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>page renderer</strong> for each
          mounted page: requests a render from PDF.js
          to a Canvas at the current zoom, draws a
          text layer on top (transparent text positioned
          to match the rendered glyphs, used for
          selection and screen-reader access), draws
          an annotation overlay on top of that. The
          three-layer stack — canvas (visual), text
          (interactive), annotations (interactive) —
          is the standard PDF.js architecture.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Search</strong> uses PDF.js&rsquo;s
          text content extraction. On query, we ask
          PDF.js for text per page, search the text,
          and produce a list of matches with page and
          coordinates. Match navigation jumps to the
          page and highlights via the annotation
          overlay. Search runs progressively for
          large documents — show first matches as
          they&rsquo;re found rather than waiting for
          the full search.
        </HighlightBlock>
        <p>
          <strong>Zoom</strong>: re-renders pages at
          the new scale. PDF.js supports rendering at
          arbitrary scales. To avoid blocking on every
          zoom step, we use canvas transform for fast
          preview, then re-render at the new scale on
          zoom commit (e.g. when scroll wheel stops).
          Fit-to-width and fit-to-page compute the
          right scale based on viewport width/height.
        </p>
        <p>
          <strong>Annotations</strong> live as overlay
          elements positioned in PDF coordinates.
          Highlights wrap text-layer ranges; comments
          attach to coordinates; drawings render as SVG
          in the overlay. On zoom or page rotation, the
          overlay re-positions automatically because
          coordinates are in PDF space, not screen
          space. Annotations persist via an adapter
          (server-side per user). Conflict resolution
          for shared annotations is handled by the
          server.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Outline panel</strong> shows the PDF&rsquo;s
          table of contents (extracted from PDF
          metadata). Clicking entries jumps to the
          target page and position. Thumbnails panel
          shows a small render of each page; we
          virtualize this similarly to the page list
          but at smaller scale.
        </HighlightBlock>
        <p>
          <strong>Text selection</strong> works because
          the text layer overlays the canvas with
          transparent text. Standard browser selection
          works on the text layer; copying produces
          correct text. The selection range is stored
          in PDF coordinates so it survives zoom and
          rotation.
        </p>
        <p>
          <strong>Print and download</strong>: download
          fetches the original PDF. Print uses the
          browser&rsquo;s print dialog with the PDF
          document directly when supported, or falls
          back to printing rendered pages.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>SearchEngine</strong> handles in-document search.{" "}
          <strong>AnnotationManager</strong> handles annotation lifecycle.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Toolbar</strong> renders zoom, navigation, search controls.{" "}
          <Highlight tier="important"><strong>OutlinePanel</strong></Highlight>,{" "}
          <strong>ThumbnailsPanel</strong> are side panels.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">Document state (loaded, error, page count),
          current page, zoom level, search</HighlightBlock>
<HighlightBlock as="p" tier="important">state,
          annotation state — all in external store.
          PDF.js&rsquo;s document</HighlightBlock>
<HighlightBlock as="p" tier="important">object is held as a
          stable ref; methods on it are called as
          needed.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Inputs:</Highlight>{" "}
          <code>source</code> (URL or buffer), <code>initialPage</code>,{" "}
          <code>initialZoom</code>, <code>annotationAdapter</code>,{" "}
          <Highlight tier="important"><code>onAnnotationChange</code></Highlight>. PDF.js
          provides <code>getPage</code>, <code>render</code>,{" "}
          <code>getTextContent</code>, <code>getOutline</code>.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="crucial">Zoom uses canvas transform for
          preview + re-render on commit. Search runs</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">progressively. Memory bounded by releasing
          off-screen page canvases after a delay.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Thumbnails panel
          collapsible. Annotation tools in a secondary
          toolbar when annotation mode</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">is on. Keyboard
          shortcuts (Ctrl+F search, Ctrl+G next match,
          arrow keys navigate, +/- zoom).</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Search
          match count announces. Zoom level
          announces. Annotation tools have
          accessible</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">names. Keyboard parity for all
          actions. Document title and metadata in
          ARIA labels.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          PDF.js sandboxes any embedded JavaScript
          (typically disabled). PDF <Highlight tier="important">source URLs
          authenticated. Cross-origin concerns
          handled</Highlight> via CORS. Annotations sanitized.
          Encrypted PDFs prompt for password.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial">Unit tests for the page virtualizer, search
          engine, annotation overlay positioning.</HighlightBlock>
<HighlightBlock as="p" tier="important">Integration tests with sample PDFs:
          navigation, zoom, search, annotations.</HighlightBlock>
<HighlightBlock as="p" tier="important">Performance tests on large PDFs (500+
          pages). Accessibility tests for text-layer
          screen-reader access.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Right-to-left PDFs (Arabic, Hebrew): text
          layer respects direction. Pages of vastly
          different sizes: virtualizer handles
          variable heights.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Search across page
          boundaries (a phrase split across pages):
          we don&rsquo;t support cross-page matches in
          v1; words within a page work.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The wrapper around PDF.js is reusable for any
          <Highlight tier="important">product needing PDF display. Annotation
          adapter</Highlight> is pluggable (server-side, local-only,
          shared). Toolbar customizable per product.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. PDF text language is
          <Highlight tier="important">the document&rsquo;s own. Right-to-left UI
          flips</Highlight> via CSS logical properties. Search
          uses locale-aware string matching.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>PDF.js vs native browser viewer</h3>
        <HighlightBlock as="p" tier="important">
          Native browser viewers (Chrome&rsquo;s PDF
          viewer, etc.) are fast but uncustomizable.
          PDF.js gives full control, custom
          annotations, and integration but takes
          bundle size and performance overhead. For
          embedded use in apps, PDF.js wins.
        </HighlightBlock>

        <h3>Canvas vs SVG rendering</h3>
        <HighlightBlock as="p" tier="important">
          PDF.js uses canvas by default for
          performance. SVG would give scalable text
          but is much slower. We use canvas with a
          text layer for selection.
        </HighlightBlock>

        <h3>Page virtualization vs all-pages-mounted</h3>
        <HighlightBlock as="p" tier="crucial">
          Virtualization keeps memory bounded for
          large PDFs; all-pages would crash on big
          documents. Virtualization is essential.
        </HighlightBlock>

        <h3>Server-side rendering vs client-side</h3>
        <HighlightBlock as="p" tier="important">
          Server-side rendering (rasterizing PDF on
          server, serving images) avoids client-side
          PDF.js but loses text selection and
          searchability. Client-side rendering with
          PDF.js gives full functionality.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Form filling for AcroForms. Digital signature
          verification UI. <Highlight tier="important">Read-aloud (TTS).
          Server-rendered first-page screenshot for</Highlight>
          instant preview before PDF.js loads.
          Real-time collaborative annotations.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How does PDF rendering work?</strong>{" "}
          PDF.js parses the PDF in a Web Worker and
          renders pages to canvas on demand. We
          virtualize so only near-viewport pages
          render.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does text selection work?</strong>{" "}
          PDF.js extracts text and positions
          transparent text overlays matching the
          rendered glyphs. Standard browser selection
          works on the text layer.
        </HighlightBlock>

        <p>
          <strong>3. How is search implemented?</strong>{" "}
          PDF.js extracts text per page; we search
          across pages, build a match list, jump
          and highlight via annotation overlay.
        </p>

        <p>
          <strong>4. How do annotations survive zoom and
          rotation?</strong> Annotations stored in
          PDF coordinates (not screen). On zoom or
          rotation, the overlay re-positions
          automatically.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>5. How does this scale to large
          PDFs?</strong> Page virtualization scopes
          rendered pages to near-viewport. Text
          extraction is on-demand. Search runs
          progressively.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>6. How is accessibility provided for
          PDFs?</strong> The text layer exposes
          extracted text to screen readers. Without
          PDF.js&rsquo;s text layer, PDFs are
          opaque to assistive tech; this is the
          single most important a11y feature.
        </HighlightBlock>

        <p>
          <strong>7. How are annotations
          persisted?</strong> Adapter pattern: server-
          side per user, local-only, or shared.
          Annotations serialize to a small JSON shape
          (type, coordinates, content).
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>8. What can&rsquo;t this do?</strong>{" "}
          Generate PDFs (server concern). Verify
          digital signatures (specialized libraries).
          Process complex JavaScript-in-PDF (we
          sandbox it). Edit the PDF document itself
          (we display + annotate, not modify the
          underlying PDF).
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">The text
          layer is the foundation for selection and
          accessibility; virtualization keeps memory
          bounded; annotations live</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">in PDF coordinates
          for zoom/rotation resilience. The result
          feels like a desktop PDF reader embedded in
          the web app.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
