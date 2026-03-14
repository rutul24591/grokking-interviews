"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-shared-database-anti-pattern-extensive",
  title: "Shared Database Anti-Pattern",
  description:
    "Why letting multiple services share a database creates hidden coupling, and the practical steps to regain ownership and evolve safely.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "shared-database-anti-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "microservices", "databases"],
  relatedTopics: ["database-per-service", "microservices-architecture", "strangler-fig-pattern", "anti-corruption-layer"],
};

export default function SharedDatabaseAntiPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Shared Persistence as Hidden Coupling</h2>
        <p>
          The <strong>shared database anti-pattern</strong> occurs when multiple services read and write the same database
          schema as their primary integration mechanism. Even if services have separate codebases and deployment
          pipelines, a shared schema creates a shared fate: schema changes, performance contention, and data semantics
          become cross-team coordination problems.
        </p>
        <p>
          This pattern is tempting because it feels like a &quot;single source of truth.&quot; But in service-oriented
          systems, the database is not just storage; it becomes an API. When that API is implicit (tables as interfaces),
          it is hard to version, hard to secure, and hard to evolve.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/shared-database-anti-pattern-diagram-1.svg"
          alt="Multiple services reading and writing a shared database schema"
          caption="A shared schema turns database tables into unversioned APIs, coupling service evolution and incident behavior."
        />
      </section>

      <section>
        <h2>Why Teams Do It (and Why It Feels Productive)</h2>
        <p>
          Shared databases usually start as a pragmatic choice: one team, one system, one schema. The problem appears
          later, when teams split and services are extracted but the schema remains shared. The shared DB then becomes the
          path of least resistance for integration: &quot;just add a column&quot; or &quot;just join that table.&quot;
        </p>
        <p>
          The productivity is real in the short term. The long-term cost is hidden. Over time, you cannot change schema
          without coordinating many services, and you cannot isolate failures because all services compete on the same DB
          resources.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">The Hidden Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Release coupling:</strong> schema migrations require synchronized service deploys.
            </li>
            <li>
              <strong>Semantic drift:</strong> different services interpret the same columns differently.
            </li>
            <li>
              <strong>Performance contention:</strong> one workload can saturate the DB and degrade unrelated services.
            </li>
            <li>
              <strong>Security risk:</strong> broad DB credentials allow accidental or unauthorized access across domains.
            </li>
            <li>
              <strong>Debugging complexity:</strong> it is unclear which service &quot;owns&quot; a table or a query
              pattern.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>How Shared Databases Break Service Boundaries</h2>
        <p>
          The most damaging aspect is ownership ambiguity. If service A owns &quot;orders&quot; and service B writes to the
          orders table directly, you have bypassed the domain boundary. Service B can now violate invariants that service
          A would normally enforce through its API.
        </p>
        <p>
          Over time, services begin to rely on database details: column meanings, join behavior, indexing strategies, and
          migration timelines. The DB schema becomes the integration contract, but it is not designed or governed as such.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/shared-database-anti-pattern-diagram-2.svg"
          alt="Decision map showing risks of shared databases and mitigation approaches like schema ownership and APIs"
          caption="The goal is to restore ownership: tables become internal implementation details behind explicit service contracts."
        />
      </section>

      <section>
        <h2>When Sharing Is Acceptable (and How to Keep It Safe)</h2>
        <p>
          Not all database sharing is wrong. In a monolith, a single schema is normal. In a small organization, a shared
          DB can be a reasonable transitional choice. The anti-pattern is uncontrolled sharing in systems that claim
          independent service ownership.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Acceptable:</strong> a monolith with internal modular boundaries and one deployment unit.
          </li>
          <li>
            <strong>Sometimes acceptable:</strong> read-only access for analytics or reporting, with strict governance.
          </li>
          <li>
            <strong>Risky:</strong> multiple services writing each other&apos;s tables as a primary integration method.
          </li>
        </ul>
        <p className="mt-4">
          If sharing is temporary, treat it explicitly as a migration state. Add guardrails: schema ownership, least
          privilege credentials, and contracts that discourage cross-service writes.
        </p>
      </section>

      <section>
        <h2>Mitigation Strategies</h2>
        <p>
          The path out of the shared DB anti-pattern is to turn implicit contracts into explicit contracts and to move
          from shared writes to owned writes.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/shared-database-anti-pattern-diagram-3.svg"
          alt="Migration path diagram from shared database to owned schemas and database per service"
          caption="Migrations out of shared DB start with ownership and access control, then move toward explicit APIs and separated stores."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Schema ownership and access control:</strong> define owners per table and restrict who can write.
          </li>
          <li>
            <strong>API-first integration:</strong> require services to call each other through APIs/events rather than
            through joins.
          </li>
          <li>
            <strong>Views and read models:</strong> provide read-friendly representations without granting write access.
          </li>
          <li>
            <strong>CDC/event replication:</strong> publish changes as events so other services can build local read
            models without shared writes.
          </li>
          <li>
            <strong>Incremental extraction:</strong> move one table/domain at a time behind a service boundary.
          </li>
        </ul>
        <p className="mt-4">
          The goal is not purity. The goal is to reduce coordination and correctness risk by making ownership explicit.
        </p>
      </section>

      <section>
        <h2>Scenario Walkthrough: Two Services, One Orders Table</h2>
        <p>
          An &quot;orders&quot; service and a &quot;shipping&quot; service share a database. Shipping writes directly to the
          orders table to mark orders as shipped. Over time, the orders service adds invariants (for example, &quot;do not
          ship unpaid orders&quot;), but shipping bypasses those checks because it writes directly. A correctness incident
          occurs when orders are shipped without payment.
        </p>
        <p>
          The mitigation is to restore ownership: shipping calls an orders API to transition state, and orders publishes
          an event when shipment is allowed. Shipping builds a local read model for its queries. The shared DB was not the
          root cause by itself; the root cause was bypassing domain boundaries through shared writes.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Treat tables as APIs: if multiple services depend on them, you need versioning and ownership.</li>
          <li>Avoid cross-service writes; enforce domain boundaries through explicit APIs and events.</li>
          <li>If sharing is temporary, make it explicit and add guardrails: least privilege, ownership, and auditability.</li>
          <li>Use read models, views, and CDC to reduce the need for cross-service joins and shared credentials.</li>
          <li>Migrate incrementally by domain: extract one capability at a time behind a service boundary.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is a shared database considered an anti-pattern for microservices?</p>
            <p className="mt-2 text-sm">
              A: It creates hidden coupling: schema changes, performance contention, and semantic drift become
              cross-service coordination problems, undermining independent deployment and ownership.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When is sharing a database acceptable?</p>
            <p className="mt-2 text-sm">
              A: In a monolith or as a transitional state with strict ownership and access control, and sometimes for
              read-only analytics with governance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a practical migration path away from a shared DB?</p>
            <p className="mt-2 text-sm">
              A: Establish ownership and least privilege, move integrations to APIs/events, introduce read models and CDC,
              and extract domains incrementally.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the core correctness risk of shared writes?</p>
            <p className="mt-2 text-sm">
              A: Services can bypass invariants and state transitions that should be enforced by the owning domain,
              creating silent correctness drift.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

