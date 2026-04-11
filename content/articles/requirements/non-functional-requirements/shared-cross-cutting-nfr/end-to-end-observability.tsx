"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-end-to-end-observability-extensive",
  title: "End-to-End Observability",
  description: "Comprehensive guide to end-to-end observability, covering the three pillars (logs, metrics, traces), distributed tracing, correlation, and observability-driven development for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "end-to-end-observability",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "observability", "monitoring", "distributed-tracing", "sre"],
  relatedTopics: ["centralized-logging", "metrics-distributed-tracing", "incident-response"],
};

export default function EndToEndObservabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>End-to-End Observability</strong> is the ability to understand the internal state of a
          system by examining its outputs—across all services, from user request to backend processing
          and back. Unlike monitoring, which tells you when something is wrong, observability enables you
          to ask arbitrary questions about system behavior without knowing the question in advance.
        </p>
        <p>
          Observability rests on three pillars: logs (timestamped records of events), metrics (numerical
          measurements over time), and traces (request flow across services). In distributed systems,
          observability is critical for debugging issues that span multiple services. A single user
          request may traverse ten or more services—without end-to-end tracing, identifying the root
          cause of latency or failures is nearly impossible. For staff and principal engineers,
          observability is both a technical and organizational concern—the decisions you make about
          instrumentation, data retention, and tooling have lasting impact on operational effectiveness.
        </p>
        <p>
          The key principles of observability include high cardinality (capturing rich context such as
          user IDs, request IDs, and versions), correlation (linking logs, metrics, and traces via
          common identifiers), sampling (balancing cost with visibility through intelligent sampling
          strategies), standardization (consistent schemas, naming conventions, and instrumentation),
          and actionability (ensuring observability data drives action through alerts, dashboards, and
          investigations).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-three-pillars.svg"
          alt="Three Pillars of Observability showing logs, metrics, and traces"
          caption="The Three Pillars of Observability: Logs (timestamped events), Metrics (numerical measurements), and Traces (request flow) with correlation linking all three for complete visibility."
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Logs are structured, timestamped event records that provide the most detailed form of
          observability data. Application logs capture business events, errors, warnings, and info
          messages, while access logs record HTTP requests, response codes, latency, and user agents.
          Audit logs track security-relevant events such as logins and permission changes, and system
          logs capture OS-level events and kernel messages. Best practices for logging include using
          structured logging in JSON format for machine parsing, maintaining a consistent schema with
          standard fields (timestamp, level, service, trace ID), including correlation IDs in every log
          entry, applying appropriate log levels (DEBUG, INFO, WARN, ERROR, FATAL) consistently, managing
          disk space through log rotation, and shipping logs to a centralized aggregation system such as
          ELK, Splunk, or Datadog.
        </p>
        <p>
          Metrics are numerical measurements aggregated over time, ideal for alerting and dashboards.
          Counters are monotonically increasing values such as request count and error count. Gauges
          represent point-in-time values such as CPU usage and queue depth. Histograms capture the
          distribution of values, particularly for latency percentiles, while summaries provide
          pre-calculated percentiles. The RED method for services tracks Rate (requests per second),
          Errors (error rate as percentage or count), and Duration (latency percentiles P50, P95, P99).
          The USE method for resources monitors Utilization (percentage of resource in use), Saturation
          (queue depth, wait time), and Errors (hardware errors, dropped packets). The Golden Signals
          cover Latency (time to process requests), Traffic (demand on system as requests per second),
          Errors (rate of failed requests), and Saturation (how full the service is). Metrics should
          use high cardinality labels (service, endpoint, status, region), appropriate aggregation
          to maintain flexibility, SLO burn rate tracking, and consistent naming conventions across
          all services.
        </p>
        <p>
          Traces track request flow across services and are essential for understanding distributed
          system behavior. A trace represents the complete request flow from start to finish, composed
          of spans where each span is a single operation within one service. Trace IDs uniquely identify
          the entire request flow, while span IDs identify individual operations. Parent-child
          relationships define span hierarchies, tags provide key-value metadata on spans (HTTP method,
          status code), and logs capture events within a span such as errors and checkpoints. Traces
          must propagate context by passing trace IDs via headers across all services, sample
          appropriately (100% for low traffic, sampling for high traffic), add meaningful tags with
          business context (user ID, order ID), instrument dependencies including database calls and
          external APIs, and use OpenTelemetry for cross-vendor compatibility.
        </p>
        <p>
          Correlation links logs, metrics, and traces together, enabling engineers to jump from a metric
          alert to relevant traces to detailed logs without manual searching. Including trace IDs in
          every log entry enables log aggregation by trace ID and allows jumping from trace to logs in
          the UI. Implementation uses MDC (Mapped Diagnostic Context) or equivalent to automatically
          inject trace IDs into logs. Adding trace context to metric labels enables jumping from metric
          spikes to traces, though care must be taken to avoid cardinality explosion. Unified dashboards
          provide a single view across all telemetry with metrics, logs, and traces in the same view,
          click-through navigation from metric to traces to logs, and time synchronization across all
          data types. Service maps auto-generated from trace data show latency and error rates on edges
          between services, helping identify critical paths and bottlenecks. This correlation
          infrastructure directly reduces mean time to resolution during incidents.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-implementation.svg"
          alt="Observability Implementation showing data flow from services to backend"
          caption="Observability Implementation: Services emit logs, metrics, and traces to collectors, which forward to centralized backends for storage, analysis, and visualization."
        />
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The observability infrastructure architecture consists of several interconnected systems that
          collect, process, store, and surface telemetry data. Understanding this architecture is
          essential for designing observability at scale and making informed trade-off decisions about
          tooling, retention, and cost.
        </p>
        <p>
          The data collection pipeline begins with instrumentation at the service level. OpenTelemetry
          SDKs are embedded in each service to auto-instrument common libraries (HTTP clients, database
          drivers, message queue clients) and provide APIs for manual instrumentation of business logic.
          Collectors (such as the OpenTelemetry Collector) receive telemetry data from services via
          various protocols (gRPC, HTTP, Fluentd) and process it through a pipeline of receivers,
          processors, and exporters. Receivers accept data in multiple formats, processors handle
          batching, filtering, and attribute manipulation, and exporters send data to backends such as
          Prometheus, Jaeger, Elasticsearch, or commercial platforms. Sidecar or DaemonSet deployments
          ensure collectors run alongside every service instance, providing local aggregation before
          forwarding to centralized backends.
        </p>
        <p>
          The sampling infrastructure determines which telemetry data is retained and which is discarded.
          Head-based sampling makes decisions at trace start, using rate-based (sample a fixed percentage
          of all traces) or probabilistic (random sampling with fixed probability) strategies. It is
          simple and consistent but may miss important traces. Tail-based sampling makes decisions after
          trace completion, enabling sampling based on trace content such as error sampling (always
          sample traces with errors), latency sampling (sample slow traces at P99+), and business
          sampling (sample high-value transactions). A hybrid approach combines head sampling at a low
          rate (e.g., 1%) for baseline visibility with tail sampling for errors, slow traces, and VIP
          users, ensuring important traces are captured while controlling storage costs.
        </p>
        <p>
          Storage and retention architecture varies by telemetry type. Metrics are stored in
          time-series databases (Prometheus, Thanos, Cortex) with configurable retention periods and
          downsampling for older data to reduce storage costs. Logs are stored in search-optimized
          indexes (Elasticsearch, Loki) with hot-warm-cold tiering—recent logs on fast storage for
          active querying, older logs on cheaper storage for occasional access, and archived logs in
          object storage for compliance. Traces are stored in trace-optimized stores (Jaeger with
          Elasticsearch or Cassandra, Tempo with object storage) with shorter retention periods due
          to their large size. Retention policies balance debugging needs against storage costs, with
          typical retention of 7-30 days for traces, 30-90 days for logs, and 13 months for metrics.
        </p>
        <p>
          The query and visualization layer provides interfaces for engineers to explore observability
          data. Grafana serves as the primary dashboard tool, querying Prometheus for metrics, Loki
          for logs, and Tempo or Jaeger for traces, with the ability to link between data types in a
          single view. Ad-hoc query interfaces enable engineers to ask arbitrary questions during
          incident investigation—searching logs by trace ID, filtering traces by latency or error
          status, and aggregating metrics by arbitrary labels. Service maps auto-generated from trace
          data visualize service dependencies, latency, and error rates, helping engineers understand
          system topology at a glance.
        </p>
        <p>
          The alerting pipeline processes metric thresholds and SLO burn rates to notify engineers of
          issues. Alert rules are defined in Prometheus (or equivalent) and evaluated at configurable
          intervals. Alertmanager handles deduplication, grouping, and routing of alerts to the
          appropriate channels (PagerDuty, Slack, email). SLO-based alerting uses error budget burn
          rates to alert on symptoms rather than causes, with multi-window burn rate alerts that
          consider both the rate of budget consumption and the time window. Every alert must be
          actionable with a linked runbook, and alert fatigue is managed through regular review and
          tuning of alert thresholds.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-maturity-model.svg"
          alt="Observability Maturity Model showing progression from Level 1 to Level 4"
          caption="Observability Maturity Model: Progression from basic monitoring (Level 1) through centralized logging (Level 2), metrics + tracing (Level 3), to full observability with correlation (Level 4)."
        />
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Observability architecture decisions involve significant trade-offs across data collection,
          storage, and analysis dimensions. Understanding these trade-offs enables staff and principal
          engineers to design observability systems that balance cost, completeness, and operational
          effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Push vs Pull Metrics</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Push (StatsD, Datadog)</th>
                <th className="p-2 text-left">Pull (Prometheus)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Service Awareness</td>
                <td className="p-2">Server knows all targets</td>
                <td className="p-2">Server discovers targets</td>
              </tr>
              <tr>
                <td className="p-2">Failure Detection</td>
                <td className="p-2">Cannot detect dead services</td>
                <td className="p-2">Can detect scrape failures</td>
              </tr>
              <tr>
                <td className="p-2">Network Load</td>
                <td className="p-2">Bursts during high activity</td>
                <td className="p-2">Steady, predictable</td>
              </tr>
              <tr>
                <td className="p-2">Short-Lived Jobs</td>
                <td className="p-2">Works well</td>
                <td className="p-2">Difficult to scrape</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Head-Based vs Tail-Based Sampling</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Head-Based</th>
                <th className="p-2 text-left">Tail-Based</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Decision Timing</td>
                <td className="p-2">At trace start</td>
                <td className="p-2">After trace completes</td>
              </tr>
              <tr>
                <td className="p-2">Important Trace Capture</td>
                <td className="p-2">May miss (random)</td>
                <td className="p-2">Guaranteed (content-based)</td>
              </tr>
              <tr>
                <td className="p-2">Complexity</td>
                <td className="p-2">Low (simple probability)</td>
                <td className="p-2">High (buffer, evaluate)</td>
              </tr>
              <tr>
                <td className="p-2">Storage Cost</td>
                <td className="p-2">Predictable (fixed rate)</td>
                <td className="p-2">Variable (depends on content)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Open-Source vs Commercial Observability Platforms</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Open Source</th>
                <th className="p-2 text-left">Commercial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Cost</td>
                <td className="p-2">Lower license cost, higher ops cost</td>
                <td className="p-2">Higher license cost, lower ops cost</td>
              </tr>
              <tr>
                <td className="p-2">Flexibility</td>
                <td className="p-2">Full control, customizable</td>
                <td className="p-2">Vendor-defined features</td>
              </tr>
              <tr>
                <td className="p-2">Integration</td>
                <td className="p-2">Manual (assemble components)</td>
                <td className="p-2">Built-in (all-in-one platform)</td>
              </tr>
              <tr>
                <td className="p-2">Vendor Lock-In</td>
                <td className="p-2">Low (open standards)</td>
                <td className="p-2">High (proprietary features)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Centralized vs Distributed Tracing Backends</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Centralized Backend</th>
                <th className="p-2 text-left">Distributed Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Scalability</td>
                <td className="p-2">Vertical scaling limits</td>
                <td className="p-2">Horizontal, unlimited</td>
              </tr>
              <tr>
                <td className="p-2">Operational Complexity</td>
                <td className="p-2">Lower (single system)</td>
                <td className="p-2">Higher (manage cluster)</td>
              </tr>
              <tr>
                <td className="p-2">Query Performance</td>
                <td className="p-2">Fast for small datasets</td>
                <td className="p-2">Consistent at any scale</td>
              </tr>
              <tr>
                <td className="p-2">Best For</td>
                <td className="p-2">Small to medium deployments</td>
                <td className="p-2">Large-scale, high-throughput</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use OpenTelemetry for vendor-neutral instrumentation across all services. Apply
          auto-instrumentation wherever possible through SDK-provided instrumentations for common
          libraries, and reserve manual instrumentation for business logic and critical paths. Maintain
          consistent naming conventions for metrics, spans, and log fields across all services. Include
          business context such as user ID and order ID in trace tags to enable filtering by business
          dimensions. Define observability requirements before launching any service, including what
          metrics indicate success, what alerts should fire, and what dashboards are needed.
        </p>
        <p>
          Implement appropriate retention policies for each telemetry type, balancing debugging needs
          against storage costs. Use intelligent sampling for high-volume data to control storage and
          processing costs. Monitor observability costs and optimize continuously, adjusting retention
          and sampling as traffic patterns change. Enforce data governance by scanning logs for PII and
          sensitive data, implementing log scrubbing, and providing developer training on what should
          and should not be logged.
        </p>
        <p>
          Alert on symptoms rather than causes, using SLO-based alerting with burn rate alerts that
          consider both error rate and time window. Avoid alert fatigue by tuning thresholds based on
          historical data and conducting regular alert reviews to remove or tune noisy alerts. Ensure
          every alert is actionable with a linked runbook. Build golden signals dashboards for every
          service, create service-specific dashboards for deep dives, maintain business metrics
          dashboards for stakeholder visibility, and conduct regular dashboard reviews to remove unused
          or low-value dashboards.
        </p>
        <p>
          Observability-driven development means considering observability as a first-class concern
          during development, not as an afterthought. Treat instrumentation like production code with
          code review for instrumentation quality and testing in CI/CD pipelines. Identify critical user
          journeys and ensure full tracing coverage for these paths, adding business context to traces.
          Use a pre-launch checklist covering metrics definition and instrumentation, structured logging
          shipped to central systems, trace propagation across all services, dashboard creation, alert
          configuration, runbook documentation, and on-call training. After launch, verify that metrics
          are being emitted correctly, alerts are firing appropriately, dashboards are useful, and any
          gaps discovered during operation are addressed with updated instrumentation.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Siloed tools with logs, metrics, and traces in separate systems prevent effective correlation
          and increase mean time to resolution. The fix is to invest in correlation infrastructure and
          either a unified observability platform or well-integrated open-source components. Missing
          trace propagation where traces stop at service boundaries creates blind spots in distributed
          debugging. Instrument all services consistently and propagate context via standard headers
          such as W3C traceparent.
        </p>
        <p>
          Collecting too much data through 100% sampling and logging everything leads to storage cost
          explosions and performance degradation. Implement intelligent sampling, appropriate log
          levels, and retention policies. Alert fatigue from too many alerts results in ignored pages
          and missed critical incidents. Use SLO-based alerting, tune thresholds regularly, and ensure
          every alert has an actionable runbook.
        </p>
        <p>
          Dashboard sprawl with hundreds of unused dashboards creates confusion and wastes resources.
          Conduct regular cleanup, assign ownership to dashboards, and track usage to identify and
          remove low-value dashboards. Logging PII inadvertently creates security and compliance risks.
          Implement log scrubbing, provide developer training, and use automated scanning to detect
          sensitive data in logs. Treating observability as an afterthought added post-launch means
          critical instrumentation is missing when incidents occur. Adopt observability-driven
          development, use pre-launch checklists, and include observability requirements in user
          stories. Lack of standardization where each team uses different tools and conventions
          prevents cross-team debugging. Establish standard schemas, naming conventions, and shared
          instrumentation libraries. Finally, collecting observability data but not using it wastes
          resources and provides no operational benefit. Conduct regular reviews, analyze incidents
          using observability data, and drive continuous improvement.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Netflix built Atlas, a dimensional time-series metrics platform, to handle the observability
          needs of its microservices architecture serving hundreds of millions of users. Atlas supports
          high cardinality metrics with real-time streaming evaluation of alerts, enabling Netflix
          engineers to detect and respond to issues within seconds. Netflix open-sourced their
          observability stack including Atlas for metrics, Mantis for real-time stream processing of
          observability data, and Vector for high-performance telemetry data collection. Their approach
          demonstrates how custom observability infrastructure can be built when commercial solutions
          do not meet scale requirements.
        </p>
        <p>
          Uber created Jaeger, a CNCF graduated project that is now one of the most widely used
          distributed tracing systems. Uber&apos;s microservices architecture with thousands of services
          required end-to-end tracing to debug latency issues and service dependencies. Jaeger supports
          distributed context propagation, real-time trace processing, and dependency graph generation.
          Uber uses Jaeger to identify critical paths in their ride-hailing and food delivery platforms,
          optimize latency across service chains, and debug production incidents. Jaeger&apos;s success
          demonstrates the value of building and open-sourcing observability tools that solve
          production-scale problems.
        </p>
        <p>
          Shopify uses a combination of open-source and commercial observability tools to monitor their
          e-commerce platform serving millions of merchants. They use Prometheus and Grafana for metrics,
          Elasticsearch and Kibana for logs, and a commercial tracing platform for distributed tracing.
          Shopify&apos;s observability strategy focuses on correlating business metrics (order volume,
          checkout conversion) with infrastructure metrics (latency, error rate) to understand how
          technical issues impact revenue. During high-traffic events like Black Friday, Shopify uses
          tail-based sampling to capture all error traces and slow traces while head-sampling normal
          traffic, ensuring visibility into issues during peak load.
        </p>
        <p>
          Datadog as an observability platform provider demonstrates the all-in-one approach to
          observability. Datadog integrates metrics, logs, traces, network monitoring, security
          monitoring, and real-user monitoring in a single platform with automatic correlation between
          data types. Their service map feature auto-generates service dependency graphs from trace data,
          and their watchdog feature uses machine learning to detect anomalies without manual threshold
          configuration. Companies using Datadog benefit from reduced operational overhead compared to
          assembling open-source components, but they accept vendor lock-in and per-host pricing that
          scales with infrastructure size.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between monitoring and observability?</p>
            <p className="mt-2 text-sm">
              A: Monitoring tells you when predefined conditions are met (alerts on known failure modes).
              Observability enables asking arbitrary questions about system behavior without knowing the
              question in advance. Monitoring is for known unknowns; observability is for unknown unknowns.
              You need both.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement distributed tracing?</p>
            <p className="mt-2 text-sm">
              A: Generate trace ID at request entry point, propagate via headers (W3C traceparent or B3)
              across all services, create spans for each operation, send to tracing backend. Use
              auto-instrumentation where possible (OpenTelemetry). Manual instrumentation for business
              logic. Sample appropriately for high-traffic services.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics would you track for an API service?</p>
            <p className="mt-2 text-sm">
              A: RED method—Request rate, Error rate, Duration (latency percentiles P50, P95, P99). Plus
              saturation (queue depth, CPU, memory), dependency health (database latency, external API
              latency), and business metrics (conversion rate, active users). Track SLO burn rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you correlate logs, metrics, and traces?</p>
            <p className="mt-2 text-sm">
              A: Include trace_id in every log entry (via MDC). Add trace context to metric labels
              carefully (watch cardinality). Use unified observability platform that links across data
              types. Enable clicking from metric to traces to logs in UI. Time-synchronize all data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What sampling strategy would you use for tracing?</p>
            <p className="mt-2 text-sm">
              A: Hybrid approach—head sample at low rate (1-10%) for baseline visibility, tail sample for
              errors, slow traces (P99+), and high-value transactions (VIP users, large orders). This
              ensures important traces are captured while controlling cost.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you avoid alert fatigue?</p>
            <p className="mt-2 text-sm">
              A: Alert on symptoms not causes (SLO-based alerting). Use burn rate alerts that consider
              both error rate and time window. Tune thresholds based on historical data. Regular alert
              review—remove or tune noisy alerts. Ensure every alert is actionable with a runbook.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>&quot;Observability Engineering&quot; by Charity Majors et al.</li>
          <li>Google SRE Book: Monitoring Distributed Systems</li>
          <li>OpenTelemetry Documentation: <a href="https://opentelemetry.io" className="text-accent hover:underline">opentelemetry.io</a></li>
          <li>Honeycomb: Observability resources</li>
          <li>Lightstep: Observability resources</li>
          <li>Prometheus Documentation: <a href="https://prometheus.io" className="text-accent hover:underline">prometheus.io</a></li>
          <li>Jaeger Documentation: <a href="https://jaegertracing.io" className="text-accent hover:underline">jaegertracing.io</a></li>
          <li>&quot;Site Reliability Engineering&quot; by Google</li>
          <li>CNCF Observability Whitepaper</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
