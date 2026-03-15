"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-anti-corruption-layer-extensive",
  title: "Anti-Corruption Layer",
  description:
    "Protect your domain model from external systems by translating semantics at the boundary, keeping legacy complexity from contaminating new services.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "anti-corruption-layer",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "ddd", "integration"],
  relatedTopics: ["adapter-pattern", "domain-driven-design", "strangler-fig-pattern", "event-driven-architecture"],
};

export default function AntiCorruptionLayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Translation as a Reliability Boundary</h2>
        <p>
          An <strong>anti-corruption layer (ACL)</strong> is a boundary that prevents an external system&apos;s data model,
          terminology, and failure semantics from leaking into your internal domain model. It does this through explicit
          translation: the ACL accepts external concepts and produces internal concepts (and sometimes the reverse).
        </p>
        <p>
          ACLs matter when integrating with legacy systems, third-party APIs, or shared platforms where you do not fully
          control change. Without an ACL, the external model tends to &quot;infect&quot; the internal codebase:
          mismatched terminology, awkward invariants, and persistent special cases that make future evolution harder.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/anti-corruption-layer-diagram-1.svg"
          alt="Anti-corruption layer translating between an external system model and an internal domain model"
          caption="An ACL makes translation explicit so internal meaning can stay consistent even when upstream meaning is messy."
        />
      </section>

      <section>
        <h2>What &quot;Corruption&quot; Looks Like in Practice</h2>
        <p>
          Corruption is usually semantic. An upstream system might use a field called &quot;status&quot; that conflates
          several states, or a concept like &quot;customer&quot; that includes both users and organizations. If you reuse
          the upstream model directly, you inherit its ambiguity and make your own invariants harder to express.
        </p>
        <p>
          Corruption is also operational. External systems often have unusual error codes, rate limits, partial success
          semantics, and inconsistent latency. If those behaviors leak into your domain workflows, your internal logic
          becomes coupled to external failure modes and becomes harder to reason about.
        </p>
      </section>

      <section>
        <h2>Common ACL Shapes</h2>
        <p>
          ACLs can be implemented in different forms. The important part is not the class diagram; it is that translation
          is explicit and owned.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/anti-corruption-layer-diagram-2.svg"
          alt="Decision map showing different anti-corruption layer forms: facade, translator, and adapters"
          caption="Choose an ACL form that matches your integration risk and the stability of upstream semantics."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Facade service:</strong> a dedicated service that exposes a stable internal API and hides upstream
            complexity. Useful when many internal consumers depend on one upstream.
          </li>
          <li>
            <strong>Translator module:</strong> an internal library that maps upstream payloads to internal domain types.
            Useful when integration is local to one service.
          </li>
          <li>
            <strong>Gateway adapter:</strong> a network-facing adapter that standardizes timeouts, retries, and error
            semantics while also translating schemas.
          </li>
        </ul>
        <p className="mt-4">
          The larger and less stable the upstream, the more value you get from an explicit facade boundary with strong
          governance, rather than sprinkling translation across many call sites.
        </p>
      </section>

      <section>
        <h2>Translation Rules: Semantics, Not Just Fields</h2>
        <p>
          Field mapping is the easy part. The hard part is semantic mapping: units, meaning, lifecycle states, and
          invariants. A robust ACL defines a small set of translation rules and treats them as a contract.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>State machine mapping:</strong> translate upstream statuses into internal states with clear meaning.
          </li>
          <li>
            <strong>Invariants:</strong> decide which upstream inputs are invalid for your model and how you handle them
            (reject, quarantine, degrade).
          </li>
          <li>
            <strong>Error normalization:</strong> map upstream errors into internal categories that workflows can reason
            about (transient, permanent, throttled, unauthorized).
          </li>
          <li>
            <strong>Identity and keys:</strong> translate upstream IDs into internal identifiers; avoid mixing ID spaces
            inadvertently.
          </li>
        </ul>
        <p className="mt-4">
          This is where ACLs become a correctness and reliability tool. Without explicit semantics, integrations become a
          pile of &quot;if upstream says X then do Y&quot; branches scattered across the codebase.
        </p>
      </section>

      <section>
        <h2>Operational Implications: The ACL Becomes the Guardrail</h2>
        <p>
          ACLs often become the natural place to implement protective policies: timeouts, retries, rate limiting, and
          caching for upstream data. This is not &quot;cheating&quot;; it is the point. The ACL is where you decide how
          much of the upstream instability you will expose to internal workflows.
        </p>
        <p>
          Because the ACL is a boundary, it should have boundary telemetry: upstream latency and error rates, translation
          failure counters, and &quot;unknown state&quot; rates. These signals help detect upstream changes early and
          prevent silent drift.
        </p>
      </section>

      <section>
        <h2>Versioning and Validation: Keeping Translation Honest</h2>
        <p>
          ACLs tend to live for a long time. Upstream systems change gradually and rarely provide a clean cutover. The
          most effective ACLs treat translation rules as a versioned contract, with tests and telemetry that prove the
          rules still reflect reality.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Golden payloads:</strong> keep representative upstream responses (including edge cases) and validate
            translation outputs in CI so drift is caught before production.
          </li>
          <li>
            <strong>Raw input retention:</strong> store a small sample of upstream payloads and translation decisions for
            debugging and for safe reprocessing when mapping logic changes.
          </li>
          <li>
            <strong>Explicit &quot;unknown&quot; paths:</strong> prefer quarantining or graceful degradation over silently
            mapping an unrecognized upstream value into an incorrect internal state.
          </li>
          <li>
            <strong>Compatibility windows:</strong> if upstream introduces a new field or state, support both old and new
            versions until consumers have migrated.
          </li>
        </ul>
        <p className="mt-4">
          The goal is not to eliminate upstream variability. The goal is to make variability visible, bounded, and
          localized to one owned layer.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/anti-corruption-layer-diagram-3.svg"
          alt="Anti-corruption layer failure modes: leaky translation, duplicate mapping logic, and semantic drift"
          caption="ACLs fail when translation is inconsistent or when the layer becomes an unowned dumping ground."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Leaky abstraction:</strong> upstream concepts leak into internal APIs. Mitigation: internal interfaces
            must speak internal language only.
          </li>
          <li>
            <strong>Translation duplication:</strong> multiple teams implement their own mapping. Mitigation: a single
            owned ACL with a clear contract.
          </li>
          <li>
            <strong>Unmanaged upstream change:</strong> upstream semantics change and translation silently becomes wrong.
            Mitigation: contract tests, canary monitors, and drift dashboards.
          </li>
          <li>
            <strong>Policy creep:</strong> the ACL becomes a dumping ground for business logic. Mitigation: keep domain
            invariants in domain services; keep ACL focused on translation and protection.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Integrating With a Legacy ERP</h2>
        <p>
          A new order service needs data from a legacy ERP system. The ERP uses overloaded statuses and returns partial
          data during maintenance windows. Without an ACL, engineers begin copying ERP field names and statuses into the
          new service. Over time, the new domain model becomes shaped around ERP quirks.
        </p>
        <p>
          With an ACL, the integration is translated into internal domain concepts: the new service exposes its own clear
          states and invariants, and the ACL contains the messy mapping and protective policies (timeouts, caching,
          normalization). When the ERP changes a field, the change is localized and detectable through ACL telemetry.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Introduce an ACL when integrating with unstable or legacy systems whose semantics you do not control.</li>
          <li>Translate meaning, not just fields: states, units, invariants, and error categories.</li>
          <li>Make translation owned and centralized; avoid scattered mapping logic across many services.</li>
          <li>Use the ACL to enforce protective policies and normalize failure semantics.</li>
          <li>Instrument the boundary: upstream health, translation failures, and drift signals.</li>
          <li>Prevent ACLs from becoming business-logic dumping grounds; keep domain meaning in domain services.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problem does an anti-corruption layer solve?</p>
            <p className="mt-2 text-sm">
              A: It prevents external models and failure semantics from contaminating your domain model by making
              translation explicit and owned.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is mapping semantics harder than mapping fields?</p>
            <p className="mt-2 text-sm">
              A: Semantics include states, invariants, and error categories. Getting them wrong produces silent
              correctness drift even when schemas still parse.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What signals tell you upstream changes are breaking the ACL?</p>
            <p className="mt-2 text-sm">
              A: Rising translation failures, unexpected state mappings, increased unknown/invalid inputs, and drift
              between internal outputs and upstream snapshots.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you keep ACLs from becoming a monolith?</p>
            <p className="mt-2 text-sm">
              A: Keep the ACL focused on translation and protection. Domain workflows and invariants live elsewhere, and
              the ACL has clear ownership and scope.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
