"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-kanban-board",
  title: "Design a Kanban Board",
  description:
    "Kanban board with fractional indexing for order, cross-column drag, optimistic reordering with conflict resolution, real-time multi-user updates, swimlanes, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "kanban-board",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "kanban", "drag-drop", "fractional-indexing", "CRDT", "real-time", "optimistic-UI"],
  relatedTopics: ["drag-drop-list", "chat-messaging-ui", "dashboard-builder"],
};

export default function KanbanBoardArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Kanban Board</h1><h2>Definition &amp; Context</h2><p>Design a Kanban Board is an implementation-heavy low-level design problem covering column paging, card ordering, cross-column drag projection, optimistic mutation, conflict reconciliation, virtualization, and keyboard movement. A principal-level answer must make state ownership, data structures, lifecycle, failure containment, consistency, privacy, cost, and observability explicit.</p><p>Keep committed card positions separate from drag projection. Persist ordering with stable card ids and position keys rather than rewriting whole arrays. The implementation structures are column map, card map, position keys, drag session, projected destination, column cursors, optimistic journal, base version, and presence overlay.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/kanban-board-runtime.svg" alt="Design a Kanban Board runtime" caption="Topic-specific runtime stages from user intent through durable projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below contains the topic-specific implementation mechanics.</p><p>
        A Kanban board is the LLD problem where the most interesting challenges are not
        the visible UI but the data model underneath it. The drag-and-drop visual is
        achievable with any drag library. What separates a staff-level design from a
        tutorial is the answer to: how do you represent card order in the database when
        cards can be reordered to any position between any two other cards? How do you
        handle two users dragging the same card simultaneously? How do you implement
        optimistic reordering without the card visually snapping back when the server
        responds? These questions reveal whether a candidate understands the full
        problem, not just the drag animation.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/kanban-board-architecture.svg"
        alt="Kanban board architecture diagram"
        caption="Kanban board architecture: fractional indexing, drag state, conflict resolution, real-time sync and swimlanes"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        Scope questions that change the architecture significantly:
      </p>
      <p>
        <strong>Single user or collaborative?</strong> A personal task board (Trello
        personal plan) needs only optimistic UI and server confirmation. A team board
        (Jira, Linear) requires real-time multi-user sync with conflict resolution.
      </p>
      <p>
        <strong>Swimlanes?</strong> Swimlanes are horizontal groupings across all columns
        (typically by assignee, priority, or epic). They add a second dimension to the
        board — cards now have both a column and a swimlane. This changes the data model
        from a flat list per column to a grid of lists.
      </p>
      <p>
        <strong>Card count per column?</strong> Boards with 5–20 cards per column need
        no virtualization. Boards where a "Done" column accumulates thousands of cards
        (a common real-world case) need virtual scrolling within columns. This is
        relatively rare in practice but worth mentioning as a scalability consideration.
      </p>
      <p>
        <strong>Column limits?</strong> WIP (Work In Progress) limits cap the number of
        cards allowed in a column. Exceeding the limit should visually warn the user
        and optionally block drag-drops into the column. This is a feature requirement
        that affects the drop validation logic.
      </p>

      <h3>The Card Order Problem and Fractional Indexing</h3>
      <p>
        Storing card order in a database is harder than it looks. Naive approaches fail:
      </p>
      <p>
        <strong>Integer rank field.</strong> Each card has a rank integer. Moving a card
        to position 2 between cards with rank 1 and rank 3 requires ranks 1 and 3 to
        have room for a value between them. After multiple insertions, ranks become
        adjacent (1, 2, 3) and insertion requires renumbering all cards in the column —
        O(n) database writes on each reorder.
      </p>
      <p>
        <strong>Gap strategy.</strong> Assign ranks in multiples of 1000 (1000, 2000,
        3000). Moving to position 2 assigns rank 1500. After many insertions, ranks
        fragment and eventually two adjacent ranks have no integer between them. The
        system must detect this and rebalance — still O(n) writes, just less frequently.
      </p>
      <p>
        <strong>Fractional indexing.</strong> Store rank as a string rather than an
        integer, using a key space that supports arbitrary midpoint insertion. A card
        between ranks "a" and "b" gets rank "am" (the midpoint in lexicographic space,
        using a defined alphabet). This approach, used by Figma, Linear, and Replit,
        supports unlimited insertions between any two positions without renumbering any
        other cards. The rank string remains compact (logarithmic growth per operation)
        and compares correctly as a string using standard string comparison.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Fractional indexing is the state-of-the-art solution for ordered list persistence
        in collaborative tools. The library "fractional-indexing" (available on npm,
        originally from Figma's blog) implements the algorithm. Each card has a rank
        field (string). Moving a card between two others computes the midpoint string
        between their ranks using the library. Sorting cards by their rank strings
        produces the correct visual order. No other cards are modified on reorder — a
        single UPDATE to the moved card's rank field.
      </HighlightBlock>

      <h3>The Drag and Drop State Machine</h3>
      <p>
        Drag-and-drop on a Kanban board involves multiple possible states: no drag
        in progress, dragging a card within the same column, dragging a card to a
        different column, dragging a column to reorder columns, and drag over a valid
        drop zone vs. an invalid one (e.g., a column at WIP capacity).
      </p>
      <p>
        The drag state holds: the dragging item (card ID and source column ID), the
        current drag coordinates (mouse/touch position), the computed drop target
        (target column ID and target position — before which card the dragged card
        would be inserted), and the preview state (the layout the board would have
        if the drag were committed now).
      </p>
      <p>
        The preview state is the board's layout with the dragged card removed from its
        source column and inserted at the target position. Rendering the preview shows
        a placeholder (a ghost/skeleton) where the card would land, and the dragged
        card follows the cursor. This is a computed view of the board state, not a
        mutation of it — the real state only updates on drop.
      </p>
      <p>
        Finding the drop target position: as the cursor moves over a column, compare
        the cursor's y position with the midpoints between card centers. If the cursor
        is above the midpoint between card A and card B, the insertion position is
        before card B. If the cursor is below the last card's midpoint, the position
        is after the last card. This is a linear scan over visible card positions,
        O(n) in cards per column but fast in practice since columns have few cards.
      </p>

      <h3>Optimistic Reordering</h3>
      <p>
        On drop, commit the move optimistically: immediately update the local state
        with the new column assignment and position, then send the move event to the
        server (a PATCH request with the card ID, new column ID, and new rank string).
        The UI is responsive — the card is in its new position with no delay.
      </p>
      <p>
        If the server request fails: revert the local state to the pre-move state and
        show an error notification. The card snaps back to its original position. This
        is jarring but necessary for correctness. Improve the UX by retrying failed
        moves once (with exponential backoff) before reverting.
      </p>
      <p>
        If a conflicting move from another user is received while the optimistic move
        is in flight: apply a "last write wins" merge policy for single-card moves
        (the server's confirmed rank takes precedence). The local card position updates
        to match the server-confirmed position after the optimistic move is acknowledged.
      </p>

      <h3>Real-Time Multi-User Sync</h3>
      <p>
        In a collaborative board, changes made by other users appear in real-time via
        WebSocket. The server broadcasts card events: card_moved (with card ID, new
        column ID, and new rank), card_created, card_updated (title, description),
        card_deleted, and column_reordered.
      </p>
      <p>
        Receiving a card_moved event: update the card's column assignment and rank in
        the local store. Re-sort the column's card list by rank. If the moved card is
        the one currently being dragged by the local user, there is a conflict. The
        resolution depends on the product's choice: "our move wins" (ignore the remote
        update while dragging, apply it after the local drag completes) or "remote wins"
        (cancel the local drag and show the card in its server-assigned position, with
        a notification "Card was moved by Alice"). Most products choose "our move wins"
        for better local UX.
      </p>
      <p>
        Presence indicators: show which users are currently viewing the board (their
        avatars in the board header). Optionally show where each user is focusing
        (which card they have open, or if they are dragging a card — render a ghost
        card following their cursor position, broadcast via WebSocket). This is the
        multiplayer cursor feature seen in Figma and Linear.
      </p>

      <h3>Column Reordering</h3>
      <p>
        Columns themselves are ordered and can be dragged to reorder. Column order uses
        the same fractional indexing approach as card order — each column has a rank
        string. Dragging a column to a new position computes the midpoint rank between
        the surrounding columns and patches the column's rank.
      </p>
      <p>
        Column reordering drag conflicts with card dragging: if the user is dragging
        a card and accidentally triggers the column's drag handle, the column drag
        should be disabled while a card drag is in progress. Implement this by checking
        the drag state before initiating a new drag.
      </p>

      <h3>Swimlanes</h3>
      <p>
        Swimlanes add a second grouping dimension. Each card belongs to both a column
        (the workflow stage: To Do, In Progress, Done) and a swimlane (e.g., the
        assignee or the epic). The board renders as a grid: rows are swimlanes, columns
        are stages. Each cell in the grid contains the cards matching that column and
        swimlane.
      </p>
      <p>
        The data model: cards have two foreign keys — column_id and swimlane_id. Each
        card also has a rank within its (column, swimlane) pair — because card order
        can differ per swimlane. Dragging a card within the same swimlane changes only
        its rank. Dragging across swimlanes changes swimlane_id and recomputes the rank
        within the target (column, swimlane) pair.
      </p>
      <p>
        Swimlane rows can be collapsed (hiding all their cards) with a toggle. The
        collapsed state is stored in local UI state (not persisted, since it is a
        personal view preference in most tools). Collapsing a swimlane that has cards
        assigned to it does not remove the cards — they are still accessible by
        expanding the swimlane.
      </p>

      <h3>Keyboard Accessibility</h3>
      <p>
        Drag and drop is completely inaccessible via keyboard in its native form. The
        accessible alternative is a keyboard-driven card move mode. When the user
        focuses a card and presses Space, the card enters "move mode" (a visual
        indicator highlights it). In move mode, Left/Right arrow keys move the card
        to the previous/next column. Up/Down arrow keys move the card one position up
        or down within its current column. Enter confirms the move (dispatching the
        optimistic update); Escape cancels (returns the card to its original position).
      </p>
      <p>
        Screen reader users additionally benefit from a card's contextual information
        being announced: "Card: Fix login bug. Column: In Progress. Position: 2 of 5."
        The column assignment and position are announced as part of the card's
        accessible name or description.
      </p>
      <p>
        The drag handles (if rendered) have role="button" and aria-label "Drag to
        reorder [card title]." They indicate in their description that Space or Enter
        activates keyboard move mode.
      </p>

      <h3>WIP Limits</h3>
      <p>
        WIP limits are column-level constraints on the maximum number of cards in a
        column. When a column is at or over its limit, visual warnings appear (the
        column header turns red, a count like "5/3" shows the over-limit state).
        Dragging a card into an over-limit column shows a visual warning on the drop
        zone (red highlight instead of the normal blue) and optionally blocks the drop
        (the drag does not complete; the card returns to its source position).
      </p>
      <p>
        Implementing the block: in the drop validation logic, check if the target
        column is at WIP capacity before allowing the drop. If at capacity, show a
        tooltip on the drop zone ("Column is at WIP limit") and do not update the drag
        state's drop target to this column — the placeholder does not appear in
        over-limit columns. The user can still proceed if the product allows "warn only"
        rather than "block" behavior.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate input normalization, typed state transitions, derived projection, integration effects, and bounded telemetry. Preview state must not silently become durable state. Every timer, listener, observer, worker, request, pointer capture, and cache entry needs an explicit lifetime.</p><p>Keep committed card positions separate from drag projection. Persist ordering with stable card ids and position keys rather than rewriting whole arrays. Commit only after applying the latest policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/kanban-board-recovery.svg" alt="Design a Kanban Board recovery map" caption="Recovery decisions: contain pressure, retain committed truth, reconcile safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>A simple list reorder is enough for one user; versioned position keys are justified for concurrent boards and paged columns.</p><p>The server owns accepted card location and version. Local drag is optimistic; conflicts reconcile against the latest card version without silently losing user intent. The scale pressure is thousands of cards, hot columns, concurrent moves, filtered views, drag auto-scroll, reconnects, and permission drift. Bound work, cancel stale effects, cap memory, and degrade predictably.</p><p>Use optimistic UI only where rollback is deterministic and understandable. Keep authorization and destructive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit state unions, idempotency keys, generation guards, SSR-safe feature checks, and deterministic cleanup. Test keyboard use, accessibility output, stale responses, retries, unmount, constrained devices, and large datasets.</p><p>Measure interaction latency, blocked transitions, stale drops, rollbacks, cache pressure, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include mixing preview and commit, trusting arrival order, leaking resources, accepting stale async work, and implementing custom interaction without semantic fallbacks.</p><p>For this topic, cancel invalid drops, restore committed position after rejection, refresh affected columns, stop auto-scroll on cancel, and announce rollback. Security and privacy require the design to validate untrusted input, authorize durable mutations server-side, minimize sensitive telemetry, and bound resource consumption.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies where users repeatedly manipulate state while network, browser, and authorization boundaries can fail independently. Reuse the controller shell, but inject product-specific policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed card positions separate from drag projection. Persist ordering with stable card ids and position keys rather than rewriting whole arrays.</p><h3>What breaks at scale?</h3><p>thousands of cards, hot columns, concurrent moves, filtered views, drag auto-scroll, reconnects, and permission drift. I would bound expensive work and cancel obsolete effects.</p><h3>What consistency model applies?</h3><p>The server owns accepted card location and version. Local drag is optimistic; conflicts reconcile against the latest card version without silently losing user intent.</p><h3>How do you recover?</h3><p>I would cancel invalid drops, restore committed position after rejection, refresh affected columns, stop auto-scroll on cancel, and announce rollback.</p><h3>Why this architecture?</h3><p>A simple list reorder is enough for one user; versioned position keys are justified for concurrent boards and paged columns. The implementation cost is justified only when the required behavior needs it.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li></ul></section>
</ArticleLayout>}
