"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-scalability-strategy-extensive",
  title: "Scalability Strategy",
  description: "Comprehensive guide to backend scalability strategy, covering horizontal vs vertical scaling, database sharding, load balancing, auto-scaling patterns, and trade-offs for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "scalability-strategy",
  version: "extensive",
  wordCount: 12500,
  readingTime: 50,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "scalability", "distributed-systems", "load-balancing", "sharding", "auto-scaling"],
  relatedTopics: ["high-availability", "fault-tolerance", "database-selection", "load-balancing"],
};

export default function ScalabilityStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Scalability</strong> is the ability of a system to handle increased load by adding resources
          while maintaining acceptable performance levels. It is not a feature you add — it is an emergent
          property of your architecture, shaped by every design decision from data modeling to deployment
          strategy.
        </p>
        <p>
          In system design interviews, scalability is often the first non-functional requirement discussed
          because it fundamentally constrains or enables every other aspect of the system. When an interviewer
          asks "How would you design Twitter?" or "How would you build a URL shortener?", they are implicitly
          asking: "How does this system scale to millions or billions of users?"
        </p>
        <p>
          Scalability must be quantified with specific metrics. Vague statements like "the system should scale"
          are insufficient. Instead, define scalability targets in terms of:
        </p>
        <ul>
          <li>
            <strong>Throughput:</strong> Requests per second (RPS), queries per second (QPS), or transactions
            per second (TPS). Example: "The API must handle 100,000 RPS at peak."
          </li>
          <li>
            <strong>Concurrent Users:</strong> Number of simultaneous active users. Example: "Support 1 million
            concurrent users during peak hours."
          </li>
          <li>
            <strong>Data Volume:</strong> Storage requirements and growth rate. Example: "Store 10 TB of user
            data with 10% monthly growth."
          </li>
          <li>
            <strong>Latency Under Load:</strong> Response time at target throughput. Example: "P99 latency under
            200ms at 50,000 RPS."
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Scalability vs Performance</h3>
          <p>
            <strong>Performance</strong> is about how fast your system responds under a given load.
            <strong>Scalability</strong> is about how well your system maintains performance as load increases.
            A system can have excellent performance at 1,000 RPS but fail catastrophically at 10,000 RPS — that
            system is performant but not scalable.
          </p>
          <p className="mt-3">
            In interviews, always clarify whether the problem is performance (optimizing existing capacity) or
            scalability (adding capacity to handle growth).
          </p>
        </div>

        <p>
          Scalability is not free. Every scaling technique introduces complexity, cost, or both. The art of
          system design is choosing the simplest architecture that meets your scalability targets while leaving
          room for future growth. This requires understanding not just how to scale, but when to scale and when
          to hold back.
        </p>
      </section>

      <section>
        <h2>Horizontal vs Vertical Scaling</h2>
        <p>
          The first decision in any scalability discussion is whether to scale horizontally or vertically.
          This choice cascades through every layer of your architecture.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vertical Scaling (Scale Up)</h3>
        <p>
          <strong>Vertical scaling</strong> means adding more power to existing machines: more CPU cores, more
          RAM, faster disks, better network interfaces. It is the simplest form of scaling because it requires
          no changes to your application architecture.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Simplicity:</strong> No code changes required. Your application runs on a bigger machine.
          </li>
          <li>
            <strong>Stateful workloads:</strong> Databases with complex joins, monolithic applications, and
            stateful services scale vertically naturally.
          </li>
          <li>
            <strong>Low operational overhead:</strong> One server to manage, one IP address, one set of
            credentials.
          </li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Hardware ceiling:</strong> There is a physical limit to how big a single machine can be.
            The largest EC2 instance (u-24tb1) has 448 vCPUs and 24 TB RAM — impressive, but finite.
          </li>
          <li>
            <strong>Downtime required:</strong> Upgrading typically requires stopping the instance, changing
            type, and restarting. For stateful services, this means planned maintenance windows.
          </li>
          <li>
            <strong>Exponential cost:</strong> Hardware costs do not scale linearly. A machine with 2× the CPU
            often costs 3-4× more.
          </li>
          <li>
            <strong>Single point of failure:</strong> One massive server is still one server. If it fails,
            your entire system is down.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Horizontal Scaling (Scale Out)</h3>
        <p>
          <strong>Horizontal scaling</strong> means adding more machines to your pool. Instead of one 32-core
          server, you have four 8-core servers. This is the foundation of modern distributed systems.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Near-linear scalability:</strong> In theory, doubling your servers doubles your capacity.
            In practice, you get 80-90% efficiency due to coordination overhead.
          </li>
          <li>
            <strong>High availability:</strong> With multiple servers, you can tolerate failures. One server
            goes down, others pick up the load.
          </li>
          <li>
            <strong>No downtime:</strong> Add or remove servers without interrupting service. This enables
            auto-scaling based on demand.
          </li>
          <li>
            <strong>Linear cost:</strong> Commodity hardware is cheap. Ten $100/month servers cost less than
            one $1,500/month server with equivalent total capacity.
          </li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>
            <strong>Complexity:</strong> You now have a distributed system. You need load balancing, service
            discovery, distributed state management, and failure handling.
          </li>
          <li>
            <strong>State management:</strong> Stateless services (web servers, API gateways) scale horizontally
            easily. Stateful services (databases, caches) require sharding, replication, or distributed data
            structures.
          </li>
          <li>
            <strong>Network overhead:</strong> Inter-server communication adds latency. A query that required
            one database lookup now requires coordination across multiple shards.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/backend-nfr/scalability-strategies-comparison.svg"
          alt="Horizontal vs Vertical Scaling Comparison"
          caption="Horizontal vs Vertical Scaling — showing the trade-offs between scaling up (bigger servers) and scaling out (more servers) with characteristics and use cases"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Interview Framework: Choosing Your Approach</h3>
          <p>
            In interviews, start with vertical scaling for simplicity, then explain when and why you would
            transition to horizontal scaling:
          </p>
          <ul className="mt-3 space-y-2">
            <li><strong>Phase 1 (0-10K users):</strong> Single powerful server. Focus on product-market fit, not premature optimization.</li>
            <li><strong>Phase 2 (10K-100K users):</strong> Vertical scaling until you hit hardware or cost limits.</li>
            <li><strong>Phase 3 (100K-1M users):</strong> Horizontal scaling for stateless services (web tier, API tier).</li>
            <li><strong>Phase 4 (1M+ users):</strong> Horizontal scaling for stateful services (database sharding, distributed caches).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Database Scalability Patterns</h2>
        <p>
          Databases are often the hardest component to scale because they are stateful. Unlike web servers
          where you can add instances behind a load balancer, databases require careful consideration of data
          distribution, consistency, and query patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Read Replicas</h3>
        <p>
          <strong>Read replicas</strong> are the simplest database scaling technique. You maintain one primary
          (master) database for writes and multiple replicas (slaves) for reads. The primary replicates data to
          replicas asynchronously or semi-synchronously.
        </p>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>Read-heavy workloads (90%+ reads): Social media feeds, content management, analytics dashboards.</li>
          <li>Geographic distribution: Place replicas closer to users in different regions.</li>
          <li>Analytics isolation: Run heavy analytical queries on replicas without impacting primary performance.</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>
            <strong>Replication lag:</strong> Asynchronous replication means replicas may be seconds behind.
            Users may see stale data immediately after writing.
          </li>
          <li>
            <strong>Write bottleneck:</strong> All writes go to the primary. If writes scale faster than reads,
            read replicas do not help.
          </li>
          <li>
            <strong>Failover complexity:</strong> If the primary fails, promoting a replica requires careful
            handling to avoid data loss or split-brain scenarios.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Sharding</h3>
        <p>
          <strong>Sharding</strong> is horizontal partitioning of a database. Instead of one database holding
          all data, you split data across multiple databases (shards) based on a shard key. Each shard is
          independent and holds a subset of the data.
        </p>
        <p>
          <strong>Shard Key Selection:</strong> The shard key determines how data is distributed. Common choices:
        </p>
        <ul>
          <li>
            <strong>User ID:</strong> All data for a user lives on one shard. Good for user-centric applications
            (social networks, SaaS).
          </li>
          <li>
            <strong>Geographic region:</strong> Users in US go to US shard, EU users to EU shard. Helps with
            data residency and latency.
          </li>
          <li>
            <strong>Hash of key:</strong> hash(user_id) % num_shards. Provides even distribution but makes
            range queries difficult.
          </li>
          <li>
            <strong>Range-based:</strong> Shard 1: A-M, Shard 2: N-Z. Good for range queries but can cause
            data skew.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/backend-nfr/database-sharding-strategies.svg"
          alt="Database Sharding Strategies"
          caption="Database Sharding — showing shard key selection, sharding strategies (hash-based, range-based, directory-based), and rebalancing considerations"
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Sharding Best Practices</h3>
          <ul className="space-y-2">
            <li>
              <strong>Choose high-cardinality keys:</strong> Avoid low-cardinality fields like status or
              category. You want many unique values for even distribution.
            </li>
            <li>
              <strong>Avoid hotspots:</strong> If one shard gets 90% of traffic, you have not solved scaling.
              Analyze access patterns before choosing shard key.
            </li>
            <li>
              <strong>Plan for rebalancing:</strong> As data grows, you will need to add shards. Use consistent
              hashing to minimize data movement during rebalancing.
            </li>
            <li>
              <strong>Design for cross-shard queries:</strong> Avoid joins across shards. Denormalize data or
              use application-level joins when necessary.
            </li>
          </ul>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sharding Strategies</h3>
        <p>
          <strong>Hash-Based Sharding:</strong> Apply a hash function to the shard key and use modulo to
          determine the shard. This provides even distribution but makes range queries inefficient (you must
          query all shards).
        </p>
        <p>
          <strong>Range-Based Sharding:</strong> Assign ranges of keys to shards (e.g., user_id 1-1000000 to
          shard 1, 1000001-2000000 to shard 2). Range queries are efficient, but data skew is a risk if some
          ranges are more popular.
        </p>
        <p>
          <strong>Directory-Based Sharding:</strong> Maintain a lookup service that maps keys to shards. This
          provides flexibility (you can change the mapping) but introduces a single point of failure. The lookup
          service itself must be highly available and cached aggressively.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sharding Challenges</h3>
        <p>
          <strong>Cross-Shard Joins:</strong> Joining data across shards is expensive. You must query multiple
          shards and merge results in the application layer. Avoid relational patterns that require frequent
          cross-shard joins.
        </p>
        <p>
          <strong>Rebalancing:</strong> When you add a new shard, you must redistribute data. With naive
          hashing, adding one shard requires moving most data. Consistent hashing minimizes this — only K/N
          keys need to move when adding a shard.
        </p>
        <p>
          <strong>Transaction complexity:</strong> Distributed transactions across shards are slow and complex.
          Use saga patterns or eventual consistency when possible.
        </p>
      </section>

      <section>
        <h2>Load Balancing Patterns</h2>
        <p>
          Load balancing is the foundation of horizontal scaling. It distributes incoming requests across
          multiple servers, preventing any single server from becoming a bottleneck.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 4 vs Layer 7 Load Balancing</h3>
        <p>
          <strong>Layer 4 (Transport Layer)</strong> load balancers route traffic based on IP address and port
          (TCP/UDP). They are fast and simple but have no visibility into the actual content of requests.
        </p>
        <p>
          <strong>Layer 7 (Application Layer)</strong> load balancers route based on HTTP headers, URL path,
          cookies, or even request body. They enable sophisticated routing rules but add latency due to
          request inspection.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">When to Use Each</h3>
          <ul className="space-y-2">
            <li><strong>Layer 4:</strong> High-throughput scenarios, simple round-robin distribution, TCP services (databases, Redis).</li>
            <li><strong>Layer 7:</strong> Microservices routing, A/B testing, canary deployments, SSL termination, content-based routing.</li>
          </ul>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Balancing Algorithms</h3>
        <p>
          <strong>Round Robin:</strong> Distribute requests sequentially across servers. Simple and fair, but
          ignores server load. A slow server gets the same traffic as a fast server.
        </p>
        <p>
          <strong>Least Connections:</strong> Route to the server with fewest active connections. Better for
          varying server capacities and long-lived connections (WebSockets, database connections).
        </p>
        <p>
          <strong>IP Hash:</strong> Hash the client IP to determine the server. Provides session affinity
          (same client always reaches same server) but can cause imbalance if traffic is not evenly distributed
          across IPs.
        </p>
        <p>
          <strong>Weighted Algorithms:</strong> Assign weights to servers based on capacity. A server with
          weight 2 gets twice the traffic of a server with weight 1. Useful for heterogeneous clusters.
        </p>

        <ArticleImage
          src="/diagrams/backend-nfr/load-balancing-patterns.svg"
          alt="Load Balancing Patterns"
          caption="Load Balancing Patterns — showing Layer 4 vs Layer 7 balancing, algorithms (round robin, least connections, IP hash), health checks, and session affinity"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Health Checks & Failover</h3>
        <p>
          Load balancers must detect and avoid unhealthy servers. There are two approaches:
        </p>
        <p>
          <strong>Active Health Checks:</strong> The load balancer periodically sends probes (HTTP requests or
          TCP connections) to each server. If a server fails to respond correctly, it is marked unhealthy and
          removed from the pool. Typical interval: 5-10 seconds.
        </p>
        <p>
          <strong>Passive Health Checks:</strong> The load balancer monitors actual request failures. If a
          server returns 5xx errors or times out repeatedly, it is temporarily removed. This adds no extra
          traffic but may be slower to detect failures.
        </p>
        <p>
          <strong>Circuit Breaker:</strong> A pattern where the load balancer "opens the circuit" for a server
          after repeated failures, immediately returning errors without attempting to contact the server. After
          a cooldown period, it tries again with a test request.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Affinity (Sticky Sessions)</h3>
        <p>
          Some applications require that a user&apos;s requests always reach the same server. This is called
          <strong>session affinity</strong> or sticky sessions.
        </p>
        <p>
          <strong>Cookie-Based Affinity:</strong> The load balancer sets a cookie with a server ID. Subsequent
          requests with that cookie are routed to the same server. Simple and widely supported.
        </p>
        <p>
          <strong>IP-Based Affinity:</strong> Requests from the same IP always go to the same server. This
          breaks when clients are behind NAT or proxies (many users share one IP).
        </p>
        <p>
          <strong>Trade-off:</strong> Session affinity reduces load balancer flexibility. If one server gets
          many sticky sessions, it cannot redistribute load. Prefer stateless architectures where any server
          can handle any request.
        </p>
      </section>

      <section>
        <h2>Auto-Scaling Patterns</h2>
        <p>
          Auto-scaling automatically adjusts the number of servers based on demand. It is essential for
          handling unpredictable traffic patterns and optimizing costs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scaling Triggers</h3>
        <p>
          Auto-scaling decisions are based on metrics. Common triggers:
        </p>
        <ul>
          <li>
            <strong>CPU Utilization:</strong> Scale out when average CPU {'>'} 70%, scale in when CPU {'<'} 40%.
            Simple but may not reflect actual application load.
          </li>
          <li>
            <strong>Memory Usage:</strong> Important for memory-intensive applications (Java, in-memory caches).
            Scale when RAM usage exceeds threshold.
          </li>
          <li>
            <strong>Request Rate (QPS):</strong> Scale based on incoming traffic. Requires knowing your
            capacity per instance (e.g., one instance handles 1,000 QPS).
          </li>
          <li>
            <strong>Custom Metrics:</strong> Queue depth, processing latency, business metrics (orders per
            minute). More meaningful but requires instrumentation.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scaling Policies</h3>
        <p>
          <strong>Reactive Scaling:</strong> Scale based on current metrics. When CPU crosses threshold, add
          instances. Simple but has lag — new instances take time to provision and warm up.
        </p>
        <p>
          <strong>Predictive Scaling:</strong> Use machine learning to predict traffic patterns and scale
          proactively. AWS Auto Scaling offers predictive scaling based on historical patterns. More complex
          but reduces lag.
        </p>
        <p>
          <strong>Scheduled Scaling:</strong> Scale at known peak times. For example, add instances at 9 AM
          on weekdays, remove at 6 PM. Works well for predictable patterns but inflexible to unexpected
          traffic.
        </p>

        <ArticleImage
          src="/diagrams/backend-nfr/auto-scaling-patterns.svg"
          alt="Auto-Scaling Patterns"
          caption="Auto-Scaling Patterns — showing scaling approaches, triggers (CPU, memory, QPS), policies (reactive, predictive, scheduled), and graceful scale-down strategies"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scaling Cooldown & Hysteresis</h3>
        <p>
          Without proper controls, auto-scaling can <strong>thrash</strong> — rapidly scaling up and down in
          response to metric fluctuations. This wastes resources and can destabilize your system.
        </p>
        <p>
          <strong>Cooldown Period:</strong> After a scaling action, wait before scaling again. Typical cooldown:
          3-5 minutes. This gives new instances time to warm up and metrics to stabilize.
        </p>
        <p>
          <strong>Hysteresis:</strong> Use different thresholds for scale-up vs scale-down. For example:
        </p>
        <ul>
          <li>Scale up when CPU {'>'} 70%</li>
          <li>Scale down when CPU {'<'} 40%</li>
        </ul>
        <p>
          This prevents oscillation around a single threshold (e.g., CPU bouncing between 68% and 72%).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Scale-Down</h3>
        <p>
          Removing instances requires care to avoid dropping in-flight requests:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Deregister from Load Balancer:</strong> Remove the instance from the load balancer pool.
            It stops receiving new requests.
          </li>
          <li>
            <strong>Connection Draining:</strong> Wait for active connections to complete. Set a maximum drain
            timeout (e.g., 60 seconds) to avoid waiting forever.
          </li>
          <li>
            <strong>Terminate Instance:</strong> Once draining completes or timeout expires, terminate the
            instance.
          </li>
        </ol>
      </section>

      <section>
        <h2>Scalability Trade-Offs</h2>
        <p>
          Every scalability decision involves trade-offs. Understanding these is critical for staff/principal
          engineer interviews.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consistency vs Availability</h3>
        <p>
          The CAP theorem states that in the presence of a network partition, you must choose between
          consistency and availability. In practice, this manifests as:
        </p>
        <ul>
          <li>
            <strong>Strong consistency:</strong> All nodes see the same data at the same time. Requires
            coordination (locking, consensus), which reduces availability and increases latency.
          </li>
          <li>
            <strong>Eventual consistency:</strong> Nodes may temporarily disagree but converge over time.
            Higher availability and lower latency, but users may see stale data.
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> Most systems do not need strong consistency everywhere. Use
          eventual consistency for feeds, comments, likes. Reserve strong consistency for payments, inventory,
          authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Latency vs Throughput</h3>
        <p>
          Optimizing for throughput (total requests handled) often increases latency (time per request), and
          vice versa:
        </p>
        <ul>
          <li>
            <strong>Batching:</strong> Process requests in batches to improve throughput. Increases latency
            because requests wait for the batch to fill.
          </li>
          <li>
            <strong>Async processing:</strong> Queue requests and process asynchronously. Improves throughput
            and decouples components, but users wait for results.
          </li>
          <li>
            <strong>Caching:</strong> Reduces latency for cached requests but adds complexity and potential
            staleness.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Complexity vs Scalability</h3>
        <p>
          More scalable architectures are more complex:
        </p>
        <ul>
          <li>Monolith → Microservices: More scalable, but adds service discovery, distributed tracing, network failures.</li>
          <li>Single database → Sharded databases: More scalable, but adds cross-shard query complexity.</li>
          <li>Synchronous → Async: More scalable, but adds message queues, eventual consistency, debugging complexity.</li>
        </ul>
        <p>
          <strong>Rule of thumb:</strong> Choose the simplest architecture that meets your scalability targets
          with a 2-3× safety margin. Do not build for 100M users if you have 10K.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Interview Framework: Scalability Discussion</h3>
          <ol className="space-y-3">
            <li>
              <strong>Quantify requirements:</strong> "How many users? What&apos;s the read/write ratio? What
              latency SLA?"
            </li>
            <li>
              <strong>Start simple:</strong> Single server, single database. Establish baseline.
            </li>
            <li>
              <strong>Identify bottlenecks:</strong> "Database will be the first bottleneck. Let&apos;s add
              read replicas."
            </li>
            <li>
              <strong>Scale stateless first:</strong> "Web tier behind load balancer with auto-scaling."
            </li>
            <li>
              <strong>Scale stateful:</strong> "Database sharding when read replicas are insufficient."
            </li>
            <li>
              <strong>Discuss trade-offs:</strong> "Sharding adds complexity but is necessary for our scale."
            </li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a system to handle 10M daily active users with 100K concurrent users. How do you approach capacity planning and what scaling strategy do you choose?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Calculate peak RPS:</strong> 10M DAU × 10 requests/user/day = 100M requests/day. Peak is typically 10× average, so 100M / 86,400 × 10 = ~11,500 RPS peak.</li>
                <li><strong>Capacity per instance:</strong> Assume one server handles 5,000 RPS with P99 &lt; 100ms. Need 11,500 / 5,000 = 2.3 → 3 instances minimum.</li>
                <li><strong>Add buffer:</strong> 30-50% buffer for spikes → 4-5 instances for normal operation.</li>
                <li><strong>Scaling strategy:</strong> Start with vertical scaling (larger instances) up to 8 vCPU, 16GB RAM. Then horizontal scaling with auto-scaling group (min 4, max 20 instances).</li>
                <li><strong>Database:</strong> Use read replicas (1 primary + 3 replicas) for read-heavy workloads. Consider sharding when single DB can&apos;t handle write load.</li>
                <li><strong>Caching:</strong> Add Redis cluster for session data and frequently accessed data. Target 80%+ cache hit ratio.</li>
                <li><strong>CDN:</strong> Serve static assets from CDN to reduce origin load by 50-70%.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Your monolithic application is experiencing performance degradation at 50K requests per second. Walk through your strategy for scaling this system to handle 500K RPS.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Profile and identify bottlenecks:</strong> Use APM tools to find slow queries, CPU-intensive operations, memory leaks. Fix low-hanging fruit first.</li>
                <li><strong>Database optimization:</strong> Add read replicas, implement query caching, optimize slow queries with proper indexing. Consider database sharding for write scaling.</li>
                <li><strong>Introduce caching layers:</strong> Add Redis/Memcached for frequently accessed data. Target 80%+ cache hit ratio to reduce database load.</li>
                <li><strong>Horizontal scaling:</strong> Deploy behind load balancer, scale from 10 to 100+ instances. Use auto-scaling based on CPU/memory metrics.</li>
                <li><strong>Async processing:</strong> Move non-critical operations to background jobs (email, analytics, notifications). Use message queues (Kafka, SQS).</li>
                <li><strong>Microservices migration:</strong> Gradually extract high-traffic features into separate services. Start with stateless services (auth, search).</li>
                <li><strong>CDN and edge caching:</strong> Serve static/dynamic content from edge locations to reduce origin load.</li>
                <li><strong>Load testing:</strong> Continuously load test at 2-3× target (1M RPS) to validate scaling strategy.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you decide between horizontal vs vertical scaling for a PostgreSQL database? At what point would you recommend sharding, and what shard key would you choose for a social media platform?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Vertical scaling first:</strong> Start with larger instances (up to 32 vCPU, 128GB RAM). Simpler, no application changes. Cost-effective until ~100K RPS.</li>
                <li><strong>Read replicas:</strong> Add read replicas for read-heavy workloads (90%+ reads). Use connection pooling (PgBouncer) to manage connections.</li>
                <li><strong>Sharding triggers:</strong> Shard when: (1) Write load exceeds single primary capacity, (2) Data size exceeds practical backup/restore windows, (3) Vertical scaling cost exceeds horizontal scaling cost.</li>
                <li><strong>Shard key for social media:</strong> Use <code>user_id</code> as shard key. All user&apos;s posts, comments, likes on same shard. Benefits: (1) User-centric queries are single-shard, (2) Even distribution if user IDs are hashed, (3) Natural data locality.</li>
                <li><strong>Avoid:</strong> Timestamp-based sharding (hot shards for recent data), geographic sharding (uneven distribution).</li>
                <li><strong>Implementation:</strong> Use Citus (PostgreSQL extension) or application-level sharding with consistent hashing for rebalancing.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a globally distributed key-value store that must handle 1M writes per second and 10M reads per second. What consistency model do you choose and how do you handle cross-region replication?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Consistency model:</strong> Eventual consistency with read-your-writes guarantee. Strong consistency across regions adds 100-200ms latency per write (speed of light limitation).</li>
                <li><strong>Partitioning:</strong> Use consistent hashing with virtual nodes (256 vnodes per physical node). Enables even distribution and minimal rebalancing when nodes added/removed.</li>
                <li><strong>Replication:</strong> N=3 replicas per partition, W=1 write quorum, R=2 read quorum. Ensures read sees latest write while maintaining low latency.</li>
                <li><strong>Cross-region:</strong> Active-active in 3 regions (US-East, EU-West, APAC). Each region handles local reads/writes. Async replication between regions for disaster recovery.</li>
                <li><strong>Conflict resolution:</strong> Last-write-wins with vector clocks for causality tracking. For critical data, use application-level conflict resolution.</li>
                <li><strong>Capacity:</strong> 1M writes/sec ÷ 5K writes/node/sec = 200 nodes minimum. Add 50% buffer → 300 nodes (100 per region).</li>
                <li><strong>Examples:</strong> DynamoDB, Cassandra, Riak follow similar patterns.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Your API latency spikes from 50ms to 500ms during peak traffic. How do you diagnose the bottleneck and what scaling techniques would you apply?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Diagnosis steps:</strong> (1) Check APM dashboards for error rates, latency percentiles by endpoint. (2) Review database query performance (slow query log, lock waits). (3) Check resource utilization (CPU, memory, network, disk I/O). (4) Review downstream service latency.</li>
                <li><strong>Common bottlenecks:</strong> Database lock contention, connection pool exhaustion, GC pauses, downstream service degradation, network saturation.</li>
                <li><strong>Immediate mitigation:</strong> (1) Scale horizontally (add more instances). (2) Enable circuit breakers for failing dependencies. (3) Shed non-critical load. (4) Increase cache TTLs to reduce database load.</li>
                <li><strong>Long-term fixes:</strong> (1) Optimize slow queries with proper indexing. (2) Increase connection pool size or add read replicas. (3) Add caching for frequently accessed data. (4) Implement request queuing with backpressure.</li>
                <li><strong>Prevention:</strong> (1) Load test at 2-3× expected peak. (2) Set up alerts at 60-70% capacity utilization. (3) Implement auto-scaling with appropriate metrics and cooldown.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Explain how you would implement auto-scaling for a microservices architecture. What metrics would you use, how do you prevent thrashing, and how do you handle graceful scale-down?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Scaling metrics:</strong> (1) CPU utilization (target 60-70%). (2) Memory utilization (target 70-80%). (3) Request queue depth (target &lt; 10). (4) P99 latency (target &lt; SLA).</li>
                <li><strong>Scale-up policy:</strong> Add 20% capacity when metric exceeds threshold for 2 minutes. Faster scale-up (50%) for critical services during incidents.</li>
                <li><strong>Prevent thrashing:</strong> (1) Cooldown period (3-5 minutes) after scaling action. (2) Use hysteresis (scale up at 70%, scale down at 40%). (3) Require sustained threshold breach (2-5 minutes) before scaling.</li>
                <li><strong>Graceful scale-down:</strong> (1) Mark instance as draining (stop receiving new requests). (2) Wait for in-flight requests to complete (max 60 seconds). (3) Deregister from service discovery and load balancer. (4) Terminate instance.</li>
                <li><strong>Predictive scaling:</strong> Use historical patterns to scale up before predictable traffic spikes (e.g., 9 AM weekday traffic).</li>
                <li><strong>Per-service tuning:</strong> Stateful services need longer drain times. CPU-bound services scale on CPU. I/O-bound services scale on queue depth.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Production Patterns & Best Practices</h2>
        <p>
          Scalability is not just about architecture — it is about operational practices that keep your system
          healthy under load.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Capacity Planning</h3>
        <p>
          <strong>Work backwards from requirements:</strong> If you need 100K RPS and one server handles 5K RPS,
          you need at least 20 servers. Add 30-50% buffer for spikes and failures → 26-30 servers.
        </p>
        <p>
          <strong>Load test regularly:</strong> Synthetic load tests reveal bottlenecks before users do. Test
          at 2-3× your expected peak load. Measure not just throughput but latency distribution (P50, P95, P99).
        </p>
        <p>
          <strong>Monitor headroom:</strong> Track capacity utilization. Alert when you reach 60-70% of planned
          capacity — this gives time to provision before hitting limits.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation</h3>
        <p>
          When scaling fails or demand exceeds capacity, degrade gracefully rather than failing catastrophically:
        </p>
        <ul>
          <li>
            <strong>Shed load:</strong> Reject non-critical requests. Return 503 with Retry-After header.
          </li>
          <li>
            <strong>Disable features:</strong> Turn off expensive features (recommendations, analytics) to
            preserve core functionality.
          </li>
          <li>
            <strong>Serve stale data:</strong> When caches cannot refresh, serve expired data rather than
            failing.
          </li>
          <li>
            <strong>Queue requests:</strong> For async operations, queue requests and process when capacity
            is available.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scalability Checklist</h3>
        <ul className="space-y-2">
          <li>✓ Quantified scalability targets (RPS, concurrent users, data volume)</li>
          <li>✓ Stateless application tier behind load balancer</li>
          <li>✓ Database scaling strategy (read replicas, sharding plan)</li>
          <li>✓ Caching strategy (application cache, distributed cache, CDN)</li>
          <li>✓ Auto-scaling configured with appropriate triggers and cooldown</li>
          <li>✓ Health checks and automatic failover</li>
          <li>✓ Graceful degradation plan for overload scenarios</li>
          <li>✓ Monitoring and alerting on capacity metrics</li>
          <li>✓ Regular load testing at 2-3× expected peak</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
