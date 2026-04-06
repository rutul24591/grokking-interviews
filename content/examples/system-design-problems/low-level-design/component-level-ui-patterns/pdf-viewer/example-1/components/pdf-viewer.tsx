'use client';
import { useState, useCallback } from 'react';

export function PDFViewer({ src }: { src: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-2 py-1 text-sm disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {currentPage} of {numPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="px-2 py-1 text-sm disabled:opacity-50">Next</button>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="px-2 py-1 text-sm">-</button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="px-2 py-1 text-sm">+</button>
        </div>
      </div>

      {/* Page viewer */}
      <div className="overflow-auto h-[600px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="bg-white shadow-lg w-[612px] min-h-[792px] flex items-center justify-center">
          <span className="text-gray-500">PDF.js renders page {currentPage} here</span>
        </div>
      </div>
    </div>
  );
}
