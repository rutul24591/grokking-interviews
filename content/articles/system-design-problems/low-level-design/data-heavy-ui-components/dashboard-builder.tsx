"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-dashboard-builder",
  title: "Design a Dashboard Builder",
  description:
    "LLD for a dashboard builder: drag-and-drop widget grid layout, resize handles, persistence, lazy widget loading, theming, and keyboard accessibility.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "dashboard-builder",
  wordCount: 7000,
  readingTime: 37,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "dashboard",
    "grid-layout",
    "drag-and-drop",
    "widgets",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "real-time-data-dashboard",
    "saved-views-filters-system",
  ],
};

export default function DashboardBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a Dashboard Builder — a UI where
          users compose dashboards by adding, removing,
          arranging, and resizing widgets in a grid. Each
          widget is a self-contained component (a chart, a
          metric tile, a recent-activity list) that fetches
          its own data. The builder lets users
          drag-and-drop widgets into a grid layout, resize
          them via handles, save the layout per-user, and
          load it on return. The component is the backbone
          of analytics products, ops consoles, customer
          dashboards, and any UI where users need to
          compose their own view.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: a grid layout system that
          handles widget positions and sizes (in row/column
          units, not pixels), drag-and-drop with collision
          detection (widgets can&rsquo;t overlap), resize
          with constraints (minimum/maximum sizes per
          widget type), persistence per user, lazy widget
          loading so the dashboard mounts fast even with
          dozens of widgets, and keyboard accessibility for
          users who can&rsquo;t drag.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Users include analysts composing custom views,
          customers building monitoring dashboards, and
          ops teams tracking KPIs. They expect the builder
          to feel like Notion or Datadog — drag a widget
          from a palette, drop it into the grid, resize
          freely, and have the layout persist. Engineering
          teams consume the builder by registering widget
          types and rendering the builder; the runtime
          handles layout mechanics.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Layouts have a fixed column count (typically 12
          for desktop, 4 for mobile). Widget sizes are
          row × column units in this grid. Layouts persist
          per user via a server endpoint. Widgets fetch
          their own data; the builder doesn&rsquo;t
          orchestrate widget data fetching beyond
          providing widget context (date range, filters).
          Modern browsers; we use the HTML5 drag-and-drop
          API (with custom layer for accessibility) and
          ResizeObserver for measuring containers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement individual widget logic
          (chart rendering, data fetching) — those are
          consumer responsibility. We do not implement
          dashboard sharing or cross-user collaboration.
          We do not implement automatic layout (the user
          arranges; we don&rsquo;t suggest).
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          A grid layout where widgets occupy
          contiguous cells. Add widget from a palette via
          drag or click. Move widgets via drag with
          collision-avoiding rearrangement. Resize via
          corner/edge handles with snap-to-grid.
          Per-widget min and max sizes. Remove widget via
          a delete affordance. Persist layout per user.
          Lazy-load widget components via
          <code> React.lazy</code>. Responsive breakpoints:
          a desktop layout adapts (or maps) to a mobile
          layout. Edit mode toggle: read-only by default,
          editing affordances appear in edit mode.
          Keyboard alternatives for drag and resize via
          arrow keys with grid coordinates.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Multiple saved layouts per user (named presets).
          Sharing layouts as URLs. Widget settings panel
          (per-widget config). Undo/redo of layout
          changes. Templates: pre-built starter
          dashboards. Export layout as JSON. Live
          preview while resizing.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Widget data fetching, chart rendering, real-time
          collaborative editing (one user&rsquo;s layout at
          a time per session).
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Drag at 60 fps. Initial dashboard mount under
          200 ms before lazy-loaded widgets begin
          fetching. Resize feels live (handles update at
          frame rate). Layout save under 200 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Layouts saved atomically — partial save failures
          revert local changes with a retry banner. Widgets
          that fail to load show an error placeholder
          rather than crashing the dashboard. Concurrent
          edits across tabs converge via broadcast.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Widget definitions are registered in code; we
          don&rsquo;t accept arbitrary widget types from
          configuration. Per-user layouts are scoped by
          user id; the server enforces ownership.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Drag is mouse-bound for most users; keyboard
          users get an alternative — focus a widget,
          enter Move mode (Space), arrow keys move,
          Enter commits. Resize similarly. Edit mode
          state announces. Widget palette is keyboard-
          navigable. ARIA roles for the grid and
          widgets.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Widget types in a registry. Layout
          persistence via an adapter (server-side, local-
          only for tests). Theming via design tokens.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/dashboard-builder-architecture.svg"
        alt="Dashboard Builder Architecture"
        caption="Widget Registry + Layout Engine (collision detection, snap-to-grid) + Persistence Adapter + Lazy Widget Loader → Grid renderer with drag/resize handles. Keyboard alternative: focus widget → Space to enter Move mode → arrow keys → Enter to commit."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The builder is structured as a <strong>layout
          engine</strong> (positions, sizes, collision
          detection) sitting on a <strong>grid system</strong>{" "}
          (CSS Grid with row × column tracks), with
          <strong> drag/resize plugins</strong> that mutate
          the layout and a <strong>persistence layer</strong>{" "}
          that saves layouts per user. <strong>Widget
          components</strong> are lazy-loaded;
          <strong> the registry</strong> maps widget types to
          their components.
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>layout engine</strong> represents the
          dashboard as an array of widgets, each with
          <code> { `{ id, type, x, y, w, h }` }</code> in
          grid units (column index, row index, width in
          columns, height in rows). On drag or resize, the
          engine computes the new position and runs
          collision detection against existing widgets;
          conflicts trigger rearrangement (push-down
          algorithm: widgets in the dragged widget&rsquo;s
          new path move down to make room). The result is
          a new layout array; we set it via a
          single state update so the grid re-renders
          atomically.
        </HighlightBlock>
        <p>
          The <strong>grid system</strong> uses CSS Grid with
          <code> grid-template-columns:
          repeat(12, 1fr)</code> and a configurable row
          height. Each widget is a grid item with
          <code> grid-column: span N</code> and
          <code> grid-row: span M</code>. Positioning uses
          <code> grid-column-start</code> and
          <code> grid-row-start</code>. CSS Grid handles
          the actual placement; we just compute the
          numbers.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Drag</strong>: when the user starts
          dragging a widget, we enter drag mode. The
          dragged widget gets a translucent preview that
          follows the cursor; the actual widget stays in
          place until drop. As the user drags over grid
          cells, we compute the new position and show a
          drop indicator (a highlighted region matching the
          widget&rsquo;s footprint). Collision detection
          and rearrangement preview run live, so users
          see the resulting layout as they drag. On drop,
          the layout commits.
        </HighlightBlock>
        <p>
          <strong>Resize</strong>: handles on the corners
          and edges of widgets in edit mode. Pointer drag
          on a handle updates the widget&rsquo;s width or
          height in grid units (snapping to integer grid
          steps). Live preview shows the resize. Min/max
          constraints prevent invalid sizes. On release,
          the layout commits.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Lazy widget loading</strong>: the registry
          maps widget types to async loader functions
          (<code>React.lazy</code> wrappers). When a
          widget mounts, its loader runs; until it
          resolves, a skeleton placeholder occupies the
          widget&rsquo;s grid cell so layout doesn&rsquo;t
          shift. This keeps the initial dashboard mount
          fast even with many widget types — only the
          widget types actually present in the layout
          load.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Persistence</strong>: the layout is saved
          to a server endpoint per user, debounced after
          edits. Saves are idempotent (the full layout
          replaces the prior version, keyed by user id and
          dashboard id). On load, the saved layout is
          fetched before the dashboard renders so users
          see their layout on first paint, not after a
          flash of default state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard accessibility</strong>: focus a
          widget via Tab, press Space to enter Move mode,
          arrow keys move the widget by one grid cell,
          Enter commits, Escape cancels. Resize works the
          same way: focus a resize handle, Space enters
          Resize mode, arrow keys resize, Enter commits.
          Mode changes announce via live region. This
          gives keyboard users full parity with mouse
          interactions.
        </HighlightBlock>
        <p>
          <strong>Edit mode</strong> is a separate state
          from view mode. In view mode, widgets render
          their content with no editing affordances
          visible. In edit mode, drag handles, resize
          handles, and delete buttons appear; widget
          interactions (clicks within the widget content)
          are suppressed so users can move widgets without
          accidentally activating their content. The
          mode toggle is at the top of the dashboard.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial">Widget wraps each widget with drag/resize handles in edit mode.</HighlightBlock>
<HighlightBlock as="p" tier="important">WidgetPalette renders available widget types for adding. PersistenceAdapter</HighlightBlock>
<HighlightBlock as="p" tier="important">handles server save/load. KeyboardController manages keyboard move/resize modes.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">The layout (array of widgets with positions) is
          the central state, managed by an external</HighlightBlock>
<HighlightBlock as="p" tier="important">store.
          Edit mode, drag state, resize state, and
          keyboard mode are separate slices.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The widget registry is a stable singleton. The persistence
          adapter manages save status (idle, saving, saved, error) as its own slice.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="crucial">
          The contract centers on a stable, versioned <code>layout</code>: an array of widgets
          with identity, type, position/size, and optional settings.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Inputs also include a widget <code>registry</code> (type to component map) plus grid
          parameters (column count, row height) so rendering is deterministic across devices.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Persistence is abstracted via a <code>persistenceAdapter</code> (save/load + status),
          and state changes flow out through a single <code>onChange</code> callback for autosave
          and collaboration hooks.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <HighlightBlock as="p" tier="important">CSS Grid handles layout natively; we don&rsquo;t
          do per-frame layout math. Widgets are</HighlightBlock>
<HighlightBlock as="p" tier="important">memoized
          by (id, position, settings); unchanged widgets
          skip render during drag.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Drag preview is a
          single transformed element following the cursor,
          not a re-rendered widget. Resize preview is the
          same: visual state via transforms, commit on
          release. Lazy widget loading via React.lazy
          keeps initial bundle small.</HighlightBlock>
      </section>

      <section>
        <h2>🎨 UI/UX</h2>
        <HighlightBlock as="p" tier="crucial">Edit mode toggle at the top of the dashboard.
          Widget palette as a sidebar or modal accessible
          in edit mode. Drag preview is translucent;
          drop indicator is a clear highlighted region.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Resize handles appear on hover in edit mode.
          Save status indicator (saved, saving, error)
          near the edit mode toggle. Empty dashboard state
          shows &ldquo;Add a widget&rdquo; with a clear
          path to the palette.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Grid uses
          <code> role=&quot;application&quot;</code> in edit
          mode (because keyboard interactions override
          standard tab navigation). Widgets have
          accessible names. Move/Resize modes announce via
          live region.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Mode entry/exit is announced.
          Position changes during keyboard move/resize
          announce (&ldquo;Moved to row 3, column
          5&rdquo;). Drag-mode users can also use keyboard
          shortcuts for the same operations.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="crucial">Widget types are registered in code, never
          loaded from runtime data. Layouts scope by user
          id; server enforces ownership on save and
          load.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Widget settings are sanitized at the
          widget&rsquo;s render boundary; the builder
          doesn&rsquo;t inspect or interpret them.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Unit tests for the layout engine: collision
          detection, rearrangement, resize constraints.
          Integration tests: drag a widget, verify
          rearrangement; resize with min/max constraints;
          keyboard move and resize.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Persistence tests
          with mock adapter. Accessibility tests for
          keyboard mode parity. Performance tests for
          drag fps with many widgets.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="important">Widget dragged to a position with insufficient space: rearrangement pushes other widgets</HighlightBlock>
<HighlightBlock as="p" tier="important">down; if no fit is possible, the drag is rejected with a hint. Resize that would shrink</HighlightBlock>
<HighlightBlock as="p" tier="important">a widget below its minimum: stops at min. Resize that would extend off the grid: clamped.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Server save fails: optimistic UI
          shows the change locally, banner offers retry.
          Mobile breakpoint: layout adapts to a single
          column; widgets stack vertically in their
          original order. Add widget when no space
          available: append at the bottom of the
          dashboard. Concurrent edits across tabs:
          broadcast warns the user that the layout has
          changed.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="crucial">The layout engine is generic over widget type;
          consumers register their own. The</HighlightBlock>
<HighlightBlock as="p" tier="important">persistence
          adapter is swappable (server-side, local-only,
          memory for</HighlightBlock>
<HighlightBlock as="p" tier="important">tests). The grid system parameters
          (column count, row height) are configurable.</HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="crucial">
          All builder chrome (Edit mode labels, palette strings, banners, errors) comes from i18n.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          RTL flips column direction and drag affordances; use CSS logical properties and
          ensure keyboard move/resize semantics remain correct in RTL layouts.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Widget content i18n is the widget&rsquo;s concern, but the builder should provide
          locale/timezone context so widgets format consistently.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Grid units vs free-form pixel positioning</h3>
        <HighlightBlock as="p" tier="important">
          Grid units (12-column system) give predictable,
          aligned layouts and work well across viewport
          sizes. Free-form pixel positioning is more
          flexible but harder to make responsive and
          easier to produce ugly layouts. Most dashboard
          tools use grid units; we follow.
        </HighlightBlock>

        <h3>HTML5 drag-and-drop vs custom pointer drag</h3>
        <HighlightBlock as="p" tier="crucial">
          HTML5 drag-and-drop has native browser support
          but is awkward (separate events, image-based
          drag preview). Custom pointer drag with
          PointerEvents gives full control and better UX.
          We use custom pointer drag, with a dedicated
          keyboard fallback for accessibility.
        </HighlightBlock>

        <h3>Lazy widget loading vs eager</h3>
        <HighlightBlock as="p" tier="important">
          Eager loading is simple but bloats initial
          bundle when many widget types exist. Lazy
          loading keeps initial bundle small at the cost
          of a Suspense boundary per widget. Lazy is the
          right default for products with rich widget
          ecosystems.
        </HighlightBlock>

        <h3>Server persistence vs local-only</h3>
        <HighlightBlock as="p" tier="important">
          Server persistence enables cross-device
          continuity; local-only is faster and simpler
          but limits utility. We default to server with
          local cache for instant loads.
        </HighlightBlock>

        <h3>View vs Edit mode</h3>
        <HighlightBlock as="p" tier="important">
          A separate edit mode prevents accidental
          rearrangement during normal viewing. The mode
          switch is a small UX cost for a substantial
          safety win.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">Real-time collaborative editing via CRDTs.
          AI-suggested layouts based on widget types and
          user role. Templates and starter dashboards.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Sharing layouts via URL. Cross-dashboard widget
          linking (filter changes propagate). Dashboard
          versioning with named snapshots.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. Why CSS Grid for layout?</strong> CSS
          Grid handles widget placement declaratively in
          row/column units, supports gaps and alignment
          natively, and updates efficiently as positions
          change. Manual absolute positioning would
          require recomputing pixels on every viewport
          change.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does collision detection work
          during drag?</strong> The layout engine computes
          the dragged widget&rsquo;s candidate footprint
          (x, y, w, h) and checks for overlap with every
          other widget. Overlapping widgets trigger
          rearrangement (push-down). Live preview during
          drag shows the resulting layout.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>3. How do you make drag-and-drop
          accessible?</strong> Provide a keyboard
          alternative: focus a widget, Space enters Move
          mode, arrow keys move, Enter commits. Same
          pattern for resize. Mode changes and position
          updates announce via live region.
        </HighlightBlock>

        <p>
          <strong>4. How are widgets lazy-loaded?</strong>{" "}
          The widget registry maps types to async
          loaders via <code>React.lazy</code>. Each
          widget mounts its loader; a skeleton occupies
          the grid cell during loading. Widgets not in
          the layout don&rsquo;t load.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>5. How is the layout persisted?</strong>{" "}
          A persistence adapter handles save/load. Saves
          are debounced after edits and idempotent
          (full layout replaces prior). Loads happen
          before dashboard render so users see their
          layout on first paint.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>6. How does the dashboard handle mobile
          breakpoints?</strong> Either the layout adapts
          (widgets reflow into a single column) or
          users define a separate mobile layout. We
          default to adaptive with a fallback to
          per-breakpoint layouts for products that need
          finer control.
        </HighlightBlock>

        <p>
          <strong>7. How do you handle concurrent edits
          across tabs?</strong> A broadcast channel
          warns when the layout has changed externally.
          The user can reload to pick up the change or
          keep editing locally with their own
          changes.
        </p>

        <p>
          <strong>8. How is edit mode separated from view
          mode?</strong> Edit mode is a top-level state.
          In view, widgets render content; in edit,
          drag/resize/delete affordances appear and
          widget content interactions are suppressed.
          The mode toggle is explicit.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">A Dashboard Builder is a{" "}
          <strong>grid layout engine</strong> with drag,
          resize, and persistence. CSS Grid handles
          rendering; the layout engine manages positions
          and collision detection; lazy widget loading
          keeps the initial mount fast; keyboard
          alternatives give accessibility parity.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Edit
          mode separates safe viewing from active
          rearranging. The result feels like Notion or
          Datadog — composable, persistent, and
          accessible.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
