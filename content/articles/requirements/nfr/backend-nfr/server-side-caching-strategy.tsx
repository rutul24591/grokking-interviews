"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-server-side-caching-extensive",
  title: "Server-Side Caching Strategy",
  description: "Comprehensive guide to server-side caching, covering cache patterns, invalidation strategies, distributed caching, cache coherence, and production reliability for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "server-side-caching-strategy",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "caching", "redis", "memcached", "performance", "cache-invalidation"],
  relatedTopics: ["caching-strategies", "distributed-caching", "cache-invalidation", "scalability-strategy"],
};

export default function ServerSideCachingStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Server-side caching</strong> stores frequently accessed data in fast, in-memory storage
          on the server side to reduce database load and improve response times. It is one of the most
          effective techniques for improving backend performance.
        </p>
        <p>
          Caching introduces complexity: cache invalidation, consistency management, and failure handling.
          Understanding these trade-offs is essential for staff/principal engineers.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Cache is a Copy</h3>
          <p>
            A cache is a copy of data that lives elsewhere. The fundamental challenge is keeping the copy
            synchronized with the source of truth. Every caching decision involves trade-offs between
            freshness, latency, and complexity.
          </p>
        </div>
      </section>

      <section>
        <h2>Caching Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/caching-deep-dive.svg"
          alt="Caching Deep Dive"
          caption="Caching Deep Dive — showing multi-level cache hierarchy (L1/L2/Database), cache eviction policies (LRU/LFU/TTL), and cache invalidation patterns"
        />
        <p>
          Advanced caching concepts for production systems:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Level Cache Hierarchy</h3>
        <p>
          Production systems often use multiple cache layers:
        </p>
        <ul>
          <li>
            <strong>L1 (In-Memory):</strong> Local cache within application process. ~1ms latency.
            Limited by single instance memory.
          </li>
          <li>
            <strong>L2 (Distributed):</strong> Redis or Memcached cluster. ~5ms latency.
            Shared across all application instances.
          </li>
          <li>
            <strong>Database:</strong> Source of truth. ~50ms latency.
            Queried only on cache miss.
          </li>
        </ul>
        <p>
          <strong>Flow:</strong> Check L1 → Check L2 → Query DB → Populate L2 → Populate L1
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Eviction Policies</h3>
        <p>
          When cache is full, which items to remove:
        </p>
        <ul>
          <li>
            <strong>LRU (Least Recently Used):</strong> Evict items not accessed recently.
            Most common, works well for most workloads.
          </li>
          <li>
            <strong>LFU (Least Frequently Used):</strong> Evict items with lowest access count.
            Better for workloads with stable hot items.
          </li>
          <li>
            <strong>TTL (Time-To-Live):</strong> Auto-expire after fixed duration.
            Simple, ensures data freshness.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Invalidation Patterns</h3>
        <p>
          How to keep cache consistent with source data:
        </p>
        <ul>
          <li>
            <strong>Cache-Aside (Lazy):</strong> Invalidate cache entry on data write.
            Next read will repopulate. Simple but may serve stale data briefly.
          </li>
          <li>
            <strong>Write-Through:</strong> Update cache and database together in transaction.
            Strong consistency but higher write latency.
          </li>
          <li>
            <strong>Write-Behind:</strong> Update cache immediately, async write to database.
            Low latency but risk of data loss if cache fails.
          </li>
          <li>
            <strong>Refresh-Ahead:</strong> Proactively refresh cache before TTL expires.
            Prevents cache stampede but requires predicting access patterns.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cache Patterns</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/server-side-caching-strategy.svg"
          alt="Server-Side Caching Patterns"
          caption="Server-Side Caching — showing Cache-Aside and Write-Through patterns, caching strategies comparison, and cache invalidation strategies"
        />
        <p>
          Several patterns govern how caches are used:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache-Aside (Lazy Loading)</h3>
        <p>
          Application checks cache first, falls back to database on miss, then populates cache.
        </p>
        <p>
          <strong>Flow:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Request arrives for data.</li>
          <li>Check cache for key.</li>
          <li>If hit: return cached value.</li>
          <li>If miss: query database, store in cache, return value.</li>
        </ol>
        <p>
          <strong>Best for:</strong> Read-heavy workloads with acceptable staleness.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Simple to implement.</li>
          <li>✓ Cache contains only requested data.</li>
          <li>✗ Cache miss latency = cache lookup + database query.</li>
          <li>✗ Stale data if database changes.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Through</h3>
        <p>
          Writes go to cache and database simultaneously. Cache is always consistent with database.
        </p>
        <p>
          <strong>Best for:</strong> Data that must be consistent (user profiles, inventory).
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Strong consistency.</li>
          <li>✓ Read performance (data always cached).</li>
          <li>✗ Write latency = max(cache write, database write).</li>
          <li>✗ Cache may contain data never read.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Behind (Write-Back)</h3>
        <p>
          Writes go to cache first, asynchronously flushed to database after delay.
        </p>
        <p>
          <strong>Best for:</strong> High write throughput where eventual consistency is acceptable.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Very low write latency.</li>
          <li>✓ Database load smoothing.</li>
          <li>✗ Risk of data loss if cache fails before flush.</li>
          <li>✗ Complex failure handling.</li>
        </ul>
      </section>

      <section>
        <h2>Cache Invalidation</h2>
        <p>
          <strong>Cache invalidation</strong> is the process of removing stale data from cache.
          It is notoriously difficult — one of the &quot;two hard things in computer science.&quot;
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Invalidation Strategies</h3>
        <p>
          <strong>TTL (Time-To-Live):</strong> Cache entries expire after fixed duration.
        </p>
        <ul>
          <li>✓ Simple, automatic.</li>
          <li>✗ Stale data until expiration.</li>
          <li>✗ Cache stampede if many keys expire together.</li>
        </ul>

        <p>
          <strong>Explicit Invalidation:</strong> Delete cache when data changes.
        </p>
        <ul>
          <li>✓ Fresh data on next read.</li>
          <li>✗ Must invalidate all copies (application cache, CDN, browser).</li>
          <li>✗ Complex with multiple writers.</li>
        </ul>

        <p>
          <strong>Cache Versioning:</strong> Include version in cache key.
        </p>
        <ul>
          <li>✓ Clean invalidation (increment version).</li>
          <li>✓ No race conditions.</li>
          <li>✗ Orphaned cache entries (old versions).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a caching layer for a news website with 1M concurrent readers. What cache pattern do you choose and why?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Pattern:</strong> Cache-aside for articles (read-heavy, TTL-based invalidation).</li>
                <li><strong>Multi-level caching:</strong> CDN (static assets) → Redis Cluster (article content) → Database.</li>
                <li><strong>TTL strategy:</strong> 1 hour for articles, 5 minutes for breaking news, 24 hours for evergreen content.</li>
                <li><strong>Cache key design:</strong> article:&#123;id&#125;:&#123;version&#125; for easy invalidation.</li>
                <li><strong>Stampede prevention:</strong> Probabilistic early expiration for hot articles.</li>
                <li><strong>Scale:</strong> 1M concurrent readers × 10 articles each = 10M cache entries. Redis Cluster with 100 nodes.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain cache stampede. How do you prevent it?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Problem:</strong> When popular key expires, thousands of requests hit database simultaneously.</li>
                <li><strong>Solution 1 - Mutex locks:</strong> First request acquires lock, populates cache, releases lock. Others wait.</li>
                <li><strong>Solution 2 - Probabilistic early expiration:</strong> Randomly expire cache early (80-120% of TTL). Spreads refresh load.</li>
                <li><strong>Solution 3 - Background refresh:</strong> Dedicated process refreshes hot keys before expiration.</li>
                <li><strong>Solution 4 - Cache-aside with locking:</strong> Use Redis SETNX for distributed lock.</li>
                <li><strong>Best practice:</strong> Combine mutex locks (immediate protection) + background refresh (proactive prevention).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your cache hit ratio dropped from 95% to 50% overnight. How do you diagnose and fix this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Diagnosis:</strong> (1) Check cache eviction rate (memory pressure?). (2) Check TTL settings (expired?). (3) Check for cache key changes (deployment issue?). (4) Check traffic patterns (new endpoints?).</li>
                <li><strong>Common causes:</strong> Cache flush/deployment, TTL too short, memory exhaustion, cache key mismatch after code deploy.</li>
                <li><strong>Fixes:</strong> Increase cache memory, adjust TTL based on access patterns, implement cache warming after deployments, add monitoring.</li>
                <li><strong>Prevention:</strong> Monitor cache hit ratio continuously, alert on sudden drops, implement cache warming for hot keys.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Compare Redis and Memcached. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Redis advantages:</strong> Rich data structures (lists, sets, hashes), persistence (RDB/AOF), pub/sub for invalidation, Lua scripting.</li>
                <li><strong>Memcached advantages:</strong> Simpler to operate, better for pure key-value, multi-threaded (better CPU utilization).</li>
                <li><strong>Choose Redis when:</strong> Need data structures, persistence, pub/sub, or advanced features.</li>
                <li><strong>Choose Memcached when:</strong> Simple key-value caching, multi-threading important, operational simplicity preferred.</li>
                <li><strong>Modern trend:</strong> Redis more popular due to feature richness. Memcached still used for simple, high-throughput caching.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design a cache invalidation strategy for an e-commerce product catalog with frequent price updates.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Cache structure:</strong> Redis cache with product_id as key. TTL = 1 hour for most products, 5 minutes for frequently changing prices.</li>
                <li><strong>Invalidation strategy:</strong> (1) Write-through cache for price updates (update cache + DB together). (2) Event-driven invalidation (publish price change event, invalidate cache). (3) Versioned cache keys (product_v1, product_v2).</li>
                <li><strong>Multi-level caching:</strong> L1 (in-memory, 5 min TTL) + L2 (Redis, 1 hour TTL) + Database.</li>
                <li><strong>Cache stampede prevention:</strong> Use mutex locks or probabilistic early expiration for hot products.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you handle cache consistency in a multi-region deployment?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Cache topology:</strong> Local cache (in-memory) + Regional cache (Redis Cluster per region) + Global cache (for hot content).</li>
                <li><strong>Consistency model:</strong> Eventual consistency across regions. Read-your-writes for user&apos;s own content.</li>
                <li><strong>Invalidation:</strong> Publish invalidation events to all regions via Kafka. Each region invalidates local cache.</li>
                <li><strong>Cache key design:</strong> Include region for locality (feed:&#123;user_id&#125;:&#123;region&#125;:&#123;timestamp&#125;).</li>
                <li><strong>TTL strategy:</strong> Short TTL (5 min) for feeds, long TTL (1 hour) for static content. Stale-while-revalidate for graceful degradation.</li>
                <li><strong>Trade-off:</strong> Cross-region consistency adds latency. Accept eventual consistency for better performance.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Caching Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Identified cacheable data (high read frequency, low write frequency)</li>
          <li>✓ Selected appropriate cache pattern (cache-aside, write-through, write-behind)</li>
          <li>✓ Defined TTL and invalidation strategy</li>
          <li>✓ Implemented cache stampede protection</li>
          <li>✓ Configured cache eviction policy</li>
          <li>✓ Set up cache monitoring (hit ratio, eviction rate, memory usage)</li>
          <li>✓ Planned cache warming strategy</li>
          <li>✓ Documented cache failure handling</li>
          <li>✓ Tested cache behavior under load</li>
          <li>✓ Established cache capacity planning</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
