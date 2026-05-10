"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-data-table",
  title: "Design a Data Table",
  description:
    "LLD for a production-grade Data Table: sorting, filtering, pagination, column resizing, virtualization, sticky headers, and accessible keyboard navigation in React/Next.js.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "data-table",
  wordCount: 7400,
  readingTime: 39,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "data-table",
    "virtualization",
    "sorting",
    "filtering",
    "pagination",
    "react",
    "accessibility",
  ],
  relatedTopics: [
    "infinite-scroll-virtualized-list",
    "virtualized-grid-2d",
    "spreadsheet-like-grid",
    "column-configuration-system",
    "saved-views-filters-system",
  ],
};

export default function DataTableArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing a Data Table component for a
          large-scale React/Next.js application — the kind of
          table that appears in admin consoles, ops tools,
          billing dashboards, customer relationship managers,
          and analytics products. The table presents tabular
          data with affordances for sorting, multi-condition
          filtering, pagination (page-based or cursor-based),
          column resize / reorder / show-hide, row selection
          (single, multi, range), and inline drill-downs.
          It must remain responsive at tens of thousands of
          rows on the client (via virtualization) or millions
          on the server (via cursor pagination), keep
          keystroke and scroll latency under the 16 ms
          budget, and be fully accessible to keyboard and
          screen reader users.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems are deceptively numerous. Sticky
          headers and sticky columns must coexist with
          virtualization without rendering glitches.
          Variable-height rows make virtualization harder
          because row offsets aren&rsquo;t derivable from
          index alone. Sorting and filtering need to compose
          cleanly with both client-side and server-side data
          sources, sometimes within the same product. Column
          resize must feel native — pointer drag with live
          preview — without thrashing layout. Selection state
          across pagination boundaries needs careful
          semantics so users don&rsquo;t lose selections when
          they navigate. Accessibility is non-trivial:
          tables have a well-defined ARIA pattern but
          virtualization, sticky elements, and custom
          interactions all stress that pattern. Done well,
          the table becomes a platform component used by
          dozens of features; done poorly, every feature
          team rebuilds it badly.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Internal users — operators, support staff,
          analysts — spend significant time in tables. They
          care deeply about predictable behavior, fast
          interactions, and the ability to customize the
          view to their workflow. External users — customers
          looking at billing line items, end users browsing
          search results — are less power-user-oriented but
          more sensitive to perceived quality. Engineering
          teams consume the table through a typed API; they
          declare columns, a data source, and optional
          plugins (column resize, row selection, inline
          editing) and the table runtime handles the rest.
          Product managers care about analytics — which
          columns get sorted, which filters are common,
          which views are saved — to inform the next
          iteration.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Data sources are heterogeneous: some flows ship
          server-paginated data with metadata for total
          count; others ship the full set client-side and
          paginate locally; some stream data via WebSocket
          for live updates. Row counts can range from a
          dozen to a million. Columns can range from 3 to
          50. Some columns hold complex content (images,
          actions, mini-charts) that need lazy-loading.
          Modern browsers; virtualization uses
          <code> IntersectionObserver</code>,
          <code> ResizeObserver</code>, and
          <code> requestAnimationFrame</code>. The host has
          a styling system (Tailwind, CSS-in-JS, design
          tokens) — the table consumes tokens but
          doesn&rsquo;t prescribe them.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement spreadsheet behaviors (cell
          editing with formulas, copy-paste regions, undo
          stack) — those belong to the Spreadsheet Grid
          subsystem that builds on the same virtualization
          primitives but adds a different interaction model.
          We do not implement a 2D virtualized grid for
          column counts in the hundreds (different
          subsystem). We do not implement an export
          pipeline (CSV, PDF) — that&rsquo;s a separate tool
          that consumes the table&rsquo;s current view as
          input.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Render a tabular structure with declared columns,
          row content driven by a data source. Sort by any
          column, single-key by default with shift-click for
          multi-sort. Filter per column with type-aware
          editors (text, number range, date range, enum
          checklist) plus a global search. Paginate either
          page-based (page size + page number) or
          cursor-based (next/prev tokens) depending on data
          source. Virtualize rows so hundreds of thousands
          of items render in tens of milliseconds. Sticky
          header at the top and optionally sticky first
          column on the left. Resize columns via pointer
          drag with persistent preferences. Reorder columns
          via drag handles. Show-hide columns via a column
          chooser. Select rows: single-select, multi-select
          via checkbox, shift-click for range, select-all
          across pages with explicit semantics (current
          page vs all matching). Row click navigates,
          row hover affordances are decorative. Empty
          state, loading state, and error state all
          first-class.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Inline cell editing for power-user flows.
          Expandable rows that reveal nested content. Pinned
          rows (sticky top or bottom). Group-by with
          aggregate rows. Saved views: a user&rsquo;s
          combination of filters, sort, columns, and
          density saved as a named preset and restorable.
          Server-side or client-side switching transparent
          to the consumer. Export as CSV from the current
          view. Density toggle (comfortable / compact /
          spacious). Skeleton rows during loading that
          preserve layout.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Cell-level formulas, copy-paste of regions,
          undo/redo of edits — Spreadsheet Grid territory.
          2D virtualization for hundreds of columns —
          Virtualized Grid territory. Server-side bulk
          operations (delete-all-matching) — those flow
          through a separate mutation endpoint that the
          table can trigger but doesn&rsquo;t own.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Initial render of the visible viewport under 100
          ms for a 1000-row dataset. Sorting and filtering
          on client-paginated data (10k rows) under 50 ms.
          Scroll at 60 fps with virtualization, no dropped
          frames. Column resize feels live; pointer-move
          updates are throttled to
          <code> requestAnimationFrame</code>. Page
          transitions for server-paginated tables under 200
          ms when network is healthy, with skeleton rows
          instead of jarring blank states.
        </HighlightBlock>

        <h3>Scalability</h3>
        <HighlightBlock as="p" tier="important">
          Virtualization keeps DOM size O(visible rows),
          typically 20–50, regardless of total row count.
          Columns are not virtualized by default (we assume
          column counts under ~50); for wider tables, the
          2D virtualization subsystem applies. Server-side
          pagination scales to millions of rows on the
          backend; the client only ever holds a page worth
          of data plus a small ring buffer for quick
          navigation.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Stale data after rapid filter changes does not
          render: each fetch carries a token, only the
          latest token&rsquo;s data is committed. Selection
          state survives sort and filter changes (selected
          rows that filter out are tracked but hidden, and
          re-appear when the filter relaxes). Column
          preferences persist across sessions. Page navigation
          is robust to fast clicks; the second click while
          the first is in flight is a no-op (or supersedes
          the first, depending on configuration).
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Cell content renders as text by default; HTML
          rendering is opt-in per column with a sanitizer.
          Column definitions and filters are data, not code
          — we don&rsquo;t evaluate string predicates with
          <code> eval</code> or <code>Function</code>. Server
          requests carry CSRF tokens and respect
          authorization at the row level (the server filters
          by user permissions; the client trusts the server).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          The table uses
          <code> role=&quot;table&quot;</code> with proper
          row/cell roles. Keyboard navigation follows the
          ARIA grid pattern: arrow keys move the focused
          cell, Enter activates, Escape exits. Sticky header
          remains accessible (screen readers can navigate to
          column headers from any row). Sort state is
          announced via <code>aria-sort</code>. Selection
          checkboxes have proper labels including row
          identifiers.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <p>
          Column definitions are declarative and typed; new
          columns are one-line additions. Plugins (selection,
          inline edit, expandable rows) are opt-in and don&rsquo;t
          impose cost when unused. The data source is an
          adapter, so swapping client-side for server-side
          paging is a configuration change, not a
          re-architecture.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/data-table-architecture.svg"
        alt="Data Table Architecture"
        caption="Column definitions + Data Source adapter → Table Engine (sort + filter + paginate) → Virtualizer → Visible row windows → Header (sticky, sortable) + Body (virtualized) + Footer (paginator). Column resize and selection are plugins on top of the engine."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="important">
          The table is structured around five interlocking
          layers: a <strong>column model</strong> (declarative
          schema for columns and their behaviors), a
          <strong> data source adapter</strong> (uniform
          interface over client-side and server-side data),
          a <strong>table engine</strong> (sort, filter,
          paginate, derive row windows), a
          <strong> virtualizer</strong> (translate row windows
          into mounted DOM), and a <strong>plugin system</strong>
          (selection, resize, inline edit, etc.) that
          composes onto the engine without bloating the
          common case. Each layer has a narrow contract;
          plugins opt in per table.
        </HighlightBlock>
        <p>
          The <strong>column model</strong> is a typed array
          of column definitions. Each column declares an
          <code> id</code>, a header (text or render
          function), a <code>cell</code> render function
          that takes a row and returns React, an optional
          <code> sortFn</code> and <code>filterType</code>
          for client-side processing, and an
          <code> accessor</code> path for server-side sort
          and filter parameters. Width is configurable
          (fixed, flex, percentage); minWidth and maxWidth
          bound the resize range. Sticky-left and pinned-
          right are flags. The column model is stable: the
          same array reference produces the same engine
          plan, so consumers should hoist or memoize it.
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>data source adapter</strong> is the
          unifying abstraction. It exposes a small contract:
          <code> getPage(params)</code> returns rows for the
          current sort/filter/page, plus metadata
          (<code> totalCount</code>, <code>nextCursor</code>,
          <code> isStale</code>). For client-side data,
          <code> getPage</code> filters and sorts the
          in-memory array and slices the page. For
          server-side data, <code>getPage</code> calls the
          backend with sort/filter/page params and returns
          the response. For hybrid (some columns
          server-sortable, others client-sortable), the
          adapter routes intelligently. Switching data
          sources is a configuration change, not a
          rewrite.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>mount</strong>, the table engine reads
          the column model, initializes default sort and
          filter state from URL or persisted preferences,
          and asks the data source for the first page. The
          virtualizer mounts the visible viewport (~30 rows
          for typical row heights) plus a small overscan
          buffer (~10 rows above and below) so scrolling
          doesn&rsquo;t reveal blank space at the edges.
          The header renders the column model, sticky to
          the viewport top via
          <code> position: sticky</code>. The footer
          renders pagination controls or, for cursor-based
          flows, a Load More affordance.
        </HighlightBlock>
        <p>
          On <strong>sort</strong>, the user clicks a
          sortable header. The engine updates sort state,
          reflects it in the URL (so the view is shareable
          and refresh-safe), and either re-runs client-side
          sort and re-paginates, or calls the server
          adapter with the new sort parameter. Multi-sort
          (shift-click) builds an ordered list of sort
          keys; the engine respects the order. Sort state
          is announced via <code>aria-sort=&quot;ascending&quot;</code>{" "}
          on the relevant header.
        </p>
        <p>
          On <strong>filter</strong>, the user opens a
          filter editor on a column header. The editor type
          comes from the column&rsquo;s
          <code> filterType</code> — text input, number
          range, date range picker, enum checklist, custom.
          The editor commits its value to the engine; the
          engine debounces (300 ms for text inputs;
          immediate for range and checklist) and either
          re-runs client-side filter or calls the server
          adapter. Filter state is also URL-reflected. A
          global search input in the table header issues a
          cross-column filter via the adapter, with
          server-side full-text search when supported.
        </p>
        <HighlightBlock as="p" tier="crucial">
          On <strong>scroll</strong>, the virtualizer
          observes the scroll position and recalculates
          which rows fall in the viewport. The DOM mounts
          rows for the current window plus overscan. Rows
          scrolling out unmount; rows scrolling in mount
          fresh. For variable-height rows, the virtualizer
          maintains a measured-height cache keyed by row
          id; rows that have been measured render at their
          known height, rows that haven&rsquo;t been
          measured yet render at an estimated height and
          are corrected once they mount (via
          <code> ResizeObserver</code>). The cumulative
          scroll height is the sum of measured heights plus
          estimates for unmeasured rows. This continuous
          measurement is what makes variable-height
          virtualization smooth.
        </HighlightBlock>
        <p>
          On <strong>page change</strong> for server-paginated
          tables, the engine issues a new
          <code> getPage</code> with the new page number or
          cursor. While the request is in flight, the
          virtualizer renders skeleton rows that match the
          current row count and column widths so layout
          doesn&rsquo;t shift. On response, real rows
          replace skeletons. Pages carry a fetch token:
          stale responses (e.g., user clicked Next twice)
          are discarded silently.
        </p>
        <p>
          On <strong>column resize</strong>, the user drags
          the resize handle between two column headers.
          Pointer-move events update the column&rsquo;s
          width via <code>requestAnimationFrame</code> so
          the layout updates each frame without thrashing.
          The width is constrained by minWidth and maxWidth.
          On release, the new width persists to localStorage
          (or the user&rsquo;s server-stored preferences)
          keyed by user and table id, so the preference
          survives reloads.
        </p>
        <p>
          On <strong>selection</strong>, the engine
          maintains a Set of selected row ids. Single-select
          replaces; multi-select toggles; shift-click
          selects a range based on the last anchor. Select-
          all has explicit semantics: it selects the
          current page&rsquo;s rows by default, with a
          banner offering &ldquo;Select all 1,234 matching
          rows&rdquo; for the cross-page case — never
          silently selecting all matching rows because the
          user might not realize how many are involved.
          Selected rows are tracked by id, not by position,
          so they survive sort and filter changes.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>row click</strong>, the engine
          dispatches a row activation event. Consumers can
          navigate, open a side panel, or invoke an action.
          The default behavior is configurable per table.
          Activation is keyboard-accessible: Enter on a
          focused cell triggers the row&rsquo;s default
          action.
        </HighlightBlock>
        <p>
          The architecture works because the engine is a
          pure function of (column model, data source state,
          sort, filter, page, scroll position) → render
          tree. Plugins layer on top by subscribing to
          engine state and contributing their own state
          slices. The virtualizer is the only component
          that touches DOM scroll directly; everything
          else operates on row index sets that the
          virtualizer translates to mounted DOM.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="important">
          <strong>TableProvider</strong> instantiates the
          engine, the virtualizer, and the plugin chain.
          It exposes them through stable refs in a React
          Context. The Context value is references, not
          state, so consumers don&rsquo;t re-render on
          engine state changes; they subscribe via
          selector hooks.
        </HighlightBlock>
        <p>
          <strong>TableEngine</strong> owns sort, filter,
          and pagination state. It delegates to the data
          source adapter for the actual data; it owns the
          state about which slice of data is currently
          requested. The engine is a pure reducer plus an
          async dispatcher (for server requests). It&rsquo;s
          unit-testable with synthetic data sources.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>DataSourceAdapter</strong> is the
          interface implementations satisfy. We ship two
          built-ins:
          <code> ClientArrayAdapter</code> (in-memory data,
          client-side sort/filter/paginate) and
          <code> ServerAdapter</code> (HTTP-fetched data,
          server-side sort/filter/paginate). Custom
          adapters slot in for special cases (a streaming
          WebSocket adapter, a hybrid that mixes
          client/server processing).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Virtualizer</strong> handles row
          virtualization with variable heights. It
          maintains a <code>measuredHeights</code> map
          keyed by row id, an estimated default height,
          and uses <code>ResizeObserver</code> to update
          measurements as rows mount. Scroll position →
          visible window translation runs in
          <code> requestAnimationFrame</code>.
        </HighlightBlock>
        <p>
          <strong>HeaderRow</strong> renders the column
          headers, sticky to the viewport top. Each header
          is a button that opens the sort and filter
          affordances. Resize handles between columns are
          decorative buttons that capture pointer events.
        </p>
        <p>
          <strong>BodyRow</strong> renders one data row
          based on the column model. Cells are memoized
          per (column id, value) pair so unchanged cells
          don&rsquo;t re-render when sibling cells update
          (relevant for inline editing).
        </p>
        <p>
          <strong>Cell</strong> renders one cell. It&rsquo;s
          a thin wrapper that applies the column&rsquo;s
          render function. For complex cells (images,
          inline charts), the render function can return
          <code> React.lazy</code> components so they don&rsquo;t
          bloat the initial bundle.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Paginator</strong> renders pagination
          controls (page numbers, next/prev) for page-based
          flows or a Load More button for cursor-based
          flows. It reads engine state via selectors.
        </HighlightBlock>
        <p>
          <strong>Plugins</strong> are independent modules
          that subscribe to engine state and contribute
          their own state and UI. The selection plugin
          maintains the selected-id set and renders
          checkboxes; the resize plugin maintains widths
          and renders handles; the inline-edit plugin
          tracks edit state per cell. Plugins compose:
          consumers opt in to whichever they need.
        </p>
        <HighlightBlock as="p" tier="important">
          The architectural patterns at play are
          <strong> adapter</strong> (data source
          abstraction), <strong>plugin chain</strong>{" "}
          (composable extensions), <strong>virtualization</strong>{" "}
          (DOM scoped to viewport), and
          <strong> single-writer engine state</strong>{" "}
          (engine is the only mutator; everything else
          reads via selectors).
        </HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management Strategy</h2>
        <HighlightBlock as="p" tier="crucial">
          State splits into four planes. <strong>Engine
          state</strong> — sort keys, filter values,
          current page, scroll position, fetch token — lives
          in an external store created per table.
          <strong> Plugin state</strong> — selection set,
          column widths, edit state — lives in
          plugin-owned slices of the same store, scoped by
          plugin id. <strong>Server state</strong> — the
          actual rows for the current page — lives in
          React Query or SWR keyed by (sort, filter, page,
          fetch token); the table reads it via subscription.
          <strong> Local UI state</strong> — open dropdowns,
          hover, drag-in-progress flags — lives in the
          components that need it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Why an external store rather than React Context?
          The same reason as the form runtime: a table with
          50 visible rows × 10 columns has 500 cell
          subscribers; Context would re-render all of them
          on every state change. Selector subscriptions
          keep cell re-renders proportional to actual
          changes (typically zero or one cell per state
          update).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          URL reflection is a deliberate design choice:
          sort, filter, and page state live in the URL so
          views are shareable, refreshable, and
          back-button-safe. We use Next.js router methods
          to update the URL without full navigation
          (<code> router.replace</code> with shallow
          routing). The URL is the source of truth on
          mount; the engine reconciles its state from URL
          parameters.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">Inputs:{" "}
          <code>columns</code> (array of column definitions),
          <code> dataSource</code> (adapter instance),
          <code> initialState</code> (sort, filter, page;
          optional, falls back to URL or defaults), plugin
          configs, and event handlers
          (<code>onRowClick</code>,
          <code> onSortChange</code>,
          <code> onSelectionChange</code>).</HighlightBlock>
<HighlightBlock as="p" tier="important">Outputs are
          subscription events for telemetry and a small
          imperative API on the table ref
          (<code>scrollToRow</code>,
          <code> refetch</code>, <code>clearFilters</code>).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Column contract:
          <code>{` { id, header, cell, sortFn?, filterType?, accessor?, width?, minWidth?, maxWidth?, sticky?, pinned? } `}</code>.
          The <code>cell</code> function receives the row
          and returns React; it should be a stable reference
          (defined outside render) so memoization works.
          The data source contract:
          <code>{` { getPage(params), totalCount?, supportsServerSort, supportsServerFilter } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance Strategy</h2>
        <HighlightBlock as="p" tier="important">
          Virtualization is the headline performance lever.
          We use a fixed-height virtualizer for tables with
          uniform row heights (common case) — the math is
          trivial and rendering is straightforward. For
          variable-height tables, we use a measured-height
          virtualizer with an estimated default height; the
          first scroll over a row measures it and updates
          the cache. Overscan (~10 rows above and below the
          viewport) prevents blank space during fast
          scrolling.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Memoization is layered. The column model is
          compiled once per reference into an internal
          plan. Each Cell is wrapped in
          <code> React.memo</code> with a comparator over
          (column id, row id, value). Cells that don&rsquo;t
          change don&rsquo;t re-render even when sibling
          cells do (relevant during inline edit). The
          BodyRow component is similarly memoized so unchanged
          rows skip render.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Sorting and filtering on client-paginated data use
          a small in-memory index that&rsquo;s rebuilt only
          when the underlying data or the column&rsquo;s
          sort/filter functions change. For 10k rows with a
          numeric sort, this is sub-50ms; for a text sort
          with locale-aware comparison
          (<code> Intl.Collator</code>), it&rsquo;s slower
          but still well under the user-perceived budget.
          For larger client datasets (50k+), we move sort
          and filter into a Web Worker.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Server requests are debounced for filter changes
          (300 ms) and immediate for sort and pagination.
          Stale responses are discarded via fetch tokens.
          Skeleton rows during loading match the current
          column widths so layout doesn&rsquo;t shift; this
          eliminates the cumulative-layout-shift problem
          common to naive table implementations.
        </HighlightBlock>
      </section>

      <section>
        <h2>🎨 UI/UX &amp; Interaction Design</h2>
        <HighlightBlock as="p" tier="crucial">
          Density toggles let users compact the table when
          they need to see more rows at once; this is
          surprisingly impactful for power users who spend
          hours in the table. Empty states are not blank:
          they explain the empty result (no data vs filtered
          out) and offer remediation (clear filters, change
          query). Loading states use skeleton rows, never
          spinners over the whole table, because spinners
          obliterate context. Error states show the error
          inline at the top with a Retry button; the table
          retains the previous data so the user&rsquo;s
          context isn&rsquo;t lost.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Selection across pages deserves explicit UX. When
          a user clicks select-all, we select the current
          page and surface a banner: &ldquo;All 25 rows on
          this page selected. Select all 1,234 matching
          rows.&rdquo; Clicking the banner triggers the
          cross-page selection with a confirmation. This
          two-step flow prevents the common mistake of
          accidentally selecting tens of thousands of rows
          when the user only meant the visible page.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Column resize feels native by using pointer
          capture and live preview. Reorder uses a drag
          handle next to the header text with visual
          feedback. The column chooser is a popover that
          lists all columns with checkboxes and a search
          input for tables with many columns.
        </HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="important">The table uses
          <code> role=&quot;table&quot;</code> with
          <code> role=&quot;row&quot;</code>,
          <code> role=&quot;columnheader&quot;</code>, and
          <code> role=&quot;cell&quot;</code>. The ARIA
          grid pattern (<code>role=&quot;grid&quot;</code>)
          is opt-in for tables that want full keyboard cell
          navigation; default tables use the simpler table
          role with row-level keyboard support.</HighlightBlock>
<HighlightBlock as="p" tier="important">Sort state
          announces via
          <code> aria-sort=&quot;ascending&quot;</code> or
          <code> &quot;descending&quot;</code> on the
          current header. Selection checkboxes carry labels
          including row identifiers
          (&ldquo;Select row: Order #1234&rdquo;).
          Sticky headers must remain announceable: screen
          readers should be able to navigate to column
          headers from any row without losing context. We
          test this explicitly with VoiceOver and NVDA.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Keyboard navigation for the grid pattern: arrow
          keys move the focused cell, Home/End move to row
          edges, Ctrl+Home/End move to corners, Page
          Up/Down move by viewport. Enter activates,
          Escape exits any open editor. The focused cell
          carries <code>tabIndex=&quot;0&quot;</code>;
          others are <code>-1</code>. Focus visibility is
          high-contrast and respects user preferences.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Authorization is enforced server-side: the server filters by user permissions and never</HighlightBlock>
<HighlightBlock as="p" tier="important">trusts the client&rsquo;s row id list. Sensitive columns (e.g. payment details) can be configured</HighlightBlock>
<HighlightBlock as="p" tier="important">to render redacted values by default with a click-to-reveal action that&rsquo;s audit-logged.</HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <HighlightBlock as="p" tier="important">Unit tests cover the engine: sort and filter logic against canonical inputs, pagination math, fetch-token race</HighlightBlock>
<HighlightBlock as="p" tier="important">resolution. Integration tests mount realistic tables with synthetic data sources and exercise:</HighlightBlock>
<HighlightBlock as="p" tier="important">scroll-and-virtualize, sort and filter, server-side pagination with mocked adapters, selection across pages, column resize persistence.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Accessibility tests verify
          <code> aria-sort</code>, focus management on
          arrow-key navigation, and announcement of empty
          and loading states. Visual regression tests on
          representative tables catch layout regressions
          (sticky header glitches, resize visual bugs).
          Performance tests assert scroll fps and
          initial-render budget on a 100k-row table.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <HighlightBlock as="p" tier="crucial">
          Variable row heights with sticky-left columns
          (the sticky cells must match height to their
          row): we use CSS Grid for the row layout so
          sticky cells inherit row height naturally;
          attempts with absolute positioning fail at scale.
          Column widths summing to more than viewport
          width: horizontal scrolling kicks in;
          sticky-left columns remain visible during
          horizontal scroll. User changes filter while
          scrolled deep into the table: scroll position
          resets to top because the row set has changed
          and preserving scroll would be misleading. User
          rapidly clicks Next page: fetch tokens ensure
          only the latest response renders.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">Server returns inconsistent total count between
          pages (real-world data can shift): we surface a
          subtle banner &ldquo;Data changed&rdquo; and
          offer a refresh; we don&rsquo;t silently
          interpolate. Selection across pages with
          server-side filter: the &ldquo;Select all
          matching&rdquo; option performs a server
          operation that returns the matching id set; we
          cap the cross-page selection at a configurable
          limit (10k by default) to prevent the UI from
          tracking arbitrarily many ids.</HighlightBlock>
<HighlightBlock as="p" tier="important">Column resize that
          would make a column smaller than its content&rsquo;s
          minimum: the resize stops at minWidth; the
          content overflows with ellipsis. A column with a
          long unwrappable cell (e.g. a UUID): we apply
          <code> overflow: hidden</code> with
          <code> text-overflow: ellipsis</code> by default
          and a hover tooltip with full content.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <HighlightBlock as="p" tier="crucial">Theming uses design tokens; consumers can override per table via className on the</HighlightBlock>
<HighlightBlock as="p" tier="important">wrapper. Data source adapters let teams plug in unusual data sources (a WebSocket</HighlightBlock>
<HighlightBlock as="p" tier="important">stream, a GraphQL endpoint with cursor pagination) without modifying engine internals.</HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="crucial">Sort comparisons use Intl.Collator for locale-aware string ordering (so</HighlightBlock>
<HighlightBlock as="p" tier="important">&ldquo;Ä&rdquo; sorts after &ldquo;Z&rdquo; in some locales and after &ldquo;A&rdquo; in others).</HighlightBlock>
<HighlightBlock as="p" tier="important">RTL flips the table via CSS logical properties; sticky-left becomes sticky-end naturally.</HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Virtualize rows but not columns by default</h3>
        <HighlightBlock as="p" tier="crucial">
          Most tables have under 50 columns; row counts go
          much higher. Virtualizing rows is high-leverage
          and tractable; virtualizing columns is more
          complex (sticky columns, variable widths) and
          rarely needed at the column counts we target.
          For tables with hundreds of columns, the
          Virtualized Grid subsystem applies. Splitting
          the use cases this way keeps each subsystem
          simpler.
        </HighlightBlock>

        <h3>Adapter pattern for data sources</h3>
        <HighlightBlock as="p" tier="important">
          A unified adapter interface lets the table work
          identically against client-side and server-side
          data, with a configuration switch. The cost is
          some indirection — the engine doesn&rsquo;t
          directly access data — but the win is that
          consumers can move pagination from client to
          server when they outgrow the client-side model
          without rewriting their table code.
        </HighlightBlock>

        <h3>External store vs Context for engine state</h3>
        <HighlightBlock as="p" tier="important">
          Context would re-render every cell on every state
          change. An external store with selector
          subscriptions keeps re-renders surgical. The
          extra dependency is worth it past a few dozen
          cells.
        </HighlightBlock>

        <h3>URL as source of truth for sort/filter/page</h3>
        <HighlightBlock as="p" tier="important">
          Reflecting state in the URL gives shareable,
          refreshable, back-button-safe views. The cost is
          reconciliation complexity on mount (parse URL →
          set engine state) and on every state change
          (push URL update). The win is that users can
          share &ldquo;here&rsquo;s the view I&rsquo;m
          looking at&rdquo; via URL, which is non-trivial
          for ops teams.
        </HighlightBlock>

        <h3>Skeleton rows vs spinner during load</h3>
        <HighlightBlock as="p" tier="important">
          Skeleton rows preserve layout and convey progress
          implicitly; spinners obliterate context.
          Skeletons are slightly more code (need to know
          column widths and row count) but the UX win is
          substantial for users who spend hours in the
          table and want their context preserved across
          page transitions.
        </HighlightBlock>

        <h3>Selection by id vs by index</h3>
        <p>
          Selection-by-id survives sort and filter changes;
          selection-by-index doesn&rsquo;t. We pay the
          slight cost of carrying a Set of ids and earn the
          property that users don&rsquo;t lose selections
          when they re-sort.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">A built-in CSV export from the current view, with
          server-side support for cross-page export. Web
          Worker-based sort and filter for very large
          client datasets (50k+ rows). Real-time row
          updates via WebSocket with smooth animation of
          inserted, updated, and removed rows.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Group-by
          with collapsible aggregate rows. Conditional row
          formatting (highlight rows that match a
          predicate). Column-level pinning beyond just
          first column. Saved view sharing across users.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How does virtualization work for
          variable-height rows?</strong> Maintain a measured-
          height cache keyed by row id; render unmeasured
          rows at an estimated default; use
          <code> ResizeObserver</code> to update measurements
          when rows mount; recalculate scroll height as the
          sum of measured plus estimated heights.
        </HighlightBlock>

        <p>
          <strong>2. How do you avoid losing selections when the
          user sorts or filters?</strong> Track selections by
          row id, not by index. Selected rows that filter
          out remain in the selection set but are hidden;
          they re-appear when the filter relaxes.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>3. Sticky header with virtualization — what&rsquo;s
          tricky?</strong> The header must scroll with the
          viewport horizontally but stay sticky vertically.
          Using <code>position: sticky</code> on the header
          inside a scrollable container handles this if the
          container&rsquo;s overflow is set correctly.
          Virtualization changes the body&rsquo;s scroll
          height dynamically, but sticky positioning
          honors the viewport, not the content, so it
          works.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How do you reflect sort/filter/page state in
          the URL?</strong> Use the Next.js router&rsquo;s
          shallow routing to update query parameters
          without full navigation. On mount, parse the URL
          and seed engine state from it. On every state
          change, debounce a URL update so rapid typing in
          a filter doesn&rsquo;t spam the history.
        </HighlightBlock>

        <p>
          <strong>5. How do you handle a mix of server-sortable
          and client-sortable columns?</strong> The data source
          adapter routes per column. Server-sortable
          columns issue a server request with the new
          sort param; client-sortable columns sort
          in-memory. Combining them (sort by server
          column, then by client column) requires the
          server to deliver the page already sorted by
          the server column, then the client applies the
          secondary sort within the page.
        </p>

        <p>
          <strong>6. How do you race-protect rapid filter
          changes?</strong> Each fetch carries a monotonic
          token. Only the response with the latest token
          is committed; earlier responses are discarded.
          This is the same pattern as async validation
          races.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How is the table accessible to keyboard
          users?</strong> ARIA grid pattern with single
          tabstop and arrow-key navigation. Sort state via
          <code> aria-sort</code>. Selection checkboxes
          labeled with row identifiers. Sticky headers
          remain announceable. We test with real screen
          readers, not just axe-core.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>8. How would you scale this to a million
          rows?</strong> Server-side pagination is the
          answer; the client never holds a million rows.
          Cursor-based pagination scales better than
          page-based at large offsets because the database
          doesn&rsquo;t have to skip millions of rows. The
          table&rsquo;s adapter pattern accommodates either.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">URL reflection makes views shareable; selection-by-id survives sort and</HighlightBlock>
<HighlightBlock as="p" tier="important">filter; skeleton loading preserves layout. The result is a table that feels</HighlightBlock>
<HighlightBlock as="p" tier="important">native at any data scale, accessible to all users, and extensible without forking.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
