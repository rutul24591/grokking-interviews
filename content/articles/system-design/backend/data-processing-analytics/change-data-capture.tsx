"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-change-data-capture-extensive",
  title: "Change Data Capture (CDC)",
  description:
    "Replicate and react to database changes with clear correctness guarantees, schema evolution discipline, and operational controls over lag and backfills.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "change-data-capture",
  wordCount: 1205,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "cdc", "replication", "pipelines"],
  relatedTopics: ["apache-kafka", "data-pipelines", "exactly-once-semantics", "message-ordering"],
};

export default function ChangeDataCaptureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Why CDC Exists</h2>
        <p>
          <strong>Change Data Capture (CDC)</strong> is a pattern for capturing changes from a database (inserts, updates,
          deletes) and emitting them as an ordered change stream. That stream can drive downstream systems: analytics
          pipelines, search indexing, cache invalidation, denormalized read models, and integration with external systems.
        </p>
        <p>
          CDC exists because polling databases is inefficient and error-prone at scale. Polling creates load, misses
          intermediate updates, and struggles with deletes. CDC can provide a durable, ordered history of changes, enabling
          replay and rebuilds of downstream state.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">CDC Is Useful When You Need</h3>
          <ul className="space-y-2">
            <li>Near-real-time replication into a warehouse or lake without heavy database polling.</li>
            <li>Materialized views in downstream stores (search, cache, serving DB) driven by source-of-truth changes.</li>
            <li>Event-driven reactions to changes (notifications, workflows) with replay capability.</li>
            <li>Consistent backfills and rebuilds of derived systems after logic changes.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>CDC Architectures</h2>
        <p>
          CDC can be implemented in multiple ways. The most robust approaches read a database’s transaction log (WAL,
          binlog) because that log reflects committed changes and preserves order. Other approaches use triggers or
          application-level dual writes, which have different correctness and operational risks.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-1.svg"
          alt="CDC architecture diagram"
          caption="CDC architectures: log-based CDC is robust; triggers and dual writes can work but add correctness and operational risk."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Log-based CDC:</strong> consume the database change log; best alignment with committed transactions.
          </li>
          <li>
            <strong>Trigger-based CDC:</strong> DB triggers write to an outbox or change table; can impact DB performance.
          </li>
          <li>
            <strong>Dual-write CDC:</strong> application writes DB and emits an event; simplest but easiest to get wrong.
          </li>
        </ul>
        <p className="mt-4">
          In practice, log-based CDC plus a durable streaming log is the most common foundation for scalable and replayable
          data pipelines.
        </p>
      </section>

      <section>
        <h2>Correctness Semantics: Order, Transactions, and Deletes</h2>
        <p>
          CDC is only valuable when its semantics match what consumers need. The key questions are: what is the ordering
          scope, how are transactions represented, and how are deletes expressed. Many downstream bugs come from assuming a
          CDC stream is “events” when it is actually “state changes,” or vice versa.
        </p>
        <p>
          Another crucial detail is how you represent before/after images. Some consumers need full row snapshots to
          rebuild state. Others only need keys and change type. Payload design affects downstream cost and privacy.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Ordering:</strong> typically preserved per key/partition; global ordering is rare.
          </li>
          <li>
            <strong>Transactions:</strong> streams may include transaction boundaries or per-row events; consumers must know.
          </li>
          <li>
            <strong>Deletes:</strong> must be explicit or downstream state will accumulate ghost records.
          </li>
          <li>
            <strong>Snapshots:</strong> initial snapshots must align with the change stream so consumers can bootstrap safely.
          </li>
        </ul>
      </section>

      <section>
        <h2>Bootstrapping: Snapshot + Stream</h2>
        <p>
          Most CDC consumers need a bootstrap: load existing state, then apply changes. Doing this safely requires a
          consistent cut: the snapshot should represent the database at a point in time and the stream should include all
          changes after that point. If the boundary is wrong, you either miss changes or double-apply them.
        </p>
        <p>
          Operationally, bootstrapping is where the “data plumbing” becomes visible: snapshots are large, can take hours,
          and can overload the source database if done incorrectly. Mature systems use read replicas, throttling, and
          careful scheduling.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-2.svg"
          alt="CDC snapshot plus streaming bootstrap diagram"
          caption="Bootstrapping: load a consistent snapshot, then apply a change stream from the same point without gaps or double-application."
        />
      </section>

      <section>
        <h2>Schema Evolution and Contracts</h2>
        <p>
          CDC pipelines are highly sensitive to schema evolution. A column rename, type change, or new nullability rule
          can break downstream consumers or silently change semantics. Robust CDC requires explicit compatibility policies
          and versioning discipline.
        </p>
        <p>
          A common pattern is to treat CDC as a product API: changes are reviewed, compatibility is validated, and
          consumers have a migration window. Without this, CDC becomes an organizational outage generator.
        </p>
      </section>

      <section>
        <h2>Applying Changes Downstream: Upserts, Tombstones, and Idempotency</h2>
        <p>
          CDC streams are most valuable when consumers can apply them deterministically. Downstream systems typically
          maintain a derived “read model” (search index, cache, analytics table). For that to work, consumers must know
          whether the stream is emitting full row snapshots, partial updates, or before/after images, and they must apply
          changes in a way that survives retries and replays.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Upserts:</strong> treat each change as “set current state for this primary key,” which is naturally
            idempotent when you have a stable key.
          </li>
          <li>
            <strong>Tombstones:</strong> represent deletes explicitly so derived stores can remove records rather than
            accumulating ghosts.
          </li>
          <li>
            <strong>Ordering constraints:</strong> if updates can arrive out of order, consumers need a version field or
            commit timestamp to avoid applying older state over newer state.
          </li>
          <li>
            <strong>Side effects:</strong> avoid treating CDC as a trigger for external actions unless you have a clear
            idempotency story; otherwise, replays can duplicate user-visible effects.
          </li>
        </ul>
        <p className="mt-4">
          The operational takeaway is that CDC is not automatically “event-driven architecture.” It is a state-change
          feed. If you treat it as pure events without thinking about idempotency and ordering, correctness incidents show
          up later as drift in derived systems.
        </p>
      </section>

      <section>
        <h2>Operational Signals: Lag, Loss, and Drift</h2>
        <p>
          CDC pipelines are often operated by watching lag. Lag is necessary but not sufficient. A stream can be fresh but
          wrong. You need signals for both timeliness and correctness.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Replication lag:</strong> delay between source commit time and downstream availability.
          </li>
          <li>
            <strong>Gap detection:</strong> missing offsets/LSNs or unexpected discontinuities.
          </li>
          <li>
            <strong>Backlog growth:</strong> whether lag is increasing faster than consumers can process.
          </li>
          <li>
            <strong>Schema drift:</strong> parse/validation failures and incompatible schema changes.
          </li>
          <li>
            <strong>Reconciliation:</strong> periodic comparisons between source and derived stores to detect drift.
          </li>
        </ul>
        <p className="mt-4">
          A strong runbook includes “how to catch up safely” (scale consumers, throttle producers, isolate hot tables),
          plus “how to rebuild” (re-snapshot and replay) when correctness is compromised.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>
          CDC failures are often expensive because they impact many downstream systems simultaneously. Most incidents fall
          into one of three categories: pipeline falling behind, pipeline losing data, or pipeline producing incorrect
          change interpretation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-3.svg"
          alt="CDC failure modes diagram"
          caption="CDC failure modes: lag runaway, schema evolution breakage, snapshot boundary mistakes, and drift between source and derived systems."
        />
        <ul className="mt-4 space-y-2">
          <li>Lag runaway causes stale reads and missed freshness objectives.</li>
          <li>Snapshot boundary mistakes cause gaps or duplicates in downstream state.</li>
          <li>Schema changes break consumers or silently change semantics.</li>
          <li>Deletes are mishandled, creating ghost records downstream.</li>
          <li>CDC tooling failures cause partial loss that is only discovered later via audits.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A search index is built from a relational database. CDC emits row changes for product and inventory tables.
          During a peak event, the database write rate increases and CDC lag grows. Search results become stale and users
          see out-of-stock items.
        </p>
        <p>
          Responders mitigate by scaling CDC consumers and throttling non-critical updates. They also introduce a safety
          mechanism: search uses a fallback query to the source database for a small percentage of requests when index
          freshness degrades beyond a threshold. After the incident, the team adds a reconciliation job that samples rows
          and compares index state to source state, catching drift early.
        </p>
        <p>
          The longer-term fix is to separate hot tables into dedicated streams and to tune snapshot and replay tooling so
          rebuilds are faster and safer.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when designing or adopting CDC.</p>
        <ul className="mt-4 space-y-2">
          <li>Choose CDC architecture intentionally (log-based preferred for committed-order fidelity).</li>
          <li>Define semantics: ordering scope, transaction representation, delete handling, and payload shape.</li>
          <li>Design bootstrap correctly: consistent snapshot plus change stream boundary.</li>
          <li>Enforce schema evolution discipline with compatibility rules and consumer migration paths.</li>
          <li>Monitor lag plus correctness signals (gaps, drift, reconciliation) and maintain rebuild runbooks.</li>
          <li>Plan for backfills and replay so downstream systems can be rebuilt safely.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Explain CDC as a correctness and operations system.</p>
        <ul className="mt-4 space-y-2">
          <li>Why is log-based CDC usually more correct than dual writes?</li>
          <li>How do you bootstrap a new CDC consumer without missing or duplicating changes?</li>
          <li>How do you handle schema evolution safely in a CDC pipeline?</li>
          <li>What signals tell you CDC is stale versus wrong?</li>
          <li>Describe a CDC-driven materialized view and how you would validate and repair drift.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
