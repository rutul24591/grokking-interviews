"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-client-cache-invalidation",
  title: "Design Client-Side Cache Invalidation",
  description:
    "Production-grade cache invalidation strategies — stale-while-revalidate, tag-based invalidation, time-based expiration, dependent query invalidation, and cache coherency.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "client-cache-invalidation",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "cache-invalidation",
    "stale-while-revalidate",
    "tag-based",
    "ttl",
    "cache-coherency",
    "data-fetching",
  ],
  relatedTopics: [
    "optimistic-updates-rollback",
    "derived-computed-state-performance",
    "pagination-cursors-state-merging",
  ],
};

export default function ClientCacheInvalidationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a client-side cache invalidation system for a React
          application that fetches data from APIs and caches responses to avoid
          redundant network requests. The cache must invalidate stale data
          intelligently — not too aggressively (causing unnecessary refetches)
          and not too lazily (showing stale data). The system must support
          time-based expiration (TTL), tag-based invalidation (invalidate all
          queries tagged &apos;user&apos; when user data changes), dependent query
          invalidation (invalidate comments when post changes), and
          stale-while-revalidate patterns (serve stale data immediately, refetch
          in background).
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with Zustand for state management.</li>
          <li>Application has 100+ distinct API queries cached simultaneously.</li>
          <li>Data freshness requirements vary: user profile (5 min), dashboard stats (30 sec), settings (1 hour).</li>
          <li>Mutations (create/update/delete) must invalidate related cached queries.</li>
          <li>Network is unreliable — cache must serve data even when offline if available.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cache Storage:</strong> API responses cached by query key (e.g., [&apos;user&apos;, userId]). Cache entry stores data, timestamp, tags, and TTL.</li>
          <li><strong>TTL Expiration:</strong> Each cache entry has a time-to-live. After TTL expires, data is marked stale. Next access triggers background refetch.</li>
          <li><strong>Tag-Based Invalidation:</strong> Queries are tagged with labels (e.g., &apos;user&apos;, &apos;posts&apos;, &apos;comments&apos;). Mutation can invalidate all queries with a specific tag.</li>
          <li><strong>Dependent Query Invalidation:</strong> When a query invalidates, dependent queries auto-invalidate (post change → invalidate its comments).</li>
          <li><strong>Stale-While-Revalidate:</strong> Serve stale data immediately, trigger background refetch. Consumers get stale data first, then updated data when fetch completes.</li>
          <li><strong>Manual Invalidation:</strong> Engineers can manually invalidate specific queries or tags via cache.invalidate(key) or cache.invalidateTag(tag).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cache Lookup Performance:</strong> Cache lookup is O(1) via query key hash. Tag-based invalidation is O(k) where k is queries with that tag.</li>
          <li><strong>Memory Management:</strong> Cache has max size (1000 entries). LRU eviction removes least-recently-accessed entries when full.</li>
          <li><strong>Offline Support:</strong> Stale cache data is served when offline, with a visual indicator (&quot;Showing cached data&quot;).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Query invalidated while refetch is in progress — cancel the in-progress refetch, start a fresh one.</li>
          <li>Multiple mutations invalidate the same tag simultaneously — coalesce into a single refetch, not N refetches.</li>
          <li>Cache entry expires while component is unmounted — do not refetch (no consumer to receive the data).</li>
          <li>Conflicting TTLs: same data cached by two queries with different TTLs — each query manages its own TTL independently.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The cache is a Map&lt;queryKey, CacheEntry&gt; with a tag index
          (Map&lt;tag, Set&lt;queryKey&gt;&gt;) for O(k) tag-based invalidation.
          Each cache entry stores: data, timestamp, TTL, tags, status (fresh,
          stale, fetching), and dependent query keys. On cache access, the
          entry&apos;s age is compared to its TTL. If fresh, return data. If stale,
          return stale data immediately and trigger background refetch. On
          mutation, invalidate by key or tag — mark matching entries as stale,
          which triggers refetches for any mounted consumers. Dependent queries
          are invalidated recursively via the dependency graph.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>No cache (refetch on every access):</strong> Simple but wasteful. Same data fetched multiple times per second across components. Unacceptable for apps with 100+ queries.</li>
          <li><strong>Forever cache (no invalidation):</strong> Data cached once, served forever. Stale data problem — user updates profile, other components show old profile. Only works for truly static data.</li>
          <li><strong>Global TTL (same TTL for all queries):</strong> Simple to configure but inflexible. User profile and dashboard stats have very different freshness needs. Per-query or per-tag TTL is needed.</li>
        </ul>
        <p>
          <strong>Why tag-based + TTL + SWR is optimal:</strong> TTL provides
          automatic time-based staleness detection. Tags provide semantic
          invalidation (invalidate all &apos;user&apos; data when user changes).
          Stale-while-revalidate provides instant UI (serve stale) with
          eventual freshness (background refetch). Together they cover all
          invalidation scenarios efficiently.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>Six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Cache Store (<code>lib/cache-store.ts</code>)</h4>
          <p>Map-based cache: key → CacheEntry. Stores data, timestamp, TTL, tags, status, dependents. O(1) lookup, O(1) insert, O(n) eviction scan.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Tag Index (<code>lib/tag-index.ts</code>)</h4>
          <p>Map&lt;tag, Set&lt;queryKey&gt;&gt; for O(k) tag-based invalidation. When a query is cached with tags, it&apos;s added to each tag&apos;s set. On invalidateTag, all keys in the set are marked stale.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. TTL Manager (<code>lib/ttl-manager.ts</code>)</h4>
          <p>Calculates entry age, checks freshness, schedules stale transitions. Supports per-query TTL, per-tag default TTL, and global fallback TTL.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Dependency Graph (<code>lib/dependency-graph.ts</code>)</h4>
          <p>Tracks query dependencies: post query → depends on [user]. When user invalidates, post query invalidates. Directed acyclic graph, invalidation propagates downstream.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Refetch Coalescer (<code>lib/refetch-coalescer.ts</code>)</h4>
          <p>Prevents duplicate refetches. When the same query is invalidated 5 times in 1 second (e.g., multiple tag invalidations), coalesce into a single refetch request.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. LRU Evictor (<code>lib/lru-evictor.ts</code>)</h4>
          <p>Tracks access order via a doubly-linked list. When cache exceeds max entries, evicts the least-recently-accessed entry. O(1) access, O(1) eviction.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/client-cache-invalidation-architecture.svg"
          alt="Cache invalidation architecture showing cache store, tag index, TTL manager, and invalidation flow"
          caption="Client-Side Cache Invalidation Architecture"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cache Lifecycle Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Query executes: check cache for key. If fresh (age &lt; TTL), return cached data. If stale or missing, fetch from API.</li>
          <li>API response cached with timestamp, TTL, and tags. Entry status: &apos;fresh&apos;.</li>
          <li>Time passes. TTL expires. Entry status transitions to &apos;stale&apos;.</li>
          <li>Next query access: stale data returned immediately (instant UI). Background refetch triggered.</li>
          <li>Refetch completes: cache updated with new data, status back to &apos;fresh&apos;, consumers notified of update.</li>
          <li>Mutation occurs: cache.invalidateTag(&apos;user&apos;) marks all user-tagged entries stale. Mounted consumers refetch.</li>
          <li>Cache reaches max size: LRU evictor removes oldest entry.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Edge Cases</h2>
        <ul className="space-y-3">
          <li><strong>Invalidate during refetch:</strong> Query is refetching, gets invalidated again. Cancel in-progress fetch via AbortController, start fresh fetch. Prevents stale response from overwriting newer invalidation intent.</li>
          <li><strong>Coalesced tag invalidation:</strong> Three mutations invalidate &apos;user&apos; tag within 500ms. Refetch coalescer detects duplicate refetch requests for the same queries, executes only one refetch per unique query key.</li>
          <li><strong>Unmounted consumer:</strong> Stale entry has no mounted consumers. Do not refetch — no one needs the data. Refetch only when a consumer mounts and requests the stale data.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete implementation: cache store with TTL, tag index for
            semantic invalidation, dependency graph for cascade invalidation,
            refetch coalescer, LRU evictor, and React hook with SWR pattern.
          </p>
        </div>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Complexity Table</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Cache lookup</td><td className="p-2">O(1) — Map get</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Tag invalidation</td><td className="p-2">O(k) — k tagged queries</td><td className="p-2">O(k)</td></tr>
              <tr><td className="p-2">Dependency cascade</td><td className="p-2">O(d) — d dependent queries</td><td className="p-2">O(d)</td></tr>
              <tr><td className="p-2">LRU eviction</td><td className="p-2">O(1)</td><td className="p-2">O(1)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security &amp; Testing</h2>
        <p>Cache entries never store sensitive data (tokens, PII). Cache is in-memory only — not persisted to localStorage. Test: TTL expiration, tag invalidation cascade, LRU eviction under pressure, offline cache serving, refetch coalescing.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No invalidation strategy:</strong> Candidates cache data but don&apos;t define when it becomes stale. Interviewers expect TTL + tag-based invalidation.</li>
          <li><strong>Refetch storms:</strong> Invalidating a tag triggers N simultaneous refetches for the same query (from multiple components). Coalescing is expected.</li>
          <li><strong>Refetching unmounted data:</strong> Refetching cache entries with no mounted consumers wastes bandwidth. Only refetch when a consumer mounts.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache invalidation for paginated data?</p>
            <p className="mt-2 text-sm">
              A: Tag all pages with the same tag (e.g., &apos;posts-page-1&apos;,
              &apos;posts-page-2&apos; all tagged &apos;posts&apos;). When a post is
              created/updated, invalidate the &apos;posts&apos; tag — all pages
              refetch. Alternatively, use cursor-based pagination where the cache
              key is the cursor, and invalidation resets the cursor to refetch from
              the beginning.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist cache across page reloads?</p>
            <p className="mt-2 text-sm">
              A: Serialize cache entries to IndexedDB (not localStorage — size
              limits). On reload, deserialize and check TTL for each entry — fresh
              entries are usable, stale entries trigger background refetch. Handle
              version migration if the cache schema changes between deployments.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://tanstack.com/query/latest/docs/react/guides/caching" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">TanStack Query — Caching</a></li>
          <li><a href="https://www.patterns.dev/vanilla/caching-strategies/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Patterns.dev — Caching Strategies</a></li>
          <li><a href="https://web.dev/stale-while-revalidate/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Web.dev — Stale-While-Revalidate</a></li>
          <li><a href="https://swr.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">SWR — React Hooks for Data Fetching</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
