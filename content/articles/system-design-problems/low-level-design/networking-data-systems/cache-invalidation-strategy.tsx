"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-cache-invalidation-strategy",
  title: "Cache Invalidation Strategy (After Mutations)",
  description: "Production-grade cache invalidation strategies for keeping frontend cache fresh after mutations with dependency tracking, selective invalidation, and race condition handling.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "cache-invalidation-strategy",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "caching", "invalidation", "mutations", "frontend", "data-consistency"],
  relatedTopics: ["frontend-caching-layer", "optimistic-ui-system", "request-deduplication-system", "data-fetching-hook"],
};

export default function CacheInvalidationStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Frontend caches improve performance by storing frequently accessed data in memory. But caches create a freshness problem: when the user mutates data (creates a post, edits a comment, deletes a user), the cached copy becomes stale. If the app serves stale data from cache, users see incorrect information until the cache expires. Consider a real scenario: user views a list of posts (cached for 5 minutes). Then creates a new post. The list cache still shows old posts (new post missing). User thinks it didn't work, refreshes, finally sees new post. Bad UX.
        </p>
        <p>
          The challenge is invalidating just the right cache entries without over-invalidating (clearing the entire cache = losing performance benefits). Key challenges: (1) Knowing which cache entries to invalidate (which queries depend on the mutated entity?), (2) Timing (invalidate before, after, or during mutation?), (3) Race conditions (mutation in flight, response arrives out of order), (4) Cascading invalidations (user edit invalidates user-detail AND user-list AND organization-members if user is in an org), (5) Stale data during refetch (user sees "loading" spinner while waiting for refetch).
        </p>
        <p>
          Naive approaches: (1) Clear entire cache on any mutation—correct but kills performance (lose all cached data). (2) Never invalidate, trust TTL—wrong (stale data too long). (3) Manual invalidation everywhere—brittle (easy to forget to invalidate related queries). Better approach: dependency mapping (mutation type → affected cache keys), selective invalidation (clear only affected entries), automatic refetching (reload invalidated data), and cascading invalidation (mark related entries as stale).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Cache layer exists (React Query, SWR, custom). Mutations change server state. Frontend cache must stay fresh (~seconds lag acceptable). Query dependencies can be determined (mutation type → cache keys). Refetching is cheap enough to do on every mutation. Backend is source of truth.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Selective Invalidation:</strong> Mark specific cache entries as stale (user update invalidates user-detail cache, but not posts list). Don't clear entire cache on every mutation (wasteful).</li>
          <li><strong>Dependency Tracking:</strong> Define mapping: which cache queries are affected by which mutations. Example: deleting a specific post (for example DELETE /posts/POST_ID) affects the posts list, the specific post detail view, and the list of posts for the owning user.</li>
          <li><strong>Cascading Invalidation:</strong> When post is deleted, also invalidate comment-list for that post. When user is deleted, invalidate all posts by that user. Support multi-level dependencies.</li>
          <li><strong>Invalidation Timing:</strong> Support three modes: (1) Pre-mutation (optimistic—invalidate cache before request), (2) Post-mutation (after response), (3) Conditional (only on success).</li>
          <li><strong>Automatic Refetching:</strong> After invalidating a cache entry, automatically refetch fresh data. Support configurable timing (immediate, lazy on access, batched, scheduled).</li>
          <li><strong>Manual Override:</strong> Provide API for component to manually invalidate cache (e.g., invalidateQuery('posts-list')) for complex cases not covered by rules.</li>
          <li><strong>Stale While Refetch:</strong> Mark data as stale but continue serving from cache while refetch is in-flight (improved UX). Show "updated N seconds ago" indicator.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Correctness:</strong> No stale data after mutation succeeds. If refetch fails, re-show old data with error (don't show broken cache).</li>
          <li><strong>Efficiency:</strong> Minimize unnecessary refetches. Don't invalidate unrelated queries. Batch multiple invalidations into single request.</li>
          <li><strong>Simplicity:</strong> Invalidation rules easy to understand and maintain. Clear mapping of mutations to cache keys.</li>
          <li><strong>Performance:</strong> Invalidation logic runs fast (&lt;50ms). Refetch doesn't block mutation success response.</li>
          <li><strong>Resilience:</strong> Handle race conditions (mutations arriving out of order, network failures during refetch).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Cache invalidation has three phases: dependency definition, mutation handling, and refetching.
        </p>
        <p>
          Phase 1 (Dependency Definition): Define a mapping from mutation types to affected cache queries. For example, creating a post invalidates the posts list. Updating a specific post invalidates the posts list, that post’s detail view, and the owning user’s posts list. Deleting a post invalidates the same set. This mapping can be defined declaratively (as configuration owned by the data layer) or implicitly (conventions that derive affected query families from the resource type).
        </p>
        <p>
          Phase 2 (Mutation Handling): When user submits mutation (e.g., POST /posts), system: (1) Sends request to backend. (2) Backend processes, updates database, returns response. (3) On success, lookup dependent cache queries from mapping. (4) Mark those queries as "stale". (5) Optionally trigger refetch. (6) Return mutation response to user immediately (don't wait for refetch).
        </p>
        <p>
          Phase 3 (Refetching): Stale-marked queries can be refetched in several ways: (1) Immediately after mutation (instant freshness, increased load). (2) Lazily on next access (user requests that query, it refetches). (3) Batched (combine multiple stale queries into one request). (4) Scheduled (refetch after delay so user stops interacting, less disruptive). Choose based on data criticality and expected user behavior.
        </p>
        <p>
          Optimization: "stale-while-revalidate"—serve cached data immediately while refetching in background. User sees data instantly, but it might be slightly stale. Once refetch completes, update with fresh data. This improves perceived performance.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Invalidation Strategies and Mechanisms</h3>
        <p>
          TTL-Based (Time-To-Live): Cache entry expires after a fixed duration (e.g., 5 minutes). Simple, requires no explicit invalidation logic. Con: data may be stale for up to 5 minutes. Best for non-critical data where staleness is acceptable.
        </p>
        <p>
          Event-Based (Active): Mutation triggers invalidation immediately. When POST /posts succeeds, event published ("post_created"). Subscribers listening for this event invalidate "posts-list" cache. Pro: instant freshness. Con: complex (need event system), tight coupling between mutations and cache.
        </p>
        <p>
          Timestamp-Based: Server includes timestamp in response (e.g., "last_updated: 2026-05-06T10:00Z"). Cache stores entry with timestamp. When refetching, compare: if server timestamp newer than cache timestamp, fetch fresh data. Otherwise, reuse cache. Useful for conditional requests (HTTP If-Modified-Since header).
        </p>
        <p>
          Version Numbers: Each entity has version counter (incremented on every change). Cache stores entity+version. If server version newer, data is stale. Lightweight alternative to timestamps.
        </p>
        <p>
          Subscriptions (Real-time): Client subscribes to entity changes via WebSocket or polling. Server broadcasts updates (new data, deletion). Subscribers invalidate cache immediately. Most sophisticated, enables real-time freshness. Trade: complexity, server-side subscription management, higher latency on updates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Dependency Mapping and Query Relationships</h3>
        <p>
          Manual mapping: the developer explicitly specifies which cache query families to invalidate for each mutation. The advantage is clarity and precision. The downside is operational drift: as the app evolves, it is easy to forget a related query, which produces subtle staleness bugs.
        </p>
        <p>
          Convention-based mapping: derive invalidations from the resource type and mutation shape. For example, creating an entity invalidates list queries for that entity type, while updating or deleting a specific entity invalidates both the list and the corresponding detail view. This reduces boilerplate but requires consistent naming conventions and cannot express every cross-entity dependency.
        </p>
        <p>
          Pattern matching: use prefixes or wildcard patterns to invalidate groups of related cache keys. This is flexible and compact, but can over-invalidate and increase refetch load if patterns are too broad.
        </p>
        <p>
          Nested dependencies (cascading): when a post changes, related caches may need invalidation, such as the post detail view, comment lists for that post, and feed timelines. Dependencies form a graph across entities. The system should model these relationships explicitly so it can invalidate all affected caches without relying on ad hoc guesses.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Invalidation and Mutation Response</h3>
        <p>
          Optimistic updates: When user submits mutation, immediately update UI with expected result (don't wait for server response). Example: user clicks "delete comment", comment immediately hidden in UI. Simultaneously, DELETE request sent to server. If server confirms, nothing changes (UI already updated). If server rejects (permission denied, comment already deleted), rollback UI to show original comment, display error.
        </p>
        <p>
          Optimistic cache invalidation: When mutation submitted, immediately invalidate affected cache entries (before server response). This forces refetch from server on next access. Benefits: instant freshness on success. Downside: if mutation fails, user sees refetch fail, then has to retry. Alternative: do optimistic update, defer cache invalidation until success response received.
        </p>
        <p>
          Error handling: If mutation fails, restore original cache (or skip invalidation entirely). Don't serve incorrect data to user. Display error message, let user retry.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Automatic Refetching Strategies</h3>
        <p>
          After invalidating cache entry, refresh the data. Refetching strategy depends on use case. Immediate refetch: triggers refetch right after mutation succeeds. Data is fresh quickly. Con: increased server load, user sees loading spinner. Best for critical data (user's account details, financial info).
        </p>
        <p>
          Lazy refetch: Mark cache as stale. Don't refetch immediately. Refetch only when component next accesses that query (user scrolls back, navigates to page showing that data). Reduces server load, but data stays stale briefly. Best for non-critical data.
        </p>
        <p>
          Batched refetch: Multiple mutations invalidate multiple queries. Instead of refetching each individually (N requests), batch into single request if possible (e.g., "give me users 1,2,3" instead of three separate requests). Reduces network traffic, faster.
        </p>
        <p>
          Scheduled refetch: Refetch after delay (e.g., 500ms). Useful if user is expected to perform another mutation soon (batch mutations), avoid thrashing. Or if user likely navigated away, no point refetching immediately.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cascading Invalidation and Dependency Traversal</h3>
        <p>
          When entity changes, related caches must also be invalidated. Examples: (1) Direct: user updated → invalidate user-detail cache and user-list. (2) Indirect: organization member removed → invalidate org-members-list, org-detail. (3) Transitive: post deleted → invalidate post-detail, comments-for-post, feed-timeline (because feed shows posts). Dependencies form a graph that must be traversed.
        </p>
        <p>
          Wildcard invalidation: invalidate all cache keys matching a prefix or pattern for an entity. For example, invalidating all keys that start with a user identifier can cover user detail, user posts, and user comments. This is useful when an entity has many related queries, but it can over-invalidate and increase refetch load.
        </p>
        <p>
          Depth control: Limit cascade depth. Depth 1: directly affected queries only. Depth 2: direct + one level of indirect dependencies. Example: post updated → depth 1: post-detail. Depth 2: feed-timeline (depends on posts). Depth 3: user-profile-feed (depends on timeline).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Race Conditions and Consistency</h3>
        <p>
          Concurrent mutations: User submits two mutations rapidly (click delete, then create). Both sent to server. May arrive out of order or have overlapping effects. Server must handle (typically "last-write-wins"—later mutation overwrites earlier). On frontend: both mutations submitted, both invalidate cache. If cache gets invalidated by first mutation, then refetch, result might be from second mutation. If second mutation response arrives first, cache might be out of sync with second response. Mitigation: use request ID versioning or timestamps to detect stale responses.
        </p>
        <p>
          Refetch race: Mutation invalidates cache, triggers refetch. While refetch in-flight, server updated again (another user made change). Refetch returns response from second change. This is acceptable (eventual consistency). User sees latest data.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Manual Invalidation and Override</h3>
        <p>
          For complex cases not covered by automatic rules, provide manual API: invalidateQuery('users-list') in component. Use cases: (1) Complex multi-entity updates. (2) Third-party API that affects cache (external service called). (3) Debugging—manually invalidate to force refetch. (4) Refresh button—user clicks "refresh" → calls invalidateQuery. Pro: flexible. Con: verbose, easy to forget some queries.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Caching Library Integration</h3>
        <p>
          React Query: provides a built-in invalidation mechanism. The common pattern is to invalidate the list or detail queries affected by a mutation after the mutation succeeds, and let the library refetch automatically. This works well when you maintain a clear mapping from mutations to the affected query families.
        </p>
        <p>
          SWR: supports cache mutation and refetch triggers, but offers less structured dependency mapping. Teams usually standardize conventions for which keys to revalidate after each mutation to avoid drift.
        </p>
        <p>
          Apollo GraphQL: supports manual cache updates after mutations. This provides strong control over correctness and reduces refetch volume, but increases the risk of missed updates unless you keep cache update logic disciplined and well tested.
        </p>
        <p>
          Custom cache: Implement dependency mapping, manual invalidation API, refetch logic from scratch. Most control, most complexity.
        </p>
      </section>

      <section>
        <h2>Cache Invalidation Patterns & Strategies</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/cache-invalidation-strategy.svg"
          alt="Cache invalidation strategies after mutations: write-through, write-back, event-based patterns and invalidation strategies diagram"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Invalidation Aggressiveness</h3>
        <p>
          Aggressive invalidation (invalidate many queries per mutation): Pro—safer, no stale data visible. Con—more refetches, server load, user sees loading spinners. Conservative (only directly affected queries): Pro—fewer requests, better performance. Con—risk of stale data if dependency incomplete. Sweet spot: invalidate affected + one level indirect. Adjust based on data criticality.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Automatic vs Manual Invalidation</h3>
        <p>
          Automatic rules: Pros—less repetition, scales well, maintainable. Cons—limited expressiveness, may not cover all cases. Manual (explicit per mutation): Pros—explicit, clear. Cons—verbose, error-prone. Hybrid: automatic for common cases, manual for exceptions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Refetch Timing</h3>
        <p>
          Immediate refetch: Data fresh immediately. Con—blocking, server load spike. Lazy refetch: Reduces load, brief stale window. Choice depends on data criticality.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">TTL vs Event-Based</h3>
        <p>
          TTL: Simple, fire-and-forget. Con—stale window. Event-based: Instant freshness. Con—complex, coupling. Hybrid: events for critical, TTL fallback.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Cache invalidation is critical for correctness after mutations. For staff/principal engineers, key architectural components: (1) Dependency mapping linking mutation types to affected cache queries (selective invalidation, not blanket cache clear). (2) Invalidation strategies: TTL-based (passive, simple), event-based (active, complex), timestamp/version-based (conditional refresh). (3) Cascading invalidation traversing dependency graphs to find all affected caches. (4) Refetching strategies: immediate (fresh data, high load), lazy (low load, brief stale window), batched (network-efficient), scheduled (user-aware).
        </p>
        <p>
          At scale (1M users, high mutation volume), cache invalidation impacts server load significantly. Intelligent invalidation avoids unnecessary refetches. Stale-while-revalidate pattern improves UX (instant load, background refresh). Handling race conditions (concurrent mutations, out-of-order responses) requires versioning or timestamps. Manual invalidation API essential for complex multi-entity mutations not covered by rules.
        </p>
        <p>
          Real-world systems use caching libraries (React Query, SWR, Apollo) with built-in invalidation, version-based freshness checks, subscription systems for real-time updates, and dependency graphs. Testing must cover: single mutation invalidating correct queries, cascading invalidations reaching all affected caches, race conditions (concurrent mutations), refetch failures (graceful degradation, retry logic), manual invalidation API. Trade-offs: aggressive invalidation for correctness vs conservative for performance, automatic rules for simplicity vs manual for flexibility, immediate refetch for freshness vs lazy for efficiency.
        </p>
      </section>
    </ArticleLayout>
  );
}
