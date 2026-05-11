"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-frontend-caching-layer",
  title: "Design a Frontend Caching Layer",
  description:
    "Production-grade client-side caching system with TTL, tag-based invalidation, LRU eviction, stale-while-revalidate, and memory management for high-traffic SPAs.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "frontend-caching-layer",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "caching",
    "ttl",
    "lru-eviction",
    "stale-while-revalidate",
    "memory-management",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "cache-invalidation-strategy",
    "request-deduplication-system",
  ],
};

export default function FrontendCachingLayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Frontend SPAs fetch data repeatedly from APIs. Without caching, each component fetch = network request. Consider: user navigates to profile page (GET /user/123), then navigates away, then back to profile (GET /user/123 again). Second fetch is redundant—server hasn't changed in 5 seconds. Naive solution: global cache storing all responses. Works, but problems emerge: cache grows unbounded (50MB limit on mobile—crash), stale data (user updates name, cached profile still shows old name), cache thrashing (too many evictions = slow).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Solution: in-memory caching layer with smart invalidation. Cache stores responses with TTLs (expire after 5 minutes). Use tag-based invalidation (tag user data with 'user' label; when user updates, invalidate all queries tagged 'user'). Support stale-while-revalidate (serve stale data immediately, refetch in background). Manage memory (LRU eviction when size exceeds limit). At scale (100+ queries, millions of users), caching layer is critical for performance.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key challenges: (1) Staleness vs freshness (short TTL = fresh data, more refetches; long TTL = fewer requests, stale data). (2) Memory management (unbounded cache causes memory leak on mobile). (3) Tag-based invalidation (complex to track which queries have which tags). (4) Offline support (serve stale data when network down). (5) Performance (cache lookup must be &lt;1ms).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> React SPA with 100+ queries cached. Memory limited (~50MB on mobile). Different data has different freshness needs. Mutations trigger invalidation. Network may be intermittent. Cache lookup should be O(1).
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Cache Storage:</strong> Store API responses by cache key.
          </HighlightBlock>
          <li>
            <strong>TTL Expiration:</strong> Each entry has a time-to-live. After
            expiration, mark stale.
          </li>
          <li>
            <strong>Tag-Based Invalidation:</strong> Queries tagged with labels
            (e.g., &apos;user&apos;, &apos;feed&apos;). Invalidate all queries with a tag.
          </li>
          <li>
            <strong>Stale-While-Revalidate:</strong> Serve stale data immediately,
            refetch background.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Memory Management:</strong> Max cache size with LRU eviction.
          </HighlightBlock>
          <li>
            <strong>Offline Support:</strong> Serve stale data when offline.
          </li>
          <li>
            <strong>Manual Invalidation:</strong> Programmatic cache clearing via
            tags or keys.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Lookup Performance:</strong> O(1) cache lookups via hash table.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Invalidation Performance:</strong> O(k) tag-based invalidation
            where k is affected entries.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Memory Bounded:</strong> Cache size never exceeds max size.
          </HighlightBlock>
          <li>
            <strong>Persistence:</strong> Optionally persist to localStorage for
            offline availability.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Cache full, new entry added → LRU eviction removes least-used entry.</li>
          <li>Entry expired while refetch in-flight → serve stale, update when refetch completes.</li>
          <li>Multiple mutations invalidate overlapping tags → coalesce invalidations.</li>
          <li>Network comes online after offline period → refetch invalidated entries.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">On cache hit, return data (stale or fresh). On cache miss, initiate fetch and</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">cache result. On invalidation, mark matching entries as stale and queue refetch. Memory usage is monitored, and LRU eviction kicks in when size exceeds threshold.</HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cache Entry Structure</h3>
        <HighlightBlock as="p" tier="important">
          Each cache entry encapsulates data, metadata, and state.
        </HighlightBlock>
        <ul className="space-y-2">
          <li>
            <strong>data:</strong> The cached API response.
          </li>
          <li>
            <strong>timestamp:</strong> When entry was cached.
          </li>
          <li>
            <strong>ttl:</strong> Time-to-live in milliseconds. Entry is stale after
            timestamp + ttl.
          </li>
          <li>
            <strong>tags:</strong> Set of tags (e.g., [&apos;user&apos;, &apos;profile&apos;]).
          </li>
          <li>
            <strong>status:</strong> &apos;fresh&apos;, &apos;stale&apos;, or &apos;fetching&apos;.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>dependents:</strong> Set of cache keys that depend on this entry
            (for cascading invalidation).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">TTL-Based Expiration</h3>
        <HighlightBlock as="p" tier="important">
          Each entry has a configurable TTL. On access, the cache checks if current
          time exceeds (timestamp + ttl). If so, mark as stale.
        </HighlightBlock>
        <ul className="space-y-2">
          <li>
            <strong>Lazy Expiration:</strong> Entries are not actively expired. Only
            checked on access (avoid background timers).
          </li>
          <li>
            <strong>Stale-While-Revalidate:</strong> Stale data is served immediately
            while background refetch is triggered.
          </li>
          <li>
            <strong>Different TTLs:</strong> Different queries can have different TTLs
            (user profile: 5min, feed: 30sec).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Tag-Based Invalidation</h3>
        <p>
          A tag index maps each tag to a set of cache keys. On invalidation, look up
          all keys for a tag and mark them stale.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Tag Index:</strong> Map&lt;tag, Set&lt;cacheKey&gt;&gt; for O(1)
            tag lookup.
          </HighlightBlock>
          <li>
            <strong>Multi-tag Entries:</strong> An entry can have multiple tags. It
            appears in multiple tag sets.
          </li>
          <li>
            <strong>Cascading Invalidation:</strong> When a primary entry invalidates,
            dependent entries also invalidate.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">LRU Eviction</h3>
        <p>
          When cache exceeds max size, remove the least-recently-used entry. LRU is
          implemented using a doubly-linked list where the head is the most-used and
          tail is least-used.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Access Tracking:</strong> On each cache access, move entry to
            head of list.
          </li>
          <li>
            <strong>Eviction:</strong> When cache full, remove tail entry.
          </li>
          <li>
            <strong>Cleanup:</strong> When evicting, also remove from tag index and
            dependents.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Stale-While-Revalidate Pattern</h3>
        <p>
          When a cached entry is stale, return it immediately while triggering a
          background refetch. Once refetch completes, update the cache and notify
          subscribers.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Immediate Return:</strong> Return stale data without waiting for
            refetch.
          </li>
          <li>
            <strong>Background Refetch:</strong> Queue fetch in background.
          </li>
          <li>
            <strong>Notification:</strong> When refetch completes, notify subscribers
            (via callback or event emitter).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Memory Management</h3>
        <HighlightBlock as="p" tier="crucial">
          Cache size is bounded. Memory pressure is monitored, and entries are
          evicted aggressively when approaching limit.
        </HighlightBlock>
        <ul className="space-y-2">
          <li>
            <strong>Size Calculation:</strong> Estimate entry size via
            JSON.stringify(data).length.
          </li>
          <li>
            <strong>Max Size:</strong> Configurable (default 50MB). When exceeded,
            trigger LRU eviction.
          </li>
          <li>
            <strong>Eviction Threshold:</strong> Start eviction at 80% of max size to
            avoid thrashing.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Persistence</h3>
        <p>
          Optionally persist cache to localStorage for offline availability. On app
          load, hydrate from localStorage.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Serialization:</strong> Serialize cache entries to JSON and store
            in localStorage.
          </li>
          <li>
            <strong>Hydration:</strong> On app startup, restore cache from
            localStorage.
          </li>
          <li>
            <strong>Size Limit:</strong> localStorage has size limit (~5-10MB). Only
            persist critical data.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Subscription System</h3>
        <p>
          Components can subscribe to cache updates. When a cache entry updates,
          notify subscribers.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Subscribe:</strong> Components register listeners on specific
            cache keys or tags.
          </li>
          <li>
            <strong>Notify:</strong> On cache update, call all listeners.
          </li>
          <li>
            <strong>Unsubscribe:</strong> Cleanup listeners on component unmount.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Thread Safety</h3>
        <HighlightBlock as="p" tier="important">
          JavaScript is single-threaded, so race conditions are minimal. However,
          async operations can interleave. Use proper synchronization for concurrent
          mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Clock Skew</h3>
        <HighlightBlock as="p" tier="important">
          Relying on system clock for TTL expiration is vulnerable to clock skew if
          user changes system time. Consider using relative timers or persisting TTL
          as a duration rather than timestamp.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Invalidation Strategies</h3>
        <HighlightBlock as="p" tier="important">
          Support multiple invalidation triggers: manual invalidation, mutation-based
          (post created → invalidate posts list), and time-based (TTL expiration).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Compression</h3>
        <HighlightBlock as="p" tier="crucial">
          For large cached objects, consider compression (e.g., LZ4, Brotli) to
          reduce memory footprint.
        </HighlightBlock>
      </section>

      <section>
        <h2>Cache Architecture and Data Flow</h2>

        <HighlightBlock as="p" tier="important">
          The caching layer sits between components and the network. Components request data via get(key). The cache checks: (1) Is entry in memory? (2) Is it fresh? If yes, return. If stale, serve stale + refetch. If miss, fetch from network, cache result. The cache maintains multiple indices: primary cache map (key → entry), tag index (tag → set of keys), LRU list (ordered by recency), and memory tracker (total size).
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/frontend-caching-architecture.svg"
          alt="Frontend caching layer architecture and data flow diagram"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Hit vs Miss Scenarios</h3>
        <HighlightBlock as="p" tier="important">
          Hit (Fresh): Entry exists, timestamp + ttl &gt; now. Return immediately. Latency: &lt;1ms. Hit (Stale): Entry exists, timestamp + ttl &lt;= now. Return stale data, trigger background refetch. Latency: &lt;1ms for data, async refetch. Miss: Entry not in cache. Initiate network fetch. Latency: network RTT (~100-300ms). Cache the response for future hits.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tag Index Mechanics</h3>
        <HighlightBlock as="p" tier="important">
          Tag index enables efficient invalidation. Example: cache has entries user-123 (tags: [user, profile]), posts-123 (tags: [user, feed]). When user logs out, invalidate tag 'user'. Look up tag in index: get [user-123, posts-123]. Mark both stale. Cost: O(k) where k is affected entries. Without tag index, must scan all entries: O(n). Tag index makes invalidation practical.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">LRU Eviction Deep Dive</h3>
        <HighlightBlock as="p" tier="important">
          LRU tracks access recency. Doubly-linked list: head = most recent, tail = least recent. On access, move entry to head. When cache full, remove tail. Cost: O(1) per operation with doubly-linked list. Alternative: timestamp-based eviction (evict oldest). LRU better reflects actual usage patterns. Under memory pressure, LRU prevents evicting frequently-used entries.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Pressure and Eviction Policies</h3>
        <p>
          When cache reaches 80% of max size, start evictions. This buffer prevents thrashing (constant eviction). Strategy: evict oldest LRU entry. If still over limit after one eviction, continue. Alternatively, batch eviction: when over limit, evict 10% of cache at once, then stop. Batch reduces eviction churn but more bursty. Monitor memory growth. If memory grows despite eviction, indicates leak (entries not being accessed, never reaching LRU tail).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Validation and Corruption Detection</h3>
        <p>
          Cache entries can become corrupted (malformed JSON, missing required fields). Validation on cache set ensures only valid data cached. Validation on cache get detects corruption. If corrupted, delete entry, return miss, refetch. Optional: store checksum with entry. On retrieval, verify checksum. If mismatch, data corrupted, discard. Prevents serving corrupted data to UI.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Expiration Policies and Staleness Visibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Different queries have different freshness needs. API config specifies TTL per query: GET /user → 5min, GET /feed → 30sec. Query returning stale data should include freshness indicator so UI can show "Showing cached data" badge. This transparency helps users understand data age. For critical data (financial, security), show stale clearly. For non-critical (timeline), show subtly or not at all.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Memory vs Network</h3>
        <HighlightBlock as="p" tier="important">
          Caching trades memory for network savings. On constrained devices (mobile),
          memory is precious. Balance cache size with device capabilities.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Consistency vs Availability</h3>
        <HighlightBlock as="p" tier="crucial">
          Serving stale data improves availability but risks consistency. Indicate
          staleness to users (&quot;Showing cached data&quot;).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Eager vs Lazy Invalidation</h3>
        <HighlightBlock as="p" tier="important">
          Eager invalidation (immediately mark stale on mutation) ensures freshness
          but triggers unnecessary refetches. Lazy invalidation (wait for next access)
          reduces refetches but serves stale data longer.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Library vs Custom</h3>
        <HighlightBlock as="p" tier="important">
          Consider using a library like TanStack Query or Redux if caching needs
          grow complex. Custom implementations work for simple cases.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cache Coherency in Distributed Settings</h3>
        <HighlightBlock as="p" tier="important">
          In multi-region deployments, users access from different regions with
          different caches. Solutions: invalidate on mutation, emit server-to-client
          events, or use version vectors for eventual consistency. Necessary for
          consistency across regions.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Adaptive TTL & Cache Warming</h3>
        <HighlightBlock as="p" tier="crucial">
          Implement policy-based TTL per data type (profiles: 5min, feeds: 30sec).
          Pre-populate critical cache on startup to reduce perceived latency.
          Smart retry: show app while warm-up pending, fill in as data arrives.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cache Stampede Prevention</h3>
        <p>
          When popular entry expires, 1000 concurrent requests cause thundering herd.
          Solutions: probabilistic early expiration, stale-while-revalidate, or
          distributed locking. Critical at 1M user scale.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Compression & Metrics</h3>
        <p>
          Large objects consume memory; use LZ4/Brotli compression. Track hit rate,
          miss rate, eviction rate, memory usage. Alert on unbounded growth
          (indicates leak or misconfiguration).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Testing & Storage Gotchas</h3>
        <HighlightBlock as="p" tier="important">
          Mock clock with jest.useFakeTimers() for TTL tests. localStorage is
          synchronous and quota-limited (~5-10MB). Never block critical path;
          load async. Use IndexedDB for large/persistent data.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Schema Versioning & Poisoning Prevention</h3>
        <p>
          Version cache entries; invalidate if format changes. Use checksums on
          cached data to detect corruption. Implement circuit breaker: if 10% of
          hits invalid, disable cache temporarily.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Multi-Tab Sync & Real-World Lessons</h3>
        <HighlightBlock as="p" tier="important">
          Sync cache across tabs via StorageEvent or BroadcastChannel API for
          consistency. Avoid the localStorage performance trap: large objects block
          main thread. Cache invalidation remains hard; use event-driven approach.
          Stale-while-revalidate improves perception but users see old data briefly.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration & Scale Considerations</h3>
        <HighlightBlock as="p" tier="important">
          Tightly integrate cache with data fetching hook. On mutation, invalidate
          related entries. Use tags to declare relationships. At 1M users, LRU
          eviction non-negotiable. Modern browsers handle ~50MB reasonably.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Real-world systems face storage quota limits, serialization bottlenecks, and complex invalidation logic. Libraries like TanStack</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Query/Redux handle many concerns, but deep understanding of underlying design is essential for optimizing, debugging, and extending at scale. Production systems require careful monitoring, testing, and incident response procedures for cache-related failures.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
