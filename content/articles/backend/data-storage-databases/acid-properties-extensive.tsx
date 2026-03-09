"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-acid-properties-extensive",
  title: "ACID Properties",
  description:
    "Comprehensive guide to ACID properties, isolation levels, and transactional guarantees.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "acid-properties",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "acid", "transactions"],
  relatedTopics: [
    "transaction-isolation-levels",
    "concurrency-control",
    "deadlocks",
  ],
};

export default function AcidPropertiesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>ACID</strong> describes the guarantees of transactional databases:
          Atomicity, Consistency, Isolation, and Durability. These properties
          ensure that multi-step operations either succeed fully or fail safely.
        </p>
        <p>
          In backend systems, ACID underpins correctness for payments, inventory,
          and account balances. Without ACID, partial updates and race conditions
          can corrupt business state and lead to customer-visible errors.
        </p>
      </section>

      <section>
        <h2>ACID Overview</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/acid-properties.svg"
          alt="ACID properties"
          caption="Atomicity, Consistency, Isolation, Durability"
        />
        <p>
          Each property protects against a class of failure. Atomicity prevents
          partial state. Consistency preserves invariants. Isolation prevents
          concurrency interference. Durability ensures committed data survives
          crashes and power loss.
        </p>
      </section>

      <section>
        <h2>Atomicity in Practice</h2>
        <p>
          Atomicity means a transaction is indivisible. If any step fails, the
          entire transaction is rolled back. This is implemented using logs and
          rollback mechanisms.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`}</code>
        </pre>
      </section>

      <section>
        <h2>Consistency and Constraints</h2>
        <p>
          Consistency ensures transactions only move the database between valid
          states. This relies on constraints: primary keys, foreign keys, and
          checks that enforce business rules.
        </p>
        <p>
          If constraints are weak, consistency guarantees become meaningless.
          Strong schema design is a prerequisite for meaningful ACID behavior.
        </p>
      </section>

      <section>
        <h2>Isolation Levels</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/transaction-isolation.svg"
          alt="Isolation levels"
          caption="Stronger isolation reduces anomalies but increases overhead"
        />
        <p>
          Isolation defines how transactions interact when they overlap in time.
          Higher isolation reduces anomalies but increases locking and reduces
          throughput. Common levels include Read Committed, Repeatable Read, and
          Serializable.
        </p>
        <p>
          Many production systems use Read Committed or Repeatable Read to balance
          correctness and performance. Serializable offers the strongest guarantees
          but can reduce concurrency under heavy load.
        </p>
      </section>

      <section>
        <h2>Durability Mechanisms</h2>
        <p>
          Durability ensures committed data survives crashes. Databases use
          write-ahead logs (WAL), fsync to disk, and replication to achieve this.
          If the database crashes after commit, WAL replay restores the state.
        </p>
        <p>
          Durability can be tuned: synchronous replication is safest but slower,
          while async replication increases risk but improves throughput.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Performance Costs</h2>
        <p>
          ACID guarantees come with performance overhead. Locks reduce concurrency,
          logging adds IO, and stricter isolation reduces throughput. The key is
          to choose the weakest isolation that preserves correctness.
        </p>
        <p>
          For example, analytics systems may relax isolation, while banking
          systems enforce strict serializability.
        </p>
      </section>

      <section>
        <h2>Concurrency Anomalies</h2>
        <p>
          Isolation protects against anomalies like dirty reads, non-repeatable
          reads, and phantom reads. Each isolation level allows or prevents
          specific anomalies.
        </p>
        <p>
          Understanding these anomalies is essential for designing correct
          transactional workflows at scale.
        </p>
      </section>

      <section>
        <h2>Two-Phase Commit and Distributed Transactions</h2>
        <p>
          ACID is simplest within a single database. Across multiple databases,
          ACID requires distributed transactions such as two-phase commit (2PC),
          which adds latency and complexity.
        </p>
        <p>
          Many modern systems avoid distributed ACID by using sagas or eventual
          consistency, but this changes the correctness model.
        </p>
      </section>

      <section>
        <h2>Practical Examples</h2>
        <p>
          In payments, ACID ensures balances never go negative due to partial
          updates. In inventory, it prevents overselling. In booking systems,
          it ensures seats are not double-booked.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Define correctness guarantees per workflow.</li>
          <li>Choose isolation levels explicitly.</li>
          <li>Monitor lock contention and transaction time.</li>
          <li>Ensure WAL and replication are healthy.</li>
          <li>Avoid long-running transactions.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
