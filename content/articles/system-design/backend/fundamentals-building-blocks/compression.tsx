"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-compression",
  title: "Compression",
  description: "Comprehensive guide to compression algorithms covering gzip, Brotli, LZ4, Snappy, HTTP content encoding, streaming compression, and production trade-offs for backend systems.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "compression",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["backend", "compression", "gzip", "brotli", "performance", "bandwidth", "cpu-optimization"],
  relatedTopics: ["serialization-formats", "http-https-protocol", "caching-strategies", "cdn-strategies"],
};

export default function CompressionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Compression</strong> reduces payload size by encoding data more efficiently, trading CPU cycles for bandwidth savings. Compression algorithms identify and eliminate redundancy in data: repeated patterns are replaced with shorter representations, and statistical encoding assigns shorter codes to frequent symbols. The compression ratio (original size / compressed size) determines bandwidth savings, while compression/decompression speed determines CPU cost and latency impact.
        </p>
        <p>
          For backend engineers, compression is a daily operational decision with significant cost and performance implications. Uncompressed APIs waste bandwidth (increasing egress costs and latency for slow networks), but over-compression wastes CPU (increasing server costs and tail latency). The optimal strategy depends on payload characteristics (text compresses well, binary media does not), bottleneck location (bandwidth-bound vs CPU-bound), and client capabilities (mobile networks benefit more than datacenter networks).
        </p>
        <p>
          The key insight is that compression is not a default choice — it is a trade-off that must be evaluated per workload. Text payloads (JSON, HTML, CSS) compress 70-90% with gzip, making compression almost always beneficial. Binary media (JPEG, PNG, MP4) are already compressed, so HTTP compression wastes CPU and can even increase size. For APIs, compress responses above a size threshold (1-10KB) where bandwidth savings exceed CPU cost. For internal services, consider uncompressed binary protocols (Protobuf) that avoid compression overhead entirely.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Compression encompasses several interconnected concepts that govern how data is encoded, transmitted, and decoded across systems.
        </p>
        <ul>
          <li>
            <strong>Compression Algorithms:</strong> Different algorithms optimize for different goals. <strong>gzip</strong> (DEFLATE algorithm) is the universal standard — widely supported, moderate compression ratio (70-90% for text), moderate speed. <strong>Brotli</strong> (Google) offers better compression (15-25% better than gzip) but slower compression speed — ideal for static assets compressed offline. <strong>LZ4</strong> and <strong>Snappy</strong> prioritize speed over ratio — ideal for real-time compression where latency matters more than bandwidth. <strong>Zstandard</strong> (Facebook) offers a tunable trade-off between gzip and LZ4 — increasingly popular for log compression and internal services.
          </li>
          <li>
            <strong>Compression Levels:</strong> Most algorithms offer levels (1-9 for gzip, 0-11 for Brotli) that trade CPU for compression ratio. Level 1 is fastest (lowest ratio), level 9/11 is slowest (best ratio). For dynamic compression (API responses), use moderate levels (gzip 4-6, Brotli 4-5) that balance CPU and ratio. For static compression (assets compressed offline), use maximum levels (gzip 9, Brotli 11) because compression happens once and serves millions of requests.
          </li>
          <li>
            <strong>HTTP Content Encoding:</strong> HTTP uses the <code>Content-Encoding</code> header to indicate compression (gzip, br, deflate). Clients advertise supported encodings via <code>Accept-Encoding</code> header (e.g., <code>Accept-Encoding: gzip, deflate, br</code>). Servers select the best mutually supported encoding. CDNs and reverse proxies can compress on behalf of origin servers, but origin must set <code>Vary: Accept-Encoding</code> to prevent cache poisoning (serving compressed response to client that doesn't support it).
          </li>
          <li>
            <strong>Streaming vs Buffered Compression:</strong> Streaming compression processes data incrementally, emitting compressed bytes as input arrives. This reduces time-to-first-byte (TTFB) because the server can start sending before the entire response is compressed. Buffered compression compresses the entire payload before sending any bytes. This achieves slightly better ratio (compressor sees entire dataset) but increases TTFB. For large responses or event streams, use streaming. For small responses, buffered is fine.
          </li>
          <li>
            <strong>Compression and Caching:</strong> Compressed responses are cached separately by encoding variant. A CDN caches gzip and Brotli versions separately. If origin serves both compressed and uncompressed responses without <code>Vary: Accept-Encoding</code>, the CDN may serve compressed response to clients that don't support compression (cache poisoning). Always set <code>Vary: Accept-Encoding</code> when compression is conditional on client capabilities.
          </li>
          <li>
            <strong>Security Considerations (BREACH):</strong> Compression can leak secrets through side-channel attacks. The BREACH attack exploits compression ratio to infer secret values (CSRF tokens, session IDs) by measuring compressed response size while varying attacker-controlled input. Mitigation: disable compression for responses containing secrets alongside user input, use random padding to obscure compression ratio, or separate secrets into uncompressed responses. For most APIs, the risk is low (BREACH requires specific conditions), but be aware for sensitive endpoints.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/compression-pipeline-full.svg"
          alt="Compression Pipeline Diagram"
          caption="Compression pipeline: original data (10KB) → compressor → compressed data (3KB, 70% smaller) → transmission → decompressor → original data"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding how compression flows through system architecture is essential for optimizing bandwidth and CPU usage. A typical response traverses multiple layers, each with potential compression opportunities.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/compression-algorithms-comparison.svg"
          alt="Compression Algorithm Comparison Diagram"
          caption="Compression algorithms compared: gzip (balanced), Brotli (best ratio, slowest), LZ4/Snappy (fastest, lower ratio)"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Compression Flow Through System Layers</h3>
          <ol className="space-y-3">
            <li>
              <strong>Application Layer:</strong> Application generates response (JSON, HTML, binary). Compression can happen here (application compresses before sending) or delegated to lower layers.
            </li>
            <li>
              <strong>Web Server / Reverse Proxy:</strong> NGINX, Apache, or Envoy can compress responses on behalf of application. This offloads CPU from application and enables compression for static assets. Configure compression levels and content type filters at this layer.
            </li>
            <li>
              <strong>CDN Edge:</strong> CDNs (CloudFront, Cloudflare, Akamai) can compress at edge locations. This reduces origin bandwidth and serves compressed responses from edge cache. CDN compression is ideal for static assets (pre-compressed and cached at edge).
            </li>
            <li>
              <strong>Client:</strong> Client advertises supported encodings via <code>Accept-Encoding</code> header. Client decompresses response using specified encoding. Mobile clients benefit most from compression (slow networks, data caps).
            </li>
          </ol>
        </div>

        <p>
          <strong>Compression Decision Flow:</strong> Compression should be conditional based on payload characteristics and client capabilities. Decision flow: (1) Check <code>Accept-Encoding</code> header — if client doesn't support compression, skip. (2) Check content type — compress text/*, application/json, application/xml; skip image/*, video/*, application/zip. (3) Check payload size — skip compression for small payloads (&lt;1KB) where CPU cost exceeds bandwidth savings. (4) Check CPU load — skip compression during CPU saturation (use circuit breaker pattern). (5) Compress with appropriate algorithm and level based on payload type and server capacity.
        </p>

        <p>
          <strong>Streaming Compression Flow:</strong> For large responses or event streams, use streaming compression. Flow: (1) Initialize compressor with chosen algorithm and level. (2) As application generates response chunks, feed each chunk to compressor. (3) Compressor emits compressed bytes immediately. (4) Send compressed bytes to client as they arrive. (5) Finalize compressor when response is complete. Streaming reduces TTFB because first compressed bytes are sent before entire response is generated.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Algorithm</th>
              <th className="p-3 text-left">Compression Ratio</th>
              <th className="p-3 text-left">Compression Speed</th>
              <th className="p-3 text-left">Decompression Speed</th>
              <th className="p-3 text-left">Use Cases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>gzip (DEFLATE)</strong>
              </td>
              <td className="p-3">
                70-90% for text
                <br />
                Moderate ratio
                <br />
                Universal support
              </td>
              <td className="p-3">
                Moderate (~100 MB/s)
                <br />
                Acceptable for dynamic compression
                <br />
                CPU cost measurable but acceptable
              </td>
              <td className="p-3">
                Fast (~500 MB/s)
                <br />
                Negligible client-side cost
                <br />
                All clients support gzip decompression
              </td>
              <td className="p-3">
                API responses (dynamic)
                <br />
                HTML, CSS, JS (static)
                <br />
                Default choice for most workloads
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Brotli (br)</strong>
              </td>
              <td className="p-3">
                80-95% for text
                <br />
                15-25% better than gzip
                <br />
                Best for text-heavy content
              </td>
              <td className="p-3">
                Slow (~10 MB/s at level 11)
                <br />
                Too slow for dynamic compression
                <br />
                Use levels 4-5 for dynamic
              </td>
              <td className="p-3">
                Moderate (~100 MB/s)
                <br />
                Acceptable for modern clients
                <br />
                Not supported in very old browsers
              </td>
              <td className="p-3">
                Static assets (pre-compressed offline)
                <br />
                CDN-delivered content
                <br />
                Mobile-first applications
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>LZ4</strong>
              </td>
              <td className="p-3">
                50-70% for text
                <br />
                Lower ratio than gzip
                <br />
                Prioritizes speed over ratio
              </td>
              <td className="p-3">
                Very fast (~500 MB/s)
                <br />
                Negligible CPU cost
                <br />
                Ideal for real-time compression
              </td>
              <td className="p-3">
                Very fast (~1500 MB/s)
                <br />
                Fastest decompression
                <br />
                Minimal client-side cost
              </td>
              <td className="p-3">
                Internal services (low-latency RPC)
                <br />
                Log compression
                <br />
                Real-time streaming
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Snappy</strong>
              </td>
              <td className="p-3">
                50-70% for text
                <br />
                Similar to LZ4
                <br />
                Google's internal standard
              </td>
              <td className="p-3">
                Very fast (~400 MB/s)
                <br />
                Negligible CPU cost
                <br />
                Designed for speed
              </td>
              <td className="p-3">
                Very fast (~1000 MB/s)
                <br />
                Minimal client-side cost
                <br />
                Widely supported in Java/Go
              </td>
              <td className="p-3">
                Bigtable, Cassandra (database compression)
                <br />
                RPC frameworks (gRPC supports Snappy)
                <br />
                Log aggregation pipelines
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Zstandard (zstd)</strong>
              </td>
              <td className="p-3">
                70-90% for text
                <br />
                Similar to gzip
                <br />
                Tunable trade-off
              </td>
              <td className="p-3">
                Fast (~200 MB/s at level 3)
                <br />
                Faster than gzip at same ratio
                <br />
                Tunable via levels
              </td>
              <td className="p-3">
                Fast (~500 MB/s)
                <br />
                Similar to gzip
                <br />
                Growing client support
              </td>
              <td className="p-3">
                Log compression (increasingly popular)
                <br />
                Internal services
                <br />
                Archive compression
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When to Use Each Algorithm</h3>
          <p>
            <strong>Use gzip when:</strong> you need universal compatibility (all clients support gzip), compressing dynamic API responses, or balancing CPU and bandwidth costs. Gzip is the safe default for most workloads.
          </p>
          <p className="mt-3">
            <strong>Use Brotli when:</strong> compressing static assets offline (HTML, CSS, JS), serving via CDN, or optimizing for mobile clients (bandwidth-constrained networks). Pre-compress at maximum level (11) and cache at edge.
          </p>
          <p className="mt-3">
            <strong>Use LZ4/Snappy when:</strong> latency matters more than bandwidth (internal RPC, real-time streaming), compressing logs (high throughput, low CPU budget), or bandwidth is cheap (datacenter networks). Prioritize speed over ratio.
          </p>
          <p className="mt-3">
            <strong>Use Zstandard when:</strong> you want gzip-like ratio with better speed, compressing logs (increasingly popular), or need tunable trade-offs. Zstandard is gaining traction for internal services and log pipelines.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Production compression requires discipline and operational rigor. These best practices prevent common mistakes and accelerate incident response.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Compress Text, Skip Binary:</strong> Compress text formats (JSON, HTML, CSS, XML, plain text) which compress 70-90%. Skip already-compressed binary media (JPEG, PNG, MP4, ZIP) which waste CPU and can increase size. Configure content type filters at web server or application layer: compress <code>text/*</code>, <code>application/json</code>, <code>application/xml</code>; skip <code>image/*</code>, <code>video/*</code>, <code>application/zip</code>.
          </li>
          <li>
            <strong>Use Size Thresholds:</strong> Skip compression for small payloads (&lt;1KB) where CPU cost exceeds bandwidth savings. Compression has fixed overhead (header, dictionary initialization) that dominates for small payloads. Configure minimum size threshold (1-10KB depending on algorithm). For APIs, measure actual payload sizes and set threshold where compression becomes beneficial.
          </li>
          <li>
            <strong>Set Vary: Accept-Encoding:</strong> Always set <code>Vary: Accept-Encoding</code> header when compression is conditional on client capabilities. This tells CDNs and caches to store separate variants for each encoding (gzip, br, uncompressed). Without <code>Vary</code>, caches may serve compressed response to clients that don't support compression (cache poisoning).
          </li>
          <li>
            <strong>Pre-compress Static Assets:</strong> For static assets (HTML, CSS, JS), pre-compress offline at maximum compression level (gzip 9, Brotli 11). Serve pre-compressed files directly from disk or CDN. This eliminates runtime CPU cost and achieves best compression ratio. Configure web server to serve <code>.gz</code> or <code>.br</code> files based on <code>Accept-Encoding</code>.
          </li>
          <li>
            <strong>Monitor Compression Metrics:</strong> Track compression ratio (original size / compressed size), CPU cost (compression time per request), and bandwidth savings. Alert when ratio drops (compressing incompressible content) or CPU cost spikes (algorithm misconfiguration). Use metrics to tune compression levels and thresholds.
          </li>
          <li>
            <strong>Disable Compression for Sensitive Endpoints:</strong> For endpoints that mix secrets (CSRF tokens, session IDs) with user-controlled input, disable compression to mitigate BREACH-style attacks. Alternatively, use random padding to obscure compression ratio, or separate secrets into uncompressed responses. For most APIs, BREACH risk is low, but be aware for sensitive endpoints.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Even experienced engineers fall into compression traps. These pitfalls are common sources of wasted CPU, increased latency, and security vulnerabilities.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Compressing Already-Compressed Data:</strong> JPEG, PNG, MP4, and ZIP files are already compressed. Applying gzip to these formats wastes CPU and can increase size (gzip header overhead exceeds any savings). Prevention: configure content type filters to skip <code>image/*</code>, <code>video/*</code>, <code>application/zip</code>. Measure actual compression ratio — if ratio is &lt;5%, skip compression for that content type.
          </li>
          <li>
            <strong>Missing Vary: Accept-Encoding:</strong> Serving compressed responses without <code>Vary: Accept-Encoding</code> causes cache poisoning. CDN caches compressed response and serves it to clients that don't support compression. Prevention: always set <code>Vary: Accept-Encoding</code> when compression is conditional. Test cache behavior with different <code>Accept-Encoding</code> values.
          </li>
          <li>
            <strong>Using Maximum Compression Levels for Dynamic Content:</strong> Brotli level 11 or gzip level 9 are too slow for dynamic compression. Level 11 Brotli can take 100ms+ for 100KB payloads, dominating response latency. Prevention: use moderate levels (gzip 4-6, Brotli 4-5) for dynamic compression. Reserve maximum levels for offline pre-compression.
          </li>
          <li>
            <strong>Double Compression:</strong> Compressing at application layer and again at CDN/proxy layer wastes CPU and can corrupt content. Prevention: coordinate compression across layers. If CDN compresses, disable application compression. Use <code>Content-Encoding</code> header to indicate already-compressed content.
          </li>
          <li>
            <strong>Ignoring Decompression Bombs:</strong> Accepting compressed uploads without size limits allows attackers to send tiny payloads that expand to gigabytes when decompressed (decompression bomb). Prevention: enforce maximum decompressed size limits, validate <code>Content-Encoding</code> header, apply timeouts to decompression operations.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/content-type-compressibility.svg"
          alt="Content-Type Compressibility Diagram"
          caption="Content types by compressibility: text formats compress 70-90% (compress these), binary media compress 0-5% (skip these)"
        />
      </section>

      <section>
        <h2>Production Case Studies</h2>
        <p>
          Real-world compression incidents demonstrate how theoretical patterns manifest in production and how systematic debugging accelerates resolution.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 1: Brotli Level 11 Latency Spike</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> API p99 latency spikes from 100ms to 500ms after enabling Brotli compression. Affects 5% of requests (large payloads).
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> Tracing showed compression time dominating response time for payloads &gt;100KB. Brotli level was set to 11 (maximum). Compression time for 100KB payload was 150ms at level 11 vs 15ms at level 5.
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> Brotli level 11 is designed for offline pre-compression, not dynamic compression. At level 11, Brotli uses maximum dictionary size and most aggressive pattern matching, which is CPU-intensive.
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Reduced Brotli level from 11 to 5 for dynamic compression. p99 latency dropped from 500ms to 120ms. Compression ratio decreased from 85% to 78%, but bandwidth impact was negligible compared to latency improvement.
          </p>
          <p>
            <strong>Lesson:</strong> Use moderate compression levels (gzip 4-6, Brotli 4-5) for dynamic compression. Reserve maximum levels for offline pre-compression where CPU cost is amortized over millions of requests.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 2: Cache Poisoning from Missing Vary Header</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> Mobile app users report "invalid response" errors. Server logs show clients receiving gzip-compressed responses but expecting uncompressed JSON.
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> CDN cache inspection showed only gzip variant was cached. Mobile app did not send <code>Accept-Encoding</code> header (bug in app), but received cached gzip response.
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> Origin server did not set <code>Vary: Accept-Encoding</code> header. CDN cached gzip response and served it to all clients, including those that didn't request compression.
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Added <code>Vary: Accept-Encoding</code> header to all responses. Purged CDN cache. Mobile app fixed to send <code>Accept-Encoding</code> header. Error rate dropped to zero within 1 hour.
          </p>
          <p>
            <strong>Lesson:</strong> Always set <code>Vary: Accept-Encoding</code> when compression is conditional. Test cache behavior with different <code>Accept-Encoding</code> values. Monitor cache hit ratio by encoding variant.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 3: Compression Wasting CPU on Binary Data</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> Server CPU utilization spikes to 90% during peak traffic. Compression metrics show 40% of compression CPU spent on image responses.
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> Compression configuration showed all content types were compressed, including <code>image/jpeg</code> and <code>image/png</code>. Compression ratio for images was 2-3% (negligible savings).
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> JPEG and PNG are already compressed formats. Applying gzip to these formats wastes CPU and provides negligible bandwidth savings. Configuration was overly broad (compress all responses).
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Updated compression configuration to skip <code>image/*</code>, <code>video/*</code>, <code>application/zip</code>. CPU utilization dropped from 90% to 60%. Bandwidth impact was negligible (images were already small).
          </p>
          <p>
            <strong>Lesson:</strong> Compress only compressible content (text formats). Skip already-compressed binary media. Monitor compression ratio by content type — if ratio is &lt;5%, skip compression for that type.
          </p>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Understanding compression performance characteristics helps set realistic SLOs and identify bottlenecks.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Compression Algorithm Performance (100KB Text Payload)</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Algorithm</th>
                <th className="p-2 text-left">Level</th>
                <th className="p-2 text-left">Compression Ratio</th>
                <th className="p-2 text-left">Compression Time</th>
                <th className="p-2 text-left">Decompression Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">gzip</td>
                <td className="p-2">1 (fastest)</td>
                <td className="p-2">65%</td>
                <td className="p-2">5ms</td>
                <td className="p-2">10ms</td>
              </tr>
              <tr>
                <td className="p-2">gzip</td>
                <td className="p-2">6 (default)</td>
                <td className="p-2">75%</td>
                <td className="p-2">15ms</td>
                <td className="p-2">10ms</td>
              </tr>
              <tr>
                <td className="p-2">gzip</td>
                <td className="p-2">9 (maximum)</td>
                <td className="p-2">80%</td>
                <td className="p-2">50ms</td>
                <td className="p-2">10ms</td>
              </tr>
              <tr>
                <td className="p-2">Brotli</td>
                <td className="p-2">4 (moderate)</td>
                <td className="p-2">80%</td>
                <td className="p-2">20ms</td>
                <td className="p-2">15ms</td>
              </tr>
              <tr>
                <td className="p-2">Brotli</td>
                <td className="p-2">11 (maximum)</td>
                <td className="p-2">88%</td>
                <td className="p-2">150ms</td>
                <td className="p-2">15ms</td>
              </tr>
              <tr>
                <td className="p-2">LZ4</td>
                <td className="p-2">1 (default)</td>
                <td className="p-2">60%</td>
                <td className="p-2">2ms</td>
                <td className="p-2">5ms</td>
              </tr>
              <tr>
                <td className="p-2">Snappy</td>
                <td className="p-2">1 (default)</td>
                <td className="p-2">58%</td>
                <td className="p-2">3ms</td>
                <td className="p-2">6ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Compression Ratio by Content Type</h3>
          <ul className="space-y-2">
            <li>
              <strong>JSON APIs:</strong> 70-85% compression ratio (gzip level 6). Large responses (&gt;10KB) benefit most.
            </li>
            <li>
              <strong>HTML/CSS/JS:</strong> 75-90% compression ratio (Brotli level 11 for static). Pre-compression essential.
            </li>
            <li>
              <strong>Plain Text:</strong> 70-85% compression ratio. Highly compressible.
            </li>
            <li>
              <strong>JPEG/PNG:</strong> 0-5% compression ratio. Already compressed — skip HTTP compression.
            </li>
            <li>
              <strong>MP4/WebM:</strong> 0-2% compression ratio. Already compressed — skip HTTP compression.
            </li>
            <li>
              <strong>Encrypted Data:</strong> 0% compression ratio. Encrypted data is incompressible — skip compression.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Compression decisions directly impact infrastructure costs. Understanding cost drivers helps optimize architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Bandwidth vs CPU Trade-offs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Bandwidth Savings:</strong> Compression reduces egress costs. For 1TB/month egress at $0.09/GB, 75% compression saves ~$67/month. For high-traffic services (100TB+/month), savings are significant ($6,700+/month).
            </li>
            <li>
              <strong>CPU Cost:</strong> Compression consumes CPU cycles. At $0.05/hour per vCPU, compressing 1M requests/day at 10ms/request costs ~$0.36/day in CPU time. For high-traffic services, CPU cost can exceed bandwidth savings.
            </li>
            <li>
              <strong>Break-even Point:</strong> Compression is beneficial when bandwidth savings exceed CPU cost. For small payloads (&lt;1KB), CPU cost dominates — skip compression. For large payloads (&gt;10KB), bandwidth savings dominate — compress aggressively.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">CDN Compression Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Origin Shield:</strong> CDN compression reduces origin egress (cost savings). Origin serves compressed response once, CDN caches and serves to millions of clients.
            </li>
            <li>
              <strong>Edge Compression:</strong> Some CDNs compress at edge (Cloudflare, Akamai). This offloads CPU from origin but may add latency (edge compression time).
            </li>
            <li>
              <strong>Recommendation:</strong> Pre-compress static assets and upload to CDN. Use origin compression only for dynamic responses. Monitor CDN cache hit ratio by encoding variant.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you avoid compression?</p>
            <p className="mt-2 text-sm">
              A: Avoid compression when: payloads are small (&lt;1KB) where CPU cost exceeds bandwidth savings, content is already compressed (JPEG, PNG, MP4, encrypted data), server is CPU-bound (compression would worsen tail latency), or latency is critical (real-time systems where every millisecond counts). For APIs, measure actual payload sizes and compression ratios to determine break-even points.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use Brotli over gzip?</p>
            <p className="mt-2 text-sm">
              A: Brotli offers 15-25% better compression ratio than gzip for text content, reducing bandwidth by an additional 15-25%. This is significant for mobile clients (slow networks, data caps) and high-traffic services (bandwidth cost savings). However, Brotli compression is slower than gzip, so use moderate levels (4-5) for dynamic compression and maximum level (11) only for offline pre-compression of static assets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is Accept-Encoding?</p>
            <p className="mt-2 text-sm">
              A: <code>Accept-Encoding</code> is an HTTP request header that lists compression formats the client supports (e.g., <code>Accept-Encoding: gzip, deflate, br</code>). Servers use this header to select the best mutually supported encoding. If client doesn't send <code>Accept-Encoding</code>, assume no compression support. Always set <code>Vary: Accept-Encoding</code> in responses to prevent cache poisoning.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose compression levels?</p>
            <p className="mt-2 text-sm">
              A: For dynamic compression (API responses), use moderate levels (gzip 4-6, Brotli 4-5) that balance CPU and ratio. For static compression (assets compressed offline), use maximum levels (gzip 9, Brotli 11) because compression happens once and serves millions of requests. Measure compression time and ratio at different levels to find optimal point for your workload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the BREACH attack and how do you mitigate it?</p>
            <p className="mt-2 text-sm">
              A: BREACH is a side-channel attack that exploits compression ratio to infer secret values (CSRF tokens, session IDs) by measuring compressed response size while varying attacker-controlled input. Mitigation: disable compression for responses containing secrets alongside user input, use random padding to obscure compression ratio, separate secrets into uncompressed responses, or use HTTP/2 where BREACH is harder to exploit. For most APIs, BREACH risk is low, but be aware for sensitive endpoints.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle compression for streaming responses?</p>
            <p className="mt-2 text-sm">
              A: Use streaming compression (not buffered) for streaming responses. Initialize compressor, feed chunks incrementally, emit compressed bytes immediately. This reduces time-to-first-byte because first compressed bytes are sent before entire response is generated. For Server-Sent Events (SSE) or WebSocket messages, compress each message independently. For large file downloads, use chunked transfer encoding with streaming compression.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://httpwg.org/specs/rfc9110.html#http.compression"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTTP/1.1 Specification - Content Encoding
            </a>
          </li>
          <li>
            <a
              href="https://github.com/google/brotli"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brotli Compression Algorithm - GitHub Repository
            </a>
          </li>
          <li>
            <a
              href="https://github.com/lz4/lz4"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LZ4 Compression - GitHub Repository
            </a>
          </li>
          <li>
            <a
              href="https://github.com/google/snappy"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Snappy Compression - GitHub Repository
            </a>
          </li>
          <li>
            <a
              href="https://www.fastly.com/blog/brotli-h2-push-improved-http-compression"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fastly Blog - Brotli and HTTP/2 Push
            </a>
          </li>
          <li>
            <a
              href="https://blog.cloudflare.com/this-is-brotli-from-origin/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Blog - This is Brotli from Origin
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
