"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-capacity-planning",
  title: "Capacity Planning",
  description: "Comprehensive guide to capacity planning — demand forecasting, resource modeling, headroom management, growth projections, and capacity optimization for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "capacity-planning",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "capacity-planning", "forecasting", "resource-modeling", "headroom", "growth"],
  relatedTopics: ["cost-optimization", "scalability-strategy", "throughput-capacity", "latency-slas"],
};

export default function CapacityPlanningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Capacity planning</strong> is the process of determining the production resources
          (compute, memory, storage, network) needed to meet current and future demand while maintaining
          performance targets and cost efficiency. It answers the question: &quot;How much infrastructure
          do we need, when do we need it, and how do we know before we run out?&quot;
        </p>
        <p>
          Capacity planning is a continuous discipline — not a one-time exercise. Demand changes as user
          growth, feature launches, and seasonal patterns fluctuate. Infrastructure changes as new services
          are deployed, existing services are optimized, and technology evolves. Effective capacity planning
          requires accurate demand forecasting, resource modeling (how much infrastructure does a unit of
          demand consume?), and headroom management (how much buffer between current usage and capacity
          limits?).
        </p>
        <p>
          For staff and principal engineer candidates, capacity planning demonstrates operational maturity.
          Interviewers expect you to design systems that can forecast capacity needs 3-6 months in advance,
          identify bottlenecks before they cause outages, balance cost efficiency with performance
          headroom, and communicate capacity risk to leadership with actionable recommendations.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Capacity vs Performance</h3>
          <p>
            <strong>Performance</strong> measures how fast the system responds under current load.
            <strong>Capacity</strong> measures how much load the system can handle before performance degrades below acceptable levels.
          </p>
          <p className="mt-3">
            A system can have excellent performance at current load but insufficient capacity for growth.
            Conversely, a system can have excess capacity (wasting money) while still having poor
            performance due to architectural inefficiencies. Capacity planning ensures the right amount
            of infrastructure for the right performance at the right cost.
          </p>
        </div>

        <p>
          Capacity failures are among the most preventable production incidents. Unlike software bugs
          or network failures, capacity exhaustion is predictable — the signals are visible in utilization
          trends, growth rates, and headroom metrics. When a capacity failure occurs, it is almost always
          a process failure: nobody was monitoring the right metrics, the forecast was wrong, or the
          recommendation was ignored.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding capacity planning requires grasping several foundational concepts about demand
          modeling, resource utilization, and growth forecasting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Demand Forecasting</h3>
        <p>
          Demand forecasting predicts future load based on historical data, growth trends, and planned
          changes. Historical data provides the baseline — average and peak requests per second, data
          volume growth rate, and storage consumption trends. Growth trends account for user growth,
          feature adoption, and seasonal patterns (e.g., holiday shopping spikes). Planned changes
          include new product launches, marketing campaigns, and API deprecations that will shift load
          patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource Modeling</h3>
        <p>
          Resource modeling translates demand into infrastructure requirements. If each request consumes
          10ms of CPU time and 1MB of memory, then 10,000 RPS requires 100 CPU-seconds per second (100
          CPU cores at 100% utilization) and 10GB of memory per second of processing. Since running at
          100% utilization causes latency degradation, we add headroom — typically 30-50% — resulting
          in 130-150 CPU cores and proportional memory.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Headroom Management</h3>
        <p>
          Headroom is the buffer between current utilization and capacity limits. Running at 90% CPU
          utilization leaves only 10% headroom — a 10% traffic spike causes saturation and latency
          degradation. Running at 50% utilization leaves 50% headroom but wastes 50% of infrastructure
          cost. The optimal headroom level depends on the system&apos;s ability to scale quickly (auto-scaling
          reduces required headroom) and the cost of capacity failure (high-cost failures justify more
          headroom).
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Capacity planning architecture spans demand measurement, resource modeling, forecasting,
          headroom management, and procurement orchestration.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/capacity-planning-framework.svg"
          alt="Capacity Planning Framework"
          caption="Capacity Planning — showing demand forecasting, resource modeling, headroom management, and procurement flow"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Capacity Monitoring Pipeline</h3>
        <p>
          The capacity monitoring pipeline continuously measures resource utilization (CPU, memory,
          disk, network) across all infrastructure components, aggregates utilization by service and
          tier, compares utilization against capacity limits, calculates headroom (time until capacity
          exhaustion at current growth rate), and generates alerts when headroom falls below thresholds.
          This pipeline runs continuously — capacity data should be visible on dashboards in real time,
          not computed manually during quarterly reviews.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Forecasting Models</h3>
        <p>
          Forecasting models predict future capacity needs based on different growth scenarios. The
          baseline forecast assumes current growth trends continue unchanged. The optimistic forecast
          assumes growth accelerates (successful product launch, viral growth). The pessimistic forecast
          assumes growth decelerates (market saturation, competitive pressure). Capacity should be
          planned for the baseline forecast with enough buffer to handle the optimistic scenario through
          auto-scaling or emergency procurement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/resource-utilization-modeling.svg"
          alt="Resource Utilization Modeling"
          caption="Resource Modeling — translating demand into infrastructure requirements with headroom calculations"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/capacity-headroom-management.svg"
          alt="Capacity Headroom Management"
          caption="Headroom Management — showing utilization trends, growth projections, and capacity exhaustion timelines"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Static Provisioning</strong></td>
              <td className="p-3">
                Predictable costs. Full control over infrastructure. No auto-scaling complexity.
              </td>
              <td className="p-3">
                Slow response to demand changes. Requires manual procurement. Over-provisioning waste or under-provisioning risk.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Auto-Scaling</strong></td>
              <td className="p-3">
                Automatic response to demand. Pay for what you use. Minimal manual intervention.
              </td>
              <td className="p-3">
                Scaling latency (minutes to provision). Cold start performance impact. Cost unpredictability during spikes.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Reserved Capacity</strong></td>
              <td className="p-3">
                Significant cost savings (30-60% vs on-demand). Guaranteed capacity. Budget predictability.
              </td>
              <td className="p-3">
                Long-term commitment (1-3 years). Inflexible to demand changes. Upfront payment or higher monthly cost.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Hybrid (Reserved + On-Demand)</strong></td>
              <td className="p-3">
                Cost savings on baseline capacity. Flexibility for spikes. Balanced risk and cost.
              </td>
              <td className="p-3">
                Complex capacity management. Requires accurate baseline forecasting. Two billing models to manage.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Plan for Peak, Not Average</h3>
        <p>
          Capacity must handle peak demand, not average demand. If average traffic is 10,000 RPS but
          peak traffic is 30,000 RPS (3× average), the system must be sized for 30,000 RPS. Sizing for
          average demand causes outages during peak periods. Use the 99th percentile of historical
          traffic as the baseline for capacity planning, not the average or median.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Maintain 30-50% Headroom</h3>
        <p>
          Maintain 30-50% headroom between current peak utilization and capacity limits. This headroom
          absorbs traffic spikes, provides time for emergency procurement, and prevents latency
          degradation as utilization approaches saturation. The exact headroom level depends on scaling
          speed — systems that can auto-scale within minutes need less headroom than systems that require
          days to procure and provision new infrastructure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Forecast 3-6 Months Ahead</h3>
        <p>
          Maintain a rolling 3-6 month capacity forecast that accounts for growth trends, planned
          feature launches, and seasonal patterns. Review the forecast monthly and adjust as new data
          becomes available. A 3-month forecast gives enough lead time to procure infrastructure
          (especially for reserved capacity or physical hardware) before capacity is exhausted. A
          6-month forecast provides additional buffer for unexpected demand acceleration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor the Right Metrics</h3>
        <p>
          Monitor utilization metrics that directly correlate with capacity exhaustion: CPU utilization
          (compute capacity), memory utilization (memory capacity), disk space and IOPS (storage
          capacity), and network bandwidth (network capacity). Additionally, monitor derived metrics:
          queue depth (queuing capacity), connection pool utilization (connection capacity), and
          thread pool utilization (thread capacity). Alert when any metric exceeds 70% utilization —
          this provides early warning before capacity exhaustion.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Planning for Average Instead of Peak</h3>
        <p>
          The most common capacity planning error is sizing infrastructure for average demand rather
          than peak demand. Average demand may be 10,000 RPS, but peak demand during a product launch
          or marketing campaign may be 50,000 RPS. Infrastructure sized for average demand will fail
          during peak periods, causing outages that could have been prevented with proper peak-based
          capacity planning.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Indirect Capacity Constraints</h3>
        <p>
          Capacity planning often focuses on direct constraints (CPU, memory, disk) while ignoring
          indirect constraints (connection pools, thread pools, file descriptors, rate limits). A
          system may have 50% CPU headroom but be limited by a connection pool that is 95% utilized.
          Monitor all capacity constraints — direct and indirect — and plan for the most restrictive
          constraint, not the most obvious one.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Accounting for Growth Acceleration</h3>
        <p>
          Linear growth forecasts assume that demand grows at a constant rate. In reality, growth is
          often exponential — a successful product launch can 10× demand overnight. Capacity plans
          should include scenario analysis: what happens if demand grows 2× faster than forecast? What
          happens if a viral event causes 10× demand for one week? Having a plan for these scenarios
          (auto-scaling configuration, emergency procurement process, load shedding strategy) prevents
          panic during unexpected demand spikes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Confusing Utilization with Capacity</h3>
        <p>
          High utilization does not always mean insufficient capacity — it may mean inefficient resource
          usage. A service running at 90% CPU utilization because of an inefficient algorithm needs
          optimization, not more servers. Before provisioning more capacity, investigate whether the
          high utilization is caused by inefficiency (algorithmic issues, unnecessary computations,
          memory leaks) that can be addressed through optimization. Capacity planning should include
          efficiency reviews — optimizing existing capacity is cheaper and faster than provisioning
          new capacity.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Amazon — Holiday Season Capacity Planning</h3>
        <p>
          Amazon&apos;s holiday season capacity planning begins 6-9 months in advance. Historical data from
          previous holiday seasons provides the baseline demand forecast. Growth trends from the current
          year adjust the baseline upward. Planned promotions (Black Friday, Cyber Monday) add demand
          spikes that require additional capacity. Amazon uses a hybrid approach: reserved capacity for
          the baseline demand (cost-efficient, guaranteed availability) and auto-scaling for demand
          spikes above baseline. During the holiday season, Amazon&apos;s infrastructure scales to 2-3×
          its normal capacity, then scales back down in January.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Auto-Scaling Capacity Management</h3>
        <p>
          Netflix uses auto-scaling as its primary capacity management strategy. Each service defines
          scaling policies based on CPU utilization, request rate, and custom metrics (streaming quality,
          error rates). Netflix&apos;s auto-scaling can provision new instances within 5-10 minutes,
          significantly reducing the required headroom compared to static provisioning. Netflix also
          uses predictive scaling — machine learning models forecast demand based on historical patterns
          (time of day, day of week, content release schedule) and pre-scale infrastructure before
          demand increases.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Slack — Capacity Planning for Real-Time Communication</h3>
        <p>
          Slack&apos;s capacity planning must account for the real-time nature of its service — messages must
          be delivered within seconds, and capacity shortages cause immediate user-visible degradation.
          Slack monitors connection pool utilization (WebSocket connections per server), message queue
          depth (messages waiting for delivery), and delivery latency (time from message send to
          delivery). Capacity alerts trigger when any metric exceeds 70% of its limit, providing 30%
          headroom for traffic spikes. Slack&apos;s capacity planning team reviews utilization trends
          weekly and adjusts capacity monthly, with emergency scaling procedures for unexpected demand.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub — Reserved Capacity for Predictable Baseline</h3>
        <p>
          GitHub uses reserved capacity for its baseline infrastructure (compute, storage, network)
          because its traffic patterns are relatively predictable — business hours peaks, weekend
          troughs, and gradual growth. Reserved capacity provides 40-60% cost savings compared to
          on-demand pricing. GitHub uses on-demand capacity for unpredictable spikes — product launches,
          major open-source project migrations, and security incident response traffic. This hybrid
          approach balances cost efficiency (reserved for baseline) with flexibility (on-demand for
          spikes).
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Capacity planning decisions have security implications — insufficient capacity can cause security controls to fail, while excess capacity can increase the attack surface.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity-Related Security Risks</h3>
          <ul className="space-y-2">
            <li>
              <strong>Security Control Degradation:</strong> When infrastructure approaches capacity limits, security controls (WAF, rate limiting, authentication) may degrade or fail. Mitigation: prioritize security infrastructure in capacity planning, maintain higher headroom for security controls (50%+ vs 30% for general infrastructure), monitor security control utilization separately.
            </li>
            <li>
              <strong>Capacity Exhaustion Attacks:</strong> Attackers deliberately exhaust capacity (storage, connections, compute) to cause denial-of-service. Mitigation: implement per-client capacity limits, detect and block capacity exhaustion patterns, maintain emergency capacity reserves for attack mitigation.
            </li>
            <li>
              <strong>Emergency Procurement Risks:</strong> During capacity emergencies, normal procurement security controls may be bypassed. Mitigation: maintain pre-approved emergency procurement procedures with security review, use trusted vendors only, verify security compliance of emergency infrastructure.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity Planning Data Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Utilization Data Sensitivity:</strong> Capacity utilization data reveals business patterns (traffic volumes, growth rates, user activity) that competitors could exploit. Mitigation: restrict access to capacity data, anonymize utilization reports shared externally, classify capacity forecasts as confidential.
            </li>
            <li>
              <strong>Forecast Data Integrity:</strong> Tampered capacity forecasts could cause under-provisioning (leading to outages) or over-provisioning (wasting budget). Mitigation: protect forecast data with access controls, use version-controlled forecasting models, audit forecast changes.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Capacity planning must be validated through systematic testing — forecasts must be compared against actual demand, resource models must be verified under load, and headroom calculations must be validated during peak conditions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity Validation Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Load Testing at Peak:</strong> Run load tests at 2× forecasted peak demand. Verify that the system handles the load within performance targets. Identify the actual capacity limit (where performance degrades below SLOs) and compare it with the planned capacity limit. Adjust resource models based on actual results.
            </li>
            <li>
              <strong>Soak Testing:</strong> Run sustained load tests (4-8 hours) at 80% of capacity to verify that the system maintains stable performance over time. Identify memory leaks, connection pool exhaustion, and gradual performance degradation that only appear under sustained load.
            </li>
            <li>
              <strong>Forecast Accuracy Testing:</strong> Compare capacity forecasts against actual demand monthly. Calculate forecast accuracy (forecast vs actual) and identify systematic biases (consistently over-forecasting or under-forecasting). Adjust forecasting models based on accuracy trends.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Scenario Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Growth Acceleration:</strong> Simulate 2× and 5× demand growth over 30 days. Verify that auto-scaling responds appropriately, procurement processes can keep pace, and headroom is maintained throughout the acceleration.
            </li>
            <li>
              <strong>Capacity Failure:</strong> Simulate the loss of 30% of capacity (e.g., an availability zone outage). Verify that remaining capacity can handle the load, auto-scaling provisions replacement capacity, and performance remains within SLOs.
            </li>
            <li>
              <strong>Emergency Procurement:</strong> Test the emergency procurement process — from capacity alert to new infrastructure online. Measure end-to-end time and identify bottlenecks in the procurement pipeline.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Capacity Planning Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Demand forecast maintained for 3-6 months with monthly reviews</li>
            <li>✓ Resource models validated against actual utilization (within 10% accuracy)</li>
            <li>✓ Headroom maintained at 30-50% for all capacity constraints</li>
            <li>✓ All capacity constraints monitored (CPU, memory, disk, network, connections, threads)</li>
            <li>✓ Alerts configured at 70% utilization for all capacity constraints</li>
            <li>✓ Capacity planning includes indirect constraints (connection pools, rate limits)</li>
            <li>✓ Scenario analysis maintained (baseline, optimistic, pessimistic forecasts)</li>
            <li>✓ Auto-scaling configured with appropriate scaling policies and cooldown periods</li>
            <li>✓ Emergency procurement process documented and tested quarterly</li>
            <li>✓ Capacity dashboards visible to engineering and leadership teams</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://sre.google/workbook/capacity-planning/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google SRE Workbook — Capacity Planning
            </a>
          </li>
          <li>
            <a href="https://aws.amazon.com/architecture/well-architected/cost-optimization/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Well-Architected — Capacity Planning and Cost Optimization
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/scaling-netflix-how-we-plan-for-capacity-3068c36e7d15" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix — Scaling Netflix: How We Plan for Capacity
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/login/articles/login_winter15_06_meikle.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX — Capacity Planning in Practice
            </a>
          </li>
          <li>
            <a href="https://cloud.google.com/architecture/framework/scalability" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Cloud — Scalability and Capacity Planning Architecture
            </a>
          </li>
          <li>
            <a href="https://queue.acm.org/detail.cfm?id=2898445" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              ACM Queue — The Art of Capacity Planning
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
