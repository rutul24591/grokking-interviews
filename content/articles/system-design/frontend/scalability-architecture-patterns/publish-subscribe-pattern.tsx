"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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
        <p>
          The <strong>Publish-Subscribe (Pub-Sub) Pattern</strong> is a
          messaging pattern where senders (publishers) emit messages to topics
          or channels without knowing who will receive them, and receivers
          (subscribers) listen to topics of interest without knowing who
          published the messages. The critical distinction from the Observer
          Pattern is the presence of a message broker or event bus that
          decouples publishers from subscribers entirely.
        </p>
        <p>
          In frontend development, Pub-Sub is the architectural backbone for
          communication between loosely coupled modules, micro-frontends,
          cross-tab synchronization, and integration with real-time backend
          systems. Redux&apos;s dispatch/subscribe mechanism is Pub-Sub. The
          browser&apos;s BroadcastChannel API is Pub-Sub across tabs.
          PostMessage between iframes is Pub-Sub across origins. Server-Sent
          Events and WebSocket topic subscriptions are Pub-Sub between client
          and server.
        </p>
        <p>
          The pattern became prominent in frontend architecture with the rise of
          single-page applications and micro-frontends, where independent
          modules need to coordinate without direct imports or shared state. It
          enables temporal decoupling (publisher and subscriber do not need to
          be active at the same time if messages are queued), spatial decoupling
          (they can run in different contexts — tabs, iframes, workers), and
          platform decoupling (they can be implemented in different frameworks).
        </p>
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
          <li>
            <strong>Message Broker / Event Bus:</strong> The intermediary that
            maintains topic-to-subscriber mappings and routes published messages
            to all matching subscribers. This is the key differentiator from the
            Observer Pattern — the broker enables full decoupling. The broker
            can be as simple as a Map of topic strings to callback arrays, or as
            sophisticated as a distributed message queue.
          </li>
          <li>
            <strong>Topic / Channel:</strong> A named category that messages are
            published to and subscribed from. Topics provide logical grouping
            and filtering — subscribers only receive messages from topics they
            have subscribed to. Topics can be hierarchical
            (user.profile.updated) with wildcard subscriptions (user.*).
          </li>
          <li>
            <strong>Message Envelope:</strong> The standardized format for
            messages flowing through the system. A well-designed envelope
            includes: topic, payload, timestamp, source identifier, and
            correlation ID. Standardized envelopes enable middleware (logging,
            validation, transformation) at the broker level.
          </li>
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
        <p>
          The Pub-Sub architecture introduces a message broker between
          publishers and subscribers, creating full decoupling at the cost of
          additional infrastructure.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/publish-subscribe-pattern-diagram-1.svg"
          alt="Pub-Sub with Event Bus"
          caption="Pub-Sub with event bus — publishers emit events to named topics on the bus, which routes them to all topic subscribers"
        />

        <p>
          The event bus is the central hub through which all messages flow.
          Publishers call bus.publish(&quot;topic&quot;, data) and subscribers
          call bus.subscribe(&quot;topic&quot;, callback). The bus maintains an
          internal Map of topic strings to callback arrays and iterates through
          subscribers when a message arrives.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/publish-subscribe-pattern-diagram-2.svg"
          alt="Observer vs Pub-Sub Comparison"
          caption="Observer vs Pub-Sub — Observer has direct subject-to-observer coupling; Pub-Sub introduces a broker for full decoupling"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Cross-Module Event Channels
          </h3>
          <p>
            In large applications with independently developed modules, Pub-Sub
            channels serve as the communication contracts between modules. Each
            module documents the events it publishes and the events it
            subscribes to, creating an event-driven API surface. This enables
            modules to be developed, tested, and deployed independently as long
            as they adhere to the event contract.
          </p>
          <p className="mt-3">
            Key channel design decisions include: naming conventions
            (domain:entity:action), payload schemas (TypeScript interfaces
            shared via a contract package), versioning strategy
            (v1.cart.item-added), and error handling (what happens when a
            subscriber throws).
          </p>
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
            <tr>
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
            </tr>
            <tr>
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
            </tr>
            <tr>
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
            </tr>
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
          <li>
            <strong>Define Event Contracts:</strong> Create TypeScript
            interfaces for each event topic&apos;s payload. Share these types
            via a contract package that both publishers and subscribers depend
            on. This provides compile-time safety for event payloads even though
            the Pub-Sub mechanism itself is runtime-dynamic.
          </li>
          <li>
            <strong>Use Namespaced Topics:</strong> Adopt a hierarchical naming
            convention like domain:entity:action (e.g.,
            &quot;cart:item:added&quot;, &quot;auth:session:expired&quot;). This
            enables wildcard subscriptions (&quot;cart:*&quot;) for
            cross-cutting subscribers like analytics and makes the event catalog
            self-documenting.
          </li>
          <li>
            <strong>Always Unsubscribe:</strong> Like the Observer Pattern,
            every subscription must have a corresponding unsubscription. Return
            an unsubscribe function from the subscribe call and invoke it in
            React useEffect cleanup or component destruction hooks.
          </li>
          <li>
            <strong>Isolate Bus Errors:</strong> Wrap subscriber callbacks in
            try-catch within the broker so that one failing subscriber does not
            prevent other subscribers from receiving the event. Log errors with
            the topic name and subscriber identifier for debugging.
          </li>
          <li>
            <strong>Add Middleware Support:</strong> Design the event bus to
            support middleware that intercepts events before they reach
            subscribers. Common middleware includes: logging (recording all
            events for debugging), validation (checking payloads against
            schemas), and transformation (normalizing data formats).
          </li>
          <li>
            <strong>Document the Event Catalog:</strong> Maintain a registry of
            all events in the system with their topics, payload schemas,
            publishers, and subscribers. This serves as the contract
            documentation for the event-driven architecture and enables impact
            analysis when changing events.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Event Spaghetti:</strong> Without governance, the number of
            events grows uncontrollably, and the relationships between
            publishers and subscribers become opaque. This is the Pub-Sub
            equivalent of spaghetti code — impossible to trace, refactor, or
            debug. Maintain an event catalog and review new events as you would
            review new API endpoints.
          </li>
          <li>
            <strong>Missing Subscribers:</strong> Publishing events that no one
            subscribes to is a silent failure. In development, this might mean a
            feature appears broken because a subscriber was not registered. Add
            development-mode warnings for events with zero subscribers.
          </li>
          <li>
            <strong>Ordering Dependencies:</strong> Subscribers that depend on
            being called in a specific order create fragile systems. Pub-Sub
            does not guarantee ordering across different subscribers for the
            same topic. If ordering matters, use a saga or process manager
            pattern instead.
          </li>
          <li>
            <strong>Payload Bloat:</strong> Including too much data in event
            payloads (entire entities instead of IDs, full state snapshots
            instead of deltas) wastes memory and serialization time, especially
            for cross-context communication. Include only the minimum data
            subscribers need to act; let them fetch additional data if required.
          </li>
          <li>
            <strong>Global Bus as a Crutch:</strong> Using a global event bus
            for all communication — including between parent and child
            components — is an anti-pattern. Direct props, callbacks, and React
            Context are better for component-level communication. Reserve
            Pub-Sub for cross-module or cross-context communication where direct
            coupling is impractical.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Redux Store:</strong> Redux is a Pub-Sub system where
            dispatch() publishes actions to the store, reducers process them,
            and subscribers (connected components) are notified of state
            changes. The store is the broker, actions are messages, and action
            types are topics.
          </li>
          <li>
            <strong>Cross-Tab Synchronization:</strong> Applications use the
            BroadcastChannel API to synchronize state across browser tabs. When
            a user logs out in one tab, a &quot;auth:logout&quot; event is
            published via BroadcastChannel, and all other tabs subscribe and
            respond by clearing their sessions.
          </li>
          <li>
            <strong>Micro-Frontend Communication:</strong> Independent
            micro-frontends (different teams, different frameworks) communicate
            through a shared event bus on the window object. The cart micro-app
            publishes &quot;cart:updated&quot;, and the header micro-app
            subscribes to update the cart badge — neither knows the other
            exists.
          </li>
          <li>
            <strong>Analytics Event Tracking:</strong> An analytics subscriber
            listens to all application events (wildcard subscription) and
            forwards them to the analytics service. This decouples analytics
            instrumentation from feature code — features publish business
            events, and analytics captures them without any feature knowing
            about analytics.
          </li>
          <li>
            <strong>WebSocket Topic Subscriptions:</strong> Real-time
            applications subscribe to WebSocket topics (chat rooms, notification
            channels, live feeds) using Pub-Sub semantics. The WebSocket
            connection is the broker, and messages are routed to topic-specific
            handlers on the client.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
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
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
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
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
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
          </div>

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
