"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-undo-redo",
  title: "Undo/Redo System",
  description:
    "Production-grade undo/redo with command pattern, state snapshots, selective undo, and conflict resolution in collaborative editing.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "undo-redo",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "undo-redo", "command-pattern", "state-management", "history"],
  relatedTopics: ["finite-state-machines", "derived-state", "time-travel-debugging"],
};

export default function UndoRedoArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Users perform edits (delete text, move shape, change color). Without undo, mistakes are permanent. With undo, users can revert mistakes instantly. Key challenges: maintaining history (every edit), reverting state (how to go back?), redo (after undo, can redo), and selective undo (undo only specific action, not all).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Naive approach: store all previous states (expensive in memory). Better: store commands (edit description, not full state). Replay commands to reconstruct state. For collaborative editing, selective undo is complex (undo your change, not other users' changes).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key insight: undo is about reverting the effect of a command, not necessarily reverting state. Example: if user A inserts text, user B modifies it, user A's undo should remove the inserted text (adjusted for B's modification). This distinction becomes critical in collaborative systems where state is shared and mutations from different users are interleaved.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Text editors, design tools like Figma, spreadsheet applications, and IDEs all implement undo/redo. The design requirements differ significantly between single-user (simpler) and collaborative multi-user (requires operational transformation or CRDT) scenarios.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Commands are reversible (can compute inverse). History is linear (branching undo is complex). Undo depth is reasonable (100–1000 commands). Collaborative editing uses OT or CRDT for conflict resolution. The command pattern is the primary abstraction.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Undo:</strong> Revert last action (Ctrl+Z). Can undo multiple times, up to history limit.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Redo:</strong> Reapply undone action (Ctrl+Y / Ctrl+Shift+Z). Can redo multiple times.
          </HighlightBlock>
          <li>
            <strong>History Display:</strong> Show list of past actions in UI with descriptive labels.
          </li>
          <li>
            <strong>Command Grouping:</strong> Multiple small actions grouped into single undo unit (e.g., "bold word" = select + apply bold).
          </li>
          <li>
            <strong>Command Merging:</strong> Adjacent similar commands merged (keystroke-by-keystroke typing consolidated into word-level units).
          </li>
          <li>
            <strong>Selective Undo:</strong> Undo specific action from the middle of history, not just the most recent.
          </li>
          <li>
            <strong>History Branching:</strong> After undo, new action clears redo stack (linear history).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Undo Limits:</strong> Cap history size (memory management).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Memory:</strong> History limited to 100–1000 commands (configurable). Command objects are much smaller than full state snapshots.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Latency:</strong> Undo executes and reflects in UI within &lt;10ms for simple commands.
          </HighlightBlock>
          <li>
            <strong>Responsiveness:</strong> UI updates immediately after undo/redo (no async operations in the critical path).
          </li>
          <li>
            <strong>Persistence:</strong> History can optionally survive page reload via serialization to localStorage or IndexedDB.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Undo at beginning of history — nothing to undo, must signal gracefully (disabled button, no-op).</li>
          <li>Redo with empty redo stack — nothing to redo.</li>
          <li>Action that cannot be undone (external API call, email sent) — mark as non-undoable, skip in undo chain.</li>
          <li>Collaborative editing: user A undoes, user B's changes must not be lost or corrupted.</li>
          <li>Very large commands (paste 100KB of text) — command object itself is large, but still preferable to full state snapshot.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">Implement the command pattern: each action is a Command object with execute() and undo() methods. Maintain two stacks: undo stack (executed commands) and redo stack (undone commands).</HighlightBlock>
<HighlightBlock as="p" tier="important">On action: execute command, push to undo stack, clear redo stack. On undo: pop from undo stack, call command.undo(), push to redo stack. On redo: pop from redo stack, call command.execute(), push to undo stack.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For collaborative editing, commands are tagged with the userId. Selective undo identifies the target user's most recent command, constructs its inverse, and transforms the inverse against all subsequent commands from other users before applying it. This is the operational transformation approach used in Google Docs.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/undo-redo.svg"
          alt="Undo redo system with command stack model, command pattern with execute and undo methods, snapshot pattern, selective undo, and keyboard shortcuts"
          caption="Undo redo system with command stack model, command pattern with execute and undo methods, snapshot pattern, selective undo, and keyboard shortcuts"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Command Pattern Deep Dive</h3>
        <p>
          Each action is encapsulated as a Command object implementing a standard interface: execute() applies the action, undo() reverses it, canMerge(otherCommand) indicates whether it can be merged with the previous command, and a description string for UI display.
        </p>
        <p>
          The command captures all information needed to both execute and undo the operation. A SetTitleCommand stores newTitle (for execute) and prevTitle (captured at execution time, for undo). The execute function applies newTitle to the document; undo restores prevTitle. Neither references external mutable state — everything needed for reversal is captured at the moment of initial execution.
        </p>
        <p>
          For complex operations like moving a shape from one coordinate to another, the command should capture the shape identifier plus both the original position and the destination position. Execute moves the shape to the destination position; undo restores it to the original position. The command remains self-contained and does not depend on reading the current mutable shape state at undo time, which is critical because intervening commands may have modified the shape.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">History Stack Management</h3>
        <p>
          The UndoManager maintains two stacks: undoStack (Array of Commands) and redoStack (Array of Commands). The stacks have a maximum capacity (configurable, typically 100 for design tools, 1000 for text editors). When the undo stack is at capacity and a new command is pushed, the oldest command is dropped from the bottom of the stack.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The invariant "new action clears redo stack" is enforced by the UndoManager: every call to execute() calls redoStack.clear() after pushing to undoStack. This implements linear history — after undoing 5 steps and then making a new edit, those 5 redo steps are permanently gone. This matches user mental models ("I made a change, so redo is no longer valid") and is the design chosen by virtually all major applications.
        </HighlightBlock>
        <p>
          For applications that want branching history (DAG of possible futures), a tree structure replaces the stack. Each node stores the command and pointers to children (possible redo branches). This is significantly more complex to implement and almost never expected by users, so it's generally reserved for specialized tools (version-control-aware editors, time-travel debugging systems).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Command Grouping (Transactions)</h3>
        <p>
          Multiple atomic commands can be grouped into a single undo unit — a CompositeCommand. Example: "bold the selected word" comprises three individual commands: SaveSelectionCommand, SetBoldCommand, RestoreSelectionCommand. Wrapped in a CompositeCommand("Bold Selection"), they appear as a single undo step. Undoing "Bold Selection" executes all three commands' undo() methods in reverse order.
        </p>
        <p>
          The UndoManager provides beginTransaction() and commitTransaction(). Commands executed between these calls are collected into a CompositeCommand. On commit, the CompositeCommand is pushed to the undo stack as a single unit. Transactions can be nested — inner transactions become sub-CompositeCommands of the outer CompositeCommand.
        </p>
        <p>
          Transaction rollback (if an operation fails midway): the UndoManager can abort a transaction by calling undo() on all commands executed since beginTransaction(), restoring the state to before the transaction started. This is the transactional safety guarantee needed for multi-step operations that must succeed atomically.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Command Merging</h3>
        <p>
          Without merging, typing a 50-character sentence creates 50 individual InsertCharacter commands — each Ctrl+Z removes one character. Users expect typing to undo in word-level chunks. Command merging addresses this: when a new command is pushed to the undo stack, the UndoManager checks if it can merge with the top command via canMerge().
        </p>
        <HighlightBlock as="p" tier="important">
          InsertCharacterCommand.canMerge(prevCommand): returns true if prevCommand is also an InsertCharacterCommand AND the insertion is adjacent (no cursor movement between characters) AND the time gap between commands is under a threshold (e.g., 500ms — a pause in typing signals a new undo unit). On merge, the top command's content is extended: prev.text = prev.text + this.text. The merged command represents the entire typed word or phrase.
        </HighlightBlock>
        <p>
          This pattern extends to other continuous operations: drag-to-resize, brush strokes in a drawing tool, incremental slider adjustments. The merge condition checks spatial adjacency, temporal proximity, and command type compatibility. Merging happens at push time — the undo stack always contains the latest merged state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Snapshot Pattern as Alternative</h3>
        <p>
          The command pattern stores operations (reversible transformations). An alternative is the snapshot pattern: store the full application state before each operation. Undo = restore the previous snapshot. This is simpler to implement (no inverse computation, no merge logic) but memory-intensive for large application states.
        </p>
        <HighlightBlock as="p" tier="important">
          The hybrid approach uses structural sharing (via Immer) to make snapshots cheap: only the changed subtree of the state is copied; unchanged subtrees share references with previous snapshots. An application with a 1MB state that changes 1KB per operation stores approximately 1KB per snapshot, not 1MB. This makes snapshot-based undo competitive with command-based undo for many applications.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The trade-off: snapshots require O(changed state size) per step, regardless of how conceptually simple the operation was. Command-based requires O(command parameters) per step, but requires implementing and testing the inverse for every command type. For applications with complex business logic and many command types, snapshots with structural sharing are often simpler overall.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Undoable Commands</h3>
        <p>
          Some operations cannot meaningfully be undone: sending an email, publishing a post, making a payment, API calls with external side effects. These should be handled in one of two ways: mark the command as non-undoable (Command.isUndoable = false) and skip it when the undo chain encounters it; or apply a "soft undo" that reverses the local state change but notifies the user that the external action cannot be reversed.
        </p>
        <p>
          When the undo stack contains a non-undoable command, pressing Ctrl+Z should stop at that command, not skip over it and undo earlier undoable commands. Skipping over non-undoable commands would undo changes that the user made after the non-undoable command, which could produce inconsistent state relative to the external action that was taken.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Selective Undo in Collaborative Systems</h3>
        <p>
          In collaborative editors, each user's undo should revert only their own changes. User A's undo should not revert User B's changes, even if B's changes are more recent on the shared history. This selective undo requires tracking authorship on every command and computing the inverse of a command that may need to be adjusted for the intervening changes made by other users.
        </p>
        <p>
          The operational transformation (OT) approach: to undo command C from user A (at position P in history), compute C's inverse (C⁻¹). Transform C⁻¹ against all commands between position P and the current history head that are not from user A. The transformation adjusts C⁻¹'s positions to account for text insertions/deletions by other users that happened after C was originally applied. Apply the transformed C⁻¹ to the current state.
        </p>
        <p>
          This is complex to implement correctly and is the same transformation engine that drives real-time collaborative editing. For most applications, the simpler "last action undo" (not selective) is sufficient and the correct choice. Selective undo is appropriate for: design tools where different users own different elements, document editors where per-user attribution matters, and any system where undo scope is scoped to the individual user's session.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Persistence and Serialization</h3>
        <p>
          Persisting the undo history enables users to undo after page reload — valuable for long editing sessions. The serialization challenge is that commands are objects with methods; JSON cannot serialize functions. Serialization must convert commands to plain-object representations (type, payload) and deserialization must reconstruct them as command instances using a registry (commandRegistry['SetTitle'] → SetTitleCommand).
        </p>
        <p>
          Not all commands need to be persisted. For many applications, persisting the last N commands (rather than all N) is sufficient. Command persistence is most valuable for: document editors (users expect to continue editing after reload), design tools (projects may be open for days), and form-based applications where partially completed work has high recovery value.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI Indicators and Keyboard Shortcuts</h3>
        <p>
          The UndoManager exposes state to the UI: canUndo (undo stack non-empty), canRedo (redo stack non-empty), undoLabel (description of the top command: "Undo Set Title"), redoLabel (description of top redo command). These drive the enabled state and tooltip text of undo/redo buttons.
        </p>
        <HighlightBlock as="p" tier="important">
          Keyboard shortcuts: Ctrl+Z (undo, macOS: Cmd+Z), Ctrl+Y or Ctrl+Shift+Z (redo, macOS: Cmd+Shift+Z). Register these globally (document-level keydown handler) rather than on individual components to ensure they work regardless of focus. Prevent default browser behavior (browser may have its own undo for textarea inputs — decide whether to intercept or delegate based on focus context).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Command Pattern vs Snapshot Pattern</h3>
        <HighlightBlock as="p" tier="important">
          Command pattern is memory-efficient (stores only operation parameters, not full state) but requires implementing and testing inverses for every command type. Snapshot pattern with structural sharing is simpler to implement correctly (no inverse logic) but requires a structural-sharing state management system (Immer). For applications with complex, heterogeneous command types, snapshots with Immer is often the better ROI. For applications with a small, well-defined set of reversible operations, the command pattern is more efficient.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Linear vs Branching History</h3>
        <HighlightBlock as="p" tier="crucial">
          Linear history (new action clears redo) matches user expectations in virtually every mainstream application. Branching history (redo tree) matches the mental model of developers using version control but is genuinely unfamiliar to most users. Unless your application's core value proposition involves non-linear history (a dedicated version-control tool, a time-travel debugging interface), use linear history. The complexity of branching history rarely pays off in user experience.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory vs Depth</h3>
        <HighlightBlock as="p" tier="important">
          A deeper undo history (1000 steps) is more forgiving for users but uses more memory. The right limit depends on the command size and application type. A text editor with merged word-level commands rarely needs more than 100 undo steps in practice. A design tool with individual shape operations may benefit from 500 steps. Profile the typical session's command count and memory usage to calibrate the limit, rather than using an arbitrary default.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">The snapshot pattern with structural sharing (Immer) is a competitive alternative to command-based undo for applications with complex state trees and many heterogeneous command types. For staff-level engineers,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">the critical design decisions are: choose between command vs snapshot pattern based on the complexity of inverse computation vs state tree size; implement command merging before deploying to text-editing scenarios (per-character undo is a usability failure); handle non-undoable commands explicitly; and treat collaborative selective undo as a separate and significantly more complex subsystem requiring OT/CRDT infrastructure.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
