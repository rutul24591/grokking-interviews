"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-caching-consistency-strategy-extensive",
  title: "Caching Consistency Strategy",
  description: "Comprehensive guide to caching consistency strategies, covering cache invalidation patterns, consistency models, distributed caching, and cache coherence for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "caching-consistency-strategy",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "caching", "consistency", "invalidation", "distributed-systems"],
  relatedTopics: ["server-side-caching", "consistency-model", "data-consistency"],
};

export default function CachingConsistencyStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Caching Consistency Strategy</strong> addresses the fundamental tension between
          performance (caching data for fast access) and correctness (ensuring cached data reflects the
          current state). In distributed systems with multiple cache layers (browser, CDN, application,
          database), maintaining consistency is one of the most challenging problems.
        </p>
        <p>
          The CAP theorem tells us we cannot have perfect consistency, availability, and partition tolerance
          simultaneously. Caching strategies make explicit trade-offs based on use case requirements. For
          staff and principal engineers, caching consistency is a critical architectural decision—the
          strategy you choose impacts system latency, database load, user experience, and data correctness.
        </p>
        <p>
          <strong>Key considerations:</strong>
        </p>
        <ul>
          <li><strong>Consistency Model:</strong> Strong, eventual, or somewhere in between?</li>
          <li><strong>Invalidation Strategy:</strong> When and how to invalidate stale cache entries?</li>
          <li><strong>Cache Layers:</strong> Browser, CDN, application, database—each with different TTLs.</li>
          <li><strong>Write Patterns:</strong> How do writes propagate through cache layers?</li>
          <li><strong>Read Patterns:</strong> What consistency do reads require?</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/caching-strategies-comparison.svg"
          alt="Caching Strategies Comparison showing different approaches and trade-offs"
          caption="Caching Strategies Comparison: Cache-aside, write-through, write-behind, and refresh-ahead patterns with their consistency guarantees and performance characteristics."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Cache Invalidation Is Hard</h3>
          <p>
            There are only two hard things in Computer Science: cache invalidation and naming things.
            The difficulty isn&apos;t invalidating—it&apos;s knowing <em>when</em> to invalidate without
            sacrificing performance benefits. The right strategy depends on your consistency requirements
            and access patterns.
          </p>
        </div>
      </section>

      <section>
        <h2>Consistency Models for Caching</h2>
        <p>
          Consistency models define what guarantees the cache provides about data freshness. Different
          models suit different use cases.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strong Consistency</h3>
        <p>
          Every read returns the most recent write. Cache is always synchronized with the source of truth.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Invalidate cache on every write</li>
          <li>Read through cache (write-through pattern)</li>
          <li>Distributed locking for concurrent access</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Data always correct, simple mental model</li>
          <li><strong>Cons:</strong> Higher latency, reduced cache effectiveness, more database load</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Financial transactions (account balances)</li>
          <li>Inventory management (prevent overselling)</li>
          <li>Access control decisions</li>
          <li>Auction bidding</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eventual Consistency</h3>
        <p>
          Read may return stale data temporarily, but will eventually converge to the latest value. Most
          common model for distributed caches.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Time-based expiration (TTL)</li>
          <li>Asynchronous cache invalidation</li>
          <li>Lazy cache population (cache-aside)</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Maximum cache effectiveness, low latency, high availability</li>
          <li><strong>Cons:</strong> Stale data possible, complex failure scenarios</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Social media feeds</li>
          <li>Product catalogs (price changes acceptable to be delayed)</li>
          <li>User profiles</li>
          <li>Analytics dashboards</li>
          <li>Search results</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Read-Your-Writes Consistency</h3>
        <p>
          Users always see their own writes immediately, even if other users see stale data. Important for
          user experience—nothing more confusing than submitting a form and not seeing your changes.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Version tokens in cache keys</li>
          <li>User-specific cache entries</li>
          <li>Sticky sessions to same cache server</li>
          <li>Read from master database for short window after write</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Good user experience, eventual consistency for others</li>
          <li><strong>Cons:</strong> More complex, per-user state to track</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>User settings updates</li>
          <li>Comment submissions</li>
          <li>Draft saves</li>
          <li>Shopping cart modifications</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monotonic Reads</h3>
        <p>
          Once a user sees a value, they never see older values. Prevents confusing &quot;time travel&quot;
          where data appears to go backwards.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Sticky cache servers (user always reads from same node)</li>
          <li>Version tracking per user session</li>
          <li>Progressive cache warming with version ordering</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monotonic Writes</h3>
        <p>
          Writes from a single source are ordered. Prevents race conditions where later writes are applied
          before earlier writes.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Single writer per entity</li>
          <li>Version vectors or sequence numbers</li>
          <li>Ordered message queues for invalidation</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/consistency-models-comparison.svg"
          alt="Consistency Models Comparison showing different guarantees"
          caption="Consistency Models Comparison: Strong, eventual, read-your-writes, and monotonic consistency with their guarantees and use cases."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Match Consistency to Requirements</h3>
          <p>
            Not all data needs strong consistency. Social feeds can tolerate eventual consistency; bank
            balances cannot. Choose the weakest consistency model that meets your requirements—this maximizes
            performance while maintaining correctness.
          </p>
        </div>
      </section>

      <section>
        <h2>Cache Invalidation Patterns</h2>
        <p>
          Cache invalidation determines when cached data is removed or refreshed. The right pattern depends
          on your consistency requirements and access patterns.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/cache-invalidation-strategies.svg"
          alt="Cache Invalidation Strategies showing different patterns"
          caption="Cache Invalidation Strategies: Cache-aside, write-through, write-behind, and refresh-ahead patterns with their consistency guarantees and performance characteristics."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache-Aside (Lazy Loading)</h3>
        <p>
          Application checks cache first; if miss, reads from database and populates cache. Most common
          pattern for read-heavy workloads.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Flow</h4>
        <ol>
          <li>Check cache for key</li>
          <li>If found (hit), return cached value</li>
          <li>If not found (miss), read from database</li>
          <li>Store result in cache with TTL</li>
          <li>Return value</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Invalidation Strategy</h4>
        <p>Delete cache entry on write. Cache repopulates on next read with fresh data.</p>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Simple, cache only stores requested data, graceful degradation</li>
          <li><strong>Cons:</strong> Cache miss penalty, stale data until invalidation</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Read-heavy workloads</li>
          <li>Unpredictable access patterns</li>
          <li>Large data sets (cache subset)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Through</h3>
        <p>
          Application writes to cache; cache synchronously writes to database. Cache is always consistent
          with database.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Flow</h4>
        <ol>
          <li>Application writes to cache</li>
          <li>Cache writes to database synchronously</li>
          <li>Write completes when both succeed</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Cache always consistent, read performance</li>
          <li><strong>Cons:</strong> Write latency includes database write, cache stores all written data</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Frequently read, occasionally written data</li>
          <li>Data requiring strong consistency</li>
          <li>User sessions, profiles</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Behind (Write-Back)</h3>
        <p>
          Application writes to cache; cache asynchronously writes to database. Fastest write performance
          but risk of data loss.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Flow</h4>
        <ol>
          <li>Application writes to cache</li>
          <li>Cache acknowledges write immediately</li>
          <li>Cache queues database write</li>
          <li>Database write happens asynchronously (batched)</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Fastest writes, batches database writes, reduces DB load</li>
          <li><strong>Cons:</strong> Risk of data loss if cache fails, eventual consistency</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>High write throughput needed</li>
          <li>Occasional data loss acceptable</li>
          <li>Activity streams, counters, analytics</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Time-Based Expiration (TTL)</h3>
        <p>
          Cache entries automatically expire after fixed time. Simplest invalidation strategy.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Configuration</h4>
        <ul>
          <li>Global TTL: Same TTL for all entries</li>
          <li>Per-key TTL: Different TTL per cache key</li>
          <li>Sliding TTL: TTL resets on each access</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Simple, automatic, no invalidation logic needed</li>
          <li><strong>Cons:</strong> Stale data until expiration, cache churn if TTL too short</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Data with known freshness requirements</li>
          <li>Infrequently changing data</li>
          <li>When simplicity is valued over precision</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version-Based Invalidation</h3>
        <p>
          Include version number in cache key. Increment version on write to invalidate all old entries
          atomically.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Store version separately (e.g., &quot;user:123:version&quot;)</li>
          <li>Cache key includes version: &quot;user:123:v5&quot;</li>
          <li>On write: increment version, old cache entries become orphaned</li>
          <li>Old entries naturally expire via TTL</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Atomic invalidation, no race conditions, simple</li>
          <li><strong>Cons:</strong> Orphaned cache entries until TTL, version storage overhead</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tag-Based Invalidation</h3>
        <p>
          Associate cache entries with tags. Invalidate all entries with a tag when related data changes.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Tag entries: cache.set(key, value, tags=[&quot;user:123&quot;, &quot;posts&quot;])</li>
          <li>Invalidate by tag: cache.invalidate_tag(&quot;user:123&quot;)</li>
          <li>Invalidates all entries tagged with &quot;user:123&quot;</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Related data that changes together</li>
          <li>Complex invalidation logic</li>
          <li>CMS content with categories</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Combine Patterns</h3>
          <p>
            Real systems often combine multiple patterns. Use cache-aside for most data, write-through for
            critical data, TTL as safety net, and version-based invalidation for specific use cases. Choose
            per data type, not one-size-fits-all.
          </p>
        </div>
      </section>

      <section>
        <h2>Distributed Cache Coherence</h2>
        <p>
          When multiple cache nodes exist (for scale or availability), keeping them coherent is challenging.
          Different nodes may have different versions of the same data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Publish-Subscribe Invalidation</h3>
        <p>
          When data changes, publish invalidation event. All cache nodes subscribe and invalidate local
          entries.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Flow</h4>
        <ol>
          <li>Node A updates data</li>
          <li>Node A publishes &quot;invalidate key X&quot; to message bus</li>
          <li>All nodes receive event</li>
          <li>Each node invalidates local copy of key X</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Fast invalidation, scales to many nodes</li>
          <li><strong>Cons:</strong> Message delivery not guaranteed, race conditions possible</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Centralized Cache Cluster</h3>
        <p>
          Single cache cluster (Redis, Memcached) shared by all application nodes. Single source of truth
          for cache.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Simple coherence (single copy), easier invalidation</li>
          <li><strong>Cons:</strong> Network hop for every cache access, single point of failure</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consistent Hashing</h3>
        <p>
          Deterministic mapping of keys to cache nodes. Same key always goes to same node (unless node
          fails).
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Benefits</h4>
        <ul>
          <li>Minimal cache reshuffling when nodes added/removed</li>
          <li>Predictable key placement</li>
          <li>Even distribution across nodes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quorum Reads/Writes</h3>
        <p>
          Read from multiple nodes, return majority value. Write to multiple nodes, acknowledge when
          majority confirms.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li><strong>Pros:</strong> Tolerates node failures, stronger consistency</li>
          <li><strong>Cons:</strong> Higher latency, more network traffic</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Centralized vs Distributed Cache</h3>
          <p>
            For most applications, centralized cache cluster (Redis) is simpler and sufficient. Distributed
            local caches with pub-sub invalidation add complexity but reduce network hops. Choose based on
            latency requirements and operational complexity tolerance.
          </p>
        </div>
      </section>

      <section>
        <h2>Multi-Layer Caching</h2>
        <p>
          Typical web applications have multiple cache layers, each with different characteristics and TTLs.
          Invalidation must cascade through all layers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Browser Cache</h3>
        <p>
          Client-side caching via HTTP headers (Cache-Control, ETag, Last-Modified).
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Configuration</h4>
        <ul>
          <li><strong>Cache-Control:</strong> max-age, no-cache, no-store, must-revalidate</li>
          <li><strong>ETag:</strong> Entity tag for conditional requests</li>
          <li><strong>Last-Modified:</strong> Timestamp for conditional requests</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Typical TTLs</h4>
        <ul>
          <li>Static assets (JS, CSS, images): 1 year with content hashing</li>
          <li>API responses: Seconds to minutes</li>
          <li>HTML pages: No cache or short TTL</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN Cache</h3>
        <p>
          Edge caching for static content and cacheable API responses. Reduces origin load and latency.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Configuration</h4>
        <ul>
          <li>Cache rules based on path, headers, cookies</li>
          <li>Purge API for invalidation</li>
          <li>Cache keys based on headers, query params</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Typical TTLs</h4>
        <ul>
          <li>Static assets: Hours to days</li>
          <li>API responses: Seconds to minutes</li>
          <li>Dynamic content: No cache</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application Cache</h3>
        <p>
          In-memory cache (Redis, Memcached) within application layer. Fastest cache for dynamic data.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Typical TTLs</h4>
        <ul>
          <li>Database query results: Minutes to hours</li>
          <li>Session data: Hours</li>
          <li>Computed results: Minutes to hours</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Cache</h3>
        <p>
          Database internal caching (query cache, buffer pool). Transparent to application.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li>MySQL query cache (deprecated in 8.0)</li>
          <li>PostgreSQL shared buffers</li>
          <li>Redis as database (persistent cache)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Invalidation Cascade</h3>
        <p>
          When data changes, invalidate through all layers:
        </p>
        <ol>
          <li>Database: Data updated</li>
          <li>Application cache: Invalidate via pattern (delete, version increment)</li>
          <li>CDN: Purge via API or wait for TTL</li>
          <li>Browser: Wait for TTL or use cache-busting URLs</li>
        </ol>
        <p><strong>Challenge:</strong> Each layer has different invalidation mechanisms. Coordinate
        invalidation across layers.</p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Shortest TTL Wins</h3>
          <p>
            Data is only as fresh as the cache layer with the longest TTL. If browser caches for 1 hour
            but data changes every minute, users see stale data. Match TTLs across layers or use
            cache-busting techniques.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Problems & Solutions</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Stampede (Dog-Piling)</h3>
        <p>
          When popular cache entry expires, many requests simultaneously hit database, causing overload.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Solutions</h4>
        <ul>
          <li><strong>Probabilistic Early Expiration:</strong> Refresh cache before TTL expires (with
          probability increasing as TTL approaches)</li>
          <li><strong>Lock/Mutex:</strong> First request acquires lock, populates cache, releases lock.
          Others wait or serve stale.</li>
          <li><strong>Stale-While-Revalidate:</strong> Serve stale data while refreshing cache in
          background</li>
          <li><strong>Cache Warming:</strong> Pre-populate cache before high-traffic periods</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Penetration</h3>
        <p>
          Requests for non-existent keys bypass cache, hitting database every time. Attackers can exploit
          this to overload database.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Solutions</h4>
        <ul>
          <li><strong>Cache Null Values:</strong> Cache &quot;not found&quot; results with short TTL</li>
          <li><strong>Bloom Filters:</strong> Check if key exists before querying cache/database</li>
          <li><strong>Input Validation:</strong> Reject invalid keys early</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Avalanche</h3>
        <p>
          Many cache entries expire simultaneously, causing database overload. Often happens when cache
          is deployed or restarted.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Solutions</h4>
        <ul>
          <li><strong>Randomize TTLs:</strong> Add jitter to TTL to spread expirations</li>
          <li><strong>Staggered Warming:</strong> Warm cache gradually after deployment</li>
          <li><strong>Circuit Breakers:</strong> Protect database from overload</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Thundering Herd</h3>
        <p>
          Many requests wait for same lock when cache miss occurs. When lock releases, all requests
          proceed simultaneously.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Solutions</h4>
        <ul>
          <li><strong>Request Coalescing:</strong> Merge duplicate requests into single cache population</li>
          <li><strong>Semaphore Pattern:</strong> Limit concurrent cache population</li>
          <li><strong>Serve Stale:</strong> Serve stale data while one request refreshes</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Design for Cache Failures</h3>
          <p>
            Cache will fail—network issues, memory pressure, deployments. Design your system to degrade
            gracefully when cache is unavailable. Database should be able to handle load (perhaps with
            rate limiting) when cache misses increase.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Strategy</h3>
        <ul>
          <li>Choose consistency model per data type, not one-size-fits-all</li>
          <li>Use cache-aside for most read-heavy workloads</li>
          <li>Use write-through for data requiring strong consistency</li>
          <li>Set appropriate TTLs based on data freshness requirements</li>
          <li>Implement cache warming for predictable traffic patterns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Invalidation</h3>
        <ul>
          <li>Invalidate on writes for critical data</li>
          <li>Use version-based invalidation for atomic updates</li>
          <li>Implement tag-based invalidation for related data</li>
          <li>Have TTL as safety net even with explicit invalidation</li>
          <li>Monitor invalidation latency and success rate</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul>
          <li>Track cache hit rate per data type</li>
          <li>Monitor cache memory usage and eviction rates</li>
          <li>Alert on sudden drop in hit rate (indicates problems)</li>
          <li>Track cache latency (P50, P95, P99)</li>
          <li>Monitor database load (should decrease with effective caching)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operations</h3>
        <ul>
          <li>Plan cache warming strategy for deployments</li>
          <li>Test cache failure scenarios (game days)</li>
          <li>Document cache invalidation procedures</li>
          <li>Have runbooks for cache-related incidents</li>
          <li>Regular cache capacity planning</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Caching everything:</strong> Not all data benefits from caching. Cache frequently
            accessed, infrequently changed data.
          </li>
          <li>
            <strong>No TTL:</strong> Entries never expire, leading to stale data forever. Always set TTL
            as safety net.
          </li>
          <li>
            <strong>Inconsistent invalidation:</strong> Some code paths invalidate, others don&apos;t.
            Centralize invalidation logic.
          </li>
          <li>
            <strong>Cache stampede:</strong> Popular keys expire simultaneously. Use early expiration or
            stale-while-revalidate.
          </li>
          <li>
            <strong>Ignoring cache failures:</strong> System breaks when cache is down. Design for graceful
            degradation.
          </li>
          <li>
            <strong>Wrong data structures:</strong> Using string values for complex data. Use appropriate
            serialization (JSON, Protocol Buffers).
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know if cache is effective. Track hit rates, latency,
            memory usage.
          </li>
          <li>
            <strong>Multi-layer TTL mismatch:</strong> Browser caches longer than origin. Users see stale
            data. Coordinate TTLs across layers.
          </li>
          <li>
            <strong>Caching user-specific data with shared keys:</strong> Users see each other&apos;s data.
            Include user ID in cache key.
          </li>
          <li>
            <strong>No cache warming:</strong> Cold cache after deployment causes database spike. Implement
            cache warming.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What cache invalidation strategy would you use for a product catalog?</p>
            <p className="mt-2 text-sm">
              A: TTL-based with moderate TTL (5-15 minutes) since product data changes infrequently. Add
              explicit invalidation on product updates. Use cache-aside pattern. For high-traffic products,
              consider write-through to keep cache fresh. Monitor hit rate and adjust TTL based on access
              patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache stampede?</p>
            <p className="mt-2 text-sm">
              A: When cache expires, many requests hit database simultaneously. Solutions: (1) Probabilistic
              early expiration—refresh before TTL with increasing probability as TTL approaches. (2) Lock/mutex
              on cache miss—single request populates, others wait or serve stale. (3) Stale-while-revalidate—
              serve stale while refreshing in background.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between write-through and write-behind?</p>
            <p className="mt-2 text-sm">
              A: Write-through writes to cache and database synchronously—cache always consistent, slower
              writes. Write-behind writes to cache immediately, database asynchronously—faster writes, risk
              of data loss if cache fails before database write completes. Choose based on consistency vs
              performance requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure read-your-writes consistency?</p>
            <p className="mt-2 text-sm">
              A: Include version token in cache key, increment on write. Or use sticky sessions to same cache
              server. Or write user ID + version to cache key. After user writes, read from master database
              directly for a short window before using cache. Choose based on complexity tolerance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache failures?</p>
            <p className="mt-2 text-sm">
              A: Design for graceful degradation. Database should handle increased load (with rate limiting
              if needed). Implement circuit breakers to prevent database overload. Have fallback strategies
              (serve stale data, reduced functionality). Monitor cache health and alert on issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you monitor for caching?</p>
            <p className="mt-2 text-sm">
              A: Hit rate (overall and per data type), miss rate, eviction rate, memory usage, latency
              (P50/P95/P99), database load (should decrease with effective caching), invalidation latency
              and success rate. Alert on sudden changes in these metrics.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>Redis Documentation: <a href="https://redis.io" className="text-accent hover:underline">redis.io</a></li>
          <li>Martin Fowler: Caching Guide</li>
          <li>Google SRE Book: Caching</li>
          <li>&quot;Designing Data-Intensive Applications&quot; by Martin Kleppmann</li>
          <li>AWS ElastiCache Best Practices</li>
          <li>Cloudflare: Caching Best Practices</li>
          <li>&quot;The Art of Caching&quot; - Various engineering blogs</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
