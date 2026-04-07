"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-exactly-once-semantics-extensive",
  title: "Exactly-Once Semantics",
  description:
    "Understand what exactly-once really means, where it breaks, and the practical patterns that make effects idempotent and recoverable.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "exactly-once-semantics",
  wordCount: 5560,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "streaming", "correctness", "reliability"],
  relatedTopics: ["message-ordering", "data-deduplication", "stream-processing", "apache-kafka"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Exactly-once semantics</strong> is the guarantee that each record in a data pipeline is processed
          exactly one time — not zero times (loss) and not multiple times (duplication). It is the strongest delivery
          guarantee in distributed data processing and the most difficult to achieve correctly. The alternative
          semantics are at-most-once (records may be lost but never duplicated) and at-least-once (records are never
          lost but may be duplicated). Exactly-once semantics is essential for use cases where data loss or
          duplication has financial, legal, or correctness consequences — billing systems, financial ledgers,
          inventory management, and compliance reporting.
        </p>
        <p>
          The fundamental challenge of exactly-once semantics is that distributed systems fail. Networks partition,
          processes crash, disks fail, and clocks drift. In the face of these failures, a pipeline must ensure that
          each record is processed exactly once, which requires coordination between the source (where records
          originate), the broker (where records are stored and transmitted), the processor (where records are
          transformed), and the sink (where results are written). No single component can guarantee exactly-once
          semantics alone — it requires coordination across the entire pipeline.
        </p>
        <p>
          The term &quot;exactly-once&quot; is often misunderstood. It does not mean that the system magically prevents
          failures or retries. It means that the system&apos;s design ensures that the <em>effect</em> of processing each
          record is applied exactly once, even if the record is physically transmitted or processed multiple times due
          to retries. This is achieved through two mechanisms: idempotent processing (applying the same record
          multiple times produces the same effect as applying it once) and transactional writes (the record and its
          processing offset are written atomically, so either both are written or neither is).
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">The Three Delivery Semantics</h3>
          <p className="mb-3">
            At-most-once semantics commits the record&apos;s offset before processing. If processing fails, the record is
            lost — it will not be reprocessed because the offset has already been committed. This is the simplest and
            fastest semantic but is only appropriate for use cases where data loss is acceptable (metrics, logs,
            monitoring).
          </p>
          <p className="mb-3">
            At-least-once semantics commits the offset after processing. If processing succeeds but the offset commit
            fails, the record will be reprocessed on the next run — it may be processed multiple times. This is the
            most common semantic in production pipelines because it guarantees no data loss, and duplicates can be
            handled through idempotent processing or explicit deduplication.
          </p>
          <p>
            Exactly-once semantics ensures that each record is processed exactly once through a combination of
            idempotent producers (which prevent duplicate writes to the broker), transactional brokers (which ensure
            atomic writes across partitions), and transactional consumers (which atomically commit the processing
            offset along with the output). This is the strongest semantic but carries a 20-50 percent performance
            overhead compared to at-least-once.
          </p>
        </div>
        <p>
          The scope of exactly-once semantics matters. Producer-to-broker exactly-once (idempotent producers) ensures
          that each record is written to the broker exactly once, preventing duplicates caused by producer retries.
          Broker-to-consumer exactly-once (transactional reads) ensures that the consumer reads each committed record
          exactly once, preventing the consumer from reading uncommitted or duplicated records. End-to-end exactly-once
          ensures that the processor&apos;s output is written to the sink exactly once, with the processing offset committed
          atomically with the output. Most use cases require end-to-end exactly-once, not just producer-to-broker.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Idempotent processing is the foundation of exactly-once semantics. An operation is idempotent if applying
          it multiple times produces the same effect as applying it once. In the context of data processing, this
          means that processing the same record twice (due to a retry or a redelivery) produces the same output state
          as processing it once. Idempotency can be achieved through two approaches: idempotent writes (the sink
          supports upsert semantics, so writing the same record twice overwrites the first write without creating a
          duplicate) and deduplication keys (the processor maintains a record of processed record IDs and skips
          records that have already been processed).
        </p>
        <p>
          Transactional writes ensure that the output and the processing offset are committed atomically — either both
          are committed or neither is. This prevents the scenario where the output is written but the offset is not
          committed (causing the record to be reprocessed and the output to be duplicated) or the offset is committed
          but the output is not written (causing the record to be lost). In Kafka, this is achieved through the
          transactional producer API, which allows the processor to write output records and commit the consumer
          offset in a single atomic transaction.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/exactly-once-semantics-diagram-1.svg"
          alt="Comparison of at-most-once, at-least-once, and exactly-once delivery semantics with their trade-offs"
          caption="Delivery semantics: at-most-once risks data loss but is fast, at-least-once risks duplicates but is reliable, and exactly-once prevents both but requires transactional coordination and carries performance overhead."
        />
        <p>
          Sequence numbers are the mechanism by which idempotent producers prevent duplicate writes. Each producer is
          assigned a unique producer ID and maintains a monotonically increasing sequence number for each record it
          sends. The broker tracks the highest sequence number received from each producer for each partition. When a
          producer retries a send (due to a timeout or network error), the broker compares the sequence number of the
          retried record with the highest sequence number it has already received. If the sequence number is lower or
          equal, the broker discards the duplicate — the record has already been processed. If the sequence number is
          higher, the broker accepts the record and updates its tracked sequence number.
        </p>
        <p>
          Transaction isolation determines what consumers see when a producer is writing records in a transaction.
          Consumers can be configured to read only committed records (isolation level equals read_committed) or to
          read all records including uncommitted ones (isolation level equals read_uncommitted). For exactly-once
          semantics, consumers must read only committed records — this ensures that they do not see records from a
          transaction that may be aborted (and therefore should not be processed). The broker maintains a transaction
          log that tracks which transactions are in progress, committed, or aborted, and consumers use this log to
          filter out uncommitted records.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/exactly-once-semantics-diagram-2.svg"
          alt="Exactly-once implementation showing idempotent producer, transactional broker, and consumer offset commit working together"
          caption="Exactly-once requires three components: idempotent producers prevent duplicate writes, transactional brokers ensure atomic commits across partitions, and consumers commit offsets atomically with their output."
        />
        <p>
          The performance cost of exactly-once semantics is significant. Transactional writes require coordination
          between the producer, the broker, and the consumer, which adds latency and reduces throughput. The Kafka
          transactional API, for example, introduces a 20-50 percent throughput reduction compared to at-least-once
          processing, because each transaction requires a commit phase that involves multiple round-trips between the
          producer and the broker. For high-throughput pipelines where the cost of duplicates is low (for example,
          metrics aggregation where a small duplication error is within the margin of error), at-least-once with
          idempotent sinks is often preferred over exactly-once.
        </p>
        <p>
          The scope of exactly-once semantics is often narrower than teams expect. Kafka&apos;s exactly-once semantics
          (EOS) guarantees exactly-once processing within a single Kafka cluster — from producer to broker to consumer
          to output topic. It does not guarantee exactly-once processing across multiple Kafka clusters, or between
          Kafka and an external sink (a database, a data warehouse, an API). For end-to-end exactly-once across
          heterogeneous systems, the sink must support idempotent writes or transactional commits, and the processor
          must coordinate the output write and the offset commit atomically — which often requires custom logic.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The exactly-once architecture consists of three coordinated components: the idempotent producer, the
          transactional broker, and the transactional consumer. The idempotent producer assigns a unique producer ID
          and sequence number to each record, ensuring that duplicate writes (caused by retries) are detected and
          discarded by the broker. The transactional broker groups records into transactions, committing or aborting
          each transaction atomically. The transactional consumer reads only committed records and commits its
          processing offset atomically with its output write.
        </p>
        <p>
          The producer flow begins with the application generating a record and assigning it a sequence number. The
          producer sends the record to the broker with its producer ID and sequence number. The broker checks whether
          it has already received a record with the same or higher sequence number from this producer for this
          partition. If yes, the broker discards the record as a duplicate. If no, the broker writes the record to the
          partition and updates its tracked sequence number. The producer then receives an acknowledgment from the
          broker confirming the write.
        </p>
        <p>
          The transactional broker flow begins when a producer initiates a transaction by sending a begin-transaction
          request to the transaction coordinator. The coordinator creates a transaction log entry and assigns a
          transactional ID. The producer then writes records to multiple partitions within the transaction. When the
          producer is ready to commit, it sends a commit-transaction request to the coordinator. The coordinator
          writes a commit marker to the transaction log and updates the partition metadata to mark the records as
          committed. If the producer fails before committing, the coordinator aborts the transaction and the records
          are discarded — consumers configured to read only committed records will never see them.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/exactly-once-semantics-diagram-3.svg"
          alt="End-to-end exactly-once flow from source through broker and processor to sink, with scope levels shown"
          caption="End-to-end exactly-once requires coordination at every hop: source writes transactionally, broker deduplicates and commits atomically, processor reads committed data, and sink writes idempotently with atomic offset commit."
        />
        <p>
          The transactional consumer flow begins with the consumer reading records from a topic with the isolation
          level set to read_committed. The consumer filters out uncommitted records, reading only records from
          committed transactions. The consumer processes each record and writes the output to the sink. The consumer
          then commits its offset atomically with the output write — using a transaction that includes both the output
          write and the offset commit. If the transaction succeeds, both the output and the offset are committed. If
          it fails, neither is committed, and the consumer will reprocess the record on the next run — but the
          idempotent sink ensures that the duplicate write does not create a duplicate output.
        </p>
        <p>
          Offset management is critical for exactly-once semantics. The consumer&apos;s offset — the position in the
          partition that it has processed up to — must be committed atomically with the output write. If the offset is
          committed before the output write, a failure between the commit and the write causes the record to be lost
          (the consumer will not reprocess it because the offset has been committed, but the output was not written).
          If the offset is committed after the output write, a failure between the write and the commit causes the
          record to be duplicated (the consumer will reprocess it because the offset was not committed, and the
          output was already written). The atomic commit ensures that both succeed or both fail.
        </p>
        <p>
          State management in stream processors (Flink, Kafka Streams) adds another layer of complexity to
          exactly-once semantics. The processor maintains state (aggregations, windowed counts, join buffers) that
          must be consistent with the processed records. If the processor fails and restarts, its state must be
          restored to the point of the last committed offset — not ahead (which would cause records to be skipped)
          and not behind (which would cause records to be reprocessed and the state to be inconsistent). This is
          achieved through checkpointing — the processor periodically snapshots its state and offset to durable
          storage, and on restart, it restores from the latest checkpoint.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Exactly-once versus at-least-once with idempotent sinks is the primary trade-off. Exactly-once provides
          the strongest guarantee — each record is processed exactly once — but carries a 20-50 percent performance
          overhead due to transactional coordination. At-least-once with idempotent sinks provides the same
          correctness guarantee (the output is correct, with no loss or duplication) but with lower overhead — the
          sink handles duplicates through idempotent writes (upserts), so the processor does not need transactional
          coordination. The choice depends on whether the sink supports idempotent writes. If it does (for example, a
          database with UPSERT, or a key-value store with PUT-by-key), at-least-once with idempotent sinks is
          preferred. If it does not (for example, an append-only log or a file-based data lake), exactly-once is
          required.
        </p>
        <p>
          Exactly-once within a single system versus end-to-end exactly-once across heterogeneous systems is a scope
          trade-off. Kafka&apos;s EOS guarantees exactly-once processing within a single Kafka cluster — from producer to
          broker to consumer to output topic. It does not guarantee exactly-once across multiple Kafka clusters or
          between Kafka and an external sink. End-to-end exactly-once requires custom logic to coordinate the output
          write and the offset commit across the heterogeneous systems, which adds complexity and may not be feasible
          for all sinks.
        </p>
        <p>
          Checkpoint frequency in stream processors is a trade-off between recovery time and overhead. Frequent
          checkpointing (every few seconds) ensures that the processor can recover to a recent state with minimal
          reprocessing, but it adds overhead because each checkpoint requires writing the state to durable storage.
          Infrequent checkpointing (every few minutes) reduces overhead but increases the recovery time — the
          processor must reprocess more records after a failure. The recommended checkpoint frequency is 30-60
          seconds for most workloads, balancing recovery time and overhead.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use idempotent sinks wherever possible — they provide the same correctness guarantee as exactly-once
          semantics with lower overhead. Design the sink to handle duplicate writes idempotently: use UPSERT instead
          of INSERT, use PUT-by-key instead of append, or maintain a deduplication log that tracks processed record
          IDs and skips duplicates.
        </p>
        <p>
          Enable idempotent producers (enable.idempotence equals true) for all Kafka producers, even if you are not
          using full exactly-once semantics. Idempotent producers prevent duplicate writes caused by producer
          retries, which is the most common source of duplicates in Kafka pipelines. The overhead is negligible —
          less than 1 percent throughput reduction.
        </p>
        <p>
          Use transactional consumers (isolation.level equals read_committed) when reading from topics written by
          transactional producers. This ensures that the consumer reads only committed records and does not see
          records from aborted transactions. Without this configuration, the consumer may process records that are
          later aborted, producing incorrect output.
        </p>
        <p>
          Monitor exactly-once performance overhead — track the throughput and latency of transactional writes
          compared to non-transactional writes, and alert when the overhead exceeds the expected range (20-50
          percent for Kafka EOS). If the overhead is too high, investigate whether idempotent sinks can replace
          exactly-once semantics for the specific pipeline.
        </p>
        <p>
          Test exactly-onse semantics under failure conditions — simulate producer crashes, broker failures, and
          consumer restarts, and verify that the output is correct (no loss, no duplication). Automated failure
          testing is essential because exactly-once semantics is easy to get right in the happy path but difficult
          to get right under failures.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Assuming exactly-once semantics applies end-to-end when it only applies within a single system is the most
          common exactly-once misunderstanding. Kafka&apos;s EOS guarantees exactly-once within a single Kafka cluster —
          from producer to broker to consumer to output topic. It does not guarantee exactly-once between Kafka and
          an external sink (a database, a data warehouse, an API). If the pipeline writes to an external sink, the
          sink must support idempotent writes or the processor must implement custom logic to coordinate the output
          write and the offset commit atomically.
        </p>
        <p>
          Using exactly-once semantics when at-least-once with idempotent sinks would suffice is a common
          over-engineering pitfall. Exactly-onse semantics carries a 20-50 percent performance overhead. If the sink
          supports idempotent writes (UPSERT, PUT-by-key), at-least-once with idempotent sinks provides the same
          correctness guarantee with lower overhead. The choice should be based on the sink&apos;s capabilities, not on a
          desire for the strongest semantic regardless of cost.
        </p>
        <p>
          Not configuring consumers to read only committed records (isolation.level equals read_committed) when
          reading from transactional producers causes the consumer to see uncommitted records that may later be
          aborted, producing incorrect output. This is a subtle configuration issue — the default isolation level is
          read_uncommitted, which is appropriate for non-transactional producers but incorrect for transactional
          producers.
        </p>
        <p>
          Checkpoint state that is not consistent with the committed offset causes incorrect recovery after a
          failure. If the state is ahead of the committed offset (the state includes records that have not been
          committed), the processor will skip those records on restart because the offset has not been committed. If
          the state is behind the committed offset (the state does not include records that have been committed), the
          processor will reprocess those records and the state will be inconsistent. The checkpoint must capture both
          the state and the offset atomically.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A financial services company uses exactly-once semantics for its trade settlement pipeline, where each
          trade must be processed exactly once to ensure that the settlement ledger is correct. The pipeline uses
          Kafka&apos;s transactional API to write trades to a Kafka topic, a Flink processor to validate and enrich the
          trades, and an idempotent sink (a PostgreSQL database with UPSERT by trade ID) to write the settled trades
          to the ledger. The combination of idempotent producers, transactional brokers, and idempotent sinks ensures
          that each trade is settled exactly once, even in the face of producer retries, broker failures, and
          processor restarts.
        </p>
        <p>
          A large e-commerce platform uses at-least-once with idempotent sinks for its order processing pipeline,
          where order events are consumed from Kafka and written to an order database. The sink uses UPSERT by order
          ID, so duplicate order events (caused by consumer restarts) are handled idempotently — the second write
          overwrites the first without creating a duplicate order. The pipeline uses idempotent producers to prevent
          duplicate writes to the Kafka topic, but does not use full exactly-once semantics because the idempotent
          sink provides the same correctness guarantee with lower overhead.
        </p>
        <p>
          A technology company uses exactly-once semantics for its real-time analytics pipeline, where user activity
          events are consumed from Kafka, aggregated into windowed counts (page views per minute, per user, per
          page), and written to a time-series database. The Flink processor uses checkpointing to maintain consistent
          state (the windowed counts) with the committed offset, ensuring that after a failure, the processor
          recovers to the correct state and continues processing without loss or duplication. The time-series database
          supports idempotent writes (PUT by timestamp and dimension), so the pipeline achieves end-to-end
          exactly-once semantics.
        </p>
        <p>
          A healthcare organization uses at-least-once with explicit deduplication for its patient data replication
          pipeline, where CDC events from the EHR database are consumed from Kafka and written to a research data
          warehouse. The pipeline uses idempotent producers to prevent duplicate writes to the Kafka topic, and the
          consumer maintains a deduplication log (a Bloom filter of processed event IDs) to skip duplicate events. The
          Bloom filter provides probabilistic deduplication — it may have false positives (incorrectly skipping a
          unique event) but no false negatives (never failing to skip a duplicate). The false positive rate is
          configured to be less than 0.01 percent, which is acceptable for the research use case.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: What is the difference between at-least-once and exactly-once, and when would you choose one over the other?
          </h3>
          <p className="mb-3">
            At-least-once guarantees that each record is processed at least once — it may be processed multiple
            times due to retries or redeliveries, but it is never lost. Exactly-once guarantees that each record is
            processed exactly once — no loss and no duplication. The key difference is that at-least-once requires the
            consumer to handle duplicates (through idempotent processing or explicit deduplication), while exactly-once
            handles duplicates at the infrastructure level through transactional coordination.
          </p>
          <p className="mb-3">
            Choose exactly-once when the sink does not support idempotent writes (for example, an append-only log or
            a file-based data lake) and duplicates would produce incorrect output. Choose at-least-once with
            idempotent sinks when the sink supports idempotent writes (UPSERT, PUT-by-key) — this provides the same
            correctness guarantee with lower overhead because the sink handles duplicates rather than the
            infrastructure.
          </p>
          <p>
            Choose at-most-once only for use cases where data loss is acceptable and the performance benefit is
            significant (for example, metrics collection where a small percentage of lost metrics is within the margin
            of error). At-most-once is rarely appropriate for data pipelines where correctness matters.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How does Kafka achieve exactly-once semantics, and what are its limitations?
          </h3>
          <p className="mb-3">
            Kafka achieves exactly-once semantics through three mechanisms: idempotent producers (which prevent
            duplicate writes to the broker by assigning sequence numbers to each record), transactional brokers (which
            group records into atomic transactions that are committed or aborted as a unit), and transactional
            consumers (which read only committed records and commit their processing offset atomically with their
            output write). Together, these mechanisms ensure that each record is written, read, and processed exactly
            once within a single Kafka cluster.
          </p>
          <p className="mb-3">
            The limitations of Kafka&apos;s EOS are: it only applies within a single Kafka cluster — it does not guarantee
            exactly-once across multiple clusters or between Kafka and an external sink. It carries a 20-50 percent
            performance overhead compared to at-least-once processing. It requires that the consumer is configured to
            read only committed records (isolation.level equals read_committed) — if the consumer reads uncommitted
            records, the guarantee is broken.
          </p>
          <p>
            For end-to-end exactly-once across heterogeneous systems (Kafka to a database, Kafka to a data
            warehouse), the sink must support idempotent writes or the processor must implement custom logic to
            coordinate the output write and the offset commit atomically. Kafka&apos;s EOS does not provide this
            coordination — it is the responsibility of the processor and the sink.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: How do idempotent sinks work, and why are they important for exactly-once processing?
          </h3>
          <p className="mb-3">
            An idempotent sink is a storage system that handles duplicate writes idempotently — writing the same
            record twice produces the same state as writing it once. This is achieved through upsert semantics (INSERT
            OR REPLACE in SQL, PUT-by-key in key-value stores) or through deduplication keys (the sink maintains a
            record of processed record IDs and skips duplicates).
          </p>
          <p className="mb-3">
            Idempotent sinks are important for exactly-once processing because they allow the pipeline to use
            at-least-once semantics (which is simpler and faster than exactly-once) while still achieving the same
            correctness guarantee. The processor writes the output to the sink using at-least-once semantics (which
            may result in duplicate writes), and the idempotent sink handles the duplicates by overwriting the
            previous write or skipping it entirely.
          </p>
          <p>
            Examples of idempotent sinks include: relational databases with UPSERT (PostgreSQL INSERT ON CONFLICT,
            MySQL INSERT ON DUPLICATE KEY UPDATE), key-value stores with PUT-by-key (Redis SET, DynamoDB PutItem),
            and document stores with upsert (MongoDB update with upsert). Non-idempotent sinks include append-only
            logs (Kafka topics, S3 files) and file-based data lakes — these require exactly-once semantics or
            explicit deduplication to handle duplicates.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do stream processors like Flink achieve exactly-once state management?
          </h3>
          <p className="mb-3">
            Flink achieves exactly-once state management through distributed snapshots (the Chandy-Lamport algorithm).
            Periodically, Flink creates a checkpoint that captures the state of all operators (aggregations, windowed
            counts, join buffers) and the current processing offset. The checkpoint is written to durable storage
            (HDFS, S3) atomically, so that either the entire checkpoint is written or none of it is.
          </p>
          <p className="mb-3">
            When Flink fails and restarts, it restores from the latest checkpoint — the state and the offset are
            restored to the point of the checkpoint, and processing continues from that point. Because the checkpoint
            captures both the state and the offset atomically, the restored state is consistent with the offset —
            there are no records that have been processed but not reflected in the state, and no records that are
            reflected in the state but not processed.
          </p>
          <p>
            The checkpoint frequency is configurable — more frequent checkpoints reduce the recovery time (less
            reprocessing after a failure) but add overhead (more frequent writes to durable storage). The recommended
            checkpoint frequency is 30-60 seconds for most workloads, balancing recovery time and overhead.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: How do you test exactly-once semantics in a production pipeline?
          </h3>
          <p className="mb-3">
            Testing exactly-once semantics requires simulating failures and verifying that the output is correct — no
            loss and no duplication. The test should cover the following failure scenarios: producer crash and retry
            (verify that the retry does not produce a duplicate), broker failure during a transaction (verify that the
            transaction is aborted and the records are not visible to consumers), consumer crash after processing but
            before offset commit (verify that the record is reprocessed but the output is not duplicated), and network
            partition between the producer and the broker (verify that the transaction times out and is aborted).
          </p>
          <p className="mb-3">
            The test should compare the output against a known correct result — for example, a batch pipeline that
            processes the same input data with exactly-once semantics and produces a reference output. The streaming
            pipeline&apos;s output should match the reference output exactly — same records, same values, same order (if
            order matters). Any deviation indicates a bug in the exactly-once implementation.
          </p>
          <p>
            Automated failure testing is essential because exactly-once semantics is easy to get right in the happy
            path but difficult to get right under failures. Use a chaos engineering tool (Chaos Monkey, Litmus) to
            inject failures (process crashes, network partitions, disk failures) into the pipeline and verify that
            the output remains correct. Run these tests continuously in a staging environment that mirrors production.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Apache Kafka Documentation — Transactions</strong> — Covers idempotent producers, transactional
            API, and exactly-once semantics configuration.{' '}
            <a
              href="https://kafka.apache.org/documentation/#transactions"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              kafka.apache.org/documentation/#transactions
            </a>
          </li>
          <li>
            <strong>Apache Flink Documentation — Checkpointing</strong> — Covers distributed snapshots, checkpoint
            configuration, and exactly-once state management in Flink.{' '}
            <a
              href="https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/fault_tolerance/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              nightlies.apache.org/flink/flink-docs-stable
            </a>
          </li>
          <li>
            <strong>Chandy &amp; Lamport, &quot;Distributed Snapshots: Determining Global States of Distributed
            Systems&quot;</strong> — The foundational paper on the checkpointing algorithm used by Flink and other
            stream processors. ACM Transactions on Computer Systems, 1985.
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapter on stream processing covering
            delivery semantics, idempotence, and exactly-once processing. O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Confluent — Exactly-Once Semantics in Apache Kafka</strong> — Practical guide to configuring
            and understanding Kafka EOS, including performance implications and limitations.{' '}
            <a
              href="https://www.confluent.io/blog/exactly-once-semantics-again/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              confluent.io/blog/exactly-once-semantics-again
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
