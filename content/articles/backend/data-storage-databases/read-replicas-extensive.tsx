"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-read-replicas-extensive",
  title: "Read Replicas",
  description:
    "Deep guide to read replicas, replication lag, read routing, and availability trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "read-replicas",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "replication", "availability", "scaling"],
  relatedTopics: [
    "database-partitioning",
    "concurrency-control",
    "transaction-isolation-levels",
  ],
};

export default function ReadReplicasExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Read replicas</strong> are database copies used to serve read
          traffic while a primary (or leader) node handles writes. Replicas keep
          up by streaming and applying the primary’s write log. The main goals
          are read scaling, improved availability for queries, and isolation of
          heavy analytical workloads from the write path.
        </p>
        <p>
          Replication is a core primitive in modern data systems. Most
          production setups use a mix of replicas and partitioning: replicas
          multiply read capacity, while partitioning multiplies write capacity.
        </p>
        <p>
          The practical downside is <strong>consistency lag</strong>. Because
          replicas often apply changes asynchronously, read results can be stale.
          Designing the read path to handle that staleness is the main challenge.
        </p>
      </section>

      <section>
        <h2>Topology & Data Flow</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/primary-replica-topology.svg"
          alt="Primary and replica topology"
          caption="Writes go to primary; replicas apply log streams for reads"
        />
        <p>
          The simplest topology is primary with multiple replicas. Writes
          commit on the primary and are streamed to replicas. Replicas are
          usually read-only and serve SELECT traffic.
        </p>
        <p>
          In multi-region deployments, replicas are placed close to users to
          reduce latency. This boosts performance but increases replication lag
          due to cross-region network delays.
        </p>
      </section>

      <section>
        <h2>Replication Lag & Consistency</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/replication-lag-timeline.svg"
          alt="Replication lag timeline"
          caption="Lag window between primary commit and replica visibility"
        />
        <p>
          <strong>Replication lag</strong> is the time difference between when a
          write commits on the primary and when it becomes visible on replicas.
          Lag can be milliseconds or seconds depending on load, network, and
          replica capacity.
        </p>
        <p>
          Stale reads are acceptable for some use cases (feeds, analytics) but
          problematic for others (payments, inventory). Systems often define
          “read-after-write” guarantees for sensitive flows.
        </p>
        <p>
          Common approaches to mitigate lag impact:
        </p>
        <ul className="space-y-2">
          <li><strong>Read-your-writes:</strong> Route reads to primary after a write.</li>
          <li><strong>Session pinning:</strong> Keep a user on primary for a short time window.</li>
          <li><strong>Replica lag checks:</strong> Use replicas only if they are caught up.</li>
          <li><strong>Client-side tolerance:</strong> Show “eventual” states where acceptable.</li>
        </ul>
      </section>

      <section>
        <h2>Async vs Sync Replication</h2>
        <p>
          In <strong>asynchronous replication</strong>, the primary commits a
          write without waiting for replicas. This yields fast writes but
          introduces lag and the risk of data loss if the primary fails before
          replicas catch up.
        </p>
        <p>
          In <strong>synchronous replication</strong>, the primary waits for one
          or more replicas to confirm before committing. This improves durability
          and consistency but increases write latency and lowers throughput.
        </p>
        <p>
          Many systems use “semi-sync” strategies, requiring at least one replica
          to acknowledge. This balances durability with performance.
        </p>
      </section>

      <section>
        <h2>Read Routing Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/read-routing.svg"
          alt="Read routing strategy"
          caption="Read routing balances latency, load, and consistency needs"
        />
        <p>
          Read routing decides whether a query goes to the primary or a replica.
          Good routing improves performance and avoids surprising staleness.
        </p>
        <p>
          Practical patterns include:
        </p>
        <ul className="space-y-2">
          <li><strong>Primary for writes + critical reads:</strong> safest for consistency.</li>
          <li><strong>Replicas for read-heavy endpoints:</strong> feeds, dashboards, search.</li>
          <li><strong>Replica tiers:</strong> low-latency local replicas vs. heavy analytics replicas.</li>
          <li><strong>Lag-aware routing:</strong> avoid replicas that fall behind.</li>
        </ul>
      </section>

      <section>
        <h2>Failover and Promotion</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/failover-promotion.svg"
          alt="Replica promotion"
          caption="Failover promotes a replica and updates clients to avoid split brain"
        />
        <p>
          When the primary fails, a replica is promoted to become the new
          primary. This requires coordination to prevent split brain (two
          primaries accepting writes).
        </p>
        <p>
          Failover steps usually include:
        </p>
        <ul className="space-y-2">
          <li>Detect primary failure (health checks, consensus service).</li>
          <li>Select the most up-to-date replica.</li>
          <li>Promote it to primary and reconfigure others to follow.</li>
          <li>Update application routing or connection endpoints.</li>
        </ul>
        <p className="mt-4">
          If replication is asynchronous, some writes may be lost during
          failover. Systems that require strict durability must use synchronous
          replication or external consensus to commit.
        </p>
      </section>

      <section>
        <h2>Example: Application Read/Write Split</h2>
        <p>
          This simplified Node example uses a primary connection for writes and
          a pool of replicas for reads. Production systems typically use a
          connection proxy or library that handles routing automatically.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function pickReplica() {
  const i = Math.floor(Math.random() * replicas.length);
  return replicas[i];
}

async function getUserProfile(userId) {
  const db = pickReplica();
  const result = await db.query(
    "SELECT id, name, plan FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0];
}

async function updateUserPlan(userId, plan) {
  const result = await primary.query(
    "UPDATE users SET plan = $1 WHERE id = $2 RETURNING id",
    [plan, userId]
  );
  return result.rows[0];
}`}</code>
        </pre>
        <p>
          For read-after-write, you can route the next few reads to the primary
          or check replica lag before using a replica.
        </p>
      </section>

      <section>
        <h2>Example: Lag-Aware Reads</h2>
        <p>
          Some systems expose the replication delay for each replica. You can
          choose a replica only if it is within an acceptable lag threshold.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const MAX_LAG_MS = 200;

function pickReplicaWithLag() {
  const healthy = replicas.filter((r) => r.lagMs < MAX_LAG_MS);
  return (healthy.length ? healthy : replicas)[0];
}`}</code>
        </pre>
        <p>
          This approach is common for user-facing reads where small staleness
          is acceptable but large delays are not.
        </p>
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <p>
          Running replicas introduces operational tasks: provisioning, monitoring
          lag, managing storage, and ensuring backups are consistent.
        </p>
        <p>
          Key metrics to track:
        </p>
        <ul className="space-y-2">
          <li><strong>Replica lag:</strong> time behind primary.</li>
          <li><strong>Replica load:</strong> query rate and CPU usage.</li>
          <li><strong>Replication errors:</strong> log application failures.</li>
          <li><strong>Failover time:</strong> how long to promote and reroute.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Decide which endpoints tolerate stale reads and route accordingly.</li>
          <li>Implement read-your-writes for critical user flows.</li>
          <li>Monitor replication lag and set alert thresholds.</li>
          <li>Have a clear failover and promotion process.</li>
          <li>Test failover regularly to avoid surprises during incidents.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
