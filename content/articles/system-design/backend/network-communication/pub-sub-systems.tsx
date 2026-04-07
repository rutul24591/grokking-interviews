"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-pub-sub-systems-complete",
  title: "Pub-Sub Systems",
  description:
    "Comprehensive guide to publish-subscribe systems: topic-based routing, fan-out delivery, durable subscriptions, consumer groups, ordering, backpressure, and production patterns at scale.",
  category: "backend",
  subcategory: "network-communication",
  slug: "pub-sub-systems",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-04",
  tags: ["backend", "pub-sub", "event-driven", "messaging", "Google Cloud Pub/Sub", "SNS"],
  relatedTopics: [
    "message-queues",
    "event-streaming",
    "service-discovery",
    "retry-mechanisms",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Pub-Sub Systems</h1>
        <p className="lead">
          Publish-subscribe (pub-sub) systems enable one-to-many message distribution where
          publishers send messages to topics and subscribers receive all messages published to
          topics they have subscribed to. Unlike point-to-point message queues where each message
          is consumed by exactly one consumer, pub-sub systems fan out each message to all
          subscribers of the topic. This decoupling of publishers from subscribers allows any
          number of services to react to the same event without the publisher knowing about or
          coordinating with them.
        </p>

        <p>
          Consider a user profile update in a social media platform. When a user changes their
          display name, the profile service must notify the feed service (to update displayed
          names on posts), the notification service (to send a &quot;name changed&quot; alert if
          the user has enabled it), the search service (to re-index the user&apos;s profile), and
          the analytics service (to track profile change rates). Without pub-sub, the profile
          service makes four synchronous calls, tightly coupling it to every downstream service.
          With pub-sub, the profile service publishes a single &quot;UserUpdated&quot; message
          to the <code className="inline-code">user-events</code> topic. Each downstream service
          subscribes to this topic independently. If a new service needs to react to user updates
          (e.g., a fraud detection service), it simply subscribes to the topic without any change
          to the profile service.
        </p>

        <p>
          Pub-sub systems are the backbone of event-driven architectures, enabling services to
          communicate through events rather than direct calls. They provide <strong>temporal
          decoupling</strong> (publishers and subscribers do not need to be online simultaneously),
          <strong>spatial decoupling</strong> (publishers and subscribers do not need to know each
          other&apos;s network addresses), and <strong>synchronization decoupling</strong>
          (publishers do not block waiting for subscribers to process messages). These properties
          make pub-sub systems essential for building scalable, resilient distributed systems.
        </p>

        <p>
          This article provides a comprehensive examination of pub-sub systems: topic-based
          routing, durable vs transient subscriptions, consumer groups and parallel processing,
          message ordering and partitioning, backpressure and flow control, dead letter handling,
          and production patterns using Google Cloud Pub/Sub, Amazon SNS/SQS, and Apache Kafka.
          We will also cover real-world implementations and common pitfalls.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/pubsub-azure-pattern.svg`}
          caption="Figure 1: Publish-Subscribe Architecture showing publishers sending messages to topics on a broker, and multiple subscriber groups receiving all messages from topics they subscribe to. Each subscriber group processes messages independently. The broker provides fan-out delivery (one message → many subscribers), topic-based routing (publishers choose topics, subscribers choose topics to follow), and durable storage (messages persist until all subscribers acknowledge them)."
          alt="Pub-sub architecture diagram"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Topics, Subscriptions, and Delivery</h2>

        <h3>Topic-Based Routing</h3>
        <p>
          In a pub-sub system, messages are published to named topics rather than addressed to
          specific consumers. A topic is a logical channel that groups related messages together.
          Publishers choose which topic to publish to based on the message&apos;s semantic
          meaning (e.g., <code className="inline-code">user-events</code>,
          <code className="inline-code">order-events</code>,
          <code className="inline-code">payment-events</code>). Subscribers express interest in
          topics by creating subscriptions, and the broker delivers all messages published to
          subscribed topics to those subscribers.
        </p>

        <p>
          Topic hierarchies allow fine-grained subscription control. Topics can be organized in a
          tree structure (<code className="inline-code">events.user.created</code>,
          <code className="inline-code">events.user.updated</code>,
          <code className="inline-code">events.user.deleted</code>), and subscribers can use
          wildcard patterns (<code className="inline-code">events.user.*</code> for all user
          events, <code className="inline-code">events.#</code> for all events) to subscribe to
          multiple topics with a single subscription. This hierarchical model allows subscribers
          to choose their level of granularity: a service that needs all user events subscribes
          to <code className="inline-code">events.user.*</code>, while a service that only needs
          creation events subscribes to <code className="inline-code">events.user.created</code>.
        </p>

        <h3>Durable vs Transient Subscriptions</h3>
        <p>
          Durable subscriptions ensure that messages are retained by the broker until every
          subscriber has acknowledged them, even if the subscriber is temporarily offline. When
          a subscriber reconnects after being offline, it receives all messages that were published
          during its absence. This is essential for critical workflows (order processing, payment
          handling) where no message can be missed.
        </p>

        <p>
          Transient subscriptions deliver only messages published while the subscriber is online.
          Messages published while the subscriber is offline are lost. This is appropriate for
          real-time notifications (stock price updates, live chat messages, sensor readings) where
          stale data is less valuable than current data, and missing a few messages during a
          subscriber restart is acceptable.
        </p>

        <h3>Fan-Out Delivery</h3>
        <p>
          Fan-out is the defining characteristic of pub-sub systems: a single published message
          is delivered to all subscribers of the topic. This contrasts with message queues, where
          each message is consumed by exactly one consumer. Fan-out enables multiple independent
          services to react to the same event without coordinating with each other.
        </p>

        <p>
          Fan-out introduces a challenge: if a topic has 100 subscribers and the publisher
          publishes 1,000 messages per second, the broker must deliver 100,000 messages per
          second to subscribers. This requires the broker to scale horizontally (multiple broker
          nodes) and subscribers to process messages efficiently. For high-fan-out scenarios
          (broadcasting to thousands of subscribers), pub-sub systems use push-based delivery
          (the broker pushes messages to subscriber endpoints) rather than pull-based delivery
          (subscribers poll for messages) to minimize latency.
        </p>

        <h3>Consumer Groups and Parallel Processing</h3>
        <p>
          Consumer groups allow multiple instances of the same subscriber service to process
          messages in parallel. Within a consumer group, each message is delivered to exactly
          one consumer instance, providing load balancing. Across consumer groups, each group
          receives all messages independently, providing the fan-out behavior.
        </p>

        <p>
          For example, if the <code className="inline-code">user-events</code> topic has three
          consumer groups (email-notifications with 2 instances, analytics with 3 instances,
          search-indexing with 1 instance), each message published to the topic is delivered to
          exactly one instance in each group. The email-notifications group processes each message
          once across its two instances (load balanced), the analytics group processes each message
          once across its three instances, and the search-indexing group processes each message
          once with its single instance. All three groups receive all messages independently.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/pubsub-opcua.svg`}
          caption="Figure 2: Fan-Out Delivery showing a publisher sending a message to the user-events topic. Three independent subscriber groups each receive the message: Email Notifications (sends confirmation emails), Analytics (updates dashboards), and Search Indexing (re-indexes user profiles). Each group processes the message independently and at its own pace. Adding a new subscriber group (e.g., Fraud Detection) requires no changes to the publisher."
          alt="Pub-sub fan-out delivery pattern"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Patterns</h2>

        <h3>Push vs Pull Delivery</h3>
        <p>
          Pub-sub systems support two delivery models for sending messages from the broker to
          subscribers. In push delivery, the broker actively sends messages to subscriber
          endpoints (typically HTTP POST to a webhook URL). This provides low latency because
          messages are delivered immediately upon publication. However, push delivery requires
          subscribers to be reachable (public endpoints or VPC-integrated endpoints) and to
          handle backpressure (the broker must retry if the subscriber is slow or unavailable).
        </p>

        <p>
          In pull delivery, subscribers request messages from the broker at their own pace. This
          provides natural backpressure: slow subscribers pull fewer messages, and the broker
          buffers the excess. Pull delivery is more resilient because subscribers do not need
          to expose public endpoints, but it introduces polling latency (messages are not
          delivered until the next poll cycle). Most modern pub-sub systems support both models:
          push for low-latency subscribers with public endpoints, and pull for subscribers that
          control their own consumption rate.
        </p>

        <h3>Message Retention and Acknowledgment</h3>
        <p>
          Message retention determines how long the broker stores messages before discarding them.
          In a time-based retention model, messages are retained for a fixed duration (e.g., 7
          days) regardless of subscriber acknowledgment. This allows new subscribers to replay
          messages from the retention window. In an acknowledgment-based retention model, messages
          are retained until all subscribers acknowledge them. This ensures that no subscriber
          misses any messages, but messages from inactive subscribers are retained indefinitely,
          potentially causing storage overflow.
        </p>

        <p>
          Message acknowledgment is the mechanism by which subscribers confirm that they have
          successfully processed a message. In at-least-once delivery, the broker redelivers
          unacknowledged messages after a configurable acknowledgment deadline (visibility
          timeout). In at-most-once delivery, the broker considers messages acknowledged upon
          delivery and does not retry. The acknowledgment model determines the system&apos;s
          reliability: at-least-once with idempotent consumers is the most common pattern in
          production systems.
        </p>

        <h3>Filtering and Routing</h3>
        <p>
          Pub-sub systems support message filtering to deliver only relevant messages to each
          subscriber. Subscribers can define filter expressions based on message attributes
          (e.g., <code className="inline-code">region = &quot;us-east-1&quot;</code> or
          <code className="inline-code">event_type IN (&quot;created&quot;, &quot;updated&quot;)</code>).
          The broker evaluates the filter expression for each message and delivers it only to
          subscribers whose filters match. Filtering reduces the message volume for each subscriber,
          allowing them to focus on relevant events without subscribing to the entire topic.
        </p>

        <h3>Dead Letter Topics</h3>
        <p>
          Similar to dead letter queues in message queues, pub-sub systems use dead letter topics
          to handle messages that subscribers fail to process. When a subscriber fails to
          acknowledge a message after a configured number of delivery attempts, the broker
          publishes the message to a dead letter topic. Operators can subscribe to the dead letter
          topic to investigate and reprocess failed messages. Dead letter topics are essential
          for maintaining system reliability: they prevent poison pill messages from blocking
          subscriber processing and provide a centralized location for investigating delivery
          failures across all subscriptions.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/pub-sub-fan-out.svg`}
          caption="Figure 3: Pub-Sub Fan-Out Delivery Pattern showing how every subscriber group receives all messages from a topic independently. Left side: Publisher sends Order #123 to orders.created topic, which fans out to all three subscriber groups (Email, Analytics, Inventory) — each receives the same message. Right side: Message Queue competitive consumer pattern where each message goes to exactly one worker. Pub-sub enables broadcasting to multiple independent processing paths, while message queues distribute work across parallel consumers."
          alt="Pub-sub fan-out delivery pattern"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          Choosing a pub-sub system involves trade-offs between delivery guarantees, scalability,
          message ordering, and operational complexity. Each system is optimized for different
          use cases, and the right choice depends on the specific requirements of the workload.
        </p>

        <h3>Google Cloud Pub/Sub vs Amazon SNS/SQS vs Apache Kafka</h3>
        <p>
          Google Cloud Pub/Sub is a fully managed, globally distributed pub-sub service optimized
          for high-throughput, low-latency message delivery. It provides at-least-once delivery,
          exactly-once delivery (through exactly-once subscriptions), ordered delivery per
          ordering key, and automatic scaling to millions of topics and subscriptions. Pub/Sub
          is best for Google Cloud-native applications, global fan-out requirements, and workloads
          that need automatic scaling without operational management.
        </p>

        <p>
          Amazon SNS (Simple Notification Service) combined with SQS (Simple Queue Service)
          provides a pub-sub system where SNS handles topic-based fan-out and SQS provides durable
          message storage for each subscriber. SNS supports up to 10 million subscriptions per
          topic, filter-based delivery, and cross-account topic sharing. SQS provides at-least-once
          or exactly-once (FIFO queues) delivery with configurable visibility timeouts and dead
          letter queues. This combination is best for AWS-native applications, simple pub-sub
          requirements, and teams already invested in the AWS ecosystem.
        </p>

        <p>
          Apache Kafka, while primarily an event streaming platform, provides pub-sub capabilities
          through topic-based subscriptions with consumer groups. Kafka offers the highest
          throughput (millions of messages per second), strong ordering per partition, and
          long-term message retention (days to months) for replayability. Kafka is best for
          high-throughput event streaming, workloads that require message replay, and organizations
          that already operate Kafka infrastructure for stream processing.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Pub-Sub System Design</h2>

        <p>
          <strong>Design topics with semantic naming.</strong> Topic names should clearly indicate
          the domain and event type they carry. Use a hierarchical naming convention
          (<code className="inline-code">domain.entity.action</code>, e.g.,
          <code className="inline-code">user.profile.updated</code>) that allows subscribers to
          use wildcards for coarse-grained subscriptions
          (<code className="inline-code">user.*.*</code> for all user events) and exact names for
          fine-grained subscriptions (<code className="inline-code">user.profile.updated</code>).
          Avoid generic topic names like <code className="inline-code">events</code> or
          <code className="inline-code">messages</code> that do not convey semantic meaning.
        </p>

        <p>
          <strong>Include rich metadata in message attributes.</strong> Pub-sub systems support
          message attributes (key-value pairs) that are evaluated by the broker for filtering
          without requiring subscribers to parse the message body. Include metadata such as event
          type, entity ID, timestamp, region, and version in message attributes. This enables
          efficient filter-based delivery (subscribers receive only messages matching their
          attribute filters) and allows monitoring systems to track message flow without
          deserializing message bodies.
        </p>

        <p>
          <strong>Implement message schema evolution.</strong> As pub-sub systems mature, message
          schemas evolve: fields are added, renamed, or deprecated. Implement schema management
          (using a schema registry or backward-compatible schema design) to ensure that publishers
          and subscribers can evolve independently. Use forward-compatible schemas (adding optional
          fields is safe, removing fields requires a new schema version) and include the schema
          version in the message attributes so subscribers can select the appropriate deserializer.
        </p>

        <p>
          <strong>Monitor subscription lag per consumer group.</strong> Track the lag (number of
          unacknowledged messages) for each subscription to each topic. Increasing lag indicates
          that subscribers are falling behind, which could lead to message expiration (if
          retention is time-based) or storage overflow (if retention is acknowledgment-based).
          Set alerts on per-subscription lag thresholds and implement auto-scaling for subscribers
          that use consumer groups.
        </p>

        <p>
          <strong>Test failure scenarios regularly.</strong> Pub-sub systems depend on reliable
          message delivery, but failures are inevitable: subscribers crash, network partitions
          occur, and brokers experience transient outages. Test failure scenarios regularly by
          simulating subscriber crashes (verify that messages are redelivered), network partitions
          (verify that messages are queued and delivered when connectivity is restored), and broker
          failover (verify that messages are not lost during broker failover). These tests validate
          the system&apos;s resilience and identify gaps in failure handling.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Unbounded message retention.</strong> When using acknowledgment-based retention,
          messages are retained until all subscribers acknowledge them. If a subscriber becomes
          inactive (crashes, is decommissioned, or has a bug that prevents acknowledgment), its
          unacknowledged messages accumulate indefinitely, eventually exhausting broker storage.
          Fix: Use time-based retention with a maximum retention period (e.g., 7 days) instead of
          pure acknowledgment-based retention. This ensures that messages expire even if a
          subscriber never acknowledges them. Monitor the age of unacknowledged messages and alert
          when messages approach the retention deadline.
        </p>

        <p>
          <strong>Over-subscribing to topics.</strong> When too many services subscribe to the
          same topic, each message is faned out to a large number of subscribers, increasing
          broker load and delivery latency. If a topic has 500 subscribers and the publisher
          produces 10,000 messages per second, the broker must deliver 5 million messages per
          second. Fix: Use hierarchical topics and filter-based delivery to reduce the number of
          subscribers per topic. Group related subscribers into consumer groups and use topic
          hierarchies to allow coarse-grained subscriptions (subscribing to
          <code className="inline-code">events.user.*</code> instead of
          <code className="inline-code">events.user.created</code>,
          <code className="inline-code">events.user.updated</code>, and
          <code className="inline-code">events.user.deleted</code> separately).
        </p>

        <p>
          <strong>Non-idempotent subscribers.</strong> When at-least-once delivery causes duplicate
          message delivery and subscribers are not idempotent, the same event is processed multiple
          times, causing duplicate side effects (duplicate emails, duplicate database inserts,
          duplicate charges). Fix: Design subscribers to be idempotent. Use unique message
          identifiers and a deduplication store to detect and skip duplicate messages. Ensure that
          the subscriber&apos;s processing logic (database writes, API calls, notifications) is
          also idempotent: writing the same record twice should be a no-op, not a duplicate.
        </p>

        <p>
          <strong>Ignoring dead letter topics.</strong> Dead letter topics accumulate failed
          messages, but if operators do not monitor and process them, the root causes of delivery
          failures are never identified and fixed. Over time, the same types of messages
          continuously fail, wasting broker resources and indicating systemic issues. Fix: Monitor
          dead letter topic depth and set alerts when messages accumulate. Implement automated
          analysis of dead letter messages to identify common failure patterns (invalid schema,
          downstream service failures, bugs in subscriber code). Fix the root causes and reprocess
          dead letter messages after the fix is deployed.
        </p>

        <p>
          <strong>Coupling publishers to subscribers through message format.</strong> When
          publishers design messages based on subscriber needs (including fields that only one
          subscriber uses, structuring the message body in a subscriber-specific format), the
          publisher becomes coupled to its subscribers. Adding or removing subscribers requires
          changing the publisher&apos;s message format, defeating the decoupling purpose of
          pub-sub. Fix: Design messages from the publisher&apos;s domain perspective: the message
          should represent the event that occurred, not what subscribers need. Include all relevant
          information about the event in a canonical format, and let subscribers extract the fields
          they need. Use message attributes for subscriber-specific filtering rather than modifying
          the message body.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Spotify: Event-Driven Architecture with Pub-Sub</h3>
        <p>
          Spotify uses pub-sub extensively for its event-driven microservices architecture. Every
          significant event in the platform (song played, playlist created, user follow, artist
          follow, search query) is published to a topic, and downstream services subscribe to
          relevant topics for diverse purposes. The recommendation engine subscribes to
          <code className="inline-code">song.played</code> and
          <code className="inline-code">playlist.updated</code> events to update user taste
          profiles and generate personalized recommendations. The social feed subscribes to
          <code className="inline-code">user.follow</code> and
          <code className="inline-code">playlist.created</code> events to populate followers&apos;
          activity feeds. The analytics pipeline subscribes to all events to generate usage
          reports and A/B test results.
        </p>

        <p>
          Spotify&apos;s pub-sub infrastructure handles millions of events per second with
          sub-second delivery latency. Consumer groups are used to parallelize processing across
          hundreds of service instances, and filter-based delivery ensures that each service
          receives only the events relevant to its domain. Dead letter topics capture failed
          deliveries for investigation and reprocessing.
        </p>

        <h3>Slack: Real-Time Notification Delivery</h3>
        <p>
          Slack uses pub-sub for real-time notification delivery across its platform. When a
          message is posted to a channel, a <code className="inline-code">message.posted</code>
          event is published to the channel&apos;s topic. All online members of the channel
          receive the message through their WebSocket connections (subscribers). Additionally,
          the event is delivered to downstream services: the search service indexes the message,
          the notification service sends push notifications to offline users, the integration
          service triggers bot responses, and the analytics service tracks engagement metrics.
        </p>

        <p>
          Slack&apos;s pub-sub system must deliver messages to millions of subscribers within
          milliseconds. It uses push-based delivery with persistent WebSocket connections to
          minimize latency, and fan-out is optimized through a hierarchical broker topology
          (regional brokers serve subscribers in their region, with a central coordinator
          distributing messages across regions). Transient subscriptions are used for real-time
          message delivery (messages delivered only while the user is online), while durable
          subscriptions are used for search indexing and analytics (all messages retained until
          processed).
        </p>

        <h3>Stripe: Webhook Event Distribution</h3>
        <p>
          Stripe&apos;s webhook system is a pub-sub system where the events are payment-related
          (payment succeeded, payment failed, subscription created, invoice paid, dispute opened)
          and the subscribers are merchant-provided webhook endpoints. Merchants subscribe to
          specific event types through the Stripe dashboard, and Stripe delivers matching events
          to the merchant&apos;s webhook endpoint via HTTP POST.
        </p>

        <p>
          Stripe&apos;s pub-sub implementation provides at-least-once delivery with retry logic
          (events are retried with exponential backoff for up to 3 days), event versioning
          (each event includes an API version so merchants can handle schema changes), and
          signature verification (each event includes a cryptographic signature that merchants
          verify to ensure the event originated from Stripe). Dead letter handling moves events
          that consistently fail delivery to a retry queue for manual investigation.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q1: What is the publish-subscribe pattern, and how does it differ from a message queue?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The publish-subscribe (pub-sub) pattern enables one-to-many
              message distribution: a message published to a topic is delivered to all subscribers
              of that topic. A message queue enables one-to-one distribution: each message is
              consumed by exactly one consumer. The key difference is fan-out: pub-sub delivers
              each message to all subscribers (multiple consumers receive the same message), while
              a message queue delivers each message to one consumer (competing consumers share the
              workload). Pub-sub is used for event broadcasting (notify all interested services),
              while message queues are used for workload distribution (share processing across
              consumer instances).
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q2: How do you handle message ordering in a pub-sub system with multiple subscribers?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Message ordering in pub-sub depends on the underlying
              system. In systems that support partitioned topics (like Kafka), messages with the
              same ordering key are routed to the same partition and delivered in order within
              that partition. Across partitions, ordering is not guaranteed. In systems that
              support per-subscription ordering (like Google Cloud Pub/Sub with ordering keys),
              the broker ensures that messages with the same ordering key are delivered to each
              subscriber in the order they were published. If the underlying system does not
              support ordering, subscribers must implement their own reordering mechanism: each
              message includes a sequence number, and the subscriber buffers and reorders messages
              before processing them.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q3: A subscriber is falling behind and its lag is growing continuously. What do you do?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Diagnose the root cause: (1) Check the subscriber&apos;s
              processing throughput — is it processing messages slower than the production rate?
              (2) Check for errors — are messages failing and being retried, consuming resources
              without progress? (3) Check downstream dependencies — is the service the subscriber
              calls to slower than usual? (4) Check the subscriber count — are there enough
              instances in the consumer group?
            </p>
            <p className="mt-2 text-sm">
              Fix based on the diagnosis: If throughput is insufficient, add more consumer
              instances to the group (up to the number of partitions). If messages are failing,
              check the dead letter topic for the failure reason and fix the processing bug. If
              downstream latency is the issue, implement circuit breaking to prevent cascading
              failures. If the production rate has increased permanently, increase the number of
              partitions and consumer instances. As a short-term mitigation, implement rate
              limiting on the subscriber to cap its processing speed and prevent it from
              overwhelming downstream services during catch-up.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q4: How do you handle schema evolution in a pub-sub system where publishers and subscribers evolve independently?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Schema evolution is handled through backward-compatible
              schema changes and schema versioning. Backward-compatible changes include adding
              optional fields (existing subscribers ignore them), widening numeric types (existing
              subscribers can still parse them), and adding enum values (existing subscribers
              handle unknown values gracefully). Breaking changes (removing fields, renaming
              fields, narrowing types) require a new schema version.
            </p>
            <p className="mt-2 text-sm">
              Include the schema version in the message attributes so subscribers can select the
              appropriate deserializer. Use a schema registry (Confluent Schema Registry for
              Kafka, Google Cloud Pub/Sub schema support) to manage schema versions and enforce
              compatibility rules. Publishers register new schema versions with the registry before
              publishing messages with the new schema. Subscribers query the registry for the
              schema version of each message and deserialize accordingly. During the transition
              period, the publisher publishes messages in both the old and new schema formats
              (dual publishing) to support subscribers that have not yet migrated.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q5: How would you design a pub-sub system that needs to deliver messages to millions of subscribers with sub-second latency?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Design requires a hierarchical broker topology with regional
              brokers. The central coordinator receives messages from publishers and distributes
              them to regional brokers. Each regional broker serves subscribers in its region via
              push-based delivery (persistent WebSocket or HTTP/2 connections). This minimizes
              cross-region latency and distributes load across regions.
            </p>
            <p className="mt-2 text-sm">
              Use connection multiplexing to reduce the number of connections per broker: multiple
              subscribers share a single connection, and the broker routes messages to the
              appropriate subscriber within the connection. Implement batching at the broker:
              group messages for the same subscriber into a single delivery to reduce per-message
              overhead. Use topic hierarchies and filter-based delivery to reduce fan-out: each
              subscriber receives only messages matching its filters, not all messages published
              to the topic. Monitor broker CPU, connection count, and delivery latency to detect
              bottlenecks and scale horizontally by adding regional brokers.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q6: What happens when a subscriber crashes and restarts? How do you ensure no messages are lost?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> With durable subscriptions, the broker retains messages
              until all subscribers acknowledge them. When a subscriber crashes, its unacknowledged
              messages remain in the broker. When the subscriber restarts, it reconnects to the
              broker and receives all unacknowledged messages. The subscriber processes these
              messages and sends acknowledgments, completing the delivery.
            </p>
            <p className="mt-2 text-sm">
              To ensure no messages are lost: (1) Use durable subscriptions (not transient) for
              critical workflows. (2) Set a retention period long enough to cover the expected
              subscriber downtime (e.g., 7 days). (3) Configure the subscriber to acknowledge
              messages only after successful processing (not upon receipt). (4) Implement
              idempotent processing so that if a message was partially processed before the crash
              and is redelivered after restart, the duplicate processing does not cause incorrect
              state. (5) Monitor unacknowledged message age and alert when messages approach the
              retention deadline, indicating that a subscriber may be permanently offline.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cloud.google.com/pubsub/docs/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Pub/Sub Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/sns/latest/dg/welcome.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon SNS Developer Guide
            </a>
          </li>
          <li>
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka Documentation
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/webhooks"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Documentation — Webhooks Event Delivery
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 11 (Stream Processing).
          </li>
          <li>
            <a
              href="https://slack.engineering/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering Blog — Real-Time Message Delivery
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
