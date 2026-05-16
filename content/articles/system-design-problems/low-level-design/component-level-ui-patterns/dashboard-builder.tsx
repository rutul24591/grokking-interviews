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

export default function DashboardBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
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

      <h2>Clarifying the Requirements</h2>
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

      <h2>The Widget Registry</h2>
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

      <h2>The Grid Layout Model</h2>
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

      <h2>The Placement Algorithm</h2>
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

      <h2>Drag and Drop Implementation</h2>
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

      <h2>Responsive Breakpoints</h2>
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

      <h2>Widget Data Fetching</h2>
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

      <h2>Persistence</h2>
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

      <h2>Accessibility</h2>
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
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How does the compact placement algorithm handle a large dashboard efficiently?</h3>
      <p>
        The compact algorithm runs after every drag or resize event, processing each
        layout item to move it as far up as possible. Its time complexity is O(n²) in
        the number of widgets (for each of n widgets, it checks for overlaps with all
        other widgets). For dashboards with 20–50 widgets, this is imperceptibly fast.
        For dashboards with hundreds of widgets (analytics platforms), optimize by
        representing the grid as a 2D boolean occupancy array (rows × columns). Placing
        or moving a widget flips cells in the array from free to occupied. Finding the
        highest valid position for a widget is a scan of the occupancy array from top
        to bottom — O(rows × w) for a widget of width w. The total complexity is
        O(n × rows × maxWidth), which is linear in n for fixed grid dimensions.
      </p>

      <h3>Q: How do you handle a widget that needs to be full-width on mobile but multi-column on desktop?</h3>
      <p>
        The responsive breakpoint layout system handles this: the lg layout stores the
        widget at w=6 (half-width on a 12-column grid); the sm layout stores the same
        widget at x=0, w=6 (full-width on a 6-column grid, since 6/6=100%). The
        breakpoint switch happens automatically when the dashboard container's width
        crosses the breakpoint threshold (detected by ResizeObserver). If the sm layout
        is not explicitly saved, auto-generation sets x=0, w=maxCols (full-width),
        ensuring every widget spans the full width on small screens — a safe default
        for most widgets.
      </p>

      <h3>Q: How would you implement a dashboard with real-time streaming data (e.g., a live metrics wall)?</h3>
      <p>
        Each widget subscribes to a WebSocket channel specific to its data source
        and time range. The widget component connects on mount and disconnects on
        unmount. For a shared channel (multiple widgets showing the same metric), a
        singleton connection shared via React context or a Zustand subscription store
        avoids multiple WebSocket connections to the same channel. Incoming data points
        are appended to the widget's local time-series buffer (a ring buffer of fixed
        size, e.g., 1000 points). The chart re-renders on each new data point using
        requestAnimationFrame to batch rapid updates into single render cycles. For
        very high-frequency streams (1000+ events/second), aggregate in the widget's
        buffer before rendering: only render the last N points that fit in the widget's
        pixel width.
      </p>

      <h3>Q: How do you design the configuration schema for widget settings?</h3>
      <p>
        Each widget definition in the registry includes a JSON Schema describing its
        configuration options. The dashboard builder renders a generic settings form
        from this schema using a schema-to-form library (react-jsonschema-form, or
        a custom implementation). This means new widget types can define their own
        settings without any changes to the dashboard builder code — the schema drives
        the form. A line chart widget's schema includes fields like: dataSource
        (string, enum of available metrics), timeRange (string, enum), showLegend
        (boolean), yAxisMin (number), yAxisMax (number). The settings panel
        instantiates the schema form, binds it to the widget's saved configuration,
        and on submit, updates the widget's configuration in the layout and persists.
      </p>

      <h3>Q: How do you prevent a widget's data fetch from blocking the dashboard render?</h3>
      <p>
        Each widget is wrapped in a React Suspense boundary and an ErrorBoundary.
        The Suspense boundary shows the skeleton placeholder while the widget's lazy
        component loads (code-splitting) and while its data fetch is pending (if using
        Suspense-compatible data fetching like React Query's useSuspenseQuery). The
        ErrorBoundary shows the widget's error state if the fetch fails. Because each
        widget has its own Suspense and ErrorBoundary, a slow or failing widget only
        shows its own fallback — the rest of the dashboard renders normally. The
        dashboard layout is rendered with all widget placeholders immediately; widgets
        fill in as their data loads, giving the impression of progressive loading
        rather than a blocking spinner for the entire dashboard.
      </p>
    </ArticleLayout>
  );
}
