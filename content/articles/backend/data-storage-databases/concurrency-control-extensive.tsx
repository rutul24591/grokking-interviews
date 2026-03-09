"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-concurrency-control-extensive",
  title: "Concurrency Control",
  description:
    "Comprehensive guide to concurrency control, locking, MVCC, and trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "concurrency-control",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "concurrency", "transactions"],
  relatedTopics: [
    "transaction-isolation-levels",
    "deadlocks",
    "acid-properties",
  ],
};

export default function ConcurrencyControlExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Concurrency control</strong> ensures correct results when
          multiple transactions execute simultaneously. Without it, race
          conditions lead to lost updates, inconsistent reads, and corrupted
          business state.
        </p>
        <p>
          Concurrency control is the backbone of transactional databases. It
          determines how much parallelism the system can tolerate while still
          delivering correctness.
        </p>
      </section>

      <section>
        <h2>Core Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/concurrency-control.svg"
          alt="Concurrency control"
          caption="Pessimistic vs optimistic vs MVCC"
        />
        <p>
          The three dominant strategies are pessimistic locking, optimistic
          locking, and MVCC. Each makes a different trade-off between conflict
          handling and throughput.
        </p>
      </section>

      <section>
        <h2>Pessimistic Locking</h2>
        <p>
          Pessimistic locking assumes conflicts are likely, so it locks data
          before operating. This prevents concurrent writes but reduces
          concurrency. It is useful for highly contended resources.
        </p>
        <p>
          The downside is lock contention and deadlocks. Long-running
          transactions can block the system.
        </p>
      </section>

      <section>
        <h2>Optimistic Locking</h2>
        <p>
          Optimistic locking assumes conflicts are rare. It lets transactions
          proceed without locks, then validates at commit using version columns
          or timestamps. If a conflict is detected, one transaction retries.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`UPDATE orders
SET status = 'paid', version = version + 1
WHERE id = 42 AND version = 7;`}</code>
        </pre>
        <p>
          Optimistic locking is common in web applications because conflicts are
          usually rare. It improves throughput but requires retry logic.
        </p>
      </section>

      <section>
        <h2>MVCC (Multi-Version Concurrency Control)</h2>
        <p>
          MVCC keeps multiple versions of a row. Readers see a consistent
          snapshot while writers create new versions. This avoids reader‑writer
          blocking and improves read throughput.
        </p>
        <p>
          MVCC increases storage and cleanup overhead. Vacuuming or garbage
          collection is required to remove obsolete versions.
        </p>
      </section>

      <section>
        <h2>Lock Granularity</h2>
        <p>
          Locks can be at row, page, or table level. Finer granularity improves
          concurrency but increases overhead. Coarser granularity reduces
          overhead but increases contention.
        </p>
        <p>
          Most OLTP systems use row-level locks to maximize concurrency, while
          some maintenance operations may escalate to table locks.
        </p>
      </section>

      <section>
        <h2>Isolation Levels and Anomalies</h2>
        <p>
          Concurrency control is closely tied to isolation levels. Higher
          isolation reduces anomalies but increases locking or versioning cost.
          Read Committed and Repeatable Read are common defaults.
        </p>
        <p>
          Choose isolation levels based on business criticality rather than
          convenience.
        </p>
      </section>

      <section>
        <h2>Deadlocks and Prevention</h2>
        <p>
          Deadlocks occur when two transactions wait on each other’s locks.
          Most databases detect and abort one transaction. Preventing deadlocks
          requires consistent lock ordering and short transactions.
        </p>
      </section>

      <section>
        <h2>Operational Monitoring</h2>
        <p>
          Monitor lock wait times, transaction retries, and deadlock frequency.
          Rising contention usually signals a schema or query design issue.
        </p>
        <p>
          For MVCC systems, monitor vacuum lag or version bloat to prevent
          storage growth and performance degradation.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Use optimistic locking when conflicts are rare.</li>
          <li>Keep transactions short to reduce contention.</li>
          <li>Monitor lock waits and deadlocks.</li>
          <li>Use MVCC for high read concurrency.</li>
          <li>Implement retry logic for aborted transactions.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
