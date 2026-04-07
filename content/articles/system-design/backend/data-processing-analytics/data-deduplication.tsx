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
  wordCount: 5520,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "deduplication", "correctness", "pipelines"],
  relatedTopics: ["exactly-once-semantics", "message-ordering", "stream-processing", "batch-processing"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Data deduplication</strong> is the process of identifying and removing duplicate records from a
          dataset, ensuring that each unique entity appears exactly once in the output. In data-intensive systems,
          duplicates are not anomalies — they are inevitable. They arise from producer retries after transient failures,
          pipeline replays for bug fixes, out-of-order event delivery, multiple ingestion paths (the same event arriving
          via both an API and a CDC connector), and consumer group rebalances in message brokers. Without deduplication,
          these duplicates inflate counts, distort aggregates, and produce silently incorrect analytical results.
        </p>
        <p>
          The fundamental challenge of deduplication is defining identity: what makes two records &quot;the same&quot;?
          For some datasets, identity is straightforward — a primary key in a database table uniquely identifies a row,
          and two rows with the same primary key are duplicates. For other datasets, identity is ambiguous — two events
          with the same user ID and timestamp but different payload fields may be duplicates (the same event received
          twice with slightly different metadata) or distinct events (two separate actions by the same user at the same
          time). The deduplication strategy depends critically on how identity is defined, and getting this definition
          wrong is the most common source of deduplication errors.
        </p>
        <p>
          Deduplication operates at different levels of the data pipeline. At the ingestion level, deduplication
          prevents the same event from being written to the pipeline&apos;s working storage multiple times due to producer
          retries or multiple ingestion paths. At the processing level, deduplication removes duplicates that arise
          from pipeline replays, out-of-order delivery, or consumer group rebalances. At the output level,
          deduplication ensures that the published results contain each unique entity exactly once, regardless of how
          many times it appeared in the input.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Defining Record Identity</h3>
          <p className="mb-3">
            Record identity for deduplication is typically defined by one of three approaches. The first is a primary
            key or unique identifier explicitly assigned by the source system — a database primary key, an order ID,
            or a user ID combined with a timestamp. This is the most reliable approach because the source system
            guarantees uniqueness.
          </p>
          <p className="mb-3">
            The second approach is a content-based hash — computing a cryptographic hash (SHA-256 or xxHash) of the
            record&apos;s content and using the hash as the deduplication key. This approach identifies exact duplicates
            (records with identical content) but not semantic duplicates (records that represent the same real-world
            entity but with different content, such as an updated version of the same record).
          </p>
          <p>
            The third approach is a composite key constructed from multiple fields — for example, the combination of
            user ID, event type, and event timestamp. This approach is more flexible than a single primary key but
            requires careful design to avoid false positives (two different records with the same composite key) and
            false negatives (two duplicate records with different composite keys due to clock skew or field variations).
          </p>
        </div>
        <p>
          Deduplication can be exact or probabilistic. Exact deduplication maintains a complete record of all seen
          keys (typically in a hash set or database index) and definitively identifies duplicates. This approach is
          100 percent correct but requires unbounded memory — the deduplication state grows with the number of unique
          keys, which can reach billions for high-volume pipelines. Probabilistic deduplication uses data structures
          like Bloom filters or HyperLogLog sketches that operate within fixed memory bounds but introduce a known,
          bounded error rate. The choice between exact and probabilistic deduplication depends on the correctness
          requirements of the downstream use case.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The deduplication state store is the core component that tracks which records have been seen. For exact
          deduplication, the state store is typically a hash set (in memory for streaming pipelines) or a database
          index (for batch pipelines). The hash set provides O(1) lookup and insert, making it efficient for
          high-throughput pipelines. However, the hash set grows with the number of unique keys, eventually exceeding
          available memory. The solution is to bound the state: use a sliding window (only track keys seen within the
          last N minutes or hours), apply TTL (evict keys older than a threshold), or partition the state (distribute
          keys across multiple nodes in a distributed hash store like Redis).
        </p>
        <p>
          Bloom filters provide a space-efficient probabilistic alternative for deduplication. A Bloom filter is a
          fixed-size bit array combined with multiple hash functions. To check whether a key has been seen, the Bloom
          filter hashes the key with each hash function and checks the corresponding bits. If any bit is zero, the key
          has definitely not been seen (no false negatives). If all bits are one, the key has probably been seen, but
          there is a small probability of a false positive — the filter incorrectly reports the key as seen when it
          has not been. The false positive rate is configurable: larger Bloom filters have lower false positive rates
          but consume more memory.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-deduplication-diagram-1.svg"
          alt="Comparison of exact deduplication (hash-based, correct, unbounded memory) versus probabilistic deduplication (Bloom filters, bounded memory, bounded error)"
          caption="Exact deduplication uses hash sets or database indexes for 100% correctness but unbounded memory. Probabilistic deduplication uses Bloom filters or HyperLogLog for bounded memory with known error bounds."
        />
        <p>
          Windowed deduplication is the standard approach for streaming pipelines. Instead of tracking all keys
          indefinitely, the deduplication state is scoped to a time window — for example, all keys seen within the
          last hour. When the window advances, keys from the oldest window are evicted. This bounds the memory usage
          at the cost of not detecting duplicates that arrive outside the window. The window size should be chosen
          based on the maximum expected delay between duplicate arrivals: if duplicates typically arrive within 10
          minutes of each other (due to retries or network retransmission), a 30-minute window provides sufficient
          margin.
        </p>
        <p>
          Idempotent sinks are an alternative to explicit deduplication. Instead of maintaining a deduplication state
          store, the output store is designed to handle duplicate writes idempotently — writing the same record twice
          produces the same state as writing it once. This is typically achieved by using the record&apos;s unique key as
          the primary key in the output store and using upsert semantics (INSERT OR REPLACE, or PUT in key-value
          stores). The duplicate record overwrites the existing record with the same key, leaving the final state
          unchanged. Idempotent sinks eliminate the need for explicit deduplication state but require that the output
          store supports upsert semantics and that the record&apos;s key uniquely identifies it.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-deduplication-diagram-2.svg"
          alt="Duplicate sources including retries, pipeline replays, out-of-order delivery, multiple ingestion paths, and consumer rebalances, with dedup layer and output"
          caption="Duplicates originate from multiple sources: retries, replays, out-of-order delivery, multiple ingestion paths, and consumer rebalances. The dedup layer removes them before output."
        />
        <p>
          Ordering and deduplication interact in important ways. When deduplication uses a &quot;keep first&quot; strategy
          (the first occurrence of a key is kept, subsequent occurrences are discarded), the order of record arrival
          determines which record is kept. If records arrive out of order — due to network retransmission, partition
          rebalancing, or clock skew — the &quot;first&quot; record may not actually be the first one produced, and the
          deduplication may discard the correct record. The &quot;keep latest&quot; strategy (the most recent occurrence of
          a key is kept, based on a timestamp field) is more robust to out-of-order arrival but requires that each
          record carry a reliable timestamp and that the timestamp monotonicity is maintained.
        </p>
        <p>
          Duplicate rate as an operational metric is essential for monitoring deduplication health. The duplicate rate
          — the ratio of duplicate records to total records — should be tracked continuously and alerted on. A sudden
          increase in the duplicate rate indicates a new source of duplicates (for example, a producer retry storm, a
          pipeline replay, or a consumer group rebalance) that should be investigated. A persistently high duplicate
          rate indicates a systemic issue (for example, a producer that does not implement idempotent writes) that
          should be fixed at the source rather than handled by the deduplication layer.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The deduplication pipeline architecture consists of three layers: the identity layer (computing the
          deduplication key for each record), the state layer (checking and updating the deduplication state store),
          and the output layer (routing records to the deduplicated or duplicate output stream). The identity layer
          extracts or computes the deduplication key from each record — a primary key field, a content hash, or a
          composite key. The state layer checks whether the key has been seen before and, if not, records it as seen.
          The output layer routes the record to the deduplicated output if it is the first occurrence, or to the
          duplicate output (or discard) if it is a subsequent occurrence.
        </p>
        <p>
          For streaming deduplication, the state layer is typically an in-memory hash set with TTL or a sliding
          window. Records are processed in arrival order, and the state is updated incrementally as each record
          arrives. The hash set provides O(1) lookup and insert, enabling high-throughput deduplication. The TTL
          or window ensures that the state does not grow unboundedly: keys older than the TTL are evicted, freeing
          memory for new keys. The trade-off is that duplicates arriving after the TTL has expired are not detected.
        </p>
        <p>
          For batch deduplication, the state layer is typically a distributed sort and group-by operation. The
          pipeline sorts the input records by the deduplication key, groups records with the same key, and applies
          a keep-first or keep-latest strategy within each group. This approach processes the entire dataset at
          once, so it does not have the memory bounds of streaming deduplication. However, it requires a full pass
          over the data and a shuffle operation to group records by key, which is expensive for large datasets.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-deduplication-diagram-3.svg"
          alt="Deduplication failure modes: state growth OOM, key collision from hash collisions, clock skew causing late events, with state management strategies and monitoring"
          caption="Deduplication failure modes include state growth exhausting memory, hash collisions causing false dedup, and clock skew allowing late duplicates through. State management strategies include in-memory hash sets, Bloom filters, external stores, and idempotent sinks."
        />
        <p>
          Distributed deduplication requires careful partitioning of the deduplication state. In a distributed
          pipeline, records are partitioned across workers, and each worker maintains its own deduplication state.
          This works correctly only if all records with the same deduplication key are routed to the same worker —
          that is, the record partitioning key is the same as the deduplication key. If records with the same
          deduplication key are routed to different workers, each worker will see the record as the first occurrence
          and will not detect it as a duplicate. The solution is to repartition the records by the deduplication
          key before the deduplication stage, ensuring that all records with the same key go to the same worker.
        </p>
        <p>
          Cross-system deduplication — detecting duplicates that originate from different ingestion paths (for
          example, the same event arriving via both a REST API and a CDC connector) — requires a global deduplication
          state that is accessible to all ingestion paths. This is typically implemented as a shared state store
          (Redis, DynamoDB, or a dedicated deduplication service) that all ingestion paths check before writing a
          record. The shared state store introduces network latency for each record (a round-trip to check and update
          the state), which can become a throughput bottleneck. The solution is to batch deduplication checks —
          sending multiple keys to the state store in a single request — or to use a local cache with periodic
          reconciliation to the shared state.
        </p>
        <p>
          The deduplication output includes not only the deduplicated records but also metrics about the
          deduplication process: the total number of records processed, the number of unique records, the number of
          duplicates detected, and the duplicate rate. These metrics are essential for monitoring the health of the
          deduplication pipeline and for investigating data quality issues. A sudden spike in the duplicate rate
          indicates a new source of duplicates that should be investigated and fixed at the source.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Exact versus probabilistic deduplication is the primary trade-off. Exact deduplication using hash sets or
          database indexes is 100 percent correct but requires unbounded memory — the state grows with the number of
          unique keys, which can reach billions for high-volume pipelines. Probabilistic deduplication using Bloom
          filters operates within fixed memory bounds but introduces false positives (incorrectly identifying a unique
          record as a duplicate). The choice depends on the correctness requirements: for billing, compliance, or any
          use case where false dedup has financial or legal consequences, exact deduplication is mandatory. For
          analytics, monitoring, or any use case where a small error rate is acceptable, probabilistic deduplication
          may be sufficient and much more cost-efficient.
        </p>
        <p>
          In-memory versus external state stores is a performance-versus-scalability trade-off. In-memory hash sets
          provide the fastest lookup and insert (nanoseconds) but are limited by the available memory on the worker
          node. External state stores (Redis, DynamoDB) provide scalable, persistent deduplication state but add
          network latency (milliseconds) for each lookup and insert, which can become a throughput bottleneck for
          high-volume pipelines. The recommended approach is to use in-memory state for high-throughput, bounded
          deduplication (with TTL or windowing) and external state for cross-system, global deduplication where the
          state must be shared across multiple ingestion paths.
        </p>
        <p>
          Keep-first versus keep-latest is a correctness-versus-robustness trade-off. Keep-first (the first occurrence
          of a key is kept) is simple and correct when records arrive in order, but it discards subsequent occurrences
          even if they contain updated information. Keep-latest (the most recent occurrence, based on timestamp, is
          kept) is more robust to out-of-order arrival and handles updates correctly, but it requires that each record
          carry a reliable timestamp and that the deduplication logic can compare timestamps. For event streams where
          records may be updated (for example, CDC events with UPDATE operations), keep-latest is the correct choice.
          For event streams where records are immutable (for example, click events), keep-first is sufficient.
        </p>
        <p>
          Windowed versus global deduplication is a memory-versus-correctness trade-off. Windowed deduplication
          (tracking keys only within a time window) bounds memory usage but misses duplicates that arrive outside the
          window. Global deduplication (tracking all keys indefinitely) is 100 percent correct but requires unbounded
          memory. For most streaming pipelines, windowed deduplication with a generous window (30 minutes to 24 hours,
          depending on the expected duplicate arrival pattern) provides sufficient correctness with bounded memory.
          Global deduplication is reserved for batch pipelines where the entire dataset is processed at once and
          memory is not a constraint.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Define record identity explicitly and document it. The deduplication key — whether it is a primary key, a
          content hash, or a composite key — should be defined explicitly and documented so that all stakeholders
          understand what constitutes a duplicate. This is especially important when the deduplication logic is shared
          across multiple pipelines or teams. A documented identity definition also enables testing: you can generate
          test cases with known duplicates and verify that the deduplication logic correctly identifies them.
        </p>
        <p>
          Use windowed deduplication with TTL for streaming pipelines. Instead of tracking all keys indefinitely,
          scope the deduplication state to a time window that covers the maximum expected delay between duplicate
          arrivals. For most pipelines, a 30-minute to 2-hour window is sufficient to catch duplicates from retries,
          network retransmission, and consumer rebalances. The window should be monitored and adjusted based on the
          observed duplicate arrival pattern.
        </p>
        <p>
          Monitor the duplicate rate continuously and alert on anomalies. The duplicate rate should be tracked as a
          time-series metric and alerted on when it exceeds the normal range. A sudden increase in the duplicate rate
          indicates a new source of duplicates (for example, a producer retry storm or a pipeline replay) that should
          be investigated. A persistently high duplicate rate indicates a systemic issue that should be fixed at the
          source.
        </p>
        <p>
          Prefer idempotent sinks over explicit deduplication when possible. If the output store supports upsert
          semantics (INSERT OR REPLACE, PUT by key), designing the output as an idempotent sink eliminates the need
          for explicit deduplication state. The sink handles duplicates naturally: writing the same record twice
          produces the same state as writing it once. This simplifies the pipeline architecture and reduces operational
          overhead.
        </p>
        <p>
          Use composite deduplication keys when a single field is insufficient for unique identification. If the
          source system does not provide a unique identifier, construct a composite key from multiple fields that
          together uniquely identify the record. For example, a composite key of user ID, event type, and event
          timestamp may uniquely identify a user action event. Test the composite key against a sample of the data to
          verify that it produces no false positives (two different records with the same key) and no false negatives
          (two duplicate records with different keys).
        </p>
        <p>
          Test deduplication logic with known duplicates as part of the CI/CD pipeline. Generate test data that
          includes known duplicates (records with the same identity but potentially different content) and verify
          that the deduplication logic correctly identifies and removes them. This catches regressions in the
          deduplication logic before they affect production data.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Unbounded deduplication state causing out-of-memory errors is the most common operational failure. When a
          streaming pipeline tracks all unique keys indefinitely without TTL or windowing, the deduplication state
          grows without bound and eventually exhausts available memory. The fix is to scope the deduplication state
          to a time window or to apply TTL, evicting keys older than a threshold. The window size should be chosen
          based on the maximum expected delay between duplicate arrivals, not based on memory availability.
        </p>
        <p>
          Hash collisions causing false deduplication is a correctness failure that occurs when two different records
          produce the same hash value and are incorrectly treated as duplicates. The probability of hash collision
          depends on the hash function and the hash size: a 32-bit hash has a significant collision probability for
          millions of records, while a 128-bit hash (such as MD5) has negligible collision probability for billions
          of records. The fix is to use a hash function with sufficient output size (128 bits or more) and to use a
          composite key (hash plus additional fields) for critical deduplication.
        </p>
        <p>
          Late events arriving after the deduplication window has closed, bypassing deduplication, is a correctness
          failure that occurs when the deduplication window is too short for the actual duplicate arrival pattern. If
          duplicates can arrive up to 4 hours apart (due to network issues, producer crashes, or CDC lag) but the
          deduplication window is only 30 minutes, duplicates arriving after 30 minutes will not be detected. The fix
          is to monitor the late event rate (events arriving after the deduplication window) and adjust the window
          size based on the observed pattern.
        </p>
        <p>
          Deduplication across partitions failing because records with the same key are routed to different workers
          is a distributed systems pitfall. If the record partitioning key is different from the deduplication key,
          records with the same deduplication key may be routed to different workers, each of which sees the record
          as the first occurrence. The fix is to repartition the records by the deduplication key before the
          deduplication stage, ensuring that all records with the same key go to the same worker.
        </p>
        <p>
          Deduplication removing legitimate updates because of incorrect keep-first semantics is a semantic error.
          When a record represents an update to an existing entity (for example, a CDC UPDATE event), keep-first
          deduplication will discard the update because the key has already been seen. The fix is to use keep-latest
          semantics for update events, or to separate insert events from update events and apply different
          deduplication logic to each.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses windowed deduplication in its real-time order processing pipeline to handle
          duplicate events from producer retries. The payment service uses idempotent writes with retry logic, and when
          a retry occurs after a timeout (even though the original write succeeded), the same order event is emitted
          twice. The deduplication layer, running in Apache Flink with a 1-hour window and order ID as the
          deduplication key, detects and discards the duplicate, ensuring that the downstream fulfillment system
          processes each order exactly once. The duplicate rate is monitored continuously and averages 0.5 percent,
          with occasional spikes to 5 percent during network incidents.
        </p>
        <p>
          A financial services company uses global deduplication in its trade reporting pipeline to handle duplicates
          from multiple ingestion paths. Trades are reported to the platform via both a REST API and a FIX protocol
          connection, and the same trade may be reported via both paths due to failover logic. The deduplication layer
          uses a shared Redis state store with the trade ID as the deduplication key, checking both ingestion paths
          against the same state to ensure that each trade is recorded exactly once. The shared state introduces a
          2-millisecond latency per trade, which is acceptable for the reporting pipeline&apos;s 100-millisecond SLA.
        </p>
        <p>
          A technology company uses Bloom filter-based probabilistic deduplication in its clickstream analytics
          pipeline to handle duplicate events from client-side retries. Mobile and web clients retry failed event
          submissions, producing duplicate click events. The pipeline uses a Bloom filter with a 1 percent false
          positive rate and a 24-hour window to deduplicate click events. The 1 percent false positive rate means
          that approximately 1 in 100 unique clicks is incorrectly discarded, which is acceptable for analytics
          (the error is within the margin of error for the aggregate metrics) but would not be acceptable for
          billing or compliance use cases.
        </p>
        <p>
          A healthcare organization uses exact deduplication in its patient data pipeline to handle duplicates from
          CDC connector restarts. When the CDC connector restarts after a crash, it re-emits events from its last
          committed offset, producing duplicates for any events that were emitted but not yet committed. The
          deduplication layer uses a PostgreSQL table with the patient record ID and transaction LSN as the
          deduplication key, ensuring that each patient record update is applied exactly once. The exact deduplication
          is mandatory because the patient data is used for clinical decision support, and even a small error rate
          could have patient safety implications.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How do you define record identity for deduplication when the source system does not provide a unique identifier?
          </h3>
          <p className="mb-3">
            When the source system does not provide a unique identifier, record identity must be constructed from the
            available fields. The first approach is a content-based hash: compute a cryptographic hash (SHA-256 or
            xxHash) of the entire record content and use the hash as the deduplication key. This identifies exact
            duplicates (records with identical content) but not semantic duplicates (records that represent the same
            real-world entity with different content).
          </p>
          <p className="mb-3">
            The second approach is a composite key constructed from a subset of fields that together uniquely identify
            the record. For example, a user action event might be uniquely identified by the combination of user ID,
            action type, and event timestamp. The composite key should be tested against a representative sample of the
            data to verify that it produces no false positives (two different records with the same key) and no false
            negatives (two duplicate records with different keys).
          </p>
          <p>
            The third approach is to enrich the record with a generated unique identifier at the ingestion point. When
            the event first enters the pipeline, assign it a UUID or a monotonically increasing sequence number, and use
            this identifier as the deduplication key for all downstream processing. This approach requires that the
            ingestion point is a single entry point — if events can enter the pipeline through multiple paths, each
            path must coordinate to avoid assigning different identifiers to the same event.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you handle deduplication state growth in a high-throughput streaming pipeline?
          </h3>
          <p className="mb-3">
            Deduplication state growth is managed by bounding the state size through one of three strategies. The first
            is TTL (time-to-live): each key in the deduplication state is associated with a timestamp, and keys older
            than a configurable TTL are evicted. The TTL should be chosen based on the maximum expected delay between
            duplicate arrivals — for most pipelines, 30 minutes to 2 hours is sufficient.
          </p>
          <p className="mb-3">
            The second strategy is windowing: the deduplication state is scoped to a sliding time window, and keys from
            outside the window are evicted. Windowing is simpler to implement than TTL (no per-key timestamps are
            needed) but is less flexible — all keys have the same lifetime regardless of when they were last seen.
          </p>
          <p>
            The third strategy is probabilistic deduplication using a Bloom filter, which operates within a fixed
            memory bound regardless of the number of unique keys. A Bloom filter of 100 MB can track billions of keys
            with a false positive rate of less than 1 percent. The trade-off is that a small fraction of unique records
            will be incorrectly discarded, which may be acceptable for analytics but not for billing or compliance.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: When would you use an idempotent sink instead of explicit deduplication?
          </h3>
          <p className="mb-3">
            An idempotent sink is appropriate when the output store supports upsert semantics — writing a record with
            a key that already exists overwrites the existing record with the same key, leaving the final state
            unchanged. In this case, explicit deduplication is unnecessary because the sink handles duplicates
            naturally: writing the same record twice produces the same state as writing it once.
          </p>
          <p className="mb-3">
            Idempotent sinks are particularly effective for key-value stores (Redis PUT, DynamoDB PutItem with
            condition expression), relational databases (INSERT OR REPLACE, UPSERT), and document stores (MongoDB
            update with upsert). They simplify the pipeline architecture by eliminating the deduplication state layer
            and its associated operational overhead (state management, memory monitoring, TTL configuration).
          </p>
          <p>
            However, idempotent sinks are not appropriate for all use cases. If the output store does not support
            upsert semantics (for example, an append-only log or a file-based data lake), explicit deduplication is
            required. If the pipeline needs to count or log duplicates as an operational metric, explicit
            deduplication is needed because the idempotent sink silently overwrites duplicates without exposing them
            to the pipeline. If the pipeline needs to route duplicates to a separate output stream for investigation,
            explicit deduplication is needed.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you deduplicate events in a distributed pipeline where records are partitioned across workers?
          </h3>
          <p className="mb-3">
            Deduplication in a distributed pipeline requires that all records with the same deduplication key are
            routed to the same worker. This is achieved by partitioning the records by the deduplication key before the
            deduplication stage — using a consistent hash of the key to determine which worker processes the record.
            With this partitioning strategy, each worker maintains its own deduplication state for the keys assigned to
            it, and no coordination between workers is needed.
          </p>
          <p className="mb-3">
            If the record partitioning key is different from the deduplication key (for example, records are
            partitioned by region for load balancing but deduplicated by user ID), a repartitioning stage is needed
            before the deduplication stage. The repartitioning stage redistributes the records by the deduplication
            key, ensuring that all records with the same key go to the same worker. Repartitioning involves a shuffle
            operation, which is expensive for large datasets, so it should be avoided if possible by choosing the
            deduplication key to match the partitioning key.
          </p>
          <p>
            For cross-system deduplication (detecting duplicates across multiple ingestion paths), a shared state store
            (Redis, DynamoDB) is needed because the ingestion paths may write to different workers. The shared state
            store provides a global view of seen keys that all workers can check and update. The trade-off is network
            latency: each record requires a round-trip to the shared state store, which can become a throughput
            bottleneck for high-volume pipelines.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: How do you detect and fix a sudden increase in the duplicate rate?
          </h3>
          <p className="mb-3">
            Detection starts with continuous monitoring of the duplicate rate as a time-series metric. The duplicate
            rate should be plotted on a dashboard with a rolling average and alert thresholds. A sudden increase — for
            example, from 0.5 percent to 10 percent — triggers an alert and an investigation.
          </p>
          <p className="mb-3">
            The investigation starts by identifying the source of the duplicates. Common sources include producer retry
            storms (a transient failure causes producers to retry, emitting duplicates), pipeline replays (a bug fix
            triggers a replay of historical events), consumer group rebalances (a Kafka consumer group rebalance
            re-delivers uncommitted messages), and multiple ingestion paths (the same event arriving via both an API
            and a CDC connector). The source can be identified by examining the duplicate records&apos; metadata — the
            producer ID, the event timestamp, the ingestion path — to find the common factor.
          </p>
          <p>
            The fix depends on the source. For producer retry storms, the fix is to implement idempotent writes at the
            producer level so that retries do not produce duplicates. For pipeline replays, the fix is to ensure that
            the replay is idempotent (the pipeline handles duplicate events correctly). For consumer group rebalances,
            the fix is to use exactly-once semantics in the consumer. For multiple ingestion paths, the fix is to
            implement cross-system deduplication with a shared state store.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Bloom, &quot;Space/Time Trade-offs in Hash Coding with Allowable Errors&quot;</strong> — The
            original paper introducing Bloom filters as a space-efficient probabilistic data structure for set
            membership testing. Communications of the ACM, 1970.
          </li>
          <li>
            <strong>Apache Flink Documentation — Deduplication</strong> — Covers streaming deduplication patterns
            including windowed dedup, keep-first and keep-latest strategies, and state TTL configuration.{' '}
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
            exactly-once semantics, idempotent writes, and deduplication patterns. O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Google Cloud — Data Deduplication Best Practices</strong> — Practical guide to implementing
            deduplication in data pipelines, including identity definition, state management, and monitoring.{' '}
            <a
              href="https://cloud.google.com/architecture/data-deduplication"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              cloud.google.com/architecture/data-deduplication
            </a>
          </li>
          <li>
            <strong>Redis Documentation — Bloom Filters</strong> — RedisBloom module documentation for using Bloom
            filters and Counting Bloom filters for probabilistic deduplication at scale.{' '}
            <a
              href="https://redis.io/docs/data-types/probabilistic/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              redis.io/docs/data-types/probabilistic
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}