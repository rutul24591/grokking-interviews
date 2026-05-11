"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-bottom-sheet-drawer",
  title: "Design a Bottom Sheet / Drawer",
  description:
    "LLD for bottom sheets and drawers: snap points, drag-to-dismiss, focus trap, scroll handoff, accessibility, and integration with content.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "bottom-sheet-drawer",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-05-04",
  tags: ["lld", "bottom-sheet", "drawer", "modal", "react", "accessibility"],
  relatedTopics: [
    "modal-component",
    "carousel-slider",
    "drag-drop-list",
  ],
};

export default function BottomSheetDrawerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a bottom sheet (mobile-
          first) and drawer (typically side, can
          be top/bottom/left/right) — the
          slide-up panel pattern from iOS / Apple
          Maps and the side panel pattern from
          chat apps. The component shows
          contextual content above the main
          screen, draggable to multiple snap
          points (peek, half, full), dismissible
          by drag-down or backdrop tap, with
          proper focus trap and scroll handoff
          (the sheet&rsquo;s content scrolls when
          at full height; otherwise drag dismisses).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: snap points with
          smooth physics (drag past a midpoint
          snaps to the next position); scroll
          handoff (when the sheet content has its
          own scroll, dragging within scroll
          area must scroll content not the sheet
          unless at the top); focus trap that
          works with the dismissible nature;
          accessibility for the modal-like
          behavior.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Mobile users encounter bottom sheets
          ubiquitously (action sheets, detail
          panels, filters). Engineering teams
          plug in: provide content; runtime
          handles drag and snap.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Modern browsers; Pointer Events for
          drag, CSS transforms for movement,
          CSS overscroll-behavior for scroll
          handoff.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement modal dialogs
          (separate Modal component).
          End-to-end animation library; we use
          CSS transitions + JS for spring
          physics on drag.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Sheet slides up from bottom (or in
          from a side). Snap points: full-
          height, half-height, peek (or
          configurable). Drag handle at top to
          move between snaps. Drag-down past
          peek dismisses. Backdrop tap
          dismisses. Escape key dismisses.
          Focus trap while open. Scroll handoff:
          sheet content scrolls when at full
          height; otherwise drag moves sheet.
          Smooth spring animation between
          snaps.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Top/left/right drawer variants.
          Programmatic snap (open to half,
          etc.). Backdrop blur effect.
          Custom animations. Stack multiple
          sheets. Persistence of last snap.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Replace modal dialogs (Modal
          component handles those).
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Drag at 60 fps via CSS transforms.
          Snap animations smooth. No layout
          thrash.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Drag never gets stuck. Scroll
          handoff feels native. Dismiss path
          always works.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Sheet uses{" "}
          <code>role=&quot;dialog&quot;</code> with
          <code> aria-modal=&quot;true&quot;</code>{" "}
          when full-height, or
          <code> aria-modal=&quot;false&quot;</code>{" "}
          for peek (allowing background
          interaction). Focus trap when
          modal. Escape closes. Keyboard
          alternative to drag (e.g. snap
          buttons).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Snap points configurable. Variant
          (bottom, top, left, right) via prop.
          Content slot.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="important">
          The sheet is a positioned element
          translated by a CSS transform. Snap
          points are configured Y positions
          (or X for side drawers). Drag
          updates the transform; release
          snaps to the nearest snap based on
          velocity and position.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>open</strong>: render the
          sheet. Animate from off-screen to
          the initial snap (typically peek or
          half). Backdrop fades in. Focus
          trap activates if modal.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>drag</strong> on the
          handle (or sheet body when scroll
          is at top): pointer-down captures;
          pointer-move updates the transform.
          On release, compute target snap from
          position and velocity (a fast flick
          carries past midpoint).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Scroll handoff</strong>: when
          the sheet contains a scrollable area,
          we use CSS{" "}
          <code>overscroll-behavior: contain</code>{" "}
          to prevent the page from scrolling
          when the sheet content reaches its
          edge. We also track scroll position:
          when the inner scroll is at top and
          the user drags down, the drag moves
          the sheet (not scrolls content).
          When scroll is mid-content, drag
          scrolls content. This handoff is
          subtle but expected from native iOS.
        </HighlightBlock>
        <p>
          <strong>Snap physics</strong>: on
          release, compute target. If pointer
          velocity is high (e.g. fast flick
          down), target is the nearest snap
          in that direction. If velocity is
          low, target is whichever snap the
          current position is closest to. CSS
          transition with cubic-bezier ease
          gives smooth physics.
        </p>
        <p>
          <strong>Dismiss</strong>: drag below
          the lowest snap (or peek)
          dismisses. Backdrop tap dismisses.
          Escape dismisses. On dismiss,
          animate off-screen, then unmount.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Focus trap</strong>: same as
          modal. Move focus into sheet on
          open; trap inside; restore on
          close.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/bottom-sheet-drawer-architecture.svg"
        alt="Bottom sheet drawer architecture showing snap states (Hidden, Peek 25%, Half 50%, Full 90%), drag handler logic with pointer events, snap point decision algorithm, and backdrop accessibility"
        caption="Bottom sheet: snap states with translateY values, drag handler pointer event logic, velocity-based snap decisions, and accessibility with focus trap"
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong>SheetProvider</strong>{" "}
          (optional, for stacked sheets).
          <strong> Sheet</strong> renders the
          panel. <strong>Backdrop</strong>{" "}
          renders the dimmed overlay.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> DragHandle</strong></Highlight>{" "}
          captures pointer.
          <strong> SnapController</strong>{" "}
          computes snap target.
          <strong> FocusTrap</strong> handles
          focus while modal.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Open state, current snap state,
          <Highlight tier="important">drag state in component state.
          Stacked</Highlight> sheets in a small store.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Inputs:{" "}
          <code>open</code>,
          </Highlight><code> onClose</code>,
          <code> snaps</code> (array of snap
          points as percentage or <Highlight tier="important">pixels),
          <code> initialSnap</code>,
          <code> variant</code> (bottom/top/
          left/right),
          <code> modal</code></Highlight> (true: focus
          trap and backdrop modal; false:
          peek without trap).
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CSS transforms are GPU-accelerated.
          <Highlight tier="important">Pointer move handler minimal.
          Backdrop is</Highlight> a single blur layer.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Visible drag handle at top. Smooth
          <Highlight tier="important">snap with physics. Backdrop fades.
          Drag-down</Highlight> dismiss intuitive.
          Reduced motion: snap is instant.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Dialog role</Highlight> with{" "}
          <Highlight tier="important">
            <code>aria-modal</code>
          </Highlight>{" "}
          appropriate to state. Focus trap when modal.{" "}
          <Highlight tier="important">Escape closes. Snap buttons or keyboard</Highlight>{" "}
          alternative for users who can&rsquo;t drag. Screen-reader announces open
          and snap state changes.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Content sanitized <Highlight tier="important">at render. No
          security surface beyond</Highlight> modal
          patterns.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag and snap tests. <Highlight tier="important">Scroll handoff
          tests. Focus trap tests.</Highlight> Reduced
          motion tests. Accessibility tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Modal sheet on small
          viewport: full-height by default.
          Fast flick during</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">snap animation:
          interrupt; new drag wins. Reduced
          motion: snap is instant.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic; works for <Highlight tier="important">action sheets,
          detail panels, filters,
          settings</Highlight> pages on mobile.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings <Highlight tier="important">via i18n. Drawer variant
          (left/right) flips</Highlight> with RTL.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Snap points vs continuous</h3>
        <HighlightBlock as="p" tier="important">
          Snap points feel native and
          predictable. Continuous (any
          position) feels free but lacks
          structure. Snap is right for
          content panels.
        </HighlightBlock>

        <h3>Modal vs non-modal peek</h3>
        <HighlightBlock as="p" tier="crucial">
          Modal traps focus and backdrops;
          right for full-attention sheets.
          Non-modal peek allows background
          interaction; right for ambient
          sheets (e.g. Apple Maps&rsquo;
          search).
        </HighlightBlock>

        <h3>CSS transform vs JS animation
        library</h3>
        <HighlightBlock as="p" tier="important">
          CSS transform is simple and
          GPU-accelerated. JS animation
          libraries (Framer Motion, Spring)
          give richer physics. Use CSS for
          basic; library for complex.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Multi-sheet stacking. Custom
          animations per <Highlight tier="important">use case. Voice
          control of snap.</Highlight> Adaptive snaps
          based on content size.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. What is scroll
          handoff?</strong> When the sheet
          contains scrollable content,
          dragging within the content
          scrolls until the content reaches
          its top edge; then further drag-
          down moves the sheet itself. CSS
          overscroll-behavior plus position
          tracking implement this.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How are snaps
          computed?</strong> On release,
          combine position and velocity. Fast
          flick: nearest snap in flick
          direction. Slow release: nearest
          snap by position.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How is focus
          trapped?</strong> When modal, focus
          moves into sheet on open; trap
          inside; restore on close. Same as
          modal pattern.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How does dismiss
          work?</strong> Drag below lowest
          snap, backdrop tap, or Escape.
          Animate off-screen, unmount,
          restore focus.
        </HighlightBlock>

        <p>
          <strong>5. How is reduced motion
          respected?</strong>{" "}
          prefers-reduced-motion replaces
          animations with instant
          transitions. CSS handles via
          media query.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>6. How is accessibility
          handled?</strong> Dialog role with
          appropriate aria-modal. Focus
          trap when modal. Escape closes.
          Snap buttons as keyboard
          alternative.
        </HighlightBlock>

        <p>
          <strong>7. How does this differ
          from a Modal?</strong> Bottom sheet
          is mobile-native, draggable,
          multiple snaps. Modal is full-
          screen-overlay, click-only,
          single state.
        </p>

        <p>
          <strong>8. How are stacked sheets
          handled?</strong> Sheet provider
          tracks the stack. Each pushes
          on top with its own backdrop.
          Dismiss pops one at a time.
          Escape dismisses topmost.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">CSS transforms
          drive the smooth movement; CSS
          overscroll-behavior handles the
          scroll</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">handoff; standard modal
          patterns cover focus and
          dismiss. Native-feeling on
          mobile.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
