"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cdn-edge-storage-extensive",
  title: "CDN & Edge Storage",
  description:
    "Deep guide to CDN and edge storage, caching strategies, and global performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cdn-edge-storage",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "cdn", "edge", "storage"],
  relatedTopics: [
    "caching-performance",
    "object-storage",
    "compression",
  ],
};

export default function CdnEdgeStorageExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>CDNs and edge storage</strong> distribute content across
          global edge locations, serving users from the nearest node. This
          reduces latency, improves availability, and offloads origin servers.
        </p>
        <p>
          Edge storage is commonly used for static assets, media files, and
          cacheable API responses. It complements origin databases and object
          storage by optimizing delivery.
        </p>
        <p>
          The trade-off is freshness: cached data can become stale if invalidation
          and TTLs are not carefully managed.
        </p>
      </section>

      <section>
        <h2>Edge Architecture</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/cdn-architecture.svg"
          alt="CDN architecture"
          caption="Requests are routed to the nearest edge cache"
        />
        <p>
          CDNs route requests to the closest edge location. If the content is
          cached, it is served instantly. Otherwise, the edge retrieves it from
          the origin and caches it.
        </p>
      </section>

      <section>
        <h2>Cache Control and Invalidation</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/cdn-cache-control.svg"
          alt="Cache control"
          caption="TTL and invalidation rules govern cache freshness"
        />
        <p>
          Cache-Control headers and TTLs define how long content stays at the edge.
          For dynamic content, you may need explicit cache invalidation or
          versioned URLs.
        </p>
        <p>
          Short TTLs reduce staleness but increase origin load. Long TTLs improve
          cache hit rates but risk serving outdated data.
        </p>
      </section>

      <section>
        <h2>Edge Storage Use Cases</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/edge-storage-use-cases.svg"
          alt="Edge storage use cases"
          caption="Static assets, media, and cached API responses"
        />
        <p>
          Common use cases include static assets, images, video segments, and
          API responses that can tolerate short staleness.
        </p>
        <p>
          Edge storage can also be used for personalized content with careful
          cache key design.
        </p>
      </section>

      <section>
        <h2>Example: Cache Headers</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`Cache-Control: public, max-age=3600, stale-while-revalidate=60`}</code>
        </pre>
        <p>
          This allows the CDN to serve cached content for an hour while revalidating
          in the background.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          CDNs improve performance but introduce complexity:
        </p>
        <ul className="space-y-2">
          <li>Cache invalidation and purge strategies.</li>
          <li>Debugging cache misses and stale data.</li>
          <li>Managing costs for global bandwidth.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Set cache TTLs based on freshness needs.</li>
          <li>Use versioned URLs for immutable assets.</li>
          <li>Implement cache purge for dynamic content.</li>
          <li>Monitor cache hit ratio and latency.</li>
          <li>Design cache keys to avoid over-personalization.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
