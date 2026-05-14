"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-incident-debugging-dashboard",
  title: "Design an Incident / Debugging Dashboard for Users",
  description:
    "Architecture for a production incident and debugging dashboard: multi-signal ingestion (errors, metrics, logs) via Kafka, error grouping by stack fingerprint, correlation with deployments and feature flags via traceId, static and ML anomaly alerting with 3-sigma detection, session replay drill-down, distributed trace waterfall, PagerDuty routing, status page publishing, and auto-drafted postmortem on resolution.",
  category: "high-level-design",
  subcategory: "error-handling-reliability-systems",
  slug: "incident-debugging-dashboard",
  wordCount: 5000,
  readingTime: 29,
  lastUpdated: "2026-05-14",
  tags: ["hld", "incident-management", "observability", "debugging", "sentry", "grafana", "pagerduty", "postmortem"],
  relatedTopics: ["global-error-handling-fallback-ui", "retry-failure-recovery-ux"],
};

export default function IncidentDebuggingDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          When a production system degrades, time-to-detection (TTD) and
          time-to-resolution (TTR) are the two metrics that matter most. The
          challenge is not just collecting signals—modern systems already emit
          thousands of metrics, log lines, and error events per second—but
          correlating those signals into a coherent picture of what broke, when,
          why, and how to fix it. An incident and debugging dashboard is the
          operator&rsquo;s primary interface during an incident. Poor design (disconnected
          panels, too many false alerts, no drill-down path) turns a recoverable
          situation into a prolonged outage.
        </HighlightBlock>
        <p>Key questions to clarify:</p>
        <ul>
          <li>
            <strong>Audience:</strong> Is this dashboard for internal engineers
            (on-call SREs) or for external customers (a &ldquo;Is the service down?&rdquo;
            status page)?
          </li>
          <li>
            <strong>Signal types:</strong> Errors only, or also metrics (latency,
            throughput) and logs?
          </li>
          <li>
            <strong>Correlation scope:</strong> Can we correlate across services
            using distributed traces (traceId)?
          </li>
          <li>
            <strong>Alert channels:</strong> PagerDuty, Slack, email, SMS?
          </li>
          <li>
            <strong>Postmortem process:</strong> Manual or assisted by the system?
          </li>
        </ul>
        <p>
          For this design: internal engineering dashboard plus an external status
          page; multi-signal (errors + metrics + logs + traces); cross-service
          correlation via traceId; PagerDuty + Slack alerting; and auto-assisted
          postmortem generation.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <HighlightBlock as="li" tier="important">
            All signals (errors, metrics, logs) are ingested into a central pipeline
            with a consistent schema and correlated by <code>traceId</code>.
          </HighlightBlock>
          <li>
            Errors are grouped by stack fingerprint; each group shows affected user
            count, first/last seen, deployment that introduced it, and a link to
            session replay.
          </li>
          <li>
            Alerts fire within 60 seconds of a threshold breach; on-call is paged
            for critical incidents with severity, affected scope, and runbook link.
          </li>
          <li>
            Operators can drill from an alert into a distributed trace waterfall and
            correlated log timeline for root cause analysis.
          </li>
          <li>
            An external status page reflects incident state in real time; users
            can subscribe to updates.
          </li>
          <li>
            On incident resolution, the system auto-drafts a postmortem with
            timeline, affected metrics, and contributing factors.
          </li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <li>
            <strong>Ingestion throughput:</strong> 100K events/second per service;
            Kafka provides horizontal scale.
          </li>
          <li>
            <strong>Query latency:</strong> Dashboard queries return in &lt;2 seconds
            for 7-day windows; &lt;500ms for 1-hour windows.
          </li>
          <li>
            <strong>Retention:</strong> Raw events 30 days; hourly rollups 1 year;
            incident records indefinitely.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Availability:</strong> The monitoring system must remain
            available during the incidents it monitors—it must not share
            infrastructure with the services it monitors.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/error-handling-reliability-systems/incident-debugging-dashboard.svg"
          alt="Incident and debugging dashboard sequence diagram"
          caption="Multi-signal ingestion → correlation by traceId → ML anomaly alerting → PagerDuty → session replay drill-down → auto-postmortem"
        />
        <p>The system has four layers:</p>
        <ol>
          <li>
            <strong>Ingest:</strong> Errors, metrics, and logs flow into Kafka.
            Each event is enriched with <code>traceId</code>, <code>buildSha</code>,
            <code>region</code>, and <code>userId</code>.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Store &amp; correlate:</strong> A stream processor writes to a
            TSDB (metrics), search index (errors/logs), and incident store. Events
            are joined by <code>traceId</code>.
          </HighlightBlock>
          <li>
            <strong>Alert:</strong> An alert engine evaluates PromQL rules and an
            ML anomaly model every 30 seconds. Firing alerts route to PagerDuty and
            update the status page.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Resolve &amp; learn:</strong> Operators drill into session
            replays and trace waterfalls. On resolution, the system publishes the
            status page update and generates a postmortem draft.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Signal Ingestion Pipeline</h3>
        <p>
          Each signal type flows into its own Kafka topic with a defined schema:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong><code>errors</code> topic:</strong> Emitted by the Sentry SDK
            or a custom error collector. Schema: <code>&#123;errorId, traceId, fingerprint,
            message, stackFrames[], buildSha, userId, region, featureFlags,
            sessionReplayUrl, timestamp&#125;</code>.
          </HighlightBlock>
          <li>
            <strong><code>metrics</code> topic:</strong> Emitted by Prometheus
            remote-write or a custom metrics SDK. Schema: <code>&#123;metricName, labels,
            value, traceId, timestamp&#125;</code>.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong><code>logs</code> topic:</strong> Emitted by Fluent Bit from
            pod stdout/stderr. Schema: <code>&#123;level, message, traceId, spanId,
            service, podName, timestamp&#125;</code>.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong><code>deployments</code> topic:</strong> Emitted by the CI/CD
            pipeline on each deploy. Schema: <code>&#123;buildSha, service, environment,
            deployedAt, deployer&#125;</code>. This is the correlation anchor for
            &ldquo;did this error spike after the deploy?&rdquo;
          </HighlightBlock>
        </ul>
        <p>
          A stream processor (Flink or Kafka Streams) reads from all four topics.
          It enriches errors with the most recent deploy event matching the
          <code>buildSha</code>, enabling &ldquo;first seen 3 minutes after deploy by
          @alice&rdquo; annotations in the UI.
        </p>

        <h3>Storage Architecture</h3>
        <p>
          Three purpose-built stores handle the different query patterns:
        </p>
        <ul>
          <li>
            <strong>Time-series DB (Prometheus / VictoriaMetrics):</strong> Stores
            metrics with efficient range queries and aggregation. Used for latency
            percentiles, error rate trends, and SLA % calculations. Retention:
            30 days at 15s resolution; 1 year at 1-hour rollups.
          </li>
          <li>
            <strong>Search index (Elasticsearch / OpenSearch):</strong> Stores
            error events and log lines. Supports full-text search, fingerprint
            aggregation, and faceted filtering (by <code>buildSha</code>, region,
            userId). Used for error group lists and log timeline queries.
          </li>
          <li>
            <strong>Trace store (Jaeger / Tempo):</strong> Stores distributed
            traces with parent-child span relationships. Queryable by
            <code>traceId</code>. Used for the waterfall drill-down view. Retention:
            7 days at full resolution.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Incident store (PostgreSQL):</strong> Stores incident records
            (opened, resolved, severity, affected services, responsible deployment,
            MTTR). Used for postmortem generation and historical SLA reporting.
          </HighlightBlock>
        </ul>

        <h3>Error Grouping by Stack Fingerprint</h3>
        <p>
          Raw error events are grouped into issues by a fingerprinting algorithm:
        </p>
        <ol>
          <li>
            Strip dynamic content from the error message using regex patterns:{" "}
            UUIDs, numeric IDs, timestamps, URLs with query strings.
          </li>
          <li>
            Normalise stack frames: remove chunk hash suffixes from filenames (
            <code>chunk.a1b2c3.js</code> → <code>chunk.js</code>), strip line
            numbers from minified files (use source maps to recover original
            file+line).
          </li>
          <li>
            Concatenate: <code>&#123;errorType&#125;:&#123;normalised_message&#125;:&#123;top_3_frames&#125;</code>.
          </li>
          <li>Hash with xxHash64 for a stable 64-bit fingerprint.</li>
        </ol>
        <p>
          Each unique fingerprint maps to an &ldquo;issue&rdquo; in the search index. Issues
          accumulate: <code>event_count</code>, <code>affected_users</code> (HyperLogLog
          cardinality estimate), <code>first_seen</code>, <code>last_seen</code>,
          <code>introducing_build_sha</code>. The UI shows issues sorted by affected
          user count descending (impact-first triage).
        </p>

        <h3>Alert Engine</h3>
        <p>
          Two complementary alerting approaches operate in parallel:
        </p>
        <h4>Static Threshold Alerts (PromQL)</h4>
        <ul>
          <li>
            <code>rate(http_requests_total&#123;status=~&quot;5..&quot;&#125;[5m]) / rate(http_requests_total[5m]) &gt; 0.01</code>
            → warning (1% error rate).
          </li>
          <li>
            <code>histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) &gt; 2</code>
            → warning (p99 latency &gt;2s).
          </li>
          <li>
            <code>increase(error_events_total[5m]) &gt; 500 AND on() hour() &gt;= 9 AND hour() &lt;= 17</code>
            → critical during business hours.
          </li>
        </ul>
        <h4>ML Anomaly Detection</h4>
        <p>
          Static thresholds miss anomalies during unusual traffic patterns (traffic
          spikes at 3 AM naturally increase absolute error counts without indicating
          a problem if the error rate is stable). An ML model trained on 7 days of
          historical metric data provides a dynamic baseline:
        </p>
        <ul>
          <li>
            Model: seasonal decomposition (time-of-day and day-of-week components)
            + rolling mean/variance. Implemented as a lightweight Prophet or ARIMA
            model updated daily.
          </li>
          <li>
            Alert: actual value &gt; mean + 3σ above the seasonal baseline for 2
            consecutive evaluation periods (60 seconds total).
          </li>
          <li>
            False positive reduction: require the anomaly to persist for 2 periods
            and to exceed a minimum absolute threshold (avoids alerting on 0→1 error
            counts at 3 AM).
          </li>
        </ul>

        <h3>Alert Routing and Escalation</h3>
        <p>
          Alert Manager routes firing alerts based on severity and time:
        </p>
        <ul>
          <li>
            <strong>Warning:</strong> Slack message to <code>#incidents</code>
            channel with alert name, current value, threshold, and a direct link to
            the relevant Grafana panel.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Critical:</strong> PagerDuty page to the on-call rotation with:
            severity level, affected service, current error rate, introducing deploy
            (if identifiable), runbook URL, and a pre-populated incident Slack
            channel name.
          </HighlightBlock>
          <li>
            <strong>Escalation:</strong> If the incident is not acknowledged within
            5 minutes, escalate to the secondary on-call. If not resolved within 30
            minutes, notify the engineering manager.
          </li>
        </ul>

        <h3>Drill-Down Workflow</h3>
        <p>
          The dashboard is designed around the following operator workflow:
        </p>
        <ol>
          <HighlightBlock as="li" tier="important">
            <strong>Alert fired:</strong> Operator opens the PagerDuty link → lands
            on the incident detail page showing: alert metadata, error rate chart,
            affected endpoint, and top error groups by user impact.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Error group inspection:</strong> Clicks the top error group →
            sees: fingerprint, event count over time (was it sudden spike or slow
            creep?), introducing deploy, sample stack traces, and a session replay
            link for a recently affected user.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Session replay:</strong> Clicks session replay → LogRocket /
            FullStory shows the user&rsquo;s interaction up to the moment of the error,
            with network request log and console output. Identifies if the error
            occurs on a specific user action or data combination.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Distributed trace:</strong> Clicks the <code>traceId</code> in
            the session replay network log → Jaeger shows the full request waterfall:
            API gateway → auth service → data service → DB query. Identifies which
            span is slow or failing (e.g., DB query taking 8s instead of 20ms).
          </HighlightBlock>
          <li>
            <strong>Log correlation:</strong> Queries Elasticsearch for logs with
            the same <code>traceId</code> → sees structured log lines from all
            services in chronological order. Finds the root cause log line:{" "}
            <em>&ldquo;Connection pool exhausted: 50/50 connections active&quot;</em>.
          </li>
        </ol>
        <p>
          This five-step drill-down path should be traversable in under 10 minutes
          by a competent on-call engineer. Dashboard design must ensure each step
          links directly to the next without requiring manual search.
        </p>

        <h3>Status Page</h3>
        <HighlightBlock as="p" tier="important">
          The external status page is decoupled from the internal dashboard and
          hosted on a CDN with zero dependency on the services it describes (it must
          remain accessible when the main app is down):
        </HighlightBlock>
        <ul>
          <li>
            Status is pushed to the status page via a webhook from the incident
            store; the status page does not poll the monitored services.
          </li>
          <HighlightBlock as="li" tier="important">
            Status values: <code>Operational</code>, <code>Degraded Performance</code>,
            <code>Partial Outage</code>, <code>Major Outage</code>,{" "}
            <code>Under Maintenance</code>.
          </HighlightBlock>
          <li>
            Users can subscribe to email/SMS/webhook updates per component. Updates
            are delivered within 30 seconds of status change via a dedicated
            notification worker (separate from the main notification pipeline to
            avoid circular dependency).
          </li>
          <li>
            Historical uptime data (30 days) is displayed as a green/yellow/red
            bar chart, providing transparency into reliability track record.
          </li>
        </ul>

        <h3>Auto-Drafted Postmortem</h3>
        <p>
          On incident resolution, the system generates a postmortem draft populated
          from the incident store data:
        </p>
        <ul>
          <li>
            <strong>Timeline:</strong> All alert events, acknowledgements, status
            page updates, and resolution actions with timestamps.
          </li>
          <li>
            <strong>Impact:</strong> Affected user count (from error group
            HyperLogLog estimates), affected services, duration.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Contributing factors:</strong> Introducing deploy (from
            fingerprint → buildSha correlation), feature flags active during the
            incident, anomalous metrics in the 30 minutes before the first alert.
          </HighlightBlock>
          <li>
            <strong>MTTR:</strong> Time from first alert to resolution.
          </li>
          <li>
            <strong>Action items template:</strong> Five blank sections for the
            team to fill in: root cause, immediate fix, permanent fix, detection
            improvement, and prevention.
          </li>
        </ul>
        <p>
          The auto-draft is stored in the incident record and shared as a Google
          Doc or Notion page via an integration. The team edits and publishes it;
          the system does not publish postmortems automatically.
        </p>

        <h3>Monitoring the Monitor</h3>
        <p>
          The monitoring system must be independently monitored. Failure modes to
          alert on:
        </p>
        <ul>
          <li>
            Kafka consumer lag &gt;60 seconds → ingestion pipeline falling behind;
            signals may be delayed.
          </li>
          <li>
            Elasticsearch indexing errors &gt;0 → events being dropped; fingerprint
            grouping incomplete.
          </li>
          <li>
            Alert engine heartbeat missing &gt;90 seconds → alerting system down;
            send a dead-man&rsquo;s-switch alert to a secondary channel.
          </li>
          <li>
            Status page webhook delivery failure → page is showing stale status;
            send to a backup delivery channel.
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          These meta-alerts route to a dedicated <code>#monitoring-health</code>
          Slack channel and to a separate on-call rotation from the application
          on-call, preventing the monitoring team from being paged during an
          application incident they are already working on.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>All-in-One (Datadog) vs. Best-of-Breed</h3>
        <HighlightBlock as="p" tier="important">
          Platforms like Datadog, New Relic, and Dynatrace provide metrics, logs,
          traces, error tracking, and alerting in a single product with tight
          cross-signal linking. The advantages: fast setup, unified query language,
          out-of-the-box correlation. The disadvantages: high cost at scale (Datadog
          pricing is per-host and per-GB), vendor lock-in, and reduced control over
          data retention and processing. Best-of-breed (Prometheus + Elasticsearch +
          Jaeger + Sentry) is more complex to operate but cheaper at scale and more
          flexible. The correct choice depends on team size: &lt;20 engineers → all-in-
          one; &gt;50 engineers with dedicated platform team → best-of-breed.
        </HighlightBlock>

        <h3>Real-Time Alerting vs. Batch Anomaly Detection</h3>
        <p>
          Real-time PromQL rule evaluation (every 30 seconds) provides low latency
          but requires manual threshold tuning. ML anomaly detection adapts to
          seasonality automatically but introduces model training complexity and
          false positive risk during unusual traffic events (product launches,
          marketing campaigns). The two approaches are complementary: static
          thresholds catch obvious regressions fast, ML detects subtle drift that
          static thresholds would miss or that would require impractically low
          thresholds to catch.
        </p>

        <h3>Session Replay Privacy Implications</h3>
        <HighlightBlock as="p" tier="crucial">
          Session replay tools (LogRocket, FullStory, Hotjar) record user
          interactions and DOM state. This is enormously useful for debugging but
          creates privacy and regulatory risks: GDPR requires a lawful basis for
          this processing; HIPAA prohibits capturing PHI. Mitigations: mask all
          input fields by default (opt-in masking rather than opt-in recording);
          exclude specific URL patterns containing sensitive data; provide a user
          opt-out mechanism; process recordings in a region that matches the user&rsquo;s
          data residency requirement.
        </HighlightBlock>

        <h3>Source Maps and Production Debugging</h3>
        <HighlightBlock as="p" tier="crucial">
          Minified JavaScript in production produces stack traces that are
          unreadable without source maps. Source maps should be uploaded to the
          error tracking service (Sentry) at deploy time, never served publicly
          (which would expose business logic). The pipeline: CI/CD builds →
          generates source maps → uploads to Sentry → source maps are not included
          in the CDN deployment. Sentry applies source maps server-side when
          displaying error stacks, exposing original file names and line numbers
          only to authenticated engineers.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          An effective incident and debugging dashboard converts a flood of raw
          signals into an actionable narrative: what broke, when, for whom, and
          why. The key design decisions are: unified ingestion via Kafka with
          <code>traceId</code> as the cross-signal correlation key; error grouping
          by normalised stack fingerprint for impact-first triage; dual alerting
          (static thresholds for fast detection, ML anomaly for subtle drift);
          a five-step drill-down path from alert to root cause in under 10 minutes;
          an independent status page that survives the incidents it describes; and
          auto-drafted postmortems to accelerate learning. At staff level, the
          insight is that observability is not the same as monitoring: monitoring
          tells you something is wrong, observability tells you <em>why</em>—and
          the difference is the quality of the correlation between signals.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
