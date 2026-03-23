"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cdn-strategy-extensive",
  title: "CDN Strategy",
  description:
    "Staff-level deep dive into CDN architecture, cache invalidation, multi-CDN failover, edge compute, security hardening, and cost optimization strategies for frontend asset delivery.",
  category: "frontend",
  subcategory: "asset-management",
  slug: "cdn-strategy",
  wordCount: 4800,
  readingTime: 20,
  lastUpdated: "2026-03-21",
  tags: [
    "frontend",
    "CDN",
    "edge",
    "caching",
    "multi-CDN",
    "cache invalidation",
    "Cloudflare",
    "performance",
    "security",
  ],
  relatedTopics: [
    "browser-caching",
    "cdn-caching",
    "cache-invalidation-strategies",
    "compression",
    "resource-hints",
  ],
};

export default function CdnStrategyExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>Content Delivery Network (CDN)</strong> is a globally
          distributed system of edge servers that caches and serves content from
          locations geographically close to end users, dramatically reducing
          latency and offloading traffic from origin servers. CDN strategy
          encompasses far more than simply &quot;putting files on a CDN&quot; - it
          involves deliberate decisions about cache architecture, invalidation
          models, multi-CDN redundancy, edge compute capabilities, security
          posture, and cost optimization.
        </p>
        <p>
          At the staff/principal engineer level, CDN strategy is a critical
          infrastructure design decision that directly impacts page load times
          (every 100ms of latency costs approximately 1% in conversion),
          availability SLAs (the CDN is often the first point of failure users
          encounter), and operational cost (CDN egress can represent 30-60% of
          infrastructure spend for media-heavy applications).
        </p>
        <p>
          Modern CDNs have evolved from simple static file caches into
          full-featured edge platforms. Cloudflare Workers, Fastly Compute@Edge,
          and AWS CloudFront Functions enable running application logic at the
          edge, blurring the line between CDN and application server. This shift
          requires engineers to think about CDNs as a programmable layer in
          their architecture, not just a caching proxy.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Edge PoP (Point of Presence):</strong> A data center in the
            CDN network containing cache storage, TLS termination, and routing
            logic. Major CDNs operate 200-400+ PoPs. Each PoP independently
            caches content, meaning the same asset may be stored hundreds of
            times globally. The PoP closest to a user (determined by anycast
            routing) handles their request.
          </li>
          <li>
            <strong>Origin Server:</strong> The authoritative source of content -
            your application server, S3 bucket, or other storage. The CDN only
            contacts the origin on cache misses or revalidation. Origin offload
            rate (percentage of requests served from cache) is a key metric;
            well-tuned CDNs achieve 95-99% offload for static assets.
          </li>
          <li>
            <strong>Origin Shield (Mid-Tier Cache):</strong> An intermediate
            caching layer between edge PoPs and the origin. When multiple edge
            PoPs experience simultaneous cache misses (e.g., after a purge or
            deploy), the shield coalesces these into a single origin request,
            preventing thundering herd problems. Cloudflare calls this
            &quot;Tiered Caching,&quot; Fastly calls it &quot;Shielding,&quot; and CloudFront
            offers &quot;Origin Shield.&quot;
          </li>
          <li>
            <strong>Push vs. Pull CDN:</strong> In a <em>pull</em> model (most
            common), the CDN fetches content from the origin on first request
            and caches it. In a <em>push</em> model, you proactively upload
            content to the CDN before users request it. Pull is simpler and
            more prevalent; push is used for large media files (video
            transcoding pipelines pushing to CDN storage) or when you need
            guaranteed cache warming.
          </li>
          <li>
            <strong>Cache Key:</strong> The identifier the CDN uses to store and
            lookup cached responses. By default, this is the full URL (scheme +
            host + path + query string). Customizing cache keys (e.g., ignoring
            marketing query parameters, varying by device type) is essential for
            optimizing cache hit ratios.
          </li>
          <li>
            <strong>Vary Header:</strong> Instructs the CDN to maintain separate
            cached copies for different request characteristics. For example,{" "}
            <code>Vary: Accept-Encoding</code> keeps separate gzip and brotli
            copies. Overuse of Vary (e.g., <code>Vary: User-Agent</code>)
            destroys cache hit rates because each unique user-agent string
            creates a separate cache entry.
          </li>
          <li>
            <strong>Anycast Routing:</strong> A networking technique where the
            same IP address is announced from multiple PoPs. The network layer
            routes each user to the topologically nearest PoP. This provides
            automatic geographic load balancing and DDoS resilience (attack
            traffic is distributed across all PoPs).
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The following diagram illustrates a typical CDN architecture with
          three tiers: edge PoPs that terminate TLS and serve cached content,
          a shield layer that coalesces cache misses, and the origin server.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/cdn-strategy-diagram-1.svg"
          alt="CDN architecture with edge, shield, and origin layers showing request flow"
          caption="Figure 1: Multi-tier CDN architecture showing edge PoPs, shield layer, and origin server with request flow paths"
        />
        <p>
          When a user requests an asset, their DNS query resolves via anycast
          to the nearest edge PoP. The PoP checks its local cache: on a hit,
          the response is served immediately (typically 5-50ms). On a miss, the
          request flows to the shield PoP, which may have the content cached
          from another edge&apos;s earlier miss. Only if the shield also misses does
          the request reach the origin. This tiered approach means a single
          origin fetch populates both the shield and requesting edge, and
          subsequent misses from other edges hit the warm shield cache instead
          of the origin.
        </p>

        <h3 className="mt-6 font-semibold">Cache-Control Header Design</h3>
        <p>
          Correct cache header configuration is the foundation of CDN strategy.
          The primary directives to understand: For static assets with content
          hashing (like <code>/assets/main.a1b2c3d4.js</code>), use{" "}
          <code>Cache-Control: public, max-age=31536000, immutable</code>. For
          HTML pages, use a short cache with revalidation:{" "}
          <code>Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300</code>{" "}
          which caches for 60 seconds at the CDN and serves stale content for up
          to 5 minutes while revalidating. API responses use{" "}
          <code>Cache-Control: private, max-age=60, must-revalidate</code> to
          allow browser caching but prevent CDN caching. CDN-specific directives
          like <code>Surrogate-Control: max-age=86400</code> are stripped by
          Fastly/Varnish-based CDNs before forwarding to the client. The{" "}
          <code>Vary</code> header should be used sparingly —{" "}
          <code>Vary: Accept-Encoding</code> is appropriate, but{" "}
          <code>Vary: User-Agent</code> destroys cache hit rates by creating a
          separate cache entry for every unique user-agent string. Instead,
          normalize device detection at the edge and use{" "}
          <code>Vary: X-Device-Type</code>.
        </p>
        <p>
          The distinction between <code>max-age</code> and{" "}
          <code>s-maxage</code> is critical: <code>max-age</code> applies to
          both browsers and CDNs, while <code>s-maxage</code> applies only to
          shared caches (CDNs). This lets you keep CDN TTLs long while keeping
          browser caches short, giving you the ability to purge the CDN
          instantly while still benefiting from edge caching.
        </p>

        <h3 className="mt-6 font-semibold">Cache Invalidation Strategies</h3>
        <p>
          Cache invalidation is famously one of the two hard problems in
          computer science. The following diagram compares the main approaches:
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/cdn-strategy-diagram-2.svg"
          alt="CDN cache invalidation flow showing purge propagation, TTL expiry, and stale-while-revalidate"
          caption="Figure 2: Cache invalidation strategies - TTL expiry, purge propagation, stale-while-revalidate, versioned URLs, and surrogate keys"
        />

        <h4 className="mt-4 font-semibold">Versioned URLs (Content Hashing)</h4>
        <p>
          The most reliable invalidation strategy is to never invalidate at all.
          By embedding a content hash in the filename (e.g.,{" "}
          <code>main.a1b2c3d4.js</code>), each deploy produces new URLs.
          Old URLs remain valid (cached indefinitely), and new URLs are fetched
          fresh. Webpack, Vite, and other bundlers generate these hashes
          automatically. The HTML document that references these assets uses a
          short TTL or <code>no-cache</code> so users always get the latest
          asset manifest.
        </p>

        <h4 className="mt-4 font-semibold">Surrogate Keys (Cache Tags)</h4>
        <p>
          For dynamic content that cannot use versioned URLs (product pages, API
          responses), surrogate keys enable targeted invalidation. You tag
          responses with logical identifiers (e.g.,{" "}
          <code>Surrogate-Key: product-123 category-shoes</code>), then purge
          by tag when data changes. This is supported by Fastly, Cloudflare
          (Cache Tags), and Varnish-based CDNs. A single product update can
          invalidate all pages that display that product by purging its tag.
        </p>

        <h4 className="mt-4 font-semibold">Stale-While-Revalidate</h4>
        <p>
          The <code>stale-while-revalidate</code> directive (supported by most
          CDNs and modern browsers) allows serving a stale cached response while
          asynchronously fetching a fresh one from the origin. This provides
          instant response times even when the cache has expired, at the cost of
          occasionally serving slightly outdated content. The pattern is
          invaluable for content where eventual consistency is acceptable (feed
          pages, product listings, dashboards).
        </p>

        <h3 className="mt-6 font-semibold">Multi-CDN Failover</h3>
        <p>
          Relying on a single CDN creates a single point of failure. Major
          outages (like the Fastly incident in June 2021 that took down Amazon,
          Reddit, and the UK government) demonstrate why multi-CDN strategies
          matter for high-availability applications.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/cdn-strategy-diagram-3.svg"
          alt="Multi-CDN failover architecture showing DNS-based routing, health checks, and fallback paths"
          caption="Figure 3: Multi-CDN failover with DNS-based traffic management, health monitoring, and automated failover"
        />
        <p>
          A multi-CDN setup typically uses a DNS traffic manager (AWS Route 53,
          NS1, Cedexis/Citrix ITM) that routes traffic based on latency,
          geography, or health check status. The traffic manager continuously
          monitors each CDN from multiple probe locations and automatically
          shifts traffic away from degraded CDNs. Common patterns include:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Active-Passive:</strong> 100% traffic to primary CDN,
            automatic failover to secondary on health check failure. Simpler
            but the secondary CDN has a cold cache on failover.
          </li>
          <li>
            <strong>Active-Active (Weighted):</strong> Split traffic (e.g.,
            80/20) across CDNs. Both caches stay warm, and failover just
            adjusts weights. Higher cost but lower recovery time.
          </li>
          <li>
            <strong>Performance-Based:</strong> Real User Monitoring (RUM) data
            drives routing decisions. Users are directed to whichever CDN
            provides the best performance for their specific location and
            network. Services like Cedexis/Citrix ITM specialize in this.
          </li>
        </ul>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Dimension
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Cloudflare
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Fastly
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  AWS CloudFront
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Akamai
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">PoP Count</td>
                <td className="px-4 py-2">300+</td>
                <td className="px-4 py-2">~90</td>
                <td className="px-4 py-2">450+</td>
                <td className="px-4 py-2">4,100+</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Purge Latency</td>
                <td className="px-4 py-2">~5s global</td>
                <td className="px-4 py-2">&lt;150ms global</td>
                <td className="px-4 py-2">~60s (invalidation)</td>
                <td className="px-4 py-2">~5s</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Edge Compute</td>
                <td className="px-4 py-2">Workers (V8 isolates)</td>
                <td className="px-4 py-2">Compute@Edge (Wasm)</td>
                <td className="px-4 py-2">Functions (limited)</td>
                <td className="px-4 py-2">EdgeWorkers (JS)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Cache Tags</td>
                <td className="px-4 py-2">Enterprise only</td>
                <td className="px-4 py-2">Yes (Surrogate-Key)</td>
                <td className="px-4 py-2">No (path-based only)</td>
                <td className="px-4 py-2">Yes</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">DDoS Protection</td>
                <td className="px-4 py-2">Included (all plans)</td>
                <td className="px-4 py-2">Basic included</td>
                <td className="px-4 py-2">Shield (extra cost)</td>
                <td className="px-4 py-2">Prolexic (premium)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Pricing Model</td>
                <td className="px-4 py-2">Flat (unmetered bandwidth)</td>
                <td className="px-4 py-2">Request + bandwidth</td>
                <td className="px-4 py-2">Request + bandwidth</td>
                <td className="px-4 py-2">Committed contracts</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Best For</td>
                <td className="px-4 py-2">Cost efficiency, security</td>
                <td className="px-4 py-2">Real-time purge, media</td>
                <td className="px-4 py-2">AWS ecosystem</td>
                <td className="px-4 py-2">Enterprise, media</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Push vs. Pull CDN Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Aspect
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Pull CDN
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Push CDN
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Content Upload</td>
                <td className="px-4 py-2">Automatic on first request</td>
                <td className="px-4 py-2">Manual/pipeline upload</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Cold Cache</td>
                <td className="px-4 py-2">First user gets slow response</td>
                <td className="px-4 py-2">Pre-warmed, always fast</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Storage Cost</td>
                <td className="px-4 py-2">Only popular content cached</td>
                <td className="px-4 py-2">All content stored (higher cost)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Use Case</td>
                <td className="px-4 py-2">Websites, APIs, general purpose</td>
                <td className="px-4 py-2">Video streaming, large media</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use content-hashed URLs for all static assets.</strong>{" "}
            Configure your bundler (Webpack, Vite) to include content hashes
            in filenames. Set <code>Cache-Control: public, max-age=31536000, immutable</code>{" "}
            on these assets. This achieves 100% cache hit rate for repeat
            visitors and eliminates invalidation complexity for static files.
          </li>
          <li>
            <strong>Separate CDN TTLs from browser TTLs.</strong> Use{" "}
            <code>s-maxage</code> or <code>Surrogate-Control</code> to give the
            CDN a longer TTL than the browser. This lets you purge the CDN edge
            while the browser still revalidates on its shorter schedule.
            Example: <code>s-maxage=3600, max-age=60</code>.
          </li>
          <li>
            <strong>Enable origin shield / tiered caching.</strong> This is the
            single most impactful CDN configuration for reducing origin load.
            Without a shield, N edge PoPs can send N simultaneous requests to
            origin on cache miss. With a shield, these coalesce to 1 request.
          </li>
          <li>
            <strong>Implement stale-while-revalidate for HTML pages.</strong>{" "}
            Dynamic pages (product pages, feeds, dashboards) benefit enormously
            from <code>stale-while-revalidate</code>. Users always get an
            instant response, and freshness converges quickly. Netflix uses
            this pattern extensively for their homepage.
          </li>
          <li>
            <strong>Normalize cache keys aggressively.</strong> Strip tracking
            query parameters (utm_source, fbclid, gclid) from cache keys at
            the edge. Normalize device detection into a small set of buckets
            (mobile/tablet/desktop) rather than using raw User-Agent. Each
            unnecessary cache key variation reduces your hit rate.
          </li>
          <li>
            <strong>Monitor cache hit ratio as a primary metric.</strong> Track
            cache hit ratio (CHR) at both edge and shield tiers. A healthy CDN
            for static assets should achieve 95%+ CHR. Set alerts on CHR drops,
            which can indicate misconfigured headers, increased cache key
            cardinality, or cache eviction pressure.
          </li>
          <li>
            <strong>Implement multi-CDN for critical applications.</strong> For
            applications requiring 99.99%+ availability, use at least two CDN
            providers with automated failover. Keep both caches warm with
            active-active traffic splitting (even an 95/5 split keeps the
            secondary warm enough for failover).
          </li>
          <li>
            <strong>Pre-warm caches after deploys.</strong> After deploying new
            content or purging caches, send synthetic requests from key
            geographic regions to warm the cache before real users hit it. This
            eliminates the &quot;cold cache penalty&quot; that can cause latency
            spikes post-deploy.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using Vary: User-Agent.</strong> This creates a separate
            cache entry for every unique User-Agent string. With thousands of
            browser/OS/device combinations, your cache hit rate drops to near
            zero. Instead, normalize to a custom header (e.g.,{" "}
            <code>X-Device-Type: mobile</code>) at the edge and vary on that.
          </li>
          <li>
            <strong>Setting Cache-Control: no-cache on static assets.</strong>{" "}
            This forces revalidation on every request, defeating the purpose of
            CDN caching. For hashed static assets, use immutable caching. For
            HTML, use short <code>s-maxage</code> with{" "}
            <code>stale-while-revalidate</code>.
          </li>
          <li>
            <strong>Ignoring Set-Cookie responses.</strong> Most CDNs will not
            cache responses that include <code>Set-Cookie</code> headers, or
            worse, will cache them and serve the same cookie to all users. Strip{" "}
            <code>Set-Cookie</code> at the CDN edge for cacheable responses, or
            mark them <code>private</code>.
          </li>
          <li>
            <strong>Not accounting for cache stampede.</strong> When a popular
            cached item expires, hundreds of simultaneous requests can hit your
            origin. Use origin shield (request coalescing), stale-while-revalidate,
            or request collapsing at the edge to mitigate this.
          </li>
          <li>
            <strong>Purging the entire cache instead of targeted invalidation.</strong>{" "}
            A full cache purge causes a massive spike in origin traffic as every
            edge PoP refetches every asset. Use surrogate keys, path-based
            purges, or versioned URLs for surgical invalidation. Reserve full
            purges for emergencies only.
          </li>
          <li>
            <strong>Not testing CDN behavior in staging.</strong> CDN
            configurations are notoriously hard to test because behavior depends
            on cache state, geography, and edge logic. Use tools like{" "}
            <code>curl -I</code> to inspect response headers, CDN-specific debug
            headers (e.g., <code>cf-cache-status</code>,{" "}
            <code>x-cache</code>), and synthetic monitoring from multiple
            regions.
          </li>
          <li>
            <strong>Caching personalized content at the edge.</strong> If your
            HTML contains user-specific content (name, cart count), caching it at
            the CDN serves one user&apos;s data to another. Use Edge Side Includes
            (ESI), client-side hydration, or edge compute to assemble
            personalized pages from cached fragments.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <h3 className="mt-4 font-semibold">Netflix: Open Connect</h3>
        <p>
          Netflix built its own CDN (Open Connect) specifically for video
          delivery. They place custom hardware appliances (Open Connect
          Appliances, or OCAs) directly inside ISP networks. During off-peak
          hours, content is pre-positioned (push model) to OCAs based on
          predicted demand. During peak hours, 95%+ of traffic is served from
          within the ISP network, never touching the internet backbone.
          Netflix&apos;s CDN strategy is a textbook example of push CDN at
          extreme scale, serving 15%+ of all downstream internet traffic
          globally.
        </p>

        <h3 className="mt-4 font-semibold">Cloudflare: Edge-First Architecture</h3>
        <p>
          Cloudflare pioneered the &quot;every PoP is a full node&quot; architecture where
          every edge location can handle any request type (caching, WAF, DDoS,
          Workers). This contrasts with tiered architectures where edge nodes
          are &quot;thin&quot; and defer to regional hubs. The benefit is lower latency
          (no inter-PoP hops for most requests), but requires each PoP to have
          significant compute and storage capacity.
        </p>

        <h3 className="mt-4 font-semibold">
          Shopify: Multi-CDN with Edge Rendering
        </h3>
        <p>
          Shopify uses a multi-CDN strategy (Cloudflare + Fastly) with edge
          rendering for storefront pages. Product pages are rendered at the
          edge using cached product data, with surrogate key-based invalidation
          when merchants update their catalogs. This achieves sub-100ms TTFB
          globally while supporting millions of unique storefronts. Their
          approach demonstrates how edge compute transforms CDN strategy from
          passive caching to active content assembly.
        </p>

        <h3 className="mt-4 font-semibold">
          GitHub: Conditional Request Optimization
        </h3>
        <p>
          GitHub&apos;s CDN strategy for raw file serving and release asset downloads
          uses aggressive conditional requests with <code>ETag</code> and{" "}
          <code>If-None-Match</code>. For Git objects and API responses, they
          generate strong ETags from content hashes, allowing the CDN to return
          304 Not Modified responses without contacting the origin. This pattern
          reduces origin bandwidth by 40%+ while ensuring users always get fresh
          content when it changes.
        </p>
      </section>

      {/* Section 8: Security at the CDN Edge */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Modern CDNs serve as the first line of defense for web applications.
          Key security capabilities to architect around include:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>DDoS Protection:</strong> CDNs absorb volumetric attacks by
            distributing traffic across hundreds of PoPs. Cloudflare has
            mitigated attacks exceeding 71 million requests per second. Ensure
            your origin is not directly accessible (restrict origin firewall to
            CDN IP ranges only).
          </li>
          <li>
            <strong>Web Application Firewall (WAF):</strong> CDN-integrated WAFs
            inspect requests at the edge before they reach your origin. Configure
            managed rulesets (OWASP Top 10) and custom rules for your
            application. WAF at the edge blocks malicious traffic without
            consuming origin resources.
          </li>
          <li>
            <strong>Signed URLs / Tokens:</strong> For premium or access-controlled
            content, use signed URLs with expiration timestamps. The CDN validates
            the signature at the edge, preventing unauthorized access without
            origin involvement. AWS CloudFront signed URLs and Cloudflare signed
            tokens are common implementations.
          </li>
          <li>
            <strong>Bot Management:</strong> Edge-based bot detection uses
            JavaScript challenges, browser fingerprinting, and behavioral
            analysis to distinguish legitimate users from automated scrapers
            and credential-stuffing bots. This protects both your content and
            your origin from abuse.
          </li>
          <li>
            <strong>TLS Termination:</strong> CDNs handle TLS handshakes at the
            edge, reducing latency (no round-trip to origin for the handshake)
            and offloading CPU-intensive cryptographic operations from your
            servers. Ensure you also encrypt the connection between CDN and origin
            (full strict TLS mode).
          </li>
        </ul>
      </section>

      {/* Section 9: Cost Optimization */}
      <section>
        <h2>Cost Optimization</h2>
        <p>
          CDN costs can escalate quickly, especially for high-traffic
          applications serving large media files. Key strategies:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Maximize cache hit ratio.</strong> Every cache miss costs
            egress bandwidth from your origin plus CDN-to-origin transfer. A 1%
            improvement in CHR from 95% to 96% reduces origin requests by 20%.
            Use longer TTLs, normalize cache keys, and enable origin shield.
          </li>
          <li>
            <strong>Compress at the edge.</strong> Enable Brotli and gzip
            compression at the CDN. Brotli provides 15-25% better compression
            than gzip for text assets, directly reducing bandwidth costs.
            Most CDNs can compress on-the-fly or cache pre-compressed variants.
          </li>
          <li>
            <strong>Use request collapsing.</strong> When multiple users request
            the same uncached resource simultaneously, the CDN should coalesce
            these into a single origin fetch. This prevents origin overload
            during cache warming and reduces bandwidth costs.
          </li>
          <li>
            <strong>Consider flat-rate CDNs for high-bandwidth use cases.</strong>{" "}
            Cloudflare&apos;s flat-rate pricing (unlimited bandwidth on paid plans)
            can be dramatically cheaper than per-GB CDNs for video-heavy or
            high-traffic applications. Model your costs across providers before
            committing.
          </li>
        </ul>
      </section>

      {/* Section 10: Edge Compute */}
      <section>
        <h2>CDN for Dynamic Content: Edge Compute</h2>
        <p>
          Edge compute transforms CDNs from passive caches into active
          application platforms. Key patterns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>A/B Testing at the Edge:</strong> Route users to different
            content variants at the CDN edge without origin involvement. Set a
            cookie on first visit to ensure consistent bucketing, and serve the
            appropriate variant from cache. This eliminates the performance
            penalty of server-side A/B testing.
          </li>
          <li>
            <strong>Edge Side Includes (ESI):</strong> Assemble pages from cached
            fragments at the edge. The page template and shared fragments are
            cached with long TTLs, while personalized fragments are fetched from
            the origin or computed at the edge. Akamai and Fastly support ESI
            natively.
          </li>
          <li>
            <strong>Authentication at the Edge:</strong> Validate JWTs and API
            keys at the CDN edge, rejecting unauthorized requests before they
            reach your origin. This reduces origin load and provides faster
            auth responses.
          </li>
          <li>
            <strong>Geolocation-Based Content:</strong> Serve location-specific
            content (pricing, language, legal disclaimers) based on the user&apos;s
            geographic location detected at the edge, without per-user origin
            requests.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How would you design a CDN cache invalidation strategy for an
              e-commerce site where product prices change frequently?
            </p>
            <p className="mt-2 text-sm text-muted">
              Use a two-layer approach: static assets (images, JS, CSS) use
              content-hashed URLs with immutable caching (never need
              invalidation). Product pages use surrogate keys tagged with the
              product ID and category. When a price changes, purge the product&apos;s
              surrogate key, which invalidates all pages displaying that product.
              Set <code>stale-while-revalidate</code> on product pages so users
              always get instant responses even during revalidation. For the
              price API, use short <code>s-maxage</code> (30-60s) with{" "}
              <code>stale-while-revalidate=300</code>. This ensures prices are
              eventually consistent (within ~60s) while maintaining fast
              response times.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Explain the difference between max-age, s-maxage, and
              Surrogate-Control. When would you use each?
            </p>
            <p className="mt-2 text-sm text-muted">
              <code>max-age</code> sets the TTL for all caches (browsers and
              CDNs). <code>s-maxage</code> overrides <code>max-age</code> for
              shared caches (CDNs) only - the browser still uses{" "}
              <code>max-age</code>. <code>Surrogate-Control</code> is a
              non-standard header understood by Varnish-based CDNs (Fastly) that
              is stripped before forwarding to the client, so it is completely
              invisible to browsers. Use <code>max-age</code> when browser and
              CDN TTLs should be the same. Use <code>s-maxage</code> when you
              want longer CDN caching but shorter browser caching (e.g.,{" "}
              <code>max-age=60, s-maxage=3600</code> - CDN caches for 1 hour,
              browser for 1 minute). Use <code>Surrogate-Control</code> when
              you need CDN-only directives that must not leak to the client.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Your CDN has a 90% cache hit ratio. How would you diagnose and
              improve it to 98%+?
            </p>
            <p className="mt-2 text-sm text-muted">
              First, analyze cache miss reasons using CDN analytics: (1) Check
              for high cache key cardinality - are query parameters like
              utm_source or session IDs creating unique cache keys? Strip
              non-functional parameters at the edge. (2) Check Vary header usage
              - <code>Vary: User-Agent</code> or <code>Vary: Cookie</code>{" "}
              fragment the cache drastically. Normalize to{" "}
              <code>Vary: Accept-Encoding</code> and custom device-type headers.
              (3) Analyze TTL distribution - short TTLs cause frequent
              revalidation. Increase TTLs where possible and add{" "}
              <code>stale-while-revalidate</code>. (4) Enable origin shield /
              tiered caching to consolidate misses. (5) Check for{" "}
              <code>Set-Cookie</code> responses that prevent caching. (6)
              Identify long-tail content that is requested too infrequently to
              stay in cache; consider pre-warming popular assets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How would you architect a multi-CDN strategy for a service
              requiring 99.99% uptime?
            </p>
            <p className="mt-2 text-sm text-muted">
              Use a DNS traffic manager (Route 53, NS1) with active health
              checks from multiple geographic regions. Run two CDN providers in
              active-active mode with weighted routing (e.g., 80/20 split) to
              keep both caches warm. Set DNS TTL to 30-60 seconds to enable fast
              failover. Health checks should verify HTTP 200 responses, TLS
              validity, and response latency from at least 3 probe locations.
              Implement automatic failover that shifts 100% traffic to the
              healthy CDN when the primary fails 3 consecutive checks. For the
              application layer, implement client-side failover using the{" "}
              <code>stale-if-error</code> directive and service worker fallbacks.
              The total recovery time objective (RTO) should be under 60 seconds
              (30s health check interval + 30s DNS TTL). Track availability
              independently from each CDN to validate the multi-CDN setup
              actually improves your aggregate uptime.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: When would you use edge compute (Cloudflare Workers, Fastly
              Compute@Edge) instead of origin-side logic?
            </p>
            <p className="mt-2 text-sm text-muted">
              Edge compute is ideal for: (1) Request routing and A/B testing -
              bucketing users and serving variants without origin round-trips.
              (2) Authentication/authorization - validating JWTs at the edge to
              reject unauthorized requests before they consume origin resources.
              (3) Content personalization - assembling pages from cached
              fragments with user-specific data injected at the edge. (4)
              Geolocation-based logic - serving region-specific content,
              redirects, or compliance headers. (5) API gateway functions -
              rate limiting, request transformation, header manipulation. Avoid
              edge compute for: complex business logic requiring database
              access, operations needing strong consistency, or compute-heavy
              tasks (edge workers have CPU time limits, typically 10-50ms). The
              key principle is: use edge compute for stateless, latency-sensitive
              operations that benefit from geographic proximity to users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: A deployment caused a cache stampede that overwhelmed your
              origin. How do you prevent this in the future?
            </p>
            <p className="mt-2 text-sm text-muted">
              Implement multiple layers of protection: (1) Enable origin shield
              to coalesce simultaneous cache misses from all edge PoPs into a
              single origin fetch. (2) Use{" "}
              <code>stale-while-revalidate</code> so expired content is served
              while the cache is refreshed asynchronously, preventing a flood of
              synchronous origin requests. (3) Implement request collapsing at
              the edge so concurrent requests for the same URL share a single
              origin fetch. (4) Add a cache warming step to your deployment
              pipeline that pre-populates critical cache entries from key
              geographic regions before cutover. (5) For critical deployments,
              use a gradual rollout strategy (canary deploys) rather than
              purging all caches simultaneously. (6) Configure origin rate
              limiting at the CDN to cap the maximum number of origin requests
              per second, queuing excess requests.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-1">
          <li>
            <a
              href="https://web.dev/articles/content-delivery-networks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              web.dev - Content Delivery Networks
            </a>
          </li>
          <li>
            <a
              href="https://developers.cloudflare.com/cache/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Cloudflare Cache Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.fastly.com/en/guides/working-with-surrogate-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Fastly - Working with Surrogate Keys
            </a>
          </li>
          <li>
            <a
              href="https://openconnect.netflix.com/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Netflix Open Connect CDN
            </a>
          </li>
          <li>
            <a
              href="https://httpwg.org/specs/rfc9111.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              RFC 9111 - HTTP Caching
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              MDN - Cache-Control Header
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
