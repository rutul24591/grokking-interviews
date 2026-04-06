interface PageSizeSelectorProps {
  pageSizeOptions: number[];
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function PageSizeSelector({
  pageSizeOptions,
  currentPageSize,
  onPageSizeChange,
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="page-size-select"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        Items per page:
      </label>
      <select
        id="page-size-select"
        value={currentPageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        aria-label="Select items per page"
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
