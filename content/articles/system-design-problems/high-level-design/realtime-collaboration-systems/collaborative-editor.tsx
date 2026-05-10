"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-collaborative-editor",
  title: "Design a Collaborative Editor (Google Docs / Notion Style)",
  description:
    "Architecture for a real-time collaborative text editor: OT versus CRDT, cursor synchronization, conflict-free merging, offline support, and performance at scale.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "collaborative-editor",
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-10",
  tags: ["hld", "collaborative-editor", "OT", "CRDT", "real-time", "conflict-resolution"],
  relatedTopics: ["real-time-collaborative-whiteboard", "offline-realtime-sync-reconciliation-system"],
};

export default function CollaborativeEditorArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A collaborative text editor allows multiple users to edit the same document simultaneously, with all edits visible in real-time to all participants. The fundamental challenge is concurrent edit conflict resolution: if user A inserts "hello" at position 5 while user B simultaneously deletes the character at position 3, the position references in both operations become invalid when applied in sequence. Without a conflict resolution algorithm, the document state diverges across clients and becomes corrupted.</p>
        <p>Two algorithms solve this problem in production: Operational Transform (OT) and Conflict-Free Replicated Data Types (CRDTs). Google Docs uses OT; Notion and many newer systems use CRDTs. Both approaches guarantee eventual consistency—all clients converge to the same document state when all operations have been applied—but they differ in complexity, performance characteristics, and offline support capabilities. Understanding both is essential for designing a production collaborative editor.</p>
        <p><strong>Explicit assumptions:</strong> The document model is a rich text document (paragraphs, headings, lists, inline formatting—not a plain text file). The data structure is a sequence of blocks (paragraphs, headings), each containing a sequence of inline nodes (text spans with formatting). Collaborative editing operates at the block level (paragraph creation, deletion, reordering) and the inline level (character insertion, deletion, formatting). Maximum 20 simultaneous editors per document. Offline editing is supported (changes made offline sync when connectivity is restored).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-time co-editing:</strong> All editors see each other's changes within 200ms. Character insertions, deletions, and formatting changes propagate to all connected clients.</li>
          <li><strong>Cursor and selection sharing:</strong> Each editor's text cursor and selection range is shown to other editors as a named, colored cursor/highlight.</li>
          <li><strong>Offline editing:</strong> Editors can continue editing without network connectivity. Changes made offline sync and merge correctly when connectivity is restored, without data loss.</li>
          <li><strong>Conflict-free merging:</strong> Concurrent edits from multiple clients merge without corruption or data loss. The merged result is intuitive and preserves all editors' intended changes.</li>
          <li><strong>Version history:</strong> The full history of document changes is preserved. Users can view past versions and restore a previous state.</li>
          <li><strong>Comments and suggestions:</strong> Inline comments anchored to text ranges. Suggested edits mode (tracked changes) for review workflows.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Convergence:</strong> All clients must converge to the same document state after all operations are applied, regardless of the order in which operations were received.</li>
          <li><strong>Typing latency:</strong> Local character insertion must be visible immediately (0ms—the editor does not wait for server acknowledgment before displaying the typed character).</li>
          <li><strong>Operation throughput:</strong> A 20-person editing session with all editors typing simultaneously must not degrade to more than 500ms end-to-end latency for any editor's changes.</li>
          <li><strong>Document size:</strong> Support documents up to 500,000 words without performance degradation. CRDT metadata overhead must not grow unboundedly with document history.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The collaborative editor uses a CRDT-based approach (specifically, a variant of the Yjs CRDT library's Y.Doc model) for conflict-free merging. Each character or inline node in the document is represented as an item with a globally unique identifier (a Lamport timestamp: &#123;clientId, sequenceNumber&#125;). Insertions create new items with IDs; deletions mark items as deleted (tombstones) rather than removing them. The unique IDs and tombstone approach ensure that concurrent insertions at the same position and concurrent deletions are resolved deterministically without a central server.</p>
        <p>The architecture: clients connect to a Document Server via WebSocket and exchange CRDT updates (binary-encoded Yjs updates). The Document Server broadcasts updates to all other connected clients and persists the cumulative CRDT state to the database. When a new client joins, the server sends the full current document state as a CRDT snapshot. Subsequent updates are applied incrementally. A server-side presence service separately handles cursor synchronization (cursor positions are not part of the CRDT document state; they are ephemeral and do not need to be persisted).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/collaborative-editor-architecture.svg"
          alt="Collaborative editor architecture showing CRDT (Yjs Y.Doc) data model (items with Lamport timestamp IDs, tombstone deletions, block structure), client (local CRDT replica, ProseMirror editor binding, offline operation queue), Document Server (CRDT update relay, awareness protocol for cursors, persistence to PostgreSQL), and version history snapshot pipeline."
          caption="Collaborative editor architecture: CRDT-based conflict-free merging, ProseMirror binding, Document Server relay, and cursor awareness protocol"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CRDT Document Model</h3>
        <p>The document is represented as a Y.Doc (Yjs document), which is an in-memory CRDT that supports arbitrary tree-structured data. The document structure is a Y.Array of blocks, where each block is a Y.Map containing: blockId, type (paragraph, heading1, bulletItem, etc.), and content (a Y.Text—a CRDT text type supporting concurrent character-level edits and inline formatting). Y.Text is the core of the collaborative editing experience: it uses a CRDT algorithm (based on LSEQ or FUGUE) that assigns each character a globally unique position identifier, allowing concurrent insertions at the same position to be resolved deterministically.</p>
        <p>Concurrent insertion resolution: if user A inserts "A" at position 5 and user B simultaneously inserts "B" at position 5, the CRDT must deterministically choose which character appears first. Yjs uses the client ID as a tiebreaker: the insertion from the client with the higher client ID (numerically) appears first. This is deterministic and globally consistent—all clients apply the same resolution rule and converge to the same result. The outcome may not always be "intuitive" (the user with the lower client ID sees their character pushed right), but it is consistent and predictable.</p>
        <p>Tombstone deletions: when a character is deleted, its CRDT item is marked as deleted (tombstone) rather than removed from the data structure. This is necessary because other clients may have already referenced the deleted character in their pending operations (e.g., an insertion immediately after the deleted character). If the character were removed, the reference would be invalid. Tombstones accumulate over the lifetime of a document; periodic compaction (garbage collecting tombstones that no client could still reference) is performed when all clients have acknowledged receiving the delete operations. Tombstone accumulation is a known limitation of operation-based CRDTs; very long documents with heavy editing history may accumulate significant tombstone overhead.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Editor Binding and Optimistic Local Updates</h3>
        <p>The editor UI is built on ProseMirror (a rich text editor framework) or Slate.js. The CRDT document is bound to the editor via a synchronization layer: changes in the editor (user types a character) are translated into CRDT operations (Y.Text.insert at the cursor position), and CRDT updates received from other clients are translated into ProseMirror transactions (editor state changes). The binding ensures bidirectional synchronization without infinite loops (the synchronization layer uses a flag to suppress re-triggering when applying remote updates).</p>
        <p>Local edits are applied optimistically: when the user types a character, the CRDT is updated immediately (showing the character in the editor), and the update is queued for WebSocket transmission. The local CRDT replica is the source of truth for the editor display. When the server broadcasts the update back (confirming receipt), the client de-duplicates it (ignores updates it has already applied, identified by the Lamport timestamp). This immediate local update is what gives the editor its native-text-editor feel—there is no perceptible latency between keypress and character display.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cursor and Awareness Synchronization</h3>
        <p>Cursor positions are not part of the persistent CRDT document state—they are ephemeral presence data. Yjs provides an "awareness" protocol for this: a lightweight pub/sub system where each client publishes its current cursor position, selection, username, and color, and receives the same from all other clients in the document. The awareness state is not persisted; it is lost when all clients disconnect. Awareness updates are sent via the same WebSocket connection as CRDT updates but are handled differently: they are broadcast immediately without ordering guarantees (cursor positions are eventually consistent and losing an occasional update is acceptable).</p>
        <p>Cursor positions in a collaborative editor are relative to the CRDT document structure (anchored to specific CRDT item IDs, not character offsets). A character offset (position 50) becomes invalid when other clients insert or delete characters before position 50. A CRDT-anchored cursor (positioned after item with ID &#123;clientId: 3, seq: 42&#125;) remains valid regardless of insertions or deletions elsewhere in the document. The editor binding translates between CRDT-anchored positions (used in the awareness protocol) and DOM text offsets (used by the ProseMirror cursor display).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Support and Sync on Reconnect</h3>
        <p>Offline editing is native to the CRDT model: the client's local Y.Doc replica continues to accept edits while offline. Each operation is assigned a Lamport timestamp using the client's local clock and client ID (no server dependency). The offline operations are queued locally (in IndexedDB) and applied to the local CRDT replica immediately. When the client reconnects, it sends all queued operations to the Document Server in a single CRDT update message. The server applies them to the authoritative state, which may already contain operations from other clients that occurred while this client was offline.</p>
        <p>CRDT merge on reconnect: the server's state and the client's state are both Yjs Y.Docs. Yjs's merge algorithm handles arbitrary concurrent operation sets: given two Y.Docs that diverged from a common ancestor and each have a set of applied operations, Yjs produces a merged Y.Doc that contains all operations from both, applied in a globally consistent order (using Lamport timestamps as tiebreakers). The server broadcasts the merged state to all connected clients, and the reconnecting client receives any operations it missed. The entire merge is deterministic and conflict-free—no human intervention is required regardless of how long the client was offline or how many other clients edited the document in the interim.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Document Persistence and Version History</h3>
        <p>The authoritative document state is persisted as a binary Yjs snapshot to the database (PostgreSQL BYTEA column or S3, depending on document size). On every 100 CRDT updates (or on a 5-minute timer), the Document Server serializes the current Y.Doc state to binary and writes it to the database. New clients joining the document load the latest snapshot plus any updates since the snapshot. This snapshot-plus-updates approach avoids replaying the entire operation history on every join (which would be slow for documents with millions of historical operations).</p>
        <p>Version history is implemented by storing snapshots at regular intervals (every 1000 operations or daily, whichever comes first). Each snapshot includes the Yjs binary state, a timestamp, and a description (auto-generated: "Edited by Alice, Bob (+3)"). Users can browse the version history timeline and restore any previous snapshot by loading the snapshot's binary state into a new Y.Doc and replacing the current document. Restoring creates a new version (append-only history; the restoration is recorded as a new snapshot with a "Restored from [date]" description), ensuring no history is lost.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/collaborative-editor-workflow.svg"
          alt="Collaborative editor data flow showing user keypress → ProseMirror transaction → CRDT Y.Text.insert (Lamport timestamp assigned) → local apply (immediate display) → WebSocket send to Document Server → server broadcast to all clients → remote client apply (de-duplicate by timestamp) → ProseMirror remote transaction. Offline path: operations queued in IndexedDB → reconnect → batch send → CRDT merge."
          caption="Editor data flow: optimistic local CRDT apply → WebSocket relay → remote apply with de-duplication, and offline queue with CRDT merge on reconnect"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>OT versus CRDT: Operational Transform (Google Docs) requires a central server to serialize all operations (assign a global ordering) and transform concurrent operations against each other. OT's correctness depends on the server's serialization; without the server, offline editing requires complex client-side state management to avoid divergence. CRDT (Yjs, Automerge) does not require central serialization: any two CRDT replicas can be merged without a server, making offline editing and peer-to-peer editing trivially correct. The trade-off: CRDTs have higher memory overhead (tombstones, metadata per item) and more complex implementation. For documents with millions of characters and decades of editing history, tombstone accumulation becomes a practical issue. Google Docs's OT approach avoids tombstone overhead but requires always-online or complex offline-OT implementations. For new systems, CRDTs are the preferred approach.</p>
        <p>Block-level versus character-level CRDT: applying CRDT at the character level (each character has a unique ID) provides maximum granularity for conflict resolution (concurrent edits to the same sentence merge correctly) but generates large CRDT states for long documents (500,000 characters × metadata overhead). Block-level CRDT (each paragraph is an atomic unit; concurrent edits within the same paragraph use last-write-wins) is coarser but produces smaller CRDT state. The hybrid approach (Notion's model) uses block-level CRDT for block creation, deletion, and reordering, and character-level CRDT for inline text within blocks. This limits character-level CRDT scope to individual paragraphs (typically hundreds of characters, not thousands), keeping CRDT state manageable per block.</p>
        <p>Tombstone garbage collection: Yjs implements garbage collection of tombstones when all clients have acknowledged receiving the delete operations. The garbage collection protocol is coordinated by the server: the server tracks the minimum state vector across all connected clients; tombstones older than the minimum state vector (meaning all clients have applied these deletions) are eligible for compaction. GC is performed periodically (not on every update) and requires all clients to temporarily pause applying new updates during the compaction computation. For very large documents, this pause can be perceptible; the alternative is to accept unbounded tombstone growth (acceptable for documents that are not heavily edited over many years).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A collaborative editor is built on a CRDT (Yjs Y.Doc) that assigns each character a unique Lamport timestamp ID and uses tombstone deletions to support conflict-free concurrent edits without a central operation serializer. The editor UI (ProseMirror) is bound to the CRDT via a bidirectional synchronization layer; local edits apply optimistically to the CRDT immediately, providing native typing latency. Remote updates are applied via CRDT merge (deterministic, based on Lamport timestamps) without additional conflict resolution logic. Cursor positions use the awareness protocol (ephemeral, anchored to CRDT item IDs, not character offsets). Offline editing is native to the CRDT model: offline operations are queued in IndexedDB, and on reconnect a single CRDT merge incorporates all offline changes and all server changes without coordination. Document state is persisted as binary Yjs snapshots every 100 operations for fast bootstrap. Version history stores periodic snapshots with metadata. The fundamental architectural choice—CRDT over OT—provides correct offline editing and simpler peer-to-peer architecture at the cost of tombstone metadata overhead and more complex garbage collection.</p>
      </section>
    </ArticleLayout>
  );
}
