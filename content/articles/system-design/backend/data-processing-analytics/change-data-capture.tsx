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
  wordCount: 5580,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "cdc", "replication", "pipelines"],
  relatedTopics: ["apache-kafka", "data-pipelines", "exactly-once-semantics", "message-ordering"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Change Data Capture (CDC)</strong> is the practice of observing and recording every change made to a
          database — inserts, updates, and deletes — and streaming those changes to downstream systems in near real-time.
          CDC transforms a traditional database from a passive data store into an active event source, where every data
          modification becomes a streamable event that other systems can consume, react to, and build upon. Unlike
          batch-based ETL that extracts data on a schedule, CDC captures changes continuously as they occur, enabling
          downstream systems to stay synchronized with the source database with sub-second to sub-minute latency.
        </p>
        <p>
          The fundamental mechanism behind CDC is reading the database&apos;s transaction log (WAL in PostgreSQL,
          binlog in MySQL, redo log in Oracle, oplog in MongoDB). The transaction log is an append-only record of
          every change made to the database, written before the change is applied to the actual data pages. This
          log-based approach has two critical properties: it captures every change without modifying the source
          database&apos;s query path (no triggers or polling queries), and it preserves the exact order and atomicity
          of changes as they occurred in the source database.
        </p>
        <p>
          CDC has become essential infrastructure in modern data platforms because it solves the &quot;data
          synchronization problem&quot; — keeping multiple data stores consistent with each other — without requiring
          dual writes or distributed transactions. When a user updates their profile in the primary database, CDC
          automatically propagates that change to the search index, the cache layer, the data warehouse, and the
          analytics pipeline, each consuming the change event at its own pace and for its own purpose. This
          decoupled architecture is far more resilient and scalable than dual-write patterns, where the application
          must write to multiple systems synchronously and handle partial failures.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">CDC Event Structure</h3>
          <p className="mb-3">
            Each CDC event represents a single row-level change and contains four essential components: metadata
            (source database, table, transaction ID, log sequence number, and timestamps), operation type (create,
            update, delete, read for snapshot, or truncate), the before state (the full row state before the change,
            present for UPDATE and DELETE operations), and the after state (the full row state after the change,
            present for INSERT and UPDATE operations).
          </p>
          <p>
            This event structure enables downstream consumers to reconstruct the exact state changes in the source
            database. An UPDATE event provides both the old and new values, allowing consumers to compute deltas,
            audit changes, or apply conditional logic. A DELETE event provides the key of the deleted row, allowing
            consumers to remove the corresponding record from their own store. A snapshot READ event provides the
            initial state of every row at the time the snapshot was taken, allowing new consumers to bootstrap their
            state before switching to streaming changes.
          </p>
        </div>
        <p>
          CDC tools such as Debezium, Canal, Maxwell, and AWS DMS implement the connector pattern: they connect to
          the source database, read the transaction log, parse change records into a structured event format (typically
          JSON or Avro), and emit those events to a message broker (typically Apache Kafka). The connector maintains
          its own offset — the position in the transaction log that it has successfully read and emitted — so that it
          can resume from the correct position after a restart without losing or duplicating changes.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The transaction log is the single source of truth for CDC. Every change that reaches the database is first
          written to the transaction log in sequential order, and the log sequence number (LSN) provides a total
          ordering of all changes. This ordering is essential because it ensures that downstream consumers see changes
          in the same order they were committed in the source database, preserving referential integrity and causal
          relationships between changes.
        </p>
        <p>
          The CDC connector reads the transaction log sequentially, parsing each change record and transforming it
          into a structured event. The connector must handle several operational challenges: schema evolution (columns
          added, removed, or type-changed in the source database), log rotation (the database purges old log segments
          to reclaim disk space), and connector restart (resuming from the last committed offset after a crash or
          maintenance). Each of these challenges has specific failure modes that must be monitored and mitigated.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-1.svg"
          alt="CDC architecture showing source database with transaction log, CDC connector, message broker, and downstream consumers with CDC event structure"
          caption="CDC architecture: the connector reads the database transaction log, emits structured change events to a message broker, and downstream consumers process events independently at their own pace."
        />
        <p>
          Schema evolution is the most common operational challenge in CDC. When the source database schema changes —
          a column is added, a column type is modified, or a column is dropped — the CDC connector must handle the
          change gracefully. Debezium, for example, emits a schema change event alongside the data change event,
          allowing downstream consumers to adapt their own schemas. However, incompatible changes (such as changing a
          column from string to integer) may cause the connector to fail or emit events that downstream consumers
          cannot parse. The recommended approach is to use a schema registry (such as Confluent Schema Registry) with
          compatibility checks that prevent incompatible schema changes from being applied to the CDC event stream.
        </p>
        <p>
          Log retention and truncation is a critical operational concern. The database periodically purges old
          transaction log segments to reclaim disk space. If the CDC connector falls behind — due to network issues,
          high load, or connector crash — and the database purges log segments that the connector has not yet read,
          the connector cannot catch up from its last offset. The only recovery option is to take a new snapshot of
          the source tables and restart streaming from the snapshot&apos;s LSN. This is expensive for large tables and
          causes a period of inconsistency in downstream systems. Monitoring CDC lag and alerting when it approaches
          the log retention window is essential to prevent this scenario.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-2.svg"
          alt="CDC lag timeline showing how lag accumulates across database, connector, broker, and consumer stages"
          caption="CDC lag accumulates at each stage: connector read delay, broker commit delay, and consumer process delay. End-to-end lag is the sum of all stages and must be monitored against SLA thresholds."
        />
        <p>
          Snapshot and streaming is the standard CDC initialization pattern. When a new consumer starts consuming
          CDC events for a table, it first needs the initial state of the table (all existing rows) before it can
          process incremental changes. The connector takes a consistent snapshot of the table — reading all rows at
          a single point in time — and emits each row as a READ event. After the snapshot completes, the connector
          switches to streaming mode, reading the transaction log from the LSN that corresponds to the snapshot
          point. The consumer deduplicates events that appear in both the snapshot and the stream (using the LSN
          or transaction ID) to ensure a consistent final state.
        </p>
        <p>
          Ordering guarantees in CDC are partition-level, not global. Within a single partition (for example, a
          Kafka partition keyed by the table&apos;s primary key), events are strictly ordered by their commit order in
          the source database. Across partitions, events may be observed in different orders by different consumers
          depending on their consumption rate. This means that CDC consumers that need to maintain referential
          integrity across tables (for example, processing an order and its order items) must either consume from
          the same partition or implement their own ordering logic.
        </p>
        <p>
          Exactly-once versus at-least-once semantics in CDC is determined by the connector&apos;s offset management
          strategy. Most CDC connectors provide at-least-once delivery: the connector commits its offset after
          emitting the event to the broker, so if the connector crashes between emitting and committing, it will
          re-emit the event on restart. Downstream consumers must handle duplicates through idempotent processing
          or explicit deduplication keys (typically the LSN or transaction ID from the CDC event). True
          exactly-once CDC requires transactional writes from the connector to the broker, which is supported by
          Debezium with Kafka&apos;s transactional producer but adds latency and operational complexity.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The CDC pipeline architecture follows a consistent flow: source database transaction log, CDC connector,
          message broker, and downstream consumers. The source database writes every change to its transaction log
          before applying it to data pages. The CDC connector connects to the database as a replication client, reads
          the transaction log sequentially, and parses each change record into a structured event. The connector
          emits events to the message broker, typically partitioning by the source table&apos;s primary key to ensure
          that all changes for the same row go to the same partition and maintain ordering.
        </p>
        <p>
          The message broker serves as the decoupling layer between the CDC connector and downstream consumers. It
          provides durable storage of change events, independent consumption by multiple consumer groups, and replay
          capability for bootstrapping new consumers or reprocessing historical changes. The broker&apos;s retention
          policy determines how long change events are available for consumption — typically hours to days — after
          which they are deleted and only the snapshot provides the initial state for new consumers.
        </p>
        <p>
          Downstream consumers process change events and apply them to their own data stores. A cache layer consumer
          applies INSERT and UPDATE events to update cached records and DELETE events to evict records. A search index
          consumer applies events to maintain a full-text search index. A data warehouse consumer applies events to a
          slowly changing dimension table or a real-time fact table. Each consumer maintains its own offset position
          in the broker, allowing it to progress independently and to replay events from any point in the retention
          window.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/change-data-capture-diagram-3.svg"
          alt="CDC failure modes including schema changes, connector crashes, log truncation, and recovery through snapshot-plus-streaming pattern"
          caption="CDC failure modes and recovery: schema changes require compatibility checks, connector crashes require idempotent consumers, and log truncation requires snapshot-based recovery."
        />
        <p>
          The CDC connector&apos;s offset management is critical for correctness and recovery. The connector maintains
          its current position in the transaction log as an offset, which it periodically commits to a durable store
          (typically a Kafka topic for Debezium). The commit frequency determines the maximum number of events that
          may be reprocessed after a connector restart: if the connector commits its offset every 100 events, it may
          re-emit up to 100 events after a restart. Downstream consumers must handle these duplicates through
          idempotent processing — applying the same event twice produces the same state as applying it once — or
          through explicit deduplication using the event&apos;s LSN or transaction ID.
        </p>
        <p>
          Schema registry integration is an architectural decision that significantly impacts CDC operational
          reliability. Without a schema registry, CDC events are emitted with the current schema at the time of
          emission, and downstream consumers must handle schema changes ad hoc. With a schema registry, every CDC
          event is associated with a schema version, and consumers can fetch the correct schema for each event
          version. The schema registry also enforces compatibility rules — backward, forward, or full — that prevent
          incompatible schema changes from breaking downstream consumers. For CDC pipelines with multiple downstream
          consumers that evolve at different rates, a schema registry is essential.
        </p>
        <p>
          Monitoring and alerting for CDC pipelines must cover the full pipeline health: connector lag (the
          difference between the database&apos;s current LSN and the connector&apos;s current LSN), consumer lag (the
          difference between the latest event in the broker and the consumer&apos;s committed offset), error rate
          (connector exceptions per minute), and schema change events (alerts on incompatible schema evolution).
          Connector lag is the most critical metric because it directly determines the freshness of downstream data
          and the risk of log truncation. Consumer lag is important for understanding each downstream system&apos;s
          ability to keep up with the change volume.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          CDC versus batch-based ETL represents a trade-off between latency and operational complexity. CDC provides
          near-real-time data synchronization with sub-second to sub-minute latency, but requires managing always-on
          connectors, monitoring lag, handling schema evolution, and recovering from connector failures. Batch-based
          ETL provides simpler operations — scheduled runs with clear start and end points, easy debugging through
          reruns, and natural backfill capability — but with latency of hours or days. The recommended approach for
          most organizations is to use CDC for operational data synchronization (cache invalidation, search index
          updates, real-time dashboards) and batch ETL for analytical data processing (reporting, compliance,
          historical analysis).
        </p>
        <p>
          CDC versus dual-write patterns is a reliability trade-off. Dual-write patterns — where the application
          writes to both the primary database and the downstream system synchronously — provide strong consistency
          but couple the application to the downstream system&apos;s availability and latency. If the downstream system
          is slow or unavailable, the application&apos;s write is blocked or fails. CDC decouples the application from
          downstream systems: the application writes only to the primary database, and the CDC connector asynchronously
          propagates the change. The trade-off is eventual consistency — downstream systems see the change after a
          delay — but the application&apos;s write path is not affected by downstream system health.
        </p>
        <p>
          Log-based CDC versus trigger-based CDC is an architectural choice with significant performance implications.
          Log-based CDC reads the database&apos;s transaction log, adding minimal overhead to the source database (the
          log is written regardless of whether CDC is enabled). Trigger-based CDC adds triggers to the source tables
          that capture changes into a staging table, adding write overhead to every INSERT, UPDATE, and DELETE
          operation. Log-based CDC is the preferred approach because it has lower overhead on the source database and
          captures all changes including those made by bulk operations or direct SQL that may bypass application-level
          triggers.
        </p>
        <p>
          The choice of CDC tool — Debezium, Canal, Maxwell, or cloud-managed (AWS DMS, GCP Datastream) — is an
          operational trade-off between control and managed complexity. Debezium provides the most features and
          flexibility — support for multiple databases, schema registry integration, Kafka Connect compatibility, and
          active community — but requires operational expertise in connector management and Kafka operations.
          Cloud-managed CDC tools reduce operational burden by handling connector lifecycle, monitoring, and scaling,
          but at a higher cost and with less control over configuration and event format.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Monitor CDC lag continuously and alert when it approaches the database&apos;s log retention window. CDC lag
          is the difference between the database&apos;s current LSN and the connector&apos;s current LSN. When lag approaches
          the log retention window, the database may purge log segments that the connector has not yet read, forcing a
          full snapshot recovery. Set the alert threshold at 50 percent of the log retention window to provide
          sufficient time for investigation and remediation.
        </p>
        <p>
          Use a schema registry with backward compatibility for CDC event schemas. Register the CDC event schema in
          the schema registry and enforce backward compatibility so that new schema versions are compatible with
          consumers that have not yet been updated. This allows downstream consumers to evolve at their own pace
          without being blocked by schema changes in the source database. Reject incompatible schema changes at the
          registry level rather than allowing them to break downstream consumers.
        </p>
        <p>
          Design downstream consumers to be idempotent: applying the same CDC event twice produces the same state
          as applying it once. This is essential because CDC connectors typically provide at-least-once delivery,
          meaning events may be duplicated after connector restarts. Idempotency is achieved by using the event&apos;s
          LSN or transaction ID as a deduplication key: before applying an event, check whether the key has already
          been processed, and skip the event if it has.
        </p>
        <p>
          Use snapshot-based initialization for new consumers rather than replaying the entire change log. When a new
          downstream system needs to consume CDC events for a table, taking a consistent snapshot of the current table
          state and then streaming changes from the snapshot&apos;s LSN is much faster than replaying all historical
          changes. The snapshot provides the current state in a single bulk read, and the streaming phase catches up
          with changes that occurred during the snapshot.
        </p>
        <p>
          Partition CDC topics by the source table&apos;s primary key to ensure ordering guarantees for each row. When
          all changes for a given row go to the same partition, consumers see those changes in commit order, which is
          essential for maintaining correct state. Partitioning by primary key also enables parallel consumption:
          different consumers can process different partitions (different rows) in parallel without coordination.
        </p>
        <p>
          Test CDC pipeline recovery regularly: simulate connector crashes, schema changes, and log truncation to
          verify that the pipeline recovers correctly. Recovery testing should verify that the connector resumes from
          the correct offset after a crash, that schema changes are handled gracefully with the schema registry, and
          that log truncation triggers a snapshot recovery without data loss. Automated recovery tests in the CI/CD
          pipeline catch recovery bugs before they affect production.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Schema changes at the source breaking the CDC connector is the most common operational failure. When a
          column is added, removed, or has its type changed in the source database, the CDC connector may fail to
          parse subsequent change records or emit events with an unexpected schema that downstream consumers cannot
          process. The fix is to use a schema registry with compatibility checks that validate schema changes before
          they are applied, and to design the connector to handle schema evolution gracefully by emitting schema
          change events alongside data change events.
        </p>
        <p>
          Log truncation before the connector catches up forces expensive snapshot recovery. If the connector falls
          behind due to network issues, high load, or a crash, and the database purges old transaction log segments,
          the connector cannot resume from its last offset. The only recovery is to take a full snapshot of the source
          tables and restart streaming from the snapshot&apos;s LSN. This is expensive for large tables and causes a
          period of inconsistency in downstream systems. The fix is continuous lag monitoring with alerts at 50
          percent of the log retention window, and increasing the log retention period if the connector consistently
          operates close to the truncation boundary.
        </p>
        <p>
          Duplicate events from connector restart causing downstream data corruption is a correctness failure that
          occurs when downstream consumers are not idempotent. After a connector restart, events between the last
          committed offset and the restart point are re-emitted, causing consumers to process the same events twice.
          If the consumer applies events non-idempotently (for example, incrementing a counter instead of setting a
          value), the duplicate events produce incorrect state. The fix is to design all downstream consumers with
          idempotent processing — using the CDC event&apos;s LSN or transaction ID as a deduplication key.
        </p>
        <p>
          Ordering violations across partitions causing referential integrity violations is a subtle correctness
          issue. CDC guarantees ordering within a partition but not across partitions. If a consumer processes events
          from multiple partitions and needs to maintain referential integrity (for example, a parent record must
          exist before its child records), it may see a child INSERT before the parent INSERT if they are in different
          partitions. The fix is either to partition related tables by the same key (ensuring parent and child events
          go to the same partition) or to implement application-level ordering logic that buffers and reorders events
          based on their LSN before applying them.
        </p>
        <p>
          Connector resource exhaustion — running out of memory, disk, or network bandwidth — causes the connector to
          slow down or crash, increasing lag and risking log truncation. CDC connectors buffer change events in memory
          before emitting them to the broker, and if the broker is slow or the change volume is high, the buffer can
          fill up. The fix is to monitor connector resource usage (memory, CPU, disk, network), set appropriate
          buffer size limits, and scale the connector&apos;s resources if the change volume consistently exceeds the
          connector&apos;s capacity.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          An e-commerce platform uses CDC to replicate its PostgreSQL order database to a Redis cache layer, an
          Elasticsearch search index, and a Snowflake data warehouse. The Debezium connector reads the PostgreSQL
          WAL and emits change events to Kafka topics partitioned by order ID. The Redis consumer applies INSERT and
          UPDATE events to maintain a cached order record and DELETE events to evict evicted records, achieving
          sub-second cache invalidation. The Elasticsearch consumer maintains a full-text search index of orders,
          enabling customers to search their order history with results that reflect changes within seconds. The
          Snowflake consumer applies events to a fact table for real-time revenue reporting, with a nightly batch
          reconciliation that corrects any discrepancies between the CDC-applied data and the authoritative database
          state.
        </p>
        <p>
          A financial services company uses CDC to replicate its core banking database to a downstream fraud detection
          system. The CDC pipeline captures every account update, transaction, and balance change, streaming them to
          the fraud detection system with end-to-end latency under 500 milliseconds. The fraud detection system
          maintains a real-time risk score for each account, updating it as each transaction arrives. The CDC pipeline
          uses acks all with idempotent producers to ensure that no transaction event is lost or duplicated, and the
          fraud detection system uses the transaction ID from each CDC event as a deduplication key to ensure
          idempotent processing.
        </p>
        <p>
          A SaaS platform uses CDC to implement multi-tenant data synchronization across its microservices. When a
          tenant updates their configuration in the primary database, CDC propagates the change to the configuration
          service&apos;s local cache, the billing service&apos;s pricing engine, and the analytics service&apos;s tenant profile.
          Each service consumes the CDC events independently, applying the configuration change to its own data store
          with eventual consistency. The CDC pipeline uses a schema registry with backward compatibility so that
          services can evolve their configuration schema independently without breaking the CDC pipeline.
        </p>
        <p>
          A healthcare organization uses CDC to replicate patient records from its electronic health record (EHR)
          database to a research data warehouse for anonymized analysis. The CDC pipeline captures every patient
          record change, applies anonymization rules (removing personally identifiable information) in a stream
          processing layer, and writes the anonymized records to the research warehouse. The CDC pipeline is critical
          for this use case because it ensures that the research data reflects the latest patient records without
          requiring batch ETL windows that would delay research by hours or days. The anonymization layer ensures that
          the research data meets HIPAA compliance requirements while preserving the analytical value of the records.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How does CDC differ from dual-write patterns, and when would you choose one over the other?
          </h3>
          <p className="mb-3">
            In a dual-write pattern, the application writes to both the primary database and the downstream system
            synchronously within the same request. This provides strong consistency — both systems are updated before
            the request returns — but couples the application to the downstream system&apos;s availability and latency.
            If the downstream system is slow, the application&apos;s response is slow. If the downstream system is down,
            the application&apos;s write fails.
          </p>
          <p className="mb-3">
            CDC decouples the application from downstream systems by writing only to the primary database and
            asynchronously propagating changes through the transaction log. The application&apos;s write path is not
            affected by downstream system health, and downstream systems can evolve independently. The trade-off is
            eventual consistency — downstream systems see the change after a delay determined by the CDC pipeline&apos;s
            end-to-end latency.
          </p>
          <p>
            Choose dual-write when strong consistency is required — for example, when a payment must be recorded in
            both the transaction database and the ledger before the transaction is considered complete. Choose CDC
            when eventual consistency is acceptable — for example, when updating a search index, cache, or analytics
            pipeline — and when decoupling the application from downstream system health is a priority.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you handle schema evolution in a CDC pipeline without breaking downstream consumers?
          </h3>
          <p className="mb-3">
            Schema evolution in CDC requires a systematic approach centered on a schema registry with compatibility
            enforcement. Every CDC event is associated with a schema version registered in the schema registry. When
            the source database schema changes, the new schema is registered with a compatibility check: backward
            compatibility ensures that new events can be read by consumers using the old schema, forward compatibility
            ensures that old events can be read by consumers using the new schema, and full compatibility ensures both.
          </p>
          <p className="mb-3">
            For additive changes (new columns), backward compatibility is automatic — consumers that do not know about
            the new column simply ignore it. For destructive changes (removed columns), backward compatibility requires
            that the column be deprecated first (marked as optional with a default value) before being removed in a
            subsequent migration. For type changes, a migration strategy is needed: emit both the old and new type
            during a transition period, allowing consumers to migrate at their own pace.
          </p>
          <p>
            Downstream consumers should be designed to handle unknown fields gracefully — ignoring fields they do not
            recognize — so that additive schema changes do not break them. The schema registry should reject
            incompatible schema changes at registration time, preventing the CDC connector from emitting events that
            would break downstream consumers. This catches schema compatibility issues before they reach production.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: What happens when the CDC connector falls behind and the database truncates the transaction log?
          </h3>
          <p className="mb-3">
            When the database truncates the transaction log — purging old log segments to reclaim disk space — and the
            CDC connector has not yet read those segments, the connector cannot resume from its last offset. The change
            records in the truncated segments are permanently lost from the log, and the connector has no way to
            reconstruct them. This is the most severe CDC failure mode because it results in permanent data loss for
            downstream consumers that have not yet processed those changes.
          </p>
          <p className="mb-3">
            The recovery process is snapshot-based: the connector takes a consistent snapshot of the source tables at
            the current state, emits each row as a READ event, and then switches to streaming mode from the snapshot&apos;s
            LSN. Downstream consumers receive the snapshot events and apply them to their data stores, overwriting any
            stale state. The gap between the last processed event and the snapshot represents a period of data loss
            that cannot be recovered from the log.
          </p>
          <p>
            Prevention is the only reliable mitigation: monitor CDC lag continuously and alert when it approaches the
            log retention window (at 50 percent of the retention period), increase the log retention period if the
            connector consistently operates close to the boundary, and investigate and resolve the root cause of the
            lag (network issues, connector resource exhaustion, high change volume) before it reaches the truncation
            point.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you ensure downstream consumers process CDC events idempotently?
          </h3>
          <p className="mb-3">
            Idempotent processing means that applying the same CDC event twice produces the same state as applying it
            once. This is essential because CDC connectors typically provide at-least-once delivery, and events may be
            duplicated after connector restarts, broker retries, or consumer rebalances. The standard approach is to
            use the event&apos;s LSN (log sequence number) or transaction ID as a deduplication key.
          </p>
          <p className="mb-3">
            Before applying a CDC event, the consumer checks whether the deduplication key has already been processed.
            This can be done by maintaining a processed-keys table in the consumer&apos;s data store, or by using the
            key as a conditional write (for example, UPDATE WHERE lsn &gt; current_lsn). If the key has already been
            processed, the event is skipped. If the key has not been processed, the event is applied and the key is
            recorded as processed.
          </p>
          <p>
            For consumers that apply events as upserts (INSERT OR UPDATE), idempotency is naturally achieved because
            applying the same upsert twice produces the same result as applying it once. For consumers that apply
            events as deltas (incrementing a counter, appending to a list), idempotency requires explicit
            deduplication because applying the delta twice produces an incorrect result. The design rule is: prefer
            state-based event application (set the value to X) over delta-based application (increment by Y), because
            state-based application is inherently idempotent.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: Describe how you would design a CDC pipeline for a high-traffic e-commerce order database.
          </h3>
          <p className="mb-3">
            The design starts with the source database: a PostgreSQL cluster with WAL-level logical replication enabled
            and a log retention period of 7 days. The Debezium connector connects as a replication client, reads the
            WAL, and emits change events to Kafka topics partitioned by order ID (the primary key). The topics have a
            replication factor of 3 and acks all for durability, with a retention period of 72 hours.
          </p>
          <p className="mb-3">
            Downstream consumers include: a Redis cache layer that applies INSERT and UPDATE events to maintain cached
            order records and DELETE events to evict them; an Elasticsearch index that maintains a full-text search
            index of orders; a Snowflake data warehouse that applies events to a real-time orders fact table; and a
            fraud detection system that consumes events to update real-time risk scores. Each consumer maintains its
            own offset and processes events idempotently using the LSN as a deduplication key.
          </p>
          <p>
            Monitoring covers CDC lag (alert at 50 percent of the 7-day log retention window, approximately 3.5 days),
            consumer lag per consumer group (alert at 10,000 events behind), connector error rate (alert on any
            exception), and schema change events (alert on incompatible schema changes). Recovery testing is performed
            monthly, simulating connector crashes and verifying that the connector resumes from the correct offset
            and that consumers process re-emitted events idempotently.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Debezium Documentation</strong> — Official documentation covering connector configuration,
            supported databases, schema evolution, and operational best practices for CDC.{' '}
            <a
              href="https://debezium.io/documentation/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              debezium.io/documentation
            </a>
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapter on data system integration
            covering change data capture, event sourcing, and the evolution from batch to stream processing.
            O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Confluent — Change Data Capture with Kafka</strong> — Architectural guide to building CDC
            pipelines with Debezium and Kafka, including schema registry integration and exactly-once semantics.{' '}
            <a
              href="https://www.confluent.io/learn/change-data-capture/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              confluent.io/learn/change-data-capture
            </a>
          </li>
          <li>
            <strong>PostgreSQL Documentation — Logical Decoding</strong> — Technical reference on PostgreSQL&apos;s WAL
            structure, logical replication protocol, and replica identity configuration for CDC.{' '}
            <a
              href="https://www.postgresql.org/docs/current/logicaldecoding.html"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              postgresql.org/docs/current/logicaldecoding
            </a>
          </li>
          <li>
            <strong>Ford et al., &quot;Building Evolutionary Architectures&quot;</strong> — Discusses CDC as an
            integration pattern for decoupling systems and enabling independent evolution of data consumers.
            O&apos;Reilly Media, 2017.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}