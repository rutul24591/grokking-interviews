import { useCallback, useState, useRef, useEffect } from 'react';
import type { RowData, Column, SortDirection } from '../lib/table-types';
import { useColumnResizer } from '../hooks/use-column-resizer';
import type { UseStoreApi } from 'zustand';

interface TableHeaderProps<T extends RowData> {
  columns: Column<T>[];
  allRowIds: string[];
  allSelected: boolean;
  onSelectAll: () => void;
  store: UseStoreApi<{
    sort: { field: string; direction: 'asc' | 'desc'; isMulti?: boolean }[];
    columnWidths: Record<string, number>;
    setColumnWidth: (field: string, width: number) => void;
    setSort: (field: string, isMulti?: boolean) => void;
    toggleColumnVisibility: (field: string) => void;
    hiddenColumns: Set<string>;
  }>;
}

export function TableHeader<T extends RowData>({
  columns,
  allRowIds,
  allSelected,
  onSelectAll,
  store,
}: TableHeaderProps<T>) {
  const sort = store((s) => s.sort);
  const columnWidths = store((s) => s.columnWidths);
  const setColumnWidth = store((s) => s.setColumnWidth);
  const setSort = store((s) => s.setSort);
  const hiddenColumns = store((s) => s.hiddenColumns);
  const toggleColumnVisibility = store((s) => s.toggleColumnVisibility);

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close column menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getSortDirection = useCallback(
    (field: string): SortDirection => {
      const sortConfig = sort.find((s) => s.field === field);
      return sortConfig ? sortConfig.direction : 'none';
    },
    [sort],
  );

  const handleSortClick = useCallback(
    (field: string, isMulti: boolean) => {
      setSort(field, isMulti);
    },
    [setSort],
  );

  const visibleColumns = columns.filter((c) => !hiddenColumns.has(c.field));

  return (
    <thead>
      <tr className="sticky top-0 z-10 bg-panel-soft border-b border-theme">
        {/* Selection checkbox column */}
        <th
          className="sticky top-0 z-20 w-12 border-r border-theme bg-panel-soft px-3 py-2 text-center"
          role="columnheader"
        >
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-theme bg-panel text-accent focus:ring-accent"
            aria-label="Select all rows"
          />
        </th>

        {/* Data columns */}
        {visibleColumns.map((col) => {
          const direction = getSortDirection(col.field);
          const resizer = useColumnResizer(store, col.field, col.minWidth ?? 80);

          return (
            <th
              key={col.field}
              className="sticky top-0 z-10 border-r border-theme bg-panel-soft px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ width: resizer.width, minWidth: col.minWidth ?? 80 }}
              role="columnheader"
              aria-sort={
                direction === 'asc'
                  ? 'ascending'
                  : direction === 'desc'
                    ? 'descending'
                    : 'none'
              }
            >
              <div className="flex items-center justify-between gap-2">
                {/* Sortable header */}
                {col.sortable ? (
                  <button
                    onClick={(e) => handleSortClick(col.field, e.shiftKey)}
                    className="flex flex-1 items-center gap-1 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded px-1"
                    aria-label={`Sort by ${col.label}`}
                  >
                    <span className="truncate">{col.label}</span>
                    <SortIndicator direction={direction} />
                  </button>
                ) : (
                  <span className="flex-1 truncate">{col.label}</span>
                )}

                {/* Resize handle */}
                <div
                  className="w-1 h-5 cursor-col-resize hover:bg-accent/50 rounded transition-colors flex-shrink-0"
                  onPointerDown={resizer.onPointerDown}
                  role="separator"
                  aria-label={`Resize ${col.label} column`}
                  tabIndex={0}
                />
              </div>
            </th>
          );
        })}

        {/* Column visibility toggle */}
        <th className="sticky top-0 z-10 w-10 border-r border-theme bg-panel-soft px-2 py-2 text-center">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="p-1 rounded hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle column visibility"
            aria-expanded={showColumnMenu}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>

          {showColumnMenu && (
            <div
              ref={menuRef}
              className="absolute right-4 mt-2 w-48 rounded-lg border border-theme bg-panel shadow-lg z-50 p-2"
              role="menu"
            >
              <p className="text-xs font-semibold px-2 py-1 text-muted">Toggle Columns</p>
              {columns.map((col) => (
                <label
                  key={col.field}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-panel-hover cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={!hiddenColumns.has(col.field)}
                    onChange={() => toggleColumnVisibility(col.field)}
                    className="h-4 w-4 rounded border-theme text-accent focus:ring-accent"
                  />
                  <span className="truncate">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </th>
      </tr>
    </thead>
  );
}

/** Sort direction indicator icon */
function SortIndicator({ direction }: { direction: SortDirection }) {
  if (direction === 'none') {
    return (
      <svg className="w-3 h-3 opacity-40 flex-shrink-0" viewBox="0 0 12 12">
        <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
        <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
      </svg>
    );
  }

  if (direction === 'asc') {
    return (
      <svg className="w-3 h-3 text-accent flex-shrink-0" viewBox="0 0 12 12">
        <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
        <path d="M6 10L3 7H9L6 10Z" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg className="w-3 h-3 text-accent flex-shrink-0" viewBox="0 0 12 12">
      <path d="M6 2L9 5H3L6 2Z" fill="currentColor" opacity="0.3" />
      <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
    </svg>
  );
}
