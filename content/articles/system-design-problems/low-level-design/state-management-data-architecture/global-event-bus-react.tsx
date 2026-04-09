"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-global-event-bus",
  title: "Design a Global Event Bus in React",
  description:
    "Production-grade event bus for cross-component communication — typed events, namespace isolation, rate limiting, dead letter handling, and subscription lifecycle.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "global-event-bus-react",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "event-bus", "pub-sub", "typed-events", "rate-limiting", "cross-component"],
  relatedTopics: ["scalable-global-state-architecture", "cross-tab-state-synchronization"],
};

export default function GlobalEventBusReactArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Components across an application need to communicate without direct
          coupling — a notification system needs to show alerts triggered by
          any component, a analytics tracker needs to record events from
          unrelated features, and a logging system needs to capture errors
          from all modules. Direct component coupling (props, context) doesn&apos;t
          scale for cross-cutting concerns. We need a typed event bus that
          enables loose coupling between event producers and consumers, with
          namespace isolation, rate limiting, and subscription lifecycle
          management.
        </p>
        <p><strong>Assumptions:</strong> React 19+, 50+ event types, 200+ subscribers across the application.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Typed Events:</strong> Event names mapped to payload schemas via TypeScript. Emitting wrong payload type is a compile error.</li>
          <li><strong>Namespace Isolation:</strong> Events grouped by domain (user:*, dashboard:*, analytics:*). Subscribers can wildcard-subscribe (user:* receives all user events).</li>
          <li><strong>Rate Limiting:</strong> Per-event-type rate limit (max 50/second). Excess events coalesced or dropped.</li>
          <li><strong>Dead Letter Queue:</strong> Failed event handlers retry up to 3 times, then move to dead letter queue for inspection.</li>
          <li><strong>Subscription Lifecycle:</strong> Subscribe returns cleanup function. Auto-unsubscribe on component unmount.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Emit Cost:</strong> Event emit is O(k) where k is subscribers for that event type, not O(n) total subscribers.</li>
          <li><strong>Memory:</strong> Orphaned subscriptions cleaned up — no memory leaks from unmounted components.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The event bus is a typed event emitter with namespace support. Events
          are strings with colon-separated domains (user:created, dashboard:refresh).
          Subscribers register handlers for specific events or wildcards (user:*).
          On emit, the bus finds matching handlers (exact match + wildcard matches),
          validates the payload against the event schema, and calls handlers
          asynchronously (Promise.resolve().then). Rate limiting prevents event
          storms. Dead letter queue handles persistent failures.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Typed Event Emitter (<code>lib/typed-event-bus.ts</code>)</h4>
          <p>Generic event bus with TypeScript event map. on(event, handler), off(event, handler), emit(event, payload). Type-checked at compile time.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Namespace Router (<code>lib/namespace-router.ts</code>)</h4>
          <p>Routes events to namespace-specific handler groups. Wildcard subscriptions (user:*) subscribe to all events in that namespace.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Rate Limiter (<code>lib/event-rate-limiter.ts</code>)</h4>
          <p>Token bucket per event type. 50 tokens, refill 50/sec. Excess events coalesced (keep latest payload) or dropped.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Dead Letter Queue (<code>lib/dead-letter-queue.ts</code>)</h4>
          <p>Failed handler attempts retried 3x with exponential backoff. After 3 failures, event moved to DLQ for inspection.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Schema Validator (<code>lib/event-schema-validator.ts</code>)</h4>
          <p>Zod schemas per event type. Validate payload before delivery. Reject invalid payloads with descriptive error.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration Hook (<code>hooks/useEventBus.ts</code>)</h4>
          <p>useEventBus(event, handler) — subscribes on mount, unsubscribes on unmount. Returns emit function for the event.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/global-event-bus-react-architecture.svg"
          alt="Event bus architecture showing typed emitter, namespace router, rate limiter, and dead letter queue"
          caption="Global Event Bus Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>Emit → rate limiter check → schema validation → find handlers (exact + wildcard) → async delivery → error handling → DLQ on persistent failure.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Handler throws:</strong> Caught, logged, retry with backoff. After 3 failures, move to DLQ. Other handlers for same event continue — one failure doesn&apos;t block others.</li>
          <li><strong>Wildcard + exact subscription:</strong> Component subscribes to user:* and user:created separately. Both handlers fire for user:created events — no deduplication (intentional — different handlers for different purposes).</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: typed event bus, namespace router, rate limiter, dead letter queue, schema validator, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Emit to k subscribers</td><td className="p-2">O(k) — async delivery</td></tr>
              <tr><td className="p-2">Rate limit check</td><td className="p-2">O(1) — token bucket</td></tr>
              <tr><td className="p-2">Schema validation</td><td className="p-2">O(p) — p payload fields</td></tr>
              <tr><td className="p-2">Wildcard match</td><td className="p-2">O(w) — w wildcard subscriptions</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Schema validation prevents malicious payloads. Rate limiting prevents event flooding. Test: emit delivers to exact + wildcard subscribers, rate limiter coalesces excess, DLQ captures persistent failures, schema validation rejects invalid payloads.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No type safety:</strong> Event names and payloads are strings/any. Wrong payload crashes handler at runtime. Fix: TypeScript event map with Zod validation.</li>
          <li><strong>No cleanup:</strong> Subscriptions not cleaned up on unmount — memory leak and stale handler calls. Fix: return cleanup function, use in useEffect.</li>
          <li><strong>Synchronous delivery:</strong> Handlers called synchronously — handler throwing blocks other handlers. Fix: async delivery via Promise.resolve().then().</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist events for replay (e.g., when a component mounts late and needs historical events)?</p>
            <p className="mt-2 text-sm">
              A: Add an event log (bounded array, max 1000 entries) that records
              every emitted event with timestamp. Late-mounting components can
              request replay of events from their mount time forward. Implement
              a replay(fromTimestamp) method that iterates the log and re-emits
              matching events. Use ring buffer for the log to bound memory usage.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle event ordering when events arrive out of order from different sources?</p>
            <p className="mt-2 text-sm">
              A: Use Lamport timestamps or vector clocks to establish causal ordering.
              Each event gets a timestamp from the emitting source. The event bus
              buffers events briefly (50ms window), sorts by timestamp, then delivers
              in order. For events from the same source with inverted order, detect
              the anomaly and either reject the late event or deliver it with a
              &quot;out-of-order&quot; flag for the handler to decide how to process.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement priority-based event delivery?</p>
            <p className="mt-2 text-sm">
              A: Add a priority field to events (critical, high, normal, low). The
              event bus maintains separate queues per priority. Critical events bypass
              rate limiting and are delivered immediately. High priority events are
              delivered before normal/low. Normal events are batched and delivered
              at 60fps. Low events are coalesced — only the latest is delivered per
              batch cycle. This ensures critical events (auth failure, data loss)
              are never delayed by event storms.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you debug which component emitted a problematic event?</p>
            <p className="mt-2 text-sm">
              A: In development, capture the call stack when emit is called and
              attach it to the event metadata. When an event causes an error, the
              error handler can log the full event chain: who emitted it, who
              handled it, and what the payload was. Additionally, implement an
              event auditor that logs all events with timestamps, emitter info,
              and handler execution times. This creates an audit trail for
              debugging complex event flows.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle cross-origin event communication (e.g., iframe to parent)?</p>
            <p className="mt-2 text-sm">
              A: Use window.postMessage for cross-origin communication. The event
              bus wraps postMessage: emit serializes the event and calls
              parentWindow.postMessage(eventData, targetOrigin). The receiving
              window listens for message events, validates the origin, deserializes
              the event, and routes it through the local event bus. Add schema
              validation on receipt to ensure cross-origin events conform to
              expected types.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://github.com/developit/mitt" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Mitt — Tiny Event Emitter</a></li>
          <li><a href="https://www.patterns.dev/vanilla/pub-sub-pattern/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Patterns.dev — Pub/Sub Pattern</a></li>
          <li><a href="https://zod.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Zod — Schema Validation</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Dead_letter_queue" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Wikipedia — Dead Letter Queue</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
