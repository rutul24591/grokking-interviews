"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-conflict-resolution-ui",
  title: "Design a Conflict Resolution UI",
  description:
    "LLD for surfacing and resolving conflicts: side-by-side diff, field-level merge, accept-mine/theirs/merge actions, and accessible decision flows.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "conflict-resolution-ui",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "conflict-resolution", "merge", "real-time", "react"],
  relatedTopics: [
    "real-time-collaborative-editor",
    "draft-persistence-system",
    "version-history-system",
  ],
};

export default function ConflictResolutionUIArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Conflict Resolution UI</h1><h2>Definition &amp; Context</h2><p>Design a Conflict Resolution UI is an implementation-heavy low-level design problem covering version comparison, local drafts, remote snapshots, field-level diffs, merge choices, rollback, and audit evidence. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Keep base, local, and remote versions immutable while the user resolves a conflict into a new candidate. The core structures are base snapshot, local snapshot, remote snapshot, diff hunks, merge choices, conflict type, resolved candidate, and audit record.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/conflict-resolution-ui-runtime.svg" alt="Design a Conflict Resolution UI runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a conflict resolution UI — the screen or modal that
          appears when a system detects two divergent versions of the same
          content (e.g. user edited a draft on device A and on device B; both
          versions came back to the server). The UI shows the differences and
          lets the user resolve: accept one version, accept the other, or merge
          field-by-field. Conflicts arise in offline-edit scenarios, multi-
          device drafts, branch merges, and any system with optimistic
          concurrency.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: a clear diff visualization (text diffs,
          structured object diffs); field-level granularity (merge name from
          version A, address from version B); preventing data loss (always give
          the user a path that doesn&rsquo;t discard work); and accessibility
          for the decision flow.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users encounter conflicts after offline edits or concurrent
          changes. They expect a clear &ldquo;here&rsquo;s what differs; pick
          what to keep&rdquo; experience. Engineering teams plug into systems
          that detect conflicts (drafts, collab editors, version control) and
          surface this UI.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Conflicts arrive as two structured versions with field-level data. The
          system can compute diffs (per-field equality or text diff). Modern
          browsers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          Automatic conflict resolution (CRDT territory; we&rsquo;re here for
          cases that need human input). Server-side merge engines.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Side-by-side display of two versions (mine vs theirs, or local vs
          server). Field-level diff highlighting (changed fields visually
          emphasized). Per-field accept buttons (accept mine, accept theirs).
          Bulk actions (accept all mine, accept all theirs). Final merged
          preview before commit. Cancel option (defer the decision; both
          versions retained somewhere). Commit irreversibly applies the chosen
          merge.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Text-level inline merge for long text fields (showing word-level
          differences). Three-way merge (with common ancestor) when available.
          Conflict history (track conflicts that happened). Undo for committed
          merges (within a window). Preview of effect (&ldquo;if you accept
          this, X downstream changes&rdquo;).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">The conflict detection logic, automatic resolution.</HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          UI opens in &lt;100 ms. Diff computation for typical objects under 50
          ms. Per-field selection updates merged preview instantly.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Cancel always returns user to a safe state (both versions retained).
          Commit is atomic; partial merges don&rsquo;t slip through.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">Server validates the merged payload. Sanitization on display.</HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Side-by-side panels accessible. Per- field actions are real buttons
          with labels. Diff highlights are paired with text equivalents
          (don&rsquo;t rely on color alone).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Diff and merge logic per data type pluggable. Renderer per field type.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The UI presents two versions side-by- side, computes per-field diffs,
          lets the user choose per-field which version to keep (or merge inline
          for text), and previews the merged result before commit. The default
          selection per field is configurable (mine-wins, theirs-wins,
          newer-wins, prompt-required) but the user can override.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>open</strong>, the UI receives two versions and computes a
          diff: per-field equality for structured objects; word-level diff for
          long text fields. Changed fields highlight in both panels.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>per-field action</strong>: the user clicks Accept Mine or
          Accept Theirs for a specific field. The merged preview updates. For
          text fields, an inline merge editor lets the user edit the result
          directly using both versions as context.
        </HighlightBlock>
        <p>
          On <strong>bulk actions</strong>: Accept All Mine sets every field to
          mine&rsquo;s value. Accept All Theirs is the reverse. These give a
          fast path for users who clearly prefer one version.
        </p>
        <p>
          On <strong>preview</strong>: a third panel (or the same area in
          tab-switched layout) shows the merged result. Users review before
          committing.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>commit</strong>: the merged version ships to the server,
          replacing both. Server validates. On success, the conflict is
          resolved. On failure (e.g. server has a third version that appeared),
          surface the new conflict — rare but possible.
        </HighlightBlock>
        <p>
          On <strong>cancel</strong>: both versions are retained. The user can
          return later or the system can re-prompt. We never discard work
          without explicit user action.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Three-way merge</strong>: when a common ancestor is available
          (e.g. a version control system or a server-tracked base version), we
          show mine | base | theirs and the merged preview. Diffs against base
          are clearer than diffs against the other version. Merge auto-resolves
          clean cases (e.g. mine changed field A, theirs changed field B →
          result has both changes). Non-clean cases require user decision.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> MergePreview</strong> renders the resulting merged version.
          <strong> InlineMergeEditor</strong></HighlightBlock>
<HighlightBlock as="p" tier="important">for long-text fields.
          <Highlight tier="important"><strong> CommitController</strong></Highlight> ships the merge to the server.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Two versions, per-field selection (mine/theirs/custom), <Highlight tier="important">merged preview
          in modal-local state. Commits</Highlight> update the parent system on success.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Inputs:</Highlight>{" "}
          <code>mine</code>, <code>theirs</code>, optional{" "}
          <code>base</code> (for three-way), schema declaring fields and{" "}
          <Highlight tier="important">types</Highlight>,{" "}
          <code>onCommit(merged)</code>, <code>onCancel</code>. Diff result:
          per-field{" "}
          <code>{`{ field, mineValue, theirsValue, equal, textDiff? }`}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Diff computation per-field is cheap; text-level diff for long fields
          <Highlight tier="important">uses standard diff algorithms (O(n×m), fine</Highlight> for typical text).
          Selection updates merged preview instantly via memoization.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Merged preview either inline
          or in a third panel. Commit and Cancel actions</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">at the bottom. Clear
          visual indication of which version each field came from.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Each version panel has accessible headings (mine, theirs, base). Per-
          field</HighlightBlock>
<HighlightBlock as="p" tier="important">controls are radio groups or buttons with labels including the
          field name.</HighlightBlock>
<HighlightBlock as="p" tier="important">Diff highlights paired with text (&ldquo;changed&rdquo;
          label, not just color). Preview area accessible.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server validates merged payload. <Highlight tier="important">User-entered values for inline merge
          sanitized</Highlight> at boundary. Cross-user authorization enforced.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for diff per data type. Three-way merge auto-resolution
          tests. <Highlight tier="important">Integration tests: open with two versions,</Highlight> select per field,
          commit. Accessibility tests for radio groups and announcements.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Very large object with
          hundreds of fields: virtualize the field list; surface only changed
          fields by default. Field</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">schema mismatch (one version has a field the
          other doesn&rsquo;t): treat as added/removed; user chooses to keep or
          drop.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over data type via schema <Highlight tier="important">and field renderers. The pattern
          reuses</Highlight> across drafts, version control, content edits.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Action labels via i18n. Field names translate via the <Highlight tier="important">schema&rsquo;s
          label keys. RTL via CSS</Highlight> logical properties; side-by-side may flip to
          top-bottom on mobile.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Side-by-side vs sequential</h3>
        <HighlightBlock as="p" tier="important">
          Side-by-side is fast for visual comparison. Sequential (one version,
          then the other) is simpler on mobile. We default side-by-side on
          desktop, sequential on mobile.
        </HighlightBlock>

        <h3>Per-field merge vs whole-version pick</h3>
        <HighlightBlock as="p" tier="important">
          Per-field enables granular merging at the cost of UI complexity.
          Whole- version is simpler but loses information. We support both with
          bulk actions for the simple case.
        </HighlightBlock>

        <h3>Auto-resolve clean cases vs always prompt</h3>
        <HighlightBlock as="p" tier="crucial">
          Auto-resolve (mine changed A, theirs changed B → keep both) reduces
          user burden when no real conflict exists. Always prompting is overly
          conservative. We auto-resolve with a clear summary of what was
          auto-merged.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">AI-suggested resolutions based on intent inference. Visual diff for</HighlightBlock>
<HighlightBlock as="p" tier="important">media/files. Conflict prevention via better real-time coordination.</HighlightBlock>
<HighlightBlock as="p" tier="important">Cross-conflict learning (apply same resolution to similar conflicts).</HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Keep base, local, and remote versions immutable while the user resolves a conflict into a new candidate.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/conflict-resolution-ui-recovery.svg" alt="Design a Conflict Resolution UI recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Last-write-wins is cheap but destructive; explicit resolution is justified when user intent and data loss matter.</p><p>The server version is authoritative. User resolution creates a new conditional write against the latest accepted version. Scale pressure comes from large diffs, stale bases, repeated conflicts, sensitive data, deleted entities, and partial merges. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: immutable three-way merge and conditional save</h3><p>Keep base, local, and remote snapshots immutable. Produce field-level choices into a new candidate, validate the candidate, and save conditionally against the latest server version. A second conflict restarts from preserved user choices rather than silently overwriting.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, preserve all versions, explain conflicting fields, validate merged output, retry conditional save, and retain audit evidence.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep base, local, and remote versions immutable while the user resolves a conflict into a new candidate.</p><h3>What breaks at scale?</h3><p>large diffs, stale bases, repeated conflicts, sensitive data, deleted entities, and partial merges.</p><h3>What consistency applies?</h3><p>The server version is authoritative. User resolution creates a new conditional write against the latest accepted version.</p><h3>How do you recover?</h3><p>preserve all versions, explain conflicting fields, validate merged output, retry conditional save, and retain audit evidence.</p><h3>Why this architecture?</h3><p>Last-write-wins is cheap but destructive; explicit resolution is justified when user intent and data loss matter.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}