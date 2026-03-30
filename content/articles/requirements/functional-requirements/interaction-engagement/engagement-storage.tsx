"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-engagement-storage",
  title: "Engagement Storage",
  description:
    "Comprehensive guide to implementing engagement storage covering database schema design, counter caching strategies, sharding for viral content, write optimization, and analytics aggregation for high-volume interaction systems.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "engagement-storage",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "storage",
    "database",
    "backend",
    "caching",
    "sharding",
  ],
  relatedTopics: ["interaction-apis", "caching", "engagement-tracking", "database-scaling"],
};

export default function EngagementStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Engagement Storage</strong> persists user interactions—likes, comments, shares, views, saves—efficiently while enabling fast count retrieval and aggregation for analytics. This is a fundamental backend challenge: how to store billions of interactions while supporting both high-velocity writes (during viral events) and low-latency reads (for display to millions of users).
        </p>
        <p>
          Engagement data has unique characteristics: it is write-heavy (every interaction creates a record), read-heavy (counts displayed on every page view), time-series (interactions arrive in chronological order), and requires both real-time counts and historical analytics. The storage architecture must balance consistency (accurate counts) with availability (fast reads) and partition tolerance (handling viral traffic spikes).
        </p>
        <p>
          For staff and principal engineers, engagement storage involves database schema design optimized for interaction patterns, counter caching strategies using Redis, sharding approaches for viral content, write optimization through batching and async processing, and analytics aggregation for creator dashboards. The architecture must handle 10x traffic spikes during viral events without degradation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Storage Requirements</h3>
        <p>
          Engagement storage must satisfy multiple requirements:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Write Throughput:</strong> Handle thousands of interactions per second during normal operation, millions during viral events. Write path must be optimized for append-only workloads.
          </li>
          <li>
            <strong>Read Latency:</strong> Sub-100ms count retrieval for display. Users expect instant feedback when viewing content. Caching is essential.
          </li>
          <li>
            <strong>Accuracy:</strong> Counts must be approximately accurate. Exact accuracy is less important than consistency—users tolerate slight delays but not wild fluctuations.
          </li>
          <li>
            <strong>Scalability:</strong> Schema must support billions of interactions. Partitioning and sharding are required at scale.
          </li>
          <li>
            <strong>Analytics:</strong> Support aggregation queries for creator dashboards (daily engagement, trends, demographics). Requires pre-computed aggregates.
          </li>
        </ul>

        <h3 className="mt-6">Data Model</h3>
        <p>
          Engagement data typically uses two complementary models:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Event Stream:</strong> Each interaction is an immutable event (user_id, content_id, type, timestamp). Append-only, time-ordered. Used for analytics and audit trails. Query pattern: "Show all interactions for content X" or "Show user Y's interaction history".
          </li>
          <li>
            <strong>Aggregated Counts:</strong> Pre-computed totals (content_id → like_count, comment_count). Updated incrementally on each interaction. Used for display. Query pattern: "Get count for content X".
          </li>
        </ul>

        <h3 className="mt-6">Consistency Models</h3>
        <p>
          Different consistency levels for different use cases:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Strong Consistency:</strong> Count reflects all writes immediately. Required for: User's own interaction state (did I like this?). Achieved through synchronous writes.
          </li>
          <li>
            <strong>Eventual Consistency:</strong> Count may lag by seconds. Acceptable for: Public display counts. Users tolerate slight delays. Achieved through async aggregation.
          </li>
          <li>
            <strong>Causal Consistency:</strong> User sees their own writes immediately, others' writes eventually. Best of both worlds. Achieved through read-your-writes guarantees.
          </li>
        </ul>

        <h3 className="mt-6">Write Optimization</h3>
        <p>
          Techniques for handling high write volume:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Batching:</strong> Group multiple writes into single database operation. Reduces round trips. Trade-off: Slight latency increase for batch accumulation.
          </li>
          <li>
            <strong>Async Processing:</strong> Queue writes, process asynchronously. Smooths traffic spikes. Trade-off: Eventual consistency.
          </li>
          <li>
            <strong>Write-Behind Cache:</strong> Update cache immediately, flush to database asynchronously. Combines fast writes with durability. Trade-off: Data loss risk on cache failure.
          </li>
          <li>
            <strong>Idempotency:</strong> Design writes to be safely retried. Use unique IDs for deduplication. Essential for handling network retries.
          </li>
        </ul>

        <h3 className="mt-6">Read Optimization</h3>
        <p>
          Techniques for fast count retrieval:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Counter Cache:</strong> Store counts in Redis. INCR/DECR operations are atomic and fast. TTL-based expiration prevents stale data.
          </li>
          <li>
            <strong>Pre-computed Aggregates:</strong> Store daily/hourly aggregates. Query aggregates instead of raw events. Reduces query complexity.
          </li>
          <li>
            <strong>CDN Caching:</strong> Cache counts at CDN edge for global distribution. TTL varies by content velocity. Viral content: 30s, normal content: 5min.
          </li>
          <li>
            <strong>Read Replicas:</strong> Distribute read load across replicas. Primary handles writes, replicas handle reads. Replication lag acceptable for counts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Engagement storage architecture involves write path optimization, counter caching, and analytics aggregation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-storage/storage-architecture.svg"
          alt="Engagement Storage Architecture"
          caption="Figure 1: Engagement Storage Architecture — Write path, counter caching, async flush, and read path"
          width={1000}
          height={500}
        />

        <h3>Write Path Architecture</h3>
        <p>
          Optimized for high-throughput interaction storage:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>API Layer:</strong> Validates interaction (user authenticated, content exists, not duplicate). Returns immediately after queueing.
          </li>
          <li>
            <strong>Message Queue:</strong> Kafka or similar buffers writes. Smooths traffic spikes, enables async processing. Partitions by content_id for ordering.
          </li>
          <li>
            <strong>Stream Processor:</strong> Consumes queue, writes to database. Batches writes for efficiency. Handles retries and dead-letter queue for failures.
          </li>
          <li>
            <strong>Database:</strong> Time-series optimized storage. Partitioned by date or content_id. Indexes on (content_id, type) for count queries.
          </li>
        </ul>

        <h3 className="mt-6">Counter Cache Architecture</h3>
        <p>
          Redis-based counter management:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Key Structure:</strong> content:ID:likes, content:ID:comments. Namespace by interaction type for flexibility.
          </li>
          <li>
            <strong>Atomic Operations:</strong> INCR on like, DECR on unlike. Redis guarantees atomicity even under concurrent access.
          </li>
          <li>
            <strong>Async Flush:</strong> Periodic job reads Redis counts, updates database. Frequency: every 1-5 minutes. Handles cache failures gracefully.
          </li>
          <li>
            <strong>Sharding:</strong> Viral content sharded across multiple Redis keys. content:ID:likes:shard0 through shard9. Aggregate for total.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-storage/counter-sharding.svg"
          alt="Counter Sharding for Viral Content"
          caption="Figure 2: Counter Sharding — Distributing viral content counts across multiple Redis shards"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Analytics Aggregation</h3>
        <p>
          Pre-computed aggregates for creator dashboards:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Hourly Aggregates:</strong> Sum interactions by hour. Stored in analytics table. Query: "Show engagement for last 24 hours".
          </li>
          <li>
            <strong>Daily Aggregates:</strong> Roll up hourly into daily. Long-term storage. Query: "Show engagement trend for last 30 days".
          </li>
          <li>
            <strong>Dimension Breakdown:</strong> Aggregate by geography, device, traffic source. Enables detailed analytics. Stored in wide table or document store.
          </li>
          <li>
            <strong>Real-time Layer:</strong> Last hour data from stream processing. Combined with historical aggregates for complete view.
          </li>
        </ul>

        <h3 className="mt-6">Viral Content Handling</h3>
        <p>
          Special handling for high-velocity content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Velocity Detection:</strong> Monitor interaction rate. When threshold exceeded (1000/min), trigger viral handling.
          </li>
          <li>
            <strong>Automatic Sharding:</strong> Create additional counter shards. Distribute writes across shards using hash(user_id).
          </li>
          <li>
            <strong>Cache Warming:</strong> Pre-populate CDN cache with anticipated traffic. Reduce origin load.
          </li>
          <li>
            <strong>Rate Limiting:</strong> Protect database from overload. Queue excess writes, process when capacity available.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Engagement storage design involves balancing consistency, availability, and complexity.
        </p>

        <h3>Database Selection</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Database</th>
                <th className="text-left p-2 font-semibold">Write Throughput</th>
                <th className="text-left p-2 font-semibold">Query Flexibility</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">PostgreSQL</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High (SQL)</td>
                <td className="p-2">Moderate scale, complex queries</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Cassandra</td>
                <td className="p-2">Very High</td>
                <td className="p-2">Low (limited queries)</td>
                <td className="p-2">High scale, time-series data</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">DynamoDB</td>
                <td className="p-2">High</td>
                <td className="p-2">Medium</td>
                <td className="p-2">AWS ecosystem, auto-scaling</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">MongoDB</td>
                <td className="p-2">High</td>
                <td className="p-2">High (document queries)</td>
                <td className="p-2">Flexible schema, horizontal scaling</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-storage/consistency-tradeoffs.svg"
          alt="Consistency Trade-offs"
          caption="Figure 3: Consistency Trade-offs — Strong vs eventual consistency for different use cases"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Consistency vs Availability</h3>
        <p>
          <strong>Strong Consistency:</strong> Count always accurate. Requires synchronous writes. Risk: Higher latency, lower availability during partitions. Best for: User's own interaction state.
        </p>
        <p>
          <strong>Eventual Consistency:</strong> Count may lag. Async writes, high availability. Risk: Users see stale counts briefly. Best for: Public display counts.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Strong consistency for user state (did I like?), eventual for public counts. Most platforms use this approach.
        </p>

        <h3 className="mt-6">Sharding Strategies</h3>
        <p>
          <strong>By Content ID:</strong> All interactions for content on same shard. Efficient for count queries. Risk: Hot shards for viral content.
        </p>
        <p>
          <strong>By User ID:</strong> User's interactions on same shard. Efficient for user history queries. Risk: Content count queries require scatter-gather.
        </p>
        <p>
          <strong>By Time:</strong> Interactions partitioned by date. Efficient for time-range queries. Risk: Current partition becomes hot spot.
        </p>
        <p>
          <strong>Recommendation:</strong> Hybrid sharding—content_id for hot path (count display), user_id for analytics (user history).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Redis for counters:</strong> INCR/DECR are atomic and fast. Async flush to database for durability.
          </li>
          <li>
            <strong>Implement idempotency:</strong> Unique interaction IDs prevent duplicates on retry. Critical for network failures.
          </li>
          <li>
            <strong>Shard viral content:</strong> Detect high-velocity content, automatically shard counters. Prevents Redis bottleneck.
          </li>
          <li>
            <strong>Pre-compute aggregates:</strong> Hourly/daily aggregates for analytics. Don't query raw events for dashboards.
          </li>
          <li>
            <strong>Use message queues:</strong> Buffer writes during spikes. Smooths database load, enables async processing.
          </li>
          <li>
            <strong>Implement backpressure:</strong> Rate limit writes when database overloaded. Queue excess, process when capacity available.
          </li>
          <li>
            <strong>Monitor replication lag:</strong> For read replica setups, monitor lag. Route reads to primary if lag exceeds threshold.
          </li>
          <li>
            <strong>Plan for data retention:</strong> Define retention policy (keep raw events 90 days, aggregates forever). Archive or delete old data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Direct database writes:</strong> Writing every interaction directly to database. Solution: Use message queue for buffering and async processing.
          </li>
          <li>
            <strong>No counter caching:</strong> Counting from database on every request. Solution: Redis counters with async flush.
          </li>
          <li>
            <strong>Ignoring viral content:</strong> Single counter key for all content. Solution: Automatic sharding for high-velocity content.
          </li>
          <li>
            <strong>No idempotency:</strong> Duplicate interactions on retry. Solution: Unique interaction IDs with deduplication.
          </li>
          <li>
            <strong>Querying raw events:</strong> Aggregating raw events for analytics dashboards. Solution: Pre-computed hourly/daily aggregates.
          </li>
          <li>
            <strong>No retention policy:</strong> Storing raw events forever. Solution: Define retention policy, archive or delete old data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Instagram Like Storage</h3>
        <p>
          Instagram stores likes in Cassandra partitioned by media_id. Counter cache in Redis with async flush. Handles billions of likes per day. Uses eventual consistency for public like counts.
        </p>
        <p>
          <strong>Key Innovation:</strong> Time-series partitioning—each month is a separate table, enabling efficient archival of old data.
        </p>

        <h3 className="mt-6">YouTube View Counting</h3>
        <p>
          YouTube uses a multi-layer counting system: real-time counter for display, batch verification for accuracy. View count freezes at 301 for verification during viral events. Combats view manipulation through fraud detection.
        </p>
        <p>
          <strong>Key Innovation:</strong> View count verification—pauses at 301 to verify legitimacy before continuing, preventing fake view manipulation.
        </p>

        <h3 className="mt-6">Twitter Engagement Storage</h3>
        <p>
          Twitter stores tweets and engagements separately. Engagements (likes, retweets) stored in Manhattan (distributed database). Counter cache with eventual consistency. Handles millions of engagements per minute during events.
        </p>
        <p>
          <strong>Key Innovation:</strong> Manhattan database—custom distributed database optimized for Twitter's write-heavy engagement workload.
        </p>

        <h3 className="mt-6">TikTok Viral Handling</h3>
        <p>
          TikTok handles extreme viral scenarios (millions of interactions per minute). Uses automatic sharding, write-behind caching, and aggressive rate limiting. Analytics aggregated in near real-time for creator dashboards.
        </p>
        <p>
          <strong>Key Innovation:</strong> Automatic viral detection—system detects high-velocity content and automatically applies sharding and caching optimizations.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you count likes at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Redis for counter cache with INCR/DECR operations. Async flush to database every 1-5 minutes for durability. Accept eventual consistency for public counts (slight delay acceptable). For viral content, shard counters across multiple Redis keys (content:ID:likes:shard0-9) and aggregate for total. This handles millions of likes per minute.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store billions of interactions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use NoSQL database (Cassandra, DynamoDB) for horizontal scaling. Partition by content_id or time (monthly partitions). Implement TTL for old raw events (90 days). Pre-compute aggregates for analytics. Use compression for storage efficiency. Archive old data to cold storage (S3) for compliance while keeping recent data hot.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle viral content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect viral content by monitoring interaction velocity (likes/minute). When threshold exceeded, automatically shard counters across multiple Redis keys. Use write-behind caching to buffer database writes. Implement rate limiting to protect database. Pre-warm CDN cache with anticipated traffic. Scale read replicas for increased read load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure data durability?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Write to message queue first (durable), then async processing to database. Redis counter cache with periodic flush to database (every 1-5 min). Implement write-ahead logging for critical operations. Use replication for database (primary + replicas). Accept slight data loss risk for counter cache (last few minutes) in exchange for performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design analytics aggregation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pre-compute aggregates at multiple granularities: hourly (last 7 days), daily (last 90 days), monthly (forever). Store in separate analytics table. Update aggregates in stream processing pipeline. For creator dashboards, query aggregates not raw events. Combine recent real-time data with historical aggregates for complete view.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent duplicate interactions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Generate unique interaction ID client-side (UUID). Include in write request. Database enforces unique constraint on (user_id, content_id, type, interaction_id). Idempotent writes—retry with same ID doesn't create duplicate. Check existence before write or use upsert operation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://redis.io/docs/data-types/strings/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — INCR/DECR for Counter Management
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — DynamoDB Core Components
            </a>
          </li>
          <li>
            <a
              href="https://cassandra.apache.org/doc/latest/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Cassandra — Documentation
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
              href="https://www.smashingmagazine.com/tag/database/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Database Architecture Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
