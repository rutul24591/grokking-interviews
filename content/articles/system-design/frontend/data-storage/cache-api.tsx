"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cache-api-concise",
  title: "Cache API",
  description: "Comprehensive guide to the Cache API covering programmatic HTTP cache management, Request/Response storage, Service Worker integration, and offline-first patterns.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "cache-api",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "storage", "Cache API", "Service Worker", "offline", "Request/Response"],
  relatedTopics: ["indexeddb", "localstorage", "storage-quotas-and-eviction"],
};

export default function CacheApiConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          The <strong>Cache API</strong> is a browser-native storage interface defined as part of the Service Worker
          specification that stores <code>Request</code>/<code>Response</code> pairs. Unlike the browser's automatic
          HTTP cache (governed by <code>Cache-Control</code>, <code>ETag</code>, and <code>Last-Modified</code>
          headers), the Cache API gives developers full programmatic control over what is cached, when entries are
          added or removed, and how lookups are performed. It is the foundation for offline-first web architectures,
          enabling applications to serve content without any network connectivity.
        </p>
        <p>
          Although the Cache API was designed alongside Service Workers and is most commonly used within a Service
          Worker's <code>fetch</code> and <code>install</code> event handlers, it is <strong>not</strong> limited
          to the Service Worker context. The <code>caches</code> global is available in the <code>window</code>{" "}
          context as well, meaning you can read from, write to, and inspect caches directly from your page scripts.
          This dual availability is important for patterns like pre-populating caches before a Service Worker
          activates, or reading cached data in the main thread for UI rendering decisions.
        </p>
        <p>
          The API operates on the same origin-scoped storage quota that IndexedDB shares (typically up to 60% of
          available disk space, varying by browser). Entries do not expire automatically; the Cache API has no
          built-in TTL mechanism. This is a deliberate design choice that gives developers maximum flexibility but
          also maximum responsibility. If you do not delete old entries, they persist indefinitely until the browser
          evicts the entire origin under storage pressure (which happens without warning for non-persistent storage).
        </p>
        <p>
          For staff and principal engineers, the Cache API is a critical primitive in the broader storage and
          networking architecture. It sits at the intersection of the Service Worker lifecycle, the Fetch API, CORS
          policy, and storage quota management. Mastering it means understanding not just the method signatures,
          but how opaque responses behave, why cache versioning via named caches is the standard invalidation
          pattern, and how the Cache API interacts with (rather than replaces) the browser's HTTP cache layer.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The Cache API surface is deliberately minimal: a <code>CacheStorage</code> interface that manages
          named caches, and a <code>Cache</code> interface that stores individual request/response pairs. The
          simplicity is deceptive; the edge cases around CORS, opaque responses, and storage behavior require
          careful attention.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">CacheStorage (the caches global)</h3>
        <p>
          The <code>caches</code> object is available globally in both the window and Service Worker contexts. It
          provides the top-level management layer for named caches:
        </p>
        <ul>
          <li>
            <strong>caches.open(cacheName):</strong> Opens an existing named cache or creates a new one. Returns
            a Promise resolving to a <code>Cache</code> object. The cache name is a plain string; the convention
            is to use versioned names like <code>'static-v3'</code> or <code>'api-v2'</code> to enable atomic
            cache rotation during Service Worker updates.
          </li>
          <li>
            <strong>caches.match(request, options):</strong> Searches <strong>all</strong> named caches for a
            matching entry and returns the first match found. This is a convenience method that avoids opening
            individual caches. The search order is the order in which caches were created. The optional{" "}
            <code>cacheName</code> property in options restricts the search to a single cache.
          </li>
          <li>
            <strong>caches.has(cacheName):</strong> Returns a boolean Promise indicating whether a named cache
            exists. Useful for conditional logic during Service Worker activation.
          </li>
          <li>
            <strong>caches.delete(cacheName):</strong> Deletes an entire named cache and all its entries. This
            is the primary mechanism for cache invalidation: delete old versioned caches during the{" "}
            <code>activate</code> event to free storage and prevent serving stale assets.
          </li>
          <li>
            <strong>caches.keys():</strong> Returns a Promise resolving to an array of all cache names. Combined
            with <code>caches.delete()</code>, this enables the standard cleanup pattern of iterating all caches
            and deleting those not in a known-good set.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-semibold">Cache Instance Methods</h3>
        <p>
          Once you have a <code>Cache</code> object from <code>caches.open()</code>, you interact with individual
          entries:
        </p>
        <ul>
          <li>
            <strong>cache.put(request, response):</strong> Stores a request/response pair. The request can be a
            URL string or a <code>Request</code> object. You must <strong>clone</strong> the response before
            caching if you also need to return it to the caller, because Response bodies are streams that can
            only be consumed once.
          </li>
          <li>
            <strong>cache.add(url):</strong> A convenience method that calls <code>fetch(url)</code> and then
            stores the resulting pair. Critically, <code>cache.add()</code> <strong>rejects if the response
            is not in the 2xx range</strong>. A 404 or 500 will cause the promise to reject, which is a safety
            mechanism against caching error responses but can surprise developers expecting it to behave like{" "}
            <code>cache.put()</code>.
          </li>
          <li>
            <strong>cache.addAll(urls):</strong> The atomic variant. Fetches all URLs and stores all pairs. If
            any single request fails (network error or non-2xx status), <strong>none</strong> of the entries
            are cached. This atomicity makes it ideal for precaching during the Service Worker install event,
            where partial caches would leave the application in a broken state.
          </li>
          <li>
            <strong>cache.match(request, options):</strong> Looks up a single cached response. Returns{" "}
            <code>undefined</code> if no match is found (not a rejection). Options include{" "}
            <code>ignoreSearch</code> (matches without query string), <code>ignoreMethod</code> (matches
            regardless of HTTP method), and <code>ignoreVary</code> (ignores the Vary header on cached responses).
          </li>
          <li>
            <strong>cache.matchAll(request, options):</strong> Returns all matching responses (useful when
            multiple entries share the same URL but differ by Vary header).
          </li>
          <li>
            <strong>cache.delete(request, options):</strong> Removes a specific cached entry. Returns a boolean
            Promise indicating whether an entry was found and removed. Accepts the same options as{" "}
            <code>cache.match()</code>.
          </li>
          <li>
            <strong>cache.keys(request, options):</strong> Returns all cached <code>Request</code> objects,
            optionally filtered by a specific request. With no arguments, returns every request in the cache.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-semibold">Opaque Responses & CORS</h3>
        <p>
          When you fetch a cross-origin resource without CORS headers (using <code>mode: 'no-cors'</code>), the
          browser returns an <strong>opaque response</strong> with status <code>0</code>, empty headers, and an
          inaccessible body. The Cache API will store opaque responses, but with a critical caveat: browsers pad
          the reported storage size of opaque responses (Chrome uses ~7MB per entry regardless of actual size).
          This is a security measure to prevent cache-timing attacks that could infer response sizes, but it
          means caching many opaque responses can rapidly exhaust your storage quota.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">Cache Versioning</h3>
        <p>
          Because the Cache API has no built-in expiration, the standard invalidation pattern uses versioned cache
          names. When deploying a new Service Worker version, you open a new cache (e.g., <code>'static-v4'</code>),
          precache the updated assets, and delete old caches (<code>'static-v3'</code>) during the activate event.
          This provides atomic rollover: the old cache remains intact while the new SW installs, ensuring the
          previous SW version continues serving consistent assets until the new version takes control.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The Cache API operates as a developer-controlled storage layer that sits alongside (not within) the
          browser's automatic HTTP cache. Understanding the architectural relationship between these layers, and
          how the Cache API integrates with Service Workers and the Fetch API, is essential for designing correct
          caching strategies.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/cache-api-architecture.svg"
          alt="Cache API Architecture"
          caption="CacheStorage manages named caches, each storing Request/Response pairs, accessible from both window and Service Worker contexts"
        />

        <p>
          The <code>CacheStorage</code> container holds multiple named caches. Each named cache is an independent
          key-value store where the key is a <code>Request</code> (matched by URL and optionally method and
          headers) and the value is a <code>Response</code>. The typical production setup uses separate named
          caches for different resource types: one for static assets (versioned by build hash), one for API
          responses, and one for images or other media. This separation enables targeted invalidation without
          affecting other cache categories.
        </p>
        <p>
          When a Service Worker intercepts a fetch event, the decision flow typically checks the Cache API first
          (for Cache First strategies) or the network first (for Network First strategies), then falls back to
          the alternative. The Cache API lookup happens entirely in the browser process with no network activity,
          delivering sub-millisecond response times for cached entries. Meanwhile, if the SW makes a network
          request via <code>fetch()</code>, that request passes through the browser's HTTP cache before reaching
          the network. This layering means a "network" request from the SW may actually be served from the
          HTTP cache, an important nuance when reasoning about freshness guarantees.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/cache-api-vs-http-cache.svg"
          alt="Cache API vs HTTP Cache Comparison"
          caption="The Cache API provides manual, code-driven control while the HTTP cache is automatic and header-driven"
        />

        <p>
          The distinction between these two cache layers is fundamental. The HTTP cache is transparent to your
          application code, managed by the browser based on response headers, and cannot be reliably inspected
          or modified by JavaScript. The Cache API is entirely opaque to the browser's automatic caching logic,
          managed exclusively by your code, and provides full CRUD operations. In production architectures, the
          two layers complement each other: HTTP caching handles CDN efficiency and standard browser behavior,
          while the Cache API handles offline support, precaching, and fine-grained invalidation logic that
          header-based caching cannot express.
        </p>
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>
          Below are practical implementations covering precaching, runtime caching, and cache management patterns:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Precaching During Service Worker Install</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Runtime Caching with Cache First Strategy</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Cache Cleanup During Activate</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Using Cache API from the Window Context</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          Choosing the right storage mechanism depends on what you are caching, how much control you need, and
          whether offline access is a requirement:
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Cache API</th>
              <th className="p-3 text-left">HTTP Cache</th>
              <th className="p-3 text-left">IndexedDB</th>
              <th className="p-3 text-left">localStorage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Data Model</strong></td>
              <td className="p-3">Request/Response pairs</td>
              <td className="p-3">Request/Response pairs</td>
              <td className="p-3">Structured objects, blobs, files</td>
              <td className="p-3">String key-value</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Control</strong></td>
              <td className="p-3">Full programmatic CRUD</td>
              <td className="p-3">Declarative (HTTP headers only)</td>
              <td className="p-3">Full programmatic (transactional)</td>
              <td className="p-3">Full programmatic (getItem/setItem)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Capacity</strong></td>
              <td className="p-3">Origin quota (~60% of disk)</td>
              <td className="p-3">Browser-managed, limited</td>
              <td className="p-3">Origin quota (shared pool with Cache API)</td>
              <td className="p-3">~5-10 MB</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Expiration</strong></td>
              <td className="p-3">None (manual management)</td>
              <td className="p-3">Automatic (max-age, ETag, Last-Modified)</td>
              <td className="p-3">None (manual management)</td>
              <td className="p-3">None (manual management)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Async API</strong></td>
              <td className="p-3">Yes (Promise-based)</td>
              <td className="p-3">N/A (browser-managed)</td>
              <td className="p-3">Yes (event-based or Promise-wrapped)</td>
              <td className="p-3">No (synchronous, blocks main thread)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SW Access</strong></td>
              <td className="p-3">Yes (primary use case)</td>
              <td className="p-3">Implicit (via fetch within SW)</td>
              <td className="p-3">Yes</td>
              <td className="p-3">No (not available in SW context)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">HTTP responses, offline shells, asset precaching</td>
              <td className="p-3">Standard web caching, CDN assets</td>
              <td className="p-3">Large structured datasets, offline data</td>
              <td className="p-3">Small config, preferences, tokens</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          A common architectural mistake is using the Cache API to store arbitrary data that would be better suited
          for IndexedDB. The Cache API is optimized for HTTP Request/Response pairs. If you need to store JSON
          objects, user-generated content, or application state, IndexedDB provides indexed queries, transactions,
          and structured cloning that the Cache API does not. Conversely, if you need to intercept and serve
          network responses offline, the Cache API is the correct choice because it integrates directly with the
          Service Worker fetch event.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices reflect production experience with large-scale applications that rely on the Cache API
          for offline support and performance optimization:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Version Your Caches with Named Strings:</strong> Use descriptive, versioned cache names like{" "}
            <code>'static-v4'</code> or <code>'api-2026-03'</code>. During the Service Worker activate event,
            delete all caches whose names do not appear in a known-good whitelist. This is the only reliable
            invalidation mechanism since the Cache API has no TTL support.
          </li>
          <li>
            <strong>Clean Up Old Caches on Activate:</strong> The activate event is the correct place to delete
            outdated caches. Use <code>caches.keys()</code> to enumerate all caches, filter out those matching
            the current version, and delete the rest. Wrap this logic in <code>event.waitUntil()</code> to ensure
            cleanup completes before the SW begins handling fetch events.
          </li>
          <li>
            <strong>Never Cache POST Requests:</strong> The Cache API technically allows storing any HTTP method,
            but caching POST requests violates HTTP semantics and leads to dangerous side effects. POST requests
            are not idempotent; replaying a cached POST response can cause duplicate submissions, incorrect state
            mutations, or security vulnerabilities.
          </li>
          <li>
            <strong>Handle Opaque Responses with Extreme Care:</strong> If you must cache cross-origin resources
            fetched without CORS, implement strict limits. Set a maximum entry count for opaque-response caches
            and implement manual eviction. Each opaque response may consume ~7MB of reported quota regardless of
            actual size, and you cannot inspect the status code to verify success.
          </li>
          <li>
            <strong>Always Clone Before Caching:</strong> Response bodies are readable streams consumed on first
            read. When implementing runtime caching in a fetch handler, call <code>response.clone()</code>{" "}
            before passing one copy to the cache and returning the other to the caller. Forgetting this produces
            a TypeError at runtime.
          </li>
          <li>
            <strong>Validate Responses Before Caching with cache.put:</strong> Unlike <code>cache.add()</code>,
            the <code>cache.put()</code> method does not reject on non-2xx responses. Always check{" "}
            <code>response.ok</code> or <code>response.status === 200</code> before calling{" "}
            <code>cache.put()</code> to avoid poisoning your cache with error responses that will be served on
            subsequent requests.
          </li>
          <li>
            <strong>Separate Caches by Resource Type:</strong> Use dedicated named caches for static assets, API
            responses, and images. This enables independent versioning and invalidation: you can rotate the static
            cache on each deployment while preserving longer-lived API cache entries.
          </li>
          <li>
            <strong>Monitor Storage Quota:</strong> Use <code>navigator.storage.estimate()</code> to track usage
            and available quota. Implement proactive eviction when usage exceeds a threshold (e.g., 80%). For
            critical applications, request persistent storage via <code>navigator.storage.persist()</code> to
            prevent the browser from evicting your origin's data under storage pressure.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These issues have caused production incidents in applications relying on the Cache API. Each requires
          specific awareness and mitigation:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Opaque Response Size Inflation:</strong> Browsers pad the reported storage size of opaque
            responses as a security measure. In Chrome, each opaque response consumes approximately 7MB of
            quota regardless of its actual content size. Caching 50 opaque image responses could report 350MB
            of usage, potentially triggering quota eviction. Mitigate by using CORS where possible or by
            strictly limiting the number of cached opaque entries.
          </li>
          <li>
            <strong>No Automatic Eviction Within a Cache:</strong> Unlike the HTTP cache, the Cache API never
            evicts individual entries. It grows unbounded until you explicitly delete entries or the browser
            evicts the entire origin under storage pressure. Without custom expiration logic (checking timestamps
            stored in IndexedDB or a metadata cache), entries persist indefinitely.
          </li>
          <li>
            <strong>cache.add() Fails on Non-2xx Responses:</strong> Calling <code>cache.add('/api/data')</code>{" "}
            rejects if the server returns a 404, 500, or any non-2xx status. Developers expecting silent failure
            or expecting the error response to be cached are surprised when the promise rejects. Use{" "}
            <code>fetch()</code> followed by a status check and <code>cache.put()</code> when you need more
            control over error handling.
          </li>
          <li>
            <strong>CORS and Mixed Content Issues:</strong> The Cache API follows the same-origin policy. Caching
            a response fetched from a cross-origin without CORS headers produces an opaque response. Attempting
            to read headers or the body of an opaque response from the Cache API returns empty values. If your
            application logic depends on inspecting cached response data, ensure CORS is properly configured on
            the origin server.
          </li>
          <li>
            <strong>Stale Caches After Deployment:</strong> Because the Cache API does not expire entries, a user
            who never closes their browser tab may continue receiving assets from an old cache indefinitely. The
            Service Worker update mechanism (byte-diff check on the SW script) is the trigger for cache rotation,
            but it only fires on navigation events. Long-lived single-page applications may need manual update
            checks via <code>registration.update()</code> on a timer.
          </li>
          <li>
            <strong>Cache Key Sensitivity to Query Strings:</strong> By default, <code>cache.match()</code>{" "}
            treats the full URL including query string as the cache key. A request for <code>/api/data?v=1</code>{" "}
            will not match a cached entry for <code>/api/data?v=2</code>. This is correct for versioned URLs but
            problematic for analytics parameters (UTM tags, tracking IDs). Use the{" "}
            <code>ignoreSearch: true</code> option when query parameters should not affect cache matching.
          </li>
          <li>
            <strong>Race Conditions in Concurrent Cache Writes:</strong> If multiple fetch events simultaneously
            write to the same cache key, the last write wins. This is usually benign for identical resources but
            can cause issues when cache entries include metadata or when stale-while-revalidate updates race with
            user-initiated cache refreshes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          The Cache API enables several critical architectural patterns in production web applications:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>PWA Offline App Shell:</strong> The app shell model precaches the HTML skeleton, critical
            CSS, core JavaScript, and key images during the Service Worker install event using{" "}
            <code>cache.addAll()</code>. On subsequent visits, the shell loads instantly from cache regardless
            of network conditions. Dynamic content is then fetched from API endpoints (with their own caching
            strategy) and injected into the shell. Twitter Lite reduced initial load time to under 3 seconds
            on 3G using this pattern.
          </li>
          <li>
            <strong>Runtime Caching for API Responses:</strong> Using a stale-while-revalidate strategy, the
            Service Worker serves cached API responses immediately while fetching fresh data in the background.
            The next request receives the updated response. This pattern is ideal for product catalogs, news
            feeds, and any content where sub-second response time matters more than real-time freshness.
          </li>
          <li>
            <strong>Asset Precaching with Build Integration:</strong> Build tools (Workbox, next-pwa) generate
            a precache manifest at build time containing hashed asset URLs. The Service Worker caches these
            during install, guaranteeing that all assets for a specific build version are available offline.
            The hash in the filename serves as both the cache-busting mechanism and the version identifier.
          </li>
          <li>
            <strong>Offline Fallback Pages:</strong> Cache a custom offline HTML page during install. When a
            navigation request fails (no network and no cached response), serve the offline page from cache.
            This provides a graceful degradation experience rather than the browser's default "No Internet"
            error page.
          </li>
          <li>
            <strong>Background Content Pre-fetching:</strong> Use the Cache API from the window context to
            pre-populate caches based on user behavior predictions. For example, when a user hovers over a
            link, fetch the target page and cache it so that navigation is instant. This pattern works
            independently of the Service Worker and can improve perceived performance even without a SW.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use the Cache API</h3>
          <p>The Cache API is not a general-purpose storage mechanism. Avoid it when:</p>
          <ul className="mt-2 space-y-2">
            <li>
              &bull; <strong>Storing structured application data:</strong> JSON objects, user preferences,
              shopping carts, and form state belong in IndexedDB or localStorage. The Cache API stores
              Request/Response pairs and does not support queries or indexes.
            </li>
            <li>
              &bull; <strong>Caching sensitive data without encryption:</strong> Cached responses are stored
              in cleartext on disk. Authentication tokens, personal information, or financial data should use
              encrypted storage or be excluded from caching entirely.
            </li>
            <li>
              &bull; <strong>Replacing a CDN:</strong> The Cache API caches data on the user's device. It does
              not reduce origin server load for other users. Use CDN caching for shared resources and the Cache
              API for per-device offline support.
            </li>
            <li>
              &bull; <strong>Real-time data endpoints:</strong> WebSocket messages, live trading data, and
              collaborative editing streams should never be cached. The Cache API stores static snapshots and
              has no mechanism for partial updates or streaming invalidation.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cache API - MDN Web Docs
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/cache-api-quick-guide" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Cache API: A Quick Guide - web.dev
            </a>
          </li>
          <li>
            <a href="https://jakearchibald.com/2014/offline-cookbook/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Offline Cookbook - Jake Archibald
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/workbox" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Workbox: Production-Ready Service Worker Libraries - Chrome Developers
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/storage-for-the-web" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Storage for the Web - web.dev
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Cache API differ from the browser's HTTP cache, and when would you use one over the
              other?
            </p>
            <p className="mt-2 text-sm">
              A: The HTTP cache is automatic and header-driven: the browser manages it based on{" "}
              <code>Cache-Control</code>, <code>ETag</code>, and <code>Last-Modified</code> headers. You cannot
              programmatically add, remove, or inspect entries. The Cache API is entirely manual and code-driven:
              you decide what to cache, when to evict, and how to match requests. The HTTP cache sits{" "}
              <em>below</em> the Cache API in the stack. When a Service Worker makes a <code>fetch()</code> call,
              that request still passes through the HTTP cache before reaching the network. Use the HTTP cache
              for standard CDN behavior and automatic browser caching. Use the Cache API when you need offline
              support, deterministic precaching, or custom invalidation logic that cannot be expressed with HTTP
              headers alone. In production, they complement each other: HTTP caching handles edge/CDN efficiency,
              while the Cache API handles on-device offline resilience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the risks of caching opaque responses and how you would mitigate them in a production
              application.
            </p>
            <p className="mt-2 text-sm">
              A: Opaque responses come from cross-origin requests made without CORS. They have status 0, empty
              headers, and inaccessible bodies. The risks are threefold: (1) <strong>Size inflation</strong> -
              browsers pad each opaque response to ~7MB of reported quota, so caching 100 entries could report
              700MB and trigger origin eviction. (2) <strong>Silent errors</strong> - you cannot inspect the
              status code, so a 500 error looks identical to a 200 success; you may cache and serve error
              responses indefinitely. (3) <strong>Security</strong> - the padding exists to prevent timing
              attacks that infer response sizes. Mitigation: configure CORS on the origin server wherever
              possible to get non-opaque responses. Where CORS is not feasible (third-party CDNs), implement
              a strict maximum entry count for opaque caches (e.g., 50 entries), use a dedicated named cache
              for opaque resources to isolate quota impact, and implement periodic full-cache rotation rather
              than per-entry eviction.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Design a cache management strategy for a PWA that serves 500 pages of content offline. How do
              you handle updates, storage limits, and cache invalidation?
            </p>
            <p className="mt-2 text-sm">
              A: Use a tiered approach with separate named caches: (1) <strong>App shell cache</strong>{" "}
              (versioned, e.g., <code>'shell-v12'</code>) precached during install containing the HTML template,
              critical CSS, and core JS. Rotated atomically on each deployment via the activate event. (2){" "}
              <strong>Content cache</strong> (e.g., <code>'content-v1'</code>) populated at runtime using a
              stale-while-revalidate strategy as users browse pages. Implement a custom expiration layer using
              IndexedDB to store timestamps per URL and evict entries older than 7 days during periodic
              maintenance. Set a maximum of 500 entries; when exceeded, evict least-recently-used entries. (3){" "}
              <strong>Image cache</strong> with a strict cap of 200 entries and LRU eviction. Monitor total
              quota usage via <code>navigator.storage.estimate()</code> and trigger aggressive eviction when
              usage exceeds 70%. Request persistent storage to prevent browser-initiated eviction. For updates,
              use a versioned SW script that triggers a new install cycle; the new SW can selectively migrate
              still-valid content cache entries rather than re-downloading all 500 pages.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
