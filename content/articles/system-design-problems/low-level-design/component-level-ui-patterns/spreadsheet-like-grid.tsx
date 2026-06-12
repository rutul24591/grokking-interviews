"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-spreadsheet-grid",
  title: "Design a Spreadsheet-like Grid",
  description:
    "Spreadsheet grid with cell model, formula engine, multi-cell selection and range operations, conditional formatting, and undo/redo stack.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "spreadsheet-like-grid",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "spreadsheet", "grid", "formulas", "copy-paste", "undo", "virtualization", "DAG"],
  relatedTopics: ["data-table", "rich-text-editor", "form-builder"],
};

export default function SpreadsheetLikeGridArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Spreadsheet-Like Grid</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Spreadsheet-like Grid around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design a Spreadsheet-Like Grid is an implementation-heavy low-level design problem covering cell addressing, range selection, formula parsing, dependency tracking, recalculation, virtualization, clipboard, undo, and edit commit. A principal-level answer must make state ownership, data structures, lifecycle, failure containment, consistency, privacy, cost, and observability explicit.</p><p>Separate cell source values from computed values and rendered viewport state. Formula recalculation follows a dependency graph and must detect cycles deterministically. The implementation structures are cell map, row-column ids, formula AST, dependency graph, reverse edges, dirty queue, selection ranges, edit draft, undo journal, and viewport window.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/spreadsheet-like-grid-runtime.svg" alt="Design a Spreadsheet-Like Grid runtime" caption="Topic-specific runtime stages from user intent through durable projection." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Spreadsheet-like Grid, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below contains the topic-specific implementation mechanics.</p><p>
        A spreadsheet-like grid is one of the most architecturally ambitious UI
        components in enterprise software. It combines a high-performance virtualized
        rendering engine, a formula evaluation system with dependency tracking, a
        multi-cell selection model, clipboard integration, an undo/redo stack, and
        a formula parse tree — all in a browser context with strict 60fps constraints.
        Building a production-grade spreadsheet grid touches nearly every performance
        and data structure challenge relevant to frontend systems design.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/spreadsheet-like-grid-architecture.svg"
        alt="Spreadsheet grid architecture diagram"
        caption="Spreadsheet grid architecture: cell model, formula engine, selection and range, conditional formatting and undo"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The scope of a "spreadsheet-like grid" varies enormously between a simple inline
        data editor and a full Excel-equivalent browser application. Establish the
        boundaries before designing.
      </p>
      <p>
        How large can the grid be? A 100×20 editable table in an admin dashboard is
        fundamentally different from a 1,000,000×1,000 virtual grid. For the latter,
        full virtualization — rendering only the cells visible in the viewport plus a
        small overscan buffer — is non-negotiable. For the former, simpler approaches
        suffice.
      </p>
      <p>
        Are formulas required? Formula support adds a dependency graph, a formula
        parser, an evaluator, and circular reference detection. It is the highest
        complexity feature on the list. A grid used as a configurable data table may
        not need formulas at all; a budgeting tool requires them.
      </p>
      <p>
        What collaboration model is needed? Purely local (one user editing at a time)
        or real-time collaborative (multiple cursors, operational transforms or CRDT
        merging)? Real-time collaboration is a separate major system layered on top of
        the grid.
      </p>

      <h3>The Cell Data Model</h3>
      <p>
        Each cell in the grid stores multiple pieces of data: the raw input (the string
        the user typed), the computed value (the result of formula evaluation or the
        raw input if no formula), the display format (number format, date format, text
        alignment), and style metadata (background color, font weight, border styles).
      </p>
      <p>
        Storing the entire grid as a 2D array works for small grids but becomes
        memory-intensive for large sparse grids where most cells are empty. A
        sparse representation — a Map keyed by cell address (row index and column index,
        or the Excel-style "A1" notation) — stores only non-empty cells. The map's
        key is a normalized identifier; lookups are O(1). Default values (empty string
        raw input, white background, left-aligned text) are returned for any address
        not in the map.
      </p>
      <p>
        Cell addresses in a large grid require a careful key format. Using a string key
        like "3:7" (row 3, column 7) is simple but requires string concatenation on
        every lookup. An integer key computed as row * MAX_COLS + col is faster but
        requires knowing MAX_COLS in advance. For truly unbounded grids, a two-level
        Map (outer Map keyed by row, inner Map keyed by column) gives O(1) lookup
        without requiring MAX_COLS.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Separate the cell's stored data from its display representation. The raw input
        is what the user typed; the computed value is what formulas resolve to; the
        formatted value is what the cell displays after applying the number/date format.
        A cell containing the formula "=SUM(A1:A10)" has raw input "=SUM(A1:A10)",
        computed value 42 (the numeric result), and formatted value "42.00" (after
        applying a number format). Keeping these three separate prevents data corruption
        when format changes do not affect computation.
      </HighlightBlock>

      <h3>The Formula Engine</h3>
      <p>
        A formula engine has two components: a parser (tokenizes and parses the formula
        string into an AST) and an evaluator (traverses the AST to produce a value).
        The parser recognizes cell references (A1, $A$1, A1:B3), function calls
        (SUM, AVERAGE, IF, VLOOKUP), arithmetic operators, and string/number literals.
      </p>
      <p>
        The AST for a formula like "=IF(A1 is greater than 10, B1*2, 0)" contains an
        IF function node whose arguments are: a comparison expression node (A1 reference
        node, comparison operator, number literal 10), a multiplication expression node
        (B1 reference node, number literal 2), and a number literal 0. The evaluator
        recursively traverses this tree, resolving cell references by reading from the
        cell map, and returns the computed value.
      </p>
      <p>
        The evaluator must handle cell references that themselves contain formulas —
        it needs to evaluate referenced cells recursively. This creates a dependency
        graph: if cell C1 depends on B1, which depends on A1, evaluating C1 requires
        evaluating B1, which requires evaluating A1. Circular references (A1 depends
        on B1, B1 depends on A1) must be detected and reported as errors rather than
        causing infinite recursion.
      </p>
      <p>
        The dependency graph is a directed acyclic graph (DAG) where each node is a
        cell and each edge represents a dependency. When a cell's value changes,
        the engine must re-evaluate all cells that depend on it (directly or transitively).
        Topological sort of the affected subgraph gives the correct evaluation order —
        cells are re-evaluated from leaves (cells with no dependents) toward roots.
      </p>
      <p>
        For performance, the dependency graph is maintained incrementally. When a cell's
        formula changes, remove the cell's old outgoing dependency edges (the cells it
        previously referenced) and add new ones based on the new formula's cell
        references (which the parser extracts as a side product of parsing). When a
        cell is edited, trigger re-evaluation of its dependents using a BFS/DFS on the
        dependency graph.
      </p>

      <h3>Virtualized Rendering</h3>
      <p>
        Rendering a 1,000×1,000 grid means 1,000,000 DOM nodes if every cell is rendered.
        This is catastrophically slow. Virtualization renders only the cells visible in
        the scrollable viewport, plus an overscan buffer of rows and columns beyond the
        visible edges (typically 2–5 rows above/below and columns left/right of the
        viewport edges).
      </p>
      <p>
        The virtualization algorithm computes the visible row range [startRow, endRow]
        and column range [startCol, endCol] from the scroll position and the cell
        dimensions. For uniform cell heights and widths, this is simple arithmetic:
        startRow = Math.floor(scrollTop / rowHeight), endRow = Math.ceil((scrollTop
        + viewportHeight) / rowHeight). For variable row heights and column widths
        (which are common since users resize columns), a binary search through the
        cumulative offset array finds the start index efficiently.
      </p>
      <p>
        The rendered cells are positioned absolutely within a container that is sized
        to the full virtual grid dimensions (totalRows * rowHeight by totalCols *
        colWidth). This creates the scrollbar track that represents the full grid size.
        Cells use top/left positioning based on their cumulative row and column offsets.
      </p>
      <HighlightBlock as="p" tier="important">
        CSS transforms (transform: translate(x, y)) rather than top/left positioning
        for cell placement run on the compositor thread and avoid layout recalculations
        when scrolling. However, composited elements create new stacking contexts,
        which can interfere with fixed-position frozen rows/columns. Use transforms
        for scrolling cells and top/left for frozen rows/columns that do not scroll.
      </HighlightBlock>

      <h3>Multi-Cell Selection Model</h3>
      <p>
        Selection in a spreadsheet is a range — typically a rectangular region defined
        by an anchor cell (where the selection started) and an active cell (where the
        selection currently ends). The selection range includes all cells between the
        anchor and active in both dimensions. Multiple disjoint selections (Ctrl+click)
        are represented as an array of ranges.
      </p>
      <p>
        The selection state is separate from the focus state. The "active cell" (where
        keyboard input goes and what the formula bar shows) is a single cell. The
        "selection" is the highlighted range. When the user types in the active cell,
        only that cell receives the input. When the user copies, the entire selection
        range is copied.
      </p>
      <p>
        Selection via keyboard: Shift+Arrow extends the selection by one cell in the
        arrow direction. Shift+Ctrl+Arrow extends to the edge of the contiguous data
        region (or the edge of the grid). Shift+Click extends the selection to the
        clicked cell. These interactions update the active cell position while keeping
        the anchor fixed.
      </p>

      <h3>Inline Cell Editing</h3>
      <p>
        When the user double-clicks a cell or starts typing into the active cell, the
        cell enters edit mode. In view mode, the cell shows the formatted value as
        read-only content. In edit mode, the cell shows an absolutely-positioned input
        element (or contenteditable div for rich formula input) containing the raw
        value.
      </p>
      <p>
        The input must match the cell's visual dimensions exactly — same width, height,
        padding, font — so that switching between view and edit mode is visually seamless.
        Use a hidden measurement div with the same CSS properties to determine the
        auto-sizing dimensions if the cell width should expand to fit the content while
        editing.
      </p>
      <p>
        Committing the edit: pressing Enter commits the value and moves the active cell
        down. Tab commits and moves right. Escape discards the edit and restores the
        previous value. Clicking another cell commits the current edit and activates
        the clicked cell.
      </p>
      <p>
        Formula entry: if the input begins with "=", the grid enters formula editing
        mode, which highlights referenced cells (A1:B3 in the formula causes cells A1
        through B3 to glow) and shows inline formula suggestions (function autocomplete).
        This is a complex sub-feature requiring awareness of the formula parser's AST
        during partial typing.
      </p>

      <h3>Undo/Redo Stack</h3>
      <p>
        The undo/redo stack is a command history. Each command records the before-state
        and after-state of the affected cells. A command might be: "set cell A1 from
        old-value to new-value" (single-cell edit), "set cells A1:C3 from old-values
        to new-values" (paste or fill operation), or "set column 2 width from 100 to
        150" (column resize).
      </p>
      <p>
        The stack is bounded (typically 100–200 entries) to prevent unbounded memory
        growth. When the stack exceeds the limit, the oldest entry is discarded. The
        undo pointer starts at the top of the stack. Undo moves the pointer backward
        and applies the reverse operation; redo moves it forward and re-applies the
        operation. Any new action after an undo truncates the redo portion of the
        stack.
      </p>
      <p>
        For efficiency, commands should store diffs rather than full snapshots. A paste
        of 10,000 cells would require storing 10,000 before-values and 10,000 after-values.
        Using a sparse diff (only the cells that actually changed) minimizes memory
        usage. For formula-heavy grids, the undo command includes only the raw input
        changes; the computed values are re-derived by re-evaluating the affected
        formula dependency graph after undo/redo.
      </p>

      <h3>Conditional Formatting</h3>
      <p>
        Conditional formatting applies styles to cells based on their values or formulas.
        Rules are ordered (higher-priority rules override lower-priority ones) and
        scoped to cell ranges. Each rule has a condition (cell value greater than X,
        formula evaluates to true, top N values in range) and a style to apply
        (background color, font color, icon set).
      </p>
      <p>
        The evaluation of conditional formatting rules must be efficient because it runs
        for every visible cell on every render. Rules are evaluated in priority order
        for each cell; the first matching rule's style is applied. For rules with
        range-level conditions (top N values, above average), pre-compute the aggregate
        (max, min, average) for the relevant range once and cache it. Invalidate the
        cache when any cell in the range changes.
      </p>
      <p>
        Conditional formatting styles are applied as inline styles on the cell element,
        overriding the base styles. Merge the conditional format styles with the cell's
        explicit styles using a defined precedence order (conditional format wins over
        default cell style, loses to explicitly user-applied styles in some systems,
        or the other way depending on product requirements).
      </p>

      <h3>Clipboard Integration</h3>
      <p>
        Copy (Ctrl+C) serializes the selected range to multiple clipboard formats:
        text/plain (TSV — tab-separated values), text/html (an HTML table for rich
        paste into other apps), and a proprietary application/json format that includes
        the full cell metadata (formulas, styles) for within-app paste.
      </p>
      <p>
        The Clipboard API (navigator.clipboard.write) accepts a ClipboardItem with
        multiple types. The text/plain and text/html types cover pasting into other
        applications; the proprietary type is read by the grid's own paste handler.
      </p>
      <p>
        Paste (Ctrl+V) reads the clipboard and determines the best available format.
        If the proprietary format is available (intra-app paste), use it to restore
        formulas and styles. Otherwise, parse text/plain as TSV to populate a grid
        region starting at the active cell. If the pasted data is larger than the
        available space (pasting beyond the grid boundary), expand the grid or truncate
        with a user warning.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Separate input normalization, typed state transitions, derived projection, integration effects, and bounded telemetry. Preview state must not silently become durable state. Every timer, listener, observer, worker, request, pointer capture, and cache entry needs an explicit lifetime.</p><p>Separate cell source values from computed values and rendered viewport state. Formula recalculation follows a dependency graph and must detect cycles deterministically. Commit only after applying the latest policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/spreadsheet-like-grid-recovery.svg" alt="Design a Spreadsheet-Like Grid recovery map" caption="Recovery decisions: contain pressure, retain committed truth, reconcile safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>An HTML table is enough for display; a grid runtime is justified for editing, formulas, range operations, virtualization, and deterministic recalculation.</p><p>Cell edits are ordered transactions. Computed values derive from a versioned dependency graph; collaborative persistence must reconcile cell versions or operations explicitly. The scale pressure is millions of cells, dependency fan-out, cycles, paste bursts, variable widths, collaborative edits, and expensive formulas. Bound work, cancel stale effects, cap memory, and degrade predictably.</p><p>Use optimistic UI only where rollback is deterministic and understandable. Keep authorization and destructive truth server-side.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use stable ids, typed events, explicit state unions, idempotency keys, generation guards, SSR-safe feature checks, and deterministic cleanup. Test keyboard use, accessibility output, stale responses, retries, unmount, constrained devices, and large datasets.</p><p>Measure interaction latency, blocked transitions, stale drops, rollbacks, cache pressure, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include mixing preview and commit, trusting arrival order, leaking resources, accepting stale async work, and implementing custom interaction without semantic fallbacks.</p><p>For this topic, detect cycles, batch dirty recalculation, virtualize viewport cells, cap formula cost, sanitize clipboard input, preserve edit draft, and expose calculation errors. Security and privacy require the design to validate untrusted input, authorize durable mutations server-side, minimize sensitive telemetry, and bound resource consumption.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This runtime applies where users repeatedly manipulate state while network, browser, and authorization boundaries can fail independently. Reuse the controller shell, but inject product-specific policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>How do you model state?</h3><p>Separate cell source values from computed values and rendered viewport state. Formula recalculation follows a dependency graph and must detect cycles deterministically.</p><h3>What breaks at scale?</h3><p>millions of cells, dependency fan-out, cycles, paste bursts, variable widths, collaborative edits, and expensive formulas. I would bound expensive work and cancel obsolete effects.</p><h3>What consistency model applies?</h3><p>Cell edits are ordered transactions. Computed values derive from a versioned dependency graph; collaborative persistence must reconcile cell versions or operations explicitly.</p><h3>How do you recover?</h3><p>I would detect cycles, batch dirty recalculation, virtualize viewport cells, cap formula cost, sanitize clipboard input, preserve edit draft, and expose calculation errors.</p><h3>Why this architecture?</h3><p>An HTML table is enough for display; a grid runtime is justified for editing, formulas, range operations, virtualization, and deterministic recalculation. The implementation cost is justified only when the required behavior needs it.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li></ul></section>
</ArticleLayout>}
