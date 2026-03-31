"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-idempotency",
  title: "Idempotency",
  description:
    "Comprehensive guide to implementing idempotency covering idempotency keys, deduplication strategies, distributed locking, retry mechanisms, and ensuring exactly-once semantics in distributed payment and transaction systems.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "idempotency",
  version: "extensive",
  wordCount: 6100,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "idempotency",
    "reliability",
    "backend",
    "distributed-systems",
    "api-design",
  ],
  relatedTopics: [
    "payment-processing",
    "retry-mechanisms",
    "distributed-locking",
    "event-sourcing",
  ],
};

export default function IdempotencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Idempotency ensures that performing the same operation multiple times
          produces the same result as performing it once. In distributed
          systems, this property is critical for reliability—network timeouts,
          server crashes, and client retries are inevitable. Without
          idempotency, a retry after a network timeout could charge a customer
          twice, create duplicate orders, or send multiple confirmation emails.
          For staff and principal engineers, idempotency design involves
          trade-offs between consistency, performance, and complexity across
          service boundaries.
        </p>
        <p>
          The challenge of idempotency extends beyond simple deduplication.
          Operations may have side effects (sending emails, updating inventory,
          charging cards) that must not repeat. Distributed systems introduce
          complexity—multiple service instances, shared state, concurrent
          requests with the same idempotency key. The system must handle race
          conditions (two requests with same key arriving simultaneously), stale
          requests (retry after long delay), and key collisions (different
          operations accidentally using same key). Storage and TTL management
          prevent unbounded growth while ensuring keys remain valid long enough
          for all legitimate retries.
        </p>
        <p>
          For staff and principal engineers, idempotency architecture involves
          distributed systems patterns. Idempotency keys must be generated
          client-side (UUID v4) to ensure uniqueness across retries. Storage
          must be fast (Redis for sub-millisecond lookups) and durable (database
          for audit trail). Distributed locking prevents concurrent processing
          of same-key requests. The system must distinguish between safe retries
          (network timeout) and actual duplicates (user double-click).
          Monitoring must detect idempotency key collisions, storage growth, and
          retry patterns that indicate underlying issues.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Idempotency Key Generation</h3>
        <p>
          Idempotency keys are unique identifiers for operations, generated
          client-side before the first request. UUID v4 (random) is the
          standard—122 bits of randomness provides negligible collision
          probability. Keys should be generated per logical operation, not per
          HTTP request. For checkout, one key for the entire checkout operation,
          not separate keys for each step. For payments, one key per charge
          attempt, allowing retries of the same charge.
        </p>
        <p>
          Key scope determines what constitutes a "duplicate." Narrow scope
          (exact same request) allows similar operations (charge $50, then
          charge $50 again for different order). Wide scope (same customer, same
          amount) may incorrectly deduplicate legitimate duplicates. Best
          practice: key represents the logical operation, not the request.
          Include operation type in key namespace (payment:uuid, order:uuid) to
          prevent cross-operation collisions.
        </p>
        <p>
          Key lifecycle begins at generation, ends at TTL expiration. Typical
          TTL: 24 hours for payments (covers retry window), 7 days for order
          creation (longer fulfillment window). TTL must exceed maximum retry
          window—keys expire before all retries complete causes duplicate
          operations. Store key with operation result, not just existence—retry
          returns cached result, not error.
        </p>

        <h3 className="mt-6">Deduplication Strategies</h3>
        <p>
          Store-and-return caches the operation result with the idempotency key.
          First request processes normally, stores result (success or error),
          returns result. Duplicate requests return cached result without
          re-processing. Storage format: key → (status, result, timestamp).
          Status indicates processing state (pending, completed, failed).
          Pending state prevents concurrent duplicates—second request waits or
          fails immediately.
        </p>
        <p>
          Conditional processing checks existence before processing. If key
          exists, return cached result. If not, process and store. Race
          condition: two requests check simultaneously, both see "not exists,"
          both process. Solution: distributed lock or atomic "set if not exists"
          operation (Redis SETNX). Conditional processing requires
          atomicity—check and store must be indivisible.
        </p>
        <p>
          Optimistic locking allows concurrent checks, detects conflicts at
          commit. Each operation has version number. Commit fails if version
          changed (another operation completed). Retry with latest state.
          Optimistic locking suits low-conflict scenarios (rare duplicate
          requests). Pessimistic locking (acquire lock before processing) suits
          high-conflict scenarios but reduces throughput.
        </p>

        <h3 className="mt-6">Distributed Locking</h3>
        <p>
          Distributed locks prevent concurrent processing of same-key requests
          across service instances. Redis-based locks use SETNX (set if not
          exists) with TTL. Lock key: idempotency-lock:uuid. Value: instance ID
          (for debugging). TTL: operation timeout + buffer (30 seconds for
          typical API). Lock acquisition: SETNX returns 1 (acquired) or 0
          (already locked). Lock release: delete key or let TTL expire.
        </p>
        <p>
          Lock contention handling determines behavior when lock unavailable.
          Fail-fast: return 409 Conflict immediately, client retries with
          backoff. Wait-and-retry: block until lock available (with timeout),
          then process. Queue: add request to queue, process when lock free,
          return result asynchronously. Fail-fast suits low-latency
          requirements. Queue suits batch processing.
        </p>
        <p>
          Lock safety prevents deadlocks and orphaned locks. TTL ensures lock
          expires even if instance crashes (TTL &gt; operation timeout). Lock
          owner verification prevents wrong instance from releasing lock (store
          instance ID, verify on release). RedLock algorithm (multiple Redis
          instances) provides lock durability across Redis failures—majority
          must grant lock.
        </p>

        <h3 className="mt-6">Retry Mechanisms</h3>
        <p>
          Client-side retry handles transient failures (network timeout, 5xx
          errors). Retry strategy: exponential backoff (1s, 2s, 4s, 8s, max 30s)
          with jitter (±20% to prevent thundering herd). Same idempotency key on
          all retries—server returns cached result if original succeeded. Max
          retries: 3-5 for payments (prevent harassment), higher for background
          jobs.
        </p>
        <p>
          Server-side retry handles downstream failures (payment gateway
          timeout, database connection). Retry queue stores failed operations
          with retry count, next retry time. Backoff per operation type: payment
          gateway (exponential, max 5 retries), email (linear, max 3 retries).
          Idempotency ensures retry doesn&apos;t duplicate—same key, same
          result.
        </p>
        <p>
          Retry classification distinguishes safe vs. unsafe retries. Safe
          retries: network timeout, 5xx errors (operation status unknown).
          Unsafe retries: 4xx errors (client error, don&apos;t retry without
          fix). Idempotency handles safe retries—duplicate requests return same
          result. Unsafe retries require client action (update card, fix
          request).
        </p>

        <h3 className="mt-6">Storage and TTL Management</h3>
        <p>
          Idempotency storage requires fast lookups (sub-millisecond) and
          automatic expiration. Redis is ideal—SET with EX for TTL, GET for
          lookup. Key format: idempotency:uuid. Value: JSON with status, result,
          timestamp. Memory management: Redis eviction (allkeys-lru) prevents
          OOM, but explicit TTL is safer. Database storage provides durability
          (audit trail) but slower lookups—use Redis for hot cache, database for
          cold storage.
        </p>
        <p>
          TTL selection balances storage cost with retry window. Payments: 24-48
          hours (covers customer retry, bank processing). Orders: 7 days (covers
          fulfillment window). Subscriptions: 30 days (covers billing cycle
          retry). TTL must exceed maximum expected retry window—expired keys
          cause duplicate operations. Monitor key expiration rate—high
          expiration before use indicates TTL too short.
        </p>
        <p>
          Storage cleanup prevents unbounded growth. TTL-based expiration (Redis
          EXPIRE) automatically removes old keys. Batch cleanup job for database
          storage—delete keys older than TTL. Key compaction—store only
          essential fields (status, result hash) to reduce memory. Archive old
          keys to cold storage (S3) for audit compliance before deletion.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Idempotency architecture spans client key generation, middleware
          interception, distributed locking, and result caching. Client
          generates UUID per operation, includes in Idempotency-Key header.
          Middleware intercepts request, checks cache for key. If found, return
          cached result. If not, acquire lock, process operation, store result,
          release lock. Distributed locking prevents concurrent same-key
          processing across instances.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/idempotency/idempotency-architecture.svg"
          alt="Idempotency Architecture"
          caption="Figure 1: Idempotency Architecture — Client key generation, middleware interception, distributed locking, and result caching"
          width={1000}
          height={500}
        />

        <h3>Client-Side Key Generation</h3>
        <p>
          Client generates idempotency key before first request. UUID v4 using
          crypto.getRandomValues() (browser) or crypto.randomUUID() (Node.js).
          Store key with operation context (pending checkout ID, pending order
          ID). Include key in Idempotency-Key header for all requests (initial
          and retries). Key persists across page reloads (localStorage) for
          checkout recovery.
        </p>
        <p>
          Retry logic uses same key for all attempts. Network timeout: retry
          with same key, server returns cached result if original succeeded.
          Application error (4xx): don&apos;t retry with same key—error
          indicates invalid request, fix before retry. Server error (5xx): retry
          with same key, exponential backoff.
        </p>
        <p>
          Key scope per logical operation, not per HTTP request. Checkout
          operation: one key for entire checkout (shipping + payment + order).
          Payment operation: one key per charge (retry same charge, new key for
          new charge). Subscription: one key per billing cycle (retry failed
          charge, new key for next cycle).
        </p>

        <h3 className="mt-6">Middleware Interception</h3>
        <p>
          Idempotency middleware intercepts requests before business logic.
          Extract Idempotency-Key header. Validate key format (UUID). Query
          cache (Redis) for key. If found: return cached result (status, body,
          headers). If not found: pass to business logic, intercept response,
          store result, return response. Middleware is framework-agnostic
          (Express, FastAPI, Spring).
        </p>
        <p>
          Response caching stores complete response: status code, body, relevant
          headers (Content-Type, custom headers). Exclude dynamic headers (Date,
          X-Request-ID). Cache format: JSON with status, body, headers,
          timestamp. Timestamp enables TTL calculation, audit trail (when
          operation completed).
        </p>
        <p>
          Error handling in middleware: cache errors too (4xx, 5xx). Duplicate
          request returns cached error (same error as original). Exception:
          transient errors (503, 504) may not be cached—allow retry to succeed.
          Configuration per error code: cache 400-499 (client errors, retry
          won&apos;t help), don&apos;t cache 503/504 (transient, retry may
          succeed).
        </p>

        <h3 className="mt-6">Distributed Lock Implementation</h3>
        <p>
          Redis-based locking uses SETNX with TTL. Lock key:
          idempotency:lock:uuid. Lock value: instance ID + timestamp
          (debugging). Lock acquisition: SET key value NX EX 30 (set if not
          exists, 30s TTL). Return value indicates success (1) or failure (0).
          Lock release: Lua script verifies owner, deletes key (prevents wrong
          instance from releasing).
        </p>
        <p>
          Lock contention handling: fail-fast returns 409 Conflict with
          Retry-After header. Client retries with exponential backoff.
          Wait-and-retry blocks (with timeout) until lock available. Queue-based
          adds request to queue, processes when lock free, notifies client
          (webhook, polling). Selection depends on latency requirements and
          client capabilities.
        </p>
        <p>
          Lock monitoring tracks lock acquisition time, hold time, contention
          rate. Alert on high contention (many requests waiting for same key).
          Alert on long hold times (operation timeout, potential deadlock).
          Alert on lock failures (Redis unavailable, fallback to local locking).
          Dashboard shows idempotency hit rate, lock wait time, retry rate.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/idempotency/idempotency-flow.svg"
          alt="Idempotency Flow"
          caption="Figure 2: Idempotency Flow — Key lookup, lock acquisition, processing, and result caching"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Result Caching and Retrieval</h3>
        <p>
          Result cache stores operation outcome with idempotency key. Cache
          structure: key → (status, result, timestamp, ttl). Status: pending
          (processing), completed (success), failed (error). Pending state
          prevents concurrent duplicates—second request waits or fails.
          Completed/failed states return cached result immediately.
        </p>
        <p>
          Cache retrieval returns exact cached response. Status code preserved
          (200 for success, 400 for validation error). Body preserved (payment
          confirmation, error details). Headers preserved (Content-Type,
          idempotency metadata). Response includes Idempotency-Status header
          (first-request vs. cached-response) for debugging.
        </p>
        <p>
          Cache invalidation happens on TTL expiration. TTL starts at operation
          completion, not request receipt. Typical TTL: 24-48 hours for
          payments, 7 days for orders. Expired key treated as new request
          (process normally). Cache eviction (LRU) for memory pressure—persist
          to database before eviction for audit compliance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/idempotency/retry-strategies.svg"
          alt="Retry Strategies"
          caption="Figure 3: Retry Strategies — Exponential backoff, jitter, and max retry limits"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Idempotency design involves trade-offs between consistency, latency,
          complexity, and storage. Understanding these trade-offs enables
          informed decisions aligned with reliability requirements and
          operational capabilities.
        </p>

        <h3>Storage: Redis vs. Database</h3>
        <p>
          Redis for idempotency cache. Pros: Sub-millisecond lookups, automatic
          TTL expiration, atomic operations (SETNX). Cons: Volatile
          (memory-based), cost for large caches, potential data loss on restart.
          Best for: Hot cache, high-throughput APIs, short TTL (hours to days).
        </p>
        <p>
          Database for idempotency storage. Pros: Durable (disk-based),
          queryable (audit trail), no memory limits. Cons: Slower lookups
          (milliseconds), manual TTL cleanup, connection overhead. Best for:
          Audit compliance, long TTL (weeks to months), low-throughput APIs.
        </p>
        <p>
          Hybrid: Redis cache + database persistence. Pros: Fast lookups,
          durable audit trail, best of both. Cons: Complexity (write to both,
          handle failures), higher cost. Best for: Production payment systems,
          high-reliability requirements.
        </p>

        <h3>Locking: Pessimistic vs. Optimistic</h3>
        <p>
          Pessimistic locking (acquire lock before processing). Pros: Prevents
          all conflicts, simple mental model. Cons: Reduced throughput
          (serialization), lock contention under load, deadlock risk. Best for:
          High-conflict scenarios (same key requested frequently), critical
          operations (payments).
        </p>
        <p>
          Optimistic locking (check version at commit). Pros: Higher throughput
          (parallel processing), no lock overhead. Cons: Retry on conflict
          (wasted work), complex conflict resolution. Best for: Low-conflict
          scenarios (rare duplicate requests), read-heavy workloads.
        </p>
        <p>
          Hybrid: optimistic for reads, pessimistic for writes. Pros: Balances
          throughput with safety. Cons: More complex implementation. Best for:
          Most production systems—reads parallel, writes serialized.
        </p>

        <h3>TTL: Short vs. Long</h3>
        <p>
          Short TTL (1-24 hours). Pros: Lower storage cost, faster cleanup,
          reduced collision risk. Cons: May expire before all retries complete,
          causes duplicate operations. Best for: Low-latency operations (API
          calls), short retry windows.
        </p>
        <p>
          Long TTL (7-30 days). Pros: Covers all retry scenarios, prevents
          duplicates from late retries. Cons: Higher storage cost, more key
          collisions (UUID space exhaustion risk). Best for: Long-running
          operations (fulfillment), subscription billing.
        </p>
        <p>
          Adaptive TTL based on operation type. Payments: 48 hours. Orders: 7
          days. Subscriptions: 30 days. Pros: Optimized per use case. Cons: More
          complex configuration. Best for: Production systems with multiple
          operation types.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/idempotency/storage-comparison.svg"
          alt="Storage Comparison"
          caption="Figure 4: Storage Comparison — Redis, database, and hybrid approaches"
          width={1000}
          height={450}
        />

        <h3>Key Generation: Client vs. Server</h3>
        <p>
          Client-generated keys (UUID v4). Pros: Same key on all retries, no
          server coordination, works with load balancing. Cons: Client must
          implement UUID generation, key collisions possible (buggy client).
          Best for: Most APIs, payment processing, order creation.
        </p>
        <p>
          Server-generated keys (sequential, UUID). Pros: Guaranteed uniqueness,
          server controls key format. Cons: Different key per request
          (can&apos;t deduplicate retries), requires coordination. Best for:
          Internal services, batch processing.
        </p>
        <p>
          Hybrid: client suggests key, server validates/augments. Pros: Client
          retry support, server uniqueness guarantee. Cons: More complex
          protocol. Best for: High-security scenarios (financial transactions).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Generate keys client-side:</strong> UUID v4 using crypto
            API. Store with operation context. Include in Idempotency-Key
            header. Same key for all retries. Persist across page reloads
            (localStorage).
          </li>
          <li>
            <strong>Use Redis for hot cache:</strong> SET with EX for TTL. GET
            for lookup. SETNX for locking. Sub-millisecond latency. Automatic
            expiration. Monitor memory usage.
          </li>
          <li>
            <strong>Implement distributed locking:</strong> Redis SETNX with
            TTL. Lock key per idempotency key. Fail-fast or wait-and-retry on
            contention. Monitor lock contention, hold time.
          </li>
          <li>
            <strong>Cache complete responses:</strong> Status code, body,
            headers. Exclude dynamic headers (Date). Include Idempotency-Status
            header for debugging. Cache errors too (4xx, 5xx).
          </li>
          <li>
            <strong>Set appropriate TTL:</strong> Payments: 24-48 hours. Orders:
            7 days. Subscriptions: 30 days. TTL &gt; max retry window. Monitor
            expiration rate.
          </li>
          <li>
            <strong>Handle concurrent requests:</strong> Distributed lock
            prevents race conditions. Pending state indicates processing. Second
            request waits or fails. Release lock on completion.
          </li>
          <li>
            <strong>Implement retry logic:</strong> Exponential backoff (1s, 2s,
            4s, 8s). Jitter (±20%) prevents thundering herd. Same key on
            retries. Max 3-5 retries for payments.
          </li>
          <li>
            <strong>Monitor idempotency:</strong> Hit rate (cached vs. new).
            Lock contention rate. Retry rate. Storage growth. Alert on anomalies
            (high collision, high retry).
          </li>
          <li>
            <strong>Persist for audit:</strong> Database storage for compliance.
            Archive before deletion. Queryable audit trail (who, what, when).
            Retention policy (7 years for financial).
          </li>
          <li>
            <strong>Document idempotency:</strong> API docs specify idempotent
            operations. Key format, TTL, behavior. Examples for clients. Error
            codes (409 Conflict for lock contention).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No idempotency for payments:</strong> Network retries create
            duplicate charges. Solution: Idempotency keys for all payment
            operations. Same key on retries.
          </li>
          <li>
            <strong>Server-generated keys:</strong> Different key per request,
            can&apos;t deduplicate. Solution: Client-generated keys, same key
            for retries.
          </li>
          <li>
            <strong>TTL too short:</strong> Key expires before retry completes,
            duplicate operation. Solution: TTL &gt; max retry window. Monitor
            expiration rate.
          </li>
          <li>
            <strong>No distributed locking:</strong> Concurrent same-key
            requests both process. Solution: Redis SETNX locking. Pending state
            prevents duplicates.
          </li>
          <li>
            <strong>Caching only success:</strong> Errors not cached, retry
            succeeds incorrectly. Solution: Cache all responses (success and
            errors). Exception: transient 503/504.
          </li>
          <li>
            <strong>Memory unbounded:</strong> Keys never expire, OOM. Solution:
            TTL-based expiration. Monitor memory. Eviction policy.
          </li>
          <li>
            <strong>Wrong retry classification:</strong> Retrying 4xx errors
            (won&apos;t succeed). Solution: Retry only safe errors (timeout,
            5xx). Fix client errors before retry.
          </li>
          <li>
            <strong>No monitoring:</strong> Idempotency issues undetected.
            Solution: Monitor hit rate, contention, retry rate. Alert on
            anomalies.
          </li>
          <li>
            <strong>Lock deadlocks:</strong> Lock never released, requests block
            forever. Solution: TTL on locks. Lock owner verification. Deadlock
            detection.
          </li>
          <li>
            <strong>Key collisions:</strong> Different operations use same key.
            Solution: Namespace keys (payment:uuid, order:uuid). UUID v4 for
            uniqueness.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Payment Idempotency</h3>
        <p>
          Stripe requires Idempotency-Key header for all POST requests. Key
          stored with response. Retry with same key returns cached response.
          TTL: 24 hours. Keys scoped to endpoint (charge key ≠ refund key).
          Dashboard shows idempotency key usage. Client libraries auto-generate
          keys for retries.
        </p>

        <h3 className="mt-6">Amazon Order Deduplication</h3>
        <p>
          Amazon generates order ID client-side (UUID). Same order ID on retry
          prevents duplicate orders. Distributed locking prevents concurrent
          same-ID orders. Order ID persisted in localStorage—recover abandoned
          checkout. TTL: 30 days (covers fulfillment window). Audit trail in
          DynamoDB.
        </p>

        <h3 className="mt-6">PayPal Retry Logic</h3>
        <p>
          PayPal uses idempotency keys for payment execution. Failed payment
          (insufficient funds) can be retried with same key. Key stored with
          payment state (pending, completed, failed). TTL: 72 hours (covers
          customer funding account). Retry with different card = new key.
        </p>

        <h3 className="mt-6">Uber Ride Requests</h3>
        <p>
          Uber generates request ID client-side. Same ID on retry prevents
          duplicate ride requests. Lock prevents concurrent same-ID requests.
          TTL: 1 hour (ride completion window). Request ID includes trip context
          (pickup, dropoff, fare). Retry after network timeout returns cached
          driver assignment.
        </p>

        <h3 className="mt-6">Netflix Subscription Billing</h3>
        <p>
          Netflix uses idempotency for monthly billing. Same key per billing
          cycle. Failed charge retried (exponential backoff, max 5 retries). Key
          stored with charge state. TTL: 60 days (covers retry window + grace
          period). Account updater service updates expired cards, retries with
          same key.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement idempotency for payment APIs?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client generates UUID v4, includes in
              Idempotency-Key header. Server checks Redis for key. If found,
              return cached response. If not, acquire distributed lock (SETNX),
              process payment, store result (status, response, timestamp),
              release lock, return response. TTL: 24-48 hours. Database
              persistence for audit. Retry with same key returns cached result.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle concurrent requests with same idempotency
              key?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Distributed locking prevents concurrent
              processing. First request acquires lock (SETNX), processes,
              releases lock. Second request: if lock held, fail-fast (409
              Conflict) or wait-and-retry. Pending state in cache indicates
              processing—second request polls or waits. Lock TTL prevents
              deadlocks (30 seconds). Monitor lock contention.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you choose idempotency key TTL?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> TTL must exceed maximum retry window.
              Payments: 24-48 hours (covers customer retry, bank processing).
              Orders: 7 days (covers fulfillment). Subscriptions: 30 days
              (covers billing cycle retry). Monitor expiration rate—high
              expiration before use indicates TTL too short. Balance storage
              cost with retry coverage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle idempotency storage at scale?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Redis for hot cache (sub-millisecond lookups,
              automatic TTL). Database for persistence (audit compliance). Write
              to both synchronously, read from Redis. Cache miss: read from
              database, populate Redis. Eviction: LRU for memory pressure,
              archive to cold storage before deletion. Shard Redis by key prefix
              for horizontal scaling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement retry logic with idempotency?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client retries on transient errors (timeout,
              5xx). Same idempotency key on all retries. Exponential backoff
              (1s, 2s, 4s, 8s) with jitter (±20%). Max 3-5 retries for payments.
              Server returns cached result if original succeeded. Don&apos;t
              retry 4xx errors (client error, fix before retry).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent idempotency key collisions?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> UUID v4 provides 122 bits of
              randomness—collision probability negligible. Namespace keys by
              operation type (payment:uuid, order:uuid). Client generates keys
              using crypto API (not Math.random). Server validates key format
              (UUID regex). Monitor collision rate—high collision indicates
              buggy client (reusing keys incorrectly).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/api/idempotent_requests"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Idempotent Requests Documentation
            </a>
          </li>
          <li>
            <a
              href="https://tools.ietf.org/html/rfc7231#section-4.2.2"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7231 — Idempotent Methods
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/commands/setnx/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — SETNX Command Documentation
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Idempotent Receiver Pattern
            </a>
          </li>
          <li>
            <a
              href="https://github.com/redis/redis-doc/blob/master/docs/manual/patterns/distributed-locks.md"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — Distributed Locks Pattern
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-apis/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Builders Library — Making Retries Safe with Idempotent APIs
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
