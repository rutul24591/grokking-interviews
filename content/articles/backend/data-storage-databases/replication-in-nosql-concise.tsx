"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-replication-in-nosql-concise",
  title: "Replication in NoSQL",
  description:
    "Concise guide to NoSQL replication models, trade-offs, and interview-ready concepts.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "replication-in-nosql",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "replication"],
  relatedTopics: [
    "read-replicas",
    "consistency-models",
    "cap-theorem",
  ],
};

export default function ReplicationInNoSqlConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>NoSQL replication</strong> keeps data copies across nodes for
          availability, durability, and read scaling. Replication strategies
          vary: single-leader, multi-leader, and leaderless systems each trade
          off consistency, latency, and conflict resolution.
        </p>
        <p>
          Replication improves resilience but introduces lag and potential
          conflicts, especially in multi-region systems.
        </p>
      </section>

      <section>
        <h2>Key Models</h2>
        <ul className="space-y-2">
          <li><strong>Single leader:</strong> One node accepts writes.</li>
          <li><strong>Multi-leader:</strong> Multiple nodes accept writes.</li>
          <li><strong>Leaderless:</strong> Clients write to multiple replicas.</li>
          <li><strong>Async vs sync:</strong> Lag vs latency trade-offs.</li>
          <li><strong>Conflict resolution:</strong> LWW, vector clocks, merges.</li>
        </ul>
        <p className="mt-4">
          Replication choices determine whether the system is CP or AP during
          partitions.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Leaderless write (quorum)
await db.write({ value: data, w: 2 });
const result = await db.read({ key: id, r: 2 });`}</code>
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
                ✓ Higher availability<br />
                ✓ Read scaling with replicas<br />
                ✓ Durability across failures
              </td>
              <td className="p-3">
                ✗ Replication lag and stale reads<br />
                ✗ Conflict resolution complexity<br />
                ✗ Operational complexity in failover
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use replication when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need high availability and durability</li>
          <li>• You want read scaling across nodes</li>
          <li>• Multi-region resilience is required</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Strong consistency is mandatory everywhere</li>
          <li>• Conflict resolution is hard for the domain</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain single-leader vs leaderless replication.</li>
          <li>Discuss replication lag and read-your-writes.</li>
          <li>Highlight conflict resolution strategies.</li>
          <li>Connect replication choices to CAP trade-offs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use leaderless replication?</p>
            <p className="mt-2 text-sm">
              A: It improves availability during partitions by allowing writes
              to multiple replicas, but requires conflict resolution.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is replication lag?</p>
            <p className="mt-2 text-sm">
              A: The delay between a write on the leader and its visibility on
              replicas.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do quorums help in leaderless systems?</p>
            <p className="mt-2 text-sm">
              A: Quorums ensure overlap between reads and writes, improving
              consistency while preserving availability.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens in multi-leader conflicts?</p>
            <p className="mt-2 text-sm">
              A: Conflicts must be resolved with rules like last-write-wins or
              custom merges.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
