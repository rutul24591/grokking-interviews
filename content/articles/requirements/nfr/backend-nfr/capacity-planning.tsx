"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-capacity-planning-extensive",
  title: "Capacity Planning",
  description: "Comprehensive guide to capacity planning, covering demand forecasting, resource sizing, growth planning, and production capacity management for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "capacity-planning",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "capacity-planning", "scaling", "forecasting", "infrastructure", "cost-optimization"],
  relatedTopics: ["throughput-capacity", "scalability-strategy", "cost-optimization", "auto-scaling"],
};

export default function CapacityPlanningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Capacity Planning</strong> is the practice of determining the resources needed to meet
          future demand. It balances cost (not over-provisioning) with reliability (not under-provisioning).
        </p>
        <p>
          Capacity planning answers:
        </p>
        <ul>
          <li>How much infrastructure do we need today?</li>
          <li>How much will we need in 6 months? 1 year?</li>
          <li>When do we need to add capacity?</li>
          <li>What is our headroom for traffic spikes?</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Capacity Planning is Risk Management</h3>
          <p>
            Under-provisioning risks outages and poor user experience. Over-provisioning wastes money.
            Good capacity planning finds the optimal balance based on business priorities and risk tolerance.
          </p>
        </div>
      </section>

      <section>
        <h2>Capacity Planning Process</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/capacity-planning.svg"
          alt="Capacity Planning Process"
          caption="Capacity Planning — showing planning cycle (Measure→Forecast→Calculate→Plan→Monitor), capacity calculation formula, growth forecasting, and alerting thresholds"
        />
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Measure current usage:</strong> Baseline CPU, memory, network, storage, database.
          </li>
          <li>
            <strong>Forecast demand:</strong> Project future traffic based on growth, seasonality, business plans.
          </li>
          <li>
            <strong>Calculate requirements:</strong> Translate demand to resource needs.
          </li>
          <li>
            <strong>Plan procurement:</strong> When to add capacity (lead time for hardware, cloud scaling).
          </li>
          <li>
            <strong>Monitor and adjust:</strong> Track actual vs forecast, refine models.
          </li>
        </ol>
      </section>

      <section>
        <h2>Capacity Planning Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/capacity-planning-deep-dive.svg"
          alt="Capacity Planning Deep Dive"
          caption="Capacity Planning Deep Dive — showing demand forecasting methods, scaling approaches (Static/Auto-Scaling/Hybrid), alerting strategy, and best practices"
        />
        <p>
          Advanced capacity planning concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Demand Forecasting</h3>
        <p>
          Methods for predicting future demand:
        </p>
        <ul>
          <li>
            <strong>Historical growth:</strong> Extrapolate from past trends (e.g., 10% monthly growth).
          </li>
          <li>
            <strong>Business plans:</strong> Marketing campaigns, product launches, geographic expansion.
          </li>
          <li>
            <strong>Seasonality:</strong> Holiday peaks, day/week patterns, events.
          </li>
          <li>
            <strong>Conversion funnels:</strong> User acquisition → activation → engagement → revenue.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource Sizing</h3>
        <p>
          Calculate resources needed:
        </p>
        <ul>
          <li>
            <strong>Compute:</strong> Based on RPS, latency requirements, CPU/memory per request.
          </li>
          <li>
            <strong>Memory:</strong> Working set size, caching requirements.
          </li>
          <li>
            <strong>Storage:</strong> Data growth rate, retention requirements.
          </li>
          <li>
            <strong>Network:</strong> Bandwidth requirements, egress costs.
          </li>
          <li>
            <strong>Database:</strong> QPS, storage, IOPS requirements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Capacity Models</h2>
        <p>
          Different approaches to capacity management:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Static Capacity</h3>
        <p>
          Fixed infrastructure sized for peak demand.
        </p>
        <p>
          <strong>Pros:</strong> Predictable cost, no scaling delays.
        </p>
        <p>
          <strong>Cons:</strong> Over-provisioned most of the time, expensive.
        </p>
        <p>
          <strong>Use when:</strong> Predictable traffic, strict latency requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Auto-Scaling</h3>
        <p>
          Infrastructure scales automatically based on metrics.
        </p>
        <p>
          <strong>Pros:</strong> Cost-efficient, handles unpredictable traffic.
        </p>
        <p>
          <strong>Cons:</strong> Scaling delay, complexity.
        </p>
        <p>
          <strong>Use when:</strong> Variable traffic, cloud-native architectures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hybrid Approach</h3>
        <p>
          Baseline capacity + auto-scaling for peaks.
        </p>
        <p>
          <strong>Example:</strong> 70% of peak as baseline, auto-scale for remaining 30%.
        </p>
        <p>
          <strong>Use when:</strong> Predictable baseline with unpredictable spikes.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. How do you approach capacity planning for a new product with uncertain demand?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Start conservative:</strong> Deploy minimal viable capacity (enough for 1K users). Use auto-scaling to handle growth.</li>
                <li><strong>Monitor closely:</strong> Track key metrics (CPU, memory, RPS, latency). Set alerts at 50%, 70%, 80% utilization.</li>
                <li><strong>Iterative scaling:</strong> Add capacity when hitting 70% utilization. Don&apos;t wait for 90% (no buffer for spikes).</li>
                <li><strong>Load testing:</strong> Test at 2-3× expected traffic to find breaking points before users do.</li>
                <li><strong>Cloud-native:</strong> Use serverless/auto-scaling where possible. Pay for what you use, scale to zero when idle.</li>
                <li><strong>Example:</strong> Start with 2 instances (1 active, 1 standby). Auto-scale to 10 max. Review weekly, adjust based on growth.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Your system is at 80% capacity and growing 10% monthly. When do you add capacity?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Calculate runway:</strong> At 80% with 10% monthly growth: Month 1 = 88%, Month 2 = 97% (critical!). Need capacity in 4-6 weeks.</li>
                <li><strong>Add capacity now:</strong> Don&apos;t wait. Lead time for provisioning + testing = 2-4 weeks. Order capacity when at 70-80%.</li>
                <li><strong>Target utilization:</strong> Plan for 60-70% normal utilization. Leaves 30-40% buffer for spikes and failures.</li>
                <li><strong>Scaling strategy:</strong> Add 50% more capacity. If at 80% with 10 servers, add 5 more (go to 48% utilization).</li>
                <li><strong>Auto-scaling:</strong> Configure auto-scaling to add capacity at 70% utilization. Prevents manual intervention.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Compare static capacity vs auto-scaling. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Static capacity:</strong> Fixed number of servers. ✓ Predictable cost, simple. ✗ Over-provisioned (waste) or under-provisioned (risk). Best for: Stable, predictable workloads (databases, stateful services).</li>
                <li><strong>Auto-scaling:</strong> Automatic scaling based on metrics. ✓ Cost-efficient, handles spikes. ✗ Scaling delay (2-5 min), complexity. Best for: Variable workloads (web APIs, batch processing).</li>
                <li><strong>Hybrid:</strong> Baseline static + auto-scaling for spikes. Best of both worlds. Example: 10 servers baseline, auto-scale to 50 max.</li>
                <li><strong>Decision:</strong> Stateful = static. Stateless = auto-scaling. Critical = hybrid with large buffer.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you plan capacity for a Black Friday sale with 10× normal traffic?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Historical analysis:</strong> Review last year&apos;s traffic patterns. Peak hour? Peak minute? Growth since then?</li>
                <li><strong>Load testing:</strong> Test at 15× normal traffic (50% buffer above expected peak). Find bottlenecks before sale.</li>
                <li><strong>Pre-scale:</strong> Add capacity BEFORE the sale (not during). Warm up caches. Pre-generate static content.</li>
                <li><strong>Auto-scaling:</strong> Configure aggressive scaling (add 50% capacity at 50% utilization during sale).</li>
                <li><strong>Graceful degradation:</strong> Disable non-critical features (recommendations, reviews) if overwhelmed. Protect checkout flow.</li>
                <li><strong>Post-sale:</strong> Scale down gradually. Review what worked. Update capacity model for next year.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What metrics do you track for capacity planning? How do you set alerting thresholds?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Compute:</strong> CPU utilization (alert at 60%, 70%, 80%), memory usage, instance count.</li>
                <li><strong>Database:</strong> Connection pool usage, query latency, replication lag, storage growth.</li>
                <li><strong>Network:</strong> Bandwidth utilization, packet loss, latency to dependencies.</li>
                <li><strong>Application:</strong> RPS, error rate, P99 latency, queue depth.</li>
                <li><strong>Thresholds:</strong> Warning at 60% (plan capacity), Critical at 70% (add capacity), Emergency at 80% (immediate action).</li>
                <li><strong>Trend alerting:</strong> Alert on growth rate (10% weekly growth = need capacity soon).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you balance cost optimization with reliability in capacity planning?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Tiered approach:</strong> Critical services = over-provision (reliability first). Non-critical = optimize for cost.</li>
                <li><strong>SLO-driven:</strong> Define SLOs first. Optimize cost within SLO constraints. Don&apos;t sacrifice SLO for savings.</li>
                <li><strong>Reserved capacity:</strong> Use reserved instances for baseline (40-60% savings). On-demand for spikes.</li>
                <li><strong>Auto-scaling:</strong> Scale down during low traffic (nights, weekends). Save 30-50% on variable workloads.</li>
                <li><strong>Cost of downtime:</strong> Calculate hourly downtime cost. If 1hr = $100K, don&apos;t risk $10K savings. Reliability ROI is positive.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Capacity Planning Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Current utilization baselined for all resources</li>
          <li>✓ Growth rate calculated and tracked</li>
          <li>✓ Peak traffic identified (daily, weekly, seasonal)</li>
          <li>✓ Capacity model documented (static, auto-scaling, hybrid)</li>
          <li>✓ Scaling thresholds defined</li>
          <li>✓ Lead time for capacity addition understood</li>
          <li>✓ Cost projections for growth scenarios</li>
          <li>✓ Regular capacity reviews scheduled</li>
          <li>✓ Alerting on capacity thresholds (70%, 80%, 90%)</li>
          <li>✓ Disaster recovery capacity planned</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
