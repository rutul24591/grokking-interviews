"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-global-distribution",
  title: "Global Distribution",
  description:
    "Staff-level deep dive into globally distributed databases: replication topologies, consistency trade-offs, cross-region latency, conflict resolution, and production-scale architecture patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "global-distribution",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "global-distribution", "multi-region", "consistency", "replication", "latency"],
  relatedTopics: ["geo-sharding", "conflict-free-replicated-data-types", "consistency-models", "multi-region-deployment"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Global distribution</strong> refers to the architecture of a database system that
          spans multiple geographic regions, providing low-latency access to users worldwide while
          maintaining data consistency across regions. A globally distributed database replicates
          data across regions so that users in any region can read and write data with single-digit
          millisecond latency, regardless of where the data originated. This is fundamentally
          different from geo-sharding: geo-sharding partitions data by region (each region stores
          only its own data), while global distribution replicates all data to all regions (each
          region stores a complete copy).
        </p>
        <p>
          Consider a globally distributed social media platform. A user in Tokyo posts a photo.
          Their friend in London should see the photo within milliseconds, not seconds. Without
          global distribution, the London user&apos;s read request must travel to the Tokyo region
          (180ms RTT), fetch the photo, and return it — resulting in a 200ms+ page load. With
          global distribution, the photo is replicated to the London region&apos;s database within
          seconds of being posted, so the London user&apos;s read request is served locally with
          5ms latency.
        </p>
        <p>
          For staff/principal engineers, global distribution requires balancing three competing
          concerns. <strong>Latency</strong> means every region must serve reads locally with
          minimal cross-region coordination. <strong>Consistency</strong> means all regions must
          eventually converge to the same state, and the system must define what &quot;consistent&quot;
          means (strong, eventual, causal). <strong>Cost</strong> means cross-region replication
          consumes network bandwidth, storage, and compute — the cost grows with the number of
          regions and the volume of writes.
        </p>
        <p>
          The business impact of global distribution decisions is significant. Correct global
          distribution reduces read latency by 80-95% for non-local users, improves user
          engagement (every 100ms of latency reduction increases conversion by 1-2%), and
          provides natural disaster recovery (if one region fails, other regions continue
          serving reads). Incorrect global distribution causes cross-region latency spikes,
          data inconsistency (users see different data in different regions), and runaway
          replication costs.
        </p>
        <p>
          In system design interviews, global distribution demonstrates understanding of
          distributed system fundamentals (CAP theorem, replication topologies, consistency
          models), network latency realities (RTT between regions), and the trade-offs between
          strong consistency and availability at global scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/global-distribution-topologies.svg`}
          alt="Replication topologies comparison: star (hub-spoke), ring (circular), mesh (all-to-all), and tree (hierarchical) topologies with latency and consistency trade-offs for each"
          caption="Replication topologies — star (hub-spoke, simple but hub is bottleneck), ring (circular, balanced but high replication lag), mesh (all-to-all, fastest convergence but highest bandwidth), tree (hierarchical, balances bandwidth and convergence)"
        />

        <h3>Replication Topologies</h3>
        <p>
          The replication topology determines how data flows between regions. In a
          <strong>star topology</strong> (hub-and-spoke), all writes go to a central hub region,
          which replicates to spoke regions. This is simple to implement and ensures a single
          source of truth, but the hub is a bottleneck and a single point of failure. Spoke
          regions serve reads locally but cannot accept writes directly.
        </p>
        <p>
          In a <strong>mesh topology</strong> (all-to-all), every region replicates directly to
          every other region. This provides the fastest convergence (changes propagate in one hop)
          and eliminates single points of failure, but consumes O(N²) replication bandwidth for N
          regions. In a <strong>ring topology</strong>, each region replicates to its next neighbor
          in the ring. This balances bandwidth (O(N) replication links) with convergence speed
          (changes take N-1 hops to reach all regions). In a <strong>tree topology</strong>,
          regions are organized hierarchically: leaf regions replicate to their parent, which
          replicates to the root, which distributes back down. This balances bandwidth efficiency
          with convergence speed.
        </p>

        <h3>Consistency Models for Global Distribution</h3>
        <p>
          Global distribution requires choosing a consistency model that balances latency with
          data correctness. <strong>Strong consistency</strong> means every read returns the most
          recent write across all regions. This requires synchronous replication (the write is not
          acknowledged until all regions have committed it), which adds cross-region latency
          (80-220ms RTT per write). <strong>Eventual consistency</strong> means writes are
          acknowledged locally and replicated asynchronously to other regions. Reads return the
          local region&apos;s copy, which may be stale. Writes have low latency (local only), but
          reads may return stale data for the duration of the replication lag (1-5 seconds).
        </p>
        <p>
          <strong>Causal consistency</strong> sits between strong and eventual consistency. It
          guarantees that causally related writes are seen in the correct order by all regions,
          but concurrent (causally unrelated) writes may be seen in different orders by different
          regions. This is the strongest consistency model that does not sacrifice availability
          during network partitions.
        </p>

        <h3>Cross-Region Latency Realities</h3>
        <p>
          The speed of light imposes a fundamental limit on cross-region communication. The RTT
          between US East and EU West is approximately 80ms, between US East and APAC is
          approximately 180ms, and between EU and APAC is approximately 220ms. These latencies
          are physical limits — no amount of engineering can reduce them. This means that a
          synchronous write to three regions (US, EU, APAC) with strong consistency will take
          at least 180ms (the RTT to the farthest region), plus processing time.
        </p>
        <p>
          For write-heavy workloads, this latency is often unacceptable. The solution is to
          accept eventual consistency for writes (acknowledge locally, replicate asynchronously)
          and use strong consistency only for reads that require it (read-your-writes, monotonic
          reads). For read-heavy workloads, local reads with eventual consistency provide the
          best user experience.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/global-consistency-tradeoffs.svg`}
          alt="CAP theorem applied globally: strong consistency (high write latency, always correct), eventual consistency (low write latency, temporarily stale), causal consistency (middle ground, causally ordered)"
          caption="Consistency trade-offs in global distribution — strong consistency requires synchronous cross-region writes (high latency, always correct), eventual consistency accepts local writes with async replication (low latency, temporarily stale), causal consistency preserves causal ordering without sacrificing availability"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Write Path in a Globally Distributed Database</h3>
        <p>
          In an eventually consistent globally distributed database, the write path is optimized
          for low latency. The client writes to its local region&apos;s database. The database
          acknowledges the write immediately (local latency, 1-5ms). Asynchronously, the write is
          replicated to all other regions through the replication topology. Each receiving region
          applies the write to its local copy. The replication lag (time between the local
          acknowledgment and the remote application) is typically 1-5 seconds, depending on
          network conditions and write volume.
        </p>
        <p>
          Conflict resolution is needed when two regions concurrently write to the same record.
          Common strategies include last-write-wins (highest timestamp wins), vector clocks
          (detect conflicts and prompt application-level resolution), and CRDTs (automatically
          merge concurrent writes). The choice depends on the application&apos;s tolerance for
          data loss and the complexity of conflict resolution logic.
        </p>

        <h3>Read Path and Staleness Management</h3>
        <p>
          The read path in a globally distributed database serves reads from the local region&apos;s
          copy, providing low latency (1-5ms). However, this means reads may return stale data
          (data that has been updated in another region but not yet replicated locally). The
          staleness window is bounded by the replication lag (typically 1-5 seconds).
        </p>
        <p>
          Applications manage staleness through <strong>read-your-writes
          consistency</strong>: after a user writes to their local region, subsequent reads from
          the same user are routed to the same region until replication has caught up. This ensures
          that users always see their own writes immediately, even if other users in other regions
          see stale data. <strong>Monotonic reads</strong> ensures that a user&apos;s reads never
          go backward in time: once a user reads version V of a record, subsequent reads return
          version V or later. This is achieved by pinning the user to the same region for the
          duration of their session.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cross-region-latency.svg`}
          alt="Cross-region RTT measurements showing real-world latency: US-EU ~80ms, US-APAC ~180ms, EU-APAC ~220ms, with impact on synchronous vs asynchronous replication"
          caption="Cross-region latency realities — US to EU ~80ms RTT, US to APAC ~180ms, EU to APAC ~220ms; synchronous writes take at least the RTT to the farthest region, making async replication the practical choice for global write scalability"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Global distribution involves trade-offs between consistency, latency, and cost. Strong
          consistency across regions provides the simplest programming model (every read is correct)
          but incurs high write latency (180ms+ for global writes). Eventual consistency provides
          low write latency (1-5ms local) but requires the application to handle stale reads and
          write conflicts. The right choice depends on the workload: read-heavy workloads benefit
          from eventual consistency with local reads, while write-heavy workloads with strict
          consistency requirements may need to accept higher write latency.
        </p>
        <p>
          The replication topology choice also involves trade-offs. Star topology is simplest to
          implement but has a single point of failure and a write bottleneck at the hub. Mesh
          topology provides the fastest convergence but consumes O(N²) bandwidth. Ring topology
          balances bandwidth with convergence speed but has high replication lag for distant
          regions. Tree topology provides a good balance for large numbers of regions but is
          complex to implement and maintain.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use eventual consistency for writes and strong consistency for reads that require it.
          Acknowledge writes locally and replicate asynchronously to other regions. This provides
          low write latency (1-5ms) while ensuring that all regions eventually converge. For reads
          that require strong consistency (financial transactions, inventory counts), use
          synchronous cross-region reads or quorum reads (read from a majority of regions and
          return the most recent value).
        </p>
        <p>
          Implement read-your-writes consistency for user-facing applications. After a user
          writes, route their subsequent reads to the same region until replication has caught up.
          This ensures that users always see their own writes immediately, even if other users in
          other regions see stale data. This is typically implemented using session affinity
          (pin the user to their home region for the duration of their session).
        </p>
        <p>
          Monitor replication lag continuously and alert when it exceeds acceptable thresholds.
          Replication lag is the time between a write being acknowledged in the source region and
          being applied in the destination region. High replication lag indicates network
          congestion, destination region overload, or replication topology bottlenecks. Set alerts
          on per-region lag and on the maximum lag across all regions.
        </p>
        <p>
          Design conflict resolution for the common case. If concurrent writes to the same record
          are rare, last-write-wins (highest timestamp) is simple and effective. If concurrent
          writes are common, use CRDTs or application-level merge logic to resolve conflicts
          without data loss. Test conflict resolution under concurrent write scenarios to ensure
          it handles real-world contention patterns correctly.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is assuming that synchronous replication across regions is
          feasible for write-heavy workloads. With 180ms RTT to APAC, every write takes at least
          180ms. For an application that processes 1,000 writes per second, this limits throughput
          to approximately 5 writes per second per connection — far below the required throughput.
          The fix is to use asynchronous replication for writes and accept eventual consistency
          with conflict resolution.
        </p>
        <p>
          Another common pitfall is not accounting for replication lag in application logic. If an
          application reads data immediately after writing to it, and the read is routed to a
          different region, the read may return stale data. The fix is to implement read-your-writes
          consistency: route reads to the same region as the write until replication has caught up,
          or use session-based region pinning.
        </p>
        <p>
          Not planning for replication topology failures is a critical pitfall. If a replication
          link between two regions fails (network partition), those regions will diverge until the
          link is restored. During the partition, writes in each region are accepted locally, and
          when the link is restored, conflicts must be resolved. The fix is to monitor replication
          link health, implement automatic failover for replication links, and design conflict
          resolution for the partition-recovery scenario.
        </p>
        <p>
          Ignoring the cost of global replication is a financial pitfall. Replicating all data to
          all regions consumes network bandwidth (cross-region data transfer costs), storage (N
          copies of all data for N regions), and compute (replication processing). For a database
          with 10TB of data and 5 regions, storage cost is 50TB (5 × 10TB) plus replication
          bandwidth. The fix is to selectively replicate only the data that needs global access,
          and use geo-sharding for region-specific data.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Google Spanner: Globally Distributed Strongly Consistent Database</h3>
        <p>
          Google Spanner is a globally distributed database that provides external strong
          consistency (linearizability) across regions using TrueTime (atomic clocks + GPS
          receivers) to bound clock uncertainty. Spanner uses synchronous replication within
          regions (for strong consistency) and asynchronous replication across regions (for
          cross-region reads). This hybrid approach provides strong consistency for local reads
          and writes while accepting eventual consistency for cross-region reads. Spanner powers
          Google&apos;s ad serving, Google Play, and Google Photos — workloads that require global
          scale with strong consistency guarantees.
        </p>

        <h3>CockroachDB: Geo-Partitioned Global Distribution</h3>
        <p>
          CockroachDB provides global distribution with configurable consistency per transaction.
          Writes are acknowledged locally and replicated asynchronously to other regions. Reads
          can be configured for strong consistency (read from the leaseholder region), eventual
          consistency (read from the local region), or follower reads (read from any follower
          replica). CockroachDB also supports geo-partitioning: specific rows can be pinned to
          specific regions for compliance (e.g., EU user data pinned to EU regions), combining
          global distribution with geo-sharding for compliance-sensitive data.
        </p>

        <h3>DynamoDB Global Tables: Multi-Master Replication</h3>
        <p>
          DynamoDB Global Tables implement active-active multi-master replication: writes are
          accepted in any region and replicated to all other regions with eventual consistency.
          Conflict resolution uses last-write-wins based on the writer&apos;s timestamp. DynamoDB
          Global Tables are used by global e-commerce platforms, gaming companies, and IoT
          platforms that need low-latency reads and writes in multiple regions with automatic
          conflict resolution. The replication lag is typically under 1 second, and the system
          automatically handles region failover and recovery.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between geo-sharding and global distribution?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Geo-sharding partitions data by region: each region stores only its own data. Global
              distribution replicates all data to all regions: every region stores a complete copy.
              Geo-sharding uses less storage and satisfies data residency laws naturally, but
              requires complex cross-region queries. Global replication allows any region to answer
              any query but uses more storage and may violate data residency laws.
            </p>
            <p>
              Use geo-sharding for compliance-sensitive data and global distribution for public
              data that needs low-latency access everywhere.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Why can&apos;t you use strong consistency for writes across all regions?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Strong consistency requires synchronous replication: the write is not acknowledged
              until all regions have committed it. With 180ms RTT to APAC, every write takes at
              least 180ms. For write-heavy workloads (1,000+ writes per second), this limits
              throughput to approximately 5 writes per second per connection — far below the
              required throughput.
            </p>
            <p>
              The fix is to use eventual consistency for writes (acknowledge locally, replicate
              asynchronously) and accept temporary staleness. The replication lag is typically
              1-5 seconds, which is acceptable for most workloads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle write conflicts in a multi-master globally distributed database?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Write conflicts occur when two regions concurrently write to the same record.
              Resolution strategies: Last-write-wins (highest timestamp wins) — simple but may
              lose data. Vector clocks (detect conflicts and prompt application-level resolution)
              — more complex but no data loss. CRDTs (automatically merge concurrent writes) —
              strongest guarantee but requires data types to be CRDT-compatible.
            </p>
            <p>
              Choose based on conflict frequency and data loss tolerance. For rare conflicts,
              last-write-wins is sufficient. For frequent conflicts, use CRDTs or application-level
              merge logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you ensure a user always sees their own writes in an eventually consistent system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Implement read-your-writes consistency: after a user writes to their local region,
              route their subsequent reads to the same region until replication has caught up. This
              ensures that the user always sees their own writes immediately, even if other users
              in other regions see stale data.
            </p>
            <p>
              This is typically implemented using session affinity: the user&apos;s session is
              pinned to their home region for the duration of their session. Alternatively, use a
              read-after-write token: the write returns a token that the client includes in
              subsequent reads, and the read is routed to the region that holds the latest write.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How does replication topology affect global distribution performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Star topology: simple, single source of truth, but hub is bottleneck and single
              point of failure. Mesh topology: fastest convergence (one hop), no single point of
              failure, but O(N²) bandwidth for N regions. Ring topology: balanced bandwidth
              (O(N)), but high replication lag for distant regions (N-1 hops). Tree topology:
              balances bandwidth with convergence, but complex to implement.
            </p>
            <p>
              Choose based on region count and write volume. For 3-5 regions, mesh topology
              provides the best convergence. For 10+ regions, tree topology balances bandwidth
              efficiency with acceptable convergence speed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you handle a regional network partition in a globally distributed database?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              During a network partition, the isolated region cannot replicate to or receive
              replication from other regions. Writes in the isolated region are accepted locally
              (eventual consistency), and writes in other regions continue normally. When the
              partition heals, replication resumes and conflicts are resolved using the configured
              conflict resolution strategy (last-write-wins, CRDTs, or application-level merge).
            </p>
            <p>
              Monitor partition detection time and conflict resolution success rate. If the
              partition lasts longer than the conflict resolution window (e.g., TTL-based conflicts
              expire), some data may be permanently lost. Implement alerts on replication link
              failures and automatic failover for critical replication links.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cloud.google.com/spanner/docs/true-time-external-consistency"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Spanner: TrueTime and External Consistency
            </a>{" "}
            — How Spanner achieves strong consistency globally using atomic clocks.
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DynamoDB Global Tables
            </a>{" "}
            — Multi-master active-active replication for global low-latency access.
          </li>
          <li>
            <a
              href="https://www.cockroachlabs.com/docs/stable/multiregion-overview.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CockroachDB: Multi-Region Capabilities
            </a>{" "}
            — Geo-partitioning, follower reads, and configurable consistency.
          </li>
          <li>
            <a
              href="https://www.microsoft.com/en-us/research/publication/lamport-clocks/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lamport Clocks: Logical Clocks in Distributed Systems
            </a>{" "}
            — Foundation for causal ordering in distributed systems.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 5
            (Replication) and Chapter 9 (Consistency and Consensus).
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog: Global Data Distribution
            </a>{" "}
            — How Netflix manages data across global regions.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
