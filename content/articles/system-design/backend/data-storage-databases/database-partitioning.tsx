"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-partitioning-complete",
  title: "Database Partitioning",
  description:
    "Comprehensive guide to database partitioning: horizontal vs vertical partitioning, shard key selection, cross-partition queries, and strategies for scaling databases horizontally.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-partitioning",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "partitioning", "scaling", "distributed-systems"],
  relatedTopics: [
    "sharding-strategies",
    "read-replicas",
    "database-indexes",
    "concurrency-control",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Database Partitioning</h1>
        <p className="lead">
          Database partitioning is the practice of splitting a large database into smaller, more
          manageable pieces called partitions. Each partition contains a subset of the data and
          can be stored on different servers, enabling horizontal scaling. Unlike replication
          (copying data for redundancy), partitioning distributes data (each piece exists in one
          place). This enables databases to scale beyond single-machine limits for storage,
          write throughput, and query performance.
        </p>

        <p>
          Consider a user table that has grown to 100 million rows. Queries are slowing down,
          indexes are bloated, and backup operations take hours. A single server can't handle
          the load. Partitioning splits the table by user_id ranges: users 1-500K on server A,
          500K-1M on server B, and so on. Each partition is smaller, faster, and can be scaled
          independently. Queries for specific users hit only one partition (fast). The database
          can now scale horizontally by adding more partitions.
        </p>

        <p>
          Partitioning is fundamental to distributed databases (Cassandra, CockroachDB, Spanner)
          and is used by high-scale applications (Twitter partitions tweets by user_id, Shopify
          partitions orders by shop_id). The alternative—vertical scaling (bigger servers)—has
          hard limits and exponential costs. Partitioning enables linear scaling: add more
          partitions for more capacity.
        </p>

        <p>
          This article provides a comprehensive examination of database partitioning: partitioning
          strategies (horizontal vs vertical, range vs hash), shard key selection (the most
          critical design decision), cross-partition query challenges and mitigations, rebalancing
          strategies, and real-world use cases. We'll explore when partitioning excels (large
          tables, high write throughput, multi-tenant isolation) and when it introduces complexity
          (cross-partition queries, distributed transactions). We'll also cover common pitfalls
          (poor shard key selection, premature partitioning) and best practices for production
          deployments.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/partitioning-strategies.svg`}
          caption="Figure 1: Database Partitioning Strategies showing horizontal partitioning (sharding) where rows are distributed across shards (Original Table with 1M rows → Shard 1 with user_id 1-500K, Shard 2 with user_id 500K-1M). Each shard has same schema, rows distributed by shard key, queries routed by shard key. Vertical partitioning splits columns by access pattern (Original wide table with 50+ columns → Core Table with frequently accessed columns like id/name/email, Extended Table with rarely accessed columns like preferences/settings). Partitioning methods: Range-Based (by value ranges A-M/N-Z), Hash-Based (hash(key) % num_shards), List-Based (by explicit values like region), Composite (multiple keys). Key characteristics: distributes data across nodes, enables horizontal scaling, improves query performance, requires careful shard key selection."
          alt="Database partitioning strategies"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Horizontal vs Vertical Partitioning</h2>

        <h3>Horizontal Partitioning (Sharding)</h3>
        <p>
          <strong>Horizontal partitioning</strong> splits tables by rows. Each partition has the
          same schema but contains different rows. This is also called <strong>sharding</strong>.
          Example: A users table partitioned by user_id ranges—partition 1 has users 1-100K,
          partition 2 has users 100K-200K. Each partition is a complete, independent table.
        </p>

        <p>
          Horizontal partitioning enables <strong>horizontal scaling</strong>: add more partitions
          (servers) to handle more data and throughput. This is essential for high-growth
          applications. However, it introduces complexity: queries spanning multiple partitions
          (cross-partition queries) are slow, and distributed transactions are limited.
        </p>

        <p>
          Common horizontal partitioning strategies: <strong>Range-based</strong> (partition by
          value ranges: user_id 1-100K, 100K-200K), <strong>Hash-based</strong> (partition by
          hash of key: hash(user_id) % num_partitions), <strong>List-based</strong> (partition
          by explicit values: users by country/region), and <strong>Composite</strong> (combine
          multiple strategies: hash by user_id, then range by date).
        </p>

        <h3>Vertical Partitioning</h3>
        <p>
          <strong>Vertical partitioning</strong> splits tables by columns. Different columns are
          stored in different partitions. Example: A users table split into core columns
          (id, name, email—frequently accessed) and extended columns (preferences, settings,
          bio—rarely accessed). Each partition has different columns but the same rows (linked
          by primary key).
        </p>

        <p>
          Vertical partitioning optimizes for <strong>access patterns</strong>. Frequently
          accessed columns are stored together (fast queries, better cache utilization).
          Rarely accessed columns are stored separately (loaded on demand, reduced I/O). This
          is essential for wide tables (50+ columns) where queries typically access only a
          subset of columns.
        </p>

        <p>
          Vertical partitioning is simpler than horizontal partitioning (no cross-partition
          queries for typical workloads) but doesn't enable horizontal scaling (all partitions
          typically on same server). It's often a precursor to horizontal partitioning: first
          vertically partition to optimize queries, then horizontally partition to scale.
        </p>

        <h3>Partition Keys and Shard Keys</h3>
        <p>
          The <strong>partition key</strong> (or <strong>shard key</strong>) determines how
          data is distributed across partitions. This is the most critical design decision in
          partitioning. A good shard key enables efficient queries and even distribution. A
          poor shard key causes hot spots (one partition overloaded) and cross-partition
          queries (slow).
        </p>

        <p>
          Shard key selection criteria: <strong>High cardinality</strong> (many unique values
          for even distribution), <strong>Even distribution</strong> (values spread uniformly,
          no skew), <strong>Query alignment</strong> (most queries include the shard key),
          <strong>Immutable</strong> (don't change after creation—moving data between
          partitions is expensive).
        </p>

        <p>
          Common shard keys: user_id (high cardinality, aligns with user-centric queries),
          tenant_id (for multi-tenant SaaS), order_id (for e-commerce), device_id (for IoT).
          Avoid: status (low cardinality, skewed distribution), timestamp (monotonically
          increasing causes hot spots), boolean values (only 2 values).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/partitioning-shard-keys.svg`}
          caption="Figure 2: Shard Key Selection & Cross-Partition Queries showing good shard keys (high cardinality, even distribution, query patterns align, examples: user_id, tenant_id) vs bad shard keys (low cardinality, skewed distribution, monotonically increasing, examples: status, timestamp). Cross-partition query problem illustrated: Query for users with id IN (500, 1500) requires querying both Shard A (users 1-1000) and Shard B (users 1001-2000), requiring network calls between shards. Cross-partition queries are 10-100x slower than single-partition queries. Mitigation strategies: Denormalization (duplicate data by query pattern), Materialized Views (pre-computed results), Application Joins (join in application code), Query Routing (smart routing layer). Key takeaway: Shard key choice is critical and hard to change—design for most common query patterns, avoid cross-partition queries when possible."
          alt="Shard key selection and cross-partition queries"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Cross-Partition Queries &amp; Rebalancing</h2>

        <h3>Cross-Partition Query Challenge</h3>
        <p>
          Cross-partition queries (queries that span multiple partitions) are the primary
          challenge of partitioning. A query like <code className="inline-code">SELECT * FROM users WHERE country = 'US'</code> may need to scan all partitions if country isn't the shard key. This is 10-100x slower than single-partition queries due to network overhead, parallel query coordination, and result merging.
        </p>

        <p>
          Cross-partition queries become bottlenecks at scale. A single slow query can consume
          resources across all partitions, affecting overall throughput. At extreme scale,
          cross-partition queries may timeout or fail entirely.
        </p>

        <p>
          Mitigation strategies: <strong>Denormalization</strong>—duplicate data by query pattern
          (store user data in both user_id-partitioned and country-partitioned tables).
          <strong>Materialized views</strong>—pre-compute common cross-partition queries.
          <strong>Application-side joins</strong>—fetch from multiple partitions and join in
          application code (more control, but more complex). <strong>Query routing</strong>—use
          a routing layer (proxy) that knows which partitions to query.
        </p>

        <h3>Rebalancing Strategies</h3>
        <p>
          As data grows, partitions become uneven (some partitions have more data/traffic than
          others). <strong>Rebalancing</strong> redistributes data to achieve even distribution.
          This is essential for maintaining performance and preventing hot spots.
        </p>

        <p>
          Rebalancing approaches: <strong>Automatic rebalancing</strong> (distributed databases
          like Cassandra automatically rebalance when nodes are added/removed),
          <strong>Manual rebalancing</strong> (DBA moves partitions manually—more control but
          labor-intensive), <strong>Hash-based rebalancing</strong> (change number of hash
          buckets, move data accordingly), <strong>Range-based rebalancing</strong> (split
          large ranges, merge small ranges).
        </p>

        <p>
          Rebalancing is expensive (data movement consumes network and I/O). Best practices:
          rebalance during low-traffic periods, move data incrementally (not all at once),
          monitor rebalancing progress, and ensure application can handle data movement
          (queries may temporarily hit wrong partition).
        </p>

        <h3>Distributed Transactions</h3>
        <p>
          Transactions spanning multiple partitions are complex and slow. Traditional ACID
          transactions require two-phase commit (2PC), which has high latency and availability
          trade-offs. Many partitioned databases limit or don't support cross-partition
          transactions.
        </p>

        <p>
          Strategies for handling transactions: <strong>Design to avoid</strong>—structure
          data so transactions stay within partitions (e.g., all order data in same partition
          by order_id). <strong>Eventual consistency</strong>—accept temporary inconsistency,
          reconcile asynchronously. <strong>Saga pattern</strong>—break transaction into
          steps with compensating actions for rollback. <strong>Distributed transaction
          coordinators</strong>—use tools like Atomikos or database-native solutions (Spanner,
          CockroachDB support distributed transactions with performance cost).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/partitioning-use-cases.svg`}
          caption="Figure 3: Partitioning Use Cases and Trade-offs. Primary use cases: Large Tables (tables more than 10M rows, index bloat issues, slow maintenance ops, partition by date/ID, faster queries and backups), High Write Throughput (write bottleneck on single node, distribute writes across nodes, IoT telemetry/logs/event streams, linear write scaling), Multi-Tenant Isolation (tenant-per-partition, data isolation, compliance like GDPR, noisy neighbor prevention, easy tenant migration). Trade-offs: Benefits (horizontal scale), Complexity (cross-partition queries), Rebalancing (data redistribution), Transactions (limited cross-partition). Anti-patterns: premature partitioning (start with single node), poor shard key selection (causes hot spots), ignoring cross-partition query cost, no rebalancing strategy. Best for: large tables, high write throughput, multi-tenant isolation, geographic distribution, compliance requirements."
          alt="Partitioning use cases and trade-offs"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Partitioning vs Replication</h2>

        <p>
          Partitioning and replication are both scaling strategies, but they solve different
          problems. Understanding the trade-offs helps you choose the right approach—or combine
          both.
        </p>

        <h3>Partitioning Strengths</h3>
        <p>
          <strong>Horizontal scaling</strong> is the primary advantage. Partitioning enables
          databases to scale beyond single-machine limits. Add more partitions for more storage
          and write throughput. This is essential for high-growth applications (millions to
          billions of rows).
        </p>

        <p>
          <strong>Write throughput</strong> scales linearly with partitions. Each partition
          handles writes independently. This is essential for write-heavy workloads (IoT
          telemetry, event logs, social media posts).
        </p>

        <p>
          <strong>Query performance</strong> improves for partition-pruned queries. Queries
          that include the shard key hit only one partition (fast). Large tables become
          manageable (smaller indexes, faster scans).
        </p>

        <p>
          <strong>Isolation</strong> enables multi-tenant architectures. Each tenant can have
          dedicated partitions (data isolation, compliance, noisy neighbor prevention).
          Tenants can be migrated independently.
        </p>

        <h3>Partitioning Limitations</h3>
        <p>
          <strong>Cross-partition queries</strong> are slow and complex. Queries spanning
          multiple partitions require coordination, network calls, and result merging. At
          scale, these queries may timeout or fail.
        </p>

        <p>
          <strong>Distributed transactions</strong> are limited or unsupported. ACID transactions
          across partitions require two-phase commit (slow, availability trade-offs). Many
          applications must redesign to avoid cross-partition transactions.
        </p>

        <p>
          <strong>Operational complexity</strong> increases significantly. Rebalancing,
          monitoring, backup/restore, and schema changes all become more complex. Requires
          specialized expertise.
        </p>

        <p>
          <strong>Shard key immutability</strong>—changing shard keys is expensive (requires
          moving data between partitions). Choosing the wrong shard key can be catastrophic
          and hard to fix.
        </p>

        <h3>Partitioning vs Replication</h3>
        <p>
          <strong>Replication</strong> copies data to multiple nodes for read scaling and
          availability. Writes go to primary, replicas serve reads. Replication doesn't
          increase storage capacity or write throughput (all writes still hit primary).
        </p>

        <p>
          <strong>Partitioning</strong> distributes data across nodes for write scaling and
          storage capacity. Each partition handles its own reads and writes. Partitioning
          doesn't improve availability (single partition failure affects subset of data).
        </p>

        <p>
          <strong>Combined approach</strong> is common: partition for write scaling, replicate
          each partition for read scaling and availability. Example: Cassandra partitions data
          across nodes, each partition replicated 3x.
        </p>

        <h3>When to Use Partitioning</h3>
        <p>
          Use partitioning for: <strong>Large tables</strong> (more than 10M rows, slow queries),
          <strong>High write throughput</strong> (single node bottleneck),
          <strong>Multi-tenant isolation</strong> (tenant-per-partition),
          <strong>Geographic distribution</strong> (data locality for latency/compliance),
          <strong>Storage limits</strong> (single node can't hold all data).
        </p>

        <p>
          Avoid partitioning for: <strong>Small datasets</strong> (less than 1M rows, premature
          optimization), <strong>Read-heavy workloads</strong> (use replication instead),
          <strong>Frequent cross-partition queries</strong> (redesign data model),
          <strong>Complex transactions</strong> (use single-node or distributed transaction
          database).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Database Partitioning</h2>

        <p>
          <strong>Start with single node.</strong> Don't partition prematurely. Modern databases
          handle millions of rows on single nodes. Partition when you hit limits (storage,
          write throughput, query performance), not before.
        </p>

        <p>
          <strong>Choose shard key carefully.</strong> This is the most critical decision.
          Analyze query patterns: what fields are in WHERE clauses? Choose high-cardinality,
          evenly-distributed fields. Avoid monotonically increasing values (timestamps,
          auto-increment IDs).
        </p>

        <p>
          <strong>Design for query patterns.</strong> Structure partitions so common queries
          hit single partitions. Denormalize if needed (duplicate data by query pattern).
          Accept that some queries will be cross-partition (optimize for common case).
        </p>

        <p>
          <strong>Plan for rebalancing.</strong> Data distribution will become uneven over
          time. Use hash-based partitioning (easier to rebalance) or range-based with
          automatic splitting. Monitor partition sizes and rebalance before hot spots
          cause issues.
        </p>

        <p>
          <strong>Implement partition pruning.</strong> Ensure queries include the shard key
          (partition pruning). Use query analyzers to detect cross-partition queries. Alert
          on queries that scan all partitions.
        </p>

        <p>
          <strong>Test failure scenarios.</strong> Partition failures affect subset of data.
          Test: what happens when a partition goes down? Can the application degrade gracefully?
          Implement retry logic, circuit breakers, and fallbacks.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Premature partitioning.</strong> Partitioning before hitting limits adds
          complexity without benefit. Solution: Start with single node, monitor metrics,
          partition when you hit limits (storage more than 80% full, write latency increasing, queries
          slowing down).
        </p>

        <p>
          <strong>Poor shard key selection.</strong> Choosing low-cardinality or skewed keys
          causes hot spots (one partition overloaded). Solution: Analyze data distribution
          before choosing, test with production-like data, monitor partition sizes after
          deployment.
        </p>

        <p>
          <strong>Ignoring cross-partition query cost.</strong> Cross-partition queries are
          10-100x slower. Solution: Design data model to minimize cross-partition queries,
          use denormalization, implement query routing, alert on cross-partition queries.
        </p>

        <p>
          <strong>No rebalancing strategy.</strong> Partitions become uneven over time.
          Solution: Use automatic rebalancing (distributed databases), schedule manual
          rebalancing, monitor partition size distribution.
        </p>

        <p>
          <strong>Assuming ACID transactions work.</strong> Cross-partition transactions are
          limited or unsupported. Solution: Design to avoid cross-partition transactions,
          use eventual consistency, implement saga pattern for multi-step operations.
        </p>

        <p>
          <strong>Not testing at scale.</strong> Partitioning behavior changes at scale.
          Solution: Test with production-like data volumes, simulate partition failures,
          test rebalancing, validate query performance at scale.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Multi-Tenant SaaS (Shopify, Salesforce)</h3>
        <p>
          Multi-tenant SaaS platforms partition by tenant_id (shop_id for Shopify, org_id for
          Salesforce). Each tenant's data is isolated in dedicated partitions. Benefits: data
          isolation (security, compliance), noisy neighbor prevention (one tenant's load doesn't
          affect others), easy tenant migration (move partition to different server), simplified
          deletion (drop partition for churned tenants).
        </p>

        <p>
          This pattern works because SaaS queries are typically tenant-scoped (all queries
          include tenant_id in WHERE clause). Cross-tenant queries are rare (admin dashboards
          can use separate analytics database).
        </p>

        <h3>Time-Series Data (IoT, Monitoring)</h3>
        <p>
          Time-series data (IoT telemetry, application metrics) is partitioned by time ranges
          (one partition per day/week/month). Old partitions are archived or deleted. Benefits:
          fast recent queries (hot partitions), efficient archival (drop old partitions),
          natural data lifecycle.
        </p>

        <p>
          This pattern works because time-series queries are typically time-bounded (last hour,
          last day). Partition pruning ensures queries hit only relevant partitions.
        </p>

        <h3>Geographic Distribution (Global Applications)</h3>
        <p>
          Global applications partition by region (us-east, eu-west, ap-south). Users are
          routed to their regional partition. Benefits: low latency (data near users),
          compliance (data residency requirements), disaster recovery (regional failures
          isolated).
        </p>

        <p>
          This pattern works because users typically access their own data (regional partition).
          Cross-region queries (global analytics) use separate analytics database.
        </p>

        <h3>Social Media (Twitter, Instagram)</h3>
        <p>
          Social media platforms partition by user_id (tweets by author_id, posts by user_id).
          High-volume users may have dedicated partitions. Benefits: write scaling (each
          partition handles its users' writes), query efficiency (user timeline hits single
          partition), isolation (influencer load doesn't affect regular users).
        </p>

        <p>
          This pattern works because social media queries are user-centric (fetch user's posts,
          user's followers). Cross-partition queries (global search) use separate search
          infrastructure (Elasticsearch).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you partition a database? What are the signs that partitioning is
              needed?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Partition when you hit single-node limits. Signs: (1)
              Storage—database approaching disk capacity, (2) Write throughput—write latency
              increasing, write queue building up, (3) Query performance—queries slowing down
              despite indexing, (4) Maintenance—backups/vacuum taking too long, (5) Multi-tenant
              requirements—need data isolation per tenant. Don't partition prematurely: modern
              databases handle millions of rows on single nodes. Partition when metrics show
              limits, not based on arbitrary row counts. Start with read replicas and query
              optimization before partitioning.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the first step before partitioning? Answer:
              Analyze query patterns. Identify most common queries, ensure they can be served
              by single partitions. Choose shard key that aligns with query patterns. Test
              partitioning strategy with production-like data before deploying.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do you choose a shard key? What makes a good vs bad shard key?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Good shard keys have: (1) High cardinality—many unique
              values for even distribution (user_id, tenant_id), (2) Even distribution—values
              spread uniformly, no skew, (3) Query alignment—most queries include shard key in
              WHERE clause, (4) Immutability—don't change after creation (moving data between
              partitions is expensive). Bad shard keys: low cardinality (status, boolean),
              skewed distribution (country—some countries have 1000x more users), monotonically
              increasing (timestamp, auto-increment ID—causes hot spots). Example: user_id is
              good (high cardinality, aligns with user queries). Timestamp is bad (hot spot on
              current time, queries often span ranges).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you choose wrong shard key? Answer: Hard to
              fix. Options: (1) Live with it (add more partitions to dilute hot spot), (2)
              Re-partition (expensive, requires downtime or complex migration), (3) Add routing
              layer (map old keys to new partitions). Prevention is key—test shard key choice
              with production-like data before committing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are cross-partition queries? Why are they problematic and how do you
              mitigate them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cross-partition queries span multiple partitions (e.g.,
              SELECT * FROM users WHERE country = 'US' when partitioned by user_id). Problems:
              (1) Slow—10-100x slower than single-partition queries due to network overhead,
              parallel coordination, result merging. (2) Resource-intensive—consumes resources
              across all partitions. (3) May timeout/fail at scale. Mitigation: (1)
              Denormalization—duplicate data by query pattern (store user data in both
              user_id-partitioned and country-partitioned tables). (2) Materialized views—
              pre-compute common cross-partition queries. (3) Application joins—fetch from
              multiple partitions and join in application code. (4) Query routing—use proxy
              that knows which partitions to query.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When are cross-partition queries acceptable? Answer:
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
              <strong>Answer:</strong> Rebalancing redistributes data to achieve even partition
              distribution. Challenges: (1) Data movement consumes network and I/O, (2) Queries
              may hit wrong partition during movement, (3) Can cause temporary performance
              degradation. Approaches: (1) Automatic rebalancing (Cassandra, CockroachDB move
              data automatically when nodes added/removed). (2) Manual rebalancing (DBA moves
              partitions—more control but labor-intensive). (3) Incremental rebalancing (move
              data in small batches, not all at once). Best practices: rebalance during
              low-traffic periods, monitor progress, ensure application can handle data movement
              (retry logic, circuit breakers).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you know when to rebalance? Answer: Monitor
              partition size distribution. Alert when largest partition is 2-3x larger than
              smallest. Also monitor query latency by partition—hot partitions show higher
              latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you handle distributed transactions across partitions?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Distributed transactions are complex and slow. Options:
              (1) Avoid—design data model so transactions stay within partitions (all order
              data in same partition by order_id). (2) Eventual consistency—accept temporary
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
              commits across partitions: Phase 1 (prepare)—coordinator asks all partitions if
              they can commit, Phase 2 (commit/rollback)—if all say yes, commit; otherwise
              rollback. Problem: slow (multiple round trips), availability trade-off (if
              coordinator fails, participants are blocked).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your partitioned database has a hot spot (one partition handling 80% of
              traffic). How do you diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check partition size distribution—is one
              partition much larger? (2) Check query patterns—are queries concentrated on one
              shard key value? (3) Check shard key—is it skewed (e.g., timestamp causing hot
              spot on current time)? (4) Check application—is there a bug causing concentrated
              traffic? Fix: (1) Short-term—add read replicas for hot partition, implement
              caching. (2) Medium-term—redesign shard key (if possible), split hot partition
              into smaller partitions. (3) Long-term—redesign data model to distribute traffic
              evenly. Prevention: analyze data distribution before choosing shard key, monitor
              partition metrics, alert on skew.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if shard key is timestamp? Answer: Classic
              problem—current time is hot spot. Solutions: (1) Add randomness (hash(timestamp +
              random_salt) % num_partitions), (2) Use composite key (timestamp + user_id), (3)
              Pre-partition by time ranges (one partition per day, future partitions created
              in advance).
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
            PostgreSQL Documentation, "Table Partitioning,"
            https://www.postgresql.org/docs/current/ddl-partitioning.html
          </li>
          <li>
            MySQL Documentation, "Partitioning,"
            https://dev.mysql.com/doc/refman/8.0/en/partitioning.html
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
