"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-drag-drop-list",
  title: "Design a Drag &amp; Drop List",
  description:
    "LLD for a drag-and-drop sortable list: pointer-driven drag, smooth reorder animation, keyboard accessibility, drop target detection, and persistence.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "drag-drop-list",
  wordCount: 6300,
  readingTime: 33,
  lastUpdated: "2026-05-04",
  tags: ["lld", "drag-and-drop", "sortable", "react", "accessibility"],
  relatedTopics: [
    "kanban-board",
    "tree-view-folder-explorer",
    "dashboard-builder",
  ],
};

export default function DragDropListArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Drag-and-Drop List</h1><h2>Definition &amp; Context</h2><p>Design a Drag-and-Drop List is an implementation-heavy interaction design covering gesture activation, keyboard lifting, collision measurement, auto-scroll, transient reorder projection, versioned persistence, and rollback. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep committed order separate from projected drop order. Persist validated destinations using stable ids and position keys. Core structures: ordered ids, drag session, source id, projected index, item rectangles, scroll container, auto-scroll velocity, mutation id, and version.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/drag-drop-list-runtime.svg" alt="Design a Drag-and-Drop List runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a drag-and-drop list — a
          sortable list where users can grab any
          item and drag it to a new position. Items
          smoothly animate as the dragged item
          passes them; on drop, the order updates
          and persists. The component is the core
          primitive behind to-do lists, playlist
          editors, lesson plan builders, and any UI
          where order matters and users want
          direct manipulation. Done well it feels
          tactile and predictable; done poorly it&rsquo;s
          jittery, breaks accessibility, and loses
          state on failure.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: pointer-driven
          drag that feels native (the dragged
          item follows the cursor with no offset
          drift); detecting which sibling the
          drag is over without thrashing layout;
          smooth reorder animation as siblings
          slide out of the way; keyboard
          alternative (drag is mouse-bound by
          default); persistence with optimistic
          UI; touch support; auto-scroll when
          dragging near edges; and integration
          with the broader app (which list does
          this drag belong to? can items move
          between lists?).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users reorder content via direct
          manipulation. Power users expect smooth
          drag with keyboard parity. Engineering
          teams provide a list and an onReorder
          handler; the runtime handles drag
          mechanics.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Items have stable ids. Items render at
          variable heights. Modern browsers; we
          use Pointer Events (which unify mouse,
          touch, and pen), the FLIP animation
          technique for smooth reorder, and
          IntersectionObserver for visibility
          tracking.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement cross-list
          drag-and-drop (the Kanban Board does
          this on top). We do not implement
          arbitrary canvas-based drag (the
          collaborative whiteboard handles
          that). We do not implement file-drop
          (file input system handles that).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Items render in a vertical (or
          horizontal) list. Pointer-down on an
          item or its drag handle initiates
          drag. While dragging, the item follows
          the pointer; siblings smoothly shift
          out of the way to indicate the drop
          position. On pointer-up, the order
          commits. Persistence via an onReorder
          callback. Keyboard alternative: focus
          a handle, Space to pick up, arrow
          keys to move, Space again to drop.
          Auto-scroll the list when dragging
          near top/bottom edges. Cancel via
          Escape (revert to original position).
          Visual indication of the dragged item
          and the drop target.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Multi-select drag (move several items
          at once). Cross-list drag (move
          between lists). Group/section
          headers that don&rsquo;t move. Drag
          preview customization (e.g. show a
          thumbnail). Snap to specific positions
          (start, end, before/after a marker).
          Undo recent reorder. Animated entry
          and exit for items being added or
          removed during a session.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          File drag-and-drop into the list,
          cross-document drag, complex spatial
          dragging.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Drag at 60 fps including reorder
          animation. Pointer-move handler under
          a few ms per event. Long lists
          (100+ items) drag smoothly via
          virtualization-aware techniques.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Optimistic order updates roll back
          on persistence failure. Drag never
          gets into an unrecoverable state
          (Escape always cancels). Touch and
          mouse interactions both reliable.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Server enforces per-item permissions
          on reorder. Order updates rate-
          limited at the network layer.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Drag has keyboard parity with
          announced state changes. Drag handles
          have descriptive labels.
          Reorder operations announce target
          position. Screen-reader-friendly
          drag mode (announce
          &ldquo;item picked up; arrow keys to
          move; Space to drop&rdquo;).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Pointer-event-based; one event
          system handles mouse, touch, and pen.
          Adapter for the persistence backend.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="crucial">
          The list is built around four parts:
          <strong> Pointer-driven drag controller</strong>{" "}
          (tracks pointer state and computes
          target position),
          <strong> FLIP animation</strong> (smooth
          shifts of siblings out of the way),
          <strong> keyboard mode</strong>{" "}
          (parallel state machine for
          keyboard-driven drag), and
          <strong> persistence pipeline</strong>{" "}
          (optimistic update with rollback on
          server failure).
        </HighlightBlock>
        <p>
          On <strong>pointer down</strong> on an
          item or drag handle: capture pointer
          via <code>setPointerCapture</code> so
          subsequent events route here even
          when the cursor leaves the element.
          Record the initial position. Set
          drag-active state. Render the item
          with a slight elevation effect.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>pointer move</strong>: update
          the dragged item&rsquo;s position
          (via CSS transform — fast, GPU-
          accelerated). Compute drop target by
          finding which sibling the pointer is
          over (binary search across cached
          item bounding rects). If the target
          changed, animate siblings:
          conceptually, the dragged item is
          inserted at the new index; siblings
          between old and new index shift one
          step.
        </HighlightBlock>
        <p>
          The <strong>FLIP technique</strong>{" "}
          (First, Last, Invert, Play) gives
          smooth sibling shifts. First: record
          item positions before the change.
          Last: apply the change (the dragged
          item is now in a new logical
          position; siblings shifted). Invert:
          compute the deltas (each sibling&rsquo;s
          new minus old position) and apply
          inverse transforms so they appear
          to be in their original positions.
          Play: animate the inverse transforms
          to zero, smoothly moving siblings to
          their actual positions. This produces
          a natural, GPU-accelerated reorder
          animation.
        </p>
        <p>
          On <strong>pointer up</strong>: commit
          the new order. Release pointer
          capture. Clear drag state. Trigger
          persistence callback with the new
          ordering.
        </p>
        <p>
          <strong>Auto-scroll</strong>: when the
          pointer is within ~50 px of the
          list&rsquo;s top or bottom edge,
          scroll the list. The scroll velocity
          increases as the pointer gets
          closer to the edge (linear ramp).
          This is essential for long lists
          where the drop target is off-screen.
        </p>
        <p>
          On <strong>Escape</strong> during drag:
          cancel. Animate the dragged item back
          to its original position. Revert any
          optimistic order changes.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Keyboard mode</strong>: focus
          a drag handle, press Space to pick
          up. The item enters keyboard-drag
          mode (visually distinguished, e.g.
          subtle elevation). Arrow keys move
          the item up/down by one position
          each (with FLIP animation). Space
          drops; Escape cancels. Live region
          announces &ldquo;Item picked up&rdquo;,
          &ldquo;Moved to position 3 of 10&rdquo;,
          &ldquo;Dropped at position 5&rdquo;.
          This parallel state machine gives
          full parity with mouse drag.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Persistence with optimistic
          UI</strong>: on drop, the new order
          renders immediately. The persistence
          callback ships to the server. On
          success, no further UI change. On
          failure, animate the item back to
          its original position and surface a
          banner. The optimistic flow makes
          drag feel instant.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Variable-height items</strong>:
          we cache bounding rects on each
          drag start (and update on resize via
          ResizeObserver). The drop target
          calculation uses the cached rects;
          we don&rsquo;t query the DOM during
          pointer-move which would thrash
          layout. Cached rects work because
          items don&rsquo;t change height
          during drag (only positions
          shift).
        </HighlightBlock>
        <p>
          <strong>Touch support</strong>: Pointer
          Events unify touch and mouse. We
          prevent default on touch-start to
          inhibit page scrolling during drag
          (only when the user grabs a handle —
          otherwise scrolling works
          normally).
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>FlipAnimator</strong>{" "}
          applies the animation technique.
          <strong> KeyboardController</strong>{" "}
          handles keyboard mode.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> AutoScroller</strong></Highlight>{" "}
          handles edge-scroll.
          <strong> PersistenceAdapter</strong>{" "}
          for the onReorder callback.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          List order in external store.
          During drag, an ephemeral order
          <Highlight tier="important">(optimistic) overrides the
          committed order. On</Highlight> drop or cancel,
          the ephemeral resolves to committed
          or original.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Inputs:{" "}
          <code>items</code> (with stable ids),
          </Highlight><code> renderItem</code>,
          <code> onReorder(newOrder)</code>,
          optional{" "}
          <code>direction</code> <Highlight tier="important">(vertical/
          horizontal), <code>handle</code>{" "}
          (selector for</Highlight> drag handle).
          onReorder returns a Promise; rejection
          rolls back.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="crucial">Cached bounding rects to avoid
          per-pointer-move layout thrash.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Pointer move handler under a few ms.
          Auto-scroll runs in RAF.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Smooth
          sibling shifts. Auto-scroll feels
          natural. <Highlight tier="important">Cancel-on-Escape</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">returns
          item to origin gracefully.
          Keyboard mode visually distinguished.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Items have
          <code> aria-grabbed</code> (legacy)
          or instructions in tooltips. Drop
          target announces. Screen-reader-</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">friendly Drag mode announcements:
          on pickup, on move (with
          target position), on drop, on
          cancel.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces per-item permissions.
          Reorder requests authenticated. <Highlight tier="important">Rate-limited</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for drop-target
          computation given pointer
          position. FLIP animation tests
          (positions before and after).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Integration tests with simulated
          pointers: drag, drop, cancel.
          Keyboard mode tests. Failure
          rollback tests.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Rapid drops: queue
          persistence calls; if a later one
          supersedes an earlier, cancel the
          earlier. Single item list: drag is</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">a no-op. Item with content that
          captures pointer events
          (e.g. nested input): drag handle
          isolates from interactive content.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over item shape. Direction
          <Highlight tier="important">configurable. Handle selector
          customizable. Pattern reuses</Highlight> for
          to-do lists, playlists, ordered
          checklists.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag handle label and keyboard mode
          announcements <Highlight tier="important">via i18n. Position
          announcements via Intl.</Highlight> RTL flips
          horizontal direction; vertical
          drag unaffected.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Pointer Events vs separate mouse/touch</h3>
        <HighlightBlock as="p" tier="important">
          Pointer Events unify mouse, touch,
          pen. Separate handlers double the
          code. Pointer is the right default.
        </HighlightBlock>

        <h3>FLIP vs JS-driven animation</h3>
        <HighlightBlock as="p" tier="important">
          FLIP is GPU-accelerated and smooth.
          JS-driven (animating top/left)
          causes layout thrash. FLIP wins.
        </HighlightBlock>

        <h3>HTML5 drag-and-drop API vs custom
        pointer drag</h3>
        <HighlightBlock as="p" tier="important">
          HTML5 API has accessibility and
          UX limitations (image-based drag
          preview, awkward events). Custom
          pointer drag gives full control
          and works on touch. Custom is
          right for any sortable list.
        </HighlightBlock>

        <h3>Optimistic vs confirmed-first</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant; rollback
          handles failures. Confirmed-first
          feels slow. Optimistic is the right
          default.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Multi-select drag. Cross-list drag
          via shared context (used <Highlight tier="important">by Kanban
          Board). Magnetic snap to</Highlight> specific
          positions. Voice control of
          reorder. AI-suggested ordering.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep committed order separate from projected drop order. Persist validated destinations using stable ids and position keys.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/drag-drop-list-recovery.svg" alt="Design a Drag-and-Drop List recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Local projection is optimistic. Server version and position acceptance are authoritative. Scale pressure comes from large virtual lists, nested scrolling, touch delays, concurrent reorder, expensive measurement, and permission changes. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: stable-id reorder and rollback</h3><p>Lift a stable item id, measure collision targets in one batch, project order locally, auto-scroll near boundaries, and persist with a list version plus idempotency key. A rejected write restores committed order without losing keyboard focus or announcing a false success.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, cancel on escape or pointer loss, stop auto-scroll, restore committed order, reject invalid membership, and announce rollback.</p><h3>Collision strategy and persistent ordering</h3><p>For short lists, measure row rectangles at lift time and choose the nearest insertion boundary. For virtualized or frequently resizing lists, maintain a measurement cache keyed by stable id and invalidate it when ResizeObserver reports changes. Auto-scroll velocity should depend on pointer distance from the container edge and stop immediately on cancellation. Keyboard dragging uses the same projected order: lift, move, announce destination, drop, or cancel.</p><p>Persist moves using stable ids and a board or list version. Fractional position keys avoid rewriting every row during most moves, but repeated insertion into one gap eventually needs asynchronous rebalancing. Keep that maintenance path separate from the interactive command. On conflict, fetch the current order, restore a coherent committed projection, and explain that the move could not be applied.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed order separate from projected drop order. Persist validated destinations using stable ids and position keys.</p><h3>What breaks at scale?</h3><p>large virtual lists, nested scrolling, touch delays, concurrent reorder, expensive measurement, and permission changes.</p><h3>What consistency applies?</h3><p>Local projection is optimistic. Server version and position acceptance are authoritative.</p><h3>How do you recover?</h3><p>cancel on escape or pointer loss, stop auto-scroll, restore committed order, reject invalid membership, and announce rollback.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}