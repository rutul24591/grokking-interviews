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

export default function ResizableSplitPaneArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>Functional Requirements</h2>

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
        <h2>Non-Functional Requirements</h2>

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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/resizable-split-pane-architecture.svg"
        alt="Resizable Split Pane Architecture"
        caption="Pane container with CSS Flexbox → Divider with pointer drag → Per-pane size in flex-basis (with min/max) → Persistence (localStorage). Keyboard: focus divider, arrow keys resize. Double-click to collapse."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Sizes per <Highlight tier="important">split in component state
          (with persistence).</Highlight> Drag state
          ephemeral.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CSS Flexbox handles layout natively.
          <Highlight tier="important">Pointer move handler updates
          flex-basis (single</Highlight> style write).
          Browser layout recalculates
          efficiently.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Divider visible on hover (subtle
          line). Cursor changes <Highlight tier="important">to resize on
          hover. Smooth drag.</Highlight> Snap-to-50%
          option for quick equalize. Visual
          indicator during drag.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
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
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          No security surface; <Highlight tier="important">sizes</Highlight> are{" "}
          <Highlight tier="important">presentation only</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag tests. Min/max constraint <Highlight tier="important">tests.
          Persistence load/save tests.
          Keyboard resize</Highlight> tests. Nested split
          tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
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
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic primitive.
          <Highlight tier="important">Used everywhere</Highlight>{" "}
          IDE-like layouts apply.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          ARIA labels via i18n. <Highlight tier="important">Size
          announcements via Intl. RTL flips</Highlight>
          horizontal direction; vertical
          unaffected.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Animated resize. Snap to predefined
          <Highlight tier="important">sizes. Cross-device sync of layout.
          Voice</Highlight> control. Touch gestures for
          collapse/expand.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How does the resize
          work?</strong> Pointer drag updates
          flex-basis on adjacent panes. CSS
          Flexbox handles layout.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How are constraints
          enforced?</strong> Clamp delta
          during pointer move. Visual
          feedback at min/max.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How is persistence
          handled?</strong> localStorage keyed
          by split id. Loaded on mount;
          written on resize end.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How does keyboard work?</strong>{" "}
          Focus divider; arrow keys resize.
          Live region announces.
        </HighlightBlock>

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

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How is this
          accessible?</strong> Separator
          role with ARIA values; keyboard
          control; live region.
        </HighlightBlock>

        <p>
          <strong>8. Why CSS Flexbox?</strong>{" "}
          Native layout, fast, supports
          flex-basis with min/max. Simpler
          than JS layout.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">A resizable split pane is{" "}
          <strong>Flexbox layout + pointer-
          drag divider + min/max constraints +
          localStorage persistence + keyboard
          control</strong>.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Native browser
          layout handles the heavy lifting;
          we coordinate drag and persistence.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
