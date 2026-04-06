/**
 * Ellipsis Edge Cases — Handles ellipsis placement for small and large page counts.
 *
 * Interview edge case: With 7 total pages and current page 4, showing
 * [1] [2] [3] [4] [5] [6] [7] is fine. With 50 pages and current 25, showing
 * all 50 is impossible. Ellipsis must adapt: [1] ... [24] [25] [26] ... [50].
 * Edge case: when near start/end, ellipsis position changes.
 */

export interface PageItem {
  type: 'page' | 'ellipsis';
  page?: number;
}

/**
 * Generates page items with ellipsis for pagination display.
 *
 * Rules:
 * - Always show first and last page
 * - Show current page ± 1 sibling
 * - Use ellipsis when there's a gap > 1
 * - When total pages <= window, show all pages (no ellipsis)
 */
export function generatePaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): PageItem[] {
  if (totalPages <= 7) {
    // Show all pages when total is small
    return Array.from({ length: totalPages }, (_, i) => ({ type: 'page' as const, page: i + 1 }));
  }

  const items: PageItem[] = [];
  const firstPage = 1;
  const lastPage = totalPages;
  const leftSibling = Math.max(currentPage - siblingCount, firstPage + 1);
  const rightSibling = Math.min(currentPage + siblingCount, lastPage - 1);

  // Always show first page
  items.push({ type: 'page', page: firstPage });

  // Left ellipsis
  if (leftSibling > firstPage + 2) {
    items.push({ type: 'ellipsis' });
  } else if (leftSibling === firstPage + 2) {
    items.push({ type: 'page', page: firstPage + 1 });
  }

  // Pages around current
  for (let i = leftSibling; i <= rightSibling; i++) {
    items.push({ type: 'page', page: i });
  }

  // Right ellipsis
  if (rightSibling < lastPage - 2) {
    items.push({ type: 'ellipsis' });
  } else if (rightSibling === lastPage - 2) {
    items.push({ type: 'page', page: lastPage - 1 });
  }

  // Always show last page
  items.push({ type: 'page', page: lastPage });

  return items;
}
