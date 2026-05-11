"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-request-batching-system",
  title: "Design a Request Batching System",
  description:
    "Production-grade request batching that coalesces multiple individual requests into single batch to reduce network overhead and improve throughput.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "request-batching-system",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "batching",
    "coalescing",
    "throughput",
    "network-optimization",
    "graphql",
  ],
  relatedTopics: [
    "request-deduplication-system",
    "rate-limited-autocomplete",
    "frontend-caching-layer",
  ],
};

export default function RequestBatchingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Page renders 10 components. Each loads user profile: GET /users/1, GET /users/2, ..., GET /users/10. Naive: 10 HTTP requests. HTTP overhead: 10 connections, 10 request headers, 10 response headers = significant. Better: batch. Collect all 10 requests in 10ms window. Send single POST /batch with array of request objects. Server processes batch, returns 10 responses. Result: 1 HTTP request instead of 10. 10x bandwidth savings (headers, connections). Lower latency (one round-trip instead of many).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Key challenges: (1) Batching window (too long = latency for early requests; too short = miss batching opportunities). Sweet spot: 10-50ms. (2) Ordered responses (client must match responses to requests—use request IDs). (3) Partial failure (some requests succeed, others fail—handle separately). (4) Server-side assembly (receive batch, process in parallel, return results in order).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases: GraphQL batch queries (multiple queries in one request), REST bulk endpoints (POST /batch), RPC batch calls (multiple function calls in one message). At scale (millions of components), batching significantly improves throughput and reduces server load.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Many similar requests made concurrently. Backend supports batch endpoint. Batching window 10-50ms acceptable. Request IDs available for matching responses. Partial failure handling needed.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Request Queuing:</strong> Queue individual requests in-memory.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Batch Window:</strong> Wait N milliseconds (10-50ms) for more
            requests.
          </HighlightBlock>
          <li>
            <strong>Batch Execution:</strong> Send all queued requests in single HTTP
            call.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Response Routing:</strong> Deserialize batch response and route
            individual results back to requesters.
          </HighlightBlock>
          <li>
            <strong>Error Handling:</strong> Route errors back to individual
            requesters.
          </li>
          <li>
            <strong>Max Batch Size:</strong> Limit batch size (e.g., 100 requests)
            to avoid huge payloads.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Latency:</strong> Batching adds ~10-50ms delay but saves network
            round-trips.
          </HighlightBlock>
          <li>
            <strong>Throughput:</strong> Reduces HTTP requests, improves server
            throughput.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Memory:</strong> Queue bounded to prevent memory leaks.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Batch window expires and only 1 request queued → send single-item batch
            (inefficient but correct).
          </li>
          <li>
            Max batch size reached → send batch immediately, queue remaining requests.
          </li>
          <li>
            Batch endpoint fails → all requests in batch fail. Route errors to
            requesters.
          </li>
          <li>Individual request within batch fails → route error to that requester only.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Maintain a queue of pending requests. When request arrives, add to queue and
          start batch timer (if not running). When timer fires or max size reached,
          serialize all queued requests into single batch request.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Execute batch HTTP
          call. Deserialize response (array of results). Route each result back to
          corresponding requester via callback/Promise. Clear queue and start fresh.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Queue</h3>
        <p>
          Store pending requests before batching.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Queue Entry:</strong> Object with id, request, callback/promise, timeout fields.
          </li>
          <li>
            <strong>Storage:</strong> Array or Map. Map allows fast lookup by ID.
          </li>
          <li>
            <strong>Max Size:</strong> Bounded (e.g., 1000 entries) to prevent memory
            leaks.
          </li>
          <li>
            <strong>Overflow:</strong> When full, reject new requests or evict oldest.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Batch Window</h3>
        <p>
          Wait for more requests to arrive before sending batch.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Window Duration:</strong> Configurable (typical 10-50ms). Balance
            between latency and batching efficiency.
          </HighlightBlock>
          <li>
            <strong>Timer:</strong> Start on first request. Fire after duration.
          </li>
          <li>
            <strong>Efficiency Threshold:</strong> Optionally fire early if queue
            reaches size threshold (e.g., 50 items).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Serialization</h3>
        <p>
          Transform individual requests into batch format.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Format:</strong> {`POST /batch { requests: [{id: 1, ...}, {id: 2, ...}] }`}.
          </li>
          <li>
            <strong>ID Assignment:</strong> Assign sequential IDs (1, 2, 3...) to
            track responses.
          </li>
          <li>
            <strong>Deduplication:</strong> Optionally deduplicate identical requests
            in batch.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Batch Execution</h3>
        <p>
          Execute batch HTTP request.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Endpoint:</strong> Dedicated batch endpoint (e.g., /batch, /rpc).
          </li>
          <li>
            <strong>Method:</strong> Typically POST for batch of mutations/queries.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout:</strong> Set timeout for batch (e.g., 30s). Fail all
            requests if timeout.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Response Deserialization</h3>
        <p>
          Parse batch response and route results.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Format:</strong> {`{ results: [{id: 1, data: ...}, {id: 2, error: ...}] }`}.
          </li>
          <li>
            <strong>Matching:</strong> Match result ID to original request ID.
          </li>
          <li>
            <strong>Callback:</strong> Call requester callback with (data, error).
          </li>
          <li>
            <strong>Promise Resolution:</strong> If using Promises, resolve/reject
            with result.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling</h3>
        <HighlightBlock as="p" tier="important">
          Handle batch failures and individual request errors.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Batch Failure:</strong> Network error, timeout, 5xx. Fail all
            requests in batch.
          </HighlightBlock>
          <li>
            <strong>Individual Error:</strong> Request validation fails, returns 4xx
            in response. Fail only that request.
          </li>
          <li>
            <strong>Partial Failure:</strong> Some requests succeed, some fail. Route
            both.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request-Level Timeout</h3>
        <p>
          Individual requests may timeout before batch executes.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Timeout Per Request:</strong> Each request has configurable
            timeout (e.g., 30s).
          </HighlightBlock>
          <li>
            <strong>Early Failure:</strong> If request times out before batch window,
            fail immediately (don't wait for batch).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Caching Integration</h3>
        <p>
          Batching works with caching to further reduce requests.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Cache Check:</strong> Before batching, check cache for each
            request.
          </li>
          <li>
            <strong>Partial Batch:</strong> Only batch requests not in cache.
          </li>
          <li>
            <strong>Cache Update:</strong> After batch response, update cache with
            results.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Deduplication</h3>
        <p>
          Multiple identical requests within same batch can be deduplicated.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Deduplication Key:</strong> Hash request params.
          </li>
          <li>
            <strong>Merge Requests:</strong> Send only once in batch, return same
            result to all.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <p>
          Track batching effectiveness.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Batch Size:</strong> Average requests per batch.
          </li>
          <li>
            <strong>Efficiency:</strong> Requests sent vs requests without batching.
          </li>
          <li>
            <strong>Latency Impact:</strong> Additional latency from batching window.
          </li>
          <li>
            <strong>Savings:</strong> HTTP requests saved, bandwidth saved.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Window</h3>
        <HighlightBlock as="p" tier="crucial">
          Dynamically adjust batch window based on request rate. High rate → longer
          window to batch more. Low rate → shorter window to avoid latency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">GraphQL Perspective</h3>
        <HighlightBlock as="p" tier="important">
          GraphQL is inherently batchable — query multiple fields in single request.
          Apollo Client provides batching plugin.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">DataLoader Pattern</h3>
        <HighlightBlock as="p" tier="important">
          DataLoader is a popular library for batching. Queue loads, batch at end of
          event loop tick.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="important">
          Mock batch endpoint. Verify requests are batched, responses routed correctly,
          errors handled.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Batch Window & Size</h3>
        <HighlightBlock as="p" tier="important">
          Dynamic adjustment: high request rate → longer window to batch more.
          Low rate → shorter to minimize latency. Max batch size reached → send
          immediately. Balance: smaller window = lower latency but less efficient.
          Larger window = efficient but higher latency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Caching & Deduplication</h3>
        <p>
          Combine: cache + batching + dedup. Request in cache → return immediately
          (no batch needed). Multiple identical requests → deduplicate (one request).
          Remaining requests → batch. Multiplicative effect: much fewer HTTP calls.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Partial Failures & Error Propagation</h3>
        <HighlightBlock as="p" tier="important">
          Batch succeeds partially: request 1 succeeds, request 2 fails. Route both
          appropriately. Or fail all? Both strategies used. Recommend: route
          individual results (request 1 succeeds, request 2 fails). Caller handles
          failures per request.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">GraphQL Perspective</h3>
        <p>
          GraphQL inherently batchable—query multiple fields in single request.
          Apollo Client provides batching link. DataLoader pattern batches at
          resolver level. GraphQL + DataLoader = powerful combination. REST needs
          explicit batching endpoint.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Batching Behavior</h3>
        <HighlightBlock as="p" tier="important">
          Test: rapid requests coalesced into single batch. Test: batch sent when
          window expires. Test: batch sent when max size reached. Test: partial
          failures routed correctly. Property-based: generate request sequences,
          verify batching optimal.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Metrics</h3>
        <HighlightBlock as="p" tier="important">
          Track: avg batch size, batch formation latency, HTTP requests saved.
          If avg batch = 5, saving 80% HTTP overhead. Monitor: max batch size
          reached frequency (high = need to adjust). Alert on slow batch responses.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Queue Management & Backpressure</h3>
        <HighlightBlock as="p" tier="crucial">
          Unbounded queue grows if batch processing slow. Implement backpressure:
          when queue reaches threshold, reject new requests or apply queue
          discipline (priority queue, fairness). Prevents memory explosion.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Optimization</h3>
        <p>
          Typical: 10-50ms batch window, 50-100 max size. At 1M users, batching
          reduces HTTP from millions/sec to thousands/sec. Massive infrastructure
          savings. Justify complexity with ROI numbers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity vs Benefit</h3>
        <p>
          Batching adds complexity: queue management, window timing, partial
          failures. Only worthwhile if: high request frequency OR large payloads
          (HTTP overhead significant). For simple apps with few requests, not
          needed. Measure first, optimize second.
        </p>
      </section>

      <section>
        <h2>Batching Strategies & Comparison</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/request-batching-system.svg"
          alt="Request batching: without vs with batching and batching strategies diagram"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: batching is a micro-queueing problem. You trade added per-request latency (window) for fewer round-trips, better throughput, and less header/handshake overhead.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The production nuance is response demuxing: map each sub-request to its result (including partial failures) and keep per-request timeouts and cancellation semantics intact.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Batching composes with caching and deduplication: cache hits should bypass the batch, and identical in-window requests should merge to avoid double work.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Latency vs Efficiency</h3>
        <HighlightBlock as="p" tier="crucial">
          Longer batch window increases batching efficiency but adds latency for
          individual requests.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity</h3>
        <HighlightBlock as="p" tier="important">
          Batching adds complexity (queue management, timer, deserialization). Only
          worth it for high-frequency request patterns.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backend Support</h3>
        <HighlightBlock as="p" tier="important">
          Backend must support batch endpoint. Standard REST doesn't support well —
          better in GraphQL or JSON-RPC.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">All-or-Nothing vs Partial</h3>
        <HighlightBlock as="p" tier="important">
          Batch failure can fail all requests or only affected ones. Partial is more
          resilient.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">DataLoader pattern batches at resolver level. Testing must verify batching optimal under various request patterns. Monitoring batch size, formation latency, and HTTP</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">savings essential. Real-world systems balance complexity with ROI—only implement if request frequency high. Integration with caching layer ensures dedup + batch don't conflict. Understanding when batching helps (many requests, large payloads) vs when it adds unnecessary complexity is essential judgment for engineers architecting systems.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
