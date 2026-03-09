"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cdn-edge-storage-concise",
  title: "CDN & Edge Storage",
  description:
    "Concise guide to CDN and edge storage concepts, caching, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cdn-edge-storage",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "cdn", "edge", "storage"],
  relatedTopics: [
    "caching-performance",
    "object-storage",
    "compression",
  ],
};

export default function CdnEdgeStorageConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>CDN and edge storage</strong> move content closer to users by
          caching and serving data from geographically distributed edge nodes.
          This reduces latency, improves availability, and offloads origin
          servers.
        </p>
        <p>
          Edge storage is commonly used for static assets, media files, and
          frequently accessed API responses.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Edge cache:</strong> Serve content from nearby nodes.</li>
          <li><strong>Origin:</strong> Primary source of truth.</li>
          <li><strong>Cache TTL:</strong> How long content stays at the edge.</li>
          <li><strong>Cache invalidation:</strong> Purge or refresh stale data.</li>
          <li><strong>Geo-routing:</strong> Requests routed to closest edge.</li>
        </ul>
        <p className="mt-4">
          The key trade-off is freshness vs latency. Short TTLs are fresher but
          increase origin load.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cache-Control for CDN
Cache-Control: public, max-age=3600`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Lower latency for users<br />
                ✓ Reduced origin load<br />
                ✓ Improved availability<br />
                ✓ Handles traffic spikes
              </td>
              <td className="p-3">
                ✗ Stale data if cache not invalidated<br />
                ✗ Cache miss still hits origin<br />
                ✗ Cost for edge bandwidth<br />
                ✗ Complexity in cache rules
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use CDN/edge storage when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Global users need low latency</li>
          <li>• Static or cacheable content dominates</li>
          <li>• You need to absorb traffic spikes</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Data changes constantly and needs real-time freshness</li>
          <li>• Personalization prevents caching benefits</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain cache TTL vs invalidation strategies.</li>
          <li>Discuss origin load reduction benefits.</li>
          <li>Highlight trade-offs between freshness and speed.</li>
          <li>Connect CDNs to global performance.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do CDNs reduce latency?</p>
            <p className="mt-2 text-sm">
              A: They cache content at edge locations closer to users, reducing
              network distance and time.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is cache invalidation?</p>
            <p className="mt-2 text-sm">
              A: A mechanism to purge or refresh cached content when it changes
              at the origin.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the downside of long TTLs?</p>
            <p className="mt-2 text-sm">
              A: Content can become stale, causing users to see outdated data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you bypass the CDN?</p>
            <p className="mt-2 text-sm">
              A: For highly personalized or real-time data that cannot be cached
              safely.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
