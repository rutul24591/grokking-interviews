'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

// Minimal PDF.js type declarations for the hook interface
interface PDFPageProxy {
  viewport: { width: number; height: number; scale: number };
  render: (ctx: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number; scale: number; transform: number[] } }) => { promise: Promise<void> };
  getViewport: (options: { scale: number; rotation?: number }) => { width: number; height: number; scale: number; transform: number[] };
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

interface UsePdfRendererOptions {
  url: string;
  initialPage?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  workerSrc?: string;
}

interface UsePdfRendererReturn {
  loading: boolean;
  error: string | null;
  numPages: number;
  currentPage: number;
  zoom: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  fitToWidth: () => void;
  fitToPage: () => void;
}

/**
 * Hook for PDF.js page rendering with canvas sizing and zoom management.
 * Wraps PDF.js document loading, page rendering, and viewport calculations.
 */
export function usePdfRenderer({
  url,
  initialPage = 1,
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 3,
  workerSrc,
}: UsePdfRendererOptions): UsePdfRendererReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoomState] = useState(initialZoom);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
  const zoomRef = useRef(zoom);
  const pageRef = useRef(currentPage);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        // Dynamically import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');
        if (cancelled) return;

        if (workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        }

        const doc = await pdfjsLib.getDocument(url).promise as PDFDocumentProxy;
        if (cancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [url, workerSrc]);

  // Render current page to canvas
  const renderPage = useCallback(
    async (page: PDFPageProxy, canvas: HTMLCanvasElement, scale: number) => {
      // Cancel any in-progress render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const viewport = page.getViewport({ scale });

      // Handle HiDPI displays
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      const context = canvas.getContext('2d');
      if (!context) return;

      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport: {
          width: viewport.width,
          height: viewport.height,
          scale: viewport.scale,
          transform: viewport.transform,
        },
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      try {
        await task.promise;
      } catch (err) {
        if (err instanceof Error && err.name === 'RenderingCancelledException') {
          return; // Expected when navigating quickly
        }
        throw err;
      }
    },
    []
  );

  // Re-render when page or zoom changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;
        await renderPage(page, canvasRef.current, zoom);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render page');
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom, renderPage]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, numPages));
      setCurrentPage(clamped);
    },
    [numPages]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  const zoomIn = useCallback(() => {
    setZoomState((z) => Math.min(maxZoom, z + 0.25));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoomState((z) => Math.max(minZoom, z - 0.25));
  }, [minZoom]);

  const setZoom = useCallback(
    (z: number) => {
      setZoomState(Math.max(minZoom, Math.min(maxZoom, z)));
    },
    [minZoom, maxZoom]
  );

  const fitToWidth = useCallback(() => {
    // Approximate: standard page is ~612pt wide at scale 1
    setZoomState(1);
  }, []);

  const fitToPage = useCallback(() => {
    setZoomState(0.75);
  }, []);

  // Cleanup render task on unmount
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  return {
    loading,
    error,
    numPages,
    currentPage,
    zoom,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement | null>,
    goToPage,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    setZoom,
    fitToWidth,
    fitToPage,
  };
}
