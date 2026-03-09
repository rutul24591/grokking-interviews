"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-request-response-concise",
  title: "Request/Response Lifecycle",
  description: "Quick walkthrough of the backend request/response lifecycle for interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "request-response-lifecycle",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "http", "lifecycle"],
  relatedTopics: ["http-https-protocol", "client-server-architecture", "networking-fundamentals"],
};

export default function RequestResponseLifecycleConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          The request/response lifecycle covers every step from DNS lookup and
          TCP connection to server processing and client rendering. Understanding
          the path helps debug latency and failures.
        </p>
        <p>
          Most performance issues are lifecycle issues: slow DNS, long TLS
          handshakes, overloaded databases, or oversized responses. Knowing the
          sequence gives you a map for debugging.
        </p>
      </section>

      <section>
        <h2>Key Steps</h2>
        <ol className="space-y-2">
          <li>DNS lookup</li>
          <li>TCP/TLS handshake</li>
          <li>HTTP request</li>
          <li>Server middleware and handlers</li>
          <li>Database/cache access</li>
          <li>HTTP response</li>
          <li>Connection reuse via keep-alive / pooling</li>
        </ol>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Request lifecycle (simplified)
Client -> DNS -> TCP/TLS -> HTTP -> App -> DB
DB -> App -> HTTP Response -> Client`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain where latency is added (network, compute, storage).</li>
          <li>Use metrics like TTFB and p99.</li>
          <li>Call out timeouts, retries, and circuit breakers.</li>
          <li>Mention tracing with correlation IDs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is TTFB?</p>
            <p className="mt-2 text-sm">A: Time to First Byte, measuring server + network latency.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where do you add caching?</p>
            <p className="mt-2 text-sm">A: At CDN, edge, and application layers to reduce load.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is connection pooling important?</p>
            <p className="mt-2 text-sm">
              A: It avoids repeated handshakes and improves throughput under load.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
