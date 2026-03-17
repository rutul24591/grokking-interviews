"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-high-availability-extensive",
  title: "High Availability",
  description: "Comprehensive guide to backend high availability, covering redundancy, failover strategies, replication patterns, RTO/RPO, and production reliability for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "high-availability",
  version: "extensive",
  wordCount: 11500,
  readingTime: 46,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "high-availability", "failover", "replication", "redundancy", "reliability"],
  relatedTopics: ["fault-tolerance", "disaster-recovery", "scalability-strategy", "consistency-model"],
};

export default function HighAvailabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>High Availability (HA)</strong> is the ability of a system to remain operational and accessible
          for a high percentage of time, typically measured as a percentage (availability SLA). It is achieved
          through redundancy, failover mechanisms, and eliminating single points of failure.
        </p>
        <p>
          Availability is expressed as a percentage of uptime over a given period (usually one year):
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            Availability = (Uptime) / (Uptime + Downtime) × 100%
          </p>
        </div>
        <p>
          The industry standard uses &quot;nines&quot; to describe availability targets:
        </p>
        <ul>
          <li>
            <strong>99% (Two Nines):</strong> ~3.65 days of downtime per year. Acceptable for internal tools,
            development environments, and non-critical services.
          </li>
          <li>
            <strong>99.9% (Three Nines):</strong> ~8.76 hours of downtime per year. Standard for production
            web applications and APIs.
          </li>
          <li>
            <strong>99.99% (Four Nines):</strong> ~52.6 minutes of downtime per year. Required for
            business-critical systems (e-commerce, SaaS platforms).
          </li>
          <li>
            <strong>99.999% (Five Nines):</strong> ~5.26 minutes of downtime per year. Reserved for
            telecom, emergency services, and financial trading systems.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Availability vs Reliability</h3>
          <p>
            <strong>Availability</strong> measures whether the system is up and responding.
            <strong>Reliability</strong> measures whether the system performs correctly without failures.
            A system can be available but unreliable (responding with errors), or reliable but unavailable
            (correct when running, but frequently down).
          </p>
          <p className="mt-3">
            In interviews, clarify whether the requirement is availability (uptime) or reliability (correctness).
            The design strategies differ.
          </p>
        </div>

        <p>
          High availability is not accidental — it requires deliberate architectural choices at every layer:
          network, compute, storage, and application. Each layer must eliminate single points of failure and
          provide mechanisms for automatic or manual failover.
        </p>
      </section>

      <section>
        <h2>Redundancy Patterns</h2>
        <p>
          Redundancy is the foundation of high availability. By having multiple copies of critical components,
          the system can tolerate failures without service interruption.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Passive (Standby) Redundancy</h3>
        <p>
          In <strong>active-passive</strong> configuration, one component (the primary) handles all traffic
          while another (the standby) remains idle, ready to take over if the primary fails.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Primary processes all requests and maintains state.
          </li>
          <li>
            Standby continuously synchronizes state from primary (synchronously or asynchronously).
          </li>
          <li>
            Health monitor checks primary health (heartbeat, health checks).
          </li>
          <li>
            On failure detection, standby is promoted to primary and begins handling traffic.
          </li>
        </ol>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>
            Databases with strong consistency requirements (MySQL master-slave, PostgreSQL streaming replication).
          </li>
          <li>
            Stateful services where only one instance can write at a time.
          </li>
          <li>
            Systems where simplicity is preferred over resource utilization.
          </li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>
            ✓ Simple to implement and reason about.
          </li>
          <li>
            ✓ No split-brain risk (only one active node).
          </li>
          <li>
            ✗ Wasted capacity — standby sits idle.
          </li>
          <li>
            ✗ Failover downtime — detection + promotion takes time (seconds to minutes).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Active Redundancy</h3>
        <p>
          In <strong>active-active</strong> configuration, all components handle traffic simultaneously.
          A load balancer distributes requests across multiple active nodes.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Load balancer distributes incoming requests across N active nodes.
          </li>
          <li>
            All nodes process requests and synchronize state (if stateful).
          </li>
          <li>
            Health monitor checks all nodes continuously.
          </li>
          <li>
            On node failure, load balancer stops sending traffic to that node.
          </li>
          <li>
            Remaining nodes absorb the load automatically.
          </li>
        </ol>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>
            Stateless services (web servers, API gateways, microservices).
          </li>
          <li>
            Distributed caches (Redis Cluster, Memcached).
          </li>
          <li>
            Read-heavy databases with read replicas.
          </li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>
            ✓ Full capacity utilization — all nodes contribute.
          </li>
          <li>
            ✓ Instant failover — no promotion delay.
          </li>
          <li>
            ✗ Split-brain risk — requires careful state management.
          </li>
          <li>
            ✗ Complex consistency — concurrent writes can conflict.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/backend-nfr/high-availability-architecture.svg"
          alt="High Availability Architectures"
          caption="High Availability Architectures — comparing Active-Passive (failover) and Active-Active (load balanced) patterns with availability calculation"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">N+1, N+2, 2N Redundancy</h3>
        <p>
          Redundancy is often described in terms of spare capacity:
        </p>
        <ul>
          <li>
            <strong>N+1:</strong> One spare component for N active components. If you need 4 servers to handle
            load, deploy 5. Can tolerate one failure.
          </li>
          <li>
            <strong>N+2:</strong> Two spare components. Can tolerate two simultaneous failures.
          </li>
          <li>
            <strong>2N:</strong> Full duplication — two complete systems. Can tolerate complete failure of
            one system. Most expensive, highest availability.
          </li>
          <li>
            <strong>2N+1:</strong> Two complete systems plus one spare. Maximum redundancy for critical systems.
          </li>
        </ul>
        <p>
          <strong>Interview framework:</strong> Start with N+1 for cost-effective availability. Move to 2N for
          business-critical systems or when geographic redundancy is required.
        </p>
      </section>

      <section>
        <h2>Replication Strategies</h2>
        <p>
          Replication is the mechanism of copying data from one node to another. It is essential for both
          availability (failover) and scalability (read distribution).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Synchronous Replication</h3>
        <p>
          In <strong>synchronous replication</strong>, the primary waits for the replica to acknowledge receipt
          before confirming the write to the client.
        </p>
        <p>
          <strong>Flow:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Client sends write request to primary.</li>
          <li>Primary writes to local storage AND sends to replica.</li>
          <li>Primary waits for replica acknowledgment.</li>
          <li>Primary confirms write to client.</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Strong consistency:</strong> Replica always has identical data to primary.
          </li>
          <li>
            <strong>Zero RPO:</strong> No data loss on failover — replica is up-to-date.
          </li>
          <li>
            <strong>Safe automatic failover:</strong> Can promote replica without data loss risk.
          </li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Higher write latency:</strong> Write latency = max(primary write, replica write, network RTT).
          </li>
          <li>
            <strong>Availability coupling:</strong> If replica is unavailable, primary cannot accept writes.
          </li>
          <li>
            <strong>Distance limitation:</strong> Latency increases with geographic distance. Practical limit
            is ~100 km for synchronous replication.
          </li>
        </ul>
        <p>
          <strong>Use cases:</strong> Financial transactions, inventory systems, authentication data — anywhere
            data loss is unacceptable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Asynchronous Replication</h3>
        <p>
          In <strong>asynchronous replication</strong>, the primary confirms the write immediately and sends
          data to replicas afterward.
        </p>
        <p>
          <strong>Flow:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Client sends write request to primary.</li>
          <li>Primary writes to local storage.</li>
          <li>Primary confirms write to client immediately.</li>
          <li>Primary sends data to replica asynchronously.</li>
          <li>Replica acknowledges (primary does not wait).</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Low write latency:</strong> Client only waits for primary write.
          </li>
          <li>
            <strong>Geographic flexibility:</strong> Can replicate across continents without impacting latency.
          </li>
          <li>
            <strong>Failure isolation:</strong> Replica failures do not affect primary availability.
          </li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Replication lag:</strong> Replica may be seconds or minutes behind primary.
          </li>
          <li>
            <strong>Potential data loss:</strong> If primary fails before replicating, data is lost.
          </li>
          <li>
            <strong>Eventual consistency:</strong> Reads from replica may return stale data.
          </li>
        </ul>
        <p>
          <strong>Use cases:</strong> Social media feeds, comments, analytics, caching — where eventual
          consistency is acceptable.
        </p>

        <ArticleImage
          src="/diagrams/backend-nfr/replication-strategies.svg"
          alt="Replication Strategies"
          caption="Replication Strategies — comparing synchronous vs asynchronous replication with multi-region patterns (single leader, multi-leader, leaderless)"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Region Replication Patterns</h3>
        <p>
          For global availability, data must be replicated across geographic regions. There are three main patterns:
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Single Leader (Primary-Follower)</h4>
        <p>
          One region is designated as the leader (primary) for writes. All other regions are followers (replicas)
          that receive asynchronous replication.
        </p>
        <p>
          <strong>Trade-offs:</strong> Simple, no write conflicts. But all writes must go to the leader region,
          causing high latency for distant users. Leader region is a single point of failure.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Multi-Leader</h4>
        <p>
          Multiple regions accept writes independently and replicate asynchronously to each other.
        </p>
        <p>
          <strong>Trade-offs:</strong> Users can write to their nearest region (low latency). But write conflicts
          are possible — the same record might be updated in different regions simultaneously. Requires conflict
          resolution (last-write-wins, merge functions, or application logic).
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Leaderless (Dynamo-Style)</h4>
        <p>
          Any node can accept writes. The client (or coordinator) sends writes to multiple nodes and waits for
          acknowledgments from a quorum.
        </p>
        <p>
          <strong>Trade-offs:</strong> Maximum availability — any node can handle any request. But complex
          conflict resolution and read repair mechanisms are required. Used by DynamoDB, Cassandra, Riak.
        </p>
      </section>

      <section>
        <h2>Failover Patterns</h2>
        <p>
          Failover is the process of switching from a failed component to a redundant backup. The goal is to
          minimize downtime (RTO) and data loss (RPO).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RTO and RPO</h3>
        <p>
          <strong>RTO (Recovery Time Objective):</strong> The maximum acceptable downtime after a failure.
          It is the target time to restore service.
        </p>
        <p>
          <strong>RPO (Recovery Point Objective):</strong> The maximum acceptable data loss measured in time.
          If RPO is 5 minutes, you must be able to recover data up to 5 minutes before the failure.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <p className="font-semibold">Relationship to Replication:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Synchronous replication → RPO ≈ 0 (no data loss)</li>
            <li>• Asynchronous replication → RPO = replication lag (seconds to minutes)</li>
            <li>• Daily backups → RPO = 24 hours (up to one day of data loss)</li>
          </ul>
        </div>

        <ArticleImage
          src="/diagrams/backend-nfr/failover-patterns.svg"
          alt="Failover Patterns and RTO/RPO"
          caption="Failover Patterns — showing failover timeline with detection time, failover time, RTO, and RPO, plus comparison of DNS, IP, and load balancer failover strategies"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failover Mechanisms</h3>

        <h4 className="mt-6 mb-3 text-lg font-semibold">DNS Failover</h4>
        <p>
          When a primary server fails, update DNS records to point to a backup server&apos;s IP address.
        </p>
        <p>
          <strong>Pros:</strong> Simple, works for any TCP service, no special infrastructure needed.</p>
        <p>
          <strong>Cons:</strong> Slow — depends on DNS TTL (time to live). Even with low TTL (60 seconds),
          clients and ISPs may cache longer. Typical failover time: 2-10 minutes.
        </p>
        <p>
          <strong>Best for:</strong> Disaster recovery, non-critical services, backup for faster failover mechanisms.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">IP Failover (Virtual IP)</h4>
        <p>
          A virtual IP (VIP) address floats between servers. The primary holds the VIP. On failure, the backup
          takes over the VIP using ARP announcement or similar mechanism.
        </p>
        <p>
          <strong>Pros:</strong> Fast (seconds), transparent to clients (IP does not change).</p>
        <p>
          <strong>Cons:</strong> Requires servers on the same network segment. Does not work across data centers
          without special networking (VLAN extension, SDN).
        </p>
        <p>
          <strong>Best for:</strong> Same-datacenter failover, database clusters, load balancer HA pairs.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Load Balancer Failover</h4>
        <p>
          The load balancer continuously health-checks backend servers. When a server fails health checks,
          the load balancer stops sending traffic to it.
        </p>
        <p>
          <strong>Pros:</strong> Fastest (sub-second), automatic, works across data centers.</p>
        <p>
          <strong>Cons:</strong> Requires load balancer in the path. The load balancer itself becomes a single
          point of failure (solve with LB redundancy).
        </p>
        <p>
          <strong>Best for:</strong> Web services, APIs, microservices, any HTTP/TCP service behind a load balancer.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failure Detection</h3>
        <p>
          Fast failover requires fast failure detection. Common approaches:
        </p>
        <ul>
          <li>
            <strong>Heartbeat:</strong> Nodes send periodic &quot;I am alive&quot; messages. If heartbeat stops,
            node is considered dead. Typical interval: 1-5 seconds.
          </li>
          <li>
            <strong>Health Checks:</strong> Active probes (HTTP GET /health, TCP connection test). More reliable
            than heartbeat but adds overhead.
          </li>
          <li>
            <strong>Passive Monitoring:</strong> Monitor actual request failures. If error rate exceeds threshold,
            mark node unhealthy. No extra traffic but slower detection.
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> Use a combination. Heartbeat for fast detection, health checks
          for confirmation, passive monitoring for catching application-level failures.
        </p>
      </section>

      <section>
        <h2>Availability Calculation</h2>
        <p>
          Understanding how to calculate system availability is critical for designing HA systems and answering
          interview questions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Single Component Availability</h3>
        <p>
          For a single component with known MTBF (Mean Time Between Failures) and MTTR (Mean Time To Repair):
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            Availability = MTBF / (MTBF + MTTR)
          </p>
        </div>
        <p>
          Example: A server with MTBF = 10,000 hours and MTTR = 10 hours has availability:
        </p>
        <p className="my-4 text-center font-semibold">
          10,000 / (10,000 + 10) = 10,000 / 10,010 = 0.999 = 99.9%
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Series Components (All Must Work)</h3>
        <p>
          When components are in series (all must be available for the system to work), multiply their availabilities:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            A<sub>system</sub> = A<sub>1</sub> × A<sub>2</sub> × ... × A<sub>n</sub>
          </p>
        </div>
        <p>
          Example: System with three 99.9% components in series:
        </p>
        <p className="my-4 text-center font-semibold">
          0.999 × 0.999 × 0.999 = 0.997 = 99.7%
        </p>
        <p>
          <strong>Key insight:</strong> Series availability is always worse than the worst component. Adding
          more components in series reduces overall availability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Parallel Components (Redundancy)</h3>
        <p>
          When components are in parallel (any one can keep the system running), calculate unavailability and subtract from 1:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            A<sub>system</sub> = 1 - (1 - A<sub>1</sub>) × (1 - A<sub>2</sub>) × ... × (1 - A<sub>n</sub>)
          </p>
        </div>
        <p>
          Example: Two 99% components in parallel:
        </p>
        <p className="my-4 text-center font-semibold">
          1 - (0.01 × 0.01) = 1 - 0.0001 = 0.9999 = 99.99%
        </p>
        <p>
          <strong>Key insight:</strong> Parallel redundancy dramatically improves availability. Two 99% components
          give 99.99%. Three 99% components give 99.9999%.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Interview Example: Calculating Availability</h3>
          <p className="font-semibold">Question:</p>
          <p className="mb-3">
            &quot;You have a web tier with 3 servers behind a load balancer (any 1 can serve traffic),
            and a database tier with primary + replica (failover on primary failure). Each component has
            99.9% availability. What is the system availability?&quot;
          </p>
          <p className="font-semibold">Solution:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Web tier (parallel, need 1 of 3): 1 - (0.001)³ = 1 - 0.000000001 = 99.9999999%
            </li>
            <li>
              Database tier (active-passive): Depends on failover mechanism. Assume 99.9% primary + 99.9% replica
              with fast failover → ~99.99%
            </li>
            <li>
              System (series): 99.9999999% × 99.99% ≈ 99.99%
            </li>
          </ol>
          <p className="mt-3">
            The database tier is the limiting factor. Improving web tier availability beyond 3 servers provides
            diminishing returns.
          </p>
        </div>
      </section>

      <section>
        <h2>Production Best Practices</h2>
        <p>
          High availability is not just architecture — it requires operational discipline and continuous validation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eliminate Single Points of Failure (SPOF)</h3>
        <p>
          Identify and remove every component whose failure would bring down the system:
        </p>
        <ul>
          <li>
            <strong>Network:</strong> Multiple ISPs, redundant routers/switches, diverse physical paths.
          </li>
          <li>
            <strong>Power:</strong> Dual power supplies, UPS, backup generators.
          </li>
          <li>
            <strong>Compute:</strong> Multiple servers across availability zones.
          </li>
          <li>
            <strong>Storage:</strong> RAID, replication, erasure coding.
          </li>
          <li>
            <strong>Database:</strong> Read replicas, automatic failover.
          </li>
          <li>
            <strong>Load balancer:</strong> Active-active or active-passive LB pairs.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Design for Failure</h3>
        <p>
          Assume failures will happen and design accordingly:
        </p>
        <ul>
          <li>
            <strong>Timeouts:</strong> Every network call must have a timeout. Infinite waits cause cascading failures.
          </li>
          <li>
            <strong>Retries:</strong> Retry transient failures with exponential backoff and jitter.
          </li>
          <li>
            <strong>Circuit breakers:</strong> Stop calling failing services to prevent resource exhaustion.
          </li>
          <li>
            <strong>Bulkheads:</strong> Isolate failures to prevent system-wide collapse.
          </li>
          <li>
            <strong>Graceful degradation:</strong> When dependencies fail, provide reduced functionality rather
            than complete failure.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Failover Regularly</h3>
        <p>
          Failover mechanisms that are not tested will fail when needed. Practices:
        </p>
        <ul>
          <li>
            <strong>Chaos Engineering:</strong> Randomly kill instances, inject latency, simulate network partitions.
            Tools: Chaos Monkey, Gremlin.
          </li>
          <li>
            <strong>Game Days:</strong> Scheduled failure simulations. Practice manual failover procedures.
          </li>
          <li>
            <strong>Automated Failover Tests:</strong> CI/CD pipeline tests that verify failover works.
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> Mentioning chaos engineering and game days shows senior-level
          thinking. It demonstrates you understand that availability requires continuous validation, not just
          initial design.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Availability Metrics</h3>
        <p>
          Track these metrics continuously:
        </p>
        <ul>
          <li>
            <strong>Uptime percentage:</strong> Rolling 30-day, 90-day, 1-year availability.
          </li>
          <li>
            <strong>MTBF and MTTR:</strong> Track trends over time.
          </li>
          <li>
            <strong>Failover success rate:</strong> Percentage of failovers that completed successfully.
          </li>
          <li>
            <strong>RTO/RPO compliance:</strong> Actual vs target recovery time and data loss.
          </li>
          <li>
            <strong>Error budgets:</strong> Track remaining allowable downtime before violating SLA.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a highly available database system that must achieve 99.99% availability with zero data loss. What replication strategy and failover mechanism do you choose?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Replication strategy:</strong> Synchronous replication to 2 replicas (N=3 total). RPO=0 (zero data loss) requires sync replication.</li>
                <li><strong>Failover mechanism:</strong> Automatic failover with consensus (Raft/Paxos). Leader election within 30 seconds. Use Patroni for PostgreSQL or MGR for MySQL.</li>
                <li><strong>Availability calculation:</strong> Single node 99.9% → 3 nodes with automatic failover = 99.999% (only fails if all 3 fail simultaneously).</li>
                <li><strong>Cross-region:</strong> Async replica in second region for disaster recovery. RPO &gt; 0 for cross-region (speed of light limitation).</li>
                <li><strong>Trade-offs:</strong> Sync replication adds write latency (wait for all replicas). Consider semi-sync (wait for 1 replica) for better latency with near-zero RPO.</li>
                <li><strong>Testing:</strong> Regular failover drills (quarterly). Chaos engineering to verify automatic recovery.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Your e-commerce platform needs to handle Black Friday traffic with 99.999% availability. How do you design for this? What redundancy level (N+1, 2N) do you use and why?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Redundancy level:</strong> 2N (full duplication) for critical path (checkout, payment). N+1 for non-critical (product browsing, recommendations).</li>
                <li><strong>Multi-region:</strong> Active-active in 2+ regions. Each region can handle 100% traffic independently. DNS-based failover for disaster recovery.</li>
                <li><strong>Database:</strong> Read replicas in each region. Write to primary with async replica in DR region. Use connection pooling to handle connection storms.</li>
                <li><strong>Caching:</strong> Redis cluster with cross-region replication. Warm caches before Black Friday (load popular products into cache).</li>
                <li><strong>Load testing:</strong> Test at 3-5× expected peak traffic. Identify and fix bottlenecks before event.</li>
                <li><strong>Graceful degradation:</strong> Disable non-critical features (recommendations, reviews) if system under stress. Protect checkout flow.</li>
                <li><strong>Monitoring:</strong> Real-time dashboards, alerts at 50% capacity (early warning). War room staffed during event.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Calculate the availability of a system with: 3 web servers (99.9% each, any 1 can serve), 1 load balancer (99.99%), and a database with primary + sync replica (99.9% each). What is the bottleneck?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Web servers (parallel):</strong> 1 - (1-0.999)³ = 1 - 0.000001 = 99.9999%</li>
                <li><strong>Load balancer (single):</strong> 99.99% (bottleneck! Single point of failure)</li>
                <li><strong>Database (series):</strong> Primary 99.9% × sync replica doesn&apos;t improve availability (both must work for sync writes) = 99.9%</li>
                <li><strong>System availability:</strong> Web (99.9999%) × LB (99.99%) × DB (99.9%) = 99.89%</li>
                <li><strong>Bottleneck:</strong> Database at 99.9% and load balancer at 99.99%. To improve: (1) Add second load balancer with failover, (2) Use async replication or database clustering for higher DB availability.</li>
                <li><strong>Improved design:</strong> 2 LBs (99.999%) + DB cluster (99.99%) → System = 99.989% ≈ 99.99%</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your system has an RTO of 5 minutes and RPO of 1 minute. What replication and failover strategies would you implement? How do you validate these targets are met?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Replication for RPO=1min:</strong> Synchronous or semi-synchronous replication. Async with &lt;1min lag acceptable. Monitor replication lag continuously.</li>
                <li><strong>Failover for RTO=5min:</strong> Automatic failover with health checks. Warm standby in DR region. Pre-provisioned infrastructure.</li>
                <li><strong>Detection time:</strong> Health check interval 30 seconds, 3 failures = 90 seconds to detect.</li>
                <li><strong>Failover time:</strong> DNS TTL 60 seconds, application reconnect 30 seconds, database promotion 60 seconds = ~3 minutes total.</li>
                <li><strong>Validation:</strong> (1) Quarterly failover drills measuring actual RTO/RPO. (2) Continuous replication lag monitoring (alert if &gt;30 seconds). (3) Chaos engineering (random instance termination).</li>
                <li><strong>Documentation:</strong> Runbooks for manual failover. Contact list for escalation. Post-mortem after every failover event.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Compare active-passive vs active-active for a global payment system. What are the trade-offs around consistency, latency, and complexity?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Active-Passive:</strong> One region handles all traffic, second region on standby. ✓ Simpler (no conflict resolution), ✓ Strong consistency (single writer). ✗ Higher latency for distant users, ✗ Wasted capacity (passive region idle).</li>
                <li><strong>Active-Active:</strong> Both regions handle traffic. ✓ Lower latency (users connect to nearest), ✓ Full capacity utilization, ✓ Better fault tolerance. ✗ Complex (conflict resolution needed), ✗ Eventual consistency (or complex distributed transactions).</li>
                <li><strong>For payment systems:</strong> Active-passive recommended. Financial transactions require strong consistency. Use active-active only for read operations (balance inquiry, transaction history).</li>
                <li><strong>Hybrid approach:</strong> Active-active for read, active-passive for writes. Route writes to primary region, reads to nearest region.</li>
                <li><strong>Complexity:</strong> Active-active requires conflict resolution (last-write-wins, application merge, or CRDTs). Consider if business can tolerate temporary inconsistencies.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you handle split-brain scenarios in an active-active configuration? What consensus or arbitration mechanisms would you implement?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Prevention:</strong> Use consensus algorithms (Raft, Paxos) for leader election. Require quorum (N/2 + 1 nodes) for writes. Prevents split-brain by design.</li>
                <li><strong>Witness/Arbiter:</strong> Third-party witness node in neutral location. During network partition, only partition with witness accepts writes.</li>
                <li><strong>Fencing:</strong> Use STONITH (Shoot The Other Node In The Head). When failover occurs, fence old primary (power off, network隔离) before promoting new primary.</li>
                <li><strong>Lease-based:</strong> Primary holds time-limited lease. If lease expires (can&apos;t renew due to network issue), primary stops accepting writes automatically.</li>
                <li><strong>Resolution:</strong> If split-brain occurs: (1) Detect via monitoring (both primaries accepting writes). (2) Declare one primary as authoritative (based on data freshness, transaction count). (3) Merge data from other partition (conflict resolution). (4) Demote other partition to replica.</li>
                <li><strong>Best practice:</strong> Design system to tolerate partitions without split-brain (CP system). Better to be unavailable than inconsistent for payment systems.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>High Availability Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Quantified availability target (e.g., 99.99% = ~52 minutes downtime/year)</li>
          <li>✓ No single points of failure in critical path</li>
          <li>✓ Redundancy at every layer (network, compute, storage, database)</li>
          <li>✓ Automatic failover with health monitoring</li>
          <li>✓ Defined RTO and RPO targets for each service tier</li>
          <li>✓ Replication strategy aligned with RPO (sync for RPO=0, async for higher RPO)</li>
          <li>✓ Regular failover testing (chaos engineering, game days)</li>
          <li>✓ Availability monitoring and alerting</li>
          <li>✓ Documented runbooks for manual failover scenarios</li>
          <li>✓ Error budget tracking and enforcement</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
