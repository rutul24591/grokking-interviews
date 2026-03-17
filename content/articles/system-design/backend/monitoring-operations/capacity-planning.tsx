"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-capacity-planning-extensive",
  title: "Capacity Planning",
  description:
    "Plan and verify capacity so systems meet latency and availability objectives under growth, spikes, and failures.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "capacity-planning",
  wordCount: 1452,
  readingTime: 6,
  lastUpdated: "2026-03-14",
  tags: ["backend", "monitoring", "capacity-planning", "performance", "scaling"],
  relatedTopics: ["metrics", "dashboards", "infrastructure-monitoring", "sli-slo-sla"],
};

export default function CapacityPlanningConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Goal</h2>
        <p>
          <strong>Capacity planning</strong> is the practice of ensuring a system has enough compute, memory, storage, and
          network headroom to meet reliability and latency objectives, at an acceptable cost, as load changes over time.
          It is not just “buy more servers.” It is a decision system: forecast demand, model constraints, validate with
          measurement, and choose the cheapest set of changes that keep objectives intact.
        </p>
        <p>
          Capacity planning matters most when the cost of being wrong is high. Being under-provisioned causes brownouts,
          tail latency spikes, and cascading failures. Being over-provisioned quietly wastes money and can hide
          inefficiencies that later become painful at larger scale.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Three Numbers to Keep Separate</h3>
          <ul className="space-y-2">
            <li>
              <strong>Demand:</strong> how much work arrives (requests per second, jobs per hour, bytes ingested).
            </li>
            <li>
              <strong>Capacity:</strong> how much work you can process within objectives.
            </li>
            <li>
              <strong>Headroom:</strong> the slack you keep for spikes, failures, and uncertainty.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>The Capacity Planning Loop</h2>
        <p>
          Capacity planning is a loop, not a one-time exercise. Systems evolve: traffic patterns shift, dependencies
          change, and new features alter workloads. The loop keeps your assumptions fresh and makes scaling predictable.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/capacity-planning-diagram-1.svg"
          alt="Capacity planning loop diagram"
          caption="A practical loop: forecast, model, measure, test, decide, and verify."
        />
        <ol className="mt-4 space-y-2">
          <li>
            <strong>Define objectives:</strong> what latency and availability you must meet for core journeys.
          </li>
          <li>
            <strong>Forecast demand:</strong> growth trends, seasonality, product launches, and worst-case spikes.
          </li>
          <li>
            <strong>Model constraints:</strong> identify bottlenecks (CPU, DB connections, IOPS, queue depth).
          </li>
          <li>
            <strong>Validate with tests:</strong> load, stress, and soak tests aligned to real traffic shapes.
          </li>
          <li>
            <strong>Choose levers:</strong> scale out/in, tune concurrency, add caching, optimize queries, or redesign a
            hot path.
          </li>
          <li>
            <strong>Verify in production:</strong> monitor saturation and tail latency; confirm headroom targets.
          </li>
        </ol>
      </section>

      <section>
        <h2>Mental Models: Utilization, Queues, and Tail Latency</h2>
        <p>
          The most important capacity concept is that <strong>latency is nonlinear</strong>. As utilization rises, queues
          form and tail latency grows rapidly. Systems can look healthy at average utilization while the p99 becomes
          unacceptable. Capacity planning that focuses only on averages misses the failure mode users actually feel.
        </p>
        <p>
          A useful intuition: once a resource gets close to saturation (CPU, database connections, thread pools, disk
          IOPS), small demand changes can cause big tail-latency changes. The system becomes fragile. The goal of headroom
          is to stay away from that cliff.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/capacity-planning-diagram-2.svg"
          alt="Utilization vs latency curve diagram"
          caption="Tail latency often grows sharply near saturation; headroom keeps you away from the cliff."
        />
      </section>

      <section>
        <h2>Inputs: Forecasting Demand Without Fiction</h2>
        <p>
          Forecasts do not need to be perfect, but they must be honest about uncertainty. Capacity planning often fails
          when teams treat a single projection as truth. Better practice is to plan for a range: baseline growth plus a
          “high case” driven by events like campaigns, backfills, or customer onboarding.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Historical patterns:</strong> daily peaks, weekly cycles, seasonal spikes, and long-term trend.
          </li>
          <li>
            <strong>Product roadmap:</strong> new features that change request mix, payload sizes, or fanout patterns.
          </li>
          <li>
            <strong>Traffic mix:</strong> read/write ratios, cacheability, hot keys, and tenant skew.
          </li>
          <li>
            <strong>Failure assumptions:</strong> capacity required during an AZ or node loss, not just steady-state.
          </li>
        </ul>
        <p className="mt-4">
          When forecasts are uncertain, measure sensitivity: “If demand is 2x higher, which component fails first?” That
          analysis identifies the true bottleneck and prevents the common mistake of scaling the wrong tier.
        </p>
      </section>

      <section>
        <h2>Bottlenecks Are Multi-Resource</h2>
        <p>
          Capacity is rarely limited by a single knob. Compute can saturate, but so can memory, network egress, disk I/O,
          file descriptors, connection pools, and downstream rate limits. The bottleneck can move as you scale: after you
          add app servers, the database might become the limiter; after you add replicas, the cache might thrash.
        </p>
        <p>
          A practical approach is to maintain a “top bottlenecks list” with supporting signals: queue depth, pool wait
          times, timeouts, and error budgets. That list becomes the input to capacity reviews and on-call runbooks.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Bottleneck Signals</h3>
          <ul className="space-y-2">
            <li>Request p95/p99 growth paired with increasing queue depth or pool wait time.</li>
            <li>Retries rising without a matching increase in successful throughput.</li>
            <li>Database lock time, replication lag, or IOPS saturation under peak load.</li>
            <li>Cache hit ratio drop combined with higher backend QPS (a “cache erosion” pattern).</li>
            <li>Throttling or rate-limit responses from external dependencies.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Validation: Load, Stress, and Soak</h2>
        <p>
          Capacity planning is only as good as validation. Synthetic “one endpoint at a time” tests rarely match real
          production mixes. Strong validation uses representative request mixes, realistic payload sizes, and concurrency
          patterns that mirror peaks.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Load tests:</strong> prove you meet objectives at expected peaks.
          </li>
          <li>
            <strong>Stress tests:</strong> find the knee where the system becomes unstable and identify the first
            bottleneck.
          </li>
          <li>
            <strong>Soak tests:</strong> run for hours to expose leaks, compaction issues, and slow degradation.
          </li>
          <li>
            <strong>Failure tests:</strong> validate behavior under instance/AZ loss and dependency slowness.
          </li>
        </ul>
        <p className="mt-4">
          The key output of testing is not “we can do X requests per second.” The key output is a map from load to
          tail-latency and error rate, plus a list of bottlenecks and safe mitigations.
        </p>
      </section>

      <section>
        <h2>Scaling Levers Beyond “Add Instances”</h2>
        <p>
          Scaling out is one lever, but not the only one. Capacity planning is often cheaper when you reduce demand on
          bottlenecks instead of expanding them. Many systems gain headroom by improving cacheability, reducing fanout,
          batching work, or moving non-critical work off the request path.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Shape demand:</strong> rate limiting, admission control, and shedding optional work during spikes.
          </li>
          <li>
            <strong>Reduce work per request:</strong> eliminate N+1 patterns, precompute, cache, or tighten payloads.
          </li>
          <li>
            <strong>Move work async:</strong> queues and background jobs for tasks that do not need synchronous latency.
          </li>
          <li>
            <strong>Right-size concurrency:</strong> tune pool sizes and timeouts to avoid amplifying load on overload.
          </li>
          <li>
            <strong>Scale the bottleneck tier:</strong> replicas, partitioning, or hardware changes for stateful stores.
          </li>
        </ul>
      </section>

      <section>
        <h2>Stateful Capacity: Databases, Caches, and Storage Growth</h2>
        <p>
          Stateful systems require special planning because scaling is harder and failures are costlier. Capacity is not
          only “how many queries per second.” It includes storage growth, write amplification, compaction overhead,
          replication bandwidth, and backup windows.
        </p>
        <p>
          A practical headroom rule is “capacity to fail.” If you lose a node or an AZ, can the remaining system handle
          peak load without breaching objectives? Many real outages happen because the system is fine until the first
          failure forces everything else to run hotter.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/capacity-planning-diagram-3.svg"
          alt="Failure capacity planning diagram with N+1 and multi-AZ assumptions"
          caption="Plan for failure: headroom should include the capacity needed during a node/AZ loss."
        />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>
          Capacity planning becomes operational when it is tied to specific thresholds and runbooks. Responders should
          know which signals indicate “we are running out of headroom” and which levers are safe to pull first.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Headroom Runbook Pattern</h3>
          <ol className="space-y-2">
            <li>
              <strong>Confirm:</strong> tail latency and errors are rising and correlate with saturation signals.
            </li>
            <li>
              <strong>Protect:</strong> reduce concurrency, shed optional work, or rate-limit to stabilize.
            </li>
            <li>
              <strong>Scale:</strong> add capacity on the bottleneck tier (or shift traffic) with controlled rollout.
            </li>
            <li>
              <strong>Verify:</strong> ensure p95/p99 and saturation recover; watch for bottleneck migration.
            </li>
            <li>
              <strong>Follow up:</strong> update capacity models and test cases based on what actually happened.
            </li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Trade-offs and Governance</h2>
        <p>
          Capacity planning is a cost-risk negotiation. Overprovisioning buys safety but can hide inefficiencies.
          Underprovisioning saves money until it causes a high-impact incident.
        </p>
        <p>
          Governance makes this explicit: define headroom targets, review forecasts and test results regularly, and tie
          approvals for major launches to measured capacity evidence rather than optimism.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Cost vs resiliency:</strong> plan for failures, not just steady-state.
          </li>
          <li>
            <strong>Autoscaling vs predictability:</strong> autoscaling helps, but it must be validated under real
            bottlenecks and warm-up behavior.
          </li>
          <li>
            <strong>Local optimization vs end-to-end:</strong> optimize the tier that determines user experience, not
            the tier that is easiest to scale.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A product launch is scheduled in two weeks and marketing expects a significant traffic spike. The team forecasts
          a high-case load and runs a representative load test. Results show that app servers have headroom but database
          connection pool wait time grows sharply near peak, causing p99 latency to breach objectives.
        </p>
        <p>
          The team applies two levers: they reduce fanout on the hottest endpoint by caching an expensive lookup and add
          a read replica to increase read capacity. They then rerun the test and verify both tail latency and pool wait
          time remain within target ranges even during an AZ loss simulation.
        </p>
        <p>
          During the actual launch, dashboards track headroom signals in real time. When demand rises, autoscaling kicks
          in, but the runbook also includes a safe degradation path (disable a non-critical feature) in case the spike
          exceeds the high-case forecast.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to keep capacity planning grounded in measurable evidence.</p>
        <ul className="mt-4 space-y-2">
          <li>Define objectives (p95/p99 latency, availability) for core user journeys.</li>
          <li>Forecast demand with a baseline case and a high case; include seasonality and launches.</li>
          <li>Identify bottlenecks with saturation and queueing signals, not averages.</li>
          <li>Validate with representative load/stress/soak tests and failure simulations.</li>
          <li>Plan headroom for failures (N+1, multi-AZ) and for warm-up behavior (caches, autoscaling).</li>
          <li>Document safe mitigations for overload and rehearse them.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Show that you can connect objectives, measurements, and decisions.</p>
        <ul className="mt-4 space-y-2">
          <li>How do you decide how much headroom to keep and why?</li>
          <li>What signals tell you a tier is near saturation before users see an outage?</li>
          <li>How do you capacity plan for stateful systems differently than stateless services?</li>
          <li>How do load tests fail to represent production, and how do you make them more realistic?</li>
          <li>Describe a capacity incident you handled and what you changed afterward.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

