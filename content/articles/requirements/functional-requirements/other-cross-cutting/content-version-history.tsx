"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-content-version-history",
  title: "Content Version History",
  description:
    "Comprehensive guide to implementing content version history covering version tracking, version comparison, version restoration, version branching, and version management for content editing and collaboration.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "content-version-history",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "version-history",
    "version-control",
    "content-editing",
    "collaboration",
  ],
  relatedTopics: ["draft-saving", "content-recovery", "content-archiving", "collaborative-editing"],
};

export default function ContentVersionHistoryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Content Version History enables tracking and managing different versions of content over time. Users can view version history (see all versions of content), compare versions (see differences between versions), restore previous versions (revert to previous version), and branch versions (create variations). Content version history is fundamental to content editing (track changes over time), collaboration (multiple users can edit), and error recovery (revert mistakes). For platforms with content editing (documents, posts, products, code), effective version history is essential for editing confidence, collaboration, and content quality.
        </p>
        <p>
          For staff and principal engineers, content version history architecture involves version tracking (track each version), version storage (store version data), version comparison (compare versions), version restoration (restore previous versions), and version branching (create branches). The implementation must balance completeness (track all changes) with storage (versions consume storage) and performance (version operations must be fast). Poor version history leads to data loss (can&apos;t recover changes), collaboration issues (can&apos;t merge changes), and user frustration (can&apos;t revert mistakes).
        </p>
        <p>
          The complexity of content version history extends beyond simple version storage. Version tracking (when to create versions). Version metadata (store version information). Version comparison (show differences). Version restoration (restore previous version). Version branching (create variations). For staff engineers, content version history is a content editing infrastructure decision affecting editing confidence, collaboration, and content quality.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Version Tracking</h3>
        <p>
          Version creation creates new versions. Manual versioning (user creates version). Auto versioning (automatically create versions). Event-based versioning (create on specific events). Version creation enables tracking changes. Benefits include change tracking (track all changes), recovery (can revert changes). Drawbacks includes storage overhead (store multiple versions), complexity (manage versions).
        </p>
        <p>
          Version metadata stores version information. Version number (identify version). Timestamp (when version created). Author (who created version). Change summary (what changed). Version metadata enables understanding versions. Benefits include context (understand versions), search (find specific versions). Drawbacks includes storage (store metadata), complexity (manage metadata).
        </p>
        <p>
          Version organization organizes versions. Chronological order (order by time). Branch organization (organize by branch). Tag organization (tag important versions). Version organization enables finding versions. Benefits include findability (find versions easily), understanding (understand version relationships). Drawbacks includes complexity (organize versions), storage (store organization data).
        </p>

        <h3 className="mt-6">Version Comparison</h3>
        <p>
          Version diff shows differences between versions. Side-by-side view (view two versions side by side). Inline diff (highlight differences inline). Change summary (summarize changes). Version diff enables understanding changes. Benefits include change understanding (see what changed), decision making (decide whether to restore). Drawbacks includes UI complexity (build diff UI), performance (calculate diff).
        </p>
        <p>
          Change tracking tracks specific changes. Additions (what was added). Deletions (what was deleted). Modifications (what was modified). Move tracking (what was moved). Change tracking enables detailed understanding. Benefits include detailed tracking (see exact changes), accountability (know who changed what). Drawbacks includes complexity (track changes), storage (store change data).
        </p>
        <p>
          Visual comparison provides visual diff. Text diff (highlight text changes). Visual diff (highlight visual changes). Structure diff (highlight structure changes). Visual comparison enables seeing changes. Benefits include visual understanding (see changes visually), accessibility (easier to understand). Drawbacks includes complexity (build visual diff), performance (calculate visual diff).
        </p>

        <h3 className="mt-6">Version Restoration</h3>
        <p>
          Version restore restores previous versions. Restore button (restore selected version). Restore confirmation (confirm before restore). Create new version (create version of restore). Version restoration enables recovering from mistakes. Benefits include mistake recovery (undo unwanted changes), experimentation (try changes, revert if not liked). Drawbacks includes confusion (which version is current), storage (keep enough versions).
        </p>
        <p>
          Restore options provide different restore methods. Restore as current (restore becomes current). Restore as new version (restore creates new version). Restore to branch (restore to branch). Restore options enable flexible restoration. Benefits include flexibility (choose restore method), safety (restore as new version). Drawbacks includes complexity (multiple options), user confusion (which option to choose).
        </p>
        <p>
          Restore notification notifies of restore. Restore confirmation (confirm restore completed). Change notification (notify of changes). Version notification (notify of new version). Restore notification provides transparency. Benefits include user awareness (know restore happened), accountability (track restores). Drawbacks includes notification overhead (send notifications), user anxiety (too many notifications).
        </p>

        <h3 className="mt-6">Version Branching</h3>
        <p>
          Branch creation creates version branches. Branch from version (create branch from version). Branch naming (name branches). Branch purpose (define branch purpose). Branch creation enables variations. Benefits include experimentation (try variations), collaboration (work on different versions). Drawbacks includes complexity (manage branches), merge conflicts (merge branches).
        </p>
        <p>
          Branch management manages branches. Branch list (see all branches). Branch switching (switch between branches). Branch merging (merge branches). Branch management enables using branches. Benefits include branch organization (organize branches), branch usage (use branches effectively). Drawbacks includes complexity (manage branches), merge conflicts (resolve conflicts).
        </p>
        <p>
          Branch merging merges branches. Automatic merge (automatically merge). Manual merge (manually merge). Conflict resolution (resolve merge conflicts). Branch merging enables combining branches. Benefits include combination (combine variations), collaboration (merge work). Drawbacks includes complexity (merge branches), conflicts (resolve conflicts).
        </p>

        <h3 className="mt-6">Version Management</h3>
        <p>
          Version retention manages version retention. Retention policy (how long to keep versions). Version limit (maximum versions to keep). Important versions (mark important versions). Version retention balances recovery with storage. Benefits include storage management (don&apos;t keep forever), recovery (keep enough versions). Drawbacks includes complexity (manage retention), data loss risk (delete important versions).
        </p>
        <p>
          Version cleanup cleans up versions. Delete old versions (delete old versions). Delete unimportant versions (delete unimportant versions). Consolidate versions (consolidate similar versions). Version cleanup reduces storage. Benefits include storage savings (less storage), organization (cleaner version history). Drawbacks includes data loss risk (delete important versions), complexity (cleanup logic).
        </p>
        <p>
          Version access controls version access. View access (who can view versions). Restore access (who can restore versions). Branch access (who can branch versions). Version access controls version operations. Benefits include security (control access), accountability (track access). Drawbacks includes complexity (manage access), user friction (access denied).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Content version history architecture spans version service, version storage, comparison service, and restoration service. Version service manages version tracking. Version storage persists version data. Comparison service compares versions. Restoration service restores versions. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/content-version-history/version-history-architecture.svg"
          alt="Content Version History Architecture"
          caption="Figure 1: Content Version History Architecture — Version service, storage, comparison, and restoration"
          width={1000}
          height={500}
        />

        <h3>Version Service</h3>
        <p>
          Version service manages version tracking. Version creation (create new versions). Version metadata (store version metadata). Version organization (organize versions). Version service is the core of version history. Benefits include centralization (one place for versions), consistency (same versioning everywhere). Drawbacks includes complexity (manage versioning), coupling (services depend on version service).
        </p>
        <p>
          Version policies define versioning rules. Version triggers (when to create versions). Version retention (how long to keep versions). Version limits (maximum versions). Version policies automate versioning. Benefits include automation (automatic versioning), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Version Storage</h3>
        <p>
          Version storage persists version data. Full storage (store full version). Delta storage (store only changes). Compression (compress version data). Version storage is the persistence layer. Benefits include data protection (versions are saved), recovery (can restore versions). Drawbacks includes storage cost (store multiple versions), complexity (manage storage).
        </p>
        <p>
          Storage optimization optimizes version storage. Delta storage (store only changes). Compression (compress version data). Deduplication (deduplicate common content). Storage optimization reduces storage overhead. Benefits include cost reduction (less storage), performance (less data to store). Drawbacks includes complexity (optimize storage), potential data loss (lossy compression).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/content-version-history/version-comparison.svg"
          alt="Version Comparison"
          caption="Figure 2: Version Comparison — Side-by-side, inline diff, and change summary"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Comparison Service</h3>
        <p>
          Comparison service compares versions. Diff calculation (calculate differences). Visual diff (generate visual diff). Change summary (summarize changes). Comparison service enables understanding changes. Benefits include change understanding (see what changed), decision making (decide whether to restore). Drawbacks includes complexity (calculate diff), performance (diff calculation).
        </p>
        <p>
          Diff optimization optimizes diff calculation. Efficient algorithms (use efficient diff algorithms). Caching (cache diff results). Incremental diff (calculate incremental diff). Diff optimization improves performance. Benefits include performance (faster diff), user experience (quicker results). Drawbacks includes complexity (optimize diff), caching overhead.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/content-version-history/version-branching.svg"
          alt="Version Branching"
          caption="Figure 3: Version Branching — Branch creation, management, and merging"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Content version history design involves trade-offs between completeness and storage, automatic and manual versioning, and full and delta storage. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Versioning: Complete vs. Selective</h3>
        <p>
          Complete versioning (track all changes). Pros: Maximum recovery (can restore any change), complete audit trail (track all changes), user confidence (know all changes tracked). Cons: Storage cost (many versions), management overhead (manage many versions), search complexity (find right version). Best for: Important content, compliance requirements.
        </p>
        <p>
          Selective versioning (track important changes). Pros: Lower storage cost (fewer versions), simpler management (fewer versions), faster search (fewer versions). Cons: Limited recovery (can&apos;t restore all changes), incomplete audit trail, user frustration (can&apos;t restore). Best for: Casual content, storage-constrained environments.
        </p>
        <p>
          Hybrid: smart versioning. Pros: Best of both (track important, skip unimportant). Cons: Complexity (determine important), may still miss important. Best for: Most platforms—track important changes, skip minor changes.
        </p>

        <h3>Creation: Automatic vs. Manual</h3>
        <p>
          Automatic versioning (automatically create versions). Pros: No user action needed (automatic), comprehensive (don&apos;t miss changes), consistent (same versioning for all). Cons: Storage overhead (many versions), may create unnecessary versions, less user control. Best for: Most content creation, preventing data loss.
        </p>
        <p>
          Manual versioning (user creates versions). Pros: User control (users decide when to version), less storage overhead (fewer versions), clear version points. Cons: May miss versions (users forget), inconsistent (users version differently), user burden (must remember to version). Best for: Expert users, controlled environments.
        </p>
        <p>
          Hybrid: auto-version with manual override. Pros: Best of both (automatic by default, manual control). Cons: Complexity (both mechanisms), may confuse users. Best for: Most platforms—auto-versioning with manual version option.
        </p>

        <h3>Storage: Full vs. Delta</h3>
        <p>
          Full storage (store complete versions). Pros: Simple (store complete), fast restore (no reconstruction), independent versions (each version complete). Cons: Storage cost (store complete data), redundancy (store same data multiple times), inefficient (store unchanged data). Best for: Small content, simple versioning.
        </p>
        <p>
          Delta storage (store only changes). Pros: Storage efficient (store only changes), less redundancy (don&apos;t store same data), efficient (store only changed data). Cons: Complex (reconstruct versions), slower restore (must reconstruct), dependent versions (need base version). Best for: Large content, frequent versioning.
        </p>
        <p>
          Hybrid: full for important, delta for routine. Pros: Best of both (efficient for routine, fast for important). Cons: Complexity (two storage methods), may store incorrectly. Best for: Most platforms—delta for routine versioning, full for important versions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/content-version-history/version-history-comparison.svg"
          alt="Version History Approaches Comparison"
          caption="Figure 4: Version History Approaches Comparison — Versioning, creation, and storage trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Track versions automatically:</strong> Auto-version on save. Version on significant changes. Version on user action. Don&apos;t rely on manual versioning.
          </li>
          <li>
            <strong>Store version metadata:</strong> Version number. Timestamp. Author. Change summary. Enable version understanding.
          </li>
          <li>
            <strong>Enable version comparison:</strong> Side-by-side view. Inline diff. Change summary. Visual diff.
          </li>
          <li>
            <strong>Enable version restoration:</strong> Restore button. Restore confirmation. Create new version on restore. Notify on restore.
          </li>
          <li>
            <strong>Support version branching:</strong> Create branches. Manage branches. Merge branches. Resolve conflicts.
          </li>
          <li>
            <strong>Manage version retention:</strong> Retention policy. Version limit. Mark important versions. Delete old versions.
          </li>
          <li>
            <strong>Optimize version storage:</strong> Delta storage. Compression. Deduplication. Manage storage space.
          </li>
          <li>
            <strong>Control version access:</strong> View access. Restore access. Branch access. Audit access.
          </li>
          <li>
            <strong>Provide version UI:</strong> Version list. Version preview. Version diff. Version actions.
          </li>
          <li>
            <strong>Monitor versioning:</strong> Monitor version creation. Monitor storage. Monitor restoration. Alert on issues.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No auto-versioning:</strong> Users must manually version. <strong>Solution:</strong> Auto-version on save and changes.
          </li>
          <li>
            <strong>No version metadata:</strong> Don&apos;t know version details. <strong>Solution:</strong> Store timestamp, author, summary.
          </li>
          <li>
            <strong>Can&apos;t compare versions:</strong> Don&apos;t know differences. <strong>Solution:</strong> Enable version comparison, diff view.
          </li>
          <li>
            <strong>Can&apos;t restore versions:</strong> Can&apos;t recover changes. <strong>Solution:</strong> Enable version restoration.
          </li>
          <li>
            <strong>Excessive storage:</strong> Versions consume too much storage. <strong>Solution:</strong> Delta storage, compression, cleanup.
          </li>
          <li>
            <strong>No version limits:</strong> Keep versions forever. <strong>Solution:</strong> Retention policy, version limit.
          </li>
          <li>
            <strong>No version access control:</strong> Anyone can restore versions. <strong>Solution:</strong> Control version access.
          </li>
          <li>
            <strong>Poor version UI:</strong> Can&apos;t find or use versions. <strong>Solution:</strong> Version list, preview, actions.
          </li>
          <li>
            <strong>No branching:</strong> Can&apos;t create variations. <strong>Solution:</strong> Support version branching.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know version status. <strong>Solution:</strong> Monitor versioning, storage, restoration.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Google Docs Version History</h3>
        <p>
          Google Docs provides comprehensive version history. Auto-versioning (version on every change). Version list (see all versions). Version comparison (see changes). Version restoration (restore previous version). Named versions (name important versions). Users can track all changes and restore any version.
        </p>

        <h3 className="mt-6">GitHub Code Version History</h3>
        <p>
          GitHub provides code version history. Commit history (track all commits). Diff view (see code changes). Branch management (manage branches). Merge conflicts (resolve conflicts). Version restoration (revert commits). Developers can track all code changes and collaborate effectively.
        </p>

        <h3 className="mt-6">WordPress Post Revisions</h3>
        <p>
          WordPress provides post revision history. Auto-revisions (revision on save). Revision list (see all revisions). Revision comparison (compare revisions). Revision restoration (restore revision). Users can track post changes and restore previous versions.
        </p>

        <h3 className="mt-6">Figma Design Version History</h3>
        <p>
          Figma provides design version history. Auto-versioning (version on changes). Version list (see all versions). Version preview (preview versions). Version restoration (restore version). Branch management (branch designs). Designers can track design changes and collaborate.
        </p>

        <h3 className="mt-6">Wikipedia Edit History</h3>
        <p>
          Wikipedia provides edit history. Edit tracking (track all edits). Edit comparison (compare edits). Edit restoration (restore edits). Edit attribution (attribute edits). Users can track all edits and restore previous versions. Complete audit trail of all changes.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement version tracking that doesn&apos;t consume excessive storage?</p>
            <p className="mt-2 text-sm">
              Implement delta storage because storing full versions consumes excessive storage, especially for frequently edited content. Store only changes: instead of storing full document for each version, store delta (what changed from previous version)—&quot;added paragraph 3,&quot; &quot;deleted line 5,&quot; &quot;modified image&quot;—reduces storage by 90%+ for text content. Compress version data: gzip deltas, compress images, optimize storage format—further reduces storage by 60-80%. Deduplicate common content: same images, templates, repeated phrases stored once, referenced multiple times—eliminates redundant storage. Retention policy: delete old versions (keep last 50 versions, or versions from last 90 days)—storage management, most recovery needs are recent. The storage insight: versions can consume lots of storage—optimize with delta storage (store changes not full versions), compression (gzip, image optimization), deduplication (store once, reference multiple), retention (delete old versions), and continuously monitor storage growth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enable version comparison?</p>
            <p className="mt-2 text-sm">
              Implement diff service because users need to understand what changed between versions before deciding to restore. Calculate differences: text diff (character-level changes, word-level changes), visual diff (layout changes, design changes), structure diff (heading changes, section reordering)—multiple diff types for different content. Side-by-side view: view two versions side by side (left: old version, right: new version)—easy visual comparison, scroll synchronized. Inline diff: highlight differences within single view (additions in green, deletions in red, modifications highlighted)—compact view, clear highlighting. Change summary: summarize changes (&quot;3 paragraphs added, 1 image removed, 5 lines modified&quot;)—quick understanding without reading full diff. The comparison insight: users need to understand changes—provide diff (text, visual, structure), highlight differences (color-coded), summarize changes (count additions/deletions), and make comparison intuitive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle version restoration?</p>
            <p className="mt-2 text-sm">
              Implement restoration service because restoration must be safe—users shouldn&apos;t accidentally lose work by restoring wrong version. Restore button: restore selected version (one-click restore from version history)—clear UI, obvious action. Confirmation: confirm before restore (&quot;Restore this version? Current content will become previous version.&quot;)—prevent accidental restores, explain consequences. Create new version: create version of restore (restored content becomes new version, not overwrite)—preserves current content as previous version, enables undo of restore. Notify: notify of restore (&quot;Version restored from [date],&quot; notify collaborators)—transparency, collaborators know content changed. The restoration insight: restoration must be safe—confirm before restore (prevent accidents), create new version (preserve current content), notify collaborators (transparency), and enable undo of restore.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement version branching?</p>
            <p className="mt-2 text-sm">
              Implement branching system because branching enables variations—users can experiment without affecting main content. Branch creation: create branch from version (branch from any version, name branch, track separately)—enables parallel development, experimentation. Branch management: manage branches (list branches, switch between branches, delete branches, merge branches)—branch dashboard, clear branch status. Branch merging: merge branches (merge branch back to main, resolve conflicts during merge)—merge tools, conflict resolution. Conflict resolution: resolve conflicts (show conflicts, let user choose which version, auto-merge non-conflicting changes)—conflict UI, merge tools. The branching insight: branching enables variations—create branches (from any version), manage branches (list, switch, delete, merge), merge branches (with conflict resolution), and provide clear branch status.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage version retention?</p>
            <p className="mt-2 text-sm">
              Implement retention management because can&apos;t keep all versions forever—storage costs grow indefinitely without retention. Retention policy: how long to keep (keep versions for 90 days, or keep last 50 versions)—automated cleanup, configurable per content type. Version limit: maximum versions (max 100 versions per document, oldest deleted when exceeded)—prevents unlimited growth, fair storage allocation. Important versions: mark important (user marks version as important, important versions retained longer or indefinitely)—milestone versions preserved, regular versions cleaned up. Cleanup: delete old versions (automated cleanup job, user-initiated cleanup, storage reclamation)—storage management, keeps relevant versions. The retention insight: can&apos;t keep all versions forever—balance recovery capability with storage costs, keep what matters (recent, important), delete what doesn&apos;t (old, minor changes), and communicate retention policy clearly to users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you auto-version without creating too many versions?</p>
            <p className="mt-2 text-sm">
              Implement smart auto-versioning because auto-versioning is essential for recovery but can create too many versions if done naively. Version on save: not every keystroke—version when user explicitly saves or at natural breakpoints (paragraph complete, section done)—reduces version count significantly. Version on significant changes: not minor changes (typo fixes, formatting changes don&apos;t trigger version)—threshold for &quot;significant&quot; (100+ characters changed, new section added). Debounce versioning: version after pause (wait 60 seconds after last edit before versioning)—captures work without versioning every edit. Merge minor versions: consolidate minor versions (merge versions within 5 minutes into single version)—reduces version count, keeps meaningful milestones. The versioning insight: auto-versioning is essential but can create too many versions—version smartly (on save, significant changes), debounce (wait for pause), merge minor versions (consolidate rapid edits), and balance recovery capability with version count.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://support.google.com/docs/answer/190843"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Docs — Version History
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/repositories/working-with-files/managing-files/viewing-a-file"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub — File Version History
            </a>
          </li>
          <li>
            <a
              href="https://wordpress.org/support/article/revisions/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WordPress — Post Revisions
            </a>
          </li>
          <li>
            <a
              href="https://www.figma.com/help/articles/version-history/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma — Version History
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/w/index.php?title=Special:PageHistory"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — Edit History
            </a>
          </li>
          <li>
            <a
              href="https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Git — Version Control and History
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
