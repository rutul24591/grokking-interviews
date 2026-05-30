"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-global-event-bus",
  title: "Design a Global Event Bus",
  description: "Implementation-heavy low-level design guide for design a global event bus, covering APIs, state transitions, edge cases, failure handling, and interview trade-offs.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "global-event-bus",
  wordCount: 4600,
  readingTime: 22,
  lastUpdated: "2026-05-29",
  tags: ["lld", "state-modeling", "frontend-architecture", "principal-engineer"],
  relatedTopics: ["state-management", "race-condition-handling", "observability"],
};

export default function GlobalEventBusArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Global Event Bus</h1>
        <h2>Definition &amp; Context</h2>
        <p>
          Design a Global Event Bus is a low-level design problem about building a reusable typed event bus that product teams can depend on under real user behavior, not just the happy path. In a staff or principal interview, the answer should move past naming a pattern and describe the runtime contract: public API, internal state shape, transition rules, ownership boundaries, observability, and what the component refuses to do when correctness is uncertain.
        </p>
        <p>
          The design target is an implementation that can live inside a complex web application with concurrent user actions, remounts, retries, background work, and multiple teams integrating it. The core API is publish(event), subscribe(type, handler, options), unsubscribe(token), drainDeadLetters(). The core state model is subscribed, publishing, queued, replaying, disposed. The most important interview signal is explaining why those states exist, which transitions are legal, and how the design behaves when One subscriber throws while other subscribers must still receive the event exactly once.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/global-event-bus-state-runtime.svg"
          alt="Design a Global Event Bus runtime state model"
          caption="Runtime model: public API calls are normalized into guarded state transitions, side effects are isolated, and observers receive stable snapshots."
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Start with a narrow ownership boundary. The typed event bus owns transition validity, deduplication of unsafe work, disposal, and telemetry. UI components should not manually coordinate the same rules with scattered booleans. A component may ask for a transition, but the runtime decides whether the event is accepted, ignored, coalesced, retried, or rejected with a typed reason.
        </p>
        <p>
          The internal model should be explicit rather than inferred from incidental fields. For this topic the durable structures are topic registry, priority queue, replay buffer, dead-letter queue, subscriber token, telemetry hook. These structures let the implementation answer hard questions: which operation is current, which subscribers are still alive, whether a replay is deterministic, whether a persisted snapshot belongs to the current user, or whether a conflict needs to be surfaced instead of hidden.
        </p>
        <p>
          The implementation should separate pure state transitions from effects. Reducer-like logic calculates the next snapshot and an effect description. A runner performs I/O, timers, persistence, or subscriber callbacks after the state commit. This makes race handling testable, prevents side effects from firing during speculative transitions, and gives the design a place to add cancellation, rollback, and debug instrumentation.
        </p>
        <h3>Implementation contract</h3>
        <p>
          The contract for Design a Global Event Bus should be written as if another team will build a complex feature on top of it without reading the internals. The runtime must define what identity means, what a version represents, which events are idempotent, which methods are safe after disposal, and whether callers can observe intermediate states. Ambiguity in this contract usually becomes a production incident: duplicate notifications, stale UI, lost rollback information, or a memory leak that only appears after navigation loops.
        </p>
        <p>
          A strong implementation also defines its negative behavior. If an event is not legal in the current state, the runtime should reject it with a typed reason and telemetry, not silently drop it. If data is stale, the snapshot should make that visible. If the caller passes an invalid owner, scope, or version, the runtime should fail closed. These details are what distinguish a principal-level LLD answer from a pattern summary.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The production design has five layers. The API facade accepts domain-specific calls and validates input. The event normalizer converts those calls into a small event vocabulary. The transition engine checks legal state movement and computes the next snapshot. The effect runner performs work outside the reducer, using cancellation tokens and idempotency keys where needed. The observer layer publishes stable snapshots, metrics, and debug events without leaking internal mutable data.
        </p>
        <p>
          A typical flow starts with a caller invoking the primary API method. The facade attaches operation identity, current version, and caller scope. The transition engine moves from the current state into the next legal state, records why the transition happened, and returns an effect plan. Only after the state commit does the runtime invoke effects. Settlement events must include the original operation identity so stale completions, duplicate messages, or late callbacks can be ignored safely.
        </p>
        <p>
          The design should expose snapshots rather than internal mutable objects. A snapshot contains status, data needed by the UI, last error, version, and debug metadata. For React-style consumers, subscriptions should be scoped by selector and cleaned up by a disposer. For non-UI consumers, the same runtime can expose an event stream, but event stream delivery must not be the source of truth.
        </p>
        <h3>Data model and invariants</h3>
        <p>
          The data model should include a stable resource key, operation id, monotonic version, owner or scope, status, last committed payload, optional pending payload, error envelope, and trace metadata. Invariants should be asserted at the boundary: there can be only one active operation for a single latest-intent key, terminal states cannot still own live abort handles, disposed subscribers cannot be notified, and rollback data must be captured before the forward effect runs.
        </p>
        <p>
          For shared state, the runtime should never expose mutable references. It should return frozen or copied snapshots and keep internal indices private. That protects the consistency model from accidental mutation and lets the implementation change from arrays to maps, path indexes, ring buffers, or compacted logs without breaking callers. This is also the point where a principal candidate can discuss memory limits and compaction policies, because state runtimes often fail by retaining old closures and history forever.
        </p>
        <h3>Lifecycle and concurrency</h3>
        <p>
          Lifecycle events need the same rigor as user events. Mount subscribes, unmount disposes, focus may resume work, blur may pause non-critical work, reconnect may replay queued events, and navigation may invalidate a scope. Concurrency should be handled through identity and version checks rather than timing assumptions. If two operations race, the one with the accepted identity wins; the late one becomes a stale settlement with telemetry.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/global-event-bus-failure-debugging.svg"
          alt="Design a Global Event Bus failure and debugging model"
          caption="Failure model: unsafe transitions are blocked early, effect failures become typed settlement events, and debug logs preserve enough context to defend behavior."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          A simple component-local implementation is cheaper for one screen, but it pushes correctness into every caller. That approach usually fails when several components share the same resource, when work outlives a component, or when a late event arrives after the user has changed intent. A centralized runtime adds indirection, but it gives the organization one place to enforce ordered delivery per topic with at-least-once local dispatch and explicit dead-letter handling.
        </p>
        <p>
          A fully generic framework can reduce boilerplate, but it can also hide domain rules behind opaque configuration. For principal-level design, prefer a small domain runtime with explicit events and typed state. It should be generic only where the invariants are actually shared: transition execution, disposal, listener notification, snapshot versioning, and telemetry. Domain-specific policies, such as conflict resolution or retry rules, should remain injectable and testable.
        </p>
        <p>
          The main trade-off is between strictness and flexibility. Strict state machines prevent invalid combinations and make incidents easier to debug. Loose object state is easier to evolve but allows impossible states, such as success with an active cancellation token or replaying while live side effects are enabled. At staff and principal levels, the stronger answer is to make illegal states unrepresentable, then add escape hatches only with explicit audit logs.
        </p>
        <p>
          There is also a trade-off between eager and lazy work. Eager computation makes snapshots simple and predictable, but it can waste CPU when many updates are superseded. Lazy computation reduces work, but it requires invalidation bookkeeping and can move latency to the reader. The correct answer depends on user-visible latency and update frequency. A principal-ready design names that choice and explains how metrics would prove it in production.
        </p>
        <p>
          Another trade-off is whether to fail open or fail closed. For low-risk cosmetic state, dropping a stale event may be acceptable. For authorization, payment, collaboration, or persisted user data, fail closed with a visible error or conflict. This is where the implementation connects to privacy and abuse concerns: a stale persisted snapshot must not leak another tenant, a replay tool must not repeat destructive effects, and a cross-context message must not be trusted without version and origin checks.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Design the state shape before implementing handlers. Write down legal transitions, terminal states, and whether each transition is synchronous, asynchronous, retryable, or reversible. Every public method should either commit a transition, return a typed rejection, or be a no-op with an observable reason. Silent failure makes interview designs look simple while making production systems impossible to diagnose.
        </p>
        <p>
          Keep effect execution idempotent where possible. Attach operation IDs, resource versions, tab IDs, or command IDs to work that may settle later. Use cancellation for work that can be stopped, and settlement guards for work that cannot be stopped. Those two mechanisms solve different problems: cancellation reduces waste, while settlement guards preserve correctness.
        </p>
        <p>
          Build observability into the runtime. Track transition counts, rejected events, stale settlements, queue depth, retry count, listener count, and average notification time. These are not cosmetic metrics. They tell you whether the abstraction is protecting the application or becoming a hidden bottleneck.
        </p>
        <p>
          Keep tests at the transition level, not only at the component level. Unit tests should cover invalid transitions, stale settlement, disposal, retry exhaustion, rollback, and listener exceptions. Integration tests should verify that the UI sees stable snapshots during rapid user actions. Property-style tests are useful when a runtime has many event permutations because they can reveal impossible states that hand-written examples miss.
        </p>
        <p>
          Prefer small adapters around browser or framework APIs. Timers, storage, network, BroadcastChannel, and random IDs should be injectable so replay, testing, and server rendering remain deterministic. This also improves operability because incidents can be reproduced with recorded events instead of relying on a user to recreate timing-sensitive behavior.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is modeling this problem as disconnected boolean flags. Booleans allow contradictory states and make edge cases dependent on update ordering. A principal-ready design names states and transitions directly, then validates the transition before committing any state or effect.
        </p>
        <p>
          Another pitfall is treating cleanup as a UI concern. Components unmount, tabs close, effects resolve late, subscribers throw, persisted data becomes stale, and debug tools replay old events. Cleanup and settlement rules belong inside the runtime because callers cannot reliably coordinate them from the outside.
        </p>
        <p>
          The third pitfall is ignoring handler exception, recursive publish loop, subscriber leak after unmount, unbounded replay buffer until after the implementation is shipped. These failures must be represented in state and telemetry from the beginning. If the runtime cannot explain what happened after a bad transition, it is not ready for production or a principal-level interview answer.
        </p>
        <p>
          A subtle pitfall is allowing observers to become part of the commit path. If one listener throws, is slow, or triggers a nested update, it can corrupt the experience for every other subscriber. The runtime should isolate listener failures, cap nested dispatch depth, batch notifications where appropriate, and record slow subscribers without letting them mutate internal state.
        </p>
        <p>
          Another pitfall is adding persistence before defining ownership. Persisted state must be scoped by user, tenant, app version, and sometimes feature flag. Without that scope, rehydration can resurrect stale privileges, replay an old workflow after logout, or show data from a previous account. The implementation should include schema versioning and a quarantine path for invalid snapshots.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          This design appears in collaborative editors, dashboards, multi-step workflows, offline-capable applications, design tools, and internal admin consoles. These products need predictable user-visible state even when the network is slow, multiple browser contexts are active, or debugging tools replay previous behavior.
        </p>
        <p>
          In a large application, this runtime is usually owned as a platform primitive. Feature teams provide domain policies and UI rendering, while the primitive guarantees transition safety, cleanup, versioning, and instrumentation. That split lets product teams move quickly without re-solving the same correctness issues in every component.
        </p>
        <p>
          In enterprise software, this design also supports auditability. Admin consoles, workflow builders, editors, and support tools need to explain why the interface moved from one state to another. A transition log with operation identity and rejection reasons gives support engineers and developers enough evidence to debug without exposing private payloads in logs.
        </p>
        <p>
          In consumer products, the same ideas protect perceived performance. Users click quickly, navigate away, return from background tabs, and lose connectivity. A state runtime that treats those cases as normal input, rather than exceptional behavior, keeps the interface responsive while preserving correctness under pressure.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you design the implementation end to end?</h3>
        <p>
          I would define the public facade first, then map each method to a small event vocabulary. The runtime would keep topic registry, priority queue, replay buffer, dead-letter queue, subscriber token, telemetry hook and expose read-only snapshots. The transition engine would validate legal movement across subscribed, publishing, queued, replaying, disposed and return effect descriptions. Effects would run after commit with operation identity, cancellation, and settlement guards. Observers would receive selector-scoped snapshots so UI rendering stays predictable.
        </p>
        <h3>Why choose this architecture over local component state?</h3>
        <p>
          Local state is acceptable for isolated screens, but it spreads race handling, cleanup, and failure semantics across callers. This architecture centralizes invariants and makes ordered delivery per topic with at-least-once local dispatch and explicit dead-letter handling. enforceable. The cost is more design upfront, but the benefit is consistent behavior across screens and easier incident debugging.
        </p>
        <h3>What breaks at scale?</h3>
        <p>
          At scale, listener count, stale events, memory retention, and ambiguous ownership become the bottlenecks. The runtime needs bounded queues, explicit disposal, compaction where history is stored, backpressure for notification storms, and metrics that reveal rejected transitions or slow subscribers before users notice.
        </p>
        <h3>How do you handle rollback and failure?</h3>
        <p>
          Rollback depends on whether the transition is reversible. Pure state transitions can store inverse patches or previous snapshots. External effects require compensating actions or explicit non-reversible barriers. Failures become typed settlement events, not thrown surprises, so the system can move to an error, blocked, conflicted, or ready state with a visible reason.
        </p>
        <h3>How would you defend the trade-offs under interviewer pressure?</h3>
        <p>
          I would state that the design optimizes for correctness, debuggability, and reuse across high-value flows. If the interviewer pushes on complexity, I would narrow the runtime to the invariants that must be shared and keep feature policy outside the core. If they push on latency, I would explain batching, selector subscriptions, and lazy recomputation. If they push on edge cases, I would walk through One subscriber throws while other subscribers must still receive the event exactly once.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://react.dev/reference/react" target="_blank" rel="noreferrer">React documentation: component state, effects, and transitions</a></li>
          <li><a href="https://redux.js.org/style-guide/" target="_blank" rel="noreferrer">Redux Style Guide: state modeling and reducer principles</a></li>
          <li><a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noreferrer">Zustand documentation: store subscriptions and selectors</a></li>
          <li><a href="https://immerjs.github.io/immer/update-patterns/" target="_blank" rel="noreferrer">Immer documentation: immutable update and patch patterns</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" target="_blank" rel="noreferrer">MDN BroadcastChannel API</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
