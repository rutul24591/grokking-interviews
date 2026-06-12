"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
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

export default function InlineEditingSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design an Inline Editing System</h1><h2>Definition &amp; Context</h2><p>Design an Inline Editing System is an implementation-heavy low-level design problem covering edit activation, draft state, validation, optimistic save, keyboard commit-cancel, conflict detection, rollback, and focus restoration. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Keep displayed server value, active draft, optimistic projection, and save generation separate. The editor must never lose a recoverable user draft silently. The core structures are cell identity, committed value, draft value, edit mode, validation result, base version, save generation, optimistic journal, and focus target.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/inline-editing-system-runtime.svg" alt="Design an Inline Editing System runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement spreadsheet semantics
          (formulas, copy-paste regions, drag-fill) —
          those are the Spreadsheet Grid&rsquo;s job. We
          do not implement multi-cell editing UIs
          (selecting a range and editing all at once is
          a separate flow). We do not implement
          field-level locking on the backend.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Concurrent-edit detection: when another user
          modifies the same row, surface a conflict.
          Field-level permissions: some users can edit
          some columns; the UI reflects that. Auto-save
          on blur (vs explicit Enter commit), configurable
          per column. Bulk edit (select multiple rows,
          edit one cell, apply to all). Audit log per
          cell. Edit history: see who changed what.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Spreadsheet formulas, range editing, real-time
          collaborative editing of the same cell. Server-
          side validation rules (the validation engine
          mirrors them but the server is authoritative).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Edit mode entry under 50 ms. Typing has no
          perceivable lag; validation runs in microtasks.
          Optimistic save commit under 50 ms (UI
          updates instantly). Server confirmation
          typically arrives in 100–500 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Optimistic updates always have a clean
          rollback path. Validation prevents most
          invalid edits from reaching the server. Server
          failures don&rsquo;t corrupt local state.
          Conflict detection surfaces real conflicts
          rather than silently overwriting.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Per-field permission enforced server-side; the
          UI reflects the server&rsquo;s authoritative
          decision. Edit payloads sanitized at the
          server boundary. Rate limiting prevents abuse.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Edit mode announces (&ldquo;Editing customer
          name&rdquo;). Editor controls are real form
          inputs with proper labels. Validation errors
          announce. Tab navigation through editable
          cells works correctly.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Editor types in a registry; new types are
          one-file additions. Validation reuses the
          form validation engine. Optimistic updates
          flow through the normalization layer&rsquo;s
          mutation API.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
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
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Tab navigation</strong>: when the user
          presses Tab in edit mode, the system commits
          the current edit and moves edit mode to the
          next editable cell in row order (or down to
          the next row&rsquo;s first editable cell at
          row end). Shift-Tab moves backward. This
          keyboard fluency is what power users expect
          from spreadsheet-like editing.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Validation</strong> runs as the user
          types via the form validation engine&rsquo;s
          single-field mode. Errors render inline below
          the editor. Required fields show their
          required state. Async validations
          (uniqueness checks) run on blur or after a
          short debounce. Invalid values block commit
          (Enter does nothing if invalid; Escape
          cancels with no save).
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Visual states</strong>: cells in edit
          mode have a clear focus ring. Dirty cells
          (changed but pending server confirmation) have
          a subtle background tint. Error cells have a
          red indicator. Conflict cells have a yellow
          warning. These states give users immediate
          feedback on the lifecycle of each edit.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>EditController</strong> manages edit
          state across the table.
          <strong> EditorRegistry</strong> maps column
          types to editor components.
          <strong> OptimisticMutationPipeline</strong>{" "}
          handles validate → apply → mutate → confirm /
          rollback.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong>UndoStack</strong></Highlight>{" "}
          implements command-pattern undo.
          <strong> ConflictHandler</strong> detects and
          surfaces concurrent edits.
          <strong> Editor components</strong>{" "}
          (TextEditor, NumberEditor, etc.) are
          consumer-supplied or built-in.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Edit state lives in a small external store —
          one active editor at a time. Cell-level dirty</HighlightBlock>
<HighlightBlock as="p" tier="important">and error state lives in the data
          normalization layer (so it&rsquo;s
          consistent across</HighlightBlock>
<HighlightBlock as="p" tier="important">views of the same entity).
          Undo stack is its own store. Subscribers
          read via selectors.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          The data-flow contract must be versioned and conflict-aware: edits include an entity/cell id plus a version
          so the server can reject stale writes and the UI can surface a conflict instead of silently overwriting.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Column definition enables inline edit via <code>editable: true</code> plus an editor type. A typical save handler
          shape is <code>{`(cellId, newValue, version) => Promise<{ value, version }>`}</code>.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validation is declared per column via the shared validation engine. Edit lifecycle: enter → typing/validation →
          commit (Enter/Tab) or cancel (Escape) → optimistic apply → server mutation → confirm/rollback.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="crucial">Edit state is per-table singleton; cells not
          in edit mode render their value via memoized
          renderers. Optimistic updates flow through
          the normalization layer with referential
          equality preservation; only the affected cell
          re-renders.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Validation runs in microtasks so
          it doesn&rsquo;t block typing. Server
          mutation is async and doesn&rsquo;t block
          the optimistic apply.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important">Edit mode entry is unmistakable: the cell shows a focus ring and the editor</HighlightBlock>
<HighlightBlock as="p" tier="important">mounts. Typing feels native. Validation errors render below the editor immediately, but</HighlightBlock>
<HighlightBlock as="p" tier="important">only after the first blur or commit attempt to avoid flickering errors mid-typing.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Cancel via
          Escape is reversible (undo can restore the
          edit if needed). Optimistic saves feel
          instant; on rollback, a toast explains the
          failure with a Retry button. Conflict banner
          is informative, not blocking — users can
          continue editing other cells.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Each editor is a real form control with
          proper labels and ARIA. Edit mode entry
          announces (&ldquo;Editing customer
          name&rdquo;). Validation errors render in
          alert regions.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Tab navigation through
          editable cells works correctly. Conflict
          banner is accessible and actionable.
          Undo/redo announce with the action that was
          reverted (&ldquo;Reverted edit to customer
          name&rdquo;).</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">Per-field permissions enforced server-side;
          the UI reflects what&rsquo;s editable based on
          server data. Edit payloads carry version
          fields for optimistic locking.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Server
          re-validates every edit; client validation
          is UX. Edits are rate-limited to prevent
          abuse.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for the optimistic pipeline
          (apply, confirm, rollback). Integration tests:
          edit a cell, verify optimistic update,
          mock server success, verify confirmed state;
          mock server failure, verify rollback.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Tab
          navigation tests. Conflict detection tests
          with version mismatch. Accessibility tests
          for editor controls.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Cell becomes uneditable mid-session (permission revoked): edit mode exits with a message; no save is attempted. Network offline mid- edit: optimistic update applies;</HighlightBlock>
<HighlightBlock as="p" tier="important">mutation queues (via the normalization mutation system); when online, mutation flushes; subsequent mutations build on the queued one. Editor unmounts during edit (parent</HighlightBlock>
<HighlightBlock as="p" tier="important">re- render): edit state preserved if the cell remounts; otherwise the edit is lost. Long text in a small cell: editor expands or becomes a popover for adequate input space.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">The editor registry is generic; new editor
          types add cleanly. The pipeline reuses
          existing subsystems (validation, normalization,
          undo) — minimal new code per editor type.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The
          pattern extends to row-level editing,
          form-style row detail editing, and other
          contexts.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">
          Locale-sensitive input is the hard part: store canonical values, parse/format at the
          edges, and keep validation rules locale-aware.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Editor placeholders, errors, conflict banners, and undo announcements come from i18n
          with stable keys so the UX is consistent across screens.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Locale-aware editors (date, number, currency) use <code>Intl</code> for parsing/formatting,
          and should preserve user intent (grouping separators, decimal symbols) rather than
          silently coercing.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Optimistic vs confirmed-first updates</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant; rollback handles
          failures. Confirmed-first feels slow but
          never shows wrong state. Optimistic is the
          right default for edit-heavy UX; confirmed-
          first is for high-stakes changes.
        </HighlightBlock>

        <h3>Inline vs side-panel detail editing</h3>
        <HighlightBlock as="p" tier="important">
          Inline is fast for many small edits; side-
          panel is better for forms with many related
          fields. Many products offer both, with inline
          for quick edits and a side-panel for full
          detail. Inline editing is opt-in per column.
        </HighlightBlock>

        <h3>Auto-save on blur vs explicit commit</h3>
        <HighlightBlock as="p" tier="important">
          Auto-save on blur is faster but can save
          half-typed values. Explicit commit (Enter)
          is safer. We default to explicit commit;
          auto-save is opt-in per column for
          appropriate cases.
        </HighlightBlock>

        <h3>Conflict resolution UX</h3>
        <HighlightBlock as="p" tier="important">
          Auto-overwrite is silent and risky. Always-
          prompt is annoying. We surface conflicts
          only when versions actually mismatch and
          give the user explicit options.
        </HighlightBlock>

        <h3>Per-cell vs per-row commit</h3>
        <HighlightBlock as="p" tier="important">
          Per-cell commits as soon as the user moves
          on; per-row batches all changes in a row
          and saves on row blur. Per-cell is simpler
          but creates more server requests; per-row is
          batched but more complex. We default per-
          cell; per-row is opt-in for products with
          high edit volume.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Range editing (apply one value to many cells).
          Real-time collaborative editing of the same
          cell with CRDTs.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Offline-first editing with
          IndexedDB queue. AI-assisted edit
          suggestions. Voice input for cell values.
          Cross-cell formulas in a constrained way.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Keep displayed server value, active draft, optimistic projection, and save generation separate. The editor must never lose a recoverable user draft silently. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/inline-editing-system-recovery.svg" alt="Design an Inline Editing System recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Modal editing is easier to control; inline editing is justified for repetitive corrections where low-friction keyboard workflows matter.</p><p>The server version is authoritative. Local commit may project optimistically, but a conflict preserves the draft and explains the newer server value. Scale pressure comes from rapid edits, multiple active cells, validation races, concurrent server updates, virtualization unmounts, and permission changes. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and bounded projection</h3><p>Separate authoritative records from query state, cursors, optimistic journals, viewport windows, and derived aggregates. Within a pagination or edit session, responses settle only when their query key, cursor lineage, tenant scope, and version still match. A rejected optimistic mutation restores the committed record and reapplies only valid local intent. Snapshot consistency is usually sufficient for browsing; conditional writes are required for edits.</p><p>Defend scale by bounding normalized caches, rendered windows, aggregation frequency, export size, and subscription fan-out. Defend abuse by validating filter complexity, column count, sort fan-out, cell payloads, and stream frequency before expensive work begins. Emit query-key attribution, cache hit rate, dropped frames, stale-response rejection, conflict count, rollback result, and memory pressure without logging sensitive row content.</p><section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, validate before submit, reject stale saves, retain drafts across virtualization boundaries, roll back failed projections, restore focus, and show conflict resolution. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep displayed server value, active draft, optimistic projection, and save generation separate. The editor must never lose a recoverable user draft silently.</p><h3>What breaks at scale?</h3><p>rapid edits, multiple active cells, validation races, concurrent server updates, virtualization unmounts, and permission changes. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>The server version is authoritative. Local commit may project optimistically, but a conflict preserves the draft and explains the newer server value.</p><h3>How do you recover?</h3><p>I would validate before submit, reject stale saves, retain drafts across virtualization boundaries, roll back failed projections, restore focus, and show conflict resolution.</p><h3>Why this architecture?</h3><p>Modal editing is easier to control; inline editing is justified for repetitive corrections where low-friction keyboard workflows matter.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
