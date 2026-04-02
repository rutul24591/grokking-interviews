"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-acid-properties-complete",
  title: "ACID Properties",
  description:
    "Comprehensive guide to ACID transaction properties: Atomicity, Consistency, Isolation, and Durability with real-world trade-offs and implementation patterns.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "acid-properties",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "transactions", "databases"],
  relatedTopics: [
    "transaction-isolation-levels",
    "concurrency-control",
    "deadlocks",
    "database-partitioning",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>ACID Properties</h1>
        <p className="lead">
          ACID defines the four guarantees that database transactions provide to ensure data integrity
          even in the face of errors, concurrent access, and system failures. These properties—Atomicity,
          Consistency, Isolation, and Durability—form the foundation of reliable transactional systems
          and are critical for any application where data correctness is non-negotiable.
        </p>

        <p>
          When you transfer money from your checking to savings account, two operations must happen:
          debiting one account and crediting another. If the system crashes after the debit but before
          the credit, you've lost money. ACID transactions prevent this catastrophe by ensuring both
          operations complete together or neither does. This "all-or-nothing" guarantee is atomicity in
          action, and it's just one of the four pillars that make databases trustworthy for critical
          operations.
        </p>

        <p>
          Understanding ACID is essential for staff and principal engineers because transaction design
          decisions directly impact system correctness, performance, and scalability. Choosing the wrong
          isolation level can cause subtle bugs that corrupt data over months. Overlooking durability
          requirements can lead to data loss during outages. And misunderstanding the performance
          implications of ACID can result in systems that are either dangerously fast (skipping safety)
          or unusably slow (over-protecting).
        </p>

        <p>
          This article provides a comprehensive examination of each ACID property, their implementation
          mechanisms, trade-offs, and real-world applications. We'll explore how databases like PostgreSQL,
          MySQL, and Oracle implement these guarantees, when you might need to relax them for performance,
          and how to reason about transactions in distributed systems where ACID becomes significantly
          more complex.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/acid-architecture.svg`}
          caption="Figure 1: ACID Transaction Architecture showing the relationship between application layer, transaction manager, write-ahead log (WAL), and storage engine. The transaction manager enforces atomicity and isolation through locking and concurrency control, while the WAL ensures durability by persisting changes before acknowledging commits."
          alt="ACID transaction architecture diagram"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: The Four Pillars of ACID</h2>

        <h3>Atomicity: All or Nothing</h3>
        <p>
          Atomicity guarantees that a transaction is treated as a single, indivisible unit of work.
          Either all operations within the transaction are applied to the database, or none of them
          are. There is no partial completion visible to other transactions. This property is
          fundamental because it allows developers to reason about complex multi-step operations as
          if they were single operations.
        </p>

        <p>
          Consider an e-commerce order placement: inventory must be decremented, an order record
          created, a payment charged, and a shipping label generated. Without atomicity, a crash
          after charging payment but before creating the order record would leave the system in an
          inconsistent state where the customer paid but has no order. Atomicity ensures that if
          any step fails, all completed steps are rolled back, leaving the database as if the
          transaction never started.
        </p>

        <p>
          Databases implement atomicity through write-ahead logging (WAL) or undo logs. Before
          modifying any data, the database writes a log record describing the change. If the
          transaction commits, these log records are flushed to disk before acknowledging the
          commit. If the transaction aborts or the system crashes, the database uses these logs
          to undo any partial changes. The key insight is that the log is append-only and
          sequential, making it much faster than random writes to data pages.
        </p>

        <h3>Consistency: Preserving Invariants</h3>
        <p>
          Consistency ensures that a transaction brings the database from one valid state to another
          valid state, maintaining all defined invariants. These invariants include schema constraints
          (NOT NULL, UNIQUE, CHECK), foreign key relationships, and application-level business rules
          that can be enforced at the database level.
        </p>

        <p>
          For example, a bank account balance should never go negative. A CHECK constraint
          <code className="inline-code">balance &gt;= 0</code> enforces this invariant at the
          database level. Any transaction that would violate this constraint is rejected entirely.
          Similarly, foreign key constraints ensure referential integrity—an order cannot reference
          a non-existent customer.
        </p>

        <p>
          It's important to distinguish database consistency from the "C" in CAP theorem. ACID
          consistency is about preserving invariants defined by schema and application logic. CAP
          consistency is about all nodes seeing the same data at the same time. A database can be
          ACID-consistent while being CAP-eventually-consistent in a distributed setup.
        </p>

        <h3>Isolation: Concurrent Safety</h3>
        <p>
          Isolation ensures that concurrent transactions execute as if they were serialized—one after
          another—even though they may actually be interleaved for performance. Without isolation,
          transactions could interfere with each other, leading to anomalies like lost updates, dirty
          reads, or inconsistent analysis.
        </p>

        <p>
          Isolation is implemented through locking or multi-version concurrency control (MVCC).
          Locking blocks conflicting operations until the holding transaction completes. MVCC
          maintains multiple versions of data, allowing readers to see a consistent snapshot without
          blocking writers. PostgreSQL and Oracle use MVCC; SQL Server and MySQL (InnoDB) support
          both approaches depending on isolation level.
        </p>

        <p>
          The SQL standard defines four isolation levels, each preventing specific anomalies:
        </p>

        <ul className="list-disc list-inside space-y-2 my-4">
          <li><strong>Read Uncommitted</strong> allows dirty reads (reading uncommitted changes)</li>
          <li><strong>Read Committed</strong> prevents dirty reads but allows non-repeatable reads</li>
          <li><strong>Repeatable Read</strong> prevents non-repeatable reads but allows phantom reads</li>
          <li><strong>Serializable</strong> prevents all anomalies but has highest overhead</li>
        </ul>

        <ArticleImage
          src={`${BASE_PATH}/acid-isolation-levels.svg`}
          caption="Figure 2: Transaction Isolation Levels showing which anomalies are allowed (✓) or prevented (✗) at each level. Read Uncommitted allows all anomalies and is rarely used. Read Committed is the default for PostgreSQL and Oracle. Repeatable Read is MySQL's default. Serializable provides strongest guarantees but with performance cost. Examples show concrete scenarios for each anomaly type."
          alt="Isolation levels comparison matrix"
        />

        <h3>Durability: Surviving Failures</h3>
        <p>
          Durability guarantees that once a transaction commits, its changes persist even in the
          event of system failure. This is the property that makes databases suitable for storing
          critical data—you can trust that committed data won't disappear when the power goes out.
        </p>

        <p>
          Durability is achieved through write-ahead logging with synchronous disk flushes. When a
          transaction commits, the database writes log records to a buffer, then calls fsync (or
          equivalent) to ensure those records are physically on disk before acknowledging the commit.
          The actual data pages may be written asynchronously later, but the log is durable
          immediately.
        </p>

        <p>
          The performance cost of durability is the fsync latency—typically 5-10ms for spinning
          disks, 1-3ms for SSDs. This is why high-performance systems sometimes relax durability
          (group commits, delayed fsync) at the risk of losing recent transactions during crashes.
          Understanding this trade-off is critical: do you need every transaction durable, or can
          you tolerate losing the last second of data for 10x throughput?
        </p>

        <ArticleImage
          src={`${BASE_PATH}/acid-transaction-flow.svg`}
          caption="Figure 3: Transaction Lifecycle showing the commit and rollback paths. On commit, changes are written to WAL, fsync'd to disk (durability point), acknowledged to client, then asynchronously checkpointed to data files. On rollback, changes are undone using undo logs. The crash recovery process replays committed transactions from WAL and rolls back uncommitted ones, ensuring no data loss after fsync."
          alt="Transaction lifecycle flow diagram"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Flow</h2>

        <h3>Write-Ahead Logging: The Foundation of Atomicity and Durability</h3>
        <p>
          Write-ahead logging (WAL) is the mechanism that makes ACID possible. The fundamental rule
          is simple: before modifying any data page, write a log record describing the change. Before
          acknowledging a commit, ensure all log records for that transaction are durably persisted.
          This ordering guarantee enables both atomicity (undo uncommitted changes) and durability
          (redo committed changes after crash).
        </p>

        <p>
          A WAL record contains the transaction ID, operation type (insert/update/delete), affected
          table and row, before-image (for undo), and after-image (for redo). Log records are written
          sequentially to a circular buffer, which is flushed to disk on commit. Because sequential
          writes are orders of magnitude faster than random page writes, WAL adds minimal overhead
          while providing maximum safety.
        </p>

        <p>
          Checkpointing is the process of writing dirty pages from the buffer pool to data files.
          The checkpoint record in the WAL marks the point from which recovery must start. Frequent
          checkpoints reduce recovery time but increase I/O overhead. Modern databases use fuzzy
          checkpointing—writing pages gradually rather than all at once—to avoid I/O spikes.
        </p>

        <h3>Lock Management: Enforcing Isolation</h3>
        <p>
          Lock-based concurrency control uses shared (read) and exclusive (write) locks to prevent
          conflicting operations. A transaction must acquire a shared lock before reading and an
          exclusive lock before writing. Shared locks are compatible with other shared locks but not
          with exclusive locks. Exclusive locks are incompatible with everything.
        </p>

        <p>
          Two-phase locking (2PL) is the protocol that ensures serializability: a transaction must
          acquire all locks before releasing any. Strict 2PL holds all locks until commit, preventing
          cascading rollbacks. The downside is reduced concurrency and potential deadlocks—situations
          where two transactions wait for each other's locks indefinitely.
        </p>

        <p>
          Deadlock detection runs periodically, building a wait-for graph and looking for cycles.
          When detected, one transaction (the "victim") is aborted to break the cycle. Applications
          must handle deadlock errors with retry logic using exponential backoff to avoid immediate
          re-collision.
        </p>

        <h3>MVCC: Isolation Without Locking</h3>
        <p>
          Multi-version concurrency control (MVCC) takes a different approach: instead of blocking
          readers, maintain multiple versions of each row. When a transaction updates a row, it
          creates a new version with a transaction timestamp. Readers see the version that was
          current when their transaction started, providing a consistent snapshot without blocking.
        </p>

        <p>
          MVCC dramatically improves read concurrency—readers never block writers, and writers never
          block readers. The trade-off is storage overhead (multiple versions) and the need for
          vacuum/cleanup processes to remove old versions. PostgreSQL's VACUUM and Oracle's undo
          tablespace management are examples of MVCC maintenance.
        </p>

        <p>
          MVCC enables snapshot isolation, which prevents many anomalies without the cost of full
          serializability. However, snapshot isolation can allow write skew—a subtle anomaly where
          two transactions read overlapping data and make disjoint updates that together violate a
          constraint. Detecting and preventing write skew requires additional mechanisms like
          predicate locks or explicit locking.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/acid-failure-recovery.svg`}
          caption="Figure 4: ACID Failure Modes and Recovery showing common failure scenarios (crash mid-transaction, lock timeout, constraint violation) and the four-step recovery process: analysis (scan WAL), redo (replay committed), undo (rollback uncommitted), and checkpoint. Recovery time depends on WAL size since last checkpoint."
          alt="Failure and recovery process diagram"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: ACID vs BASE</h2>

        <p>
          ACID transactions provide strong guarantees but come with performance costs, especially in
          distributed systems. The CAP theorem proves that during network partitions, you must choose
          between consistency (ACID) and availability (BASE). Understanding this trade-off is critical
          for designing systems that meet business requirements without over-engineering.
        </p>

        <h3>Performance Costs of ACID</h3>
        <p>
          Each ACID property has a performance implication. Atomicity requires WAL writes and fsync
          calls, adding 5-10ms per commit. Consistency checks (constraint validation) add CPU overhead
          proportional to constraint complexity. Isolation through locking reduces concurrency; through
          MVCC increases storage and cleanup overhead. Durability requires synchronous disk writes,
          the single largest latency component.
        </p>

        <p>
          High-throughput systems often relax ACID properties selectively. Group commits batch
          multiple transactions into one fsync, improving throughput at the risk of losing multiple
          transactions on crash. Asynchronous replication sacrifices durability (slave can lag) for
          read scaling. Read uncommitted isolation (with dirty reads) can be acceptable for analytics
          where approximate results suffice.
        </p>

        <h3>When to Choose BASE</h3>
        <p>
          BASE (Basically Available, Soft state, Eventually consistent) is an alternative model that
          prioritizes availability and partition tolerance over immediate consistency. Social media
          feeds, product reviews, and analytics dashboards can tolerate eventual consistency—seeing a
          like count that's a few seconds stale is acceptable. These workloads benefit from BASE's
          higher availability and lower latency.
        </p>

        <p>
          However, BASE shifts complexity to the application. You must handle conflicts (two users
          updating the same data), reconcile divergent states, and design UIs that don't confuse
          users with stale data. ACID keeps this complexity in the database; BASE pushes it to your
          codebase.
        </p>

        <h3>Hybrid Approaches</h3>
        <p>
          Many production systems use both ACID and BASE for different operations. An e-commerce
          platform might use ACID transactions for inventory and payments (where correctness is
          critical) but BASE for product reviews and recommendations (where availability matters
          more). This hybrid approach requires careful data modeling to separate consistency domains.
        </p>

        <p>
          Microservices architectures often face this decision per service. The order service needs
          ACID; the notification service can be BASE. Event sourcing with CQRS (Command Query
          Responsibility Segregation) is a pattern that combines ACID writes (to an event store)
          with BASE reads (from denormalized projections).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/acid-vs-base.svg`}
          caption="Figure 5: ACID vs BASE Trade-off Spectrum showing use cases for each model. ACID is required for financial transactions, inventory management, booking systems, and identity management where correctness is non-negotiable. BASE is suitable for social media feeds, analytics, reviews, and caching where eventual consistency is acceptable. Many systems use both for different operations."
          alt="ACID vs BASE comparison diagram"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for ACID Transactions</h2>

        <p>
          <strong>Keep transactions short.</strong> Long-running transactions hold locks longer,
          reducing concurrency and increasing deadlock risk. Move non-essential operations (sending
          emails, calling external APIs) outside the transaction. Use asynchronous processing for
          work that doesn't need immediate consistency.
        </p>

        <p>
          <strong>Choose the right isolation level.</strong> Start with your database's default
          (usually Read Committed or Repeatable Read). Only upgrade to Serializable if you can
          demonstrate a specific anomaly causing data corruption. Most applications work correctly
          with Read Committed if business logic handles race conditions appropriately.
        </p>

        <p>
          <strong>Design for retries.</strong> Deadlocks and serialization failures are normal in
          concurrent systems. Implement retry logic with exponential backoff and jitter. Make
          operations idempotent so retries don't cause duplicate effects. Track retry rates as a
          metric—spikes indicate contention issues.
        </p>

        <p>
          <strong>Use constraints liberally.</strong> Database constraints (NOT NULL, UNIQUE,
          FOREIGN KEY, CHECK) are your last line of defense against bad data. They catch bugs that
          slip through application validation. The small performance cost is worth the data integrity
          protection.
        </p>

        <p>
          <strong>Monitor transaction metrics.</strong> Track commit latency, rollback rates,
          deadlock counts, and lock wait times. Set alerts for anomalies. These metrics often
          indicate problems before users notice. A rising deadlock rate might mean a new feature
          introduced contention.
        </p>

        <p>
          <strong>Test failure scenarios.</strong> Simulate crashes mid-transaction, network
          partitions, and lock timeouts. Verify that recovery works correctly and no data is lost
          or corrupted. Chaos engineering principles apply to transactions too.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Implicit transactions in ORMs.</strong> Many ORMs wrap each operation in a
          transaction by default, but complex multi-step workflows may span multiple implicit
          transactions, losing atomicity. Always use explicit transaction boundaries for operations
          that must be atomic. In Hibernate, use <code className="inline-code">@Transactional</code>.
          In SQLAlchemy, use <code className="inline-code">with engine.begin()</code>.
        </p>

        <p>
          <strong>N+1 queries within transactions.</strong> Fetching related data in a loop within a
          transaction extends its duration unnecessarily. Use eager loading or batch queries to
          minimize time in transaction. A transaction that runs 100 queries in a loop is a deadlock
          waiting to happen.
        </p>

        <p>
          <strong>Ignoring isolation level implications.</strong> Developers often assume Repeatable
          Read prevents all anomalies. It doesn't prevent phantoms or write skew. If your logic
          depends on "no new rows matching this condition," you need Serializable isolation or
          explicit locking (SELECT FOR UPDATE).
        </p>

        <p>
          <strong>Assuming durability is guaranteed.</strong> Default database configurations often
          prioritize safety, but cloud-managed databases sometimes offer "fast commit" options that
          delay fsync. Verify your durability settings match business requirements. Financial data
          needs full durability; logging data might not.
        </p>

        <p>
          <strong>Not handling deadlocks.</strong> Deadlocks are inevitable in systems with
          contention. The error is recoverable—retry the transaction. But without retry logic,
          deadlocks become user-visible failures. Always catch deadlock errors and retry with
          backoff.
        </p>

        <p>
          <strong>Over-constraining the schema.</strong> While constraints are good, excessive
          constraints (especially cascading foreign keys) can make simple operations trigger
          complex validation chains, slowing down transactions and increasing deadlock surface.
          Balance safety with pragmatism.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Payment Processing (Stripe, PayPal)</h3>
        <p>
          Payment systems are the canonical ACID use case. A payment involves debiting the customer,
          crediting the merchant, recording the transaction, and updating balances. Any partial
          completion is unacceptable—losing money is bad for business. Stripe uses ACID transactions
          within their ledger service, with careful idempotency handling to ensure retries don't
          double-charge.
        </p>

        <p>
          The isolation level choice is critical here. Read Committed is insufficient because
          concurrent payments could read the same balance and both approve, causing overdrafts.
          Repeatable Read or explicit locking (SELECT FOR UPDATE) ensures the balance check and
          update are atomic.
        </p>

        <h3>Inventory Management (Amazon, Shopify)</h3>
        <p>
          E-commerce platforms must prevent overselling—selling more units than available inventory.
          When two customers try to buy the last item simultaneously, only one should succeed. This
          requires atomic decrement with a check: <code className="inline-code">UPDATE inventory 
          SET quantity = quantity - 1 WHERE product_id = X AND quantity &gt; 0</code>, then check
          rows affected.
        </p>

        <p>
          Amazon's system uses optimistic locking with version numbers for high-traffic products.
          Each update increments a version; conflicts are detected and retried. For flash sales,
          they pre-allocate inventory to regional warehouses, reducing contention scope.
        </p>

        <h3>Flight Booking Systems (Airbnb, Airlines)</h3>
        <p>
          Booking a flight or rental involves reserving a specific resource (seat, car, room) that
          cannot be double-booked. The reservation must be atomic with payment, and the hold must
          expire if payment doesn't complete within a timeout window.
        </p>

        <p>
          Airlines use Serializable isolation for seat selection to prevent two passengers booking
          the same seat. The performance cost is acceptable because booking volume is low compared
          to browsing. Temporary holds use TTL-based expiration, implemented via background jobs
          that release unclaimed reservations.
        </p>

        <h3>Banking Core Systems</h3>
        <p>
          Core banking systems are perhaps the most demanding ACID workload. Transfers between
          accounts must be atomic, balances must never go negative (unless overdraft is allowed),
          and the system must survive any failure without losing money.
        </p>

        <p>
          Banks typically use mainframe databases (DB2, IMS) with full ACID compliance and
          synchronous replication to disaster recovery sites. The latency cost is acceptable
          because correctness is paramount. Modern fintechs use distributed SQL databases
          (CockroachDB, Spanner) that provide ACID semantics across regions.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: Your payment system is seeing occasional double-charges during peak traffic. The
              code checks balance, then charges. What's the root cause and how do you fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> This is a classic race condition caused by insufficient
              isolation. Two concurrent requests both read the same balance (say $100), both pass
              the balance check, and both charge $100—resulting in a $200 charge against a $100
              balance. The fix is to use proper transaction isolation or explicit locking. With
              Repeatable Read isolation, the second transaction would see the first transaction's
              uncommitted change and wait. Alternatively, use{" "}
              <code className="inline-code">SELECT FOR UPDATE</code> to lock the row during the
              check, ensuring only one transaction proceeds at a time. A third approach is
              optimistic locking with a version column, retrying on conflict.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if adding locking causes unacceptable latency?
              Answer: Pre-authorize amounts, use idempotent charges with unique tokens, or
              implement a queue-based system that serializes charges per customer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain the difference between Read Committed and Repeatable Read isolation. When
              would you specifically choose one over the other?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Read Committed ensures you only see committed data, but
              repeated reads within a transaction can return different results if another
              transaction modifies and commits in between. Repeatable Read guarantees that all
              reads within a transaction see the same snapshot, preventing non-repeatable reads.
              Choose Read Committed for simple queries where slight inconsistency is acceptable
              (dashboard metrics, search results). Choose Repeatable Read when your logic depends
              on consistent reads (calculating totals, generating reports, multi-step workflows
              that read the same data multiple times). PostgreSQL's default is Read Committed;
              MySQL's is Repeatable Read.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Does Repeatable Read prevent phantom reads? Answer: No,
              phantom reads (new rows appearing) require Serializable isolation or explicit
              range locks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How does write-ahead logging (WAL) enable both atomicity and durability? What
              happens during crash recovery?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> WAL enables atomicity by logging changes before applying
              them—if a transaction aborts, the log provides the information needed to undo
              partial changes. WAL enables durability by flushing log records to disk before
              acknowledging commit—once the log is durable, the transaction is durable even if
              data pages aren't written yet. During crash recovery, the database performs three
              phases: Analysis (scan WAL to identify committed vs uncommitted transactions), Redo
              (replay all committed transactions from WAL to restore changes), and Undo (rollback
              uncommitted transactions using undo logs). This ARIES algorithm ensures no committed
              data is lost and no uncommitted data persists.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why is sequential WAL write faster than random data
              page writes? Answer: Sequential I/O has much higher throughput (100s of MB/s)
              compared to random I/O (especially on spinning disks), and fsync on a small log
              is faster than fsync on many scattered pages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Your team wants to use Serializable isolation for all transactions to "be safe."
              What are the risks, and how would you push back?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Serializable isolation has significant performance costs:
              increased lock contention, higher deadlock rates, and reduced throughput. It's
              overkill for most operations—reading a user's profile doesn't need serializability.
              I'd push back by asking for specific anomalies they're trying to prevent, then
              propose targeted solutions: use Repeatable Read for most transactions, add explicit
              locking only where needed, and implement application-level checks for edge cases.
              I'd also suggest monitoring for actual anomalies at lower isolation levels before
              escalating. The goal is appropriate safety, not maximum safety regardless of cost.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When is Serializable actually worth the cost? Answer:
              Financial transfers, inventory allocation, seat booking—any operation where
              concurrent modification would cause business-critical errors that can't be
              detected at the application level.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Design a system to prevent overselling during a flash sale where 10,000 users
              try to buy 100 items simultaneously. How do you ensure exactly 100 sales?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> This is a high-contention ACID problem. Approach 1:
              Database locking with{" "}
              <code className="inline-code">UPDATE inventory SET qty = qty - 1 WHERE id = X AND qty &gt; 0</code>,
              checking rows affected. Only 100 updates succeed. Add retry logic for deadlocks.
              Approach 2: Pre-allocate inventory to a Redis queue with 100 tokens; users dequeue
              a token to purchase. Redis is faster than DB for this contention. Approach 3: Use
              a distributed lock per product, serializing all purchases (simplest but highest
              latency). I'd choose Approach 2 for flash sales—Redis handles the contention, and
              we asynchronously sync sales to the database. Key insight: move the contention
              point to a system optimized for it.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if Redis fails mid-sale? Answer: Use Redis
              persistence (AOF), have a fallback to database locking, or pre-reserve inventory
              with a timeout for release.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Explain write skew anomaly with an example. How do you prevent it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Write skew occurs when two transactions read overlapping
              data, make disjoint updates based on what they read, and together violate a
              constraint. Classic example: Two doctors on call. Rule: at least one must be on
              call. Both read "two doctors on call," both decide to go off call (disjoint
              updates), result: zero doctors on call—constraint violated. This happens at
              Repeatable Read because each transaction's read was consistent, but they didn't
              see each other's writes. Prevention: use Serializable isolation, or explicitly
              lock the rows you read (<code className="inline-code">SELECT FOR UPDATE</code>),
              or add a constraint that the database can enforce (CHECK constraint on count).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Is write skew common in practice? Answer: Less common
              than lost updates, but critical when it occurs—usually in scheduling, availability,
              or quota systems where a global invariant depends on multiple rows.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.postgresql.org/docs/current/transaction-iso.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Transaction Isolation
            </a>
          </li>
          <li>
            <a
              href="https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Documentation — InnoDB Transaction Model
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/21/cncpt/transactions.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — Transactions
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/spanner/docs/transactions"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Spanner — Transaction Model
            </a>
          </li>
          <li>
            <a
              href="https://martin.kleppmann.com/2016/02/08/isolation-eventual-consistency.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann — Isolation and Eventual Consistency
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
