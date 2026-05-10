"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          Mobile users encounter bottom sheets
          ubiquitously (action sheets, detail
          panels, filters). Engineering teams
          plug in: provide content; runtime
          handles drag and snap.
        </p>

        <h3>Assumptions</h3>
        <p>
          Modern browsers; Pointer Events for
          drag, CSS transforms for movement,
          CSS overscroll-behavior for scroll
          handoff.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement modal dialogs
          (separate Modal component).
          End-to-end animation library; we use
          CSS transitions + JS for spring
          physics on drag.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Top/left/right drawer variants.
          Programmatic snap (open to half,
          etc.). Backdrop blur effect.
          Custom animations. Stack multiple
          sheets. Persistence of last snap.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Replace modal dialogs (Modal
          component handles those).
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Drag at 60 fps via CSS transforms.
          Snap animations smooth. No layout
          thrash.
        </p>

        <h3>Reliability</h3>
        <p>
          Drag never gets stuck. Scroll
          handoff feels native. Dismiss path
          always works.
        </p>

        <h3>Accessibility</h3>
        <p>
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
        </p>

        <h3>Maintainability</h3>
        <p>
          Snap points configurable. Variant
          (bottom, top, left, right) via prop.
          Content slot.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The sheet is a positioned element
          translated by a CSS transform. Snap
          points are configured Y positions
          (or X for side drawers). Drag
          updates the transform; release
          snaps to the nearest snap based on
          velocity and position.
        </p>
        <p>
          On <strong>open</strong>: render the
          sheet. Animate from off-screen to
          the initial snap (typically peek or
          half). Backdrop fades in. Focus
          trap activates if modal.
        </p>
        <p>
          On <strong>drag</strong> on the
          handle (or sheet body when scroll
          is at top): pointer-down captures;
          pointer-move updates the transform.
          On release, compute target snap from
          position and velocity (a fast flick
          carries past midpoint).
        </p>
        <p>
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
        </p>
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
        <p>
          <strong>Focus trap</strong>: same as
          modal. Move focus into sheet on
          open; trap inside; restore on
          close.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/bottom-sheet-drawer-architecture.svg"
        alt="Bottom sheet drawer architecture showing snap states (Hidden, Peek 25%, Half 50%, Full 90%), drag handler logic with pointer events, snap point decision algorithm, and backdrop accessibility"
        caption="Bottom sheet: snap states with translateY values, drag handler pointer event logic, velocity-based snap decisions, and accessibility with focus trap"
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SheetProvider</strong>{" "}
          (optional, for stacked sheets).
          <strong> Sheet</strong> renders the
          panel. <strong>Backdrop</strong>{" "}
          renders the dimmed overlay.
          <strong> DragHandle</strong>{" "}
          captures pointer.
          <strong> SnapController</strong>{" "}
          computes snap target.
          <strong> FocusTrap</strong> handles
          focus while modal.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Open state, current snap state,
          drag state in component state.
          Stacked sheets in a small store.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>open</code>,
          <code> onClose</code>,
          <code> snaps</code> (array of snap
          points as percentage or pixels),
          <code> initialSnap</code>,
          <code> variant</code> (bottom/top/
          left/right),
          <code> modal</code> (true: focus
          trap and backdrop modal; false:
          peek without trap).
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          CSS transforms are GPU-accelerated.
          Pointer move handler minimal.
          Backdrop is a single blur layer.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Visible drag handle at top. Smooth
          snap with physics. Backdrop fades.
          Drag-down dismiss intuitive.
          Reduced motion: snap is instant.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Dialog role with{" "}
          <code>aria-modal</code> appropriate to
          state. Focus trap when modal. Escape
          closes. Snap buttons or keyboard
          alternative for users who can&rsquo;t
          drag. Screen-reader announces open
          and snap state changes.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Content sanitized at render. No
          security surface beyond modal
          patterns.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Drag and snap tests. Scroll handoff
          tests. Focus trap tests. Reduced
          motion tests. Accessibility tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Drag while sheet content is
          scrolled mid-content: scroll content,
          not sheet. Drag at scroll-top:
          sheet drags. Drag below peek:
          dismiss. Modal sheet on small
          viewport: full-height by default.
          Fast flick during snap animation:
          interrupt; new drag wins. Reduced
          motion: snap is instant.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic; works for action sheets,
          detail panels, filters,
          settings pages on mobile.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Drawer variant
          (left/right) flips with RTL.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Snap points vs continuous</h3>
        <p>
          Snap points feel native and
          predictable. Continuous (any
          position) feels free but lacks
          structure. Snap is right for
          content panels.
        </p>

        <h3>Modal vs non-modal peek</h3>
        <p>
          Modal traps focus and backdrops;
          right for full-attention sheets.
          Non-modal peek allows background
          interaction; right for ambient
          sheets (e.g. Apple Maps&rsquo;
          search).
        </p>

        <h3>CSS transform vs JS animation
        library</h3>
        <p>
          CSS transform is simple and
          GPU-accelerated. JS animation
          libraries (Framer Motion, Spring)
          give richer physics. Use CSS for
          basic; library for complex.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Multi-sheet stacking. Custom
          animations per use case. Voice
          control of snap. Adaptive snaps
          based on content size.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. What is scroll
          handoff?</strong> When the sheet
          contains scrollable content,
          dragging within the content
          scrolls until the content reaches
          its top edge; then further drag-
          down moves the sheet itself. CSS
          overscroll-behavior plus position
          tracking implement this.
        </p>

        <p>
          <strong>2. How are snaps
          computed?</strong> On release,
          combine position and velocity. Fast
          flick: nearest snap in flick
          direction. Slow release: nearest
          snap by position.
        </p>

        <p>
          <strong>3. How is focus
          trapped?</strong> When modal, focus
          moves into sheet on open; trap
          inside; restore on close. Same as
          modal pattern.
        </p>

        <p>
          <strong>4. How does dismiss
          work?</strong> Drag below lowest
          snap, backdrop tap, or Escape.
          Animate off-screen, unmount,
          restore focus.
        </p>

        <p>
          <strong>5. How is reduced motion
          respected?</strong>{" "}
          prefers-reduced-motion replaces
          animations with instant
          transitions. CSS handles via
          media query.
        </p>

        <p>
          <strong>6. How is accessibility
          handled?</strong> Dialog role with
          appropriate aria-modal. Focus
          trap when modal. Escape closes.
          Snap buttons as keyboard
          alternative.
        </p>

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
        <p>
          A bottom sheet / drawer is{" "}
          <strong>positioned panel + pointer
          drag with snap physics + scroll
          handoff + focus trap (when
          modal)</strong>. CSS transforms
          drive the smooth movement; CSS
          overscroll-behavior handles the
          scroll handoff; standard modal
          patterns cover focus and
          dismiss. Native-feeling on
          mobile.
        </p>
      </section>
    </ArticleLayout>
  );
}
