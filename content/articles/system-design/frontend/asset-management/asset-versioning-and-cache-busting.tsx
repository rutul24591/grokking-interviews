"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-asset-versioning-and-cache-busting-extensive",
  title: "Asset Versioning and Cache Busting",
  description:
    "Comprehensive guide to asset versioning strategies, cache busting techniques, content hashing, CDN invalidation patterns, and deployment strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "asset-management",
  slug: "asset-versioning-and-cache-busting",
  version: "extensive",
  wordCount: 5200,
  readingTime: 21,
  lastUpdated: "2026-03-21",
  tags: [
    "asset-versioning",
    "cache-busting",
    "content-hash",
    "cdn",
    "webpack",
    "vite",
    "performance",
    "deployment",
    "cache-control",
    "service-worker",
  ],
  relatedTopics: [
    "cdn-caching",
    "service-worker-caching",
    "code-splitting",
    "bundle-size-optimization",
  ],
};

export default function AssetVersioningAndCacheBustingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Asset versioning</strong> is the practice of assigning a unique
          identifier to each version of a static asset (JavaScript bundles, CSS
          files, images, fonts) so that browsers and CDNs can distinguish between
          different versions of the same logical file. <strong>Cache busting</strong>{" "}
          is the complementary technique of forcing clients to fetch a fresh copy
          of an asset when its content changes, bypassing cached versions.
        </p>
        <p>
          Together, these techniques solve a fundamental tension in web
          performance: we want browsers to cache assets aggressively for speed,
          but we also need users to receive updated code immediately after
          deployments. Without proper versioning, users may run stale JavaScript
          against new API contracts, leading to runtime errors, broken
          functionality, or security vulnerabilities.
        </p>
        <p>
          <strong>Why this matters at the staff/principal level:</strong> Asset
          versioning decisions cascade through your entire deployment
          architecture. They affect CDN configuration, CI/CD pipelines, service
          worker strategies, rollback procedures, and even your monitoring
          approach. A poorly designed versioning strategy can cause cache
          poisoning incidents, deployment rollback failures, or gradual
          performance degradation as users accumulate stale assets. As a
          technical leader, you must design systems where every deploy
          deterministically invalidates exactly the assets that changed and
          nothing more.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: The Two-Cache Problem
          </h3>
          <p>
            Every asset request passes through at least two cache layers: the
            browser cache and the CDN edge cache. A correct versioning strategy
            must invalidate both simultaneously. If the CDN serves a new
            index.html that references <code>app.abc123.js</code> but some edge
            nodes still cache the old <code>app.abc123.js</code> from a previous
            deploy with the same hash collision, users see broken pages. Content
            hashing eliminates this class of bugs entirely because identical
            hashes guarantee identical content.
          </p>
        </div>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Content Hash (Fingerprint):</strong> A cryptographic digest
            (MD5, SHA-256) computed from the file&apos;s content. If even one byte
            changes, the hash changes entirely. This is the gold standard for
            cache busting because it is deterministic, content-aware, and
            collision-resistant.
          </li>
          <li>
            <strong>Query String Versioning:</strong> Appending a version
            parameter to the URL (e.g., <code>app.js?v=1.2.3</code>). While
            simple to implement, many CDNs and proxies strip or ignore query
            strings, making this approach unreliable in production.
          </li>
          <li>
            <strong>ETag (Entity Tag):</strong> An HTTP response header
            containing a hash or version identifier. The browser sends{" "}
            <code>If-None-Match</code> on subsequent requests, and the server
            responds with <code>304 Not Modified</code> if unchanged. This still
            requires a round-trip for validation, unlike content-hashed filenames
            which bypass the network entirely on cache hits.
          </li>
          <li>
            <strong>Cache-Control Directives:</strong> HTTP headers that dictate
            caching behavior. The key directives for asset versioning are{" "}
            <code>max-age</code> (cache duration), <code>immutable</code> (never
            revalidate), <code>no-cache</code> (always revalidate), and{" "}
            <code>must-revalidate</code> (revalidate after expiry).
          </li>
          <li>
            <strong>Asset Manifest:</strong> A JSON file generated at build time
            that maps logical filenames (e.g., <code>app.js</code>) to their
            hashed counterparts (e.g., <code>app.a3f8c2b1.js</code>). Server-side
            templates and HTML generators use the manifest to inject correct
            references.
          </li>
          <li>
            <strong>Immutable Caching:</strong> When combined with content
            hashing, the <code>Cache-Control: immutable</code> directive tells
            the browser that the resource at this URL will never change. The
            browser can skip revalidation entirely, even on hard refresh.
          </li>
          <li>
            <strong>Atomic Deploy:</strong> A deployment strategy where the new
            HTML entry point and all its referenced assets are deployed together,
            and the switch from old to new happens instantaneously. This prevents
            the &quot;partial deploy&quot; problem where new HTML references assets
            that haven&apos;t been uploaded yet.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The content-hash versioning pipeline transforms source files into
          uniquely named output files that can be cached indefinitely. The build
          tool computes a hash from each file&apos;s content and embeds it in the
          filename, generating a manifest that maps original names to hashed
          names.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-versioning-and-cache-busting-diagram-1.svg"
          alt="Content-hash based versioning pipeline showing source files flowing through a build tool to produce hashed output files and a manifest for deployment"
        />

        <p>
          Not all cache busting strategies are equal. The choice between query
          string versioning, filename hashing, and ETag-based revalidation has
          significant implications for cache hit rates, CDN compatibility, and
          deployment complexity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-versioning-and-cache-busting-diagram-2.svg"
          alt="Cache busting strategies comparison showing query string, filename hash, and ETag approaches with their respective pros and cons"
        />

        <p>
          Modern build tools like Webpack and Vite handle fingerprinting
          differently. Webpack uses <code>[contenthash]</code> placeholders in
          its output configuration, computing MD4 hashes at chunk emission time.
          Vite delegates to Rollup for production builds, using SHA-256 hashes by
          default. Both generate entry-point HTML with injected references to the
          hashed assets.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-versioning-and-cache-busting-diagram-3.svg"
          alt="Build tool fingerprinting flow comparing Webpack and Vite approaches to generating content hashes and injecting references"
        />

        <h3>Cache-Control Header Strategy</h3>
        <p>
          The optimal header strategy depends on whether the asset URL is
          stable or content-hashed:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`# Hashed assets (app.a3f8c2b1.js, styles.7d4e1f09.css)
Cache-Control: public, max-age=31536000, immutable

# Entry point HTML (index.html) — must always revalidate
Cache-Control: no-cache
# or equivalently:
Cache-Control: max-age=0, must-revalidate

# API responses — typically no long-term caching
Cache-Control: private, no-store

# Shared assets without hashes (favicon.ico, robots.txt)
Cache-Control: public, max-age=3600, must-revalidate`}
        </pre>
        <p>
          The critical pattern is: <strong>hashed assets get immutable caching;
          the HTML entry point always revalidates</strong>. This ensures users
          always get fresh HTML (which references the latest hashed assets) while
          the assets themselves are cached forever. Since the HTML contains
          references to content-hashed URLs, a new deploy means new HTML with new
          references, and the browser fetches only the assets whose hashes
          changed.
        </p>

        <h3>Service Worker Cache Management</h3>
        <p>
          Service workers add a third cache layer between the browser cache and
          the network. When using content-hashed assets with service workers, the
          recommended pattern is <strong>precaching with revision tracking</strong>:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`// Using Workbox precaching with content-hashed assets
import { precacheAndRoute } from 'workbox-precaching';

// The build tool injects this manifest automatically
// Each entry includes the hashed URL — revision is null
// because the hash IS the revision
precacheAndRoute([
  { url: '/assets/app.a3f8c2b1.js', revision: null },
  { url: '/assets/styles.7d4e1f09.css', revision: null },
  { url: '/assets/vendor.c4d2e8f6.js', revision: null },
  // index.html has no hash, so revision is a build hash
  { url: '/index.html', revision: '8a3b2c1d' },
]);

// Runtime caching for dynamic assets (images loaded on demand)
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 3600 }),
    ],
  })
);`}
        </pre>
        <p>
          When the service worker updates, it compares the new precache manifest
          against the cached entries. Assets with changed hashes are fetched and
          cached; unchanged assets are kept. This is why content-hashed filenames
          are ideal for service workers: the URL itself encodes the version, so
          no separate revision tracking is needed for hashed assets.
        </p>
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
                  Query String
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Filename Hash
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  ETag
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">CDN Compatibility</td>
                <td className="px-4 py-2">Low (some ignore query params)</td>
                <td className="px-4 py-2">High (universally supported)</td>
                <td className="px-4 py-2">Medium (server-dependent)</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Cache Precision</td>
                <td className="px-4 py-2">Coarse (manual version bump)</td>
                <td className="px-4 py-2">Exact (per-file content)</td>
                <td className="px-4 py-2">Exact (per-file content)</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Network Overhead</td>
                <td className="px-4 py-2">Full request if version changes</td>
                <td className="px-4 py-2">Zero (immutable, no revalidation)</td>
                <td className="px-4 py-2">Conditional request per asset</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Build Complexity</td>
                <td className="px-4 py-2">None</td>
                <td className="px-4 py-2">Medium (build tool config)</td>
                <td className="px-4 py-2">Low (server config)</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Immutable Caching</td>
                <td className="px-4 py-2">Not possible</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2">Not possible</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Rollback Safety</td>
                <td className="px-4 py-2">Risky (same URL, different content)</td>
                <td className="px-4 py-2">Safe (old hashes still cached)</td>
                <td className="px-4 py-2">Requires server rollback</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-2 font-medium">Service Worker Compat</td>
                <td className="px-4 py-2">Poor (revision tracking needed)</td>
                <td className="px-4 py-2">Excellent (URL is the revision)</td>
                <td className="px-4 py-2">Poor (opaque responses)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-4">
          <li>
            <strong>1. Use content hashes in filenames, not query strings.</strong>{" "}
            Content-hashed filenames (<code>[contenthash]</code> in Webpack,
            default in Vite) are the industry standard. They work with every CDN,
            proxy, and caching layer. Query string versioning is unreliable and
            should only be used as a fallback for legacy systems that cannot
            modify filenames.
          </li>
          <li>
            <strong>2. Set immutable caching on hashed assets.</strong> Use{" "}
            <code>Cache-Control: public, max-age=31536000, immutable</code> for
            all content-hashed assets. The <code>immutable</code> directive
            prevents browsers from revalidating even on hard refresh, saving
            unnecessary conditional requests.
          </li>
          <li>
            <strong>3. Always revalidate the HTML entry point.</strong> The HTML
            file is the root of your dependency tree. It must use{" "}
            <code>Cache-Control: no-cache</code> so browsers always check for a
            new version. The HTML itself is small (typically under 10 KB), so the
            revalidation cost is negligible.
          </li>
          <li>
            <strong>4. Deploy assets before switching the entry point.</strong>{" "}
            In an atomic deploy, upload all new hashed assets to the CDN first,
            then update the HTML. This prevents a window where the HTML references
            assets that don&apos;t exist yet. Old assets should be kept for at
            least one release cycle to support users mid-session.
          </li>
          <li>
            <strong>5. Use deterministic chunk IDs.</strong> Configure Webpack
            with <code>optimization.moduleIds: &apos;deterministic&apos;</code> to
            ensure that adding or removing a module doesn&apos;t change the
            hashes of unrelated chunks. Without this, a single import change can
            cascade hash changes across all chunks.
          </li>
          <li>
            <strong>6. Separate runtime chunks from application code.</strong>{" "}
            Extract the Webpack runtime into its own chunk (
            <code>optimization.runtimeChunk: &apos;single&apos;</code>) so that
            changes to module resolution logic don&apos;t invalidate application
            chunks.
          </li>
          <li>
            <strong>7. Implement asset cleanup with retention policies.</strong>{" "}
            Old hashed files accumulate in storage. Implement a retention policy
            that deletes assets older than N deploys or N days, while preserving
            any assets referenced by the currently live HTML and the previous
            release for rollback.
          </li>
          <li>
            <strong>8. Monitor cache hit rates in production.</strong> Use CDN
            analytics or custom headers (e.g., <code>X-Cache: HIT</code>) to
            track cache hit ratios. A sudden drop in cache hit rate after a deploy
            may indicate a hash stability regression.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Hash instability from non-deterministic module IDs:</strong>{" "}
            Webpack&apos;s default numeric module IDs change when modules are
            added or removed, causing unrelated chunk hashes to change. This
            destroys cache efficiency. Always use{" "}
            <code>moduleIds: &apos;deterministic&apos;</code>.
          </li>
          <li>
            <strong>Caching HTML with long max-age:</strong> If the HTML entry
            point is cached aggressively, users will continue loading old asset
            references even after a deploy. HTML must always revalidate. This is
            the single most common caching mistake.
          </li>
          <li>
            <strong>CDN cache poisoning from shared query-string keys:</strong>{" "}
            If multiple versions use the same query parameter name (e.g.,{" "}
            <code>?v=latest</code>), CDN edge nodes may serve stale cached
            responses for the same URL. Content hashing eliminates this by
            guaranteeing unique URLs per content version.
          </li>
          <li>
            <strong>Partial deploys causing asset 404s:</strong> Deploying new
            HTML before all hashed assets are available results in users
            requesting files that don&apos;t exist. Use atomic deploys or deploy
            assets first with an overlap window.
          </li>
          <li>
            <strong>Service worker serving stale assets indefinitely:</strong> If
            the service worker precache manifest is not updated on deploy, it
            will continue serving old assets from its cache. Ensure the service
            worker file itself is never cached (use <code>no-cache</code> or{" "}
            <code>max-age=0</code>), and always regenerate the precache manifest
            at build time.
          </li>
          <li>
            <strong>ETag mismatches across load-balanced servers:</strong>{" "}
            Apache and Nginx historically included the inode number in ETags. If
            the same file has different inodes on different servers (common with
            rsync deploys), clients receive unnecessary <code>200</code>{" "}
            responses instead of <code>304</code>. Use content-only ETags or
            disable inode-based generation.
          </li>
          <li>
            <strong>Forgetting to version web workers and WASM modules:</strong>{" "}
            Web workers and WebAssembly modules loaded via <code>new Worker()</code>{" "}
            or <code>WebAssembly.instantiateStreaming()</code> are separate
            network requests. They need the same content-hashing treatment as
            main bundles but are often overlooked.
          </li>
          <li>
            <strong>Source maps leaking in production:</strong> Content-hashed
            source maps can inadvertently be served to users if the CDN serves
            all files in the assets directory. Restrict source map access to
            authenticated monitoring tools (e.g., Sentry) via server-side access
            controls.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Netflix:</strong> Netflix uses content-hashed asset bundles
            with immutable caching across their global CDN (Open Connect). Their
            deploy pipeline uploads new assets to all edge nodes before switching
            the HTML manifest, ensuring zero-downtime deployments. They separate
            vendor chunks (React, RxJS) from application code so that library
            updates (rare) don&apos;t invalidate frequently-changing UI code.
          </li>
          <li>
            <strong>Google:</strong> Google&apos;s Closure Compiler generates
            content-hashed module names and uses a module server that resolves
            logical module IDs to hashed URLs. Their approach predates modern
            bundlers and demonstrates the same principle: immutable URLs for
            content-addressed assets, with a thin resolution layer that always
            serves fresh mappings.
          </li>
          <li>
            <strong>Vercel / Next.js:</strong> Next.js automatically generates
            content-hashed filenames for all static assets in the{" "}
            <code>/_next/static/</code> directory. The build output includes a
            <code>BUILD_ID</code> that versions the entire build, while individual
            chunks use content hashes. Vercel&apos;s CDN serves these with{" "}
            <code>immutable</code> caching and handles atomic deploys via their
            immutable deployment architecture where each deploy is a new,
            isolated snapshot.
          </li>
          <li>
            <strong>Shopify:</strong> Shopify serves thousands of merchant
            storefronts, each with custom themes. They use content-hashed asset
            URLs combined with a per-theme asset manifest. When a merchant edits
            their theme, only the affected assets get new hashes. Their CDN
            (Fastly) uses surrogate keys for targeted cache invalidation of
            theme-specific assets without purging unrelated merchants&apos;
            caches.
          </li>
          <li>
            <strong>Large SPA Migrations:</strong> Companies migrating from
            monolithic SPAs to micro-frontends face a unique versioning
            challenge: independently deployed micro-apps must share common
            dependencies. Module federation (Webpack 5) addresses this by
            exposing versioned shared modules with content-hashed URLs, allowing
            each micro-app to independently version its assets while sharing
            common chunks.
          </li>
        </ul>
      </section>

      {/* Section 8: CDN Cache Invalidation Patterns */}
      <section>
        <h2>CDN Cache Invalidation Patterns</h2>
        <p>
          Content hashing largely eliminates the need for explicit CDN cache
          invalidation for assets, because changed content produces new URLs.
          However, there are scenarios where invalidation is still necessary:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HTML entry points:</strong> Since HTML files don&apos;t use
            content hashing, you may need to purge the CDN cache for{" "}
            <code>/index.html</code> after each deploy. Alternatively, set{" "}
            <code>s-maxage=60</code> (CDN-specific max-age) with{" "}
            <code>stale-while-revalidate=30</code> so the CDN serves stale HTML
            briefly while fetching the new version in the background.
          </li>
          <li>
            <strong>Surrogate key purging:</strong> CDNs like Fastly and
            Cloudflare support tagging cached responses with surrogate keys. You
            can tag all assets from a specific deploy with a deploy ID, then
            purge by surrogate key during rollback. This is faster and more
            precise than purging by URL pattern.
          </li>
          <li>
            <strong>Soft purging:</strong> Instead of hard-purging (immediate
            removal), soft purging marks content as stale. The CDN continues
            serving the stale version while fetching fresh content in the
            background. This prevents thundering-herd problems where thousands of
            simultaneous cache misses overwhelm the origin.
          </li>
        </ul>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/articles/http-cache"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              web.dev &mdash; Prevent unnecessary network requests with the HTTP
              Cache
            </a>
          </li>
          <li>
            <a
              href="https://webpack.js.org/guides/caching/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Webpack &mdash; Caching Guide
            </a>
          </li>
          <li>
            <a
              href="https://vitejs.dev/guide/build.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Vite &mdash; Building for Production
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/workbox/modules/workbox-precaching/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Workbox &mdash; Precaching Guide
            </a>
          </li>
          <li>
            <a
              href="https://jakearchibald.com/2016/caching-best-practices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Jake Archibald &mdash; Caching Best Practices &amp; max-age
              Gotchas
            </a>
          </li>
          <li>
            <a
              href="https://httpwg.org/specs/rfc9111.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              RFC 9111 &mdash; HTTP Caching
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              MDN &mdash; Cache-Control
            </a>
          </li>
        </ul>
      </section>

      {/* Section 10: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Why is query string versioning unreliable for cache busting?
            </p>
            <p className="mt-2 text-sm text-muted">
              Several CDNs and reverse proxies (including some default Squid and
              Varnish configurations) strip query strings when computing cache
              keys, meaning <code>app.js?v=1</code> and <code>app.js?v=2</code>{" "}
              map to the same cache entry. Additionally, some corporate proxies
              strip query parameters entirely. Content-hashed filenames avoid
              this because the version is embedded in the URL path, which is
              always part of the cache key. Furthermore, query string versioning
              is typically manual (tied to semver, not content), so unchanged
              files get unnecessarily busted on version bumps.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How do you handle a deployment rollback with content-hashed
              assets?
            </p>
            <p className="mt-2 text-sm text-muted">
              Content-hashed assets make rollbacks trivial. Since each deploy
              produces uniquely named files, the previous deploy&apos;s assets
              are still available on the CDN (assuming a retention policy that
              keeps at least the previous version). To roll back, you simply
              redeploy the previous HTML entry point, which references the
              previous set of hashed assets. Those assets are already cached at
              edge nodes and in browsers, so the rollback is instant with no
              cache invalidation needed. This is why atomic deploys with asset
              retention are critical: the HTML is the only thing that needs to
              change during a rollback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: What is the &quot;immutable&quot; Cache-Control directive and
              when should you use it?
            </p>
            <p className="mt-2 text-sm text-muted">
              The <code>immutable</code> directive tells the browser that the
              resource at this URL will never change during its freshness
              lifetime. Without <code>immutable</code>, browsers may still
              revalidate cached resources on hard refresh (Ctrl+Shift+R) or when
              navigating back/forward, sending conditional requests with{" "}
              <code>If-None-Match</code> headers. With <code>immutable</code>,
              the browser skips revalidation entirely. You should use it
              exclusively on content-hashed assets where the URL guarantees the
              content. Never use <code>immutable</code> on non-hashed URLs
              (like <code>/app.js</code> without a hash) because you would have
              no way to force browsers to fetch updated content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How does Webpack&apos;s <code>[contenthash]</code> differ from{" "}
              <code>[chunkhash]</code> and <code>[hash]</code>?
            </p>
            <p className="mt-2 text-sm text-muted">
              <code>[hash]</code> (deprecated in Webpack 5) was a single hash
              for the entire compilation &mdash; if any file changed, every
              output filename changed, destroying cache efficiency.{" "}
              <code>[chunkhash]</code> is computed per-chunk (entry point and its
              dependency tree), so changes to one entry point don&apos;t affect
              other chunks. However, <code>[chunkhash]</code> includes both JS
              and extracted CSS in the same hash, so a CSS-only change also busts
              the JS cache. <code>[contenthash]</code> solves this by computing
              the hash from the extracted content only: the CSS file gets a hash
              from its CSS content, and the JS file gets a hash from its JS
              content. This gives maximum cache granularity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How would you design an asset versioning strategy for a
              micro-frontend architecture?
            </p>
            <p className="mt-2 text-sm text-muted">
              In a micro-frontend architecture, each team deploys independently,
              so you need versioning that works across independently built and
              deployed applications. The key challenges are shared dependencies
              (React, design system) and cross-app asset references. Use Webpack
              Module Federation with content-hashed shared modules: the host
              application exposes shared dependencies at versioned URLs, and
              remote applications consume them via a manifest. Each remote
              deploys its own content-hashed assets to its own CDN path (e.g.,{" "}
              <code>/apps/checkout/assets/</code>). The host&apos;s HTML
              references a remoteEntry manifest per micro-app, which itself is
              content-hashed. Shared chunks use <code>singleton: true</code> to
              prevent duplicate React instances. This gives each team deploy
              independence while maintaining efficient caching of shared code.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: A user reports seeing a broken page after a deploy. How do you
              diagnose whether it&apos;s a caching issue?
            </p>
            <p className="mt-2 text-sm text-muted">
              First, check the browser&apos;s DevTools Network tab for the HTML
              response: verify that <code>Cache-Control</code> is{" "}
              <code>no-cache</code> and the response contains references to the
              latest hashed assets. If the HTML is stale (old hashes), the issue
              is HTML caching &mdash; check CDN configuration and purge if
              needed. If the HTML is fresh but asset requests return 404, it
              indicates a partial deploy where new HTML was deployed before
              assets were available. Check the <code>X-Cache</code> header to
              determine if the CDN served a HIT or MISS. If assets return 200
              but with wrong content, it suggests a hash collision or CDN cache
              poisoning. Also check if a service worker is intercepting requests
              and serving stale precached assets &mdash; the Application tab in
              DevTools shows active service workers and their cache contents.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
