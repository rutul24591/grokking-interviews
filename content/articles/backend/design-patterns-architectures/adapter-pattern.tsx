"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-adapter-pattern-extensive",
  title: "Adapter Pattern",
  description:
    "Introduce a translation layer that makes incompatible interfaces work together while keeping the core system stable and easier to evolve.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "adapter-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "integration", "abstractions"],
  relatedTopics: [
    "anti-corruption-layer",
    "hexagonal-architecture",
    "clean-architecture",
    "repository-pattern",
    "strangler-fig-pattern",
  ],
};

export default function AdapterPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What the Adapter Pattern Is</h2>
        <p>
          The <strong>Adapter pattern</strong> is a boundary technique: it allows two components with incompatible
          interfaces to work together by inserting a translation layer. In backend systems, adapters are most valuable
          at <em>integration seams</em>: where your product touches external APIs, legacy systems, databases, queues, or
          even internal services with different assumptions.
        </p>
        <p>
          In practice, &quot;adapter&quot; is less about object-oriented design and more about operations and evolution.
          An adapter gives you a place to normalize data shapes, error semantics, and timeouts so that the rest of your
          codebase can remain consistent even as integrations change.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/adapter-pattern-diagram-1.svg"
          alt="Adapter pattern boundary: core system talks to an adapter that translates to an external system"
          caption="Adapters keep translation work at the boundary so the core can keep a stable model and behavior."
        />
      </section>

      <section>
        <h2>Where Adapters Show Up in Real Architectures</h2>
        <p>
          If you use hexagonal or clean architecture, you already have a mental model for adapters: the core exposes
          ports (interfaces it needs), and adapters implement those ports for specific technologies. Even without that
          terminology, the same idea applies: keep technology-specific details out of domain logic.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Adapter Locations</h3>
          <ul className="space-y-2">
            <li>
              <strong>Outbound adapters:</strong> wrap calls to payment providers, email/SMS vendors, fraud tools, or
              partner APIs and normalize failures and response shapes.
            </li>
            <li>
              <strong>Inbound adapters:</strong> translate requests from HTTP/gRPC/events into application commands and
              enforce parsing, validation, and auth context mapping.
            </li>
            <li>
              <strong>Persistence adapters:</strong> map between domain objects and database schemas, including
              serialization formats and migration quirks.
            </li>
            <li>
              <strong>Legacy bridges:</strong> accept legacy payloads or protocols while the core evolves, often used
              during migrations.
            </li>
          </ul>
        </div>
        <p>
          Adapters are most useful when the &quot;outside world&quot; changes on its own schedule. The more you depend on
          third-party evolution, the more you benefit from having a controlled boundary where change is contained.
        </p>
      </section>

      <section>
        <h2>The Core Design Decision: Translate Into What?</h2>
        <p>
          The translation target matters. If the adapter simply re-exposes the external system&apos;s model, you have not
          contained coupling, you have only relocated it. A well-designed adapter translates into a model that fits your
          domain and is stable enough to survive vendor changes.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/adapter-pattern-diagram-2.svg"
          alt="Decision map for adapter pattern: target model choice, error normalization, versioning, and observability"
          caption="A good adapter is opinionated: it defines a stable internal contract and maps the outside world into it."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Canonical internal model:</strong> represent what your system needs, not what the vendor provides.
            This reduces ripple effects when vendors add fields or rename concepts.
          </li>
          <li>
            <strong>Error semantics:</strong> normalize failures into a small set of categories that the core can reason
            about (retryable vs not, client error vs server error).
          </li>
          <li>
            <strong>Time budgets:</strong> adapters are a natural home for default timeouts, deadlines, and circuit
            breaking rules for that dependency.
          </li>
          <li>
            <strong>Observability contract:</strong> ensure request IDs, vendor correlation IDs, and key attributes are
            attached consistently so incidents do not require ad-hoc logging changes.
          </li>
        </ul>
        <p className="mt-4">
          Translation is not only data mapping. It includes <em>behavioral mapping</em>: how you handle partial success,
          rate limits, backoff, and vendor-specific status codes without pushing that complexity into every caller.
        </p>
      </section>

      <section>
        <h2>Failure Modes You Should Design For</h2>
        <p>
          The adapter boundary concentrates risk. That is good, but it also means adapter failures can be widespread if
          the boundary is poorly designed. The goal is to make failures predictable and debuggable, not to pretend they
          will not happen.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/adapter-pattern-diagram-3.svg"
          alt="Adapter failure modes: schema drift, rate limiting, timeouts, partial errors, and fallback paths"
          caption="Adapters should turn vendor chaos into a small, actionable set of failure behaviors."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Schema drift</h3>
            <p className="mt-2 text-sm text-muted">
              Vendors add fields, change enums, or alter default behaviors. If you map directly into internal objects,
              subtle drift becomes correctness bugs.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> strict parsing with unknown-field tolerance, contract tests, and explicit
                handling for new enum values.
              </li>
              <li>
                <strong>Signal:</strong> parse error rate, unexpected enum counters, and response-shape diffs in CI.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Hidden coupling</h3>
            <p className="mt-2 text-sm text-muted">
              Over time, callers learn vendor quirks and start relying on them, bypassing adapter abstractions.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep adapters as the only dependency entry point; avoid leaking vendor types
                into the core.
              </li>
              <li>
                <strong>Signal:</strong> imports of vendor libraries in core modules; repeated vendor-specific conditionals.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Retry storms and amplification</h3>
            <p className="mt-2 text-sm text-muted">
              A naive adapter retries aggressively during outages and magnifies traffic to an already failing dependency.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> retry budgets, jitter, circuit breakers, and explicit backoff on rate limits.
              </li>
              <li>
                <strong>Signal:</strong> outbound request rate spikes while success rate drops.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Partial failures</h3>
            <p className="mt-2 text-sm text-muted">
              Some external APIs succeed but return incomplete results, or succeed asynchronously after your timeout.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> idempotency keys, reconciliation jobs, and clear state machines for
                &quot;unknown&quot; outcomes.
              </li>
              <li>
                <strong>Signal:</strong> mismatch counters between internal state and vendor state.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>A Migration Scenario: Swapping Vendors Without Breaking the Core</h2>
        <p>
          Consider a system that sends transactional messages. Initially it uses Vendor A. Later you want to move to
          Vendor B for cost or deliverability reasons. Without an adapter, vendor-specific fields (template IDs, provider
          statuses, error codes) creep into the core. The migration becomes an invasive refactor across the application.
        </p>
        <p>
          With an adapter, the core depends on a stable internal concept such as &quot;SendMessage&quot; and a small set
          of outcomes (accepted, rejected, retry later, unknown). Vendor-specific details stay at the boundary. You can
          implement a dual-write or shadow mode inside the adapter (send to both vendors for a subset of traffic),
          compare outcomes, then cut over gradually.
        </p>
        <p>
          The main trick is to define what &quot;equivalence&quot; means. You rarely get a perfect one-to-one mapping.
          Instead, define success criteria that matter to the business and create a reconciliation path for edge cases.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>
          Adapter work frequently becomes incident work, because integrations fail in production. A small amount of
          investment in runbooks and monitoring dramatically reduces time-to-recovery.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Dashboards:</strong> success rate, p95 latency, timeouts, and rate-limit counters per vendor endpoint.
          </li>
          <li>
            <strong>Contract tests:</strong> validate mapping behavior in CI with recorded fixtures, plus periodic live
            canary checks.
          </li>
          <li>
            <strong>Safe rollout controls:</strong> feature flags for vendor selection, plus fast rollback to the previous
            vendor path.
          </li>
          <li>
            <strong>Reconciliation path:</strong> a job to re-check &quot;unknown&quot; outcomes and correct internal state.
          </li>
          <li>
            <strong>Change discipline:</strong> treat mapping and retry policy changes as high-risk; roll out gradually and
            alert on regressions.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Do callers depend only on the adapter contract (not vendor types, enums, or status codes)?
          </li>
          <li>
            Is there a clear classification of errors into retryable, not retryable, and unknown?
          </li>
          <li>
            Are timeouts, backoff, and circuit breaking owned in one place for the dependency?
          </li>
          <li>
            Can the adapter be switched, versioned, or dual-run without invasive changes to the core?
          </li>
          <li>
            Can you reconcile external state and internal state when outcomes are ambiguous?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When is an adapter more appropriate than &quot;just call the vendor API&quot;?</p>
            <p className="mt-2 text-sm">
              When multiple parts of the system need the integration, when vendor churn is likely, or when you need
              consistent timeouts, retries, and error semantics across many callers.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes an adapter become a problem?</p>
            <p className="mt-2 text-sm">
              Letting vendor concepts leak into internal models, and hiding business decisions inside mapping logic so
              the boundary becomes opaque and untestable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you validate adapter correctness during a migration?</p>
            <p className="mt-2 text-sm">
              Dual-run or shadow traffic, compare outcomes using business-level equivalence, and keep a reconciliation
              workflow for mismatches and unknown states.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
