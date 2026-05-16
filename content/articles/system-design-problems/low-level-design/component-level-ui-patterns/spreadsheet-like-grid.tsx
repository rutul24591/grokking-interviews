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

export default function SpreadsheetLikeGridArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
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

      <h2>Clarifying the Requirements</h2>
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

      <h2>The Cell Data Model</h2>
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

      <h2>The Formula Engine</h2>
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

      <h2>Virtualized Rendering</h2>
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

      <h2>Multi-Cell Selection Model</h2>
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

      <h2>Inline Cell Editing</h2>
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

      <h2>Undo/Redo Stack</h2>
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

      <h2>Conditional Formatting</h2>
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

      <h2>Clipboard Integration</h2>
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
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you detect circular references in formulas without infinite recursion?</h3>
      <p>
        During formula evaluation, maintain a "currently evaluating" set of cell
        addresses. When evaluating cell C1, add C1 to this set. If, during C1's
        evaluation, a dependency on C1 is encountered again (directly or transitively),
        detect this by checking if C1 is already in the "currently evaluating" set and
        return a circular reference error instead of recursing. After C1's evaluation
        completes (or errors), remove it from the set. This is essentially DFS cycle
        detection with a visited stack. Alternatively, detect cycles statically in the
        dependency graph after each formula change using topological sort — if
        topological sort fails (the graph has a cycle), mark all cells in the cycle as
        circular reference errors without attempting evaluation.
      </p>

      <h3>Q: How do you virtualize a grid with variable row heights efficiently?</h3>
      <p>
        Maintain a cumulative height array indexed by row number. Cumulative heights[i]
        is the total height of rows 0 through i-1 (the top edge of row i). To find the
        first visible row given a scroll offset, binary search this array for the largest
        cumulative height less than or equal to scrollTop. This is O(log N) rather than
        O(N). When a row height changes (e.g., the user resizes row 50 to a new height),
        update the cumulative array from row 50 onward — O(N) in the worst case, but
        with a sorted typed array this update is a fast memory operation. For grids
        with millions of rows, use a Fenwick tree (Binary Indexed Tree) which supports
        O(log N) point updates and prefix sum queries, giving O(log N) for both height
        updates and scroll position queries.
      </p>

      <h3>Q: How does the formula engine handle function evaluation that needs the full range values, like SUM(A1:A1000)?</h3>
      <p>
        Range functions receive a range reference as their argument, not individual
        cell values. The evaluator resolves a range reference to an iterator over the
        cells in that range. The SUM function iterates this lazily, accumulating the
        sum without materializing all 1000 cell values into an intermediate array.
        Each cell in the range is resolved by looking up its computed value from the
        cell map (O(1) per cell). For large ranges, this is O(N) in range size, which
        is unavoidable — there is no way to sum 1000 values without visiting each one.
        Optimization: cache the range aggregate (sum, count, average) on the dependency
        graph edge and invalidate only when a cell in the range changes. This memoizes
        the expensive O(N) computation and makes subsequent reads O(1) for unchanged
        ranges.
      </p>

      <h3>Q: How would you implement collaborative editing on the spreadsheet grid?</h3>
      <p>
        Collaborative editing requires an Operational Transform (OT) or CRDT approach.
        Each cell edit is an operation: set cell [row, col] to value V. Operations are
        sent to a server; the server maintains the canonical state and applies
        operations in order, broadcasting each to all clients. Clients apply incoming
        operations from other users as patches to their local state. The OT challenge
        for spreadsheets is that operations can conflict: two users editing the same cell
        simultaneously must be resolved (last-write-wins is common for single-cell edits,
        merge-semantics for range operations). CRDT-based approaches use data structures
        (like fractional indexing for row ordering) that automatically resolve conflicts
        without server coordination. For a staff-level answer, frame the choice around
        consistency guarantees: OT with a server guarantees a single linearized history;
        CRDTs guarantee availability under network partition but may diverge on concurrent
        edits of the same cell.
      </p>

      <h3>Q: How do you handle copy-paste of cells with relative formula references?</h3>
      <p>
        Excel-style formula copying adjusts relative cell references by the paste offset.
        If cell A1 contains "=B1+C1" and the user copies it and pastes at A2, the
        formula becomes "=B2+C2" (references shift down by one row). Absolute references
        (with $ prefix, like $B$1) do not shift. The paste operation must parse the
        copied formula, identify each cell reference and whether it is relative or
        absolute in each dimension, then rewrite the formula with the appropriate offset
        applied to relative references. This requires the formula AST — which already
        classifies references as absolute or relative during parsing — to be preserved
        through the copy/paste operation (the proprietary clipboard format includes the
        parsed AST or the raw formula string, from which the paste handler rebuilds the
        shifted formula).
      </p>
    </ArticleLayout>
  );
}
