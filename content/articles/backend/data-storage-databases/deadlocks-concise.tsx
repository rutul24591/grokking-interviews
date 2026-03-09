"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-deadlocks-concise",
  title: "Deadlocks",
  description:
    "Quick overview of deadlocks, detection, and prevention strategies.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "deadlocks",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "transactions", "deadlocks"],
  relatedTopics: [
    "concurrency-control",
    "transaction-isolation-levels",
    "acid-properties",
  ],
};

export default function DeadlocksConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Deadlocks</strong> happen when two or more transactions wait
          on each other’s locks in a cycle. None can proceed, so the database
          must break the cycle by aborting one transaction.
        </p>
        <p>
          Deadlocks are normal in concurrent systems. The goal is to detect
          them quickly and design transactions to reduce their frequency.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Cycle:</strong> Tx A waits on Tx B, and Tx B waits on Tx A.</li>
          <li><strong>Detection:</strong> DB detects cycle and aborts one transaction.</li>
          <li><strong>Prevention:</strong> Consistent lock ordering avoids cycles.</li>
          <li><strong>Timeouts:</strong> Locks can timeout to prevent long waits.</li>
          <li><strong>Retries:</strong> Aborted transactions must retry safely.</li>
        </ul>
        <p className="mt-4">
          Deadlocks aren’t bugs; they are a concurrency side effect. You manage
          them with ordering, shorter transactions, and retries.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Tx A locks row 1 then row 2
-- Tx B locks row 2 then row 1
-- Deadlock forms if both wait`}</code>
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
                ✓ Protects data integrity<br />
                ✓ Guarantees progress by aborting one txn
              </td>
              <td className="p-3">
                ✗ Aborted transactions add latency<br />
                ✗ More retries under contention
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• High-concurrency transactional systems</li>
          <li>• Workflows requiring strict locking</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Workloads that can use optimistic locking</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain deadlock cycles clearly.</li>
          <li>Discuss lock ordering as prevention.</li>
          <li>Call out retry logic for aborted transactions.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does a database resolve deadlocks?</p>
            <p className="mt-2 text-sm">
              A: It detects a cycle and aborts one transaction to break it.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent deadlocks?</p>
            <p className="mt-2 text-sm">
              A: Use consistent lock ordering, keep transactions short, and avoid long waits.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should clients do after a deadlock?</p>
            <p className="mt-2 text-sm">
              A: Retry the transaction with backoff.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
