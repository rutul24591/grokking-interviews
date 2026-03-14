"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-aggregations-extensive",
  title: "Aggregations",
  description:
    "Compute sums, counts, percentiles, and distincts at scale with associative design, skew handling, and clear correctness contracts.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "aggregations",
  wordCount: 1232,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "analytics", "aggregation", "streaming"],
  relatedTopics: ["windowing", "batch-processing", "stream-processing", "data-partitioning"],
};

export default function AggregationsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Why Aggregations Are Hard at Scale</h2>
        <p>
          <strong>Aggregations</strong> turn raw events into summaries: counts per route, revenue per day, unique users per
          region, p95 latency per endpoint. Aggregations look simple but become complex in distributed systems because you
          must combine partial results across partitions, handle skew, and define correctness under late data and retries.
        </p>
        <p>
          The key mental model is that many aggregations must be decomposable into partial aggregates and combinable into a
          final result. If an aggregation is not associative (or not close enough), distributed execution becomes expensive
          or incorrect.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Operational Aggregation Questions</h3>
          <ul className="space-y-2">
            <li>Is the result exact or approximate, and what error bounds are acceptable?</li>
            <li>Does late data correct prior results or get dropped?</li>
            <li>How do you prevent one hot key from dominating compute and state?</li>
            <li>How do you make aggregation idempotent under retries and replays?</li>
            <li>What is the cost model (state size, shuffle volume, query cost) as data grows?</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Aggregation Building Blocks</h2>
        <p>
          Distributed aggregations are easiest when you can compute a <strong>partial</strong> result per shard and then
          <strong>merge</strong> partials. That’s why sums and counts are cheap: partial sums merge by addition. More complex
          aggregations (percentiles, distinct counts) require special sketches or multi-stage designs.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/aggregations-diagram-1.svg"
          alt="Distributed aggregation partial and merge diagram"
          caption="Distributed aggregation: compute partials close to data, then merge into a final result to minimize shuffle and improve scalability."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Associative merge:</strong> merge(a, merge(b, c)) equals merge(merge(a, b), c).
          </li>
          <li>
            <strong>Combiners:</strong> reduce data early (pre-aggregation) to reduce network shuffle.
          </li>
          <li>
            <strong>Keyed state:</strong> maintain per-key aggregates incrementally in streaming systems.
          </li>
          <li>
            <strong>Windowing:</strong> bound aggregation scope over time for streaming.
          </li>
        </ul>
      </section>

      <section>
        <h2>Exact vs Approximate Aggregations</h2>
        <p>
          Some aggregations are expensive to compute exactly at scale. Distinct counts, percentiles, and heavy hitters can
          require large state or expensive shuffles. Approximate algorithms trade a small, controlled error for much lower
          cost and better latency.
        </p>
        <p>
          The right choice depends on the use case. For billing, exactness is usually required. For dashboards and
          experimentation metrics, approximate results with known error bounds are often acceptable and operationally
          superior.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Distinct count:</strong> exact requires large sets; approximate uses sketches with bounded error.
          </li>
          <li>
            <strong>Percentiles:</strong> exact needs sorting or full histograms; approximate uses sketches or fixed buckets.
          </li>
          <li>
            <strong>Top-K:</strong> approximate heavy-hitter algorithms reduce memory and compute.
          </li>
        </ul>
      </section>

      <section>
        <h2>High Cardinality and Dimensional Explosion</h2>
        <p>
          Many aggregation systems fail not because the math is hard, but because the number of groups explodes. If you
          aggregate by tenant, region, device type, app version, and error code, the number of unique combinations can
          become enormous. This increases state size (for streaming), shuffle volume (for batch), and query cost (for
          serving).
        </p>
        <p>
          The solution is to treat dimensions as a product decision, not a default. Pick a small set of “primary”
          dimensions that are essential for decisions and debugging, and push the long tail into sampled logs or
          exploratory queries rather than continuous aggregation.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Rollups:</strong> precompute aggregates at multiple granularities (for example, per service and per
            endpoint) to keep dashboards fast without storing every combination.
          </li>
          <li>
            <strong>Cardinality budgets:</strong> cap the number of distinct values for high-risk dimensions and route
            overflow into an “other” bucket.
          </li>
          <li>
            <strong>Selective enrichment:</strong> avoid attaching high-cardinality identifiers (user id, request id) to
            aggregation keys; keep them in traces/logs for drill-down instead.
          </li>
        </ul>
        <p className="mt-4">
          When you see a system with unstable costs or repeated “state too large” incidents, high cardinality is often
          the root cause. Fixing it usually requires changing what you aggregate, not just scaling the cluster.
        </p>
      </section>

      <section>
        <h2>Skew and Hot Keys</h2>
        <p>
          Skew is the most common practical aggregation failure. One key (a large tenant, a popular product, a single
          route) can dominate data volume and force one worker to do most of the work, creating tail latency and instability.
        </p>
        <p>
          Skew is a design and operational problem. Design mitigations include salting keys (split one key into many sub-keys),
          hierarchical aggregation (two-stage merge), and separating high-volume keys into dedicated pipelines. Operationally,
          you need visibility: top keys by volume and by state size.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/aggregations-diagram-2.svg"
          alt="Skew and hot key aggregation diagram"
          caption="Skew: one hot key can dominate compute and state. Mitigate with salting, hierarchical aggregation, or dedicated paths."
        />
      </section>

      <section>
        <h2>Streaming Aggregations: State, Late Data, and Corrections</h2>
        <p>
          In streaming, aggregations usually maintain incremental state. Windowing bounds the scope, but late data and
          replays still matter. If late events update a window after results were emitted, you need a correction policy:
          emit updates, emit deltas, or drop late events.
        </p>
        <p>
          Corrections push complexity to consumers. A dashboard can handle updates; a downstream billing system might not.
          This is why aggregation contracts must explicitly define finality and correction behavior.
        </p>
      </section>

      <section>
        <h2>Batch Aggregations: Shuffle Cost and Reproducibility</h2>
        <p>
          In batch, the main cost driver is shuffle: moving data across the network to group by key. Pre-aggregation and
          partitioning reduce shuffle, but the fundamental cost remains. Batch aggregation quality is also tied to
          reproducibility: given the same inputs and code, you should get the same outputs.
        </p>
        <p>
          Many “numbers changed” incidents come from non-deterministic operations or from inconsistent filtering rules
          across pipeline stages. Strong batch systems version logic and record lineage so outputs can be audited.
        </p>
      </section>

      <section>
        <h2>Operational Signals and Playbook</h2>
        <p>
          Aggregation health is measured by correctness drift and resource behavior. It is not enough that the job
          completes. The result must reconcile and remain stable under late data and retries.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Skew:</strong> top keys by volume, state size, and processing time.
          </li>
          <li>
            <strong>Freshness:</strong> output delay relative to event time and pipeline SLAs.
          </li>
          <li>
            <strong>Correction rate:</strong> how often window results are updated after emission.
          </li>
          <li>
            <strong>Resource pressure:</strong> memory usage from state, shuffle volume, and spill-to-disk rates.
          </li>
          <li>
            <strong>Reconciliation:</strong> mismatch rates against trusted totals or invariants.
          </li>
        </ul>
        <p className="mt-4">
          A practical playbook starts with identifying the failure class: skew (one hot key), late data (watermark lag),
          resource contention (shuffle/spill), or logic drift (filters/joins changed). Then it applies the appropriate
          mitigation: salting, adjusting lateness policies, adding capacity, or rerunning with corrected logic.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>
          Aggregation failures can be performance failures (job is too slow) or correctness failures (numbers are wrong).
          The most dangerous are silent correctness failures that look plausible.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/aggregations-diagram-3.svg"
          alt="Aggregation failure modes diagram"
          caption="Failure modes: hot keys, late data, replay duplicates, and non-determinism can break performance or correctness."
        />
        <ul className="mt-4 space-y-2">
          <li>Hot keys cause long tail runtimes and missed SLAs.</li>
          <li>Late data arrives after window closure, leading to undercounting or excessive corrections.</li>
          <li>Duplicates inflate counts when idempotency is missing.</li>
          <li>Non-deterministic operations produce inconsistent results on rerun.</li>
          <li>Approximation used without error bounds leads to false confidence.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A realtime dashboard shows “active users per minute” segmented by region. The pipeline uses event-time tumbling
          windows with an allowed lateness policy. During a mobile network incident, events arrive late and corrections
          spike, making the dashboard churn.
        </p>
        <p>
          The team adjusts policy: the dashboard shows provisional results quickly and marks them as provisional until the
          watermark passes. For a revenue-critical metric, they keep a longer lateness policy and run a nightly batch
          reconciliation that produces a certified “final” dataset.
        </p>
        <p>
          The system remains useful operationally (fast signals) while preserving correctness for decisions that require
          accuracy (final reporting).
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to design scalable and correct aggregations.</p>
        <ul className="mt-4 space-y-2">
          <li>Prefer decomposable aggregations with associative merges; use combiners to reduce shuffle.</li>
          <li>Decide exact vs approximate explicitly and publish error bounds for approximate results.</li>
          <li>Design for skew: detect hot keys and plan salting or hierarchical aggregation.</li>
          <li>Define late-data and correction policies for streaming; ensure consumers can handle updates.</li>
          <li>Make aggregations idempotent under retries and replays (dedupe or idempotent sinks).</li>
          <li>Validate outputs with invariants and reconciliation against trusted sources.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Show you can connect aggregation design to correctness and operations.</p>
        <ul className="mt-4 space-y-2">
          <li>Why do associative merges matter for distributed aggregations?</li>
          <li>How do you handle hot keys and skew in a group-by pipeline?</li>
          <li>When are approximate distincts or percentiles acceptable, and how do you bound error?</li>
          <li>How do late data and windowing affect aggregation correctness?</li>
          <li>How do you detect and repair silent correctness drift in aggregates?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
