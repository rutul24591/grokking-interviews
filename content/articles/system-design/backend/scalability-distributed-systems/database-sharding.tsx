"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-sharding",
  title: "Database Sharding",
  description:
    "Staff-level deep dive into database sharding covering shard key selection, cross-shard query patterns, rebalancing strategies, split management, and production trade-offs in horizontally partitioned data systems.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "database-sharding",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-04-04",
  tags: [
    "database sharding",
    "horizontal partitioning",
    "distributed databases",
    "shard key",
    "cross-shard queries",
    "rebalancing",
    "data migration",
  ],
  relatedTopics: [
    "consistent-hashing",
    "partitioning-strategies",
    "database-read-replicas",
    "distributed-transactions",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Database sharding</strong> is a horizontal partitioning
          strategy that distributes data across multiple independent database
          instances (called <em>shards</em>), where each shard contains a
          disjoint subset of the total dataset and operates as a fully
          self-contained database with its own tables, indexes, and query engine.
          Unlike vertical partitioning (which splits columns into separate
          tables) or replication (which copies the entire dataset to multiple
          nodes), sharding splits <em>rows</em> — each row exists on exactly one
          shard (ignoring replication for fault tolerance), and the assignment
          of rows to shards is determined by a <em>shard key</em>.
        </p>
        <p>
          The fundamental motivation for sharding is the limitation of vertical
          scaling. A single database server has finite CPU, memory, disk I/O,
          and network bandwidth. Once these resources are exhausted, the only
          option is to upgrade to a larger server — a strategy that is both
          economically exponential (larger servers cost disproportionately more)
          and physically bounded (there is a maximum server size). Sharding
          sidesteps this ceiling by distributing the load across many commodity
          servers, each handling a fraction of the total dataset. If one shard
          handles 100 GB of data and 1,000 writes per second, adding a second
          shard (by splitting the data in half) reduces each shard to 50 GB and
          approximately 500 writes per second — effectively doubling the
          system&apos;s write capacity.
        </p>
        <p>
          The term &quot;shard&quot; was popularized by the MMORPG Ultima
          Online, where the game world was split across multiple server
          instances, each called a shard. In database engineering, the concept
          predates the term — it is closely related to <em>horizontal
          partitioning</em> in relational database theory, with the key
          difference that sharding implies cross-machine distribution (partitions
          on the same server) while partitioning can be intra-server. For staff
          and principal engineers, sharding is one of the most consequential
          architectural decisions in a system&apos;s lifecycle: it introduces
          operational complexity (cross-shard queries, distributed transactions,
          rebalancing) that is difficult to undo, but it is often the only path
          to scale writes beyond what a single database node can sustain.
        </p>
        <p>
          Sharding is distinct from replication. Read replicas copy the entire
          dataset to multiple nodes to scale reads, but all writes still go to a
          single primary. Sharding scales writes by distributing them across
          independent shards, each of which can accept writes concurrently. The
          two strategies are complementary: a production system typically shards
          for write scaling and replicates within each shard for read scaling
          and fault tolerance.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          The <strong>shard key</strong> is the single most important design
          decision in a sharding architecture. It is the attribute (or composite
          of attributes) used to determine which shard a row belongs to. Every
          query that includes the shard key can be routed to a single shard
          (a <em>targeted query</em>), while queries that do not include the
          shard key must be broadcast to all shards and their results merged (
          a <em>scatter-gather query</em>). The choice of shard key therefore
          determines both the distribution of data across shards and the
          efficiency of the most common query patterns.
        </p>

        <p>
          There are four primary shard key strategies, each with distinct
          trade-offs. <strong>Range-based sharding</strong> assigns rows to
          shards based on which range the shard key falls into — for example,
          user IDs A–F on shard 0, G–M on shard 1, N–Z on shard 2. This
          strategy enables efficient range queries (e.g., &quot;find all users
          with last name between M and P&quot; hit only shard 1), but it is
          susceptible to hot spots if the data distribution is skewed — for
          example, if most users have last names starting with common letters
          like S or M, those shards will be overloaded. <strong>Hash-based
          sharding</strong> applies a hash function to the shard key and uses the
          result to determine the shard (typically <code>hash(key) % N</code>).
          This produces near-uniform distribution regardless of input patterns,
          eliminating hot spots. However, range queries become scatter-gather
          operations, as rows with adjacent key values may be on different
          shards. <strong>Directory-based sharding</strong> uses a lookup table
          (the directory) that maps each shard key value to a specific shard.
          This is the most flexible approach — the directory can assign rows
          arbitrarily, enabling load-based rebalancing without data migration
          (just update the directory entry). The trade-off is that the directory
          itself becomes a critical infrastructure component that must be highly
          available and performant. <strong>Geographic sharding</strong> assigns
          rows to shards based on the user&apos;s geographic region — US users
          on US shards, EU users on EU shards. This satisfies data sovereignty
          requirements (GDPR, CCPA) and reduces latency by serving users from
          nearby data centers, but cross-region queries become expensive.
        </p>

        <p>
          The <strong>shard router</strong> (also called a shard map, config
          server, or query router) is the component that translates a shard key
          value into a shard address. In a client-side routing model, the
          application maintains a local shard map and routes queries directly to
          the correct shard. In a server-side routing model, a dedicated proxy
          service (such as Vitess for MySQL, or Pgpool-II for PostgreSQL)
          receives queries, parses them to extract the shard key, looks up the
          target shard, forwards the query, and returns the result. Client-side
          routing eliminates a network hop but requires all clients to maintain
          synchronized shard maps. Server-side routing centralizes shard
          management but adds latency and a potential bottleneck unless the
          router itself is replicated.
        </p>

        <p>
          <strong>Cross-shard queries</strong> are the primary source of
          complexity in a sharded system. When a query cannot be satisfied by a
          single shard — either because it lacks the shard key, or because it
          requires a JOIN across tables sharded on different keys — the system
          must execute the query on all relevant shards and merge the results.
          This scatter-gather pattern introduces three problems:{" "}
          <strong>latency</strong>, because the query must wait for the slowest
          shard to respond; <strong>resource consumption</strong>, because every
          shard must execute the query, multiplying CPU and I/O cost by the
          number of shards; and <strong>correctness</strong>, because operations
          like ORDER BY, LIMIT, and GROUP BY must be applied per-shard and then
          re-applied to the merged result set. For example, a LIMIT 10 query
          requires each shard to return its top 10, and the coordinator must then
          merge the 10 × N results and take the global top 10. This is
          computationally expensive and does not scale linearly with the number
          of shards.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-sharding-diagram-1.svg"
          alt="Database sharding architecture showing monolithic database transformed into three independent shards with a shard router directing queries"
          caption="Sharded database architecture — a shard router maps shard keys to independent database instances, each handling a disjoint data subset"
        />

        <p>
          The request flow in a sharded database begins with the application
          issuing a query that includes a shard key. The shard router receives
          the query, extracts the shard key value, and performs a lookup to
          identify the target shard. For range-based sharding, this is a binary
          search over the range boundaries. For hash-based sharding, it is a
          hash computation followed by a modulo operation. For directory-based
          sharding, it is a lookup in the directory service (which may itself be
          a distributed key-value store). Once the target shard is identified,
          the router forwards the query to that shard&apos;s database instance,
          which executes the query locally and returns the result. The entire
          process adds a small routing overhead (typically 1–5 ms) to the query
          latency, but the shard itself experiences no additional latency from
          the sharding — it processes the query as if it were a standalone
          database.
        </p>

        <p>
          Within each shard, the database operates independently. Each shard
          maintains its own connection pool, its own buffer pool, its own write
          ahead log (WAL), and its own set of indexes. This independence is the
          source of sharding&apos;s write scalability: since shards do not
          coordinate with each other during write operations (for writes that
          target a single shard), the system&apos;s total write throughput is the
          sum of each shard&apos;s write throughput. If a single MySQL instance
          sustains 10,000 writes per second, a 20-shard cluster can sustain
          approximately 200,000 writes per second — linear horizontal scaling.
          Each shard can also be tuned independently: hot shards can be deployed
          on faster hardware, and cold shards can be consolidated onto shared
          infrastructure to reduce costs.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-sharding-diagram-2.svg"
          alt="Comparison of four shard key strategies: range-based, hash-based, directory-based, and geographic partitioning with their respective characteristics"
          caption="Shard key strategies — range, hash, directory, and geographic partitioning each serve different access patterns and constraints"
        />

        <p>
          The shard router itself must be highly available. In a client-side
          routing model, each client caches the shard map locally and refreshes
          it from a central configuration service (such as etcd or ZooKeeper) on
          a periodic basis or when the shard topology changes. The configuration
          service uses a consensus protocol (Raft or Paxos) to ensure that all
          clients eventually see a consistent shard map. In a server-side routing
          model, the router is deployed as a cluster of stateless proxy nodes
          behind a load balancer. Each proxy maintains its own shard map and
          forwards queries independently. If one proxy fails, the load balancer
          routes traffic to the remaining proxies. The shard map is refreshed
          from the configuration service on a TTL basis (e.g., every 30 seconds)
          or via a watch-based push notification when the topology changes.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/database-sharding-diagram-3.svg"
          alt="Cross-shard query execution showing a GROUP BY query fanning out to three shards, computing partial results, and merging at the coordinator"
          caption="Cross-shard query execution — the coordinator fans out the query, collects partial results, and merges them into the final answer"
        />

        <p>
          When a query requires data from multiple shards, the coordinator
          executes a scatter-gather protocol. It first determines which shards
          are relevant — for a query without a shard key, this is all shards;
          for a query with a range condition on the shard key, this is the
          subset of shards whose ranges overlap with the condition. The
          coordinator then sends the query (or a rewritten version optimized for
          the target shard) to each relevant shard in parallel. Each shard
          executes the query locally and returns its partial result. The
          coordinator waits for all partial results (or a timeout), merges them
          according to the query&apos;s aggregation logic (SUM, COUNT, GROUP BY,
          ORDER BY, LIMIT), and returns the final result. The total latency is
          dominated by the slowest shard&apos;s execution time plus the
          coordinator&apos;s merge time. For aggregations like SUM and COUNT,
          the merge is straightforward — sum the per-shard sums. For ORDER BY
          with LIMIT, the coordinator must use a priority queue to merge sorted
          results from all shards, which is O(M × log S) where M is the total
          number of returned rows and S is the number of shards.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          Sharding must be compared against the alternatives for scaling
          databases. <strong>Read replicas</strong> are the simplest scaling
          strategy — they replicate the entire dataset to multiple nodes and
          route reads to replicas while writes go to the primary. Read replicas
          scale read throughput linearly but do nothing for write throughput.
          They are appropriate when the workload is read-heavy (90%+ reads) and
          the dataset fits on a single server. <strong>Vertical scaling</strong>{" "}
          (upgrading to a larger server) is the simplest approach of all but is
          bounded by hardware limits and cost. A single server can typically
          sustain 10,000–50,000 writes per second depending on the workload;
          beyond that, sharding becomes necessary. <strong>Caching layers</strong>{" "}
          (Redis, Memcached) can absorb read traffic and reduce database load,
          but they do not help with write-heavy workloads or large datasets that
          exceed cache capacity.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Write Scaling</th>
              <th className="p-3 text-left">Read Scaling</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Single Node</strong>
              </td>
              <td className="p-3">No — bounded by server capacity</td>
              <td className="p-3">Limited by server I/O</td>
              <td className="p-3">Minimal — default setup</td>
              <td className="p-3">
                Startups, low-traffic apps, datasets &lt; 1 TB
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Read Replicas</strong>
              </td>
              <td className="p-3">No — single primary</td>
              <td className="p-3">
                Yes — linear with replica count
              </td>
              <td className="p-3">Low — replication is built-in</td>
              <td className="p-3">
                Read-heavy workloads (90%+ reads)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Database Sharding</strong>
              </td>
              <td className="p-3">
                Yes — linear with shard count
              </td>
              <td className="p-3">
                Yes — each shard can have replicas
              </td>
              <td className="p-3">
                High — cross-shard queries, rebalancing
              </td>
              <td className="p-3">
                Write-heavy workloads, datasets &gt; 1 TB
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>NoSQL (DynamoDB, Cassandra)</strong>
              </td>
              <td className="p-3">
                Yes — built-in auto-sharding
              </td>
              <td className="p-3">
                Yes — built-in replication
              </td>
              <td className="p-3">
                Medium — lose SQL features
              </td>
              <td className="p-3">
                High-throughput key-value workloads
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          The decision to shard should not be taken lightly. Sharding introduces
          permanent operational complexity: cross-shard queries are slow,
          distributed transactions across shards require two-phase commit (or
          saga patterns), schema migrations must be coordinated across all
          shards, and rebalancing data between shards is a non-trivial
          operational event. Once a database is sharded, it is extremely
          difficult to un-shard it — the data model, query patterns, and
          application logic are all built around the assumption of sharding.
          The recommendation is to delay sharding as long as possible — use read
          replicas, caching, and query optimization to extend the life of a
          single-node or replicated architecture — and only shard when write
          throughput or dataset size makes it unavoidable.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Choose the shard key based on your most common query pattern, not on
          theoretical distribution quality. The ideal shard key is one that
          appears in the WHERE clause of 90%+ of queries, has high cardinality
          (many distinct values), and distributes writes evenly across shards.
          For a multi-tenant SaaS application, <code>tenant_id</code> is often
          the best shard key — each tenant&apos;s data lives on a single shard,
          cross-tenant queries are rare, and tenants are naturally distributed.
          For a social media platform, <code>user_id</code> is the natural
          choice — most queries are scoped to a single user (their posts, their
          feed, their profile). Avoid shard keys that are monotonically
          increasing (e.g., auto-increment IDs, timestamps) with range-based
          sharding, as they concentrate all new writes on the last shard — a
          classic &quot;write hot spot&quot; anti-pattern. If you must use a
          timestamp-based key, use hash-based sharding to distribute the writes.
        </p>

        <p>
          Design your application to minimize cross-shard queries from the
          outset. The most effective strategy is <em>colocation</em> — ensuring
          that data that is frequently queried together lives on the same shard.
          For example, if an application frequently queries a user&apos;s orders
          together with the user&apos;s profile, both the users table and the
          orders table should be sharded on <code>user_id</code>. This ensures
          that a user&apos;s orders and profile are always on the same shard,
          and JOINs between them are local (within-shard) rather than
          cross-shard. When colocation is not possible (e.g., JOINs between
          tables sharded on different keys), consider denormalizing the data —
          store a copy of the frequently joined data on each relevant shard,
          accepting the write amplification cost to avoid the cross-shard read
          penalty.
        </p>

        <p>
          Implement automated shard monitoring with per-shard metrics. Monitor
          each shard&apos;s size, row count, QPS, p50/p95/p99 latency, index
          size, and replication lag independently. Set alerts when any shard
          exceeds thresholds — for example, when a shard&apos;s size exceeds 80%
          of the split threshold, or when its p99 latency exceeds 2× the cluster
          average. Per-shard monitoring is critical because an imbalanced shard
          distribution (where one shard is a hot spot) will not be detected by
          cluster-wide averages — the cluster average latency might be acceptable
          while one shard is timing out.
        </p>

        <p>
          Plan your shard count for 2–3× your current needs. If your current
          dataset fits on 2 shards, deploy 4–6 shards from the start, even if
          some shards are initially empty or underutilized. This prevents the
          need for an early rebalancing operation, which is disruptive. The
          marginal cost of additional shards on cloud infrastructure is low — an
          empty shard costs only the base server cost — and the operational
          benefit of having headroom for growth outweighs the small additional
          infrastructure cost.
        </p>

        <p>
          Use a shard management framework rather than building custom sharding
          logic. Vitess (for MySQL), Citus (for PostgreSQL), and MongoDB&apos;s
          built-in sharding provide production-tested shard routing, rebalancing,
          and cross-shard query execution. Building custom sharding logic is
          error-prone — the edge cases (split during migration, partial failures,
          stale shard maps) are numerous and difficult to test. Use an existing
          framework unless your requirements are so specific that no framework
          can accommodate them.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Choosing a shard key that creates write hot spots is the most common
          and damaging mistake. A monotonically increasing shard key (such as an
          auto-increment ID or a timestamp) with range-based sharding causes all
          new writes to target the last shard, as new key values always fall into
          the highest range. This shard becomes a write bottleneck, and the
          system&apos;s write throughput is effectively that of a single server
          — the same throughput you would have without sharding. The fix is to
          either use hash-based sharding (which distributes sequential keys
          across shards) or to use a composite shard key that includes a random
          component (e.g., <code>hash(user_id + timestamp)</code>).
        </p>

        <p>
          Underestimating cross-shard JOIN cost is another common error. In a
          non-sharded database, a JOIN between two tables is a single operation
          executed by the database engine using optimized algorithms (nested loop,
          hash join, merge join). In a sharded database, if the two tables are
          sharded on different keys, the JOIN requires fetching rows from
          multiple shards, buffering them, and performing the JOIN in the
          application layer or in the query coordinator. This is orders of
          magnitude slower and does not scale with the number of shards. The
          mitigation is to colocate JOINed tables on the same shard key, or to
          denormalize the data so that the JOIN is unnecessary. If neither is
          feasible, consider using a data warehouse (which is designed for
          cross-partition queries) for analytical queries and keep the sharded
          database for transactional queries.
        </p>

        <p>
          Neglecting shard rebalancing until it becomes a crisis. As data grows,
          shards will become imbalanced — some shards will grow faster than
          others due to uneven data distribution or access patterns. If
          rebalancing is not planned proactively, a hot shard can reach its
          capacity limit, causing write failures and service outages. Implement
          automated shard splitting: when a shard exceeds a size threshold (e.g.,
          10 GB), automatically split it into two shards, each owning half the
          range. The split process should be online — it streams data to the new
          shard in the background, locks only for the brief catch-up period, and
          updates the shard map atomically. MongoDB and Vitess both support
          automated online splitting.
        </p>

        <p>
          Schema migrations across shards are frequently underestimated. Adding a
          column, changing a column type, or adding an index requires executing
          the DDL statement on every shard. If the migration is not coordinated,
          different shards can have different schemas temporarily, causing query
          failures. Use an online schema migration tool (such as gh-ost or
          pt-online-schema-change for MySQL) that applies the migration
          incrementally without locking the table, and coordinate the migration
          across shards using a migration orchestrator that tracks each shard&apos;s
          migration status and rolls back on failure.
        </p>

        <p>
          Distributed transactions across shards require careful design. A
          transaction that modifies data on multiple shards cannot use the
          database&apos;s native transaction mechanism — each shard maintains
          its own independent transaction log, and there is no global transaction
          coordinator. The standard approach is a two-phase commit (2PC): the
          coordinator sends a PREPARE request to all involved shards, waits for
          all shards to acknowledge, and then sends a COMMIT request. If any
          shard fails to prepare, the coordinator sends a ROLLBACK to all
          shards. 2PC is correct but slow — it adds a network round-trip per
          phase, and a shard failure during the commit phase can leave the
          transaction in a limbo state that requires manual intervention. For
          high-throughput systems, prefer the saga pattern, which decomposes the
          distributed transaction into a sequence of local transactions with
          compensating actions for rollback.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <p>
          GitHub sharded its MySQL databases early in its growth, using{" "}
          <code>user_id</code> as the shard key. Each shard contains a subset of
          users, and all tables that are scoped to a user (repositories, issues,
          comments, pull requests) are sharded on the same key, ensuring
          colocation. Cross-shard queries are rare — the most common being
          global searches, which GitHub offloaded to Elasticsearch rather than
          executing as scatter-gather queries on MySQL. GitHub&apos;s sharding
          infrastructure is managed by Vitess, which handles shard routing,
          automated splitting, and connection pooling. This architecture enabled
          GitHub to scale from a single MySQL instance to hundreds of shards
          serving millions of developers.
        </p>

        <p>
          Pinterest uses sharded MySQL for its social graph data, with{" "}
          <code>user_id</code> as the shard key across 4,000+ shards. Pinterest&apos;s
          sharding system, called &quot;Pinlater,&quot; uses a directory-based
          approach where a central shard map service (built on ZooKeeper) tracks
          which user IDs map to which shards. The shard map is updated in
          real-time during rebalancing, and client libraries cache the map
          locally with a 30-second TTL. Pinterest&apos;s engineers published
          detailed blog posts about their sharding journey, including the
          challenge of handling celebrity users whose data generates
          disproportionate read traffic (solved with a per-user read cache) and
          the complexity of migrating data during shard splits.
        </p>

        <p>
          Uber&apos;s initial sharding architecture used a range-based approach
          with <code>city_id</code> as the shard key — each city&apos;s data
          (rides, drivers, trips) lived on a dedicated shard. This was a natural
          choice because most queries are city-scoped (a rider&apos;s ride is
          always within a city), and it provided fault isolation — an outage in
          one city&apos;s shard did not affect other cities. As Uber expanded
          globally, the city-based sharding proved insufficient because large
          cities (New York, London) outgrew a single shard, while small cities
          shared shards with many others. Uber migrated to a two-level sharding
          scheme: first by region (geographic), then by hash within each region,
          using a custom sharding framework called &quot;Schemaless&quot; built
          on top of MySQL.
        </p>

        <p>
          Instagram uses sharded PostgreSQL for its core data, with{" "}
          <code>user_id</code>-based hash sharding across hundreds of shards.
          Instagram&apos;s engineers have published extensively about their
          sharding strategy, including their approach to schema migrations (using
          a custom online migration tool that applies DDL changes shard by shard
          with rollback capability), their monitoring infrastructure (per-shard
          dashboards for size, QPS, and replication lag), and their rebalancing
          strategy (automated splitting when a shard exceeds 100 GB, with
          streaming data migration in the background). Instagram&apos;s
          sharding infrastructure handled the transition from 14 million to over
          1 billion users without a single architectural rewrite.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: You are designing a sharded database for a social media platform
            with 500 million users. What shard key would you choose and why? How
            would you handle a user&apos;s feed, which aggregates posts from
            thousands of followed users who may be on different shards?
          </h3>
          <p className="mb-3">
            The shard key should be <code>user_id</code> with hash-based
            partitioning. Hash-based ensures uniform distribution — even if user
            IDs are assigned sequentially, the hash function scatters them
            evenly across shards. <code>user_id</code> is the natural choice
            because the most common queries on a social media platform are
            user-scoped: fetch a user&apos;s profile, their posts, their
            followers, their notifications. By sharding on <code>user_id</code>,
            all of these queries are targeted to a single shard.
          </p>
          <p className="mb-3">
            The feed problem is more nuanced. A user&apos;s feed aggregates posts
            from all users they follow, and those followed users are distributed
            across shards. A naive approach — fan out a query to all shards,
            fetch the latest posts from each followed user, and merge — would
            require querying potentially hundreds of shards for every feed load,
            which is prohibitively expensive. The standard solution is a{" "}
            <em>feed precomputation</em> (also called &quot;fan-out on write&quot;
            or &quot;push model&quot;): when a user posts, the system writes the
            post to the author&apos;s shard and then asynchronously pushes a
            reference to the post (post ID, author ID, timestamp) to the feed
            caches of all the author&apos;s followers. Each follower&apos;s feed
            is stored as a sorted list of post IDs in a fast key-value store
            (Redis or a dedicated feed service). When the follower loads their
            feed, the application reads the precomputed list of post IDs from
            the feed cache and fetches the full post content from the respective
            shards in a batch request.
          </p>
          <p className="mb-3">
            For celebrity users with millions of followers, the push model
            creates a write amplification problem — a single post generates
            millions of feed cache writes. The solution is a hybrid approach:
            for users with fewer than 5,000 followers, use the push model; for
            users with more than 5,000 followers, use a <em>pull model</em> —
            the celebrity&apos;s posts are not pushed to followers&apos; feeds,
            and instead the followers&apos; feed service queries the celebrity&apos;s
            shard on-demand when the follower loads their feed, merging the
            celebrity&apos;s posts with the precomputed feed. This is the
            approach used by Twitter and Instagram.
          </p>
          <p>
            The key insight is that sharding on <code>user_id</code> works for
            the primary data model, but the feed is a derived data structure
            that requires its own storage and computation layer. Trying to
            compute the feed as a cross-shard query on the sharded database is
            an anti-pattern.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: A shard has exceeded its size threshold and needs to be split.
            Describe the online splitting process step by step, ensuring that
            reads and writes are not disrupted during the split.
          </h3>
          <p className="mb-3">
            Online shard splitting is a multi-phase operation that maintains
            service availability throughout. The process, as implemented by
            systems like Vitess and MongoDB, follows these steps:
          </p>
          <p className="mb-3">
            <strong>Phase 1: Planning.</strong> The shard manager identifies the
            split point — typically the midpoint of the shard&apos;s key range
            (e.g., if the shard owns [0x0000, 0xFFFF], the split point is
            0x8000). It creates a new shard record for the second half of the
            range (e.g., Shard A2 owns [0x8000, 0xFFFF]) and marks both the
            original shard (Shard A1, now owning [0x0000, 0x7FFF]) and the new
            shard in a &quot;serving from source&quot; state.
          </p>
          <p className="mb-3">
            <strong>Phase 2: Background streaming.</strong> The new shard (A2)
            begins streaming data from the source shard (A) for the key range
            [0x8000, 0xFFFF]. This is a bulk copy operation that runs in the
            background at a throttled rate to avoid impacting the source
            shard&apos;s read/write performance. During this phase, all reads
            and writes for the full range [0x0000, 0xFFFF] continue to go to the
            source shard (A). The new shard (A2) is not yet serving requests — it
            is catching up.
          </p>
          <p className="mb-3">
            <strong>Phase 3: Catch-up and filtered replication.</strong> Once
            the bulk copy completes, the new shard enters catch-up mode — it
            replays the write-ahead log (WAL) entries from the source shard for
            the keys in its range, applying any writes that occurred during the
            bulk copy. This is done via filtered replication: the source
            shard&apos;s replication stream is filtered to only include keys in
            [0x8000, 0xFFFF]. The catch-up process continues until the new shard
            is within a small delta (e.g., 1 second) of the source.
          </p>
          <p className="mb-3">
            <strong>Phase 4: Brief cutover lock.</strong> The shard manager
            acquires a brief lock on the key range [0x8000, 0xFFFF] on the
            source shard. During this lock (typically 1–5 seconds), writes to
            this range are buffered (not rejected — they queue up). The new
            shard applies the remaining delta from the WAL, builds its indexes,
            and verifies data integrity. Once verified, the shard map is updated
            atomically: keys in [0x0000, 0x7FFF] map to Shard A1, and keys in
            [0x8000, 0xFFFF] map to Shard A2. The lock is released, and buffered
            writes are routed to Shard A2.
          </p>
          <p className="mb-3">
            <strong>Phase 5: Cleanup.</strong> The source shard (A) deletes the
            data for the migrated range [0x8000, 0xFFFF] from its storage,
            freeing disk space. This deletion happens in the background and does
            not affect the source shard&apos;s ability to serve its remaining
            range [0x0000, 0x7FFF].
          </p>
          <p>
            The critical design property is that the only disruptive phase is
            Phase 4 (the cutover lock), which lasts O(delta) — the time to apply
            the remaining WAL entries — not O(full shard). This ensures that the
            split is nearly transparent to clients, with only a brief latency
            spike during the cutover.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you execute a paginated, sorted query (ORDER BY
            created_at DESC LIMIT 10 OFFSET 1000) across shards? Why is this
            particularly challenging?
          </h3>
          <p className="mb-3">
            Paginated, sorted queries across shards are one of the most
            challenging operations in a sharded system because they require the
            coordinator to fetch and sort data from all shards, and deep
            pagination (high OFFSET values) makes this exponentially more
            expensive.
          </p>
          <p className="mb-3">
            The execution process is: <strong>Step 1:</strong> The coordinator
            sends the query to all shards, each with ORDER BY created_at DESC
            LIMIT 1010 (OFFSET + LIMIT, because each shard must return enough
            rows for the coordinator to discard the first OFFSET rows).{" "}
            <strong>Step 2:</strong> Each shard executes the query locally,
            returning its top 1,010 rows sorted by created_at.{" "}
            <strong>Step 3:</strong> The coordinator receives up to 1,010 × N
            rows (where N is the number of shards). For 20 shards, this is up to
            20,200 rows. <strong>Step 4:</strong> The coordinator merges all
            rows into a single sorted list using a k-way merge (priority queue),
            discards the first 1,000 rows (the OFFSET), and returns the next 10
            rows.
          </p>
          <p className="mb-3">
            The challenge is threefold. First, the <em>data transfer cost</em>:
            to return 10 rows, the coordinator must transfer and process 20,200
            rows from the shards — a 2,000× amplification. Second, the{" "}
            <em>memory cost</em>: the coordinator must buffer all 20,200 rows in
            memory to perform the k-way merge, which can be significant for wide
            rows. Third, the <em>latency cost</em>: the coordinator must wait
            for the slowest shard to return its 1,010 rows before it can begin
            the merge, so the total latency is the maximum of all shard latencies
            plus the merge time.
          </p>
          <p className="mb-3">
            The standard mitigation is <em>keyset pagination</em> (also called
            cursor-based pagination). Instead of OFFSET, the client provides the
            last seen value from the previous page (e.g., the last{" "}
            <code>created_at</code> value). The coordinator then queries all
            shards with <code>WHERE created_at &lt; last_seen ORDER BY
            created_at DESC LIMIT 10</code>. Each shard returns its top 10 rows
            with the filter applied, and the coordinator merges the N × 10 = 200
            rows to find the global top 10. This reduces the data transfer from
            20,200 to 200 rows — a 100× improvement. The trade-off is that
            keyset pagination does not support random page jumps (you can&apos;t
            go directly to page 100), but this is an acceptable trade-off for
            most applications (infinite scroll, which is the dominant pagination
            pattern, only needs &quot;next page&quot;).
          </p>
          <p>
            If OFFSET-based pagination is a hard requirement, the alternative is
            to maintain a separate index table that maps (created_at, shard_id,
            row_id) tuples, stored in a single non-sharded (or differently
            sharded) table. This index allows the coordinator to look up the
            exact shard and row IDs for the desired page offset without
            fetching full rows. However, maintaining this index adds write
            amplification and eventual consistency complexity.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: You need to run a distributed transaction that updates a user&apos;s
            balance on Shard A and creates an order record on Shard B. What
            approaches would you consider, and which would you choose for a
            high-throughput e-commerce system?
          </h3>
          <p className="mb-3">
            This is a classic distributed transaction problem in a sharded
            system, and there are three standard approaches: two-phase commit
            (2PC), the saga pattern, and eventual consistency with
            reconciliation.
          </p>
          <p className="mb-3">
            <strong>Two-phase commit (2PC):</strong> The transaction coordinator
            sends a PREPARE request to both Shard A (deduct balance) and Shard B
            (create order). Each shard executes the operation within a local
            transaction and responds with &quot;prepared&quot; or &quot;aborted.&quot;
            If both shards prepare successfully, the coordinator sends a COMMIT
            to both. If either shard aborts, the coordinator sends a ROLLBACK to
            both. 2PC is correct (atomicity is guaranteed) but has two
            significant drawbacks for high-throughput systems: it adds two
            network round-trips to every transaction (PREPARE + COMMIT), and a
            shard failure during the commit phase can leave the transaction in
            an indeterminate state that requires manual resolution. For an
            e-commerce system processing thousands of orders per second, 2PC
            would add unacceptable latency and operational risk.
          </p>
          <p className="mb-3">
            <strong>Saga pattern:</strong> The transaction is decomposed into a
            sequence of local transactions with compensating actions. Step 1:
            deduct the user&apos;s balance on Shard A (local transaction). Step
            2: create the order on Shard B (local transaction). If Step 2 fails,
            execute a compensating action on Shard A to refund the balance. The
            saga is orchestrated by a saga orchestrator that tracks the state of
            each step and triggers compensations on failure. The advantage of
            sagas is that each step is a local transaction — no distributed lock
            is held, and shard failures are handled by executing compensations
            rather than blocking. The disadvantage is that sagas provide
            &quot;eventual atomicity&quot; rather than strict atomicity — there
            is a window during which the balance has been deducted but the order
            has not yet been created, and a concurrent read would see an
            inconsistent state. For an e-commerce system, this is acceptable if
            the UI reflects a &quot;processing&quot; state during the saga
            execution.
          </p>
          <p className="mb-3">
            <strong>Eventual consistency with reconciliation:</strong> The
            balance deduction and order creation are performed as independent
            local transactions, and a reconciliation process runs periodically to
            detect and fix inconsistencies (e.g., balance deducted but no order
            created, or order created but balance not deducted). This approach
            has the lowest latency but the weakest consistency guarantees. It
            requires building a reconciliation engine that can detect
            inconsistencies from the application&apos;s business logic (e.g., a
            deducted balance without a corresponding order within 5 minutes is
            flagged for automatic refund).
          </p>
          <p className="mb-3">
            For a high-throughput e-commerce system, I would choose the{" "}
            <strong>saga pattern</strong>. It provides the best balance of
            correctness (compensating actions ensure that failures are handled
            gracefully) and performance (no distributed locks, each step is a
            fast local transaction). The window of eventual inconsistency is
            small (the time between Step 1 and Step 2, typically milliseconds),
            and can be hidden from the user by showing a &quot;order
            processing&quot; state. The compensating action (refund) is
            idempotent and can be safely retried if the first attempt fails.
          </p>
          <p>
            The critical implementation detail is making the compensating action
            idempotent and durable. The saga orchestrator logs each step to a
            durable event log before executing it, so if the orchestrator
            crashes, a new orchestrator can replay the log and resume from the
            last completed step. The compensating action (refund) checks whether
            the balance has already been refunded before executing, ensuring
            idempotency.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: What happens when you need to change the shard key after the
            system is in production? Is it possible, and how would you execute
            it?
          </h3>
          <p className="mb-3">
            Changing the shard key in production is one of the most challenging
            operational tasks in a sharded system, because the shard key
            determines the physical location of every row in the system. Changing
            it means remapping every row to a (potentially different) shard. It
            is possible, but it is a major, months-long migration project that
            requires careful planning.
          </p>
          <p className="mb-3">
            The migration approach depends on whether the new shard key is
            compatible with the old one. If the new shard key is a superset of
            the old one (e.g., changing from <code>user_id</code> to{" "}
            <code>tenant_id + user_id</code>), the migration can be done
            incrementally: migrate one tenant at a time, re-sharding their data
            from the old scheme to the new scheme, and routing their traffic to
            the new shard placement once migrated. Tenants are migrated
            sequentially, and the system operates in a dual-routing mode during
            the migration — it knows which tenants have been migrated and routes
            accordingly.
          </p>
          <p className="mb-3">
            If the new shard key is incompatible with the old one (e.g.,
            changing from <code>user_id</code> to <code>order_id</code>), the
            migration requires a full data re-sharding. The process is:{" "}
            <strong>Step 1:</strong> Build the new shard topology with the new
            shard key, deploying new shards alongside the old shards.{" "}
            <strong>Step 2:</strong> Run a bulk migration job that reads all data
            from the old shards, re-computes the new shard placement based on the
            new shard key, and writes the data to the new shards. This job runs
            in the background and can take days or weeks for large datasets.{" "}
            <strong>Step 3:</strong> Set up a dual-write path: all new writes go
            to both the old shards and the new shards (using a write-through
            proxy). This ensures that data written during the migration is
            present in both systems. <strong>Step 4:</strong> Once the bulk
            migration completes and the dual-write path is confirmed working,
            gradually migrate read traffic from the old shards to the new shards,
            tenant by tenant or shard by shard. <strong>Step 5:</strong> After
            all read traffic is migrated and the old shards are no longer serving
            reads, turn off the dual-write path and decommission the old shards.
          </p>
          <p className="mb-3">
            The total migration time for a large system (petabyte-scale) is
            typically 2–6 months, with the bulk migration phase being the
            longest. The system must support dual-routing (sending reads to the
            old system for unmigrated data and to the new system for migrated
            data) and dual-writes (writing to both systems) throughout the
            migration. The risk is significant — any bug in the migration logic
            can cause data loss or inconsistency — so the migration must be
            thoroughly tested on a staging environment with production-scale data
            before execution.
          </p>
          <p>
            The key lesson is: <strong>choose the shard key carefully the first
            time</strong>. It is the hardest decision to change later. The shard
            key should be based on the stable, long-term access patterns of the
            system, not on the current workload, because changing it is
            essentially a full system rebuild.
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Corbett, J.C., et al. (2013). &quot;Spanner: Google&apos;s
            Globally Distributed Database.&quot; <em>ACM TOCS</em>. — Describes
            Google&apos;s approach to globally distributed data, including
            sharding and placement strategies.
          </li>
          <li>
            Lakshman, A., &amp; Malik, P. (2010). &quot;Cassandra: A
            Decentralized Structured Storage Engine.&quot; <em>ACM SIGOPS</em>. —
            Details Cassandra&apos;s consistent hashing-based sharding and
            replication model.
          </li>
          <li>
            Vitess Documentation. &quot;VSchema and Routing.&quot; PlanetScale. —
            Production-tested sharding framework for MySQL with automated
            splitting and resharding.
          </li>
          <li>
            MongoDB Manual. &quot;Sharding.&quot; MongoDB, Inc. — Comprehensive
            guide to MongoDB&apos;s built-in sharding, including chunk splitting
            and the balancer.
          </li>
          <li>
            Pinterest Engineering Blog (2015). &quot;Scaling Pinterest&apos;s
            MySQL Infrastructure.&quot; — Detailed account of sharding at scale
            with 4,000+ MySQL shards.
          </li>
          <li>
            Uber Engineering Blog (2016). &quot;Introducing Schemaless:
            StorAge Engineering at Uber.&quot; — Describes Uber&apos;s custom
            sharding framework built on MySQL.
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
