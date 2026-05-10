"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-version-history-system",
  title: "Design Version History System",
  description:
    "Production-grade version tracking with immutable snapshots, diff display, rollback, and named versions.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "version-history-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "version-history", "audit-trail", "diff", "rollback"],
  relatedTopics: ["debounced-auto-save-system", "audit-log-viewer-ui"],
};

export default function VersionHistorySystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Version history gives users confidence to make bold changes: if a document, configuration, or data record can be reverted to any previous state, the cost of mistakes is low. Without version history, users work conservatively (afraid to break something that cannot be undone) or maintain their own versioning externally (appending "_v2", "_backup", "_final_FINAL" to filenames). With good version history, users work faster and experiment more freely.</p>
        <p>The design problem is multidimensional. Storage efficiency: storing complete copies of every version is wasteful for large documents with small incremental changes. Storage using only deltas (diffs) is efficient but requires reconstructing versions by applying diffs in sequence, which is slow for old versions. The correct design for most applications stores complete snapshots (not deltas) with efficient content-addressed deduplication—unchanged sections don't consume additional storage. Diff display: showing what changed between two versions requires a text or structured diff algorithm. The display must be readable for non-technical users. Rollback: creating a "new version" that restores old content (rather than overwriting the current version in place) preserves the history of the rollback itself.</p>
        <p><strong>Explicit assumptions:</strong> The versioned entity is a structured document (JSON or rich text). Versions are created on explicit save events (not auto-saved every second—that would create thousands of versions). Rollback creates a new version (does not overwrite history). Named versions ("Published Draft", "Before Review") allow flagging significant milestones. The version history UI shows a timeline of versions with author, timestamp, and change summary.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Version creation:</strong> A new version is created on explicit save. Auto-save creates or updates a draft, not a version.</li>
          <li><strong>Version timeline UI:</strong> Show a chronological list of versions with: version number, author, timestamp, optional name, and a one-line change summary.</li>
          <li><strong>Diff view:</strong> Select any two versions to compare. Show word-level diff (added/removed/unchanged text) for rich text; field-level diff for structured JSON.</li>
          <li><strong>Rollback:</strong> Create a new version with the content of an older version. The rollback itself is a version in the timeline ("Rolled back to v12").</li>
          <li><strong>Named versions:</strong> Users can name significant versions ("Final Draft", "Approved by Legal"). Named versions are pinned in the timeline and excluded from automatic cleanup.</li>
          <li><strong>Version limit:</strong> Keep the last 100 versions for regular documents; keep all named versions indefinitely. Prune oldest unnamed versions beyond the limit.</li>
          <li><strong>Version preview:</strong> Preview any version without leaving the current edit state (non-destructive view of historical content).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Storage efficiency:</strong> Version storage per document proportional to change volume, not to document size × version count (deduplication or compression).</li>
          <li><strong>Diff performance:</strong> Diff between any two versions computes within 500ms for documents up to 100,000 words.</li>
          <li><strong>Timeline load time:</strong> Version timeline with 100 entries loads within 1 second (metadata only, no content fetched upfront).</li>
          <li><strong>Immutability:</strong> Once a version is created, its content cannot be modified. Versions are append-only.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>Each version is an immutable snapshot stored as a complete copy of the document content at that point in time. Deduplication is handled at the block level (the document is split into content blocks; unchanged blocks are referenced by hash rather than stored again). The version record stores: versionId, documentId, authorId, content (or a reference to the content in block storage), contentHash (SHA-256 of the full content, used to detect duplicate saves), parentVersionId (the version this was based on, forming a DAG for branching support), optional versionName, and timestamps.</p>
        <p>The diff between two versions is computed server-side on demand (not precomputed for every version pair) using a word-level diff algorithm (diff-match-patch for text, RFC 6902 JSON Patch for structured data). The result is returned as an annotated document with each word or field tagged as added, removed, or unchanged. The client renders this annotated diff in a two-panel or inline display.</p>
        <p>Rollback creates a new version record with the content of the target historical version, plus a rollback annotation in the version metadata (rolledBackFromVersionId). The current version advances—history is always append-only, never mutated. This means the timeline shows the rollback as a new version event, preserving the full record of what happened: "v14: Rolled back to v12 (by Alice at 3:45pm)."</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/version-history-system.svg"
          alt="Version history system showing immutable snapshot storage with content hash, parentVersionId chain, word-level diff via diff-match-patch, rollback as new version creation, named version pinning, and timeline UI"
          caption="Version history system showing immutable snapshot storage with content hash, parentVersionId chain, word-level diff via diff-match-patch, rollback as new version creation, named version pinning, and timeline UI"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Storage Schema</h3>
        <p>The versions table contains: versionId (UUID, primary key), documentId (foreign key), versionNumber (monotonically increasing integer per document), authorId, content (TEXT or JSONB), contentHash (SHA-256 hex, indexed), parentVersionId (UUID, self-referential foreign key), versionName (nullable string), isNamed (boolean, true if versionName is set), changeSummary (a brief server-generated description of what changed, e.g., "Modified section 3; added 142 words"), rolledBackFromVersionId (nullable, set on rollback versions), createdAt (indexed for timeline ordering).</p>
        <p>The contentHash serves two purposes: deduplication detection (if the user saves without making changes, the hash matches the previous version and no new version is created—"no-op save") and integrity verification (the stored hash can be recomputed from the content and compared to detect storage corruption). Deduplication at the full-document level is simple and correct for most documents. Block-level deduplication (splitting the document into sections and storing only changed blocks) provides additional storage savings for large documents but adds query complexity.</p>
        <p>The parentVersionId forms a linear chain for the common case (sequential edits) and a DAG for branching (if the system supports working on two branches of a document simultaneously). Most applications only need the linear chain; the DAG is worth designing for if the product has branching as a first-class concept (like Git branches for documentation).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Timeline UI</h3>
        <p>The version timeline is a right-side panel in the document editor. It loads the version list on open: GET /documents/:docId/versions returns a paginated list of version metadata (versionId, versionNumber, authorDisplayName, authorAvatarUrl, createdAt, versionName, changeSummary, isNamed). Content is not included in the list response—it's fetched on demand when the user previews or diffs a version.</p>
        <p>Each version row shows: the version number, author avatar, relative timestamp (e.g., "2 hours ago"), optional name badge (for named versions), and the change summary. Named versions are visually distinguished (bold, pinned to the top of named-version group, or shown with a flag icon). Hovering a version row shows action buttons: Preview, Compare to current, Restore. Clicking a row expands it inline (no navigation away from the editor) to show the full change summary and a mini-preview of the diff.</p>
        <p>The timeline uses cursor pagination (createdAt + versionId as cursor) and loads the most recent 20 versions initially. Scrolling to the bottom loads older versions. Named versions are always included (they are never pruned by the automatic limit) but may appear at any position in the timeline (they are interleaved with regular versions by timestamp).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Diff Algorithm and Display</h3>
        <p>For rich text documents, the diff operates at the word level. The diff-match-patch library (Google's open-source implementation) provides a Myers diff algorithm that finds the minimum edit distance between two texts. The result is a list of operations: [EQUAL, "unchanged text"], [DELETE, "removed text"], [INSERT, "added text"]. The UI renders these operations inline: removed text in red with strikethrough, added text in green, unchanged text in the default color.</p>
        <p>For structured JSON documents (form data, configuration), the diff operates at the field level: compare field by field, highlight added fields (green), removed fields (red), and changed fields (yellow with before/after values). Nested objects are diffed recursively. Arrays with significant reordering are the hardest case: a simple field comparison would show every element as changed if items were reordered. The solution is to use the LCS (longest common subsequence) algorithm to identify matched elements and only show truly different elements as additions/removals.</p>
        <p>Performance: for large documents (100,000 words, ~500KB text), the diff-match-patch algorithm runs in under 100ms on modern hardware. The diff computation is performed server-side in response to a client request, avoiding the need to download both full versions to the client for diff computation. The server returns the diff result as an annotated JSON structure; the client renders it without re-running the diff algorithm.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rollback Operation</h3>
        <p>Rollback is a Create operation, not an Update. The client sends POST /documents/:docId/versions with body {"{"}fromVersionId: "v12"{"}"}. The server fetches the content of v12, creates a new version record with that content, sets rolledBackFromVersionId: "v12", generates a changeSummary: "Restored content from version 12", and returns the new version. The document's current content is now the content of v12, but the version history shows all intermediate versions (v13, v14 that are now superseded) plus the rollback (v15).</p>
        <p>This append-only approach is critical for accountability: in a collaborative environment, users need to know not just what the current content is, but the full history of who changed it and when—including the decision to roll back to an older version. Overwriting history (replacing v14 with v12's content without creating a new version) would hide this information and break the audit trail.</p>
        <p>After rollback, the editor reloads the document content (the server returns the new current version's content) and shows a notification: "Restored to version 12." The notification includes an "Undo rollback" link, which is itself a rollback to the version before the rollback (v14 in this example). This allows quickly undoing an accidental rollback within the editing session.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Pruning</h3>
        <p>Unlimited version retention is not viable for high-edit-rate documents (a document edited 50 times per day would have 18,250 versions per year). Version pruning deletes older unnamed versions beyond a configurable limit (default: 100 versions per document, or 90 days of history, whichever is more). Named versions are excluded from pruning—they are kept indefinitely or until the user explicitly deletes them.</p>
        <p>Pruning runs as a background job triggered after each new version creation (check if the count of unnamed versions exceeds the limit; if so, delete the oldest unnamed version). This keeps the version count bounded without a separate cleanup cron job. The pruning logic should log pruned version IDs and their content (to an archival log, not the active database) for compliance purposes before deletion—some organizations have legal requirements to retain data modification history.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Full snapshot storage versus delta storage: full snapshots (storing complete document content per version) are simple to implement (fetching any version is a single database read) and reliable (no risk of corruption from a bad delta in the chain). Delta storage (storing only the diff between consecutive versions) is more storage-efficient but requires applying deltas in sequence to reconstruct older versions (O(n) read complexity for the nth version). For most applications with documents under 1MB and fewer than 100 versions, full snapshots are the correct choice. Git uses delta compression for efficiency, but Git is optimizing for repositories with millions of versions—few application version history systems reach that scale.</p>
        <p>Server-side versus client-side diff computation: server-side diff requires a network round-trip for each pair comparison but keeps client bundle size small and offloads computation. Client-side diff (downloading both versions and diffing in the browser) is faster for subsequent comparisons (no round-trip) but requires sending full version content to the client. For large documents, downloading both versions is expensive; for small documents, client-side is faster. Use server-side for initial diff requests and cache the result (the diff of two immutable versions never changes).</p>
        <p>Version creation triggers: creating a version on every auto-save would generate hundreds of versions per editing session, most capturing trivial intermediate states. Explicit saves (user clicks Save) create meaningful versions. A hybrid: explicit saves create named checkpoints; auto-saves update the "current draft" version without incrementing the version number. This provides both safety (no data loss between explicit saves) and meaningful history (the timeline shows significant save points, not every auto-save).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production version history system stores immutable full-content snapshots per version, deduplicating at the content hash level (no new version created for no-op saves). The version timeline loads metadata only on open; content is fetched on demand for preview or diff. Diff is computed server-side (diff-match-patch for text, field-level diff for JSON) and cached since immutable versions' diffs never change. Rollback creates a new version (not an in-place overwrite), preserving the complete audit trail including the rollback event itself. Named versions are protected from automatic pruning; regular versions are pruned after the configured limit (100 versions) to bound storage. The parentVersionId chain forms the version DAG, supporting linear history for most applications and branching for advanced collaborative workflows. The defining design principle: versions are immutable; the only write operation is appending a new version, never modifying or deleting historical ones.</p>
      </section>
    </ArticleLayout>
  );
}
