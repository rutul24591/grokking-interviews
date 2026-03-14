"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-per-service-extensive",
  title: "Database per Service",
  description:
    "Give each service ownership over its data store to enable independent evolution, then manage cross-service consistency with explicit contracts and workflows.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "database-per-service",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "microservices", "databases"],
  relatedTopics: [
    "microservices-architecture",
    "shared-database-anti-pattern",
    "saga-pattern",
    "event-driven-architecture",
    "materialized-view-pattern",
  ],
};

export default function DatabasePerServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Data Ownership as a Service Boundary</h2>
        <p>
          <strong>Database per service</strong> is a microservices pattern where each service owns its persistence. Other
          services do not read or write that database directly; they interact through explicit APIs or events. The goal is
          to preserve autonomy: a service can evolve its schema and scale its storage without coordinating with every
          consumer.
        </p>
        <p>
          This pattern is a response to the shared database anti-pattern. If services share tables as their integration
          contract, independent deployment becomes an illusion. Database per service makes the contract explicit and
          versionable.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/database-per-service-diagram-1.svg"
          alt="Multiple services each owning their own database and integrating via APIs and events"
          caption="Database per service turns data access into explicit contracts, enabling independent evolution and ownership."
        />
      </section>

      <section>
        <h2>What You Gain: Autonomy, Isolation, and Evolvability</h2>
        <p>
          The primary benefit is organizational. Services can ship schema changes without coordinating with unrelated
          teams, and failures in one data store are less likely to cascade across the entire product. The pattern also
          supports heterogeneous storage: one service can use a relational database while another uses a document store.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Independent schema evolution:</strong> you can refactor tables without breaking other services that
            were joining directly.
          </li>
          <li>
            <strong>Performance isolation:</strong> heavy workloads (reports, backfills) do not contend on one shared
            primary database.
          </li>
          <li>
            <strong>Security:</strong> least privilege is simpler when services do not share broad database credentials.
          </li>
        </ul>
        <p className="mt-4">
          Importantly, this does not eliminate cross-service data needs. It forces you to satisfy those needs through
          explicit integration mechanisms rather than through implicit joins.
        </p>
      </section>

      <section>
        <h2>The Cost: Distributed Consistency and Reporting</h2>
        <p>
          Database per service pushes complexity into cross-service workflows. If a user action updates multiple services
          (order, payment, inventory), you can no longer rely on one database transaction. You need explicit consistency
          contracts: what is atomic, what is eventual, what can be compensated, and what must be reconciled.
        </p>
        <p>
          Reporting and analytics also become harder. In a shared DB world, you join tables directly. In database-per-service
          systems, analytics usually relies on events, CDC, or replicated read models in a warehouse.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/database-per-service-diagram-2.svg"
          alt="Decision map for cross-service consistency: APIs, events, sagas, and read models"
          caption="The pattern replaces cross-table joins with explicit workflows and derived read models."
        />
      </section>

      <section>
        <h2>Integration Patterns That Make It Work</h2>
        <p>
          Database per service becomes practical when paired with patterns for reliable propagation and recomputation.
          The recurring theme is to treat cross-service data as a product: versioned, owned, and observable.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Building Blocks</h3>
          <ul className="space-y-2">
            <li>
              <strong>Events and subscriptions:</strong> services publish domain events so others can build local read
              models.
            </li>
            <li>
              <strong>Transactional outbox:</strong> ensures events reflect committed state changes and can be retried
              safely.
            </li>
            <li>
              <strong>Sagas:</strong> coordinate multi-step workflows with compensations instead of cross-service
              transactions.
            </li>
            <li>
              <strong>Materialized views:</strong> create query-friendly views in dedicated stores rather than joining
              across service databases.
            </li>
            <li>
              <strong>Reconciliation:</strong> periodic audits that detect and repair drift between services.
            </li>
          </ul>
        </div>
        <p>
          The important point: you are building a system where correctness emerges from contracts, idempotency, and
          operational discipline, not from a single ACID transaction.
        </p>
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <p>
          With multiple databases, operational maturity matters. You now monitor and scale multiple stores, manage
          backups and migrations per service, and debug incidents where data is temporarily inconsistent across services.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Schema change safety:</strong> migrations must be compatible with old and new service versions during
            rolling deploys.
          </li>
          <li>
            <strong>Backfills and replays:</strong> derived read models must support rebuilds when logic changes.
          </li>
          <li>
            <strong>Data access governance:</strong> forbid &quot;just connect to the DB&quot; shortcuts; provide sanctioned
            read APIs or replicated analytics datasets.
          </li>
        </ul>
        <p className="mt-4">
          Teams often underestimate the cultural side: engineers used to shared joins must learn to design explicit
          contracts and to accept eventual consistency where appropriate.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/database-per-service-diagram-3.svg"
          alt="Database per service failure modes: drift between services, missing events, and inconsistent read models"
          caption="The failures shift from schema coupling to workflow drift. Observability and reconciliation become first-class."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Event loss or duplication:</strong> consumers build incorrect views. Mitigation: outbox, idempotent
            consumers, and replay support.
          </li>
          <li>
            <strong>Workflow gaps:</strong> one step succeeds but another fails. Mitigation: saga coordination and clear
            compensations.
          </li>
          <li>
            <strong>Drift:</strong> services disagree about state. Mitigation: reconciliation jobs and invariants.
          </li>
          <li>
            <strong>Analytics fragmentation:</strong> teams invent shadow joins by copying data ad hoc. Mitigation:
            provide a governed analytics pipeline and shared read models.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Orders and Inventory</h2>
        <p>
          An orders service owns order state; an inventory service owns stock levels. A user places an order. The system
          must reserve inventory and confirm the order. With database per service, you cannot do one transaction across
          both stores. Instead, orders initiates a workflow: it requests a reservation, then confirms or compensates if
          reservation fails.
        </p>
        <p>
          For read-heavy UI views, a separate read model is built from events so clients do not need to query both
          services and reconcile data themselves. The system is explicit about eventual consistency and has reconciliation
          alarms to detect drift.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use database per service to enable independent evolution and to avoid shared-schema coupling.</li>
          <li>Replace cross-table joins with explicit contracts: APIs, events, and derived read models.</li>
          <li>Define consistency semantics per workflow and implement coordination (sagas/outbox) where needed.</li>
          <li>Plan for backfills and replays; treat read models as rebuildable artifacts, not as permanent truth.</li>
          <li>Monitor drift and build reconciliation to detect silent correctness issues.</li>
          <li>Enforce governance to prevent shadow coupling through ad hoc data access.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does database per service enable?</p>
            <p className="mt-2 text-sm">
              A: Independent evolution and ownership: schema changes, scaling, and operational policies can change per
              service without global coordination.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What trade-offs does it introduce?</p>
            <p className="mt-2 text-sm">
              A: Cross-service consistency becomes a workflow problem (sagas, idempotency), and analytics/reporting often
              requires events or replication rather than joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do services share data without sharing databases?</p>
            <p className="mt-2 text-sm">
              A: APIs and events for authoritative interactions, plus derived read models/materialized views for query
              workloads.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect and repair drift?</p>
            <p className="mt-2 text-sm">
              A: Reconciliation jobs, invariants, idempotent processing, and the ability to replay events and rebuild
              read models.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

