"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-shared-database-anti-pattern-extensive",
  title: "Shared Database Anti-Pattern",
  description:
    "Why letting multiple services share a database creates hidden coupling, the data coupling problems and schema contention it causes, migration strategies including CDC and dual-write, and when sharing is actually acceptable.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "shared-database-anti-pattern",
  wordCount: 5600,
  readingTime: 23,
  lastUpdated: "2026-04-08",
  tags: ["backend", "architecture", "microservices", "databases", "anti-patterns", "data-coupling"],
  relatedTopics: ["database-per-service", "microservices-architecture", "strangler-fig-pattern", "anti-corruption-layer", "cdc-pattern"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>shared database anti-pattern</strong> occurs when two or more independently deployed services read from and write to the same database schema as their primary integration mechanism. Even when services maintain separate codebases, repositories, and deployment pipelines, a shared schema creates a <strong>shared fate</strong>: schema migrations, performance contention, data semantics, and incident response become cross-team coordination problems that undermine the very independence microservices promise to deliver.
        </p>
        <p>
          This pattern is exceptionally tempting because it feels like a &ldquo;single source of truth.&rdquo; In a monolithic application, a single database is not only acceptable but expected. The problem emerges when teams extract services from a monolith or build new services but leave the database shared. The shared database then becomes the path of least resistance for service-to-service integration: &ldquo;just add a column,&rdquo; &ldquo;just query that table directly,&rdquo; or &ldquo;just join against the users table.&rdquo; Each of these decisions feels harmless in isolation but collectively erodes service boundaries.
        </p>
        <p>
          In service-oriented systems, the database is not merely persistent storage; it becomes an implicit API. When that API is implicit—tables and columns acting as interfaces—it is extraordinarily difficult to version, difficult to secure, and difficult to evolve without breaking consumers. A shared schema turns every column change into a potentially breaking change for every service that reads it.
        </p>
        <p>
          The distinction between a shared database and a database-per-service architecture is fundamental. In a <strong>database-per-service</strong> model, each service owns its data exclusively: no other service may read or write directly to that database. All cross-service data access happens through explicit APIs or event streams. In a <strong>shared database</strong> model, multiple services have direct read and write access to the same tables, creating implicit contracts that are not governed, not versioned, and not monitored for breakage.
        </p>
        <p>
          For staff and principal engineers, understanding this anti-pattern is essential because it sits at the intersection of data architecture, organizational boundaries, and system reliability. The decision to share or isolate databases shapes how teams can move independently, how failures cascade, and how the system evolves over years of incremental change.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/shared-db-vs-db-per-service.svg"
          alt="Comparison diagram showing shared database architecture (multiple services connected to one database) versus database-per-service architecture (each service with its own database, communicating via APIs)"
          caption="Shared database versus database-per-service — in the shared model, tables become unversioned APIs coupling service evolution; in the database-per-service model, each service owns its data and communicates through explicit contracts."
        />
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <h3>Data Coupling Through Shared Persistence</h3>
        <p>
          Data coupling is the most insidious form of service coupling because it is invisible in code-level dependency graphs. When service A reads from a table that service B writes to, there is no import statement, no function call, and no API contract that reveals the dependency. The coupling lives entirely in the database schema. This makes the dependency invisible to build systems, invisible to deployment pipelines, and invisible to developers who join the team months later.
        </p>
        <p>
          The coupling manifests in several concrete ways. <strong>Schema coupling</strong> means that any column added, removed, renamed, or retyped affects every service that queries that table. A service that added an index to optimize its own queries can degrade write performance for other services sharing the table. <strong>Semantic coupling</strong> occurs when services interpret the same column differently: one service treats a nullable <code>status</code> field as &ldquo;pending when null&rdquo; while another treats it as &ldquo;unknown when null.&rdquo; <strong>Temporal coupling</strong> arises when services must be deployed in a specific order because a schema migration changes the data format that downstream services expect.
        </p>
        <p>
          Data coupling also creates correctness risks. When service B writes directly to a table that service A considers its domain, service B can violate invariants that service A would normally enforce. For example, if an Orders service enforces &ldquo;do not ship unpaid orders&rdquo; through application logic, but a Shipping service writes directly to the orders table to mark an order as shipped, the invariant is silently bypassed. The shared database enables correctness failures that are extremely difficult to detect because no single service is responsible for the full state transition.
        </p>

        <h3>Schema Contention and Ownership Ambiguity</h3>
        <p>
          Schema contention occurs when multiple teams need to modify the same tables. Without clear ownership, every schema change becomes a negotiation. Team A wants to split a monolithic <code>address</code> column into structured fields. Team B relies on the existing column format for a reporting pipeline. Team C wants to add a new index that Team A&rsquo;s workload will degrade. These are not technical disagreements; they are organizational boundary disputes manifested as schema conflicts.
        </p>
        <p>
          Ownership ambiguity compounds the problem. When multiple services write to the same table, no single team feels responsible for its health. Index decisions, partitioning strategies, archival policies, and data quality rules become everyone&rsquo;s problem and therefore no one&rsquo;s problem. The database degrades gradually: queries slow down, storage grows unchecked, and data quality erodes because no team has the mandate or the authority to enforce standards.
        </p>

        <h3>Performance Contention on Shared Resources</h3>
        <p>
          Performance contention is the most visible symptom of a shared database. When multiple services share a database, they compete for the same connection pool, the same I/O bandwidth, the same buffer cache, and the same lock manager. A poorly optimized query from one service can saturate these resources and degrade performance for all other services, even if those services are well-designed.
        </p>
        <p>
          This creates a noisy-neighbor problem at the database layer. Service A runs a full-table scan on a large table during peak hours. The database&rsquo;s buffer cache fills with cold data, evicting hot data that services B and C need. Services B and C experience latency spikes, but the root cause is in service A&rsquo;s query pattern. Diagnosing this requires database-level observability that spans service boundaries, which is often unavailable in organizations that have split into service teams without splitting their databases.
        </p>
        <p>
          Connection pool exhaustion is a particularly common failure mode. Each service maintains its own connection pool. When multiple services share a database, the total number of connections is the sum of all pools. If each of five services maintains a pool of twenty connections, the database must handle one hundred concurrent connections. PostgreSQL, for example, performs poorly beyond a few hundred connections, so the aggregate pool can saturate the database even when individual services are well within their limits.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/shared-db-contention-diagram.svg"
          alt="Diagram showing three types of contention in shared databases: schema contention (multiple teams modifying same tables), performance contention (competing for connection pools, I/O, buffer cache), and ownership ambiguity (no clear responsibility for data quality)"
          caption="Three dimensions of shared database contention — schema contention blocks independent evolution, performance contention creates cross-service latency spikes, and ownership ambiguity means no team is accountable for database health."
        />

        <h3>Security and Compliance Implications</h3>
        <p>
          Shared databases create security challenges that are difficult to mitigate without significant operational overhead. When multiple services share credentials to the same database, the principle of least privilege is violated by default. Service A, which only needs to read order summaries, inevitably has the same read-write access as Service B, which manages order lifecycle. This broad access increases the blast radius of any credential compromise and makes it impossible to enforce data access policies at the database layer.
        </p>
        <p>
          Compliance requirements like GDPR, HIPAA, and PCI-DSS further complicate shared databases. GDPR&rsquo;s right to erasure requires that personal data be deletable. If personal data is spread across multiple tables accessed by multiple services, coordinating deletion across all consumers is complex. PCI-DSS requires strict access controls around payment data, which are nearly impossible to enforce when multiple services share the same database credentials. Audit logging becomes ambiguous because the database cannot distinguish which service performed a given operation when they all authenticate with the same credentials.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>How Shared Databases Emerge in Practice</h3>
        <p>
          Shared databases rarely start as an architectural decision. They emerge through a predictable sequence of events. A monolith is built with a single database, which is the correct default for a single deployment unit. As the organization grows, teams extract services from the monolith to improve development velocity and deployment independence. The services are deployed separately, but they continue to read and write the original monolith database because migrating data is expensive and risky. Over time, new services are built that also connect to the shared database because it is the easiest integration path. The shared database becomes the system&rsquo;s central nervous system: every service depends on it, and no team can change it without coordinating with every other team.
        </p>
        <p>
          This emergence pattern is important because it means the shared database is not a design choice; it is a <strong>migration state</strong> that became permanent. Treating it as a permanent architecture is the anti-pattern. Treating it as a transitional state with explicit guardrails and a migration plan is a pragmatic engineering decision.
        </p>

        <h3>Migration Strategies: Escaping the Shared Database</h3>
        <p>
          The path out of a shared database requires turning implicit contracts into explicit ones and moving from shared writes to owned writes. Several strategies exist, each with different risk profiles and operational complexity. The choice depends on the organization&rsquo;s tolerance for risk, the complexity of the existing schema, and the urgency of decoupling.
        </p>
        <p>
          <strong>Change Data Capture (CDC)</strong> is one of the safest migration strategies. A CDC tool like Debezium reads the database&rsquo;s write-ahead log and publishes every change as an event to a message broker. Consuming services subscribe to these events and build local read models. The consuming services no longer need direct database access; they maintain their own copy of the data through event replication. CDC is non-invasive because it reads the transaction log without modifying application code. It provides eventual consistency, which is acceptable for most read scenarios. The operational complexity is moderate: you need a CDC pipeline, a message broker, and consumers that handle out-of-order or duplicate events.
        </p>
        <p>
          <strong>Dual-write</strong> is a transitional strategy where the owning service writes to both the old shared table and its new database. Over time, consumers migrate to reading from the new database via the service&rsquo;s API. The dual-write ensures that both stores remain synchronized during migration. The risk is inconsistency: if one write succeeds and the other fails, the two stores diverge. Mitigations include using a single transaction where possible (if both databases are on the same instance) or implementing compensating transactions to roll back the successful write when the other fails. Dual-write is simpler than CDC but carries higher correctness risk.
        </p>
        <p>
          <strong>The Strangler Fig pattern</strong> gradually replaces functionality behind the shared database by routing traffic to new services with their own databases. A facade or proxy sits in front of the shared database and routes requests: some go to the legacy path (shared database), others go to the new service path (owned database). Over time, more functionality is strangulated until the shared database is no longer needed for the migrated domain. This pattern is the safest because it allows incremental migration with rollback at every step. The cost is operational complexity: you maintain two data stores and a routing layer during the transition.
        </p>
        <p>
          <strong>Read replica isolation</strong> is a lighter-weight approach for services that only need read access. Instead of reading directly from the primary database, read-only consumers connect to a read replica. This reduces performance contention on the primary and provides a natural migration path: the read replica can later be replaced by a materialized view or a CDC-built read model. This does not address write coupling, but it is a practical first step for organizations with many read-heavy consumers.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/shared-db-migration-strategies.svg"
          alt="Migration strategies flowchart showing four paths from shared database: CDC (read WAL → publish events → build local read models), Dual-Write (write to both old and new stores → migrate consumers → decommission old), Strangler Fig (facade routes traffic → gradually shift to new services → decommission shared DB), and Read Replica Isolation (read-only consumers → read replica → eventual materialized view)"
          caption="Migration strategies from shared database — CDC for non-invasive event replication, dual-write for transitional migration, strangler fig for incremental replacement with rollback, and read replica isolation for read-heavy consumers."
        />

        <h3>When Sharing Is Acceptable</h3>
        <p>
          Not all database sharing is wrong. The anti-pattern is <strong>uncontrolled</strong> sharing in systems that claim independent service ownership. There are legitimate cases where sharing is acceptable or even preferred.
        </p>
        <p>
          <strong>Monolithic applications</strong> with internal modular boundaries and a single deployment unit correctly use a single database. The database is an implementation detail of the monolith, not an integration mechanism between services.
        </p>
        <p>
          <strong>Read-only analytics and reporting</strong> can legitimately share database access through read replicas, provided there is strict governance: the analytics team gets read-only credentials, queries are reviewed for performance impact, and the replica is sized to handle analytical workloads without affecting the primary.
        </p>
        <p>
          <strong>Event sourcing</strong> architectures sometimes share an event store, which is append-only and therefore eliminates write contention. Multiple services can read from the same event log without coupling, because the event log is an immutable record of facts, not a mutable schema subject to interpretation.
        </p>
        <p>
          <strong>Small organizations</strong> with a handful of engineers and a small number of services may find that a shared database is a reasonable transitional choice. The coordination overhead is manageable when the team is small and co-located. The key is to recognize it as transitional and to establish ownership and access controls from the start.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Shared Database Versus Database-Per-Service</h3>
        <p>
          The fundamental trade-off between shared databases and database-per-service architectures is between short-term development velocity and long-term organizational scalability. A shared database enables rapid development in the early stages of a system because data integration requires no API design, no event schema, and no data synchronization logic. Teams can query directly, join across domains, and iterate quickly. This velocity is real and valuable for startups and small teams.
        </p>
        <p>
          The cost compounds over time. As the number of services grows, the coordination overhead of schema changes grows quadratically. Each schema change potentially affects every service that reads that table. Performance isolation disappears: one service&rsquo;s inefficient query degrades everyone. Security boundaries blur because shared credentials prevent fine-grained access control. The database becomes a bottleneck for organizational growth because every team&rsquo;s velocity is constrained by the team with the slowest schema review process.
        </p>
        <p>
          Database-per-service reverses this trade-off. Initial development is slower because every cross-service data access requires an API call or an event subscription. Data consistency becomes eventual rather than immediate. Teams must design APIs, handle failures, and manage data synchronization. However, each service can evolve its schema independently, deploy without coordinating with other teams, isolate its performance characteristics, and enforce its own security policies. The system scales organizationally because each team owns its data and its contracts.
        </p>

        <h3>Consistency Trade-offs in Migration</h3>
        <p>
          Every migration strategy away from a shared database involves a consistency trade-off. CDC provides eventual consistency: consuming services see changes seconds after they are committed. For most read scenarios, this is acceptable. For scenarios requiring strong consistency, such as enforcing business invariants, CDC is insufficient and the owning service&rsquo;s API must be called synchronously.
        </p>
        <p>
          Dual-write risks inconsistency between the old and new stores during migration. If the write to the new store fails after the old store succeeds, the two stores diverge. Compensating transactions can mitigate this but add complexity. The strangler fig pattern avoids this by routing all traffic through a facade that ensures only one path is active for any given request, but it requires maintaining the routing layer and both data stores during the transition.
        </p>
        <p>
          The staff-level insight is that strong consistency is rarely needed for cross-service data access. Most cross-service dependencies are for reads: displaying information, generating reports, or triggering asynchronous workflows. These can tolerate eventual consistency. The exceptions are write-side invariants that must be enforced atomically, and those should be handled within the owning service&rsquo;s transaction boundary.
        </p>

        <h3>Operational Complexity Versus Coupling Cost</h3>
        <p>
          Database-per-service increases operational complexity: more databases to manage, more backups to schedule, more monitoring dashboards to maintain. CDC pipelines, event brokers, and API gateways add infrastructure that must be operated. However, this complexity is bounded and predictable. Each service team manages its own database, and the complexity scales linearly with the number of services.
        </p>
        <p>
          Shared database complexity is unbounded and unpredictable. The database becomes a shared concern that requires cross-team coordination for every change. The complexity scales with the square of the number of services because each new service potentially affects every existing service&rsquo;s queries, performance, and schema evolution. The operational cost is hidden in the coordination overhead, the delayed releases, and the incidents caused by cross-service interference.
        </p>
        <p>
          The pragmatic approach is to accept operational complexity in exchange for decoupling, because decoupling enables the organization to scale. A team of ten engineers can share a database productively. A team of one hundred engineers across ten teams cannot. The inflection point depends on the organization, but the direction is always the same: as the organization grows, the cost of coupling grows faster than the cost of operational complexity.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Establish Clear Data Ownership</h3>
        <p>
          Every table in every database should have a single owning service or team. The owner defines the schema, enforces invariants, manages migrations, and is responsible for data quality. This ownership should be documented and enforced through database credentials: only the owning service should have write access to its tables. Other services that need data should access it through the owner&rsquo;s API or through event subscriptions.
        </p>
        <p>
          Ownership extends beyond write access. The owning service should define the semantic meaning of each column, the valid ranges for values, the lifecycle rules for rows, and the archival and deletion policies. When another service needs data, it should request it through a stable contract—an API endpoint or an event schema—not through direct table access.
        </p>

        <h3>Use Explicit APIs for Cross-Service Data Access</h3>
        <p>
          Replace direct database queries with API calls. This makes dependencies visible, versionable, and monitorable. An API contract can be versioned so that breaking changes are explicit and consumers can migrate at their own pace. API calls can be monitored for latency, error rate, and throughput, providing observability that is impossible with direct database access.
        </p>
        <p>
          For read-heavy consumers, build read APIs that are optimized for their query patterns. Do not expose a generic &ldquo;query the table&rdquo; API; instead, design specific endpoints that return the data the consumer needs. This allows the owning service to optimize the query, add caching, and control the load on its database.
        </p>

        <h3>Implement CDC for Event-Driven Read Models</h3>
        <p>
          For services that need data from other domains, implement CDC to build local read models. This eliminates the need for direct database access while providing data freshness suitable for most use cases. The consuming service owns its read model and can optimize it for its query patterns without affecting the source database.
        </p>
        <p>
          CDC also provides a natural audit trail. Every change is captured as an event, which can be replayed, inspected, and used for debugging. This is valuable for compliance requirements and for understanding how data evolved over time.
        </p>

        <h3>Apply Least Privilege to Database Credentials</h3>
        <p>
          Each service should have database credentials scoped to the minimum access it needs. If a service only reads from a table, it should have read-only credentials. If a service owns a table, it should have read-write access only to that table. This limits the blast radius of credential compromise and prevents accidental cross-service writes.
        </p>
        <p>
          Implement credential rotation and audit database access regularly. Monitor for queries that access tables outside the service&rsquo;s ownership domain, and alert on unauthorized access attempts. This provides early detection of coupling before it becomes a systemic problem.
        </p>

        <h3>Treat Migration as an Incremental Process</h3>
        <p>
          Never attempt a big-bang migration of a shared database. Migrate one domain or one table group at a time. Start by declaring ownership for each table, then restrict write access to the owner, then migrate read paths to APIs or CDC-based read models, and finally extract the storage behind the service boundary. Each step should be reversible, and each step should provide measurable improvement in decoupling.
        </p>
        <p>
          Instrument the dependency graph before starting the migration. Track which services read which tables and which services write to which tables. This dependency map guides the migration order and provides a baseline for measuring progress.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          The most common pitfall is treating the shared database as a permanent architecture rather than a migration state. Teams accept the coordination overhead as &ldquo;just how things work&rdquo; and stop questioning whether the coupling is necessary. This is organizational learned helplessness, and it is the single biggest barrier to decoupling.
        </p>
        <p>
          Another pitfall is migrating storage without migrating access patterns. Teams move a table to a new database but continue to allow other services to query it directly through the new database&rsquo;s connection string. The physical location of the data changed, but the coupling did not. The migration provided no decoupling benefit and incurred all the operational cost.
        </p>
        <p>
          Dual-write without compensating transactions is a frequent correctness failure. Teams write to both the old and new stores but do not handle the case where one write succeeds and the other fails. The two stores diverge, and the divergence is discovered weeks later when data inconsistency causes a production incident. The fix is to use compensating transactions or to adopt CDC, which reads the transaction log and guarantees that every committed change is captured exactly once.
        </p>
        <p>
          Ignoring the semantic coupling problem is another pitfall. Teams focus on schema changes and performance but overlook the fact that different services interpret the same data differently. A <code>status</code> field meaning &ldquo;pending&rdquo; to one service might mean &ldquo;awaiting review&rdquo; to another. Without explicit contracts, these semantic differences cause subtle correctness bugs that are extremely difficult to diagnose.
        </p>
        <p>
          Underestimating the effort required for dependency mapping is a planning pitfall. In a mature shared database, the dependency graph is complex and undocumented. Services read tables through ORMs, raw SQL, stored procedures, and ad hoc query tools. Mapping all dependencies requires code analysis, query log analysis, and conversations with every team that has ever written a query. Without this map, migration plans are incomplete and frequently blocked by unexpected dependencies.
        </p>
        <p>
          Finally, attempting to achieve strong consistency across service boundaries is a design pitfall. Distributed transactions across services are complex, slow, and fragile. The two-phase commit protocol is rarely appropriate for service-to-service communication. Instead, embrace eventual consistency for cross-service reads and keep strong consistency within each service&rsquo;s transaction boundary.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Platform: Orders and Shipping Coupling</h3>
        <p>
          A mid-size e-commerce platform had an Orders service and a Shipping service sharing a database. The Shipping service wrote directly to the <code>orders</code> table to update shipment status. Over time, the Orders service added business invariants: orders could not be shipped until payment was confirmed, inventory was allocated, and fraud checks passed. However, the Shipping service bypassed these checks because it wrote directly to the table. A correctness incident occurred when orders were shipped without payment confirmation, resulting in unrecoverable revenue loss.
        </p>
        <p>
          The resolution was to restore ownership. The Orders service became the sole writer of the <code>orders</code> table and exposed a <code>transitionShipment</code> API that enforced all invariants. The Shipping service called this API to request shipment. The Orders service published a <code>ShipmentApproved</code> event, which the Shipping service consumed to build a local read model of shippable orders. CDC via Debezium replicated order data to the Shipping service&rsquo;s read model. The shared database was eliminated for this domain, and correctness incidents dropped to zero.
        </p>

        <h3>Financial Services: Regulatory Compliance and Data Isolation</h3>
        <p>
          A financial services company had multiple services sharing a database containing customer PII and transaction data. When PCI-DSS audit requirements increased, the company could not demonstrate which service accessed which data because all services shared the same database credentials. The audit identified this as a critical finding.
        </p>
        <p>
          The company implemented database-per-service with CDC-based data sharing. Each service got its own database with scoped credentials. Cross-service data access happened through APIs for synchronous queries and CDC pipelines for asynchronous data replication. The audit trail became clear because each service&rsquo;s database access was isolated and logged. The company passed the PCI-DSS audit with no findings related to data access controls.
        </p>

        <h3>SaaS Platform: Strangler Fig Migration from Monolith</h3>
        <p>
          A SaaS company with a large monolithic database needed to extract services to improve deployment velocity. They used the strangler fig pattern: a routing proxy sat in front of the monolith and gradually routed requests to new services with their own databases. Each extraction followed the same pattern. Declare ownership for the domain being extracted. Build the new service with its own database. Route reads to the new service first, using the monolith as a fallback. Route writes to the new service. Monitor for correctness issues. Once confident, remove the fallback and decommission the monolith&rsquo;s tables for that domain.
        </p>
        <p>
          Over eighteen months, they extracted twelve services from the monolith. The monolith database shrank from two hundred tables to thirty tables serving legacy functionality. Deployment frequency increased from weekly to daily because services could be deployed independently. The routing proxy added approximately five milliseconds of latency, which was acceptable for their use case.
        </p>

        <h3>Media Company: Read Replica for Analytics</h3>
        <p>
          A media company had an analytics team running heavy aggregation queries against the production database during peak hours. These queries competed with user-facing services for database resources, causing latency spikes for end users. The analytics team needed real-time data for their dashboards, but their queries were degrading the user experience.
        </p>
        <p>
          The solution was to provision a read replica specifically for analytics workloads. The analytics team received read-only credentials scoped to the replica. Heavy queries ran against the replica, isolating their performance impact from the production database. The replica was sized to handle analytical workloads with additional memory for aggregation operations. This did not eliminate the shared database entirely, but it addressed the most visible symptom—performance contention—while providing a foundation for further decoupling through CDC-based read models in the future.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why is a shared database considered an anti-pattern in microservices architecture?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A shared database is an anti-pattern because it creates hidden coupling between services that undermines the core benefits of microservices: independent deployment, independent evolution, and clear ownership. When multiple services read and write the same schema, schema changes require cross-team coordination, performance contention in one service degrades all others, and data semantics can drift between services interpreting the same columns differently.
            </p>
            <p>
              The database becomes an implicit API that is unversioned, unmonitored, and unsecured. Services can bypass each other&rsquo;s business invariants by writing directly to shared tables, creating correctness risks that are extremely difficult to detect. In a production incident, the shared database becomes a single point of failure that couples the blast radius across all dependent services.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is Change Data Capture and how does it help migrate away from a shared database?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Change Data Capture (CDC) is a technique that reads a database&rsquo;s transaction log (such as the write-ahead log in PostgreSQL or the binary log in MySQL) and publishes every committed change as an event to a message broker. Tools like Debezium implement this without modifying application code, making it non-invasive.
            </p>
            <p className="mb-3">
              CDC helps migration by allowing consuming services to build local read models from the event stream instead of querying the shared database directly. The consuming service subscribes to events for the data it needs, processes them into a schema optimized for its query patterns, and no longer requires direct database access. This eliminates both read coupling and the performance contention associated with cross-service queries.
            </p>
            <p>
              CDC provides eventual consistency, which is acceptable for most read scenarios. For write-side invariants that require strong consistency, the owning service&rsquo;s API must be called synchronously. CDC is particularly valuable because it provides an audit trail of every change, which supports compliance requirements and debugging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Explain the Strangler Fig pattern and when you would use it for database migration.</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The Strangler Fig pattern gradually replaces functionality by routing traffic to new services while maintaining the old path as a fallback. A facade or proxy sits in front of the system and decides, for each request, whether to route it to the legacy path (the shared database) or the new path (a service with its own database). Over time, more functionality is migrated to the new path until the legacy path is no longer needed.
            </p>
            <p className="mb-3">
              I would use the Strangler Fig pattern when migrating away from a shared database in a production system where downtime is unacceptable. It is the safest migration strategy because every step is incremental and reversible. If the new service has a correctness issue, traffic can be routed back to the legacy path. The pattern is particularly effective for extracting domains from a monolith because it allows teams to migrate one bounded context at a time.
            </p>
            <p>
              The trade-off is operational complexity: during migration, you maintain two data stores and a routing layer. The routing proxy adds latency, typically five to ten milliseconds. However, this cost is justified by the risk reduction and the ability to migrate incrementally without a big-bang cutover.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are the risks of dual-write migration and how do you mitigate them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Dual-write migration involves writing to both the old shared database and the new service database simultaneously during migration. The primary risk is inconsistency: if the write to one store succeeds and the write to the other fails, the two stores diverge. This divergence may go undetected for weeks until a production incident reveals that the two stores have different data.
            </p>
            <p className="mb-3">
              The most important mitigation is to implement compensating transactions. If the write to the new store fails, issue a compensating write to roll back the change in the old store. This requires idempotent operations so that the compensating write can be safely retried. Additionally, implement reconciliation jobs that periodically compare the two stores and flag discrepancies for manual review.
            </p>
            <p>
              Another mitigation is to prefer CDC over dual-write where possible. CDC reads the transaction log and guarantees that every committed change is captured, eliminating the divergence risk. Dual-write should be used only when CDC is not feasible, and even then, it should be treated as a short-term transitional strategy with aggressive monitoring and reconciliation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: When is sharing a database acceptable, and what guardrails should you put in place?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Sharing a database is acceptable in three main scenarios. First, in a monolithic application with internal modular boundaries and a single deployment unit, a single database is the correct default. Second, for read-only analytics and reporting, sharing through a read replica is acceptable with strict governance: read-only credentials, query performance review, and a replica sized for analytical workloads. Third, in event sourcing architectures, sharing an append-only event store is acceptable because the event log is immutable and eliminates write contention.
            </p>
            <p className="mb-3">
              Guardrails should include clear table ownership with a designated owner for each table or table group. Access control should enforce least privilege: services get only the access they need for their role. Schema changes should require review by the table owner. Cross-service writes should be prohibited except through explicit APIs. And the sharing should be treated as a migration state with a documented plan to decouple over time.
            </p>
            <p>
              The critical insight is that sharing is acceptable only when it is controlled and intentional. The anti-pattern is uncontrolled sharing in systems that claim independent service ownership while maintaining implicit database-level contracts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you handle performance contention when multiple services share a database?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Performance contention in a shared database manifests as connection pool exhaustion, buffer cache pollution, lock contention, and I/O saturation. The immediate mitigation is to provision read replicas for read-heavy consumers, which isolates their query load from the primary database. Each service should have its own connection pool with reasonable limits to prevent aggregate pool saturation. Query optimization and indexing should be enforced through code review, and slow query logs should be monitored across all services.
            </p>
            <p className="mb-3">
              However, these are band-aids. The fundamental solution is to decouple the services by migrating to database-per-service with CDC-based read models. This eliminates cross-service performance contention entirely because each service&rsquo;s database is isolated. During migration, the strangler fig pattern allows incremental decoupling with rollback capability at each step.
            </p>
            <p>
              In a system design interview, the key insight is to distinguish between immediate mitigation and long-term resolution. Read replicas and connection pool management address symptoms. Database-per-service with explicit APIs addresses the root cause. The pragmatic approach is to implement mitigations immediately while planning a structured migration to eliminate the shared dependency over time.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://microservices.io/patterns/data/database-per-service.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Microservices.io: Database per Service
            </a> — Chris Richardson&rsquo;s pattern language for database-per-service architecture.
          </li>
          <li>
            <a href="https://debezium.io/documentation/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Debezium Documentation
            </a> — Change Data Capture platform for streaming database changes to message brokers.
          </li>
          <li>
            <a href="https://martinfowler.com/bliki/StranglerFigApplication.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler: Strangler Fig Application
            </a> — Incremental migration pattern for replacing legacy systems.
          </li>
          <li>
            <a href="https://www.confluent.io/blog/why-does-cdc-matter/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Confluent: Why CDC Matters
            </a> — Practical guide to Change Data Capture for data integration.
          </li>
          <li>
            <a href="https://blog.acolyer.org/2019/05/27/monolith-to-microservices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Morning Paper: Monolith to Microservices
            </a> — Sam Newman&rsquo;s book summary on migration strategies.
          </li>
          <li>
            <a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/strangler-fig" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Azure Architecture Center: Strangler Fig Pattern
            </a> — Microsoft&rsquo;s implementation guide for the strangler fig pattern.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
