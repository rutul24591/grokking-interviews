# PDF Viewer Component — Implementation

## Key Decisions
1. **PDF.js** — Mozilla's PDF rendering engine, canvas-based page rendering
2. **Virtualized page rendering** — IntersectionObserver renders only visible pages
3. **Text layer for accessibility** — Hidden text elements behind canvas for screen readers
4. **SVG annotation overlay** — Highlights, notes drawn as SVG on top of canvas

## File Structure
- `lib/pdf-types.ts` — PDFState, Annotation types
- `lib/pdf-loader.ts` — PDF.js wrapper, password handling, error states
- `lib/pdf-search.ts` — Text extraction, match finding, highlighting
- `lib/annotation-layer.ts` — SVG overlay for highlights, notes, shapes
- `hooks/use-pdf.ts` — Main hook with PDF.js initialization
- `hooks/use-page-renderer.ts` — Per-page canvas rendering with IntersectionObserver
- `components/pdf-viewer.tsx` — Root viewer with toolbar, page container
- `components/page-canvas.tsx` — Canvas-based page rendering
- `components/text-layer.tsx` — Hidden text for screen reader access
- `components/pdf-toolbar.tsx` — Navigation, zoom, search controls
- `components/pdf-search-widget.tsx` — Text search with match navigation
- `EXPLANATION.md`

## Testing
- Unit: PDF loader (parse, password, errors), search engine (text extraction, matches)
- Integration: load PDF → first page renders, scroll → virtualized pages render, search → highlights
- Accessibility: screen reader reads text layer, keyboard navigation
