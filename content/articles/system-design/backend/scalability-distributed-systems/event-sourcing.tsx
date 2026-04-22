"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-event-sourcing",
  title: "Event Sourcing",
  description:
    "Staff-level deep dive into event sourcing covering event store architecture, aggregate reconstruction, snapshot optimization, event versioning, schema evolution, and production trade-offs for append-only state management.",
  category: "backend",
  subcategory: "scalability-distributed-systems",
  slug: "event-sourcing",
  wordCount: 5700,
  readingTime: 23,
  lastUpdated: "2026-04-04",
  tags: [
    "event sourcing",
    "event store",
    "append-only log",
    "aggregate reconstruction",
    "snapshots",
    "event versioning",
    "upcasters",
    "temporal queries",
  ],
  relatedTopics: [
    "cqrs",
    "distributed-transactions",
    "data-denormalization",
    "replication-strategies",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Event Sourcing</strong> is a persistence pattern in which the
          state of an application is determined by a sequence of stored events,
          rather than by storing only the current state. In a traditional
          state-stored system, when a user updates their address, the database
          overwrites the old address with the new one — the previous address is
          lost (unless explicitly preserved in an audit table). In an
          event-sourced system, the address update is stored as an event (e.g.,{" "}
          <code>{`AddressChanged { oldAddress, newAddress, timestamp }`}</code>
          ), appended to an append-only event log. The user&apos;s current
          address is derived by replaying all events for that user from the
          event log, applying each event in sequence to reconstruct the current
          state. The event log is the source of truth — the current state is a
          derivation.
        </p>
        <p>
          The pattern was popularized by Martin Fowler in 2005 (building on
          earlier work by Greg Young and the Domain-Driven Design community) and
          has since been adopted by systems that require full auditability,
          temporal reasoning, and flexible state evolution. The core insight is
          that <em>events are facts</em> — they represent things that happened
          in the past, and facts cannot be changed, only supplemented with new
          facts. An address change is a fact that happened at a point in time;
          storing it as an event preserves the historical record. Storing only
          the current address discards the history and loses information that
          may be valuable for auditing, debugging, analytics, or compliance.
        </p>
        <p>
          Event Sourcing is fundamentally different from event-driven
          architecture. Event-driven architecture uses events as a communication
          mechanism between services (service A publishes an event, service B
          consumes it). Event Sourcing uses events as a <em>persistence</em>{" "}
          mechanism — the event store replaces the database as the primary
          storage engine. The events are not just messages; they are the durable
          record of the system&apos;s entire history. An event-sourced system
          can be event-driven (publishing events to other services), but an
          event-driven system is not necessarily event-sourced (it may persist
          state in a traditional database).
        </p>
        <p>
          For staff and principal engineers, Event Sourcing is a powerful but
          demanding pattern. It provides benefits that are impossible to achieve
          with state-stored systems: full audit trails (every change is
          recorded), temporal queries (what was the state at time T?), flexible
          read model evolution (new projections can be created and replayed from
          the event log at any time), and natural integration with CQRS (the
          event store is the write side, projections are the read side). But it
          also introduces significant complexity: event versioning and schema
          evolution, snapshot management for performance, event migration when
          business semantics change, and the mental model shift from &quot;what
          is the current state?&quot; to &quot;what events led to the current
          state?&quot; Event Sourcing should be adopted when its specific
          benefits are required by the business — not as a general-purpose
          persistence strategy.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <p>
          The <strong>event store</strong> is the foundational component of an
          event-sourced system. It is an append-only database that stores events
          in the order they occurred. Each event has a globally unique
          identifier, an aggregate identifier (the entity the event belongs to),
          a sequence number (the event&apos;s position within the
          aggregate&apos;s event stream), an event type (e.g.,{" "}
          <code>OrderCreated</code>, <code>ItemAdded</code>,{" "}
          <code>OrderConfirmed</code>), an event payload (the data describing
          what happened), a timestamp, and optionally a metadata field
          (containing the user ID, correlation ID, causation ID, and other
          contextual information). The event store guarantees that events for a
          given aggregate are stored in sequence-number order and that no two
          events for the same aggregate can have the same sequence number
          (enforced by a unique constraint on the aggregate ID + sequence number
          pair). This guarantee is critical because it ensures that events can
          be replayed in the exact order they occurred, producing a
          deterministic reconstruction of the aggregate&apos;s state.
        </p>

        <p>
          An <strong>aggregate</strong> in event sourcing is the unit of
          consistency — it is a cluster of domain objects that are treated as a
          single unit for data changes. Each aggregate has its own event stream
          in the event store, and events from different aggregates are
          independent (they can be processed concurrently without coordination).
          The aggregate&apos;s current state is reconstructed by loading all
          events for that aggregate from the event store and applying them
          sequentially to an empty aggregate instance. This process is called{" "}
          <em>aggregate reconstruction</em> or <em>state rehydration</em>. For
          example, to reconstruct an order aggregate, the system loads all
          events for that order ID (OrderCreated, ItemAdded, ItemRemoved,
          OrderConfirmed, OrderShipped) in sequence-number order, creates a new
          empty Order object, and applies each event in turn: OrderCreated
          initializes the order with the customer and timestamp, ItemAdded adds
          an item to the order&apos;s item list, ItemRemoved removes an item,
          OrderConfirmed sets the status to &quot;confirmed,&quot; and
          OrderShipped sets the status to &quot;shipped&quot; and records the
          shipping date. The final state of the Order object after all events
          have been applied is the current state.
        </p>

        <p>
          <strong>Snapshots</strong> are a performance optimization that
          addresses the growing cost of aggregate reconstruction as the event
          stream grows. For an aggregate with 10 events, replaying all events is
          fast. For an aggregate with 10,000 events (e.g., a high-activity user
          account with thousands of interactions), replaying all events from the
          beginning is prohibitively slow. A snapshot captures the
          aggregate&apos;s state at a specific point in its event stream (e.g.,
          after event 100) and stores it in a snapshot store. When
          reconstructing the aggregate, the system loads the most recent
          snapshot (event 100) and replays only the events after the snapshot
          (events 101 through the current event). This reduces the replay cost
          from O(total events) to O(events since last snapshot). Snapshots are
          typically taken every N events (e.g., every 100 events) or on a
          time-based schedule (e.g., daily for active aggregates). The snapshot
          is not a replacement for the event stream — the events are retained in
          the event store because they are the source of truth. The snapshot is
          a cached derivation of the state at a point in time, and it can be
          discarded and rebuilt from the event stream at any time.
        </p>

        <p>
          <strong>Event versioning</strong> is the mechanism by which an
          event-sourced system handles schema evolution. Events are long-lived —
          they are stored in the event store indefinitely and may be replayed
          months or years after they were created. If the event schema changes
          (a field is renamed, a new field is added, a field&apos;s type
          changes), old events with the previous schema must still be
          processable by the current event handlers. The standard approach is to
          version each event type (e.g., <code>OrderCreated:v1</code>,{" "}
          <code>OrderCreated:v2</code>) and have event handlers support all
          active versions of each event type. When the schema changes, a new
          version is created, and the event handler is updated to handle both
          the old and new versions. An <em>upcaster</em> is a function that
          transforms an event from an older schema version to a newer one during
          replay — it fills in missing fields with default values, renames
          fields, or transforms data types. Upcasters allow the event handler to
          work with a single schema version (the latest) by upcasting old events
          to the latest version before applying them.
        </p>

        <p>
          <strong>Projections</strong> are the read-side consumers of the event
          stream. A projection subscribes to events of interest and builds a
          denormalized read model by applying each event to its database.
          Projections are the bridge between Event Sourcing and CQRS — the event
          store is the write side, and projections are the read side. A
          projection is idempotent (processing the same event twice produces the
          same result as processing it once) and order-preserving (events are
          processed in the order they appear in the event stream). When a new
          query requirement emerges, a new projection is created and replayed
          from the beginning of the event stream, building the new read model
          from scratch. This is one of Event Sourcing&apos;s most powerful
          properties: the event stream is the source of truth, and read models
          are disposable, re-creatable derivations.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/event-sourcing-diagram-1.svg"
          alt="Event store architecture showing append-only event log and aggregate reconstruction by replaying events sequentially"
          caption="Event store — events are appended sequentially, and aggregates are reconstructed by replaying the event stream"
        />

        <p>
          The write flow in an event-sourced system begins with a command
          arriving at the aggregate&apos;s command handler. The handler
          reconstructs the aggregate by loading its event stream from the event
          store and replaying all events (or loading the latest snapshot and
          replaying events since the snapshot). Once the aggregate is
          reconstructed, the handler invokes the aggregate&apos;s business logic
          method (e.g., <code>order.confirm()</code>), which validates the
          command against the aggregate&apos;s current state (e.g., the order
          must be in &quot;pending&quot; status to be confirmed). If the
          validation passes, the aggregate produces one or more new events
          (e.g.,{" "}
          <code>{`OrderConfirmed { orderId, timestamp, confirmedBy }`}</code>).
          These events are appended to the aggregate&apos;s event stream in the
          event store with the next sequence numbers. The append operation is
          atomic — either all events are appended with the correct sequence
          numbers, or none are (enforced by a transaction or an optimistic
          concurrency check). If the append succeeds, the events are published
          to the event bus for projection consumption, and the command handler
          returns success. If the append fails (due to a concurrency conflict —
          another command handler appended events to the same aggregate between
          the load and the save), the command handler retries: it reloads the
          aggregate (including the new events that caused the conflict),
          re-applies the command, and re-attempts the append.
        </p>

        <p>
          The read flow is handled entirely by projections. When a query
          arrives, the query handler does not interact with the event store — it
          reads from the projection&apos;s read model, which is a denormalized,
          query-optimized data structure. The read model is updated
          asynchronously by the projection, which consumes events from the event
          bus and applies them to its database. The projection maintains an
          offset (the sequence number of the last event it processed) and
          resumes from that offset after a crash. The read model is eventually
          consistent with the event store — there is a lag between an event
          being appended to the event store and the projection applying it to
          the read model. This lag is typically 10–500 milliseconds and is
          monitored as a first-class operational metric.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/event-sourcing-diagram-2.svg"
          alt="Side-by-side comparison of state-stored database showing overwrites versus event-sourced append-only log preserving full history"
          caption="State-stored vs event-sourced — the event log preserves the full history, enabling temporal queries and audit trails"
        />

        <p>
          The event store itself can be implemented on top of various underlying
          databases. Purpose-built event stores (such as Event Store DB) provide
          native support for event streams, sequence numbers, optimistic
          concurrency, and subscriptions. General-purpose databases can also
          serve as event stores: PostgreSQL with an events table (id,
          aggregate_id, sequence_number, event_type, payload, timestamp) and a
          unique constraint on (aggregate_id, sequence_number) provides all the
          guarantees needed for event sourcing. Apache Kafka can serve as an
          event store with infinite retention and partitioning by aggregate ID —
          each partition is an aggregate&apos;s event stream, and the offset
          within the partition is the sequence number. The choice depends on the
          system&apos;s requirements: purpose-built event stores provide
          projection subscription APIs and built-in snapshot management, while
          PostgreSQL provides transactional guarantees and familiar tooling, and
          Kafka provides high-throughput event streaming and natural integration
          with the projection pipeline.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/scalability-distributed-systems/event-sourcing-diagram-3.svg"
          alt="Snapshot optimization showing full event replay versus replay from snapshot point, demonstrating 60 percent time savings"
          caption="Snapshot optimization — replaying from a snapshot reduces reconstruction time by skipping previously processed events"
        />

        <p>
          The snapshot strategy is a critical performance tuning parameter. The
          snapshot frequency determines the trade-off between snapshot storage
          cost and replay speed. With a snapshot every 100 events, the maximum
          replay cost is 100 event applications (plus the snapshot load). With a
          snapshot every 1,000 events, the maximum replay cost is 1,000 event
          applications, but the snapshot storage cost is 10× lower (fewer
          snapshots). The optimal frequency depends on the aggregate&apos;s
          event volume and the application&apos;s latency requirements. For
          aggregates with low event volume (e.g., an order with 10–50 events in
          its lifetime), snapshots are unnecessary — replaying all events is
          fast. For aggregates with high event volume (e.g., a user account with
          thousands of events), snapshots every 100–500 events provide a good
          balance. The snapshot should be taken asynchronously — it should not
          block the command handler&apos;s append operation. A background
          process monitors each aggregate&apos;s event count since the last
          snapshot and creates a new snapshot when the threshold is exceeded.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <p>
          Event Sourcing must be compared against the traditional state-stored
          approach with explicit audit logging. The state-stored approach
          persists the current state in a database and optionally records
          changes in an audit table. It provides the current state immediately
          (a single SELECT query) and supports complex queries natively (SQL
          JOINs, aggregations, filtering). The audit table provides a history of
          changes, but it is typically a secondary concern — it records what
          changed (old value → new value) but not why it changed or what
          business event triggered the change. Event Sourcing, by contrast,
          records the business event itself (OrderConfirmed, not &quot;status
          changed from pending to confirmed&quot;), which is semantically richer
          and more aligned with the domain language.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">State-Stored + Audit</th>
              <th className="p-3 text-left">Event Sourcing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Current State Access</strong>
              </td>
              <td className="p-3">O(1) — single row lookup</td>
              <td className="p-3">
                O(N) — replay N events (or O(1) with snapshot)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Audit Trail</strong>
              </td>
              <td className="p-3">Separate audit table (technical changes)</td>
              <td className="p-3">
                Built-in — event log is the audit trail (business events)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Temporal Queries</strong>
              </td>
              <td className="p-3">
                Difficult — requires audit table reconstruction
              </td>
              <td className="p-3">Natural — replay events up to time T</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>New Read Models</strong>
              </td>
              <td className="p-3">Schema migration + data migration</td>
              <td className="p-3">New projection + replay from event log</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Schema Evolution</strong>
              </td>
              <td className="p-3">ALTER TABLE — database handles migration</td>
              <td className="p-3">Event versioning + upcasters — manual</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Query Flexibility</strong>
              </td>
              <td className="p-3">SQL — joins, aggregations, subqueries</td>
              <td className="p-3">
                Via projections — each optimized for its query
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">Low — standard pattern</td>
              <td className="p-3">
                High — event store, projections, versioning
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          The event store&apos;s append-only nature provides unique benefits for
          write performance. Appends are the fastest database operation — they
          do not require reading existing data, computing deltas, or updating
          indexes (the event store&apos;s index is append-only as well). In a
          high-throughput write scenario (e.g., IoT sensor data ingestion,
          clickstream logging), an append-only event store can sustain
          significantly higher write rates than a state-stored database that
          must read-modify-write for each update. However, this benefit is
          offset by the read cost — reconstructing the current state from events
          is slower than reading it from a single row, and the projection
          pipeline adds operational complexity.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <p>
          Model events as past-tense facts in the domain language, not as
          technical data changes. An event should describe{" "}
          <em>what happened in the business</em>, not{" "}
          <em>what changed in the database</em>. <code>OrderConfirmed</code> is
          a good event name — it describes a business event.{" "}
          <code>OrderStatusChanged</code> is a poor event name — it describes a
          data change. The event payload should contain the data necessary to
          reconstruct the aggregate&apos;s state after the event, not a diff of
          what changed. For <code>OrderConfirmed</code>, the payload should
          contain the order ID, the confirmation timestamp, and the user who
          confirmed — not &quot;status: pending → confirmed.&quot; This approach
          ensures that the event log is a meaningful business record that domain
          experts can read and understand, not just a technical change log.
        </p>

        <p>
          Include metadata in every event for observability and debugging. Each
          event should carry a <code>correlationId</code> (identifying the
          original command or user action that triggered the event chain), a{" "}
          <code>causationId</code> (identifying the immediate cause of this
          specific event — the previous event in the chain), a{" "}
          <code>userId</code> (the user who initiated the action), a{" "}
          <code>timestamp</code> (when the event occurred), and a{" "}
          <code>tenantId</code> (for multi-tenant systems). This metadata
          enables end-to-end tracing of an event chain across aggregates and
          services, which is essential for debugging production issues. When a
          user reports that their order is in an incorrect state, the{" "}
          <code>correlationId</code> allows you to trace all events in the
          chain, identify the event that introduced the incorrect state, and
          understand the context (who initiated it, when, and what caused it).
        </p>

        <p>
          Use optimistic concurrency control for event appends. When appending
          events to an aggregate&apos;s event stream, include the expected
          sequence number (the sequence number of the last event the command
          handler saw when it loaded the aggregate). The event store checks that
          the aggregate&apos;s current sequence number matches the expected
          sequence number before appending. If they match, the append succeeds
          and the sequence number is incremented. If they do not match (another
          command handler appended events in the meantime), the append fails
          with a concurrency conflict error, and the command handler retries.
          This is more efficient than pessimistic locking (which would block
          other command handlers for the duration of the append) and is safe
          because the retry re-reads the new events and re-applies the command
          against the updated aggregate state.
        </p>

        <p>
          Plan for event schema evolution from day one. Every event type should
          have a version number, and every event handler should be designed to
          handle multiple versions of its events. When you create a new version
          of an event, write an upcaster that transforms the old version to the
          new version (filling in new fields with sensible defaults, renaming
          fields, or transforming data types). Test the upcaster by replaying
          historical events through it and verifying that the upcasted events
          produce the same aggregate state as the original events. This testing
          is essential because a buggy upcaster can corrupt the aggregate state
          during replay, and the corruption may not be detected until much later
          when the incorrect state causes a business logic error.
        </p>

        <p>
          Implement projection offset tracking with durable storage. Each
          projection must track the sequence number of the last event it
          successfully processed. This offset is stored in a durable location
          (the projection&apos;s database or a dedicated offset store) and is
          updated atomically with the projection&apos;s state update — either
          both the state and the offset are updated, or neither is (enforced by
          a database transaction). This ensures that if the projection crashes
          after processing an event but before updating its offset, it will
          re-process the event on restart (at-least-once delivery), and the
          projection&apos;s idempotency ensures that re-processing is safe. The
          offset should be updated per-event (not per-batch) to minimize the
          number of events that are re-processed after a crash.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Storing derived data in events is a common mistake that corrupts the
          event stream. Events should contain only the data that was known at
          the time the event occurred — not data that is derived from other
          events or from external sources. For example, an{" "}
          <code>OrderConfirmed</code> event should contain the order ID and the
          confirmation timestamp, but it should <em>not</em> contain the order
          total — the total is derived from the items in the order (which are
          recorded in <code>ItemAdded</code> events), not from the confirmation
          event itself. Storing derived data in events creates redundancy and
          inconsistency: if the item prices change (e.g., a retroactive discount
          is applied), the order total in the <code>OrderConfirmed</code> event
          is stale and contradicts the total computed from the{" "}
          <code>ItemAdded</code> events. The rule is: events should contain the{" "}
          <em>minimal data necessary to apply the event to the aggregate</em> —
          any additional data should be derived during replay.
        </p>

        <p>
          Deleting or modifying events in the event store is an anti-pattern
          that destroys the integrity of the event-sourced system. The event
          store is append-only — events are never deleted or modified (with the
          sole exception of GDPR right-to-erasure requirements, which require
          careful handling — see below). If a bug causes incorrect events to be
          appended, the correction is not to delete the incorrect events — it is
          to append compensating events that reverse their effects. For example,
          if a bug caused an <code>ItemAdded</code> event with the wrong
          quantity, the correction is to append an <code>ItemRemoved</code>{" "}
          event (to remove the incorrectly added quantity) followed by a new{" "}
          <code>ItemAdded</code> event (with the correct quantity). The
          incorrect events remain in the event store as a record of what
          happened (including the bug), and the compensating events bring the
          aggregate to the correct state. Deleting events breaks the sequence
          number chain and makes aggregate reconstruction impossible.
        </p>

        <p>
          GDPR right-to-erasure (the &quot;right to be forgotten&quot;) is the
          one legitimate reason to modify or delete data in an event store, and
          it requires careful design. The GDPR requires that personal data be
          deleted upon request, but an event store contains personal data
          embedded in events (e.g., a <code>UserRegistered</code> event contains
          the user&apos;s email address). The solution is to encrypt
          personally-identifiable information (PII) in events with a per-user
          encryption key, and delete the key when the user exercises their right
          to erasure. The encrypted data remains in the event store but is
          unreadable (effectively deleted). Alternatively, the PII can be stored
          in a separate &quot;PII vault&quot; database outside the event store,
          and events contain only a reference to the PII (e.g., a PII ID). When
          the user requests erasure, the PII vault entry is deleted, and the
          events in the event store remain but no longer contain readable PII.
          Both approaches satisfy the GDPR requirement while preserving the
          append-only integrity of the event store.
        </p>

        <p>
          Using Event Sourcing for simple CRUD entities is over-engineering. Not
          every entity needs to be event-sourced. User preferences,
          configuration settings, and simple lookup tables are well-served by
          state-stored persistence — their history is not valuable, their state
          is simple, and the complexity of event sourcing provides no benefit.
          Reserve Event Sourcing for entities where the history is as important
          as the current state: financial transactions, order processing,
          inventory management, audit-critical workflows, and any entity where
          temporal queries (&quot;what was the state at time T?&quot;) are a
          business requirement.
        </p>

        <p>
          Neglecting to test event migration before deploying event schema
          changes is a common operational gap. When you change an event&apos;s
          schema (add a field, rename a field, change a field&apos;s type), you
          must test the upcaster and the updated event handler against a
          production-scale event log before deploying to production. The test
          should replay a representative sample of historical events (including
          edge cases and unusual event sequences) through the upcaster and the
          updated handler, and verify that the reconstructed aggregate state is
          correct. This test is analogous to a database migration test for
          state-stored systems — you would not deploy an ALTER TABLE without
          testing it against a production-scale database, and you should not
          deploy an event schema change without testing it against a
          production-scale event log.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <p>
          The BBC uses Event Sourcing for its content management platform, where
          every change to a piece of content (article, video, podcast) is stored
          as an event. The event stream for each content item records the full
          lifecycle: created, drafted, reviewed, approved, published, updated,
          unpublished, archived. The BBC&apos;s editorial team uses temporal
          queries to view the state of a content item at any point in its
          history — for example, to see what an article looked like before a
          particular edit, or to understand the review workflow for a piece of
          content that was published incorrectly. The event stream also serves
          as an audit trail for regulatory compliance (Ofcom broadcasting
          standards require content change records to be retained for 90 days).
          The projections power the content management UI (current state), the
          editorial dashboard (recent changes across all content), and the
          analytics platform (content lifecycle metrics).
        </p>

        <p>
          SourceLatency (a financial trading platform) uses Event Sourcing for
          its trade processing system, where every trade lifecycle event (trade
          created, trade amended, trade confirmed, trade settled, trade
          cancelled) is stored as an event. The event-sourced approach provides
          a complete audit trail that satisfies regulatory requirements (MiFID
          II, Dodd-Frank) without a separate audit system. The platform uses
          snapshots every 50 events to keep aggregate reconstruction fast (trade
          aggregates can have hundreds of amendment events over their lifetime),
          and the projection pipeline feeds trade data to the risk management
          system (real-time risk exposure), the settlement system (pending
          settlements), and the regulatory reporting system (trade reports to
          trade repositories). When the regulatory reporting requirements
          changed, the team created a new projection and replayed all historical
          trade events to generate the reports in the new format — no data
          migration was needed.
        </p>

        <p>
          Atomist, a software delivery platform, uses Event Sourcing for its
          software delivery graph, where every action in the software delivery
          process (code committed, build started, build completed, test started,
          test passed, deployment started, deployment completed) is an event.
          The event stream for each delivery pipeline provides a complete record
          of the delivery process, enabling the platform to answer questions
          like &quot;which code changes were included in this deployment?&quot;
          and &quot;how long did this build take, including queue time?&quot;
          The projections power the delivery dashboard (current pipeline state),
          the analytics platform (lead time, deployment frequency, change
          failure rate — the DORA metrics), and the audit system (who deployed
          what, when, and with whose approval).
        </p>

        <p>
          Azure Cosmos DB&apos;s change feed is an event-sourced mechanism that
          records every change to every document in a collection as an ordered,
          append-only log. Consumers of the change feed (called &quot;change
          feed processors&quot;) subscribe to the log and process changes in
          order, building materialized views, triggering workflows, and
          replicating data to other systems. While Cosmos DB itself is not fully
          event-sourced (it stores the current state of documents), the change
          feed provides event-sourcing-like capabilities for consumers: they can
          replay the entire change history from the beginning of the collection,
          process changes in order, and build multiple read models from the same
          change stream. This is effectively Event Sourcing as a service — the
          change feed is the event store, and the change feed processors are the
          projections.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: How do you reconstruct the current state of an aggregate in an
            event-sourced system? What happens when the event stream grows very
            large, and how do you optimize for it?
          </h3>
          <p className="mb-3">
            Aggregate reconstruction follows a deterministic process: create an
            empty aggregate instance, load all events for that aggregate from
            the event store (ordered by sequence number), and apply each event
            to the aggregate in sequence. Each event handler on the aggregate
            mutates the aggregate&apos;s state based on the event&apos;s data.
            For example, an Order aggregate starts as an empty object. The{" "}
            <code>OrderCreated</code> event initializes the order ID, customer
            ID, and creation timestamp. The <code>ItemAdded</code> events append
            items to the order&apos;s item list. The <code>OrderConfirmed</code>{" "}
            event sets the status to &quot;confirmed.&quot; After all events
            have been applied, the aggregate&apos;s state reflects all changes
            and represents the current state.
          </p>
          <p className="mb-3">
            When the event stream grows large (thousands of events for a single
            aggregate), full reconstruction from the beginning becomes slow. The
            optimization is <strong>snapshotting</strong>: periodically, the
            system captures the aggregate&apos;s current state and stores it as
            a snapshot, along with the sequence number of the last event
            included in the snapshot. When reconstructing the aggregate, the
            system loads the most recent snapshot (which provides the
            aggregate&apos;s state up to sequence number N) and replays only the
            events after N (from N+1 to the current sequence number). This
            reduces the replay cost from O(total events) to O(events since last
            snapshot).
          </p>
          <p className="mb-3">
            The snapshot frequency is a tuning parameter. With a snapshot every
            100 events, the maximum replay cost is 100 event applications. With
            a snapshot every 1,000 events, the maximum replay cost is 1,000
            event applications but the snapshot storage cost is lower. The
            optimal frequency depends on the aggregate&apos;s event volume and
            the application&apos;s latency requirements. Snapshots should be
            taken asynchronously (by a background process) so they do not block
            the command handler&apos;s append operation. The snapshot is not a
            replacement for the event stream — it is a cached derivation that
            can be discarded and rebuilt from the event stream at any time.
          </p>
          <p>
            An additional optimization for very large aggregates is{" "}
            <strong>state folding</strong>: if the aggregate&apos;s state can be
            computed from a summary of the events rather than by replaying each
            event individually, the summary can be maintained alongside the
            event stream. For example, an order&apos;s total can be maintained
            as a running sum (incremented by each <code>ItemAdded</code> event
            and decremented by each <code>ItemRemoved</code> event) rather than
            recomputed by iterating through all item events. This is effectively
            a specialized snapshot that tracks specific aggregate properties
            incrementally.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: An event schema changes — the <code>OrderCreated</code> event
            gains a new required field <code>currency</code>. How do you handle
            this change without breaking the replay of historical events that do
            not have this field?
          </h3>
          <p className="mb-3">
            This is the event versioning and schema evolution problem, and it
            requires a multi-step approach. First, the event type is versioned:
            the existing event becomes <code>OrderCreated:v1</code> (without{" "}
            <code>currency</code>), and the new event is{" "}
            <code>OrderCreated:v2</code> (with <code>currency</code>). Both
            versions coexist in the event store — historical events remain as
            v1, and new events are published as v2.
          </p>
          <p className="mb-3">
            The event handler for <code>OrderCreated</code> must be updated to
            handle both v1 and v2. There are two approaches.{" "}
            <strong>Approach 1: Dual-version handler.</strong> The handler has
            two code paths — one for v1 events (which sets <code>currency</code>{" "}
            to a default value, e.g., &quot;USD&quot;) and one for v2 events
            (which uses the <code>currency</code> field from the event payload).
            This approach is simple but requires the handler to maintain
            version-specific logic indefinitely.{" "}
            <strong>Approach 2: Upcaster.</strong> An upcaster function
            transforms v1 events to v2 events during replay by adding the{" "}
            <code>currency</code> field with a default value. The event handler
            then only handles v2 events — the upcaster ensures that all events
            (including historical v1 events) are presented to the handler as v2
            events. This approach keeps the handler simple (single version) but
            requires maintaining the upcaster.
          </p>
          <p className="mb-3">
            The upcaster approach is generally preferred because it centralizes
            the version transformation logic and keeps the event handler clean.
            The upcaster is a function that takes a v1 event and returns a v2
            event:{" "}
          </p>
          <p className="mb-3">
            <code>{`upcast(event: OrderCreated:v1) => OrderCreated:v2 {`}</code>
            <br />
            <code>&nbsp;&nbsp;...event,</code>
            <br />
            <code>&nbsp;&nbsp;version: 2,</code>
            <br />
            <code>
              &nbsp;&nbsp;currency: event.customer.country === &apos;UK&apos; ?
              &apos;GBP&apos; : &apos;USD&apos;
            </code>
            <br />
            <code>{"}"}</code>
          </p>
          <p className="mb-3">
            Note that the upcaster uses contextual information (the
            customer&apos;s country) to determine the currency, rather than
            blindly defaulting to &quot;USD&quot;. This is a more sophisticated
            upcaster that produces a more accurate v2 event. The upcaster should
            be tested against a representative sample of historical v1 events to
            verify that the upcasted v2 events produce the correct aggregate
            state.
          </p>
          <p className="mb-3">
            The deployment sequence is: <strong>Step 1:</strong> Deploy the
            upcaster (it does not affect live events — it only runs during
            replay). <strong>Step 2:</strong> Deploy the updated event handler
            (which handles v2 events). <strong>Step 3:</strong> Update the
            command handler to publish <code>OrderCreated:v2</code> events for
            new orders. <strong>Step 4:</strong> After all v1 events have
            expired from the active event stream (or after a grace period), the
            upcaster and the v1 handler code can be removed.
          </p>
          <p>
            If the schema change is backward-compatible (the new field is
            optional and has a sensible default), an alternative is to keep the
            same event version and have the event handler use the default value
            for events that do not include the new field. This avoids the need
            for versioning and upcasters but is only possible when the new field
            is truly optional and its absence does not change the handler&apos;s
            behavior.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: What is the difference between an event and a fact in event
            sourcing? Can events be wrong, and if so, how do you handle an event
            that was published incorrectly?
          </h3>
          <p className="mb-3">
            In event sourcing, an event is a record of something that happened —
            it is a statement about the past. A fact is a statement that is
            objectively true. The critical insight is that{" "}
            <em>events are not always facts</em> — an event can be published
            incorrectly due to a bug, a race condition, or an erroneous user
            action. For example, a bug in the order processing logic might
            publish an <code>OrderConfirmed</code> event for an order that
            should not have been confirmed (e.g., the payment had not been
            received). The event exists in the event store, but it does not
            represent a true business fact.
          </p>
          <p className="mb-3">
            The standard approach to handling an incorrect event is to append a{" "}
            <em>compensating event</em> that reverses the effects of the
            incorrect event. For the incorrectly confirmed order, the
            compensating event would be <code>OrderUnconfirmed</code> (or{" "}
            <code>OrderCancelled</code>, depending on the domain semantics). The
            compensating event is appended after the incorrect event, and when
            the aggregate is reconstructed by replaying all events, the
            compensating event cancels out the incorrect event&apos;s effects.
            The incorrect event remains in the event store (because events are
            never deleted), but its effects are neutralized by the compensating
            event.
          </p>
          <p className="mb-3">
            This approach preserves the integrity of the event store as an
            append-only log — no events are deleted or modified — while
            correcting the aggregate&apos;s state. The event log now tells the
            complete story: &quot;the order was confirmed (incorrectly, due to a
            bug), and then it was unconfirmed (by a compensating action).&quot;
            This is actually more informative than if the incorrect event had
            been deleted, because the record of the bug and its correction is
            preserved for auditing and debugging purposes.
          </p>
          <p className="mb-3">
            A more nuanced question is whether the event was <em>wrong</em> or
            whether the <em>business process</em> was wrong. If a user
            accidentally confirmed an order (a valid user action, not a bug),
            the <code>OrderConfirmed</code> event is correct — it accurately
            records that the user confirmed the order. The business process for
            handling accidental confirmations is to cancel the order, which
            produces a <code>OrderCancelled</code> event. Both events are
            correct records of what happened — the user confirmed, then the user
            (or an admin) cancelled. The event log preserves both facts, and the
            aggregate&apos;s final state (cancelled) is correct.
          </p>
          <p>
            The key principle is:{" "}
            <strong>
              events are immutable records of what happened, not statements of
              what should have happened
            </strong>
            . An event is &quot;wrong&quot; only if it does not accurately
            record what happened (e.g., a bug caused the event to be published
            with incorrect data). In that case, the correction is a compensating
            event that records the corrective action, not a deletion of the
            incorrect event.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you handle a query that requires data from multiple
            aggregates in an event-sourced system? For example, &quot;list all
            orders for products in category X placed by customers in region Y in
            the last 30 days.&quot;
          </h3>
          <p className="mb-3">
            This is one of the most challenging query patterns in an
            event-sourced system because it requires cross-aggregate data that
            is scattered across many independent event streams. The order
            aggregate contains order data, the product aggregate contains
            category data, and the customer aggregate contains region data —
            there is no single event stream that contains all three pieces of
            information.
          </p>
          <p className="mb-3">
            The solution is a <strong>read-side projection</strong> that
            subscribes to events from all three aggregate types and builds a
            denormalized read model that contains the data needed for the query
            in a single table. The projection subscribes to{" "}
            <code>OrderCreated</code> events (which contain the order ID,
            customer ID, and product IDs), <code>ProductCategorized</code>{" "}
            events (which contain the product ID and category), and{" "}
            <code>CustomerRegionUpdated</code> events (which contain the
            customer ID and region). As it processes these events, the
            projection builds an <code>order_search_index</code> table with
            columns for order ID, customer ID, customer region, product IDs,
            product categories, and order timestamp. When the query arrives, it
            is a simple SQL query against this denormalized table:{" "}
            <code>
              SELECT * FROM order_search_index WHERE product_categories CONTAINS
              &apos;X&apos; AND customer_region = &apos;Y&apos; AND
              order_timestamp &gt; NOW() - INTERVAL &apos;30 days&apos;
            </code>
            .
          </p>
          <p className="mb-3">
            The projection must handle events in any order (because events from
            different aggregates are published independently and may arrive at
            the projection out of order). For example, the projection may
            receive an <code>OrderCreated</code> event before it has received
            the <code>ProductCategorized</code> event for the products in the
            order. In this case, the projection inserts a partial record (with
            the order data but without the product categories) and updates the
            record when the <code>ProductCategorized</code> event arrives. This
            is called <em>eventual projection</em> — the read model is
            eventually consistent as events from all aggregates arrive and are
            processed.
          </p>
          <p className="mb-3">
            The projection must also handle the case where an event refers to an
            aggregate that the projection has not yet seen. For example, an{" "}
            <code>OrderCreated</code> event references a customer ID that the
            projection has not yet seen in a <code>CustomerRegistered</code>{" "}
            event. The projection handles this by creating a placeholder record
            for the unknown customer and filling in the details when the{" "}
            <code>CustomerRegistered</code> event arrives. This is called{" "}
            <em>tombstone resolution</em> — the placeholder is a tombstone that
            is later resolved when the missing data arrives.
          </p>
          <p>
            The key insight is that{" "}
            <strong>
              cross-aggregate queries in event sourcing are answered by
              read-side projections, not by querying the event store directly
            </strong>
            . The event store is optimized for append and sequential read
            (single-aggregate reconstruction), not for complex multi-aggregate
            queries. The projection transforms the event streams into a
            query-optimized read model that answers the cross-aggregate query
            efficiently. This is the CQRS pattern applied to event sourcing —
            the event store is the write side, and the projection&apos;s read
            model is the read side.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: When should you NOT use Event Sourcing? What are the
            anti-patterns?
          </h3>
          <p className="mb-3">
            Event Sourcing is a specialized pattern that is inappropriate for
            many use cases. The primary anti-patterns are:
          </p>
          <p className="mb-3">
            <strong>Anti-pattern 1: Event Sourcing for simple CRUD.</strong> If
            the entity&apos;s history is not valuable (e.g., user preferences,
            configuration settings, session data), Event Sourcing adds
            complexity without benefit. State-stored persistence is simpler,
            faster, and sufficient. The question to ask is: &quot;Would the
            business benefit from knowing the complete history of this
            entity?&quot; If the answer is no, do not use Event Sourcing.
          </p>
          <p className="mb-3">
            <strong>Anti-pattern 2: Event Sourcing without CQRS.</strong> Using
            Event Sourcing but querying the event store directly for read
            operations (by replaying events for each query) is an anti-pattern.
            The event store is optimized for append, not for read. Every read
            query that requires event replay incurs O(N) latency, which does not
            scale. If you use Event Sourcing, pair it with CQRS — use
            projections to build read models that answer queries efficiently.
          </p>
          <p className="mb-3">
            <strong>Anti-pattern 3: Events as data change records.</strong>{" "}
            Publishing events like <code>UserUpdated</code> with a payload
            containing all changed fields (a diff of the old and new state) is
            an anti-pattern. Events should describe business occurrences ({" "}
            <code>EmailAddressChanged</code>, <code>PhoneNumberUpdated</code>,{" "}
            <code>PreferencesSaved</code>), not data changes. Data change events
            are technically correct but semantically impoverished — they do not
            convey the business meaning of the change, and they couple the event
            schema to the data schema.
          </p>
          <p className="mb-3">
            <strong>
              Anti-pattern 4: Event Sourcing for high-velocity, low-value data.
            </strong>{" "}
            Sensor readings, clickstream events, and log entries are high-volume
            data points that are better stored in a time-series database or a
            log aggregation system. Event Sourcing is designed for business
            events with rich semantics and long-term value — not for millions of
            low-value data points per second.
          </p>
          <p className="mb-3">
            <strong>Anti-pattern 5: Premature Event Sourcing.</strong> Adopting
            Event Sourcing at the start of a project, before the domain model is
            stable, is risky. Event schema changes are expensive (they require
            upcasters and testing), and a changing domain model means frequent
            schema changes. It is better to start with state-stored persistence
            and migrate to Event Sourcing when the domain model stabilizes and
            the business requirements for auditability, temporal queries, or
            flexible read models become clear.
          </p>
          <p>
            The decision framework is: use Event Sourcing when (1) the complete
            history of an entity is a business requirement (audit, compliance,
            debugging), (2) temporal queries are needed (what was the state at
            time T?), (3) the domain model is stable and unlikely to change
            frequently, and (4) the team has the expertise to manage event
            versioning, snapshots, and projections. If any of these conditions
            are not met, Event Sourcing is likely the wrong choice.
          </p>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            Fowler, M. (2005). &quot;Event Sourcing.&quot; martinfowler.com. —
            The seminal article introducing the Event Sourcing pattern.
          </li>
          <li>
            Young, G. (2006). &quot;Eventsourcing — an introduction.&quot;
            CodeBetter Blog. — Early practical exposition of Event Sourcing with
            implementation examples.
          </li>
          <li>
            Vernon, V. (2013). &quot;Implementing Domain-Driven Design.&quot;
            Addison-Wesley. — Chapter 8 covers Event Sourcing in the context of
            aggregates and bounded contexts.
          </li>
          <li>
            Kleppmann, M. (2017). &quot;Designing Data-Intensive
            Applications.&quot; O&apos;Reilly Media. — Chapter 11 discusses
            stream processing and event-based dataflow, relevant to Event
            Sourcing architectures.
          </li>
          <li>
            Event Store Ltd. &quot;Event Store Documentation.&quot; —
            Production-tested event store database with comprehensive guides on
            Event Sourcing patterns and projections.
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}
