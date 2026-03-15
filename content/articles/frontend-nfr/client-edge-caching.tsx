"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-client-edge-caching",
  title: "Client & Edge Caching",
  description: "Comprehensive guide to caching strategies at the client and edge layers. Covers browser cache, CDN, edge computing, and cache invalidation patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "client-edge-caching",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "caching", "cdn", "edge", "performance"],
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
          Modern CDNs offer compute at edge (Cloudflare Workers, Lambda@Edge):
        </p>
        <ul>
          <li>Dynamic content at edge</li>
          <li>A/B testing without origin</li>
          <li>Personalization at edge</li>
          <li>Image optimization on-the-fly</li>
        </ul>
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
        </div>
      </section>
    </ArticleLayout>
  );
}
