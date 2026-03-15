"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-kappa-architecture-extensive",
  title: "Kappa Architecture",
  description:
    "A streaming-first approach where a single pipeline and replayable log replace separate batch and speed layers.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "kappa-architecture",
  wordCount: 1127,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "streaming", "architecture", "pipelines"],
  relatedTopics: ["lambda-architecture", "apache-kafka", "stream-processing", "exactly-once-semantics"],
};

export default function KappaArchitectureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: One Pipeline, Replayable History</h2>
        <p>
          <strong>Kappa architecture</strong> is a data architecture pattern that favors a single streaming pipeline fed by
          an append-only, replayable log. Instead of maintaining separate batch and streaming (“speed”) layers, Kappa
          treats the stream as the source of truth and uses replay to backfill or recompute when logic changes.
        </p>
        <p>
          The motivation is simplicity and consistency. If you have two pipelines that compute the “same” metric, they will
          drift. Kappa reduces that drift by having one pipeline and one computation path, at the cost of requiring strong
          streaming semantics and operational maturity.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Kappa Works When</h3>
          <ul className="space-y-2">
            <li>The event log can retain history long enough to support replay-based recomputation.</li>
            <li>Your streaming engine can express the required transformations and state.</li>
            <li>You can operate stateful streaming reliably (checkpoints, backpressure, recovery).</li>
            <li>Your consumers can tolerate streaming-style finality (late data, corrections).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Core Building Blocks</h2>
        <p>
          Kappa is built on three foundations: a durable log, a stream processor, and materialized outputs. The log
          provides replay; the processor defines transformations; the outputs serve analytics or product features.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/kappa-architecture-diagram-1.svg"
          alt="Kappa architecture diagram"
          caption="Kappa architecture: a durable log feeds one streaming pipeline that produces materialized views and derived outputs."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Durable log:</strong> partitioned event history with retention and compaction policies.
          </li>
          <li>
            <strong>Stream processor:</strong> stateful operators, windowing, joins, and deduplication.
          </li>
          <li>
            <strong>Serving outputs:</strong> warehouses, indexes, feature stores, and caches updated continuously.
          </li>
          <li>
            <strong>Reprocessing mechanism:</strong> replay from an offset/time and rebuild state safely.
          </li>
        </ul>
      </section>

      <section>
        <h2>Reprocessing: Replay as the Backfill Mechanism</h2>
        <p>
          Kappa replaces batch recomputation with replay. When logic changes or bugs are fixed, you re-run the streaming
          job from a chosen point in the log and rebuild outputs. This can be simpler than maintaining a separate batch
          pipeline, but only if retention and replay throughput are adequate.
        </p>
        <p>
          Replay is not free. It competes with realtime processing, can overload sinks, and can take hours or days for long
          histories. Mature Kappa systems treat replay as an operational workflow: isolate capacity, throttle sinks, and
          publish a “finalization policy” for when outputs are trusted.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Replay Design Choices</h3>
          <ul className="space-y-2">
            <li>How far back can you replay (retention window)?</li>
            <li>Can you replay faster than realtime, and how do you protect downstream systems?</li>
            <li>Are outputs idempotent so replays do not duplicate effects?</li>
            <li>How do you validate correctness after replay (reconciliation and invariants)?</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Correctness: Ordering, Late Data, and Exactly-Once Effects</h2>
        <p>
          Kappa’s correctness story is the streaming correctness story. Ordering is typically per partition or per key.
          Late data is normal, so windowing policies and watermarks matter. Exactly-once effects require coordinated
          commits or idempotent sinks, especially during replays and failures.
        </p>
        <p>
          Because Kappa often powers derived views, correctness is often evaluated via reconciliation: compare derived
          outputs with the source of truth, especially after replays or schema changes. This is how you detect silent drift.
        </p>
      </section>

      <section>
        <h2>Operational Reality: Stateful Streaming as a Platform</h2>
        <p>
          Kappa is operationally demanding. Your pipeline is always running, state must be checkpointed and recovered, and
          lag becomes a first-class KPI. If the pipeline falls behind, your “source of truth” outputs become stale.
        </p>
        <p>
          You also operate the log itself: topic partitioning, retention, compaction, and schema evolution. Kappa systems
          fail not only when the processor fails, but when the log becomes misconfigured or when schema drift breaks
          consumers.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/kappa-architecture-diagram-2.svg"
          alt="Kappa operational signals diagram"
          caption="Operational signals: lag, checkpoint health, state growth, retention risk, and sink backpressure determine whether Kappa stays reliable."
        />
        <ul className="mt-4 space-y-2">
          <li>Lag and freshness relative to event time (not only offsets).</li>
          <li>Checkpoint duration, failures, and restore time after restart.</li>
          <li>State size growth and compaction effectiveness.</li>
          <li>Retention risk: backlog approaching the replay window limit.</li>
          <li>Sink health: backpressure, throttling, and idempotency behavior.</li>
        </ul>
      </section>

      <section>
        <h2>Output Versioning and Safe Cutovers</h2>
        <p>
          Replays and recomputations are high-risk moments because they often rewrite “truth” in downstream stores. A
          common reliability pattern is to treat derived outputs like deployable artifacts: write recomputed results into
          a new versioned dataset or index, validate it, and then switch consumers over through an alias or routing layer.
        </p>
        <p>
          This protects you from two failure classes. First, it prevents partially replayed state from leaking to
          consumers while a job is still catching up. Second, it preserves rollback: if a bug is discovered in the new
          logic, you can switch back without re-running an expensive replay. In practice, teams pair versioning with
          guardrails like sink throttling, “stop-the-world” windows for critical tables, and explicit communication that
          numbers may change after a backfill.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Dual-write during migration:</strong> run old and new pipelines briefly to compare outputs before
            cutover.
          </li>
          <li>
            <strong>Validation gates:</strong> check invariants (totals, distributions, join rates) before promoting a
            new version.
          </li>
          <li>
            <strong>Consumer safety:</strong> document whether outputs are eventually consistent, and what “final” means
            for analytics and product use cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs vs Lambda Architecture</h2>
        <p>
          Kappa’s advantage is one computation path and reduced drift between batch and streaming results. Lambda’s
          advantage is strong batch correctness and the ability to recompute from stored historical data even if streaming
          retention is limited.
        </p>
        <p>
          If your organization struggles to operate stateful streaming and replay reliably, Lambda can be more forgiving.
          If you can operate streaming and your log retention supports replay, Kappa can be simpler long-term.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>
          Kappa’s failures are often about lag and correctness drift under replay. Because the system is always on, small
          issues can accumulate into large stale or incorrect outputs.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/kappa-architecture-diagram-3.svg"
          alt="Kappa failure modes diagram"
          caption="Failure modes: retention limits, replay overload, state corruption, and sink backpressure can cause stale or incorrect materialized views."
        />
        <ul className="mt-4 space-y-2">
          <li>Lag runaway causes stale outputs and missed freshness objectives.</li>
          <li>Retention too short makes replay-based recomputation impossible.</li>
          <li>Replay overload melts sinks and causes cascading failures.</li>
          <li>State corruption or schema incompatibility breaks joins and aggregates silently.</li>
          <li>Idempotency gaps cause replay to duplicate effects in downstream stores.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A personalization system maintains a user feature store from clickstream events. The team chooses Kappa so the
          same stream processor powers both realtime updates and rebuilds after logic changes. When they discover a bug in
          session attribution, they replay the log from a known good point and rebuild feature state.
        </p>
        <p>
          During replay, they throttle sink writes to protect the feature store and run reconciliation checks comparing
          feature totals against batch-derived samples. After replay, they publish a new feature version and gradually
          roll clients to the corrected features.
        </p>
        <p>
          The system succeeds because replay is treated as a planned operational workflow, not an emergency toggle.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to evaluate whether Kappa is a good fit.</p>
        <ul className="mt-4 space-y-2">
          <li>Ensure log retention and replay throughput can support recomputation needs.</li>
          <li>Design stateful streaming with bounded state, checkpoints, and clear recovery procedures.</li>
          <li>Make sinks idempotent and define exactly-once effect boundaries explicitly.</li>
          <li>Instrument lag, freshness, checkpoint health, and state growth as first-class signals.</li>
          <li>Define schema evolution and governance so producers and consumers stay compatible.</li>
          <li>Plan replay workflows with isolation, throttling, and validation.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Explain Kappa in terms of replay, state, and operational constraints.</p>
        <ul className="mt-4 space-y-2">
          <li>How does Kappa differ from Lambda, and what trade-offs drive the choice?</li>
          <li>What does replay mean operationally and how do you prevent replay from overloading sinks?</li>
          <li>What guarantees do you need from the log (ordering, retention) to make Kappa viable?</li>
          <li>How do you validate correctness after replay or schema changes?</li>
          <li>What failure modes are most common in stateful streaming pipelines?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
