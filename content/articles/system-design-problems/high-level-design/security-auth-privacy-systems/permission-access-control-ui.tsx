"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-permission-access-control-ui",
  title: "Design a Permission and Access Control UI",
  description: "Principal-level security, authentication, authorization, and privacy system design covering trust boundaries, policy consistency, abuse resistance, auditability, rollback, and observability.",
  category: "high-level-design",
  subcategory: "security-auth-privacy-systems",
  slug: "permission-access-control-ui",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "security", "auth", "privacy", "policy", "audit"],
  relatedTopics: [],
};

const definition = [
  "Design a Permission and Access Control UI is a high-stakes product system because mistakes create account takeover, data exposure, compliance violations, or permanent loss of user trust. A principal-ready design treats a permission and access control UI as a trust boundary, not as a form or settings page.",
  "The design must cover identity proof, authorization, session lifecycle, consent or policy state, auditability, abuse resistance, operational controls, and user recovery. The visible UI is only one part of the system; the harder work is making sure every backend and derived surface obeys the same security decision.",
  "A good answer starts by naming assets and attackers. Assets include accounts, tokens, permissions, private data, consent records, audit logs, recovery channels, and administrative power. Attackers include credential stuffers, malicious insiders, compromised devices, automation, phishing kits, and confused legitimate users.",
  "Security systems also have product trade-offs. Strong controls reduce risk but can lock out real users, add friction, increase support cost, and create accessibility issues. Weak controls improve conversion but increase abuse and breach risk. Principal-level design explains where the system steps up friction and where it preserves usability.",
  "The design should assume incidents happen. Tokens leak, permissions are misconfigured, consent pipelines lag, and users lose devices. The architecture must support revocation, rollback, audit reconstruction, customer support, and forensics without exposing more sensitive data."
];
const concepts = [
  "The first concept is explicit trust boundary modeling. policy engine, role graph, and resource scope must define who can make a decision, what evidence they use, and how that decision is propagated to downstream systems.",
  "The second concept is least privilege. Users, services, admin roles, tokens, and support tools should receive the minimum permission needed for the task, scoped by resource, tenant, action, device, time, and risk.",
  "The third concept is lifecycle state. Credentials, sessions, roles, consent records, devices, recovery methods, and audit entries are not static. They are created, verified, rotated, expired, revoked, reviewed, and sometimes legally retained.",
  "The fourth concept is consistency. Security decisions need stronger consistency than ordinary personalization. A revoked session, removed permission, deleted consent, or blocked account should stop taking effect quickly across API, UI, notification, search, export, and background job surfaces.",
  "The fifth concept is abuse-aware UX. Attackers exploit error messages, retry behavior, recovery flows, and notification fatigue. The UI should help legitimate users recover while avoiding enumeration, social engineering, or repeated prompt attacks.",
  "The sixth concept is privacy-safe observability. Security systems need detailed audit and telemetry, but logs must not contain passwords, raw tokens, full secrets, unnecessary personal data, or sensitive consent payloads."
];
const architecture = [
  "The architecture has five major planes: policy engine, role graph, resource scope, approval workflow, audit log. The request path asks for a decision; the policy or risk plane evaluates context; the state plane persists durable records; the enforcement plane applies the decision consistently; and the audit plane records enough evidence for review and incident response.",
  "Every sensitive action should carry actor, resource, tenant, device, session, risk score, policy version, and correlation ID. This context lets the system explain why a decision happened and lets operators find all affected records during an incident.",
  "The frontend should avoid becoming the source of truth. It can explain choices, collect user intent, and show recovery state, but the backend must enforce authorization, consent, token validity, and session state. Hiding a button is not access control.",
  "Security state should be versioned. Policy versions, consent versions, role graph versions, token key versions, and session risk versions help the system reason about stale decisions and roll back bad changes.",
  "The system should support emergency controls: revoke all sessions for a user or tenant, disable a risky recovery method, roll back a bad permission template, pause a consent sync, or force step-up authentication for a suspicious cohort.",
  "The diagrams for this article should be read as architecture, flow, and operations views: decision boundary, user journey, and incident/recovery control loop."
];
const tradeoffs = [
  "Centralized policy evaluation gives consistent decisions and auditability, but it can become a latency or availability dependency. Distributed checks are faster locally but harder to audit and easier to make inconsistent. Mature systems centralize policy definitions while caching short-lived decisions safely at enforcement points.",
  "Short-lived tokens limit replay damage but increase refresh traffic and can degrade UX during network or provider issues. Long-lived sessions improve usability but increase risk after device compromise. A defensible design uses short access tokens, rotated refresh tokens, device binding where appropriate, and risk-based step-up.",
  "Strict security prompts reduce abuse but can train users to approve blindly. Step-up authentication should be risk-based and explain why it appears, not triggered on every sensitive action without context.",
  "Fail-closed is safer for sensitive operations but can create outages for legitimate users if a policy service fails. Fail-open improves availability but can expose data. The answer should classify operations: viewing public content may degrade open; admin actions, private data, payment, and permission changes should fail closed or require cached proof.",
  "Detailed audit logs improve forensics but create privacy and retention risks. Logs should be immutable enough for trust, minimized enough for privacy, and governed by access controls and retention policy.",
  "Automation reduces support cost but can worsen lockout or consent mistakes at scale. Human review is slower but necessary for high-impact recovery, break-glass access, and disputed security events."
];
const practices = [
  "Model every sensitive flow as a state machine with explicit transitions, expiry, revocation, and audit entries. Avoid ambiguous booleans such as active or verified without transition history.",
  "Use defense in depth. UI gating, API authorization, database row filters, service-to-service authorization, and audit monitoring should all reinforce the same policy instead of relying on one layer.",
  "Protect recovery flows as strongly as login flows. Email change, phone change, password reset, backup code regeneration, device removal, and account deletion are attacker targets.",
  "Use idempotency and replay protection for security actions. Repeated clicks or retries should not create duplicate recovery tokens, conflicting consent records, or inconsistent role assignments.",
  "Segment security telemetry by actor type, tenant, resource class, risk score, geography, device, and release. Watch for spikes in denial rate, challenge rate, recovery attempts, permission changes, token refresh failures, and consent sync lag.",
  "Build support and forensic tooling from the start. Operators need safe views of decision history, policy versions, device history, token family state, consent lineage, and admin actions without exposing secrets.",
  "Exercise incident playbooks. Test mass token revocation, compromised admin role rollback, consent propagation delay, policy misconfiguration, suspicious login spikes, and third-party identity provider outage."
];
const pitfalls = [
  "privilege creep is usually a sign that the design treats security as a single endpoint instead of a control loop with detection, throttling, challenge, and recovery.",
  "stale entitlement often comes from UX that optimizes completion over risk explanation. Users need enough context to make safe decisions without exposing sensitive signals to attackers.",
  "confused deputy can happen when error messages, policy caches, or derived surfaces reveal information that the primary API intended to hide.",
  "break-glass abuse requires explicit audit and rollback controls. Emergency access and recovery paths are necessary, but they are also high-risk and must be observable.",
  "Another pitfall is logging secrets for debugging. Tokens, reset links, passwords, consent payloads, and private resource names should not appear in client logs, server logs, or analytics beacons.",
  "Teams also underestimate eventual consistency. If a permission is revoked but search exports, notifications, cached pages, or background jobs still use old access, the system has a security bug even if the main API is correct."
];
const useCases = [
  "admin RBAC requires the system to balance usability, security, auditability, and recovery rather than applying one static rule to every user.",
  "document sharing requires the system to balance usability, security, auditability, and recovery rather than applying one static rule to every user.",
  "enterprise app permissions requires the system to balance usability, security, auditability, and recovery rather than applying one static rule to every user.",
  "During a suspected account takeover, the system should revoke risky sessions, preserve forensic evidence, notify the user safely, require step-up authentication, and avoid leaking attacker-controlled details.",
  "During a policy misconfiguration, operators should identify affected resources, roll back the policy version, invalidate cached decisions, and audit which actions occurred under the bad policy.",
  "During a privacy request or consent change, downstream systems should receive durable events and report completion or exceptions. A settings UI update alone is not enough."
];
const questions = [
  {
    "question": "How would you design a permission and access control UI end to end?",
    "answer": "I would start with assets, actors, trust boundaries, and attacker capabilities. Then I would design the decision path around policy engine, role graph, resource scope, approval workflow, audit log. The frontend collects intent and shows safe recovery state, but backend enforcement owns policy. Durable state includes decision evidence, policy version, token or consent lineage, and audit logs. Operations require revocation, rollback, support visibility, anomaly detection, and incident playbooks."
  },
  {
    "question": "Why this architecture over UI-only gating or scattered checks?",
    "answer": "UI-only gating is not security, and scattered checks drift across teams. Central policy definitions with enforcement at APIs and data boundaries give consistency and auditability. The trade-off is latency and availability risk, so enforcement points may cache short-lived decisions with policy versions and fail-closed for sensitive actions."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are privilege creep, stale entitlement, confused deputy, break-glass abuse, plus policy cache drift, support overload, token refresh storms, audit-log volume, cross-tenant leaks, and delayed revocation. Prevention requires rate limits, lifecycle state, policy versioning, immutable audit, risk scoring, and operational controls."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Security and privacy decisions need stronger consistency than ordinary product preferences. Revocation, permission removal, account restriction, and consent withdrawal should propagate quickly to APIs, caches, exports, notifications, and background jobs. Some audit aggregation and risk scoring can be eventually consistent, but enforcement should not depend on stale derived summaries."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with safe default policy, cached proof where appropriate, step-up flows, support-visible state, and emergency revocation. Rollback uses policy version rollback, key rotation, token family invalidation, and cache invalidation. Abuse is controlled with rate limits, risk scoring, and recovery hardening. Privacy requires minimization in logs and telemetry. Cost is managed through sampling and tiered audit retention. Observability tracks decision rates, denial rates, challenge rates, revocation lag, and suspicious activity."
  },
  {
    "question": "How do you defend the trade-offs under interviewer pressure?",
    "answer": "I would classify operations by sensitivity and failure mode. Public or low-risk reads can degrade, but admin actions, private data, identity changes, permission changes, and token issuance need strong enforcement. I would defend extra complexity because the cost of a privacy or account-takeover incident is higher than the cost of central policy, audit, and rollback infrastructure."
  }
];
const references = [
  {
    "label": "OWASP Authentication Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
  },
  {
    "label": "OWASP Session Management Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
  },
  {
    "label": "NIST SP 800-63 Digital Identity Guidelines",
    "href": "https://pages.nist.gov/800-63-3/"
  },
  {
    "label": "OAuth 2.0 Security Best Current Practice",
    "href": "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "GDPR text and guidance",
    "href": "https://gdpr.eu/"
  }
];

export default function PermissionAccessControlUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Permission and Access Control UI around identity proof, authorization boundaries, session lifecycle, consent, auditability, and privacy-by-design. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: every sensitive action must be authorized at the boundary where it is performed, not only where the UI is rendered.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Permission and Access Control UI, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 3 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: token storage, session revocation, RBAC/ABAC model, consent state, audit log schema, threat model, and privacy retention.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/permission-access-control-ui.svg" alt="Design a Permission and Access Control UI architecture" caption="Architecture view: trust boundary, policy decision, enforcement point, state store, and audit/control plane." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/permission-access-control-ui-flow.svg" alt="Design a Permission and Access Control UI flow" caption="Flow view: user intent, risk decision, policy enforcement, user recovery, and incident response." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/permission-access-control-ui-operations.svg" alt="Design a Permission and Access Control UI operations" caption="Operations view: revocation, rollback, suspicious activity, privacy propagation, and forensic auditability." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: auth failure rate, revocation latency, permission denial accuracy, suspicious activity, consent coverage, and audit completeness.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: confused deputy access, stale permissions, token replay, consent drift, insecure local storage, and unverifiable audit events.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
