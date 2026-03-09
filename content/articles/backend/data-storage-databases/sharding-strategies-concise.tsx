"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sharding-strategies-concise",
  title: "Sharding Strategies",
  description:
    "Concise guide to sharding strategies, partition keys, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sharding-strategies",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sharding", "scaling"],
  relatedTopics: [
    "database-partitioning",
    "cap-theorem",
    "consistency-models",
  ],
};

export default function ShardingStrategiesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Sharding</strong> splits data across multiple nodes to scale
          writes and storage. A shard key determines placement. The right
          strategy balances load distribution, query efficiency, and operational
          complexity.
        </p>
        <p>
          Common strategies include range-based, hash-based, and geographic
          sharding. Each trades off hotspot risk, range query efficiency, and
          rebalancing complexity.
        </p>
      </section>

      <section>
        <h2>Key Strategies</h2>
        <ul className="space-y-2">
          <li><strong>Range-based:</strong> Shard by key ranges (time, IDs).</li>
          <li><strong>Hash-based:</strong> Hash key to spread load evenly.</li>
          <li><strong>Geographic:</strong> Place data by region for latency.</li>
          <li><strong>Consistent hashing:</strong> Minimize rebalancing impact.</li>
          <li><strong>Composite keys:</strong> Combine dimensions for balance.</li>
        </ul>
        <p className="mt-4">
          Pick a key that matches access patterns and avoids hotspots.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Hash-based sharding
const shardId = hash(userId) % NUM_SHARDS;
const shard = shards[shardId];
return shard.query("SELECT * FROM orders WHERE user_id = ?", [userId]);`}</code>
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
                ✓ Scales writes and storage<br />
                ✓ Distributes load across nodes<br />
                ✓ Enables horizontal growth
              </td>
              <td className="p-3">
                ✗ Cross-shard queries are expensive<br />
                ✗ Rebalancing complexity<br />
                ✗ Hot shard risk with poor keys
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use sharding when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• A single node cannot handle write volume</li>
          <li>• Data size exceeds single-node limits</li>
          <li>• Horizontal scale is required</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Your workload relies on cross-entity joins</li>
          <li>• You cannot tolerate operational complexity</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain shard key selection and hotspot risks.</li>
          <li>Discuss range vs hash trade-offs.</li>
          <li>Highlight rebalancing and migration complexity.</li>
          <li>Mention consistent hashing for smoother scaling.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a good shard key?</p>
            <p className="mt-2 text-sm">
              A: It distributes data evenly and matches common query patterns,
              avoiding hotspots.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is hash-based sharding common?</p>
            <p className="mt-2 text-sm">
              A: Hashing evenly distributes load, reducing hotspot risk.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is consistent hashing?</p>
            <p className="mt-2 text-sm">
              A: A hashing scheme that minimizes data movement when nodes are
              added or removed.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens with cross-shard queries?</p>
            <p className="mt-2 text-sm">
              A: They require fan-out to multiple shards, increasing latency
              and resource usage.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
