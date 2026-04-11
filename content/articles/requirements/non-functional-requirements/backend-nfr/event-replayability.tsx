"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-event-replayability",
  title: "Event Replayability",
  description: "Comprehensive guide to event replayability — event sourcing, log-based replay, idempotent handlers, schema evolution, and replay testing for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "event-replayability",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "event-replay", "event-sourcing", "idempotency", "schema-evolution"],
  relatedTopics: ["idempotency-guarantees", "message-ordering-guarantees", "data-migration-strategy", "schema-governance"],
};

export default function EventReplayabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Event replayability</strong> is the ability to reprocess events from an event log or
          message queue, enabling recovery from failures, state reconstruction, bug fixes, and data
          migration. In event-driven architectures, events are the source of truth — the current state
          of the system is derived from processing all events in order. If an event processing bug is
          discovered, a new consumer version is deployed, and the events are replayed through the new
          consumer to fix the state.
        </p>
        <p>
          Event replayability is a critical non-functional requirement for event-driven systems. Without
          replayability, a bug in event processing can corrupt state irreversibly — the only recovery
          option is to restore from backup and lose all events processed since the backup. With
          replayability, the event log is the backup — events can be reprocessed through a fixed
          consumer to restore correct state, with no data loss.
        </p>
        <p>
          For staff and principal engineer candidates, event replayability architecture demonstrates
          understanding of event sourcing, the ability to design idempotent event handlers, and the
          maturity to ensure that events can be replayed safely after failures. Interviewers expect
          you to design event schemas that support replay, implement idempotent handlers that can
          process the same event multiple times without side effects, manage schema evolution without
          breaking replay, and test replay procedures regularly.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Event Replay vs Message Redelivery</h3>
          <p>
            <strong>Message redelivery</strong> is the automatic reprocessing of an unacknowledged message after a consumer failure — the message is redelivered to the same or different consumer. <strong>Event replay</strong> is the intentional reprocessing of events from a specific point in the event log, typically after a bug fix or state corruption — events are replayed through a new consumer version to rebuild state.
          </p>
          <p className="mt-3">
            Message redelivery is automatic and happens during normal operation. Event replay is intentional and happens during recovery or migration. Both require idempotent handlers, but event replay additionally requires schema compatibility between the event producer and the new consumer.
          </p>
        </div>

        <p>
          A mature event replayability architecture includes: an append-only event log (Kafka, Pulsar)
          that retains events for a configurable period, idempotent event handlers that can process
          the same event multiple times without side effects, schema evolution management that ensures
          backward and forward compatibility, and replay testing that validates replay procedures
          regularly.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding event replayability requires grasping several foundational concepts about
          event sourcing, idempotent handlers, schema evolution, and replay mechanisms.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Event Sourcing and Replay</h3>
        <p>
          Event sourcing stores state changes as a sequence of events rather than the current state.
          The current state is derived by replaying all events from the beginning through an event
          handler. Event sourcing naturally supports replayability — if the event handler has a bug,
          a fixed handler can replay all events to rebuild the correct state. Kafka-based event
          sourcing retains events for a configurable period (days, weeks, or indefinitely), enabling
          replay from any point within the retention window.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotent Event Handlers</h3>
        <p>
          Idempotent event handlers produce the same result regardless of how many times the same
          event is processed. This is essential for replayability — if an event is replayed after a
          failure, the handler must not duplicate side effects (double-charging a payment, sending
          duplicate notifications). Idempotency is achieved through deduplication (tracking processed
          event IDs), conditional updates (only update if the event has not been processed), or
          compensating actions (reverse the previous effect before applying the new effect).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Evolution and Replay Compatibility</h3>
        <p>
          Event schemas evolve over time — new fields are added, fields are renamed or removed, data
          types change. Schema evolution must be backward compatible (new consumers can read old
          events) and forward compatible (old consumers can read new events, ignoring unknown fields).
          Schema registries (Confluent Schema Registry, AWS Glue Schema Registry) enforce compatibility
          rules — only backward-compatible schema changes are allowed, ensuring that events can be
          replayed through both old and new consumer versions.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Event replayability architecture spans event log retention, consumer offset management,
          idempotent handler design, schema evolution, and replay orchestration.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/event-replayability.svg"
          alt="Event Replayability Architecture"
          caption="Event Replayability — showing event log, consumer offsets, replay orchestration, and idempotent handlers"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Replay Orchestration Flow</h3>
        <p>
          When replay is needed (bug fix, state corruption, new consumer), the replay orchestration
          begins: a new consumer group is created (to avoid interfering with the existing consumer),
          the consumer offset is set to the replay start point (beginning of log, specific timestamp,
          or specific offset), the new consumer processes events through the fixed handler, and the
          resulting state replaces the corrupted state. The existing consumer continues processing
          new events during replay, ensuring that the system remains operational.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotent Handler Design</h3>
        <p>
          Idempotent handlers track processed event IDs in a deduplication store (database table,
          Redis set). When an event is received, the handler checks if the event ID has been processed
          — if yes, the event is skipped (idempotent skip). If no, the handler processes the event,
          records the event ID, and commits the offset. This ensures that replaying the same event
          multiple times produces the same result as processing it once.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/event-replayability-deep-dive.svg"
          alt="Event Replayability Deep Dive"
          caption="Replay Deep Dive — showing deduplication, offset management, and schema evolution during replay"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/idempotent-event-processing.svg"
          alt="Idempotent Event Processing"
          caption="Idempotent Processing — showing event deduplication, conditional updates, and offset commit"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Deduplication Store</strong></td>
              <td className="p-3">
                Simple to implement. Exact-once processing. Works with any event log.
              </td>
              <td className="p-3">
                Additional storage cost. Deduplication store becomes a bottleneck. Requires cleanup.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Conditional Updates</strong></td>
              <td className="p-3">
                No additional storage. Natural idempotency. Works with existing data store.
              </td>
              <td className="p-3">
                Complex for non-idempotent operations (increment, append). Requires version tracking.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Compensating Actions</strong></td>
              <td className="p-3">
                Handles non-idempotent operations. Reversible. Audit trail of compensations.
              </td>
              <td className="p-3">
                Complex to implement. Compensation may fail. Requires idempotent compensations.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Event Sourcing</strong></td>
              <td className="p-3">
                Natural replayability. Complete audit trail. State reconstruction from events.
              </td>
              <td className="p-3">
                Storage overhead. Replay latency. Complex queries (need projections).
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Design Events for Replay from Day One</h3>
        <p>
          Event replayability must be designed into the event schema and handler from the beginning —
          retrofitting replayability after events are produced is difficult or impossible. Include a
          unique event ID in every event, use schema registries to enforce compatibility rules, retain
          events for a sufficient period (minimum 7 days, ideally 30+ days), and design handlers to be
          idempotent. Events that are not designed for replay (no unique ID, no schema registry, short
          retention, non-idempotent handlers) cannot be safely replayed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Replay Procedures Regularly</h3>
        <p>
          Replay procedures that have never been tested will fail when needed — the replay consumer may
          have bugs, the event schema may be incompatible, or the deduplication store may be corrupted.
          Test replay procedures quarterly by replaying a subset of events through the current consumer
          and verifying that the resulting state matches the expected state. Include replay testing in
          the deployment pipeline — after deploying a new consumer version, replay a subset of events
          and verify correctness before switching to the new version.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manage Schema Evolution Carefully</h3>
        <p>
          Schema evolution is the most common cause of replay failures — a new event schema that is
          not backward compatible breaks replay of old events. Enforce backward compatibility through
          schema registries — only allow adding optional fields, renaming fields (with aliases), and
          removing optional fields. Never remove required fields, change field types, or change field
          semantics. If a breaking schema change is required, create a new event type and migrate
          consumers gradually, ensuring that both old and new events can be replayed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Replay Progress and Health</h3>
        <p>
          During replay, monitor the consumer&apos;s progress (events processed, events remaining,
          estimated completion time), error rate (failed events, dead letter queue size), and
          lag (time between event production and consumption). Set alerts for replay stall (no
          progress for 30 minutes), high error rate (&gt; 1% of events failed), and excessive lag
          (lag &gt; 1 hour). If any alert fires, pause the replay, investigate the issue, and resume
          after remediation.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Non-Idempotent Event Handlers</h3>
        <p>
          Event handlers that produce side effects (sending emails, charging payments, incrementing
          counters) without idempotency guarantees will duplicate side effects when events are replayed.
          A non-idempotent payment handler that charges $100 per event will charge $200 if the event is
          replayed. Design all event handlers to be idempotent — track processed event IDs and skip
          duplicate events, use conditional updates that only apply if the event has not been processed,
          or use compensating actions that reverse the previous effect before applying the new effect.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Insufficient Event Retention</h3>
        <p>
          Event replay requires events to be retained in the event log. If events are deleted after a
          short period (hours or days), replay is not possible for events outside the retention window.
          Set event retention based on replay requirements — minimum 7 days for bug fix replay, 30+
          days for state reconstruction, indefinite for event sourcing. Monitor event log storage
          costs and balance retention with cost — use tiered storage (hot for recent events, cold for
          old events) to reduce storage costs while maintaining replayability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Incompatibility During Replay</h3>
        <p>
          Replay fails when the consumer cannot deserialize events produced with an old schema — removed
          fields, changed types, or renamed fields cause deserialization errors. Enforce backward
          compatibility through schema registries, and test replay with events from all schema versions
          before deploying a new consumer version. If a breaking schema change is required, create a
          new event type and run both old and new consumers in parallel until all old events have
          expired from the retention window.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Replaying Into Production Without Testing</h3>
        <p>
          Replaying events directly into production without testing the replay consumer is risky — if
          the consumer has bugs, it will corrupt production state. Test replay in a staging environment
          first — replay the same events through the staging consumer and verify that the resulting
          state matches expectations. Only after staging validation succeeds, replay into production
          with careful monitoring and the ability to pause and rollback if issues are detected.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">LinkedIn — Kafka Event Replay for Bug Recovery</h3>
        <p>
          LinkedIn uses Kafka for event-driven architecture with 7-day event retention. When a bug in
          an event consumer causes state corruption, LinkedIn creates a new consumer group, sets the
          offset to 7 days ago (before the bug was introduced), and replays events through the fixed
          consumer. The replay runs in parallel with the existing consumer, and when the replay catches
          up and the state is verified, the new consumer replaces the old consumer. LinkedIn&apos;s
          replay process has recovered from dozens of consumer bugs without data loss or service
          disruption.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Uber — Event Sourcing with Replay</h3>
        <p>
          Uber uses event sourcing for critical business entities (rides, drivers, payments) — state
          changes are stored as events, and the current state is derived by replaying events. When a
          bug is discovered in the state derivation logic, Uber replays all events through the fixed
          logic to rebuild the correct state. Uber&apos;s event log retains events indefinitely for
          critical entities, enabling replay from any point in time. Uber&apos;s replay infrastructure
          can replay millions of events per second, enabling rapid recovery from bugs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — Idempotent Payment Event Processing</h3>
        <p>
          Stripe&apos;s payment processing is event-driven — every payment action generates an event
          that is processed by payment handlers. Stripe ensures idempotency by assigning a unique
          idempotency key to each payment event — if the same event is replayed (due to consumer
          failure or manual replay), the handler detects the duplicate idempotency key and skips
          processing, preventing double-charges. Stripe&apos;s idempotent event processing ensures
          that payment events can be replayed safely after failures without financial impact.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Schema Evolution with Replay Testing</h3>
        <p>
          Netflix uses a schema registry to enforce backward compatibility for all events. Before
          deploying a new consumer version, Netflix replays a subset of events from the event log
          through the new consumer and verifies that the resulting state matches the expected state.
          This replay testing catches schema incompatibility issues before deployment, ensuring that
          events can be replayed safely after the consumer is deployed. Netflix&apos;s schema evolution
          process has prevented hundreds of potential replay failures.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Event replayability involves security risks — event logs contain sensitive data, replay consumers may have access to data they should not see, and replay procedures may inadvertently expose data.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Log Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Sensitive Data in Events:</strong> Events may contain sensitive data (user IDs, payment amounts, personal information) that must be protected. Mitigation: encrypt sensitive fields in events, restrict event log access to authorized consumers, monitor event log access patterns, include events in data classification and compliance audits.
            </li>
            <li>
              <strong>Replay Consumer Access Control:</strong> Replay consumers should have the same access controls as production consumers — they should not be able to access events or produce side effects beyond their authorized scope. Mitigation: use separate consumer groups for replay, apply the same authorization policies to replay consumers, audit replay consumer activity.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Event replayability must be validated through systematic testing — idempotency verification, schema compatibility, replay correctness, and performance must all be tested.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Replay Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Idempotency Test:</strong> Process the same event multiple times through the handler and verify that the resulting state is the same as processing it once. Test with different event types and different handler states to ensure comprehensive idempotency coverage.
            </li>
            <li>
              <strong>Schema Compatibility Test:</strong> Replay events from all schema versions through the current consumer and verify that all events are deserialized and processed correctly. Test with events from the oldest retained schema version to the newest to ensure full compatibility.
            </li>
            <li>
              <strong>Replay Correctness Test:</strong> Replay a subset of events through the consumer in a staging environment and compare the resulting state with the expected state. Verify that all events are processed in order, no events are skipped, and the resulting state matches the state produced by the production consumer.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Replay Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Unique event ID included in every event</li>
            <li>✓ Schema registry enforcing backward compatibility</li>
            <li>✓ Event retention configured (minimum 7 days, ideally 30+ days)</li>
            <li>✓ Event handlers designed to be idempotent</li>
            <li>✓ Deduplication mechanism implemented (event ID tracking, conditional updates)</li>
            <li>✓ Replay orchestration tooling available (offset management, consumer group creation)</li>
            <li>✓ Replay testing conducted quarterly with representative event samples</li>
            <li>✓ Replay monitoring configured (progress, error rate, lag)</li>
            <li>✓ Replay runbook documented with step-by-step procedures</li>
            <li>✓ Replay security controls applied (access control, encryption, audit logging)</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.confluent.io/blog/kafka-best-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Confluent — Kafka Best Practices for Event Replay
            </a>
          </li>
          <li>
            <a href="https://microservices.io/patterns/data/event-sourcing.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Microservices.io — Event Sourcing Pattern
            </a>
          </li>
          <li>
            <a href="https://stripe.com/blog/idempotent-api-design" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe — Idempotent API Design
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Tech Blog — Schema Evolution and Replay Testing
            </a>
          </li>
          <li>
            <a href="https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              LinkedIn — The Log: What Every Software Engineer Should Know
            </a>
          </li>
          <li>
            <a href="https://www.confluent.io/blog/schema-registry-kafka-stream-processing-yes-virginia-you-really-need-one/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Confluent — Why You Need a Schema Registry
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
