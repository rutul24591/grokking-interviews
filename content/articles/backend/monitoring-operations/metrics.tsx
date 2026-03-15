"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-metrics-extensive",
  title: "Metrics",
  description:
    "Design metrics that stay correct under scale: stable semantics, bounded labels, tail-aware latency, and alerting tied to user impact.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "metrics",
  wordCount: 1151,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "monitoring", "metrics", "observability", "alerting"],
  relatedTopics: ["dashboards", "alerting", "sli-slo-sla", "error-budgets"],
};

export default function MetricsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Purpose</h2>
        <p>
          <strong>Metrics</strong> are numerical time series that help you measure behavior over time: request volume,
          error rates, latency distributions, queue depth, and saturation. Metrics are the foundation for alerting,
          capacity planning, and regression detection because they summarize the health of a system continuously and at
          low cost compared to logs and traces.
        </p>
        <p>
          The metric that matters most in operations is not “CPU.” It is “are users getting correct responses within the
          latency they expect.” Metrics become powerful when they are anchored in user-impact indicators and when they are
          designed to stay correct as services and traffic scale.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">A Useful Metric System Enables</h3>
          <ul className="space-y-2">
            <li>Fast, stable alerting that reflects impact and avoids flapping.</li>
            <li>Trend analysis for capacity and cost before incidents happen.</li>
            <li>Regression detection across deploy versions and configuration changes.</li>
            <li>Diagnosis via segmentation (route, region, tenant tier, dependency) without cardinality blowups.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Metric Types and When to Use Them</h2>
        <p>
          The main metric types exist because different questions require different math. Picking the wrong type creates
          misleading dashboards and noisy alerts.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/metrics-diagram-1.svg"
          alt="Metrics pipeline diagram from instrumentation to storage to queries"
          caption="Metrics pipeline: instrumentation emits values, collection aggregates them, and queries power dashboards and alert rules."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Counters:</strong> monotonically increasing totals (requests, errors). Alert on <em>rates</em> derived
            from counters.
          </li>
          <li>
            <strong>Gauges:</strong> point-in-time values (queue depth, memory used). Useful for saturation and capacity.
          </li>
          <li>
            <strong>Histograms:</strong> distributions (latency, payload size). Essential for p95/p99 and tail analysis.
          </li>
          <li>
            <strong>Summaries:</strong> client-side quantile estimates. Useful in some environments but harder to
            aggregate consistently.
          </li>
        </ul>
        <p className="mt-4">
          Most operational dashboards revolve around rates and histograms. Averages are rarely sufficient for latency
          because they hide tail pain, and tails are where incidents live.
        </p>
      </section>

      <section>
        <h2>Latency: Tail-Aware by Design</h2>
        <p>
          Latency is not one number. It is a distribution, and user experience is usually determined by the tail. A system
          can have a reasonable average while a minority of requests are slow enough to feel broken. Tail latency is also
          where saturation and queueing show up first.
        </p>
        <p>
          Histograms let you ask stable questions: “What fraction of requests exceeded a threshold?” and “How did p99 move
          after a deploy?” They also support multi-dimensional segmentation without losing tail information.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/metrics-diagram-2.svg"
          alt="Histogram buckets and tail latency diagram"
          caption="Latency should be modeled as a distribution. Histograms and percentiles reveal tail behavior that averages hide."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Histogram Design Pitfalls</h3>
          <ul className="space-y-2">
            <li>Buckets too coarse hide changes; buckets too fine increase cost and complexity.</li>
            <li>Changing bucket boundaries breaks comparability across time.</li>
            <li>Computing percentiles from mixed populations (all endpoints combined) can hide hotspot endpoints.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Dimensions, Labels, and Cardinality</h2>
        <p>
          The power of metrics comes from slicing: by route, region, status code, tenant tier, dependency, and version.
          The risk is cardinality. High-cardinality labels create too many unique time series, which increases cost and
          can make queries slow or unreliable.
        </p>
        <p>
          A strong practice uses a bounded set of labels with clear semantics and budgets. Treat metric labels like a
          schema: changes should be reviewed because they can change costs and break dashboards.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Good labels:</strong> region, environment, route template, status class, version, dependency name.
          </li>
          <li>
            <strong>Bad labels:</strong> user id, request id, raw URL, unbounded error messages.
          </li>
          <li>
            <strong>Control mechanisms:</strong> allowlists, label budgets, and “top offenders” reporting by series count.
          </li>
        </ul>
      </section>

      <section>
        <h2>Alerting Integration: User Impact and Burn</h2>
        <p>
          Metrics power alerting, but a metric is not automatically a good alert. Alerts should be tied to user impact and
          should page only when action is needed. Many teams page on SLO burn rate because it captures both severity and
          urgency: large incidents burn budget quickly and should page fast; small blips often should not.
        </p>
        <p>
          Saturation metrics are valuable as early warning signals, but they should be curated. Paging on “CPU is high”
          without impact context can create noise. Paging on “connection pool wait time is rising and tail latency is
          elevated” is far more actionable.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/metrics-diagram-3.svg"
          alt="Burn-rate vs static threshold alerting diagram"
          caption="Alerting patterns: burn-rate aligns with objectives and reduces noise compared to naive static thresholds."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Symptom alerts:</strong> availability, tail latency, correctness SLIs.
          </li>
          <li>
            <strong>Cause overlays:</strong> saturation, queueing, dependency timeouts, retry rates.
          </li>
          <li>
            <strong>Health of monitoring itself:</strong> scrape failures, ingestion lag, evaluation errors.
          </li>
        </ul>
      </section>

      <section>
        <h2>Collection, Aggregation, and Retention</h2>
        <p>
          Metric systems must support bursty writes and fast reads during incidents. Collection models vary (scrape vs
          push), but the operational concerns are similar: data freshness, drop behavior, and query performance under load.
        </p>
        <p>
          Retention and downsampling determine what questions you can answer historically. Keeping high-resolution data
          forever is expensive. A common strategy is to keep high resolution for recent periods (incident response) and
          downsample or roll up for longer horizons (capacity planning).
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Signals for the Metric Pipeline</h3>
          <ul className="space-y-2">
            <li>Scrape/export success rate and staleness of latest samples.</li>
            <li>Ingestion queue depth and dropped sample count.</li>
            <li>Query latency for common dashboards and alert rules.</li>
            <li>Series count growth rate and top label offenders.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Failure Modes and Pitfalls</h2>
        <p>
          Metrics failures are often subtle. A dashboard can look plausible while being wrong. Treat metrics like an API:
          define semantics, version changes, and validate correctness after refactors and migrations.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Counter resets:</strong> naive rate computation creates false spikes or false drops.
          </li>
          <li>
            <strong>Unit drift:</strong> ms vs s causes incorrect thresholds and paging noise.
          </li>
          <li>
            <strong>Partial visibility:</strong> sampling or missing exporters hides the worst cohorts.
          </li>
          <li>
            <strong>Cardinality explosions:</strong> label changes make the system slow and expensive.
          </li>
          <li>
            <strong>Mixed populations:</strong> aggregating all routes hides the one route that broke.
          </li>
        </ul>
        <p className="mt-4">
          A practical mitigation is to keep a minimal set of “golden dashboards” and validate them after deploys that
          touch instrumentation. If the golden dashboards drift, incident response quality drops quickly.
        </p>
      </section>

      <section>
        <h2>Operational Workflow: Diagnose and Verify</h2>
        <p>
          Metrics support a repeatable workflow: confirm impact, segment by cohort, overlay saturation and dependency
          health, apply a mitigation, then verify recovery with the same signals that detected the problem. Metrics are
          also the verification layer for changes: after a mitigation, the same graphs should recover.
        </p>
        <p>
          The highest-signal metric investigations often involve <strong>segmented comparisons</strong>: by deploy version,
          by route, by region, by tenant tier. Those comparisons quickly separate regressions from organic traffic changes.
        </p>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          Users report slowness, but error rate is stable. Tail latency histograms show p99 is elevated on one route and
          only for one region. Saturation signals show rising connection pool wait time and a higher retry rate to a
          downstream service.
        </p>
        <p>
          Responders mitigate by reducing concurrency and shifting traffic away from the affected region. They verify
          recovery by watching p99 and pool wait return to baseline. In follow-up, the team adds a burn-rate alert for the
          affected journey and removes a noisy per-instance CPU page that did not change any decision.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when designing metrics for a new service.</p>
        <ul className="mt-4 space-y-2">
          <li>Start from user-impact SLIs and add a small set of diagnostic saturation metrics.</li>
          <li>Prefer histograms for latency; alert on tail and burn, not on averages.</li>
          <li>Keep labels bounded and stable; avoid unbounded identifiers and raw strings.</li>
          <li>Define units and semantics explicitly; treat changes like API changes.</li>
          <li>Monitor the metric pipeline for staleness, drops, and query latency.</li>
          <li>Design dashboards for segmented comparisons (version, region, route) and fast incident response.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Explain metrics as a decision system, not just charts.</p>
        <ul className="mt-4 space-y-2">
          <li>How do you choose metrics for a new service and avoid vanity metrics?</li>
          <li>Why are histograms important for latency and what pitfalls exist?</li>
          <li>How do you prevent cardinality explosions while keeping diagnosis possible?</li>
          <li>How do you design alerts that are actionable and aligned with objectives?</li>
          <li>Describe a metrics-driven incident response where segmentation found the root contributor.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

