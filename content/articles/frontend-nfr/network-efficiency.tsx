"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-network-efficiency",
  title: "Network Efficiency",
  description: "Comprehensive guide to optimizing network usage for web applications. Covers HTTP/2, HTTP/3, request batching, compression, connection management, and resource hints.",
  category: "frontend",
  subcategory: "nfr",
  slug: "network-efficiency",
  version: "extensive",
  wordCount: 13500,
  readingTime: 54,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "network", "http2", "http3", "performance", "compression", "resource-hints"],
  relatedTopics: ["page-load-performance", "client-edge-caching", "offline-support"],
};

export default function NetworkEfficiencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Network Efficiency</strong> measures how effectively an application uses network resources.
          It encompasses protocol selection, request optimization, compression, and connection management.
        </p>
        <p>
          Network efficiency directly impacts:
        </p>
        <ul>
          <li><strong>Load time:</strong> Fewer/faster requests = faster pages</li>
          <li><strong>Data usage:</strong> Critical for mobile users on limited plans</li>
          <li><strong>Battery life:</strong> Network radio is a major battery drain</li>
          <li><strong>Cost:</strong> Reduced bandwidth = lower infrastructure costs</li>
        </ul>
      </section>

      <section>
        <h2>HTTP/2 & HTTP/3</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/http-protocols-comparison.svg"
          alt="HTTP Protocols Comparison"
          caption="HTTP/1.1 vs HTTP/2 vs HTTP/3 — showing multiplexing, head-of-line blocking, and connection efficiency"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/2 Features</h3>
        <ul>
          <li><strong>Multiplexing:</strong> Multiple requests over single connection</li>
          <li><strong>Header compression:</strong> HPACK reduces overhead</li>
          <li><strong>Server push:</strong> Proactively send resources</li>
          <li><strong>Stream prioritization:</strong> Important resources first</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/3 (QUIC)</h3>
        <ul>
          <li><strong>UDP-based:</strong> No TCP head-of-line blocking</li>
          <li><strong>Faster handshakes:</strong> 0-RTT for repeat connections</li>
          <li><strong>Built-in encryption:</strong> TLS 1.3 mandatory</li>
          <li><strong>Connection migration:</strong> Survives network changes</li>
        </ul>
      </section>

      <section>
        <h2>Request Optimization</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/request-optimization.svg"
          alt="Request Optimization Techniques"
          caption="Network request optimization — batching, deduplication, compression, and connection reuse"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Request Batching</h3>
        <p>
          Combine multiple requests into one:
        </p>
        <ul>
          <li>GraphQL naturally batches queries</li>
          <li>REST: <code>POST /batch</code> with array of requests</li>
          <li>Reduce round-trips, not total data</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Request Deduplication</h3>
        <p>
          Avoid duplicate in-flight requests:
        </p>
        <ul>
          <li>Cache pending promises</li>
          <li>Return same promise for duplicate requests</li>
          <li>Libraries: React Query, SWR handle this</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connection Reuse</h3>
        <p>
          Maximize keep-alive:
        </p>
        <ul>
          <li>Use <code>Connection: keep-alive</code></li>
          <li>Limit concurrent connections (browser limit: 6/host)</li>
          <li>Use same origin when possible</li>
        </ul>
      </section>

      <section>
        <h2>Compression</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Algorithm</th>
              <th className="p-3 text-left">Ratio</th>
              <th className="p-3 text-left">Speed</th>
              <th className="p-3 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Gzip</td>
              <td className="p-3">70-80%</td>
              <td className="p-3">Fast</td>
              <td className="p-3">Universal support</td>
            </tr>
            <tr>
              <td className="p-3">Brotli</td>
              <td className="p-3">80-90%</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Modern browsers</td>
            </tr>
            <tr>
              <td className="p-3">Zstandard</td>
              <td className="p-3">80-90%</td>
              <td className="p-3">Fast</td>
              <td className="p-3">Emerging support</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Connection Management</h2>
        <p>
          Efficient connection management is critical for network efficiency. Each TCP connection carries
          overhead—handshakes, slow start, and buffer allocation. Proper management reduces latency and
          improves throughput.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TCP Connection Lifecycle</h3>
        <ul className="space-y-3">
          <li>
            <strong>3-Way Handshake:</strong> SYN → SYN-ACK → ACK (1.5 × RTT before any data sent)
          </li>
          <li>
            <strong>TLS Handshake:</strong> Additional 1-2 RTT for TLS 1.2, 0-1 RTT for TLS 1.3
          </li>
          <li>
            <strong>Slow Start:</strong> TCP begins with small congestion window, doubles each RTT until
            loss detected
          </li>
          <li>
            <strong>Connection Close:</strong> FIN → ACK (graceful close) or RST (abort)
          </li>
        </ul>
        <p>
          <strong>Total overhead:</strong> 2.5-3.5 RTT before first byte for HTTPS on TCP. This is why
          connection reuse is critical.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connection Reuse (Keep-Alive)</h3>
        <p>
          HTTP keep-alive allows multiple requests over a single TCP connection, amortizing handshake costs:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>HTTP/1.1:</strong> Keep-alive by default. Browser limit: 6-8 connections per origin.
            Idle timeout: typically 100-120 seconds.
          </li>
          <li>
            <strong>HTTP/2:</strong> Single connection multiplexes all requests. No per-request handshake.
            Idle timeout: typically 2-5 minutes.
          </li>
          <li>
            <strong>HTTP/3:</strong> Connection migration allows surviving network changes (WiFi → cellular)
            without new handshake.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>Use <code>Connection: keep-alive</code> header (HTTP/1.1)</li>
          <li>Set appropriate <code>keepaliveTimeout</code> on servers (match browser expectations)</li>
          <li>Consolidate assets under fewer origins to maximize reuse</li>
          <li>Avoid unnecessary redirects (each creates new connection)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connection Pooling</h3>
        <p>
          For server-to-server communication (API calls, microservices), connection pooling maintains a
          cache of reusable connections:
        </p>
        <ul className="space-y-2">
          <li><strong>Pool size:</strong> Typically 10-50 connections per target host</li>
          <li><strong>Idle timeout:</strong> Close unused connections after 30-60 seconds</li>
          <li><strong>Max lifetime:</strong> Force recreation after 5-10 minutes to handle server changes</li>
          <li><strong>Queue overflow:</strong> Queue requests when pool exhausted, or fail fast</li>
        </ul>
        <p>
          Node.js: Use <code>http.Agent</code> with <code>keepAlive: true</code>, <code>maxSockets: 50</code>.
          Fetch APIs: Use libraries like <code>undici</code> with built-in pooling.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Head-of-Line Blocking</h3>
        <p>
          A critical performance issue in HTTP/1.1:
        </p>
        <ul className="space-y-2">
          <li><strong>Problem:</strong> Responses must arrive in order. Slow response blocks all others.</li>
          <li><strong>Impact:</strong> One slow resource delays entire page load</li>
          <li><strong>Solution:</strong> HTTP/2 multiplexing (multiple streams on single connection)</li>
          <li><strong>HTTP/3:</strong> Eliminates TCP-level HOL blocking with QUIC</li>
        </ul>
      </section>

      <section>
        <h2>Resource Hints</h2>
        <p>
          Resource hints tell the browser to start work early—before the resource is discovered naturally
          during parsing. This can save 100-500ms per critical resource.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS Prefetch</h3>
        <p>
          Resolve DNS in advance. Saves 20-120ms per domain. Use:
          <code>{'<link rel="dns-prefetch" href="//cdn.example.com" />'}</code>
        </p>
        <p>
          <strong>Use when:</strong> You know you'll load resources from third-party domains (CDNs, fonts, analytics).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Preconnect</h3>
        <p>
          Full connection setup: DNS + TCP handshake + TLS negotiation. Saves 200-500ms. Use:
          <code>{'<link rel="preconnect" href="https://cdn.example.com" crossorigin />'}</code>
        </p>
        <p>
          <strong>Use when:</strong> You'll definitely load resources from this origin soon. Don't overuse—each
          preconnect consumes resources.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prefetch</h3>
        <p>
          Fetch resource and store in cache for future navigation. Use:
          <code>{'<link rel="prefetch" href="/next-page.js" />'}</code>
        </p>
        <p>
          <strong>Use when:</strong> User is likely to navigate to a specific page. Lower priority than preload.
          Fetches during idle time.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Preload</h3>
        <p>
          Fetch resource immediately for current page. Highest priority. Use:
          <code>{'<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin />'}</code>
          or
          <code>{'<link rel="preload" href="/hero-image.webp" as="image" fetchpriority="high" />'}</code>
        </p>
        <p>
          <strong>Use when:</strong> Resource is critical for current page. Common uses: hero images, web fonts,
          critical CSS/JS. Don't overuse—browser prioritizes preloads above other resources.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource Hint Decision Tree</h3>
        <ul className="space-y-2">
          <li><strong>Will use from this domain?</strong> → <code>preconnect</code></li>
          <li><strong>Will use this specific resource on current page?</strong> → <code>preload</code></li>
          <li><strong>Might navigate to page that uses this?</strong> → <code>prefetch</code></li>
          <li><strong>Just want DNS ready?</strong> → <code>dns-prefetch</code></li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/resource-hints-timeline.svg"
          alt="Resource Hints Timeline"
          caption="Resource hints timeline — showing when dns-prefetch, preconnect, preload, and prefetch fire relative to HTML parse and natural resource discovery"
        />
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the benefits of HTTP/2 over HTTP/1.1?</p>
            <p className="mt-2 text-sm">
              A: Multiplexing eliminates head-of-line blocking, header compression reduces overhead,
              server push enables proactive resource delivery, and stream prioritization optimizes
              resource loading. Single connection vs 6+ connections in HTTP/1.1.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use request batching?</p>
            <p className="mt-2 text-sm">
              A: When making multiple small requests in quick succession. Good for: loading related
              data, dashboard widgets, search suggestions. Not good for: large payloads, time-critical
              requests, or when responses vary significantly in size.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the cost of establishing a new HTTPS connection?</p>
            <p className="mt-2 text-sm">
              A: 3-way TCP handshake (1.5 RTT) + TLS handshake (1-2 RTT for TLS 1.2, 0-1 RTT for TLS 1.3).
              Total: 2.5-3.5 RTT before first byte. On a 100ms RTT connection, that&apos;s 250-350ms of
              pure overhead. This is why connection reuse (keep-alive) is critical.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between preload, prefetch, and preconnect?</p>
            <p className="mt-2 text-sm">
              A: <strong>Preload</strong> fetches a specific resource for the current page (highest priority).
              <strong>Prefetch</strong> fetches resources for likely future navigations (low priority, idle time).
              <strong>Preconnect</strong> sets up the connection (DNS+TCP+TLS) without fetching anything, saving
              200-500ms when the resource is later requested.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does HTTP/3 solve head-of-line blocking?</p>
            <p className="mt-2 text-sm">
              A: HTTP/3 uses QUIC over UDP instead of TCP. Each request/response is an independent stream.
              Packet loss on one stream doesn&apos;t block others. Also eliminates TCP slow start per-stream
              and enables connection migration (WiFi→cellular without new handshake).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
