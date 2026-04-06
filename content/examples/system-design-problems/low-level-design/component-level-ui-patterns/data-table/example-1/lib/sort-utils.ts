import type { RowData, SortConfig } from '../lib/table-types';

/**
 * Sort an array of rows by one or more sort configurations.
 * Uses Array.prototype.toSorted() for immutable sort (React 19+).
 *
 * @param rows - The array of rows to sort
 * @param sortConfigs - Active sort configurations (order matters: first is primary)
 * @returns A new sorted array
 */
export function sortRows<T extends RowData>(
  rows: T[],
  sortConfigs: SortConfig<T>[],
): T[] {
  if (sortConfigs.length === 0 || rows.length === 0) {
    return rows;
  }

  return rows.toSorted((a, b) => {
    for (const config of sortConfigs) {
      const field = config.field;
      const valueA = a[field];
      const valueB = b[field];
      const comparison = compareValues(valueA, valueB);

      if (comparison !== 0) {
        return config.direction === 'asc' ? comparison : -comparison;
      }
      // If equal, continue to next sort config (tiebreaker)
    }
    return 0;
  });
}

/**
 * Compare two values based on their inferred type.
 * Handles string, number, and date comparisons.
 */
function compareValues(a: unknown, b: unknown): number {
  // Handle null/undefined — always sort to the end
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // Number comparison
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return 0;
    if (Number.isNaN(a)) return 1;
    if (Number.isNaN(b)) return -1;
    return a - b;
  }

  // Date comparison — try to parse strings as dates
  if (typeof a === 'string' && typeof b === 'string') {
    const dateA = Date.parse(a);
    const dateB = Date.parse(b);
    if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
      return dateA - dateB;
    }
    // Fall through to string comparison
  }

  // String comparison
  const strA = String(a);
  const strB = String(b);
  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
}
