/** Generic row data type — each row is a record with string keys */
export type RowData = Record<string, unknown>;

/** Sort direction for a column */
export type SortDirection = 'asc' | 'desc' | 'none';

/** Data type of a column — affects sort and filter behavior */
export type ColumnDataType = 'string' | 'number' | 'date' | 'enum';

/** Filter type for a column */
export type FilterType = 'text' | 'range' | 'multi-select';

/** Configuration for a single column */
export interface Column<T extends RowData = RowData> {
  /** Unique field key matching a property on the row object */
  field: keyof T & string;
  /** Display label for the column header */
  label: string;
  /** Data type for sort/filter behavior */
  type: ColumnDataType;
  /** Default width in pixels */
  width?: number;
  /** Minimum width in pixels during resize */
  minWidth?: number;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is filterable */
  filterable?: boolean;
  /** Filter type (derived from type if not provided) */
  filterType?: FilterType;
  /** Enum values for multi-select filter (required when filterType === 'multi-select') */
  enumValues?: string[];
  /** Custom cell render function */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** Whether the column is visible by default */
  visible?: boolean;
}

/** Single sort configuration */
export interface SortConfig<T extends RowData = RowData> {
  field: keyof T & string;
  direction: Exclude<SortDirection, 'none'>;
  /** Whether this is part of a multi-column sort */
  isMulti?: boolean;
}

/** Single filter configuration */
export interface FilterConfig {
  field: string;
  type: FilterType;
  /** Text filter value */
  value?: string;
  /** Range filter min */
  min?: number | string;
  /** Range filter max */
  max?: number | string;
  /** Multi-select filter values */
  selectedValues?: Set<string>;
}

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
  totalRows: number;
}

/** Row selection state */
export type RowSelection = Set<string>;

/** Persisted column preferences */
export interface ColumnPreferences {
  widths: Record<string, number>;
  hidden: string[];
  order?: string[];
}

/** Complete table state (stored in Zustand) */
export interface TableState<T extends RowData = RowData> {
  /** Active sort configurations */
  sort: SortConfig<T>[];
  /** Active filters keyed by column field */
  filters: Map<string, FilterConfig>;
  /** Pagination state */
  pagination: PaginationState;
  /** Selected row IDs */
  selectedRows: RowSelection;
  /** Column widths keyed by field */
  columnWidths: Record<string, number>;
  /** Hidden column field keys */
  hiddenColumns: Set<string>;
  /** Last selected row index (for shift-click range selection) */
  lastSelectedIndex: number | null;
  /** Whether the table is in server-side mode */
  serverSide: boolean;
  /** Loading state for server-side mode */
  loading: boolean;
}

/** Actions exposed by the table store */
export interface TableActions<T extends RowData = RowData> {
  /** Set or toggle sort on a column */
  setSort: (field: keyof T & string, isMulti?: boolean) => void;
  /** Clear all sort */
  clearSort: () => void;
  /** Set a filter for a column */
  setFilter: (config: FilterConfig) => void;
  /** Clear a single filter */
  clearFilter: (field: string) => void;
  /** Clear all filters */
  clearAllFilters: () => void;
  /** Change the current page */
  setPage: (page: number) => void;
  /** Change the page size (resets to page 1) */
  setPageSize: (pageSize: number) => void;
  /** Update total rows (from server response) */
  setTotalRows: (total: number) => void;
  /** Toggle selection of a single row */
  toggleRowSelection: (rowId: string, index: number, shiftKey: boolean) => void;
  /** Toggle selection of all visible rows */
  toggleSelectAll: (allRowIds: string[]) => void;
  /** Clear all row selection */
  clearSelection: () => void;
  /** Update a column width */
  setColumnWidth: (field: string, width: number) => void;
  /** Toggle column visibility */
  toggleColumnVisibility: (field: string) => void;
  /** Reset all state to defaults (keeps persisted preferences) */
  reset: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
}

/** Default constants */
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const MIN_COLUMN_WIDTH = 80;
export const DEFAULT_ROW_HEIGHT = 40;
export const VIRTUALIZATION_THRESHOLD = 500;
export const OVERSCAN_ROWS = 5;

/** localStorage keys for persistence */
export const STORAGE_KEY_PREFIX = 'data-table';
export const getColumnWidthsKey = (tableId: string) => `${STORAGE_KEY_PREFIX}:${tableId}:widths`;
export const getHiddenColumnsKey = (tableId: string) => `${STORAGE_KEY_PREFIX}:${tableId}:hidden`;
