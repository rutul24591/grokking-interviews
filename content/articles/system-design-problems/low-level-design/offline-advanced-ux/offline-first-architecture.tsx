"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-offline-first-architecture",
  title: "Design an Offline-First Architecture System",
  description:
    "Production-grade offline-first design with local-first data, automatic synchronization, conflict resolution, and seamless online/offline transitions.",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "offline-first-architecture",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "offline-first",
    "local-first",
    "synchronization",
    "conflict-resolution",
    "pwa",
  ],
  relatedTopics: [
    "service-workers-pwa",
    "data-synchronization-conflict-resolution",
    "undo-redo-system",
    "real-time-collaboration",
  ],
};

export default function OfflineFirstArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Traditional apps assume network always available. Users expect apps to work
          offline: take notes on plane, edit documents on train, browse cached content
          without signal. Offline-first architecture inverts assumption: app works
          offline by default, syncs to server when network available. Key challenges:
          local data may diverge from server (conflicts), syncing large datasets is
          expensive, and users may edit same data on multiple devices.
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Users may go offline for minutes to hours.</li>
          <HighlightBlock as="li" tier="important">App must remain functional offline (read, write local data).</HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Changes made offline sync to server when online. Server may have newer
            data (conflict).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">Multiple devices editing same data (need conflict resolution).</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Local Storage:</strong> Data persisted locally (IndexedDB, SQLite).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Offline Operations:</strong> Read, write, delete work offline.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Automatic Sync:</strong> When online, sync local changes to server.
          </HighlightBlock>
          <li>
            <strong>Conflict Detection:</strong> Detect when local and remote data
            diverged.
          </li>
          <li>
            <strong>Conflict Resolution:</strong> Merge or prompt user.
          </li>
          <li>
            <strong>Network Status:</strong> Detect online/offline transitions,
            notify user.
          </li>
          <li>
            <strong>Selective Sync:</strong> User can choose what to sync.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Performance:</strong> Local reads &lt;10ms (no network latency).
          </HighlightBlock>
          <li>
            <strong>Storage:</strong> Efficiently use device storage (compression, pruning).
          </li>
          <li>
            <strong>Battery:</strong> Sync doesn't drain battery (batch requests,
            backoff).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Consistency:</strong> Data eventually consistent across devices.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User edits document offline, server version updated—need merge.</li>
          <li>Sync starts, then network drops mid-sync—resume or rollback?</li>
          <li>
            Device storage full—can't persist new changes. Evict old data or warn user?
          </li>
          <li>
            User deletes document locally, server still has it—soft delete or hard
            remove?
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Store data locally in IndexedDB. On reads, query local store (fast, offline).
          On writes, update local store immediately (optimistic), queue change for sync.
          Monitor network status.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">When online, batch sync changes to server. Server
          returns latest data + conflicts (if any). Merge conflicts (3-way merge or
          user choice). Update local store with merged result. Notify user of sync
          status.</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/offline-first-architecture.svg"
          alt="Offline-first architecture layers from UI through local store, sync engine, and server API, with cache strategies and mutation queue sync protocol"
          caption="Offline-first architecture layers from UI through local store, sync engine, and server API, with cache strategies and mutation queue sync protocol"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Local Data Storage</h3>
        <p>Persist data on device.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>IndexedDB:</strong> Browser storage (5-50GB). Suitable for large
            datasets.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>localStorage:</strong> Smaller (5-10MB). Sufficient for metadata,
            settings.
          </HighlightBlock>
          <li>
            <strong>SQLite (mobile):</strong> Native database on iOS/Android. More
            efficient.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Schema:</strong> Mirror server schema locally. Include version,
            timestamp, sync state.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Change Tracking</h3>
        <p>Track which data changed for sync.</p>
        <ul className="space-y-2">
          <li>
            <strong>Dirty Flags:</strong> Mark records modified since last sync
            (dirty=true).
          </li>
          <li>
            <strong>Change Log:</strong> Log each change: timestamp, user, operation
            (create/update/delete).
          </li>
          <li>
            <strong>Tombstones:</strong> Soft delete: mark deleted records as tombstone
            (deleted_at timestamp).
          </li>
          <li>
            <strong>Sync Queue:</strong> Queue of pending changes waiting to sync.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Synchronization Strategy</h3>
        <p>Sync local changes to server.</p>
        <ul className="space-y-2">
          <li>
            <strong>Trigger:</strong> On network online, periodically (every 5min), or
            on-demand.
          </li>
          <li>
            <strong>Batch:</strong> Send all queued changes in single request
            (efficient).
          </li>
          <li>
            <strong>Server Response:</strong> Server returns applied changes + conflicts.
          </li>
          <li>
            <strong>Update Local:</strong> Apply server changes to local store.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Retry:</strong> If sync fails, retry with exponential backoff.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Detection & Resolution</h3>
        <p>Handle diverged data across devices.</p>
        <ul className="space-y-2">
          <li>
            <strong>Version Numbers:</strong> Each record has version (incremented per
            change).
          </li>
          <li>
            <strong>Detection:</strong> Server detects: local version &lt; server version
            = conflict.
          </li>
          <li>
            <strong>Three-Way Merge:</strong> Merge base (last common state), local
            changes, server changes.
          </li>
          <li>
            <strong>Last-Write-Wins:</strong> Simple: server version always wins
            (lossy).
          </li>
          <li>
            <strong>User Choice:</strong> Prompt user: keep local, accept server, or
            merge.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Status Detection</h3>
        <p>Detect online/offline transitions.</p>
        <ul className="space-y-2">
          <li>
            <strong>Navigator API:</strong> navigator.onLine (boolean, may be unreliable).
          </li>
          <li>
            <strong>Test Request:</strong> Ping server (heartbeat) to confirm online.
          </li>
          <li>
            <strong>Events:</strong> Listen to online/offline events on window.
          </li>
          <li>
            <strong>UI Feedback:</strong> Display "offline" banner when disconnected.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Storage Management</h3>
        <p>Manage limited device storage.</p>
        <ul className="space-y-2">
          <li>
            <strong>Quota:</strong> Request persistent storage (browser may grant
            exceptions to quota limits).
          </li>
          <li>
            <strong>Compression:</strong> Compress old data (JSON → gzip) to save space.
          </li>
          <li>
            <strong>Pruning:</strong> Delete old synced records (keep last 30 days).
          </li>
          <li>
            <strong>User Control:</strong> Allow user to clear cache, download data
            locally.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sync Status & Queuing</h3>
        <p>Track sync state.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Sync Queue:</strong> List of changes pending sync (id, operation,
            timestamp, retry_count).
          </HighlightBlock>
          <li>
            <strong>Status:</strong> Each change: pending, syncing, synced, failed.
          </li>
          <li>
            <strong>Metadata:</strong> When synced successfully, update metadata
            (synced_at, synced_version).
          </li>
          <li>
            <strong>Cleanup:</strong> After successful sync, remove from queue.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track offline-first system health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Sync Success Rate:</strong> % of syncs successful vs failed.
          </li>
          <li>
            <strong>Queue Depth:</strong> Number of pending changes (high = sync lagging).
          </li>
          <li>
            <strong>Conflict Rate:</strong> % of syncs with conflicts.
          </li>
          <li>
            <strong>Storage Usage:</strong> Local storage used (% of quota).
          </li>
          <li>
            <strong>Offline Duration:</strong> How long users are offline (distribution).
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">IndexedDB Complexity</h3>
        <HighlightBlock as="p" tier="crucial">
          IndexedDB powerful but complex API. Use libraries (Dexie, PouchDB) for
          convenience.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Data Sync Protocol</h3>
        <HighlightBlock as="p" tier="important">
          Design efficient sync: send only deltas (changed records), not full dataset.
          Use checksums for validation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Offline</h3>
        <HighlightBlock as="p" tier="important">
          Use DevTools to simulate offline. Test: create/edit offline, go online, verify
          sync. Test conflicts: edit same document on two devices offline, sync both.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operational Transformation & CRDT</h3>
        <p>
          For real-time collaboration offline, use CRDT (Yjs, Automerge) for automatic
          conflict-free merging. More complex than three-way merge but handles concurrent
          edits naturally.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Sync Strategy</h3>
        <HighlightBlock as="p" tier="important">
          Adjust sync based on network: Wi-Fi → sync aggressively (large payloads).
          Mobile 4G → sync less frequently (save bandwidth). Offline → queue locally.
          Detect connection type via navigator API.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Delta Compression</h3>
        <p>
          Send only changed fields (not full records) to reduce bandwidth. Diff-based
          sync: calculate delta between local and server, send delta only.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Device Sync</h3>
        <HighlightBlock as="p" tier="important">
          User edits document on phone offline, then opens on desktop. Desktop should
          see pending changes from phone. Implement: sync status per device, merge
          strategies account for multiple devices, cloud state authoritative.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Offline at Scale</h3>
        <HighlightBlock as="p" tier="important">
          Load test: 1000 devices syncing simultaneously. Verify server handles load,
          conflicts resolved correctly, no data loss. Chaos test: network failures,
          partial syncs, device crashes.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: user edits offline, goes online, forgets to sync. Changes lost. Solution:
          auto-sync on online, notify user. Another: storage quota exceeded, changes
          dropped silently. Solution: warn before storage full, prompt to clear. Another:
          conflicts resolved incorrectly, user data lost. Solution: comprehensive testing,
          audit logs.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response & Debugging</h3>
        <HighlightBlock as="p" tier="crucial">
          Sync stuck: check queue depth, retry logic, server status. Conflicts not
          resolved: check merge logic, version tracking. Data loss: audit logs show
          what happened (conflict resolution, user deletion, sync failure).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity vs Features</h3>
        <HighlightBlock as="p" tier="important">
          Offline-first adds complexity (sync, conflict resolution, storage management).
          Only worthwhile if users frequently offline.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Consistency vs Availability</h3>
        <HighlightBlock as="p" tier="crucial">
          Offline-first favors availability (works offline) over consistency (conflicts).
          Users may work with stale data. Accept eventual consistency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Storage Usage</h3>
        <HighlightBlock as="p" tier="important">
          Keeping full data locally uses storage. Trade: more storage for faster reads
          and offline support.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">At scale, sync server must handle millions of concurrent sync requests. Testing must cover offline scenarios, conflicts, partial syncs,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">network failures. Monitoring sync success rate, queue depth, conflict rate detects issues. Real-world systems use CRDT (Yjs) for collaboration, IndexedDB (Dexie) for storage, adaptive sync for efficiency. Integration with service workers, state management, and error handling critical.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}