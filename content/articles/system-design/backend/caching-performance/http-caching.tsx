"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-http-caching",
  title: "HTTP Caching",
  description:
    "Deep dive into HTTP caching headers (Cache-Control, ETag, Last-Modified, Vary), browser caching, proxy caching, revalidation patterns, and production-tested strategies for correctness and performance at scale.",
  category: "backend",
  subcategory: "caching-performance",
  slug: "http-caching",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: ["backend", "http", "caching", "browser", "proxy", "revalidation"],
  relatedTopics: ["cdn-caching", "cache-coherence", "page-caching"],
};

export default function ArticlePage() {
  const BASE_PATH = "/diagrams/system-design-concepts/backend/caching-performance";

  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          HTTP caching is the mechanism by which browsers and intermediary proxies (CDNs, reverse proxies, corporate proxies) store HTTP responses and reuse them for subsequent requests, governed by standardized headers defined in RFC 7234 (HTTP/1.1 Caching) and RFC 7232 (Conditional Requests). Unlike application-level caching, which is managed by code within the application process, HTTP caching is a protocol-level contract between the server that produces the response, the caches that store it, and the client that consumes it. The server communicates its caching intent through response headers, the caches enforce those directives, and the client benefits from reduced latency and bandwidth consumption without any application logic.
        </p>
        <p>
          The HTTP caching model operates on two complementary principles: freshness and validation. Freshness determines how long a cached response can be served without checking with the origin, controlled primarily by the Cache-Control header&apos;s max-age directive. Validation determines how a cache verifies that a cached response is still current after its freshness window expires, controlled by ETag (entity tag) or Last-Modified headers in conjunction with conditional request headers (If-None-Match and If-Modified-Since). When a cached response is fresh, the cache serves it directly. When it is stale, the cache sends a conditional request to the origin: if the origin confirms the response is unchanged (returning 304 Not Modified), the cache extends the freshness window and serves the cached response; if the origin provides a new response (returning 200 OK), the cache replaces the stale entry and serves the new response.
        </p>
        <p>
          For staff and principal engineers, HTTP caching is both a powerful performance optimization and a significant source of production incidents. Correctly configured, HTTP caching can reduce origin load by 60 to 90 percent, cut bandwidth costs, and dramatically improve user-perceived latency. Misconfigured, it can serve stale content to millions of users, leak personalized data through shared caches, or cause cache poisoning through incorrect Vary headers. The header directives are a precise protocol contract: a single incorrect directive (Cache-Control: public on a personalized response, missing Vary on a content-negotiated response, an ETag that does not change when content changes) can produce subtle correctness bugs that are difficult to detect and expensive to remediate. Understanding the full HTTP caching model, including the interaction between multiple cache participants, the nuances of each header directive, and the production patterns that prevent common failures, is essential for anyone architecting web-scale systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The HTTP caching model is defined by a set of headers that collectively control what can be cached, by whom, for how long, and how stale content is revalidated. Each header serves a specific purpose, and their interactions determine the overall caching behavior across the entire request-response chain.
        </p>
        <p>
          The Cache-Control header is the primary directive that controls caching behavior. Its most important directives are: max-age, which specifies the number of seconds a response remains fresh; s-maxage, which overrides max-age for shared caches (CDNs, proxies) while leaving browser caching unchanged; public, which allows shared caches to store the response; private, which restricts caching to the browser cache only; no-store, which prohibits any cache from storing the response; no-cache, which allows caching but requires revalidation before serving a stored response; and must-revalidate, which requires the cache to revalidate with the origin once the freshness window expires, rather than serving stale content. The combination of these directives determines the caching behavior for each response, and the correct combination depends on the content type, privacy requirements, and freshness needs of the response.
        </p>
        <p>
          ETag (entity tag) headers provide a validation mechanism for conditional requests. An ETag is an opaque identifier (typically a hash or version string) that the server generates for a specific version of a response. When the client receives a response with an ETag, it stores the ETag alongside the cached response. On the next request for the same resource, the client includes an If-None-Match header with the stored ETag value. The server compares the If-None-Match value against the current ETag for the resource: if they match, the server returns 304 Not Modified with no body, and the client serves the cached response; if they differ, the server returns 200 OK with the new response body. ETags are preferred over Last-Modified for validation because they are more precise (a hash changes whenever any byte of the response changes, whereas Last-Modified has only second-level granularity) and they handle resources that change without a modification timestamp change (for example, a resource regenerated from the same input data).
        </p>
        <p>
          The Vary header controls cache key composition by specifying which request headers should be considered when determining whether a cached response matches a new request. For example, if a response varies based on the Accept-Language header (serving different content for English vs. Japanese users), the server must include Vary: Accept-Language in the response. This tells the cache to store separate entries for each language variant and to select the correct entry based on the incoming request&apos;s Accept-Language header. Without the Vary header, the cache would serve the first cached variant to all users regardless of their language preference, which is a correctness bug. The Vary header is particularly critical for content-negotiated responses (language, encoding, device class) and is a common source of cache poisoning bugs when misconfigured.
        </p>
        <p>
          HTTP caching involves multiple participants: the browser cache (private, user-specific), shared proxies and CDNs (public, multi-user), and the origin server (authoritative). Each participant enforces the caching directives independently, but with different implications. A Cache-Control: public response can be stored by any participant, while a Cache-Control: private response can be stored only by the browser cache. A Cache-Control: no-store response cannot be stored by any participant. The distinction between public and private caching is a security boundary: marking personalized data as public allows shared caches to store and serve it to other users, which is a data-leakage vulnerability.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The HTTP caching architecture spans the entire request-response chain, with caching decisions made at each participant (browser, proxy, CDN, origin) based on the headers present in the request and response. Understanding the flow through each participant is essential for designing systems that cache correctly.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/http-cache-headers.svg`}
          alt="HTTP caching header decision tree showing Cache-Control directives, ETag/Last-Modified validation flow, and Vary-based cache key composition"
          caption="HTTP caching header interactions: freshness directives, validation mechanisms, and cache key composition through Vary"
        />

        <p>
          The request flow begins with the browser checking its local cache for a fresh entry matching the request URL and cache key (including Vary headers). On a cache hit with a fresh entry, the browser serves the cached response immediately without any network request. On a cache hit with a stale entry, the browser sends a conditional request to the next participant (a proxy, CDN, or the origin) with the If-None-Match or If-Modified-Since header. On a cache miss, the browser sends a full request. Each intermediate participant (proxy, CDN) repeats this process: check its cache for a fresh entry, serve it on a hit, send a conditional request on a stale hit, or forward the full request to the next participant on a miss. The response flows back through the chain, with each participant caching it according to the Cache-Control directives before passing it to the previous participant.
        </p>
        <p>
          The revalidation flow is where HTTP caching achieves its balance between freshness and efficiency. When a cached response&apos;s freshness window expires, the cache does not immediately discard it. Instead, it sends a conditional request to the origin with the stored ETag or Last-Modified value. If the origin confirms the response is unchanged (304 Not Modified), the cache resets the freshness clock and continues serving the cached response, saving the bandwidth cost of retransmitting the full response body. This is particularly valuable for large responses (images, JavaScript bundles, API responses with substantial payloads) where the conditional request overhead is negligible compared to the full response transfer cost. If the origin detects the response has changed, it returns 200 OK with the new response body, and the cache replaces the stale entry.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/http-cache-revalidation.svg`}
          alt="HTTP revalidation flow showing browser conditional request with If-None-Match, origin 304 Not Modified response, and cache freshness extension"
          caption="Revalidation flow: conditional request with If-None-Match, 304 Not Modified response, and cache freshness extension"
        />

        <p>
          The interaction between Cache-Control, ETag, and Vary determines the complete caching behavior. Consider a response with Cache-Control: public, max-age=300, s-maxage=3600, ETag: &quot;abc123&quot;, and Vary: Accept-Language. A browser receiving this response caches it for 300 seconds (5 minutes). A CDN receiving the same response caches it for 3600 seconds (1 hour), because s-maxage overrides max-age for shared caches. After the freshness window expires, both the browser and the CDN send conditional requests with If-None-Match: &quot;abc123&quot;. The Vary: Accept-Language header ensures that the browser cache and the CDN store separate entries for each language variant, so a request with Accept-Language: en and a request with Accept-Language: ja are treated as different cache keys.
        </p>
        <p>
          The stale-while-revalidate and stale-if-error directives provide additional flexibility for managing the trade-off between freshness and availability. Stale-while-revalidate (stale-while-revalidate=N) allows a cache to serve a stale response for up to N seconds after the freshness window expires while asynchronously revalidating with the origin in the background. The next request receives the fresh response. This eliminates the revalidation latency spike that users would otherwise experience when a cached response expires, at the cost of serving slightly stale data for one request cycle. Stale-if-error (stale-if-error=N) allows a cache to serve a stale response when the origin returns an error (5xx), for up to N seconds after the freshness window expires. This provides resilience against origin failures, ensuring that users see cached content rather than error pages during origin outages.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/http-cache-participants.svg`}
          alt="HTTP caching participants showing browser cache (private), CDN/proxy cache (shared), and origin server, with request/response flow and Cache-Control directive enforcement at each layer"
          caption="HTTP caching participants: browser cache, shared proxy/CDN, and origin server, each enforcing Cache-Control directives independently"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Immutable Asset Caching</h3>
          <p>
            The Cache-Control: immutable directive (supported by most modern browsers) tells the browser that the response will not change during its freshness window, so the browser should not send a conditional request even when the user refreshes the page (which normally triggers revalidation). This is designed for content-addressed assets with fingerprinted URLs (for example, /static/app.abc123.js), where the URL itself changes when the content changes. Combined with a long max-age (1 year), immutable caching eliminates all revalidation requests for static assets, reducing server load and improving page load performance. The critical requirement is that the URL must change whenever the content changes, typically through content hashing in the build pipeline. If a fingerprinted URL serves different content at different times, the immutable directive causes the browser to serve stale content indefinitely, which is a correctness bug that is difficult to detect and fix.
          </p>
        </div>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>ETag vs Last-Modified</strong>
              </td>
              <td className="p-3">
                ETags are byte-level precise, handle regenerated content, and work without modification timestamps. Last-Modified is simpler, requires no server-side hash computation, and is universally supported.
              </td>
              <td className="p-3">
                ETags require server-side computation and storage (hash or version). Last-Modified has second-level granularity, cannot detect sub-second changes, and fails for resources without a clear modification timestamp.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Long max-age + Revalidation vs Short max-age</strong>
              </td>
              <td className="p-3">
                Long max-age with ETag revalidation maximizes cache efficiency: fresh responses serve from cache, stale responses revalidate with minimal bandwidth (304 with no body). Reduces origin load and bandwidth costs.
              </td>
              <td className="p-3">
                Long max-age increases staleness window. If the content changes before max-age expires, users see stale content until revalidation. Short max-age keeps data fresh but reduces cache efficiency.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Public vs Private Caching</strong>
              </td>
              <td className="p-3">
                Public caching enables shared caches (CDNs, proxies) to store and serve responses, dramatically reducing origin load and improving latency for all users. Private caching protects user data by restricting caching to the browser only.
              </td>
              <td className="p-3">
                Public caching of personalized data is a security vulnerability. Private caching forfeits the origin-load reduction benefit of shared caches, increasing origin load for personalized endpoints.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Stale-While-Revalidate</strong>
              </td>
              <td className="p-3">
                Eliminates revalidation latency spikes by serving stale content while refreshing in the background. Improves user-perceived latency for content with tight freshness budgets.
              </td>
              <td className="p-3">
                Users see stale content for one request cycle. The staleness window is unbounded (depends on when the background revalidation completes). Not suitable for high-sensitivity data.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Immutable Asset Caching</strong>
              </td>
              <td className="p-3">
                Eliminates all revalidation requests for static assets. Maximum cache efficiency with long TTLs. Ideal for fingerprinted URLs in modern build pipelines.
              </td>
              <td className="p-3">
                Requires content-addressed URLs (fingerprinted filenames). If the URL does not change when content changes, the browser serves stale content indefinitely. Build pipeline complexity.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Segment Public and Private Responses Clearly:</strong> Every endpoint in your system should be classified as either public (cacheable by shared caches) or private (cacheable only by the browser). Public responses use Cache-Control: public, max-age=N (and optionally s-maxage=M for CDN-specific TTL). Private responses use Cache-Control: private or Cache-Control: no-store. Do not mix public and private content in the same response: if an HTML page contains both public article content and private user recommendations, serve the public content as a cacheable HTML page and fetch the private content via a separate API call marked as private. This separation prevents accidental caching of personalized data in shared caches.
          </li>
          <li>
            <strong>Use Immutable Asset Fingerprints for Static Content:</strong> Static assets (JavaScript bundles, CSS files, fonts, icons, images) should be served with content-hashed URLs (for example, /static/app.abc123def.css) and Cache-Control: public, max-age=31536000, immutable. The content hash in the URL ensures that the URL changes whenever the content changes, so the long TTL is safe. The immutable directive prevents the browser from sending conditional requests even on page refresh, eliminating all revalidation overhead for static assets. This is the single most effective HTTP caching optimization for web applications, typically reducing total page load bandwidth by 50 to 70 percent.
          </li>
          <li>
            <strong>Implement ETag-Based Revalidation for Dynamic Content:</strong> Dynamic content (API responses, HTML pages, user-specific data) should use ETag-based revalidation with a short max-age (0 to 300 seconds) and must-revalidate. The ETag should be computed from a content hash or a version number that changes whenever the response changes. The short max-age ensures that the cache checks for updates frequently, and the ETag ensures that unchanged responses return 304 Not Modified with minimal bandwidth. For content that changes rarely, use a longer max-age (hours) with ETag revalidation to balance freshness and efficiency.
          </li>
          <li>
            <strong>Configure Vary Headers Precisely and Minimally:</strong> The Vary header should include only the request headers that actually affect the response content. Common Vary headers include Accept-Language (for localized content), Accept-Encoding (for compression variants, though this is typically handled automatically by the CDN), and Origin (for CORS responses). Avoid including headers that do not affect content (User-Agent, Cookie, Authorization) in the Vary header, as this creates unnecessary cache fragmentation. If a response varies by authentication status, do not use Vary: Authorization; instead, mark the response as private or no-store and fetch personalized content separately.
          </li>
          <li>
            <strong>Use Stale-While-Revalidate for Moderately Dynamic Content:</strong> For content that is moderately dynamic (product listings, blog posts, documentation pages) where a brief staleness window is acceptable, use Cache-Control: public, max-age=300, stale-while-revalidate=600. This serves fresh content for 5 minutes, then serves stale content while revalidating in the background for up to 10 additional minutes. The user experiences zero revalidation latency, and the content is at most 15 minutes stale. This is an effective trade-off for content where freshness is desirable but not critical.
          </li>
          <li>
            <strong>Validate Cache Behavior with Header Inspection Tools:</strong> Deploy tooling that inspects HTTP response headers in production to verify that Cache-Control, ETag, Vary, and other caching headers are set correctly. Use the Age header to measure how long responses have been cached, the X-Cache header (from CDNs) to determine whether responses were served from cache or origin, and the Via header to trace the request path through intermediate proxies. Automated header validation in CI/CD pipelines catches caching misconfigurations before they reach production.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Cache Poisoning Through Incorrect Vary Headers:</strong> When a response varies by a request header (such as Accept-Language) but the server does not include that header in the Vary response, the first cached variant is served to all subsequent users regardless of their header value. This is a cache poisoning bug that can serve incorrect language, incorrect encoding, or in the worst case, incorrect personalized data to users. The fix is to audit every endpoint that produces content-negotiated responses and ensure that the Vary header includes all headers that affect the response. Automated testing can detect this by sending requests with different header values and verifying that the Vary header reflects the variation.
          </li>
          <li>
            <strong>Over-Caching Personalized Content in Shared Caches:</strong> Marking a personalized response as Cache-Control: public allows shared caches (CDNs, corporate proxies) to store and serve it to other users. This is a data-leakage vulnerability that can expose one user&apos;s personalized content (account information, recommendations, search results) to other users. The fix is to classify every endpoint as public or private during design, and to enforce this classification through automated header validation. Endpoints that return user-specific data must be marked as Cache-Control: private or Cache-Control: no-store.
          </li>
          <li>
            <strong>Short TTLs That Prevent Meaningful Caching:</strong> Setting max-age=0 or max-age=1 for all responses, regardless of content type, prevents HTTP caching from providing any benefit. The origin receives every request, and the bandwidth savings from caching are forfeited. The fix is to set TTLs based on content volatility: static assets with immutable URLs get long TTLs (1 year), rarely changing content gets moderate TTLs (1 hour to 1 day), and frequently changing content gets short TTLs (0 to 5 minutes) with ETag revalidation. A one-size-fits-all TTL policy is a sign that caching has not been thoughtfully designed.
          </li>
          <li>
            <strong>ETag Mismatch After Content Changes:</strong> If the ETag generation algorithm does not detect all content changes (for example, an ETag based on the response modification timestamp that does not change when a dependent resource changes), the cache serves stale content because the ETag matches even though the content has changed. The fix is to compute ETags from a content hash or a version number that is incremented whenever any component of the response changes, including dependent resources. For API responses that aggregate data from multiple sources, the ETag should be a composite hash of all source versions.
          </li>
          <li>
            <strong>Missing Revalidation for Content-Negotiated Responses:</strong> When a response varies by Accept-Encoding (gzip, brotli) or Accept-Language, and the cache does not properly handle the Vary header, the cache may serve a compressed response to a client that does not support the compression, or an English response to a Japanese user. This is particularly common with CDN configurations that strip the Vary header to improve cache hit rates. The fix is to never strip Vary headers for content-negotiated responses, and to configure the CDN to respect Vary when computing cache keys.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Documentation Site (Static-Heavy):</strong> A documentation site serves static HTML pages with Cache-Control: public, max-age=300, must-revalidate, ETag: &quot;version-hash&quot;. Static assets (CSS, JS, images) use fingerprinted URLs with Cache-Control: public, max-age=31536000, immutable. When documentation is updated, the content hash changes, the ETag changes, and the next conditional request returns 200 OK with the new content. The short max-age ensures that updates propagate within 5 minutes, and the ETag ensures that unchanged pages return 304 Not Modified with minimal bandwidth. This pattern balances timely updates with efficient caching.
          </li>
          <li>
            <strong>REST API with Conditional Requests:</strong> A REST API serves resource representations with Cache-Control: public, max-age=60, ETag: &quot;resource-version&quot;, Vary: Accept. Clients send conditional GET requests with If-None-Match, and unchanged resources return 304 Not Modified. The 60-second max-age provides a short freshness window for clients in the same request burst (for example, a dashboard that polls the API every 30 seconds), while the ETag ensures that clients with stale entries revalidate efficiently. The Vary: Accept header ensures that JSON and XML representations are cached separately.
          </li>
          <li>
            <strong>E-Commerce Product Pages (Mixed Content):</strong> An e-commerce platform serves product pages with public content (product description, images, reviews) cached at the CDN with Cache-Control: public, max-age=300, stale-while-revalidate=600. Personalized content (price for the user&apos;s region, stock availability, recommendations) is fetched via a separate API call marked Cache-Control: private, no-store. The HTML page is assembled client-side by combining the cached public content with the freshly fetched personalized content. This hybrid approach maximizes caching efficiency for the public portions while ensuring personalized data is always fresh.
          </li>
          <li>
            <strong>Single-Page Application (SPA):</strong> An SPA serves an HTML shell with Cache-Control: public, max-age=0, no-cache (requiring revalidation on every page load) and JavaScript/CSS bundles with fingerprinted URLs and Cache-Control: public, max-age=31536000, immutable. The HTML shell revalidates on every navigation (ensuring the user always gets the latest app version), while the JavaScript bundles are cached indefinitely (eliminating revalidation overhead for static code). When a new app version is deployed, the HTML shell changes, the revalidation returns 200 OK with the new HTML referencing new bundle URLs, and the browser fetches the new bundles. This pattern ensures fast app loads with reliable version updates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions &amp; Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q1: Explain the difference between Cache-Control: no-cache and Cache-Control: no-store. When would you use each?
            </p>
            <p className="mt-2 text-sm">
              Cache-Control: no-cache allows the response to be cached but requires the cache to revalidate with the origin before serving the cached response. In other words, the cache can store the response, but it cannot serve it without first checking with the origin using a conditional request (If-None-Match or If-Modified-Since). If the origin confirms the response is unchanged (304 Not Modified), the cache serves the cached response. If the origin provides a new response (200 OK), the cache replaces the stored response. This is useful for content that changes occasionally but benefits from caching when unchanged, as the conditional request overhead is much smaller than the full response transfer.
            </p>
            <p className="mt-2 text-sm">
              Cache-Control: no-store prohibits any cache from storing the response. The response is never cached, and every request goes to the origin. This is used for sensitive data (authentication tokens, financial transactions, personalized health information) where caching poses a security risk, or for highly dynamic content that changes on every request and would never benefit from caching. Use no-cache for content that should be validated before serving, and no-store for content that should never be cached.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2: A user reports that they are seeing stale content on your website even though you deployed a new version. Walk through the possible caching layers where the stale content could be coming from and how you would diagnose each one.
            </p>
            <p className="mt-2 text-sm">
              Stale content after a deployment can originate from any caching layer in the request-response chain. First, check the browser cache: open the browser developer tools, inspect the response headers, and look for the Age header (indicating how long the response has been cached) and the X-Cache header (from the CDN, indicating HIT or MISS). If the response has X-Cache: MISS but the browser serves old content, the browser cache is serving a stale entry that has not yet revalidated. Fix by ensuring the HTML shell uses Cache-Control: no-cache or a very short max-age. Second, check the CDN cache: if the response has X-Cache: HIT but serves old content, the CDN cache has not been invalidated. Fix by purging the CDN cache for the affected URLs or ensuring that the deployment process includes a CDN purge. Third, check any reverse proxy or API gateway between the CDN and the origin: these may have their own cache with independent TTLs. Diagnose by inspecting the Via header to identify intermediate proxies and checking their cache status headers. Fix by purging the proxy cache or configuring it to respect origin cache-control headers. Fourth, check the application server&apos;s own cache: some frameworks cache responses at the application level. Diagnose by bypassing the CDN and proxy and requesting directly from the origin. Fix by clearing the application cache or ensuring that deployment triggers a cache flush.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3: How does the Vary header affect cache behavior, and what are the risks of misconfiguring it?
            </p>
            <p className="mt-2 text-sm">
              The Vary header tells caches which request headers to consider when computing the cache key. If a response includes Vary: Accept-Language, the cache stores separate entries for each Accept-Language value (en, ja, fr, etc.), and selects the correct entry based on the incoming request&apos;s Accept-Language header. Without the Vary header, the cache uses only the URL as the cache key, and the first cached variant is served to all subsequent requests regardless of their header values. This is cache poisoning: users receive content intended for a different language, encoding, or device class.
            </p>
            <p className="mt-2 text-sm">
              The risks of misconfiguring Vary are significant. Omitting a Vary header for a content-negotiated response causes cache poisoning (wrong content served to wrong users). Including too many Vary headers causes cache fragmentation (too many cache variants, low hit rates, increased origin load). Including user-specific headers (Cookie, Authorization) in Vary causes the cache to store a separate entry per user, which is both a performance problem (zero cache reuse) and a security risk (if the cache somehow serves the wrong user&apos;s entry). The correct approach is to include only the headers that affect the response content and to mark responses that vary by user identity as Cache-Control: private rather than relying on Vary.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4: Compare ETag-based revalidation with Last-Modified-based revalidation. When is each appropriate?
            </p>
            <p className="mt-2 text-sm">
              ETag-based revalidation uses an entity tag (an opaque identifier, typically a content hash or version string) to determine whether a cached response is still current. The server generates an ETag for each response version, the client stores it with the cached response, and the server compares the client&apos;s If-None-Match value against the current ETag. ETags are byte-level precise: any change to the response body changes the ETag. They work for resources without a clear modification timestamp (aggregated API responses, dynamically generated content) and handle sub-second changes correctly.
            </p>
            <p className="mt-2 text-sm">
              Last-Modified-based revalidation uses the response&apos;s Last-Modified timestamp to determine freshness. The client sends If-Modified-Since with the stored timestamp, and the server compares it against the resource&apos;s current modification time. Last-Modified is simpler to implement (no hash computation required) and is universally supported by all HTTP clients and caches. However, it has second-level granularity (changes within the same second are not detected), it requires the server to track modification timestamps, and it fails for resources that are regenerated from the same input data (the modification timestamp may change even though the content does not).
            </p>
            <p className="mt-2 text-sm">
              Use ETag-based revalidation for most production systems, especially API responses, dynamically generated content, and resources where byte-level precision matters. Use Last-Modified-based revalidation for simple static file serving where the file modification timestamp is accurate and sufficient, or in environments where ETag computation is prohibitively expensive (very large files, legacy systems). In practice, most modern servers support both, and the client chooses which conditional request header to use.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5: How would you design HTTP caching for a REST API that serves both public data (product listings) and private data (user order history)?
            </p>
            <p className="mt-2 text-sm">
              The design separates public and private endpoints at the URL level, with distinct caching policies for each. Public endpoints (GET /products, GET /products/:id) use Cache-Control: public, max-age=60, ETag: &quot;resource-version&quot;, allowing shared caches (CDNs, proxies) to cache responses for 60 seconds and revalidate efficiently with ETags. Product listings change infrequently, so the 60-second TTL is a reasonable trade-off between freshness and cache efficiency. Private endpoints (GET /users/:id/orders) use Cache-Control: private, no-store, ensuring that no cache (shared or browser) stores the response. Each request goes directly to the origin, guaranteeing that users always see their current order history.
            </p>
            <p className="mt-2 text-sm">
              The API gateway enforces this separation by validating that private endpoints never include Cache-Control: public headers, and that public endpoints never include user-specific data in the response. Automated tests verify the caching headers for each endpoint, and header inspection tooling monitors production responses to detect misconfigurations. For endpoints that mix public and private data (for example, a product listing with user-specific pricing), the endpoint is split into two: a public product listing endpoint and a private pricing endpoint, and the client assembles the full response client-side. This ensures that the public portion benefits from shared caching while the private portion remains uncached.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6: What is stale-while-revalidate, and how does it differ from stale-if-error? When would you use each?
            </p>
            <p className="mt-2 text-sm">
              Stale-while-revalidate (stale-while-revalidate=N) allows a cache to serve a stale response for up to N seconds after the freshness window expires, while asynchronously sending a revalidation request to the origin in the background. The user receives the stale response immediately (zero latency), and the next user receives the fresh response once the background revalidation completes. This eliminates the revalidation latency spike that users experience when a cached response expires, at the cost of one user seeing slightly stale data. Use stale-while-revalidate for moderately dynamic content where a brief staleness window is acceptable: product listings, blog posts, documentation pages, API responses that change infrequently.
            </p>
            <p className="mt-2 text-sm">
              Stale-if-error (stale-if-error=N) allows a cache to serve a stale response when the origin returns an error response (5xx status code), for up to N seconds after the freshness window expires. Unlike stale-while-revalidate, which is always active during the stale-while-revalidate window, stale-if-error is only activated when the origin fails. This provides resilience against origin outages: if the origin goes down, users continue to see cached content rather than error pages. Use stale-if-error for all cacheable responses where availability is more important than freshness: static content, documentation, product catalogs, and any content where serving stale data is preferable to serving an error. The stale-if-error window should be generous (hours to days) to cover extended origin outages.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc7234"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7234: &quot;Hypertext Transfer Protocol (HTTP/1.1): Caching&quot;
            </a>
          </li>
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc7232"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7232: &quot;Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests&quot;
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs: &quot;HTTP caching&quot;
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/http-cache/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Web Fundamentals: &quot;HTTP Caching&quot;
            </a>
          </li>
          <li>
            <a
              href="https://blog.cloudflare.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Thomson (Cloudflare): &quot;HTTP Cache Digests&quot;
            </a>
          </li>
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc9110"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IETF HTTP Working Group: &quot;HTTP Semantics&quot; (RFC 9110)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
