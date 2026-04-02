"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sharding-strategies-complete",
  title: "Sharding Strategies",
  description:
    "Comprehensive guide to sharding strategies: hash-based vs range-based sharding, consistent hashing, cross-shard operations, and implementation patterns for horizontal database scaling.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sharding-strategies",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "sharding", "scaling", "distributed-systems"],
  relatedTopics: [
    "database-partitioning",
    "read-replicas",
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
        <h1>Sharding Strategies</h1>
        <p className="lead">
          Sharding is a horizontal scaling technique that distributes data across multiple
          database servers (shards) based on a shard key. Unlike vertical scaling (bigger servers),
          sharding enables linear scaling: add more shards for more capacity. Each shard is an
          independent database containing a subset of data. This enables databases to scale beyond
          single-machine limits for storage, write throughput, and query performance. Sharding is
          fundamental to distributed databases (Cassandra, CockroachDB, MongoDB) and high-scale
          applications (Twitter shards tweets, Shopify shards orders).
        </p>

        <p>
          Consider a social media platform with 100 million users posting millions of tweets per
          day. A single database server can't handle the write throughput or storage. Sharding
          distributes users across servers: users 1-1M on shard A, 1M-2M on shard B, and so on.
          Each shard handles its users' writes independently. The platform can scale by adding
          more shards as user count grows. Queries for specific users hit only one shard (fast).
        </p>

        <p>
          Sharding differs from partitioning (often used interchangeably, but sharding implies
          distribution across multiple servers). Sharding also differs from replication (copying
          data for redundancy)—sharding distributes data (each piece exists in one place).
          Combined approaches are common: shard for write scaling, replicate each shard for
          read scaling and availability.
        </p>

        <p>
          This article provides a comprehensive examination of sharding strategies: sharding
          methods (hash-based, range-based, directory-based, consistent hashing), shard key
          selection (the most critical design decision), cross-shard operations (joins,
          transactions) and their challenges, rebalancing strategies, and real-world use cases.
          We'll explore when sharding excels (write scaling, storage scaling, geographic
          distribution) and when it introduces complexity (cross-shard operations, distributed
          transactions). We'll also cover implementation patterns (routing layers, monitoring,
          rebalancing) and common pitfalls (poor shard key selection, premature sharding).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sharding-strategies.svg`}
          caption="Figure 1: Sharding Strategies Comparison showing hash-based sharding (shard key → hash() → hash value → shard = hash % num_shards, distributes to Shard 0/1/2 based on hash result). Hash-based provides even distribution but range queries are inefficient. Range-based sharding partitions by value ranges (Shard A: user_id 1-100K, Shard B: 100K-200K, Shard C: 200K+). Range-based enables efficient range queries but risks uneven distribution. Consistent hashing uses a hash ring where keys are assigned to clockwise node—adding/removing nodes affects only neighbors, minimizing data movement during rebalancing. Key characteristics: hash-based (even distribution), range-based (efficient range queries), consistent hashing (minimal rebalancing)."
          alt="Sharding strategies comparison"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Sharding Methods</h2>

        <h3>Hash-Based Sharding</h3>
        <p>
          <strong>Hash-based sharding</strong> applies a hash function to the shard key, then
          uses the hash value to determine the shard. Formula: <code className="inline-code">shard = hash(shard_key) % num_shards</code>. Example: hash(user_id) % 4 determines which of 4 shards stores the user's data.
        </p>

        <p>
          Hash-based sharding provides <strong>even distribution</strong>—hash functions spread
          values uniformly across shards. This prevents hot spots (one shard overloaded). It's
          ideal for workloads with uniform access patterns (social media posts, IoT telemetry).
        </p>

        <p>
          Trade-offs: <strong>Range queries are inefficient</strong>—querying users 1-100K
          requires querying all shards (hash values are scattered). <strong>Rebalancing is
          expensive</strong>—changing num_shards requires moving most data (hash values change).
          Use consistent hashing (below) to minimize rebalancing cost.
        </p>

        <h3>Range-Based Sharding</h3>
        <p>
          <strong>Range-based sharding</strong> partitions by value ranges. Example: users 1-100K
          on shard A, 100K-200K on shard B, 200K+ on shard C. Ranges can be by numeric ID, date
          ranges (one shard per month), or alphabetical ranges (A-M, N-Z).
        </p>

        <p>
          Range-based sharding enables <strong>efficient range queries</strong>—querying users
          1-100K hits only shard A. This is ideal for time-series data (query last month's data)
          or ordered data (query users by ID range).
        </p>

        <p>
          Trade-offs: <strong>Uneven distribution risk</strong>—if data isn't uniform (most
          users are in 1-100K range), shard A becomes a hot spot. <strong>Manual rebalancing</strong>
          may be needed as data grows (split large ranges, merge small ranges). Monitor shard
          sizes and adjust ranges proactively.
        </p>

        <h3>Directory-Based Sharding</h3>
        <p>
          <strong>Directory-based sharding</strong> uses a lookup service (directory) to map
          shard keys to shards. The directory maintains a mapping table: user_id → shard_id.
          Applications query the directory first, then route to the appropriate shard.
        </p>

        <p>
          Directory-based sharding provides <strong>flexibility</strong>—shard assignments can
          change without application changes. It enables complex sharding strategies (composite
          keys, dynamic rebalancing). It's used by middleware (Vitess for MySQL, Citus for
          PostgreSQL).
        </p>

        <p>
          Trade-offs: <strong>Directory is a single point of failure</strong>—must be highly
          available (replicate, cache). <strong>Added latency</strong>—extra lookup before
          querying shard. <strong>Complexity</strong>—directory must be kept in sync with
          actual shard assignments.
        </p>

        <h3>Consistent Hashing</h3>
        <p>
          <strong>Consistent hashing</strong> maps both shards and keys to a hash ring. Keys
          are assigned to the first shard clockwise on the ring. When shards are added/removed,
          only keys between the old and new positions move—minimizing data movement.
        </p>

        <p>
          Consistent hashing enables <strong>efficient rebalancing</strong>—adding a shard
          affects only keys assigned to that shard's position. This is essential for elastic
          scaling (auto-add shards as load increases). It's used by DynamoDB, Cassandra, and
          distributed caches (Redis Cluster).
        </p>

        <p>
          Trade-offs: <strong>Implementation complexity</strong>—requires hash ring management.
          <strong>Virtual nodes</strong> are often needed for even distribution (each physical
          shard maps to multiple positions on the ring). <strong>Range queries still
          inefficient</strong>—hash-based distribution scatters related keys.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sharding-challenges.svg`}
          caption="Figure 2: Sharding Challenges and Solutions showing cross-shard joins problem (JOIN across shards requires network calls between Shard A with Users table and Shard B with Orders table—10-100x slower than single-shard operations). Solution: denormalize, application joins, or co-locate related data. Distributed transactions problem illustrated with 2-Phase Commit (Coordinator sends prepare to Shard A and Shard B, waits for responses, then commit/rollback). 2PC is slow with availability trade-offs. Solution: Saga pattern, eventual consistency. Rebalancing strategies: Automatic (Cassandra, CockroachDB), Manual (DBA-controlled), Consistent Hashing (minimal movement), Virtual Nodes (better distribution). Key takeaway: sharding introduces complexity—design to minimize cross-shard operations."
          alt="Sharding challenges and solutions"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Cross-Shard Operations &amp; Rebalancing</h2>

        <h3>Cross-Shard Joins</h3>
        <p>
          Cross-shard joins (joining tables on different shards) are the primary challenge of
          sharding. A query like <code className="inline-code">SELECT * FROM users JOIN orders ON users.id = orders.user_id</code> requires network calls between shards if users and orders are on different shards. This is 10-100x slower than single-shard joins due to network overhead, parallel coordination, and result merging.
        </p>

        <p>
          At scale, cross-shard joins become bottlenecks. A single slow join can consume
          resources across multiple shards, affecting overall throughput. Many sharded databases
          limit or don't support cross-shard joins.
        </p>

        <p>
          Mitigation strategies: <strong>Denormalization</strong>—duplicate data to avoid joins
          (store user name in orders table). <strong>Co-location</strong>—ensure related data
          is on same shard ( shard by user_id so users and their orders are together).
          <strong>Application-side joins</strong>—fetch from multiple shards and join in
          application code (more control, but more complex). <strong>Materialized views</strong>—
          pre-compute common joins.
        </p>

        <h3>Distributed Transactions</h3>
        <p>
          Transactions spanning multiple shards are complex and slow. Traditional ACID
          transactions require two-phase commit (2PC): Phase 1 (prepare)—coordinator asks all
          shards if they can commit; Phase 2 (commit/rollback)—if all say yes, commit; otherwise
          rollback. This has high latency (multiple round trips) and availability trade-offs
          (if coordinator fails, participants are blocked).
        </p>

        <p>
          Many sharded databases limit or don't support distributed transactions. Strategies
          for handling transactions: <strong>Design to avoid</strong>—structure data so
          transactions stay within shards (all order data in same shard by order_id).
          <strong>Eventual consistency</strong>—accept temporary inconsistency, reconcile
          asynchronously. <strong>Saga pattern</strong>—break transaction into steps with
          compensating actions for rollback. <strong>Distributed transaction coordinators</strong>—
          use tools like Atomikos or database-native solutions (Spanner, CockroachDB support
          distributed transactions with performance cost).
        </p>

        <h3>Rebalancing</h3>
        <p>
          As data grows or shards are added/removed, data must be redistributed (<strong>rebalancing</strong>). This is essential for maintaining even distribution and preventing hot spots. Rebalancing is expensive (data movement consumes network and I/O) and must be done carefully.
        </p>

        <p>
          Rebalancing approaches: <strong>Automatic rebalancing</strong> (distributed databases
          like Cassandra automatically rebalance when nodes are added/removed using consistent
          hashing), <strong>Manual rebalancing</strong> (DBA moves data manually—more control
          but labor-intensive), <strong>Range splitting</strong> (split large ranges into
          smaller ranges, move to new shards), <strong>Hash bucket adjustment</strong> (change
          number of hash buckets, move data accordingly).
        </p>

        <p>
          Best practices: rebalance during low-traffic periods, move data incrementally (not
          all at once), monitor rebalancing progress, ensure application can handle data
          movement (queries may temporarily hit wrong shard). Use consistent hashing to
          minimize data movement during rebalancing.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sharding-use-cases.svg`}
          caption="Figure 3: Sharding Use Cases and Implementation. Primary use cases: Write Scaling (single node write bottleneck, distribute writes across shards, linear write throughput scaling, social media posts/IoT telemetry/event logs/clickstreams), Storage Scaling (single node storage limit, tables more than 100M rows, index bloat issues, slow maintenance operations, archive old data separately), Geographic Distribution (data locality for latency, compliance like GDPR/data residency, regional shards like us-east/eu-west, disaster recovery, regional failover). Implementation Checklist: Choose Shard Key (high cardinality, aligned with queries), Routing Layer (proxy or application logic), Monitoring (shard size, hot spots), Rebalancing (automated or manual). Anti-patterns: premature sharding (start with single node), poor shard key (causes hot spots), ignoring cross-shard operations, no monitoring/rebalancing strategy."
          alt="Sharding use cases and implementation"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Sharding vs Alternatives</h2>

        <p>
          Sharding is one of several scaling strategies. Understanding the trade-offs helps
          you choose the right approach—or combine multiple strategies.
        </p>

        <h3>Sharding Strengths</h3>
        <p>
          <strong>Write scaling</strong> is the primary advantage. Sharding distributes writes
          across shards, enabling linear write throughput scaling. Add more shards for more
          write capacity. This is essential for write-heavy workloads (social media posts,
          IoT telemetry, event logs).
        </p>

        <p>
          <strong>Storage scaling</strong> enables databases to exceed single-machine storage
          limits. Each shard stores a subset of data. Total storage scales with number of
          shards. This is essential for large datasets (hundreds of millions to billions of
          rows).
        </p>

        <p>
          <strong>Geographic distribution</strong> enables data locality. Shard by region
          (us-east, eu-west, ap-south) to place data near users. This reduces latency and
          meets compliance requirements (GDPR data residency).
        </p>

        <p>
          <strong>Isolation</strong> enables multi-tenant architectures. Each tenant can have
          dedicated shards (data isolation, compliance, noisy neighbor prevention). Tenants
          can be migrated independently.
        </p>

        <h3>Sharding Limitations</h3>
        <p>
          <strong>Cross-shard operations</strong> are slow and complex. Cross-shard joins and
          distributed transactions require coordination across shards. At scale, these
          operations may timeout or fail. Applications must be designed to minimize
          cross-shard operations.
        </p>

        <p>
          <strong>Operational complexity</strong> increases significantly. Sharding requires
          routing layers, monitoring, rebalancing, backup/restore across shards, and schema
          change coordination. Requires specialized expertise.
        </p>

        <p>
          <strong>Shard key immutability</strong>—changing shard keys is expensive (requires
          moving data between shards). Choosing the wrong shard key can be catastrophic and
          hard to fix.
        </p>

        <p>
          <strong>Query complexity</strong>—applications must be aware of sharding. Queries
          must include shard key for efficiency. Cross-shard queries require special handling.
        </p>

        <h3>Sharding vs Read Replicas</h3>
        <p>
          <strong>Read replicas</strong> copy data from primary to replicas for read scaling.
          Writes still hit primary (no write scaling). Replicas serve reads (read scaling,
          availability). Use read replicas for read-heavy workloads where writes fit on
          single primary.
        </p>

        <p>
          <strong>Sharding</strong> distributes both reads and writes across shards. Each
          shard handles its own reads and writes. Use sharding for write-heavy workloads or
          when storage exceeds single-node limits.
        </p>

        <p>
          <strong>Combined approach</strong> is common: shard for write scaling, replicate
          each shard for read scaling and availability. Example: shard by user_id, each
          shard has 3 replicas for redundancy.
        </p>

        <h3>When to Use Sharding</h3>
        <p>
          Use sharding for: <strong>Write scaling</strong> (single node write bottleneck),
          <strong>Storage scaling</strong> (tables more than 100M rows, single node can't hold all
          data), <strong>Geographic distribution</strong> (data locality for latency/compliance),
          <strong>Multi-tenant isolation</strong> (tenant-per-shard), <strong>High-throughput
          workloads</strong> (IoT telemetry, social media, event logs).
        </p>

        <p>
          Avoid sharding for: <strong>Small datasets</strong> (less than 10M rows, premature
          optimization), <strong>Read-heavy workloads</strong> (use read replicas instead),
          <strong>Frequent cross-shard operations</strong> (redesign data model),
          <strong>Complex transactions</strong> (use single-node or distributed transaction
          database), <strong>Limited operational expertise</strong> (sharding requires
          specialized knowledge).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Sharding</h2>

        <p>
          <strong>Start with single node.</strong> Don't shard prematurely. Modern databases
          handle millions of rows on single nodes. Shard when you hit limits (storage, write
          throughput), not before. Use read replicas for read scaling first.
        </p>

        <p>
          <strong>Choose shard key carefully.</strong> This is the most critical decision.
          Analyze query patterns: what fields are in WHERE clauses? Choose high-cardinality,
          evenly-distributed fields. Avoid monotonically increasing values (timestamps,
          auto-increment IDs). Test with production-like data before committing.
        </p>

        <p>
          <strong>Design for query patterns.</strong> Structure shards so common queries hit
          single shards. Co-locate related data (users and their orders on same shard).
          Denormalize if needed (duplicate data by query pattern). Accept that some queries
          will be cross-shard (optimize for common case).
        </p>

        <p>
          <strong>Implement routing layer.</strong> Use a proxy (Vitess, ProxySQL) or
          application-level routing to direct queries to correct shards. The routing layer
          must know shard key → shard mapping. Keep routing logic simple and well-tested.
        </p>

        <p>
          <strong>Monitor shard health.</strong> Track shard size distribution, query latency
          by shard, write throughput by shard. Alert on hot spots (one shard handling
          disproportionate load). Monitor rebalancing progress.
        </p>

        <p>
          <strong>Plan for rebalancing.</strong> Data distribution will become uneven over
          time. Use consistent hashing (minimizes data movement) or automatic rebalancing
          (distributed databases). Schedule rebalancing during low-traffic periods.
        </p>

        <p>
          <strong>Test failure scenarios.</strong> Shard failures affect subset of data.
          Test: what happens when a shard goes down? Can the application degrade gracefully?
          Implement retry logic, circuit breakers, and fallbacks.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Premature sharding.</strong> Sharding before hitting limits adds complexity
          without benefit. Solution: Start with single node, monitor metrics, shard when you
          hit limits (storage more than 80% full, write latency increasing, queries slowing down).
        </p>

        <p>
          <strong>Poor shard key selection.</strong> Choosing low-cardinality or skewed keys
          causes hot spots (one shard overloaded). Solution: Analyze data distribution before
          choosing, test with production-like data, monitor shard sizes after deployment.
        </p>

        <p>
          <strong>Ignoring cross-shard operation cost.</strong> Cross-shard joins and
          transactions are 10-100x slower. Solution: Design data model to minimize cross-shard
          operations, use denormalization, implement application-side joins, alert on
          cross-shard queries.
        </p>

        <p>
          <strong>No rebalancing strategy.</strong> Shards become uneven over time. Solution:
          Use automatic rebalancing (distributed databases), schedule manual rebalancing,
          monitor shard size distribution.
        </p>

        <p>
          <strong>Assuming ACID transactions work.</strong> Cross-shard transactions are
          limited or unsupported. Solution: Design to avoid cross-shard transactions, use
          eventual consistency, implement saga pattern for multi-step operations.
        </p>

        <p>
          <strong>Not testing at scale.</strong> Sharding behavior changes at scale. Solution:
          Test with production-like data volumes, simulate shard failures, test rebalancing,
          validate query performance at scale.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Social Media (Twitter, Instagram)</h3>
        <p>
          Social media platforms shard by user_id (tweets by author_id, posts by user_id).
          High-volume users may have dedicated shards. Benefits: write scaling (each shard
          handles its users' posts), query efficiency (user timeline hits single shard),
          isolation (influencer load doesn't affect regular users).
        </p>

        <p>
          This pattern works because social media queries are user-centric (fetch user's
          posts, user's followers). Cross-shard queries (global search) use separate search
          infrastructure (Elasticsearch).
        </p>

        <h3>E-Commerce (Shopify, Amazon)</h3>
        <p>
          E-commerce platforms shard by shop_id (Shopify) or customer_id (Amazon). Each
          tenant's data is isolated in dedicated shards. Benefits: data isolation (security,
          compliance), noisy neighbor prevention (one shop's load doesn't affect others),
          easy tenant migration (move shard to different server), simplified deletion (drop
          shard for churned tenants).
        </p>

        <p>
          This pattern works because e-commerce queries are typically tenant-scoped (all
          queries include shop_id in WHERE clause). Cross-tenant queries are rare (admin
          dashboards can use separate analytics database).
        </p>

        <h3>IoT Platforms (Tesla, Industrial IoT)</h3>
        <p>
          IoT platforms shard by device_id or region. Each shard handles telemetry from its
          devices. Benefits: write scaling (millions of devices reporting simultaneously),
          geographic distribution (data near devices for low latency), natural data lifecycle
          (archive old data by time ranges).
        </p>

        <p>
          This pattern works because IoT queries are typically device-scoped or time-bounded
          (last hour of data from device X). Partition pruning ensures queries hit only
          relevant shards.
        </p>

        <h3>Financial Services (Stripe, PayPal)</h3>
        <p>
          Financial platforms shard by account_id or region. Each shard handles transactions
          for its accounts. Benefits: write scaling (high transaction volume), compliance
          (data residency requirements), isolation (account data separated), disaster recovery
          (regional failures isolated).
        </p>

        <p>
          This pattern works because financial queries are account-centric (fetch account
          transactions, account balance). Cross-account queries (aggregations) use separate
          analytics database.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you shard a database? What are the signs that sharding is needed?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Shard when you hit single-node limits. Signs: (1)
              Storage—database approaching disk capacity, (2) Write throughput—write latency
              increasing, write queue building up, (3) Query performance—queries slowing down
              despite indexing, (4) Maintenance—backups/vacuum taking too long, (5) Geographic
              requirements—need data locality for latency/compliance. Don't shard prematurely:
              modern databases handle millions of rows on single nodes. Shard when metrics
              show limits, not based on arbitrary row counts. Start with read replicas and
              query optimization before sharding.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the first step before sharding? Answer:
              Analyze query patterns. Identify most common queries, ensure they can be served
              by single shards. Choose shard key that aligns with query patterns. Test
              sharding strategy with production-like data before deploying.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Compare hash-based vs range-based sharding. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Hash-based sharding: shard = hash(key) % num_shards.
              Pros: even distribution (prevents hot spots), simple to implement. Cons: range
              queries inefficient (must query all shards), rebalancing expensive (changing
              num_shards moves most data). Use for: uniform access patterns, write-heavy
              workloads. Range-based sharding: partition by value ranges (1-100K, 100K-200K).
              Pros: range queries efficient (hit only relevant shards), natural for time-series.
              Cons: uneven distribution risk (skewed data causes hot spots), manual rebalancing
              may be needed. Use for: time-series data, ordered data, range query workloads.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is consistent hashing? Answer: Maps both shards
              and keys to hash ring. Keys assigned to clockwise shard. Adding/removing shards
              affects only neighbors—minimizes data movement. Essential for elastic scaling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are cross-shard operations? Why are they problematic and how do you
              mitigate them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cross-shard operations span multiple shards: joins
              (joining tables on different shards), transactions (ACID across shards),
              aggregations (SUM/COUNT across shards). Problems: (1) Slow—10-100x slower than
              single-shard operations due to network overhead, parallel coordination, result
              merging. (2) Resource-intensive—consumes resources across all shards. (3) May
              timeout/fail at scale. Mitigation: (1) Denormalization—duplicate data by query
              pattern (store user data in both user_id-sharded and country-sharded tables).
              (2) Co-location—ensure related data is on same shard (shard by user_id so users
              and orders are together). (3) Application joins—fetch from multiple shards and
              join in application code. (4) Materialized views—pre-compute common cross-shard
              operations.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When are cross-shard operations acceptable? Answer:
              For infrequent queries (admin dashboards, analytics), batch jobs (overnight
              reports), or when no alternative exists. Avoid for user-facing, latency-sensitive
              queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you handle rebalancing? What are the challenges?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Rebalancing redistributes data to achieve even shard
              distribution. Challenges: (1) Data movement consumes network and I/O, (2) Queries
              may hit wrong shard during movement, (3) Can cause temporary performance
              degradation. Approaches: (1) Automatic rebalancing (Cassandra, CockroachDB move
              data automatically when nodes added/removed using consistent hashing). (2) Manual
              rebalancing (DBA moves shards—more control but labor-intensive). (3) Range
              splitting (split large ranges into smaller ranges, move to new shards). (4) Hash
              bucket adjustment (change number of hash buckets, move data accordingly). Best
              practices: rebalance during low-traffic periods, move data incrementally (not
              all at once), monitor progress, ensure application can handle data movement
              (retry logic, circuit breakers).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you know when to rebalance? Answer: Monitor
              shard size distribution. Alert when largest shard is 2-3x larger than smallest.
              Also monitor query latency by shard—hot shards show higher latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you handle distributed transactions across shards?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Distributed transactions are complex and slow. Options:
              (1) Avoid—design data model so transactions stay within shards (all order data
              in same shard by order_id). (2) Eventual consistency—accept temporary
              inconsistency, reconcile asynchronously (order created, inventory updated
              eventually). (3) Saga pattern—break transaction into steps with compensating
              actions for rollback (create order → reserve inventory → charge payment; if
              charge fails, release inventory, cancel order). (4) Distributed transaction
              coordinators—use tools like Atomikos or database-native solutions (Spanner,
              CockroachDB support distributed transactions with performance cost). Best
              practice: design to avoid distributed transactions when possible.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is two-phase commit? Answer: 2PC ensures atomic
              commits across shards: Phase 1 (prepare)—coordinator asks all shards if they
              can commit, Phase 2 (commit/rollback)—if all say yes, commit; otherwise
              rollback. Problem: slow (multiple round trips), availability trade-off (if
              coordinator fails, participants are blocked).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your sharded database has a hot spot (one shard handling 80% of traffic).
              How do you diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check shard size distribution—is one
              shard much larger? (2) Check query patterns—are queries concentrated on one
              shard key value? (3) Check shard key—is it skewed (e.g., timestamp causing hot
              spot on current time)? (4) Check application—is there a bug causing concentrated
              traffic? Fix: (1) Short-term—add read replicas for hot shard, implement caching.
              (2) Medium-term—redesign shard key (if possible), split hot shard into smaller
              shards. (3) Long-term—redesign data model to distribute traffic evenly.
              Prevention: analyze data distribution before choosing shard key, monitor shard
              metrics, alert on skew.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if shard key is timestamp? Answer: Classic
              problem—current time is hot spot. Solutions: (1) Add randomness (hash(timestamp +
              random_salt) % num_shards), (2) Use composite key (timestamp + user_id), (3)
              Pre-partition by time ranges (one shard per day, future shards created in
              advance).
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
            Chapters 5-6.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapters 11-12.
          </li>
          <li>
            Cassandra Documentation, "Data Modeling," "Partitioning,"
            https://cassandra.apache.org/doc/
          </li>
          <li>
            CockroachDB Documentation, "Partitioning," "Sharding,"
            https://www.cockroachlabs.com/docs/
          </li>
          <li>
            MongoDB Documentation, "Sharding," "Partitioning,"
            https://www.mongodb.com/docs/
          </li>
          <li>
            Vitess Documentation, "Sharding,"
            https://vitess.io/docs/
          </li>
          <li>
            Citus Documentation, "Sharding,"
            https://www.citusdata.com/
          </li>
          <li>
            Google Spanner Documentation, "Data Model," "Partitioning,"
            https://cloud.google.com/spanner/docs
          </li>
          <li>
            Shopify Engineering Blog, "Scaling MySQL at Shopify,"
            https://shopify.engineering/
          </li>
          <li>
            Twitter Engineering Blog, "Tweet Storage at Scale,"
            https://blog.twitter.com/engineering
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
