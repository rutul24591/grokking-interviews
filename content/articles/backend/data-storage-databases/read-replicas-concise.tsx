"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-read-replicas-concise",
  title: "Read Replicas",
  description:
    "Concise guide to read replicas, replication lag, and read scaling for backend interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "read-replicas",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "replication", "scaling"],
  relatedTopics: [
    "database-partitioning",
    "concurrency-control",
    "transaction-isolation-levels",
  ],
};

export default function ReadReplicasConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Read replicas</strong> are copies of a primary database used
          to serve read traffic. Writes go to the primary, and replicas follow
          by applying the primary’s write log. The goal is to scale reads,
          improve availability, and reduce load on the primary.
        </p>
        <p>
          Replication is usually asynchronous, which means replicas can lag.
          That lag affects consistency and requires careful read routing.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Primary/Replica:</strong> Primary handles writes; replicas
            replay changes for reads.
          </li>
          <li>
            <strong>Replication lag:</strong> Time between write on primary and
            visibility on replica.
          </li>
          <li>
            <strong>Async vs Sync:</strong> Async gives speed; sync gives stronger
            consistency but slower writes.
          </li>
          <li>
            <strong>Read routing:</strong> Send read-only queries to replicas,
            write or read-after-write to primary.
          </li>
          <li>
            <strong>Failover:</strong> Promote a replica when the primary fails.
          </li>
          <li>
            <strong>Read-your-writes:</strong> Users may need primary reads after
            a write to avoid stale data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Simple read/write split
app.get("/api/orders/:id", async (req, res) => {
  const db = replicas.pick();
  const order = await db.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  return res.json(order.rows[0]);
});

app.post("/api/orders", async (req, res) => {
  const order = await primary.query(
    "INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING id",
    [req.body.user_id, req.body.total_cents]
  );
  return res.status(201).json({ id: order.rows[0].id });
});`}</code>
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
                ✓ Scales read traffic<br />
                ✓ Reduces load on primary<br />
                ✓ Improves availability for reads<br />
                ✓ Enables reporting workloads
              </td>
              <td className="p-3">
                ✗ Replication lag causes staleness<br />
                ✗ Failover complexity and split brain risk<br />
                ✗ Extra storage and operational overhead<br />
                ✗ Reads must be carefully routed
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use read replicas when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Read traffic is far higher than writes</li>
          <li>• Reporting or analytics queries are heavy</li>
          <li>• You need higher read availability</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Strong read-after-write consistency is required</li>
          <li>• Writes are already the bottleneck</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Always mention replication lag and its impact on consistency.</li>
          <li>Explain read routing and read-your-writes strategies.</li>
          <li>Describe failover and replica promotion at a high level.</li>
          <li>Distinguish between async and sync replication trade-offs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do read replicas introduce stale reads?</p>
            <p className="mt-2 text-sm">
              A: Replication is usually asynchronous, so replicas apply writes
              after a delay. Reads can see old data until the lag catches up.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure read-your-writes consistency?</p>
            <p className="mt-2 text-sm">
              A: Route reads to the primary for a window after a write or track
              the last write timestamp and only use replicas that are caught up.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when the primary fails?</p>
            <p className="mt-2 text-sm">
              A: A replica is promoted to primary and clients update routing.
              This needs coordination to avoid split brain.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose synchronous replication?</p>
            <p className="mt-2 text-sm">
              A: When strong consistency is required, accepting higher write
              latency for guaranteed durability across nodes.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
