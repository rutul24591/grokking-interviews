"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-repository-pattern-extensive",
  title: "Repository Pattern",
  description:
    "Expose persistence as a domain-friendly collection interface so application logic stays focused on business rules instead of database mechanics.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "repository-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "ddd", "persistence"],
  relatedTopics: [
    "unit-of-work-pattern",
    "adapter-pattern",
    "layered-architecture",
    "domain-driven-design",
    "clean-architecture",
  ],
};

export default function RepositoryPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What the Repository Pattern Is</h2>
        <p>
          A <strong>Repository</strong> provides an interface for accessing and persisting domain objects. It is often
          described as a &quot;collection-like&quot; abstraction: you can fetch an aggregate, add a new one, remove one,
          and save changes without the caller needing to know whether the data lives in SQL, a document store, or
          something else.
        </p>
        <p>
          In backend systems, repositories are primarily about <strong>separation of concerns</strong>. They keep query
          plumbing, schema details, and persistence-specific failure handling out of application services. This can
          improve testability and reduce the chance that your domain logic becomes tightly coupled to a particular ORM or
          database model.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/repository-pattern-diagram-1.svg"
          alt="Repository pattern between application services and persistence, translating domain operations to database queries"
          caption="Repositories isolate persistence details and expose domain-oriented operations to the application."
        />
      </section>

      <section>
        <h2>Where Repositories Help Most</h2>
        <p>
          Repositories are most effective when your domain has meaningful aggregates and invariants, and your application
          services should read like business workflows rather than SQL scripts. They are less effective when your system
          is essentially a query engine where the database is the domain.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Good Fits</h3>
          <ul className="space-y-2">
            <li>
              <strong>Aggregate-centric domains:</strong> orders, billing accounts, subscriptions, inventory reservations.
            </li>
            <li>
              <strong>Multiple persistence backends:</strong> migrations or hybrid storage where you want to minimize ripple effects.
            </li>
            <li>
              <strong>Clear domain language:</strong> you want the persistence interface to speak in terms the product uses.
            </li>
          </ul>
        </div>
        <p>
          A repository is a means to an end: clearer domain logic and safer evolution. It is not inherently &quot;cleaner&quot;
          than queries-in-services. The repository needs to earn its keep by reducing cognitive load and duplication.
        </p>
      </section>

      <section>
        <h2>The Most Important Boundary: Repositories per Aggregate</h2>
        <p>
          A common failure mode is the &quot;generic repository&quot; that tries to provide one abstraction for all
          entities. It tends to devolve into a leaky abstraction: callers want more query power, so the repository starts
          exposing query builders, database-specific filters, and raw joins, and the separation collapses.
        </p>
        <p>
          A more robust approach is to define repositories around aggregates. Each repository exposes the small set of
          domain-relevant operations for that aggregate. If the product needs a new query shape, you add a method that
          reflects that intent, rather than giving callers a generic query mechanism that encourages ad-hoc persistence logic.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/repository-pattern-diagram-2.svg"
          alt="Decision map for repository design: aggregate boundaries, query exposure, transaction scope, and testing approach"
          caption="Repository design is boundary design: what queries are allowed, which aggregates are loaded, and how transactions are scoped."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Intentful methods:</strong> prefer methods that describe domain intent (find active subscriptions) over
            generic filters (where status equals active).
          </li>
          <li>
            <strong>Explicit transaction scope:</strong> repositories often work best when paired with a unit-of-work
            abstraction so multiple changes commit together.
          </li>
          <li>
            <strong>Controlled loading:</strong> decide what gets loaded eagerly vs lazily; uncontrolled lazy loading is a frequent source of performance issues.
          </li>
          <li>
            <strong>Consistency expectations:</strong> define whether reads are strongly consistent or allowed to be served from replicas or caches.
          </li>
        </ul>
      </section>

      <section>
        <h2>The Hard Part: Performance and Query Shape</h2>
        <p>
          Repository abstractions are easy to design on a whiteboard and hard to keep healthy under real load. The most
          common problem is that domain workflows require query shapes that do not map cleanly to the repository surface.
          Teams then either bypass the repository for performance (fragmenting data access) or keep piling more query
          knobs into the repository (making it leaky and inconsistent).
        </p>
        <p>
          A pragmatic compromise is to keep repositories for writes and aggregate loading, and introduce separate read
          models (CQRS/materialized views) for complex query screens. This avoids forcing one abstraction to satisfy both
          domain invariants and analytics-like reads.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Operational Realities</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/repository-pattern-diagram-3.svg"
          alt="Repository pattern failure modes: leaky abstraction, N+1 queries, inconsistent transaction usage, and bypassed persistence rules"
          caption="Repository problems often show up as performance regressions or inconsistent data access rules across the codebase."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Leaky abstraction</h3>
            <p className="mt-2 text-sm text-muted">
              The repository exposes database-specific concepts, so callers become coupled to the persistence model anyway.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep repositories aggregate-focused and avoid returning persistence-layer query primitives.
              </li>
              <li>
                <strong>Signal:</strong> callers contain persistence-specific branching or raw queries are scattered across services.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">N+1 query explosions</h3>
            <p className="mt-2 text-sm text-muted">
              Lazy loading or repeated repository calls create many small queries that are invisible at small scale and costly at large scale.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> explicit loading plans, batched fetches, and query budgets for request handlers.
              </li>
              <li>
                <strong>Signal:</strong> p99 latency correlates with query count per request rather than query time per query.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Transaction boundary confusion</h3>
            <p className="mt-2 text-sm text-muted">
              Some operations use a unit of work, others do not. Partial commits and race conditions follow.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> define a per-request transaction scope policy and enforce it in application services.
              </li>
              <li>
                <strong>Signal:</strong> correctness bugs that appear only under concurrency, especially around invariants.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Schema changes with unclear ownership</h3>
            <p className="mt-2 text-sm text-muted">
              The repository tries to hide schema changes, but the domain model and persistence model drift and become harder to reason about.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> versioned migrations, explicit mapping layers, and tests that assert persistence invariants.
              </li>
              <li>
                <strong>Signal:</strong> frequent hotfixes around mapping and serialization, or duplicated mapping logic.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Domain Invariants Without SQL in the Service Layer</h2>
        <p>
          Imagine an order workflow that must enforce invariants like &quot;an order cannot transition to shipped unless
          payment is captured&quot; and &quot;inventory reservations must not go negative.&quot; If application services
          directly manipulate tables, those invariants can end up duplicated across many handlers and become difficult to keep consistent.
        </p>
        <p>
          With a repository, application services load the aggregate, apply domain operations, and persist changes as a
          single unit. The repository becomes the point where you can implement consistent persistence behaviors: optimistic
          concurrency checks, transaction scoping, and audit trails.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Make query costs visible:</strong> track query count and query latency per request so repository changes do not silently regress performance.
          </li>
          <li>
            <strong>Enforce access rules:</strong> define which modules can bypass repositories (if any) and treat exceptions as architectural decisions.
          </li>
          <li>
            <strong>Test persistence invariants:</strong> ensure mapping, migrations, and concurrency rules are validated in CI with realistic data sizes.
          </li>
          <li>
            <strong>Plan for read models:</strong> when a screen needs complex joins, consider materialized views rather than bloating the repository interface.
          </li>
          <li>
            <strong>Keep transactions bounded:</strong> long transactions create lock contention; repositories should encourage short, explicit units of work.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are repositories defined around aggregates with domain-intent methods rather than generic query surfaces?
          </li>
          <li>
            Is transaction scoping explicit and consistent across workflows?
          </li>
          <li>
            Are query counts and latencies observable so data access changes do not silently regress p99?
          </li>
          <li>
            Do you have a strategy for complex read queries that does not force the repository to become a query engine?
          </li>
          <li>
            Are mappings and migrations tested so the repository does not hide persistent correctness drift?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes a repository &quot;good&quot; rather than a leaky wrapper?</p>
            <p className="mt-2 text-sm">
              It expresses domain intent, avoids exposing persistence primitives, and pairs cleanly with transaction scope so invariants remain enforceable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When would you skip repositories entirely?</p>
            <p className="mt-2 text-sm">
              When the database schema is effectively the domain model, or when the workload is dominated by complex ad-hoc queries where a repository adds friction without reducing complexity.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do repositories interact with CQRS?</p>
            <p className="mt-2 text-sm">
              Repositories commonly own the write model and aggregate loading, while read models are served from separate projections optimized for query shapes.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
