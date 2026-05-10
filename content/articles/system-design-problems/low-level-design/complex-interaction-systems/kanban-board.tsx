"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          End users (product managers, engineers,
          ops) organize cards on a board.
          Engineering teams plug in: provide
          columns and cards; the runtime
          handles drag and sync.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend supports card move and reorder
          via REST plus real-time updates via
          WebSocket. Each card has stable id,
          column id, position. Modern browsers.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement task management
          features beyond board mechanics. We do
          not implement card detail views
          (consumer-supplied). We do not
          implement column configuration UI
          (separate).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Swimlanes (horizontal sections within
          board). WIP limits (max cards per
          column). Filters (show only cards
          matching criteria). Card preview on
          hover. Bulk actions (move multiple
          cards). Keyboard shortcuts. Undo
          recent moves. Column-level real-time
          presence (who is editing here).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Card content editing (consumer-supplied
          via render prop), workflow automation,
          reporting.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Smooth drag at 60 fps. Real-time updates
          render without disrupting active drags.
          Many cards (100+ per column) virtualize
          if needed.
        </p>

        <h3>Reliability</h3>
        <p>
          Optimistic moves rollback on failure.
          Concurrent moves of the same card
          resolve (server is authoritative;
          client reconciles).
        </p>

        <h3>Security</h3>
        <p>
          Server enforces per-card permissions
          on move. Real-time channel
          authenticated.
        </p>

        <h3>Accessibility</h3>
        <p>
          Keyboard alternative for cross-column
          drag. Each column is a labeled list.
          Card focus and movement announce.
          Column boundaries clear in screen
          reader output.
        </p>

        <h3>Maintainability</h3>
        <p>
          Built on the Drag &amp; Drop List
          primitive. Real-time integration via a
          standard adapter.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The board composes <strong>multiple
          drag-and-drop lists with shared drag
          context</strong> (cards can move between
          lists), a <strong>real-time sync
          layer</strong> (WebSocket events for
          cross-user updates), and <strong>optimistic
          persistence</strong> (UI updates
          immediately; server confirms or
          rejects).
        </p>
        <p>
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
        </p>
        <p>
          On <strong>drag start</strong>: the card
          enters drag mode. Other columns
          highlight as potential drop targets.
          The dragged card visually elevates
          and follows the pointer.
        </p>
        <p>
          On <strong>drag over column</strong>: as
          the pointer enters another column,
          that column becomes the active drop
          target. Within the column, the
          drop position is computed via card
          bounding rects (same as single-list
          drag). Siblings shift to indicate
          insertion point.
        </p>
        <p>
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
        </p>
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
        <p>
          <strong>Keyboard cross-column drag</strong>:
          focus a card, Space to pick up,
          arrow keys to move within column;
          Tab to move to the next column;
          Space to drop. Live region announces
          source and target columns.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/kanban-board-architecture.svg"
        alt="Kanban board architecture showing columns (Todo, In Progress, Review, Done), card drag arrow, and optimistic update state machine with server sync"
        caption="Kanban board: column layout, drag-and-drop between columns, and optimistic update + rollback state machine"
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>BoardProvider</strong>{" "}
          instantiates drag context, sync
          layer. <strong>Board</strong> renders
          the columns. <strong>Column</strong>{" "}
          renders one column with cards list.
          <strong> Card</strong> renders one
          card. <strong>DragContext</strong>{" "}
          holds active drag state.
          <strong> SyncAdapter</strong> handles
          real-time events.
          <strong> PersistenceAdapter</strong>{" "}
          for moves.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Cards-per-column in external store.
          Drag state ephemeral in drag
          context. Real-time events update
          the store.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Card shape:{" "}
          <code>{` { id, columnId, position, ...content } `}</code>.
          Move action:{" "}
          <code>{` { cardId, fromColumnId, toColumnId, toPosition } `}</code>.
          Real-time event:
          <code>{` { type: "card.moved" | "card.added" | ..., cardId, ... } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Drag at 60 fps via FLIP. Real-time
          events batched per RAF tick. Long
          columns virtualized. Memoized cards.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Columns horizontally scrollable when
          many. Cards visually consistent.
          Drop indicators clear in both source
          and target column. Auto-scroll
          horizontally when dragging near
          board edges. Real-time additions
          subtly animate in.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Each column labeled (e.g. &ldquo;To
          Do, 5 cards&rdquo;). Cards focusable;
          Space picks up; arrows and Tab move;
          Space drops. Live region announces
          movements with source and target.
          Cross-column drag explicitly
          announced.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server enforces card move
          authorization. Rate-limited.
          Real-time channel authenticated.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Drag tests within and across columns.
          Real-time event integration tests.
          Optimistic rollback tests. Keyboard
          drag tests. Conflict tests with
          simulated concurrent moves.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Concurrent moves of the same card:
          last-write-wins via server; clients
          reconcile. WIP limit hit during
          drag: visual warning; configurable
          whether to block or allow with
          flag. Real-time event arrives
          mid-local-drag of the same card:
          local drag wins until release;
          then reconcile. Network drop
          mid-drag: the drop locally
          succeeds; persistence retries; if
          persistence ultimately fails,
          rollback. Column deleted while
          card is being dragged into it:
          fail and rollback gracefully.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Pattern reuses for any column-list
          UI (workflow tools, sales pipelines,
          admin tools).
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Column headers and labels via i18n.
          RTL flips column order; cross-
          column drag still works
          semantically.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Shared drag context vs per-column</h3>
        <p>
          Shared enables cross-column drag.
          Per-column would limit drag to
          within columns. Shared is essential
          for Kanban.
        </p>

        <h3>Optimistic vs confirmed-first move</h3>
        <p>
          Optimistic feels instant; rollback
          on failure. Confirmed-first is
          jarring for the common case where
          moves succeed. Optimistic is right.
        </p>

        <h3>Server-authoritative vs CRDT</h3>
        <p>
          Server-authoritative with last-
          write-wins is simpler and sufficient
          for most boards. CRDT scales but
          adds complexity. Default server-
          authoritative.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Cross-board card drag. Bulk move.
          Smart auto-arrange. AI-suggested
          column for new cards. Real-time
          presence indicators per column.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does cross-column drag
          work?</strong> Shared drag context
          across all columns. Active drag
          can drop in any column. Drop
          calculation per column uses card
          bounding rects.
        </p>

        <p>
          <strong>2. How are real-time updates
          handled?</strong> WebSocket events
          drive the store. Updates render
          smoothly. Mid-local-drag conflicts
          resolved by deferring remote
          changes for the dragged card until
          local drag completes.
        </p>

        <p>
          <strong>3. How are concurrent moves
          resolved?</strong> Server processes
          serially; last-write-wins. Both
          clients see the final position via
          the real-time event.
        </p>

        <p>
          <strong>4. How does keyboard
          cross-column drag work?</strong>{" "}
          Space picks up; arrows move within
          column; Tab to next column; Space
          drops. Live region announces source
          and target.
        </p>

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

        <p>
          <strong>7. How is performance
          maintained with many cards?</strong>{" "}
          Virtualize long columns. Memoize
          cards. Real-time events batched.
          Drag uses cached bounding rects.
        </p>

        <p>
          <strong>8. How is this
          accessible?</strong> Labeled columns.
          Keyboard drag with announcements.
          Tab between columns. Cross-column
          moves explicit in announcements.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A Kanban board is{" "}
          <strong>multiple drag-and-drop lists +
          shared drag context + real-time
          sync + optimistic persistence</strong>.
          Last-write-wins handles conflicts;
          mid-drag conflicts defer; keyboard
          cross-column drag gives parity.
          The result is direct-manipulation
          workflows that scale across users
          and devices.
        </p>
      </section>
    </ArticleLayout>
  );
}
