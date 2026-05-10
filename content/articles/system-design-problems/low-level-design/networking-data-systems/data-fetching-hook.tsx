"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-data-fetching-hook",
  title: "Design a Data Fetching Hook",
  description:
    "Production-grade data fetching abstraction for React with loading states, error handling, dependency tracking, request lifecycle management, and cancellation support.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "data-fetching-hook",
  wordCount: 6900,
  readingTime: 41,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "data-fetching",
    "react-hooks",
    "async-data",
    "loading-states",
    "error-handling",
  ],
  relatedTopics: [
    "frontend-caching-layer",
    "request-deduplication-system",
    "token-refresh-system",
    "global-api-error-handling",
  ],
};

export default function DataFetchingHookArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Every React component needs to fetch data from APIs (users, posts, comments). Without abstraction, components repeat boilerplate: useState for data/loading/error, useEffect for fetching, cleanup for cancellation. At scale, this repetition is error-prone and inconsistent. Consider a real scenario: component A fetches user data. While request in-flight, user navigates away, component unmounts. Request completes, tries to setState on unmounted component—warning printed, memory leak. Another component B fetches same user data simultaneously—two identical requests sent, wasting bandwidth.
        </p>
        <p>
          The solution is a custom data-fetching hook abstracting this complexity. The hook should: (1) accept a fetch function and dependencies (like useEffect), (2) manage loading, error, and data states internally, (3) handle request cancellation on unmount, (4) deduplicate identical concurrent requests (two components fetching same data = one request), (5) integrate with cache (avoid re-fetching if data cached), (6) retry failed requests with exponential backoff, (7) refetch on mutation (when user creates post, posts list refetches).
        </p>
        <p>
          Naive approach: each component has its own useEffect + useState + AbortController. Works for simple cases, but doesn't scale. Better: reusable hook encapsulating best practices (cancellation, retries, caching, deduplication). At 1M users with 1000s of components fetching data, centralized hook approach is critical for performance and correctness.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> React 19+ with hooks. TypeScript for type safety. Fetch API or axios available. Cache layer (React Query, custom Map) available. AbortController for cancellation. Exponential backoff for retries. Multiple components may fetch same resource simultaneously.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>API Abstraction:</strong> Hook accepts a fetch function and
            dependencies, returns {`{data, loading, error, refetch}`}.
          </li>
          <li>
            <strong>Loading States:</strong> Distinguish between initial load and
            refetch (loading vs isRefetching) so UI can show stale data + spinner.
          </li>
          <li>
            <strong>Error Handling:</strong> Capture errors, categorize (network,
            timeout, 4xx, 5xx), expose raw response and parsed error.
          </li>
          <li>
            <strong>Retry Logic:</strong> Automatic retry on transient failures
            (network, 5xx) with exponential backoff and max retries.
          </li>
          <li>
            <strong>Dependency Tracking:</strong> Hook re-runs fetch when dependencies
            change (like useEffect).
          </li>
          <li>
            <strong>Request Deduplication:</strong> If multiple components fetch the
            same resource, share a single in-flight request.
          </li>
          <li>
            <strong>Cancellation:</strong> Abort fetch when component unmounts or
            dependencies change mid-flight.
          </li>
          <li>
            <strong>Manual Refetch:</strong> Expose refetch() function to trigger
            fetch on-demand.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Hook does not cause unnecessary renders.
            State updates batched. Dependencies compared efficiently.
          </li>
          <li>
            <strong>Memory:</strong> In-flight requests tracked and cancelled on
            unmount. No memory leaks from timers or closures.
          </li>
          <li>
            <strong>Composability:</strong> Hook works with Suspense, error
            boundaries, and state management libraries.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Fetch completes after component unmounts — state update prevented via
            cleanup.
          </li>
          <li>
            Multiple rapid refetch() calls — throttle to a single in-flight request.
          </li>
          <li>
            Dependency changes mid-flight — cancel in-flight, start new fetch with
            new deps.
          </li>
          <li>Retry exhausted after max attempts — surface error, expose retry button.</li>
          <li>
            Network disconnected during fetch — fail fast or timeout vs waiting
            indefinitely.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The hook wraps a fetch function and manages its lifecycle. It tracks
          loading state (idle, loading, refetching), data, errors, and retry
          attempts. On mount or dependency change, the hook initiates a fetch. A
          global request cache deduplicates identical in-flight requests. The hook
          returns state and a refetch callback. On unmount, an AbortController
          cancels in-flight requests. Errors trigger automatic retries with
          exponential backoff for transient failures.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Hook Interface</h3>
        <p>
          The hook signature follows React conventions and provides an intuitive
          API for consuming components.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          Internal state tracks the current fetch lifecycle. Multiple state pieces
          distinguish between initial load and refetch so UI can show stale data
          during background refreshes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>data:</strong> The fetched data. Persists across refetches so
            stale data displays immediately.
          </li>
          <li>
            <strong>loading:</strong> True during initial fetch only. False during
            refetch.
          </li>
          <li>
            <strong>isRefetching:</strong> True during background refetch. Can be
            true while loading is false if data is cached.
          </li>
          <li>
            <strong>error:</strong> Error object. Cleared when refetch succeeds.
            Persists during refetch so user sees the last error.
          </li>
          <li>
            <strong>status:</strong> Enumeration (idle, loading, error, success,
            refetching) for fine-grained control.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Request Deduplication</h3>
        <p>
          A global request cache stores in-flight requests by a cache key derived
          from the fetch function and dependencies. When multiple components call
          the hook with identical parameters, they share a single fetch.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Cache Key Generation:</strong> Serialize dependencies into a
            stable cache key. Use JSON.stringify or a hash function.
          </li>
          <li>
            <strong>Request Sharing:</strong> Store a Promise for in-flight fetches.
            Multiple hook instances await the same Promise.
          </li>
          <li>
            <strong>Cache Invalidation:</strong> Invalidate the cached request when
            it completes or errors, or when manually triggered.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Error Classification</h3>
        <p>
          Errors are categorized to determine retry strategy. Network errors and 5xx
          responses are retryable. 4xx errors are permanent and do not retry.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Network Error:</strong> fetch() throws (no internet, DNS failure).
            Retry.
          </li>
          <li>
            <strong>Timeout:</strong> Fetch does not complete within timeout window.
            Retry.
          </li>
          <li>
            <strong>5xx Error:</strong> Server error. Retry with backoff.
          </li>
          <li>
            <strong>4xx Error:</strong> Client error (bad request, not found). Do not
            retry.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Retry Strategy</h3>
        <p>
          Retries use exponential backoff with jitter to avoid thundering herd. Max
          retries capped at a reasonable number (typically 3-5).
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Exponential Backoff:</strong> Delay = 2^attemptNumber * baseDelay
            (e.g., 100ms, 200ms, 400ms, 800ms).
          </li>
          <li>
            <strong>Jitter:</strong> Add random jitter (±50%) to avoid synchronized
            retries.
          </li>
          <li>
            <strong>Max Retries:</strong> Typically 3-5. Configurable per hook call.
          </li>
          <li>
            <strong>Abort Condition:</strong> Stop retrying if component unmounts or
            dependencies change.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cancellation</h3>
        <p>
          AbortController cancels in-flight requests when the component unmounts or
          dependencies change. The fetch abort is idempotent — canceling an already
          completed fetch is a no-op.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration with Cache</h3>
        <p>
          The hook integrates with a frontend caching layer. Before initiating a
          fetch, the hook checks the cache. If data is fresh, it returns cached data
          without network requests. If stale, it returns stale data and refetches in
          background. Cache invalidation is exposed to components so mutations can
          trigger refetches.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Dependency Stability</h3>
        <p>
          React dependency arrays are compared by reference. If the dependency array
          changes on every render, the hook refetches on every render. Consumers
          must memoize dependencies or use useCallback to stabilize them.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Stable Dependencies:</strong> Primitive values, arrays/objects
            created outside render.
          </li>
          <li>
            <strong>Unstable Dependencies:</strong> Inline objects/arrays created
            during render.
          </li>
          <li>
            <strong>useMemo/useCallback:</strong> Memoize dependencies to prevent
            unnecessary refetches.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Suspense Integration</h3>
        <p>
          The hook can work with React Suspense by throwing a Promise while data
          loads. This allows parent components to catch the Promise and render a
          fallback.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Throw Promise:</strong> Throw in-flight fetch Promise so Suspense
            catches it.
          </li>
          <li>
            <strong>Fallback UI:</strong> Suspense boundary renders fallback until
            Promise resolves.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Type Safety</h3>
        <p>
          Use TypeScript generics to ensure type safety. The hook is generic over
          the data type and error type.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Timeout Handling</h3>
        <p>
          Wrap the fetch in a timeout using AbortController or a timer. If fetch
          does not complete within timeout, abort and treat as timeout error.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stale-While-Revalidate</h3>
        <p>
          Support stale-while-revalidate pattern: if cached data is available
          (even if stale), return it immediately and refetch in background. User
          sees stale data first, then updated data when fetch completes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">DevTools Integration</h3>
        <p>
          Optionally integrate with React DevTools to inspect hook state, request
          history, and retry attempts.
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Observability & Distributed Tracing</h3>
        <p>
          Instrument the hook to emit OpenTelemetry spans. Track request duration,
          retry attempts, cache hits/misses. Correlate with server traces via trace IDs.
          This visibility is critical for diagnosing performance issues in production
          across 100+ concurrent users. Expose metrics to monitoring dashboards (Datadog,
          Prometheus). Alert on high retry rates (indicates backend issues) or high
          latency (network problems).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Bulkhead Isolation & Resource Limits</h3>
        <p>
          Limit concurrent in-flight requests per priority/endpoint to prevent cascading
          failures. If one endpoint degraded (slow), don't starve other endpoints. Use
          request pools with separate limits: high-priority (auth, critical data) gets
          more slots. Low-priority (analytics, preloading) gets throttled. Prevents one
          slow endpoint from blocking critical user flows.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Retry Backoff Based on System State</h3>
        <p>
          Monitor network quality (round-trip time) and backend health (error rates).
          Adjust retry backoff dynamically: stable network → shorter backoff, slow
          network → longer backoff. If backend returning 5xx errors, increase backoff
          exponentially to give it recovery time. This is more sophisticated than
          fixed exponential backoff.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Profiling & Leak Prevention</h3>
        <p>
          Use Chrome DevTools to profile memory usage. Watch for growing memory over
          time (indicates leaks). Common leaks: timers not cleared on unmount,
          subscriptions not unsubscribed, closures holding references. Use WeakMap for
          caches to allow garbage collection of unused entries. Test with long-running
          sessions (hours) to detect slow leaks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Global Error Boundary</h3>
        <p>
          Data fetching errors can propagate to Error Boundary. Decide: some errors
          caught locally (render retry UI), others propagate to boundary (unrecoverable
          errors). Coordinate error handling: if fetch error is expected and handled,
          don't rethrow. If unexpected, throw to boundary. Log all errors to error
          tracking service (Sentry) with context (component, request, user).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Coherency in Multi-Tab Scenarios</h3>
        <p>
          When user opens app in multiple tabs, each tab has separate cache. If one tab
          mutates data, other tabs have stale cache. Sync via localStorage events or
          BroadcastChannel API. On mutation, emit event. Other tabs invalidate cache
          and refetch. Critical for consistency on multi-tab workflows.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Prefetching & Predictive Loading</h3>
        <p>
          Implement prefetching for likely next navigations. Analyze user behavior:
          if user views list page, likely to view detail pages. Prefetch detail data
          in background. On navigation, data likely cached. Feels instant. Requires
          careful bandwidth management to not overwhelm on slow networks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Strategies for Async Fetching</h3>
        <p>
          Mock fetch with MSW (Mock Service Worker) for deterministic tests. Test race
          conditions: rapid dependency changes, unmount mid-flight, timeout scenarios.
          Use act() to wrap state updates. Test error paths extensively (network errors,
          timeouts, 5xx, 4xx). Use jest.useFakeTimers() for timeout tests. Property-based
          testing (fast-check) helps find edge cases in retry/backoff logic.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Library Comparison Matrix</h3>
        <p>
          <strong>React Query (TanStack Query):</strong> Production battle-tested,
          built-in caching, deduplication, background refetching. Best choice for most
          apps. Learning curve moderate.
        </p>
        <p>
          <strong>SWR:</strong> Simpler, lighter-weight. Good for lightweight apps.
          Less flexible for complex scenarios.
        </p>
        <p>
          <strong>Custom Hook:</strong> Max control, zero dependencies. Best for
          simple, unique requirements. Risk: missing edge cases production libraries
          handle.
        </p>
        <p>
          <strong>Recommendation:</strong> Use React Query for most apps. Use SWR for
          lightweight projects. Build custom only if requirements are truly unique or
          for educational purposes.
        </p>
      </section>

      <section>
        <h2>Scale Considerations (1M+ Concurrent Users)</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Coalescing at Scale</h3>
        <p>
          At 1M concurrent users, if 1000 users fetch same data simultaneously,
          deduplication prevents 1000 requests → 1 request. This is the difference
          between backend overload and stability. Deduplication is non-negotiable at
          scale. Implement in global request cache, not hook.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backpressure Handling</h3>
        <p>
          If requests queue faster than network can send, queue grows unbounded →
          memory bloat. Implement backpressure: when queue reaches size threshold,
          drop low-priority requests or reject new requests. User sees "Service
          overloaded" message instead of app crashing from memory exhaustion.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side Rate Limiting</h3>
        <p>
          Client limits requests/second per endpoint to not overwhelm backend. If
          frontend sends 10k requests/sec, backend can't handle. Client-side limiting
          protects both client (memory) and backend (load). Implement token bucket
          algorithm per endpoint/priority.
        </p>
      </section>

      <section>
        <h2>Real-World Lessons & Pitfalls</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">The Stale Closure Bug</h3>
        <p>
          Closure in useEffect can capture stale state. Common: fetch uses stale
          dependency, response arrives out of order. Solution: use useCallback to
          wrap fetch function, ensure dependencies correct. Use ESLint
          rules (eslint-plugin-react-hooks) to catch these automatically.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Unmount-While-Fetching Race</h3>
        <p>
          Component unmounts while fetch in-flight. Response arrives, component tries
          to update state → React warning. Solution: use AbortController, clean up
          properly in useEffect return. React 18+ useTransition handles this better
          in some cases.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Infinite Refetch Loops</h3>
        <p>
          Misconfigured dependency array causes refetch on every render. Component
          renders → dependency change (new object reference) → refetch → state update
          → render → dependency change → infinite loop. Solution: memoize dependencies,
          use useCallback, lint rules.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mixing Loading States</h3>
        <p>
          Confusing initial load vs refetch. Show spinner on initial load, but show
          stale data + subtle loader on refetch. Users expect instant UI update even
          if background refetch slow. Separate loading and isRefetching states.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Invalidation Complexity</h3>
        <p>
          As mutation landscape grows, deciding what to invalidate becomes complex.
          Mutation creates post → invalidate posts list AND user profile AND
          notifications. Automated tag-based invalidation helps but still error-prone.
          Consider event-driven cache invalidation: server pushes invalidation events
          to clients.
        </p>
      </section>

      <section>
        <h2>Integration with Other Systems</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">With State Management (Zustand, Redux)</h3>
        <p>
          Hook coordinates with store: fetch result → store update → component rerender.
          Decide: where lives truth? In hook state or store? Recommend: fetch in hook,
          store in component/parent. Avoid duplication of state across hook and store.
          Use Zustand + React Query together for clean separation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">With Suspense (React 18+)</h3>
        <p>
          Throw Promise from hook to trigger Suspense. Allows parent boundary to
          catch and show fallback. Powerful for SSR and streaming. But adds complexity.
          Recommend: use cautiously, understand interaction with error boundaries.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">With Server State Sync</h3>
        <p>
          If backend pushes updates via WebSocket/SSE, hook must merge server updates
          with local cache. Conflict resolution: last-write-wins, merge, or user
          choice. Requires version tracking.
        </p>
      </section>

      <section>
        <h2>Incident Response & Debugging</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">High Retry Rate Incident</h3>
        <p>
          If monitoring shows 50% of requests retrying, backend likely degraded. Check
          error logs, backend metrics, availability. Automatic retry helps but signals
          problem to investigate. Don't ignore high retry rates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Leak Detection</h3>
        <p>
          If memory grows unbounded over hours, profile with DevTools. Look for growing
          cache size, timers not cleared, subscriptions not cleaned. Add test that
          mounts/unmounts component 1000x and checks memory. Catch regressions in CI.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debugging Race Conditions</h3>
        <p>
          Intermittent failures suggest races. Reproduce with React.StrictMode (double
          unmounts, double effects). Use console logs with timestamps. Use DevTools to
          step through execution. Property-based testing helps find races
          systematically.
        </p>
      </section>

      <section>
        <h2>Hook Lifecycle and State Machine</h2>

        <p>
          A production data fetching hook implements a finite state machine controlling transitions between states. The state machine ensures consistent behavior and prevents invalid transitions. Key states: idle (no fetch initiated), loading (initial fetch in-flight), refetching (background refresh with cached data), success (data available), error (fetch failed).
        </p>

        <p>
          Transitions are triggered by: (1) component mount or dependency change → loading, (2) fetch completes successfully → success, (3) fetch fails → error, (4) refetch triggered while data exists → refetching, (5) component unmount → cleanup and abort, (6) manual refetch call → resume fetching.
        </p>

        <p>
          State machine ensures: from loading, only success or error possible. From success, can transition to refetching. From error, can attempt refetch. Prevents invalid sequences like jumping from loading directly to refetching without success/error. This clarity is crucial for debugging and testing state transitions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/data-fetching-hook-lifecycle.svg"
          alt="Data fetching hook state machine and lifecycle diagram"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Lifecycle Phases</h3>
        <p>
          Understanding the complete request lifecycle helps diagnose issues. Phase 1: Initialization. Hook mounts, dependencies evaluated. Phase 2: Cache Check. Before fetch, check if data cached. If fresh, return cached. If stale, refetch. Phase 3: Request Setup. Create AbortController, set timeout, construct request headers (auth tokens, trace IDs). Phase 4: Network Request. Fetch initiated. Network activity tracked. Phase 5: Response Processing. Response received, parse body, validate schema. Phase 6: State Update. Update hook state with data/error. Phase 7: Downstream Effects. Components re-render, effects triggered, dependent fetches may initiate. Phase 8: Cleanup. On unmount or new fetch, abort previous request, clear timers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Concurrency Control Patterns</h3>
        <p>
          As complexity grows, managing concurrent requests becomes critical. Pattern 1: Sequential. Fetch A completes → initiate fetch B. Guarantees order but slower. Pattern 2: Parallel. Fetch A and B simultaneously. Faster but order not guaranteed. Pattern 3: Race. Fetch A and B, use result from first to complete. Useful for redundancy (multiple mirrors). Pattern 4: Debounce. Rapid dependency changes → skip earlier fetches, only fetch latest. Pattern 5: Throttle. At most one fetch per N milliseconds. Pattern 6: Request coalescing with Promises. Multiple hook instances → single in-flight Promise shared.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Categorization Taxonomy</h3>
        <p>
          Not all errors are created equal. Classification: Network Errors (DNS failure, no connection, connection reset). Categorized as transient, retryable. Timeout Errors (request exceeds timeout window). Usually transient, retryable. Server Errors (5xx status). Indicate server issue, usually transient, retryable. Client Errors (4xx status). Indicate invalid request, non-retryable (except 429 rate limit). Parsing Errors (response body not valid JSON). Non-retryable, indicates API version mismatch or data corruption. Abort Errors (fetch aborted by code). Expected during cleanup, no retry. Categorize each error to determine appropriate recovery strategy.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backoff Strategies Deep Dive</h3>
        <p>
          Exponential backoff (2^n * base) is standard but has variations. Linear backoff: delay = n * base (100ms, 200ms, 300ms). Predictable but slower recovery. Exponential backoff: delay = 2^n * base (100ms, 200ms, 400ms, 800ms). Fast recovery but aggressive. Exponential with jitter: delay = (2^n * base) + random(0, base). Prevents thundering herd when many clients retry simultaneously. Decorrelated jitter (AWS pattern): delay = min(cap, random(base, delay*3)). Adapts backoff based on feedback from previous retry. Fibonacci backoff: slower growth than exponential. Useful for very rate-limited APIs. Choose based on backend characteristics: degraded backend benefits from longer backoff; transient network issues benefit from faster retry.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Priority and Queuing</h3>
        <p>
          At scale, prioritize requests. High-priority: user-blocking (fetching page data before render). Medium-priority: user-visible but not blocking (loading sidebar data). Low-priority: background (prefetch, analytics). Implement priority queue: high-priority requests get slots first. If queue full, drop low-priority. Or delay low-priority. User experience benefits: critical page loads fast, less critical loads in background. Prevents one slow analytics fetch from blocking user interactions.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Hook vs Class Component</h3>
        <p>
          Hooks are preferred for cleaner composition and reusability. Class
          components require HOCs or render props, which are more verbose.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Library vs Custom</h3>
        <p>
          Consider using a library like React Query (TanStack Query) or SWR if
          complexity grows. Custom hooks are simpler for straightforward cases.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Global Request Deduplication</h3>
        <p>
          Deduplication adds complexity but is critical for performance. Without it,
          multiple components fetching the same resource cause redundant requests.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Error Recovery</h3>
        <p>
          Automatic retries help with transient failures. For permanent errors, expose
          a retry button so users can manually retry if conditions improve.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          A data fetching hook abstracts API fetching boilerplate and provides a
          clean interface for components. Key aspects include state management
          (loading, error, data), request deduplication, automatic retries,
          cancellation, and integration with caching. For staff/principal engineers,
          critical additions include observability, bulkhead isolation, memory
          profiling, testing strategies, and understanding at 1M+ user scale. Real-world
          implementations use libraries like React Query, which handle many edge cases.
          Understanding the underlying design helps when debugging, optimizing, or
          building custom solutions for unique requirements. Production systems require
          careful attention to resource limits, error propagation, and incident
          response procedures.
        </p>
      </section>
    </ArticleLayout>
  );
}
