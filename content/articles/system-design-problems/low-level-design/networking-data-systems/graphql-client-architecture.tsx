"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-graphql-client-architecture",
  title: "GraphQL Client Architecture",
  description:
    "Production-grade GraphQL client architecture covering normalized caching, query lifecycle, optimistic mutations, subscriptions, batching, persisted queries, N+1 prevention, auth link chain, and code generation.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "graphql-client-architecture",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-16",
  tags: ["graphql", "apollo", "relay", "caching", "subscriptions", "mutations", "lld"],
};

export default function GraphqlClientArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        GraphQL client architecture is a frequent topic in FAANG frontend system design interviews because it
        demonstrates understanding of normalized caching, data consistency, real-time updates, and performance
        optimization. Apollo Client and Relay are the dominant libraries, but understanding the underlying
        patterns — normalization, query deduplication, optimistic updates, link chains — matters more than
        any specific library API.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/networking-data-systems/graphql-client-architecture.svg"
        alt="GraphQL client architecture diagram"
        caption="Normalized cache, mutation lifecycle, subscriptions, APQ, N+1 prevention, and link chain architecture"
      />

      <h2>Why GraphQL on the Frontend</h2>
      <p>
        REST APIs force the client to adapt to server-defined response shapes — often leading to over-fetching
        (receiving unused fields) or under-fetching (requiring multiple requests for related data). GraphQL
        inverts this: clients declare exactly what data they need via typed queries, and the server returns
        precisely that shape. Benefits for frontend teams:
      </p>
      <p>
        <strong>Co-located data requirements.</strong> Each component declares its own data fragment. The
        parent query composes fragments from all child components. This eliminates the "who needs what data"
        coordination problem between frontend and backend teams.
      </p>
      <p>
        <strong>Strongly typed schema.</strong> The GraphQL schema is the contract between frontend and backend.
        Code generation tools (graphql-codegen) produce typed React hooks from the schema — catching API
        mismatches at compile time, not runtime.
      </p>
      <p>
        <strong>Single endpoint.</strong> All data fetching goes through one HTTP endpoint (typically /graphql),
        simplifying authentication, monitoring, and caching infrastructure.
      </p>

      <h2>Normalized Cache Architecture</h2>
      <p>
        The normalized cache is the central innovation of GraphQL clients like Apollo and Relay. Instead of
        storing query results as nested JSON blobs (like React Query or SWR), the normalized cache flattens
        all objects by their identity and stores them in a single flat map.
      </p>
      <p>
        <strong>Cache key derivation.</strong> Every object with a <code>__typename</code> and <code>id</code>
        field gets a cache key: <code>User:42</code>, <code>Post:100</code>. Query results are walked recursively
        — each object is written to the cache by its key, and parent fields store references (not copies).
        This means a User object referenced by 10 different queries exists as a single entry in the cache.
      </p>
      <p>
        <strong>Automatic cache updates.</strong> When a mutation updates a User object, all queries that
        reference <code>User:42</code> automatically re-render with the new data — no manual cache invalidation
        needed. This is the killer feature of normalized caching.
      </p>
      <p>
        <strong>Custom key fields.</strong> Objects without a standard <code>id</code> field require custom
        cache key configuration. Example: a product with composite key (sku + region) needs
        <code>keyFields: ['sku', 'region']</code>. Objects with no stable identity use
        <code>keyFields: false</code> — they are embedded inline in parent objects rather than normalized.
      </p>
      <p>
        <strong>Garbage collection.</strong> Calling <code>cache.gc()</code> removes cache entries that are
        not reachable from any active query. Apollo runs this automatically after query deregistration
        (component unmount). Without GC, long-running SPAs accumulate unbounded cache entries. Configure
        <code>client.writePolicy</code> to control how aggressively to evict.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Normalized caching only works when objects have stable, unique identifiers. If your API returns objects
        without id fields (or with non-unique ids), the cache cannot normalize them and will embed them inline
        — losing the automatic update benefit. Work with your API team to ensure all mutable objects have
        globally unique ids (use UUIDs, not auto-increment integers that may collide across entity types).
      </HighlightBlock>

      <h2>Query Fetch Policies</h2>
      <p>
        Apollo provides six fetch policies that control how the cache interacts with network requests. Choosing
        the right policy is critical for performance and data freshness.
      </p>
      <p>
        <strong>cache-first (default).</strong> Serve from cache if all requested fields are present; only
        fetch from network if cache is incomplete. Best for data that changes infrequently (user profiles,
        configuration). Risk: serving stale data.
      </p>
      <p>
        <strong>cache-and-network.</strong> Serve from cache immediately (fast render), then fetch from network
        and re-render if data differs. Best for frequently changing data (feeds, notifications) where showing
        a stale initial state briefly is acceptable.
      </p>
      <p>
        <strong>network-only.</strong> Always fetch from network, hydrate cache. Use for data where freshness
        is critical (account balances, order status). No cache read, but cache is still written for other
        queries to benefit.
      </p>
      <p>
        <strong>no-cache.</strong> Always fetch, never read or write cache. Use for data that must not be
        shared across components or sessions (one-time tokens, sensitive health data).
      </p>
      <p>
        <strong>cache-only.</strong> Only read from cache; error if data absent. Use for UI-only state that
        was previously written to cache via local state management.
      </p>
      <p>
        <strong>standby.</strong> Like cache-first but does not subscribe to cache updates — the component
        will not re-render when cache changes. Use for background queries.
      </p>

      <h2>Mutations and Optimistic Updates</h2>
      <p>
        Mutations modify server state. The challenge: the UI should reflect the change immediately (optimistic)
        while the server processes the mutation asynchronously.
      </p>
      <p>
        <strong>Optimistic response.</strong> Provide an <code>optimisticResponse</code> object that matches
        the expected mutation result shape. Apollo writes this to the cache immediately. If the mutation
        succeeds, the real server response overwrites the optimistic entry. If it fails, Apollo rolls back
        the optimistic write and restores the previous cache state automatically.
      </p>
      <p>
        <strong>Update function.</strong> After a successful mutation, Apollo's <code>update</code> function
        lets you manually modify the cache to reflect the change without triggering a refetch. Example: after
        creating a new comment, append the new comment to the post's comments list in cache using
        <code>cache.modify()</code>. This avoids an extra network round-trip.
      </p>
      <p>
        <strong>Refetch queries.</strong> For simple cases, specify <code>refetchQueries</code> — Apollo
        re-executes listed queries after mutation completion. Simpler than the update function but incurs
        a network round-trip. Best for mutations whose side effects are hard to predict locally.
      </p>
      <p>
        <strong>GraphQL vs HTTP errors.</strong> A critical distinction: HTTP 200 responses can contain
        GraphQL errors in the <code>errors</code> array alongside partial data. Your error handling must
        check both. Network errors (HTTP 5xx, network timeouts) are thrown as exceptions. GraphQL errors
        (validation failures, resolver errors) arrive as objects in the response. Partial success — some
        fields resolve, others error — is a valid GraphQL response that requires careful handling.
      </p>

      <h2>Subscriptions for Real-Time Data</h2>
      <p>
        GraphQL subscriptions deliver real-time updates over WebSocket. The <code>graphql-ws</code> protocol
        (replacing the deprecated <code>subscriptions-transport-ws</code>) handles the WebSocket lifecycle.
      </p>
      <p>
        <strong>Transport setup.</strong> Configure Apollo with a split link: WebSocket for subscriptions,
        HTTP for queries and mutations. The split function checks <code>operation.query.definitions</code>
        for OperationDefinition with operation === "subscription".
      </p>
      <p>
        <strong>Subscription lifecycle.</strong> Each subscription creates a unique operation ID on the server.
        The server pushes events matching the subscription filter. React components subscribe on mount and
        unsubscribe on unmount — critical to clean up to prevent memory leaks and unnecessary server load.
        Use <code>subscribeToMore</code> to extend an existing query with real-time updates.
      </p>
      <p>
        <strong>Merging subscription data.</strong> Use <code>updateQuery</code> inside <code>subscribeToMore</code>
        to merge incoming subscription events into the existing query result. Example: a newMessage subscription
        appends the message to the messages array in the conversations query cache.
      </p>
      <p>
        <strong>Subscription vs polling.</strong> Subscriptions are efficient for high-frequency updates (chat,
        live scores) because they push only changed data. Polling is simpler for low-frequency updates — use
        Apollo's <code>pollInterval</code> option. Polling is more reliable under unstable network conditions;
        subscriptions require a persistent WebSocket connection.
      </p>

      <h2>Batching, Persisted Queries, and Deduplication</h2>
      <p>
        <strong>Query batching.</strong> Apollo's batch HTTP link collects all queries initiated within a
        configurable time window (default 10ms) and sends them as a single HTTP request (array of operations).
        The server processes them independently and returns an array of results. This reduces HTTP overhead
        when many components mount simultaneously (e.g., initial page load with a complex component tree).
      </p>
      <p>
        <strong>Automatic Persisted Queries (APQ).</strong> Large query documents add significant payload
        to every request. APQ hashes the query body and sends only the hash on first request. If the server
        doesn't recognize the hash, it returns a PersistedQueryNotFound error, the client retries with the
        full query body, and the server caches the hash-to-query mapping. Subsequent requests send only the
        hash — reducing payload by 60–90% for large queries.
      </p>
      <p>
        <strong>Request deduplication.</strong> If the same query is in-flight and another component requests
        the same data, Apollo shares the in-flight promise rather than sending a duplicate request. Both
        components receive the same response. This is critical for initial page loads where many components
        may independently request the same user profile or configuration data.
      </p>

      <h2>Link Chain Architecture</h2>
      <p>
        Apollo's link chain is a middleware pipeline for GraphQL operations. Links are composed left-to-right,
        each processing the operation before passing it to the next link. The terminal link (httpLink or wsLink)
        executes the actual network request.
      </p>
      <p>
        <strong>Auth link.</strong> Inject the Authorization header: read the access token from the auth store,
        add it to the operation context. On receiving a 401, call the token refresh endpoint, update the stored
        token, and retry the original operation using <code>forward(operation)</code>.
      </p>
      <p>
        <strong>Error link.</strong> Process GraphQL errors globally: log to Sentry, show a toast for
        INTERNAL_SERVER_ERROR, redirect to login on UNAUTHENTICATED (after refresh fails). This centralizes
        error handling that would otherwise be duplicated in every component.
      </p>
      <p>
        <strong>Retry link.</strong> Automatically retry failed operations on network errors (not on GraphQL
        errors). Configure: max retries (3), delay strategy (exponential backoff), and a <code>retryIf</code>
        predicate (only retry network errors, not 4xx responses).
      </p>
      <p>
        <strong>Typical chain:</strong> authLink → retryLink → errorLink → (split: wsLink | batchHttpLink).
        Order matters: auth runs first (sets headers), retry wraps the network call, error processes the
        result, the terminal link executes the request.
      </p>

      <h2>N+1 Prevention</h2>
      <p>
        The N+1 problem occurs when fetching a list of N items where each item triggers an additional query
        (1 query for the list + N queries for related data). In GraphQL, this appears when a resolver for
        a related field (e.g., user.posts) issues a separate DB query per user.
      </p>
      <p>
        <strong>DataLoader on the server.</strong> DataLoader (npm package by Facebook) batches individual
        load calls within a single event loop tick into a single database query. A users resolver calls
        <code>dataloader.load(userId)</code>; DataLoader collects all load calls in the current tick and
        fires a single <code>WHERE id IN (...)</code> query. Results are cached per request.
      </p>
      <p>
        <strong>Fragment colocation on the client.</strong> Each component declares its data requirements
        as a GraphQL fragment. The root query composes all fragments. This ensures all needed data is fetched
        in a single round-trip, and components never trigger additional queries when they render.
      </p>
      <p>
        <strong>Query complexity limits.</strong> Deep or wide queries can be expensive on the server. Implement
        query complexity analysis: each field has a cost (1 for scalar, connection multiplier for lists). Reject
        queries above a complexity threshold. This prevents clients from accidentally (or maliciously) constructing
        O(n^k) queries.
      </p>

      <h2>Code Generation and Type Safety</h2>
      <p>
        <strong>graphql-codegen.</strong> Given your GraphQL schema and operations, graphql-codegen generates
        TypeScript types for every query, mutation, and subscription — including the exact shape of variables
        and response data. The generated hooks (<code>useGetUserQuery</code>, <code>useUpdateProfileMutation</code>)
        are fully typed with zero runtime overhead.
      </p>
      <p>
        <strong>Fragment masking (Relay-style).</strong> Each component's fragment is an opaque type — parent
        components cannot access child component data, enforcing data encapsulation. Components only receive
        the data they declared. This prevents tight coupling between components through shared data structures.
      </p>
      <p>
        <strong>Schema introspection in production.</strong> Disable introspection in production environments —
        it exposes your entire schema to potential attackers. Enable it only in development and staging. Configure
        your GraphQL server to reject introspection queries based on environment.
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: How does Apollo's normalized cache work, and what are its limitations?</h3>
      <p>
        Apollo normalizes query results by walking the response AST. Every object with __typename and id gets
        stored at key "TypeName:id" in a flat map. Parent fields store references (e.g., "post.author" →
        REF("User:42")) rather than copies. When any query touches User:42, all components subscribed to
        that object re-render.
      </p>
      <p>
        Limitations: (1) Objects without stable ids cannot be normalized — they are embedded inline and don't
        benefit from automatic updates. (2) Pagination is complex — each page's connection has different cursor
        args, creating separate cache entries that must be merged via custom field policies. (3) The cache can
        grow unbounded without GC. (4) Complex list mutations (insertions, deletions, reorderings) require
        manual cache.modify() calls — the automatic update only works for field-level changes.
      </p>

      <h3>Q2: How do you handle optimistic updates that fail?</h3>
      <p>
        Apollo automatically rolls back optimistic writes when a mutation fails. The mechanism: Apollo maintains
        a "optimistic layer" on top of the canonical cache. Optimistic writes go to this layer. If the mutation
        succeeds, the real response is applied to the canonical cache and the optimistic layer is removed.
        If it fails, the optimistic layer is simply discarded — the canonical cache retains its pre-mutation state.
      </p>
      <p>
        For complex scenarios (optimistic list reordering), you may need to apply the same transformation to
        the canonical cache in the update function rather than relying solely on the optimistic response — this
        ensures consistency after rollback. Always show user feedback (toast/snackbar) when an optimistic
        action fails so the user understands the reversion.
      </p>

      <h3>Q3: When would you use GraphQL subscriptions vs polling, and how do you implement subscription cleanup?</h3>
      <p>
        Use subscriptions for high-frequency real-time data (chat messages, live scores, collaborative editing)
        where server-push is more efficient than repeated polling. Use polling for low-frequency updates (order
        status, build status) where a 10–30 second delay is acceptable — polling is simpler and more reliable
        under poor network conditions.
      </p>
      <p>
        Cleanup: useEffect returns a cleanup function that calls the subscription's unsubscribe method. With
        Apollo's subscribeToMore, store the returned unsubscribe function and call it in the cleanup. With
        useSubscription hook, cleanup is automatic on unmount. Failing to unsubscribe causes memory leaks
        and ghost subscriptions that continue consuming server resources.
      </p>

      <h3>Q4: Explain APQ (Automatic Persisted Queries) and when to use them.</h3>
      <p>
        APQ reduces HTTP payload by sending a SHA256 hash of the query instead of the full query text. First
        request: client sends a body with the hash and a null query field. Server looks up hash → not found → returns
        PersistedQueryNotFound error. Client retries with both hash and the full query string. Server
        registers hash → query mapping, processes, responds. Future requests send only the hash.
      </p>
      <p>
        Use APQ when: queries are large (100+ lines of fragments), request volume is high (traffic reduction
        is significant), and your CDN or server caches GET requests (APQ enables GET requests for queries, which
        are more cacheable than POST). Skip APQ for mutations (always POST, hash provides no benefit) and in
        development (complexity without gain).
      </p>

      <h3>Q5: How would you architect a GraphQL client for a dashboard with 20 components each needing different data?</h3>
      <p>
        Use fragment colocation: each component defines a fragment for its data needs. The dashboard page
        query composes all fragments. This single query fetches all data in one round-trip. Use Apollo's
        useFragment hook (Apollo 3.8+) or Relay's useFragment to pass fragment data to components — each
        component only accesses its own fragment data.
      </p>
      <p>
        For the cache policy: use cache-and-network for the main query (fast initial render from cache, then
        refresh). Set up polling every 30 seconds for dashboard metrics that change frequently. Use subscriptions
        only for truly real-time components (live activity feed, notifications). Add a "Refresh" button that
        calls client.refetchQueries(&#123;include: ["DashboardQuery"]&#125;) for user-triggered updates. Generate
        TypeScript types with graphql-codegen — each component gets a typed fragment type, preventing runtime
        shape mismatches.
      </p>

      <h3>Q6: How do you prevent GraphQL from becoming a performance problem at scale?</h3>
      <p>
        Server-side: (1) Query complexity analysis — reject queries above a cost threshold to prevent O(n^k)
        queries. (2) DataLoader for all resolver-level data fetching — batch and cache per-request. (3) Query
        depth limiting — reject queries nested beyond a maximum depth. (4) Persisted queries in production —
        only allow pre-registered query hashes, rejecting arbitrary queries (prevents exploration and abuse).
        (5) Response caching: cache identical query results (same variables) at the API gateway level using
        the query hash as cache key.
      </p>
      <p>
        Client-side: (1) Fragment colocation prevents over-fetching — each component requests only what it needs.
        (2) Cache policies match data freshness requirements — avoid network-only for static data. (3) Pagination
        with cursor-based relay spec — never fetch entire lists. (4) Subscription multiplexing — share one
        WebSocket connection across all subscriptions. (5) APQ reduces payload size for high-traffic queries.
        (6) Defer low-priority fields using @defer — render the critical path immediately, stream the rest.
      </p>
    </ArticleLayout>
  );
}
