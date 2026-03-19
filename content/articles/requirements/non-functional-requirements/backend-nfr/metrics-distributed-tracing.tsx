"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-metrics-distributed-tracing-extensive",
  title: "Metrics & Distributed Tracing",
  description: "Comprehensive guide to metrics and distributed tracing, covering Prometheus, OpenTelemetry, tracing propagation, and production observability for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "metrics-distributed-tracing",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "metrics", "tracing", "observability", "prometheus", "opentelemetry", "monitoring"],
  relatedTopics: ["centralized-logging", "fault-tolerance-resilience", "latency-slas"],
};

export default function MetricsDistributedTracingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Metrics</strong> are numerical measurements of system behavior over time (request rate,
          error rate, latency percentiles). <strong>Distributed Tracing</strong> tracks requests as they
          flow through multiple services, providing visibility into distributed system behavior.
        </p>
        <p>
          Together with logging, metrics and tracing form the &quot;three pillars of observability&quot; —
          the ability to understand internal system state from external outputs.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Observability is a Requirement</h3>
          <p>
            You cannot improve what you cannot measure. Observability is not optional — it is a core
            non-functional requirement. Build it into your system from day one, not as an afterthought.
          </p>
        </div>
      </section>

      <section>
        <h2>Three Pillars of Observability</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/metrics-distributed-tracing.svg"
          alt="Metrics and Distributed Tracing"
          caption="Metrics & Tracing — showing three pillars of observability, distributed trace flow across services, metric types (Counter/Gauge/Histogram), and RED method"
        />
        <p>
          Three primary metric types:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Counters</h3>
        <p>
          Monotonically increasing values (only go up or reset on restart).
        </p>
        <p>
          <strong>Examples:</strong> Total requests, total errors, bytes sent.
        </p>
        <p>
          <strong>Use for:</strong> Rate calculations (requests per second = delta / time).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gauges</h3>
        <p>
          Values that can go up or down.
        </p>
        <p>
          <strong>Examples:</strong> Current connections, memory usage, queue depth.
        </p>
        <p>
          <strong>Use for:</strong> Current state measurements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Histograms</h3>
        <p>
          Distribution of values across buckets.
        </p>
        <p>
          <strong>Examples:</strong> Request latency, response size.
        </p>
        <p>
          <strong>Use for:</strong> Percentile calculations (P50, P95, P99).
        </p>
      </section>

      <section>
        <h2>Prometheus & Metrics Collection</h2>
        <p>
          <strong>Prometheus</strong> is the de facto standard for metrics collection:
        </p>
        <ul>
          <li>
            <strong>Pull-based:</strong> Prometheus scrapes metrics from targets.
          </li>
          <li>
            <strong>Time-series database:</strong> Optimized for metric storage and queries.
          </li>
          <li>
            <strong>PromQL:</strong> Query language for metrics analysis.
          </li>
          <li>
            <strong>Alertmanager:</strong> Routing and deduplication for alerts.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RED Method</h3>
        <p>
          Key metrics for every service:
        </p>
        <ul>
          <li>
            <strong>Rate:</strong> Requests per second.
          </li>
          <li>
            <strong>Errors:</strong> Failed requests per second.
          </li>
          <li>
            <strong>Duration:</strong> Request latency (histogram).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">USE Method</h3>
        <p>
          Key metrics for infrastructure:
        </p>
        <ul>
          <li>
            <strong>Utilization:</strong> Percentage of resource in use.</li>
          <li>
            <strong>Saturation:</strong> Queue depth, how backed up.</li>
          <li>
            <strong>Errors:</strong> Hardware/software errors.</li>
        </ul>
      </section>

      <section>
        <h2>Distributed Tracing</h2>
        <p>
          Tracing tracks requests across service boundaries:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trace Structure</h3>
        <ul>
          <li>
            <strong>Trace:</strong> Complete request journey (one trace per request).
          </li>
          <li>
            <strong>Span:</strong> Single operation within a trace (one span per service call).
          </li>
          <li>
            <strong>Context:</strong> Trace ID, span ID, parent span ID (propagated between services).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Context Propagation</h3>
        <p>
          Trace context must be propagated across service boundaries:
        </p>
        <ul>
          <li>
            <strong>HTTP:</strong> Headers (traceparent, tracestate for W3C trace context).
          </li>
          <li>
            <strong>gRPC:</strong> Metadata.
          </li>
          <li>
            <strong>Message queues:</strong> Message headers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OpenTelemetry</h3>
        <p>
          <strong>OpenTelemetry</strong> is the industry standard for instrumentation:
        </p>
        <ul>
          <li>Vendor-neutral APIs and SDKs.</li>
          <li>Supports traces, metrics, and logs.</li>
          <li>Auto-instrumentation for many frameworks.</li>
          <li>Export to any backend (Jaeger, Zipkin, Datadog, etc.).</li>
        </ul>
      </section>

      <section>
        <h2>Metrics &amp; Distributed Tracing Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/metrics-tracing-deep-dive.svg"
          alt="Metrics and Tracing Deep Dive"
          caption="Metrics and Tracing Deep Dive — showing metrics collection architecture, distributed tracing flow, tracing backends comparison"
        />
        <p>
          Advanced metrics and distributed tracing concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Metrics Collection Architecture</h3>
        <p>
          Two main approaches to collecting metrics:
        </p>
        <ul>
          <li>
            <strong>Pull-Based (Prometheus):</strong> Metrics endpoint exposed by application (/metrics).
            Prometheus scrapes at regular intervals (typically 15s). Advantages: simple, service discovery,
            no agent needed. Disadvantages: requires reachable endpoints, not suitable for high-cardinality.
          </li>
          <li>
            <strong>Push-Based (StatsD, Datadog):</strong> Application pushes metrics to agent/collector.
            Advantages: fire-and-forget, handles high-cardinality, works with ephemeral services.
            Disadvantages: requires agent, potential data loss if collector unavailable.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Distributed Tracing Flow</h3>
        <p>
          How traces propagate through distributed systems:
        </p>
        <ul>
          <li>
            <strong>Trace Generation:</strong> Client request initiates trace with unique trace_id.
            First service creates root span.
          </li>
          <li>
            <strong>Context Propagation:</strong> trace_id and span_id propagated via HTTP headers
            (traceparent, tracestate for W3C trace context) or gRPC metadata.
          </li>
          <li>
            <strong>Span Creation:</strong> Each service creates child span with parent span_id.
            Records operation name, start time, end time, tags, logs.
          </li>
          <li>
            <strong>Span Export:</strong> Spans batched and sent to tracing backend (Jaeger, Zipkin).
            Async, non-blocking to avoid impacting application performance.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tracing Backends</h3>
        <p>
          Options for storing and querying traces:
        </p>
        <ul>
          <li>
            <strong>Jaeger:</strong> CNCF project, Uber open source. Full-featured, scalable,
            supports multiple storage backends. Good for self-hosted deployments.
          </li>
          <li>
            <strong>Zipkin:</strong> Twitter open source. Simple, lightweight, easy to deploy.
            Good for smaller deployments or getting started.
          </li>
          <li>
            <strong>OpenTelemetry:</strong> Vendor-neutral standard for instrumentation.
            Unified API for traces, metrics, logs. Export to any backend.
          </li>
          <li>
            <strong>Managed Services:</strong> Datadog APM, New Relic, AWS X-Ray, Google Cloud Trace.
            Zero operational overhead, advanced features, but vendor lock-in and cost.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Correlating Logs, Metrics, and Traces</h3>
        <p>
          The three pillars work best together:
        </p>
        <ul>
          <li>
            <strong>Metrics → Traces:</strong> Alert on high latency (metric), drill down to
            specific slow traces to identify bottleneck.
          </li>
          <li>
            <strong>Traces → Logs:</strong> Find problematic trace, view all logs with matching
            trace_id to understand what happened.
          </li>
          <li>
            <strong>Logs → Metrics:</strong> Discover error pattern in logs, create metric and
            alert for future detection.
          </li>
        </ul>
        <p>
          <strong>Implementation:</strong> Include trace_id in all logs. Use OpenTelemetry for
          unified instrumentation across all three pillars.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design an observability stack for a microservices architecture with 50 services.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Metrics:</strong> Prometheus for collection (pull-based). Grafana for dashboards. Alertmanager for alerting.</li>
                <li><strong>Tracing:</strong> OpenTelemetry SDK in each service. Jaeger or Tempo for trace storage.</li>
                <li><strong>Logging:</strong> Fluent Bit → Loki (lightweight) or Elasticsearch (powerful queries).</li>
                <li><strong>Correlation:</strong> Include trace_id in all logs. Link from Grafana dashboards to traces and logs.</li>
                <li><strong>Alerting:</strong> SLO-based alerts (error budget burn rate). PagerDuty for on-call rotation.</li>
                <li><strong>Scale:</strong> Prometheus federation for multiple clusters. Thanos/Cortex for long-term storage.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. What are the three pillars of observability? How do they complement each other?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Metrics:</strong> Numerical measurements over time (RPS, latency, error rate). ✓ Aggregated, efficient storage. ✗ Limited context.</li>
                <li><strong>Traces:</strong> Request flow across services. ✓ Shows service dependencies, latency breakdown. ✗ Sampling needed at scale.</li>
                <li><strong>Logs:</strong> Detailed event records. ✓ Full context, debug-level detail. ✗ High volume, expensive storage.</li>
                <li><strong>How they complement:</strong> Metrics alert (latency spike) → Trace investigation (which service slow) → Log analysis (why slow). Each pillar answers different questions.</li>
                <li><strong>Best practice:</strong> Instrument all three. Use OpenTelemetry for unified instrumentation. Correlate via trace_id.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Explain the RED method. What metrics would you collect for an API service?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>RED method:</strong> Three key metrics for any service: Rate, Errors, Duration.</li>
                <li><strong>Rate:</strong> Requests per second. Measure at load balancer and per service endpoint.</li>
                <li><strong>Errors:</strong> Error rate (5xx responses), error count. Track both HTTP errors and application errors.</li>
                <li><strong>Duration:</strong> Latency percentiles (P50, P95, P99). P99 most important for user experience.</li>
                <li><strong>Additional:</strong> Saturation metrics (CPU, memory, connection pool usage). Indicates when service is approaching limits.</li>
                <li><strong>Example:</strong> API service metrics: http_requests_total&#123;method, endpoint, status&#125;, http_request_duration_seconds&#123;histogram&#125;, active_connections.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How does distributed tracing work? How do you propagate trace context?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Trace generation:</strong> Create trace_id at entry point (API Gateway). Each request gets unique trace_id.</li>
                <li><strong>Span creation:</strong> Each service creates span with span_id, parent_span_id, operation name, timestamps.</li>
                <li><strong>Context propagation:</strong> Pass trace_id via HTTP headers (W3C traceparent: version-trace_id-parent_span_id-flags). Also gRPC metadata, message queue headers.</li>
                <li><strong>Export:</strong> Batch spans, send async to tracing backend (Jaeger, Zipkin). Don&apos;t block request.</li>
                <li><strong>Sampling:</strong> Sample 1-10% of traces at high traffic. Always sample errors and slow requests.</li>
                <li><strong>Tools:</strong> OpenTelemetry (vendor-neutral), Jaeger (open source), AWS X-Ray (AWS-native).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Compare Prometheus, Grafana, and managed solutions (Datadog, New Relic).
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Prometheus:</strong> ✓ Open source, Kubernetes-native, powerful PromQL. ✗ Self-managed, limited long-term storage, single cluster.</li>
                <li><strong>Grafana:</strong> ✓ Best dashboards, multi-data-source, open source. ✗ Needs backend (Prometheus, Loki, etc.).</li>
                <li><strong>Datadog:</strong> ✓ Managed, easy setup, unified platform (logs + metrics + traces). ✗ Expensive at scale ($15-20/host/month), vendor lock-in.</li>
                <li><strong>New Relic:</strong> ✓ Full-stack observability, generous free tier (100GB/month). ✗ Complex pricing, can get expensive.</li>
                <li><strong>Choose Prometheus+Grafana when:</strong> Kubernetes, cost-sensitive, have ops team.</li>
                <li><strong>Choose Datadog/New Relic when:</strong> Enterprise budget, want managed solution, need unified platform.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you handle high-cardinality metrics? What are the risks?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>High-cardinality:</strong> Metrics with many unique label combinations (user_id, request_id, URL with params).</li>
                <li><strong>Risks:</strong> (1) Memory explosion (one time series per combination). (2) Query slowdown. (3) Increased storage costs. (4) Can crash Prometheus.</li>
                <li><strong>Solutions:</strong> (1) Avoid high-cardinality labels (no user_id, email). (2) Aggregate before storing (count per endpoint, not per user). (3) Use exemplars for detailed data. (4) Set cardinality limits.</li>
                <li><strong>Best practice:</strong> Use low-cardinality labels (service, endpoint, method, status). Store detailed data in traces/logs instead.</li>
                <li><strong>Example:</strong> Bad: http_requests_total&#123;user_id, endpoint&#125;. Good: http_requests_total&#123;service, endpoint, method, status&#125;.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Observability Checklist</h2>
        <ul className="space-y-2">
          <li>✓ RED metrics collected for all services</li>
          <li>✓ Distributed tracing implemented</li>
          <li>✓ Trace context propagated across boundaries</li>
          <li>✓ Dashboards for key metrics</li>
          <li>✓ Alerts on SLO violations</li>
          <li>✓ Sampling configured for high-traffic services</li>
          <li>✓ OpenTelemetry or equivalent instrumentation</li>
          <li>✓ Log-trace correlation (trace IDs in logs)</li>
          <li>✓ Metric retention policy defined</li>
          <li>✓ Runbooks for common alerts</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
