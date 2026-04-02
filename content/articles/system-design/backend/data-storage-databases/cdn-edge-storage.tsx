"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cdn-edge-storage-complete",
  title: "CDN and Edge Storage",
  description:
    "Comprehensive guide to CDN and edge storage: edge caching, cache invalidation strategies, geographic distribution, and when to use CDNs for static assets and media delivery.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cdn-edge-storage",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "cdn", "edge-computing", "caching"],
  relatedTopics: [
    "object-storage",
    "caching-strategies",
    "performance-optimization",
    "web-security",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>CDN and Edge Storage</h1>
        <p className="lead">
          Content Delivery Networks (CDNs) and edge storage distribute content across geographically
          dispersed servers (edge locations, Points of Presence) to reduce latency and offload
          origin servers. Instead of users fetching content from a single origin server (e.g.,
          S3 bucket in us-east), they fetch from the nearest edge server (5-50ms vs 50-200ms).
          CDNs cache static assets (images, CSS, JavaScript), media (videos, streams), and
          increasingly dynamic content (API responses, personalized content via edge computing).
        </p>

        <p>
          Consider a global e-commerce site. Product images stored in S3 (us-east) would take
          150ms for EU users, 200ms for Asia users. With a CDN, images are cached at edge
          locations worldwide. EU users fetch from London edge (10ms), Asia users from Singapore
          edge (15ms). The origin (S3) only serves cache misses (first request per edge),
          reducing origin load by 90-99%.
        </p>

        <p>
          CDNs have evolved beyond simple caching. Modern CDNs offer <strong>edge computing</strong>
          (run code at edge—Cloudflare Workers, Lambda@Edge), <strong>image optimization</strong>
          (resize, compress at edge), <strong>DDoS protection</strong> (absorb attacks at edge),
          and <strong>API acceleration</strong> (cache API responses, route to nearest origin).
          This transforms CDNs from static asset delivery to full edge platforms.
        </p>

        <p>
          This article provides a comprehensive examination of CDNs and edge storage: CDN
          architecture (edge locations, origin shield, request flow), caching strategies
          (TTL-based, cache invalidation, versioned URLs), cache hit ratio optimization,
          edge computing capabilities, and real-world use cases. We'll explore when CDNs
          excel (static assets, media delivery, global websites) and when they introduce
          complexity (cache invalidation, dynamic content, cost management). We'll also
          cover implementation patterns (Cache-Control headers, purge APIs, versioned URLs)
          and common pitfalls (caching sensitive data, no invalidation strategy).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cdn-edge-architecture.svg`}
          caption="Figure 1: CDN and Edge Storage Architecture showing CDN request flow (User requests content → Edge Server checks cache → Cache Hit: serve from edge (fast), Cache Miss: fetch from origin (S3/Server), cache, then serve). Edge locations distributed globally (US-East with 10 PoPs, EU-West with 8 PoPs, Asia with 6 PoPs). Users routed to nearest PoP, reducing latency from 50ms to 5ms. PoP = Point of Presence (edge server). Caching strategies: TTL-Based (Cache-Control headers), Cache Invalidation (purge by URL/pattern), Versioned URLs (file.v2.js - immutable), Stale-While-Revalidate (serve stale, refresh in background). Key characteristics: edge caching, geographic distribution, cache invalidation, origin shield."
          alt="CDN and edge storage architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Edge Caching &amp; Invalidation</h2>

        <h3>CDN Architecture</h3>
        <p>
          <strong>CDN architecture</strong> has three components: <strong>edge locations</strong>
          (Points of Presence, PoPs—servers worldwide), <strong>origin</strong> (where content
          lives—S3, web server), and <strong>DNS routing</strong> (direct users to nearest edge).
        </p>

        <p>
          Request flow: (1) User requests <code className="inline-code">example.com/logo.png</code>.
          (2) DNS routes to nearest edge (based on user's IP). (3) Edge checks cache.
          <strong>Cache hit</strong>: serve from edge (fast, 5-50ms).
          <strong>Cache miss</strong>: fetch from origin, cache at edge, serve to user
          (slow for first request, fast thereafter).
        </p>

        <p>
          <strong>Origin shield</strong> is an intermediate cache between edge and origin.
          Multiple edges fetch from shield (not origin), reducing origin load further.
          Example: 100 edge locations, 10 miss same content. Without shield: 100 origin
          requests. With shield: 1 origin request (shield caches, edges fetch from shield).
        </p>

        <h3>Cache Control</h3>
        <p>
          <strong>Cache-Control headers</strong> tell CDNs how to cache content. Key directives:
          <code className="inline-code">max-age=3600</code> (cache for 1 hour),
          <code className="inline-code">public</code> (cacheable by CDN),
          <code className="inline-code">private</code> (don't cache—user-specific),
          <code className="inline-code">no-cache</code> (revalidate with origin before serving),
          <code className="inline-code">no-store</code> (don't cache at all).
        </p>

        <p>
          Example: <code className="inline-code">Cache-Control: public, max-age=31536000</code>
          (cache for 1 year—use for versioned assets like
          <code className="inline-code">app.abc123.js</code>).
          <code className="inline-code">Cache-Control: private, no-cache</code> (don't cache—user
          profiles, sensitive data).
        </p>

        <h3>Cache Invalidation</h3>
        <p>
          <strong>Cache invalidation</strong> removes content from CDN cache before TTL expires.
          Methods: <strong>TTL expiration</strong> (wait for TTL to expire—simple, but stale
          data until then), <strong>Manual purge</strong> (API call to remove specific URLs—immediate,
          but API cost, propagation delay), <strong>Versioned URLs</strong>
          (<code className="inline-code">app.v2.js</code>—new URL bypasses cache, infinite TTL
          for immutable assets).
        </p>

        <p>
          Best practices: Use versioned URLs for static assets (JS, CSS—immutable, infinite TTL).
          Use TTL for dynamic content (HTML, API responses—short TTL, revalidate). Use purge
          for urgent updates (breaking news, critical bug fixes).
        </p>

        <h3>Cache Hit Ratio</h3>
        <p>
          <strong>Cache hit ratio</strong> = Hits / (Hits + Misses). Measures CDN effectiveness.
          Target: 90%+ for static assets, 50-80% for dynamic content. Low hit ratio means
          most requests hit origin (CDN not helping).
        </p>

        <p>
          Improving hit ratio: <strong>Longer TTL</strong> (but risk stale data),
          <strong>Versioned URLs</strong> (infinite TTL for immutable assets),
          <strong>Cache popular content only</strong> (don't cache long-tail, one-off requests),
          <strong>Origin shield</strong> (reduce origin load even on misses).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cdn-cache-strategies.svg`}
          caption="Figure 2: CDN Cache Invalidation and Strategies showing cache invalidation methods: (1) TTL-Based Expiration (Cache-Control: max-age=3600 - 1 hour), (2) Manual Purge/Invalidation (DELETE /cache/images/logo.png), (3) URL Versioning/Immutable (app.v2.js, style.abc123.css). TTL is simple but stale data until expiration. Purge is immediate but has API cost and propagation delay. Versioning is best for static assets (JS, CSS). Cache hit ratio formula: Hits / (Hits + Misses), target 90%+ for static assets. Improving hit ratio: longer TTL (but risk stale data), versioned URLs (infinite TTL), cache popular content only. Edge computing beyond caching: Edge Functions (run code at edge), A/B Testing (route users at edge), Image Optimization (resize, compress at edge), Bot Protection (DDoS mitigation). Key takeaway: cache invalidation is critical—TTL for simple, purge for urgent, versioning for static assets."
          alt="CDN cache strategies and invalidation"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Edge Computing</h2>

        <h3>Edge Computing</h3>
        <p>
          Modern CDNs offer <strong>edge computing</strong>—run code at edge locations, not
          just cache content. Edge functions (Cloudflare Workers, Lambda@Edge, Vercel Edge
          Functions) execute JavaScript/WebAssembly at edge, enabling:
        </p>

        <p>
          <strong>A/B testing</strong>: Route users to different variants at edge (no origin
          involvement). <strong>Personalization</strong>: Modify content based on user location,
          device, preferences (at edge, low latency). <strong>API aggregation</strong>: Call
          multiple APIs at edge, combine results (reduce round-trips to origin).
          <strong>Bot protection</strong>: Run bot detection at edge (block before hitting
          origin). <strong>Image optimization</strong>: Resize, compress, convert formats
          (WebP, AVIF) at edge (no origin processing).
        </p>

        <p>
          Edge computing reduces latency (code runs near users), offloads origin (processing
          at edge, not origin), and scales automatically (edge locations handle load).
          Trade-offs: limited runtime (JavaScript/WASM, not full servers), cold starts
          (first invocation slower), vendor lock-in (provider-specific APIs).
        </p>

        <h3>DDoS Protection</h3>
        <p>
          CDNs provide <strong>DDoS protection</strong> by absorbing attacks at edge. Edge
          locations have massive bandwidth (100+ Tbps combined), far more than typical origins.
          Attacks are distributed across edges, filtered (bot detection, rate limiting), and
          only legitimate traffic reaches origin.
        </p>

        <p>
          DDoS protection layers: <strong>Layer 3/4</strong> (network layer—SYN floods, UDP
          amplification), <strong>Layer 7</strong> (application layer—HTTP floods, slowloris),
          <strong>WAF</strong> (Web Application Firewall—SQL injection, XSS, OWASP Top 10).
        </p>

        <h3>Media Delivery</h3>
        <p>
          CDNs specialize in <strong>media delivery</strong>: <strong>Video streaming</strong>
          (HLS, DASH—adaptive bitrate streaming, segments cached at edge),
          <strong>Live streaming</strong> (low-latency delivery, edge caching of live segments),
          <strong>Image CDN</strong> (resize, compress, format conversion at edge—serve
          WebP to Chrome, AVIF to Firefox, JPEG as fallback).
        </p>

        <p>
          Video streaming: Source video encoded into multiple bitrates (480p, 720p, 1080p, 4K).
          CDN caches segments (.ts files) and manifest (.m3u8). Player requests nearest segment
          (edge), adapts bitrate based on bandwidth. Benefits: low buffering (edge delivery),
          reduced origin load (segments cached), global scale (edges worldwide).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cdn-edge-use-cases.svg`}
          caption="Figure 3: CDN and Edge Storage Use Cases. Primary use cases: Static Assets (JavaScript, CSS files, images, icons, fonts, versioned URLs immutable, high cache hit ratio 99%+, origin offload 90%+ reduction), Media Delivery (video streaming HLS/DASH, image CDN resize/compress, large file downloads, live streaming low latency, adaptive bitrate streaming), Global Websites (e-commerce product images, news/media sites, SaaS applications, low latency globally 5-50ms, DDoS protection). Performance Impact (typical): Latency 50-200ms to 5-50ms, Origin Load 90-99% reduction, Throughput 10-100x improvement, Availability 99.99%+ SLA. Anti-patterns: caching dynamic/personalized content (stale user data), no cache invalidation strategy (stale content forever), caching sensitive data (security risk), ignoring cache headers (CDN can't optimize)."
          alt="CDN and edge storage use cases"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: CDN vs Origin</h2>

        <p>
          CDNs complement origin storage (S3, web servers). Understanding the trade-offs
          helps you architect optimal delivery.
        </p>

        <h3>CDN Strengths</h3>
        <p>
          <strong>Low latency</strong> is the primary advantage. Edge locations near users
          (5-50ms vs 50-200ms to origin). Essential for global audiences, performance-sensitive
          applications (e-commerce, media).
        </p>

        <p>
          <strong>Origin offload</strong>—CDN serves 90-99% of requests from cache. Origin
          handles only cache misses (first request per edge, post-invalidation). Reduces
          origin costs (fewer S3 requests, less compute), improves origin reliability
          (less load = fewer failures).
        </p>

        <p>
          <strong>Scalability</strong>—CDNs handle traffic spikes automatically. Edges absorb
          load (viral content, flash sales). Origin doesn't need to scale for peak traffic.
        </p>

        <p>
          <strong>DDoS protection</strong>—CDNs absorb attacks at edge. Massive bandwidth
          (100+ Tbps), bot detection, WAF. Origin protected behind CDN.
        </p>

        <h3>CDN Limitations</h3>
        <p>
          <strong>Cache invalidation complexity</strong>—updating cached content requires
          strategy (TTL, purge, versioning). Wrong strategy causes stale content or high
          purge costs.
        </p>

        <p>
          <strong>Dynamic content challenges</strong>—CDNs excel at static content. Dynamic
          content (personalized, real-time) has lower hit ratios (50-80% vs 90-99% for
          static). Edge computing helps but adds complexity.
        </p>

        <p>
          <strong>Cost</strong>—CDNs charge per GB served, requests, and features (WAF,
          edge computing). For high-traffic sites, CDN costs can exceed origin costs.
          Optimize: long TTLs, versioned URLs, cache aggressively.
        </p>

        <p>
          <strong>Vendor lock-in</strong>—CDN configurations, edge functions, APIs are
          provider-specific. Migrating CDNs requires reconfiguration, testing.
        </p>

        <h3>When to Use CDN</h3>
        <p>
          Use CDN for: <strong>Static assets</strong> (JS, CSS, images, fonts—versioned,
          infinite TTL), <strong>Media delivery</strong> (videos, images, live streams),
          <strong>Global websites</strong> (users worldwide, low latency required),
          <strong>DDoS protection</strong> (public-facing sites, attack-prone),
          <strong>Origin offload</strong> (high traffic, reduce origin costs).
        </p>

        <p>
          Avoid CDN for: <strong>Highly dynamic content</strong> (user-specific, real-time—low
          hit ratio), <strong>Sensitive data</strong> (PII, financial—caching risk),
          <strong>Internal APIs</strong> (not public-facing, no latency benefit),
          <strong>Low-traffic sites</strong> (CDN cost may exceed benefit).
        </p>

        <h3>CDN Providers Comparison</h3>
        <p>
          <strong>Cloudflare</strong>: Large network (200+ PoPs), free tier, edge computing
          (Workers), DDoS protection. Best for: small to medium sites, edge computing.
          <strong>AWS CloudFront</strong>: Deep AWS integration (S3, Lambda@Edge), pay-per-use.
          Best for: AWS-native applications. <strong>Fastly</strong>: High performance,
          real-time analytics, VCL configuration. Best for: media delivery, high-traffic
          sites. <strong>Akamai</strong>: Largest network (300+ PoPs), enterprise features.
          Best for: enterprise, global scale.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for CDN and Edge Storage</h2>

        <p>
          <strong>Set appropriate Cache-Control headers.</strong> Versioned assets
          (<code className="inline-code">app.abc123.js</code>):
          <code className="inline-code">public, max-age=31536000, immutable</code>
          (1 year, immutable). Dynamic content (HTML):
          <code className="inline-code">public, max-age=60</code> (1 minute, revalidate).
          User-specific: <code className="inline-code">private, no-cache</code> (don't cache).
        </p>

        <p>
          <strong>Use versioned URLs for static assets.</strong> Build process generates
          hashed filenames (<code className="inline-code">app.abc123.js</code>). Deploy
          new version → new URL → CDN caches as new content. Old version remains cached
          (no invalidation needed). Infinite TTL safe (URL changes on update).
        </p>

        <p>
          <strong>Implement cache invalidation strategy.</strong> For non-versioned content
          (images, HTML), define invalidation process: TTL-based (wait for expiration),
          purge API (remove specific URLs), or versioned directories
          (<code className="inline-code">/v2/images/logo.png</code>). Document when to use
          each method.
        </p>

        <p>
          <strong>Monitor cache hit ratio.</strong> Track hit ratio per content type.
          Target: 90%+ for static, 50-80% for dynamic. Low hit ratio: increase TTL,
          version URLs, or don't cache (if hit ratio too low, CDN not helping).
        </p>

        <p>
          <strong>Enable compression.</strong> Gzip/Brotli compression at edge reduces
          bandwidth (70-90% for text). Most CDNs compress automatically. Verify compression
          enabled, test compressed vs uncompressed sizes.
        </p>

        <p>
          <strong>Use origin shield.</strong> For multi-region CDNs, enable origin shield
          (intermediate cache). Reduces origin requests (edges fetch from shield, not
          origin). Especially beneficial for large files, popular content.
        </p>

        <p>
          <strong>Configure DDoS protection.</strong> Enable WAF, rate limiting, bot
          detection. Test DDoS protection (simulate attack, verify mitigation). Document
          incident response (who to contact, escalation).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Caching sensitive data.</strong> CDN caching user-specific data (profiles,
          financial info) causes data leaks. Solution: Set
          <code className="inline-code">Cache-Control: private, no-cache</code> for
          sensitive content, use authentication at edge (verify before serving), never
          cache PII.
        </p>

        <p>
          <strong>No cache invalidation strategy.</strong> Content updates but CDN serves
          stale version. Solution: Use versioned URLs for static assets (no invalidation
          needed), define purge process for dynamic content, test invalidation (update
          content, verify CDN serves new version).
        </p>

        <p>
          <strong>Ignoring cache headers.</strong> Origin sends no/wrong Cache-Control
          headers. CDN can't optimize caching. Solution: Configure origin to send correct
          headers, test headers (curl -I, verify Cache-Control), use CDN to override
          headers if origin can't be changed.
        </p>

        <p>
          <strong>Caching dynamic content aggressively.</strong> HTML, API responses cached
          too long → stale user experience. Solution: Short TTL for dynamic content
          (1-60 seconds), use stale-while-revalidate (serve stale while fetching new),
          edge computing for personalization (modify at edge, not origin).
        </p>

        <p>
          <strong>Not monitoring CDN performance.</strong> Hit ratio drops, latency increases,
          costs spike—undetected until users complain. Solution: Monitor hit ratio, latency,
          bandwidth, costs. Alert on anomalies (hit ratio &lt;80%, latency &gt;100ms).
        </p>

        <p>
          <strong>Overlooking mobile optimization.</strong> Desktop-optimized images served
          to mobile (wasted bandwidth, slow load). Solution: Use image CDN (resize at edge),
          serve responsive images (srcset), detect device type at edge (serve appropriate
          size).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce (Amazon, Shopify)</h3>
        <p>
          E-commerce platforms use CDNs for product images, CSS, JavaScript. Benefits:
          fast page loads (critical for conversion—100ms delay = 1% sales drop), global
          low latency (users worldwide), origin offload (90%+ requests served from cache),
          DDoS protection (Black Friday traffic spikes, attack mitigation).
        </p>

        <p>
          This pattern works because e-commerce has static assets (product images, stylesheets)
          that benefit from caching, global audience (low latency required), and traffic
          spikes (sales events—CDN absorbs load).
        </p>

        <h3>Media Streaming (Netflix, YouTube)</h3>
        <p>
          Streaming platforms use CDNs for video delivery. Video encoded into segments
          (HLS/DASH), cached at edge. Users fetch segments from nearest edge (low buffering),
          adapt bitrate based on bandwidth. Benefits: low buffering (edge delivery), reduced
          origin load (segments cached), global scale (edges worldwide).
        </p>

        <p>
          This pattern works because video is large (GB per hour), latency-sensitive
          (buffering frustrates users), and benefits from caching (popular content served
          from edge).
        </p>

        <h3>SaaS Applications (Slack, Notion)</h3>
        <p>
          SaaS applications use CDNs for static assets (JS bundles, CSS, images) and
          increasingly for API acceleration. Benefits: fast app load (JS/CSS cached),
          API acceleration (cache GET responses at edge), DDoS protection (public-facing
          APIs), edge computing (personalization, A/B testing at edge).
        </p>

        <p>
          This pattern works because SaaS has static assets (app bundles—versioned,
          cacheable), API responses (GET requests—cacheable), and needs low latency
          (user experience critical).
        </p>

        <h3>News/Media Sites (CNN, BBC)</h3>
        <p>
          News sites use CDNs for articles, images, videos. Benefits: handle traffic
          spikes (breaking news—10-100x normal traffic), global low latency (readers
          worldwide), origin offload (90%+ requests from cache), cache invalidation
          (purge breaking news updates immediately).
        </p>

        <p>
          This pattern works because news has traffic spikes (unpredictable—CDN absorbs),
          global audience (readers worldwide), and content updates (purge API for urgent
          updates).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you use a CDN? What are the signs that a CDN is needed?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use CDN for global audiences, static assets, media
              delivery, high traffic. Signs: (1) Users complain about slow load times
              (especially international), (2) Origin server under heavy load (high CPU,
              bandwidth), (3) High bounce rates (slow site → users leave), (4) Traffic
              spikes causing origin failures, (5) DDoS attacks (need protection),
              (6) High origin costs (S3 requests, bandwidth). Don't use CDN for: internal
              APIs, low-traffic sites (CDN cost may exceed benefit), highly dynamic content
              (low hit ratio).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's a good cache hit ratio? Answer: 90-99%
              for static assets (JS, CSS, images), 50-80% for dynamic content (HTML, API
              responses). Below 50%: CDN not helping much—reconsider caching strategy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do you handle cache invalidation? Compare TTL, purge, and versioned URLs.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cache invalidation removes content from CDN cache
              before TTL expires. TTL-based: set Cache-Control max-age, wait for expiration.
              Pros: simple, no API calls. Cons: stale data until expiration. Purge: API
              call to remove specific URLs. Pros: immediate. Cons: API cost, propagation
              delay (seconds to minutes). Versioned URLs:
              <code className="inline-code">app.abc123.js</code>—new URL on update. Pros:
              infinite TTL, no invalidation needed. Cons: requires build process changes.
              Best practice: versioned URLs for static assets (JS, CSS—immutable), TTL for
              dynamic content (HTML—short TTL), purge for urgent updates (breaking news,
              critical bug fixes).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is stale-while-revalidate? Answer: Cache
              directive that serves stale content while fetching new content in background.
              User gets fast response (stale cache), CDN updates cache asynchronously.
              Best of both worlds: low latency, fresh content eventually.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How does a CDN reduce latency? What's the typical improvement?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> CDN reduces latency via geographic distribution.
              Without CDN: user → origin (50-200ms, depending on distance). With CDN:
              user → nearest edge (5-50ms). Improvement: 50-200ms → 5-50ms (10x improvement).
              How: (1) Edge locations near users (200+ PoPs worldwide), (2) DNS routing
              (direct to nearest edge), (3) Caching (serve from edge, not origin),
              (4) Optimizations (compression, HTTP/2, TCP optimizations at edge).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What affects edge latency? Answer: Distance to
              nearest edge (closer = faster), network congestion (peering agreements help),
              cache hit/miss (hit = fast, miss = origin fetch), edge server load (busy
              edges slower).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you prevent CDN from caching sensitive user data?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Prevent CDN caching of sensitive data via headers
              and configuration. Headers:
              <code className="inline-code">Cache-Control: private, no-cache</code>
              (don't cache), <code className="inline-code">Authorization</code> header
              present (most CDNs don't cache authenticated requests). Configuration:
              whitelist/blacklist URLs (cache static, don't cache /api/user/*), use
              edge functions to check authentication (don't cache if authenticated).
              Best practice: default to caching (public, max-age), explicitly mark
              sensitive endpoints as non-cacheable. Test: verify sensitive responses
              have correct headers, test CDN behavior (fetch authenticated, verify not
              cached).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if sensitive data is accidentally cached?
              Answer: Purge immediately (CDN API), rotate session tokens (invalidate
              cached sessions), audit logs (check if data was served to wrong users),
              implement prevention (headers, configuration) to avoid recurrence.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Explain edge computing. What can you do at the edge vs origin?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Edge computing runs code at edge locations (not
              just cache content). Edge functions (Cloudflare Workers, Lambda@Edge)
              execute JavaScript/WebAssembly at edge. Can do at edge: A/B testing (route
              users to variants), personalization (modify content based on location/device),
              API aggregation (call multiple APIs, combine results), bot protection
              (detect/block bots before origin), image optimization (resize, compress),
              authentication (verify tokens at edge). Can't do at edge: heavy computation
              (limited CPU/memory), database writes (no persistent storage at edge),
              complex business logic (limited runtime). Trade-offs: edge is low-latency,
              scales automatically, but limited runtime (JS/WASM), vendor lock-in.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you use edge computing vs origin?
              Answer: Edge for latency-sensitive, read-heavy, simple logic (A/B testing,
              personalization). Origin for heavy computation, database writes, complex
              business logic. Hybrid: edge for caching/personalization, origin for
              core logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your CDN costs are unexpectedly high. How do you diagnose and reduce them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check bandwidth usage (GB served—high
              bandwidth = high cost), (2) Check request count (requests charged per 10K),
              (3) Check cache hit ratio (low hit ratio = more origin fetches = higher cost),
              (4) Check features enabled (WAF, edge computing—add-ons cost extra),
              (5) Check geographic distribution (some regions cost more). Reduce:
              (1) Increase cache TTL (fewer origin fetches), (2) Use versioned URLs
              (infinite TTL, no invalidation), (3) Enable compression (reduce bandwidth),
              (4) Optimize images (smaller files = less bandwidth), (5) Use origin shield
              (reduce origin requests), (6) Negotiate pricing (high volume = discounts).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the biggest cost driver? Answer: Bandwidth
              (GB served) is typically 70-80% of cost. Requests are 10-20%, features
              (WAF, edge computing) are 10-20%. Focus on reducing bandwidth (compression,
              image optimization, caching) for biggest savings.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Cloudflare Documentation, "How CDNs Work," "Cache-Control,"
            https://developers.cloudflare.com/
          </li>
          <li>
            AWS CloudFront Documentation, "Caching," "Lambda@Edge,"
            https://docs.aws.amazon.com/cloudfront/
          </li>
          <li>
            Fastly Documentation, "Caching," "Edge Computing,"
            https://developer.fastly.com/
          </li>
          <li>
            Akamai Documentation, "CDN," "Edge Workers,"
            https://developer.akamai.com/
          </li>
          <li>
            MDN, "HTTP Caching," "Cache-Control,"
            https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
          </li>
          <li>
            Google Developers, "Web Fundamentals: Performance,"
            https://developers.google.com/web/fundamentals/performance/
          </li>
          <li>
            Netflix Tech Blog, "Open Connect CDN,"
            https://netflixtechblog.com/
          </li>
          <li>
            Shopify Engineering Blog, "CDN at Shopify,"
            https://shopify.engineering/
          </li>
          <li>
            Vercel Documentation, "Edge Functions,"
            https://vercel.com/docs
          </li>
          <li>
            W3C, "HTTP/2 Specification,"
            https://www.w3.org/TR/http2/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
