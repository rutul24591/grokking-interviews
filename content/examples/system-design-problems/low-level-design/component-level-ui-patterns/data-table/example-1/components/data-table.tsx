'use client';

import { useMemo, useCallback, useRef } from 'react';
import type { RowData, Column } from '../lib/table-types';
import {
  VIRTUALIZATION_THRESHOLD,
  DEFAULT_ROW_HEIGHT,
} from '../lib/table-types';
import { createTableStore } from '../lib/table-store';
import { sortRows } from '../lib/sort-utils';
import { filterRows } from '../lib/filter-utils';
import { usePagination } from '../hooks/use-pagination';
import { useVirtualization } from '../hooks/use-virtualization';
import { TableHeader } from './components/table-header';
import { TableRow } from './components/table-row';
import { Pagination } from './components/pagination';
import { FilterBar } from './components/filter-bar';

interface DataTableProps<T extends RowData> {
  /** Column definitions */
  columns: Column<T>[];
  /** Row data (client-side mode) */
  data: T[];
  /** Unique table ID for localStorage persistence */
  tableId?: string;
  /** Enable server-side mode (data is pre-sorted/filtered/paginated from API) */
  serverSide?: boolean;
  /** Row height in pixels for virtualization */
  rowHeight?: number;
  /** Show filter bar above the table */
  enableFilters?: boolean;
  /** Enable virtualization (auto-enabled when data.length > threshold) */
  enableVirtualization?: boolean;
  /** Export callback — pass a function that triggers download */
  onExport?: (format: 'csv' | 'json') => void;
}

/**
 * Production-grade data table component.
 * Supports sorting, filtering, pagination, column resizing, virtualization,
 * row selection, column visibility toggle, and export.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  tableId = 'default',
  serverSide = false,
  rowHeight = DEFAULT_ROW_HEIGHT,
  enableFilters = true,
  enableVirtualization: virtualizationOverride,
}: DataTableProps<T>) {
  // Create the Zustand store (memoized by tableId + columns)
  const store = useMemo(
    () =>
      createTableStore<T>({
        tableId,
        columns,
        serverSide,
      }),
    [tableId, columns, serverSide],
  );

  // Read store state
  const sort = store((s) => s.sort);
  const filters = store((s) => s.filters);
  const pagination = store((s) => s.pagination);
  const selectedRows = store((s) => s.selectedRows);
  const hiddenColumns = store((s) => s.hiddenColumns);
  const columnWidths = store((s) => s.columnWidths);
  const toggleRowSelection = store((s) => s.toggleRowSelection);
  const toggleSelectAll = store((s) => s.toggleSelectAll);
  const selectRange = store((s) => s.selectRange);
  const clearSelection = store((s) => s.clearSelection);
  const lastSelectedIndex = store((s) => s.lastSelectedIndex);

  // Derive visible columns
  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.has(c.field)),
    [columns, hiddenColumns],
  );

  // Data pipeline: filter → sort → paginate
  const filteredRows = useMemo(
    () => (serverSide ? data : filterRows(data, filters)),
    [data, filters, serverSide],
  );

  const sortedRows = useMemo(
    () => (serverSide ? filteredRows : sortRows(filteredRows, sort)),
    [filteredRows, sort, serverSide],
  );

  // Update total rows in store (for pagination)
  const setTotalRows = store((s) => s.setTotalRows);
  const prevTotalRef = useRef(sortedRows.length);
  if (prevTotalRef.current !== sortedRows.length) {
    setTotalRows(sortedRows.length);
    prevTotalRef.current = sortedRows.length;
  }

  // Pagination
  const paginationResult = usePagination(store, sortedRows);
  const { paginatedRows, totalPages, startIndex, endIndex, hasNextPage, hasPrevPage } =
    paginationResult;

  // Virtualization
  const shouldVirtualize =
    virtualizationOverride ?? sortedRows.length > VIRTUALIZATION_THRESHOLD;
  const virtualization = useVirtualization(
    paginatedRows.length,
    rowHeight,
    shouldVirtualize,
  );

  const virtualizedRows = useMemo(() => {
    if (!shouldVirtualize) return paginatedRows;
    return paginatedRows.slice(
      virtualization.startIndex,
      virtualization.endIndex,
    );
  }, [paginatedRows, virtualization.startIndex, virtualization.endIndex, shouldVirtualize]);

  // Row selection helpers
  const allRowIds = useMemo(
    () => sortedRows.map((_, i) => String(i)),
    [sortedRows],
  );

  const paginatedRowIds = useMemo(
    () => paginatedRows.map((_, i) => String(startIndex + i)),
    [paginatedRows, startIndex],
  );

  const allSelected =
    paginatedRowIds.length > 0 &&
    paginatedRowIds.every((id) => selectedRows.has(id));

  const handleSelectAll = useCallback(() => {
    toggleSelectAll(paginatedRowIds);
  }, [toggleSelectAll, paginatedRowIds]);

  const handleToggleRow = useCallback(
    (rowId: string, index: number, shiftKey: boolean) => {
      if (shiftKey && lastSelectedIndex !== null) {
        // Range selection: select all rows between lastSelectedIndex and index
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const rangeIds: string[] = [];
        for (let i = start; i <= end; i++) {
          rangeIds.push(String(i));
        }
        selectRange(rangeIds);
      } else {
        toggleRowSelection(rowId, index, shiftKey);
      }
    },
    [toggleRowSelection, selectRange, lastSelectedIndex],
  );

  // Export function
  const handleExport = useCallback(
    (format: 'csv' | 'json') => {
      const rowsToExport = sortedRows; // Export all filtered+sorted rows
      const colsToExport = visibleColumns;

      if (format === 'csv') {
        const header = colsToExport.map((c) => `"${c.label}"`).join(',');
        const csvRows = rowsToExport.map((row) =>
          colsToExport
            .map((col) => {
              const value = row[col.field];
              const str = value == null ? '' : String(value);
              // Escape quotes and wrap in quotes if contains comma/quote/newline
              if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(','),
        );
        const csv = [header, ...csvRows].join('\n');
        downloadFile(csv, 'table-export.csv', 'text/csv');
      } else {
        const json = rowsToExport.map((row) => {
          const obj: Record<string, unknown> = {};
          colsToExport.forEach((col) => {
            obj[col.label] = row[col.field];
          });
          return obj;
        });
        downloadFile(JSON.stringify(json, null, 2), 'table-export.json', 'application/json');
      }
    },
    [sortedRows, visibleColumns],
  );

  return (
    <div className="flex flex-col border border-theme rounded-lg overflow-hidden bg-panel">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-theme bg-panel-soft">
        <h3 className="text-sm font-semibold">
          {sortedRows.length.toLocaleString()} rows
          {selectedRows.size > 0 && ` · ${selectedRows.size} selected`}
        </h3>
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && (
            <button
              onClick={clearSelection}
              className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Clear selection
            </button>
          )}
          <button
            onClick={() => handleExport('csv')}
            className="text-sm border border-theme rounded px-3 py-1 hover:bg-panel-hover focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="text-sm border border-theme rounded px-3 py-1 hover:bg-panel-hover focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {enableFilters && <FilterBar columns={columns} store={store} />}

      {/* Table */}
      <div
        ref={virtualization.containerRef}
        className="overflow-auto flex-1"
        style={{ maxHeight: '70vh' }}
        role="table"
        aria-label="Data table"
      >
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <TableHeader
            columns={columns}
            allRowIds={allRowIds}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            store={store}
          />
          <tbody>
            {virtualizedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 2}
                  className="text-center py-12 text-muted"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-12 h-12 opacity-40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try adjusting your filters or search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* Spacer for virtualization */}
                {shouldVirtualize && virtualizedRows.length > 0 && (
                  <tr style={{ height: virtualization.totalScrollHeight }} />
                )}
                {virtualizedRows.map((row, visIndex) => {
                  const actualIndex = shouldVirtualize
                    ? virtualization.startIndex + visIndex
                    : visIndex;
                  const rowId = String(startIndex + actualIndex);
                  const offsetY =
                    shouldVirtualize && visIndex === 0
                      ? virtualization.offsetY
                      : undefined;

                  return (
                    <TableRow
                      key={rowId}
                      row={row}
                      rowId={rowId}
                      index={actualIndex}
                      columns={visibleColumns}
                      columnWidths={columnWidths}
                      isSelected={selectedRows.has(rowId)}
                      onToggleSelect={handleToggleRow}
                      offsetY={offsetY}
                      rowHeight={rowHeight}
                    />
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={pagination.page}
        startIndex={startIndex}
        endIndex={endIndex}
        totalRows={sortedRows.length}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={paginationResult.goToPage}
        onPageSizeChange={paginationResult.setPageSize}
        store={store}
      />
    </div>
  );
}

/** Trigger a browser file download via Blob URL */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
