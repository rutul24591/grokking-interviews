"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-virtualized-grid-2d",
  title: "Design a Virtualized Grid (2D)",
  description:
    "LLD for a 2D virtualized grid: row and column virtualization, sticky headers and frozen panes, variable cell sizes, smooth bidirectional scroll, and accessibility.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "virtualized-grid-2d",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "virtualization",
    "grid",
    "2d",
    "sticky-headers",
    "frozen-panes",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "infinite-scroll-virtualized-list",
    "spreadsheet-like-grid",
  ],
};

export default function VirtualizedGrid2DArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Virtualized 2D Grid</h1><h2>Definition &amp; Context</h2><p>Design a Virtualized 2D Grid is an implementation-heavy low-level design problem covering row and column windowing, size measurement, frozen regions, scroll synchronization, overscan, cell recycling, focus, and restoration. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Keep logical cell identity separate from recycled DOM nodes. Derive visible row and column ranges from scroll offsets, measured sizes, and overscan budgets. The core structures are row sizes, column sizes, prefix offsets, visible row range, visible column range, overscan policy, frozen regions, cell cache, focus coordinate, and anchor.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/virtualized-grid-2d-runtime.svg" alt="Design a Virtualized 2D Grid runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing a 2D virtualized grid — a renderer
          that handles datasets with both many rows
          (thousands to millions) and many columns (hundreds
          to thousands), where DOM size must scale with the
          viewport rather than the dataset. The grid is the
          underlying primitive for spreadsheets, large
          tabular data viewers (financial trading panels,
          analytics consoles), heatmap viewers, and any UI
          that would be unusable without bidirectional
          virtualization. It must keep scroll smooth in
          both directions simultaneously, handle sticky
          headers and frozen columns, support variable cell
          sizes, and remain accessible to keyboard and
          screen reader users.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems compound when you add the
          second dimension. Sticky headers along both axes
          (top row sticky, left columns sticky) need careful
          composition so they don&rsquo;t fight each other.
          Frozen panes (multiple rows pinned at top, multiple
          columns pinned at left) layer on top of sticky.
          Bidirectional scroll math is twice as much
          arithmetic per frame; variable sizes turn each
          dimension into a measured-size problem. Cell
          rendering must be cheap because a viewport often
          contains hundreds of cells. Accessibility through
          the ARIA grid pattern requires single tabstop and
          arrow-key navigation across both dimensions, which
          must work despite cells unmounting and remounting
          as the user scrolls.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Users include data analysts working with large
          tabular datasets, traders watching grids of
          financial instruments, and operators viewing
          large configuration matrices. They expect the
          grid to feel instantaneous regardless of dataset
          size. Engineering teams consume the grid as a
          primitive: declare row and column counts (or row
          and column models for variable counts), provide
          a cell renderer, and let the grid handle the
          virtualization mechanics.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Datasets can be sparse (most cells empty) or
          dense. Cell content is typically simple (a value,
          a small badge, a number); complex cells are
          possible but rare. Row and column counts can each
          reach the tens of thousands; the product is
          potentially in the billions of cells, so we never
          materialize the full set, only the visible
          window. Modern browsers; we use CSS sticky for
          headers, IntersectionObserver for triggers when
          paging is involved, and ResizeObserver for
          measured cell sizes.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement spreadsheet semantics (formulas,
          references, copy-paste regions, undo) — those are
          the Spreadsheet Grid&rsquo;s job and build on top
          of this primitive. We do not implement table-style
          features (column reorder, multi-sort, filter
          editors per column header) — those are the Data
          Table&rsquo;s job. We do not implement row-only
          virtualization without columns; that&rsquo;s the
          Infinite Scroll Virtualized List.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Virtualize both rows and columns: render only the
          cells in the visible viewport plus a small
          overscan. Support fixed-size and variable-size
          cells in both dimensions. Sticky top header that
          scrolls horizontally with the body but stays
          vertically pinned. Sticky left column that scrolls
          vertically with the body but stays horizontally
          pinned. Frozen panes: multiple rows pinned top and
          multiple columns pinned left, configurable.
          Smooth bidirectional scroll at 60 fps. Keyboard
          navigation via the ARIA grid pattern: arrow keys
          move the focused cell, Home/End for row edges,
          Ctrl+Home/End for grid corners, Page Up/Down by
          viewport. Sufficient cell-level focus management
          so focused cells stay mounted as the user scrolls
          near them.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Header click for sort. Cell hover for inspection
          tooltip. Right-click context menus on cells. Cell
          selection (single, range, multi-range with
          Cmd-click). Smooth scroll to a specific cell via
          imperative API. Density modes (compact, normal,
          spacious). Synchronized scrolling between two
          grids (master-detail pattern).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Editing, formulas, drag-to-fill, copy-paste —
          Spreadsheet Grid territory. Sort/filter UI per
          column — Data Table. Inline expansion of rows
          (master-detail) — separate concern.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          60 fps bidirectional scroll on mid-tier devices.
          Initial render of viewport under 100 ms. Memory
          O(visible cells), typically a few hundred,
          regardless of grid dimensions.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Sticky headers and frozen panes don&rsquo;t glitch
          during scroll. Cell content updates apply only to
          mounted cells; off-viewport changes wait until
          mount.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Full ARIA grid pattern with single tabstop, arrow-
          key navigation, and proper announcements of cell
          position (&ldquo;row 247, column 12 of 50&rdquo;).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          The grid is a pure renderer; row/column models and
          cell renderers come from consumers. Adapter
          pattern for data sources lets consumers wire any
          backend.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The grid is built around a <strong>two-dimensional
          virtualizer</strong> that independently maintains
          visible-row and visible-column windows, plus a
          <strong> CSS Grid–based layout</strong> that places
          mounted cells at their correct row × column
          positions, plus a <strong>sticky/frozen layer
          system</strong> that handles pinned headers and
          panes via stacked
          <code> position: sticky</code> contexts.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>row virtualizer</strong> and
          <strong> column virtualizer</strong> operate
          independently. Each maintains a measured-size
          cache and a cumulative-size index for variable
          dimensions; for fixed dimensions, math is
          straightforward. On scroll, both visible windows
          update in <code>requestAnimationFrame</code>; the
          render tree intersects the two windows to mount
          only the cells in the visible rectangle.
          Independence is what makes the design scale
          cleanly: 1D virtualization techniques apply
          directly to each axis without coupling.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>layout</strong> uses CSS Grid with
          explicit row and column tracks for measured cells.
          Each mounted cell has a
          <code> grid-row</code> and
          <code> grid-column</code> matching its position in
          the dataset. The total grid size is set via
          spacer elements at the trailing edges so
          scrollbar position correctly represents the full
          dataset. As the visible window changes, cells
          unmount and remount; CSS Grid handles placement
          declaratively.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Sticky and frozen panes</strong> work via
          stacked <code>position: sticky</code> contexts.
          The top header row uses
          <code> top: 0</code>; the sticky-left column uses
          <code> left: 0</code>; the corner cell (top-left)
          uses both. For frozen panes (multiple rows or
          columns pinned), we render the frozen cells in a
          separate layer that doesn&rsquo;t scroll, and the
          body layer scrolls underneath. The trick is
          ensuring scrollbars on the body don&rsquo;t cause
          alignment issues with the frozen layer; we use a
          single scrollable container with the frozen
          layers absolutely positioned within it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard navigation</strong> follows the ARIA
          grid pattern. The grid maintains a single tabstop
          on the focused cell; other cells are
          <code> tabIndex=-1</code>. Arrow keys move focus,
          updating the focused cell id. When focus moves
          outside the visible window, we scroll to bring the
          new focus into view (smoothly, respecting
          <code> prefers-reduced-motion</code>). Focused
          cells don&rsquo;t unmount even if the virtualizer&rsquo;s
          standard window would exclude them; this prevents
          focus loss during keyboard navigation.
        </HighlightBlock>
        <p>
          For very large columns (hundreds), header sticky
          state needs special attention because the
          horizontal scrollable range is large. We render
          headers as part of the same CSS Grid as body
          cells, with the header row using
          <code> position: sticky; top: 0</code>; this
          means horizontal scroll moves the headers in
          lockstep with the body, while vertical scroll
          keeps them pinned. The same pattern applies to
          the sticky-left column.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">StickyHeader and StickyColumn render the sticky axes. CornerCell handles the</HighlightBlock>
<HighlightBlock as="p" tier="important">top-left intersection of sticky axes. CellRenderer is consumer-supplied and called for</HighlightBlock>
<HighlightBlock as="p" tier="important">each visible cell. FocusTracker owns the focused cell and ensures it stays mounted.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">
          The key invariant is update cadence separation: scroll/viewport state updates every frame,
          but cell data and focus state must not churn at that rate.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Visible-window stores update per scroll frame; the cell-data cache updates on fetch/mutation, not on scroll.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Focus state is rare-update. This separation is what keeps re-renders bounded even for 10k×10k grids.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          The contract must allow pure rendering: <code>renderCell</code> should be a pure function of (row, column)
          + stable data, so virtualization can freely mount/unmount without side effects.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Inputs include <code>rowCount</code>, <code>columnCount</code>, sizing (<code>rowSize</code> / <code>columnSize</code>, fixed or function-based),
          sticky row/column counts, and overscan.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Expose imperative APIs for scroll-to-cell and measurement only at the shell; keep the core renderer deterministic so caching/memoization works.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">The visible cell set is the intersection of the
          visible row window and visible column window —
          typically a few hundred cells. Each cell is
          memoized; unchanged cells skip render.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Scroll
          updates run in
          <code> requestAnimationFrame</code> so they align
          with browser repaint. For very large grids, we
          throttle scroll handling to one update per
          frame; intermediate scroll events coalesce.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UI/UX</h3>
        <HighlightBlock as="p" tier="crucial">Density modes adjust cell padding and font size.
          Hover affordances are subtle (a faint background
          tint) so they don&rsquo;t obscure data.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Right-click context menus open at the cursor
          with cell-aware actions. Smooth scroll-to-cell
          via imperative API uses
          </Highlight><code> scrollIntoView</code> with smooth behavior.</HighlightBlock>
      </section>

	      <section>
	        <h3>♿ Accessibility</h3>
	        <HighlightBlock as="p" tier="important">
	          <Highlight tier="important">The grid uses</Highlight>{" "}
	          <code>role=&quot;grid&quot;</code>; headers use{" "}
	          <code>role=&quot;columnheader&quot;</code> / <code>&quot;rowheader&quot;</code>; cells use{" "}
	          <code>role=&quot;gridcell&quot;</code>.
	        </HighlightBlock>
<HighlightBlock as="p" tier="crucial">Single
          tabstop; arrow keys navigate; Home/End move to
          row edges; Ctrl+Home/End to corners. Position
          announcements via live region on cell focus
          changes. Sticky headers must remain announceable
          to screen readers when the user navigates from
          a body cell.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Default to safe rendering: cell content renders as text; HTML is opt-in per renderer with sanitization.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Never evaluate strings as code (no <code>eval</code> or dynamic function constructors) in renderers, even for formulas; formulas use a sandboxed DSL.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Clipboard import/export is an attack surface: treat pasted HTML/RTF as untrusted, strip scripts/styles, and enforce size limits to prevent DoS.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests cover the 1D virtualizers (well-tested
          building block). Integration tests exercise
          bidirectional scroll, sticky headers, frozen
          panes, keyboard navigation across the visible
          window boundary.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Visual regression tests catch
          sticky-pane glitches. Performance tests assert 60
          fps scroll on a 10000×100 grid.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important">User scrolls diagonally fast: both virtualizers update in the same frame, the visible window</HighlightBlock>
<HighlightBlock as="p" tier="important">recomputes, cells mount in the new rectangle. A frozen pane wider than the viewport: we constrain the pane to a</HighlightBlock>
<HighlightBlock as="p" tier="important">maximum proportion of the viewport (e.g. 50%) so the user isn&rsquo;t locked out of the rest of the grid.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Variable-size cells whose
          measured size differs from the estimate: the
          ResizeObserver updates the cumulative-size index
          and the layout adjusts; we apply scroll
          compensation if the changed cells were above the
          viewport. Browser zoom: the grid&rsquo;s units
          (rem-based) scale with browser zoom correctly;
          fixed-pixel sizes don&rsquo;t.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">The grid is generic: cell renderer is fully
          consumer-controlled, row/column counts are
          numbers or functions, sticky configuration is
          declarative.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The Spreadsheet Grid builds on top
          of this primitive by adding interaction layers
          (selection, edit, formulas).</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important"><Highlight tier="crucial">
          Direction-aware via CSS logical properties; RTL
          flips horizontal axis. Number formatting in cells
          uses </Highlight></Highlight><code>Intl.NumberFormat</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>CSS Grid vs absolute positioning</h3>
        <HighlightBlock as="p" tier="important">
          CSS Grid is declarative, browser-optimized, and
          handles sticky correctly. Absolute positioning
          gives finer control but requires manual layout
          math and breaks sticky. CSS Grid wins for typical
          cases; absolute positioning is reserved for
          custom non-rectangular layouts.
        </HighlightBlock>

        <h3>Single scrollable container vs separate scrollers</h3>
        <HighlightBlock as="p" tier="important">
          A single scroll container with sticky headers is
          simpler and avoids synchronization bugs. Separate
          scroll containers (one for header, one for body)
          require manual scroll synchronization that&rsquo;s
          easy to get wrong. We use a single container.
        </HighlightBlock>

        <h3>Independent vs coupled virtualizers</h3>
        <HighlightBlock as="p" tier="crucial">
          Independent row and column virtualizers compose
          cleanly and reuse 1D virtualization knowledge.
          Coupled virtualization (one combined window)
          doesn&rsquo;t generalize as well. Independence is
          the right factoring.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Web Worker-based render orchestration for very
          large grids. WebGPU-accelerated</HighlightBlock>
<HighlightBlock as="p" tier="important">rendering for
          extremely dense grids (millions of visible cells
          via</HighlightBlock>
<HighlightBlock as="p" tier="important">custom rendering). Predictive prefetching of
          cell data based on scroll velocity.</HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Keep logical cell identity separate from recycled DOM nodes. Derive visible row and column ranges from scroll offsets, measured sizes, and overscan budgets. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/virtualized-grid-2d-recovery.svg" alt="Design a Virtualized 2D Grid recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Rendering all cells is simplest; 2D virtualization is justified when both dimensions exceed DOM and layout budgets.</p><p>Grid data remains keyed by logical coordinates. DOM cells are disposable projections; restored scroll and focus must resolve against current measurements. Scale pressure comes from millions of cells, variable sizes, fast diagonal scroll, frozen panes, resize churn, focus movement, and memory pressure. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, batch measurement, cap overscan, recycle cells safely, preserve logical focus, synchronize frozen panes, and fall back to estimates until dimensions settle. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep logical cell identity separate from recycled DOM nodes. Derive visible row and column ranges from scroll offsets, measured sizes, and overscan budgets.</p><h3>What breaks at scale?</h3><p>millions of cells, variable sizes, fast diagonal scroll, frozen panes, resize churn, focus movement, and memory pressure. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Grid data remains keyed by logical coordinates. DOM cells are disposable projections; restored scroll and focus must resolve against current measurements.</p><h3>How do you recover?</h3><p>I would batch measurement, cap overscan, recycle cells safely, preserve logical focus, synchronize frozen panes, and fall back to estimates until dimensions settle.</p><h3>Why this architecture?</h3><p>Rendering all cells is simplest; 2D virtualization is justified when both dimensions exceed DOM and layout budgets.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
