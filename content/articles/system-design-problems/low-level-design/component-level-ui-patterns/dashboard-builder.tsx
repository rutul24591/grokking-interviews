"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-dashboard-builder",
  title: "Design a Dashboard Builder",
  description:
    "Dashboard builder with widget registry, grid placement algorithm, resize constraints, responsive breakpoints, lazy widget loading, and persistence.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "dashboard-builder",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "dashboard", "grid-layout", "drag-drop", "widget-registry", "persistence", "responsive"],
  relatedTopics: ["kanban-board", "resizable-split-pane", "data-table"],
};

export default function DashboardBuilderArticle() { return <ArticleLayout metadata={metadata}>
<section><h1>Design a Dashboard Builder</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Dashboard Builder around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design a Dashboard Builder is an implementation-heavy low-level design problem covering widget registry, drag-resize projection, grid packing, layout persistence, responsive breakpoints, lazy widgets, and rollback. A principal-level answer must define state ownership, local structures, lifecycle cleanup, browser semantics, server reconciliation, observability, privacy, and rollback.</p><p>Keep the committed dashboard layout separate from the transient drag-resize projection. Widget rendering uses registered capabilities and versioned configuration rather than arbitrary component injection. The important structures are widget registry, layout by breakpoint, projected rectangles, collision index, drag session, resize session, schema version, dirty journal, and widget error boundary.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/dashboard-builder-runtime.svg" alt="Design a Dashboard Builder runtime" caption="Runtime flow from intent through guarded state, semantic projection, and recovery." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Dashboard Builder, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the component-specific mechanics that an implementation discussion must defend.</p><p>
        Dashboard builders are a canonical "hard" LLD problem in staff-level interviews
        because they combine a complex geometric grid placement engine, a drag-and-drop
        system with collision detection, a widget registry pattern, lazy loading of
        arbitrary widget content, responsive breakpoint logic, and persistence — all
        in a cohesive system where each layer affects the others. Products like Grafana,
        Datadog, Retool, and Tableau all implement variations of this system. A strong
        answer requires depth on the grid algorithm, not just a high-level mention of
        "drag and drop."
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/dashboard-builder-architecture.svg"
        alt="Dashboard builder architecture diagram"
        caption="Dashboard builder architecture: widget registry, grid placement, resize constraints, data fetching and persistence"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The scope of a dashboard builder varies from a simple fixed grid with
        rearrangeable cards to a fully freeform layout with pixel-precise positioning.
        For most enterprise products, a column-based grid (the react-grid-layout model)
        is the right tradeoff: structured enough to produce clean layouts, flexible
        enough for diverse widget sizes.
      </p>
      <p>
        <strong>How many columns?</strong> A 12-column grid is the standard — it divides
        evenly into 1, 2, 3, 4, and 6 column spans, covering most widget widths.
        Fewer columns (4 or 6) produce coarser layouts; more columns (24) allow finer
        control at the cost of complexity.
      </p>
      <p>
        <strong>Fixed or dynamic row height?</strong> Fixed row height (e.g., 100px per
        row) simplifies the grid algorithm. Variable row height (each row sized to its
        tallest widget) creates a more flexible but significantly more complex layout
        algorithm. Most analytics dashboards use fixed row height.
      </p>
      <p>
        <strong>Can widgets overlap?</strong> In a freeform layout (Figma, Google Slides),
        widgets can overlap. In a dashboard context, overlap is almost never desired —
        the grid should prevent it. The placement algorithm must find valid non-overlapping
        positions.
      </p>
      <p>
        <strong>How are widget definitions provided?</strong> A static widget catalog
        (all widgets are known at build time) is simpler. A dynamic plugin system
        (third parties can register new widget types) requires a registry pattern with
        code splitting.
      </p>

      <h3>The Widget Registry</h3>
      <p>
        The widget registry is a mapping from a widget type identifier (a string, e.g.,
        "line-chart", "data-table", "kpi-card") to its definition: the component to
        render, the default size (columns × rows), the minimum size, the maximum size,
        and the configuration schema (used to render the widget's settings panel).
      </p>
      <p>
        Each widget definition includes the React component lazily — imported with
        dynamic import so the widget's code is only downloaded when the widget is first
        placed on a dashboard. This keeps the initial bundle small regardless of how
        many widget types exist in the registry.
      </p>
      <p>
        The registry is a singleton initialized at app startup. Third-party widgets
        can register by calling registerWidget(type, definition). The registry validates
        the definition (required fields, valid size constraints) and stores it. At
        render time, the dashboard layout component reads the registry to resolve each
        layout item's type to its component.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Widget components should be isolated from the dashboard infrastructure. A widget
        receives only: its configured data (props), a resize observer hook to know its
        current pixel dimensions (so charts can re-render at the correct size), and a
        loading/error state. Widgets should not be aware that they are in a dashboard
        grid. This isolation makes widgets testable independently and reusable outside
        the dashboard context.
      </HighlightBlock>

      <h3>The Grid Layout Model</h3>
      <p>
        Each placed widget in the dashboard has a layout item: type (widget type string),
        id (unique placement ID), x (column start, 0-indexed), y (row start, 0-indexed),
        w (column span), and h (row span). The dashboard layout is an array of these
        items. This is the format used by react-grid-layout and is the de facto standard
        for JSON-serializable dashboard layouts.
      </p>
      <p>
        The grid is rendered by mapping each layout item to a widget component, positioned
        using CSS Grid or absolute positioning. CSS Grid: the container has
        grid-template-columns: repeat(12, 1fr) and grid-auto-rows: 100px (or the
        configured row height). Each item is assigned grid-column: x+1 / x+w+1 and
        grid-row: y+1 / y+h+1. This is simple and accurate for a fixed-height grid.
      </p>
      <p>
        Absolute positioning (the react-grid-layout approach): each item is positioned
        with left = x * (columnWidth + gap), top = y * (rowHeight + gap), width =
        w * columnWidth + (w-1) * gap, height = h * rowHeight + (h-1) * gap. This
        gives pixel-precise control and makes it easier to implement animations (using
        CSS transitions on left/top/width/height) during drag and resize operations.
      </p>

      <h3>The Placement Algorithm</h3>
      <p>
        When a new widget is dropped onto the dashboard or an existing widget is moved,
        the placement algorithm must find a valid non-overlapping position. The algorithm
        used by react-grid-layout and Grafana is a compact downward flow: place the
        widget at the requested position; if it overlaps any existing widget, shift the
        overlapping widgets downward until no overlap exists. This produces a "gravity"
        effect where gaps above widgets collapse automatically.
      </p>
      <p>
        The compact algorithm in detail: after placing a widget, sort all layout items
        by y then x. For each item (in order), move it as far up as possible without
        overlapping any previously processed item. This greedy upward compaction ensures
        no empty rows exist between widgets when widgets are removed or resized.
      </p>
      <p>
        Collision detection between two layout items A and B: they overlap if
        A.x is less than B.x+B.w AND A.x+A.w is greater than B.x AND A.y is less than
        B.y+B.h AND A.y+A.h is greater than B.y. This is the standard 2D AABB
        (axis-aligned bounding box) intersection test.
      </p>
      <p>
        For drag-and-drop repositioning: as the user drags a widget, compute the
        target grid position (convert pixel coordinates to grid coordinates by dividing
        by column width and row height). Run the placement algorithm with the dragged
        widget at the target position to produce the preview layout — the layout that
        would result if the user dropped here. Animate other widgets to their preview
        positions using CSS transitions. On drop, commit the preview layout as the
        canonical layout.
      </p>

      <h3>Drag and Drop Implementation</h3>
      <p>
        Dashboard drag-and-drop requires: dragging a widget header to reposition the
        entire widget, and dragging a resize handle (typically in the bottom-right corner)
        to resize the widget. Both use the Pointer Events API with setPointerCapture
        for reliable capture even when the pointer leaves the element.
      </p>
      <p>
        On drag start: record the pointer's initial position and the widget's initial
        grid position (x, y). On pointermove: compute the pixel delta from the initial
        position, divide by the cell size to get the grid delta, add to the initial
        grid position to get the target (x, y). Clamp to grid bounds (0 to totalCols-w,
        0 to infinity). Run the placement algorithm to generate the preview layout.
        Render the dragged widget with a ghost effect (reduced opacity) at its original
        position, and show a blue placeholder at the target position. Animate other
        widgets using CSS transform transitions to their preview positions.
      </p>
      <p>
        On drag end: if the target position changed, commit the preview layout to state
        and persist it. If unchanged (the user dropped without moving), no-op.
      </p>
      <p>
        Resize: on pointer down on the resize handle, record initial widget dimensions
        and pointer position. On pointermove, compute the new width and height in grid
        units. Clamp to the widget's min/max size constraints (from the registry). Run
        the placement algorithm to check collisions at the new size. Show the resize
        preview. On pointer up, commit.
      </p>

      <h3>Responsive Breakpoints</h3>
      <p>
        A dashboard that looks good on a wide monitor becomes unusable on a laptop at
        1200px wide or a tablet at 768px. React-grid-layout solves this with breakpoint
        layouts: the dashboard stores separate layout arrays for each breakpoint (lg,
        md, sm, xs). Each breakpoint has its own column count and row height.
      </p>
      <p>
        The breakpoint is determined by the container's width (using a ResizeObserver
        on the dashboard container), not the viewport width. This is the container
        query model — the dashboard behaves correctly when embedded in a sidebar or
        panel that is narrower than the viewport.
      </p>
      <p>
        Automatic layout generation for smaller breakpoints: when a new widget is added
        and there is no saved layout for a breakpoint, auto-generate it. The lg layout
        (12 columns) is the canonical source; for md (10 columns), scale each widget's
        x and w proportionally. For sm (6 columns) and xs (2 columns), stack all
        widgets vertically (x=0, w=maxCols for each widget) in the order they appear
        in the lg layout. This produces a reasonable mobile layout automatically.
      </p>

      <h3>Widget Data Fetching</h3>
      <p>
        Each widget on the dashboard typically fetches its own data from an API
        (a line chart widget fetches time-series data; a KPI card fetches a summary
        metric). The data fetching is encapsulated within the widget component itself —
        the dashboard infrastructure does not coordinate widget data fetching.
      </p>
      <p>
        The widget component uses a data fetching hook (React Query, SWR, or a custom
        hook) with the widget's configuration as the query key. This gives automatic
        deduplication (two identical widgets share a cached response), background
        refetching, and stale-while-revalidate behavior.
      </p>
      <p>
        Global refresh: a "Refresh all" button in the dashboard header triggers a
        refetch of all widget data. Implement this by publishing a refresh event
        (via a React context or a global event emitter) that each widget's data hook
        subscribes to. On refresh event, invalidate the cache and trigger a new fetch.
        React Query's queryClient.invalidateQueries() with a shared tag covers all
        dashboard widgets in one call.
      </p>
      <HighlightBlock as="p" tier="important">
        Widgets should show meaningful loading and error states. The loading state uses
        a skeleton placeholder sized to the widget's current dimensions (not the widget's
        content). The error state shows a retry button and a descriptive error message.
        Do not let a single failing widget break the entire dashboard — each widget is
        independently error-bounded.
      </HighlightBlock>

      <h3>Persistence</h3>
      <p>
        The dashboard layout (the array of layout items with their positions and
        configurations) is persisted to the server in the user's profile. On mount,
        fetch the user's saved layout from the API. On any layout change (drag, resize,
        add, remove, widget config update), auto-save with a debounced PUT request
        (300–500ms debounce). Show a "Saved" indicator when the save succeeds.
      </p>
      <p>
        Versioning the layout schema: as the product adds new widget types or changes
        the layout format, old saved layouts must still load correctly. Version-stamp
        the layout JSON and apply migrations on load (the same schema migration pattern
        as the email builder). A migration function for each version bump upgrades
        old layouts to the current schema.
      </p>
      <p>
        Sharing dashboards: a dashboard can be shared with other users via a share
        link. The link encodes the dashboard's ID; recipients see a read-only view of
        the owner's layout (no edit controls). The permission model: owner can edit,
        shared users can view. Some products allow "copy to my dashboard" for shared
        dashboards.
      </p>

      <h3>Accessibility</h3>
      <p>
        Dashboard builders are keyboard and screen reader accessibility nightmares when
        built naively. The minimum viable accessible dashboard: each widget has an
        accessible name (widget title rendered as an h2 or h3 visible to screen readers),
        a drag handle button with aria-label "Drag to reorder [widget name]", and a
        resize button with aria-label "Resize [widget name]."
      </p>
      <p>
        Keyboard reordering: the drag handle button, when focused, activates a keyboard
        mode on Space or Enter. In this mode, arrow keys move the widget in the grid
        (one column or row per keystroke). The grid runs the placement algorithm for
        each key press and moves the widget accordingly. Pressing Space or Enter again
        commits the new position. Pressing Escape cancels and returns the widget to its
        original position.
      </p>
      <p>
        Focus management: after a widget is added or removed, focus should move to a
        logical element (the added widget's title, or the "Add widget" button after
        deletion). After drag-and-drop completes (including keyboard-driven drag), focus
        returns to the drag handle.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Use five boundaries: an input adapter, a typed state controller, a projection layer, an integration adapter, and an observability adapter. Normalize events before they enter state. Keep previews separate from commits. Release timers, observers, listeners, abort controllers, workers, and pointer capture idempotently on cancel and unmount.</p><p>Keep the committed dashboard layout separate from the transient drag-resize projection. Widget rendering uses registered capabilities and versioned configuration rather than arbitrary component injection. For durable changes, validate the latest intent and record enough evidence to rollback deterministically.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/dashboard-builder-scale-recovery.svg" alt="Design a Dashboard Builder scale and recovery" caption="Scale defense: bound pressure, validate policy, reconcile failures, and emit reasoned evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>A fixed dashboard is cheaper and more predictable; a builder is justified when user-specific composition materially improves repeated operational workflows.</p><p>Layout previews are local. Persist versioned layouts optimistically and reconcile conflicts explicitly; widget data may refresh independently under bounded cache policy. The dominant scale risks are many widgets, expensive queries, breakpoint migration, collision cascades, third-party widget failures, and concurrent dashboard edits. Control them with bounded work, stable ids, cancellation, generation guards, measured caching, and explicit degraded behavior.</p><p>Optimistic UI is appropriate only when rollback is deterministic and understandable. Authorization, destructive effects, and conflict-sensitive truth stay server-authoritative.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use typed state unions, stable identities, idempotency keys, versioned writes, SSR-safe browser feature detection, abortable async work, bounded caches, and semantic HTML. Test keyboard-only use, screen-reader output, slow networks, stale completion, retries, unmount during work, and large datasets.</p><p>Measure blocked transitions, stale drops, rollback rates, latency percentiles, cache pressure, retry exhaustion, and accessibility regressions. Keep telemetry small and free of sensitive content.</p></section>
<h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include mixing preview and committed state, trusting arrival order, leaking resources after unmount, accepting stale completion, assuming visible data is the complete dataset, and implementing custom controls without accessible semantics.</p><p>For this topic, cancel invalid drops, isolate widget errors, cap grid reflow, migrate stored schemas, retain the last committed layout, and retry idempotent saves. Security and privacy require the design to authorize widget types and data sources, validate configuration schemas, sandbox third-party content, avoid leaking query results, and audit layout changes.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This design appears in production surfaces where repeated interaction, large datasets, asynchronous completion, and partial failure are normal. Reuse the runtime shell, but inject product policy explicitly: authorization, latency budget, persistence boundary, fallback, and telemetry.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>How do you model state?</h3><p>Keep the committed dashboard layout separate from the transient drag-resize projection. Widget rendering uses registered capabilities and versioned configuration rather than arbitrary component injection. I would name preview, commit, derived projection, async generation, and rollback evidence separately.</p><h3>What breaks at scale?</h3><p>many widgets, expensive queries, breakpoint migration, collision cascades, third-party widget failures, and concurrent dashboard edits. I would bound each expensive operation and cancel work that no longer affects the visible committed result.</p><h3>What consistency model applies?</h3><p>Layout previews are local. Persist versioned layouts optimistically and reconcile conflicts explicitly; widget data may refresh independently under bounded cache policy.</p><h3>How do you recover from failure?</h3><p>I would cancel invalid drops, isolate widget errors, cap grid reflow, migrate stored schemas, retain the last committed layout, and retry idempotent saves.</p><h3>How do you defend the architecture?</h3><p>A fixed dashboard is cheaper and more predictable; a builder is justified when user-specific composition materially improves repeated operational workflows. The added complexity is acceptable only when the required behavior and operational evidence justify it.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank" rel="noreferrer">MDN Intersection Observer API</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>; }
