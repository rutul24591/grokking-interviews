"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-deadlocks-extensive",
  title: "Deadlocks",
  description:
    "Comprehensive guide to deadlocks, detection, prevention, and recovery strategies.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "deadlocks",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "transactions", "deadlocks"],
  relatedTopics: [
    "concurrency-control",
    "transaction-isolation-levels",
    "acid-properties",
  ],
};

export default function DeadlocksExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Deadlocks</strong> occur when two or more transactions wait
          on each other in a cycle. Because none can proceed, the database
          detects the cycle and aborts one transaction to break it.
        </p>
        <p>
          Deadlocks are a normal side effect of locking. The real engineering
          task is minimizing their frequency and handling them safely.
        </p>
      </section>

      <section>
        <h2>Deadlock Cycle</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/deadlock-cycle.svg"
          alt="Deadlock cycle"
          caption="Two transactions waiting on each other’s locks"
        />
      </section>

      <section>
        <h2>How Deadlocks Form</h2>
        <p>
          A deadlock occurs when Transaction A holds Lock X and requests Lock Y,
          while Transaction B holds Lock Y and requests Lock X. This circular
          dependency prevents progress.
        </p>
        <p>
          Deadlocks can also involve more than two transactions. The underlying
          pattern is always a cycle in the wait-for graph.
        </p>
      </section>

      <section>
        <h2>Detection and Resolution</h2>
        <p>
          Most databases periodically detect deadlock cycles. When detected,
          the system chooses a victim transaction to abort. The client must
          retry the aborted transaction.
        </p>
        <p>
          Deadlock resolution policies vary: some choose the youngest transaction,
          others choose the one with the least work done to minimize rollback cost.
        </p>
      </section>

      <section>
        <h2>Prevention Strategies</h2>
        <p>
          The most effective prevention technique is consistent lock ordering.
          If all transactions acquire locks in the same order, cycles cannot form.
        </p>
        <p>
          Other strategies include keeping transactions short, reducing lock
          scope, and avoiding unnecessary locks.
        </p>
      </section>

      <section>
        <h2>Timeouts and Retry Logic</h2>
        <p>
          Deadlocks often surface as timeout errors. Applications should treat
          them as retryable failures, using exponential backoff to avoid
          immediate contention.
        </p>
        <p>
          Safe retries require idempotent operations or explicit transaction
          retries. Without this, clients can create duplicate updates.
        </p>
      </section>

      <section>
        <h2>Operational Monitoring</h2>
        <p>
          Monitor deadlock rates, lock wait times, and transaction retries.
          Sudden increases often indicate new query patterns or schema changes.
        </p>
        <p>
          Many databases log deadlocks with query details. Use these logs to
          identify and fix the transaction ordering causing cycles.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Enforce consistent lock ordering across code paths.</li>
          <li>Keep transactions short and focused.</li>
          <li>Retry deadlock failures with backoff.</li>
          <li>Monitor lock waits and deadlock frequency.</li>
          <li>Review schema changes that increase contention.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
