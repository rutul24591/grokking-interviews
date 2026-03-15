"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-event-sourcing-pattern-extensive",
  title: "Event Sourcing Pattern",
  description:
    "Store events as the source of truth and derive state from them, enabling auditability and rebuildable read models while introducing schema and operational complexity.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "event-sourcing-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "events", "correctness"],
  relatedTopics: ["event-driven-architecture", "cqrs-pattern", "materialized-view-pattern", "saga-pattern"],
};

export default function EventSourcingPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Events Are the Primary Record</h2>
        <p>
          <strong>Event sourcing</strong> stores a sequence of events as the authoritative record of what happened. The
          current state (for example, account balance or order status) is derived by replaying those events or by reading
          a maintained projection. Instead of persisting the latest state only, you persist the history of state
          transitions.
        </p>
        <p>
          The appeal is auditability and rebuildability. You can answer &quot;how did we get here?&quot; and you can
          rebuild derived views when logic changes. The cost is that you have introduced a long-lived event schema and an
          operational model built around replay, projections, and versioning.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/event-sourcing-pattern-diagram-1.svg"
          alt="Event sourcing diagram showing commands producing events, event store, and projections deriving state"
          caption="Event sourcing makes history explicit: commands produce events, and state is derived through projections."
        />
      </section>

      <section>
        <h2>Core Concepts: Commands, Events, and Aggregates</h2>
        <p>
          Event sourcing is often paired with a domain model that enforces invariants. A command requests a change. The
          domain validates the command against current state and invariants, then emits events that represent the accepted
          change. Those events are appended to an event store.
        </p>
        <p>
          Aggregates become the natural unit of event streams. Ordering is typically guaranteed within an aggregate ID,
          so invariants can be enforced consistently. This is also why partitioning and key choice matter: they define
          where ordering and concurrency boundaries live.
        </p>
      </section>

      <section>
        <h2>Projections: Turning History Into Queryable State</h2>
        <p>
          Raw event streams are not usually query-friendly. A projection (or read model) consumes events and builds a
          queryable representation: tables, indexes, caches, or search documents. This is where event sourcing meets CQRS:
          write side emits events; read side consumes and materializes views.
        </p>
        <p>
          The key operational guarantee is that projections are <strong>rebuildable</strong>. If a projection has a bug or
          the query shape changes, you can reprocess events to rebuild it. That rebuild must be safe: version outputs,
          throttle writes, and validate results before switching consumers.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/event-sourcing-pattern-diagram-2.svg"
          alt="Decision map for event sourcing including schema evolution, snapshots, projections, and replay workflows"
          caption="Event sourcing is a lifecycle: schema evolution and replay workflows determine whether it remains sustainable."
        />
      </section>

      <section>
        <h2>Snapshots: Performance and Operational Convenience</h2>
        <p>
          Replaying a long event history can be expensive. Snapshots reduce replay cost by persisting a derived state at a
          point in time, then replaying only newer events. Snapshots improve performance and recovery time, but they add a
          new correctness surface: snapshots must be consistent with events, and snapshot versioning must evolve with the
          model.
        </p>
        <p>
          A practical approach is to treat snapshots as caches: rebuildable, validated, and not the primary source of
          truth. Events remain authoritative.
        </p>
        <p>
          Snapshot cadence is an engineering choice. Frequent snapshots reduce replay time but increase write overhead
          and storage. In many systems, snapshots are taken based on event count thresholds, time thresholds, or
          operational triggers (for example, before a planned replay or after a large migration). Whatever the policy,
          teams should be able to detect snapshot drift and rebuild snapshots deterministically from the event log.
        </p>
      </section>

      <section>
        <h2>Schema Evolution: The Long-Term Cost</h2>
        <p>
          Event sourcing shifts schema evolution from &quot;what is the current table&quot; to &quot;what does this event
          mean over time.&quot; Events are immutable in principle, but your interpretation of them evolves. That means you
          need a strategy for event versioning and compatibility.
        </p>
        <p>
          There are two common approaches. One is &quot;upcasters&quot;: translate old event versions into the new shape
          during replay. Another is &quot;versioned handlers&quot;: keep logic that can process multiple versions. Both
          have cost. The important part is to avoid breaking replay and to avoid semantic drift where two projections
          interpret the same event differently without realizing it.
        </p>
      </section>

      <section>
        <h2>Operational Reality: Replay Is a Routine Workflow</h2>
        <p>
          The operational backbone of event sourcing is replay and reprocessing. Teams must be able to rebuild a
          projection on demand, validate it, and cut over safely. If replay is treated as a rare emergency procedure,
          event sourcing becomes brittle.
        </p>
        <p>
          You also need drift detection. Event sourcing can produce plausible-but-wrong state if a projection has a bug.
          Reconciliation checks and invariants should exist outside the projection logic, so you can detect divergence.
        </p>
      </section>

      <section>
        <h2>Concurrency, Ordering, and Idempotency</h2>
        <p>
          Event sourcing makes concurrency explicit. Multiple commands can race, and events can be delivered more than
          once. A robust design defines ordering guarantees (per aggregate, per partition) and uses optimistic
          concurrency checks so two writers cannot silently overwrite each other’s intent.
        </p>
        <p>
          Consumers must be idempotent. Projection handlers should record the last processed position (or event ID) and
          tolerate duplicates and replays. Without idempotency, replay becomes destructive: rebuilding a view can double
          count totals, create duplicate rows, or emit duplicated downstream events.
        </p>
      </section>

      <section>
        <h2>Runbook: Rebuilding a Projection Safely</h2>
        <ol className="mt-4 space-y-2">
          <li>Choose a target projection version and deploy it alongside the current one.</li>
          <li>Replay into a separate output (new index/table/namespace) with controlled throttling.</li>
          <li>Validate correctness using reconciliation checks (counts, balances, invariants).</li>
          <li>Cut over reads via an alias or routing switch, then monitor drift and latency.</li>
          <li>Keep rollback: the old projection remains available until the new one is proven stable.</li>
        </ol>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/event-sourcing-pattern-diagram-3.svg"
          alt="Event sourcing failure modes: projection drift, replay overload, event schema breakage, and snapshot inconsistency"
          caption="Event sourcing failures are usually lifecycle failures: schema and replay discipline determine sustainability."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Projection drift:</strong> projection logic changes and historical interpretations diverge. Mitigation:
            version projections, reconcile, and document semantics.
          </li>
          <li>
            <strong>Replay overload:</strong> rebuilding melts downstream stores. Mitigation: throttle replay, isolate
            capacity, and write to versioned outputs.
          </li>
          <li>
            <strong>Event schema breakage:</strong> old events cannot be processed. Mitigation: explicit versioning and
            compatibility testing.
          </li>
          <li>
            <strong>Snapshot inconsistency:</strong> snapshots do not match event history. Mitigation: treat snapshots as
            rebuildable caches and validate periodically.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Ledger and Audit Requirements</h2>
        <p>
          A financial system needs an audit trail and the ability to answer questions like &quot;what was the balance at
          time T?&quot; Storing only current balance makes these questions expensive and error-prone. Event sourcing stores
          balance-affecting events and derives current balance through replay.
        </p>
        <p>
          The system builds projections for &quot;current balance&quot; and for reporting. When a bug is discovered in how
          fees were applied, the system rebuilds projections from history into a new version, validates totals against an
          external control report, and then cuts over. The audit requirement is satisfied because the history is explicit.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use event sourcing when auditability, rebuildability, and historical reasoning are core requirements.</li>
          <li>Define aggregate boundaries and ordering scope; align partitioning to invariants.</li>
          <li>Make projections rebuildable and versioned; design replay as a safe operational workflow.</li>
          <li>Plan event schema evolution explicitly: versioning, upcasters/handlers, and meaning documentation.</li>
          <li>Use snapshots carefully as caches, not as truth; validate snapshot consistency.</li>
          <li>Build reconciliation and invariants to detect drift and silent projection bugs.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does event sourcing buy you over storing current state?</p>
            <p className="mt-2 text-sm">
              A: A durable history for audits and the ability to rebuild derived state. It also makes state transitions
              explicit and replayable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest cost of event sourcing?</p>
            <p className="mt-2 text-sm">
              A: Lifecycle complexity: event schema evolution, projection rebuild workflows, and operational replay
              discipline.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle event schema evolution safely?</p>
            <p className="mt-2 text-sm">
              A: Version events, maintain compatibility via upcasters or versioned handlers, and test replay against real
              historical data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent projection bugs from silently corrupting state?</p>
            <p className="mt-2 text-sm">
              A: Reconciliation checks, invariants, versioned projections, and the ability to rebuild and compare outputs
              before cutover.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
