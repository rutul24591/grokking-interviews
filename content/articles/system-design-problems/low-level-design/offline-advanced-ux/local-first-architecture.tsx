"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-local-first-architecture",
  title: "Local-First Architecture",
  description:
    "Building apps where local storage is primary source of truth with eventual server sync",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "local-first-architecture",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "local-first", "architecture", "offline", "sync"],
  relatedTopics: ["offline-first-architecture", "background-sync-queue"],
};

export default function LocalFirstArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Traditional web apps are server-centric: data lives on server. Client
          fetches data on load, sends mutations to server, waits for
          confirmation. Offline = app is dead. Slow network = app feels
          unresponsive.
        </p>
        <p>
          Local-first flips the model: data lives locally (IndexedDB/SQLite).
          User interacts with local data instantly. App syncs to server
          asynchronously and continuously. Offline = app continues working
          normally. Sync happens when online. Slow network = no lag; sync
          happens in background.
        </p>
        <p>
          Example: note-taking app (Obsidian, Notion offline mode). User creates
          note offline. The note appears instantly in the list (local update).
          When online, the note syncs to server. Meanwhile, user can edit,
          delete, reorganize locally. No waiting, no network dependency.
        </p>
        <p>
          Key shifts: (1) immediate feedback on all actions (no server
          round-trip), (2) offline-first (works without network), (3) eventual
          consistency (server and client converge asynchronously), (4)
          collaborative by design (multiple devices sync to server).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> IndexedDB or local database
          available. Server supports pull-based sync (client queries for
          updates, not server-pushed). User devices may go offline/online
          unpredictably. Multi-device sync is expected. Eventual consistency
          acceptable (temporary divergence between devices is OK).
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Local data operations:</strong> All CRUD operations work on
            local data immediately without server.
          </li>
          <li>
            <strong>Background sync:</strong> Periodically (or on network
            detection) sync local data to server.
          </li>
          <li>
            <strong>Incremental sync:</strong> Only sync changed data (deltas),
            not full dataset.
          </li>
          <li>
            <strong>Multi-device sync:</strong> Changes from other devices
            eventually appear on this device.
          </li>
          <li>
            <strong>Conflict resolution:</strong> When device conflicts with
            server/other devices, resolve automatically or manually.
          </li>
          <li>
            <strong>Data versioning:</strong> Track version numbers to detect
            conflicts and ensure causality.
          </li>
          <li>
            <strong>Offline indicator:</strong> Show user sync status, pending
            changes, any conflicts.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Non-Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Latency:</strong> User actions apply instantly (often under
            about 1 ms, local only). Sync updates available within 5-30 seconds
            of network restore.
          </li>
          <li>
            <strong>Consistency:</strong> Eventually consistent across devices;
            divergence resolved within minutes.
          </li>
          <li>
            <strong>Storage:</strong> Local database scales to 100MB+ on modern
            devices.
          </li>
          <li>
            <strong>Bandwidth:</strong> Sync is efficient (delta sync,
            compression). Works on slow/metered networks.
          </li>
          <li>
            <strong>Battery:</strong> Doesn't drain battery with constant
            syncing; intelligent batching and exponential backoff.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Local-first architecture consists of: (1) local storage
          (IndexedDB/SQLite) as the authoritative data store, (2) local queries
          and mutations that update local storage synchronously, (3) a
          background sync process that periodically uploads local changes and
          downloads remote updates, (4) conflict resolution when local and
          remote diverge.
        </p>
        <p>
          Data flow: user action → update local storage → return immediately →
          (async) sync to server → merge server updates into local store. The
          user perceives instant feedback; sync is invisible.
        </p>
        <p>
          Sync algorithm: track version numbers (logical clocks, timestamps).
          Client sends all changes since last sync (with versions). Server
          merges them, detects conflicts, sends back resolved version and
          server-side changes. Client merges server updates.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/local-first-architecture.svg"
          alt="Local-first architecture core principles, CRDT data types for common use cases, sync protocol options, and storage stack with IndexedDB and SQLite WASM"
          caption="Local-first architecture core principles, CRDT data types for common use cases, sync protocol options, and storage stack with IndexedDB and SQLite WASM"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Local Storage Design
        </h3>
        <p>
          Use IndexedDB for web or SQLite for mobile. Schema includes: data
          (notes, posts, etc.) and sync metadata (version number per record,
          sync state, conflicts). Example schema for notes: id, title, content,
          lastModified (local timestamp), version (logical version), syncState
          (local, syncing, synced, conflict).
        </p>
        <p>
          Versioning: use logical timestamps (Lamport clocks) or hybrid
          timestamps (server-side version + local sequence). Version uniquely
          identifies a state; if two devices have the same version for a record,
          they're in sync.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Background Sync Process
        </h3>
        <p>
          Periodically (every 5-30 seconds) or on network detection, the app
          queries local database for unsync'd records (syncState != synced).
          Batches them and POSTs to server with version info. Server receives
          changes, applies them with conflict resolution, responds with merged
          data and server-side changes since client's last sync.
        </p>
        <p>
          Exponential backoff: if sync fails (network error, server error),
          retry with increasing delays (1s, 2s, 4s, capping at 5 minutes). Don't
          retry constantly on slow networks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Conflict Detection and Resolution
        </h3>
        <p>
          Conflict occurs when local version and server version both advanced
          from a common ancestor. Example: local version 5, server version 5,
          but different content. Three ways to resolve: (1) last-write-wins
          (compare timestamps, keep newer), (2) automatic merge (use CRDT-like
          semantics), (3) manual (show both versions, user chooses).
        </p>
        <p>
          CRDTs are optimal: operations are commutative and idempotent. If
          server edits note at position 5, and local inserts at position 10,
          both can apply either order and get same result. Libraries like
          Automerge or Yjs implement this.
        </p>
        <p>
          For simple last-write-wins: compare server lastModified with local
          lastModified. Newer one wins. Simpler but data loss possible (local
          edits after sync request will be overwritten).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Multi-Device Synchronization
        </h3>
        <p>
          Device A creates note locally. Device B is offline, doesn't know about
          note yet. Device A syncs to server. Later, Device B comes online,
          syncs. Server sends it the note from Device A. Device B's local
          database is updated with Device A's data. Now both devices have the
          note.
        </p>
        <p>
          Pull-based sync: each device pulls updates from server on reconnect.
          No server-side push/notification needed. Devices may be out-of-sync
          for hours if offline, then sync when reconnect.
        </p>
        <p>
          For real-time sync, supplement with push notifications or WebSocket.
          When server receives changes from Device A, notify Device B (if
          online). Device B pulls updates and refreshes UI. For most apps,
          pull-based is sufficient and simpler.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incremental Sync</h3>
        <p>
          Naive: on each sync, send entire local database. With large datasets
          (1000 notes), this is slow and wasteful. Better: send only changed
          records. Track version per record and send records whose local version
          is newer than the last-synced version.
        </p>
        <p>
          Server tracks last-sync timestamp per device. On pull, server sends
          all records modified since that timestamp. Devices never sync same
          data twice (if server-side update is already on client, client version
          will equal server version; client knows not to re-sync).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Capability</h3>
        <p>
          Offline: all operations work on local storage. No network required.
          User creates, edits, deletes, sees changes instantly. Sync queue
          builds up. When online, queue is processed.
        </p>
        <p>
          Design implication: never require server for core operations. Server
          is optional for sync, not required for basic functionality. This is
          the "local-first" principle: app is usable without network.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI and Sync Status</h3>
        <p>
          Show user sync status: "2 changes pending", "syncing...", "all synced
          ✓". Show per-item status: note has a small icon (⟳ syncing, ✓ synced,
          ⚠ conflict). Allow user to manually trigger sync. Show conflicts
          prominently with resolution options.
        </p>
        <p>
          Sync indicator: subtle (not annoying), but informative. User should
          know if changes are pending or synced.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Libraries and Frameworks
        </h3>
        <p>
          PouchDB, Realm, WatermelonDB provide local-first sync out of the box.
          They handle versioning, conflict resolution, incremental sync.
          Automerge and Yjs handle CRDT-based sync (more powerful, complex).
          Most projects use a library rather than building sync from scratch.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>
          Complexity: local-first adds complexity (versioning, conflict
          resolution, multi-device sync). Simpler apps (single-user,
          always-online) may not justify it. Complex apps (note-taking,
          collaboration, mobile) benefit greatly.
        </p>
        <p>
          Server scalability: server must handle sync from many devices.
          Efficient sync (deltas, compression) is essential. Server may become
          bottleneck if sync is inefficient.
        </p>
        <p>
          Data freshness: eventual consistency means users may see stale data
          briefly. If strong consistency required (e.g., banking), local-first
          may not be suitable.
        </p>
        <p>
          CRDT vs last-write-wins: CRDT is powerful but adds complexity and
          overhead. Last-write-wins is simpler but data loss possible. Choose
          based on needs.
        </p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 1: Pull-Based Sync with Versioning
        </h3>
        <p>
          Client tracks lastSyncVersion. On sync, sends all records with version
          newer than lastSyncVersion. Server responds with remote updates since
          lastSyncVersion. Client merges and updates lastSyncVersion.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 2: CRDT-Based Eventual Consistency
        </h3>
        <p>
          Use CRDT library (Automerge, Yjs). All operations are CRDT operations.
          Sync is automatic: replicate all operations, devices converge. Handles
          conflicts transparently.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 3: Offline-First with Library
        </h3>
        <p>
          Use PouchDB, WatermelonDB, or Realm. Library handles all sync logic.
          Developers focus on data model and UI.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Local-first architecture prioritizes local storage as the source of
          truth, syncing to server asynchronously and eventually. This provides
          instant feedback (no network latency), offline capability (app works
          disconnected), and resilience (network failures are tolerable).
          Essential patterns include local-first design (all operations work
          locally first), background sync with exponential backoff, versioning
          and conflict detection/resolution (CRDT for optimal), incremental sync
          (send only deltas), and multi-device sync via server coordination.
          Trade-offs include added complexity (versioning, sync logic) versus
          simplified user experience (instant feedback, offline support), and
          eventual consistency (temporary divergence acceptable) versus strong
          consistency (always up-to-date). Real-world systems (Obsidian, Notion
          offline mode, Figma) use local-first. For best results, use an
          established library (PouchDB, WatermelonDB, Automerge) rather than
          building sync from scratch, design for eventual consistency, use CRDT
          for collaborative features, implement exponential backoff for retries,
          and provide clear sync status UI. Local-first is ideal for mobile
          apps, collaborative editors, and offline-capable productivity tools.
        </p>
      </section>
    </ArticleLayout>
  );
}
