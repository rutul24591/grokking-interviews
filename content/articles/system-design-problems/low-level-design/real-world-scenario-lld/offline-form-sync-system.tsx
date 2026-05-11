"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-offline-form-sync-system",
  title: "Design Offline Form Sync System",
  description:
    "Production-grade offline form handling with local persistence, conflict resolution, and synchronization on reconnect.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "offline-form-sync-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "offline", "forms", "synchronization", "conflict-resolution"],
  relatedTopics: ["debounced-auto-save-system", "background-sync"],
};

export default function OfflineFormSyncSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Field workers, healthcare professionals, and users in areas with intermittent connectivity frequently need to fill out and submit forms without a reliable network connection. A construction site inspector fills out a safety checklist offline; a field sales rep fills out a customer visit report in a dead zone; a healthcare worker records patient observations in a hospital basement with poor signal. The form data must be preserved, the user must be able to continue working, and the data must sync to the server reliably when connectivity is restored—without data loss and without duplicates.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The design problem extends beyond simple offline storage. The form may reference data that itself changes while the user is offline (a product price updates, a patient record is modified by another care provider). When the user submits, the server may need to detect that the form references stale data and present a conflict resolution UI rather than silently overwriting. The system must also handle multiple forms queued for submission, submitting them in dependency order, and surfacing partial failures without losing the submitted ones.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> The form references external data (records, IDs) that may change while offline. Conflicts are detected via optimistic concurrency control (If-Unmodified-Since or ETag). The offline queue is stored in IndexedDB (not localStorage, because forms may be large and IndexedDB has a higher storage quota). The Service Worker intercepts form submissions and queues them when offline. Network reconnection is detected via the online event and a probe request.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Offline form filling:</strong> All form fields work without a network connection. Validation runs client-side. The form auto-saves to IndexedDB as the user types.</HighlightBlock>
          <li><strong>Submission queuing:</strong> When submit is attempted offline, the form is queued. The user sees "Saved locally. Will submit when online." and can continue to other forms.</li>
          <li><strong>Automatic sync on reconnect:</strong> When network is detected, queued submissions attempt to sync in order. Progress is shown to the user.</li>
          <HighlightBlock as="li" tier="important"><strong>Conflict detection and resolution:</strong> If the referenced record changed while offline, the server returns a conflict response. The UI presents the before/after state and lets the user decide how to proceed.</HighlightBlock>
          <li><strong>Draft persistence:</strong> Incomplete forms (not yet submitted) are persisted to IndexedDB and restored on next app load.</li>
          <HighlightBlock as="li" tier="important"><strong>Queue management:</strong> User can see the pending submission queue, reorder, remove individual items, or retry failed items manually.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Storage:</strong> IndexedDB handles large forms (photos, attachments) up to device quota; graceful degradation when quota is approached.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Sync reliability:</strong> Queued submissions retry with exponential backoff; permanent failures are surfaced to the user without losing data.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Idempotency:</strong> Each queued submission has a unique idempotency key; retries cannot create duplicate records on the server.</HighlightBlock>
          <li><strong>Conflict resolution UX:</strong> Conflict presentation is understandable to non-technical users; field-level diff with clear "keep mine" / "use server version" options.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The offline form system has three layers: the draft layer (IndexedDB auto-save of in-progress form data), the submission queue (IndexedDB records of complete forms awaiting server submission), and the sync engine (Service Worker or application-level code that processes the queue on network restoration).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Draft layer: as the user types, the form state is written to IndexedDB under a draft key (draftId keyed by formType + entityId + userId). On re-opening the app, drafts are restored into the form UI with a notification "Unsaved draft from [timestamp] restored." The user can discard the draft (clear it) or continue editing.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Queue layer: when the user submits a complete form offline, the draft is promoted to a queued submission: a queue record with the full form data, the idempotency key (UUID generated at submission time), the form type, the target entity ID and its last-seen version (for conflict detection), and a status (pending, retrying, failed). The draft is cleared once the queue record is created.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Sync engine: on detecting connectivity (online event + probe request), the sync engine dequeues records in FIFO order and submits them. Each submission includes the idempotency key and the If-Unmodified-Since header set to the entity's last-seen version. On 200 success, the queue record is deleted. On 412 Conflict, the queue record is updated with conflictDetails and status = conflict_resolution_required. On 5xx or network error, the queue record increments retryCount and a backoff timer is set for the next attempt.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/offline-form-sync-system.svg"
          alt="Offline form sync system showing draft auto-save to IndexedDB, submission queue, network reconnection detection, sync with idempotency keys and If-Unmodified-Since conflict detection, and conflict resolution merge UI"
          caption="Offline form sync system showing draft auto-save to IndexedDB, submission queue, network reconnection detection, sync with idempotency keys and If-Unmodified-Since conflict detection, and conflict resolution merge UI"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Offline Form Sync System</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">IndexedDB Schema</h3>
        <HighlightBlock as="p" tier="important">The IndexedDB database has two object stores. The drafts store: draftId (primary key), formType, entityId, userId, formData (JSON), lastModified (timestamp), syncStatus ("local"). The queue store: queueId (primary key), idempotencyKey (UUID), formType, entityId, formData (JSON), entityVersion (the If-Unmodified-Since value), status (pending | retrying | failed | conflict_resolution_required), retryCount, nextRetryAt, conflictDetails (populated on 412), createdAt.</HighlightBlock>
        <p>Indexes on the queue store: status (to efficiently find pending items for sync), entityId (to find all queued submissions for a specific record), nextRetryAt (to find items whose backoff timer has expired). IndexedDB cursor queries against these indexes allow the sync engine to efficiently find work without scanning all queue records.</p>
        <p>For forms with file attachments (photos, documents), storing binary data directly in IndexedDB is possible but can exhaust IndexedDB's storage quota. Better: store binary files in a separate Cache Storage bucket (higher quota, designed for binary data) and store only a reference URL in IndexedDB. The sync engine retrieves the binary from Cache Storage when submitting the form. After successful submission, both the IndexedDB record and the Cache Storage binary are deleted to free space.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Draft Auto-Save</h3>
        <p>Draft auto-save runs on every form change event (onChange for each field), debounced at 500ms. The save is: serialize the current form state to JSON, write to IndexedDB under the draftId. This is fast (IndexedDB writes are async and don't block the main thread) and reliable (IndexedDB persists across page refreshes and browser restarts).</p>
        <p>On form mount, the system checks for an existing draft for the current (formType, entityId, userId) combination. If found, the draft's lastModified timestamp is compared to the entity's server-side updatedAt (fetched on mount). If the draft is newer than the server record (the user was editing offline), restore the draft and show a banner: "Unsaved changes from [timestamp] restored." If the draft is older (the server was updated after the draft was saved, meaning another user changed the record), show a conflict warning: "This record was updated while you were offline. Your draft and the current record differ." Offer to discard the draft and load the server version.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Resolution UI</h3>
        <p>When the server returns a 412 Conflict, the sync engine stores the server's current version in the queue record's conflictDetails field. The UI shows the queue item as "Conflict requires your attention" with a "Resolve" button. Clicking opens a field-by-field comparison view: left side shows the user's submitted values, right side shows the server's current values, with differences highlighted. Fields without differences are collapsed (show "No change"). For each differing field, the user selects "keep my value" or "use server value." For complex nested objects, a JSON diff is shown for technical users with an option to edit the final JSON directly.</p>
        <p>After the user resolves all conflicting fields, the resolved form data is sent as a new submission with a fresh If-Unmodified-Since value (the server version's timestamp, signaling "I've seen the server version and I'm intentionally overriding it with this merge"). The server accepts this as an authoritative merge submission. If the record changed again on the server between the conflict display and the user's resolution, a second 412 can occur—the system should detect this and repeat the resolution flow (rare but possible in high-contention scenarios).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sync Engine and Retry Logic</h3>
        <HighlightBlock as="p" tier="important">The sync engine runs as a Web Worker or Service Worker background process. On startup (or on the online event), it queries the queue store for items with status = pending or (status = retrying AND nextRetryAt &lt;= now()). Items are processed in FIFO order (sorted by createdAt). For each item, it assembles the HTTP request (POST or PATCH to the appropriate API endpoint, with the idempotency key as Idempotency-Key header and the entityVersion as If-Unmodified-Since), submits it, and handles the response.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Retry backoff schedule: first retry immediately on reconnect, second retry 30 seconds later, third 2 minutes, fourth 10 minutes, fifth 30 minutes, cap at 1 hour. After 10 retries over 24+ hours, the item is moved to status = failed and the user is notified: "A form submission from [timestamp] could not be sent after multiple attempts. Please review and resubmit manually." The form data is preserved in IndexedDB so the user can inspect it and resubmit with a fresh submission if needed.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Idempotency is enforced by the server: if the same idempotency key is submitted twice (due to a retry after a network error where the first submission actually succeeded), the server returns the result of the original submission without creating a duplicate record. The client uses the idempotency key generated at queue-time, not at retry-time. This key must be stored in IndexedDB alongside the queue record to survive app restarts between retries.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Detection</h3>
        <HighlightBlock as="p" tier="crucial">The browser's online/offline events (window.ononline, window.onoffline) indicate whether the browser has any network connection, but not whether the application server is reachable. A device may be connected to a WiFi network with no internet access (offline in terms of the application, but online in terms of the browser). The sync engine uses a two-stage check: (1) listen for the online event as a trigger; (2) on online event, send a lightweight HEAD request to a known-good application endpoint (GET /health); (3) if the probe returns 200, the server is reachable and sync begins; if the probe fails, schedule a retry in 10 seconds. This ensures syncs only begin when the server is confirmed reachable, not just when the device is connected to any network.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">IndexedDB versus localStorage for the queue: localStorage is simpler but limited to ~5MB and synchronous reads/writes (blocking the main thread). IndexedDB is async, supports larger storage, and is queryable with indexes—essential for a queue with many records. For offline form systems, IndexedDB is the correct choice. The only trade-off is API complexity (mitigated by libraries like idb or Dexie.js).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Service Worker versus application-level sync: Service Worker-based sync can run even when the app is not open (the browser can wake the Service Worker on network reconnection using the Background Sync API). Application-level sync only runs when the user has the app open. For field workers who may close the app and return hours later, Service Worker sync is significantly better—the submission queue drains in the background without requiring the user to reopen the app. The trade-off is Service Worker complexity and limited browser support for Background Sync (primarily Chrome).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Conflict resolution at field level versus full document: field-level conflict resolution (which field has the conflict?) is more user-friendly but requires the server to return a per-field diff on 412. Full document conflict resolution (server version versus user version, user resolves all differences) is simpler to implement. For most form types, field-level resolution is worth the extra implementation effort because it narrows the user's attention to the specific fields that differ.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Idempotency keys prevent duplicate submissions on retry. Binary file attachments use Cache Storage (higher quota) with IndexedDB references. The</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Service Worker Background Sync API enables queue draining when the app is closed. The defining principle: user data is never lost—even failed submissions are preserved in IndexedDB for manual review and resubmission, and the system surfaces failure clearly rather than silently discarding submissions.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
