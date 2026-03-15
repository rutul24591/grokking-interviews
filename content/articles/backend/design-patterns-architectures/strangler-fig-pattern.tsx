"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-strangler-fig-pattern-extensive",
  title: "Strangler Fig Pattern",
  description:
    "Modernize systems incrementally by routing slices of functionality to new components, using verification and rollback to avoid big-bang rewrites.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "strangler-fig-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "migration"],
  relatedTopics: ["api-gateway-pattern", "anti-corruption-layer", "microservices-architecture", "shared-database-anti-pattern"],
};

export default function StranglerFigPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Replace a System by Surrounding It</h2>
        <p>
          The <strong>Strangler Fig pattern</strong> modernizes a legacy system by gradually replacing parts of it.
          Instead of a big-bang rewrite, you introduce a new system alongside the old and progressively route more
          functionality to the new. Over time, the old system is &quot;strangled&quot;: it serves less traffic until it
          can be removed.
        </p>
        <p>
          The pattern is popular because it matches how real organizations change systems: there is continuous delivery,
          ongoing product work, and limited tolerance for long periods of parallel development. The strangler fig approach
          creates a migration path that preserves user value and reduces rewrite risk.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/strangler-fig-pattern-diagram-1.svg"
          alt="Strangler fig migration diagram showing traffic gradually shifting from legacy system to new system through a routing layer"
          caption="Strangler migrations move traffic in slices, with the ability to validate and roll back at each step."
        />
      </section>

      <section>
        <h2>The Key Mechanism: A Routing and Translation Boundary</h2>
        <p>
          A strangler migration needs a boundary where requests can be directed to either system. This can be an API
          gateway, a reverse proxy, an ingress rule, or an internal routing layer. The router allows gradual cutover,
          and it provides a natural place to instrument progress and detect regressions.
        </p>
        <p>
          Often you also need translation: the legacy system and the new system rarely share the same model. A translation
          boundary (often an anti-corruption layer) helps maintain consistent semantics for clients while internal systems
          evolve.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/strangler-fig-pattern-diagram-2.svg"
          alt="Decision map for strangler fig migration including routing strategies, data migration, and verification"
          caption="Strangler success depends on routing, data migration strategy, and verification discipline."
        />
      </section>

      <section>
        <h2>Slice Selection: What to Move First</h2>
        <p>
          The most common strangler failure is choosing slices that are not separable. If you start with a deeply coupled
          capability, you spend months untangling dependencies and the migration loses momentum. Good slices share three
          properties: clear boundaries, limited shared data writes, and a measurable contract.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Start with read paths:</strong> reads are easier to route and validate, and they avoid distributed
            transaction complexity.
          </li>
          <li>
            <strong>Prefer &quot;leaf&quot; capabilities:</strong> features that depend on others but are not depended on
            by many others.
          </li>
          <li>
            <strong>Choose measurable outcomes:</strong> latency, error rate, correctness checks, and user behavior can
            validate the slice.
          </li>
        </ul>
        <p className="mt-4">
          A migration should have a clear &quot;definition of done&quot; per slice: what traffic is moved, what data is
          owned, and how rollback works.
        </p>
      </section>

      <section>
        <h2>Data Migration Strategies: The Real Difficulty</h2>
        <p>
          Routing requests is often easy. Migrating data ownership is hard. Many strangler migrations stall because the
          new system cannot safely own data without coordinating with the legacy system. You typically choose one of a few
          strategies depending on correctness requirements.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Approaches</h3>
          <ul className="space-y-2">
            <li>
              <strong>Shadow reads:</strong> read from the new store in parallel and compare results, but serve responses
              from legacy until confidence is high.
            </li>
            <li>
              <strong>Dual writes:</strong> write to both systems during transition. Operationally risky unless you have a
              clear reconciliation plan.
            </li>
            <li>
              <strong>CDC replication:</strong> stream legacy changes into the new store to build a read model, then
              eventually switch writes.
            </li>
            <li>
              <strong>Ownership flip:</strong> cut over writes first for a narrow slice, then backfill and reconcile.
              Works when the slice has a clear key space.
            </li>
          </ul>
        </div>
        <p>
          The safest approach is usually to start with read models (CDC/shadow reads), build confidence, then plan the
          write ownership transition explicitly with compensations and reconciliation.
        </p>
      </section>

      <section>
        <h2>Verification: How You Know the New System Is Correct</h2>
        <p>
          Strangler migrations fail when teams move traffic without strong verification. &quot;It seems fine&quot; is not
          a strategy. Verification requires explicit checks: response diffs, invariants, reconciliation jobs, and
          monitoring of user-impact signals.
        </p>
        <p>
          A practical verification ladder is: compare results in shadow mode, then move a small canary cohort, then expand
          traffic with automatic rollback triggers. This mirrors progressive delivery for application code, applied to
          architecture migration.
        </p>
      </section>

      <section>
        <h2>Cutover Mechanics: Making Rollback Real</h2>
        <p>
          The strangler pattern succeeds when rollback is fast and low-drama. That requires planning for the parts of
          the system that are not obvious in diagrams: caches, sessions, and shared side effects.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Stateful flows:</strong> if a user journey spans multiple requests, define whether routing is per
            request or &quot;sticky&quot; per session so you do not mix old and new behavior mid-flow.
          </li>
          <li>
            <strong>Cache boundaries:</strong> keep cache keys versioned per implementation so the new system does not
            interpret old cached values incorrectly.
          </li>
          <li>
            <strong>Side effects:</strong> emails, payments, and inventory writes need idempotency and deduplication so a
            rollback does not double-execute actions.
          </li>
          <li>
            <strong>Exit criteria:</strong> define what proves success (error rates, invariants, user signals) and what
            triggers rollback automatically.
          </li>
        </ul>
        <p className="mt-4">
          Treat cutover like a deployable change: staged rollout, clear signals, and a practiced rollback procedure.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/strangler-fig-pattern-diagram-3.svg"
          alt="Strangler fig failure modes: slice coupling, data drift, dual-write inconsistency, and irreversible cutovers"
          caption="Migration risk is correctness drift and irreversible cutover. Strangler works when rollback and verification are real."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Slice coupling:</strong> the slice depends on many hidden legacy assumptions. Mitigation: start with
            smaller read slices and create explicit contracts.
          </li>
          <li>
            <strong>Data drift:</strong> legacy and new stores diverge. Mitigation: reconciliation dashboards, invariants,
            and controlled backfills.
          </li>
          <li>
            <strong>Dual-write inconsistency:</strong> one write succeeds and the other fails. Mitigation: avoid dual
            writes where possible; use outbox/CDC and idempotent consumers.
          </li>
          <li>
            <strong>Irreversible cutover:</strong> traffic is moved without rollback. Mitigation: keep routing control,
            keep legacy paths operable until confidence is established.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Migrating Checkout</h2>
        <p>
          A legacy monolith owns checkout. The team wants to extract payments first, but the capability is deeply coupled.
          Instead, they start with a read slice: build a new payment history view using CDC from the monolith database and
          validate it with shadow reads.
        </p>
        <p>
          Once the read model is trusted, they move a small canary cohort of &quot;authorize payment&quot; requests through
          a gateway to a new payments service. They keep rollback immediate and run reconciliation jobs that compare ledger
          totals between systems daily. The migration proceeds slice by slice rather than as a rewrite project with a
          single cutover date.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Introduce a routing boundary that can direct traffic to old or new and can roll back quickly.</li>
          <li>Pick separable slices; start with read paths and leaf capabilities to build momentum.</li>
          <li>Choose an explicit data migration strategy; avoid dual writes unless you can reconcile safely.</li>
          <li>Use verification ladders: shadow mode, canary traffic, progressive rollout with automatic rollback triggers.</li>
          <li>Instrument migration progress and correctness drift; treat drift as an incident signal.</li>
          <li>Keep legacy paths operable until confidence is high and rollback is no longer needed.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is Strangler Fig safer than a big-bang rewrite?</p>
            <p className="mt-2 text-sm">
              A: It allows incremental migration with measurable verification and rollback at each step, reducing the
              risk of long parallel development and one irreversible cutover.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the hardest part of strangler migrations?</p>
            <p className="mt-2 text-sm">
              A: Data ownership transitions and correctness verification. Routing is easy; preventing drift and handling
              writes safely is hard.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate correctness before serving traffic from the new system?</p>
            <p className="mt-2 text-sm">
              A: Shadow reads and diffs, invariants, reconciliation jobs, and progressive rollout with rollback triggers.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you avoid dual writes?</p>
            <p className="mt-2 text-sm">
              A: When you cannot guarantee consistent cross-system writes and do not have a strong reconciliation plan.
              Prefer CDC/outbox patterns and explicit ownership flips where possible.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
