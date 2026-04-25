"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-event-driven-architecture",
  title: "Event-Driven Architecture",
  description:
    "In-depth guide to Event-Driven Architecture in frontend systems covering event sourcing, CQRS, event buses, DOM event system, and building reactive, loosely-coupled web applications at scale.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "event-driven-architecture",
  wordCount: 3800,
  readingTime: 15,
  lastUpdated: "2026-03-20",
  tags: ["frontend", "architecture", "event-driven", "EDA", "reactive"],
  relatedTopics: ["publish-subscribe-pattern", "observer-pattern", "micro-frontends"],
};

export default function EventDrivenArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Event-Driven Architecture (EDA)</strong> is a software design paradigm where the flow of
          the program is determined by events — significant changes in state that are produced, detected,
          consumed, and reacted to by different parts of the system. In frontend development, EDA is not
          just a pattern but the fundamental execution model: user interactions generate DOM events,
          frameworks respond by updating state and re-rendering components, and the browser&apos;s event
          loop orchestrates it all.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Beyond the basic event loop, modern frontend architectures apply EDA principles at higher levels
          of abstraction. Event sourcing captures every state change as an immutable event log, enabling
          undo/redo, time-travel debugging, and collaborative editing. CQRS (Command Query Responsibility
          Segregation) separates read and write paths for optimal performance. Saga patterns coordinate
          multi-step workflows through event sequences. These patterns, originally from backend distributed
          systems, have found powerful applications in complex frontend applications.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The rise of real-time applications — collaborative editors (Notion, Figma), live dashboards,
          multiplayer games, and social feeds — has made EDA skills essential for staff-level frontend
          engineers. Understanding how to design event topologies, manage event ordering, handle eventual
          consistency in the UI, and debug asynchronous event flows separates senior practitioners from
          those who only work with synchronous request-response patterns.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Event Producers:</strong> Entities that detect state changes and emit events. In
            frontend, producers include: user interactions (clicks, keystrokes), browser APIs (visibility
            change, network status), timers (setInterval, requestAnimationFrame), WebSocket connections
            (incoming messages), and application logic (state transitions, validation results).
          </li>
          <li>
            <strong>Event Consumers:</strong> Entities that subscribe to events and react to them. Consumers
            may update state, trigger side effects (API calls, analytics), update the DOM, or produce new
            events. In React, components consuming state from Zustand or Redux are event consumers — they
            react to state-change events by re-rendering.
          </li>
          <li>
            <strong>Event Channel:</strong> The transport mechanism that routes events from producers to
            consumers. Channels can be synchronous (DOM event dispatch), asynchronous (message queues),
            in-process (event bus), or cross-process (BroadcastChannel, WebSocket). Channel design
            determines delivery guarantees, ordering, and performance characteristics.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Event Sourcing:</strong> Instead of storing current state, store the sequence of events
            that led to the current state. The current state is derived by replaying events. In frontend,
            this enables undo/redo (replay events minus the last one), collaborative editing (merge event
            streams from multiple users), and time-travel debugging (replay to any point).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>CQRS (Command Query Responsibility Segregation):</strong> Separating the model for
            writing (commands that produce events) from the model for reading (queries against materialized
            views). In frontend, this manifests as separating mutation logic (API calls, optimistic updates)
            from display logic (derived state, selectors, computed values).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Saga / Process Manager:</strong> A pattern for coordinating multi-step event-driven
            workflows. A saga listens for events and produces commands, managing the lifecycle of a complex
            process (multi-step form submission, payment flow, onboarding wizard). Redux-Saga and XState
            are popular frontend implementations.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          EDA in frontend applications operates at multiple levels — from low-level DOM events to
          high-level application event flows.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/event-driven-architecture-diagram-1.svg"
          alt="Event Topology showing Producers and Consumers"
          caption="Event topology — event producers emit to channels, which route events to registered consumers based on topic subscriptions"
          captionTier="crucial"
        />

        <HighlightBlock as="p" tier="important">
          The event topology defines how events flow through the system. In a simple topology, all events
          flow through a single bus. In a more sophisticated topology, events are partitioned by domain
          (auth events, commerce events, UI events) with dedicated channels, and cross-domain events are
          bridged explicitly.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/event-driven-architecture-diagram-2.svg"
          alt="Frontend Event Flow Cycle"
          caption="Frontend event flow — user interaction → DOM event → handler → state update → re-render → UI update cycle"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          The browser&apos;s DOM event system follows a three-phase model: capture (events propagate from
          window down to the target), target (event fires on the target element), and bubble (events
          propagate from target back up to window). Understanding this propagation model is essential for
          implementing event delegation, preventing unwanted event handling, and optimizing event listener
          placement.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Sourcing vs Event Notification vs Event-Carried State Transfer</h3>
          <p>
            Three distinct patterns for what events carry:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Event Notification:</strong> Minimal payload — just signals that something happened
              (&quot;order.created&quot; with order ID). Consumers must query for details. Low coupling but
              requires additional requests.
            </li>
            <li>
              <strong>Event-Carried State Transfer:</strong> Full payload — event contains all data consumers
              need (&quot;order.created&quot; with complete order object). No additional queries needed but
              larger messages and tighter payload coupling.
            </li>
            <li>
              <strong>Event Sourcing:</strong> Events are the system of record — state is derived by
              replaying events. Enables temporal queries, audit logs, and state reconstruction. Highest
              complexity but most powerful for collaborative and auditable systems.
            </li>
          </ul>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/event-driven-architecture-diagram-3.svg"
          alt="Event patterns comparison showing Event Notification (minimal payload), Event-Carried State Transfer (full payload), and Event Sourcing (append-only stream) with their trade-offs"
          caption="Event patterns — trade-offs between payload size, coupling, and use cases for notification, state transfer, and sourcing"
          captionTier="important"
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
              <td className="p-3"><strong>Responsiveness</strong></td>
              <td className="p-3">
                • Immediate reaction to state changes<br />
                • No polling or manual synchronization needed<br />
                • Natural fit for real-time UI updates
              </td>
              <td className="p-3">
                <HighlightBlock tier="crucial">
                  • Eventual consistency requires careful UI design<br />
                  • Event ordering issues create race conditions<br />
                  • Hard to reason about system state at any point
                </HighlightBlock>
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Modularity</strong></td>
              <td className="p-3">
                • Producers and consumers evolve independently<br />
                • New consumers added without modifying producers<br />
                • Clean separation of concerns
              </td>
              <td className="p-3">
                <HighlightBlock tier="important">
                  • Control flow is implicit and non-linear<br />
                  • Debugging requires tracing through event chains<br />
                  • Stack traces do not capture event causation
                </HighlightBlock>
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Scalability</strong></td>
              <td className="p-3">
                • Fan-out to many consumers efficiently<br />
                • Async processing enables backpressure management<br />
                • Natural parallelism in consumer processing
              </td>
              <td className="p-3">
                <HighlightBlock tier="important">
                  • Event storms from cascading producers<br />
                  • Duplicate events require idempotent consumers<br />
                  • Event schema evolution is complex
                </HighlightBlock>
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Auditability</strong></td>
              <td className="p-3">
                • Event logs provide complete history<br />
                • Event sourcing enables time-travel debugging<br />
                • Replay events for testing and debugging
              </td>
              <td className="p-3">
                • Event storage grows unbounded without compaction<br />
                • Rebuilding state from events is slow for long histories<br />
                • Schema migrations require replaying with transformations
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Design Events as Facts, Not Commands:</strong> Events should describe what happened
            (&quot;OrderPlaced&quot;), not what should happen (&quot;PlaceOrder&quot;). Commands are
            requests that may be rejected; events are facts that have already occurred. This distinction
            is fundamental to correct event-driven design.
          </HighlightBlock>
          <li>
            <strong>Use Event Delegation for DOM Events:</strong> Instead of attaching event listeners to
            every interactive element, attach a single listener to a common ancestor and use event.target
            to determine which element was clicked. This reduces memory usage and handles dynamically
            added elements automatically.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Make Event Consumers Idempotent:</strong> Design consumers to handle duplicate events
            safely. Network retries, message broker redelivery, and React Strict Mode double-rendering can
            all cause events to be processed multiple times. Use correlation IDs or last-processed
            timestamps to detect and skip duplicates.
          </HighlightBlock>
          <li>
            <strong>Implement Event Replay for Debugging:</strong> Log events in development and provide
            a replay mechanism that re-dispatches recorded events. This enables reproducing bugs from
            event logs without requiring the user to repeat their interaction sequence.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Version Event Schemas:</strong> When evolving event payloads, add a version field and
            support upcasting (transforming older event versions to the current schema). This prevents
            breaking consumers when the event format changes and enables gradual migration.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Separate Side Effects from State Updates:</strong> Handle state updates synchronously
            and trigger side effects (API calls, analytics, notifications) asynchronously in response to
            state change events. This keeps state updates predictable and side effects manageable.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Cascading Event Storms:</strong> Consumer A handles event X and produces event Y.
            Consumer B handles event Y and produces event Z. Consumer C handles event Z and produces event
            X. This creates an infinite loop. Prevent by: prohibiting event production within event
            handlers (use a queue), implementing cycle detection, or imposing maximum event depth.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Lost Events:</strong> Events published before subscribers register are silently lost
            in most in-process event bus implementations. This is particularly problematic during
            application startup when initialization order matters. Solutions include: late-subscriber
            replay, event buffering, or guaranteed initialization ordering.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Debugging Difficulty:</strong> Asynchronous event flows do not produce linear stack
            traces. When a bug manifests in a consumer, the stack trace shows the event dispatch path,
            not the original user action that caused the event. Use correlation IDs that trace from the
            originating user action through all consequent events.
          </HighlightBlock>
          <li>
            <strong>Over-Eventifying:</strong> Making every function call an event adds latency,
            complexity, and debugging difficulty without providing the benefits of decoupling. Reserve
            event-driven communication for genuinely cross-module interactions where direct coupling would
            be problematic. Within a module, direct function calls are faster and easier to trace.
          </li>
          <li>
            <strong>Inconsistent Event Naming:</strong> Without naming conventions, events like
            &quot;userUpdated&quot;, &quot;UPDATE_USER&quot;, &quot;user.profile.changed&quot;, and
            &quot;onUserUpdate&quot; proliferate, making the event catalog unsearchable. Establish and
            enforce a naming convention early.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Figma&apos;s Collaborative Editing:</strong> Figma uses event sourcing to capture every
            design change as an event. These events are broadcast to all connected clients via WebSocket,
            enabling real-time collaboration. Conflict resolution merges concurrent event streams using
            operational transformation.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Redux DevTools Time Travel:</strong> Redux DevTools records every dispatched action
            (event). The time-travel feature replays actions from the beginning to any point, showing the
            state at that moment. This is event sourcing applied to application state debugging.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Google Docs Real-Time Sync:</strong> Operational Transformation (OT) in Google Docs is
            an event-driven architecture where every keystroke produces an event. Events are sent to the
            server, transformed against concurrent events from other users, and broadcast to all clients.
          </HighlightBlock>
          <li>
            <strong>React Error Boundaries:</strong> React&apos;s error handling uses event propagation
            semantics — errors bubble up through the component tree until an Error Boundary catches them,
            similar to how DOM events bubble through the DOM tree until a handler calls stopPropagation.
          </li>
          <li>
            <strong>Analytics Pipelines:</strong> Modern analytics (Segment, Amplitude) use event-driven
            pipelines where user interactions produce events, events are enriched with context (user
            properties, session data), and routed to multiple destinations (analytics service, CRM,
            marketing tools) through a fan-out architecture.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="crucial">
          Event-Driven Architecture introduces unique security considerations because events often carry sensitive data and can trigger side effects across system boundaries. Proper security controls must be implemented at both the event production and consumption layers.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Injection Attacks</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Event Spoofing:</strong> Attackers can craft malicious events that mimic legitimate system events. Mitigation: implement event authentication (HMAC signatures), validate event schemas rigorously, use allowlists for event types, implement rate limiting per event source.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Event Replay Attacks:</strong> Captured legitimate events can be replayed to trigger unauthorized actions. Mitigation: include timestamps and nonces in events, implement event idempotency checks, maintain event logs to detect duplicates, use short expiration windows for time-sensitive events.
            </HighlightBlock>
            <li>
              <strong>Privilege Escalation via Events:</strong> Events that trigger state changes may be exploited to escalate privileges. Mitigation: validate user permissions at event consumption time (not just production), implement principle of least privilege for event handlers, audit all event-triggered actions.
            </li>
            <li>
              <strong>Denial of Service via Event Flooding:</strong> Attackers can flood the event bus with events to overwhelm consumers. Mitigation: implement event quotas per source, use backpressure mechanisms, implement circuit breakers for event processing, monitor event queue depths.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Protection in Events</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>PII in Events:</strong> Events often contain personally identifiable information. Mitigation: encrypt sensitive fields, implement data minimization (only include necessary data), use tokenization for sensitive identifiers, implement data retention policies for event logs.
            </HighlightBlock>
            <li>
              <strong>Event Schema Evolution:</strong> Changing event schemas can break consumers or leak data. Mitigation: use schema registry with versioning, implement backward compatibility checks, deprecate fields gradually, audit schema changes for security implications.
            </li>
            <li>
              <strong>Cross-Origin Event Security:</strong> Events crossing origin boundaries (postMessage, BroadcastChannel) require strict validation. Mitigation: validate message origins, use MessageChannel for trusted communication, implement strict content security policies, sanitize all cross-origin data.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Audit Logging for Events</h3>
          <ul className="space-y-2">
            <li>
              <strong>Event Provenance:</strong> Track event origin (user ID, session ID, IP address, timestamp). Essential for forensic analysis and compliance.
            </li>
            <li>
              <strong>Event Chain Tracking:</strong> Use correlation IDs to trace event chains across multiple consumers. Critical for debugging and audit trails.
            </li>
            <li>
              <strong>Immutable Event Logs:</strong> Store events in append-only logs for audit compliance. Use write-once storage (S3 with Object Lock) for regulatory compliance.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategies</h2>
        <HighlightBlock as="p" tier="crucial">
          Testing event-driven systems requires validating both individual event handlers and the emergent behavior of the entire event flow. The asynchronous, decoupled nature of EDA presents unique testing challenges.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Testing Pyramid for EDA</h3>
          <ul className="space-y-2">
            <li>
              <strong>Unit Tests (Base):</strong> Test individual event producers and consumers in isolation. Mock the event bus to avoid integration dependencies. Test event schema validation, business logic in handlers, and error handling.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>Contract Tests (Middle):</strong> Verify event schemas match between producers and consumers. Use schema registry with compatibility checks. Run contract tests in CI for all event-producing and event-consuming services.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Integration Tests (Middle):</strong> Test event flow through the actual event bus. Validate that events are routed correctly, consumers receive expected events, and side effects are triggered. Use testcontainers for realistic event bus infrastructure.
            </HighlightBlock>
            <li>
              <strong>End-to-End Tests (Top):</strong> Test complete user journeys that span multiple event-driven components. Focus on critical business flows. Use tools like Cypress or Playwright for frontend E2E, combined with backend event tracing.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Sourcing Testing</h3>
          <p>
            For event-sourced systems, testing focuses on event sequences and state reconstruction:
          </p>
          <ol className="mt-3 space-y-2">
            <li>
              <strong>Given-When-Then Tests:</strong> Given [initial state], When [event occurs], Then [expected state change]. Test each event type&apos;s effect on state.
            </li>
            <li>
              <strong>Event Sequence Tests:</strong> Test valid and invalid event sequences. Verify that invalid sequences are rejected (e.g., &quot;OrderShipped&quot; before &quot;OrderPlaced&quot;).
            </li>
            <li>
              <strong>Snapshot Testing:</strong> Test state reconstruction from event streams. Verify that snapshots match reconstructed state at various points in the event stream.
            </li>
            <li>
              <strong>Concurrency Tests:</strong> Test concurrent event processing. Verify that race conditions are handled correctly and eventual consistency is achieved.
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Chaos Testing for Event Systems</h3>
          <ul className="space-y-2">
            <li>
              <strong>Event Bus Failures:</strong> Simulate event bus outages. Verify that producers handle failures gracefully (retry queues, dead letter queues) and consumers handle gaps in event streams.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>Consumer Failures:</strong> Simulate consumer crashes during event processing. Verify that events are reprocessed correctly and idempotency prevents duplicate side effects.
            </HighlightBlock>
            <li>
              <strong>Network Partitions:</strong> Simulate network partitions between event producers and consumers. Verify that the system handles partitions gracefully and recovers when connectivity is restored.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <HighlightBlock as="p" tier="crucial">
          Event-Driven Architecture performance depends on event throughput, latency, and the efficiency of event routing. Understanding performance characteristics is essential for production systems.
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
              <tr>
                <td className="p-2">Event Production Latency</td>
                <td className="p-2">&lt;10ms (in-process)</td>
                <td className="p-2">Custom performance marks</td>
              </tr>
              <tr>
                <td className="p-2">Event Delivery Latency</td>
                <td className="p-2">&lt;100ms (95th percentile)</td>
                <td className="p-2">Distributed tracing</td>
              </tr>
              <tr>
                <td className="p-2">Event Throughput</td>
                <td className="p-2">1000+ events/sec</td>
                <td className="p-2">Event bus metrics</td>
              </tr>
              <tr>
                <td className="p-2">Consumer Lag</td>
                <td className="p-2">&lt;100 events</td>
                <td className="p-2">Consumer offset tracking</td>
              </tr>
              <tr>
                <td className="p-2">Event Queue Depth</td>
                <td className="p-2">&lt;1000 pending</td>
                <td className="p-2">Queue monitoring</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Bus Performance Comparison</h3>
          <p>
            Different event bus implementations have different performance characteristics:
          </p>
          <ul className="mt-3 space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>In-Process Event Bus (EventEmitter, RxJS Subject):</strong> Latency: &lt;1ms. Throughput: 10,000+ events/sec. Best for: single-application event routing. Limitation: no cross-process communication.
            </HighlightBlock>
            <li>
              <strong>Browser BroadcastChannel:</strong> Latency: 5-20ms. Throughput: 100-500 events/sec. Best for: cross-tab communication. Limitation: same-origin only, limited browser support.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>WebSocket Event Stream:</strong> Latency: 10-50ms. Throughput: 1,000+ events/sec. Best for: real-time server-to-client events. Limitation: requires persistent connection, server infrastructure.
            </HighlightBlock>
            <li>
              <strong>Message Queue (Kafka, RabbitMQ):</strong> Latency: 10-100ms. Throughput: 10,000+ events/sec. Best for: durable event sourcing, cross-service communication. Limitation: infrastructure complexity, operational overhead.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-World Performance Data</h3>
          <p>
            Based on published case studies from organizations using event-driven frontends:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Netflix:</strong> Event-driven UI updates handle 100M+ events/day. Average event delivery latency: 50ms. Peak throughput: 50,000 events/sec.
            </li>
            <li>
              <strong>Uber:</strong> Real-time driver tracking uses event streaming. Event processing latency: &lt;100ms (99th percentile). System handles 1M+ concurrent connections.
            </li>
            <li>
              <strong>Figma:</strong> Collaborative editing processes 10,000+ events/sec per document. Event conflict resolution: &lt;50ms. Operational transformation ensures consistency across 100+ concurrent editors.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <HighlightBlock as="p" tier="crucial">
          Event-Driven Architecture has significant cost implications for infrastructure, development, and operations. Understanding the total cost of ownership is essential for justifying the architecture.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Event Bus/Queue:</strong> Managed services (AWS EventBridge, Kafka): $0.50-2.00 per million events. For 100M events/month: $50-200/month. Self-hosted Kafka: $500-2,000/month (infrastructure + operations).
            </HighlightBlock>
            <li>
              <strong>Event Storage:</strong> Event logs require durable storage. S3 for event archives: $0.023/GB. For 1TB/month of events: ~$23/month. Database for event sourcing: $100-500/month depending on throughput.
            </li>
            <li>
              <strong>Monitoring &amp; Observability:</strong> Distributed tracing, event monitoring, alerting. Estimate: $500-2,000/month for comprehensive observability at scale.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Developer Productivity Impact</h3>
          <ul className="space-y-2">
            <li>
              <strong>Positive:</strong> Loose coupling enables parallel development. Teams can develop event producers and consumers independently. Estimated time savings: 20-30% on feature development.
            </li>
            <li>
              <strong>Positive:</strong> Easier testing and debugging with event replay. Reproduce bugs by replaying event sequences. Estimated debugging time reduction: 30-50%.
            </li>
            <li>
              <strong>Negative:</strong> Event schema evolution requires coordination. Breaking changes require careful migration. Estimated coordination overhead: 5-10% of development time.
            </li>
            <li>
              <strong>Negative:</strong> Debugging distributed event flows is more complex than synchronous calls. Requires distributed tracing infrastructure. Learning curve for event-driven thinking.
            </li>
          </ul>
        </div>

        <HighlightBlock
          className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6"
          tier="important"
        >
          <h3 className="mb-3 font-semibold">ROI Calculation Framework</h3>
          <p>
            To calculate ROI: (1) Estimate development velocity improvement (features/month × value per feature). (2) Estimate infrastructure costs (event bus, storage, monitoring). (3) Estimate reduced debugging time (hours saved × hourly rate). (4) Calculate net: (velocity gains + debugging savings) - (infrastructure costs). For high-velocity teams with complex integrations, EDA typically shows positive ROI within 6-12 months.
          </p>
        </HighlightBlock>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">Q: How does the DOM event model work (capture, target, bubble phases)?</p>
            <p className="mt-2 text-sm">
              A: When an event fires on an element, it goes through three phases: (1) Capture phase —
              the event travels from the window down through ancestors to the target element. Listeners
              registered with capture: true fire during this phase. (2) Target phase — the event reaches
              the target element and fires listeners on it. (3) Bubble phase — the event travels back up
              from the target to the window. Most listeners fire during this phase. stopPropagation()
              prevents further propagation in any direction. Event delegation exploits bubbling by placing
              one listener on a parent to handle events from many children.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="crucial"
          >
            <p className="font-semibold">Q: What is event sourcing, and how would you implement undo/redo with it?</p>
            <p className="mt-2 text-sm">
              A: Event sourcing stores state as a sequence of events rather than as a snapshot. Current
              state is derived by replaying events from the beginning. For undo/redo: maintain an event
              list and a cursor. Undo moves the cursor back one event and rebuilds state by replaying
              events up to the new cursor position. Redo moves the cursor forward and replays the next
              event. For performance, snapshot state periodically so you do not need to replay from the
              beginning every time. This is how collaborative tools like Figma and Notion implement
              undo/redo across concurrent users.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">Q: What is the difference between a command and an event in EDA?</p>
            <p className="mt-2 text-sm">
              A: A command is a request to do something — it is imperative, directed at a specific handler,
              and may be rejected (&quot;CreateOrder&quot;). An event is a notification that something
              happened — it is declarative, broadcast to all interested parties, and cannot be rejected
              because it represents an accomplished fact (&quot;OrderCreated&quot;). Commands have one
              handler; events can have many subscribers. Commands are synchronous (caller waits for result);
              events are asynchronous (publisher does not wait for subscriber processing). Well-designed
              systems use commands for input and events for output.
            </p>
          </HighlightBlock>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you debug an event-driven system with non-linear control flow?</p>
            <p className="mt-2 text-sm">
              A: (1) Assign correlation IDs to user actions and propagate them through all consequent
              events, creating a traceable chain. (2) Implement event logging middleware that records
              every published event with its correlation ID, timestamp, and payload. (3) Build a visual
              event flow debugger that reconstructs the event chain from logs. (4) Use Redux DevTools-style
              time-travel when applicable. (5) In development, add event replay capability to reproduce
              bugs from recorded event sequences. (6) Use structured logging with event name, producer,
              and consumer identifiers for grep-based debugging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle eventual consistency in a frontend event-driven system?</p>
            <p className="mt-2 text-sm">
              A: Eventual consistency means the UI may temporarily show stale data after a mutation.
              Strategies: (1) Optimistic updates — immediately update the UI as if the mutation succeeded,
              then reconcile when the server response arrives. (2) Loading states — show activity indicators
              while events propagate. (3) Reconciliation — periodically re-fetch authoritative state to
              correct drift. (4) Conflict resolution — when server state conflicts with optimistic state,
              apply resolution rules (last-write-wins, merge, or user prompt). (5) Version vectors — track
              causality to detect and resolve concurrent updates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is CQRS, and how does it apply to frontend architecture?</p>
            <p className="mt-2 text-sm">
              A: CQRS separates the write model (mutations/commands) from the read model (queries/views).
              In frontend: the write side dispatches actions/mutations to the server and produces events;
              the read side derives display state from events using selectors, computed values, and
              denormalized views optimized for rendering. Benefits include: independent optimization of
              read and write paths, simpler components (read-only views or mutation-only forms, not both),
              and the ability to materialize multiple views from the same events. React Query naturally
              implements CQRS — mutations and queries are separate operations with distinct caching.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://martinfowler.com/articles/201701-event-driven.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — What do you mean by &quot;Event-Driven&quot;?
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Introduction to Events
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/eaaDev/EventSourcing.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Event Sourcing
            </a>
          </li>
          <li>
            <a href="https://xstate.js.org/docs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              XState Documentation — State Machines and Statecharts
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
