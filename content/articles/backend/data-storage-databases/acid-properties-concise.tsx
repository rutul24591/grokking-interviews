"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-acid-properties-concise",
  title: "ACID Properties",
  description:
    "Quick overview of ACID properties for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "acid-properties",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "acid"],
  relatedTopics: [
    "transaction-isolation-levels",
    "concurrency-control",
    "database-constraints",
  ],
};

export default function AcidPropertiesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>ACID</strong> describes the guarantees of transactional databases:
          Atomicity, Consistency, Isolation, and Durability. These properties
          ensure correctness when multiple operations must succeed together.
        </p>
        <p>
          In practice, ACID is what makes money transfers, inventory updates,
          and financial ledgers reliable. Without ACID, partial failures would
          corrupt data.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Atomicity:</strong> All changes succeed or none do.</li>
          <li><strong>Consistency:</strong> Transactions keep data valid.</li>
          <li><strong>Isolation:</strong> Concurrent transactions don’t interfere.</li>
          <li><strong>Durability:</strong> Committed data survives crashes.</li>
          <li><strong>Isolation Levels:</strong> Tune the balance of correctness vs speed.</li>
        </ul>
        <p className="mt-4">
          The key trade-off is performance. Higher isolation and durability
          increase correctness but can reduce throughput.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
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
                ✓ Strong correctness guarantees<br />
                ✓ Safe concurrent updates<br />
                ✓ Reliable recovery from crashes
              </td>
              <td className="p-3">
                ✗ Higher latency under heavy load<br />
                ✗ Lock contention can reduce throughput<br />
                ✗ Harder to scale writes horizontally
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Financial transactions and payments</li>
          <li>• Inventory and booking systems</li>
          <li>• Any workflow requiring strict correctness</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• High-throughput analytics</li>
          <li>• Eventual consistency workloads</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain each ACID property with a real example.</li>
          <li>Discuss isolation levels and trade-offs.</li>
          <li>Highlight how durability depends on WAL and replication.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does atomicity guarantee?</p>
            <p className="mt-2 text-sm">
              A: A transaction either commits fully or rolls back fully, with no partial state.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do isolation levels exist?</p>
            <p className="mt-2 text-sm">
              A: To trade strict correctness for performance based on workload needs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How is durability implemented?</p>
            <p className="mt-2 text-sm">
              A: Through write-ahead logs, fsync, and replication to stable storage.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
