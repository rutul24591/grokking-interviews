"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-global-event-bus",
  title: "Global Event Bus System",
  description:
    "Pub/sub event bus for decoupled component communication with event filtering, priority handling, and async event processing.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "global-event-bus",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "event-bus", "pub-sub", "communication", "decoupling"],
  relatedTopics: ["fine-grained-subscription-system", "cross-tab-state-sync"],
};

export default function GlobalEventBusArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          In large React applications, components that have no direct parent-child relationship regularly need to communicate. A notification bell in the header needs to know when a background API call returns new alerts. A floating toast manager needs to display messages triggered from deeply nested form submissions. A WebSocket handler needs to broadcast incoming server events to whatever components are currently mounted and interested. Prop drilling (passing callbacks through 5–8 levels of component hierarchy) is unmaintainable. Lifting state up to a common ancestor works but pollutes shared state with transient, ephemeral communication data that doesn't belong there.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The global event bus provides a decoupled publish-subscribe channel. Publishers emit events without knowing who is listening. Subscribers register interest in specific event types without knowing who publishes them. The bus mediates between them, maintaining a registry of active subscriptions and routing events to matching subscribers. This is the front-end equivalent of a message queue — fire-and-forget messaging between loosely coupled components.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The pattern has real failure modes at scale. Without careful lifecycle management, component subscriptions leak after unmount, causing stale handlers to receive events. Without type safety, event names become magic strings that diverge silently between publishers and subscribers. Without backpressure, high-frequency events overwhelm synchronous handlers. Without circular-event detection, events that trigger other events can create infinite dispatch loops that freeze the browser.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Communication is unidirectional (fire-and-forget, not request-response). Event types and payloads are defined at application design time, not dynamically discovered at runtime. The bus is in-process (same JavaScript execution context, not cross-tab). Real-time throughput is bounded — the bus is not a substitute for stream processing infrastructure.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Publish:</strong> Any component or service can emit an event by type with a typed payload. The caller does not block waiting for subscribers to finish.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Subscribe:</strong> Components register handlers for specific event types. The handler receives the typed payload. Multiple handlers can subscribe to the same event type.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Unsubscribe:</strong> Handlers can be deregistered individually. Returns an unsubscribe function from subscribe() to enable easy cleanup.
          </HighlightBlock>
          <li>
            <strong>Event Filtering:</strong> Subscribers can filter within an event type using a predicate — receive only CartItemAdded events where item.category === 'electronics'.
          </li>
          <li>
            <strong>Priority Ordering:</strong> Subscribers can declare a priority level — higher-priority handlers run before lower-priority handlers for the same event.
          </li>
          <li>
            <strong>Async Handler Support:</strong> Handlers can return Promises. The bus can optionally await all handlers before resolving the publish call, enabling sequenced processing.
          </li>
          <li>
            <strong>Error Isolation:</strong> A thrown error in one subscriber must not prevent other subscribers from receiving the event.
          </li>
          <li>
            <strong>Event History / Replay:</strong> Optional buffering of recent events so late subscribers can receive the last N events for a type on subscribe (useful for initialization).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Latency:</strong> Synchronous event dispatch must complete in under 1ms per subscriber for simple handlers.
          </HighlightBlock>
          <li>
            <strong>Throughput:</strong> The bus must handle 10,000+ events per second without becoming a bottleneck in high-frequency scenarios (WebSocket message streams, animation tick events).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Memory:</strong> Subscription registry uses O(n) memory where n is active subscription count. No unbounded growth — cleanup on unsubscribe is O(1) with indexed storage.
          </HighlightBlock>
          <li>
            <strong>Type Safety:</strong> TypeScript generics enforce that subscribers for a given event type receive the correct payload type — no runtime casting.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Component subscribes in useEffect, unmounts before calling cleanup — handler receives events for unmounted component (React state update warnings, potential crashes).</li>
          <li>Circular dispatch: event handler A emits event B, event B's handler emits event A — infinite loop.</li>
          <li>Subscribe during event dispatch — should the new subscriber receive the currently dispatching event? (Typically: no — iteration snapshot taken at dispatch start.)</li>
          <li>Unsubscribe during event dispatch — handler list may change mid-iteration.</li>
          <li>Same handler reference subscribed twice to the same event type — should deduplicate or call twice?</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The bus maintains a Map from event type string to an ordered array of subscription records. Each record holds the handler function, an optional predicate filter, a priority value, and a unique subscription ID.</HighlightBlock>
<HighlightBlock as="p" tier="important">On publish, the bus looks up the subscription array for the event type, takes a snapshot of it (to handle subscribe/unsubscribe during dispatch safely), sorts by priority if mixed priorities are present, and invokes each handler that passes its predicate filter, wrapped in a try-catch.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The TypeScript interface uses a generic event map pattern — an interface mapping event type strings to payload types. All publish and subscribe calls are parameterized with a key of this map, giving compile-time safety. The bus implementation is a singleton module exported as a single instance, or injected through React Context for testability.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/global-event-bus.svg"
          alt="Global event bus architecture with publishers, event bus core API, subscribers, typed event catalog, pitfalls, and React integration pattern"
          caption="Global event bus architecture with publishers, event bus core API, subscribers, typed event catalog, pitfalls, and React integration pattern"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Core Registry Implementation</h3>
        <p>
          The subscription registry uses a Map where keys are event type strings and values are arrays of subscription objects sorted by priority (descending — highest first). Each subscription object contains: a unique ID (auto-incrementing integer or nanoid), the handler function reference, an optional filter predicate, and the registered priority (default: 0).
        </p>
        <p>
          Subscribe inserts into the array in priority order (binary search for insertion point). Unsubscribe finds the subscription by ID and removes it. Both operations are O(n) in the worst case on the per-type array; for most applications with fewer than 50 subscribers per event type, this is negligible. For pathological cases (hundreds of subscribers on a single event type), an indexed approach (Map by subscriptionId) can make unsubscribe O(1).
        </p>
        <p>
          Dispatch iterates a snapshot: const snapshot = [...subscriptions]; snapshot.forEach(). This protects against mutations to the live array during iteration. After the snapshot is taken, subscribe and unsubscribe calls operate on the original array without affecting the current dispatch iteration.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Type-Safe Event Map Pattern</h3>
        <p>
          Define a central EventMap interface that enumerates all event types and their corresponding payload types. The bus is typed as EventBus extends EventMap. The publish and subscribe methods use keyof EventMap as the event type parameter, and EventMap[K] as the payload type. This ensures that publishing a CartItemAdded event with the wrong payload shape is a compile-time error, not a runtime surprise.
        </p>
        <p>
          All event type strings are co-located in a const enum or string literal union, eliminating magic string typos. A common convention is to namespace event types by domain: 'auth:login', 'auth:logout', 'cart:item-added', 'notification:received'. This makes the event catalog scannable and reduces collision risk when different teams own different event domains.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">React Integration via useEventBus Hook</h3>
        <p>
          A custom hook encapsulates the subscribe/unsubscribe lifecycle contract. The hook accepts an event type and a handler callback. In a useEffect, it calls bus.subscribe and stores the returned unsubscribe function in the effect's cleanup. When the component unmounts or the event type/handler changes, the cleanup fires and the subscription is removed.
        </p>
        <p>
          The handler must be wrapped in useCallback or stabilized via useRef to prevent the useEffect from re-running on every render due to a new function reference. A common pattern: the hook accepts a handler wrapped in useRef internally, so the useEffect dependency is stable while the handler reference itself can change freely.
        </p>
        <p>
          For publishing, a useBusPublish hook or a simple bus.publish import works — publishing is stateless and does not need cleanup. However, in tests, the bus should be injectable via context so that test code can use a local instance without polluting the global bus singleton.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Async Event Handling and Backpressure</h3>
        <HighlightBlock as="p" tier="important">
          Synchronous dispatch is straightforward but insufficient when handlers perform async work (fetching data on event receipt, writing to IndexedDB, logging to analytics). Two dispatch modes address this: fire-and-forget (default) where async handlers are started but not awaited, and await-all where publish returns a Promise that resolves after all async handlers complete.
        </HighlightBlock>
        <p>
          Fire-and-forget is appropriate for independent side effects (analytics tracking, cache invalidation). Await-all is appropriate when the publisher needs to know all subscribers have processed the event before continuing (e.g., a save-all event before navigation, where all form components need to flush their local state).
        </p>
        <HighlightBlock as="p" tier="important">
          Backpressure is a real concern for high-frequency events. A WebSocket that receives 1000 messages per second should not invoke synchronous handlers 1000 times per second if those handlers trigger React state updates. Implement event batching: accumulate events within a requestAnimationFrame and deliver them in bulk once per animation frame. React 18's automatic batching helps when the handlers call setState, but the accumulation before delivery still needs explicit implementation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Circular Event Detection</h3>
        <HighlightBlock as="p" tier="important">
          Circular events occur when handler A emits event B and handler B emits event A, creating an infinite dispatch loop. Detect this by tracking a dispatch depth counter. Each publish call increments a depth counter; each completion decrements it. If depth exceeds a threshold (typically 10–20), throw an error or log a warning and abort. The thrown error includes a stack trace of the event chain, identifying exactly which publish calls are circularly referencing each other.
        </HighlightBlock>
        <p>
          An alternative is to track the in-flight event set: each publish adds the event type to a set; completion removes it. If a handler attempts to publish an event type already in the set, that's a direct cycle — throw immediately with a clear message.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event History and Late Subscription Replay</h3>
        <p>
          Some use cases require that a component mounting after an event was published still receives the most recent event of that type. Example: a modal that opens after a 'feature-flag-loaded' event needs the flag values, but the event was published before the modal mounted. Replay-on-subscribe solves this: the bus optionally buffers the last N events per type; new subscribers immediately receive the buffered events on subscription.
        </p>
        <p>
          Configuration: some event types should replay on subscribe (initialization events, configuration loaded, feature flags), while others should not (user click events, one-time notifications). Mark replay-eligible event types in the EventMap definition. The buffer size should be small (typically 1 — only the most recent event) to avoid unexpected state initialization from stale events.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Domain-Scoped Buses vs Single Global Bus</h3>
        <p>
          A single global bus is the simplest architecture but can become a coordination problem on large teams where multiple feature teams publish and subscribe to the same bus. An alternative is domain-scoped buses: the auth domain uses an auth bus, the cart domain uses a cart bus. Cross-domain events require a deliberate bridge (a service that subscribes to one bus and publishes to another), making inter-domain dependencies explicit and auditable.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The trade-off: single bus has lower boilerplate and simpler testing setup. Domain-scoped buses provide better isolation and enable different teams to independently replace or refactor their event contracts. For applications with more than 5–6 distinct domains or more than 30 event types, domain-scoped buses scale better architecturally.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Observability</h3>
        <HighlightBlock as="p" tier="important">
          Instrument the bus in development mode: log each publish with event type, payload (redacted for sensitive fields), subscriber count, and dispatch duration. In production, emit sampled metrics: event frequency by type per minute, average handler count per dispatch, error rate by event type, and maximum dispatch duration (to detect slow handlers).
        </HighlightBlock>
        <p>
          A development DevTools panel showing a live event stream with timestamps and payloads dramatically reduces debugging time for event-driven state bugs. This can be built as a browser extension or as an in-app panel toggled by a keyboard shortcut, similar to Redux DevTools.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Decoupling vs Traceability</h3>
        <HighlightBlock as="p" tier="crucial">
          The event bus's core value proposition (decoupled communication) is also its primary debugging liability. When a component behaves unexpectedly, tracing which publisher sent the triggering event requires either comprehensive logging or tooling like a DevTools panel. Direct function calls are trivially traceable by call stack; event dispatch is not. Accept this trade-off consciously and invest in tooling before it becomes a debugging burden.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Bus vs Global State</h3>
        <HighlightBlock as="p" tier="important">
          An event bus is appropriate for transient, ephemeral communications — notifications that need to be displayed once, events that trigger side effects but don't persist to the application state. For state that components need to read at any time (not just when a change happens), a global store (Zustand, Redux) is more appropriate. Using an event bus to communicate state changes that should be in the store leads to race conditions where a subscriber misses an event because it wasn't mounted at the time of publishing.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Library vs Custom Implementation</h3>
        <HighlightBlock as="p" tier="important">
          Libraries like Mitt (200 bytes) provide the core subscribe/publish/unsubscribe API with TypeScript support. They handle the iteration snapshot pattern and unsubscribe-during-dispatch correctly. Building a custom bus is reasonable for teams that need non-standard features (priority queues, async await-all, replay) but adds maintenance burden. Start with Mitt, wrap it with the custom features your application needs, rather than building from scratch.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">For staff-level engineers, the architectural judgment calls are: use a bus for ephemeral events, not persistent state; invest in DevTools instrumentation before the event catalog grows;</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">consider domain-scoped buses at scale; and be explicit about which event types support replay, as unbounded replay buffers create subtle initialization bugs. In production-grade systems like Figma's plugin system or VS Code's extension host, event buses are first-class infrastructure with typed contracts, versioning, and deprecation policies — not an informal string-dispatch mechanism.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
