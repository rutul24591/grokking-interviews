"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-windowing-extensive",
  title: "Windowing",
  description:
    "Turn infinite event streams into finite computations with clear time semantics, late-data policies, and bounded state.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "windowing",
  wordCount: 1175,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "streaming", "analytics", "correctness"],
  relatedTopics: ["stream-processing", "message-ordering", "aggregations"],
};

export default function WindowingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Finite Results from Infinite Streams</h2>
        <p>
          <strong>Windowing</strong> groups an unbounded event stream into bounded sets so you can compute aggregates:
          counts per minute, unique users per hour, average latency per 5 minutes, or sessions per user. Windowing is the
          bridge between “events arrive forever” and “we need numbers now.”
        </p>
        <p>
          Windowing is not just a formatting choice. It is a correctness and operational contract. The moment you define
          a window, you must also define time semantics (event time vs processing time), late-data behavior (drop vs
          correct), and state bounds (how long you keep partial results).
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Windowing Forces Explicit Choices</h3>
          <ul className="space-y-2">
            <li>When do results become “final”?</li>
            <li>How do you handle events that arrive late or out of order?</li>
            <li>Do you emit corrections and retractions, or only best-effort results?</li>
            <li>How do you keep state bounded so the system remains operable?</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Window Types and What They Mean</h2>
        <p>
          Window types represent different business questions. The best type is the one that matches the user’s mental
          model of the metric.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/windowing-diagram-1.svg"
          alt="Window types diagram: tumbling, sliding, and session windows"
          caption="Window types: tumbling (fixed buckets), sliding (overlapping), and session (activity gaps) capture different questions."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Tumbling windows:</strong> fixed, non-overlapping buckets (per minute, per hour). Simple and efficient.
          </li>
          <li>
            <strong>Sliding windows:</strong> overlapping windows (last 10 minutes updated every minute). Smoother signals
            but higher compute/state.
          </li>
          <li>
            <strong>Session windows:</strong> groups events by inactivity gaps (user sessions). Great for behavior
            analytics, harder to operate.
          </li>
        </ul>
        <p className="mt-4">
          Tumbling windows are a strong default for operational dashboards because they are stable and easy to reason
          about. Sliding windows are often used when you want responsiveness without step-like charts. Session windows
          require careful definitions of “inactivity” and often need domain-specific tuning.
        </p>
      </section>

      <section>
        <h2>Time Semantics: Event Time vs Processing Time</h2>
        <p>
          Windowing depends on time, so you must define which time. <strong>Processing time</strong> windows are based on
          when the processor sees the event. They are simpler but sensitive to ingestion delays. <strong>Event time</strong>{" "}
          windows are based on when the event occurred at the source. They are typically more correct for analytics but
          require late-data handling.
        </p>
        <p>
          Many “why are my numbers wrong” incidents come from using processing time when the business expects event time.
          If ingestion is delayed by 20 minutes, processing-time windows will shift counts into the wrong bucket.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Choosing the Time Model</h3>
          <ul className="space-y-2">
            <li>Use event time for analytics correctness and historical comparability.</li>
            <li>Use processing time for operational signals where “now” matters more than exact timestamp accuracy.</li>
            <li>Document the model in the metric contract; ambiguity creates organizational confusion.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Watermarks and Allowed Lateness</h2>
        <p>
          Late events are normal. Networks delay events, mobile devices buffer, and retry logic replays. Watermarks are a
          mechanism to estimate completeness: “we believe we have seen most events up to time T.” Once the watermark
          passes the end of a window, the system can emit a result as complete, while still allowing late events within an
          allowed lateness policy.
        </p>
        <p>
          Allowed lateness is a business trade-off. A short allowed lateness yields low-latency results but drops late
          events or requires corrections that may be surprising. A long allowed lateness increases accuracy but increases
          state size and delays finality.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/windowing-diagram-2.svg"
          alt="Watermark and allowed lateness diagram"
          caption="Watermarks define completeness. Allowed lateness defines whether late events correct prior results or are dropped."
        />
        <p className="mt-4">
          Many systems also define triggers: emit intermediate results early (speculative) and then emit a final result
          when the watermark passes. This improves responsiveness but requires consumers to handle updates and
          retractions.
        </p>
      </section>

      <section>
        <h2>Corrections, Retractions, and Consumer Contracts</h2>
        <p>
          Windowed results can be emitted as final-only or as update streams. If you allow late data to correct results,
          you need a contract for how corrections are represented: update the value for a window, emit a delta, or emit a
          retraction plus replacement.
        </p>
        <p>
          This is not a detail. It determines whether downstream systems can handle changes. A dashboard might handle
          corrections fine. A billing system might not. If downstream consumers cannot handle corrections, your windowing
          policy must either drop late events or route them to a separate correction channel.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Final-only:</strong> simple consumers, but less accurate under lateness.
          </li>
          <li>
            <strong>Upserts by window id:</strong> consumers must accept repeated updates for the same window key.
          </li>
          <li>
            <strong>Deltas:</strong> consumers apply increments; easier for some stores, harder for analytics correctness.
          </li>
        </ul>
      </section>

      <section>
        <h2>State Management and Scaling</h2>
        <p>
          Windowing is stateful. Open windows require stored partial aggregates. Sliding windows and session windows can
          multiply state significantly. State must be bounded, compacted, and recoverable after failure.
        </p>
        <p>
          Scaling requires consistent keying. If windows are keyed by user id, then one “hot user” can create a hotspot.
          If windows are keyed by region and route, you may have fewer keys but larger aggregates. Key design is both a
          performance and correctness decision.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">State Growth Controls</h3>
          <ul className="space-y-2">
            <li>TTL and cleanup policies for window state.</li>
            <li>Bounded allowed lateness to limit how long windows stay open.</li>
            <li>Compaction strategies for large keyed state.</li>
            <li>Backpressure when state store or sinks slow down.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Operational Failure Modes</h2>
        <p>
          Windowing issues often show up as “numbers don’t match” or “results are late.” Because the failures are often
          correctness failures, observability and reconciliation matter as much as throughput.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/windowing-diagram-3.svg"
          alt="Windowing failure modes diagram"
          caption="Failure modes: incorrect time semantics, watermark drift, late data bursts, and unbounded state can break correctness or freshness."
        />
        <ul className="mt-4 space-y-2">
          <li>Incorrect time model shifts counts into wrong windows (processing time used when event time expected).</li>
          <li>Watermark drift causes windows to close too early or too late.</li>
          <li>Late-data bursts trigger excessive corrections and downstream churn.</li>
          <li>State grows without bounds, causing memory pressure and slow recovery.</li>
          <li>Backfills replay old data and invalidate assumptions about lateness.</li>
        </ul>
        <p className="mt-4">
          Practical signals include lateness distribution, correction rate, watermark lag, and state size. If watermark
          lag grows, your outputs are becoming stale. If correction rate spikes, downstream consumers may become unstable.
        </p>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A realtime dashboard shows signups per minute. The business expects signups to be attributed to the time the
          user completed the signup, not the time the event was ingested. The pipeline uses event-time tumbling windows
          with an allowed lateness policy based on observed ingestion delays.
        </p>
        <p>
          During an incident, ingestion delays increase and late events arrive outside the usual bound. Watermark lag
          grows and correction rate spikes. Responders increase allowed lateness temporarily to preserve accuracy and add a
          visual “data delayed” indicator to the dashboard. They later fix the ingestion bottleneck and tighten policies
          again.
        </p>
        <p>
          The lesson is that windowing is an end-to-end contract: time model, lateness, and consumer behavior must be
          aligned, and operations must be able to see when assumptions break.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when designing windowed computations.</p>
        <ul className="mt-4 space-y-2">
          <li>Choose the time model explicitly and document it in metric contracts.</li>
          <li>Select window type to match the question (tumbling, sliding, session) and validate state cost.</li>
          <li>Define watermarks and allowed lateness based on observed arrival patterns and business tolerance.</li>
          <li>Decide how corrections are represented (final-only vs updates) and ensure consumers can handle them.</li>
          <li>Bound state growth with TTL and cleanup policies; monitor state size and recovery time.</li>
          <li>Instrument lateness distribution, watermark lag, and correction rate for early warning.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Show you can reason about time and correctness, not just definitions.</p>
        <ul className="mt-4 space-y-2">
          <li>What is the difference between event time and processing time, and why does it matter?</li>
          <li>How do watermarks and allowed lateness affect result accuracy and latency?</li>
          <li>What is the operational cost of sliding and session windows compared to tumbling windows?</li>
          <li>How do you represent corrections to windowed results and what do consumers need to support?</li>
          <li>Describe a real failure mode where windowing produced wrong numbers and how you would detect it.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

