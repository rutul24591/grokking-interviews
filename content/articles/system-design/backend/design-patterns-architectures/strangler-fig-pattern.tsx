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
  lastUpdated: "2026-04-08",
  tags: ["backend", "architecture", "migration"],
  relatedTopics: ["api-gateway-pattern", "anti-corruption-layer", "microservices-architecture", "shared-database-anti-pattern"],
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
          The <strong>Strangler Fig pattern</strong> is an incremental migration strategy that modernizes a legacy system by gradually replacing parts of it over time. Instead of executing a high-risk big-bang rewrite, you introduce a new system alongside the old one and progressively route more functionality to the new implementation. Over time, the legacy system is &quot;strangled&quot;: it serves less and less traffic until it can be safely decommissioned entirely. The pattern takes its name from the strangler fig tree, which grows around a host tree and eventually replaces it.
        </p>
        <p>
          The pattern was first described by Martin Fowler in 2004, drawing inspiration from how real organizations change systems under production pressure. There is continuous delivery to maintain, ongoing product work that cannot pause for months, and limited organizational tolerance for long periods of parallel development with no visible progress. The strangler fig approach creates a migration path that preserves user value throughout the transition and dramatically reduces the risk associated with large-scale rewrites.
        </p>
        <p>
          For staff and principal engineers, the Strangler Fig pattern is not merely a technical technique: it is an organizational strategy. Migrations succeed when they deliver visible value at each step, maintain the ability to roll back quickly, and keep the business running without interruption. The pattern requires architectural discipline (defining clear slice boundaries), operational rigor (instrumenting every cutover with verification), and organizational alignment (ensuring product, engineering, and operations teams coordinate on migration milestones).
        </p>
        <p>
          The business case for strangler fig migrations is compelling. Big-bang rewrites have a well-documented failure rate. Industry studies show that approximately 45-70% of large-scale rewrite projects either fail completely or deliver significantly less value than promised. The reasons are consistent: requirements drift during the long development cycle, the team loses institutional knowledge about the legacy system&apos;s edge cases, and the final cutover reveals integration issues that were invisible during development. Strangler migrations address each of these failure modes by making every step reversible, every slice independently testable, and every milestone a deliverable product increment rather than a checkpoint on a multi-year timeline.
        </p>
        <p>
          In system design interviews, the Strangler Fig pattern demonstrates your ability to think about production realities, risk management, and incremental delivery. It shows that you understand the difference between textbook architecture and the messy reality of evolving systems under business pressure. Interviewers expect you to discuss slice selection criteria, data migration strategies, rollback mechanisms, and real-world case studies where this pattern succeeded or failed.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/strangler-fig-pattern-diagram-1.svg"
          alt="Strangler fig migration architecture showing client requests flowing through a routing layer (API gateway/proxy) that directs traffic between the legacy monolith and the new microservices, with traffic gradually shifting over time"
          caption="Strangler migrations move traffic in slices through a routing layer, with the ability to validate correctness and roll back at each step."
        />
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <h3>Proxy and Interception Strategies</h3>
        <p>
          At the heart of every strangler fig migration is a proxy or interception layer that sits between clients and the backend systems. This layer is responsible for deciding, on a per-request basis, whether to route traffic to the legacy system or to the new system. The proxy can take many forms depending on your architecture. An API gateway like Kong, AWS API Gateway, or Envoy provides a natural interception point with built-in routing rules, rate limiting, and observability. A reverse proxy such as Nginx or HAProxy can handle URL-based or header-based routing with low latency. An application-level router implemented as a thin middleware layer in your codebase provides fine-grained control over routing logic, including feature-flag-driven decisions.
        </p>
        <p>
          The critical property of the interception layer is that it must be independently deployable and configurable without touching either the legacy or new system. This allows the migration team to adjust routing rules, enable or disable specific slices, and roll back traffic instantly without redeploying either application. The interception layer also serves as the natural place to instrument migration progress: request counts, latency distributions, error rates, and response comparison metrics all flow through this boundary.
        </p>
        <p>
          Proxy routing strategies vary in sophistication. The simplest approach is URL-path-based routing, where specific URL patterns are routed to the new system while everything else falls through to the legacy system. This works well when the legacy system has clear URL boundaries that map to business capabilities. A more sophisticated approach is header-based routing, where a specific request header (such as <code>X-Use-New-System: true</code>) directs traffic to the new implementation. This enables A/B testing, canary deployments, and internal dogfooding before exposing the new system to all users. The most advanced approach is semantic routing, where the proxy inspects request content (such as tenant ID, user cohort, or feature flags) and makes routing decisions based on business logic rather than URL structure.
        </p>

        <h3>Slice Selection and Incremental Decomposition</h3>
        <p>
          The most common cause of strangler migration failure is choosing slices that are not truly separable. If you begin with a deeply coupled capability that shares database tables, session state, and business logic with dozens of other features, you will spend months untangling dependencies and the migration will lose momentum. Good slices share three essential properties: clear boundaries with well-defined interfaces, limited shared data writes with other capabilities, and a measurable contract that allows you to verify correctness after the cutover.
        </p>
        <p>
          Start with read paths whenever possible. Reads are easier to route and validate because they do not mutate state, and they avoid the distributed transaction complexity that writes introduce. A read-only slice can be validated through shadow reads: you send the same request to both systems, compare the responses, and serve the legacy response to the user while building confidence in the new system&apos;s correctness. This approach catches data model mismatches, edge cases, and performance regressions before any user-facing risk is introduced.
        </p>
        <p>
          Prefer leaf capabilities: features that depend on other systems but are not themselves depended on by many other features. A reporting dashboard, a notification service, or a search index are typical leaf capabilities. They have clear input contracts and observable outputs, making them ideal first slices. Conversely, avoid starting with foundational capabilities like authentication, session management, or the core domain model, because these are deeply woven into every other part of the system.
        </p>
        <p>
          Incremental decomposition of a monolith requires a systematic approach to identifying bounded contexts. Begin by analyzing the existing codebase to find modules that have high internal cohesion and low external coupling. Use dependency analysis tools to map import relationships, database query patterns to identify table ownership, and API call graphs to find natural service boundaries. Each identified slice should have a clear &quot;definition of done&quot;: what traffic volume is migrated, what data is owned by the new system, what the rollback procedure is, and what verification signals indicate success.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/strangler-fig-pattern-diagram-2.svg"
          alt="Incremental decomposition decision map showing how a monolith is analyzed for bounded contexts, slice selection criteria (read paths, leaf capabilities, measurable outcomes), and the progressive migration workflow from shadow reads through canary to full cutover"
          caption="Strangler success depends on systematic slice selection, data migration strategy, and disciplined verification at each migration step."
        />

        <h3>Feature Flag Integration</h3>
        <p>
          Feature flags are a powerful complement to proxy-based routing in strangler migrations. While the proxy decides which system handles a request, feature flags control which code paths execute within the new system and can also influence routing decisions at the application layer. The combination of proxy routing and feature flags creates a multi-layered migration safety net: the proxy provides coarse-grained traffic direction, while feature flags provide fine-grained control over specific behaviors within the new system.
        </p>
        <p>
          A typical integration pattern uses the proxy to route a slice of traffic to the new system, and then uses feature flags within the new system to control the rollout of individual features within that slice. For example, if you are migrating the checkout flow, the proxy routes checkout requests to the new checkout service. Within that service, feature flags control whether the new payment processing path, the new inventory reservation path, or the new order confirmation path is active. This allows you to migrate the service as a whole while still rolling out individual features gradually.
        </p>
        <p>
          Feature flags also enable the parallel run pattern, where both the legacy and new implementations execute for the same request. The feature flag controls whether the new path runs alongside the legacy path, and the results are compared for correctness. The user receives the legacy response, but the new system&apos;s output is logged and analyzed. Once the parallel run shows consistent correctness across thousands of requests, the feature flag can be flipped to serve the new system&apos;s response to users. This approach catches subtle bugs that would not surface in shadow mode alone, because the new system processes real request timing and load patterns.
        </p>
        <p>
          The operational discipline around feature flags is critical. Every flag introduced for migration purposes must have a documented owner, an expiration date, and a removal plan. Flag debt is a real problem: organizations that accumulate hundreds of migration-related flags without cleaning them up end up with a new system that is just as difficult to understand as the legacy system it replaced. Treat migration flags as temporary scaffolding: essential during construction, but removed before the building is considered complete.
        </p>

        <h3>Data Migration Patterns</h3>
        <p>
          Routing requests between systems is often the straightforward part of a strangler migration. Migrating data ownership is where migrations stall and fail. The new system cannot safely own data without coordinating with the legacy system, and the transition period where both systems can write to the same data is the highest-risk phase of any migration. You must choose a data migration strategy that matches your correctness requirements, operational capacity, and tolerance for risk.
        </p>
        <p>
          Shadow reads are the safest starting point. You read from the new store in parallel with the legacy store and compare results, but you serve responses from the legacy system until confidence is high. This approach catches data model mismatches, missing fields, and calculation differences without any user-facing risk. Shadow reads work particularly well when the new system builds its read model from the legacy system via change data capture, because you control the replication pipeline and can debug discrepancies by examining the transformation logic.
        </p>
        <p>
          Change data capture (CDC) is the backbone of most successful data migrations. CDC streams change events from the legacy database into the new system, allowing the new system to build its own read model without modifying the legacy schema or adding triggers. Tools like Debezium, AWS DMS, or custom binlog parsers capture inserts, updates, and deletes from the legacy database and publish them to a message broker. The new system consumes these events and maintains its own data store in near-real-time. CDC has the advantage of being non-invasive: the legacy database continues operating normally, and the migration team builds the new read model independently.
        </p>
        <p>
          Dual writes are a common but dangerous strategy. During the transition, every write operation sends data to both the legacy system and the new system. The operational risk is significant: if one write succeeds and the other fails, you have data inconsistency that is extremely difficult to detect and repair. Dual writes should only be used when you have a strong reconciliation plan that runs continuously, comparing data between systems and alerting on discrepancies. Even then, prefer the outbox pattern over direct dual writes: write to an outbox table in the same transaction as your primary write, then have a separate process read the outbox and replicate to the second system. This ensures at-least-once delivery with idempotent consumers on the receiving end.
        </p>
        <p>
          The ownership flip is the final and most critical data migration step. At some point, the new system must become the authoritative source of truth for writes, and the legacy system must stop writing to that data. The safest approach is to flip writes for a narrow slice first: a single tenant, a specific user cohort, or a particular product category. Run the new system as the write owner for that slice while maintaining a synchronization path back to the legacy system (in case rollback is needed). Monitor reconciliation dashboards closely, verify invariants daily, and only expand the write ownership scope when the narrow slice has proven stable for a sustained period.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>The Routing Boundary</h3>
        <p>
          A strangler migration requires a well-defined boundary where requests can be directed to either the legacy system or the new system. This boundary is typically an API gateway, a reverse proxy, an ingress controller, or an internal routing layer implemented in application code. The router provides the mechanism for gradual cutover, and it serves as the natural place to instrument migration progress and detect regressions.
        </p>
        <p>
          The routing boundary must satisfy several requirements. It must support dynamic routing rules that can be changed without redeploying either system. It must provide observability: request counts, latency percentiles, error rates, and response comparison metrics for both systems. It must support automatic rollback: if error rates on the new system exceed a threshold, traffic should automatically flow back to the legacy system. And it must handle sticky sessions or consistent routing for stateful user journeys, ensuring that a single user session does not bounce between legacy and new implementations mid-flow.
        </p>

        <h3>Anti-Corruption Layer</h3>
        <p>
          The legacy system and the new system rarely share the same data model, API contract, or domain terminology. An anti-corruption layer (ACL) sits between them, translating requests and responses so that each system can evolve independently. The ACL prevents the new system from inheriting the legacy system&apos;s data model quirks, and it prevents the legacy system from being polluted with the new system&apos;s API expectations.
        </p>
        <p>
          The ACL typically lives in the routing boundary or as a thin adapter service. It transforms request formats (for example, converting a legacy XML payload to a modern JSON API call), maps field names between data models (for example, <code>cust_id</code> to <code>customer_id</code>), and handles semantic differences (for example, the legacy system uses a single status field with twelve possible values while the new system uses separate boolean flags for active, suspended, and pending states). The ACL is a migration artifact: it should be simplified and eventually removed as the legacy system is fully decommissioned.
        </p>

        <h3>Verification Ladder</h3>
        <p>
          Strangler migrations fail when teams move traffic without strong verification. &quot;It seems fine&quot; is not a valid migration strategy. Verification requires explicit, automated checks that run continuously and alert when discrepancies are detected. A practical verification ladder progresses through multiple stages of increasing confidence.
        </p>
        <p>
          The first stage is shadow mode with response comparison. Every request to the legacy system is duplicated and sent to the new system. The responses are compared for structural equality, field-level matches, and invariant compliance. The user sees only the legacy response, so any discrepancy in the new system is invisible to users but visible to the migration team. Shadow mode runs for days or weeks, accumulating thousands of comparisons and building a statistical picture of correctness.
        </p>
        <p>
          The second stage is canary traffic. A small percentage of real user requests (typically 1-5%) are routed to the new system. The canary cohort is carefully chosen: internal employees, beta users, or a specific geographic region that can receive dedicated support if issues arise. Canary traffic is monitored with tighter alerting thresholds than normal operations, and the migration team maintains a war room during the initial canary period.
        </p>
        <p>
          The third stage is progressive rollout. Assuming the canary cohort shows no regressions, traffic is gradually increased: 10%, 25%, 50%, 75%, 100%. Each increase is gated by verification signals: error rates must remain below threshold, latency percentiles must not regress, reconciliation jobs must show no data drift, and user behavior signals (conversion rates, support tickets, user complaints) must remain stable. At any point during progressive rollout, automatic rollback triggers can return traffic to the previous stage.
        </p>
        <p>
          The fourth and final stage is legacy decommissioning. Once the new system serves 100% of traffic for a sustained period (typically two to four weeks) with no incidents, the legacy system can be decommissioned. This is not just turning off servers: it involves archiving legacy data, updating DNS records, removing routing rules, cleaning up feature flags, and notifying dependent teams that the legacy endpoints are retired.
        </p>

        <h3>Rollback Strategies</h3>
        <p>
          Rollback capability is what separates strangler migrations from big-bang rewrites. Every cutover must be reversible within minutes, not hours or days. Rollback planning requires attention to the parts of the system that are not obvious in architecture diagrams: caches, session state, asynchronous side effects, and shared external integrations.
        </p>
        <p>
          For stateful user journeys that span multiple requests, define whether routing is per-request or sticky per session. Sticky routing ensures that a user&apos;s entire checkout flow goes to either the legacy or the new system, preventing scenarios where cart management happens in the legacy system but payment processing happens in the new system. If you use sticky routing, rollback requires migrating the session state back to the legacy system, which means the new system must have been writing session data to a shared store or replicating it back to the legacy system throughout the migration.
        </p>
        <p>
          Cache boundaries must be versioned per implementation. The new system should not interpret old cached values from the legacy system, and vice versa. Use cache key prefixes or separate cache namespaces for each implementation. During rollback, the legacy system&apos;s cache remains warm because it was serving traffic throughout the migration, which is one of the operational advantages of the strangler pattern.
        </p>
        <p>
          Side effects such as email sends, payment authorizations, and inventory writes need idempotency and deduplication so that a rollback does not double-execute actions. If a payment was authorized by the new system before rollback, the legacy system must not re-authorize it when traffic returns. Use idempotency keys on all write operations, and maintain a shared ledger of completed side effects that both systems can consult.
        </p>
        <p>
          Automatic rollback triggers should be configured at every stage of the migration. Error rate exceeding a threshold (for example, greater than 1% five-hundred errors over a five-minute window), latency regression exceeding a target (for example, p99 latency greater than 500ms when the baseline is 200ms), data drift detected by reconciliation jobs, or user signal anomalies (for example, conversion rate dropping more than 10% from baseline) should all trigger automatic rollback. The rollback itself should be a single configuration change to the routing layer, not a deployment or code change.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Strangler Fig Versus Big-Bang Rewrite</h3>
        <p>
          The fundamental trade-off of the strangler fig pattern is time versus risk. A big-bang rewrite concentrates all risk into a single cutover event. The development cycle is shorter in calendar time because the team focuses exclusively on the rewrite, but the probability of catastrophic failure is high. Requirements drift during the long development cycle, the team loses knowledge about the legacy system&apos;s edge cases, and the final integration test reveals problems that were invisible during isolated development. When a big-bang rewrite fails, the organization has wasted months or years of engineering effort with nothing to show for it.
        </p>
        <p>
          The strangler fig pattern spreads risk across many small cutovers, each of which is independently reversible. The calendar time for full migration is longer because the team must continue maintaining the legacy system while building the new one, and each slice requires verification before the next slice begins. However, every slice delivers incremental value, and the failure of any single slice does not threaten the overall migration. The organization builds confidence with each successful slice, and the migration team gains deeper understanding of the legacy system&apos;s behavior with each iteration.
        </p>

        <h3>Strangler Fig Versus Branch-by-Abstraction</h3>
        <p>
          Branch by abstraction is an alternative migration strategy where you introduce an abstraction layer within the existing codebase, implement the new behavior behind the abstraction, and then switch implementations via configuration. This approach works well when the legacy system is modular enough to accommodate the abstraction without massive refactoring. The advantage is that you never run two separate systems in parallel, reducing operational complexity. The disadvantage is that you are modifying the legacy codebase extensively, which increases the risk of introducing bugs into the production system during the abstraction phase.
        </p>
        <p>
          Strangler fig is preferable when the legacy system is too fragile or poorly understood to safely modify in place, when the new system uses a fundamentally different technology stack that cannot coexist in the same codebase, or when organizational constraints require the migration team to work independently from the legacy maintenance team. Branch by abstraction is preferable when the legacy system has clean module boundaries, when the migration is primarily a behavioral change within the same technology stack, or when running two systems in parallel would create unacceptable data consistency challenges.
        </p>

        <h3>Operational Cost of Parallel Systems</h3>
        <p>
          Running two systems in parallel has real costs that are often underestimated. Infrastructure costs double for the duration of the migration, particularly if the new system must be provisioned at full capacity for load testing and canary validation. Engineering costs increase because the team must maintain two codebases, two deployment pipelines, two monitoring stacks, and two on-call rotations. Cognitive load is significant: engineers must understand both systems, the mapping between them, and the migration state of each capability.
        </p>
        <p>
          The staff-level insight is to bound the parallel-system period explicitly. Set a migration timeline target (for example, twelve to eighteen months for a medium-complexity monolith), track the cost of parallel operation monthly, and escalate when the cost exceeds budget. Use the cost data to justify additional migration resources or to negotiate scope reductions that accelerate the timeline. The parallel-system period should feel expensive enough to motivate completion but not so expensive that it starves the new system of resources.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/strangler-fig-pattern-diagram-3.svg"
          alt="Strangler fig failure modes and risk mitigation: slice coupling leading to endless dependencies, data drift between legacy and new stores, dual-write inconsistency causing corruption, and irreversible cutover with no rollback path"
          caption="Migration risk centers on correctness drift and irreversible cutover. Strangler works when rollback paths and verification ladders are real and tested."
        />
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Establish the Routing Boundary First</h3>
        <p>
          Before migrating any functionality, deploy the routing layer that will mediate between legacy and new systems. This can be an API gateway, a reverse proxy, or an application-level router. Ensure it supports dynamic routing rules, observability, and instant rollback. The routing boundary is the foundation of the entire migration, and getting it right early prevents painful rework later. Configure health checks for both systems, set up latency and error-rate alerting, and test rollback procedures before migrating the first slice.
        </p>

        <h3>Start with Read-Only Leaf Capabilities</h3>
        <p>
          Your first migration slice should be a read-only capability that has minimal dependencies on other systems and is not a dependency for many other features. Reporting endpoints, search functionality, and user profile views are typical candidates. Read paths are easy to validate through shadow comparison, they do not introduce distributed write complexity, and they build team confidence with low-risk cutovers. Resist the urge to start with high-visibility write paths like checkout or order creation: the temptation to prove value quickly often leads to choosing slices that are too complex for a first migration.
        </p>

        <h3>Use CDC for Read Model Synchronization</h3>
        <p>
          Change data capture is the most reliable way to keep the new system&apos;s read model synchronized with the legacy database. CDC tools like Debezium capture change events from the database transaction log without modifying the legacy schema or adding application-level hooks. The new system consumes CDC events and maintains its own data store, enabling shadow reads and parallel run validation. CDC is non-invasive, supports near-real-time synchronization, and provides an audit trail of all changes that can be used for debugging data discrepancies.
        </p>

        <h3>Define Explicit Slice Contracts</h3>
        <p>
          Every migration slice must have a formal contract that defines its boundaries, inputs, outputs, and verification criteria. The contract should specify which API endpoints are migrated, what data the new system owns, what the expected response format is, what invariants must hold, and what constitutes successful migration. Treat slice contracts like API contracts: version them, review them in design meetings, and enforce them through automated testing. Explicit contracts prevent scope creep, clarify responsibilities between teams, and provide a clear definition of done for each slice.
        </p>

        <h3>Instrument Everything</h3>
        <p>
          The migration team should have a dashboard that shows the state of every slice: traffic percentage routed to the new system, error rate comparison, latency distribution comparison, reconciliation status, data drift metrics, and rollback readiness. Instrumentation is not optional: without it, you are migrating blind. Set up automatic alerts for error rate spikes, latency regressions, data drift detection, and user signal anomalies. The dashboard should be visible to the entire engineering organization, not just the migration team, because migration progress is an organizational priority.
        </p>

        <h3>Practice Rollback Before Every Cutover</h3>
        <p>
          Before routing any traffic to the new system, practice the rollback procedure. Verify that the routing layer can return traffic to the legacy system within seconds. Confirm that the legacy system is still operational and has warm caches. Test that session state is accessible to the legacy system after rollback. Run a rollback drill for each slice, document the procedure, and treat the drill results as a gate: if rollback cannot be completed within the target time, the slice is not ready for cutover.
        </p>

        <h3>Clean Up Migration Artifacts</h3>
        <p>
          As each slice is fully migrated and the legacy path is decommissioned, remove the routing rules, feature flags, anti-corruption layer translations, and monitoring alerts associated with that slice. Migration artifacts that persist after decommissioning become technical debt that confuses future engineers. Establish a cleanup checklist that runs automatically when a slice reaches 100% migration: remove proxy routes, delete feature flags, archive legacy endpoints, update API documentation, and notify dependent teams. Track cleanup completion as part of the slice&apos;s definition of done.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Slice Coupling and Hidden Dependencies</h3>
        <p>
          The most common strangler failure mode is choosing a slice that appears separable but is actually deeply coupled to the legacy system through hidden dependencies. The slice may share database tables with other capabilities, rely on session state managed by the legacy system, or depend on business logic that is not encapsulated in a single module. The symptom is a migration that stalls: the team discovers new dependencies every week, the slice boundary keeps expanding, and the migration timeline slips repeatedly.
        </p>
        <p>
          The mitigation is to start smaller and to perform thorough dependency analysis before committing to a slice. Map all database queries, trace all API calls, and identify all shared state. If the slice touches more than three database tables that are also used by other capabilities, or if it depends on more than two internal services, it is probably too large for a first slice. Split it further until you find a truly isolated capability.
        </p>

        <h3>Data Drift Between Systems</h3>
        <p>
          When both the legacy and new systems can write to the same data, drift is inevitable without strong safeguards. Drift manifests as discrepancies between systems: a user&apos;s profile shows different values depending on which system you query, an order exists in one system but not the other, or inventory counts diverge over time. Drift is particularly insidious because it accumulates gradually, and by the time it is detected, the volume of discrepancies makes reconciliation extremely difficult.
        </p>
        <p>
          The mitigation is continuous reconciliation. Run automated reconciliation jobs that compare data between systems at regular intervals (hourly for critical data, daily for less critical data). Reconciliation jobs should compare record counts, checksum aggregated data, verify invariants, and alert on any discrepancy. Keep reconciliation dashboards visible to the entire team, and treat any drift alert as a production incident requiring immediate investigation.
        </p>

        <h3>Dual-Write Inconsistency</h3>
        <p>
          Dual writes are the most common data migration anti-pattern. The team writes to both the legacy system and the new system during the transition, assuming that both writes will succeed. When one write fails (network timeout, constraint violation, serialization conflict), the systems diverge and the inconsistency is difficult to detect because there is no single source of truth. Dual writes without reconciliation are worse than no migration at all, because they create a false sense of progress while silently corrupting data.
        </p>
        <p>
          The mitigation is to avoid dual writes whenever possible. Use CDC to replicate changes from the legacy system to the new system, or use the outbox pattern where writes are captured in a transactional outbox table and replicated asynchronously. If dual writes are unavoidable, implement idempotent consumers on the receiving end and run continuous reconciliation to detect and repair discrepancies.
        </p>

        <h3>Irreversible Cutover</h3>
        <p>
          Some teams migrate traffic to the new system and then discover that rollback is impossible or prohibitively expensive. This happens when the new system mutates data that the legacy system cannot interpret, when caches are shared and polluted, when side effects are not idempotent, or when the routing layer was not designed for instant rollback. An irreversible cutover transforms the strangler migration into a de facto big-bang rewrite, with all the associated risk.
        </p>
        <p>
          The mitigation is to treat rollback as a first-class design requirement. Before any cutover, verify that the routing layer can redirect traffic instantly, that the legacy system remains fully operational, that caches are versioned per implementation, that side effects are idempotent, and that session state is accessible to both systems. Practice rollback as part of the migration dry run, and do not proceed with cutover until the rollback drill succeeds.
        </p>

        <h3>Migration Fatigue and Loss of Momentum</h3>
        <p>
          Strangler migrations are marathons, not sprints. After the initial excitement of the first few successful slices, the migration can lose momentum as the remaining slices become progressively more complex and the parallel-system costs accumulate. Engineers grow tired of maintaining two systems, product leaders question the continued investment in migration instead of new features, and organizational attention shifts to more visible initiatives. Migration fatigue is a real risk that can cause a strangler migration to stall indefinitely, leaving the organization with two half-migrated systems and no clear path forward.
        </p>
        <p>
          The mitigation is to maintain visible progress, celebrate milestones, and keep the migration timeline bounded. Publish monthly migration progress reports showing traffic percentages, slice completion rates, and cost trends. Tie migration milestones to product deliverables so that product leaders see the migration as an enabler of new features rather than a competitor for engineering resources. Set an explicit deadline for the migration, and escalate when the deadline is at risk.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Amazon: Monolith to Microservices Decomposition</h3>
        <p>
          Amazon&apos;s migration from a monolithic architecture to microservices is one of the most famous strangler fig migrations in industry. In the early 2000s, Amazon&apos;s e-commerce platform was a monolithic application that became increasingly difficult to scale and modify. The team adopted an incremental decomposition strategy, extracting individual capabilities (product catalog, shopping cart, order management, payment processing) into independent services. Each extraction followed the strangler pattern: the new service was introduced alongside the monolith, traffic was gradually routed to the service through proxy routing, and the monolith&apos;s corresponding code was eventually removed. The migration took several years and fundamentally changed Amazon&apos;s engineering culture, establishing the two-pizza team model and the platform-as-a-service philosophy that powers AWS today.
        </p>

        <h3>Monzo: Core Banking System Migration</h3>
        <p>
          Monzo, the UK-based digital bank, executed a strangler fig migration of its core banking system in 2019-2020. The legacy system, built during Monzo&apos;s early days, could not support the scale and feature complexity the bank had achieved. Rather than pausing product development for a rewrite, Monzo built a new core banking system alongside the old one and used the parallel run pattern extensively. Every transaction ran through both systems simultaneously, and the results were compared for correctness. The migration was executed slice by slice: customer accounts, transaction processing, savings pots, and lending products were migrated in sequence. The parallel run pattern gave Monzo the confidence to migrate critical financial data without service interruption, and the migration was completed with zero downtime for end users.
        </p>

        <h3>GitHub: Ruby on Rails Monolith Decomposition</h3>
        <p>
          GitHub&apos;s Ruby on Rails monolith grew to over 4000 models and became a bottleneck for developer velocity. The team adopted a strangler fig approach, extracting services from the monolith incrementally while continuing to ship features. The migration began with leaf capabilities like notification delivery and webhook processing, then progressed to more central capabilities like repository management and pull request workflows. GitHub used an internal routing layer to direct traffic between the monolith and extracted services, and they employed CDC to replicate data from the monolith&apos;s MySQL database to service-specific data stores. The migration is ongoing and has spanned several years, demonstrating that strangler migrations at GitHub&apos;s scale are measured in years, not quarters.
        </p>

        <h3>Nubank: Legacy Financial Platform Migration</h3>
        <p>
          Nubank, one of Latin America&apos;s largest fintechs, migrated from a legacy Clojure-based monolith to a polyglot microservices architecture using strangler fig patterns. The migration was driven by the need to support new financial products (credit cards, personal loans, insurance) that the monolith could not accommodate without significant modification. Nubank used an API gateway as the routing boundary, CDC for data replication, and feature flags for granular rollout control. The migration was organized by bounded context: the credit card system was extracted first, followed by the lending platform, and then the core account system. Nubank&apos;s engineering blog documents the migration in detail, including the challenges of maintaining data consistency across systems during the transition.
        </p>

        <h3>Legacy E-Commerce: Checkout Flow Extraction</h3>
        <p>
          A common real-world scenario involves extracting the checkout flow from a monolithic e-commerce application. The checkout flow encompasses cart management, inventory reservation, payment processing, order creation, and confirmation. A team using strangler fig patterns would begin with read-only slices: build a new cart view using CDC replication from the monolith database, validate it through shadow reads, and then progressively migrate write paths. Payment processing is typically extracted first among write paths because it has clear boundaries and well-defined contracts with external payment gateways. The team would use an API gateway to route checkout traffic, feature flags to control the rollout of individual checkout steps, and reconciliation jobs to compare order data between systems. Rollback would be practiced before each cutover, and automatic rollback triggers would be configured for error rate spikes and data drift detection.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why is the Strangler Fig pattern safer than a big-bang rewrite, and what are its key mechanisms?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The Strangler Fig pattern is safer because it replaces a system incrementally through many small, independently reversible cutovers rather than a single high-risk migration event. Each slice of functionality is migrated, verified, and validated before the next slice begins. If any slice migration reveals problems, traffic can be rolled back to the legacy system instantly, minimizing user impact. The key mechanisms are a routing boundary (API gateway or proxy) that directs traffic to either system, shadow reads that validate the new system&apos;s correctness without user-facing risk, progressive rollout that gradually increases traffic to the new system, and automatic rollback triggers that detect regressions and revert traffic.
            </p>
            <p>
              Big-bang rewrites concentrate all risk into a single cutover event. Requirements drift during the long development cycle, the team loses knowledge about the legacy system&apos;s edge cases, and the final integration reveals problems that were invisible during isolated development. Strangler migrations address each of these failure modes by making every step reversible, every slice independently testable, and every milestone a deliverable product increment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you select which functionality to migrate first in a strangler migration?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Slice selection is critical to migration success. Start with read-only paths because they are easier to validate through shadow comparison and do not introduce distributed write complexity. Prefer leaf capabilities that depend on other systems but are not themselves depended on by many other features: reporting endpoints, notification services, and search indices are typical candidates. Choose slices that have clear boundaries with well-defined interfaces, limited shared data writes with other capabilities, and measurable contracts that allow you to verify correctness.
            </p>
            <p>
              Avoid starting with foundational capabilities like authentication, session management, or the core domain model, because these are deeply woven into every other part of the system. Before committing to a slice, perform thorough dependency analysis: map all database queries, trace all API calls, and identify all shared state. If the slice touches more than three database tables that are also used by other capabilities, it is probably too large and should be split further.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What data migration strategies do you use during a strangler migration, and when do you avoid dual writes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The primary data migration strategies are shadow reads, change data capture (CDC), the outbox pattern, and ownership flips. Shadow reads read from the new store in parallel with the legacy store and compare results while serving responses from the legacy system. CDC streams change events from the legacy database into the new system, allowing the new system to build its own read model without modifying the legacy schema. The outbox pattern writes to an outbox table in the same transaction as the primary write, then a separate process replicates to the second system with idempotent consumers. Ownership flips make the new system the authoritative source of truth for writes on a narrow slice first, then expand the scope incrementally.
            </p>
            <p>
              Dual writes should be avoided when you cannot guarantee consistent cross-system writes and do not have a strong reconciliation plan. The operational risk of dual writes is that one write succeeds and the other fails, creating data inconsistency that is extremely difficult to detect. If dual writes are unavoidable, implement idempotent consumers, run continuous reconciliation jobs, and treat any discrepancy as a production incident. Prefer CDC and outbox patterns over direct dual writes whenever possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Describe the parallel run pattern and how it differs from shadow mode.</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The parallel run pattern executes both the legacy and new implementations for the same request. The results are compared for correctness, and the user receives the legacy response while the new system&apos;s output is logged and analyzed. The key difference from shadow mode is that in parallel run, the new system processes real request timing and load patterns, which can expose bugs that would not surface in shadow mode. For example, race conditions, timeout behaviors, and resource contention only manifest under real load conditions.
            </p>
            <p>
              In shadow mode, the new system receives a copy of the request after the user has been served, so it processes the request asynchronously without affecting user experience. Shadow mode is safer for early validation because any bugs in the new system are completely invisible to users. Parallel run is used after shadow mode has built initial confidence, and it provides higher assurance because the new system handles real-time request processing with actual latency constraints. Once parallel run shows consistent correctness across thousands of requests, the feature flag can be flipped to serve the new system&apos;s response to users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you ensure rollback is truly possible during a strangler migration?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Rollback capability requires planning for stateful flows, cache boundaries, side effects, and automatic rollback triggers. For stateful user journeys, define whether routing is per-request or sticky per session. Sticky routing ensures a user&apos;s entire flow goes to one system, but rollback requires migrating session state back to the legacy system. For caches, use versioned cache keys per implementation so the new system does not interpret old cached values incorrectly. For side effects like payments and inventory writes, implement idempotency keys so that a rollback does not double-execute actions.
            </p>
            <p>
              Automatic rollback triggers should be configured at every migration stage: error rate exceeding a threshold, latency regression beyond baseline, data drift detected by reconciliation jobs, or user signal anomalies like conversion rate drops. The rollback itself should be a single configuration change to the routing layer, not a deployment or code change. Most importantly, practice rollback before every cutover. Run a rollback drill, document the procedure, and do not proceed with cutover until the drill succeeds within the target time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do feature flags complement proxy-based routing in strangler migrations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Feature flags provide fine-grained control over specific behaviors within the new system, while proxy routing provides coarse-grained traffic direction between systems. The combination creates a multi-layered migration safety net. The proxy routes a slice of traffic (for example, all checkout requests) to the new system, and feature flags within the new system control the rollout of individual features (for example, the new payment processing path, the new inventory reservation path). This allows you to migrate the service as a whole while still rolling out individual features gradually.
            </p>
            <p>
              Feature flags also enable the parallel run pattern at the feature level: a flag controls whether the new path runs alongside the legacy path within the new system, and results are compared for correctness. Every migration flag must have a documented owner, an expiration date, and a removal plan. Flag debt is a real problem, and migration flags should be treated as temporary scaffolding that is removed before the migration is considered complete.
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
            <a href="https://martinfowler.com/bliki/StranglerFigApplication.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler: Strangler Fig Application
            </a> — Original description of the Strangler Fig pattern and its application to legacy system migration.
          </li>
          <li>
            <a href="https://martinfowler.com/bliki/StranglerApplication.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler: Strangler Application
            </a> — Earlier article on strangler patterns with practical examples of incremental replacement.
          </li>
          <li>
            <a href="https://monzo.com/blog/2019/07/29/the-architecture-of-a-bank" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Monzo Blog: The Architecture of a Bank
            </a> — Details Monzo&apos;s core banking system migration using parallel run patterns.
          </li>
          <li>
            <a href="https://github.blog/engineering/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub Engineering Blog
            </a> — Documentation of GitHub&apos;s monolith decomposition and service extraction journey.
          </li>
          <li>
            <a href="https://samnewman.io/patterns/architectural/strangler-fig/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Sam Newman: Strangler Fig Pattern
            </a> — Comprehensive guide to strangler fig patterns from the author of Building Microservices.
          </li>
          <li>
            <a href="https://www.infoq.com/articles/profile-reveal-strangulation-at-scale/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              InfoQ: Strangulation at Scale
            </a> — Case studies of large-scale strangler migrations including Nubank&apos;s financial platform migration.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
