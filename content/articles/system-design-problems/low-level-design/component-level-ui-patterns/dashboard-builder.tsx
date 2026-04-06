"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-dashboard-builder",
  title: "Design a Dashboard Builder",
  description:
    "Dashboard builder where users can add/remove/resize/rearrange widgets, grid layout, persistence, lazy widget loading, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "dashboard-builder",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: ["lld", "dashboard", "grid-layout", "drag-drop", "persistence", "lazy-loading"],
  relatedTopics: ["kanban-board", "resizable-split-pane", "data-table"],
};

export default function DashboardBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a dashboard builder — a visual interface where users can
          compose custom dashboards by adding, removing, resizing, and rearranging
          widgets (charts, tables, metrics). The layout uses a responsive grid system.
          Widget configurations are persisted per user. Widgets lazy-load their data
          when they enter the viewport.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Dashboard is a grid of configurable columns (12-column grid).</li>
          <li>Widgets have configurable sizes (1x1, 2x1, 3x2, etc. in grid units).</li>
          <li>Users can add widgets from a widget catalog, remove, resize, and drag-reorder.</li>
          <li>Widget data is fetched lazily when the widget enters the viewport.</li>
          <li>Layout is persisted to the server and restored on reload.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Widget Catalog:</strong> Users can browse available widget types (line chart, bar chart, table, metric card, etc.) and add them to the dashboard.</li>
          <li><strong>Drag Rearrange:</strong> Drag widgets to reposition within the grid. Grid auto-snaps to nearest valid position.</li>
          <li><strong>Resize:</strong> Drag widget edges/corners to resize. Constrained to grid units.</li>
          <li><strong>Add/Remove:</strong> Add widgets from catalog, remove with confirmation.</li>
          <li><strong>Persistence:</strong> Layout (widget positions, sizes, configurations) saved to server, restored on load.</li>
          <li><strong>Lazy Loading:</strong> Widget data fetched only when widget enters viewport (IntersectionObserver).</li>
          <li><strong>Responsive:</strong> Grid adapts to screen size — 12 columns on desktop, 4 on tablet, 1 on mobile.</li>
          <li><strong>Widget Configuration:</strong> Each widget has a settings panel (date range, metrics, filters).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 50+ widgets render smoothly. Drag operations at 60fps.</li>
          <li><strong>Lazy Loading:</strong> Widget data fetches only when visible. Off-screen widgets show skeleton.</li>
          <li><strong>Accessibility:</strong> Keyboard navigation between widgets, ARIA grid roles, screen reader announces widget content.</li>
          <li><strong>Type Safety:</strong> Full TypeScript for widget definitions, layout state, and configuration.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Widget catalog has 100+ widget types — must be searchable and categorized.</li>
          <li>Resizing a widget overlaps another — auto-push other widgets or reject resize.</li>
          <li>Widget data fetch fails — show error state with retry button.</li>
          <li>Layout saved on desktop, loaded on mobile — grid collapses to single column, widget heights adjust.</li>
          <li>User removes a widget type that is no longer available in the catalog — show placeholder with &quot;Widget deprecated&quot; message.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>grid layout engine</strong> that manages widget
          positions on a 12-column grid. Widgets are rendered as grid items with
          <code>grid-column</code> and <code>grid-row</code> styles. A <strong>Zustand
          store</strong> manages the layout state (widget positions, sizes, configs).
          Drag and resize operations use Pointer Events with grid snapping. An
          <strong>IntersectionObserver</strong> lazily triggers data fetch for each
          widget when it enters the viewport.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>react-grid-layout:</strong> Popular library but adds bundle weight and limits customization of the snap/collision logic.</li>
          <li><strong>CSS Grid only:</strong> CSS Grid handles layout but not drag/resize persistence. Requires JS layer for interactivity.</li>
        </ul>
        <p>
          <strong>Why custom grid + store is optimal:</strong> Full control over drag
          mechanics, collision resolution, and persistence schema. The normalized store
          makes layout save/restore trivial.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces</h4>
          <p><code>Widget</code> (id, type, x, y, w, h, config), <code>Layout</code> (widgets array, grid columns), <code>WidgetCatalog</code> (available widget types with metadata).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Dashboard Store</h4>
          <p>Zustand store: widgets array, drag state, resize state. Actions: addWidget, removeWidget, moveWidget, resizeWidget, saveLayout, loadLayout.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Grid Layout Engine</h4>
          <p>Computes grid positions, resolves collisions (push-down strategy), snaps drag targets to grid units.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Pointer Drag Handler</h4>
          <p>Pointer events for drag (move) and resize (edge/corner handles). Grid snapping during drag.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Lazy Loader Hook</h4>
          <p>IntersectionObserver per widget. Triggers data fetch when widget enters viewport. Shows skeleton when not visible.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/dashboard-builder-architecture.svg"
          alt="Dashboard builder architecture showing catalog, store, and grid rendering"
          caption="Dashboard architecture: Widget Catalog → Dashboard Store → Grid Renderer"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Dashboard loads: store fetches saved layout, hydrates state.</li>
          <li>Widgets render as grid items at their positions. Off-screen widgets show skeletons.</li>
          <li>User drags widget: pointermove computes new grid position, collision resolution pushes affected widgets.</li>
          <li>User resizes widget: pointermove computes new width/height in grid units, collision check.</li>
          <li>Widget enters viewport: IntersectionObserver fires, data fetch triggers, skeleton replaced with content.</li>
          <li>User saves layout: store serializes widget positions/sizes/configs, sends to server.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow: layout load → grid render → viewport detection → lazy data fetch
          → widget content render. Drag/resize flow: pointer events → grid snapping →
          collision resolution → store update → grid re-render.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Collision resolution:</strong> When a widget is dragged onto another, the engine pushes overlapping widgets down (or right) using a push-down algorithm. If pushing would push a widget off the grid, the drag position is rejected.</li>
          <li><strong>Responsive layout:</strong> On resize, the grid column count changes. Widget widths are recalculated proportionally (widget with w=6 on 12-col grid becomes w=4 on 8-col grid).</li>
          <li><strong>Deprecated widgets:</strong> When a widget type is no longer in the catalog, the renderer shows a placeholder with the widget&apos;s last known data and a &quot;This widget is no longer available&quot; message.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete implementation includes: normalized dashboard store, grid layout
            engine with collision resolution, Pointer Events drag/resize handler,
            IntersectionObserver lazy loading, widget catalog with search, widget settings
            panel, and full ARIA grid accessibility.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules Overview</h3>
        <p>
          The dashboard store manages widget positions and configurations. The grid engine
          computes CSS grid placements and resolves collisions. The drag handler snaps
          movements to grid units. The lazy loader uses IntersectionObserver to trigger
          data fetch only for visible widgets. Each widget is a self-contained component
          that fetches its own data.
        </p>
      </section>

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
                <td className="p-2">Grid placement</td>
                <td className="p-2">O(1) — CSS grid-cell assignment</td>
                <td className="p-2">O(n) — n widgets</td>
              </tr>
              <tr>
                <td className="p-2">Collision resolution</td>
                <td className="p-2">O(n) — check all widgets</td>
                <td className="p-2">O(n)</td>
              </tr>
              <tr>
                <td className="p-2">Lazy load trigger</td>
                <td className="p-2">O(1) — IntersectionObserver callback</td>
                <td className="p-2">O(1) per widget</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Collision check on every drag frame:</strong> O(n) per pointermove event. Mitigation: throttle collision check to 16ms (60fps), use spatial index (grid cell occupancy map) for O(1) lookup.</li>
          <li><strong>Widget data fetches:</strong> 50 widgets × 50 concurrent fetches. Mitigation: IntersectionObserver with rootMargin preload (fetch when 200px from viewport), fetch priority hints.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Spatial index for collision:</strong> Maintain a 2D occupancy grid (columns × rows). Check cell occupancy in O(1) instead of scanning all widgets.</li>
          <li><strong>Widget memoization:</strong> Each widget component is <code>React.memo</code> with comparator on its config. Re-renders only when its own config changes.</li>
          <li><strong>Batched layout save:</strong> Debounce layout saves at 500ms during drag/resize to avoid excessive API calls.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Widget configurations from the server are validated against a schema before
          rendering. Malformed configs are rejected with fallback to default settings.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>Tab moves focus between widgets. Arrow keys move focused widget within grid (with collision resolution).</li>
            <li>Delete key removes focused widget. Escape cancels drag/resize.</li>
            <li>Widget settings panel is reachable via Enter on the widget&apos;s settings button.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles</h4>
          <ul className="space-y-2">
            <li>Dashboard has <code>role=&quot;application&quot;</code> with <code>aria-label=&quot;Dashboard builder&quot;</code>.</li>
            <li>Each widget has <code>role=&quot;region&quot;</code> with <code>aria-label</code> showing widget type and title.</li>
            <li>Widget content is announced to screen readers when it loads.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Grid engine:</strong> Test collision detection, push-down resolution, boundary enforcement.</li>
          <li><strong>Store:</strong> Test add/remove/move/resize widgets, layout serialization/deserialization.</li>
          <li><strong>Lazy loader:</strong> Test IntersectionObserver triggers data fetch when widget enters viewport.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Drag and resize:</strong> Simulate pointer events, verify grid positions update, verify collision resolution.</li>
          <li><strong>Layout persistence:</strong> Modify layout, save, reload, verify layout restored exactly.</li>
          <li><strong>Responsive:</strong> Resize browser window, verify grid adapts, widget positions recalculate.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No collision handling:</strong> Widgets overlap when dragged onto each other. Staff candidates must propose collision resolution (push-down or reject).</li>
          <li><strong>Fetching all widget data on load:</strong> 50 widgets × 50 concurrent API calls. Lazy loading via IntersectionObserver is essential.</li>
          <li><strong>No responsive handling:</strong> 12-column grid on mobile is unusable. Grid must collapse gracefully.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Trade-offs</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Push-Down vs Reject on Collision</h4>
          <p>
            Push-down moves overlapping widgets to make room. Reject prevents the drag.
            Push-down is more flexible but can cascade (moving one widget pushes another).
            Reject is simpler but frustrating. Most dashboards use push-down with a
            maximum cascade depth (e.g., 5 levels).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support shared dashboards (multiple users viewing/editing)?</p>
            <p className="mt-2 text-sm">
              A: Use WebSocket for real-time layout sync. Each layout change is
              broadcast to all viewers. Conflict resolution: last-write-wins for
              simplicity, or CRDT for concurrent edits. Widget data is fetched
              independently per user (each user&apos;s data queries use their own
              permissions).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement widget-level permissions (some users can only view, not edit)?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>canEdit</code> flag per widget based on user role. The
              UI disables drag handles and resize handles for view-only widgets. The
              server also validates permissions on layout save requests.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle real-time data updates within widgets (live charts)?</p>
            <p className="mt-2 text-sm">
              A: Each widget establishes its own WebSocket or SSE connection for its
              data stream. Use a shared connection pool to avoid N WebSocket
              connections for N widgets. Throttle updates to 1-second intervals to
              avoid overwhelming the rendering pipeline.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement dashboard templates?</p>
            <p className="mt-2 text-sm">
              A: Templates are predefined layout JSON objects (widget types, positions,
              default configs). When a user selects a template, the store initializes
              with the template layout. Users can customize from there. Templates are
              versioned — updating a template does not affect existing dashboards.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — CSS Grid Layout
            </a>
          </li>
          <li>
            <a href="https://github.com/react-grid-layout/react-grid-layout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              react-grid-layout — Reference Implementation
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Grid Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
