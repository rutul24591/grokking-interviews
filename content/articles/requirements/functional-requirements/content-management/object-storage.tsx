"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-other-object-storage",
  title: "Object Storage",
  description: "Guide to implementing object storage covering S3, GCS, Azure Blob, and storage patterns.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "object-storage",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "storage", "s3", "backend"],
  relatedTopics: ["media-processing", "cdn-delivery", "content-storage"],
};

export default function ObjectStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Object Storage</strong> provides scalable, durable storage for 
          unstructured data like images, videos, and documents. It is the foundation 
          for media and file storage at scale.
        </p>
      </section>

      <section>
        <h2>Storage Providers</h2>
        <ul className="space-y-3">
          <li><strong>AWS S3:</strong> Industry standard, extensive features.</li>
          <li><strong>GCS:</strong> Google Cloud Storage, global consistency.</li>
          <li><strong>Azure Blob:</strong> Microsoft Azure, enterprise integration.</li>
          <li><strong>R2:</strong> Cloudflare R2, no egress fees.</li>
        </ul>
      </section>

      <section>
        <h2>Storage Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Key Structure:</strong> tenant_id/content_id/filename for organization.</li>
          <li><strong>Versioning:</strong> Enable versioning for recovery.</li>
          <li><strong>Lifecycle:</strong> Auto-transition to cheaper tiers.</li>
          <li><strong>Replication:</strong> Cross-region replication for HA.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you organize S3 keys?</p>
            <p className="mt-2 text-sm">A: Hierarchical (prefix/partition/filename), avoid sequential keys, distribute load across partitions.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize storage costs?</p>
            <p className="mt-2 text-sm">A: Lifecycle policies (hot → IA → Glacier), compression, deduplication, right-size storage class.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
