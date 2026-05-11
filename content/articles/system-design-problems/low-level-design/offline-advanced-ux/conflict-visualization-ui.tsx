"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-conflict-visualization-ui",
  title: "Conflict Visualization UI System",
  description: "Visualizing and resolving data conflicts in offline-first and multi-device scenarios",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "conflict-visualization-ui",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-06",
  tags: ["lld", "conflict-resolution", "offline", "sync", "ux"],
  relatedTopics: ["local-first-architecture", "background-sync-queue"],
};

export default function ConflictVisualizationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">In offline-first or local-first systems, multiple devices edit the same document independently. Device A edits a note's title to "Meeting Notes". Device B edits the same title to "Q4 Review". When both devices sync, the server detects a conflict: which version is correct? Without visualization, the user is unaware of the conflict; they see one version (maybe the server overwrites with device B), losing device A's changes.</HighlightBlock>
        <HighlightBlock as="p" tier="important">A conflict visualization UI shows the user both versions and lets them decide. "You edited this to X, another device edited it to Y. Which do you want to keep?" The user can see the differences, understand the context, and make an informed choice.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Key challenges: detecting conflicts (comparing versions), visualizing differences clearly (highlighting what changed), resolving without data loss (preserving both versions until user chooses), and handling cascading conflicts (if the note has 5 edited fields, show all 5 conflicts).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Explicit assumptions:</strong> Version tracking exists (each document has versions). Conflict detection is accurate (can identify when divergence occurred). UI can show side-by-side diffs. User can make decisions quickly. Conflicts are relatively rare (not overwhelming the user with options on every sync).</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Conflict detection:</strong> Identify when local version conflicts with server/other device version.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Conflict display:</strong> Show both conflicting versions side-by-side with visual diff highlighting.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>User choice:</strong> Allow user to select which version to keep (local, remote, merged, or manual edit).</HighlightBlock>
          <li><strong>Cascading conflicts:</strong> Handle documents with multiple conflicting fields; visualize all conflicts.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Context preservation:</strong> Show enough context (surrounding text, timestamps, author) for informed decision.</HighlightBlock>
          <li><strong>Resolution persistence:</strong> After user resolves conflict, persist their choice and prevent re-asking.</li>
          <li><strong>Undo/revert:</strong> Allow user to reconsider and re-resolve if they change their mind.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Latency:</strong> Detect conflicts within 1-2 seconds of sync. Display conflict UI within 500ms.</HighlightBlock>
          <li><strong>Clarity:</strong> User understands the conflict and options without help. Clear visual diff is essential.</li>
          <li><strong>Scalability:</strong> Handle documents with 100+ fields; show conflicts efficiently (paginate if needed).</li>
          <li><strong>Data safety:</strong> No data loss. All versions retained until resolution.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">When sync detects a version divergence, the system displays a modal or panel showing the conflicting versions. For simple conflicts (single field), a side-by-side diff suffices. For complex conflicts (multiple fields), a list of conflicts with the ability to view/resolve each individually.</HighlightBlock>
        <HighlightBlock as="p" tier="important">User actions: select which version to keep, or manually edit to create a merged version. Once resolved, the chosen version becomes the new local copy, and the next sync uploads the resolved version to the server.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Conflict prevention: use CRDTs or operation-based merging to automatically resolve some conflicts without user intervention. Display UI only for truly unresolvable conflicts.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/conflict-visualization-ui.svg"
          alt="Conflict visualization patterns including field-level conflict, diff view, delete vs edit conflict, side-by-side comparison, and inline conflict markers"
          caption="Conflict visualization patterns including field-level conflict, diff view, delete vs edit conflict, side-by-side comparison, and inline conflict markers"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Detection</h3>
        <p>When syncing, the system compares version numbers. If local version and remote version have the same parent but different edits, it's a conflict. Example: both versions descended from v5, local is v6 (with edits A), remote is v5.1 (with edits B). Divergence detected.</p>
        <p>Three-way diff: compare local, remote, and common ancestor (v5). Identify which parts changed locally, which changed remotely. If changes are to different parts (local edited field X, remote edited field Y), auto-merge. If both edited the same field, it's a conflict requiring user input.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Display UI</h3>
        <p>For single-field conflicts: side-by-side view with local on left, remote on right. Highlight the differences in color (red for deletions, green for additions). Show timestamps and author info for context.</p>
        <p>For multi-field conflicts: tabbed or list view showing all conflicts. User can view each conflict in detail and resolve independently.</p>
        <p>Example UI: "Conflict detected: 2 fields changed differently. [Field 1] [Field 2]. Resolve each to proceed."</p>
        <HighlightBlock as="p" tier="important"><strong>Diff Visualization Strategies and Context Display:</strong> Use inline highlighting for short text (highlight additions in green, deletions in red within the text). For longer documents, use unified diff format (showing lines before/after). For JSON/structured data, show tree diff highlighting changed keys/values. Additionally, show context around changes: display 3 lines before and after each change so user understands the broader context. For images/binary files, show thumbnail previews of both versions side-by-side or provide a way to download/view full versions. Additionally, show metadata: timestamp ("edited 10 minutes ago"), author/device ("device: iPhone"), and any notes the user/system added ("Edited during offline sync").</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resolution Options</h3>
        <p>Keep local: user trusts their edits, discards remote version. Keep remote: user accepts remote, discards local. Merge manually: user sees both and manually edits to combine them (e.g., "Alice edited to X, Bob edited to Y, I'll merge to Z"). Use CRDT: if available, automatic merge applies both edits in order (works for collaborative edits like list items, text insertions).</p>
        <HighlightBlock as="p" tier="crucial"><strong>Smart Resolution Suggestions and Decision Support:</strong> Rather than forcing the user to choose, provide suggestions. Example: "Both edits are to different parts of the document. Auto-merged." For same-field edits, suggest based on heuristics: (1) Latest edit wins (timestamp-based). (2) Longer/more comprehensive version (for text, length heuristic). (3) Default to user's own edit (self-prioritization). Present suggestion but always allow user override. Additionally, show impact of each choice: "Choosing local: remote's paragraph about Q4 strategy will be lost." This helps user understand consequences before deciding. For bulk conflicts, offer "Resolve all with same rule" option: "Apply 'keep local' to all remaining conflicts?" reducing click fatigue.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Visual Diff Representation</h3>
        <p>For text: use unified diff format (--- remote, +++ local) or inline highlighting. For structured data (JSON): show tree diff with changed fields highlighted. For lists: show added/removed items in context.</p>
        <p>Readability: use consistent colors (red=deleted, green=added, yellow=modified). Font diff libraries (diff-match-patch, fast-diff) handle the heavy lifting.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cascading Conflicts</h3>
        <p>Document with 10 fields, 3 of which have conflicts. Display all 3 conflicts in a list. User resolves each independently. Once all resolved, sync proceeds with the merged document.</p>
        <HighlightBlock as="p" tier="important">Progressive disclosure: show conflicts one at a time (wizard style) or all at once (list). Wizard is simpler but slower; list is faster but overwhelming. Choose based on expected conflict frequency.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Persistence and Undo</h3>
        <HighlightBlock as="p" tier="important">After user resolves a conflict and syncs, store the resolution decision (which version was chosen, when, by whom). If the user later realizes they chose wrong, provide an "undo" button that re-opens the conflict for re-resolution.</HighlightBlock>
        <p>Prevent conflict re-asking: once a conflict is resolved for a specific version pair, don't ask again. If new edits happen, only ask about new conflicts.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CRDT-Based Automatic Merge</h3>
        <p>For some operations (text insertion, list append), CRDTs can automatically merge without user intervention. Example: Alice appends "intro" to a document, Bob appends "conclusion". CRDT merges both appends in order. No conflict dialog needed.</p>
        <p>Reserve conflict UI for truly conflicting edits (both edited same field differently, delete vs edit, etc.) where automatic merge isn't safe.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Optimization</h3>
        <HighlightBlock as="p" tier="important">Diff computation is O(n) where n is document size. For large documents (100KB+), compute diff in a web worker to avoid blocking the UI. Cache diffs to avoid recomputing if user dismisses and reopens.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Auto-merge vs user decision: CRDTs auto-merge more cases but are complex. Simple last-write-wins is fast but loses data. Hybrid: auto-merge safe cases (different fields), ask user for truly conflicting edits (same field).</HighlightBlock>
        <HighlightBlock as="p" tier="important">UI complexity: simple side-by-side diff is clear but works only for small data. Complex UI (tabs, lists) needed for documents with many conflicts. Choose based on expected conflict patterns.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Conflict frequency: if conflicts are rare (most devices edit different parts), auto-merge handles 99% of cases; conflict UI needed only 1%. If conflicts are frequent, user gets fatigued from constant decisions; better to improve merge logic.</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Side-by-Side Diff for Single Conflicts</h3>
        <HighlightBlock as="p" tier="crucial">Simple modal showing local vs remote with highlighted differences. User picks one or manually edits.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Multi-Field Conflict List</h3>
        <HighlightBlock as="p" tier="important">Tabbed interface or list showing all conflicted fields. User resolves each field independently, then syncs.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: CRDT-Based Auto-Merge with Fallback</h3>
        <HighlightBlock as="p" tier="important">Automatically merge CRDT-compatible edits. Show conflict UI only for unresolvable conflicts.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Trade-offs include auto-merge complexity (handles more cases) versus simplicity (user decides everything), and UI complexity (handles many conflicts) versus clarity (simple diffs).</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Real-world systems (Notion, Obsidian, Google Docs) use conflict visualization for multi-device sync. For best results, implement three-way diff to auto-resolve non-conflicting changes, use CRDT for text/list operations, reserve conflict UI for truly unresolvable conflicts, and provide clear diffs with context (timestamps, author). This minimizes user fatigue while ensuring no data loss.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
