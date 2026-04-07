"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-apache-kafka-extensive",
  title: "Apache Kafka",
  description:
    "A practical guide to Kafka's log-based model, partitioning, durability, and the operational decisions that determine correctness and cost.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "apache-kafka",
  wordCount: 5620,
  readingTime: 23,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "streaming", "kafka", "messaging"],
  relatedTopics: ["stream-processing", "message-ordering", "exactly-once-semantics"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Apache Kafka</strong> is a distributed, log-based event streaming platform that provides ordered,
          durable, and replayable message storage with publish-subscribe semantics. At its core, Kafka stores streams of
          records in categories called topics, where each topic is split into partitions that act as append-only,
          ordered logs. Producers write records to topics, consumers read records from topics, and the broker cluster
          manages storage, replication, and delivery guarantees. Kafka&apos;s design enables multiple independent
          consumer groups to read the same topic at their own pace, each maintaining its own offset position — a
          fundamentally different model from traditional message queues where consumption removes the message.
        </p>
        <p>
          The log-based architecture is Kafka&apos;s defining characteristic. Unlike message queues that deliver and
          delete messages, Kafka retains records for a configurable retention period (by time or size) regardless of
          whether they have been consumed. This enables replays, backfills, and reprocessing — capabilities that are
          essential for building reliable data pipelines, debugging production issues, and reconstructing state after
          failures. The log is partitioned for horizontal scalability: each partition is an ordered, immutable sequence
          of records identified by a monotonically increasing offset, and each partition is assigned to exactly one
          broker as its leader.
        </p>
        <p>
          Kafka has evolved from a simple message broker into a complete streaming platform. The core broker handles
          storage, replication, and delivery. Kafka Connect provides connectors for integrating with external systems
          such as databases, file stores, and search engines. Kafka Streams provides a client library for building
          stream processing applications that consume and produce Kafka records. Schema Registry provides schema
          management and compatibility enforcement for the data flowing through topics. Together, these components form
          an ecosystem that supports event-driven architectures, real-time data pipelines, change data capture, stream
          processing, and event sourcing patterns.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Kafka Core Concepts</h3>
          <p className="mb-3">
            A topic is a named stream of records that producers write to and consumers read from. Each topic is divided
            into partitions, which are ordered, immutable sequences of records. The number of partitions determines the
            maximum parallelism of the topic: each partition can be consumed by one consumer within a consumer group,
            so a topic with twelve partitions can be consumed by up to twelve consumers in parallel within a single
            group.
          </p>
          <p>
            Each record within a partition is assigned a sequential offset that is unique within that partition. Offsets
            are not globally unique across the topic — two different partitions each have an offset zero — but they
            define a strict ordering within their partition. Consumer groups maintain their own offset position for each
            partition, allowing independent consumption: group A can be at offset one thousand while group B is at
            offset five hundred on the same partition, each progressing at its own rate.
          </p>
        </div>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Partitioning is the mechanism by which Kafka achieves horizontal scalability and ordering guarantees. Each
          topic has a fixed number of partitions set at creation time, and this number cannot be changed without
          reassigning records (though new partitions can be added, which only affects future records). When a producer
          sends a record to a topic, the partition is determined by the record&apos;s key: if a key is present, the
          partition is computed as the hash of the key modulo the number of partitions; if no key is present, the
          producer uses round-robin or sticky partitioning to distribute records across partitions.
        </p>
        <p>
          The key-based partitioning strategy provides ordering guarantees: all records with the same key are written to
          the same partition, and within that partition, they are strictly ordered by offset. This is essential for
          use cases such as processing all events for a single user or account in order. However, it also creates the
          potential for partition skew: if one key produces significantly more records than others, its partition
          becomes a hotspot that receives disproportionate write and read load, while other partitions remain
          underutilized.
        </p>
        <p>
          Replication provides durability and fault tolerance. Each partition has a configurable replication factor,
          meaning its records are stored on multiple brokers. One broker is the leader for the partition, handling all
          read and write requests for that partition. The other brokers are followers, replicating the leader&apos;s
          log asynchronously. The In-Sync Replica (ISR) set tracks which followers are currently caught up with the
          leader. A partition can tolerate the failure of any broker that is not the sole leader for any partition, and
          if the leader fails, one of the ISR members is promoted to leader through a controller-coordinated election.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/apache-kafka-diagram-1.svg"
          alt="Kafka architecture showing producers writing to topic partitions and multiple consumer groups reading independently"
          caption="Kafka architecture: producers append to partitioned topic logs; consumer groups read independently, each maintaining its own offset per partition."
        />
        <p>
          Delivery semantics in Kafka are determined by the producer&apos;s acknowledgment configuration and the
          consumer&apos;s commit strategy. Producers can operate in three modes: fire-and-forget (acks equals zero),
          where the producer does not wait for broker acknowledgment; leader acknowledgment (acks equals one), where the
          producer waits for the leader to write the record; and full ISR acknowledgment (acks equals all), where the
          producer waits for all in-sync replicas to acknowledge the write. The choice determines the trade-off between
          latency and durability: acks zero offers the lowest latency but risks data loss if the broker fails, while
          acks all offers the strongest durability guarantee but with higher latency.
        </p>
        <p>
          Consumer offset management determines delivery semantics from the consumer side. When a consumer reads
          records, it periodically commits its current offset back to Kafka. If offsets are committed after processing,
          the consumer provides at-least-once semantics: if the consumer fails after reading but before committing, it
          will re-read and re-process the same records on restart. If offsets are committed before processing, the
          consumer provides at-most-once semantics: if the consumer fails after committing but before processing, the
          records are lost. Exactly-once semantics require coordination between the producer and consumer — specifically,
          the use of idempotent producers and transactional writes — which Kafka supports through its transaction API but
          with important limitations around scope and performance.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/apache-kafka-diagram-2.svg"
          alt="Kafka replication model showing leader and follower partitions across three brokers with ISR tracking"
          caption="Kafka replication: each partition has one leader that handles all reads and writes, with followers replicating the leader's log. ISR tracks which replicas are caught up."
        />
        <p>
          Retention policies determine how long records are stored. Kafka supports time-based retention (delete records
          older than a configured duration), size-based retention (delete records when the partition exceeds a configured
          size), and log compaction (retain only the latest record for each key). Time and size retention are suitable
          for event streaming where all records are meaningful and the log acts as a buffer. Log compaction is suitable
          for change data capture and state materialization where only the latest value for each key matters — the
          compaction process periodically scans the log and removes older records for the same key, leaving only the
          most recent version.
        </p>
        <p>
          The Kafka controller is a special broker elected by the cluster that manages partition leadership, broker
          membership, and topic metadata. The controller receives notifications when brokers join or leave the cluster,
          triggers leader elections when leaders fail, and propagates metadata updates to all brokers. Only one broker
          serves as controller at a time, with ZooKeeper or the Kafka Raft metadata quorum providing the election
          mechanism. The controller is a critical component: if it fails, the cluster continues to serve reads and
          writes for existing partitions, but it cannot perform leadership changes or topic management until a new
          controller is elected.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The Kafka architecture follows a producer-broker-consumer model with a log-based storage layer. Producers
          batch records and send them to the broker cluster, which appends them to the appropriate partition log. The
          broker acknowledges the write to the producer according to the configured acknowledgment level. Consumers
          poll records from partitions, processing them in offset order within each partition, and periodically commit
          their offset positions back to the broker.
        </p>
        <p>
          The producer&apos;s write path is optimized for throughput through batching and compression. The producer
          collects records in memory buffers per partition, and when a batch reaches a configured size or time
          threshold, it is sent to the broker as a single request. This reduces the per-record overhead of network
          round trips and allows the broker to write records in large, sequential I/O operations. Compression —
          typically using Snappy, LZ4, or Zstandard — is applied to the batch before transmission, reducing network
          bandwidth and broker storage cost at the expense of CPU cycles on the producer and consumer sides.
        </p>
        <p>
          The broker&apos;s storage path is designed around sequential I/O and page cache utilization. Each partition
          is stored as a series of segment files on disk, and new records are appended to the active segment. The
          broker does not maintain an in-memory index of records; instead, it relies on the operating system&apos;s
          page cache to keep recently accessed segments in memory, and it uses zero-copy I/O (sendfile) to transfer
          records from disk to the network socket without copying through user-space buffers. This design makes Kafka
          remarkably efficient: a single broker can handle hundreds of megabytes per second of throughput with modest
          hardware.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/apache-kafka-diagram-3.svg"
          alt="Kafka producer delivery semantics showing acks=0, acks=1, and acks=all trade-offs, plus retry and idempotence flow"
          caption="Producer delivery semantics: acks level trades off latency against durability. Idempotent producers prevent duplicate writes during retries within a partition."
        />
        <p>
          The consumer&apos;s read path supports both sequential scanning and random access. Consumers read records in
          offset order within each partition, and they can seek to any offset — enabling replays, backfills, and
          debugging. When a consumer group subscribes to a topic, the group coordinator assigns each partition in the
          topic to exactly one consumer in the group. If there are more partitions than consumers, some consumers handle
          multiple partitions. If there are more consumers than partitions, the excess consumers are idle. This means
          that scaling consumer parallelism requires increasing the number of partitions, which is why partition count
          is a critical capacity-planning decision.
        </p>
        <p>
          Consumer group rebalancing occurs when consumers join or leave the group, or when topic partitions change.
          During a rebalance, partition ownership is reassigned among consumers, and consumers temporarily pause
          processing while the new assignment takes effect. Rebalancing introduces a processing gap — the period during
          which no consumer is actively processing the reassigned partitions — so minimizing rebalance frequency and
          duration is an operational priority. Incremental cooperative rebalancing (introduced in recent Kafka versions)
          reduces the impact by allowing consumers to continue processing partitions that are not being reassigned,
          rather than pausing all processing during the entire rebalance.
        </p>
        <p>
          The replication flow between leader and follower brokers is asynchronous but bounded. Followers fetch records
          from the leader in batches, maintaining their own position in the leader&apos;s log. The leader tracks which
          followers are within a configurable lag threshold and includes them in the ISR set. When a producer uses acks
          all, it waits for acknowledgment from the leader and all ISR members. If a follower falls behind the leader
          beyond the lag threshold, it is removed from the ISR, which reduces the durability guarantee but allows the
          producer to continue writing without waiting for the slow follower to catch up.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          The choice of partition count is the most consequential architectural decision in Kafka because it determines
          the maximum consumer parallelism, the ordering granularity, and the rebalancing cost. More partitions enable
          more consumers to process records in parallel, which is essential for high-throughput topics. However, more
          partitions also increase the broker&apos;s metadata overhead, the time required for leader elections, and the
          cost of rebalancing. Each partition requires file handles, memory for segment management, and metadata tracking
          on the broker. A cluster with tens of thousands of partitions will experience slower leader elections, longer
          recovery times after broker failures, and more expensive rebalances.
        </p>
        <p>
          The recommended approach is to estimate the maximum throughput per partition (typically ten to one hundred
          megabytes per second for a well-sized broker) and the maximum consumer parallelism needed, then set the
          partition count to satisfy both constraints with headroom for growth. Over-partitioning — creating far more
          partitions than needed — is a common mistake that increases operational cost without providing benefit.
          Under-partitioning — creating too few partitions to support the required consumer parallelism — is harder to
          fix because adding partitions does not redistribute existing records and changes the partitioning function,
          which breaks key-based ordering for future records.
        </p>
        <p>
          The acknowledgment level trade-off between latency and durability is central to Kafka operational decisions.
          Acks zero provides the lowest latency but risks silent data loss if the broker fails between receiving the
          record and writing it to disk. Acks one provides a reasonable default: the leader acknowledges after writing
          the record, so the record is durable on one broker, but it can be lost if the leader fails before replication
          completes. Acks all provides the strongest guarantee: the record is acknowledged only after all in-sync
          replicas have written it, so it can be lost only if all ISR members fail simultaneously. Combined with
          min.insync.replicas set to two or more, acks all ensures that the loss of a single broker does not cause data
          loss.
        </p>
        <p>
          Kafka versus traditional message queues (such as RabbitMQ or ActiveMQ) represents a fundamental architectural
          choice. Traditional message queues deliver messages to consumers and remove them upon acknowledgment, providing
          point-to-point delivery with per-message acknowledgment and flexible routing patterns. Kafka retains messages
          in a log, providing pub-sub delivery with consumer-managed offsets and replay capability. Kafka excels at
          high-throughput, durable event streaming with multiple independent consumers. Traditional message queues excel
          at complex routing, per-message acknowledgment, and work-queue semantics where each message is consumed
          exactly once by one consumer. The choice depends on whether the use case requires log-based replay and
          multi-consumer independence (Kafka) or complex routing and per-message work distribution (traditional queue).
        </p>
        <p>
          Kafka versus cloud-managed alternatives (such as Amazon Kinesis, Google Pub/Sub, and Azure Event Hubs) is
          primarily an operational trade-off. Self-managed Kafka provides maximum control over configuration, scaling,
          and cost, but requires operational expertise in cluster management, monitoring, and capacity planning.
          Cloud-managed alternatives reduce operational burden by handling broker management, scaling, and monitoring,
          but at a higher per-unit cost and with less flexibility in configuration. For organizations with dedicated
          infrastructure teams and predictable, high-volume workloads, self-managed Kafka is often more cost-effective.
          For organizations prioritizing developer velocity over operational control, cloud-managed alternatives
          provide a faster path to production.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Set partition count based on maximum throughput and consumer parallelism requirements with headroom for
          growth. Estimate the throughput per partition that your broker hardware can sustain, the maximum number of
          consumers that will need to process the topic in parallel, and the expected growth over the next twelve to
          eighteen months. Set the partition count to satisfy the maximum of these constraints, and avoid changing it
          after the topic is in production because adding partitions changes the partitioning function and breaks
          key-based ordering for future records.
        </p>
        <p>
          Use acks all with min.insync.replicas set to two or more for topics where data loss is unacceptable. This
          combination ensures that records are acknowledged only after they have been written to at least two brokers,
          so the loss of a single broker cannot cause data loss. For topics where occasional data loss is acceptable —
          such as metrics or log aggregation — acks one provides a reasonable default with lower latency. Acks zero
          should be used sparingly, only for data where the producer can regenerate the records or where loss is
          genuinely inconsequential.
        </p>
        <p>
          Enable idempotent producers (enable.idempotence equals true) to prevent duplicate records during retries.
          Without idempotence, a producer that retries after a transient error may write the same record twice, causing
          duplicates in the topic. With idempotence enabled, the producer assigns a sequence number to each record, and
          the broker deduplicates based on sequence numbers, ensuring that each record is written exactly once within
          a partition. This is essential for at-least-once producer configurations that retry on failure.
        </p>
        <p>
          Monitor consumer lag continuously and alert when lag exceeds defined thresholds. Consumer lag is the
          difference between the latest offset in a partition and the offset committed by a consumer group. Rising lag
          indicates that the consumer is not keeping up with the production rate, which may be caused by slow consumer
          processing, consumer failures, or increased production volume. Lag monitoring should be per-consumer-group
          and per-partition, because aggregate lag can hide the fact that one partition is severely behind while others
          are current.
        </p>
        <p>
          Use log compaction for topics that represent change streams rather than event streams. When the topic&apos;s
          purpose is to maintain the latest state for each key — such as the current state of a database row or the
          latest configuration value — log compaction ensures that only the latest record for each key is retained,
          preventing unbounded storage growth while maintaining the ability to reconstruct the latest state by scanning
          the log from the beginning.
        </p>
        <p>
          Plan for broker failures by ensuring that the replication factor and min.insync.replicas are set so that the
          loss of one or more brokers does not cause data loss or service interruption. A replication factor of three
          with min.insync.replicas of two can tolerate the loss of one broker without data loss. Monitor the ISR set
          size and alert when it falls below the configured minimum, because a reduced ISR means reduced durability.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Underestimating partition count and being unable to increase it without breaking ordering is the most common
          Kafka capacity planning failure. The partition count determines maximum consumer parallelism, and adding
          partitions after records exist changes the partition assignment for future keyed records, breaking the
          guarantee that records with the same key go to the same partition. The result is that after adding partitions,
          consumers that rely on key-based ordering will see records for the same key arriving from different partitions
          in potentially inconsistent order. The fix is to plan partition count conservatively and to create new topics
          with the correct partition count when re-partitioning is needed, migrating consumers to the new topic.
        </p>
        <p>
          Ignoring consumer lag until it causes processing delays is a common operational failure. Consumer lag grows
          silently when the consumer processing rate falls below the production rate, and it may not be noticed until
          the lag is large enough to cause downstream issues — such as stale data in materialized views, delayed
          alerting, or exceeded retention causing records to be deleted before the consumer processes them. The fix is
          continuous consumer lag monitoring with alerts at defined thresholds, and auto-scaling consumer instances
          when lag exceeds a target.
        </p>
        <p>
          Setting acks one without understanding the data loss risk during leader failure is a durability pitfall.
          With acks one, the producer receives acknowledgment after the leader writes the record, but before followers
          replicate it. If the leader fails at this moment, the unreplicated record is lost. For topics where data loss
          is unacceptable, acks all with min.insync.replicas set appropriately is required. The cost is higher latency
          because the producer waits for all ISR members to acknowledge, but this cost is the price of durability.
        </p>
        <p>
          Rebalancing storms caused by unstable consumer membership or aggressive session timeouts disrupt processing
          and increase latency. When a consumer fails to send a heartbeat within the session timeout, it is removed
          from the group and a rebalance is triggered. If the session timeout is too aggressive relative to consumer
          processing time or GC pauses, healthy consumers may be mistakenly removed, triggering unnecessary rebalances.
          The fix is to set the session timeout and max.poll.interval.ms based on actual consumer behavior, and to use
          static group membership (group.instance.id) for consumers that should survive temporary disconnections
          without triggering a rebalance.
        </p>
        <p>
          Disk space exhaustion due to inadequate retention configuration or unexpected production volume is a common
          infrastructure failure. Kafka retains records until the retention policy triggers deletion, so if the
          production volume increases unexpectedly or the retention period is set too long, disk usage can grow faster
          than anticipated. The fix is to monitor disk usage per broker, set retention limits based on available disk
          capacity, and implement alerts when disk usage exceeds a defined percentage of total capacity.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses Kafka as the central event backbone for its order processing pipeline. When
          an order is placed, the order service publishes an OrderCreated event to the orders topic, partitioned by
          customer ID. The payment service consumes this event, processes the payment, and publishes a PaymentCompleted
          event. The fulfillment service consumes both events, prepares the shipment, and publishes a ShipmentCreated
          event. The analytics service consumes all events to update real-time dashboards showing order volume, revenue,
          and fulfillment rate. The orders topic has forty-eight partitions to support the maximum consumer
          parallelism needed during peak events, with a replication factor of three and acks all for durability. The
          consumer lag for the payment service is monitored continuously, and the platform auto-scales payment service
          consumers when lag exceeds five thousand records.
        </p>
        <p>
          A financial services company uses Kafka for change data capture, streaming database changes from its core
          transactional databases to downstream systems including data warehouses, search indices, and cache layers.
          Debezium connectors read the database transaction log and publish change events to Kafka topics, one per
          table. Log compaction is enabled on these topics so that only the latest state for each row is retained,
          allowing downstream consumers to reconstruct the latest table state by scanning from the beginning of the log.
          The CDC pipeline uses acks all with min.insync.replicas of three to ensure that no database change is lost
          during broker failures, and the consumer lag is monitored with alerts at one thousand records to ensure that
          downstream systems do not fall significantly behind the source database.
        </p>
        <p>
          A ride-sharing platform uses Kafka for real-time location streaming, where driver and rider location updates
          are published to a location-events topic at a rate of millions of events per minute. The topic has one
          hundred ninety-two partitions to support the high throughput, with a retention period of twenty-four hours
          because historical location data is not needed beyond the current operational day. The dispatch service
          consumes location events to match riders with nearby drivers, the pricing service consumes them to calculate
          surge pricing based on driver density, and the analytics service consumes them for real-time operational
          dashboards. The platform uses acks one for location events because occasional data loss is acceptable — a
          missed location update is quickly superseded by the next one — and the lower latency of acks one is more
          valuable than the durability guarantee of acks all.
        </p>
        <p>
          A media streaming platform uses Kafka for user activity tracking, capturing events such as play, pause, seek,
          and stop from millions of concurrent users. These events are partitioned by user ID so that each
          user&apos;s activity stream is ordered, which is essential for computing watch time and session duration
          correctly. The events are consumed by a real-time analytics pipeline that computes per-user and per-content
          engagement metrics, a recommendation system that updates user preferences based on recent activity, and a
          billing system that tracks premium content views. The activity-events topic uses log compaction with a
          tombstone mechanism to expire events older than seven days, keeping storage costs manageable while providing
          sufficient history for session reconstruction and replay.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How does Kafka guarantee ordering within a partition, and why does ordering not hold across partitions?
          </h3>
          <p className="mb-3">
            Kafka guarantees strict ordering within a partition because each partition is an append-only log with
            monotonically increasing offsets. When a producer writes records to a partition, the broker appends them
            sequentially and assigns consecutive offsets. Consumers read records from the partition in offset order,
            so they see records in the exact order they were written. This ordering guarantee is fundamental to
            Kafka&apos;s design and is enforced by the fact that each partition has a single leader that handles all
            writes — there is no concurrent writing to the same partition from multiple brokers.
          </p>
          <p className="mb-3">
            Ordering does not hold across partitions because each partition is an independent log managed by a
            potentially different broker. There is no global coordination of offsets across partitions, and no
            mechanism to establish a total order of records written to different partitions simultaneously. Two
            records written to different partitions at the same time may be observed in different orders by different
            consumers, depending on the relative timing of their reads from each partition.
          </p>
          <p>
            The practical implication is that if ordering matters for a set of records, they must share the same
            partition key so that they are written to the same partition. This is why Kafka&apos;s partitioning
            function is based on the record key: records with the same key go to the same partition, preserving their
            order. Records without a key are distributed across partitions using round-robin or sticky partitioning,
            which does not preserve any ordering.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you handle consumer lag when a consumer group falls behind the production rate?
          </h3>
          <p className="mb-3">
            The first step is to diagnose the cause of the lag. If the consumer processing is slow — each record takes
            too long to process — the solution is to optimize the consumer logic: batch processing, reduce I/O, cache
            lookups, or move expensive operations off the critical path. If the production rate has increased beyond
            the consumer&apos;s maximum capacity, the solution is to increase consumer parallelism by adding more
            consumers to the group, up to the number of partitions in the topic.
          </p>
          <p className="mb-3">
            If the consumer group has fewer consumers than partitions, adding consumers will increase parallelism
            because each new consumer is assigned additional partitions. However, if the consumer group already has as
            many consumers as partitions, adding more consumers will not help because the excess consumers will be idle.
            In this case, the only option is to increase the number of partitions — which, as noted, breaks key-based
            ordering for future records — or to optimize the consumer processing to handle the increased rate.
          </p>
          <p>
            For transient lag spikes, increasing the consumer&apos;s max.poll.records configuration allows the consumer
            to process more records per poll, reducing the overhead of poll calls and potentially increasing throughput.
            For sustained lag, the consumer group should be auto-scaled based on lag thresholds, with upper and lower
            bounds to prevent over-scaling and thrashing. After the lag is reduced, the consumer group should be
            scaled back down to the baseline to avoid unnecessary resource cost.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: What are the trade-offs between acks=0, acks=1, and acks=all, and when would you use each?
          </h3>
          <p className="mb-3">
            Acks=0 (fire and forget) provides the lowest latency because the producer does not wait for any broker
            acknowledgment. The trade-off is that the producer has no confirmation that the record was received or
            stored, so data loss is possible if the broker fails between receiving the record and writing it to disk.
            Use acks=0 only for data where loss is genuinely inconsequential — such as metrics, health checks, or
            heartbeat events — and where the producer cannot or should not retry on failure.
          </p>
          <p className="mb-3">
            Acks=1 (leader acknowledgment) provides a reasonable default for most use cases. The producer waits for
            the leader broker to acknowledge the write, which means the record has been written to at least one
            broker&apos;s disk. The trade-off is that if the leader fails before replication completes, the record is
            lost. Use acks=1 for data where occasional loss is acceptable but where some durability is preferred —
            such as user activity events, log entries, or non-critical notifications.
          </p>
          <p>
            Acks=all (full ISR acknowledgment) provides the strongest durability guarantee. The producer waits for
            all in-sync replicas to acknowledge the write, which means the record has been written to multiple
            brokers&apos; disks. Combined with min.insync.replicas set to two or more, this ensures that the loss of
            a single broker cannot cause data loss. The trade-off is higher latency because the producer waits for the
            slowest ISR member to acknowledge. Use acks=all for data where loss is unacceptable — such as financial
            transactions, order events, billing records, or compliance logs.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How does Kafka log compaction work, and when would you use it over time-based retention?
          </h3>
          <p className="mb-3">
            Log compaction retains only the latest record for each key in a partition, removing older records with the
            same key. The compaction process runs periodically in the background, scanning the log for duplicate keys
            and deleting all but the most recent record for each key. A special tombstone record — a record with a key
            but a null value — signals that the key should be deleted entirely, removing even the latest record for
            that key from the compacted log.
          </p>
          <p className="mb-3">
            Log compaction is useful when the topic represents a change stream — a sequence of updates to a set of
            keyed values — rather than an event stream where every record is independently meaningful. For example, a
            topic that carries database change events for a users table benefits from compaction because the latest
            value for each user ID is what matters for reconstructing the current state. A topic that carries click
            events does not benefit from compaction because every click is an independent event that should be retained.
          </p>
          <p>
            Time-based retention is preferable when all records are independently meaningful and the value of records
            decreases over time. For example, a topic carrying monitoring metrics benefits from time-based retention
            because each metric reading is independently valuable for trend analysis, and the value of older readings
            diminishes gradually. The choice between compaction and time-based retention is determined by the semantic
            meaning of the records: are they updates to keyed state (compaction) or independent events (time-based)?
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: Describe how you would design a Kafka topic for a high-traffic e-commerce order pipeline.
          </h3>
          <p className="mb-3">
            The design starts with capacity planning. I would estimate the peak order rate — for example, ten thousand
            orders per minute during a sales event — and the maximum consumer parallelism needed. The payment service
            might need sixteen consumers, the fulfillment service eight, and the analytics service twelve. The
            partition count must be at least the maximum of these, so I would set it to forty-eight partitions with a
            replication factor of three for durability.
          </p>
          <p className="mb-3">
            The partition key would be the customer ID so that all orders for the same customer are processed in order
            by each consumer group. Producers would use acks=all with min.insync.replicas of two to ensure that no
            order event is lost during broker failures, and idempotent producers would be enabled to prevent duplicate
            orders during retries. The retention policy would be time-based at seven days, providing sufficient history
            for replay and debugging without unbounded storage growth.
          </p>
          <p>
            Consumer lag would be monitored continuously with alerts at thresholds of one thousand records for the
            payment service and five thousand for the analytics service, reflecting their different SLA requirements.
            Auto-scaling would be configured for the payment service consumers to handle traffic spikes, with a minimum
            of eight and a maximum of thirty-two consumers. The cluster would have at least six brokers to distribute
            the forty-eight partitions and their replicas evenly, with monitoring for disk usage, ISR set size, and
            broker health to ensure the cluster can tolerate the loss of one or two brokers without impact.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Apache Kafka Documentation</strong> — Official documentation covering architecture, configuration,
            operations, and APIs.{' '}
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              kafka.apache.org/documentation
            </a>
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapters on log-based message brokers,
            partitioning, replication, and the trade-offs between different messaging patterns. O&apos;Reilly Media,
            2017.
          </li>
          <li>
            <strong>Kreps, &quot;I Heart Logs&quot;</strong> — Jay Kreps&apos;s essay collection on log-based
            architecture, the rationale behind Kafka&apos;s design, and the evolution of event streaming. O&apos;Reilly
            Media, 2014.{' '}
            <a
              href="https://www.oreilly.com/library/view/i-heart-logs/9781491909973/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              oreilly.com/library/view/i-heart-logs
            </a>
          </li>
          <li>
            <strong>Confluent Kafka Documentation</strong> — Operational guides, best practices, and deep dives into
            Kafka internals, including replication, leader election, and consumer group management.{' '}
            <a
              href="https://docs.confluent.io/platform/current/kafka/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs.confluent.io/platform/current/kafka
            </a>
          </li>
          <li>
            <strong>Neha Narkhede et al., &quot;Kafka: a Distributed Messaging System for Log Processing&quot;</strong>
            — The original Kafka design paper describing the log-based architecture, partitioning, and replication
            model.{' '}
            <a
              href="https://www.linkedin.com/pulse/kafka-distributed-messaging-system-log-processing-neha-narkhede/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Original NetCrafts paper
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}