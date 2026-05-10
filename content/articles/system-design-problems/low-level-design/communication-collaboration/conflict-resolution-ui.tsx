"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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

export default function ConflictResolutionUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a conflict resolution UI — the screen or modal that
          appears when a system detects two divergent versions of the same
          content (e.g. user edited a draft on device A and on device B; both
          versions came back to the server). The UI shows the differences and
          lets the user resolve: accept one version, accept the other, or merge
          field-by-field. Conflicts arise in offline-edit scenarios, multi-
          device drafts, branch merges, and any system with optimistic
          concurrency.
        </p>
        <p>
          The hard problems are: a clear diff visualization (text diffs,
          structured object diffs); field-level granularity (merge name from
          version A, address from version B); preventing data loss (always give
          the user a path that doesn&rsquo;t discard work); and accessibility
          for the decision flow.
        </p>

        <h3>User Context</h3>
        <p>
          End users encounter conflicts after offline edits or concurrent
          changes. They expect a clear &ldquo;here&rsquo;s what differs; pick
          what to keep&rdquo; experience. Engineering teams plug into systems
          that detect conflicts (drafts, collab editors, version control) and
          surface this UI.
        </p>

        <h3>Assumptions</h3>
        <p>
          Conflicts arrive as two structured versions with field-level data. The
          system can compute diffs (per-field equality or text diff). Modern
          browsers.
        </p>

        <h3>Non-Goals</h3>
        <p>
          Automatic conflict resolution (CRDT territory; we&rsquo;re here for
          cases that need human input). Server-side merge engines.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Side-by-side display of two versions (mine vs theirs, or local vs
          server). Field-level diff highlighting (changed fields visually
          emphasized). Per-field accept buttons (accept mine, accept theirs).
          Bulk actions (accept all mine, accept all theirs). Final merged
          preview before commit. Cancel option (defer the decision; both
          versions retained somewhere). Commit irreversibly applies the chosen
          merge.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Text-level inline merge for long text fields (showing word-level
          differences). Three-way merge (with common ancestor) when available.
          Conflict history (track conflicts that happened). Undo for committed
          merges (within a window). Preview of effect (&ldquo;if you accept
          this, X downstream changes&rdquo;).
        </p>

        <h3>Out of Scope</h3>
        <p>The conflict detection logic, automatic resolution.</p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          UI opens in &lt;100 ms. Diff computation for typical objects under 50
          ms. Per-field selection updates merged preview instantly.
        </p>

        <h3>Reliability</h3>
        <p>
          Cancel always returns user to a safe state (both versions retained).
          Commit is atomic; partial merges don&rsquo;t slip through.
        </p>

        <h3>Security</h3>
        <p>Server validates the merged payload. Sanitization on display.</p>

        <h3>Accessibility</h3>
        <p>
          Side-by-side panels accessible. Per- field actions are real buttons
          with labels. Diff highlights are paired with text equivalents
          (don&rsquo;t rely on color alone).
        </p>

        <h3>Maintainability</h3>
        <p>
          Diff and merge logic per data type pluggable. Renderer per field type.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The UI presents two versions side-by- side, computes per-field diffs,
          lets the user choose per-field which version to keep (or merge inline
          for text), and previews the merged result before commit. The default
          selection per field is configurable (mine-wins, theirs-wins,
          newer-wins, prompt-required) but the user can override.
        </p>
        <p>
          On <strong>open</strong>, the UI receives two versions and computes a
          diff: per-field equality for structured objects; word-level diff for
          long text fields. Changed fields highlight in both panels.
        </p>
        <p>
          On <strong>per-field action</strong>: the user clicks Accept Mine or
          Accept Theirs for a specific field. The merged preview updates. For
          text fields, an inline merge editor lets the user edit the result
          directly using both versions as context.
        </p>
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
        <p>
          On <strong>commit</strong>: the merged version ships to the server,
          replacing both. Server validates. On success, the conflict is
          resolved. On failure (e.g. server has a third version that appeared),
          surface the new conflict — rare but possible.
        </p>
        <p>
          On <strong>cancel</strong>: both versions are retained. The user can
          return later or the system can re-prompt. We never discard work
          without explicit user action.
        </p>
        <p>
          <strong>Three-way merge</strong>: when a common ancestor is available
          (e.g. a version control system or a server-tracked base version), we
          show mine | base | theirs and the merged preview. Diffs against base
          are clearer than diffs against the other version. Merge auto-resolves
          clean cases (e.g. mine changed field A, theirs changed field B →
          result has both changes). Non-clean cases require user decision.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ConflictModal</strong> renders the UI.{" "}
          <strong>VersionPanel</strong> renders one version with field-level
          controls.
          <strong> DiffComputer</strong> computes per-field and text-level
          diffs.
          <strong> MergePreview</strong> renders the resulting merged version.
          <strong> InlineMergeEditor</strong> for long-text fields.
          <strong> CommitController</strong> ships the merge to the server.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Two versions, per-field selection (mine/theirs/custom), merged preview
          in modal-local state. Commits update the parent system on success.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs: <code>mine</code>, <code>theirs</code>, optional{" "}
          <code>base</code> (for three-way), schema declaring fields and types,
          <code> onCommit(merged)</code>,<code> onCancel</code>. Diff result:
          per-field
          <code> {`{ field, mineValue, theirsValue, equal, textDiff? }`}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Diff computation per-field is cheap; text-level diff for long fields
          uses standard diff algorithms (O(n×m), fine for typical text).
          Selection updates merged preview instantly via memoization.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Two columns (mine | theirs) or three (mine | base | theirs) for
          three-way. Changed fields highlighted. Per-field radio buttons or
          accept buttons. Bulk actions at the top. Merged preview either inline
          or in a third panel. Commit and Cancel actions at the bottom. Clear
          visual indication of which version each field came from.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Each version panel has accessible headings (mine, theirs, base). Per-
          field controls are radio groups or buttons with labels including the
          field name. Diff highlights paired with text (&ldquo;changed&rdquo;
          label, not just color). Preview area accessible.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server validates merged payload. User-entered values for inline merge
          sanitized at boundary. Cross-user authorization enforced.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for diff per data type. Three-way merge auto-resolution
          tests. Integration tests: open with two versions, select per field,
          commit. Accessibility tests for radio groups and announcements.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Versions are identical: shouldn&rsquo;t have triggered conflict UI;
          defensive fallback shows &ldquo;No conflicts&rdquo; and dismisses.
          Three-way with no ancestor: degrade to two-way. New version arrives
          during conflict resolution: surface as a meta-conflict (&ldquo;Another
          change happened; refresh to see&rdquo;). Very large object with
          hundreds of fields: virtualize the field list; surface only changed
          fields by default. Field schema mismatch (one version has a field the
          other doesn&rsquo;t): treat as added/removed; user chooses to keep or
          drop.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over data type via schema and field renderers. The pattern
          reuses across drafts, version control, content edits.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Action labels via i18n. Field names translate via the schema&rsquo;s
          label keys. RTL via CSS logical properties; side-by-side may flip to
          top-bottom on mobile.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Side-by-side vs sequential</h3>
        <p>
          Side-by-side is fast for visual comparison. Sequential (one version,
          then the other) is simpler on mobile. We default side-by-side on
          desktop, sequential on mobile.
        </p>

        <h3>Per-field merge vs whole-version pick</h3>
        <p>
          Per-field enables granular merging at the cost of UI complexity.
          Whole- version is simpler but loses information. We support both with
          bulk actions for the simple case.
        </p>

        <h3>Auto-resolve clean cases vs always prompt</h3>
        <p>
          Auto-resolve (mine changed A, theirs changed B → keep both) reduces
          user burden when no real conflict exists. Always prompting is overly
          conservative. We auto-resolve with a clear summary of what was
          auto-merged.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AI-suggested resolutions based on intent inference. Visual diff for
          media/files. Conflict prevention via better real-time coordination.
          Cross-conflict learning (apply same resolution to similar conflicts).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. When does this UI appear?</strong> When the system detects
          two divergent versions of the same content that cannot be auto-merged.
          The system surfaces the UI; the user resolves.
        </p>

        <p>
          <strong>2. How is granular merge implemented?</strong> Per-field
          selection. Each changed field has accept-mine/theirs controls. Merged
          preview updates as selections change.
        </p>

        <p>
          <strong>3. What is three-way merge?</strong> When a common ancestor is
          available, diffs against the base are clearer. Auto-resolves clean
          cases (mine changed A; theirs changed B → both). Non-clean cases
          prompt.
        </p>

        <p>
          <strong>4. How is data loss prevented?</strong> Cancel retains both
          versions. Commit ships only after explicit user action. Auto-resolve
          surfaces clearly so users see what was merged automatically.
        </p>

        <p>
          <strong>5. How is the UI accessible?</strong> Side-by-side panels with
          headings. Per-field radio groups with labels. Diff highlights paired
          with text. Keyboard navigation through fields and actions.
        </p>

        <p>
          <strong>6. What happens if the server rejects the merge?</strong>{" "}
          Surface as a new conflict (a third version emerged). User resolves
          again with the new version in play.
        </p>

        <p>
          <strong>7. How do you handle very large objects?</strong> Show only
          changed fields by default; expand to see all. Virtualize the field
          list if hundreds of fields exist.
        </p>

        <p>
          <strong>8. Can this be auto-resolved without UI?</strong> CRDTs
          auto-resolve most conflicts. This UI is for cases where
          auto-resolution would lose information or cross a semantic boundary
          the system can&rsquo;t assume.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A conflict resolution UI is{" "}
          <strong>
            side-by-side diff + per-field actions + merged preview + safe cancel
          </strong>
          . Three-way merge improves clarity when ancestors are available.
          Auto-resolve clean cases; prompt for real conflicts; never discard
          work without user action. The result is conflicts that feel tractable
          rather than catastrophic.
        </p>
      </section>
    </ArticleLayout>
  );
}
