"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-transaction-isolation-levels-extensive",
  title: "Transaction Isolation Levels",
  description:
    "Comprehensive guide to transaction isolation levels, anomalies, and trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "transaction-isolation-levels",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "transactions", "isolation"],
  relatedTopics: [
    "acid-properties",
    "concurrency-control",
    "deadlocks",
  ],
};

export default function TransactionIsolationLevelsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Isolation levels</strong> define how concurrently executing
          transactions interact. They trade correctness for concurrency by
          allowing or preventing specific anomalies.
        </p>
        <p>
          In production, the right isolation level depends on business needs.
          Financial systems require strict isolation, while analytics systems
          often accept weaker guarantees for throughput.
        </p>
      </section>

      <section>
        <h2>Isolation Spectrum</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/transaction-isolation.svg"
          alt="Isolation levels"
          caption="Higher isolation reduces anomalies but increases overhead"
        />
        <p>
          The standard levels are Read Uncommitted, Read Committed, Repeatable
          Read, and Serializable. Each level prevents a broader set of anomalies.
        </p>
      </section>

      <section>
        <h2>Anomalies Explained</h2>
        <ul className="space-y-2">
          <li><strong>Dirty Read:</strong> Reading uncommitted data.</li>
          <li><strong>Non-Repeatable Read:</strong> Same row changes between reads.</li>
          <li><strong>Phantom Read:</strong> New rows appear in a repeated query.</li>
        </ul>
        <p>
          Isolation levels are essentially a promise about which anomalies you
          will not see. The more anomalies you prevent, the more locking or
          versioning overhead you pay.
        </p>
      </section>

      <section>
        <h2>Read Committed</h2>
        <p>
          Read Committed prevents dirty reads. It is often the default in many
          databases (e.g., Postgres). It allows non-repeatable reads and phantoms,
          which is acceptable for many workloads.
        </p>
      </section>

      <section>
        <h2>Repeatable Read</h2>
        <p>
          Repeatable Read prevents non-repeatable reads by ensuring consistent
          snapshots. It may still allow phantoms depending on the database
          implementation. It is a common default in MySQL (InnoDB).
        </p>
      </section>

      <section>
        <h2>Serializable</h2>
        <p>
          Serializable is the strongest isolation level. It ensures transactions
          behave as if executed one at a time. This prevents all anomalies but
          reduces concurrency and can increase transaction conflicts.
        </p>
      </section>

      <section>
        <h2>Implementation Details: Locks vs MVCC</h2>
        <p>
          Isolation can be implemented with locking or MVCC. Locking blocks
          concurrent access, while MVCC provides snapshot isolation using versioned
          rows. MVCC improves concurrency but adds storage and cleanup overhead.
        </p>
      </section>

      <section>
        <h2>Choosing the Right Level</h2>
        <p>
          Use stronger isolation for correctness-critical workflows (payments,
          inventory). Use weaker isolation for read-heavy systems where absolute
          consistency is not required.
        </p>
        <p>
          Always test under real workloads. The cost of strict isolation may be
          acceptable for low-throughput systems but devastating at scale.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Document isolation requirements per workflow.</li>
          <li>Test concurrency scenarios for anomalies.</li>
          <li>Monitor lock contention and transaction retries.</li>
          <li>Prefer MVCC where supported for read-heavy workloads.</li>
          <li>Use Serializable only when correctness demands it.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
