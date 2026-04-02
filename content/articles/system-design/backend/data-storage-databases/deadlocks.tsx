"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-deadlocks-complete",
  title: "Deadlocks",
  description:
    "Comprehensive guide to deadlocks: circular wait conditions, wait-for graphs, detection, prevention strategies (lock ordering, short transactions), and handling deadlocks in applications.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "deadlocks",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "deadlocks", "concurrency", "transactions"],
  relatedTopics: [
    "concurrency-control",
    "transaction-isolation-levels",
    "database-constraints",
    "stored-procedures-and-functions",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Deadlocks</h1>
        <p className="lead">
          A deadlock occurs when two or more transactions are waiting for each other to release
          locks, creating a circular dependency where neither can proceed. Transaction A holds
          Resource 1, waits for Resource 2. Transaction B holds Resource 2, waits for Resource 1.
          Both wait forever (deadlock). Databases automatically detect deadlocks (wait-for graph,
          cycle detection) and resolve by rolling back one transaction (victim selection).
          Deadlocks are different from lock contention (waiting for lock) - deadlocks are
          circular waits (no progress possible without intervention).
        </p>

        <p>
          Consider a banking transfer. Transaction A: debit Account 1, credit Account 2.
          Transaction B: debit Account 2, credit Account 1. Execution: A locks Account 1,
          B locks Account 2. A waits for Account 2 (held by B), B waits for Account 1 (held
          by A). Deadlock! Database detects, rolls back one transaction (victim), other
          proceeds. Application must handle deadlock error (retry transaction).
        </p>

        <p>
          Deadlocks require four conditions (Coffman conditions): <strong>Mutual
          exclusion</strong> (resource held by one transaction), <strong>Hold and
          wait</strong> (hold resource, wait for another), <strong>No preemption</strong>
          (can't forcibly take resource), <strong>Circular wait</strong> (circular chain
          of waiting). Break any condition → prevent deadlocks. Common prevention: lock
          ordering (always lock resources in same order - breaks circular wait).
        </p>

        <p>
          This article provides a comprehensive examination of deadlocks: deadlock conditions
          (Coffman conditions), detection (wait-for graphs, cycle detection), prevention
          strategies (lock ordering, short transactions, retry logic), and handling deadlocks
          in applications (catch error, retry, log). We'll explore when deadlocks occur
          (high-concurrency updates, foreign key constraints, batch operations) and how to
          prevent them (consistent lock ordering, short transactions, lower isolation levels).
          We'll also cover best practices (retry logic, monitoring, analysis) and common
          pitfalls (inconsistent ordering, long transactions, no retry handling).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/deadlocks-architecture.svg`}
          caption="Figure 1: Deadlock Architecture and Detection showing Deadlock Example (Circular Wait): Transaction A (Holds: Row 1, Waits for Row 2) ↔ Transaction B (Holds: Row 2, Waits for Row 1). Circular dependency - neither can proceed. Deadlock Detection: Wait-For Graph (Nodes = transactions, Edges = waits) → Cycle Detection (Cycle = deadlock detected). Database periodically checks for cycles. On detection: victim selection (rollback one). Deadlock Prevention Strategies: Lock Ordering (always lock in same order), Short Transactions (hold locks briefly), Retry Logic (retry on deadlock), Timeout (abort if wait too long). Key characteristics: Circular wait, mutual exclusion, hold and wait, no preemption. Detection: wait-for graph, cycle detection. Prevention: lock ordering, short transactions, retry logic."
          alt="Deadlock architecture and detection"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Deadlock Conditions &amp; Detection</h2>

        <h3>Coffman Conditions (All Required for Deadlock)</h3>
        <p>
          Four conditions must all be present for deadlock (Coffman conditions):
        </p>

        <p>
          <strong>Mutual exclusion</strong>: Resource can be held by only one transaction at
          a time. Database locks are exclusive (one holder). Can't eliminate (fundamental to
          locking).
        </p>

        <p>
          <strong>Hold and wait</strong>: Transaction holds one resource, waits for another.
          Example: Transaction A locks Row 1, then tries to lock Row 2 (held by B). Can reduce
          (acquire all locks at once), but impractical (don't know all needed locks upfront).
        </p>

        <p>
          <strong>No preemption</strong>: Can't forcibly take resource from holder. Database
          can't revoke lock (would break ACID). Must wait for holder to release. Can't
          eliminate (fundamental to transactions).
        </p>

        <p>
          <strong>Circular wait</strong>: Circular chain of waiting (A waits for B, B waits
          for A). This is the key condition to break. Prevention: <strong>lock ordering</strong>
          (always lock resources in same order - no circular chain possible).
        </p>

        <p>
          Break any condition → prevent deadlocks. Practical approach: break circular wait
          (lock ordering), reduce hold and wait (short transactions).
        </p>

        <h3>Wait-For Graph</h3>
        <p>
          <strong>Wait-for graph</strong> is used for deadlock detection. Nodes = transactions,
          Edges = "waits for" relationships. Example: Transaction A → Transaction B (A waits
          for lock held by B). Deadlock = cycle in graph (A → B → A).
        </p>

        <p>
          Database periodically checks wait-for graph for cycles (every few seconds). On
          cycle detection: <strong>Victim selection</strong> (choose one transaction to
          rollback). Criteria: least work done (minimize rollback cost), youngest transaction
          (started most recently), lowest priority. Rollback victim, release locks, other
          transactions proceed.
        </p>

        <p>
          Detection overhead: checking for cycles is O(n²) or O(n³) depending on algorithm.
          Database balances: check frequently (detect deadlocks quickly) vs check infrequently
          (less overhead). Typical: every 1-5 seconds.
        </p>

        <h3>Deadlock vs Lock Contention</h3>
        <p>
          <strong>Lock contention</strong>: Transaction waits for lock held by another. Normal
          (expected in concurrent systems). Resolves when holder releases lock. Example: A
          waits for B, B commits in 100ms, A proceeds.
        </p>

        <p>
          <strong>Deadlock</strong>: Circular wait (A waits for B, B waits for A). No progress
          possible without intervention. Database must rollback one transaction. Example: A
          waits for B, B waits for A → deadlock detected → A rolled back, B proceeds.
        </p>

        <p>
          Key difference: lock contention resolves naturally (when holder releases), deadlock
          requires intervention (rollback victim).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/deadlocks-prevention.svg`}
          caption="Figure 2: Deadlock Prevention and Resolution showing Coffman Conditions (All Required for Deadlock): 1. Mutual Exclusion (Resource held by one transaction), 2. Hold and Wait (Hold resource, wait for another), 3. No Preemption (Can't forcibly take resource), 4. Circular Wait (Circular chain of waiting). Prevention Techniques: Lock Ordering (Break circular wait), Short Transactions (Reduce hold time), Lock Timeout (Abort if wait too long), Retry Logic (Retry on deadlock error). Deadlock Resolution (When Detected): Victim Selection (Rollback one transaction), Criteria (Least work, youngest), Application (Catch & retry error), Log (Track for analysis). Key takeaway: Prevent deadlocks by breaking Coffman conditions (lock ordering breaks circular wait). Handle deadlocks gracefully (retry logic). Keep transactions short to reduce risk."
          alt="Deadlock prevention and resolution"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Prevention &amp; Handling</h2>

        <h3>Prevention Strategies</h3>
        <p>
          <strong>Lock ordering</strong>: Always acquire locks in same order. Example: always
          lock Account 1 before Account 2 (by account ID). Transaction A: lock Account 1,
          then Account 2. Transaction B: lock Account 1, then Account 2 (same order). No
          circular wait possible (both try to lock Account 1 first - one succeeds, other
          waits). Benefits: prevents deadlocks (breaks circular wait). Trade-offs: requires
          coordination (all code paths must use same order).
        </p>

        <p>
          <strong>Short transactions</strong>: Hold locks for shortest time possible. Acquire
          locks late (just before use), release early (immediately after use). Benefits:
          reduces deadlock window (less time holding locks), reduces contention (locks held
          briefly). Trade-offs: may require restructuring code (can't hold lock across
          user interaction, network calls).
        </p>

        <p>
          <strong>Lock timeout</strong>: Abort transaction if lock wait exceeds timeout.
          <code className="inline-code">SET lock_timeout = '5s'</code>. Benefits: prevents
          indefinite waiting, detects potential deadlocks early. Trade-offs: may abort
          legitimate long waits (false positives).
        </p>

        <p>
          <strong>Retry logic</strong>: Catch deadlock error, retry transaction. Example:
          <code className="inline-code">try &#123; tx.commit() &#125; catch
          (DeadlockException) &#123; retry() &#125;</code>. Benefits: handles deadlocks gracefully
          (user doesn't see error), automatic recovery. Trade-offs: retry overhead, may
          retry multiple times before success.
        </p>

        <h3>Handling Deadlocks in Application</h3>
        <p>
          Applications must handle deadlock errors (database rolls back victim transaction).
          Pattern: <strong>Catch deadlock exception</strong> (database-specific error code),
          <strong>Wait briefly</strong> (let other transaction complete), <strong>Retry
          transaction</strong> (re-execute from start), <strong>Log details</strong> (for
          analysis if frequent).
        </p>

        <p>
          Retry strategy: <strong>Exponential backoff</strong> (wait 100ms, then 200ms, then
          400ms), <strong>Max retries</strong> (give up after 3-5 retries), <strong>Log
          failures</strong> (alert if deadlocks frequent). Example:
          <code className="inline-code">for (i = 0; i &lt; maxRetries; i++) &#123; try &#123;
          transaction(); break; &#125; catch (DeadlockException) &#123; sleep(100 * 2^i); &#125; &#125;</code>.
        </p>

        <p>
          Deadlock analysis: log deadlock details (which transactions, which resources),
          analyze patterns (same tables? same code path?), fix root cause (add lock ordering,
          shorten transactions). Benefits: reduce deadlock frequency over time.
        </p>

        <h3>Database-Specific Behavior</h3>
        <p>
          <strong>PostgreSQL</strong>: Detects deadlocks automatically (wait-for graph),
          rolls back youngest transaction (least work lost). Error:
          <code className="inline-code">ERROR: deadlock detected</code>. Prevention:
          <code className="inline-code">SET lock_timeout</code>, application retry logic.
        </p>

        <p>
          <strong>MySQL/InnoDB</strong>: Detects deadlocks automatically, rolls back
          transaction with least exclusive locks. Error:
          <code className="inline-code">ERROR 1213 (40001): Deadlock found when trying to
          get lock</code>. Prevention: <code className="inline-code">innodb_lock_wait_timeout</code>,
          application retry logic.
        </p>

        <p>
          <strong>SQL Server</strong>: Detects deadlocks automatically, chooses victim based
          on rollback cost. Error: <code className="inline-code">Error 1205: Deadlock
          victim</code>. Prevention: <code className="inline-code">SET LOCK_TIMEOUT</code>,
          application retry logic.
        </p>

        <p>
          <strong>Oracle</strong>: Detects deadlocks automatically, rolls back one statement
          (not entire transaction). Error: <code className="inline-code">ORA-00060: deadlock
          detected while waiting for resource</code>. Application must rollback and retry.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/deadlocks-use-cases.svg`}
          caption="Figure 3: Deadlocks Use Cases and Best Practices. Common Scenarios: Update same rows in different order, Foreign key constraints, Bitmap index updates, Reverse range updates, Long-running transactions. High-Risk Operations: Batch updates (multiple rows), Data migration scripts, Concurrent inventory updates, Financial transactions, Booking/reservation systems. Best Practices: Consistent lock ordering, Keep transactions short, Access objects in same order, Use lower isolation levels, Implement retry logic. Deadlock Handling in Application: Catch Error (Deadlock exception), Wait & Retry (Exponential backoff), Log Details (Debug analysis), Alert (If frequent). Anti-patterns: Inconsistent lock ordering (different order in different code paths), long transactions (hold locks too long), no retry logic (fail on first deadlock), ignoring deadlock logs (miss patterns), user interaction in transactions (locks held while waiting)."
          alt="Deadlocks use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Prevention Approaches</h2>

        <p>
          Different deadlock prevention approaches have trade-offs. Understanding them helps
          you choose the right strategy.
        </p>

        <h3>Lock Ordering</h3>
        <p>
          <strong>Strengths</strong>: Prevents deadlocks (breaks circular wait), no runtime
          overhead (no detection needed), deterministic (same order always works).
        </p>

        <p>
          <strong>Limitations</strong>: Requires coordination (all code paths must use same
          order), hard to enforce (distributed codebase), may not be practical (don't know
          all locks upfront).
        </p>

        <p>
          <strong>Use for</strong>: Critical code paths (financial transactions), known
          resource sets (fixed accounts), team coordination (document ordering convention).
        </p>

        <h3>Short Transactions</h3>
        <p>
          <strong>Strengths</strong>: Reduces deadlock window (less time holding locks),
          reduces contention (locks released quickly), improves throughput (less waiting).
        </p>

        <p>
          <strong>Limitations</strong>: May require code restructuring (can't hold lock
          across operations), not always possible (business logic requires long transaction).
        </p>

        <p>
          <strong>Use for</strong>: All transactions (best practice), especially high-
          concurrency scenarios (many simultaneous transactions).
        </p>

        <h3>Retry Logic</h3>
        <p>
          <strong>Strengths</strong>: Handles deadlocks gracefully (user doesn't see error),
          automatic recovery (no manual intervention), works with any prevention strategy.
        </p>

        <p>
          <strong>Limitations</strong>: Retry overhead (re-execute transaction), may retry
          multiple times (wasted work), doesn't prevent deadlocks (only handles them).
        </p>

        <p>
          <strong>Use for</strong>: All applications (best practice), especially where
          deadlocks are rare but possible (high-concurrency systems).
        </p>

        <h3>Lock Timeout</h3>
        <p>
          <strong>Strengths</strong>: Prevents indefinite waiting, detects potential deadlocks
          early, fails fast (user knows quickly).
        </p>

        <p>
          <strong>Limitations</strong>: May abort legitimate long waits (false positives),
          requires tuning (too short = false positives, too long = slow detection).
        </p>

        <p>
          <strong>Use for</strong>: Interactive applications (user waiting), systems with
          SLA requirements (must respond within time limit).
        </p>

        <h3>Lower Isolation Levels</h3>
        <p>
          <strong>Strengths</strong>: Fewer locks (read committed vs serializable), less
          contention (fewer conflicts), fewer deadlocks (fewer lock conflicts).
        </p>

        <p>
          <strong>Limitations</strong>: Weaker guarantees (may see uncommitted data,
          non-repeatable reads), not suitable for all use cases (financial transactions
          need strong isolation).
        </p>

        <p>
          <strong>Use for</strong>: Read-heavy workloads (reports, analytics), where weak
          isolation is acceptable (eventual consistency OK).
        </p>

        <h3>Combined Approach</h3>
        <p>
          Use <strong>multiple strategies</strong> together:
        </p>

        <p>
          <strong>Prevent</strong>: Lock ordering (break circular wait), short transactions
          (reduce window). <strong>Detect</strong>: Database automatic detection (wait-for
          graph). <strong>Handle</strong>: Retry logic (catch deadlock, retry), lock timeout
          (fail fast), logging (analyze patterns).
        </p>

        <p>
          Example: Financial transfer application. Lock ordering (always lock by account ID),
          short transactions (lock just for update, release immediately), retry logic
          (catch deadlock, retry up to 3 times), logging (log all deadlocks for analysis).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Deadlock Prevention</h2>

        <p>
          <strong>Use consistent lock ordering.</strong> Always acquire locks in same order
          (by ID, by name, by type). Document ordering convention (team follows same order).
          Benefits: prevents deadlocks (breaks circular wait).
        </p>

        <p>
          <strong>Keep transactions short.</strong> Acquire locks late (just before use),
          release early (immediately after use). Don't hold locks across: user interaction
          (waiting for input), network calls (API calls, file I/O), complex calculations
          (do calculation before/after transaction). Benefits: reduces deadlock window,
          improves throughput.
        </p>

        <p>
          <strong>Implement retry logic.</strong> Catch deadlock exceptions, retry
          transaction (with exponential backoff). Max retries: 3-5 (give up if persistent).
          Log retries (track frequency). Benefits: handles deadlocks gracefully, automatic
          recovery.
        </p>

        <p>
          <strong>Use lower isolation levels when possible.</strong> Read committed vs
          serializable (fewer locks, fewer deadlocks). Use strong isolation only when
          required (financial transactions). Benefits: fewer locks, fewer deadlocks.
        </p>

        <p>
          <strong>Access objects in same order.</strong> If transaction accesses multiple
          tables, access in same order (users → orders → order_items). Benefits: prevents
          deadlocks (consistent ordering).
        </p>

        <p>
          <strong>Monitor deadlock logs.</strong> Database logs deadlock details (which
          transactions, which resources). Review regularly (identify patterns). Fix root
          cause (add lock ordering, shorten transactions). Benefits: reduce deadlock
          frequency over time.
        </p>

        <p>
          <strong>Avoid user interaction in transactions.</strong> Don't hold locks while
          waiting for user input (web form, confirmation). Benefits: prevents long lock
          holds (reduces contention and deadlock risk).
        </p>

        <p>
          <strong>Use optimistic locking when appropriate.</strong> Version-based concurrency
          (no locks, detect conflicts on commit). Benefits: no deadlocks (no locks to wait
          for). Trade-offs: conflicts on commit (retry needed).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Inconsistent lock ordering.</strong> Different code paths lock resources
          in different order. Transaction A: lock Account 1, then Account 2. Transaction B:
          lock Account 2, then Account 1. Deadlock! Solution: document and enforce lock
          ordering (always lock by account ID).
        </p>

        <p>
          <strong>Long transactions.</strong> Holding locks for long time (seconds/minutes).
          Increases deadlock window (more time for conflicts). Solution: keep transactions
          short (milliseconds), don't hold locks across user interaction/network calls.
        </p>

        <p>
          <strong>No retry logic.</strong> Application fails on first deadlock (user sees
          error). Solution: implement retry logic (catch deadlock, retry with backoff).
          Benefits: automatic recovery, better UX.
        </p>

        <p>
          <strong>Ignoring deadlock logs.</strong> Not reviewing deadlock details (miss
          patterns). Solution: log all deadlocks, review regularly, fix root cause (add
          lock ordering, shorten transactions). Benefits: reduce deadlock frequency.
        </p>

        <p>
          <strong>User interaction in transactions.</strong> Holding locks while waiting
          for user input (web form, confirmation). Locks held for seconds/minutes. Solution:
          complete transaction before/after user interaction (don't hold locks during
          interaction). Benefits: shorter lock holds, fewer deadlocks.
        </p>

        <p>
          <strong>Foreign key deadlocks.</strong> Updating parent and child tables in
          different order. Transaction A: update parent, then child. Transaction B: update
          child, then parent. Deadlock! Solution: always update in same order (parent
          first, then child).
        </p>

        <p>
          <strong>Batch update deadlocks.</strong> Updating multiple rows without ordering.
          Transaction A: update rows 1, 2, 3. Transaction B: update rows 3, 2, 1. Deadlock!
          Solution: order rows before update (update in ID order).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Financial Transfers</h3>
        <p>
          Banking transfer: debit Account A, credit Account B. High deadlock risk (two
          accounts, concurrent transfers). Prevention: lock ordering (always lock lower
          account ID first), short transactions (lock just for update), retry logic (catch
          deadlock, retry). Benefits: prevents deadlocks (consistent ordering), handles
          gracefully (retry).
        </p>

        <h3>Inventory Management</h3>
        <p>
          E-commerce inventory: concurrent orders updating same product stock. Deadlock risk
          (multiple orders, same products). Prevention: lock ordering (order products by ID
          before update), short transactions (update stock, release lock), retry logic
          (retry on deadlock). Benefits: prevents deadlocks (consistent ordering), handles
          gracefully (retry).
        </p>

        <h3>Booking/Reservation Systems</h3>
        <p>
          Flight/hotel booking: concurrent bookings for same seats/rooms. Deadlock risk
          (multiple bookings, overlapping resources). Prevention: lock ordering (lock
          resources in ID order), short transactions (reserve, release), retry logic
          (retry on deadlock). Benefits: prevents deadlocks (consistent ordering), handles
          gracefully (retry).
        </p>

        <h3>Data Migration Scripts</h3>
        <p>
          Batch data migration: updating many rows in multiple tables. High deadlock risk
          (many locks, long-running). Prevention: order updates (by ID), batch small
          (commit frequently), use lower isolation (read committed). Benefits: reduces
          deadlock risk (fewer locks held), faster recovery (small batches).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What is a deadlock? What are the four conditions required for deadlock?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Deadlock: two or more transactions waiting for each
              other to release locks (circular dependency). Neither can proceed without
              intervention. Four conditions (Coffman conditions): (1) Mutual exclusion
              (resource held by one transaction), (2) Hold and wait (hold resource, wait
              for another), (3) No preemption (can't forcibly take resource), (4) Circular
              wait (circular chain of waiting). All four must be present for deadlock.
              Prevention: break any condition (usually circular wait via lock ordering).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How does database detect deadlocks? Answer:
              Wait-for graph (nodes = transactions, edges = waits for). Periodically
              check for cycles (A → B → A = cycle = deadlock). On detection: rollback
              victim (least work, youngest transaction).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do you prevent deadlocks? What strategies work best?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Prevention strategies: (1) Lock ordering (always
              acquire locks in same order - breaks circular wait), (2) Short transactions
              (hold locks briefly - reduces deadlock window), (3) Lock timeout (abort if
              wait too long - fails fast), (4) Retry logic (catch deadlock, retry - handles
              gracefully), (5) Lower isolation levels (fewer locks - fewer conflicts). Best:
              lock ordering (prevents deadlocks) + short transactions (reduces window) +
              retry logic (handles gracefully). Combined approach is most effective.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is lock ordering? Answer: Always acquire
              locks in same order (by ID, by name). Example: always lock Account 1 before
              Account 2. Prevents circular wait (both transactions try to lock Account 1
              first - one succeeds, other waits - no cycle).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How do you handle deadlocks in application code?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Handle deadlocks: (1) Catch deadlock exception
              (database-specific error code), (2) Wait briefly (let other transaction
              complete), (3) Retry transaction (re-execute from start), (4) Log details
              (for analysis if frequent), (5) Alert if frequent (indicates systemic issue).
              Retry strategy: exponential backoff (100ms, 200ms, 400ms), max retries (3-5),
              log failures. Example: <code className="inline-code">for (i = 0; i &lt;
              maxRetries; i++) &#123; try &#123; transaction(); break; &#125; catch (DeadlockException)
              &#123; sleep(100 * 2^i); &#125; &#125;</code>.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why exponential backoff? Answer: Reduces
              contention (stagger retries), increases chance of success (other transaction
              completes), prevents thundering herd (all retries at same time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What's the difference between deadlock and lock contention?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Lock contention: Transaction waits for lock held by
              another. Normal (expected in concurrent systems). Resolves when holder
              releases lock. Example: A waits for B, B commits in 100ms, A proceeds.
              Deadlock: Circular wait (A waits for B, B waits for A). No progress possible
              without intervention. Database must rollback one transaction. Example: A
              waits for B, B waits for A → deadlock detected → A rolled back, B proceeds.
              Key difference: lock contention resolves naturally (when holder releases),
              deadlock requires intervention (rollback victim).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you distinguish in logs? Answer: Lock
              contention: wait time (A waited 100ms for B). Deadlock: error message
              ("deadlock detected", "deadlock victim"), victim transaction rolled back.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Your application has frequent deadlocks. How do you diagnose and fix?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Review deadlock logs (which transactions,
              which resources), (2) Identify patterns (same tables? same code paths?),
              (3) Check lock ordering (inconsistent ordering?), (4) Check transaction
              duration (long transactions?), (5) Check concurrency level (too many
              simultaneous transactions?). Fix: (1) Add lock ordering (document, enforce),
              (2) Shorten transactions (hold locks briefly), (3) Add retry logic (handle
              gracefully), (4) Reduce concurrency (if too high), (5) Use lower isolation
              (if applicable). Monitor: track deadlock frequency (should decrease after
              fixes).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What tools help diagnose deadlocks? Answer:
              Database deadlock graphs (PostgreSQL: log_lock_waits, MySQL: SHOW ENGINE
              INNODB STATUS), APM tools (New Relic, Datadog - show lock waits), custom
              logging (log all lock acquisitions).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: How do foreign key constraints cause deadlocks? How do you prevent?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Foreign key deadlocks: Transaction A updates parent
              table, then child table. Transaction B updates child table, then parent table.
              Deadlock! (A holds parent, waits for child; B holds child, waits for parent).
              Prevention: (1) Always update in same order (parent first, then child),
              (2) Lock parent before child (consistent ordering), (3) Use deferred
              constraints (check at commit, not during transaction - PostgreSQL). Example:
              always update users → orders → order_items (never reverse order).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are deferred constraints? Answer: Constraint
              checked at commit (not during transaction). PostgreSQL:
              <code className="inline-code">DEFERRABLE INITIALLY DEFERRED</code>. Benefits:
              reduces lock conflicts (locks held briefly), prevents some deadlocks.
              Trade-offs: errors at commit (not during transaction).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            PostgreSQL Documentation, "Explicit Locking," "Deadlocks,"
            https://www.postgresql.org/docs/current/explicit-locking.html
          </li>
          <li>
            MySQL Documentation, "InnoDB Locking," "Deadlocks,"
            https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html
          </li>
          <li>
            SQL Server Documentation, "Deadlocks,"
            https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide
          </li>
          <li>
            Oracle Documentation, "Deadlocks,"
            https://docs.oracle.com/en/database/oracle/oracle-database/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 7.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 7.
          </li>
          <li>
            Wikipedia, "Deadlock,"
            https://en.wikipedia.org/wiki/Deadlock
          </li>
          <li>
            Wikipedia, "Wait-for Graph,"
            https://en.wikipedia.org/wiki/Wait-for_graph
          </li>
          <li>
            CMU Database Group, "Concurrency Control" (YouTube lectures),
            https://www.youtube.com/c/CMUDatabaseGroup
          </li>
          <li>
            Percona Blog, "Deadlock Analysis,"
            https://www.percona.com/blog/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
