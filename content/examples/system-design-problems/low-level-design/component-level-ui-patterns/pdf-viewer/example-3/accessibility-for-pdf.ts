/**
 * PDF Viewer — Staff-Level Accessibility for PDF Content.
 *
 * Staff differentiator: Extracted text layer for screen reader access,
 * keyboard navigation between pages, and ARIA landmarks for PDF sections.
 */

/**
 * Extracts text content from a PDF page for screen reader access.
 * In production, uses PDF.js to extract text content and create a hidden
 * text layer that screen readers can access.
 */
export function createAccessibleTextLayer(
  pageCanvas: HTMLCanvasElement,
  textContent: { items: Array<{ str: string; transform: number[] }> },
): HTMLDivElement {
  const textLayer = document.createElement('div');
  textLayer.className = 'textLayer';
  textLayer.setAttribute('role', 'text');
  textLayer.setAttribute('aria-label', 'PDF page content');

  for (const item of textContent.items) {
    const span = document.createElement('span');
    span.textContent = item.str;
    span.style.position = 'absolute';
    span.style.left = `${item.transform[4]}px`;
    span.style.top = `${item.transform[5]}px`;
    span.style.fontSize = `${Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])}px`;
    textLayer.appendChild(span);
  }

  // Position overlay on top of canvas
  textLayer.style.position = 'absolute';
  textLayer.style.top = '0';
  textLayer.style.left = '0';
  textLayer.style.width = '100%';
  textLayer.style.height = '100%';

  return textLayer;
}

/**
 * Keyboard navigation for PDF viewer.
 * Arrow keys for page navigation, +/- for zoom, Ctrl+F for search.
 */
export function usePdfKeyboardNavigation(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  onZoom: (delta: number) => void,
  onSearch: () => void,
) {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'f') { e.preventDefault(); onSearch(); }
      if (e.key === '=' || e.key === '+') { e.preventDefault(); onZoom(0.25); }
      if (e.key === '-') { e.preventDefault(); onZoom(-0.25); }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        onPageChange(Math.max(1, currentPage - 1));
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        onPageChange(Math.min(totalPages, currentPage + 1));
        break;
      case 'Home':
        e.preventDefault();
        onPageChange(1);
        break;
      case 'End':
        e.preventDefault();
        onPageChange(totalPages);
        break;
    }
  }, [currentPage, totalPages, onPageChange, onZoom, onSearch]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
}
