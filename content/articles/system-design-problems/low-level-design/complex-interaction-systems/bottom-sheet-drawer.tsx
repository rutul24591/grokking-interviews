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

export default function BottomSheetDrawerArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Bottom Sheet Drawer</h1><h2>Definition &amp; Context</h2><p>Design a Bottom Sheet Drawer is an implementation-heavy interaction design covering gesture capture, drag projection, snap points, velocity decisions, focus management, scroll arbitration, keyboard dismissal, and reduced motion. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep committed snap state separate from drag offset and velocity samples. Nested scroll consumes movement before drawer translation. Core structures: snap points, drag session, velocity window, scroll boundary, committed state, focus return, inert scope, animation policy, and cleanup handles.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/bottom-sheet-drawer-runtime.svg" alt="Design a Bottom Sheet Drawer runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

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
        <h3>Functional Requirements</h3>

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
        <h3>Non-Functional Requirements</h3>

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
        <h3>🧠 Solution Approach</h3>
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

      

      <section>
        <h3>🧱 Component Architecture</h3>
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
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Open state, current snap state,
          <Highlight tier="important">drag state in component state.
          Stacked</Highlight> sheets in a small store.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
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
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CSS transforms are GPU-accelerated.
          <Highlight tier="important">Pointer move handler minimal.
          Backdrop is</Highlight> a single blur layer.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Visible drag handle at top. Smooth
          <Highlight tier="important">snap with physics. Backdrop fades.
          Drag-down</Highlight> dismiss intuitive.
          Reduced motion: snap is instant.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
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
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Content sanitized <Highlight tier="important">at render. No
          security surface beyond</Highlight> modal
          patterns.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag and snap tests. <Highlight tier="important">Scroll handoff
          tests. Focus trap tests.</Highlight> Reduced
          motion tests. Accessibility tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Modal sheet on small
          viewport: full-height by default.
          Fast flick during</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">snap animation:
          interrupt; new drag wins. Reduced
          motion: snap is instant.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic; works for <Highlight tier="important">action sheets,
          detail panels, filters,
          settings</Highlight> pages on mobile.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings <Highlight tier="important">via i18n. Drawer variant
          (left/right) flips</Highlight> with RTL.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

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
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Multi-sheet stacking. Custom
          animations per <Highlight tier="important">use case. Voice
          control of snap.</Highlight> Adaptive snaps
          based on content size.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep committed snap state separate from drag offset and velocity samples. Nested scroll consumes movement before drawer translation.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/bottom-sheet-drawer-recovery.svg" alt="Design a Bottom Sheet Drawer recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Drawer state is local interaction truth. Persist only durable preference if product policy requires it. Scale pressure comes from nested scroll, pointer cancellation, rapid gestures, mobile viewport changes, focus traps, and reduced-motion users. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: snap-point projection and scroll arbitration</h3><p>Measure snap points after viewport changes, keep nested scroll consumption ahead of sheet translation, choose the destination from distance plus release velocity, and restore the committed snap point after pointer cancellation. Focus trapping, inert background content, scroll locking, and reduced-motion animation belong to the same controller.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, release capture, clamp projection, choose snap by velocity and distance, restore focus, unlock scroll, and cancel animation safely.</p><h3>Geometry policy and browser integration</h3><p>Represent snap points as resolved pixel offsets derived from viewport height, safe-area insets, content minimums, and product-defined stops. Recompute them through ResizeObserver and visual viewport changes, then map the committed semantic stop such as collapsed, half, or expanded onto the new geometry. During a gesture, consume upward or downward movement in the nested scroll container until it reaches a boundary; only the remaining delta translates the sheet. This avoids the common mobile failure where a scrollable sheet fights its own content.</p><p>Prefer transform-based projection during drag because it avoids layout work. Commit the semantic snap state after release and animate from the projected transform. For modal sheets, move focus into the sheet, make the background inert, return focus on close, and expose an Escape path. Under reduced motion, jump or shorten motion without removing the visible state transition.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed snap state separate from drag offset and velocity samples. Nested scroll consumes movement before drawer translation.</p><h3>What breaks at scale?</h3><p>nested scroll, pointer cancellation, rapid gestures, mobile viewport changes, focus traps, and reduced-motion users.</p><h3>What consistency applies?</h3><p>Drawer state is local interaction truth. Persist only durable preference if product policy requires it.</p><h3>How do you recover?</h3><p>release capture, clamp projection, choose snap by velocity and distance, restore focus, unlock scroll, and cancel animation safely.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}