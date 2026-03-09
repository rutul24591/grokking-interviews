"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-key-value-stores-extensive",
  title: "Key-Value Stores",
  description:
    "Deep guide to key-value stores, access patterns, consistency, and scalability trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "key-value-stores",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "key-value"],
  relatedTopics: [
    "in-memory-databases",
    "caching-performance",
    "cap-theorem",
  ],
};

export default function KeyValueStoresExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Key-value stores</strong> provide a simple data model: a
          unique key mapped to a value. This model trades query flexibility for
          performance, making key-value stores ideal for caching, session
          management, feature flags, and other workloads that only need direct
          lookup by key.
        </p>
        <p>
          Many key-value stores are distributed and align with BASE properties,
          favoring availability and scalability. The absence of joins and
          complex queries keeps latency low and throughput high.
        </p>
        <p>
          Key-value stores are foundational in modern architectures as both
          system-of-record databases (e.g., DynamoDB) and in-memory caches
          (e.g., Redis, Memcached).
        </p>
      </section>

      <section>
        <h2>Data Model and Access Patterns</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/key-value-model.svg"
          alt="Key-value model"
          caption="Keys map to opaque values for fast retrieval"
        />
        <p>
          The simplest pattern is GET/SET by key. Some systems allow atomic
          increments, conditional updates, and TTL-based expiration.
        </p>
        <p>
          Since keys are the only access path, designing a good key schema is
          critical. Keys should be evenly distributed to avoid hotspots and
          include enough structure to support logical grouping.
        </p>
      </section>

      <section>
        <h2>Partitioning and Scaling</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/key-value-partitioning.svg"
          alt="Key partitioning"
          caption="Consistent hashing distributes keys across nodes"
        />
        <p>
          Key-value stores scale by partitioning keys across nodes, often using
          consistent hashing. This makes lookups efficient and enables horizontal
          scaling as traffic grows.
        </p>
        <p>
          Hot keys are a common problem: a single popular key can overwhelm one
          node. Mitigations include key sharding and request-level caching.
        </p>
      </section>

      <section>
        <h2>Consistency and Replication</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/key-value-consistency.svg"
          alt="Key-value consistency"
          caption="Systems trade consistency for availability under partitions"
        />
        <p>
          Many key-value stores offer tunable consistency, ranging from strong
          consistency to eventual consistency. The choice affects latency,
          availability, and conflict resolution requirements.
        </p>
        <p>
          Replication improves availability and read throughput, but introduces
          replication lag and potential stale reads.
        </p>
      </section>

      <section>
        <h2>Example: Cache with TTL</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Redis-style cache with TTL
await redis.set("product:42", JSON.stringify(product), "EX", 300);
const cached = await redis.get("product:42");`}</code>
        </pre>
        <p>
          TTL-based expiration is common for caches and session stores, keeping
          data fresh and limiting memory usage.
        </p>
      </section>

      <section>
        <h2>Example: Conditional Update</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// DynamoDB-style conditional write
await db.put({
  key: "inventory:sku_1",
  value: { count: 12 },
  condition: "count >= :min",
});`}</code>
        </pre>
        <p>
          Conditional writes support safe updates without full transactions and
          are useful for counters, inventory, and rate limiting.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Key-value stores are simple but require careful design:
        </p>
        <ul className="space-y-2">
          <li>Hot keys can create uneven load.</li>
          <li>Limited query capabilities require careful key design.</li>
          <li>Values can grow without schema enforcement.</li>
          <li>Consistency trade-offs must be explicit.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Design keys for even distribution and efficient lookups.</li>
          <li>Use TTLs for caches and session data.</li>
          <li>Plan for hot-key mitigation (sharding, caching).</li>
          <li>Pick consistency settings based on workload needs.</li>
          <li>Monitor hit rates, latency, and eviction patterns.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
