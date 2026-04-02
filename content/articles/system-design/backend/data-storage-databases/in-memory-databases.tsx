"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-in-memory-databases",
  title: "In-Memory Databases",
  description: "Comprehensive guide to in-memory databases covering Redis, Memcached, data structures, persistence strategies, eviction policies, and production considerations for low-latency systems.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "in-memory-databases",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: ["backend", "database", "in-memory", "redis", "caching", "low-latency"],
  relatedTopics: ["key-value-stores", "caching-strategies", "database-indexes"],
};

export default function InMemoryDatabasesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>In-memory databases</strong> store data primarily in RAM rather than on disk, enabling microsecond read latency and hundred-thousands of operations per second. Unlike disk-based databases that must seek and read from storage, in-memory databases access data directly from memory. Popular examples include Redis (rich data structures with optional persistence), Memcached (simple key-value caching), and Apache Ignite (distributed in-memory computing).
        </p>
        <p>
          The distinction matters for system design: in-memory databases excel at caching (reduce database load), session storage (user sessions on every request), real-time analytics (sub-second aggregations), and leaderboards (sorted set operations). Disk-based databases excel at durable storage where data loss is unacceptable. In-memory databases trade durability for speed—data is lost on power failure unless persistence is configured.
        </p>
        <p>
          For staff-level engineers, understanding in-memory database trade-offs is essential for caching architecture and low-latency systems. Key decisions include: persistence strategy (RDB snapshots vs AOF logs), eviction policy (LRU, LFU, TTL), data structures (strings, hashes, sorted sets, bitmaps), and replication (master-replica, sentinel, cluster). The right choice depends on data criticality: can you tolerate data loss for speed? What latency SLOs do you need?
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/in-memory-redis-architecture.svg"
          alt="In-memory database architecture"
          caption="In-memory database showing master-replica replication, persistence modes, and eviction policies"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-4">
          <li>
            <strong>RAM-Based Storage:</strong> Data resides in memory, enabling O(1) access time regardless of data size. Redis achieves 100,000+ operations/second per node with microsecond latency. Memory is expensive ($0.02-0.05/GB/hour) compared to disk ($0.0001/GB/hour), so in-memory databases are best for hot data (frequently accessed) rather than cold storage. RAM provides random access—any key can be retrieved in constant time, unlike disk which requires seeking.
          </li>
          <li>
            <strong>Persistence Modes:</strong> In-memory databases offer optional persistence. RDB (Redis Database) creates point-in-time snapshots—fast recovery but potential data loss between snapshots. AOF (Append-Only File) logs every write—slower recovery but minimal data loss. Hybrid approaches combine both (RDB for fast recovery, AOF for durability). Choose based on RPO (recovery point objective). Snapshots are compact but may lose minutes of data. AOF is verbose but loses at most one second of data.
          </li>
          <li>
            <strong>Eviction Policies:</strong> When memory is full, in-memory databases evict keys to make room. LRU (Least Recently Used) evicts oldest accessed keys—good for caches. LFU (Least Frequently Used) evicts least accessed keys—good for hot data. TTL-based eviction removes expired keys. No eviction blocks writes when full (dangerous for production). Configure based on use case. Eviction is a symptom of undersized memory—scale before eviction triggers.
          </li>
          <li>
            <strong>Data Structures:</strong> Redis supports multiple data types beyond simple key-value: strings (basic key-value), hashes (object fields), lists (queues), sets (unique items), sorted sets (leaderboards), bitmaps (boolean flags), hyperloglogs (cardinality estimation). Each type enables specific operations (LPUSH for lists, ZADD for sorted sets, PFCOUNT for hyperloglogs). Choose data structure based on access pattern—don't force all data into strings.
          </li>
          <li>
            <strong>Replication and Clustering:</strong> Master-replica replication provides read scaling and failover. Redis Sentinel automates failover. Redis Cluster provides horizontal sharding across nodes. Memcached uses client-side sharding. Replication is asynchronous—replicas may lag behind master. Configure based on availability requirements. Clustering enables horizontal scale but adds complexity (cross-node operations slower).
          </li>
          <li>
            <strong>Atomic Operations:</strong> In-memory databases provide atomic operations on data structures. INCR/DECR for counters (atomic increment). LPUSH/BRPOP for queues (atomic push/pop). ZADD for sorted sets (atomic score update). Atomic operations prevent race conditions without explicit locking. Use atomic operations for counters, queues, and leaderboards. Complex multi-step operations require transactions (MULTI/EXEC) or Lua scripts.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/in-memory-data-structures.svg"
          alt="In-memory database data structures"
          caption="Redis data structures showing strings, hashes, lists, sets, sorted sets, and their use cases"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">In-Memory Databases</th>
              <th className="p-3 text-left">Disk-Based Databases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Latency</strong>
              </td>
              <td className="p-3">
                • Microsecond reads
                <br />
                • 100K+ ops/second
                <br />
                • O(1) access time
              </td>
              <td className="p-3">
                • Millisecond reads
                <br />
                • 1K-10K ops/second
                <br />
                • Disk I/O dependent
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Durability</strong>
              </td>
              <td className="p-3">
                • Volatile (data lost on crash)
                <br />
                • Persistence optional
                <br />
                • RPO depends on config
              </td>
              <td className="p-3">
                • Durable by default
                <br />
                • WAL ensures durability
                <br />
                • Zero data loss typical
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Cost</strong>
              </td>
              <td className="p-3">
                • Expensive (RAM cost)
                <br />
                • $0.02-0.05/GB/hour
                <br />
                • Limited by memory size
              </td>
              <td className="p-3">
                • Cheap (disk cost)
                <br />
                • $0.0001/GB/hour
                <br />
                • Scales to petabytes
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Use Cases</strong>
              </td>
              <td className="p-3">
                • Caching layers
                <br />
                • Session storage
                <br />
                • Real-time analytics
              </td>
              <td className="p-3">
                • Primary data store
                <br />
                • Transactional systems
                <br />
                • Historical data
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/in-memory-tradeoffs.svg"
          alt="In-memory database trade-offs"
          caption="Trade-offs between in-memory and disk-based databases showing latency, durability, and cost comparisons"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Configure Persistence Based on RPO:</strong> Choose persistence strategy based on acceptable data loss. For caches (can rebuild from database): no persistence or RDB snapshots hourly. For session storage (user experience impacted): AOF with fsync every second. For critical data (financial, counters): AOF with fsync every write. Test restore procedures regularly—verify RTO (recovery time objective) meets requirements. Document persistence configuration for each use case.
          </li>
          <li>
            <strong>Set Appropriate Eviction Policy:</strong> For caches: use LRU or LFU eviction with maxmemory limit. For session storage: disable eviction (use TTL instead—sessions expire naturally). For leaderboards/counters: disable eviction (data must persist). Monitor memory usage and alert at 80 percent capacity. Eviction is a symptom of undersized memory—scale up before eviction triggers. Use ALLKEYS policies for mixed data, VOLATILE policies for TTL-only eviction.
          </li>
          <li>
            <strong>Use Appropriate Data Structures:</strong> Choose data structures based on access patterns. Strings for simple caching. Hashes for objects (saves memory vs multiple keys). Lists for queues (LPUSH/BRPOP). Sets for unique items (SADD, SISMEMBER). Sorted sets for leaderboards (ZADD, ZRANGE). Bitmaps for boolean flags (SETBIT, GETBIT). HyperLogLog for cardinality estimation (PFADD, PFCOUNT). Match data structure to operation needs.
          </li>
          <li>
            <strong>Implement Key Namespacing:</strong> Use consistent key naming with prefixes for organization and access control. Example: app:user:123:profile, app:session:abc123, cache:product:456. Namespaces enable: selective clearing (delete cache:product:*), access control (grant access by prefix), monitoring (track memory by namespace). Document naming conventions for team consistency. Avoid flat key namespaces (hard to manage at scale).
          </li>
          <li>
            <strong>Monitor Critical Metrics:</strong> Track memory usage (alert at 80 percent), eviction rate (should be zero for non-caches), hit rate (for caches—target 90 percent+), replication lag (for replicas—alert on seconds), persistence status (last save time, AOF rewrite status). Use Redis INFO command or cloud provider metrics. Set up alerts for anomalies. Monitor command latency (P99 latency spikes indicate problems).
          </li>
          <li>
            <strong>Plan for Failover:</strong> Configure master-replica replication for high availability. Use Redis Sentinel for automatic failover. Test failover procedures regularly (simulate master failure). Configure clients with multiple endpoint addresses. For critical systems, use Redis Cluster (automatic sharding and failover). Document failover procedures and RTO expectations.
          </li>
        </ol>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-4">
          <li>
            <strong>Redis for Session Storage (Twitter):</strong> Twitter stores user sessions in Redis with TTL (24 hours). Sessions accessed on every request—microsecond latency critical. Redis provides horizontal scaling with Cluster, automatic expiration, and high availability with Sentinel. Session data includes user_id, permissions, last_activity. If Redis fails, users must re-login—AOF persistence configured for minimal data loss. Sessions replicated across multiple nodes for redundancy.
          </li>
          <li>
            <strong>Memcached for Database Caching (Facebook):</strong> Facebook uses Memcached to cache frequently accessed data (user profiles, feed data). Memcached is simple (key-value only), fast, and scales horizontally with client-side sharding. Cache hit rate exceeds 95 percent—dramatically reduces database load. TTL-based expiration ensures stale data refreshes. No persistence needed—cache rebuilds from database on miss. Memcached's simplicity is a feature (no complex data structures to manage).
          </li>
          <li>
            <strong>Redis for Rate Limiting (GitHub):</strong> GitHub uses Redis for API rate limiting. Each API request increments a counter (INCR command) with TTL (1 hour). Redis atomic operations prevent race conditions. Sorted sets track request timestamps for sliding window rate limiting. Sub-millisecond latency ensures rate limiting doesn't become bottleneck. If Redis fails, rate limiting disabled (fail-open) to maintain availability. Rate limits enforced at edge (CDN) for DDoS protection.
          </li>
          <li>
            <strong>Redis for Leaderboards (Gaming Platforms):</strong> Gaming platforms use Redis sorted sets for real-time leaderboards. Players stored as members with scores (ZADD command). Leaderboard queries retrieve top N players (ZRANGE 0 99). Sorted sets maintain order automatically—no sorting needed on read. Updates are atomic—concurrent score updates handled correctly. Sub-millisecond latency enables real-time score updates during gameplay. Leaderboards cached at edge for global access.
          </li>
          <li>
            <strong>Redis for Real-Time Analytics (Ad Tech):</strong> Ad tech platforms use Redis for real-time analytics—click counts, impression counts, conversion tracking. HyperLogLog provides cardinality estimation (unique users) with 1 percent error using 12KB memory. Bitmaps track user actions efficiently (1 bit per user-action pair). Aggregations computed in real-time using Redis commands. Data expires after campaign ends (TTL). Analytics dashboard queries Redis directly for sub-second response times.
          </li>
          <li>
            <strong>Redis for Pub/Sub Messaging (Chat Applications):</strong> Chat applications use Redis Pub/Sub for real-time message delivery. Publishers send messages to channels, subscribers receive messages instantly. Redis handles message fanout efficiently (one-to-many delivery). Channels organized by room/topic (chat:room:123). Messages also persisted to database for history. Redis provides low-latency message delivery (sub-millisecond). Pub/Sub scales with Redis Cluster for high throughput.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Control</h3>
          <ul className="space-y-2">
            <li>
              <strong>Authentication:</strong> Enable authentication (Redis AUTH, AWS IAM for ElastiCache). Never expose in-memory databases to public internet. Use VPC/private networking. Rotate credentials regularly. Use service accounts with minimal privileges. Disable dangerous commands in production (FLUSHALL, DEBUG).
            </li>
            <li>
              <strong>Authorization:</strong> Implement key-level access control for multi-tenant systems. Use key prefixes for tenant isolation (tenant:acme:*, tenant:globex:*). Redis 6+ supports ACLs with per-user permissions. Implement application-level authorization checks. Restrict commands by user role (read-only users, admin users).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Protection</h3>
          <ul className="space-y-2">
            <li>
              <strong>Encryption at Rest:</strong> Enable encryption for persistence files (RDB, AOF). Redis 6+ supports encryption at rest. Protects against data theft from disk access. Note: in-memory data is vulnerable while running—protect network access. Use encrypted EBS volumes for persistence files.
            </li>
            <li>
              <strong>Encryption in Transit:</strong> Use TLS for all client connections. Redis 6+ supports TLS. Memcached supports TLS via stunnel. Prevents eavesdropping and man-in-the-middle attacks. Verify certificates on client side. Use mutual TLS for service-to-service communication.
            </li>
            <li>
              <strong>Data Masking:</strong> Mask sensitive data in logs and monitoring. Don't log full session data or PII. Use Redis SCAN instead of KEYS (KEYS blocks server). Audit access to sensitive keys (payment data, PII). Implement data retention policies (auto-delete old data).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Network Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Network Isolation:</strong> Place in-memory databases in private subnets. Use security groups to restrict access (only application servers). Don't assign public IP addresses. Use VPC peering for cross-VPC access. Implement network monitoring for unusual traffic patterns.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Implement rate limiting at network level (prevent DoS). Use connection pooling to limit concurrent connections. Configure maxclients to prevent connection exhaustion. Monitor connection counts and alert on spikes.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Optimization</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Latency Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Use Pipelining:</strong> Batch multiple commands in single round-trip. Redis pipelining sends multiple commands without waiting for individual responses. Reduces network latency from N × RTT to 1 × RTT. Use for bulk operations (multi-get, multi-set). Pipeline size affects memory usage (balance latency vs memory).
            </li>
            <li>
              <strong>Implement Local Caching:</strong> Cache hot keys in application memory (in-process cache like Guava, Caffeine). Reduces network round-trips for frequently accessed keys. Use TTL to prevent stale data. Implement cache invalidation on updates. Local cache + Redis provides two-tier caching (nanosecond + microsecond latency).
            </li>
            <li>
              <strong>Avoid Blocking Commands:</strong> Commands like KEYS, SMEMBERS on large sets block the server. Use SCAN instead of KEYS (incremental iteration). Use ZRANGEBYSCORE with LIMIT instead of full range queries. Monitor slow log for blocking commands. Set timeout for long-running commands.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Memory Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Use Efficient Data Structures:</strong> Hashes are more memory-efficient than strings for objects (single key vs multiple keys). Use hash tags to co-locate related keys in cluster. Bitmaps are memory-efficient for boolean flags (1 bit per flag). Use INTSET for small integer sets (more compact than regular sets).
            </li>
            <li>
              <strong>Configure Maxmemory:</strong> Set maxmemory limit below physical memory (leave room for OS, replication buffers). Monitor memory usage and alert at 80 percent. Scale vertically (more RAM) or horizontally (more nodes) before hitting limit. Use memory profiling (MEMORY USAGE command) to identify large keys.
            </li>
            <li>
              <strong>Compress Large Values:</strong> Compress large values before storage. Use compression libraries (gzip, lz4, snappy). Trade CPU for memory. Beneficial when values are large (more than 1KB) and compressible (JSON, text). Decompression adds latency—measure trade-off.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Replication Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Async Replication:</strong> Redis replication is asynchronous—doesn't block master. Configure repl-backlog-size for partial resync. Monitor replication lag (INFO replication). Lag spikes indicate network issues or replica overload. Use read replicas for read scaling (distribute read load).
            </li>
            <li>
              <strong>Cluster Configuration:</strong> Redis Cluster provides automatic sharding. Configure cluster-node-timeout for failure detection. Use cluster-slave-validity-factor to prevent stale replicas from becoming master. Monitor cluster state (CLUSTER INFO). Rebalance slots when adding/removing nodes.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Memory:</strong> In-memory databases require RAM for all data. Estimate: $0.02-0.05/GB/hour for managed Redis (ElastiCache, Memorystore). For 100GB dataset: $72-180/month. Self-hosted on EC2: $0.01-0.03/GB/hour (lower cost but operational overhead). Memory costs dominate—optimize data structures to reduce memory footprint.
            </li>
            <li>
              <strong>Compute:</strong> In-memory databases are CPU-efficient for simple operations. Estimate: 1-2 vCPU per 10GB dataset for moderate workloads. Scale vertically for more throughput, horizontally for more capacity. CPU costs secondary to memory costs.
            </li>
            <li>
              <strong>Network:</strong> Cross-AZ replication consumes network bandwidth. Estimate: 10-20 percent of write volume for replication traffic. Cross-region replication adds latency and cost. Use same-AZ replicas for low-latency reads. Cross-region replicas for disaster recovery.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Operational Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Managed Services:</strong> ElastiCache, Memorystore provide managed deployments. Estimate: $0.10-0.50/hour for small instances, $1-5/hour for large instances. Reduces operational overhead but increases cost vs self-hosted. Managed services include backups, patching, monitoring.
            </li>
            <li>
              <strong>Monitoring:</strong> Track memory usage, latency percentiles, hit rates, eviction rates. Use managed monitoring (CloudWatch, Stackdriver) or database-native tools (Redis INFO, Redis Monitor). Estimate: $100-300/month for comprehensive monitoring. Alert on memory pressure, high latency, replication lag.
            </li>
            <li>
              <strong>Backup Storage:</strong> Persistence files (RDB, AOF) require storage. Estimate: 1-2x dataset size for backups. Backup storage: $0.05-0.10/GB/month. Test restore procedures regularly—verify backup integrity.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Total Cost of Ownership</h3>
          <ul className="space-y-2">
            <li>
              <strong>TCO Calculation:</strong> TCO = Infrastructure (memory + compute + network) + Operational (monitoring + backup + management). For 100GB Redis cluster: $500-1500/month managed, $200-500/month self-hosted. Self-hosted requires DBA time (estimate 10-20 hours/month). Factor in operational effort when comparing managed vs self-hosted.
            </li>
            <li>
              <strong>Cost Optimization:</strong> Use appropriate instance sizes (right-size for workload). Use spot instances for non-critical caches. Implement data expiration (TTL) to reduce memory usage. Use compression for large values. Monitor and eliminate unused keys.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use an in-memory database?</p>
            <p className="mt-2 text-sm">
              A: In-memory databases provide microsecond latency and 100,000+ operations/second by storing data in RAM instead of disk. Use cases: caching layers (reduce database load, improve response times), session storage (user sessions accessed on every request), real-time analytics (sub-second aggregations), leaderboards (sorted set operations), rate limiting (atomic counters). Trade-off: in-memory databases are volatile—data is lost on power failure unless persistence is configured. Memory is expensive compared to disk, so in-memory databases are best for hot data (frequently accessed) rather than cold storage. Choose based on latency requirements and data criticality.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are common persistence modes in Redis?</p>
            <p className="mt-2 text-sm">
              A: Redis offers two persistence modes: RDB (Redis Database) and AOF (Append-Only File). RDB creates point-in-time snapshots at configured intervals (every 5 minutes, every hour). Advantages: fast recovery (load single file), compact files for backups. Disadvantages: potential data loss between snapshots. AOF logs every write operation. Advantages: minimal data loss (fsync every second or every write), durable. Disadvantages: slower recovery (replay all commands), larger files. Hybrid approach: use both RDB (fast recovery) and AOF (durability). Choose based on RPO (recovery point objective): no persistence for caches, RDB for rebuildable data, AOF for critical data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage memory pressure in in-memory databases?</p>
            <p className="mt-2 text-sm">
              A: Memory pressure occurs when in-memory database approaches capacity. Strategies: (1) Set maxmemory limit—configure below physical memory (leave room for OS, replication buffers). (2) Configure eviction policy—LRU (least recently used) for caches, LFU (least frequently used) for hot data, no eviction for critical data. (3) Use TTLs—set expiration on temporary data (sessions, caches). (4) Monitor and alert—track memory usage, alert at 80 percent capacity. (5) Scale before hitting limit—add more nodes (horizontal) or upgrade to larger instance (vertical). Eviction is a symptom of undersized memory—address root cause before eviction triggers in production.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main risk with in-memory databases?</p>
            <p className="mt-2 text-sm">
              A: The main risk is data loss on failure. In-memory databases store data in RAM, which is volatile—power failure, crash, or restart loses all data unless persistence is configured. Mitigation: configure persistence (RDB snapshots, AOF logs), use replication (master-replica for failover), implement application-level durability (write to database and in-memory store), accept data loss for caches (rebuild from database on miss). Choose persistence based on data criticality: no persistence for caches (rebuildable), AOF for session storage (user experience), AOF with fsync every write for critical data (counters, financial). Understand and document acceptable data loss (RPO) for each use case.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose Redis over Memcached?</p>
            <p className="mt-2 text-sm">
              A: Choose Redis when: complex data structures needed (hashes, lists, sets, sorted sets), persistence required (RDB/AOF), advanced operations needed (pub/sub, Lua scripting, transactions), leaderboards/ranking needed (sorted sets), bit operations needed (bitmaps for flags). Use cases: session storage, real-time analytics, leaderboards, rate limiting, pub/sub messaging. Choose Memcached when: simple key-value caching sufficient, multi-threaded performance needed (Memcached uses multiple cores better), simpler deployment preferred. Use cases: database query caching, object caching, HTML fragment caching. Trade-off: Redis more feature-rich but single-threaded; Memcached simpler but multi-threaded.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle high availability for in-memory databases?</p>
            <p className="mt-2 text-sm">
              A: High availability strategies: (1) Master-replica replication—replicas sync from master, serve reads, take over on failover. Redis Sentinel automates failover (detects master failure, promotes replica). (2) Redis Cluster—horizontal sharding across nodes with automatic failover. Each shard has master and replicas. (3) Managed services—ElastiCache, Memorystore provide built-in HA with automatic failover. (4) Application-level redundancy—write to multiple Redis instances, read from any available. Trade-offs: replication adds latency (async sync), Cluster adds complexity (client must handle sharding), managed services cost more. Choose based on availability requirements: Sentinel for 99.9 percent, Cluster for 99.99 percent, managed for operational simplicity.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://redis.io/docs/latest/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis Documentation — Latest Version
            </a>
          </li>
          <li>
            <a
              href="https://memcached.org/about/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Memcached Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS ElastiCache Documentation
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/docs/latest/develop/use/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — Common Design Patterns
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/caching/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Caching Strategies
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
