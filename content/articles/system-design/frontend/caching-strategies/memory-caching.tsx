"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memory-caching-concise",
  title: "Memory Caching",
  description: "In-depth guide to in-memory caching for frontend applications including React Query, SWR, custom cache stores, and client-side data management patterns.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "memory-caching",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "React Query", "SWR", "state management", "in-memory"],
  relatedTopics: ["stale-while-revalidate", "browser-caching", "cache-invalidation-strategies"],
};

export default function MemoryCachingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Memory caching</strong> in the frontend context refers to storing server-fetched data, computed results,
          or derived state directly in the JavaScript heap (V8 memory) so that subsequent reads avoid redundant network
          requests or expensive recalculations. Unlike browser-level caches (HTTP cache, Cache API, IndexedDB), in-memory
          caches live entirely within the runtime of a single page session and are discarded on navigation away or tab closure.
        </p>
        <p>
          For API-heavy Single Page Applications, memory caching is often the single most impactful optimization.
          Without it, every component mount triggers a network request, every route transition re-fetches data that was
          already retrieved seconds ago, and every re-render recomputes values derived from the same inputs. Libraries
          like React Query (TanStack Query) and SWR have standardized this pattern, but the underlying primitives - Map,
          WeakMap, closures, and reference equality - are fundamental JavaScript concepts that every staff-level engineer
          should understand deeply.
        </p>
        <p>
          The challenge is not just "store data in a variable." Production-grade memory caching must address staleness
          detection, garbage collection pressure, cache invalidation, concurrent request deduplication, optimistic updates,
          and memory leaks from retained references. A naive cache that never evicts will eventually cause out-of-memory
          crashes on long-running sessions; a cache that evicts too aggressively offers no benefit over raw fetch calls.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding in-memory caching requires grasping several interconnected primitives:</p>
        <ul>
          <li>
            <strong>Map / WeakMap as Cache Stores:</strong> JavaScript's <code>Map</code> is the most common backing
            structure for in-memory caches. Keys can be any value (strings, arrays, objects), and lookup is O(1).
            <code>WeakMap</code> is used when cache keys are objects that should be garbage-collected when no longer
            referenced elsewhere - this prevents memory leaks but sacrifices enumeration and size introspection.
            React Query internally uses a <code>Map</code> with serialized query keys (JSON-stringified arrays) as
            keys, while frameworks like Apollo Client use normalized object references.
          </li>
          <li>
            <strong>LRU (Least Recently Used) Eviction:</strong> When cache size must be bounded, LRU eviction removes
            the entry that was accessed least recently. This is implemented as a doubly-linked list combined with a
            hash map, achieving O(1) for both get and put operations. For frontend caches, LRU is less common than
            TTL-based eviction because the number of unique queries in a session is typically manageable (hundreds,
            not millions), but it becomes critical in scenarios like infinite scroll where each page creates a new
            cache entry.
          </li>
          <li>
            <strong>TTL (Time-To-Live) Management:</strong> TTL determines how long a cache entry remains valid.
            In React Query, this maps to <code>staleTime</code> (how long data is considered fresh) and
            <code>gcTime</code> (formerly <code>cacheTime</code> - how long inactive entries remain in memory before
            garbage collection). A staleTime of 0 (the default) means data is stale immediately after fetching, which
            triggers a background refetch on the next mount. A staleTime of <code>Infinity</code> means data never
            goes stale and is only refetched via explicit invalidation.
          </li>
          <li>
            <strong>Reference Counting & Subscription Tracking:</strong> React Query and SWR track how many active
            components are subscribed to each cache entry. When the last subscriber unmounts, the entry becomes
            "inactive." Inactive entries are retained for <code>gcTime</code> (default 5 minutes in React Query)
            before being garbage-collected. This ensures that if a user navigates away and back within 5 minutes,
            cached data is still available instantly.
          </li>
          <li>
            <strong>Query Keys & Cache Identity:</strong> The query key is the cache's addressing mechanism. In React
            Query, keys are arrays: <code>["users", {'{"status": "active"}'}]</code>. The library serializes these
            deterministically (sorting object keys) so that <code>["users", {'{"status": "active", "role": "admin"}'}]</code> and
            <code>["users", {'{"role": "admin", "status": "active"}'}]</code> resolve to the same cache entry. This
            serialization is critical for deduplication. Poorly designed keys lead to cache misses, duplicate fetches,
            and stale data bugs.
          </li>
          <li>
            <strong>Cache Normalization:</strong> Apollo Client normalizes cached data into a flat store keyed by
            entity type and ID (<code>User:123</code>). This means updating a user in one query automatically updates
            all queries referencing that user. React Query does not normalize by default - each query key stores its
            own copy of the response. This is simpler but means updating a user requires invalidating every query that
            might contain that user's data.
          </li>
          <li>
            <strong>Garbage Collection Implications:</strong> V8's garbage collector cannot collect objects that are
            referenced by an active cache. Large cache entries (e.g., arrays of 10,000 items from paginated responses)
            consume heap space proportional to their size, not their access frequency. Engineers must be intentional
            about what gets cached and for how long, especially on memory-constrained mobile devices where the browser
            may terminate tabs exceeding ~300MB.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Modern frontend caching libraries share a common architectural pattern: a centralized cache store that hooks
          subscribe to, with a query lifecycle that determines when to serve from cache, when to refetch, and when to
          evict.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">React Query Cache Lifecycle</h3>
          <ol className="space-y-3">
            <li><strong>1. Mount:</strong> Component mounts and calls useQuery with a query key and fetch function</li>
            <li><strong>2. Cache Lookup:</strong> QueryClient checks the in-memory Map for an entry matching the serialized key</li>
            <li><strong>3a. Cache Miss:</strong> No entry exists. Set status to "loading", execute the fetch function, store result in cache with timestamp</li>
            <li><strong>3b. Cache Hit (Fresh):</strong> Entry exists and updatedAt + staleTime {'&gt;'} now. Return cached data immediately. No network request.</li>
            <li><strong>3c. Cache Hit (Stale):</strong> Entry exists but updatedAt + staleTime {'&lt;'} now. Return cached data immediately AND trigger a background refetch</li>
            <li><strong>4. Background Refetch:</strong> Fetch executes silently. On success, cache entry is updated and all subscribed components re-render with fresh data</li>
            <li><strong>5. Unmount:</strong> Component unmounts. Subscriber count decrements. If zero subscribers remain, start gcTime countdown</li>
            <li><strong>6. Garbage Collection:</strong> After gcTime elapses with zero subscribers, the cache entry is deleted from the Map</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/memory-cache-architecture.svg"
          alt="In-Memory Cache Architecture showing component tree, hooks, query cache, and API server"
          caption="Memory Cache Architecture - Multiple components sharing cache entries through query key deduplication"
        />

        <p>
          The critical insight is <strong>request deduplication</strong>. If three components mount simultaneously and
          all call <code>useQuery(["users"])</code>, only one network request is made. All three components subscribe
          to the same cache entry and receive the same data when the request resolves. This eliminates the "waterfall"
          problem where naive implementations fire redundant requests.
        </p>

        <p>
          SWR follows a similar model but with different defaults. SWR's <code>dedupingInterval</code> (2 seconds by
          default) prevents duplicate requests within a time window. Its <code>revalidateOnFocus</code> and
          <code>revalidateOnReconnect</code> options automatically trigger refetches when the user returns to the tab
          or reconnects to the network, keeping cached data synchronized with the server without explicit invalidation.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/react-query-flow.svg"
          alt="React Query Cache Lifecycle Flow showing mount, cache check, fresh/stale/miss paths"
          caption="React Query Flow - Decision tree from component mount through cache check to data delivery, showing staleTime and gcTime roles"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">React Query</th>
              <th className="p-3 text-left">SWR</th>
              <th className="p-3 text-left">Apollo Client</th>
              <th className="p-3 text-left">Custom Map Cache</th>
              <th className="p-3 text-left">Zustand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Cache Structure</strong></td>
              <td className="p-3">Flat Map by serialized key</td>
              <td className="p-3">Flat Map by key string</td>
              <td className="p-3">Normalized entity store</td>
              <td className="p-3">Any (Map, Object, WeakMap)</td>
              <td className="p-3">Plain JS object</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Auto Deduplication</strong></td>
              <td className="p-3">Yes (same key = one request)</td>
              <td className="p-3">Yes (dedupingInterval)</td>
              <td className="p-3">Yes (per operation)</td>
              <td className="p-3">Manual implementation</td>
              <td className="p-3">No (not a data-fetching lib)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Staleness Model</strong></td>
              <td className="p-3">staleTime + gcTime</td>
              <td className="p-3">revalidation triggers</td>
              <td className="p-3">fetchPolicy (cache-first, network-only, etc.)</td>
              <td className="p-3">Custom TTL logic</td>
              <td className="p-3">Manual (no built-in staleness)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Background Refetch</strong></td>
              <td className="p-3">Yes (stale-while-revalidate)</td>
              <td className="p-3">Yes (SWR core pattern)</td>
              <td className="p-3">Polling only</td>
              <td className="p-3">Manual</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Normalization</strong></td>
              <td className="p-3">No (opt-in via plugins)</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes (automatic)</td>
              <td className="p-3">Manual</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bundle Size</strong></td>
              <td className="p-3">~13KB gzipped</td>
              <td className="p-3">~4KB gzipped</td>
              <td className="p-3">~33KB gzipped</td>
              <td className="p-3">0KB (custom code)</td>
              <td className="p-3">~1KB gzipped</td>
            </tr>
            <tr>
              <td className="p-3"><strong>GC & Memory</strong></td>
              <td className="p-3">Automatic via gcTime</td>
              <td className="p-3">Provider-configurable</td>
              <td className="p-3">Manual gc() or evict()</td>
              <td className="p-3">Manual eviction</td>
              <td className="p-3">Manual cleanup</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">REST/GraphQL data fetching</td>
              <td className="p-3">Lightweight REST caching</td>
              <td className="p-3">GraphQL-heavy apps</td>
              <td className="p-3">Simple, specific use cases</td>
              <td className="p-3">Client-only state</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>Follow these practices for production-grade in-memory caching:</p>
        <ol className="space-y-3">
          <li>
            <strong>Design Query Keys as a Hierarchy:</strong> Structure keys as arrays with increasing specificity:
            <code>["users"]</code>, <code>["users", userId]</code>, <code>["users", userId, "posts"]</code>. This
            enables granular invalidation - invalidating <code>["users"]</code> can cascade to all user-related
            queries via <code>queryClient.invalidateQueries({"{'"}queryKey: ["users"]{"'}"})</code>. Avoid flat string keys
            like <code>"allUsers"</code> that have no relationship structure.
          </li>
          <li>
            <strong>Set Appropriate staleTime per Query:</strong> Not all data has the same freshness requirements.
            User profile data might tolerate <code>staleTime: 5 * 60 * 1000</code> (5 minutes), while a real-time
            chat message list might need <code>staleTime: 0</code>. Feature flags and configuration that rarely change
            can use <code>staleTime: Infinity</code> with manual invalidation on deployment events.
          </li>
          <li>
            <strong>Use Optimistic Updates for Mutations:</strong> When a user performs an action (like toggling a
            favorite), update the cache immediately before the server confirms. Roll back on error. This makes the UI
            feel instant. React Query's <code>onMutate</code> callback and <code>onError</code> rollback pattern is
            purpose-built for this.
          </li>
          <li>
            <strong>Prefetch on Hover or Route Transition:</strong> Anticipate what data the user will need next.
            Prefetch query data when the user hovers over a link or when route transition begins. React Query's
            <code>queryClient.prefetchQuery()</code> populates the cache before the component mounts, eliminating
            loading states entirely.
          </li>
          <li>
            <strong>Bound Cache Size for Paginated/Infinite Data:</strong> Infinite scroll creates one cache entry
            per page. A user scrolling through 200 pages accumulates significant memory. Use React Query's
            <code>maxPages</code> option (v5+) or implement manual eviction of distant pages that the user is
            unlikely to scroll back to.
          </li>
          <li>
            <strong>Avoid Caching Sensitive Data:</strong> Authentication tokens, PII, or financial data should not
            linger in an in-memory cache that any browser extension or DevTools can inspect. If you must cache it,
            ensure the cache is cleared on logout and consider using <code>structuredClone</code> to prevent reference
            leaks to external code.
          </li>
          <li>
            <strong>Monitor Cache Health in Production:</strong> Log cache hit rates, average staleness at read time,
            and memory usage. React Query DevTools shows this in development, but production monitoring requires
            instrumenting the QueryClient's <code>getQueryCache().subscribe()</code> to emit metrics to your
            observability platform.
          </li>
          <li>
            <strong>Separate Server State from Client State:</strong> Server state (fetched data) belongs in React
            Query or SWR. Client state (UI state like modals open, form inputs, selected tabs) belongs in Zustand,
            useState, or Context. Mixing them in a single store creates invalidation complexity and unnecessary
            re-renders.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these mistakes when implementing in-memory caching:</p>
        <ul className="space-y-3">
          <li>
            <strong>Using staleTime: Infinity Without Invalidation:</strong> Setting infinite staleTime means data
            never auto-refreshes. If you also forget to call <code>invalidateQueries</code> after mutations, users
            see permanently stale data. Always pair infinite staleTime with explicit invalidation in mutation
            <code>onSuccess</code> callbacks.
          </li>
          <li>
            <strong>Non-Deterministic Query Keys:</strong> Using objects with inconsistent property ordering or
            including unstable references (like <code>new Date()</code>) in query keys. This creates new cache entries
            for every render, defeating deduplication. Always use serializable, deterministic values in keys.
          </li>
          <li>
            <strong>Caching Mutable Objects Without Cloning:</strong> Storing a reference to a fetched object and then
            mutating it directly (e.g., <code>cachedUser.name = "new"</code>) corrupts the cache for all subscribers.
            Treat cached data as immutable. If you need to transform data, use React Query's <code>select</code>
            option to derive values without modifying the cached original.
          </li>
          <li>
            <strong>Memory Leaks from Forgotten Subscriptions:</strong> In custom cache implementations, failing to
            unsubscribe when components unmount causes the cache to hold references to unmounted component callbacks,
            preventing garbage collection. Always return cleanup functions from <code>useEffect</code> and use
            <code>AbortController</code> to cancel in-flight requests on unmount.
          </li>
          <li>
            <strong>Over-Caching Large Payloads:</strong> Caching 50MB of image metadata or 100,000-row table data
            in memory causes tab crashes on mobile devices. Profile memory usage with Chrome DevTools Memory panel.
            For large datasets, paginate responses and only cache the current window, or move bulk data to IndexedDB.
          </li>
          <li>
            <strong>Ignoring Cache Warming on SSR:</strong> In Next.js, server-rendered pages have no client-side cache.
            If the client hydrates and immediately refetches all data, you lose the SSR performance benefit. Use
            React Query's <code>dehydrate/hydrate</code> to transfer the server-side cache to the client, avoiding
            double-fetching.
          </li>
          <li>
            <strong>No Error Caching Strategy:</strong> By default, React Query does not cache errors the same way
            it caches data. A failed request with <code>retry: 3</code> will retry immediately on the next mount.
            For known error states (404, 403), consider caching the error to prevent retry storms against endpoints
            that will consistently fail.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>In-memory caching is essential in these scenarios:</p>
        <ul className="space-y-3">
          <li>
            <strong>Dashboard Applications:</strong> Analytics dashboards like Grafana or Datadog display dozens of
            widgets, each fetching different metrics. Memory caching with stale-while-revalidate ensures the dashboard
            renders instantly from cache on tab-switch while background refetches pull the latest data. Without caching,
            every tab switch triggers 20+ API calls simultaneously.
          </li>
          <li>
            <strong>Real-Time Data with Polling:</strong> Stock tickers, live sports scores, or social media feeds
            that poll every few seconds. The cache stores the latest snapshot and serves it between poll intervals.
            React Query's <code>refetchInterval</code> combined with staleTime ensures smooth updates without
            UI flicker, and automatic deduplication prevents multiple polling loops when the same data is displayed
            in multiple components.
          </li>
          <li>
            <strong>Infinite Scroll / Virtualized Lists:</strong> Applications like Twitter or Reddit that load
            content page by page. Each page is a separate cache entry keyed by page number. When users scroll back
            up, previously fetched pages are served from cache instantly. React Query v5's <code>maxPages</code>
            prevents unbounded memory growth by evicting the oldest pages.
          </li>
          <li>
            <strong>Form Autosave with Optimistic Updates:</strong> Document editors like Notion that autosave
            every few seconds. The cache holds the "server-confirmed" state while the UI shows the user's latest
            edits optimistically. On save failure, the cache's confirmed state is used to show the user what was
            actually persisted, enabling conflict resolution.
          </li>
          <li>
            <strong>Multi-Step Wizards / Checkout Flows:</strong> E-commerce checkout flows where the user navigates
            between shipping, payment, and review steps. Memory caching preserves form state, product details, and
            pricing calculations across steps without re-fetching. If the user goes back to the cart, product data
            is still in cache.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use In-Memory Caching</h3>
          <p>Avoid in-memory caching for:</p>
          <ul className="mt-2 space-y-2">
            <li>
              {"\u2022"} <strong>Data that must always be fresh:</strong> Payment processing, inventory availability
              at checkout, or security-critical data where stale reads could cause financial or security issues
            </li>
            <li>
              {"\u2022"} <strong>Cross-tab synchronization needs:</strong> In-memory caches are per-tab. If you need
              shared state across tabs (e.g., logout in one tab should clear data in all tabs), use BroadcastChannel
              or localStorage events alongside memory caching
            </li>
            <li>
              {"\u2022"} <strong>Persistence across sessions:</strong> Memory caches are lost on page refresh. For
              offline-first apps or data that should survive restarts, use IndexedDB or Cache API with a library like
              Workbox, and hydrate the memory cache from persistent storage on startup
            </li>
            <li>
              {"\u2022"} <strong>Very large datasets:</strong> Datasets exceeding 50-100MB should be stored in
              IndexedDB, not JavaScript heap memory, to avoid tab crashes and excessive GC pauses
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React Query prevent duplicate API calls when multiple components request the same data?</p>
            <p className="mt-2 text-sm">
              A: React Query uses the serialized query key as a cache address. When multiple components call
              <code>useQuery</code> with the same key, they all subscribe to the same cache entry. If a fetch is
              already in-flight for that key, new subscribers attach to the existing Promise rather than creating a
              new request. This is implemented via an internal <code>QueryObserver</code> pattern - each observer
              registers with the <code>Query</code> instance, and the Query manages a single fetch lifecycle. The
              result is broadcast to all observers simultaneously. This deduplication happens automatically and is
              one of the primary reasons to use a cache library over raw <code>useEffect</code> + <code>fetch</code>.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between staleTime and gcTime in React Query, and how would you configure them for a dashboard app?</p>
            <p className="mt-2 text-sm">
              A: <code>staleTime</code> controls how long fetched data is considered fresh. During this window, cache
              hits return data without any network request. After staleTime expires, the data is "stale" - it is still
              returned from cache immediately, but a background refetch is triggered (stale-while-revalidate).
              <code>gcTime</code> (formerly cacheTime) controls how long inactive cache entries (zero subscribers) are
              retained before garbage collection. For a dashboard with widgets that refresh every 30 seconds, you might
              set <code>staleTime: 15000</code> (15s - fresh for half the poll interval) and <code>gcTime: 300000</code>
              (5min - keep data in cache while user switches between dashboard tabs). For rarely-changing config data,
              <code>staleTime: Infinity</code> with manual invalidation on deploy events is appropriate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design a memory cache that handles both optimistic updates and rollback on failure?</p>
            <p className="mt-2 text-sm">
              A: The pattern involves three steps in the mutation lifecycle. First, in <code>onMutate</code>, snapshot
              the current cache state and optimistically update the cache with the expected new value. Second, return
              the snapshot as context so it is available in error handlers. Third, in <code>onError</code>, use the
              snapshot to restore the cache to its pre-mutation state (rollback). Finally, in <code>onSettled</code>
              (runs on both success and error), invalidate the affected queries to trigger a refetch that ensures the
              cache matches the actual server state. The key subtlety is canceling any in-flight refetches for the
              affected query key in <code>onMutate</code> (via <code>queryClient.cancelQueries</code>) to prevent a
              race condition where an old refetch overwrites the optimistic update before the mutation completes.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/query/latest/docs/framework/react/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query) Documentation - Official Guide
            </a>
          </li>
          <li>
            <a href="https://swr.vercel.app/docs/getting-started" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWR Documentation - React Hooks for Data Fetching
            </a>
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/caching/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apollo Client Caching - Normalized Cache Architecture
            </a>
          </li>
          <li>
            <a href="https://tkdodo.eu/blog/practical-react-query" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Practical React Query - TkDodo's Blog (Community Best Practices)
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/devtools/memory/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools Memory Panel - Debugging Memory Issues
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
