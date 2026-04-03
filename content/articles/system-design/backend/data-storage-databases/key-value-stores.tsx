"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-key-value-stores-complete",
  title: "Key-Value Stores",
  description:
    "Comprehensive guide to key-value stores: architecture, scaling patterns, caching strategies, and when to use key-value databases over other data stores.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "key-value-stores",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "nosql", "key-value", "redis"],
  relatedTopics: [
    "document-databases",
    "in-memory-databases",
    "caching-strategies",
    "cdn-edge-storage",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Key-Value Stores</h1>
        <p className="lead">
          Key-value stores are the simplest NoSQL databases: they map unique keys to opaque values
          with basic operations (GET, SET, DELETE). This simplicity enables microsecond latency,
          massive throughput, and horizontal scaling. Key-value stores excel at caching, session
          management, feature flags, rate limiting, and any workload where data is accessed by a
          single key.
        </p>

        <p>
          Consider a web application that needs to store user sessions. Each session has a unique
          ID and contains user data (user ID, preferences, cart contents). A key-value store maps
          session IDs to session data: SET session:abc123 with user data.
          Retrieving the session is a single GET operation—no joins, no complex queries, just
          instant lookup by key. This simplicity is why Redis, DynamoDB, and Memcached are
          ubiquitous in modern architectures.
        </p>

        <p>
          Key-value stores trade query flexibility for performance. You can't filter by value,
          join across keys, or run aggregations. But for workloads that fit the model—single-key
          access with simple values—nothing is faster. Redis achieves sub-millisecond latency by
          storing data in memory. DynamoDB scales to millions of requests per second by
          partitioning across nodes.
        </p>

        <p>
          This article provides a comprehensive examination of key-value stores: architecture
          patterns, scaling strategies (sharding, consistent hashing), caching patterns
          (cache-aside, write-through), and real-world use cases. We'll explore when key-value
          stores excel (caching, sessions, counters) and when they struggle (complex queries,
          relationships). By the end, you'll have a clear framework for deciding when to use
          key-value stores and how to design effective key schemas.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/kv-store-architecture.svg`}
          caption="Figure 1: Key-Value Store Architecture & Use Cases showing basic client-KV store flow (GET/SET/DELETE operations) and common use cases. Session storage: user session data with TTL-based expiration. Caching layer: database query cache, API response cache, CDN edge cache. Advanced data structures (Redis): strings (basic key-value, counters), lists (queues, stacks), sets (unique items, intersections), hashes (object-like structures), sorted sets (leaderboards), bitmaps (bit-level operations), HyperLogLog (cardinality estimation), streams (event logs). Trade-offs: simple API, low latency, horizontal scaling vs no complex queries, limited data relationships."
          alt="Key-value store architecture and use cases"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Operations & Data Model</h2>

        <h3>Basic Operations</h3>
        <p>
          Key-value stores expose a minimal API: <code className="inline-code">GET key</code> returns
          the value for a key (or null if not found). <code className="inline-code">SET key value</code>
          stores a value (overwriting if exists). <code className="inline-code">DELETE key</code>
          removes a key. Some stores add <code className="inline-code">EXISTS key</code> (check
          existence), <code className="inline-code">TTL key</code> (time to live), and atomic
          operations like <code className="inline-code">INCR key</code> (increment counter).
        </p>

        <p>
          This simplicity enables optimization. Without complex query parsing, the database can
          focus on fast key lookup. Hash tables provide O(1) average-case lookup. In-memory stores
          avoid disk I/O entirely. Distributed stores partition keys across nodes for horizontal
          scaling.
        </p>

        <h3>Data Structures</h3>
        <p>
          While basic key-value stores treat values as opaque blobs, advanced stores (Redis) support
          rich data structures. <strong>Strings</strong> are basic key-value pairs with atomic
          operations (INCR, APPEND). <strong>Lists</strong> are ordered collections supporting
          push/pop operations (LPUSH, RPOP)—ideal for queues and stacks. <strong>Sets</strong> are
          unordered collections of unique items with set operations (union, intersection).
        </p>

        <p>
          <strong>Hashes</strong> are object-like structures with field-value pairs (HSET, HGET)—
          perfect for user profiles or product data. <strong>Sorted sets</strong> maintain items
          ordered by score—ideal for leaderboards and ranked data. <strong>Bitmaps</strong> enable
          bit-level operations for space-efficient flags. <strong>HyperLogLog</strong> provides
          cardinality estimation (count unique items) with minimal memory. <strong>Streams</strong>
          support event logging and pub/sub patterns.
        </p>

        <h3>TTL and Expiration</h3>
        <p>
          Most key-value stores support time-to-live (TTL) on keys. Set a TTL when creating a key,
          or update TTL on existing keys. When TTL expires, the key is automatically deleted. This
          is essential for session management (sessions expire after inactivity), caching (cache
          entries expire and refresh), and rate limiting (counters reset after time window).
        </p>

        <p>
          Redis implements expiration lazily (check on access) and actively (background process
          scans for expired keys). This balances accuracy with performance—expired keys are removed
          promptly without blocking operations.
        </p>

        <h3>Persistence Options</h3>
        <p>
          In-memory key-value stores (Redis) offer two persistence modes. <strong>RDB snapshots</strong>
          periodically save the entire dataset to disk. This is fast and compact but can lose recent
          writes on crash. <strong>AOF (Append-Only File)</strong> logs every write operation. This
          is more durable (can replay operations) but slower and larger. Many systems use both: AOF
          for durability, RDB for fast restarts.
        </p>

        <p>
          Disk-based key-value stores (RocksDB, LevelDB) use LSM trees (Log-Structured Merge trees)
          for efficient writes. Writes go to an in-memory memtable, then flush to SSTable files on
          disk. Compaction merges SSTables to remove obsolete data. This provides durability with
          good write throughput.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/kv-store-scaling.svg`}
          caption="Figure 2: Key-Value Store Scaling Patterns showing horizontal scaling (sharding) with range-based or hash-based partitioning. Consistent hashing ring: keys assigned clockwise to next node, adding/removing nodes causes minimal key movement. Caching patterns: Cache-Aside (lazy loading—check cache, miss loads from DB), Write-Through (sync write to cache and DB), Write-Behind (async batch write to DB), Refresh-Ahead (proactive cache refresh). Hot key mitigation: local caching, key replication, request coalescing, rate limiting."
          alt="Key-value store scaling patterns"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Scaling &amp; Caching</h2>

        <h3>Horizontal Scaling (Sharding)</h3>
        <p>
          Key-value stores scale horizontally by partitioning keys across nodes (sharding). The
          shard key determines which node stores a key. Common strategies include:
          <strong>Range-based sharding</strong> partitions by key ranges (keys A-M on shard 1, N-Z
          on shard 2). This enables range queries but risks uneven distribution.
          <strong>Hash-based sharding</strong> computes shard equals hash of key modulo number of shards.
          This provides even distribution but loses range query efficiency.
        </p>

        <p>
          <strong>Consistent hashing</strong> maps keys and nodes to a hash ring. Keys are assigned
          clockwise to the next node. Adding or removing a node only affects keys between the old
          and new node positions—minimal data movement. This is how DynamoDB, Cassandra, and
          distributed caches scale elastically.
        </p>

        <h3>Caching Patterns</h3>
        <p>
          Key-value stores are commonly used as caches. Four patterns dominate:
        </p>

        <p>
          <strong>Cache-Aside (Lazy Loading)</strong> is the simplest: application checks cache
          first, on miss loads from database and populates cache. This caches only requested data
          but incurs cache miss latency. Check cache, if miss then load from DB and populate cache.
        </p>

        <p>
          <strong>Write-Through</strong> writes to cache, and cache synchronously writes to database.
          This ensures cache and database are consistent but adds write latency. Use when reads
          greatly outnumber writes and consistency is critical.
        </p>

        <p>
          <strong>Write-Behind (Write-Back)</strong> writes to cache, and cache asynchronously
          batches writes to database. This provides fast writes but risks data loss if cache crashes
          before flushing. Use for write-heavy workloads where occasional data loss is acceptable
          (e.g., counters, non-critical updates).
        </p>

        <p>
          <strong>Refresh-Ahead</strong> proactively refreshes cache entries before expiration.
          This eliminates cache misses but adds complexity and may cache unused data. Use for
          predictable, frequently accessed data (e.g., configuration, popular products).
        </p>

        <h3>Hot Key Mitigation</h3>
        <p>
          Hot keys (keys accessed far more than others) can overload a single shard. Mitigation
          strategies include: <strong>Local caching</strong>—cache hot keys in application memory
          to reduce KV store load. <strong>Key replication</strong>—replicate hot keys to multiple
          shards and read from any replica. <strong>Request coalescing</strong>—batch concurrent
          reads of the same key into a single request. <strong>Rate limiting</strong>—throttle
          requests for hot keys to prevent overload.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/kv-store-use-cases.svg`}
          caption="Figure 3: Key-Value Stores Use Cases & Anti-Patterns. Ideal use cases: Session management (user session data with TTL), Caching (query results, API responses), Feature flags (boolean flags per user), Rate limiting (counter per user/IP with TTL). Anti-patterns to avoid: Complex queries (filtering by value, range queries, joins), Large values (>1MB—use object storage), Relationships (many-to-many—use graph/relational DB), Analytics (aggregations—use analytics DB). Comparison: Key-Value (simple GET/SET, microsecond latency) vs Document DB (rich queries, flexible schema) vs Relational DB (complex joins, ACID) vs Graph DB (relationship traversal)."
          alt="Key-value store use cases and anti-patterns"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Key-Value vs Other Stores</h2>

        <p>
          Key-value stores represent one end of the database spectrum: maximum simplicity and
          performance, minimum query flexibility. Understanding the trade-offs helps you choose
          the right tool for each workload.
        </p>

        <h3>Key-Value Strengths</h3>
        <p>
          <strong>Latency</strong> is the primary advantage. In-memory key-value stores (Redis)
          achieve sub-millisecond latency for simple operations. This is essential for real-time
          applications (gaming, bidding, ad auctions) where every millisecond matters.
        </p>

        <p>
          <strong>Simplicity</strong> enables reliability. With only GET/SET/DELETE operations,
          there's less to break. Query optimization is trivial (hash lookup). Scaling is
          straightforward (partition by key). This simplicity reduces operational complexity.
        </p>

        <p>
          <strong>Horizontal scaling</strong> is built-in. Key-value stores shard naturally by key.
          Adding nodes automatically redistributes load. This enables linear throughput growth—10
          nodes handle 10x the load of 1 node.
        </p>

        <h3>Key-Value Limitations</h3>
        <p>
          <strong>No complex queries</strong> is the primary limitation. You can't filter by value,
          join across keys, or run aggregations. If you need to find "all users in California,"
          you must scan all keys (inefficient) or maintain a secondary index (complex).
        </p>

        <p>
          <strong>Data modeling constraints</strong> require careful key design. Your key schema
          determines access patterns. If you need to query by multiple attributes, you must
          denormalize (store multiple copies with different keys) or use a different database.
        </p>

        <p>
          <strong>Value size limits</strong> constrain what you can store. Redis has a 512MB limit
          per key, but performance degrades for large values. Key-value stores are optimized for
          small values (under 1MB). For large blobs, use object storage (S3).
        </p>

        <h3>When to Use Key-Value Stores</h3>
        <p>
          Use key-value stores for: <strong>Caching</strong> (database queries, API responses,
          computed values), <strong>Session management</strong> (user sessions with TTL),
          <strong>Feature flags</strong> (boolean flags per user/segment), <strong>Rate limiting</strong>
          (counters per user/IP), <strong>Leaderboards</strong> (sorted sets for rankings),
          <strong>Real-time data</strong> (counters, gauges, metrics).
        </p>

        <p>
          Avoid key-value stores for: <strong>Complex queries</strong> (filtering, aggregations,
          joins), <strong>Relational data</strong> (many-to-many relationships), <strong>Full-text
          search</strong> (use search engines), <strong>Analytics</strong> (use columnar stores),
          <strong>Large blobs</strong> (use object storage).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Key-Value Stores</h2>

        <p>
          <strong>Design key schemas carefully.</strong> Your key structure determines access
          patterns. Use prefixes for namespacing (<code className="inline-code">user:123:profile</code>,
          <code className="inline-code">user:123:settings</code>). Use separators consistently
          (colons are common). Document key conventions and enforce them in code reviews.
        </p>

        <p>
          <strong>Set appropriate TTLs.</strong> Every key should have a TTL unless it's
          permanent data. This prevents memory leaks from stale data. For sessions, use TTL based
          on inactivity (30 minutes). For caches, use TTL based on data freshness requirements
          (5 minutes for dynamic content, 1 hour for static).
        </p>

        <p>
          <strong>Monitor memory usage.</strong> In-memory stores can run out of memory. Set
          maxmemory limits and eviction policies (LRU, LFU). Monitor memory fragmentation. Alert
          on memory usage approaching limits. Plan capacity based on growth projections.
        </p>

        <p>
          <strong>Use pipelines for batch operations.</strong> Instead of sending 100 individual
          commands, use pipelines to send them in one round-trip. This reduces network latency
          significantly. Redis pipelines can improve throughput by 10x for batch operations.
        </p>

        <p>
          <strong>Handle failures gracefully.</strong> Key-value stores can fail. Implement retry
          logic with backoff. Use circuit breakers to prevent cascading failures. Have fallback
          strategies (e.g., if cache is down, read from database directly).
        </p>

        <p>
          <strong>Secure access.</strong> Enable authentication (Redis AUTH). Use network isolation
          (VPC, private subnets). Encrypt data in transit (TLS). Rotate credentials regularly.
          Audit access logs for anomalies.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Using as primary database.</strong> Key-value stores are excellent caches and
          session stores, but poor primary databases for complex applications. Don't try to build
          a full application on Redis alone—you'll end up reimplementing database features poorly.
          Use key-value stores alongside relational/document databases, not instead of them.
        </p>

        <p>
          <strong>Ignoring memory limits.</strong> In-memory stores will crash if they exceed
          memory. Set maxmemory limits and eviction policies. Monitor memory usage. Archive or
          delete old data. Consider disk-based stores (RocksDB) for data that doesn't fit in
          memory.
        </p>

        <p>
          <strong>Poor key design.</strong> Keys like <code className="inline-code">data:1</code>,
          <code className="inline-code">data:2</code> provide no structure. Use meaningful prefixes
          (<code className="inline-code">user:123:profile</code>). Avoid keys that are hard to
          query (<code className="inline-code">user_profile_123</code> vs
          <code className="inline-code">user:123:profile</code>). Plan for future query needs.
        </p>

        <p>
          <strong>Not handling cache stampedes.</strong> When a popular cache entry expires,
          concurrent requests all miss and hit the database simultaneously (thundering herd).
          Mitigate with: probabilistic early expiration (refresh before TTL), request coalescing
          (only one request fetches from DB), or cache-aside with locks.
        </p>

        <p>
          <strong>Storing sensitive data unencrypted.</strong> Session data often contains user
          information. Encrypt sensitive values before storing. Use Redis encryption at rest.
          Never store passwords or PII without encryption.
        </p>

        <p>
          <strong>Ignoring persistence.</strong> In-memory stores lose data on restart. Enable
          AOF or RDB persistence for durability. Test restore procedures. Understand RPO (recovery
          point objective)—how much data can you afford to lose?
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Session Management (Express, Django)</h3>
        <p>
          Web frameworks use key-value stores for session storage. Each user session has a unique
          ID stored in a cookie. The server stores session data in Redis:
          <code className="inline-code">SET session:abc123</code> with session data including user_id, cart, and expires.
          Session lookup is a single GET operation. TTL ensures sessions expire after inactivity.
          Redis Cluster scales to millions of concurrent sessions.
        </p>

        <p>
          Twitter uses Redis for session management, handling hundreds of millions of sessions.
          The low latency ensures fast authentication on every request. TTL-based expiration
          automatically cleans up inactive sessions.
        </p>

        <h3>Caching Layer (GitHub, Instagram)</h3>
        <p>
          GitHub uses Redis to cache database query results. Expensive queries (repository file
          listings, commit history) are cached with TTL. Cache hits avoid database load entirely.
          Cache misses populate the cache for subsequent requests. This reduces database load by
          90%+ for frequently accessed data.
        </p>

        <p>
          Instagram uses Redis for caching user feeds, profile data, and media metadata. The
          cache-aside pattern ensures popular content is always cached. Redis Cluster provides
          horizontal scaling for billions of cache operations per day.
        </p>

        <h3>Rate Limiting (API Gateways)</h3>
        <p>
          API gateways use key-value stores for rate limiting. Each user/IP has a counter key:
          <code className="inline-code">INCR rate_limit:user:123</code> with TTL of 1 minute.
          If counter exceeds limit, reject the request. Atomic INCR ensures accurate counting
          even under concurrent requests. This is how AWS API Gateway, Kong, and Envoy implement
          rate limiting.
        </p>

        <h3>Leaderboards (Gaming)</h3>
        <p>
          Gaming platforms use Redis sorted sets for leaderboards. Each player has a score:
          <code className="inline-code">ZADD leaderboard:level1 1500 player123</code>. Getting
          top 100 players is <code className="inline-code">ZREVRANGE leaderboard:level1 0 99</code>.
          Getting player rank is <code className="inline-code">ZREVRANK leaderboard:level1 player123</code>.
          Sorted sets maintain ordering automatically, enabling real-time leaderboard updates.
        </p>

        <h3>Feature Flags (LaunchDarkly, Optimizely)</h3>
        <p>
          Feature flag services use key-value stores for flag evaluation. Each flag is a key:
          <code className="inline-code">feature:new_checkout:true</code> or per-user flags
          <code className="inline-code">feature:new_checkout:user:123:false</code>. Flag
          evaluation is a single GET operation, enabling real-time feature toggles without
          deployments.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose a key-value store over a document or relational database?
              Give a concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose key-value stores when you need simple key-based
              access with microsecond latency, and don't need complex queries. Example: Session
              management. Each session has a unique ID (key) and session data (value). You only
              ever access sessions by ID—no filtering by user, no joins. A key-value store like
              Redis provides sub-millisecond lookup, TTL-based expiration, and horizontal scaling.
              A relational database would be overkill (schema, joins) and slower. A document
              database would work but adds unnecessary complexity (query parsing, indexing).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need to query sessions by user ID? Answer:
              Maintain a secondary index (separate key mapping user_id to session_ids), or use a
              different store for that query pattern. Don't force key-value stores to do something
              they're not designed for.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain cache-aside vs write-through caching. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cache-aside (lazy loading): application checks cache first,
              on miss loads from database and populates cache. Simple, caches only requested data,
              but cache miss latency. Write-through: write to cache, cache synchronously writes to
              database. Ensures consistency, but adds write latency. Use cache-aside for read-heavy
              workloads where occasional cache misses are acceptable (content feeds, product pages).
              Use write-through when consistency is critical and writes are infrequent (user profile
              updates, configuration).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is cache stampede and how do you prevent it? Answer:
              Cache stampede (thundering herd) occurs when a popular cache entry expires and
              concurrent requests all miss, hitting the database simultaneously. Prevent with:
              probabilistic early expiration (refresh before TTL), request coalescing (only one
              request fetches from DB), or mutex locks around cache population.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How do you handle hot keys in a distributed key-value store?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Hot keys (keys accessed far more than others) overload a
              single shard. Mitigation strategies: (1) Local caching—cache hot keys in application
              memory to reduce KV store load. (2) Key replication—replicate hot keys to multiple
              shards and read from any replica. (3) Request coalescing—batch concurrent reads of
              the same key into a single request. (4) Rate limiting—throttle requests for hot keys
              to prevent overload. (5) Key splitting—split hot key into multiple keys (user:123:1,
              user:123:2) and distribute reads.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you detect hot keys? Answer: Monitor per-key
              access metrics (Redis INFO command, CloudWatch metrics). Look for keys with
              significantly higher request rates than average. Set up alerts for keys exceeding
              threshold (e.g., 10x average).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a rate limiter using a key-value store. How do you handle concurrent
              requests?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use Redis INCR with TTL. For each user/IP, maintain a
              counter key with TTL equal to the rate limit window:
              <code className="inline-code">INCR rate_limit:user:123</code>, then
              <code className="inline-code">EXPIRE rate_limit:user:123 60</code> (if key is new).
              If counter exceeds limit, reject request. INCR is atomic, so concurrent requests are
              handled correctly—each increments the counter exactly once. For sliding windows, use
              sorted sets with timestamps as scores.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if Redis is unavailable? Answer: Have a fallback
              strategy—fail open (allow requests) or fail closed (reject requests) based on risk
              tolerance. Use circuit breakers to prevent cascading failures. Consider local
              rate limiting as a backup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Explain consistent hashing. Why is it better than simple hash-based sharding?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Simple hash-based sharding: <code className="inline-code">shard = hash(key) % num_shards</code>.
              Problem: when you add/remove a shard, most keys must be remapped (<code className="inline-code">num_shards</code> changes, so most hash results map to different shards). Consistent hashing maps keys and nodes to a hash ring. Keys are assigned clockwise to the next node. Adding/removing a node only affects keys between the old and new node positions—minimal data movement (1/N of keys instead of most keys). This enables elastic scaling without massive data migration.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are virtual nodes? Answer: Virtual nodes (vnodes)
              are multiple positions on the hash ring per physical node. This improves load
              balancing—each physical node handles multiple ring segments, reducing skew. When a
              node is added/removed, its vnodes are redistributed, spreading the load more evenly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your Redis cache is running out of memory. What do you do?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Immediate actions: (1) Check memory usage (INFO memory) to
              identify what's consuming memory. (2) Review eviction policy—if noeviction, change
              to allkeys-lru or volatile-lru. (3) Identify and evict large keys. (4) Reduce TTLs
              to expire data faster. Long-term: (5) Add more nodes (Redis Cluster). (6) Archive
              old data to disk or cold storage. (7) Review caching strategy—are you caching too
              much? (8) Consider disk-based stores (RocksDB) for data that doesn't need to be
              in memory.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What eviction policies does Redis support? Answer:
              noeviction (error on OOM), allkeys-lru (evict least recently used), volatile-lru
              (evict LRU among keys with TTL), allkeys-random, volatile-random, volatile-ttl
              (evict shortest TTL first). Choose based on workload: allkeys-lru for caches,
              volatile-lru for mixed TTL/non-TTL data.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://redis.io/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis Documentation — Data Structures, Persistence, Replication
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon DynamoDB Documentation — Core Components, Best Practices
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapters 3, 5, 6.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019. Chapters 4, 13.
          </li>
          <li>
            <a
              href="https://redis.io/topics/design"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Salvatore Sanfilippo — Redis Design Documentation
            </a>
          </li>
          <li>
            Werner Vogels, "Dynamo: Amazon&apos;s Highly Available Key-Value Store," SOSP 2007.
          </li>
          <li>
            <a
              href="https://memcached.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook — Memcached: Distributed Memory Caching
            </a>
          </li>
          <li>
            Google, "Bigtable: A Distributed Storage System for Structured Data," OSDI 2006.
          </li>
          <li>
            <a
              href="https://github.com/google/leveldb"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LevelDB Documentation — Architecture
            </a>
          </li>
          <li>
            <a
              href="https://rocksdb.org/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RocksDB Documentation — Architecture
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
