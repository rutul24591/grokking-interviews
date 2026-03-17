import type { ArticleRegistry } from "@/types/article";

/**
 * Article Registry
 *
 * This registry maps article paths to their metadata and dynamic loaders.
 * Format: "{category}/{subcategory}/{topic}"
 */
export const articleRegistry: ArticleRegistry = {
  "backend/advanced-topics/b-trees-b-trees": {
    metadata: {
      id: "article-backend-b-trees-b-trees-extensive",
      title: "B-trees & B+ Trees",
      description:
        "In-depth guide to b-trees & b+ trees architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "b-trees-b-trees",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/b-trees-b-trees"),
  },
  "backend/advanced-topics/bloom-filters": {
    metadata: {
      id: "article-backend-bloom-filters-extensive",
      title: "Bloom Filters",
      description:
        "In-depth guide to bloom filters architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "bloom-filters",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/bloom-filters"),
  },
  "backend/advanced-topics/conflict-free-replicated-data-types": {
    metadata: {
      id: "article-backend-conflict-free-replicated-data-types-extensive",
      title: "Conflict-Free Replicated Data Types",
      description:
        "In-depth guide to conflict-free replicated data types architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "conflict-free-replicated-data-types",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/conflict-free-replicated-data-types"),
  },
  "backend/advanced-topics/count-min-sketch": {
    metadata: {
      id: "article-backend-count-min-sketch-extensive",
      title: "Count-Min Sketch",
      description:
        "In-depth guide to count-min sketch architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "count-min-sketch",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/count-min-sketch"),
  },
  "backend/advanced-topics/geo-sharding": {
    metadata: {
      id: "article-backend-geo-sharding-extensive",
      title: "Geo-Sharding",
      description:
        "In-depth guide to geo-sharding architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "geo-sharding",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/geo-sharding"),
  },
  "backend/advanced-topics/global-distribution": {
    metadata: {
      id: "article-backend-global-distribution-extensive",
      title: "Global Distribution",
      description:
        "In-depth guide to global distribution architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "global-distribution",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/global-distribution"),
  },
  "backend/advanced-topics/hot-partitions": {
    metadata: {
      id: "article-backend-hot-partitions-extensive",
      title: "Hot Partitions",
      description:
        "In-depth guide to hot partitions architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "hot-partitions",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/hot-partitions"),
  },
  "backend/advanced-topics/hyperloglog": {
    metadata: {
      id: "article-backend-hyperloglog-extensive",
      title: "HyperLogLog",
      description:
        "In-depth guide to hyperloglog architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "hyperloglog",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/hyperloglog"),
  },
  "backend/advanced-topics/leader-election": {
    metadata: {
      id: "article-backend-leader-election-extensive",
      title: "Leader Election",
      description:
        "In-depth guide to leader election architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "leader-election",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/leader-election"),
  },
  "backend/advanced-topics/lsm-trees": {
    metadata: {
      id: "article-backend-lsm-trees-extensive",
      title: "LSM Trees",
      description:
        "In-depth guide to lsm trees architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "lsm-trees",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/lsm-trees"),
  },
  "backend/advanced-topics/merkle-trees": {
    metadata: {
      id: "article-backend-merkle-trees-extensive",
      title: "Merkle Trees",
      description:
        "In-depth guide to merkle trees architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "merkle-trees",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/merkle-trees"),
  },
  "backend/advanced-topics/operational-transformation": {
    metadata: {
      id: "article-backend-operational-transformation-extensive",
      title: "Operational Transformation",
      description:
        "In-depth guide to operational transformation architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "operational-transformation",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/operational-transformation"),
  },
  "backend/advanced-topics/skip-lists": {
    metadata: {
      id: "article-backend-skip-lists-extensive",
      title: "Skip Lists",
      description:
        "In-depth guide to skip lists architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "skip-lists",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/skip-lists"),
  },
  "backend/advanced-topics/snapshot-isolation": {
    metadata: {
      id: "article-backend-snapshot-isolation-extensive",
      title: "Snapshot Isolation",
      description:
        "In-depth guide to snapshot isolation architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "snapshot-isolation",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/snapshot-isolation"),
  },
  "backend/advanced-topics/tail-latency": {
    metadata: {
      id: "article-backend-tail-latency-extensive",
      title: "Tail Latency",
      description:
        "In-depth guide to tail latency architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "tail-latency",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/tail-latency"),
  },
  "backend/advanced-topics/time-series-optimization": {
    metadata: {
      id: "article-backend-time-series-optimization-extensive",
      title: "Time-Series Optimization",
      description:
        "In-depth guide to time-series optimization architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "time-series-optimization",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/time-series-optimization"),
  },
  "backend/advanced-topics/write-ahead-logging": {
    metadata: {
      id: "article-backend-write-ahead-logging-extensive",
      title: "Write-Ahead Logging",
      description:
        "In-depth guide to write-ahead logging architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "write-ahead-logging",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/write-ahead-logging"),
  },
  "backend/advanced-topics/zero-copy-techniques": {
    metadata: {
      id: "article-backend-zero-copy-techniques-extensive",
      title: "Zero-Copy Techniques",
      description:
        "In-depth guide to zero-copy techniques architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "advanced-topics",
      slug: "zero-copy-techniques",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "advanced"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/advanced-topics/zero-copy-techniques"),
  },
  "backend/caching-performance/application-level-caching": {
    metadata: {
      id: "article-backend-application-level-caching-extensive",
      title: "Application-Level Caching",
      description:
        "Deep guide to application-level caching patterns, consistency trade-offs, and production reliability.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "application-level-caching",
      wordCount: 5889,
      readingTime: 30,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "caching-strategies",
        "distributed-caching",
        "cache-invalidation",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/application-level-caching"),
  },
  "backend/caching-performance/cache-breakdown": {
    metadata: {
      id: "article-backend-cache-breakdown-extensive",
      title: "Cache Breakdown",
      description:
        "Deep guide to hot key expiration, mitigation techniques, and operational safeguards.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-breakdown",
      wordCount: 5125,
      readingTime: 26,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "cache-stampede",
        "cache-invalidation",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-breakdown"),
  },
  "backend/caching-performance/cache-coherence": {
    metadata: {
      id: "article-backend-cache-coherence-extensive",
      title: "Cache Coherence",
      description:
        "Deep guide to cache coherence across layers, consistency trade-offs, and production reliability.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-coherence",
      wordCount: 5375,
      readingTime: 27,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "cache-invalidation",
        "distributed-caching",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-coherence"),
  },
  "backend/caching-performance/cache-eviction-policies": {
    metadata: {
      id: "article-backend-cache-eviction-policies-extensive",
      title: "Cache Eviction Policies",
      description:
        "Deep guide to cache eviction policies, workload fit, and performance trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-eviction-policies",
      wordCount: 8962,
      readingTime: 45,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "redis", "eviction"],
      relatedTopics: [
        "caching-strategies",
        "cache-invalidation",
        "cache-stampede",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-eviction-policies"),
  },
  "backend/caching-performance/cache-invalidation": {
    metadata: {
      id: "article-backend-cache-invalidation-extensive",
      title: "Cache Invalidation",
      description:
        "Deep guide to cache invalidation techniques, consistency trade-offs, and operational patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-invalidation",
      wordCount: 8928,
      readingTime: 45,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "redis"],
      relatedTopics: [
        "caching-strategies",
        "cache-eviction-policies",
        "cache-stampede",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-invalidation"),
  },
  "backend/caching-performance/cache-penetration": {
    metadata: {
      id: "article-backend-cache-penetration-extensive",
      title: "Cache Penetration",
      description:
        "Deep guide to cache penetration causes, mitigation patterns, and operational safeguards.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-penetration",
      wordCount: 5121,
      readingTime: 26,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "cache-stampede",
        "cache-invalidation",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-penetration"),
  },
  "backend/caching-performance/cache-stampede": {
    metadata: {
      id: "article-backend-cache-stampede-extensive",
      title: "Cache Stampede",
      description:
        "Deep guide to cache stampede causes, mitigation patterns, and production reliability trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-stampede",
      wordCount: 9047,
      readingTime: 46,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "reliability"],
      relatedTopics: [
        "cache-invalidation",
        "cache-eviction-policies",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-stampede"),
  },
  "backend/caching-performance/cache-warming": {
    metadata: {
      id: "article-backend-cache-warming-extensive",
      title: "Cache Warming",
      description:
        "Deep guide to cache warming strategies, operational risks, and production reliability patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-warming",
      wordCount: 5334,
      readingTime: 27,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "cache-stampede",
        "cache-invalidation",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cache-warming"),
  },
  "backend/caching-performance/caching-strategies": {
    metadata: {
      id: "article-backend-caching-strategies-extensive",
      title: "Caching Strategies",
      description:
        "Deep guide to caching strategies, write policies, consistency trade-offs, and production patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "caching-strategies",
      wordCount: 10456,
      readingTime: 53,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "redis", "scalability"],
      relatedTopics: [
        "cache-eviction-policies",
        "cache-invalidation",
        "distributed-caching",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/caching-strategies"),
  },
  "backend/caching-performance/cdn-caching": {
    metadata: {
      id: "article-backend-cdn-caching-extensive",
      title: "CDN Caching",
      description:
        "Deep guide to CDN caching architecture, edge behavior, and production deployment patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cdn-caching",
      wordCount: 5380,
      readingTime: 27,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "cdn", "performance"],
      relatedTopics: [
        "http-caching",
        "cache-invalidation",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/cdn-caching"),
  },
  "backend/caching-performance/database-connection-pooling": {
    metadata: {
      id: "article-backend-database-connection-pooling-extensive",
      title: "Database Connection Pooling",
      description:
        "Deep guide to connection pooling design, sizing, and production reliability patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "database-connection-pooling",
      wordCount: 4924,
      readingTime: 25,
      lastUpdated: "2026-03-10",
      tags: ["backend", "performance", "databases"],
      relatedTopics: [
        "object-pooling",
        "query-optimization-techniques",
        "connection-pooling",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/database-connection-pooling"),
  },
  "backend/caching-performance/database-query-caching": {
    metadata: {
      id: "article-backend-database-query-caching-extensive",
      title: "Database Query Caching",
      description:
        "Deep guide to query result caching, invalidation strategies, and production trade-offs in databases.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "database-query-caching",
      wordCount: 5691,
      readingTime: 29,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "databases", "performance"],
      relatedTopics: [
        "caching-strategies",
        "cache-invalidation",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/database-query-caching"),
  },
  "backend/caching-performance/distributed-caching": {
    metadata: {
      id: "article-backend-distributed-caching-extensive",
      title: "Distributed Caching",
      description:
        "Deep guide to distributed caching architecture, consistency trade-offs, and production operations.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "distributed-caching",
      wordCount: 6542,
      readingTime: 33,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "redis"],
      relatedTopics: [
        "caching-strategies",
        "cache-eviction-policies",
        "cache-invalidation",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/distributed-caching"),
  },
  "backend/caching-performance/http-caching": {
    metadata: {
      id: "article-backend-http-caching-extensive",
      title: "HTTP Caching",
      description:
        "Deep guide to HTTP caching semantics, cache control directives, and production deployment patterns.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "http-caching",
      wordCount: 5410,
      readingTime: 28,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "http", "performance"],
      relatedTopics: [
        "cdn-caching",
        "cache-invalidation",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/http-caching"),
  },
  "backend/caching-performance/lazy-loading": {
    metadata: {
      id: "article-backend-lazy-loading-extensive",
      title: "Lazy Loading",
      description:
        "Deep guide to on-demand loading, pagination strategies, and backend performance trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "lazy-loading",
      wordCount: 5021,
      readingTime: 26,
      lastUpdated: "2026-03-10",
      tags: ["backend", "performance"],
      relatedTopics: ["prefetching", "page-caching", "caching-strategies"],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/lazy-loading"),
  },
  "backend/caching-performance/memoization": {
    metadata: {
      id: "article-backend-memoization-extensive",
      title: "Memoization",
      description:
        "Deep guide to memoization design, cache key strategies, and production trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "memoization",
      wordCount: 5215,
      readingTime: 27,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "application-level-caching",
        "cache-eviction-policies",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/memoization"),
  },
  "backend/caching-performance/multi-level-caching": {
    metadata: {
      id: "article-backend-multi-level-caching-extensive",
      title: "Multi-Level Caching",
      description:
        "Deep guide to cache hierarchies, coherence challenges, and production trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "multi-level-caching",
      wordCount: 5058,
      readingTime: 26,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: [
        "application-level-caching",
        "distributed-caching",
        "cache-coherence",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/multi-level-caching"),
  },
  "backend/caching-performance/object-pooling": {
    metadata: {
      id: "article-backend-object-pooling-extensive",
      title: "Object Pooling",
      description:
        "Deep guide to object pooling design, contention control, and production trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "object-pooling",
      wordCount: 4936,
      readingTime: 25,
      lastUpdated: "2026-03-10",
      tags: ["backend", "performance"],
      relatedTopics: [
        "database-connection-pooling",
        "application-level-caching",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/object-pooling"),
  },
  "backend/caching-performance/page-caching": {
    metadata: {
      id: "article-backend-page-caching-extensive",
      title: "Page Caching",
      description:
        "Deep guide to full-page and fragment caching, invalidation strategies, and production trade-offs.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "page-caching",
      wordCount: 5186,
      readingTime: 26,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance"],
      relatedTopics: ["http-caching", "cdn-caching", "cache-invalidation"],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/page-caching"),
  },
  "backend/caching-performance/prefetching": {
    metadata: {
      id: "article-backend-prefetching-extensive",
      title: "Prefetching",
      description:
        "Deep guide to predictive loading, accuracy trade-offs, and production safeguards.",
      category: "backend",
      subcategory: "caching-performance",
      slug: "prefetching",
      wordCount: 4958,
      readingTime: 25,
      lastUpdated: "2026-03-10",
      tags: ["backend", "performance"],
      relatedTopics: ["lazy-loading", "cache-warming", "caching-strategies"],
    },
    loader: () =>
      import("./articles/system-design/backend/caching-performance/prefetching"),
  },
  "backend/data-processing-analytics/aggregations": {
    metadata: {
      id: "article-backend-aggregations-extensive",
      title: "Aggregations",
      description:
        "In-depth guide to aggregations architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "aggregations",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "aggregations"],
      relatedTopics: ["windowing", "stream-processing", "batch-processing"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/aggregations"),
  },
  "backend/data-processing-analytics/apache-kafka": {
    metadata: {
      id: "article-backend-apache-kafka-extensive",
      title: "Apache Kafka",
      description:
        "In-depth guide to apache kafka architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "apache-kafka",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "kafka"],
      relatedTopics: [
        "stream-processing",
        "message-ordering",
        "exactly-once-semantics",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/apache-kafka"),
  },
  "backend/data-processing-analytics/apache-spark": {
    metadata: {
      id: "article-backend-apache-spark-extensive",
      title: "Apache Spark",
      description:
        "In-depth guide to apache spark architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "apache-spark",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "spark"],
      relatedTopics: [
        "batch-processing",
        "data-serialization",
        "data-partitioning",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/apache-spark"),
  },
  "backend/data-processing-analytics/batch-processing": {
    metadata: {
      id: "article-backend-batch-processing-extensive",
      title: "Batch Processing",
      description:
        "In-depth guide to batch processing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "batch-processing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "batch"],
      relatedTopics: ["etl-elt-pipelines", "mapreduce", "apache-spark"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/batch-processing"),
  },
  "backend/data-processing-analytics/change-data-capture": {
    metadata: {
      id: "article-backend-change-data-capture-extensive",
      title: "Change Data Capture",
      description:
        "In-depth guide to change data capture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "change-data-capture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "cdc"],
      relatedTopics: [
        "apache-kafka",
        "data-pipelines",
        "exactly-once-semantics",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/change-data-capture"),
  },
  "backend/data-processing-analytics/data-compression": {
    metadata: {
      id: "article-backend-data-compression-extensive",
      title: "Data Compression",
      description:
        "In-depth guide to data compression architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "data-compression",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "compression"],
      relatedTopics: [
        "data-serialization",
        "batch-processing",
        "stream-processing",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/data-compression"),
  },
  "backend/data-processing-analytics/data-deduplication": {
    metadata: {
      id: "article-backend-data-deduplication-extensive",
      title: "Data Deduplication",
      description:
        "In-depth guide to data deduplication architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "data-deduplication",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "dedup"],
      relatedTopics: [
        "exactly-once-semantics",
        "message-ordering",
        "change-data-capture",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/data-deduplication"),
  },
  "backend/data-processing-analytics/data-partitioning": {
    metadata: {
      id: "article-backend-data-partitioning-extensive",
      title: "Data Partitioning",
      description:
        "In-depth guide to data partitioning architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "data-partitioning",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "partitioning"],
      relatedTopics: ["data-pipelines", "data-deduplication", "apache-spark"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/data-partitioning"),
  },
  "backend/data-processing-analytics/data-pipelines": {
    metadata: {
      id: "article-backend-data-pipelines-extensive",
      title: "Data Pipelines",
      description:
        "In-depth guide to data pipelines architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "data-pipelines",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "pipelines"],
      relatedTopics: ["etl-elt-pipelines", "data-partitioning", "apache-kafka"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/data-pipelines"),
  },
  "backend/data-processing-analytics/data-serialization": {
    metadata: {
      id: "article-backend-data-serialization-extensive",
      title: "Data Serialization",
      description:
        "In-depth guide to data serialization architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "data-serialization",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "serialization"],
      relatedTopics: ["data-compression", "apache-spark", "etl-elt-pipelines"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/data-serialization"),
  },
  "backend/data-processing-analytics/etl-elt-pipelines": {
    metadata: {
      id: "article-backend-etl-elt-pipelines-extensive",
      title: "ETL/ELT Pipelines",
      description:
        "In-depth guide to etl/elt pipelines architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "etl-elt-pipelines",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "etl"],
      relatedTopics: [
        "data-pipelines",
        "batch-processing",
        "data-serialization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/etl-elt-pipelines"),
  },
  "backend/data-processing-analytics/exactly-once-semantics": {
    metadata: {
      id: "article-backend-exactly-once-semantics-extensive",
      title: "Exactly-Once Semantics",
      description:
        "In-depth guide to exactly-once semantics architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "exactly-once-semantics",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "exactly-once"],
      relatedTopics: [
        "message-ordering",
        "data-deduplication",
        "stream-processing",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/exactly-once-semantics"),
  },
  "backend/data-processing-analytics/kappa-architecture": {
    metadata: {
      id: "article-backend-kappa-architecture-extensive",
      title: "Kappa Architecture",
      description:
        "In-depth guide to kappa architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "kappa-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "kappa"],
      relatedTopics: [
        "lambda-architecture",
        "stream-processing",
        "change-data-capture",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/kappa-architecture"),
  },
  "backend/data-processing-analytics/lambda-architecture": {
    metadata: {
      id: "article-backend-lambda-architecture-extensive",
      title: "Lambda Architecture",
      description:
        "In-depth guide to lambda architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "lambda-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "lambda"],
      relatedTopics: [
        "kappa-architecture",
        "batch-processing",
        "stream-processing",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/lambda-architecture"),
  },
  "backend/data-processing-analytics/mapreduce": {
    metadata: {
      id: "article-backend-mapreduce-extensive",
      title: "MapReduce",
      description:
        "In-depth guide to mapreduce architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "mapreduce",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "mapreduce"],
      relatedTopics: ["batch-processing", "apache-spark", "data-partitioning"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/mapreduce"),
  },
  "backend/data-processing-analytics/message-ordering": {
    metadata: {
      id: "article-backend-message-ordering-extensive",
      title: "Message Ordering",
      description:
        "In-depth guide to message ordering architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "message-ordering",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "ordering"],
      relatedTopics: [
        "apache-kafka",
        "exactly-once-semantics",
        "data-deduplication",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/message-ordering"),
  },
  "backend/data-processing-analytics/stream-processing": {
    metadata: {
      id: "article-backend-stream-processing-extensive",
      title: "Stream Processing",
      description:
        "In-depth guide to stream processing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "stream-processing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "stream"],
      relatedTopics: ["apache-kafka", "windowing", "exactly-once-semantics"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/stream-processing"),
  },
  "backend/data-processing-analytics/windowing": {
    metadata: {
      id: "article-backend-windowing-extensive",
      title: "Windowing",
      description:
        "In-depth guide to windowing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "data-processing-analytics",
      slug: "windowing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "data", "windowing"],
      relatedTopics: [
        "stream-processing",
        "aggregations",
        "exactly-once-semantics",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-processing-analytics/windowing"),
  },
  "backend/data-storage-databases/acid-properties": {
    metadata: {
      id: "article-backend-acid-properties-extensive",
      title: "ACID Properties",
      description:
        "Comprehensive guide to ACID properties, isolation levels, and transactional guarantees.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "acid-properties",
      wordCount: 1847,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "acid", "transactions"],
      relatedTopics: [
        "transaction-isolation-levels",
        "concurrency-control",
        "deadlocks",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/acid-properties"),
  },
  "backend/data-storage-databases/base-properties": {
    metadata: {
      id: "article-backend-base-properties-extensive",
      title: "BASE Properties",
      description:
        "Deep guide to BASE properties, eventual consistency patterns, and system design trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "base-properties",
      wordCount: 1751,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "base"],
      relatedTopics: ["cap-theorem", "read-replicas", "consistency-models"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/base-properties"),
  },
  "backend/data-storage-databases/blob-storage": {
    metadata: {
      id: "article-backend-blob-storage-extensive",
      title: "Blob Storage",
      description:
        "Deep guide to blob storage, durability models, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "blob-storage",
      wordCount: 1576,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "blob-storage"],
      relatedTopics: ["object-storage", "file-systems", "cdn-edge-storage"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/blob-storage"),
  },
  "backend/data-storage-databases/block-storage": {
    metadata: {
      id: "article-backend-block-storage-extensive",
      title: "Block Storage",
      description:
        "Deep guide to block storage, performance characteristics, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "block-storage",
      wordCount: 1610,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "block-storage"],
      relatedTopics: [
        "file-systems",
        "object-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/block-storage"),
  },
  "backend/data-storage-databases/cap-theorem": {
    metadata: {
      id: "article-backend-cap-theorem-extensive",
      title: "CAP Theorem",
      description:
        "Deep guide to CAP theorem, consistency models, and practical system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cap-theorem",
      wordCount: 1784,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "cap"],
      relatedTopics: [
        "base-properties",
        "read-replicas",
        "database-partitioning",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/cap-theorem"),
  },
  "backend/data-storage-databases/cdn-edge-storage": {
    metadata: {
      id: "article-backend-cdn-edge-storage-extensive",
      title: "CDN & Edge Storage",
      description:
        "Deep guide to CDN and edge storage, caching strategies, and global performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cdn-edge-storage",
      wordCount: 1641,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "cdn", "edge", "storage"],
      relatedTopics: ["caching-performance", "object-storage", "compression"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/cdn-edge-storage"),
  },
  "backend/data-storage-databases/column-family-stores": {
    metadata: {
      id: "article-backend-column-family-stores-extensive",
      title: "Column-Family Stores",
      description:
        "Deep guide to wide-column databases, data modeling patterns, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "column-family-stores",
      wordCount: 1687,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "column-family"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/column-family-stores"),
  },
  "backend/data-storage-databases/concurrency-control": {
    metadata: {
      id: "article-backend-concurrency-control-extensive",
      title: "Concurrency Control",
      description:
        "Comprehensive guide to concurrency control, locking, MVCC, and trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "concurrency-control",
      wordCount: 1778,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "concurrency", "transactions"],
      relatedTopics: [
        "transaction-isolation-levels",
        "deadlocks",
        "acid-properties",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/concurrency-control"),
  },
  "backend/data-storage-databases/conflict-resolution": {
    metadata: {
      id: "article-backend-conflict-resolution-extensive",
      title: "Conflict Resolution",
      description:
        "Deep guide to conflict resolution strategies in distributed systems and their trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "conflict-resolution",
      wordCount: 1661,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "consistency", "conflicts"],
      relatedTopics: [
        "replication-in-nosql",
        "consistency-models",
        "cap-theorem",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/conflict-resolution"),
  },
  "backend/data-storage-databases/connection-pooling": {
    metadata: {
      id: "article-backend-connection-pooling-extensive",
      title: "Connection Pooling",
      description:
        "Deep guide to connection pooling mechanics, sizing, failure modes, and operational tuning.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "connection-pooling",
      wordCount: 1915,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "performance", "pooling"],
      relatedTopics: [
        "sql-queries-optimization",
        "concurrency-control",
        "read-replicas",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/connection-pooling"),
  },
  "backend/data-storage-databases/consistency-models": {
    metadata: {
      id: "article-backend-consistency-models-extensive",
      title: "Consistency Models",
      description:
        "Deep guide to consistency models, user-visible guarantees, and system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "consistency-models",
      wordCount: 1738,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "consistency"],
      relatedTopics: ["cap-theorem", "base-properties", "read-replicas"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/consistency-models"),
  },
  "backend/data-storage-databases/data-lakes": {
    metadata: {
      id: "article-backend-data-lakes-extensive",
      title: "Data Lakes",
      description:
        "Deep guide to data lakes, governance, storage formats, and analytics trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-lakes",
      wordCount: 1653,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-lake", "analytics", "storage"],
      relatedTopics: [
        "data-warehouses",
        "object-storage",
        "data-serialization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/data-lakes"),
  },
  "backend/data-storage-databases/data-modeling-in-nosql": {
    metadata: {
      id: "article-backend-data-modeling-nosql-extensive",
      title: "Data Modeling in NoSQL",
      description:
        "Deep guide to NoSQL data modeling, denormalization patterns, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-modeling-in-nosql",
      wordCount: 1654,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "modeling"],
      relatedTopics: [
        "document-databases",
        "key-value-stores",
        "column-family-stores",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/data-modeling-in-nosql"),
  },
  "backend/data-storage-databases/data-warehouses": {
    metadata: {
      id: "article-backend-data-warehouses-extensive",
      title: "Data Warehouses",
      description:
        "Deep guide to data warehouses, OLAP modeling, and analytics performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-warehouses",
      wordCount: 1578,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-warehouse", "analytics", "olap"],
      relatedTopics: [
        "data-lakes",
        "query-optimization-techniques",
        "sql-queries-optimization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/data-warehouses"),
  },
  "backend/data-storage-databases/database-constraints": {
    metadata: {
      id: "article-backend-database-constraints-extensive",
      title: "Database Constraints",
      description:
        "Deep guide to database constraints, integrity guarantees, and schema-level validation.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-constraints",
      wordCount: 1806,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "constraints"],
      relatedTopics: [
        "relational-database-design",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/database-constraints"),
  },
  "backend/data-storage-databases/database-indexes": {
    metadata: {
      id: "article-backend-database-indexes-extensive",
      title: "Database Indexes",
      description:
        "Comprehensive guide to database indexes, internal structures, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-indexes",
      wordCount: 1721,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "sql-queries-optimization",
        "index-types",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/database-indexes"),
  },
  "backend/data-storage-databases/database-partitioning": {
    metadata: {
      id: "article-backend-database-partitioning-extensive",
      title: "Database Partitioning",
      description:
        "Deep guide to database partitioning strategies, shard keys, rebalancing, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-partitioning",
      wordCount: 2491,
      readingTime: 13,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "partitioning", "scaling", "sharding"],
      relatedTopics: [
        "read-replicas",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/database-partitioning"),
  },
  "backend/data-storage-databases/deadlocks": {
    metadata: {
      id: "article-backend-deadlocks-extensive",
      title: "Deadlocks",
      description:
        "Comprehensive guide to deadlocks, detection, prevention, and recovery strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "deadlocks",
      wordCount: 1671,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "transactions", "deadlocks"],
      relatedTopics: [
        "concurrency-control",
        "transaction-isolation-levels",
        "acid-properties",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/deadlocks"),
  },
  "backend/data-storage-databases/document-databases": {
    metadata: {
      id: "article-backend-document-databases-extensive",
      title: "Document Databases",
      description:
        "Deep guide to document databases, modeling patterns, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "document-databases",
      wordCount: 1790,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "document"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/document-databases"),
  },
  "backend/data-storage-databases/file-systems": {
    metadata: {
      id: "article-backend-file-systems-extensive",
      title: "File Systems",
      description:
        "Deep guide to file systems, POSIX semantics, and distributed file system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "file-systems",
      wordCount: 1646,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "file-systems"],
      relatedTopics: [
        "object-storage",
        "block-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/file-systems"),
  },
  "backend/data-storage-databases/graph-databases": {
    metadata: {
      id: "article-backend-graph-databases-extensive",
      title: "Graph Databases",
      description:
        "Deep guide to graph databases, data modeling, traversal queries, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "graph-databases",
      wordCount: 1699,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "graph"],
      relatedTopics: [
        "query-optimization-techniques",
        "cap-theorem",
        "base-properties",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/graph-databases"),
  },
  "backend/data-storage-databases/in-memory-databases": {
    metadata: {
      id: "article-backend-in-memory-databases-extensive",
      title: "In-Memory Databases",
      description:
        "Deep guide to in-memory databases, persistence options, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "in-memory-databases",
      wordCount: 1594,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "in-memory", "performance"],
      relatedTopics: [
        "caching-performance",
        "key-value-stores",
        "connection-pooling",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/in-memory-databases"),
  },
  "backend/data-storage-databases/index-types": {
    metadata: {
      id: "article-backend-index-types-extensive",
      title: "Index Types",
      description:
        "Comprehensive guide to primary, unique, composite, partial, and other index types.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "index-types",
      wordCount: 1797,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "database-indexes",
        "sql-queries-optimization",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/index-types"),
  },
  "backend/data-storage-databases/key-value-stores": {
    metadata: {
      id: "article-backend-key-value-stores-extensive",
      title: "Key-Value Stores",
      description:
        "Deep guide to key-value stores, access patterns, consistency, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "key-value-stores",
      wordCount: 1768,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "key-value"],
      relatedTopics: [
        "in-memory-databases",
        "caching-performance",
        "cap-theorem",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/key-value-stores"),
  },
  "backend/data-storage-databases/object-storage": {
    metadata: {
      id: "article-backend-object-storage-extensive",
      title: "Object Storage",
      description:
        "Deep guide to object storage, durability models, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "object-storage",
      wordCount: 1641,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "object-storage"],
      relatedTopics: ["file-systems", "block-storage", "data-backups-archival"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/object-storage"),
  },
  "backend/data-storage-databases/orms": {
    metadata: {
      id: "article-backend-orms-extensive",
      title: "ORMs",
      description:
        "Deep guide to ORMs, performance pitfalls, and design patterns for scalable data access.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "orms",
      wordCount: 1826,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "orm", "sql"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/orms"),
  },
  "backend/data-storage-databases/query-optimization-techniques": {
    metadata: {
      id: "article-backend-query-optimization-techniques-extensive",
      title: "Query Optimization Techniques",
      description:
        "Comprehensive guide to SQL query optimization techniques, join strategies, and planner behavior.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-optimization-techniques",
      wordCount: 1812,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "optimization", "performance"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "index-types",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/query-optimization-techniques"),
  },
  "backend/data-storage-databases/query-patterns": {
    metadata: {
      id: "article-backend-query-patterns-extensive",
      title: "Query Patterns",
      description:
        "Deep guide to query patterns, modeling for access paths, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-patterns",
      wordCount: 1664,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "modeling", "performance"],
      relatedTopics: [
        "data-modeling-in-nosql",
        "query-optimization-techniques",
        "database-indexes",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/query-patterns"),
  },
  "backend/data-storage-databases/read-replicas": {
    metadata: {
      id: "article-backend-read-replicas-extensive",
      title: "Read Replicas",
      description:
        "Deep guide to read replicas, replication lag, read routing, and availability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "read-replicas",
      wordCount: 2143,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "replication", "availability", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "concurrency-control",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/read-replicas"),
  },
  "backend/data-storage-databases/relational-database-design": {
    metadata: {
      id: "article-backend-relational-database-design-extensive",
      title: "Relational Database Design",
      description:
        "Comprehensive guide to relational database design, normalization, constraints, and schema trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "relational-database-design",
      wordCount: 2068,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "design", "modeling"],
      relatedTopics: [
        "acid-properties",
        "database-indexes",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/relational-database-design"),
  },
  "backend/data-storage-databases/replication-in-nosql": {
    metadata: {
      id: "article-backend-replication-in-nosql-extensive",
      title: "Replication in NoSQL",
      description:
        "Deep guide to NoSQL replication models, consistency trade-offs, and conflict resolution.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "replication-in-nosql",
      wordCount: 1585,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "replication"],
      relatedTopics: ["read-replicas", "consistency-models", "cap-theorem"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/replication-in-nosql"),
  },
  "backend/data-storage-databases/search-engines": {
    metadata: {
      id: "article-backend-search-engines-extensive",
      title: "Search Engines",
      description:
        "Deep guide to search engines, inverted indexes, relevance ranking, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "search-engines",
      wordCount: 1699,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "search", "databases", "indexing"],
      relatedTopics: [
        "query-optimization-techniques",
        "serialization-formats",
        "caching-performance",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/search-engines"),
  },
  "backend/data-storage-databases/sharding-strategies": {
    metadata: {
      id: "article-backend-sharding-strategies-extensive",
      title: "Sharding Strategies",
      description:
        "Deep guide to sharding strategies, key selection, rebalancing, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sharding-strategies",
      wordCount: 1603,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sharding", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "cap-theorem",
        "consistency-models",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/sharding-strategies"),
  },
  "backend/data-storage-databases/sql-queries-optimization": {
    metadata: {
      id: "article-backend-sql-queries-optimization-extensive",
      title: "SQL Queries & Optimization",
      description:
        "Comprehensive guide to SQL query optimization, execution plans, and indexing strategy.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sql-queries-optimization",
      wordCount: 1874,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "performance", "optimization"],
      relatedTopics: [
        "database-indexes",
        "query-optimization-techniques",
        "connection-pooling",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/sql-queries-optimization"),
  },
  "backend/data-storage-databases/stored-procedures-functions": {
    metadata: {
      id: "article-backend-stored-procedures-functions-extensive",
      title: "Stored Procedures & Functions",
      description:
        "Deep guide to stored procedures and functions, performance impact, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "stored-procedures-functions",
      wordCount: 1925,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "stored-procedures"],
      relatedTopics: [
        "sql-queries-optimization",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/stored-procedures-functions"),
  },
  "backend/data-storage-databases/time-series-databases": {
    metadata: {
      id: "article-backend-time-series-databases-extensive",
      title: "Time-Series Databases",
      description:
        "Deep guide to time-series databases, data modeling, retention, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "time-series-databases",
      wordCount: 1706,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "timeseries", "nosql"],
      relatedTopics: [
        "column-family-stores",
        "query-optimization-techniques",
        "database-partitioning",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/time-series-databases"),
  },
  "backend/data-storage-databases/transaction-isolation-levels": {
    metadata: {
      id: "article-backend-transaction-isolation-levels-extensive",
      title: "Transaction Isolation Levels",
      description:
        "Comprehensive guide to transaction isolation levels, anomalies, and trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "transaction-isolation-levels",
      wordCount: 1693,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "transactions", "isolation"],
      relatedTopics: ["acid-properties", "concurrency-control", "deadlocks"],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/transaction-isolation-levels"),
  },
  "backend/data-storage-databases/triggers": {
    metadata: {
      id: "article-backend-triggers-extensive",
      title: "Triggers",
      description:
        "Deep guide to database triggers, execution order, use cases, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "triggers",
      wordCount: 1856,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "triggers"],
      relatedTopics: [
        "stored-procedures-functions",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/triggers"),
  },
  "backend/data-storage-databases/views-materialized-views": {
    metadata: {
      id: "article-backend-views-materialized-views-extensive",
      title: "Views & Materialized Views",
      description:
        "Deep guide to views and materialized views, performance implications, and refresh strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "views-materialized-views",
      wordCount: 1820,
      readingTime: 10,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "views", "materialized"],
      relatedTopics: [
        "sql-queries-optimization",
        "query-optimization-techniques",
        "read-replicas",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/data-storage-databases/views-materialized-views"),
  },
  "backend/design-patterns-architectures/adapter-pattern": {
    metadata: {
      id: "article-backend-adapter-pattern-extensive",
      title: "Adapter Pattern",
      description:
        "In-depth guide to adapter pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "adapter-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "adapter"],
      relatedTopics: [
        "anti-corruption-layer",
        "hexagonal-architecture",
        "repository-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/adapter-pattern"),
  },
  "backend/design-patterns-architectures/ambassador-pattern": {
    metadata: {
      id: "article-backend-ambassador-pattern-extensive",
      title: "Ambassador Pattern",
      description:
        "In-depth guide to ambassador pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "ambassador-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "ambassador"],
      relatedTopics: [
        "sidecar-pattern",
        "adapter-pattern",
        "circuit-breaker-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/ambassador-pattern"),
  },
  "backend/design-patterns-architectures/anti-corruption-layer": {
    metadata: {
      id: "article-backend-anti-corruption-layer-extensive",
      title: "Anti-Corruption Layer",
      description:
        "In-depth guide to anti-corruption layer architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "anti-corruption-layer",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "acl"],
      relatedTopics: [
        "adapter-pattern",
        "domain-driven-design",
        "strangler-fig-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/anti-corruption-layer"),
  },
  "backend/design-patterns-architectures/api-gateway-pattern": {
    metadata: {
      id: "article-backend-api-gateway-pattern-extensive",
      title: "API Gateway Pattern",
      description:
        "In-depth guide to api gateway pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "api-gateway-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "gateway"],
      relatedTopics: [
        "microservices-architecture",
        "backend-for-frontend",
        "service-mesh-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/api-gateway-pattern"),
  },
  "backend/design-patterns-architectures/backend-for-frontend": {
    metadata: {
      id: "article-backend-backend-for-frontend-extensive",
      title: "Backend for Frontend",
      description:
        "In-depth guide to backend for frontend architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "backend-for-frontend",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "bff"],
      relatedTopics: [
        "api-gateway-pattern",
        "microservices-architecture",
        "service-mesh-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/backend-for-frontend"),
  },
  "backend/design-patterns-architectures/bulkhead-pattern": {
    metadata: {
      id: "article-backend-bulkhead-pattern-extensive",
      title: "Bulkhead Pattern",
      description:
        "In-depth guide to bulkhead pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "bulkhead-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "resilience"],
      relatedTopics: [
        "circuit-breaker-pattern",
        "timeout-pattern",
        "retry-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/bulkhead-pattern"),
  },
  "backend/design-patterns-architectures/cache-aside-pattern": {
    metadata: {
      id: "article-backend-cache-aside-pattern-extensive",
      title: "Cache-Aside Pattern",
      description:
        "In-depth guide to cache-aside pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "cache-aside-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "cache"],
      relatedTopics: [
        "materialized-view-pattern",
        "repository-pattern",
        "unit-of-work-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/cache-aside-pattern"),
  },
  "backend/design-patterns-architectures/circuit-breaker-pattern": {
    metadata: {
      id: "article-backend-circuit-breaker-pattern-extensive",
      title: "Circuit Breaker Pattern",
      description:
        "In-depth guide to circuit breaker pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "circuit-breaker-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "resilience"],
      relatedTopics: ["retry-pattern", "timeout-pattern", "bulkhead-pattern"],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/circuit-breaker-pattern"),
  },
  "backend/design-patterns-architectures/clean-architecture": {
    metadata: {
      id: "article-backend-clean-architecture-extensive",
      title: "Clean Architecture",
      description:
        "In-depth guide to clean architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "clean-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "clean"],
      relatedTopics: [
        "hexagonal-architecture",
        "layered-architecture",
        "domain-driven-design",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/clean-architecture"),
  },
  "backend/design-patterns-architectures/cqrs-pattern": {
    metadata: {
      id: "article-backend-cqrs-pattern-extensive",
      title: "CQRS Pattern",
      description:
        "In-depth guide to cqrs pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "cqrs-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "cqrs"],
      relatedTopics: [
        "event-sourcing-pattern",
        "materialized-view-pattern",
        "saga-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/cqrs-pattern"),
  },
  "backend/design-patterns-architectures/database-per-service": {
    metadata: {
      id: "article-backend-database-per-service-extensive",
      title: "Database per Service",
      description:
        "In-depth guide to database per service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "database-per-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "data"],
      relatedTopics: [
        "microservices-architecture",
        "shared-database-anti-pattern",
        "repository-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/database-per-service"),
  },
  "backend/design-patterns-architectures/domain-driven-design": {
    metadata: {
      id: "article-backend-domain-driven-design-extensive",
      title: "Domain-Driven Design",
      description:
        "In-depth guide to domain-driven design architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "domain-driven-design",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "ddd"],
      relatedTopics: [
        "service-decomposition",
        "anti-corruption-layer",
        "cqrs-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/domain-driven-design"),
  },
  "backend/design-patterns-architectures/event-driven-architecture": {
    metadata: {
      id: "article-backend-event-driven-architecture-extensive",
      title: "Event-Driven Architecture",
      description:
        "In-depth guide to event-driven architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "event-driven-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "event-driven"],
      relatedTopics: ["event-sourcing-pattern", "saga-pattern", "cqrs-pattern"],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/event-driven-architecture"),
  },
  "backend/design-patterns-architectures/event-sourcing-pattern": {
    metadata: {
      id: "article-backend-event-sourcing-pattern-extensive",
      title: "Event Sourcing Pattern",
      description:
        "In-depth guide to event sourcing pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "event-sourcing-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "events"],
      relatedTopics: [
        "cqrs-pattern",
        "event-driven-architecture",
        "saga-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/event-sourcing-pattern"),
  },
  "backend/design-patterns-architectures/hexagonal-architecture": {
    metadata: {
      id: "article-backend-hexagonal-architecture-extensive",
      title: "Hexagonal Architecture",
      description:
        "In-depth guide to hexagonal architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "hexagonal-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "hexagonal"],
      relatedTopics: [
        "clean-architecture",
        "adapter-pattern",
        "layered-architecture",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/hexagonal-architecture"),
  },
  "backend/design-patterns-architectures/layered-architecture": {
    metadata: {
      id: "article-backend-layered-architecture-extensive",
      title: "Layered Architecture",
      description:
        "In-depth guide to layered architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "layered-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "layered"],
      relatedTopics: [
        "clean-architecture",
        "hexagonal-architecture",
        "repository-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/layered-architecture"),
  },
  "backend/design-patterns-architectures/materialized-view-pattern": {
    metadata: {
      id: "article-backend-materialized-view-pattern-extensive",
      title: "Materialized View Pattern",
      description:
        "In-depth guide to materialized view pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "materialized-view-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "data"],
      relatedTopics: [
        "cqrs-pattern",
        "cache-aside-pattern",
        "event-sourcing-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/materialized-view-pattern"),
  },
  "backend/design-patterns-architectures/microservices-architecture": {
    metadata: {
      id: "article-backend-microservices-architecture-extensive",
      title: "Microservices Architecture",
      description:
        "In-depth guide to microservices architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "microservices-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "microservices"],
      relatedTopics: [
        "service-decomposition",
        "api-gateway-pattern",
        "service-mesh-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/microservices-architecture"),
  },
  "backend/design-patterns-architectures/monolithic-architecture": {
    metadata: {
      id: "article-backend-monolithic-architecture-extensive",
      title: "Monolithic Architecture",
      description:
        "In-depth guide to monolithic architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "monolithic-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "monolith"],
      relatedTopics: [
        "microservices-architecture",
        "layered-architecture",
        "strangler-fig-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/monolithic-architecture"),
  },
  "backend/design-patterns-architectures/repository-pattern": {
    metadata: {
      id: "article-backend-repository-pattern-extensive",
      title: "Repository Pattern",
      description:
        "In-depth guide to repository pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "repository-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "repository"],
      relatedTopics: [
        "unit-of-work-pattern",
        "adapter-pattern",
        "layered-architecture",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/repository-pattern"),
  },
  "backend/design-patterns-architectures/retry-pattern": {
    metadata: {
      id: "article-backend-retry-pattern-extensive",
      title: "Retry Pattern",
      description:
        "In-depth guide to retry pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "retry-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "resilience"],
      relatedTopics: [
        "timeout-pattern",
        "circuit-breaker-pattern",
        "throttling-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/retry-pattern"),
  },
  "backend/design-patterns-architectures/saga-pattern": {
    metadata: {
      id: "article-backend-saga-pattern-extensive",
      title: "Saga Pattern",
      description:
        "In-depth guide to saga pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "saga-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "saga"],
      relatedTopics: [
        "cqrs-pattern",
        "event-driven-architecture",
        "event-sourcing-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/saga-pattern"),
  },
  "backend/design-patterns-architectures/serverless-architecture": {
    metadata: {
      id: "article-backend-serverless-architecture-extensive",
      title: "Serverless Architecture",
      description:
        "In-depth guide to serverless architecture architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "serverless-architecture",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "serverless"],
      relatedTopics: [
        "event-driven-architecture",
        "microservices-architecture",
        "api-gateway-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/serverless-architecture"),
  },
  "backend/design-patterns-architectures/service-mesh-pattern": {
    metadata: {
      id: "article-backend-service-mesh-pattern-extensive",
      title: "Service Mesh Pattern",
      description:
        "In-depth guide to service mesh pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "service-mesh-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "mesh"],
      relatedTopics: [
        "microservices-architecture",
        "sidecar-pattern",
        "circuit-breaker-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/service-mesh-pattern"),
  },
  "backend/design-patterns-architectures/shared-database-anti-pattern": {
    metadata: {
      id: "article-backend-shared-database-anti-pattern-extensive",
      title: "Shared Database Anti-Pattern",
      description:
        "In-depth guide to shared database anti-pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "shared-database-anti-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "anti-pattern"],
      relatedTopics: [
        "database-per-service",
        "microservices-architecture",
        "anti-corruption-layer",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/shared-database-anti-pattern"),
  },
  "backend/design-patterns-architectures/sidecar-pattern": {
    metadata: {
      id: "article-backend-sidecar-pattern-extensive",
      title: "Sidecar Pattern",
      description:
        "In-depth guide to sidecar pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "sidecar-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "sidecar"],
      relatedTopics: [
        "service-mesh-pattern",
        "ambassador-pattern",
        "bulkhead-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/sidecar-pattern"),
  },
  "backend/design-patterns-architectures/strangler-fig-pattern": {
    metadata: {
      id: "article-backend-strangler-fig-pattern-extensive",
      title: "Strangler Fig Pattern",
      description:
        "In-depth guide to strangler fig pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "strangler-fig-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "migration"],
      relatedTopics: [
        "monolithic-architecture",
        "microservices-architecture",
        "anti-corruption-layer",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/strangler-fig-pattern"),
  },
  "backend/design-patterns-architectures/throttling-pattern": {
    metadata: {
      id: "article-backend-throttling-pattern-extensive",
      title: "Throttling Pattern",
      description:
        "In-depth guide to throttling pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "throttling-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "resilience"],
      relatedTopics: [
        "retry-pattern",
        "bulkhead-pattern",
        "cache-aside-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/throttling-pattern"),
  },
  "backend/design-patterns-architectures/timeout-pattern": {
    metadata: {
      id: "article-backend-timeout-pattern-extensive",
      title: "Timeout Pattern",
      description:
        "In-depth guide to timeout pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "timeout-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "resilience"],
      relatedTopics: [
        "retry-pattern",
        "circuit-breaker-pattern",
        "bulkhead-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/timeout-pattern"),
  },
  "backend/design-patterns-architectures/unit-of-work-pattern": {
    metadata: {
      id: "article-backend-unit-of-work-pattern-extensive",
      title: "Unit of Work Pattern",
      description:
        "In-depth guide to unit of work pattern architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "design-patterns-architectures",
      slug: "unit-of-work-pattern",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "architecture", "uow"],
      relatedTopics: [
        "repository-pattern",
        "transaction-isolation-levels",
        "cqrs-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/design-patterns-architectures/unit-of-work-pattern"),
  },
  "backend/fundamentals-building-blocks/api-design-best-practices": {
    metadata: {
      id: "article-backend-api-design-best-practices-extensive",
      title: "API Design Best Practices",
      description:
        "Comprehensive guide to API design best practices including pagination, filtering, errors, versioning, and reliability.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "api-design-best-practices",
      wordCount: 2779,
      readingTime: 14,
      lastUpdated: "2026-03-09",
      tags: ["backend", "api", "design", "reliability", "standards"],
      relatedTopics: [
        "rest-api-design",
        "http-https-protocol",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/api-design-best-practices"),
  },
  "backend/fundamentals-building-blocks/character-encoding": {
    metadata: {
      id: "article-backend-character-encoding-extensive",
      title: "Character Encoding",
      description:
        "Comprehensive guide to Unicode, UTF-8, and common encoding pitfalls in backend systems.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "character-encoding",
      wordCount: 2108,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "encoding", "utf-8"],
      relatedTopics: [
        "serialization-formats",
        "compression",
        "http-https-protocol",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/character-encoding"),
  },
  "backend/fundamentals-building-blocks/client-server-architecture": {
    metadata: {
      id: "article-backend-client-server-extensive",
      title: "Client-Server Architecture",
      description:
        "Comprehensive guide to client-server architecture covering fundamentals, variants, trade-offs, and interview readiness.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "client-server-architecture",
      wordCount: 3751,
      readingTime: 19,
      lastUpdated: "2026-03-09",
      tags: [
        "backend",
        "architecture",
        "client-server",
        "networking",
        "scalability",
      ],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "stateless-vs-stateful-services",
        "tcp-vs-udp",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/client-server-architecture"),
  },
  "backend/fundamentals-building-blocks/compression": {
    metadata: {
      id: "article-backend-compression-extensive",
      title: "Compression",
      description:
        "Comprehensive guide to compression algorithms, trade-offs, and HTTP content encoding.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "compression",
      wordCount: 2188,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "compression", "performance"],
      relatedTopics: [
        "serialization-formats",
        "http-https-protocol",
        "caching-performance",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/compression"),
  },
  "backend/fundamentals-building-blocks/domain-name-system": {
    metadata: {
      id: "article-backend-dns-extensive",
      title: "Domain Name System (DNS)",
      description:
        "Comprehensive guide to DNS resolution, record types, caching, and operational pitfalls.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "domain-name-system",
      wordCount: 2835,
      readingTime: 15,
      lastUpdated: "2026-03-09",
      tags: ["backend", "dns", "networking", "infrastructure"],
      relatedTopics: [
        "http-https-protocol",
        "ip-addressing",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/domain-name-system"),
  },
  "backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling": {
    metadata: {
      id: "article-backend-horizontal-vertical-extensive",
      title: "Horizontal vs Vertical Scaling",
      description:
        "Comprehensive guide to scaling up vs scaling out, trade-offs, and operational patterns.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "horizontal-vs-vertical-scaling",
      wordCount: 2136,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "scaling", "architecture"],
      relatedTopics: [
        "stateless-vs-stateful-services",
        "caching-performance",
        "load-balancers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling"),
  },
  "backend/fundamentals-building-blocks/http-https-protocol": {
    metadata: {
      id: "article-backend-http-https-extensive",
      title: "HTTP/HTTPS Protocol",
      description:
        "Comprehensive guide to HTTP and HTTPS covering methods, status codes, headers, TLS, and performance trade-offs.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "http-https-protocol",
      wordCount: 4788,
      readingTime: 24,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "https", "protocols", "networking"],
      relatedTopics: [
        "client-server-architecture",
        "request-response-lifecycle",
        "tcp-vs-udp",
        "serialization-formats",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/http-https-protocol"),
  },
  "backend/fundamentals-building-blocks/ip-addressing": {
    metadata: {
      id: "article-backend-ip-addressing-extensive",
      title: "IP Addressing",
      description:
        "Comprehensive guide to IPv4, IPv6, CIDR, and subnetting with practical backend examples.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "ip-addressing",
      wordCount: 2609,
      readingTime: 14,
      lastUpdated: "2026-03-09",
      tags: ["backend", "ip", "networking", "cidr"],
      relatedTopics: [
        "domain-name-system",
        "tcp-vs-udp",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/ip-addressing"),
  },
  "backend/fundamentals-building-blocks/networking-fundamentals": {
    metadata: {
      id: "article-backend-networking-fundamentals-extensive",
      title: "Networking Fundamentals",
      description:
        "Comprehensive guide to routing, switching, NAT, firewalls, and VPNs for backend systems.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "networking-fundamentals",
      wordCount: 2274,
      readingTime: 12,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "routing", "security"],
      relatedTopics: [
        "ip-addressing",
        "tcp-vs-udp",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/networking-fundamentals"),
  },
  "backend/fundamentals-building-blocks/osi-model-tcp-ip-stack": {
    metadata: {
      id: "article-backend-osi-tcpip-extensive",
      title: "OSI Model & TCP/IP Stack",
      description:
        "Comprehensive guide to OSI and TCP/IP layering, encapsulation, and debugging network issues.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "osi-model-tcp-ip-stack",
      wordCount: 2307,
      readingTime: 12,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "osi", "tcp-ip"],
      relatedTopics: [
        "tcp-vs-udp",
        "request-response-lifecycle",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/osi-model-tcp-ip-stack"),
  },
  "backend/fundamentals-building-blocks/request-response-lifecycle": {
    metadata: {
      id: "article-backend-request-response-extensive",
      title: "Request/Response Lifecycle",
      description:
        "Comprehensive guide to the end-to-end request lifecycle with latency and middleware considerations.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "request-response-lifecycle",
      wordCount: 2212,
      readingTime: 12,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "lifecycle"],
      relatedTopics: [
        "http-https-protocol",
        "client-server-architecture",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/request-response-lifecycle"),
  },
  "backend/fundamentals-building-blocks/rest-api-design": {
    metadata: {
      id: "article-backend-rest-api-design-extensive",
      title: "REST API Design",
      description:
        "Comprehensive guide to REST API design, resource modeling, status codes, and real-world trade-offs.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "rest-api-design",
      wordCount: 4347,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "rest", "api", "design", "architecture"],
      relatedTopics: [
        "http-https-protocol",
        "api-design-best-practices",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/rest-api-design"),
  },
  "backend/fundamentals-building-blocks/serialization-formats": {
    metadata: {
      id: "article-backend-serialization-formats-extensive",
      title: "Serialization Formats",
      description:
        "Comprehensive guide to JSON, Protobuf, Avro, Thrift, and trade-offs in serialization.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "serialization-formats",
      wordCount: 2169,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "serialization", "formats"],
      relatedTopics: [
        "character-encoding",
        "compression",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/serialization-formats"),
  },
  "backend/fundamentals-building-blocks/stateless-vs-stateful-services": {
    metadata: {
      id: "article-backend-stateless-stateful-extensive",
      title: "Stateless vs Stateful Services",
      description:
        "Comprehensive guide to stateless and stateful services, trade-offs, and scaling impacts.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "stateless-vs-stateful-services",
      wordCount: 2107,
      readingTime: 11,
      lastUpdated: "2026-03-09",
      tags: ["backend", "architecture", "state"],
      relatedTopics: [
        "horizontal-vs-vertical-scaling",
        "request-response-lifecycle",
        "caching-performance",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/stateless-vs-stateful-services"),
  },
  "backend/fundamentals-building-blocks/tcp-vs-udp": {
    metadata: {
      id: "article-backend-tcp-vs-udp-extensive",
      title: "TCP vs UDP",
      description:
        "Comprehensive guide to TCP vs UDP, reliability, performance trade-offs, and real-world use cases.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "tcp-vs-udp",
      wordCount: 2461,
      readingTime: 13,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "tcp", "udp"],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/fundamentals-building-blocks/tcp-vs-udp"),
  },
  "backend/infrastructure-deployment/auto-scaling": {
    metadata: {
      id: "article-backend-auto-scaling-extensive",
      title: "Auto-Scaling",
      description:
        "In-depth guide to auto-scaling architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "auto-scaling",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "scaling"],
      relatedTopics: [
        "container-orchestration",
        "load-balancer-configuration",
        "capacity-planning",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/auto-scaling"),
  },
  "backend/infrastructure-deployment/blue-green-deployment": {
    metadata: {
      id: "article-backend-blue-green-deployment-extensive",
      title: "Blue-Green Deployment",
      description:
        "In-depth guide to blue-green deployment architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "blue-green-deployment",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "deployment"],
      relatedTopics: [
        "canary-deployment",
        "rolling-deployment",
        "feature-flags",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/blue-green-deployment"),
  },
  "backend/infrastructure-deployment/canary-deployment": {
    metadata: {
      id: "article-backend-canary-deployment-extensive",
      title: "Canary Deployment",
      description:
        "In-depth guide to canary deployment architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "canary-deployment",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "deployment"],
      relatedTopics: [
        "blue-green-deployment",
        "rolling-deployment",
        "feature-flags",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/canary-deployment"),
  },
  "backend/infrastructure-deployment/ci-cd-pipelines": {
    metadata: {
      id: "article-backend-ci-cd-pipelines-extensive",
      title: "CI/CD Pipelines",
      description:
        "In-depth guide to ci/cd pipelines architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "ci-cd-pipelines",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "cicd"],
      relatedTopics: [
        "feature-flags",
        "blue-green-deployment",
        "canary-deployment",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/ci-cd-pipelines"),
  },
  "backend/infrastructure-deployment/cloud-services": {
    metadata: {
      id: "article-backend-cloud-services-extensive",
      title: "Cloud Services",
      description:
        "In-depth guide to cloud services architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "cloud-services",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "cloud"],
      relatedTopics: ["auto-scaling", "networking", "dns-management"],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/cloud-services"),
  },
  "backend/infrastructure-deployment/configuration-management": {
    metadata: {
      id: "article-backend-configuration-management-extensive",
      title: "Configuration Management",
      description:
        "In-depth guide to configuration management architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "configuration-management",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "config"],
      relatedTopics: [
        "infrastructure-as-code",
        "immutable-infrastructure",
        "ci-cd-pipelines",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/configuration-management"),
  },
  "backend/infrastructure-deployment/container-orchestration": {
    metadata: {
      id: "article-backend-container-orchestration-extensive",
      title: "Container Orchestration",
      description:
        "In-depth guide to container orchestration architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "container-orchestration",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "orchestration"],
      relatedTopics: ["containerization", "auto-scaling", "service-discovery"],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/container-orchestration"),
  },
  "backend/infrastructure-deployment/containerization": {
    metadata: {
      id: "article-backend-containerization-extensive",
      title: "Containerization",
      description:
        "In-depth guide to containerization architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "containerization",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "containers"],
      relatedTopics: [
        "container-orchestration",
        "ci-cd-pipelines",
        "immutable-infrastructure",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/containerization"),
  },
  "backend/infrastructure-deployment/dns-management": {
    metadata: {
      id: "article-backend-dns-management-extensive",
      title: "DNS Management",
      description:
        "In-depth guide to dns management architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "dns-management",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "dns"],
      relatedTopics: [
        "load-balancer-configuration",
        "cloud-services",
        "networking",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/dns-management"),
  },
  "backend/infrastructure-deployment/feature-flags": {
    metadata: {
      id: "article-backend-feature-flags-extensive",
      title: "Feature Flags",
      description:
        "In-depth guide to feature flags architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "feature-flags",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "release"],
      relatedTopics: ["ci-cd-pipelines", "canary-deployment", "gitops"],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/feature-flags"),
  },
  "backend/infrastructure-deployment/gitops": {
    metadata: {
      id: "article-backend-gitops-extensive",
      title: "GitOps",
      description:
        "In-depth guide to gitops architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "gitops",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "gitops"],
      relatedTopics: [
        "infrastructure-as-code",
        "ci-cd-pipelines",
        "immutable-infrastructure",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/gitops"),
  },
  "backend/infrastructure-deployment/immutable-infrastructure": {
    metadata: {
      id: "article-backend-immutable-infrastructure-extensive",
      title: "Immutable Infrastructure",
      description:
        "In-depth guide to immutable infrastructure architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "immutable-infrastructure",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "immutable"],
      relatedTopics: [
        "configuration-management",
        "infrastructure-as-code",
        "ci-cd-pipelines",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/immutable-infrastructure"),
  },
  "backend/infrastructure-deployment/infrastructure-as-code": {
    metadata: {
      id: "article-backend-infrastructure-as-code-extensive",
      title: "Infrastructure as Code",
      description:
        "In-depth guide to infrastructure as code architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "infrastructure-as-code",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "iac"],
      relatedTopics: ["configuration-management", "gitops", "cloud-services"],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/infrastructure-as-code"),
  },
  "backend/infrastructure-deployment/load-balancer-configuration": {
    metadata: {
      id: "article-backend-load-balancer-configuration-extensive",
      title: "Load Balancer Configuration",
      description:
        "In-depth guide to load balancer configuration architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "load-balancer-configuration",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "load-balancer"],
      relatedTopics: ["auto-scaling", "service-discovery", "networking"],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/load-balancer-configuration"),
  },
  "backend/infrastructure-deployment/networking": {
    metadata: {
      id: "article-backend-networking-extensive",
      title: "Networking",
      description:
        "In-depth guide to networking architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "networking",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "network"],
      relatedTopics: [
        "dns-management",
        "load-balancer-configuration",
        "cloud-services",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/networking"),
  },
  "backend/infrastructure-deployment/rolling-deployment": {
    metadata: {
      id: "article-backend-rolling-deployment-extensive",
      title: "Rolling Deployment",
      description:
        "In-depth guide to rolling deployment architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "rolling-deployment",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "deployment"],
      relatedTopics: [
        "canary-deployment",
        "blue-green-deployment",
        "auto-scaling",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/rolling-deployment"),
  },
  "backend/infrastructure-deployment/service-discovery": {
    metadata: {
      id: "article-backend-service-discovery-extensive",
      title: "Service Discovery",
      description:
        "In-depth guide to service discovery architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "service-discovery",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "discovery"],
      relatedTopics: [
        "service-registry",
        "container-orchestration",
        "load-balancer-configuration",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/service-discovery"),
  },
  "backend/infrastructure-deployment/service-registry": {
    metadata: {
      id: "article-backend-service-registry-extensive",
      title: "Service Registry",
      description:
        "In-depth guide to service registry architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "service-registry",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "registry"],
      relatedTopics: [
        "service-discovery",
        "load-balancer-configuration",
        "container-orchestration",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/service-registry"),
  },
  "backend/infrastructure-deployment/virtual-machines": {
    metadata: {
      id: "article-backend-virtual-machines-extensive",
      title: "Virtual Machines",
      description:
        "In-depth guide to virtual machines architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "infrastructure-deployment",
      slug: "virtual-machines",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "infra", "virtualization"],
      relatedTopics: [
        "containerization",
        "immutable-infrastructure",
        "cloud-services",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/infrastructure-deployment/virtual-machines"),
  },
  "backend/monitoring-operations/alerting": {
    metadata: {
      id: "article-backend-alerting-extensive",
      title: "Alerting",
      description:
        "In-depth guide to alerting architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "alerting",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "alerting"],
      relatedTopics: ["sli-slo-sla", "error-budgets", "metrics"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/alerting"),
  },
  "backend/monitoring-operations/anomaly-detection": {
    metadata: {
      id: "article-backend-anomaly-detection-extensive",
      title: "Anomaly Detection",
      description:
        "In-depth guide to anomaly detection architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "anomaly-detection",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "anomaly"],
      relatedTopics: ["metrics", "alerting", "observability"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/anomaly-detection"),
  },
  "backend/monitoring-operations/apm-application-performance-monitoring": {
    metadata: {
      id: "article-backend-apm-application-performance-monitoring-extensive",
      title: "APM (Application Performance Monitoring)",
      description:
        "In-depth guide to apm (application performance monitoring) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "apm-application-performance-monitoring",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "apm"],
      relatedTopics: ["tracing", "metrics", "observability"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/apm-application-performance-monitoring"),
  },
  "backend/monitoring-operations/capacity-planning": {
    metadata: {
      id: "article-backend-capacity-planning-extensive",
      title: "Capacity Planning",
      description:
        "In-depth guide to capacity planning architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "capacity-planning",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "capacity"],
      relatedTopics: [
        "performance-profiling",
        "metrics",
        "infrastructure-monitoring",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/capacity-planning"),
  },
  "backend/monitoring-operations/dashboards": {
    metadata: {
      id: "article-backend-dashboards-extensive",
      title: "Dashboards",
      description:
        "In-depth guide to dashboards architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "dashboards",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "dashboards"],
      relatedTopics: [
        "metrics",
        "alerting",
        "apm-application-performance-monitoring",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/dashboards"),
  },
  "backend/monitoring-operations/database-monitoring": {
    metadata: {
      id: "article-backend-database-monitoring-extensive",
      title: "Database Monitoring",
      description:
        "In-depth guide to database monitoring architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "database-monitoring",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "database"],
      relatedTopics: ["database-indexing", "metrics", "alerting"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/database-monitoring"),
  },
  "backend/monitoring-operations/distributed-tracing": {
    metadata: {
      id: "article-backend-distributed-tracing-extensive",
      title: "Distributed Tracing",
      description:
        "In-depth guide to distributed tracing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "distributed-tracing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "tracing"],
      relatedTopics: [
        "tracing",
        "observability",
        "apm-application-performance-monitoring",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/distributed-tracing"),
  },
  "backend/monitoring-operations/error-budgets": {
    metadata: {
      id: "article-backend-error-budgets-extensive",
      title: "Error Budgets",
      description:
        "In-depth guide to error budgets architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "error-budgets",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "sre"],
      relatedTopics: ["sli-slo-sla", "alerting", "rollback-strategies"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/error-budgets"),
  },
  "backend/monitoring-operations/health-monitoring": {
    metadata: {
      id: "article-backend-health-monitoring-extensive",
      title: "Health Monitoring",
      description:
        "In-depth guide to health monitoring architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "health-monitoring",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "health"],
      relatedTopics: ["health-checks", "alerting", "observability"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/health-monitoring"),
  },
  "backend/monitoring-operations/infrastructure-monitoring": {
    metadata: {
      id: "article-backend-infrastructure-monitoring-extensive",
      title: "Infrastructure Monitoring",
      description:
        "In-depth guide to infrastructure monitoring architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "infrastructure-monitoring",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "infra"],
      relatedTopics: ["metrics", "capacity-planning", "alerting"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/infrastructure-monitoring"),
  },
  "backend/monitoring-operations/log-aggregation": {
    metadata: {
      id: "article-backend-log-aggregation-extensive",
      title: "Log Aggregation",
      description:
        "In-depth guide to log aggregation architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "log-aggregation",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "logging"],
      relatedTopics: ["logging", "monitoring-tools", "dashboards"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/log-aggregation"),
  },
  "backend/monitoring-operations/logging": {
    metadata: {
      id: "article-backend-logging-extensive",
      title: "Logging",
      description:
        "In-depth guide to logging architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "logging",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "logging"],
      relatedTopics: ["log-aggregation", "metrics", "tracing"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/logging"),
  },
  "backend/monitoring-operations/metrics": {
    metadata: {
      id: "article-backend-metrics-extensive",
      title: "Metrics",
      description:
        "In-depth guide to metrics architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "metrics",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "metrics"],
      relatedTopics: ["dashboards", "alerting", "sli-slo-sla"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/metrics"),
  },
  "backend/monitoring-operations/monitoring-tools": {
    metadata: {
      id: "article-backend-monitoring-tools-extensive",
      title: "Monitoring Tools",
      description:
        "In-depth guide to monitoring tools architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "monitoring-tools",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "tools"],
      relatedTopics: ["dashboards", "alerting", "log-aggregation"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/monitoring-tools"),
  },
  "backend/monitoring-operations/observability": {
    metadata: {
      id: "article-backend-observability-extensive",
      title: "Observability",
      description:
        "In-depth guide to observability architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "observability",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "observability"],
      relatedTopics: ["logging", "metrics", "tracing"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/observability"),
  },
  "backend/monitoring-operations/performance-profiling": {
    metadata: {
      id: "article-backend-performance-profiling-extensive",
      title: "Performance Profiling",
      description:
        "In-depth guide to performance profiling architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "performance-profiling",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "profiling"],
      relatedTopics: [
        "apm-application-performance-monitoring",
        "metrics",
        "database-monitoring",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/performance-profiling"),
  },
  "backend/monitoring-operations/sli-slo-sla": {
    metadata: {
      id: "article-backend-sli-slo-sla-extensive",
      title: "SLI/SLO/SLA",
      description:
        "In-depth guide to sli/slo/sla architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "sli-slo-sla",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "slo"],
      relatedTopics: ["error-budgets", "alerting", "metrics"],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/sli-slo-sla"),
  },
  "backend/monitoring-operations/tracing": {
    metadata: {
      id: "article-backend-tracing-extensive",
      title: "Tracing",
      description:
        "In-depth guide to tracing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "monitoring-operations",
      slug: "tracing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "monitoring", "tracing"],
      relatedTopics: [
        "distributed-tracing",
        "observability",
        "apm-application-performance-monitoring",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/monitoring-operations/tracing"),
  },
  "backend/network-communication/api-gateway-pattern": {
    metadata: {
      id: "article-backend-api-gateway-pattern-extensive",
      title: "API Gateway Pattern",
      description:
        "Comprehensive guide to API gateway architecture, policies, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "api-gateway-pattern",
      wordCount: 7200,
      readingTime: 36,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "gateway"],
      relatedTopics: ["service-mesh", "load-balancers", "api-versioning"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/api-gateway-pattern"),
  },
  "backend/network-communication/api-versioning": {
    metadata: {
      id: "article-backend-api-versioning-extensive",
      title: "API Versioning",
      description:
        "Comprehensive guide to API versioning strategy, governance, and migration.",
      category: "backend",
      subcategory: "network-communication",
      slug: "api-versioning",
      wordCount: 7200,
      readingTime: 36,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "api-versioning"],
      relatedTopics: ["api-gateway-pattern", "graphql", "grpc"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/api-versioning"),
  },
  "backend/network-communication/bulkhead-pattern": {
    metadata: {
      id: "article-backend-bulkhead-pattern-extensive",
      title: "Bulkhead Pattern",
      description:
        "Comprehensive guide to bulkhead isolation, sizing, and operations.",
      category: "backend",
      subcategory: "network-communication",
      slug: "bulkhead-pattern",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "resilience"],
      relatedTopics: [
        "circuit-breaker-pattern",
        "timeout-strategies",
        "request-hedging",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/bulkhead-pattern"),
  },
  "backend/network-communication/circuit-breaker-pattern": {
    metadata: {
      id: "article-backend-circuit-breaker-pattern-extensive",
      title: "Circuit Breaker Pattern",
      description:
        "Comprehensive guide to circuit breakers, failure handling, and operational tuning.",
      category: "backend",
      subcategory: "network-communication",
      slug: "circuit-breaker-pattern",
      wordCount: 7100,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "resilience"],
      relatedTopics: [
        "retry-mechanisms",
        "timeout-strategies",
        "bulkhead-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/circuit-breaker-pattern"),
  },
  "backend/network-communication/content-delivery-networks": {
    metadata: {
      id: "article-backend-content-delivery-networks-extensive",
      title: "Content Delivery Networks",
      description:
        "Deep guide to content delivery networks architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "content-delivery-networks",
      wordCount: 1335,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "network", "cdn"],
      relatedTopics: ["cdn-caching", "http-caching", "cache-invalidation"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/content-delivery-networks"),
  },
  "backend/network-communication/event-streaming": {
    metadata: {
      id: "article-backend-event-streaming-extensive",
      title: "Event Streaming",
      description:
        "Deep guide to event streaming architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "event-streaming",
      wordCount: 1336,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "messaging", "streaming"],
      relatedTopics: ["pub-sub-systems", "message-queues", "event-sourcing"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/event-streaming"),
  },
  "backend/network-communication/forward-proxy": {
    metadata: {
      id: "article-backend-forward-proxy-extensive",
      title: "Forward Proxy",
      description:
        "Comprehensive guide to forward proxies, egress control, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "forward-proxy",
      wordCount: 6800,
      readingTime: 34,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "proxy"],
      relatedTopics: [
        "reverse-proxy",
        "content-delivery-networks",
        "api-gateway-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/forward-proxy"),
  },
  "backend/network-communication/graphql": {
    metadata: {
      id: "article-backend-graphql-extensive",
      title: "GraphQL",
      description:
        "Deep guide to graphql architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "graphql",
      wordCount: 1326,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "network", "api"],
      relatedTopics: [
        "api-gateway-pattern",
        "api-versioning",
        "caching-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/graphql"),
  },
  "backend/network-communication/grpc": {
    metadata: {
      id: "article-backend-grpc-extensive",
      title: "gRPC",
      description:
        "Deep guide to grpc architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "grpc",
      wordCount: 1348,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "network", "rpc"],
      relatedTopics: ["rpc", "api-versioning", "service-discovery"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/grpc"),
  },
  "backend/network-communication/load-balancers": {
    metadata: {
      id: "article-backend-load-balancers-extensive",
      title: "Load Balancers",
      description:
        "Comprehensive guide to load balancing strategies, failure handling, and operations.",
      category: "backend",
      subcategory: "network-communication",
      slug: "load-balancers",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "load-balancing"],
      relatedTopics: [
        "api-gateway-pattern",
        "reverse-proxy",
        "service-discovery",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/load-balancers"),
  },
  "backend/network-communication/long-polling": {
    metadata: {
      id: "article-backend-long-polling-extensive",
      title: "Long Polling",
      description:
        "Comprehensive guide to long polling, scaling limits, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "long-polling",
      wordCount: 6800,
      readingTime: 34,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "long-polling"],
      relatedTopics: ["server-sent-events", "websockets", "event-streaming"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/long-polling"),
  },
  "backend/network-communication/message-queues": {
    metadata: {
      id: "article-backend-message-queues-extensive",
      title: "Message Queues",
      description:
        "Comprehensive guide to message queues, delivery semantics, and operations.",
      category: "backend",
      subcategory: "network-communication",
      slug: "message-queues",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "messaging"],
      relatedTopics: ["pub-sub-systems", "event-streaming", "request-hedging"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/message-queues"),
  },
  "backend/network-communication/pub-sub-systems": {
    metadata: {
      id: "article-backend-pub-sub-systems-extensive",
      title: "Pub/Sub Systems",
      description:
        "Comprehensive guide to pub/sub architecture, delivery, and scaling.",
      category: "backend",
      subcategory: "network-communication",
      slug: "pub-sub-systems",
      wordCount: 6900,
      readingTime: 34,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "messaging"],
      relatedTopics: ["message-queues", "event-streaming", "websockets"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/pub-sub-systems"),
  },
  "backend/network-communication/request-hedging": {
    metadata: {
      id: "article-backend-request-hedging-extensive",
      title: "Request Hedging",
      description:
        "Deep guide to request hedging architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "request-hedging",
      wordCount: 1329,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "reliability", "performance"],
      relatedTopics: [
        "retry-mechanisms",
        "timeout-strategies",
        "load-balancers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/request-hedging"),
  },
  "backend/network-communication/retry-mechanisms": {
    metadata: {
      id: "article-backend-retry-mechanisms-extensive",
      title: "Retry Mechanisms",
      description:
        "Comprehensive guide to retries, backoff, idempotency, and safe recovery.",
      category: "backend",
      subcategory: "network-communication",
      slug: "retry-mechanisms",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "resilience"],
      relatedTopics: [
        "timeout-strategies",
        "circuit-breaker-pattern",
        "request-hedging",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/retry-mechanisms"),
  },
  "backend/network-communication/reverse-proxy": {
    metadata: {
      id: "article-backend-reverse-proxy-extensive",
      title: "Reverse Proxy",
      description:
        "Comprehensive guide to reverse proxies, routing, and operational trade-offs.",
      category: "backend",
      subcategory: "network-communication",
      slug: "reverse-proxy",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "proxy"],
      relatedTopics: ["api-gateway-pattern", "load-balancers", "forward-proxy"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/reverse-proxy"),
  },
  "backend/network-communication/rpc": {
    metadata: {
      id: "article-backend-rpc-extensive",
      title: "RPC",
      description:
        "Deep guide to rpc architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "rpc",
      wordCount: 1336,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["backend", "network", "rpc"],
      relatedTopics: ["grpc", "timeout-strategies", "circuit-breaker-pattern"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/rpc"),
  },
  "backend/network-communication/server-sent-events": {
    metadata: {
      id: "article-backend-server-sent-events-extensive",
      title: "Server-Sent Events (SSE)",
      description:
        "Comprehensive guide to SSE streaming, reliability, and operational practice.",
      category: "backend",
      subcategory: "network-communication",
      slug: "server-sent-events",
      wordCount: 6900,
      readingTime: 34,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "sse"],
      relatedTopics: ["websockets", "long-polling", "event-streaming"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/server-sent-events"),
  },
  "backend/network-communication/service-discovery": {
    metadata: {
      id: "article-backend-service-discovery-extensive",
      title: "Service Discovery",
      description:
        "Comprehensive guide to service discovery models, health checks, and governance.",
      category: "backend",
      subcategory: "network-communication",
      slug: "service-discovery",
      wordCount: 6900,
      readingTime: 34,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "service-discovery"],
      relatedTopics: ["load-balancers", "service-mesh", "api-gateway-pattern"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/service-discovery"),
  },
  "backend/network-communication/service-mesh": {
    metadata: {
      id: "article-backend-service-mesh-extensive",
      title: "Service Mesh",
      description:
        "Comprehensive guide to service mesh architecture, policy, and operations.",
      category: "backend",
      subcategory: "network-communication",
      slug: "service-mesh",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "service-mesh"],
      relatedTopics: [
        "service-discovery",
        "circuit-breaker-pattern",
        "api-gateway-pattern",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/service-mesh"),
  },
  "backend/network-communication/throttling-rate-limiting": {
    metadata: {
      id: "article-backend-throttling-rate-limiting-extensive",
      title: "Throttling & Rate Limiting",
      description:
        "Comprehensive guide to rate limiting design, enforcement, and operations.",
      category: "backend",
      subcategory: "network-communication",
      slug: "throttling-rate-limiting",
      wordCount: 7100,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "rate-limiting"],
      relatedTopics: [
        "api-gateway-pattern",
        "timeout-strategies",
        "load-balancers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/throttling-rate-limiting"),
  },
  "backend/network-communication/timeout-strategies": {
    metadata: {
      id: "article-backend-timeout-strategies-extensive",
      title: "Timeout Strategies",
      description:
        "Comprehensive guide to timeout budgets, cascading failure prevention, and tuning.",
      category: "backend",
      subcategory: "network-communication",
      slug: "timeout-strategies",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "resilience"],
      relatedTopics: [
        "retry-mechanisms",
        "circuit-breaker-pattern",
        "request-hedging",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/timeout-strategies"),
  },
  "backend/network-communication/websockets": {
    metadata: {
      id: "article-backend-websockets-extensive",
      title: "WebSockets",
      description:
        "Comprehensive guide to WebSockets, scaling, and operational reliability.",
      category: "backend",
      subcategory: "network-communication",
      slug: "websockets",
      wordCount: 7000,
      readingTime: 35,
      lastUpdated: "2026-03-11",
      tags: ["backend", "network", "websockets"],
      relatedTopics: ["server-sent-events", "long-polling", "event-streaming"],
    },
    loader: () =>
      import("./articles/system-design/backend/network-communication/websockets"),
  },
  "backend/reliability-fault-tolerance/at-most-once-vs-at-least-once-vs-exactly-once":
    {
      metadata: {
        id: "article-backend-at-most-once-vs-at-least-once-vs-exactly-once-extensive",
        title: "At-Most-Once vs At-Least-Once vs Exactly-Once",
        description:
          "In-depth guide to at-most-once vs at-least-once vs exactly-once architecture, trade-offs, and operational practice.",
        category: "backend",
        subcategory: "reliability-fault-tolerance",
        slug: "at-most-once-vs-at-least-once-vs-exactly-once",
        wordCount: 2800,
        readingTime: 14,
        lastUpdated: "2026-03-11",
        tags: ["backend", "reliability", "delivery"],
        relatedTopics: [
          "idempotency",
          "dead-letter-queues",
          "error-handling-patterns",
        ],
      },
      loader: () =>
        import("./articles/system-design/backend/reliability-fault-tolerance/at-most-once-vs-at-least-once-vs-exactly-once"),
    },
  "backend/reliability-fault-tolerance/automatic-recovery": {
    metadata: {
      id: "article-backend-automatic-recovery-extensive",
      title: "Automatic Recovery",
      description:
        "In-depth guide to automatic recovery architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "automatic-recovery",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "recovery"],
      relatedTopics: [
        "health-checks",
        "fault-detection",
        "failover-mechanisms",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/automatic-recovery"),
  },
  "backend/reliability-fault-tolerance/backup-restore": {
    metadata: {
      id: "article-backend-backup-restore-extensive",
      title: "Backup & Restore",
      description:
        "In-depth guide to backup & restore architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "backup-restore",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "backup"],
      relatedTopics: [
        "disaster-recovery",
        "data-integrity",
        "rollback-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/backup-restore"),
  },
  "backend/reliability-fault-tolerance/chaos-engineering": {
    metadata: {
      id: "article-backend-chaos-engineering-extensive",
      title: "Chaos Engineering",
      description:
        "In-depth guide to chaos engineering architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "chaos-engineering",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "chaos"],
      relatedTopics: [
        "fault-detection",
        "automatic-recovery",
        "graceful-degradation",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/chaos-engineering"),
  },
  "backend/reliability-fault-tolerance/data-integrity": {
    metadata: {
      id: "article-backend-data-integrity-extensive",
      title: "Data Integrity",
      description:
        "In-depth guide to data integrity architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "data-integrity",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "data-integrity"],
      relatedTopics: [
        "backup-restore",
        "error-handling-patterns",
        "rollback-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/data-integrity"),
  },
  "backend/reliability-fault-tolerance/dead-letter-queues": {
    metadata: {
      id: "article-backend-dead-letter-queues-extensive",
      title: "Dead Letter Queues",
      description:
        "In-depth guide to dead letter queues architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "dead-letter-queues",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "queues"],
      relatedTopics: [
        "error-handling-patterns",
        "at-most-once-vs-at-least-once-vs-exactly-once",
        "idempotency",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/dead-letter-queues"),
  },
  "backend/reliability-fault-tolerance/disaster-recovery": {
    metadata: {
      id: "article-backend-disaster-recovery-extensive",
      title: "Disaster Recovery",
      description:
        "In-depth guide to disaster recovery architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "disaster-recovery",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "disaster-recovery"],
      relatedTopics: [
        "backup-restore",
        "multi-region-deployment",
        "rollback-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/disaster-recovery"),
  },
  "backend/reliability-fault-tolerance/error-handling-patterns": {
    metadata: {
      id: "article-backend-error-handling-patterns-extensive",
      title: "Error Handling Patterns",
      description:
        "In-depth guide to error handling patterns architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "error-handling-patterns",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "errors"],
      relatedTopics: [
        "graceful-degradation",
        "idempotency",
        "dead-letter-queues",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/error-handling-patterns"),
  },
  "backend/reliability-fault-tolerance/failover-mechanisms": {
    metadata: {
      id: "article-backend-failover-mechanisms-extensive",
      title: "Failover Mechanisms",
      description:
        "In-depth guide to failover mechanisms architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "failover-mechanisms",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "failover"],
      relatedTopics: [
        "high-availability",
        "health-checks",
        "multi-region-deployment",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/failover-mechanisms"),
  },
  "backend/reliability-fault-tolerance/fault-detection": {
    metadata: {
      id: "article-backend-fault-detection-extensive",
      title: "Fault Detection",
      description:
        "In-depth guide to fault detection architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "fault-detection",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "monitoring"],
      relatedTopics: [
        "health-checks",
        "automatic-recovery",
        "error-handling-patterns",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/fault-detection"),
  },
  "backend/reliability-fault-tolerance/graceful-degradation": {
    metadata: {
      id: "article-backend-graceful-degradation-extensive",
      title: "Graceful Degradation",
      description:
        "In-depth guide to graceful degradation architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "graceful-degradation",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "degradation"],
      relatedTopics: [
        "error-handling-patterns",
        "high-availability",
        "fault-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/graceful-degradation"),
  },
  "backend/reliability-fault-tolerance/health-checks": {
    metadata: {
      id: "article-backend-health-checks-extensive",
      title: "Health Checks",
      description:
        "In-depth guide to health checks architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "health-checks",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "health-checks"],
      relatedTopics: [
        "failover-mechanisms",
        "fault-detection",
        "automatic-recovery",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/health-checks"),
  },
  "backend/reliability-fault-tolerance/high-availability": {
    metadata: {
      id: "article-backend-high-availability-extensive",
      title: "High Availability",
      description:
        "In-depth guide to high availability architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "high-availability",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "availability"],
      relatedTopics: [
        "failover-mechanisms",
        "redundancy",
        "multi-region-deployment",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/high-availability"),
  },
  "backend/reliability-fault-tolerance/idempotency": {
    metadata: {
      id: "article-backend-idempotency-extensive",
      title: "Idempotency",
      description:
        "In-depth guide to idempotency architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "idempotency",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "idempotency"],
      relatedTopics: [
        "error-handling-patterns",
        "at-most-once-vs-at-least-once-vs-exactly-once",
        "dead-letter-queues",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/idempotency"),
  },
  "backend/reliability-fault-tolerance/multi-region-deployment": {
    metadata: {
      id: "article-backend-multi-region-deployment-extensive",
      title: "Multi-Region Deployment",
      description:
        "In-depth guide to multi-region deployment architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "multi-region-deployment",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "multi-region"],
      relatedTopics: ["redundancy", "disaster-recovery", "high-availability"],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/multi-region-deployment"),
  },
  "backend/reliability-fault-tolerance/redundancy": {
    metadata: {
      id: "article-backend-redundancy-extensive",
      title: "Redundancy",
      description:
        "In-depth guide to redundancy architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "redundancy",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "redundancy"],
      relatedTopics: [
        "high-availability",
        "multi-region-deployment",
        "backup-restore",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/redundancy"),
  },
  "backend/reliability-fault-tolerance/rollback-strategies": {
    metadata: {
      id: "article-backend-rollback-strategies-extensive",
      title: "Rollback Strategies",
      description:
        "In-depth guide to rollback strategies architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "reliability-fault-tolerance",
      slug: "rollback-strategies",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "reliability", "rollback"],
      relatedTopics: [
        "disaster-recovery",
        "graceful-degradation",
        "high-availability",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/reliability-fault-tolerance/rollback-strategies"),
  },
  "backend/scalability-distributed-systems/asynchronous-processing": {
    metadata: {
      id: "article-backend-asynchronous-processing-extensive",
      title: "Asynchronous Processing",
      description:
        "Comprehensive guide to asynchronous processing design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "asynchronous-processing",
      wordCount: 2825,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/asynchronous-processing"),
  },
  "backend/scalability-distributed-systems/consensus-algorithms": {
    metadata: {
      id: "article-backend-consensus-algorithms-extensive",
      title: "Consensus Algorithms",
      description:
        "Comprehensive guide to consensus algorithms design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "consensus-algorithms",
      wordCount: 2881,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/consensus-algorithms"),
  },
  "backend/scalability-distributed-systems/consistent-hashing": {
    metadata: {
      id: "article-backend-consistent-hashing-extensive",
      title: "Consistent Hashing",
      description:
        "Comprehensive guide to consistent hashing design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "consistent-hashing",
      wordCount: 2984,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/consistent-hashing"),
  },
  "backend/scalability-distributed-systems/cqrs": {
    metadata: {
      id: "article-backend-cqrs-extensive",
      title: "CQRS",
      description:
        "Comprehensive guide to cqrs design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "cqrs",
      wordCount: 2823,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/cqrs"),
  },
  "backend/scalability-distributed-systems/data-denormalization": {
    metadata: {
      id: "article-backend-data-denormalization-extensive",
      title: "Data Denormalization",
      description:
        "Comprehensive guide to data denormalization design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "data-denormalization",
      wordCount: 2839,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/data-denormalization"),
  },
  "backend/scalability-distributed-systems/data-replication": {
    metadata: {
      id: "article-backend-data-replication-extensive",
      title: "Data Replication",
      description:
        "Comprehensive guide to data replication design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "data-replication",
      wordCount: 2832,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/data-replication"),
  },
  "backend/scalability-distributed-systems/database-read-replicas": {
    metadata: {
      id: "article-backend-database-read-replicas-extensive",
      title: "Database Read Replicas",
      description:
        "Comprehensive guide to database read replicas design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "database-read-replicas",
      wordCount: 2860,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/database-read-replicas"),
  },
  "backend/scalability-distributed-systems/database-sharding": {
    metadata: {
      id: "article-backend-database-sharding-extensive",
      title: "Database Sharding",
      description:
        "Comprehensive guide to database sharding design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "database-sharding",
      wordCount: 2927,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/database-sharding"),
  },
  "backend/scalability-distributed-systems/distributed-coordination": {
    metadata: {
      id: "article-backend-distributed-coordination-extensive",
      title: "Distributed Coordination",
      description:
        "Comprehensive guide to distributed coordination design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "distributed-coordination",
      wordCount: 2854,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/distributed-coordination"),
  },
  "backend/scalability-distributed-systems/distributed-locks": {
    metadata: {
      id: "article-backend-distributed-locks-extensive",
      title: "Distributed Locks",
      description:
        "Comprehensive guide to distributed locks design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "distributed-locks",
      wordCount: 2882,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/distributed-locks"),
  },
  "backend/scalability-distributed-systems/distributed-transactions": {
    metadata: {
      id: "article-backend-distributed-transactions-extensive",
      title: "Distributed Transactions",
      description:
        "Comprehensive guide to distributed transactions design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "distributed-transactions",
      wordCount: 2856,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/distributed-transactions"),
  },
  "backend/scalability-distributed-systems/event-sourcing": {
    metadata: {
      id: "article-backend-event-sourcing-extensive",
      title: "Event Sourcing",
      description:
        "Comprehensive guide to event sourcing design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "event-sourcing",
      wordCount: 2867,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/event-sourcing"),
  },
  "backend/scalability-distributed-systems/gossip-protocol": {
    metadata: {
      id: "article-backend-gossip-protocol-extensive",
      title: "Gossip Protocol",
      description:
        "Comprehensive guide to gossip protocol design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "gossip-protocol",
      wordCount: 2825,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/gossip-protocol"),
  },
  "backend/scalability-distributed-systems/horizontal-scaling": {
    metadata: {
      id: "article-backend-horizontal-scaling-extensive",
      title: "Horizontal Scaling",
      description:
        "Comprehensive guide to horizontal scaling design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "horizontal-scaling",
      wordCount: 2809,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/horizontal-scaling"),
  },
  "backend/scalability-distributed-systems/microservices-architecture": {
    metadata: {
      id: "article-backend-microservices-architecture-extensive",
      title: "Microservices Architecture",
      description:
        "Comprehensive guide to microservices architecture design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "microservices-architecture",
      wordCount: 2821,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/microservices-architecture"),
  },
  "backend/scalability-distributed-systems/partitioning-strategies": {
    metadata: {
      id: "article-backend-partitioning-strategies-extensive",
      title: "Partitioning Strategies",
      description:
        "Comprehensive guide to partitioning strategies design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "partitioning-strategies",
      wordCount: 2927,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/partitioning-strategies"),
  },
  "backend/scalability-distributed-systems/quorum": {
    metadata: {
      id: "article-backend-quorum-extensive",
      title: "Quorum",
      description:
        "Comprehensive guide to quorum design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "quorum",
      wordCount: 2875,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/quorum"),
  },
  "backend/scalability-distributed-systems/replication-strategies": {
    metadata: {
      id: "article-backend-replication-strategies-extensive",
      title: "Replication Strategies",
      description:
        "Comprehensive guide to replication strategies design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "replication-strategies",
      wordCount: 2871,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/replication-strategies"),
  },
  "backend/scalability-distributed-systems/service-decomposition": {
    metadata: {
      id: "article-backend-service-decomposition-extensive",
      title: "Service Decomposition",
      description:
        "Comprehensive guide to service decomposition design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "service-decomposition",
      wordCount: 2829,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/service-decomposition"),
  },
  "backend/scalability-distributed-systems/split-brain-problem": {
    metadata: {
      id: "article-backend-split-brain-problem-extensive",
      title: "Split-Brain Problem",
      description:
        "Comprehensive guide to split-brain problem design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "split-brain-problem",
      wordCount: 2848,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/split-brain-problem"),
  },
  "backend/scalability-distributed-systems/vector-clocks": {
    metadata: {
      id: "article-backend-vector-clocks-extensive",
      title: "Vector Clocks",
      description:
        "Comprehensive guide to vector clocks design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "vector-clocks",
      wordCount: 2870,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/vector-clocks"),
  },
  "backend/scalability-distributed-systems/write-scaling": {
    metadata: {
      id: "article-backend-write-scaling-extensive",
      title: "Write Scaling",
      description:
        "Comprehensive guide to write scaling design, trade-offs, and operations.",
      category: "backend",
      subcategory: "scalability-distributed-systems",
      slug: "write-scaling",
      wordCount: 2819,
      readingTime: 15,
      lastUpdated: "2026-03-10",
      tags: ["backend", "scalability", "distributed"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/scalability-distributed-systems/write-scaling"),
  },
  "backend/security-authentication/abac-attribute-based-access-control": {
    metadata: {
      id: "article-backend-abac-attribute-based-access-control-extensive",
      title: "ABAC (Attribute-Based Access Control)",
      description:
        "In-depth guide to abac (attribute-based access control) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "abac-attribute-based-access-control",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "abac"],
      relatedTopics: [
        "rbac-role-based-access-control",
        "api-security",
        "authentication-vs-authorization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/abac-attribute-based-access-control"),
  },
  "backend/security-authentication/api-keys-secrets-management": {
    metadata: {
      id: "article-backend-api-keys-secrets-management-extensive",
      title: "API Keys & Secrets Management",
      description:
        "In-depth guide to api keys & secrets management architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "api-keys-secrets-management",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "secrets"],
      relatedTopics: ["secrets-rotation", "api-security", "encryption"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/api-keys-secrets-management"),
  },
  "backend/security-authentication/api-security": {
    metadata: {
      id: "article-backend-api-security-extensive",
      title: "API Security",
      description:
        "In-depth guide to api security architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "api-security",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "api"],
      relatedTopics: [
        "oauth-2-0",
        "api-keys-secrets-management",
        "security-headers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/api-security"),
  },
  "backend/security-authentication/authentication-vs-authorization": {
    metadata: {
      id: "article-backend-authentication-vs-authorization-extensive",
      title: "Authentication vs Authorization",
      description:
        "In-depth guide to authentication vs authorization architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "authentication-vs-authorization",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "auth"],
      relatedTopics: [
        "rbac-role-based-access-control",
        "abac-attribute-based-access-control",
        "session-management",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/authentication-vs-authorization"),
  },
  "backend/security-authentication/cors-cross-origin-resource-sharing": {
    metadata: {
      id: "article-backend-cors-cross-origin-resource-sharing-extensive",
      title: "CORS (Cross-Origin Resource Sharing)",
      description:
        "In-depth guide to cors (cross-origin resource sharing) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "cors-cross-origin-resource-sharing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "cors"],
      relatedTopics: ["csrf-protection", "api-security", "security-headers"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/cors-cross-origin-resource-sharing"),
  },
  "backend/security-authentication/csrf-protection": {
    metadata: {
      id: "article-backend-csrf-protection-extensive",
      title: "CSRF Protection",
      description:
        "In-depth guide to csrf protection architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "csrf-protection",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "csrf"],
      relatedTopics: [
        "session-management",
        "security-headers",
        "authentication-vs-authorization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/csrf-protection"),
  },
  "backend/security-authentication/encryption": {
    metadata: {
      id: "article-backend-encryption-extensive",
      title: "Encryption",
      description:
        "In-depth guide to encryption architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "encryption",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "encryption"],
      relatedTopics: ["tls-ssl", "hashing-salting", "https"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/encryption"),
  },
  "backend/security-authentication/hashing-salting": {
    metadata: {
      id: "article-backend-hashing-salting-extensive",
      title: "Hashing & Salting",
      description:
        "In-depth guide to hashing & salting architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "hashing-salting",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "hashing"],
      relatedTopics: [
        "encryption",
        "session-management",
        "authentication-vs-authorization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/hashing-salting"),
  },
  "backend/security-authentication/https": {
    metadata: {
      id: "article-backend-https-extensive",
      title: "HTTPS",
      description:
        "In-depth guide to https architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "https",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "https"],
      relatedTopics: ["tls-ssl", "security-headers", "encryption"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/https"),
  },
  "backend/security-authentication/input-validation-sanitization": {
    metadata: {
      id: "article-backend-input-validation-sanitization-extensive",
      title: "Input Validation & Sanitization",
      description:
        "In-depth guide to input validation & sanitization architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "input-validation-sanitization",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "validation"],
      relatedTopics: [
        "xss-prevention",
        "sql-injection-prevention",
        "api-security",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/input-validation-sanitization"),
  },
  "backend/security-authentication/jwt-json-web-tokens": {
    metadata: {
      id: "article-backend-jwt-json-web-tokens-extensive",
      title: "JWT (JSON Web Tokens)",
      description:
        "In-depth guide to jwt (json web tokens) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "jwt-json-web-tokens",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "jwt"],
      relatedTopics: ["oauth-2-0", "session-management", "security-headers"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/jwt-json-web-tokens"),
  },
  "backend/security-authentication/multi-factor-authentication": {
    metadata: {
      id: "article-backend-multi-factor-authentication-extensive",
      title: "Multi-Factor Authentication",
      description:
        "In-depth guide to multi-factor authentication architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "multi-factor-authentication",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "mfa"],
      relatedTopics: [
        "single-sign-on-sso",
        "authentication-vs-authorization",
        "security-headers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/multi-factor-authentication"),
  },
  "backend/security-authentication/oauth-2-0": {
    metadata: {
      id: "article-backend-oauth-2-0-extensive",
      title: "OAuth 2.0",
      description:
        "In-depth guide to oauth 2.0 architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "oauth-2-0",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "oauth"],
      relatedTopics: [
        "jwt-json-web-tokens",
        "single-sign-on-sso",
        "api-security",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/oauth-2-0"),
  },
  "backend/security-authentication/rate-limiting": {
    metadata: {
      id: "article-backend-rate-limiting-extensive",
      title: "Rate Limiting",
      description:
        "In-depth guide to rate limiting architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "rate-limiting",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "rate-limit"],
      relatedTopics: [
        "api-security",
        "throttling-rate-limiting",
        "web-application-firewall",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/rate-limiting"),
  },
  "backend/security-authentication/rbac-role-based-access-control": {
    metadata: {
      id: "article-backend-rbac-role-based-access-control-extensive",
      title: "RBAC (Role-Based Access Control)",
      description:
        "In-depth guide to rbac (role-based access control) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "rbac-role-based-access-control",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "rbac"],
      relatedTopics: [
        "abac-attribute-based-access-control",
        "authentication-vs-authorization",
        "api-security",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/rbac-role-based-access-control"),
  },
  "backend/security-authentication/secrets-rotation": {
    metadata: {
      id: "article-backend-secrets-rotation-extensive",
      title: "Secrets Rotation",
      description:
        "In-depth guide to secrets rotation architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "secrets-rotation",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "secrets"],
      relatedTopics: [
        "api-keys-secrets-management",
        "encryption",
        "authentication-vs-authorization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/secrets-rotation"),
  },
  "backend/security-authentication/security-headers": {
    metadata: {
      id: "article-backend-security-headers-extensive",
      title: "Security Headers",
      description:
        "In-depth guide to security headers architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "security-headers",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "headers"],
      relatedTopics: ["https", "xss-prevention", "csrf-protection"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/security-headers"),
  },
  "backend/security-authentication/session-management": {
    metadata: {
      id: "article-backend-session-management-extensive",
      title: "Session Management",
      description:
        "In-depth guide to session management architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "session-management",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "session"],
      relatedTopics: [
        "jwt-json-web-tokens",
        "csrf-protection",
        "authentication-vs-authorization",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/session-management"),
  },
  "backend/security-authentication/single-sign-on-sso": {
    metadata: {
      id: "article-backend-single-sign-on-sso-extensive",
      title: "Single Sign-On (SSO)",
      description:
        "In-depth guide to single sign-on (sso) architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "single-sign-on-sso",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "sso"],
      relatedTopics: [
        "oauth-2-0",
        "session-management",
        "multi-factor-authentication",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/single-sign-on-sso"),
  },
  "backend/security-authentication/sql-injection-prevention": {
    metadata: {
      id: "article-backend-sql-injection-prevention-extensive",
      title: "SQL Injection Prevention",
      description:
        "In-depth guide to sql injection prevention architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "sql-injection-prevention",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "sql"],
      relatedTopics: [
        "input-validation-sanitization",
        "orms",
        "security-headers",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/sql-injection-prevention"),
  },
  "backend/security-authentication/tls-ssl": {
    metadata: {
      id: "article-backend-tls-ssl-extensive",
      title: "TLS/SSL",
      description:
        "In-depth guide to tls/ssl architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "tls-ssl",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "tls"],
      relatedTopics: ["https", "encryption", "security-headers"],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/tls-ssl"),
  },
  "backend/security-authentication/vulnerability-scanning": {
    metadata: {
      id: "article-backend-vulnerability-scanning-extensive",
      title: "Vulnerability Scanning",
      description:
        "In-depth guide to vulnerability scanning architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "vulnerability-scanning",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "scanning"],
      relatedTopics: [
        "security-headers",
        "api-security",
        "web-application-firewall",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/vulnerability-scanning"),
  },
  "backend/security-authentication/web-application-firewall": {
    metadata: {
      id: "article-backend-web-application-firewall-extensive",
      title: "Web Application Firewall",
      description:
        "In-depth guide to web application firewall architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "web-application-firewall",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "waf"],
      relatedTopics: [
        "rate-limiting",
        "sql-injection-prevention",
        "xss-prevention",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/web-application-firewall"),
  },
  "backend/security-authentication/xss-prevention": {
    metadata: {
      id: "article-backend-xss-prevention-extensive",
      title: "XSS Prevention",
      description:
        "In-depth guide to xss prevention architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "security-authentication",
      slug: "xss-prevention",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "security", "xss"],
      relatedTopics: [
        "security-headers",
        "input-validation-sanitization",
        "csrf-protection",
      ],
    },
    loader: () =>
      import("./articles/system-design/backend/security-authentication/xss-prevention"),
  },
  "backend/system-components-services/a-b-testing-service": {
    metadata: {
      id: "article-backend-a-b-testing-service-extensive",
      title: "A/B Testing Service",
      description:
        "In-depth guide to a/b testing service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "a-b-testing-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/a-b-testing-service"),
  },
  "backend/system-components-services/analytics-service": {
    metadata: {
      id: "article-backend-analytics-service-extensive",
      title: "Analytics Service",
      description:
        "In-depth guide to analytics service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "analytics-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/analytics-service"),
  },
  "backend/system-components-services/audit-logging-service": {
    metadata: {
      id: "article-backend-audit-logging-service-extensive",
      title: "Audit Logging Service",
      description:
        "In-depth guide to audit logging service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "audit-logging-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "compliance"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/audit-logging-service"),
  },
  "backend/system-components-services/authentication-service": {
    metadata: {
      id: "article-backend-authentication-service-extensive",
      title: "Authentication Service",
      description:
        "In-depth guide to authentication service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "authentication-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/authentication-service"),
  },
  "backend/system-components-services/authorization-service": {
    metadata: {
      id: "article-backend-authorization-service-extensive",
      title: "Authorization Service",
      description:
        "In-depth guide to authorization service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "authorization-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/authorization-service"),
  },
  "backend/system-components-services/content-moderation-service": {
    metadata: {
      id: "article-backend-content-moderation-service-extensive",
      title: "Content Moderation Service",
      description:
        "In-depth guide to content moderation service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "content-moderation-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/content-moderation-service"),
  },
  "backend/system-components-services/email-service": {
    metadata: {
      id: "article-backend-email-service-extensive",
      title: "Email Service",
      description:
        "In-depth guide to email service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "email-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/email-service"),
  },
  "backend/system-components-services/feature-flag-service": {
    metadata: {
      id: "article-backend-feature-flag-service-extensive",
      title: "Feature Flag Service",
      description:
        "In-depth guide to feature flag service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "feature-flag-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/feature-flag-service"),
  },
  "backend/system-components-services/file-storage-service": {
    metadata: {
      id: "article-backend-file-storage-service-extensive",
      title: "File Storage Service",
      description:
        "In-depth guide to file storage service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "file-storage-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/file-storage-service"),
  },
  "backend/system-components-services/geolocation-service": {
    metadata: {
      id: "article-backend-geolocation-service-extensive",
      title: "Geolocation Service",
      description:
        "In-depth guide to geolocation service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "geolocation-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/geolocation-service"),
  },
  "backend/system-components-services/job-scheduler": {
    metadata: {
      id: "article-backend-job-scheduler-extensive",
      title: "Job Scheduler",
      description:
        "In-depth guide to job scheduler architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "job-scheduler",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/job-scheduler"),
  },
  "backend/system-components-services/media-processing-service": {
    metadata: {
      id: "article-backend-media-processing-service-extensive",
      title: "Media Processing Service",
      description:
        "In-depth guide to media processing service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "media-processing-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/media-processing-service"),
  },
  "backend/system-components-services/notification-service": {
    metadata: {
      id: "article-backend-notification-service-extensive",
      title: "Notification Service",
      description:
        "In-depth guide to notification service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "notification-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/notification-service"),
  },
  "backend/system-components-services/payment-processing": {
    metadata: {
      id: "article-backend-payment-processing-extensive",
      title: "Payment Processing",
      description:
        "In-depth guide to payment processing architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "payment-processing",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "compliance"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/payment-processing"),
  },
  "backend/system-components-services/rate-limiting-service": {
    metadata: {
      id: "article-backend-rate-limiting-service-extensive",
      title: "Rate Limiting Service",
      description:
        "In-depth guide to rate limiting service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "rate-limiting-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/rate-limiting-service"),
  },
  "backend/system-components-services/recommendation-engine": {
    metadata: {
      id: "article-backend-recommendation-engine-extensive",
      title: "Recommendation Engine",
      description:
        "In-depth guide to recommendation engine architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "recommendation-engine",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/recommendation-engine"),
  },
  "backend/system-components-services/search-service": {
    metadata: {
      id: "article-backend-search-service-extensive",
      title: "Search Service",
      description:
        "In-depth guide to search service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "search-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/search-service"),
  },
  "backend/system-components-services/session-management-service": {
    metadata: {
      id: "article-backend-session-management-service-extensive",
      title: "Session Management Service",
      description:
        "In-depth guide to session management service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "session-management-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/session-management-service"),
  },
  "backend/system-components-services/sms-service": {
    metadata: {
      id: "article-backend-sms-service-extensive",
      title: "SMS Service",
      description:
        "In-depth guide to sms service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "sms-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/sms-service"),
  },
  "backend/system-components-services/user-service": {
    metadata: {
      id: "article-backend-user-service-extensive",
      title: "User Service",
      description:
        "In-depth guide to user service architecture, trade-offs, and operational practice.",
      category: "backend",
      subcategory: "system-components-services",
      slug: "user-service",
      wordCount: 2800,
      readingTime: 14,
      lastUpdated: "2026-03-11",
      tags: ["backend", "services", "component"],
      relatedTopics: [],
    },
    loader: () =>
      import("./articles/system-design/backend/system-components-services/user-service"),
  },
  "frontend/caching-strategies/browser-caching": {
    metadata: {
      id: "article-frontend-browser-caching-concise",
      title: "Browser Caching",
      description:
        "Comprehensive guide to browser caching covering HTTP cache headers (Cache-Control, ETag, Last-Modified, Expires), browser cache storage, and best practices.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "browser-caching",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "HTTP",
        "Cache-Control",
        "ETag",
        "performance",
      ],
      relatedTopics: [
        "service-worker-caching",
        "cdn-caching",
        "stale-while-revalidate",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/browser-caching"),
  },
  "frontend/caching-strategies/service-worker-caching": {
    metadata: {
      id: "article-frontend-service-worker-caching-concise",
      title: "Service Worker Caching",
      description:
        "Deep dive into Service Worker caching including SW lifecycle, Cache API, offline-first patterns, and strategies for building resilient web applications.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "service-worker-caching",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "service-worker",
        "offline-first",
        "Cache API",
        "PWA",
      ],
      relatedTopics: [
        "browser-caching",
        "caching-patterns",
        "application-cache",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/service-worker-caching"),
  },
  "frontend/caching-strategies/memory-caching": {
    metadata: {
      id: "article-frontend-memory-caching-concise",
      title: "Memory Caching",
      description:
        "In-depth guide to in-memory caching for frontend applications including React Query, SWR, custom cache stores, and client-side data management patterns.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "memory-caching",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "React Query",
        "SWR",
        "state management",
        "in-memory",
      ],
      relatedTopics: [
        "stale-while-revalidate",
        "browser-caching",
        "cache-invalidation-strategies",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/memory-caching"),
  },
  "frontend/caching-strategies/cdn-caching": {
    metadata: {
      id: "article-frontend-cdn-caching-concise",
      title: "CDN Caching",
      description:
        "Comprehensive guide to CDN caching covering edge caching, cache invalidation, cache keys, Vary header, and strategies for global content delivery.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "cdn-caching",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "CDN",
        "edge",
        "Vary header",
        "cache invalidation",
      ],
      relatedTopics: [
        "browser-caching",
        "cache-invalidation-strategies",
        "stale-while-revalidate",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/cdn-caching"),
  },
  "frontend/caching-strategies/cache-invalidation-strategies": {
    metadata: {
      id: "article-frontend-cache-invalidation-strategies-concise",
      title: "Cache Invalidation Strategies",
      description:
        "Deep dive into cache invalidation strategies including TTL-based, event-driven, versioned URLs, tag-based invalidation, and maintaining cache consistency.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "cache-invalidation-strategies",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "cache invalidation",
        "TTL",
        "versioning",
        "consistency",
      ],
      relatedTopics: [
        "browser-caching",
        "cdn-caching",
        "stale-while-revalidate",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/cache-invalidation-strategies"),
  },
  "frontend/caching-strategies/stale-while-revalidate": {
    metadata: {
      id: "article-frontend-stale-while-revalidate-concise",
      title: "Stale-While-Revalidate",
      description:
        "Comprehensive guide to the Stale-While-Revalidate pattern covering HTTP header implementation, library patterns (SWR, React Query), and real-world usage.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "stale-while-revalidate",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "SWR",
        "stale-while-revalidate",
        "React Query",
        "performance",
      ],
      relatedTopics: ["browser-caching", "memory-caching", "caching-patterns"],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/stale-while-revalidate"),
  },
  "frontend/caching-strategies/caching-patterns": {
    metadata: {
      id: "article-frontend-caching-patterns-concise",
      title: "Cache-First, Network-First, Network-Only Strategies",
      description:
        "Deep dive into caching strategy patterns including Cache-First, Network-First, Network-Only, Cache-Only, and Stale-While-Revalidate with Workbox implementation.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "caching-patterns",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "Workbox",
        "service-worker",
        "cache-first",
        "network-first",
      ],
      relatedTopics: [
        "service-worker-caching",
        "stale-while-revalidate",
        "browser-caching",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/caching-patterns"),
  },
  "frontend/caching-strategies/indexeddb-caching": {
    metadata: {
      id: "article-frontend-indexeddb-caching-concise",
      title: "IndexedDB for Large Data Caching",
      description:
        "Comprehensive guide to IndexedDB for frontend caching covering structured storage, Dexie.js, offline data synchronization, and large dataset management.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "indexeddb-caching",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "IndexedDB",
        "Dexie.js",
        "offline",
        "structured data",
      ],
      relatedTopics: [
        "service-worker-caching",
        "application-cache",
        "memory-caching",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/indexeddb-caching"),
  },
  "frontend/caching-strategies/application-cache": {
    metadata: {
      id: "article-frontend-application-cache-concise",
      title: "Application Cache (AppCache)",
      description:
        "Guide to the deprecated Application Cache API covering its history, why it failed, manifest format, and migration path to Service Workers.",
      category: "frontend",
      subcategory: "caching-strategies",
      slug: "application-cache",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "caching",
        "AppCache",
        "deprecated",
        "service-worker",
        "migration",
      ],
      relatedTopics: [
        "service-worker-caching",
        "browser-caching",
        "caching-patterns",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/caching-strategies/application-cache"),
  },
  "frontend/state-management/local-component-state": {
    metadata: {
      id: "article-frontend-local-component-state-concise",
      title: "Local Component State",
      description:
        "Deep dive into local component state management covering useState, useReducer, component-level state patterns, lifting state, and when local state is sufficient.",
      category: "frontend",
      subcategory: "state-management",
      slug: "local-component-state",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "useState",
        "useReducer",
        "React",
        "component state",
      ],
      relatedTopics: [
        "global-state-management",
        "derived-state",
        "form-state-management",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/local-component-state"),
  },
  "frontend/state-management/global-state-management": {
    metadata: {
      id: "article-frontend-global-state-management-concise",
      title: "Global State Management (Redux, Zustand, Recoil)",
      description:
        "Comprehensive comparison of global state management solutions including Redux, Zustand, Recoil, MobX, and Jotai — architecture, trade-offs, and selection criteria.",
      category: "frontend",
      subcategory: "state-management",
      slug: "global-state-management",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "Redux",
        "Zustand",
        "Recoil",
        "MobX",
        "Jotai",
      ],
      relatedTopics: [
        "local-component-state",
        "server-state-management",
        "state-normalization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/global-state-management"),
  },
  "frontend/state-management/server-state-management": {
    metadata: {
      id: "article-frontend-server-state-management-concise",
      title: "Server State Management (React Query, SWR, Apollo Client)",
      description:
        "In-depth guide to server state management covering React Query, SWR, Apollo Client, cache invalidation, optimistic updates, and the distinction from client state.",
      category: "frontend",
      subcategory: "state-management",
      slug: "server-state-management",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "React Query",
        "SWR",
        "Apollo Client",
        "server state",
      ],
      relatedTopics: [
        "global-state-management",
        "memory-caching",
        "optimistic-updates",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/server-state-management"),
  },
  "frontend/state-management/url-state": {
    metadata: {
      id: "article-frontend-url-state-concise",
      title: "URL State & Query Parameters",
      description:
        "Comprehensive guide to URL-driven state management covering query parameters, History API, search params, deep linking, and shareable application state.",
      category: "frontend",
      subcategory: "state-management",
      slug: "url-state",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "URL",
        "query parameters",
        "History API",
        "deep linking",
      ],
      relatedTopics: [
        "local-component-state",
        "state-persistence",
        "state-synchronization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/url-state"),
  },
  "frontend/state-management/form-state-management": {
    metadata: {
      id: "article-frontend-form-state-management-concise",
      title: "Form State Management",
      description:
        "In-depth guide to form state management covering controlled vs uncontrolled forms, React Hook Form, Formik, validation strategies, and complex form patterns.",
      category: "frontend",
      subcategory: "state-management",
      slug: "form-state-management",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "forms",
        "React Hook Form",
        "validation",
        "controlled components",
      ],
      relatedTopics: [
        "local-component-state",
        "optimistic-updates",
        "state-persistence",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/form-state-management"),
  },
  "frontend/state-management/state-synchronization": {
    metadata: {
      id: "article-frontend-state-synchronization-concise",
      title: "State Synchronization Across Tabs",
      description:
        "Deep dive into cross-tab state synchronization covering BroadcastChannel, localStorage events, SharedWorker, and patterns for maintaining consistency across browser tabs.",
      category: "frontend",
      subcategory: "state-management",
      slug: "state-synchronization",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "BroadcastChannel",
        "SharedWorker",
        "cross-tab",
        "synchronization",
      ],
      relatedTopics: [
        "state-persistence",
        "global-state-management",
        "optimistic-updates",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/state-synchronization"),
  },
  "frontend/state-management/optimistic-updates": {
    metadata: {
      id: "article-frontend-optimistic-updates-concise",
      title: "Optimistic Updates",
      description:
        "Comprehensive guide to optimistic UI updates covering rollback strategies, conflict resolution, React Query mutations, and patterns for perceived performance.",
      category: "frontend",
      subcategory: "state-management",
      slug: "optimistic-updates",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "optimistic UI",
        "mutations",
        "rollback",
        "perceived performance",
      ],
      relatedTopics: [
        "server-state-management",
        "form-state-management",
        "state-synchronization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/optimistic-updates"),
  },
  "frontend/state-management/state-persistence": {
    metadata: {
      id: "article-frontend-state-persistence-concise",
      title: "State Persistence",
      description:
        "Deep dive into persisting frontend state across sessions covering localStorage, sessionStorage, IndexedDB, cookies, hydration, and migration strategies.",
      category: "frontend",
      subcategory: "state-management",
      slug: "state-persistence",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "persistence",
        "localStorage",
        "hydration",
        "offline",
      ],
      relatedTopics: [
        "state-synchronization",
        "local-component-state",
        "global-state-management",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/state-persistence"),
  },
  "frontend/state-management/derived-state": {
    metadata: {
      id: "article-frontend-derived-state-concise",
      title: "Derived State",
      description:
        "Comprehensive guide to derived state patterns including computed values, memoized selectors, useMemo, Reselect, and avoiding redundant state in frontend applications.",
      category: "frontend",
      subcategory: "state-management",
      slug: "derived-state",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "derived state",
        "selectors",
        "memoization",
        "computed values",
      ],
      relatedTopics: [
        "local-component-state",
        "global-state-management",
        "state-normalization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/derived-state"),
  },
  "frontend/state-management/state-normalization": {
    metadata: {
      id: "article-frontend-state-normalization-concise",
      title: "State Normalization",
      description:
        "Deep dive into state normalization patterns including entity-based stores, normalizr, createEntityAdapter, and flattening nested API responses for predictable state management.",
      category: "frontend",
      subcategory: "state-management",
      slug: "state-normalization",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "normalization",
        "entities",
        "Redux",
        "data modeling",
      ],
      relatedTopics: [
        "global-state-management",
        "derived-state",
        "immutable-state-updates",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/state-normalization"),
  },
  "frontend/state-management/immutable-state-updates": {
    metadata: {
      id: "article-frontend-immutable-state-updates-concise",
      title: "Immutable State Updates",
      description:
        "Comprehensive guide to immutable state updates covering structural sharing, Immer, spread patterns, frozen objects, and why immutability enables predictable React rendering.",
      category: "frontend",
      subcategory: "state-management",
      slug: "immutable-state-updates",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-13",
      tags: [
        "frontend",
        "state management",
        "immutability",
        "Immer",
        "structural sharing",
        "React",
      ],
      relatedTopics: [
        "local-component-state",
        "global-state-management",
        "state-normalization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/state-management/immutable-state-updates"),
  },
  "frontend/data-storage/localstorage": {
    metadata: {
      id: "article-frontend-localstorage-concise",
      title: "LocalStorage",
      description:
        "Comprehensive guide to the Web Storage API's localStorage covering persistence, capacity limits, synchronous nature, security implications, and cross-tab behavior.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "localstorage",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "localStorage",
        "Web Storage API",
        "persistence",
        "client-side",
      ],
      relatedTopics: [
        "sessionstorage",
        "indexeddb",
        "cookies",
        "storage-quotas-and-eviction",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/localstorage"),
  },
  "frontend/data-storage/sessionstorage": {
    metadata: {
      id: "article-frontend-sessionstorage-concise",
      title: "SessionStorage",
      description:
        "Deep dive into sessionStorage covering tab-scoped persistence, session lifetime, security properties, and differences from localStorage.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "sessionstorage",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "sessionStorage",
        "Web Storage API",
        "tab-scoped",
        "client-side",
      ],
      relatedTopics: ["localstorage", "cookies", "storage-quotas-and-eviction"],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/sessionstorage"),
  },
  "frontend/data-storage/cookies": {
    metadata: {
      id: "article-frontend-cookies-concise",
      title: "Cookies",
      description:
        "Deep dive into HTTP cookies covering Set-Cookie attributes, security flags, SameSite policy, third-party cookies, GDPR, and modern cookie management.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "cookies",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "cookies",
        "HTTP",
        "SameSite",
        "security",
        "GDPR",
      ],
      relatedTopics: [
        "localstorage",
        "sessionstorage",
        "storage-quotas-and-eviction",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/cookies"),
  },
  "frontend/data-storage/indexeddb": {
    metadata: {
      id: "article-frontend-indexeddb-concise",
      title: "IndexedDB",
      description:
        "Comprehensive guide to IndexedDB covering transactional object store, indexes, cursors, versioning, Dexie.js, and patterns for structured client-side storage.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "indexeddb",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "IndexedDB",
        "database",
        "Dexie.js",
        "offline",
      ],
      relatedTopics: [
        "localstorage",
        "cache-api",
        "storage-quotas-and-eviction",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/indexeddb"),
  },
  "frontend/data-storage/cache-api": {
    metadata: {
      id: "article-frontend-cache-api-concise",
      title: "Cache API",
      description:
        "Comprehensive guide to the Cache API covering programmatic HTTP cache management, Request/Response storage, Service Worker integration, and offline-first patterns.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "cache-api",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "Cache API",
        "Service Worker",
        "offline",
        "PWA",
      ],
      relatedTopics: [
        "indexeddb",
        "storage-quotas-and-eviction",
        "file-system-access-api",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/cache-api"),
  },
  "frontend/data-storage/web-sql": {
    metadata: {
      id: "article-frontend-web-sql-concise",
      title: "Web SQL (Deprecated)",
      description:
        "Guide to the deprecated Web SQL Database API covering its history, SQL-based transactions, why it was abandoned, and migration to IndexedDB.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "web-sql",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "Web SQL",
        "deprecated",
        "SQL",
        "migration",
      ],
      relatedTopics: ["indexeddb", "localstorage", "cookies"],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/web-sql"),
  },
  "frontend/data-storage/file-system-access-api": {
    metadata: {
      id: "article-frontend-file-system-access-api-concise",
      title: "File System Access API",
      description:
        "Deep dive into the File System Access API covering file handles, directory access, OPFS (Origin Private File System), and native-like file operations in the browser.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "file-system-access-api",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "File System Access API",
        "OPFS",
        "file handles",
        "browser",
      ],
      relatedTopics: ["indexeddb", "cache-api", "storage-quotas-and-eviction"],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/file-system-access-api"),
  },
  "frontend/data-storage/storage-quotas-and-eviction": {
    metadata: {
      id: "article-frontend-storage-quotas-and-eviction-concise",
      title: "Storage Quotas and Eviction",
      description:
        "Comprehensive guide to browser storage quotas, eviction policies, StorageManager API, persistent storage, and strategies for managing client-side storage limits.",
      category: "frontend",
      subcategory: "data-storage",
      slug: "storage-quotas-and-eviction",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "storage",
        "quotas",
        "eviction",
        "StorageManager",
        "persistence",
      ],
      relatedTopics: ["localstorage", "indexeddb", "cache-api", "cookies"],
    },
    loader: () =>
      import("./articles/system-design/frontend/data-storage/storage-quotas-and-eviction"),
  },
  "frontend/offline-support/progressive-web-apps": {
    metadata: {
      id: "article-frontend-progressive-web-apps-concise",
      title: "Progressive Web Apps (PWA)",
      description:
        "Comprehensive guide to Progressive Web Apps covering the app shell model, Web App Manifest, installability criteria, push notifications, and native-like capabilities in the browser.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "progressive-web-apps",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "PWA",
        "offline",
        "service-worker",
        "manifest",
        "installability",
      ],
      relatedTopics: [
        "service-workers",
        "offline-first-architecture",
        "background-sync",
        "network-status-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/progressive-web-apps"),
  },
  "frontend/offline-support/service-workers": {
    metadata: {
      id: "article-frontend-service-workers-concise",
      title: "Service Workers",
      description:
        "Deep dive into Service Workers covering lifecycle, fetch interception, caching strategies, push notifications, background processing, and debugging techniques.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "service-workers",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "service-worker",
        "offline",
        "caching",
        "push-notifications",
        "PWA",
      ],
      relatedTopics: [
        "progressive-web-apps",
        "offline-first-architecture",
        "background-sync",
        "network-status-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/service-workers"),
  },
  "frontend/offline-support/offline-first-architecture": {
    metadata: {
      id: "article-frontend-offline-first-architecture-concise",
      title: "Offline-First Architecture",
      description:
        "Deep dive into offline-first design covering local-first data, sync protocols, conflict resolution, optimistic UI, and architectural patterns for applications that treat offline as the default state.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "offline-first-architecture",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "offline-first",
        "local-first",
        "sync",
        "CRDTs",
        "IndexedDB",
        "resilience",
      ],
      relatedTopics: [
        "service-workers",
        "conflict-resolution",
        "background-sync",
        "network-status-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/offline-first-architecture"),
  },
  "frontend/offline-support/background-sync": {
    metadata: {
      id: "article-frontend-background-sync-concise",
      title: "Background Sync",
      description:
        "Comprehensive guide to the Background Sync API covering one-off sync, retry mechanisms, Service Worker integration, offline form submissions, and reliable data delivery patterns.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "background-sync",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "background-sync",
        "service-worker",
        "offline",
        "reliability",
        "sync",
      ],
      relatedTopics: [
        "service-workers",
        "periodic-background-sync",
        "offline-first-architecture",
        "network-status-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/background-sync"),
  },
  "frontend/offline-support/periodic-background-sync": {
    metadata: {
      id: "article-frontend-periodic-background-sync-concise",
      title: "Periodic Background Sync",
      description:
        "Comprehensive guide to Periodic Background Sync covering scheduled content refresh, site engagement scoring, battery and data-aware scheduling, and freshness strategies for PWAs.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "periodic-background-sync",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "periodic-sync",
        "background-sync",
        "PWA",
        "content-freshness",
        "service-worker",
      ],
      relatedTopics: [
        "background-sync",
        "service-workers",
        "progressive-web-apps",
        "offline-first-architecture",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/periodic-background-sync"),
  },
  "frontend/offline-support/conflict-resolution": {
    metadata: {
      id: "article-frontend-conflict-resolution-concise",
      title: "Conflict Resolution for Offline Changes",
      description:
        "Deep dive into conflict resolution strategies for offline-capable applications covering CRDTs, operational transformation, last-write-wins, version vectors, merge functions, and user-facing conflict UI.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "conflict-resolution",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "conflict-resolution",
        "CRDTs",
        "OT",
        "offline",
        "sync",
        "distributed-systems",
      ],
      relatedTopics: [
        "offline-first-architecture",
        "background-sync",
        "service-workers",
        "network-status-detection",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/conflict-resolution"),
  },
  "frontend/offline-support/network-status-detection": {
    metadata: {
      id: "article-frontend-network-status-detection-concise",
      title: "Network Status Detection",
      description:
        "Comprehensive guide to detecting network connectivity in web applications covering the Navigator.onLine API, Network Information API, heartbeat patterns, adaptive loading, and building resilient offline-aware UIs.",
      category: "frontend",
      subcategory: "offline-support",
      slug: "network-status-detection",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-14",
      tags: [
        "frontend",
        "network-status",
        "online-offline",
        "connectivity",
        "adaptive-loading",
        "resilience",
      ],
      relatedTopics: [
        "offline-first-architecture",
        "service-workers",
        "background-sync",
        "progressive-web-apps",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/offline-support/network-status-detection"),
  },
  "frontend/edge-cases-and-user-experience/dark-mode-implementation": {
    metadata: {
      id: "article-frontend-dark-mode-implementation-extensive",
      title: "Dark Mode Implementation",
      description:
        "Comprehensive guide to dark mode theming, token systems, and contrast compliance.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "dark-mode-implementation",
      wordCount: 1450,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "theming", "dark-mode", "tokens"],
      relatedTopics: [
        "accessibility",
        "design-systems",
        "performance-optimization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/dark-mode-implementation"),
  },
  "frontend/edge-cases-and-user-experience/empty-states": {
    metadata: {
      id: "article-frontend-empty-states-extensive",
      title: "Empty States",
      description:
        "Comprehensive guide to empty state strategies, onboarding, and activation design.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "empty-states",
      wordCount: 1631,
      readingTime: 8,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "empty-states", "onboarding"],
      relatedTopics: ["loading-states", "error-states", "skeleton-screens"],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/empty-states"),
  },
  "frontend/edge-cases-and-user-experience/error-states": {
    metadata: {
      id: "article-frontend-error-states-extensive",
      title: "Error States",
      description:
        "Comprehensive guide to error taxonomy, recovery UX, and resilient frontend flows.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "error-states",
      wordCount: 1542,
      readingTime: 8,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "error-handling", "recovery", "observability"],
      relatedTopics: ["loading-states", "empty-states", "error-handling"],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/error-states"),
  },
  "frontend/edge-cases-and-user-experience/infinite-scroll-vs-pagination": {
    metadata: {
      id: "article-frontend-infinite-scroll-vs-pagination-extensive",
      title: "Infinite Scroll vs Pagination",
      description:
        "Comprehensive guide to choosing list navigation patterns, including UX, SEO, and performance tradeoffs.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "infinite-scroll-vs-pagination",
      wordCount: 1497,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: [
        "frontend",
        "ux",
        "pagination",
        "infinite-scroll",
        "performance",
        "seo",
      ],
      relatedTopics: [
        "virtualization-windowing",
        "performance-optimization",
        "accessibility",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/infinite-scroll-vs-pagination"),
  },
  "frontend/edge-cases-and-user-experience/keyboard-shortcuts": {
    metadata: {
      id: "article-frontend-keyboard-shortcuts-extensive",
      title: "Keyboard Shortcuts",
      description:
        "Comprehensive guide to shortcut design, focus management, and cross-platform behavior.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "keyboard-shortcuts",
      wordCount: 1346,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "keyboard", "accessibility", "focus"],
      relatedTopics: ["accessibility", "routing", "error-handling"],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/keyboard-shortcuts"),
  },
  "frontend/edge-cases-and-user-experience/loading-states": {
    metadata: {
      id: "article-frontend-loading-states-extensive",
      title: "Loading States",
      description:
        "Comprehensive guide to loading patterns, perceived performance, and progressive UI strategies.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "loading-states",
      wordCount: 1770,
      readingTime: 9,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "loading", "states", "skeletons"],
      relatedTopics: [
        "skeleton-screens",
        "performance-optimization",
        "optimistic-ui-updates",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/loading-states"),
  },
  "frontend/edge-cases-and-user-experience/optimistic-ui-updates": {
    metadata: {
      id: "article-frontend-optimistic-ui-updates-extensive",
      title: "Optimistic UI Updates",
      description:
        "Comprehensive guide to optimistic updates, conflict resolution, and consistency guarantees.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "optimistic-ui-updates",
      wordCount: 1449,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "optimistic-ui", "state", "latency"],
      relatedTopics: ["loading-states", "error-states", "state-management"],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/optimistic-ui-updates"),
  },
  "frontend/edge-cases-and-user-experience/print-stylesheets": {
    metadata: {
      id: "article-frontend-print-stylesheets-extensive",
      title: "Print Stylesheets",
      description:
        "Comprehensive guide to print media queries, layout simplification, and print-specific UX.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "print-stylesheets",
      wordCount: 1370,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "print", "css", "media-queries"],
      relatedTopics: [
        "accessibility",
        "web-standards-and-compatibility",
        "asset-management",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/print-stylesheets"),
  },
  "frontend/edge-cases-and-user-experience/skeleton-screens": {
    metadata: {
      id: "article-frontend-skeleton-screens-extensive",
      title: "Skeleton Screens",
      description:
        "Comprehensive guide to skeleton UI patterns, accessibility, and performance tradeoffs.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "skeleton-screens",
      wordCount: 1547,
      readingTime: 8,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "skeletons", "performance", "accessibility"],
      relatedTopics: [
        "loading-states",
        "performance-optimization",
        "web-vitals",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/skeleton-screens"),
  },
  "frontend/edge-cases-and-user-experience/undo-redo-functionality": {
    metadata: {
      id: "article-frontend-undo-redo-functionality-extensive",
      title: "Undo/Redo Functionality",
      description:
        "Comprehensive guide to command patterns, history stacks, and UX design for undo/redo.",
      category: "frontend",
      subcategory: "edge-cases-and-user-experience",
      slug: "undo-redo-functionality",
      wordCount: 1486,
      readingTime: 7,
      lastUpdated: "2026-03-10",
      tags: ["frontend", "ux", "undo", "redo", "state", "history"],
      relatedTopics: [
        "state-management",
        "optimistic-ui-updates",
        "error-states",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/edge-cases-and-user-experience/undo-redo-functionality"),
  },
  "frontend/performance-optimization/above-the-fold-optimization": {
    metadata: {
      id: "article-frontend-above-fold-extensive",
      title: "Above-the-Fold Optimization",
      description:
        "Comprehensive guide to above-the-fold optimization techniques for improving perceived performance and Core Web Vitals.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "above-the-fold-optimization",
      wordCount: 11000,
      readingTime: 44,
      lastUpdated: "2026-03-10",
      tags: [
        "frontend",
        "performance",
        "critical-rendering-path",
        "above-the-fold",
        "core-web-vitals",
      ],
      relatedTopics: [
        "critical-css",
        "image-optimization",
        "web-vitals",
        "resource-hints",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/above-the-fold-optimization"),
  },
  "frontend/performance-optimization/bundle-size-optimization": {
    metadata: {
      id: "article-frontend-bundle-size-optimization-extensive",
      title: "Bundle Size Optimization",
      description:
        "Comprehensive guide to analyzing, reducing, and monitoring JavaScript bundle sizes with practical strategies, tooling, and real-world optimization workflows.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "bundle-size-optimization",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "bundle-size",
        "webpack",
        "vite",
        "optimization",
        "code-splitting",
      ],
      relatedTopics: ["tree-shaking", "code-splitting", "lazy-loading"],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/bundle-size-optimization"),
  },
  "frontend/performance-optimization/code-splitting": {
    metadata: {
      id: "article-frontend-code-splitting-extensive",
      title: "Code Splitting",
      description:
        "Comprehensive guide to code splitting strategies, implementation patterns, and optimization techniques for frontend performance.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "code-splitting",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "code-splitting",
        "lazy-loading",
        "webpack",
        "bundling",
      ],
      relatedTopics: [
        "lazy-loading",
        "tree-shaking",
        "bundle-size-optimization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/code-splitting"),
  },
  "frontend/performance-optimization/compression": {
    metadata: {
      id: "article-frontend-compression-extensive",
      title: "Compression (Gzip, Brotli)",
      description:
        "Comprehensive guide to HTTP compression including Gzip, Brotli, and Zstandard — covering content-encoding negotiation, server configuration, pre-compression at build time, dynamic vs static compression strategies, and measuring compression effectiveness for production applications.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "compression",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "compression",
        "gzip",
        "brotli",
        "zstandard",
        "content-encoding",
        "transfer-size",
      ],
      relatedTopics: [
        "bundle-size-optimization",
        "code-splitting",
        "critical-css",
        "resource-hints",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/compression"),
  },
  "frontend/performance-optimization/critical-css": {
    metadata: {
      id: "article-frontend-critical-css-extensive",
      title: "Critical CSS",
      description:
        "Comprehensive guide to critical CSS extraction, render-blocking elimination, font loading strategies, and measuring performance impact for production applications.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "critical-css",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "critical-css",
        "render-blocking",
        "css-optimization",
        "web-vitals",
      ],
      relatedTopics: [
        "code-splitting",
        "lazy-loading",
        "server-side-rendering",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/critical-css"),
  },
  "frontend/performance-optimization/debouncing-and-throttling": {
    metadata: {
      id: "article-frontend-debouncing-throttling-extensive",
      title: "Debouncing and Throttling",
      description:
        "Comprehensive guide to debouncing and throttling techniques for controlling event frequency, with implementations from scratch, React hooks, AbortController integration, and real-world patterns.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "debouncing-and-throttling",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "debounce",
        "throttle",
        "events",
        "optimization",
        "react-hooks",
        "rate-limiting",
      ],
      relatedTopics: [
        "memoization-and-react-memo",
        "web-vitals",
        "virtualization-windowing",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/debouncing-and-throttling"),
  },
  "frontend/performance-optimization/image-optimization": {
    metadata: {
      id: "article-frontend-image-optimization-extensive",
      title: "Image Optimization (WebP, AVIF, responsive images, srcset)",
      description:
        "Comprehensive guide to image optimization including modern formats, responsive strategies, CDN delivery, and build-time pipelines.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "image-optimization",
      wordCount: 11200,
      readingTime: 45,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "images",
        "WebP",
        "AVIF",
        "responsive",
        "srcset",
      ],
      relatedTopics: [
        "lazy-loading",
        "critical-css",
        "above-the-fold-optimization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/image-optimization"),
  },
  "frontend/performance-optimization/lazy-loading": {
    metadata: {
      id: "article-frontend-lazy-loading-extensive",
      title: "Lazy Loading (Images, Components, Routes)",
      description:
        "Comprehensive guide to lazy loading images, components, and routes for frontend performance optimization.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "lazy-loading",
      wordCount: 11000,
      readingTime: 44,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "lazy-loading",
        "images",
        "intersection-observer",
      ],
      relatedTopics: [
        "code-splitting",
        "image-optimization",
        "virtualization-windowing",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/lazy-loading"),
  },
  "frontend/performance-optimization/memoization-and-react-memo": {
    metadata: {
      id: "article-frontend-memoization-react-memo-extensive",
      title: "Memoization and React.memo",
      description:
        "Comprehensive guide to memoization in React including React.memo, useMemo, useCallback, and the React Compiler.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "memoization-and-react-memo",
      wordCount: 10800,
      readingTime: 43,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "react",
        "memoization",
        "React.memo",
        "useMemo",
        "useCallback",
      ],
      relatedTopics: [
        "virtualization-windowing",
        "debouncing-and-throttling",
        "code-splitting",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/memoization-and-react-memo"),
  },
  "frontend/performance-optimization/minification-and-uglification": {
    metadata: {
      id: "article-frontend-minification-extensive",
      title: "Minification & Uglification",
      description:
        "Comprehensive guide to minification and uglification techniques for optimizing JavaScript, CSS, and HTML delivery.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "minification-and-uglification",
      wordCount: 11000,
      readingTime: 44,
      lastUpdated: "2026-03-10",
      tags: [
        "frontend",
        "performance",
        "minification",
        "uglification",
        "bundling",
      ],
      relatedTopics: [
        "tree-shaking",
        "bundle-size-optimization",
        "compression",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/minification-and-uglification"),
  },
  "frontend/performance-optimization/performance-budgets": {
    metadata: {
      id: "article-frontend-performance-budgets-extensive",
      title: "Performance Budgets",
      description:
        "Comprehensive guide to performance budgets — types, strategies for setting thresholds, CI/CD enforcement, build tool integration, team culture, and real-world examples.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "performance-budgets",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "performance-budgets",
        "bundle-size",
        "CI/CD",
        "Lighthouse",
        "web-vitals",
      ],
      relatedTopics: [
        "web-vitals",
        "bundle-size-optimization",
        "code-splitting",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/performance-budgets"),
  },
  "frontend/performance-optimization/request-deduplication": {
    metadata: {
      id: "article-frontend-request-deduplication-extensive",
      title: "Request Deduplication",
      description:
        "Comprehensive guide to request deduplication strategies, promise sharing, cache normalization, and framework-level dedup in modern frontend applications.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "request-deduplication",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "request-deduplication",
        "caching",
        "react-query",
        "swr",
        "fetch",
        "graphql",
      ],
      relatedTopics: [
        "caching-strategies",
        "data-fetching",
        "memoization-and-react-memo",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/request-deduplication"),
  },
  "frontend/performance-optimization/resource-hints": {
    metadata: {
      id: "article-frontend-resource-hints-extensive",
      title: "Resource Hints (prefetch, preload, preconnect, dns-prefetch)",
      description:
        "Comprehensive guide to resource hints, covering dns-prefetch, preconnect, prefetch, preload, modulepreload, fetchpriority, and the Speculation Rules API for frontend performance optimization.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "resource-hints",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "resource-hints",
        "prefetch",
        "preload",
        "preconnect",
        "dns-prefetch",
        "web-performance",
      ],
      relatedTopics: [
        "code-splitting",
        "lazy-loading",
        "critical-rendering-path",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/resource-hints"),
  },
  "frontend/performance-optimization/tree-shaking": {
    metadata: {
      id: "article-frontend-tree-shaking-extensive",
      title: "Tree Shaking",
      description:
        "Comprehensive guide to tree shaking, dead code elimination, and optimizing JavaScript bundles through static analysis.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "tree-shaking",
      wordCount: 10800,
      readingTime: 43,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "tree-shaking",
        "dead-code",
        "webpack",
        "bundling",
      ],
      relatedTopics: [
        "code-splitting",
        "bundle-size-optimization",
        "minification-and-uglification",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/tree-shaking"),
  },
  "frontend/performance-optimization/virtualization-windowing": {
    metadata: {
      id: "article-frontend-virtualization-windowing-extensive",
      title: "Virtualization/Windowing (for Long Lists)",
      description:
        "Comprehensive guide to list and grid virtualization techniques, library comparisons, custom implementations, and production patterns for rendering massive datasets in React.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "virtualization-windowing",
      wordCount: 10500,
      readingTime: 42,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "virtualization",
        "windowing",
        "react-window",
        "react-virtual",
        "infinite-scroll",
        "dom-optimization",
      ],
      relatedTopics: ["lazy-loading", "web-vitals", "bundle-size-optimization"],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/virtualization-windowing"),
  },
  "frontend/performance-optimization/web-vitals": {
    metadata: {
      id: "article-frontend-web-vitals-extensive",
      title: "Web Vitals (LCP, FID, CLS, TTFB, INP)",
      description:
        "Comprehensive guide to Core Web Vitals, performance measurement, optimization strategies, and real-user monitoring.",
      category: "frontend",
      subcategory: "performance-optimization",
      slug: "web-vitals",
      wordCount: 11500,
      readingTime: 46,
      lastUpdated: "2026-03-09",
      tags: [
        "frontend",
        "performance",
        "web-vitals",
        "LCP",
        "CLS",
        "INP",
        "TTFB",
        "Core Web Vitals",
      ],
      relatedTopics: ["image-optimization", "critical-css", "code-splitting"],
    },
    loader: () =>
      import("./articles/system-design/frontend/performance-optimization/web-vitals"),
  },
  "frontend/rendering-strategies/client-side-rendering": {
    metadata: {
      id: "article-frontend-client-sid-extensive",
      title: "Client-Side Rendering (CSR)",
      description:
        "Comprehensive guide to Client-Side Rendering (CSR) covering concepts, implementation, and best practices.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "client-side-rendering",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-05",
      tags: ["frontend", "rendering", "CSR", "SPA", "JavaScript"],
      relatedTopics: [
        "server-side-rendering",
        "static-site-generation",
        "progressive-hydration",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/client-side-rendering"),
  },
  "frontend/rendering-strategies/edge-rendering": {
    metadata: {
      id: "article-frontend-edge-rende-extensive",
      title: "Edge Rendering",
      description:
        "Learn edge rendering strategies for delivering personalized content with minimal latency using edge compute platforms.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "edge-rendering",
      wordCount: 3600,
      readingTime: 15,
      lastUpdated: "2026-03-06",
      tags: [
        "frontend",
        "rendering",
        "edge",
        "CDN",
        "performance",
        "Vercel",
        "Cloudflare",
      ],
      relatedTopics: [
        "server-side-rendering",
        "streaming-ssr",
        "static-site-generation",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/edge-rendering"),
  },
  "frontend/rendering-strategies/incremental-static-regeneration": {
    metadata: {
      id: "article-frontend-incrementa-extensive",
      title: "Incremental Static Regeneration (ISR)",
      description:
        "Comprehensive guide to Incremental Static Regeneration (ISR) covering stale-while-revalidate patterns, on-demand revalidation, and hybrid rendering approaches.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "incremental-static-regeneration",
      wordCount: 3450,
      readingTime: 14,
      lastUpdated: "2026-03-05",
      tags: [
        "frontend",
        "rendering",
        "ISR",
        "Next.js",
        "performance",
        "caching",
      ],
      relatedTopics: [
        "static-site-generation",
        "server-side-rendering",
        "edge-rendering",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/incremental-static-regeneration"),
  },
  "frontend/rendering-strategies/islands-architecture": {
    metadata: {
      id: "article-frontend-islands-ar-extensive",
      title: "Islands Architecture",
      description:
        "Explore islands architecture pattern for building performant web apps with isolated interactive components in a sea of static content.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "islands-architecture",
      wordCount: 3400,
      readingTime: 14,
      lastUpdated: "2026-03-06",
      tags: [
        "frontend",
        "rendering",
        "architecture",
        "Astro",
        "performance",
        "partial-hydration",
      ],
      relatedTopics: [
        "partial-hydration",
        "progressive-hydration",
        "static-site-generation",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/islands-architecture"),
  },
  "frontend/rendering-strategies/partial-hydration": {
    metadata: {
      id: "article-frontend-partial-hydration-extensive",
      title: "Partial Hydration",
      description:
        "Comprehensive guide to Partial Hydration covering concepts, implementation techniques, and best practices for conditional component hydration.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "partial-hydration",
      wordCount: 3180,
      readingTime: 13,
      lastUpdated: "2026-03-05",
      tags: [
        "frontend",
        "rendering",
        "hydration",
        "performance",
        "optimization",
      ],
      relatedTopics: [
        "progressive-hydration",
        "selective-hydration",
        "islands-architecture",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/partial-hydration"),
  },
  "frontend/rendering-strategies/progressive-hydration": {
    metadata: {
      id: "article-frontend-progressive-hydration-extensive",
      title: "Progressive Hydration",
      description:
        "Comprehensive guide to Progressive Hydration covering concepts, implementation strategies, and best practices for optimizing hydration performance.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "progressive-hydration",
      wordCount: 3200,
      readingTime: 13,
      lastUpdated: "2026-03-05",
      tags: ["frontend", "rendering", "hydration", "SSR", "performance"],
      relatedTopics: [
        "server-side-rendering",
        "selective-hydration",
        "streaming-ssr",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/progressive-hydration"),
  },
  "frontend/rendering-strategies/selective-hydration": {
    metadata: {
      id: "article-frontend-selective-hydration-extensive",
      title: "Selective Hydration",
      description:
        "Comprehensive guide to Selective Hydration covering concepts, implementation patterns, and best practices for minimizing JavaScript overhead.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "selective-hydration",
      wordCount: 3150,
      readingTime: 13,
      lastUpdated: "2026-03-05",
      tags: ["frontend", "rendering", "hydration", "React", "performance"],
      relatedTopics: [
        "progressive-hydration",
        "islands-architecture",
        "partial-hydration",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/selective-hydration"),
  },
  "frontend/rendering-strategies/server-side-rendering": {
    metadata: {
      id: "article-frontend-server-sid-extensive",
      title: "Server-Side Rendering (SSR)",
      description:
        "Comprehensive guide to Server-Side Rendering (SSR) covering concepts, hydration, implementation, and best practices.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "server-side-rendering",
      wordCount: 3400,
      readingTime: 14,
      lastUpdated: "2026-03-05",
      tags: ["frontend", "rendering", "SSR", "hydration", "performance"],
      relatedTopics: [
        "client-side-rendering",
        "static-site-generation",
        "streaming-ssr",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/server-side-rendering"),
  },
  "frontend/rendering-strategies/static-site-generation": {
    metadata: {
      id: "article-frontend-static-sit-extensive",
      title: "Static Site Generation (SSG)",
      description:
        "Comprehensive guide to Static Site Generation (SSG) covering build-time rendering, revalidation strategies, and best practices.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "static-site-generation",
      wordCount: 3350,
      readingTime: 14,
      lastUpdated: "2026-03-05",
      tags: ["frontend", "rendering", "SSG", "Jamstack", "performance"],
      relatedTopics: [
        "client-side-rendering",
        "server-side-rendering",
        "incremental-static-regeneration",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/static-site-generation"),
  },
  "frontend/rendering-strategies/streaming-ssr": {
    metadata: {
      id: "article-frontend-streaming--extensive",
      title: "Streaming SSR",
      description:
        "Understand streaming server-side rendering for faster time-to-first-byte and improved perceived performance with progressive content delivery.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "streaming-ssr",
      wordCount: 3500,
      readingTime: 14,
      lastUpdated: "2026-03-06",
      tags: [
        "frontend",
        "rendering",
        "SSR",
        "streaming",
        "React",
        "performance",
        "Suspense",
      ],
      relatedTopics: [
        "server-side-rendering",
        "progressive-hydration",
        "selective-hydration",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/rendering-strategies/streaming-ssr"),
  },
  "frontend/web-standards-and-compatibility/browser-feature-detection": {
    metadata: {
      id: "article-frontend-browser-feature-detection-extensive",
      title: "Browser Feature Detection",
      description:
        "Comprehensive guide to feature detection strategies, progressive enhancement, and compatibility safety.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "browser-feature-detection",
      wordCount: 978,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: ["frontend", "web-standards", "feature-detection", "compatibility"],
      relatedTopics: [
        "progressive-enhancement",
        "polyfills-and-transpilation",
        "critical-css",
        "web-vitals",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/browser-feature-detection"),
  },
  "frontend/web-standards-and-compatibility/cross-browser-testing": {
    metadata: {
      id: "article-frontend-cross-browser-testing-extensive",
      title: "Cross-Browser Testing",
      description:
        "Comprehensive guide to cross-browser testing strategy, automation, and compatibility risk management.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "cross-browser-testing",
      wordCount: 989,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: ["frontend", "testing", "cross-browser", "compatibility"],
      relatedTopics: [
        "responsive-design",
        "accessibility",
        "web-vitals",
        "performance-optimization",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/cross-browser-testing"),
  },
  "frontend/web-standards-and-compatibility/css-vendor-prefixes": {
    metadata: {
      id: "article-frontend-css-vendor-prefixes-extensive",
      title: "CSS Vendor Prefixes",
      description:
        "Comprehensive guide to vendor prefix strategy, tooling, and cross-browser CSS compatibility.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "css-vendor-prefixes",
      wordCount: 982,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: ["frontend", "css", "vendor-prefixes", "compatibility"],
      relatedTopics: [
        "cross-browser-testing",
        "critical-css",
        "build-optimization",
        "responsive-design",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/css-vendor-prefixes"),
  },
  "frontend/web-standards-and-compatibility/graceful-degradation": {
    metadata: {
      id: "article-frontend-graceful-degradation-extensive",
      title: "Graceful Degradation",
      description:
        "Comprehensive guide to designing for degradation paths, fallback UX, and compatibility strategies.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "graceful-degradation",
      wordCount: 1016,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: [
        "frontend",
        "web-standards",
        "graceful-degradation",
        "compatibility",
      ],
      relatedTopics: [
        "progressive-enhancement",
        "legacy-browser-support",
        "polyfills-and-transpilation",
        "critical-css",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/graceful-degradation"),
  },
  "frontend/web-standards-and-compatibility/legacy-browser-support": {
    metadata: {
      id: "article-frontend-legacy-browser-support-extensive",
      title: "Legacy Browser Support",
      description:
        "Comprehensive guide to legacy browser strategy, compatibility tradeoffs, and support policies.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "legacy-browser-support",
      wordCount: 1000,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: ["frontend", "compatibility", "legacy-browser", "standards"],
      relatedTopics: [
        "polyfills-and-transpilation",
        "graceful-degradation",
        "bundle-size-optimization",
        "critical-css",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/legacy-browser-support"),
  },
  "frontend/web-standards-and-compatibility/polyfills-and-transpilation": {
    metadata: {
      id: "article-frontend-polyfills-and-transpilation-extensive",
      title: "Polyfills and Transpilation",
      description:
        "Comprehensive guide to polyfill strategy, transpilation targets, and compatibility tradeoffs.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "polyfills-and-transpilation",
      wordCount: 1003,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: [
        "frontend",
        "web-standards",
        "polyfills",
        "transpilation",
        "compatibility",
      ],
      relatedTopics: [
        "bundle-size-optimization",
        "minification-and-uglification",
        "tree-shaking",
        "legacy-browser-support",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/polyfills-and-transpilation"),
  },
  "frontend/web-standards-and-compatibility/progressive-enhancement": {
    metadata: {
      id: "article-frontend-progressive-enhancement-extensive",
      title: "Progressive Enhancement",
      description:
        "Comprehensive guide to progressive enhancement strategies, layered UX, and resilience across devices and browsers.",
      category: "frontend",
      subcategory: "web-standards-and-compatibility",
      slug: "progressive-enhancement",
      wordCount: 1079,
      readingTime: 5,
      lastUpdated: "2026-03-11",
      tags: [
        "frontend",
        "web-standards",
        "progressive-enhancement",
        "accessibility",
        "compatibility",
      ],
      relatedTopics: [
        "graceful-degradation",
        "browser-feature-detection",
        "critical-css",
        "web-vitals",
      ],
    },
    loader: () =>
      import("./articles/system-design/frontend/web-standards-and-compatibility/progressive-enhancement"),
  },
  "non-functional-requirements/frontend-non-functional-requirements/page-load-performance":
    {
      metadata: {
        id: "article-frontend-nfr-page-load-performance-extensive",
        title: "Page Load Performance",
        description:
          "Comprehensive guide to frontend page load performance optimization, covering metrics, strategies, trade-offs, and production patterns for staff/principal engineer interviews.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "page-load-performance",
        wordCount: 11200,
        readingTime: 45,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "performance",
          "page-load",
          "web-vitals",
          "optimization",
        ],
        relatedTopics: [
          "perceived-performance",
          "rendering-strategy",
          "web-vitals",
          "critical-css",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/page-load-performance"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/perceived-performance":
    {
      metadata: {
        id: "article-frontend-nfr-perceived-performance",
        title: "Perceived Performance",
        description:
          "Comprehensive guide to perceived performance optimization, covering psychological principles, UX patterns, and techniques to make applications feel faster.",
        category: "frontend",
        subcategory: "nfr",
        slug: "perceived-performance",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "performance",
          "ux",
          "perceived-performance",
          "skeleton-screens",
        ],
        relatedTopics: [
          "page-load-performance",
          "loading-states",
          "optimistic-updates",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/perceived-performance"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/rendering-strategy":
    {
      metadata: {
        id: "article-frontend-nfr-rendering-strategy",
        title: "Rendering Strategy",
        description:
          "Comprehensive guide to frontend rendering strategies: CSR, SSR, SSG, ISR, and hybrid approaches. Learn to choose the right strategy for your use case.",
        category: "frontend",
        subcategory: "nfr",
        slug: "rendering-strategy",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "rendering",
          "csr",
          "ssr",
          "ssg",
          "isr",
          "performance",
        ],
        relatedTopics: [
          "page-load-performance",
          "perceived-performance",
          "seo",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/rendering-strategy"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/virtualization-windowing":
    {
      metadata: {
        id: "article-frontend-nfr-virtualization-windowing",
        title: "Virtualization / Windowing",
        description:
          "Comprehensive guide to list virtualization and windowing techniques for rendering large datasets efficiently.",
        category: "frontend",
        subcategory: "nfr",
        slug: "virtualization-windowing",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "performance",
          "virtualization",
          "windowing",
          "large-lists",
          "react",
        ],
        relatedTopics: [
          "page-load-performance",
          "memoization",
          "infinite-scroll",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/virtualization-windowing"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/media-optimization":
    {
      metadata: {
        id: "article-frontend-nfr-media-optimization",
        title: "Media Optimization",
        description:
          "Comprehensive guide to optimizing images, video, and audio for web performance. Covers modern formats, responsive media, lazy loading, and CDN delivery.",
        category: "frontend",
        subcategory: "nfr",
        slug: "media-optimization",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "performance",
          "images",
          "video",
          "optimization",
          "webp",
          "avif",
        ],
        relatedTopics: ["page-load-performance", "lazy-loading", "cdn-caching"],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/media-optimization"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/offline-support-pwa":
    {
      metadata: {
        id: "article-frontend-nfr-offline-support-pwa",
        title: "Offline Support / PWA",
        description:
          "Comprehensive guide to offline-first architecture, Progressive Web Apps, Service Workers, and building resilient web applications that work without connectivity.",
        category: "frontend",
        subcategory: "nfr",
        slug: "offline-support-pwa",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "offline",
          "pwa",
          "service-worker",
          "resilience",
        ],
        relatedTopics: [
          "page-load-performance",
          "caching-strategies",
          "network-status",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/offline-support-pwa"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/client-edge-caching":
    {
      metadata: {
        id: "article-frontend-nfr-client-edge-caching",
        title: "Client & Edge Caching",
        description:
          "Comprehensive guide to caching strategies at the client and edge layers. Covers browser cache, CDN, edge computing, and cache invalidation patterns.",
        category: "frontend",
        subcategory: "nfr",
        slug: "client-edge-caching",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: ["frontend", "nfr", "caching", "cdn", "edge", "performance"],
        relatedTopics: [
          "page-load-performance",
          "offline-support",
          "network-efficiency",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/client-edge-caching"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/network-efficiency":
    {
      metadata: {
        id: "article-frontend-nfr-network-efficiency",
        title: "Network Efficiency",
        description:
          "Comprehensive guide to optimizing network usage for web applications. Covers HTTP/2, HTTP/3, request batching, compression, and connection management.",
        category: "frontend",
        subcategory: "nfr",
        slug: "network-efficiency",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: ["frontend", "nfr", "network", "http2", "http3", "performance"],
        relatedTopics: [
          "page-load-performance",
          "client-edge-caching",
          "offline-support",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/network-efficiency"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/accessibility-a11y":
    {
      metadata: {
        id: "article-frontend-nfr-accessibility-a11y",
        title: "Accessibility (a11y)",
        description:
          "Comprehensive guide to web accessibility covering WCAG guidelines, ARIA, keyboard navigation, screen readers, and inclusive design patterns.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "accessibility-a11y",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "accessibility",
          "a11y",
          "wcag",
          "aria",
          "inclusive",
        ],
        relatedTopics: [
          "web-standards",
          "semantic-html",
          "keyboard-navigation",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/accessibility"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/cross-browser-compatibility":
    {
      metadata: {
        id: "article-frontend-nfr-cross-browser-compatibility",
        title: "Cross-Browser Compatibility",
        description:
          "Comprehensive guide to ensuring web applications work consistently across browsers. Covers feature detection, polyfills, testing strategies, and graceful degradation.",
        category: "frontend",
        subcategory: "nfr",
        slug: "cross-browser-compatibility",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "compatibility",
          "browsers",
          "polyfills",
          "testing",
        ],
        relatedTopics: [
          "web-standards",
          "accessibility-a11y",
          "progressive-enhancement",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/cross-browser-compatibility"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/device-responsiveness":
    {
      metadata: {
        id: "article-frontend-nfr-device-responsiveness",
        title: "Device Responsiveness",
        description:
          "Comprehensive guide to responsive design: mobile-first approach, breakpoints, fluid layouts, touch interactions, and cross-device testing strategies.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "device-responsiveness",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "responsive",
          "mobile-first",
          "breakpoints",
          "touch",
          "cross-device",
        ],
        relatedTopics: [
          "accessibility-a11y",
          "performance",
          "media-optimization",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/device-responsiveness"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/internationalization-localization":
    {
      metadata: {
        id: "article-frontend-nfr-internationalization-localization",
        title: "Internationalization & Localization",
        description:
          "Comprehensive guide to i18n and l10n: translation management, RTL support, date/number formatting, locale detection, and building globally-accessible applications.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "internationalization-localization",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "i18n",
          "l10n",
          "translation",
          "rtl",
          "globalization",
        ],
        relatedTopics: [
          "accessibility-a11y",
          "cross-browser-compatibility",
          "seo-discoverability",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/internationalization-localization"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/seo-discoverability":
    {
      metadata: {
        id: "article-frontend-nfr-seo-discoverability",
        title: "SEO & Discoverability",
        description:
          "Comprehensive guide to frontend SEO: meta tags, structured data, sitemaps, SSR for SEO, Core Web Vitals, and social media optimization.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "seo-discoverability",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "seo",
          "meta-tags",
          "structured-data",
          "sitemap",
          "social-sharing",
        ],
        relatedTopics: [
          "rendering-strategy",
          "page-load-performance",
          "internationalization-localization",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/seo-discoverability"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/error-ux-recovery":
    {
      metadata: {
        id: "article-frontend-nfr-error-ux-recovery",
        title: "Error UX & Recovery",
        description:
          "Comprehensive guide to error handling UX, error boundaries, user-friendly error messages, retry patterns, and recovery flows for resilient frontend applications.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "error-ux-recovery",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "error-handling",
          "ux",
          "resilience",
          "error-boundaries",
          "recovery",
        ],
        relatedTopics: [
          "error-states",
          "loading-states",
          "frontend-observability-rum",
          "offline-support-pwa",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/error-ux-recovery"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/xss-injection-protection":
    {
      metadata: {
        id: "article-frontend-nfr-xss-injection-protection",
        title: "XSS & Injection Protection",
        description:
          "Comprehensive guide to cross-site scripting (XSS) attacks, injection vulnerabilities, Content Security Policy, sanitization, and frontend security best practices.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "xss-injection-protection",
        wordCount: 12000,
        readingTime: 48,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "security",
          "xss",
          "injection",
          "csp",
          "sanitization",
        ],
        relatedTopics: [
          "secure-client-storage",
          "authentication-ux-flows",
          "third-party-script-safety",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/xss-injection-protection"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/secure-client-storage":
    {
      metadata: {
        id: "article-frontend-nfr-secure-client-storage",
        title: "Secure Client Storage",
        description:
          "Comprehensive guide to securely storing sensitive data on the client. Covers localStorage security, token storage, encryption, XSS implications, and secure storage patterns.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "secure-client-storage",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "security",
          "storage",
          "tokens",
          "encryption",
          "xss",
        ],
        relatedTopics: [
          "xss-injection-protection",
          "authentication-ux-flows",
          "client-persistence-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/secure-client-storage"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/authentication-ux-flows":
    {
      metadata: {
        id: "article-frontend-nfr-authentication-ux-flows",
        title: "Authentication UX Flows",
        description:
          "Comprehensive guide to authentication UX: login patterns, session management, token refresh, MFA UX, passwordless auth, and secure authentication flows.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "authentication-ux-flows",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "authentication",
          "security",
          "session",
          "mfa",
          "ux",
        ],
        relatedTopics: [
          "secure-client-storage",
          "error-ux-recovery",
          "xss-injection-protection",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/authentication-ux-flows"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/third-party-script-safety":
    {
      metadata: {
        id: "article-frontend-nfr-third-party-script-safety",
        title: "Third-Party Script Safety",
        description:
          "Comprehensive guide to safely integrating third-party scripts: analytics, ads, widgets, tag managers, security risks, and performance impact mitigation.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "third-party-script-safety",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "security",
          "third-party",
          "analytics",
          "performance",
          "csp",
        ],
        relatedTopics: [
          "xss-injection-protection",
          "performance-optimization",
          "privacy-consent-ux",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/third-party-script-safety"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/state-management-strategy":
    {
      metadata: {
        id: "article-frontend-nfr-state-management-strategy",
        title: "State Management Strategy",
        description:
          "Comprehensive guide to frontend state management: Redux, Zustand, Context, server state, and selection criteria for staff engineer architecture decisions.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "state-management-strategy",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "state-management",
          "redux",
          "zustand",
          "architecture",
          "server-state",
        ],
        relatedTopics: [
          "local-component-state",
          "server-state-management",
          "client-persistence-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/state-management-strategy"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/client-persistence-strategy":
    {
      metadata: {
        id: "article-frontend-nfr-client-persistence-strategy",
        title: "Client Persistence Strategy",
        description:
          "Comprehensive guide to client-side data persistence: localStorage, IndexedDB, cookies, hydration, offline storage, and data synchronization patterns.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "client-persistence-strategy",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "persistence",
          "storage",
          "indexeddb",
          "hydration",
          "offline",
        ],
        relatedTopics: [
          "secure-client-storage",
          "offline-support-pwa",
          "state-management-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/client-persistence-strategy"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/multi-tab-synchronization":
    {
      metadata: {
        id: "article-frontend-nfr-multi-tab-synchronization",
        title: "Multi-Tab Synchronization",
        description:
          "Comprehensive guide to synchronizing state across browser tabs: BroadcastChannel, localStorage events, SharedWorker, and cross-tab communication patterns.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "multi-tab-synchronization",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "multi-tab",
          "synchronization",
          "broadcastchannel",
          "cross-tab",
        ],
        relatedTopics: [
          "client-persistence-strategy",
          "state-management-strategy",
          "offline-support-pwa",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/multi-tab-synchronization"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/conflict-resolution-ux":
    {
      metadata: {
        id: "article-frontend-nfr-conflict-resolution-ux",
        title: "Conflict Resolution UX",
        description:
          "Comprehensive guide to handling data conflicts in offline-capable apps: conflict detection, resolution strategies, merge UI patterns, and CRDTs.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "conflict-resolution-ux",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "conflict-resolution",
          "offline",
          "sync",
          "crdt",
          "ux",
        ],
        relatedTopics: [
          "offline-support-pwa",
          "multi-tab-synchronization",
          "client-persistence-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/conflict-resolution-ux"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/realtime-ui-handling":
    {
      metadata: {
        id: "article-frontend-nfr-realtime-ui-handling",
        title: "Real-Time UI Handling",
        description:
          "Comprehensive guide to building real-time UIs: WebSockets, Server-Sent Events, polling strategies, live updates, presence indicators, and optimistic UI patterns.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "realtime-ui-handling",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "realtime",
          "websockets",
          "sse",
          "live-updates",
          "presence",
        ],
        relatedTopics: [
          "network-efficiency",
          "offline-support-pwa",
          "multi-tab-synchronization",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/realtime-ui-handling"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/frontend-testing-strategy":
    {
      metadata: {
        id: "article-frontend-nfr-frontend-testing-strategy",
        title: "Frontend Testing Strategy",
        description:
          "Comprehensive guide to frontend testing: unit tests, integration tests, E2E tests, visual regression, accessibility testing, and testing pyramid for modern web applications.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "frontend-testing-strategy",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "testing",
          "unit-tests",
          "integration-tests",
          "e2e",
          "accessibility",
        ],
        relatedTopics: [
          "error-ux-recovery",
          "accessibility-a11y",
          "developer-experience",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/frontend-testing-strategy"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/frontend-observability-rum":
    {
      metadata: {
        id: "article-frontend-nfr-frontend-observability-rum",
        title: "Frontend Observability (RUM)",
        description:
          "Comprehensive guide to Real User Monitoring: performance metrics, error tracking, user session analysis, and production observability for frontend applications.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "frontend-observability-rum",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "observability",
          "rum",
          "monitoring",
          "performance",
          "errors",
        ],
        relatedTopics: [
          "page-load-performance",
          "error-ux-recovery",
          "analytics",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/frontend-observability-rum"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/developer-experience":
    {
      metadata: {
        id: "article-frontend-nfr-developer-experience",
        title: "Developer Experience (DX)",
        description:
          "Comprehensive guide to frontend developer experience: tooling, workflows, documentation, onboarding, and creating productive development environments.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "developer-experience",
        wordCount: 8500,
        readingTime: 34,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "dx",
          "tooling",
          "workflow",
          "documentation",
          "productivity",
        ],
        relatedTopics: [
          "frontend-testing-strategy",
          "build-optimization",
          "frontend-deployment-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/developer-experience"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/build-optimization":
    {
      metadata: {
        id: "article-frontend-nfr-build-optimization",
        title: "Build Optimization",
        description:
          "Comprehensive guide to frontend build optimization: bundlers, tree-shaking, code splitting, minification, and build performance for production deployments.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "build-optimization",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "build",
          "optimization",
          "bundling",
          "tree-shaking",
          "performance",
        ],
        relatedTopics: [
          "performance-optimization",
          "developer-experience",
          "frontend-deployment-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/build-optimization"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/frontend-deployment-strategy":
    {
      metadata: {
        id: "article-frontend-nfr-frontend-deployment-strategy",
        title: "Frontend Deployment Strategy",
        description:
          "Comprehensive guide to frontend deployment: CI/CD pipelines, hosting platforms, CDN configuration, rollback strategies, and zero-downtime deployments.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "frontend-deployment-strategy",
        wordCount: 8500,
        readingTime: 34,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "deployment",
          "ci-cd",
          "cdn",
          "hosting",
          "rollback",
        ],
        relatedTopics: [
          "build-optimization",
          "developer-experience",
          "feature-flagging-rollouts",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/frontend-deployment-strategy"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/privacy-consent-ux":
    {
      metadata: {
        id: "article-frontend-nfr-privacy-consent-ux",
        title: "Privacy & Consent UX",
        description:
          "Comprehensive guide to privacy compliance: GDPR, CCPA, cookie consent, data collection transparency, and user privacy controls.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "privacy-consent-ux",
        wordCount: 8500,
        readingTime: 34,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "privacy",
          "gdpr",
          "ccpa",
          "consent",
          "cookies",
        ],
        relatedTopics: ["third-party-script-safety", "security", "analytics"],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/privacy-consent-ux"),
    },
  "non-functional-requirements/frontend-non-functional-requirements/feature-flagging-rollouts":
    {
      metadata: {
        id: "article-frontend-nfr-feature-flagging-rollouts",
        title: "Feature Flagging & Rollouts",
        description:
          "Comprehensive guide to feature flags: gradual rollouts, A/B testing, kill switches, targeting rules, and feature management platforms.",
        category: "non-functional-requirements",
        subcategory: "frontend-non-functional-requirements",
        slug: "feature-flagging-rollouts",
        wordCount: 8500,
        readingTime: 34,
        lastUpdated: "2026-03-15",
        tags: [
          "frontend",
          "nfr",
          "feature-flags",
          "rollout",
          "ab-testing",
          "deployment",
          "targeting",
        ],
        relatedTopics: [
          "frontend-deployment-strategy",
          "frontend-testing-strategy",
          "analytics",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/frontend-nfr/feature-flagging-rollouts"),
    },

  // ============================================================
  // BACKEND NON-FUNCTIONAL REQUIREMENTS ARTICLES
  // ============================================================

  "non-functional-requirements/backend-non-functional-requirements/scalability-strategy":
    {
      metadata: {
        id: "article-backend-nfr-scalability-strategy-extensive",
        title: "Scalability Strategy",
        description:
          "Comprehensive guide to backend scalability strategy, covering horizontal vs vertical scaling, database sharding, load balancing, auto-scaling patterns, and trade-offs for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "scalability-strategy",
        wordCount: 12500,
        readingTime: 50,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "scalability",
          "distributed-systems",
          "load-balancing",
          "sharding",
          "auto-scaling",
        ],
        relatedTopics: [
          "high-availability",
          "fault-tolerance-resilience",
          "database-selection",
          "load-balancing",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/scalability-strategy"),
    },
  "non-functional-requirements/backend-non-functional-requirements/high-availability":
    {
      metadata: {
        id: "article-backend-nfr-high-availability-extensive",
        title: "High Availability",
        description:
          "Comprehensive guide to backend high availability, covering redundancy, failover strategies, replication patterns, RTO/RPO, and production reliability for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "high-availability",
        wordCount: 11500,
        readingTime: 46,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "high-availability",
          "failover",
          "replication",
          "redundancy",
          "reliability",
        ],
        relatedTopics: [
          "fault-tolerance-resilience",
          "disaster-recovery",
          "scalability-strategy",
          "consistency-model",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/high-availability"),
    },
  "non-functional-requirements/backend-non-functional-requirements/fault-tolerance-resilience":
    {
      metadata: {
        id: "article-backend-nfr-fault-tolerance-resilience-extensive",
        title: "Fault Tolerance & Resilience",
        description:
          "Comprehensive guide to backend fault tolerance and resilience patterns, covering circuit breakers, retries, bulkheads, graceful degradation, and failure handling for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "fault-tolerance-resilience",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "fault-tolerance",
          "resilience",
          "circuit-breaker",
          "retry",
          "bulkhead",
          "graceful-degradation",
        ],
        relatedTopics: [
          "high-availability",
          "latency-slas",
          "scalability-strategy",
          "monitoring-observability",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/fault-tolerance-resilience"),
    },
  "non-functional-requirements/backend-non-functional-requirements/latency-slas":
    {
      metadata: {
        id: "article-backend-nfr-latency-slas-extensive",
        title: "Latency SLAs",
        description:
          "Comprehensive guide to backend latency SLAs, covering percentiles (P50/P95/P99), tail latency optimization, SLOs, error budgets, and production latency management for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "latency-slas",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "latency",
          "sla",
          "slo",
          "percentiles",
          "tail-latency",
          "performance",
        ],
        relatedTopics: [
          "high-availability",
          "fault-tolerance-resilience",
          "scalability-strategy",
          "monitoring-observability",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/latency-slas"),
    },
  "non-functional-requirements/backend-non-functional-requirements/consistency-model":
    {
      metadata: {
        id: "article-backend-nfr-consistency-model-extensive",
        title: "Consistency Model",
        description:
          "Comprehensive guide to consistency models in distributed systems, covering strong/eventual/causal consistency, CAP theorem, conflict resolution, and consistency trade-offs for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "consistency-model",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "consistency",
          "cap-theorem",
          "distributed-systems",
          "eventual-consistency",
          "strong-consistency",
        ],
        relatedTopics: [
          "high-availability",
          "latency-slas",
          "fault-tolerance-resilience",
          "database-selection",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/consistency-model"),
    },
  "non-functional-requirements/backend-non-functional-requirements/throughput-capacity":
    {
      metadata: {
        id: "article-backend-nfr-throughput-capacity-extensive",
        title: "Throughput Capacity",
        description:
          "Comprehensive guide to backend throughput capacity, covering RPS planning, bottleneck identification, Little's Law, capacity planning, and scaling strategies for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "throughput-capacity",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "throughput",
          "capacity",
          "scaling",
          "performance",
          "bottleneck",
        ],
        relatedTopics: [
          "latency-slas",
          "scalability-strategy",
          "load-balancing",
          "auto-scaling",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/throughput-capacity"),
    },
  "non-functional-requirements/backend-non-functional-requirements/durability-guarantees":
    {
      metadata: {
        id: "article-backend-nfr-durability-guarantees-extensive",
        title: "Durability Guarantees",
        description:
          "Comprehensive guide to data durability guarantees, covering WAL, replication, backup strategies, RPO, fsync, and data persistence patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "durability-guarantees",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "durability",
          "wal",
          "replication",
          "backup",
          "data-persistence",
        ],
        relatedTopics: [
          "high-availability",
          "consistency-model",
          "disaster-recovery",
          "database-selection",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/durability-guarantees"),
    },
  "non-functional-requirements/backend-non-functional-requirements/database-selection-strategy":
    {
      metadata: {
        id: "article-backend-nfr-database-selection-extensive",
        title: "Database Selection Strategy",
        description:
          "Comprehensive guide to database selection, covering SQL vs NoSQL, consistency requirements, access patterns, polyglot persistence, and operational considerations for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "database-selection-strategy",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "database",
          "sql",
          "nosql",
          "data-modeling",
          "architecture",
        ],
        relatedTopics: [
          "consistency-model",
          "scalability-strategy",
          "durability-guarantees",
          "caching-strategies",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/database-selection-strategy"),
    },
  "non-functional-requirements/backend-non-functional-requirements/server-side-caching-strategy":
    {
      metadata: {
        id: "article-backend-nfr-server-side-caching-extensive",
        title: "Server-Side Caching Strategy",
        description:
          "Comprehensive guide to server-side caching, covering cache patterns, invalidation strategies, distributed caching, cache coherence, and production reliability for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "server-side-caching-strategy",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "caching",
          "redis",
          "memcached",
          "performance",
          "cache-invalidation",
        ],
        relatedTopics: [
          "caching-strategies",
          "distributed-caching",
          "cache-invalidation",
          "scalability-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/server-side-caching-strategy"),
    },
  "non-functional-requirements/backend-non-functional-requirements/disaster-recovery-strategy":
    {
      metadata: {
        id: "article-backend-nfr-disaster-recovery-extensive",
        title: "Disaster Recovery Strategy",
        description:
          "Comprehensive guide to disaster recovery, covering RTO/RPO, backup strategies, failover patterns, multi-region deployment, and business continuity planning for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "disaster-recovery-strategy",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "disaster-recovery",
          "business-continuity",
          "failover",
          "backup",
          "multi-region",
        ],
        relatedTopics: [
          "high-availability",
          "durability-guarantees",
          "fault-tolerance-resilience",
          "scalability-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/disaster-recovery-strategy"),
    },
  "non-functional-requirements/backend-non-functional-requirements/rate-limiting-abuse-protection":
    {
      metadata: {
        id: "article-backend-nfr-rate-limiting-abuse-protection-extensive",
        title: "Rate Limiting & Abuse Protection",
        description:
          "Comprehensive guide to rate limiting and abuse protection, covering algorithms (token bucket, sliding window), DDoS mitigation, bot detection, and production patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "rate-limiting-abuse-protection",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "rate-limiting",
          "security",
          "ddos",
          "abuse-protection",
          "throttling",
        ],
        relatedTopics: [
          "fault-tolerance-resilience",
          "scalability-strategy",
          "api-versioning",
          "load-balancing",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/rate-limiting-abuse-protection"),
    },
  "non-functional-requirements/backend-non-functional-requirements/secrets-management":
    {
      metadata: {
        id: "article-backend-nfr-secrets-management-extensive",
        title: "Secrets Management",
        description:
          "Comprehensive guide to secrets management, covering secret storage, rotation, encryption, vault integration, and security best practices for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "secrets-management",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "security",
          "secrets",
          "encryption",
          "vault",
          "key-management",
        ],
        relatedTopics: [
          "authentication-infrastructure",
          "authorization-model",
          "rate-limiting",
          "compliance-auditing",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/secrets-management"),
    },
  "non-functional-requirements/backend-non-functional-requirements/api-versioning":
    {
      metadata: {
        id: "article-backend-nfr-api-versioning-extensive",
        title: "API Versioning",
        description:
          "Comprehensive guide to API versioning strategies, covering URL vs header versioning, backward compatibility, deprecation policies, and migration patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "api-versioning",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "api",
          "versioning",
          "compatibility",
          "deprecation",
          "migration",
        ],
        relatedTopics: [
          "rate-limiting-abuse-protection",
          "scalability-strategy",
          "fault-tolerance-resilience",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/api-versioning"),
    },
  "non-functional-requirements/backend-non-functional-requirements/idempotency-guarantees":
    {
      metadata: {
        id: "article-backend-nfr-idempotency-guarantees-extensive",
        title: "Idempotency Guarantees",
        description:
          "Comprehensive guide to idempotency in distributed systems, covering idempotent APIs, deduplication, retry safety, and implementation patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "idempotency-guarantees",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "idempotency",
          "distributed-systems",
          "retry",
          "api-design",
          "consistency",
        ],
        relatedTopics: [
          "fault-tolerance-resilience",
          "consistency-model",
          "api-versioning",
          "durability-guarantees",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/idempotency-guarantees"),
    },
  "non-functional-requirements/backend-non-functional-requirements/backpressure-handling":
    {
      metadata: {
        id: "article-backend-nfr-backpressure-handling-extensive",
        title: "Backpressure Handling",
        description:
          "Comprehensive guide to backpressure in distributed systems, covering flow control, queue management, load shedding, and reactive patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "backpressure-handling",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "backpressure",
          "flow-control",
          "queues",
          "load-shedding",
          "resilience",
        ],
        relatedTopics: [
          "fault-tolerance-resilience",
          "throughput-capacity",
          "rate-limiting-abuse-protection",
          "scalability-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/backpressure-handling"),
    },
  "non-functional-requirements/backend-non-functional-requirements/authentication-infrastructure":
    {
      metadata: {
        id: "article-backend-nfr-authentication-infrastructure-extensive",
        title: "Authentication Infrastructure",
        description:
          "Comprehensive guide to authentication infrastructure, covering OAuth 2.0, OIDC, SAML, JWT, session management, MFA, and production patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "authentication-infrastructure",
        wordCount: 11000,
        readingTime: 44,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "authentication",
          "oauth",
          "oidc",
          "jwt",
          "session",
          "mfa",
          "security",
        ],
        relatedTopics: [
          "authorization-model",
          "secrets-management",
          "rate-limiting-abuse-protection",
          "api-versioning",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/authentication-infrastructure"),
    },
  "non-functional-requirements/backend-non-functional-requirements/authorization-model":
    {
      metadata: {
        id: "article-backend-nfr-authorization-model-extensive",
        title: "Authorization Model",
        description:
          "Comprehensive guide to authorization models, covering RBAC, ABAC, ACL, policy-based authorization, and production patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "authorization-model",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "authorization",
          "rbac",
          "abac",
          "acl",
          "security",
          "access-control",
        ],
        relatedTopics: [
          "authentication-infrastructure",
          "secrets-management",
          "compliance-auditing",
          "api-versioning",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/authorization-model"),
    },
  "non-functional-requirements/backend-non-functional-requirements/centralized-logging":
    {
      metadata: {
        id: "article-backend-nfr-centralized-logging-extensive",
        title: "Centralized Logging",
        description:
          "Comprehensive guide to centralized logging, covering log aggregation, structured logging, ELK stack, log retention, and production observability patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "centralized-logging",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "logging",
          "observability",
          "elk",
          "structured-logging",
          "monitoring",
        ],
        relatedTopics: [
          "metrics-distributed-tracing",
          "fault-tolerance-resilience",
          "compliance-auditing",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/centralized-logging"),
    },
  "non-functional-requirements/backend-non-functional-requirements/metrics-distributed-tracing":
    {
      metadata: {
        id: "article-backend-nfr-metrics-distributed-tracing-extensive",
        title: "Metrics & Distributed Tracing",
        description:
          "Comprehensive guide to metrics and distributed tracing, covering Prometheus, OpenTelemetry, tracing propagation, and production observability for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "metrics-distributed-tracing",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "metrics",
          "tracing",
          "observability",
          "prometheus",
          "opentelemetry",
          "monitoring",
        ],
        relatedTopics: [
          "centralized-logging",
          "fault-tolerance-resilience",
          "latency-slas",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/metrics-distributed-tracing"),
    },
  "non-functional-requirements/backend-non-functional-requirements/capacity-planning":
    {
      metadata: {
        id: "article-backend-nfr-capacity-planning-extensive",
        title: "Capacity Planning",
        description:
          "Comprehensive guide to capacity planning, covering demand forecasting, resource sizing, growth planning, and production capacity management for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "capacity-planning",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "capacity-planning",
          "scaling",
          "forecasting",
          "infrastructure",
          "cost-optimization",
        ],
        relatedTopics: [
          "throughput-capacity",
          "scalability-strategy",
          "cost-optimization",
          "auto-scaling",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/capacity-planning"),
    },
  "non-functional-requirements/backend-non-functional-requirements/compliance-auditing":
    {
      metadata: {
        id: "article-backend-nfr-compliance-auditing-extensive",
        title: "Compliance & Auditing",
        description:
          "Comprehensive guide to compliance and auditing, covering GDPR, HIPAA, SOC 2, PCI DSS, audit trails, and compliance implementation patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "compliance-auditing",
        wordCount: 10000,
        readingTime: 40,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "compliance",
          "auditing",
          "gdpr",
          "hipaa",
          "soc2",
          "security",
        ],
        relatedTopics: [
          "secrets-management",
          "authorization-model",
          "centralized-logging",
          "data-retention",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/compliance-auditing"),
    },
  "non-functional-requirements/backend-non-functional-requirements/data-retention-archival":
    {
      metadata: {
        id: "article-backend-nfr-data-retention-archival-extensive",
        title: "Data Retention & Archival",
        description:
          "Comprehensive guide to data retention and archival, covering retention policies, storage tiers, compliance requirements, and data lifecycle management for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "data-retention-archival",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "data-retention",
          "archival",
          "storage",
          "compliance",
          "lifecycle",
        ],
        relatedTopics: [
          "compliance-auditing",
          "durability-guarantees",
          "cost-optimization",
          "database-selection",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/data-retention-archival"),
    },
  "non-functional-requirements/backend-non-functional-requirements/multi-region-replication":
    {
      metadata: {
        id: "article-backend-nfr-multi-region-replication-extensive",
        title: "Multi-Region Replication",
        description:
          "Comprehensive guide to multi-region replication, covering active-active, active-passive, conflict resolution, latency considerations, and global distribution patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "multi-region-replication",
        wordCount: 10500,
        readingTime: 42,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "multi-region",
          "replication",
          "global",
          "distributed-systems",
          "latency",
        ],
        relatedTopics: [
          "high-availability",
          "consistency-model",
          "disaster-recovery",
          "scalability-strategy",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/multi-region-replication"),
    },
  "non-functional-requirements/backend-non-functional-requirements/cost-optimization":
    {
      metadata: {
        id: "article-backend-nfr-cost-optimization-extensive",
        title: "Cost Optimization",
        description:
          "Comprehensive guide to infrastructure cost optimization, covering cloud cost management, resource right-sizing, reserved capacity, and FinOps practices for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "cost-optimization",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "cost-optimization",
          "cloud",
          "finops",
          "infrastructure",
          "efficiency",
        ],
        relatedTopics: [
          "capacity-planning",
          "scalability-strategy",
          "auto-scaling",
          "data-retention-archival",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/cost-optimization"),
    },
  "non-functional-requirements/backend-non-functional-requirements/schema-governance":
    {
      metadata: {
        id: "article-backend-nfr-schema-governance-extensive",
        title: "Schema Governance",
        description:
          "Comprehensive guide to schema governance, covering schema evolution, backward compatibility, schema registry, and database migration patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "schema-governance",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "schema",
          "governance",
          "evolution",
          "compatibility",
          "migration",
        ],
        relatedTopics: [
          "api-versioning",
          "database-selection",
          "data-migration",
          "consistency-model",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/schema-governance"),
    },
  "non-functional-requirements/backend-non-functional-requirements/data-migration-strategy":
    {
      metadata: {
        id: "article-backend-nfr-data-migration-strategy-extensive",
        title: "Data Migration Strategy",
        description:
          "Comprehensive guide to zero-downtime data migrations, covering expand-contract pattern, dual writes, schema evolution, and production migration patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "data-migration-strategy",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "data-migration",
          "schema",
          "zero-downtime",
          "database",
          "deployment",
        ],
        relatedTopics: [
          "schema-governance",
          "api-versioning",
          "database-selection",
          "disaster-recovery",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/data-migration-strategy"),
    },
  "non-functional-requirements/backend-non-functional-requirements/cicd-pipelines":
    {
      metadata: {
        id: "article-backend-nfr-cicd-pipelines-extensive",
        title: "CI/CD Pipelines",
        description:
          "Comprehensive guide to CI/CD pipelines, covering deployment automation, testing strategies, rollback mechanisms, and production deployment patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "cicd-pipelines",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "ci-cd",
          "deployment",
          "automation",
          "testing",
          "devops",
        ],
        relatedTopics: [
          "api-versioning",
          "schema-governance",
          "monitoring-observability",
          "disaster-recovery",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/cicd-pipelines"),
    },
  "non-functional-requirements/backend-non-functional-requirements/event-replayability":
    {
      metadata: {
        id: "article-backend-nfr-event-replayability-extensive",
        title: "Event Replayability",
        description:
          "Comprehensive guide to event replayability, covering event sourcing, state reconstruction, snapshots, and production patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "event-replayability",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "event-sourcing",
          "replay",
          "event-store",
          "state-reconstruction",
        ],
        relatedTopics: [
          "consistency-model",
          "schema-governance",
          "data-migration",
          "message-ordering",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/event-replayability"),
    },
  "non-functional-requirements/backend-non-functional-requirements/message-ordering-guarantees":
    {
      metadata: {
        id: "article-backend-nfr-message-ordering-guarantees-extensive",
        title: "Message Ordering Guarantees",
        description:
          "Comprehensive guide to message ordering in distributed systems, covering partition ordering, causal ordering, sequence numbers, and reordering patterns for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "message-ordering-guarantees",
        wordCount: 9000,
        readingTime: 36,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "message-ordering",
          "kafka",
          "partitions",
          "distributed-systems",
          "messaging",
        ],
        relatedTopics: [
          "consistency-model",
          "event-replayability",
          "multi-region-replication",
          "backpressure-handling",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/message-ordering-guarantees"),
    },
  "non-functional-requirements/backend-non-functional-requirements/traffic-management-load-shedding":
    {
      metadata: {
        id: "article-backend-nfr-traffic-management-load-shedding-extensive",
        title: "Traffic Management / Load Shedding",
        description:
          "Comprehensive guide to traffic management and load shedding, covering overload protection, request prioritization, rate limiting, and graceful degradation for staff/principal engineer interviews.",
        category: "backend",
        subcategory: "nfr",
        slug: "traffic-management-load-shedding",
        wordCount: 9500,
        readingTime: 38,
        lastUpdated: "2026-03-16",
        tags: [
          "backend",
          "nfr",
          "traffic-management",
          "load-shedding",
          "overload",
          "rate-limiting",
          "resilience",
        ],
        relatedTopics: [
          "rate-limiting-abuse-protection",
          "backpressure-handling",
          "fault-tolerance-resilience",
          "capacity-planning",
        ],
      },
      loader: () =>
        import("./articles/requirements/nfr/backend-nfr/traffic-management-load-shedding"),
    },

  // ============================================================
  // FUNCTIONAL REQUIREMENTS - IDENTITY & ACCESS
  // ============================================================

  // Frontend - Identity & Access
  "functional-requirements/identity-access/signup-interface": {
    metadata: {
      id: "article-requirements-ia-frontend-signup-interface",
      title: "Signup Interface",
      description:
        "Comprehensive guide to designing signup interfaces covering form design, validation, progressive profiling, bot prevention, and conversion optimization.",
      category: "functional-requirements",
      subcategory: "identity-access",
      slug: "signup-interface",
      wordCount: 8000,
      readingTime: 32,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "signup",
        "registration",
        "frontend",
      ],
      relatedTopics: [
        "login-interface",
        "email-verification",
        "password-reset",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/signup-interface"),
  },
  "functional-requirements/identity-access/login-interface": {
    metadata: {
      id: "article-requirements-ia-frontend-login-interface",
      title: "Login Interface",
      description:
        "Comprehensive guide to designing login interfaces covering authentication flows, security patterns, session management, and UX best practices.",
      category: "functional-requirements",
      subcategory: "identity-access",
      slug: "login-interface",
      wordCount: 8000,
      readingTime: 32,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "login",
        "authentication",
        "frontend",
      ],
      relatedTopics: ["signup-interface", "logout", "password-reset"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/login-interface"),
  },
  "functional-requirements/identity-access/logout": {
    metadata: {
      id: "article-requirements-ia-frontend-logout",
      title: "Logout",
      description:
        "Comprehensive guide to implementing logout functionality covering session termination, token invalidation, multi-device logout, and security considerations.",
      category: "functional-requirements",
      subcategory: "identity-access",
      slug: "logout",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "logout",
        "session",
        "security",
      ],
      relatedTopics: [
        "login-interface",
        "session-persistence",
        "device-session-management",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/logout"),
  },
  "functional-requirements/identity-access/password-reset": {
    metadata: {
      id: "article-requirements-ia-frontend-password-reset",
      title: "Password Reset",
      description:
        "Comprehensive guide to implementing password reset flows covering token generation, email delivery, security patterns, and account recovery.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "password-reset",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "password-reset",
        "account-recovery",
      ],
      relatedTopics: [
        "login-interface",
        "account-recovery",
        "email-verification",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/password-reset"),
  },
  "functional-requirements/identity-access/email-verification": {
    metadata: {
      id: "article-requirements-ia-frontend-email-verification",
      title: "Email Verification",
      description:
        "Comprehensive guide to implementing email verification covering token generation, verification flows, resend mechanisms, and security patterns.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "email-verification",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "email-verification",
        "account-security",
      ],
      relatedTopics: [
        "signup-interface",
        "phone-verification",
        "password-reset",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/email-verification"),
  },
  "functional-requirements/identity-access/phone-verification": {
    metadata: {
      id: "article-requirements-ia-frontend-phone-verification",
      title: "Phone Verification",
      description:
        "Comprehensive guide to implementing phone verification covering SMS OTP, voice calls, WhatsApp verification, rate limiting, and global considerations.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "phone-verification",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "phone-verification",
        "sms",
        "otp",
      ],
      relatedTopics: ["email-verification", "mfa-setup", "signup-interface"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/phone-verification"),
  },
  "functional-requirements/identity-access/mfa-setup": {
    metadata: {
      id: "article-requirements-ia-frontend-mfa-setup",
      title: "Multi-Factor Authentication Setup",
      description:
        "Comprehensive guide to implementing MFA enrollment flows covering TOTP apps, SMS, WebAuthn, backup codes, and recovery options.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "mfa-setup",
      wordCount: 8000,
      readingTime: 32,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "mfa",
        "2fa",
        "authentication",
        "security",
      ],
      relatedTopics: [
        "login-interface",
        "phone-verification",
        "security-settings",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/mfa-setup"),
  },
  "functional-requirements/identity-access/social-login-options": {
    metadata: {
      id: "article-requirements-ia-frontend-social-login-options",
      title: "Social Login Options",
      description:
        "Comprehensive guide to implementing social login covering OAuth providers, button design, account linking, and conversion optimization.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "social-login-options",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "social-login",
        "oauth",
        "frontend",
      ],
      relatedTopics: ["oauth-providers", "signup-interface", "login-interface"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/social-login-options"),
  },
  "functional-requirements/identity-access/session-persistence": {
    metadata: {
      id: "article-requirements-ia-frontend-session-persistence",
      title: "Session Persistence",
      description:
        "Comprehensive guide to implementing session persistence covering token storage, refresh strategies, remember me functionality, and cross-tab sync.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "session-persistence",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "session",
        "persistence",
        "tokens",
      ],
      relatedTopics: ["login-interface", "logout", "token-generation"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/session-persistence"),
  },
  "functional-requirements/identity-access/device-session-management-ui": {
    metadata: {
      id: "article-requirements-ia-frontend-device-session-management-ui",
      title: "Device/Session Management UI",
      description:
        "Comprehensive guide to implementing device and session management interfaces covering active session display, remote logout, and security alerts.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "device-session-management-ui",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "session-management",
        "device-management",
      ],
      relatedTopics: ["session-persistence", "logout", "security-settings"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/device-session-management-ui"),
  },
  "functional-requirements/identity-access/profile-settings-ui": {
    metadata: {
      id: "article-requirements-ia-frontend-profile-settings-ui",
      title: "Profile Settings UI",
      description:
        "Comprehensive guide to implementing profile settings interfaces covering editable fields, validation, optimistic updates, and avatar management.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "profile-settings-ui",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "profile",
        "settings",
        "frontend",
      ],
      relatedTopics: ["account-settings-ui", "security-settings"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/profile-settings-ui"),
  },
  "functional-requirements/identity-access/account-settings-ui": {
    metadata: {
      id: "article-requirements-ia-frontend-account-settings-ui",
      title: "Account Settings UI",
      description:
        "Comprehensive guide to implementing account settings interfaces covering email changes, account deletion, data export, and GDPR compliance.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "account-settings-ui",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "account-settings",
        "gdpr",
        "security",
      ],
      relatedTopics: [
        "profile-settings-ui",
        "security-settings",
        "password-reset",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/account-settings-ui"),
  },
  "functional-requirements/identity-access/account-recovery-ui": {
    metadata: {
      id: "article-requirements-ia-frontend-account-recovery-ui",
      title: "Account Recovery UI",
      description:
        "Comprehensive guide to implementing account recovery interfaces covering recovery options, identity verification, and multi-step flows.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "account-recovery-ui",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "account-recovery",
        "security",
        "verification",
      ],
      relatedTopics: ["password-reset", "phone-verification", "mfa-setup"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/account-recovery-ui"),
  },
  "functional-requirements/identity-access/security-settings-ui": {
    metadata: {
      id: "article-requirements-ia-frontend-security-settings-ui",
      title: "Security Settings UI",
      description:
        "Comprehensive guide to implementing security settings interfaces covering MFA management, session review, security alerts, and login history.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "security-settings-ui",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "security-settings",
        "mfa",
        "sessions",
      ],
      relatedTopics: [
        "mfa-setup",
        "device-session-management",
        "account-settings",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/frontend/security-settings-ui"),
  },

  // Backend - Identity & Access
  "functional-requirements/identity-access/user-registration-service": {
    metadata: {
      id: "article-requirements-ia-backend-user-registration",
      title: "User Registration Service",
      description:
        "Comprehensive guide to building user registration services covering account creation, validation, email verification, and fraud prevention.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "user-registration-service",
      wordCount: 8000,
      readingTime: 32,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "registration",
        "backend",
      ],
      relatedTopics: [
        "authentication-service",
        "email-verification",
        "password-hashing",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/user-registration-service"),
  },
  "functional-requirements/identity-access/authentication-service": {
    metadata: {
      id: "article-requirements-ia-backend-authentication-service",
      title: "Authentication Service",
      description:
        "Comprehensive guide to building authentication services covering credential validation, token issuance, session management, and security patterns.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "authentication-service",
      wordCount: 9000,
      readingTime: 36,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "authentication",
        "backend",
        "security",
      ],
      relatedTopics: [
        "token-generation",
        "session-management",
        "password-hashing",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/authentication-service"),
  },
  "functional-requirements/identity-access/token-generation": {
    metadata: {
      id: "article-requirements-ia-backend-token-generation",
      title: "Token Generation",
      description:
        "Comprehensive guide to implementing token generation covering JWT structure, signing algorithms, refresh tokens, and token rotation.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "token-generation",
      wordCount: 8000,
      readingTime: 32,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "tokens",
        "jwt",
        "backend",
        "security",
      ],
      relatedTopics: [
        "authentication-service",
        "session-management",
        "oauth-providers",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/token-generation"),
  },
  "functional-requirements/identity-access/session-management": {
    metadata: {
      id: "article-requirements-ia-backend-session-management",
      title: "Session Management",
      description:
        "Comprehensive guide to implementing session management covering session storage, lifecycle, timeout strategies, and distributed sessions.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "session-management",
      wordCount: 7500,
      readingTime: 30,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "session",
        "backend",
        "security",
        "redis",
      ],
      relatedTopics: [
        "token-generation",
        "authentication-service",
        "device-session-tracking",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/session-management"),
  },
  "functional-requirements/identity-access/device-session-tracking": {
    metadata: {
      id: "article-requirements-ia-backend-device-session-tracking",
      title: "Device Session Tracking",
      description:
        "Guide to implementing device session tracking covering device fingerprinting, session metadata, and tracking patterns.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "device-session-tracking",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "device-tracking",
        "sessions",
        "backend",
      ],
      relatedTopics: ["session-management", "security-audit-logging"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/device-session-tracking"),
  },
  "functional-requirements/identity-access/password-hashing-and-validation": {
    metadata: {
      id: "article-requirements-ia-backend-password-hashing",
      title: "Password Hashing and Validation",
      description:
        "Comprehensive guide to implementing password hashing covering algorithms (bcrypt, argon2), salting, validation patterns, and breach detection.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "password-hashing-and-validation",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "password",
        "hashing",
        "security",
        "backend",
      ],
      relatedTopics: [
        "user-registration-service",
        "authentication-service",
        "credential-rotation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/password-hashing-and-validation"),
  },
  "functional-requirements/identity-access/rbac": {
    metadata: {
      id: "article-requirements-ia-backend-rbac",
      title: "Role-Based Access Control (RBAC)",
      description:
        "Comprehensive guide to implementing RBAC covering role hierarchies, permission models, assignment patterns, and scaling.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "rbac",
      wordCount: 7500,
      readingTime: 30,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "rbac",
        "authorization",
        "backend",
      ],
      relatedTopics: ["permission-validation", "access-control-policies"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/rbac"),
  },
  "functional-requirements/identity-access/permission-validation": {
    metadata: {
      id: "article-requirements-ia-backend-permission-validation",
      title: "Permission Validation",
      description:
        "Guide to implementing permission validation covering authorization checks, middleware patterns, and resource-level permissions.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "permission-validation",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "permissions",
        "authorization",
        "backend",
      ],
      relatedTopics: ["rbac", "access-control-policies"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/permission-validation"),
  },
  "functional-requirements/identity-access/account-verification": {
    metadata: {
      id: "article-requirements-ia-backend-account-verification",
      title: "Account Verification",
      description:
        "Guide to implementing account verification covering email verification, phone verification, and manual review workflows.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "account-verification",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "verification",
        "account",
        "backend",
      ],
      relatedTopics: [
        "email-verification",
        "phone-verification",
        "user-registration-service",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/account-verification"),
  },
  "functional-requirements/identity-access/login-attempt-tracking": {
    metadata: {
      id: "article-requirements-ia-backend-login-attempt-tracking",
      title: "Login Attempt Tracking",
      description:
        "Guide to implementing login attempt tracking covering failed attempt logging, rate limiting, and fraud detection.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "login-attempt-tracking",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "login-tracking",
        "security",
        "backend",
      ],
      relatedTopics: [
        "account-lockout",
        "authentication-service",
        "security-audit-logging",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/login-attempt-tracking"),
  },
  "functional-requirements/identity-access/account-lockout": {
    metadata: {
      id: "article-requirements-ia-backend-account-lockout",
      title: "Account Lockout",
      description:
        "Guide to implementing account lockout covering threshold configuration, lockout duration, and unlock mechanisms.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "account-lockout",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "account-lockout",
        "security",
        "backend",
      ],
      relatedTopics: [
        "login-attempt-tracking",
        "authentication-service",
        "account-recovery",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/account-lockout"),
  },
  "functional-requirements/identity-access/session-revocation": {
    metadata: {
      id: "article-requirements-ia-backend-session-revocation",
      title: "Session Revocation",
      description:
        "Guide to implementing session revocation covering token invalidation, logout all devices, and distributed session management.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "session-revocation",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "session-revocation",
        "logout",
        "backend",
      ],
      relatedTopics: ["session-management", "token-generation", "logout"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/session-revocation"),
  },
  "functional-requirements/identity-access/credential-rotation": {
    metadata: {
      id: "article-requirements-ia-backend-credential-rotation",
      title: "Credential Rotation",
      description:
        "Guide to implementing credential rotation covering password changes, token rotation, key rotation, and security best practices.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "credential-rotation",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "credential-rotation",
        "security",
        "backend",
      ],
      relatedTopics: [
        "password-hashing",
        "token-generation",
        "session-revocation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/credential-rotation"),
  },
  "functional-requirements/identity-access/security-audit-logging": {
    metadata: {
      id: "article-requirements-ia-backend-security-audit-logging",
      title: "Security Audit Logging",
      description:
        "Comprehensive guide to implementing security audit logging covering event schemas, immutable storage, and compliance requirements.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "security-audit-logging",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "audit-logging",
        "security",
        "compliance",
        "backend",
      ],
      relatedTopics: [
        "authentication-service",
        "account-settings",
        "admin-moderation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/backend/security-audit-logging"),
  },

  // Other - Identity & Access
  "functional-requirements/identity-access/oauth-providers": {
    metadata: {
      id: "article-requirements-ia-other-oauth-providers",
      title: "OAuth Providers",
      description:
        "Comprehensive guide to integrating OAuth providers covering Google, Facebook, Apple, GitHub, token exchange, and account linking.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "oauth-providers",
      wordCount: 8500,
      readingTime: 34,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "oauth",
        "sso",
        "social-login",
        "integration",
      ],
      relatedTopics: [
        "sso-integrations",
        "identity-providers",
        "authentication-service",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/other/oauth-providers"),
  },
  "functional-requirements/identity-access/sso-integrations": {
    metadata: {
      id: "article-requirements-ia-other-sso-integrations",
      title: "SSO Integrations",
      description:
        "Comprehensive guide to implementing Single Sign-On covering SAML, OIDC, enterprise integration, and identity providers.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "sso-integrations",
      wordCount: 7500,
      readingTime: 30,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "sso",
        "saml",
        "oidc",
        "enterprise",
      ],
      relatedTopics: [
        "oauth-providers",
        "identity-providers",
        "authentication-service",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/other/sso-integrations"),
  },
  "functional-requirements/identity-access/identity-providers": {
    metadata: {
      id: "article-requirements-ia-other-identity-providers",
      title: "Identity Providers",
      description:
        "Guide to integrating with identity providers covering Okta, Azure AD, OneLogin, configuration, and enterprise SSO patterns.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "identity-providers",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "idp",
        "enterprise",
        "sso",
      ],
      relatedTopics: [
        "sso-integrations",
        "oauth-providers",
        "access-control-policies",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/other/identity-providers"),
  },
  "functional-requirements/identity-access/access-control-policies": {
    metadata: {
      id: "article-requirements-ia-other-access-control-policies",
      title: "Access Control Policies",
      description:
        "Guide to implementing access control policies covering policy definition, evaluation engines, ABAC, and policy management.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "access-control-policies",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "access-control",
        "policies",
        "abac",
      ],
      relatedTopics: ["rbac", "permission-validation", "sso-integrations"],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/other/access-control-policies"),
  },
  "functional-requirements/identity-access/authentication-audit-logs": {
    metadata: {
      id: "article-requirements-ia-other-authentication-audit-logs",
      title: "Authentication Audit Logs",
      description:
        "Guide to implementing authentication audit logs covering log schema, storage, compliance, and analysis patterns.",
      category: "requirements",
      subcategory: "identity-access",
      slug: "authentication-audit-logs",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "identity",
        "audit-logs",
        "authentication",
        "compliance",
      ],
      relatedTopics: [
        "security-audit-logging",
        "login-attempt-tracking",
        "admin-moderation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/identity-access/other/authentication-audit-logs"),
  },

  // ============================================================
  // FUNCTIONAL REQUIREMENTS - CONTENT MANAGEMENT
  // ============================================================

  // Frontend - Content Management
  "functional-requirements/content-management/create-content-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-create-content",
      title: "Create Content UI",
      description:
        "Guide to implementing content creation interfaces covering editors, media upload, drafts, and content validation.",
      category: "requirements",
      subcategory: "content-management",
      slug: "create-content-ui",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "create",
        "frontend",
        "editor",
      ],
      relatedTopics: ["edit-content-ui", "rich-text-editor", "media-upload"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/create-content-ui"),
  },
  "functional-requirements/content-management/edit-content-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-edit-content",
      title: "Edit Content UI",
      description:
        "Guide to implementing content editing interfaces covering version control, change tracking, and collaborative editing.",
      category: "requirements",
      subcategory: "content-management",
      slug: "edit-content-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "edit", "frontend"],
      relatedTopics: [
        "create-content-ui",
        "versioning",
        "collaborative-editing",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/edit-content-ui"),
  },
  "functional-requirements/content-management/delete-content-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-delete-content",
      title: "Delete Content UI",
      description:
        "Guide to implementing content deletion covering soft delete, confirmation flows, and recovery options.",
      category: "requirements",
      subcategory: "content-management",
      slug: "delete-content-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "delete", "frontend"],
      relatedTopics: ["soft-delete", "content-lifecycle", "account-settings"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/delete-content-ui"),
  },
  "functional-requirements/content-management/rich-text-editor": {
    metadata: {
      id: "article-requirements-cm-frontend-rich-text-editor",
      title: "Rich Text Editor",
      description:
        "Guide to implementing rich text editors covering WYSIWYG, markdown, collaboration features, and accessibility.",
      category: "requirements",
      subcategory: "content-management",
      slug: "rich-text-editor",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "editor",
        "rich-text",
        "frontend",
      ],
      relatedTopics: ["create-content-ui", "edit-content-ui", "media-upload"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/rich-text-editor"),
  },
  "functional-requirements/content-management/media-upload": {
    metadata: {
      id: "article-requirements-cm-frontend-media-upload",
      title: "Media Upload",
      description:
        "Guide to implementing media upload covering drag-drop, progress indicators, validation, and image optimization.",
      category: "requirements",
      subcategory: "content-management",
      slug: "media-upload",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "media",
        "upload",
        "frontend",
      ],
      relatedTopics: [
        "create-content-ui",
        "file-attachments",
        "image-optimization",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/media-upload"),
  },
  "functional-requirements/content-management/draft-saving": {
    metadata: {
      id: "article-requirements-cm-frontend-draft-saving",
      title: "Draft Saving",
      description:
        "Guide to implementing draft saving covering auto-save, local storage, sync, and version management.",
      category: "requirements",
      subcategory: "content-management",
      slug: "draft-saving",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "drafts",
        "auto-save",
        "frontend",
      ],
      relatedTopics: [
        "create-content-ui",
        "content-versioning",
        "offline-support",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/draft-saving"),
  },
  "functional-requirements/content-management/content-scheduling-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-content-scheduling",
      title: "Content Scheduling UI",
      description:
        "Guide to implementing content scheduling covering calendar picker, timezone handling, and scheduled publishing.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-scheduling-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "scheduling",
        "publishing",
        "frontend",
      ],
      relatedTopics: [
        "publishing-workflow",
        "content-lifecycle",
        "notifications",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/content-scheduling-ui"),
  },
  "functional-requirements/content-management/content-tagging-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-content-tagging",
      title: "Content Tagging UI",
      description:
        "Guide to implementing content tagging covering tag input, autocomplete, hierarchies, and tag management.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-tagging-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "tagging",
        "categorization",
        "frontend",
      ],
      relatedTopics: ["content-categorization", "search", "discovery"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/content-tagging-ui"),
  },
  "functional-requirements/content-management/content-sharing-interface": {
    metadata: {
      id: "article-requirements-cm-frontend-content-sharing",
      title: "Content Sharing Interface",
      description:
        "Guide to implementing content sharing covering social sharing, link generation, embed codes, and sharing analytics.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-sharing-interface",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "sharing",
        "social",
        "frontend",
      ],
      relatedTopics: ["social-sharing", "discovery", "analytics"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/content-sharing-interface"),
  },
  "functional-requirements/content-management/content-categorization-ui": {
    metadata: {
      id: "article-requirements-cm-frontend-content-categorization",
      title: "Content Categorization UI",
      description:
        "Guide to implementing content categorization covering category selection, hierarchies, and multi-category assignment.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-categorization-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "categorization",
        "taxonomy",
        "frontend",
      ],
      relatedTopics: ["content-tagging", "discovery", "navigation"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/content-categorization-ui"),
  },
  "functional-requirements/content-management/file-attachments": {
    metadata: {
      id: "article-requirements-cm-frontend-file-attachments",
      title: "File Attachments",
      description:
        "Guide to implementing file attachments covering upload, download, versioning, and access control.",
      category: "requirements",
      subcategory: "content-management",
      slug: "file-attachments",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "attachments",
        "files",
        "frontend",
      ],
      relatedTopics: ["media-upload", "content-storage", "access-control"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/file-attachments"),
  },
  "functional-requirements/content-management/content-preview": {
    metadata: {
      id: "article-requirements-cm-frontend-content-preview",
      title: "Content Preview",
      description:
        "Guide to implementing content preview covering live preview, responsive preview, and preview modes.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-preview",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "preview", "frontend"],
      relatedTopics: [
        "create-content-ui",
        "edit-content-ui",
        "responsive-design",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/content-preview"),
  },
  "functional-requirements/content-management/view-content-pages": {
    metadata: {
      id: "article-requirements-cm-frontend-view-content",
      title: "View Content Pages",
      description:
        "Guide to implementing content viewing covering rendering, pagination, related content, and engagement features.",
      category: "requirements",
      subcategory: "content-management",
      slug: "view-content-pages",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "view",
        "rendering",
        "frontend",
      ],
      relatedTopics: ["discovery", "interaction-engagement", "seo"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/frontend/view-content-pages"),
  },

  // Backend - Content Management
  "functional-requirements/content-management/crud-apis": {
    metadata: {
      id: "article-requirements-cm-backend-crud-apis",
      title: "CRUD APIs",
      description:
        "Guide to implementing CRUD APIs for content covering REST design, validation, authorization, and scaling patterns.",
      category: "requirements",
      subcategory: "content-management",
      slug: "crud-apis",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "crud", "api", "backend"],
      relatedTopics: [
        "content-storage",
        "content-validation",
        "permission-validation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/crud-apis"),
  },
  "functional-requirements/content-management/content-versioning": {
    metadata: {
      id: "article-requirements-cm-backend-content-versioning",
      title: "Content Versioning",
      description:
        "Guide to implementing content versioning covering snapshot vs diff, version history, and rollback patterns.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-versioning",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "versioning",
        "history",
        "backend",
      ],
      relatedTopics: ["draft-saving", "edit-content-ui", "content-lifecycle"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/content-versioning"),
  },
  "functional-requirements/content-management/publishing-workflow": {
    metadata: {
      id: "article-requirements-cm-backend-publishing-workflow",
      title: "Publishing Workflow",
      description:
        "Guide to implementing publishing workflows covering content states, approval chains, and scheduled publishing.",
      category: "requirements",
      subcategory: "content-management",
      slug: "publishing-workflow",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "publishing",
        "workflow",
        "backend",
      ],
      relatedTopics: [
        "content-scheduling",
        "content-moderation",
        "content-lifecycle",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/publishing-workflow"),
  },
  "functional-requirements/content-management/content-moderation": {
    metadata: {
      id: "article-requirements-cm-backend-content-moderation",
      title: "Content Moderation",
      description:
        "Guide to implementing content moderation covering auto-moderation, human review, and policy enforcement.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-moderation",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "moderation",
        "safety",
        "backend",
      ],
      relatedTopics: [
        "publishing-workflow",
        "abuse-detection",
        "admin-moderation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/content-moderation"),
  },
  "functional-requirements/content-management/media-processing": {
    metadata: {
      id: "article-requirements-cm-backend-media-processing",
      title: "Media Processing",
      description:
        "Guide to implementing media processing covering image optimization, video transcoding, and thumbnail generation.",
      category: "requirements",
      subcategory: "content-management",
      slug: "media-processing",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "media",
        "processing",
        "backend",
      ],
      relatedTopics: ["media-upload", "cdn-delivery", "content-storage"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/media-processing"),
  },
  "functional-requirements/content-management/content-storage": {
    metadata: {
      id: "article-requirements-cm-backend-content-storage",
      title: "Content Storage",
      description:
        "Guide to implementing content storage covering database design, object storage, and content indexing.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-storage",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "storage",
        "database",
        "backend",
      ],
      relatedTopics: ["crud-apis", "media-processing", "search"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/content-storage"),
  },
  "functional-requirements/content-management/content-validation": {
    metadata: {
      id: "article-requirements-cm-backend-content-validation",
      title: "Content Validation",
      description:
        "Guide to implementing content validation covering input validation, policy enforcement, and quality checks.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-validation",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "validation",
        "quality",
        "backend",
      ],
      relatedTopics: ["crud-apis", "content-moderation", "spam-detection"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/content-validation"),
  },
  "functional-requirements/content-management/soft-delete": {
    metadata: {
      id: "article-requirements-cm-backend-soft-delete",
      title: "Soft Delete",
      description:
        "Guide to implementing soft delete covering deletion patterns, recovery, and data retention.",
      category: "requirements",
      subcategory: "content-management",
      slug: "soft-delete",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "soft-delete", "backend"],
      relatedTopics: ["content-lifecycle", "data-retention", "gdpr"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/soft-delete"),
  },
  "functional-requirements/content-management/content-lifecycle-management": {
    metadata: {
      id: "article-requirements-cm-backend-content-lifecycle",
      title: "Content Lifecycle Management",
      description:
        "Guide to implementing content lifecycle covering creation, publication, archival, and deletion stages.",
      category: "requirements",
      subcategory: "content-management",
      slug: "content-lifecycle-management",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "content", "lifecycle", "backend"],
      relatedTopics: [
        "publishing-workflow",
        "soft-delete",
        "content-moderation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/content-lifecycle-management"),
  },
  "functional-requirements/content-management/tagging-categorization-management":
    {
      metadata: {
        id: "article-requirements-cm-backend-tagging-management",
        title: "Tagging and Categorization Management",
        description:
          "Guide to implementing tag and category management covering taxonomy, governance, and bulk operations.",
        category: "requirements",
        subcategory: "content-management",
        slug: "tagging-categorization-management",
        wordCount: 5500,
        readingTime: 22,
        lastUpdated: "2026-03-16",
        tags: [
          "requirements",
          "functional",
          "content",
          "tagging",
          "categorization",
          "backend",
        ],
        relatedTopics: ["content-tagging", "content-categorization", "search"],
      },
      loader: () =>
        import("./articles/requirements/fr/content-management/backend/tagging-categorization-management"),
    },
  "functional-requirements/content-management/search-indexing": {
    metadata: {
      id: "article-requirements-cm-backend-search-indexing",
      title: "Search Indexing",
      description:
        "Guide to implementing search indexing covering index structure, incremental updates, and search optimization.",
      category: "requirements",
      subcategory: "content-management",
      slug: "search-indexing",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "search",
        "indexing",
        "backend",
      ],
      relatedTopics: ["discovery", "elasticsearch", "content-storage"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/backend/search-indexing"),
  },

  // Other - Content Management
  "functional-requirements/content-management/cdn-delivery": {
    metadata: {
      id: "article-requirements-cm-other-cdn-delivery",
      title: "CDN Delivery",
      description:
        "Guide to implementing CDN delivery covering caching strategies, invalidation, and edge optimization.",
      category: "requirements",
      subcategory: "content-management",
      slug: "cdn-delivery",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "cdn",
        "delivery",
        "caching",
      ],
      relatedTopics: ["media-processing", "content-storage", "performance"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/other/cdn-delivery"),
  },
  "functional-requirements/content-management/object-storage": {
    metadata: {
      id: "article-requirements-cm-other-object-storage",
      title: "Object Storage",
      description:
        "Guide to implementing object storage covering S3, GCS, Azure Blob, and storage patterns.",
      category: "requirements",
      subcategory: "content-management",
      slug: "object-storage",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "content",
        "storage",
        "s3",
        "backend",
      ],
      relatedTopics: ["media-processing", "cdn-delivery", "content-storage"],
    },
    loader: () =>
      import("./articles/requirements/fr/content-management/other/object-storage"),
  },

  // ============================================================
  // FUNCTIONAL REQUIREMENTS - DISCOVERY
  // ============================================================

  // Frontend - Discovery
  "functional-requirements/discovery/search-bar": {
    metadata: {
      id: "article-requirements-disc-frontend-search-bar",
      title: "Search Bar",
      description:
        "Guide to implementing search bars covering autocomplete, recent searches, and search suggestions.",
      category: "requirements",
      subcategory: "discovery",
      slug: "search-bar",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: ["requirements", "functional", "discovery", "search", "frontend"],
      relatedTopics: ["search-results", "autocomplete", "discovery"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/search-bar"),
  },
  "functional-requirements/discovery/search-results-ui": {
    metadata: {
      id: "article-requirements-disc-frontend-search-results",
      title: "Search Results UI",
      description:
        "Guide to implementing search results covering result display, pagination, and result highlighting.",
      category: "requirements",
      subcategory: "discovery",
      slug: "search-results-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "results",
        "frontend",
      ],
      relatedTopics: ["search-bar", "filters", "ranking"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/search-results-ui"),
  },
  "functional-requirements/discovery/filters-and-sorting": {
    metadata: {
      id: "article-requirements-disc-frontend-filters-sorting",
      title: "Filters and Sorting",
      description:
        "Guide to implementing search filters and sorting covering faceted search, sort options, and filter state management.",
      category: "requirements",
      subcategory: "discovery",
      slug: "filters-and-sorting",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "filters",
        "sorting",
        "frontend",
      ],
      relatedTopics: ["search-results", "faceted-search", "search"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/filters-and-sorting"),
  },
  "functional-requirements/discovery/feed-display": {
    metadata: {
      id: "article-requirements-disc-frontend-feed-display",
      title: "Feed Display",
      description:
        "Guide to implementing feed display covering chronological vs ranked feeds, infinite scroll, and feed sections.",
      category: "requirements",
      subcategory: "discovery",
      slug: "feed-display",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "feed",
        "timeline",
        "frontend",
      ],
      relatedTopics: ["feed-generation", "ranking", "infinite-scroll"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/feed-display"),
  },
  "functional-requirements/discovery/recommendation-carousel": {
    metadata: {
      id: "article-requirements-disc-frontend-recommendation-carousel",
      title: "Recommendation Carousel",
      description:
        "Guide to implementing recommendation carousels covering horizontal scroll, prefetching, and personalization.",
      category: "requirements",
      subcategory: "discovery",
      slug: "recommendation-carousel",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "recommendations",
        "carousel",
        "frontend",
      ],
      relatedTopics: [
        "recommendation-systems",
        "feed-display",
        "personalization",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/recommendation-carousel"),
  },
  "functional-requirements/discovery/trending-section": {
    metadata: {
      id: "article-requirements-disc-frontend-trending-section",
      title: "Trending Section",
      description:
        "Guide to implementing trending sections covering real-time trends, trend velocity, and geographic trends.",
      category: "requirements",
      subcategory: "discovery",
      slug: "trending-section",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "trending",
        "real-time",
        "frontend",
      ],
      relatedTopics: ["trending-computation", "feed-display", "discovery"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/trending-section"),
  },
  "functional-requirements/discovery/category-navigation": {
    metadata: {
      id: "article-requirements-disc-frontend-category-navigation",
      title: "Category Navigation",
      description:
        "Guide to implementing category navigation covering hierarchical navigation, breadcrumbs, and category browsing.",
      category: "requirements",
      subcategory: "discovery",
      slug: "category-navigation",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "navigation",
        "categories",
        "frontend",
      ],
      relatedTopics: ["content-categorization", "browsing", "discovery"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/category-navigation"),
  },
  "functional-requirements/discovery/infinite-scrolling": {
    metadata: {
      id: "article-requirements-disc-frontend-infinite-scroll",
      title: "Infinite Scrolling",
      description:
        "Guide to implementing infinite scroll covering pagination, loading states, and scroll position management.",
      category: "requirements",
      subcategory: "discovery",
      slug: "infinite-scrolling",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "infinite-scroll",
        "pagination",
        "frontend",
      ],
      relatedTopics: ["feed-display", "search-results", "performance"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/infinite-scrolling"),
  },
  "functional-requirements/discovery/related-content": {
    metadata: {
      id: "article-requirements-disc-frontend-related-content",
      title: "Related Content",
      description:
        "Guide to implementing related content recommendations covering similarity algorithms, placement, and personalization.",
      category: "requirements",
      subcategory: "discovery",
      slug: "related-content",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "related",
        "recommendations",
        "frontend",
      ],
      relatedTopics: ["recommendation-carousel", "discovery", "engagement"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/related-content"),
  },
  "functional-requirements/discovery/explore-page": {
    metadata: {
      id: "article-requirements-disc-frontend-explore-page",
      title: "Explore Page",
      description:
        "Guide to implementing explore pages covering discovery features, topic following, and curated collections.",
      category: "requirements",
      subcategory: "discovery",
      slug: "explore-page",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "explore",
        "browse",
        "frontend",
      ],
      relatedTopics: ["trending-section", "category-navigation", "discovery"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/frontend/explore-page"),
  },

  // Backend - Discovery
  "functional-requirements/discovery/search-indexing": {
    metadata: {
      id: "article-requirements-disc-backend-search-indexing",
      title: "Search Indexing",
      description:
        "Guide to implementing search indexing covering inverted indexes, analyzers, and incremental updates.",
      category: "requirements",
      subcategory: "discovery",
      slug: "search-indexing",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "indexing",
        "backend",
      ],
      relatedTopics: ["query-processing", "elasticsearch", "search-ranking"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/search-indexing"),
  },
  "functional-requirements/discovery/query-processing": {
    metadata: {
      id: "article-requirements-disc-backend-query-processing",
      title: "Query Processing",
      description:
        "Guide to implementing query processing covering parsing, expansion, spelling correction, and intent detection.",
      category: "requirements",
      subcategory: "discovery",
      slug: "query-processing",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "query",
        "backend",
      ],
      relatedTopics: ["search-indexing", "search-ranking", "autocomplete"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/query-processing"),
  },
  "functional-requirements/discovery/search-ranking": {
    metadata: {
      id: "article-requirements-disc-backend-search-ranking",
      title: "Search Ranking",
      description:
        "Guide to implementing search ranking covering relevance scoring, learning-to-rank, and ranking features.",
      category: "requirements",
      subcategory: "discovery",
      slug: "search-ranking",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "ranking",
        "backend",
      ],
      relatedTopics: [
        "query-processing",
        "recommendation-algorithms",
        "ml-ranking",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/search-ranking"),
  },
  "functional-requirements/discovery/faceted-search": {
    metadata: {
      id: "article-requirements-disc-backend-faceted-search",
      title: "Faceted Search",
      description:
        "Guide to implementing faceted search covering facet computation, filtering, and performance optimization.",
      category: "requirements",
      subcategory: "discovery",
      slug: "faceted-search",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "facets",
        "backend",
      ],
      relatedTopics: ["search-indexing", "filters", "search-ranking"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/faceted-search"),
  },
  "functional-requirements/discovery/feed-generation": {
    metadata: {
      id: "article-requirements-disc-backend-feed-generation",
      title: "Feed Generation",
      description:
        "Guide to implementing feed generation covering chronological feeds, ranked feeds, and fan-out patterns.",
      category: "requirements",
      subcategory: "discovery",
      slug: "feed-generation",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "feed",
        "generation",
        "backend",
      ],
      relatedTopics: ["feed-display", "ranking", "real-time-systems"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/feed-generation"),
  },
  "functional-requirements/discovery/recommendation-algorithms": {
    metadata: {
      id: "article-requirements-disc-backend-recommendation-algorithms",
      title: "Recommendation Algorithms",
      description:
        "Guide to implementing recommendation algorithms covering collaborative filtering, content-based, and hybrid approaches.",
      category: "requirements",
      subcategory: "discovery",
      slug: "recommendation-algorithms",
      wordCount: 7000,
      readingTime: 28,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "recommendations",
        "ml",
        "backend",
      ],
      relatedTopics: [
        "ml-ranking",
        "collaborative-filtering",
        "personalization",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/recommendation-algorithms"),
  },
  "functional-requirements/discovery/trending-computation": {
    metadata: {
      id: "article-requirements-disc-backend-trending-computation",
      title: "Trending Computation",
      description:
        "Guide to implementing trending computation covering velocity calculation, time windows, and geographic trends.",
      category: "requirements",
      subcategory: "discovery",
      slug: "trending-computation",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "trending",
        "real-time",
        "backend",
      ],
      relatedTopics: ["feed-generation", "stream-processing", "analytics"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/trending-computation"),
  },
  "functional-requirements/discovery/ranking-optimization": {
    metadata: {
      id: "article-requirements-disc-backend-ranking-optimization",
      title: "Ranking Optimization",
      description:
        "Guide to implementing ranking optimization covering A/B testing, feature engineering, and model training.",
      category: "requirements",
      subcategory: "discovery",
      slug: "ranking-optimization",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "ranking",
        "optimization",
        "ml",
        "backend",
      ],
      relatedTopics: [
        "search-ranking",
        "recommendation-algorithms",
        "ab-testing",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/backend/ranking-optimization"),
  },

  // Other - Discovery
  "functional-requirements/discovery/elasticsearch": {
    metadata: {
      id: "article-requirements-disc-other-elasticsearch",
      title: "Elasticsearch",
      description:
        "Guide to using Elasticsearch for search covering cluster setup, index design, and query optimization.",
      category: "requirements",
      subcategory: "discovery",
      slug: "elasticsearch",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "elasticsearch",
        "search",
        "infrastructure",
      ],
      relatedTopics: ["search-indexing", "query-processing", "search-ranking"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/other/elasticsearch"),
  },
  "functional-requirements/discovery/search-analytics": {
    metadata: {
      id: "article-requirements-disc-other-search-analytics",
      title: "Search Analytics",
      description:
        "Guide to implementing search analytics covering query logging, search metrics, and insights generation.",
      category: "requirements",
      subcategory: "discovery",
      slug: "search-analytics",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "discovery",
        "search",
        "analytics",
        "backend",
      ],
      relatedTopics: ["search-ranking", "query-processing", "monitoring"],
    },
    loader: () =>
      import("./articles/requirements/fr/discovery/other/search-analytics"),
  },

  // ============================================================
  // INTERACTION & ENGAGEMENT
  // ============================================================
  "functional-requirements/interaction-engagement/like-button": {
    metadata: {
      id: "article-requirements-int-frontend-like-button",
      title: "Like Button",
      description:
        "Guide to implementing like buttons covering toggle behavior, optimistic updates, and reaction pickers.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "like-button",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "likes",
        "engagement",
        "frontend",
      ],
      relatedTopics: ["reactions", "engagement-tracking", "real-time-updates"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/like-button"),
  },
  "functional-requirements/interaction-engagement/comment-ui": {
    metadata: {
      id: "article-requirements-int-frontend-comment-ui",
      title: "Comment UI",
      description:
        "Guide to implementing comment interfaces covering nested replies, threading, and comment actions.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "comment-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "comments",
        "engagement",
        "frontend",
      ],
      relatedTopics: ["like-button", "threading", "notifications"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/comment-ui"),
  },
  "functional-requirements/interaction-engagement/share-ui": {
    metadata: {
      id: "article-requirements-int-frontend-share-ui",
      title: "Share UI",
      description:
        "Guide to implementing share interfaces covering share sheets, link copying, and external sharing.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "share-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "sharing",
        "engagement",
        "frontend",
      ],
      relatedTopics: ["social-sharing", "content-sharing", "virality"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/share-ui"),
  },
  "functional-requirements/interaction-engagement/bookmark-save-ui": {
    metadata: {
      id: "article-requirements-int-frontend-bookmark-ui",
      title: "Bookmark/Save UI",
      description:
        "Guide to implementing bookmark/save features covering collections, organization, and retrieval.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "bookmark-save-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "bookmarks",
        "saves",
        "frontend",
      ],
      relatedTopics: ["content-management", "user-collections", "engagement"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/bookmark-save-ui"),
  },
  "functional-requirements/interaction-engagement/follow-subscribe-ui": {
    metadata: {
      id: "article-requirements-int-frontend-follow-ui",
      title: "Follow/Subscribe UI",
      description:
        "Guide to implementing follow/subscribe interfaces covering follow buttons, suggestions, and follow management.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "follow-subscribe-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "follow",
        "subscribe",
        "frontend",
      ],
      relatedTopics: ["social-graph", "notifications", "feed-generation"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/follow-subscribe-ui"),
  },
  "functional-requirements/interaction-engagement/engagement-metrics-display": {
    metadata: {
      id: "article-requirements-int-frontend-engagement-metrics",
      title: "Engagement Metrics Display",
      description:
        "Guide to implementing engagement metrics covering view counts, like counts, and analytics dashboards.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "engagement-metrics-display",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "metrics",
        "analytics",
        "frontend",
      ],
      relatedTopics: [
        "engagement-tracking",
        "creator-analytics",
        "real-time-updates",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/engagement-metrics-display"),
  },
  "functional-requirements/interaction-engagement/reaction-picker": {
    metadata: {
      id: "article-requirements-int-frontend-reaction-picker",
      title: "Reaction Picker",
      description:
        "Guide to implementing reaction pickers covering emoji reactions, quick reactions, and reaction display.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "reaction-picker",
      wordCount: 4500,
      readingTime: 18,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "reactions",
        "emoji",
        "frontend",
      ],
      relatedTopics: ["like-button", "engagement", "emoji-picker"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/reaction-picker"),
  },
  "functional-requirements/interaction-engagement/rating-review-ui": {
    metadata: {
      id: "article-requirements-int-frontend-rating-review-ui",
      title: "Rating/Review UI",
      description:
        "Guide to implementing rating and review interfaces covering star ratings, review forms, and review display.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "rating-review-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "ratings",
        "reviews",
        "frontend",
      ],
      relatedTopics: ["engagement", "content-quality", "moderation"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/rating-review-ui"),
  },
  "functional-requirements/interaction-engagement/upvote-downvote-ui": {
    metadata: {
      id: "article-requirements-int-frontend-upvote-downvote",
      title: "Upvote/Downvote UI",
      description:
        "Guide to implementing upvote/downvote systems covering vote toggling, score display, and sorting.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "upvote-downvote-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "voting",
        "engagement",
        "frontend",
      ],
      relatedTopics: ["ranking", "content-quality", "community-moderation"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/frontend/upvote-downvote-ui"),
  },
  "functional-requirements/interaction-engagement/interaction-apis": {
    metadata: {
      id: "article-requirements-int-backend-interaction-apis",
      title: "Interaction APIs",
      description:
        "Guide to implementing interaction APIs covering like, comment, share endpoints with idempotency and rate limiting.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "interaction-apis",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "api",
        "backend",
        "engagement",
      ],
      relatedTopics: ["engagement-tracking", "rate-limiting", "idempotency"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/backend/interaction-apis"),
  },
  "functional-requirements/interaction-engagement/engagement-storage": {
    metadata: {
      id: "article-requirements-int-backend-engagement-storage",
      title: "Engagement Storage",
      description:
        "Guide to implementing engagement storage covering interaction tables, counter caching, and aggregation.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "engagement-storage",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "storage",
        "database",
        "backend",
      ],
      relatedTopics: ["interaction-apis", "caching", "engagement-tracking"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/backend/engagement-storage"),
  },
  "functional-requirements/interaction-engagement/activity-feeds": {
    metadata: {
      id: "article-requirements-int-backend-activity-feeds",
      title: "Activity Feeds",
      description:
        "Guide to implementing activity feeds covering activity generation, feed ranking, and notification digests.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "activity-feeds",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "activity-feed",
        "notifications",
        "backend",
      ],
      relatedTopics: ["notifications", "feed-generation", "real-time-systems"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/backend/activity-feeds"),
  },
  "functional-requirements/interaction-engagement/engagement-tracking": {
    metadata: {
      id: "article-requirements-int-backend-engagement-tracking",
      title: "Engagement Tracking",
      description:
        "Guide to implementing engagement tracking covering event collection, metrics computation, and fraud detection.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "engagement-tracking",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "tracking",
        "analytics",
        "backend",
      ],
      relatedTopics: ["engagement-storage", "analytics", "fraud-detection"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/backend/engagement-tracking"),
  },
  "functional-requirements/interaction-engagement/engagement-aggregation": {
    metadata: {
      id: "article-requirements-int-backend-engagement-aggregation",
      title: "Engagement Aggregation",
      description:
        "Guide to implementing engagement aggregation covering real-time counters, batch aggregation, and trending computation.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "engagement-aggregation",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "aggregation",
        "counters",
        "backend",
      ],
      relatedTopics: ["engagement-tracking", "trending", "real-time-systems"],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/backend/engagement-aggregation"),
  },
  "functional-requirements/interaction-engagement/engagement-fraud-detection": {
    metadata: {
      id: "article-requirements-int-other-engagement-fraud-detection",
      title: "Engagement Fraud Detection",
      description:
        "Guide to detecting engagement fraud covering bot detection, pattern analysis, and mitigation strategies.",
      category: "requirements",
      subcategory: "interaction-engagement",
      slug: "engagement-fraud-detection",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "interaction",
        "fraud",
        "security",
        "backend",
      ],
      relatedTopics: [
        "engagement-tracking",
        "bot-detection",
        "content-moderation",
      ],
    },
    loader: () =>
      import("./articles/requirements/fr/interaction-engagement/other/engagement-fraud-detection"),
  },

  // ============================================================
  // COMMUNICATION
  // ============================================================
  "functional-requirements/communication/chat-ui": {
    metadata: {
      id: "article-requirements-comm-frontend-chat-ui",
      title: "Chat Interface",
      description:
        "Guide to implementing chat interfaces covering message display, input, typing indicators, and real-time updates.",
      category: "requirements",
      subcategory: "communication",
      slug: "chat-ui",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "chat",
        "messaging",
        "frontend",
      ],
      relatedTopics: ["messaging", "real-time", "notifications"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/chat-ui"),
  },
  "functional-requirements/communication/notification-center": {
    metadata: {
      id: "article-requirements-comm-frontend-notification-center",
      title: "Notification Center",
      description:
        "Guide to implementing notification centers covering notification display, filtering, and preferences.",
      category: "requirements",
      subcategory: "communication",
      slug: "notification-center",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "notifications",
        "frontend",
      ],
      relatedTopics: ["push-notifications", "real-time", "preferences"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/notification-center"),
  },
  "functional-requirements/communication/presence-indicators": {
    metadata: {
      id: "article-requirements-comm-frontend-presence-indicators",
      title: "Presence Indicators",
      description:
        "Guide to implementing presence indicators covering online status, typing indicators, and last seen.",
      category: "requirements",
      subcategory: "communication",
      slug: "presence-indicators",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "presence",
        "real-time",
        "frontend",
      ],
      relatedTopics: ["real-time", "chat", "websockets"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/presence-indicators"),
  },
  "functional-requirements/communication/group-chat-ui": {
    metadata: {
      id: "article-requirements-comm-frontend-group-chat",
      title: "Group Chat UI",
      description:
        "Guide to implementing group chat covering member management, mentions, and group settings.",
      category: "requirements",
      subcategory: "communication",
      slug: "group-chat-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "group-chat",
        "messaging",
        "frontend",
      ],
      relatedTopics: ["chat", "mentions", "notifications"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/group-chat-ui"),
  },
  "functional-requirements/communication/read-receipts": {
    metadata: {
      id: "article-requirements-comm-frontend-read-receipts",
      title: "Read Receipts",
      description:
        "Guide to implementing read receipts covering delivery status, read status, and privacy controls.",
      category: "requirements",
      subcategory: "communication",
      slug: "read-receipts",
      wordCount: 4500,
      readingTime: 18,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "read-receipts",
        "messaging",
        "frontend",
      ],
      relatedTopics: ["chat", "presence", "privacy"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/read-receipts"),
  },
  "functional-requirements/communication/media-sharing-chat": {
    metadata: {
      id: "article-requirements-comm-frontend-media-sharing",
      title: "Media Sharing in Chat",
      description:
        "Guide to implementing media sharing in chat covering image/video sharing, file attachments, and media gallery.",
      category: "requirements",
      subcategory: "communication",
      slug: "media-sharing-chat",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "media",
        "chat",
        "frontend",
      ],
      relatedTopics: ["chat", "media-upload", "file-attachments"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/media-sharing-chat"),
  },
  "functional-requirements/communication/voice-video-calling-ui": {
    metadata: {
      id: "article-requirements-comm-frontend-voice-video-calling",
      title: "Voice/Video Calling UI",
      description:
        "Guide to implementing voice and video calling covering call controls, quality indicators, and screen sharing.",
      category: "requirements",
      subcategory: "communication",
      slug: "voice-video-calling-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "calling",
        "video",
        "frontend",
      ],
      relatedTopics: ["webrtc", "real-time", "chat"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/frontend/voice-video-calling-ui"),
  },
  "functional-requirements/communication/messaging-service": {
    metadata: {
      id: "article-requirements-comm-backend-messaging-service",
      title: "Messaging Service",
      description:
        "Guide to implementing messaging services covering message delivery, ordering, and offline handling.",
      category: "requirements",
      subcategory: "communication",
      slug: "messaging-service",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "messaging",
        "backend",
        "real-time",
      ],
      relatedTopics: ["websockets", "message-queues", "offline-support"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/messaging-service"),
  },
  "functional-requirements/communication/websocket-server": {
    metadata: {
      id: "article-requirements-comm-backend-websocket-server",
      title: "WebSocket Server",
      description:
        "Guide to implementing WebSocket servers covering connection management, scaling, and heartbeats.",
      category: "requirements",
      subcategory: "communication",
      slug: "websocket-server",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "websocket",
        "real-time",
        "backend",
      ],
      relatedTopics: ["messaging-service", "presence", "scaling"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/websocket-server"),
  },
  "functional-requirements/communication/push-notification-service": {
    metadata: {
      id: "article-requirements-comm-backend-push-notifications",
      title: "Push Notification Service",
      description:
        "Guide to implementing push notifications covering APNs, FCM, delivery, and tracking.",
      category: "requirements",
      subcategory: "communication",
      slug: "push-notification-service",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "push",
        "notifications",
        "backend",
      ],
      relatedTopics: ["notifications", "messaging", "mobile"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/push-notification-service"),
  },
  "functional-requirements/communication/notification-delivery": {
    metadata: {
      id: "article-requirements-comm-backend-notification-delivery",
      title: "Notification Delivery",
      description:
        "Guide to implementing notification delivery covering routing, preferences, and delivery optimization.",
      category: "requirements",
      subcategory: "communication",
      slug: "notification-delivery",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "notifications",
        "delivery",
        "backend",
      ],
      relatedTopics: ["push-notifications", "email", "preferences"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/notification-delivery"),
  },
  "functional-requirements/communication/offline-message-queue": {
    metadata: {
      id: "article-requirements-comm-backend-offline-message-queue",
      title: "Offline Message Queue",
      description:
        "Guide to implementing offline message queues covering storage, sync, and delivery on reconnect.",
      category: "requirements",
      subcategory: "communication",
      slug: "offline-message-queue",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "offline",
        "queue",
        "backend",
      ],
      relatedTopics: ["messaging-service", "sync", "mobile"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/offline-message-queue"),
  },
  "functional-requirements/communication/e2e-encryption": {
    metadata: {
      id: "article-requirements-comm-backend-e2e-encryption",
      title: "End-to-End Encryption",
      description:
        "Guide to implementing end-to-end encryption covering key exchange, message encryption, and group encryption.",
      category: "requirements",
      subcategory: "communication",
      slug: "e2e-encryption",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "encryption",
        "security",
        "backend",
      ],
      relatedTopics: ["messaging", "security", "privacy"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/backend/e2e-encryption"),
  },
  "functional-requirements/communication/webrtc": {
    metadata: {
      id: "article-requirements-comm-other-webrtc",
      title: "WebRTC for Real-Time Communication",
      description:
        "Guide to implementing WebRTC covering peer-to-peer connections, STUN/TURN, and media handling.",
      category: "requirements",
      subcategory: "communication",
      slug: "webrtc",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "communication",
        "webrtc",
        "real-time",
        "video",
      ],
      relatedTopics: ["voice-video-calling", "peer-to-peer", "streaming"],
    },
    loader: () =>
      import("./articles/requirements/fr/communication/other/webrtc"),
  },

  // ============================================================
  // TRANSACTIONS & STATE
  // ============================================================
  "functional-requirements/transactions-state/checkout-flow": {
    metadata: {
      id: "article-requirements-trans-frontend-checkout-flow",
      title: "Checkout Flow",
      description:
        "Guide to implementing checkout flows covering multi-step checkout, payment forms, and order confirmation.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "checkout-flow",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "checkout",
        "payments",
        "frontend",
      ],
      relatedTopics: ["payment-ui", "order-management", "transactions"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/checkout-flow"),
  },
  "functional-requirements/transactions-state/payment-ui": {
    metadata: {
      id: "article-requirements-trans-frontend-payment-ui",
      title: "Payment UI",
      description:
        "Guide to implementing payment interfaces covering card input, payment methods, and payment processing states.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "payment-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "payment",
        "checkout",
        "frontend",
      ],
      relatedTopics: ["checkout-flow", "payment-processing", "security"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/payment-ui"),
  },
  "functional-requirements/transactions-state/order-tracking-ui": {
    metadata: {
      id: "article-requirements-trans-frontend-order-tracking",
      title: "Order Tracking UI",
      description:
        "Guide to implementing order tracking covering status timeline, delivery updates, and tracking integration.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "order-tracking-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "order-tracking",
        "delivery",
        "frontend",
      ],
      relatedTopics: ["order-management", "notifications", "shipping"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/order-tracking-ui"),
  },
  "functional-requirements/transactions-state/subscription-management-ui": {
    metadata: {
      id: "article-requirements-trans-frontend-subscription-management",
      title: "Subscription Management UI",
      description:
        "Guide to implementing subscription management covering plan selection, billing, and cancellation flows.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "subscription-management-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "subscription",
        "billing",
        "frontend",
      ],
      relatedTopics: ["payments", "billing", "subscription-service"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/subscription-management-ui"),
  },
  "functional-requirements/transactions-state/transaction-history-ui": {
    metadata: {
      id: "article-requirements-trans-frontend-transaction-history",
      title: "Transaction History UI",
      description:
        "Guide to implementing transaction history covering transaction list, filtering, and export.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "transaction-history-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "history",
        "transactions",
        "frontend",
      ],
      relatedTopics: ["payments", "reporting", "accounting"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/transaction-history-ui"),
  },
  "functional-requirements/transactions-state/refund-request-ui": {
    metadata: {
      id: "article-requirements-trans-frontend-refund-request",
      title: "Refund Request UI",
      description:
        "Guide to implementing refund request interfaces covering refund initiation, reason selection, and status tracking.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "refund-request-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "refund",
        "customer-service",
        "frontend",
      ],
      relatedTopics: ["payments", "order-management", "customer-support"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/frontend/refund-request-ui"),
  },
  "functional-requirements/transactions-state/payment-processing": {
    metadata: {
      id: "article-requirements-trans-backend-payment-processing",
      title: "Payment Processing",
      description:
        "Guide to implementing payment processing covering gateway integration, authorization, capture, and refunds.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "payment-processing",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "payments",
        "processing",
        "backend",
      ],
      relatedTopics: ["payment-gateway", "transactions", "refunds"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/payment-processing"),
  },
  "functional-requirements/transactions-state/order-management": {
    metadata: {
      id: "article-requirements-trans-backend-order-management",
      title: "Order Management Service",
      description:
        "Guide to implementing order management covering order lifecycle, state machine, and fulfillment integration.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "order-management-service",
      wordCount: 6500,
      readingTime: 26,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "orders",
        "management",
        "backend",
      ],
      relatedTopics: ["state-machine", "fulfillment", "inventory"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/order-management"),
  },
  "functional-requirements/transactions-state/state-machine": {
    metadata: {
      id: "article-requirements-trans-backend-state-machine",
      title: "State Machine Implementation",
      description:
        "Guide to implementing state machines covering state definition, transitions, and persistence.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "state-machine-implementation",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "state-machine",
        "backend",
        "design-patterns",
      ],
      relatedTopics: ["order-management", "workflow", "transactions"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/state-machine"),
  },
  "functional-requirements/transactions-state/idempotency": {
    metadata: {
      id: "article-requirements-trans-backend-idempotency",
      title: "Idempotency",
      description:
        "Guide to implementing idempotency covering idempotency keys, deduplication, and safe retries.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "idempotency",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "idempotency",
        "reliability",
        "backend",
      ],
      relatedTopics: ["payments", "api-design", "reliability"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/idempotency"),
  },
  "functional-requirements/transactions-state/inventory-management": {
    metadata: {
      id: "article-requirements-trans-backend-inventory-management",
      title: "Inventory Management",
      description:
        "Guide to implementing inventory management covering stock tracking, reservations, and oversell prevention.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "inventory-management",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "inventory",
        "backend",
        "ecommerce",
      ],
      relatedTopics: ["order-management", "warehouse", "fulfillment"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/inventory-management"),
  },
  "functional-requirements/transactions-state/subscription-billing": {
    metadata: {
      id: "article-requirements-trans-backend-subscription-billing",
      title: "Subscription Billing",
      description:
        "Guide to implementing subscription billing covering recurring charges, proration, and dunning.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "subscription-billing",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "subscription",
        "billing",
        "backend",
      ],
      relatedTopics: ["payments", "subscriptions", "dunning"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/backend/subscription-billing"),
  },
  "functional-requirements/transactions-state/fraud-detection": {
    metadata: {
      id: "article-requirements-trans-other-fraud-detection",
      title: "Transaction Fraud Detection",
      description:
        "Guide to detecting transaction fraud covering risk scoring, velocity checks, and machine learning.",
      category: "requirements",
      subcategory: "transactions-state",
      slug: "transaction-fraud-detection",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "transactions",
        "fraud",
        "security",
        "backend",
      ],
      relatedTopics: ["payments", "security", "machine-learning"],
    },
    loader: () =>
      import("./articles/requirements/fr/transactions-state/other/fraud-detection"),
  },

  // ============================================================
  // ADMINISTRATION & MODERATION
  // ============================================================
  "functional-requirements/admin-moderation/admin-dashboard": {
    metadata: {
      id: "article-requirements-admin-frontend-admin-dashboard",
      title: "Admin Dashboard",
      description:
        "Guide to implementing admin dashboards covering metrics, user management, and system health monitoring.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "admin-dashboard",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "dashboard",
        "monitoring",
        "frontend",
      ],
      relatedTopics: ["admin-tools", "analytics", "monitoring"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/admin-dashboard"),
  },
  "functional-requirements/admin-moderation/user-management-ui": {
    metadata: {
      id: "article-requirements-admin-frontend-user-management",
      title: "User Management UI",
      description:
        "Guide to implementing user management covering user search, account actions, and bulk operations.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "user-management-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "user-management",
        "moderation",
        "frontend",
      ],
      relatedTopics: ["admin-dashboard", "moderation", "rbac"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/user-management-ui"),
  },
  "functional-requirements/admin-moderation/moderation-queue-ui": {
    metadata: {
      id: "article-requirements-admin-frontend-moderation-queue",
      title: "Moderation Queue UI",
      description:
        "Guide to implementing moderation queue covering content review, decision tracking, and queue management.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "moderation-queue-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "moderation",
        "queue",
        "frontend",
      ],
      relatedTopics: ["content-moderation", "admin-dashboard", "workflow"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/moderation-queue-ui"),
  },
  "functional-requirements/admin-moderation/reporting-tools-ui": {
    metadata: {
      id: "article-requirements-admin-frontend-reporting-tools",
      title: "Reporting Tools UI",
      description:
        "Guide to implementing reporting tools covering abuse reports, report management, and reporter communication.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "reporting-tools-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "reporting",
        "moderation",
        "frontend",
      ],
      relatedTopics: ["moderation", "abuse-prevention", "user-safety"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/reporting-tools-ui"),
  },
  "functional-requirements/admin-moderation/analytics-dashboard": {
    metadata: {
      id: "article-requirements-admin-frontend-analytics-dashboard",
      title: "Analytics Dashboard",
      description:
        "Guide to implementing analytics dashboards covering user analytics, content metrics, and business KPIs.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "analytics-dashboard",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "analytics",
        "dashboard",
        "frontend",
      ],
      relatedTopics: ["admin-dashboard", "reporting", "metrics"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/analytics-dashboard"),
  },
  "functional-requirements/admin-moderation/feature-flag-ui": {
    metadata: {
      id: "article-requirements-admin-frontend-feature-flags",
      title: "Feature Flag UI",
      description:
        "Guide to implementing feature flag management covering flag creation, targeting, and rollout control.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "feature-flag-ui",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "feature-flags",
        "rollout",
        "frontend",
      ],
      relatedTopics: ["deployment", "ab-testing", "configuration"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/frontend/feature-flag-ui"),
  },
  "functional-requirements/admin-moderation/abuse-detection": {
    metadata: {
      id: "article-requirements-admin-backend-abuse-detection",
      title: "Abuse Detection Service",
      description:
        "Guide to implementing abuse detection covering pattern detection, automated enforcement, and appeals.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "abuse-detection-service",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "abuse-detection",
        "security",
        "backend",
      ],
      relatedTopics: ["moderation", "fraud-detection", "machine-learning"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/backend/abuse-detection"),
  },
  "functional-requirements/admin-moderation/audit-logging": {
    metadata: {
      id: "article-requirements-admin-backend-audit-logging",
      title: "Audit Logging Service",
      description:
        "Guide to implementing audit logging covering event capture, immutable storage, and compliance.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "audit-logging-service",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "audit-logging",
        "compliance",
        "backend",
      ],
      relatedTopics: ["security", "compliance", "monitoring"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/backend/audit-logging"),
  },
  "functional-requirements/admin-moderation/compliance-tools": {
    metadata: {
      id: "article-requirements-admin-backend-compliance-tools",
      title: "Compliance Tools",
      description:
        "Guide to implementing compliance tools covering GDPR, data retention, and regulatory reporting.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "compliance-tools",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "compliance",
        "gdpr",
        "backend",
      ],
      relatedTopics: ["privacy", "data-governance", "audit-logging"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/backend/compliance-tools"),
  },
  "functional-requirements/admin-moderation/content-moderation-service": {
    metadata: {
      id: "article-requirements-admin-backend-content-moderation-service",
      title: "Content Moderation Service",
      description:
        "Guide to implementing content moderation services covering auto-moderation, human review, and policy enforcement.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "content-moderation-service",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "moderation",
        "content-safety",
        "backend",
      ],
      relatedTopics: ["abuse-detection", "ml-moderation", "policy-enforcement"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/backend/content-moderation-service"),
  },
  "functional-requirements/admin-moderation/legal-requests": {
    metadata: {
      id: "article-requirements-admin-other-legal-requests",
      title: "Legal Request Management",
      description:
        "Guide to handling legal requests covering subpoenas, DMCA takedowns, and law enforcement requests.",
      category: "requirements",
      subcategory: "admin-moderation",
      slug: "legal-request-management",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "admin",
        "legal",
        "compliance",
        "process",
      ],
      relatedTopics: ["compliance", "content-moderation", "data-requests"],
    },
    loader: () =>
      import("./articles/requirements/fr/admin-moderation/other/legal-requests"),
  },

  // ============================================================
  // CROSS-CUTTING REQUIREMENTS
  // ============================================================
  "functional-requirements/cross-cutting/privacy-controls-ui": {
    metadata: {
      id: "article-requirements-cross-frontend-privacy-controls",
      title: "Privacy Controls UI",
      description:
        "Guide to implementing privacy controls covering visibility settings, data sharing preferences, and privacy dashboard.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "privacy-controls-ui",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "privacy",
        "settings",
        "frontend",
      ],
      relatedTopics: ["gdpr", "data-governance", "security-settings"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/privacy-controls-ui"),
  },
  "functional-requirements/cross-cutting/accessibility": {
    metadata: {
      id: "article-requirements-cross-frontend-accessibility",
      title: "Accessibility (A11y)",
      description:
        "Guide to implementing accessibility covering WCAG compliance, screen reader support, and keyboard navigation.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "accessibility",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "accessibility",
        "a11y",
        "frontend",
      ],
      relatedTopics: ["wcag", "inclusive-design", "compliance"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/accessibility"),
  },
  "functional-requirements/cross-cutting/internationalization": {
    metadata: {
      id: "article-requirements-cross-frontend-internationalization",
      title: "Internationalization (i18n)",
      description:
        "Guide to implementing internationalization covering translations, RTL support, and locale formatting.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "internationalization",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "i18n",
        "localization",
        "frontend",
      ],
      relatedTopics: ["l10n", "translations", "globalization"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/internationalization"),
  },
  "functional-requirements/cross-cutting/error-handling": {
    metadata: {
      id: "article-requirements-cross-frontend-error-handling",
      title: "Error Handling & Recovery",
      description:
        "Guide to implementing error handling covering error states, recovery options, and user-friendly messages.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "error-handling-recovery",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "error-handling",
        "ux",
        "frontend",
      ],
      relatedTopics: ["error-boundaries", "retry-logic", "ux"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/error-handling"),
  },
  "functional-requirements/cross-cutting/performance-optimization": {
    metadata: {
      id: "article-requirements-cross-frontend-performance-optimization",
      title: "Performance Optimization",
      description:
        "Guide to implementing performance optimization covering loading states, lazy loading, and perceived performance.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "performance-optimization",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "performance",
        "optimization",
        "frontend",
      ],
      relatedTopics: ["web-vitals", "lazy-loading", "caching"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/performance-optimization"),
  },
  "functional-requirements/cross-cutting/data-synchronization": {
    metadata: {
      id: "article-requirements-cross-frontend-data-synchronization",
      title: "Data Synchronization",
      description:
        "Guide to implementing data sync covering optimistic updates, conflict resolution, and offline sync.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "data-synchronization",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "sync",
        "offline",
        "frontend",
      ],
      relatedTopics: ["offline-first", "conflict-resolution", "real-time"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/data-synchronization"),
  },
  "functional-requirements/cross-cutting/retry-mechanisms": {
    metadata: {
      id: "article-requirements-cross-frontend-retry-mechanisms",
      title: "Retry Mechanisms",
      description:
        "Guide to implementing retry mechanisms covering exponential backoff, idempotency, and failure handling.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "retry-mechanisms",
      wordCount: 5000,
      readingTime: 20,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "retry",
        "reliability",
        "frontend",
      ],
      relatedTopics: ["idempotency", "error-handling", "reliability"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/frontend/retry-mechanisms"),
  },
  "functional-requirements/cross-cutting/data-governance": {
    metadata: {
      id: "article-requirements-cross-backend-data-governance",
      title: "Data Governance",
      description:
        "Guide to implementing data governance covering data classification, access controls, and retention policies.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "data-governance",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "data-governance",
        "compliance",
        "backend",
      ],
      relatedTopics: ["privacy", "security", "compliance"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/backend/data-governance"),
  },
  "functional-requirements/cross-cutting/rate-limiting": {
    metadata: {
      id: "article-requirements-cross-backend-rate-limiting",
      title: "Rate Limiting",
      description:
        "Guide to implementing rate limiting covering algorithms, distributed rate limiting, and abuse prevention.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "rate-limiting",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "rate-limiting",
        "api",
        "backend",
      ],
      relatedTopics: ["api-design", "abuse-prevention", "scalability"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/backend/rate-limiting"),
  },
  "functional-requirements/cross-cutting/circuit-breaker": {
    metadata: {
      id: "article-requirements-cross-backend-circuit-breaker",
      title: "Circuit Breaker Pattern",
      description:
        "Guide to implementing circuit breakers covering failure detection, state management, and recovery.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "circuit-breaker-pattern",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "circuit-breaker",
        "resilience",
        "backend",
      ],
      relatedTopics: ["fault-tolerance", "resilience", "microservices"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/backend/circuit-breaker"),
  },
  "functional-requirements/cross-cutting/event-sourcing": {
    metadata: {
      id: "article-requirements-cross-backend-event-sourcing",
      title: "Event Sourcing",
      description:
        "Guide to implementing event sourcing covering event stores, projections, and event replay.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "event-sourcing",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "event-sourcing",
        "architecture",
        "backend",
      ],
      relatedTopics: ["cqrs", "event-driven", "audit-logging"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/backend/event-sourcing"),
  },
  "functional-requirements/cross-cutting/distributed-tracing": {
    metadata: {
      id: "article-requirements-cross-backend-distributed-tracing",
      title: "Distributed Tracing",
      description:
        "Guide to implementing distributed tracing covering trace propagation, span collection, and observability.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "distributed-tracing",
      wordCount: 5500,
      readingTime: 22,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "tracing",
        "observability",
        "backend",
      ],
      relatedTopics: ["monitoring", "microservices", "debugging"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/backend/distributed-tracing"),
  },
  "functional-requirements/cross-cutting/gdpr-compliance": {
    metadata: {
      id: "article-requirements-cross-other-gdpr-compliance",
      title: "GDPR Compliance",
      description:
        "Guide to GDPR compliance covering data subject rights, consent management, and data protection.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "gdpr-compliance",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "gdpr",
        "compliance",
        "privacy",
      ],
      relatedTopics: ["privacy", "data-governance", "consent"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/other/gdpr-compliance"),
  },
  "functional-requirements/cross-cutting/security-best-practices": {
    metadata: {
      id: "article-requirements-cross-other-security-best-practices",
      title: "Security Best Practices",
      description:
        "Guide to security best practices covering OWASP Top 10, secure development, and security testing.",
      category: "requirements",
      subcategory: "cross-cutting",
      slug: "security-best-practices",
      wordCount: 6000,
      readingTime: 24,
      lastUpdated: "2026-03-16",
      tags: [
        "requirements",
        "functional",
        "cross-cutting",
        "security",
        "owasp",
        "best-practices",
      ],
      relatedTopics: ["authentication", "authorization", "encryption"],
    },
    loader: () =>
      import("./articles/requirements/fr/cross-cutting/other/security-best-practices"),
  },
};
