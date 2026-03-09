"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-transaction-isolation-levels-concise",
  title: "Transaction Isolation Levels",
  description:
    "Quick overview of transaction isolation levels and the anomalies they prevent.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "transaction-isolation-levels",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "transactions"],
  relatedTopics: [
    "acid-properties",
    "concurrency-control",
    "deadlocks",
  ],
};

export default function TransactionIsolationLevelsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Isolation levels</strong> define how transactions interact when
          they run concurrently. Higher isolation prevents more anomalies but
          reduces concurrency and throughput.
        </p>
        <p>
          Most production systems use Read Committed or Repeatable Read as a
          balance of correctness and performance.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Read Uncommitted:</strong> Allows dirty reads.</li>
          <li><strong>Read Committed:</strong> Prevents dirty reads.</li>
          <li><strong>Repeatable Read:</strong> Prevents non-repeatable reads.</li>
          <li><strong>Serializable:</strong> Prevents all anomalies.</li>
          <li><strong>Phantoms:</strong> New rows appear in the same query.</li>
        </ul>
        <p className="mt-4">
          The trade-off: stronger isolation means fewer anomalies but more locking.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- PostgreSQL isolation
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM orders WHERE status = 'open';
COMMIT;`}</code>
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
                ✓ Prevents data anomalies<br />
                ✓ Clear correctness guarantees<br />
                ✓ Safer concurrent writes
              </td>
              <td className="p-3">
                ✗ Higher lock contention<br />
                ✗ Lower throughput at high isolation<br />
                ✗ More complex tuning
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Financial transactions (Serializable/Repeatable Read)</li>
          <li>• High‑throughput services (Read Committed)</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Analytics where eventual consistency is acceptable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain dirty reads, non-repeatable reads, and phantoms.</li>
          <li>Discuss why Serializable is slower.</li>
          <li>Know common defaults (Read Committed in many DBs).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What anomaly does Repeatable Read prevent?</p>
            <p className="mt-2 text-sm">
              A: It prevents non-repeatable reads, but may allow phantom reads.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not always use Serializable?</p>
            <p className="mt-2 text-sm">
              A: It reduces concurrency and can significantly hurt throughput.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does Read Committed guarantee?</p>
            <p className="mt-2 text-sm">
              A: You only see committed data, but repeated reads may change.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
