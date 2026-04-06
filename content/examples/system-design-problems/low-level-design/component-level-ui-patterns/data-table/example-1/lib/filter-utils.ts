import type { RowData, FilterConfig } from '../lib/table-types';

/**
 * Filter an array of rows by active filter configurations.
 * Filters combine with AND logic across columns and OR logic within multi-select.
 * Short-circuits on first filter failure for performance.
 *
 * @param rows - The array of rows to filter
 * @param filters - Map of field to filter configuration
 * @returns A new filtered array
 */
export function filterRows<T extends RowData>(
  rows: T[],
  filters: Map<string, FilterConfig>,
): T[] {
  if (filters.size === 0 || rows.length === 0) {
    return rows;
  }

  // Build a single combined predicate to avoid iterating filters per row
  const predicates = buildPredicates(filters);

  return rows.filter((row) => {
    for (const predicate of predicates) {
      if (!predicate(row)) {
        return false; // Short-circuit on first failure
      }
    }
    return true;
  });
}

/** Build an array of predicate functions from the filter map */
function buildPredicates<T extends RowData>(
  filters: Map<string, FilterConfig>,
): Array<(row: T) => boolean> {
  const predicates: Array<(row: T) => boolean> = [];

  for (const [field, config] of filters) {
    switch (config.type) {
      case 'text':
        if (config.value && config.value.trim().length > 0) {
          const query = config.value.toLowerCase().trim();
          predicates.push((row) => {
            const value = row[field];
            if (value == null) return false;
            return String(value).toLowerCase().includes(query);
          });
        }
        break;

      case 'range': {
        const min = config.min !== undefined ? config.min : null;
        const max = config.max !== undefined ? config.max : null;

        if (min === null && max === null) break;

        predicates.push((row) => {
          const value = row[field];
          if (value == null) return false;

          const num = typeof value === 'number' ? value : parseNumeric(value);
          if (num === null) return false;

          if (min !== null && num < min) return false;
          if (max !== null && num > max) return false;
          return true;
        });
        break;
      }

      case 'multi-select':
        if (config.selectedValues && config.selectedValues.size > 0) {
          const selected = config.selectedValues;
          predicates.push((row) => {
            const value = row[field];
            if (value == null) return false;
            return selected.has(String(value));
          });
        }
        break;
    }
  }

  return predicates;
}

/** Try to parse a string as a number (for date timestamps or numeric strings) */
function parseNumeric(value: unknown): number | null {
  if (typeof value === 'string') {
    // Try direct number parse
    const num = Number(value);
    if (!Number.isNaN(num)) return num;

    // Try date parse
    const date = Date.parse(value);
    if (!Number.isNaN(date)) return date;
  }
  return null;
}
