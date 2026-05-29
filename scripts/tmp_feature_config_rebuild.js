const fs = require("fs");
const path = require("path");

const articleDir = "content/articles/system-design-problems/high-level-design/feature-configuration-admin-systems";
const diagramDir = "public/diagrams/system-design-problems/high-level-design/feature-configuration-admin-systems";

const topics = [
  {
    slug: "dynamic-config-management-ui",
    title: "Design a Dynamic Config Management UI",
    product: "dynamic configuration management UI",
    domain: "dynamic configuration",
    users: "platform engineers, product operators, SREs, tenant admins, support engineers, and compliance reviewers",
    entities: "config keys, schemas, environments, tenant overrides, validation rules, approvals, versions, rollbacks, and audit events",
    architecture: ["Admin UI", "Schema Registry", "Validation API", "Approval Flow", "Config Store", "Propagation", "Audit Log"],
    flow: ["Draft Change", "Validate", "Review", "Publish", "Propagate", "Monitor", "Rollback"],
    risk: ["Bad Value", "Schema Drift", "Tenant Override", "Stale Cache", "Blast Radius", "Audit Gap", "Rollback"],
    refs: ["Spring Cloud Config concepts", "Consul KV documentation", "LaunchDarkly configuration concepts", "Google SRE book on configuration", "OWASP secure configuration guidance"],
  },
  {
    slug: "kill-switch-emergency-control-panel",
    title: "Design a Kill Switch & Emergency Control Panel",
    product: "kill switch and emergency control panel",
    domain: "emergency control",
    users: "incident commanders, SREs, release managers, security responders, support leads, and executives during incidents",
    entities: "kill switches, emergency actions, scoped targets, approval rules, execution records, blast-radius estimates, and rollback states",
    architecture: ["Emergency UI", "Policy Engine", "Action Registry", "Control API", "Propagation Bus", "Health Monitor", "Audit Trail"],
    flow: ["Detect Incident", "Select Control", "Estimate Impact", "Approve", "Execute", "Observe", "Revert"],
    risk: ["Wrong Scope", "Over-disable", "Privilege Abuse", "Slow Propagation", "Partial Apply", "No Revert", "Missing Audit"],
    refs: ["Google SRE book on incident response", "AWS fault isolation concepts", "LaunchDarkly kill switch guidance", "NIST incident response guidance", "OWASP access control guidance"],
  },
  {
    slug: "remote-app-configuration-system",
    title: "Design a Remote App Configuration System",
    product: "remote app configuration system",
    domain: "remote app configuration",
    users: "mobile engineers, web platform teams, release managers, growth teams, SREs, and support operators",
    entities: "remote config bundles, clients, SDK versions, targeting rules, fetch intervals, cache TTLs, signatures, and rollout channels",
    architecture: ["Config Authoring", "Bundle Builder", "Signing Service", "CDN", "Client SDK", "Telemetry", "Rollback Control"],
    flow: ["Author Rule", "Build Bundle", "Sign", "Distribute", "Fetch", "Evaluate", "Report"],
    risk: ["Old Client", "Bad Bundle", "Signature Fail", "CDN Stale", "Offline Device", "Rule Conflict", "Rollback"],
    refs: ["Firebase Remote Config documentation", "OpenFeature specification", "Apple app configuration patterns", "Cloudflare CDN caching docs", "Google SRE release engineering guidance"],
  },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(title, nodes, subtitle) {
  const colors = ["#DBEAFE", "#DCFCE7", "#FEF3C7", "#FCE7F3", "#E0E7FF", "#FFE4E6", "#CCFBF1"];
  let boxes = "";
  nodes.forEach((n, i) => {
    const x = 45 + i * 154;
    const y = 244;
    boxes += `
      <rect x="${x}" y="${y}" width="136" height="96" rx="10" fill="${colors[i % colors.length]}" stroke="#334155" stroke-width="2"/>
      <text x="${x + 68}" y="${y + 38}" text-anchor="middle" font-size="14" font-weight="700" fill="#0F172A">${esc(n)}</text>
      <text x="${x + 68}" y="${y + 64}" text-anchor="middle" font-size="12" fill="#334155">${esc(subtitle)}</text>
      ${i < nodes.length - 1 ? `<path d="M ${x + 136} ${y + 48} L ${x + 147} ${y + 48}" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/>` : ""}`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1180" height="620" viewBox="0 0 1180 620" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(title)}</desc>
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#334155"/></marker></defs>
  <rect width="1180" height="620" fill="#F8FAFC"/>
  <rect x="24" y="24" width="1132" height="572" rx="18" fill="#FFFFFF" stroke="#CBD5E1"/>
  <text x="590" y="76" text-anchor="middle" font-size="25" font-weight="800" fill="#0F172A">${esc(title)}</text>
  <text x="590" y="112" text-anchor="middle" font-size="15" fill="#475569">Configuration systems interview view: validate, publish, propagate, observe, and roll back safely.</text>
  ${boxes}
  <rect x="78" y="430" width="330" height="92" rx="12" fill="#F1F5F9" stroke="#94A3B8"/>
  <text x="243" y="462" text-anchor="middle" font-size="15" font-weight="700" fill="#0F172A">Governance</text>
  <text x="243" y="488" text-anchor="middle" font-size="13" fill="#334155">Schema, approval, audit, and ownership</text>
  <rect x="772" y="430" width="330" height="92" rx="12" fill="#F1F5F9" stroke="#94A3B8"/>
  <text x="937" y="462" text-anchor="middle" font-size="15" font-weight="700" fill="#0F172A">Safety</text>
  <text x="937" y="488" text-anchor="middle" font-size="13" fill="#334155">Scoped rollout, monitoring, and rollback</text>
</svg>`;
}

function p(text) {
  return `        <p>\n          ${text}\n        </p>`;
}

function componentName(slug) {
  return slug.split("-").map(x => x[0].toUpperCase() + x.slice(1)).join("") + "Article";
}

function article(t) {
  const sections = {
    definition: [
      `A ${t.product} lets ${t.users} change product or platform behavior without redeploying application code. It is powerful because it can mitigate incidents, customize tenants, and accelerate release operations, but it is dangerous because one bad value can affect many users instantly.`,
      `Principal-level design for ${t.domain} is not only an admin form. It must cover schema validation, blast-radius estimation, approval, versioning, propagation, caching, client compatibility, auditability, and rollback. Configuration is production control-plane data.`,
      `The scope includes authoring, validation, governance, runtime delivery, client evaluation, monitoring, emergency controls, and cleanup. The system should explain who can change what, how quickly changes propagate, how stale clients behave, and how operators prove what happened during an incident.`,
    ],
    core: [
      `The core entities are ${t.entities}. Every entity needs owner, environment, lifecycle state, version, blast-radius scope, and audit metadata. Configuration without ownership becomes unreviewable production logic.`,
      `Schema is the first safety boundary. Each config value should have type, allowed range, default, validation rule, description, owner, and compatibility notes. Free-form values are flexible but create runtime failures that static code deployment would have caught earlier.`,
      `Scopes and overrides must be explicit. A value can apply globally, by environment, by tenant, by region, by app version, by cohort, or by emergency state. The UI should explain precedence so operators know which value will actually be evaluated.`,
      `Versioning matters because historical behavior must be explainable. Support and incident teams need to know which config version was active for a user, tenant, client version, and timestamp. Editing values in place destroys evidence.`,
      `Propagation is eventually consistent. Clients, services, CDN caches, SDKs, and mobile apps may observe different config versions for a period of time. The design should expose propagation state and avoid assuming instant global consistency.`,
      `Configuration safety depends on blast-radius controls. Risky values should support dry-run validation, staged rollout, tenant allowlists, percent rollout, and immediate rollback. High-risk changes need stronger review than copy or display tuning.`,
      `Runtime evaluation should be deterministic and observable. Given subject, environment, client version, and config snapshot, the system should be able to explain why a value was returned. This is essential for support, debugging, and compliance.`,
      `Config cleanup is part of lifecycle. Old emergency switches, retired app versions, temporary tenant overrides, and migration flags should expire or generate owner tasks. Otherwise the config system becomes a hidden second codebase.`,
    ],
    architecture: [
      `A strong architecture has an authoring UI, schema registry, validation service, policy engine, versioned config store, publish pipeline, distribution layer, client or service SDK, telemetry pipeline, and audit log.`,
      `The authoring path creates a draft and validates schema, scope, default, conflicts, owner, risk level, and rollout plan. The policy engine decides whether the change can self-serve, needs peer review, needs incident commander approval, or is blocked.`,
      `The publish path writes an immutable version and emits a change event. Distribution may use a push stream, polling, CDN-hosted bundles, service-side cache, or client SDK cache. Each mode has different latency and staleness behavior.`,
      `The runtime path reads a signed or versioned config snapshot, evaluates targeting or precedence, applies defaults, and emits evaluation telemetry. Evaluation should be fast enough for critical paths and should fail to safe defaults when data is missing or invalid.`,
      `The monitoring path tracks publish success, propagation lag, stale clients, evaluation errors, default fallback rate, guardrail metrics, and rollback events. Operators need this to know whether a config change is actually active.`,
      `The rollback path should be first-class. Reverting to a previous known-good version should not require manually editing values under incident pressure. Rollback must record actor, reason, scope, and resulting version.`,
      `The support path should expose effective config by user, tenant, environment, and timestamp. Support teams should not query raw stores to answer why a customer saw a behavior.`,
      `The system should support simulation. Before publishing, users should preview sample subjects, tenants, regions, app versions, and precedence chains to see the effective value. Simulation catches many incorrect targeting rules before rollout.`,
    ],
    trade: [
      `Configuration systems trade release velocity against control-plane risk. Faster changes help teams mitigate incidents and tune behavior, but weak governance can bypass code review, testing, and deployment safety.`,
      `Push delivery lowers propagation latency but increases connection and fanout complexity. Polling and CDN bundles are simpler and resilient but introduce staleness. The best choice depends on how dangerous stale config is for the domain.`,
      `Client-side evaluation improves latency and offline behavior, but exposes more configuration and can be stale on old clients. Server-side evaluation centralizes secrets and policy but creates a runtime dependency on the config service.`,
      `Strict schema validation prevents invalid values but slows experimentation with new config shapes. A practical platform supports schema evolution, typed defaults, staged migrations, and compatibility checks by client version.`,
      `Tenant-specific overrides help enterprise customers but increase precedence complexity and support burden. The UI should make override hierarchy visible and periodically review long-lived overrides.`,
      `Emergency controls should be fast, but speed can bypass safeguards. A well-designed emergency path requires pre-approved actions, narrow scopes, audit, expiration, and post-incident review rather than unrestricted admin power.`,
      `Caching improves availability and latency, but stale caches can keep bad or outdated behavior alive. Config consumers should expose cache age, version, and fallback state so operators can reason about propagation.`,
      `Human approval improves safety but can slow incident response. Risk-tiered workflows let low-risk changes self-serve, high-risk changes require review, and emergency changes use break-glass with stronger audit and expiry.`,
    ],
    best: [
      `Treat config as code-like production data. Require ownership, schema, review policy, changelog, tests or simulation, and rollback for high-impact keys.`,
      `Make effective value explainable. The UI should show why a value applies, which rule won, which overrides were skipped, and which version was evaluated.`,
      `Use immutable versions. Publish new versions rather than mutating current state. This supports rollback, audit, debugging, and historical reconstruction.`,
      `Define safe defaults. If fetch, signature validation, parsing, or rule evaluation fails, the system should choose a conservative default and emit telemetry rather than crashing or applying unknown behavior.`,
      `Add expiration to temporary changes. Emergency switches, migration flags, and tenant workarounds should have owner and review dates. Stale controls are operational debt.`,
      `Separate environments and blast radius. Development, staging, canary, production, tenant-specific, and global controls should have different policies and clear labels in the UI.`,
      `Instrument propagation. Track publish latency, distribution lag, SDK version adoption, cache age, evaluation error rate, and fallback-to-default rate.`,
      `Support impact preview. Before publishing, show affected tenants, users, services, client versions, and known guardrails. This turns a risky config edit into an informed operation.`,
      `Keep emergency controls accessible but accountable. During incidents, operators need speed, but every action should produce audit evidence and a path back to normal state.`,
    ],
    pitfalls: [
      `The common failure is treating config as harmless because it is not code. In production, config changes can disable revenue, expose features, alter permissions, or break clients as effectively as a bad deployment.`,
      `Another pitfall is hiding precedence. If global values, tenant overrides, environment defaults, and emergency controls interact invisibly, operators cannot predict effective behavior.`,
      `Teams often forget old clients. Mobile and embedded clients may run outdated SDKs for months. Config schema and defaults must remain compatible or explicitly gate by version.`,
      `Rollback is often under-designed. Editing the value back is not the same as reverting to a known-good signed version with audit and propagation monitoring.`,
      `Config systems can become policy bypasses. If administrators can change behavior without review, testing, or ownership, they can unintentionally bypass safety controls embedded in normal deployments.`,
      `Stale caches and partial propagation create confusing incidents. Some users may see old behavior, some new behavior, and some fallback behavior. The UI and diagnostics should make this visible.`,
      `A subtle pitfall is overusing configuration for permanent product logic. If every branch becomes config-driven, the system becomes difficult to test, reason about, and remove.`,
      `Finally, support teams suffer when effective config is not inspectable. Every customer complaint turns into engineering investigation unless support can view the evaluated value and rule path safely.`,
    ],
    use: [
      `${t.product} is useful for progressive rollouts, tenant customization, incident mitigation, mobile behavior tuning, and migration control. Each use case requires different governance and staleness tolerance.`,
      `Enterprise tenant overrides are common but risky. They require ownership, expiry, visibility, and migration paths back to the default behavior.`,
      `Emergency controls help stop harm quickly, but they need pre-defined actions, narrow scoping, audit, and rollback to avoid creating a second incident.`,
      `Remote client configuration is especially important for mobile and edge clients because app-store releases are slow and offline behavior is common.`,
      `In interviews, use configuration systems to demonstrate control-plane thinking: validation, propagation, consistency, blast radius, rollback, ownership, and evidence.`,
    ],
  };
  const qa = [
    [`How would you design ${t.product} at scale?`, `I would use a versioned config store, schema registry, validation service, policy engine, publish pipeline, distribution layer, SDK evaluation path, telemetry, and audit log. The UI creates drafts, previews impact, validates scope and schema, routes high-risk changes through approval, publishes immutable versions, and monitors propagation. Rollback is a first-class action to a known-good version.`],
    ["How do you prevent a bad config from taking down production?", "Use typed schemas, safe defaults, dry-run simulation, blast-radius estimation, staged rollout, guardrails, approval for high-risk keys, and immediate rollback. Runtime consumers should fail closed or to conservative defaults when config is missing or invalid, and publish pipelines should monitor evaluation errors after launch."],
    ["How do you handle eventual consistency and stale clients?", "Expose config version, cache age, SDK version, and propagation status. Use TTLs, signed bundles, background refresh, and server-side invalidation where needed. For critical controls, prefer faster propagation paths or server-side evaluation. For old clients, gate schemas by client capability and preserve compatible defaults."],
    ["What should be audited?", "Audit every create, edit, publish, approval, rollback, emergency override, tenant override, schema change, and delete. Records should include actor, reason, before and after values, scope, affected tenants, version, approval path, and correlation id. Audit is what lets teams explain production behavior after an incident."],
    ["What trade-offs matter most?", "The main trade-offs are speed versus governance, push freshness versus operational complexity, client-side evaluation versus centralized control, customization versus supportability, and caching versus stale behavior. Principal-level answers tie each trade-off to blast radius and user trust."],
  ];
  return `"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-${t.slug}",
  title: "${t.title}",
  description: "Principal-level design for ${t.product} covering schema validation, governance, propagation, emergency controls, observability, and rollback.",
  category: "high-level-design",
  subcategory: "feature-configuration-admin-systems",
  slug: "${t.slug}",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-25",
  tags: ["hld", "configuration", "admin", "feature-control", "reliability"],
  relatedTopics: ["dynamic-config-management-ui", "kill-switch-emergency-control-panel", "remote-app-configuration-system"],
};

export default function ${componentName(t.slug)}() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="important">
          ${sections.definition[0]}
        </HighlightBlock>
${sections.definition.slice(1).map(p).join("\n")}
      </section>

      <section>
        <h2>Core Concepts</h2>
${sections.core.map(p).join("\n")}
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
${sections.architecture.map(p).join("\n")}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/feature-configuration-admin-systems/${t.slug}.svg" alt="${t.title} architecture" caption="Architecture view: authoring, validation, policy, versioned store, distribution, telemetry, and audit." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/feature-configuration-admin-systems/${t.slug}-flow.svg" alt="${t.title} publish flow" caption="Publish flow from draft validation through propagation, monitoring, and rollback." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/feature-configuration-admin-systems/${t.slug}-risk-controls.svg" alt="${t.title} risk controls" caption="Risk controls for bad values, schema drift, stale caches, blast radius, audit, and rollback." />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
${sections.trade.map(p).join("\n")}
      </section>

      <section>
        <h2>Best practices</h2>
${sections.best.map(p).join("\n")}
      </section>

      <section>
        <h2>Common Pitfalls</h2>
${sections.pitfalls.map(p).join("\n")}
      </section>

      <section>
        <h2>Real-world use cases</h2>
${sections.use.map(p).join("\n")}
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
${qa.map(([q,a])=>`        <h3>${q}</h3>\n${p(a)}`).join("\n")}
      </section>

      <section>
        <h2>References</h2>
        <ul>
${t.refs.map(r=>`          <li>${r}.</li>`).join("\n")}
        </ul>
      </section>
    </ArticleLayout>
  );
}
`;
}

fs.mkdirSync(diagramDir, { recursive: true });
for (const t of topics) {
  fs.writeFileSync(path.join(articleDir, `${t.slug}.tsx`), article(t));
  fs.writeFileSync(path.join(diagramDir, `${t.slug}.svg`), svg(`${t.title}: Architecture`, t.architecture, "system"));
  fs.writeFileSync(path.join(diagramDir, `${t.slug}-flow.svg`), svg(`${t.title}: Publish Flow`, t.flow, "flow"));
  fs.writeFileSync(path.join(diagramDir, `${t.slug}-risk-controls.svg`), svg(`${t.title}: Risk Controls`, t.risk, "risk"));
}
