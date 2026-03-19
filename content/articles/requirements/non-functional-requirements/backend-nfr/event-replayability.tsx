"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-event-replayability-extensive",
  title: "Event Replayability",
  description: "Comprehensive guide to event replayability, covering event sourcing, state reconstruction, snapshots, and production patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "event-replayability",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "event-sourcing", "replay", "event-store", "state-reconstruction"],
  relatedTopics: ["consistency-model", "schema-governance", "data-migration", "message-ordering"],
};

export default function EventReplayabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Event Replayability</strong> is the ability to re-process historical events to
          reconstruct state or create new projections. It is a core capability of event sourcing
          architectures.
        </p>
        <p>
          Event replay enables:
        </p>
        <ul>
          <li>
            <strong>Debugging:</strong> Reproduce bugs by replaying events.
          </li>
          <li>
            <strong>New projections:</strong> Build new read models from historical events.
          </li>
          <li>
            <strong>Recovery:</strong> Rebuild state after corruption.
          </li>
          <li>
            <strong>Testing:</strong> Replay production events in test environments.
          </li>
          <li>
            <strong>Auditing:</strong> Complete history of all state changes.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Events Are Immutable Facts</h3>
          <p>
            Events represent things that happened in the past. They cannot be changed — only new
            events can compensate for past events. This immutability is what makes replay possible.
          </p>
        </div>
      </section>

      <section>
        <h2>Event Sourcing Fundamentals</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/event-replayability.svg"
          alt="Event Sourcing and Replay"
          caption="Event Sourcing — showing event store, state reconstruction through replay, and snapshot optimization"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Event Store</h3>
        <p>
          Append-only log of all state changes:
        </p>
        <ul>
          <li>
            <strong>Immutable:</strong> Events are never modified or deleted.
          </li>
          <li>
            <strong>Ordered:</strong> Events have sequence numbers or timestamps.
          </li>
          <li>
            <strong>Versioned:</strong> Event schemas include version information.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Reconstruction</h3>
        <p>
          Current state is derived by replaying events:
        </p>
        <ul>
          <li>Start from initial state</li>
          <li>Apply each event in sequence order</li>
          <li>Each event handler updates state based on event type</li>
          <li>Final state after all events = current state</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Snapshots</h3>
        <p>
          Periodic state snapshots reduce replay time:
        </p>
        <ul>
          <li>Capture state at regular intervals (every N events).</li>
          <li>Store snapshot with sequence number.</li>
          <li>Replay from snapshot + events after snapshot.</li>
        </ul>
        <p>
          <strong>Trade-off:</strong> Storage cost vs replay time.
        </p>
      </section>

      <section>
        <h2>Replay Use Cases</h2>
        <p>
          Practical applications of event replay:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Building New Projections</h3>
        <p>
          Create new read models without changing write side:
        </p>
        <ul>
          <li>Need new query pattern? Create new projection.</li>
          <li>Replay all events through new projection function.</li>
          <li>Switch queries to use new projection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bug Reproduction</h3>
        <p>
          Reproduce production bugs in development:
        </p>
        <ul>
          <li>Export events leading to bug.</li>
          <li>Replay in development environment.</li>
          <li>Debug with full context.</li>
          <li>Fix, verify fix by replaying again.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">System Recovery</h3>
        <p>
          Rebuild state after corruption:
        </p>
        <ul>
          <li>Identify corruption point.</li>
          <li>Restore from backup or empty state.</li>
          <li>Replay events from before corruption.</li>
          <li>Verify state matches expected.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing with Production Data</h3>
        <p>
          Test with realistic data patterns:
        </p>
        <ul>
          <li>Anonymize production events.</li>
          <li>Replay in test environment.</li>
          <li>Test new code against real patterns.</li>
          <li>Catch issues before production.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Explain event sourcing. What are the benefits and trade-offs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Event sourcing:</strong> Store state changes as events, not current state. Rebuild state by replaying events.</li>
                <li><strong>Benefits:</strong> (1) Full audit trail. (2) Temporal queries (state at any point in time). (3) Easy debugging (replay events). (4) Flexible projections (add new views without changing event schema).</li>
                <li><strong>Trade-offs:</strong> (1) More complex than CRUD. (2) Eventual consistency. (3) Event schema evolution challenges. (4) Learning curve for team.</li>
                <li><strong>Use cases:</strong> Financial systems (audit trail), e-commerce (order history), collaborative editing (conflict resolution).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. How do you handle schema evolution in an event store with millions of events?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Event versioning:</strong> Include schema version in each event. Handler checks version, applies appropriate logic.</li>
                <li><strong>Upcasters:</strong> Transform old events to new schema during replay. Example: Add default value for new field.</li>
                <li><strong>Backward compatibility:</strong> New handlers can read old events. Add optional fields, don&apos;t remove required fields.</li>
                <li><strong>Schema registry:</strong> Store schema for each event version. Replay uses correct schema for each event.</li>
                <li><strong>Best practice:</strong> Design events for evolution. Assume schema will change. Use optional fields liberally.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your event replay is taking too long. How do you optimize it?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Snapshots:</strong> Periodic state checkpoints. Start from snapshot + replay recent events only.</li>
                <li><strong>Parallel replay:</strong> Replay independent event streams in parallel. Multiple workers.</li>
                <li><strong>Filtering:</strong> Replay only relevant events (by type, by aggregate). Skip unrelated events.</li>
                <li><strong>Batching:</strong> Process events in batches. Reduce overhead per event.</li>
                <li><strong>Example:</strong> Bank account with 10,000 transactions. Snapshot balance monthly. Replay = last snapshot + recent transactions.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you handle side effects during event replay?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Problem:</strong> Events may trigger side effects (emails, notifications). Don&apos;t want to send duplicate emails during replay.</li>
                <li><strong>Solution 1:</strong> Separate state changes from side effects. Replay only rebuilds state, doesn&apos;t trigger side effects.</li>
                <li><strong>Solution 2:</strong> Flag replay mode. Side effects disabled during replay.</li>
                <li><strong>Solution 3:</strong> Idempotent side effects. Email service checks if already sent (by event ID).</li>
                <li><strong>Best practice:</strong> Design event handlers to be idempotent. Safe to replay without special handling.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design an event sourcing system for an e-commerce order management system.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Events:</strong> OrderCreated, OrderConfirmed, OrderShipped, OrderDelivered, OrderCancelled, OrderRefunded.</li>
                <li><strong>Event store:</strong> Append-only log (Kafka, EventStoreDB). Events ordered by order_id + timestamp.</li>
                <li><strong>Projections:</strong> (1) Order summary (for list view). (2) Order detail (for detail view). (3) Analytics (for reporting).</li>
                <li><strong>Replay:</strong> Can rebuild any projection from events. Add new projection without changing event schema.</li>
                <li><strong>Snapshots:</strong> Snapshot order state after 100 events. Replay from snapshot + recent events.</li>
                <li><strong>Benefits:</strong> Full audit trail, temporal queries (state at any point in time), easy debugging.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Compare event sourcing with traditional CRUD. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Event sourcing:</strong> Store events (what happened). ✓ Full audit trail, temporal queries, easy debugging. ✗ More complex, eventual consistency.</li>
                <li><strong>CRUD:</strong> Store current state. ✓ Simple, immediate consistency. ✗ No history, hard to debug, lose context.</li>
                <li><strong>Choose event sourcing when:</strong> Audit trail required (finance, healthcare), need temporal queries, complex business logic, debugging important.</li>
                <li><strong>Choose CRUD when:</strong> Simple CRUD operations, no audit requirements, immediate consistency critical, team unfamiliar with event sourcing.</li>
                <li><strong>Hybrid:</strong> CRUD for simple entities, event sourcing for complex aggregates (orders, payments).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Event Replayability Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Events are immutable and versioned</li>
          <li>✓ Event store is append-only</li>
          <li>✓ Events have sequence numbers for ordering</li>
          <li>✓ Event handlers are idempotent</li>
          <li>✓ Snapshots configured for large event streams</li>
          <li>✓ Upcasters for old event versions</li>
          <li>✓ Replay tested with production-scale data</li>
          <li>✓ Side effects separated from state changes</li>
          <li>✓ Monitoring for replay progress</li>
          <li>✓ Documentation for replay procedures</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
