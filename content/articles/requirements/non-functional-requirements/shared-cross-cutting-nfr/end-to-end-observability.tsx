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
  wordCount: 10500,
  readingTime: 42,
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
          system by examining its outputs — across all services, from user request to backend processing
          and back. Unlike monitoring (which tells you when something is wrong), observability enables you
          to ask arbitrary questions about system behavior without knowing the question in advance.
        </p>
        <p>
          Observability rests on three pillars:
        </p>
        <ul>
          <li>
            <strong>Logs:</strong> Timestamped records of events.
          </li>
          <li>
            <strong>Metrics:</strong> Numerical measurements over time.
          </li>
          <li>
            <strong>Traces:</strong> Request flow across services.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-three-pillars.svg"
          alt="Three Pillars of Observability"
          caption="The Three Pillars — Logs (timestamped events), Metrics (numerical measurements), and Traces (request flow) with correlation linking all three"
        />

        <p>
          In distributed systems, observability is critical for debugging issues that span multiple
          services. A single user request may traverse 10+ services — without end-to-end tracing,
          identifying the root cause of latency or failures is nearly impossible.
        </p>
      </section>

      <section>
        <h2>Distributed Tracing</h2>
        <p>
          Tracing requests across service boundaries:
        </p>
        <ul>
          <li><strong>Context Propagation:</strong> Pass trace ID in headers (traceparent, X-B3-TraceId).</li>
          <li><strong>Sampling:</strong> Head-based (decide at start) vs tail-based (decide after).</li>
          <li><strong>Tools:</strong> Jaeger, Zipkin, AWS X-Ray, Google Cloud Trace.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-distributed-tracing.svg"
          alt="Distributed Tracing Flow"
          caption="Distributed Tracing — showing trace context propagation via HTTP headers and span timeline waterfall"
        />
      </section>

      <section>
        <h2>Observability Maturity</h2>
        <p>
          Organizations typically progress through maturity levels:
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/observability-maturity-model.svg"
          alt="Observability Maturity Model"
          caption="Maturity Model — from basic monitoring (Level 1) through centralized logging (Level 2), metrics + tracing (Level 3), to full observability (Level 4)"
        />
        <p>
          <strong>End-to-End Observability</strong> is the ability to understand the internal state of a
          system by examining its outputs — across all services, from user request to backend processing
          and back. Unlike monitoring (which tells you when something is wrong), observability enables you
          to ask arbitrary questions about system behavior without knowing the question in advance.
        </p>
        <p>
          Observability rests on three pillars:
        </p>
        <ul>
          <li>
            <strong>Logs:</strong> Timestamped records of events.
          </li>
          <li>
            <strong>Metrics:</strong> Numerical measurements over time.
          </li>
          <li>
            <strong>Traces:</strong> Request flow across services.
          </li>
        </ul>
        <p>
          In distributed systems, observability is critical for debugging issues that span multiple
          services. A single user request may traverse 10+ services — without end-to-end tracing,
          identifying the root cause of latency or failures is nearly impossible.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Observability Enables Debugging the Unknown</h3>
          <p>
            Monitoring alerts you to known failure modes. Observability enables investigating novel
            failures — the &quot;unknown unknowns&quot; that weren&apos;t anticipated when dashboards
            were built.
          </p>
        </div>
      </section>

      <section>
        <h2>The Three Pillars</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Logs</h3>
        <p>
          Structured, timestamped event records:
        </p>
        <ul>
          <li><strong>Application Logs:</strong> Business events, errors, warnings.</li>
          <li><strong>Access Logs:</strong> HTTP requests, response codes, latency.</li>
          <li><strong>Audit Logs:</strong> Security-relevant events.</li>
          <li><strong>Best Practice:</strong> Structured logging (JSON), consistent schema, correlation IDs.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Metrics</h3>
        <p>
          Numerical measurements aggregated over time:
        </p>
        <ul>
          <li><strong>RED Method:</strong> Rate, Errors, Duration (for services).</li>
          <li><strong>USE Method:</strong> Utilization, Saturation, Errors (for resources).</li>
          <li><strong>Golden Signals:</strong> Latency, Traffic, Errors, Saturation.</li>
          <li><strong>Best Practice:</strong> High cardinality labels, appropriate aggregation, SLO tracking.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Traces</h3>
        <p>
          Request flow across services:
        </p>
        <ul>
          <li><strong>Span:</strong> Single operation within a trace.</li>
          <li><strong>Trace ID:</strong> Unique identifier for entire request flow.</li>
          <li><strong>Parent/Child:</strong> Span relationships.</li>
          <li><strong>Best Practice:</strong> Propagate trace context, sample appropriately, add meaningful tags.</li>
        </ul>
      </section>

      <section>
        <h2>Distributed Tracing</h2>
        <p>
          Tracing requests across service boundaries:
        </p>
        <ul>
          <li><strong>Context Propagation:</strong> Pass trace ID in headers (traceparent, X-B3-TraceId).</li>
          <li><strong>Sampling:</strong> Head-based (decide at start) vs tail-based (decide after).</li>
          <li><strong>Tools:</strong> Jaeger, Zipkin, AWS X-Ray, Google Cloud Trace.</li>
        </ul>
      </section>

      <section>
        <h2>Correlation</h2>
        <p>
          Linking logs, metrics, and traces:
        </p>
        <ul>
          <li><strong>Trace ID in Logs:</strong> Include trace_id in every log entry.</li>
          <li><strong>Metric Labels:</strong> Add trace context to metrics.</li>
          <li><strong>Unified Dashboard:</strong> Single view across all telemetry.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between monitoring and observability?</p>
            <p className="mt-2 text-sm">
              A: Monitoring tells you when predefined conditions are met (alerts). Observability enables
              asking arbitrary questions about system behavior. Monitoring is for known unknowns;
              observability is for unknown unknowns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement distributed tracing?</p>
            <p className="mt-2 text-sm">
              A: Generate trace ID at request entry, propagate via headers (W3C traceparent), create spans
              for each operation, send to tracing backend. Use auto-instrumentation where possible
              (OpenTelemetry).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics would you track for an API service?</p>
            <p className="mt-2 text-sm">
              A: RED method — Request rate, Error rate, Duration (latency percentiles). Plus saturation
              (queue depth, CPU), dependency health, business metrics (conversion rate).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
