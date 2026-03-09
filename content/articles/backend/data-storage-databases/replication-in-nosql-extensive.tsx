"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-replication-in-nosql-extensive",
  title: "Replication in NoSQL",
  description:
    "Deep guide to NoSQL replication models, consistency trade-offs, and conflict resolution.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "replication-in-nosql",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "replication"],
  relatedTopics: [
    "read-replicas",
    "consistency-models",
    "cap-theorem",
  ],
};

export default function ReplicationInNoSqlExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>NoSQL replication</strong> keeps multiple copies of data across
          nodes to improve availability, durability, and read throughput.
          Replication strategies differ in how they handle writes and resolve
          conflicts.
        </p>
        <p>
          The primary trade-off is consistency vs availability. Stronger
          consistency requires more coordination, while higher availability
          allows divergence that must be resolved later.
        </p>
        <p>
          Replication is the backbone of resilient NoSQL systems operating at
          global scale.
        </p>
      </section>

      <section>
        <h2>Replication Models</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/replication-models.svg"
          alt="Replication models"
          caption="Single leader, multi-leader, and leaderless designs"
        />
        <ul className="space-y-2">
          <li><strong>Single-leader:</strong> One node accepts writes.</li>
          <li><strong>Multi-leader:</strong> Multiple nodes accept writes.</li>
          <li><strong>Leaderless:</strong> Writes go to multiple replicas directly.</li>
        </ul>
        <p className="mt-4">
          Each model makes different trade-offs in latency, availability, and
          conflict resolution complexity.
        </p>
      </section>

      <section>
        <h2>Replication Lag and Staleness</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/replication-lag-nosql.svg"
          alt="Replication lag in NoSQL"
          caption="Replication lag creates staleness windows"
        />
        <p>
          Lag is the delay between a write and its visibility on replicas. In
          asynchronous replication, lag can range from milliseconds to seconds.
        </p>
        <p>
          Systems mitigate lag by routing critical reads to leaders or using
          read-your-writes guarantees.
        </p>
      </section>

      <section>
        <h2>Quorums in Leaderless Systems</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/leaderless-quorums.svg"
          alt="Leaderless quorums"
          caption="Quorums improve consistency without full coordination"
        />
        <p>
          Leaderless systems rely on quorum reads and writes. If R + W &gt; N,
          reads overlap writes, yielding stronger consistency.
        </p>
        <p>
          Lower quorum values improve availability but allow stale reads.
        </p>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/replication-conflicts.svg"
          alt="Replication conflicts"
          caption="Conflicts require reconciliation rules"
        />
        <p>
          Multi-leader and leaderless systems can produce conflicting updates.
          Common strategies include:
        </p>
        <ul className="space-y-2">
          <li><strong>Last-write-wins:</strong> Use timestamps.</li>
          <li><strong>Vector clocks:</strong> Track causality.</li>
          <li><strong>Application merges:</strong> Custom conflict resolution.</li>
        </ul>
      </section>

      <section>
        <h2>Example: Quorum Writes</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Leaderless write
await db.write({ key: "user:1", value: data, w: 2 });
const read = await db.read({ key: "user:1", r: 2 });`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Replication adds complexity:
        </p>
        <ul className="space-y-2">
          <li>Monitoring lag and replica health.</li>
          <li>Handling split-brain scenarios.</li>
          <li>Conflict resolution logic.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Choose replication model based on consistency requirements.</li>
          <li>Define conflict resolution rules early.</li>
          <li>Monitor lag and availability metrics.</li>
          <li>Use quorum settings to tune trade-offs.</li>
          <li>Test failover scenarios regularly.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
