"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-hot-partitions",
  title: "Hot Partitions",
  description:
    "Staff-level deep dive into hot partitions: causes, detection, mitigation strategies, key design for even distribution, and production-scale partitioning patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "hot-partitions",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "hot-partitions", "partitioning", "scalability", "key-design", "sharding"],
  relatedTopics: ["geo-sharding", "database-partitioning", "sharding-strategies", "load-balancers"],
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
          A <strong>hot partition</strong> occurs when one partition in a distributed database
          receives a disproportionate share of read or write traffic compared to other partitions.
          In a well-partitioned system, traffic is evenly distributed across all partitions, and
          each partition handles approximately 1/N of the total load (where N is the number of
          partitions). When one partition becomes hot, it receives 50-90% of the traffic, while
          other partitions sit idle. This creates a bottleneck: the hot partition&apos;s node
          becomes overwhelmed with requests while other nodes are underutilized, and the overall
          system throughput is limited by the hot partition&apos;s capacity rather than the total
          cluster capacity.
        </p>
        <p>
          Consider a social media platform that partitions user data by user ID. When a celebrity
          with 100 million followers posts a message, their partition receives 100 million read
          requests (one from each follower&apos;s feed) while the partitions of ordinary users
          receive only a handful of requests. The celebrity&apos;s partition becomes a hot
          partition: the node hosting it is overwhelmed, request latency spikes, and other
          partitions in the cluster are largely idle. The system&apos;s overall throughput is
          limited by the celebrity partition&apos;s capacity, not by the cluster&apos;s total
          capacity.
        </p>
        <p>
          For staff/principal engineers, hot partitions require understanding the root causes
          (sequential keys, celebrity accounts, timestamp-based partitioning), detection
          mechanisms (monitoring per-partition traffic, identifying skew), and mitigation
          strategies (key salting, sub-partitioning, caching, write coalescing). The challenge
          is that hot partitions are often unpredictable: a previously idle partition can become
          hot when a viral event occurs, and mitigation must be automatic and rapid.
        </p>
        <p>
          The business impact of hot partitions is significant. A single hot partition can
          degrade the performance of an entire cluster, causing increased latency for all users
          (not just those accessing the hot partition), potential cascading failures (the hot
          node crashes, traffic shifts to other nodes, which then become hot), and wasted
          infrastructure capacity (idle partitions represent unused compute and storage).
        </p>
        <p>
          In system design interviews, hot partitions demonstrate understanding of partitioning
          strategies, key design for even distribution, traffic pattern analysis, and the
          trade-offs between partition count, partition size, and load distribution.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/hot-partition-problem.svg`}
          alt="Hot partition problem showing one partition receiving 90% of traffic while others are idle, with causes and effects"
          caption="Hot partition problem — one partition receives 90% of traffic due to sequential keys, celebrity accounts, or timestamp-based partitioning, while other partitions sit idle, limiting overall system throughput"
        />

        <h3>Causes of Hot Partitions</h3>
        <p>
          Hot partitions are caused by uneven key distribution: the partition key maps many
          requests to the same partition. The most common causes are <strong>sequential
          keys</strong> (auto-incrementing IDs, timestamps) where all recent writes go to the
          same partition (the one that holds the highest key range), <strong>celebrity
          accounts</strong> (a single user or entity receives vastly more traffic than others,
          e.g., a celebrity&apos;s profile page receiving millions of views per hour), and
          <strong>timestamp-based partitioning</strong> (partitioning by time, where all writes
          for the current time period go to the same partition).
        </p>
        <p>
          Another cause is <strong>range-based partitioning with skewed data</strong>: if the
          data distribution is not uniform (e.g., most users are in the US, few in other
          countries), range-based partitioning by country code will create hot partitions for
          popular ranges and idle partitions for unpopular ranges. Hash-based partitioning
          reduces this risk but does not eliminate it: if the hash function is weak or the key
          space is small, hash collisions can create hot partitions.
        </p>

        <h3>Detecting Hot Partitions</h3>
        <p>
          Hot partitions are detected through per-partition monitoring. Track the request rate,
          latency, and resource utilization (CPU, memory, disk I/O) for each partition. A hot
          partition will show significantly higher request rate and latency than other
          partitions, and its node will show higher resource utilization. Set alerts on
          partition skew: if the ratio of the busiest partition&apos;s request rate to the
          average request rate exceeds a threshold (e.g., 3x), alert the operations team.
        </p>
        <p>
          Detection must be real-time: hot partitions can emerge within seconds (e.g., a viral
          tweet) and must be mitigated before they cause cascading failures. Implement automated
          detection that identifies hot partitions and triggers mitigation strategies
          automatically, without human intervention.
        </p>

        <h3>Impact on System Throughput</h3>
        <p>
          A hot partition limits the overall system throughput to the capacity of that single
          partition&apos;s node. If a cluster has 100 nodes and one partition is hot, the other
          99 nodes are underutilized, and the system processes requests at approximately 1/100th
          of its theoretical capacity. This is known as the <strong>straggler
          problem</strong>: the slowest (most loaded) partition determines the overall system
          throughput.
        </p>
        <p>
          Hot partitions also cause <strong>cascading failures</strong>: when the hot node
          becomes overwhelmed, it may crash or start rejecting requests. The requests are then
          redirected to other nodes, which may become hot themselves, creating a cascade of
          failures across the cluster. This is particularly dangerous in auto-scaling
          environments, where the cluster may scale up in response to the hot partition, only
          to have the new nodes become hot as well.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/hot-partition-solutions.svg`}
          alt="Hot partition mitigation strategies: key salting, sub-partitioning, caching, and write coalescing with trade-offs for each"
          caption="Hot partition mitigation — key salting distributes writes across sub-partitions, sub-partitioning splits the hot partition, caching absorbs read traffic, and write coalescing batches writes to reduce partition load"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Key Salting</h3>
        <p>
          Key salting is the most common mitigation for hot partitions caused by sequential or
          celebrity keys. The partition key is modified by adding a random suffix (salt) that
          distributes requests across multiple sub-partitions. For example, instead of using
          <code className="inline-code">user_id</code> as the partition key, use
          <code className="inline-code">user_id + &quot;_&quot; + random(0..N-1)</code>, where
          N is the number of sub-partitions. Writes are distributed across all N sub-partitions,
          and reads must query all N sub-partitions and merge the results.
        </p>
        <p>
          Key salting is effective for write-heavy hot partitions because writes are distributed
          across sub-partitions, eliminating the write bottleneck. However, it increases read
          latency because reads must query all N sub-partitions. The trade-off is acceptable for
          write-heavy workloads (celebrity accounts receiving mostly writes) but problematic for
          read-heavy workloads (celebrity accounts receiving mostly reads).
        </p>

        <h3>Sub-Partitioning</h3>
        <p>
          Sub-partitioning splits a hot partition into smaller sub-partitions, each hosted on a
          different node. When a partition becomes hot, the system automatically splits it into
          2-4 sub-partitions, redistributes the data, and updates the routing table. This
          increases the effective capacity of the hot partition by distributing its load across
          multiple nodes.
        </p>
        <p>
          Sub-partitioning is more complex than key salting because it requires dynamic
          partition splitting and data redistribution. However, it does not increase read latency
          (each sub-partition serves a subset of the data) and is effective for both read-heavy
          and write-heavy hot partitions. Sub-partitioning is used by DynamoDB, MongoDB, and
          Cassandra to handle hot partitions automatically.
        </p>

        <h3>Caching and Write Coalescing</h3>
        <p>
          For read-heavy hot partitions, caching is the most effective mitigation. The hot
          partition&apos;s data is cached in a distributed cache (Redis, Memcached) with a short
          TTL (1-5 seconds). Reads are served from the cache, reducing the load on the hot
          partition by 90-99%. Writes are written to the partition and the cache is invalidated
          (or updated with the new value).
        </p>
        <p>
          For write-heavy hot partitions, <strong>write coalescing</strong> batches multiple
          writes to the same partition into a single write operation. Instead of writing each
          update individually, the system collects updates for a short window (100-500ms),
          merges them into a single write, and writes the merged result to the partition. This
          reduces the number of write operations by 10-100x, reducing the partition&apos;s load.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/hash-vs-range-partitioning.svg`}
          alt="Hash partitioning vs range partitioning comparison showing even distribution vs potential hot spots"
          caption="Hash partitioning vs range partitioning — hash partitioning provides even distribution but poor range query performance, while range partitioning enables efficient range queries but is vulnerable to hot partitions when data is skewed"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Hot partition mitigation involves trade-offs between write distribution, read latency,
          operational complexity, and data consistency. Key salting distributes writes evenly
          but increases read latency (must query all sub-partitions). Sub-partitioning increases
          capacity without affecting read latency but requires dynamic data redistribution.
          Caching absorbs read traffic but introduces cache invalidation complexity. Write
          coalescing reduces write operations but introduces write latency (the coalescing
          window).
        </p>
        <p>
          The staff-level insight is that the right mitigation depends on the access pattern.
          For write-heavy hot partitions (celebrity accounts with mostly writes), key salting or
          write coalescing is most effective. For read-heavy hot partitions (celebrity accounts
          with mostly reads), caching is most effective. For mixed workloads, sub-partitioning
          provides the best balance because it handles both reads and writes without significant
          trade-offs.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Design partition keys for even distribution from the start. Avoid sequential keys
          (auto-incrementing IDs, timestamps) as partition keys. Use hash-based partitioning
          with a strong hash function (MurmurHash3, SHA-256) to distribute keys uniformly
          across partitions. If range queries are required, use a composite key that includes
          a hash prefix for distribution and a range suffix for ordering (e.g.,
          <code className="inline-code">hash(user_id) + timestamp</code>).
        </p>
        <p>
          Monitor per-partition traffic continuously and set alerts on partition skew. Track
          the ratio of the busiest partition&apos;s request rate to the average request rate,
          and alert when it exceeds 3x. Implement automated hot partition detection that
          identifies hot partitions and triggers mitigation strategies automatically.
        </p>
        <p>
          Implement automatic sub-partitioning for partitions that exceed a traffic threshold.
          When a partition&apos;s request rate exceeds 80% of its node&apos;s capacity, split
          it into sub-partitions and redistribute the data. This ensures that hot partitions
          are mitigated before they cause cascading failures.
        </p>
        <p>
          Cache read-heavy hot partitions aggressively. For celebrity accounts or viral content,
          implement a distributed cache with a short TTL (1-5 seconds) and cache invalidation
          on writes. This absorbs 90-99% of read traffic, reducing the partition&apos;s load
          to a manageable level.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using sequential or timestamp-based keys as partition keys.
          This guarantees that all recent writes go to the same partition, creating a hot
          partition for every write-heavy workload. The fix is to use hash-based partitioning
          with a strong hash function, or to salt sequential keys with a random prefix to
          distribute writes across sub-partitions.
        </p>
        <p>
          Another common pitfall is not monitoring per-partition traffic. Without per-partition
          metrics, hot partitions go undetected until they cause cascading failures. The fix is
          to instrument every partition with request rate, latency, and resource utilization
          metrics, and set alerts on partition skew (busiest partition / average &gt; 3x).
        </p>
        <p>
          Using key salting for read-heavy workloads is a performance pitfall. Key salting
          distributes writes across sub-partitions but requires reads to query all sub-partitions
          and merge the results. For a read-heavy hot partition, this increases read latency by
          Nx (where N is the number of sub-partitions). The fix is to use caching for read-heavy
          hot partitions instead of key salting.
        </p>
        <p>
          Not planning for partition rebalancing after a hot partition subsides is an
          operational pitfall. When a viral event ends, the hot partition&apos;s traffic returns
          to normal, but the sub-partitions created during the hot period remain, wasting
          resources. The fix is to implement automatic partition merging: when sub-partitions
          fall below a traffic threshold, merge them back into the parent partition and reclaim
          the resources.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Twitter: Celebrity Account Hot Partitions</h3>
        <p>
          Twitter&apos;s most-followed accounts (celebrities, brands, news organizations) receive
          millions of views per hour, creating hot partitions in the user data store. Twitter
          mitigates this through aggressive caching: celebrity profiles and timelines are cached
          in a distributed cache with a short TTL (1-5 seconds), and reads are served from the
          cache. Writes (profile updates, new tweets) are written to the partition and the cache
          is invalidated. This absorbs 99% of read traffic, reducing the partition&apos;s load
          to a manageable level.
        </p>

        <h3>DynamoDB: Automatic Sub-Partitioning</h3>
        <p>
          DynamoDB automatically detects hot partitions and splits them into sub-partitions.
          When a partition&apos;s traffic exceeds the provisioned throughput, DynamoDB splits
          the partition into two sub-partitions, redistributes the data, and updates the routing
          table. This increases the effective capacity of the hot partition by distributing its
          load across two nodes. The split is transparent to the application: the application
          continues to use the same partition key, and DynamoDB handles the routing internally.
        </p>

        <h3>Instagram: Write Coalescing for Like Counts</h3>
        <p>
          Instagram&apos;s photo like counts are a classic hot partition problem: a viral photo
          receives thousands of likes per second, all writing to the same partition. Instagram
          mitigates this through write coalescing: likes are collected in a memory buffer for
          100-500ms, batched into a single write operation (increment count by N), and written
          to the partition. This reduces the number of write operations by 100-1000x, reducing
          the partition&apos;s load to a manageable level.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What causes hot partitions and how do you detect them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Hot partitions are caused by uneven key distribution: sequential keys, celebrity
              accounts, timestamp-based partitioning, or skewed data in range-based partitioning.
              All these causes map many requests to the same partition, overwhelming that
              partition&apos;s node while other nodes are idle.
            </p>
            <p>
              Detect hot partitions through per-partition monitoring: track request rate, latency,
              and resource utilization for each partition. Alert when the ratio of the busiest
              partition&apos;s request rate to the average exceeds a threshold (e.g., 3x).
              Detection must be real-time because hot partitions can emerge within seconds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How does key salting work and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Key salting modifies the partition key by adding a random suffix (salt) that
              distributes requests across multiple sub-partitions. Instead of
              <code className="inline-code">user_id</code>, use
              <code className="inline-code">user_id + &quot;_&quot; + random(0..N-1)</code>.
              Writes are distributed across all N sub-partitions, eliminating the write
              bottleneck.
            </p>
            <p>
              Use key salting for write-heavy hot partitions. Avoid it for read-heavy partitions
              because reads must query all N sub-partitions and merge results, increasing read
              latency by Nx. For read-heavy hot partitions, use caching instead.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How does DynamoDB handle hot partitions automatically?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              DynamoDB monitors per-partition traffic and automatically splits hot partitions
              into sub-partitions. When a partition&apos;s traffic exceeds the provisioned
              throughput, DynamoDB splits it into two sub-partitions, redistributes the data,
              and updates the routing table. The split is transparent to the application.
            </p>
            <p>
              This increases the effective capacity of the hot partition by distributing its
              load across multiple nodes. DynamoDB also merges sub-partitions when traffic
              subsides, reclaiming resources. This automatic sub-partitioning is one of
              DynamoDB&apos;s key advantages over self-managed databases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How would you handle a celebrity account that receives 1 million reads per minute?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              For a read-heavy hot partition like a celebrity account, caching is the most
              effective mitigation. Cache the celebrity&apos;s data in a distributed cache
              (Redis, Memcached) with a short TTL (1-5 seconds). Reads are served from the
              cache, reducing the partition&apos;s load by 99%. Writes (profile updates) are
              written to the partition and the cache is invalidated.
            </p>
            <p>
              Additionally, implement write coalescing for write-heavy operations (likes,
              comments) to batch multiple writes into a single partition write. This reduces
              the write load by 100-1000x. If the partition is still overwhelmed, use
              sub-partitioning to distribute the load across multiple nodes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the straggler problem and how does it relate to hot partitions?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The straggler problem occurs when the slowest (most loaded) partition determines
              the overall system throughput. In a cluster with 100 nodes, if one partition is
              hot and processing requests at 10x the rate of other partitions, the system&apos;s
              overall throughput is limited by the hot partition&apos;s capacity, not by the
              cluster&apos;s total capacity.
            </p>
            <p>
              Hot partitions are the primary cause of the straggler problem in partitioned
              databases. The fix is to distribute the hot partition&apos;s load across multiple
              nodes through sub-partitioning, caching, or key salting, so that no single
              partition becomes the bottleneck.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you prevent hot partitions from causing cascading failures?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Cascading failures occur when a hot node crashes, traffic shifts to other nodes,
              which then become hot and crash. Prevent this through: rate limiting at the
              partition level (cap the request rate per partition to prevent overload), circuit
              breaking (stop sending requests to a partition when it exceeds a latency threshold),
              and automatic sub-partitioning (split hot partitions before they crash).
            </p>
            <p>
              Additionally, implement graceful degradation: when a partition is overwhelmed,
              serve stale cached data rather than failing the request entirely. This maintains
              system availability even when individual partitions are under stress.
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
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DynamoDB: Partition Key Design Best Practices
            </a>{" "}
            — How to design partition keys to avoid hot partitions.
          </li>
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering: Infrastructure Behind Twitter Scale
            </a>{" "}
            — How Twitter handles celebrity account hot partitions.
          </li>
          <li>
            <a
              href="https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              USENIX NSDI: The Infrastructure Behind Instagram
            </a>{" "}
            — How Instagram handles hot partitions for viral content.
          </li>
          <li>
            <a
              href="https://docs.mongodb.com/manual/core/sharding/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MongoDB: Sharding and Hot Partitions
            </a>{" "}
            — How MongoDB detects and handles hot chunks.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 6
            (Partitioning).
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog: Partitioning at Scale
            </a>{" "}
            — How Netflix handles hot partitions in its data platform.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
