"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-request-deduplication-system",
  title: "Design a Request Deduplication System",
  description:
    "Production-grade deduplication that coalesces identical in-flight requests, returns cached results to subscribers, and handles failures atomically.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "request-deduplication-system",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "deduplication",
    "request-coalescing",
    "caching",
    "subscribers",
    "atomicity",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "frontend-caching-layer",
    "request-batching-system",
  ],
};

export default function RequestDeduplicationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Page renders 5 components. All request GET /user/123 (user profile). Naive: 5 HTTP requests sent. Server receives 5x load. Bandwidth wasted. Better: deduplicate. When first component requests /user/123, HTTP request sent. Second component requests /user/123 before response arrives—coalesce into first request. When response completes, all 5 components receive data. Result: 1 request instead of 5. Huge efficiency gain, especially at scale (1000s of components).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key mechanism: maintain in-flight request map (URL → Promise). When request initiated, check map. If already in-flight, return existing promise (subscribe to it). All subscribers receive same result when promise resolves. If request fails, all fail atomically. Request cancellation: if last subscriber unsubscribes (component unmounts), abort request (save bandwidth).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Challenge: distinguishing in-flight deduplication (while request pending) vs caching (after request completes). Deduplication is narrower scope (only identical concurrent requests). Caching is broader (any subsequent access reuses response). Both important: deduplication reduces concurrent load, caching reduces total requests over time.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Multiple components fetch same resource. Requests identified by cache key (URL, params). Identical keys deduplicated while in-flight. Promise-based architecture. Request/response deduplication critical for performance at scale.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Request Coalescing:</strong> Multiple identical requests
            consolidated into one.
          </li>
          <li>
            <strong>Subscriber Notification:</strong> All subscribers receive result
            when completed.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Failure Handling:</strong> All subscribers notified of failure
            atomically.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout:</strong> If request exceeds timeout, fail all subscribers.
          </HighlightBlock>
          <li>
            <strong>Cache Key Generation:</strong> Derive stable cache key from
            request params.
          </li>
          <li>
            <strong>Cleanup:</strong> Remove deduplication entry when request
            completes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Latency:</strong> Deduplication transparent to callers. No
            additional latency.
          </HighlightBlock>
          <li>
            <strong>Memory:</strong> Deduplication entries cleaned up promptly.
          </li>
          <li>
            <strong>Throughput:</strong> Reduces server load by eliminating redundant
            requests.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">Request completes while new subscriber arrives → return cached result immediately.</HighlightBlock>
          <HighlightBlock as="li" tier="important">Request fails → all subscribers fail, even those added after failure.</HighlightBlock>
          <li>Cache key collision (rare but possible) → return wrong data to some users.</li>
          <li>Subscriber removed before result arrives → cleanup and remove from notification list.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Maintain a Map&lt;cacheKey, InFlightRequest&gt; of currently in-flight
          requests. When a request arrives, hash the params to generate cache key.
          Check if request already in-flight.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">If yes, add caller to subscriber list.
          If no, initiate request and add subscriber. When request completes,
          notify all subscribers with result or error. Remove from in-flight map.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Key Generation</h3>
        <p>
          Derive a stable key from request params so identical requests hash to same
          key.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Method 1:</strong> Serialize params to JSON and hash. Fast but
            vulnerable to key collisions.
          </li>
          <li>
            <strong>Method 2:</strong> Use URL as key (for HTTP requests). Simple but
            assumes params encoded in URL.
          </li>
          <li>
            <strong>Method 3:</strong> Manually construct key from known param fields
            (safest, explicit).
          </li>
          <li>
            <strong>Stability:</strong> Key must be stable (same params → same key
            always).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">In-Flight Request Tracking</h3>
        <p>
          Track requests currently being processed.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Request State:</strong> {`{promise, subscribers[], status, result, error}`}.
          </li>
          <li>
            <strong>Subscribers:</strong> Array of callback functions to notify on
            completion.
          </li>
          <li>
            <strong>Status:</strong> pending, success, error.
          </li>
          <li>
            <strong>Storage:</strong> Map&lt;cacheKey, InFlightRequest&gt;.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Lifecycle</h3>
        <p>
          The flow from request arrival to completion.
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Generate cache key from params.</li>
          <li>Check if in-flight map contains key.</li>
          <li>
            If yes: add callback to subscribers, return immediately (or await Promise).
          </li>
          <li>If no: initiate HTTP request, add to in-flight map.</li>
          <li>On success: update status, store result, notify all subscribers.</li>
          <li>On error: update status, store error, notify all subscribers.</li>
          <li>Remove from in-flight map.</li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Subscriber Notification</h3>
        <p>
          Notify all subscribers of request completion.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Success:</strong> Call each subscriber with (data, null).
          </li>
          <li>
            <strong>Error:</strong> Call each subscriber with (null, error).
          </li>
          <li>
            <strong>Order:</strong> Call subscribers in registration order (FIFO).
          </li>
          <li>
            <strong>Error Handling:</strong> If subscriber callback throws, catch and
            log. Don't break other subscribers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout Handling</h3>
        <HighlightBlock as="p" tier="important">
          Requests may hang indefinitely. Implement timeout to fail gracefully.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Timeout Duration:</strong> Configurable per request type (default
            30s).
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Implementation:</strong> Start timer on request initiation. If
            timeout fires before completion, abort request and fail.
          </HighlightBlock>
          <li>
            <strong>Abort:</strong> Use AbortController to cancel in-flight HTTP.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Subscriber Cleanup</h3>
        <p>
          Handle subscribers being removed (e.g., component unmounts) mid-request.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Unsubscribe:</strong> Provide function to remove subscriber from
            list.
          </li>
          <li>
            <strong>Cleanup:</strong> On unmount, unsubscribe to prevent calling
            unmounted component.
          </li>
          <li>
            <strong>Last Subscriber:</strong> If all subscribers removed, optionally
            abort request.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Race Condition Prevention</h3>
        <p>
          Prevent races when adding subscribers vs completing request.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Scenario:</strong> Subscriber arrives exactly when request
            completes.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Solution:</strong> Check request status before adding to
            subscribers. If already complete, call subscriber immediately with cached
            result.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Key Collision</h3>
        <p>
          Hash collisions (different params → same key) cause wrong data served to users.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Prevention:</strong> Use strong hash function. Or use non-hash approach
            (serialize params directly).
          </li>
          <li>
            <strong>Detection:</strong> Validate result params match request params.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Recovery:</strong> If collision detected, treat as cache miss.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <p>
          Track deduplication effectiveness.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Deduplication Rate:</strong> % of requests that were deduplicated.
          </li>
          <li>
            <strong>Subscriber Count:</strong> Average subscribers per deduplicated
            request.
          </li>
          <li>
            <strong>Bandwidth Saved:</strong> Bytes saved by avoiding duplicate requests.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Promise-Based API</h3>
        <HighlightBlock as="p" tier="important">
          Return Promise instead of callback. Caller awaits single Promise shared
          across subscribers.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">With Caching Layer</h3>
        <HighlightBlock as="p" tier="important">
          Deduplication and caching are separate concerns. Deduplication handles
          in-flight requests. Caching stores completed results. Both together avoid
          redundant requests.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Leak Prevention</h3>
        <HighlightBlock as="p" tier="important">
          Ensure subscribers removed from list and timers cleared on cleanup.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="crucial">
          Mock HTTP requests. Simulate concurrent subscribers. Test timeout, failure,
          and race conditions.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Global Deduplication vs Per-Component</h3>
        <HighlightBlock as="p" tier="important">
          Per-component deduplication local but misses cross-component duplication.
          Global deduplication (across all components) more effective but requires
          shared state. Implement globally via central request cache. At 1M users,
          global deduplication prevents millions of redundant requests daily.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Distributed Deduplication</h3>
        <HighlightBlock as="p" tier="important">
          With multiple backend servers or service workers, deduplication cache
          must be shared. Use Redis or distributed cache. Coordinate across
          instances. Cache invalidation complex in distributed settings.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Key Collisions</h3>
        <HighlightBlock as="p" tier="important">
          Hash collisions rare but possible. Different params → same key → wrong
          data served. Mitigate: use strong hash (SHA256), validate result params
          match request params, treat collision as cache miss, implement collision
          detection.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring Deduplication Effectiveness</h3>
        <p>
          Track: deduplication rate (% of requests deduplicated), avg subscriber
          count per request, bandwidth saved. At 90% dedup rate, very effective.
          If low, indicates low request reuse—maybe coalescing not needed.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout & Failure Handling</h3>
        <HighlightBlock as="p" tier="crucial">
          If deduplication request times out, all subscribers fail atomically. Some
          prefer per-subscriber timeout (first subscriber waits 5s, second waits 2s
          if added later). Complex but more resilient.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Race Conditions</h3>
        <p>
          Test subscriber arriving exactly when request completes. Test unsubscribe
          mid-completion. Use property-based testing to generate concurrent
          scenarios. Verify no race conditions in state transitions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Lessons</h3>
        <HighlightBlock as="p" tier="important">
          Common: deduplication cache grows unbounded. Implement TTL and LRU
          eviction. Another: cache key instability (params serialized differently
          in different places → different keys). Normalize params carefully.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Caching Layer</h3>
        <p>
          Deduplication handles in-flight requests. Caching handles completed
          results. Together: same request already in cache → return immediately
          (no dedup needed). Avoid double caching complexity.
        </p>
      </section>

      <section>
        <h2>Deduplication Mechanism</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/request-deduplication.svg"
          alt="Request deduplication: in-flight request sharing mechanism diagram"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: deduplication is an in-flight map keyed by a normalized request identity. It turns N concurrent identical fetches into 1 network call with N subscribers.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Correctness hinges on key stability (canonical param serialization) and lifecycle management (cleanup on resolve/reject, TTL/LRU to prevent leaks).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat abort semantics carefully: if one subscriber cancels, don&rsquo;t abort the shared request unless all subscribers have canceled (ref counting).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity vs Savings</h3>
        <HighlightBlock as="p" tier="important">
          Deduplication adds code complexity. Only worth it if concurrent requests
          common (e.g., in server-side rendering or rapid component mounting).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Affinity</h3>
        <HighlightBlock as="p" tier="important">
          Identical requests must hash to same key. If params order differs, may miss
          deduplication. Normalize params before hashing.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Failure Propagation</h3>
        <HighlightBlock as="p" tier="crucial">
          One request failure fails all subscribers. Some may prefer retrying
          individually. Allow per-subscriber retry logic.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Monitoring deduplication effectiveness (rate, subscriber count) essential. Real-world systems must handle concurrent subscriber arrival, timeout</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">failures where all subscribers fail atomically, and memory leaks from unbounded cache growth. Understanding interaction with caching layer (dedup for in-flight, cache for completed) prevents complexity and duplication. This is foundational pattern for building efficient distributed systems.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
