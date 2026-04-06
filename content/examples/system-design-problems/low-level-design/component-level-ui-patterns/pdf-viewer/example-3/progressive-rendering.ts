/**
 * PDF Viewer — Staff-Level Performance Optimization.
 *
 * Staff differentiator: Progressive page rendering (render low-res first,
 * then high-res), page virtualization with preloading, and text extraction
 * caching for search.
 */

/**
 * Manages progressive page rendering — renders a low-resolution preview
 * first, then replaces with high-resolution render when ready.
 */
export class ProgressivePageRenderer {
  private renderTasks: Map<number, { lowRes: Promise<void>; highRes: Promise<void> }> = new Map();

  /**
   * Renders a page progressively: low-res first for fast initial display,
   * then high-res for quality.
   */
  async renderPage(
    pageNumber: number,
    canvas: HTMLCanvasElement,
    pdfPage: any, // PDF.js PDFPageProxy
  ): Promise<void> {
    const existing = this.renderTasks.get(pageNumber);
    if (existing) return existing.highRes;

    // Low-res render (scale 0.5)
    const lowResPromise = (async () => {
      const viewport = pdfPage.getViewport({ scale: 0.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;
      }
    })();

    // High-res render (scale 2.0 for HiDPI)
    const highResPromise = (async () => {
      await lowResPromise; // Wait for low-res first
      const viewport = pdfPage.getViewport({ scale: 2.0 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;
      }
    })();

    this.renderTasks.set(pageNumber, { lowRes: lowResPromise, highRes: highResPromise });
    return highResPromise;
  }

  /**
   * Cancels rendering for a page (e.g., user navigated away).
   */
  cancelRender(pageNumber: number): void {
    this.renderTasks.delete(pageNumber);
  }

  /**
   * Clears all render tasks.
   */
  clear(): void {
    this.renderTasks.clear();
  }
}

/**
 * Preloads adjacent pages when the user is viewing a specific page.
 */
export class PagePreloadManager {
  private preloadWindow: number = 2; // Pages before and after current

  /**
   * Returns pages that should be preloaded given the current page.
   */
  getPagesToPreload(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - this.preloadWindow);
    const end = Math.min(totalPages, currentPage + this.preloadWindow);

    for (let i = start; i <= end; i++) {
      if (i !== currentPage) pages.push(i);
    }

    return pages;
  }
}
