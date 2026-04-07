"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-stream-processing-extensive",
  title: "Stream Processing",
  description:
    "Process events continuously with explicit semantics for time, state, and failures so results remain correct under late data and retries.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "stream-processing",
  wordCount: 5560,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "streaming", "pipelines", "correctness"],
  relatedTopics: ["batch-processing", "windowing", "message-ordering", "exactly-once-semantics"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Stream processing</strong> is the continuous computation on unbounded streams of events, where
          results are produced incrementally as events arrive, rather than periodically on bounded datasets as in batch
          processing. Stream processing is used for real-time analytics, fraud detection, alerting, event-driven
          microservices, and any use case where results must be available within seconds or milliseconds of the events
          that trigger them.
        </p>
        <p>
          The fundamental challenge of stream processing is that the data is unbounded — it has no end — so the
          computation must run continuously, maintaining state as events arrive and producing results incrementally.
          This is fundamentally different from batch processing, where the computation starts with a bounded dataset,
          processes it to completion, and terminates. Stream processing requires mechanisms for state management, fault
          tolerance, and time semantics (event-time vs processing-time) that are not needed in batch processing.
        </p>
        <p>
          Stream processing engines (Apache Flink, Kafka Streams, Spark Streaming) provide the infrastructure for
          continuous computation — they handle event ingestion, state management, fault tolerance, and result output.
          The user defines the computation as a graph of operators (filter, map, aggregate, join), and the engine
          executes the graph continuously, processing events as they arrive and updating results incrementally.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Stream Processing vs Batch Processing</h3>
          <p className="mb-3">
            Stream processing processes events as they arrive, producing results continuously with low latency
            (seconds to milliseconds). Batch processing processes bounded datasets periodically, producing results in
            bulk with higher latency (minutes to hours). Stream processing is stateful — it maintains running state
            (aggregations, windowed counts, join buffers) that is updated as each event arrives. Batch processing is
            typically stateless — each batch run starts from scratch and processes the entire dataset.
          </p>
          <p>
            The choice between stream and batch processing depends on the latency requirements. If results must be
            available within seconds or milliseconds of the events that trigger them, stream processing is necessary.
            If results can tolerate minutes or hours of latency, batch processing is simpler and more cost-effective.
            Many organizations use both — stream processing for real-time results and batch processing for accurate
            historical recomputation (Lambda Architecture) or reprocessing through a single stream processor (Kappa
            Architecture).
          </p>
        </div>
        <p>
          The evolution of stream processing has progressed through three generations. First-generation systems
          (Apache Storm) processed events one at a time with at-least-once or at-most-once semantics, providing low
          latency but no exactly-once guarantees. Second-generation systems (Spark Streaming) processed events in
          micro-batches, providing exactly-once semantics but higher latency (bounded by the batch interval).
          Third-generation systems (Apache Flink, Kafka Streams) provide continuous processing with exactly-once
          semantics and low latency, combining the best of both worlds.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Stateful operators are the core of stream processing. Unlike stateless operators (filter, map) that process
          each event independently, stateful operators (aggregate, join, windowed count) maintain state across events.
          For example, a streaming aggregation operator maintains a running count or sum, updating it as each event
          arrives. A streaming join operator maintains a buffer of events from each stream, joining them as matching
          events arrive. The state must be managed carefully — it must be stored durably (for fault tolerance),
          accessed efficiently (for low latency), and cleaned up when it is no longer needed (to prevent unbounded
          growth).
        </p>
        <p>
          Time semantics is the most complex concept in stream processing. There are two notions of time: event-time
          (the time the event occurred, as recorded by the producer) and processing-time (the time the event is
          processed by the stream processor). Event-time is the correct notion of time for most computations — for
          example, a &quot;count of events per minute&quot; should count events by the minute they occurred, not the minute
          they were processed. However, event-time processing is complicated by out-of-order events — events may
          arrive late due to network delays, clock skew, or retries.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/stream-processing-diagram-1.svg"
          alt="Stream processing architecture showing event source, processing operators (filter/map, windowed aggregate, join/enrich), and output sink with state management"
          caption="Stream processing: events flow continuously from the source through stateless and stateful operators, producing results incrementally. State is managed locally and checkpointed for fault tolerance."
        />
        <p>
          Watermarks are the mechanism by which stream processors track progress in event-time. A watermark at time T
          indicates that all events with event-time less than or equal to T are expected to have arrived. The
          watermark is computed based on the observed event-time timestamps — for example, the maximum event-time seen
          so far minus a delay. Events that arrive with event-time less than or equal to the watermark are processed
          normally. Events that arrive with event-time greater than the watermark are considered late and handled
          according to the configured policy (drop, buffer, or correct).
        </p>
        <p>
          Windows are the mechanism by which stream processors divide the unbounded stream into bounded chunks for
          computation. A window defines a range of event-time (for example, 10:00 to 10:05), and the stream processor
          computes the result for that window (for example, the count of events in that window). There are several
          types of windows: tumbling windows (non-overlapping, fixed-size), sliding windows (overlapping, fixed-size
          with a slide interval), and session windows (variable-size, defined by periods of activity separated by
          gaps).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/stream-processing-diagram-2.svg"
          alt="Stateful operator processing and checkpointing showing events flowing through operator with state store, and checkpoint timeline with failure and recovery"
          caption="Stateful operators maintain running state that is updated per event. Checkpointing periodically saves state to durable storage, enabling recovery from failures by restoring from the latest checkpoint."
        />
        <p>
          Fault tolerance in stream processing is achieved through checkpointing — periodically saving the state of
          all operators to durable storage (HDFS, S3). If a task fails, it is re-executed on another node, and its
          state is restored from the latest checkpoint. The stream processor also rewinds the input stream to the
          offset corresponding to the checkpoint, so that events processed after the checkpoint are reprocessed. This
          ensures that the recovered task produces the same results as if it had not failed.
        </p>
        <p>
          Exactly-once semantics in stream processing ensures that each event is processed exactly once, even in the
          face of failures. This is achieved through a combination of idempotent producers (which prevent duplicate
          writes to the input stream), checkpointing (which captures the state at a point in time), and transactional
          output writes (which ensure that the output and the checkpoint are committed atomically). Exactly-once
          semantics is essential for use cases where data loss or duplication has financial or correctness consequences
          — billing, fraud detection, and compliance reporting.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The stream processing architecture consists of the event source (Kafka, Kinesis, Pulsar), the stream
          processor (Flink, Kafka Streams, Spark Streaming), and the output sink (database, cache, API). Events flow
          continuously from the source through the processor&apos;s operators (filter, map, aggregate, join) to the sink,
          where results are stored or served to consumers.
        </p>
        <p>
          The stream processor executes the computation as a directed graph of operators. Each operator processes
          events from its input stream and produces events on its output stream. Stateless operators (filter, map)
          process each event independently, while stateful operators (aggregate, join) maintain state across events.
          The graph is partitioned for parallelism — each operator has multiple parallel instances, each processing a
          subset of the events.
        </p>
        <p>
          State management is a critical component of the stream processor&apos;s architecture. State is stored locally on
          the node where the operator runs (for fast access), and it is checkpointed periodically to durable storage
          (for fault tolerance). The state store is typically RocksDB (an embedded key-value store) for large state,
          or in-memory hash maps for small state. The state is partitioned by key — each operator instance manages
          the state for a subset of keys — so that state access is local and does not require network transfer.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/stream-processing-diagram-3.svg"
          alt="Decision tree for choosing stream vs batch processing based on latency requirements and data volume"
          caption="Choosing stream vs batch: if latency must be seconds or less, use stream processing. If minutes to hours are acceptable, use batch processing. Hybrid approaches (Lambda, Kappa) combine both."
        />
        <p>
          Checkpointing is the mechanism by which the stream processor achieves fault tolerance. Periodically (every
          30-60 seconds), the processor coordinates all operators to snapshot their state to durable storage. The
          checkpoint includes the state of all operators and the current offset in the input stream. If a task fails,
          it is re-executed on another node, and its state is restored from the latest checkpoint. The input stream
          is rewound to the offset corresponding to the checkpoint, so that events processed after the checkpoint are
          reprocessed.
        </p>
        <p>
          The output sink writes results to the destination (database, cache, API). The sink may be idempotent
          (supporting upsert semantics, so duplicate writes do not create duplicates) or non-idempotent (requiring
          exactly-once processing to prevent duplicates). The stream processor coordinates the output write with the
          checkpoint commit, so that the output and the checkpoint are committed atomically — either both are
          committed or neither is. This ensures that the output is consistent with the checkpoint, even in the face
          of failures.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Stream processing versus batch processing is the primary trade-off between latency and complexity. Stream
          processing provides low latency (results available within seconds or milliseconds) but requires complex
          mechanisms for state management, fault tolerance, and time semantics. Batch processing provides higher
          latency (results available after minutes or hours) but is simpler — the computation starts with a bounded
          dataset, processes it to completion, and terminates. The choice depends on the latency requirements — if
          results must be available within seconds, stream processing is necessary. If results can tolerate minutes or
          hours, batch processing is simpler and more cost-effective.
        </p>
        <p>
          Continuous processing versus micro-batch processing is a trade-off within stream processing. Continuous
          processing (Flink, Kafka Streams) processes events one at a time, providing the lowest latency (milliseconds)
          but requiring complex state management and exactly-once mechanisms. Micro-batch processing (Spark Streaming)
          processes events in small batches (seconds), providing higher latency but simpler state management (each
          batch is a small batch job, with the same fault tolerance mechanisms as batch processing). The choice depends
          on the latency requirements — if milliseconds are required, continuous processing is necessary. If seconds
          are acceptable, micro-batch processing is simpler.
        </p>
        <p>
          Event-time versus processing-time is a trade-off between correctness and simplicity. Event-time processing
          produces correct results based on when events occurred, but it requires handling out-of-order events and
          late data. Processing-time processing produces results based on when events were processed, which is simpler
          but incorrect for time-sensitive computations (for example, &quot;count of events per minute&quot; should count by
          the minute they occurred, not the minute they were processed). The choice depends on the computation — for
          time-sensitive computations, event-time is necessary. For non-time-sensitive computations, processing-time
          is simpler.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use event-time processing for time-sensitive computations. Event-time ensures that results are based on
          when events occurred, not when they were processed. Use watermarks to track progress in event-time and to
          handle late events. Set the watermark delay based on the observed latency of events — the percentile that
          balances accuracy (few late events) and latency (short wait time).
        </p>
        <p>
          Design stateful operators to be idempotent whenever possible. Idempotent operators produce the same result
          when reprocessing events (due to failures or retries), which simplifies fault tolerance. For example,
          setting a value (SET count = N) is idempotent, while incrementing a value (count += 1) is not — if the
          increment is applied twice, the result is incorrect.
        </p>
        <p>
          Monitor state size and checkpoint duration — track the size of each operator&apos;s state and the duration of
          each checkpoint, and alert when they exceed defined thresholds. Large state sizes can cause out-of-memory
          errors, and long checkpoint durations can increase recovery time after failures. Optimize state size by
          using efficient state representations (for example, using HyperLogLog for distinct counts instead of storing
          all unique values).
        </p>
        <p>
          Use side outputs for late events — instead of dropping late events or reprocessing the affected window,
          emit late events to a side output where they can be processed separately. This allows the main computation
          to proceed without waiting for late events, while still capturing late events for analysis or correction.
        </p>
        <p>
          Test stream processing computations under failure conditions — simulate task failures, network partitions,
          and clock skew, and verify that the results are correct (no loss, no duplication, correct ordering).
          Automated failure testing is essential because stream processing is easy to get right in the happy path
          but difficult to get right under failures.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Unbounded state growth causing out-of-memory errors is the most common stream processing failure. Stateful
          operators maintain state across events, and if the state is not cleaned up when it is no longer needed, it
          grows unbounded. For example, a streaming join operator maintains a buffer of events from each stream, and
          if the join condition is never satisfied, the buffer grows indefinitely. The fix is to use windowed joins
          (with a time bound on the buffer) or to evict events from the buffer when they are older than a defined
          threshold.
        </p>
        <p>
          Processing-time instead of event-time causing incorrect results for time-sensitive computations is a subtle
          pitfall. If the computation is time-sensitive (for example, &quot;count of events per minute&quot;), using
          processing-time will produce incorrect results when events arrive late (they will be counted in the wrong
          minute). The fix is to use event-time processing with watermarks, so that events are counted in the minute
          they occurred, not the minute they were processed.
        </p>
        <p>
          Not handling late events causing data loss is a common failure. When late events arrive (events with
          event-time timestamps earlier than the current watermark), the default behavior is to drop them. If the
          computation requires accurate results, late events must be handled — either by buffering them and
          reprocessing the affected window, or by accepting them and emitting a correction. The fix is to configure a
          late event handling policy and to implement it consistently across all operators.
        </p>
        <p>
          Checkpoint duration exceeding the checkpoint interval causing checkpoint overlap is a performance failure.
          If the checkpoint takes longer than the checkpoint interval, checkpoints overlap, causing multiple
          checkpoints to run concurrently, which increases resource usage and can cause the processor to fall behind.
          The fix is to increase the checkpoint interval, optimize the state size (use efficient state
          representations), or increase the checkpoint throughput (use incremental checkpointing).
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A financial services company uses stream processing for its fraud detection pipeline, where transaction
          events are processed in real-time to produce risk scores for each transaction. The stream processor maintains
          a rolling 30-day history of each customer&apos;s transaction pattern, updating the risk score as each new
          transaction arrives. The pipeline uses event-time processing with watermarks to handle late transactions, and
          exactly-once semantics to ensure that each transaction is scored exactly once. The risk scores are written to
          a database where the fraud detection system queries them in real-time to approve or reject transactions.
        </p>
        <p>
          A large e-commerce platform uses stream processing for its real-time analytics pipeline, where user activity
          events (page views, clicks, purchases) are processed to produce real-time engagement metrics. The stream
          processor computes windowed aggregations (page views per minute, per user, per product) and writes the
          results to a time-series database for dashboards. The pipeline uses tumbling windows (1-minute windows) for
          real-time metrics and sliding windows (5-minute windows with 1-minute slides) for trend analysis.
        </p>
        <p>
          A technology company uses stream processing for its monitoring pipeline, where system metrics (CPU, memory,
          network) are processed to produce real-time health scores. The stream processor computes moving averages and
          anomaly scores for each metric, alerting when the anomaly score exceeds a defined threshold. The pipeline
          uses session windows (defined by periods of normal activity separated by anomalies) to group related metrics
          into incidents, reducing alert fatigue by grouping multiple anomalies into a single incident.
        </p>
        <p>
          An IoT platform uses stream processing for its device monitoring pipeline, where IoT sensor readings are
          processed to produce real-time device health scores. The stream processor joins sensor readings with device
          metadata (stream-table join) to enrich the readings with device context, and it computes rolling averages
          and thresholds for each device. The pipeline uses event-time processing to handle late readings (due to
          network delays in remote locations), and it uses side outputs to capture late readings for analysis.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: What is the difference between event-time and processing-time, and when would you use each?
          </h3>
          <p className="mb-3">
            Event-time is the time the event occurred, as recorded by the producer. Processing-time is the time the
            event is processed by the stream processor. Event-time is the correct notion of time for most computations
            — for example, a &quot;count of events per minute&quot; should count events by the minute they occurred, not the
            minute they were processed. Processing-time is simpler but incorrect for time-sensitive computations,
            because it is affected by network delays, clock skew, and processing delays.
          </p>
          <p className="mb-3">
            Use event-time for time-sensitive computations (aggregations by time, anomaly detection, sessionization)
            where the result depends on when events occurred. Use processing-time for non-time-sensitive computations
            (filtering, enrichment, routing) where the result does not depend on when events occurred. Event-time
            processing requires handling out-of-order events and late data (through watermarks), while processing-time
            processing does not.
          </p>
          <p>
            In practice, most stream processing computations use event-time, because the results are expected to
            reflect the actual timeline of events. Processing-time is used for operational monitoring (for example,
            &quot;how many events are we processing per second&quot;), where the result reflects the current processing rate,
            not the event timeline.
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
            Question 3: How do stream processors achieve fault tolerance, and what happens when a task fails?
          </h3>
          <p className="mb-3">
            Stream processors achieve fault tolerance through checkpointing — periodically saving the state of all
            operators to durable storage (HDFS, S3). The checkpoint includes the state of all operators and the
            current offset in the input stream. If a task fails, it is re-executed on another node, and its state is
            restored from the latest checkpoint. The input stream is rewound to the offset corresponding to the
            checkpoint, so that events processed after the checkpoint are reprocessed.
          </p>
          <p className="mb-3">
            The checkpoint is coordinated across all operators to ensure consistency — all operators checkpoint their
            state at the same point in the stream, so that the recovered state is consistent with the input offset.
            The checkpoint interval is configurable — more frequent checkpoints reduce the recovery time (less
            reprocessing after a failure) but add overhead (more frequent writes to durable storage). The recommended
            checkpoint interval is 30-60 seconds for most workloads.
          </p>
          <p>
            Exactly-once semantics is achieved by coordinating the checkpoint with the output write — the output and
            the checkpoint are committed atomically, so that either both are committed or neither is. This ensures
            that the output is consistent with the checkpoint, even in the face of failures. If the output is
            idempotent (supporting upsert semantics), exactly-once semantics is simpler — the output can be written
            multiple times without creating duplicates.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you handle unbounded state growth in stream processing?
          </h3>
          <p className="mb-3">
            Unbounded state growth occurs when a stateful operator maintains state that is never cleaned up. For
            example, a streaming join operator maintains a buffer of events from each stream, and if the join
            condition is never satisfied, the buffer grows indefinitely. A streaming aggregation operator maintains a
            running count for each key, and if new keys are constantly added, the state grows indefinitely.
          </p>
          <p className="mb-3">
            The fix is to use windowed state — state that is scoped to a time window and cleaned up when the window
            closes. For example, a windowed join joins events within a time window (for example, 1 hour), and it
            evicts events from the buffer when they are older than the window. A windowed aggregation computes the
            result for each window, and it evicts the state when the window closes.
          </p>
          <p>
            For state that cannot be windowed (for example, a running count for each key), the fix is to use efficient
            state representations (for example, using HyperLogLog for distinct counts instead of storing all unique
            values) or to evict keys that have not been seen for a defined period (for example, evict keys that have
            not been seen in 24 hours). The state size should be monitored and alerted on, so that unbounded growth is
            detected before it causes out-of-memory errors.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: When would you choose stream processing over batch processing, and vice versa?
          </h3>
          <p className="mb-3">
            Choose stream processing when results must be available within seconds or milliseconds of the events that
            trigger them — for example, fraud detection (transactions must be scored in real-time), alerting (anomalies
            must be detected immediately), and real-time dashboards (metrics must be updated continuously). Stream
            processing is also appropriate when the computation is inherently continuous — for example, sessionization
            (grouping events into sessions as they arrive) or stream-stream joins (joining events from two streams as
            they arrive).
          </p>
          <p className="mb-3">
            Choose batch processing when results can tolerate minutes or hours of latency — for example, daily
            reports, ETL pipelines, and historical analysis. Batch processing is simpler and more cost-effective for
            large-scale computations that do not require low latency. It is also appropriate when the computation is
            inherently batch — for example, iterative machine learning (where each iteration depends on the previous
            one) or graph processing (where the entire graph must be loaded into memory).
          </p>
          <p>
            In practice, many organizations use both — stream processing for real-time results and batch processing
            for accurate historical recomputation (Lambda Architecture) or reprocessing through a single stream
            processor (Kappa Architecture). This combines the low latency of stream processing with the accuracy and
            efficiency of batch processing.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Akidau et al., &quot;The Dataflow Model&quot;</strong> — Google&apos;s paper on event-time
            processing, watermarks, and late data handling. Proceedings of the VLDB Endowment, 2015.{' '}
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
            <strong>Apache Flink Documentation</strong> — Covers stateful stream processing, event-time, watermarks,
            checkpointing, and exactly-once semantics.{' '}
            <a
              href="https://nightlies.apache.org/flink/flink-docs-stable/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              nightlies.apache.org/flink/flink-docs-stable
            </a>
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapter on stream processing covering
            event-time, state management, and fault tolerance. O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Kreps, &quot;Questioning the Lambda Architecture&quot;</strong> — Discussion of stream processing
            as a replacement for batch processing and the Kappa Architecture. O&apos;Reilly Radar, 2014.
          </li>
          <li>
            <strong>Carbone et al., &quot;Apache Flink: Stream and Batch Processing in a Single Engine&quot;</strong>
            — The Flink paper describing the architecture and execution model. IEEE Data Engineering Bulletin, 2015.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}