"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-throughput-capacity-extensive",
  title: "Throughput Capacity",
  description:
    "Comprehensive guide to backend throughput capacity, covering RPS planning, bottleneck identification, Little's Law, capacity planning, and scaling strategies for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "throughput-capacity",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: [
    "backend",
    "nfr",
    "throughput",
    "capacity",
    "scaling",
    "performance",
    "bottleneck",
  ],
  relatedTopics: [
    "latency-slas",
    "scalability-strategy",
    "load-balancing",
    "auto-scaling",
  ],
};

export default function ThroughputCapacityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Throughput</strong> measures the number of operations a system
          can complete per unit of time, typically expressed as requests per
          second (RPS), queries per second (QPS), or transactions per second
          (TPS).
          <strong>Throughput Capacity</strong> is the maximum throughput a
          system can sustain while meeting latency and error rate requirements.
        </p>
        <p>Throughput is distinct from latency:</p>
        <ul>
          <li>
            <strong>Latency:</strong> How long a single request takes (measured
            in milliseconds).
          </li>
          <li>
            <strong>Throughput:</strong> How many requests can be processed per
            second (measured in RPS/QPS/TPS).
          </li>
        </ul>
        <p>
          A system can have high throughput with high latency (batch processing
          many slow requests), or low throughput with low latency
          (single-threaded fast operations). Understanding both is essential for
          capacity planning.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: Throughput vs Latency
          </h3>
          <p>
            In interviews, clarify whether the requirement is throughput (handle
            many requests) or latency (respond quickly). The optimization
            strategies differ:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              • Throughput optimization: parallelism, batching, pipelining
            </li>
            <li>
              • Latency optimization: caching, faster algorithms, reducing round
              trips
            </li>
          </ul>
        </div>

        <p>
          <strong>Why throughput matters:</strong>
        </p>
        <ul>
          <li>
            <strong>Business growth:</strong> Throughput must scale with user
            growth and engagement.
          </li>
          <li>
            <strong>Cost planning:</strong> Throughput capacity determines
            infrastructure costs.
          </li>
          <li>
            <strong>Peak handling:</strong> Systems must handle traffic spikes
            without degradation.
          </li>
          <li>
            <strong>SLA compliance:</strong> Throughput guarantees are often
            part of SLAs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Throughput vs Latency Relationship</h2>
        <p>
          Understanding the relationship between throughput and latency is
          critical for capacity planning.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/throughput-vs-latency.svg"
          alt="Throughput vs Latency Comparison"
          caption="Throughput vs Latency — showing the difference between requests per second (throughput) and time per request (latency), with capacity planning formulas"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Little's Law</h3>
        <p>
          <strong>Little's Law</strong> describes the fundamental relationship
          between throughput, latency, and concurrency:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">L = λ × W</p>
          <p className="mt-2 text-sm text-muted">
            Where:
            <br />
            L = Average number of requests in the system (concurrency)
            <br />
            λ (lambda) = Arrival rate (throughput in requests/second)
            <br />W = Average time in system (latency in seconds)
          </p>
        </div>
        <p>
          <strong>Example:</strong> If your system processes 1000 RPS (λ) with
          average latency of 50ms (W = 0.05s):
        </p>
        <p className="my-4 text-center font-semibold">
          L = 1000 × 0.05 = 50 concurrent requests in the system
        </p>
        <p>
          <strong>Interview application:</strong> Little's Law helps you
          calculate required concurrency. If you need 10,000 RPS with 100ms
          latency, you need 1000 concurrent request slots.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Throughput Saturation
        </h3>
        <p>As load increases, throughput follows a predictable pattern:</p>
        <ul>
          <li>
            <strong>Linear region:</strong> Throughput increases linearly with
            load. Latency remains stable.
          </li>
          <li>
            <strong>Knee point:</strong> Throughput growth slows. Latency starts
            increasing.
          </li>
          <li>
            <strong>Saturation:</strong> Throughput plateaus at maximum
            capacity. Latency increases rapidly.
          </li>
          <li>
            <strong>Degradation:</strong> Throughput may decrease due to
            thrashing. Latency becomes unacceptable.
          </li>
        </ul>
        <p>
          <strong>Design target:</strong> Operate at 60-70% of saturation
          throughput to handle spikes without degradation.
        </p>
      </section>

      <section>
        <h2>Capacity Planning</h2>
        <p>
          Capacity planning determines how many resources (servers, databases,
          etc.) are needed to handle expected throughput.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Capacity Planning Formula
        </h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            Required Instances = Peak RPS / (RPS per Instance × Target
            Utilization)
          </p>
        </div>
        <p>
          <strong>Example calculation:</strong>
        </p>
        <ul>
          <li>Peak traffic: 10,000 RPS</li>
          <li>Capacity per instance: 500 RPS (from load testing)</li>
          <li>Target utilization: 70% (30% headroom for spikes)</li>
        </ul>
        <p className="my-4 text-center font-semibold">
          Instances = 10,000 / (500 × 0.7) = 10,000 / 350 = 28.6 →{" "}
          <strong>29 instances</strong>
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Traffic Estimation</h3>
        <p>Estimate peak traffic from business metrics:</p>
        <ul>
          <li>
            <strong>DAU-based:</strong> If 1M DAU with 10 requests/user/day, and
            20% of traffic in peak hour:
            <br />
            Peak RPS = (1M × 10 × 0.2) / 3600 = 556 RPS average, ~2-3× for peak
            = 1,100-1,700 RPS
          </li>
          <li>
            <strong>Growth projection:</strong> Apply expected growth rate
            (e.g., 10% monthly) for future capacity.
          </li>
          <li>
            <strong>Seasonality:</strong> Account for daily/weekly/seasonal
            patterns (Black Friday, holidays).
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Interview Framework: Capacity Planning
          </h3>
          <ol className="space-y-2">
            <li>
              1. Estimate peak RPS from business metrics (DAU, requests/user,
              peak ratio)
            </li>
            <li>
              2. Determine RPS per instance from benchmarks or load testing
            </li>
            <li>3. Apply target utilization (60-70% for headroom)</li>
            <li>4. Calculate required instances</li>
            <li>5. Add buffer for failures (N+1 or N+2 redundancy)</li>
            <li>6. Discuss auto-scaling for unpredictable traffic</li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Bottleneck Identification</h2>
        <p>
          A <strong>bottleneck</strong> is the component that limits overall
          system throughput. The system cannot process more requests than the
          bottleneck can handle.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/bottleneck-identification.svg"
          alt="Bottleneck Identification and Removal"
          caption="Bottleneck Identification — showing how the slowest component limits system throughput, common bottleneck locations, and removal strategies"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Identifying Bottlenecks
        </h3>
        <p>
          <strong>Signs of a bottleneck:</strong>
        </p>
        <ul>
          <li>
            One component at 100% utilization while others are underutilized.
          </li>
          <li>Queue buildup before a specific component.</li>
          <li>Throughput doesn't increase when adding capacity elsewhere.</li>
          <li>Latency spikes correlate with utilization of one component.</li>
        </ul>
        <p>
          <strong>Common bottleneck locations:</strong>
        </p>
        <ul>
          <li>
            <strong>Database:</strong> Slow queries, lock contention, connection
            pool exhaustion.
          </li>
          <li>
            <strong>Network:</strong> Bandwidth limits, high latency, packet
            loss.
          </li>
          <li>
            <strong>CPU:</strong> Compute-intensive operations, inefficient
            algorithms.
          </li>
          <li>
            <strong>Memory:</strong> GC pauses, memory pressure, swapping.
          </li>
          <li>
            <strong>Disk I/O:</strong> Limited IOPS, slow reads/writes.
          </li>
          <li>
            <strong>External APIs:</strong> Rate limits, third-party latency.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Removing Bottlenecks
        </h3>
        <p>
          <strong>Scale the bottleneck:</strong> Add more instances of the
          bottleneck component.
        </p>
        <p>
          <strong>Optimize the bottleneck:</strong> Improve efficiency through
          caching, indexing, or algorithm improvements.
        </p>
        <p>
          <strong>Parallelize:</strong> Process multiple requests concurrently
          around the bottleneck.
        </p>
        <p>
          <strong>Async processing:</strong> Queue requests and process them
          asynchronously to smooth peaks.
        </p>
        <p>
          <strong>Cache results:</strong> Avoid repeated processing by caching
          frequently accessed data.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Bottleneck Shifting</h3>
          <p>
            When you remove one bottleneck, another emerges. This is called{" "}
            <strong>bottleneck shifting</strong>. Continuous monitoring and
            optimization is required.
          </p>
          <p className="mt-3">
            <strong>Example progression:</strong>
          </p>
          <ul className="mt-2 space-y-1">
            <li>1. Initial bottleneck: Single database → Add read replicas</li>
            <li>2. New bottleneck: Write throughput → Implement sharding</li>
            <li>3. New bottleneck: Cross-shard queries → Denormalize data</li>
            <li>
              4. New bottleneck: Network bandwidth → Optimize payload sizes
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Throughput Optimization Strategies</h2>
        <p>Multiple strategies can increase throughput capacity:</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Horizontal Scaling</h3>
        <p>
          Add more instances behind a load balancer. Throughput scales linearly
          (minus coordination overhead).
        </p>
        <p>
          <strong>Considerations:</strong>
        </p>
        <ul>
          <li>Stateless services scale easily.</li>
          <li>Stateful services require sharding or distributed state.</li>
          <li>Load balancer becomes the new bottleneck at scale.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Batching</h3>
        <p>Process multiple requests together to amortize overhead.</p>
        <p>
          <strong>Example:</strong> Instead of 100 individual database inserts,
          batch into 10 bulk inserts of 10 rows each.
        </p>
        <p>
          <strong>Trade-off:</strong> Increases latency (waiting for batch to
          fill) but improves throughput.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pipelining</h3>
        <p>
          Overlap processing stages so multiple requests are in different stages
          simultaneously.
        </p>
        <p>
          <strong>Example:</strong> While request A is being written to the
          database, request B is being processed, and request C is being
          received.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Async Processing</h3>
        <p>Decouple request receipt from processing using queues.</p>
        <p>
          <strong>Benefits:</strong>
        </p>
        <ul>
          <li>Smooths traffic spikes.</li>
          <li>Allows processing at optimal batch sizes.</li>
          <li>Provides backpressure when downstream is overloaded.</li>
        </ul>
        <p>
          <strong>Trade-off:</strong> Increases latency (queuing delay) but
          protects throughput.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching</h3>
        <p>Serve requests from cache instead of processing them fully.</p>
        <p>
          <strong>Impact:</strong> A 90% cache hit ratio reduces backend load by
          10×, effectively increasing throughput 10×.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Your API needs to handle 100,000 RPS at peak. Each server
              handles 5,000 RPS. How many servers do you need, and what factors
              influence this calculation?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Base calculation:</strong> 100,000 / 5,000 = 20
                  servers minimum.
                </li>
                <li>
                  <strong>Add buffer:</strong> 30-50% buffer for spikes and
                  failures → 26-30 servers.
                </li>
                <li>
                  <strong>Factors:</strong> (1) Auto-scaling response time (if
                  fast, can reduce buffer). (2) Traffic predictability
                  (predictable = smaller buffer). (3) Cost constraints. (4) SLA
                  requirements (stricter SLA = larger buffer).
                </li>
                <li>
                  <strong>Deployment:</strong> Deploy across multiple
                  availability zones for fault tolerance. 10 servers per zone ×
                  3 zones = 30 servers.
                </li>
                <li>
                  <strong>Database capacity:</strong> Ensure database can handle
                  100,000 queries/sec. Use read replicas, connection pooling,
                  caching.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Your system throughput plateaued at 5,000 RPS despite adding
              more servers. How do you diagnose and fix this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Diagnosis:</strong> (1) Check database connection pool
                  utilization. (2) Monitor network bandwidth. (3) Check for lock
                  contention. (4) Profile CPU usage.
                </li>
                <li>
                  <strong>Common bottlenecks:</strong> Database saturation,
                  network bandwidth limits, shared resource contention
                  (distributed lock, shared cache), external API rate limits.
                </li>
                <li>
                  <strong>Database fix:</strong> Add read replicas, increase
                  connection pool, use PgBouncer, optimize slow queries.
                </li>
                <li>
                  <strong>Network fix:</strong> Use enhanced networking,
                  increase instance size, add more instances with lower
                  per-instance throughput.
                </li>
                <li>
                  <strong>Contention fix:</strong> Remove distributed locks, use
                  sharding, implement local caching.
                </li>
                <li>
                  <strong>Verification:</strong> After each fix, load test to
                  verify throughput increased. Continue until bottleneck moves.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Explain Little's Law and how you would use it to calculate
              required concurrency for a system with 10,000 RPS and 50ms average
              latency.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Little's Law:</strong> L = λ × W, where L = items in
                  system, λ = arrival rate (throughput), W = time in system
                  (latency).
                </li>
                <li>
                  <strong>Calculation:</strong> L = 10,000 RPS × 0.05s = 500
                  concurrent requests in flight.
                </li>
                <li>
                  <strong>Capacity planning:</strong> (1) Thread pool size ≥ 500
                  threads. (2) Connection pool ≥ 500 connections. (3) Memory =
                  500 × memory per request.
                </li>
                <li>
                  <strong>Scaling insight:</strong> To double throughput without
                  increasing latency, need 2× capacity. To reduce latency,
                  optimize code or add caching.
                </li>
                <li>
                  <strong>Trade-off:</strong> At saturation, latency increases
                  exponentially. Operate at 60-70% utilization for stable
                  latency.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a throughput capacity plan for a video streaming
              platform expecting 1M concurrent viewers. What are the key
              bottlenecks and how do you address them?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Bandwidth calculation:</strong> 1M viewers × 5 Mbps
                  per stream = 5 Tbps total bandwidth. Major bottleneck.
                </li>
                <li>
                  <strong>Solution:</strong> Use CDN for video delivery. CDN
                  handles bandwidth, origin only serves popular content.
                </li>
                <li>
                  <strong>Origin capacity:</strong> Assume 10% cache miss rate →
                  100K concurrent requests to origin. At 10 Mbps per request = 1
                  Tbps origin bandwidth.
                </li>
                <li>
                  <strong>Key bottlenecks:</strong> (1) CDN egress costs. (2)
                  Origin bandwidth. (3) Video encoding throughput. (4) Metadata
                  database.
                </li>
                <li>
                  <strong>Solutions:</strong> Multi-CDN strategy, edge computing
                  for personalization, distributed encoding cluster, sharded
                  metadata database.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Your database is the bottleneck at 10,000 writes/second. What
              strategies would you use to increase write throughput?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Batching:</strong> Batch multiple writes into single
                  transaction. 10 writes/batch → 100,000 writes/sec effective
                  throughput.
                </li>
                <li>
                  <strong>Sharding:</strong> Partition data across multiple
                  database instances. 10 shards × 10,000 writes = 100,000
                  writes/sec.
                </li>
                <li>
                  <strong>Async writes:</strong> Queue writes, process
                  asynchronously. Use WAL-based approach (write to log, async
                  apply).
                </li>
                <li>
                  <strong>Optimize indexes:</strong> Reduce number of indexes,
                  use covering indexes. Each index adds write overhead.
                </li>
                <li>
                  <strong>Hardware:</strong> Use faster storage (NVMe SSD), more
                  RAM for buffer pool, more CPU cores.
                </li>
                <li>
                  <strong>Denormalization:</strong> Reduce joins, pre-compute
                  aggregates. Trade storage for write throughput.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you differentiate between throughput and latency
              requirements in a system design interview? When would you optimize
              for one over the other?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Throughput:</strong> Requests per second the system
                  can handle. Important for batch processing, data pipelines,
                  background jobs.
                </li>
                <li>
                  <strong>Latency:</strong> Time per request. Important for
                  user-facing APIs, real-time systems, interactive applications.
                </li>
                <li>
                  <strong>Optimize for latency when:</strong> User-facing APIs
                  (&lt; 100ms P99), real-time trading/gaming, SLA requires low
                  latency.
                </li>
                <li>
                  <strong>Optimize for throughput when:</strong> Batch ETL jobs,
                  email/notification processing, data analytics where latency
                  doesn&apos;t impact users.
                </li>
                <li>
                  <strong>Balanced approach:</strong> Set latency SLOs, maximize
                  throughput within constraints. Use separate systems for
                  latency vs throughput workloads.
                </li>
                <li>
                  <strong>Example:</strong> E-commerce: Product search (low
                  latency) vs Order analytics (high throughput). Different
                  systems optimized for each.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Throughput Capacity Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Estimated peak RPS from business metrics</li>
          <li>✓ Measured RPS per instance through load testing</li>
          <li>✓ Applied target utilization (60-70%)</li>
          <li>✓ Calculated required instances with buffer</li>
          <li>✓ Identified potential bottlenecks (DB, network, CPU)</li>
          <li>✓ Defined bottleneck removal strategies</li>
          <li>✓ Implemented monitoring for throughput metrics</li>
          <li>✓ Set up alerts for saturation warnings</li>
          <li>✓ Planned auto-scaling for unpredictable traffic</li>
          <li>✓ Documented capacity growth projections</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
