"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-drag-drop-list",
  title: "Design a Drag & Drop List with Reordering and Accessibility",
  description:
    "Complete LLD solution for a production-grade drag-and-drop list with reordering, multi-column support, touch/keyboard accessibility, FLIP animations, optimistic updates, and screen reader announcements.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "drag-drop-list",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "drag-and-drop",
    "reordering",
    "accessibility",
    "flipp-animation",
    "pointer-events",
    "state-management",
  ],
  relatedTopics: [
    "virtual-scrolling",
    "infinite-scroll-pagination",
    "component-level-ui-patterns",
    "optimistic-ui-updates",
  ],
};

export default function DragDropListArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable drag-and-drop list component for a large-scale
          React application. Users must be able to reorder items within a list via drag
          and drop, with changes persisted to a backend API. The component must support
          multi-column scenarios (Kanban-style boards where items move between columns),
          work on both desktop (mouse) and mobile (touch), and meet full accessibility
          requirements including keyboard navigation and screen reader announcements.
          Visual feedback during drag operations — such as a drag handle, drop indicator
          line, placeholder, and ghost image — must be clear and instantaneous. The
          component must also handle nested lists (drag between nested groups) and
          implement optimistic reordering with rollback on API failure.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Lists can contain 10 to 10,000+ items. Performance must remain smooth at
            scale.
          </li>
          <li>
            Reorder operations must be persisted to a backend API with optimistic UI
            updates.
          </li>
          <li>
            The component supports both single-column reordering and multi-column
            (Kanban-style) drag-and-drop.
          </li>
          <li>
            Touch devices must support long-press to initiate drag (to distinguish from
            scroll).
          </li>
          <li>
            Keyboard users must be able to fully operate drag-and-drop without a mouse.
          </li>
          <li>
            Screen readers must announce position changes and drop confirmations.
          </li>
          <li>
            Animated transitions use the FLIP technique for smooth 60fps reordering.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Drag Initiation:</strong> Users can grab an item via its drag handle
            or the entire item surface and begin dragging.
          </li>
          <li>
            <strong>Visual Feedback:</strong> During drag, the original item shows a
            placeholder, a floating ghost clone follows the pointer, and a drop indicator
            line shows the target insertion point.
          </li>
          <li>
            <strong>Reordering:</strong> Dropping an item at a new position reorders the
            list. The new order is persisted to a backend API.
          </li>
          <li>
            <strong>Multi-Column Support:</strong> Items can be dragged between columns
            (Kanban-style). Each column is a drop target.
          </li>
          <li>
            <strong>Touch Support:</strong> Pointer events handle both mouse and touch.
            Long-press (300ms) initiates drag on touch devices to avoid conflict with
            scroll.
          </li>
          <li>
            <strong>Keyboard Accessibility:</strong> Focus an item, press Space to pick
            up, Arrow keys to move, Enter to drop, Escape to cancel.
          </li>
          <li>
            <strong>Screen Reader Announcements:</strong> On pick up: &quot;Item picked,
            position X of Y.&quot; On move: &quot;Moved to position X.&quot; On drop:
            &quot;Item dropped at position Y.&quot;
          </li>
          <li>
            <strong>Animated Transitions:</strong> FLIP animation technique for smooth
            spring-based reordering of items when positions shift.
          </li>
          <li>
            <strong>Nested Lists:</strong> Support drag between nested groups (e.g.,
            epics containing stories containing tasks).
          </li>
          <li>
            <strong>Optimistic Reorder:</strong> Update UI instantly on drop. If API
            call fails, rollback to previous order and show error toast.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Drag operations must run at 60fps. Use
            GPU-accelerated properties (transform, opacity). No layout thrashing during
            drag.
          </li>
          <li>
            <strong>Scalability:</strong> Handle lists of 10,000+ items. Virtualize
            rendering if needed. Collision detection must be O(log n) or better.
          </li>
          <li>
            <strong>Reliability:</strong> Optimistic updates must always have a rollback
            path. No data loss on API failure.
          </li>
          <li>
            <strong>Accessibility:</strong> WCAG 2.1 AA compliant. Full keyboard
            support, screen reader announcements via aria-live regions, visible focus
            indicators.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for drag state, drop
            targets, item types, and configuration.
          </li>
          <li>
            <strong>Cross-browser:</strong> Works on Chrome, Firefox, Safari, Edge.
            Pointer events polyfill not needed (React 19+ normalizes pointer events).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User drags an item and then quickly navigates away — drag state must be
            cleaned up on unmount.
          </li>
          <li>
            Drop target list is empty — dropping should insert as first item.
          </li>
          <li>
            User drags item to the same position — no-op, no API call.
          </li>
          <li>
            API failure during reorder — rollback to previous state, show error, allow
            retry.
          </li>
          <li>
            Rapid consecutive drops — queue reorder requests, prevent race conditions.
          </li>
          <li>
            Item is removed from backend while being dragged — handle gracefully.
          </li>
          <li>
            Touch device: user starts drag but decides to cancel — drag should cancel
            if pointer moves outside a movement threshold.
          </li>
          <li>
            Nested lists: dragging an item into its own child group — prevent circular
            nesting.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>drag state management</strong> from
          <strong>rendering</strong> using a global Zustand store for active drag state
          and custom hooks for individual item behavior. The store tracks which item is
          being dragged, the current drop target, and the reorder history (for rollback).
          Each draggable item uses a hook that combines pointer event handling (for
          mouse/touch) and keyboard event handling for accessibility. Drop targets use
          a separate hook with collision detection based on pointer position relative to
          item bounding boxes.
        </p>
        <p>
          <strong>Drag mechanism choice:</strong> We use Pointer Events instead of the
          HTML5 Drag and Drop API. The HTML5 API has significant limitations: it does not
          support custom drag images on mobile, offers no touch support, provides limited
          styling control over the drag ghost, and has inconsistent cross-browser behavior
          (particularly Safari). Pointer events give us full control over the drag
          lifecycle, work uniformly across mouse and touch, and allow custom ghost
          rendering. However, we provide an HTML5 wrapper as a fallback for environments
          where pointer events are insufficient (e.g., drag from browser into the app).
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HTML5 Drag and Drop API:</strong> Built-in browser support, zero
            custom drag logic. But no touch support, limited ghost customization, no
            custom drop indicators, and inconsistent behavior across browsers. Suitable
            for simple file-upload drag-and-drop, not for list reordering.
          </li>
          <li>
            <strong>Third-party libraries (dnd-kit, react-beautiful-dnd):</strong>
            Production-ready, accessible, well-tested. But they add bundle size (15-30kb
            gzipped), abstract away internals (harder to customize), and may not support
            all edge cases (e.g., deeply nested lists with custom collision detection).
            Building from scratch gives full control and is a better interview
            demonstration.
          </li>
          <li>
            <strong>Mutation Observer + direct DOM manipulation:</strong> Maximum
            performance but bypasses React&apos;s rendering model, creating bugs and
            making testing difficult. Not recommended.
          </li>
        </ul>
        <p>
          <strong>Why Pointer Events + Zustand + FLIP is optimal:</strong> Pointer events
          provide a unified input model for mouse, touch, and pen. Zustand manages drag
          state globally so any component can read active drag info without prop drilling.
          FLIP (First, Last, Invert, Play) enables smooth 60fps reordering animations
          without layout thrashing. This pattern is used by production libraries like
          dnd-kit and Framer Motion.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Drag-Drop Types (<code>drag-drop-types.ts</code>)</h4>
          <p>
            Defines the core type system: <code>DraggableItem</code> (id, data, disabled,
            groupId), <code>DropTarget</code> (itemId, position, columnId),{" "}
            <code>DragState</code> (activeItem, pointer position, dropTarget, isDragging),
            <code>DragConfig</code> (longPressDelay, movementThreshold, animationDuration),
            and the <code>ReorderPayload</code> sent to the API. These types enforce
            type safety across all modules. See the Example tab for the complete type
            definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Drag-Drop Store (<code>drag-drop-store.ts</code>)</h4>
          <p>
            Zustand store managing the global drag state. Tracks the currently dragged
            item, pointer position, active drop target, and reorder history (for rollback).
            Exposes actions: <code>startDrag</code>, <code>updatePointer</code>,{" "}
            <code>setDropTarget</code>, <code>endDrag</code>, <code>commitReorder</code>,
            <code>rollbackReorder</code>. The store maintains a history stack of previous
            list orders so that API failures can trigger instant rollback.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>activeDrag: DragState | null</code> — current drag operation
            </li>
            <li>
              <code>dropTarget: DropTarget | null</code> — current drop target
            </li>
            <li>
              <code>history: ReorderHistory[]</code> — previous states for rollback
            </li>
            <li>
              <code>pendingRequests: Map&lt;string, AbortController&gt;</code> — in-flight API calls
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Pointer Drag Handler (<code>pointer-drag-handler.ts</code>)</h4>
          <p>
            Handles pointer event-based drag detection. On pointer down, starts a
            long-press timer (300ms default). If the pointer moves beyond the movement
            threshold (5px) before the timer fires, drag initiates immediately. If the
            timer fires first, drag initiates on long-press. Tracks pointer delta to
            update the ghost position. On pointer up, ends the drag and triggers drop
            logic. Supports cancellation via Escape key.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. HTML5 Drag Handler (<code>html5-drag-handler.ts</code>)</h4>
          <p>
            Wrapper around the HTML5 Drag and Drop API for environments where pointer
            events are insufficient (e.g., drag from external sources like file explorer
            or browser tabs). Sets <code>dataTransfer</code> with item ID and type,
            configures the drag image, and handles drag events (dragstart, dragover,
            drop, dragend). Used as a fallback or for interop scenarios. See the Example
            tab for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. FLIP Animator (<code>flip-animator.ts</code>)</h4>
          <p>
            Implements the FLIP animation technique for smooth reordering transitions.
            <strong> First:</strong> record the bounding box of each item before reorder.
            <strong> Last:</strong> after DOM updates, record the new bounding boxes.
            <strong> Invert:</strong> apply a CSS transform to move each item back to its
            original position. <strong> Play:</strong> remove the transform with a CSS
            transition, creating a smooth animation from old to new position. Runs at
            60fps using transform (GPU-composited). See the Example tab for the complete
            implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Hooks (<code>use-draggable.ts</code>, <code>use-droppable.ts</code>, <code>use-sortable-list.ts</code>)</h4>
          <p>
            <code>use-draggable</code> — attaches pointer and keyboard event listeners to
            an individual item. Manages visual states (grabbed, hovering, dragging).
            Announces position to screen readers via aria-live.
          </p>
          <p className="mt-2">
            <code>use-droppable</code> — attaches to drop target zones (individual items
            or entire columns). Computes collision based on pointer position vs. item
            bounding boxes. Uses a spatial index (sorted by Y position) for O(log n)
            lookups.
          </p>
          <p className="mt-2">
            <code>use-sortable-list</code> — main hook coordinating the sortable list.
            Manages local item array, calls the store for drag state, triggers FLIP
            animations on reorder, and handles API persistence with optimistic updates
            and rollback.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Components (<code>drag-drop-list.tsx</code>, <code>draggable-item.tsx</code>, <code>drop-indicator.tsx</code>, <code>drag-ghost.tsx</code>)</h4>
          <p>
            <code>DragDropList</code> — root container, provides context, renders the
            list and drop indicator portal.
          </p>
          <p className="mt-2">
            <code>DraggableItem</code> — individual item with drag handle, keyboard
            support, visual states (default, dragging placeholder, hovered drop target).
          </p>
          <p className="mt-2">
            <code>DropIndicator</code> — thin horizontal line rendered absolutely at the
            computed drop position via portal.
          </p>
          <p className="mt-2">
            <code>DragGhost</code> — floating clone of the dragged item, follows pointer
            with slight offset, reduced opacity, and scale-up effect.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for active drag state. Each
          sortable list instance maintains its own local state (item array, order) via
          <code>use-sortable-list</code>. When a drag starts, the store records the
          active item and pointer position. As the pointer moves, each droppable zone
          computes collision and updates the drop target in the store. On drop, the
          list hook reads the drop target, computes the new order, saves the current
          order to history, applies the reorder optimistically, triggers FLIP animation,
          and fires the API call. If the API fails, the hook restores the previous order
          from history and triggers a reverse FLIP animation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User presses and holds (or clicks and drags) a drag handle on an item.
          </li>
          <li>
            <code>use-draggable</code> detects long-press or movement threshold, calls
            <code>store.startDrag(item)</code>.
          </li>
          <li>
            Store sets <code>activeDrag</code>. A ghost clone renders via portal,
            following the pointer.
          </li>
          <li>
            The original item becomes a placeholder (same dimensions, dimmed).
          </li>
          <li>
            As the pointer moves, <code>use-droppable</code> hooks on each item compute
            collision and update <code>dropTarget</code> in the store.
          </li>
          <li>
            The <code>DropIndicator</code> line renders at the target position.
          </li>
          <li>
            Screen reader announces: &quot;Item picked, position 3 of 12.&quot;
          </li>
          <li>
            User releases pointer (or presses Enter). <code>store.endDrag()</code> fires.
          </li>
          <li>
            <code>use-sortable-list</code> reads drop target, computes new order, saves
            history, applies reorder, triggers FLIP animation.
          </li>
          <li>
            API call fires with new order. If it fails, rollback from history.
          </li>
          <li>
            Screen reader announces: &quot;Item dropped at position 7.&quot;
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. Drag state
          mutations flow through the Zustand store, and rendering flows from store
          subscriptions and local hook state. This ensures predictable behavior and makes
          the system testable in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Pointer Event Lifecycle</h3>
        <p>
          The pointer event lifecycle is the backbone of drag detection. On{" "}
          <code>pointerdown</code>, we record the initial pointer position and start the
          long-press timer. On <code>pointermove</code>, we compute the delta from the
          initial position. If the delta exceeds the movement threshold (5px), we
          initiate drag immediately — this prevents accidental drags from slight finger
          tremors. On <code>pointerup</code>, we end the drag. If the long-press timer
          fires before any movement, we initiate drag on long-press (for touch devices
          where the user intentionally holds to drag). The Escape key at any point
          cancels the drag and restores the original item position.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Collision Detection</h3>
        <p>
          Collision detection determines where the dragged item would land if dropped.
          For each droppable zone (item or column), we maintain a sorted list of bounding
          boxes (sorted by Y coordinate for vertical lists, X for horizontal). On pointer
          move, we binary-search the sorted list to find the insertion point — O(log n)
          instead of O(n) linear scan. The drop indicator renders at the boundary between
          the item before and after the insertion point. For multi-column scenarios, we
          also check if the pointer is within any column&apos;s bounding box, and if so,
          compute the insertion point within that column.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimistic Reorder with Rollback</h3>
        <p>
          When the user drops, the list hook captures the current item array as a
          snapshot and pushes it to the history stack. It then computes the new order
          (remove item from old index, insert at new index, or move between columns for
          multi-column). The new order is applied to local state immediately, triggering
          a re-render. The FLIP animator records First positions, the DOM updates to
          Last positions, and the animation plays. Concurrently, the API call fires with
          the reorder payload. If the API succeeds, the history entry is discarded. If
          it fails, the hook restores the previous order from history, triggers a reverse
          FLIP animation, and shows an error toast. The AbortController on the API call
          allows cancellation if the user initiates another reorder before the first
          completes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Drop on same position:</strong> The hook detects that the source and
            target indices are identical. No reorder, no API call, no animation. This
            prevents unnecessary network traffic and UI flicker.
          </li>
          <li>
            <strong>Empty target list:</strong> If dropping into an empty column, the
            insertion index is 0. The column&apos;s droppable zone must still render a
            minimum-height target area so the collision detection has a bounding box.
          </li>
          <li>
            <strong>Circular nesting prevention:</strong> Before committing a drop into a
            nested group, the hook traverses the item&apos;s ancestry chain. If the target
            group is a descendant of the dragged item, the drop is rejected and the item
            returns to its original position.
          </li>
          <li>
            <strong>Component unmount during drag:</strong> A cleanup effect in{" "}
            <code>use-draggable</code> calls <code>store.endDrag()</code> on unmount,
            ensuring no orphaned drag state. The ghost and drop indicator unmount via
            portal cleanup.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 14 files: type
            definitions, Zustand store with reorder history, pointer drag handler with
            long-press detection, HTML5 drag handler wrapper, FLIP animator, three custom
            hooks (draggable, droppable, sortable-list), four components (list container,
            draggable item, drop indicator, drag ghost), and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the
            article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types (drag-drop-types.ts)</h3>
        <p>
          Defines <code>DraggableItem</code> with id, data payload, disabled flag, and
          optional groupId for nested lists. <code>DropTarget</code> carries the target
          item id, insertion position (&quot;before&quot; or &quot;after&quot;), and
          optional columnId for multi-column. <code>DragState</code> tracks the active
          item, pointer coordinates, drag origin, and whether the drag is active.
          <code>DragConfig</code> exposes tunable parameters: longPressDelay (default
          300ms), movementThreshold (default 5px), animationDuration (default 250ms).
          <code>ReorderPayload</code> is the API contract with source index, target index,
          source column, target column, and item IDs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (drag-drop-store.ts)</h3>
        <p>
          The store manages active drag state, drop targets, reorder history, and pending
          API requests. Key design decisions include: using a history stack with max depth
          (10 entries) to limit memory, storing AbortControllers for in-flight API calls
          to enable cancellation, and providing <code>commitReorder</code> /{" "}
          <code>rollbackReorder</code> actions that the list hook calls after API success
          or failure. The store is instance-scoped via a unique list ID so multiple
          sortable lists on the same page do not share state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Pointer Drag Handler (pointer-drag-handler.ts)</h3>
        <p>
          Handles the full pointer event lifecycle. On pointer down, records origin
          coordinates and starts the long-press timer. On pointer move, computes delta
          and initiates drag if threshold is exceeded. On pointer up, ends the drag.
          Supports both immediate drag (mouse movement exceeds threshold) and long-press
          drag (touch hold). The handler returns callbacks for pointerdown, pointermove,
          and pointerup that the <code>use-draggable</code> hook attaches to the DOM
          element. Uses <code>PointerEvent</code> which unifies mouse and touch events.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: HTML5 Drag Handler (html5-drag-handler.ts)</h3>
        <p>
          Provides HTML5 Drag and Drop API compatibility for interop scenarios. Sets up
          dragstart/dragover/drop/dragend event listeners. Serializes item data into
          <code>dataTransfer</code> as JSON. Configures a custom drag image via{" "}
          <code>setDragImage</code>. Handles the <code>effectAllowed</code> and{" "}
          <code>dropEffect</code> properties for visual cursor feedback. This module is
          optional and used only when external drag sources need to interact with the list.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: FLIP Animator (flip-animator.ts)</h3>
        <p>
          Implements the FLIP technique for smooth reordering animations. The{" "}
          <code>captureFirst</code> method records bounding boxes of all items before the
          reorder. After the DOM updates (React re-renders with new order),{" "}
          <code>applyFlip</code> records the Last positions, computes the delta (Last -
          First), applies an Invert transform (translate by negative delta), and then
          removes it via <code>requestAnimationFrame</code> with a CSS transition,
          triggering the Play animation. Uses <code>transform: translateY()</code> for
          GPU compositing. Supports spring physics via configurable easing
          (<code>cubic-bezier(0.2, 0, 0, 1)</code> for a subtle spring feel).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: use-draggable Hook</h3>
        <p>
          Attaches pointer and keyboard event listeners to an individual draggable item.
          Uses the pointer drag handler for mouse/touch drag. For keyboard, listens for
          Space/Enter to initiate drag, ArrowUp/ArrowDown to move the item within the
          list, Enter to drop, and Escape to cancel. Maintains local visual state
          (&quot;idle&quot;, &quot;grabbed&quot;, &quot;dragging&quot;). Announces
          position changes to screen readers via an internal aria-live region. Returns
          props to spread on the item element: <code>tabIndex</code>,{" "}
          <code>role=&quot;listitem&quot;</code>, <code>aria-grabbed</code>, event
          handlers, and aria-label.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: use-droppable Hook</h3>
        <p>
          Attaches to drop target zones. Uses a <code>ResizeObserver</code> to keep item
          bounding boxes up to date as the layout changes. On pointer move (subscribed
          from the store), computes collision by checking if the pointer is within the
          item&apos;s bounding box. For vertical lists, splits the box horizontally — if
          the pointer is in the top half, the drop position is &quot;before&quot;; if in
          the bottom half, &quot;after&quot;. Updates the store&apos;s drop target. Uses
          a binary search on sorted bounding boxes for O(log n) lookups.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: use-sortable-list Hook</h3>
        <p>
          The main orchestrator hook. Accepts an item array, an onReorder callback (API
          call), and optional config (columnId, nested depth). Manages the local item
          array, subscribes to the store for drop target changes, and commits reorders
          on drop. On drop, saves current state to history, computes new order, applies
          it, triggers FLIP animation, and fires the API call. On API failure, rolls
          back from history. Handles edge cases: same-position drop (no-op), empty
          target list (index 0), circular nesting (reject).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: DragDropList Component</h3>
        <p>
          Root container component. Renders the list container with{" "}
          <code>role=&quot;list&quot;</code>, provides context to child items, renders the
          DropIndicator via portal, and renders the DragGhost via portal when active drag
          exists. Sets up the <code>use-sortable-list</code> hook and passes item data
          to <code>DraggableItem</code> children.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: DraggableItem Component</h3>
        <p>
          Individual item component. Uses <code>use-draggable</code> for pointer/keyboard
          behavior. Renders a drag handle icon, item content, and visual state indicators
          (dimmed when placeholder, highlighted when drop target). Applies{" "}
          <code>aria-grabbed</code>, <code>aria-label</code> with position info, and
          <code>tabIndex=&quot;0&quot;</code>. When acting as a drag placeholder,
          maintains its original dimensions via inline styles to prevent layout shift.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: DropIndicator Component</h3>
        <p>
          Renders a thin horizontal line (2px, accent color) at the computed drop
          position. Positioned absolutely via portal to avoid affecting the list layout.
          Uses a pulsing animation to draw attention. Renders only when a drop target is
          active and differs from the dragged item&apos;s original position.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: DragGhost Component</h3>
        <p>
          Renders a floating clone of the dragged item that follows the pointer. Created
          by cloning the DOM node of the dragged item (via <code>cloneNode(true)</code>)
          and positioning it absolutely with <code>pointer-events: none</code>. Applies
          a slight scale-up (1.05x), reduced opacity (0.85), and a subtle shadow for
          depth. The ghost is offset from the pointer by 10px vertically so the user can
          see the drop target beneath.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
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
                <td className="p-2">startDrag</td>
                <td className="p-2">O(1) — set store state</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">updatePointer</td>
                <td className="p-2">O(1) — update coordinates</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Collision detection</td>
                <td className="p-2">O(log n) — binary search on sorted boxes</td>
                <td className="p-2">O(n) — store bounding boxes</td>
              </tr>
              <tr>
                <td className="p-2">Reorder computation</td>
                <td className="p-2">O(n) — array splice</td>
                <td className="p-2">O(n) — new array</td>
              </tr>
              <tr>
                <td className="p-2">FLIP animation</td>
                <td className="p-2">O(n) — capture all bounding boxes</td>
                <td className="p-2">O(n) — store First/Last maps</td>
              </tr>
              <tr>
                <td className="p-2">Rollback</td>
                <td className="p-2">O(1) — restore from history</td>
                <td className="p-2">O(h) — h history entries</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of items in the list and <code>h</code> is
          the history depth (max 10). For lists of 10,000+ items, collision detection
          remains sub-millisecond via binary search. The bottleneck is the O(n) reorder
          computation and FLIP capture, which are acceptable because they run only on
          drop (not during drag).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Bounding box updates during scroll:</strong> If the user scrolls
            while dragging, all bounding boxes become stale. The <code>use-droppable</code>{" "}
            hook uses a <code>ResizeObserver</code> to update boxes on layout changes,
            but scroll-induced position changes require a <code>scroll</code> event
            listener that recalculates offsets. This is O(n) and can cause jank on large
            lists. Mitigation: only update boxes for items in the viewport (virtualization).
          </li>
          <li>
            <strong>Array splice on reorder:</strong> O(n) operation. For lists with
            frequent reorders and 10,000+ items, this can degrade. Mitigation: use a
            linked list or tree-based data structure (e.g., B-tree) for O(log n)
            insertion/deletion. In practice, reorders are infrequent enough that array
            splice is acceptable.
          </li>
          <li>
            <strong>Ghost DOM cloning:</strong> Cloning a complex item DOM node via
            <code>cloneNode(true)</code> can be expensive if the item has many children.
            Mitigation: render a simplified ghost (text-only, no images or interactive
            elements) instead of cloning the full DOM.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Virtualization:</strong> For lists exceeding 500 items, use windowing
            (react-window pattern) to render only visible items. During drag, expand the
            rendered window to include items near the drop target.
          </li>
          <li>
            <strong>Spatial indexing:</strong> For multi-column boards with thousands of
            items, use a quadtree or grid-based spatial index for O(1) collision detection
            instead of binary search.
          </li>
          <li>
            <strong>Throttled pointer updates:</strong> Throttle pointer position updates
            to the store at 60Hz (16ms) to avoid excessive re-renders. Pointer events
            fire at the display refresh rate, but React re-renders at a lower frequency
            under load. Throttling ensures consistent performance.
          </li>
          <li>
            <strong>will-change hint:</strong> Apply <code>will-change: transform</code>{" "}
            to draggable items during drag to promote them to their own compositor layer.
            Remove it after drag ends to free GPU memory.
          </li>
          <li>
            <strong>Batch rapid reorders:</strong> If the user performs multiple
            reorders in quick succession (e.g., rapid keyboard arrow presses), debounce
            the API call by 300ms and batch all changes into a single request.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Item data may contain user-generated content (e.g., task titles, descriptions).
          If rendered as HTML via <code>dangerouslySetInnerHTML</code>, it becomes an XSS
          vector. Always sanitize HTML content before rendering. Prefer rendering strings
          as text content (React&apos;s default escaping) and only allow rich content from
          trusted sources. The reorder API payload (item IDs, indices) must be validated
          server-side to prevent authorization bypasses (e.g., a user reordering another
          user&apos;s items by manipulating the payload).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Each item is focusable via <code>tabIndex=&quot;0&quot;</code> and has{" "}
              <code>role=&quot;listitem&quot;</code>.
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Space</kbd>{" "}
              or <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd>{" "}
              picks up the focused item.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowUp</kbd> /{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowDown</kbd>{" "}
              moves the item one position up or down.
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd>{" "}
              drops the item at the current position.
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd>{" "}
              cancels the drag and restores the original position.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              An <code>aria-live=&quot;polite&quot;</code> region announces drag state
              changes: &quot;Item picked, position 3 of 12&quot;, &quot;Moved to
              position 5&quot;, &quot;Item dropped at position 5&quot;.
            </li>
            <li>
              Each item has <code>aria-grabbed=&quot;true&quot;</code> when dragging and{" "}
              <code>aria-grabbed=&quot;false&quot;</code> otherwise.
            </li>
            <li>
              The list container has <code>role=&quot;list&quot;</code> and each item has{" "}
              <code>role=&quot;listitem&quot;</code> with <code>aria-posinset</code> and{" "}
              <code>aria-setsize</code> for position context.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            The list uses <code>role=&quot;list&quot;</code> (or <code>role=&quot;listbox&quot;</code>{" "}
            for single-select scenarios). Items use <code>role=&quot;listitem&quot;</code>{" "}
            with <code>aria-posinset</code> (1-based index) and <code>aria-setsize</code>{" "}
            (total count). The drag handle has <code>aria-label=&quot;Drag to reorder&quot;</code>{" "}
            and <code>role=&quot;button&quot;</code>. The drop indicator uses{" "}
            <code>aria-hidden=&quot;true&quot;</code> since it is purely visual. See the
            Example tab for the exact markup.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Authorization</h3>
        <ul className="space-y-2">
          <li>
            <strong>Server-side validation:</strong> The reorder API must validate that
            the user has permission to reorder the items in question. Item IDs and
            column IDs must be checked against the user&apos;s authorization scope.
          </li>
          <li>
            <strong>CSRF protection:</strong> Reorder requests that mutate server state
            must include CSRF tokens (for cookie-based auth) or use same-site cookie
            attributes.
          </li>
          <li>
            <strong>Rate limiting:</strong> Cap reorder API calls at 10 per second per
            user to prevent abuse from automated scripts.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test startDrag sets activeDrag correctly,
            updatePointer updates coordinates, setDropTarget updates the target, endDrag
            clears activeDrag, commitReorder clears history, rollbackReorder restores
            previous state.
          </li>
          <li>
            <strong>Pointer drag handler:</strong> Test that pointerdown + move beyond
            threshold initiates drag, pointerdown + long-press initiates drag, pointerup
            ends drag, Escape cancels drag.
          </li>
          <li>
            <strong>FLIP animator:</strong> Test that captureFirst records correct
            bounding boxes, applyFlip computes correct deltas, applies correct transforms,
            and removes them after animation frame.
          </li>
          <li>
            <strong>Reorder logic:</strong> Test array splice produces correct order for
            forward move (index 2 to 7), backward move (index 7 to 2), same position
            (no-op), and cross-column move.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full drag-and-drop lifecycle:</strong> Render DragDropList with 10
            items. Simulate pointerdown on item 3, pointermove beyond threshold,
            pointermove to position of item 7, pointerup. Assert item 3 is now at index 6,
            drop indicator rendered during drag, ghost rendered during drag, and API call
            fired with correct payload.
          </li>
          <li>
            <strong>Keyboard reorder:</strong> Focus item 3, press Space to pick up,
            press ArrowDown 4 times, press Enter to drop. Assert item is now at index 6
            and API call fired.
          </li>
          <li>
            <strong>Rollback on API failure:</strong> Mock API to reject. Perform reorder.
            Assert order reverts to previous state and error message is shown.
          </li>
          <li>
            <strong>Multi-column drag:</strong> Render two columns. Drag item from column
            A to column B. Assert item is removed from A and inserted in B at correct
            position.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>
            Run axe-core automated checks on rendered list. Verify aria-live regions,
            aria-grabbed, aria-posinset, aria-setsize, and role attributes.
          </li>
          <li>
            Test keyboard navigation: Tab to list, Arrow keys to navigate items, Space
            to pick up, Arrow keys to move, Enter to drop. Verify focus management
            throughout.
          </li>
          <li>
            Test screen reader announcements using a mock aria-live observer. Verify
            announcements on pick up, move, and drop.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Component unmount during active drag: verify cleanup runs, drag state clears,
            no memory leaks.
          </li>
          <li>
            Rapid-fire reorders (5 in 1 second): verify API calls are debounced/batched,
            final order is correct, no race conditions.
          </li>
          <li>
            Drop on same position: verify no API call, no animation, no state change.
          </li>
          <li>
            Touch device: simulate long-press drag with pointer events, verify drag
            initiates after 300ms hold.
          </li>
          <li>
            Nested list: attempt to drop a parent into its own child. Verify drop is
            rejected and item returns to original position.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using mouse events instead of pointer events:</strong> Candidates
            often use onMouseDown/onMouseMove/onMouseUp, which do not support touch
            devices. Interviewers expect pointer events (onPointerDown/onPointerMove/
            onPointerUp) which unify mouse, touch, and pen input into a single API.
          </li>
          <li>
            <strong>No movement threshold:</strong> Without a movement threshold or
            long-press timer, slight finger movements trigger accidental drags on touch
            devices. Always require either 5px+ movement or 300ms hold before initiating
            drag.
          </li>
          <li>
            <strong>Animating layout properties:</strong> Animating <code>top</code>,
            <code>margin</code>, or <code>height</code> triggers expensive layout
            recalculations. Interviewers look for candidates who know to use FLIP with
            <code>transform: translateY()</code> for 60fps animations.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Implementing drag-and-drop without
            keyboard support means keyboard and screen reader users cannot reorder items.
            This is a critical oversight. Interviewers expect Space/Arrow/Enter/Escape
            keyboard support and aria-live announcements.
          </li>
          <li>
            <strong>No rollback on API failure:</strong> Optimistic updates without a
            rollback path lead to data inconsistency. Interviewers expect candidates to
            discuss saving the previous state, attempting the API call, and restoring on
            failure.
          </li>
          <li>
            <strong>Using array index as key:</strong> Using the array index as the React{" "}
            <code>key</code> prop causes animation bugs and incorrect DOM node reuse
            during reorder. Always use stable unique IDs.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Pointer Events vs HTML5 Drag and Drop API</h4>
          <p>
            HTML5 Drag and Drop API is built-in and requires no custom drag logic. However,
            it has no touch support, limited ghost customization (only a translucent
            screenshot of the dragged element), no custom drop indicators (browser shows
            a simple &quot;copy&quot; or &quot;move&quot; cursor), and inconsistent
            behavior across browsers (Safari has known bugs with dragover events). Pointer
            events give full control: custom ghost rendering, drop indicator lines, touch
            support, and consistent behavior. The trade-off is implementation complexity —
            you must manage the entire drag lifecycle manually. For production applications,
            pointer events are the right choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">FLIP Animation vs CSS Transitions vs Framer Motion</h4>
          <p>
            FLIP is the gold standard for list reordering animations because it handles
            the case where items change position in the DOM. Pure CSS transitions cannot
            animate from &quot;where the item was&quot; to &quot;where the item is&quot;
            because the browser has no memory of the old position. Framer Motion implements
            FLIP internally (via the <code>layout</code> prop) and provides a declarative
            API. The trade-off is bundle size (~12kb gzipped). For an interview, implementing
            FLIP manually demonstrates deep understanding of browser rendering and animation
            principles. For production, Framer Motion is the pragmatic choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Optimistic Updates vs Server-Confirmed Updates</h4>
          <p>
            Server-confirmed updates (wait for API response, then update UI) guarantee
            consistency but introduce latency (200-500ms round trip) that makes the UI
            feel sluggish. Optimistic updates (update UI immediately, rollback on failure)
            feel instantaneous but risk showing stale data if the API fails. The trade-off
            depends on API reliability. For internal tools with reliable APIs, optimistic
            is always better. For user-facing apps with unreliable networks, consider a
            hybrid: show the reorder immediately but display a &quot;saving...&quot;
            indicator until the API confirms. This gives the best of both worlds.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Array vs Linked List for Item Storage</h4>
          <p>
            Arrays provide O(1) indexed access but O(n) insertion/deletion (splice shifts
            all subsequent elements). Linked lists provide O(1) insertion/deletion but
            O(n) indexed access. For lists under 1,000 items, arrays are faster in practice
            due to CPU cache locality and optimized V8 array operations. For lists with
            10,000+ items and frequent reorders, a linked list or tree-based structure
            (B-tree, splay tree) reduces reorder cost. In most interview scenarios, arrays
            are the correct answer — mention linked lists as a scaling optimization.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle drag-and-drop with virtualized lists (10,000+ items)?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualization renders only the visible window of items. During drag, we
              need to expand the rendered window to include items near the drop target.
              When the ghost approaches the bottom of the viewport, auto-scroll the list
              and expand the window downward. Collision detection must work with the
              virtualized indices, not the DOM indices. We maintain a mapping between
              virtual indices and data indices. The bounding box cache only stores boxes
              for rendered items; non-rendered items use estimated heights for collision
              calculation. On drop, the precise position is computed from the data index.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement drag-and-drop between nested lists (epics → stories → tasks)?
            </p>
            <p className="mt-2 text-sm">
              A: Each nesting level is its own <code>DragDropList</code> instance with a
              unique list ID and groupId. The store tracks the groupId of each item. When
              a drop target is in a different list, we check if the target list&apos;s
              groupId is a valid parent or sibling of the dragged item&apos;s groupId. We
              traverse the ancestry chain to prevent circular nesting (dropping a parent
              into its own child). Cross-list drops require the <code>use-sortable-list</code>{" "}
              hooks of both lists to coordinate via the global store. The API call includes
              both source and target group IDs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add undo/redo for reorders?
            </p>
            <p className="mt-2 text-sm">
              A: The history stack already stores previous states for rollback. Extend it
              to store all successful reorders (not just the last one). Maintain two
              stacks: undoStack and redoStack. On reorder, push the previous state to
              undoStack and clear redoStack. On undo, pop from undoStack, apply the state,
              push the current state to redoStack, and fire an API call. On redo, pop from
              redoStack and reverse the process. Cap both stacks at 50 entries to limit
              memory. The API should support batch undo/redo operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle collaborative editing (multiple users reordering the same list)?
            </p>
            <p className="mt-2 text-sm">
              A: Use operational transformation (OT) or conflict-free replicated data types
              (CRDTs). Each reorder operation is a transform: move item X from position A
              to position B. The server receives transforms from all clients, orders them
              by timestamp, and applies them sequentially. If two users move the same item
              simultaneously, the server resolves the conflict by accepting the first
              transform and transforming the second against it. The client receives the
              authoritative order from the server via WebSocket and applies it. The UI
              uses FLIP to animate from the local order to the server order. This is the
              same approach used by collaborative tools like Figma and Google Docs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add auto-scroll when the dragged item approaches the viewport edge?
            </p>
            <p className="mt-2 text-sm">
              A: During pointer move, check if the pointer Y coordinate is within a
              threshold (e.g., 50px) of the viewport top or bottom. If so, start a
              <code>requestAnimationFrame</code> loop that scrolls the container by a
              small amount (e.g., 5px per frame). The scroll speed increases as the
              pointer gets closer to the edge (inverse linear relationship). On pointer
              up or when the pointer moves away from the edge, cancel the scroll loop.
              The bounding box cache must update on scroll — use a scroll event listener
              that recalculates the offset of each cached box.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle React 18+ concurrent rendering?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle, so it works correctly with concurrent features. Pointer event handlers
              are synchronous DOM event listeners, unaffected by React&apos;s scheduler.
              FLIP animations run on the compositor thread via CSS transitions, independent
              of React. The list hook uses <code>useSyncExternalStore</code> for
              subscription synchronization with the store. Reorder state updates that
              trigger API calls are wrapped in <code>startTransition</code> to avoid
              blocking urgent updates (pointer move during drag). The ghost and drop
              indicator render via portal, which is also concurrent-safe.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://dndkit.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              dnd-kit — Modern Drag and Drop Toolkit for React
            </a>
          </li>
          <li>
            <a
              href="https://github.com/atlassian/react-beautiful-dnd"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-beautiful-dnd — Beautiful Drag and Drop for React (Atlassian)
            </a>
          </li>
          <li>
            <a
              href="https://aerotwist.com/blog/flip-your-animations/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FLIP Your Animations — Paul Lewis, Aerotwist
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Listbox Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Pointer Events API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — HTML Drag and Drop API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/accessible-drag-and-drop"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Accessible Drag and Drop Patterns
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
