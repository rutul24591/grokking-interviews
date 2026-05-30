"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-request-deduplication-system",
  title: "Design a Request Deduplication System",
  description: "LLD for sharing identical in-flight requests across components while preserving cancellation, subscribers, and cache consistency.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "request-deduplication-system",
  wordCount: 4200,
  readingTime: 24,
  lastUpdated: "2026-05-29",
  tags: ["lld", "frontend-networking", "implementation-design", "react", "resilience"],
  relatedTopics: ["data-fetching-hook", "frontend-caching-layer", "request-deduplication-system", "retry-mechanism", "token-refresh-system"],
};

export default function RequestDeduplicationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="space-y-5">
        <h2>Definition &amp; Context</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Design a Request Deduplication System is a low-level implementation problem, not a broad architecture prompt. The interviewer expects you to describe the runtime module, public API, internal state, data structures, lifecycle transitions, failure semantics, and test cases that make the feature safe inside a large React or TypeScript application.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The core primitive is the in-flight request registry. A principal-level answer should start from the user-visible behavior, then quickly move into the implementation contract: dedupe.fetch(key, factory, &#123; subscriberId, abortSignal &#125;). That contract must be stable enough for many components to depend on it, but small enough that teams cannot bypass the lifecycle rules accidentally.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The design boundary is the browser client. The server may provide HTTP, GraphQL, WebSocket, upload, or auth endpoints, but the article focuses on client orchestration: when to call, when to cancel, what to cache, how to avoid duplicate work, how to surface errors, and how to keep UI state consistent under slow networks and rapid user interaction.</p>
      </section>

      <section className="space-y-5">
        <h2>Core Concepts</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The first concept is a typed request or operation identity. Every operation needs a stable key so the runtime can deduplicate, cache, cancel, retry, batch, or invalidate it. For design a request deduplication system, the key should include the resource identity, security context, relevant parameters, and behavior-changing options. It should not include unstable values such as inline function identity or render-local object references.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The second concept is lifecycle state. This article uses these states as the baseline: empty, inFlight, shared, settled, cancelled, evicted. These states are deliberately more precise than a boolean loading flag. They let the UI distinguish initial load from background refresh, recoverable failure from terminal failure, stale data from absent data, and ignored stale work from committed work.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The third concept is a boundary between control-plane decisions and rendering. The control plane owns cancellation, timers, retry budgets, request sharing, storage, and telemetry. Rendering code should consume a compact view model and command callbacks. That separation is what keeps component trees from re-implementing inconsistent networking behavior.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The fourth concept is observability as part of the API. The runtime should emit operation key, attempt count, latency, status, retry reason, cancellation reason, cache source, stale age, and user-visible fallback. Without these signals, production failures look like random UI glitches instead of diagnosable lifecycle bugs.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The fifth concept is data-structure choice. Most networking LLD answers become credible when you name the actual structures: a Map for in-flight operations, a Map from resource key to subscriber set, a priority queue or timer wheel for delayed retries, an LRU list for memory cache, a tag-to-key index for invalidation, and an append-only operation journal for optimistic or resumable workflows. These structures are small enough to implement in an interview but powerful enough to explain scale behavior.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The sixth concept is authority. The client can decide rendering, caching, dedupe, retries, and local rollback, but it cannot decide authorization, final mutation success, or cross-device consistency alone. Every implementation should mark which state is speculative, which state is server-acknowledged, and which state is only a local projection used to keep the interface responsive.</p>
      </section>

      <section className="space-y-5">
        <h2>Architecture &amp; Flow</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A production implementation has five cooperating pieces: a public adapter, a lifecycle reducer, a registry or cache, a transport adapter, and an observer. The public adapter exposes dedupe.fetch(key, factory, &#123; subscriberId, abortSignal &#125;). The reducer owns transitions. The registry stores stable request key plus subscriber reference counts. The transport adapter talks to fetch, GraphQL, WebSocket, upload, or auth APIs. The observer emits metrics and debug events.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The normal flow starts when a component or command creates an operation. The runtime normalizes the key, checks local state, decides whether to serve cached data, dedupe with an existing operation, enqueue work, or issue a new transport call. When the transport resolves, the runtime validates that the response is still relevant, updates state, notifies subscribers, records metrics, and releases resources.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The hardest flow is the edge case: one subscriber unmounts while other subscribers still need the shared request. The design must make that behavior deterministic. A late response, duplicate event, expired token, stale cache entry, failed retry, partial batch result, or dropped socket frame should have an explicit transition rather than relying on whichever promise settles last.</p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/request-deduplication-system-runtime-flow.svg"
          alt="Design a Request Deduplication System runtime flow"
          caption="Runtime flow: public API, lifecycle reducer, registry, transport adapter, cache, observer, and UI view model cooperate to keep networking state deterministic."
        />
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The state reducer should be written as a small state machine, even if implemented with a switch statement or Zustand store. Events include start, cacheHit, cacheStale, transportStarted, transportSucceeded, transportFailed, retryScheduled, cancelled, superseded, invalidated, subscriberAdded, subscriberRemoved, and garbageCollected. Each event must define whether it changes visible data, metadata only, or no state at all.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A practical implementation also needs cleanup rules. When a subscriber unmounts, decrement the reference count. When the last subscriber leaves, either abort the transport or let it finish into cache depending on policy. Timers must be cleared on cancellation. Cache entries should have both freshness TTL and garbage-collection TTL. Journals should compact acknowledged operations. These details are what separate a usable LLD answer from a helper-function answer.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The testing flow mirrors the state machine. Unit tests drive reducer events directly. Integration tests mount two subscribers for the same key and verify sharing. Race tests resolve promises out of order. Timer tests advance fake clocks for debounce, retry, and stale TTL. Browser tests cover focus, blur, online/offline, visibility change, storage quota, and tab coordination where relevant.</p>
      </section>

      <section className="space-y-5">
        <h2>Trade offs &amp; Comparison</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Global dedupe saves bandwidth but can couple unrelated screens if cache keys are too broad.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The main consistency trade-off is whether the UI favors latest known data, latest requested data, or latest acknowledged data. Latest known data gives fast rendering but can be stale. Latest requested data prevents older responses from committing but can show loading more often. Latest acknowledged data is safest for financial, auth, and destructive workflows but creates more waiting states.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The main performance trade-off is centralization versus local control. A central runtime reduces duplicated requests, gives shared telemetry, and standardizes failure behavior. It can also become a bottleneck or an overly complex abstraction if every product case is pushed into it. The senior answer is to define extension points for request factory, key derivation, retry classifier, cache policy, and user message mapping without allowing components to bypass lifecycle safety.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The main cost trade-off is how aggressively the client talks to the backend. Deduplication, caching, debounce, batching, and WebSocket subscriptions can reduce request volume, but each one introduces correctness questions. In interviews, defend the policy with observable numbers: p95 latency, request rate per active user, retry amplification, stale-render duration, memory usage, and dropped-event count.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A principal-level comparison should also explain when not to build this abstraction. If the product only has a few simple reads, a mature library is better than a bespoke runtime. If the system has regulated payments, healthcare, or admin control planes, the runtime needs stricter commit guards and audit logs. If the system is collaborative, eventual consistency and merge policy matter more than raw request count.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The design should explicitly choose a consistency model. Most UI networking state is read-your-own-writes for the current tab, monotonic reads for a resource key, and eventual consistency across tabs or devices. Strong consistency is reserved for destructive actions, permissions, token state, and payment-like flows. Naming this model helps defend why stale-while-revalidate is acceptable in one surface and unacceptable in another.</p>
      </section>

      <section className="space-y-5">
        <h2>Best practices</h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">
          <li>Define a stable operation key and test it with reordered object properties, optional parameters, tenant changes, auth changes, and pagination cursors.</li>
          <li>Keep lifecycle transitions in a reducer or explicit state machine so cancellation, retry, stale response, and cleanup behavior can be tested without rendering React components.</li>
          <li>Use AbortController where the transport supports it, but still keep a monotonic request token because not every transport or browser path cancels before a response resolves.</li>
          <li>Separate retry classification from retry scheduling. Classification decides whether an error is retryable; scheduling decides when the next attempt is allowed under deadline and budget.</li>
          <li>Emit diagnostics for every suppressed or ignored operation. Silent stale-response drops are correct behavior, but they still need debug visibility.</li>
          <li>Treat auth, tenant, locale, feature flag, and privacy mode as key dimensions when they change returned data or access permissions.</li>
        </ul>
      </section>

      <section className="space-y-5">
        <h2>Common Pitfalls</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A common pitfall is treating design a request deduplication system as a small helper instead of a runtime. A helper usually handles the happy path. A runtime owns cancellation, cleanup, concurrency, memory limits, stale work, metrics, and user-visible recovery.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Another pitfall is conflating transport success with UI success. A 200 response can still be stale, unauthorized for the current tenant, partial, incompatible with the current schema, or obsolete because a newer operation already committed. The commit guard must validate response relevance before updating UI state.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A third pitfall is hiding failures behind generic retry or generic error UI. aborting one consumer must not abort the underlying request unless no subscribers remain. The user experience should make the correct state visible: stale data with a banner, retryable failure with a button, auth failure with re-login, conflict with resolution UI, or disabled action with a clear reason.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A fourth pitfall is failing to bound memory. A registry that never deletes settled operations, an LRU without byte accounting, a retry scheduler that keeps dead timers, or a WebSocket subscription map that keeps handlers after unmount will eventually create production-only failures. The cleanup story should be part of the design, not an implementation afterthought.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A fifth pitfall is making policy impossible to override. Product teams need different policies for admin tools, search inputs, checkout, collaboration, and analytics dashboards. The runtime should expose controlled extension points while keeping the invariants non-negotiable: no stale commit, no auth-scope leak, no unbounded retry, and no silent rollback.</p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/request-deduplication-system-failure-model.svg"
          alt="Design a Request Deduplication System failure and recovery model"
          caption="Failure model: stale work, retry limits, cache invalidation, auth boundaries, and observer signals decide whether the UI commits, degrades, retries, or rolls back."
        />
      </section>

      <section className="space-y-5">
        <h2>Real-world use cases</h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Design a Request Deduplication System appears in product surfaces where users move faster than networks: search boxes, dashboards, admin tools, checkout flows, upload forms, collaboration views, and authenticated SaaS consoles. In these surfaces, one bad race condition can show stale data, double-submit a mutation, hide a failure, or leak information across tenants.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">For staff/principal interviews, anchor the use case in a concrete screen. Example: a settings page loads current settings, the user changes a value, a mutation starts, cached views update optimistically, another tab invalidates the same resource, and the network returns a delayed response. Your answer should describe which event wins, what the user sees, what is persisted, and which metric would prove the runtime behaved correctly.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The production readiness bar includes rollback and abuse handling. Rollback means the UI can revert optimistic or stale state without erasing newer user intent. Abuse handling means the runtime limits request amplification caused by rapid typing, tab storms, retries during outages, reconnect loops, and repeated token refresh failures.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Another real-world use case is incident response. During an outage, this runtime should help operators answer whether the client is retrying too aggressively, whether users are seeing stale state, whether requests are being deduped, whether token refresh is stuck, and which user actions are degraded. That requires event names, counters, and sampled traces designed into the module from the beginning.</p>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">A third use case is migration. Teams often move from hand-written fetch calls to a shared networking runtime gradually. The module should support adapter wrappers so older callers can use the same dedupe, retry, and error handling policy without a full rewrite. Good LLD answers mention migration because principal engineers are judged on adoption paths, not only greenfield design.</p>
      </section>

      <section className="space-y-5">
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you implement the core module end to end?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">I would define the public API first: dedupe.fetch(key, factory, &#123; subscriberId, abortSignal &#125;). Then I would implement a pure reducer for empty, inFlight, shared, settled, cancelled, evicted. The adapter would normalize keys, read the registry, decide whether to reuse, cache, enqueue, or start transport work, and expose a view model with data, status, error, stale age, retry state, and command callbacks.</p>
        <h3>How do you prevent stale or duplicate work from corrupting the UI?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">I would use stable operation keys plus a monotonic sequence token. AbortController reduces wasted work, but the token decides whether a response can commit. If a newer operation has started, the older one resolves into an ignored event that updates telemetry but not visible state. For shared in-flight operations, subscriber reference counts decide cleanup without cancelling work still needed by another component.</p>
        <h3>What breaks at scale?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">Request amplification breaks first: retries, duplicate mounts, rapid typing, reconnect loops, and cache invalidation storms can multiply backend traffic. Memory breaks next if caches, timers, event listeners, and operation journals are never collected. Debuggability breaks if ignored responses and retry decisions are not observable.</p>
        <h3>How do you handle failure and rollback?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The reducer needs explicit failed, stale, retrying, rolledBack, and degraded states. Rollback should use inverse patches or scoped snapshots instead of resetting an entire cache. User-visible state should distinguish retryable network failure, authorization failure, validation failure, conflict, and stale data. Every rollback or suppressed commit should emit a trace event with operation key and reason.</p>
        <h3>How do you defend your trade-offs?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">I would defend them with invariants: no stale response can commit after a newer operation, no non-idempotent mutation retries without an idempotency key, no cache entry crosses auth or tenant boundaries, and no retry loop can exceed budget. Then I would show metrics that prove those invariants in production: duplicate suppression count, stale commit suppression count, retry amplification, cache hit rate, p95 stale age, and rollback success rate.</p>
        <h3>What would you ask the interviewer before coding?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">I would ask which operations are reads versus mutations, which ones are idempotent, whether data is tenant- or permission-scoped, what latency target matters, whether stale data is acceptable, how many components may subscribe to the same resource, and what the expected offline or reconnect behavior is. These questions determine cache policy, retry policy, and commit strictness.</p>
        <h3>What does the example implementation need to prove?</h3>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">The examples should prove the non-happy paths: duplicate subscribers share work, stale responses are ignored, retry budgets are enforced, rollback does not erase newer state, cache keys include security scope, and telemetry records the reason for every degraded outcome. A one-line example is not enough for this category because the design is mostly about lifecycle behavior under pressure.</p>
      </section>

      <section className="space-y-4">
        <h2>References</h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">
          <li><a href="https://react.dev/reference/react" target="_blank" rel="noreferrer">React docs: Hooks and effects</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN: AbortController</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noreferrer">MDN: Fetch API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN: WebSocket API</a></li>
          <li><a href="https://spec.graphql.org/" target="_blank" rel="noreferrer">GraphQL specification</a></li>
          <li><a href="https://www.rfc-editor.org/rfc/rfc9110" target="_blank" rel="noreferrer">HTTP Semantics RFC 9110</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
