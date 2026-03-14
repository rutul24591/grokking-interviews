"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-deduplication-extensive",
  title: "Data Deduplication",
  description:
    "Remove duplicates safely in pipelines with clear definitions of identity, bounded state, and recovery-friendly strategies for retries and replays.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "data-deduplication",
  wordCount: 1141,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "deduplication", "correctness", "pipelines"],
  relatedTopics: ["exactly-once-semantics", "message-ordering", "stream-processing", "batch-processing"],
};

export default function DataDeduplicationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Duplicate Inputs Are Normal</h2>
        <p>
          <strong>Data deduplication</strong> removes duplicate records so downstream results are correct and stable.
          Duplicates occur naturally in distributed systems: retries resend messages, producers replay events after
          failures, ingestion pipelines reprocess partitions, and CDC tools emit repeats during restarts. If you do not
          deduplicate, duplicates turn into double-counting, duplicate side effects, and silent correctness drift.
        </p>
        <p>
          Deduplication is not a boolean feature. It requires a definition of identity (what makes two records “the same”)
          and an operational strategy for state: how long you remember seen events, how you handle late data, and how you
          recover after crashes.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Deduplication Starts With Identity</h3>
          <ul className="space-y-2">
            <li>
              <strong>Event identity:</strong> a stable event id, sequence number, or source offset.
            </li>
            <li>
              <strong>Business identity:</strong> a logical operation id (payment id, order id) that should have one effect.
            </li>
            <li>
              <strong>Content identity:</strong> a hash of normalized payload (risky if payload can change semantically).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Where Duplicates Come From</h2>
        <p>
          Understanding duplication sources helps you choose the right strategy. Some duplicates are identical repeats of
          the same event. Others are “semantic duplicates” where two different events represent the same business outcome.
          Those require domain modeling, not just technical filtering.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/data-deduplication-diagram-1.svg"
          alt="Duplicate sources diagram"
          caption="Duplicate sources: retries, replays, partition reruns, and CDC restarts all create duplicates that must be handled explicitly."
        />
        <ul className="mt-4 space-y-2">
          <li>Producer retries after timeouts, especially when acknowledgments are ambiguous.</li>
          <li>Consumer restarts reprocess data when progress commits are not atomic with outputs.</li>
          <li>Batch reruns and backfills re-emit historical data intentionally.</li>
          <li>CDC pipelines replay segments during failover or resnapshot operations.</li>
        </ul>
      </section>

      <section>
        <h2>Deduplication Strategies</h2>
        <p>
          There are three broad strategies, and most real systems combine them:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Prevent duplicates at the sink:</strong> idempotent writes (upserts keyed by event id or operation id).
          </li>
          <li>
            <strong>Filter duplicates in the pipeline:</strong> maintain “seen ids” state and drop repeats.
          </li>
          <li>
            <strong>Reconcile later:</strong> accept duplicates and correct through audits and batch reconciliation.
          </li>
        </ul>
        <p className="mt-4">
          Sink-level idempotency is often the most reliable because it is closest to the effect. Pipeline filtering can be
          efficient but requires correct, durable state and careful retention policies. Reconciliation is a necessary
          fallback when perfect filtering is too expensive or not possible.
        </p>
      </section>

      <section>
        <h2>State and Retention: The Cost of Remembering</h2>
        <p>
          Deduplication requires memory of what has been processed. That memory can be a database table of ids, a per-key
          sequence number, a cache with TTL, or an embedded state store in a stream processor. Retention is the hardest
          choice: keep state too short and duplicates slip through; keep it too long and state becomes unbounded.
        </p>
        <p>
          In streaming systems, deduplication state is often bounded by time windows (dedupe within the last N hours) or
          by sequence numbers (dedupe per key with monotonic ids). In batch systems, partitioned outputs often provide
          natural idempotency boundaries.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/data-deduplication-diagram-2.svg"
          alt="Deduplication state and retention diagram"
          caption="Deduplication state must be bounded. TTLs, windowing, and per-key sequence tracking define how long duplicates can be detected."
        />
      </section>

      <section>
        <h2>Choosing the Dedup Boundary</h2>
        <p>
          “Where do we deduplicate?” is often more important than “how do we deduplicate?” The safest place is usually
          the <strong>effect boundary</strong>: the point where something irreversible happens, such as charging a card,
          sending an email, or publishing a record into a system of record. If you deduplicate only upstream and you get a
          replay later, you can still produce a duplicate effect.
        </p>
        <p>
          The boundary also determines what identity means. Technical identifiers (offsets, partition ids) are useful for
          pipeline dedup, but business identifiers (payment id, order id, idempotency key) are usually the right choice
          when you need user-visible at-most-once behavior. In many real systems, teams use both: business idempotency at
          the sink and lightweight pipeline dedup to reduce load.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Pipeline-first:</strong> reduces downstream traffic, but requires durable dedup state and careful
            recovery semantics.
          </li>
          <li>
            <strong>Sink-first:</strong> is resilient to replays and retries, but can increase write amplification and
            needs strong indexing on idempotency keys.
          </li>
          <li>
            <strong>Hybrid:</strong> common at scale: filter obvious duplicates early, and enforce correctness at the
            effect boundary.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interaction With Ordering and Exactly-Once Effects</h2>
        <p>
          Deduplication, ordering, and exactly-once effects are related but distinct. If you have duplicates and out-of-order
          events, deduplication must not accidentally discard the “real” later update. Per-key sequence numbers can help:
          you keep the highest sequence seen and ignore older ones.
        </p>
        <p>
          Exactly-once effects often rely on deduplication: if you cannot commit progress and outputs atomically, you will
          reprocess, and you need idempotent writes or dedupe state to avoid duplicate effects.
        </p>
      </section>

      <section>
        <h2>Operational Signals and Playbook</h2>
        <p>
          Deduplication failures can be silent, so observability matters. You want to know not only that duplicates exist,
          but that your strategy is working within expected bounds.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Duplicate rate:</strong> percent of inputs dropped as duplicates, segmented by source and key.
          </li>
          <li>
            <strong>Dedup state growth:</strong> memory/storage usage and churn rate, which indicate retention mismatch.
          </li>
          <li>
            <strong>Leak-through indicators:</strong> reconciliation mismatches or downstream “double count” alarms.
          </li>
          <li>
            <strong>Latency impact:</strong> time spent on dedup checks (hot id lookups can become a bottleneck).
          </li>
        </ul>
        <p className="mt-4">
          A practical playbook includes: verify identity definition, inspect duplicate rate changes after deploys, and
          validate whether late data increased. If dedup state is overloaded, mitigation options include tightening TTL,
          moving dedup to sink-level idempotency, or isolating high-volume sources.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>
          Deduplication can fail in both directions: allowing duplicates through (under-dedup) or dropping legitimate events
          (over-dedup). Over-dedup is often worse because it creates silent data loss.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/data-deduplication-diagram-3.svg"
          alt="Deduplication failure modes diagram"
          caption="Failure modes: missing identity, retention too short or too long, over-dedup data loss, and dedup state becoming a bottleneck."
        />
        <ul className="mt-4 space-y-2">
          <li>Identity keys are not stable, so the same logical event appears different across retries.</li>
          <li>Retention is too short, so replays after outages create duplicates downstream.</li>
          <li>Retention is too long, so state grows until it impacts latency and recovery.</li>
          <li>Over-dedup drops legitimate updates because keys collide or sequences reset.</li>
          <li>Dedup store becomes a single bottleneck and increases pipeline lag.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          An email system processes “send email” events. Producers retry on timeouts, creating duplicates. Without
          deduplication, users receive duplicate emails. The team introduces idempotency keys per send request and performs
          an upsert into a send-log store keyed by that idempotency key.
        </p>
        <p>
          During an outage, the consumer restarts and reprocesses events, but the sink-level idempotency prevents duplicate
          sends. Dedup state is retained long enough to cover expected retries and replays, and a reconciliation job
          samples sends to ensure at-most-once user-visible behavior.
        </p>
        <p>
          The key design choice is to deduplicate at the effect boundary (sending) rather than only in the pipeline,
          making correctness resilient even when the pipeline replays.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when adding deduplication to a pipeline.</p>
        <ul className="mt-4 space-y-2">
          <li>Define identity: stable event ids, per-key sequence numbers, or business operation ids.</li>
          <li>Prefer sink-level idempotency for non-repeatable side effects.</li>
          <li>Bound deduplication state with TTLs or windowing; plan retention based on replay and outage scenarios.</li>
          <li>Monitor duplicate rate, state growth, and reconciliation mismatches.</li>
          <li>Test crash/retry/replay scenarios to validate under real failure behavior.</li>
          <li>Document failure handling: what happens when dedup state is unavailable or inconsistent.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Focus on identity, state bounds, and the effect boundary.</p>
        <ul className="mt-4 space-y-2">
          <li>Where do duplicates come from in distributed pipelines and how do you design for them?</li>
          <li>How do you define identity for deduplication without causing false drops?</li>
          <li>What are the trade-offs between dedup in the pipeline vs idempotency at the sink?</li>
          <li>How do ordering and late data interact with deduplication?</li>
          <li>What operational signals detect dedup failures early?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
