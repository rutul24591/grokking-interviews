"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-spreadsheet-like-grid",
  title: "Design a Spreadsheet-like Grid",
  description:
    "LLD for a spreadsheet grid: cell editing, formulas with dependency graph, copy-paste of regions, undo/redo, drag-fill, column/row resize, and accessibility.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "spreadsheet-like-grid",
  wordCount: 7500,
  readingTime: 40,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "spreadsheet",
    "formulas",
    "undo-redo",
    "copy-paste",
    "dependency-graph",
    "react",
  ],
  relatedTopics: [
    "virtualized-grid-2d",
    "data-table",
    "inline-editing-system",
  ],
};

export default function SpreadsheetLikeGridArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a spreadsheet-like grid — the
          interaction layer over a 2D virtualized grid that
          turns it from a viewer into an editor. Users edit
          cells in place, write formulas that reference
          other cells, copy and paste regions, drag-fill
          patterns down a column, undo and redo their work,
          and resize rows and columns. The component is the
          backbone of products like in-app spreadsheets,
          financial modeling tools, data-entry workflows,
          and any UI where tabular interaction matches user
          mental models from Excel or Google Sheets.
        </p>
        <p>
          The hard problems are deeply interrelated.
          Formula evaluation requires a dependency graph
          that updates incrementally as cells change.
          Copy-paste of regions must handle both internal
          ranges and external clipboard content (rich
          formats). Undo/redo across heterogeneous edits
          (single-cell, range edits, structural changes)
          needs a coherent command pattern. Drag-fill must
          detect patterns (dates, numeric sequences, text
          patterns) and extrapolate them. Selection — single
          cell, range, multi-range with Cmd-click —
          interacts with every other interaction. Keyboard
          navigation through the ARIA grid pattern must
          coexist with native edit affordances. Done well,
          this becomes a powerful primitive used across the
          product; done poorly, the spreadsheet feels
          broken in subtle ways that frustrate power users.
        </p>

        <h3>User Context</h3>
        <p>
          Power users (analysts, financial modelers, data
          entry operators) spend hours in the spreadsheet
          and have deep muscle memory from Excel and Google
          Sheets. They expect Tab to move right, Enter to
          move down, Cmd-Z to undo. They use formulas to
          compute values from other cells; they paste data
          from external sources; they drag-fill to extend
          patterns; they expect undo to span every action
          they&rsquo;ve taken. Engineering teams consume the
          spreadsheet as a higher-level component built on
          top of the Virtualized Grid 2D primitive.
        </p>

        <h3>Assumptions</h3>
        <p>
          The grid sits on top of the Virtualized Grid 2D
          primitive. Datasets fit in client memory (up to
          tens of thousands of rows × hundreds of columns —
          beyond that, server-side processing applies).
          Formulas are a constrained subset of spreadsheet
          formulas (arithmetic, logical, lookup, basic
          aggregates) — not the full Excel feature set.
          Modern browsers; we use the Clipboard API for
          paste, IndexedDB for offline edit queue.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the full Excel formula
          surface (no LAMBDA, no advanced statistical
          functions). We do not implement charts, pivot
          tables, conditional formatting beyond a small
          subset, or macros. Real-time collaboration on a
          single sheet is a separate problem (CRDTs apply);
          we support single-user edit with eventual sync.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          In-place cell editing: double-click or F2 to
          edit, Enter to commit, Escape to cancel. Type-aware
          editors based on cell type (text, number, date,
          select). Formula support with a dependency graph
          that updates on cell change; circular references
          detected. Selection model: single cell, range
          (click-drag or shift-click), multi-range
          (Cmd-click). Copy-paste: internal copy keeps cell
          metadata; external paste interprets clipboard
          format (TSV, CSV, plain text). Drag-fill via the
          fill handle: extends patterns
          (numeric sequences, dates, day-of-week, text). Row
          and column resize via drag. Undo/redo across all
          edit types. Keyboard navigation: arrow keys, Tab,
          Enter, Page Up/Down, Home/End, Ctrl+Home/End.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Conditional formatting (highlight cells matching
          rules). Cell comments / notes. Frozen first-row
          and first-column (delegated to the underlying 2D
          grid). Find-and-replace across cells. Sort
          ranges. Cell formatting toolbar (number format,
          alignment, color). Insert/delete rows and columns
          with formula reference adjustment. Server-side
          sync of edits with conflict resolution. Real-time
          presence indicators (multiple users viewing the
          same sheet, with their cursors).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Full Excel feature parity, charts, pivot tables,
          macros, real-time collaborative editing of the
          same cell.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Cell edits commit in under 50 ms including
          dependent formula recomputation. Undo/redo of
          single edits in under 50 ms; multi-cell undos in
          under 200 ms. Smooth scroll preserved despite
          dependency graph updates. Drag-fill of a 100-row
          range in under 100 ms.
        </p>

        <h3>Reliability</h3>
        <p>
          Formula evaluation deterministic: same inputs
          produce same outputs. Circular references
          detected and surfaced rather than crashing.
          Undo/redo never produces inconsistent state — the
          command history is the source of truth for state
          reconstruction. Copy-paste never silently drops
          data; mismatched shapes (paste a 5x5 region into
          a 3x3 selection) surface a confirmation.
        </p>

        <h3>Security</h3>
        <p>
          Formula DSL is sandboxed: no host access, no
          arbitrary function calls, no eval. Formulas
          can&rsquo;t reference external URLs or read host
          state. Cell content renders as text; HTML opt-in
          per cell type with sanitizer. Pasted content from
          external sources is sanitized before commit.
        </p>

        <h3>Accessibility</h3>
        <p>
          ARIA grid pattern with cell-level focus. Edit
          state announced (&ldquo;Editing cell B5&rdquo;).
          Selection range announced. Keyboard parity with
          mouse — every action available via keyboard.
          Formula errors surface as accessible inline
          messages.
        </p>

        <h3>Maintainability</h3>
        <p>
          Formula functions in a registry; adding a new
          function is a one-file change. Editor types
          plug into a registry. The undo stack is built
          from a single command interface; new edit types
          implement the interface and are automatically
          undoable.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/spreadsheet-like-grid-architecture.svg"
        alt="Spreadsheet-like Grid Architecture"
        caption="2D Virtualized Grid (substrate) ← Cell Store + Selection Model + Edit State + Formula Engine (dependency DAG) + Command History (undo/redo) + Clipboard Bridge + Fill-handle pattern detector. The spreadsheet layers interaction systems over the rendering primitive."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The spreadsheet is a layered system on top of the
          2D virtualized grid. The substrate handles
          rendering and virtualization. On top of it, we
          add a <strong>cell store</strong> (canonical
          values plus formulas), a <strong>formula engine</strong>{" "}
          (parser, dependency DAG, evaluator), a
          <strong> selection model</strong> (single,
          range, multi-range), an <strong>edit state</strong>{" "}
          (which cell is being edited, the editor type,
          the in-progress value), a <strong>command
          history</strong> (undo/redo via command pattern),
          a <strong>clipboard bridge</strong> (internal and
          external paste), and a <strong>fill-handle</strong>{" "}
          (pattern detection and extrapolation). Each
          subsystem is independently testable.
        </p>
        <p>
          The <strong>cell store</strong> holds, for each
          cell, a canonical value (the literal or computed
          result), a formula string if the cell is a
          formula, a type, and metadata (formatting, note).
          Formula cells separate &ldquo;input&rdquo; (the
          user-typed string) from &ldquo;output&rdquo; (the
          evaluated value); both are kept because the user
          types the input and the UI displays the output,
          but editing reverts to showing the input.
        </p>
        <p>
          The <strong>formula engine</strong> parses formula
          strings into ASTs, extracts cell references, and
          builds a dependency DAG: cell A depends on cell
          B if A&rsquo;s formula references B. On a cell
          change, the engine looks up dependents in the DAG
          and recomputes them in topological order. Circular
          references are detected at parse time when adding
          a formula to the graph; the cell shows a
          <code> #CYCLE</code> error rather than computing
          something nonsensical. The DAG also enables
          incremental recomputation: changing one cell
          touches only its dependents, not the entire
          sheet.
        </p>
        <p>
          The <strong>selection model</strong> tracks the
          current selection: an active cell, a range
          (start cell + end cell), or multiple ranges
          (Cmd-click for multi-select). Selection state is
          a small object that consumers subscribe to;
          rendering selection is a CSS overlay on the grid
          rather than per-cell state, which keeps cell
          re-renders to a minimum during selection drag.
        </p>
        <p>
          The <strong>edit state</strong> tracks which cell
          is in edit mode, the current editor type, and the
          in-progress value. When the user double-clicks or
          presses F2, edit mode opens with the appropriate
          editor for the cell type — a text input for text,
          a number input for number, a date picker for
          date. Enter commits via the command system;
          Escape cancels. While editing, formula references
          highlight the referenced cells in the grid for
          orientation.
        </p>
        <p>
          The <strong>command history</strong> uses the
          command pattern. Every edit (cell value change,
          range paste, drag-fill, row/column insert) is
          encoded as a command with
          <code> apply()</code> and <code>undo()</code>
          methods. Commands push onto an undo stack; redo
          uses a separate redo stack that clears on the
          next non-redo command. A multi-cell paste is a
          single command with multiple internal effects, so
          undoing a paste reverts all affected cells in one
          step. This atomicity matches user expectation
          from Excel.
        </p>
        <p>
          The <strong>clipboard bridge</strong> handles copy
          and paste. Copy serializes the selected range to
          multiple formats: a custom JSON format
          (preserving cell metadata) for internal paste,
          plus TSV and HTML for external paste into Excel
          or Sheets. Paste reads the clipboard, prefers the
          JSON format if present, falls back to TSV or
          HTML; mismatched shape (pasting a 5x3 into a 1x1
          selection) extends the selection. Pasted formulas
          are translated for the new position (relative
          references shift; absolute references stay).
        </p>
        <p>
          The <strong>fill handle</strong> is the small
          square at the bottom-right of the active cell.
          Dragging it down or right extends the selection
          and applies pattern-detection: numeric sequences
          (1, 2, 3 → 4, 5, 6), date sequences (Jan, Feb,
          Mar), days of the week, single-cell repeat for
          unrecognized patterns. The detection runs on the
          source cells and extrapolates to fill the
          target.
        </p>
        <p>
          On <strong>cell edit commit</strong>, the engine
          runs: validate the new value (or parse and
          validate the formula), update the cell store
          (which fires a change event), recompute
          dependents in topological order, push a command
          onto the history. The whole sequence is
          transactional — either it all succeeds or none of
          it commits — so undo can confidently revert to
          the prior state.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SpreadsheetProvider</strong> instantiates
          all subsystems and exposes them via stable
          context. <strong>CellStore</strong> holds canonical
          cell data. <strong>FormulaEngine</strong> manages
          parsing, the DAG, and evaluation.
          <strong> SelectionModel</strong> tracks the current
          selection. <strong>EditController</strong> manages
          edit state. <strong>CommandHistory</strong>{" "}
          implements undo/redo. <strong>ClipboardBridge</strong>{" "}
          handles copy/paste. <strong>FillHandle</strong>{" "}
          detects and extrapolates patterns.
          <strong> CellRenderer</strong> renders one cell
          and connects to the appropriate editor in edit
          mode.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The cell store is the largest state surface;
          subscribers (visible cells) read via selectors.
          Selection is a small store that the overlay
          subscribes to. Edit state is a small store that
          only the editor and a few UI elements (formula
          bar) subscribe to. The command history is its own
          store. All subsystems read from and write to a
          shared form-store-like coordinator that
          serializes mutations for undo/redo correctness.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>cells</code> (initial cell data),
          <code> rowCount</code>, <code>columnCount</code>,
          <code> functions</code> (formula function
          registry),
          <code> editors</code> (editor type registry),
          <code> onCellsChange</code>. Cell shape:{" "}
          <code>{` { type, value, formula?, format?, note? } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          Selection rendering is a CSS overlay, not per-cell
          state, so dragging a selection across hundreds of
          cells doesn&rsquo;t re-render any cell. Edit state
          is per-cell-only-when-editing; the rest of the
          time, cells render their value memoized by (cell
          id, value, formatting). Formula recomputation is
          incremental via the dependency DAG; changing one
          cell touches only its dependents. For large
          formula workloads, the engine runs in a Web
          Worker; the main thread only handles edit input
          and rendering.
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX</h2>
        <p>
          A formula bar above the grid shows the active
          cell&rsquo;s formula (or value if no formula).
          Editing in the formula bar mirrors editing
          in-cell. Selection visualization uses a colored
          border for the selection range plus
          highlighted column and row headers. The fill
          handle appears at the bottom-right corner of the
          active cell. Cell type indicators (a small badge
          for date or formula cells) help users orient.
          Errors render inline as
          <code> #ERROR</code> with a tooltip explaining
          the error.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          ARIA grid pattern from the underlying 2D grid.
          Edit state announces (&ldquo;Editing cell
          B5&rdquo;). Selection announces (&ldquo;Selected
          range B5 to D7&rdquo;). Formula errors are
          accessible inline messages. Every keyboard
          shortcut has a discoverable equivalent in a
          keyboard-help dialog. Visual selection indicators
          are paired with text equivalents so non-visual
          users have parity.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Formula DSL is sandboxed: a strict parser
          whitelists tokens; identifiers must resolve to
          cell references or registered functions. No
          host access, no
          <code> eval</code>, no arbitrary code. Functions
          are pure and registered explicitly. External
          paste content is sanitized: HTML clipboard
          content runs through DOMPurify; we never insert
          raw HTML into a cell. Cell content renders as
          text by default.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests cover the formula parser (operator
          precedence, references, ranges), the dependency
          DAG (topological sort, cycle detection),
          incremental recomputation (only dependents
          recompute), the command pattern (apply/undo
          symmetry), pattern detection for fill (numeric,
          date, day-of-week). Integration tests exercise
          full edit flows: edit a cell, verify dependents
          update; copy a range, paste, verify reference
          translation; undo a multi-cell edit, verify
          full revert. Property tests verify undo/redo
          correctness: any sequence of edits followed by
          equal undos should return to the initial state.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Circular references: detected when adding a
          formula to the DAG; the cell shows
          <code> #CYCLE</code>. A formula references a
          cell that doesn&rsquo;t exist (out of bounds):
          shows
          <code> #REF</code>. Paste larger than
          selection: extends selection with confirmation.
          Paste of TSV with formulas (from Excel): we
          parse the TSV and translate formula syntax;
          incompatible formulas show
          <code> #N/A</code>. Insert a row in the middle
          of the sheet: all formulas referring to rows
          below shift their references; absolute
          references with
          <code> $</code> don&rsquo;t shift. Drag-fill of
          unrecognized patterns: fall back to repeating
          the source. User edits a cell whose formula
          references it indirectly through a chain (would
          create a cycle): detect at parse, surface
          <code> #CYCLE</code>. Very long formulas:
          parser depth limit prevents stack overflow.
          Performance regression on large dependency
          graphs: we throttle recomputation to one batch
          per frame.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The formula engine, command history, and
          selection model are reusable in any table-like
          UI that needs them. The fill-handle pattern
          detector is generic over cell types.
          Function-registry-based design lets consumers
          add custom functions per product (a
          finance-specific
          <code> NPV</code>, an analytics-specific
          <code> COHORT</code>).
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Number and date formatting via
          <code> Intl.NumberFormat</code> and
          <code> Intl.DateTimeFormat</code> with locale
          awareness. Function names are i18n-safe
          (typically English, like Excel) but error
          messages translate. Paste from locale-different
          sources (German decimal commas, US decimal
          points) parses correctly via locale-aware
          parsers.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Custom DSL vs JavaScript expressions</h3>
        <p>
          Custom DSL is sandboxed, predictable,
          serializable. JavaScript expressions via
          <code> eval</code> would let users write
          anything but open massive security and
          stability holes. We use a custom DSL.
        </p>

        <h3>Command pattern vs immutable state snapshots</h3>
        <p>
          Command pattern is memory-efficient (each
          command is small) and easy to reason about (undo
          is the inverse). Immutable state snapshots are
          simpler to implement but balloon memory for
          large sheets. We use commands.
        </p>

        <h3>Dependency DAG vs full re-evaluation</h3>
        <p>
          Full re-evaluation on every edit is simple but
          O(cells); the DAG enables O(dependents)
          incremental recomputation, which is what scales
          to large sheets. We use the DAG.
        </p>

        <h3>Web Worker for formula engine</h3>
        <p>
          For very large sheets with heavy formula
          workloads, moving the engine to a worker keeps
          the main thread free for input. The cost is
          message-channel overhead per edit; for typical
          sheets, main-thread is fine. Web Worker is
          opt-in via configuration.
        </p>

        <h3>Selection as overlay vs per-cell state</h3>
        <p>
          Overlay is a single CSS layer that doesn&rsquo;t
          re-render cells during selection drag. Per-cell
          state would re-render every cell in the
          selection on every drag tick. Overlay is the
          right design for performance.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Real-time collaborative editing via CRDTs.
          More formula functions (statistical, financial).
          Conditional formatting rule UI. Chart
          rendering inline in cells. Data validation
          rules. Server-side formula evaluation for
          extremely large sheets. Voice input for cell
          values.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does formula recomputation stay
          incremental?</strong> A dependency DAG. When a
          cell changes, look up dependents in the DAG and
          recompute them in topological order. Cells not
          in the dependent set don&rsquo;t recompute.
        </p>

        <p>
          <strong>2. How is undo/redo implemented?</strong>{" "}
          Command pattern. Every edit is a command with
          apply/undo methods. Commands push onto a stack;
          redo uses a separate stack that clears on the
          next non-redo command. Multi-cell edits are
          single commands with multiple internal effects.
        </p>

        <p>
          <strong>3. How do you handle circular
          references?</strong> Detect at formula parse
          time when adding to the DAG: if adding the
          dependency edge would create a cycle, refuse
          and show
          <code> #CYCLE</code>. Don&rsquo;t evaluate
          and don&rsquo;t add the edge.
        </p>

        <p>
          <strong>4. How does copy-paste work for
          formulas?</strong> Internal copy serializes
          formulas with their original references; on
          paste, references are translated for the new
          position (relative shifts; absolute stays).
          External paste from clipboard parses TSV or HTML
          format; pasted formulas in Excel syntax are
          translated to our DSL.
        </p>

        <p>
          <strong>5. How does drag-fill detect patterns?</strong>{" "}
          The fill engine analyzes the source cells:
          numeric sequences via difference, dates via
          step, day-of-week via cyclic detection, text
          patterns via regex. Unrecognized → repeat the
          source.
        </p>

        <p>
          <strong>6. Why is the formula DSL sandboxed?</strong>{" "}
          Security and predictability. JavaScript
          expressions via
          <code> eval</code> would let users write
          arbitrary code, opening XSS, data exfiltration,
          and infinite loops. A whitelisted DSL prevents
          all of those.
        </p>

        <p>
          <strong>7. How does the spreadsheet stay fast on
          large sheets?</strong> Virtualization from the
          underlying 2D grid; selection as overlay (no
          per-cell render); incremental formula
          recomputation via dependency DAG; optional
          Web Worker for the engine. Memoization of cell
          renders by (cell id, value, formatting).
        </p>

        <p>
          <strong>8. How is the spreadsheet
          accessible?</strong> ARIA grid pattern from
          the underlying 2D grid. Edit and selection
          state announced via live regions. Every
          keyboard shortcut has a discoverable equivalent
          via a help dialog. Errors are inline accessible
          messages.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A spreadsheet is the <strong>interaction
          layer</strong> over a 2D virtualized grid: cell
          store, formula engine with dependency DAG,
          selection model, edit state, command-pattern
          undo/redo, clipboard bridge, and fill-handle
          pattern detection. The substrate handles
          rendering; the spreadsheet handles
          interaction. Sandboxed formula DSL keeps it
          secure; incremental recomputation keeps it
          fast; the command pattern keeps undo
          coherent. The result feels like Excel without
          becoming Excel — a primitive consumers compose
          into product-specific spreadsheet experiences.
        </p>
      </section>
    </ArticleLayout>
  );
}
