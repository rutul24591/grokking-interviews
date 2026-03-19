"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-caching-consistency-strategy-extensive",
  title: "Caching Consistency Strategy",
  description: "Comprehensive guide to caching consistency strategies, covering cache invalidation patterns, consistency models, distributed caching, and cache coherence for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "caching-consistency-strategy",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
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
          simultaneously. Caching strategies make explicit trade-offs based on use case requirements.
        </p>
        <p>
          <strong>Key considerations:</strong>
        </p>
        <ul>
          <li><strong>Consistency Model:</strong> Strong, eventual, or somewhere in between?</li>
          <li><strong>Invalidation Strategy:</strong> When and how to invalidate stale cache entries?</li>
          <li><strong>Cache Layers:</strong> Browser, CDN, application, database — each with different TTLs.</li>
          <li><strong>Write Patterns:</strong> How do writes propagate through cache layers?</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Cache Invalidation Is Hard</h3>
          <p>
            There are only two hard things in Computer Science: cache invalidation and naming things.
            The difficulty isn&apos;t invalidating — it&apos;s knowing <em>when</em> to invalidate without
            sacrificing performance benefits.
          </p>
        </div>
      </section>

      <section>
        <h2>Consistency Models for Caching</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Strong Consistency</h3>
        <p>Read always returns most recent write. Requires cache invalidation on every write.</p>
        <ul>
          <li><strong>Use Case:</strong> Financial transactions, inventory counts.</li>
          <li><strong>Cost:</strong> Higher latency, reduced cache effectiveness.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eventual Consistency</h3>
        <p>Read may return stale data temporarily, but will converge to latest value.</p>
        <ul>
          <li><strong>Use Case:</strong> Social feeds, product catalogs, user profiles.</li>
          <li><strong>Benefit:</strong> Maximum cache effectiveness, low latency.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Read-Your-Writes</h3>
        <p>User always sees their own writes immediately, others may see stale data.</p>
        <ul>
          <li><strong>Implementation:</strong> Version tokens, user-specific cache keys.</li>
          <li><strong>Use Case:</strong> User settings, drafts, comments.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monotonic Reads</h3>
        <p>Once a user sees a value, they never see older values.</p>
        <ul>
          <li><strong>Implementation:</strong> Sticky cache servers, version tracking.</li>
        </ul>
      </section>

      <section>
        <h2>Cache Invalidation Patterns</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache-Aside (Lazy Loading)</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`def get_data(key):
    data = cache.get(key)
    if data is None:
        data = db.query(key)
        cache.set(key, data, ttl=300)
    return data`}
        </pre>
        <p><strong>Invalidation:</strong> Delete cache entry on write. Cache repopulates on next read.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Through</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`def update_data(key, data):
    db.write(key, data)
    cache.set(key, data, ttl=300)  # Synchronous`}
        </pre>
        <p><strong>Benefit:</strong> Cache always consistent with database.</p>
        <p><strong>Cost:</strong> Write latency includes cache write.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Behind (Write-Back)</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`def update_data(key, data):
    cache.set(key, data, ttl=300)
    queue.async_write_to_db(key, data)  # Asynchronous`}
        </pre>
        <p><strong>Benefit:</strong> Fast writes, batches database writes.</p>
        <p><strong>Risk:</strong> Data loss if cache fails before write completes.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Time-Based Expiration (TTL)</h3>
        <p>Cache entries expire after fixed time. Simple but may serve stale data or miss cache frequently.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version-Based Invalidation</h3>
        <p>Include version in cache key. Increment version on write to invalidate all old entries.</p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`cache_key = f"user:{user_id}:v{version}"`}
        </pre>
      </section>

      <section>
        <h2>Distributed Cache Coherence</h2>
        <p>
          When multiple cache nodes exist, keeping them coherent is challenging:
        </p>
        <ul>
          <li><strong>Publish-Subscribe:</strong> Publish invalidation events, subscribers invalidate local cache.</li>
          <li><strong>Cache Cluster:</strong> Centralized cache (Redis, Memcached) — single source of truth.</li>
          <li><strong>Consistent Hashing:</strong> Deterministic mapping of keys to cache nodes.</li>
          <li><strong>Quorum Reads/Writes:</strong> Read/write from multiple nodes for consistency.</li>
        </ul>
      </section>

      <section>
        <h2>Multi-Layer Caching</h2>
        <p>
          Typical web application cache layers:
        </p>
        <ul>
          <li><strong>Browser Cache:</strong> Static assets, API responses (Cache-Control headers).</li>
          <li><strong>CDN Cache:</strong> Static content, edge-computed responses.</li>
          <li><strong>Application Cache:</strong> In-memory (Redis, Memcached) for database query results.</li>
          <li><strong>Database Cache:</strong> Query cache, buffer pool.</li>
        </ul>
        <p><strong>Challenge:</strong> Each layer has different TTL. Invalidation must cascade through all layers.</p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What cache invalidation strategy would you use for a product catalog?</p>
            <p className="mt-2 text-sm">
              A: TTL-based with moderate TTL (5-15 minutes) since product data changes infrequently. Add
              explicit invalidation on product updates. Use cache-aside pattern. For high-traffic products,
              consider write-through to keep cache fresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache stampede?</p>
            <p className="mt-2 text-sm">
              A: When cache expires, many requests hit database simultaneously. Solutions: (1) Probabilistic
              early expiration (refresh before TTL), (2) Lock/mutex on cache miss (single request populates),
              (3) Stale-while-revalidate (serve stale while refreshing in background).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between write-through and write-behind?</p>
            <p className="mt-2 text-sm">
              A: Write-through writes to cache and database synchronously — cache always consistent, slower
              writes. Write-behind writes to cache immediately, database asynchronously — faster writes, risk
              of data loss if cache fails before database write completes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure read-your-writes consistency?</p>
            <p className="mt-2 text-sm">
              A: Include version token in cache key, increment on write. Or use sticky sessions to same cache
              server. Or write user ID + version to cache key. After user writes, read from master database
              directly for a short window before using cache.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
