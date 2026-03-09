"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-in-memory-databases-concise",
  title: "In-Memory Databases",
  description:
    "Concise guide to in-memory databases, latency benefits, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "in-memory-databases",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "in-memory", "performance"],
  relatedTopics: [
    "caching-performance",
    "key-value-stores",
    "connection-pooling",
  ],
};

export default function InMemoryDatabasesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>In-memory databases</strong> store data in RAM to provide
          extremely low-latency access. They are used for caching, sessions,
          real-time analytics, and high-throughput workloads.
        </p>
        <p>
          Examples include Redis, Memcached, and VoltDB. The trade-off is cost
          and durability compared to disk-based systems.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>RAM storage:</strong> Fast reads/writes.</li>
          <li><strong>Persistence options:</strong> AOF, snapshots, or none.</li>
          <li><strong>TTL:</strong> Automatic expiration of keys.</li>
          <li><strong>Replication:</strong> Improve availability.</li>
          <li><strong>Eviction policies:</strong> LRU/LFU for memory pressure.</li>
        </ul>
        <p className="mt-4">
          In-memory databases trade durability for speed unless persistence
          is explicitly configured.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Redis cache
await redis.set("user:1", JSON.stringify(user), "EX", 300);
const cached = await redis.get("user:1");`}</code>
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
                ✓ Sub-millisecond latency<br />
                ✓ High throughput<br />
                ✓ Great for caching and sessions<br />
                ✓ Flexible data structures
              </td>
              <td className="p-3">
                ✗ Higher cost per GB<br />
                ✗ Durability risks without persistence<br />
                ✗ Limited dataset size (RAM bound)<br />
                ✗ Evictions under memory pressure
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use in-memory DBs when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need extremely low latency</li>
          <li>• Caching or session storage is required</li>
          <li>• Data can be recreated if lost</li>
        </ul>
        <p><strong>Use disk-based DBs when:</strong></p>
        <ul className="space-y-1">
          <li>• Durability is critical</li>
          <li>• Data volume exceeds RAM budgets</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain persistence options (AOF vs snapshots).</li>
          <li>Discuss eviction policies and TTL usage.</li>
          <li>Highlight latency vs durability trade-offs.</li>
          <li>Connect use cases to caching and rate limiting.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are in-memory DBs fast?</p>
            <p className="mt-2 text-sm">
              A: They keep data in RAM, avoiding disk I/O, which reduces latency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do in-memory DBs ensure durability?</p>
            <p className="mt-2 text-sm">
              A: They may use append-only logs or snapshots, but durability is
              weaker than disk-based systems.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when memory is full?</p>
            <p className="mt-2 text-sm">
              A: The system evicts keys based on a policy (LRU/LFU) or rejects writes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you use Redis as a primary database?</p>
            <p className="mt-2 text-sm">
              A: Yes, but you must configure persistence and replication to
              reduce data loss risk.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
