"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-data-table",
  title: "Design a Data Table",
  description:
    "Complete LLD solution for a production-grade data table with sorting, filtering, pagination, column resizing, virtualization, row selection, column visibility toggle, export, sticky headers, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "data-table",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "data-table",
    "sorting",
    "filtering",
    "pagination",
    "virtualization",
    "column-resizing",
    "accessibility",
    "performance",
  ],
  relatedTopics: [
    "search-autocomplete",
    "infinite-scroll",
    "virtualized-lists",
    "state-management",
  ],
};

export default function DataTableArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable, production-grade data table component for a
          large-scale React application. The table must display tabular data with
          support for column sorting (single-column and multi-column), column filtering
          (text, range, multi-select), pagination (client-side and server-side), column
          resizing via drag handles, row virtualization for datasets exceeding the
          viewport (100K+ rows), row selection with checkboxes (including shift-click
          range selection), column visibility toggling, export to CSV and JSON, sticky
          headers during vertical scroll, sort indicator icons in column headers, and
          full keyboard and screen-reader accessibility. The component must perform
          smoothly with large datasets, avoid unnecessary re-renders, and maintain a
          predictable state model that any consuming component can interact with.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Data can be provided client-side (in-memory array) or fetched from a
            remote API (server-side operations).
          </li>
          <li>
            Column definitions are provided as a configuration array, specifying field
            keys, labels, data types (string, number, date, enum), and optional render
            functions for custom cell content.
          </li>
          <li>
            The table must handle datasets ranging from a few rows to 100K+ rows.
            Virtualization is mandatory for client-side datasets exceeding a configurable
            threshold (e.g., 500 rows).
          </li>
          <li>
            Column widths are user-adjustable via drag, and persisted across sessions
            (e.g., localStorage).
          </li>
          <li>
            Row selection supports single select, multi-select (checkbox), select all,
            and shift-click for range selection.
          </li>
          <li>
            The table must be accessible per WAI-ARIA table patterns.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Column Sorting:</strong> Clicking a column header cycles through
            ascending, descending, and no-sort states. Multi-column sorting is supported
            via shift-click (e.g., sort by department ascending, then by salary
            descending). Sort direction is indicated by icons (up/down arrow).
          </li>
          <li>
            <strong>Column Filtering:</strong> Each column header or an adjacent filter
            bar supports filtering. Text columns use substring matching. Number columns
            support range filters (min/max). Enum columns support multi-select
            checkboxes. Date columns support date-range pickers. Filters combine with
            AND logic across columns and OR logic within a multi-select filter.
          </li>
          <li>
            <strong>Pagination:</strong> Supports both client-side pagination (slice the
            filtered/sorted array by page) and server-side pagination (send page,
            pageSize, sort, and filter params to API). Configurable page size with
            common presets (10, 25, 50, 100). Displays current range and total count.
          </li>
          <li>
            <strong>Column Resizing:</strong> Users can drag column header borders to
            resize. Minimum width enforcement prevents columns from collapsing. Resized
            widths persist in localStorage and restore on remount.
          </li>
          <li>
            <strong>Row Virtualization:</strong> Only rows within the visible viewport
            are rendered. Scroll position is tracked and mapped to row indices.
            Virtualization activates when row count exceeds a threshold (default: 500).
            Uses a spacer div to simulate full scroll height.
          </li>
          <li>
            <strong>Row Selection:</strong> Checkbox column on the left. Select all
            toggles selection for visible rows. Shift-click selects a range from last
            clicked row to current row. Keyboard arrow keys navigate selection.
          </li>
          <li>
            <strong>Column Visibility Toggle:</strong> Users can show/hide columns via a
            dropdown menu with checkboxes. Hidden columns are excluded from rendering
            and export.
          </li>
          <li>
            <strong>Export:</strong> Export current view (filtered, sorted, visible
            columns) to CSV or JSON format. Triggers a browser download via Blob URL.
          </li>
          <li>
            <strong>Sticky Header:</strong> Table header remains fixed at the top during
            vertical scroll using CSS <code>position: sticky</code>.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Initial render of 100K rows with virtualization
            should be under 200ms. Scrolling should maintain 60fps. Sorting and filtering
            100K rows client-side should complete under 500ms.
          </li>
          <li>
            <strong>Memory:</strong> No memory leaks from stale event listeners,
            intersection observers, or resize observers. Virtualized rows must unmount
            cleanly when scrolled out of view.
          </li>
          <li>
            <strong>Accessibility:</strong> Full WAI-ARIA table semantics. Keyboard
            navigation (Tab, Arrow keys, Space for checkbox, Enter for row action).
            Screen reader announces sort changes, filter changes, and row selection.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for column definitions,
            row data, sort state, filter state, and pagination state.
          </li>
          <li>
            <strong>Responsiveness:</strong> Table adapts to viewport changes. On narrow
            screens, horizontal scroll is enabled with sticky first column optionally.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            All rows filtered out — display an empty state message with a reset filters
            button.
          </li>
          <li>
            User resizes a column so narrow that content overflows — enforce a minimum
            width (e.g., 80px) and use text-overflow: ellipsis for cell content.
          </li>
          <li>
            Shift-click selection when no previous row is selected — treat as a single
            row selection.
          </li>
          <li>
            Server-side pagination where the total count changes mid-session (e.g., new
            records added) — handle gracefully by adjusting the current page if it
            exceeds the new total pages.
          </li>
          <li>
            Virtualization with variable row heights — use a measured heights cache and
            dynamically adjust scroll spacer height.
          </li>
          <li>
            Export with 100K+ rows — chunk the CSV generation using
            <code>requestIdleCallback</code> to avoid blocking the main thread.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>table state management</strong> from
          <strong>table rendering</strong> using a global store (Zustand) and a
          composition-based component architecture. The store manages sort state, filter
          state, pagination state, selection state, column visibility, and column widths.
          The rendering layer subscribes to the store and renders only what is needed —
          virtualized rows, memoized cells, and a sticky header.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Local state (useState) per table instance:</strong> Simple for small
            tables but becomes unwieldy when many pieces of state (sort, filter, page,
            selection, columns) must be lifted and shared across child components (header,
            row, cell, pagination). Prop drilling increases coupling.
          </li>
          <li>
            <strong>React Context + useReducer:</strong> Viable and avoids external
            dependencies. However, context consumers re-render on every state change
            unless carefully split into multiple contexts. Zustand selectors provide
            fine-grained subscriptions out of the box.
          </li>
          <li>
            <strong>Existing libraries (TanStack Table, AG-Grid):</strong> Production-ready
            and feature-complete. However, they add significant bundle weight (AG-Grid is
            300KB+ minified). For applications needing a custom, lightweight table with
            only specific features, a bespoke implementation is preferable.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Composition is optimal:</strong> Zustand provides
          selector-based subscriptions so the header, pagination, and filter bar each
          subscribe only to the slice of state they need. This prevents unnecessary
          re-renders when, for example, changing the page does not re-render the column
          headers. The composition pattern (DataTable wraps TableHeader, TableRow,
          TableCell, Pagination, FilterBar) ensures each piece is independently testable
          and reusable.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of ten modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Table Types &amp; Interfaces (<code>table-types.ts</code>)</h4>
          <p>
            Defines the <code>Column</code> interface (field key, label, type, width,
            minWidth, render function, sortable, filterable), <code>SortDirection</code>
            union (<code>asc | desc | none</code>), <code>SortConfig</code> (field +
            direction + isMulti), <code>FilterConfig</code> (field + filter type +
            value), <code>PaginationState</code> (page, pageSize, totalRows),
            <code>RowSelection</code> (Set of selected row IDs), and <code>TableData</code>
            (generic row type). See the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Table Store (<code>table-store.ts</code>)</h4>
          <p>
            Manages all table state using Zustand. Exposes actions for setting sort,
            toggling multi-sort, setting filters, changing page/pageSize, toggling row
            selection, toggling column visibility, and updating column widths. Persists
            column widths and visibility to localStorage with SSR-safe hydration.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>sort: SortConfig[]</code> — active sort configurations
            </li>
            <li>
              <code>filters: Map&lt;string, FilterConfig&gt;</code> — keyed by column field
            </li>
            <li>
              <code>pagination: PaginationState</code> — page, pageSize, totalRows
            </li>
            <li>
              <code>selectedRows: Set&lt;string&gt;</code> — selected row IDs
            </li>
            <li>
              <code>columnWidths: Record&lt;string, number&gt;</code> — field to pixel width
            </li>
            <li>
              <code>hiddenColumns: Set&lt;string&gt;</code> — hidden column field keys
            </li>
            <li>
              <code>lastSelectedIndex: number | null</code> — for shift-click range
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Sorting Utility (<code>sort-utils.ts</code>)</h4>
          <p>
            Pure functions for sorting arrays of row objects. Supports single-column and
            multi-column sorting. Uses <code>Array.prototype.toSorted()</code> for
            immutable sort (React 19+). Handles string (localeCompare), number (numeric),
            and date (timestamp) comparisons. See the Example tab for the complete
            implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Filtering Utility (<code>filter-utils.ts</code>)</h4>
          <p>
            Pure functions for filtering rows. Supports text (case-insensitive substring),
            range (min/max for numbers and dates), and multi-select (OR logic within, AND
            logic across columns). Short-circuits on first filter failure for performance.
            See the Example tab for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Pagination Hook (<code>use-pagination.ts</code>)</h4>
          <p>
            Custom hook computing derived pagination values: totalPages, startIndex,
            endIndex, paginatedRows, hasNextPage, hasPrevPage. Accepts totalRows and
            pageSize from the store. Returns helper functions: nextPage, prevPage,
            goToPage, setPageSize.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Virtualization Hook (<code>use-virtualization.ts</code>)</h4>
          <p>
            Custom hook using a ref on the scroll container. Tracks scrollTop and
            container height via ResizeObserver. Computes <code>startIndex</code> and
            <code>endIndex</code> based on row height, scrollTop, and overscan buffer.
            Returns visible rows slice, total scroll height, and offsetY for the spacer
            element. Supports variable row heights via a measured heights cache.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Column Resizer Hook (<code>use-column-resizer.ts</code>)</h4>
          <p>
            Custom hook managing drag state for column resizing. Attaches
            <code>pointermove</code> and <code>pointerup</code> listeners on the window
            when a drag starts on a column header divider. Computes delta, applies new
            width with minimum enforcement, and persists to store (and localStorage).
            Cleans up listeners on pointerup.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. Data Table Component (<code>data-table.tsx</code>)</h4>
          <p>
            Root component composing all sub-components. Accepts column definitions and
            row data (or a data-fetching function for server-side mode). Initializes the
            store, applies sort/filter/pagination/virtualization, and renders the table
            structure. See the Example tab for the complete component.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">9. Table Header Component (<code>table-header.tsx</code>)</h4>
          <p>
            Renders <code>&lt;thead&gt;</code> with sortable column headers (click to
            cycle sort direction, shift-click for multi-sort), sort indicator icons,
            resize handles (using the column resizer hook), filter inputs per column, and
            column visibility toggle dropdown. Uses <code>role=&quot;columnheader&quot;</code>
            and <code>aria-sort</code> attributes.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">10. Table Row &amp; Cell Components</h4>
          <p>
            <code>TableRow</code> renders a <code>&lt;tr&gt;</code> with a selection
            checkbox, cells for each visible column, and hover/selected styling. Memoized
            via <code>React.memo</code> to prevent re-renders when unrelated state
            changes. <code>TableCell</code> renders cell content with text-overflow
            handling, custom render function support, and <code>role=&quot;cell&quot;</code>.
            See the Example tab for the complete implementation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth. Sort, filter, pagination,
          selection, column visibility, and column widths are all managed here. Derived
          values (e.g., filtered rows, sorted rows, paginated rows, virtualized rows) are
          computed in hooks or selectors — not stored — to avoid stale state. The store
          exposes actions that any sub-component can call without prop drilling.
        </p>
        <p>
          Persistence is handled for column widths and hidden columns. On store
          initialization, the store reads from localStorage (within a useEffect to be
          SSR-safe). Changes are debounced and written back. If localStorage is
          unavailable or corrupted, defaults are used.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/data-table-architecture.svg"
          alt="Data Table Architecture"
          caption="Architecture of the data table showing pipeline flow from raw data through filter, sort, paginate, virtualize, and render"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Consumer renders <code>{"<DataTable columns={cols} data={rows} />"}</code>.
          </li>
          <li>
            Store initializes with default state (no sort, no filters, page 1, all columns
            visible, default widths).
          </li>
          <li>
            Filter hooks apply active filters to the data array, producing filtered rows.
          </li>
          <li>
            Sort utility sorts the filtered rows, producing sorted rows.
          </li>
          <li>
            Pagination hook slices the sorted rows by page and pageSize.
          </li>
          <li>
            Virtualization hook computes which paginated rows are in the viewport and
            returns only those for rendering.
          </li>
          <li>
            User clicks a column header: store updates sort config, step 4-6 re-run,
            table re-renders with sorted data.
          </li>
          <li>
            User changes a filter: store updates filter config, step 3-6 re-run.
          </li>
          <li>
            User changes page: store updates page, step 5-6 re-run.
          </li>
          <li>
            User drags column border: column resizer hook updates width in store and
            localStorage. No data re-computation needed — only the header re-renders.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow follows a pipeline: raw data → filter → sort → paginate →
          virtualize → render. Each stage is a pure transformation, and state changes at
          any stage trigger re-evaluation of all downstream stages. This ensures
          consistency — for example, changing a filter always re-applies sort and
          pagination.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Client-Side vs Server-Side Flow</h3>
        <p>
          In <strong>client-side mode</strong>, all pipeline stages execute in the browser.
          This is fast for datasets up to ~10K rows. Beyond that, filter and sort become
          expensive (O(n log n) for sort, O(n) per filter). Virtualization ensures the
          render cost stays constant regardless of data size.
        </p>
        <p>
          In <strong>server-side mode</strong>, the client sends the current sort, filter,
          and pagination params to the API on each change. The server returns the
          pre-computed page of results and the total count. The client skips filter and
          sort stages locally — only pagination and virtualization apply. This trades
          network latency for reduced client-side CPU, which is essential for datasets
          exceeding 100K rows or when data is too large to transfer.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>All rows filtered out:</strong> The filter stage returns an empty
            array. The render stage detects zero rows and displays an empty state message
            with a &quot;Clear Filters&quot; button that resets the filter store.
          </li>
          <li>
            <strong>Current page exceeds total pages after filter:</strong> The pagination
            hook detects <code>page &gt; totalPages</code> and clamps the page to
            <code>totalPages</code>. This prevents showing a blank page.
          </li>
          <li>
            <strong>Shift-click with no previous selection:</strong> The store&apos;s
            <code>lastSelectedIndex</code> is null. The handler treats the click as a
            single-row toggle and sets <code>lastSelectedIndex</code> to the clicked
            index.
          </li>
          <li>
            <strong>Column resize below minimum:</strong> The resizer hook enforces
            <code>Math.max(delta, column.minWidth || 80)</code>. The column never shrinks
            below the minimum, preventing layout collapse.
          </li>
          <li>
            <strong>Virtualization with variable row heights:</strong> The
            <code>use-virtualization</code> hook maintains a <code>Map&lt;rowIndex,
            measuredHeight&gt;</code>. On first render, it estimates heights. As rows
            mount, a ResizeObserver measures actual heights and updates the map. The
            scroll spacer height is recalculated as the sum of all row heights (measured +
            estimated). This prevents scroll bar jumps as rows are measured.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 14 files: type
            definitions, Zustand store with persistence, sorting utility, filtering
            utility, pagination hook, virtualization hook, column resizer hook, data table
            component, table header component, table row component, table cell component,
            pagination component, filter bar component, and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the
            article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Table Types (table-types.ts)</h3>
        <p>
          Defines generic <code>RowData</code> type for flexible row shapes. The
          <code>Column</code> interface is parameterized with <code>T extends RowData</code>
          for type-safe cell rendering. <code>FilterType</code> union covers text, range,
          and multi-select. <code>SortConfig</code> supports both single and multi-column
          sort via an <code>isMulti</code> flag. Constants for default page size, page
          size options, and minimum column width.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Table Store (table-store.ts)</h3>
        <p>
          The store manages sort, filter, pagination, selection, column widths, and hidden
          columns. Key design decisions include: using a <code>Map</code> for filters
          (O(1) lookup and iteration), persisting column widths and visibility to
          localStorage with debounced writes, and providing a <code>reset</code> action
          that clears all state except persisted preferences. Selection uses a
          <code>Set</code> for O(1) add/remove/has operations.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Sorting Utility (sort-utils.ts)</h3>
        <p>
          Pure function <code>sortRows(rows, sortConfigs, columns)</code> returns a new
          sorted array. Uses <code>toSorted()</code> for immutability. The comparator
          builds a composite score by iterating sort configs in order — first config is
          primary sort, second is tiebreaker, etc. Handles string (localeCompare with
          numeric option), number (direct subtraction), and date (parse to timestamp)
          types. Returns unsorted input if sortConfigs is empty.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Filtering Utility (filter-utils.ts)</h3>
        <p>
          Pure function <code>filterRows(rows, filters, columns)</code> returns a new
          filtered array. Iterates filters and applies each as a predicate. Text filter
          uses <code>String(value).toLowerCase().includes(query.toLowerCase())</code>.
          Range filter checks <code>value &gt;= min && value &lt;= max</code>. Multi-select
          uses <code>selectedValues.has(String(value))</code>. Short-circuits on first
          predicate failure for early exit.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Pagination Hook (use-pagination.ts)</h3>
        <p>
          Accepts totalRows (post-filter, post-sort) and reads pageSize/page from the
          store. Computes totalPages via <code>Math.ceil(totalRows / pageSize)</code>,
          startIndex, endIndex, hasNextPage, hasPrevPage. Returns actions: nextPage,
          prevPage, goToPage (clamped to valid range), setPageSize (resets page to 1).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Virtualization Hook (use-virtualization.ts)</h3>
        <p>
          Attaches a ref to the scrollable tbody container. Uses ResizeObserver to track
          container height and scroll event listener for scrollTop. Computes visible row
          range: <code>startIndex = Math.floor(scrollTop / rowHeight)</code>,
          <code>endIndex = Math.ceil((scrollTop + containerHeight) / rowHeight)</code>.
          Adds overscan of 5 rows above and below. Returns the visible slice, total
          scroll height (for spacer), and offsetY. Supports variable heights via a
          measured cache Map.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Column Resizer Hook (use-column-resizer.ts)</h3>
        <p>
          Returns a <code>getResizeProps</code> function for each column header. On
          pointerdown, records the start X position and current column width. On
          pointermove (on window), computes delta = currentX - startX, applies
          <code>Math.max(currentWidth + delta, minWidth)</code>. On pointerup, detaches
          listeners and persists the new width to the store. Uses pointer events (not
          mouse events) for touch support.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Data Table Component (data-table.tsx)</h3>
        <p>
          Root component wiring everything together. Accepts columns and data (or a
          fetcher function for server-side mode). Computes filtered rows, sorted rows, and
          passes them through pagination and virtualization. Renders TableHeader,
          FilterBar (optional), virtualized rows via spacer + visible rows, and Pagination
          component. Handles the empty state when no rows match filters.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Table Header (table-header.tsx)</h3>
        <p>
          Renders the <code>&lt;thead&gt;</code> with a selection checkbox in the first
          cell, sortable column headers with sort indicator icons (CSS arrows or inline
          SVGs), resize handles, and a column visibility toggle dropdown. Uses
          <code>aria-sort</code> on sorted columns. Sticky via CSS
          <code>position: sticky; top: 0</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Table Row &amp; Cell (table-row.tsx, table-cell.tsx)</h3>
        <p>
          <code>TableRow</code> is memoized with <code>React.memo</code> and compares
          props via a custom equality function (only re-renders if row data, selection
          state, or visible columns change). Renders a checkbox, cells, and hover/selected
          styling. <code>TableCell</code> renders the cell value using the column&apos;s
          render function if provided, otherwise the raw value. Handles overflow with
          <code>truncate</code> class and a title attribute for the full value on hover.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: Pagination Component (pagination.tsx)</h3>
        <p>
          Renders page navigation: prev/next buttons, page number buttons (with ellipsis
          for large page counts), page size selector dropdown, and current range display
          (e.g., &quot;Showing 26-50 of 1,234&quot;). Page buttons use
          <code>aria-current=&quot;page&quot;</code> for the active page. Calls store
          actions on click.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: Filter Bar (filter-bar.tsx)</h3>
        <p>
          Renders filter inputs per filterable column. Text inputs for text columns,
          number inputs for range filters, multi-select dropdowns for enum columns.
          Debounces text input (300ms) to avoid excessive re-filtering on every keystroke.
          Includes a &quot;Clear All Filters&quot; button. Syncs with the store on change.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Filter rows</td>
                <td className="p-2">O(n * f) — n rows, f filters</td>
                <td className="p-2">O(n) — filtered array</td>
              </tr>
              <tr>
                <td className="p-2">Sort rows</td>
                <td className="p-2">O(n log n * s) — s sort columns</td>
                <td className="p-2">O(n) — sorted array (toSorted)</td>
              </tr>
              <tr>
                <td className="p-2">Paginate</td>
                <td className="p-2">O(1) — slice by index</td>
                <td className="p-2">O(k) — k = pageSize</td>
              </tr>
              <tr>
                <td className="p-2">Virtualize</td>
                <td className="p-2">O(1) — compute indices</td>
                <td className="p-2">O(v) — v = visible rows</td>
              </tr>
              <tr>
                <td className="p-2">Row selection toggle</td>
                <td className="p-2">O(1) — Set add/delete</td>
                <td className="p-2">O(s) — s = selected rows</td>
              </tr>
              <tr>
                <td className="p-2">Column resize</td>
                <td className="p-2">O(1) — single value update</td>
                <td className="p-2">O(c) — c = column count</td>
              </tr>
              <tr>
                <td className="p-2">Export CSV</td>
                <td className="p-2">O(n * c) — all rows, all columns</td>
                <td className="p-2">O(n * c) — CSV string</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          For 100K rows and 10 columns: filter takes ~50ms, sort takes ~200ms, paginate
          is sub-millisecond, virtualization renders only ~20 rows. Total time for a
          filter change on 100K rows is approximately 250ms (filter + sort + paginate +
          render). This is well within the 500ms target.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Sort on 100K+ rows client-side:</strong> O(n log n) becomes
            expensive. For 500K rows, sort can take 1-2 seconds. Mitigation: switch to
            server-side sort, or use a Web Worker to sort off the main thread.
          </li>
          <li>
            <strong>Filter with many active filters:</strong> Each filter adds a pass over
            the data. With 10 active filters on 100K rows, the filter stage iterates 1M
            times. Mitigation: combine filters into a single pass predicate function
            generated once when filters change, rather than iterating filters per row.
          </li>
          <li>
            <strong>Re-render cascades:</strong> If the store subscriber selects the
            entire state object, every change triggers a full table re-render. Mitigation:
            use Zustand selectors — header subscribes to sort + columns, pagination
            subscribes to pagination, rows subscribe to visible data only.
          </li>
          <li>
            <strong>Export blocking the main thread:</strong> Generating a CSV string for
            100K rows synchronously freezes the UI for 500-1000ms. Mitigation: chunk the
            generation using <code>requestIdleCallback</code> or a Web Worker, and stream
            the Blob via <code>ReadableStream</code>.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Memoized cell rendering:</strong> Each <code>TableCell</code> is
            wrapped in <code>React.memo</code> with a custom comparator that compares only
            the cell value and selected state. This prevents re-rendering cells whose data
            has not changed.
          </li>
          <li>
            <strong>Virtualized rows:</strong> Only ~20 rows are in the DOM at any time
            (viewport rows + overscan). The scroll spacer simulates the full height. This
            keeps DOM node count constant regardless of data size.
          </li>
          <li>
            <strong>Debounced filter input:</strong> Text filters debounce at 300ms,
            preventing filter computation on every keystroke. Range and multi-select
            filters are immediate (lower frequency).
          </li>
          <li>
            <strong>Stable row keys:</strong> Each row uses a unique ID (not array index)
            as the React key. This prevents DOM node recreation when rows are reordered by
            sort or removed by filter.
          </li>
          <li>
            <strong>Selector-based store subscriptions:</strong> Each component subscribes
            only to the state slice it needs. The pagination component does not re-render
            when sort changes, and the header does not re-render when the page changes.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <p>
          Cell values may contain user-generated content. If rendered directly as text
          (React&apos;s default), they are automatically escaped. However, if a column
          uses a custom <code>render</code> function that produces HTML, the content must
          be sanitized to prevent XSS. Prefer passing React elements (not HTML strings)
          from trusted sources. If HTML is unavoidable, use a sanitizer library
          (e.g., DOMPurify) before rendering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Export Security</h3>
        <p>
          CSV export can be an injection vector if cell values contain commas, quotes, or
          newlines. All cell values must be properly escaped: wrap values containing
          special characters in double quotes, and escape internal double quotes by
          doubling them (<code>&quot;</code> becomes <code>&quot;&quot;</code>). For JSON
          export, <code>JSON.stringify</code> handles escaping automatically.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Exposure</h3>
        <p>
          In client-side mode, all data is loaded into the browser memory. If the dataset
          contains sensitive fields (PII, financial data), ensure that the API only
          returns rows the user is authorized to see. Column visibility toggles are a
          UI-only feature — they do not restrict data access. Server-side filtering and
          pagination are required for true data access control.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> navigates
              between interactive elements (checkboxes, sort buttons, filter inputs,
              pagination buttons).
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Arrow keys</kbd>
              move focus between cells when the table is in grid navigation mode.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Space</kbd> toggles
              row selection checkbox.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> triggers
              row action (e.g., edit, view details).
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Shift + Arrow</kbd>
              extends selection range.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            The table uses <code>role=&quot;table&quot;</code> (or native
            <code>&lt;table&gt;</code>). Headers use <code>role=&quot;columnheader&quot;</code>
            with <code>aria-sort=&quot;ascending&quot;</code>,
            <code>aria-sort=&quot;descending&quot;</code>, or
            <code>aria-sort=&quot;none&quot;</code>. Filter inputs have
            <code>aria-label</code> describing the filter. The selection checkbox column
            header has <code>aria-label=&quot;Select all rows&quot;</code>. Row
            checkboxes have <code>{`aria-label="Select row {rowIndex}"`}</code>.
            Pagination uses <code>aria-label=&quot;Pagination&quot;</code> with
            <code>aria-current=&quot;page&quot;</code> on the active page. See the Example
            tab for the exact markup.
          </p>
        </div>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Sorting utility:</strong> Test single-column sort (asc, desc),
            multi-column sort (primary + tiebreaker), sort on different data types
            (string, number, date), sort stability (equal values maintain original order),
            and empty array handling.
          </li>
          <li>
            <strong>Filtering utility:</strong> Test text filter (case-insensitive,
            partial match), range filter (min only, max only, both, out of range),
            multi-select (single value, multiple values, empty), combined filters (AND
            logic across columns, OR logic within multi-select), and empty filter map
            (returns all rows).
          </li>
          <li>
            <strong>Pagination hook:</strong> Test page calculations (totalPages,
            startIndex, endIndex), boundary conditions (page 0, page beyond totalPages,
            pageSize larger than totalRows), and actions (nextPage clamps to last page,
            prevPage clamps to 1, goToPage validates input).
          </li>
          <li>
            <strong>Virtualization hook:</strong> Test visible row computation given
            scrollTop, container height, and row height. Test overscan inclusion. Test
            variable row height cache updates. Test that returned indices are within
            bounds.
          </li>
          <li>
            <strong>Store actions:</strong> Test sort toggle (cycles none → asc → desc),
            multi-sort (adds to array), filter set/clear, page change, selection toggle
            (add/remove from Set), shift-click range selection, column width update, and
            column visibility toggle.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full data pipeline:</strong> Render DataTable with 100 rows, apply a
            text filter, assert filtered count matches expected. Click column header to
            sort, assert first row has the correct sorted value. Change page, assert
            correct rows render.
          </li>
          <li>
            <strong>Virtualization rendering:</strong> Render DataTable with 10K rows,
            assert only ~25 DOM nodes exist for rows (not 10K). Scroll to the middle,
            assert different rows are rendered. Scroll to the end, assert last rows are
            rendered.
          </li>
          <li>
            <strong>Column resize persistence:</strong> Drag a column header border,
            assert the column width changes. Unmount and remount the table, assert the
            width is restored from localStorage.
          </li>
          <li>
            <strong>Row selection with shift-click:</strong> Select row 3, shift-click
            row 7, assert rows 3-7 are selected. Deselect row 5, assert only row 5 is
            deselected (others remain).
          </li>
          <li>
            <strong>Export:</strong> Add 10 rows with known data, click export CSV,
            assert the downloaded Blob content matches expected CSV (including proper
            escaping of commas and quotes in cell values).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>
            Run axe-core automated checks on rendered table. Verify all
            <code>aria-sort</code> attributes are correct, checkboxes have labels, and
            pagination is properly announced.
          </li>
          <li>
            Test keyboard navigation: Tab through all interactive elements, Arrow keys
            navigate cells, Space toggles selection, Enter triggers row action.
          </li>
          <li>
            Test screen reader announcements: sort change announces &quot;Column Name
            sorted ascending&quot;, filter change announces &quot;X results found&quot;,
            row selection announces &quot;Row X selected&quot;.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Performance Tests</h3>
        <ul className="space-y-2">
          <li>
            Measure render time for 100K rows with virtualization enabled. Assert initial
            render completes in under 200ms.
          </li>
          <li>
            Scroll through a virtualized table of 100K rows. Measure frame rate — assert
            no frame takes longer than 16.67ms (60fps).
          </li>
          <li>
            Apply a text filter on 100K rows. Measure filter computation time — assert
            under 500ms.
          </li>
          <li>
            Export 100K rows to CSV. Measure main thread blocking time — assert under
            200ms (with chunking/Web Worker).
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rendering all rows without virtualization:</strong> Candidates often
            render the full data array, causing the browser to create 100K+ DOM nodes.
            This freezes the browser. Interviewers expect candidates to discuss
            virtualization and windowing strategies.
          </li>
          <li>
            <strong>Using array index as React key:</strong> When rows are sorted or
            filtered, indices change, causing React to incorrectly reuse DOM nodes and
            produce visual bugs. Interviewers look for candidates who use stable, unique
            row IDs as keys.
          </li>
          <li>
            <strong>Not discussing client vs server-side trade-off:</strong> For large
            datasets, all operations must move to the server. Candidates who only
            implement client-side logic without discussing when to switch to server-side
            miss a critical architectural decision.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Rendering a table without
            <code>aria-sort</code>, without keyboard navigation, or with non-semantic
            elements (divs instead of table/thead/tbody/tr/td) is a red flag for
            production-readiness.
          </li>
          <li>
            <strong>Not memoizing expensive computations:</strong> Re-sorting or
            re-filtering on every render (e.g., calling sort/filter inside the component
            body without memoization) causes unnecessary CPU usage. Interviewers expect
            <code>useMemo</code> or derived state patterns.
          </li>
          <li>
            <strong>Missing minimum column width:</strong> Allowing columns to resize to
            zero width breaks the layout. Candidates should enforce a minimum width and
            handle text overflow gracefully.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Client-Side vs Server-Side Operations</h4>
          <p>
            Client-side operations provide instant feedback (no network latency) but are
            bounded by the browser&apos;s CPU and memory. Server-side operations handle
            arbitrarily large datasets but introduce network round-trip latency and
            require API design for sort/filter/pagination params. The right approach
            depends on data size: under 10K rows, client-side is fine. Over 100K rows,
            server-side is mandatory. Between 10K-100K, it depends on the target device
            (desktop vs mobile) and user expectations.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Fixed vs Variable Row Height Virtualization</h4>
          <p>
            Fixed row height virtualization is simpler — compute visible indices by
            dividing scrollTop by rowHeight. Variable height requires measuring each row,
            caching heights, and computing cumulative offsets. The trade-off is
            implementation complexity vs. UX. For tables with consistent content (e.g.,
            user lists with single-line names), fixed height is sufficient. For tables
            with variable content (e.g., description columns with multi-line text),
            variable height is necessary. A practical compromise is to set a fixed row
            height with CSS <code>overflow: hidden</code> and <code>text-overflow:
            ellipsis</code>, eliminating the need for variable height virtualization.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Zustand vs TanStack Table</h4>
          <p>
            Building a table from scratch with Zustand gives full control and minimal
            bundle size. TanStack Table (formerly React Table) is a headless utility
            providing sort, filter, pagination, grouping, aggregation, row selection, and
            column ordering out of the box. The trade-off: TanStack Table has a steeper
            learning curve, larger API surface, and adds ~15KB to the bundle. For
            applications needing only basic table features, Zustand + custom hooks is
            lighter. For enterprise-grade tables with complex requirements (grouping,
            pivoting, aggregation), TanStack Table is the better choice. Interviewers want
            to see that candidates can reason about build vs. buy decisions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Pagination vs Infinite Scroll</h4>
          <p>
            Pagination gives users explicit control over which data page they view,
            enables precise bookmarking (page 3 of 50), and works well with server-side
            operations. Infinite scroll loads more rows as the user scrolls down,
            providing a seamless experience but making it hard to return to a specific
            position, harder to implement with server-side sort/filter (the entire dataset
            shifts), and problematic for footers or page-level analytics. For data tables
            used in administrative dashboards, pagination is preferred. For feed-like
            content (social media, news), infinite scroll is better.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle real-time data updates (e.g., stock prices updating
              every second) in the table?
            </p>
            <p className="mt-2 text-sm">
              A: Use WebSockets or Server-Sent Events to receive updates. On receiving an
              update, find the affected row by ID and update its value in the data array.
              If the updated field is a sort column, the row may need to move to a new
              position — re-sort the affected rows and adjust the virtualized indices. To
              avoid re-rendering all rows, use a Map keyed by row ID for O(1) lookup and
              update only the affected cell via React.memo. For high-frequency updates
              (e.g., 100 updates/second), batch updates using requestAnimationFrame and
              apply them in a single store update.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add row grouping and aggregation (e.g., group by department,
              sum salary)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>groupBy</code> field to the store. When groupBy is set, the
              data pipeline inserts a grouping stage before sort: rows are partitioned by
              the group key, and an aggregate row is computed per group (sum, avg, count,
              etc.). The render layer inserts a group header row before each group&apos;s
              rows. Group headers are expandable/collapsible — collapsing a group hides
              its child rows and adjusts the virtualized indices. This is essentially what
              pivot tables do. For large datasets, grouping should be server-side.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement inline cell editing?
            </p>
            <p className="mt-2 text-sm">
              A: Add an <code>editingCell</code> state to the store (rowId + fieldKey).
              When a cell is double-clicked, set editingCell and render an input in that
              cell instead of the text value. On blur or Enter, commit the change: update
              the row in the data array, update the store, and re-run the pipeline (filter
              and sort may need to re-evaluate if the edited field is filtered or sorted).
              On Escape, discard the change. Optimistic updates provide instant UI
              feedback, with rollback on API failure.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test the virtualization hook without rendering the full
              table?
            </p>
            <p className="mt-2 text-sm">
              A: The hook is pure logic — it takes scrollTop, containerHeight, rowHeight,
              and totalRows as inputs and returns visible indices. Write unit tests with
              known inputs: e.g., scrollTop=0, containerHeight=600, rowHeight=40,
              totalRows=1000 → startIndex=0, endIndex=15 (with overscan). Test edge cases:
              scrollTop at the very end, containerHeight larger than total scroll height,
              zero rows. Mock ResizeObserver and scroll events with jest.fn() or
              vitest.mock.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the table needs to support nested rows (tree data)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>children</code> field to the row type and a
              <code>expandedRows</code> Set to the store. The data pipeline flattens the
              tree into a linear array for rendering, including only children of expanded
              parent rows. Each parent row has an expand/collapse button that toggles its
              ID in the expandedRows Set. The virtualization hook works on the flattened
              array, so it remains unaware of nesting. Persist expanded state to
              localStorage. For server-side tree data, the API must return children on
              demand (lazy loading).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle column reordering via drag-and-drop?
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a <code>columnOrder</code> array in the store (array of field
              keys in display order). The column headers use the HTML5 Drag and Drop API
              or a pointer-based approach: on drag start, record the source column index;
              on drag over, compute the target index and show a visual indicator; on drop,
              reorder the columnOrder array. Persist the order to localStorage. The render
              layer iterates columnOrder (not the original columns array) to determine
              display order. Column resizing and reordering are independent — widths are
              keyed by field, not position.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://tanstack.com/table/latest"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Table — Headless Table Library
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/table/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Table Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://react-window.vercel.app/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Window — Virtualization Library
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/virtualize-lists"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Virtualizing Long Lists Performance Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — ARIA Table Role Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
