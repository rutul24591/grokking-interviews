"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-queuing-concise",
  title: "Request Queuing",
  description: "Deep dive into client-side request queuing covering priority queues, concurrency limits, offline queuing, sequential processing, and managing network request lifecycle in frontend applications.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "request-queuing",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "queue", "concurrency", "priority", "offline", "request-management"],
  relatedTopics: ["request-batching", "retry-logic-and-exponential-backoff", "request-cancellation", "background-sync"],
};

export default function RequestQueuingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Request Queuing</strong> is a client-side pattern for controlling the order, concurrency, and
          lifecycle of outgoing HTTP requests. Rather than allowing every component to fire requests freely and
          compete for limited browser connections, a queue mediates access to the network, enforcing concurrency
          limits, priority ordering, and graceful handling of failures, cancellations, and offline conditions.
        </p>
        <p>
          The need for request queuing stems from fundamental browser constraints. HTTP/1.1 browsers enforce a
          per-origin connection limit of 6 concurrent connections (per the HTTP specification and browser
          implementations in Chrome, Firefox, and Safari). When an application dispatches more than 6 requests
          to the same origin simultaneously, the browser's internal TCP connection pool queues the excess
          requests, creating head-of-line blocking where low-priority prefetch requests can delay critical data
          fetches. HTTP/2 and HTTP/3 mitigate this through multiplexing, but introduce their own prioritization
          challenges at the stream level, and server-side resource contention remains a concern regardless of
          protocol version.
        </p>
        <p>
          At a staff or principal engineer level, understanding request queuing means designing queue
          architectures that account for priority inversion, starvation prevention, backpressure propagation,
          and integration with the broader request lifecycle (retry, timeout, cancellation, offline). Libraries
          like React Query (TanStack Query) and SWR implement sophisticated internal queuing: React Query
          maintains a query cache with configurable stale times, deduplicates in-flight requests, and
          supports dependent queries that naturally form a sequential queue. SWR's revalidation mechanism
          effectively queues background refetches and merges them with active requests.
        </p>
        <p>
          Beyond data fetching libraries, explicit request queuing is essential in scenarios like file upload
          managers (limiting concurrent uploads to prevent bandwidth saturation), offline-first applications
          (queuing mutations in IndexedDB for later replay), and API clients operating against rate-limited
          endpoints (respecting 429 Retry-After headers by queuing subsequent requests until the rate limit
          window resets).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Request queuing encompasses several queue types and management strategies, each addressing different constraints:</p>
        <ul>
          <li>
            <strong>FIFO Queue (First-In, First-Out):</strong> The simplest queue discipline, where requests are
            processed in the order they arrive. Each request waits for the preceding request to complete (or for
            a concurrency slot to open) before being dispatched. FIFO queues are appropriate when all requests
            have equal importance and ordering matters for correctness, such as sequential form submissions where
            each step depends on the previous step's result. The primary limitation is that there is no mechanism
            to elevate urgent requests, making FIFO unsuitable when different requests have different criticality
            levels.
          </li>
          <li>
            <strong>Priority Queue:</strong> Requests are assigned priority levels (commonly Critical, High,
            Normal, Low) and processed in priority order rather than arrival order. When a concurrency slot opens,
            the highest-priority pending request is dispatched first. This prevents low-priority background
            operations (prefetching, analytics, image preloading) from consuming connection slots needed by
            critical user-facing operations (authentication, primary data fetches, mutation submissions).
            Implementing priority queues requires attention to starvation: low-priority requests must eventually
            be promoted or dispatched, even when higher-priority requests keep arriving, typically via aging
            mechanisms that increment priority over time.
          </li>
          <li>
            <strong>Concurrency-Limited Queue:</strong> Enforces a maximum number of in-flight requests (for
            example, 4 concurrent requests), regardless of priority. When the limit is reached, new requests
            wait in the queue until an in-flight request completes. This prevents overwhelming the browser's
            connection pool, avoids server-side resource exhaustion, and provides predictable bandwidth
            utilization. The concurrency limit should be tuned based on the transport protocol (lower for
            HTTP/1.1, higher for HTTP/2), network conditions (lower on slow connections), and server capacity.
            Dynamic concurrency adjustment based on response times or error rates (adaptive concurrency)
            represents an advanced pattern used by Netflix's concurrency limiter.
          </li>
          <li>
            <strong>Offline Queue (Outbox Pattern):</strong> When the application detects loss of network
            connectivity (via navigator.onLine or the Network Information API), mutations and critical requests
            are persisted to a durable store (IndexedDB or localStorage) rather than being dropped. When
            connectivity is restored, the queue replays persisted requests in order, handling conflicts and
            ensuring idempotency. This pattern is the foundation of offline-first architectures and is
            formalized in the Background Sync API (BackgroundSyncManager), which allows service workers to
            defer actions until the device has a stable connection. The outbox pattern requires careful
            attention to conflict resolution when the server state has changed during the offline period.
          </li>
          <li>
            <strong>Rate-Limited Queue:</strong> Designed to respect server-imposed rate limits by tracking
            request quotas and timing. When the client receives a 429 Too Many Requests response with a
            Retry-After header, the queue pauses all requests to that endpoint for the specified duration.
            More sophisticated implementations maintain a token bucket or sliding window counter on the client
            side, proactively throttling requests before hitting the server's limit. This is critical for
            applications integrating with third-party APIs (GitHub, Twitter, Stripe) that enforce strict rate
            limits and may temporarily ban clients that exceed them.
          </li>
          <li>
            <strong>Cancellation-Aware Queue:</strong> Integrates with the AbortController API to support
            request cancellation at any stage of the queue lifecycle. Queued (not yet dispatched) requests
            can be removed from the queue without any network activity. In-flight requests can be aborted
            via their AbortSignal, freeing the concurrency slot for the next queued request. This is
            essential for search-as-you-type interfaces (where each keystroke obsoletes the previous request),
            route transitions (where navigating away should cancel pending data fetches), and component
            unmounting (where results would be discarded anyway). React Query and SWR both use AbortController
            internally for automatic cancellation of stale queries.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A production request queue architecture consists of several interacting layers: an intake layer that
          accepts and classifies requests, a scheduling layer that manages ordering and priority, a dispatch
          layer that enforces concurrency limits, and a response routing layer that delivers results back to
          callers.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/request-queue-architecture.svg"
          alt="Request Queue Architecture Diagram"
          caption="Request Queue Architecture - Requests enter through priority lanes, pass through a concurrency limiter, and responses are routed back to callers"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Queue Processing Lifecycle</h3>
          <ol className="space-y-3">
            <li><strong>1. Request Intake:</strong> A component calls queue.enqueue(request, priority). The queue assigns a unique ID, creates a Promise/callback pair, and classifies the request by priority level</li>
            <li><strong>2. Priority Sorting:</strong> The request is inserted into the appropriate priority lane. Within the same priority level, FIFO ordering is maintained</li>
            <li><strong>3. Concurrency Check:</strong> The scheduler checks whether the number of in-flight requests is below the concurrency limit. If a slot is available, the request is immediately dispatched</li>
            <li><strong>4. Wait State:</strong> If no slot is available, the request remains queued. The scheduler may apply aging to prevent starvation of lower-priority requests</li>
            <li><strong>5. Dispatch:</strong> When a slot opens, the highest-priority queued request is extracted and dispatched over the network with its associated AbortController signal</li>
            <li><strong>6. In-Flight Monitoring:</strong> The queue tracks each in-flight request's duration against a timeout threshold. If exceeded, the request is aborted and optionally re-queued with retry logic</li>
            <li><strong>7. Response Handling:</strong> On completion (success or failure), the in-flight counter is decremented, the caller's Promise is resolved/rejected, and the scheduler checks for the next queued request</li>
            <li><strong>8. Drain and Cleanup:</strong> On application teardown or route transition, the queue cancels all pending requests and aborts all in-flight requests to prevent memory leaks and state updates on unmounted components</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/priority-queue-flow.svg"
          alt="Priority Queue Flow Diagram"
          caption="Priority Queue Flow - High-priority requests jump ahead in the queue, concurrency limit processes 3 at a time"
        />

        <p>
          The interaction between the queue and the browser's built-in connection management requires careful
          consideration. If the application-level queue allows 4 concurrent requests, but the browser's HTTP/1.1
          limit for the origin is 6, there is headroom for other requests (images, scripts, WebSocket upgrades)
          to share the connection pool without contention. Setting the application queue limit equal to or above
          the browser limit negates the benefit, as the browser will still queue excess connections internally,
          where the application has no visibility or control over ordering.
        </p>
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Request queuing implementations range from simple sequential processors to sophisticated priority-aware systems:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Priority Queue with Concurrency Limiting</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Offline-Aware Queue with IndexedDB Persistence</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Rate-Limited Queue with Token Bucket</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Resource Control</strong></td>
              <td className="p-3">
                • Prevents connection pool exhaustion<br/>
                • Predictable bandwidth utilization<br/>
                • Protects servers from request storms
              </td>
              <td className="p-3">
                • Adds queueing delay to every request<br/>
                • Queue itself consumes memory<br/>
                • Over-conservative limits underutilize network
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>User Experience</strong></td>
              <td className="p-3">
                • Critical requests are never blocked by background work<br/>
                • Graceful degradation during high activity<br/>
                • Offline support maintains perceived responsiveness
              </td>
              <td className="p-3">
                • Visible delays for queued low-priority requests<br/>
                • Complexity in communicating queue state to users<br/>
                • Priority misconfiguration can worsen UX
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Reliability</strong></td>
              <td className="p-3">
                • Orderly retry and failure handling<br/>
                • Offline persistence prevents data loss<br/>
                • Rate limit compliance prevents API bans
              </td>
              <td className="p-3">
                • Queue corruption can block all requests<br/>
                • Stale queued requests may send outdated data<br/>
                • Complex recovery logic for partial failures
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Maintainability</strong></td>
              <td className="p-3">
                • Centralized request management simplifies debugging<br/>
                • Clear separation of scheduling from business logic<br/>
                • Testable queue behavior in isolation
              </td>
              <td className="p-3">
                • Additional abstraction layer to understand<br/>
                • Debugging asynchronous queue behavior is hard<br/>
                • Risk of over-engineering simple fetch patterns
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Scalability</strong></td>
              <td className="p-3">
                • Gracefully handles traffic spikes without cascading failures<br/>
                • Adaptive concurrency adjusts to conditions<br/>
                • Backpressure signals enable upstream throttling
              </td>
              <td className="p-3">
                • Queue depth can grow unbounded without limits<br/>
                • Memory pressure from large offline queues<br/>
                • IndexedDB storage quotas can be exceeded
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/queue-strategies.svg"
          alt="Queue Strategies Comparison"
          caption="Comparison of queue strategies: FIFO, Priority, Rate-Limited, and Offline Queue patterns with their processing characteristics"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To implement robust request queuing in production frontend applications, follow these practices:</p>
        <ol className="space-y-3">
          <li>
            <strong>Set Concurrency Limits Below Browser Limits:</strong> Configure the application queue to
            allow fewer concurrent requests (3-4) than the browser's per-origin limit (6), leaving headroom
            for unqueued requests (images, scripts, WebSocket connections). This prevents the application from
            monopolizing the browser's connection pool.
          </li>
          <li>
            <strong>Implement Priority Aging:</strong> Prevent starvation of low-priority requests by
            incrementing their effective priority over time. A request that has waited in the queue for more
            than a configurable threshold (e.g., 10 seconds) should be promoted to the next priority level.
            This ensures all requests are eventually processed, even under sustained high-priority load.
          </li>
          <li>
            <strong>Use AbortController for Lifecycle Management:</strong> Create an AbortController for each
            queued request and wire it to component lifecycle events. When a component unmounts or a route
            changes, abort all associated pending and in-flight requests. This prevents wasted bandwidth,
            memory leaks from resolved promises updating unmounted state, and React "Can't perform a React
            state update on an unmounted component" warnings.
          </li>
          <li>
            <strong>Persist Offline Queues to IndexedDB:</strong> For offline-capable applications, serialize
            queued mutations to IndexedDB (not localStorage, which has a 5-10MB limit and is synchronous).
            Include enough context per entry (timestamp, user ID, idempotency key, request payload) to enable
            conflict resolution and deduplication when replaying. Use the Background Sync API where available
            to trigger replay automatically on connectivity restoration.
          </li>
          <li>
            <strong>Implement Backpressure Signaling:</strong> When the queue reaches a configurable depth
            threshold, propagate backpressure to the application layer. This can mean disabling prefetch
            triggers, showing a loading indicator, or returning a "queue full" error to non-critical callers.
            Without backpressure, unbounded queues consume memory and create increasingly stale requests.
          </li>
          <li>
            <strong>Separate Queues by Concern:</strong> Maintain separate queue instances for different
            request categories (data fetches, mutations, analytics, file uploads) with independent concurrency
            limits and priority policies. This prevents a large file upload from blocking critical data
            fetches, even if both share the same origin.
          </li>
          <li>
            <strong>Monitor Queue Health Metrics:</strong> Track queue depth, average wait time, concurrency
            utilization, rejection rate, and timeout rate. Expose these metrics via performance observers or
            custom analytics events. High queue depth indicates the concurrency limit is too low or the server
            is too slow; high timeout rate indicates network instability.
          </li>
          <li>
            <strong>Test Edge Cases Explicitly:</strong> Queue implementations have subtle failure modes:
            rapid enqueue/dequeue cycles, queue drain during network transitions, concurrent cancellation
            of the same request, and IndexedDB write failures during offline queueing. Write integration
            tests that simulate these scenarios with controlled timing.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common mistakes when implementing request queuing:</p>
        <ul className="space-y-3">
          <li>
            <strong>Not Cancelling Queued Requests on Navigation:</strong> Allowing requests to remain in the
            queue after the user navigates to a different view, wasting bandwidth and potentially triggering
            state updates on unmounted components. Always bind queue lifecycle to the component or route that
            initiated the requests, using AbortController signals.
          </li>
          <li>
            <strong>Setting Concurrency Too High:</strong> Using a concurrency limit of 10-20, which exceeds
            browser connection limits and pushes queueing into the browser's opaque internal queue where the
            application has no control. Keep application-level concurrency below the browser's per-origin
            limit for effective scheduling.
          </li>
          <li>
            <strong>Ignoring Priority Inversion:</strong> A high-priority request waiting behind an in-flight
            low-priority request that holds one of the limited concurrency slots. While you cannot preempt
            an in-flight request, you can mitigate this by reserving concurrency slots exclusively for
            high-priority requests (for example, reserve 1 of 4 slots for critical operations).
          </li>
          <li>
            <strong>Unbounded Queue Growth:</strong> Not setting a maximum queue depth, allowing the queue
            to accumulate thousands of entries during bursts. This consumes memory and produces increasingly
            stale requests. Set a maximum depth and reject or drop the oldest low-priority entries when exceeded.
          </li>
          <li>
            <strong>Replaying Stale Offline Mutations:</strong> Blindly replaying all offline-queued mutations
            when connectivity is restored, without checking whether the data they reference has changed on the
            server. Include timestamps and version tokens in queued mutations and implement server-side
            conflict detection (optimistic concurrency control).
          </li>
          <li>
            <strong>Single Global Queue for Everything:</strong> Routing all request types through one queue
            with one concurrency limit, causing interference between unrelated concerns. A large analytics
            batch should not prevent a critical API call from dispatching. Use separate queues per domain.
          </li>
          <li>
            <strong>Not Handling Queue Deadlocks:</strong> Scenarios where queued requests depend on each
            other (request B needs data from request A, but both are queued and only one slot is available).
            If request B is dispatched first, it waits for A's result indefinitely. Detect and break
            dependency cycles by allowing dependent requests to share concurrency slots or by dispatching
            dependencies first.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Request queuing excels in these production scenarios:</p>
        <ul className="space-y-3">
          <li>
            <strong>File Upload Managers:</strong> Dropbox, Google Drive, and WeTransfer implement upload queues
            that limit concurrent uploads (typically 3-5), display per-file progress, support pause/resume,
            and handle individual file failures without affecting other uploads in the queue. Priority ordering
            allows users to bump important files to the front of the queue.
          </li>
          <li>
            <strong>Offline-First Applications:</strong> Applications like Google Docs, Notion, and Linear queue
            mutations locally when offline (using IndexedDB or a service worker outbox), display pending
            changes to the user, and replay them in order when connectivity returns. Conflict resolution
            strategies (last-writer-wins, operational transforms, CRDTs) handle concurrent edits.
          </li>
          <li>
            <strong>Image-Heavy Galleries:</strong> Pinterest, Instagram, and stock photo sites use request
            queues to manage thumbnail loading, prioritizing images in the viewport over images below the
            fold. As the user scrolls, previously queued below-fold images are cancelled and replaced with
            newly visible ones, implementing a form of priority-based cancellation.
          </li>
          <li>
            <strong>API Gateway Clients:</strong> Applications that aggregate data from multiple rate-limited
            third-party APIs (Stripe, Twilio, GitHub) use per-API queues with independent rate limiters.
            Each queue respects its API's specific rate limit headers and backs off appropriately on 429
            responses, preventing API key bans.
          </li>
          <li>
            <strong>Real-Time Collaboration:</strong> Figma and Miro queue local edits and synchronize them
            with the server in controlled batches, using concurrency limits to prevent overwhelming the
            WebSocket or HTTP connection. Priority ordering ensures cursor positions and selection changes
            (high frequency, low importance) do not block structural edits (low frequency, high importance).
          </li>
          <li>
            <strong>Progressive Web Apps:</strong> Service workers implement request queues for caching
            strategies. The Workbox library provides a BackgroundSyncQueue that persists failed requests
            and retries them when the service worker receives a sync event, implementing the offline queue
            pattern at the network layer.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use Request Queuing</h3>
          <p>Avoid explicit queuing for:</p>
          <ul className="mt-2 space-y-2">
            <li>• Simple applications with few concurrent requests (the browser's native handling is sufficient)</li>
            <li>• WebSocket or Server-Sent Events connections (these are long-lived, not request-response)</li>
            <li>• HTTP/2 environments where the protocol's multiplexing and stream prioritization already handle ordering</li>
            <li>• Static asset loading (browsers optimize this natively with preload scanner and priority hints)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Workbox Background Sync - Chrome Developers
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/query/latest/docs/framework/react/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query) - Request Management
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - AbortController API
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/fetch-priority" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Fetch Priority and Resource Prioritization
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - Background Synchronization API
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design a request queue that handles both priority ordering and concurrency limiting?</p>
            <p className="mt-2 text-sm">
              A: Use a multi-lane priority queue backed by separate arrays for each priority level (Critical,
              High, Normal, Low). Maintain an in-flight counter and a configurable concurrency limit (e.g., 4).
              When enqueue is called, insert the request into the appropriate priority lane and call a drain
              function. The drain function checks if in-flight count is below the limit, then extracts the
              highest-priority pending request (scanning Critical first, then High, etc.) and dispatches it.
              On request completion, decrement in-flight count and call drain again to process the next queued
              request. To prevent starvation, implement aging: every N seconds, increment the effective priority
              of requests that have waited longer than a threshold. Reserve at least one concurrency slot for
              Critical requests by checking that non-critical requests only use N-1 slots.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do browser connection limits affect frontend request management?</p>
            <p className="mt-2 text-sm">
              A: HTTP/1.1 browsers limit concurrent connections to 6 per origin (domain + port). When more
              than 6 requests target the same origin, the browser internally queues the excess without any
              application-level visibility or control over ordering. This means a low-priority image request
              can block a critical API call if it claimed a connection slot first. HTTP/2 multiplexes all
              requests over a single TCP connection, eliminating the 6-connection limit, but introduces stream
              prioritization challenges. Application-level queuing with a concurrency limit below the browser
              limit (e.g., 3-4) gives the application control over which requests are dispatched first, while
              leaving connection headroom for other resource types. Domain sharding (serving assets from
              multiple subdomains) was the HTTP/1.1 workaround but is counterproductive with HTTP/2.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement an offline queue that reliably replays mutations when connectivity returns?</p>
            <p className="mt-2 text-sm">
              A: Detect offline state via navigator.onLine and the 'offline'/'online' window events. When
              offline, serialize each mutation to IndexedDB (using a library like idb for Promise-based access)
              with fields: id, timestamp, url, method, headers, body, retryCount, and idempotencyKey. On the
              'online' event, read all entries from IndexedDB sorted by timestamp. Replay each sequentially
              (not concurrently, to preserve ordering), attaching the idempotencyKey as a header so the server
              can detect and deduplicate replayed requests. If a replay fails with a retryable error (5xx,
              network error), increment retryCount and re-queue with exponential backoff. If it fails with a
              conflict (409), surface the conflict to the user for resolution. Delete successfully replayed
              entries from IndexedDB. Use the Background Sync API in a service worker for automatic replay
              even if the user has closed the tab.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
