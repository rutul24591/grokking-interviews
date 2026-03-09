"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-concurrency-control-concise",
  title: "Concurrency Control",
  description:
    "Quick overview of concurrency control, locking strategies, and MVCC.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "concurrency-control",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "concurrency", "transactions"],
  relatedTopics: [
    "transaction-isolation-levels",
    "deadlocks",
    "acid-properties",
  ],
};

export default function ConcurrencyControlConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Concurrency control</strong> ensures correct results when
          multiple transactions run at the same time. It prevents race
          conditions by coordinating reads and writes.
        </p>
        <p>
          The main strategies are pessimistic locking, optimistic locking, and
          MVCC (multi-version concurrency control). Each trades performance for
          correctness differently.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Pessimistic Locking:</strong> Lock first, then work.</li>
          <li><strong>Optimistic Locking:</strong> Work first, validate at commit.</li>
          <li><strong>MVCC:</strong> Readers see snapshots; writers create new versions.</li>
          <li><strong>Lock Granularity:</strong> Row vs table vs page locks.</li>
          <li><strong>Isolation Levels:</strong> Define which anomalies are allowed.</li>
        </ul>
        <p className="mt-4">
          A good rule: optimistic works best when conflicts are rare; pessimistic
          works best when conflicts are common.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Optimistic lock with version column
UPDATE orders
SET status = 'paid', version = version + 1
WHERE id = 42 AND version = 7;`}</code>
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
                ✓ Prevents lost updates<br />
                ✓ Enables safe concurrency<br />
                ✓ Clear correctness guarantees
              </td>
              <td className="p-3">
                ✗ Lock contention can reduce throughput<br />
                ✗ Deadlocks possible with locking<br />
                ✗ MVCC adds storage overhead
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Financial workflows with strict correctness</li>
          <li>• High‑concurrency systems with shared resources</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Analytics where eventual consistency is acceptable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain optimistic vs pessimistic locking with examples.</li>
          <li>Discuss MVCC and why it improves read concurrency.</li>
          <li>Mention deadlocks as a risk of locking.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use optimistic locking?</p>
            <p className="mt-2 text-sm">
              A: When conflicts are rare and you want higher concurrency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does MVCC help read performance?</p>
            <p className="mt-2 text-sm">
              A: Readers don’t block writers; they read consistent snapshots.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is lock granularity?</p>
            <p className="mt-2 text-sm">
              A: The scope of a lock (row, page, or table), which affects contention.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
