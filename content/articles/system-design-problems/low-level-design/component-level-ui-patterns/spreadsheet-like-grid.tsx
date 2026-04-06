"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-spreadsheet-grid",
  title: "Design a Spreadsheet-like Grid",
  description:
    "Spreadsheet grid with cell editing, formulas, copy-paste, undo, column/row resize, and virtualization.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "spreadsheet-like-grid",
  wordCount: 3200,
  readingTime: 19,
  lastUpdated: "2026-04-03",
  tags: ["lld", "spreadsheet", "grid", "formulas", "copy-paste", "undo", "virtualization"],
  relatedTopics: ["data-table", "rich-text-editor", "form-builder"],
};

export default function SpreadsheetLikeGridArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a spreadsheet-like grid — a tabular data editor where users
          can edit cell values, enter formulas (=A1+B2), copy-paste from/to clipboard,
          undo/redo changes, resize columns and rows, and navigate with keyboard
          shortcuts. The grid must virtualize for large datasets (1000+ rows × 50+ columns).
        </p>
        <p>
          <strong>Assumptions:</strong> The grid supports basic spreadsheet operations:
          cell editing, formula evaluation, copy-paste, undo/redo. Formulas support
          basic arithmetic, cell references, and common functions (SUM, AVERAGE, COUNT).
          The grid renders as a virtualized table.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cell Editing:</strong> Double-click or Enter starts editing. Escape cancels. Tab/Enter commits and moves.</li>
          <li><strong>Formulas:</strong> Cells starting with &quot;=&quot; are formulas. Support cell references (A1, $A$1), arithmetic, and functions (SUM, AVERAGE, COUNT, IF).</li>
          <li><strong>Copy-Paste:</strong> Ctrl+C/V copies/pastes cell values and formulas. Multi-cell range copy-paste.</li>
          <li><strong>Undo/Redo:</strong> Unlimited undo of cell edits, formula changes, and resize operations.</li>
          <li><strong>Column/Row Resize:</strong> Drag column/row headers to resize. Persist sizes.</li>
          <li><strong>Navigation:</strong> Arrow keys move selection. Ctrl+Arrow jumps to edge. Ctrl+Home/End jumps to corner. Page Up/Down scrolls by page.</li>
          <li><strong>Selection:</strong> Click selects cell. Shift+click selects range. Ctrl+click selects multiple cells.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 1000×50 grid renders smoothly. Virtualization renders only visible cells.</li>
          <li><strong>Formula evaluation:</strong> Formula re-evaluation is incremental — only affected cells recalculate when a dependency changes.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Circular formula reference (=A1 references B1, B1 references A1) — detect and show #CIRCULAR! error.</li>
          <li>Paste exceeds grid bounds — auto-expand grid or reject with warning.</li>
          <li>Formula references deleted column/row — show #REF! error.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>cell data model</strong> with a 2D array (or sparse
          Map) storing cell values, formulas, and computed results. A <strong>formula
          engine</strong> parses formula strings, builds a dependency graph, and evaluates
          cells in topological order. A <strong>Zustand store</strong> manages cell data,
          selection, undo/redo history, and column/row sizes. The grid renders as a
          virtualized table with fixed column headers and row numbers.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Cell Data Model</h4>
          <p>Sparse Map keyed by cell ID (e.g., &quot;A1&quot;). Each cell has: rawValue (user input), formula (parsed AST or null), computedValue (evaluated result), and dependencies (cell IDs this cell depends on).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Formula Engine</h4>
          <p>Parses formula strings into AST. Builds dependency graph. Evaluates in topological order. Detects circular references. Supports cell references, ranges (A1:B3), arithmetic, and functions.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Undo/Redo Manager</h4>
          <p>Command pattern: each edit records an inverse command. Undo stack capped at 1000 entries. Redo stack cleared on new edit.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Virtualized Grid Renderer</h4>
          <p>Renders only visible cells plus overscan buffer. Column headers and row numbers are fixed. Scroll position maps to visible cell range.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/spreadsheet-like-grid-architecture.svg"
          alt="Spreadsheet grid architecture showing formula engine, dependency graph, and virtualized rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Grid initializes with empty cell data model.</li>
          <li>User types &quot;=A1+B2&quot; in C3 → formula engine parses, builds dependency graph (C3 depends on A1, B2).</li>
          <li>Formula engine evaluates C3: reads A1 and B2 values, computes sum, stores in C3.computedValue.</li>
          <li>User changes A1 → dependency graph triggers re-evaluation of C3 (and all downstream dependents).</li>
          <li>User presses Ctrl+Z → undo manager executes inverse command, restores previous value, re-evaluates dependents.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          User edit → cell update → dependency graph traversal → re-evaluate affected
          cells → virtualized grid re-renders visible cells → undo command recorded.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Circular reference:</strong> During dependency graph traversal, if a cell is visited twice in the same evaluation chain, flag it as #CIRCULAR! and halt the chain.</li>
          <li><strong>Paste exceeds bounds:</strong> If pasted data exceeds current grid size, auto-expand the grid to accommodate. Show a toast: &quot;Grid expanded to column Z&quot;.</li>
          <li><strong>Large formula chain:</strong> If changing one cell triggers 10,000 dependent cell re-evaluations, batch the re-evaluations via requestAnimationFrame to avoid blocking the main thread.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: sparse Map for cell storage, formula engine with dependency graph
          and topological sort, command-pattern undo/redo, virtualized grid rendering,
          and clipboard integration for copy-paste.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Cell edit</td><td className="p-2">O(d) — d dependent cells</td><td className="p-2">O(1) — single cell update</td></tr>
              <tr><td className="p-2">Formula parse</td><td className="p-2">O(f) — f = formula length</td><td className="p-2">O(f) — AST nodes</td></tr>
              <tr><td className="p-2">Virtual render</td><td className="p-2">O(v × c) — visible rows × columns</td><td className="p-2">O(v × c)</td></tr>
              <tr><td className="p-2">Undo</td><td className="p-2">O(1) — inverse command execution</td><td className="p-2">O(u) — u undo entries</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          Formula evaluation is sandboxed — no access to <code>eval()</code> or
          <code>Function</code> constructor. The formula parser only recognizes allowed
          operations and functions. For accessibility, the grid has <code>role=&quot;grid&quot;</code>,
          cells have <code>role=&quot;gridcell&quot;</code>, and screen readers announce
          cell coordinates (e.g., &quot;Column B, Row 3, value: 42&quot;). Keyboard
          navigation follows standard spreadsheet conventions.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> Formula engine — test parsing, evaluation, circular detection, dependency tracking. Undo/redo — test edit → undo → original value restored.</li>
          <li><strong>Integration:</strong> Edit cell, verify computed value updates. Change dependency, verify dependent cells recalculate. Copy-paste range, verify values paste correctly.</li>
          <li><strong>Performance:</strong> 1000×50 grid — verify virtualization renders only visible cells, scroll is smooth at 60fps.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Full grid re-evaluation on every edit:</strong> Re-evaluating all formulas when one cell changes is O(n²). Dependency graph with incremental re-evaluation is essential.</li>
          <li><strong>No circular reference detection:</strong> Circular formulas cause infinite recursion. Cycle detection in the dependency graph is mandatory.</li>
          <li><strong>Rendering all cells in DOM:</strong> A 1000×50 grid is 50,000 DOM nodes. Virtualization is mandatory.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement collaborative editing (multi-user)?</p>
            <p className="mt-2 text-sm">
              A: Use CRDTs (Y.js) for conflict-free concurrent cell edits. Each cell
              edit is an operation with causal ordering. Formula dependencies are
              maintained across collaborators. Show remote cursors and cell selections.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement chart generation from cell data?</p>
            <p className="mt-2 text-sm">
              A: User selects a cell range, chooses chart type (bar, line, pie). The
              chart component reads computed values from the selected range. Updates
              automatically when underlying cells change (subscribe to cell change events).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement conditional formatting?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>formatRules</code> array to the cell model. Each rule has
              a condition (e.g., value &gt; 100) and styling (background color, font
              color). On cell re-evaluation, check all rules and apply matching styles.
              Rules can reference other cells (e.g., highlight if A1 &gt; B1).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist the grid state?</p>
            <p className="mt-2 text-sm">
              A: Serialize the cell data model (raw values, formulas, column/row sizes)
              to JSON. Store in localStorage for small grids or send to server for
              larger ones. On load, deserialize and re-evaluate all formulas. Column
              sizes are restored from the saved config.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Grid Pattern
            </a>
          </li>
          <li>
            <a href="https://handsontable.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Handsontable — Reference Spreadsheet Component
            </a>
          </li>
          <li>
            <a href="https://github.com/davidfig/grid" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Building a Virtualized Grid — Implementation Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
