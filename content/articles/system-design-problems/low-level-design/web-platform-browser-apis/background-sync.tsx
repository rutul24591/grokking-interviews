"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-background-sync",
  title: "Design a Background Sync System",
  description: "Implementation-heavy low-level design for design a background sync system, covering browser capability checks, state machines, fallbacks, security, performance, and observability.",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "background-sync",
  wordCount: 4700,
  readingTime: 28,
  lastUpdated: "2026-05-29",
  tags: ["lld", "browser-apis", "web-platform", "frontend-architecture", "principal-engineer"],
  relatedTopics: ["offline-first-architecture", "performance", "permissions-ux"],
};

export default function BackgroundSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Background Sync System</h1>
        <h2>Definition &amp; Context</h2>
        <p>
          Design a Background Sync System is a low-level design problem about wrapping a powerful but inconsistent browser capability in a production-safe service worker backed retry coordinator. Browser APIs are not normal libraries: availability differs by browser, permissions can change at runtime, callbacks may fire on the main thread, and user activation, privacy, storage, and lifecycle rules can invalidate a happy-path implementation.
        </p>
        <p>
          The implementation contract starts with enqueueSyncJob(job), registerSyncTag(tag), flushQueue(reason), acknowledge(jobId), quarantine(jobId). The runtime should model these states explicitly: unsupported, registered, queued, flushing, retrying, blocked, drained. The invariant is: Failed user intent must survive page close and replay without duplicate server side effects. The hard case is when a service worker update happens while a queued mutation has been sent but not acknowledged. A principal-ready answer should explain the API facade, capability detection, fallback behavior, lifecycle cleanup, privacy and security constraints, and the telemetry that proves the abstraction works in the field.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/background-sync-runtime.svg"
          alt="Design a Background Sync System runtime model"
          caption="Runtime model: browser capability checks, permission and lifecycle gates, guarded execution, fallback path, and observability are owned by the abstraction."
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The first concept is feature detection with a policy decision. The runtime should not only check whether an API exists. It should decide whether the API is allowed for this user journey, browser, security context, permission state, and product risk. For example, an API may exist but require HTTPS, transient user activation, foreground tab state, same-origin constraints, or a browser-specific fallback.
        </p>
        <p>
          The second concept is a small state machine around the browser boundary. Directly calling browser APIs from components spreads permission prompts, unsupported states, cleanup, and errors across the app. A runtime with explicit states can reject unsafe calls, produce consistent UI states, and shield product code from browser-specific exception shapes.
        </p>
        <p>
          The third concept is lifecycle ownership. Browser API handles often outlive a render: observers must disconnect, workers must terminate, file references must be released, permission watches must stop, callbacks must be batched, and hidden tabs may throttle timers. The durable structures are IndexedDB queue, service worker tag registry, idempotency key, retry ledger, health probe, quarantine bucket. These structures give the implementation enough evidence to clean up safely and debug incidents.
        </p>
        <h3>Implementation contract</h3>
        <p>
          Public methods should return typed outcomes such as accepted, unsupported, permission-denied, queued, cancelled, throttled, or fallback-used. Components should not infer these outcomes from thrown DOM exceptions. The runtime should also expose a snapshot with capability state, active work, last error, and recovery action so the UI can render coherent affordances.
        </p>
        <p>
          Every browser-facing operation should define input validation, output normalization, cancellation semantics, and cleanup requirements. Sensitive operations need data minimization and audit events. Expensive operations need budgets and backpressure. User-gesture operations need a short-lived activation window and a fallback path when the activation is lost.
        </p>
        <h3>Operation classes</h3>
        <p>
          Browser work should be classified before implementation. User-activation operations, long-running computation, observer callbacks, permission prompts, file intake, and background work have different safety rules. A copy action may need a foreground click, a worker job may need transferable ownership, an observer may need frame batching, and a location request may need a purpose-specific explanation. Grouping operations this way prevents a single generic wrapper from hiding important browser constraints.
        </p>
        <p>
          Each operation class should define retry behavior, cancellation, privacy limits, and UI fallback. Some operations are safe to retry, some are not; some can run in the background, while others must pause when the document is hidden. Principal-level design means naming those classes and refusing unsafe execution when the browser context no longer matches the operation contract.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has five layers. The component facade accepts product intent. The capability layer checks API support, secure context, permissions, user activation, and document lifecycle. The execution engine calls the browser API through adapters. The fallback layer provides an alternate path when the capability is missing or unsafe. The observer layer records metrics and exposes state changes to UI subscribers.
        </p>
        <p>
          A normal flow starts with a product component calling the facade. The facade validates the request and attaches an operation id. The capability layer returns allowed, denied, unsupported, or deferred. If allowed, the execution engine invokes the browser adapter with cancellation and timeout guards. If denied or unsupported, the fallback layer returns a user-safe alternative rather than throwing a raw browser error into the UI.
        </p>
        <p>
          Cleanup is part of the flow, not a separate afterthought. On unmount, navigation, tab hide, permission change, abort, or worker termination, the runtime should cancel active operations, release resources, and emit a final snapshot. The cleanup path must be idempotent because React remounts, route transitions, service worker updates, and browser lifecycle events can call it more than once.
        </p>
        <h3>Data model and invariants</h3>
        <p>
          A practical data model includes operation id, capability snapshot, permission state, caller scope, lifecycle state, active handles, timeout deadline, fallback reason, and telemetry fields. Invariants should be enforced before the browser call: no privileged action without the required user activation, no observer callback that mutates layout recursively without batching, no worker result accepted after cancellation, and no sensitive payload logged.
        </p>
        <p>
          The runtime should separate browser adapters from policy. Adapters know how to call Clipboard, Geolocation, Worker, Observer, Visibility, Drag and Drop, or Background Sync APIs. Policy decides whether a call is safe, what fallback to use, what to show the user, and what to record. That split makes tests deterministic and lets product policy evolve without rewriting browser integration code.
        </p>
        <h3>Failure matrix</h3>
        <p>
          The design should include a failure matrix from browser cause to product response. Unsupported API routes to fallback. Permission denied routes to explanation and manual alternatives. Expired user activation routes to a fresh user action. Hidden document routes to pause or defer. Large payload routes to worker or chunking. Observer loop risk routes to batching and layout guards. This matrix makes the implementation inspectable and keeps feature teams from inventing inconsistent behavior.
        </p>
        <p>
          Browser lifecycle transitions should be modeled as first-class events. Visibility change, page freeze, navigation, bfcache restore, service worker update, worker termination, and permission revocation can all invalidate active handles. The runtime should move to a typed state, cancel or resume work safely, and emit a snapshot that lets the UI explain what happened.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/background-sync-failure.svg"
          alt="Design a Background Sync System failure and fallback model"
          caption="Failure model: unsupported APIs, permission denial, lifecycle changes, and expensive callbacks are routed through explicit fallbacks and telemetry."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Calling browser APIs directly is fast to ship and works for prototypes. It becomes fragile when multiple screens need consistent permission prompts, fallbacks, cleanup, security handling, and observability. A centralized runtime adds indirection, but it turns browser unpredictability into a stable application contract.
        </p>
        <p>
          The main trade-off is control versus native behavior. Native APIs provide capabilities that JavaScript cannot reproduce efficiently, but they come with browser rules that can change or vary. A custom fallback is more predictable, but may be less capable or less performant. A principal-ready design uses native capability when it is safe and valuable, and falls back only for the degraded core journey.
        </p>
        <p>
          Performance trade-offs depend on the API. Observers and visibility can reduce work, but callback storms can create layout thrash. Workers can improve responsiveness, but serialization and transfer overhead can dominate small jobs. Clipboard and permission APIs improve UX when used with user intent, but aggressive prompting harms trust. Background sync improves reliability, but requires idempotency and durable state.
        </p>
        <p>
          Security and privacy are first-class trade-offs. Clipboard, location, file drops, push-like background actions, and worker payloads can expose sensitive data or create abuse paths. The design should minimize payloads, sanitize inputs, respect permissions, avoid logging secrets, and fail closed when the browser cannot prove the user or document state required by the operation.
        </p>
        <p>
          There is also a portability trade-off. A browser-native path may be excellent in Chromium and limited or absent elsewhere. The design should isolate adapters, ship capability metrics, and support feature-flagged rollout. That lets the team use advanced APIs where they are reliable without breaking the baseline journey for users on constrained browsers or enterprise-managed devices.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Always wrap browser APIs with capability detection, typed errors, and cleanup. Treat browser support as a runtime condition, not a build-time assumption. Check secure context, permissions, document visibility, user activation, and lifecycle state close to the call site because those values can change between render and execution.
        </p>
        <p>
          Batch and budget callbacks. Observer APIs, visibility changes, drag events, worker progress, and sync status messages can fire frequently. Use requestAnimationFrame, microtask batching, or priority queues to avoid re-render storms. Track the cost of callbacks and expose slow-path metrics so the abstraction does not become a hidden performance problem.
        </p>
        <p>
          Provide accessible, honest fallbacks. A disabled button, manual copy field, file input fallback, approximate location mode, read-only state, or visible retry queue should correspond to a real runtime state. The user should understand whether the issue is unsupported browser, denied permission, background throttling, failed validation, or temporary unavailability.
        </p>
        <p>
          Test with browser API adapters rather than real global APIs in most unit tests. Use integration tests for permission denial, unsupported APIs, hidden tab behavior, worker cancellation, observer disconnect, large file drops, and activation expiry. Deterministic adapters make edge cases repeatable instead of timing-dependent.
        </p>
        <p>
          Add operational guardrails. Cap active observers, worker jobs, queued background tasks, pasted payload size, drag-drop file count, and location watcher lifetime. Release resources on route change and expose counts in debug snapshots. These limits are part of the low-level design because browser APIs can exhaust memory, drain battery, or degrade input latency when left unbounded.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is assuming support means safe use. A method can exist but still fail because the page is not secure, the tab is hidden, the user activation expired, the permission was denied, the payload is too large, or the browser throttled the callback. The runtime must treat these as normal states.
        </p>
        <p>
          Another pitfall is leaking resources. Observers left connected, workers left running, file object URLs not revoked, geolocation watchers not cleared, and queues not compacted all create slow production failures. Cleanup should be idempotent and connected to component scope, route scope, and document lifecycle.
        </p>
        <p>
          Teams also under-observe browser API failures. Browser-specific issues are hard to reproduce without telemetry. Capture capability state, permission outcome, fallback reason, operation duration, cancellation, and sanitized error class. Avoid capturing payloads, clipboard text, location coordinates, or file names unless the privacy policy explicitly permits it and the data is necessary.
        </p>
        <p>
          A subtle pitfall is mixing rendering state with browser handle state. A component can re-render many times while the underlying observer, worker, permission watch, or drag session should remain stable. Conversely, a route transition can invalidate a handle even if React state still exists. The runtime should own handles explicitly and expose derived UI state rather than letting components hold raw browser objects.
        </p>
        <p>
          Finally, avoid assuming the fallback is only for old browsers. Fallbacks also handle enterprise policies, denied permissions, embedded webviews, privacy modes, hidden tabs, quota pressure, and temporary platform regressions. If the fallback path is not tested and observable, it will fail exactly for the users who need it most.
        </p>
        <p>
          A production-ready implementation should make these fallback transitions as visible in design review as the happy path.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Browser API runtimes appear in productivity suites, internal admin tools, design editors, field-service apps, analytics dashboards, media uploaders, real-time collaboration products, and offline-capable PWAs. These products need capabilities that are close to the device and browser lifecycle, but they also need predictable behavior across teams and browsers.
        </p>
        <p>
          At staff and principal level, the browser API layer is often platform-owned. Feature teams declare intent and policy, while the platform runtime owns capability checks, adapters, cleanup, fallbacks, accessibility, privacy review, and metrics. This prevents every feature from rediscovering browser edge cases in production.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you design this system end to end?</h3>
        <p>
          I would design a facade around the browser API, a capability and permission gate, a state machine, browser adapters, fallback renderers, and telemetry. The facade accepts product intent and returns typed outcomes. The gate checks secure context, support, permission, activation, and lifecycle. The adapter executes the browser call with cancellation and timeout guards. The fallback path keeps the core task usable when the native path is unavailable.
        </p>
        <h3>Why this architecture over direct browser calls?</h3>
        <p>
          Direct calls duplicate edge handling across components and make behavior inconsistent. A runtime centralizes invariants: Failed user intent must survive page close and replay without duplicate server side effects. It also makes permissions, fallbacks, cleanup, and metrics testable. The cost is an abstraction layer, but the benefit is predictable behavior across browsers and product surfaces.
        </p>
        <h3>What breaks at scale?</h3>
        <p>
          At scale, browser differences, permission churn, callback storms, memory leaks, hidden-tab throttling, serialization cost, and unsupported fallback paths become the main failures. The design needs adapter tests, capability metrics, bounded queues, idempotent cleanup, callback batching, privacy-safe logging, and rollout flags to disable unsafe paths.
        </p>
        <h3>What consistency model applies?</h3>
        <p>
          The consistency model is usually local and lifecycle-bound. The browser can confirm that an operation was requested or accepted by the API, but the application may still need server authority, user permission, or visible fallback state. The runtime should expose whether state is confirmed, pending, approximate, stale, cancelled, or fallback-derived instead of presenting every result as equally authoritative.
        </p>
        <h3>How do you handle failure, rollback, abuse, privacy, cost, and observability?</h3>
        <p>
          Failure becomes typed runtime state. Rollback means cancelling handles, ignoring late results, revoking previews, or returning to fallback UI. Abuse is controlled through user activation, permission checks, payload limits, rate limits, and feature flags. Privacy is protected through data minimization and sanitized telemetry. Cost is managed through batching, cancellation, worker thresholds, and cleanup. Observability records capability, permission outcome, fallback reason, duration, and resource counts.
        </p>
        <h3>How would you defend the trade-offs under interviewer pressure?</h3>
        <p>
          I would explain that browser APIs are powerful but non-deterministic across environments, so the abstraction optimizes for correctness and user trust. If challenged on complexity, I would scope the runtime to shared invariants and keep product policy injectable. If challenged on performance, I would show batching, budgets, and cancellation. Then I would walk through a service worker update happens while a queued mutation has been sent but not acknowledged and explain the exact state transitions.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API" target="_blank" rel="noreferrer">MDN reference for the primary browser API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API" target="_blank" rel="noreferrer">MDN Permissions API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API" target="_blank" rel="noreferrer">MDN Page Visibility API</a></li>
          <li><a href="https://web.dev/articles/rendering-performance" target="_blank" rel="noreferrer">web.dev Rendering Performance</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
