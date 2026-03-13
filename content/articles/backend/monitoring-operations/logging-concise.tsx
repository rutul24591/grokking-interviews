"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-logging-extensive",
  title: "Logging",
  description: "Building structured, useful logs that enable debugging and auditability.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "logging",
  wordCount: 852,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'monitoring', 'logging'],
  relatedTopics: ['log-aggregation', 'observability', 'error-budgets'],
};

export default function LoggingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Logging records discrete events with context. Logs are essential for debugging, auditing, and forensics, especially when metrics show that something is wrong but not why.</p>
        <p>In distributed systems, logs must be structured and correlated. Raw text streams do not scale to incident response where you need fast filtering and pivots.</p>
      </section>

      <section>
        <h2>What Good Looks Like</h2>
        <p>Good logging makes rare failures explainable: you can find a failing request by id, reconstruct what happened, and identify which input pattern or dependency caused it.</p>
        <p>Good also means safety and cost control: sensitive fields are redacted, volumes are budgeted, and retention aligns with compliance needs.</p>
      </section>

      <section>
        <h2>Architecture and Workflows</h2>
        <p>The flow is emit structured events, ship them reliably, parse/enrich, then index or store by retention tier. Correlation identifiers (request id, trace id) are the glue.</p>
        <p>A stable schema is a force multiplier. If fields drift, queries and incident workflows break at the worst possible time.</p>
        <ul className="mt-4 space-y-2">
          <li>Structured logging library with a shared schema and required fields.</li>
          <li>Redaction and allowlists for sensitive data.</li>
          <li>Shipping agents with buffering and backpressure.</li>
          <li>Central storage with search, retention tiers, and access control.</li>
          <li>Correlation with traces and metrics via shared ids.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/logging-diagram-1.svg" alt="Logging architecture diagram" caption="Logging architecture and data flow." />
      </section>

      <section>
        <h2>Signals and Measurement</h2>
        <p>Logging signals are about pipeline health and usefulness: can you ingest during spikes, can you search quickly, and can you correlate to the failing request.</p>
        <p>Treat logging as a production dependency. If logs are unavailable during incidents, you lose the fastest path to root cause.</p>
        <ul className="mt-4 space-y-2">
          <li>Ingestion lag and drop rate during peak traffic.</li>
          <li>Parse error rate and schema drift indicators.</li>
          <li>Index growth and top sources of log volume.</li>
          <li>Search latency for common incident queries.</li>
          <li>Redaction failures and sensitive field detections.</li>
          <li>Correlation coverage: percent of logs with request/trace ids.</li>
        </ul>
      </section>

      <section>
        <h2>Failure Modes and Pitfalls</h2>
        <p>Logging failures either reduce signal (missing context) or create harm (PII leakage, runaway volume). Both degrade incident response and trust.</p>
        <p>The operational goal is to make logs reliable, safe, and fast to query under stress.</p>
        <ul className="mt-4 space-y-2">
          <li>Log storms that overload shippers or indices and make search unusable.</li>
          <li>Missing correlation ids that prevent cross-service pivots.</li>
          <li>PII leakage due to inconsistent redaction or ad-hoc logging.</li>
          <li>Schema drift that breaks dashboards and saved searches.</li>
          <li>Time skew or inconsistent timestamps that misorder event timelines.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/logging-diagram-2.svg" alt="Logging failure modes diagram" caption="Common failure paths for logging." />
      </section>

      <section>
        <h2>Operating Playbook</h2>
        <p>During incidents, logs should support narrowing the failing cohort quickly: filter by route, tenant, error code, and then pivot by correlation id.</p>
        <p>Playbooks should include emergency controls: sampling, log level reductions, and index protection to preserve searchability.</p>
        <ul className="mt-4 space-y-2">
          <li>Use a correlation id from a failing trace/request and fetch cross-service logs.</li>
          <li>Filter by error signatures and validate whether failures are input-driven or dependency-driven.</li>
          <li>If volumes spike, enable sampling for low-severity categories and preserve errors unsampled.</li>
          <li>Verify redaction and block sensitive fields at the library boundary.</li>
          <li>Capture missing fields as schema improvements and add regression tests in shared logging libs.</li>
        </ul>
      </section>

      <section>
        <h2>Governance and Trade-offs</h2>
        <p>More logs increase diagnosability but raise cost and risk. The best strategy is selective detail: preserve context on error paths and sample high-volume success paths.</p>
        <p>Governance ensures safety: schema standards, retention rules, and access controls prevent logging from becoming a liability.</p>
        <ul className="mt-4 space-y-2">
          <li>Full fidelity vs sampling: keep errors and security events, sample verbose success logs.</li>
          <li>Fast index search vs cheap archival: tier storage by incident value.</li>
          <li>Developer freedom vs schema discipline: shared libraries reduce drift.</li>
          <li>Debugging value vs compliance risk: redaction and auditing are mandatory.</li>
        </ul>
        <ArticleImage src="/diagrams/backend/monitoring-operations/logging-diagram-3.svg" alt="Logging governance diagram" caption="Governance and trade-offs for logging." />
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>An intermittent 500 appears only for one client version. Metrics show the spike but not the cause. Structured logs reveal a specific header value and a downstream timeout pattern.</p>
        <p>Responders add a temporary rate limit for that client cohort and roll out a fix. Afterward, they add a required log field for client version and a saved query that surfaces similar patterns quickly.</p>
        <p>A follow-up change introduces log budgets per service to prevent the next incident from being masked by index overload.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to keep the practice reliable and sustainable as the system grows.</p>
        <ul className="mt-4 space-y-2">
          <li>Use structured logs with required correlation fields.</li>
          <li>Enforce redaction at the logging library boundary.</li>
          <li>Budget log volume and protect indices from spikes.</li>
          <li>Define retention tiers and RBAC for sensitive logs.</li>
          <li>Monitor ingestion lag, drops, and parse errors.</li>
          <li>Review schema drift and update shared libraries.</li>
          <li>Practice incident workflows using saved searches.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Practice explaining your reasoning using a real system you have operated: name signals, thresholds, and the decision points.</p>
        <ul className="mt-4 space-y-2">
          <li>What fields do you require in every log line for a distributed system?</li>
          <li>How do you prevent PII leakage in logs?</li>
          <li>How do you keep log volume and cost under control?</li>
          <li>How do you use logs to debug intermittent failures?</li>
          <li>What failure modes exist in the log pipeline itself?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
