"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-distributed-locks",
  title: "Distributed Locks",
  description:
    "Staff-level deep dive into distributed locks covering Redis Redlock, ZooKeeper sequential locks, fencing tokens, lease-based locking, lock contention reduction, and production trade-offs for mutual exclusion in distributed systems.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "distributed-locks",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: [
    "distributed locks",
    "Redlock",
    "ZooKeeper locks",
    "fencing tokens",
    "lease-based locking",
    "lock contention",
    "mutual exclusion",
    "etcd locks",
    "Redis locks",
  ],
  relatedTopics: [
    "consensus-algorithms",
    "distributed-coordination",
    "distributed-transactions",
    "quorum",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>distributed lock</strong> is a synchronization primitive
          that ensures mutual exclusion across multiple processes or services
          that do not share memory. In a single-process application, a mutex
          (mutual exclusion lock) ensures that only one thread can access a
          shared resource at a time. In a distributed system, where multiple
          processes run on different machines and communicate over a network, a
          distributed lock serves the same purpose — it ensures that only one
          process can access a shared resource (a database row, a file, a
          counter, an external API) at a time, even when the processes are
          running on different machines in different data centers.
        </p>
        <p>
          Distributed locks are fundamentally harder to implement correctly
          than in-process mutexes because they must handle network partitions,
          clock skew, process crashes, and garbage collection pauses — failure
          modes that do not exist in a single-process environment. A process
          holding a distributed lock may crash without releasing it, leaving
          the lock permanently held (a deadlock). A network partition may cause
          the lock service to believe that a process has released the lock when
          it has not, allowing another process to acquire the lock while the
          first process still believes it holds it (a split-brain scenario). A
          garbage collection pause may cause a process to hold the lock longer
          than its lease time, allowing another process to acquire the lock and
          access the resource concurrently.
        </p>
        <p>
          The two most widely deployed distributed lock implementations are{" "}
          <strong>Redis-based locks</strong> (using the Redlock algorithm,
          which acquires locks across multiple independent Redis instances) and{" "}
          <strong>ZooKeeper-based locks</strong> (using ephemeral sequential
          znodes, which provide fair FIFO ordering and automatic lock release
          on client disconnect). Redis locks are simpler to deploy and provide
          lower latency (sub-millisecond lock acquisition), but they are
          vulnerable to clock skew and network partition issues. ZooKeeper
          locks are more complex to deploy but provide stronger guarantees
          (fair ordering, automatic release on disconnect, no clock dependency)
          at the cost of higher latency (5–20 ms lock acquisition).
        </p>
        <p>
          For staff and principal engineers, distributed lock design involves
          solving several non-trivial problems: ensuring that locks are released
          even if the holder crashes (TTL-based leases), preventing stale
          clients from accessing the resource after their lock has expired
          (fencing tokens), reducing lock contention for hot resources (lock
          striping, optimistic locking), and choosing the right lock
          implementation for the consistency requirements (Redis Redlock for
          low-latency, ZooKeeper for fair ordering, etcd for linearizable
          locks). These decisions determine the system&apos;s correctness under
          failure, its throughput characteristics, and the operational
          complexity of managing the lock infrastructure.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          The fundamental property of a distributed lock is{" "}
          <strong>mutual exclusion</strong> — at any point in time, at most one
          process holds the lock for a given resource. This property must be
          maintained even in the presence of network partitions, process
          crashes, and clock skew. To achieve mutual exclusion, the lock
          service must be a single point of coordination (or a consensus-based
          cluster that acts as a single logical coordinator). In Redis, the
          lock service is a single Redis instance (or multiple independent
          instances in Redlock). In ZooKeeper, the lock service is the ZooKeeper
          ensemble (a consensus-based cluster that provides a consistent view
          of the lock state).
        </p>

        <p>
          <strong>TTL-based leases</strong> are the primary mechanism for
          preventing deadlocks when a lock holder crashes. Instead of acquiring
          a lock indefinitely, the client acquires a <em>lease</em> — a
          time-limited lock that automatically expires after a specified
          duration (the TTL). The client must release the lease before it
          expires, or it must renew the lease (extend the TTL) to continue
          holding the lock. If the client crashes without releasing the lease,
          the lease expires automatically, and the lock becomes available for
          other clients to acquire. The TTL must be chosen carefully — too
          short, and the client may lose the lock during a temporary slowdown
          (e.g., a garbage collection pause); too long, and other clients must
          wait too long for the lock if the holder crashes.
        </p>

        <p>
          <strong>Fencing tokens</strong> are the primary mechanism for
          preventing stale clients from accessing the resource after their lock
          has expired. When the lock service grants a lock, it returns a
          monotonically increasing token (a sequence number) along with the
          lock. The client includes this token in every operation on the
          protected resource. The resource tracks the highest token it has seen
          and rejects operations with tokens lower than the highest seen. This
          ensures that if Client A holds the lock with token 1, and Client B
          acquires the lock with token 2 after Client A&apos;s lease expires,
          Client A&apos;s subsequent operations (with token 1) are rejected by
          the resource (because 1 &lt; 2). Fencing tokens solve the fundamental
          problem of distributed locks: a client cannot reliably detect that it
          has lost the lock (because the network may be partitioned), so the
          resource itself must enforce the lock&apos;s exclusivity.
        </p>

        <p>
          The <strong>Redlock algorithm</strong> (proposed by Salvatore
          Sanfilippo, creator of Redis) acquires a lock across N independent
          Redis instances (typically N = 5). The client attempts to acquire the
          lock on each instance sequentially, using the <code>SET key value NX
          PX ttl</code> command (set the key if it does not exist, with a TTL).
          If the client acquires the lock on a majority of instances (N/2 + 1)
          within a timeout, the lock is considered acquired. The effective TTL
          is the original TTL minus the time taken to acquire the locks. If the
          client fails to acquire the lock on a majority of instances, it
          releases the lock on all instances (even the ones that granted it)
          and retries. Redlock tolerates the failure of up to (N-1)/2
          instances — with 5 instances, it tolerates 2 failures.
        </p>

        <p>
          <strong>ZooKeeper sequential locks</strong> use ephemeral sequential
          znodes to implement a fair, FIFO-ordered lock. When a client wants to
          acquire a lock, it creates an ephemeral sequential znode under the
          lock path (e.g., <code>/locks/resource-X/lock-0000000003</code>).
          ZooKeeper assigns a monotonically increasing sequence number to each
          znode. The client then lists all children of the lock path and checks
          whether its znode has the lowest sequence number. If it does, the
          client holds the lock. If it does not, the client sets a watch on the
          znode with the next-lower sequence number (its predecessor) and waits
          for a notification. When the predecessor&apos;s znode is deleted (the
          predecessor released the lock or disconnected), the client receives
          a notification and re-checks whether it now has the lowest sequence
          number. This approach provides fair ordering (clients acquire the
          lock in the order they requested it), automatic lock release (ephemeral
          znodes are deleted when the client disconnects), and no thundering
          herd (each client watches only its predecessor, not all znodes).
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/distributed-locks-diagram-1.svg"
          alt="Distributed lock acquisition flow showing client requesting lock from lock service, receiving token, performing exclusive operation, and releasing lock"
          caption="Lock lifecycle — client acquires lock with TTL, performs exclusive operation, and releases; if the client crashes, the TTL auto-releases the lock"
        />

        <p>
          The lock acquisition flow begins with the client sending a lock
          request to the lock service. The request includes the resource
          identifier (e.g., <code>/resource/X</code>), the desired TTL (e.g.,
          30 seconds), and a unique client identifier. The lock service checks
          whether the resource is currently locked. If it is not, the lock
          service grants the lock, associates it with the client identifier,
          sets the TTL, and returns a lock token (a monotonically increasing
          sequence number) to the client. If the resource is already locked,
          the lock service either rejects the request immediately (in Redis,
          the <code>SET NX</code> command returns failure) or queues the
          request and notifies the client when the lock becomes available (in
          ZooKeeper, the client waits for a watch notification).
        </p>

        <p>
          Once the client holds the lock, it performs its exclusive operation
          on the protected resource. The client must complete the operation
          within the TTL — if the operation takes longer than the TTL, the lock
          expires, and another client may acquire it. To prevent this, the
          client can renew the lock (extend the TTL) before it expires, but
          this introduces a race condition: if the client&apos;s renewal request
          is delayed by a network partition, the lock may expire before the
          renewal is processed, and another client may acquire the lock. The
          fencing token pattern solves this race condition — even if the client
          believes it still holds the lock (because its renewal was delayed),
          the resource will reject its operations if the token is lower than the
          highest token the resource has seen.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/distributed-locks-diagram-2.svg"
          alt="Redlock algorithm showing lock acquisition across 5 independent Redis instances with majority quorum requirement"
          caption="Redlock algorithm — the client acquires the lock on a majority of N independent Redis instances, tolerating up to (N-1)/2 instance failures"
        />

        <p>
          The lock release flow is straightforward: the client sends a release
          request to the lock service, which deletes the lock key (in Redis) or
          the znode (in ZooKeeper). The release must be conditional — the client
          must verify that it still holds the lock before releasing it (to
          prevent a slow client from releasing a lock that it no longer holds,
          which would release another client&apos;s lock). In Redis, this is
          done by including the unique client identifier in the lock value and
          using a Lua script to check the value before deleting the key. In
          ZooKeeper, this is not necessary — the client can only delete its own
          znode (the one it created), so it cannot accidentally release another
          client&apos;s lock.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/distributed-locks-diagram-3.svg"
          alt="ZooKeeper sequential lock showing ephemeral sequential znodes with FIFO ordering and automatic release on client disconnect"
          caption="ZooKeeper sequential lock — clients create ephemeral sequential znodes, and the client with the lowest sequence number holds the lock"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          The choice of distributed lock implementation involves trade-offs
          across latency, fairness, fault tolerance, and operational complexity.
          Redis locks (single instance) are the simplest to deploy and provide
          the lowest latency (sub-millisecond lock acquisition), but they are a
          single point of failure — if the Redis instance crashes, all locks are
          lost. Redis Redlock tolerates instance failures (up to (N-1)/2
          instances can fail) but is vulnerable to clock skew (if the
          client&apos;s clock is significantly different from the Redis
          instance&apos;s clock, the TTL may be incorrect) and has higher
          latency (5–50 ms, depending on the number of instances). ZooKeeper
          locks provide fair ordering (FIFO), automatic lock release on client
          disconnect (ephemeral znodes), and no clock dependency, but they have
          higher latency (5–20 ms) and require a ZooKeeper ensemble (which is
          more complex to deploy and manage than a Redis instance). etcd locks
          provide linearizable locks (using the Raft consensus protocol) with
          moderate latency (5–15 ms) and strong consistency, but they require
          an etcd cluster.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Redis (Single)</th>
              <th className="p-3 text-left">Redis Redlock</th>
              <th className="p-3 text-left">ZooKeeper</th>
              <th className="p-3 text-left">etcd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Latency</strong>
              </td>
              <td className="p-3">
                &lt; 1 ms
              </td>
              <td className="p-3">5–50 ms</td>
              <td className="p-3">5–20 ms</td>
              <td className="p-3">5–15 ms</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fault Tolerance</strong>
              </td>
              <td className="p-3">None (single point)</td>
              <td className="p-3">
                Up to (N-1)/2 instances
              </td>
              <td className="p-3">
                Up to f of 2f+1 ensemble
              </td>
              <td className="p-3">
                Up to f of 2f+1 cluster
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fairness</strong>
              </td>
              <td className="p-3">None (race-based)</td>
              <td className="p-3">None (race-based)</td>
              <td className="p-3">FIFO (sequential znodes)</td>
              <td className="p-3">
                FIFO (revision ordering)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Auto-Release</strong>
              </td>
              <td className="p-3">TTL-based</td>
              <td className="p-3">TTL-based</td>
              <td className="p-3">
                Ephemeral znodes (disconnect)
              </td>
              <td className="p-3">Lease-based</td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/distributed-locks-diagram-4.svg"
          alt="Lock failure scenarios and fencing token protection showing how stale clients are prevented from corrupting resources"
          caption="Fencing tokens — each lock grant gets a monotonically increasing token, and the resource rejects operations with tokens lower than the highest seen"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Always use fencing tokens to protect the resource from stale clients.
          The lock service returns a monotonically increasing token with each
          lock grant, and the client includes this token in every operation on
          the protected resource. The resource tracks the highest token it has
          seen and rejects operations with lower tokens. This is the only
          reliable way to prevent a stale client (one that believes it still
          holds the lock but has actually lost it) from corrupting the resource.
          Without fencing tokens, distributed locks provide mutual exclusion
          only under normal conditions — they fail to protect the resource under
          network partitions, clock skew, or garbage collection pauses.
        </p>

        <p>
          Choose the TTL carefully based on the expected operation duration and
          the system&apos;s failure modes. The TTL should be long enough to
          cover the expected operation duration plus a safety margin (e.g., 2–3×
          the expected duration) to prevent the lock from expiring during a
          temporary slowdown. However, the TTL should not be so long that other
          clients must wait too long for the lock if the holder crashes. A
          common approach is to set the TTL to 30 seconds for short operations
          (database updates, API calls) and 5 minutes for long operations
          (batch processing, data migrations). The client should renew the lock
          (extend the TTL) periodically (every half-TTL) if the operation is
          still in progress, to prevent the lock from expiring.
        </p>

        <p>
          Use ZooKeeper sequential locks when fair ordering is important (e.g.,
          processing requests in the order they were received, preventing
          starvation of slow clients). ZooKeeper&apos;s ephemeral sequential
          znodes provide FIFO ordering by default — clients acquire the lock in
          the order they requested it, and no client can jump ahead of others
          (as can happen with Redis locks, where the fastest client wins the
          race). ZooKeeper locks also provide automatic lock release on client
          disconnect (ephemeral znodes are deleted when the client&apos;s
          session ends), which is more reliable than TTL-based release (the
          client may crash and the TTL may not expire for seconds or minutes,
          during which the lock is held by a dead client).
        </p>

        <p>
          Reduce lock contention by using lock striping (dividing the resource
          into multiple sub-resources, each with its own lock) or optimistic
          locking (using version numbers or conditional writes instead of
          explicit locks). Lock striping is effective when the resource can be
          partitioned (e.g., a hash table with N buckets, each with its own
          lock) — it reduces contention by allowing concurrent access to
          different partitions. Optimistic locking is effective when conflicts
          are rare — the client reads the resource&apos;s current version,
          performs its operation, and writes the result conditionally (only if
          the version has not changed). If the write fails (the version has
          changed), the client retries. This approach avoids the overhead of
          acquiring and releasing a lock for every operation, at the cost of
          potential retries when conflicts are frequent.
        </p>

        <p>
          Monitor lock acquisition latency, lock hold time, and lock contention
          rate continuously. Lock acquisition latency (the time to acquire the
          lock) should be low (sub-millisecond for Redis, 5–20 ms for
          ZooKeeper). Lock hold time (the time the client holds the lock) should
          be as short as possible — long hold times increase contention and
          reduce throughput. Lock contention rate (the fraction of lock requests
          that are blocked by an existing lock holder) should be low — if it is
          high, the lock is a bottleneck, and the system should be redesigned
          to reduce contention (lock striping, optimistic locking, or
          eliminating the lock entirely).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Using a distributed lock when a simpler approach would suffice is a
          common anti-pattern. Distributed locks are complex, error-prone, and
          introduce a single point of coordination (the lock service). Before
          using a distributed lock, consider whether the problem can be solved
          with a simpler approach: single-writer design (only one process writes
          to the resource, eliminating the need for a lock), partitioning
          (each process owns a disjoint subset of the resource, eliminating
          contention), or idempotent operations (the resource can handle
          concurrent writes without corruption, because the writes are
          idempotent). Distributed locks should be a last resort, not a first
          choice.
        </p>

        <p>
          Not handling the case where the lock holder crashes without releasing
          the lock is a critical error. If the lock does not have a TTL (or an
          equivalent auto-release mechanism), the lock is held indefinitely,
          and no other client can acquire it — a deadlock. The solution is to
          use TTL-based leases (the lock expires after a specified duration) or
          ephemeral znodes (the lock is released when the client disconnects).
          The TTL must be chosen carefully — too short, and the lock may expire
          during a temporary slowdown; too long, and other clients must wait
          too long for the lock if the holder crashes.
        </p>

        <p>
          Releasing a lock that the client no longer holds is a subtle bug that
          can cause data corruption. If the client&apos;s lock acquisition was
          slow (due to network latency), the lock may have expired and been
          acquired by another client before the first client&apos;s request
          arrived. When the first client eventually receives the lock
          acknowledgment, it believes it holds the lock, but another client
          already holds it. When the first client finishes its operation and
          releases the lock, it releases the other client&apos;s lock, allowing
          a third client to acquire it — potentially while the second client is
          still operating on the resource. The solution is to use a unique
          client identifier in the lock value and verify that the lock still
          belongs to the client before releasing it (using a Lua script in
          Redis or a conditional delete in ZooKeeper).
        </p>

        <p>
          Assuming that Redlock provides strong safety guarantees is a
          misconception. The Redlock algorithm has been criticized by several
          researchers (notably Martin Kleppmann) for its vulnerability to clock
          skew — if the client&apos;s clock jumps forward (due to NTP
          adjustment or manual clock change), the TTL may be shorter than
          expected, causing the lock to expire prematurely. Additionally, if the
          client experiences a long garbage collection pause, the lock may
          expire during the pause, and another client may acquire it. Redlock
          provides safety only under the assumption that clocks are reasonably
          synchronized and garbage collection pauses are bounded. For
          applications that require strong safety guarantees under all failure
          modes, ZooKeeper or etcd locks are preferable.
        </p>

        <p>
          Not implementing lock acquisition timeouts can cause the client to
          block indefinitely waiting for a lock that will never be available.
          If the lock service is down, or if another client holds the lock
          indefinitely (due to a bug or a crash without auto-release), the
          client waiting for the lock will block forever. The solution is to
          set a lock acquisition timeout (e.g., 5 seconds) — if the lock is
          not acquired within the timeout, the client returns an error to the
          caller and retries later (with exponential backoff). The timeout
          should be chosen based on the application&apos;s tolerance for
          waiting — for user-facing operations, the timeout should be short
          (1–2 seconds) to avoid blocking the user; for background operations,
          the timeout can be longer (30–60 seconds).
        </p>
      </section>

      {/* Section 7: Real-world Use Cases */}
      <section>
        <h2>Real-world Use Cases</h2>

        <p>
          GitHub uses Redis-based distributed locks for its repository
          maintenance operations (garbage collection, repacking, and index
          updates). Each repository has its own lock key (e.g.,{" "}
          <code>{`lock:repo:{repo_id}`}</code>), and the maintenance operation
          acquires the lock before running. The lock has a TTL of 5 minutes,
          and the maintenance operation renews the lock every 2 minutes to
          prevent it from expiring during long-running operations. GitHub uses
          a single Redis instance for locking (with Redis Sentinel for
          failover), and the lock acquisition latency is sub-millisecond. The
          lock ensures that only one maintenance operation runs on a repository
          at a time, preventing concurrent garbage collection from corrupting
          the repository&apos;s object database.
        </p>

        <p>
          Netflix uses ZooKeeper-based distributed locks for its content
          ingestion pipeline, where multiple ingestion workers compete to
          process new content (movies, TV shows) from a queue. Each content
          item has a lock key in ZooKeeper, and the worker acquires the lock
          before processing the content. ZooKeeper&apos;s sequential locks
          ensure fair ordering — workers acquire the lock in the order they
          requested it, preventing starvation. The ephemeral znodes ensure that
          the lock is released if the worker crashes (the ZooKeeper session
          ends), allowing another worker to pick up the content. Netflix&apos;s
          ZooKeeper ensemble consists of 5 nodes, tolerating 2 failures.
        </p>

        <p>
          etcd is used as a distributed lock service by many Kubernetes
          components, including the Kubernetes controller manager and the
          scheduler. Only one instance of the controller manager is active at a
          time (the leader), and the leader election is implemented using etcd
          leases — the active instance holds a lease with a TTL, and it renews
          the lease periodically. If the active instance crashes, the lease
          expires, and another instance acquires the lease and becomes the new
          leader. The etcd lock ensures that only one controller manager is
          active at a time, preventing concurrent controllers from making
          conflicting changes to the Kubernetes cluster state.
        </p>

        <p>
          Google Spanner uses a distributed lock service (built on top of the
          Paxos consensus protocol) for its schema change operations. When a
          schema change is initiated (e.g., adding a column to a table), the
          schema change operation acquires a lock on the table&apos;s metadata,
          which prevents concurrent schema changes and ensures that all tablets
          (data partitions) see a consistent view of the schema during the
          change. The lock is held for the duration of the schema change
          (which may take minutes or hours for large tables), and the lock
          service uses a combination of TTL-based leases and fencing tokens to
          ensure that the lock is released if the schema change operation
          crashes, and that stale schema change operations cannot corrupt the
          table&apos;s metadata.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: A client holds a distributed lock with a 30-second TTL, but
          experiences a 35-second garbage collection pause. What happens to the
          lock, and how do you prevent the resulting data corruption?
          </h3>
          <p className="mb-3">
            During the GC pause, the client is unable to renew the lock, and
            the lock expires after 30 seconds. Another client acquires the lock
            and begins operating on the protected resource. When the first
            client resumes (after 35 seconds), it still believes it holds the
            lock (because it did not receive any notification that the lock
            expired), and it continues operating on the resource — concurrently
            with the second client. This causes data corruption, because the
            resource is being modified by two clients simultaneously.
          </p>
          <p className="mb-3">
            The prevention is <strong>fencing tokens</strong>. When the lock
            service grants a lock, it returns a monotonically increasing token
            (e.g., token 1 for the first client, token 2 for the second client).
            The client includes this token in every operation on the protected
            resource. The resource tracks the highest token it has seen (token
            2) and rejects operations with lower tokens (token 1). When the
            first client resumes and tries to operate on the resource with token
            1, the resource rejects the operation (because 1 &lt; 2), preventing
            the data corruption.
          </p>
          <p>
            An additional mitigation is to use a longer TTL (e.g., 60 seconds
            instead of 30 seconds) to reduce the probability of the lock
            expiring during a GC pause. However, this is not a complete solution
            — a GC pause could be arbitrarily long (minutes or even hours), and
            increasing the TTL indefinitely would cause other clients to wait
            too long for the lock if the holder crashes. The fencing token
            pattern is the only reliable solution, because it protects the
            resource regardless of the TTL duration.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Compare Redis Redlock with ZooKeeper sequential locks. When
          would you choose one over the other?
          </h3>
          <p className="mb-3">
            <strong>Redis Redlock</strong> acquires locks across N independent
            Redis instances (typically N = 5) using a majority quorum. It
            provides low latency (5–50 ms), tolerates instance failures (up to
            (N-1)/2 instances), and is simple to deploy (Redis is lightweight
            and easy to operate). However, it does not provide fair ordering
            (the fastest client wins the race, which can lead to starvation),
            and it is vulnerable to clock skew (the TTL depends on the
            client&apos;s clock, which may be different from the Redis
            instance&apos;s clock).
          </p>
          <p className="mb-3">
            <strong>ZooKeeper sequential locks</strong> use ephemeral sequential
            znodes to implement a fair, FIFO-ordered lock. They provide moderate
            latency (5–20 ms), fair ordering (clients acquire the lock in the
            order they requested it), automatic lock release on client
            disconnect (ephemeral znodes are deleted when the client&apos;s
            session ends), and no clock dependency (the lock release is triggered
            by the session ending, not by a TTL). However, they require a
            ZooKeeper ensemble (which is more complex to deploy and manage than
            a Redis instance), and they do not tolerate network partitions as
            gracefully as Redlock (if the ZooKeeper ensemble is partitioned, the
            minority partition cannot serve lock requests).
          </p>
          <p className="mb-3">
            Choose <strong>Redis Redlock</strong> when: low latency is the
            primary concern, fair ordering is not important, the application can
            tolerate occasional clock skew issues, and the team is already
            operating Redis infrastructure. Choose <strong>ZooKeeper sequential
            locks</strong> when: fair ordering is important (e.g., processing
            requests in FIFO order), automatic lock release on client disconnect
            is required (more reliable than TTL-based release), and the team is
            already operating ZooKeeper infrastructure (e.g., for Kafka or
            Hadoop).
          </p>
          <p>
            For most new systems, I would recommend <strong>etcd locks</strong>{" "}
            as a middle ground — they provide linearizable locks (strong
            consistency) with moderate latency (5–15 ms), fair ordering (based
            on revision numbers), lease-based auto-release, and are simpler to
            deploy than ZooKeeper (etcd is a single binary with no external
            dependencies). etcd is also the backing store for Kubernetes, so if
            the system is deployed on Kubernetes, etcd is already available.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How does the ZooKeeper sequential lock prevent the thundering
          herd problem? What happens when the lock is released?
          </h3>
          <p className="mb-3">
            The thundering herd problem occurs when many clients are waiting for
            a lock, and when the lock is released, all clients are notified
            simultaneously and compete to acquire the lock — only one succeeds,
            and the rest go back to waiting. This is inefficient because it
            generates a burst of traffic on the lock service, and most of the
            requests are wasted (only one client can acquire the lock).
          </p>
          <p className="mb-3">
            ZooKeeper sequential locks prevent the thundering herd by having
            each client watch only its <em>predecessor</em> (the znode with the
            next-lower sequence number), not the lock-holding znode. When the
            lock is released (the lock-holding znode is deleted), only the
            client watching that znode is notified. This client then checks
            whether it now has the lowest sequence number — if it does, it
            acquires the lock. If it does not (another client created a znode
            with a lower sequence number in the meantime), it watches its new
            predecessor and waits. Only one client is notified when the lock is
            released, so there is no thundering herd.
          </p>
          <p>
            This approach also ensures fair ordering — clients acquire the lock
            in the order they created their znodes (FIFO), and no client can
            jump ahead of others. In contrast, Redis locks are race-based — all
            clients try to acquire the lock simultaneously, and the fastest
            client wins, which can lead to starvation (a slow client may never
            win the race).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: Design a distributed lock service that supports hierarchical
          locks (locking a parent resource also locks all its children). What
          are the key design decisions?
          </h3>
          <p className="mb-3">
            Hierarchical locks are useful when resources are organized in a
            tree structure (e.g., a file system, where locking a directory
            should also lock all its files and subdirectories). The key design
            decision is how to represent the hierarchy in the lock service and
            how to enforce the parent-child locking relationship.
          </p>
          <p className="mb-3">
            The simplest approach is to use <strong>lock inheritance</strong>{" "}
            — when a client acquires a lock on a parent resource, the lock
            service implicitly creates locks on all child resources (recursively).
            When a client tries to acquire a lock on a child resource, the lock
            service checks whether the parent resource is locked — if it is, the
            child lock request is rejected (or queued until the parent lock is
            released). This approach is simple to implement but has a
            significant performance cost: locking a parent resource with many
            children requires creating many lock keys, and checking whether a
            child is locked requires traversing the parent chain.
          </p>
          <p className="mb-3">
            A more efficient approach is to use <strong>lock range queries</strong>{" "}
            — the lock service stores locks in a sorted data structure (e.g., a
            B-tree or a sorted list) keyed by the resource path. When a client
            tries to acquire a lock on a resource, the lock service queries the
            data structure for any locks that overlap with the resource&apos;s
            path (i.e., locks on the resource itself, its parents, or its
            children). If an overlapping lock is found, the request is rejected
            (or queued). If no overlapping lock is found, the lock is granted.
            This approach is more efficient — it requires only a range query on
            the sorted data structure, which is O(log N) — but it requires a
            more complex data structure and query logic.
          </p>
          <p>
            The key operational consideration is <strong>lock granularity</strong>{" "}
            — hierarchical locks can be very coarse (locking a parent resource
            locks all its children, which may be unnecessary) or very fine
            (locking only the specific resource, which may require many locks
            for a complex operation). The lock service should support both modes
            — the client can choose whether to acquire a hierarchical lock
            (parent + all children) or a specific lock (only the specific
            resource), depending on the operation&apos;s needs.
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Sanfilippo, S. (2016). &quot;Distlock with Redis (Redlock).&quot;
            Redis Documentation. — The original Redlock algorithm proposal
            and implementation guide.
          </li>
          <li>
            Kleppmann, M. (2016). &quot;How to Do Distributed Locking.&quot;
            Martin Kleppmann&apos;s Blog. — Critical analysis of Redlock and
            the fencing token pattern.
          </li>
          <li>
            Hunt, P., Konar, M., Junqueira, F.P., &amp; Reed, B. (2010).
            &quot;ZooKeeper: Wait-Free Coordination for Internet-Scale Systems.&quot;{" "}
            <em>USENIX ATC &apos;10</em>. — The ZooKeeper paper, including
            sequential locks and ephemeral znodes.
          </li>
          <li>
            Brewer, E. (2012). &quot;CAP Twelve Years Later: How the &apos;Rules&apos;
            Have Changed.&quot; <em>Computer, 45(2)</em>. — Contextualizes
            distributed locking within the CAP theorem framework.
          </li>
          <li>
            etcd Documentation. &quot;Concurrency: Locks and Leases.&quot;
            CoreOS. — Details etcd&apos;s lease-based distributed locking
            implementation with fencing support.
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
