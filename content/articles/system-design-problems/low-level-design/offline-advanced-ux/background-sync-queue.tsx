"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-background-sync-queue",
  title: "Background Sync Queue System",
  description: "Application-level queueing and coordination of operations for syncing when network connectivity restores",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "background-sync-queue",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "offline", "queue", "sync", "offline-first"],
  relatedTopics: ["background-sync", "offline-first-architecture"],
};

export default function BackgroundSyncQueueArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A note-taking app allows offline editing. User creates 5 notes while offline. When they come online, all 5 notes must sync to the server. Without queueing: the app might attempt to sync all 5 simultaneously, overwhelming the server or experiencing partial failures where some succeed and others fail. With queueing: operations sync in order, with visibility into progress, allowing the app to coordinate dependencies (note A must sync before comment on note A).</HighlightBlock>
        <HighlightBlock as="p" tier="important">More complex scenario: user creates note, comments on it, deletes a comment, edits the note. Operations have dependencies: the note must sync before the comment, and if the comment is deleted, the comment-add and comment-delete operations can be coalesced or reordered. Without queuing, you get duplicate comments or out-of-order operations corrupting the note.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Background sync queue is application-level queueing and coordination. It's distinct from the Service Worker Background Sync API (which retries failed requests). The queue manages multiple interdependent operations, coordinates their order, groups them if possible, and provides UI feedback on sync status.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Operations are stored in local storage/IndexedDB. Operations can be retried or coalesced. Server supports idempotency (same operation applied twice = same result). Network connectivity can be detected. Operations have dependencies or ordering requirements.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Queue management:</strong> Add operations to queue, persist, process in order on reconnect.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Dependency tracking:</strong> Specify operation dependencies; don't process dependent operations before dependencies complete.</HighlightBlock>
          <li><strong>Coalescing:</strong> Combine redundant operations (two edits to same field → single operation).</li>
          <HighlightBlock as="li" tier="important"><strong>Retry logic:</strong> Automatically retry failed operations with backoff.</HighlightBlock>
          <li><strong>Partial sync:</strong> If one operation fails, continue syncing others (don't block).</li>
          <li><strong>Conflict resolution:</strong> Handle conflicts (server version diverges from queued operation); user chooses resolution.</li>
          <li><strong>Sync status:</strong> Display queue depth, which operations are syncing, which have failed.</li>
          <li><strong>Manual trigger:</strong> Allow users to manually trigger sync (don't wait for auto-detection of network recovery).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Latency:</strong> Sync starts within 5 seconds of network restoration. Operations process at 1 per 100-500ms depending on server latency.</HighlightBlock>
          <li><strong>Persistence:</strong> Queue survives app restart; all operations retained until successful or explicitly deleted.</li>
          <HighlightBlock as="li" tier="important"><strong>Memory:</strong> Queue in IndexedDB (efficient); in-memory working set under about 10 MB.</HighlightBlock>
          <li><strong>Throughput:</strong> Process 100+ queued operations efficiently without blocking main thread.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">When a user action occurs offline, instead of immediately updating local state and hoping to sync later, the app enqueues an operation describing the action. The operation includes: action type (create, update, delete), resource ID, payload, and optional dependencies.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The queue stores operations in IndexedDB, persisting across app restarts. The app processes the queue: when online, dequeue operation, execute on server, mark as synced. If server rejects (conflict, validation error), handle gracefully (move to failed, notify user). If server accepts, remove from queue.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Dependencies ensure ordering: if "create note" and "add comment to note" are queued, the create must complete first. The queue respects this: blocks dependent operations until their dependencies sync.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Coalescing optimizes: if the same operation is queued twice in quick succession, or if operations cancel each other (add then delete), the queue combines them into a single server call.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/background-sync-queue.svg"
          alt="Background sync queue architecture showing offline write enqueue, persisted IndexedDB queue, Background Sync API, retry logic, and sync status UI"
          caption="Background sync queue architecture showing offline write enqueue, persisted IndexedDB queue, Background Sync API, retry logic, and sync status UI"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Queue Data Structure</h3>
        <HighlightBlock as="p" tier="important">Each operation in the queue is a record: unique ID, action type, resource ID, payload, dependencies (array of operation IDs that must complete first), status (pending, syncing, synced, failed, conflict), retry count, last retry timestamp, created timestamp.</HighlightBlock>
        <p>Indexing: index by status to quickly find pending operations. Index by resource ID to find all operations on a resource (for coalescing). Index by dependencies to track dependent operations.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operation Processing Loop</h3>
        <HighlightBlock as="p" tier="crucial">Main loop: query IndexedDB for pending operations without unmet dependencies. For each, mark status as syncing. POST the operation to the server. On success (2xx), mark as synced, remove from queue. On retriable error (5xx, network timeout), mark as failed, increment retry count, schedule retry. On non-retriable error (4xx, validation), move to failed, notify user.</HighlightBlock>
        <p>Dependency resolution: before processing an operation, check its dependencies. If any depend operation has status != synced, delay processing. This prevents child operations from executing before parent completes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Coalescing and Optimization</h3>
        <p>Naive: queue "edit title to X", "edit title to Y", "edit title to Z" as 3 operations. Result: server processes 3 updates. Better: coalesce into single "edit title to Z". Before enqueuing, check if pending operation exists for same resource + action. If yes and they can merge (e.g., two edits to same field), merge payloads or replace old operation.</p>
        <p>Cancellation: if user queues "add comment" then immediately "delete comment" (before sync), the two operations can be removed from queue entirely (no net change). Detect this: if delete's dependency is the add operation, cancel both.</p>
        <HighlightBlock as="p" tier="important"><strong>Coalescing Strategies and Tradeoffs:</strong> Three approaches: (1) Last-write-wins: replace old operation with new. Example: title edited 5 times → only last edit sent to server. Saves bandwidth but loses intermediate edits (acceptable for simple fields). (2) Merge-safe operations: if operations are commutative (order doesn't matter), combine them. Example: "add tag A" then "add tag B" → single "add tags [A, B]". Requires operation semantics understanding. (3) Semantic coalescing: for field edits, send final state. Example: title "Hello" → "Hi" → "Greetings" → send single "set title to Greetings". Implementation: before enqueueing a new operation, scan pending queue: if same resource and compatible action type exists, update or replace it. Mark old operation as superseded.</HighlightBlock>
        <p><strong>Cancellation and Rollback Logic:</strong> User can manually cancel a queued operation (before it syncs). Two cases: (1) Operation is pending (not yet synced): simply remove from queue. No server call needed. (2) Operation is syncing or already synced: more complex. If already synced, the user's action is already on the server; the cancel operation is actually a "undo" request (send inverse operation to server). Example: user queues "delete note", then cancels. If not yet synced, remove from queue. If already synced, send "restore note". For edit operations, cancelling a synced edit requires explicit undo operation. Alternatively, offer client-side only: undo in the local app, but don't change server state (user reconciles on next sync).</p>
        <p><strong>Dependency Cycles and DAG Validation:</strong> Dependencies must form a DAG (directed acyclic graph), not a cycle. If operation A depends on B, and B depends on C, then A → B → C (valid). But if C also depends on A, you have a cycle (invalid, system can never resolve). When adding operation with dependencies, validate: walk the dependency chain; if we revisit a node, cycle detected, reject the operation with error message: "Cannot queue operation with circular dependencies". This prevents deadlocks in queue processing.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Resolution</h3>
        <p>Conflict: user edits note offline, server copy was also edited. When sync happens, versions diverge. Three strategies: (1) last-write-wins (server overwrites, offline changes lost), (2) client-wins (ignore server state, force client version), (3) merge (attempt to merge edits).</p>
        <p>CRDTs (Conflict-free Replicated Data Types) handle merge automatically: operations are commutative (order doesn't matter), so server and client can apply edits in any order and reach same state. Requires structured data (not free-form text).</p>
        <p>For most apps, three-way merge or custom merge logic: server state, offline changes, common ancestor (state when user went offline). Merge tool (diff3) detects conflicts, user chooses resolution.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Detection and Sync Triggering</h3>
        <p>Online/offline events trigger sync check: when online event fires, check if queue has pending operations. If yes, start processing. Also provide manual "sync now" button for user control.</p>
        <HighlightBlock as="p" tier="important">Exponential backoff for retries: first retry immediately, then 1s, 2s, 4s, 8s, capping at 30s. After 5-10 retries with no success, move operation to permanent failed state (user manual intervention required).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI Status and Progress</h3>
        <p>Display sync status: "Syncing (3/10 operations)" shows progress. "2 pending, 1 failed" shows breakdown. Detailed view shows each operation: status, retry count, error message (if failed). Allow user to retry failed operations or discard them.</p>
        <p>Per-resource status: in the note list, mark each note with sync status (✓ synced, ⟳ syncing, ⚠ failed). User sees at a glance which items have synced and which are pending.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance and Cleanup</h3>
        <HighlightBlock as="p" tier="important">Memory: queue operations are stored in IndexedDB (disk), not memory. Working set (in-memory) contains only actively processing operations (typically under about 10 MB). After an operation syncs and is marked completed, remove it from IndexedDB after N hours (archive old synced operations to keep the database lean).</HighlightBlock>
        <p>Throughput: process operations serially (one at a time) to maintain order and avoid overwhelming the server. If independent operations exist (no dependencies), could parallelize (e.g., 3 operations on different resources), but simpler to serialize.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Strict ordering vs throughput: serial processing respects all dependencies but is slower. Parallel processing (independent operations in parallel) is faster but more complex. For most apps, serial is fine (a few hundred ms delay is acceptable).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client-side merging vs server-side: client attempts merge/conflict resolution locally (UX: no server round-trip needed). Server attempts merge (UX: more likely to succeed, but slower). Hybrid: client optimistic merge, server verifies (if divergence detected, server re-syncs).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Permanent failure handling: after max retries, operation is stuck. User must manually delete (discard changes) or resolve conflict. Alternative: auto-resolve (pick client or server version), but risks data loss.</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Simple FIFO Queue</h3>
        <HighlightBlock as="p" tier="crucial">Enqueue operations as they occur. Process in FIFO order on sync. No coalescing, no dependencies. Works for simple apps without complex relationships.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Dependency Graph with Coalescing</h3>
        <HighlightBlock as="p" tier="important">Track operation dependencies. Coalesce redundant operations. Process respecting dependencies. Works for complex offline scenarios with related edits.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: CRDT-Based Sync</h3>
        <HighlightBlock as="p" tier="important">Use CRDT data structure for operations (e.g., Yjs, Automerge). Operations are commutative; no strict ordering required. Merge naturally. Most robust for collaborative editing.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Real-world systems (Notion, Obsidian, Figma) use queue-based sync with CRDTs for robust handling of offline edits. For best results,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">implement dependency tracking and coalescing to minimize server load, use exponential backoff for retries (max 30s, up to 10 retries), provide clear UI status, and test thoroughly with simulated offline scenarios. CRDT-based approach is most robust for collaborative documents.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
