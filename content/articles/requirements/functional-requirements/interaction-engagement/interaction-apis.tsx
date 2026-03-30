"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-interaction-apis",
  title: "Interaction APIs",
  description:
    "Comprehensive guide to designing and scaling interaction APIs covering like, comment, share, and follow endpoints with idempotency, rate limiting, async processing, and distributed system patterns for high-volume engagement systems.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "interaction-apis",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "api",
    "backend",
    "engagement",
    "rate-limiting",
    "idempotency",
    "distributed-systems",
  ],
  relatedTopics: ["engagement-tracking", "rate-limiting", "idempotency", "async-processing", "event-driven-architecture"],
};

export default function InteractionAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Interaction APIs provide backend endpoints for user engagement actions—likes, comments, shares, follows, saves, and reactions. These APIs form the backbone of social platforms, content sites, and community features, handling millions to billions of interactions daily. Well-designed interaction APIs balance low latency (users expect instant feedback) with durability (interactions must persist), consistency (counts must be accurate) with availability (system must handle traffic spikes).
        </p>
        <p>
          The scale of interaction APIs is staggering. Facebook processes 4.5 million likes per minute at peak. Twitter handles 6,000 tweets per second. YouTube receives 500 hours of video uploads per minute, each generating comments, likes, and shares. This scale demands distributed architectures with sharded databases, cached counters, async processing, and intelligent rate limiting. A single poorly optimized API endpoint can cascade into platform-wide outages during viral events.
        </p>
        <p>
          For staff and principal engineers, interaction API design involves distributed systems challenges. Idempotency ensures network retries don't create duplicate interactions. Rate limiting prevents abuse while allowing legitimate high-volume users. Async processing decouples user-facing latency from backend durability. Event publishing enables downstream systems (notifications, analytics, feed ranking) to react to interactions. The architecture must handle viral traffic spikes—10-100x normal load—without degradation. Monitoring and alerting detect issues before users notice.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>API Endpoint Design</h3>
        <p>
          RESTful interaction APIs use resource-oriented URLs with HTTP verbs. Like endpoints: POST /content/:id/like to create, DELETE /content/:id/like to remove. Comment endpoints: POST /content/:id/comments to create, GET /content/:id/comments to list, PUT /comments/:id to update, DELETE /comments/:id to remove. Follow endpoints: POST /users/:id/follow to follow, DELETE /users/:id/follow to unfollow. This RESTful approach provides intuitive, discoverable APIs.
        </p>
        <p>
          GraphQL provides alternative enabling clients to request exactly the data needed. Single mutation handles interaction: mutateInteraction(contentId, type, action). Query fetches interaction state with related data in single request: content &#123; id, likes &#123; count, userHasLiked &#125;, comments &#123; count, items &#125; &#125;. GraphQL reduces over-fetching and under-fetching but adds complexity in caching and rate limiting.
        </p>
        <p>
          RPC-style APIs use action-oriented endpoints: likeContent(contentId), createComment(contentId, body). This approach maps cleanly to backend services but loses RESTful discoverability. gRPC provides high-performance RPC with Protocol Buffers serialization, suitable for service-to-service communication but less common for client-facing APIs.
        </p>

        <h3 className="mt-6">Idempotency</h3>
        <p>
          Idempotency ensures that executing the same operation multiple times produces the same result as executing once. For interaction APIs, this means retrying a like request doesn't create duplicate likes. Idempotency is critical because networks are unreliable—clients retry failed requests, but the original request may have succeeded server-side.
        </p>
        <p>
          Idempotency keys provide client-generated unique identifiers for each operation. Client generates UUID, includes in Idempotency-Key header. Server stores key with operation result. If same key arrives again, server returns cached result without re-executing. Keys expire after TTL (24 hours typical) to prevent unbounded storage growth.
        </p>
        <p>
          Database-level idempotency uses unique constraints and upsert operations. Unique constraint on (user_id, content_id) prevents duplicate likes. Upsert (INSERT ... ON CONFLICT UPDATE) inserts new like or updates existing. This approach provides idempotency without explicit keys but requires careful error handling for constraint violations.
        </p>

        <h3 className="mt-6">Rate Limiting</h3>
        <p>
          Rate limiting protects APIs from abuse and ensures fair resource allocation. Limits vary by action type—likes allow higher volume (100-200 per minute) than comments (20-50 per minute) due to lower cost and spam risk. Limits also vary by user trust—new accounts have lower limits, established accounts higher limits.
        </p>
        <p>
          Token bucket algorithm allows bursting while enforcing average rate. Bucket holds N tokens, refills at constant rate. Each request consumes token. If bucket empty, request rejected. Token bucket allows short bursts (emptying bucket) while enforcing long-term average. Bucket size and refill rate tune burst tolerance and sustained rate.
        </p>
        <p>
          Sliding window rate limiting tracks requests in rolling time window. More accurate than fixed windows (which allow 2x burst at window boundaries) but requires more state. Implementation uses sorted set with request timestamps, removing expired entries. Redis sorted sets efficient for sliding window with ZREMRANGEBYSCORE and ZCARD commands.
        </p>

        <h3 className="mt-6">Async Processing</h3>
        <p>
          Async processing decouples user-facing latency from backend durability. API validates request, queues for processing, returns success immediately. Background worker processes queue, persists to database, publishes events. User sees instant feedback (optimistic update) while backend catches up. This pattern handles traffic spikes by buffering in queue.
        </p>
        <p>
          Message queues (Kafka, RabbitMQ, SQS) buffer interaction requests. Queue provides durability (survives worker crashes), backpressure (workers process at own pace), and fan-out (multiple downstream consumers). Queue retention (7-30 days typical) allows reprocessing for bug fixes or data recovery.
        </p>
        <p>
          Event sourcing stores interactions as immutable event stream. Each interaction creates event (UserLiked, UserCommented). Current state (like count, comment list) derived by replaying events. Event sourcing provides audit trail, enables temporal queries ("what was the count yesterday?"), and simplifies debugging. Trade-off is query complexity—requires materialized views for efficient reads.
        </p>

        <h3 className="mt-6">Event Publishing</h3>
        <p>
          Interaction events trigger downstream systems. Like events power notification generation ("John liked your post"), feed ranking (liked content signals interest), analytics (engagement metrics), and recommendations (similar content suggestions). Event publishing decouples interaction API from downstream consumers—API publishes event, consumers subscribe independently.
        </p>
        <p>
          Event schema captures interaction metadata: event_id (UUID), event_type (content.liked, comment.created), user_id, content_id, timestamp, and context (device_type, ip_address, referrer). Rich context enables sophisticated downstream processing—fraud detection uses IP and device, analytics segments by device type, recommendations use referrer source.
        </p>
        <p>
          Event delivery guarantees vary by use case. At-least-once delivery ensures events not lost but may duplicate—consumers must be idempotent. At-most-once delivery prevents duplicates but may lose events—acceptable for analytics, not for notifications. Exactly-once delivery ideal but expensive—requires distributed consensus. Most systems use at-least-once with idempotent consumers.
        </p>

        <h3 className="mt-6">Error Handling</h3>
        <p>
          Interaction APIs return standard HTTP status codes. 200/201 for success, 400 for invalid requests (missing fields, invalid values), 401 for unauthenticated, 403 for forbidden (user lacks permission), 404 for not found (content doesn't exist), 409 for conflict (already liked), 429 for rate limited, 500 for server errors. Consistent error codes enable client-side error handling.
        </p>
        <p>
          Error response body includes error code (machine-readable), message (human-readable), and details (field-level errors). Example: error: &#123; code: "RATE_LIMITED", message: "Too many requests", details: &#123; retry_after: 60 &#125; &#125;. Structured errors enable client-side logic (retry after delay) and user-facing messages ("Please wait a minute before trying again").
        </p>
        <p>
          Retry guidance helps clients handle transient errors. Include Retry-After header for 429 and 503 responses. Exponential backoff for 5xx errors—retry after 1s, 2s, 4s, 8s with jitter to prevent thundering herd. Idempotent operations safe to retry, non-idempotent operations require client-generated idempotency keys.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Interaction API architecture spans API gateway, request validation, async processing, database persistence, counter caching, and event publishing. Requests flow through gateway (authentication, rate limiting), to API service (validation, idempotency check), to queue (async buffering), to worker (database write, event publish). Response returns to client after validation, before async processing completes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/interaction-apis/interaction-api-architecture.svg"
          alt="Interaction API Architecture"
          caption="Figure 1: Interaction API Architecture — API gateway, validation, async processing, database, caching, and event publishing"
          width={1000}
          height={500}
        />

        <h3>API Gateway Layer</h3>
        <p>
          API gateway handles cross-cutting concerns: authentication (JWT validation, session lookup), rate limiting (token bucket per user/IP), request logging (for debugging and analytics), and routing (path-based to backend services). Gateway offloads concerns from backend services, enabling services to focus on business logic.
        </p>
        <p>
          Authentication validates user identity. JWT tokens decoded and verified (signature, expiration). Session-based auth looks up session in Redis. Authenticated user ID attached to request context for downstream services. Unauthenticated requests rejected with 401 unless endpoint allows anonymous access (viewing public content).
        </p>
        <p>
          Rate limiting at gateway protects entire API surface. Limits configured per endpoint, user tier, and IP. Gateway returns 429 Too Many Requests with Retry-After header when limits exceeded. Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) inform clients of their quota status.
        </p>

        <h3 className="mt-6">Request Validation</h3>
        <p>
          Validation layer checks request structure and semantics. Schema validation ensures required fields present, types correct, values in acceptable ranges. Business logic validation checks content exists, user has permission, interaction not duplicate. Validation failures return 400 Bad Request with field-level error details.
        </p>
        <p>
          Idempotency check looks up idempotency key in Redis. If key exists, return cached response without re-processing. If key new, proceed with processing and store result with key. Key TTL (24 hours) balances idempotency coverage with storage cost.
        </p>
        <p>
          Authorization checks user permission for action. Like/comment require content access. Follow requires target user visible to requester. Delete/update require ownership or admin privilege. Authorization failures return 403 Forbidden with generic message (don't reveal whether resource exists).
        </p>

        <h3 className="mt-6">Async Processing Pipeline</h3>
        <p>
          Queue ingestion receives validated interaction requests. Kafka topic partitioned by content_id or user_id for ordering. Partitioning ensures all interactions for same content process in order—critical for accurate count updates. Retention policy (7-30 days) allows reprocessing.
        </p>
        <p>
          Worker service consumes from queue, persists to database, updates counters, publishes events. Worker scales horizontally—more consumers increase throughput. Backpressure—workers process at own pace, queue buffers spikes. Worker handles retries for transient failures (database connection issues) with exponential backoff.
        </p>
        <p>
          Database write persists interaction record. Unique constraints prevent duplicates. Transaction ensures atomic writes—interaction record and counter update succeed or fail together. Write latency acceptable for async processing (10-100ms) since user already received success response.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/interaction-apis/idempotency-flow.svg"
          alt="Idempotency Flow"
          caption="Figure 2: Idempotency Flow — Client generates key, server checks cache, returns cached result or processes and stores"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Counter Caching</h3>
        <p>
          Redis caches interaction counts for fast retrieval. Atomic INCR/DECR operations update counters without race conditions. Counter keys follow pattern content:ID:likes, content:ID:comments. TTL on keys prevents unbounded growth for inactive content.
        </p>
        <p>
          Sharded counters handle viral content. Single Redis key limited to ~10K ops/sec. Viral content receiving millions of interactions requires sharding across multiple keys (content:ID:likes:shard0 through shard9). Hash user_id to determine shard—same user always hits same shard. Total count sums all shards.
        </p>
        <p>
          Async flush persists Redis counters to database periodically (every 1-5 minutes). This provides durability backup—if Redis fails, database has recent snapshot. Reconciliation job compares Redis and database counts, correcting any drift. Accept eventual consistency for public counts.
        </p>

        <h3 className="mt-6">Event Publishing</h3>
        <p>
          Event publisher emits interaction events to message bus. Kafka topic per event type (content.liked, comment.created) or single topic with event_type field. Event payload includes interaction metadata and context. Downstream consumers subscribe to topics of interest.
        </p>
        <p>
          Notification service consumes interaction events, generates notifications for content owners. Batching groups multiple interactions—"John and 49 others liked your post". Push notification for high-importance interactions (mentions, direct messages), email digest for low-priority.
        </p>
        <p>
          Analytics service aggregates interaction events for dashboards and business intelligence. Real-time aggregation powers trending detection. Batch aggregation powers historical analytics. Event enrichment adds user demographics, content metadata for segmentation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/interaction-apis/rate-limiting-architecture.svg"
          alt="Rate Limiting Architecture"
          caption="Figure 3: Rate Limiting Architecture — Token bucket, sliding window, and distributed rate limiting"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Interaction API design involves fundamental trade-offs between consistency, availability, latency, and durability. Understanding these trade-offs enables informed decisions aligned with platform requirements and user expectations.
        </p>

        <h3>Sync vs Async Processing</h3>
        <p>
          Sync processing persists interaction before returning response. Pros: Strong consistency—count accurate immediately, durability—interaction persisted before success returned. Cons: Higher latency (database round-trip), lower throughput (blocked on database), vulnerable to traffic spikes. Best for: Low-volume platforms, financial transactions requiring strong consistency.
        </p>
        <p>
          Async processing queues interaction, returns immediately. Pros: Low latency (no database wait), high throughput (queue buffers spikes), better availability (queue survives database outages). Cons: Eventual consistency (count lags), durability risk (queue loss before persist). Best for: High-volume social platforms, engagement actions where slight delay acceptable.
        </p>
        <p>
          Hybrid processing sync-writes to fast store (Redis), async-writes to durable store (database). Pros: Low latency, good durability (Redis persists), eventual consistency acceptable. Cons: Complexity (dual writes), Redis failure risk. Best for: Most production platforms—balances latency and durability.
        </p>

        <h3>Consistency Models</h3>
        <p>
          Strong consistency ensures all clients see same count simultaneously. Requires distributed locking or consensus. Pros: Accurate counts, no confusion. Cons: High latency (coordination overhead), lower availability (fails during partitions). Best for: Financial transactions, inventory management.
        </p>
        <p>
          Eventual consistency accepts temporary divergence. Clients may see slightly different counts briefly. Pros: Low latency (no coordination), high availability (works during partitions). Cons: Count confusion (user sees different count on refresh). Best for: Social engagement counts, where slight delay acceptable.
        </p>
        <p>
          Read-your-writes consistency ensures users see their own interactions immediately. Other users may see delayed counts. Pros: Personal consistency without global consistency cost. Cons: Implementation complexity (track pending actions). Best for: Social platforms—user sees their like immediately, others see eventually.
        </p>

        <h3>Rate Limiting Strategies</h3>
        <p>
          Per-user rate limiting tracks requests per user ID. Pros: Fair—each user gets quota, allows high-volume legitimate users. Cons: Requires authentication, users can create multiple accounts. Best for: Authenticated APIs, platforms with user accounts.
        </p>
        <p>
          Per-IP rate limiting tracks requests per IP address. Pros: Works for anonymous users, harder to circumvent. Cons: Shared IPs (NAT, corporate networks) penalized, VPNs bypass. Best for: Anonymous APIs, complement to per-user limiting.
        </p>
        <p>
          Global rate limiting tracks total requests across all users. Pros: Simple, protects overall system. Cons: No fairness—one user can consume entire quota. Best for: DDoS protection, complement to per-user limiting.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/interaction-apis/consistency-tradeoffs.svg"
          alt="Consistency Trade-offs"
          caption="Figure 4: Consistency Trade-offs — Strong, eventual, and read-your-writes consistency comparison"
          width={1000}
          height={450}
        />

        <h3>Database Selection</h3>
        <p>
          Relational databases (PostgreSQL, MySQL) provide ACID transactions, complex queries, mature tooling. Pros: Strong consistency, joins for complex queries, mature ecosystem. Cons: Horizontal scaling challenging, write throughput limited. Best for: Moderate scale, complex queries, transactional requirements.
        </p>
        <p>
          NoSQL databases (Cassandra, DynamoDB) provide horizontal scaling, high write throughput. Pros: Linear horizontal scaling, high write throughput, flexible schema. Cons: Limited query flexibility, eventual consistency typical. Best for: High scale, simple queries, write-heavy workloads.
        </p>
        <p>
          Time-series databases (ClickHouse, TimescaleDB) optimize for time-ordered data. Pros: Efficient time-range queries, compression for time-series data. Cons: Specialized use case, less flexible for general queries. Best for: Interaction analytics, audit logs, metrics storage.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use async processing:</strong> Queue interactions, return immediately, process asynchronously. Use Redis for fast counter updates, async flush to database. Accept eventual consistency for public counts.
          </li>
          <li>
            <strong>Implement idempotency:</strong> Require idempotency keys for write operations. Store keys in Redis with 24-hour TTL. Return cached response for duplicate keys. Use database unique constraints as backup.
          </li>
          <li>
            <strong>Rate limit appropriately:</strong> Per-user limits (100-200 likes/min, 20-50 comments/min). Per-IP limits for anonymous endpoints. Return 429 with Retry-After header. Include rate limit headers in responses.
          </li>
          <li>
            <strong>Validate thoroughly:</strong> Schema validation for required fields, types, ranges. Business logic validation for content existence, permissions, duplicates. Return 400 with field-level error details.
          </li>
          <li>
            <strong>Publish events:</strong> Emit interaction events to message bus. Include rich context (user, content, device, timestamp). Enable downstream systems (notifications, analytics, recommendations).
          </li>
          <li>
            <strong>Shard viral counters:</strong> Detect high-velocity content, automatically shard counters across multiple Redis keys. Hash user_id to shard. Sum shards for total count.
          </li>
          <li>
            <strong>Handle errors gracefully:</strong> Return appropriate HTTP status codes. Include error code, message, and details. Provide retry guidance (Retry-After header, exponential backoff).
          </li>
          <li>
            <strong>Monitor comprehensively:</strong> Track request rate, error rate, latency percentiles (p50, p95, p99), queue depth, worker throughput. Alert on anomalies. Dashboard for real-time visibility.
          </li>
          <li>
            <strong>Design for scale:</strong> Horizontal scaling for API services and workers. Database sharding by content_id or user_id. Caching at multiple levels (CDN, application, Redis).
          </li>
          <li>
            <strong>Document thoroughly:</strong> API documentation with examples, error codes, rate limits. OpenAPI/Swagger spec for discoverability. Changelog for versioning.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Sync database writes:</strong> Writing every interaction directly to database before response. Solution: Async processing with queue, Redis counters for fast updates.
          </li>
          <li>
            <strong>No idempotency:</strong> Duplicate interactions from network retries. Solution: Idempotency keys with Redis cache, database unique constraints.
          </li>
          <li>
            <strong>Single counter key:</strong> Single Redis key for all content becomes bottleneck. Solution: Shard counters for high-velocity content, detect and auto-shard viral content.
          </li>
          <li>
            <strong>No rate limiting:</strong> API vulnerable to abuse and traffic spikes. Solution: Multi-layer rate limiting (per-user, per-IP, global) with appropriate limits per action type.
          </li>
          <li>
            <strong>Poor error handling:</strong> Generic error messages, no retry guidance. Solution: Structured errors with code, message, details. Retry-After header for rate limits.
          </li>
          <li>
            <strong>No monitoring:</strong> Issues undetected until users complain. Solution: Comprehensive monitoring (rate, errors, latency, queue depth). Alerting on anomalies.
          </li>
          <li>
            <strong>Ignoring eventual consistency:</strong> Assuming counts always accurate. Solution: Design for eventual consistency, reconcile periodically, accept slight lag for public counts.
          </li>
          <li>
            <strong>No backpressure:</strong> Traffic spikes overwhelm database. Solution: Queue-based buffering, workers process at own pace, scale workers based on queue depth.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Like API</h3>
        <p>
          Twitter's like API uses async processing with Redis counters. POST /tweets/:id/likers returns immediately after queueing. Redis INCR updates counter, async flush to Manhattan (Twitter's distributed database). Rate limit: 100 likes per minute. Idempotency via unique constraint on (user_id, tweet_id). Event published to notification service and feed ranking.
        </p>

        <h3 className="mt-6">Facebook Comment API</h3>
        <p>
          Facebook's comment API uses hybrid fan-out. Comment created via GraphQL mutation, stored in TAO (Facebook's graph store). Counter updates cached in TAO, async flush to HBase. Comments fan-out to viewer feeds based on affinity. Rate limit: 50 comments per hour for new accounts, higher for established. Real-time delivery via WebSocket to active viewers.
        </p>

        <h3 className="mt-6">Instagram Follow API</h3>
        <p>
          Instagram's follow API uses sharded counters for celebrities. POST /users/:id/follow creates follow relationship in database, updates follower/following counts. Celebrity accounts (1M+ followers) sharded across multiple Redis keys. Event published to notification service and feed generation. Rate limit: 200 follows per hour, stricter for new accounts.
        </p>

        <h3 className="mt-6">YouTube Share API</h3>
        <p>
          YouTube's share API tracks share destination and attribution. POST /videos/:id/share with destination parameter (Twitter, Facebook, copy link). Share count updated in Redis, async flush to Spanner. Event published to analytics for click-through tracking. Rate limit: 100 shares per hour. No idempotency required—multiple shares valid.
        </p>

        <h3 className="mt-6">LinkedIn Engagement API</h3>
        <p>
          LinkedIn's engagement API combines multiple interactions in single GraphQL endpoint. Mutate engagement (like, celebrate, support) via single mutation. Counters cached in Redis with async flush to Voldemort (LinkedIn's distributed key-value store). Events power feed ranking and professional analytics. Rate limit: 100 reactions per minute. Enterprise accounts have higher limits.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent likes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use atomic Redis INCR/DECR operations—Redis single-threaded, guarantees atomicity. Database-level: unique constraint on (user_id, content_id) prevents duplicates. Upsert operation (INSERT ... ON CONFLICT UPDATE) handles race conditions. For viral content, shard counters across multiple Redis keys, hash user_id to shard. Accept eventual consistency for public counts, reconcile periodically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale interaction APIs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Async processing via message queue (Kafka, RabbitMQ). API validates, queues, returns immediately. Workers process queue at own pace. Redis counters for fast updates, async flush to database. Database sharding by content_id or user_id. Horizontal scaling for API services and workers. Caching at multiple levels (CDN, application, Redis). Auto-scaling based on queue depth and request rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement idempotency?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client generates UUID, includes in Idempotency-Key header. Server checks Redis for key. If exists, return cached response. If new, process request, store result with key (24-hour TTL). Database unique constraints provide backup idempotency. For operations without explicit keys, use natural keys (user_id, content_id, action_type) with upsert operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rate limit interactions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Token bucket algorithm at API gateway. Per-user limits (100-200 likes/min, 20-50 comments/min). Per-IP limits for anonymous endpoints. Redis stores token bucket state (tokens, last_refill). Each request consumes token, rejected if empty. Return 429 with Retry-After header. Include rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining) in responses.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle viral traffic spikes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Queue-based buffering absorbs spikes—queue depth increases, workers process at steady pace. Auto-scale workers based on queue depth. Shard counters for viral content—detect high-velocity content, automatically split across multiple Redis keys. Cache aggressively at CDN and application layer. Implement backpressure—rate limit when queue depth exceeds threshold.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure event delivery?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> At-least-once delivery with idempotent consumers. Kafka provides durability (replicated log, survives broker failures). Consumers track processed offsets, commit after successful processing. Retries for transient failures with exponential backoff. Dead letter queue for permanently failed events. Monitoring for consumer lag, alert when lag exceeds threshold.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://engineering.fb.com/2015/07/29/core-data/tao-the-power-of-the-graph/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Engineering — TAO: The Power of the Graph
            </a>
          </li>
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/a/2013/new-tweets-per-second-record-and-how"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — Scaling Twitter API
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/builders-library/making-retry-safe-with-idempotent-api-operations/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Builders Library — Making Retry Safe with Idempotent APIs
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/docs/management/patterns/rate-limiting/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — Rate Limiting Patterns
            </a>
          </li>
          <li>
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/patterns-of-distributed-systems/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Patterns of Distributed Systems
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
