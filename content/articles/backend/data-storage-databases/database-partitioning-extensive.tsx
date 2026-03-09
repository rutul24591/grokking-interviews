"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-partitioning-extensive",
  title: "Database Partitioning",
  description:
    "Deep guide to database partitioning strategies, shard keys, rebalancing, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-partitioning",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "partitioning", "scaling", "sharding"],
  relatedTopics: [
    "read-replicas",
    "database-indexes",
    "query-optimization-techniques",
  ],
};

export default function DatabasePartitioningExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Database partitioning</strong> splits a logical dataset into
          smaller physical segments so queries and writes can scale beyond the
          limits of a single table or node. Partitioning can happen inside one
          database instance (table partitions) or across multiple nodes (shards).
        </p>
        <p>
          The motivation is straightforward: large tables become slow to scan,
          expensive to maintain, and hard to back up. By splitting the table,
          you can reduce index sizes, prune irrelevant partitions, and isolate
          hot data from cold data.
        </p>
        <p>
          Partitioning is not replication. Replication copies the same data for
          availability and read scaling. Partitioning divides the data itself.
          Most scalable systems use both: partitioning for write scale and
          replication for read scale and resilience.
        </p>
      </section>

      <section>
        <h2>Why Partition?</h2>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Partition pruning reduces I/O by
            skipping partitions that cannot match the query.
          </li>
          <li>
            <strong>Write throughput:</strong> Shards can accept writes in
            parallel across nodes.
          </li>
          <li>
            <strong>Operational control:</strong> Old partitions can be archived
            or dropped without touching hot data.
          </li>
          <li>
            <strong>Failure containment:</strong> Issues in one partition are
            less likely to impact others.
          </li>
        </ul>
        <p className="mt-4">
          The trade-off is complexity. Partitioned systems need routing logic,
          rebalancing strategies, and careful observability. The cost is worth
          it only when a single-node design can no longer meet scale targets.
        </p>
      </section>

      <section>
        <h2>Partitioning Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/partitioning-strategies.svg"
          alt="Partitioning strategies"
          caption="Range, hash, and list partitioning use different placement rules"
        />
        <ul className="space-y-2">
          <li>
            <strong>Range:</strong> Partitions hold value ranges (date or numeric
            ranges). Great for time-series workloads and archival.
          </li>
          <li>
            <strong>Hash:</strong> Hash the key and map to partitions. Good for
            even distribution and write-heavy workloads.
          </li>
          <li>
            <strong>List:</strong> Explicit values map to partitions (regions,
            tenant tiers). Useful when categories are finite and known.
          </li>
          <li>
            <strong>Composite:</strong> Combine strategies (range then hash) to
            balance time-based pruning with load distribution.
          </li>
        </ul>
        <p className="mt-4">
          Strategy choice should match access patterns. If most queries are
          time-bounded, range partitioning offers natural pruning. If workload
          is evenly distributed by user_id, hash partitioning can prevent hot
          spots and balance throughput.
        </p>
      </section>

      <section>
        <h2>Horizontal vs Vertical Partitioning</h2>
        <p>
          <strong>Horizontal partitioning</strong> splits rows across partitions.
          This is the dominant strategy when scaling writes and storage.
        </p>
        <p>
          <strong>Vertical partitioning</strong> splits columns into multiple
          tables. It isolates large or rarely used fields (e.g., blobs, JSON)
          and keeps hot columns in a narrower, faster table.
        </p>
        <p>
          A common pattern is a skinny hot table for frequent reads and a
          separate cold table for rarely accessed data. This is a local form of
          optimization and does not provide shard-level scale.
        </p>
      </section>

      <section>
        <h2>Shard Key Selection</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/shard-key-hotspots.svg"
          alt="Shard key hotspots"
          caption="A poor shard key creates hotspots and uneven partitions"
        />
        <p>
          The shard key decides where each row lives. A good key spreads data
          evenly and aligns with query patterns. A poor key produces hotspots,
          where a small number of partitions handle most traffic.
        </p>
        <p>
          Common shard key candidates include user_id, tenant_id, or
          organization_id. Avoid keys that monotonically increase (like auto
          increment) because they funnel writes into a single shard.
        </p>
        <p>
          When no single key is ideal, composite keys or hashing strategies can
          help. For example, hash(user_id) distributes load evenly but reduces
          range-based queries. There is no free lunch: you trade query simplicity
          for distribution or vice versa.
        </p>
      </section>

      <section>
        <h2>Partition Pruning and Query Planning</h2>
        <p>
          Databases can skip partitions that cannot contain matching rows. This
          is called <strong>partition pruning</strong>. It is one of the biggest
          performance wins in partitioned systems.
        </p>
        <p>
          For pruning to work, queries must include the partition key in
          predicates. If queries omit the key, the engine has to scan all
          partitions, losing the benefit.
        </p>
        <p>
          Partition-aware query design becomes important. This often means
          pushing partition keys into primary API routes and adding filters
          like tenant_id or date ranges to queries.
        </p>
      </section>

      <section>
        <h2>Operational Lifecycle</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/partition-rebalancing.svg"
          alt="Partition rebalancing"
          caption="Rebalancing moves ranges or hash buckets to keep load even"
        />
        <p>
          Partitioning adds an operational lifecycle: create partitions, manage
          growth, archive old partitions, and rebalance when skew appears.
        </p>
        <p>
          Range partitions are often created ahead of time (monthly or quarterly)
          and old partitions are detached and archived. Hash partitions can be
          rebalanced by adding new buckets, but that requires data movement and
          can be expensive.
        </p>
        <p>
          A production-ready partitioning plan includes automation for partition
          creation, monitoring for skew, and a playbook for rebalancing without
          downtime.
        </p>
      </section>

      <section>
        <h2>Cross-Partition Queries</h2>
        <p>
          Cross-partition queries require fan-out to multiple partitions and
          merging results. This introduces latency, extra I/O, and coordination
          overhead. Joins across partitions are particularly expensive.
        </p>
        <p>
          To reduce fan-out, you can introduce derived tables, summary tables,
          or search indexes. The trade-off is additional storage and maintenance.
        </p>
        <p>
          Some systems introduce a routing layer that knows where partitions
          live and can execute queries in parallel across nodes.
        </p>
      </section>

      <section>
        <h2>Transactions and Consistency</h2>
        <p>
          Transactions are easy inside a single partition but complex across
          partitions. Cross-shard transactions require two-phase commit (2PC)
          or a coordination service, which adds latency and potential blocking.
        </p>
        <p>
          Many high-scale systems avoid cross-partition transactions by design.
          They keep business logic within a single shard or use eventual
          consistency with compensating actions.
        </p>
        <p>
          The key is to align data boundaries with transactional boundaries so
          that most operations remain local.
        </p>
      </section>

      <section>
        <h2>Example: Postgres Range Partitioning</h2>
        <p>
          PostgreSQL supports native table partitioning. A common pattern is to
          partition large event tables by time so older partitions can be
          archived cheaply.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  created_at DATE NOT NULL,
  event_type TEXT NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_01 PARTITION OF events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE INDEX idx_events_tenant_id ON events_2026_01 (tenant_id);`}</code>
        </pre>
        <p>
          Notice that indexes are created per-partition. For high write volumes,
          this can reduce global index contention and keep index sizes smaller.
        </p>
      </section>

      <section>
        <h2>Example: Application-Level Sharding</h2>
        <p>
          When partitioning across nodes, the application often owns routing.
          Below is a simplified Node example that routes by user_id using
          consistent hashing.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const crypto = require("crypto");
const shards = [
  { id: "shard-a", db: dbA },
  { id: "shard-b", db: dbB },
  { id: "shard-c", db: dbC },
];

function shardForUser(userId) {
  const hash = crypto.createHash("sha1").update(String(userId)).digest("hex");
  const bucket = parseInt(hash.slice(0, 4), 16) % shards.length;
  return shards[bucket];
}

async function getUserOrders(userId) {
  const shard = shardForUser(userId);
  return shard.db.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
}`}</code>
        </pre>
        <p>
          This example is intentionally simple. Real systems use a routing
          service, shard maps, and safe rebalancing to avoid reshuffling all data.
        </p>
      </section>

      <section>
        <h2>Monitoring & Failure Modes</h2>
        <p>
          Partitioned systems need strong observability: per-partition write
          rates, queue depth, storage growth, and latency percentiles.
        </p>
        <p>
          Common failure modes include:
        </p>
        <ul className="space-y-2">
          <li><strong>Hot partitions:</strong> Uneven access overwhelms one shard.</li>
          <li><strong>Skewed growth:</strong> One partition grows faster and hits limits.</li>
          <li><strong>Rebalancing pain:</strong> Data moves are slow and risky.</li>
          <li><strong>Fan-out overload:</strong> Cross-partition queries degrade latency.</li>
        </ul>
        <p className="mt-4">
          Detection is easier than prevention: always monitor for uneven load and
          plan rebalancing well before a shard hits capacity.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Pick a shard key aligned to query patterns and access distribution.</li>
          <li>Ensure most operations are local to a single partition.</li>
          <li>Automate partition creation and archival.</li>
          <li>Plan a rebalancing strategy before you need it.</li>
          <li>Measure fan-out queries and optimize them early.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
