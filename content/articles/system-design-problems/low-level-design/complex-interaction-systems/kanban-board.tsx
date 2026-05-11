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

export default function KanbanBoardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>Functional Requirements</h2>

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
        <h2>Non-Functional Requirements</h2>

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
        <h2>🧠 Solution Approach</h2>
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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/kanban-board-architecture.svg"
        alt="Kanban board architecture showing columns (Todo, In Progress, Review, Done), card drag arrow, and optimistic update state machine with server sync"
        caption="Kanban board: column layout, drag-and-drop between columns, and optimistic update + rollback state machine"
      />

      <section>
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Cards-per-column in external store.
          <Highlight tier="important">Drag state ephemeral in drag
          context.</Highlight> Real-time events update
          the store.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="crucial">Card shape:{" "}
          <code>{` { id, columnId, position, ...content } `}</code>.
          Move</HighlightBlock>
<HighlightBlock as="p" tier="important">action:{" "}
          <code>{` { cardId, fromColumnId, toColumnId, toPosition } `}</code>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Real-time event:
          <code>{` { type: "card.moved" | "card.added" | ..., cardId, ... } `}</code>.</HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag at 60 fps via <Highlight tier="important">FLIP. Real-time
          events batched per RAF</Highlight> tick. Long
          columns virtualized. Memoized cards.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
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
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Each column labeled (e.g. &ldquo;To
          Do, 5 cards&rdquo;). Cards focusable;</HighlightBlock>
<HighlightBlock as="p" tier="important">Space picks up; arrows and Tab move;
          Space drops. Live region announces</HighlightBlock>
<HighlightBlock as="p" tier="important">movements with source and target.
          Cross-column drag explicitly
          announced.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces card move authorization.
          <Highlight tier="important">Rate-limited</Highlight>.
          Real-time channel authenticated.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag tests within and across columns.
          Real-time event <Highlight tier="important">integration tests.
          Optimistic rollback tests. Keyboard</Highlight>
          drag tests. Conflict tests with
          simulated concurrent moves.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
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
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses for <Highlight tier="important">any column-list
          UI (workflow tools, sales</Highlight> pipelines,
          admin tools).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Column headers and labels via <Highlight tier="important">i18n.
          RTL flips column order; cross-</Highlight>
          column drag still works
          semantically.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Cross-board card drag. Bulk move.
          <Highlight tier="important">Smart auto-arrange. AI-suggested
          column for new</Highlight> cards. Real-time
          presence indicators per column.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How does cross-column drag
          work?</strong> Shared drag context
          across all columns. Active drag
          can drop in any column. Drop
          calculation per column uses card
          bounding rects.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How are real-time updates
          handled?</strong> WebSocket events
          drive the store. Updates render
          smoothly. Mid-local-drag conflicts
          resolved by deferring remote
          changes for the dragged card until
          local drag completes.
        </HighlightBlock>

        <p>
          <strong>3. How are concurrent moves
          resolved?</strong> Server processes
          serially; last-write-wins. Both
          clients see the final position via
          the real-time event.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. How does keyboard
          cross-column drag work?</strong>{" "}
          Space picks up; arrows move within
          column; Tab to next column; Space
          drops. Live region announces source
          and target.
        </HighlightBlock>

        <p>
          <strong>5. How does WIP limit
          enforcement work?</strong> Column
          tracks count vs limit. Visual
          warning when over. Configurable to
          block or allow drop with override.
        </p>

        <p>
          <strong>6. How does this build on
          the Drag &amp; Drop List?</strong>{" "}
          Each column is a sortable list.
          Shared drag context spans columns.
          Persistence, optimistic update,
          and FLIP animation reuse.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How is performance
          maintained with many cards?</strong>{" "}
          Virtualize long columns. Memoize
          cards. Real-time events batched.
          Drag uses cached bounding rects.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>8. How is this
          accessible?</strong> Labeled columns.
          Keyboard drag with announcements.
          Tab between columns. Cross-column
          moves explicit in announcements.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Last-write-wins handles conflicts;
          mid-drag conflicts defer; keyboard
          cross-column drag gives</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">parity.
          The result is direct-manipulation
          workflows that scale across users
          and devices.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
