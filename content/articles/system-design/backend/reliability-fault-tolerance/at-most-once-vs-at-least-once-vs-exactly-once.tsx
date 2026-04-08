"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-reliability-at-most-once-vs-at-least-once-vs-exactly-once",
  title: "At-Most-Once vs At-Least-Once vs Exactly-Once",
  description:
    "Staff-level deep dive into message delivery semantics: trade-offs between at-most-once, at-least-once, and exactly-once processing, idempotent consumers, transactional guarantees, and production patterns.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "at-most-once-vs-at-least-once-vs-exactly-once",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: [
    "backend",
    "reliability",
    "delivery-semantics",
    "idempotency",
    "message-queues",
    "exactly-once",
  ],
  relatedTopics: [
    "idempotency",
    "dead-letter-queues",
    "retry-mechanisms",
    "error-handling-patterns",
  ],
};

const BASE_PATH =
  "/diagrams/system-design-concepts/backend/reliability-fault-tolerance";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Delivery semantics</strong> define the guarantee a messaging system provides about
          how many times a message will be processed by its consumer. There are three levels of
          guarantee. <strong>At-most-once</strong> means a message is delivered zero or one times —
          it may be lost but never duplicated. <strong>At-least-once</strong> means a message is
          delivered one or more times — it will never be lost but may be duplicated.
          <strong>Exactly-once</strong> means a message is processed exactly once — no loss and no
          duplication. These semantics are not interchangeable: choosing the wrong one for your
          workload causes either data loss (at-most-once for financial transactions) or data
          corruption (at-least-once without idempotent consumers).
        </p>
        <p>
          Consider a payment processing pipeline. When a customer submits a payment, the payment
          service publishes a <code>PaymentSubmitted</code> event to a message broker. The
          fraud-checking service consumes this event and either approves or flags the payment. If
          the system uses at-most-once delivery and the fraud service crashes after the message is
          delivered but before it is processed, the payment is never checked for fraud — a
          catastrophic failure. If the system uses at-least-once delivery and the fraud service
          processes the same message twice, the payment may be flagged twice, creating duplicate
          alerts that waste investigator time. If the system uses exactly-once delivery, the payment
          is checked exactly once — the correct behavior. The choice of delivery semantic directly
          affects the correctness and cost of the system.
        </p>
        <p>
          For staff/principal engineers, understanding delivery semantics requires balancing three
          competing concerns. <strong>Reliability</strong> means messages are never lost — at-least-once
          and exactly-once provide this. <strong>Correctness</strong> means messages are never
          duplicated — at-most-once and exactly-once provide this. <strong>Performance</strong> means
          messages are processed with minimal latency — at-most-once is fastest, exactly-once is
          slowest due to transactional overhead. No single semantic provides all three: at-most-once
          sacrifices reliability for performance, at-least-once sacrifices correctness for
          reliability, and exactly-once sacrifices performance for both reliability and correctness.
        </p>
        <p>
          The business impact of delivery semantic decisions is significant. At-most-once is
          appropriate for metrics and logging where occasional message loss is acceptable and
          duplicates would distort the data. At-least-once with idempotent consumers is the default
          choice for most business-critical workloads (order processing, user notifications,
          inventory updates) because it guarantees no data loss and idempotency eliminates the
          duplicate problem. Exactly-once is reserved for the most critical workloads (financial
          transactions, inventory deductions, unique identifier generation) where even idempotent
          retries are too risky or too expensive.
        </p>
        <p>
          In system design interviews, delivery semantics demonstrate understanding of distributed
          system trade-offs, message queue internals, and the relationship between infrastructure
          guarantees and application-level correctness. It shows you understand that reliability is
          not a binary property but a spectrum of trade-offs that must be chosen deliberately for
          each workload.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/delivery-semantics-comparison.svg`}
          alt="Three-column comparison of at-most-once, at-least-once, and exactly-once delivery semantics showing failure scenarios, guarantees, best use cases, and trade-offs"
          caption="Delivery semantics comparison — at-most-once (fastest but can lose messages), at-least-once (no loss but duplicates, needs idempotent consumers), exactly-once (strongest guarantee but slowest, requires transactions)"
        />

        <h3>At-Most-Once Delivery</h3>
        <p>
          At-most-once delivery means the system makes no guarantee that a message will be
          processed. The producer sends the message to the broker, the broker delivers it to the
          consumer, and if the consumer crashes before or during processing, the message is lost.
          The broker considers the message delivered once it has been handed off to the consumer and
          does not retain it for retry. This is the simplest delivery semantic because it requires
          no acknowledgment protocol and no retry logic.
        </p>
        <p>
          At-most-once is appropriate for workloads where occasional data loss is acceptable and
          duplicates would be harmful. Metrics and logging are the canonical examples: if a single
          metrics data point is lost, the aggregate statistics are still accurate. If the same data
          point were delivered twice, it would inflate the metric and produce incorrect dashboards
          and alerts. Similarly, log aggregation systems prefer to lose a few log lines rather than
          risk duplicate entries that would distort error rates and event counts.
        </p>

        <h3>At-Least-Once Delivery</h3>
        <p>
          At-least-once delivery guarantees that a message will be processed at least once, but it
          may be processed multiple times. The broker delivers the message to the consumer and waits
          for an acknowledgment (ACK). If the consumer processes the message and sends the ACK, the
          message is considered complete. If the consumer crashes before sending the ACK, the broker
          redelivers the message to the same or a different consumer. This redelivery creates the
          possibility of duplicate processing: if the consumer crashes after processing the message
          but before sending the ACK, the message will be redelivered and processed a second time.
        </p>
        <p>
          At-least-once is the most common delivery semantic for business-critical workloads. The
          key requirement is that consumers must be <strong>idempotent</strong>: processing the
          same message twice must produce the same result as processing it once. Idempotency is
          typically implemented using a deduplication store that tracks processed message IDs.
          Before processing a message, the consumer checks whether the message ID has already been
          processed. If so, it skips processing and sends the ACK. If not, it processes the
          message, records the message ID, and sends the ACK.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/idempotent-consumer-pattern.svg`}
          alt="Idempotent consumer pattern showing message flowing from broker through a deduplication check — if message ID is new, process and record ID; if already seen, skip and ACK"
          caption="Idempotent consumer pattern — check deduplication store before processing; process only if message ID is new, skip if already seen; eliminates duplicate processing from at-least-once delivery"
        />

        <h3>Exactly-Once Delivery</h3>
        <p>
          Exactly-once delivery guarantees that a message is processed exactly once, with no loss
          and no duplication. This is the strongest guarantee but also the most expensive to
          implement. Exactly-once semantics require transactional coordination between the message
          broker and the consumer&apos;s output system. The consumer reads the message, processes
          it, and writes the result in a single atomic transaction. If any step fails, the entire
          transaction is rolled back and the message is retried. If the transaction succeeds, the
          message is acknowledged and the result is durably stored.
        </p>
        <p>
          Exactly-once semantics are implemented by systems like Apache Kafka through transactional
          producers and consumers. The consumer reads messages from an input topic, processes them,
          and writes results to an output topic within a single transaction. The transaction is
          either committed (all writes succeed) or aborted (all writes are rolled back). This
          ensures that the consumer&apos;s output is consistent with the messages it has processed,
          even in the face of failures. Exactly-once semantics are essential for financial
          transactions, inventory management, and any workload where duplicate processing would
          cause incorrect state that cannot be corrected by idempotency alone.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/exactly-once-transaction.svg`}
          alt="Exactly-once transactional flow showing read-process-write within a single transaction boundary, with rollback on any step failure"
          caption="Exactly-once transaction — read message, process, and write result in a single atomic transaction; if any step fails, the entire transaction rolls back and the message is retried"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>At-Most-Once Implementation</h3>
        <p>
          At-most-once is implemented by delivering the message to the consumer without waiting for
          an acknowledgment. The broker removes the message from its queue as soon as it has been
          handed off to the consumer&apos;s network buffer. If the consumer crashes before
          processing the message, the message is gone. This implementation is fast because it
          requires only one network round-trip (broker to consumer) and no state management for
          tracking delivery status. Fire-and-forget messaging is the purest form of at-most-once:
          the producer sends the message and immediately forgets about it, with no concern for
          whether it was received or processed.
        </p>

        <h3>At-Least-Once Implementation</h3>
        <p>
          At-least-once is implemented using an acknowledgment protocol. The broker delivers the
          message to the consumer and starts a visibility timer. The consumer processes the message
          and sends an ACK. The broker removes the message from its queue. If the visibility timer
          expires before the ACK is received, the broker redelivers the message to the same or a
          different consumer. The visibility timeout must be set carefully: too short and the
          message may be redelivered before processing is complete (causing duplicates); too long
          and a crashed consumer holds the message hostage for the full timeout duration.
        </p>
        <p>
          The idempotent consumer pattern is the standard way to handle duplicate messages from
          at-least-once delivery. The consumer maintains a deduplication store (typically a Redis
          set or a database table) that records the IDs of all processed messages. Before processing
          a message, the consumer checks the store. If the message ID is present, the message is a
          duplicate and is skipped (ACK is sent without processing). If the message ID is absent,
          the message is processed, the ID is recorded, and the ACK is sent. The deduplication
          store must have a TTL to prevent unbounded growth — the TTL should be set to the maximum
          redelivery window of the broker.
        </p>

        <h3>Exactly-Once Implementation</h3>
        <p>
          Exactly-once is implemented using distributed transactions. The consumer reads a batch of
          messages from the input topic, processes them, and writes the results to the output topic
          within a single transaction. The transaction is coordinated by a transaction manager that
          ensures atomicity: either all writes succeed (commit) or all writes are rolled back
          (abort). If the consumer crashes during the transaction, the transaction manager detects
          the failure and rolls back the transaction. The messages remain in the input topic and
          will be processed by a new consumer instance.
        </p>
        <p>
          Kafka&apos;s transactional API provides exactly-once semantics through producer
          transactions and consumer group coordination. The producer assigns a unique producer ID
          and sequence number to each message. The broker deduplicates messages based on the
          producer ID and sequence number, ensuring that even if the producer retries sending the
          same message, only one copy is stored. The consumer reads messages from the input topic
          in consumer group offset commits that are tied to the transaction, ensuring that the
          consumer&apos;s position is consistent with its processing state.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The choice of delivery semantic is a trade-off between reliability, correctness, and
          performance. At-most-once provides the best performance (lowest latency, highest
          throughput) but the weakest reliability guarantee. It is suitable for workloads where
          occasional data loss is acceptable and duplicates would be harmful. At-least-once
          provides strong reliability (no data loss) but requires the application to handle
          duplicates through idempotent consumers. It is the default choice for most business-critical
          workloads. Exactly-once provides the strongest guarantee (no loss, no duplicates) but
          the worst performance due to transactional overhead. It is reserved for the most critical
          workloads where even idempotent retries are unacceptable.
        </p>
        <p>
          The staff-level insight is that at-least-once with idempotent consumers provides the same
          effective guarantee as exactly-once for most workloads, with significantly better
          performance. The cost of implementing idempotent consumers (a deduplication store and
          duplicate checks) is typically much lower than the cost of distributed transactions.
          Exactly-once should be reserved for workloads where the cost of a duplicate cannot be
          mitigated by idempotency — for example, when processing a message triggers an irreversible
          external action (sending a payment to a bank, ordering physical goods) that cannot be
          undone or deduplicated after the fact.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Choose at-most-once for metrics, logging, and monitoring data where occasional loss is
          acceptable and duplicates would distort the data. Choose at-least-once as the default for
          all business-critical workloads, and implement idempotent consumers using a deduplication
          store with a TTL matching the broker&apos;s redelivery window. Choose exactly-once only
          for workloads where the cost of a duplicate is catastrophic and cannot be mitigated by
          idempotency — financial settlements, inventory deductions for unique items, and
          irreversible external actions.
        </p>
        <p>
          Always make consumers idempotent, even when using exactly-once semantics. Defensive
          programming against duplicates protects against broker bugs, configuration errors, and
          edge cases where the exactly-once guarantee may be violated. Monitor delivery metrics:
          track the redelivery rate (messages redelivered as a percentage of total deliveries) and
          alert if it exceeds a threshold, indicating that consumers are struggling to process
          messages within the visibility timeout. Track the deduplication rate (duplicate messages
          skipped as a percentage of total messages received) to understand how often the
          idempotent consumer is actually preventing duplicate processing.
        </p>
        <p>
          Set the visibility timeout carefully: it should be longer than the maximum expected
          processing time plus a safety margin, but short enough that crashed consumers do not
          hold messages hostage for too long. For workloads with variable processing times, consider
          extending the visibility timeout dynamically as the consumer processes long-running
          messages, rather than setting a single large timeout that penalizes fast-processing
          messages.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using at-least-once delivery without idempotent consumers.
          When the broker redelivers a message because the consumer crashed before sending the ACK,
          the consumer processes the message twice, causing duplicate side effects (duplicate orders,
          duplicate charges, duplicate notifications). The fix is to implement idempotent consumers
          with a deduplication store that records processed message IDs.
        </p>
        <p>
          Another common pitfall is setting the visibility timeout too short. If the timeout is
          shorter than the consumer&apos;s processing time, the broker will redeliver the message
          while the consumer is still processing it, causing a duplicate. The fix is to set the
          timeout to at least 2-3x the P99 processing time of the consumer.
        </p>
        <p>
          Using exactly-once semantics for all workloads is a performance anti-pattern. Exactly-once
          introduces significant overhead due to transactional coordination, reducing throughput by
          30-50% compared to at-least-once. The fix is to use exactly-once only for workloads that
          truly need it, and use at-least-once with idempotent consumers for the rest.
        </p>
        <p>
          Not monitoring redelivery rates means you won&apos;t know when consumers are struggling
          to process messages. High redelivery rates indicate that the visibility timeout is too
          short, the consumer is too slow, or the consumer is crashing frequently. The fix is to
          track redelivery rate as a key metric and set alerts on abnormal values.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Stripe: Exactly-Once for Payment Settlements</h3>
        <p>
          Stripe uses exactly-once semantics for payment settlements because a duplicate settlement
          would result in a customer being charged twice for the same transaction. Stripe&apos;s
          payment processing pipeline uses Kafka transactions to ensure that each payment intent is
          settled exactly once, with the settlement result (success or failure) written to the
          output topic in the same transaction as the payment intent is consumed. This guarantees
          that no payment is settled twice, even in the face of broker failures, consumer crashes,
          or network partitions.
        </p>

        <h3>Uber: At-Least-Once with Idempotent Consumers for Ride Events</h3>
        <p>
          Uber uses at-least-once delivery for ride lifecycle events (ride requested, driver
          matched, trip started, trip completed) with idempotent consumers. Each ride event has a
          unique event ID, and the consumer maintains a deduplication store in Redis that records
          processed event IDs. If an event is redelivered, the consumer skips it. This approach
          provides no data loss (critical for ride accounting and driver payouts) with minimal
          performance overhead compared to exactly-once transactions.
        </p>

        <h3>Datadog: At-Most-Once for Metrics Ingestion</h3>
        <p>
          Datadog uses at-most-once delivery for metrics ingestion because occasional metric data
          point loss is acceptable (the aggregate statistics remain accurate) and duplicate data
          points would distort dashboards and alerts. The metrics ingestion pipeline uses fire-and-forget
          messaging: metrics are sent to the broker and immediately forgotten, with no acknowledgment
          or retry. This provides the lowest latency and highest throughput for the billions of
          metrics Datadog processes daily.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 1: Explain the difference between at-most-once, at-least-once, and
              exactly-once delivery semantics.
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              At-most-once means a message is delivered zero or one times — it may be lost but
              never duplicated. At-least-once means a message is delivered one or more times — it
              will never be lost but may be duplicated. Exactly-once means a message is processed
              exactly once — no loss and no duplication.
            </p>
            <p>
              At-most-once is fastest but least reliable. At-least-once requires idempotent
              consumers to handle duplicates. Exactly-once requires transactional support and is
              slowest. Choose at-most-once for metrics and logging, at-least-once for most business
              workloads, and exactly-once for financial transactions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 2: How do you implement an idempotent consumer for at-least-once delivery?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              An idempotent consumer checks a deduplication store before processing each message.
              The store records the IDs of all processed messages. Before processing, the consumer
              checks whether the message ID is in the store. If yes, skip processing and send ACK.
              If no, process the message, record the ID in the store, and send ACK.
            </p>
            <p>
              The deduplication store should be a fast key-value store (Redis, Memcached) with a
              TTL matching the broker&apos;s maximum redelivery window. The check-and-record
              operation must be atomic to prevent race conditions when multiple consumer instances
              process the same message concurrently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 3: When would you choose exactly-once over at-least-once with idempotent
              consumers?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Choose exactly-once when the cost of a duplicate cannot be mitigated by idempotency.
              This happens when processing a message triggers an irreversible external action —
              sending a payment to a bank, ordering physical goods from a supplier, or calling a
              third-party API that charges per call and has no idempotency key support.
            </p>
            <p>
              For most internal workloads, at-least-once with idempotent consumers provides the
              same effective guarantee as exactly-once with significantly better performance.
              Exactly-once introduces 30-50% throughput overhead due to transactional coordination,
              so it should be reserved for the most critical workloads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 4: What happens if the visibility timeout is set too short in an
              at-least-once system?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              If the visibility timeout is shorter than the consumer&apos;s processing time, the
              broker will redeliver the message while the consumer is still processing it. This
              causes a duplicate: the original consumer processes the message and sends the ACK
              after the timeout has already expired, so the redelivered message is processed by a
              second consumer instance.
            </p>
            <p>
              The fix is to set the visibility timeout to at least 2-3x the P99 processing time of
              the consumer. For workloads with variable processing times, use dynamic timeout
              extension: the consumer periodically extends the visibility timeout while processing
              long-running messages, rather than relying on a single large timeout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 5: How does Kafka implement exactly-once semantics?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Kafka implements exactly-once semantics through producer transactions and consumer
              group offset commits tied to transactions. The producer assigns a unique producer ID
              and sequence number to each message. The broker deduplicates messages based on the
              producer ID and sequence number, ensuring that retried messages are not stored
              twice.
            </p>
            <p>
              The consumer reads messages from an input topic, processes them, and writes results
              to an output topic within a single transaction. The transaction is either committed
              (all writes succeed) or aborted (all writes roll back). The consumer&apos;s offset
              commits are included in the transaction, so the consumer&apos;s position is consistent
              with its processing state. If the consumer crashes, the transaction is aborted and
              the messages remain in the input topic for retry.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 6: A system uses at-least-once delivery but duplicate messages are causing
              data corruption. What are the possible causes and how do you fix each one?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Possible causes: (1) The consumer is not idempotent — it processes duplicate messages
              without checking whether they have already been processed. Fix: implement an
              idempotent consumer with a deduplication store. (2) The visibility timeout is too
              short — the broker redelivers messages while the consumer is still processing them.
              Fix: increase the visibility timeout to 2-3x the P99 processing time.
            </p>
            <p>
              (3) The deduplication store has a TTL that is too short — message IDs expire before
              the broker&apos;s maximum redelivery window, so old duplicates are not detected. Fix:
              set the deduplication store TTL to match or exceed the broker&apos;s maximum redelivery
              window. (4) The deduplication check is not atomic — two consumer instances process the
              same message concurrently and both pass the deduplication check before either records
              the message ID. Fix: use an atomic check-and-set operation (Redis SETNX, database
              unique constraint) to ensure only one instance processes each message.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://kafka.apache.org/documentation/#design_semantics"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka: Message Delivery Semantics
            </a>{" "}
            — Official documentation on at-most-once, at-least-once, and exactly-once in Kafka.
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon SQS: Visibility Timeout
            </a>{" "}
            — How SQS implements at-least-once delivery with visibility timeouts.
          </li>
          <li>
            <a
              href="https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Confluent: Exactly-Once Semantics in Kafka
            </a>{" "}
            — Deep dive into Kafka&apos;s transactional API for exactly-once processing.
          </li>
          <li>
            <a
              href="https://www.cloudcomputingpatterns.org/idempotent_processor/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloud Computing Patterns: Idempotent Processor
            </a>{" "}
            — Pattern for implementing idempotent message processing.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 11
            (Stream Processing).
          </li>
          <li>
            <a
              href="https://engineering.uber.com/guide/reliability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Uber Engineering: Reliability at Scale
            </a>{" "}
            — How Uber uses delivery semantics for ride event processing.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
