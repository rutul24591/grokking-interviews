"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-latency-slas-extensive",
  title: "Latency SLAs",
  description: "Comprehensive guide to backend latency SLAs, covering percentiles (P50/P95/P99), tail latency optimization, SLOs, error budgets, and production latency management for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "latency-slas",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "latency", "sla", "slo", "percentiles", "tail-latency", "performance"],
  relatedTopics: ["high-availability", "fault-tolerance-resilience", "scalability-strategy", "monitoring-observability"],
};

export default function LatencySlasArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Latency</strong> is the time it takes for a request to complete — from when a client sends
          a request to when it receives the response. <strong>Latency SLAs</strong> define the acceptable
          latency targets that a system must meet, typically expressed as percentiles (P50, P95, P99) with
          specific thresholds.
        </p>
        <p>
          Latency is not a single number — it is a distribution. Different users experience different latencies
          based on their network conditions, geographic location, request complexity, and system load. This is
          why <strong>percentiles</strong> are essential for meaningful latency discussions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Why Averages Lie</h3>
          <p>
            Average (mean) latency is misleading because it hides outliers. If 99 requests take 10ms and 1 request
            takes 10 seconds, the average is ~110ms — but 99% of users had a great experience while 1% had a
            terrible experience.
          </p>
          <p className="mt-3">
            <strong>Always discuss latency in percentiles:</strong> P50 (median), P95, P99, and sometimes P99.9
            for critical systems. In interviews, immediately clarify which percentile you are optimizing for.
          </p>
        </div>

        <p>
          <strong>Latency SLA components:</strong>
        </p>
        <ul>
          <li>
            <strong>Percentile:</strong> Which part of the distribution (P50, P95, P99)?
          </li>
          <li>
            <strong>Threshold:</strong> Maximum acceptable latency (e.g., 200ms).
          </li>
          <li>
            <strong>Window:</strong> Time period for measurement (e.g., rolling 30 days).
          </li>
          <li>
            <strong>Scope:</strong> Which requests (all, specific endpoints, specific regions)?
          </li>
          <li>
            <strong>Consequences:</strong> What happens if SLA is violated (credits, escalation)?
          </li>
        </ul>

        <p>
          Latency SLAs are critical for user experience and business metrics. Amazon found that every 100ms of
          latency cost them 1% in sales. Google observed that an extra 500ms in search page generation time
          dropped traffic by 20%. For staff/principal engineers, latency is not just a technical metric — it
          is a business imperative.
        </p>
      </section>

      <section>
        <h2>Understanding Latency Percentiles</h2>
        <p>
          Percentiles divide a latency distribution into hundredths. The P<em>X</em> latency is the value below
          which <em>X</em>% of requests fall.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Percentiles</h3>
        <ul>
          <li>
            <strong>P50 (Median):</strong> 50% of requests are faster than this value. Represents the &quot;typical&quot;
            user experience. Also called the median.
          </li>
          <li>
            <strong>P95:</strong> 95% of requests are faster. Represents the experience of most users, excluding
            the worst 5%.
          </li>
          <li>
            <strong>P99:</strong> 99% of requests are faster. Represents the experience of nearly all users.
            Critical for user-facing systems.
          </li>
          <li>
            <strong>P99.9:</strong> 99.9% of requests are faster. Used for mission-critical systems (payments,
            healthcare, emergency services).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/latency-percentiles.svg"
          alt="Latency Percentiles Explained"
          caption="Latency Percentiles — showing histogram distribution and cumulative distribution function (CDF) with P50, P95, and P99 markers"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Example: Interpreting Percentiles</h3>
        <p>
          If your API reports:
        </p>
        <ul>
          <li>P50 = 50ms</li>
          <li>P95 = 150ms</li>
          <li>P99 = 300ms</li>
        </ul>
        <p>
          This means:
        </p>
        <ul>
          <li>Half of your users experience latency under 50ms (great experience).</li>
          <li>95% of users experience latency under 150ms (acceptable).</li>
          <li>1% of users experience latency over 300ms (poor experience).</li>
        </ul>
        <p>
          <strong>Interview insight:</strong> If you have 1 million requests per day, P99 = 300ms means 10,000
          requests per day exceed 300ms. For a user-facing system, this may be unacceptable. Always tie percentiles
          to absolute numbers and business impact.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tail Latency Compounding</h3>
        <p>
          In systems with multiple sequential dependencies, tail latency <strong>compounds</strong>. If a request
          must call 10 services sequentially, and each has P99 = 50ms, the total P99 is NOT 50ms — it can exceed
          250-500ms due to variance accumulation.
        </p>
        <p>
          <strong>Mathematical intuition:</strong> The probability that <em>all</em> 10 services complete under
          50ms is 0.99^10 ≈ 0.90. So P90 for the chain is 50ms, but P99 is much higher.
        </p>
        <p>
          <strong>Mitigation strategies:</strong>
        </p>
        <ul>
          <li>Make calls in parallel when possible.</li>
          <li>Use speculative execution (send to multiple replicas, use fastest response).</li>
          <li>Set aggressive timeouts at each layer.</li>
          <li>Cache frequently accessed data to eliminate calls.</li>
        </ul>
      </section>

      <section>
        <h2>SLI → SLO → SLA Hierarchy</h2>
        <p>
          Latency management requires understanding the hierarchy of reliability concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLI (Service Level Indicator)</h3>
        <p>
          <strong>What you measure.</strong> An SLI is a quantitative metric that measures some aspect of service
          behavior. For latency, common SLIs include:
        </p>
        <ul>
          <li>Request latency (P50, P95, P99)</li>
          <li>Error rate (% of failed requests)</li>
          <li>Throughput (requests per second)</li>
          <li>Availability (% of successful requests)</li>
        </ul>
        <p>
          <strong>Choosing SLIs:</strong> Select SLIs that reflect user experience. For a search API, P99 latency
          is more meaningful than average latency. For a batch processing system, throughput may matter more than
          individual request latency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLO (Service Level Objective)</h3>
        <p>
          <strong>Target value for the SLI.</strong> An SLO is a specific target for an SLI. Examples:
        </p>
        <ul>
          <li>P99 latency {'<'} 200ms (over rolling 30-day window)</li>
          <li>Error rate {'<'} 0.1% (over rolling 7-day window)</li>
          <li>Availability ≥ 99.99% (over rolling 30-day window)</li>
        </ul>
        <p>
          <strong>SLO design principles:</strong>
        </p>
        <ul>
          <li>
            <strong>Ambitious but achievable:</strong> SLOs should drive improvement but not be impossible.
          </li>
          <li>
            <strong>Measured over rolling windows:</strong> 30-day rolling windows smooth out temporary spikes.
          </li>
          <li>
            <strong>Tiered by criticality:</strong> Critical endpoints get stricter SLOs than non-critical ones.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLA (Service Level Agreement)</h3>
        <p>
          <strong>Contract with consequences.</strong> An SLA is a formal agreement with customers or stakeholders
          that includes penalties for violations. Examples:
        </p>
        <ul>
          <li>99.99% uptime guarantee with 10% credit for violations</li>
          <li>P99 latency {'<'} 500ms with service credit if exceeded</li>
          <li>Error rate {'<'} 1% with contract termination clause</li>
        </ul>
        <p>
          <strong>SLA vs SLO:</strong> SLOs are internal targets (usually stricter). SLAs are external contracts
          (usually more lenient to provide buffer). Example: SLO = 99.99%, SLA = 99.9%.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/sli-slo-sla-hierarchy.svg"
          alt="SLI SLO SLA Hierarchy"
          caption="SLI → SLO → SLA Hierarchy — showing the relationship between indicators (what you measure), objectives (targets), and agreements (contracts with consequences)"
        />
      </section>

      <section>
        <h2>Error Budgets</h2>
        <p>
          An <strong>error budget</strong> is the maximum amount of failure or unavailability that is acceptable
          within an SLO period. It is calculated as:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            Error Budget = 1 - SLO
          </p>
          <p className="mt-2 text-sm text-muted">
            Example: 99.9% SLO → 0.1% error budget → ~43 minutes downtime/month allowed
          </p>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Budget Examples</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">SLO</th>
              <th className="p-3 text-left">Error Budget</th>
              <th className="p-3 text-left">Downtime/Year</th>
              <th className="p-3 text-left">Downtime/Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">99%</td>
              <td className="p-3">1%</td>
              <td className="p-3">~3.65 days</td>
              <td className="p-3">~7.3 hours</td>
            </tr>
            <tr>
              <td className="p-3">99.9%</td>
              <td className="p-3">0.1%</td>
              <td className="p-3">~8.76 hours</td>
              <td className="p-3">~43 minutes</td>
            </tr>
            <tr>
              <td className="p-3">99.99%</td>
              <td className="p-3">0.01%</td>
              <td className="p-3">~52.6 minutes</td>
              <td className="p-3">~4.3 minutes</td>
            </tr>
            <tr>
              <td className="p-3">99.999%</td>
              <td className="p-3">0.001%</td>
              <td className="p-3">~5.26 minutes</td>
              <td className="p-3">~26 seconds</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Budget Policy</h3>
        <p>
          Define what happens when the error budget is exhausted:
        </p>
        <ul>
          <li>
            <strong>Feature freeze:</strong> Stop launching new features until budget recovers.
          </li>
          <li>
            <strong>Focus on reliability:</strong> Engineering effort shifts to fixing reliability issues.
          </li>
          <li>
            <strong>Escalation:</strong> Notify leadership, trigger incident review.
          </li>
          <li>
            <strong>Post-mortem:</strong> Conduct blameless post-mortem to identify root causes.
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> Error budgets align engineering incentives. Without error budgets,
          teams may prioritize features over reliability. With error budgets, teams must balance innovation with
          stability.
        </p>
      </section>

      <section>
        <h2>Tail Latency Optimization</h2>
        <p>
          Tail latency (P99, P99.9) is often 10-100× worse than median latency. Optimizing tail latency requires
          identifying and eliminating outliers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Causes of Tail Latency</h3>
        <ul>
          <li>
            <strong>GC pauses:</strong> Garbage collection can stop the world for 100ms+.
          </li>
          <li>
            <strong>Resource contention:</strong> Lock waits, thread starvation, connection pool exhaustion.
          </li>
          <li>
            <strong>Downstream tail latency:</strong> Slow dependencies cascade upstream.
          </li>
          <li>
            <strong>Network issues:</strong> Packet loss, TCP retransmits, DNS failures.
          </li>
          <li>
            <strong>Cold starts:</strong> Lazy initialization, cache misses, instance warmup.
          </li>
          <li>
            <strong>Queue buildup:</strong> Requests waiting in overloaded queues.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimization Techniques</h3>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Speculative Execution (Hedging)</h4>
        <p>
          Send the same request to multiple replicas and use the fastest response. This is effective when:
        </p>
        <ul>
          <li>Replicas have independent failure modes.</li>
          <li>The cost of extra requests is acceptable.</li>
          <li>Tail latency is caused by random outliers (not systemic issues).</li>
        </ul>
        <p>
          <strong>Example:</strong> Google Bigtable uses speculative execution after a delay. If the primary
          replica does not respond within 10ms, send to a second replica. Use whichever responds first.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Load Shedding</h4>
        <p>
          Reject low-priority requests when the system is overloaded to protect tail latency for critical requests.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Define priority levels for requests.</li>
          <li>Monitor queue depth and latency.</li>
          <li>When thresholds are exceeded, reject low-priority requests with 503.</li>
        </ul>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Queue Prioritization</h4>
        <p>
          Use priority queues to ensure critical requests are processed first.
        </p>
        <p>
          <strong>Example:</strong> A payment API processes payment requests before analytics requests, even if
          analytics requests arrived first.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Aggressive Caching</h4>
        <p>
          Cache frequently accessed data to eliminate latency variability from backend calls.
        </p>
        <p>
          <strong>Strategies:</strong>
        </p>
        <ul>
          <li>Cache hot paths at the edge (CDN, edge compute).</li>
          <li>Use local caches (in-memory) for ultra-low latency.</li>
          <li>Pre-populate caches for predictable traffic patterns.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/tail-latency-optimization.svg"
          alt="Tail Latency Optimization Techniques"
          caption="Tail Latency Optimization — showing tail latency compounding across sequential calls and optimization techniques (speculative execution, load shedding, queue prioritization, caching)"
        />
      </section>

      <section>
        <h2>Setting Latency SLAs</h2>
        <p>
          Defining appropriate latency SLAs requires understanding user expectations, business requirements, and
          technical feasibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Expectation Research</h3>
        <p>
          Studies on user perception of latency:
        </p>
        <ul>
          <li>
            <strong>0-100ms:</strong> Instant response. Users perceive no delay.
          </li>
          <li>
            <strong>100-300ms:</strong> Noticeable but acceptable. Users feel the system is responsive.
          </li>
          <li>
            <strong>300-1000ms:</strong> Users notice delay but remain engaged.
          </li>
          <li>
            <strong>{'>'} 1000ms:</strong> Users become frustrated. Attention wanders.
          </li>
          <li>
            <strong>{'>'} 3000ms:</strong> Users may abandon the task.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLA Design Framework</h3>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Identify critical user journeys:</strong> What actions are most important? (Search, checkout,
            login, etc.)
          </li>
          <li>
            <strong>Measure current performance:</strong> Establish baseline P50, P95, P99 for each journey.
          </li>
          <li>
            <strong>Set ambitious but achievable targets:</strong> Aim for 20-30% improvement from baseline.
          </li>
          <li>
            <strong>Define measurement methodology:</strong> How will you measure? (Client-side, server-side, RUM?)
          </li>
          <li>
            <strong>Establish error budgets:</strong> How much failure is acceptable?
          </li>
          <li>
            <strong>Define consequences:</strong> What happens when SLAs are violated?
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Latency Budget Allocation</h3>
        <p>
          For systems with multiple components, allocate latency budgets across layers:
        </p>
        <ul>
          <li>
            <strong>Network latency:</strong> 20-50ms (varies by geography)
          </li>
          <li>
            <strong>Load balancer:</strong> 5-10ms
          </li>
          <li>
            <strong>API gateway:</strong> 10-20ms
          </li>
          <li>
            <strong>Application processing:</strong> 50-100ms
          </li>
          <li>
            <strong>Database query:</strong> 20-50ms
          </li>
          <li>
            <strong>Cache lookup:</strong> 1-5ms
          </li>
        </ul>
        <p>
          <strong>Total budget:</strong> ~100-250ms for P99. Allocate headroom (20-30%) for unexpected delays.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Interview Framework: Latency Discussion</h3>
          <ol className="space-y-2">
            <li>1. Clarify which percentile matters (P50? P99?)</li>
            <li>2. Ask about user expectations and business impact</li>
            <li>3. Establish baseline and set realistic targets</li>
            <li>4. Identify bottlenecks in the critical path</li>
            <li>5. Propose optimizations (caching, parallel calls, etc.)</li>
            <li>6. Discuss monitoring and alerting strategy</li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Your API has P50 = 50ms but P99 = 2 seconds. How do you diagnose and fix the tail latency?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Diagnosis:</strong> (1) Use distributed tracing to identify slow spans. (2) Check for GC pauses, lock contention, resource exhaustion. (3) Analyze slow query logs, connection pool waits. (4) Look for external dependency latency spikes.</li>
                <li><strong>Common causes:</strong> Database lock waits, slow queries, GC pauses, thread pool exhaustion, downstream service tail latency, network issues.</li>
                <li><strong>Fixes:</strong> Add timeouts, optimize slow queries with indexing, increase connection pool size, tune GC settings, add caching, implement circuit breakers.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Design latency SLAs for a payment processing API. What percentiles do you choose, what thresholds, and what are the consequences of violation?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Percentiles:</strong> P50 (typical), P95 (most users), P99 (all users), P99.9 (edge cases). P99 is most important for SLA.</li>
                <li><strong>Thresholds:</strong> P50 &lt; 200ms, P95 &lt; 500ms, P99 &lt; 1s. Payment APIs can be slower due to consistency requirements.</li>
                <li><strong>Consequences:</strong> Service credits for SLA violations. Internal error budget tracking. Escalation if error budget exhausted.</li>
                <li><strong>Enforcement:</strong> Rate limit clients, priority queues, shed load when P99 exceeds threshold, auto-scale based on latency.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your service calls 5 downstream services sequentially. Each has P99 = 100ms. What is the expected P99 for your service? How do you reduce it?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Expected P99:</strong> Can exceed 500ms (5 × 100ms). Tail latency compounds in sequential calls.</li>
                <li><strong>Reduce with parallel calls:</strong> Make independent calls in parallel. Total P99 = max of parallel calls, not sum.</li>
                <li><strong>Add timeouts:</strong> Set aggressive timeouts per service (e.g., 50ms each). Fail fast on slow services.</li>
                <li><strong>Cache responses:</strong> Cache responses from slow services to reduce call frequency.</li>
                <li><strong>Speculative execution:</strong> Send to 2 replicas, use fastest response. Reduces tail latency but doubles load.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Explain the relationship between SLI, SLO, and SLA. How do you use error budgets to balance reliability and feature development?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>SLI (Indicator):</strong> What you measure (e.g., P99 latency, error rate).</li>
                <li><strong>SLO (Objective):</strong> Target value for SLI (e.g., P99 &lt; 500ms).</li>
                <li><strong>SLA (Agreement):</strong> Contract with consequences (e.g., service credits if SLO violated).</li>
                <li><strong>Error budget:</strong> 1 - SLO. Example: 99.9% SLO = 0.1% error budget.</li>
                <li><strong>Balance:</strong> If error budget exhausted, freeze features, focus on reliability. If budget healthy, can take more risks.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Your P99 latency spikes during peak traffic. What are the likely causes and how do you address them?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Causes:</strong> Resource exhaustion (CPU, memory, connections), database lock contention, downstream service degradation, network saturation, GC pauses.</li>
                <li><strong>Immediate:</strong> Scale horizontally, enable circuit breakers, shed non-critical load, increase cache TTLs.</li>
                <li><strong>Long-term:</strong> Optimize slow queries, add read replicas, implement auto-scaling, add backpressure mechanisms.</li>
                <li><strong>Prevention:</strong> Load test at 2-3× peak, set alerts at 60-70% capacity, implement graceful degradation.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you set latency budgets for a microservices architecture? How do you enforce them across teams?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Budget allocation:</strong> Start with user-facing latency SLO (e.g., 2s). Allocate budgets per service (e.g., 200ms each for 10 services).</li>
                <li><strong>Hierarchy:</strong> User timeout &gt; Gateway timeout &gt; Service timeout &gt; Database timeout. Each layer shorter than caller.</li>
                <li><strong>Enforcement:</strong> (1) Include latency budgets in API contracts. (2) Enforce in code reviews. (3) Monitor and alert on budget violations. (4) Performance testing in CI/CD.</li>
                <li><strong>Tooling:</strong> Distributed tracing to track budget consumption per service. Dashboards showing budget remaining.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Monitoring & Alerting</h2>
        <p>
          Latency SLAs are useless without proper monitoring and alerting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Monitor</h3>
        <ul>
          <li>
            <strong>Latency histograms:</strong> Track full distribution, not just averages.
          </li>
          <li>
            <strong>Percentile trends:</strong> P50, P95, P99 over time (1m, 5m, 1h, 1d windows).
          </li>
          <li>
            <strong>Error budget burn rate:</strong> How fast is the budget being consumed?
          </li>
          <li>
            <strong>Saturation metrics:</strong> Queue depth, connection pool usage, thread pool utilization.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alerting Strategy</h3>
        <p>
          <strong>Multi-window alerting:</strong> Alert on both short-term spikes and long-term trends:
        </p>
        <ul>
          <li>
            <strong>Urgent alert:</strong> P99 {'>'} SLA for 5 minutes (immediate response needed).
          </li>
          <li>
            <strong>Warning alert:</strong> P99 {'>'} SLA for 1 hour (investigate soon).
          </li>
          <li>
            <strong>Budget alert:</strong> 50% of error budget consumed in 1 day (review and plan).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Measurement Best Practices</h3>
        <ul>
          <li>
            <strong>Measure client-side:</strong> Server-side latency does not include network time.
          </li>
          <li>
            <strong>Use histograms:</strong> Pre-aggregate into buckets for efficient storage and querying.
          </li>
          <li>
            <strong>Segment by dimensions:</strong> Break down by endpoint, region, device type.
          </li>
          <li>
            <strong>Track saturation:</strong> Monitor queue depths and resource utilization to predict issues.
          </li>
        </ul>
      </section>

      <section>
        <h2>Latency SLA Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Defined latency SLAs for critical user journeys (P50, P95, P99)</li>
          <li>✓ SLAs aligned with user expectations and business requirements</li>
          <li>✓ Error budgets calculated and tracked</li>
          <li>✓ Latency budgets allocated across components</li>
          <li>✓ Monitoring in place (histograms, percentiles, burn rate)</li>
          <li>✓ Alerting configured (multi-window, budget-based)</li>
          <li>✓ Tail latency optimization strategies implemented</li>
          <li>✓ Regular SLA reviews and adjustments</li>
          <li>✓ Post-mortems for SLA violations</li>
          <li>✓ Documentation of measurement methodology</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
