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
  wordCount: 5540,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "streaming", "analytics", "correctness"],
  relatedTopics: ["stream-processing", "message-ordering", "aggregations"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Windowing</strong> is the mechanism by which stream processing systems divide an unbounded stream of
          events into bounded chunks for computation. Without windowing, a stream aggregation (for example, &quot;count of
          events&quot;) would run forever, producing a single, ever-growing result. Windowing allows the computation to
          produce finite results — for example, &quot;count of events per 5-minute window&quot; — that are meaningful and
          actionable.
        </p>
        <p>
          Windowing is essential for time-based computations on streams — hourly aggregations, moving averages, trend
          analysis, sessionization, and anomaly detection. The window defines the scope of the computation — which
          events are included in the result and which are not — and the trigger defines when the result is emitted —
          when the window is complete and the result is ready.
        </p>
        <p>
          The choice of window type (tumbling, sliding, session, global) determines the computation pattern —
          non-overlapping time buckets, overlapping time buckets, activity-based groupings, or unbounded cumulative
          computations. The choice of time semantics (event-time vs processing-time) determines whether events are
          assigned to windows based on when they occurred or when they were processed. The choice of late-data handling
          (drop, buffer, correct) determines what happens when events arrive after the window has closed.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Window Types and Their Use Cases</h3>
          <p className="mb-3">
            Tumbling windows are non-overlapping, fixed-size windows — for example, 5-minute windows that cover
            10:00-10:05, 10:05-10:10, 10:10-10:15, and so on. Each event belongs to exactly one window. Tumbling
            windows are used for hourly/daily aggregations, non-overlapping time buckets, and computations where each
            event should be counted exactly once.
          </p>
          <p className="mb-3">
            Sliding windows are overlapping, fixed-size windows with a slide interval — for example, 10-minute windows
            that slide every 5 minutes, covering 10:00-10:10, 10:05-10:15, 10:10-10:20, and so on. Each event may
            belong to multiple windows. Sliding windows are used for moving averages, trend analysis, and computations
            where the result should be updated frequently with overlapping data.
          </p>
          <p>
            Session windows are variable-size windows defined by periods of activity separated by gaps of inactivity
            — for example, a user session that starts with the first event and ends after 30 minutes of inactivity.
            Session windows are used for user sessionization, activity bursts, and variable-length groupings where the
            window size depends on the event pattern, not a fixed time interval.
          </p>
        </div>
        <p>
          Windowing introduces complexity that is not present in batch processing — late events, watermarks, triggers,
          and state cleanup. Late events (events that arrive after the window has closed) must be handled according to
          a configured policy. Watermarks track progress in event-time and determine when a window is complete.
          Triggers control when window results are emitted — on window close, periodically, or on every event. State
          cleanup ensures that window state is evicted after the window is complete, preventing unbounded state growth.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Window assignment is the process of assigning each event to one or more windows based on its event-time
          timestamp. For tumbling windows, each event is assigned to exactly one window — the window whose time range
          contains the event&apos;s timestamp. For sliding windows, each event may be assigned to multiple windows — all
          windows whose time range contains the event&apos;s timestamp. For session windows, each event is assigned to a
          session window based on the activity gap — if the event arrives within the gap of an existing session, it is
          added to that session; otherwise, a new session is started.
        </p>
        <p>
          Window state is the state maintained by the stream processor for each window — for example, the running
          count, sum, or average of events in the window. The state is updated as each event arrives in the window,
          and it is emitted when the window is complete (triggered by the watermark passing the window&apos;s end time).
          The state must be cleaned up after the window is complete and the allowed lateness period has passed, to
          prevent unbounded state growth.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/windowing-diagram-1.svg"
          alt="Four window types: tumbling (non-overlapping), sliding (overlapping), session (variable-size), and global (unbounded)"
          caption="Window types: tumbling windows are non-overlapping fixed-size buckets, sliding windows overlap for trend analysis, session windows are variable-size based on activity gaps, and global windows are unbounded for cumulative computations."
        />
        <p>
          Watermarks are the mechanism by which the stream processor tracks progress in event-time and determines
          when a window is complete. A watermark at time T indicates that all events with event-time less than or
          equal to T are expected to have arrived. When the watermark passes the end of a window, the window is
          considered complete, and the result is emitted. Events that arrive after the watermark has passed the
          window&apos;s end are considered late and handled according to the configured policy.
        </p>
        <p>
          Triggers control when window results are emitted. The default trigger emits the result when the window is
          complete (the watermark passes the window&apos;s end). Early triggers emit results before the window is complete
          — for example, every minute for a 5-minute window — providing incremental results that are updated as more
          events arrive. Late triggers emit results for late events — for example, emitting a correction when a late
          event arrives after the window has closed.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/windowing-diagram-2.svg"
          alt="Event timeline with watermark showing on-time and late events, with result emission strategies"
          caption="Window triggers and late data: events arriving before the watermark are processed normally; events arriving after the watermark are late and handled according to the configured policy (drop, buffer, or correct)."
        />
        <p>
          Allowed lateness is the period after the window closes during which late events are still processed. For
          example, if a 5-minute window closes at 10:05 and the allowed lateness is 2 minutes, late events arriving
          between 10:05 and 10:07 are still processed and used to update the window result. Events arriving after
          10:07 are dropped (or routed to a side output). Allowed lateness ensures that the window result is accurate
          even when some events arrive late, while bounding the state retention period to prevent unbounded state
          growth.
        </p>
        <p>
          State cleanup is the process of evicting window state after the window is complete and the allowed lateness
          period has passed. Without state cleanup, the stream processor would maintain state for all windows
          indefinitely, leading to unbounded state growth and eventually out-of-memory errors. State cleanup is
          triggered by the watermark — when the watermark passes the end of the window plus the allowed lateness, the
          window state is evicted.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The windowing architecture begins with the event source (Kafka, Kinesis, Pulsar) providing events with
          event-time timestamps. The stream processor assigns each event to one or more windows based on its
          timestamp and the window type (tumbling, sliding, session). The event is then processed by the windowed
          aggregation operator, which updates the window state (running count, sum, average) with the event&apos;s value.
        </p>
        <p>
          The watermark generator tracks the maximum event-time timestamp seen so far and emits watermarks at
          configured intervals (for example, every second). The watermark is computed as the maximum event-time minus
          a delay (the watermark delay), which is set based on the observed latency of events. When the watermark
          passes the end of a window, the window is considered complete, and the trigger fires, emitting the window
          result to the downstream operator.
        </p>
        <p>
          The late-data handler processes events that arrive after the watermark has passed the window&apos;s end. If the
          event is within the allowed lateness period, it is processed and used to update the window result, and a
          correction is emitted to the downstream operator. If the event is outside the allowed lateness period, it
          is dropped (or routed to a side output for analysis).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/windowing-diagram-3.svg"
          alt="Window lifecycle showing create, accumulate, trigger/emit, and cleanup stages, with detailed example of 5-minute tumbling window count"
          caption="Window lifecycle: windows are created when the first event arrives, state is accumulated as events arrive, results are emitted when the watermark passes the window end, and state is cleaned up after the allowed lateness period."
        />
        <p>
          The state manager maintains the state for each active window — the running count, sum, average, or other
          aggregation. The state is stored locally on the node where the operator runs (for fast access) and is
          checkpointed periodically to durable storage (for fault tolerance). When the window is complete and the
          allowed lateness period has passed, the state is evicted, freeing memory for new windows.
        </p>
        <p>
          The output sink writes window results to the destination (database, cache, API). The output may be
          idempotent (supporting upsert semantics, so duplicate results from late-data corrections do not create
          duplicates) or non-idempotent (requiring exactly-once processing to prevent duplicates). The stream
          processor coordinates the output write with the checkpoint commit, so that the output and the checkpoint
          are committed atomically.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Tumbling versus sliding windows is a trade-off between efficiency and granularity. Tumbling windows are
          more efficient — each event is processed exactly once, and the state is maintained for one window at a time.
          Sliding windows are less efficient — each event may be processed multiple times (once for each window it
          belongs to), and the state is maintained for multiple overlapping windows. However, sliding windows provide
          more granular results — for example, a 10-minute window sliding every 5 minutes provides a result every 5
          minutes, while a 10-minute tumbling window provides a result every 10 minutes.
        </p>
        <p>
          Session versus fixed-size windows is a trade-off between accuracy and complexity. Session windows provide
          accurate groupings based on actual activity patterns — for example, a user session that ends after 30
          minutes of inactivity. Fixed-size windows (tumbling, sliding) are simpler but may split sessions across
          windows (a session that spans a window boundary is split into two windows) or combine multiple sessions
          into one window (multiple short sessions within a window are combined). The choice depends on whether the
          computation requires accurate session groupings — if it does, session windows are necessary; if it does
          not, fixed-size windows are simpler.
        </p>
        <p>
          Event-time versus processing-time windowing is a trade-off between correctness and simplicity. Event-time
          windowing assigns events to windows based on when they occurred, which is correct for time-sensitive
          computations but requires handling out-of-order events and late data. Processing-time windowing assigns
          events to windows based on when they were processed, which is simpler but incorrect for time-sensitive
          computations. The choice depends on the computation — for time-sensitive computations, event-time is
          necessary; for non-time-sensitive computations, processing-time is simpler.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use event-time windowing for time-sensitive computations. Event-time ensures that events are assigned to
          the correct windows based on when they occurred, not when they were processed. Use watermarks to track
          progress in event-time and to handle late events. Set the watermark delay based on the observed latency of
          events — the percentile that balances accuracy (few late events) and latency (short wait time).
        </p>
        <p>
          Use tumbling windows for non-overlapping aggregations (hourly/daily counts, per-window averages) and
          sliding windows for overlapping aggregations (moving averages, trend analysis). Use session windows for
          activity-based groupings (user sessions, burst detection). Use global windows for cumulative computations
          (running totals, all-time counts) with a trigger to emit results periodically.
        </p>
        <p>
          Configure allowed lateness based on the observed latency of events — the period that captures 99 percent
          of late events. This ensures that the window result is accurate for 99 percent of cases, while bounding
          the state retention period to prevent unbounded state growth. For the remaining 1 percent of late events
          (arriving after the allowed lateness period), route them to a side output for analysis or correction.
        </p>
        <p>
          Monitor window state size and eviction rate — track the number of active windows and the rate at which
          windows are evicted, and alert when the number of active windows exceeds a defined threshold. This catches
          issues where windows are not being evicted (due to a watermark stall or a configuration error) before they
          cause out-of-memory errors.
        </p>
        <p>
          Test windowed computations under late-data conditions — simulate late events (events arriving after the
          window has closed) and verify that the window result is corrected correctly. This catches bugs in the
          late-data handling logic before they affect production data. Automated late-data testing is essential
          because windowed computations are easy to get right with on-time events but difficult to get right with
          late events.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Unbounded window state growth causing out-of-memory errors is the most common windowing failure. Window
          state is maintained for each active window, and if windows are not evicted (due to a watermark stall, a
          configuration error, or an unbounded global window), the state grows unbounded. The fix is to monitor
          window state size, configure allowed lateness to bound the state retention period, and use window cleanup
          triggers to evict state after the allowed lateness period.
        </p>
        <p>
          Watermark stall causing windows to never close is a subtle failure. If the watermark does not advance (due
          to a producer issue, a network issue, or a clock skew issue), windows never close, and results are never
          emitted. The fix is to monitor the watermark advancement rate and alert when it stalls — if the watermark
          has not advanced for a defined period, investigate the root cause and take corrective action (for example,
          manually advancing the watermark or fixing the producer).
        </p>
        <p>
          Incorrect allowed lateness causing data loss or excessive state retention is a configuration failure. If
          the allowed lateness is too short, late events are dropped, causing data loss. If the allowed lateness is
          too long, state is retained for too long, increasing memory usage and potentially causing out-of-memory
          errors. The fix is to set the allowed lateness based on the observed latency distribution — the percentile
          that captures 99 percent of late events.
        </p>
        <p>
          Processing-time instead of event-time windowing causing incorrect results for time-sensitive computations
          is a common pitfall. If the computation is time-sensitive (for example, &quot;count of events per minute&quot;), using
          processing-time will produce incorrect results when events arrive late (they will be counted in the wrong
          window). The fix is to use event-time windowing with watermarks, so that events are counted in the window
          they occurred in, not the window they were processed in.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses tumbling windows for its real-time sales dashboard, where purchase events
          are aggregated into 1-minute windows to produce real-time revenue metrics. Each purchase event is assigned
          to the 1-minute window based on its event-time timestamp, and the window result (total revenue, number of
          purchases) is emitted when the watermark passes the window&apos;s end. The dashboard displays the revenue for
          each 1-minute window, providing a real-time view of sales performance.
        </p>
        <p>
          A financial services company uses sliding windows for its anomaly detection pipeline, where transaction
          events are aggregated into 1-hour windows sliding every 5 minutes to produce moving averages of transaction
          volume and amount. Each transaction event is assigned to all 1-hour windows that contain its event-time
          timestamp, and the window result (moving average, standard deviation) is emitted every 5 minutes. The
          anomaly detection system compares the current transaction volume to the moving average, alerting when the
          volume exceeds two standard deviations above the average.
        </p>
        <p>
          A social media platform uses session windows for its user engagement pipeline, where user activity events
          (page views, clicks, comments) are grouped into session windows based on 30-minute gaps of inactivity.
          Each activity event is assigned to the user&apos;s current session window, and the session window result (session
          duration, number of activities, pages visited) is emitted when the session ends (30 minutes of inactivity).
          The engagement metrics are used to compute user engagement scores and to identify power users.
        </p>
        <p>
          An IoT platform uses global windows for its device monitoring pipeline, where sensor readings are
          aggregated into a running average for each device. Each sensor reading is added to the device&apos;s global
          window, and the running average is emitted every minute (triggered by a count-based trigger). The running
          average is used to detect device health issues — if the average exceeds a threshold, an alert is triggered.
          The global window ensures that the running average reflects all historical readings for the device, not
          just a fixed time window.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How do you choose between tumbling, sliding, and session windows?
          </h3>
          <p className="mb-3">
            Use tumbling windows for non-overlapping aggregations — for example, hourly/daily counts, per-window
            averages, or computations where each event should be counted exactly once. Tumbling windows are the most
            efficient — each event is processed exactly once, and the state is maintained for one window at a time.
          </p>
          <p className="mb-3">
            Use sliding windows for overlapping aggregations — for example, moving averages, trend analysis, or
            computations where the result should be updated frequently with overlapping data. Sliding windows are less
            efficient — each event may be processed multiple times — but they provide more granular results.
          </p>
          <p>
            Use session windows for activity-based groupings — for example, user sessions, burst detection, or
            computations where the window size depends on the event pattern, not a fixed time interval. Session
            windows are the most complex — the window size is variable and depends on the activity gap — but they
            provide accurate groupings based on actual activity patterns.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do watermarks work, and how do you set the watermark delay?
          </h3>
          <p className="mb-3">
            A watermark at time T indicates that all events with event-time less than or equal to T are expected to
            have arrived. The watermark is computed based on the observed event-time timestamps — for example, the
            maximum event-time seen so far minus a delay (the watermark delay). Events that arrive with event-time
            less than or equal to the watermark are processed normally. Events that arrive with event-time greater
            than the watermark are considered late and handled according to the configured policy.
          </p>
          <p className="mb-3">
            The watermark delay is set based on the observed latency of events — the time between when an event is
            produced and when it arrives at the consumer. If 99 percent of events arrive within 5 seconds of their
            event-time, the watermark delay can be set to 5 seconds. This ensures that 99 percent of events are
            processed normally, and only 1 percent are treated as late events.
          </p>
          <p>
            Setting the watermark delay too low causes many events to be treated as late, leading to data loss or
            expensive reprocessing. Setting it too high causes the system to wait longer before emitting window
            results, increasing latency. The optimal delay is based on the observed latency distribution — the
            percentile that balances accuracy (few late events) and latency (short wait time).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: How do you handle late events in windowed computations?
          </h3>
          <p className="mb-3">
            Late events are handled according to the configured policy. The options are: drop the late event
            (simplest but loses data), buffer the late event and reprocess the affected window (accurate but
            expensive), accept the late event and emit a correction (accurate but complex), or apply the late event
            idempotently (correct if the update is idempotent).
          </p>
          <p className="mb-3">
            The recommended approach is to use allowed lateness — a period after the window closes during which late
            events are still processed and used to update the window result. The allowed lateness is set based on the
            observed latency of events — the period that captures 99 percent of late events. Events arriving after
            the allowed lateness period are routed to a side output for analysis or dropped.
          </p>
          <p>
            For computations that require accurate results, the late event should be processed and a correction should
            be emitted to the downstream operator. The correction updates the previously emitted window result with
            the late event&apos;s contribution. For computations that can tolerate some inaccuracy, the late event can be
            dropped or routed to a side output for analysis.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you prevent unbounded window state growth?
          </h3>
          <p className="mb-3">
            Unbounded window state growth occurs when windows are not evicted — due to a watermark stall, a
            configuration error, or an unbounded global window. The fix is to configure allowed lateness to bound the
            state retention period, monitor window state size and eviction rate, and use window cleanup triggers to
            evict state after the allowed lateness period.
          </p>
          <p className="mb-3">
            The watermark should advance regularly — if it stalls, windows never close and state is never evicted.
            Monitor the watermark advancement rate and alert when it stalls — if the watermark has not advanced for
            a defined period, investigate the root cause (producer issue, network issue, clock skew) and take
            corrective action.
          </p>
          <p>
            For global windows (unbounded windows that never close), use a trigger to emit results periodically (for
            example, every minute or every N events) and use a cleanup trigger to evict state after a defined period
            (for example, evict state for keys that have not been seen in 24 hours). This ensures that global windows
            do not grow unbounded, even though they never close.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: How do you test windowed computations under late-data conditions?
          </h3>
          <p className="mb-3">
            Testing windowed computations under late-data conditions requires simulating late events — events that
            arrive after the window has closed — and verifying that the window result is corrected correctly. The
            test should generate a stream of on-time events (events arriving before the watermark) and late events
            (events arriving after the watermark), and verify that the window result is emitted correctly for on-time
            events and corrected correctly for late events.
          </p>
          <p className="mb-3">
            The test should cover the following scenarios: late events within the allowed lateness period (should be
            processed and used to update the window result), late events outside the allowed lateness period (should
            be dropped or routed to a side output), and multiple late events arriving in quick succession (should be
            processed and used to update the window result multiple times).
          </p>
          <p>
            Automated late-data testing is essential because windowed computations are easy to get right with on-time
            events but difficult to get right with late events. The test should be run as part of the CI/CD pipeline,
            catching bugs in the late-data handling logic before they affect production data.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Akidau et al., &quot;The Dataflow Model&quot;</strong> — Google&apos;s paper on windowing,
            event-time processing, watermarks, and late data handling. Proceedings of the VLDB Endowment, 2015.{' '}
            <a
              href="https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vldb.org/pvldb/vol8/p1792-Akidau
            </a>
          </li>
          <li>
            <strong>Apache Flink Documentation — Windowing</strong> — Covers window types, triggers, watermarks, and
            late data handling in Flink.{' '}
            <a
              href="https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/operators/windows/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              nightlies.apache.org/flink/flink-docs-stable
            </a>
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapter on stream processing covering
            windowing, event-time, and state management. O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Akidau et al., &quot;MillWheel: Fault-Tolerant Stream Processing at Internet Scale&quot;</strong>
            — Google&apos;s stream processing system that introduced watermarks and late data handling. OSDI 2013.
          </li>
          <li>
            <strong>Apache Beam Documentation — Windowing</strong> — Covers windowing concepts that apply across
            stream processing frameworks (Flink, Spark, Dataflow).{' '}
            <a
              href="https://beam.apache.org/documentation/programming-guide/#windowing"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              beam.apache.org/documentation/programming-guide/#windowing
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}