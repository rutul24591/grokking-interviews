"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-state-machine",
  title: "State Machine Implementation",
  description:
    "Comprehensive guide to implementing state machines covering state definition, transition validation, persistence strategies, event sourcing integration, and handling concurrent state changes in distributed order and payment systems.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "state-machine-implementation",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "state-machine",
    "backend",
    "design-patterns",
    "distributed-systems",
    "order-management",
  ],
  relatedTopics: ["order-management", "event-sourcing", "workflow-engine", "idempotency"],
};

export default function StateMachineImplementationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          State machines manage entity lifecycle through defined states and transitions, ensuring valid state changes and triggering appropriate actions. In e-commerce and payment systems, state machines govern order lifecycle (pending → confirmed → shipped → delivered), payment processing (pending → authorized → captured → refunded), and subscription management (active → past_due → cancelled → expired). For staff and principal engineers, state machine design involves balancing flexibility (supporting business requirements) with rigor (preventing invalid transitions) while handling distributed systems challenges (concurrent updates, eventual consistency).
        </p>
        <p>
          The complexity of state machines extends beyond simple state transitions. Guards validate preconditions before transitions (payment authorized before shipment). Actions trigger side effects on transitions (send email on order shipped). History tracking enables audit trails and debugging (who changed state, when, why). Persistence strategies determine how state is stored (current state only vs. full event log). Concurrent state changes require locking or optimistic concurrency control. The architecture must support state machine evolution (adding states, modifying transitions) without breaking existing entities.
        </p>
        <p>
          For staff and principal engineers, state machine architecture involves distributed systems patterns. Event sourcing captures state changes as immutable events (OrderCreated, PaymentAuthorized, OrderShipped) enabling replay, debugging, and multiple projections. Saga pattern coordinates state changes across services (order service, payment service, inventory service) with compensating transactions on failure. CQRS separates write model (state machine) from read model (query-optimized projections). The system must handle state machine versioning (v1 orders vs. v2 orders with new states) and migration strategies.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>State Definition</h3>
        <p>
          States represent distinct phases in entity lifecycle. Order states: pending (created, awaiting payment), confirmed (payment authorized, processing), shipped (package shipped, tracking available), delivered (completed), cancelled (user or system cancelled), returned (refund processed). Each state has specific invariants (pending order cannot ship, delivered order cannot cancel). States are mutually exclusive—entity is in exactly one state at a time. State enumeration (enum, union type) prevents invalid states.
        </p>
        <p>
          State categories group related states. Active states (pending, confirmed, shipped) represent ongoing orders. Terminal states (delivered, cancelled, returned) represent completed orders—no further transitions allowed. Intermediate states (processing, packaging) represent sub-states within active states. Category-based validation simplifies rules (all active states allow status query, only terminal states allow archival).
        </p>
        <p>
          State metadata enriches state information. Entered timestamp tracks when state was entered (for SLA monitoring). Entered by tracks who/what triggered transition (user, system, webhook). Exit reason captures why state was exited (user cancelled, payment failed, timeout). Metadata enables analytics (average time in each state, cancellation reasons) and debugging (trace state history).
        </p>

        <h3 className="mt-6">Transition Definition</h3>
        <p>
          Transitions define valid state changes. Explicit enumeration prevents invalid transitions (cannot ship cancelled order). Transition format: from_state × event × guard → to_state + actions. From_state is current state. Event triggers transition (payment_authorized, ship_requested). Guard validates preconditions (inventory available, payment confirmed). To_state is new state. Actions are side effects (send email, update inventory).
        </p>
        <p>
          Transition types vary by trigger. User-triggered transitions (user cancels order) require authentication and authorization. System-triggered transitions (payment timeout) run on schedule or webhook. External-triggered transitions (carrier confirms delivery) depend on third-party events. Each trigger type has different reliability requirements (user actions are authoritative, external events need verification).
        </p>
        <p>
          Transition validation ensures only valid transitions execute. Guard functions check preconditions (order total matches payment amount, shipping address validated). Guard failures return specific errors (insufficient_inventory, payment_mismatch) for user feedback. Guards must be idempotent (same guard check returns same result) and side-effect free (validation only, no state changes).
        </p>

        <h3 className="mt-6">Action Execution</h3>
        <p>
          Actions are side effects triggered on transitions. Notification actions (send email, SMS, push) inform stakeholders. Integration actions (update inventory, charge payment, notify carrier) coordinate with external systems. Audit actions (log transition, update metrics) enable compliance and monitoring. Actions execute after state change commits—failed actions don&apos;t rollback state change (retry separately).
        </p>
        <p>
          Action ordering matters for dependent actions. Sequence: commit state change → send notification → update external systems. Notifications reference new state (order shipped email includes tracking number). External updates assume state change succeeded (inventory deduction assumes order confirmed). Failed actions retry independently—notification failure doesn&apos;t block inventory update.
        </p>
        <p>
          Action failure handling determines retry strategy. Transient failures (email service timeout) retry with exponential backoff. Permanent failures (invalid email address) log error, notify admin, continue. Compensating actions reverse state change if critical action fails (inventory update failed → revert order to pending). Action idempotency prevents duplicate execution on retry.
        </p>

        <h3 className="mt-6">State Persistence</h3>
        <p>
          Current state persistence stores only the current state. Simple, minimal storage. Query: SELECT state FROM orders WHERE id = ?. Limitation: no history, can&apos;t replay or audit. Suitable for simple state machines without compliance requirements. State table: entity_id, current_state, updated_at, updated_by.
        </p>
        <p>
          State history persistence logs all transitions. Each transition creates history record: entity_id, from_state, to_state, event, timestamp, user, metadata. Query: SELECT * FROM state_history WHERE entity_id = ? ORDER BY timestamp. Enables audit trail, debugging, replay. Storage grows with transitions—archive old records.
        </p>
        <p>
          Event sourcing persists state changes as events. Events are immutable: OrderCreated, PaymentAuthorized, OrderShipped. Current state derived by replaying events. Query: SELECT * FROM order_events WHERE order_id = ? ORDER BY sequence. Enables multiple projections (order state, customer timeline, analytics), temporal queries (state at time T), and replay (rebuild projection). Event store append-only—no updates, no deletes.
        </p>

        <h3 className="mt-6">Concurrent State Changes</h3>
        <p>
          Optimistic locking detects concurrent modifications. Version number increments on each state change. Update: UPDATE orders SET state = ?, version = version + 1 WHERE id = ? AND version = ?. If affected rows = 0, concurrent modification detected. Retry with latest state. Optimistic locking suits low-conflict scenarios (rare concurrent updates to same order).
        </p>
        <p>
          Pessimistic locking prevents concurrent modifications. Lock acquired before state change, released after commit. SELECT ... FOR UPDATE locks row. Other transactions wait for lock. Pessimistic locking suits high-conflict scenarios (flash sales, limited inventory) but reduces throughput. Lock timeout prevents deadlocks.
        </p>
        <p>
          Eventual consistency allows temporary state divergence. Service A updates state, publishes event. Service B receives event asynchronously, updates local state. During propagation delay, services have different state views. Conflict resolution: last-write-wins (timestamp comparison), merge (combine changes), or manual (escalate conflict). Eventual consistency suits distributed systems where strict consistency is too costly.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          State machine architecture spans state definition, transition engine, persistence layer, and action execution. State definition (states, transitions, guards, actions) is configuration-driven (YAML, code). Transition engine processes events, validates guards, executes transitions. Persistence layer stores state and history. Action executor runs side effects asynchronously. Event sourcing captures transitions as immutable events.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/state-machine/state-machine-architecture.svg"
          alt="State Machine Architecture"
          caption="Figure 1: State Machine Architecture — State definition, transition engine, persistence, and action execution"
          width={1000}
          height={500}
        />

        <h3>State Definition Layer</h3>
        <p>
          State configuration defines states, transitions, guards, and actions. YAML or JSON format enables non-code changes. State definition: name, type (active/terminal), metadata. Transition definition: from_state, event, guard, to_state, actions. Guard definition: function reference, parameters. Action definition: function reference, parameters, retry policy.
        </p>
        <p>
          Type-safe state machines use enums and union types. TypeScript: type OrderState = &apos;pending&apos; | &apos;confirmed&apos; | &apos;shipped&apos; | &apos;delivered&apos;. Transition function: transition(state: OrderState, event: OrderEvent): OrderState. Compiler catches invalid states and transitions. Runtime validation ensures configuration matches types.
        </p>
        <p>
          State machine libraries provide structure. XState (JavaScript) supports hierarchical states, parallel states, guards, actions. StateMachine (Python) provides declarative state definition. Spring State Machine (Java) integrates with Spring ecosystem. Custom implementation suits specific requirements (event sourcing integration, distributed locking).
        </p>

        <h3 className="mt-6">Transition Engine</h3>
        <p>
          Transition processing handles state change requests. Input: entity_id, event, user, metadata. Steps: load current state, validate transition (event allowed from current state), execute guards (preconditions met), commit state change, execute actions (side effects). Transaction scope: state change + history log. Actions execute post-commit (async).
        </p>
        <p>
          Guard execution validates preconditions. Guard functions are pure (no side effects, deterministic). Guard context includes entity state, event data, user context. Guard result: pass or fail with reason. Multiple guards execute in order—first failure stops transition. Guard caching improves performance (same guard check for batch operations).
        </p>
        <p>
          Action execution runs side effects. Action queue stores pending actions. Action executor processes queue asynchronously. Retry policy per action type (email: 3 retries, payment: 5 retries). Dead letter queue for permanently failed actions. Action idempotency prevents duplicate execution (action_id stored, checked before execution).
        </p>

        <h3 className="mt-6">Persistence Layer</h3>
        <p>
          State storage persists current state. Table: entity_id, state, version, updated_at, updated_by. Index on entity_id for fast lookup. Optimistic locking with version column. Read: SELECT state, version FROM states WHERE entity_id = ?. Write: UPDATE states SET state = ?, version = version + 1 WHERE entity_id = ? AND version = ?.
        </p>
        <p>
          History storage logs transitions. Table: id, entity_id, from_state, to_state, event, user, metadata, timestamp. Index on entity_id and timestamp for history query. Append-only—no updates, no deletes. Partitioning by entity_id or timestamp for large tables. Archive old records to cold storage.
        </p>
        <p>
          Event store persists events for event sourcing. Table: event_id, entity_id, event_type, event_data, sequence, timestamp. Sequence is per-entity, monotonically increasing. Append-only—events never modified. Projection rebuilds state from events. Snapshotting optimizes replay (periodic state snapshot + events since snapshot).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/state-machine/order-state-machine.svg"
          alt="Order State Machine"
          caption="Figure 2: Order State Machine — States, transitions, guards, and actions for order lifecycle"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Event Sourcing Integration</h3>
        <p>
          Event capture stores state changes as events. On transition: create event (type, data, metadata), append to event store, update projection (current state). Event format: event_id, entity_id, event_type, event_data (payload), metadata (user, timestamp, correlation_id). Event schema versioning enables evolution (v1 vs. v2 events).
        </p>
        <p>
          Projection rebuilds state from events. Query: SELECT * FROM events WHERE entity_id = ? ORDER BY sequence. Apply events in order: initial state → apply OrderCreated → apply PaymentAuthorized → apply OrderShipped → current state (shipped). Projection caching avoids full replay (cache current state, apply recent events).
        </p>
        <p>
          Multiple projections enable different query patterns. Order state projection (current state for order lookup). Customer timeline projection (all customer events for account page). Analytics projection (aggregated metrics for dashboard). Each projection optimized for specific query pattern. Event sourcing enables unlimited projections from same event stream.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/state-machine/concurrent-state-changes.svg"
          alt="Concurrent State Changes"
          caption="Figure 3: Concurrent State Changes — Optimistic locking, version conflicts, and retry handling"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          State machine design involves trade-offs between flexibility, rigor, performance, and complexity. Understanding these trade-offs enables informed decisions aligned with business requirements and operational capabilities.
        </p>

        <h3>Persistence: Current State vs. Event Sourcing</h3>
        <p>
          Current state persistence stores only current state. Pros: Simple, minimal storage, fast queries. Cons: No history, can&apos;t replay, limited audit. Best for: Simple state machines, no compliance requirements, low-risk operations.
        </p>
        <p>
          Event sourcing persists all state changes as events. Pros: Full audit trail, replay capability, multiple projections, temporal queries. Cons: Complex implementation, storage growth, query complexity. Best for: Financial transactions, compliance-required, complex business logic, debugging needs.
        </p>
        <p>
          Hybrid: current state + event log. Pros: Fast current state queries, audit trail available. Cons: Duplication (state stored twice), consistency between state and events. Best for: Most production systems—fast queries with audit capability.
        </p>

        <h3>Locking: Optimistic vs. Pessimistic</h3>
        <p>
          Optimistic locking (version check). Pros: High throughput (no lock wait), simple implementation. Cons: Retry on conflict (wasted work), conflict rate increases with concurrency. Best for: Low-conflict scenarios (rare concurrent updates to same entity), read-heavy workloads.
        </p>
        <p>
          Pessimistic locking (row lock). Pros: No conflicts (serialized access), predictable behavior. Cons: Reduced throughput (lock wait), deadlock risk, lock timeout management. Best for: High-conflict scenarios (flash sales, limited inventory), write-heavy workloads.
        </p>
        <p>
          Hybrid: optimistic for reads, pessimistic for writes. Pros: Balances throughput with safety. Cons: More complex implementation. Best for: Most production systems—reads parallel, critical writes serialized.
        </p>

        <h3>Library vs. Custom Implementation</h3>
        <p>
          State machine library (XState, Spring State Machine). Pros: Battle-tested, features (hierarchical states, parallel states), documentation, community. Cons: Learning curve, may not fit specific needs, dependency. Best for: Standard state machines, teams without state machine expertise.
        </p>
        <p>
          Custom implementation. Pros: Tailored to specific needs, no external dependency, full control. Cons: Development time, testing burden, maintenance. Best for: Complex requirements (event sourcing integration, distributed locking), teams with state machine expertise.
        </p>
        <p>
          Hybrid: library for state logic, custom for persistence/integration. Pros: Leverage library for state transitions, customize persistence. Cons: Integration complexity. Best for: Most production systems—library handles state logic, custom persistence for performance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/state-machine/persistence-comparison.svg"
          alt="Persistence Comparison"
          caption="Figure 4: Persistence Comparison — Current state, event sourcing, and hybrid approaches"
          width={1000}
          height={450}
        />

        <h3>State Machine Evolution</h3>
        <p>
          Immutable state machine (no changes after deployment). Pros: Simple, no migration, predictable. Cons: Can&apos;t adapt to business changes, new features require new state machine. Best for: Stable domains, regulatory-compliant processes.
        </p>
        <p>
          Versioned state machine (v1, v2, v3). Pros: Evolve over time, backward compatible. Cons: Version management complexity, migration for existing entities. Best for: Most production systems—business requirements change.
        </p>
        <p>
          Dynamic state machine (configuration-driven). Pros: Change without deployment, business-configurable. Cons: Complex validation, testing challenges. Best for: Multi-tenant systems (different tenants, different state machines), rapidly changing requirements.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Define states explicitly:</strong> Enumerate all valid states (enum, union type). Prevent invalid states at type level. Document state meanings and invariants. Terminal states clearly marked (no outgoing transitions).
          </li>
          <li>
            <strong>Define transitions explicitly:</strong> Enumerate all valid transitions. Guard functions validate preconditions. Action functions handle side effects. Configuration-driven (YAML/JSON) for non-code changes.
          </li>
          <li>
            <strong>Log all transitions:</strong> History table with from_state, to_state, event, user, timestamp. Enables audit trail, debugging, replay. Index on entity_id and timestamp. Archive old records.
          </li>
          <li>
            <strong>Use optimistic locking:</strong> Version column for concurrency control. Update with version check. Retry on conflict with exponential backoff. Monitor conflict rate.
          </li>
          <li>
            <strong>Execute actions asynchronously:</strong> State change commits first, actions execute post-commit. Action queue with retry policy. Dead letter queue for permanent failures. Action idempotency prevents duplicates.
          </li>
          <li>
            <strong>Implement event sourcing:</strong> Capture state changes as immutable events. Enable replay, debugging, multiple projections. Snapshotting optimizes replay. Event schema versioning for evolution.
          </li>
          <li>
            <strong>Handle terminal states:</strong> Terminal states have no outgoing transitions. Validate before transition (can&apos;t leave terminal state). Archive terminal state entities (reduce active dataset).
          </li>
          <li>
            <strong>Monitor state machine:</strong> Track transition rate, guard failure rate, action failure rate. Alert on anomalies (high guard failure, action retry). Dashboard for state distribution (how many orders in each state).
          </li>
          <li>
            <strong>Version state machine:</strong> Version number for state machine definition. Migrate existing entities on version change. Backward compatible transitions (old entities work with new definition).
          </li>
          <li>
            <strong>Test state machine:</strong> Unit tests for guards and actions. Integration tests for transitions. Property-based tests (all valid transitions succeed, all invalid fail). Replay tests for event sourcing.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implicit states:</strong> States not explicitly defined, inferred from nulls/flags. Solution: Explicit enum for all states. No null states.
          </li>
          <li>
            <strong>Missing transitions:</strong> Valid transitions not defined, users blocked. Solution: Enumerate all transitions. Review with business stakeholders.
          </li>
          <li>
            <strong>No guard validation:</strong> Invalid transitions allowed. Solution: Guard functions for all transitions. Validate preconditions.
          </li>
          <li>
            <strong>Actions in transaction:</strong> Failed actions rollback state change. Solution: Actions execute post-commit, async. Retry failed actions independently.
          </li>
          <li>
            <strong>No history:</strong> Can&apos;t debug state changes. Solution: Log all transitions with metadata. Event sourcing for full audit.
          </li>
          <li>
            <strong>No concurrency control:</strong> Concurrent updates corrupt state. Solution: Optimistic locking with version. Retry on conflict.
          </li>
          <li>
            <strong>Terminal state transitions:</strong> Accidentally leave terminal state. Solution: Validate no outgoing transitions from terminal states.
          </li>
          <li>
            <strong>State machine drift:</strong> Different services have different state definitions. Solution: Centralized state machine definition. Version control.
          </li>
          <li>
            <strong>No monitoring:</strong> State machine issues undetected. Solution: Monitor transition rate, guard failures, action failures. Alert on anomalies.
          </li>
          <li>
            <strong>Hard to evolve:</strong> Can&apos;t add states/transitions without breaking existing. Solution: Version state machine. Backward compatible changes. Migration strategy.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Order State Machine</h3>
        <p>
          Amazon order state machine: pending → confirmed → processing → shipped → delivered. Guards: payment authorized before confirmed, inventory available before processing. Actions: send confirmation email, notify warehouse, send tracking email. Event sourcing for audit trail. Parallel state for gift options (independent of order state).
        </p>

        <h3 className="mt-6">Stripe Payment State Machine</h3>
        <p>
          Stripe payment intent state machine: requires_payment_method → requires_confirmation → requires_action → processing → succeeded/failed. Guards: payment method attached before confirmation, 3DS verification before processing. Actions: charge card, send receipt, webhook notification. Event sourcing for dispute handling.
        </p>

        <h3 className="mt-6">Uber Trip State Machine</h3>
        <p>
          Uber trip state machine: requested → accepted → arrived → in_progress → completed → cancelled. Guards: driver accepts before arrived, rider in car before in_progress. Actions: notify rider/driver, calculate fare, charge payment. Real-time state sync between rider/driver apps. Event sourcing for fare disputes.
        </p>

        <h3 className="mt-6">Netflix Subscription State Machine</h3>
        <p>
          Netflix subscription state machine: active → past_due → suspended → cancelled → expired. Guards: payment failed → past_due, max retries → suspended, user request → cancelled. Actions: charge payment, send email, suspend account. Event sourcing for billing history.
        </p>

        <h3 className="mt-6">Jira Issue State Machine</h3>
        <p>
          Jira issue state machine: open → in_progress → in_review → done. Custom workflows per project. Guards: assignee set before in_progress, reviewer approval before done. Actions: notify assignee, update board, log work. Dynamic state machine (admin-configurable per project).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent state changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Optimistic locking with version column. Load state with version. On update: SET state = ?, version = version + 1 WHERE id = ? AND version = ?. If affected rows = 0, concurrent modification detected. Retry with latest state (load, re-validate, re-apply). For high-conflict scenarios, pessimistic locking (SELECT ... FOR UPDATE) serializes access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement event sourcing for state machines?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> On each transition, create event (type, data, metadata). Append to event store (append-only, immutable). Current state derived by replaying events: initial state → apply events in order → current state. Projection caching avoids full replay (cache current state, apply recent events). Multiple projections enable different query patterns (order state, customer timeline, analytics).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle action failures?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Actions execute post-commit, asynchronously. Action queue stores pending actions. Retry policy per action type (email: 3 retries, payment: 5 retries). Dead letter queue for permanently failed actions (manual review). Compensating actions reverse state change if critical action fails (inventory update failed → revert order). Action idempotency prevents duplicate execution on retry.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you evolve state machines without breaking existing entities?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Version state machine definition. New entities use new version. Existing entities: migrate on next transition (apply migration rules) or keep on old version (support multiple versions). Backward compatible changes (add states, add transitions) work for all entities. Breaking changes (remove states, remove transitions) require migration. Test migration thoroughly before deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you debug state machine issues?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event sourcing enables replay—replay events to reproduce issue. State history log shows all transitions (from_state, to_state, event, user, timestamp). Guard failure logging shows why transition failed. Action failure logging shows side effect issues. Monitoring dashboard shows state distribution, transition rate, failure rate. Correlation ID traces state changes across services.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle distributed state machines across services?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Saga pattern coordinates state changes across services. Each service has local state machine. Orchestrator triggers transitions, handles failures with compensating transactions. Event-driven architecture: service publishes state change event, other services react. Eventual consistency—services may have temporary state divergence. Conflict resolution: last-write-wins, merge, or manual escalation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://martinfowler.com/articles/event-sourcing.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Event Sourcing
            </a>
          </li>
          <li>
            <a
              href="https://xstate.js.org/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              XState — JavaScript State Machines
            </a>
          </li>
          <li>
            <a
              href="https://microservices.io/patterns/data/saga.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microservices.io — Saga Pattern
            </a>
          </li>
          <li>
            <a
              href="https://docs.spring.io/spring-statemachine/docs/current/reference/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spring State Machine Documentation
            </a>
          </li>
          <li>
            <a
              href="https://eventstore.org/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EventStoreDB — Event Sourcing Database
            </a>
          </li>
          <li>
            <a
              href="https://www.enterpriseintegrationpatterns.com/patterns/messaging/Stateful.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enterprise Integration Patterns — Stateful Messages
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
