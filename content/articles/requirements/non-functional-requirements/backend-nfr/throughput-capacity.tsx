"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-throughput-capacity",
  title: "Throughput Capacity",
  description: "Comprehensive guide to throughput capacity — capacity planning, bottleneck identification, Little's Law, scalability limits, capacity testing, and capacity monitoring for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "throughput-capacity",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "throughput", "capacity", "bottleneck", "little-law", "scalability"],
  relatedTopics: ["capacity-planning", "scalability-strategy", "latency-slas", "server-side-caching-strategy"],
};

export default function ThroughputCapacityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Throughput capacity</strong> is the maximum number of requests a system can process
          per unit of time (requests per second, transactions per second) while maintaining acceptable
          latency and error rate. Throughput capacity is determined by the system&apos;s bottleneck —
          the component that limits the overall throughput (CPU, memory, disk I/O, network bandwidth,
          database connections). Understanding and optimizing throughput capacity is essential for
          ensuring that the system can handle peak traffic without degradation.
        </p>
        <p>
          Throughput capacity is related to but distinct from latency — latency measures the time
          to process a single request, while throughput measures the number of requests processed
          per second. A system can have low latency (fast individual requests) but low throughput
          (few requests per second) if it has limited parallelism (single-threaded, limited
          connections). Conversely, a system can have high throughput but high latency if it
          batches requests for efficiency.
        </p>
        <p>
          For staff and principal engineer candidates, throughput capacity architecture demonstrates
          understanding of system performance limits, the ability to identify and resolve bottlenecks,
          and the maturity to plan capacity for future growth. Interviewers expect you to design
          systems that meet throughput targets (requests per second), identify bottlenecks through
          profiling and monitoring, optimize bottlenecks through parallelism and caching, and plan
          capacity for future growth through load testing and capacity monitoring.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Throughput vs Latency</h3>
          <p>
            <strong>Latency</strong> measures the time to process a single request (milliseconds per request). <strong>Throughput</strong> measures the number of requests processed per second (requests per second).
          </p>
          <p className="mt-3">
            Little&apos;s Law relates throughput, latency, and concurrency: Throughput = Concurrency / Latency. For example, if a system can handle 100 concurrent requests with 10ms latency per request, the throughput is 100 / 0.01 = 10,000 requests per second. Understanding this relationship is essential for capacity planning.
          </p>
        </div>

        <p>
          A mature throughput capacity architecture includes: capacity planning based on current
          and projected traffic, bottleneck identification through profiling and monitoring,
          bottleneck optimization through parallelism, caching, and resource scaling, capacity
          testing through load testing and stress testing, and capacity monitoring with alerts
          when approaching capacity limits.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding throughput capacity requires grasping several foundational concepts about
          Little&apos;s Law, bottleneck identification, capacity planning, and scalability limits.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Little&apos;s Law</h3>
        <p>
          Little&apos;s Law is a fundamental relationship in queueing theory: L = λW, where L is the
          average number of items in the system (concurrency), λ is the average arrival rate
          (throughput), and W is the average time an item spends in the system (latency). For
          throughput capacity: Throughput = Concurrency / Latency. This law holds for any stable
          system — if the arrival rate exceeds the service rate, the queue grows unbounded and
          the system becomes unstable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bottleneck Identification</h3>
        <p>
          The bottleneck is the component that limits the overall throughput — it could be CPU
          (computationally expensive operations), memory (large data structures, garbage collection),
          disk I/O (database queries, file reads), network bandwidth (large responses, high traffic),
          or database connections (connection pool exhaustion). The bottleneck is identified by
          monitoring resource utilization — the bottleneck is the resource with the highest
          utilization (closest to 100%). Optimizing non-bottleneck resources does not improve
          throughput — only optimizing the bottleneck improves throughput.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Capacity Planning and Growth</h3>
        <p>
          Capacity planning projects future throughput requirements based on traffic growth trends.
          If traffic grows 20% year-over-year and the current system handles 10,000 RPS, the system
          will need to handle 12,000 RPS next year. Capacity planning ensures that the system is
          scaled before it reaches capacity limits — by monitoring resource utilization and projecting
          growth, the system can be scaled proactively (adding servers, upgrading hardware, optimizing
          bottlenecks) before traffic exceeds capacity.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Throughput capacity architecture spans bottleneck identification, capacity planning,
          bottleneck optimization, and capacity monitoring.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/throughput-capacity-deep-dive.svg"
          alt="Throughput Capacity Architecture"
          caption="Throughput Capacity — showing bottleneck identification, Little's Law, and capacity planning"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bottleneck Identification Flow</h3>
        <p>
          Bottleneck identification begins with monitoring resource utilization — CPU, memory, disk
          I/O, network bandwidth, and database connections. The resource with the highest utilization
          (closest to 100%) is the bottleneck. Once the bottleneck is identified, it is profiled to
          understand the specific operations causing the bottleneck (e.g., if CPU is the bottleneck,
          which functions consume the most CPU). The bottleneck is then optimized — through caching
          (reduce computation), parallelism (distribute load), or resource scaling (add more capacity).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Capacity Planning Flow</h3>
        <p>
          Capacity planning projects future throughput based on traffic growth trends and current
          system capacity. If the projected throughput exceeds the current system capacity within the
          planning horizon (e.g., 6 months), capacity is added — by scaling horizontally (adding
          servers), scaling vertically (upgrading hardware), or optimizing bottlenecks (improving
          throughput per server). Capacity planning ensures that the system is scaled proactively,
          before traffic exceeds capacity and causes degradation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/bottleneck-identification.svg"
          alt="Bottleneck Identification"
          caption="Bottleneck Identification — showing resource utilization profiling and bottleneck resolution"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/capacity-planning-throughput.svg"
          alt="Capacity Planning"
          caption="Capacity Planning — showing traffic projection, capacity scaling, and proactive scaling"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Optimization Strategy</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Caching</strong></td>
              <td className="p-3">
                Reduces database load. Sub-millisecond response times. Scales read throughput significantly.
              </td>
              <td className="p-3">
                Cache invalidation complexity. Stale data risk. Cache memory cost.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Horizontal Scaling</strong></td>
              <td className="p-3">
                Near-linear throughput increase. Fault tolerance. Flexible capacity.
              </td>
              <td className="p-3">
                Requires stateless services. Load balancer overhead. Distributed complexity.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Vertical Scaling</strong></td>
              <td className="p-3">
                Simple to implement. No architectural changes. Immediate throughput increase.
              </td>
              <td className="p-3">
                Hardware limits. Single point of failure. Downtime for upgrades. Expensive.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Asynchronous Processing</strong></td>
              <td className="p-3">
                Decouples request from processing. Improves perceived latency. Smooths traffic spikes.
              </td>
              <td className="p-3">
                Eventual consistency. Complex error handling. Queue management overhead.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Resource Utilization Continuously</h3>
        <p>
          Resource utilization (CPU, memory, disk I/O, network bandwidth, database connections)
          must be monitored continuously to identify bottlenecks before they cause throughput
          degradation. Alert when any resource exceeds 70% utilization — this provides headroom
          for traffic spikes and time to scale before reaching capacity. Use the USE method
          (Utilization, Saturation, Errors) for resource monitoring — utilization measures how
          busy the resource is, saturation measures how much work is queued, and errors measure
          error rates.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimize the Bottleneck</h3>
        <p>
          Only optimizing the bottleneck improves throughput — optimizing non-bottleneck resources
          does not increase throughput. Identify the bottleneck through resource utilization
          monitoring, profile the bottleneck to understand the specific operations causing the
          bottleneck, and optimize through caching (reduce computation), parallelism (distribute
          load), or resource scaling (add more capacity). After optimization, re-monitor to
          identify the new bottleneck.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Plan Capacity Proactively</h3>
        <p>
          Capacity planning projects future throughput based on traffic growth trends and current
          system capacity. Scale proactively — before traffic reaches 70% of capacity — to ensure
          that there is headroom for traffic spikes and time to scale if growth accelerates. Use
          load testing to validate that the scaled system can handle the projected throughput, and
          monitor resource utilization to detect capacity limits early.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Little&apos;s Law for Capacity Planning</h3>
        <p>
          Little&apos;s Law (Throughput = Concurrency / Latency) provides a simple formula for capacity
          planning — if the system can handle N concurrent requests with latency L, the throughput
          is N/L. To increase throughput, increase concurrency (add more servers) or decrease
          latency (optimize the bottleneck). Use Little&apos;s Law to estimate the number of servers
          needed for projected throughput — if projected throughput is 20,000 RPS and each server
          handles 5,000 RPS (100 concurrent requests with 20ms latency), you need 4 servers.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimizing Non-Bottleneck Resources</h3>
        <p>
          Optimizing non-bottleneck resources does not improve throughput — it only shifts the
          bottleneck to another resource. For example, optimizing database queries when CPU is
          the bottleneck does not improve throughput — the CPU will still be the bottleneck.
          Identify the bottleneck first (highest resource utilization), then optimize the
          bottleneck. After optimization, re-monitor to identify the new bottleneck.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Saturation</h3>
        <p>
          Utilization measures how busy a resource is, but saturation measures how much work is
          queued — a resource with 80% utilization and no queue is healthy, but a resource with
          80% utilization and a long queue is approaching capacity. Monitor saturation (queue
          depth, wait time) in addition to utilization to detect capacity limits early. When
          saturation increases, the resource is approaching capacity and should be scaled.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Testing at Scale</h3>
        <p>
          Load testing at current traffic levels does not reveal capacity limits — it only validates
          that the system handles current traffic. Load testing at 2×, 5×, and 10× current traffic
          reveals capacity limits and bottlenecks that will be encountered as traffic grows. Test
          at scale regularly (quarterly) to validate capacity plans and identify bottlenecks before
          they cause production issues.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scaling Without Validating</h3>
        <p>
          Adding servers (horizontal scaling) assumes that the system is stateless and can distribute
          load evenly. If the system has stateful components (database, cache, session state), adding
          servers may not improve throughput — the stateful component becomes the bottleneck. Validate
          that the system can distribute load evenly before scaling — profile the system at scale
          to ensure that throughput increases linearly with added servers.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Amazon — Throughput Capacity for Prime Day</h3>
        <p>
          Amazon scales for Prime Day (10× normal traffic) through proactive capacity planning —
          projecting traffic based on historical trends, load testing at 2×, 5×, and 10× projected
          traffic, identifying bottlenecks, and optimizing or scaling before the event. Amazon&apos;s
          capacity planning ensures that the system handles peak traffic without degradation, and
          post-event analysis validates capacity plans and identifies areas for improvement.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Little&apos;s Law for Capacity Planning</h3>
        <p>
          Netflix uses Little&apos;s Law for capacity planning — if each API server handles 100 concurrent
          requests with 50ms latency, the throughput is 100 / 0.05 = 2,000 RPS per server. To handle
          100,000 RPS, Netflix needs 50 servers. Netflix monitors actual throughput and latency,
          adjusts the capacity plan based on actual measurements, and scales proactively before
          traffic reaches capacity limits.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Twitter — Bottleneck Identification for Tweet Ingestion</h3>
        <p>
          Twitter&apos;s tweet ingestion pipeline was bottlenecked by database writes — as tweet volume
          grew, the database became the bottleneck. Twitter identified the bottleneck through resource
          utilization monitoring (database write latency increased, queue depth grew), and optimized
          through caching (fan-out to cache), asynchronous processing (write to queue, process
          asynchronously), and sharding (distribute writes across database shards). Twitter&apos;s
          bottleneck optimization enabled the system to handle millions of tweets per second.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Uber — Capacity Monitoring for Ride Matching</h3>
        <p>
          Uber monitors ride matching throughput capacity — requests per second, latency, and
          resource utilization. When throughput approaches 70% of capacity, Uber scales the ride
          matching service proactively (adding servers, optimizing the matching algorithm). Uber&apos;s
          capacity monitoring ensures that ride matching latency remains acceptable even during peak
          traffic (rush hour, events, bad weather).
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Throughput capacity involves security risks — capacity exhaustion can be caused by DDoS attacks, and scaling decisions may expose the system to new attack surfaces.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity and Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>DDoS and Capacity Exhaustion:</strong> DDoS attacks can exhaust capacity, causing legitimate requests to fail. Mitigation: use DDoS protection (AWS Shield, Cloudflare), rate limiting, and auto-scaling with maximum limits to prevent runaway scaling costs.
            </li>
            <li>
              <strong>Scaling Security:</strong> Auto-scaled instances must have the same security controls as the original instances (firewall rules, access controls, monitoring). Mitigation: use infrastructure-as-code (Terraform, CloudFormation) to ensure consistent security configuration, monitor new instances for security compliance, include security checks in auto-scaling policies.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Throughput capacity must be validated through systematic testing — load testing, stress testing, bottleneck identification, and capacity planning validation must all be tested.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Load Test:</strong> Send requests at the projected throughput rate and verify that the system handles the load within latency and error rate targets. Identify bottlenecks through resource utilization monitoring.
            </li>
            <li>
              <strong>Stress Test:</strong> Send requests at 2×, 5×, and 10× the projected throughput rate and verify that the system degrades gracefully (latency increases but errors remain low). Identify the maximum throughput before the system fails.
            </li>
            <li>
              <strong>Scaling Test:</strong> Scale the system (add servers) and verify that throughput increases linearly. Verify that load balancing distributes traffic evenly and that stateful components do not become bottlenecks.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Throughput Capacity Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Resource utilization monitored (CPU, memory, disk I/O, network, database connections)</li>
            <li>✓ Saturation monitored (queue depth, wait time)</li>
            <li>✓ Bottleneck identified and optimized</li>
            <li>✓ Capacity plan based on Little&apos;s Law and traffic growth projection</li>
            <li>✓ Load testing conducted at 2×, 5×, and 10× projected throughput</li>
            <li>✓ Stress testing conducted to identify maximum throughput</li>
            <li>✓ Scaling tested and validated (linear throughput increase)</li>
            <li>✓ Alerts configured at 70% resource utilization</li>
            <li>✓ Auto-scaling configured with maximum limits</li>
            <li>✓ Capacity testing conducted quarterly</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://en.wikipedia.org/wiki/Little%27s_law" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Wikipedia — Little&apos;s Law
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/publications/loginonline/performance-metrics-everybody-should-know" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX — Performance Metrics Everybody Should Know
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Tech Blog — Capacity Planning and Scaling
            </a>
          </li>
          <li>
            <a href="https://aws.amazon.com/architecture/well-architected/performance-efficiency/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Well-Architected — Performance Efficiency
            </a>
          </li>
          <li>
            <a href="https://engineering.fb.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Facebook Engineering — Scaling for Traffic Spikes
            </a>
          </li>
          <li>
            <a href="https://www.brendangregg.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Brendan Gregg — Systems Performance and Capacity Planning
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
