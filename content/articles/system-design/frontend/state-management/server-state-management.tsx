"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-server-state-management-concise",
  title: "Server State Management (React Query, SWR, Apollo Client)",
  description: "In-depth guide to server state management covering React Query, SWR, Apollo Client, cache invalidation, optimistic updates, and the distinction from client state.",
  category: "frontend",
  subcategory: "state-management",
  slug: "server-state-management",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "state management", "React Query", "SWR", "Apollo Client", "server state"],
  relatedTopics: ["global-state-management", "memory-caching", "optimistic-updates"],
};

export default function ServerStateManagementConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Server state</strong> is data that originates from and is persisted on a remote server. Unlike client
          state (UI toggles, form inputs, selected tabs), server state is fundamentally different: it is asynchronous,
          has shared ownership across multiple clients, and is potentially out-of-date the moment it arrives at the
          browser. Any other user, background job, or external system can mutate server state without your application
          knowing.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          For years, the dominant pattern was to fetch data inside <code>useEffect</code>, store it in local
          component state via <code>useState</code>, and manually track loading and error flags. This imperative
          approach forced developers to reinvent request deduplication, caching, background refetching, retry logic,
          stale data detection, pagination, and garbage collection in every feature. The result was bloated Redux
          stores full of <code>isLoading</code> / <code>error</code> / <code>data</code> triples alongside unrelated
          UI state, creating tightly coupled and fragile code.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The paradigm shift came with libraries like <strong>React Query</strong> (now TanStack Query),{" "}
          <strong>SWR</strong>, and <strong>Apollo Client</strong>, which treat server state as a first-class
          concern. Instead of telling the app <em>how</em> to fetch, cache, and synchronize, you declare{" "}
          <em>what</em> data a component needs and the library handles the rest. This declarative model eliminates
          entire categories of bugs: stale closures over outdated data, race conditions between competing requests,
          zombie child components displaying data from unmounted parents, and memory leaks from forgotten
          subscriptions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The key mental model is: <strong>the cache is the single source of truth for remote data</strong>. Components
          subscribe to cache entries via query keys, and the library decides when to serve cached data, when to
          refetch in the background, and when to garbage-collect unused entries. This inverts the traditional control
          flow and dramatically simplifies application architecture.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          The staff-level bar is being crisp about three things:{" "}
          <strong>query keys</strong> (identity), <strong>staleness windows</strong> (freshness policy), and{" "}
          <strong>invalidation</strong> (correctness after writes). Everything else is an optimization on top.
        </HighlightBlock>
        <p>
          Server state libraries share a set of foundational concepts, even though their APIs and internal
          implementations differ:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Query Keys:</strong> A serializable, unique identifier (typically an array like{" "}
            <code>["users", userId]</code>) that maps to a cache entry. Keys enable automatic deduplication: if
            three components request the same key, only one network call is made. Key structure also drives
            granular invalidation — invalidating <code>["users"]</code> can cascade to all entries whose key
            starts with that prefix.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Stale-While-Revalidate:</strong> Borrowed from HTTP cache semantics (RFC 5861). Cached data is
            served immediately (even if stale) while a background refetch runs. Once the fresh response arrives,
            the UI updates seamlessly. The <code>staleTime</code> config controls how long data is considered
            fresh (default 0 in React Query, meaning data is always stale on re-mount). A well-tuned staleTime
            eliminates redundant network requests without sacrificing data freshness.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Cache Invalidation:</strong> After a mutation (POST, PUT, DELETE), related cache entries must
            be invalidated so components refetch fresh data. React Query provides{" "}
            <code>queryClient.invalidateQueries</code> to mark entries as stale by key prefix or exact match.
            Apollo uses <code>refetchQueries</code> or cache eviction. Getting invalidation right is the single
            most impactful decision in server state architecture.
          </HighlightBlock>
          <li>
            <strong>Background Refetching:</strong> Libraries automatically refetch when the window regains focus
            (<code>refetchOnWindowFocus</code>), when the network reconnects, or on configurable intervals. This
            keeps data fresh without user action and without full-page reloads.
          </li>
          <li>
            <strong>Request Deduplication:</strong> Multiple hook instances with the same query key within a short
            window result in a single network request. The library fans out the result to all subscribers. This
            eliminates a massive class of performance bugs in component trees where parent and child both need the
            same data.
          </li>
          <li>
            <strong>Pagination &amp; Infinite Queries:</strong> React Query&apos;s <code>useInfiniteQuery</code>{" "}
            and SWR&apos;s <code>useSWRInfinite</code> provide first-class abstractions for cursor-based and
            offset-based pagination, managing an array of page responses and exposing{" "}
            <code>fetchNextPage</code> / <code>hasNextPage</code> helpers.
          </li>
          <li>
            <strong>Dependent Queries:</strong> When query B depends on data from query A (e.g., fetch a
            user&apos;s projects after fetching the user), the <code>enabled</code> option gates execution. This
            eliminates manual orchestration with nested useEffects.
          </li>
          <li>
            <strong>Prefetching:</strong> Data for anticipated navigation can be prefetched into the cache before
            the user clicks. <code>queryClient.prefetchQuery</code> silently populates the cache entry, so the
            destination page renders instantly.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Optimistic Updates:</strong> Mutations can immediately update the local cache with the
            expected result before the server responds. If the mutation fails, the cache rolls back to its
            previous state via the <code>onMutate</code> / <code>onError</code> lifecycle. This provides instant
            perceived performance for actions like toggling a like button or reordering a list.
          </HighlightBlock>
          <li>
            <strong>Cache Normalization (Apollo):</strong> Apollo Client stores entities by their{" "}
            <code>__typename</code> and <code>id</code>, creating a flat, normalized lookup table. Updating a
            single entity automatically updates every query result that references it. This is powerful for
            GraphQL but adds complexity and can cause unexpected cache update behavior if type policies are not
            carefully configured.
          </li>
          <li>
            <strong>Garbage Collection:</strong> Unused cache entries (no active subscribers) are automatically
            removed after a configurable period (<code>gcTime</code>, formerly <code>cacheTime</code> in React
            Query v4). This prevents memory leaks without manual cleanup.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Understanding the internal architecture of server state libraries reveals why they are so effective
          at eliminating boilerplate and bugs.
        </HighlightBlock>

        <h3>React Query Internal Model</h3>
        <HighlightBlock as="p" tier="important">
          At the center is the <strong>QueryClient</strong>, which holds an in-memory cache map keyed by
          serialized query keys. Each cache entry tracks its data, error state, timestamps (dataUpdatedAt,
          fetchedAt), fetch status, and a set of observer subscriptions. When a component mounts with{" "}
          <code>useQuery</code>, an <strong>Observer</strong> is created and registered against the cache entry.
          The observer listens for cache updates and triggers re-renders when data or status changes.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          When a fetch is triggered (initial mount, invalidation, window focus), the QueryClient checks whether an
          active fetch for that key already exists. If so, the new request is deduplicated — the observer simply
          subscribes to the in-flight promise. If no fetch is active, a new one is initiated. The fetch function
          (your API call) runs, and its result is written to the cache. All observers are notified, and subscribed
          components re-render with fresh data.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/server-state-architecture.svg"
          alt="Server State Architecture showing QueryClient cache, deduplication, and component subscriptions"
          caption="Server state architecture — multiple components share a single cache entry via query keys, with automatic request deduplication"
          captionTier="important"
        />

        <h3>Apollo Client Normalized Cache</h3>
        <p>
          Apollo takes a fundamentally different approach. Rather than storing query results as-is (keyed by query
          string + variables), Apollo <strong>normalizes</strong> the response. Each object with a{" "}
          <code>__typename</code> and <code>id</code> is extracted and stored in a flat lookup table. Query
          results become references (pointers) into this table. When a mutation returns an updated entity, Apollo
          writes it to the normalized store, and every query that references that entity is automatically updated
          without explicit invalidation.
        </p>
        <p>
          This normalization is powerful but introduces complexity: merge functions for paginated fields, type
          policies for custom cache keys, and <code>cache.evict</code> for removing stale entities. Debugging
          cache inconsistencies requires the Apollo DevTools to inspect the normalized store. For REST APIs or
          simpler data graphs, React Query&apos;s key-based approach is generally more straightforward.
        </p>

        <h3>Client State vs Server State</h3>
        <HighlightBlock as="p" tier="important">
          The architectural distinction between client state and server state is not just semantic — it dictates
          which tools to use and how to structure your application. Conflating them (e.g., storing API responses
          in Redux alongside UI toggles) creates unnecessary coupling and forces you to manually solve problems
          that server state libraries handle automatically.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/client-vs-server-state.svg"
          alt="Client State vs Server State comparison diagram"
          caption="Client state is synchronous and app-owned; server state is asynchronous, shared, and potentially stale — they require fundamentally different management approaches"
          captionTier="important"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <HighlightBlock as="p" tier="crucial">
          Each server state library makes different trade-offs. The right choice depends on your API protocol,
          team experience, and feature requirements:
        </HighlightBlock>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">React Query</th>
              <th className="p-3 text-left">SWR</th>
              <th className="p-3 text-left">Apollo Client</th>
              <th className="p-3 text-left">RTK Query</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Protocol</strong></td>
              <td className="p-3">Any (REST, GraphQL, gRPC)</td>
              <td className="p-3">Any (REST-focused)</td>
              <td className="p-3">GraphQL only</td>
              <td className="p-3">Any (REST-focused)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache Model</strong></td>
              <td className="p-3">Query-key map (document cache)</td>
              <td className="p-3">Key-based (simple map)</td>
              <td className="p-3">Normalized entity cache</td>
              <td className="p-3">Tag-based invalidation</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bundle Size</strong></td>
              <td className="p-3">~13KB gzipped</td>
              <td className="p-3">~4KB gzipped</td>
              <td className="p-3">~33KB gzipped</td>
              <td className="p-3">Included in RTK (~11KB added)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>DevTools</strong></td>
              <td className="p-3">Excellent (dedicated panel)</td>
              <td className="p-3">Minimal (SWR DevTools)</td>
              <td className="p-3">Excellent (cache inspector)</td>
              <td className="p-3">Via Redux DevTools</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Offline Support</strong></td>
              <td className="p-3">Built-in (persistQueryClient)</td>
              <td className="p-3">Basic (via custom provider)</td>
              <td className="p-3">Strong (apollo3-cache-persist)</td>
              <td className="p-3">Via RTK persistence</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Optimistic Updates</strong></td>
              <td className="p-3">First-class (onMutate/onError)</td>
              <td className="p-3">Via mutate + rollback</td>
              <td className="p-3">Built-in (optimisticResponse)</td>
              <td className="p-3">Via onQueryStarted</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Learning Curve</strong></td>
              <td className="p-3">Low-medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">High (normalization, type policies)</td>
              <td className="p-3">Medium (Redux knowledge needed)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SSR / RSC</strong></td>
              <td className="p-3">Hydration support, RSC prefetch</td>
              <td className="p-3">Basic SSR support</td>
              <td className="p-3">SSR via getDataFromTree</td>
              <td className="p-3">SSR via NEXT_REDUX_WRAPPER</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When to Choose What</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>React Query:</strong> Best default choice. Protocol-agnostic, excellent DX, active
              community, great for REST and GraphQL alike.
            </HighlightBlock>
            <li>
              <strong>SWR:</strong> When minimal bundle size matters and you need simple caching without complex
              mutation workflows. Ideal for read-heavy apps.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>Apollo Client:</strong> When your backend is GraphQL and you need normalized caching to
              avoid redundant refetches across deeply nested queries.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>RTK Query:</strong> When your team already uses Redux Toolkit and wants server state
              integrated into the existing Redux ecosystem.
            </HighlightBlock>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices are primarily about correctness and cost: set staleness windows intentionally, keep query keys
          consistent, and make invalidation predictable after mutations.
        </HighlightBlock>
        <p>These practices apply across all server state libraries and are critical for production applications:</p>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Set a non-zero staleTime for stable data:</strong> Data that changes infrequently (user
            profile, feature flags, static lookups) should have a staleTime of 5-30 minutes. This eliminates
            redundant network requests on every component mount and dramatically improves perceived performance.
            The default staleTime of 0 means every mount triggers a background refetch.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Structure query keys hierarchically:</strong> Use arrays like{" "}
            <code>["todos", "list", {"{"} status: "active" {"}"}]</code> so you can invalidate at any
            granularity. Invalidating <code>["todos"]</code> cascades to all todo-related queries. Create a
            query key factory to ensure consistency across your codebase.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Separate server state from client state completely:</strong> Use React Query / SWR for
            server data and Zustand / useState for UI state. Never store API responses in Redux or Zustand — this
            forces you to manually handle loading, error, staleness, and cache invalidation, which is exactly
            what server state libraries automate.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use optimistic updates for user-initiated mutations:</strong> Actions like toggling a
            favorite, sending a message, or reordering items should update the UI instantly and reconcile with
            the server response. Always implement rollback on error. This is the single biggest UX improvement
            you can make.
          </HighlightBlock>
          <li>
            <strong>Prefetch on hover or route anticipation:</strong> When a user hovers over a link, prefetch
            the destination&apos;s data. By the time they click, the data is already cached. Use{" "}
            <code>queryClient.prefetchQuery</code> on <code>onMouseEnter</code> or in router middleware for
            near-instant page transitions.
          </li>
          <li>
            <strong>Configure gcTime carefully in SPAs:</strong> The default garbage collection time (5 minutes
            in React Query) works for most apps, but long-lived dashboards with many tabs may benefit from
            shorter gcTime to prevent memory bloat. Monitor cache size in DevTools.
          </li>
          <li>
            <strong>Use select/transform to minimize re-renders:</strong> React Query&apos;s{" "}
            <code>select</code> option lets you derive a subset of data from the cache. Components only
            re-render when the selected value changes, not when the full query result updates. This is critical
            for large data sets where many components subscribe to the same query.
          </li>
          <li>
            <strong>Wrap mutations in a custom hook:</strong> Encapsulate mutation logic (including cache
            invalidation, optimistic updates, and error handling) in a dedicated hook like{" "}
            <code>useUpdateTodo</code>. This keeps components thin, makes mutation behavior reusable, and
            centralizes cache invalidation logic.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Most server-state bugs come from mis-specified identity (unstable query keys), mis-specified freshness
          (staleTime defaults), or overly broad invalidation after writes.
        </HighlightBlock>
        <p>Avoid these mistakes that frequently cause bugs and performance issues in production:</p>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Mixing server and client state in one store:</strong> Storing API responses in Redux or
            Zustand alongside UI state means you are manually reimplementing caching, invalidation, loading
            tracking, and garbage collection. This is the most common anti-pattern. It leads to stale data bugs,
            duplicated loading states, and massive reducer complexity. Use dedicated server state libraries.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Not setting staleTime (leaving default 0):</strong> With staleTime of 0, every component
            mount triggers a background refetch, even if data was fetched milliseconds ago. In a complex
            component tree where the same query key appears in multiple components, this causes visible loading
            flickers and wasted bandwidth. Always explicitly set staleTime based on your data&apos;s volatility.
          </HighlightBlock>
          <li>
            <strong>Creating waterfall queries unintentionally:</strong> Fetching data in a parent, waiting for
            render, then fetching in a child creates sequential network requests. Use{" "}
            <code>prefetchQuery</code> to start child queries in parallel, or restructure your API to return
            nested data in a single request. Waterfalls add 200-500ms per hop.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Over-fetching with too-broad invalidation:</strong> Invalidating <code>["todos"]</code>{" "}
            after editing a single todo refetches every todo-related query (list, detail, stats). Use targeted
            invalidation with exact keys, or use{" "}
            <code>queryClient.setQueryData</code> to update the specific cache entry directly without
            refetching.
          </HighlightBlock>
          <li>
            <strong>Forgetting to handle error and loading states:</strong> Server state is inherently
            asynchronous. Every query can be in loading, error, success, or idle state. Not handling these
            cases leads to undefined data access, blank screens, and poor error recovery UX. Use the{" "}
            <code>status</code> field or destructured <code>isLoading</code> / <code>isError</code> flags.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Using unstable query keys:</strong> If a query key includes an object reference that changes
            on every render (e.g., an inline object), the library treats it as a new query each time, causing
            infinite refetch loops. Always memoize or use stable references for query key values.
          </HighlightBlock>
          <li>
            <strong>Not deduplicating mutations:</strong> Unlike queries, mutations are not deduplicated by
            default. A user double-clicking a "Submit" button fires two mutations. Guard against this with
            disabled states, debouncing, or the <code>isPending</code> flag from <code>useMutation</code>.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Server state libraries pay off when you have multiple consumers of the same data and you need correctness
          under churn: caching, background refresh, deduplication, and predictable invalidation.
        </HighlightBlock>
        <p>Server state management shines in applications with complex data requirements:</p>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Data-Heavy Dashboards:</strong> Analytics platforms (Grafana, Datadog, Mixpanel) display
            dozens of widgets that each fetch different metrics. React Query deduplicates shared queries,
            manages individual refetch intervals per widget, and handles stale data gracefully. Background
            refetching on window focus ensures the dashboard stays current without manual refresh.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>E-commerce Product Pages:</strong> Product detail, reviews, inventory, and recommendations
            can be fetched as parallel queries. Optimistic updates on add-to-cart provide instant feedback.
            Prefetching on product hover makes navigation feel instant. Cache invalidation after purchase ensures
            accurate inventory counts.
          </HighlightBlock>
          <li>
            <strong>Social Feeds &amp; Infinite Scroll:</strong> Infinite query pagination manages growing lists
            of posts efficiently. Optimistic updates for likes and comments make the feed feel responsive. Cache
            normalization (Apollo) ensures that editing a post updates it everywhere it appears — in the feed,
            on the profile, and in search results.
          </li>
          <li>
            <strong>Collaborative Applications:</strong> Project management tools (Linear, Jira, Notion) where
            multiple users edit the same data. Polling or WebSocket-driven invalidation keeps data synchronized.
            Optimistic updates maintain responsiveness while the server confirms changes.
          </li>
          <li>
            <strong>Admin Panels &amp; CMS:</strong> Content management systems with CRUD operations benefit from
            mutation lifecycle hooks (onSuccess invalidation, optimistic updates, rollback). The query key
            factory pattern keeps cache invalidation predictable across dozens of entity types.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use Server State Libraries</h3>
          <p>These tools add unnecessary overhead when:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • Your app fetches data once on load and never refetches (static config, feature flags loaded at
              boot)
            </li>
            <li>
              • You only have 1-2 API calls in the entire application — useState + useEffect is simpler
            </li>
            <li>
              • The data flows exclusively through server components (Next.js RSC) and never needs client-side
              caching
            </li>
            <li>
              • Real-time data arrives via WebSocket push and does not need request/response cache semantics
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <HighlightBlock as="p" tier="crucial">
          Strong answers separate client vs server state, then explain cache identity (keys), freshness policy
          (staleTime + refetch triggers), and correctness after writes (invalidation vs direct update vs optimistic).
        </HighlightBlock>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between server state and client state, and why do they need different
              management approaches?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Client state is synchronous, owned entirely by the application, and always up-to-date (UI
              toggles, form inputs, selected tab). Server state is asynchronous, has shared ownership (any
              client can mutate it), and is potentially stale the moment it arrives. Client state needs simple
              get/set (useState, Zustand). Server state requires loading/error tracking, caching, background
              refetching, deduplication, invalidation after mutations, retry logic, and garbage collection.
              Mixing them in one store (e.g., putting API responses in Redux alongside UI state) forces you to
              manually implement all of these concerns, which is exactly what libraries like React Query
              automate. The separation is not just organizational — it reflects fundamentally different data
              lifecycles.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does React Query handle cache invalidation after a mutation, and what are the tradeoffs
              between invalidation strategies?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: React Query offers three mutation strategies, each with different tradeoffs. (1){" "}
              <strong>Invalidation</strong>: call{" "}
              <code>queryClient.invalidateQueries({"{"} queryKey: ["todos"] {"}"})</code> in <code>onSuccess</code>
              — marks cache entries as stale and triggers refetch. Simple but causes a network roundtrip. (2){" "}
              <strong>Direct cache update</strong>: use{" "}
              <code>queryClient.setQueryData(["todos", id], updatedTodo)</code> to write the mutation response
              directly to cache — avoids refetch but risks cache/server divergence if the response shape
              differs. (3){" "}
              <strong>Optimistic update</strong>: in <code>onMutate</code>, snapshot current cache, write the
              optimistic value, return the snapshot for rollback; in <code>onError</code>, restore the
              snapshot; in <code>onSettled</code>, invalidate to ensure server truth. This gives instant UI
              feedback but is the most complex to implement correctly. The best practice is to use invalidation
              as the default, direct cache update when the mutation response matches the query shape exactly,
              and optimistic updates only for user-facing actions where perceived latency matters.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you architect server state in a large-scale application with 50+ API endpoints?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: At scale, the key decisions are: (1) Create a <strong>query key factory</strong> — a central
              object that generates consistent keys for every entity and its variants (list, detail, filtered).
              This prevents key typos and ensures invalidation cascades correctly. (2) Build{" "}
              <strong>custom hooks per domain</strong> (useUsers, useTodos) that encapsulate query
              configuration, error handling, and data transformation via the <code>select</code> option. (3)
              Set <strong>global defaults</strong> on QueryClient for staleTime, gcTime, retry, and
              refetchOnWindowFocus based on your data freshness requirements. (4) Implement{" "}
              <strong>mutation hooks</strong> that co-locate cache invalidation logic (useCreateTodo handles
              invalidating ["todos", "list"] and prefetching the new item). (5) Use{" "}
              <strong>React Query DevTools</strong> to monitor cache size, active queries, and stale entries
              in development. (6) For SSR/RSC, prefetch critical queries on the server and dehydrate the cache
              to avoid waterfalls on the client. This architecture keeps the codebase predictable even as the
              number of endpoints grows, because each domain is self-contained and cache invalidation is
              explicit.
            </HighlightBlock>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/query/latest/docs/react/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query) Official Documentation
            </a>
          </li>
          <li>
            <a href="https://swr.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWR — React Hooks for Data Fetching (Vercel)
            </a>
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apollo Client Documentation — GraphQL Client for React
            </a>
          </li>
          <li>
            <a href="https://tkdodo.eu/blog/practical-react-query" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Practical React Query — TkDodo&apos;s Blog (community best practices)
            </a>
          </li>
          <li>
            <a href="https://redux-toolkit.js.org/rtk-query/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RTK Query Overview — Redux Toolkit Official Docs
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
