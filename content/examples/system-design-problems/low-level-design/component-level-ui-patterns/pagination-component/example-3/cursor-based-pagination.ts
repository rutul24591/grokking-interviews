/**
 * Pagination — Staff-Level Server-Side Pagination with Cursor-Based Navigation.
 *
 * Staff different traditional offset pagination has performance issues
 * at high page numbers. Staff differentiator: cursor-based pagination
 * with forward/backward navigation and stable ordering.
 */

export interface CursorPage<T> {
  items: T[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/**
 * Encodes a cursor from an item's sort key.
 */
export function encodeCursor(sortKey: string | number): string {
  return btoa(String(sortKey));
}

/**
 * Decodes a cursor back to the sort key.
 */
export function decodeCursor(cursor: string): string {
  return atob(cursor);
}

/**
 * Fetches a page of results using cursor-based pagination.
 * More efficient than offset pagination for large datasets.
 */
export async function fetchCursorPage<T>(
  fetchFn: (params: { cursor?: string; limit: number; direction: 'forward' | 'backward' }) => Promise<{ items: T[]; sortKeys: (string | number)[] }>,
  cursor?: string,
  limit: number = 25,
  direction: 'forward' | 'backward' = 'forward',
): Promise<CursorPage<T>> {
  const result = await fetchFn({ cursor, limit, direction });

  const startCursor = result.sortKeys.length > 0 ? encodeCursor(result.sortKeys[0]) : null;
  const endCursor = result.sortKeys.length > 0 ? encodeCursor(result.sortKeys[result.sortKeys.length - 1]) : null;

  return {
    items: result.items,
    hasPreviousPage: direction === 'backward',
    hasNextPage: result.items.length >= limit,
    startCursor,
    endCursor,
  };
}

/**
 * Hook that manages cursor-based pagination state.
 */
export function useCursorPagination<T>(
  fetchFn: (params: { cursor?: string; limit: number; direction: 'forward' | 'backward' }) => Promise<{ items: T[]; sortKeys: (string | number)[] }>,
  pageSize: number = 25,
) {
  return {
    fetchPage: (cursor?: string, direction: 'forward' | 'backward' = 'forward') =>
      fetchCursorPage(fetchFn, cursor, pageSize, direction),
    pageSize,
  };
}
