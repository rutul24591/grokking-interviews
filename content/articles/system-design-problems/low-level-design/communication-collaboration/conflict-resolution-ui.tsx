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

export default function ConflictResolutionUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>⚙️ Functional Requirements</h2>

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
        <h2>📊 Non-Functional Requirements</h2>

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
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/communication-collaboration/conflict-resolution-ui-architecture.svg"
          alt="Conflict resolution UI architecture showing version vector conflict detection, conflict metadata, field-level diff view, rich text diff, auto-merge rules, manual resolution strategies, resolution flow, and publish"
          caption="Architecture Overview"
        />
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
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong> MergePreview</strong> renders the resulting merged version.
          <strong> InlineMergeEditor</strong></HighlightBlock>
<HighlightBlock as="p" tier="important">for long-text fields.
          <Highlight tier="important"><strong> CommitController</strong></Highlight> ships the merge to the server.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Two versions, per-field selection (mine/theirs/custom), <Highlight tier="important">merged preview
          in modal-local state. Commits</Highlight> update the parent system on success.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Diff computation per-field is cheap; text-level diff for long fields
          <Highlight tier="important">uses standard diff algorithms (O(n×m), fine</Highlight> for typical text).
          Selection updates merged preview instantly via memoization.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Merged preview either inline
          or in a third panel. Commit and Cancel actions</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">at the bottom. Clear
          visual indication of which version each field came from.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Each version panel has accessible headings (mine, theirs, base). Per-
          field</HighlightBlock>
<HighlightBlock as="p" tier="important">controls are radio groups or buttons with labels including the
          field name.</HighlightBlock>
<HighlightBlock as="p" tier="important">Diff highlights paired with text (&ldquo;changed&rdquo;
          label, not just color). Preview area accessible.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server validates merged payload. <Highlight tier="important">User-entered values for inline merge
          sanitized</Highlight> at boundary. Cross-user authorization enforced.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for diff per data type. Three-way merge auto-resolution
          tests. <Highlight tier="important">Integration tests: open with two versions,</Highlight> select per field,
          commit. Accessibility tests for radio groups and announcements.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Very large object with
          hundreds of fields: virtualize the field list; surface only changed
          fields by default. Field</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">schema mismatch (one version has a field the
          other doesn&rsquo;t): treat as added/removed; user chooses to keep or
          drop.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over data type via schema <Highlight tier="important">and field renderers. The pattern
          reuses</Highlight> across drafts, version control, content edits.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Action labels via i18n. Field names translate via the <Highlight tier="important">schema&rsquo;s
          label keys. RTL via CSS</Highlight> logical properties; side-by-side may flip to
          top-bottom on mobile.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">AI-suggested resolutions based on intent inference. Visual diff for</HighlightBlock>
<HighlightBlock as="p" tier="important">media/files. Conflict prevention via better real-time coordination.</HighlightBlock>
<HighlightBlock as="p" tier="important">Cross-conflict learning (apply same resolution to similar conflicts).</HighlightBlock>
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

        <HighlightBlock as="p" tier="important">
          <strong>3. What is three-way merge?</strong> When a common ancestor is
          available, diffs against the base are clearer. Auto-resolves clean
          cases (mine changed A; theirs changed B → both). Non-clean cases
          prompt.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How is data loss prevented?</strong> Cancel retains both
          versions. Commit ships only after explicit user action. Auto-resolve
          surfaces clearly so users see what was merged automatically.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>5. How is the UI accessible?</strong> Side-by-side panels with
          headings. Per-field radio groups with labels. Diff highlights paired
          with text. Keyboard navigation through fields and actions.
        </HighlightBlock>

        <p>
          <strong>6. What happens if the server rejects the merge?</strong>{" "}
          Surface as a new conflict (a third version emerged). User resolves
          again with the new version in play.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>7. How do you handle very large objects?</strong> Show only
          changed fields by default; expand to see all. Virtualize the field
          list if hundreds of fields exist.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>8. Can this be auto-resolved without UI?</strong> CRDTs
          auto-resolve most conflicts. This UI is for cases where
          auto-resolution would lose information or cross a semantic boundary
          the system can&rsquo;t assume.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Auto-resolve clean cases; prompt for real conflicts; never discard
          work without</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">user action. The result is conflicts that feel tractable
          rather than catastrophic.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
