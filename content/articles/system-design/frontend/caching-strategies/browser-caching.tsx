"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-browser-caching-concise",
  title: "Browser Caching",
  description: "Comprehensive guide to browser caching covering HTTP cache headers (Cache-Control, ETag, Last-Modified, Expires), browser cache storage, and best practices.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "browser-caching",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "HTTP", "Cache-Control", "ETag", "performance"],
  relatedTopics: ["service-worker-caching", "cdn-caching", "stale-while-revalidate"],
};

export default function BrowserCachingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Browser caching</strong> is a mechanism by which web browsers store copies of HTTP responses locally,
          allowing subsequent requests for the same resources to be served without making a network round-trip to the origin
          server. It is one of the most impactful performance optimizations available to frontend engineers because it operates
          at the edge of the network stack, eliminating latency and bandwidth consumption entirely for cached resources.
        </p>
        <p>
          HTTP caching has been part of the web since HTTP/1.0 introduced the <code>Expires</code> header in 1996. HTTP/1.1
          (RFC 2616, 1999) significantly expanded caching semantics with <code>Cache-Control</code>, <code>ETag</code>, and
          conditional request headers. The modern caching specification is defined in RFC 9111 (June 2022), which obsoletes
          the caching sections of RFC 7234 and provides clearer semantics for cache behavior. Understanding these mechanisms
          at a deep level is essential for staff-level engineers because misconfigured caching is one of the most common
          sources of production bugs (stale content, broken deployments, security leaks) and performance regressions.
        </p>
        <p>
          Modern browsers maintain multiple cache layers, each with different characteristics and performance profiles:
        </p>
        <ul>
          <li>
            <strong>Memory Cache (in-process):</strong> Stores resources in the browser process memory. Extremely fast (~0ms
            access time) but volatile, it is cleared when the tab or browser is closed. Typically used for resources loaded
            during the current navigation session, including preloaded resources, inline scripts, and sub-resources of the
            current page. Memory cache is not shared across tabs in most browsers.
          </li>
          <li>
            <strong>Disk Cache (HTTP Cache):</strong> Persists resources to disk using a content-addressable storage system.
            Access time is ~1-10ms depending on I/O speed. This is the primary HTTP cache that respects <code>Cache-Control</code> headers.
            It survives browser restarts and is shared across tabs and windows. Chrome&apos;s disk cache uses a custom LRU
            eviction algorithm and typically allocates up to 80% of available disk space (capped at ~320MB on mobile,
            several GB on desktop).
          </li>
          <li>
            <strong>Service Worker Cache (Cache API):</strong> A programmatic cache controlled via JavaScript that operates
            independently of the HTTP cache. It intercepts fetch requests and can implement custom caching strategies
            (cache-first, network-first, stale-while-revalidate). This is covered in the Service Worker Caching article.
          </li>
          <li>
            <strong>Push Cache (HTTP/2):</strong> A session-level cache for server-pushed resources. It has the shortest
            lifespan, existing only for the duration of the HTTP/2 connection. Resources in push cache are used only once
            and are not shared across connections. With HTTP/2 push being deprecated in Chrome 106+, this cache layer
            is becoming less relevant.
          </li>
        </ul>
        <p>
          The browser checks these caches in order: memory cache first, then disk cache, then service worker cache (if
          registered), then push cache, and finally the network. This hierarchy means a resource can be served from memory
          in under a millisecond, whereas a network request might take 50-500ms or more depending on connection quality
          and server location.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The HTTP caching model is built around two fundamental concepts: <strong>freshness</strong> (how long a cached
          response can be used without checking the server) and <strong>validation</strong> (how to check if a stale cached
          response is still valid). These are controlled through HTTP headers that the server sends with each response.
        </p>

        <h3>Cache-Control Directives</h3>
        <p>
          The <code>Cache-Control</code> header (RFC 9111) is the primary mechanism for controlling cache behavior. It accepts
          multiple comma-separated directives that can be combined to express precise caching intentions:
        </p>
        <ul>
          <li>
            <strong><code>max-age=N</code>:</strong> Specifies the maximum time in seconds that a response is considered
            fresh. After this duration, the response is stale and must be revalidated before use. Example:
            <code>max-age=3600</code> means the response is fresh for one hour. The freshness timer starts from the time
            the response was generated (indicated by the <code>Date</code> header), not from when it was received.
          </li>
          <li>
            <strong><code>s-maxage=N</code>:</strong> Like <code>max-age</code> but applies only to shared caches (CDNs,
            reverse proxies). It overrides <code>max-age</code> and <code>Expires</code> for shared caches while leaving
            browser cache behavior unchanged. This allows you to set aggressive caching at the CDN layer while maintaining
            shorter freshness for browsers. Example: <code>Cache-Control: max-age=60, s-maxage=3600</code> caches for
            1 minute in browsers but 1 hour at CDN.
          </li>
          <li>
            <strong><code>no-cache</code>:</strong> Despite the misleading name, this does NOT prevent caching. It forces
            the cache to revalidate the response with the origin server before every use, even if the response is fresh.
            The cached copy is stored but never served without first confirming it is still current. This is implemented
            via conditional requests using <code>If-None-Match</code> or <code>If-Modified-Since</code>.
          </li>
          <li>
            <strong><code>no-store</code>:</strong> The response must NOT be stored in any cache, including the browser&apos;s
            disk cache. This is the only directive that truly prevents caching. Use this for sensitive data like
            authentication tokens, financial transactions, or personally identifiable information. Note that memory cache
            behavior with <code>no-store</code> varies across browsers; some browsers may still briefly keep the response
            in memory cache for the duration of the navigation.
          </li>
          <li>
            <strong><code>public</code>:</strong> Indicates that the response may be stored by any cache, including shared
            caches like CDNs. This is the default for responses without <code>Authorization</code> headers. Explicitly
            setting <code>public</code> also allows caching of responses to requests with <code>Authorization</code> headers,
            which would otherwise be treated as private.
          </li>
          <li>
            <strong><code>private</code>:</strong> The response is intended for a single user and must NOT be stored by
            shared caches (CDNs, proxy servers). Only the user&apos;s browser may cache it. Use this for user-specific
            content like profile pages, personalized dashboards, or shopping carts.
          </li>
          <li>
            <strong><code>must-revalidate</code>:</strong> Once a response becomes stale, the cache MUST revalidate it
            with the origin server before using it. Without this directive, caches may serve stale responses in certain
            conditions (e.g., when the origin server is unreachable). This prevents serving stale content during server
            outages, which could be problematic for data integrity.
          </li>
          <li>
            <strong><code>immutable</code>:</strong> Indicates that the response body will not change over time. The
            browser should not send conditional requests for revalidation, even when the user explicitly reloads the page.
            This is designed for content-addressed URLs (files with content hashes in their names, like
            <code>app.3f8a2b.js</code>). Supported in Firefox, Safari, and Chrome 100+. This saves bandwidth on reload
            by preventing unnecessary conditional requests.
          </li>
          <li>
            <strong><code>stale-while-revalidate=N</code>:</strong> Allows the cache to serve a stale response while
            asynchronously revalidating it in the background. The parameter <code>N</code> specifies how many seconds
            past the <code>max-age</code> the stale response can be served. Example: <code>max-age=60,
            stale-while-revalidate=30</code> means the response is fresh for 60 seconds, and for the next 30 seconds
            after that, the stale version can be served immediately while a background revalidation request is made.
          </li>
          <li>
            <strong><code>stale-if-error=N</code>:</strong> Permits serving a stale response if the revalidation request
            fails (server error, network timeout). This provides resilience against origin server failures. Example:
            <code>max-age=300, stale-if-error=86400</code> means the cache may serve a stale response for up to 24 hours
            if the server returns a 5xx error or is unreachable.
          </li>
        </ul>

        <h3>ETag (Entity Tag)</h3>
        <p>
          An <code>ETag</code> is an opaque identifier assigned by the server to a specific version of a resource. When
          the resource changes, the server assigns a new ETag. ETags come in two forms:
        </p>
        <ul>
          <li>
            <strong>Strong ETags</strong> (e.g., <code>ETag: &quot;33a64df5&quot;</code>): Indicate byte-for-byte
            identity. Two resources with the same strong ETag are identical in every way. Used for range requests and
            byte-level validation.
          </li>
          <li>
            <strong>Weak ETags</strong> (e.g., <code>ETag: W/&quot;33a64df5&quot;</code>): Indicate semantic equivalence.
            Two resources with the same weak ETag are functionally equivalent but may differ at the byte level (e.g.,
            different whitespace, different <code>Date</code> headers in an HTML page). Weak ETags cannot be used for
            range requests.
          </li>
        </ul>
        <p>
          When revalidating a cached response, the browser sends the cached ETag in an <code>If-None-Match</code> header.
          If the server&apos;s current ETag matches, it responds with <code>304 Not Modified</code> (no body), and the
          browser uses the cached version. This saves significant bandwidth, especially for large resources.
        </p>

        <h3>Last-Modified / If-Modified-Since</h3>
        <p>
          The <code>Last-Modified</code> header indicates the date and time the resource was last changed on the server.
          It has second-level granularity (HTTP-date format). When revalidating, the browser sends
          <code>If-Modified-Since</code> with the cached <code>Last-Modified</code> value. If the resource has not changed
          since that time, the server responds with 304. This mechanism predates ETags and is less precise (one-second
          resolution vs. content-based hashing), but it is simpler to implement and still widely used as a fallback.
        </p>
        <p>
          When both <code>ETag</code> and <code>Last-Modified</code> are present, the browser sends both
          <code>If-None-Match</code> and <code>If-Modified-Since</code> in the conditional request, but the server
          MUST give precedence to <code>If-None-Match</code> per the HTTP specification.
        </p>

        <h3>Expires Header (Legacy)</h3>
        <p>
          The <code>Expires</code> header specifies an absolute date/time after which the response is considered stale.
          Example: <code>Expires: Thu, 01 Dec 2026 16:00:00 GMT</code>. It was the original caching mechanism in HTTP/1.0
          and is now superseded by <code>Cache-Control: max-age</code>. When both are present, <code>max-age</code> takes
          precedence. The main drawback of <code>Expires</code> is that it requires synchronized clocks between server
          and client, which is unreliable. Modern applications should use <code>Cache-Control</code> exclusively.
        </p>

        <h3>Vary Header</h3>
        <p>
          The <code>Vary</code> header tells caches that the response varies based on certain request headers. For example,
          <code>Vary: Accept-Encoding</code> means the server may return different content (gzip, brotli, identity) based
          on the <code>Accept-Encoding</code> request header, so the cache must store separate copies for each encoding.
          Common values include <code>Vary: Accept-Encoding, Accept-Language</code>. Overusing <code>Vary</code> (e.g.,
          <code>Vary: User-Agent</code>) can fragment the cache excessively and reduce hit rates.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Understanding how the browser decides whether to serve from cache or make a network request is critical for
          debugging caching issues and designing optimal caching strategies. The following diagram illustrates the
          complete decision flow:
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/http-cache-flow.svg"
          alt="HTTP Cache Decision Flow"
          caption="How browsers decide whether to serve content from cache or make a network request"
        />

        <p>
          The cache decision process follows a strict hierarchy. When the browser needs a resource, it first checks the
          memory cache (fastest, ~0ms). If the resource is not in memory, it checks the disk cache. If found on disk,
          the browser evaluates freshness: is the <code>max-age</code> still valid? If fresh, the cached response is
          served without any network activity. This is called a <strong>cache hit</strong> and appears as
          &quot;(from memory cache)&quot; or &quot;(from disk cache)&quot; in Chrome DevTools.
        </p>
        <p>
          When a cached response is stale (past its <code>max-age</code>), the browser performs a <strong>conditional
          request</strong>. It sends the cached ETag in an <code>If-None-Match</code> header or the
          <code>Last-Modified</code> value in an <code>If-Modified-Since</code> header. The server checks whether the
          resource has changed. If unchanged, it responds with <code>304 Not Modified</code> and empty body, which is
          typically 200-400 bytes versus the full resource payload. The browser then serves the cached version and resets
          the freshness timer. If the resource has changed, the server responds with <code>200 OK</code> and the full
          new content, which replaces the cached entry.
        </p>
        <p>
          For choosing which cache headers to use for different types of resources, the following decision tree provides
          a practical guide:
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/cache-headers-decision.svg"
          alt="Cache Headers Decision Tree"
          caption="Decision tree for selecting appropriate cache headers based on resource type"
        />

        <p>
          The cache lifecycle shows how a resource transitions through states over time, including initial fetch,
          cache hits during the freshness window, revalidation after expiration, and eventual replacement when the
          resource changes on the server:
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/cache-lifecycle.svg"
          alt="Cache Lifecycle Timeline"
          caption="Timeline showing how a cached resource progresses through fresh, stale, revalidation, and replacement states"
        />

        <h3>Cache Key Construction</h3>
        <p>
          Browsers construct cache keys from the request URL (including query parameters) and the method (GET only for
          most browsers). The <code>Vary</code> header further differentiates entries. For example, a request to
          <code>/api/data?page=1</code> and <code>/api/data?page=2</code> are cached as separate entries. Similarly,
          if the response includes <code>Vary: Accept-Encoding</code>, the browser stores separate cached versions
          for <code>gzip</code> and <code>br</code> encodings. Understanding cache key construction is important for
          avoiding cache pollution (too many unique keys) and cache collisions (unintended key matches).
        </p>

        <h3>Cache Partitioning</h3>
        <p>
          Modern browsers (Chrome 86+, Firefox 85+, Safari 15+) implement <strong>cache partitioning</strong> (also
          called &quot;double-keyed caching&quot;) to prevent cross-site tracking. The cache key includes both the
          top-level site and the requesting origin. This means that a resource loaded from <code>cdn.example.com</code> on
          <code>site-a.com</code> creates a different cache entry than the same resource loaded on <code>site-b.com</code>.
          Cache partitioning reduces the effectiveness of shared CDN caching but is a necessary privacy protection that
          prevents cache-based timing attacks and user fingerprinting.
        </p>
      </section>

      {/* Section 4: Implementation Examples */}
      <section>
        <h2>Implementation Examples</h2>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      {/* Section 5: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          Each caching mechanism has distinct trade-offs in terms of precision, performance, server overhead, and
          browser support. The following table compares the four primary HTTP caching mechanisms:
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Mechanism</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Precision</th>
              <th className="p-3 text-left">Network Cost</th>
              <th className="p-3 text-left">Server Overhead</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Cache-Control: max-age</strong></td>
              <td className="p-3">Freshness</td>
              <td className="p-3">Time-based (seconds)</td>
              <td className="p-3">Zero (no request during fresh period)</td>
              <td className="p-3">None during fresh period</td>
              <td className="p-3">Static assets with content hashes, resources with predictable update cycles</td>
            </tr>
            <tr>
              <td className="p-3"><strong>ETag</strong></td>
              <td className="p-3">Validation</td>
              <td className="p-3">Content-based (hash/version)</td>
              <td className="p-3">Conditional request (~200-400 bytes on 304)</td>
              <td className="p-3">Must compute/store ETags per resource</td>
              <td className="p-3">API responses, dynamic content, resources where content-based freshness matters</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Last-Modified</strong></td>
              <td className="p-3">Validation</td>
              <td className="p-3">Time-based (1-second resolution)</td>
              <td className="p-3">Conditional request (~200-400 bytes on 304)</td>
              <td className="p-3">Must track modification timestamps</td>
              <td className="p-3">File-based resources, CMS content, when ETag computation is expensive</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Expires</strong></td>
              <td className="p-3">Freshness (legacy)</td>
              <td className="p-3">Absolute date (requires clock sync)</td>
              <td className="p-3">Zero (no request during fresh period)</td>
              <td className="p-3">None during fresh period</td>
              <td className="p-3">Legacy systems, HTTP/1.0 compatibility (use max-age instead)</td>
            </tr>
          </tbody>
        </table>

        <h3>Combining Mechanisms</h3>
        <p>
          In practice, you should combine freshness and validation headers. A common production pattern is:
        </p>
        <ul>
          <li>
            <strong>Static assets with hashes:</strong> <code>Cache-Control: public, max-age=31536000, immutable</code>
            (no ETag needed since the URL changes when content changes)
          </li>
          <li>
            <strong>HTML documents:</strong> <code>Cache-Control: no-cache</code> + <code>ETag</code> (always revalidate
            to get the latest asset URLs)
          </li>
          <li>
            <strong>API responses:</strong> <code>Cache-Control: private, max-age=0, must-revalidate</code> +
            <code>ETag</code> (cache in browser only, always revalidate)
          </li>
        </ul>

        <h3>max-age vs. no-cache vs. no-store</h3>
        <p>
          These three directives represent a spectrum from maximum caching to zero caching. <code>max-age=N</code> allows
          serving from cache without any network activity for N seconds. <code>no-cache</code> stores the response but
          requires revalidation before every use (conditional request, possible 304). <code>no-store</code> prevents
          storing the response entirely (full request every time). The choice depends on the acceptable staleness window
          and sensitivity of the data. Using <code>no-store</code> when <code>no-cache</code> would suffice wastes
          bandwidth; using <code>max-age</code> when <code>no-cache</code> is needed causes stale content bugs.
        </p>
      </section>

      {/* Section 6: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use content hashes in static asset filenames:</strong> Generate filenames like <code>app.3f8a2b.js</code>
            using your build tool (webpack, Vite, esbuild). This creates a new URL when content changes, making it safe to
            use <code>max-age=31536000, immutable</code>. This is the single most impactful caching optimization because
            it eliminates all network requests for unchanged assets. Configure your bundler to produce deterministic hashes
            based on file content, not build timestamp, so identical source produces identical filenames across builds.
          </li>
          <li>
            <strong>Always revalidate HTML entry points:</strong> Use <code>Cache-Control: no-cache</code> with
            <code>ETag</code> for your HTML pages. Since HTML files reference hashed static assets, users must always get
            the latest HTML to discover new asset URLs after deployments. If HTML is cached with <code>max-age</code>,
            users may load the old HTML that references old JavaScript bundles that no longer exist on the server, causing
            broken applications. This is the most common deployment-related caching bug.
          </li>
          <li>
            <strong>Set Cache-Control explicitly on every response:</strong> Do not rely on browser heuristic caching.
            When no <code>Cache-Control</code> or <code>Expires</code> header is present, browsers use heuristic freshness
            (typically 10% of the time since <code>Last-Modified</code>). This heuristic behavior is unpredictable and
            can lead to stale content that is difficult to debug. Always be explicit about your caching intent.
          </li>
          <li>
            <strong>Use <code>private</code> for user-specific content:</strong> Any response containing user-specific
            data must include <code>Cache-Control: private</code> to prevent CDNs and shared proxies from storing it.
            Without this, a CDN could cache one user&apos;s profile page and serve it to another user. This is both a
            privacy violation and a security vulnerability, especially for applications handling PII or financial data.
          </li>
          <li>
            <strong>Implement <code>stale-while-revalidate</code> for frequently-accessed, infrequently-updated
            content:</strong> This directive provides instant cache hits while ensuring freshness in the background.
            It is ideal for blog posts, documentation pages, product listings, and other content that changes occasionally.
            Example: <code>max-age=300, stale-while-revalidate=600</code> serves fresh content for 5 minutes, then serves
            stale for up to 10 more minutes while revalidating in the background.
          </li>
          <li>
            <strong>Add <code>Vary: Accept-Encoding</code> to compressible responses:</strong> If your server serves
            different encodings (gzip, brotli, identity), include <code>Vary: Accept-Encoding</code> so caches store
            separate versions for each encoding. Without this, a cache might serve a brotli-compressed response to a
            browser that only supports gzip. Avoid <code>Vary: *</code> or <code>Vary: User-Agent</code> as they
            fragment the cache excessively, reducing hit rates to near zero.
          </li>
          <li>
            <strong>Use <code>no-store</code> sparingly and correctly:</strong> Only use <code>no-store</code> for
            genuinely sensitive data (auth tokens, financial transactions, PII in API responses). For most API responses
            where you want freshness, <code>no-cache</code> with <code>ETag</code> is sufficient and far more efficient.
            Each <code>no-store</code> response results in a full download every time, whereas <code>no-cache</code>
            with ETag results in lightweight 304 responses when content has not changed.
          </li>
          <li>
            <strong>Test caching behavior in production-like environments:</strong> Chrome DevTools &quot;Disable cache&quot;
            checkbox only affects the disk cache when DevTools is open. Use the Network tab&apos;s &quot;Size&quot; column
            to verify cache behavior: &quot;(from memory cache)&quot;, &quot;(from disk cache)&quot;, or actual byte sizes.
            Use <code>curl -I</code> to inspect raw response headers. Lighthouse and WebPageTest also provide cache
            diagnostics.
          </li>
        </ol>
      </section>

      {/* Section 7: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Confusing <code>no-cache</code> with <code>no-store</code>:</strong> This is the most common caching
            misconception. <code>no-cache</code> does NOT prevent caching; it forces revalidation before each use.
            <code>no-store</code> is the directive that prevents caching entirely. Using <code>no-cache</code> when you
            mean <code>no-store</code> means the response is still stored on disk, which is a security risk for sensitive
            data. Conversely, using <code>no-store</code> when you mean <code>no-cache</code> wastes bandwidth by forcing
            full downloads every time.
          </li>
          <li>
            <strong>Caching HTML with long <code>max-age</code>:</strong> If your HTML file references hashed static
            assets (e.g., <code>{'&lt;'}script src="/app.3f8a2b.js"{'&gt;'}</code>), caching the HTML means users continue
            requesting the old JS file after a deployment. If the old JS file is deleted from the server (common with
            new deployments), the application breaks entirely. Always use <code>no-cache</code> on HTML entry points.
          </li>
          <li>
            <strong>Setting <code>max-age</code> without content hashing:</strong> If you use <code>max-age=31536000</code>
            on <code>/app.js</code> (without a hash in the filename), you have no way to bust the cache when the file
            changes. Users will be stuck with the old version until <code>max-age</code> expires. Cache busting via query
            strings (<code>/app.js?v=2</code>) is unreliable because some CDNs and proxies ignore query strings for
            caching purposes.
          </li>
          <li>
            <strong>Forgetting <code>Vary: Accept-Encoding</code>:</strong> If your server negotiates content encoding
            (gzip, brotli) but does not include <code>Vary: Accept-Encoding</code>, a shared cache (CDN) may serve a
            brotli-compressed response to a client that only supports gzip, resulting in garbled content. Most modern
            CDNs handle this automatically, but custom proxy setups often miss it.
          </li>
          <li>
            <strong>Ignoring cache partitioning in performance analysis:</strong> Cache partitioning (double-keyed caching)
            means third-party resources loaded on your site are not shared with other sites. If you assume a user has
            Google Fonts cached because &quot;everyone uses Google Fonts,&quot; you are wrong in modern browsers. Each
            top-level site has its own cache partition. This affects performance budgets and loading strategies for
            third-party resources.
          </li>
          <li>
            <strong>Using <code>max-age=0</code> instead of <code>no-cache</code>:</strong> While functionally similar
            in many browsers, <code>max-age=0</code> and <code>no-cache</code> have subtle differences. <code>max-age=0</code>
            marks the response as immediately stale, and without <code>must-revalidate</code>, some caches may still
            serve the stale response in certain conditions (e.g., disconnected mode). <code>no-cache</code> explicitly
            requires revalidation before every use, regardless of network conditions.
          </li>
          <li>
            <strong>Over-relying on ETags without understanding server behavior:</strong> In load-balanced environments,
            different backend servers may generate different ETags for the same content (especially if ETags are based
            on inode number + size + modification time, as Apache&apos;s default). This causes unnecessary cache
            invalidation when requests hit different servers. Use content-based ETags (hash of response body) or
            disable ETags and use <code>Last-Modified</code> in such environments.
          </li>
        </ul>
      </section>

      {/* Section 8: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Understanding how production systems implement caching strategies provides valuable context for system design
          interviews and real-world architecture decisions.
        </p>
        <h3>SPA with Content-Hashed Assets</h3>
        <p>
          The most common production pattern for React/Next.js applications. The HTML entry point (<code>index.html</code>)
          uses <code>Cache-Control: no-cache</code> with <code>ETag</code>, ensuring users always get the latest asset
          references. All JavaScript, CSS, and image assets use content hashes in filenames and are served with
          <code>Cache-Control: public, max-age=31536000, immutable</code>. This pattern achieves near-zero cache-related
          bugs while maximizing cache hit rates for static assets. Webpack, Vite, and other modern bundlers support this
          natively.
        </p>
        <h3>API-Heavy Dashboard Applications</h3>
        <p>
          Applications like analytics dashboards, admin panels, and monitoring tools make frequent API calls. For
          non-personalized data (aggregated metrics, system-wide statistics), use <code>Cache-Control: public,
          max-age=30, stale-while-revalidate=60</code> with <code>ETag</code>. For user-specific data (personal
          dashboards, settings), use <code>Cache-Control: private, no-cache</code> with <code>ETag</code>. This
          combination allows instant page loads from cache while ensuring data freshness through background revalidation.
        </p>
        <h3>E-Commerce Product Pages</h3>
        <p>
          Product detail pages benefit from aggressive caching of product images and descriptions (these change
          infrequently) while requiring real-time accuracy for pricing and inventory. Images: <code>max-age=86400</code>
          with content hash. Product data API: <code>max-age=300, stale-while-revalidate=600</code>. Pricing/inventory
          API: <code>no-cache</code> with <code>ETag</code>. Cart and checkout: <code>no-store</code> for payment
          processing endpoints.
        </p>
        <h3>Content Publishing Platforms</h3>
        <p>
          Platforms like Medium, Dev.to, and documentation sites serve content that changes infrequently after initial
          publication. They typically use <code>Cache-Control: public, max-age=600, stale-while-revalidate=86400</code>
          for published articles. This means content is fresh for 10 minutes, and for the next 24 hours, the stale
          version is served instantly while a background revalidation ensures the cache is updated. Combined with CDN
          cache invalidation on content updates, this provides both performance and freshness.
        </p>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-2 font-semibold">When NOT to Cache</h3>
          <p>
            Not all resources should be cached. Avoid caching in these scenarios:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Authentication endpoints</strong> (<code>/api/login</code>, <code>/api/token/refresh</code>):
              Responses contain sensitive tokens that must never persist in disk cache. Use <code>no-store</code>.
            </li>
            <li>
              <strong>Real-time data feeds:</strong> WebSocket connections, Server-Sent Events, and polling endpoints
              for live data (stock prices, chat messages) should use <code>no-store</code> since cached data is
              immediately outdated and misleading.
            </li>
            <li>
              <strong>User-generated content moderation queues:</strong> Content that may be flagged or removed should
              not be cached at shared cache layers. Use <code>private, no-cache</code> at minimum.
            </li>
            <li>
              <strong>GDPR/privacy-regulated responses:</strong> Responses containing PII that users may request to be
              deleted cannot be cached in shared caches, as cache invalidation in CDNs is not guaranteed to be immediate
              or complete.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9111" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 9111 - HTTP Caching (June 2022)
            </a> - The authoritative specification for HTTP caching semantics, replacing RFC 7234
          </li>
          <li>
            <a href="https://web.dev/articles/http-cache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Prevent unnecessary network requests with the HTTP Cache
            </a> - Google&apos;s comprehensive guide to HTTP caching with practical examples
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - HTTP Caching
            </a> - Mozilla&apos;s reference documentation covering all cache-related headers and behaviors
          </li>
          <li>
            <a href="https://csswizardry.com/2019/03/cache-control-for-civilians/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cache-Control for Civilians - Harry Roberts
            </a> - An accessible, in-depth explanation of Cache-Control directives and their interactions
          </li>
          <li>
            <a href="https://jakearchibald.com/2016/caching-best-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Caching Best Practices & max-age Gotchas - Jake Archibald
            </a> - Classic article on common caching mistakes and the immutable pattern
          </li>
        </ul>
      </section>

      {/* Section 10: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-semibold">Q: What is the difference between <code>Cache-Control: no-cache</code> and <code>Cache-Control: no-store</code>, and when would you use each?</p>
          <p className="mt-2 text-sm">
            A: <code>no-cache</code> allows the browser to store the response in its cache but requires revalidation
            with the origin server before every use. The browser sends a conditional request
            (<code>If-None-Match</code> with ETag or <code>If-Modified-Since</code>), and if the resource has not
            changed, the server responds with <code>304 Not Modified</code> (no body), saving bandwidth. The response
            IS stored on disk. Use this for content that must always be fresh but benefits from conditional caching,
            such as HTML entry points and API responses.
            <br /><br />
            <code>no-store</code> instructs the cache to never store the response at all. No conditional requests
            are possible because there is nothing cached to validate against. Every request results in a full download.
            Use this for genuinely sensitive data: authentication tokens, payment processing responses, PII in API
            responses, or any data that must not persist on the user&apos;s device for security or compliance reasons
            (HIPAA, PCI-DSS, GDPR).
            <br /><br />
            The critical mistake engineers make is using <code>no-store</code> everywhere &quot;to be safe.&quot;
            This wastes significant bandwidth. A 500KB API response that changes rarely costs 500KB on every request
            with <code>no-store</code>, versus ~300 bytes with <code>no-cache</code> + ETag when the content has not
            changed.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-semibold">Q: How would you design a caching strategy for a production SPA deployment to ensure users always get the latest version without breaking the cache?</p>
          <p className="mt-2 text-sm">
            A: The standard production pattern uses a two-tier approach. First, all static assets (JS, CSS, images, fonts)
            are built with content hashes in their filenames (e.g., <code>main.a1b2c3d4.js</code>). These are served with
            <code>Cache-Control: public, max-age=31536000, immutable</code>. Since the filename changes whenever the
            content changes, a one-year max-age is perfectly safe, and <code>immutable</code> prevents unnecessary
            revalidation on reload.
            <br /><br />
            Second, the HTML entry point (<code>index.html</code>) must always be revalidated because it contains the
            <code>{'&lt;'}script{'&gt;'}</code> and <code>{'&lt;'}link{'&gt;'}</code> tags that reference the current hashed asset filenames.
            It is served with <code>Cache-Control: no-cache</code> and an <code>ETag</code>. On every page load, the
            browser checks if the HTML has changed (lightweight 304 if not), and if a new deployment has occurred, the
            new HTML references new hashed asset URLs, which are fetched fresh.
            <br /><br />
            This pattern ensures: (1) static assets are cached for maximum performance, (2) deployments are reflected
            immediately because the HTML always points to the latest assets, (3) old assets remain cacheable during
            the transition period (important for in-flight navigation during deploys), and (4) no manual cache busting
            is needed.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-semibold">Q: Explain cache partitioning in modern browsers. How does it affect performance assumptions and third-party resource loading?</p>
          <p className="mt-2 text-sm">
            A: Cache partitioning (also called &quot;double-keyed caching&quot; or &quot;cache isolation&quot;) is a
            privacy feature implemented in Chrome 86+, Firefox 85+, and Safari (since inception with ITP). In
            traditional caching, if a user visited site-a.com which loaded <code>cdn.example.com/library.js</code>,
            that file would be cached and reused when site-b.com also loaded the same URL. Partitioning changes this
            by adding the top-level site to the cache key, so the file is cached separately for each site.
            <br /><br />
            This fundamentally breaks the assumption that shared CDN resources benefit from cross-site caching. Popular
            resources from Google Fonts, jQuery CDN, or cdnjs are no longer &quot;pre-cached&quot; from other sites.
            Each site effectively starts with a cold cache for third-party resources.
            <br /><br />
            The performance implications are significant: (1) self-hosting third-party libraries is now equally fast
            as using CDNs (no cross-site cache advantage), (2) you should self-host critical resources and bundle them
            to reduce request count, (3) third-party resource loading should be treated as cold-cache in performance
            budgets, and (4) preloading (<code>{'&lt;'}link rel=&quot;preload&quot;{'&gt;'}</code>) third-party resources
            becomes more important since you cannot assume they are cached.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
