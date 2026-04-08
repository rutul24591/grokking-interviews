"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-idempotency",
  title: "Idempotency",
  description: "Staff-level idempotency patterns: idempotent keys, deduplication, retry safety, HTTP method idempotency, distributed idempotency across services, and idempotency storage design.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "idempotency",
  wordCount: 5600,
  readingTime: 23,
  lastUpdated: "2026-04-08",
  tags: ["backend", "reliability", "idempotency", "distributed-systems", "deduplication", "retry-safety"],
  relatedTopics: ["error-handling-patterns", "at-most-once-vs-at-least-once-vs-exactly-once", "data-integrity", "eventual-consistency"],
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
          <strong>Idempotency</strong> is the property of an operation whereby performing it multiple times has the same effect as performing it once. In distributed systems, idempotency is essential because retries are not just possible—they are expected. Network timeouts, server crashes, load balancer retransmissions, and client-side retry logic all create scenarios where the same logical request may arrive at a server multiple times. Without idempotency, each retry can produce duplicate side effects: double charges, duplicate accounts, repeated notifications, or corrupted state.
        </p>
        <p>
          Idempotency is often confused with simply returning the same HTTP response. It is about business effects, not response consistency. If a retry causes two emails to be sent or two invoices to be created, the operation is not effectively idempotent, even if the client receives a 200 status code both times. Strong designs specify which effects must be exactly-once—charging a card, creating an account—and which effects can be best-effort—emitting an analytics event, logging an audit record.
        </p>
        <p>
          For staff and principal engineers, idempotency requires balancing four competing concerns. <strong>Correctness</strong> means that repeated requests must never produce duplicate business effects—this is non-negotiable for financial transactions, provisioning operations, and state mutations. <strong>Performance</strong> means that idempotency checks must be fast and not add significant latency to every request—deduplication lookups should be sub-millisecond. <strong>Storage</strong> means that idempotency records must be managed with appropriate retention policies—keys must expire to prevent unbounded growth, but expiration windows must exceed client retry time to remain safe. <strong>Distribution</strong> means that idempotency must work across multiple service instances, potentially across multiple regions, which requires shared state and careful consistency modeling.
        </p>
        <p>
          The business impact of idempotency decisions is directly measurable. Double charges destroy customer trust and require costly refunds and reconciliation. Duplicate provisioning creates orphaned resources that are difficult to track and clean up. Repeated state transitions corrupt business logic and require manual intervention. Idempotency is not an API nicety—it is a reliability guarantee that protects both the business and its customers from the inherent unreliability of network communication.
        </p>
        <p>
          In system design interviews, idempotency demonstrates understanding of distributed systems failure modes, retry semantics, deduplication architecture, and the distinction between at-least-once, at-most-once, and exactly-once processing. It shows you think about what happens when the network fails mid-request and how to ensure that partial failures do not cause duplicate effects.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/idempotent-key-pattern.svg"
          alt="Idempotent key pattern flow showing: Client generates unique idempotency key (UUID) and sends with request to server → Server checks idempotency store (key exists? If yes, return cached response. If no, process request, store result with key, return response). Shows duplicate request flow returning cached response without re-processing"
          caption="Idempotent key pattern — client generates unique key, server checks store, processes if new, returns cached result if duplicate"
        />

        <h3>HTTP Method Idempotency</h3>
        <p>
          HTTP semantics provide a foundation for idempotency. GET, PUT, DELETE, HEAD, OPTIONS, and TRACE are defined as idempotent by the HTTP specification. POST is not idempotent by default. This means that repeating a PUT request should have the same effect as a single PUT—updating a resource to the same state. Repeating a DELETE should have the same effect—the resource is deleted, and subsequent deletes are no-ops.
        </p>
        <p>
          However, HTTP semantics alone are not sufficient for application-level idempotency. A PUT request that updates a user record is idempotent at the HTTP level, but if the update triggers a side effect like sending a notification email, that side effect may not be idempotent. Similarly, a POST request can be made idempotent at the application level through the use of idempotency keys, even though HTTP defines POST as non-idempotent.
        </p>
        <p>
          The staff-level insight is to treat HTTP method semantics as a hint, not a guarantee. Implement server-side deduplication for any operation that has side effects, regardless of the HTTP method used. The idempotency guarantee is an application-level concern that HTTP semantics cannot fully address.
        </p>

        <h3>Idempotency Keys</h3>
        <p>
          The most common idempotency pattern is the idempotency key—a unique identifier generated by the client for each logical request. The client includes the key in the request header or body. The server checks whether it has already processed this key. If yes, it returns the cached response without repeating side effects. If no, it processes the request, stores the result keyed by the idempotency key, and returns the response.
        </p>
        <p>
          Idempotency keys must be scoped to prevent accidental collisions. Keys should be scoped by tenant, user, or service to ensure that different clients do not accidentally reuse the same key for different requests. Keys should also be bound to the request parameters—a fingerprint of the request payload prevents accidental misuse where a key is reused for a different operation. If the fingerprint does not match, the server should reject the request rather than returning a cached response.
        </p>
        <p>
          The idempotency store must record not just the result but also the processing status. Status is important because it distinguishes "in progress" from "completed." Without status, concurrent retries can both attempt the side effect simultaneously. Some systems use a short lock or lease around the key to serialize work for the same operation while still allowing different keys to proceed concurrently.
        </p>

        <h3>Deduplication and Storage Design</h3>
        <p>
          Idempotency storage must be highly available. If the idempotency store is down, retries can cause duplicate writes and break correctness guarantees. The key detail is the ordering of effects: the safest approach is to persist the "already processed" record in the same atomic unit as the side effect. If you store the idempotency record only after the side effect commits, a crash between the side effect and the record storage creates ambiguity—a retry might legitimately re-execute the side effect.
        </p>
        <p>
          The choice of storage impacts both availability and latency. A cache-based idempotency store (Redis, Memcached) is fast—sub-millisecond lookups—but can lose records during outages, which may allow duplicates. A durable store (PostgreSQL, DynamoDB) is safer but adds latency and operational cost. Many systems use a hybrid approach: durable uniqueness constraints for the most critical invariants, plus a cache to reduce duplicate processing for high-volume retries.
        </p>
        <p>
          Key retention must be managed carefully. Keys must expire to prevent unbounded storage growth, but the expiration window must exceed the client's retry time to remain safe. If a client retries after 5 minutes but the idempotency key expired after 2 minutes, the retry will be treated as a new request and may cause duplicate effects. A common retention window is 24-72 hours, depending on the client's retry behavior and async callback patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/idempotency-across-services.svg"
          alt="Distributed idempotency across services showing: Client sends request with idempotency key to Service A → Service A processes and calls Service B with same key → Service B processes and calls Service C with same key. Each service has its own idempotency store. Shows how the key propagates through the call chain and each service deduplicates independently"
          caption="Distributed idempotency — idempotency key propagates through service call chain, each service deduplicates independently with its own store"
        />

        <h3>Distributed Idempotency</h3>
        <p>
          In multi-service architectures, idempotency must work across service boundaries. When Service A calls Service B as part of processing a client request, and the client retries the original request, Service A must not re-execute its call to Service B. This requires propagating the idempotency key through the service call chain and having each service independently check and record idempotency.
        </p>
        <p>
          The propagation pattern is straightforward. The client generates an idempotency key and includes it in the request to Service A. Service A processes the request and, when calling Service B, passes the same idempotency key (possibly with a service-specific prefix). Service B checks its own idempotency store and processes or returns a cached result. Each service maintains its own idempotency store scoped to its own operations.
        </p>
        <p>
          Multi-stage workflows add another layer of complexity. A workflow that spans multiple steps—validate payment, reserve inventory, confirm order—needs idempotency at two levels. First, the external API call should be idempotent so clients can retry safely. Second, internal steps should be idempotent so worker retries do not duplicate side effects. Durable state machines help here: each step is applied only if it advances the state forward, and repeated events become no-ops.
        </p>

        <h3>Client Responsibility</h3>
        <p>
          Idempotency is a contract between client and server—both sides must implement it correctly. Clients must generate stable idempotency keys for retries. If a client generates a new key per retry attempt, idempotency fails entirely. The key should be generated once when the user initiates the action and reused for all retries of that action.
        </p>
        <p>
          Clients should also propagate request deadlines and avoid infinite retries. If a client retries beyond the idempotency retention window, the server may legitimately treat the request as new. Document the expected retry envelope—the maximum retry duration and the idempotency key retention period—and ensure SDKs follow it so operational behavior is predictable.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A robust idempotency architecture treats idempotency as a cross-cutting concern with standardized key generation, storage, and lifecycle management. The flow begins with the client generating a unique idempotency key (typically a UUID v4) for each logical request. The server receives the request, checks the idempotency store for an existing record, and either returns the cached response or processes the request and stores the result. The entire check-process-store sequence should be atomic to prevent race conditions between concurrent retries.
        </p>

        <h3>Idempotency Middleware</h3>
        <p>
          Implement idempotency as middleware that wraps the request handler. The middleware extracts the idempotency key from the request header, checks the store, and either short-circuits with a cached response or passes through to the handler. After the handler completes, the middleware stores the response keyed by the idempotency key before returning it to the client. This pattern keeps idempotency logic separate from business logic and ensures consistent behavior across all endpoints.
        </p>
        <p>
          The middleware should handle concurrent retries safely. Use a distributed lock or a database-level unique constraint to ensure that only one instance processes a given idempotency key at a time. Concurrent retries that both pass the "key not found" check would both process the request, defeating the purpose of idempotency. The lock should be short-lived—long enough to prevent concurrent processing but short enough to avoid holding resources if the processing instance crashes.
        </p>

        <h3>Idempotency in Event-Driven Systems</h3>
        <p>
          In event-driven architectures, idempotency is essential for message consumers. Message brokers typically provide at-least-once delivery semantics, meaning the same message may be delivered multiple times. Consumers must be idempotent to handle duplicate deliveries safely. The idempotency key in this context is the message ID, and the consumer checks whether it has already processed this message ID before processing.
        </p>
        <p>
          The consumer idempotency store should be co-located with the state being modified. If the consumer updates a database record, the idempotency check and the update should be in the same transaction. This ensures that the "already processed" record and the state change are atomic—either both commit or both roll back, preventing the ambiguity of a processed side effect with no idempotency record.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/http-method-idempotency.svg"
          alt="HTTP method idempotency comparison showing which methods are idempotent (GET, PUT, DELETE, HEAD, OPTIONS, TRACE) and which are not (POST, PATCH). Shows examples of each method's behavior when repeated: GET returns same data, PUT sets same state, DELETE removes resource (subsequent deletes are no-ops), POST creates duplicate resources, PATCH may apply different changes"
          caption="HTTP method idempotency — GET, PUT, DELETE are idempotent by specification; POST is not; PATCH is conditionally idempotent"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Idempotency improves correctness but adds storage and latency overhead. The idempotency check adds a lookup to every request, and storing results adds a write. For high-throughput systems, this overhead can be significant. The trade-off is between correctness and performance—and for operations with side effects such as payments, provisioning, or user creation, correctness always wins. For read-only operations or best-effort side effects like analytics, idempotency may be unnecessary.
        </p>
        <p>
          The choice of idempotency storage is a critical trade-off. Cache-based storage is fast but volatile—records can be lost during outages, allowing duplicates. Durable storage is safe but slower and more expensive. The hybrid approach—durable constraints for critical invariants plus a cache for high-volume retry deduplication—provides a balance but adds operational complexity. The right choice depends on the cost of a duplicate: if a double charge costs the business $100 in refunds and reputation damage, the durable storage cost is justified.
        </p>
        <p>
          Key retention is another trade-off. Longer retention improves safety—clients can retry for a longer window without risk of duplicates—but increases storage cost and can itself cause reliability issues if the store grows unbounded. Shorter retention reduces cost but increases the risk that a late retry is treated as a new request. The retention window should be based on observed client retry behavior, not arbitrary defaults.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use idempotency keys for all side-effecting operations, not just POST requests. Any operation that creates, modifies, or triggers an external effect should be idempotent. Define which operations require idempotency and document the key management policy for each operation. Monitor duplicate request rates and idempotency cache hit rates to ensure the system is functioning correctly.
        </p>
        <p>
          Store idempotency results in the same atomic unit as the side effect whenever possible. Use database transactions to ensure that the "already processed" record and the state change commit together. If atomic storage is not possible, use conditional updates, unique constraints on business identifiers, or outbox-driven workflows to provide a reliable idempotency boundary.
        </p>
        <p>
          Scope idempotency keys by tenant or user to prevent accidental collisions. Bind keys to request fingerprints to prevent accidental misuse across different operations. Set retention windows based on observed client retry behavior, with a safety margin. Alert on anomalies: spikes in duplicate requests, increased idempotency misses, and elevated fingerprint mismatch rates.
        </p>
        <p>
          During incidents with high retry rates, ensure the idempotency store remains healthy. If the store fails, the system may execute duplicate work and amplify downstream load—exactly the opposite of what idempotency is designed to prevent. Protect the idempotency store with rate limiting, dedicated capacity, and high availability configuration. Treat the idempotency store as critical infrastructure, not a caching layer.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Expiring idempotency keys too quickly is the most common pitfall. If keys expire before the client's retry window closes, retries will be treated as new requests and may cause duplicate effects. This is particularly dangerous for async operations where the client may retry hours or days after the original request. The retention window must cover the longest credible retry scenario, including offline clients, batch processing delays, and async callback patterns.
        </p>
        <p>
          Partial idempotency—where only some side effects are deduplicated—leads to inconsistent behavior that is difficult to diagnose. For example, a payment API may deduplicate the charge but not the notification email, resulting in one charge but two emails. All side effects of an operation must be covered by the same idempotency guarantee. If some effects cannot be deduplicated, they should be decoupled from the idempotent operation and handled asynchronously with their own idempotency mechanism.
        </p>
        <p>
          Key scoping failures allow accidental collisions. If idempotency keys are not scoped by tenant or user, different clients may accidentally use the same key for different requests, causing incorrect responses to be reused. Similarly, if keys are accepted without binding to request parameters, a client bug can reuse keys across different operations and produce surprising outcomes that are difficult to debug.
        </p>
        <p>
          Concurrent retry processing is a subtle failure. Two retries for the same idempotency key may arrive simultaneously, and both may pass the "key not found" check before either stores the result. This creates a race condition where the side effect is applied twice. The fix is to use a distributed lock, a database-level unique constraint, or a compare-and-swap operation to ensure that only one instance processes a given key at a time.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Payment Processing: Stripe-style Idempotency</h3>
        <p>
          A payment processing platform implemented idempotency keys for all charge creation requests. Clients generate a UUID for each charge attempt and include it in the Idempotency-Key header. The server checks a Redis-backed idempotency store, processes the charge if new, and stores the result. The tricky part is that the first attempt might succeed at the payment provider but fail while returning the response. The system treats the provider transaction ID as part of the internal state machine and ensures that any retry resolves to the same internal payment intent. This prevents double charges even when the payment provider confirms the charge but the response is lost in transit.
        </p>

        <h3>E-Commerce: Order Creation with Inventory Reservation</h3>
        <p>
          An e-commerce platform needed idempotent order creation that reserved inventory and charged the customer. The order creation workflow spans three services: order service, inventory service, and payment service. The idempotency key propagates through all three services, and each service independently checks and records idempotency. If the client retries after a timeout, the order service returns the existing order, the inventory service confirms the existing reservation, and the payment service returns the existing charge—no duplicates at any level.
        </p>

        <h3>Event-Driven: Kafka Consumer Idempotency</h3>
        <p>
          A data pipeline consumed events from Kafka and updated materialized views in a PostgreSQL database. Kafka provides at-least-once delivery, so duplicate events were expected. The consumer used the Kafka message offset and partition as the idempotency key, storing processed offsets in the same PostgreSQL transaction as the materialized view update. This ensured atomicity: either the offset and the view update both committed, or neither did. Duplicate deliveries became no-ops because the offset was already recorded.
        </p>

        <h3>API Gateway: Retry Safety for Microservices</h3>
        <p>
          A microservices platform deployed an API gateway that automatically added idempotency keys to retry requests. When the gateway detected a retry (based on the original request timestamp and endpoint), it generated an idempotency key from the request hash and added it to the retry header. Backend services used this key for deduplication. This pattern protected services that did not implement their own idempotency logic, providing a platform-level safety net for retry-induced duplicates.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you implement idempotency for a payment API?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The client generates a unique idempotency key (UUID) for each charge attempt and includes it in the request header. The server checks a durable idempotency store for an existing record. If found, it returns the cached response without re-processing. If not found, it processes the charge, stores the result with the key, and returns the response. The check and store must be atomic with the charge operation.
            </p>
            <p>
              The critical detail is handling the case where the charge succeeds at the payment provider but the response is lost. The system must store the provider transaction ID as part of the internal state and ensure that any retry resolves to the same payment intent. Idempotency is not just a key lookup—it is a way to ensure that a distributed workflow produces a single outcome.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the trade-off in idempotency key retention?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Shorter retention reduces storage cost but increases the risk that a late retry is treated as a new request, causing duplicate effects. Longer retention improves safety but increases storage cost and can cause reliability issues if the store grows unbounded. The retention window should be based on observed client retry behavior, with a safety margin.
            </p>
            <p>
              A common approach is 24-72 hours for synchronous APIs and longer for async workflows with delayed callbacks. Monitor the idempotency store size and the distribution of retry latencies to tune the retention window. Alert on storage growth trends and on retries that fall outside the retention window.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle retries when a request may have partially completed?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use a state machine model where each state transition is idempotent. The idempotency record includes the current state of the operation. When a retry arrives, the system checks the state: if the operation is "completed," return the cached response. If it is "in progress," wait or return a retry-after header. If it is "not started," process it.
            </p>
            <p>
              The safest approach is to persist the "already processed" record in the same atomic unit as the side effect. If the side effect committed but the response was lost, the idempotency record will reflect the completed state, and the retry will return the cached response. If neither committed, the retry will re-process. The ambiguous case—side effect committed but record not stored—is prevented by atomic transactions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Which HTTP methods are idempotent and why does it matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              GET, PUT, DELETE, HEAD, OPTIONS, and TRACE are idempotent by HTTP specification. POST is not. PUT is idempotent because setting a resource to the same state multiple times has the same effect as doing it once. DELETE is idempotent because deleting an already-deleted resource is a no-op.
            </p>
            <p>
              However, HTTP semantics are not sufficient for application-level idempotency. A PUT that triggers a side effect (sending a notification) is not idempotent at the business level. Conversely, a POST can be made idempotent at the application level through idempotency keys. Treat HTTP method semantics as a hint, not a guarantee, and implement server-side deduplication for any operation with side effects.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you implement idempotency across multiple services?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Propagate the idempotency key through the service call chain. The client includes the key in the request to Service A. Service A passes the same key (with a service-specific prefix if needed) to Service B. Each service independently checks its own idempotency store and processes or returns a cached result. Each service maintains its own idempotency store scoped to its own operations.
            </p>
            <p>
              For multi-stage workflows, model the workflow as a durable state machine where each step transition is idempotent. Each step is applied only if it advances the state forward, and repeated events become no-ops. This keeps retries safe even if the system crashes mid-workflow.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you prevent concurrent retries from processing the same request?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use a distributed lock, a database-level unique constraint, or a compare-and-swap operation to serialize processing for the same idempotency key. The lock should be short-lived—long enough to prevent concurrent processing but short enough to avoid holding resources if the processing instance crashes.
            </p>
            <p>
              In a database-backed store, use INSERT ... ON CONFLICT (or equivalent) to atomically check and insert the idempotency record. If the insert succeeds, this instance processes the request. If the conflict is detected, another instance is already processing or has completed, so return the cached result. This approach is simpler and more reliable than a separate lock.
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
            <a href="https://datatracker.ietf.org/doc/html/rfc9110#section-9.2" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 9110: HTTP Semantics — Idempotent Methods
            </a> — HTTP specification defining idempotent method semantics.
          </li>
          <li>
            <a href="https://stripe.com/docs/api/idempotent_requests" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe: Idempotent Requests
            </a> — Stripe's idempotency key implementation and best practices.
          </li>
          <li>
            <a href="https://microservices.io/patterns/observability/idempotent-consumer.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Microservices.io: Idempotent Consumer
            </a> — Pattern for idempotent message consumption in event-driven systems.
          </li>
          <li>
            <a href="https://aws.amazon.com/builders-library/using-ids-to-ensure-idempotency/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Builders Library: Using IDs to Ensure Idempotency
            </a> — Practical guide to idempotency key design and implementation.
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/conference/nsdi19/nsdi19-liu.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX NSDI: Exactly-Once Semantics in Distributed Systems
            </a> — Research on exactly-once processing and idempotency guarantees.
          </li>
          <li>
            <a href="https://confluent.io/blog/enabling-idempotent-consumption/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Confluent: Idempotent Consumption in Kafka
            </a> — Implementing idempotent consumers for Kafka streams.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}