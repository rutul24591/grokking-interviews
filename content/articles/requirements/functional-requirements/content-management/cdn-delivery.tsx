"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-cdn-delivery",
  title: "CDN Delivery",
  description:
    "Comprehensive guide to implementing CDN delivery covering caching strategies, invalidation, edge optimization, multi-CDN routing, security, performance monitoring, and cost optimization for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "cdn-delivery",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "content",
    "cdn",
    "delivery",
    "caching",
    "performance",
  ],
  relatedTopics: ["media-processing", "content-storage", "performance", "edge-computing"],
};

export default function CDNDeliveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          CDN (Content Delivery Network) Delivery distributes content globally through strategically positioned edge cache servers, reducing latency for end users and offloading traffic from origin infrastructure. A CDN works by caching content at edge locations closer to users, serving subsequent requests from the cache rather than the origin server. For global platforms, CDN delivery is not optional—it&apos;s essential infrastructure that determines user experience quality, origin costs, and platform scalability. When users in Tokyo, London, and São Paulo all access your platform, a properly configured CDN ensures each receives content from a nearby edge location with minimal latency, rather than all traffic hitting a single origin datacenter.
        </p>
        <p>
          For staff and principal engineers, CDN delivery architecture involves multiple interconnected concerns: caching strategies (cache-aside, write-through, stale-while-revalidate), cache invalidation (purge by URL, tag-based invalidation, versioned URLs), edge optimization (image optimization, compression, minification at edge), multi-CDN routing (load balancing, failover, geo-routing), security (DDoS protection, WAF, token authentication), and performance monitoring (cache hit rates, edge latency, origin load). The implementation must balance competing priorities: cache hit rate versus content freshness, performance versus cost, simplicity versus flexibility. A poorly configured CDN can serve stale content, expose origin to traffic spikes, or incur unexpected costs from cache misses and bandwidth overages.
        </p>
        <p>
          The complexity of CDN delivery extends beyond basic configuration. Cache key design determines what gets cached separately (by URL, headers, cookies, user agent). Invalidation strategies must handle both predictable updates (content publishing) and emergency purges (sensitive content removal). Multi-CDN setups require health monitoring, performance-based routing, and seamless failover. Edge computing capabilities (Cloudflare Workers, Lambda@Edge) enable running logic at edge nodes for personalization, A/B testing, and authentication. Security considerations include DDoS mitigation, WAF rule configuration, HTTPS enforcement, and bot detection. For staff engineers, CDN delivery is a strategic infrastructure decision with long-term consequences for performance, cost, and operational complexity.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Cache Headers and TTL Configuration</h3>
        <p>
          Cache headers control how content is cached and for how long. Cache-Control is the primary header, with directives like max-age (how long content is fresh), s-maxage (shared cache TTL), public/private (cacheable by any cache or browser only), no-cache (must revalidate), and no-store (don&apos;t cache). ETag provides entity validation through content hashing—browsers send If-None-Match headers, origin responds 304 Not Modified if unchanged. Last-Modified provides timestamp-based validation. Vary header specifies which request headers affect caching (Accept-Encoding for compression variants, User-Agent for device-specific content). Proper header configuration is critical—missing headers cause cache misses, overly long TTLs serve stale content, and incorrect Vary headers cause cache fragmentation.
        </p>
        <p>
          TTL (Time To Live) settings vary by content type. Static assets (images, CSS, JavaScript) use long TTLs (1 year) with versioned URLs—when content changes, the URL changes (app.v1.js → app.v2.js), invalidating the old cache naturally. Dynamic content (HTML pages, API responses) uses short TTLs (minutes to hours) with ETag validation for freshness. Personalized content (user dashboards, recommendations) often bypasses cache entirely or uses very short TTLs with user-specific cache keys. API responses are cached based on method and response type—GET requests are cacheable, while POST/PUT/DELETE requests trigger invalidation of related cached content.
        </p>

        <h3 className="mt-6">Cache Invalidation Strategies</h3>
        <p>
          Cache invalidation ensures updated content reaches users promptly. Purge by URL invalidates specific paths—effective for targeted updates but requires knowing exact URLs. Purge by tag invalidates content by cache tag—content is tagged during caching (e.g., &quot;article-123&quot;, &quot;user-456&quot;), enabling grouped invalidation without knowing all URLs. Purge All clears the entire cache—use sparingly as it causes massive cache miss storms and origin load spikes. Versioned URLs change the URL when content changes—natural invalidation through URL change, ideal for static assets. Soft purge marks content as stale but continues serving it while revalidating in background—maintains availability during invalidation.
        </p>
        <p>
          Invalidation timing matters. Immediate invalidation (purge on content update) ensures freshness but may cause race conditions if origin update fails. Delayed invalidation (purge after origin confirms update) ensures consistency but briefly serves stale content. Batched invalidation (collect invalidations, purge in batches) reduces CDN API calls but increases staleness window. The choice depends on content criticality—news content needs immediate invalidation, while blog posts can tolerate brief staleness.
        </p>

        <h3 className="mt-6">Caching Strategies</h3>
        <p>
          Cache-aside (lazy loading) is the most common pattern. Application checks cache first, on miss fetches from origin, caches the response, then returns it. Benefits include simplicity and only caching requested content. Drawbacks include cache miss penalty (first request is slow) and stale data risk (cache doesn&apos;t know when origin data changes). This strategy works well for read-heavy workloads with unpredictable access patterns where caching everything would be wasteful.
        </p>
        <p>
          Write-through caching writes to cache and origin simultaneously. Benefits include cache always being fresh (no stale data) and consistent read performance. Drawbacks include write latency (must wait for both writes) and cache pollution (caching data that may never be read). This strategy works well for write-heavy workloads where data consistency is critical and write latency is acceptable.
        </p>
        <p>
          Stale-while-revalidate serves stale content while refreshing in background. When content expires, serve the stale version immediately while fetching fresh content asynchronously. Benefits include fast response times (no waiting for origin) and origin protection (only one request triggers refresh). Drawbacks include brief staleness window (users see slightly outdated content). This strategy works well for high-availability requirements where brief staleness is acceptable.
        </p>
        <p>
          Cache warming pre-populates cache before traffic arrives. Predict high-traffic content (new product launches, breaking news, viral content) and pre-fetch into edge caches. Benefits include no cache misses on launch (all requests hit cache) and origin protection (no thundering herd). Drawbacks include storage cost (caching content that may not be requested) and staleness risk (warmed content may become outdated). This strategy works well for predictable high-traffic events.
        </p>

        <h3 className="mt-6">Edge Optimization</h3>
        <p>
          Image optimization at edge reduces bandwidth and improves load times. Resize images to appropriate dimensions for requesting device. Compress images with modern formats (WebP, AVIF) that offer better compression than JPEG/PNG. Serve responsive images with srcset attribute, letting browser choose appropriate size. Implement lazy loading so images load only when visible. Edge image optimization can reduce image bandwidth by 50-80% compared to serving original uploads.
        </p>
        <p>
          Compression reduces bandwidth costs and improves load times. Brotli compression offers better compression than Gzip (15-20% smaller) but requires more CPU. Gzip is universally supported and fast. Compress text content (HTML, CSS, JavaScript, JSON) at edge before sending to users. Typical compression ratios are 70-80% for text content. Enable compression in CDN configuration, ensuring proper Vary: Accept-Encoding headers.
        </p>
        <p>
          Protocol optimization improves connection efficiency. HTTP/2 enables multiplexing (multiple requests over single connection), header compression (HPACK), and server push. HTTP/3 (QUIC) provides 0-RTT resumption (instant connection for returning users), improved congestion control, and better performance on lossy networks. Enable HTTP/2 or HTTP/3 in CDN configuration for modern browsers, with HTTP/1.1 fallback for legacy clients.
        </p>

        <h3 className="mt-6">Multi-CDN Strategy</h3>
        <p>
          Multi-CDN setups use multiple CDN providers simultaneously. Redundancy ensures no single point of failure—if one CDN has an outage, traffic fails over to another. Load balancing distributes traffic across CDNs based on performance, cost, or capacity. Geo-routing uses the best CDN for each region—some CDNs have better coverage in specific regions (e.g., Cloudflare strong globally, Akamai strong in enterprise, regional CDNs strong locally). Cost optimization routes traffic to cheapest CDN for each traffic type. Health checks monitor CDN performance and availability, triggering automatic failover on issues.
        </p>
        <p>
          Multi-CDN routing approaches vary. DNS-based routing uses DNS to direct users to different CDNs—simple but slow to change (DNS TTL delays failover). Anycast routing uses same IP across CDNs, with BGP routing to nearest—fast but requires coordination. HTTP-based routing uses a routing layer (load balancer, DNS service) to direct requests—flexible but adds latency. Performance-based routing continuously measures CDN performance per region and routes accordingly—optimal but complex to implement.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          CDN delivery architecture spans origin infrastructure, CDN edge network, caching layer, and user routing. Origin infrastructure hosts original content. CDN edge network distributes content globally. Caching layer stores content at edge locations. User routing directs requests to optimal edge location. Each layer has specific responsibilities and configuration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/cdn-architecture.svg"
          alt="CDN Architecture"
          caption="Figure 1: CDN Architecture — Origin, edge nodes, caching, and user routing"
          width={1000}
          height={500}
        />

        <h3>Origin Infrastructure</h3>
        <p>
          Origin infrastructure serves as source of truth for content. Origin servers host original content, handle cache misses, and process invalidation requests. Origin shield (intermediate cache layer) consolidates cache misses from multiple edge nodes, reducing origin load. Origin configuration includes connection pooling (reuse connections to edge), keep-alive settings (maintain connections), and rate limiting (protect from traffic spikes). Origin must handle variable load—cache misses create unpredictable traffic patterns that can overwhelm unprepared origins.
        </p>
        <p>
          Origin security protects infrastructure from direct access. Restrict origin access to CDN IP ranges only (block direct user access). Use origin authentication (signed requests from CDN to origin). Implement DDoS protection at origin level (rate limiting, IP blocking). Monitor origin health and set up alerts for unusual traffic patterns. Origin security is critical—a compromised origin undermines all CDN security.
        </p>

        <h3 className="mt-6">Edge Network</h3>
        <p>
          Edge network distributes content globally through Points of Presence (PoPs). Each PoP contains cache servers serving nearby users. Edge servers handle cache hits (serve cached content), cache misses (fetch from origin), and edge computing (run logic at edge). PoP density affects performance—more PoPs means users are closer to edge, reducing latency. Major CDNs have hundreds to thousands of PoPs globally.
        </p>
        <p>
          Edge computing enables running logic at edge nodes. Cloudflare Workers, Lambda@Edge, and Vercel Edge Functions execute JavaScript/WebAssembly at edge. Use cases include A/B testing (route users to variants at edge), personalization (modify content based on user attributes), authentication (validate tokens at edge), and request transformation (modify requests before origin). Edge computing reduces origin load and latency by processing requests closer to users.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/caching-strategies.svg"
          alt="Caching Strategies"
          caption="Figure 2: Caching Strategies — Cache-aside, write-through, and stale-while-revalidate comparison"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">User Routing</h3>
        <p>
          User routing directs requests to optimal edge location. DNS-based routing returns different IPs based on user&apos;s DNS resolver location—simple but affected by DNS resolver geography (user in Tokyo using US DNS resolver may get US edge). Anycast routing advertises same IP from all PoPs, with BGP routing to nearest—fast but requires BGP expertise. HTTP-based routing uses a routing layer to direct requests based on user IP—flexible but adds latency. Latency-based routing measures actual latency to PoPs and routes to lowest—optimal but requires continuous measurement.
        </p>
        <p>
          Routing health monitoring ensures users are directed to healthy PoPs. Health checks continuously test PoP availability and performance. Unhealthy PoPs are removed from routing pool automatically. Failover routing redirects traffic from unhealthy PoPs to nearest healthy alternative. Routing health is critical for availability—a failed PoP without failover causes outages for affected users.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/cdn-invalidation-flow.svg"
          alt="Cache Invalidation Flow"
          caption="Figure 3: Cache Invalidation Flow — Purge by URL, tag-based, and versioned URLs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          CDN delivery design involves trade-offs between cache freshness and hit rate, single-CDN simplicity and multi-CDN redundancy, and edge optimization and origin control. Understanding these trade-offs enables informed decisions aligned with platform requirements and constraints.
        </p>

        <h3>Cache Freshness: Long TTL vs. Short TTL</h3>
        <p>
          Long TTL (hours to days). Pros: High cache hit rate (content stays cached longer), reduced origin load (fewer cache misses), lower CDN costs (fewer origin requests). Cons: Stale content served longer (updates delayed), requires robust invalidation (must purge on updates), risk of serving outdated content. Best for: Static content, infrequently updated content, content where brief staleness is acceptable.
        </p>
        <p>
          Short TTL (seconds to minutes). Pros: Fresh content (updates reflected quickly), reduced invalidation complexity (content expires naturally), lower staleness risk. Cons: Lower cache hit rate (content expires frequently), higher origin load (more cache misses), higher CDN costs (more origin requests). Best for: Dynamic content, frequently updated content, content where freshness is critical.
        </p>
        <p>
          Hybrid: stale-while-revalidate with appropriate max-age and stale-while-revalidate values. Pros: Best of both (fresh content with high availability, serves stale while revalidating). Cons: Complexity (two TTL values to tune), brief staleness window. Best for: Most platforms—balance freshness with availability using stale-while-revalidate.
        </p>

        <h3>CDN Strategy: Single vs. Multi-CDN</h3>
        <p>
          Single CDN. Pros: Simplicity (one provider, one configuration), lower operational overhead (one dashboard, one support relationship), potentially lower costs (volume discounts). Cons: Single point of failure (CDN outage affects all users), limited geographic optimization (one CDN may be weak in some regions), vendor lock-in (hard to switch providers). Best for: Small to medium platforms, regions with good CDN coverage, cost-conscious deployments.
        </p>
        <p>
          Multi-CDN. Pros: Redundancy (failover on CDN outage), geographic optimization (best CDN per region), negotiating leverage (can switch providers), performance optimization (route to best performing CDN). Cons: Complexity (multiple configurations, multiple dashboards), higher operational overhead (monitor multiple providers), potentially higher costs (may not qualify for volume discounts). Best for: Large platforms, global reach requirements, high availability requirements.
        </p>
        <p>
          Hybrid: primary CDN with backup for failover. Pros: Best of both (simplicity of single CDN, redundancy of multi-CDN). Cons: Backup CDN may be cold (not warmed up), failover may be slow. Best for: Most platforms—single primary CDN with backup ready for failover.
        </p>

        <h3>Edge Optimization: Aggressive vs. Conservative</h3>
        <p>
          Aggressive optimization (optimize everything at edge). Pros: Maximum performance (all optimizations applied), reduced origin load (processing at edge), consistent optimization (all users get optimized content). Cons: Higher CDN costs (optimization features cost extra), less origin control (edge may optimize differently than origin), potential quality issues (over-aggressive compression). Best for: Performance-critical platforms, image-heavy sites, global audiences with varying connection speeds.
        </p>
        <p>
          Conservative optimization (minimal optimization at edge). Pros: Lower CDN costs (basic features only), more origin control (origin handles optimization), predictable quality (origin controls optimization). Cons: Higher origin load (processing at origin), inconsistent optimization (depends on origin capacity), potentially slower performance. Best for: Cost-conscious deployments, platforms with specific quality requirements, origins with optimization capabilities.
        </p>
        <p>
          Hybrid: selective optimization (optimize high-impact content). Pros: Best of both (optimize where it matters, skip where it doesn&apos;t). Cons: Complexity (decide what to optimize), requires analysis (identify high-impact content). Best for: Most platforms—optimize images and text, skip already-optimized content.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/cdn-comparison.svg"
          alt="CDN Provider Comparison"
          caption="Figure 4: CDN Provider Comparison — Cloudflare, Akamai, Fastly, AWS CloudFront features"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Set appropriate cache headers:</strong> Cache-Control with max-age and stale-while-revalidate. ETag for validation. Vary header for content variants. Proper headers are foundation of effective caching.
          </li>
          <li>
            <strong>Use versioned URLs for static assets:</strong> app.v123.js, style.abc123.css. Natural invalidation through URL change. Long TTL (1 year) safe with versioned URLs.
          </li>
          <li>
            <strong>Implement stale-while-revalidate:</strong> Serve stale content while refreshing. Maintains availability during origin issues. Configurable staleness window.
          </li>
          <li>
            <strong>Enable compression:</strong> Brotli for modern browsers, Gzip fallback. 70-80% compression for text content. Significant bandwidth savings.
          </li>
          <li>
            <strong>Optimize images at edge:</strong> Resize, compress, format conversion. WebP/AVIF for modern browsers. 50-80% bandwidth reduction.
          </li>
          <li>
            <strong>Use HTTP/2 or HTTP/3:</strong> Multiplexing, header compression, 0-RTT. Significant performance improvement for multiple requests.
          </li>
          <li>
            <strong>Implement cache warming:</strong> Pre-populate cache for predictable traffic. Product launches, breaking news, viral content. Prevents cache miss storms.
          </li>
          <li>
            <strong>Monitor cache metrics:</strong> Cache hit rate, edge latency, origin load, bandwidth usage. Set up alerts for anomalies. Track per-region performance.
          </li>
          <li>
            <strong>Configure DDoS protection:</strong> Rate limiting, IP blocking, challenge pages. CDN absorbs attack traffic. Protect origin from spikes.
          </li>
          <li>
            <strong>Use HTTPS everywhere:</strong> TLS at edge. HSTS enforcement. Modern cipher suites. No mixed content.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No cache headers:</strong> Content not cached properly, every request hits origin. <strong>Solution:</strong> Set Cache-Control headers with appropriate max-age and stale-while-revalidate values.
          </li>
          <li>
            <strong>Too long TTL without invalidation:</strong> Stale content served indefinitely. <strong>Solution:</strong> Use versioned URLs for static assets, implement purge API for dynamic content.
          </li>
          <li>
            <strong>Caching personalized content:</strong> Wrong content served to users. <strong>Solution:</strong> No cache for personalized content, or use user-specific cache keys with proper Vary headers.
          </li>
          <li>
            <strong>No compression enabled:</strong> High bandwidth costs, slow page loads. <strong>Solution:</strong> Enable Brotli/Gzip compression in CDN configuration.
          </li>
          <li>
            <strong>Single CDN without failover:</strong> CDN outage causes complete outage. <strong>Solution:</strong> Implement multi-CDN with automatic failover, or have backup CDN ready.
          </li>
          <li>
            <strong>No monitoring:</strong> Issues undetected until users complain. <strong>Solution:</strong> Monitor cache hit rate, edge latency, origin load, error rates. Set up alerts.
          </li>
          <li>
            <strong>Poor image optimization:</strong> Large images slow pages, high bandwidth costs. <strong>Solution:</strong> Optimize images at edge, use modern formats (WebP, AVIF), implement lazy loading.
          </li>
          <li>
            <strong>Origin exposed directly:</strong> Users bypass CDN, DDoS attacks hit origin. <strong>Solution:</strong> Restrict origin access to CDN IPs only, use origin authentication.
          </li>
          <li>
            <strong>Cache pollution:</strong> Unimportant content fills cache, important content evicted. <strong>Solution:</strong> Cache only valuable content, set appropriate TTLs, use cache tags for prioritization.
          </li>
          <li>
            <strong>No invalidation strategy:</strong> Updated content not reflected, stale content served. <strong>Solution:</strong> Implement purge API, use versioned URLs, configure appropriate TTLs with stale-while-revalidate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>E-commerce Platform CDN</h3>
        <p>
          E-commerce platform uses CDN for product images, static assets, and dynamic content. Static assets (CSS, JS, product images) use versioned URLs with 1-year TTL. Product pages use 5-minute TTL with stale-while-revalidate (serve 5-minute stale while revalidating). Shopping cart and checkout bypass cache entirely (personalized, sensitive). Image optimization at edge reduces image bandwidth by 60%. Multi-CDN setup with primary (Cloudflare) and backup (AWS CloudFront) for redundancy. Black Friday traffic handled with cache warming (pre-populate popular products) and origin shield (protect origin from cache miss storms).
        </p>

        <h3 className="mt-6">News Website CDN</h3>
        <p>
          News website uses CDN for article content, images, and breaking news. Articles use 1-hour TTL with tag-based invalidation (purge by article ID when updated). Breaking news uses cache warming (pre-populate homepage, trending articles). Images optimized at edge with WebP for supporting browsers. Multi-CDN routing based on geography (best CDN per region). During major news events, cache hit rate reaches 99%+ with proper warming. Invalidation API triggers immediate purge for corrections and updates.
        </p>

        <h3 className="mt-6">Video Streaming CDN</h3>
        <p>
          Video streaming platform uses CDN for video delivery. Video segments cached with long TTL (24 hours) since content doesn&apos;t change. Manifest files (HLS/DASH) use short TTL (30 seconds) for live stream updates. Token authentication for premium content (signed URLs with expiration). Multi-CDN for global reach with geo-routing to best CDN per region. Edge computing for ad insertion (insert ads at edge based on user profile). Origin shield protects video origin from cache miss storms during popular releases.
        </p>

        <h3 className="mt-6">SaaS Application CDN</h3>
        <p>
          SaaS application uses CDN for static assets and API responses. Application bundle (JS, CSS) uses versioned URLs with 1-year TTL. API responses cached based on endpoint—read-only endpoints (GET /users, GET /projects) cached with 1-minute TTL, write endpoints invalidate related caches. Personalized dashboards bypass cache or use user-specific cache keys. Edge computing for authentication (validate JWT at edge, reject invalid tokens before origin). Multi-CDN with performance-based routing (route to fastest CDN per user).
        </p>

        <h3 className="mt-6">API Platform CDN</h3>
        <p>
          API platform uses CDN for API response caching. Public API endpoints cached with endpoint-specific TTLs (frequently accessed endpoints: 5 minutes, rarely accessed: 1 hour). Cache keys include relevant query parameters, exclude irrelevant ones (timestamps, tracking params). Rate limiting at edge protects API from abuse. API versioning through URL path (/v1/, /v2/) enables clean cache separation. Invalidation API allows API consumers to purge cached responses when underlying data changes.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache invalidation for updated content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use multiple invalidation strategies based on content type. Versioned URLs for static assets (app.v123.js → app.v124.js) provide natural invalidation. Purge by URL for specific content updates. Tag-based invalidation for grouped content (purge all &quot;article-123&quot; tagged content). Stale-while-revalidate maintains availability during invalidation. The key insight: no single strategy works for all cases—use versioned URLs for static, purge API for dynamic, and accept brief staleness for high-availability requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize CDN costs at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Optimize across multiple dimensions. Compression (Brotli/Gzip) reduces bandwidth 70-80%. Image optimization (resize, WebP/AVIF) reduces image bandwidth 50-80%. Cache hit optimization (appropriate TTLs, cache warming) reduces origin requests. Tiered pricing negotiation (volume discounts, committed use). Multi-CDN routing (route to cheapest CDN for traffic type). Monitor bandwidth usage per CDN, per region, per content type. The operational insight: CDN costs scale with traffic—optimization compounds at scale, making even small percentage improvements worth significant investment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What caching strategy do you recommend for different content types?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Match strategy to content characteristics. Static assets (CSS, JS, images): versioned URLs with 1-year TTL, cache-aside pattern. Dynamic content (HTML pages, API responses): short TTL (minutes) with stale-while-revalidate, ETag validation. Personalized content (dashboards, recommendations): no cache or user-specific cache keys, very short TTL. Frequently updated content (news, stock prices): short TTL with tag-based invalidation. The key principle: one size doesn&apos;t fit all—different content types have different freshness requirements and access patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement multi-CDN failover?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement health monitoring and automatic failover. Health checks continuously test each CDN&apos;s availability and performance (response time, error rate). DNS-based failover updates DNS records to point to healthy CDN (slow due to DNS TTL). HTTP-based failover uses routing layer to direct traffic to healthy CDN (faster but adds latency). Anycast failover relies on BGP to withdraw routes from unhealthy CDN (fastest but requires BGP expertise). The operational challenge: balance failover speed with stability—too sensitive causes flapping, too slow causes extended outages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect against DDoS attacks with CDN?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Leverage CDN&apos;s DDoS mitigation capabilities. Rate limiting at edge blocks excessive requests per IP. IP blocking bans known malicious IPs. Challenge pages (CAPTCHA, JavaScript challenge) filter bots from humans. WAF rules block common attack patterns (SQL injection, XSS). CDN absorbs attack traffic across distributed edge network, protecting origin. Origin shield provides additional protection layer. The key insight: CDN&apos;s distributed nature makes it ideal for DDoS mitigation—attack traffic is absorbed across hundreds of PoPs rather than overwhelming single origin.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you monitor CDN performance and detect issues?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Monitor multiple metrics with alerting. Cache hit rate (target: 90%+ for static, varies for dynamic). Edge latency (p50, p95, p99 per region). Origin load (requests per second, bandwidth). Error rates (4xx, 5xx errors per CDN). Bandwidth usage (per CDN, per region, per content type). Set up alerts for anomalies (sudden drop in cache hit rate, latency spike, error rate increase). Track per-region performance to identify regional issues. The operational insight: proactive monitoring catches issues before users notice—cache hit rate drop often precedes origin overload.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/fast/#optimize-your-content"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Content Optimization Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — HTTP Caching Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare — CDN Learning Center
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/cloudfront/features/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — CloudFront Features and Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.fastly.com/blog/tag/caching-best-practices"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fastly — Caching Best Practices Blog
            </a>
          </li>
          <li>
            <a
              href="https://www.akamai.com/resources"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Akamai — CDN Resources and Whitepapers
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
