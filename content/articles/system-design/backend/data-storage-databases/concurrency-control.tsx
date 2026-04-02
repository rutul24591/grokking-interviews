"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-concurrency-control-complete",
  title: "Concurrency Control",
  description:
    "Comprehensive guide to concurrency control: pessimistic vs optimistic locking, MVCC, deadlock handling, and retry strategies for distributed systems.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "concurrency-control",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "concurrency", "transactions"],
  relatedTopics: [
    "acid-properties",
    "transaction-isolation-levels",
    "deadlocks",
    "mvcc",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Concurrency Control</h1>
        <p className="lead">
          Concurrency control encompasses the mechanisms that ensure correct results when multiple
          transactions access the same data simultaneously. Without proper concurrency control,
          concurrent operations can interfere with each other, producing incorrect results: lost
          updates, dirty reads, inconsistent analysis, and deadlocks. The goal is to maximize
          throughput while preserving data correctness.
        </p>

        <p>
          Consider a ticket booking system where two users try to reserve the last seat simultaneously.
          Without concurrency control, both might succeed, resulting in an overbooked flight. With
          proper concurrency control, only one succeeds and the other is informed that the seat is
          no longer available. This simple scenario illustrates the fundamental challenge: how do we
          allow concurrent access for performance while preventing conflicts that corrupt data?
        </p>

        <p>
          Concurrency control is not a single technique but a spectrum of strategies, each with
          different trade-offs. Pessimistic locking prevents conflicts proactively but reduces
          concurrency. Optimistic locking allows conflicts but detects them at commit time. MVCC
          (Multi-Version Concurrency Control) maintains multiple versions to avoid blocking entirely.
          Choosing the right strategy depends on your workload characteristics: read/write ratio,
          contention level, and conflict cost.
        </p>

        <p>
          This article provides a comprehensive examination of concurrency control strategies,
          implementation patterns, deadlock handling, and retry strategies. We'll explore when to
          use pessimistic vs optimistic approaches, how MVCC enables high read concurrency, and how
          to design systems that handle concurrency failures gracefully through proper retry logic
          and idempotent operations.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/concurrency-control-strategies.svg`}
          caption="Figure 1: Concurrency Control Strategies Overview showing three main approaches. Pessimistic (2PL): acquire locks before operations, hold until commit—prevents conflicts but risks deadlocks. Optimistic (version-based): read with version, validate at commit—low overhead but retries on conflict. MVCC: maintains multiple versions, readers see snapshot at transaction start—best read concurrency but storage overhead. Comparison shows pessimistic for high-contention, optimistic for read-heavy, MVCC for balanced workloads."
          alt="Concurrency control strategies comparison"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Pessimistic vs Optimistic</h2>

        <h3>Pessimistic Concurrency Control</h3>
        <p>
          Pessimistic concurrency control assumes conflicts are likely and prevents them proactively.
          The most common implementation is Two-Phase Locking (2PL), where transactions acquire locks
          before accessing data and hold all locks until commit. Shared locks (read locks) allow
          other transactions to read but not write. Exclusive locks (write locks) prevent all other
          access.
        </p>

        <p>
          In 2PL, a transaction that wants to read acquires a shared lock. A transaction that wants
          to update acquires an exclusive lock. If Transaction A holds a shared lock and Transaction
          B requests an exclusive lock, B blocks until A releases its lock. This prevents all
          conflicts but dramatically reduces concurrency—readers block writers, and writers block
          readers.
        </p>

        <p>
          Strict 2PL holds all locks until commit, preventing cascading rollbacks. The downside is
          increased deadlock risk. When two transactions wait for each other's locks in a cycle,
          neither can proceed. Deadlock detection runs periodically, building a wait-for graph and
          looking for cycles. When detected, one transaction (the "victim") is aborted to break
          the cycle.
        </p>

        <h3>Optimistic Concurrency Control</h3>
        <p>
          Optimistic concurrency control assumes conflicts are rare and detects them at commit time.
          Instead of acquiring locks, transactions read data with a version number, modify locally,
          then validate at commit that the version hasn't changed. If the version changed, another
          transaction modified the data concurrently, and this transaction must retry.
        </p>

        <p>
          The optimistic approach has minimal overhead during the transaction—no lock acquisition,
          no blocking. The cost is paid only on conflict: the transaction aborts and must retry.
          This is efficient when conflicts are rare (less than 1-5% of transactions), but
          catastrophic when conflicts are common (excessive retries waste resources).
        </p>

        <p>
          Implementation typically uses a version column (integer or timestamp) that increments on
          each update. The update statement includes a WHERE clause checking the version:
          <code className="inline-code">UPDATE accounts SET balance = 500, version = version + 1 
          WHERE id = 1 AND version = 5</code>. If the WHERE clause matches zero rows, the version
          changed and the update failed.
        </p>

        <h3>MVCC (Multi-Version Concurrency Control)</h3>
        <p>
          MVCC combines the best aspects of both approaches. Instead of blocking readers or detecting
          conflicts, MVCC maintains multiple versions of each row. When a transaction updates a row,
          it creates a new version with transaction metadata (timestamp, transaction ID). Readers
          see the version that was current when their transaction started, providing a consistent
          snapshot without blocking writers.
        </p>

        <p>
          MVCC dramatically improves read concurrency—readers never block writers, and writers never
          block readers. Each transaction sees a consistent snapshot of the database at its start
          time. This naturally provides Repeatable Read semantics: all reads within a transaction
          see the same versions, so non-repeatable reads are impossible.
        </p>

        <p>
          The trade-off is storage overhead and maintenance. Old versions must be retained until no
          active transaction can see them. PostgreSQL uses VACUUM processes to clean up dead tuples;
          Oracle uses undo tablespaces. If version cleanup falls behind, storage bloats and
          performance degrades. Despite this cost, MVCC is the preferred approach for read-heavy
          workloads because it eliminates read-write blocking entirely.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/concurrency-deadlock-handling.svg`}
          caption="Figure 2: Deadlock handling showing detection, prevention, and recovery. Deadlock scenario (top left): T1 locks Row A, T2 locks Row B, T1 waits for B, T2 waits for A—circular wait. Wait-for graph (top right) visualizes the cycle. Prevention strategies: consistent lock ordering, lock timeouts, short transactions. Detection: periodic wait-for graph analysis, timeout-based detection. Recovery: abort victim transaction, release locks, allow others to proceed, application retry with backoff. Monitor deadlock count, lock wait time, and abort rate."
          alt="Deadlock detection and handling"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Patterns</h2>

        <h3>Deadlock: Detection, Prevention & Recovery</h3>
        <p>
          Deadlocks are inevitable in systems with pessimistic locking. A deadlock occurs when two
          or more transactions wait for each other's locks in a cycle—neither can proceed because
          each is waiting for the other to release a lock. The database must intervene to break
          the cycle.
        </p>

        <p>
          Deadlock prevention aims to make deadlocks impossible. The most effective technique is
          consistent lock ordering: if all transactions acquire locks in the same order (e.g.,
          always lock table A before table B, always lock rows by ascending ID), circular waits
          cannot occur. Other prevention strategies include lock timeouts (abort if waiting too
          long) and keeping transactions short (reduce lock hold time).
        </p>

        <p>
          Deadlock detection accepts that deadlocks will occur and detects them when they happen.
          The database maintains a wait-for graph where nodes are transactions and edges represent
          "waits for" relationships. Periodically, the database searches for cycles in this graph.
          When a cycle is found, one transaction (the "victim") is selected and aborted to break
          the cycle.
        </p>

        <p>
          Victim selection typically chooses the "cheapest" transaction to abort: the one that has
          done the least work, has the lowest priority, or is youngest. The aborted transaction
          releases all its locks, allowing other transactions to proceed. The application must
          retry the aborted transaction with appropriate backoff to avoid immediate re-collision.
        </p>

        <h3>Retry Strategies for Concurrency Failures</h3>
        <p>
          Concurrency failures—deadlocks, serialization failures, optimistic lock conflicts—are
          normal in concurrent systems. The error is recoverable: retry the transaction. But
          naive retries (immediate, infinite) can make problems worse. Proper retry strategies
          are essential for robust concurrency handling.
        </p>

        <p>
          Exponential backoff is the standard approach: each retry waits longer than the previous
          one. Start with 100ms, then 200ms, 400ms, 800ms. This gives conflicting transactions time
          to complete and reduces the chance of repeated collisions. Add jitter (random variation)
          to prevent synchronized retries—if 100 transactions all retry after exactly 200ms, they'll
          collide again.
        </p>

        <p>
          Set reasonable limits: 3-5 retries for deadlocks, maximum total retry time under 2
          seconds. If a transaction fails after multiple retries, there's likely a deeper problem
          (hot spot, design flaw) that retry won't fix. Log failures for analysis and alert on
          spikes in retry rates.
        </p>

        <p>
          Idempotency is critical for safe retries. An idempotent operation produces the same
          result whether executed once or multiple times. Use unique operation IDs and track which
          operations have been processed. For updates, use <code className="inline-code">UPDATE 
          ... WHERE version = X</code>—if the version changed, the update affects zero rows,
          indicating a concurrent modification.
        </p>

        <h3>Implementation Patterns</h3>
        <p>
          <strong>SELECT FOR UPDATE</strong> is the standard pessimistic locking pattern. Read
          rows with an exclusive lock: <code className="inline-code">SELECT * FROM accounts WHERE 
          id = 1 FOR UPDATE</code>. This prevents other transactions from reading (with FOR UPDATE)
          or modifying the row until you commit. Use this for critical sections where you read
          then update based on what you read.
        </p>

        <p>
          <strong>Version-based optimistic locking</strong> adds a version column to each table.
          Read the row with its version, modify locally, then update with a version check:
          <code className="inline-code">UPDATE accounts SET balance = 500, version = version + 1 
          WHERE id = 1 AND version = 5</code>. Check affected rows—if zero, the version changed
          and you must retry.
        </p>

        <p>
          <strong>Queue-based serialization</strong> avoids concurrency entirely by serializing
          access through a queue. All operations on a resource go through a single worker that
          processes them sequentially. This eliminates conflicts but creates a bottleneck. Use
          for high-contention resources where correctness is critical (flash sales, limited
          inventory).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/concurrency-retry-strategies.svg`}
          caption="Figure 3: Retry Strategies for Concurrency Failures. When to retry: deadlock victim (always), serialization failure (retry), optimistic lock conflict (retry), timeout (retry with caution). When NOT to retry: constraint violation (fix data), business logic error (fix logic), repeated failures (investigate). Exponential backoff with jitter: delay = base * 2^(attempt-1) + random(0, delay/2). Idempotency is critical—use unique operation IDs and track processed operations. Monitor retry rate, success rate by attempt, and alert on spikes."
          alt="Retry strategies diagram"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Choosing the Right Strategy</h2>

        <p>
          Choosing a concurrency strategy is a trade-off between correctness, throughput, and
          complexity. There is no universally best approach—the right choice depends on your
          workload characteristics and business requirements.
        </p>

        <h3>Read-Heavy Workloads (&gt;90% reads)</h3>
        <p>
          For read-heavy workloads like content feeds, web browsing, and analytics queries, MVCC
          is almost always the best choice. Readers never block writers, enabling high concurrency.
          The storage overhead is acceptable because the alternative (pessimistic locking) would
          severely limit throughput.
        </p>

        <p>
          Example: A news website serves millions of page views per hour but has relatively few
          article updates. Using MVCC (PostgreSQL's default), readers see consistent snapshots
          without blocking writers who are publishing new articles. The storage cost of maintaining
          versions is negligible compared to the throughput benefit.
        </p>

        <h3>Write-Heavy Workloads (&gt;50% writes)</h3>
        <p>
          For write-heavy workloads like financial transactions, inventory updates, and booking
          systems, pessimistic locking is often necessary. Conflicts are frequent and expensive,
          so preventing them proactively is worth the overhead.
        </p>

        <p>
          Example: A stock trading system processes thousands of buy/sell orders per second. Each
          order must check and update account balances and stock positions. Using SELECT FOR UPDATE
          ensures that concurrent orders on the same account are serialized, preventing overdrafts
          and double-spending. The locking overhead is acceptable because correctness is
          non-negotiable.
        </p>

        <h3>Balanced Workloads (mixed read/write)</h3>
        <p>
          For balanced workloads like e-commerce (browsing + checkout) and social media (reading
          feeds + posting), a hybrid approach works best. Use MVCC for general operations but add
          explicit locking for critical sections.
        </p>

        <p>
          Example: An e-commerce platform uses MVCC for product browsing, search, and reviews
          (read-heavy, conflicts rare). But checkout uses SELECT FOR UPDATE on inventory rows
          to prevent overselling. This hybrid approach provides high concurrency for most
          operations while ensuring correctness for critical ones.
        </p>

        <h3>High Contention Scenarios</h3>
        <p>
          When many transactions compete for the same resources (flash sales, ticket releases,
          limited inventory), even MVCC can struggle. The conflict rate becomes too high for
          optimistic approaches. In these cases, serialize access through a queue or use
          pessimistic locking with careful design.
        </p>

        <p>
          Example: A concert ticket release expects 100,000 users competing for 10,000 seats.
          Using database locking would cause massive contention and deadlocks. Instead, use a
          queue-based approach: users enter a waiting room, requests are serialized through a
          message queue, and each request is processed one at a time. This eliminates database
          contention entirely.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/concurrency-decision-framework.svg`}
          caption="Figure 4: Decision Framework for choosing concurrency strategy. Read-heavy workloads (web browsing, content feeds, analytics) → MVCC/Optimistic. Write-heavy workloads (financial transactions, inventory updates, booking) → Pessimistic Locking. Balanced workloads (e-commerce, social media, SaaS) → MVCC + Explicit Locks for critical sections. Adjust based on contention level: low → optimistic, medium → MVCC, high → pessimistic. Implementation checklist: set isolation level, implement retry logic, ensure idempotency, monitor metrics. Common patterns: SELECT FOR UPDATE, version column, queue-based serialization, CRDTs."
          alt="Concurrency strategy decision framework"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Concurrency Control</h2>

        <p>
          <strong>Keep transactions short.</strong> Long transactions hold locks longer, reducing
          concurrency and increasing deadlock risk. Move non-essential operations (sending emails,
          calling external APIs) outside the transaction. Use asynchronous processing for work
          that doesn't need immediate consistency.
        </p>

        <p>
          <strong>Access resources in consistent order.</strong> If transactions access multiple
          resources, always access them in the same order (e.g., lock accounts by ascending ID).
          This prevents circular waits and eliminates deadlocks. Document the ordering convention
          and enforce it in code reviews.
        </p>

        <p>
          <strong>Use appropriate isolation levels.</strong> Don't default to Serializable—it's
          often overkill. Start with your database's default (Read Committed or Repeatable Read)
          and only increase isolation if you can demonstrate specific anomalies causing data
          corruption. Use explicit locking for critical sections instead of raising the global
          isolation level.
        </p>

        <p>
          <strong>Implement retry logic with backoff.</strong> Deadlocks and serialization failures
          are normal. Implement retry logic with exponential backoff and jitter. Make operations
          idempotent so retries don't cause duplicate effects. Track retry rates as a metric—spikes
          indicate contention issues.
        </p>

        <p>
          <strong>Monitor concurrency metrics.</strong> Track deadlock counts, lock wait times,
          serialization failure rates, and transaction abort rates. Set alerts for anomalies.
          These metrics often indicate problems before users notice. A rising deadlock rate might
          mean a new feature introduced contention.
        </p>

        <p>
          <strong>Design for idempotency.</strong> Operations should be safe to retry. Use unique
          operation IDs and track which operations have been processed. For updates, use version
          checks. For inserts, use unique constraints. Idempotency makes retry safe and simplifies
          error handling.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Not handling deadlocks.</strong> Deadlocks are inevitable in systems with
          contention. The error is recoverable—retry the transaction. But without retry logic,
          deadlocks become user-visible failures. Always catch deadlock errors and retry with
          backoff.
        </p>

        <p>
          <strong>Retrying without idempotency.</strong> If an operation isn't idempotent, retries
          can cause duplicate effects (double-charges, duplicate orders). Always design operations
          to be idempotent before implementing retry logic. Use unique operation IDs and track
          processed operations.
        </p>

        <p>
          <strong>Immediate retries without backoff.</strong> Retrying immediately often causes
          repeated collisions. If two transactions deadlock and both retry immediately, they'll
          likely deadlock again. Use exponential backoff with jitter to give conflicting
          transactions time to complete.
        </p>

        <p>
          <strong>Ignoring lock ordering.</strong> Accessing resources in inconsistent order is
          the most common cause of deadlocks. If Transaction A locks rows 1 then 2, and Transaction
          B locks rows 2 then 1, deadlock is possible. Enforce consistent lock ordering across all
          transactions.
        </p>

        <p>
          <strong>Using Serializable for everything.</strong> Serializable isolation prevents all
          anomalies but has high overhead. It's often overkill—most applications work correctly
          with Read Committed or Repeatable Read plus explicit locking for critical sections.
          Reserve Serializable for cases where you can demonstrate anomalies at lower levels.
        </p>

        <p>
          <strong>Not monitoring retry rates.</strong> Retries are a canary in the coal mine for
          concurrency issues. A spike in retry rates indicates increased contention, which might
          precede user-visible failures. Monitor retry rates by error type and alert on anomalies.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Stock Trading Platform (Pessimistic Locking)</h3>
        <p>
          A stock trading platform processes buy and sell orders that must check and update account
          balances and stock positions. Each order uses SELECT FOR UPDATE to lock the account row,
          validates sufficient funds or shares, updates the balance/position, and commits. If two
          orders compete for the same account, one waits for the other—preventing overdrafts and
          ensuring accurate positions.
        </p>

        <p>
          The platform implements retry logic for deadlocks (rare but possible with high-frequency
          trading). Orders are idempotent—each has a unique order ID, and duplicate submissions
          are detected and rejected. Lock wait times are monitored; spikes indicate hot accounts
          that may need special handling (e.g., queue-based serialization for high-volume traders).
        </p>

        <h3>Content Management System (MVCC)</h3>
        <p>
          A CMS like WordPress or Medium uses MVCC for article management. Authors can edit articles
          while readers view them—readers see a consistent snapshot, writers create new versions.
          When an author publishes, the new version becomes visible to subsequent readers.
        </p>

        <p>
          For collaborative editing (multiple authors editing the same article), the system uses
          optimistic locking with version checks. If two authors edit simultaneously, the second
          to save sees a conflict and is prompted to merge changes. This is acceptable because
          concurrent edits are rare, and the merge workflow is a standard feature.
        </p>

        <h3>Flash Sale System (Queue-Based Serialization)</h3>
        <p>
          An e-commerce platform runs flash sales where 10,000 items are released to 100,000+
          waiting users. Database locking would cause massive contention and deadlocks. Instead,
          the system uses queue-based serialization: users click "buy" and enter a waiting room,
          requests are queued in Redis, and a worker processes them one at a time.
        </p>

        <p>
          Each request checks inventory (decrement if available), creates an order, and returns
          success or failure. Because requests are serialized, there are no conflicts—no locking,
          no deadlocks, no retries. The queue acts as a shock absorber, smoothing the traffic
          spike into a manageable rate.
        </p>

        <h3>Banking Transfer System (Hybrid Approach)</h3>
        <p>
          A banking system processes money transfers between accounts. Each transfer uses SELECT
          FOR UPDATE to lock both accounts (in consistent order—lower ID first), validates
          sufficient funds, debits one account, credits the other, and commits. This prevents
          overdrafts and ensures atomicity.
        </p>

        <p>
          For balance inquiries (read-only), the system uses MVCC—no locks, readers see a
          consistent snapshot. This allows millions of balance checks per hour without blocking
          transfers. The hybrid approach provides correctness for writes and high concurrency
          for reads.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: Explain the difference between pessimistic and optimistic concurrency control.
              When would you choose one over the other?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Pessimistic concurrency control assumes conflicts are
              likely and prevents them proactively using locks (e.g., SELECT FOR UPDATE, 2PL).
              Transactions acquire locks before accessing data and hold them until commit. This
              prevents conflicts but reduces concurrency and risks deadlocks. Optimistic
              concurrency control assumes conflicts are rare and detects them at commit time
              using version checks. Transactions read with version numbers, modify locally,
              then validate at commit. This has low overhead but requires retries on conflict.
              Choose pessimistic for high-contention, write-heavy workloads (financial
              transactions). Choose optimistic for low-contention, read-heavy workloads (web
              browsing, content feeds).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the role of MVCC? Answer: MVCC combines both
              approaches—maintains multiple versions so readers see snapshots without blocking
              writers. Best for read-heavy workloads where you want high concurrency without
              optimistic retry overhead.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is a deadlock? How do you detect, prevent, and recover from deadlocks?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> A deadlock occurs when two or more transactions wait for
              each other's locks in a cycle—neither can proceed. Detection: maintain a wait-for
              graph and periodically search for cycles. When found, select a victim transaction
              (cheapest to abort) and roll it back. Prevention: consistent lock ordering (always
              lock resources in same order), lock timeouts (abort if waiting too long), short
              transactions (reduce lock hold time). Recovery: abort victim, release its locks,
              allow other transactions to proceed, retry the aborted transaction with exponential
              backoff.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent deadlocks in application code? Answer:
              Access resources in consistent order (document and enforce this), keep transactions
              short, use lower isolation levels where safe, implement retry logic as a safety net.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: Your system is seeing increased deadlock rates after a deployment. How do you
              diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> First, examine deadlock graphs to identify which transactions
              and resources are involved. Look for patterns: are two transactions acquiring locks
              in opposite order? Is a new feature holding locks longer? Common fixes: (1) Ensure
              consistent lock ordering across all transactions, (2) Shorten transactions to reduce
              lock hold time, (3) Use explicit locking hints to control lock acquisition order,
              (4) Consider switching from pessimistic to optimistic concurrency if appropriate,
              (5) Add retry logic with exponential backoff for deadlock victims. Monitor deadlock
              rates after changes to verify improvement.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What metrics would you monitor proactively? Answer:
              Deadlock count per hour, average lock wait time, transaction abort rate, average
              transaction duration. Set alerts for spikes—these often indicate new contention
              patterns before they cause user-visible failures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a retry strategy for handling concurrency failures. What are the key
              considerations?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Retry strategy should include: (1) Exponential backoff—start
              with 100ms, then 200ms, 400ms, 800ms to give conflicting transactions time to complete.
              (2) Jitter—add random variation to prevent synchronized retries. (3) Reasonable
              limits—3-5 retries for deadlocks, maximum total retry time under 2 seconds. (4)
              Idempotency—operations must be safe to retry without duplicate effects. (5)
              Selective retry—retry deadlock victims, serialization failures, optimistic lock
              conflicts; don't retry constraint violations or business logic errors. (6)
              Monitoring—track retry rates, success rate by attempt, alert on spikes.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you ensure idempotency? Answer: Use unique
              operation IDs, track processed operations, use version checks for updates
              (UPDATE ... WHERE version = X), use unique constraints for inserts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: You're designing a flash sale system where 100,000 users compete for 10,000
              items. How do you handle concurrency?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Database locking would cause massive contention and deadlocks.
              Use queue-based serialization: (1) Users click "buy" and enter a waiting room. (2)
              Requests are queued in Redis or a message queue. (3) A worker processes requests one
              at a time, checking inventory, creating orders, returning success/failure. (4) Because
              requests are serialized, there are no conflicts—no locking, no deadlocks, no retries.
              The queue acts as a shock absorber, smoothing the traffic spike. Alternative: use
              Redis INCR with atomic decrement, pre-allocate inventory to a Redis list and dequeue
              for purchases. Both approaches serialize access without database locking.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle failures in the queue processor? Answer:
              Use at-least-once processing with idempotent order creation (unique order IDs),
              dead-letter queue for failed requests, monitoring for queue depth and processing
              rate, automatic scaling of workers based on queue size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Compare MVCC with traditional locking. What are the trade-offs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Traditional locking (2PL) acquires locks before accessing
              data. Readers block writers, writers block readers. Prevents all conflicts but
              reduces concurrency and risks deadlocks. MVCC maintains multiple versions of each
              row. Readers see a snapshot at transaction start, writers create new versions.
              Readers never block writers, dramatically improving read concurrency. Trade-offs:
              locking is simpler but has lower concurrency; MVCC has higher concurrency but
              storage overhead (multiple versions) and maintenance cost (vacuum/cleanup).
              PostgreSQL and Oracle use MVCC; SQL Server uses locking with optional snapshot
              isolation.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What happens if MVCC version cleanup falls behind?
              Answer: Storage bloats (dead tuples accumulate), query performance degrades (more
              versions to scan), long-running transactions prevent cleanup. Monitor transaction
              age and vacuum lag; kill or warn about transactions that run too long.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Philip A. Bernstein, Vassos Hadzilacos, and Nathan Goodman, <em>Concurrency Control
            and Recovery in Database Systems</em>, Addison-Wesley, 1987.
          </li>
          <li>
            Jim Gray and Andreas Reuter, <em>Transaction Processing: Concepts and Techniques</em>,
            Morgan Kaufmann, 1992.
          </li>
          <li>
            Michael J. Carey, "Concurrency Control and Recovery," in <em>Database System
            Concepts</em>, 6th Edition, McGraw-Hill, 2010.
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapters 7-9.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapters 8-10.
          </li>
          <li>
            PostgreSQL Documentation, "Transaction Isolation" and "MVCC,"
            https://www.postgresql.org/docs/current/transaction-iso.html
          </li>
          <li>
            MySQL Documentation, "InnoDB Locking and Transaction Model,"
            https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html
          </li>
          <li>
            Oracle Documentation, "Concurrency Control,"
            https://docs.oracle.com/en/database/oracle/oracle-database/
          </li>
          <li>
            Peter Bailis et al., "Coordination Avoidance in Database Systems," <em>VLDB</em>,
            2014.
          </li>
          <li>
            Kyle Kingsbury (aphyr), "The Jepsen Series" (distributed systems failure analysis),
            https://jepsen.io/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
