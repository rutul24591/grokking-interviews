"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-centralized-logging-extensive",
  title: "Centralized Logging",
  description: "Comprehensive guide to centralized logging, covering log aggregation, structured logging, ELK stack, log retention, and production observability patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "centralized-logging",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "logging", "observability", "elk", "structured-logging", "monitoring"],
  relatedTopics: ["metrics-distributed-tracing", "fault-tolerance-resilience", "compliance-auditing"],
};

export default function CentralizedLoggingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Centralized Logging</strong> aggregates logs from all system components into a single,
          searchable repository. It is essential for debugging, monitoring, security analysis, and compliance.
        </p>
        <p>
          In distributed systems, logs are generated across many services, servers, and containers. Without
          centralization, debugging requires SSH-ing into multiple machines — impractical at scale.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Logs are Forensic Evidence</h3>
          <p>
            Logs are your primary tool for understanding what happened in your system. Good logging is like
            good detective work — capture the right details, maintain chain of custody (timestamps, correlation
            IDs), and make it searchable.
          </p>
        </div>
      </section>

      <section>
        <h2>Logging Architecture</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/centralized-logging.svg"
          alt="Centralized Logging Architecture"
          caption="Centralized Logging — showing logging pipeline (Sources→Collectors→Aggregator→Storage→Visualization), structured vs unstructured logging, and retention strategy"
        />
        <p>
          A typical centralized logging pipeline:
        </p>
      </section>

      <section>
        <h2>Log Aggregation in Practice</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/log-aggregation-flow.svg"
          alt="Log Aggregation Flow"
          caption="Log Aggregation — showing collection pipeline from app servers through Filebeat/Logstash to Elasticsearch/Kibana, log levels, and distributed tracing with correlation IDs"
        />
        <p>
          Implementing log aggregation at scale:
        </p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Log Generation:</strong> Applications write logs to stdout, files, or logging libraries.
          </li>
          <li>
            <strong>Log Collection:</strong> Agents (Filebeat, Fluentd, Vector) collect logs from sources.
          </li>
          <li>
            <strong>Log Shipping:</strong> Logs sent to central aggregator (Logstash, Fluentd).
          </li>
          <li>
            <strong>Log Processing:</strong> Parse, enrich, filter, transform logs.
          </li>
          <li>
            <strong>Log Storage:</strong> Store in searchable index (Elasticsearch, Loki).
          </li>
          <li>
            <strong>Log Visualization:</strong> Query and visualize (Kibana, Grafana).
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ELK Stack</h3>
        <p>
          <strong>Elasticsearch:</strong> Distributed search and analytics engine.
        </p>
        <p>
          <strong>Logstash:</strong> Server-side data processing pipeline.
        </p>
        <p>
          <strong>Kibana:</strong> Visualization and exploration interface.
        </p>
        <p>
          <strong>Beats (Filebeat):</strong> Lightweight log shippers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modern Alternatives</h3>
        <ul>
          <li>
            <strong>Grafana Loki:</strong> Log aggregation inspired by Prometheus. Cost-effective, integrates
            with Grafana.
          </li>
          <li>
            <strong>Datadog/Splunk:</strong> Managed solutions with advanced features.
          </li>
          <li>
            <strong>Cloud-native:</strong> CloudWatch Logs, Stackdriver, Azure Monitor.
          </li>
        </ul>
      </section>

      <section>
        <h2>Centralized Logging Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/logging-deep-dive.svg"
          alt="Centralized Logging Deep Dive"
          caption="Centralized Logging Deep Dive — showing log levels and usage, structured log fields, log aggregation patterns, retention strategy"
        />
        <p>
          Advanced centralized logging concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Log Levels &amp; When to Use Each</h3>
        <p>
          Proper log level usage is critical for effective debugging and monitoring:
        </p>
        <ul>
          <li>
            <strong>DEBUG:</strong> Verbose diagnostic information. Variable values, function entry/exit,
            detailed flow. Only enabled in development. Too noisy for production.
          </li>
          <li>
            <strong>INFO:</strong> Normal operational messages. Service started, request processed,
            user logged in. Should be meaningful but not excessive. Default production level.
          </li>
          <li>
            <strong>WARN:</strong> Potential issues that don't block operation. Deprecated API usage,
            slow query detected, retry attempt. Should be investigated but not urgent.
          </li>
          <li>
            <strong>ERROR:</strong> Actual failures. Exception thrown, request failed, dependency unavailable.
            Requires investigation and often immediate action.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Structured Log Fields</h3>
        <p>
          Essential fields for every structured log entry:
        </p>
        <ul>
          <li>
            <strong>timestamp:</strong> ISO 8601 format with timezone. Enables time-based queries and correlation.
          </li>
          <li>
            <strong>level:</strong> DEBUG, INFO, WARN, ERROR. Enables filtering by severity.
          </li>
          <li>
            <strong>service/name:</strong> Service identifier. Critical in microservices for identifying source.
          </li>
          <li>
            <strong>trace_id/span_id:</strong> Distributed tracing correlation. Links logs across services.
          </li>
          <li>
            <strong>user_id/session_id:</strong> User context. Enables user-centric debugging.
          </li>
          <li>
            <strong>message:</strong> Human-readable description. Should be concise and actionable.
          </li>
          <li>
            <strong>context/metadata:</strong> Additional structured data. Request ID, latency, status codes.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Log Aggregation Patterns</h3>
        <p>
          Different approaches to collecting and aggregating logs:
        </p>
        <ul>
          <li>
            <strong>Sidecar Pattern:</strong> Log collector runs as sidecar container in each pod.
            Kubernetes-native, isolated per application. Resource overhead per pod.
          </li>
          <li>
            <strong>DaemonSet Pattern:</strong> One log collector per node (Fluentd, Filebeat).
            Resource efficient, simpler management. All containers write to shared volume.
          </li>
          <li>
            <strong>Direct Shipping:</strong> Application sends logs directly to aggregator.
            Simple but couples application to logging infrastructure.
          </li>
          <li>
            <strong>Log Forwarding:</strong> Local buffer (Fluent Bit) forwards to central aggregator.
            Resilient to network issues, provides backpressure handling.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Log Retention Strategy</h3>
        <p>
          Tiered storage based on log age and access patterns:
        </p>
        <ul>
          <li>
            <strong>Hot Storage (0-30 days):</strong> Elasticsearch, Splunk. Fast search,
            expensive. For active debugging and alerting.
          </li>
          <li>
            <strong>Warm Storage (30-90 days):</strong> Compressed indices, slower storage.
            For historical analysis and incident investigation.
          </li>
          <li>
            <strong>Cold Storage (90 days - 1 year):</strong> S3, Glacier. Very cheap,
            slow retrieval. For compliance and rare investigations.
          </li>
          <li>
            <strong>Compliance-Based Retention:</strong> SOX requires 7 years for financial logs.
            HIPAA requires 6 years for healthcare logs. Store in compliant archive.
          </li>
        </ul>
      </section>

      <section>
        <h2>Structured Logging</h2>
        <p>
          <strong>Structured logging</strong> outputs logs as structured data (JSON) instead of plain text.
        </p>
        <p>
          <strong>Unstructured (bad):</strong> Plain text log like "2024-01-15 10:30:45 ERROR User john failed login from 192.168.1.1"
        </p>
        <p>
          <strong>Structured (good):</strong> JSON log with fields for timestamp, level, event, user, ip, trace_id, and service
        </p>
        <p>
          <strong>Benefits:</strong>
        </p>
        <ul>
          <li>✓ Queryable (filter by level, user, event).</li>
          <li>✓ Machine-parseable.</li>
          <li>✓ Consistent format across services.</li>
          <li>✓ Easier to add/remove fields.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a centralized logging system for 100 microservices generating 1TB of logs per day.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Collection:</strong> Fluentd/Fluent Bit as DaemonSet on each node. Collects container logs, forwards to aggregator.</li>
                <li><strong>Buffering:</strong> Kafka cluster for buffering (handles traffic spikes). Retention: 24 hours.</li>
                <li><strong>Processing:</strong> Logstash or Fluentd for parsing, enrichment (add service name, environment), filtering.</li>
                <li><strong>Storage:</strong> Elasticsearch cluster (hot-warm-cold). Hot: 7 days SSD, Warm: 30 days HDD, Cold: 1 year S3.</li>
                <li><strong>Querying:</strong> Kibana or Grafana for search and visualization.</li>
                <li><strong>Scale:</strong> 1TB/day = ~40GB/hour. Need ~10 Elasticsearch data nodes for hot storage.</li>
                <li><strong>Cost:</strong> ~$10,000/month for Elasticsearch cluster + $1,000/month for S3 cold storage.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare ELK stack, Grafana Loki, and managed solutions (Datadog, Splunk).
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>ELK Stack:</strong> ✓ Open source, powerful queries (Lucene), flexible. ✗ Resource intensive, operational complexity, expensive at scale.</li>
                <li><strong>Grafana Loki:</strong> ✓ Lightweight, cost-effective (indexes labels only), integrates with Grafana. ✗ Less powerful queries, newer ecosystem.</li>
                <li><strong>Splunk:</strong> ✓ Enterprise features, easy to use, great support, compliance ready. ✗ Very expensive ($/GB ingested), vendor lock-in.</li>
                <li><strong>Datadog:</strong> ✓ Unified platform (logs + metrics + traces), easy setup. ✗ Expensive at scale, vendor lock-in.</li>
                <li><strong>Choose ELK when:</strong> Need powerful search, have ops team, cost-sensitive.</li>
                <li><strong>Choose Loki when:</strong> Already use Grafana, cost-sensitive, simpler query needs.</li>
                <li><strong>Choose Splunk/Datadog when:</strong> Enterprise budget, want managed solution.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. What is structured logging? Why is it better than plain text logging?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Structured logging:</strong> Output logs as structured data (JSON) instead of plain text.</li>
                <li><strong>Unstructured (bad):</strong> "2024-01-15 10:30:45 ERROR User john failed login from 192.168.1.1"</li>
                <li><strong>Structured (good):</strong> {"{"}"timestamp": "2024-01-15T10:30:45Z", "level": "ERROR", "event": "login_failed", "user": "john", "ip": "192.168.1.1"{"}"}</li>
                <li><strong>Benefits:</strong> (1) Queryable (filter by level, user, event). (2) Machine-parseable. (3) Consistent format across services. (4) Easy to add/remove fields. (5) Correlation with traces (include trace_id).</li>
                <li><strong>Required fields:</strong> timestamp, level, service, trace_id, span_id, message, user_id (if authenticated).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you handle log retention and cost management at scale?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Tiered storage:</strong> Hot (7 days SSD) → Warm (30 days HDD) → Cold (1 year S3 Glacier). 25× cost savings from hot to cold.</li>
                <li><strong>Sampling:</strong> Always log ERROR/WARN. Sample INFO (10%), DEBUG (1%). 90% cost reduction.</li>
                <li><strong>Aggregation:</strong> Store aggregated metrics instead of raw logs for old data. Keep raw logs for recent debugging.</li>
                <li><strong>Lifecycle policies:</strong> Automated transitions (S3 Lifecycle, Elasticsearch ILM). No manual intervention.</li>
                <li><strong>Compression:</strong> Use compressed formats (Parquet, ORC) for cold storage. 5-10× size reduction.</li>
                <li><strong>Example:</strong> 1TB/day logs: All hot = $300K/month. With tiering + sampling = ~$30K/month. 10× savings.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you correlate logs across multiple services for a single request?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Trace ID:</strong> Generate unique trace_id at request entry (API Gateway). Propagate via HTTP headers (X-Trace-ID or W3C traceparent).</li>
                <li><strong>Span ID:</strong> Each service generates span_id for its work. Parent span_id links to caller.</li>
                <li><strong>Log correlation:</strong> Include trace_id and span_id in all log entries. Query logs by trace_id to see full request flow.</li>
                <li><strong>Implementation:</strong> Use OpenTelemetry for automatic context propagation. Middleware adds trace_id to logs.</li>
                <li><strong>Tools:</strong> Jaeger/Zipkin for traces, Elasticsearch for logs. Link traces to logs via trace_id.</li>
                <li><strong>Best practice:</strong> Make trace_id visible in log UI. One-click navigation from trace to logs.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. What security considerations apply to logging (PII, credentials, compliance)?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>PII protection:</strong> Never log passwords, credit cards, SSN. Redact/mask PII (show last 4 digits only).</li>
                <li><strong>Credential protection:</strong> Never log API keys, tokens, secrets. Use secret scanning in CI/CD.</li>
                <li><strong>Compliance:</strong> HIPAA = no PHI in logs. PCI DSS = no card data. GDPR = minimize personal data.</li>
                <li><strong>Access control:</strong> Restrict log access. Audit who accesses logs. Separate duties (developers can&apos;t delete logs).</li>
                <li><strong>Encryption:</strong> Encrypt logs at rest and in transit. Use TLS for log shipping.</li>
                <li><strong>Best practice:</strong> Implement log sanitization middleware. Scan logs for secrets before storage.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Logging Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Structured logging (JSON) implemented</li>
          <li>✓ Consistent log format across services</li>
          <li>✓ Correlation IDs for request tracing</li>
          <li>✓ Appropriate log levels (DEBUG, INFO, WARN, ERROR)</li>
          <li>✓ No sensitive data in logs (PII, credentials)</li>
          <li>✓ Log aggregation pipeline configured</li>
          <li>✓ Log retention policy defined</li>
          <li>✓ Log search and visualization tools available</li>
          <li>✓ Alerting on error log patterns</li>
          <li>✓ Log volume monitoring</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
