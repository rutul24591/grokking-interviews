import { create } from 'zustand';
import type {
  TableState,
  TableActions,
  SortConfig,
  FilterConfig,
  RowData,
} from '../lib/table-types';
import {
  DEFAULT_PAGE_SIZE,
  MIN_COLUMN_WIDTH,
  getColumnWidthsKey,
  getHiddenColumnsKey,
} from '../lib/table-types';

/** Debounced localStorage write */
let persistTimeout: ReturnType<typeof setTimeout> | null = null;

function persistToStorage(tableId: string, widths: Record<string, number>, hidden: Set<string>) {
  if (persistTimeout) clearTimeout(persistTimeout);
  persistTimeout = setTimeout(() => {
    try {
      localStorage.setItem(getColumnWidthsKey(tableId), JSON.stringify(widths));
      localStorage.setItem(getHiddenColumnsKey(tableId), JSON.stringify([...hidden]));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, 300);
}

/** Load persisted column widths */
function loadColumnWidths(tableId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(getColumnWidthsKey(tableId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Load persisted hidden columns */
function loadHiddenColumns(tableId: string): string[] {
  try {
    const raw = localStorage.getItem(getHiddenColumnsKey(tableId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type FullTableState<T extends RowData> = TableState<T> & TableActions<T>;

interface StoreOptions<T extends RowData> {
  tableId: string;
  columns: { field: string; width?: number; minWidth?: number; visible?: boolean }[];
  serverSide?: boolean;
}

export function createTableStore<T extends RowData>(options: StoreOptions<T>) {
  const { tableId, columns, serverSide = false } = options;

  // Build default column widths from persisted + defaults
  const persistedWidths = loadColumnWidths(tableId);
  const defaultWidths: Record<string, number> = {};
  columns.forEach((col) => {
    defaultWidths[col.field] = persistedWidths[col.field] ?? col.width ?? 150;
  });

  // Build default hidden columns from persisted + defaults
  const persistedHidden = loadHiddenColumns(tableId);
  const defaultHidden = new Set<string>(
    columns.filter((c) => persistedHidden.includes(c.field) || c.visible === false).map((c) => c.field)
  );

  return create<FullTableState<T>>((set, get) => ({
    sort: [],
    filters: new Map(),
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalRows: 0,
    },
    selectedRows: new Set(),
    columnWidths: defaultWidths,
    hiddenColumns: defaultHidden,
    lastSelectedIndex: null,
    serverSide,
    loading: false,

    setSort: (field, isMulti = false) => {
      set((state) => {
        const existing = state.sort.find((s) => s.field === field);
        let newSort: SortConfig<T>[];

        if (isMulti) {
          // Multi-column sort: toggle direction or add
          if (existing) {
            if (existing.direction === 'asc') {
              newSort = state.sort.map((s) =>
                s.field === field ? { ...s, direction: 'desc' } : s
              );
            } else if (existing.direction === 'desc') {
              newSort = state.sort.filter((s) => s.field !== field);
            }
          } else {
            newSort = [...state.sort, { field, direction: 'asc', isMulti: true }];
          }
        } else {
          // Single-column sort: cycle none → asc → desc → none
          if (!existing) {
            newSort = [{ field, direction: 'asc' }];
          } else if (existing.direction === 'asc') {
            newSort = [{ field, direction: 'desc' }];
          } else {
            newSort = [];
          }
        }

        return { sort: newSort ?? state.sort };
      });
    },

    clearSort: () => set({ sort: [] }),

    setFilter: (config) => {
      set((state) => {
        const filters = new Map(state.filters);
        filters.set(config.field, config);
        return { filters, pagination: { ...state.pagination, page: 1 } };
      });
    },

    clearFilter: (field) => {
      set((state) => {
        const filters = new Map(state.filters);
        filters.delete(field);
        return { filters, pagination: { ...state.pagination, page: 1 } };
      });
    },

    clearAllFilters: () => {
      set((state) => ({
        filters: new Map(),
        pagination: { ...state.pagination, page: 1 },
      }));
    },

    setPage: (page) => {
      set((state) => {
        const totalPages = Math.ceil(state.pagination.totalRows / state.pagination.pageSize);
        const clampedPage = Math.max(1, Math.min(page, totalPages || 1));
        return { pagination: { ...state.pagination, page: clampedPage } };
      });
    },

    setPageSize: (pageSize) => {
      set((state) => ({
        pagination: { page: 1, pageSize, totalRows: state.pagination.totalRows },
      }));
    },

    setTotalRows: (total) => {
      set((state) => {
        const totalPages = Math.ceil(total / state.pagination.pageSize);
        const clampedPage = Math.min(state.pagination.page, totalPages || 1);
        return {
          pagination: { ...state.pagination, totalRows: total, page: clampedPage },
        };
      });
    },

    toggleRowSelection: (rowId, index, shiftKey) => {
      set((state) => {
        const selectedRows = new Set(state.selectedRows);

        if (shiftKey && state.lastSelectedIndex !== null) {
          // Range selection
          const start = Math.min(state.lastSelectedIndex, index);
          const end = Math.max(state.lastSelectedIndex, index);
          // We need access to all row IDs — this is handled by the component
          // passing the range. Here we just toggle the single row.
          // The component will call toggleSelectAll for the range.
          if (selectedRows.has(rowId)) {
            selectedRows.delete(rowId);
          } else {
            selectedRows.add(rowId);
          }
        } else {
          if (selectedRows.has(rowId)) {
            selectedRows.delete(rowId);
          } else {
            selectedRows.add(rowId);
          }
        }

        return { selectedRows, lastSelectedIndex: index };
      });
    },

    toggleSelectAll: (allRowIds) => {
      set((state) => {
        const selectedRows = new Set(state.selectedRows);
        const allSelected = allRowIds.every((id) => selectedRows.has(id));

        if (allSelected) {
          allRowIds.forEach((id) => selectedRows.delete(id));
        } else {
          allRowIds.forEach((id) => selectedRows.add(id));
        }

        return { selectedRows };
      });
    },

    selectRange: (rowIds: string[]) => {
      set((state) => {
        const selectedRows = new Set(state.selectedRows);
        rowIds.forEach((id) => selectedRows.add(id));
        return { selectedRows };
      });
    },

    clearSelection: () => set({ selectedRows: new Set(), lastSelectedIndex: null }),

    setColumnWidth: (field, width) => {
      set((state) => {
        const columnWidths = { ...state.columnWidths, [field]: Math.max(width, MIN_COLUMN_WIDTH) };
        persistToStorage(tableId, columnWidths, state.hiddenColumns);
        return { columnWidths };
      });
    },

    toggleColumnVisibility: (field) => {
      set((state) => {
        const hiddenColumns = new Set(state.hiddenColumns);
        if (hiddenColumns.has(field)) {
          hiddenColumns.delete(field);
        } else {
          hiddenColumns.add(field);
        }
        persistToStorage(tableId, state.columnWidths, hiddenColumns);
        return { hiddenColumns };
      });
    },

    reset: () => {
      set({
        sort: [],
        filters: new Map(),
        pagination: { page: 1, pageSize: DEFAULT_PAGE_SIZE, totalRows: 0 },
        selectedRows: new Set(),
        lastSelectedIndex: null,
        loading: false,
      });
    },

    setLoading: (loading) => set({ loading }),
  }));
}
