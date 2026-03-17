"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-other-cdn-delivery",
  title: "CDN Delivery",
  description: "Guide to implementing CDN delivery covering caching strategies, invalidation, and edge optimization.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "cdn-delivery",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "cdn", "delivery", "caching"],
  relatedTopics: ["media-processing", "content-storage", "performance"],
};

export default function CDNDeliveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>CDN Delivery</strong> distributes content globally through edge caches, 
          reducing latency and origin load. It is essential for fast content delivery at scale.
        </p>
      </section>

      <section>
        <h2>CDN Configuration</h2>
        <ul className="space-y-3">
          <li><strong>Cache Headers:</strong> Set Cache-Control, ETag, Last-Modified.</li>
          <li><strong>TTL:</strong> Long TTL for static assets (1 year), short for dynamic.</li>
          <li><strong>Invalidation:</strong> Purge cache on content update.</li>
          <li><strong>Geo-routing:</strong> Serve from nearest edge location.</li>
        </ul>
      </section>

      <section>
        <h2>Caching Strategies</h2>
        <ul className="space-y-3">
          <li><strong>Cache-aside:</strong> Check cache, miss → origin → cache.</li>
          <li><strong>Write-through:</strong> Write to cache and origin simultaneously.</li>
          <li><strong>Stale-while-revalidate:</strong> Serve stale while refreshing.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache invalidation?</p>
            <p className="mt-2 text-sm">A: Version URLs (asset.v123.js), purge by path, invalidation API, TTL-based expiry.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize CDN costs?</p>
            <p className="mt-2 text-sm">A: Compression, image optimization, cache hit optimization, tiered pricing, multi-CDN routing.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
