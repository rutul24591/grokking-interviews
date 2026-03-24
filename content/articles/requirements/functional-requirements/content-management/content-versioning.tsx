"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-versioning",
  title: "Content Versioning",
  description:
    "Comprehensive guide to implementing content versioning covering versioning strategies (full snapshots, diff-based, hybrid), version history (view, compare, restore), rollback patterns (point-in-time recovery, undo/redo), branching and merging (collaborative editing, conflict resolution), audit trails (who changed what when), and storage optimization for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-versioning",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "versioning",
    "history",
    "backend",
    "audit",
  ],
  relatedTopics: ["draft-saving", "edit-content-ui", "content-lifecycle"],
};

export default function ContentVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Versioning</strong> maintains a history of content changes, enabling
          users to view past versions, compare changes, and restore previous states. Versioning is
          critical for collaboration (multiple editors working on same content), audit trails
          (compliance — who changed what when), and recovery from mistakes (rollback to known good
          state). Without versioning, content changes are lost, mistakes can't be undone, and
          compliance requirements can't be met.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/versioning-strategies.svg"
          alt="Versioning Strategies"
          caption="Versioning Strategies — showing full snapshots (store complete content per version), diff-based (store only changes), and hybrid approach (snapshot every N versions with diffs in between)"
        />

        <p>
          For staff and principal engineers, implementing versioning requires deep understanding of
          versioning strategies (full snapshots — store complete content per version, diff-based —
          store only changes/deltas between versions, hybrid — snapshot every N versions with diffs
          in between), version history (view past versions, compare versions — side-by-side diff
          view, restore previous versions — point-in-time recovery), rollback patterns (undo/redo
          — command pattern, point-in-time recovery — restore to any timestamp, branch and merge —
          parallel editing with conflict resolution), branching and merging (collaborative editing
          — multiple editors on same content, conflict resolution — manual or automatic merge,
          three-way merge — base version + two changes), audit trails (who changed what when —
          user_id, timestamp, change description, compliance reporting). The implementation must
          balance storage efficiency (diff-based uses less storage) with restore performance
          (snapshots restore faster) and user experience (fast version history, clear diff view).
        </p>
        <p>
          Modern versioning systems have evolved from simple snapshots to sophisticated version
          control with branching, merging, and conflict resolution. Platforms like Git (code
          versioning), Google Docs (collaborative editing), and WordPress (post revisions) use
          different strategies based on use case. Git uses diff-based storage (efficient for code),
          Google Docs uses operational transforms (real-time collaboration), WordPress uses full
          snapshots (simple, fast restore). Choice depends on content type, collaboration needs,
          and storage constraints.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content versioning is built on fundamental concepts that determine how versions are
          stored, compared, and restored. Understanding these concepts is essential for designing
          effective versioning systems.
        </p>
        <p>
          <strong>Versioning Strategies:</strong> Full snapshots (store complete content per
          version — version 1: full content, version 2: full content — simple, fast restore, but
          storage inefficient for large content), diff-based (store only changes/deltas — version 1:
          full content, version 2: diff from v1 — storage efficient, but restore requires applying
          diffs sequentially), hybrid (snapshot every N versions — version 1, 5, 10 are full
          snapshots, versions 2-4, 6-9 are diffs — balances storage efficiency with restore
          performance). Choose based on content size, version frequency, restore performance needs.
        </p>
        <p>
          <strong>Version History:</strong> View past versions (list all versions with metadata —
          version number, timestamp, author, change description), compare versions (side-by-side
          diff view — highlight additions in green, deletions in red, modifications in yellow),
          restore previous versions (point-in-time recovery — restore content to any previous
          version, create new version with restored content — don't overwrite history). Version
          history enables users to track changes, understand evolution, recover from mistakes.
        </p>
        <p>
          <strong>Rollback Patterns:</strong> Undo/redo (command pattern — each edit is a command
          with undo operation, maintain undo/redo stack — Ctrl+Z/Ctrl+Y), point-in-time recovery
          (restore to any timestamp — SELECT content FROM history WHERE content_id = ? AND
          timestamp &lt;= ? ORDER BY timestamp DESC LIMIT 1), branch and merge (parallel editing —
          create branch from base version, edit independently, merge changes back — detect
          conflicts, resolve manually or automatically). Rollback enables recovery from mistakes,
          experimentation without risk.
        </p>
        <p>
          <strong>Audit Trails:</strong> Track who changed what when (user_id — who made change,
          timestamp — when changed, version_number — which version, change_description — what
          changed — optional but helpful, IP address — for security/compliance). Compliance
          reporting (generate reports for auditors — show all changes in date range, who made them,
          what changed). Audit trails are critical for compliance (SOC 2, HIPAA, GDPR — require
          tracking data changes), security (detect unauthorized changes), debugging (understand how
          content evolved).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Versioning architecture separates version storage (snapshots, diffs) from version
          management (history, restore, rollback), enabling flexible versioning with efficient
          storage. This architecture is critical for performance and scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/version-history.svg"
          alt="Version History"
          caption="Version History — showing version list with metadata (version number, timestamp, author), side-by-side diff view (additions in green, deletions in red), and restore functionality"
        />

        <p>
          Versioning flow: User edits content. User clicks "Save" (or auto-save triggers). Backend
          creates new version (INSERT INTO content_versions (content_id, version_number, body,
          author_id, change_description) VALUES (...)). Backend stores version (full snapshot or
          diff based on strategy). Backend updates current content (UPDATE content SET
          current_version_id = new_version_id WHERE id = ?). User views version history (SELECT *
          FROM content_versions WHERE content_id = ? ORDER BY version_number DESC). User compares
          versions (load two versions, compute diff — or load pre-computed diff). User restores
          version (create new version with restored content — don't overwrite history, maintain
          audit trail).
        </p>
        <p>
          Version history architecture includes: version list (query versions with metadata —
          version_number, created_at, author_id, change_description, size), side-by-side diff view
          (load two versions, compute diff — Myers diff algorithm, highlight additions/deletions/
          modifications), restore functionality (create new version with restored content — version
          N+1 = content from version N-2, maintain continuous history). This architecture enables
          users to track changes, understand evolution, recover from mistakes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/versioning-audit.svg"
          alt="Versioning Audit Trail"
          caption="Audit Trail — showing who changed what when (user_id, timestamp, version_number, change_description), compliance reporting, and security monitoring"
        />

        <p>
          Audit trail architecture includes: change tracking (log every change — user_id, timestamp,
          version_number, change_description, IP address, user agent), compliance reporting
          (generate reports for auditors — filter by date range, user, content type — export to
          PDF/CSV), security monitoring (detect unauthorized changes — alert on changes outside
          business hours, from unknown IPs, by unauthorized users). This architecture enables
          compliance (SOC 2, HIPAA, GDPR), security (detect unauthorized changes), debugging
          (understand content evolution).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing versioning involves trade-offs between storage efficiency, restore performance,
          and complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Full Snapshots vs Diff-based vs Hybrid</h3>
          <ul className="space-y-3">
            <li>
              <strong>Full Snapshots:</strong> Store complete content per version. Simple
              implementation, fast restore (load one record), easy comparison. Limitation: storage
              inefficient (10 versions of 1MB content = 10MB storage).
            </li>
            <li>
              <strong>Diff-based:</strong> Store only changes between versions. Storage efficient
              (10 versions of 1MB content with small changes = ~2MB storage). Limitation: complex
              restore (apply diffs sequentially), slow for old versions (many diffs to apply).
            </li>
            <li>
              <strong>Hybrid:</strong> Snapshot every N versions (e.g., every 5th version is full
              snapshot, others are diffs). Balances storage efficiency with restore performance.
              Limitation: more complex implementation.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Manual Versioning vs Auto-Versioning</h3>
          <ul className="space-y-3">
            <li>
              <strong>Manual:</strong> User explicitly creates versions (click "Save Version").
              User control (create versions at meaningful points), fewer versions (storage
              efficient). Limitation: users forget to save versions, lose work.
            </li>
            <li>
              <strong>Auto-Versioning:</strong> System automatically creates versions (every edit,
              every N minutes). No lost work (every change saved), comprehensive history.
              Limitation: many versions (storage cost), versions at arbitrary points (less
              meaningful).
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — auto-save drafts (every 30 seconds — no
              lost work), manual versions (user creates named versions at milestones — "Initial
              draft", "After review", "Final"). Best of both — safety with meaningful versions.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Keep All Versions vs Version Limits</h3>
          <ul className="space-y-3">
            <li>
              <strong>Keep All:</strong> Retain all versions forever. Complete history (never lose
              any version), audit trail (compliance). Limitation: storage grows unbounded, slow
              version history (thousands of versions).
            </li>
            <li>
              <strong>Version Limits:</strong> Keep last N versions (e.g., last 100), or versions
              from last N days (e.g., 30 days). Storage bounded, fast version history. Limitation:
              old versions lost (can't restore very old versions).
            </li>
            <li>
              <strong>Recommendation:</strong> Tiered — keep all versions for 30 days (recent
              history), keep weekly snapshots for 1 year (medium history), keep monthly snapshots
              forever (long-term history). Balance completeness with storage.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing content versioning requires following established best practices to ensure
          storage efficiency, restore performance, and user experience.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Versioning Strategy</h3>
        <p>
          Choose based on content size (small content &lt;1MB — full snapshots, large content &gt;1MB
          — diff-based or hybrid). Consider version frequency (frequent versions — diff-based to
          save storage, infrequent versions — snapshots for simplicity). Balance storage efficiency
          with restore performance (hybrid for best balance). Compress versions (gzip version
          content — 50-80% reduction for text content).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version History</h3>
        <p>
          List versions with metadata (version_number, created_at, author_id, change_description,
          size). Enable side-by-side diff view (highlight additions in green, deletions in red,
          modifications in yellow). Enable restore (create new version with restored content —
          don't overwrite history, maintain continuous version chain). Paginate version history
          (show 20 versions per page — don't load thousands at once).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollback Patterns</h3>
        <p>
          Undo/redo (command pattern — each edit is a command with undo operation, maintain
          undo/redo stack — Ctrl+Z/Ctrl+Y). Point-in-time recovery (restore to any timestamp —
          SELECT content FROM history WHERE content_id = ? AND timestamp &lt;= ? ORDER BY timestamp
          DESC LIMIT 1). Branch and merge (parallel editing — create branch from base version, edit
          independently, merge changes back — detect conflicts, resolve manually or automatically).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Trails</h3>
        <p>
          Track every change (user_id — who made change, timestamp — when changed, version_number
          — which version, change_description — what changed, IP address — for security). Enable
          compliance reporting (generate reports for auditors — filter by date range, user, content
          type — export to PDF/CSV). Monitor for security (alert on unauthorized changes — changes
          outside business hours, from unknown IPs, by unauthorized users).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing content versioning to ensure storage
          efficiency, restore performance, and user experience.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Only storing current version:</strong> No history, can't rollback, no audit
            trail. <strong>Fix:</strong> Store all versions (or at least last N versions). Maintain
            version history table.
          </li>
          <li>
            <strong>Full snapshots for large content:</strong> Storage inefficient (10 versions of
            100MB = 1GB). <strong>Fix:</strong> Use diff-based or hybrid strategy for large
            content. Compress versions.
          </li>
          <li>
            <strong>No version metadata:</strong> Users don't know what changed, who changed, when.{" "}
            <strong>Fix:</strong> Store metadata (author_id, timestamp, change_description). Show
            in version history.
          </li>
          <li>
            <strong>Overwriting on restore:</strong> Restoring version overwrites history.{" "}
            <strong>Fix:</strong> Create new version with restored content. Maintain continuous
            version chain.
          </li>
          <li>
            <strong>No diff view:</strong> Users can't see what changed between versions.{" "}
            <strong>Fix:</strong> Implement side-by-side diff view. Highlight additions/deletions.
          </li>
          <li>
            <strong>Unbounded version storage:</strong> Storage grows forever, slows down.{" "}
            <strong>Fix:</strong> Implement version limits (last 100 versions, or 30 days). Tiered
            retention (all for 30 days, weekly for 1 year, monthly forever).
          </li>
          <li>
            <strong>No audit trail:</strong> Can't track who changed what, compliance violation.{" "}
            <strong>Fix:</strong> Log every change (user_id, timestamp, version_number, IP
            address). Enable compliance reporting.
          </li>
          <li>
            <strong>Slow version restore:</strong> Applying many diffs is slow.{" "}
            <strong>Fix:</strong> Use hybrid strategy (snapshot every N versions). Cache restored
            versions.
          </li>
          <li>
            <strong>No conflict resolution:</strong> Collaborative editing causes conflicts.{" "}
            <strong>Fix:</strong> Implement three-way merge. Detect conflicts, prompt user to
            resolve.
          </li>
          <li>
            <strong>No compression:</strong> Versions stored uncompressed, wasteful.{" "}
            <strong>Fix:</strong> Compress version content (gzip — 50-80% reduction for text).
            Decompress on restore.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Content versioning is critical for collaboration, compliance, and recovery. Here are
          real-world implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Code Versioning (Git)</h3>
        <p>
          <strong>Challenge:</strong> Code changes must be tracked. Multiple developers on same
          codebase. Branching for features. Merge conflicts.
        </p>
        <p>
          <strong>Solution:</strong> Diff-based storage (store deltas — efficient for code).
          Branching (create branch from base — develop features independently). Merging (merge
          changes back — three-way merge, detect conflicts). Conflict resolution (manual — user
          resolves conflicts). Commit history (audit trail — who, when, what, why — commit
          message).
        </p>
        <p>
          <strong>Result:</strong> Collaborative development enabled. Changes tracked. Mistakes
          recoverable (revert commits). Compliance (audit trail of all changes).
        </p>
        <p>
          <strong>Architecture:</strong> Diff-based storage, branching/merging, conflict
          resolution, commit history.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Document Collaboration (Google Docs)</h3>
        <p>
          <strong>Challenge:</strong> Real-time collaborative editing. Multiple users editing same
          document. No lost edits. Version history.
        </p>
        <p>
          <strong>Solution:</strong> Operational transforms (real-time sync — merge edits from
          multiple users). Auto-save (every few seconds — no lost work). Version history (named
          versions — user can name versions, auto-named versions — "Edited 2 hours ago"). Restore
          (restore to any previous version — creates new version).
        </p>
        <p>
          <strong>Result:</strong> Real-time collaboration seamless. No lost edits. Version history
          comprehensive. Restore from mistakes.
        </p>
        <p>
          <strong>Architecture:</strong> Operational transforms, auto-save, version history,
          restore.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CMS Platform (WordPress)</h3>
        <p>
          <strong>Challenge:</strong> Post revisions. Authors edit posts multiple times. Recover
          from mistakes. Compare versions.
        </p>
        <p>
          <strong>Solution:</strong> Full snapshots (store complete post content per revision —
          simple, fast restore). Auto-save (every 60 seconds — prevent data loss). Revision list
          (show all revisions with timestamp, author). Compare revisions (side-by-side diff —
          highlight changes). Restore (restore to any revision — creates new revision).
        </p>
        <p>
          <strong>Result:</strong> Authors can experiment (restore if don't like changes). Data
          loss prevented (auto-save). Revision history comprehensive.
        </p>
        <p>
          <strong>Architecture:</strong> Full snapshots, auto-save, revision list, compare,
          restore.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Legal Documents (DocuSign)</h3>
        <p>
          <strong>Challenge:</strong> Legal documents require version tracking. Compliance (audit
          trail of all changes). Multiple parties review/edit. Tamper-proof history.
        </p>
        <p>
          <strong>Solution:</strong> Full snapshots (store complete document per version —
          tamper-proof). Audit trail (who changed what when — user_id, timestamp, IP address,
          change description). Digital signatures (sign specific version — signature invalid if
          document changes). Compliance reporting (export audit trail for auditors — PDF/CSV).
        </p>
        <p>
          <strong>Result:</strong> Compliance met (audit trail). Tamper-proof history (can't
          modify old versions). Legal validity (digital signatures).
        </p>
        <p>
          <strong>Architecture:</strong> Full snapshots, audit trail, digital signatures,
          compliance reporting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Wiki Platform (Confluence)</h3>
        <p>
          <strong>Challenge:</strong> Wiki pages edited by multiple users. Track changes. Compare
          versions. Restore if needed.
        </p>
        <p>
          <strong>Solution:</strong> Hybrid versioning (snapshot every 10 versions, diffs in
          between — balance storage with performance). Version history (list all versions with
          author, timestamp, comment). Compare versions (side-by-side diff — highlight
          additions/deletions). Restore (restore to any version — creates new version). Watch
          pages (notify on changes — track who changed what).
        </p>
        <p>
          <strong>Result:</strong> Collaborative editing enabled. Changes tracked. Mistakes
          recoverable. Compliance (audit trail).
        </p>
        <p>
          <strong>Architecture:</strong> Hybrid versioning, version history, compare, restore,
          notifications.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of content versioning design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose between snapshots and diffs?</p>
            <p className="mt-2 text-sm">
              A: Based on content size and version frequency. Small content (&lt;1MB) — full
              snapshots (simple, fast restore). Large content (&gt;1MB) — diff-based (storage
              efficient) or hybrid (balance). Frequent versions — diff-based to save storage.
              Infrequent versions — snapshots for simplicity. Consider restore performance
              (snapshots faster) vs storage cost (diffs cheaper).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement version history?</p>
            <p className="mt-2 text-sm">
              A: Version table (content_id, version_number, body, author_id, created_at,
              change_description). Query versions (SELECT * FROM content_versions WHERE content_id =
              ? ORDER BY version_number DESC). Show metadata (version number, timestamp, author,
              change description, size). Enable compare (load two versions, compute diff — highlight
              additions/deletions). Enable restore (create new version with restored content —
              don't overwrite history).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement rollback?</p>
            <p className="mt-2 text-sm">
              A: Point-in-time recovery (SELECT content FROM history WHERE content_id = ? AND
              timestamp &lt;= ? ORDER BY timestamp DESC LIMIT 1 — restore to any timestamp).
              Undo/redo (command pattern — each edit is a command with undo operation, maintain
              undo/redo stack). Branch and merge (create branch from base, edit independently,
              merge back — detect conflicts, resolve). Always create new version on restore (don't
              overwrite history).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle merge conflicts?</p>
            <p className="mt-2 text-sm">
              A: Three-way merge (base version + two changes — automatically merge non-conflicting
              changes). Detect conflicts (same lines edited differently — mark as conflict). Prompt
              user to resolve (show conflicting sections — user chooses which to keep, or manually
              edit). Auto-resolve simple conflicts (whitespace, formatting — no user intervention
              needed). Log conflicts (audit trail — who resolved, how).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement audit trails?</p>
            <p className="mt-2 text-sm">
              A: Log every change (user_id — who made change, timestamp — when, version_number —
              which version, change_description — what changed, IP address — for security). Store
              in separate audit table (content_id, user_id, timestamp, action, old_value,
              new_value). Enable compliance reporting (filter by date range, user, content — export
              to PDF/CSV). Monitor for security (alert on unauthorized changes — outside business
              hours, unknown IPs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize version storage?</p>
            <p className="mt-2 text-sm">
              A: Compression (gzip version content — 50-80% reduction for text). Diff-based storage
              (store only changes — not full content). Hybrid strategy (snapshot every N versions —
              balance storage with restore performance). Version limits (keep last 100 versions, or
              30 days — bound storage). Tiered retention (all for 30 days, weekly for 1 year,
              monthly forever — long-term history without unbounded growth).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time collaboration?</p>
            <p className="mt-2 text-sm">
              A: Operational transforms (OT — transform edits from multiple users — merge
              conflicts automatically). CRDTs (Conflict-free Replicated Data Types — mathematical
              approach to conflict-free merging). WebSocket sync (real-time — push edits to other
              users immediately). Auto-save (every few seconds — no lost work). Version history
              (named versions — user can name versions, auto-named — "Edited 2 hours ago").
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle version limits?</p>
            <p className="mt-2 text-sm">
              A: Keep last N versions (DELETE FROM content_versions WHERE content_id = ? AND
              version_number &lt; (SELECT MAX(version_number) FROM content_versions WHERE content_id
              = ?) - 100 — keep last 100). Or keep versions from last N days (DELETE FROM
              content_versions WHERE created_at &lt; NOW() - INTERVAL '30 days' — keep 30 days).
              Tiered retention (all for 30 days, weekly snapshots for 1 year, monthly forever —
              balance completeness with storage).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement diff view?</p>
            <p className="mt-2 text-sm">
              A: Myers diff algorithm (compute diff between two versions — identify additions,
              deletions, modifications). Side-by-side view (left: old version, right: new version —
              highlight additions in green, deletions in red, modifications in yellow). Inline diff
              (single view — show changes inline with markers). Pre-compute diffs (store diff in
              database — faster load, more storage). Compute on-demand (compute when user requests
              — less storage, slower).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Git Versioning Internals
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Operational_transformation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Operational Transformation (Google Docs)
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Web Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
