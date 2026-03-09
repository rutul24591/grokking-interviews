"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sharding-strategies-extensive",
  title: "Sharding Strategies",
  description:
    "Deep guide to sharding strategies, key selection, rebalancing, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sharding-strategies",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sharding", "scaling"],
  relatedTopics: [
    "database-partitioning",
    "cap-theorem",
    "consistency-models",
  ],
};

export default function ShardingStrategiesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Sharding</strong> partitions data across multiple nodes so
          systems can scale writes and storage beyond a single machine. It is
          a core technique for high-scale NoSQL systems and large relational
          deployments.
        </p>
        <p>
          The shard key determines where data lives, and that choice impacts
          performance, query efficiency, and operational complexity.
        </p>
        <p>
          Sharding is not replication: sharding splits data, while replication
          copies it. Most systems use both.
        </p>
      </section>

      <section>
        <h2>Sharding Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/sharding-strategies.svg"
          alt="Sharding strategies"
          caption="Range, hash, and geographic sharding each have trade-offs"
        />
        <ul className="space-y-2">
          <li><strong>Range-based:</strong> Efficient range queries, hotspot risk.</li>
          <li><strong>Hash-based:</strong> Even distribution, weaker range queries.</li>
          <li><strong>Geographic:</strong> Low latency for regional users.</li>
          <li><strong>Consistent hashing:</strong> Smooth rebalancing on scale.</li>
        </ul>
      </section>

      <section>
        <h2>Shard Key Selection</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/shard-key-design.svg"
          alt="Shard key design"
          caption="Good shard keys balance load and match access patterns"
        />
        <p>
          The shard key should distribute load evenly while supporting common
          queries. Poor keys cause hotspots and uneven storage growth.
        </p>
        <p>
          Common keys include user_id, tenant_id, or region. Avoid monotonically
          increasing keys unless combined with hashing.
        </p>
      </section>

      <section>
        <h2>Rebalancing and Resharding</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/resharding.svg"
          alt="Resharding"
          caption="Adding shards requires data movement and routing changes"
        />
        <p>
          As systems grow, you need to add shards and redistribute data. This
          is operationally expensive and can impact performance if not planned.
        </p>
        <p>
          Consistent hashing reduces data movement, but still requires careful
          routing and migration logic.
        </p>
      </section>

      <section>
        <h2>Cross-Shard Queries</h2>
        <p>
          Cross-shard queries fan out to multiple nodes and merge results.
          This increases latency and resource usage. Avoid them by designing
          queries to target a single shard whenever possible.
        </p>
      </section>

      <section>
        <h2>Example: Consistent Hashing Router</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const shards = ["a", "b", "c"];
function shardForKey(key) {
  return shards[hash(key) % shards.length];
}`}</code>
        </pre>
        <p>
          This is simplified. Real systems include virtual nodes and routing
          services to minimize rebalancing impact.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Sharding adds complexity:
        </p>
        <ul className="space-y-2">
          <li>Routing logic in the application or middleware.</li>
          <li>Rebalancing and data migration overhead.</li>
          <li>Cross-shard transactions are expensive or unsupported.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Pick shard keys aligned with query patterns.</li>
          <li>Plan for rebalancing early.</li>
          <li>Avoid cross-shard transactions where possible.</li>
          <li>Monitor for hotspots and skew.</li>
          <li>Use consistent hashing to reduce churn.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
