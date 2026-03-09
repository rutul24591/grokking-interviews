"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-key-value-stores-concise",
  title: "Key-Value Stores",
  description:
    "Concise guide to key-value stores, access patterns, and trade-offs for interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "key-value-stores",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "key-value"],
  relatedTopics: [
    "in-memory-databases",
    "caching-performance",
    "cap-theorem",
  ],
};

export default function KeyValueStoresConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Key-value stores</strong> store data as a simple mapping from
          a unique key to a value. They are optimized for fast lookups and
          simple access patterns, making them ideal for caching, session
          storage, and high-throughput workloads.
        </p>
        <p>
          Examples include Redis, DynamoDB, and Memcached. Most key-value
          stores trade complex queries for speed and scalability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Key-based access:</strong> O(1) lookups by key.</li>
          <li><strong>Value blobs:</strong> Values are often opaque to the DB.</li>
          <li><strong>TTL:</strong> Keys can expire automatically.</li>
          <li><strong>Partitioning:</strong> Keys distributed across nodes.</li>
          <li><strong>Consistency:</strong> Often tunable or eventual.</li>
        </ul>
        <p className="mt-4">
          Key-value stores shine when access patterns are simple and predictable.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Redis-style usage
await redis.set("session:123", JSON.stringify({ userId: "u1" }), "EX", 3600);
const session = await redis.get("session:123");`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Extremely fast lookups<br />
                ✓ Simple scaling by partitioning keys<br />
                ✓ Great for caching and sessions<br />
                ✓ Low operational overhead
              </td>
              <td className="p-3">
                ✗ Limited query capabilities<br />
                ✗ No joins or complex filters<br />
                ✗ Value schema is app-managed<br />
                ✗ Some stores trade consistency for availability
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use key-value stores when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need fast lookups by key</li>
          <li>• Access patterns are simple</li>
          <li>• You need caching, sessions, or feature flags</li>
        </ul>
        <p><strong>Use other databases when:</strong></p>
        <ul className="space-y-1">
          <li>• You need complex queries or joins</li>
          <li>• You need strong schema enforcement</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain why key-based access is fast and scalable.</li>
          <li>Discuss TTL and eviction policies for cache use cases.</li>
          <li>Note consistency trade-offs in distributed key-value stores.</li>
          <li>Clarify that values are typically opaque to the store.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are key-value stores fast?</p>
            <p className="mt-2 text-sm">
              A: They use direct key lookups without joins or complex queries,
              often backed by in-memory or hash-based indexing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What workloads are best for key-value stores?</p>
            <p className="mt-2 text-sm">
              A: Caching, session management, feature flags, and high-throughput
              simple lookups.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you query by value?</p>
            <p className="mt-2 text-sm">
              A: Usually no. Most key-value stores do not support secondary
              indexes or complex queries.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do key-value stores scale?</p>
            <p className="mt-2 text-sm">
              A: By partitioning keys across nodes, which keeps lookups local
              and parallelizable.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
