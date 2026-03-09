"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-compression-concise",
  title: "Compression",
  description: "Quick overview of compression algorithms and trade-offs for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "compression",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "compression", "performance"],
  relatedTopics: ["serialization-formats", "http-https-protocol", "caching-performance"],
};

export default function CompressionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Compression reduces payload size at the cost of CPU. Common algorithms
          include gzip, Brotli, LZ4, and Snappy. Choosing the right algorithm
          depends on latency, CPU budget, and bandwidth cost.
        </p>
        <p>
          The trade-off is simple: compress to save bandwidth, but you pay in
          CPU and sometimes latency. For backend systems, the right choice
          depends on payload size, request volume, and where the bottleneck is.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>gzip:</strong> Good balance, widely supported.</li>
          <li><strong>Brotli:</strong> Better compression, more CPU.</li>
          <li><strong>LZ4/Snappy:</strong> Very fast, lower compression ratio.</li>
          <li><strong>Content Negotiation:</strong> Clients send Accept-Encoding.</li>
          <li><strong>Security:</strong> Compression + secrets can enable BREACH-style attacks.</li>
        </ul>
        <p className="mt-4">
          A good rule: compress large JSON responses and static assets, but skip
          compression for already-compressed media or tiny payloads.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Express: enable compression
import compression from 'compression';
app.use(compression());

// Response header example
Content-Encoding: gzip`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain CPU vs bandwidth trade-offs.</li>
          <li>Know how Content-Encoding works in HTTP.</li>
          <li>Use Brotli for static assets, gzip for dynamic content.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you avoid compression?</p>
            <p className="mt-2 text-sm">A: Small payloads or CPU-bound systems.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use Brotli over gzip?</p>
            <p className="mt-2 text-sm">A: Better compression ratio for static assets.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is Accept-Encoding?</p>
            <p className="mt-2 text-sm">
              A: A request header that lists compression formats the client supports.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
