"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-caching-patterns-concise",
  title: "Cache-First, Network-First, Network-Only Strategies",
  description: "Deep dive into caching strategy patterns including Cache-First, Network-First, Network-Only, Cache-Only, and Stale-While-Revalidate with Workbox implementation.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "caching-patterns",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "Workbox", "service-worker", "cache-first", "network-first"],
  relatedTopics: ["service-worker-caching", "stale-while-revalidate", "browser-caching"],
};

export default function CachingPatternsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Caching patterns</strong> (also called caching strategies) are deterministic algorithms that govern
          how a service worker or caching layer resolves a resource request by coordinating between the local cache
          and the network. The five canonical patterns are <strong>Cache-First</strong>, <strong>Cache-Only</strong>,
          <strong>Network-First</strong>, <strong>Network-Only</strong>, and <strong>Stale-While-Revalidate (SWR)</strong>.
        </p>
        <p>
          These patterns were formalized by Jake Archibald in his 2014 &ldquo;Offline Cookbook&rdquo; article and later
          codified by Google&rsquo;s <strong>Workbox</strong> library (first released 2017, now at v7). Workbox provides
          a first-class <code>workbox-strategies</code> module that maps each pattern to a concrete class:
          <code>CacheFirst</code>, <code>CacheOnly</code>, <code>NetworkFirst</code>, <code>NetworkOnly</code>, and
          <code>StaleWhileRevalidate</code>. Before Workbox, developers hand-rolled these strategies inside
          <code>fetch</code> event handlers in raw service worker code, leading to inconsistent implementations and
          subtle bugs around cache versioning, opaque response handling, and quota management.
        </p>
        <p>
          Understanding when to apply each pattern is a core competency for staff-level frontend engineers, because the
          choice directly impacts perceived performance (Time to First Byte, Largest Contentful Paint), offline
          resilience, data freshness, and storage quota consumption. In a system design interview, you are expected to
          articulate the trade-off space and map resource types to the correct strategy.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Each strategy defines a strict priority order between two sources &mdash; the cache and the network &mdash; along with fallback behavior:</p>

        <div className="mt-4 space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="mb-2 text-lg font-semibold">1. Cache-First (Cache Falling Back to Network)</h3>
            <p>
              The service worker checks the cache first. If a matching response exists, it is returned immediately
              without touching the network. Only on a cache miss does the worker issue a network fetch, and the
              response is then stored in the cache for subsequent requests. This is the <strong>fastest strategy</strong> for
              repeat visits because cached responses are served with near-zero latency (no DNS, no TLS, no server
              round-trip).
            </p>
            <p className="mt-2">
              <strong>Best for:</strong> Versioned static assets (hashed JS/CSS bundles, images, fonts) where the URL
              itself changes when content changes. Because the URL is the cache key, stale data is impossible &mdash;
              a new URL simply causes a cache miss and a fresh fetch.
            </p>
            <p className="mt-2">
              <strong>Workbox API:</strong> <code>new CacheFirst(&#123; cacheName: &apos;static-assets&apos;, plugins: [new ExpirationPlugin(&#123; maxEntries: 100 &#125;)] &#125;)</code>
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="mb-2 text-lg font-semibold">2. Cache-Only</h3>
            <p>
              The service worker only looks in the cache. If the resource is not there, the request fails. No network
              request is ever made. This strategy is used exclusively for <strong>precached resources</strong> &mdash;
              assets that were added to the cache during the service worker&rsquo;s <code>install</code> event via
              <code>workbox-precaching</code>. It guarantees that responses come from a known, versioned set of
              resources.
            </p>
            <p className="mt-2">
              <strong>Best for:</strong> App shell HTML, critical CSS, and offline fallback pages that are
              precached and must always be available, even without any network connectivity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="mb-2 text-lg font-semibold">3. Network-First (Network Falling Back to Cache)</h3>
            <p>
              The service worker attempts a network fetch first. If the network succeeds, the response is returned
              to the client and a copy is stored in the cache. If the network fails (timeout, offline, 5xx), the
              worker falls back to the most recent cached response. This strategy prioritizes <strong>data freshness</strong> while
              still providing offline resilience.
            </p>
            <p className="mt-2">
              A critical implementation detail is the <strong>network timeout</strong>. Without a timeout, the user
              waits indefinitely on a degraded network. Workbox&rsquo;s <code>NetworkFirst</code> accepts a
              <code>networkTimeoutSeconds</code> option (commonly 3&ndash;5 seconds) that triggers the cache
              fallback if the network hasn&rsquo;t responded in time.
            </p>
            <p className="mt-2">
              <strong>Best for:</strong> API responses, HTML pages for content sites, any resource where the
              latest data matters but offline access is still desirable.
            </p>
            <p className="mt-2">
              <strong>Workbox API:</strong> <code>new NetworkFirst(&#123; cacheName: &apos;api-cache&apos;, networkTimeoutSeconds: 3, plugins: [new ExpirationPlugin(&#123; maxAgeSeconds: 86400 &#125;)] &#125;)</code>
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="mb-2 text-lg font-semibold">4. Network-Only</h3>
            <p>
              The service worker always forwards the request to the network. The cache is never consulted and
              responses are never stored. This is semantically equivalent to having no service worker at all for
              that route, but it&rsquo;s useful when you need the service worker for other reasons (e.g., adding
              custom headers, analytics, or background sync) while ensuring the data is always live.
            </p>
            <p className="mt-2">
              <strong>Best for:</strong> Non-GET requests (POST/PUT/DELETE), authentication endpoints, real-time
              data streams, checkout flows, and any operation where stale data would cause correctness issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="mb-2 text-lg font-semibold">5. Stale-While-Revalidate (SWR)</h3>
            <p>
              The service worker returns the cached response immediately (if available) while simultaneously
              issuing a network request in the background. When the network response arrives, the cache is
              updated so the next request gets fresh data. If no cached response exists, it behaves like
              Network-Only for that first request.
            </p>
            <p className="mt-2">
              This is the <strong>best-of-both-worlds</strong> strategy: users get instant responses (from cache)
              and eventual freshness (from the background update). The trade-off is that the user sees
              <strong>one-request-stale data</strong> &mdash; the response they receive is from the previous
              network fetch, not the current one. For many use cases (avatars, user profiles, semi-dynamic content),
              this staleness window is acceptable.
            </p>
            <p className="mt-2">
              <strong>Best for:</strong> Google Fonts CSS, third-party library CDN resources, user avatars,
              non-critical API responses, and any resource where minor staleness is tolerable in exchange for speed.
            </p>
            <p className="mt-2">
              <strong>Workbox API:</strong> <code>new StaleWhileRevalidate(&#123; cacheName: &apos;swr-cache&apos;, plugins: [new CacheableResponsePlugin(&#123; statuses: [0, 200] &#125;)] &#125;)</code>
            </p>
          </div>
        </div>

        <h3 className="mt-6 mb-3 font-semibold">Runtime Caching vs. Precaching</h3>
        <p>
          <strong>Precaching</strong> happens during the service worker <code>install</code> event. You provide a
          manifest of URLs and revision hashes, and Workbox downloads and caches all of them up front. This is
          typically used for the app shell (HTML, critical CSS/JS). Precached resources use <strong>Cache-Only</strong> at
          runtime because they are guaranteed to be in the cache.
        </p>
        <p>
          <strong>Runtime caching</strong> happens on-the-fly as users navigate the app. When a request matches a
          registered route (e.g., <code>registerRoute(/\/api\//, new NetworkFirst(...))</code>), the specified
          strategy intercepts the fetch and manages the cache. This is where Cache-First, Network-First, SWR, and
          Network-Only are applied. The distinction matters architecturally because precaching has an upfront cost
          (bandwidth, install time) while runtime caching is lazy and incremental.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Each caching pattern follows a distinct decision tree when a fetch event fires. Understanding these flows
          is essential for debugging cache behavior, choosing the right strategy, and explaining trade-offs in
          interviews.
        </p>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/patterns-comparison.svg"
          alt="Comparison of all five caching strategy patterns"
          caption="Overview of all five caching strategies: Cache-First, Cache-Only, Network-First, Network-Only, and Stale-While-Revalidate with their priority order and ideal use cases"
        />

        <h3 className="mt-6 mb-3 font-semibold">Cache-First Flow</h3>
        <p>
          The Cache-First flow is optimized for speed. On the happy path (cache hit), the response is served in
          under 1ms with zero network overhead. The network is only contacted on a cold start or when the cache
          entry has been evicted by the expiration plugin.
        </p>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/cache-first-flow.svg"
          alt="Cache-First strategy decision flow diagram"
          caption="Cache-First flow: Cache is always consulted first. Network is the fallback. Responses are cached on miss for future requests."
        />

        <h3 className="mt-6 mb-3 font-semibold">Network-First Flow</h3>
        <p>
          The Network-First flow prioritizes freshness but includes a critical timeout mechanism. Without the
          timeout, users on flaky connections (e.g., underground subway, airplane mode transitioning) would wait
          indefinitely. The timeout converts a slow network into a fast cache hit. The cached response is always
          the most recent successful network response, so even the fallback is reasonably fresh.
        </p>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/network-first-flow.svg"
          alt="Network-First strategy decision flow diagram"
          caption="Network-First flow: Network is attempted first with a configurable timeout. Cache serves as fallback for offline or slow-network scenarios."
        />

        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="mb-3 font-semibold">Stale-While-Revalidate Flow (Concurrent)</h3>
          <p>Unlike the sequential flows above, SWR issues <strong>two operations in parallel</strong>:</p>
          <ol className="mt-2 space-y-2">
            <li><strong>1.</strong> Read from cache &rarr; if found, return to client immediately</li>
            <li><strong>2.</strong> Simultaneously fetch from network &rarr; when response arrives, update the cache</li>
            <li><strong>3.</strong> If cache was empty, wait for network response and return it (same as Network-Only for first request)</li>
          </ol>
          <p className="mt-2">
            The key insight is that the client gets a response as fast as Cache-First (from cache) while the cache
            is kept fresh in the background. The next request will see the updated data. This makes SWR ideal for
            resources that change occasionally but where instant display is more important than absolute freshness.
          </p>
        </div>
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Workbox Service Worker Configuration</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Custom Cache-First with Refresh (Advanced Pattern)</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Network-First with Timeout and Background Sync</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Cache-First</th>
              <th className="p-3 text-left">Cache-Only</th>
              <th className="p-3 text-left">Network-First</th>
              <th className="p-3 text-left">Network-Only</th>
              <th className="p-3 text-left">SWR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Speed (repeat)</strong></td>
              <td className="p-3">Instant (~0ms)</td>
              <td className="p-3">Instant (~0ms)</td>
              <td className="p-3">Network latency</td>
              <td className="p-3">Network latency</td>
              <td className="p-3">Instant (~0ms)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Data Freshness</strong></td>
              <td className="p-3">Stale until cache miss</td>
              <td className="p-3">Fixed at precache time</td>
              <td className="p-3">Always fresh</td>
              <td className="p-3">Always fresh</td>
              <td className="p-3">One-request stale</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Offline Support</strong></td>
              <td className="p-3">Yes (after first visit)</td>
              <td className="p-3">Yes (precached only)</td>
              <td className="p-3">Yes (fallback)</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes (after first visit)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Network Usage</strong></td>
              <td className="p-3">Low (only on miss)</td>
              <td className="p-3">None at runtime</td>
              <td className="p-3">Every request</td>
              <td className="p-3">Every request</td>
              <td className="p-3">Every request (background)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">Low</td>
              <td className="p-3">Low</td>
              <td className="p-3">Medium (timeout logic)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Medium (concurrent)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache Growth</strong></td>
              <td className="p-3">Grows over time</td>
              <td className="p-3">Fixed at install</td>
              <td className="p-3">Grows over time</td>
              <td className="p-3">None</td>
              <td className="p-3">Grows over time</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">Static assets, fonts</td>
              <td className="p-3">App shell, offline page</td>
              <td className="p-3">API data, HTML pages</td>
              <td className="p-3">Auth, mutations, checkout</td>
              <td className="p-3">CDN libs, avatars, profiles</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-semibold">Key Decision Heuristic</p>
          <p className="mt-2 text-sm">
            Ask two questions: (1) &ldquo;Can I tolerate stale data?&rdquo; and (2) &ldquo;Does this resource change?&rdquo;
            If yes to both &rarr; SWR. If stale is OK and it rarely changes &rarr; Cache-First. If stale is not OK &rarr;
            Network-First. If correctness is critical &rarr; Network-Only. If it&rsquo;s precached and immutable &rarr; Cache-Only.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>Follow these guidelines when designing your caching strategy layer:</p>
        <ol className="space-y-3">
          <li>
            <strong>Use Content-Addressable URLs for Cache-First:</strong> Hash your static asset filenames
            (e.g., <code>main.a1b2c3.js</code>). This makes Cache-First safe because the URL changes when
            content changes, guaranteeing a cache miss and fresh fetch without needing manual invalidation.
          </li>
          <li>
            <strong>Always Set Network Timeouts for Network-First:</strong> Without a timeout, degraded networks
            (not fully offline, but slow) create the worst UX &mdash; the user waits with no response. Set
            <code>networkTimeoutSeconds: 3</code> as a baseline and adjust based on your API latency profile.
          </li>
          <li>
            <strong>Pair Strategies with Expiration Plugins:</strong> Every runtime cache needs bounds.
            Use <code>ExpirationPlugin</code> with both <code>maxEntries</code> (cap total items) and
            <code>maxAgeSeconds</code> (cap staleness) to prevent unbounded cache growth that exhausts
            the user&rsquo;s storage quota.
          </li>
          <li>
            <strong>Use CacheableResponsePlugin for Opaque Responses:</strong> Cross-origin requests (e.g., CDN
            fonts) return opaque responses with status 0. Without <code>CacheableResponsePlugin(&#123; statuses: [0, 200] &#125;)</code>,
            these responses won&rsquo;t be cached, breaking Cache-First for third-party resources.
          </li>
          <li>
            <strong>Separate Cache Namespaces:</strong> Use distinct <code>cacheName</code> values per strategy
            (e.g., <code>&apos;static-v1&apos;</code>, <code>&apos;api-v1&apos;</code>, <code>&apos;images-v1&apos;</code>). This allows granular
            cache invalidation and debugging in DevTools Application &gt; Cache Storage.
          </li>
          <li>
            <strong>Use Network-Only for Mutations:</strong> Never cache POST, PUT, DELETE, or PATCH requests.
            These are state-changing operations where returning a cached response would be incorrect. Use
            <code>NetworkOnly</code> or don&rsquo;t register a route at all.
          </li>
          <li>
            <strong>Precache the App Shell, Runtime-Cache Everything Else:</strong> Precache a small set of
            critical resources (HTML shell, critical CSS, main JS bundle) and use runtime caching strategies
            for all dynamic content. This keeps the install event fast and avoids over-fetching.
          </li>
          <li>
            <strong>Test Offline Scenarios in DevTools:</strong> Chrome DevTools &gt; Application &gt; Service Workers
            has an &ldquo;Offline&rdquo; checkbox. Test each strategy under offline conditions, slow 3G throttling,
            and after cache expiration to verify your fallback behavior is correct.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these mistakes that commonly appear in caching strategy implementations:</p>
        <ul className="space-y-3">
          <li>
            <strong>Using Cache-First for API Responses:</strong> This serves stale data indefinitely until
            the cache entry expires. Users see outdated information with no indication it&rsquo;s stale. Use
            Network-First or SWR for dynamic data.
          </li>
          <li>
            <strong>No Cache Versioning or Expiration:</strong> Caches grow without bound. A user who visits
            your site daily for a year accumulates thousands of cached responses. Without
            <code>ExpirationPlugin</code>, this can exceed the browser&rsquo;s storage quota (varies: ~50MB on
            Safari, much higher on Chrome) and cause silent eviction of other caches.
          </li>
          <li>
            <strong>Caching Error Responses:</strong> If an API returns a 500 error and you cache it with
            Cache-First or SWR, subsequent requests serve the cached error. Always validate response status
            before caching. Workbox&rsquo;s <code>CacheableResponsePlugin</code> handles this by only caching
            200 responses by default.
          </li>
          <li>
            <strong>Missing Network Timeout in Network-First:</strong> On degraded connections (not offline,
            but 20+ second latency), Network-First without a timeout creates terrible UX &mdash; the user
            waits with a spinner even though a perfectly usable cached version exists.
          </li>
          <li>
            <strong>Over-Precaching:</strong> Precaching 50MB of assets during <code>install</code> delays
            service worker activation, consumes bandwidth, and may fail on slow connections. Precache only
            the critical app shell ({'&lt;'}1MB) and runtime-cache everything else lazily.
          </li>
          <li>
            <strong>Ignoring Cache-Control Headers:</strong> Service worker caching operates independently
            of HTTP cache headers, but the browser&rsquo;s HTTP cache sits between the service worker and the
            network. If your CDN sets <code>Cache-Control: max-age=31536000</code>, the service worker&rsquo;s
            network fetch may hit the HTTP cache instead of the origin, returning stale data even with
            Network-First. Use Workbox&rsquo;s <code>fetchOptions: &#123; cache: &apos;no-cache&apos; &#125;</code> to bypass.
          </li>
          <li>
            <strong>Not Handling Quota Exceeded Errors:</strong> When storage is full, <code>cache.put()</code>
            throws a <code>QuotaExceededError</code>. Without a try/catch, this crashes the service worker&rsquo;s
            fetch handler and returns no response at all. Workbox handles this internally, but custom
            implementations must catch and degrade gracefully.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Here is how to map each caching strategy to concrete resource types in a production application:</p>
        <ul className="space-y-3">
          <li>
            <strong>Cache-First:</strong> Google Fonts (woff2 files), versioned JS/CSS bundles
            (<code>main.abc123.js</code>), product images on an e-commerce site, icon SVGs, and any asset
            served from a CDN with content-hash filenames.
          </li>
          <li>
            <strong>Cache-Only:</strong> The app shell HTML (<code>/index.html</code> or <code>/app-shell</code>),
            an offline fallback page (<code>/offline.html</code>), and critical CSS that was precached during
            service worker installation.
          </li>
          <li>
            <strong>Network-First:</strong> REST API responses (<code>/api/users/me</code>), HTML pages on a
            news site or blog, GraphQL query results, server-rendered pages, and any resource where users
            expect the latest data but offline access is valuable.
          </li>
          <li>
            <strong>Network-Only:</strong> Authentication endpoints (<code>/api/auth/login</code>), payment
            processing (<code>/api/checkout</code>), form submissions, WebSocket upgrade requests, and any
            POST/PUT/DELETE operation.
          </li>
          <li>
            <strong>SWR:</strong> User avatar images, profile data, social media feeds (Twitter timeline),
            weather widgets, stock ticker (where 30-second staleness is OK), and third-party CDN libraries
            (e.g., analytics scripts).
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Cache</h3>
          <p>Some resources should never be cached by a service worker:</p>
          <ul className="mt-2 space-y-2">
            <li>&bull; <strong>Authentication tokens and session cookies</strong> &mdash; Caching these creates
            security vulnerabilities if the device is shared or stolen.</li>
            <li>&bull; <strong>Personally identifiable information (PII)</strong> &mdash; Cached API responses
            containing user data persist on disk even after logout. Use <code>caches.delete()</code> on logout.</li>
            <li>&bull; <strong>Real-time data with strict consistency requirements</strong> &mdash; Financial
            transactions, live auctions, multiplayer game state. Even SWR&rsquo;s one-request staleness is
            unacceptable here.</li>
            <li>&bull; <strong>Large binary files without user intent</strong> &mdash; Don&rsquo;t cache 500MB
            video files in the background. This exhausts quota and angers users on metered connections.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.chrome.com/docs/workbox/modules/workbox-strategies/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Workbox Strategies Module - Chrome Developers
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/offline-cookbook" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Offline Cookbook - Jake Archibald (web.dev)
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/service-worker-caching-and-http-caching" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Service Worker Caching and HTTP Caching - web.dev
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cache API - MDN Web Docs
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/storage-for-the-web" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Storage for the Web (Quota, Eviction) - web.dev
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: You are building a PWA for a news website. Which caching strategy do you use for article pages and why?</p>
            <p className="mt-2 text-sm">
              A: <strong>Network-First</strong> with a 3-second timeout. News articles change frequently (corrections,
              updates, breaking news), so freshness is critical &mdash; ruling out Cache-First and SWR. However,
              readers on the subway or airplane need offline access to previously-viewed articles, ruling out
              Network-Only. Network-First gives us the latest content when online, and the last-fetched version
              when offline. The timeout prevents long waits on degraded connections. For the article images, I&rsquo;d
              use <strong>Cache-First</strong> since images at a given URL don&rsquo;t change once published.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between Stale-While-Revalidate in a service worker vs. the HTTP Cache-Control stale-while-revalidate directive?</p>
            <p className="mt-2 text-sm">
              A: They share the same conceptual pattern but operate at different layers. The <strong>HTTP directive</strong>
              (<code>Cache-Control: max-age=60, stale-while-revalidate=3600</code>) is handled by the browser&rsquo;s
              HTTP cache and CDN edge caches. The <strong>service worker SWR strategy</strong> (Workbox&rsquo;s
              <code>StaleWhileRevalidate</code>) operates in the Cache API, which is a separate storage layer
              from the HTTP cache. The service worker version gives you programmatic control &mdash; you can
              add custom plugins, filter responses, set separate expiration policies, and react to revalidation
              events. They can even compose: a service worker SWR fetch might hit the HTTP cache (which may itself
              be stale-while-revalidating from the CDN). Understanding this layering is key to avoiding double-caching bugs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache invalidation when deploying a new version of your app?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers of invalidation work together. For <strong>precached resources</strong>, Workbox&rsquo;s
              precache manifest includes revision hashes &mdash; when you deploy, changed files get new hashes,
              triggering the new service worker to download updated resources during <code>install</code> and
              swap them in during <code>activate</code>. For <strong>runtime-cached resources</strong> using
              Cache-First, the safest approach is content-addressed URLs (filename hashing) so new versions are
              new URLs. For Network-First caches, deployment is inherently safe since every request goes to the
              network. For SWR caches, the background revalidation automatically picks up new versions within
              one request. Additionally, you can version your cache names (<code>&apos;api-v2&apos;</code>) and delete
              old caches in the <code>activate</code> event to do a clean sweep.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
