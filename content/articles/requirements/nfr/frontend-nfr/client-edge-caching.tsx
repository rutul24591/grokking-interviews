"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-client-edge-caching",
  title: "Client & Edge Caching",
  description: "Comprehensive guide to caching strategies at the client and edge layers. Covers browser cache, CDN, edge computing, cache invalidation patterns, and Cache-Control directives.",
  category: "frontend",
  subcategory: "nfr",
  slug: "client-edge-caching",
  version: "extensive",
  wordCount: 14000,
  readingTime: 56,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "caching", "cdn", "edge", "performance", "cache-control"],
  relatedTopics: ["page-load-performance", "offline-support", "network-efficiency"],
};

export default function ClientEdgeCachingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Client Caching</strong> stores resources in the user&apos;s browser to reduce network requests.
          <strong>Edge Caching</strong> stores resources at CDN edge locations close to users to reduce latency.
          Together, they form the first line of defense against performance issues.
        </p>
        <p>
          Caching at these layers is critical because:
        </p>
        <ul>
          <li><strong>Client cache:</strong> Zero network requests for cached resources</li>
          <li><strong>Edge cache:</strong> Reduced latency (50-200ms vs 500ms+ to origin)</li>
          <li><strong>Combined:</strong> 80-90% of requests never reach origin server</li>
        </ul>
        <p>
          For staff engineers, caching decisions affect infrastructure costs, origin load, and user experience.
          This guide covers the full caching stack from browser to edge.
        </p>
      </section>

      <section>
        <h2>Browser Caching Layers</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/browser-cache-layers.svg"
          alt="Browser Cache Layers"
          caption="Browser caching hierarchy — memory cache, disk cache, service worker cache, and IndexedDB"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Memory Cache</h3>
        <p>
          Fastest cache, stored in RAM. Cleared when tab closes. Used for:
        </p>
        <ul>
          <li>Recently loaded images</li>
          <li>CSS/JS for current page</li>
          <li>Back/forward navigation cache (bfcache)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Disk Cache</h3>
        <p>
          HTTP cache stored on disk. Persists across sessions. Controlled by:
        </p>
        <ul>
          <li><code>Cache-Control</code> headers</li>
          <li><code>ETag</code> for validation</li>
          <li><code>Last-Modified</code> for conditional requests</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Worker Cache</h3>
        <p>
          Programmable cache via Cache API. Full control over storage and retrieval.
        </p>
      </section>

      <section>
        <h2>HTTP Cache Headers</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Header</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>Cache-Control</code></td>
              <td className="p-3">Primary caching directive</td>
              <td className="p-3"><code>max-age=31536000, immutable</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>ETag</code></td>
              <td className="p-3">Resource fingerprint</td>
              <td className="p-3"><code>&quot;abc123&quot;</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>Last-Modified</code></td>
              <td className="p-3">Last change timestamp</td>
              <td className="p-3"><code>Wed, 15 Mar 2026 12:00:00 GMT</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>Vary</code></td>
              <td className="p-3">Cache key variations</td>
              <td className="p-3"><code>Accept-Encoding, Accept</code></td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache-Control Directive Matrix</h3>
        <p>
          The <code>Cache-Control</code> header accepts multiple directives that can be combined to express
          precise caching intentions. Understanding each directive is critical for staff engineers.
        </p>

        <h4 className="mt-6 mb-3 font-semibold">Freshness Directives</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Directive</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>max-age=N</code></td>
              <td className="p-3">Fresh for N seconds from response Date</td>
              <td className="p-3">All cacheable resources</td>
              <td className="p-3"><code>max-age=3600</code> (1 hour)</td>
            </tr>
            <tr>
              <td className="p-3"><code>s-maxage=N</code></td>
              <td className="p-3">Like max-age but for shared caches (CDN) only</td>
              <td className="p-3">Override browser cache for CDN</td>
              <td className="p-3"><code>max-age=60, s-maxage=3600</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>Expires</code></td>
              <td className="p-3">Absolute date/time (legacy, HTTP/1.0)</td>
              <td className="p-3">Legacy support</td>
              <td className="p-3"><code>Expires: Thu, 01 Dec 2026 16:00:00 GMT</code></td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-6 mb-3 font-semibold">Validation Directives</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Directive</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>no-cache</code></td>
              <td className="p-3">Cache but revalidate before every use</td>
              <td className="p-3">HTML pages, dynamic content</td>
              <td className="p-3"><code>no-cache</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>must-revalidate</code></td>
              <td className="p-3">Must revalidate when stale (no serving stale)</td>
              <td className="p-3">Data integrity critical</td>
              <td className="p-3"><code>max-age=300, must-revalidate</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>proxy-revalidate</code></td>
              <td className="p-3">Like must-revalidate but for shared caches only</td>
              <td className="p-3">CDN revalidation</td>
              <td className="p-3"><code>max-age=60, proxy-revalidate</code></td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-6 mb-3 font-semibold">Storage Directives</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Directive</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>public</code></td>
              <td className="p-3">Can be stored by any cache (including shared)</td>
              <td className="p-3">Public resources, allows caching auth responses</td>
              <td className="p-3"><code>public, max-age=3600</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>private</code></td>
              <td className="p-3">Only browser cache, not shared caches</td>
              <td className="p-3">User-specific content</td>
              <td className="p-3"><code>private, max-age=300</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>no-store</code></td>
              <td className="p-3">Do NOT store in any cache</td>
              <td className="p-3">Sensitive data, tokens, PII</td>
              <td className="p-3"><code>no-store</code></td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-6 mb-3 font-semibold">Advanced Directives</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Directive</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>immutable</code></td>
              <td className="p-3">Resource won&apos;t change; don&apos;t revalidate even on reload</td>
              <td className="p-3">Content-hashed static assets</td>
              <td className="p-3"><code>max-age=31536000, immutable</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>stale-while-revalidate=N</code></td>
              <td className="p-3">Serve stale for N seconds while revalidating in background</td>
              <td className="p-3">Balance freshness + performance</td>
              <td className="p-3"><code>max-age=60, stale-while-revalidate=30</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>stale-if-error=N</code></td>
              <td className="p-3">Serve stale if revalidation fails (5xx error)</td>
              <td className="p-3">Resilience during outages</td>
              <td className="p-3"><code>max-age=300, stale-if-error=86400</code></td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-6 mb-3 font-semibold">Common Production Patterns</h4>
        <ul className="space-y-2">
          <li>
            <strong>Static assets (content-hashed):</strong>{' '}
            <code>public, max-age=31536000, immutable</code>
            <br />
            <span className="text-sm text-muted">Cache for 1 year, never revalidate. URL changes when content changes.</span>
          </li>
          <li>
            <strong>HTML pages:</strong>{' '}
            <code>no-cache</code> (with ETag)
            <br />
            <span className="text-sm text-muted">Always revalidate to get new asset URLs. 304 if unchanged.</span>
          </li>
          <li>
            <strong>API responses:</strong>{' '}
            <code>private, max-age=0, must-revalidate</code>
            <br />
            <span className="text-sm text-muted">Cache in browser only, always revalidate before use.</span>
          </li>
          <li>
            <strong>CDN-cached content:</strong>{' '}
            <code>public, max-age=60, s-maxage=3600</code>
            <br />
            <span className="text-sm text-muted">1 minute in browser, 1 hour at CDN edge.</span>
          </li>
          <li>
            <strong>Sensitive data:</strong>{' '}
            <code>no-store, private</code>
            <br />
            <span className="text-sm text-muted">Never cache. Full request every time.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2>CDN & Edge Caching</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/cdn-edge-caching.svg"
          alt="CDN Edge Caching Architecture"
          caption="CDN edge caching — origin server, CDN PoPs, edge locations, and request flow"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">How CDNs Work</h3>
        <ol className="space-y-3">
          <li>1. User requests resource</li>
          <li>2. DNS routes to nearest edge location</li>
          <li>3. Edge serves from cache (HIT) or fetches from origin (MISS)</li>
          <li>4. Edge caches for future requests</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Edge Computing</h3>
        <p>
          Modern CDNs offer compute at edge (Cloudflare Workers, Lambda@Edge, Vercel Edge Functions):
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Dynamic content at edge:</strong> Render personalized content without origin round-trip.
            Example: A/B test variants, geo-targeted content, user-specific greetings.
          </li>
          <li>
            <strong>A/B testing without origin:</strong> Serve different variants from edge based on
            cookies, headers, or random assignment. Reduces origin load and latency.
          </li>
          <li>
            <strong>Personalization at edge:</strong> Inject user-specific data (name, preferences) into
            cached HTML using edge compute + cached API data.
          </li>
          <li>
            <strong>Image optimization on-the-fly:</strong> Resize, reformat, compress images at edge based
            on device, viewport, or URL parameters. Services: Cloudflare Images, Imgix, Cloudinary.
          </li>
          <li>
            <strong>Bot detection and protection:</strong> Analyze requests at edge, block malicious bots
            before they reach origin.
          </li>
          <li>
            <strong>Request/Response transformation:</strong> Modify headers, rewrite URLs, inject scripts
            at edge without origin changes.
          </li>
        </ul>
        <p>
          <strong>Edge compute limitations:</strong> Cold starts (50-500ms), limited execution time (10-50ms
          typical), restricted APIs (no filesystem, limited network), memory limits (128MB typical).
        </p>
      </section>

      <section>
        <h2>Cache Invalidation</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/cache-invalidation-patterns.svg"
          alt="Cache Invalidation Patterns"
          caption="Cache invalidation strategies — versioning, TTL, purge, and stale-while-revalidate"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strategies</h3>
        <ul className="space-y-3">
          <li>
            <strong>Versioned URLs:</strong> <code>app.v2.js</code> — cache forever, new version = new URL
          </li>
          <li>
            <strong>TTL-based:</strong> <code>max-age=3600</code> — expires after time
          </li>
          <li>
            <strong>Purge API:</strong> Manually invalidate via CDN API
          </li>
          <li>
            <strong>Stale-while-revalidate:</strong> Serve stale, update in background
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Key Design</h3>
        <p>
          CDN cache keys determine when a cached response is reused. Default key: URL + Host header.
          Customize based on your needs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Include:</strong> URL path, query params (for pagination/filters), Host header,
            Accept-Encoding (for compression), Accept-Language (for i18n)
          </li>
          <li>
            <strong>Exclude:</strong> Session cookies, tracking params (utm_*), random query params,
            authentication headers (for public content)
          </li>
        </ul>
        <p>
          <strong>Example:</strong> Cloudflare Cache Rules or Varnish VCL to customize cache keys.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Invalidation Patterns</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">How It Works</th>
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Versioned URLs</strong></td>
              <td className="p-3">New version = new URL (app.abc123.js → app.def456.js)</td>
              <td className="p-3">Instant invalidation, no CDN API needed, cache forever safe</td>
              <td className="p-3">Requires build process to generate hashes, HTML must reference new URLs</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TTL Expiry</strong></td>
              <td className="p-3">Cache expires after max-age seconds</td>
              <td className="p-3">Simple, automatic, no manual intervention</td>
              <td className="p-3">Stale content until expiry, can&apos;t force immediate update</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Purge API</strong></td>
              <td className="p-3">Call CDN API to delete cached entries</td>
              <td className="p-3">Immediate invalidation, selective (by URL, tag, prefix)</td>
              <td className="p-3">Requires API integration, potential race conditions, may have rate limits</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache Tags</strong></td>
              <td className="p-3">Tag responses, purge by tag (Fastly, Cloudflare)</td>
              <td className="p-3">Purge related content together (e.g., all product pages)</td>
              <td className="p-3">Limited tag support, tag cardinality limits</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Soft Purge</strong></td>
              <td className="p-3">Mark stale but keep serving while revalidating</td>
              <td className="p-3">No downtime, graceful transition</td>
              <td className="p-3">Brief period with stale content</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between memory cache and disk cache?</p>
            <p className="mt-2 text-sm">
              A: Memory cache is faster (RAM) but cleared when tab closes. Disk cache persists across sessions
              but is slower. Memory cache is used for current page resources, disk cache for HTTP caching.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you cache-bust static assets?</p>
            <p className="mt-2 text-sm">
              A: Version the filenames (app.abc123.js) or use query params (app.js?v=123). Best practice is
              content-based hashing in filenames with long cache TTLs. When content changes, hash changes,
              browser fetches new version.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between no-cache and no-store?</p>
            <p className="mt-2 text-sm">
              A: <strong>no-cache</strong> means &quot;cache but revalidate before every use&quot;—the resource
              is stored but never served without checking with the server first (304 if unchanged).
              <strong>no-store</strong> means &quot;do NOT store in any cache&quot;—full request every time.
              Use no-cache for HTML pages, no-store for sensitive data like tokens or PII.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement cache invalidation for a CMS?</p>
            <p className="mt-2 text-sm">
              A: Use a hybrid approach. Static assets: versioned URLs with immutable cache. HTML pages:
              no-cache with ETag for revalidation. For immediate invalidation (breaking news, product updates),
              integrate with CDN purge API—trigger purge on content publish. For bulk invalidation, use cache
              tags to purge all related pages (e.g., all product pages in a category).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is stale-while-revalidate and when would you use it?</p>
            <p className="mt-2 text-sm">
              A: stale-while-revalidate allows serving a stale response while asynchronously revalidating in
              the background. Example: <code>max-age=60, stale-while-revalidate=30</code> means fresh for 60s,
              then for the next 30s, serve stale immediately while fetching the new version. Use it to balance
              performance (instant response) with freshness (background update). Great for content that updates
              periodically but doesn&apos;t need to be perfectly fresh.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
