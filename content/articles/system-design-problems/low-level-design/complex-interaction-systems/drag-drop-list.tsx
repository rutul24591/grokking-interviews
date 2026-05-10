"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function DragDropListArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          End users reorder content via direct
          manipulation. Power users expect smooth
          drag with keyboard parity. Engineering
          teams provide a list and an onReorder
          handler; the runtime handles drag
          mechanics.
        </p>

        <h3>Assumptions</h3>
        <p>
          Items have stable ids. Items render at
          variable heights. Modern browsers; we
          use Pointer Events (which unify mouse,
          touch, and pen), the FLIP animation
          technique for smooth reorder, and
          IntersectionObserver for visibility
          tracking.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement cross-list
          drag-and-drop (the Kanban Board does
          this on top). We do not implement
          arbitrary canvas-based drag (the
          collaborative whiteboard handles
          that). We do not implement file-drop
          (file input system handles that).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
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
        </p>

        <h3>Out of Scope</h3>
        <p>
          File drag-and-drop into the list,
          cross-document drag, complex spatial
          dragging.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Drag at 60 fps including reorder
          animation. Pointer-move handler under
          a few ms per event. Long lists
          (100+ items) drag smoothly via
          virtualization-aware techniques.
        </p>

        <h3>Reliability</h3>
        <p>
          Optimistic order updates roll back
          on persistence failure. Drag never
          gets into an unrecoverable state
          (Escape always cancels). Touch and
          mouse interactions both reliable.
        </p>

        <h3>Security</h3>
        <p>
          Server enforces per-item permissions
          on reorder. Order updates rate-
          limited at the network layer.
        </p>

        <h3>Accessibility</h3>
        <p>
          Drag has keyboard parity with
          announced state changes. Drag handles
          have descriptive labels.
          Reorder operations announce target
          position. Screen-reader-friendly
          drag mode (announce
          &ldquo;item picked up; arrow keys to
          move; Space to drop&rdquo;).
        </p>

        <h3>Maintainability</h3>
        <p>
          Pointer-event-based; one event
          system handles mouse, touch, and pen.
          Adapter for the persistence backend.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/drag-drop-list-architecture.svg"
        alt="Drag &amp; Drop List Architecture"
        caption="Pointer Events → DragController (computes drop target via item bounding rects) → FLIP animator (smooth sibling shifts) → Optimistic reorder → Persistence callback. Keyboard mode parallels: Space picks up, arrows move, Space drops."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
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
        </p>
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
        <p>
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
        </p>
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
        <p>
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
        </p>
        <p>
          <strong>Persistence with optimistic
          UI</strong>: on drop, the new order
          renders immediately. The persistence
          callback ships to the server. On
          success, no further UI change. On
          failure, animate the item back to
          its original position and surface a
          banner. The optimistic flow makes
          drag feel instant.
        </p>
        <p>
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
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SortableList</strong> is the
          container. <strong>SortableItem</strong>{" "}
          renders one item with its drag
          handle. <strong>DragController</strong>{" "}
          handles pointer events, target
          computation. <strong>FlipAnimator</strong>{" "}
          applies the animation technique.
          <strong> KeyboardController</strong>{" "}
          handles keyboard mode.
          <strong> AutoScroller</strong>{" "}
          handles edge-scroll.
          <strong> PersistenceAdapter</strong>{" "}
          for the onReorder callback.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          List order in external store.
          During drag, an ephemeral order
          (optimistic) overrides the
          committed order. On drop or cancel,
          the ephemeral resolves to committed
          or original.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>items</code> (with stable ids),
          <code> renderItem</code>,
          <code> onReorder(newOrder)</code>,
          optional{" "}
          <code>direction</code> (vertical/
          horizontal), <code>handle</code>{" "}
          (selector for drag handle).
          onReorder returns a Promise; rejection
          rolls back.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          CSS transform for the dragged item
          (GPU-accelerated). FLIP animation
          for siblings (also GPU-accelerated).
          Cached bounding rects to avoid
          per-pointer-move layout thrash.
          Pointer move handler under a few ms.
          Auto-scroll runs in RAF.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Dragged item slightly elevated and
          semi-transparent. Drop indicator
          (subtle line or highlight) shows
          where the item will land. Smooth
          sibling shifts. Auto-scroll feels
          natural. Cancel-on-Escape returns
          item to origin gracefully.
          Keyboard mode visually distinguished.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Drag handle has descriptive label
          (&ldquo;Drag to reorder Item
          [Name]&rdquo;). Keyboard mode
          announces state changes via polite
          live region. Items have
          <code> aria-grabbed</code> (legacy)
          or instructions in tooltips. Drop
          target announces. Screen-reader-
          friendly Drag mode announcements:
          on pickup, on move (with
          target position), on drop, on
          cancel.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server enforces per-item
          permissions. Reorder requests
          authenticated. Rate-limited.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for drop-target
          computation given pointer
          position. FLIP animation tests
          (positions before and after).
          Integration tests with simulated
          pointers: drag, drop, cancel.
          Keyboard mode tests. Failure
          rollback tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Pointer leaves the window during
          drag: pointer capture keeps events
          flowing. List virtualized with
          drag mid-list and drop target off-
          screen: auto-scroll brings target
          into view. List re-renders during
          drag (e.g. a new item arrives via
          real-time): pause drag or
          gracefully apply (depending on
          policy). Rapid drops: queue
          persistence calls; if a later one
          supersedes an earlier, cancel the
          earlier. Single item list: drag is
          a no-op. Item with content that
          captures pointer events
          (e.g. nested input): drag handle
          isolates from interactive content.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over item shape. Direction
          configurable. Handle selector
          customizable. Pattern reuses for
          to-do lists, playlists, ordered
          checklists.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Drag handle label and keyboard mode
          announcements via i18n. Position
          announcements via Intl. RTL flips
          horizontal direction; vertical
          drag unaffected.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Pointer Events vs separate mouse/touch</h3>
        <p>
          Pointer Events unify mouse, touch,
          pen. Separate handlers double the
          code. Pointer is the right default.
        </p>

        <h3>FLIP vs JS-driven animation</h3>
        <p>
          FLIP is GPU-accelerated and smooth.
          JS-driven (animating top/left)
          causes layout thrash. FLIP wins.
        </p>

        <h3>HTML5 drag-and-drop API vs custom
        pointer drag</h3>
        <p>
          HTML5 API has accessibility and
          UX limitations (image-based drag
          preview, awkward events). Custom
          pointer drag gives full control
          and works on touch. Custom is
          right for any sortable list.
        </p>

        <h3>Optimistic vs confirmed-first</h3>
        <p>
          Optimistic feels instant; rollback
          handles failures. Confirmed-first
          feels slow. Optimistic is the right
          default.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Multi-select drag. Cross-list drag
          via shared context (used by Kanban
          Board). Magnetic snap to specific
          positions. Voice control of
          reorder. AI-suggested ordering.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why custom drag instead of
          HTML5 drag-and-drop?</strong> HTML5
          API is awkward and accessibility-
          limited. Custom Pointer Events
          unify mouse and touch with full
          control over visuals and a11y.
        </p>

        <p>
          <strong>2. How does FLIP work?</strong>{" "}
          First (record positions), Last
          (apply change), Invert (compute
          deltas, apply inverse transforms
          to make items appear in original
          positions), Play (animate transforms
          to zero). GPU-accelerated.
        </p>

        <p>
          <strong>3. How do you keyboard-
          drag?</strong> Focus handle, Space
          to pick up, arrows to move, Space
          to drop. Live region announces.
          Parallel state machine to mouse
          mode.
        </p>

        <p>
          <strong>4. How does auto-scroll
          work?</strong> When pointer is
          within ~50 px of edge, scroll list
          with velocity proportional to
          proximity. RAF-driven.
        </p>

        <p>
          <strong>5. How is optimistic update
          implemented?</strong> Apply new
          order locally on drop. Persist via
          callback. On rejection, animate
          item back to original and surface
          banner.
        </p>

        <p>
          <strong>6. How do you handle variable
          heights?</strong> Cache bounding
          rects on drag start (update via
          ResizeObserver if needed). Drop
          target computation uses cache,
          avoiding per-pointer-move layout
          thrash.
        </p>

        <p>
          <strong>7. How do you handle long
          lists?</strong> Virtualization-
          compatible drag: virtualizer keeps
          list smooth; auto-scroll brings
          off-screen targets into view; drop
          calculation uses cached rects of
          mounted items plus extrapolation
          for unmounted ones near the
          target.
        </p>

        <p>
          <strong>8. How is touch
          handled?</strong> Pointer Events
          unify touch and mouse. Prevent
          default on touch-start when
          dragging from a handle to inhibit
          page scroll.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A drag-and-drop list is{" "}
          <strong>Pointer Events + FLIP
          animation + keyboard parallel mode +
          optimistic persistence</strong>.
          Cached bounding rects keep
          pointer-move cheap; FLIP gives
          smooth sibling shifts; keyboard
          mode gives accessibility parity.
          The result is direct manipulation
          that feels native on every input
          method.
        </p>
      </section>
    </ArticleLayout>
  );
}
