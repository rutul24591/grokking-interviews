"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-feature-usage-analytics-dashboard",
  title: "Design a Feature Usage Analytics Dashboard",
  description: "Principal-level operational product system design covering permissions, workflow state, analytics correctness, privacy, auditability, and support recovery.",
  category: "high-level-design",
  subcategory: "other",
  slug: "feature-usage-analytics-dashboard",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-05-29",
  tags: ["hld", "operations", "dashboard", "privacy", "analytics", "support"],
  relatedTopics: [],
};

const definition = [
  "Design a Feature Usage Analytics Dashboard is an operational product system where the UI represents sensitive workflow, customer state, analytics state, or security state. A principal-ready design treats a feature usage analytics dashboard as a governed control surface, not a generic dashboard.",
  "The design must define who can see what, who can change what, which data is authoritative, which views are projections, how actions are audited, and how operators recover from bad data or bad actions.",
  "These systems often sit close to privacy, compliance, support, and business decision-making. A wrong metric, wrong support action, wrong session revocation, or wrong export can cause customer harm even if the UI looks correct.",
  "A strong answer should cover lifecycle state, permissions, workflow ownership, data freshness, auditability, abuse prevention, cost, and observability. The dashboard should help users make safe decisions, not merely display tables.",
  "Operational systems also need support reconstruction. When a customer disputes an action, a user reports a session, or a business metric changes, the system should show source data, transformations, actor decisions, and policy versions."
];
const concepts = [
  "The first concept is authority versus projection. event collector, identity mapper, and metric store may feed the UI, but derived summaries should not be mistaken for source-of-truth state.",
  "The second concept is scoped access. Support agents, analysts, admins, researchers, and customers should see different fields and actions. Field-level redaction and action-level authorization are often required.",
  "The third concept is workflow state. Cases, sessions, metrics, surveys, exports, escalations, and revocations need explicit lifecycle states and audit trails.",
  "The fourth concept is data quality. Operational dashboards must show freshness, sampling, confidence, known gaps, and delayed sources. Users should not make decisions from stale projections without knowing it.",
  "The fifth concept is abuse and misuse. Internal tools are powerful. They need rate limits, approvals, break-glass controls, anomaly detection, and review for high-risk actions.",
  "The sixth concept is observability. Track queue age, action success, stale data, export volume, permission denials, support overrides, metric freshness, and user-impacting errors."
];
const architecture = [
  "The architecture contains event collector, identity mapper, metric store, segmentation engine, owner workflow. Source systems emit durable events or records. Processing builds read models and aggregates. The UI enforces permissions, shows workflow state, and records user actions. Audit and observability systems make decisions reviewable.",
  "Every sensitive action should include actor, target, reason, policy version, correlation ID, before/after state where appropriate, and whether approval or break-glass was used.",
  "Read models should be versioned and freshness-aware. A dashboard row should be able to explain its source timestamp and transformation pipeline so users know if they are seeing current state or delayed analytics.",
  "The frontend should show explicit states: pending, stale, escalated, approved, revoked, exported, suppressed, anonymized, sampled, or failed. These states reduce unsafe manual interpretation.",
  "Exports and bulk actions require stronger controls than ordinary reads. They should have scoped filters, preview, row count, approval, audit, retention, and revocation or expiration where possible.",
  "Operations need replay, backfill, redaction, export disablement, action rollback or compensation, and support-visible history when something goes wrong."
];
const tradeoffs = [
  "Centralized dashboards improve governance and consistency but can become bottlenecks for teams that need custom workflows. Extensible dashboards improve team autonomy but increase permission, privacy, and quality risk.",
  "Real-time data improves operational response but increases cost and can create noisy, unstable metrics. Batch data is cheaper and more stable but can be too stale for support or security decisions.",
  "Detailed views help experts resolve issues but can expose unnecessary personal data. Progressive disclosure and field-level permissions are better than one all-powerful screen.",
  "Self-service exports and bulk actions reduce operational load but increase blast radius. Dry runs, approvals, quotas, and audit trails make self-service safer.",
  "Sampling lowers analytics cost and privacy exposure but can mislead small segments. The UI should show when metrics are sampled, estimated, or below confidence thresholds.",
  "Rollback is not always deletion. Support actions, survey exports, session revocations, and analytics corrections may require compensating actions and audit notes rather than silent reversal."
];
const practices = [
  "Model lifecycle state explicitly and make it visible. Avoid ambiguous active, done, or resolved flags without transition history.",
  "Use least privilege, field-level redaction, scoped actions, and approval for high-risk operations.",
  "Show freshness and provenance. Users should know when data was collected, transformed, sampled, anonymized, or delayed.",
  "Record audit logs for reads of sensitive data, exports, bulk actions, overrides, revocations, escalations, and support notes.",
  "Design safe exports: purpose, scope, retention, recipient, expiration, and download audit should be part of the workflow.",
  "Build repair tools for stuck workflows, bad aggregations, duplicate responses, stale sessions, and incorrect support actions.",
  "Instrument both product and operator outcomes: queue age, resolution quality, false positives, metric trust, export volume, and customer-impacting mistakes."
];
const pitfalls = [
  "PII in events is usually a governance failure. The dashboard should not expose every field to every operator just because the backend has it.",
  "metric drift often happens when workflow state and ownership are weak. Escalation, approval, and assignment should be explicit and observable.",
  "sampling bias causes bad decisions because users trust dashboards. Freshness, sampling, and source gaps should be visible.",
  "high-cardinality cost requires audit and blast-radius controls. Powerful internal tools are abuse surfaces even when all users are employees.",
  "Another pitfall is treating exports as harmless. Exports are often where privacy, compliance, and leakage risks concentrate.",
  "Teams also forget that analytics and support data need deletion, retention, and redaction policies, not only technical storage."
];
const useCases = [
  "product adoption dashboard needs scoped access, source-of-truth clarity, workflow state, auditability, and operational recovery.",
  "enterprise usage reporting needs scoped access, source-of-truth clarity, workflow state, auditability, and operational recovery.",
  "feature retirement analysis needs scoped access, source-of-truth clarity, workflow state, auditability, and operational recovery.",
  "During an incident, operators should see affected users, source freshness, action history, and safe remediation controls without gaining unnecessary data access.",
  "During a privacy request, the system should identify derived records, exports, notes, and audit obligations rather than only deleting one primary row.",
  "During a metric dispute, the dashboard should support drill-down to event definitions, sampling policy, identity stitching, and transformation version."
];
const questions = [
  {
    "question": "How would you design a feature usage analytics dashboard end to end?",
    "answer": "I would model authoritative source records, read-optimized projections, scoped permissions, workflow state, audit logs, and operational repair paths. The UI shows provenance, freshness, and allowed actions. Sensitive reads, exports, bulk operations, and overrides are audited. Background pipelines build aggregates, while support tools let operators repair or explain bad state."
  },
  {
    "question": "Why this architecture over a simple dashboard on top of database tables?",
    "answer": "A simple dashboard exposes data but does not encode permissions, workflow, provenance, audit, privacy, freshness, or safe actions. Operational systems need a governed control plane because users make decisions that affect customers, security, or business metrics."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are PII in events, metric drift, sampling bias, high-cardinality cost, plus stale aggregates, high-cardinality cost, export abuse, permission drift, queue backlogs, and support overload. Prevention requires scoped access, lifecycle state, freshness indicators, audit, sampling strategy, and operational repair tools."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Authoritative customer, session, workflow, support, and consent state needs server-controlled consistency. Analytics aggregates, dashboards, survey summaries, and derived timelines can be eventually consistent if they show freshness and provenance. Sensitive actions should not rely solely on stale read models."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled through replay, backfill, repair queues, redaction, and compensating actions. Rollback may be action reversal or an audited correction. Abuse is controlled with least privilege, approvals, quotas, and anomaly detection. Privacy uses minimization, redaction, retention, and export controls. Cost is controlled by sampling and aggregate design. Observability tracks freshness, workflow lag, action errors, export volume, and permission denials."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would separate source truth from dashboards and argue that operational users need provenance and scoped action controls. I would defend eventual consistency for aggregates, but not for high-risk support or security actions. I would also defend audit and approvals because internal tools have real blast radius."
  }
];
const references = [
  {
    "label": "OWASP Logging Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
  },
  {
    "label": "NIST Privacy Framework",
    "href": "https://www.nist.gov/privacy-framework"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "OpenTelemetry documentation",
    "href": "https://opentelemetry.io/docs/"
  },
  {
    "label": "WCAG accessibility standards",
    "href": "https://www.w3.org/WAI/standards-guidelines/wcag/"
  }
];

export default function FeatureUsageAnalyticsDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Feature Usage Analytics Dashboard around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Feature Usage Analytics Dashboard, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 3 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/other/feature-usage-analytics-dashboard.svg" alt="Design a Feature Usage Analytics Dashboard architecture" caption="Architecture view: source systems, projections, permissions, workflow, audit, and operations." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/other/feature-usage-analytics-dashboard-flow.svg" alt="Design a Feature Usage Analytics Dashboard flow" caption="Flow view: intake, validation, decision, action, audit, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/other/feature-usage-analytics-dashboard-operations.svg" alt="Design a Feature Usage Analytics Dashboard operations" caption="Operations view: freshness, privacy, export controls, repair tools, and support reconstruction." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
