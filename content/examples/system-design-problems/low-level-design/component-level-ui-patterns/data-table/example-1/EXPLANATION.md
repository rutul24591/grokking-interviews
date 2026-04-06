# Data Table — Implementation Walkthrough

This document explains the production-grade data table implementation file by file.

---

## File Structure

```
example-1/
├── lib/
│   ├── table-types.ts       # Type definitions and constants
│   ├── table-store.ts       # Zustand store factory with persistence
│   ├── sort-utils.ts        # Pure sorting utility
│   └── filter-utils.ts      # Pure filtering utility
├── hooks/
│   ├── use-pagination.ts    # Pagination logic hook
│   ├── use-virtualization.ts # Row virtualization hook
│   └── use-column-resizer.ts # Column drag-resize hook
└── components/
    ├── data-table.tsx       # Root table component (composition root)
    ├── table-header.tsx     # <thead> with sort, resize, column toggle
    ├── table-row.tsx        # Memoized <tr> with selection checkbox
    ├── table-cell.tsx       # Memoized <td> with custom render support
    ├── pagination.tsx       # Page navigation with ellipsis
    └── filter-bar.tsx       # Filter inputs per column
```

---

## 1. Types (`lib/table-types.ts`)

Defines the core types used throughout the application:

- **`Column<T>`**: Parameterized by row type for type safety. Includes field, label, type, width, minWidth, sortable, filterable, filterType, enumValues, render function, and visibility.
- **`SortConfig<T>`**: Field + direction (`asc`/`desc`) + optional `isMulti` flag for multi-column sort.
- **`FilterConfig`**: Field + filter type (`text`/`range`/`multi-select`) + value(s).
- **`PaginationState`**: Page number, page size, and total row count.
- **`TableState<T>`**: Complete store state combining sort, filters, pagination, selection, column widths, hidden columns, and last selected index.
- **`TableActions<T>`**: All mutator functions exposed by the store.

Constants define defaults: `DEFAULT_PAGE_SIZE` (25), `PAGE_SIZE_OPTIONS` ([10, 25, 50, 100]), `MIN_COLUMN_WIDTH` (80), `DEFAULT_ROW_HEIGHT` (40), `VIRTUALIZATION_THRESHOLD` (500), `OVERSCAN_ROWS` (5).

---

## 2. Store (`lib/table-store.ts`)

A **factory function** `createTableStore()` that creates a Zustand store instance scoped to a `tableId` and `columns` array. This allows multiple independent tables on the same page.

### Key Design Decisions

- **Persistence**: Column widths and hidden columns are persisted to localStorage with a debounced write (300ms). On initialization, the store reads persisted values and merges them with column defaults.
- **Sort cycling**: Single-column sort cycles `none → asc → desc → none`. Multi-column sort (shift-click) adds/removes/toggles sort configs in the array.
- **Selection**: Uses a `Set<string>` for O(1) add/remove/has. Supports range selection via the `selectRange` action (used by shift-click).
- **Pagination clamping**: When `setTotalRows` is called (e.g., after a server response), the current page is clamped to the new total pages to prevent showing a blank page.

---

## 3. Sorting (`lib/sort-utils.ts`)

Pure function `sortRows(rows, sortConfigs)` using `Array.prototype.toSorted()` for immutable sorting.

### Comparator Logic

1. Iterates sort configs in order (first = primary sort).
2. For each config, compares values using `compareValues()`:
   - **Null handling**: Nulls always sort to the end.
   - **Numbers**: Direct subtraction.
   - **Dates**: Parse strings via `Date.parse()`, compare timestamps.
   - **Strings**: `localeCompare()` with `{ numeric: true, sensitivity: 'base' }` for natural sorting (e.g., "item 2" before "item 10").
3. If values are equal, continues to the next sort config (tiebreaker).

### Complexity

- Time: O(n log n × s) where s = number of sort columns.
- Space: O(n) for the new sorted array (`toSorted` creates a copy).

---

## 4. Filtering (`lib/filter-utils.ts`)

Pure function `filterRows(rows, filters)` that applies all active filters with AND logic across columns.

### Filter Types

- **Text filter**: Case-insensitive substring match using `String(value).toLowerCase().includes(query)`.
- **Range filter**: Checks `value >= min && value <= max`. Handles both numbers and date timestamps.
- **Multi-select filter**: OR logic within — row matches if its value is in the `selectedValues` set.

### Performance Optimization

Instead of iterating filters for each row (O(n × f)), the function **builds a single array of predicate functions** once when filters change, then iterates rows with short-circuit exit on first predicate failure. This is significantly faster for large datasets with multiple active filters.

---

## 5. Pagination Hook (`hooks/use-pagination.ts`)

Accepts the store and processed (filtered + sorted) rows. Computes:

- `totalPages`: `Math.ceil(totalRows / pageSize)`
- `startIndex` / `endIndex`: Slice boundaries for the current page
- `paginatedRows`: `processedRows.slice(startIndex, endIndex)`
- `hasNextPage` / `hasPrevPage`: Boolean flags
- Actions: `nextPage`, `prevPage`, `goToPage` (clamped), `setPageSize` (resets to page 1)

All derived values are memoized with `useMemo` to prevent unnecessary re-computation.

---

## 6. Virtualization Hook (`hooks/use-virtualization.ts`)

Manages row windowing for large datasets:

1. **Scroll tracking**: Attaches a `scroll` listener (passive) to the container ref.
2. **ResizeObserver**: Tracks container height changes.
3. **Index computation**:
   - `startIndex = Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS`
   - `endIndex = Math.ceil((scrollTop + containerHeight) / rowHeight) + OVERSCAN_ROWS`
4. **Offset calculation**: Computes the CSS `translateY` offset for the first visible row so rows appear at the correct scroll position.
5. **Variable height support**: Maintains a `Map<number, number>` of measured row heights. As rows mount, a callback updates the map. The total scroll height is recalculated as the sum of all measured + estimated heights.

### Complexity

- Time: O(1) for index computation.
- Space: O(v) where v = visible rows (typically 20-30).

---

## 7. Column Resizer Hook (`hooks/use-column-resizer.ts`)

Manages drag-to-resize for column headers:

1. **pointerdown** on the resize handle: Records start X position, current column width, and minimum width. Calls `setPointerCapture` for reliable tracking.
2. **pointermove** on window: Computes delta, applies `Math.max(startWidth + delta, minWidth)`, and updates the store.
3. **pointerup**: Cleans up event listeners.

Uses pointer events (not mouse events) for touch support. The store persists the new width to localStorage via the debounced persist function.

---

## 8. Data Table Component (`components/data-table.tsx`)

The **composition root** that wires everything together:

### Data Pipeline

```
raw data → filterRows → sortRows → usePagination → useVirtualization → render
```

Each stage is memoized with `useMemo`. When any input changes (filters, sort, page), only the affected downstream stages re-compute.

### Server-Side Mode

When `serverSide={true}`, the `filterRows` and `sortRows` stages are skipped — the API is expected to return pre-filtered and pre-sorted data. The consumer is responsible for calling the API with the current sort/filter/pagination params (read from the store) and updating the data prop.

### Rendering

- **TableHeader**: Renders sortable headers, resize handles, column visibility toggle.
- **FilterBar**: Renders filter inputs per filterable column (optional, controlled by `enableFilters`).
- **tbody**: Renders virtualized rows with a spacer element for scroll height simulation.
- **Pagination**: Renders page navigation below the table.
- **Empty state**: When no rows match filters, displays a friendly message with an icon.
- **Export toolbar**: Buttons to export the current view as CSV or JSON. CSV properly escapes commas, quotes, and newlines.

---

## 9. Table Header (`components/table-header.tsx`)

Renders `<thead>` with:

- **Selection checkbox**: "Select all" toggle for visible rows.
- **Sortable headers**: Click to cycle sort direction. Shift-click for multi-column sort. Uses `aria-sort` attribute for accessibility.
- **Sort indicator icons**: SVG arrows showing current sort state (up for asc, down for desc, dual arrows for none).
- **Resize handles**: Draggable separators between columns using the `useColumnResizer` hook.
- **Column visibility menu**: Dropdown with checkboxes to show/hide columns. Closes on outside click.

The header row uses `position: sticky; top: 0` to remain visible during vertical scroll.

---

## 10. Table Row (`components/table-row.tsx`)

Memoized `<tr>` component:

- Selection checkbox in the first cell.
- Iterates visible columns, rendering a `TableCell` for each.
- Applies hover and selected background colors.
- When virtualized, sets `transform: translateY(offsetY)` and `height: rowHeight` for correct positioning.
- Uses `React.memo` to prevent re-renders when unrelated state changes.

---

## 11. Table Cell (`components/table-cell.tsx`)

Memoized `<td>` component:

- Uses the column's `render` function if provided, otherwise renders the raw value as a string.
- Applies `truncate` class for text overflow with ellipsis.
- Sets `title` attribute for full value tooltip on hover.
- Fixed width from the column widths store.

---

## 12. Pagination (`components/pagination.tsx`)

Features:

- **Page numbers with ellipsis**: For large page counts, shows `[1, 2, 3, ..., 50, 51, 52]` pattern.
- **Prev/Next buttons**: Disabled when at boundaries.
- **Page size selector**: Dropdown with configurable options (10, 25, 50, 100).
- **Range display**: "Showing 26–50 of 1,234".
- **Accessibility**: `aria-current="page"` on the active page button, `aria-label` on navigation buttons.

---

## 13. Filter Bar (`components/filter-bar.tsx`)

Renders filter inputs per filterable column:

- **Text filter**: Debounced input (300ms) to avoid excessive re-filtering on every keystroke. Clear button appears when value is non-empty.
- **Range filter**: Min and max number inputs. No debounce (lower frequency input).
- **Multi-select filter**: Dropdown with checkboxes. Shows count of selected values. Clear button resets selection.
- **Clear All Filters**: Button visible when any filter is active. Resets all filters and resets page to 1.

Filter inputs sync bidirectionally with the Zustand store. When a filter value changes, the store updates, triggering the data pipeline re-computation.

---

## Accessibility Highlights

| Feature | Implementation |
|---------|---------------|
| Table semantics | Native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>` |
| Column headers | `role="columnheader"` with `aria-sort` |
| Row selection | `aria-selected` on `<tr>`, labeled checkboxes |
| Pagination | `role="navigation"`, `aria-label="Pagination"`, `aria-current="page"` |
| Filter inputs | Labeled with `aria-label`, dropdown with `aria-expanded` and `aria-haspopup` |
| Keyboard navigation | Tab through interactive elements, Shift+click for range selection |
| Empty state | Descriptive text with icon |

---

## Performance Highlights

| Technique | Where |
|-----------|-------|
| Virtualization | `use-virtualization.ts` — only visible rows in DOM |
| Memoization | `React.memo` on `TableRow` and `TableCell` |
| Selector subscriptions | Each component subscribes only to its needed store slice |
| Debounced filters | Text input debounced at 300ms |
| Immutable sort | `toSorted()` avoids mutating the source array |
| Predicate building | Filters compiled once, applied with short-circuit |
| Stable keys | Row IDs (not indices) as React keys |
| Passive scroll listener | `{ passive: true }` on scroll event |
