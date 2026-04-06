interface PaginationRangeProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function PaginationRange({
  currentPage,
  pageSize,
  totalItems,
}: PaginationRangeProps) {
  if (totalItems === 0) {
    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        No results found
      </span>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <span className="text-sm text-gray-600 dark:text-gray-400">
      Showing{" "}
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {startItem}
      </span>
      {" \u2013 "}
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {endItem}
      </span>{" "}
      of{" "}
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {totalItems}
      </span>
      <span className="sr-only">
        , showing items {startItem} to {endItem} out of {totalItems} total items
      </span>
    </span>
  );
}
