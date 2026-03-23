"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-undo-redo-functionality-extensive",
  title: "Undo/Redo Functionality",
  description:
    "Staff-level deep dive into undo/redo architecture, command pattern implementation, history stack management, collaborative undo strategies, and systematic approaches to building reversible user interactions.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "undo-redo-functionality",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "undo redo",
    "command pattern",
    "state management",
    "history",
    "user experience",
  ],
  relatedTopics: [
    "state-management",
    "optimistic-ui-updates",
    "error-states",
    "keyboard-shortcuts",
  ],
};

export default function UndoRedoFunctionalityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Undo and redo functionality</strong> provides users with the ability to reverse and reapply their actions, creating a safety net that encourages exploration and reduces the anxiety of making mistakes. The undo operation reverts the most recent action, restoring the application state to what it was before that action occurred. The redo operation reapplies the most recently undone action, moving the state forward again. Together, they allow users to navigate backward and forward through their action history, treating application state as a timeline that can be traversed in either direction.
        </p>
        <p>
          The psychological impact of undo functionality is profound. Research in human-computer interaction demonstrates that users who have confidence in undo explore more aggressively, make more creative decisions, and experience lower cognitive load because they do not need to carefully evaluate every action before taking it. The absence of undo forces users into a cautious, deliberate mode where every change must be considered carefully because it might be irreversible. In productivity applications, this caution directly translates to slower task completion and lower user satisfaction. Undo transforms the user&apos;s relationship with the application from &ldquo;I must be careful&rdquo; to &ldquo;I can experiment freely.&rdquo;
        </p>
        <p>
          At the staff and principal engineer level, undo/redo is an architectural challenge that touches state management, data structures, performance, persistence, and collaborative editing. The implementation must answer several fundamental questions: What constitutes a single undoable action (granularity)? How many actions should the history retain (depth)? How should the history interact with server-side state (persistence)? How should undo work when multiple users are editing the same data concurrently (collaboration)? What happens when an undo cannot be applied because the preconditions have changed (conflict resolution)? These questions have different answers depending on the application domain — a text editor, a visual design tool, a spreadsheet, and a project management application each have different requirements for undo behavior.
        </p>
        <p>
          The command pattern is the foundational design pattern for implementing undo/redo. Each user action is encapsulated in a command object that knows how to execute itself (apply the action) and how to reverse itself (undo the action). Commands are stored in a history stack — the undo stack holds executed commands in order, and the redo stack holds undone commands waiting to be reapplied. When the user performs a new action, it pushes onto the undo stack and clears the redo stack (since the new action invalidates the previously undone future). This pattern decouples the action from its execution context, enabling serialization, batching, and replayability of user actions — capabilities that extend well beyond basic undo/redo into areas like collaborative editing, audit logging, and time-travel debugging.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Command Pattern:</strong> A behavioral design pattern where each user action is encapsulated as an object with execute (apply the action) and undo (reverse the action) methods. The command object captures all the information needed to perform and reverse the action — the target entity, the previous value, the new value, and any context required for execution. This encapsulation enables storing actions in a history stack, serializing them for persistence, and transmitting them for collaborative editing.
          </li>
          <li>
            <strong>History Stack:</strong> A data structure that maintains an ordered sequence of executed commands, enabling traversal backward (undo) and forward (redo). The stack has a pointer that indicates the current position in the history — everything before the pointer has been executed, everything after has been undone. New actions are inserted at the pointer position, and any undone actions after the pointer are discarded. The stack may have a maximum depth to limit memory consumption.
          </li>
          <li>
            <strong>Action Granularity:</strong> The level of detail at which user interactions are recorded as individual undoable actions. Fine granularity records every keystroke as a separate action, allowing character-by-character undo but creating an unwieldy history. Coarse granularity records an entire editing session or form submission as a single action, simplifying history but providing limited undo precision. The optimal granularity depends on the application — text editors typically group keystrokes into word or sentence boundaries, while design tools record each property change as a separate action.
          </li>
          <li>
            <strong>Action Grouping (Compound Commands):</strong> The practice of combining multiple low-level operations into a single undoable unit. When a user applies a &ldquo;find and replace all&rdquo; operation that modifies fifty occurrences, these fifty changes should undo as a single action, not require fifty individual undos. Grouping is also used for drag-and-drop operations (start position, intermediate moves, and final position form one undoable action) and batch operations (selecting multiple items and deleting them).
          </li>
          <li>
            <strong>Snapshot-Based Undo:</strong> An alternative to command-based undo where the entire application state is captured as a snapshot at each action boundary. Undo restores the previous snapshot. This approach is simpler to implement because it does not require individual actions to know how to reverse themselves, but it consumes more memory (each snapshot is a full copy of the state) and does not support selective undo of individual actions. Immutable data structures (like those in Immer or Immutable.js) make snapshot-based undo more practical by sharing unchanged portions of the state between snapshots.
          </li>
          <li>
            <strong>Selective Undo:</strong> The ability to undo a specific action from the middle of the history without undoing subsequent actions. Standard linear undo requires reverting all actions between the current state and the target action. Selective undo checks whether the target action can be reversed independently — whether its undo does not conflict with any subsequent actions — and applies the reversal surgically. This is significantly more complex to implement but valuable in collaborative environments where one user may want to undo their own action without undoing other users&apos; subsequent changes.
          </li>
          <li>
            <strong>Undo Scope:</strong> The boundary within which undo operates. Global undo affects the entire application state. Document-level undo is scoped to a specific document or workspace. Component-level undo is limited to a specific UI region (a text field, a canvas, a form). Most applications use document-level undo, but complex applications with multiple independent editing contexts may need component-level scoping to prevent undo in one area from unexpectedly affecting another.
          </li>
          <li>
            <strong>Redo Branch Pruning:</strong> The behavior that occurs when a user undoes several actions and then performs a new action. The standard approach discards all undone actions (the redo stack is cleared), making the new action the new &ldquo;head&rdquo; of history. An alternative approach preserves the undone branch, creating a tree of history rather than a linear stack. Tree-based history is more complex but never loses user actions — users can navigate to any point in their editing history, not just forward and backward along a single line.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the command pattern architecture for undo/redo. User actions are captured by action creators that produce command objects. Each command contains the action type, target entity, old value (for undo), new value (for redo), a timestamp, and optional metadata. The history manager maintains the undo stack and redo stack, with a pointer indicating the current position. When the user performs an action, the command is executed and pushed onto the undo stack while the redo stack is cleared. When the user undoes, the top command is popped from the undo stack, its undo method is called, and it is pushed onto the redo stack. Redo reverses this process. The history manager also handles action grouping, depth limiting, and persistence.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/undo-redo-functionality-diagram-1.svg"
          alt="Command pattern architecture for undo/redo showing command objects, undo/redo stacks, and history manager with action flow"
          width={900}
          height={500}
        />
        <p>
          The second diagram compares snapshot-based and command-based undo approaches. In the snapshot approach, the full application state is captured at each action boundary — State 0, State 1, State 2, State 3 — and undo simply restores the previous snapshot. With immutable data structures, unchanged portions of the state are shared between snapshots (structural sharing), reducing memory overhead significantly. In the command approach, only the delta (the command object) is stored between states, and undo applies the reverse delta to reconstruct the previous state. The diagram shows the memory trade-off: snapshots with structural sharing use moderate memory with O(1) undo, while commands use minimal memory for storage but O(n) time for arbitrary time-travel (must replay all commands from the initial state). The hybrid approach stores periodic snapshots as checkpoints with commands between them, balancing memory and time complexity.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/undo-redo-functionality-diagram-2.svg"
          alt="Comparison of snapshot-based and command-based undo showing memory usage, structural sharing, and time complexity trade-offs"
          width={900}
          height={500}
        />
        <p>
          The third diagram depicts undo/redo behavior in a collaborative editing environment. Multiple users (User A, User B) are editing the same document concurrently. Each user has their own local undo history. When User A undoes their action, the system must determine whether the undo conflicts with User B&apos;s subsequent changes. If User A changed paragraph 1 and User B changed paragraph 2, the undo can be applied independently. If both users modified the same paragraph, the system must transform User A&apos;s undo operation against User B&apos;s changes using operational transformation or CRDT algorithms. The diagram shows the transformation flow, conflict detection, and resolution strategies for collaborative undo.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/undo-redo-functionality-diagram-3.svg"
          alt="Collaborative undo/redo showing per-user undo histories, operational transformation, and conflict resolution between concurrent edits"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Command Pattern</td>
              <td className="px-4 py-2">Minimal memory per action (stores only deltas), supports serialization and replay, enables selective undo, naturally supports action metadata and logging, scalable to large histories</td>
              <td className="px-4 py-2">Each action type needs explicit undo logic, complex to implement for actions with side effects, state reconstruction requires replaying commands from a checkpoint, fragile if undo logic has bugs</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Snapshot-Based</td>
              <td className="px-4 py-2">Simple to implement (no per-action undo logic needed), instant state restoration, immune to undo logic bugs since it restores actual state, works for any state shape</td>
              <td className="px-4 py-2">Higher memory usage without structural sharing, does not support selective undo, no action metadata for auditing, full state copy on every action without immutable data structures</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Linear History</td>
              <td className="px-4 py-2">Simple mental model for users, straightforward implementation, predictable behavior, universally understood Ctrl+Z pattern</td>
              <td className="px-4 py-2">Redo branch is lost when new actions are performed after undo, no way to recover discarded futures, undo must be sequential (cannot skip actions)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Tree-Based History</td>
              <td className="px-4 py-2">Never loses user actions, supports branching exploration, enables returning to any historical state, more powerful for creative workflows</td>
              <td className="px-4 py-2">Complex UI needed to navigate branches, difficult mental model for most users, higher memory usage, rare in consumer applications</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Per-User Collaborative Undo</td>
              <td className="px-4 py-2">Each user undoes only their own actions, intuitive in collaborative contexts, does not disrupt other users&apos; work</td>
              <td className="px-4 py-2">Requires operational transformation or CRDT for conflict resolution, complex to implement correctly, may produce unexpected states when undoing interleaved operations</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Choose the right action granularity for your domain.</strong> Text editors should group keystrokes into logical units — undo should reverse a word or sentence, not individual characters. Design tools should treat each property change as a separate action so users can fine-tune adjustments. Spreadsheets should group all changes from a single formula entry. Study how users think about their actions in your specific domain and align undo granularity with their mental model of what constitutes a single &ldquo;change.&rdquo;
          </li>
          <li>
            <strong>Implement action grouping for compound operations.</strong> When a user action triggers multiple state changes (a &ldquo;move to folder&rdquo; operation that changes both the item&apos;s parent and updates folder counts), group these changes into a single undoable action. Without grouping, the user would need to undo multiple times to reverse what felt like a single action, and intermediate states between grouped operations may be invalid or confusing.
          </li>
          <li>
            <strong>Limit history depth with a configurable maximum.</strong> Unbounded history consumes memory proportional to the total number of actions ever performed. Set a reasonable maximum (typically 50-200 actions for command-based, fewer for snapshot-based) and discard the oldest actions when the limit is exceeded. The appropriate depth depends on the application — document editors may keep hundreds of actions across a session while form-based applications may keep only a dozen. Expose the limit as a configuration option for power users.
          </li>
          <li>
            <strong>Clear the redo stack when new actions are performed.</strong> After the user undoes several actions and then performs a new action, the standard behavior is to discard the redo stack and make the new action the latest in history. This prevents confusing branching scenarios where redo would apply actions from a timeline that the user has explicitly departed from. If your application genuinely needs branching history, implement it explicitly with a tree visualization rather than silently maintaining abandoned redo branches.
          </li>
          <li>
            <strong>Support standard keyboard shortcuts across platforms.</strong> Use <code>Ctrl+Z</code> for undo and <code>Ctrl+Y</code> or <code>Ctrl+Shift+Z</code> for redo on Windows and Linux, and <code>Cmd+Z</code> and <code>Cmd+Shift+Z</code> on macOS. These shortcuts are deeply ingrained in user muscle memory, and deviating from them creates confusion. Register the shortcuts at the appropriate scope — document-level for document editors, component-level for isolated editing regions — and ensure they do not conflict with browser defaults.
          </li>
          <li>
            <strong>Persist undo history across sessions for important work.</strong> In document editing and creative applications, users expect their undo history to survive page refreshes and browser restarts. Serialize the history stack (command objects or state snapshots) to local storage or IndexedDB, and restore it when the document is reopened. Include metadata about when each action was performed so that stale history from previous sessions can be distinguished from current-session history.
          </li>
          <li>
            <strong>Provide visual feedback for undo and redo actions.</strong> When the user undoes an action, briefly highlight or animate the affected area to show what changed. This is especially important in large documents or complex interfaces where the effect of an undo might not be immediately visible in the current viewport. A transient toast notification showing &ldquo;Undone: deleted paragraph&rdquo; provides additional context about what was reversed.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Undo that does not fully reverse the original action.</strong> If an action modifies three fields but the undo only reverses two of them, the application enters an inconsistent state. This is especially dangerous with compound operations where some sub-operations are reversed but others are not. Every command&apos;s undo method must be exhaustively tested to verify that it produces exactly the pre-action state, including all side effects like cache invalidation, UI state changes, and derived data updates.
          </li>
          <li>
            <strong>Character-level granularity in text editing.</strong> Recording every keystroke as a separate undoable action makes the undo stack enormous and forces users to press Ctrl+Z dozens of times to reverse a single sentence. Users think in terms of words, sentences, or editing bursts — group keystrokes by whitespace boundaries or pause detection (a gap of 500 milliseconds or more between keystrokes typically indicates a new logical action).
          </li>
          <li>
            <strong>Not handling undo of server-synchronized actions.</strong> If an action has been synchronized to the server (a comment was posted, a file was saved), undoing it locally creates an inconsistency between client and server state. The undo must either also reverse the server-side action (which may not be possible for all operations) or clearly communicate that the undo is local-only. Failing to address this leads to confusing states where the user sees one thing locally but the server has a different state.
          </li>
          <li>
            <strong>Memory leaks from unbounded snapshot history.</strong> Snapshot-based undo without structural sharing creates a new copy of the entire state for every action. In applications with large state (rich documents, complex data models), this quickly exhausts memory. Either use immutable data structures with structural sharing, switch to command-based undo, or implement periodic pruning that replaces old snapshots with compressed deltas.
          </li>
          <li>
            <strong>Undo that affects elements no longer visible.</strong> When a user undoes an action that affected a now-scrolled-away or collapsed section of the interface, the undo appears to do nothing from the user&apos;s perspective. The application should scroll to or expand the affected area, or at minimum show a notification indicating what was undone and where. Without this feedback, users may repeatedly press undo thinking it is not working.
          </li>
          <li>
            <strong>Not testing undo after applying multiple actions in sequence.</strong> Individual command undo methods may work correctly in isolation but fail when composed. If action A sets field X to 10 and action B sets field X to 20, undoing B should restore X to 10 (from A), not to the original value (before A). This requires undo methods to use the captured pre-action value from their specific execution context, not a hardcoded &ldquo;original&rdquo; value. Test undo at various depths in the history to verify correctness.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Google Docs</strong> implements collaborative undo using operational transformation (OT). Each user has their own undo history, and undoing an action reverses only that user&apos;s specific change without affecting other users&apos; concurrent edits. When User A types &ldquo;hello&rdquo; and User B simultaneously deletes a paragraph, User A can undo their &ldquo;hello&rdquo; without re-inserting User B&apos;s deleted paragraph. This per-user undo requires transforming the undo operation against all intervening operations from other users — a complex algorithm that Google has refined over years of production use. Google Docs also groups keystrokes into word-level actions for undo granularity.
        </p>
        <p>
          <strong>Figma</strong> provides undo/redo for a vector graphics editor with hundreds of possible operations — shape creation, property changes, layer reordering, group operations, Boolean operations, and more. Figma uses the command pattern with action grouping so that a drag-and-drop operation (which generates many intermediate position changes) undoes as a single action. Their history persists across sessions, allowing designers to undo work from previous editing sessions. Figma&apos;s version history feature extends undo beyond the action level to named checkpoints, enabling designers to return to major milestones rather than stepping through individual actions.
        </p>
        <p>
          <strong>VS Code</strong> demonstrates sophisticated undo behavior in a code editor context. Each editor tab has its own undo history, scoped to that file. Multi-cursor edits that modify multiple locations simultaneously undo as a single action. Find-and-replace-all operations undo as one action regardless of how many replacements occurred. VS Code also implements undo grouping based on typing pauses — continuous typing is treated as one undoable action until the user pauses, at which point a new action boundary is created. The undo history survives editor restarts through file-level persistence.
        </p>
        <p>
          <strong>Notion</strong> handles undo in a block-based document editor where each block (paragraph, heading, list item, table, embedded content) can be independently edited, moved, or deleted. Notion&apos;s undo is scoped to the page level and groups related block operations — moving a block and its children undoes as one action. Their implementation must handle the complexity of undo in a content system where blocks can be referenced across pages (through linked databases and synced blocks), ensuring that undo does not create orphaned references or inconsistent cross-page links.
        </p>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://refactoring.guru/design-patterns/command" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Refactoring Guru — Command Pattern
            </a>
          </li>
          <li>
            <a href="https://redux.js.org/usage/implementing-undo-history" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Redux — Implementing Undo History
            </a>
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/undo/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Undo, a Powerful Interaction Design Pattern
            </a>
          </li>
          <li>
            <a href="https://immerjs.github.io/immer/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Immer — Immutable State with Structural Sharing
            </a>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Operational_transformation" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Wikipedia — Operational Transformation
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you implement undo/redo for a rich text editor?
          </p>
          <p className="mt-2">
            A: I would use the command pattern where each editing operation (insert text, delete text, format change, block insertion) is represented as a command object with execute and undo methods. For text insertion, the undo captures the position and length of inserted text; for deletion, the undo captures the position and content of deleted text; for formatting, the undo captures the previous formatting state of the affected range. I would group keystrokes into logical units based on whitespace boundaries and typing pauses — when the user types a word and pauses for 500ms, that word becomes one undoable action. Compound operations like find-and-replace-all would be grouped into a single command. The history would be scoped to the document level with a configurable maximum depth (100-200 actions). I would use Immer for state snapshots, providing structural sharing to keep memory efficient while making state restoration trivial. The history would persist to IndexedDB for session survival, keyed by the document ID and a timestamp for versioning.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: What are the trade-offs between command-based and snapshot-based
            undo?
          </p>
          <p className="mt-2">
            A: Command-based undo stores only the delta for each action, using minimal memory per action, but requires every action type to implement a correct undo method and reconstructing an arbitrary past state requires replaying all commands from a checkpoint. Snapshot-based undo stores the full application state at each action boundary, using more memory but providing instant O(1) state restoration with no risk of undo logic bugs since it restores the actual state. With immutable data structures and structural sharing (e.g., Immer or Immutable.js), snapshot memory overhead is dramatically reduced because unchanged portions of the state are shared between snapshots. I would choose snapshots with structural sharing for applications with moderate state size and many action types (the engineering cost of writing and testing undo methods for every action type is high). I would choose commands for applications with very large state where even structural sharing is expensive, or when I need action metadata for auditing, replay, or collaborative editing.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you implement undo in a collaborative editing
            environment?
          </p>
          <p className="mt-2">
            A: Collaborative undo requires per-user undo histories and operational transformation (OT) or CRDT-based conflict resolution. Each user&apos;s actions are tracked in their own history stack. When User A presses undo, the system identifies User A&apos;s most recent action and generates an inverse operation. This inverse operation must then be transformed against all subsequent operations from other users that have been applied since User A&apos;s original action. For example, if User A inserted text at position 10 and User B subsequently inserted text at position 5 (shifting everything right by User B&apos;s text length), User A&apos;s undo must delete from position 10 plus the offset caused by User B&apos;s insertion. The transformation ensures that User A&apos;s undo only reverses User A&apos;s specific change without disrupting User B&apos;s work. This is algorithmically complex but well-studied — libraries like Yjs and ShareDB provide CRDT and OT primitives that handle the transformation logic.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you determine the right granularity for undoable actions?
          </p>
          <p className="mt-2">
            A: The right granularity aligns with the user&apos;s mental model of what constitutes a single action. I would use several heuristics. For text input, group by natural language boundaries — a word or sentence — detected by whitespace characters or typing pauses (a 500ms gap between keystrokes indicates a new logical action). For property changes, each discrete change is one action (changing font size from 12 to 14 is one action). For drag-and-drop, the entire drag sequence from pick-up to drop is one action. For batch operations (select all, delete), the entire batch is one action. I would also consider time-based grouping as a secondary signal — rapid sequential changes within a short window (under one second) are likely part of the same logical action. The key test is: &ldquo;If the user presses Ctrl+Z once, would they be surprised by the amount that was undone?&rdquo; If the undo feels too small (character-level), group more aggressively. If it feels too large (entire session), split into finer actions.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How would you handle undo for actions that have already been
            persisted to the server?
          </p>
          <p className="mt-2">
            A: This depends on the operation type and the server&apos;s capability. For operations that the server can reverse (soft-deleted records, version-controlled documents), the undo sends a corresponding reverse API call — an undelete, a version revert, a property update back to the previous value. For operations that the server cannot reverse (sent emails, published posts, processed payments), the client-side undo can only warn the user that the action cannot be undone. For intermediate cases, I would implement a &ldquo;grace period&rdquo; pattern — the client sends the action to the server but the server delays actual execution for a configurable window (5-30 seconds). During this window, the client can send a cancellation request that prevents execution. This is how Gmail&apos;s &ldquo;Undo Send&rdquo; works — the email is not actually sent until the undo window closes. The grace period approach provides server-side reversibility for operations that would otherwise be irreversible, at the cost of delayed execution visibility to other users.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
