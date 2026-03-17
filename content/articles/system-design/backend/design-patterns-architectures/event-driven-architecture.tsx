"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-event-driven-architecture-extensive",
  title: "Event-Driven Architecture",
  description:
    "Build systems around events to decouple producers and consumers, then manage delivery semantics, schema evolution, and operational replay safely.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "event-driven-architecture",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "events", "messaging"],
  relatedTopics: [
    "saga-pattern",
    "event-sourcing-pattern",
    "materialized-view-pattern",
    "cqrs-pattern",
    "retry-pattern",
  ],
};

export default function EventDrivenArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Systems Communicate by Publishing Facts</h2>
        <p>
          <strong>Event-driven architecture (EDA)</strong> is an approach where components communicate by emitting and
          reacting to events. An <em>event</em> is typically a fact about something that happened: &quot;OrderPlaced&quot;,
          &quot;PaymentCaptured&quot;, &quot;UserSignedUp&quot;. Producers publish events; consumers subscribe and perform
          actions or build derived views.
        </p>
        <p>
          The core benefit is decoupling. Producers do not need to know which consumers exist. Consumers can be added,
          removed, and scaled independently. The trade-off is distributed-systems reality: delivery is not perfect,
          ordering is limited, and correctness depends on idempotency, schema governance, and operational replay.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/event-driven-architecture-diagram-1.svg"
          alt="Event-driven system with producers publishing to an event log and multiple consumers processing events"
          caption="EDA decouples producers and consumers through an event log, enabling independent evolution and scaling."
        />
      </section>

      <section>
        <h2>Events vs Commands vs State</h2>
        <p>
          Clarity about semantics is the first correctness requirement. Many failures in EDA come from mixing these
          concepts:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Command:</strong> a request to do something (&quot;ChargeCard&quot;). It can be rejected.
          </li>
          <li>
            <strong>Event:</strong> a statement that something happened (&quot;CardCharged&quot;). It should be immutable
            and historical.
          </li>
          <li>
            <strong>State:</strong> the current view of reality (order status). State can be rebuilt from events or from a
            database, depending on design.
          </li>
        </ul>
        <p className="mt-4">
          If you publish commands as if they were facts, downstream systems will act on work that may never succeed. If
          you publish facts too early (before committing state), downstream views drift. This is why patterns like the
          transactional outbox exist: they align published events with committed state.
        </p>
      </section>

      <section>
        <h2>Delivery Semantics: Assume Duplicates and Replays</h2>
        <p>
          Most event systems prioritize availability and throughput, which means consumers must tolerate duplicates and
          retries. In practice, &quot;exactly once&quot; is achieved by idempotent effects, not by perfect delivery.
        </p>
        <p>
          This changes how you design consumers: every handler should be safe to run more than once, and side effects
          should be deduplicated at the boundary (idempotency keys, upserts, or processed-event tracking).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/event-driven-architecture-diagram-2.svg"
          alt="Decision map for EDA: delivery semantics, ordering scope, schema evolution, replay, and backpressure"
          caption="EDA is a contract system: delivery semantics, ordering scope, and replay expectations must be explicit."
        />
      </section>

      <section>
        <h2>Ordering and Time: Define the Scope</h2>
        <p>
          Global ordering is rare. Most systems provide ordering within a partition or within a key. This is enough if
          you choose partition keys that align with the entities that need ordered state transitions (account, order,
          inventory item). If you choose the wrong scope, consumers see out-of-order updates and produce incorrect state.
        </p>
        <p>
          Time also matters. Many analytics flows require event-time processing and late-data handling. If you process by
          arrival time alone, late events corrupt windows. Mature EDA designs treat late data as normal and define
          correction policies.
        </p>
      </section>

      <section>
        <h2>Schema Evolution: Events Are Long-Lived APIs</h2>
        <p>
          Events outlive services. Once many consumers depend on an event, it becomes a public API. That means you need
          governance: versioning rules, compatibility checks, ownership, and deprecation policy. Without governance, EDA
          becomes a high-frequency breaking-change generator.
        </p>
        <p>
          A practical approach is to require additive evolution for most events, maintain compatibility windows, and
          publish a clear &quot;meaning contract&quot; (units, state transitions, interpretation). Semantic drift is often
          more damaging than structural drift.
        </p>
      </section>

      <section>
        <h2>Event Design: Granularity, Ownership, and Topics</h2>
        <p>
          A high-leverage decision in EDA is the shape of events and the ownership of event streams. Events that are too
          fine-grained create noisy consumer logic and fragile ordering dependencies. Events that are too coarse become
          hard to evolve and encourage consumers to infer meaning from fields that were never intended as a contract.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Define a clear owner:</strong> one producing domain owns the meaning of an event, the schema, and the
            deprecation policy.
          </li>
          <li>
            <strong>Partition for ordering:</strong> choose keys that align with state transitions (order ID, account ID)
            so consumers can process deterministically within the scope that matters.
          </li>
          <li>
            <strong>Minimize consumer coupling:</strong> publish facts, not internal database deltas. If consumers need a
            &quot;full object&quot;, publish a stable representation, not a leaking table schema.
          </li>
          <li>
            <strong>Use correlation consistently:</strong> traceability improves when events carry causation and
            correlation identifiers that allow workflows to be reconstructed during incidents.
          </li>
        </ul>
        <p className="mt-4">
          The practical goal is that a new consumer can be added without negotiating custom logic with the producer.
          That is only possible when meaning and ordering assumptions are explicit.
        </p>
      </section>

      <section>
        <h2>Operational Reality: Backpressure, Lag, and Replay</h2>
        <p>
          EDA systems are operated by watching lag and throughput. Lag is not just a metric; it is a user experience
          signal. If your read models or workflows depend on events, lag becomes staleness. Backpressure is the mechanism
          that prevents overload, but it also increases lag, so you need clear priorities for what must stay fresh.
        </p>
        <p>
          Replay is essential. When consumers change logic or need to rebuild derived state, they must reprocess history
          safely. Replay is not an emergency feature; it is a routine operational workflow that must be tested and
          governed to avoid melting downstream stores.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/event-driven-architecture-diagram-3.svg"
          alt="EDA failure modes: schema drift, poison events, lag runaway, duplicate effects, and replay overload"
          caption="EDA failures are usually correctness and operability failures: duplicates, drift, and lag. Design for safe reprocessing."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Poison events:</strong> a message that always fails blocks progress. Mitigation: dead-letter handling,
            quarantine, and bounded retries.
          </li>
          <li>
            <strong>Duplicate effects:</strong> retries create double side effects. Mitigation: idempotent writes and
            idempotency keys at the effect boundary.
          </li>
          <li>
            <strong>Schema drift:</strong> producers change fields and break consumers. Mitigation: compatibility checks
            and schema governance.
          </li>
          <li>
            <strong>Replay overload:</strong> rebuilding state melts sinks. Mitigation: throttled replay, versioned output
            stores, and isolation capacity.
          </li>
          <li>
            <strong>Silent semantic drift:</strong> meaning changes without schema changes. Mitigation: documentation,
            invariants, and reconciliation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Building a Search Index</h2>
        <p>
          A product catalog is the system of record. Search is built as a derived system. The catalog service publishes
          events for product changes, and a search consumer updates the index. When the search consumer falls behind, the
          user experience becomes stale. The team monitors lag as &quot;freshness&quot; and builds a runbook for catching
          up: scale consumers, throttle replay, and validate index correctness through sampling.
        </p>
        <p>
          When the search schema changes, the team replays events into a new version of the index, validates results, and
          switches the search alias. This turns replay into a safe deploy workflow rather than an outage-inducing rebuild.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Define semantics: events are facts; commands are requests. Do not publish facts before committing state.</li>
          <li>Design consumers for duplicates and replays; make effects idempotent.</li>
          <li>Choose partition keys that align with ordering needs; define correction policy for late/out-of-order events.</li>
          <li>Govern schemas like APIs: ownership, compatibility checks, versioning, and deprecation.</li>
          <li>Operate for lag and replay: monitor freshness, test rebuilds, and throttle reprocessing safely.</li>
          <li>Build runbooks for poison events and replay overload before incidents happen.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main benefit of EDA?</p>
            <p className="mt-2 text-sm">
              A: Decoupling and independent evolution: producers publish facts, consumers react without tight
              coordination.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the main correctness challenges in EDA?</p>
            <p className="mt-2 text-sm">
              A: Delivery is imperfect: duplicates, replays, limited ordering, and schema/semantic evolution. Correctness
              relies on idempotency and governance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle poison events?</p>
            <p className="mt-2 text-sm">
              A: Bound retries, quarantine or dead-letter the event, and provide a workflow to fix and reprocess safely
              without blocking the whole stream.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is lag an SLO concern in EDA?</p>
            <p className="mt-2 text-sm">
              A: Lag translates directly into staleness for derived systems. Freshness becomes part of user experience,
              not only an internal metric.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
