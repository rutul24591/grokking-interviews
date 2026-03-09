"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-consistency-models-concise",
  title: "Consistency Models",
  description:
    "Concise guide to consistency models, trade-offs, and interview-ready concepts.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "consistency-models",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "consistency"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "read-replicas",
  ],
};

export default function ConsistencyModelsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Consistency models</strong> define how and when updates become
          visible across replicas in distributed systems. They shape the
          guarantees you can make to users, from strict correctness to eventual
          convergence.
        </p>
        <p>
          The strongest models (linearizability) are simplest to reason about
          but require coordination. Weaker models increase availability and
          performance but can return stale or conflicting data.
        </p>
      </section>

      <section>
        <h2>Key Models</h2>
        <ul className="space-y-2">
          <li><strong>Strong (Linearizable):</strong> Reads always see latest write.</li>
          <li><strong>Sequential:</strong> All nodes see writes in same order.</li>
          <li><strong>Read-after-write:</strong> A user sees their own writes.</li>
          <li><strong>Monotonic reads:</strong> Reads never go backwards.</li>
          <li><strong>Eventual:</strong> Replicas converge over time.</li>
        </ul>
        <p className="mt-4">
          Stronger consistency simplifies application logic but costs latency
          and availability. Weaker consistency requires app-level handling.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Tunable consistency example
await db.write({ consistency: "quorum", value: data });
const result = await db.read({ consistency: "local" });`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Stronger Consistency</th>
              <th className="p-3 text-left">Weaker Consistency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Easier reasoning<br />
                ✓ Correctness guarantees<br />
                ✓ Less conflict resolution
              </td>
              <td className="p-3">
                ✓ Higher availability<br />
                ✓ Lower latency<br />
                ✓ Better partition tolerance
              </td>
            </tr>
            <tr>
              <td className="p-3">
                ✗ Higher latency<br />
                ✗ Lower availability during failures
              </td>
              <td className="p-3">
                ✗ Stale reads possible<br />
                ✗ App-level reconciliation needed
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use strong consistency when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Financial correctness is required</li>
          <li>• Users cannot tolerate stale data</li>
        </ul>
        <p><strong>Use eventual consistency when:</strong></p>
        <ul className="space-y-1">
          <li>• Availability and latency matter most</li>
          <li>• Data is not highly sensitive to staleness</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain linearizable vs eventual in plain language.</li>
          <li>Relate consistency to CAP trade-offs.</li>
          <li>Mention read-your-writes as a user-level guarantee.</li>
          <li>Discuss quorum reads/writes as a tuning mechanism.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is linearizability?</p>
            <p className="mt-2 text-sm">
              A: Every read sees the latest write, as if operations happened in
              a single global order.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is read-your-writes consistency?</p>
            <p className="mt-2 text-sm">
              A: A user always sees their own writes immediately, even if others
              may not.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why choose eventual consistency?</p>
            <p className="mt-2 text-sm">
              A: It improves availability and latency, especially under
              partitions, at the cost of temporary staleness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do quorums affect consistency?</p>
            <p className="mt-2 text-sm">
              A: Higher R/W quorum values increase consistency but reduce
              availability and add latency.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
