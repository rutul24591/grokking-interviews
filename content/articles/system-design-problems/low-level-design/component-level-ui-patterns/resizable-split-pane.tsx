"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-resizable-split-pane",
  title: "Design a Resizable Split Pane",
  description:
    "Production-grade resizable split pane with drag-to-resize, min/max constraints, nested layouts, persistence, keyboard support, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "resizable-split-pane",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "split-pane",
    "resizable",
    "drag",
    "persistence",
    "keyboard-navigation",
    "accessibility",
    "nested-layout",
  ],
  relatedTopics: [
    "dashboard-builder",
    "drag-drop-list",
    "file-explorer-ui",
  ],
};

export default function ResizableSplitPaneArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a resizable split pane component that divides a container
          into two panels separated by a draggable divider. Users can drag the divider
          to resize panel widths (horizontal split) or heights (vertical split). The
          system must enforce minimum and maximum panel sizes, persist user-adjusted
          sizes across sessions, support nested splits for complex multi-pane layouts,
          and be fully keyboard-accessible.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>The container has a fixed or percentage-based size. Pane sizes are computed relative to the container.</li>
          <li>Each pane has configurable minimum and maximum sizes (in pixels or percentages).</li>
          <li>Pane sizes are persisted to localStorage and restored on remount.</li>
          <li>Nested splits are supported (e.g., left pane contains its own vertical split).</li>
          <li>Double-clicking the divider collapses the first pane to its minimum size; double-clicking again restores the previous size.</li>
          <li>The component is used in a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Drag Resize:</strong> Pointer-based drag on the divider resizes both panels simultaneously. Movement delta is applied to the divider position.</li>
          <li><strong>Min/Max Constraints:</strong> Each panel has minimum and maximum size constraints. Dragging beyond constraints stops the divider.</li>
          <li><strong>Orientation:</strong> Supports horizontal (left/right) and vertical (top/bottom) splits.</li>
          <li><strong>Persistence:</strong> Pane sizes are saved to localStorage and restored on remount.</li>
          <li><strong>Nested Splits:</strong> A pane can contain another SplitPane, enabling arbitrary multi-pane layouts.</li>
          <li><strong>Collapse/Restore:</strong> Double-clicking the divider collapses the first pane to minimum. Double-clicking again restores the previous size.</li>
          <li><strong>Keyboard Resize:</strong> When the divider is focused, Arrow keys resize by 10px increments.</li>
          <li><strong>Cursor Feedback:</strong> Divider shows col-resize or row-resize cursor based on orientation.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Drag updates use requestAnimationFrame for smooth 60fps resizing. No layout thrashing during drag.</li>
          <li><strong>Responsiveness:</strong> Pane sizes recompute on container resize (ResizeObserver).</li>
          <li><strong>Accessibility:</strong> Divider has role=&quot;separator&quot;, aria-orientation, aria-valuenow, and keyboard support.</li>
          <li><strong>Type Safety:</strong> Full TypeScript for pane configuration, size types, and persistence schema.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Container is narrower than the sum of both panel minimum sizes — must handle gracefully (overflow or clamp).</li>
          <li>Pointer leaves the browser window during drag — drag continues on document-level listeners.</li>
          <li>localStorage is full or disabled — persistence fails silently, sizes reset on remount.</li>
          <li>Nested splits: resizing parent affects child container size — children must recompute their proportions.</li>
          <li>User resizes during a CSS transition animation — transition must be cancelled to prevent conflicting state.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to manage the divider position as a single source of truth
          (a pixel value or percentage), with each panel&apos;s size derived from it.
          Pointer events on the divider compute movement deltas, constrained by each
          panel&apos;s min/max bounds. A Zustand store persists sizes to localStorage
          and restores them on mount. Nested splits work by recursively rendering
          SplitPane components within panes, each with independent state.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>CSS-only with resize property:</strong> CSS <code>resize: horizontal</code> on panels works for simple cases but lacks min/max enforcement, persistence, nested support, and keyboard accessibility.</li>
          <li><strong>Third-party library (react-resizable-panels, react-split-pane):</strong> Battle-tested but adds bundle weight and limits customization (e.g., custom collapse behavior, persistence schema).</li>
        </ul>
        <p>
          <strong>Why custom implementation is optimal:</strong> Full control over drag mechanics, persistence strategy, nested layout support, and ARIA compliance. The pointer-event-based approach works on both mouse and touch devices, and the store-based persistence is decoupled from the rendering layer.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>split-pane-types.ts</code>)</h4>
          <p>Defines <code>SplitPaneOrientation</code> (horizontal | vertical), <code>PaneSize</code> (pixels or percentage), <code>PaneConfig</code> (min, max, initial size), and <code>SplitPaneState</code> (divider position, collapsed state, persisted size).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Split Pane Store (<code>split-pane-store.ts</code>)</h4>
          <p>Zustand store per SplitPane instance (factory pattern). Tracks divider position (in pixels), collapsed state, previous size (for restore), and persistence key. Actions: setDividerPosition, toggleCollapse, restore, reset.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Pane Size Calculator (<code>pane-size-calculator.ts</code>)</h4>
          <p>Pure functions: clamp divider position within min/max bounds, convert percentage to pixels, compute flex basis for each panel, handle container overflow when min sizes exceed available space.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Pointer Drag Handler (<code>pointer-drag-handler.ts</code>)</h4>
          <p>Pointer event lifecycle: pointerdown on divider captures pointer, pointermove on document computes delta, pointerup releases. Movement is restricted to the split axis (X for horizontal, Y for vertical). Cursor is set via CSS during drag.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useSplitPane Hook (<code>use-split-pane.ts</code>)</h4>
          <p>Main orchestrator hook. Initializes store with config, sets up pointer drag via the handler, integrates ResizeObserver for container size changes, manages persistence. Returns refs, state, and handlers for rendering.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. usePaneKeyboard Hook (<code>use-pane-keyboard.ts</code>)</h4>
          <p>Keyboard handler on the divider: ArrowLeft/Right (horizontal) or ArrowUp/Down (vertical) adjust divider position by 10px increments. Home/End jump to min/max positions. Enter toggles collapse.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. usePanePersistence Hook (<code>use-pane-persistence.ts</code>)</h4>
          <p>Saves divider position to localStorage on change (debounced at 300ms). On mount, reads saved position and validates against current container size. Handles corrupted or stale data (version mismatch) by falling back to defaults.</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          Each SplitPane instance has its own Zustand store (factory pattern). The store
          holds the divider position in pixels, collapsed state, and previous size (for
          restore). Persistence is handled by a separate hook that debounces writes to
          localStorage. Container size changes trigger a recalculation via ResizeObserver,
          which updates the divider position proportionally.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/resizable-split-pane-architecture.svg"
          alt="Resizable split pane architecture showing pointer event handling, position computation, and persistence"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Consumer renders <code>{`<SplitPane orientation="horizontal" minSize={200}>`}</code> with two pane children.</li>
          <li>useSplitPane initializes store, reads persisted size from localStorage if available.</li>
          <li>ResizeObserver measures container width, computes initial divider position.</li>
          <li>Panels render with computed flex-basis styles.</li>
          <li>User drags divider: pointermove fires, delta computed, position clamped within min/max.</li>
          <li>Store updates divider position, panels re-render with new sizes.</li>
          <li>Debounced persistence hook saves new position to localStorage.</li>
          <li>User double-clicks: collapse toggles, divider moves to min position or restored position.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is unidirectional: user interaction (drag, keyboard, double-click)
          → store update → size recalculation → panel style update → persistence (debounced).
          Container resize events (ResizeObserver) trigger a proportional recalculation of
          the divider position.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Pointer leaves window:</strong> Document-level pointermove/pointerup listeners ensure drag continues even when the cursor exits the browser viewport. Pointer capture prevents other elements from receiving events.</li>
          <li><strong>Container shrinks below min sizes:</strong> The pane size calculator clamps the divider to the closest valid position. Panels may overflow the container, but the divider remains draggable to restore valid proportions.</li>
          <li><strong>localStorage unavailable:</strong> The persistence hook catches QuotaExceededError and Storage access denied errors. It falls back to in-memory defaults and logs a warning in development mode.</li>
          <li><strong>Nested split resize:</strong> When a parent pane resizes, the child SplitPane&apos;s container changes size. The child&apos;s ResizeObserver fires, and the divider position is recomputed proportionally to maintain the user&apos;s relative split.</li>
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
            Complete production-ready implementation includes:
            Zustand store with persistence, pointer-based drag handler,
            ResizeObserver integration, keyboard resize, collapse/restore,
            nested pane support, and full ARIA compliance.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types &amp; Interfaces</h3>
        <p>
          Defines the orientation enum, PaneSize type (pixels or percentage), PaneConfig
          with min/max/initial, SplitPaneState with divider position and collapse flag,
          and the component props interface accepting children, orientation, min sizes,
          persistence key, and optional callbacks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Split Pane Store</h3>
        <p>
          Factory function creates a Zustand store per SplitPane instance. State includes
          divider position (pixels), collapsed boolean, previous size (for restore), and
          container size. Actions: setDividerPosition, toggleCollapse, restore, reset,
          setContainerSize. Each store is independent to support nested splits.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Pane Size Calculator</h3>
        <p>
          Pure functions: <code>clampPosition</code> enforces min/max bounds on the divider
          position. <code>computeFlexBasis</code> converts pixel position to CSS flex-basis
          for each panel. <code>handleOverflow</code> detects when min sizes exceed container
          size and clamps to the nearest valid position.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Pointer Drag Handler</h3>
        <p>
          Uses Pointer Events API for unified mouse/touch support. On pointerdown, the
          handler captures the pointer and stores the initial position. On pointermove
          (document-level), it computes the delta along the split axis and returns the
          constrained new position. On pointerup, it releases the pointer and returns the
          final position for persistence.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useSplitPane Hook</h3>
        <p>
          Orchestrates all concerns: initializes the store, sets up the pointer drag handler
          via useEffect, integrates ResizeObserver for container size tracking, and connects
          the persistence hook. Returns container ref, divider ref, panel refs, current
          positions, and event handlers for rendering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Keyboard &amp; Persistence Hooks</h3>
        <p>
          The keyboard hook listens for Arrow keys on the focused divider, adjusting position
          by 10px per press. Home/End jump to min/max. Enter toggles collapse. The
          persistence hook debounces position writes to localStorage at 300ms, validates
          restored data against the current container size, and handles version mismatches
          by falling back to default positions.
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
                <td className="p-2">Drag delta computation</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Position clamping</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">ResizeObserver callback</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Persistence write</td>
                <td className="p-2">O(1) — JSON.stringify</td>
                <td className="p-2">O(1) — single key-value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Frequent re-renders during drag:</strong> Each pointermove event triggers a store update. At 60fps, that is 60 re-renders per second. Mitigation: use CSS custom properties (--pane-1-size, --pane-2-size) updated via style attribute, avoiding React re-renders entirely during drag. Only commit the final position to the store on pointerup.</li>
          <li><strong>Nested ResizeObserver cascades:</strong> Resizing a parent triggers child ResizeObservers, which trigger their own recalculations. Mitigation: debounce child recalculations with requestAnimationFrame coalescing.</li>
          <li><strong>localStorage writes blocking main thread:</strong> Large payloads or slow storage can cause jank. Mitigation: debounce at 300ms, store only the pixel position (small JSON), and wrap in try/catch for silent failure.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>CSS custom properties during drag:</strong> Update <code>--pane-size</code> directly on the container element during pointermove. This avoids React re-renders and runs entirely on the style layer.</li>
          <li><strong>requestAnimationFrame coalescing:</strong> Batch multiple ResizeObserver callbacks into a single recalculation using rAF.</li>
          <li><strong>Stable store references:</strong> Use useRef to hold the Zustand store instance, preventing recreation on re-renders.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Pane size values from localStorage are validated on restore: they must be
          positive numbers within the current container bounds. Malformed or out-of-range
          values are discarded and defaults are used. This prevents corrupted storage
          data from breaking the layout.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>The divider is focusable with <code>{`tabIndex={0}`}</code>.</li>
            <li>Arrow keys (Left/Right for horizontal, Up/Down for vertical) resize by 10px per press.</li>
            <li>Home/End jump to minimum/maximum positions.</li>
            <li>Enter or Space toggles collapse/restore.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <ul className="space-y-2">
            <li>The divider has <code>role=&quot;separator&quot;</code> and <code>aria-orientation</code> matching the split direction.</li>
            <li><code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code> communicate the current split position as a percentage.</li>
            <li><code>aria-label</code> describes the separator (e.g., &quot;Resize left and right panels&quot;).</li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Pointer capture limits:</strong> During drag, pointer capture prevents other elements from receiving events. On pointerup or window blur, capture is released to prevent stuck states.</li>
          <li><strong>localStorage quota:</strong> The persistence key uses a namespaced format (<code>split-pane:{'${componentId}'}</code>) to avoid collisions. On QuotaExceededError, the hook clears stale data and falls back to defaults.</li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Pane size calculator:</strong> Test clampPosition with positions below min, above max, and within bounds. Test overflow handling when min sizes exceed container.</li>
          <li><strong>Pointer drag handler:</strong> Simulate pointerdown/move/up events, verify delta computation, verify axis-restricted movement (X for horizontal, Y for vertical).</li>
          <li><strong>Persistence hook:</strong> Mock localStorage, test save on position change, test restore on mount, test version mismatch fallback, test error handling (QuotaExceededError).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Drag resize flow:</strong> Render SplitPane, simulate drag via pointer events, verify panel widths change proportionally, verify divider position updates.</li>
          <li><strong>Collapse/restore:</strong> Double-click divider, verify first panel collapses to min size. Double-click again, verify it restores to previous size.</li>
          <li><strong>Keyboard resize:</strong> Focus divider, press ArrowRight 5 times, verify divider moved 50px. Press Home, verify it jumped to min position.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>Pointer leaves browser window during drag: verify drag continues via document-level listeners.</li>
          <li>Container resizes: verify panels recompute proportions via ResizeObserver.</li>
          <li>Nested splits: verify parent resize triggers child recalculation.</li>
          <li>Accessibility: run axe-core, verify separator role, aria attributes, and keyboard navigation.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Using mouse events instead of pointer events:</strong> Mouse events do not work on touch devices. Interviewers expect Pointer Events API or at least mention of touch support.</li>
          <li><strong>No min/max enforcement:</strong> Without constraints, a panel can be resized to zero or negative size, breaking the layout. Candidates must mention clamping logic.</li>
          <li><strong>Re-rendering on every pointermove:</strong> Triggering a React re-render on every pointermove event at 60fps causes jank. Interviewers expect CSS custom properties or requestAnimationFrame batching.</li>
          <li><strong>No persistence:</strong> Losing user-adjusted sizes on page reload is a poor UX. Candidates should mention localStorage or a similar mechanism.</li>
          <li><strong>Ignoring accessibility:</strong> A draggable divider is completely inaccessible without keyboard support and ARIA attributes. This is a common oversight.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS Custom Properties vs React State During Drag</h4>
          <p>
            Using React state for panel sizes during drag triggers a re-render on every
            pointermove (60fps). This is expensive. CSS custom properties
            (<code>--pane-1-size</code>) updated via <code>element.style.setProperty()</code>
            avoid React entirely during drag. The trade-off is that CSS custom properties
            are not reactive — other components cannot subscribe to size changes. For
            split panes, this is acceptable because only the panel elements need the size.
            Commit the final position to React state on pointerup for persistence.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Percentage vs Pixel-Based Sizes</h4>
          <p>
            Pixel-based sizes are precise during drag (pointer movement is in pixels) but
            do not adapt to container resizing. Percentage-based sizes adapt but lose
            precision during drag. The best approach: track in pixels during drag, convert
            to percentage for persistence. On restore, convert percentage back to pixels
            based on the current container size.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support more than two panes (e.g., three-column layout)?</p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) Nested SplitPanes: the left and center+right panels
              are in a horizontal split, and the center+right panels are in another
              horizontal split inside the second pane. (2) Multi-divider: a single
              SplitPane with N panes has N-1 dividers. Each divider position is tracked
              independently. Approach (1) is simpler to implement. Approach (2) is more
              flexible but requires managing interdependent divider constraints.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle smooth animations during collapse/restore?</p>
            <p className="mt-2 text-sm">
              A: Apply a CSS transition to the panel&apos;s flex-basis property during
              collapse/restore (<code>transition: flex-basis 0.2s ease</code>). Remove
              the transition class during drag to prevent lag. Use a ref to track whether
              a drag is in progress and conditionally apply the transition class.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you sync pane sizes across browser tabs?</p>
            <p className="mt-2 text-sm">
              A: Use the BroadcastChannel API. When a pane size changes, broadcast the
              new position to all tabs. Each tab listens for the message and updates its
              store. Alternatively, use the <code>storage</code> event (fires on other
              tabs when localStorage changes) as a zero-dependency approach.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent layout thrashing during resize?</p>
            <p className="mt-2 text-sm">
              A: Avoid reading layout properties (offsetWidth, getBoundingClientRect)
              during the same frame as writing styles. The ResizeObserver callback runs
              before paint, so reading container size there is safe. During drag, use
              CSS custom properties which do not trigger layout reads. Batch all style
              writes together before the next paint.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a snap-to-grid behavior (e.g., snap to 50px increments)?</p>
            <p className="mt-2 text-sm">
              A: Round the computed divider position to the nearest grid increment in the
              pointermove handler. <code>Math.round(position / gridSize) * gridSize</code>.
              Clamp the snapped position within min/max bounds. Provide a configuration
              prop for grid size (default 0 for no snapping).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSR for a component that depends on container size?</p>
            <p className="mt-2 text-sm">
              A: During SSR, render panels with default proportions (e.g., 50/50). On
              client mount, use a useEffect + ResizeObserver to measure the actual
              container size and set the divider position. This causes a single hydration
              mismatch, which React tolerates if the server and client render the same
              DOM structure (just different style values). Suppress the warning with a
              suppressHydrationWarning on the container.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Pointer Events API
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — ResizeObserver API
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Window Splitter Pattern
            </a>
          </li>
          <li>
            <a href="https://github.com/bvaughn/react-resizable-panels" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              react-resizable-panels — Reference Implementation
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Web.dev — Avoiding Layout Thrashing
            </a>
          </li>
          <li>
            <a href="https://zustand-demo.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — State Management for Per-Instance Stores
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
