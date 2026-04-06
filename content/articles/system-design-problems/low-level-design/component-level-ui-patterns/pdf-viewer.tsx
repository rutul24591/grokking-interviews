"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pdf-viewer",
  title: "Design a PDF Viewer Component",
  description:
    "PDF viewer with page navigation, zoom, annotations, text search within PDF, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "pdf-viewer",
  wordCount: 3200,
  readingTime: 17,
  lastUpdated: "2026-04-03",
  tags: ["lld", "pdf", "viewer", "zoom", "annotations", "text-search", "accessibility"],
  relatedTopics: ["code-editor-component", "image-gallery-lightbox", "rich-text-editor"],
};

export default function PDFViewerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a PDF viewer component — a UI for displaying PDF documents
          with page navigation, zoom controls, text search within the document, optional
          annotation support (highlights, notes), and full keyboard accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong> PDFs are loaded from a URL. The viewer uses
          PDF.js for rendering. Pages render as canvas elements. The viewer supports
          50+ page documents with virtualized rendering.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Page Navigation:</strong> Previous/Next buttons, page number input, thumbnail sidebar for quick navigation.</li>
          <li><strong>Zoom:</strong> Zoom in/out, fit-to-width, fit-to-page, custom zoom percentage.</li>
          <li><strong>Text Search:</strong> Search within PDF text content, highlight matches, navigate between matches.</li>
          <li><strong>Annotations:</strong> Highlight text, add notes/sticky notes, draw shapes (rectangle, freehand).</li>
          <li><strong>Download/Print:</strong> Download original PDF, print current page or all pages.</li>
          <li><strong>Rotation:</strong> Rotate page 90° clockwise/counterclockwise.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 100+ page PDF loads smoothly. Pages render on-demand (virtualized).</li>
          <li><strong>Accessibility:</strong> Screen reader reads PDF text content, keyboard navigation between pages and controls.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Corrupted PDF — show error message with retry option.</li>
          <li>Password-protected PDF — prompt for password before rendering.</li>
          <li>Very large page (e.g., A0 poster size) — scale down to fit viewport.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>PDF.js-based viewer</strong> that loads the PDF
          document, renders pages as canvas elements on demand, and provides a toolbar
          for navigation, zoom, and search. A <strong>Zustand store</strong> manages
          the current page, zoom level, search results, and annotations. Pages are
          virtualized — only visible pages render, reducing memory usage.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. PDF Loader</h4>
          <p>Uses PDF.js to load the document, parse pages, extract text content for search. Handles password prompts and error states.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Page Renderer</h4>
          <p>Renders pages as canvas elements at the current zoom level. Uses IntersectionObserver to render only visible pages.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Search Engine</h4>
          <p>Extracts text content from all pages, builds a text index, finds matches for the search query, highlights matches on rendered pages.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Annotation Layer</h4>
          <p>SVG overlay on top of the canvas for highlights, notes, and shapes. Annotations persist to localStorage or server.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/pdf-viewer-architecture.svg"
          alt="PDF viewer architecture showing page rendering, text search, and annotation layers"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>PDF loads from URL → PDF.js parses document → store gets page count.</li>
          <li>First page renders as canvas. Text content extracted for search.</li>
          <li>User scrolls → IntersectionObserver triggers rendering of newly visible pages.</li>
          <li>User searches → text index queried, matches highlighted across all pages.</li>
          <li>User adds annotation → SVG overlay renders highlight on current page.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          PDF URL → fetch → PDF.js parse → page metadata → render visible pages →
          extract text → build search index → user interaction (zoom/search/annotate)
          → re-render affected pages.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Password-protected PDF:</strong> PDF.js throws a password exception. The viewer shows a password prompt. On correct password, re-parses the document.</li>
          <li><strong>Large pages:</strong> Pages larger than the viewport are scaled down to fit. Zoom controls allow the user to zoom in for detail.</li>
          <li><strong>Corrupted PDF:</strong> PDF.js throws a parse error. The viewer shows an error state with &quot;This PDF could not be loaded&quot; and a retry button.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: PDF.js for parsing and rendering, canvas-based page rendering,
          IntersectionObserver for virtualized page rendering, SVG overlay for annotations,
          and full ARIA compliance for screen reader text access.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Page render</td><td className="p-2">O(w × h) — canvas fill</td><td className="p-2">O(w × h) — canvas buffer</td></tr>
              <tr><td className="p-2">Text search</td><td className="p-2">O(t) — t = total text length</td><td className="p-2">O(t) — text index</td></tr>
              <tr><td className="p-2">Annotation render</td><td className="p-2">O(a) — a annotations per page</td><td className="p-2">O(a)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          PDF URLs are validated against an allowlist. PDF.js renders in a sandboxed
          iframe to prevent script execution within the PDF. For accessibility, the PDF
          text content is extracted and rendered as hidden text layers behind the canvas,
          allowing screen readers to read the document content. Keyboard: Arrow keys
          scroll, Ctrl+F opens search, Ctrl++/- for zoom.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> PDF loader — test parse, password handling, error states. Search engine — test text extraction, match finding.</li>
          <li><strong>Integration:</strong> Load PDF, verify first page renders. Scroll, verify virtualized pages render. Search, verify highlights appear.</li>
          <li><strong>Accessibility:</strong> Screen reader reads PDF text content, keyboard navigation between pages, zoom controls accessible.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Rendering all pages at once:</strong> A 100-page PDF rendered as 100 canvas elements causes memory issues. Virtualized rendering is mandatory.</li>
          <li><strong>No text layer for accessibility:</strong> Canvas-only rendering is invisible to screen readers. A hidden text layer behind the canvas is essential.</li>
          <li><strong>No error handling:</strong> Corrupted or password-protected PDFs crash the viewer. Graceful error states are essential.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement collaborative PDF annotation?</p>
            <p className="mt-2 text-sm">
              A: Use WebSocket to broadcast annotation events (add, edit, delete).
              Each annotation has a unique ID and user attribution. Conflicts resolved
              by last-write-wins. Annotations sync across all viewers in real-time.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement form filling within the PDF?</p>
            <p className="mt-2 text-sm">
              A: PDF.js parses form fields (text inputs, checkboxes, dropdowns) from
              the PDF annotation layer. Render HTML form elements overlaid on the canvas
              at the field positions. On submit, update the PDF annotation data and
              export the filled form as a new PDF.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle scanned PDFs (image-only, no text layer)?</p>
            <p className="mt-2 text-sm">
              A: Use OCR (Tesseract.js server-side or client-side) to extract text from
              the scanned image. Generate a text layer from the OCR output. Note: OCR
              accuracy varies — show a confidence indicator and allow manual correction.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement split-view (two PDFs side by side)?</p>
            <p className="mt-2 text-sm">
              A: Two independent PDF viewer instances sharing a scroll position. When
              one viewer scrolls, the other scrolls proportionally. Useful for document
              comparison. Sync page numbers: navigating to page 5 in one viewer navigates
              to page 5 in the other.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://mozilla.github.io/pdf.js/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PDF.js — Mozilla&apos;s PDF Rendering Library
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/document/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Document Pattern — PDF Accessibility
            </a>
          </li>
          <li>
            <a href="https://github.com/naptha/tesseract.js" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Tesseract.js — Client-Side OCR
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
