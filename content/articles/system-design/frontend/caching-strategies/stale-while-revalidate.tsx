"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-stale-while-revalidate-concise",
  title: "Stale-While-Revalidate",
  description: "Comprehensive guide to the Stale-While-Revalidate pattern covering HTTP header implementation, library patterns (SWR, React Query), and real-world usage.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "stale-while-revalidate",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "SWR", "stale-while-revalidate", "React Query", "performance"],
  relatedTopics: ["browser-caching", "memory-caching", "caching-patterns"],
};

export default function StaleWhileRevalidateConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Stale-While-Revalidate (SWR)</strong> is a cache invalidation strategy defined in{" "}
          <strong>RFC 5861</strong> (2010) that allows a cache to immediately serve a stale response while
          simultaneously revalidating that response in the background. The fundamental philosophy is{" "}
          <em>"show stale, fetch fresh"</em> -- the user gets instant data (even if slightly outdated), and the
          cache silently updates itself so the next request receives fresh content.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          At the HTTP level, the pattern is expressed as a <code>Cache-Control</code> directive:{" "}
          <code>Cache-Control: max-age=1, stale-while-revalidate=59</code>. This tells the browser (or CDN): for the
          first second, serve the response as fully fresh. For the next 59 seconds, you may serve the stale response
          but must revalidate in the background. After 60 seconds total, the resource is considered truly stale and a
          synchronous revalidation is required before serving.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The pattern gained broader recognition in the frontend ecosystem when Vercel released the{" "}
          <strong>SWR library</strong> (2019), a React Hooks library for data fetching named after this HTTP strategy.
          SWR, and later <strong>TanStack Query (React Query)</strong>, brought the stale-while-revalidate philosophy
          to application-level data fetching -- returning cached data instantly on component mount, then refetching in
          the background and re-rendering when fresh data arrives. This approach eliminates the blank-screen or spinner
          problem that plagues naive data-fetching patterns, dramatically improving perceived performance.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The SWR pattern bridges a critical gap: users perceive applications as fast (because they see content
          immediately), while developers maintain data accuracy (because revalidation happens transparently). It is
          a cornerstone of modern frontend architecture and a frequent topic in system design interviews,
          particularly when discussing caching layers, data freshness trade-offs, and perceived performance
          optimization.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept: SWR is a deliberate <Highlight tier="important">freshness vs latency</Highlight> trade. You serve
          cached data immediately to avoid spinners, then you revalidate in the background to converge to correctness. The
          main question is whether <Highlight tier="important">one-request staleness</Highlight> is acceptable for this data.
        </HighlightBlock>
        <p>Understanding SWR requires grasping the pattern at two distinct layers and several supporting mechanisms:</p>

        <h3>HTTP-Level Stale-While-Revalidate</h3>
        <p>
          The HTTP directive operates within the <code>Cache-Control</code> header. Consider the header{" "}
          <code>Cache-Control: max-age=1, stale-while-revalidate=59</code>. This defines three temporal windows:
        </p>
        <ul>
          <li>
            <strong>Fresh window (0-1s):</strong> The response is served directly from cache with no network
            activity. The cache considers the response authoritative.
          </li>
          <li>
            <strong>Stale-while-revalidate window (1-60s):</strong> The cache serves the stale response immediately
            but dispatches an asynchronous revalidation request to the origin. The user gets instant data; the cache
            updates in the background for the next consumer.
          </li>
          <li>
            <strong>Expired window (60s+):</strong> The cache must perform a synchronous revalidation before serving.
            The user waits for the network response, as with a standard cache miss.
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          This three-phase model is supported by all modern browsers and CDNs (Cloudflare, Fastly, Vercel Edge Network,
          AWS CloudFront). It is particularly effective for API responses, HTML pages, and any resource where
          near-instant delivery matters more than absolute freshness.
        </HighlightBlock>

        <h3>Library-Level SWR (Vercel SWR & TanStack Query)</h3>
        <HighlightBlock as="p" tier="important">
          At the application layer, libraries like <strong>Vercel SWR</strong> and <strong>TanStack Query</strong>{" "}
          implement the same philosophy using an in-memory cache keyed by request identifiers. When a component mounts
          and calls <code>useSWR(key, fetcher)</code> or <code>useQuery(&#123;queryKey, queryFn&#125;)</code>:
        </HighlightBlock>
        <ol className="space-y-2">
          <li><strong>1. Cache lookup:</strong> The library checks its in-memory cache for a value matching the key.</li>
          <li><strong>2. Return stale:</strong> If found, the cached value is returned immediately, allowing the component to render with data.</li>
          <li><strong>3. Background revalidation:</strong> A network request fires asynchronously to fetch the latest data.</li>
          <li><strong>4. Update & re-render:</strong> When the fresh response arrives, the cache is updated and the component re-renders with the new data (only if it differs).</li>
        </ol>

        <h3>Revalidation Triggers</h3>
        <HighlightBlock as="p" tier="important">
          Modern SWR libraries support multiple triggers beyond initial mount. Staff-level designs choose triggers based on
          cost and correctness: focus/reconnect are great defaults, interval polling is expensive, and mutation invalidation
          must be scoped to avoid storms.
        </HighlightBlock>
        <ul>
          <li>
            <strong>Focus revalidation:</strong> When the user returns to the browser tab, data is refetched
            automatically. This catches updates the user missed while the tab was backgrounded.
          </li>
          <li>
            <strong>Reconnect revalidation:</strong> When network connectivity is restored after an offline period,
            all active queries revalidate to sync with the server.
          </li>
          <li>
            <strong>Interval revalidation:</strong> Configurable polling intervals (e.g., every 30 seconds) for
            data that changes frequently, such as stock prices or notification counts.
          </li>
          <li>
            <strong>Mutation-triggered revalidation:</strong> After a write operation (POST, PUT, DELETE), related
            queries are automatically invalidated and refetched to reflect the new server state.
          </li>
        </ul>

        <h3>Optimistic Updates</h3>
        <p>
          SWR libraries enable <strong>optimistic updates</strong>, where the UI is updated immediately with the
          expected result of a mutation before the server confirms it. If the server rejects the mutation, the cache
          rolls back to the previous value. This combines the SWR pattern with speculative execution: the user sees
          instant feedback, and correctness is guaranteed by the subsequent revalidation. The pattern is critical for
          building responsive interfaces -- a "like" button that increments instantly rather than waiting 200ms for
          a round trip.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Architecture: the UI reads from cache immediately (serve-stale), while a background fetch updates the cache (revalidate).
          Your system design answer should mention consistency window, dedupe, and how you avoid stale data being used in
          correctness-critical flows.
        </HighlightBlock>
        <p>The SWR pattern follows a two-phase architecture that prioritizes perceived speed over absolute freshness:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Phase 1: Serve Stale (Instant)</h3>
          <ol className="space-y-3">
            <li><strong>1. Request arrives:</strong> Component mounts or user navigates to a page requiring data.</li>
            <li><strong>2. Cache check:</strong> The SWR layer checks its cache (HTTP cache, in-memory store, or both).</li>
            <li><strong>3. Stale hit:</strong> Cached data exists but may be outdated. It is returned immediately.</li>
            <li><strong>4. Render with data:</strong> The component renders with cached data. No loading spinner. No blank screen. The user perceives the app as instant.</li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Phase 2: Revalidate in Background</h3>
          <ol className="space-y-3">
            <li><strong>5. Background fetch:</strong> Simultaneously, a network request is sent to the origin server.</li>
            <li><strong>6. Server responds:</strong> The origin returns the latest data.</li>
            <li><strong>7. Diff check:</strong> The library compares the fresh response with the cached value.</li>
            <li><strong>8. Conditional update:</strong> If data differs, the cache is updated and the component re-renders silently. If identical, no re-render occurs.</li>
            <li><strong>9. Next request:</strong> Subsequent requests receive the now-fresh cached data.</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/swr-flow.svg"
          alt="Stale-While-Revalidate Flow Diagram"
          caption="SWR two-phase flow: stale data is served instantly while a background revalidation updates the cache for subsequent requests"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          The critical architectural insight is that the user never waits for the network. The cache acts as a buffer
          that absorbs latency, while background revalidation ensures eventual consistency. This is fundamentally
          different from a cache-first strategy (which never revalidates) or a network-first strategy (which always
          blocks on the network).
        </HighlightBlock>

        <h3>HTTP-Level Timeline</h3>
        <HighlightBlock as="p" tier="important">
          At the HTTP layer, the timeline is governed by the <code>max-age</code> and{" "}
          <code>stale-while-revalidate</code> directives. The diagram below illustrates how requests are handled
          at different points in the resource lifecycle.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/swr-timeline.svg"
          alt="SWR Cache Timeline Diagram"
          caption="HTTP Cache-Control timeline showing fresh, stale-while-revalidate, and expired windows with request behavior at each phase"
          captionTier="important"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <HighlightBlock as="p" tier="crucial">
          Understanding how SWR compares to other caching strategies is essential for making informed architectural
          decisions. Each strategy makes a different trade-off between speed, freshness, complexity, and reliability.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The key design work is bounding the staleness window. For correctness-critical data (auth, inventory, money),
          SWR is the wrong strategy. For feeds/dashboards, SWR is often ideal as long as you have clear refresh triggers
          and backoff/error handling during revalidation.
        </HighlightBlock>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Stale-While-Revalidate</th>
              <th className="p-3 text-left">Cache-First</th>
              <th className="p-3 text-left">Network-First</th>
              <th className="p-3 text-left">No Cache</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Speed</strong></td>
              <td className="p-3">Instant (cache hit) + background update</td>
              <td className="p-3">Instant (cache hit), slow on miss</td>
              <td className="p-3">Slow (always waits for network)</td>
              <td className="p-3">Slowest (always full round trip)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Freshness</strong></td>
              <td className="p-3">Eventually consistent; stale for one render cycle</td>
              <td className="p-3">Potentially very stale; no automatic refresh</td>
              <td className="p-3">Always fresh (network response used)</td>
              <td className="p-3">Always fresh</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">Moderate (cache management + revalidation logic)</td>
              <td className="p-3">Low (simple cache lookup)</td>
              <td className="p-3">Moderate (fallback logic needed)</td>
              <td className="p-3">Minimal (no cache layer)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Offline Support</strong></td>
              <td className="p-3">Good (serves stale data when offline)</td>
              <td className="p-3">Excellent (always serves from cache)</td>
              <td className="p-3">Good (falls back to cache)</td>
              <td className="p-3">None (fails without network)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>UX Quality</strong></td>
              <td className="p-3">Excellent -- no spinners, data appears instantly, updates silently</td>
              <td className="p-3">Good on hit, poor on miss (loading state)</td>
              <td className="p-3">Poor (user always sees loading state)</td>
              <td className="p-3">Poor (loading state on every request)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">Dashboards, feeds, listings, profiles</td>
              <td className="p-3">Static assets, rarely changing data</td>
              <td className="p-3">Financial data, critical freshness</td>
              <td className="p-3">Auth tokens, one-time data</td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/swr-vs-cache-first.svg"
          alt="SWR vs Cache-First vs Network-First Comparison"
          caption="Side-by-side comparison of caching strategy request flows: SWR serves cache + background fetch, Cache-First serves cache only, Network-First always tries network"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          The key insight is that SWR occupies a sweet spot: it provides the speed of cache-first with the
          freshness guarantees of network-first. The trade-off is that users may briefly see stale data for one
          render cycle. For most applications, this is an acceptable -- and even imperceptible -- compromise.
        </HighlightBlock>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: choose a bounded stale window per data class, dedupe concurrent requests, keep stale data on
          revalidation errors, and make cache keys deterministic. Pair SWR reads with optimistic mutations + scoped invalidation.
        </HighlightBlock>
        <p>To maximize the effectiveness of the SWR pattern in production systems:</p>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Choose appropriate stale windows:</strong> Set <code>stale-while-revalidate</code> duration based
            on your data's volatility. User profiles might tolerate 5 minutes of staleness; stock tickers need
            seconds. The <code>max-age</code> should be short (1-60s) so revalidation triggers quickly, while the
            stale window can be much longer (minutes to hours).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Deduplicate concurrent requests:</strong> Both Vercel SWR and TanStack Query automatically
            deduplicate identical requests made within a short window. If 10 components request the same key
            simultaneously, only one network request fires. Ensure your custom implementations do the same.
          </HighlightBlock>
          <li>
            <strong>Use structural sharing for re-render optimization:</strong> TanStack Query uses structural sharing
            by default -- if only part of the response changes, unchanged object references are preserved, preventing
            unnecessary re-renders in consumers that depend on stable references.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Implement error recovery gracefully:</strong> When background revalidation fails, keep serving
            the stale data and retry with exponential backoff. Never discard valid cached data because a revalidation
            attempt failed. Surface errors only if the user explicitly requested a refresh.
          </HighlightBlock>
          <li>
            <strong>Pair with optimistic updates for mutations:</strong> Use SWR for reads and optimistic updates for
            writes. Update the cache immediately on mutation, then let revalidation confirm or rollback. This
            eliminates perceived latency for both reads and writes.
          </li>
          <li>
            <strong>Configure revalidation triggers thoughtfully:</strong> Enable focus revalidation for data that
            changes externally (notifications, collaborative edits). Disable it for stable data to avoid unnecessary
            network requests. Use interval revalidation sparingly -- only for data that must stay within seconds of
            freshness.
          </li>
          <li>
            <strong>Layer HTTP and application caching:</strong> Use HTTP <code>stale-while-revalidate</code> headers
            for CDN-level caching and a library like SWR or React Query for application-level caching. The two
            layers complement each other: the CDN reduces origin load, while the library eliminates per-component
            loading states.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Set appropriate cache keys:</strong> Cache keys should be deterministic and include all variables
            that affect the response -- endpoint, query parameters, pagination cursors, user locale. Avoid
            including volatile data (timestamps, random values) in keys, as this defeats caching.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Pitfall pattern: SWR can hide correctness problems. The risks are serving stale data too long, letting cache keys
          collide (privacy bugs), and race conditions where older responses overwrite newer ones.
        </HighlightBlock>
        <p>Avoid these frequent mistakes when implementing the SWR pattern:</p>
        <ul className="space-y-3">
          <li>
            <strong>Infinite revalidation loops:</strong> Mutations that trigger revalidation, which triggers another
            mutation, creating an infinite cycle. Guard against this by ensuring mutation callbacks do not
            unconditionally invalidate queries that trigger further mutations. Use specific invalidation keys rather
            than broad wildcard invalidations.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Stale data displayed too long:</strong> Setting excessively long stale windows (hours or days)
            without visual indicators. Users may act on outdated information -- for example, adding an
            out-of-stock item to a cart. Mitigate by showing a subtle "updating..." indicator during revalidation
            for time-sensitive data, or by reducing the stale window.
          </HighlightBlock>
          <li>
            <strong>Ignoring error states during revalidation:</strong> Silently swallowing network errors during
            background revalidation and continuing to serve increasingly stale data without informing the user.
            Track revalidation failures with an error count; after N consecutive failures, show a non-intrusive
            banner indicating the data may be outdated.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Cache key collisions:</strong> Using overly generic cache keys (e.g., <code>/api/users</code>)
            when responses vary by query parameters, auth tokens, or locale. Two different users sharing a cache key
            may see each other's data. Always include differentiating factors in cache keys.
          </HighlightBlock>
          <li>
            <strong>Memory leaks from unbounded caches:</strong> Not setting a maximum cache size or TTL for cache
            eviction. In long-lived SPAs, the in-memory cache can grow unboundedly as users navigate through
            hundreds of pages. Configure <code>cacheTime</code> (TanStack Query) or implement LRU eviction.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Race conditions between revalidations:</strong> When multiple revalidation requests are in
            flight simultaneously (e.g., rapid navigation), an older response may arrive after a newer one and
            overwrite the cache with outdated data. Libraries handle this with request IDs or timestamps -- ensure
            your custom implementations do the same.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Using SWR for data requiring strict consistency:</strong> Applying the SWR pattern to financial
            transactions, inventory counts, or collaborative editing where even momentarily stale data causes
            incorrect behavior. These use cases require network-first or real-time (WebSocket) strategies.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases: SWR is ideal when users value instant UI over perfect freshness, and you can tolerate a bounded
          staleness window. It pairs well with feeds, dashboards, and listings, and poorly with auth, money, and inventory.
        </HighlightBlock>
        <p>The SWR pattern excels in scenarios where perceived speed matters more than absolute freshness:</p>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>News Feeds & Social Media:</strong> Twitter/X timelines, Reddit feeds, and news aggregators
            show cached content instantly on app open, then silently prepend new items. Users see content within
            milliseconds; new posts appear as a "N new posts" banner. The slight staleness (seconds to minutes)
            is imperceptible and acceptable.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Dashboards & Analytics:</strong> Admin dashboards displaying metrics, charts, and KPIs. Showing
            yesterday's cached metrics instantly while fetching today's numbers in the background is far better than
            a 3-second loading spinner. The Vercel Dashboard, Datadog, and Grafana all use this pattern.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>E-commerce Product Listings:</strong> Category pages and search results where product titles,
            images, and prices rarely change within minutes. Serving cached listings instantly improves conversion
            rates. Price-sensitive data (cart totals, checkout) should use stricter strategies.
          </HighlightBlock>
          <li>
            <strong>User Profiles & Settings:</strong> Profile pages, account settings, and preference panels where
            data changes infrequently. The cached version is correct 99% of the time; background revalidation
            catches the rare update.
          </li>
          <li>
            <strong>CMS-Driven Content:</strong> Blog posts, documentation pages, and marketing content served
            through a headless CMS. Combining ISR (Incremental Static Regeneration) with SWR at the CDN edge
            delivers sub-50ms responses with automatic freshness.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use SWR</h3>
          <p>The SWR pattern is inappropriate for:</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>Financial transactions:</strong> Bank balances, payment processing, and trading platforms
              where showing a stale balance could lead to overdrafts or incorrect trades.
            </li>
            <li>
              <strong>Real-time collaboration:</strong> Google Docs-style collaborative editing where all
              participants must see the same state simultaneously. Use WebSockets or CRDTs instead.
            </li>
            <li>
              <strong>Inventory management:</strong> Showing stale stock counts can lead to overselling. The
              last-available-item scenario requires strict consistency.
            </li>
            <li>
              <strong>Authentication & authorization:</strong> Serving cached permission data could grant access
              to resources the user no longer has permission to view. Auth checks must always hit the server.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: explain SWR at HTTP vs library layer, name the explicit staleness window, and justify when it is
          acceptable. Strong answers mention cache key design, race prevention (request IDs), and why SWR is wrong for auth/money/inventory.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          High-signal phrase: &quot;serve stale immediately, revalidate in background, and converge to correctness&quot;.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Also mention layering: SWR can sit on top of HTTP cache and CDN SWR directives, so you need to avoid double-caching
          surprises and measure field behavior (p75 freshness, error rates, and revalidation latency).
        </HighlightBlock>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Explain the stale-while-revalidate pattern. How does it differ at the HTTP level vs. library level?</p>
            <p className="mt-2 text-sm">
              A: At the HTTP level, <code>stale-while-revalidate</code> is a <code>Cache-Control</code> directive
              (RFC 5861) that allows browsers and CDNs to serve expired responses immediately while asynchronously
              revalidating with the origin. It operates on the full HTTP response and is transparent to application
              code. At the library level (Vercel SWR, TanStack Query), the same philosophy is applied to
              application data: cached data is returned instantly from an in-memory store, and a background fetch
              updates the cache. The library version adds features absent from HTTP -- automatic request
              deduplication, focus/reconnect revalidation, optimistic mutations, and component-level cache
              invalidation. The HTTP directive reduces origin load and CDN latency; the library pattern eliminates
              loading spinners in the UI. In production, you typically use both layers together.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the risks of using SWR for critical data? How would you mitigate them?</p>
            <p className="mt-2 text-sm">
              A: The primary risk is serving outdated data during the revalidation window. For an e-commerce cart,
              this could mean showing a price that has since changed; for a banking app, showing a balance that does
              not reflect a recent transaction. Mitigation strategies include: (1) reducing the stale window to
              seconds for volatile data, (2) using network-first or real-time strategies (WebSockets) for
              strictly-consistent data, (3) showing visual indicators during revalidation ("Updating..."), (4)
              implementing version checks where the server returns a version number and the client discards stale
              responses with older versions, and (5) using optimistic locking on mutations to detect conflicts.
              The general rule: use SWR for read-heavy, eventually-consistent data; use strict strategies for
              transactional or safety-critical data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design a data-fetching layer using SWR for a large-scale dashboard application?</p>
            <p className="mt-2 text-sm">
              A: I would layer the caching: (1) CDN-level <code>stale-while-revalidate</code> headers on API
              responses with short <code>max-age</code> (5-30s) and longer stale windows (5-15 minutes), reducing
              origin load. (2) Application-level caching with TanStack Query, using query keys that encode the
              dashboard context (team ID, date range, metric type). (3) Focus revalidation enabled so returning
              users see fresh data. (4) Interval revalidation (30-60s) for live metrics widgets. (5) Mutation
              invalidation: when a user changes a filter or performs an action, invalidate only affected query keys
              rather than the entire cache. (6) Prefetching: when the user hovers over a tab, prefetch that
              tab's data so it renders instantly on click. (7) Error resilience: on revalidation failure, keep
              serving stale data with a "Last updated X minutes ago" timestamp. (8) Cache garbage collection:
              set <code>gcTime</code> to 10-15 minutes to prevent memory growth in long-lived sessions. This
              architecture delivers sub-100ms perceived load times while keeping data within minutes of freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc5861" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 5861 - HTTP Cache-Control Extensions for Stale Content
            </a>
          </li>
          <li>
            <a href="https://swr.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vercel SWR - React Hooks for Data Fetching
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/query/latest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query) - Powerful Asynchronous State Management
            </a>
          </li>
          <li>
            <a href="https://web.dev/stale-while-revalidate/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Keeping Things Fresh with stale-while-revalidate
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN - Cache-Control Header Reference
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
