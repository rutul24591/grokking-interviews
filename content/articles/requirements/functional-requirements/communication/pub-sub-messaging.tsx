"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-pubsub-messaging",
  title: "Pub/Sub Messaging",
  description:
    "Comprehensive guide to implementing Publish-Subscribe messaging covering topic-based routing, message brokers, delivery guarantees, scaling subscriber fan-out, and event-driven architecture patterns for distributed systems.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "pub-sub-messaging",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "communication",
    "pubsub",
    "messaging",
    "backend",
    "event-driven",
    "distributed-systems",
  ],
  relatedTopics: ["real-time-broadcasting", "websocket-server", "messaging-service", "event-sourcing"],
};

export default function PubSubMessagingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Publish-Subscribe (Pub/Sub) messaging enables decoupled communication where publishers send messages to topics without knowing subscribers, and subscribers receive messages from topics without knowing publishers. This many-to-many communication pattern is fundamental to event-driven architectures, enabling microservices to react to events without direct dependencies. Pub/Sub powers notification systems, event streaming, real-time analytics, and distributed system coordination.
        </p>
        <p>
          The complexity of Pub/Sub systems stems from delivery guarantees, ordering requirements, and scaling challenges. Messages must be delivered reliably (at-least-once, exactly-once). Ordering must be preserved within topics or partitions. Subscriber fan-out must scale to thousands of subscribers per topic. Backpressure handling prevents slow subscribers from blocking fast publishers. The system must handle traffic spikes, partition failures, and subscriber churn gracefully.
        </p>
        <p>
          For staff and principal engineers, Pub/Sub architecture involves distributed systems trade-offs. Consistency vs availability (CAP theorem) affects delivery semantics. Partitioning strategy determines scalability and ordering guarantees. Consumer group management enables parallel processing with load balancing. Dead letter queues handle poison messages. Monitoring must track message lag, delivery latency, and throughput. The architecture must support replay (reprocessing old messages) for debugging and recovery.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Pub/Sub Patterns</h3>
        <p>
          Topic-based Pub/Sub: Publishers send to named topics, subscribers subscribe to topics. Simple, intuitive. Topics are logical channels. Subscribers receive all messages from subscribed topics. Used for: notifications, event distribution, chat rooms.
        </p>
        <p>
          Content-based Pub/Sub: Messages delivered based on content, not topic. Subscribers define filters (SQL-like expressions). Broker evaluates filters, routes accordingly. More flexible, higher broker complexity. Used for: trading systems, complex event processing.
        </p>
        <p>
          Hierarchical topics: Topics organized in hierarchy (sports/football/premier-league). Subscribers can subscribe to wildcards (sports/football/*). Enables granular subscriptions. Used for: news categorization, IoT sensor data.
        </p>
        <p>
          Event streaming: Messages appended to log, subscribers read at own pace. Retention policy keeps messages (hours to forever). Subscribers track offset (position in log). Used for: Kafka, event sourcing, audit logs.
        </p>

        <h3 className="mt-6">Delivery Guarantees</h3>
        <p>
          At-most-once: Message delivered once or not at all. No retry on failure. Fire-and-forget. Pros: Lowest latency, no duplicates. Cons: Message loss acceptable only for low-value data (metrics, logs). Used for: telemetry, presence updates.
        </p>
        <p>
          At-least-once: Message guaranteed to deliver, may duplicate. Retry until acknowledgment. Pros: No message loss. Cons: Duplicates require idempotent consumers. Used for: most production systems (notifications, events).
        </p>
        <p>
          Exactly-once: Message delivered exactly once, no loss, no duplicates. Pros: Ideal semantics. Cons: High complexity, performance cost, often impractical. Implementation: distributed transactions, consensus. Used for: financial transactions, critical updates.
        </p>

        <h3 className="mt-6">Message Brokers</h3>
        <p>
          Redis Pub/Sub: In-memory, low latency (&lt;1ms). Simple publish/subscribe commands. No persistence (messages lost if no subscribers). Used for: real-time features, chat, notifications. Limitations: no durability, limited scaling.
        </p>
        <p>
          Apache Kafka: Distributed log, high throughput (millions/sec). Persistent storage (configurable retention). Partitioned for parallelism. Consumer groups for load balancing. Used for: event streaming, log aggregation, audit trails.
        </p>
        <p>
          NATS: Lightweight, high performance. Simple protocol, multiple delivery semantics. NATS Streaming adds persistence. Used for: microservices communication, IoT, cloud-native applications.
        </p>
        <p>
          RabbitMQ: Full-featured message broker. AMQP protocol, exchanges, queues, bindings. Supports pub/sub via fanout exchanges. Persistence, routing, dead letter queues. Used for: enterprise messaging, task queues.
        </p>
        <p>
          Google Cloud Pub/Sub: Managed service, global scale. At-least-once delivery, ordering keys. Automatic scaling, no ops overhead. Used for: GCP-native applications, event-driven architectures.
        </p>

        <h3 className="mt-6">Subscription Models</h3>
        <p>
          Push subscription: Broker pushes messages to subscriber endpoint (webhook, HTTP callback). Pros: Low latency, no polling. Cons: Subscriber must expose endpoint, firewall/NAT issues. Used for: webhooks, server-to-server.
        </p>
        <p>
          Pull subscription: Subscriber polls broker for messages. Pros: Subscriber controls rate, no exposed endpoint. Cons: Polling overhead, latency. Used for: Kafka consumers, batch processing.
        </p>
        <p>
          Streaming subscription: Persistent connection (WebSocket, long-lived TCP), broker streams messages. Pros: Low latency, bidirectional. Cons: Connection management complexity. Used for: real-time clients, WebSocket subscribers.
        </p>

        <h3 className="mt-6">Consumer Groups</h3>
        <p>
          Consumer group: Multiple consumers share subscription load. Messages distributed across group members (load balancing). Each message processed by one consumer in group. Enables horizontal scaling of consumption.
        </p>
        <p>
          Partition assignment: Topics partitioned, partitions assigned to consumers. One partition → one consumer (within group). Rebalancing on consumer join/leave. Used for: Kafka, parallel processing.
        </p>
        <p>
          Offset management: Consumers track position in partition (offset). Committed to broker for recovery. On restart, resume from committed offset. Used for: exactly-once processing, recovery.
        </p>

        <h3 className="mt-6">Message Ordering</h3>
        <p>
          Total ordering: All messages across all topics ordered globally. Complex, requires centralized sequencer. Used for: distributed transactions, consensus.
        </p>
        <p>
          Partition ordering: Messages within partition ordered, no ordering across partitions. Scalable (partitions processed in parallel). Used for: Kafka, most event streaming.
        </p>
        <p>
          Key-based ordering: Messages with same key routed to same partition, ordered within partition. Enables ordering for related messages (same user, same order). Used for: user event streams, order lifecycle.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Pub/Sub architecture spans publishers, message broker, topics/partitions, and subscribers. Publishers send messages to broker. Broker routes to topics, persists if required. Subscribers receive from topics via push, pull, or streaming. Consumer groups enable parallel processing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/pub-sub-messaging/pubsub-architecture.svg"
          alt="Pub/Sub Architecture"
          caption="Figure 1: Pub/Sub Architecture — Publishers, message broker, topics, and subscribers with consumer groups"
          width={1000}
          height={500}
        />

        <h3>Publisher Flow</h3>
        <p>
          Message creation: Publisher creates message with payload, metadata (timestamp, correlation ID, key). Key determines partition (for partitioned systems). Serialization (JSON, Protobuf, Avro).
        </p>
        <p>
          Publish API: Send to broker via client library or HTTP. Synchronous (wait for ack) or asynchronous (fire-and-forget). Batch publishing for throughput (multiple messages per request).
        </p>
        <p>
          Acknowledgment: Broker acknowledges receipt (not delivery). Ack confirms message persisted/queued. Publisher retries on timeout. Idempotency key prevents duplicates on retry.
        </p>

        <h3 className="mt-6">Broker Internals</h3>
        <p>
          Topic management: Topics created on first publish or pre-provisioned. Topic metadata (partitions, retention, replication factor). Access control (who can publish/subscribe).
        </p>
        <p>
          Message routing: Route message to topic partitions. Partition selection: round-robin (load balancing), key-based (ordering), sticky (affinity). Replicate to followers (for durability).
        </p>
        <p>
          Persistence: Write-ahead log for durability. Append-only log (Kafka) or queue (RabbitMQ). Retention policy (time-based, size-based). Compaction (keep latest per key).
        </p>
        <p>
          Subscriber dispatch: Push to subscribed endpoints. Queue for pull consumers. Track delivery status (acked, pending, failed). Retry failed deliveries.
        </p>

        <h3 className="mt-6">Subscriber Flow</h3>
        <p>
          Subscription creation: Subscribe to topic (or pattern). Specify consumer group (for load balancing). Configure delivery options (batch size, poll interval).
        </p>
        <p>
          Message consumption: Receive messages (push) or poll (pull). Process message (business logic). Acknowledge on success. Negative ack on failure (requeue or dead letter).
        </p>
        <p>
          Offset commit: For pull-based (Kafka), commit offset after processing. Auto-commit (periodic) or manual commit (after processing). On restart, resume from committed offset.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/pub-sub-messaging/message-flow.svg"
          alt="Message Flow"
          caption="Figure 2: Message Flow — Publish, route, persist, dispatch, and acknowledge"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Consumer Group Management</h3>
        <p>
          Group coordination: Broker tracks group members. Leader election (one consumer coordinates). Partition assignment algorithm (range, round-robin, sticky). Rebalance on member join/leave.
        </p>
        <p>
          Rebalancing: Stop consumption, reassign partitions, resume. Cooperative rebalancing (incremental, less disruption). Rebalance storm prevention (throttle rebalances).
        </p>
        <p>
          Offset storage: Offsets stored in broker (Kafka: __consumer_offsets topic) or external (ZooKeeper). Replicated for durability. Query offset for lag monitoring.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/pub-sub-messaging/consumer-groups.svg"
          alt="Consumer Groups"
          caption="Figure 3: Consumer Groups — Partition assignment, load balancing, and rebalancing"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Pub/Sub design involves trade-offs between latency, throughput, durability, ordering, and complexity. Understanding these trade-offs enables informed decisions aligned with reliability requirements and operational capabilities.
        </p>

        <h3>Broker: Managed vs Self-Hosted</h3>
        <p>
          Managed (Cloud Pub/Sub, Confluent Cloud, Amazon MSK): Pros: No ops overhead, automatic scaling, built-in monitoring, SLA. Cons: Vendor lock-in, higher cost at scale, less control. Best for: Most applications, teams without messaging expertise.
        </p>
        <p>
          Self-hosted (Kafka, RabbitMQ, NATS): Pros: Full control, cost optimization, no vendor lock-in. Cons: Operational complexity, scaling manual, on-call burden. Best for: Large scale (cost-sensitive), regulatory requirements, existing expertise.
        </p>
        <p>
          Hybrid: Self-hosted with managed control plane. Pros: Balance of control and ops ease. Cons: Complexity of both. Best for: Large organizations with platform teams.
        </p>

        <h3>Delivery: At-Least-Once vs Exactly-Once</h3>
        <p>
          At-least-once: Retry until ack, may duplicate. Pros: Simpler, good performance, no message loss. Cons: Consumers must be idempotent. Best for: Most use cases (notifications, events).
        </p>
        <p>
          Exactly-once: Distributed transactions, consensus. Pros: Ideal semantics, no dedup logic needed. Cons: High latency, complexity, often impractical at scale. Best for: Financial transactions, critical updates.
        </p>
        <p>
          At-least-once + idempotent consumer: Practical exactly-once. Pros: Simpler than true exactly-once, same result. Cons: Requires idempotent business logic. Best for: Most production systems.
        </p>

        <h3>Ordering: Total vs Partition vs None</h3>
        <p>
          Total ordering: Global sequence. Pros: Simplest consumer logic. Cons: Centralized bottleneck, doesn&apos;t scale. Best for: Low-volume, critical ordering (transactions).
        </p>
        <p>
          Partition ordering: Ordered within partition. Pros: Scales with partitions, parallel processing. Cons: No cross-partition ordering. Best for: Most event streaming (Kafka).
        </p>
        <p>
          Key-based ordering: Same key → same partition → ordered. Pros: Ordering for related events, scalable. Cons: Hot keys cause imbalance. Best for: User streams, order lifecycle.
        </p>
        <p>
          No ordering: Fire-and-forget. Pros: Maximum throughput, lowest latency. Cons: Consumer must handle reordering. Best for: Metrics, logs, idempotent updates.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/pub-sub-messaging/delivery-guarantees.svg"
          alt="Delivery Guarantees"
          caption="Figure 4: Delivery Guarantees — At-most-once, at-least-once, and exactly-once comparison"
          width={1000}
          height={450}
        />

        <h3>Persistence: Durable vs Transient</h3>
        <p>
          Durable (Kafka, RabbitMQ): Persist to disk, survive broker restart. Pros: No message loss, replay capability, audit trail. Cons: Higher latency (disk I/O), storage cost. Best for: Events, audit logs, critical notifications.
        </p>
        <p>
          Transient (Redis Pub/Sub): In-memory only. Pros: Lowest latency, no I/O. Cons: Message loss on restart, no replay. Best for: Real-time features, presence, ephemeral notifications.
        </p>
        <p>
          Hybrid: In-memory with async persistence. Pros: Low latency, some durability. Cons: Small window of potential loss. Best for: High-throughput with moderate durability needs.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Design for idempotency:</strong> Assume at-least-once delivery. Use idempotency keys (UUID per message). Deduplicate at consumer (store processed IDs). Idempotent business operations (upsert vs insert).
          </li>
          <li>
            <strong>Use consumer groups for scaling:</strong> Multiple consumers share load. Partitions assigned to consumers. Scale consumers with traffic. Monitor lag per consumer group.
          </li>
          <li>
            <strong>Partition for parallelism:</strong> Partition topics by key (user ID, order ID). Enables parallel processing. Choose partition key carefully (avoid hot partitions). Rebalance on partition count change.
          </li>
          <li>
            <strong>Implement dead letter queues:</strong> Move poison messages (repeated failures) to DLQ. Prevents blocking queue. Alert on DLQ growth. Process DLQ manually or with separate consumer.
          </li>
          <li>
            <strong>Monitor message lag:</strong> Track consumer lag (messages behind latest). Alert on growing lag. Lag indicates slow consumers or insufficient capacity. Scale consumers based on lag.
          </li>
          <li>
            <strong>Set appropriate retention:</strong> Retention based on use case: hours (real-time), days (replay), forever (audit). Monitor storage usage. Compact topics (keep latest per key) for state.
          </li>
          <li>
            <strong>Use schema registry:</strong> Enforce message schema (Avro, Protobuf). Schema evolution (backward compatible). Prevents breaking changes. Used for: Kafka with Schema Registry.
          </li>
          <li>
            <strong>Implement backpressure:</strong> Slow consumers shouldn&apos;t block fast producers. Buffer with limits. Drop or reject when full. Signal backpressure to producers.
          </li>
          <li>
            <strong>Secure access:</strong> Authentication (SASL, mTLS). Authorization (ACLs per topic). Encrypt in transit (TLS). Encrypt at rest (for sensitive data).
          </li>
          <li>
            <strong>Plan for replay:</strong> Enable message replay for debugging, recovery, new feature rollout. Retain messages long enough. Document replay procedures. Test replay regularly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No idempotency:</strong> Duplicates cause data corruption. Solution: Idempotency keys, deduplication at consumer, idempotent operations.
          </li>
          <li>
            <strong>Ignoring consumer lag:</strong> Lag grows unnoticed, messages delayed. Solution: Monitor lag, alert on thresholds, auto-scale consumers.
          </li>
          <li>
            <strong>Wrong partition key:</strong> Hot partitions cause imbalance. Solution: Choose high-cardinality keys, hash-based partitioning, monitor partition distribution.
          </li>
          <li>
            <strong>No dead letter queue:</strong> Poison messages block queue. Solution: DLQ for failed messages, alert on DLQ growth, process DLQ separately.
          </li>
          <li>
            <strong>Over-partitioning:</strong> Too many partitions slow rebalancing. Solution: Size partitions for expected scale (not max possible), plan growth.
          </li>
          <li>
            <strong>Manual offset mismanagement:</strong> Commit before processing → message loss. Solution: Commit after successful processing, handle commit failures.
          </li>
          <li>
            <strong>Ignoring rebalancing:</strong> Frequent rebalances disrupt consumption. Solution: Tune rebalance thresholds, use cooperative rebalancing, stable consumer instances.
          </li>
          <li>
            <strong>No schema management:</strong> Schema changes break consumers. Solution: Schema registry, backward-compatible changes, versioning.
          </li>
          <li>
            <strong>Insufficient retention:</strong> Can&apos;t replay old messages. Solution: Retention based on replay needs, monitor storage, archive old data.
          </li>
          <li>
            <strong>No monitoring:</strong> Issues undetected until users complain. Solution: Monitor throughput, latency, lag, error rates. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Uber Event Streaming</h3>
        <p>
          Uber uses Kafka for event streaming: trip events, location updates, payment events. Hundreds of topics, billions of messages/day. Consumer groups for parallel processing. Schema registry for compatibility. Replay for debugging, ML training.
        </p>

        <h3 className="mt-6">Netflix Activity Tracking</h3>
        <p>
          Netflix tracks viewing activity, recommendations, device events via Kafka. Real-time analytics pipeline. Event sourcing for user state. Partitioned by user ID. Retention: 7 days for replay, aggregated for long-term.
        </p>

        <h3 className="mt-6">Stripe Webhook Delivery</h3>
        <p>
          Stripe delivers payment events via pub/sub webhooks. At-least-once delivery with retry. Idempotency keys for deduplication. Dead letter queue for failed deliveries. User-configurable events (subscribe to specific event types).
        </p>

        <h3 className="mt-6">Slack Event Distribution</h3>
        <p>
          Slack distributes events (messages, reactions, presence) via pub/sub. Redis Pub/Sub for real-time, Kafka for persistence. Hierarchical topics (workspace/channel). Fan-out to thousands of connected clients per channel.
        </p>

        <h3 className="mt-6">LinkedIn Kafka at Scale</h3>
        <p>
          LinkedIn (Kafka creator) uses Kafka for: activity tracking, log aggregation, stream processing. Trillions of messages/day. Thousands of topics. Custom tooling (Kafka Manager, Ureplicator). Open-sourced Kafka ecosystem (Samza, Brooklin).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure message ordering in Pub/Sub?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use partitioned topics with key-based routing. Messages with same key go to same partition, ordered within partition. Total ordering requires centralized sequencer (bottleneck). For most systems, partition ordering is sufficient. If cross-partition ordering needed, use timestamps and reorder at consumer, or use a single partition (sacrifices parallelism).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle duplicate messages?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement idempotent consumers. Include idempotency key (UUID) in each message. Consumer tracks processed keys (Redis set with TTL). Before processing, check if key exists. If yes, skip. If no, process and add key. Store keys with TTL (e.g., 24 hours) to prevent unbounded growth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale Pub/Sub consumption?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use consumer groups. Add consumers to group, partitions rebalance automatically. Scale consumers based on lag (messages behind). Increase partitions if needed (more parallelism). Monitor throughput per consumer. Auto-scale based on lag threshold (e.g., add consumer if lag &gt; 10,000).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle poison messages?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track retry count per message. After N failures (e.g., 3), move to dead letter queue (DLQ). DLQ is separate topic/queue. Alert on DLQ growth. Process DLQ manually or with separate consumer that logs, investigates, and reprocesses after fix. Never infinite retry—blocks queue.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose partition key?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Choose high-cardinality field that groups related messages: user ID (all user events together), order ID (order lifecycle), device ID. Avoid low-cardinality keys (status, type)—causes hot partitions. Hash key for even distribution. Monitor partition skew—redistribute if imbalanced.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enable message replay?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use persistent broker (Kafka) with retention policy. Consumers track offset (position in log). To replay: reset offset to earlier position. Kafka: use consumer group reset command. Retention must be long enough (days to weeks). For long-term replay, archive to cold storage (S3) with query interface.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://nats.io/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NATS — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.rabbitmq.com/documentation.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RabbitMQ — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/docs/manual/pubsub/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — Pub/Sub Documentation
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/pubsub/docs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Pub/Sub — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/201701-event-driven.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — What do you mean by &quot;Event-Driven&quot;?
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
