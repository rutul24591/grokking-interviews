"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-client-edge-caching",
  title: "Client & Edge Caching",
  description:
    "Comprehensive guide to caching strategies at the client and edge layers. Covers browser cache, CDN, edge computing, cache invalidation patterns, and Cache-Control directives.",
  category: "frontend",
  subcategory: "nfr",
  slug: "client-edge-caching",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "caching",
    "cdn",
    "edge",
    "performance",
    "cache-control",
  ],
  relatedTopics: [
    "page-load-performance",
    "offline-support",
    "network-efficiency",
  ],
};

export default function ClientEdgeCachingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Client Caching</strong> stores resources in the user&apos;s
          browser to eliminate redundant network requests, while{" "}
          <strong>Edge Caching</strong> stores resources at CDN edge locations
          geographically close to users to reduce latency. Together, these
          caching layers form the first and most impactful line of defense
          against web performance issues. When configured correctly, 80-90% of
          requests never reach the origin server, dramatically reducing
          infrastructure costs while improving user experience.
        </p>
        <p>
          The performance impact is measurable and significant. A client cache
          hit results in zero network latency — the resource loads instantly
          from disk or memory. An edge cache hit reduces round-trip time from
          500ms+ to the origin down to 50-200ms from the nearest edge location.
          For staff engineers, caching decisions affect infrastructure costs,
          origin server load, content freshness guarantees, and the complexity
          of cache invalidation strategies. The right caching architecture
          balances freshness requirements with performance goals while remaining
          operationally manageable.
        </p>
        <p>
          Browser caching has evolved from simple HTTP cache headers to a
          multi-layered system encompassing memory cache, disk cache, service
          worker cache, and IndexedDB. Edge caching has similarly evolved from
          static file serving to compute-capable edge platforms (Cloudflare
          Workers, Lambda@Edge, Vercel Edge Functions) that can transform
          responses, perform A/B testing, and serve personalized content without
          origin round-trips. Understanding both layers and their interaction is
          essential for building performant web applications at scale.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Browser caching operates through multiple storage layers, each with
          different characteristics and lifecycles. The memory cache is the
          fastest layer, storing resources in RAM for the duration of the tab
          session. It is used for recently loaded images, CSS and JavaScript for
          the current page, and back/forward navigation cache (bfcache). The
          memory cache is cleared when the tab closes and is not shared across
          tabs. The disk cache persists across browser sessions and is controlled
          by HTTP cache headers — specifically the Cache-Control, ETag, and
          Last-Modified directives. The service worker cache is programmable via
          the Cache API, giving developers full control over what is stored, how
          it is retrieved, and when it is invalidated. This layer powers offline
          support and custom caching strategies like stale-while-revalidate.
        </p>
        <p>
          The Cache-Control HTTP header is the primary mechanism for controlling
          browser and CDN caching behavior. It accepts multiple directives that
          can be combined to express precise caching intentions. The max-age
          directive specifies how many seconds a response is considered fresh
          from the response Date header. The s-maxage directive overrides max-age
          for shared caches (CDNs) only, allowing different TTLs for browser and
          edge caches. The no-cache directive instructs caches to store the
          response but revalidate with the origin server before every use — it
          does not mean &quot;do not cache&quot; as commonly misunderstood. The
          no-store directive is the actual instruction to never store the
          response in any cache, used for sensitive data like tokens or PII.
        </p>
        <p>
          Validation mechanisms complement freshness directives. The ETag header
          provides a resource fingerprint (typically a hash of the content) that
          the browser sends on subsequent requests via the If-None-Match header.
          If the resource has not changed, the server responds with 304 Not
          Modified, saving bandwidth by not retransmitting the body. The
          Last-Modified header serves a similar purpose using timestamps, with
          the If-Modified-Since request header. The Vary header informs caches
          that the response varies based on specific request headers — for
          example, Vary: Accept-Encoding means the cache must store separate
          versions for gzip and Brotli responses.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/browser-cache-layers.svg"
          alt="Browser Cache Layers"
          caption="Browser caching hierarchy — memory cache, disk cache, service worker cache, and IndexedDB with their performance characteristics and persistence guarantees"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          CDN edge caching sits between the browser and the origin server,
          intercepting requests at geographically distributed edge locations.
          When a user requests a resource, DNS routing directs them to the
          nearest CDN Point of Presence (PoP). The edge location checks its
          cache for the resource — if found (a cache HIT), it serves the cached
          response immediately. If not found (a cache MISS), the edge fetches
          the resource from the origin server, caches it according to the
          origin&apos;s Cache-Control headers, and serves it to the user.
          Subsequent requests from any user served by that edge location receive
          the cached response until the TTL expires.
        </p>
        <p>
          Modern edge computing platforms extend caching beyond static file
          serving. Cloudflare Workers, AWS Lambda@Edge, and Vercel Edge
          Functions allow running JavaScript, WebAssembly, or other code at edge
          locations. This enables dynamic content generation at the edge —
          serving personalized HTML based on cookies or headers, performing A/B
          test variant selection without origin involvement, injecting
          user-specific data into cached HTML templates, and optimizing images
          on-the-fly based on device capabilities. Edge compute introduces its
          own trade-offs: cold starts add 50-500ms latency, execution time is
          limited (typically 10-50ms for free tiers), and available APIs are
          restricted (no filesystem access, limited network capabilities).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/cdn-edge-caching.svg"
          alt="CDN Edge Caching Architecture"
          caption="CDN edge caching architecture — user request flow through DNS routing, edge PoPs, cache HIT/MISS logic, and origin server fallback"
        />

        <p>
          Cache invalidation is the mechanism for removing stale content from
          caches before its TTL expires. Versioned URLs are the most reliable
          strategy — embedding a content hash in the filename
          (app.abc123.js) means the URL changes when content changes, and the
          old URL can be cached forever with immutable headers. HTML pages
          typically use no-cache with ETag validation, ensuring users always
          receive the latest HTML which references the new versioned asset URLs.
          For dynamic content that cannot use versioned URLs, CDN purge APIs
          allow programmatic invalidation by URL, URL prefix, or cache tag.
          Cache tags (supported by Fastly and Cloudflare) allow tagging
          responses with metadata and purging all responses with a specific tag
          — for example, purging all product pages when a product&apos;s price
          changes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/cache-invalidation-patterns.svg"
          alt="Cache Invalidation Patterns"
          caption="Cache invalidation strategies — versioned URLs with immutable cache, TTL-based expiry, CDN purge API, and cache tag invalidation"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Cache-Control directive selection involves critical trade-offs between
          freshness and performance. Setting long max-age values (1 year with
          immutable) on static assets maximizes performance — the browser never
          revalidates — but requires a cache-busting mechanism (content hashing)
          to update content. Using no-cache on HTML pages ensures users always
          receive the latest HTML with updated asset references, but every page
          visit requires a round-trip to the server (resulting in 304 Not
          Modified if unchanged). The stale-while-revalidate directive offers a
          middle ground — serving a cached response immediately while
          asynchronously fetching a fresh version in the background. This
          provides instant response times with eventual freshness, ideal for
          content that updates periodically but does not need to be perfectly
          current.
        </p>
        <p>
          Edge caching decisions depend on content type and personalization
          requirements. Fully static content (images, CSS, JavaScript) is an
          obvious candidate for edge caching with long TTLs. Semi-dynamic
          content (product listing pages, blog posts) can use edge caching with
          shorter TTLs and purge-on-change invalidation. Highly personalized
          content (user dashboards, shopping carts) traditionally bypasses edge
          caching entirely, but modern edge compute enables partial caching —
          caching the page shell and injecting user-specific data at the edge
          using Edge Side Includes (ESI) or template stitching. The trade-off is
          increased edge compute complexity versus origin server load reduction.
        </p>
        <p>
          CDN provider selection involves evaluating network coverage, feature
          set, and pricing model. Cloudflare offers the largest network with a
          generous free tier and integrated security features (DDoS protection,
          WAF). Fastly provides real-time cache purging and powerful VCL
          (Varnish Configuration Language) for custom caching logic, preferred
          by engineering teams that need fine-grained control. AWS CloudFront
          integrates seamlessly with the AWS ecosystem but requires more
          configuration. Akamai offers the most extensive enterprise network but
          at premium pricing. The decision factors include geographic user
          distribution, existing infrastructure, required features (edge compute,
          image optimization, bot detection), and budget constraints.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Adopt a layered caching strategy that matches content characteristics
          to caching behavior. Static assets with content-hashed filenames
          should use <code>public, max-age=31536000, immutable</code> — cache
          for one year with no revalidation. HTML pages should use
          <code>no-cache</code> with ETag headers to ensure users always receive
          the latest markup referencing current asset URLs. API responses for
          user-specific data should use <code>private, max-age=0,
          must-revalidate</code> to cache only in the browser and always
          revalidate. CDN-cached public content should use{" "}
          <code>public, max-age=60, s-maxage=3600</code> to cache for 1 minute
          in the browser and 1 hour at the CDN edge. Sensitive data should use{" "}
          <code>no-store</code> to prevent any caching.
        </p>
        <p>
          Implement cache key customization to maximize cache hit rates. By
          default, CDN cache keys include the URL path and Host header. Customize
          the cache key to include query parameters that affect content
          (pagination, filters, locale) while excluding irrelevant parameters
          (UTM tracking, session IDs, random tokens). For internationalized
          sites, include Accept-Language in the cache key to serve different
          language versions from the edge. For compressed responses, include
          Accept-Encoding to store separate gzip and Brotli versions. Most CDN
          providers offer cache key customization through their dashboard or
          configuration API.
        </p>
        <p>
          Design cache invalidation into your deployment pipeline. Every
          deployment should trigger a CDN purge of HTML pages (to pick up new
          asset references) while leaving versioned static assets untouched
          (their URLs have not changed). For content management systems, integrate
          the CDN purge API with the content publishing workflow — when an editor
          publishes an article, automatically purge the article page, the
          listing page, and the sitemap. Use cache tags for bulk invalidation —
          tag all product pages with the product category, and purge by tag when
          category-level changes occur.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most frequent caching mistake is confusing no-cache with
          no-store. The no-cache directive means &quot;cache but revalidate
          before every use&quot; — the response is stored and served with a
          conditional request (304 if unchanged). The no-store directive means
          &quot;do not store in any cache&quot; — every request goes to the
          origin server. Using no-cache when you meant no-store exposes
          sensitive data to browser caches, while using no-store when you meant
          no-cache eliminates all caching benefits and increases origin load.
          This distinction is critical for security-sensitive applications.
        </p>
        <p>
          Another common error is setting long Cache-Control TTLs on HTML pages
          without a purge strategy. If HTML is cached for 1 hour at the CDN and
          you deploy a new version of the application, users continue receiving
          stale HTML that references old JavaScript and CSS bundles — which may
          have been removed from the server, causing 404 errors. The fix is to
          use no-cache for HTML (always revalidate) and trigger a CDN purge of
          HTML paths on every deployment. Alternatively, use versioned HTML
          URLs, but this breaks bookmarking and sharing.
        </p>
        <p>
          Failing to account for cache variation leads to serving incorrect
          content to users. If a page serves different content based on the
          user&apos;s locale but the cache key does not include Accept-Language,
          the first user&apos;s language version is cached and served to all
          subsequent users regardless of their locale. Similarly, if compressed
          and uncompressed versions are cached under the same key, a browser
          that does not support Brotli may receive a Brotli-compressed response
          it cannot decode. Always configure the Vary header correctly and
          ensure CDN cache keys include all variation dimensions.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          News and media websites face extreme caching challenges due to
          breaking news updates and high traffic spikes. The New York Times uses
          a multi-layer caching strategy: article HTML is served from edge cache
          with a 60-second TTL and purged immediately when articles are updated.
          Static assets (JavaScript, CSS, images) use versioned URLs with
          1-year immutable caching. During breaking news events, the CDN absorbs
          95%+ of traffic, with only cache misses reaching the origin. The
          stale-if-error directive ensures that if the origin becomes
          unavailable during an outage, the CDN continues serving stale content
          for up to 24 hours, maintaining site availability.
        </p>
        <p>
          E-commerce platforms require sophisticated caching strategies that
          balance performance with dynamic pricing and inventory data. Product
          listing pages use edge caching with 5-minute TTLs and purge-on-change
          invalidation when product data updates. Product detail pages use
          similar caching but with shorter TTLs for price and availability
          information. The shopping cart and checkout flows bypass edge caching
          entirely due to their user-specific nature. During flash sales, CDNs
          absorb the traffic surge for product pages while the origin handles
          the checkout load. Image optimization at the edge (Cloudflare Images,
          Imgix) serves appropriately sized and formatted images based on device
          capabilities, reducing bandwidth by 30-50%.
        </p>
        <p>
          Single-page applications (SPAs) present unique caching challenges
          because the entire application is delivered as JavaScript bundles. The
          index.html file uses no-cache with ETag to ensure users always receive
          the latest version. JavaScript bundles use content-hashed filenames
          with 1-year immutable caching — when code changes, the hash changes,
          and the browser fetches the new bundle. This strategy eliminates the
          classic SPA cache problem where users receive old JavaScript that
          requests API endpoints from a previous deployment. Service workers add
          another caching layer, enabling offline support and custom
          stale-while-revalidate strategies for API responses.
        </p>
      </section>

      <section>
        <h2>Advanced Caching Architecture</h2>
        <p>
          CDN architecture at the enterprise level involves multi-layered edge computing capabilities that extend far beyond static file serving. Modern CDNs like Cloudflare, Fastly, and AWS CloudFront operate thousands of Points of Presence (PoPs) globally, each capable of running compute logic at the edge. Edge computing transforms the CDN from a passive cache into an active processing layer — Edge Side Includes (ESI) allow composing pages from multiple cached fragments at the edge, combining a cached header fragment, a cached product listing fragment, and a personalized user fragment into a complete HTML response without any origin round-trip. Cache key optimization is critical for maximizing edge cache hit rates — the default cache key (URL path plus Host header) is often insufficient for dynamic applications. Customizing the cache key to include only the query parameters that affect content (pagination, filters, locale) while excluding irrelevant parameters (UTM tracking, session IDs, cache-busting timestamps) dramatically improves cache efficiency. For internationalized sites, the cache key must include Accept-Language or the URL locale prefix to serve different language versions from the edge. For compressed responses, the cache key must account for Accept-Encoding to store separate gzip and Brotli versions, preventing the CDN from serving Brotli-compressed content to browsers that only support gzip.
        </p>
        <p>
          Cache invalidation at scale is one of the most challenging operational problems in distributed systems. The fundamental tension is between cache consistency (ensuring all edge locations serve the latest content) and cache performance (maximizing hit rates to reduce origin load). Versioned URLs solve this for static assets — embedding a content hash in the filename means the URL changes when content changes, and the old URL can be cached forever with immutable headers. But for dynamic content (user profiles, product prices, inventory levels), versioned URLs are impractical because the content changes too frequently. CDN purge APIs provide programmatic invalidation by URL, URL prefix, or cache tag. Cache tags (supported by Fastly and Cloudflare) allow tagging responses with metadata during the cache population process, and later purging all responses with a specific tag — for example, purging all product pages when a product&apos;s price changes, or purging all articles in a category when the category layout is updated. The purge operation propagates to all edge locations asynchronously, typically completing within 30-120 seconds globally. For applications requiring immediate invalidation (breaking news, flash sales), the purge API is integrated into the content publishing workflow — when an editor publishes an article, the CMS automatically triggers a purge of the article URL, the listing page, the sitemap, and any related content pages. The challenge is that purge operations are rate-limited by CDN providers (typically 100-1000 purges per minute), so applications with high content velocity must use cache tag invalidation (purging by tag rather than individual URLs) to stay within rate limits while maintaining content freshness.
        </p>
        <p>
          Stale-while-revalidate implementation details reveal the nuanced engineering required to balance instant response times with eventual freshness. The stale-while-revalidate Cache-Control directive (supported by browsers and CDNs) allows serving a cached response immediately while asynchronously fetching a fresh version in the background. For example, max-age=60, stale-while-revalidate=30 means the response is fresh for 60 seconds, then for the next 30 seconds the cached version is served instantly while a background request fetches the new version. The next request after the background fetch completes receives the fresh response. At the CDN level, stale-while-revalidate is implemented by the edge server checking the response age — if the response is within the max-age window, it is served as fresh; if it is within the stale-while-revalidate window, it is served immediately while a background fetch is initiated; if it exceeds both windows, the edge fetches a fresh response synchronously before serving. The implementation must handle concurrent requests during the stale-while-revalidate window intelligently — if 100 users request the same stale resource simultaneously, the CDN should initiate only one background fetch (request coalescing) rather than 100 redundant fetches that would overwhelm the origin server. Cloudflare implements this through its stale-while-revalidate feature, and Fastly provides similar functionality through its shielding architecture where a single shield POP handles background fetches on behalf of all edge POPs.
        </p>
        <p>
          Cache poisoning prevention is a critical security concern for edge caching architectures. Cache poisoning occurs when an attacker crafts a malicious request that produces a response containing attacker-controlled content, and that response is cached by the CDN and served to other users. The attack exploits the CDN&apos;s cache key construction — if the cache key does not include certain request headers or query parameters that affect the response, the attacker can inject malicious content through those un-keyed dimensions. For example, if the cache key does not include the X-Forwarded-Host header, an attacker can send a request with a manipulated X-Forwarded-Host value, the origin generates a response with links pointing to the attacker&apos;s domain, and the CDN caches this poisoned response under the normal URL, serving it to all subsequent users. Prevention strategies include configuring the CDN to normalize the cache key by excluding dangerous headers (X-Forwarded-Host, X-Original-URL) that should not affect the response, implementing input validation on the origin to reject requests with suspicious header values, and using Vary headers to ensure the cache key includes all request dimensions that affect the response. The web community has standardized on the Vary header to communicate which request headers affect the response, and CDNs should be configured to respect Vary when constructing cache keys. Additionally, responses containing user-specific data (authenticated user information, CSRF tokens, session identifiers) must never be cached in shared caches (CDNs) — the Cache-Control header must include private to restrict caching to the user&apos;s browser only.
        </p>
        <p>
          Multi-CDN strategies address the reliability and performance requirements of global applications that cannot tolerate a single CDN provider&apos;s outage or performance degradation. The architecture uses a DNS-based or HTTP-based routing layer to direct users to the optimal CDN provider based on real-time performance metrics, geographic location, and provider health. DNS-based multi-CDN (using providers like NS1, Dyn, or Cloudflare Load Balancing) resolves the application&apos;s domain to the IP address of the best-performing CDN for each user&apos;s location, based on continuous health checks and performance monitoring. HTTP-based multi-CDN serves the same content from multiple CDN providers and uses a client-side decision mechanism (JavaScript logic that measures CDN response times and selects the fastest) to route individual resource requests. The trade-off is increased complexity — content must be deployed to all CDN providers simultaneously, cache invalidation must be triggered across all providers, and monitoring must aggregate metrics from multiple sources. The benefit is resilience — if one CDN experiences an outage (which happens regularly at scale, even for major providers), traffic is automatically routed to the remaining healthy providers. For mission-critical applications (e-commerce during Black Friday, live streaming events, financial trading platforms), the resilience benefit justifies the operational overhead. Cost optimization is an additional benefit — multi-CDN allows routing traffic to the most cost-effective provider for each geographic region, leveraging competitive pricing across providers.
        </p>
        <p>
          Cache performance monitoring and alerting provide the observability needed to detect and respond to caching issues before they impact users. Key metrics include cache hit rate (percentage of requests served from cache versus origin), cache miss rate (percentage of requests requiring origin fetch), origin load (requests per second reaching the origin server), edge response time (time from request receipt to response delivery at the edge), and origin response time (time for the origin to respond to cache miss requests). Cache hit rate is the primary health indicator — a sudden drop in hit rate indicates a caching issue (misconfigured Cache-Control headers, unexpected query parameters creating new cache keys, or a deployment that changed URL patterns). The alerting threshold should be set based on the baseline hit rate — if the typical hit rate is 90%, alert when it drops below 80% for more than 5 minutes. Origin load is the secondary health indicator — a sudden spike in origin load indicates that the CDN is not absorbing traffic as expected, which can lead to origin overload and service degradation. Response time monitoring should be segmented by geographic region and CDN provider (for multi-CDN setups) to identify region-specific performance issues. Real User Monitoring (RUM) data should be correlated with cache metrics to understand the user-facing impact of caching decisions — users in regions with lower cache hit rates will experience higher latency, and this correlation should be visible in the monitoring dashboard. Log analysis of CDN access logs provides additional insight — analyzing the cache status (HIT, MISS, EXPIRED, BYPASS) for each request reveals patterns that aggregate metrics obscure, such as specific URL patterns that consistently miss the cache or specific query parameters that prevent caching.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between memory cache and disk cache?
            </p>
            <p className="mt-2 text-sm">
              A: Memory cache stores resources in RAM and is the fastest cache
              layer, but it is cleared when the tab closes and is not shared
              across tabs. It is used for the current page&apos;s resources and
              back/forward navigation. Disk cache persists across browser
              sessions and is controlled by HTTP cache headers (Cache-Control,
              ETag). It is slower than memory cache but survives browser
              restarts and is shared across tabs from the same origin. Both
              serve different purposes — memory cache for immediate reuse within
              a session, disk cache for cross-session performance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between no-cache and no-store?
            </p>
            <p className="mt-2 text-sm">
              A: <strong>no-cache</strong> means &quot;cache but revalidate
              before every use&quot; — the response is stored in the cache but
              the browser must send a conditional request (If-None-Match with
              ETag) to the server before serving it. If the server responds with
              304 Not Modified, the cached version is used. This is ideal for
              HTML pages. <strong>no-store</strong> means &quot;do not store in
              any cache&quot; — every request goes to the origin server with no
              caching at all. This is required for sensitive data like tokens,
              PII, or financial information. The confusion between these two
              directives is one of the most common caching mistakes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement cache invalidation for a CMS?
            </p>
            <p className="mt-2 text-sm">
              A: Use a hybrid approach combining multiple strategies. Static
              assets use versioned URLs with immutable cache — no invalidation
              needed since URLs change when content changes. HTML pages use
              no-cache with ETag for automatic revalidation. For immediate
              invalidation on content publish (breaking news, product updates),
              integrate with the CDN purge API — trigger a purge of the article
              URL, listing page, and sitemap when content is published. For bulk
              invalidation, use cache tags to purge all related pages at once
              (e.g., all product pages in a category). Test invalidation
              thoroughly — stale content after a publish is a common production
              issue.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is stale-while-revalidate and when would you use it?
            </p>
            <p className="mt-2 text-sm">
              A: stale-while-revalidate allows serving a cached (stale) response
              immediately while asynchronously fetching a fresh version in the
              background. For example, <code>max-age=60,
              stale-while-revalidate=30</code> means the response is fresh for
              60 seconds, then for the next 30 seconds, the cached version is
              served instantly while a background request fetches the new
              version. The next request after that receives the fresh response.
              Use it for content that updates periodically but does not need to
              be perfectly fresh — product listings, blog feeds, social media
              timelines. It balances instant response times with eventual
              freshness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle cache key design for internationalized sites?
            </p>
            <p className="mt-2 text-sm">
              A: The CDN cache key must include all request dimensions that
              affect the response. For internationalized sites, include
              Accept-Language in the cache key so that different language
              versions are cached separately. If you use URL-based locale
              prefixes (/en/, /de/, /ja/), the URL path already differentiates
              versions and no additional cache key configuration is needed.
              Exclude irrelevant query parameters (UTM tracking, session IDs,
              random timestamps) from the cache key to maximize cache hit rates.
              For compressed responses, include Accept-Encoding in the cache key
              or configure the CDN to normalize it automatically.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — HTTP Caching
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/http-cache/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — HTTP Cache
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Developers — HTTP Caching Strategies
            </a>
          </li>
          <li>
            <a
              href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare — What is a CDN
            </a>
          </li>
          <li>
            <a
              href="https://cachecontrol.fivemimobytes.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cache Control — Interactive Cache-Control Directive Reference
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
