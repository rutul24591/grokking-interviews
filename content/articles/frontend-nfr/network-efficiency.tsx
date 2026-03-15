"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-network-efficiency",
  title: "Network Efficiency",
  description: "Comprehensive guide to optimizing network usage for web applications. Covers HTTP/2, HTTP/3, request batching, compression, and connection management.",
  category: "frontend",
  subcategory: "nfr",
  slug: "network-efficiency",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "network", "http2", "http3", "performance"],
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
        </div>
      </section>
    </ArticleLayout>
  );
}
