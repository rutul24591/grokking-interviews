import { usePagination } from "../../hooks/use-pagination";
import { PageButton } from "./page-button";
import { PageSizeSelector } from "./page-size-selector";
import { PaginationRange } from "./pagination-range";
import type { PaginationConfig } from "../../lib/pagination-types";

const DEFAULT_CONFIG: PaginationConfig = {
  siblingCount: 2,
  pageSizeOptions: [10, 25, 50, 100],
  showFirstLast: true,
  showRangeText: true,
  mode: "server",
};

interface PaginationProps {
  config?: Partial<PaginationConfig>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export function Pagination({
  config,
  onPageChange,
  onPageSizeChange,
  className = "",
}: PaginationProps) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const {
    currentPage,
    pageSize,
    totalPages,
    pageRange,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    goToFirst,
    goToLast,
    changePageSize,
  } = usePagination({ siblingCount: mergedConfig.siblingCount });

  const handlePageChange = (page: number) => {
    goToPage(page);
    onPageChange?.(page);
  };

  const handleNext = () => {
    nextPage();
    onPageChange?.(currentPage + 1);
  };

  const handlePrev = () => {
    prevPage();
    onPageChange?.(currentPage - 1);
  };

  const handleFirst = () => {
    goToFirst();
    onPageChange?.(1);
  };

  const handleLast = () => {
    goToLast();
    onPageChange?.(totalPages);
  };

  const handlePageSizeChange = (size: number) => {
    changePageSize(size);
    onPageSizeChange?.(size);
  };

  if (totalPages <= 1) {
    return mergedConfig.showRangeText ? (
      <PaginationRange
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={pageRange.totalItems}
      />
    ) : null;
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-col gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-center gap-4">
        {mergedConfig.showRangeText && (
          <PaginationRange
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={pageRange.totalItems}
          />
        )}
        <PageSizeSelector
          pageSizeOptions={mergedConfig.pageSizeOptions}
          currentPageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <div className="flex items-center gap-1">
        {mergedConfig.showFirstLast && (
          <PageButton
            type="navigation"
            direction="first"
            onClick={handleFirst}
            disabled={!hasPrev}
            ariaLabel="Go to first page"
          />
        )}

        <PageButton
          type="navigation"
          direction="prev"
          onClick={handlePrev}
          disabled={!hasPrev}
          ariaLabel="Go to previous page"
        />

        <div className="hidden sm:flex items-center gap-1">
          {pageRange.items.map((item, index) => (
            <PageButton
              key={item.type === "ellipsis" ? `ellipsis-${index}` : `page-${item.value}`}
              type={item.type}
              value={item.value}
              isActive={item.type === "page" && item.value === currentPage}
              onClick={item.type === "page" ? () => handlePageChange(item.value) : undefined}
              ariaLabel={
                item.type === "page" ? `Go to page ${item.value}` : undefined
              }
            />
          ))}
        </div>

        <PageButton
          type="navigation"
          direction="next"
          onClick={handleNext}
          disabled={!hasNext}
          ariaLabel="Go to next page"
        />

        {mergedConfig.showFirstLast && (
          <PageButton
            type="navigation"
            direction="last"
            onClick={handleLast}
            disabled={!hasNext}
            ariaLabel="Go to last page"
          />
        )}
      </div>
    </nav>
  );
}
