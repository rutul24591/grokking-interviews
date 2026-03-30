"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-compression",
  title: "Compression (Gzip, Brotli)",
  description: "Comprehensive guide to HTTP compression techniques including Gzip and Brotli for reducing transfer sizes and improving page load performance.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "compression",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "compression", "gzip", "brotli", "HTTP", "transfer-size", "optimization"],
  relatedTopics: ["minification-and-uglification", "bundle-size-optimization", "critical-css", "image-optimization"],
};

export default function CompressionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTP compression</strong> reduces the size of text-based responses (HTML, CSS, 
          JavaScript, JSON, SVG) sent over the network. The server compresses the response body before 
          sending it, and the browser decompresses it before processing. This typically reduces transfer 
          sizes by <strong>60-85%</strong> with virtually no perceptible overhead on the client side.
        </p>
        <p>
          Compression is one of the highest-ROI performance optimizations available. A simple server 
          configuration change can reduce JavaScript bundle transfer from 500KB to 150KB, CSS from 
          100KB to 30KB, and HTML from 50KB to 15KB. For users on slow or metered connections, this 
          difference translates to seconds of load time saved.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/compression-algorithms.svg"
          alt="Comparison chart showing Gzip vs Brotli compression ratios, browser support, and compression speeds for different file types"
          caption="Gzip vs Brotli: Brotli provides 15-25% better compression but is slower to compress"
        />

        <p>
          The two dominant compression algorithms are:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Gzip:</strong> The universal standard since the 1990s. Supported by 100% of browsers 
            and servers. Provides 60-75% size reduction for text assets. Fast compression and 
            decompression.
          </li>
          <li>
            <strong>Brotli (br):</strong> Google&apos;s modern algorithm (2015). Provides 15-25% better 
            compression than Gzip. Supported in all modern browsers over HTTPS. Slower compression but 
            equally fast decompression.
          </li>
        </ul>

        <p>
          The performance impact of compression is substantial:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Reduced Transfer Time:</strong> A 500KB JavaScript bundle compressed to 150KB loads 
            3x faster on a 1Mbps connection (4 seconds → 1.3 seconds).
          </li>
          <li>
            <strong>Lower Data Usage:</strong> Users on metered connections consume 60-85% less data for 
            the same content.
          </li>
          <li>
            <strong>Improved Core Web Vitals:</strong> Faster resource download directly improves LCP 
            (Largest Contentful Paint) and FCP (First Contentful Paint).
          </li>
          <li>
            <strong>Reduced Server Costs:</strong> Less bandwidth consumed means lower CDN and hosting 
            costs, especially for high-traffic sites.
          </li>
        </ul>

        <p>
          Compression is transparent to JavaScript — your code never knows the response was compressed. 
          The browser automatically sends an <code>Accept-Encoding</code> header listing supported 
          algorithms, and the server responds with a <code>Content-Encoding</code> header indicating 
          which algorithm was used.
        </p>

        <p>
          In system design interviews, compression demonstrates understanding of HTTP protocols, 
          network optimization, and the trade-offs between compression ratio and CPU cost. It&apos;s 
          a foundational technique that applies beyond web — API design, microservices communication, 
          and data storage all use similar compression principles.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/compression-flow.svg"
          alt="Flow diagram showing HTTP compression request-response cycle with Accept-Encoding header, server compression, and browser decompression"
          caption="HTTP compression flow: browser advertises support, server compresses, browser decompresses transparently"
        />

        <h3>How HTTP Compression Works</h3>
        <p>
          The compression handshake happens automatically:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Browser Request:</strong> The browser sends an <code>Accept-Encoding</code> header 
            listing supported algorithms:
            <br />
            <code>Accept-Encoding: gzip, deflate, br</code>
          </li>
          <li>
            <strong>Server Selection:</strong> The server chooses the best supported algorithm (usually 
            Brotli if available, otherwise Gzip).
          </li>
          <li>
            <strong>Compression:</strong> The server compresses the response body using the selected 
            algorithm.
          </li>
          <li>
            <strong>Server Response:</strong> The server sends the compressed response with a 
            <code>Content-Encoding</code> header:
            <br />
            <code>Content-Encoding: br</code>
          </li>
          <li>
            <strong>Browser Decompression:</strong> The browser automatically decompresses the response 
            before passing it to JavaScript or rendering.
          </li>
        </ol>

        <h3>Compression Algorithms Compared</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Algorithm</th>
                <th className="p-3 text-left">Compression Ratio</th>
                <th className="p-3 text-left">Browser Support</th>
                <th className="p-3 text-left">Compression Speed</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Gzip</td>
                <td className="p-3">60-75% reduction</td>
                <td className="p-3">100%</td>
                <td className="p-3">Fast at all levels</td>
                <td className="p-3">Dynamic responses, fallback</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Brotli (level 4-6)</td>
                <td className="p-3">70-80% reduction</td>
                <td className="p-3">97% (HTTPS only)</td>
                <td className="p-3">Moderate</td>
                <td className="p-3">Dynamic responses</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Brotli (level 11)</td>
                <td className="p-3">75-85% reduction</td>
                <td className="p-3">97% (HTTPS only)</td>
                <td className="p-3">Very slow</td>
                <td className="p-3">Pre-compressed static assets</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Deflate</td>
                <td className="p-3">55-70% reduction</td>
                <td className="p-3">Legacy</td>
                <td className="p-3">Fast</td>
                <td className="p-3">Legacy fallback (rarely used)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Compression Levels</h3>
        <p>
          Both Gzip and Brotli support compression levels that trade compression ratio for CPU time:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Gzip levels 1-9:</strong> Level 6 is the default. Higher levels provide marginally 
            better compression but take significantly longer. For dynamic content, levels 4-6 are 
            optimal.
          </li>
          <li>
            <strong>Brotli levels 0-11:</strong> Level 4-6 is suitable for dynamic content (moderate 
            compression, reasonable speed). Level 11 provides the best compression but is extremely 
            slow — only use for pre-compressed static assets.
          </li>
        </ul>

        <h3>What to Compress</h3>
        <p>
          Compression is most effective for text-based formats:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Highly Compressible (70-85% reduction):</strong> JavaScript, CSS, HTML, JSON, XML, 
            SVG, fonts (WOFF, TTF), text files.
          </li>
          <li>
            <strong>Moderately Compressible (30-50% reduction):</strong> Source maps, large text-based 
            data files.
          </li>
          <li>
            <strong>Not Worth Compressing (0-5% reduction):</strong> Images (JPEG, PNG, WebP, AVIF), 
            videos (MP4, WebM), already-compressed fonts (WOFF2), archives (ZIP, GZIP). These formats 
            are already compressed — re-compressing adds CPU cost for negligible gain.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/compression-business-impact.svg"
          alt="Chart showing business impact of compression: before compression (500KB JS, 3s load) vs after (150KB JS, 1s load) with conversion rate improvements"
          caption="Business impact: compression reduces transfer size 60-85%, directly improving load times and conversion rates"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <h3>Compression Strategies</h3>
        <p>
          There are two main approaches to serving compressed content:
        </p>

        <h4>Dynamic Compression</h4>
        <p>
          The server compresses responses on-the-fly for each request:
        </p>
        <ul className="space-y-1">
          <li>• Request arrives at server</li>
          <li>• Server compresses response using Gzip or Brotli</li>
          <li>• Compressed response sent to client</li>
          <li>• Process repeats for each request</li>
        </ul>
        <p>
          <strong>Pros:</strong> Always serves the latest content, no build-step changes needed.
        </p>
        <p>
          <strong>Cons:</strong> CPU overhead on every request, slower response times for large assets.
        </p>
        <p>
          <strong>Best for:</strong> Dynamic content (HTML, API responses), frequently changing assets.
        </p>

        <h4>Pre-Compression (Static Compression)</h4>
        <p>
          Assets are compressed at build time and served as static files:
        </p>
        <ul className="space-y-1">
          <li>• Build process generates .gz and .br versions of assets</li>
          <li>• Server configured to serve pre-compressed files</li>
          <li>• Server checks Accept-Encoding and serves appropriate version</li>
          <li>• No compression CPU cost during request handling</li>
        </ul>
        <p>
          <strong>Pros:</strong> Zero runtime CPU cost, can use maximum compression levels, fastest 
          response times.
        </p>
        <p>
          <strong>Cons:</strong> Requires build-step changes, more disk space (multiple versions of 
          each file), cache invalidation on updates.
        </p>
        <p>
          <strong>Best for:</strong> Static assets (JavaScript bundles, CSS files, fonts) that don&apos;t 
          change frequently.
        </p>

        <h3>Server Configuration Patterns</h3>
        <p>
          Different servers handle compression differently:
        </p>

        <h4>Nginx</h4>
        <p>
          Nginx supports both Gzip and Brotli (with module):
        </p>
        <ul className="space-y-1">
          <li>• <code>gzip on;</code> enables Gzip compression</li>
          <li>• <code>brotli on;</code> enables Brotli (requires ngx_brotli module)</li>
          <li>• <code>gzip_static on;</code> serves pre-compressed .gz files if they exist</li>
          <li>• <code>brotli_static on;</code> serves pre-compressed .br files if they exist</li>
        </ul>

        <h4>Apache</h4>
        <p>
          Apache uses mod_deflate for Gzip and mod_brotli for Brotli:
        </p>
        <ul className="space-y-1">
          <li>• <code>AddOutputFilterByType DEFLATE</code> enables Gzip</li>
          <li>• <code>AddOutputFilterByType BROTLI_COMPRESS</code> enables Brotli</li>
          <li>• mod_headers for setting Vary header</li>
        </ul>

        <h4>Node.js (Express)</h4>
        <p>
          Express uses middleware for compression:
        </p>
        <ul className="space-y-1">
          <li>• <code>compression</code> package for Gzip</li>
          <li>• <code>shrink-ray-current</code> or <code>compression-brotli</code> for Brotli</li>
          <li>• Middleware automatically handles Accept-Encoding negotiation</li>
        </ul>

        <h4>CDNs (Cloudflare, Vercel, AWS CloudFront)</h4>
        <p>
          Most CDNs handle compression automatically:
        </p>
        <ul className="space-y-1">
          <li>• Cloudflare: Automatic Brotli for all text resources</li>
          <li>• Vercel: Automatic Brotli + Gzip for all deployments</li>
          <li>• AWS CloudFront: Compression enabled with configuration</li>
          <li>• Netlify: Automatic compression with build plugins</li>
        </ul>

        <h3>Compression Pipeline</h3>
        <p>
          A complete compression strategy involves multiple layers:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Build Time:</strong> Minify and pre-compress static assets with maximum compression 
            (Brotli level 11).
          </li>
          <li>
            <strong>Server Level:</strong> Configure dynamic compression for non-pre-compressed content 
            (Gzip level 6 or Brotli level 4-6).
          </li>
          <li>
            <strong>CDN Level:</strong> Enable CDN compression as a fallback layer.
          </li>
          <li>
            <strong>Cache Headers:</strong> Set appropriate cache headers to maximize cache hits for 
            compressed assets.
          </li>
        </ol>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>Gzip vs. Brotli Decision Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Scenario</th>
                <th className="p-3 text-left">Recommended</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Static JS/CSS bundles</td>
                <td className="p-3">Brotli level 11 (pre-compressed)</td>
                <td className="p-3">Best compression, one-time CPU cost</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Dynamic HTML</td>
                <td className="p-3">Brotli level 4-6 (dynamic)</td>
                <td className="p-3">Good compression, reasonable CPU</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">API responses (JSON)</td>
                <td className="p-3">Gzip level 6</td>
                <td className="p-3">Fast compression, JSON compresses well</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Legacy browser support</td>
                <td className="p-3">Gzip (fallback)</td>
                <td className="p-3">100% browser support</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">HTTP (non-HTTPS)</td>
                <td className="p-3">Gzip</td>
                <td className="p-3">Brotli only supported over HTTPS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Dynamic vs. Pre-Compression Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">Dynamic Compression</th>
                <th className="p-3 text-left">Pre-Compression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">CPU Cost</td>
                <td className="p-3">Per-request</td>
                <td className="p-3">Build-time only</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Response Time</td>
                <td className="p-3">Slower (compression latency)</td>
                <td className="p-3">Faster (serve static file)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Compression Level</td>
                <td className="p-3">Limited (4-6 for speed)</td>
                <td className="p-3">Maximum (level 11)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Disk Usage</td>
                <td className="p-3">Single file</td>
                <td className="p-3">Multiple versions (.gz, .br)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Dynamic content</td>
                <td className="p-3">Static assets</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When Compression Isn&apos;t Worth It</h3>
        <ul className="space-y-2">
          <li>
            <strong>Already-Compressed Formats:</strong> JPEG, PNG, WebP, AVIF, MP4, WebM, WOFF2 are 
            already compressed. Re-compressing adds CPU cost for 0-5% gain.
          </li>
          <li>
            <strong>Very Small Files (&lt;1KB):</strong> HTTP overhead dominates. Compression may 
            actually increase total size due to compression headers.
          </li>
          <li>
            <strong>Extremely Low CPU Servers:</strong> On severely CPU-constrained servers, the 
            compression overhead might impact other operations. Consider pre-compression or CDN 
            offloading.
          </li>
          <li>
            <strong>Internal Networks:</strong> For internal APIs on fast LANs, the latency benefit 
            may not justify CPU cost.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Enable Both Gzip and Brotli</h3>
        <p>
          Serve Brotli to supporting browsers, Gzip as fallback:
        </p>
        <ul className="space-y-1">
          <li>• Configure server to prefer Brotli when Accept-Encoding includes &quot;br&quot;</li>
          <li>• Fall back to Gzip for older browsers</li>
          <li>• Always include Vary: Accept-Encoding header</li>
        </ul>

        <h3>Pre-Compress Static Assets</h3>
        <p>
          For JavaScript and CSS bundles:
        </p>
        <ul className="space-y-1">
          <li>• Use CompressionPlugin (Webpack) or vite-plugin-compression</li>
          <li>• Compress at build time with Brotli level 11</li>
          <li>• Configure server to serve pre-compressed files with brotli_static</li>
          <li>• Use content-hashed filenames for cache-busting</li>
        </ul>

        <h3>Use Appropriate Compression Levels</h3>
        <p>
          Match compression level to use case:
        </p>
        <ul className="space-y-1">
          <li>• Dynamic content: Gzip level 6, Brotli level 4-6</li>
          <li>• Pre-compressed static: Brotli level 11</li>
          <li>• API responses: Gzip level 4-6 (faster response time)</li>
        </ul>

        <h3>Set Correct MIME Types</h3>
        <p>
          Only compress text-based MIME types:
        </p>
        <ul className="space-y-1">
          <li>• text/html, text/css, text/plain, text/xml</li>
          <li>• application/javascript, application/json</li>
          <li>• application/xml, image/svg+xml</li>
          <li>• font/woff, font/woff2 (WOFF2 is already compressed)</li>
        </ul>

        <h3>Include Vary Header</h3>
        <p>
          Always set <code>Vary: Accept-Encoding</code> to prevent caching issues:
        </p>
        <ul className="space-y-1">
          <li>• Without Vary, proxies may serve Brotli-compressed response to Gzip-only browsers</li>
          <li>• Ensures correct compressed version is served from cache</li>
        </ul>

        <h3>Set Proper Cache Headers</h3>
        <p>
          Compressed assets should be cached aggressively:
        </p>
        <ul className="space-y-1">
          <li>• <code>Cache-Control: public, max-age=31536000, immutable</code> for versioned assets</li>
          <li>• Use content-hashed filenames for cache-busting</li>
          <li>• CDN edge caching for global delivery</li>
        </ul>

        <h3>Verify Compression is Working</h3>
        <p>
          Regularly verify compression is active:
        </p>
        <ul className="space-y-1">
          <li>• Use <code>curl -I -H &quot;Accept-Encoding: gzip, br&quot;</code> to check headers</li>
          <li>• Check Content-Encoding header in response</li>
          <li>• Use Lighthouse or WebPageTest to verify compression</li>
          <li>• Monitor compression ratios in server logs</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Not Enabling Compression at All</h3>
        <p>
          Surprisingly common, especially on self-hosted servers. Without compression, JavaScript 
          bundles are 3-4x larger than necessary.
        </p>
        <p>
          <strong>Solution:</strong> Check with <code>curl -I -H &quot;Accept-Encoding: gzip, br&quot;</code>. 
          Verify Content-Encoding header is present.
        </p>

        <h3>Compressing Already-Compressed Formats</h3>
        <p>
          Gzipping JPEG, PNG, WOFF2, or video files wastes CPU for 0-5% gain.
        </p>
        <p>
          <strong>Solution:</strong> Configure server to only compress text-based MIME types.
        </p>

        <h3>Using High Brotli Levels for Dynamic Content</h3>
        <p>
          Brotli level 11 is extremely slow (seconds per file). Using it for dynamic content adds 
          significant latency.
        </p>
        <p>
          <strong>Solution:</strong> Use level 4-6 for dynamic content. Save level 11 for 
          pre-compressed static assets.
        </p>

        <h3>Missing Vary Header</h3>
        <p>
          Without <code>Vary: Accept-Encoding</code>, proxies may cache the wrong compressed version 
          and serve it to incompatible browsers.
        </p>
        <p>
          <strong>Solution:</strong> Always include <code>Vary: Accept-Encoding</code> in compressed 
          responses.
        </p>

        <h3>Not Pre-Compressing Static Assets</h3>
        <p>
          Serving dynamic compression for large JavaScript bundles wastes CPU on every request.
        </p>
        <p>
          <strong>Solution:</strong> Pre-compress at build time with Brotli level 11. Configure 
          server to serve pre-compressed files.
        </p>

        <h3>Compressing Small Files</h3>
        <p>
          Files under 1KB may actually increase in size after compression due to compression headers.
        </p>
        <p>
          <strong>Solution:</strong> Set minimum file size threshold (e.g., gzip_min_length 1000 in 
          Nginx).
        </p>

        <h3>Forgetting About HTTPS for Brotli</h3>
        <p>
          Brotli is only supported by browsers over HTTPS. Serving Brotli over HTTP falls back to 
          Gzip or no compression.
        </p>
        <p>
          <strong>Solution:</strong> Use HTTPS everywhere. Configure Gzip fallback for HTTP.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Site: Brotli Migration</h3>
        <p>
          An e-commerce site was serving Gzip-compressed JavaScript bundles (200KB compressed). 
          Mobile users on 3G experienced 2+ second load times for JavaScript alone.
        </p>
        <p>
          <strong>Solution:</strong> Implemented Brotli pre-compression at build time (level 11). 
          Bundles reduced to 150KB (25% improvement).
        </p>
        <p>
          <strong>Results:</strong> JavaScript load time decreased from 2.1s to 1.6s on 3G. Mobile 
          conversion rate increased 8%.
        </p>

        <h3>SaaS Platform: Dynamic Compression Optimization</h3>
        <p>
          A SaaS platform&apos;s API responses were uncompressed, averaging 50KB per response. High 
          API usage meant significant bandwidth costs.
        </p>
        <p>
          <strong>Solution:</strong> Enabled Gzip compression for JSON responses (level 6).
        </p>
        <p>
          <strong>Results:</strong> API response size reduced to 15KB (70% reduction). Bandwidth 
          costs decreased 60%. Response latency increased by only 5ms (negligible).
        </p>

        <h3>News Publisher: CDN Compression</h3>
        <p>
          A news publisher&apos;s self-hosted server had inconsistent compression — some assets 
          compressed, others not.
        </p>
        <p>
          <strong>Solution:</strong> Migrated to Cloudflare CDN with automatic Brotli compression.
        </p>
        <p>
          <strong>Results:</strong> All text assets compressed consistently. Page weight reduced 
          65%. Global load times improved (CDN edge locations + compression).
        </p>

        <h3>Web App: Pre-Compression Pipeline</h3>
        <p>
          A React application had 800KB of JavaScript (uncompressed). Dynamic Gzip compression 
          added 200-300ms server latency during high traffic.
        </p>
        <p>
          <strong>Solution:</strong> Implemented Webpack CompressionPlugin for pre-compression. 
          Server configured to serve pre-compressed files.
        </p>
        <p>
          <strong>Results:</strong> Server latency eliminated. JavaScript transfer size: 800KB → 
          220KB (Brotli). Page load time decreased 40%.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is HTTP compression and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HTTP compression reduces the size of text-based responses by compressing the response 
              body before sending. The browser automatically sends an Accept-Encoding header listing 
              supported algorithms (gzip, br), and the server responds with a Content-Encoding header 
              indicating which algorithm was used.
            </p>
            <p className="mb-3">
              The browser decompresses the response transparently before passing it to JavaScript or 
              rendering. This typically reduces transfer sizes by 60-85% for text assets.
            </p>
            <p>
              Gzip is the universal standard (100% support). Brotli is the modern alternative (15-25% 
              better compression, 97% support over HTTPS).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What's the difference between Gzip and Brotli?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Compression Ratio:</strong> Brotli provides 15-25% better compression than 
                Gzip. A 500KB file might be 150KB with Gzip but 120KB with Brotli.
              </li>
              <li>
                <strong>Browser Support:</strong> Gzip has 100% support. Brotli has 97% support but 
                only over HTTPS.
              </li>
              <li>
                <strong>Compression Speed:</strong> Gzip is fast at all compression levels. Brotli 
                is slower, especially at high levels (level 11 is very slow).
              </li>
              <li>
                <strong>Decompression Speed:</strong> Both are equally fast at decompression (client-side).
              </li>
              <li>
                <strong>Best Use:</strong> Gzip for dynamic content and legacy support. Brotli for 
                static assets and modern browsers.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When should you use pre-compression vs. dynamic compression?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Pre-Compression:</strong> Best for static assets (JavaScript bundles, CSS 
                files, fonts) that don&apos;t change frequently. Compress at build time with maximum 
                compression (Brotli level 11). Zero runtime CPU cost.
              </li>
              <li>
                <strong>Dynamic Compression:</strong> Best for dynamic content (HTML, API responses) 
                that changes per request. Use moderate compression levels (Gzip 6, Brotli 4-6) to 
                balance compression ratio with CPU cost.
              </li>
            </ul>
            <p>
              Production setups typically use both: pre-compression for static assets, dynamic 
              compression for everything else.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What file types should you compress?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Compress (70-85% reduction):</strong> JavaScript, CSS, HTML, JSON, XML, SVG, 
                fonts (WOFF, TTF), text files.
              </li>
              <li>
                <strong>Don&apos;t compress (already compressed):</strong> Images (JPEG, PNG, WebP, 
                AVIF), videos (MP4, WebM), WOFF2 fonts, archives (ZIP, GZIP). These formats are 
                already compressed — re-compressing adds CPU cost for 0-5% gain.
              </li>
              <li>
                <strong>Threshold:</strong> Only compress files larger than 1KB. Smaller files may 
                increase in size due to compression headers.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Why is the Vary: Accept-Encoding header important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The <code>Vary: Accept-Encoding</code> header tells caches (browser, proxy, CDN) that 
              the response varies based on the Accept-Encoding request header.
            </p>
            <p className="mb-3">
              Without Vary, a cache might store a Brotli-compressed response and serve it to a browser 
              that only supports Gzip — resulting in broken content. With Vary, the cache stores 
              separate versions for each Accept-Encoding value and serves the correct one.
            </p>
            <p>
              Always include <code>Vary: Accept-Encoding</code> when serving compressed content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you verify compression is working?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>curl:</strong> <code>curl -I -H &quot;Accept-Encoding: gzip, br&quot; https://example.com/bundle.js</code> 
                — check for Content-Encoding header in response.
              </li>
              <li>
                <strong>Chrome DevTools:</strong> Network tab shows &quot;encoded&quot; (compressed) 
                vs &quot;decoded&quot; (uncompressed) size. Content-Encoding header visible in 
                response headers.
              </li>
              <li>
                <strong>Lighthouse:</strong> Reports &quot;Enable text compression&quot; audit if 
                compression is missing.
              </li>
              <li>
                <strong>WebPageTest:</strong> Shows compression details in waterfall and response 
                headers.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Content-Encoding
            </a> — HTTP Content-Encoding header documentation.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Accept-Encoding
            </a> — HTTP Accept-Encoding header documentation.
          </li>
          <li>
            <a href="https://httpd.apache.org/docs/current/mod/mod_deflate.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apache mod_deflate
            </a> — Apache Gzip compression module.
          </li>
          <li>
            <a href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Nginx Gzip Module
            </a> — Nginx Gzip compression configuration.
          </li>
          <li>
            <a href="https://github.com/google/brotli" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Brotli GitHub Repository
            </a> — Official Brotli compression library.
          </li>
          <li>
            <a href="https://web.dev/http-cache/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — HTTP Cache
            </a> — Guide to HTTP caching and compression.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
