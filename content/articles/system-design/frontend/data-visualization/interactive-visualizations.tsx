"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-data-visualization-interactive-visualizations",
  title: "Interactive Visualizations",
  description: "Staff-level guide to interactive visualizations: interaction patterns (hover, click, brush, zoom), state management, accessibility for interactions, and multi-view coordination.",
  category: "frontend",
  subcategory: "data-visualization",
  slug: "interactive-visualizations",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "data-visualization", "interaction", "accessibility", "state-management", "ux"],
  relatedTopics: ["canvas-vs-svg-for-rendering", "large-dataset-rendering", "dashboard-design", "accessibility-a11y"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Interactive Visualizations</strong> enable users to explore data through direct manipulation rather than static viewing. Interactions include hover (tooltips), click (selection), brush (range selection), zoom (scale changes), pan (navigation), and filter (data subset). Interactivity transforms visualizations from presentations into exploration tools.
        </p>
        <p>
          For staff/principal engineers, interactive visualization design requires balancing exploration capability with usability. Too few interactions limit insight discovery. Too many interactions overwhelm users. The right interactions depend on data characteristics, user goals, and context of use.
        </p>
        <p>
          Interactivity adds complexity to visualization architecture. State must track interaction state (selected points, zoom level, filters). Updates must be responsive (under 100ms for direct manipulation). Accessibility must be maintained for keyboard and screen reader users.
        </p>
        <p>
          The business impact of effective interactivity is significant. Interactive visualizations enable users to discover insights not visible in static views. Users engage longer with interactive visualizations. Decision quality improves when users can explore data from multiple angles.
        </p>
        <p>
          In system design interviews, interactive visualizations demonstrate understanding of event handling, state management, performance optimization, and accessibility. It shows you think about user experience, not just rendering.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/interaction-patterns.svg"
          alt="Interactive visualization patterns: hover (tooltips), click (selection), brush (range selection), zoom/pan (navigation), filter (data subset)"
          caption="Interaction patterns — each serves different exploration goal. Hover for details, click for selection, brush for ranges, zoom for scale, filter for subsets"
        />

        <h3>Interaction Types</h3>
        <p>
          <strong>Hover (Tooltips)</strong> displays details on demand. Users hover over data points to see exact values. Tooltips should be informative (show relevant fields), positioned carefully (avoid obscuring data), and dismiss quickly (on mouse out).
        </p>
        <p>
          <strong>Click (Selection)</strong> enables point selection. Users click to select individual points or groups. Selection enables comparison (compare selected vs unselected), filtering (show only selected), and actions (export selected, drill down).
        </p>
        <p>
          <strong>Brush (Range Selection)</strong> enables selecting ranges of data. Users drag to select a range on an axis. Brush enables filtering (show only brushed range), comparison (compare brushed vs unbrushed), and coordination (brush one view, see selection in other views).
        </p>
        <p>
          <strong>Zoom/Pan (Navigation)</strong> enables exploring data at different scales. Users zoom to see detail, pan to navigate large datasets. Zoom/pan is essential for large datasets where overview and detail are both needed.
        </p>
        <p>
          <strong>Filter (Data Subset)</strong> enables showing subsets of data. Users filter by category, time range, or value range. Filter enables focusing on relevant data, comparing subsets, and reducing visual clutter.
        </p>

        <h3>Interaction State Management</h3>
        <p>
          Interaction state includes selection (selected data points), filters (active filters), zoom/pan (current viewport), and hover (currently hovered element). State must be persistent (survive data updates), undoable (users can revert), and synchronized (across coordinated views).
        </p>
        <p>
          State management patterns include <strong>local state</strong> (state within visualization component, simple but not shareable), <strong>lifted state</strong> (state in parent component, shareable across siblings), and <strong>global state</strong> (state in application store, shareable across application).
        </p>
        <p>
          State updates must trigger efficient re-renders. Use memoization to avoid recomputing derived state. Use selective re-rendering (only update changed elements). For large datasets, use GPU rendering to handle frequent updates.
        </p>

        <h3>Multi-View Coordination</h3>
        <p>
          Multi-view coordination links multiple visualizations. Interaction in one view updates other views. This enables exploring data from multiple angles simultaneously.
        </p>
        <p>
          Coordination techniques include <strong>linking</strong> (selection in one view highlights in others), <strong>brushing</strong> (brush in one view filters others), and <strong>focus+context</strong> (one view shows detail, others show context).
        </p>
        <p>
          Implementation requires shared state across views. When state changes (selection, filter), all views update. Use event emitters or state management libraries for cross-view communication.
        </p>

        <h3>Performance for Interactions</h3>
        <p>
          Interactions must be responsive. Hover should show tooltip within 100ms. Zoom/pan should maintain 60fps. Selection should highlight immediately. Slow interactions break the illusion of direct manipulation.
        </p>
        <p>
          Performance techniques include <strong>debouncing</strong> (delay updates until interaction stops), <strong>throttling</strong> (limit update rate), <strong>progressive rendering</strong> (render coarse view immediately, refine progressively), and <strong>worker threads</strong> (compute in background).
        </p>
        <p>
          For large datasets, pre-compute interaction data. Build spatial indices for hit testing. Cache rendered elements for quick updates. Use GPU rendering for frequent updates.
        </p>

        <h3>Accessibility for Interactions</h3>
        <p>
          Interactive visualizations must be accessible. Keyboard users must be able to navigate data points, activate tooltips, and make selections. Screen reader users must understand data and interaction state.
        </p>
        <p>
          Keyboard accessibility includes <strong>tab navigation</strong> (tab through data points), <strong>arrow keys</strong> (navigate between points), <strong>enter/space</strong> (activate tooltip, toggle selection), and <strong>escape</strong> (close tooltip, clear selection).
        </p>
        <p>
          Screen reader accessibility includes <strong>data tables</strong> (provide table alternative), <strong>ARIA labels</strong> (describe data points and state), and <strong>live regions</strong> (announce interaction results).
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Interactive visualization architecture requires decisions about event handling, state management, and update patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/multi-view-coordination.svg"
          alt="Multi-view coordination showing Scatter Plot, Histogram, and Parallel Coordinates views linked through shared state with selection highlighting across all views"
          caption="Multi-view coordination — shared state enables linking (selection highlights), brushing (filter applies to all), and focus+context (detail with overview)"
        />

        <h3>Event Handling Architecture</h3>
        <p>
          Implement a layered event handling architecture. <strong>Low-level events</strong> (mouse, touch, keyboard) are captured by the visualization container. <strong>Interaction events</strong> (hover, click, brush) are derived from low-level events. <strong>Application events</strong> (filter changed, selection changed) are dispatched to the application.
        </p>
        <p>
          Event handling should be declarative where possible. Describe interactions (onHover, onClick, onBrush) rather than implementing low-level event handlers. Libraries like D3-brush and react-use-gesture provide declarative interaction primitives.
        </p>
        <p>
          Handle event conflicts carefully. Brush and zoom may conflict (both use drag). Resolve conflicts via mode switching (brush mode vs zoom mode) or modifier keys (shift+drag for brush, drag for zoom).
        </p>

        <h3>State Architecture</h3>
        <p>
          Implement a state architecture that separates interaction state from data state. <strong>Data state</strong> is the underlying data (immutable). <strong>Interaction state</strong> is user interactions (selection, filters, zoom). <strong>Derived state</strong> is computed from data and interaction state (filtered data, highlighted points).
        </p>
        <p>
          State updates should be immutable. Create new state objects rather than mutating existing state. This enables undo/redo, time-travel debugging, and efficient change detection.
        </p>
        <p>
          Persist interaction state when appropriate. Save user's filters, selection, and zoom level. Restore state on return. This enables users to resume exploration where they left off.
        </p>

        <h3>Update Patterns</h3>
        <p>
          Implement efficient update patterns for interactions. <strong>Enter-update-exit</strong> pattern (D3's data join) efficiently updates DOM elements. <strong>Virtual DOM</strong> (React) efficiently batches updates. <strong>Direct manipulation</strong> (Canvas/WebGL) updates pixels directly.
        </p>
        <p>
          For frequent updates (zoom, pan), use techniques that avoid full re-renders. CSS transforms for pan/zoom are hardware accelerated. GPU rendering handles frequent updates efficiently.
        </p>
        <p>
          Batch updates when possible. Multiple state changes should trigger single re-render. Use React's batched updates or manual batching for non-React code.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/state-management-flow.svg"
          alt="State management flow showing Data State + Interaction State → Derived State (memoized) → Render with user interaction loop"
          caption="State management — Data State (immutable) + Interaction State (user actions) → Derived State (memoized selectors) → Render. User interactions update Interaction State, triggering re-render"
        />

        <h3>Tooltip Architecture</h3>
        <p>
          Tooltips require careful architecture. <strong>Position calculation</strong> determines tooltip position (near cursor, near data point, fixed position). <strong>Content rendering</strong> determines tooltip content (single value, multiple fields, custom component). <strong>Visibility management</strong> determines when tooltip shows/hides (on hover, with delay, sticky).
        </p>
        <p>
          Implement tooltip boundaries to avoid off-screen tooltips. Flip tooltip position when near edges. Use portals to render tooltips outside visualization container (avoids clipping).
        </p>
        <p>
          For accessibility, ensure tooltips are keyboard accessible and announced to screen readers. Use ARIA live regions or focus management for screen reader announcements.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Interactive visualization design involves trade-offs between exploration capability, usability, and implementation complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Interaction</th>
              <th className="p-3 text-left">Implementation</th>
              <th className="p-3 text-left">User Value</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Hover (Tooltips)</td>
              <td className="p-3">Low</td>
              <td className="p-3">High (details on demand)</td>
              <td className="p-3">All visualizations</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Click (Selection)</td>
              <td className="p-3">Low</td>
              <td className="p-3">High (focus on relevant)</td>
              <td className="p-3">Comparison, filtering</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Brush (Range)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">High (explore ranges)</td>
              <td className="p-3">Time series, distributions</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Zoom/Pan</td>
              <td className="p-3">Medium</td>
              <td className="p-3">High (multi-scale)</td>
              <td className="p-3">Large datasets, maps</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Multi-View</td>
              <td className="p-3">High</td>
              <td className="p-3">Highest (multiple angles)</td>
              <td className="p-3">Dashboards, analysis</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that interactions should serve exploration goals, not be added for their own sake. Each interaction should answer a user question. Start with essential interactions (hover, click), add advanced interactions (brush, zoom) based on user needs.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Provide visual feedback for all interactions. Highlight hovered points. Show selection clearly. Indicate zoom level and pan position. Users should always understand interaction state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/accessibility-patterns.svg"
          alt="Accessibility patterns showing visual channels, screen reader support, keyboard navigation, colorblind-safe palettes, and alternative text descriptions"
          caption="Accessibility — use position over color, provide ARIA labels, enable keyboard navigation, use colorblind-safe palettes, write alt text descriptions"
        />

        <p>
          Make interactions discoverable. Use visual cues (cursor changes, hover highlights) to indicate interactivity. Provide help text or tutorials for complex interactions. Don't hide critical interactions.
        </p>
        <p>
          Support undo for destructive interactions. Clearing selection, removing filters, and resetting zoom should be undoable. Provide reset buttons for each interaction type.
        </p>
        <p>
          Maintain performance during interactions. Interactions should feel instantaneous. Use debouncing, throttling, and progressive rendering to maintain responsiveness. Profile interaction performance regularly.
        </p>
        <p>
          Ensure keyboard accessibility. All interactions should be available via keyboard. Provide visible focus indicators. Test with keyboard-only navigation.
        </p>
        <p>
          Coordinate interactions across views. Selection in one view should highlight in others. Filters should apply consistently. Provide clear indication of cross-view coordination.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Adding interactions without purpose clutters the interface. Each interaction should serve a clear exploration goal. Don't add zoom because it's possible—add it because users need to see detail.
        </p>
        <p>
          Not providing visual feedback confuses users. Users should always understand what's selected, what's filtered, and what's hovered. Use highlighting, color changes, and tooltips for feedback.
        </p>
        <p>
          Ignoring keyboard accessibility excludes users. Keyboard-only users must be able to navigate and interact. Screen reader users must understand data and state. Test accessibility during development.
        </p>
        <p>
          Not handling edge cases causes crashes. Handle empty selections, out-of-range zoom, and invalid filters gracefully. Provide clear error messages for invalid interactions.
        </p>
        <p>
          Slow interactions break the illusion of direct manipulation. Tooltips that appear slowly, zoom that lags, and selection that delays frustrate users. Profile and optimize interaction performance.
        </p>
        <p>
          Not persisting interaction state frustrates users. Users lose their filters, selection, and zoom level on refresh. Persist state in URL or local storage.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Analytics Dashboard: Multi-View Coordination</h3>
        <p>
          An analytics dashboard needed to coordinate multiple charts. Users needed to select a time range in one chart and see the selection reflected in all other charts.
        </p>
        <p>
          <strong>Solution:</strong> Implemented brushing in time series chart. Brush state stored in global state. All charts subscribed to brush state. Selected time range highlighted in all charts.
        </p>
        <p>
          <strong>Results:</strong> Users could explore correlations across metrics. Time range selection synchronized across all views. Analysis time reduced by 50% compared to manual filtering.
        </p>

        <h3>Financial Platform: Zoom and Pan</h3>
        <p>
          A financial platform needed to explore stock price data at multiple time scales. Users needed to zoom from yearly view to tick-level detail.
        </p>
        <p>
          <strong>Solution:</strong> Implemented zoom/pan with LOD (level of detail). Zoomed out: aggregated data (daily candles). Zoomed in: detailed data (tick data). Smooth transitions between levels.
        </p>
        <p>
          <strong>Results:</strong> Seamless exploration from years to ticks. Performance maintained at all zoom levels. Traders could identify patterns at multiple scales.
        </p>

        <h3>Scientific Visualization: Brushing and Linking</h3>
        <p>
          A scientific application needed to explore multi-dimensional data. Users needed to select points in one view and see corresponding points in other views.
        </p>
        <p>
          <strong>Solution:</strong> Implemented brushing in scatter plots. Selection linked across multiple views (scatter matrix, parallel coordinates, histogram). Selected points highlighted in all views.
        </p>
        <p>
          <strong>Results:</strong> Scientists could identify correlations across dimensions. Selection revealed patterns not visible in single views. Discovery rate increased significantly.
        </p>

        <h3>E-Commerce: Filter and Drill-Down</h3>
        <p>
          An e-commerce analytics tool needed to explore product performance. Users needed to filter by category, drill down to subcategories, and see detailed metrics.
        </p>
        <p>
          <strong>Solution:</strong> Implemented hierarchical filtering. Click category to filter. Click subcategory to drill down. Breadcrumbs for navigation. Filters persisted in URL.
        </p>
        <p>
          <strong>Results:</strong> Users could explore product hierarchy intuitively. Filter state shareable via URL. Analysis workflow streamlined.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What interactions would you implement for a time series visualization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Essential interactions: hover (tooltips with exact values), click (select time point), brush (select time range). Advanced interactions: zoom (change time scale), pan (navigate time), filter (show/hide series).
            </p>
            <p>
              Implementation: Use D3-brush for range selection. Implement zoom via scale transforms. Store interaction state (selected range, zoom level) in component state or global store.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement coordinated multi-view visualizations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use shared state for coordination. Store selection, filters, and zoom in global state (Redux, Zustand, Context). Each view subscribes to relevant state. When state changes, all views update.
            </p>
            <p>
              Implementation: Use event emitters or state management libraries. For React, use Context or state management library. For D3, use custom events or callbacks. Ensure efficient updates (only update changed views).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you ensure tooltip accessibility?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Provide keyboard access (tab to focus, enter to show tooltip). Use ARIA labels to describe tooltip content. Use ARIA live regions to announce tooltip changes to screen readers. Ensure tooltip is focusable and dismissible.
            </p>
            <p>
              Implementation: Add tabindex to data points. Handle keyboard events (enter, escape). Use aria-describedby or aria-live for screen readers. Test with screen readers (NVDA, VoiceOver).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you optimize interaction performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use debouncing for expensive operations (filter, aggregate). Use throttling for frequent updates (zoom, pan). Use spatial indices for hit testing. Use GPU rendering for frequent updates.
            </p>
            <p>
              Implementation: lodash.debounce for debouncing. requestAnimationFrame for smooth animation. Quadtree for spatial queries. WebGL for GPU rendering. Profile to identify bottlenecks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you handle interaction state persistence?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Persist state in URL (query parameters) for shareability. Persist in localStorage for session persistence. Serialize state (selection, filters, zoom) to JSON. Restore state on load.
            </p>
            <p>
              Implementation: Use URL encoding for query parameters. Use localStorage API for local persistence. Implement state serialization/deserialization. Handle versioning for state schema changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are considerations for touch interactions?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Touch interactions differ from mouse. Use touch events (touchstart, touchmove, touchend). Handle multi-touch (pinch zoom, two-finger pan). Provide larger touch targets (minimum 44x44 pixels).
            </p>
            <p>
              Implementation: Use pointer events for unified mouse/touch handling. Use libraries like react-use-gesture for touch gestures. Test on actual touch devices. Handle edge cases (touch + mouse on hybrid devices).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://d3js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              D3.js
            </a> — Data-Driven Documents with interaction primitives.
          </li>
          <li>
            <a href="https://observablehq.com/@d3/brushing" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              D3 Brushing
            </a> — Brushing and linking examples.
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2020/08/interactive-data-visualization/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine: Interactive Data Visualization
            </a> — Guide to interactive visualization design.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Patterns
            </a> — Accessibility patterns for interactions.
          </li>
          <li>
            <a href="https://react-spring.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Spring
            </a> — Animation library for smooth interactions.
          </li>
          <li>
            <a href="https://use-gesture.netlify.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              react-use-gesture
            </a> — Gesture library for mouse/touch interactions.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
