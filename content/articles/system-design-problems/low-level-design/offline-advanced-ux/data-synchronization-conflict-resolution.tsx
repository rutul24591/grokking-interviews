"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-data-synchronization-conflict-resolution",
  title: "Design Data Synchronization & Conflict Resolution",
  description:
    "Production-grade sync system with multi-device consistency, conflict detection, three-way merge, CRDT-based merging, and event sourcing patterns.",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "data-synchronization-conflict-resolution",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "synchronization",
    "conflict-resolution",
    "consistency",
    "crdt",
    "event-sourcing",
  ],
  relatedTopics: [
    "offline-first-architecture",
    "real-time-collaboration",
    "undo-redo-system",
    "distributed-consensus",
  ],
};

export default function DataSynchronizationConflictResolutionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Users work offline on multiple devices simultaneously. Data diverges
          when local changes conflict with server or other device changes. Key
          challenges: detecting conflicts (version, timestamp, content),
          resolving conflicts (merge strategies), ensuring consistency across
          devices, and handling partial syncs (device crashes mid-sync). Naive
          approaches lose data (last-write-wins) or require manual resolution
          (merge prompts).
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Multiple devices editing same record offline.</HighlightBlock>
          <HighlightBlock as="li" tier="important">Users expect automatic conflict resolution (no prompts).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Data integrity essential (no silent data loss).</HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Sync may fail mid-operation (network drop, device crash).
          </HighlightBlock>
          <li>
            Server is source of truth (conflicts resolved toward server version).
          </li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Sync Operation:</strong> Send local changes, receive server
            changes.
          </HighlightBlock>
          <li>
            <strong>Conflict Detection:</strong> Identify when versions diverged.
          </li>
          <li>
            <strong>Conflict Resolution:</strong> Merge changes automatically.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Consistency:</strong> All devices converge to same state.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Idempotency:</strong> Resync same changes doesn't duplicate.
          </HighlightBlock>
          <li>
            <strong>Partial Sync Recovery:</strong> Resume interrupted syncs.
          </li>
          <li>
            <strong>Merge Strategies:</strong> Support multiple conflict
            resolutions.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Sync &lt;1s for typical changes.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Consistency:</strong> Strong consistency on server,
            eventual consistency across devices.
          </HighlightBlock>
          <li>
            <strong>Bandwidth:</strong> Send deltas, not full records (minimize
            payload).
          </li>
          <li>
            <strong>Storage:</strong> Track change history efficiently
            (reasonable device storage).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            User edits document A and B offline, syncs A but fails on B—handle
            partial sync.
          </HighlightBlock>
          <li>
            Same field edited on two devices with different values—merge or
            resolve?
          </li>
          <li>
            Device A deletes record, Device B modifies same record—cascade
            delete?
          </li>
          <li>
            Sync in progress, device loses connectivity—rollback local changes
            or persist?
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Track data version (vector clock or timestamp). On sync, compare
          local version to server version. If versions match, no conflict
          (apply server changes). If versions differ, conflict detected
          (perform three-way merge: merge base, local changes, server changes).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Apply merged result locally. For collaborative editing, use CRDT
          (conflict-free replicated data type) for automatic merging without
          central coordination. Persist change history for audit and recovery.</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/data-synchronization-conflict-resolution.svg"
          alt="Data sync 3-way merge flow showing base, client, and server versions merging, plus conflict resolution strategies: LWW, CRDT, user-prompted, and OT"
          caption="Data sync 3-way merge flow showing base, client, and server versions merging, plus conflict resolution strategies: LWW, CRDT, user-prompted, and OT"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Tracking Schemes</h3>
        <p>Identify which version of data is current.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Timestamp:</strong> Last-modified timestamp. Simple but
            unreliable (clock skew).
          </HighlightBlock>
          <li>
            <strong>Version Number:</strong> Incremental counter per record.
            Detects sequence changes but not concurrent edits.
          </li>
          <li>
            <strong>Vector Clock:</strong> {'{'}device_1: 5, device_2: 3{'}'},
            tracks causal history. Detects concurrent edits precisely.
          </li>
          <li>
            <strong>Hash-Based:</strong> Content hash (SHA-256). Detects any
            content change but not order of changes.
          </li>
          <li>
            <strong>Lamport Timestamp:</strong> Hybrid of timestamp + counter.
            Simpler than vector clock.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Detection</h3>
        <p>Identify when data diverged.</p>
        <ul className="space-y-2">
          <li>
            <strong>Version Mismatch:</strong> Local version &lt; server version
            = conflict.
          </li>
          <li>
            <strong>Base Version Check:</strong> Compare local base version
            (merge point) to server version.
          </li>
          <li>
            <strong>Content Hash Diff:</strong> Hash local and server content.
            Different hashes = conflict.
          </li>
          <li>
            <strong>Timestamp Divergence:</strong> Server modified_at newer than
            local last_sync_at = conflict.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Three-Way Merge Algorithm</h3>
        <p>Merge diverged versions automatically.</p>
        <ul className="space-y-2">
          <li>
            <strong>Base Version:</strong> Last common state (version both
            devices knew).
          </li>
          <li>
            <strong>Local Changes:</strong> Diff: base → local.
          </li>
          <li>
            <strong>Server Changes:</strong> Diff: base → server.
          </li>
          <li>
            <strong>Apply:</strong> If edits don't overlap, apply both. If
            overlap, use merge strategy (server wins, local wins, or prompt).
          </li>
          <li>
            <strong>Result:</strong> Merged version incorporates non-conflicting
            changes from both sides.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Resolution Strategies</h3>
        <p>Different approaches for different content types.</p>
        <ul className="space-y-2">
          <li>
            <strong>Server Wins:</strong> Discard local changes, accept server.
            Simple but lossy.
          </li>
          <li>
            <strong>Local Wins:</strong> Discard server changes, accept local.
            Risk data loss if server has newer info.
          </li>
          <li>
            <strong>Three-Way Merge:</strong> Merge non-conflicting changes.
            Requires clean diffs.
          </li>
          <li>
            <strong>Field-Level Merge:</strong> Merge at field level. Modified
            fields: server wins. Unmodified fields: local wins.
          </li>
          <li>
            <strong>CRDT Merge:</strong> Automatic, no conflicts. Both versions
            correct simultaneously (for collaborative content).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CRDT (Conflict-Free Replicated Data Type)</h3>
        <p>Data structure that merges automatically.</p>
        <ul className="space-y-2">
          <li>
            <strong>Concept:</strong> CRDT ensures any two replicas merged
            result in same final state (without coordination).
          </li>
          <li>
            <strong>Examples:</strong> Last-Write-Wins Register, Counter
            (increment/decrement), Set (add/remove operations).
          </li>
          <li>
            <strong>Libraries:</strong> Yjs (for text/rich-text), Automerge
            (JSON-like data).
          </li>
          <li>
            <strong>Ops-Based:</strong> Track operations (insert, delete,
            update) not values. Merge ops commutatively.
          </li>
          <li>
            <strong>Convergence:</strong> All replicas executing same ops in
            same order converge.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sync Protocol & Ordering</h3>
        <p>Ensure reliable sync with ordering guarantees.</p>
        <ul className="space-y-2">
          <li>
            <strong>Change Log:</strong> Ordered list of changes (timestamp,
            user, operation).
          </li>
          <li>
            <strong>Monotonic Sequencing:</strong> Each sync increments version
            (v1, v2, v3). Server enforces order.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Idempotent Operations:</strong> Replaying same sync twice
            results in same final state.
          </HighlightBlock>
          <li>
            <strong>Tombstones for Deletes:</strong> Mark deleted records with
            tombstone (deleted_at, deleted_by). Prevents reappearance.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Sourcing Pattern</h3>
        <p>Store immutable events, derive state from events.</p>
        <ul className="space-y-2">
          <li>
            <strong>Event Stream:</strong> Log of all changes (append-only).
            Document {'{'}event_id, timestamp, user_id, operation, before, after{'}'}.
          </li>
          <li>
            <strong>Replay:</strong> Reconstruct any past state by replaying
            events (useful for debugging, auditing).
          </li>
          <li>
            <strong>Conflict Detection:</strong> Events ordered by timestamp
            (or Lamport clock). Replay order determines merge result.
          </li>
          <li>
            <strong>Immutable History:</strong> Never modify events (only
            append new corrections as new events).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Partial Sync Recovery</h3>
        <p>Resume interrupted syncs.</p>
        <ul className="space-y-2">
          <li>
            <strong>Sync Checkpoint:</strong> Mark which changes synced
            successfully (synced_version).
          </li>
          <li>
            <strong>Resume Logic:</strong> On reconnect, sync from last
            synced_version onward.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Deduplication:</strong> Server tracks synced changes by ID.
            Resend same ID = idempotent (no duplicate).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Rollback on Failure:</strong> If sync fails mid-transaction,
            rollback entire batch (atomic).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Merge Conflict UI</h3>
        <p>Surface conflicts to users (when needed).</p>
        <ul className="space-y-2">
          <li>
            <strong>Auto-Resolution:</strong> Most conflicts auto-merged
            (server-wins or field-merge).
          </li>
          <li>
            <strong>Conflict Notification:</strong> For unresolvable conflicts,
            notify user.
          </li>
          <li>
            <strong>Merge UI:</strong> Show base, local, server versions.
            User selects which to keep.
          </li>
          <li>
            <strong>Undo Merge:</strong> User can undo automatic merge, try
            different strategy.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track sync and conflict health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Conflict Rate:</strong> % of syncs with conflicts (high %
            = merge strategy may be wrong).
          </li>
          <li>
            <strong>Resolution Strategy Distribution:</strong> % auto-resolved
            vs manual vs user-prompted.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Sync Latency:</strong> Time from local change to server
            applied (includes conflict resolution).
          </HighlightBlock>
          <li>
            <strong>Data Loss:</strong> Compare checksums before/after merge
            (detect if merge lost data).
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Diff Algorithms</h3>
        <HighlightBlock as="p" tier="important">
          Implement efficient diff for three-way merge. Use Myers diff (edit
          distance) for text. For structured data (JSON), use recursive diff.
          Libraries: diff-match-patch, just-compare.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Clock Synchronization</h3>
        <HighlightBlock as="p" tier="important">
          Vector clocks require tracking per device/user. Overkill for simple
          cases. Lamport timestamps simpler (single monotonic counter). Hybrid:
          timestamp + device_id for tiebreaker.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Conflict Resolution</h3>
        <HighlightBlock as="p" tier="crucial">
          Simulate concurrent edits: edit record on device A, edit same record
          on device B, sync both. Verify merge result correct. Test edge cases:
          delete + modify, nested object changes, array reordering.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CRDT Implementation (Yjs/Automerge)</h3>
        <HighlightBlock as="p" tier="important">
          For collaborative editing (Google Docs-like), use CRDT library. Yjs
          optimized for text. Automerge for JSON. Both handle conflicts
          automatically: no merge prompts, no data loss. Trade: increased memory
          (track operations, not just state).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Vector Clock Optimizations</h3>
        <HighlightBlock as="p" tier="important">
          Full vector clocks {'{'}d1:5, d2:3, d3:7{'}'} expensive for many
          devices. Use interval tree clocks (compact representation) or hybrid
          (timestamp + device counter).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incremental Sync Protocol</h3>
        <p>
          Don't sync full record, only changed fields. Delta compression:
          {'{'}title: {'{'}old: "A", new: "B"{'}'}{'}'}.  Reduces bandwidth for large
          documents.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Metadata Versioning</h3>
        <p>
          Track version metadata per field: {'{'}title: {'{'}v: 5, last_modified_by:
          user_id{'}'}{'}'}.  Enables field-level conflict resolution (which device
          modified this field?).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="important">
          Load test: 1000 devices syncing simultaneously, simulate 10% conflict
          rate. Verify merge algorithms performant, no data loss. Chaos test:
          network partitions (two devices isolated, later merge), concurrent
          deletes.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="crucial">
          Common: naive merge loses edits (last-write-wins too aggressive).
          Solution: three-way merge preserves non-conflicting changes. Another:
          tombstones never deleted, database grows unbounded. Solution:
          background cleanup (hard delete after 30 days). Another: sync version
          number mismatch causes reapplication of old changes. Solution: include
          change ID in idempotency check.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <HighlightBlock as="p" tier="important">
          Data inconsistency across devices: audit event log (see divergence
          point). Replay events in correct order to reconstruct ground truth.
          Broadcast corrected state to all devices. Conflict resolution bug:
          test suite should catch (automated conflict testing).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Simplicity vs Sophistication</h3>
        <HighlightBlock as="p" tier="important">
          Last-write-wins simple but loses data. Three-way merge better but
          more complex. CRDT best for collaboration but heavyweight. Choose
          based on use case.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Consistency vs Autonomy</h3>
        <HighlightBlock as="p" tier="crucial">
          Offline-first favors availability (devices autonomous). Trade:
          eventual consistency (devices may diverge temporarily). Accept
          convergence delay.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Storage Overhead</h3>
        <HighlightBlock as="p" tier="important">
          Event sourcing provides auditability but uses 2-3x storage (store
          both events and derived state). Compress old events or archive.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">At scale, distributed sync server must handle millions of concurrent syncs with sub-second latency. Testing must cover conflict scenarios, partial syncs,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">and recovery. Monitoring conflict rates detects merge strategy issues early. Real-world systems use Yjs/Automerge for collaborative editing, three-way merge for document sync, and event sourcing for audit trails. Integration with offline-first architecture, undo/redo systems, and real-time collaboration essential.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
