"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-conflict-resolution-concise",
  title: "Conflict Resolution",
  description:
    "Concise guide to conflict resolution in distributed systems and interview-ready strategies.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "conflict-resolution",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "consistency", "conflicts"],
  relatedTopics: [
    "replication-in-nosql",
    "consistency-models",
    "cap-theorem",
  ],
};

export default function ConflictResolutionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Conflict resolution</strong> is how distributed systems
          reconcile divergent updates that occur during network partitions or
          concurrent writes. It is a core requirement for AP and leaderless
          systems.
        </p>
        <p>
          Common strategies include last-write-wins, version vectors, and
          application-level merges. Each trades simplicity for correctness.
        </p>
      </section>

      <section>
        <h2>Key Strategies</h2>
        <ul className="space-y-2">
          <li><strong>Last-write-wins (LWW):</strong> Choose the latest timestamp.</li>
          <li><strong>Vector clocks:</strong> Track causality and detect conflicts.</li>
          <li><strong>CRDTs:</strong> Data types that converge automatically.</li>
          <li><strong>Merge rules:</strong> Custom resolution logic.</li>
          <li><strong>Manual review:</strong> Human-driven reconciliation.</li>
        </ul>
        <p className="mt-4">
          Simpler strategies are easier to implement but may lose updates.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// LWW example
if (incoming.timestamp > current.timestamp) {
  state = incoming;
}`}</code>
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
                ✓ Ensures convergence<br />
                ✓ Enables availability during partitions<br />
                ✓ Works for distributed writes
              </td>
              <td className="p-3">
                ✗ Can lose updates (LWW)<br />
                ✗ Added complexity for merges<br />
                ✗ Hard to test edge cases
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use automated resolution when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Availability is critical</li>
          <li>• Conflicts are rare or low-risk</li>
        </ul>
        <p><strong>Use manual resolution when:</strong></p>
        <ul className="space-y-1">
          <li>• Conflicts are high-impact</li>
          <li>• Data accuracy is paramount</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain LWW vs vector clocks.</li>
          <li>Discuss CRDTs for automatic convergence.</li>
          <li>Mention trade-offs between correctness and simplicity.</li>
          <li>Connect to CAP/AP systems.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does LWW lose updates?</p>
            <p className="mt-2 text-sm">
              A: It keeps only the latest timestamp, discarding concurrent
              updates that arrive later.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are vector clocks used for?</p>
            <p className="mt-2 text-sm">
              A: They track causality and detect concurrent updates so conflicts
              can be resolved explicitly.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a CRDT?</p>
            <p className="mt-2 text-sm">
              A: A conflict-free replicated data type that converges without
              coordination.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you need manual resolution?</p>
            <p className="mt-2 text-sm">
              A: When conflicts have business impact and require human judgment.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
