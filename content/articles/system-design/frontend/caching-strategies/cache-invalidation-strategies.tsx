"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cache-invalidation-strategies-concise",
  title: "Cache Invalidation Strategies",
  description: "Deep dive into cache invalidation strategies including TTL-based, event-driven, versioned URLs, tag-based invalidation, and maintaining cache consistency.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "cache-invalidation-strategies",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "cache invalidation", "TTL", "versioning", "consistency"],
  relatedTopics: ["browser-caching", "cdn-caching", "stale-while-revalidate"],
};

export default function CacheInvalidationStrategiesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Phil Karlton famously stated: <em>"There are only two hard things in Computer Science: cache invalidation
          and naming things."</em> While caching itself is straightforward — store a copy of data closer to the
          consumer — knowing <strong>when</strong> and <strong>how</strong> to discard or refresh that copy is the
          genuinely difficult engineering problem. Cache invalidation is the process of determining when cached data
          is no longer valid and must be refreshed, purged, or replaced with up-to-date information.
        </p>
        <p>
          The fundamental challenge arises from a distributed-systems truth: there is no reliable, zero-latency
          channel between the authoritative data source and every cache that holds a copy. Between the moment data
          changes at the origin and the moment every consumer sees the new value, there is an unavoidable window of
          inconsistency. Making that window as small as possible — without crushing performance — is what cache
          invalidation strategy selection is about.
        </p>
        <p>
          On the frontend, this problem surfaces across multiple layers: in-memory state caches (React Query, SWR,
          Redux), browser HTTP caches (controlled via Cache-Control headers), service worker caches (Cache API),
          and CDN edge caches. Each layer has different eviction semantics, different propagation latencies, and
          different blast radii when invalidation goes wrong. A staff-level engineer must reason about the
          interaction of all these layers simultaneously — a stale CDN edge response can poison a perfectly fresh
          client-side cache, and vice versa.
        </p>
        <p>
          The cost of getting invalidation wrong is asymmetric. Invalidating too aggressively wastes bandwidth and
          origin capacity (essentially defeating the cache). Invalidating too lazily serves stale data, which can
          cause anything from a mildly outdated price display to a catastrophic double-spend in financial systems.
          The right strategy depends on the consistency requirements of the specific data domain, the scale of the
          system, and the cost tolerance for staleness.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Cache invalidation strategies fall into several distinct categories, each offering different trade-offs
          between freshness, complexity, and performance. Understanding these categories and their precise semantics
          is essential for designing effective caching architectures.
        </p>

        <h3>TTL-Based Invalidation (Time-to-Live)</h3>
        <p>
          The simplest strategy: every cached entry carries a timestamp or countdown. When the TTL expires, the
          entry is considered stale and must be revalidated or evicted. HTTP's <code>Cache-Control: max-age=3600</code>
          is the canonical example — the browser treats the response as fresh for 3600 seconds, then makes a
          conditional request (If-None-Match / If-Modified-Since) to the origin.
        </p>
        <p>
          TTL is easy to implement and reason about, but it has an inherent trade-off: short TTLs reduce staleness
          but increase origin load, while long TTLs improve performance but increase the staleness window. For data
          that changes unpredictably, there is no "correct" TTL — it is always a compromise. The <code>stale-while-revalidate</code>
          directive softens the blow by allowing the cache to serve the stale entry while fetching a fresh one in
          the background, but it does not eliminate the staleness window entirely.
        </p>

        <h3>Event-Driven Invalidation (Push Model)</h3>
        <p>
          Instead of waiting for a timer to expire, the origin actively notifies caches when data changes. This
          push model uses mechanisms such as webhooks, WebSocket messages, Server-Sent Events, or pub/sub systems
          (Redis Pub/Sub, Kafka) to trigger invalidation. When a product price changes in the database, the
          backend publishes an event, and every cache layer that subscribes to that event purges or updates the
          corresponding entry.
        </p>
        <p>
          Event-driven invalidation dramatically reduces the staleness window — ideally to network propagation
          latency only. However, it introduces significant complexity: you need reliable message delivery (what
          happens if a WebSocket disconnects?), idempotent invalidation handlers (duplicate events must not
          cause errors), and fan-out management at scale (invalidating a popular resource across thousands of
          edge nodes is non-trivial). It also creates a coupling between the write path and the cache layer,
          which can become a bottleneck or single point of failure.
        </p>

        <h3>Versioned URLs (Content-Addressable Caching)</h3>
        <p>
          Rather than invalidating a cache entry, you avoid the problem entirely by never reusing the same URL
          for different content. Build tools like webpack, Vite, and esbuild append content hashes to filenames:
          <code>main.a1b2c3d4.js</code>. When the file contents change, the hash changes, producing a new URL.
          The old URL remains valid (and cached) forever, while the new URL is fetched fresh. The HTML document
          that references these assets is served with <code>no-cache</code> so it always gets the latest asset
          references.
        </p>
        <p>
          This is the gold standard for static assets because it provides perfect cache consistency with
          aggressive caching (<code>max-age=31536000, immutable</code>). The trade-off is that it only works for
          content where the referencing document can be updated to point to the new version — it does not work
          for API responses or any URL whose path is semantically meaningful to the client.
        </p>

        <h3>Tag-Based Invalidation (Surrogate Keys)</h3>
        <p>
          CDN providers (Fastly, Cloudflare, Akamai) support tagging cached responses with one or more surrogate
          keys. When you need to invalidate, you send a purge request for a specific tag, and all responses
          tagged with that key are evicted across every edge node. For example, tagging all product detail pages
          with <code>product-123</code> allows invalidating every cached variant (different Accept-Language,
          Accept-Encoding combinations) of that product with a single API call.
        </p>
        <p>
          Tag-based invalidation is powerful for complex content hierarchies. A blog post page might carry tags
          for the post itself, the author, the category, and a global "site-redesign" tag. Updating the author's
          bio triggers invalidation of all posts by that author without touching unrelated content. The
          limitation is vendor-specificity — surrogate key formats and purge APIs differ across CDN providers,
          creating lock-in risk.
        </p>

        <h3>Write-Through and Write-Behind Invalidation</h3>
        <p>
          <strong>Write-through</strong> caching writes to both the cache and the origin simultaneously, ensuring
          consistency at the cost of write latency. <strong>Write-behind</strong> (write-back) caching writes to
          the cache first and asynchronously propagates to the origin, offering lower write latency but risking
          data loss if the cache fails before propagation. On the frontend, write-through is analogous to
          optimistic updates in React Query where the cache is updated immediately but the mutation is also sent
          to the server, with rollback logic if the server rejects it.
        </p>

        <h3>Purge vs. Soft Purge</h3>
        <p>
          A <strong>hard purge</strong> removes the cache entry entirely, forcing the next request to fetch from
          origin. A <strong>soft purge</strong> (or "mark stale") keeps the entry but marks it as stale, allowing
          the cache to serve it while revalidating in the background. Soft purges are safer at scale because they
          prevent thundering herd problems — if a popular resource is hard-purged across all edge nodes
          simultaneously, the origin can be overwhelmed by concurrent refetch requests.
        </p>

        <h3>Cache-Control Directives: Precision Matters</h3>
        <p>
          The semantics of HTTP cache directives are frequently misunderstood. <code>max-age=0</code> means the
          response is immediately stale but may still be served while revalidating.
          <code>no-cache</code> means the response must be revalidated with the origin before every use (but can
          still be stored). <code>no-store</code> means the response must never be stored at all — not in any
          cache layer. Confusing these leads to either serving stale sensitive data (using <code>no-cache</code>
          when <code>no-store</code> was needed) or killing cache performance (using <code>no-store</code> for
          public data that simply needed short TTLs).
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Choosing an invalidation strategy is not a binary decision — production systems combine multiple
          strategies across different cache layers. The architecture must account for propagation delays between
          layers, race conditions between concurrent reads and writes, and graceful degradation when invalidation
          channels fail.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/invalidation-strategies.svg"
          alt="Four Cache Invalidation Strategies Comparison"
          caption="Comparison of four primary invalidation strategies: TTL-based, Event-driven, Versioned URLs, and Tag-based — each with distinct trade-offs"
        />

        <h3>Push vs. Pull Invalidation Models</h3>
        <p>
          <strong>Pull-based (TTL/polling)</strong> models are simple but inherently reactive — the cache does not
          know about changes until it checks. This creates a bounded staleness window equal to the TTL or polling
          interval. Pull models scale well because the origin does not need to know about its caches, but they
          waste bandwidth when data has not changed (unnecessary revalidation requests) and serve stale data when
          it has (until the next check).
        </p>
        <p>
          <strong>Push-based (event-driven)</strong> models are proactive — the origin announces changes as they
          happen. This minimizes staleness but requires the origin to maintain awareness of cache subscribers,
          introduces message delivery reliability concerns, and can create write amplification (a single data
          change triggers O(N) invalidation messages where N is the number of cache nodes). In practice, hybrid
          approaches dominate: use push invalidation for high-value or frequently-changing data, and TTL-based
          expiry as a safety net for everything else.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/ttl-vs-event.svg"
          alt="TTL vs Event-Driven Invalidation Timeline"
          caption="Timeline comparison: TTL-based invalidation has a staleness window between data change and cache expiry, while event-driven achieves near-instant freshness"
        />

        <h3>Multi-Layer Invalidation Propagation</h3>
        <p>
          In a modern frontend architecture, a single piece of data may be cached in four or more layers:
          the in-memory application cache (React Query/SWR), the browser HTTP cache, a service worker cache,
          and one or more CDN edge caches. Invalidation must propagate through all of these layers, and the
          ordering matters.
        </p>
        <p>
          Consider a product price update. The origin database is updated first. The CDN must then be purged
          (via tag-based API call). The browser's HTTP cache might still hold the old response — it will
          continue serving it until its max-age expires or the page is reloaded. The React Query cache might
          hold the old data in memory until the component refetches. Each layer has different invalidation
          mechanisms and different latencies, creating potential for inconsistency between what the user sees
          and what the origin holds.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/cache-consistency.svg"
          alt="Multi-Layer Cache Consistency Challenges"
          caption="Cache invalidation must propagate through Browser, CDN Edge, and Origin layers — race conditions and ordering issues can cause inconsistency"
        />

        <p>
          A robust architecture addresses this with layered invalidation: the CDN is purged via API immediately
          after the write, the browser cache is bypassed by setting short TTLs on dynamic data (or using
          <code>stale-while-revalidate</code>), and the application-level cache is invalidated via WebSocket
          events or by polling with a version check. The key insight is that each layer should have a fallback
          invalidation mechanism — even if the push notification fails, the TTL will eventually expire.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">TTL-Based</th>
              <th className="p-3 text-left">Event-Driven</th>
              <th className="p-3 text-left">Versioned URLs</th>
              <th className="p-3 text-left">Tag-Based</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Freshness Guarantee</strong></td>
              <td className="p-3">Bounded by TTL — stale data possible within the window</td>
              <td className="p-3">Near real-time — stale only during propagation latency</td>
              <td className="p-3">Perfect — new content always has a new URL</td>
              <td className="p-3">Near real-time — depends on CDN purge propagation speed</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">Low — set a header and forget</td>
              <td className="p-3">High — requires event bus, reliable delivery, reconnection logic</td>
              <td className="p-3">Medium — requires build tooling and asset pipeline integration</td>
              <td className="p-3">Medium — requires CDN vendor integration and tag management</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Scalability</strong></td>
              <td className="p-3">Excellent — caches operate independently, no coordination needed</td>
              <td className="p-3">Moderate — O(N) fan-out per change where N is subscriber count</td>
              <td className="p-3">Excellent — completely decoupled, each URL is immutable</td>
              <td className="p-3">Good — CDN handles fan-out internally, limited by purge API rate limits</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Consistency</strong></td>
              <td className="p-3">Eventually consistent — bounded by TTL duration</td>
              <td className="p-3">Strong eventual — bounded by event delivery latency</td>
              <td className="p-3">Strongly consistent for assets — depends on HTML freshness for references</td>
              <td className="p-3">Strong eventual — bounded by purge propagation (typically {'&lt;'}5s)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Latency Impact</strong></td>
              <td className="p-3">None during TTL — revalidation request at expiry</td>
              <td className="p-3">Slight increase on write path — event must be published</td>
              <td className="p-3">None for cached assets — cold start for new versions</td>
              <td className="p-3">Purge API call latency on write path — typically 50-200ms</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">Slowly changing data, static assets, public API responses</td>
              <td className="p-3">Financial data, real-time feeds, collaborative editing</td>
              <td className="p-3">JS/CSS bundles, images, fonts — any build-time asset</td>
              <td className="p-3">CMS content, product catalogs, pages with shared components</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>These practices reflect battle-tested patterns from large-scale frontend caching systems:</p>
        <ol className="space-y-3">
          <li>
            <strong>Layer Your Invalidation:</strong> Never rely on a single mechanism. Combine push-based
            invalidation for immediate freshness with TTL-based expiry as a safety net. If the WebSocket event
            fails, the TTL ensures eventual consistency. Defense in depth applies to caching just as it does to
            security.
          </li>
          <li>
            <strong>Use Immutable URLs for Static Assets:</strong> Hash all build-time assets and serve them
            with <code>Cache-Control: max-age=31536000, immutable</code>. This eliminates the invalidation
            problem for the largest class of frontend resources. Your HTML entry point should use <code>no-cache</code>
            to always fetch the latest asset references.
          </li>
          <li>
            <strong>Prefer Soft Purges Over Hard Purges:</strong> When invalidating CDN content, use soft purges
            (mark stale) rather than hard purges (delete) for popular resources. This allows the CDN to serve the
            stale version while refetching from origin, preventing thundering herd problems that can bring down
            your origin server during traffic spikes.
          </li>
          <li>
            <strong>Invalidate Relationships, Not Just Entities:</strong> When a product's image changes,
            invalidate not only the image URL but also every page that embeds it — the product detail page, the
            category listing, the search results. Tag-based invalidation with surrogate keys makes this tractable.
            Failing to invalidate related content is the most common source of visual inconsistencies.
          </li>
          <li>
            <strong>Version Your API Responses:</strong> Include an ETag or a version number in API responses.
            Client-side caches can use this to determine staleness without downloading the full response body.
            Conditional requests (If-None-Match) turn expensive full-body fetches into lightweight 304 responses.
          </li>
          <li>
            <strong>Set Up Cache Observability:</strong> Monitor cache hit rates, staleness duration, and
            invalidation event latency. A drop in hit rate may indicate over-aggressive invalidation, while an
            increase in stale-served responses may indicate failed invalidation events. Instrument every cache
            layer with metrics (hit, miss, stale, revalidate, evict).
          </li>
          <li>
            <strong>Design for Invalidation Failure:</strong> What happens when your invalidation event bus goes
            down? If the answer is "users see stale data forever," your design is fragile. Every cache entry
            should have a maximum TTL as an upper bound, even if you normally invalidate proactively. This is
            your circuit breaker.
          </li>
          <li>
            <strong>Separate Cache Policies by Data Volatility:</strong> User profile data (changes rarely)
            should have a different caching strategy than a live sports score (changes every second). Do not
            apply a single cache policy across your entire application — segment by how frequently the data
            changes and how costly staleness is.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>These mistakes are responsible for the majority of caching incidents in production:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stale Closures in React Invalidation Handlers:</strong> When using WebSocket-based
            invalidation in React, event handlers may capture stale references to the query client or cache
            state if they are defined inside a component without proper dependency management. Always use refs
            or stable callbacks to ensure the invalidation handler references the current query client instance,
            not a stale closure from a previous render.
          </li>
          <li>
            <strong>Thundering Herd on Cache Expiry:</strong> When a popular cached resource expires (or is
            hard-purged) simultaneously across many clients, all of them send refetch requests to the origin at
            once. Mitigation strategies include jittering TTLs (add a random offset to prevent synchronized
            expiry), using stale-while-revalidate to absorb the spike, and implementing request coalescing at
            the CDN layer to collapse concurrent identical requests into one.
          </li>
          <li>
            <strong>Forgetting to Invalidate Related Data:</strong> Updating a user's avatar in the profile
            service but failing to invalidate the avatar in the comments feed cache, the chat presence cache,
            and the leaderboard cache. The user sees their new avatar on their profile but the old one everywhere
            else. Map out data dependencies before implementing invalidation — use a dependency graph to identify
            all downstream caches that reference a given entity.
          </li>
          <li>
            <strong>Using no-cache When You Mean no-store:</strong> For sensitive data (banking information,
            medical records), <code>no-cache</code> still allows the response to be stored in the cache — it
            just requires revalidation before each use. If the cache is compromised, the data is exposed. Use
            <code>no-store</code> for data that must never be persisted in any cache, and <code>private, no-cache</code>
            for data that can be stored in the browser cache but must not be stored in shared caches (CDN, proxy).
          </li>
          <li>
            <strong>Invalidating Without Warming:</strong> Purging a CDN cache for a popular resource without
            pre-warming (pre-fetching the new version) means the first user after the purge experiences a cache
            miss and slow response. For critical paths, issue a purge followed immediately by a synthetic request
            to warm the cache before real users hit it.
          </li>
          <li>
            <strong>Ignoring Browser Cache When Purging CDN:</strong> You purge the CDN, but browsers that
            loaded the page before the purge still have the old response in their HTTP cache. Until those browser
            caches expire, those users continue seeing stale data. For critical updates, combine CDN purge with
            a mechanism to signal the client (versioned API endpoints, WebSocket notifications, or a service
            worker that checks for updates).
          </li>
          <li>
            <strong>Coupling Cache Keys to Session State:</strong> Including authentication tokens or session
            IDs in cache keys for shared caches creates per-user cache entries that cannot be shared, destroying
            cache efficiency. Use the <code>Vary</code> header thoughtfully — <code>Vary: Cookie</code> on a CDN
            effectively disables caching. Separate public (cacheable) and private (per-user) content into
            different endpoints with different cache policies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Each scenario demands a different invalidation strategy based on its consistency requirements:</p>
        <ul className="space-y-3">
          <li>
            <strong>E-Commerce Product Updates:</strong> Product catalog data (titles, descriptions, images)
            changes infrequently and tolerates seconds of staleness. Use tag-based CDN invalidation with
            surrogate keys. When a merchant updates a product, the write handler purges the product tag, which
            invalidates all pages containing that product (detail page, category listings, search results). Pair
            with a 60-second TTL as a safety net.
          </li>
          <li>
            <strong>Social Media Feeds:</strong> Feed data changes constantly and user expectations for freshness
            are high but not absolute (seconds of delay are acceptable). Use TTL-based caching with short
            max-age (30-60 seconds) combined with stale-while-revalidate for the feed endpoint. For
            notifications and direct messages, use event-driven invalidation via WebSocket to provide real-time
            updates.
          </li>
          <li>
            <strong>Configuration and Feature Flags:</strong> Configuration data changes rarely but when it does,
            the change must propagate quickly (e.g., disabling a broken feature). Use event-driven invalidation
            via a pub/sub system, backed by a short TTL (5 minutes). When a flag changes, the config service
            publishes an event. Client-side, use a polling mechanism as a fallback, checking a lightweight
            version endpoint every 30 seconds.
          </li>
          <li>
            <strong>Static Assets (JS/CSS/Fonts):</strong> These never change once deployed — they are immutable.
            Use versioned URLs with content hashing and serve with <code>immutable, max-age=31536000</code>.
            Invalidation is a non-issue because the content is addressed by its hash. The HTML document that
            references them is the only thing that needs freshness management.
          </li>
          <li>
            <strong>Financial Data (Stock Prices, Account Balances):</strong> Staleness is unacceptable —
            showing an old stock price can lead to incorrect trading decisions. Use event-driven invalidation
            with WebSocket streams. Do not cache at the CDN level. Browser cache should use
            <code>no-store</code> for the most sensitive data, or very short TTLs (1-5 seconds) with
            <code>must-revalidate</code> for data where brief staleness is tolerable.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Invalidate (Let the Cache Work)</h3>
          <p>Not all data needs active invalidation. Over-invalidating is as harmful as under-invalidating:</p>
          <ul className="mt-2 space-y-2">
            <li>• <strong>Immutable historical data</strong> — past orders, completed transactions, archived logs. These never change; cache them forever.</li>
            <li>• <strong>Reference data with scheduled updates</strong> — exchange rates updated daily, weather data updated hourly. Set TTL to the update interval; no active invalidation needed.</li>
            <li>• <strong>Highly personalized data with no sharing</strong> — if the cache is per-user and the user is the one making changes, local state management (React state, Zustand) is more appropriate than a cache invalidation strategy.</li>
            <li>• <strong>Data where staleness is acceptable</strong> — analytics dashboards, reporting summaries, leaderboards updated hourly. A 5-minute TTL is simpler and cheaper than event-driven invalidation with negligible UX difference.</li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: You have a high-traffic e-commerce site. A product price changes. How do you ensure all users see the new price within 5 seconds?</p>
            <p className="mt-2 text-sm">
              A: Use a multi-layer approach. When the price updates in the database, the write handler
              immediately fires a tag-based CDN purge (soft purge) for the product's surrogate key — this
              invalidates all edge-cached pages containing that product within 1-2 seconds. For users who
              already have the page loaded, send a WebSocket event that triggers React Query's
              <code> queryClient.invalidateQueries(['product', productId])</code>, forcing a refetch of the
              product data. As a safety net, set the API response's Cache-Control to
              <code> max-age=5, stale-while-revalidate=30</code> so even if both the purge and WebSocket fail,
              no user sees data older than 5 seconds. For the brief window during propagation, accept that some
              users may see the old price — this is the unavoidable cost of distributed caching.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the thundering herd problem in cache invalidation, and how do you prevent it?</p>
            <p className="mt-2 text-sm">
              A: When a popular cache entry expires or is purged, hundreds or thousands of concurrent requests
              hit the origin simultaneously because no client has a cached copy. This can overwhelm the origin
              server. Prevention strategies: (1) <strong>Request coalescing</strong> — the CDN or a reverse
              proxy collapses concurrent identical requests into a single origin fetch and serves the response
              to all waiters. (2) <strong>Stale-while-revalidate</strong> — serve the stale entry while one
              background request fetches the fresh version. (3) <strong>TTL jittering</strong> — add a random
              offset (e.g., TTL = 3600 + random(0, 600)) so entries expire at different times across clients.
              (4) <strong>Locking/semaphore</strong> — only allow one refetch at a time per cache key, others
              wait for the result. (5) <strong>Soft purge</strong> instead of hard purge — mark as stale rather
              than delete, allowing continued serving during revalidation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design cache invalidation for a multi-region deployment where data is written in one region but cached globally?</p>
            <p className="mt-2 text-sm">
              A: The core challenge is cross-region propagation latency. When a write occurs in us-east-1, the
              CDN edge in ap-southeast-1 might still serve the old data for several seconds. Design: (1) Use a
              global event bus (e.g., Kafka with cross-region replication, or a cloud provider's global pub/sub)
              to propagate invalidation events to all regions. (2) Issue CDN purge requests to all edge regions
              simultaneously via the CDN provider's API (Fastly and Cloudflare purge globally within 1-5
              seconds). (3) For the client layer, use a regional WebSocket gateway that subscribes to the global
              event bus and forwards invalidation events to connected clients. (4) Accept that there will be a
              consistency window of 2-10 seconds during cross-region propagation. For data where this window is
              unacceptable (financial transactions), route reads to the same region as writes (read-your-writes
              consistency) and only use caching for other regions' reads with appropriate staleness tolerance.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - HTTP Caching
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/http-cache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Prevent unnecessary network requests with the HTTP Cache
            </a>
          </li>
          <li>
            <a href="https://docs.fastly.com/en/guides/purging" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Fastly Documentation - Purging (Surrogate Keys & Tag-Based Invalidation)
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query - Invalidations from Mutations
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc9111" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 9111 - HTTP Caching (IETF Standard)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
