"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cdn-caching-concise",
  title: "CDN Caching",
  description: "Comprehensive guide to CDN caching covering edge caching, cache invalidation, cache keys, Vary header, and strategies for global content delivery.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "cdn-caching",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "CDN", "edge", "Vary header", "cache invalidation"],
  relatedTopics: ["browser-caching", "cache-invalidation-strategies", "stale-while-revalidate"],
};

export default function CdnCachingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          A <strong>Content Delivery Network (CDN)</strong> is a geographically distributed network of proxy servers
          and data centers that cache content at <strong>edge locations</strong> (also called Points of Presence, or PoPs)
          close to end users. CDN caching is the mechanism by which these edge servers store copies of origin server
          responses and serve them directly to nearby users, eliminating round-trips to the origin and dramatically
          reducing latency.
        </p>
        <p>
          The concept emerged in the late 1990s when Akamai Technologies (founded 1998) pioneered the first commercial
          CDN to solve the "flash crowd" problem, where sudden traffic spikes would overwhelm origin servers. Today,
          CDNs like Cloudflare, Fastly, AWS CloudFront, and Vercel Edge Network handle a significant portion of all
          internet traffic, with Cloudflare alone reporting that they serve over 20% of all websites.
        </p>
        <p>
          At the infrastructure level, a CDN operates through several key components:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Edge PoPs:</strong> Servers deployed in data centers across dozens or hundreds of cities worldwide.
            Each PoP contains cache storage and routing logic. A major CDN like Cloudflare operates 300+ PoPs; AWS
            CloudFront has 450+ edge locations.
          </li>
          <li>
            <strong>Origin Shield:</strong> An intermediate caching layer between edge PoPs and the origin server.
            When multiple edge PoPs experience cache misses simultaneously, the origin shield consolidates these
            requests into a single origin fetch, preventing thundering herd problems. Fastly calls this "shielding,"
            CloudFront calls it "Origin Shield," and Cloudflare offers "Tiered Caching."
          </li>
          <li>
            <strong>Anycast Routing:</strong> Most CDNs use anycast DNS to route users to the nearest PoP based on
            network topology (not just geographic distance). This means a user in Tokyo hits the Tokyo PoP, while a
            user in London hits the London PoP, all using the same IP address.
          </li>
          <li>
            <strong>Origin Server:</strong> Your actual application server (or object storage like S3) that generates
            the canonical response. The CDN only contacts the origin on cache misses or revalidation.
          </li>
        </ul>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <h3 className="mt-4 font-semibold">Cache Keys</h3>
        <p>
          A cache key is the unique identifier the CDN uses to store and look up cached responses. By default, most
          CDNs use the full request URL (scheme + host + path + query string) as the cache key. However, this can be
          customized extensively:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Default cache key components
// https://example.com/api/products?page=2&sort=price
// Key: scheme + host + path + query string

// Cloudflare custom cache key (via Page Rules or Cache Rules)
// Include specific headers, cookies, or query params
// Exclude: utm_source, utm_medium (marketing params)

// Cache-Control header from origin
Cache-Control: public, s-maxage=3600, max-age=300
// s-maxage=3600 → CDN caches for 1 hour
// max-age=300  → Browser caches for 5 minutes

// Separate CDN vs browser TTL
Surrogate-Control: max-age=86400
Cache-Control: max-age=60
// CDN sees Surrogate-Control: caches 24 hours
// Browser only sees Cache-Control: caches 60 seconds
// CDN strips Surrogate-Control before forwarding`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">The Vary Header</h3>
        <p>
          The <code>Vary</code> header tells the CDN to store separate cached copies based on specific request headers.
          This is critical for serving different content to different clients from the same URL:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Vary on Accept-Encoding: separate cache for gzip vs brotli
Vary: Accept-Encoding

// Vary on Accept: different format (JSON vs HTML)
Vary: Accept

// DANGER: Vary on User-Agent or Cookie
// Creates thousands of cache variants → cache explosion
// HIT rate drops to near zero
Vary: User-Agent  // DON'T DO THIS

// Instead, normalize at the edge
// Cloudflare Workers example: reduce User-Agent to device class
addEventListener('fetch', event =&gt; {
  const request = event.request;
  const url = new URL(request.url);

  // Normalize to device class instead of full User-Agent
  const isMobile = request.headers.get('CF-Device-Type') === 'mobile';
  url.searchParams.set('device', isMobile ? 'mobile' : 'desktop');

  event.respondWith(fetch(url.toString(), {
    cf: { cacheKey: url.toString() }
  }));
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Surrogate Keys & Cache Tags</h3>
        <p>
          Surrogate keys (Fastly's term) or cache tags (Cloudflare's term) allow you to associate cached resources
          with logical labels for targeted invalidation. Instead of purging by URL, you purge by semantic meaning:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Origin response headers
Surrogate-Key: product-123 category-electronics homepage-featured
// or Cloudflare equivalent
Cache-Tag: product-123, category-electronics, homepage-featured

// When product 123's price changes, purge everything tagged with it:
// Fastly API
curl -X POST "https://api.fastly.com/service/{id}/purge/product-123" \\
  -H "Fastly-Key: {token}"

// This purges:
// - /products/123 (product detail page)
// - /category/electronics (listing page showing this product)
// - /homepage (featured products section)
// All with a single API call, without knowing every URL`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Edge Compute</h3>
        <p>
          Modern CDNs go beyond simple caching by offering compute at the edge. Cloudflare Workers, Vercel Edge
          Functions, and Fastly Compute run your code at edge PoPs, enabling dynamic responses without origin
          round-trips. This blurs the line between "CDN" and "application server":
        </p>
        <ul className="space-y-2">
          <li>
            <strong>A/B testing at the edge:</strong> Route users to variants without origin involvement.
          </li>
          <li>
            <strong>Authentication/authorization:</strong> Validate JWTs at the edge before forwarding to origin.
          </li>
          <li>
            <strong>Personalization:</strong> Inject user-specific content into cached HTML templates using
            HTMLRewriter (Cloudflare) or Edge Middleware (Vercel).
          </li>
          <li>
            <strong>API response composition:</strong> Aggregate multiple origin responses at the edge into a
            single client response.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">Cache Hierarchies (L1/L2)</h3>
        <p>
          Enterprise CDNs use tiered caching to maximize hit rates. A typical hierarchy has two levels:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>L1 (Edge PoP):</strong> The server closest to the user. Handles most requests. Limited storage
            per PoP means less popular content may be evicted.
          </li>
          <li>
            <strong>L2 (Regional/Shield):</strong> A larger, regional cache shared by multiple L1 PoPs. When L1
            misses, it checks L2 before going to origin. This dramatically reduces origin load because only one L2
            request is made instead of N separate L1-to-origin requests.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Understanding the full request flow through a CDN is essential for debugging cache behavior and optimizing
          hit rates. The following diagram illustrates the global architecture of a CDN with origin shielding:
        </p>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/cdn-architecture.svg"
          alt="CDN global architecture showing origin server, origin shield, and edge PoPs serving users worldwide"
          caption="Figure 1: Global CDN architecture with origin shield and geographically distributed edge PoPs"
        />

        <p>
          When a user makes a request, the CDN processes it through a well-defined flow with multiple caching layers.
          Each layer provides an opportunity for a cache hit, reducing the total latency:
        </p>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/cdn-cache-flow.svg"
          alt="CDN request flow showing DNS resolution, edge cache lookup, origin shield, and origin server"
          caption="Figure 2: Detailed request flow through CDN layers from client to origin and back"
        />

        <p>
          The flow works as follows:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>DNS Resolution:</strong> The user's browser resolves the domain. Anycast DNS returns the IP
            of the nearest edge PoP (typically {'&lt;'}5ms).
          </li>
          <li>
            <strong>Edge Cache Lookup:</strong> The edge PoP checks its local cache using the cache key. On a
            <strong> cache hit</strong>, the response is returned immediately (1-5ms). The response
            includes <code>x-cache: HIT</code> or <code>cf-cache-status: HIT</code>.
          </li>
          <li>
            <strong>Origin Shield (L2):</strong> On a cache miss, the edge PoP forwards the request to the origin
            shield. If the shield has a cached copy, it returns it to the edge (which caches it locally). This
            adds 10-30ms but prevents origin contact.
          </li>
          <li>
            <strong>Origin Fetch:</strong> If the shield also misses, the request goes to the origin server. The
            origin processes the request and returns a response with appropriate <code>Cache-Control</code> headers.
            The response is cached at both the shield and the edge PoP on the way back.
          </li>
          <li>
            <strong>Stale-While-Revalidate:</strong> Some CDNs support serving stale content while asynchronously
            revalidating with the origin. This ensures users always get a fast response while the cache is refreshed
            in the background.
          </li>
        </ol>
      </section>

      {/* Section 4: Implementation Examples */}
      <section>
        <h2>Implementation Examples</h2>

        <h3 className="mt-4 font-semibold">Next.js with Vercel Edge Caching</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// app/api/products/route.ts
// Vercel automatically caches at edge when you set these headers

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const products = await fetchProductsFromDB();

  return NextResponse.json(products, {
    headers: {
      // CDN caches for 60 seconds, browser for 0 seconds
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      // Tag for granular invalidation
      'Cache-Tag': 'products, homepage',
    },
  });
}

// On-demand revalidation when data changes
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { tag } = await request.json();
  // Purge all cached responses tagged with this value
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true });
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Cloudflare Workers: Cache API</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cloudflare Worker with custom caching logic
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // Check edge cache first
    let response = await cache.match(cacheKey);

    if (!response) {
      // Cache miss - fetch from origin
      response = await fetch(request);

      // Only cache successful responses
      if (response.ok) {
        response = new Response(response.body, response);
        response.headers.set('Cache-Control', 'public, s-maxage=3600');

        // Store in edge cache (non-blocking)
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    return response;
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">AWS CloudFront with Custom Cache Policy</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// CDK: Define a CloudFront distribution with custom cache behavior
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const cachePolicy = new cloudfront.CachePolicy(this, 'ApiCachePolicy', {
  cachePolicyName: 'api-cache-policy',
  defaultTtl: Duration.minutes(5),
  maxTtl: Duration.hours(24),
  minTtl: Duration.seconds(0),
  // Include these in the cache key
  queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList(
    'page', 'limit', 'sort'  // Only these query params affect caching
  ),
  headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
    'Accept', 'Accept-Encoding'  // Vary by content negotiation
  ),
  cookieBehavior: cloudfront.CacheCookieBehavior.none(),
  enableAcceptEncodingGzip: true,
  enableAcceptEncodingBrotli: true,
});

const distribution = new cloudfront.Distribution(this, 'CDN', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('api.example.com'),
    cachePolicy,
    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Static Asset Fingerprinting</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// next.config.js — content-hashed filenames for immutable caching
// Next.js does this automatically for JS/CSS chunks:
// /_next/static/chunks/app-layout-abc123.js

// For custom static assets, use a build step:
// styles.css → styles.a1b2c3d4.css

// Set headers for fingerprinted assets
// Vercel: vercel.json
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=60, stale-while-revalidate=600"
        }
      ]
    }
  ]
}`}</code>
        </pre>
      </section>

      {/* Section 5: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          The CDN landscape offers different trade-offs depending on your needs. Here is a comparison of the
          major CDN providers across key dimensions that matter for frontend engineers:
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left font-semibold">Cloudflare</th>
                <th className="px-4 py-3 text-left font-semibold">Fastly</th>
                <th className="px-4 py-3 text-left font-semibold">AWS CloudFront</th>
                <th className="px-4 py-3 text-left font-semibold">Vercel Edge</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Invalidation Speed</td>
                <td className="px-4 py-3">~30 seconds global</td>
                <td className="px-4 py-3">~150ms (instant purge)</td>
                <td className="px-4 py-3">1-2 minutes</td>
                <td className="px-4 py-3">~300ms (ISR-based)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Programmability</td>
                <td className="px-4 py-3">Workers (V8 isolates, full JS/TS)</td>
                <td className="px-4 py-3">Compute (Wasm), VCL config</td>
                <td className="px-4 py-3">Lambda@Edge, CloudFront Functions</td>
                <td className="px-4 py-3">Edge Functions (V8, limited runtime)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Pricing Model</td>
                <td className="px-4 py-3">Generous free tier, flat pricing</td>
                <td className="px-4 py-3">Usage-based, higher per-request cost</td>
                <td className="px-4 py-3">Pay-per-request + data transfer</td>
                <td className="px-4 py-3">Included in hosting plans</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Edge Compute</td>
                <td className="px-4 py-3">Workers, Durable Objects, R2, KV</td>
                <td className="px-4 py-3">Compute@Edge (Wasm), KV Store</td>
                <td className="px-4 py-3">Lambda@Edge (Node.js/Python), CF Functions (JS)</td>
                <td className="px-4 py-3">Edge Functions, Edge Config, KV</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Cache Tags / Surrogate Keys</td>
                <td className="px-4 py-3">Cache Tags (Enterprise)</td>
                <td className="px-4 py-3">Surrogate Keys (all tiers)</td>
                <td className="px-4 py-3">Not natively supported</td>
                <td className="px-4 py-3">Cache Tags via revalidateTag()</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">PoP Count</td>
                <td className="px-4 py-3">300+ cities</td>
                <td className="px-4 py-3">~90 PoPs</td>
                <td className="px-4 py-3">450+ edge locations</td>
                <td className="px-4 py-3">~100 edge locations (via AWS)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-3 font-medium">Best For</td>
                <td className="px-4 py-3">General purpose, security, DDoS</td>
                <td className="px-4 py-3">Real-time purging, media streaming</td>
                <td className="px-4 py-3">AWS ecosystem integration</td>
                <td className="px-4 py-3">Next.js apps, JAMstack</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          <strong>Key trade-off:</strong> Invalidation speed vs. cost. Fastly's instant purge (~150ms global
          propagation) is unmatched but comes at a premium. CloudFront is cheaper but invalidation takes minutes.
          For most frontend applications, Cloudflare or Vercel offer the best balance of developer experience,
          performance, and cost.
        </p>
      </section>

      {/* Section 6: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use content-hashed filenames for static assets:</strong> Name files
            like <code>app.a1b2c3.js</code> and set <code>Cache-Control: public, max-age=31536000, immutable</code>.
            The hash changes when content changes, so you never need to invalidate. This is the single most
            effective CDN caching strategy.
          </li>
          <li>
            <strong>Separate CDN and browser TTLs:</strong> Use <code>s-maxage</code> for the CDN
            and <code>max-age</code> for the browser. CDN caches can be purged instantly; browser caches cannot.
            Keep browser TTLs short (60-300s) for mutable content while allowing the CDN to cache for hours.
          </li>
          <li>
            <strong>Enable origin shielding:</strong> Reduce origin load by consolidating cache misses through
            a shield layer. This is especially important during cache warming (after a full purge or deployment)
            when every PoP would otherwise hit the origin simultaneously.
          </li>
          <li>
            <strong>Implement stale-while-revalidate:</strong> Add <code>stale-while-revalidate</code> to your
            Cache-Control headers. Users get instant responses from stale cache while the CDN fetches fresh content
            in the background. This eliminates the latency penalty of cache expiration.
          </li>
          <li>
            <strong>Use cache tags for surgical invalidation:</strong> Tag responses with semantic labels
            (product IDs, category names) and purge by tag when data changes. This is far more precise than
            purging by URL pattern and avoids the over-purging problem.
          </li>
          <li>
            <strong>Minimize Vary header values:</strong> Only include headers that actually affect the response.
            Never <code>Vary: User-Agent</code> or <code>Vary: Cookie</code> as these create thousands of variants.
            Normalize request attributes at the edge into a small set of cache key components.
          </li>
          <li>
            <strong>Monitor cache hit ratios:</strong> Track your CDN's cache hit ratio (aim for 90%+). Use
            CDN analytics to identify URLs with low hit rates and investigate whether cache keys are too specific,
            TTLs too short, or Vary headers too broad.
          </li>
          <li>
            <strong>Strip unnecessary query parameters:</strong> Marketing parameters like <code>utm_source</code>,
            <code>utm_medium</code>, and <code>fbclid</code> create unique cache keys for identical content. Configure
            your CDN to strip or ignore these parameters in the cache key.
          </li>
        </ul>
      </section>

      {/* Section 7: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <ArticleImage
          src="/diagrams/frontend/caching-strategies/cdn-invalidation.svg"
          alt="CDN cache invalidation methods showing purge by URL, purge by tag, purge all, and TTL expiration"
          caption="Figure 3: Cache invalidation strategies and their propagation across edge nodes"
        />

        <ul className="space-y-3">
          <li>
            <strong>Caching responses with Set-Cookie headers:</strong> If your origin sets cookies (session IDs,
            analytics), the CDN may cache that response and serve the same cookie to every user. Most CDNs
            bypass cache for responses with <code>Set-Cookie</code>, but if you're using custom cache logic,
            strip these headers before caching. This is a security vulnerability, not just a performance issue.
          </li>
          <li>
            <strong>Cache key explosion from Vary:</strong> Using <code>Vary: User-Agent</code> creates a separate
            cache entry for every unique User-Agent string (thousands of variations). Your cache hit rate drops to
            near zero. Instead, normalize to device classes (mobile, tablet, desktop) at the edge.
          </li>
          <li>
            <strong>Forgetting about browser cache after CDN purge:</strong> Purging the CDN cache doesn't purge
            users' browser caches. If you set <code>max-age=3600</code>, users may still see stale content for up
            to an hour after you purge the CDN. Use short <code>max-age</code> values for mutable content and rely
            on <code>s-maxage</code> for CDN-level caching.
          </li>
          <li>
            <strong>Thundering herd on cache expiration:</strong> When a popular resource's TTL expires, all edge
            PoPs simultaneously fetch from origin. Use <code>stale-while-revalidate</code> to serve stale content
            while refreshing, or enable request coalescing (Fastly calls this "request collapsing") to
            deduplicate concurrent origin fetches.
          </li>
          <li>
            <strong>Not accounting for cache warming after deployments:</strong> After a deployment that changes
            URLs or purges caches, your origin will see a traffic spike as all edge PoPs refill their caches. Plan
            for this: enable origin shielding, pre-warm popular URLs, and ensure your origin can handle
            the burst load.
          </li>
          <li>
            <strong>Caching error responses:</strong> A 500 error from your origin can get cached at the edge,
            causing all users to see the error for the TTL duration. Only cache 2xx responses. Most CDNs have
            "negative TTL" settings to control how long errors are cached (set to 0 or very short).
          </li>
          <li>
            <strong>Over-relying on purge-all:</strong> Purging your entire CDN cache is the nuclear option. It
            causes a thundering herd, spikes origin load, and temporarily degrades performance for all users.
            Use granular invalidation (by URL, tag, or prefix) whenever possible.
          </li>
        </ul>
      </section>

      {/* Section 8: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-4 font-semibold">Static Sites & JAMstack</h3>
        <p>
          Static sites are the ideal CDN caching scenario. Every page is pre-built at deploy time, so the entire
          site can be served from edge with <code>immutable</code> caching. Frameworks like Next.js (with static
          export), Astro, and Gatsby generate content-hashed assets that never need invalidation. Deploy-time
          atomic cache swaps ensure users always see a consistent version of the site.
        </p>

        <h3 className="mt-6 font-semibold">API Caching at the Edge</h3>
        <p>
          For read-heavy APIs (product catalogs, search results, public data), caching API responses at the edge
          can reduce origin load by 90%+ and cut P99 latency from 500ms to {'&lt;'}10ms. The key is identifying
          which endpoints are cacheable and setting appropriate TTLs. Use <code>s-maxage=60,
          stale-while-revalidate=600</code> for data that changes infrequently, and <code>s-maxage=0</code> with
          <code>stale-while-revalidate=60</code> for near-real-time data that should still benefit from edge
          serving during revalidation.
        </p>

        <h3 className="mt-6 font-semibold">Personalization Challenges</h3>
        <p>
          Personalized content is the enemy of CDN caching because each user sees different data. Strategies to
          work around this include: serving a cached "shell" (header, footer, layout) from the edge and loading
          personalized content via client-side JavaScript; using Edge Compute to inject personalized fragments into
          cached templates (Cloudflare HTMLRewriter, Vercel Edge Middleware); or segmenting users into a small
          number of cohorts (free/premium, region, language) and caching per-cohort rather than per-user.
        </p>

        <h3 className="mt-6 font-semibold">A/B Testing at the Edge</h3>
        <p>
          CDN edge compute enables A/B testing without client-side JavaScript or origin involvement. The edge
          assigns users to variants (typically via a cookie), and serves the corresponding cached version. This
          avoids the flash-of-original-content (FOOC) problem that client-side A/B testing creates, and reduces
          origin load since both variants are cached separately at the edge.
        </p>

        <div className="mt-6 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
          <h4 className="font-semibold text-orange-800 dark:text-orange-300">When NOT to Use CDN Caching</h4>
          <ul className="mt-2 space-y-1 text-orange-900 dark:text-orange-200">
            <li>
              <strong>Authenticated/per-user data:</strong> Session-specific responses (dashboard, inbox) should
              bypass CDN cache entirely. Set <code>Cache-Control: private, no-store</code>.
            </li>
            <li>
              <strong>Real-time data:</strong> WebSocket connections, live scores, or stock prices that change
              sub-second are not suitable for CDN caching.
            </li>
            <li>
              <strong>Write operations:</strong> POST, PUT, DELETE requests should never be cached. Most CDNs
              only cache GET and HEAD by default.
            </li>
            <li>
              <strong>Regulatory/compliance constraints:</strong> GDPR, HIPAA, or PCI data may have restrictions
              on where it can be stored. Caching at edge PoPs across jurisdictions may violate these requirements.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" className="text-purple-600 underline dark:text-purple-400" target="_blank" rel="noopener noreferrer">
              MDN: HTTP Caching
            </a>
            {" "} &mdash; Comprehensive guide to HTTP cache headers and semantics.
          </li>
          <li>
            <a href="https://developers.cloudflare.com/cache/" className="text-purple-600 underline dark:text-purple-400" target="_blank" rel="noopener noreferrer">
              Cloudflare Cache Documentation
            </a>
            {" "} &mdash; Cache rules, cache keys, tiered caching, and Workers cache API.
          </li>
          <li>
            <a href="https://docs.fastly.com/en/guides/purging" className="text-purple-600 underline dark:text-purple-400" target="_blank" rel="noopener noreferrer">
              Fastly Purging Documentation
            </a>
            {" "} &mdash; Surrogate keys, instant purge, and soft purge strategies.
          </li>
          <li>
            <a href="https://web.dev/articles/love-your-cache" className="text-purple-600 underline dark:text-purple-400" target="_blank" rel="noopener noreferrer">
              web.dev: Love Your Cache
            </a>
            {" "} &mdash; Google's guide to modern caching strategies for web apps.
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9111" className="text-purple-600 underline dark:text-purple-400" target="_blank" rel="noopener noreferrer">
              RFC 9111: HTTP Caching
            </a>
            {" "} &mdash; The HTTP caching specification (updated from RFC 7234).
          </li>
        </ul>
      </section>

      {/* Section 10: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <h3 className="font-semibold">Q: How would you design a CDN caching strategy for a high-traffic e-commerce site where product pages need to show up-to-date pricing?</h3>
            <div className="mt-3 space-y-2">
              <p>
                <strong>A:</strong> The key insight is separating cacheable from non-cacheable content. Product page
                layouts, images, and descriptions rarely change and can be cached aggressively
                with <code>s-maxage=3600</code>. For pricing, I would use one of two approaches:
              </p>
              <p>
                <strong>Approach 1 (Stale-While-Revalidate):</strong> Cache the full page
                with <code>s-maxage=60, stale-while-revalidate=3600</code>. Prices are at most 60 seconds stale, and
                users always get instant responses. When a price changes, use cache tags (<code>product-123</code>) to
                purge instantly via Fastly's surrogate keys or Cloudflare cache tags.
              </p>
              <p>
                <strong>Approach 2 (Edge Compute):</strong> Cache the product page shell at the edge and inject the
                current price at the edge using a Worker/Edge Function that fetches the price from a fast key-value
                store (Cloudflare KV, Vercel Edge Config). The shell has a long TTL; the price lookup adds ~5ms.
              </p>
              <p>
                Both approaches keep P99 latency under 50ms while ensuring prices are current within seconds.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <h3 className="font-semibold">Q: What is the difference between s-maxage and max-age, and why does it matter for CDN caching?</h3>
            <div className="mt-3 space-y-2">
              <p>
                <strong>A:</strong> <code>max-age</code> applies to all caches (browser and CDN),
                while <code>s-maxage</code> applies only to shared/proxy caches (CDN) and
                overrides <code>max-age</code> at that layer. This distinction is critical because browser caches
                cannot be remotely purged, but CDN caches can.
              </p>
              <p>
                In practice, you want the CDN to cache aggressively (high <code>s-maxage</code>) because you can purge
                it instantly when content changes. But you want the browser to cache conservatively
                (low <code>max-age</code>) because once content is in a user's browser cache, you have no way to
                invalidate it until the TTL expires.
              </p>
              <p>
                Example: <code>Cache-Control: public, s-maxage=86400, max-age=60</code> means the CDN caches for 24
                hours (and you can purge it anytime), while each user's browser only caches for 60 seconds.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <h3 className="font-semibold">Q: You deploy a bug fix but users are still seeing the old version. Walk through your debugging process.</h3>
            <div className="mt-3 space-y-2">
              <p>
                <strong>A:</strong> I would systematically check each caching layer:
              </p>
              <p>
                <strong>1. Browser cache:</strong> Open DevTools, check the Network tab. If the response
                shows <code>(from disk cache)</code>, the browser is serving a cached copy. Hard refresh (Ctrl+Shift+R)
                to bypass. Check the <code>max-age</code> or <code>Expires</code> header on the original response to
                understand why the browser cached it.
              </p>
              <p>
                <strong>2. CDN cache:</strong> Check the CDN-specific cache status header
                (<code>cf-cache-status</code> for Cloudflare, <code>x-cache</code> for CloudFront,
                <code>x-served-by</code> for Fastly). If it says HIT, the CDN is serving stale content. Purge the
                specific URL or tag via the CDN's API or dashboard.
              </p>
              <p>
                <strong>3. Origin shield:</strong> Even after edge purge, the shield may still have a cached copy. Some
                CDNs require purging both layers. Check if the CDN propagation has completed (Cloudflare takes ~30s,
                CloudFront takes 1-2 minutes).
              </p>
              <p>
                <strong>4. Build artifact:</strong> Verify that the deployment actually succeeded and the new code is
                being served by the origin. Curl the origin directly (bypassing CDN) to confirm.
              </p>
              <p>
                <strong>Prevention:</strong> Use content-hashed filenames for static assets so new deploys create new
                URLs that bypass all caching entirely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
