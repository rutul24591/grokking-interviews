"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-background-sync",
  title: "Background Sync System",
  description: "Service Worker background sync for reliable delivery of queued actions when network recovers",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "background-sync",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "service-worker", "offline", "reliability", "queue"],
  relatedTopics: ["offline-first-architecture", "push-notification-ux"],
};

export default function BackgroundSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A user submits a form, sends a message, or initiates a file upload while online. The network becomes unreliable mid-request—a tunnel blocks connectivity, or the server becomes temporarily unavailable. The request fails, and the user receives an error. Without a background sync mechanism, the user must manually retry the action. This is poor experience: user frustration, loss of data perception, and bounced submissions.</p>
        <p>Background sync solves this: when a critical action fails due to network issues, queue it in the Service Worker. The app notifies the user "We'll send this when you're back online." Later, when connectivity recovers (detected by Service Worker), automatically retry the queued action in the background without user intervention. The user sees the message delivered or the upload complete without re-initiating the action.</p>
        <p>Key challenges: detecting reliable network recovery (is the network truly back or momentarily available?), retrying with backoff to avoid hammering the server, handling partial failures (some queued items succeed, others fail), persisting the queue across Service Worker updates, and ensuring idempotency (retrying the same action twice doesn't cause duplicate side effects).</p>
        <p><strong>Explicit assumptions:</strong> Service Workers are available and persistent. IndexedDB is available for queue persistence. The fetch API with AbortController is available for cancellation. Actions are deterministic and ideally idempotent. Network recovery can be detected via online/offline events or by attempting a probe request.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Action queuing:</strong> When a network request fails or the browser detects offline status, queue the action (endpoint, method, payload) for later retry.</li>
          <li><strong>Automatic retry on recovery:</strong> When the browser detects network connectivity recovery, automatically retry all queued actions in order.</li>
          <li><strong>Persistence:</strong> Queued actions survive Service Worker termination, browser restart, and tab closure. Persist to IndexedDB.</li>
          <li><strong>Backoff strategy:</strong> Retry with exponential backoff (1s, 2s, 4s, 8s, etc.) to avoid overwhelming the server if it's recovering slowly.</li>
          <li><strong>Priority and ordering:</strong> Support priority levels; critical actions (account recovery) retry before non-critical ones (analytics). Maintain FIFO within priority.</li>
          <li><strong>Idempotency:</strong> Retrying the same action multiple times produces the same result as executing once. Server detects duplicate requests via idempotency keys.</li>
          <li><strong>Progress and status:</strong> Notify the UI of queue depth, which items are retrying, and which have succeeded or permanently failed.</li>
          <li><strong>Manual clearing:</strong> Allow users to clear failed items from queue if they don't want them retried.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> Queuing should be instant (under 50ms). Recovery detection within 5 seconds of network restoration. Retry attempt within 500ms of recovery detection.</li>
          <li><strong>Persistence:</strong> Queue survives indefinitely (weeks if necessary) until successfully processed or explicitly cleared.</li>
          <li><strong>Storage:</strong> Queue uses minimal disk space (IndexedDB quota typically 50MB+). Typical queue of 100 items under 1MB.</li>
          <li><strong>Reliability:</strong> No data loss. All queued items retained until confirmed successful or user-deleted.</li>
          <li><strong>Browser compatibility:</strong> Chrome 40+, Firefox 44+, Safari 12+ (Service Workers). Graceful degradation in older browsers.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The system consists of two primary components: client-side queue management and Service Worker-based retry logic. When a request fails (network error, server 5xx), the client captures the request details and queues them in IndexedDB via the Service Worker. The client notifies the UI of the queued item so the user knows to expect eventual delivery.</p>
        <p>The Service Worker listens for online/offline events. When the browser comes back online, the Service Worker queries IndexedDB for queued items, sorts by priority and timestamp, and attempts retry. It uses exponential backoff with jitter to avoid thundering herd scenarios. If a retry succeeds (2xx response), the item is removed from the queue and marked complete in the UI. If it fails with a non-retriable error (4xx, rate limit), it's moved to a failed bucket and the user is notified. On retriable errors (5xx, timeout), the item is re-queued with incremented retry count.</p>
        <p>Idempotency is ensured by including an idempotency key (UUID) with each queued request. The server uses this key to deduplicate requests. If the same request is retried, the server recognizes the idempotency key and returns the previous result rather than re-processing.</p>

      </section>

      <section>
	        <ArticleImage
	          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/background-sync.svg"
	          alt="Background sync system showing queue flow from request failure through IndexedDB persistence, network recovery detection, priority-sorted retry with exponential backoff, idempotency keys, and success/failure routing"
	          caption="Background sync system showing queue flow from request failure through IndexedDB persistence, network recovery detection, priority-sorted retry with exponential backoff, idempotency keys, and success/failure routing"
	        />
	      </section>

	      <section>
	        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Queue Data Structure</h3>
        <p>Each queued item in IndexedDB contains: a unique ID (UUID), request metadata (method, URL, headers, body), priority level (critical/normal/low), creation timestamp, retry count, last retry timestamp, and status (pending/retrying/succeeded/failed). The queue is indexed by status and priority to enable efficient filtering and sorting.</p>
        <p>IndexedDB schema example: Store "sync-queue" with indexes on status, priority, and createdAt. Each item includes a requestId (idempotency key) to prevent server-side duplicates. Metadata includes the full HTTP request details so retries can be executed identically to the original attempt.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Detection and Recovery</h3>
        <p>Detection uses three mechanisms: (1) online/offline events (navigator.onLine), (2) periodic probe requests to a lightweight endpoint, and (3) actual request success as implicit recovery confirmation. The online event is unreliable; it fires when the browser connects to any network, not necessarily the internet. A probe request (HTTP HEAD to a known-good endpoint) provides confirmation that the actual server is reachable, not just a local network.</p>
        <p>The Service Worker polls every 5 seconds when offline. When it detects online status and receives a probe response, it triggers the sync process. Some implementations use the Background Sync API (if available) which provides a more battery-efficient notification when connectivity recovers, but the polling approach works on all browsers and is more explicit about when recovery occurred.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Logic and Backoff</h3>
        <p>On detection of recovery, the Service Worker retrieves all pending and retrying items from the queue, sorted by priority and creation time. For each item, it attempts a request. If successful, the item is marked succeeded and removed from active queue. If the response status is 4xx (client error), the item is moved to failed and the user notified (no further retries; the request is fundamentally broken). If 5xx or timeout, the item is re-queued with incremented retry count.</p>
        <p>Backoff strategy: retry delay = min(300 * (2 ^ retryCount) + jitter, 3600) seconds. Retries at 300ms, 600ms, 1.2s, 2.4s, 4.8s, and then cap at 1 hour. Jitter (random ±10% variance) prevents multiple queued items from retrying simultaneously. After 5-10 retries over several hours, an item is marked failed if still unsuccessful. The user is notified and given the option to retry manually or discard.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Idempotency and Deduplication</h3>
        <p>Each queued request includes an idempotency key (generated client-side as UUID). The server endpoint must support the Idempotency-Key header. On first request with key X, the server processes and returns success. On retry with the same key X, the server recognizes the key, skips processing, and returns the previous result.</p>
        <p>This is critical for financial transactions, account creations, and any operation with side effects. Without idempotency, a retried request might charge the customer twice, create duplicate accounts, or send duplicate messages. The idempotency key ensures that no matter how many times the request is retried, the side effect occurs exactly once.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI Integration and Status Tracking</h3>
        <p>When a request is queued, the client-side app stores the queue ID locally and displays "Queued for delivery" or similar status. The Service Worker broadcasts status updates via postMessage or an event beacon when items are retried or succeed. The UI listens for these updates and changes the status from "Queued" to "Delivering" to "Delivered" as appropriate.</p>
        <p>For persistence across browser sessions, the client checks IndexedDB on startup for any pending or failed items from previous sessions and displays them. The user can view a "Pending Delivery" list showing items awaiting retry, retried items, and permanently failed items with the option to retry or discard.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling and Failure Modes</h3>
        <p>Retriable errors (5xx, timeouts, connection reset): queue for retry with backoff. Non-retriable errors (4xx except 429, CORS errors): move to failed without retry; inform user of permanent failure and offer manual intervention if applicable. Rate limit errors (429): retry with longer backoff (respect Retry-After header if provided). Malformed stored requests: skip and log; don't block other items.</p>
        <p>IndexedDB quota exceeded: implement age-based cleanup; discard old pending items (older than 7 days) to free space. Prioritize newer items for retention. Failed items may be discarded after 14 days of failure. Temporary storage API provides persistent storage on some browsers; use if available.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Service Worker Lifecycle</h3>
        <p>Service Workers are ephemeral; they're activated when pages are open and terminated when idle. If a queued item's retry is scheduled while the Service Worker is terminated, it won't fire until the next page load or until an external event (periodic sync, push notification) wakes the Service Worker. This is acceptable for most applications; the item retries when the browser is active again.</p>
        <p>For critical items requiring guaranteed delivery within a time window, use the Periodic Background Sync API (if available) to wake the Service Worker every 15+ minutes and check for pending items. Most apps use the simpler approach: check and retry on page load or when the user is active.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance and Storage Optimization</h3>
        <p>Queue entries are typically small (50-200 bytes for metadata). A queue of 100 failed items over a week is under 100KB in IndexedDB. For very large payloads (file uploads), store the file blob separately in Cache Storage (which has separate quota) and reference it from the queue entry by cache key.</p>
        <p>Periodic cleanup: on each sync attempt, remove succeeded items from IndexedDB. Remove failed items older than 14 days. Remove pending items older than 30 days that have exceeded retry limits. This keeps IndexedDB lean and responsive.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Guaranteed delivery vs simplicity: fully guaranteed delivery (multiple retries, persistent queue, idempotency keys) adds complexity. Simple best-effort (retry once or twice, forget) is simpler but data loss possible. Most applications balance with exponential backoff and 5-10 retries over a day, catching 99%+ of transient failures.</p>
        <p>Server support: background sync requires server support for idempotency keys. If the server doesn't support idempotency, retries may cause duplicates. New implementations should always assume client-side retries and design idempotency in from the start.</p>
        <p>User experience: showing "queued" items persistently in the UI provides transparency but can feel slow if recovery takes seconds. Some apps hide the queue internally and only show it if items fail after 30+ seconds. Trade-off: transparency vs perceived speed.</p>
        <p>Offline simulation: in development, test thoroughly with network throttling and explicit offline mode. The complexity of background sync isn't apparent in normal online testing; offline scenarios reveal edge cases.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Simple Service Worker Queue</h3>
        <p>Service Worker listens for fetch events that fail. On failure, queue request metadata in IndexedDB. On online/offline event transition, trigger sync from queued items. Suitable for small, non-critical queues.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Priority-Based Queue with Backoff</h3>
        <p>Queue items with priority and exponential backoff. Periodic task (every 5s when offline) retries highest-priority items first. Failed items accumulate and are visibly tracked in the UI for user awareness.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: File Upload Queue with Resumable Chunks</h3>
        <p>For large file uploads, split into chunks. Queue each chunk separately with offset metadata. On retry, resume from last successful chunk rather than re-uploading entire file. Reduces bandwidth waste on transient failures.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Background sync enables reliable delivery of queued actions when network connectivity is restored, improving user experience during offline or flaky network conditions. Essential patterns include persistent queuing in IndexedDB, exponential backoff retry logic, idempotency keys for server deduplication, and online/offline event detection with probe requests for confirmation. Trade-offs balance guaranteed delivery (complex) against simplicity, and transparency (queued status visible) against perceived speed. Real-world systems (PWAs, email clients, note-taking apps) rely on background sync to hide network unreliability. For best results, ensure server-side idempotency support, implement 5-10 retries with exponential backoff over 24 hours, persist queues indefinitely until success or user deletion, and provide clear UI feedback about queued items and retry status. Monitoring queue depth and retry patterns reveals network issues before users report them.</p>
      </section>
    </ArticleLayout>
  );
}
