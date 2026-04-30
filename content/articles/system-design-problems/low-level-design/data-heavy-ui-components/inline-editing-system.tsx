"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-inline-editing-system",
  title: "Design an Inline Editing System",
  description:
    "LLD for inline editing: cell-level edit mode, type-aware editors, validation, optimistic save with rollback, undo, conflict handling, and accessibility.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "inline-editing-system",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "inline-editing",
    "optimistic-updates",
    "validation",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "spreadsheet-like-grid",
    "form-validation-engine",
  ],
};

export default function InlineEditingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing an inline editing system — the
          interaction layer that lets users edit cell or
          row values directly in a Data Table without
          opening a side panel or modal. Inline editing
          is the right pattern for ops dashboards,
          configuration consoles, and admin tools where
          users routinely make small updates to many
          rows; it removes the round-trip of select →
          open detail → edit → save and replaces it with
          double-click → type → Enter. The system handles
          per-cell editor types, type-aware validation,
          optimistic save with server confirmation,
          rollback on failure, undo across edits, and
          conflict resolution for concurrent users.
        </p>
        <p>
          The hard problems are: managing per-cell edit
          state without coupling it to the table&rsquo;s
          rendering layer; running validation as users
          type with appropriate UX cues; optimistic
          updates that touch the canonical store and
          revert on server rejection; undo across
          heterogeneous edits with consistent semantics;
          handling concurrent edits where two users
          touch the same cell; and accessibility — every
          editor must be keyboard-operable with proper
          ARIA roles.
        </p>

        <h3>User Context</h3>
        <p>
          Power users in operational contexts make many
          small edits per session. They expect Excel-like
          fluency: double-click to edit, Enter commits,
          Tab moves to the next cell, Escape cancels.
          They expect clear feedback when an edit fails
          and the ability to undo. Engineering teams
          consume the system through a small extension to
          the Data Table: declare which cells are editable
          and provide a save handler; the inline editing
          runtime handles the rest.
        </p>

        <h3>Assumptions</h3>
        <p>
          The Data Table provides cell rendering and
          selection. The Form Validation Engine is
          available for type-aware validation. The Client-
          side Data Normalization layer is available for
          optimistic updates. Backend supports per-cell
          updates with optimistic locking
          (<code>If-Match</code> headers or version
          fields). Modern browsers; we use
          contenteditable for some text editors and
          regular form controls for others.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement spreadsheet semantics
          (formulas, copy-paste regions, drag-fill) —
          those are the Spreadsheet Grid&rsquo;s job. We
          do not implement multi-cell editing UIs
          (selecting a range and editing all at once is
          a separate flow). We do not implement
          field-level locking on the backend.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Per-cell edit mode triggered by double-click or
          F2. Type-aware editors (text input, number
          input, select, date picker, etc.) per column
          definition. Inline validation as the user types,
          with errors below the editor. Enter commits,
          Escape cancels, Tab commits and moves to the
          next editable cell, Shift-Tab moves backward.
          Optimistic save: the cell visually updates
          immediately, the server confirms, on failure
          revert and surface the error. Undo via Cmd-Z
          across recent edits with a coherent stack. Visual
          state for cells in edit mode, dirty cells
          (changed but not saved), error cells, and
          conflict cells.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Concurrent-edit detection: when another user
          modifies the same row, surface a conflict.
          Field-level permissions: some users can edit
          some columns; the UI reflects that. Auto-save
          on blur (vs explicit Enter commit), configurable
          per column. Bulk edit (select multiple rows,
          edit one cell, apply to all). Audit log per
          cell. Edit history: see who changed what.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Spreadsheet formulas, range editing, real-time
          collaborative editing of the same cell. Server-
          side validation rules (the validation engine
          mirrors them but the server is authoritative).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Edit mode entry under 50 ms. Typing has no
          perceivable lag; validation runs in microtasks.
          Optimistic save commit under 50 ms (UI
          updates instantly). Server confirmation
          typically arrives in 100–500 ms.
        </p>

        <h3>Reliability</h3>
        <p>
          Optimistic updates always have a clean
          rollback path. Validation prevents most
          invalid edits from reaching the server. Server
          failures don&rsquo;t corrupt local state.
          Conflict detection surfaces real conflicts
          rather than silently overwriting.
        </p>

        <h3>Security</h3>
        <p>
          Per-field permission enforced server-side; the
          UI reflects the server&rsquo;s authoritative
          decision. Edit payloads sanitized at the
          server boundary. Rate limiting prevents abuse.
        </p>

        <h3>Accessibility</h3>
        <p>
          Edit mode announces (&ldquo;Editing customer
          name&rdquo;). Editor controls are real form
          inputs with proper labels. Validation errors
          announce. Tab navigation through editable
          cells works correctly.
        </p>

        <h3>Maintainability</h3>
        <p>
          Editor types in a registry; new types are
          one-file additions. Validation reuses the
          form validation engine. Optimistic updates
          flow through the normalization layer&rsquo;s
          mutation API.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is built around four primitives:
          <strong> per-cell edit state</strong>,
          <strong> type-aware editor registry</strong>,
          <strong> optimistic mutation pipeline</strong>,
          and <strong>command-pattern undo</strong>. Edit
          state is small (which cell is being edited,
          the in-progress value, validation result).
          Editor registry maps column types to editor
          components. Optimistic mutation flows through
          the data normalization layer. Undo uses the
          same command pattern as the spreadsheet.
        </p>
        <p>
          The <strong>edit state</strong> tracks at most
          one active editor per table at a time (or
          one per row if multi-cell editing in a row is
          allowed). The state holds the cell id, the
          editor type, the in-progress value, and the
          validation result. Entering edit mode: the
          user double-clicks or presses F2 on a cell;
          we instantiate the editor with the current
          value as initial. Exiting: Enter commits via
          the optimistic pipeline; Escape cancels.
        </p>
        <p>
          The <strong>editor registry</strong> maps column
          types to editor components. A <code>text</code>{" "}
          column uses <code>TextEditor</code>; a
          <code> number</code> column uses
          <code> NumberEditor</code>; a
          <code> select</code> column uses
          <code> SelectEditor</code>; a <code>date</code>{" "}
          column uses <code>DateEditor</code>. Editor
          components are small focused components with a
          consistent contract: receive the current
          value, return new value on commit, and
          handle their own keyboard interactions
          (Enter, Escape, Tab). Custom editor types
          plug into the registry.
        </p>
        <p>
          The <strong>optimistic mutation pipeline</strong>{" "}
          flows through the data normalization layer.
          On commit, the system: validates the new
          value via the validation engine; if invalid,
          stays in edit mode and shows the error; if
          valid, applies an optimistic update to the
          normalization store (the cell visually
          updates immediately); issues the server
          mutation; on success, the server response
          merges into the store (potentially correcting
          drift); on failure, the store rolls back and
          surfaces an error toast. The whole flow
          feels instant to users while respecting
          server authority.
        </p>
        <p>
          The <strong>undo stack</strong> uses the
          command pattern. Each commit pushes a
          command with apply/undo methods. Undo pops
          the latest, reverts the cell value via the
          normalization layer (which propagates to all
          views), and issues a server mutation to
          undo. Redo pushes back. The undo scope is
          per-table by default; consumers can scope to
          per-row or app-wide depending on need.
        </p>
        <p>
          <strong>Tab navigation</strong>: when the user
          presses Tab in edit mode, the system commits
          the current edit and moves edit mode to the
          next editable cell in row order (or down to
          the next row&rsquo;s first editable cell at
          row end). Shift-Tab moves backward. This
          keyboard fluency is what power users expect
          from spreadsheet-like editing.
        </p>
        <p>
          <strong>Validation</strong> runs as the user
          types via the form validation engine&rsquo;s
          single-field mode. Errors render inline below
          the editor. Required fields show their
          required state. Async validations
          (uniqueness checks) run on blur or after a
          short debounce. Invalid values block commit
          (Enter does nothing if invalid; Escape
          cancels with no save).
        </p>
        <p>
          <strong>Conflict detection</strong>: each row
          carries a version (server-issued ETag or
          version field). When committing, we send the
          version with the mutation; if the server
          returns 409 Conflict, the row has changed
          since we loaded it. We surface a conflict
          banner with options: keep your edit
          (overwrite), accept theirs, or merge (showing
          both values for review). This handles the
          common multi-user case where two people edit
          the same row at near-simultaneous times.
        </p>
        <p>
          <strong>Visual states</strong>: cells in edit
          mode have a clear focus ring. Dirty cells
          (changed but pending server confirmation) have
          a subtle background tint. Error cells have a
          red indicator. Conflict cells have a yellow
          warning. These states give users immediate
          feedback on the lifecycle of each edit.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>EditController</strong> manages edit
          state across the table.
          <strong> EditorRegistry</strong> maps column
          types to editor components.
          <strong> OptimisticMutationPipeline</strong>{" "}
          handles validate → apply → mutate → confirm /
          rollback. <strong>UndoStack</strong>{" "}
          implements command-pattern undo.
          <strong> ConflictHandler</strong> detects and
          surfaces concurrent edits.
          <strong> Editor components</strong>{" "}
          (TextEditor, NumberEditor, etc.) are
          consumer-supplied or built-in.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Edit state lives in a small external store —
          one active editor at a time. Cell-level dirty
          and error state lives in the data
          normalization layer (so it&rsquo;s
          consistent across views of the same entity).
          Undo stack is its own store. Subscribers
          read via selectors.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Column definition adds an
          <code> editable: true</code> flag plus an
          editor type. Save handler:
          <code>{` (cellId, newValue, version) => Promise<{ value, version }> `}</code>.
          Validation declared per column via the
          standard validation engine. Edit lifecycle:
          enter → typing/validation → commit (Enter or
          Tab) or cancel (Escape) → optimistic apply →
          server mutation → confirm/rollback.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          Edit state is per-table singleton; cells not
          in edit mode render their value via memoized
          renderers. Optimistic updates flow through
          the normalization layer with referential
          equality preservation; only the affected cell
          re-renders. Validation runs in microtasks so
          it doesn&rsquo;t block typing. Server
          mutation is async and doesn&rsquo;t block
          the optimistic apply.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Edit mode entry is unmistakable: the cell
          shows a focus ring and the editor mounts.
          Typing feels native. Validation errors render
          below the editor immediately, but only after
          the first blur or commit attempt to avoid
          flickering errors mid-typing. Cancel via
          Escape is reversible (undo can restore the
          edit if needed). Optimistic saves feel
          instant; on rollback, a toast explains the
          failure with a Retry button. Conflict banner
          is informative, not blocking — users can
          continue editing other cells.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Each editor is a real form control with
          proper labels and ARIA. Edit mode entry
          announces (&ldquo;Editing customer
          name&rdquo;). Validation errors render in
          alert regions. Tab navigation through
          editable cells works correctly. Conflict
          banner is accessible and actionable.
          Undo/redo announce with the action that was
          reverted (&ldquo;Reverted edit to customer
          name&rdquo;).
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Per-field permissions enforced server-side;
          the UI reflects what&rsquo;s editable based on
          server data. Edit payloads carry version
          fields for optimistic locking. Server
          re-validates every edit; client validation
          is UX. Edits are rate-limited to prevent
          abuse.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the optimistic pipeline
          (apply, confirm, rollback). Integration tests:
          edit a cell, verify optimistic update,
          mock server success, verify confirmed state;
          mock server failure, verify rollback. Tab
          navigation tests. Conflict detection tests
          with version mismatch. Accessibility tests
          for editor controls.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User starts editing, a real-time update from
          another user arrives for the same cell: we
          can either preserve the local edit (user&rsquo;s
          intent wins) or surface a conflict prompt.
          Default: preserve local; on commit, server
          rejects (version mismatch) → conflict
          handler kicks in. User Tabs from an invalid
          cell: stays in the cell with the error
          shown (Tab doesn&rsquo;t commit invalid
          values). User edits multiple cells, fails
          server save on the third: the third rolls
          back, the first two are confirmed; partial
          undo lets the user revert specifically. Cell
          becomes uneditable mid-session (permission
          revoked): edit mode exits with a message;
          no save is attempted. Network offline mid-
          edit: optimistic update applies; mutation
          queues (via the normalization mutation
          system); when online, mutation flushes;
          subsequent mutations build on the queued one.
          Editor unmounts during edit (parent re-
          render): edit state preserved if the cell
          remounts; otherwise the edit is lost. Long
          text in a small cell: editor expands or
          becomes a popover for adequate input space.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The editor registry is generic; new editor
          types add cleanly. The pipeline reuses
          existing subsystems (validation, normalization,
          undo) — minimal new code per editor type. The
          pattern extends to row-level editing,
          form-style row detail editing, and other
          contexts.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Editor placeholders, error messages, conflict
          banners, undo announcements all via i18n.
          Locale-aware editors (date, number) use
          <code> Intl</code> for parsing and formatting.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Optimistic vs confirmed-first updates</h3>
        <p>
          Optimistic feels instant; rollback handles
          failures. Confirmed-first feels slow but
          never shows wrong state. Optimistic is the
          right default for edit-heavy UX; confirmed-
          first is for high-stakes changes.
        </p>

        <h3>Inline vs side-panel detail editing</h3>
        <p>
          Inline is fast for many small edits; side-
          panel is better for forms with many related
          fields. Many products offer both, with inline
          for quick edits and a side-panel for full
          detail. Inline editing is opt-in per column.
        </p>

        <h3>Auto-save on blur vs explicit commit</h3>
        <p>
          Auto-save on blur is faster but can save
          half-typed values. Explicit commit (Enter)
          is safer. We default to explicit commit;
          auto-save is opt-in per column for
          appropriate cases.
        </p>

        <h3>Conflict resolution UX</h3>
        <p>
          Auto-overwrite is silent and risky. Always-
          prompt is annoying. We surface conflicts
          only when versions actually mismatch and
          give the user explicit options.
        </p>

        <h3>Per-cell vs per-row commit</h3>
        <p>
          Per-cell commits as soon as the user moves
          on; per-row batches all changes in a row
          and saves on row blur. Per-cell is simpler
          but creates more server requests; per-row is
          batched but more complex. We default per-
          cell; per-row is opt-in for products with
          high edit volume.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Range editing (apply one value to many cells).
          Real-time collaborative editing of the same
          cell with CRDTs. Offline-first editing with
          IndexedDB queue. AI-assisted edit
          suggestions. Voice input for cell values.
          Cross-cell formulas in a constrained way.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does optimistic updating
          work?</strong> The cell visually updates on
          commit; the mutation runs in background.
          On success, server response merges (correcting
          drift). On failure, the cell rolls back to
          the prior value with an error toast. The
          flow is tracked through the normalization
          layer&rsquo;s mutation API.
        </p>

        <p>
          <strong>2. How is undo implemented?</strong>{" "}
          Command pattern. Each commit pushes a
          command with apply/undo methods. Undo pops
          the latest, reverts the cell via
          normalization (propagating to all views),
          and issues a server undo. Redo pushes
          back.
        </p>

        <p>
          <strong>3. How are concurrent edits
          handled?</strong> Optimistic locking: each
          row carries a version. On commit, send the
          version. Server returns 409 Conflict if it
          mismatches. Conflict banner offers keep-mine,
          accept-theirs, or merge.
        </p>

        <p>
          <strong>4. How does Tab navigation work in
          edit mode?</strong> Tab commits the current
          edit and moves edit mode to the next
          editable cell. Shift-Tab moves backward.
          Wraps to the next row at row end. Stays in
          the current cell if the value is invalid.
        </p>

        <p>
          <strong>5. How is validation
          integrated?</strong> Through the form
          validation engine. Per-column validation
          rules declared with the schema. Validation
          runs as the user types (deferred to blur
          for first-time errors). Invalid values
          block commit.
        </p>

        <p>
          <strong>6. How are visual states
          communicated?</strong> Edit-mode focus ring,
          dirty-state background tint, error indicator,
          conflict warning. Each state has a
          distinctive visual that&rsquo;s also
          accessible (text equivalents, not color
          alone).
        </p>

        <p>
          <strong>7. How does this work with the
          normalization layer?</strong> Optimistic
          updates apply to the normalization store;
          subscribers (every view of the same entity)
          re-render. Server confirmation merges; on
          failure, rollback restores. Undo flows
          through the same path.
        </p>

        <p>
          <strong>8. How is this accessible?</strong>{" "}
          Real form controls; edit mode and validation
          state announce; Tab navigation works; conflict
          banners are actionable and accessible. Every
          mouse interaction has a keyboard
          equivalent.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          An inline editing system is{" "}
          <strong>per-cell edit state + editor registry +
          optimistic mutation pipeline + command-pattern
          undo</strong>. The pipeline reuses validation,
          normalization, and conflict detection; new
          editor types plug into a registry; visual
          states communicate the lifecycle of each
          edit. The result feels Excel-fluent — fast
          edits, instant feedback, clean rollback on
          failure, undo across the session — while
          preserving server-side authority.
        </p>
      </section>
    </ArticleLayout>
  );
}
