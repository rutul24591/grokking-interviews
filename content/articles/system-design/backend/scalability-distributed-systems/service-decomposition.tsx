"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-service-decomposition",
  title: "Service Decomposition",
  description:
    "Staff-level deep dive into service decomposition covering domain-driven design, bounded contexts, strangler fig pattern, database-per-service, anti-corruption layers, shared kernels, and migration strategies from monolith to microservices.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "service-decomposition",
  wordCount: 5600,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: [
    "service decomposition",
    "domain-driven design",
    "bounded contexts",
    "strangler fig pattern",
    "database-per-service",
    "anti-corruption layer",
    "shared kernel",
    "monolith migration",
    "microservices",
  ],
  relatedTopics: [
    "microservices-architecture",
    "distributed-transactions",
    "horizontal-scaling",
    "cqrs",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Service decomposition</strong> is the process of breaking down
          a monolithic application into a set of independently deployable
          services, each responsible for a specific business capability or
          domain. The goal is to achieve the benefits of microservices
          architecture: independent deployment (each service can be deployed
          without affecting other services), independent scaling (each service
          can be scaled based on its own load profile), fault isolation (a
          failure in one service does not cascade to other services), and team
          autonomy (each service can be developed and operated by a small,
          focused team).
        </p>
        <p>
          Service decomposition is one of the most challenging architectural
          transformations because it requires making irreversible decisions about
          service boundaries — once a service is extracted from the monolith and
          other services depend on its API, changing its boundary (splitting it
          further or merging it with another service) is extremely expensive and
          risky. The wrong service boundaries lead to <em>distributed
          monoliths</em> — services that are independently deployed but tightly
          coupled through synchronous calls, shared databases, or coordinated
          deployments. A distributed monolith has all the complexity of a
          distributed system (network latency, partial failures, distributed
          tracing) with none of the benefits (independent deployability,
          independent scaling, fault isolation).
        </p>
        <p>
          The two primary frameworks for service decomposition are{" "}
          <strong>Domain-Driven Design (DDD)</strong> and the{" "}
          <strong>Strangler Fig Pattern</strong>. DDD provides the conceptual
          tools for identifying service boundaries — bounded contexts,
          ubiquitous language, and subdomain analysis. The Strangler Fig Pattern
          provides the operational strategy for migrating from the monolith to
          the decomposed services — incrementally replacing monolith features
          with new services behind a facade (proxy or API gateway), until the
          monolith is empty and can be decommissioned.
        </p>
        <p>
          For staff and principal engineers, service decomposition involves
          solving several non-trivial problems: identifying the right service
          boundaries (using DDD bounded contexts and business capability
          analysis), managing data migration (moving data from the monolith&apos;s
          shared database to each service&apos;s private database), handling
          cross-service transactions (replacing ACID transactions with saga
          patterns or eventual consistency), and managing the migration process
          itself (the strangler fig pattern, anti-corruption layers, and
          parallel run validation). These decisions determine the success or
          failure of the microservices migration — a poorly decomposed system
          is harder to operate than the original monolith.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          <strong>Bounded contexts</strong> are the primary tool for identifying
          service boundaries in Domain-Driven Design. A bounded context is a
          logical boundary within which a particular domain model is defined and
          applies. Within a bounded context, each term has a single, unambiguous
          meaning (the <em>ubiquitous language</em>). For example, in the{" "}
          <em>Order bounded context</em>, the term &quot;Customer&quot; refers
          to the entity that placed the order (with attributes like order
          history, shipping address, and payment method). In the{" "}
          <em>User bounded context</em>, the term &quot;Customer&quot; refers to
          the entity that has an account (with attributes like login credentials,
          profile information, and preferences). These are different concepts
          that happen to share a name — they belong to different bounded contexts
          and should be modeled as separate entities with separate databases.
        </p>

        <p>
          The <strong>database-per-service</strong> pattern is the fundamental
          data ownership principle in service decomposition. Each service owns
          its database — no other service can directly access another
          service&apos;s database. If a service needs data that is owned by
          another service, it must request it through the owning service&apos;s
          API (synchronous call) or through an event (asynchronous notification).
          This pattern ensures that each service can evolve its database schema
          independently (without coordinating schema changes with other services),
          choose the database technology that best fits its data model (e.g., a
          graph database for a social network service, a time-series database
          for a metrics service), and scale its database independently of other
          services&apos; databases.
        </p>

        <p>
          The <strong>Strangler Fig Pattern</strong> (named after the strangler
          fig tree that grows around a host tree and eventually replaces it) is
          the migration strategy for decomposing a monolith. A facade (proxy or
          API gateway) is placed in front of the monolith, intercepting all
          incoming requests. Initially, the facade routes all requests to the
          monolith. As features are extracted from the monolith into new
          services, the facade is updated to route the corresponding requests
          to the new services. Over time, more and more features are extracted,
          and the monolith shrinks. Eventually, the monolith is empty and can
          be decommissioned. The Strangler Fig Pattern provides zero-downtime
          migration (the monolith continues to serve requests throughout the
          migration), incremental risk reduction (each feature extraction is a
          small, manageable change), and reversibility (if a new service fails,
          the facade can be updated to route requests back to the monolith).
        </p>

        <p>
          <strong>Anti-corruption layers (ACLs)</strong> are adapters that
          translate between the domain models of different bounded contexts.
          When Service A needs data from Service B, the ACL translates Service
          B&apos;s data model into Service A&apos;s domain model, preventing
          Service B&apos;s model from &quot;corrupting&quot; Service A&apos;s
          model. For example, if the Order service receives a UserUpdated event
          from the User service, the Order service&apos;s ACL translates the
          User service&apos;s &quot;Customer&quot; model into the Order
          service&apos;s &quot;Buyer&quot; model, ensuring that the Order
          service&apos;s domain model remains clean and focused on its own
          ubiquitous language.
        </p>

        <p>
          <strong>Shared kernels</strong> are a small set of shared code (types,
          utilities, constants) that is used by multiple services. Unlike a
          shared database (which is an anti-pattern), a shared kernel is a
          shared code library that contains types that are genuinely common
          across services (e.g., <code>Money</code>, <code>Currency</code>,{" "}
          <code>Address</code>, <code>DateRange</code>). The shared kernel must
          be small and stable — if it grows too large, it becomes a source of
          coupling between services (changes to the shared kernel require
          coordinated deployments of all services that use it). The shared kernel
          should be versioned and backward-compatible, so that services can
          upgrade to new versions independently.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/service-decomposition-diagram-1.svg"
          alt="Strangler fig pattern showing incremental migration from monolith to microservices through three phases"
          caption="Strangler Fig Pattern — incrementally replace monolith features with microservices via a facade, with each step independently deployable and reversible"
        />

        <p>
          The strangler fig migration begins with deploying a facade (API
          gateway or reverse proxy) in front of the monolith. The facade
          intercepts all incoming requests and routes them to the monolith
          (initially, 100% of traffic goes to the monolith). The first feature
          to be extracted is typically the simplest, least coupled feature — for
          example, the user management feature (which has well-defined
          boundaries and minimal dependencies on other features). The new User
          service is deployed alongside the monolith, with its own database and
          API. The facade is updated to route <code>/users/*</code> requests to
          the User service and all other requests to the monolith. The User
          service is validated (health checks, smoke tests, integration tests,
          and production traffic comparison with the monolith&apos;s user
          management feature). Once validated, the facade routes all user
          management requests to the User service, and the monolith&apos;s user
          management code is deactivated (but not deleted — it is kept as a
          fallback in case the User service needs to be rolled back).
        </p>

        <p>
          The data migration for each extracted feature follows a parallel-run
          pattern. During the parallel-run phase, both the monolith and the new
          service process the same requests (the facade sends each request to
          both, or a copy of the request is sent to the new service via the
          event bus). The responses from the monolith and the new service are
          compared to ensure they are equivalent (within an acceptable tolerance
          for non-deterministic fields like timestamps). Once the parallel-run
          validation confirms that the new service produces correct results, the
          facade routes all traffic to the new service, and the monolith&apos;s
          corresponding feature is deactivated.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/service-decomposition-diagram-2.svg"
          alt="Bounded context mapping for e-commerce showing User, Order, and Product contexts with their entities, databases, and anti-corruption layers"
          caption="Bounded contexts — each context has its own database, API, and ubiquitous language, with anti-corruption layers translating between contexts"
        />

        <p>
          The cross-service communication pattern is a critical design decision
          in service decomposition. Services communicate via two mechanisms:{""}
          <strong>synchronous API calls</strong> (for requests that require an
          immediate response, e.g., &quot;get user details&quot;) and{" "}
          <strong>asynchronous events</strong> (for notifications that do not
          require an immediate response, e.g., &quot;user was updated&quot;).
          Synchronous calls introduce coupling between services (the caller
          depends on the callee&apos;s availability and latency), so they should
          be used sparingly — only for requests that require an immediate
          response. Asynchronous events decouple the sender from the receiver
          (the sender publishes an event and does not wait for a response), so
          they should be the default communication mechanism for cross-service
          notifications.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/service-decomposition-diagram-3.svg"
          alt="Database-per-service pattern showing each service with its own database and no cross-service database access"
          caption="Database-per-service — each service owns its database and communicates with other services via APIs or events, never by sharing databases"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          Service decomposition must be compared against keeping the monolith.
          The monolith is simpler to develop, test, deploy, and operate — it has
          a single codebase, a single database, a single deployment pipeline,
          and a single operational runbook. However, it has limitations: it
          cannot scale individual features independently (the entire monolith
          must be scaled, even if only one feature is under load), it cannot be
          developed by large teams (the codebase becomes too large and complex
          for a single team to manage), and it has a single point of failure (a
          bug in one feature can bring down the entire application).
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Monolith</th>
              <th className="p-3 text-left">Decomposed Services</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Development Speed</strong>
              </td>
              <td className="p-3">
                Fast for small teams
              </td>
              <td className="p-3">
                Fast for large teams (parallel development)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Deployment</strong>
              </td>
              <td className="p-3">
                Single deploy, simple
              </td>
              <td className="p-3">
                Multiple deploys, complex orchestration
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scaling</strong>
              </td>
              <td className="p-3">
                Scale the entire monolith
              </td>
              <td className="p-3">
                Scale individual services
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fault Isolation</strong>
              </td>
              <td className="p-3">
                None — one bug affects all
              </td>
              <td className="p-3">
                Isolated — one service failure contained
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Operational Complexity</strong>
              </td>
              <td className="p-3">Low</td>
              <td className="p-3">
                High (distributed tracing, service mesh, monitoring)
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/service-decomposition-diagram-4.svg"
          alt="Four service decomposition strategies compared: by business capability, by subdomain (DDD), by verb (CQRS), and by data ownership"
          caption="Decomposition strategies — each approach has different trade-offs in terms of boundary clarity, team alignment, and data ownership"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Start with the simplest, least coupled feature when extracting services
          from the monolith. The first extraction sets the pattern for all
          subsequent extractions — if it goes well, the team gains confidence
          and the migration accelerates; if it goes poorly, the team may lose
          confidence and the migration may stall. The simplest feature is
          typically one that has well-defined boundaries (it does not share
          tables with other features in the monolith&apos;s database), minimal
          dependencies (it does not call many other features), and low risk (a
          failure in this feature has minimal impact on the business). For an
          e-commerce monolith, the user management feature is often a good
          first extraction — it has well-defined boundaries (user table, profile
          table, address table), minimal dependencies (other features call it,
          but it does not call many other features), and low risk (a failure
          affects user management but not order processing or payments).
        </p>

        <p>
          Use the strangler fig pattern with a facade (API gateway) for
          zero-downtime migration. The facade intercepts all incoming requests
          and routes them to either the monolith or the new service. Initially,
          all requests go to the monolith. As features are extracted, the facade
          is updated to route the corresponding requests to the new services.
          The facade provides instant rollback — if a new service fails, the
          facade can be updated to route requests back to the monolith. The
          facade also provides a migration safety net — during the parallel-run
          phase, the facade sends each request to both the monolith and the new
          service, and the responses are compared to ensure correctness.
        </p>

        <p>
          Enforce the database-per-service pattern strictly. No service can
          directly access another service&apos;s database. If a service needs
          data that is owned by another service, it must request it through the
          owning service&apos;s API or through an event. This pattern ensures
          that each service can evolve its database schema independently, choose
          the database technology that best fits its data model, and scale its
          database independently of other services. If a service needs a
          denormalized copy of another service&apos;s data (e.g., the Order
          service needs the user&apos;s name for display), it should subscribe
          to the other service&apos;s events (e.g., <code>UserUpdated</code>)
          and maintain a local, denormalized copy of the data.
        </p>

        <p>
          Keep the shared kernel small and stable. The shared kernel should
          contain only genuinely common types (e.g., <code>Money</code>,{" "}
          <code>Currency</code>, <code>Address</code>) that are used by multiple
          services and are unlikely to change. If the shared kernel grows too
          large, it becomes a source of coupling between services (changes to
          the shared kernel require coordinated deployments of all services that
          use it). The shared kernel should be versioned and backward-compatible,
          so that services can upgrade to new versions independently.
        </p>

        <p>
          Validate each extracted service through parallel-run testing before
          routing production traffic to it. During the parallel-run phase, both
          the monolith and the new service process the same requests (the facade
          sends each request to both, or a copy of the request is sent to the
          new service via the event bus). The responses from the monolith and
          the new service are compared to ensure they are equivalent (within an
          acceptable tolerance for non-deterministic fields like timestamps).
          The parallel-run phase should last long enough to cover all edge cases
          (typically 1–2 weeks of production traffic), and the comparison should
          be automated (using a diff tool that compares the responses and flags
          any significant differences).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Extracting services based on technical layers (e.g., a &quot;database
          service&quot;, a &quot;logging service&quot;, a &quot;authentication
          service&quot;) instead of business capabilities is a common mistake.
          Technical-layer services create tight coupling between services (the
          business logic services depend on the technical services, and the
          technical services have no business context), and they do not provide
          the benefits of microservices (independent deployability, independent
          scaling, fault isolation). Services should be extracted based on
          business capabilities (e.g., &quot;Order Processing&quot;, &quot;User
          Management&quot;, &quot;Payment Processing&quot;) — each service
          should encapsulate a complete business capability, including its data,
          business logic, and API.
        </p>

        <p>
          Allowing services to share databases is the most common source of
          coupling in decomposed systems. If two services share a database, they
          are tightly coupled through the schema — a schema change in one service
          may break the other service. Additionally, the shared database becomes
          a single point of failure — if the database is down, both services are
          down. The solution is to enforce the database-per-service pattern
          strictly — no service can directly access another service&apos;s
          database. If a service needs data that is owned by another service, it
          must request it through the owning service&apos;s API or through an
          event.
        </p>

        <p>
          Extracting too many services too quickly leads to a distributed
          monolith — services that are independently deployed but tightly
          coupled through synchronous calls, shared databases, or coordinated
          deployments. The solution is to extract services incrementally (one
          feature at a time), validate each extraction through parallel-run
          testing, and ensure that each service is truly independent (it can be
          deployed, scaled, and operated independently of other services).
        </p>

        <p>
          Not planning for cross-service transactions is a common oversight.
          In a monolith, a transaction that spans multiple features is a single
          ACID transaction. In a decomposed system, a transaction that spans
          multiple services requires a distributed transaction (two-phase commit,
          saga pattern, or eventual consistency). If cross-service transactions
          are not planned for, the decomposed system may have data inconsistency
          issues (e.g., an order is created but the inventory is not deducted,
          because the Order service and the Inventory service are in different
          services with different databases). The solution is to use the saga
          pattern for cross-service transactions — each service performs its
          local transaction, and if a service fails, the saga&apos;s compensating
          actions undo the preceding services&apos; transactions.
        </p>

        <p>
          Underestimating the operational complexity of a decomposed system is
          a common cause of migration failure. A decomposed system requires
          distributed tracing (to trace requests across services), service mesh
          (to manage service-to-service communication), centralized monitoring
          (to monitor each service&apos;s health, latency, and error rate),
          centralized logging (to aggregate logs from all services), and
          automated deployment pipelines (to deploy each service independently).
          If the team is not prepared for this operational complexity, the
          decomposed system may be harder to operate than the original monolith.
        </p>
      </section>

      {/* Section 7: Real-world Use Cases */}
      <section>
        <h2>Real-world Use Cases</h2>

        <p>
          Amazon used the strangler fig pattern to decompose its monolithic
          e-commerce platform into microservices in the early 2000s. The
          migration began with the &quot;buy&quot; feature (the checkout
          process), which was extracted into a separate service with its own
          database. The facade (a reverse proxy) was updated to route checkout
          requests to the new service and all other requests to the monolith.
          Over the next several years, more features were extracted (product
          catalog, user management, payment processing, shipping), until the
          monolith was empty and could be decommissioned. Amazon&apos;s
          migration is one of the most famous examples of the strangler fig
          pattern in action, and it enabled Amazon to scale its e-commerce
          platform to handle millions of transactions per day.
        </p>

        <p>
          SoundCloud used domain-driven design to decompose its monolithic
          Ruby on Rails application into microservices. The migration began
          with a DDD analysis of the monolith&apos;s domain model, identifying
          bounded contexts (User, Track, Playlist, Social Graph) and their
          relationships. Each bounded context was extracted into a separate
          service with its own database, and the services communicated via
          events (published to Kafka) and synchronous API calls (via a service
          mesh). SoundCloud&apos;s migration enabled its engineering team to
          scale from a single team to dozens of teams, each responsible for
          one or more services.
        </p>

        <p>
          Groupon used the strangler fig pattern to decompose its monolithic
          PHP application into a set of microservices (Java and Scala). The
          migration began with the &quot;deal&quot; feature (the core product
          offering), which was extracted into a separate service with its own
          database. The facade (an API gateway) was updated to route deal-related
          requests to the new service and all other requests to the monolith.
          Over the next two years, more features were extracted (user management,
          order processing, payment processing, email notifications), until the
          monolith was reduced to a thin layer of legacy code that was eventually
          decommissioned. Groupon&apos;s migration enabled its engineering team
          to deploy services independently (from a single daily deployment to
          dozens of deployments per day) and to scale individual services based
          on their load profiles.
        </p>

        <p>
          Monzo Bank used domain-driven design and the strangler fig pattern to
          build its banking platform as a set of microservices (Go) from the
          outset. Each service was designed around a bounded context (Account,
          Transaction, Payment, Card, Notification), with its own database
          (CockroachDB for strong consistency) and its own API (gRPC for
          service-to-service communication, REST for external APIs). Monzo&apos;s
          service-oriented architecture enabled its engineering team to deploy
          services independently (hundreds of deployments per day), to scale
          individual services based on their load profiles, and to isolate
          failures (a failure in one service does not cascade to other services).
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: How do you identify the right service boundaries when
          decomposing a monolith? What framework would you use?
          </h3>
          <p className="mb-3">
            The right service boundaries are identified using a combination of{" "}
            <strong>Domain-Driven Design (DDD)</strong> and{" "}
            <strong>business capability analysis</strong>. The DDD approach
            identifies bounded contexts — logical boundaries within which a
            particular domain model is defined and applies. Each bounded context
            has its own ubiquitous language (terms that have a single,
            unambiguous meaning within the context), and it maps naturally to a
            service. The business capability approach identifies the business
            functions that the organization performs (e.g., user management,
            order processing, payment processing), and each function maps to a
            service.
          </p>
          <p className="mb-3">
            The practical process is: <strong>Step 1:</strong> Analyze the
            monolith&apos;s domain model — identify the entities, their
            relationships, and the operations that act on them.{" "}
            <strong>Step 2:</strong> Identify the bounded contexts — group
            entities that are closely related and share a common ubiquitous
            language. <strong>Step 3:</strong> Validate the boundaries — check
            that each bounded context has a well-defined responsibility (it
            encapsulates a complete business capability), minimal dependencies
            on other contexts (it does not call many other contexts), and
            independent data ownership (it owns its data and does not share
            tables with other contexts). <strong>Step 4:</strong> Align with
            team structure — each bounded context should be developable and
            operable by a small, focused team (the &quot;two-pizza team&quot;
            rule — a team that can be fed by two pizzas, typically 5–9 people).
          </p>
          <p>
            The key heuristic for validating service boundaries is:{" "}
            <em>can this service be deployed, scaled, and operated
            independently of other services?</em> If the answer is yes, the
            boundary is correct. If the answer is no (the service depends on
            another service&apos;s deployment, or it cannot be scaled
            independently, or it shares a database with another service), the
            boundary needs to be revised.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Describe the strangler fig pattern. How do you ensure
          zero-downtime during the migration?
          </h3>
          <p className="mb-3">
            The strangler fig pattern involves placing a facade (API gateway or
            reverse proxy) in front of the monolith, intercepting all incoming
            requests. Initially, the facade routes all requests to the monolith.
            As features are extracted from the monolith into new services, the
            facade is updated to route the corresponding requests to the new
            services. Over time, more and more features are extracted, and the
            monolith shrinks. Eventually, the monolith is empty and can be
            decommissioned.
          </p>
          <p className="mb-3">
            Zero-downtime is ensured by the facade&apos;s ability to route
            requests to either the monolith or the new service. During the
            extraction of a feature, the facade routes requests to both the
            monolith and the new service (parallel-run testing), and the
            responses are compared to ensure correctness. Once the new service
            is validated, the facade routes all requests for that feature to the
            new service, and the monolith&apos;s corresponding feature is
            deactivated (but not deleted — it is kept as a fallback). If the new
            service fails, the facade can be updated to route requests back to
            the monolith — an instant rollback.
          </p>
          <p className="mb-3">
            The data migration is handled through a parallel-run pattern —
            during the parallel-run phase, both the monolith and the new service
            process the same requests (the facade sends each request to both, or
            a copy of the request is sent to the new service via the event bus).
            The responses from the monolith and the new service are compared to
            ensure they are equivalent (within an acceptable tolerance for
            non-deterministic fields like timestamps). Once the parallel-run
            validation confirms that the new service produces correct results,
            the facade routes all traffic to the new service, and the
            monolith&apos;s corresponding feature is deactivated.
          </p>
          <p>
            The key operational practice is to extract features incrementally
            (one feature at a time), validate each extraction through
            parallel-run testing, and ensure that each extraction is reversible
            (the facade can route requests back to the monolith if the new
            service fails). This ensures that the migration is zero-downtime,
            low-risk, and reversible at every step.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you handle cross-service transactions in a decomposed
          system? What are the trade-offs of each approach?
          </h3>
          <p className="mb-3">
            Cross-service transactions are handled using one of three approaches:{""}
            <strong>Two-phase commit (2PC)</strong>, <strong>saga
            pattern</strong>, or <strong>eventual consistency</strong>.
          </p>
          <p className="mb-3">
            <strong>Two-phase commit (2PC)</strong> uses a coordinator to ensure
            that all services commit or abort the transaction atomically. The
            coordinator sends a PREPARE request to all services, waits for all
            services to acknowledge, and then sends a COMMIT or ABORT. 2PC
            provides strong consistency (all services commit or all abort) but
            is slow (two network round-trips) and blocks if the coordinator
            crashes during the vote phase. 2PC is suitable for transactions that
            require strong consistency (e.g., financial transactions).
          </p>
          <p className="mb-3">
            <strong>Saga pattern</strong> decomposes the transaction into a
            sequence of local transactions, each with a compensating action. If
            a service fails, the saga&apos;s compensating actions undo the
            preceding services&apos; transactions. Sagas provide eventual
            consistency (non-blocking) but require the application to define
            compensating actions. Sagas are suitable for transactions that can
            tolerate eventual consistency (e.g., order processing, where the
            order is created, the inventory is deducted, and the payment is
            captured — if any step fails, the preceding steps are compensated).
          </p>
          <p className="mb-3">
            <strong>Eventual consistency</strong> uses events to synchronize
            data across services, without explicit transaction coordination.
            Each service processes its local transaction and publishes an event
            describing the change. Other services consume the event and update
            their local state accordingly. Eventual consistency is the simplest
            approach (no coordination protocol is needed) but it provides the
            weakest consistency guarantee (there is a window during which
            services have inconsistent state). Eventual consistency is suitable
            for operations that can tolerate eventual consistency (e.g., updating
            a user&apos;s profile, which is eventually reflected in all services
            that cache the user&apos;s data).
          </p>
          <p>
            The recommended approach is to use the saga pattern for most
            cross-service transactions — it provides a good balance of
            consistency (eventual atomicity) and availability (non-blocking
            execution). 2PC should be reserved for transactions that require
            strong consistency (e.g., financial transactions), and eventual
            consistency should be used for operations that can tolerate
            inconsistent state (e.g., caching, analytics).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: What is an anti-corruption layer, and when do you need one?
          </h3>
          <p className="mb-3">
            An anti-corruption layer (ACL) is an adapter that translates
            between the domain models of different bounded contexts. When Service
            A needs data from Service B, the ACL translates Service B&apos;s
            data model into Service A&apos;s domain model, preventing Service
            B&apos;s model from &quot;corrupting&quot; Service A&apos;s model.
          </p>
          <p className="mb-3">
            You need an ACL when two services have different ubiquitous languages
            for the same concept. For example, the User service has a
            &quot;Customer&quot; model (with attributes like login credentials,
            profile information, and preferences), and the Order service has a
            &quot;Buyer&quot; model (with attributes like order history, shipping
            address, and payment method). These are different concepts that
            happen to refer to the same real-world entity (the user). If the
            Order service uses the User service&apos;s &quot;Customer&quot; model
            directly, the Order service&apos;s domain model becomes corrupted
            (it now includes concepts that are not part of its ubiquitous
            language). The ACL translates the User service&apos;s &quot;Customer&quot;
            model into the Order service&apos;s &quot;Buyer&quot; model, ensuring
            that the Order service&apos;s domain model remains clean and focused
            on its own ubiquitous language.
          </p>
          <p>
            You do not need an ACL when two services share the same ubiquitous
            language for the same concept (e.g., both services use the same
            <code>Money</code> type from the shared kernel). In this case, the
            services can communicate directly without translation. The ACL is
            only needed when the services have different models for the same
            concept, and the translation is non-trivial (it requires mapping
            fields, transforming data types, or applying business rules).
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Evans, E. (2003). &quot;Domain-Driven Design: Tackling Complexity
            in the Heart of Software.&quot; Addison-Wesley. — The foundational
            DDD book, introducing bounded contexts, ubiquitous language, and
            subdomain analysis.
          </li>
          <li>
            Fowler, M. (2004). &quot;StranglerApplication.&quot;
            martinfowler.com. — The original description of the strangler fig
            pattern for incremental migration.
          </li>
          <li>
            Newman, S. (2021). &quot;Building Microservices, 2nd Edition.&quot;
            O&apos;Reilly Media. — Comprehensive guide to service decomposition,
            including boundary identification, data migration, and the strangler
            fig pattern.
          </li>
          <li>
            Richardson, C. (2018). &quot;Microservices Patterns.&quot; Manning
            Publications. — Covers the database-per-service pattern, saga
            pattern, and anti-corruption layers in detail.
          </li>
          <li>
            Vernon, V. (2013). &quot;Implementing Domain-Driven Design.&quot;
            Addison-Wesley. — Practical guide to DDD implementation, including
            bounded context mapping and context mapping patterns (ACL, shared
            kernel, customer-supplier).
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
