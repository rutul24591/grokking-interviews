"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-domain-driven-design-extensive",
  title: "Domain-Driven Design",
  description:
    "Model software around the business domain with bounded contexts, explicit invariants, and a shared language that scales across teams and years of change.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "domain-driven-design",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "ddd", "domain"],
  relatedTopics: [
    "anti-corruption-layer",
    "microservices-architecture",
    "event-driven-architecture",
    "repository-pattern",
    "cqrs-pattern",
  ],
};

export default function DomainDrivenDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Design Around the Domain, Not the Database</h2>
        <p>
          <strong>Domain-Driven Design (DDD)</strong> is a set of practices for building software around business
          concepts, rules, and language. It is most useful when the domain is complex: many rules, many edge cases, and
          long-lived evolution. DDD is not primarily about class diagrams. It is about building a model that teams can
          reason about and change without repeatedly breaking correctness.
        </p>
        <p>
          DDD emphasizes a <strong>ubiquitous language</strong>: engineers and domain experts use the same terms with the
          same meanings. When language is inconsistent, systems become inconsistent. In a large codebase, the biggest
          source of bugs is often semantic drift: two teams implement the same concept differently because the concept was
          never clearly owned or named.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/domain-driven-design-diagram-1.svg"
          alt="Domain-driven design diagram showing bounded contexts and a shared language"
          caption="DDD aligns code boundaries to domain boundaries so teams can evolve behavior with less semantic drift."
        />
      </section>

      <section>
        <h2>Strategic DDD: Bounded Contexts and Context Maps</h2>
        <p>
          Strategic DDD is about boundaries. A <strong>bounded context</strong> is a boundary within which a domain model
          is consistent. Outside that boundary, the same word can mean something else. This is normal. The problem is
          pretending that one global model can serve every team and every workflow.
        </p>
        <p>
          A <strong>context map</strong> describes how bounded contexts relate: which context is upstream, which is
          downstream, and what integration style is used (published language, translation layers, shared kernel). This is
          where DDD connects directly to architecture: service boundaries, data ownership, and integration risk.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/domain-driven-design-diagram-2.svg"
          alt="Context map diagram illustrating upstream and downstream bounded contexts with translation boundaries"
          caption="A context map makes dependencies explicit: who owns meaning, and how meaning crosses boundaries."
        />
      </section>

      <section>
        <h2>Tactical DDD: Aggregates, Invariants, and Domain Events</h2>
        <p>
          Tactical DDD is about modeling correctness. The most important concept is the <strong>invariant</strong>: a
          rule that must always hold (for example, &quot;inventory cannot go negative&quot; or &quot;an order cannot be
          shipped before it is paid&quot;). DDD encourages you to place invariants in the domain model and to design
          boundaries that make invariants enforceable.
        </p>
        <p>
          <strong>Aggregates</strong> are consistency boundaries: a cluster of domain objects that change together and are
          protected by a single set of invariants. Aggregates are not about object graphs; they are about deciding what
          must be updated atomically and what can be eventually consistent.
        </p>
        <p>
          <strong>Domain events</strong> capture meaningful state transitions (for example, &quot;OrderPlaced&quot;,
          &quot;PaymentCaptured&quot;). They are useful as integration signals and as a historical narrative of what
          happened, but they must be governed: schemas evolve, consumers multiply, and semantics can drift.
        </p>
      </section>

      <section>
        <h2>DDD and Microservices: Alignment, Not a Guarantee</h2>
        <p>
          Microservices are often described as &quot;bounded contexts turned into services,&quot; but the mapping is not
          automatic. Some bounded contexts remain inside a monolith as modules. Some contexts split across multiple
          services due to scale or regulatory constraints. The goal is alignment: service boundaries should not fight the
          domain boundaries.
        </p>
        <p>
          A common failure is designing microservices around technical layers (auth service, validation service, logging
          service) rather than around business capabilities. This increases coupling and reduces clarity. DDD provides a
          better decomposition lens: workflows, ownership, and meaning.
        </p>
      </section>

      <section>
        <h2>Integration Safety: Translation Beats Shared Meaning</h2>
        <p>
          When one context depends on another, do not assume shared meaning. Use explicit translation (often an
          anti-corruption layer) so changes in one model do not silently break another. This is a reliability practice.
          Without translation, upstream teams effectively control downstream correctness.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/domain-driven-design-diagram-3.svg"
          alt="Failure modes of DDD: semantic drift, unclear ownership, and anemic domain models"
          caption="DDD fails when meaning is not owned and enforced. The outcome is semantic drift and correctness regressions."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Failure Modes</h3>
          <ul className="space-y-2">
            <li>
              <strong>Anemic domain model:</strong> domain objects become data bags; invariants live in scattered service
              code.
            </li>
            <li>
              <strong>Semantic drift:</strong> the same concept is implemented differently across teams and services.
            </li>
            <li>
              <strong>Boundary denial:</strong> one &quot;global&quot; model forces all teams into one meaning, so teams
              work around it with hidden assumptions.
            </li>
            <li>
              <strong>Events without governance:</strong> &quot;domain events&quot; become an uncontrolled integration
              layer with breaking changes.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Scenario Walkthrough: Checkout and Billing Diverge</h2>
        <p>
          A product has a checkout flow and a billing system. Early on, both use the term &quot;invoice&quot; to mean the
          same thing. Over time, billing needs invoice revisions, tax adjustments, and audits; checkout needs a simpler
          concept for user-facing receipts. If you keep one shared model, you either overload checkout with billing
          complexity or oversimplify billing.
        </p>
        <p>
          DDD suggests splitting contexts: checkout has a &quot;receipt&quot; model; billing has an &quot;invoice&quot;
          model with audit semantics. Integration is explicit: checkout publishes an event for &quot;OrderPaid&quot;, and
          billing translates it into invoice creation. The system becomes easier to evolve because meaning is owned.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use DDD when the domain is complex and long-lived; avoid heavy modeling for simple CRUD systems.</li>
          <li>Define bounded contexts so meaning stays consistent within boundaries and explicit across boundaries.</li>
          <li>Design aggregates around invariants and consistency requirements, not around object graphs.</li>
          <li>Use translation layers (anti-corruption) to protect downstream models from upstream drift.</li>
          <li>Govern domain events and contracts: versioning, compatibility, ownership, and deprecation.</li>
          <li>Align service/module boundaries to domain boundaries to reduce coupling and coordination costs.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a bounded context and why is it useful?</p>
            <p className="mt-2 text-sm">
              A: A boundary where a model is consistent. It prevents semantic drift and provides a clear unit for
              ownership, integration, and architectural boundaries.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is an aggregate and what is it not?</p>
            <p className="mt-2 text-sm">
              A: A consistency boundary defined by invariants and atomic updates. It is not &quot;all related objects&quot;
              or a reflection of database joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does DDD influence microservice boundaries?</p>
            <p className="mt-2 text-sm">
              A: It provides a decomposition lens based on meaning and ownership. Microservices should align to bounded
              contexts where possible to reduce coupling.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common way DDD fails?</p>
            <p className="mt-2 text-sm">
              A: Modeling without ownership: anemic domain models and unmanaged semantic drift, often amplified by events
              without governance.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

