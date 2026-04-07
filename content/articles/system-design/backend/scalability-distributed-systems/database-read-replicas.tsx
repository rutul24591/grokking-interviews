"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-read-replicas",
  title: "Database Read Replicas",
  description:
    "Staff-level deep dive into database read replicas covering replication lag, read routing strategies, lag-aware reads, failover with replica promotion, read-your-writes consistency, and production trade-offs for read-scaling architectures.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "database-read-replicas",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: [
    "read replicas",
    "replication lag",
    "read routing",
    "lag-aware reads",
    "failover",
    "replica promotion",
    "read-your-writes consistency",
    "read scaling",
    "semi-synchronous replication",
  ],
  relatedTopics: [
    "replication-strategies",
    "data-replication",
    "horizontal-scaling",
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
          <strong>Read replicas</strong> are copies of a primary database that
          asynchronously receive and apply the primary&apos;s write-ahead log
          (WAL), maintaining an eventually consistent copy of the primary&apos;s
          data. The primary database accepts all write operations (INSERT,
          UPDATE, DELETE), while read replicas serve read operations (SELECT),
          distributing the read load across multiple nodes. This architecture
          is the simplest and most widely deployed strategy for scaling read
          throughput — if a single database node can serve 10,000 reads per
          second, adding 3 read replicas increases the system&apos;s total read
          capacity to approximately 40,000 reads per second, assuming the
          primary&apos;s write load does not become a bottleneck.
        </p>
        <p>
          Read replicas are distinct from multi-primary replication (where
          multiple nodes accept writes) and from consensus-based replication
          (where a majority of nodes must agree on every write). Read replicas
          are strictly read-only — they apply the primary&apos;s WAL entries in
          the same order as the primary, ensuring that the replica&apos;s state
          is a deterministic replay of the primary&apos;s state. The replica is
          always behind the primary by some amount of time — the{" "}
          <em>replication lag</em> — which depends on the network latency
          between the primary and the replica, the replica&apos;s processing
          capacity, and the write volume on the primary.
        </p>
        <p>
          For staff and principal engineers, read replica architecture involves
          several non-trivial design decisions: how to route reads across
          replicas (round-robin, lag-aware, sticky session, read-your-writes),
          how to handle replication lag&apos;s impact on application correctness
          (stale reads), how to execute failover when the primary crashes
          (selecting the most up-to-date replica, promoting it, reconfiguring
          the remaining replicas), and how to prevent data loss during failover
          (semi-synchronous replication). These decisions determine the
          system&apos;s consistency guarantees, its availability during failures,
          and the operational complexity of managing the replica fleet.
        </p>
        <p>
          Read replicas are the first step in database scaling for most
          organizations. They are simpler to deploy and manage than sharding
          (which requires partitioning data across nodes) and provide immediate
          read scalability for read-heavy workloads. However, they do not scale
          writes — the primary remains the single point of write coordination,
          and its write throughput is bounded by its own CPU, memory, and disk
          I/O capacity. Once the primary&apos;s write capacity is exhausted,
          sharding or a fundamentally different architecture is required.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          <strong>Replication lag</strong> is the time between the primary
          applying a write and the replica applying the same write. It is caused
          by three factors: <em>network latency</em> — the time to transmit the
          WAL entry from the primary to the replica (typically 1–5 ms within a
          data center, 50–200 ms across data centers); <em>replica processing
          delay</em> — the time for the replica to apply the WAL entry to its
          own storage engine (typically sub-millisecond for simple writes, but
          can be seconds for bulk operations or complex transactions); and{" "}
          <em>replica load</em> — if the replica is serving read queries while
          also applying the WAL, the read load may compete with the replication
          thread for CPU and I/O, causing the replication thread to fall behind.
          Replication lag is monitored continuously — the primary tracks the
          lag of each replica (the difference between the primary&apos;s current
          WAL position and the replica&apos;s applied WAL position), and alerts
          are triggered when the lag exceeds a threshold (typically 1–5 seconds
          for user-facing applications).
        </p>

        <p>
          <strong>Read routing</strong> determines which replica serves each
          read query. The simplest strategy is <em>round-robin</em> — each
          successive read is routed to the next replica in the list. This
          distributes the read load evenly but ignores replication lag — a read
          may be routed to a replica that is significantly behind the primary,
          returning stale data. A more sophisticated strategy is{" "}
          <em>lag-aware routing</em> — the read proxy tracks each replica&apos;s
          current lag and routes reads to the least-lagged replica that meets
          the application&apos;s staleness threshold. If no replica meets the
          threshold, the read is routed to the primary (which always has the
          latest data). Lag-aware routing minimizes stale reads but adds the
          overhead of monitoring and comparing lag on every read.
        </p>

        <p>
          <strong>Read-your-writes consistency</strong> is a guarantee that a
          user who writes data will see their write in subsequent reads. Without
          this guarantee, a user may update their profile and then immediately
          navigate to their profile page, only to see the old profile data
          (because the read was served by a replica that has not yet received
          the write). The standard implementation tracks the user&apos;s last
          write timestamp (or the primary&apos;s WAL offset at the time of the
          write) in the user&apos;s session. When the user issues a subsequent
          read, the routing layer checks whether the candidate replica has
          caught up to at least the user&apos;s last write offset. If yes, the
          read goes to that replica. If no, the read goes to the primary. This
          ensures that users see their own writes immediately, without requiring
          all reads to go to the primary.
        </p>

        <p>
          <strong>Failover</strong> is the process of promoting a replica to the
          new primary when the current primary crashes. The failover process
          involves five steps: <strong>(1)</strong> Detect the primary failure
          (via heartbeat timeout, typically 5–30 seconds).{" "}
          <strong>(2)</strong> Select the most up-to-date replica (the replica
          with the highest WAL position — the smallest replication lag).{" "}
          <strong>(3)</strong> Promote the selected replica to primary (enable
          writes, update its role). <strong>(4)</strong> Reconfigure the
          remaining replicas to replicate from the new primary.{" "}
          <strong>(5)</strong> Update the client routing layer to direct writes
          to the new primary. The total failover time is typically 10–60
          seconds, during which the system cannot accept writes (though it can
          still serve reads from replicas).
        </p>

        <p>
          <strong>Semi-synchronous replication</strong> is a hybrid between
          fully asynchronous and fully synchronous replication. In
          semi-synchronous mode, the primary waits for at least one replica to
          acknowledge receipt of the WAL entry (not full application, just
          receipt) before acknowledging the write to the client. This ensures
          that every acknowledged write exists on at least two nodes (the
          primary and the semi-synchronous replica), preventing data loss during
          primary failover. The write latency impact is minimal — the primary
          waits for the replica&apos;s acknowledgment, which is a single network
          round-trip (1–5 ms within a data center), not the full replication
          application time. Most production systems use semi-synchronous
          replication with one replica as a balance between durability and
          latency.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-read-replicas-diagram-1.svg"
          alt="Primary-replica architecture showing writes flowing to primary, WAL streaming to replicas, and reads distributed across all replicas"
          caption="Primary-replica architecture — writes go to the primary, WAL streams to replicas asynchronously, reads are load-balanced across replicas"
        />

        <p>
          The write flow begins with the client sending a write to the primary.
          The primary applies the write, appends it to its WAL, and if
          semi-synchronous replication is enabled, waits for at least one
          replica to acknowledge receipt of the WAL entry. Once the
          acknowledgment is received (or immediately, in fully asynchronous
          mode), the primary acknowledges the write to the client. The primary
          then streams the WAL entry to all replicas in the background. Each
          replica receives the WAL entry, applies it to its own storage engine
          in the same order as the primary, and updates its applied WAL
          position. The replication thread on each replica runs continuously,
          consuming WAL entries from the primary&apos;s replication stream and
          applying them one by one.
        </p>

        <p>
          The read flow begins with the client sending a read query to the read
          proxy (or load balancer). The read proxy determines which replica
          should serve the read based on the configured routing strategy
          (round-robin, lag-aware, sticky session, or read-your-writes). The
          proxy forwards the read to the selected replica, which executes the
          query locally and returns the result. The total read latency is the
          network latency from the client to the replica plus the replica&apos;s
          query execution time. If the read is routed to the primary (e.g.,
          because no replica meets the read-your-writes consistency requirement),
          the latency is the network latency to the primary plus the primary&apos;s
          query execution time.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-read-replicas-diagram-2.svg"
          alt="Four read routing strategies: round-robin, lag-aware, sticky session, and read-your-writes consistency with decision flow"
          caption="Read routing strategies — from simple round-robin to sophisticated lag-aware and read-your-writes routing that minimize stale reads"
        />

        <p>
          Failover is triggered when the primary becomes unresponsive. The
          monitoring system detects the primary&apos;s failure (via heartbeat
          timeout) and initiates the failover process. The failover orchestrator
          queries each replica for its current WAL position and selects the
          replica with the highest position (the most up-to-date). This replica
          is promoted to the new primary — its read-only mode is disabled, it
          begins accepting writes, and the remaining replicas are reconfigured
          to replicate from it. The client routing layer is updated to direct
          writes to the new primary (via DNS update, proxy reconfiguration, or
          service discovery update). The total failover time is dominated by the
          heartbeat timeout (5–30 seconds) and the replica promotion time
          (typically 1–5 seconds).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-read-replicas-diagram-3.svg"
          alt="Failover process showing 5 steps from primary crash detection through replica promotion and reconfiguration of remaining replicas"
          caption="Failover process — the most up-to-date replica is promoted to primary, remaining replicas reconfigure to replicate from it"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          Read replicas must be compared against the alternatives. The simplest
          alternative is a single database node with no replicas — this provides
          strong consistency (no replication lag) but cannot scale reads beyond
          the single node&apos;s capacity. Adding read replicas increases read
          throughput linearly with the number of replicas but introduces
          replication lag (reads may return stale data) and failover complexity
          (the primary must be promoted from a replica if it crashes). Sharding
          scales both reads and writes by distributing data across nodes, but it
          introduces significantly more complexity (cross-shard queries,
          rebalancing, partition management). For most organizations, read
          replicas are the first scaling step — they are simpler to deploy and
          manage than sharding and provide immediate read scalability for
          read-heavy workloads.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Single Node</th>
              <th className="p-3 text-left">Read Replicas</th>
              <th className="p-3 text-left">Sharding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Read Scaling</strong>
              </td>
              <td className="p-3">No — bounded by single node</td>
              <td className="p-3">
                Yes — linear with replica count
              </td>
              <td className="p-3">
                Yes — linear with shard count
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Write Scaling</strong>
              </td>
              <td className="p-3">No</td>
              <td className="p-3">No — single primary</td>
              <td className="p-3">
                Yes — distributed across shards
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Read Consistency</strong>
              </td>
              <td className="p-3">Strong — always current</td>
              <td className="p-3">
                Eventual — replication lag
              </td>
              <td className="p-3">
                Strong within shard
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Operational Complexity</strong>
              </td>
              <td className="p-3">Low — single node</td>
              <td className="p-3">
                Medium — lag monitoring, failover
              </td>
              <td className="p-3">
                High — cross-shard, rebalancing
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-read-replicas-diagram-4.svg"
          alt="Replication lag timeline showing stale read scenarios and 5 mitigation strategies including read-your-writes consistency and lag-aware routing"
          caption="Replication lag causes stale reads — mitigation strategies trade off latency, consistency, and operational complexity"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Monitor replication lag per replica continuously and alert when it
          exceeds acceptable thresholds. Replication lag is the most important
          read-replica-specific metric — it measures the time between the
          primary applying a write and the replica applying it. It should be
          monitored per-replica (each replica may have different lag
          characteristics) and alerted on when it exceeds the application&apos;s
          tolerance for stale reads (typically 1 second for user-facing
          applications, 30 seconds for analytical queries). A growing
          replication lag indicates that the replica is falling behind — it may
          be overloaded (serving too many reads), the network may be congested,
          or the primary may be producing writes faster than the replica can
          consume them. The alert should trigger before the lag becomes
          critical, giving the on-call engineer time to investigate and
          remediate.
        </p>

        <p>
          Use lag-aware read routing for user-facing reads and round-robin for
          analytical reads. User-facing reads (profile pages, order history,
          dashboards) should be routed to the least-lagged replica that meets
          the application&apos;s staleness threshold, minimizing the probability
          of stale reads. Analytical reads (reports, aggregations, batch
          processing) can be routed round-robin across all replicas, as they
          typically tolerate stale data and benefit from even load distribution.
          The read proxy should track each replica&apos;s current lag (updated
          every 1–5 seconds via a lightweight heartbeat query) and use this
          information to make routing decisions.
        </p>

        <p>
          Implement read-your-writes consistency for user-facing applications.
          Track the user&apos;s last write offset in the session and route
          subsequent reads to a replica that has caught up to at least that
          offset. If no replica has caught up, route the read to the primary.
          This ensures that users see their own writes immediately without
          requiring all reads to go to the primary. The implementation is
          straightforward: when a write is acknowledged, the response includes
          the primary&apos;s current WAL offset. The client stores this offset
          in a cookie or session storage. On the next read, the client sends
          this offset as a header. The read proxy checks each replica&apos;s
          current replication offset and selects a replica that has caught up to
          at least the client&apos;s offset.
        </p>

        <p>
          Configure semi-synchronous replication with one replica to prevent
          data loss during failover. The primary waits for at least one replica
          to acknowledge receipt of the WAL entry before acknowledging the write
          to the client. This ensures that every acknowledged write exists on at
          least two nodes (the primary and the semi-synchronous replica),
          preventing data loss if the primary crashes. The write latency impact
          is minimal — the primary waits for the replica&apos;s acknowledgment
          (a single network round-trip, 1–5 ms within a data center), not the
          full replication application time. The remaining replicas can be fully
          asynchronous, providing read scalability without impacting write
          latency.
        </p>

        <p>
          Test failover procedures regularly (monthly or quarterly) in
          production-like environments. Failover is a complex, multi-step
          process (detecting the failure, selecting the new primary, promoting
          it, reconfiguring replicas, updating client routing) that is prone to
          failure if not tested. The failover test should verify that: the new
          primary is promoted correctly, all replicas are reconfigured to
          replicate from the new primary, client writes are routed to the new
          primary, no data is lost during the failover (all acknowledged writes
          are present on the new primary), and the total failover time is within
          the acceptable threshold (e.g., 30 seconds). Automated failover
          testing is more reliable than manual testing, as it eliminates human
          error and ensures consistent test execution.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Assuming that asynchronous replication provides durability guarantees
          is a critical error. In asynchronous replication, the primary
          acknowledges the write before replicating it to replicas. If the
          primary crashes immediately after acknowledging the write but before
          replicating it, the write is lost — it exists only on the crashed
          primary&apos;s disk, which is inaccessible. When a new primary is
          promoted from the replicas, it does not have the lost write, and the
          client&apos;s subsequent reads will not see it. This data loss
          scenario is often called &quot;the replication gap&quot; — the window
          between the write acknowledgment and the replication completion during
          which the write is vulnerable. The mitigation is semi-synchronous
          replication — the primary waits for at least one replica to
          acknowledge receipt of the WAL entry before acknowledging the write to
          the client, ensuring that every acknowledged write exists on at least
          two nodes.
        </p>

        <p>
          Ignoring the impact of replication lag on application correctness is
          a common source of subtle bugs. When an application reads from a
          replica that has not yet received the latest writes from the primary,
          the application may make incorrect decisions based on stale data. For
          example, a fraud detection system that reads from a replica may not
          see a recent suspicious transaction and may approve a subsequent
          transaction that should have been blocked. The solution is to route
          latency-sensitive or correctness-critical reads to the primary (or to
          a semi-synchronous replica), and only route non-critical reads to
          asynchronous replicas. The application should be designed with an
          explicit understanding of which reads require strong consistency and
          which can tolerate eventual consistency.
        </p>

        <p>
          Not handling replica promotion correctly during failover can cause
          split-brain scenarios where two nodes both believe they are the
          primary. If the old primary recovers after the failover and is not
          properly fenced (prevented from accepting writes), it may accept
          writes that conflict with the new primary&apos;s writes, creating data
          divergence. The mitigation is to use a fencing mechanism — the new
          primary acquires a distributed lock (via a consensus service like
          etcd or ZooKeeper) that prevents any other node from becoming the
          primary. When the old primary recovers, it attempts to acquire the
          lock, fails (because the new primary holds it), and transitions to
          replica mode. Without fencing, the old primary may accept writes
          independently, creating a split-brain scenario that is extremely
          difficult to resolve.
        </p>

        <p>
          Overloading the primary with reads defeats the purpose of read
          replicas. Some teams configure their applications to route all reads
          to the primary (to avoid stale reads), which means the primary serves
          both reads and writes. This increases the primary&apos;s load and
          reduces its write throughput, negating the benefit of the replicas.
          The correct approach is to route non-critical reads to replicas (using
          lag-aware or round-robin routing) and only route consistency-critical
          reads to the primary. The application should be designed to tolerate
          stale reads for non-critical operations (e.g., product catalog views,
          search results) and require strong consistency for critical operations
          (e.g., inventory checks, payment processing).
        </p>

        <p>
          Not planning for replica count changes can cause operational
          difficulties. Adding a replica requires a full data copy from the
          primary (or from an existing replica), which can take hours or days
          for large datasets. During the initial copy, the new replica is not
          serving reads, and the primary&apos;s replication stream must send the
          entire dataset to the new replica, which may impact the performance of
          existing replicas. The mitigation is to use a backup-based bootstrap —
          restore a recent backup on the new replica, and then start
          replication from the backup&apos;s WAL position. This reduces the
          initial copy time from hours to minutes (the backup restore time plus
          the WAL replay from the backup position to the current position).
        </p>
      </section>

      {/* Section 7: Real-world Use Cases */}
      <section>
        <h2>Real-world Use Cases</h2>

        <p>
          GitHub uses PostgreSQL read replicas for its core data, with the
          primary accepting all writes (push operations, issue creation, pull
          request updates) and replicas serving reads (repository browsing,
          issue viewing, code search). GitHub&apos;s replication lag is
          typically 1–5 seconds, and the application handles stale reads
          gracefully — if a user creates an issue and does not immediately see
          it in the issue list, the UI shows a &quot;loading&quot; state until
          the replica catches up. For critical operations (e.g., repository
          deletion), GitHub reads from the primary to ensure strong consistency.
          GitHub&apos;s failover process is automated — when the primary is
          detected as unhealthy, a replica is promoted within 30 seconds, and
          the client routing layer (HAProxy) is updated to direct writes to the
          new primary.
        </p>

        <p>
          Instagram uses MySQL read replicas for its social graph data, with
          hundreds of replicas serving read traffic (feed loads, profile views,
          follower/following lists). The primary handles all writes (post
          creation, follows, likes), and the replicas apply the primary&apos;s
          WAL entries asynchronously. Instagram&apos;s replicas are deployed
          across multiple data centers to serve reads from the data center
          closest to the user, reducing read latency for its globally
          distributed user base. The replication lag between data centers is
          typically 50–200 ms, and Instagram uses read-your-writes consistency
          to ensure that users see their own posts immediately after creating
          them.
        </p>

        <p>
          Shopify uses MySQL read replicas for its e-commerce platform, with the
          primary accepting writes (order creation, inventory updates, payment
          processing) and replicas serving reads (product catalog, order
          history, customer profiles). Shopify&apos;s replicas are deployed in
          multiple regions (US, EU, APAC) to serve reads from the region closest
          to the merchant, reducing read latency for its globally distributed
          merchant base. The replication lag between regions is typically 100–500
          ms, and Shopify uses lag-aware read routing to ensure that
          inventory-critical reads (checking stock availability) are served from
          the primary or the least-lagged replica, preventing overselling.
        </p>

        <p>
          Wikimedia (Wikipedia) uses MySQL read replicas to serve its massive
          read traffic — Wikipedia receives approximately 15 billion page views
          per month, and the read-to-write ratio is approximately 1000:1. The
          primary database handles all writes (page edits, user registrations,
          account changes), and approximately 30 read replicas serve the read
          traffic. Wikimedia&apos;s replicas are deployed in multiple data
          centers around the world, and reads are routed to the replica in the
          data center closest to the user. The replication lag between data
          centers is typically 1–5 seconds, and Wikimedia tolerates this lag for
          page views (reading a slightly stale version of a page is acceptable
          for an encyclopedia) but requires strong consistency for edits (an
          edit must be immediately visible to other editors to prevent edit
          conflicts).
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: A user updates their profile on a system with read replicas and
          immediately navigates to their profile page, but sees the old profile
          data. What is the root cause, and how do you fix it?
          </h3>
          <p className="mb-3">
            The root cause is <em>replication lag</em>. The user&apos;s write
            was applied to the primary, but the read was served by a replica
            that has not yet received the replicated write from the primary. The
            replica returns the old profile data, and the user sees stale data.
          </p>
          <p className="mb-3">
            The fix depends on the application&apos;s consistency requirements.
            If the user must see their own writes immediately (the common case
            for profile pages), implement <em>read-your-writes consistency</em>:
            track the user&apos;s last write offset (the primary&apos;s WAL
            position at the time of the write) in the user&apos;s session. When
            the user navigates to their profile page, the read proxy checks
            whether the candidate replica has caught up to at least the
            user&apos;s last write offset. If yes, the read goes to that
            replica. If no, the read goes to the primary, which always has the
            latest data.
          </p>
          <p className="mb-3">
            An alternative approach is <em>optimistic UI</em>: the application
            shows the updated profile data immediately (using the data from the
            write response), without waiting for the read to return. The read
            from the replica runs in the background, and if it returns different
            data, the UI is updated to match. This approach provides the best
            user experience (the user sees their changes immediately) but
            requires the application to handle the case where the replica&apos;s
            data differs from the optimistic update (e.g., if the write failed
            on the primary but the optimistic update was already shown).
          </p>
          <p>
            The simplest approach — routing all reads to the primary — ensures
            strong consistency but defeats the purpose of read replicas (the
            primary becomes the bottleneck for both reads and writes). This
            should be avoided unless the write volume is low enough that the
            primary can handle both reads and writes without performance
            degradation.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Describe the failover process when the primary crashes. How do
          you select the new primary, and what data loss is possible?
          </h3>
          <p className="mb-3">
            The failover process involves five steps. <strong>Step 1:</strong>{" "}
            Detect the primary failure via heartbeat timeout (the monitoring
            system sends periodic heartbeats to the primary, and if no response
            is received within the timeout period, the primary is considered
            failed). <strong>Step 2:</strong> Query each replica for its current
            WAL position (the position in the primary&apos;s WAL up to which the
            replica has applied writes). <strong>Step 3:</strong> Select the
            replica with the highest WAL position as the new primary (this is
            the most up-to-date replica, minimizing data loss).{" "}
            <strong>Step 4:</strong> Promote the selected replica to primary
            (enable writes, update its role, and acquire a fencing lock to
            prevent the old primary from accepting writes if it recovers).{" "}
            <strong>Step 5:</strong> Reconfigure the remaining replicas to
            replicate from the new primary, and update the client routing layer
            to direct writes to the new primary.
          </p>
          <p className="mb-3">
            The possible data loss is the set of writes that were acknowledged
            by the primary but not yet replicated to the new primary at the time
            of the primary&apos;s crash. If the primary used fully asynchronous
            replication, this could be several seconds of writes (the
            replication lag window). If the primary used semi-synchronous
            replication with one replica, the data loss is zero for writes that
            were acknowledged (because the semi-synchronous replica had already
            received them). However, writes that were in-flight at the time of
            the crash (sent to the primary but not yet acknowledged) may or may
            not be lost, depending on whether the primary persisted them before
            crashing.
          </p>
          <p className="mb-3">
            The critical design decision is the fencing mechanism. After the
            failover, the old primary (if it recovers) must not accept writes —
            it must transition to replica mode and replicate from the new
            primary. Without fencing, the old primary may accept writes
            independently, creating a split-brain scenario where two primaries
            accept conflicting writes. The fencing lock (acquired via a
            consensus service like etcd or ZooKeeper) ensures that only one node
            can be the primary at any time.
          </p>
          <p>
            The key operational practice is to test failover regularly — the
            failover process is complex and error-prone, and it is critical that
            it works correctly when needed. Automated failover testing (using
            tools like Chaos Monkey or custom failover scripts) ensures that the
            process is tested consistently and that the failover time is within
            the acceptable threshold.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: When would you choose read replicas over sharding, and when
          would you choose sharding over read replicas?
          </h3>
          <p className="mb-3">
            Read replicas and sharding serve different scaling needs, and the
            choice depends on the workload characteristics.{" "}
            <strong>Read replicas</strong> scale read throughput by distributing
            reads across multiple copies of the entire dataset. They do not
            scale writes — the primary remains the single point of write
            coordination, and its write throughput is bounded by its own
            capacity. <strong>Sharding</strong> scales both reads and writes by
            distributing data across nodes, each of which handles a disjoint
            subset of the dataset.
          </p>
          <p className="mb-3">
            Choose <strong>read replicas</strong> when the workload is
            read-heavy (the read-to-write ratio exceeds 10:1), the dataset fits
            on a single server, and the primary&apos;s write throughput is
            sufficient for the write load. Read replicas are simpler to deploy
            and manage than sharding — they require no partition key design, no
            cross-partition query handling, and no rebalancing. They are the
            first scaling step for most organizations, providing immediate read
            scalability with minimal architectural change.
          </p>
          <p className="mb-3">
            Choose <strong>sharding</strong> when the primary&apos;s write
            throughput is approaching its capacity limit, or when the dataset
            exceeds the storage capacity of a single server. Sharding is
            necessary when the write load cannot be sustained by a single
            server, regardless of how many read replicas are added. Sharding is
            also necessary when the dataset is too large for a single server&apos;s
            storage (e.g., a multi-terabyte dataset that exceeds the largest
            available server&apos;s disk capacity).
          </p>
          <p>
            The recommended progression is: start with a single database node,
            add read replicas when read throughput becomes a bottleneck, and
            shard when write throughput or dataset size becomes a bottleneck.
            This progression minimizes architectural complexity at each stage —
            read replicas add moderate complexity (lag monitoring, failover),
            and sharding adds significant complexity (cross-shard queries,
            rebalancing). By adopting sharding only when necessary, you avoid
            the complexity cost until it is justified by the scaling need.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: A read replica is falling behind the primary (replication lag
          growing at 100 entries per second). What are the possible root causes,
          and how do you remediate each?
          </h3>
          <p className="mb-3">
            There are three common root causes for growing replication lag.{" "}
            <strong>Cause 1: Replica overload.</strong> The replica is serving
            too many read queries, and the read load is competing with the
            replication thread for CPU and I/O. The replication thread cannot
            keep up with the primary&apos;s write rate because it is starved of
            resources. <strong>Remediation:</strong> Add more replicas to
            distribute the read load, or route some reads to other replicas to
            reduce the load on the lagging replica. If the replica&apos;s disk
            I/O is the bottleneck (the replication thread is waiting for disk
            writes), upgrade the replica to faster storage (SSD or NVMe).
          </p>
          <p className="mb-3">
            <strong>Cause 2: Network congestion.</strong> The network between
            the primary and the replica is congested, and the primary&apos;s WAL
            stream is being throttled. The replication thread on the replica is
            idle (waiting for WAL entries from the primary), but the entries are
            not arriving fast enough. <strong>Remediation:</strong> Increase the
            network bandwidth between the primary and the replica (e.g., upgrade
            from 1 Gbps to 10 Gbps), or move the replica closer to the primary
            (same data center or same availability zone) to reduce network
            latency and congestion.
          </p>
          <p className="mb-3">
            <strong>Cause 3: Large transactions on the primary.</strong> The
            primary is executing large transactions (bulk inserts, large
            updates, schema migrations) that generate a large volume of WAL
            entries. The replica must apply these entries one by one, which can
            take significantly longer than the primary took to execute the
            transaction (because the primary executes the transaction
            in-memory, while the replica applies it to disk).{" "}
            <strong>Remediation:</strong> Break large transactions into smaller
            batches (e.g., insert 10,000 rows at a time instead of 1,000,000
            rows). For schema migrations, use an online migration tool (such as
            gh-ost or pt-online-schema-change) that applies the migration
            incrementally, rather than a single large DDL statement.
          </p>
          <p>
            The diagnostic process is: first, check the replica&apos;s CPU and
            I/O utilization (if high, Cause 1; if low, Cause 2 or 3). Second,
            check the network throughput between the primary and the replica (if
            saturated, Cause 2; if not, Cause 3). Third, check the primary&apos;s
            recent transaction log for large transactions (if present, Cause 3;
            if not, Cause 1 or 2). Once the root cause is identified, apply the
            corresponding remediation.
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Kleppmann, M. (2017). &quot;Designing Data-Intensive
            Applications.&quot; O&apos;Reilly Media. — Chapter 5 covers
            replication, including leader-based replication (read replicas) and
            replication lag management.
          </li>
          <li>
            MySQL Documentation. &quot;Replication.&quot; Oracle. —
            Comprehensive guide to MySQL&apos;s replication architecture,
            including semi-synchronous replication and failover.
          </li>
          <li>
            PostgreSQL Documentation. &quot;Streaming Replication.&quot; The
            PostgreSQL Global Development Group. — Details PostgreSQL&apos;s
            WAL-based streaming replication and replica promotion.
          </li>
          <li>
            GitHub Engineering Blog (2012). &quot;MySQL Read Replica
            Failover.&quot; — GitHub&apos;s approach to automated replica
            promotion and failover testing.
          </li>
          <li>
            Vogels, W. (2009). &quot;Eventually Consistent.&quot;{" "}
            <em>Communications of the ACM, 52(1)</em>. — Explains eventual
            consistency in replicated systems and strategies for managing stale
            reads.
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
