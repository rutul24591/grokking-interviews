"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-caching-strategies-complete",
  title: "Caching Strategies",
  description:
    "Comprehensive guide to caching strategies: cache-aside, read-through, write-through, write-behind, and write-around patterns with production-ready implementation patterns and trade-off analysis.",
  category: "backend",
  subcategory: "caching-performance",
  slug: "caching-strategies",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-03",
  tags: ["backend", "caching", "performance", "redis", "scalability"],
  relatedTopics: [
    "cache-eviction-policies",
    "cache-invalidation",
    "distributed-caching",
    "multi-level-caching",
  ],
};

const BASE_PATH =
  "/diagrams/system-design-concepts/backend/caching-performance";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Caching Strategies</h1>
        <p className="lead">
          Caching strategies define where cached data lives, how it is
          populated, how it stays consistent with the system of record, and when
          it is evicted. A strategy is not just a policy—it is a contract
          between clients, caches, and durable storage that determines
          freshness, latency, cost, and failure behavior. The right caching
          strategy can reduce database load by 90%, cut latency from hundreds of
          milliseconds to single-digit milliseconds, and enable systems to scale
          to millions of requests per second.
        </p>

        <p>
          Consider an e-commerce product catalog with 10 million products.
          Without caching, every product page view hits the database directly,
          causing high latency (200-500ms) and database load. With cache-aside
          strategy, the application checks the cache first (5ms hit), falls back
          to the database on miss (200ms), and populates the cache for
          subsequent requests. After the first view of each product, 95% of
          requests hit the cache, reducing average latency to 10ms and database
          load by 95%.
        </p>

        <p>
          Caching strategies differ in three dimensions:{" "}
          <strong>read pattern</strong> (how data is loaded into cache),{" "}
          <strong>write pattern</strong> (how cache stays consistent with the
          database), and <strong>failure handling</strong> (what happens when
          cache or database is unavailable). Cache-aside reads on cache miss,
          read-through reads through the cache transparently, write-through
          writes to both cache and database synchronously, write-behind writes
          to cache and asynchronously to database, and write-around writes
          directly to database bypassing cache. Each pattern has different
          latency, consistency, and failure characteristics.
        </p>

        <p>
          This article provides a comprehensive examination of caching
          strategies: cache-aside (lazy loading), read-through, write-through,
          write-behind (write-back), and write-around patterns. We'll explore
          when each strategy excels (cache-aside for flexibility, write-through
          for consistency, write-behind for write-heavy workloads), the
          trade-offs between consistency and performance, and real-world use
          cases from production systems. We'll also cover implementation
          patterns (Redis, Memcached, application-level caches), failure
          handling (cache downtime, database downtime, split-brain), and common
          pitfalls (cache stampede, thundering herd, stale data).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/caching-strategies-overview.svg`}
          caption="Figure 1: Caching Strategies Overview showing five core patterns. Cache-Aside: App checks cache first, falls back to DB on miss, then writes to cache. Read-Through: App reads from cache, cache loads from DB transparently. Write-Through: App writes to cache, cache writes to DB synchronously. Write-Behind: App writes to cache, cache writes to DB asynchronously (batched). Write-Around: App writes directly to DB, bypassing cache. Each pattern has different consistency, latency, and failure characteristics."
          alt="Caching strategies overview"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Read and Write Patterns</h2>

        <h3>Cache-Aside (Lazy Loading)</h3>
        <p>
          Cache-aside is the simplest and most widely-used caching strategy. The
          application controls the cache directly: on read, it checks the cache
          first, and if the data is missing (cache miss), it loads from the
          database, returns the result, and stores it in the cache with a TTL
          (time-to-live). On write, the application updates the database and
          deletes the cache entry (invalidation), letting the next read
          repopulate the cache with fresh data.
        </p>

        <p>
          The advantage of cache-aside is flexibility: the application decides
          what to cache, when to invalidate, and how to handle failures. It
          works well for read-heavy workloads where not all data needs to be
          cached—only the hot data naturally populates the cache. The
          disadvantage is the cache miss penalty: the first request for any key
          pays the full database latency, and concurrent requests for the same
          missing key can cause a cache stampede (thundering herd) where many
          requests hit the database simultaneously.
        </p>

        <p>
          Cache-aside is used by most web applications with Redis or Memcached.
          The application code contains the caching logic explicitly, making it
          easy to debug, monitor, and customize. For example, a product catalog
          service checks Redis for the product, loads from PostgreSQL on miss,
          and caches with a 1-hour TTL.
        </p>

        <h3>Read-Through Cache</h3>
        <p>
          Read-through caching abstracts the cache behind a cache layer that
          loads data from the database transparently. The application reads from
          the cache as if it were the database—if the data is in the cache, it
          returns immediately; if not, the cache itself loads from the database,
          stores the result, and returns it. The application is unaware of
          whether it hit or missed the cache.
        </p>

        <p>
          The advantage is simplicity for the application: no caching logic in
          application code, just read from the cache endpoint. The cache layer
          handles misses, population, and eviction. This pattern is common with
          distributed caches that support read-through callbacks (e.g.,
          Hazelcast, Apache Ignite). The disadvantage is that the cache layer
          must know how to load data from the database, creating a coupling
          between cache and database schemas.
        </p>

        <h3>Write-Through Cache</h3>
        <p>
          Write-through caching writes data to both the cache and the database
          synchronously. When the application writes data, it writes to the
          cache, and the cache forwards the write to the database before
          acknowledging the write to the application. This ensures that the
          cache and database are always consistent—if the write succeeds, both
          cache and database have the latest data.
        </p>

        <p>
          The advantage is strong consistency: the cache never serves stale data
          because every write updates both stores before the write completes.
          The disadvantage is write latency: the application waits for both
          cache and database writes, so write latency is the sum of both
          operations. This pattern is appropriate when consistency is more
          important than write performance (e.g., financial data, user
          profiles).
        </p>

        <h3>Write-Behind (Write-Back)</h3>
        <p>
          Write-behind caching writes data to the cache and acknowledges the
          write immediately, while the cache asynchronously batches writes to
          the database. The application sees fast write latency (cache only),
          and the database receives writes in batches, reducing database load.
          The cache maintains a dirty set of keys that need to be flushed to the
          database.
        </p>

        <p>
          The advantage is excellent write performance and reduced database
          load. The disadvantage is data loss risk: if the cache crashes before
          flushing dirty data to the database, those writes are lost. This
          pattern is appropriate for write-heavy workloads where some data loss
          is acceptable (e.g., counters, analytics, social media posts). It is
          not appropriate for critical data (e.g., financial transactions, user
          account changes).
        </p>

        <h3>Write-Around Cache</h3>
        <p>
          Write-around caching writes data directly to the database, bypassing
          the cache entirely. On read, the application uses cache-aside (check
          cache, load from database on miss). Writes go straight to the
          database, and the cache is either invalidated or left to expire via
          TTL.
        </p>

        <p>
          The advantage is that one-time writes (e.g., bulk imports, historical
          data) don't pollute the cache with data that may never be read again.
          The cache stays focused on hot read data. The disadvantage is that the
          next read after a write will be a cache miss, paying the database
          latency penalty. This pattern is appropriate for write-heavy workloads
          where most writes are never read (e.g., log ingestion, audit trails).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/read-write-patterns.svg`}
          caption="Figure 2: Read and Write Pattern Comparison showing the flow of data for each strategy. Cache-Aside: App → Cache (miss) → DB → Cache → App. Read-Through: App → Cache (miss → loads from DB) → App. Write-Through: App → Cache → DB → Ack. Write-Behind: App → Cache → Ack (async: Cache → DB batch). Write-Around: App → DB (bypass cache). The diagram shows latency, consistency, and failure characteristics for each pattern. Cache-aside is flexible but has miss penalty. Read-through is simple but couples cache to DB. Write-through is consistent but slow writes. Write-behind is fast writes but risks data loss. Write-around avoids cache pollution but has read-after write miss."
          alt="Read and write pattern comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Patterns</h2>

        <h3>Application-Level Caching</h3>
        <p>
          Application-level caching stores data in the application process
          memory (in-process cache) or in a nearby cache server (distributed
          cache). In-process caches (e.g., Caffeine for Java, lru_cache for
          Python) have the lowest latency (nanoseconds) but are not shared
          across application instances. Each instance has its own copy of cached
          data, leading to potential inconsistency (one instance may have stale
          data after another instance updates the database).
        </p>

        <p>
          Distributed caches (e.g., Redis, Memcached) are shared across all
          application instances, providing cache consistency across the fleet.
          The latency is higher than in-process caches (milliseconds vs.
          nanoseconds) but still much faster than database queries (hundreds of
          milliseconds). Most production systems use a two-level cache:
          in-process cache for hot data (L1) and distributed cache for shared
          data (L2), combining the speed of in-process with the consistency of
          distributed.
        </p>

        <h3>Cache Invalidation Strategies</h3>
        <p>
          Cache invalidation is one of the hardest problems in distributed
          systems. The strategy depends on the write pattern. For cache-aside,
          the application deletes the cache entry after writing to the database
          (cache invalidation). For read-through, the cache can invalidate based
          on TTL or explicit invalidation messages from the database (e.g., via
          Change Data Capture, CDC). For write-through, the cache is updated
          automatically on write, so no explicit invalidation is needed.
        </p>

        <p>
          TTL-based invalidation is the simplest approach: set a TTL on each
          cache entry, and let entries expire automatically. This guarantees
          that stale data is eventually refreshed, but allows a window of
          staleness (up to the TTL). For data that must be fresh, explicit
          invalidation (delete on write) is required. However, explicit
          invalidation is complex in distributed systems: all cache instances
          must be notified of the invalidation, and network partitions can cause
          some instances to miss the notification.
        </p>

        <h3>Cache Consistency Models</h3>
        <p>
          Cache consistency ranges from strong (cache and database are always
          consistent) to eventual (cache converges to database state
          eventually). Write-through provides strong consistency: every write
          updates both cache and database before the write completes.
          Cache-aside with TTL provides eventual consistency: the cache may
          serve stale data until the TTL expires or an explicit invalidation
          occurs.
        </p>

        <p>
          The choice depends on the data's freshness requirements. User session
          data can be eventually consistent (stale for a few seconds is
          acceptable). Financial balances must be strongly consistent (stale
          data could cause overdrafts). Product catalog data can be eventually
          consistent with a short TTL (stale for a few minutes is acceptable for
          browsing, but not for checkout—where the database is consulted for
          real-time inventory and pricing).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cache-consistency-models.svg`}
          caption="Figure 3: Cache Consistency Models showing the consistency spectrum from Strong to Eventual. Strong Consistency (Write-Through): Cache and DB always in sync, every write updates both, write latency = cache + DB. Eventual Consistency (Cache-Aside with TTL): Cache may be stale for up to TTL duration, eventual convergence, read latency = cache hit (fast) or miss (slow). Stale-While-Revalidate: Serve stale data immediately, refresh in background, low latency with freshness guarantee. The diagram shows trade-offs: strong consistency has higher write latency but guarantees freshness. Eventual consistency has lower latency but allows stale reads. Stale-while-revalidate balances both."
          alt="Cache consistency models"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          Choosing a caching strategy involves trade-offs between consistency,
          latency, complexity, and data loss risk. No single strategy is best
          for all workloads—the right choice depends on the read/write ratio,
          freshness requirements, and acceptable failure modes.
        </p>

        <h3>Consistency vs. Performance</h3>
        <p>
          Write-through provides strong consistency but has the highest write
          latency (cache + database). Write-behind provides the lowest write
          latency (cache only) but risks data loss if the cache crashes before
          flushing to the database. Cache-aside provides eventual consistency
          with moderate latency (cache hit is fast, miss is slow). Read-through
          provides eventual consistency with simple application code (no caching
          logic needed).
        </p>

        <h3>Read-Heavy vs. Write-Heavy Workloads</h3>
        <p>
          For read-heavy workloads (90% reads, 10% writes), cache-aside or
          read-through are appropriate. The cache naturally populates with hot
          data, and most reads hit the cache. For write-heavy workloads (50%
          writes, 50% reads), write-behind reduces database load by batching
          writes, but at the cost of data loss risk. Write-around is appropriate
          when writes are one-time and rarely read (e.g., log ingestion).
        </p>

        <h3>Complexity vs. Flexibility</h3>
        <p>
          Cache-aside is the simplest to implement but requires caching logic in
          every application that accesses the cache. Read-through and
          write-through abstract the cache behind a cache layer, simplifying
          application code but coupling the cache to the database schema.
          Write-behind is the most complex: it requires asynchronous flushing,
          dirty tracking, retry logic, and data loss handling.
        </p>

        <h3>Failure Modes</h3>
        <p>
          Cache-aside fails gracefully: if the cache is down, the application
          falls back to the database (higher latency but functional).
          Read-through fails if the cache is down (application cannot read at
          all, unless it has a database fallback). Write-through fails if either
          the cache or database is down (write cannot complete). Write-behind
          loses data if the cache crashes before flushing dirty data to the
          database.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/strategy-comparison.svg`}
          caption="Figure 4: Strategy Comparison Matrix showing five strategies across six dimensions. Cache-Aside: Read latency (Low on hit, High on miss), Write latency (Low), Consistency (Eventual), Complexity (Low), Data Loss Risk (None), Best for (Read-heavy). Read-Through: Read latency (Low), Write latency (N/A), Consistency (Eventual), Complexity (Medium), Data Loss Risk (None), Best for (Simple application code). Write-Through: Read latency (Low), Write latency (High), Consistency (Strong), Complexity (Medium), Data Loss Risk (None), Best for (Consistency-critical writes). Write-Behind: Read latency (Low), Write latency (Very low), Consistency (Eventual), Complexity (High), Data Loss Risk (Medium), Best for (Write-heavy, tolerable loss). Write-Around: Read latency (Low on hit, High on miss), Write latency (High), Consistency (Strong), Complexity (Low), Data Loss Risk (None), Best for (Write-once, rarely read)."
          alt="Caching strategy comparison matrix"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Caching Strategies</h2>

        <p>
          <strong>Start with cache-aside.</strong> It is the simplest strategy,
          provides good flexibility, and is easy to debug. Most production
          systems start with cache-aside and only adopt more complex strategies
          (write-through, write-behind) when the workload demands it.
          Cache-aside with TTL-based expiration is the default pattern for most
          caching use cases.
        </p>

        <p>
          <strong>Use write-through for consistency-critical writes.</strong>{" "}
          When data must be fresh (e.g., user account updates, financial data),
          write-through ensures that the cache and database are always
          consistent. The write latency penalty is acceptable because
          consistency is the priority.
        </p>

        <p>
          <strong>
            Use write-behind for write-heavy workloads with tolerable data loss.
          </strong>
          When the write volume is high and some data loss is acceptable (e.g.,
          counters, analytics, social media posts), write-behind reduces
          database load by batching writes. However, implement a write-ahead log
          (WAL) in the cache to survive cache crashes and replay dirty writes on
          restart.
        </p>

        <p>
          <strong>Implement cache stampede protection.</strong> When a popular
          key expires, many concurrent requests may hit the database
          simultaneously (cache stampede). Use locking (only one request loads
          from the database, others wait), probabilistic early expiration
          (refresh the key slightly before TTL expires for some requests), or
          stale-while-revalidate (serve stale data while refreshing in
          background) to prevent stampedes.
        </p>

        <p>
          <strong>Monitor cache hit rates and latency.</strong> Track cache hit
          rate (target &gt;90%), cache miss latency, cache eviction rate, and
          cache memory usage. Set alerts for sudden drops in hit rate
          (indicating cache population issues or TTL misconfiguration) and
          spikes in miss latency (indicating database overload).
        </p>

        <p>
          <strong>Plan for cache downtime.</strong> Design the application to
          function without the cache (fallback to database). Cache is an
          optimization, not a requirement—if the cache is down, the system
          should still work (albeit with higher latency). Implement circuit
          breakers to detect cache failures and switch to database-only mode.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Cache stampede (thundering herd).</strong> When a popular key
          expires, hundreds of concurrent requests may all miss the cache and
          hit the database simultaneously, overloading it. Fix: Use locking
          (only one request loads from the database), staggered TTLs (add random
          jitter to TTLs so keys don't expire simultaneously), or
          stale-while-revalidate (serve stale data while refreshing in
          background).
        </p>

        <p>
          <strong>Cache penetration.</strong> Requests for non-existent keys
          always miss the cache and hit the database, which can be exploited by
          attackers (requesting random keys to overload the database). Fix: Use
          negative caching (cache the fact that a key doesn't exist with a short
          TTL), or use a Bloom filter to quickly check if a key could exist
          before hitting the database.
        </p>

        <p>
          <strong>Cache invalidation race condition.</strong> If the application
          updates the database and then deletes the cache, but a concurrent read
          loads stale data into the cache between the database write and cache
          delete, the cache will serve stale data until the TTL expires. Fix:
          Use write-through (cache is updated atomically with the database
          write), or use a version number (only update the cache if the version
          is newer than the cached version).
        </p>

        <p>
          <strong>Cache avalanche.</strong> If the entire cache crashes or a
          large percentage of keys expire simultaneously, the database receives
          a flood of requests it cannot handle. Fix: Implement high availability
          for the cache (Redis Cluster, Memcached with replication), stagger
          TTLs, and implement database connection pooling and rate limiting to
          protect the database from sudden load spikes.
        </p>

        <p>
          <strong>Over-caching.</strong> Caching data that is rarely read or
          frequently updated wastes memory and provides no benefit. Fix: Monitor
          cache hit rates per key pattern, and only cache data with a hit rate
          above a threshold (e.g., &gt;50%). Use LRU (Least Recently Used)
          eviction to automatically evict cold data.
        </p>

        <p>
          <strong>Stale data serving outdated information.</strong> If the TTL
          is too long, the cache serves stale data that no longer reflects the
          database state. Fix: Set TTLs based on the data's freshness
          requirements (e.g., 1 minute for prices, 1 hour for product
          descriptions, 24 hours for static content). Use explicit invalidation
          for data that must be fresh.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-commerce: Product Catalog (Cache-Aside)</h3>
        <p>
          An e-commerce platform uses cache-aside for its product catalog. When
          a user views a product page, the application checks Redis for the
          product data. On a cache miss, it loads from PostgreSQL, caches with a
          1-hour TTL, and returns the data. Writes (price updates, inventory
          changes) update the database and delete the cache entry, so the next
          read loads fresh data.
        </p>

        <p>
          This strategy works well because product catalog reads are 100x more
          frequent than writes, and a 1-hour staleness window is acceptable for
          browsing (but not for checkout, where real-time inventory and pricing
          are checked against the database). The cache hit rate is 95%, reducing
          database load by 95% and average page latency from 200ms to 10ms.
        </p>

        <h3>Social Media: News Feed (Write-Behind)</h3>
        <p>
          A social media platform uses write-behind caching for news feed
          updates. When a user posts, the post is written to the cache (for
          immediate visibility to followers) and asynchronously flushed to the
          database in batches. This provides fast write latency (cache only) and
          reduces database load (batched writes).
        </p>

        <p>
          The platform accepts a small risk of data loss (if the cache crashes
          before flushing, the post is lost). To mitigate this, the cache
          maintains a write-ahead log (WAL) that survives cache restarts and
          replays dirty writes on restart. The data loss risk is acceptable
          because users can repost if needed, and the WAL reduces the loss
          window to seconds.
        </p>

        <h3>Financial Services: Account Balances (Write-Through)</h3>
        <p>
          A banking application uses write-through caching for account balances.
          When a transaction occurs, the application writes to the cache, and
          the cache forwards the write to the database before acknowledging the
          transaction. This ensures that the cached balance is always consistent
          with the database balance.
        </p>

        <p>
          The write latency penalty (cache + database) is acceptable because
          consistency is critical for financial data. An inconsistent balance
          could cause overdrafts, regulatory violations, or customer disputes.
          The cache provides fast read latency for balance inquiries (which are
          10x more frequent than transactions), improving the user experience
          without sacrificing consistency.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/real-world-strategies.svg`}
          caption="Figure 5: Real-World Strategy Selection showing three examples. E-commerce (Product Catalog): Cache-Aside with TTL, 95% hit rate, 1-hour TTL, reduces DB load by 95%, stale data acceptable for browsing. Social Media (News Feed): Write-Behind with WAL, fast writes, batched DB writes, small data loss risk acceptable, WAL reduces loss window to seconds. Financial Services (Account Balances): Write-Through for strong consistency, write latency penalty acceptable, consistency is critical for financial data, fast reads for balance inquiries. The decision framework at bottom asks: 'What is the read/write ratio?' and 'What is the freshness requirement?' to select the appropriate strategy."
          alt="Real-world caching strategy examples"
        />
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q1: Explain the difference between cache-aside and read-through
              caching. When would you choose one over the other?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Cache-aside and read-through differ in
              who controls the cache. In cache-aside, the application controls
              the cache: it checks the cache, loads from the database on miss,
              and populates the cache. In read-through, the cache layer controls
              the cache: the application reads from the cache, and the cache
              transparently loads from the database on miss.
            </p>
            <p className="mt-2 text-sm">
              Choose cache-aside when: (1) You want flexibility in what to cache
              (not all data needs caching). (2) You want explicit control over
              cache population and eviction. (3) Your cache doesn't support
              read-through callbacks. Choose read-through when: (1) You want to
              simplify application code (no caching logic in the application).
              (2) Your cache supports read-through callbacks (e.g., Hazelcast,
              Ignite). (3) You want a clean separation between application logic
              and caching concerns.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What happens if the cache is down in
              each case? Answer: In cache-aside, the application falls back to
              the database (higher latency but functional). In read-through, the
              application may fail entirely (if the cache endpoint is
              unavailable), unless the application has a database fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2: What is a cache stampede, and how do you prevent it?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> A cache stampede (thundering herd) occurs
              when a popular key expires, and many concurrent requests all miss
              the cache simultaneously, hitting the database at once. This can
              overload the database, causing a cascading failure.
            </p>
            <p className="mt-2 text-sm">
              Prevention strategies: (1) Locking—only one request loads from the
              database, others wait for the result. (2) Probabilistic early
              expiration—some requests refresh the key slightly before TTL
              expires, spreading the load. (3) Stale-while-revalidate—serve
              stale data immediately while refreshing in background, ensuring
              low latency. (4) Staggered TTLs—add random jitter to TTLs so
              popular keys don't expire simultaneously.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Which strategy is best for
              high-traffic systems? Answer: Stale-while-revalidate is best for
              high-traffic systems because it guarantees low latency (no waiting
              for the refresh) while eventually refreshing the data. It combines
              the best of both worlds: fast reads with eventual freshness.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3: Compare write-through and write-behind caching. When would you
              use each?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Write-through writes to both cache and
              database synchronously before acknowledging the write.
              Write-behind writes to the cache and acknowledges immediately,
              while the cache asynchronously batches writes to the database.
            </p>
            <p className="mt-2 text-sm">
              Use write-through when: (1) Consistency is critical (e.g.,
              financial data, user account changes). (2) Write volume is
              moderate (write latency penalty is acceptable). (3) Data loss is
              unacceptable. Use write-behind when: (1) Write volume is high
              (database load reduction is critical). (2) Some data loss is
              acceptable (e.g., counters, analytics). (3) Write latency must be
              minimized (e.g., real-time systems).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you mitigate data loss risk in
              write-behind? Answer: Implement a write-ahead log (WAL) in the
              cache. Every write is appended to the WAL before being
              acknowledged. If the cache crashes, the WAL survives and replays
              dirty writes on restart. This reduces the data loss window from
              the entire batch interval to the WAL flush interval (typically
              seconds).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4: How would you design a caching strategy for a global product
              catalog with 10 million products, where product updates are rare
              but must be visible within 5 minutes?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Use cache-aside with a 5-minute TTL.
              Product reads are 100x more frequent than updates, so cache-aside
              naturally populates the cache with hot products. The 5-minute TTL
              guarantees that updates are visible within 5 minutes (eventual
              consistency with a bounded staleness window). For products that
              are updated, explicitly invalidate the cache entry (delete on
              write) so the next read loads fresh data immediately, rather than
              waiting for the TTL to expire.
            </p>
            <p className="mt-2 text-sm">
              Use a distributed cache (Redis Cluster) for cache consistency
              across application instances. Implement cache stampede protection
              (locking or stale-while-revalidate) for popular products. Monitor
              cache hit rate (target &gt;90%) and miss latency (alert if
              database latency spikes).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if a product update is urgent
              (e.g., price correction)? Answer: Implement an explicit cache
              invalidation API that the product management system calls after
              updating a product. This deletes the cache entry immediately, so
              the next read loads the fresh price. This provides eventual
              consistency with a bounded staleness window (5 minutes by default,
              seconds with explicit invalidation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5: What is cache penetration, and how do you prevent it?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Cache penetration occurs when requests
              for non-existent keys always miss the cache and hit the database.
              An attacker can exploit this by requesting random keys,
              overloading the database. Unlike cache stampede (popular key
              expires), cache penetration targets non-existent keys.
            </p>
            <p className="mt-2 text-sm">
              Prevention strategies: (1) Negative caching—cache the fact that a
              key doesn't exist with a short TTL (e.g., 30 seconds). This
              prevents repeated database queries for the same non-existent key.
              (2) Bloom filter—maintain a Bloom filter of all valid keys. Before
              checking the cache or database, check the Bloom filter. If the
              Bloom filter says the key doesn't exist, skip the database query
              (Bloom filters have no false negatives, but may have false
              positives). (3) Rate limiting—limit the number of requests per
              client to prevent abuse.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is the trade-off of negative
              caching? Answer: Negative caching consumes cache memory for
              non-existent keys. If the key space is large (e.g., UUIDs), the
              number of non-existent keys is effectively infinite, and negative
              caching is ineffective (too many unique non-existent keys). In
              this case, a Bloom filter is better because it uses constant
              memory regardless of the key space size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6: How do you handle cache downtime in a cache-aside
              architecture?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> In cache-aside, the application should
              fall back to the database if the cache is unavailable. This
              ensures that the system remains functional (albeit with higher
              latency). Implement a circuit breaker: if the cache fails
              repeatedly, the circuit opens, and all requests go directly to the
              database. Periodically, the circuit half-opens (tries the cache
              again), and if the cache responds, the circuit closes (resumes
              normal caching).
            </p>
            <p className="mt-2 text-sm">
              Additionally, implement database connection pooling and rate
              limiting to protect the database from the sudden load spike when
              the cache is down. Without these protections, the database may be
              overwhelmed by the cache miss traffic, causing a cascading
              failure.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What happens when the cache comes back
              online? Answer: The cache starts empty (cold cache), so all
              requests initially miss the cache and hit the database. As
              requests populate the cache, the hit rate gradually increases. To
              accelerate cache warming, implement a cache warming process that
              pre-populates the cache with hot data after a restart.
              Alternatively, use stale-while-revalidate so the database serves
              requests while the cache warms in the background.
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
              href="https://redis.io/docs/latest/develop/use/patterns/cache-aside/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis Documentation — Cache-Aside Pattern
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/caching-strategies/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Caching Strategies — Write-Through, Write-Behind, and
              Cache-Aside
            </a>
          </li>
          <li>
            <a
              href="https://memcached.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Memcached Documentation — Distributed Caching
            </a>
          </li>
          <li>
            <a
              href="https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann, <em>Designing Data-Intensive Applications</em>,
              O&apos;Reilly, 2017 — Chapter 11 (Stream Processing) and Chapter 12 (The
              Future of Data Systems)
            </a>
          </li>
          <li>
            <a
              href="https://www.oreilly.com/library/view/database-internals/9781492040330/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019 — Chapter 9
              (Caching)
            </a>
          </li>
          <li>
            <a
              href="https://engineering.fb.com/2021/07/15/networking-traffic/tao/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meta Engineering Blog — TAO: Facebook&apos;s Distributed Data
              Store
            </a>
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Caching at Scale
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
