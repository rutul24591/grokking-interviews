"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-partitioning-strategies",
  title: "Partitioning Strategies",
  description:
    "Staff-level deep dive into data partitioning covering range, hash, directory-based, and consistent hashing strategies, cross-partition query patterns, rebalancing, and production trade-offs for distributed data systems.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "partitioning-strategies",
  wordCount: 5600,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: [
    "partitioning",
    "range partitioning",
    "hash partitioning",
    "directory-based partitioning",
    "consistent hashing",
    "cross-partition queries",
    "rebalancing",
    "data distribution",
  ],
  relatedTopics: [
    "consistent-hashing",
    "database-sharding",
    "data-replication",
    "distributed-coordination",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Partitioning</strong> (also called <em>sharding</em> when
          distributed across machines) is the process of dividing a large
          dataset into smaller, independent subsets called <em>partitions</em>,
          each of which can be stored, queried, and managed separately. The
          fundamental motivation is that a single database node has finite
          storage capacity, memory, and I/O throughput — once any of these
          resources is exhausted, the system cannot scale further without
          distributing the data across multiple nodes. Partitioning is the
          mechanism by which this distribution is organized: it determines which
          piece of data lives on which node, how queries are routed to the
          correct node, and what happens when data needs to be redistributed
          (due to node additions, removals, or growth).
        </p>
        <p>
          The choice of partitioning strategy is one of the most consequential
          architectural decisions in a distributed data system because it
          determines the system&apos;s performance characteristics, its ability
          to handle different query patterns, and the operational complexity of
          managing the cluster. A poorly chosen partition key can create{" "}
          <em>hot partitions</em> — partitions that receive disproportionate
          traffic — which effectively reduces the system&apos;s throughput to
          that of a single node, negating the benefit of distribution. A
          well-chosen strategy distributes both data and traffic evenly across
          all partitions, enabling the system to scale linearly with the number
          of nodes.
        </p>
        <p>
          There are four primary partitioning strategies, each with distinct
          trade-offs. <strong>Range partitioning</strong> assigns rows to
          partitions based on which contiguous range of the partition key they
          fall into — for example, user IDs 0–999,999 in partition A, 1,000,000–1,999,999
          in partition B. <strong>Hash partitioning</strong> applies a hash
          function to the partition key and uses the result to determine the
          partition (typically <code>hash(key) % N</code>).{" "}
          <strong>Directory-based partitioning</strong> uses a lookup service
          that maps each key to a specific partition, enabling arbitrary
          reassignment. <strong>Consistent hashing</strong> maps both keys and
          nodes onto a circular hash space (a ring), assigning each key to the
          first node encountered when traversing the ring clockwise from the
          key&apos;s position. Each strategy serves different access patterns
          and operational constraints.
        </p>
        <p>
          For staff and principal engineers, understanding partitioning
          strategies extends beyond selecting the right algorithm — it requires
          designing the entire data access pattern around the partition
          strategy. This includes colocation (ensuring that frequently joined
          data lives on the same partition), cross-partition query handling
          (scatter-gather, map-reduce, or denial), rebalancing (moving data
          between partitions as the cluster grows), and hot partition mitigation
          (detecting and redistributing skewed workloads). These decisions are
          difficult to reverse — the partition key and strategy determine the
          physical layout of data, and changing them requires a full data
          migration.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          The <strong>partition key</strong> is the attribute (or composite of
          attributes) used to determine which partition a row belongs to. Every
          query that includes the partition key can be routed to a single
          partition (a <em>targeted query</em>), while queries that do not
          include the partition key must be broadcast to all partitions and
          their results merged (a <em>scatter-gather query</em>). The partition
          key is therefore the single most important design decision in a
          partitioned system — it determines both the distribution of data
          across partitions and the efficiency of the most common query
          patterns. A well-chosen partition key has high cardinality (many
          distinct values), appears in the WHERE clause of most queries, and
          distributes writes evenly across partitions.
        </p>

        <p>
          <strong>Range partitioning</strong> divides the key space into
          contiguous ranges, each assigned to a partition. The ranges are
          typically defined by boundary values — for example, partition A
          contains keys from 0x000000 to 0x333333, partition B from 0x333334 to
          0x666666, and partition C from 0x666667 to 0x999999. This strategy
          enables efficient range queries — a query for all keys between 0x100000
          and 0x500000 only needs to query partitions A and B, not C. However,
          range partitioning is susceptible to hot spots if the data
          distribution is skewed. If most new users have IDs starting with 9
          (because IDs are assigned sequentially), partition C will receive all
          new writes while partitions A and B remain relatively idle. This is
          the classic &quot;write hot spot&quot; anti-pattern. The mitigation
          is <em>range splitting</em> — when a partition exceeds a size
          threshold (e.g., 10 GB), it is split into two partitions, each owning
          half the range. MongoDB and HBase use automatic range splitting as
          part of their rebalancing process.
        </p>

        <p>
          <strong>Hash partitioning</strong> applies a hash function to the
          partition key and uses the result (typically modulo the number of
          partitions) to determine the target partition. This strategy produces
          near-uniform distribution regardless of input patterns — even if keys
          are assigned sequentially, the hash function scatters them evenly
          across partitions. This eliminates hot spots and ensures that all
          partitions process approximately equal traffic. However, hash
          partitioning destroys the ordering of keys — range queries become
          scatter-gather operations, as rows with adjacent key values may be on
          different partitions. This makes hash partitioning unsuitable for
          workloads that require efficient range scans (e.g., time-series data,
          alphabetical lookups).
        </p>

        <p>
          <strong>Directory-based partitioning</strong> uses a lookup service
          (the directory) that maps each key to its partition. The directory is
          essentially a key-value store where the key is the partition key and
          the value is the partition identifier. This strategy provides the
          highest flexibility — the directory can assign keys to partitions
          arbitrarily, enabling load-based rebalancing without data migration
          (just update the directory entry). When a partition is overloaded,
          the directory can reassign some keys to a less-loaded partition, and
          the data migration happens in the background. The trade-off is that
          the directory itself becomes a critical infrastructure component that
          must be highly available, performant, and consistent. Google&apos;s
          Spanner and CockroachDB use directory-based partitioning (called
          &quot;range directories&quot; in Spanner), where the directory is
          maintained by a consensus protocol (Paxos in Spanner, Raft in
          CockroachDB).
        </p>

        <p>
          <strong>Consistent hashing</strong> maps both keys and nodes onto a
          circular hash space (a ring). Each key is assigned to the first node
          encountered when traversing the ring clockwise from the key&apos;s
          hashed position. The key advantage of consistent hashing is its{" "}
          <em>minimal disruption</em> property: when a node is added or removed,
          only the keys that fall between the new node and its immediate
          predecessor need to be moved — approximately <code>K/N</code> keys,
          where K is the total key space and N is the number of nodes. By
          contrast, hash partitioning requires remapping nearly all keys when N
          changes. Consistent hashing is the foundation of DynamoDB, Cassandra,
          and Memcached&apos;s ketama implementation. To address the hot spot
          problem (which can occur even with consistent hashing if nodes are
          unevenly distributed on the ring), <em>virtual nodes</em> are used —
          each physical node is assigned multiple positions on the ring (150–256
          virtual nodes), ensuring near-uniform distribution.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/partitioning-strategies-diagram-1.svg"
          alt="Range partitioning showing contiguous key ranges assigned to partitions A, B, and C with hot partition indicator and range split operation"
          caption="Range partitioning — contiguous key ranges assigned to partitions, with automatic range splitting when a partition exceeds the size threshold"
        />

        <p>
          The request flow in a partitioned system begins with the client
          issuing a query that includes the partition key. The system first
          determines which partition owns the key — this determination depends
          on the partitioning strategy. For range partitioning, it is a binary
          search over the range boundaries. For hash partitioning, it is a hash
          computation followed by a modulo operation. For directory-based
          partitioning, it is a lookup in the directory service. For consistent
          hashing, it is a binary search over the ring positions. Once the
          target partition is identified, the request is routed to the node
          hosting that partition, which executes the query locally and returns
          the result.
        </p>

        <p>
          The partition routing layer can be implemented in two ways. In a{" "}
          <strong>client-side routing</strong> model, the client application
          maintains a local partition map and routes queries directly to the
          correct partition. This eliminates a network hop but requires all
          clients to maintain synchronized partition maps — when the partition
          topology changes (due to rebalancing or node additions/removals), all
          clients must be notified. In a <strong>server-side routing</strong>{" "}
          model, a dedicated proxy service receives queries, determines the
          target partition, and forwards the query. This centralizes partition
          management but adds latency and a potential bottleneck unless the
          proxy is replicated. Vitess (for MySQL) and CockroachDB&apos;s SQL
          gateway are examples of server-side routing.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/partitioning-strategies-diagram-2.svg"
          alt="Hash partitioning flow showing input keys flowing through a hash function and being evenly distributed across four partitions"
          caption="Hash partitioning — the hash function scatters keys uniformly across partitions, eliminating hot spots regardless of input patterns"
        />

        <p>
          When a query does not include the partition key — or includes a range
          condition that spans multiple partitions — the system must execute a
          <em>cross-partition query</em>. This is the most expensive operation
          in a partitioned system. The standard approach is{" "}
          <strong>scatter-gather</strong>: the query coordinator sends the query
          (or a rewritten version optimized for the target partition) to all
          relevant partitions in parallel. Each partition executes the query
          locally and returns its partial result. The coordinator waits for all
          partial results (or a timeout), merges them according to the
          query&apos;s aggregation logic, and returns the final result. The
          total latency is dominated by the slowest partition&apos;s execution
          time plus the coordinator&apos;s merge time. For a query with an ORDER
          BY and LIMIT, each partition must return its top N rows, and the
          coordinator must merge all results and take the global top N — a
          process that scales linearly with the number of partitions and the
          limit value.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/partitioning-strategies-diagram-3.svg"
          alt="Directory-based partitioning showing a lookup service mapping keys to partitions with a rebalancing example"
          caption="Directory-based partitioning — the lookup service provides arbitrary key-to-partition mapping, enabling load-based rebalancing without upfront data migration"
        />

        <p>
          <strong>Rebalancing</strong> is the process of redistributing data
          across partitions as the cluster grows or as data distribution
          becomes skewed. In range partitioning, rebalancing occurs through
          range splitting — when a partition exceeds a size threshold, it is
          split into two partitions, each owning half the range. The split
          process streams data from the original partition to the new partition
          in the background, and once the new partition is caught up, the range
          boundaries are updated. In hash partitioning, rebalancing is more
          expensive — adding a new partition requires remapping approximately
          all keys, because <code>hash(key) % (N+1)</code> produces a different
          result for most keys. Consistent hashing minimizes this cost — only
          the keys between the new node and its predecessor need to be moved.
          Directory-based partitioning provides the most flexible rebalancing —
          the directory can reassign keys arbitrarily, and the data migration
          happens in the background after the directory entry is updated.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          The choice of partitioning strategy involves trade-offs across query
          flexibility, distribution quality, rebalancing cost, and operational
          complexity. Range partitioning is the best choice when range queries
          are common and the key distribution is predictable — it enables
          efficient range scans but is vulnerable to hot spots. Hash
          partitioning is the best choice when write uniformity is the primary
          concern — it eliminates hot spots but makes range queries expensive.
          Directory-based partitioning is the best choice when flexibility is
          paramount — it enables arbitrary reassignment but requires a highly
          available directory service. Consistent hashing is the best choice
          when the cluster size changes frequently — it minimizes the data
          movement during rebalancing but requires virtual nodes to achieve
          uniform distribution.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Range Queries</th>
              <th className="p-3 text-left">Distribution</th>
              <th className="p-3 text-left">Rebalancing</th>
              <th className="p-3 text-left">Complexity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Range Partitioning</strong>
              </td>
              <td className="p-3">
                Efficient — single partition or few
              </td>
              <td className="p-3">
                Skewed if input is non-uniform
              </td>
              <td className="p-3">
                Automatic — range splitting
              </td>
              <td className="p-3">Low — simple boundaries</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Hash Partitioning</strong>
              </td>
              <td className="p-3">
                Expensive — scatter-gather
              </td>
              <td className="p-3">Uniform — hash ensures balance</td>
              <td className="p-3">
                Expensive — most keys remapped
              </td>
              <td className="p-3">
                Low — single computation
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Directory-Based</strong>
              </td>
              <td className="p-3">Depends on directory design</td>
              <td className="p-3">
                Arbitrary — controlled by directory
              </td>
              <td className="p-3">
                Flexible — update directory entry
              </td>
              <td className="p-3">
                Medium — directory service needed
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Consistent Hashing</strong>
              </td>
              <td className="p-3">
                Expensive — keys scattered
              </td>
              <td className="p-3">
                Uniform with virtual nodes
              </td>
              <td className="p-3">
                Minimal — only K/N keys move
              </td>
              <td className="p-3">
                Medium — ring management
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/partitioning-strategies-diagram-4.svg"
          alt="Cross-partition scatter-gather query showing coordinator fanning out to three partitions and merging partial results"
          caption="Cross-partition queries — the scatter-gather pattern broadcasts to all relevant partitions and merges results, with latency bounded by the slowest partition"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Choose the partition key based on the most common query pattern, not
          on theoretical distribution quality. The ideal partition key appears
          in the WHERE clause of the majority of queries, has high cardinality,
          and distributes writes evenly. For a multi-tenant SaaS application,
          the tenant ID is often the best partition key — each tenant&apos;s
          data lives on a single partition, cross-tenant queries are rare, and
          tenants are naturally distributed. For a time-series database, a
          composite partition key of <code>hash(metric_name) + time_bucket</code>{" "}
          distributes writes evenly (via the hash) while enabling efficient
          range queries within a time bucket (via the time component). Avoid
          partition keys that are monotonically increasing (auto-increment IDs,
          timestamps) with range partitioning — they concentrate all new writes
          on the last partition. If you must use a sequential key, use hash
          partitioning or prepend a random prefix to distribute the writes.
        </p>

        <p>
          Design the application to minimize cross-partition queries from the
          outset. The most effective strategy is <em>colocation</em> — ensuring
          that data frequently queried together lives on the same partition. If
          an application frequently joins orders with order items, both tables
          should be partitioned on the same key (e.g., <code>order_id</code>).
          This ensures that an order and its items are always on the same
          partition, and joins are local (within-partition) rather than
          cross-partition. When colocation is not possible, consider
          denormalizing the data — store a copy of the frequently joined data
          on each relevant partition, accepting the write amplification cost to
          avoid the cross-partition read penalty.
        </p>

        <p>
          Implement automated partition monitoring with per-partition metrics.
          Monitor each partition&apos;s size, row count, QPS, p50/p95/p99
          latency, and disk I/O independently. Set alerts when any partition
          exceeds thresholds — for example, when a partition&apos;s QPS exceeds
          2× the cluster average (indicating a hot partition), or when its size
          exceeds 80% of the split threshold. Per-partition monitoring is
          critical because an imbalanced partition distribution will not be
          detected by cluster-wide averages — the cluster average latency might
          be acceptable while one partition is timing out.
        </p>

        <p>
          Plan the initial partition count for 2–3× the current need. If the
          current dataset fits on 2 partitions, deploy 4–6 partitions from the
          start, even if some are initially underutilized. This prevents the
          need for an early rebalancing operation, which is disruptive. The
          marginal cost of additional partitions on cloud infrastructure is
          low, and the operational benefit of having headroom for growth
          outweighs the small additional infrastructure cost.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Choosing a partition key that creates hot partitions is the most
          common and damaging mistake. A monotonically increasing partition key
          with range partitioning causes all new writes to target the last
          partition — a classic write hot spot. The system&apos;s write
          throughput is effectively that of a single server, the same
          throughput as without partitioning. The fix is to use hash
          partitioning (which distributes sequential keys across partitions) or
          a composite partition key that includes a random component (e.g.,{" "}
          <code>hash(user_id + timestamp_bucket)</code>).
        </p>

        <p>
          Underestimating cross-partition query cost is another common error.
          In a partitioned database, a JOIN across tables partitioned on
          different keys requires fetching rows from multiple partitions,
          buffering them, and performing the JOIN in the application layer or
          in the query coordinator. This is orders of magnitude slower than a
          local JOIN and does not scale with the number of partitions. The
          mitigation is to colocate JOINed tables on the same partition key, or
          to denormalize the data so that the JOIN is unnecessary. If neither
          is feasible, consider using a data warehouse for analytical queries
          and keep the partitioned database for transactional queries.
        </p>

        <p>
          Neglecting partition rebalancing until it becomes a crisis. As data
          grows, partitions will become imbalanced — some partitions grow faster
          than others due to uneven data distribution or access patterns. If
          rebalancing is not planned proactively, a hot partition can reach its
          capacity limit, causing write failures and service outages. Implement
          automated partition splitting: when a partition exceeds a size
          threshold, automatically split it into two partitions, each owning
          half the range. The split process should be online — it streams data
          to the new partition in the background and updates the routing
          metadata atomically.
        </p>

        <p>
          Assuming that adding partitions always improves performance is a
          misconception. Adding partitions increases the system&apos;s total
          capacity, but it also increases the cost of cross-partition queries
          (more partitions to fan out to) and the operational complexity (more
          nodes to monitor, more rebalancing events). The optimal partition
          count is the minimum number that keeps each partition below its
          capacity limit — not the maximum number of nodes available. For most
          workloads, 10–50 partitions are sufficient; beyond that, the
          cross-partition query overhead dominates the performance benefit.
        </p>
      </section>

      {/* Section 7: Real-world Use Cases */}
      <section>
        <h2>Real-world Use Cases</h2>

        <p>
          Google Spanner uses directory-based partitioning with range partitions
          managed by a Paxos-based directory service. Each range (a contiguous
          key range, typically 100 MB) is assigned to a &quot;tablet&quot; — a
          group of replicas that serve the range using Paxos consensus. When a
          range grows beyond 100 MB, Spanner automatically splits it into two
          ranges, each assigned to a new tablet group. The directory service
          tracks the mapping from key ranges to tablet groups, and clients
          query the directory to find the tablet responsible for their key. This
          architecture enables Spanner to scale to petabytes of data across
          thousands of nodes while maintaining strong consistency and external
          consistency (linearizability) across all partitions.
        </p>

        <p>
          Apache Kafka uses hash partitioning within topics — each topic is
          divided into partitions, and messages are assigned to partitions
          based on the hash of their key (or round-robin if no key is
          specified). Each partition is an ordered, append-only log that is
          replicated across multiple brokers for fault tolerance. Kafka&apos;s
          partitioning strategy ensures that messages with the same key are
          always written to the same partition (preserving ordering for that
          key) while distributing messages evenly across partitions for parallel
          consumption. The number of partitions per topic is set at creation
          time and cannot be changed without recreating the topic — this is one
          of Kafka&apos;s most important capacity planning decisions.
        </p>

        <p>
          Amazon DynamoDB uses consistent hashing with virtual nodes to
          distribute data across its storage nodes. Each item is assigned to a
          partition based on the hash of its partition key, and each partition
          is replicated across three storage nodes for durability. DynamoDB
          automatically splits partitions when they exceed 10 GB or when the
          throughput capacity of a partition is exceeded — the split creates
          two new partitions, each owning half the key range, and the data is
          streamed from the original partition to the new partitions in the
          background. This automatic partitioning is invisible to the user —
          DynamoDB abstracts away the partition topology and provides a uniform
          interface regardless of the number of underlying partitions.
        </p>

        <p>
          CockroachDB uses a hybrid approach: range partitioning (contiguous
          key ranges) with directory-based routing. The directory is maintained
          by the Raft consensus protocol, ensuring that all nodes agree on the
          partition topology. Each range is replicated across multiple nodes
          using Raft, and the range can be split automatically when it exceeds
          64 MB. CockroachDB also supports manual range partitioning — users
          can define explicit partition boundaries (e.g., partition by region,
          partition by date) to optimize query performance for known access
          patterns. This hybrid approach combines the range query efficiency of
          range partitioning with the flexibility of directory-based routing
          and the fault tolerance of Raft-based replication.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: You are designing a partitioned database for a social media
            platform. The most common queries are: (a) fetch a user&apos;s
            profile by user ID, (b) fetch a user&apos;s posts by user ID, and
            (c) fetch posts from a user&apos;s feed (which aggregates posts
            from followed users). What partition strategy would you choose and
            why?
          </h3>
          <p className="mb-3">
            The partition key should be <code>user_id</code> with hash-based
            partitioning. Hash-based ensures uniform distribution — even if user
            IDs are assigned sequentially, the hash function scatters them
            evenly across partitions. <code>user_id</code> is the natural
            choice because the two most common queries (profile and posts) are
            user-scoped and can be targeted to a single partition.
          </p>
          <p className="mb-3">
            The feed query (c) is more challenging because it aggregates posts
            from multiple users who are distributed across partitions. A naive
            scatter-gather approach — querying all partitions for the latest
            posts from each followed user and merging — would be prohibitively
            expensive for users who follow hundreds of accounts. The standard
            solution is a feed precomputation layer: when a user posts, the
            system writes the post to the author&apos;s partition and
            asynchronously pushes a reference to the post to the feed caches of
            all the author&apos;s followers. Each follower&apos;s feed is stored
            as a sorted list of post IDs in a fast key-value store (Redis).
            When the follower loads their feed, the application reads the
            precomputed list and fetches the full post content from the
            respective partitions in a batch request.
          </p>
          <p>
            For celebrity users with millions of followers, the push model
            creates write amplification. The solution is a hybrid approach: for
            users with fewer than 5,000 followers, use the push model; for
            users with more, use a pull model — the followers&apos; feed service
            queries the celebrity&apos;s partition on-demand when the follower
            loads their feed. This is the approach used by Twitter and
            Instagram.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: A partitioned database uses range partitioning with user_id as
            the partition key. Over time, partition C (user_id 666667–999999)
            has grown to 3× the size of partitions A and B, and its p99 latency
            is 5× higher. What is the root cause, and how do you resolve it?
          </h3>
          <p className="mb-3">
            The root cause is likely a <em>hot partition</em> — partition C is
            receiving disproportionate traffic. This can happen if user IDs in
            the 666667–999999 range are more common (e.g., the platform has
            grown rapidly and most recent users fall in this range), or if a
            small number of users in this range generate disproportionate
            traffic (celebrity accounts, bots, or compromised accounts).
          </p>
          <p className="mb-3">
            The immediate resolution is to <strong>split partition C</strong>{" "}
            into two partitions: C1 (666667–833333) and C2 (833334–999999).
            The split process streams data from C to C1 and C2 in the
            background, and once caught up, the range boundaries are updated to
            reflect the new partitions. This is an online operation — the
            original partition C continues to serve requests during the split,
            and the routing metadata is updated atomically once the split
            completes.
          </p>
          <p className="mb-3">
            The longer-term resolution depends on the root cause. If the skew
            is due to sequential user ID assignment (most new users fall in the
            highest range), the partitioning strategy should be changed to hash
            partitioning, which distributes sequential keys evenly. If the skew
            is due to a few hot users within the range, those users&apos; data
            should be cached at the application layer to reduce the load on the
            partition.
          </p>
          <p>
            The key operational practice is to monitor per-partition metrics
            (size, QPS, latency) and alert before a partition reaches its
            capacity limit, giving time to split or rebalance proactively.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: Compare hash partitioning with consistent hashing. When would
            you choose one over the other?
          </h3>
          <p className="mb-3">
            Both hash partitioning and consistent hashing distribute keys evenly
            across partitions, but they differ significantly in their
            rebalancing behavior and operational complexity.
          </p>
          <p className="mb-3">
            <strong>Hash partitioning</strong> uses <code>hash(key) % N</code>{" "}
            to determine the partition. It is simple to implement, requires no
            data structures (just a hash function and a modulo), and provides
            O(1) lookup. However, when N changes (a partition is added or
            removed), nearly all keys must be remapped because{" "}
            <code>hash(key) % (N+1)</code> produces a different result for most
            keys. This makes hash partitioning expensive to rebalance.
          </p>
          <p className="mb-3">
            <strong>Consistent hashing</strong> maps both keys and nodes onto a
            ring, assigning each key to the first node clockwise from its
            position. When a node is added or removed, only the keys between
            the new node and its predecessor need to be moved — approximately{" "}
            <code>K/N</code> keys. This minimal disruption property makes
            consistent hashing much cheaper to rebalance. However, it requires
            maintaining a ring data structure (a sorted list of node positions),
            performing a binary search for each lookup (O(log N)), and
            configuring virtual nodes to achieve uniform distribution.
          </p>
          <p className="mb-3">
            Choose <strong>hash partitioning</strong> when the partition count
            is stable (rarely changes) and simplicity is a priority. This is
            common in systems where the number of partitions is set at
            creation time and does not change (e.g., Kafka topics, where the
            partition count is fixed). Choose <strong>consistent hashing</strong>{" "}
            when the partition count changes frequently (nodes are added and
            removed dynamically) and the cost of rebalancing is a concern. This
            is common in systems that auto-scale (e.g., DynamoDB, Memcached
            clusters).
          </p>
          <p>
            A practical decision framework: if adding a partition requires
            remapping more than 20% of the keys, consistent hashing is
            preferable. If the partition count changes less than once per month,
            hash partitioning is acceptable. The crossover point depends on the
            dataset size and the cost of data migration — for a 10 TB dataset,
            even a monthly remapping of 90% of keys is a significant operational
            burden, making consistent hashing the better choice.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you handle a cross-partition transaction that needs to
            update data on two different partitions atomically?
          </h3>
          <p className="mb-3">
            This is the distributed transaction problem in a partitioned system.
            A transaction that modifies data on multiple partitions cannot use
            the database&apos;s native transaction mechanism — each partition
            maintains its own independent transaction log, and there is no
            global transaction coordinator.
          </p>
          <p className="mb-3">
            The standard approaches are: <strong>(1) Two-phase commit (2PC)</strong>{" "}
            — a coordinator sends a PREPARE request to both partitions, waits
            for both to acknowledge, and then sends a COMMIT. 2PC is correct
            but slow (two network round-trips) and blocks if the coordinator
            crashes during the vote phase. <strong>(2) Saga pattern</strong> —
            the transaction is decomposed into a sequence of local transactions
            with compensating actions. If a step fails, the compensating
            actions for preceding steps are executed in reverse order. Sagas
            provide eventual atomicity (non-blocking) but require the
            application to define compensating actions. <strong>(3) Avoid
            cross-partition transactions</strong> by redesigning the partition
            key so that the data that needs to be updated together lives on the
            same partition. This is the preferred approach — if the transaction
            is common, the partition key should be chosen to colocate the data.
          </p>
          <p className="mb-3">
            For a production system, I would prioritize approach (3) — redesign
            the partition key to colocate the data. If that is not feasible
            (the data is naturally partitioned on different keys), I would use
            approach (2) — the saga pattern — because it provides non-blocking
            execution and is more resilient to failures than 2PC. The saga&apos;s
            compensating actions ensure that the system can recover from partial
            failures without manual intervention.
          </p>
          <p>
            The critical implementation detail is making the compensating
            actions idempotent and durable. The saga orchestrator logs each
            step to a durable event log before executing it, so if the
            orchestrator crashes, a new orchestrator can replay the log and
            resume from the last completed step.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: What happens when you need to change the partition key after the
            system is in production? Is it possible, and how would you execute
            it?
          </h3>
          <p className="mb-3">
            Changing the partition key in production is one of the most
            challenging operational tasks, because the partition key determines
            the physical location of every row. Changing it means remapping
            every row to a (potentially different) partition. It is possible,
            but it is a major migration project.
          </p>
          <p className="mb-3">
            The migration process: <strong>Step 1:</strong> Build the new
            partition topology alongside the old one, deploying new partitions
            with the new partition key. <strong>Step 2:</strong> Run a bulk
            migration job that reads all data from the old partitions,
            re-computes the new partition placement based on the new key, and
            writes the data to the new partitions. This job runs in the
            background. <strong>Step 3:</strong> Set up a dual-write path — all
            new writes go to both the old and new partitions.{" "}
            <strong>Step 4:</strong> Once the bulk migration completes,
            gradually migrate read traffic from the old to the new partitions,
            partition by partition. <strong>Step 5:</strong> After all read
            traffic is migrated, turn off the dual-write path and decommission
            the old partitions.
          </p>
          <p>
            The key lesson is: choose the partition key carefully the first
            time. It is the hardest decision to change later. The partition key
            should be based on the stable, long-term access patterns of the
            system, not on the current workload.
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Kleppmann, M. (2017). &quot;Designing Data-Intensive
            Applications.&quot; O&apos;Reilly Media. — Chapter 6 provides a
            comprehensive treatment of partitioning strategies, including
            range, hash, and secondary index partitioning.
          </li>
          <li>
            Corbett, J.C., et al. (2013). &quot;Spanner: Google&apos;s
            Globally Distributed Database.&quot; <em>ACM TOCS</em>. — Describes
            Spanner&apos;s directory-based range partitioning and automatic
            range splitting.
          </li>
          <li>
            DeCandia, G., et al. (2007). &quot;Dynamo: Amazon&apos;s Highly
            Available Key-Value Store.&quot; <em>SOSP &apos;07</em>. — Details
            Dynamo&apos;s consistent hashing-based partitioning with virtual
            nodes.
          </li>
          <li>
            Karger, D., et al. (1997). &quot;Consistent Hashing and Random
            Trees.&quot; <em>STOC &apos;97</em>. — The original paper
            introducing consistent hashing with formal proofs.
          </li>
          <li>
            Kreps, J. (2013). &quot;Why Local State Is a Fundamental Primitive
            in Stream Processing.&quot; LinkedIn Engineering Blog. — Discusses
            Kafka&apos;s partitioning strategy and its implications for stream
            processing.
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
