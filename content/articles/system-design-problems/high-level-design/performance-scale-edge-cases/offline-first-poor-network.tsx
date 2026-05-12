"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-offline-first-poor-network",
  title: "Design Offline-First System (Poor Network)",
  description:
    "Architecture for an offline-first web application that functions on poor or absent network connections: IndexedDB as the local source of truth, a service worker handling all fetch interception with cache-first and stale-while-revalidate strategies, a sync queue for write operations, conflict resolution via last-write-wins or CRDT merge, background sync via the Background Sync API, optimistic UI updates with rollback, and progressive enhancement fallbacks for unsupported browsers.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "offline-first-poor-network",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "offline-first", "service-worker", "indexeddb", "background-sync", "conflict-resolution", "crdt", "poor-network"],
  relatedTopics: ["low-end-device-frontend", "progressive-hydration-system"],
};

export default function OfflineFirstPoorNetworkArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An offline-first system treats network connectivity as an enhancement, not a requirement. The user must be able to read, create, edit, and delete data without any network connection. When connectivity returns, the system must synchronize local changes with the server, detect and resolve conflicts when the same data was modified both locally and remotely, and do all of this transparently without requiring user intervention in the common case.</p>
        <p>Poor network conditions are a spectrum: complete offline (airplane mode), intermittent connectivity (subway tunnel, elevator), high latency with packet loss (2G on a moving train), and captive portal situations (hotel WiFi that blocks all traffic until login). An offline-first system handles all of these identically — it does not distinguish between "offline" and "network so slow it might as well be offline." The IndexedDB local store is the source of truth for reads; the server is the source of truth for authoritative state. The sync layer reconciles the two.</p>
        <p><strong>Explicit scope:</strong> Service worker architecture, IndexedDB schema design, sync queue implementation, conflict resolution strategies, and optimistic UI updates. Not in scope: server-side CRDT implementation, real-time collaborative editing, or native mobile offline.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Read offline:</strong> All data the user has previously viewed is available offline immediately, served from IndexedDB without a network request. The UI must not show spinners or loading states for cached data — it renders instantly from the local store, then optionally refreshes from the network in the background.</li>
          <li><strong>Write offline:</strong> Create, update, and delete operations are accepted offline. Mutations are written to IndexedDB immediately (the source of truth for local state), enqueued in a sync queue (also in IndexedDB), and displayed in the UI immediately as if they had succeeded (optimistic update). When connectivity returns, the sync queue is flushed to the server.</li>
          <li><strong>Conflict resolution:</strong> When a local mutation conflicts with a server-side change (the same record was modified by another user or device while this client was offline), the system detects the conflict, applies a resolution strategy (last-write-wins by timestamp for simple fields; CRDT merge for collaborative data structures), and surfaces unresolvable conflicts to the user.</li>
          <li><strong>Background sync:</strong> The Background Sync API (where supported) enables the service worker to attempt sync even when the browser tab is closed. On browsers without Background Sync support, sync is attempted when the tab regains network connectivity via the online event.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> All read operations complete in under 50ms (IndexedDB read). All write operations complete in under 20ms (IndexedDB write — the server sync happens asynchronously). Zero network round trips for any operation when offline.</li>
          <li><strong>Consistency:</strong> Local data may be temporarily stale (last synced N hours ago), but the UI always shows the last-known state rather than a blank screen or error. Stale data is labeled with a "last updated X" timestamp. Optimistic writes are immediately visible and never lost — they persist in IndexedDB until confirmed by the server or explicitly discarded by the user after a conflict.</li>
          <li><strong>Storage limits:</strong> IndexedDB storage is evictable by the browser under storage pressure. The application must use StorageManager.persist() to request persistent storage, implement an eviction policy (evict oldest content first, never evict user-created drafts), and warn users when approaching storage limits.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture has three layers. The Local Data Layer consists of IndexedDB (via Dexie.js) storing all application data in normalized tables, a sync queue table of pending mutations, and a metadata table (last sync timestamp, conflict log). The Service Worker Layer intercepts all fetch requests: GET requests are served from the Cache API (for static assets) or IndexedDB (for API responses serialized as JSON); POST/PUT/DELETE requests are intercepted offline and queued. The Server Sync Layer is the background process that flushes the sync queue, handles server responses (including conflict detection via HTTP 409 or ETag/If-Match), and merges server state into IndexedDB. The React UI layer reads exclusively from IndexedDB (via React Query with a custom IndexedDB fetcher) and dispatches mutations to the local store, which in turn feeds the sync queue.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/offline-first-poor-network.svg"
          alt="Offline-first poor network architecture: service worker intercepts all fetch (Cache API for assets, IndexedDB JSON for API GET, queue for mutations offline), IndexedDB schema (data tables: normalized entities; syncQueue: {id, method, url, body, retries, timestamp}; metadata: {lastSync, conflictLog}), sync queue flush (online event or Background Sync API → dequeue one at a time → POST/PUT/DELETE to server → 200: mark done → 409 conflict: apply resolution strategy → 5xx: retry with exponential backoff), conflict resolution (last-write-wins: compare server.updatedAt vs local.updatedAt → keep newer; CRDT merge for arrays: union of add-set minus remove-set; unresolvable: add to conflictLog → surface UI), optimistic UI (write to IndexedDB immediately → render → queue sync → on server error: rollback local write → show conflict banner), storage (StorageManager.persist() on install → eviction policy: evict stale API cache first, never evict drafts → warn at 80% quota)."
          caption="Service worker fetch interception (Cache API assets, IndexedDB API JSON, offline mutation queue), sync queue flush (online/Background Sync API, exponential backoff, 409 conflict detection), conflict resolution (last-write-wins timestamp, CRDT array merge, unresolvable surfaced to UI), optimistic UI with rollback on server error"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">IndexedDB Schema and Local Store</h3>
        <p>Dexie.js provides a TypeScript-friendly wrapper over IndexedDB with migrations and compound indexes. The schema has four object stores: (1) entities — the application data, keyed by a composite (type, id) index for fast range queries; (2) syncQueue — pending mutations with fields: id (UUID), method (GET/POST/PUT/DELETE), url, body (serialized JSON), retries (integer), createdAt (timestamp), and status (pending/in-flight/failed); (3) apiCache — serialized API responses keyed by URL + query string hash, with a cachedAt timestamp for TTL enforcement; (4) metadata — key-value store for lastSyncAt, deviceId (a UUID generated on first install, used as the conflict tiebreaker), and quotaWarned (boolean).</p>
        <p>All reads from React components go through a custom React Query adapter that replaces the default fetch function with an IndexedDB read. For example, useQuery(&#123; queryKey: ["todos", userId], queryFn: () =&gt; db.entities.where(&#123; type: "todo", userId &#125;).toArray() &#125;). React Query's stale time is set to infinity for offline-first queries — the background sync updates IndexedDB directly, and the component re-renders via Dexie's live queries (useLiveQuery hook), not via React Query refetching.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Service Worker Fetch Interception</h3>
        <p>The service worker intercepts every fetch request. Static assets (JS bundles, CSS, fonts, images) use Cache-first strategy: serve from Cache API if present, fall through to network and cache the response. API GET requests use stale-while-revalidate: check IndexedDB apiCache, serve the cached response immediately if present, then fetch from the network in the background and update the cache. If the network request fails (offline), the cached response is returned with no error. API mutating requests (POST/PUT/DELETE) — when online, pass through directly; when offline, intercept and return a synthetic 202 Accepted response to the page (so the UI's optimistic update is not rejected), while enqueuing the mutation in the syncQueue object store.</p>
        <p>Network detection within the service worker uses navigator.onLine (a heuristic — it may report online when the network is actually unreachable). A more reliable check is to attempt a HEAD request to /api/health and treat any response (even 5xx) as "online" and a network error (TypeError: Failed to fetch) as "offline." This head-check is cached for 10 seconds to avoid spamming the server.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sync Queue and Conflict Resolution</h3>
        <p>The sync queue flusher runs when: (a) the browser tab fires the online event; (b) the Background Sync API fires the sync event (if supported — Chrome/Edge only as of 2024); (c) on page load if there are pending queue items. The flusher processes one item at a time (not in parallel) to preserve operation ordering: a DELETE that follows a POST to the same resource must not be reordered. Each mutation is sent to the server with an If-Match: "{`{localEntity.etag}`}" header (ETag of the version the client last saw). The server checks the ETag: if it matches the current server version, the mutation is applied and a new ETag is returned (200); if it does not match (another client modified the same record), the server returns 409 Conflict with the current server version in the response body.</p>
        <p>On 409 Conflict, the client applies a resolution strategy: (1) Last-write-wins: compare the local mutation's createdAt timestamp with the server version's updatedAt timestamp. If the local mutation is newer, PUT the local version to the server (overriding the server's change). If the server version is newer, discard the local mutation and update IndexedDB with the server version. This strategy is appropriate for non-collaborative data (a user's own settings, their own drafts). (2) CRDT merge for shared data structures: for arrays and sets, apply a two-phase set (2P-Set) — the union of the local additions-set and server additions-set, minus the union of both removal-sets. This ensures that concurrent deletions and additions are both preserved. (3) For unresolvable conflicts (structural incompatibility), the conflict is added to the metadata.conflictLog and a UI banner is shown: "Your changes conflict with recent updates from another device. Review and keep one version."</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimistic UI and Rollback</h3>
        <p>Every write operation follows a three-step pattern: (1) Write to IndexedDB immediately (the mutation is applied locally in under 20ms, and the Dexie live query triggers a React re-render showing the new state); (2) Enqueue the mutation in the syncQueue; (3) Return success to the UI. From the user's perspective, the action is instantaneous — no waiting for a network round trip. If the sync queue flusher later receives an unrecoverable server error (400 Bad Request, 403 Forbidden — not transient 5xx or network errors), the optimistic update is rolled back: the original entity version is restored in IndexedDB from the syncQueue's stored pre-mutation snapshot, a toast notification explains what happened, and the failed mutation is moved to a failed-mutations log where the user can review and retry manually.</p>
        <p>For 5xx errors and network timeouts, the flusher retries with exponential backoff: 1s, 2s, 4s, 8s, 16s, up to a maximum of 30 minutes. After 10 failed retries (approximately 51 minutes of total backoff), the mutation is moved to the failed queue and the user is notified. This prevents indefinitely blocking the sync queue on a single stuck item — subsequent mutations for other resources proceed normally.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>IndexedDB vs. localStorage for the sync queue: localStorage is synchronous and has a 5MB limit — inadequate for storing large pending mutations or cached API responses. IndexedDB is asynchronous, has much larger quotas (typically 60% of available disk), and supports structured data. The trade-off: IndexedDB's async API adds complexity. Dexie.js mitigates this with promise-based queries, but the learning curve is steeper than localStorage. For applications where offline writes are rare (a read-heavy news app), localStorage for the queue and Cache API for assets may suffice.</p>
        <p>Background Sync API availability: The Background Sync API is only available in Chromium-based browsers (Chrome, Edge, Samsung Internet). Firefox and Safari do not support it as of 2024. For non-Chromium browsers, sync must occur while the tab is open — relying on the online event and periodic polling (setInterval with a check for pending queue items). This means that on Safari, a user who goes offline, makes changes, and closes the browser tab before regaining connectivity will not have their changes synced until they open the app again. This is communicated to the user via a persistent "N changes pending sync" indicator in the app header.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An offline-first system for poor networks is built on four foundations: (1) IndexedDB as the local source of truth (entities, syncQueue, apiCache, metadata stores via Dexie.js), with all React reads going through live queries that bypass network entirely; (2) service worker fetch interception (Cache-first for assets, stale-while-revalidate for API GETs, synthetic 202 + sync queue for offline mutations); (3) sync queue flusher (serial processing to preserve order, ETag-based conflict detection, last-write-wins or CRDT merge resolution, exponential backoff for transient errors, user-visible conflict log for unresolvable cases); and (4) optimistic UI with rollback (local IndexedDB write + re-render in &lt;20ms, rollback on permanent server error with user notification). The defining insight: the network is optional plumbing, not a required dependency — every read and write path must have a complete offline implementation before the network path is added on top.</p>
      </section>
    </ArticleLayout>
  );
}
