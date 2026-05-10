"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function ResizableSplitPaneArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
          The hard problems are: smooth drag
          without layout thrash; persisting sizes
          across sessions; nested splits without
          state pollution; keyboard support with
          arrow keys; min/max constraints that
          feel natural; collapsing a pane to zero
          via double-click or button.
        </p>

        <h3>User Context</h3>
        <p>
          End users adjust their workspace via
          drag. Power users expect persistence
          (their custom layout reappears on
          return). Engineering teams compose
          panes; runtime handles resize.
        </p>

        <h3>Assumptions</h3>
        <p>
          Modern browsers; we use Pointer Events,
          CSS Flexbox or Grid for the layout,
          localStorage or server for persistence.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement dashboard layouts
          (separate). We do not implement
          window-management beyond split panes
          (popouts, etc.).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Snap to predefined sizes (e.g. 25%,
          50%, 75%). Animate collapse/expand.
          Lock divider (prevent resize). Reset
          to default sizes button.
          Visual indicator while dragging.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Movable panes (drag to reorder),
          floating panes, multi-window.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Drag at 60 fps. Pointer-move handler
          minimal work. CSS Flexbox handles
          layout natively.
        </p>

        <h3>Reliability</h3>
        <p>
          Persistence across reload. Min/max
          enforcement always honored. Collapse/
          restore symmetric.
        </p>

        <h3>Accessibility</h3>
        <p>
          Divider is a real
          <code> role=&quot;separator&quot;</code>{" "}
          with{" "}
          <code>aria-valuenow</code>,{" "}
          <code>aria-valuemin/max</code>{" "}
          (percentages). Keyboard control
          announces size changes.
        </p>

        <h3>Maintainability</h3>
        <p>
          Generic component. Persistence
          adapter pluggable.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/resizable-split-pane-architecture.svg"
        alt="Resizable Split Pane Architecture"
        caption="Pane container with CSS Flexbox → Divider with pointer drag → Per-pane size in flex-basis (with min/max) → Persistence (localStorage). Keyboard: focus divider, arrow keys resize. Double-click to collapse."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The split pane uses CSS Flexbox: a
          container with{" "}
          <code>flex-direction</code> matching
          the split orientation; each pane has
          a <code>flex-basis</code> set as a
          percentage. The divider is a small
          element between panes that captures
          pointer events. Drag updates the
          flex-basis of adjacent panes.
        </p>
        <p>
          On <strong>pointer down</strong> on a
          divider: capture pointer; record
          start position; record initial sizes
          of adjacent panes.
        </p>
        <p>
          On <strong>pointer move</strong>:
          compute delta from start; apply to
          adjacent pane sizes (clamped to
          min/max). Use CSS to update sizes
          (flex-basis). Browser layout
          recalculates; smooth.
        </p>
        <p>
          On <strong>pointer up</strong>: persist
          new sizes to localStorage (or
          server). Release capture.
        </p>
        <p>
          On <strong>double-click</strong> on
          divider: collapse the adjacent pane
          (set its size to 0 or to a
          collapsed-min). Track collapse
          state so a subsequent double-click
          restores.
        </p>
        <p>
          <strong>Keyboard</strong>: focus the
          divider via Tab. Arrow keys resize
          (left/up shrinks one pane; right/
          down grows it). Step size
          configurable. Live region announces
          new size.
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SplitPane</strong> is the
          container. <strong>Pane</strong>{" "}
          renders one pane.
          <strong> Divider</strong> handles
          drag. <strong>SizePersistence</strong>{" "}
          adapter.
          <strong> KeyboardController</strong>{" "}
          handles arrow keys.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Sizes per split in component state
          (with persistence). Drag state
          ephemeral.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>panes</code> (children),
          <code> orientation</code>,
          <code> defaultSizes</code>,
          <code> minSizes</code>,
          <code> maxSizes</code>,
          <code> persistKey</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          CSS Flexbox handles layout natively.
          Pointer move handler updates
          flex-basis (single style write).
          Browser layout recalculates
          efficiently.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Divider visible on hover (subtle
          line). Cursor changes to resize on
          hover. Smooth drag. Snap-to-50%
          option for quick equalize. Visual
          indicator during drag.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Divider is{" "}
          <code>role=&quot;separator&quot;</code>{" "}
          with proper ARIA values.
          Keyboard arrow resize. Live region
          announces size changes
          (&ldquo;Sidebar 30%&rdquo;).
          Focus visible on divider.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          No security surface; sizes are
          presentation only.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Drag tests. Min/max constraint tests.
          Persistence load/save tests.
          Keyboard resize tests. Nested split
          tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Container resized smaller than min
          sizes: clamp; some panes may collapse
          temporarily. Persistence corrupted:
          reset to defaults. Nested splits with
          shared id: namespacing prevents
          collision. Drag during animation:
          cancel animation; pointer wins.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic primitive. Used everywhere
          IDE-like layouts apply.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          ARIA labels via i18n. Size
          announcements via Intl. RTL flips
          horizontal direction; vertical
          unaffected.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Flexbox vs Grid vs JS layout</h3>
        <p>
          Flexbox is simplest and natively
          handles flex-basis with constraints.
          Grid is alternative for complex
          layouts. JS layout is overkill for
          this simple case.
        </p>

        <h3>Percentage vs pixel sizes</h3>
        <p>
          Percentage works across viewport
          sizes. Pixel is rigid but precise.
          Percentage is the right default;
          pixel is opt-in.
        </p>

        <h3>Persist vs ephemeral</h3>
        <p>
          Persist by default for power users
          who customize. Ephemeral for cases
          where size doesn&rsquo;t carry
          across sessions.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Animated resize. Snap to predefined
          sizes. Cross-device sync of layout.
          Voice control. Touch gestures for
          collapse/expand.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does the resize
          work?</strong> Pointer drag updates
          flex-basis on adjacent panes. CSS
          Flexbox handles layout.
        </p>

        <p>
          <strong>2. How are constraints
          enforced?</strong> Clamp delta
          during pointer move. Visual
          feedback at min/max.
        </p>

        <p>
          <strong>3. How is persistence
          handled?</strong> localStorage keyed
          by split id. Loaded on mount;
          written on resize end.
        </p>

        <p>
          <strong>4. How does keyboard work?</strong>{" "}
          Focus divider; arrow keys resize.
          Live region announces.
        </p>

        <p>
          <strong>5. How does collapse
          work?</strong> Double-click
          divider; pane collapses to 0.
          Subsequent double-click restores.
        </p>

        <p>
          <strong>6. How are nested splits
          handled?</strong> Each split has
          its own state and id; layout
          composes naturally via Flexbox.
        </p>

        <p>
          <strong>7. How is this
          accessible?</strong> Separator
          role with ARIA values; keyboard
          control; live region.
        </p>

        <p>
          <strong>8. Why CSS Flexbox?</strong>{" "}
          Native layout, fast, supports
          flex-basis with min/max. Simpler
          than JS layout.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A resizable split pane is{" "}
          <strong>Flexbox layout + pointer-
          drag divider + min/max constraints +
          localStorage persistence + keyboard
          control</strong>. Native browser
          layout handles the heavy lifting;
          we coordinate drag and persistence.
        </p>
      </section>
    </ArticleLayout>
  );
}
