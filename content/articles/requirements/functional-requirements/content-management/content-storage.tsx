"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-storage",
  title: "Content Storage",
  description: "Guide to implementing content storage covering database design, object storage, and content indexing.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-storage",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "storage", "database", "backend"],
  relatedTopics: ["crud-apis", "media-processing", "search"],
};

export default function ContentStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Storage</strong> encompasses the database schemas, object storage, 
          and indexing strategies for persisting and retrieving content efficiently at scale.
        </p>
      </section>

      <section>
        <h2>Storage Architecture</h2>
        <ul className="space-y-3">
          <li><strong>Metadata DB:</strong> PostgreSQL for structured data (title, author, status).</li>
          <li><strong>Content Storage:</strong> TEXT column or separate content table.</li>
          <li><strong>Media Storage:</strong> S3/GCS for images, videos, attachments.</li>
          <li><strong>Search Index:</strong> Elasticsearch for full-text search.</li>
        </ul>
      </section>

      <section>
        <h2>Database Design</h2>
        <ul className="space-y-3">
          <li><strong>Partitioning:</strong> By date or tenant for large tables.</li>
          <li><strong>Indexes:</strong> author_id, status, created_at, category.</li>
          <li><strong>Soft Delete:</strong> deleted_at column, filter in queries.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store large content?</p>
            <p className="mt-2 text-sm">A: Separate content table, compress with gzip, consider external storage for very large content.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content migrations?</p>
            <p className="mt-2 text-sm">A: Backward-compatible schema changes, dual-write during migration, gradual cutover, rollback plan.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
