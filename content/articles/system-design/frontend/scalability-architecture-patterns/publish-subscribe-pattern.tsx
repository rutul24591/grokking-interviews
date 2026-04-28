"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-publish-subscribe-pattern",
  title: "Publish-Subscribe Pattern",
  description:
    "Comprehensive guide to the Publish-Subscribe Pattern in frontend architecture covering event buses, message brokers, cross-module communication, and decoupled event-driven systems.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "publish-subscribe-pattern",
  wordCount: 3500,
  readingTime: 14,
  lastUpdated: "2026-03-20",
  tags: ["frontend", "design-patterns", "pub-sub", "event-bus", "messaging"],
  relatedTopics: [
    "observer-pattern",
    "event-driven-architecture",
    "micro-frontends",
  ],
};

export default function PublishSubscribePatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          The <strong>Publish-Subscribe (Pub-Sub) Pattern</strong> is a
          messaging pattern where senders (publishers) emit messages to topics
          or channels without knowing who will receive them, and receivers
          (subscribers) listen to topics of interest without knowing who
          published the messages. The critical distinction from the Observer
          Pattern is the presence of a message broker or event bus that
          decouples publishers from subscribers entirely.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In frontend development, Pub-Sub is the architectural backbone for
          communication between loosely coupled modules, micro-frontends,
          cross-tab synchronization, and integration with real-time backend
          systems. Redux&apos;s dispatch/subscribe mechanism is Pub-Sub. The
          browser&apos;s BroadcastChannel API is Pub-Sub across tabs.
          PostMessage between iframes is Pub-Sub across origins. Server-Sent
          Events and WebSocket topic subscriptions are Pub-Sub between client
          and server.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The pattern became prominent in frontend architecture with the rise of
          single-page applications and micro-frontends, where independent
          modules need to coordinate without direct imports or shared state. It
          enables temporal decoupling (publisher and subscriber do not need to
          be active at the same time if messages are queued), spatial decoupling
          (they can run in different contexts — tabs, iframes, workers), and
          platform decoupling (they can be implemented in different frameworks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Publisher:</strong> The entity that emits messages to a
            topic. Publishers have no knowledge of subscribers — they fire and
            forget. In frontend terms, a publisher might be a component that
            dispatches a &quot;cart:item-added&quot; event or a service that
            emits &quot;auth:token-refreshed&quot;.
          </li>
          <li>
            <strong>Subscriber:</strong> The entity that registers interest in
            one or more topics and provides a callback to handle matching
            messages. Subscribers have no knowledge of publishers. A subscriber
            might be a badge component that listens for
            &quot;cart:item-added&quot; to update its count.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Message Broker / Event Bus:</strong> The intermediary that
            maintains topic-to-subscriber mappings and routes published messages
            to all matching subscribers. This is the key differentiator from the
            Observer Pattern — the broker enables full decoupling. The broker
            can be as simple as a Map of topic strings to callback arrays, or as
            sophisticated as a distributed message queue.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Topic / Channel:</strong> A named category that messages are
            published to and subscribed from. Topics provide logical grouping
            and filtering — subscribers only receive messages from topics they
            have subscribed to. Topics can be hierarchical
            (user.profile.updated) with wildcard subscriptions (user.*).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Message Envelope:</strong> The standardized format for
            messages flowing through the system. A well-designed envelope
            includes: topic, payload, timestamp, source identifier, and
            correlation ID. Standardized envelopes enable middleware (logging,
            validation, transformation) at the broker level.
          </HighlightBlock>
          <li>
            <strong>Delivery Guarantees:</strong> In-process event buses
            typically provide at-most-once delivery (if a subscriber is not
            registered, the message is lost). More sophisticated systems offer
            at-least-once (messages are retried until acknowledged) or
            exactly-once (deduplicated delivery). Frontend Pub-Sub systems
            rarely need stronger than at-most-once for UI events.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="important">
          The Pub-Sub architecture introduces a message broker between
          publishers and subscribers, creating full decoupling at the cost of
          additional infrastructure.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/publish-subscribe-pattern-diagram-1.svg"
          alt="Pub-Sub with Event Bus"
          caption="Pub-Sub with event bus — publishers emit events to named topics on the bus, which routes them to all topic subscribers"
        />

        <HighlightBlock as="p" tier="important">
          The event bus is the central hub through which all messages flow.
          Publishers call bus.publish(&quot;topic&quot;, data) and subscribers
          call bus.subscribe(&quot;topic&quot;, callback). The bus maintains an
          internal Map of topic strings to callback arrays and iterates through
          subscribers when a message arrives.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/publish-subscribe-pattern-diagram-2.svg"
          alt="Observer vs Pub-Sub Comparison"
          caption="Observer vs Pub-Sub — Observer has direct subject-to-observer coupling; Pub-Sub introduces a broker for full decoupling"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Cross-Module Event Channels
          </h3>
          <HighlightBlock as="p" tier="crucial">
            In large applications with independently developed modules, Pub-Sub
            channels serve as the communication contracts between modules. Each
            module documents the events it publishes and the events it
            subscribes to, creating an event-driven API surface. This enables
            modules to be developed, tested, and deployed independently as long
            as they adhere to the event contract.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important" className="mt-3">
            Key channel design decisions include: naming conventions
            (domain:entity:action), payload schemas (TypeScript interfaces
            shared via a contract package), versioning strategy
            (v1.cart.item-added), and error handling (what happens when a
            subscriber throws).
          </HighlightBlock>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/publish-subscribe-pattern-diagram-3.svg"
          alt="Observer vs Publish-Subscribe comparison showing direct observer registration versus broker-mediated publish-subscribe with coupling differences"
          caption="Observer vs Pub-Sub — direct coupling (subject knows observers) versus full decoupling (broker mediates all communication)"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <HighlightBlock as="tr" tier="crucial">
              <td className="p-3">
                <strong>Decoupling</strong>
              </td>
              <td className="p-3">
                • Publishers and subscribers have zero knowledge of each other
                <br />
                • Modules can be added/removed without affecting others
                <br />• Different frameworks can communicate via shared bus
              </td>
              <td className="p-3">
                • Difficult to trace message flow through the system
                <br />
                • No compile-time guarantee that subscribers exist
                <br />• Debugging requires dedicated tooling
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Flexibility</strong>
              </td>
              <td className="p-3">
                • New subscribers added without modifying publishers
                <br />
                • Topic-based filtering enables selective consumption
                <br />• Wildcard subscriptions for cross-cutting concerns
              </td>
              <td className="p-3">
                • Message format changes affect all subscribers
                <br />
                • No backpressure mechanism in simple implementations
                <br />• Event storms can cascade through the system
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Testability</strong>
              </td>
              <td className="p-3">
                • Publishers tested by verifying emitted events
                <br />
                • Subscribers tested by sending synthetic events
                <br />• Bus can be replaced with test doubles
              </td>
              <td className="p-3">
                • Integration testing requires full bus setup
                <br />
                • Async event handling complicates assertions
                <br />• Event ordering in tests may differ from production
              </td>
            </HighlightBlock>
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • Messages only processed by interested subscribers
                <br />
                • Batch processing possible at broker level
                <br />• Cross-context communication (workers, tabs) enabled
              </td>
              <td className="p-3">
                • Broker overhead for high-frequency events
                <br />
                • String-based topic matching is slower than direct calls
                <br />• Message serialization required for cross-context
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Define Event Contracts:</strong> Create TypeScript
            interfaces for each event topic&apos;s payload. Share these types
            via a contract package that both publishers and subscribers depend
            on. This provides compile-time safety for event payloads even though
            the Pub-Sub mechanism itself is runtime-dynamic.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use Namespaced Topics:</strong> Adopt a hierarchical naming
            convention like domain:entity:action (e.g.,
            &quot;cart:item:added&quot;, &quot;auth:session:expired&quot;). This
            enables wildcard subscriptions (&quot;cart:*&quot;) for
            cross-cutting subscribers like analytics and makes the event catalog
            self-documenting.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Always Unsubscribe:</strong> Like the Observer Pattern,
            every subscription must have a corresponding unsubscription. Return
            an unsubscribe function from the subscribe call and invoke it in
            React useEffect cleanup or component destruction hooks.
          </HighlightBlock>
          <li>
            <strong>Isolate Bus Errors:</strong> Wrap subscriber callbacks in
            try-catch within the broker so that one failing subscriber does not
            prevent other subscribers from receiving the event. Log errors with
            the topic name and subscriber identifier for debugging.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Add Middleware Support:</strong> Design the event bus to
            support middleware that intercepts events before they reach
            subscribers. Common middleware includes: logging (recording all
            events for debugging), validation (checking payloads against
            schemas), and transformation (normalizing data formats).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Document the Event Catalog:</strong> Maintain a registry of
            all events in the system with their topics, payload schemas,
            publishers, and subscribers. This serves as the contract
            documentation for the event-driven architecture and enables impact
            analysis when changing events.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Event Spaghetti:</strong> Without governance, the number of
            events grows uncontrollably, and the relationships between
            publishers and subscribers become opaque. This is the Pub-Sub
            equivalent of spaghetti code — impossible to trace, refactor, or
            debug. Maintain an event catalog and review new events as you would
            review new API endpoints.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Missing Subscribers:</strong> Publishing events that no one
            subscribes to is a silent failure. In development, this might mean a
            feature appears broken because a subscriber was not registered. Add
            development-mode warnings for events with zero subscribers.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Ordering Dependencies:</strong> Subscribers that depend on
            being called in a specific order create fragile systems. Pub-Sub
            does not guarantee ordering across different subscribers for the
            same topic. If ordering matters, use a saga or process manager
            pattern instead.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Payload Bloat:</strong> Including too much data in event
            payloads (entire entities instead of IDs, full state snapshots
            instead of deltas) wastes memory and serialization time, especially
            for cross-context communication. Include only the minimum data
            subscribers need to act; let them fetch additional data if required.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Global Bus as a Crutch:</strong> Using a global event bus
            for all communication — including between parent and child
            components — is an anti-pattern. Direct props, callbacks, and React
            Context are better for component-level communication. Reserve
            Pub-Sub for cross-module or cross-context communication where direct
            coupling is impractical.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Redux Store:</strong> Redux is a Pub-Sub system where
            dispatch() publishes actions to the store, reducers process them,
            and subscribers (connected components) are notified of state
            changes. The store is the broker, actions are messages, and action
            types are topics.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Cross-Tab Synchronization:</strong> Applications use the
            BroadcastChannel API to synchronize state across browser tabs. When
            a user logs out in one tab, a &quot;auth:logout&quot; event is
            published via BroadcastChannel, and all other tabs subscribe and
            respond by clearing their sessions.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Micro-Frontend Communication:</strong> Independent
            micro-frontends (different teams, different frameworks) communicate
            through a shared event bus on the window object. The cart micro-app
            publishes &quot;cart:updated&quot;, and the header micro-app
            subscribes to update the cart badge — neither knows the other
            exists.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Analytics Event Tracking:</strong> An analytics subscriber
            listens to all application events (wildcard subscription) and
            forwards them to the analytics service. This decouples analytics
            instrumentation from feature code — features publish business
            events, and analytics captures them without any feature knowing
            about analytics.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>WebSocket Topic Subscriptions:</strong> Real-time
            applications subscribe to WebSocket topics (chat rooms, notification
            channels, live feeds) using Pub-Sub semantics. The WebSocket
            connection is the broker, and messages are routed to topic-specific
            handlers on the client.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="important">
          Publish-Subscribe systems introduce unique security considerations around message authentication, authorization, and the potential for denial-of-service attacks through event flooding.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Message Authentication</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="crucial">
              <strong>Event Injection:</strong> Attackers can publish malicious events to trigger unauthorized actions. Mitigation: implement event authentication (HMAC signatures), validate event schemas rigorously, use allowlists for event types, implement publisher authentication.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Event Tampering:</strong> Events in transit can be modified. Mitigation: use signed events, implement end-to-end encryption for sensitive events, validate event integrity at subscriber level.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Replay Attacks:</strong> Captured legitimate events can be replayed. Mitigation: include timestamps and nonces in events, implement event idempotency checks, maintain event logs to detect duplicates.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization for Pub-Sub</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Publish Authorization:</strong> Not all publishers should publish to all topics. Mitigation: implement topic-based access control, validate publisher permissions before accepting events, use scoped API keys for publishers.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Subscribe Authorization:</strong> Not all subscribers should receive all events. Mitigation: implement subscription-level access control, filter events based on subscriber permissions, use separate channels for different security levels.
            </HighlightBlock>
            <li>
              <strong>Event Data Leakage:</strong> Subscribers may receive sensitive data they shouldn't access. Mitigation: implement data minimization (only include necessary data in events), use field-level encryption for sensitive data, implement event filtering at broker level.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Denial of Service Prevention</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="crucial">
              <strong>Event Flooding:</strong> Attackers can flood the broker with events to overwhelm subscribers. Mitigation: implement rate limiting per publisher, use backpressure mechanisms, implement circuit breakers for event processing.
            </HighlightBlock>
            <li>
              <strong>Subscription Bombing:</strong> Creating excessive subscriptions can exhaust broker resources. Mitigation: limit subscriptions per subscriber, implement subscription quotas, monitor subscription growth patterns.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategies</h2>
        <HighlightBlock as="p" tier="important">
          Testing Pub-Sub systems requires validating message routing, delivery guarantees, and the decoupled nature of publishers and subscribers.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Testing Pyramid for Pub-Sub</h3>
          <ul className="space-y-2">
            <li>
              <strong>Unit Tests (Base):</strong> Test publisher event emission logic. Test subscriber message handling. Mock the broker for isolated testing. Verify event schema validation.
            </li>
            <li>
              <strong>Integration Tests (Middle):</strong> Test end-to-end message flow through actual broker. Verify message routing to correct subscribers. Test delivery guarantees (at-least-once, at-most-once).
            </li>
            <HighlightBlock as="li" tier="crucial">
              <strong>Contract Tests (Middle):</strong> Verify event schemas match between publishers and subscribers. Use schema registry with compatibility checks. Run contract tests in CI for all publishers and subscribers.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Load Tests (Top):</strong> Test broker performance under load. Measure message throughput, latency, and subscriber lag. Verify backpressure mechanisms work correctly.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Message Delivery Testing</h3>
          <p>
            Testing message delivery guarantees is critical for Pub-Sub reliability:
          </p>
          <ol className="mt-3 space-y-2">
            <li>
              <strong>At-Least-Once Delivery:</strong> Test that messages are delivered at least once even with failures. Verify idempotency handles duplicates correctly.
            </li>
            <li>
              <strong>Message Ordering:</strong> Test that messages are delivered in order (if ordering is guaranteed). Test ordering within partitions/topics.
            </li>
            <li>
              <strong>Failure Recovery:</strong> Test subscriber crash recovery. Verify messages are redelivered after subscriber restart. Test dead letter queue handling.
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Broker Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Topic Routing:</strong> Test that messages are routed to correct topics. Test wildcard subscriptions. Verify topic permissions work correctly.
            </li>
            <li>
              <strong>Subscriber Management:</strong> Test subscriber registration and deregistration. Verify that unsubscribed subscribers don't receive messages.
            </li>
            <li>
              <strong>Persistence Testing:</strong> If broker supports persistence, test message durability. Verify messages survive broker restarts.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <HighlightBlock as="p" tier="important">
          Pub-Sub performance depends on broker efficiency, message throughput, and subscriber count. Understanding performance characteristics is essential for production systems.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Metrics to Track</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Measurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <HighlightBlock as="tr" tier="important">
                <td className="p-2">Message Throughput</td>
                <td className="p-2">10,000+ msg/sec</td>
                <td className="p-2">Broker metrics</td>
              </HighlightBlock>
              <HighlightBlock as="tr" tier="crucial">
                <td className="p-2">End-to-End Latency</td>
                <td className="p-2">&lt;100ms (95th percentile)</td>
                <td className="p-2">Distributed tracing</td>
              </HighlightBlock>
              <tr>
                <td className="p-2">Subscriber Lag</td>
                <td className="p-2">&lt;100 messages</td>
                <td className="p-2">Consumer offset tracking</td>
              </tr>
              <tr>
                <td className="p-2">Message Queue Depth</td>
                <td className="p-2">&lt;1,000 pending</td>
                <td className="p-2">Queue monitoring</td>
              </tr>
              <tr>
                <td className="p-2">Connection Count</td>
                <td className="p-2">10,000+ concurrent</td>
                <td className="p-2">Broker connection metrics</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Broker Performance Comparison</h3>
          <p>
            Different Pub-Sub implementations have different performance characteristics:
          </p>
          <ul className="mt-3 space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Redis Pub/Sub:</strong> Throughput: 100,000+ msg/sec. Latency: &lt;1ms. Best for: in-memory, low-latency requirements. Limitation: no persistence, messages lost on restart.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Kafka:</strong> Throughput: 1,000,000+ msg/sec. Latency: 2-10ms. Best for: durable event sourcing, high throughput. Limitation: operational complexity, requires ZooKeeper.
            </HighlightBlock>
            <li>
              <strong>RabbitMQ:</strong> Throughput: 50,000+ msg/sec. Latency: 1-5ms. Best for: complex routing, enterprise features. Limitation: lower throughput than Kafka.
            </li>
            <li>
              <strong>Browser BroadcastChannel:</strong> Throughput: 1,000+ msg/sec. Latency: 5-20ms. Best for: cross-tab communication. Limitation: same-origin only, limited browser support.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-World Performance Data</h3>
          <p>
            Based on published case studies from organizations using Pub-Sub:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Uber:</strong> Kafka-based event platform handles 1M+ messages/sec. Average end-to-end latency: &lt;100ms. Supports 10,000+ microservices.
            </li>
            <li>
              <strong>Netflix:</strong> Event-driven architecture processes 100B+ events/day. Uses Kafka with custom stream processing. Peak throughput: 5M+ msg/sec.
            </li>
            <li>
              <strong>Slack:</strong> Real-time messaging uses Pub-Sub for message delivery. Handles 10M+ concurrent connections. Message delivery latency: &lt;500ms (99th percentile).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <HighlightBlock as="p" tier="important">
          Pub-Sub systems have significant infrastructure and operational costs. Understanding the total cost of ownership is essential for justifying the architecture.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Managed Broker Services:</strong> AWS EventBridge ($1.00/million events), Google Pub/Sub ($0.40/million messages), Azure Service Bus ($0.05/hour + $0.01/million operations). For 100M events/month: $40-100/month.
            </HighlightBlock>
            <HighlightBlock as="li" tier="crucial">
              <strong>Self-Hosted Kafka:</strong> Infrastructure: $500-2,000/month (3-5 node cluster). Operations: 0.5-1 FTE for maintenance. Total: $5,000-15,000/month including operations.
            </HighlightBlock>
            <li>
              <strong>Self-Hosted RabbitMQ:</strong> Infrastructure: $200-500/month (smaller cluster). Operations: 0.25-0.5 FTE. Total: $2,500-7,500/month including operations.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Implementation Complexity:</strong> Pub-Sub adds architectural complexity. Estimate: 1-2 weeks for initial setup with proper error handling, retry logic, and monitoring.
            </li>
            <li>
              <strong>Debugging Overhead:</strong> Debugging distributed event flows is more complex than synchronous calls. Requires distributed tracing. Estimate: 10-20% more debugging time.
            </li>
            <li>
              <strong>Schema Management:</strong> Event schema evolution requires coordination. Schema registry maintenance: 0.1-0.2 FTE ongoing.
            </li>
          </ul>
        </div>

        <HighlightBlock
          as="div"
          tier="crucial"
          className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6"
        >
          <h3 className="mb-3 font-semibold">ROI Decision Framework</h3>
          <p>
            Use managed services when: (1) you have &lt;10M events/month, (2) limited DevOps resources, (3) rapid prototyping needed. Self-host when: (1) you have &gt;100M events/month, (2) strict data residency requirements, (3) dedicated DevOps team available. For most startups, managed services show better ROI until scale justifies self-hosting.
          </p>
        </HighlightBlock>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            as="div"
            tier="crucial"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">
              Q: What is the key difference between Observer and Pub-Sub
              patterns?
            </p>
            <p className="mt-2 text-sm">
              A: Coupling. In Observer, observers register directly with the
              subject — the subject maintains the observer list and calls
              observers directly, creating a direct dependency. In Pub-Sub, a
              broker (event bus) sits between publishers and subscribers —
              publishers emit to topics on the broker, subscribers listen to
              topics on the broker, and neither knows the other exists. This
              full decoupling enables cross-module, cross-framework, and even
              cross-process communication that Observer cannot support.
            </p>
          </HighlightBlock>

          <HighlightBlock
            as="div"
            tier="important"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">
              Q: How would you implement cross-tab communication using Pub-Sub?
            </p>
            <p className="mt-2 text-sm">
              A: Use the BroadcastChannel API — create a channel with a shared
              name across tabs, post messages with structured event objects
              (topic + payload), and listen for messages with onmessage
              handlers. For browsers that do not support BroadcastChannel, fall
              back to localStorage events (storage event fires when another tab
              writes to localStorage). Messages must be serializable (no
              functions, no circular references). Include a tab ID in messages
              to prevent self-echo. Close channels on page unload to prevent
              leaks.
            </p>
          </HighlightBlock>

          <HighlightBlock
            as="div"
            tier="important"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">
              Q: How does Redux relate to the Pub-Sub pattern?
            </p>
            <p className="mt-2 text-sm">
              A: Redux is a Pub-Sub system with constraints. dispatch(action)
              publishes a message (the action) to the store (the broker).
              Reducers process the message and produce new state.
              store.subscribe(listener) registers a subscriber that is notified
              on every state change. The constraints that distinguish Redux from
              a generic Pub-Sub are: single store (one broker), pure reducer
              processing (no side effects in message handling), and immutable
              state updates (new state is always a new object reference).
            </p>
          </HighlightBlock>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent event storms in a Pub-Sub system?
            </p>
            <p className="mt-2 text-sm">
              A: Event storms occur when a subscriber publishes a new event in
              response to an event, creating cascading notifications. Prevention
              strategies include: (1) prohibit publishing within subscriber
              callbacks (use a queue that processes after all subscribers
              complete), (2) implement circuit breakers that disable a topic
              after a threshold of messages per second, (3) use
              debouncing/throttling on high-frequency topics, (4) detect cycles
              by tracking event causation chains (each event carries the ID of
              the event that triggered it).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose Pub-Sub over direct function calls?
            </p>
            <p className="mt-2 text-sm">
              A: Use Pub-Sub when: (1) publisher and subscriber are in different
              modules owned by different teams, (2) multiple subscribers need to
              react to the same event, (3) the subscriber set is dynamic and
              changes at runtime, (4) communication crosses context boundaries
              (tabs, iframes, workers), or (5) you need temporal decoupling
              (events can be queued for offline processing). Use direct function
              calls when the caller knows exactly who should handle the request,
              there is a single handler, and the modules are tightly coupled by
              design.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — BroadcastChannel API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Window.postMessage
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/vanilla/mediator-middleware-pattern"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev — Mediator/Middleware Pattern
            </a>
          </li>
          <li>
            <a
              href="https://redux.js.org/understanding/thinking-in-redux/glossary"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux — Core Concepts Glossary
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
