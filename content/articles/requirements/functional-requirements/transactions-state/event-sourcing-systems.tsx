"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-event-sourcing-systems",
  title: "Event Sourcing Systems",
  description:
    "Comprehensive guide to implementing event sourcing systems covering event sourcing fundamentals, event store design, event versioning and migration, projections and read models, CQRS integration, and event replay and debugging for transaction systems.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "event-sourcing-systems",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "event-sourcing",
    "cqrs",
    "backend",
    "event-store",
    "projections",
  ],
  relatedTopics: ["financial-logs", "billing-services", "state-machine-implementation", "subscription-lifecycle-management"],
};

export default function EventSourcingSystemsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Event sourcing systems capture all changes to application state as a sequence of events: payment events (payment initiated, payment authorized, payment captured, payment refunded), billing events (invoice generated, invoice paid, invoice overdue, invoice voided), subscription events (subscription created, subscription upgraded, subscription downgraded, subscription cancelled). For staff and principal engineers, event sourcing involves event store design (append-only event storage, event versioning, event migration), projections and read models (build read models from events, optimize for queries), CQRS integration (separate write model from read model, optimize each independently), and event replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>
        <p>
          The complexity of event sourcing extends beyond simple event logging. Event versioning handles schema changes (add fields, remove fields, change field types), event migration migrates old events to new schema (migrate events on read, migrate events in background), event consistency ensures events are consistent (event ordering, event causality, event idempotency). Projections build read models from events (build current state from events, build historical state from events), CQRS separates write model from read model (write model optimized for writes, read model optimized for reads), event replay replays events for debugging (replay events to reproduce issues), replay events for new features (replay events to build new read models), replay events for disaster recovery (replay events to recover from disasters).
        </p>
        <p>
          For staff and principal engineers, event sourcing architecture involves event sourcing fundamentals (events as source of truth, append-only event storage, event versioning), event store design (event storage, event indexing, event retention), projections and read models (build read models from events, optimize for queries), CQRS integration (separate write model from read model, optimize each independently), and event replay and debugging (replay events for debugging, replay events for new features, replay events for disaster recovery). The system must support multiple event types (payment events, billing events, subscription events), multiple projections (current state projections, historical state projections, analytics projections), and multiple replay scenarios (debugging replay, new features replay, disaster recovery replay).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Event Sourcing Fundamentals</h3>
        <p>
          Events as source of truth: events are the single source of truth for application state. Current state: derived from events (replay events to build current state), not stored separately (don&apos;t store current state, derive from events). Historical state: available from events (replay events to build historical state), point-in-time queries (query state at specific point in time). Benefits: complete audit trail (all changes captured, all changes logged), temporal queries (query state at specific point in time, query state changes over time), event replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>
        <p>
          Append-only event storage: events are appended to event store, never modified, never deleted. Immutability: events are immutable (once stored, can&apos;t be modified, can&apos;t be deleted), corrections are new events (don&apos;t modify events, add correction events). Ordering: events are ordered (event order matters, event sequence matters), sequence numbers (each event has sequence number, events ordered by sequence number). Benefits: simplicity (append-only is simple, no updates, no deletes), audit trail (all changes captured, all changes logged), event replay (replay events in order, rebuild state from events).
        </p>
        <p>
          Event versioning: events have schema, schema changes over time (add fields, remove fields, change field types). Versioning strategies: upcasting (migrate old events to new schema on read), event migration (migrate old events to new schema in background), schema evolution (design schema for evolution, design schema for compatibility). Compatibility: backward compatibility (new schema can read old events), forward compatibility (old schema can read new events, ignore new fields). Benefits: schema evolution (evolve schema over time, add features, change features), event compatibility (old events compatible with new schema, new events compatible with old schema).
        </p>

        <h3 className="mt-6">Event Store Design</h3>
        <p>
          Event storage stores events. Storage: append-only storage (events appended, never modified, never deleted), event tables (event_id, aggregate_id, event_type, event_data, timestamp, sequence_number), event streams (events grouped by aggregate_id, events ordered by sequence_number). Indexes: aggregate_id index (query events by aggregate_id), event_type index (query events by event_type), timestamp index (query events by timestamp), sequence_number index (query events by sequence_number). Retention: indefinite retention (events retained indefinitely, never deleted), compliance retention (events retained for compliance period, deleted after), archival retention (old events archived, moved to cold storage).
        </p>
        <p>
          Event indexing indexes events for queries. Indexes: aggregate_id index (query events by aggregate_id, rebuild aggregate state), event_type index (query events by event_type, query specific event types), timestamp index (query events by timestamp, temporal queries), sequence_number index (query events by sequence_number, ordered queries). Performance: index performance (fast index queries, low latency index queries), index maintenance (maintain indexes, update indexes on event append), index optimization (optimize indexes, optimize index queries).
        </p>
        <p>
          Event retention retains events for required period. Retention policies: indefinite retention (events retained indefinitely, never deleted, full history), compliance retention (events retained for compliance period, deleted after compliance period), archival retention (old events archived, moved to cold storage, moved to archive storage). Deletion: event deletion (delete events after retention period, delete events on request), event anonymization (anonymize events after retention period, anonymize personal data), event archival (archive events to cold storage, archive events to archive storage).
        </p>

        <h3 className="mt-6">Event Versioning and Migration</h3>
        <p>
          Event versioning versions events. Versions: event version 1 (original event schema), event version 2 (updated event schema, add fields), event version 3 (updated event schema, remove fields, change field types). Versioning strategies: explicit versioning (event has version field, version field indicates schema version), implicit versioning (schema inferred from event fields, schema inferred from event structure). Benefits: schema evolution (evolve schema over time, add features, change features), event compatibility (old events compatible with new schema, new events compatible with old schema).
        </p>
        <p>
          Upcasting migrates old events to new schema on read. Process: read event (read event from event store), detect version (detect event version, detect event schema), upcast event (migrate event to new schema, add missing fields, remove deprecated fields), return upcasted event (return event in new schema, return event in current schema). Benefits: simple (no background migration, migrate on read), flexible (migrate only when needed, migrate only when read). Cons: read overhead (migrate on every read, read overhead), complexity (upcasting logic, upcasting complexity).
        </p>
        <p>
          Event migration migrates old events to new schema in background. Process: identify events to migrate (identify old events, identify events with old schema), migrate events (migrate events to new schema, update event data), verify migration (verify events migrated, verify events correct). Benefits: no read overhead (events pre-migrated, no migration on read), consistent schema (all events in new schema, consistent schema). Cons: background complexity (background migration, background processing), migration time (migration takes time, migration overhead).
        </p>

        <h3 className="mt-6">Projections and Read Models</h3>
        <p>
          Projections build read models from events. Process: subscribe to events (subscribe to event stream, subscribe to event notifications), process events (process each event, update read model), build read model (build current state from events, build read model from events). Read models: current state read models (current aggregate state, current application state), historical state read models (historical aggregate state, historical application state), analytics read models (analytics data, analytics metrics). Benefits: query optimization (read models optimized for queries, optimized for specific queries), query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>
        <p>
          Read model types: current state read models (current aggregate state, current application state, query current state), historical state read models (historical aggregate state, historical application state, query historical state), analytics read models (analytics data, analytics metrics, query analytics data). Query optimization: read models optimized for queries (optimized for specific queries, optimized for query patterns), query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>
        <p>
          Projection rebuild rebuilds read models from events. Triggers: new projection (build new read model from events, build new projection), schema change (event schema changed, rebuild read models), read model corruption (read model corrupted, rebuild read model from events). Process: subscribe to events (subscribe to event stream, subscribe to event notifications), process events (process each event, update read model), build read model (build current state from events, build read model from events). Benefits: rebuild capability (rebuild read models from events, rebuild from scratch), disaster recovery (rebuild read models after disaster, recover from disasters).
        </p>

        <h3 className="mt-6">CQRS Integration</h3>
        <p>
          CQRS (Command Query Responsibility Segregation) separates write model from read model. Write model: optimized for writes (optimized for event append, optimized for event storage), handles commands (handle commands, process commands, append events). Read model: optimized for reads (optimized for queries, optimized for read patterns), handles queries (handle queries, process queries, return read models). Benefits: independent optimization (optimize write model independently, optimize read model independently), scalability (scale writes independently, scale reads independently), flexibility (flexible write model, flexible read model).
        </p>
        <p>
          Write model: handles commands (handle commands, process commands, append events), optimized for writes (optimized for event append, optimized for event storage), event sourcing (append events to event store, never modify events, never delete events). Commands: create command (create aggregate, append created events), update command (update aggregate, append updated events), delete command (delete aggregate, append deleted events). Benefits: simplicity (append-only is simple, no updates, no deletes), audit trail (all changes captured, all changes logged).
        </p>
        <p>
          Read model: handles queries (handle queries, process queries, return read models), optimized for reads (optimized for queries, optimized for read patterns), projections (build read models from events, build projections from events). Queries: current state queries (query current aggregate state, query current application state), historical state queries (query historical aggregate state, query historical application state), analytics queries (query analytics data, query analytics metrics). Benefits: query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>

        <h3 className="mt-6">Event Replay and Debugging</h3>
        <p>
          Event replay replays events for debugging. Scenarios: reproduce issues (replay events to reproduce issues, debug issues), test fixes (replay events to test fixes, verify fixes), understand behavior (replay events to understand behavior, understand system behavior). Process: identify events (identify events to replay, identify event range), replay events (replay events to test environment, replay events to debug environment), analyze results (analyze replay results, analyze system behavior). Benefits: debugging (reproduce issues, debug issues), testing (test fixes, verify fixes), understanding (understand behavior, understand system behavior).
        </p>
        <p>
          Event replay for new features replays events to build new read models. Scenarios: new features (add new features, build new read models for new features), new projections (add new projections, build new projections from events), new analytics (add new analytics, build new analytics from events). Process: identify events (identify all events, identify event range), replay events (replay events to build new read models, replay events to build new projections), build read models (build new read models from events, build new projections from events). Benefits: feature development (add new features, build new read models), projection development (add new projections, build new projections), analytics development (add new analytics, build new analytics).
        </p>
        <p>
          Event replay for disaster recovery replays events to recover from disasters. Scenarios: disaster recovery (recover from disasters, rebuild system from events), data loss (recover from data loss, rebuild data from events), system failure (recover from system failure, rebuild system from events). Process: identify events (identify all events, identify event range), replay events (replay events to recovery environment, replay events to rebuild system), rebuild system (rebuild system from events, rebuild data from events). Benefits: disaster recovery (recover from disasters, rebuild system from events), data recovery (recover from data loss, rebuild data from events), system recovery (recover from system failure, rebuild system from events).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Event sourcing architecture spans event sourcing fundamentals, event store, projections and read models, CQRS integration, and event replay. Event sourcing fundamentals capture all changes as events (events as source of truth, append-only event storage, event versioning). Event store stores events (event storage, event indexing, event retention). Projections and read models build read models from events (build read models, optimize for queries). CQRS integration separates write model from read model (optimize each independently). Event replay replays events for debugging, new features, and disaster recovery.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/event-sourcing-systems/event-sourcing-architecture.svg"
          alt="Event Sourcing Architecture"
          caption="Figure 1: Event Sourcing Architecture — Event sourcing fundamentals, event store, projections, CQRS, and event replay"
          width={1000}
          height={500}
        />

        <h3>Event Sourcing Fundamentals</h3>
        <p>
          Event capture captures all changes as events. Sources: payment systems (payment events, charges, refunds, disputes), billing systems (billing events, invoices, credits, debits), subscription systems (subscription events, subscriptions, upgrades, downgrades, cancellations). Events: payment initiated (payment initiated event, payment details), payment authorized (payment authorized event, authorization details), payment captured (payment captured event, capture details), payment refunded (payment refunded event, refund details). Benefits: complete audit trail (all changes captured, all changes logged), temporal queries (query state at specific point in time, query state changes over time).
        </p>
        <p>
          Event storage stores events in append-only event store. Storage: event tables (event_id, aggregate_id, event_type, event_data, timestamp, sequence_number), event streams (events grouped by aggregate_id, events ordered by sequence_number). Immutability: events are immutable (once stored, can&apos;t be modified, can&apos;t be deleted), corrections are new events (don&apos;t modify events, add correction events). Benefits: simplicity (append-only is simple, no updates, no deletes), audit trail (all changes captured, all changes logged).
        </p>
        <p>
          Event versioning versions events for schema evolution. Versions: event version 1 (original event schema), event version 2 (updated event schema, add fields), event version 3 (updated event schema, remove fields, change field types). Versioning strategies: explicit versioning (event has version field, version field indicates schema version), implicit versioning (schema inferred from event fields, schema inferred from event structure). Benefits: schema evolution (evolve schema over time, add features, change features), event compatibility (old events compatible with new schema, new events compatible with old schema).
        </p>

        <h3 className="mt-6">Event Store</h3>
        <p>
          Event storage stores events. Storage: append-only storage (events appended, never modified, never deleted), event tables (event_id, aggregate_id, event_type, event_data, timestamp, sequence_number), event streams (events grouped by aggregate_id, events ordered by sequence_number). Indexes: aggregate_id index (query events by aggregate_id), event_type index (query events by event_type), timestamp index (query events by timestamp), sequence_number index (query events by sequence_number). Retention: indefinite retention (events retained indefinitely, never deleted), compliance retention (events retained for compliance period, deleted after), archival retention (old events archived, moved to cold storage).
        </p>
        <p>
          Event indexing indexes events for queries. Indexes: aggregate_id index (query events by aggregate_id, rebuild aggregate state), event_type index (query events by event_type, query specific event types), timestamp index (query events by timestamp, temporal queries), sequence_number index (query events by sequence_number, ordered queries). Performance: index performance (fast index queries, low latency index queries), index maintenance (maintain indexes, update indexes on event append), index optimization (optimize indexes, optimize index queries).
        </p>
        <p>
          Event retention retains events for required period. Retention policies: indefinite retention (events retained indefinitely, never deleted, full history), compliance retention (events retained for compliance period, deleted after compliance period), archival retention (old events archived, moved to cold storage, moved to archive storage). Deletion: event deletion (delete events after retention period, delete events on request), event anonymization (anonymize events after retention period, anonymize personal data), event archival (archive events to cold storage, archive events to archive storage).
        </p>

        <h3 className="mt-6">Projections and Read Models</h3>
        <p>
          Projections build read models from events. Process: subscribe to events (subscribe to event stream, subscribe to event notifications), process events (process each event, update read model), build read model (build current state from events, build read model from events). Read models: current state read models (current aggregate state, current application state), historical state read models (historical aggregate state, historical application state), analytics read models (analytics data, analytics metrics). Benefits: query optimization (read models optimized for queries, optimized for specific queries), query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>
        <p>
          Read model types: current state read models (current aggregate state, current application state, query current state), historical state read models (historical aggregate state, historical application state, query historical state), analytics read models (analytics data, analytics metrics, query analytics data). Query optimization: read models optimized for queries (optimized for specific queries, optimized for query patterns), query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>
        <p>
          Projection rebuild rebuilds read models from events. Triggers: new projection (build new read model from events, build new projection), schema change (event schema changed, rebuild read models), read model corruption (read model corrupted, rebuild read model from events). Process: subscribe to events (subscribe to event stream, subscribe to event notifications), process events (process each event, update read model), build read model (build current state from events, build read model from events). Benefits: rebuild capability (rebuild read models from events, rebuild from scratch), disaster recovery (rebuild read models after disaster, recover from disasters).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/event-sourcing-systems/cqrs-integration.svg"
          alt="CQRS Integration"
          caption="Figure 2: CQRS Integration — Write model, read model, commands, and queries"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">CQRS Integration</h3>
        <p>
          Write model handles commands. Commands: create command (create aggregate, append created events), update command (update aggregate, append updated events), delete command (delete aggregate, append deleted events). Process: receive command (receive command, validate command), process command (process command, validate business rules), append events (append events to event store, never modify events, never delete events). Benefits: simplicity (append-only is simple, no updates, no deletes), audit trail (all changes captured, all changes logged).
        </p>
        <p>
          Read model handles queries. Queries: current state queries (query current aggregate state, query current application state), historical state queries (query historical aggregate state, query historical application state), analytics queries (query analytics data, query analytics metrics). Process: receive query (receive query, validate query), process query (process query, query read model), return results (return query results, return read model). Benefits: query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
        </p>
        <p>
          Write-read separation separates write model from read model. Write model: optimized for writes (optimized for event append, optimized for event storage), handles commands (handle commands, process commands, append events). Read model: optimized for reads (optimized for queries, optimized for read patterns), handles queries (handle queries, process queries, return read models). Benefits: independent optimization (optimize write model independently, optimize read model independently), scalability (scale writes independently, scale reads independently), flexibility (flexible write model, flexible read model).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/event-sourcing-systems/event-replay.svg"
          alt="Event Replay"
          caption="Figure 3: Event Replay — Debugging replay, new features replay, and disaster recovery replay"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Event Replay</h3>
        <p>
          Debugging replay replays events to reproduce issues. Scenarios: reproduce issues (replay events to reproduce issues, debug issues), test fixes (replay events to test fixes, verify fixes), understand behavior (replay events to understand behavior, understand system behavior). Process: identify events (identify events to replay, identify event range), replay events (replay events to test environment, replay events to debug environment), analyze results (analyze replay results, analyze system behavior). Benefits: debugging (reproduce issues, debug issues), testing (test fixes, verify fixes), understanding (understand behavior, understand system behavior).
        </p>
        <p>
          New features replay replays events to build new read models. Scenarios: new features (add new features, build new read models for new features), new projections (add new projections, build new projections from events), new analytics (add new analytics, build new analytics from events). Process: identify events (identify all events, identify event range), replay events (replay events to build new read models, replay events to build new projections), build read models (build new read models from events, build new projections from events). Benefits: feature development (add new features, build new read models), projection development (add new projections, build new projections), analytics development (add new analytics, build new analytics).
        </p>
        <p>
          Disaster recovery replay replays events to recover from disasters. Scenarios: disaster recovery (recover from disasters, rebuild system from events), data loss (recover from data loss, rebuild data from events), system failure (recover from system failure, rebuild system from events). Process: identify events (identify all events, identify event range), replay events (replay events to recovery environment, replay events to rebuild system), rebuild system (rebuild system from events, rebuild data from events). Benefits: disaster recovery (recover from disasters, rebuild system from events), data recovery (recover from data loss, rebuild data from events), system recovery (recover from system failure, rebuild system from events).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Event sourcing design involves trade-offs between completeness, complexity, performance, and scalability. Understanding these trade-offs enables informed decisions aligned with business requirements and operational capabilities.
        </p>

        <h3>Event Sourcing vs. State Storage</h3>
        <p>
          Event sourcing (store events, derive state). Pros: Complete audit trail (all changes captured, all changes logged), temporal queries (query state at specific point in time, query state changes over time), event replay (replay events for debugging, replay events for new features, replay events for disaster recovery). Cons: Complexity (event sourcing is complex, event versioning, event migration), query complexity (query current state requires replay, query performance overhead), storage overhead (store all events, store full history). Best for: Audit-required systems (financial systems, compliance systems), temporal requirements (query historical state, query state changes), replay requirements (replay for debugging, replay for new features, replay for disaster recovery).
        </p>
        <p>
          State storage (store current state, update state). Pros: Simplicity (store current state, update state), query performance (query current state directly, no replay), storage efficiency (store only current state, don&apos;t store full history). Cons: No audit trail (changes not captured, changes not logged), no temporal queries (can&apos;t query historical state, can&apos;t query state changes), no event replay (can&apos;t replay events, can&apos;t rebuild state). Best for: Simple systems (no audit requirements, no temporal requirements), performance-critical (query performance critical, storage efficiency critical), no replay requirements (no debugging replay, no new features replay, no disaster recovery replay).
        </p>
        <p>
          Hybrid: event sourcing + state snapshots (store events, store periodic state snapshots). Pros: Balance (audit trail + query performance), temporal queries (query state at specific point in time, query state changes over time), query performance (query current state from snapshot, no full replay). Cons: Complexity (event sourcing + snapshots, snapshot management), storage overhead (store events + snapshots, more storage). Best for: Most production systems—event sourcing (audit trail, temporal queries, replay), state snapshots (query performance, current state queries).
        </p>

        <h3>Upcasting vs. Event Migration</h3>
        <p>
          Upcasting (migrate on read). Pros: Simple (no background migration, migrate on read), flexible (migrate only when needed, migrate only when read), no migration overhead (no background processing, no migration jobs). Cons: Read overhead (migrate on every read, read performance overhead), complexity (upcasting logic, upcasting complexity), inconsistent schema (old events in old schema, new events in new schema). Best for: Low read volume (infrequent reads, read overhead acceptable), simple upcasting (simple upcasting logic, simple upcasting complexity), flexible schema (schema evolves frequently, schema changes often).
        </p>
        <p>
          Event migration (migrate in background). Pros: No read overhead (events pre-migrated, no migration on read), consistent schema (all events in new schema, consistent schema), query performance (query events directly, no upcasting). Cons: Background complexity (background migration, background processing), migration time (migration takes time, migration overhead), migration risk (migration errors, migration data loss). Best for: High read volume (frequent reads, read overhead not acceptable), complex upcasting (complex upcasting logic, complex upcasting complexity), stable schema (schema evolves infrequently, schema changes rarely).
        </p>
        <p>
          Hybrid: upcasting for recent, migration for old. Pros: Balance (no read overhead for old, simple for recent), optimized (recent events upcasted on read, old events migrated in background), practical (most reads are recent, old reads are rare). Cons: Complexity (two migration strategies, manage both strategies), management overhead (manage upcasting, manage migration). Best for: Most production systems—recent events (upcasting on read, simple), old events (migration in background, consistent schema).
        </p>

        <h3>CQRS vs. Traditional Architecture</h3>
        <p>
          CQRS (separate write model from read model). Pros: Independent optimization (optimize write model independently, optimize read model independently), scalability (scale writes independently, scale reads independently), flexibility (flexible write model, flexible read model). Cons: Complexity (two models, manage both models), consistency (write-read consistency, eventual consistency), operational overhead (operate two models, monitor two models). Best for: High write volume + high read volume (scale writes independently, scale reads independently), different optimization (write optimization different from read optimization, optimize each independently), complex queries (complex read queries, optimize read model for queries).
        </p>
        <p>
          Traditional architecture (single model for writes and reads). Pros: Simplicity (single model, manage single model), consistency (strong consistency, write-read consistency), operational simplicity (operate single model, monitor single model). Cons: Limited optimization (optimize for writes or reads, not both), limited scalability (scale single model, can&apos;t scale independently), limited flexibility (single model, not flexible). Best for: Low write volume + low read volume (single model sufficient), same optimization (write optimization same as read optimization, single optimization), simple queries (simple queries, single model sufficient).
        </p>
        <p>
          Hybrid: CQRS for complex, traditional for simple. Pros: Balance (CQRS for complex, traditional for simple), optimized (complex queries optimized, simple queries simple), practical (most queries simple, complex queries CQRS). Cons: Complexity (two architectures, manage both architectures), management overhead (manage CQRS, manage traditional). Best for: Most production systems—simple queries (traditional architecture, simple), complex queries (CQRS architecture, optimized).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/event-sourcing-systems/event-sourcing-comparison.svg"
          alt="Event Sourcing Comparison"
          caption="Figure 4: Event Sourcing Comparison — Event sourcing vs. state storage, upcasting vs. migration, CQRS vs. traditional"
          width={1000}
          height={450}
        />

        <h3>Indefinite vs. Compliance Retention</h3>
        <p>
          Indefinite retention (retain events indefinitely). Pros: Full history (all events retained, full history), replay capability (replay all events, replay full history), audit trail (complete audit trail, all changes logged). Cons: Storage cost (store all events, storage grows indefinitely), management complexity (manage growing storage, manage indefinite retention), compliance risk (retain personal data indefinitely, GDPR risk). Best for: Audit-required systems (financial systems, compliance systems), replay requirements (replay for debugging, replay for new features, replay for disaster recovery), no personal data (no personal data in events, no GDPR risk).
        </p>
        <p>
          Compliance retention (retain events for compliance period). Pros: Compliance (meet compliance requirements, retain for compliance period), storage management (storage bounded, storage manageable), privacy (delete personal data after compliance period, GDPR compliant). Cons: Limited history (events deleted after compliance period, limited history), limited replay (can&apos;t replay all events, can&apos;t replay full history), audit gaps (audit trail incomplete, audit trail has gaps). Best for: Compliance systems (meet compliance requirements, retain for compliance period), personal data (personal data in events, GDPR compliance), storage management (storage bounded, storage manageable).
        </p>
        <p>
          Hybrid: indefinite for business events, compliance for personal events. Pros: Balance (full history for business, compliance for personal), optimized (business events retained indefinitely, personal events retained for compliance), practical (full business history, personal data compliant). Cons: Complexity (two retention policies, manage both policies), management overhead (manage indefinite retention, manage compliance retention). Best for: Most production systems—business events (indefinite retention, full history), personal events (compliance retention, GDPR compliant).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement event versioning:</strong> Event versions (version 1, version 2, version 3), versioning strategies (explicit versioning, implicit versioning), compatibility (backward compatibility, forward compatibility). Benefits: schema evolution (evolve schema over time, add features, change features), event compatibility (old events compatible with new schema, new events compatible with old schema).
          </li>
          <li>
            <strong>Design append-only event store:</strong> Append-only storage (events appended, never modified, never deleted), event tables (event_id, aggregate_id, event_type, event_data, timestamp, sequence_number), event streams (events grouped by aggregate_id, events ordered by sequence_number). Benefits: simplicity (append-only is simple, no updates, no deletes), audit trail (all changes captured, all changes logged).
          </li>
          <li>
            <strong>Build projections and read models:</strong> Projections (build read models from events, build projections from events), read models (current state read models, historical state read models, analytics read models), query optimization (read models optimized for queries, optimized for specific queries). Benefits: query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
          </li>
          <li>
            <strong>Implement CQRS:</strong> Write model (optimized for writes, handles commands), read model (optimized for reads, handles queries), write-read separation (separate write model from read model, optimize each independently). Benefits: independent optimization (optimize write model independently, optimize read model independently), scalability (scale writes independently, scale reads independently).
          </li>
          <li>
            <strong>Enable event replay:</strong> Debugging replay (replay events to reproduce issues, debug issues), new features replay (replay events to build new read models, replay events to build new projections), disaster recovery replay (replay events to recover from disasters, replay events to rebuild system). Benefits: debugging (reproduce issues, debug issues), feature development (add new features, build new read models), disaster recovery (recover from disasters, rebuild system from events).
          </li>
          <li>
            <strong>Manage event retention:</strong> Retention policies (indefinite retention, compliance retention, archival retention), event deletion (delete events after retention period, delete events on request), event anonymization (anonymize events after retention period, anonymize personal data). Benefits: compliance (meet compliance requirements, meet deletion requirements), cost optimization (delete old events, reduce storage cost), risk mitigation (delete unnecessary events, reduce breach risk).
          </li>
          <li>
            <strong>Index events:</strong> Indexes (aggregate_id index, event_type index, timestamp index, sequence_number index), index performance (fast index queries, low latency index queries), index maintenance (maintain indexes, update indexes on event append). Benefits: query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple indexes for multiple queries).
          </li>
          <li>
            <strong>Monitor event sourcing:</strong> Event volume (events per day, storage growth), projection performance (projection latency, projection success rate), replay performance (replay latency, replay success rate). Benefits: identify issues (event volume spikes, projection performance issues, replay performance issues), optimize performance (optimize projection performance, optimize replay performance), ensure compliance (ensure retention compliance, ensure deletion compliance).
          </li>
          <li>
            <strong>Test event replay:</strong> Regular testing (test event replay, test projection rebuild), disaster recovery (test disaster recovery, test backup recovery), compliance testing (test compliance replay, test compliance audits). Benefits: ensure replay (events can be replayed, projections can be rebuilt), ensure compliance (compliance replay works, compliance audits work), ensure readiness (audit readiness, compliance readiness).
          </li>
          <li>
            <strong>Document event schema:</strong> Event documentation (document event schema, document event fields), version documentation (document event versions, document schema changes), migration documentation (document migration procedures, document upcasting procedures). Benefits: clarity (clear schema, clear procedures), compliance (documented schema, documented procedures), audit readiness (schema available for audits, procedures available for audits).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No event versioning:</strong> Schema changes break old events. Solution: Event versioning (version 1, version 2, version 3), versioning strategies (explicit versioning, implicit versioning), compatibility (backward compatibility, forward compatibility).
          </li>
          <li>
            <strong>Modify events:</strong> Events modified, audit trail broken. Solution: Append-only storage (events appended, never modified, never deleted), corrections are new events (don&apos;t modify events, add correction events).
          </li>
          <li>
            <strong>No projections:</strong> Query current state requires full replay. Solution: Projections (build read models from events, build projections from events), read models (current state read models, historical state read models, analytics read models).
          </li>
          <li>
            <strong>No CQRS:</strong> Single model for writes and reads. Solution: CQRS (separate write model from read model, optimize each independently), write model (optimized for writes, handles commands), read model (optimized for reads, handles queries).
          </li>
          <li>
            <strong>No event replay:</strong> Can&apos;t replay events for debugging, new features, disaster recovery. Solution: Event replay (debugging replay, new features replay, disaster recovery replay), replay capability (replay events, rebuild state from events).
          </li>
          <li>
            <strong>No event retention:</strong> Events retained indefinitely, storage grows, compliance risk. Solution: Retention policies (indefinite retention, compliance retention, archival retention), event deletion (delete events after retention period, delete events on request), event anonymization (anonymize events after retention period, anonymize personal data).
          </li>
          <li>
            <strong>No event indexing:</strong> Slow event queries, slow event replay. Solution: Indexes (aggregate_id index, event_type index, timestamp index, sequence_number index), index performance (fast index queries, low latency index queries), index maintenance (maintain indexes, update indexes on event append).
          </li>
          <li>
            <strong>No event monitoring:</strong> Don&apos;t track event volume, projection performance, replay performance. Solution: Monitor event sourcing (event volume, projection performance, replay performance), alert on issues (event volume spikes, projection performance issues, replay performance issues).
          </li>
          <li>
            <strong>No event replay testing:</strong> Don&apos;t test event replay, don&apos;t test projection rebuild. Solution: Regular testing (test event replay, test projection rebuild), disaster recovery (test disaster recovery, test backup recovery), compliance testing (test compliance replay, test compliance audits).
          </li>
          <li>
            <strong>Undocumented event schema:</strong> No event documentation, no version documentation, no migration documentation. Solution: Document event schema (document event schema, document event fields), version documentation (document event versions, document schema changes), migration documentation (document migration procedures, document upcasting procedures).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Financial Trading System</h3>
        <p>
          Financial trading system implements event sourcing for audit and compliance. Events: order placed (order placed event, order details), order matched (order matched event, match details), order filled (order filled event, fill details), order cancelled (order cancelled event, cancel details). Event store: append-only event storage (events appended, never modified, never deleted), event indexing (index by order_id, index by event_type, index by timestamp), indefinite retention (events retained indefinitely, full history). Projections: current order state (current order state, query current orders), historical order state (historical order state, query historical orders), analytics (trading analytics, trading metrics). Benefits: audit trail (complete audit trail, all changes logged), compliance (meet compliance requirements, pass compliance audits), replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>

        <h3 className="mt-6">E-commerce Order System</h3>
        <p>
          E-commerce order system implements event sourcing for order tracking and customer service. Events: order created (order created event, order details), order paid (order paid event, payment details), order shipped (order shipped event, shipping details), order delivered (order delivered event, delivery details), order returned (order returned event, return details). Event store: append-only event storage (events appended, never modified, never deleted), event indexing (index by order_id, index by customer_id, index by timestamp), compliance retention (events retained for compliance period, deleted after). Projections: current order state (current order state, query current orders), customer order history (customer order history, query customer orders), analytics (sales analytics, sales metrics). Benefits: order tracking (track orders, track order changes), customer service (customer service can see order history, customer service can see order changes), replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>

        <h3 className="mt-6">Subscription Billing System</h3>
        <p>
          Subscription billing system implements event sourcing for billing audit and compliance. Events: subscription created (subscription created event, subscription details), subscription upgraded (subscription upgraded event, upgrade details), subscription downgraded (subscription downgraded event, downgrade details), subscription cancelled (subscription cancelled event, cancel details), invoice generated (invoice generated event, invoice details), invoice paid (invoice paid event, payment details), invoice overdue (invoice overdue event, overdue details). Event store: append-only event storage (events appended, never modified, never deleted), event indexing (index by subscription_id, index by customer_id, index by timestamp), indefinite retention (events retained indefinitely, full history). Projections: current subscription state (current subscription state, query current subscriptions), customer billing history (customer billing history, query customer billing), analytics (billing analytics, billing metrics). Benefits: audit trail (complete audit trail, all changes logged), compliance (meet compliance requirements, pass compliance audits), replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>

        <h3 className="mt-6">Banking Transaction System</h3>
        <p>
          Banking transaction system implements event sourcing for transaction audit and compliance. Events: transaction initiated (transaction initiated event, transaction details), transaction authorized (transaction authorized event, authorization details), transaction completed (transaction completed event, completion details), transaction reversed (transaction reversed event, reversal details). Event store: append-only event storage (events appended, never modified, never deleted), event indexing (index by transaction_id, index by account_id, index by timestamp), compliance retention (events retained for compliance period, deleted after). Projections: current account state (current account state, query current accounts), transaction history (transaction history, query transaction history), analytics (transaction analytics, transaction metrics). Benefits: audit trail (complete audit trail, all changes logged), compliance (meet compliance requirements, pass compliance audits), replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>

        <h3 className="mt-6">Healthcare Record System</h3>
        <p>
          Healthcare record system implements event sourcing for patient record audit and compliance. Events: patient created (patient created event, patient details), patient record updated (patient record updated event, update details), prescription created (prescription created event, prescription details), prescription filled (prescription filled event, fill details), lab order created (lab order created event, lab order details), lab result received (lab result received event, lab result details). Event store: append-only event storage (events appended, never modified, never deleted), event indexing (index by patient_id, index by event_type, index by timestamp), compliance retention (events retained for compliance period, deleted after). Projections: current patient state (current patient state, query current patients), patient record history (patient record history, query patient records), analytics (healthcare analytics, healthcare metrics). Benefits: audit trail (complete audit trail, all changes logged), compliance (meet compliance requirements, pass compliance audits), replay (replay events for debugging, replay events for new features, replay events for disaster recovery).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is event sourcing and when should you use it?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event sourcing: capture all changes to application state as a sequence of events (events as source of truth, append-only event storage). Use when: audit-required (financial systems, compliance systems, all changes must be logged), temporal requirements (query historical state, query state changes over time), replay requirements (replay for debugging, replay for new features, replay for disaster recovery). Don&apos;t use when: simple systems (no audit requirements, no temporal requirements), performance-critical (query performance critical, storage efficiency critical), no replay requirements (no debugging replay, no new features replay, no disaster recovery replay).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle event versioning?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event versioning: events have schema, schema changes over time (add fields, remove fields, change field types). Versioning strategies: explicit versioning (event has version field, version field indicates schema version), implicit versioning (schema inferred from event fields, schema inferred from event structure). Migration strategies: upcasting (migrate old events to new schema on read), event migration (migrate old events to new schema in background). Compatibility: backward compatibility (new schema can read old events), forward compatibility (old schema can read new events, ignore new fields).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement CQRS?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> CQRS: separate write model from read model, optimize each independently. Write model: optimized for writes (optimized for event append, optimized for event storage), handles commands (handle commands, process commands, append events). Read model: optimized for reads (optimized for queries, optimized for read patterns), handles queries (handle queries, process queries, return read models). Benefits: independent optimization (optimize write model independently, optimize read model independently), scalability (scale writes independently, scale reads independently), flexibility (flexible write model, flexible read model).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you build projections from events?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Projections: build read models from events. Process: subscribe to events (subscribe to event stream, subscribe to event notifications), process events (process each event, update read model), build read model (build current state from events, build read model from events). Read models: current state read models (current aggregate state, current application state), historical state read models (historical aggregate state, historical application state), analytics read models (analytics data, analytics metrics). Benefits: query optimization (read models optimized for queries, optimized for specific queries), query performance (fast queries, low latency queries), query flexibility (flexible queries, multiple read models for multiple queries).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you replay events?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event replay: replay events for debugging, new features, disaster recovery. Debugging replay: replay events to reproduce issues (replay events to test environment, replay events to debug environment), test fixes (replay events to test fixes, verify fixes), understand behavior (replay events to understand behavior, understand system behavior). New features replay: replay events to build new read models (replay events to build new projections, replay events to build new analytics). Disaster recovery replay: replay events to recover from disasters (replay events to recovery environment, replay events to rebuild system).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage event retention?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event retention: retain events for required period. Retention policies: indefinite retention (events retained indefinitely, never deleted, full history), compliance retention (events retained for compliance period, deleted after compliance period), archival retention (old events archived, moved to cold storage, moved to archive storage). Deletion: event deletion (delete events after retention period, delete events on request), event anonymization (anonymize events after retention period, anonymize personal data), event archival (archive events to cold storage, archive events to archive storage). Compliance: SOX (7 years retention, financial records), PCI (1 year retention, payment logs), GDPR (deletion on request, right to be forgotten).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://martinfowler.com/eaaDev/EventSourcing.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Event Sourcing
            </a>
          </li>
          <li>
            <a
              href="https://docs.axoniq.io/reference-guide/axons-server/axons-server-basics/event-sourcing-basics"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AxonIQ — Event Sourcing Basics
            </a>
          </li>
          <li>
            <a
              href="https://eventstore.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Event Store DB — Event Sourcing Database
            </a>
          </li>
          <li>
            <a
              href="https://www.cqrs.nu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CQRS.nu — CQRS and Event Sourcing Resources
            </a>
          </li>
          <li>
            <a
              href="https://microservices.io/patterns/data/event-sourcing.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microservices.io — Event Sourcing Pattern
            </a>
          </li>
          <li>
            <a
              href="https://www.infoq.com/articles/event-sourcing-cqrs-introduction/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              InfoQ — Introduction to Event Sourcing and CQRS
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
