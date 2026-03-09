"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-compression-concise",
  title: "Compression (Gzip, Brotli)",
  description: "Quick overview of HTTP compression techniques including Gzip and Brotli for reducing transfer sizes.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "compression",
  version: "concise",
  wordCount: 2600,
  readingTime: 10,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "compression", "gzip", "brotli", "HTTP"],
  relatedTopics: ["minification-and-uglification", "bundle-size-optimization", "critical-css"],
};

export default function CompressionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>HTTP compression</strong> reduces the size of text-based responses (HTML, CSS, JavaScript, JSON,
          SVG) sent over the network. The server compresses the response body before sending it, and the browser
          decompresses it before processing. This typically reduces transfer sizes by <strong>60-85%</strong> with
          virtually no perceptible overhead.
        </p>
        <p>
          The two dominant algorithms are <strong>Gzip</strong> (universal support, good compression) and
          <strong>Brotli</strong> (15-25% better compression than Gzip, supported in all modern browsers over HTTPS).
          Enabling compression is one of the highest-ROI performance optimizations — a simple server configuration
          change that benefits every request.
        </p>
      </section>

      <section>
        <h2>How It Works</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// 1. Browser sends Accept-Encoding header with supported algorithms
GET /bundle.js HTTP/2
Accept-Encoding: gzip, deflate, br    // "br" = Brotli

// 2. Server compresses the response and indicates which algorithm was used
HTTP/2 200
Content-Encoding: br                   // Brotli was chosen
Content-Type: application/javascript
Content-Length: 45230                  // Compressed size (original: 180KB)

// 3. Browser decompresses transparently — your code never knows

// Without compression:  180 KB transferred → 180 KB
// With Gzip:            ~55 KB transferred → 180 KB (69% smaller)
// With Brotli:          ~45 KB transferred → 180 KB (75% smaller)`}</code>
        </pre>
      </section>

      <section>
        <h2>Gzip vs Brotli</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">Gzip</th>
              <th className="p-3 text-left">Brotli</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Compression ratio</strong></td>
              <td className="p-3">Good (60-75% reduction)</td>
              <td className="p-3">Better (70-85% reduction)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Browser support</strong></td>
              <td className="p-3">100%</td>
              <td className="p-3">~97% (HTTPS only)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Compression speed</strong></td>
              <td className="p-3">Fast at all levels</td>
              <td className="p-3">Slow at high quality (use for static assets)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Decompression speed</strong></td>
              <td className="p-3">Fast</td>
              <td className="p-3">Equally fast</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best for</strong></td>
              <td className="p-3">Dynamic responses, fallback</td>
              <td className="p-3">Static assets (pre-compressed at build time)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Compression levels</strong></td>
              <td className="p-3">1-9 (6 is default)</td>
              <td className="p-3">0-11 (11 is best but very slow)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Server Configuration</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Nginx ===
# Enable Gzip
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_comp_level 6;
gzip_types text/plain text/css application/json
           application/javascript text/xml application/xml
           application/xml+rss text/javascript image/svg+xml;

# Enable Brotli (requires ngx_brotli module)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json
             application/javascript text/xml application/xml
             application/xml+rss text/javascript image/svg+xml;

# Serve pre-compressed static files (best performance)
brotli_static on;  # Serves .br files if they exist
gzip_static on;    # Serves .gz files if they exist

// === Node.js Express ===
const compression = require('compression');
const shrinkRay = require('shrink-ray-current'); // Brotli support

// Gzip only
app.use(compression());

// Brotli + Gzip (prefers Brotli)
app.use(shrinkRay());

// === Next.js ===
// next.config.js
module.exports = {
  compress: true, // Gzip enabled by default
  // For Brotli, use a CDN (Vercel, Cloudflare) or custom server
};

// === CDN (Cloudflare, Vercel, AWS CloudFront) ===
// Most CDNs handle compression automatically
// Cloudflare: Brotli enabled by default for all text resources
// Vercel: Automatic Brotli + Gzip for all deployments`}</code>
        </pre>
      </section>

      <section>
        <h2>Pre-Compression at Build Time</h2>
        <p>
          For static assets, pre-compress at build time to avoid CPU cost on every request. Serve the
          pre-compressed files directly.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack CompressionPlugin ===
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  plugins: [
    // Gzip
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\\.(js|css|html|svg|json)$/,
      threshold: 1024,      // Only compress files > 1KB
      minRatio: 0.8,        // Only keep if 20%+ smaller
    }),
    // Brotli
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\\.(js|css|html|svg|json)$/,
      compressionOptions: {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      },
      threshold: 1024,
      minRatio: 0.8,
    }),
  ],
};

// Output: bundle.js, bundle.js.gz, bundle.js.br
// Nginx/CDN serves .br or .gz based on Accept-Encoding header

// === Vite (built-in via plugin) ===
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
  ],
});`}</code>
        </pre>
      </section>

      <section>
        <h2>What to Compress</h2>
        <ul className="space-y-2">
          <li>✅ <strong>JavaScript:</strong> Highest ROI — typically 70-80% reduction</li>
          <li>✅ <strong>CSS:</strong> 60-80% reduction</li>
          <li>✅ <strong>HTML:</strong> 60-75% reduction</li>
          <li>✅ <strong>JSON/XML:</strong> 70-90% reduction (very repetitive structure)</li>
          <li>✅ <strong>SVG:</strong> 50-70% reduction (text-based)</li>
          <li>❌ <strong>Images (JPEG, PNG, WebP):</strong> Already compressed — re-compressing adds CPU cost for 0-2% gain</li>
          <li>❌ <strong>Videos:</strong> Already compressed</li>
          <li>❌ <strong>Fonts (woff2):</strong> WOFF2 includes Brotli compression internally</li>
          <li>❌ <strong>Files {'<'} 1KB:</strong> HTTP overhead negates compression benefit</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Not enabling compression at all:</strong> Surprisingly common. Check with <code>curl -I -H
            "Accept-Encoding: gzip, br" https://yoursite.com/bundle.js</code> — verify <code>Content-Encoding</code> header.
          </li>
          <li>
            <strong>Compressing already-compressed formats:</strong> Gzipping JPEG/PNG/WOFF2 wastes CPU for no gain.
            Configure your server to only compress text-based content types.
          </li>
          <li>
            <strong>Using high Brotli levels for dynamic content:</strong> Brotli level 11 is extremely slow.
            Use level 4-6 for dynamic responses (API endpoints). Save level 11 for pre-compressed static files.
          </li>
          <li>
            <strong>Missing Vary header:</strong> Without <code>Vary: Accept-Encoding</code>, proxies may serve
            a Brotli-compressed response to a browser that only supports Gzip.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            HTTP compression reduces text-based transfer sizes by 60-85%. Brotli compresses 15-25% better than
            Gzip but is slower to compress (use pre-compression for static assets).
          </li>
          <li>
            The browser advertises supported algorithms via <code>Accept-Encoding</code>; the server responds
            with <code>Content-Encoding</code>. Decompression is transparent to JavaScript.
          </li>
          <li>
            Pre-compress static assets at build time (Brotli level 11) and serve via <code>brotli_static</code>
            in Nginx or CDN. Use dynamic Gzip/Brotli (level 4-6) for API responses.
          </li>
          <li>
            Don't compress already-compressed formats (images, videos, WOFF2). Only compress text-based content
            (JS, CSS, HTML, JSON, SVG) above 1KB.
          </li>
          <li>
            Most CDNs (Cloudflare, Vercel, CloudFront) handle compression automatically — the main risk is
            self-hosted servers without proper configuration.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
