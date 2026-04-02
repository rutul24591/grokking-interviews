"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-read-replicas-complete",
  title: "Read Replicas",
  description:
    "Comprehensive guide to read replicas: primary-replica architecture, replication lag, failover strategies, and when to use read replicas for read scaling and high availability.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "read-replicas",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "read-replicas", "replication", "high-availability"],
  relatedTopics: [
    "database-partitioning",
    "sharding-strategies",
    "consistency-models",
    "concurrency-control",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Read Replicas</h1>
        <p className="lead">
          Read replicas are copies of a primary database that serve read-only traffic. The primary
          database handles all writes and asynchronously replicates changes to replicas. This
          architecture enables read scaling (distribute reads across replicas), geographic
          distribution (place replicas near users), and high availability (failover to replica
          if primary fails). Read replicas are fundamental to scaling read-heavy applications
          (content feeds, e-commerce catalogs, analytics) and are supported by all major
          databases (MySQL, PostgreSQL, MongoDB, Redis).
        </p>

        <p>
          Consider a news website with millions of readers but relatively few writers (editors
          publishing articles). The primary database handles article creation and updates, but
          can't serve all reader traffic alone. Read replicas distribute the read load: readers
          fetch articles from replicas, editors write to primary. The site can scale by adding
          more replicas as reader traffic grows. If the primary fails, a replica can be promoted
          to primary (failover) to restore write capability.
        </p>

        <p>
          Read replicas differ from sharding (distributing data across shards)—replicas contain
          full copies of data. Replicas also differ from multi-primary replication (multiple
          nodes accept writes)—read replicas are read-only, avoiding write conflicts. The
          primary-replica model is simpler and more widely supported than multi-primary.
        </p>

        <p>
          This article provides a comprehensive examination of read replicas: primary-replica
          architecture, replication lag (the fundamental challenge), read routing strategies
          (read-your-writes, staleness windows), failover mechanisms (automatic vs manual),
          and real-world use cases. We'll explore when read replicas excel (read scaling,
          geographic distribution, high availability) and when they introduce complexity
          (replication lag, failover decisions, consistency trade-offs). We'll also cover
          implementation patterns (monitoring, routing layers, semi-sync replication) and
          common pitfalls (ignoring lag, no failover testing).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/read-replicas-architecture.svg`}
          caption="Figure 1: Read Replicas Architecture showing primary-replica setup. Primary (Master) handles all writes, replicas replicate asynchronously and serve read-only traffic. Writes go to primary only, replicas replicate asynchronously, reads distributed across replicas. Replication lag illustrated: Primary at T0 (current, latest data), Replica at T-5s (stale, 5 seconds behind). Causes: network latency, heavy writes. Impact: stale reads on replicas. Mitigation: read-your-writes routing. Read routing strategies: Read-Your-Writes (route to primary after write), Staleness Window (tolerate N seconds lag), Primary for Critical (financial, inventory data), Random Replica (load balancing). Key characteristics: read scaling, asynchronous replication, replication lag, failover capability."
          alt="Read replicas architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Primary-Replica Architecture</h2>

        <h3>Primary-Replica Setup</h3>
        <p>
          <strong>Primary-replica architecture</strong> has one primary (master) database and
          one or more replicas (slaves, secondaries). The primary handles all writes (INSERT,
          UPDATE, DELETE). Replicas replicate changes from primary and serve read-only traffic
          (SELECT). This separation enables independent scaling of reads and writes.
        </p>

        <p>
          Replication is typically <strong>asynchronous</strong>: primary commits writes, then
          sends changes to replicas. Replicas apply changes independently. This provides low
          write latency (primary doesn't wait for replicas) but introduces <strong>replication
          lag</strong> (replicas are behind primary by some time).
        </p>

        <p>
          Some databases support <strong>semi-synchronous replication</strong>: primary waits
          for at least one replica to acknowledge before committing. This reduces data loss risk
          on primary failure but increases write latency. Trade-off: consistency vs performance.
        </p>

        <h3>Replication Lag</h3>
        <p>
          <strong>Replication lag</strong> is the time delay between a write committing on
          primary and the change appearing on replicas. Lag is measured in seconds or
          milliseconds. Typical lag: milliseconds on idle systems, seconds under heavy write
          load.
        </p>

        <p>
          Lag causes: <strong>Network latency</strong> (changes take time to transmit),
          <strong>Heavy write load</strong> (replicas can't keep up with primary),
          <strong>Long-running queries on replica</strong> (blocks replication thread),
          <strong>Resource contention</strong> (replica under-provisioned vs primary).
        </p>

        <p>
          Lag impact: <strong>Stale reads</strong>—users see old data after updates. Example:
          user updates profile, immediately reads, sees old profile (confusing UX).
          <strong>Data loss on failover</strong>—if primary fails with unreplicated changes,
          those changes are lost. <strong>Inconsistent analytics</strong>—reports from
          replicas don't match primary state.
        </p>

        <h3>Read Routing Strategies</h3>
        <p>
          Applications must route reads to replicas while handling lag. Strategies:
          <strong>Read-your-writes</strong>—after a user writes, route their subsequent reads
          to primary for a window (e.g., 5 seconds). This ensures users see their own changes.
          <strong>Staleness window</strong>—tolerate N seconds of lag for non-critical reads
          (content feeds, product catalogs). <strong>Primary for critical</strong>—route
          financial, inventory, or consistency-critical reads to primary.
          <strong>Random replica</strong>—distribute reads across replicas for load balancing
          (acceptable for eventually consistent data).
        </p>

        <p>
          Routing implementation: <strong>Application-level</strong>—application logic decides
          primary vs replica per query. <strong>Proxy-level</strong>—proxy (ProxySQL,
          PgBouncer) routes based on query type (SELECT to replica, WRITE to primary).
          <strong>Connection pooling</strong>—separate pools for primary and replicas.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/read-replicas-challenges.svg`}
          caption="Figure 2: Read Replicas Challenges and Solutions showing replication lag problem (User Updates Profile → Reads Immediately, Primary has updated data, Replica has stale data—user sees old data, confusing UX). Failover scenario illustrated: Primary failed (unavailable), Replica promoted to become new primary. Challenge: data loss if lag greater than 0 (unreplicated changes lost). Solution: semi-sync replication, RPO targets, automatic vs manual failover decision. Mitigation strategies: Read-Your-Writes (session sticky routing), Semi-Sync Replication (wait for 1 replica ack), Lag Monitoring (alert on high lag), Critical Reads (route to primary). Key takeaway: replication lag causes stale reads and potential data loss on failover—design routing strategies and monitor lag carefully."
          alt="Read replicas challenges and solutions"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Failover &amp; Monitoring</h2>

        <h3>Failover Mechanisms</h3>
        <p>
          When primary fails, a replica must be promoted to primary to restore write capability.
          This is <strong>failover</strong>. Failover can be <strong>automatic</strong>
          (database detects failure, promotes replica automatically) or <strong>manual</strong>
          (DBA decides when to failover).
        </p>

        <p>
          Automatic failover benefits: <strong>Fast recovery</strong> (seconds vs minutes for
          manual), <strong>No human intervention</strong> (works 24/7), <strong>Consistent
          process</strong> (no human error). Trade-offs: <strong>False positives</strong>
          (network blip triggers unnecessary failover), <strong>Data loss risk</strong> (if
          lag greater than 0, unreplicated changes lost), <strong>Split-brain risk</strong> (if old
          primary comes back online, two primaries exist).
        </p>

        <p>
          Manual failover benefits: <strong>Human judgment</strong> (DBA assesses situation
          before acting), <strong>Controlled process</strong> (can wait for lag to drain),
          <strong>No false positives</strong>. Trade-offs: <strong>Slower recovery</strong>
          (minutes to hours), <strong>Requires on-call DBA</strong>, <strong>Inconsistent
          execution</strong> (depends on DBA expertise).
        </p>

        <p>
          Failover best practices: <strong>Monitor replication lag</strong>—know lag before
          failover (affects data loss). <strong>Drain lag before failover</strong>—if possible,
          wait for replicas to catch up. <strong>Test failover regularly</strong>—practice
          makes perfect. <strong>Document runbook</strong>—clear steps for manual failover.
          <strong>Use RPO/RTO targets</strong>—define acceptable data loss (Recovery Point
          Objective) and downtime (Recovery Time Objective).
        </p>

        <h3>Monitoring Replication Health</h3>
        <p>
          Monitoring is essential for replica health. Key metrics: <strong>Replication lag</strong>
          (seconds behind primary), <strong>Replication thread status</strong> (running or
          stopped), <strong>Bytes behind</strong> (data volume pending replication),
          <strong>Last heartbeat</strong> (time since last communication with primary).
        </p>

        <p>
          Alert thresholds: <strong>Lag more than 10 seconds</strong> (investigate cause),
          <strong>Lag more than 60 seconds</strong> (critical, may need intervention),
          <strong>Replication stopped</strong> (immediate action required),
          <strong>Primary unreachable</strong> (failover may be needed).
        </p>

        <p>
          Monitoring tools: <strong>Database-native</strong> (SHOW SLAVE STATUS in MySQL,
          pg_stat_replication in PostgreSQL), <strong>Monitoring systems</strong> (Prometheus
          with database exporters, Datadog, New Relic), <strong>Custom scripts</strong> (check
          lag, alert via PagerDuty/Slack).
        </p>

        <h3>Semi-Synchronous Replication</h3>
        <p>
          <strong>Semi-synchronous replication</strong> is a middle ground between async
          (fast, risk of data loss) and sync (slow, no data loss). Primary waits for at least
          one replica to acknowledge receipt before committing. This ensures at least one
          replica has the data, reducing data loss risk on primary failure.
        </p>

        <p>
          Trade-offs: <strong>Write latency increases</strong> (primary waits for ack),
          <strong>Throughput may decrease</strong> (replica ack is bottleneck),
          <strong>Data loss risk reduced</strong> (at least one replica has data). Use for:
          critical data where some data loss is unacceptable, compliance requirements (RPO
          targets), high-value transactions (financial, inventory).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/read-replicas-use-cases.svg`}
          caption="Figure 3: Read Replicas Use Cases and Implementation. Primary use cases: Read Scaling (read-heavy workloads 10:1+, distribute read load across replicas, content feeds/product catalogs, analytics queries offload, linear read throughput scaling), Geographic Distribution (regional replicas like us-east/eu-west, low latency for local users, data residency compliance, disaster recovery, regional failover capability), High Availability (automatic failover, zero-downtime maintenance, backup offload from replica, reporting/analytics isolation, reduced primary load). Implementation Checklist: Replication Mode (async vs semi-sync), Read Routing (proxy or application logic), Lag Monitoring (alert thresholds), Failover Plan (automatic vs manual). Anti-patterns: ignoring replication lag (causes stale reads), no failover testing, writing to replicas (breaks consistency), too many replicas (increases lag)."
          alt="Read replicas use cases and implementation"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Read Replicas vs Alternatives</h2>

        <p>
          Read replicas are one of several scaling strategies. Understanding the trade-offs
          helps you choose the right approach—or combine multiple strategies.
        </p>

        <h3>Read Replicas Strengths</h3>
        <p>
          <strong>Read scaling</strong> is the primary advantage. Distribute reads across
          replicas, enabling linear read throughput scaling. Add more replicas for more read
          capacity. This is essential for read-heavy workloads (content feeds, product
          catalogs, analytics).
        </p>

        <p>
          <strong>Geographic distribution</strong> enables low-latency reads. Place replicas
          near users (us-east, eu-west, ap-south). Users read from local replica (fast),
          writes go to primary (acceptable latency). This is essential for global applications.
        </p>

        <p>
          <strong>High availability</strong>—replicas provide failover capability. If primary
          fails, promote replica to primary. This reduces downtime (RTO) and can reduce data
          loss (RPO) if lag is minimal.
        </p>

        <p>
          <strong>Operational flexibility</strong>—offload backups, analytics, and reporting
          to replicas. Primary focuses on writes, replicas handle read-heavy workloads. This
          improves primary performance and reduces contention.
        </p>

        <h3>Read Replicas Limitations</h3>
        <p>
          <strong>Replication lag</strong> causes stale reads. Users may see old data after
          updates. This is confusing for UX and can cause business logic errors (user sees
          old balance, makes decision based on stale data).
        </p>

        <p>
          <strong>No write scaling</strong>—all writes still hit primary. Read replicas don't
          help with write-heavy workloads. For write scaling, use sharding instead.
        </p>

        <p>
          <strong>Failover complexity</strong>—promoting replica to primary requires careful
          handling (lag assessment, DNS updates, application reconfiguration). Automatic
          failover adds complexity (false positive handling, split-brain prevention).
        </p>

        <p>
          <strong>Consistency trade-offs</strong>—eventual consistency (replicas lag behind
          primary). Applications must handle stale reads or route carefully (read-your-writes).
        </p>

        <h3>Read Replicas vs Sharding</h3>
        <p>
          <strong>Read replicas</strong> copy full data to each replica. All replicas have
          same data. Scales reads, not writes. Simpler to implement (no shard key, no
          cross-shard queries).
        </p>

        <p>
          <strong>Sharding</strong> distributes data across shards. Each shard has subset of
          data. Scales both reads and writes. More complex (shard key selection, cross-shard
          queries, rebalancing).
        </p>

        <p>
          <strong>Combined approach</strong> is common: shard for write scaling, replicate
          each shard for read scaling and availability. Example: shard by user_id, each
          shard has 3 replicas for redundancy.
        </p>

        <h3>When to Use Read Replicas</h3>
        <p>
          Use read replicas for: <strong>Read-heavy workloads</strong> (read:write ratio 10:1
          or higher), <strong>Geographic distribution</strong> (low latency for global users),
          <strong>High availability</strong> (failover capability), <strong>Analytics
          offload</strong> (run heavy queries on replicas), <strong>Backup offload</strong>
          (backup from replica, not primary).
        </p>

        <p>
          Avoid read replicas for: <strong>Write-heavy workloads</strong> (use sharding
          instead), <strong>Strong consistency required</strong> (replicas are eventually
          consistent), <strong>Low tolerance for stale reads</strong> (financial, inventory
          systems), <strong>Limited operational expertise</strong> (failover, monitoring
          require expertise).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Read Replicas</h2>

        <p>
          <strong>Monitor replication lag.</strong> Track lag continuously, alert on thresholds
          (10 seconds warning, 60 seconds critical). Investigate lag spikes immediately. Lag
          is the #1 issue with read replicas.
        </p>

        <p>
          <strong>Implement read-your-writes routing.</strong> After a user writes, route
          their reads to primary for a window (5-10 seconds). This ensures users see their
          own changes. Implement via session tracking or sticky routing.
        </p>

        <p>
          <strong>Use semi-sync for critical data.</strong> For financial, inventory, or
          compliance-critical data, use semi-synchronous replication. Wait for at least one
          replica ack before committing. Reduces data loss risk on primary failure.
        </p>

        <p>
          <strong>Test failover regularly.</strong> Practice failover quarterly. Document
          runbook, measure RTO/RPO, identify gaps. Failover under stress is different from
          failover in test environment.
        </p>

        <p>
          <strong>Right-size replicas.</strong> Replicas should have similar resources to
          primary (CPU, memory, I/O). Under-provisioned replicas can't keep up, causing lag.
          Exception: analytics replicas can be larger for heavy queries.
        </p>

        <p>
          <strong>Limit replica count.</strong> More replicas = more lag (primary must send
          changes to more destinations). Typical: 1-5 replicas. If you need more, consider
          sharding or multi-level replication (primary → intermediate → leaf replicas).
        </p>

        <p>
          <strong>Route analytics to replicas.</strong> Heavy analytics queries (aggregations,
          full table scans) should run on replicas, not primary. This prevents analytics from
          impacting primary performance.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Ignoring replication lag.</strong> Assuming replicas are in sync causes
          stale reads. Solution: Monitor lag, implement read-your-writes routing, educate
          developers about eventual consistency.
        </p>

        <p>
          <strong>No failover testing.</strong> Failover during incident is stressful and
          error-prone. Solution: Test quarterly, document runbook, automate where possible,
          measure RTO/RPO.
        </p>

        <p>
          <strong>Writing to replicas.</strong> Some databases allow writes to replicas
          (MySQL with read_write mode). This breaks consistency and causes data divergence.
          Solution: Enforce read-only mode on replicas, application-level routing to prevent
          writes.
        </p>

        <p>
          <strong>Too many replicas.</strong> Adding replicas increases lag (more destinations
          for replication). Solution: Limit to 1-5 replicas, use multi-level replication if
          more needed, consider sharding for read scaling beyond replica limits.
        </p>

        <p>
          <strong>Under-provisioned replicas.</strong> Replicas with fewer resources than
          primary can't keep up, causing lag. Solution: Right-size replicas, monitor replica
          performance, scale replicas independently if needed.
        </p>

        <p>
          <strong>No lag alerting.</strong> Lag grows silently until users complain. Solution:
          Set up lag monitoring with alerts (10 seconds warning, 60 seconds critical), page
          on-call when lag exceeds thresholds.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Content Feeds (Twitter, Facebook)</h3>
        <p>
          Social media platforms use read replicas for feed reads. Primary handles post
          creation, replicas serve feed reads (1000:1 read:write ratio). Benefits: read
          scaling (thousands of replicas for global traffic), geographic distribution (users
          read from local replica), analytics offload (trending algorithms run on replicas).
        </p>

        <p>
          This pattern works because social media is read-heavy (most users consume, few
          create), eventual consistency is acceptable (seeing a post 5 seconds late is fine),
          and geographic distribution reduces latency.
        </p>

        <h3>E-Commerce (Amazon, Shopify)</h3>
        <p>
          E-commerce platforms use read replicas for product catalogs. Primary handles
          inventory updates, order creation; replicas serve product browsing, search,
          recommendations. Benefits: read scaling (millions of product views), analytics
          offload (reporting on replicas), backup offload (backup from replica).
        </p>

        <p>
          This pattern works because browsing is read-heavy, product data changes infrequently
          (lag acceptable), and inventory/order writes go to primary (strong consistency for
          critical operations).
        </p>

        <h3>SaaS Analytics (Mixpanel, Amplitude)</h3>
        <p>
          Analytics platforms use read replicas for query isolation. Primary handles event
          ingestion (high write throughput), replicas serve user queries (dashboards,
          reports). Benefits: query isolation (heavy analytics don't impact ingestion),
          read scaling (many users querying simultaneously), geographic distribution (global
          customers).
        </p>

        <p>
          This pattern works because ingestion is write-heavy, queries are read-heavy and
          can tolerate some lag (analytics are inherently historical), and query isolation
          protects ingestion performance.
        </p>

        <h3>Global Applications (Spotify, Netflix)</h3>
        <p>
          Global applications use read replicas for geographic distribution. Primary in us-east,
          replicas in eu-west, ap-south, etc. Users read from local replica (low latency),
          writes go to primary (acceptable latency). Benefits: low latency (reads from local
          replica), compliance (data residency), disaster recovery (regional failover).
        </p>

        <p>
          This pattern works because users are globally distributed, read latency matters
          (buffering is frustrating), and write latency is acceptable (playlist updates can
          take extra seconds).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you use read replicas? What are the signs that read replicas are
              needed?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use read replicas for read-heavy workloads. Signs: (1)
              Read:write ratio more than 10:1, (2) Primary CPU high due to read load, (3) Read queries
              slowing down, (4) Analytics queries impacting primary performance, (5) Need for
              geographic distribution (global users), (6) Need for high availability (failover
              capability). Don't use read replicas for write-heavy workloads (use sharding
              instead). Start with query optimization, indexing before adding replicas.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How many replicas should you have? Answer: Typical
              1-5 replicas. More replicas increase replication lag. If you need more than 5,
              consider multi-level replication (primary → intermediate → leaf) or sharding.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is replication lag? What causes it and how do you mitigate it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Replication lag is the time delay between a write
              committing on primary and appearing on replicas. Causes: (1) Network latency
              (changes take time to transmit), (2) Heavy write load (replicas can't keep up),
              (3) Long-running queries on replica (blocks replication thread), (4) Resource
              contention (replica under-provisioned). Mitigation: (1) Right-size replicas
              (similar resources to primary), (2) Limit replica count (1-5 typical), (3) Use
              semi-sync replication (reduces lag variance), (4) Monitor and alert on lag,
              (5) Kill long-running queries on replicas.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's acceptable lag? Answer: Depends on use case.
              For content feeds: seconds acceptable. For financial data: milliseconds, use
              semi-sync or read from primary. Monitor lag, alert on thresholds (10s warning,
              60s critical).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How do you handle read-your-writes consistency with read replicas?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Read-your-writes ensures users see their own changes
              immediately. Strategies: (1) Session sticky routing—after user writes, route
              their reads to primary for a window (5-10 seconds). Track via session cookie
              or token. (2) Timestamp tracking—record write timestamp, route reads to primary
              if read timestamp less than write timestamp. (3) Primary for critical—always route
              financial, inventory reads to primary. (4) Application-level routing—application
              logic decides primary vs replica per query based on context.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the performance cost? Answer: Routing some
              reads to primary increases primary load. Balance: use read-your-writes only
              for user's own data, not all reads. Most reads can still go to replicas.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you handle failover? What are the challenges?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Failover promotes replica to primary when primary
              fails. Challenges: (1) Data loss—if lag greater than 0, unreplicated changes lost. (2)
              Split-brain—if old primary comes back online, two primaries exist. (3)
              Application reconfiguration—apps must point to new primary. (4) DNS
              propagation—DNS updates take time. Approaches: (1) Automatic failover
              (database detects failure, promotes replica automatically)—fast but risk of
              false positives. (2) Manual failover (DBA decides when to failover)—slower
              but controlled. Best practices: monitor lag before failover, drain lag if
              possible, test failover regularly, document runbook, use RPO/RTO targets.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is split-brain? Answer: Two primaries exist
              simultaneously (old primary comes back online after failover). Causes data
              divergence. Prevention: fencing (old primary can't accept writes), consensus
              (only one primary at a time), manual intervention.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Compare async vs semi-sync vs sync replication. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Async replication: primary commits, sends to replicas
              asynchronously. Pros: lowest write latency, highest throughput. Cons: risk of
              data loss on primary failure, replication lag. Use for: read-heavy workloads,
              eventual consistency acceptable. Semi-sync replication: primary waits for at
              least one replica ack before committing. Pros: reduces data loss risk, ensures
              at least one replica has data. Cons: increased write latency. Use for: critical
              data, compliance requirements (RPO targets). Sync replication: primary waits
              for all replicas to commit before committing. Pros: no data loss, strong
              consistency. Cons: highest write latency, throughput limited by slowest replica.
              Use for: financial systems, zero data loss tolerance (rare, usually use other
              strategies like distributed transactions instead).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's typical lag for each? Answer: Async:
              milliseconds to seconds depending on load. Semi-sync: similar to async but
              more consistent (bounded by network RTT to nearest replica). Sync: highest
              and most variable (bounded by slowest replica).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your read replicas have high replication lag (60+ seconds). How do you
              diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check network latency between primary
              and replicas (ping, traceroute). (2) Check replica resources (CPU, memory,
              I/O)—under-provisioned? (3) Check for long-running queries on replica
              (blocking replication thread). (4) Check write load on primary—heavy writes
              overwhelm replicas. (5) Check replication thread status (running or stopped).
              Fix: (1) Right-size replicas (match primary resources). (2) Kill long-running
              queries on replica. (3) Reduce replica count (fewer destinations). (4) Use
              multi-level replication (primary → intermediate → leaf). (5) Consider sharding
              if write load is too high. (6) Upgrade network (more bandwidth, lower latency).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent this in future? Answer: Monitor
              lag continuously, alert on thresholds (10s warning, 60s critical), right-size
              replicas from start, limit replica count, test failover regularly.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 5.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 11.
          </li>
          <li>
            MySQL Documentation, "Replication,"
            https://dev.mysql.com/doc/refman/8.0/en/replication.html
          </li>
          <li>
            PostgreSQL Documentation, "Replication,"
            https://www.postgresql.org/docs/current/runtime-config-replication.html
          </li>
          <li>
            MongoDB Documentation, "Replication,"
            https://www.mongodb.com/docs/manual/replication/
          </li>
          <li>
            Redis Documentation, "Replication,"
            https://redis.io/docs/management/replication/
          </li>
          <li>
            AWS RDS Documentation, "Read Replicas,"
            https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html
          </li>
          <li>
            Google Cloud SQL Documentation, "Read Replicas,"
            https://cloud.google.com/sql/docs/mysql/replication
          </li>
          <li>
            Shopify Engineering Blog, "Scaling MySQL at Shopify,"
            https://shopify.engineering/
          </li>
          <li>
            GitHub Engineering Blog, "MySQL High Availability at GitHub,"
            https://github.blog/engineering/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
