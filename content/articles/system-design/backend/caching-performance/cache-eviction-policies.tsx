"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cache-eviction-policies-complete",
  title: "Cache Eviction Policies",
  description:
    "Comprehensive guide to cache eviction policies: LRU, LFU, FIFO, ARC, and adaptive eviction strategies with production-scale trade-off analysis.",
  category: "backend",
  subcategory: "caching-performance",
  slug: "cache-eviction-policies",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-03",
  tags: ["backend", "caching", "eviction", "lru", "lfu", "redis"],
  relatedTopics: [
    "caching-strategies",
    "cache-invalidation",
    "distributed-caching",
    "multi-level-caching",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/caching-performance";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Cache Eviction Policies</h1>
        <p className="lead">
          Cache eviction policies determine which data to remove from the cache when it reaches
          capacity. Since cache memory is finite (and expensive), not all data can be cached
          indefinitely. The eviction policy decides what stays and what goes—a decision that
          directly impacts cache hit rate, latency, and database load. The right eviction policy
          can improve hit rates by 20-40%, reduce database load proportionally, and ensure that
          the most valuable data remains cached under memory pressure.
        </p>

        <p>
          Consider a Redis cache with 10 GB capacity storing product data for an e-commerce site
          with 10 million products. If each product is 1 KB, the cache can hold 10 million entries,
          but the product catalog has 100 million products. When the cache fills up, the eviction
          policy decides which 90 million products to evict and which 10 million to keep. A poor
          policy (random eviction) evicts hot products, causing cache misses and database overload.
          A good policy (LRU—Least Recently Used) keeps the 10 million most recently accessed
          products, which are likely the most popular, maximizing the cache hit rate.
        </p>

        <p>
          Eviction policies fall into two categories: <strong>recency-based</strong> (evict based
          on when data was last accessed: LRU, MRU, FIFO) and <strong>frequency-based</strong>
          (evict based on how often data is accessed: LFU, LFUDA). Advanced policies combine both
          (ARC—Adaptive Replacement Cache, TinyLFU) to handle complex access patterns. Each policy
          has different computational overhead, memory overhead, and effectiveness for different
          workloads.
        </p>

        <p>
          This article provides a comprehensive examination of cache eviction policies: LRU (Least
          Recently Used), LFU (Least Frequently Used), FIFO (First In, First Out), MRU (Most
          Recently Used), ARC (Adaptive Replacement Cache), and TinyLFU. We'll explore when each
          policy excels (LRU for general workloads, LFU for stable hot data, ARC for mixed
          workloads), the trade-offs between hit rate and computational overhead, and real-world
          implementations (Redis, Memcached, Caffeine). We'll also cover implementation details
          (doubly-linked lists, frequency counters, probabilistic data structures) and common
          pitfalls (scan resistance, cache pollution, frequency aging).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/eviction-policies-overview.svg`}
          caption="Figure 1: Cache Eviction Policies Overview showing six core policies. LRU (Least Recently Used): Evicts the oldest accessed item, uses doubly-linked list, O(1) operations, best for general workloads. LFU (Least Frequently Used): Evicts the least frequently accessed item, uses frequency counters, handles recency bias poorly, best for stable hot data. FIFO (First In, First Out): Evicts the oldest inserted item, simple queue, O(1) operations, ignores access patterns. MRU (Most Recently Used): Evicts the most recently accessed item, best for scan-heavy workloads. ARC (Adaptive Replacement Cache): Combines LRU and LFU, adapts to workload automatically, higher memory overhead. TinyLFU: Probabilistic frequency counters, O(1) space, scan-resistant, used in Caffeine. Each policy has different hit rate, computational cost, and memory overhead characteristics."
          alt="Cache eviction policies overview"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: How Eviction Policies Work</h2>

        <h3>LRU (Least Recently Used)</h3>
        <p>
          LRU evicts the item that was accessed least recently. It maintains a doubly-linked list
          ordered by access time: when an item is accessed, it moves to the front of the list;
          when the cache is full, the item at the back of the list (least recently used) is
          evicted. This policy assumes that recently accessed data is likely to be accessed again
          soon (temporal locality), which holds for most web workloads.
        </p>

        <p>
          LRU is implemented with a hash map (for O(1) lookups) and a doubly-linked list (for
          O(1) reordering). When an item is accessed, it is removed from its current position in
          the list and inserted at the front. When eviction is needed, the last item in the list
          is removed. This provides O(1) time complexity for both get and put operations, making
          LRU efficient for large caches.
        </p>

        <p>
          LRU is the default eviction policy in Redis, Memcached, and most application-level
          caches (Caffeine, Guava). It works well for general workloads where hot data is accessed
          frequently and cold data is rarely accessed. However, LRU is vulnerable to scan
          pollution: if the workload scans through a large dataset, each scanned item becomes
          "recently used" and pushes hot items out of the cache, degrading the hit rate.
        </p>

        <h3>LFU (Least Frequently Used)</h3>
        <p>
          LFU evicts the item that was accessed least frequently. It maintains a frequency counter
          for each item, incremented on each access. When the cache is full, the item with the
          lowest frequency counter is evicted. This policy assumes that frequently accessed data
          is more valuable than infrequently accessed data, regardless of recency.
        </p>

        <p>
          LFU is implemented with a hash map and a min-heap (or frequency buckets). Each item
          has a frequency counter, and the min-heap orders items by frequency. On access, the
          frequency is incremented and the item is repositioned in the heap. On eviction, the
          item with the lowest frequency is removed from the heap. This provides O(log N) time
          complexity for get and put operations (or O(1) with frequency bucket optimization).
        </p>

        <p>
          LFU excels at keeping stable hot data in the cache, even if that data hasn't been
          accessed recently. For example, a product that is popular but not accessed in the last
          hour would be kept by LFU (high frequency) but evicted by LRU (not recently accessed).
          However, LFU has a recency bias problem: items with high historical frequency are kept
          even if their access pattern has changed, and it takes many accesses for new items to
          build up enough frequency to survive eviction.
        </p>

        <h3>FIFO (First In, First Out)</h3>
        <p>
          FIFO evicts the item that was inserted earliest, regardless of access patterns. It
          maintains a simple queue: new items are added to the back, and evicted items are removed
          from the front. This is the simplest eviction policy, requiring only a queue and a hash
          map.
        </p>

        <p>
          FIFO ignores access patterns entirely, making it ineffective for workloads with
          temporal locality (hot data). However, it is computationally cheap (O(1) for both get
          and put) and has minimal memory overhead (no linked list reordering). FIFO is rarely
          used as a standalone policy but is used as a building block in more advanced policies
          (e.g., Clock, ARC).
        </p>

        <h3>ARC (Adaptive Replacement Cache)</h3>
        <p>
          ARC combines LRU and LFU by maintaining four lists: T1 (recent, evicted once), T2
          (frequent, evicted multiple times), B1 (ghost entries for T1), and B2 (ghost entries
          for T2). Ghost entries store metadata (keys) for recently evicted items without storing
          the actual data. ARC adapts to the workload by adjusting the relative sizes of T1 and
          T2 based on cache hits in B1 and B2.
        </p>

        <p>
          When a cache hit occurs in B1 (recent evicted), ARC increases the size of T1 (favoring
          recency). When a hit occurs in B2 (frequent evicted), ARC increases the size of T2
          (favoring frequency). This allows ARC to automatically adapt to the workload: if the
          workload is recency-heavy, ARC behaves more like LRU; if it is frequency-heavy, ARC
          behaves more like LFU.
        </p>

        <p>
          ARC outperforms LRU on most workloads, particularly those with mixed recency and
          frequency patterns. However, ARC has higher memory overhead (four lists instead of one)
          and more complex implementation. It is used in ZFS's Adaptive Replacement Cache and
          some distributed caches.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/lru-lfu-comparison.svg`}
          caption="Figure 2: LRU vs LFU Eviction Comparison showing the key differences. LRU: Orders by recency of access, evicts least recently used, uses doubly-linked list, O(1) operations, vulnerable to scan pollution, best for general workloads with temporal locality. LFU: Orders by frequency of access, evicts least frequently used, uses frequency counters or min-heap, O(log N) or O(1) operations, vulnerable to recency bias, best for stable hot data. The diagram shows an example: Item A (accessed 100 times, last 1 hour ago) and Item B (accessed 1 time, last 1 minute ago). LRU evicts A (not recently accessed). LFU keeps A (high frequency). This illustrates the fundamental trade-off: LRU favors recency, LFU favors frequency."
          alt="LRU vs LFU comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Patterns</h2>

        <h3>LRU Implementation Details</h3>
        <p>
          LRU is implemented using a hash map and a doubly-linked list. The hash map maps keys to
          nodes in the linked list, providing O(1) lookups. The doubly-linked list maintains the
          access order: the most recently accessed item is at the front, and the least recently
          accessed item is at the back.
        </p>

        <p>
          On a get(key) operation, the hash map is consulted to find the node. If the key exists,
          the node is moved to the front of the list (O(1) with a doubly-linked list) and the
          value is returned. If the key doesn't exist, null is returned. On a put(key, value)
          operation, if the key exists, the value is updated and the node is moved to the front.
          If the key doesn't exist and the cache is full, the last node (LRU) is evicted from both
          the list and the hash map, and the new key-value pair is inserted at the front.
        </p>

        <p>
          Redis implements LRU using an approximation: instead of maintaining a full doubly-linked
          list (which has high memory overhead), Redis samples a small number of keys (default 5)
          and evicts the least recently used among the sampled keys. This provides a good
          approximation of true LRU with much lower memory overhead. The sample size is
          configurable (maxmemory-samples), and increasing it improves LRU accuracy at the cost
          of slightly more CPU.
        </p>

        <h3>TinyLFU: Probabilistic Frequency Counting</h3>
        <p>
          TinyLFU is a modern eviction policy that uses probabilistic data structures (Count-Min
          Sketch) to track frequency with minimal memory overhead. It maintains a frequency sketch
          that approximates the frequency of each item using a small, fixed-size data structure
          (typically a few hundred KB regardless of cache size).
        </p>

        <p>
          When a new item is considered for admission, TinyLFU compares its frequency (from the
          sketch) with the frequency of the victim (the item that would be evicted by a FIFO
          policy). If the new item has higher frequency, it is admitted; otherwise, it is rejected.
          This admission policy ensures that only items with sufficient frequency are cached,
          filtering out one-time accesses (scan pollution).
        </p>

        <p>
          TinyLFU also implements a frequency decay mechanism: periodically, all frequency counters
          are halved, ensuring that historical frequency doesn't dominate recent access patterns.
          This solves the recency bias problem of pure LFU: items with high historical frequency
          but recent inactivity will have their frequencies decayed, allowing new items to compete.
          TinyLFU is used in Caffeine (the high-performance Java caching library) and is the
          basis for many modern cache implementations.
        </p>

        <h3>Scan Resistance</h3>
        <p>
          Scan pollution occurs when a workload scans through a large dataset, causing each scanned
          item to become "recently used" and pushing hot items out of the cache. LRU is vulnerable
          to scan pollution because every scanned item is moved to the front of the LRU list.
        </p>

        <p>
          Scan-resistant policies (TinyLFU, ARC) detect and filter out scans. TinyLFU uses
          frequency-based admission: one-time scanned items have low frequency and are rejected
          from the cache. ARC uses ghost entries to detect when recently evicted items are
          re-requested (indicating a scan), and adjusts the cache to favor frequency over recency.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/eviction-architecture.svg`}
          caption="Figure 3: Eviction Policy Architecture showing LRU implementation with Hash Map + Doubly-Linked List. Hash Map provides O(1) lookup by key. Doubly-Linked List maintains access order: most recent at head, least recent at tail. On access: node moved to head (O(1)). On eviction: tail node removed (O(1)). Redis Approximation: samples N keys (default 5), evicts LRU among samples (lower memory overhead, good approximation). TinyLFU Architecture: Count-Min Sketch for probabilistic frequency counting (fixed memory overhead), FIFO for candidate eviction, admission filter compares new item frequency vs victim frequency, frequency decay halves counters periodically (solves recency bias). The diagram shows the data flow for each architecture."
          alt="Eviction policy architecture"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          Choosing an eviction policy involves trade-offs between hit rate, computational overhead,
          memory overhead, and scan resistance. No single policy is best for all workloads—the
          right choice depends on the access pattern, cache size, and performance requirements.
        </p>

        <h3>Hit Rate Comparison</h3>
        <p>
          On general web workloads, LRU achieves a hit rate of 70-90% with sufficient cache size.
          LFU achieves a slightly higher hit rate (75-95%) for workloads with stable hot data
          (e.g., product catalogs, user profiles), but performs worse on dynamic workloads where
          the hot set changes frequently. ARC consistently outperforms both LRU and LFU (5-15%
          improvement) by adapting to the workload automatically, at the cost of higher memory
          overhead.
        </p>

        <h3>Computational Overhead</h3>
        <p>
          LRU has O(1) time complexity for get and put operations, making it efficient for large
          caches with high throughput requirements. LFU has O(log N) time complexity with a
          min-heap (or O(1) with frequency bucket optimization), making it slightly slower than
          LRU for large caches. FIFO has O(1) time complexity, making it the fastest but also
          the least effective.
        </p>

        <h3>Memory Overhead</h3>
        <p>
          LRU requires a doubly-linked list node per cache entry (two pointers per entry), adding
          16-32 bytes per entry (depending on architecture). LFU requires a frequency counter per
          entry (4-8 bytes) plus heap structure (additional pointers). ARC requires four lists
          (T1, T2, B1, B2), doubling the memory overhead of LRU. TinyLFU uses a fixed-size Count-Min
          Sketch (a few hundred KB regardless of cache size), making it the most memory-efficient
          for large caches.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/eviction-tradeoffs.svg`}
          caption="Figure 4: Eviction Policy Trade-offs showing five policies across six dimensions. LRU: Hit Rate (High), Computational Cost (Low O(1)), Memory Overhead (Medium), Scan Resistance (None), Implementation Complexity (Low), Best for (General workloads). LFU: Hit Rate (Very High for stable data), Computational Cost (Medium O(log N)), Memory Overhead (Medium), Scan Resistance (Good), Implementation Complexity (Medium), Best for (Stable hot data). FIFO: Hit Rate (Low), Computational Cost (Very Low O(1)), Memory Overhead (Low), Scan Resistance (None), Implementation Complexity (Very Low), Best for (Simple cases). ARC: Hit Rate (Highest), Computational Cost (Medium), Memory Overhead (High), Scan Resistance (Good), Implementation Complexity (High), Best for (Mixed workloads). TinyLFU: Hit Rate (Very High), Computational Cost (Low O(1)), Memory Overhead (Very Low fixed), Scan Resistance (Excellent), Implementation Complexity (Medium), Best for (Modern caches)."
          alt="Eviction policy trade-offs comparison"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Eviction Policy Selection</h2>

        <p>
          <strong>Use LRU as the default.</strong> LRU works well for most workloads, has O(1)
          time complexity, and is simple to implement. It is the default policy in Redis,
          Memcached, and most application-level caches. Only consider alternatives if your
          workload has specific patterns that LRU handles poorly (e.g., scan-heavy workloads,
          stable hot data with infrequent access).
        </p>

        <p>
          <strong>Use LFU for stable hot data.</strong> If your workload has a stable set of hot
          items that are accessed frequently but not necessarily recently (e.g., popular products
          that aren't accessed every hour but are accessed thousands of times per day), LFU keeps
          these items in the cache even during periods of inactivity. This is particularly useful
          for product catalogs, user profiles, and configuration data.
        </p>

        <p>
          <strong>Use TinyLFU for modern high-performance caches.</strong> TinyLFU combines the
          best of LRU and LFU: it is scan-resistant (like LFU), has O(1) time complexity (like
          LRU), and uses minimal memory (fixed-size Count-Min Sketch). It is the policy used in
          Caffeine, the highest-performing Java caching library, and is increasingly adopted in
          modern cache implementations.
        </p>

        <p>
          <strong>Monitor hit rate and adjust.</strong> Track the cache hit rate under your
          current eviction policy and experiment with alternatives. Many cache libraries allow
          you to switch policies without code changes (Redis: maxmemory-policy, Caffeine:
          builder configuration). Measure the hit rate impact and choose the policy that
          maximizes it for your workload.
        </p>

        <p>
          <strong>Size your cache appropriately.</strong> Eviction policy effectiveness depends
          on cache size. A cache that is too small will have a low hit rate regardless of the
          eviction policy (thrashing). A cache that is large enough to hold the hot set will
          have a high hit rate with any reasonable policy. Determine the hot set size (the
          working set of frequently accessed data) and size the cache to hold it.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Scan pollution.</strong> When a workload scans through a large dataset, each
          scanned item becomes "recently used" and pushes hot items out of the cache. This is
          particularly problematic for LRU. Fix: Use a scan-resistant policy (TinyLFU, ARC) that
          filters out one-time accesses based on frequency. Alternatively, increase the cache size
          to accommodate both the hot set and the scan set.
        </p>

        <p>
          <strong>Frequency aging (LFU recency bias).</strong> In pure LFU, items with high
          historical frequency are kept even if their access pattern has changed. New items
          struggle to build up enough frequency to survive eviction. Fix: Implement frequency
          decay (periodically halve all frequency counters), as TinyLFU does. This ensures that
          recent access patterns compete fairly with historical patterns.
        </p>

        <p>
          <strong>LRU approximation inaccuracy.</strong> Redis's approximated LRU (sampling N
          keys) may not evict the true LRU item, leading to suboptimal hit rates. Fix: Increase
          the sample size (maxmemory-samples in Redis). The default is 5, but increasing it to
          10 improves accuracy with minimal CPU overhead. For most workloads, the approximation
          is sufficient.
        </p>

        <p>
          <strong>Cache thrashing.</strong> When the cache is too small to hold the hot set,
          items are constantly evicted and re-fetched, causing the cache to thrash. The hit rate
          drops, and the database load increases. Fix: Increase the cache size to hold the hot
          set. Monitor the hit rate and evicted keys rate—if the evicted keys rate is high and
          the hit rate is low, the cache is thrashing and needs more memory.
        </p>

        <p>
          <strong>Memory fragmentation.</strong> Some eviction policies (particularly those with
          linked lists) can cause memory fragmentation, where the cache's memory usage is higher
          than expected due to allocation overhead. Fix: Use memory-efficient implementations
          (e.g., Redis's object encoding, Caffeine's concurrent hash map). Monitor actual memory
          usage vs. configured max memory.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Redis: Approximated LRU</h3>
        <p>
          Redis uses an approximated LRU policy (sampling 5 keys by default) to balance hit rate
          accuracy with memory overhead. True LRU requires a doubly-linked list node per entry,
          which adds significant memory overhead for large caches. Redis's approximation evicts
          the least recently used among 5 randomly sampled keys, providing a good approximation
          of true LRU with minimal memory overhead.
        </p>

        <p>
          This works well for most Redis use cases (sessions, caching, leaderboards) where the
          access pattern has temporal locality. For workloads with scan patterns, Redis offers
          alternative policies: volatile-lru (LRU for keys with TTL), allkeys-lfu (LFU for all
          keys), and volatile-ttl (evict keys with nearest TTL). The policy is configurable via
          maxmemory-policy.
        </p>

        <h3>Caffeine: TinyLFU (Window TinyLFU)</h3>
        <p>
          Caffeine, the high-performance Java caching library, uses Window TinyLFU (W-TinyLFU),
          a variant of TinyLFU that maintains a small LRU window for new admissions and a main
          SLRU (Segmented LRU) space for promoted items. New items enter the LRU window; if they
          are accessed again, they are promoted to the main space based on their frequency (from
          the Count-Min Sketch). This combines the benefits of LRU (recency for new items) and
          LFU (frequency for established items).
        </p>

        <p>
          W-TinyLFU is highly scan-resistant: one-time scanned items are admitted to the LRU
          window but are not promoted to the main space (low frequency). It is also resilient
          to frequency aging: the Count-Min Sketch periodically decays frequencies, ensuring
          that recent patterns compete fairly. Caffeine achieves hit rates 10-20% higher than
          LRU on production workloads.
        </p>

        <h3>Memcached: LRU with Slab Classes</h3>
        <p>
          Memcached uses LRU within slab classes. Slab classes partition memory into fixed-size
          chunks (e.g., 100-byte slabs, 200-byte slabs), and each slab class has its own LRU
          list. This prevents small items from being evicted by large items (which would happen
          with a single LRU list). Each slab class independently evicts its LRU item when full.
        </p>

        <p>
          Memcached's LRU is also approximated: it uses a lazy LRU approach where items are not
          moved to the front of the LRU list on every access (to avoid lock contention). Instead,
          items are moved periodically or on eviction. This provides good LRU behavior with
          minimal synchronization overhead.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/eviction-real-world.svg`}
          caption="Figure 5: Real-World Eviction Implementations showing three examples. Redis: Approximated LRU (samples 5 keys, evicts LRU among samples), configurable policies (allkeys-lru, volatile-lru, allkeys-lfu, volatile-ttl), balances accuracy with memory overhead. Caffeine: Window TinyLFU (W-TinyLFU), LRU window for new admissions, SLRU main space for promoted items, Count-Min Sketch for frequency, scan-resistant, frequency decay, 10-20% higher hit rate than LRU. Memcached: LRU within Slab Classes, partitioned memory by item size, each slab has independent LRU, lazy LRU (minimal lock contention), prevents small item eviction by large items. The diagram shows the architecture and trade-offs for each implementation."
          alt="Real-world eviction implementations"
        />
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q1: Explain how LRU works and its time complexity. What are its weaknesses?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> LRU (Least Recently Used) maintains a doubly-linked list
              ordered by access time and a hash map mapping keys to list nodes. On get(key), the
              hash map is consulted (O(1)), and if found, the node is moved to the front of the
              list (O(1) with doubly-linked list). On put(key, value), if the key exists, the
              value is updated and the node is moved to the front. If the cache is full, the last
              node (LRU) is evicted, and the new key-value pair is inserted at the front. Both
              get and put are O(1) time complexity.
            </p>
            <p className="mt-2 text-sm">
              LRU's weaknesses: (1) Scan pollution—scanning through a large dataset pushes hot
              items out of the cache. (2) No frequency awareness—an item accessed once is treated
              the same as an item accessed 1000 times. (3) Memory overhead—each entry requires
              a doubly-linked list node (two pointers, 16-32 bytes).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How does Redis approximate LRU? Answer: Redis samples N
              keys (default 5) and evicts the LRU among the sampled keys. This provides a good
              approximation of true LRU with much lower memory overhead (no linked list per entry).
              The sample size is configurable (maxmemory-samples), and increasing it improves
              accuracy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2: Compare LRU and LFU. When would you use each?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> LRU evicts based on recency (least recently accessed),
              while LFU evicts based on frequency (least frequently accessed). LRU assumes that
              recently accessed data is likely to be accessed again soon (temporal locality). LFU
              assumes that frequently accessed data is more valuable (frequency importance).
            </p>
            <p className="mt-2 text-sm">
              Use LRU when: (1) The workload has temporal locality (hot data is accessed
              frequently and recently). (2) You need O(1) time complexity for high throughput.
              (3) The workload doesn't have scan patterns. Use LFU when: (1) The workload has
              stable hot data that is accessed frequently but not necessarily recently. (2) You
              want to keep popular items in the cache even during periods of inactivity. (3) Scan
              resistance is important (LFU filters out one-time scans).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is LFU's recency bias problem? Answer: In pure
              LFU, items with high historical frequency are kept even if their access pattern has
              changed. New items struggle to build up enough frequency to survive eviction. Fix:
              Implement frequency decay (periodically halve all frequency counters), as TinyLFU
              does, ensuring that recent patterns compete fairly with historical patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3: What is scan pollution, and how do scan-resistant policies address it?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Scan pollution occurs when a workload scans through a large
              dataset, causing each scanned item to become "recently used" (in LRU) and pushing
              hot items out of the cache. This degrades the hit rate because hot items are evicted
              by cold, one-time scanned items.
            </p>
            <p className="mt-2 text-sm">
              Scan-resistant policies address this by filtering out one-time accesses. TinyLFU
              uses frequency-based admission: new items are compared against the victim's
              frequency (from a Count-Min Sketch), and only items with sufficient frequency are
              admitted. One-time scanned items have low frequency and are rejected. ARC uses ghost
              entries to detect when recently evicted items are re-requested, and adjusts the
              cache to favor frequency over recency when scans are detected.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How does TinyLFU's Count-Min Sketch work? Answer:
              Count-Min Sketch is a probabilistic data structure that approximates frequency
              using a small, fixed-size 2D array of counters. Each item is hashed by multiple
              hash functions, and each hash function increments a counter in a different row. The
              estimated frequency is the minimum counter value across all rows (to minimize
              overcounting from hash collisions). This uses constant memory regardless of the
              number of items.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4: How would you design an eviction policy for a cache with 10 GB capacity and
              100 million items, where 10% of items receive 90% of traffic?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> This is a classic power-law (Pareto) distribution: 10% of
              items (10 million) receive 90% of traffic. With 10 GB capacity and 100 million
              items at 100 bytes each, the cache can hold 100 million items—exactly all of them.
              But assuming items are larger (e.g., 1 KB each), the cache can hold 10 million
              items, which is exactly the hot set.
            </p>
            <p className="mt-2 text-sm">
              Use LRU or TinyLFU. LRU works well because the hot set (10 million items) fits in
              the cache, and temporal locality ensures that hot items are accessed frequently and
              stay at the front of the LRU list. TinyLFU would be even better because it is
              scan-resistant (filtering out the 90 million cold items that are rarely accessed)
              and has lower memory overhead (fixed-size Count-Min Sketch instead of linked list
              nodes).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if the hot set is larger than the cache (e.g., 20
              million hot items but only 10 GB)? Answer: Use TinyLFU with frequency-based
              admission to ensure that the most frequently accessed 10 million items are kept.
              Monitor the hit rate and adjust the cache size or eviction policy based on the
              observed access pattern. Consider a multi-level cache (L1 in-process for the hottest
              1 million, L2 distributed for the next 9 million).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5: Explain ARC (Adaptive Replacement Cache) and how it adapts to workloads.
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> ARC maintains four lists: T1 (recent items, evicted once),
              T2 (frequent items, evicted multiple times), B1 (ghost entries for T1—keys without
              data), and B2 (ghost entries for T2). Ghost entries store metadata for recently
              evicted items, allowing ARC to detect access patterns.
            </p>
            <p className="mt-2 text-sm">
              ARC adapts by adjusting the relative sizes of T1 and T2. When a cache hit occurs
              in B1 (recent evicted), ARC increases T1's size (favoring recency—suggesting the
              workload has temporal locality). When a hit occurs in B2 (frequent evicted), ARC
              increases T2's size (favoring frequency—suggesting the workload has stable hot
              data). This allows ARC to automatically adapt: if the workload is recency-heavy,
              ARC behaves like LRU; if it is frequency-heavy, ARC behaves like LFU.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is the memory overhead of ARC? Answer: ARC requires
              four lists (T1, T2, B1, B2), where B1 and B2 are ghost entries (keys only, no data).
              The memory overhead is roughly double that of LRU (two data lists + two ghost lists).
              This is acceptable for most workloads but can be significant for very large caches
              with small items.
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
              href="https://redis.io/docs/latest/develop/use/eviction/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis Documentation — Eviction Policies
            </a>
          </li>
          <li>
            <a
              href="https://github.com/ben-manes/caffeine"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Caffeine — A High-Performance Java Caching Library (W-TinyLFU)
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Adaptive_replacement_cache"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adaptive Replacement Cache — Wikipedia
            </a>
          </li>
          <li>
            <a
              href="https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
              Chapter 11 (Stream Processing).
            </a>
          </li>
          <li>
            <a
              href="https://www.oreilly.com/library/view/database-internals/9781492040330/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019. Chapter 9 (Caching).
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
