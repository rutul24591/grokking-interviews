"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-resizable-split-pane",
  title: "Design a Resizable Split Pane",
  description:
    "LLD for resizable split panes: drag-to-resize, min/max constraints, persistence, keyboard support, nested splits, and accessibility.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "resizable-split-pane",
  wordCount: 5000,
  readingTime: 26,
  lastUpdated: "2026-05-04",
  tags: ["lld", "split-pane", "resize", "react", "accessibility"],
  relatedTopics: [
    "drag-drop-list",
    "code-editor-component",
    "data-table",
  ],
};

export default function ResizableSplitPaneArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Resizable Split Pane</h1><h2>Definition &amp; Context</h2><p>Design a Resizable Split Pane is an implementation-heavy interaction design covering pointer capture, committed ratios, drag projection, min-max constraints, nested panes, persistence, keyboard resize, and responsive collapse. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep committed ratios separate from drag projection. Clamp against current container and child constraints. Core structures: pane tree, bounds, axis, ratios, drag session, min-max policy, observer state, storage version, and collapse mode.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/resizable-split-pane-runtime.svg" alt="Design a Resizable Split Pane runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing a resizable split pane —
          two (or more) panels separated by a
          draggable divider that the user can drag
          to resize the panes proportionally. The
          component is the workhorse of any IDE-
          like UI: VS Code&rsquo;s sidebar, the
          three-pane layout in email clients,
          dual-pane file managers. The split must
          handle min/max constraints, persistence,
          nested splits (a horizontal split with a
          vertical split inside), keyboard support,
          and accessibility.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems are: smooth drag
          without layout thrash; persisting sizes
          across sessions; nested splits without
          state pollution; keyboard support with
          arrow keys; min/max constraints that
          feel natural; collapsing a pane to zero
          via double-click or button.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users adjust their workspace via
          drag. Power users expect persistence
          (their custom layout reappears on
          return). Engineering teams compose
          panes; runtime handles resize.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Modern browsers; we use Pointer Events,
          CSS Flexbox or Grid for the layout,
          localStorage or server for persistence.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement dashboard layouts
          (separate). We do not implement
          window-management beyond split panes
          (popouts, etc.).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Two or more panes with draggable
          dividers between them. Drag updates
          pane sizes proportionally. Min/max
          per pane. Persistence (localStorage
          or server) keyed by split id.
          Keyboard: focus a divider, arrow
          keys resize. Collapse: double-click
          divider collapses adjacent pane.
          Restore: button or shortcut.
          Horizontal and vertical orientations.
          Nested splits supported.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Snap to predefined sizes (e.g. 25%,
          50%, 75%). Animate collapse/expand.
          Lock divider (prevent resize). Reset
          to default sizes button.
          Visual indicator while dragging.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Movable panes (drag to reorder),
          floating panes, multi-window.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Drag at 60 fps. Pointer-move handler
          minimal work. CSS Flexbox handles
          layout natively.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Persistence across reload. Min/max
          enforcement always honored. Collapse/
          restore symmetric.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Divider is a real
          <code> role=&quot;separator&quot;</code>{" "}
          with{" "}
          <code>aria-valuenow</code>,{" "}
          <code>aria-valuemin/max</code>{" "}
          (percentages). Keyboard control
          announces size changes.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Generic component. Persistence
          adapter pluggable.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The split pane uses CSS Flexbox: a
          container with{" "}
          <code>flex-direction</code> matching
          the split orientation; each pane has
          a <code>flex-basis</code> set as a
          percentage. The divider is a small
          element between panes that captures
          pointer events. Drag updates the
          flex-basis of adjacent panes.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>pointer down</strong> on a
          divider: capture pointer; record
          start position; record initial sizes
          of adjacent panes.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>pointer move</strong>:
          compute delta from start; apply to
          adjacent pane sizes (clamped to
          min/max). Use CSS to update sizes
          (flex-basis). Browser layout
          recalculates; smooth.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>pointer up</strong>: persist
          new sizes to localStorage (or
          server). Release capture.
        </HighlightBlock>
        <p>
          On <strong>double-click</strong> on
          divider: collapse the adjacent pane
          (set its size to 0 or to a
          collapsed-min). Track collapse
          state so a subsequent double-click
          restores.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard</strong>: focus the
          divider via Tab. Arrow keys resize
          (left/up shrinks one pane; right/
          down grows it). Step size
          configurable. Live region announces
          new size.
        </HighlightBlock>
        <p>
          <strong>Min/max constraints</strong>:
          clamp during drag. Visual feedback
          when at min/max (divider can&rsquo;t
          move further).
        </p>
        <p>
          <strong>Persistence</strong>:
          localStorage keyed by a stable id
          per split (e.g.
          <code> split:editor:sidebar</code>).
          Loaded on mount; written on resize
          end.
        </p>
        <p>
          <strong>Nested splits</strong>: a pane
          can contain another split. Each
          split has its own state and id.
          Layout works because Flexbox
          composes naturally.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial"><strong>SplitPane</strong></Highlight> is the
          container. <strong>Pane</strong>{" "}
          renders one <Highlight tier="important">pane.
          <strong> Divider</strong> handles
          drag. <strong>SizePersistence</strong>{" "}</Highlight>
          adapter.
          <strong> KeyboardController</strong>{" "}
          handles arrow keys.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Sizes per <Highlight tier="important">split in component state
          (with persistence).</Highlight> Drag state
          ephemeral.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Inputs:{" "}
          <code>panes</code> (children),
          </Highlight><code> orientation</code>,
          <code> defaultSizes</code>,
          <code> minSizes</code>,
          <code> maxSizes</code>,
          <Highlight tier="important"><code>persistKey</code></Highlight>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CSS Flexbox handles layout natively.
          <Highlight tier="important">Pointer move handler updates
          flex-basis (single</Highlight> style write).
          Browser layout recalculates
          efficiently.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Divider visible on hover (subtle
          line). Cursor changes <Highlight tier="important">to resize on
          hover. Smooth drag.</Highlight> Snap-to-50%
          option for quick equalize. Visual
          indicator during drag.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Divider</Highlight> is{" "}
          <Highlight tier="important">
            <code>role=&quot;separator&quot;</code>
          </Highlight>{" "}
          with proper ARIA values.{" "}
          <Highlight tier="important">Keyboard arrow resize. Live region announces</Highlight>{" "}
          size changes (&ldquo;Sidebar 30%&rdquo;). Focus visible on divider.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          No security surface; <Highlight tier="important">sizes</Highlight> are{" "}
          <Highlight tier="important">presentation only</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag tests. Min/max constraint <Highlight tier="important">tests.
          Persistence load/save tests.
          Keyboard resize</Highlight> tests. Nested split
          tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Container resized smaller than min
          sizes: clamp; some panes may</HighlightBlock>
<HighlightBlock as="p" tier="important">collapse
          temporarily. Persistence corrupted:
          reset to defaults.</HighlightBlock>
<HighlightBlock as="p" tier="important">Nested splits with
          shared id: namespacing prevents
          collision. Drag during animation:
          cancel animation; pointer wins.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic primitive.
          <Highlight tier="important">Used everywhere</Highlight>{" "}
          IDE-like layouts apply.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          ARIA labels via i18n. <Highlight tier="important">Size
          announcements via Intl. RTL flips</Highlight>
          horizontal direction; vertical
          unaffected.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Flexbox vs Grid vs JS layout</h3>
        <HighlightBlock as="p" tier="crucial">
          Flexbox is simplest and natively
          handles flex-basis with constraints.
          Grid is alternative for complex
          layouts. JS layout is overkill for
          this simple case.
        </HighlightBlock>

        <h3>Percentage vs pixel sizes</h3>
        <HighlightBlock as="p" tier="important">
          Percentage works across viewport
          sizes. Pixel is rigid but precise.
          Percentage is the right default;
          pixel is opt-in.
        </HighlightBlock>

        <h3>Persist vs ephemeral</h3>
        <HighlightBlock as="p" tier="important">
          Persist by default for power users
          who customize. Ephemeral for cases
          where size doesn&rsquo;t carry
          across sessions.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Animated resize. Snap to predefined
          <Highlight tier="important">sizes. Cross-device sync of layout.
          Voice</Highlight> control. Touch gestures for
          collapse/expand.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep committed ratios separate from drag projection. Clamp against current container and child constraints.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/resizable-split-pane-recovery.svg" alt="Design a Resizable Split Pane recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Layout ratios are local preferences. Persist after commit and reconcile with current constraints on restore. Scale pressure comes from nested panes, pointer loss, small viewports, dynamic content, zoom, and stale storage. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: ratio projection under dynamic constraints</h3><p>Persist committed ratios rather than pixels. During drag, project against current container size and child minimums, clamp nested panes, update through requestAnimationFrame, and reconcile stored ratios after resize or zoom. Pointer cancellation restores the committed ratio.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, release capture, clamp invalid sizes, batch measurement, restore committed ratios, and collapse predictably.</p><h3>Constraint solving and persisted layout</h3><p>Store ratios for durable preference and derive pixels from the current container. Resolve each drag through a constraint solver that applies minimum, maximum, collapsed, and nested-pane constraints. Measure containers with ResizeObserver and batch projection with requestAnimationFrame. When the viewport shrinks, clamp ratios deterministically and preserve the user's prior preference separately if the product wants to restore it on a larger screen.</p><p>The separator uses role separator, orientation, value metadata, and keyboard increments. Arrow keys resize by a configured step; Home and End may collapse or expand according to product policy. On pointer cancellation, restore the committed ratio and release capture. Debounce persistence after commit rather than writing storage on each move.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed ratios separate from drag projection. Clamp against current container and child constraints.</p><h3>What breaks at scale?</h3><p>nested panes, pointer loss, small viewports, dynamic content, zoom, and stale storage.</p><h3>What consistency applies?</h3><p>Layout ratios are local preferences. Persist after commit and reconcile with current constraints on restore.</p><h3>How do you recover?</h3><p>release capture, clamp invalid sizes, batch measurement, restore committed ratios, and collapse predictably.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}