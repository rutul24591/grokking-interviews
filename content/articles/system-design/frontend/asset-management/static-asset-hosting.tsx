"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-asset-management-static-asset-hosting-extensive",
  title: "Static Asset Hosting",
  description:
    "Comprehensive guide to static asset hosting architecture covering object storage, CDN integration, deployment pipelines, caching hierarchies, security, and cost optimization for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "asset-management",
  slug: "static-asset-hosting",
  version: "extensive",
  wordCount: 5200,
  readingTime: 22,
  lastUpdated: "2026-03-21",
  tags: [
    "static-assets",
    "cdn",
    "s3",
    "cloudfront",
    "object-storage",
    "deployment",
    "caching",
    "brotli",
    "sri",
    "cors",
  ],
  relatedTopics: [
    "cdn-caching",
    "compression",
    "asset-versioning-and-cache-busting",
    "browser-caching",
    "service-worker-caching",
  ],
};

export default function StaticAssetHostingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ── 1. Definition & Context ────────────────────────────── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Static asset hosting</strong> is the infrastructure pattern of
          serving immutable, pre-built files&mdash;JavaScript bundles, CSS
          stylesheets, images, fonts, and other binary resources&mdash;from
          object storage backed by a content delivery network (CDN). Unlike
          dynamic server-rendered responses, static assets do not change between
          deployments, making them ideal candidates for aggressive caching and
          geographic distribution.
        </p>
        <p>
          At the staff/principal engineer level, static asset hosting is far more
          than &quot;put files in a bucket.&quot; It encompasses deployment
          atomicity, cache invalidation strategy, security posture (signed URLs,
          SRI, CORS), compression negotiation, cost modeling, and
          multi-region resilience. The decisions you make here directly impact
          page load performance, deployment velocity, and infrastructure spend.
        </p>
        <p>
          Modern platforms like Vercel, Netlify, and Cloudflare Pages abstract
          much of this complexity, but understanding the underlying architecture
          is essential when you need to debug production cache issues, optimize
          egress costs, or design a custom asset pipeline for a large-scale
          application.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: Immutability Is the Foundation
          </h3>
          <p>
            The entire static asset hosting model depends on one principle:
            content-addressed (hashed) filenames make assets immutable. When
            every file&apos;s URL changes if its content changes, you can set
            <code>Cache-Control: public, max-age=31536000, immutable</code> and
            never worry about stale caches. The only mutable asset is the entry
            point (<code>index.html</code>), which must always be revalidated.
          </p>
        </div>
      </section>

      {/* ── 2. Core Concepts ──────────────────────────────────── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Object Storage:</strong> Cloud-native storage services (AWS
            S3, Google Cloud Storage, Azure Blob Storage) designed for
            durability (11 nines), high availability, and near-infinite scale.
            Assets are stored as objects with metadata (content-type,
            cache-control, content-encoding) rather than in a traditional file
            system.
          </li>
          <li>
            <strong>CDN (Content Delivery Network):</strong> A globally
            distributed network of edge servers (Points of Presence / PoPs) that
            cache and serve assets from locations geographically close to users.
            CloudFront, Cloud CDN, Fastly, and Cloudflare are the major
            providers.
          </li>
          <li>
            <strong>Origin Shield:</strong> A regional caching layer between
            edge PoPs and the origin that collapses concurrent cache-miss
            requests into a single upstream fetch, dramatically reducing origin
            load and egress costs.
          </li>
          <li>
            <strong>Content-Hashed Filenames:</strong> Build tools (Webpack,
            Vite, esbuild) generate filenames containing a hash of the file
            content (e.g., <code>app.a1b2c3d4.js</code>). This makes each
            version a unique, immutable URL.
          </li>
          <li>
            <strong>Asset Manifest:</strong> A JSON file mapping logical asset
            names to their hashed URLs. The server or HTML template references
            the manifest to emit correct <code>&lt;script&gt;</code> and{" "}
            <code>&lt;link&gt;</code> tags.
          </li>
          <li>
            <strong>Subresource Integrity (SRI):</strong> A browser security
            feature where <code>&lt;script&gt;</code> and{" "}
            <code>&lt;link&gt;</code> tags include a{" "}
            <code>integrity=&quot;sha384-...&quot;</code> attribute. The browser
            verifies the fetched content matches the expected hash before
            execution, preventing CDN tampering attacks.
          </li>
          <li>
            <strong>Atomic Deployment:</strong> A deployment strategy where all
            assets for a new version are uploaded before the entry point
            (index.html) is updated. This prevents users from loading a mix of
            old and new assets during deployment.
          </li>
          <li>
            <strong>Compression Negotiation:</strong> The process of serving
            pre-compressed (Brotli or gzip) assets based on the client&apos;s{" "}
            <code>Accept-Encoding</code> header. Pre-compression at build time
            is more efficient than on-the-fly compression at the edge.
          </li>
        </ul>
      </section>

      {/* ── 3. Architecture & Flow ────────────────────────────── */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production-grade static asset hosting architecture consists of three
          layers: the client layer (browser caches, service workers), the edge
          layer (CDN PoPs with origin shield), and the origin layer (object
          storage with asset manifests).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/static-asset-hosting-diagram-1.svg"
          alt="Static asset hosting architecture showing client, edge CDN, and origin storage layers with their key components"
        />

        <h3>Request Flow</h3>
        <ol className="space-y-2">
          <li>
            <strong>Browser cache check (L1):</strong> The browser checks its
            disk and memory caches. For immutable hashed assets, this is a
            guaranteed hit until cache eviction. For <code>index.html</code>,
            the browser sends a conditional request (
            <code>If-None-Match</code> / <code>If-Modified-Since</code>).
          </li>
          <li>
            <strong>Edge PoP (L2):</strong> On cache miss, the request routes
            via DNS/Anycast to the nearest CDN PoP. The edge server checks its
            local SSD-backed cache. Hit rates of 90-95% are typical for
            well-configured static asset setups.
          </li>
          <li>
            <strong>Origin Shield (L3):</strong> If the edge misses, the
            request goes to the origin shield&mdash;a regional consolidation
            point. Multiple concurrent edge misses for the same asset are
            coalesced into a single origin fetch. This is critical for
            protecting the origin during deployments and cache warmup.
          </li>
          <li>
            <strong>Origin fetch:</strong> Only ~2% of requests reach the
            origin. The object storage serves the asset, and the response
            propagates back through the caching hierarchy, populating each
            layer.
          </li>
        </ol>

        <h3>Deployment Pipeline</h3>
        <p>
          The deployment pipeline must guarantee atomicity: users should never
          load a partially deployed set of assets. The standard pattern is to
          upload all new hashed assets first, then atomically switch the entry
          point.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/static-asset-hosting-diagram-2.svg"
          alt="Asset deployment pipeline showing CI/CD trigger, build, upload, CDN invalidation, and verification stages with atomic deploy strategy"
        />

        <h3>Caching Hierarchy</h3>
        <p>
          Understanding the multi-tier caching hierarchy is essential for
          debugging &quot;why is the user seeing stale content&quot; issues and
          for optimizing cache hit ratios. The origin shield pattern is
          particularly important for reducing egress costs and origin load.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/static-asset-hosting-diagram-3.svg"
          alt="Caching hierarchy showing L1 browser, L2 edge PoPs, L3 origin shield, and origin storage with hit rates and latencies"
        />

        <h3>Compression Strategy</h3>
        <p>
          Pre-compressing assets at build time with both Brotli (
          <code>.br</code>) and gzip (<code>.gz</code>) is more CPU-efficient
          than compressing on every request at the edge. The CDN serves the
          appropriate variant based on the <code>Accept-Encoding</code> header.
          Brotli achieves 15-25% better compression ratios than gzip for text
          assets, translating to meaningful performance gains on slower
          connections. Build tools like Vite support compression plugins that
          generate both .br files (Brotli quality 11) and .gz fallback files
          during the build, with a threshold setting to only compress files
          larger than 1KB. The S3 upload script then uploads all three variants
          (original, .br, .gz) with appropriate Content-Encoding headers, and
          CloudFront uses an Origin Request Policy to route based on the
          Accept-Encoding header.
        </p>

        <h3>CORS Configuration for Cross-Origin Assets</h3>
        <p>
          When assets are served from a different domain than the application
          (e.g., <code>assets.example.com</code> vs <code>app.example.com</code>
          ), CORS headers must be configured on the storage bucket and
          propagated through the CDN. Fonts are particularly sensitive: browsers
          require <code>Access-Control-Allow-Origin</code> for cross-origin font
          loading. S3 CORS configuration is a JSON policy specifying allowed
          origins (e.g., https://app.example.com), allowed methods (GET, HEAD),
          allowed headers (*), exposed headers (ETag, Content-Length), and
          MaxAgeSeconds (86400 for one day). CloudFront adds CORS headers via a
          Response Headers Policy with Access-Control-Allow-Origin set to the
          app domain, Access-Control-Allow-Methods for GET and HEAD,
          Access-Control-Max-Age of 86400, and critically Vary: Origin to ensure
          correct caching behavior.
        </p>
      </section>

      {/* ── 4. Trade-offs & Comparisons ───────────────────────── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Approach
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Pros
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Cons
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">
                  S3 + CloudFront
                </td>
                <td className="px-4 py-2">
                  Mature, 450+ PoPs, Lambda@Edge, Origin Shield, granular IAM
                </td>
                <td className="px-4 py-2">
                  Complex config, invalidation costs ($0.005/path), egress pricing
                </td>
                <td className="px-4 py-2">
                  AWS-native stacks, enterprise
                </td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">
                  GCS + Cloud CDN
                </td>
                <td className="px-4 py-2">
                  Tight GCP integration, competitive pricing, global anycast
                </td>
                <td className="px-4 py-2">
                  Fewer PoPs than CloudFront, less edge compute
                </td>
                <td className="px-4 py-2">
                  GCP-native stacks
                </td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">
                  Cloudflare R2 + CDN
                </td>
                <td className="px-4 py-2">
                  Zero egress fees, 300+ PoPs, Workers for edge logic
                </td>
                <td className="px-4 py-2">
                  Newer service, fewer enterprise features, vendor lock-in
                </td>
                <td className="px-4 py-2">
                  Cost-sensitive, high-egress workloads
                </td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">
                  Vercel / Netlify
                </td>
                <td className="px-4 py-2">
                  Zero-config, atomic deploys, preview URLs, integrated CI/CD
                </td>
                <td className="px-4 py-2">
                  Higher cost at scale, less infrastructure control, bandwidth limits
                </td>
                <td className="px-4 py-2">
                  Small-medium teams, rapid iteration
                </td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">
                  Self-hosted (Nginx + NFS)
                </td>
                <td className="px-4 py-2">
                  Full control, no egress costs, predictable pricing
                </td>
                <td className="px-4 py-2">
                  Operational burden, no global distribution, scaling limits
                </td>
                <td className="px-4 py-2">
                  On-prem requirements, regulated industries
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Compression: Origin vs. Edge</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Strategy
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  CPU Cost
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Compression Ratio
                </th>
                <th className="px-4 py-2 text-left font-semibold text-theme">
                  Latency Impact
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">Pre-compressed at build (Brotli q11)</td>
                <td className="px-4 py-2">One-time, at build</td>
                <td className="px-4 py-2">Best (15-25% smaller than gzip)</td>
                <td className="px-4 py-2">None&mdash;served from cache</td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">Edge compression (Brotli q4)</td>
                <td className="px-4 py-2">Per cache-miss, at edge</td>
                <td className="px-4 py-2">Good (lower quality level)</td>
                <td className="px-4 py-2">10-50ms per miss</td>
              </tr>
              <tr className="border-b border-theme/50">
                <td className="px-4 py-2 font-medium">Origin compression (gzip)</td>
                <td className="px-4 py-2">Per origin request</td>
                <td className="px-4 py-2">Baseline</td>
                <td className="px-4 py-2">5-20ms per request</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. Best Practices ─────────────────────────────────── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use content-hashed filenames for all assets:</strong> This
            is non-negotiable. Every JS, CSS, image, and font file should have a
            content hash in its filename. Set{" "}
            <code>Cache-Control: public, max-age=31536000, immutable</code> on
            all hashed assets. Only entry points (<code>index.html</code>,{" "}
            <code>manifest.json</code>) should use{" "}
            <code>Cache-Control: no-cache</code>.
          </li>
          <li>
            <strong>Enable Origin Shield:</strong> For any CDN with more than a
            handful of PoPs, enable origin shield in the region closest to your
            storage bucket. This typically reduces origin requests by 90%+ and
            significantly cuts egress costs.
          </li>
          <li>
            <strong>Pre-compress at build time:</strong> Generate both{" "}
            <code>.br</code> and <code>.gz</code> variants during the build.
            Configure the CDN to serve the best variant based on{" "}
            <code>Accept-Encoding</code>. This avoids edge CPU overhead and
            allows maximum Brotli compression quality (level 11).
          </li>
          <li>
            <strong>Implement atomic deployments:</strong> Upload all new
            hashed assets before updating the entry point. Keep old asset
            versions for at least 24-72 hours to serve users who loaded the
            previous <code>index.html</code> but haven&apos;t fetched all
            referenced assets yet.
          </li>
          <li>
            <strong>Use SRI for third-party and CDN-served scripts:</strong>{" "}
            Generate integrity hashes at build time and include them in{" "}
            <code>&lt;script&gt;</code> and <code>&lt;link&gt;</code> tags. This
            protects against CDN compromise or supply chain attacks.
          </li>
          <li>
            <strong>Restrict origin access to CDN-only:</strong> Configure
            bucket policies to deny all direct access. Use Origin Access Identity
            (OAI) or Origin Access Control (OAC) in CloudFront, or signed
            URLs/cookies for sensitive assets.
          </li>
          <li>
            <strong>Monitor cache hit ratios obsessively:</strong> A production
            static asset CDN should achieve 95%+ cache hit ratios. Drops below
            this indicate misconfigured <code>Vary</code> headers, cache key
            pollution (e.g., marketing query parameters), or insufficient TTLs.
          </li>
          <li>
            <strong>Set up multi-region replication for the origin:</strong>{" "}
            Configure cross-region replication on your storage bucket with a
            failover origin in the CDN configuration. This protects against
            regional outages.
          </li>
          <li>
            <strong>Use lifecycle policies for cost management:</strong>{" "}
            Automatically transition old asset versions to cheaper storage
            classes (S3 Infrequent Access after 30 days, Glacier after 90 days)
            and delete after 180 days.
          </li>
          <li>
            <strong>Include Vary: Accept-Encoding in responses:</strong> When
            serving compressed assets, the <code>Vary</code> header ensures the
            CDN caches separate variants for different encodings. Without it,
            a Brotli-compressed response might be served to a client that only
            supports gzip.
          </li>
        </ol>
      </section>

      {/* ── 6. Common Pitfalls ────────────────────────────────── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Invalidating all CDN paths on every deploy:</strong>{" "}
            Wildcard invalidation (<code>/*</code>) is expensive and slow. With
            content-hashed filenames, you only need to invalidate{" "}
            <code>/index.html</code> and possibly <code>/manifest.json</code>.
            Hashed assets never need invalidation.
          </li>
          <li>
            <strong>Forgetting to set CORS on font files:</strong> Browsers
            enforce CORS for <code>@font-face</code> cross-origin requests.
            Missing <code>Access-Control-Allow-Origin</code> headers cause fonts
            to silently fail, often only caught in production.
          </li>
          <li>
            <strong>Query-string cache busting instead of filename hashing:</strong>{" "}
            Using <code>app.js?v=123</code> instead of{" "}
            <code>app.a1b2c3.js</code> is fragile. Some CDNs and proxies strip
            query strings, leading to stale content. Filename hashing is
            universally supported.
          </li>
          <li>
            <strong>
              Not retaining old asset versions during blue-green deploys:
            </strong>{" "}
            Users who loaded the old <code>index.html</code> will request old
            asset URLs. If those files are deleted, the app breaks with 404
            errors for in-flight users. Keep old versions for 24-72 hours
            minimum.
          </li>
          <li>
            <strong>Serving index.html with long max-age:</strong> If{" "}
            <code>index.html</code> is cached with{" "}
            <code>max-age=31536000</code>, users will never see new deployments
            until the cache expires. Entry points must always use{" "}
            <code>no-cache</code> or very short TTLs.
          </li>
          <li>
            <strong>Missing Vary header on compressed responses:</strong>{" "}
            Without <code>Vary: Accept-Encoding</code>, the CDN may serve a
            Brotli-encoded response to a client that sent{" "}
            <code>Accept-Encoding: gzip</code>, causing decode failures.
          </li>
          <li>
            <strong>Ignoring egress costs at scale:</strong> Cloud storage
            egress fees ($0.09/GB for S3, $0.12/GB for GCS) add up quickly for
            high-traffic sites. A cache hit ratio drop from 95% to 85% can
            double your egress bill. Origin shield and proper caching are the
            primary defenses.
          </li>
          <li>
            <strong>Public bucket policies:</strong> Making S3 buckets public
            (via ACLs or bucket policies) exposes all contents. Always use CDN
            origin access controls and deny direct bucket access.
          </li>
        </ul>
      </section>

      {/* ── 7. Real-World Use Cases ───────────────────────────── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Vercel&apos;s Edge Network:</strong> Vercel deploys Next.js
            static assets to a global edge network with automatic content
            hashing, immutable caching, and instant rollback. Their architecture
            uses atomic deployments where each deploy gets a unique URL, and
            production traffic switches atomically. They pre-compress all text
            assets with Brotli and serve via their 70+ edge locations.
          </li>
          <li>
            <strong>Netlify&apos;s Atomic Deploys:</strong> Netlify pioneered
            the &quot;atomic deploy&quot; concept for JAMstack sites. Each
            deploy creates a complete, immutable snapshot of the site. Rollback
            is instant because previous snapshots are retained. They use a
            custom CDN (Netlify Edge) built on top of multiple cloud providers.
          </li>
          <li>
            <strong>Netflix&apos;s Open Connect:</strong> Netflix serves static
            media assets from its Open Connect CDN, which places custom hardware
            appliances directly in ISP networks. Their origin is backed by S3
            with multi-region replication, and they pre-position popular content
            during off-peak hours.
          </li>
          <li>
            <strong>Shopify&apos;s Asset Pipeline:</strong> Shopify serves
            merchant storefront assets from a global CDN backed by GCS. They
            use content-hashed filenames, SRI for all scripts, and an asset
            manifest that maps theme file paths to hashed CDN URLs. Their
            pipeline pre-compresses assets and generates WebP/AVIF variants for
            images automatically.
          </li>
          <li>
            <strong>GitHub Pages:</strong> GitHub Pages serves static sites from
            a CDN backed by Azure Blob Storage. They use content-hashed asset
            filenames generated by Jekyll/Hugo, with automatic HTTPS via Let&apos;s
            Encrypt and DDoS protection via Fastly.
          </li>
        </ul>
      </section>

      {/* ── 8. Security Deep Dive ─────────────────────────────── */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Static asset hosting has a unique security profile: assets are public
          by design (anyone can fetch your JS bundles), but the infrastructure
          serving them must be locked down to prevent unauthorized uploads,
          bucket enumeration, and supply chain attacks. Bucket policies enforce
          CDN-only access via Origin Access Control (OAC), with a statement
          allowing CloudFront service principal to get objects only from a
          specific distribution ARN, and a deny statement for all other access.
          Subresource Integrity (SRI) protects against CDN tampering: build
          tools generate SHA-384 integrity hashes that are included in script
          tags, and browsers verify the fetched content matches the expected
          hash before execution. For sensitive assets like premium video
          content, signed URLs with expiration times (e.g., 1 hour) are
          generated using CloudFront key pairs, ensuring only authorized users
          can access the content.
        </p>
      </section>

      {/* ── 9. Cost Optimization ──────────────────────────────── */}
      <section>
        <h2>Cost Optimization</h2>
        <p>
          At scale, static asset hosting costs are dominated by CDN egress
          (data transfer out) and CDN request fees, not storage. A systematic
          approach to cost optimization focuses on maximizing cache hit ratios
          and minimizing origin fetches. For a typical workload of 10M daily
          page views with 2MB average assets per page and 95% CDN cache hit
          ratio, the cost breakdown is approximately: storage at $1.15/month
          (50GB × $0.023/GB), CDN requests at $300/month, CDN egress at
          $850/month, and origin egress at $900/month, totaling around
          $2,050/month. Key optimization levers include: Origin Shield which
          reduces origin egress by 90% (saving $810/month), Brotli compression
          reducing payload by 25% (saving $212/month), using Cloudflare R2 for
          zero egress fees (saving $900/month on origin), and improving cache
          hit ratio from 95% to 99% which reduces egress by 80%. S3 Lifecycle
          policies automatically transition old assets to cheaper storage
          classes (STANDARD_IA after 30 days, GLACIER after 90 days) and
          expire assets after 180 days.
        </p>
      </section>

      {/* ── 10. Monitoring & Observability ────────────────────── */}
      <section>
        <h2>Monitoring &amp; Observability</h2>
        <p>
          Effective monitoring of a static asset hosting stack requires tracking
          metrics at every layer of the caching hierarchy. The key metrics to
          alert on are: At the CDN layer, cache hit ratio (target 0.95, alert
          below 0.90), edge latency P95 (target 50ms, alert above 200ms), and
          origin error rate (target 0.1%, alert above 1%). At the client layer
          (Real User Monitoring), resource load time for cached assets (target
          100ms, alert above 500ms) and SRI failures (target 0, alert above 1).
          At the cost layer, monthly egress against budget (e.g., 5000GB budget,
          alert at 4000GB). CloudWatch dashboards for S3 + CloudFront should
          track TotalErrorRate, 4xx/5xxErrorRate, BytesDownloaded,
          BytesUploaded, CacheHitRate by distribution, and OriginLatency at
          p50, p95, and p99 percentiles.
        </p>
      </section>

      {/* ── 11. Common Interview Questions ────────────────────── */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How would you design an atomic deployment strategy for static
              assets to ensure zero-downtime deploys?
            </p>
            <p className="mt-2 text-sm text-muted">
              Use content-hashed filenames for all assets and version-prefixed
              directories in object storage (e.g., /v42/, /v43/). Upload all new
              assets to the new version directory first. Then atomically update the
              entry point (index.html) to reference the new manifest. Keep old
              versions for 24-72 hours to serve in-flight requests. Rollback is
              instant: revert index.html to point at the previous manifest. The key
              insight is that hashed assets are immutable and can coexist
              indefinitely&mdash;only the entry point pointer changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: What is an origin shield and when would you recommend enabling
              it?
            </p>
            <p className="mt-2 text-sm text-muted">
              An origin shield is a regional caching layer between edge PoPs and
              the origin. When multiple edge nodes simultaneously miss for the
              same asset, the origin shield collapses these into a single origin
              fetch (request coalescing). Enable it when: (1) your CDN has many
              PoPs and cache misses from different edges are hammering the origin,
              (2) during deployments when caches are cold, (3) when egress costs
              from the origin are significant. Place the shield in the same region
              as your storage bucket to minimize latency. CloudFront, Fastly, and
              Cloudflare all support this pattern.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How do you handle the &quot;stale asset&quot; problem during
              deployments where a user has cached index.html referencing old
              assets that have been deleted?
            </p>
            <p className="mt-2 text-sm text-muted">
              This is the &quot;deploy gap&quot; problem. The solution has three
              parts: (1) Never delete old hashed assets immediately&mdash;keep
              them for at least 24-72 hours using S3 lifecycle policies. (2) Set
              index.html to no-cache so users always get the latest entry point
              on navigation. (3) For SPAs, implement a version check mechanism:
              periodically fetch the manifest and compare versions. If the app
              detects a newer version, show a non-intrusive prompt asking the user
              to reload. This prevents broken experiences for long-lived tabs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Compare pre-compression at build time vs. dynamic compression
              at the CDN edge. When would you choose each?
            </p>
            <p className="mt-2 text-sm text-muted">
              Pre-compression at build time is superior for static assets because:
              (1) you can use Brotli quality 11 (maximum compression) which is too
              slow for real-time but gives 15-25% better ratios than gzip, (2) the
              CPU cost is paid once during build, not on every cache miss, (3) the
              CDN serves pre-compressed files directly from cache. Dynamic
              compression makes sense for: (1) dynamic API responses that
              can&apos;t be pre-compressed, (2) user-generated content uploaded
              directly to storage, (3) very large asset catalogs where
              pre-compressing everything is impractical. The recommended approach
              is to pre-compress all build artifacts and use edge compression only
              as a fallback for non-pre-compressed content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How would you optimize static asset hosting costs for a
              high-traffic application serving 100M requests/day?
            </p>
            <p className="mt-2 text-sm text-muted">
              Cost optimization at this scale requires a multi-pronged approach:
              (1) Maximize cache hit ratio to 99%+ by using immutable
              content-hashed URLs with year-long TTLs, minimizing Vary header
              values, and stripping unnecessary query parameters from cache keys.
              (2) Enable origin shield to reduce origin fetches by 90%+. (3)
              Consider Cloudflare R2 for zero-egress storage or negotiate
              committed-use discounts with AWS/GCP. (4) Pre-compress with Brotli
              to reduce transfer size by 25%. (5) Use S3 Intelligent-Tiering or
              lifecycle policies to move old asset versions to cheaper storage
              classes. (6) Consolidate assets with code splitting to reduce
              request counts. At 100M req/day, even a 1% improvement in cache hit
              ratio saves thousands of dollars monthly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How does Subresource Integrity (SRI) protect against CDN
              compromise, and what are its limitations?
            </p>
            <p className="mt-2 text-sm text-muted">
              SRI adds an integrity attribute to script and link tags containing
              a cryptographic hash of the expected file content. When the browser
              fetches the resource, it computes the hash of the received content
              and compares it to the declared hash. If they don&apos;t match, the
              browser refuses to execute the script or apply the stylesheet. This
              protects against CDN tampering, MITM attacks, and supply chain
              compromises. Limitations: (1) SRI only works for scripts and
              stylesheets, not images or fonts. (2) It requires CORS
              (crossorigin attribute) on the resource. (3) Dynamic assets or
              those with varying content (e.g., locale-specific bundles selected
              by the CDN) cannot use SRI. (4) It adds build complexity since
              hashes must be regenerated on every build and embedded in the HTML.
              (5) If the CDN legitimately transforms content (e.g., minification),
              SRI will break. Always use SRI with content-hashed filenames for
              maximum protection.
            </p>
          </div>
        </div>
      </section>

      {/* ── 12. References & Further Reading ──────────────────── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              AWS CloudFront Origin Shield Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/reliable"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              web.dev &ndash; Network Reliability
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              MDN &ndash; Subresource Integrity (SRI)
            </a>
          </li>
          <li>
            <a
              href="https://developers.cloudflare.com/r2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Cloudflare R2 &ndash; Zero Egress Object Storage
            </a>
          </li>
          <li>
            <a
              href="https://vercel.com/docs/edge-network/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Vercel Edge Network Architecture
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/cdn/docs/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google Cloud CDN Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
