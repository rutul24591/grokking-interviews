"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-embeddable-analytics-sdk",
  title: "Design an Embeddable Analytics SDK",
  description: "Principal-level platform, SDK, and infrastructure system design covering versioned contracts, isolation, rollout, extensibility, observability, rollback, and governance.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "embeddable-analytics-sdk",
  wordCount: 3600,
  readingTime: 22,
  lastUpdated: "2026-05-29",
  tags: ["hld", "platform", "sdk", "infrastructure", "governance", "observability"],
  relatedTopics: [],
};

const definition = [
  "Design an Embeddable Analytics SDK is a platform system, which means the product is not only the UI that users see but also the contract other teams, tenants, developers, plugins, SDKs, or automation depend on. A principal-ready design treats an embeddable analytics SDK as a versioned control plane with operational guarantees.",
  "The design must define ownership boundaries, compatibility rules, tenant isolation, permission enforcement, rollout mechanics, observability, rollback, and support operations. Platform systems fail differently from normal product screens because a bad release can break many downstream teams or external customers at once.",
  "The visible dashboard or SDK should be backed by durable state: configuration versions, release channels, manifests, audit logs, policy decisions, dependency graph, tenant scopes, and operational history. Derived views such as impact analysis, metrics, install status, and rollout health can lag if they are observable and repairable.",
  "A staff/principal answer should make the platform contract explicit. Who can publish? Who can install? What is backward compatible? What happens when a plugin, SDK, flag, deployment, token, or tenant job misbehaves? How do teams roll back without corrupting customer state?",
  "The design should also include governance. Platform features need approvals, blast-radius limits, staged rollout, auditability, and usage visibility because they frequently grant power to other teams or external developers."
];
const concepts = [
  "The first concept is contract-first design. collector runtime, event buffer, and privacy filter should expose stable schemas, versioned APIs, documented lifecycle states, and compatibility guarantees. Hidden contracts are what make platform migrations painful.",
  "The second concept is isolation. Tenants, projects, plugins, SDK integrations, build jobs, and admin actions should be scoped so a mistake or malicious actor cannot affect unrelated users. Isolation applies to data, permissions, compute, rollout, and telemetry.",
  "The third concept is versioning and rollout. Platform artifacts should support draft, approved, staged, active, deprecated, and rolled-back states. The UI should show which version is used where and who owns it.",
  "The fourth concept is operational feedback. A platform UI should not only let users change state; it should show health, lag, adoption, errors, blast radius, and rollback readiness before and after the change.",
  "The fifth concept is permission and audit. Admin actions, SDK configuration, plugin install, feature rollout, tenant bulk jobs, and deployment changes should be authorized, recorded, reviewable, and reversible where possible.",
  "The sixth concept is developer experience. Good platform systems reduce cognitive load with safe defaults, schema validation, preview environments, dry runs, examples, error explanations, and migration guidance."
];
const architecture = [
  "The architecture contains collector runtime, event buffer, privacy filter, delivery endpoint, tenant config. The control plane stores configuration, versions, ownership, approvals, and audit. The execution plane applies changes through SDKs, plugins, build systems, rollout engines, or tenant jobs. The observability plane measures impact and supports rollback.",
  "Every change should have an identity: actor, target scope, version, policy decision, approval state, rollout percentage, dependency impact, and correlation ID. Without this metadata, support and incident response cannot reconstruct what happened.",
  "The frontend should render lifecycle state explicitly: draft, validating, approved, staged, active, partially rolled out, blocked, deprecated, failed, or rolled back. Platform users need to understand whether a change is safe to proceed, not just whether a form submitted.",
  "The system should support dry-run or preview. Before applying a flag, plugin install, tenant bulk job, deployment, SDK config, or component release, users should see affected projects, tenants, permissions, compatibility warnings, and estimated blast radius.",
  "Rollback should be designed as a product path. Some state can be reverted directly; some requires compensating changes; some must be disabled at runtime while data cleanup happens asynchronously. The UI should make these differences visible.",
  "Platform observability should connect user-visible changes to downstream symptoms: SDK errors, plugin crashes, build failures, tenant job failures, RUM regressions, permission denials, adoption metrics, and support tickets."
];
const tradeoffs = [
  "Centralized platforms improve consistency, governance, and reuse, but they can become bottlenecks if every team waits for the platform team. Extensibility and self-service reduce bottlenecks but increase policy and compatibility risk.",
  "Strict compatibility protects consumers but slows innovation. Fast-moving APIs or components let teams ship quickly but create migration debt. Mature platforms define support windows, deprecation workflows, and compatibility tests.",
  "Runtime configuration gives fast rollback and experimentation, but it creates distributed state that can drift across SDK caches, edge nodes, tenants, and clients. Build-time configuration is simpler but slower to change during incidents.",
  "Plugin and extension ecosystems increase platform value but introduce supply-chain, permission, performance, and trust risks. Sandboxing, manifest review, version pinning, and kill switches are not optional.",
  "High-cardinality observability improves debugging but can become expensive and privacy-sensitive. Principal designs sample intelligently, aggregate by stable dimensions, and restrict raw event access.",
  "Self-service bulk operations improve admin productivity but can create large blast radius. Dry runs, approvals, quotas, staged execution, pause/resume, and audit logs are the trade-off that makes self-service safe."
];
const practices = [
  "Represent platform artifacts with explicit lifecycle state, owner, version, scope, dependencies, approval, rollout status, and audit history.",
  "Build validation into authoring. Catch schema errors, permission violations, dependency breaks, accessibility regressions, privacy issues, and compatibility problems before publish or install.",
  "Use staged rollout and blast-radius limits. Platform changes should support canary, tenant allowlists, percentage rollout, automatic stop on guardrail failures, and one-click disable where safe.",
  "Keep execution idempotent. Deployments, plugin installs, SDK config updates, tenant bulk jobs, and flag changes should converge after retries rather than duplicate work.",
  "Enforce least privilege. Extensions, support tools, admin dashboards, SDK keys, and workflow runners should receive narrow scoped permissions with audit trails.",
  "Expose operational truth in the UI. Users should see queue state, rollout health, adoption, errors, stale clients, incompatible versions, and rollback options.",
  "Design support tooling. Operators need to inspect which version, plugin, flag, token, deployment, or tenant job affected a customer without querying raw databases."
];
const pitfalls = [
  "event loss usually means the platform lacks compatibility gates, staged rollout, or blast-radius controls. Platform failures multiply because many teams depend on one surface.",
  "PII capture often comes from treating permissions or integration boundaries as documentation instead of enforceable runtime policy.",
  "host performance regression is a state-distribution problem. SDK caches, build artifacts, edge nodes, tenants, and clients may observe different versions unless the design tracks propagation and freshness.",
  "ad blocker interference requires rollback and audit. Platform users should know whether they can disable, revert, compensate, or escalate the issue.",
  "Another pitfall is measuring adoption without measuring harm. A platform can be widely used and still create latency, privacy, accessibility, compatibility, or support problems.",
  "Teams also forget deprecation. Old SDKs, plugins, components, flags, and deployment settings remain in production long after the happy-path migration guide is written."
];
const useCases = [
  "product analytics snippet requires versioned contracts, safe rollout, scoped permissions, observability, and a clear rollback path.",
  "RUM SDK requires versioned contracts, safe rollout, scoped permissions, observability, and a clear rollback path.",
  "partner tracking SDK requires versioned contracts, safe rollout, scoped permissions, observability, and a clear rollback path.",
  "During a bad rollout, the system should identify affected tenants or projects, stop further rollout, disable the runtime path if possible, and preserve audit evidence.",
  "During a compatibility break, owners should see consumers, version usage, failing checks, migration status, and deprecation deadlines.",
  "During an abuse or supply-chain incident, the platform should revoke permissions, disable extensions or keys, notify affected owners, and support forensic review."
];
const questions = [
  {
    "question": "How would you design an embeddable analytics SDK end to end?",
    "answer": "I would model it as a platform control plane plus execution plane. The control plane stores versions, ownership, permissions, approvals, rollout state, and audit history. The execution plane applies changes through SDKs, plugins, workflows, deployments, tenant jobs, or runtime config. The UI supports validation, preview, staged rollout, health monitoring, and rollback. Observability connects platform changes to downstream customer impact."
  },
  {
    "question": "Why this architecture over a simple admin dashboard or SDK config page?",
    "answer": "A simple dashboard can mutate state but cannot safely manage platform contracts, compatibility, blast radius, tenant isolation, approvals, or rollback. Platform systems need lifecycle and governance because one change can affect many downstream consumers. The additional control-plane complexity is justified by operational risk."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are event loss, PII capture, host performance regression, ad blocker interference, plus stale clients, incompatible versions, high-cardinality telemetry, queue backlogs, cross-tenant leakage, support overload, and uncontrolled blast radius. Prevention requires versioning, validation, staged rollout, idempotent execution, scoped permissions, and observability."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Authoritative configuration, permissions, ownership, approvals, and audit entries need strong server-controlled consistency. Runtime propagation to SDKs, edge nodes, build systems, dashboards, and tenants is often eventually consistent, but it must expose version and freshness. Rollback should target both control-plane state and distributed runtime state."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with dry runs, staged rollout, automatic guardrails, pause/resume, and rollback controls. Abuse is handled through least privilege, sandboxing, review, and key/plugin revocation. Privacy requires scoped telemetry and data minimization. Cost is controlled through sampling, quotas, batch execution, and cardinality limits. Observability tracks rollout health, adoption, error rates, stale versions, queue lag, and customer impact."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would argue that platform surfaces are leverage points, so governance is not bureaucracy; it is blast-radius control. I would defend self-service only when paired with validation, approvals for high-risk changes, staged rollout, and rollback. I would also distinguish authoritative control-plane consistency from eventually consistent runtime propagation."
  }
];
const references = [
  {
    "label": "OpenTelemetry documentation",
    "href": "https://opentelemetry.io/docs/"
  },
  {
    "label": "W3C Web Components",
    "href": "https://www.w3.org/TR/components-intro/"
  },
  {
    "label": "OWASP Third Party JavaScript Management Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "WCAG accessibility standards",
    "href": "https://www.w3.org/WAI/standards-guidelines/wcag/"
  },
  {
    "label": "Cloudflare Workers platform docs",
    "href": "https://developers.cloudflare.com/workers/"
  }
];

export default function EmbeddableAnalyticsSdkArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design an Embeddable Analytics SDK around developer platform contract, tenant isolation, extensibility, backwards compatibility, and operational governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: integrators must be able to build on stable contracts without inheriting internal platform instability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design an Embeddable Analytics SDK, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 2 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: versioning, plugin sandboxing, SDK lifecycle, observability schema, tenant boundaries, migration path, and support windows.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/embeddable-analytics-sdk-architecture.svg" alt="Design an Embeddable Analytics SDK architecture" caption="Architecture view: control plane, execution plane, permissions, versioning, and observability boundaries." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/embeddable-analytics-sdk-delivery-flow.svg" alt="Design an Embeddable Analytics SDK flow" caption="Flow view: authoring, validation, rollout, execution, health checks, and rollback." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/embeddable-analytics-sdk-privacy.svg" alt="Design an Embeddable Analytics SDK operations" caption="Operations view: blast radius, stale versions, abuse controls, cost, privacy, and support reconstruction." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: SDK adoption, integration success rate, error budgets, version skew, migration completion, and tenant-level reliability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: breaking changes, unsafe extensions, unowned APIs, noisy tenants, missing provenance, and rollback requiring customer coordination.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
