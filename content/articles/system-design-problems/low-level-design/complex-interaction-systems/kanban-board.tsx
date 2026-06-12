"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-kanban-board",
  title: "Design a Kanban Board",
  description:
    "LLD for a Kanban board: drag cards across columns, swimlanes, real-time multi-user updates, optimistic reorder, accessibility, and persistence.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "kanban-board",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-05-04",
  tags: ["lld", "kanban", "drag-and-drop", "real-time", "react"],
  relatedTopics: [
    "drag-drop-list",
    "real-time-collaborative-editor",
    "dashboard-builder",
  ],
};

export default function KanbanBoardArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Kanban Board</h1><h2>Definition &amp; Context</h2><p>Design a Kanban Board is an implementation-heavy interaction design covering column paging, card ordering, cross-column drag, auto-scroll, optimistic mutation, version conflicts, and presence. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep committed card positions separate from transient drag projection. Use stable card ids and position keys. Core structures: column map, card map, position keys, drag session, projected destination, cursors, optimistic journal, versions, and presence overlay.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/kanban-board-runtime.svg" alt="Design a Kanban Board runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a Kanban board — the
          column-based UI behind Trello, Jira,
          Linear, GitHub Projects, and any product
          that organizes cards into columns
          representing workflow states (To Do, In
          Progress, Done). Users drag cards within
          and across columns; multiple users may
          be working simultaneously. The component
          composes drag-drop primitives with
          real-time sync and column-aware
          reordering.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: cross-list drag
          (a card moves from column A to column
          B, with reorder within B); swimlanes
          (horizontal groupings within a board);
          real-time updates with conflict
          resolution (two users move the same
          card concurrently); optimistic UI with
          rollback; persistence of order +
          column membership; accessibility for
          the multi-list structure.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users (product managers, engineers,
          ops) organize cards on a board.
          Engineering teams plug in: provide
          columns and cards; the runtime
          handles drag and sync.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend supports card move and reorder
          via REST plus real-time updates via
          WebSocket. Each card has stable id,
          column id, position. Modern browsers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement task management
          features beyond board mechanics. We do
          not implement card detail views
          (consumer-supplied). We do not
          implement column configuration UI
          (separate).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Board with columns rendered horizontally.
          Each column has a header (title, count)
          and a vertical list of cards. Cards
          drag within a column to reorder. Cards
          drag across columns. Optimistic update
          with rollback on failure. Real-time
          updates from other users (cards
          appear, move, disappear). Add and
          delete cards. Add and delete columns.
          Empty state. Accessibility for cross-
          column drag (keyboard alternative).
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Swimlanes (horizontal sections within
          board). WIP limits (max cards per
          column). Filters (show only cards
          matching criteria). Card preview on
          hover. Bulk actions (move multiple
          cards). Keyboard shortcuts. Undo
          recent moves. Column-level real-time
          presence (who is editing here).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Card content editing (consumer-supplied
          via render prop), workflow automation,
          reporting.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Smooth drag at 60 fps. Real-time updates
          render without disrupting active drags.
          Many cards (100+ per column) virtualize
          if needed.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic moves rollback on failure.
          Concurrent moves of the same card
          resolve (server is authoritative;
          client reconciles).
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Server enforces per-card permissions
          on move. Real-time channel
          authenticated.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Keyboard alternative for cross-column
          drag. Each column is a labeled list.
          Card focus and movement announce.
          Column boundaries clear in screen
          reader output.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Built on the Drag &amp; Drop List
          primitive. Real-time integration via a
          standard adapter.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The board composes <strong>multiple
          drag-and-drop lists with shared drag
          context</strong> (cards can move between
          lists), a <strong>real-time sync
          layer</strong> (WebSocket events for
          cross-user updates), and <strong>optimistic
          persistence</strong> (UI updates
          immediately; server confirms or
          rejects).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Each <strong>column</strong> is a
          drag-and-drop list (using the
          underlying primitive). All columns
          share a <strong>drag context</strong>{" "}
          so a card dragged out of column A
          can be dropped into column B. The
          drag context holds the active drag
          state (which card, where it&rsquo;s
          currently hovering); drop targets in
          all columns are valid.
        </HighlightBlock>
        <p>
          On <strong>drag start</strong>: the card
          enters drag mode. Other columns
          highlight as potential drop targets.
          The dragged card visually elevates
          and follows the pointer.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>drag over column</strong>: as
          the pointer enters another column,
          that column becomes the active drop
          target. Within the column, the
          drop position is computed via card
          bounding rects (same as single-list
          drag). Siblings shift to indicate
          insertion point.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>drop</strong>: optimistic
          update. The card moves to the new
          column at the new position; UI
          reflects immediately. Persistence
          callback ships the move
          (sourceColumn, targetColumn, position)
          to the server. On success, real-
          time event broadcasts to other
          users (handled below). On failure,
          rollback the optimistic update with
          a banner.
        </HighlightBlock>
        <p>
          <strong>Real-time updates</strong>:
          WebSocket delivers card moves from
          other users. The board state updates
          to reflect the new position. If the
          local user is mid-drag of the same
          card (rare): the optimistic update
          wins until the local drag completes;
          then we reconcile with the server&rsquo;s
          state. Last-write-wins by server
          timestamp.
        </p>
        <p>
          <strong>Conflict</strong>: two users
          move the same card simultaneously.
          Server processes them serially;
          last-write-wins. Both clients see
          the final position via the real-
          time event. The UI may briefly show
          a flicker as one user&rsquo;s
          optimistic update is corrected;
          this is acceptable for the rare
          case.
        </p>
        <p>
          <strong>Swimlanes</strong>: a board
          can have horizontal sections
          (swimlanes). Cards within a swimlane
          drag freely; cross-swimlane drag is
          configurable. Each (column, swimlane)
          intersection is a sortable container.
        </p>
        <p>
          <strong>WIP limits</strong>: a column
          may cap cards. When over the limit,
          the column header highlights;
          configurable whether to allow
          additional drops or block them.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard cross-column drag</strong>:
          focus a card, Space to pick up,
          arrow keys to move within column;
          Tab to move to the next column;
          Space to drop. Live region announces
          source and target columns.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>Card</strong> renders one card. <strong>DragContext</strong>{" "}
          holds active drag state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>SyncAdapter</strong> handles real-time events.{" "}
          <Highlight tier="important"><strong>PersistenceAdapter</strong></Highlight>{" "}
          for moves.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Cards-per-column in external store.
          <Highlight tier="important">Drag state ephemeral in drag
          context.</Highlight> Real-time events update
          the store.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">Card shape:{" "}
          <code>{` { id, columnId, position, ...content } `}</code>.
          Move</HighlightBlock>
<HighlightBlock as="p" tier="important">action:{" "}
          <code>{` { cardId, fromColumnId, toColumnId, toPosition } `}</code>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Real-time event:
          <code>{` { type: "card.moved" | "card.added" | ..., cardId, ... } `}</code>.</HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag at 60 fps via <Highlight tier="important">FLIP. Real-time
          events batched per RAF</Highlight> tick. Long
          columns virtualized. Memoized cards.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Columns horizontally scrollable when
          many. Cards visually consistent.
          Drop indicators clear in both source
          and target column.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Auto-scroll
          horizontally when dragging near
          board edges. Real-time additions
          subtly animate in.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Each column labeled (e.g. &ldquo;To
          Do, 5 cards&rdquo;). Cards focusable;</HighlightBlock>
<HighlightBlock as="p" tier="important">Space picks up; arrows and Tab move;
          Space drops. Live region announces</HighlightBlock>
<HighlightBlock as="p" tier="important">movements with source and target.
          Cross-column drag explicitly
          announced.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces card move authorization.
          <Highlight tier="important">Rate-limited</Highlight>.
          Real-time channel authenticated.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag tests within and across columns.
          Real-time event <Highlight tier="important">integration tests.
          Optimistic rollback tests. Keyboard</Highlight>
          drag tests. Conflict tests with
          simulated concurrent moves.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Network drop
          mid-drag: the drop locally
          succeeds; persistence retries; if
          persistence ultimately</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">fails,
          rollback. Column deleted while
          card is being dragged into it:
          fail and rollback gracefully.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses for <Highlight tier="important">any column-list
          UI (workflow tools, sales</Highlight> pipelines,
          admin tools).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Column headers and labels via <Highlight tier="important">i18n.
          RTL flips column order; cross-</Highlight>
          column drag still works
          semantically.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Shared drag context vs per-column</h3>
        <HighlightBlock as="p" tier="important">
          Shared enables cross-column drag.
          Per-column would limit drag to
          within columns. Shared is essential
          for Kanban.
        </HighlightBlock>

        <h3>Optimistic vs confirmed-first move</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant; rollback
          on failure. Confirmed-first is
          jarring for the common case where
          moves succeed. Optimistic is right.
        </HighlightBlock>

        <h3>Server-authoritative vs CRDT</h3>
        <HighlightBlock as="p" tier="important">
          Server-authoritative with last-
          write-wins is simpler and sufficient
          for most boards. CRDT scales but
          adds complexity. Default server-
          authoritative.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Cross-board card drag. Bulk move.
          <Highlight tier="important">Smart auto-arrange. AI-suggested
          column for new</Highlight> cards. Real-time
          presence indicators per column.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep committed card positions separate from transient drag projection. Use stable card ids and position keys.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/kanban-board-recovery.svg" alt="Design a Kanban Board recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Server card version and accepted location are authoritative. Drag projection is optimistic. Scale pressure comes from hot columns, thousands of cards, concurrent moves, filtered views, reconnect, and permission drift. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: cross-column move projection and position keys</h3><p>Keep committed cards and projected drag placement separate. Use stable card ids, column ids, fractional position keys, collision targets, and board version. Persist one idempotent move command, rebalance dense keys asynchronously, and roll back rejected moves.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, cancel invalid drops, reconcile version conflicts, reload affected columns, stop auto-scroll, and preserve focus.</p><h3>Board projection and concurrent moves</h3><p>Normalize columns and cards so a projected move changes ordered id lists rather than rebuilding card entities. During drag, compute one insertion destination from measured column zones and card boundaries. For keyboard users, expose lift, move, drop, and cancel commands with live announcements. Keep horizontal board scrolling and vertical column scrolling separately owned so auto-scroll does not oscillate.</p><p>A move command includes card id, source column, destination column, neighbor ids or position key, board version, and idempotency key. If two users move the same card, the server decides the accepted version and publishes one authoritative event. Clients reconcile optimistic projection, retain a visible explanation for rejection, and invalidate stale column pages when position-key rebalancing occurs.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed card positions separate from transient drag projection. Use stable card ids and position keys.</p><h3>What breaks at scale?</h3><p>hot columns, thousands of cards, concurrent moves, filtered views, reconnect, and permission drift.</p><h3>What consistency applies?</h3><p>Server card version and accepted location are authoritative. Drag projection is optimistic.</p><h3>How do you recover?</h3><p>cancel invalid drops, reconcile version conflicts, reload affected columns, stop auto-scroll, and preserve focus.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}