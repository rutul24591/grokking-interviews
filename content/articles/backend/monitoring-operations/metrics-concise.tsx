"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-metrics-extensive",
  title: "Metrics",
  description: "Designing metrics, labels, and alerting signals for production systems.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "metrics",
  wordCount: 875,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'monitoring', 'metrics'],
  relatedTopics: ['sli-slo-sla', 'alerting', 'dashboards'],
};

export default function MetricsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Metrics are numerical time series used to measure behavior over time. They are the backbone for alerting, capacity planning, and performance regressions.</p>
        <p>Good metric systems encode meaning: consistent names, stable units, and bounded labels so data remains comparable across services and across time.</p>
      </section>

      <section>
        <h2>What Good Looks Like</h2>
        <p>A strong metrics practice makes incidents measurable and decisions repeatable. Teams can answer: what changed, how many users were affected, and which component is saturated.</p>
        <p>Good also means hygiene: unused metrics are removed, semantics are versioned, and alert rules stay aligned to user impact rather than infrastructure vanity.</p>
      </section>

      <section>
        <h2>Architecture and Workflows</h2>
        <p>The typical flow is instrumentation in code, export or scrape, aggregation in a time-series store, then queries that power dashboards and alert rules. The system must handle bursty writes and fast reads during incidents.</p>
        <p>For latency, histograms are the workhorse because averages hide tail pain. For counters, rates matter. For saturation, you need signals that lead failures, not just confirm them.</p>
        <ul className="mt-4 space-y-2">
          <li>Instrumentation library with consistent naming and units.</li>
          <li>Exporter/scraper and collector pipeline with backpressure.</li>
          <li>Time-series database with retention and downsampling.</li>
          <li>Alert engine and routing integrated with runbooks.</li>
          <li>Dashboards built around user SLIs and golden signals.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/metrics-diagram-1.svg" alt="Metrics architecture diagram" caption="Metrics architecture and data flow." />
      </section>

      <section>
        <h2>Signals and Measurement</h2>
        <p>Metrics should map to how the system fails: saturation, queueing, and dependency timeouts show up before hard errors. The best metrics are the ones that trigger earlier, safer mitigations.</p>
        <p>A useful discipline is to define a minimal set per service, then add metrics only when they change an operational decision.</p>
        <ul className="mt-4 space-y-2">
          <li>Request rate, error rate, and p95/p99 latency for key endpoints.</li>
          <li>Saturation indicators: queue depth, thread pool usage, connection pool wait.</li>
          <li>Histogram buckets and percentiles for critical paths.</li>
          <li>SLO burn rate and remaining error budget.</li>
          <li>Cardinality and label health: top label values by series count.</li>
          <li>Ingestion health: scrape failures, delayed samples, and dropped points.</li>
        </ul>
      </section>

      <section>
        <h2>Failure Modes and Pitfalls</h2>
        <p>Metrics failures are often subtle: incorrect aggregation or missing units can produce dashboards that look plausible but are operationally misleading.</p>
        <p>To avoid this, treat metrics as an API: changes require review, and consumers (alerts, dashboards) must migrate intentionally.</p>
        <ul className="mt-4 space-y-2">
          <li>High-cardinality labels (user id, request id) that explode series count and cost.</li>
          <li>Averages used for latency or saturation, masking tail behavior.</li>
          <li>Counter resets or incorrect rate calculations that create false spikes.</li>
          <li>Unit drift (ms vs s) leading to bad thresholds and paging noise.</li>
          <li>Alert storms from per-instance rules instead of service-level aggregation.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/metrics-diagram-2.svg" alt="Metrics failure modes diagram" caption="Common failure paths for metrics." />
      </section>

      <section>
        <h2>Operating Playbook</h2>
        <p>When metrics indicate trouble, responders should follow a consistent path: confirm user impact, identify saturated resources, then isolate the dependency or code path responsible.</p>
        <p>The playbook should include safe knobs that buy time: rate limits, shedding, and temporary concurrency caps, guided by saturation signals.</p>
        <ul className="mt-4 space-y-2">
          <li>Start from SLO burn and segment by route/tenant to scope impact.</li>
          <li>Check latency histograms for tail growth and identify which endpoints shifted.</li>
          <li>Inspect saturation metrics to decide whether to shed load or add capacity.</li>
          <li>Validate ingestion health to rule out monitoring artifacts.</li>
          <li>Correlate with deploy markers and compare metrics by version.</li>
        </ul>
      </section>

      <section>
        <h2>Governance and Trade-offs</h2>
        <p>Metrics fidelity competes with cost and query performance. More labels and higher resolution improve diagnosis but can degrade the monitoring system itself.</p>
        <p>Governance keeps the system stable: label allowlists, retention tiers, and migration rules for breaking changes.</p>
        <ul className="mt-4 space-y-2">
          <li>Resolution vs retention: keep high-res for recent periods, downsample for history.</li>
          <li>Per-endpoint detail vs operational simplicity: too much detail increases noise.</li>
          <li>Histograms vs summaries: histograms are heavier but allow robust percentiles.</li>
          <li>Service-level vs instance-level alerting: aggregate to reduce flapping.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/metrics-diagram-3.svg" alt="Metrics governance diagram" caption="Governance and trade-offs for metrics." />
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>Users report slowness but error rates stay low. Metrics show a p99 latency spike for one endpoint and rising connection pool waits. Saturation points to a downstream database.</p>
        <p>Responders reduce concurrency and enable a cached response path while scaling the database read tier. After recovery, the team adds an alert on connection pool wait time and documents a threshold that triggers early load shedding.</p>
        <p>A post-incident review removes a noisy CPU alert and replaces it with saturation and queueing metrics that better predict user impact.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to keep the practice reliable and sustainable as the system grows.</p>
        <ul className="mt-4 space-y-2">
          <li>Use consistent names and units; document semantics for key metrics.</li>
          <li>Prefer histograms for latency and rates for counters.</li>
          <li>Bound label cardinality with allowlists and budgets.</li>
          <li>Alert on SLO burn and saturation, not vanity metrics.</li>
          <li>Verify ingestion health and scrape reliability.</li>
          <li>Version or deprecate metrics when meaning changes.</li>
          <li>Review dashboards and alerts after major incidents.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Practice explaining your reasoning using a real system you have operated: name signals, thresholds, and the decision points.</p>
        <ul className="mt-4 space-y-2">
          <li>How do you design a minimal metric set for a new service?</li>
          <li>How do you prevent cardinality explosions?</li>
          <li>Why are histograms preferred for latency?</li>
          <li>How do you decide alert thresholds and avoid flapping?</li>
          <li>Describe a metrics-driven incident response you have led.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
