"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-kanban-board",
  title: "Design a Kanban Board",
  description:
    "Production-grade Kanban board with drag across columns, swimlanes, real-time multi-user updates, optimistic reordering, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "kanban-board",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: ["lld", "kanban", "drag-drop", "real-time", "optimistic-ui", "swimlanes", "accessibility"],
  relatedTopics: ["drag-drop-list", "chat-messaging-ui", "dashboard-builder"],
};

export default function KanbanBoardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a Kanban board — a visual project management tool with columns
          representing workflow stages (e.g., Backlog, In Progress, Done) and cards
          representing tasks. Users drag cards between columns to update their status.
          The system must support swimlanes for horizontal categorization, real-time
          multi-user collaboration with optimistic updates, and full keyboard accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Columns are fixed or configurable (3-7 columns typical).</li>
          <li>Cards contain title, assignee, labels, due date, and description.</li>
          <li>Multiple users can edit the board simultaneously via WebSocket.</li>
          <li>Cards can be dragged between columns and reordered within a column.</li>
          <li>Swimlanes provide horizontal grouping (e.g., by team, priority, epic).</li>
          <li>The component is used in a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Drag Between Columns:</strong> Cards can be dragged from one column to another, updating their status.</li>
          <li><strong>Reorder Within Column:</strong> Cards can be reordered within a column via drag.</li>
          <li><strong>Swimlanes:</strong> Horizontal grouping with collapsible sections.</li>
          <li><strong>Real-Time Updates:</strong> WebSocket pushes card moves from other users, merged optimistically.</li>
          <li><strong>Optimistic Reordering:</strong> UI updates instantly on drag, rolls back on API failure.</li>
          <li><strong>Card Creation:</strong> Add new card at bottom of any column via &quot;+ Add card&quot; button.</li>
          <li><strong>Card Editing:</strong> Inline editing of card title, labels, assignee.</li>
          <li><strong>Column Management:</strong> Add, rename, reorder, and delete columns.</li>
          <li><strong>Filtering:</strong> Filter cards by assignee, label, or text search.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Drag operations at 60fps using CSS transforms. Board with 200+ cards renders smoothly.</li>
          <li><strong>Accessibility:</strong> Full keyboard navigation between cards and columns. Screen reader announces card moves.</li>
          <li><strong>Real-Time Latency:</strong> WebSocket updates applied within 200ms of broadcast.</li>
          <li><strong>Type Safety:</strong> Full TypeScript for card, column, and board types.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Two users move the same card simultaneously — last-write-wins with conflict detection.</li>
          <li>WebSocket disconnects during drag — optimistic update must rollback on reconnect failure.</li>
          <li>Column deleted while a card is being dragged into it — drop must be rejected gracefully.</li>
          <li>Board has 500+ cards — virtualization needed for column rendering.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>board state store</strong> (Zustand) holding columns
          and cards as normalized data. A <strong>drag-and-drop system</strong> using
          Pointer Events handles card movement between columns and within-column
          reordering. <strong>WebSocket integration</strong> broadcasts moves to other
          users and merges incoming moves with optimistic local state. The board renders
          columns as flex items with cards as draggable elements.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Third-party library (@hello-pangea/dnd, dnd-kit):</strong> Battle-tested but heavy bundle size and limited real-time merge logic.</li>
          <li><strong>HTML5 Drag and Drop API:</strong> Works for mouse but not touch devices. Pointer Events provide unified support.</li>
        </ul>
        <p>
          <strong>Why custom implementation is optimal:</strong> Full control over drag
          mechanics, real-time merge conflict resolution, and accessibility. The
          normalized store makes optimistic updates and rollback trivial.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>kanban-types.ts</code>)</h4>
          <p>Defines <code>Card</code>, <code>Column</code>, <code>Swimlane</code>, <code>Board</code>, <code>DragState</code> (source column, card id, drop target), and <code>BoardAction</code> (add, move, reorder, delete).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Board Store (<code>board-store.ts</code>)</h4>
          <p>Zustand store with normalized data: <code>cards: Map&lt;id, Card&gt;</code>, <code>columns: Column[]</code> with card ID arrays, <code>swimlanes: Swimlane[]</code>. Actions: moveCard, reorderCard, addCard, deleteCard, applyRemoteUpdate, rollback.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Drag System (<code>kanban-drag.ts</code>)</h4>
          <p>Pointer event-based drag: pointerdown on card captures pointer, pointermove on document computes position, pointerup triggers drop resolution. Drop target computed by hit-testing against column and card bounding boxes.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. WebSocket Manager (<code>websocket-manager.ts</code>)</h4>
          <p>Manages WebSocket connection, sends board actions on local moves, receives remote actions from other users. Handles reconnect with exponential backoff, message buffering during offline.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Conflict Resolver (<code>conflict-resolver.ts</code>)</h4>
          <p>Handles concurrent edits: when two users move the same card, uses vector clock or timestamp-based last-write-wins. Detects conflicts by comparing card version numbers. On conflict, applies remote state and notifies user.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Optimistic Update Manager (<code>optimistic-manager.ts</code>)</h4>
          <p>On drag drop, immediately applies the move to the store, generates a pending action ID, sends to server. On server confirmation, marks as committed. On failure, rolls back to pre-move state using snapshot.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Keyboard Navigation (<code>kanban-keyboard.ts</code>)</h4>
          <p>Arrow keys move focus between cards and columns. Enter opens card detail. Space picks up a card for keyboard drag. Escape cancels drag. Tab navigates between columns.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/kanban-board-architecture.svg"
          alt="Kanban board architecture showing optimistic updates, WebSocket sync, and drag-drop management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Board loads: store fetches columns and cards via API, hydrates normalized state.</li>
          <li>User drags card from &quot;In Progress&quot; to &quot;Done&quot;.</li>
          <li>Drag system computes drop target (Done column, index 2).</li>
          <li>Optimistic manager snapshots current state, applies move, sends to WebSocket.</li>
          <li>Store updates: card removed from In Progress, inserted into Done at index 2.</li>
          <li>Server confirms move, marks pending action as committed.</li>
          <li>Other users receive the move via WebSocket, apply to their stores.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is: user drag → drop target resolution → optimistic apply →
          WebSocket send → server confirmation → commit or rollback. Remote moves from
          other users flow: WebSocket receive → conflict check → store update → UI re-render.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Concurrent moves:</strong> When two users move the same card, the server resolves using last-write-wins based on vector clocks. The losing client receives the winning state and applies it, showing a brief &quot;Card was moved by another user&quot; notification.</li>
          <li><strong>WebSocket disconnect during drag:</strong> The optimistic update remains in the UI. On reconnect, the pending action is replayed. If the server rejects (e.g., column was deleted), the client rolls back.</li>
          <li><strong>Large boards (500+ cards):</strong> Columns with many cards use virtualized rendering — only visible cards in the viewport are rendered. The drag placeholder maintains the correct height.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes: normalized Zustand store
            with optimistic updates, Pointer Events drag system, WebSocket manager with
            reconnect logic, conflict resolver with vector clocks, keyboard navigation,
            swimlane rendering, and card detail modal.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types &amp; Interfaces</h3>
        <p>
          <code>Card</code> with id, title, columnId, swimlaneId, position, assignee,
          labels, dueDate, version. <code>Column</code> with id, title, cardIds array,
          order. <code>Swimlane</code> with id, title, collapsed state. <code>DragState</code>
          with source column, card id, current position, drop target.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Board Store</h3>
        <p>
          Normalized Zustand store: cards Map for O(1) card lookup, columns array with
          ordered cardIds. Actions manipulate the normalized data — moveCard removes card
          ID from source column, inserts into target column at position, increments card
          version. Snapshot captures full state before optimistic move for rollback.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules 3-7: Drag, WebSocket, Conflict, Optimistic, Keyboard</h3>
        <p>
          Pointer drag uses document-level listeners for cross-column movement. WebSocket
          manager buffers messages during disconnect and replays on reconnect. Conflict
          resolver compares vector clocks to detect concurrent edits. Optimistic manager
          snapshots state, applies move, tracks pending actions by ID. Keyboard navigation
          uses roving tabindex pattern across cards and columns.
        </p>
      </section>

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
                <td className="p-2">moveCard</td>
                <td className="p-2">O(n) — column array splice</td>
                <td className="p-2">O(1) — Map update</td>
              </tr>
              <tr>
                <td className="p-2">Drop target resolution</td>
                <td className="p-2">O(c × k) — c columns, k cards per column</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Conflict detection</td>
                <td className="p-2">O(1) — version comparison</td>
                <td className="p-2">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Column re-rendering on every move:</strong> Moving a card triggers re-renders of both source and target columns. Mitigation: Zustand selectors subscribe each column component only to its own cardIds, so only the affected columns re-render.</li>
          <li><strong>Hit-testing against all cards during drag:</strong> Computing drop target by checking every card bounding box is O(n). Mitigation: check column bounding boxes first (O(c)), then only cards within the target column.</li>
          <li><strong>WebSocket message flooding:</strong> Rapid moves generate many messages. Mitigation: debounce local actions at 100ms before sending, coalesce multiple moves of the same card into a single message.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Virtualized columns:</strong> For columns with 50+ cards, render only visible cards using a custom virtualizer (similar to the Infinite Scroll article&apos;s approach).</li>
          <li><strong>CSS transforms during drag:</strong> Use <code>transform: translate()</code> for the dragged card ghost instead of updating DOM position. GPU-composited, no layout thrashing.</li>
          <li><strong>Web Worker for conflict resolution:</strong> Offload vector clock comparison to a Web Worker for boards with 10+ concurrent users.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Card titles and descriptions from user input are sanitized before rendering.
          WebSocket messages are validated against a schema (Zod or similar) before
          applying to the store to prevent malformed remote state updates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>Tab moves focus between columns. ArrowLeft/Right moves between columns.</li>
            <li>ArrowUp/Down moves focus between cards within a column.</li>
            <li>Space picks up the focused card for keyboard drag. Arrow keys move it, Enter drops, Escape cancels.</li>
            <li>Enter on a card opens the detail modal. Escape closes the modal.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <ul className="space-y-2">
            <li>The board has <code>role=&quot;application&quot;</code> with <code>aria-label=&quot;Kanban board&quot;</code>.</li>
            <li>Each column has <code>role=&quot;list&quot;</code> with <code>aria-label</code> showing the column name and card count.</li>
            <li>Each card has <code>role=&quot;listitem&quot;</code> with <code>aria-grabbed</code> during drag.</li>
            <li>An <code>aria-live=&quot;assertive&quot;</code> region announces card moves: &quot;Task moved from In Progress to Done&quot;.</li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>WebSocket authentication:</strong> Each WebSocket message includes a JWT. The server verifies the user has permission to modify the board and the specific card.</li>
          <li><strong>Rate limiting:</strong> Server-side rate limit on board actions (max 10 moves per second per user) to prevent abuse.</li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Board store:</strong> Test moveCard updates both source and target columns, preserves card order, increments version. Test rollback restores pre-move state exactly.</li>
          <li><strong>Conflict resolver:</strong> Test concurrent moves detected via version mismatch, last-write-wins applied correctly, losing client notified.</li>
          <li><strong>WebSocket manager:</strong> Test message send/receive, reconnect with exponential backoff, offline buffering and replay.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Drag between columns:</strong> Simulate drag via pointer events, verify card moves in store, verify WebSocket message sent, verify server confirmation commits the move.</li>
          <li><strong>Real-time sync:</strong> Open two board instances, move card in one, verify it appears in the other within 200ms.</li>
          <li><strong>Keyboard drag:</strong> Focus card, press Space to pick up, ArrowRight to move to next column, Enter to drop. Verify store state updated.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>WebSocket disconnect during drag: verify optimistic update rolls back on reconnect failure.</li>
          <li>Concurrent moves of same card: verify conflict detection and resolution.</li>
          <li>500-card board: verify virtualized columns render correctly, drag target resolution is accurate.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>No optimistic updates:</strong> Waiting for server confirmation before updating the UI makes the board feel sluggish. Staff-level candidates should propose optimistic updates with rollback.</li>
          <li><strong>Denormalized store:</strong> Storing cards inside column objects makes cross-column moves complex (search, remove, insert). Normalized Map-based store simplifies moves to O(1) card update + O(n) column splice.</li>
          <li><strong>Not handling disconnect:</strong> If the WebSocket drops during a drag, the card&apos;s state is inconsistent. Candidates must discuss offline buffering and reconnect reconciliation.</li>
          <li><strong>Ignoring keyboard accessibility:</strong> A drag-only board is completely inaccessible. Keyboard drag (Space to pick up, Arrows to move, Enter to drop) is essential.</li>
          <li><strong>No conflict resolution:</strong> With multiple users, concurrent edits are inevitable. Without conflict detection, the board state diverges.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Optimistic vs Pessimistic Updates</h4>
          <p>
            Optimistic updates give instant feedback but risk inconsistency if the server
            rejects the move. Pessimistic updates (wait for server) are consistent but
            slow. For a Kanban board, optimistic is preferred because card moves are
            rarely rejected (unlike, say, a payment). Rollback on failure is acceptable
            UX — show a toast &quot;Move failed, card returned to previous column&quot;.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Pointer Events vs HTML5 Drag and Drop</h4>
          <p>
            HTML5 DnD has native drag image support but does not work on touch devices.
            Pointer Events work on mouse, touch, and pen. The trade-off: Pointer Events
            require manual drag image creation and hit-testing. For a Kanban board,
            Pointer Events are the right choice because touch support is mandatory.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement undo/redo for board actions?</p>
            <p className="mt-2 text-sm">
              A: Maintain a command history stack. Each action (move, add, delete) records
              an inverse action. Undo pops the last command and executes its inverse. Redo
              re-executes the original command. Limit the stack to 50 entries to bound
              memory. For multi-user undo, only undo local actions — remote actions from
              other users remain applied.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle card dependencies (blocked by, blocks)?</p>
            <p className="mt-2 text-sm">
              A: Add <code>dependencies: string[]</code> to the Card type. When rendering,
              draw dependency lines between cards (SVG overlay on the board). When moving
              a card to &quot;Done&quot;, check if any dependencies are unresolved and
              show a warning. Dependencies are stored as card ID references and resolved
              at render time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement WYSIWYG inline card editing?</p>
            <p className="mt-2 text-sm">
              A: Double-clicking a card title switches to an inline input field. On blur
              or Enter, the updated title is sent to the store and broadcast via WebSocket.
              Use a contentEditable div or a controlled input. Debounce the update at
              500ms to avoid sending every keystroke.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support offline mode (PWA)?</p>
            <p className="mt-2 text-sm">
              A: Store the full board state in IndexedDB. On disconnect, queue all local
              actions in IndexedDB. On reconnect, replay the queue in order. If a
              conflict is detected during replay, apply the server state and notify the
              user. Use a Service Worker to intercept API calls and respond with cached
              data when offline.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent layout thrashing during drag?</p>
            <p className="mt-2 text-sm">
              A: During drag, the ghost card uses <code>position: fixed</code> with
              <code>transform: translate()</code> — GPU-composited, no layout. The
              placeholder in the source column uses a fixed-height div matching the
              original card. Drop target resolution uses pre-cached bounding boxes
              (updated via ResizeObserver) instead of <code>getBoundingClientRect()</code>
              during the drag frame.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement board-level permissions (viewer, editor, admin)?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>role</code> field to the user-board relationship. The store
              checks the role before allowing mutations: viewers can only read, editors
              can move/add/delete cards, admins can modify columns and board settings.
              The UI disables drag and edit controls for viewers. The server also enforces
              permissions on every WebSocket action.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.atlassian.com/agile/kanban" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Atlassian — Kanban Guide
            </a>
          </li>
          <li>
            <a href="https://dndkit.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              dnd-kit — Modern Drag and Drop for React
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Pointer Events API
            </a>
          </li>
          <li>
            <a href="https://martin.kleppmann.com/2016/01/26/crdts-the-hard-parts.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Kleppmann — CRDTs and Conflict Resolution
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Grid Pattern — Keyboard Navigation
            </a>
          </li>
          <li>
            <a href="https://zustand-demo.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — Normalized State Management
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
