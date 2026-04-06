import { useCallback } from 'react';
import { PAGE_SIZE_OPTIONS } from '../lib/table-types';
import type { UseStoreApi } from 'zustand';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  totalRows: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  store: UseStoreApi<{
    pagination: { pageSize: number };
  }>;
}

/**
 * Pagination component with page numbers, prev/next buttons, page size selector,
 * and current range display.
 */
export function Pagination({
  totalPages,
  currentPage,
  startIndex,
  endIndex,
  totalRows,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onPageSizeChange,
  store,
}: PaginationProps) {
  const pageSize = store((s) => s.pagination.pageSize);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(e.target.value));
    },
    [onPageSizeChange],
  );

  // Generate page numbers with ellipsis for large page counts
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t border-theme bg-panel-soft"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Left: page size selector and range info */}
      <div className="flex items-center gap-3">
        <span className="text-sm">
          Showing {totalRows === 0 ? 0 : startIndex + 1}&ndash;{endIndex} of{' '}
          {totalRows.toLocaleString()}
        </span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="text-sm rounded border border-theme bg-panel px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="px-3 py-1 text-sm rounded border border-theme disabled:opacity-40 disabled:cursor-not-allowed hover:bg-panel-hover focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Previous page"
        >
          Prev
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-sm">
                &hellip;
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-[2rem] px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-accent ${
                page === currentPage
                  ? 'bg-accent text-white font-semibold'
                  : 'border border-theme hover:bg-panel-hover'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 text-sm rounded border border-theme disabled:opacity-40 disabled:cursor-not-allowed hover:bg-panel-hover focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * Generate an array of page numbers with ellipsis for large page counts.
 * E.g., [1, 2, 3, '...', 50, 51, 52] for page 25 of 100.
 */
function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}
