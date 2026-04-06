'use client';
import { useCallback, useState } from 'react';

interface PDFToolbarProps {
  currentPage: number;
  numPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onRotate?: (degrees: number) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onSearchToggle?: () => void;
  className?: string;
}

export function PDFToolbar({
  currentPage,
  numPages,
  zoom,
  onPageChange,
  onZoomChange,
  onRotate,
  onDownload,
  onPrint,
  onSearchToggle,
  className = '',
}: PDFToolbarProps) {
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const zoomIn = useCallback(() => {
    onZoomChange(Math.min(3, zoom + 0.25));
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    onZoomChange(Math.max(0.25, zoom - 0.25));
  }, [zoom, onZoomChange]);

  const fitWidth = useCallback(() => onZoomChange(1), [onZoomChange]);
  const fitPage = useCallback(() => onZoomChange(0.75), [onZoomChange]);

  const rotate = useCallback(() => {
    onRotate?.(90);
  }, [onRotate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPageChange(Math.max(1, currentPage - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onPageChange(Math.min(numPages, currentPage + 1));
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSearchToggle?.();
      } else if (e.key === 'Home') {
        e.preventDefault();
        onPageChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        onPageChange(numPages);
      }
    },
    [currentPage, numPages, onPageChange, zoomIn, zoomOut, onSearchToggle]
  );

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 text-sm ${className}`}
      onKeyDown={handleKeyDown}
      role="toolbar"
      aria-label="PDF viewer controls"
    >
      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <input
          type="number"
          min={1}
          max={numPages}
          value={currentPage}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) onPageChange(Math.max(1, Math.min(numPages, val)));
          }}
          className="w-12 text-center px-1 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
          aria-label="Current page"
        />
        <span className="text-gray-600 dark:text-gray-400">/ {numPages}</span>
        <button
          onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 relative">
        <button onClick={zoomOut} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Zoom out">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <button
          onClick={() => setShowZoomMenu(!showZoomMenu)}
          className="px-2 py-0.5 min-w-[3rem] text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          aria-label="Zoom level"
          aria-expanded={showZoomMenu}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={zoomIn} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Zoom in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>

        {showZoomMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1 z-10 min-w-[8rem]">
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3].map((z) => (
              <button
                key={z}
                onClick={() => { onZoomChange(z); setShowZoomMenu(false); }}
                className={`w-full text-left px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${Math.abs(zoom - z) < 0.01 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {Math.round(z * 100)}%
              </button>
            ))}
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button onClick={() => { fitWidth(); setShowZoomMenu(false); }} className="w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Fit width</button>
            <button onClick={() => { fitPage(); setShowZoomMenu(false); }} className="w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Fit page</button>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />

      {/* Actions */}
      <div className="flex items-center gap-1 ml-auto">
        {onSearchToggle && (
          <button onClick={onSearchToggle} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Search in document" title="Search (Ctrl+F)">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        )}
        {onRotate && (
          <button onClick={rotate} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Rotate" title="Rotate">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        )}
        {onPrint && (
          <button onClick={onPrint} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Print" title="Print">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        )}
        {onDownload && (
          <button onClick={onDownload} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Download" title="Download">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
