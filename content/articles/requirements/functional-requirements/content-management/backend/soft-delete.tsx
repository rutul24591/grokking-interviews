"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-soft-delete",
  title: "Soft Delete",
  description: "Guide to implementing soft delete covering deletion patterns, recovery, and data retention.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "soft-delete",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "soft-delete", "backend"],
  relatedTopics: ["content-lifecycle", "data-retention", "gdpr"],
};

export default function SoftDeleteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Soft Delete</strong> marks content as deleted without removing it from 
          the database, enabling recovery, maintaining referential integrity, and supporting 
          audit requirements.
        </p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>deleted_at Column:</strong> Timestamp when deleted, NULL if active.</li>
          <li><strong>Scope:</strong> Default scope excludes deleted records.</li>
          <li><strong>Cascade:</strong> Soft delete related records or orphan.</li>
          <li><strong>Hard Delete:</strong> Permanent delete after retention period.</li>
        </ul>
      </section>

      <section>
        <h2>Query Handling</h2>
        <ul className="space-y-3">
          <li><strong>Default:</strong> WHERE deleted_at IS NULL.</li>
          <li><strong>With Deleted:</strong> Include deleted for admins.</li>
          <li><strong>Only Deleted:</strong> For recovery interface.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you use soft delete?</p>
            <p className="mt-2 text-sm">A: User content (allows recovery), audit requirements, referential integrity. Not for sensitive data (GDPR).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle unique constraints with soft delete?</p>
            <p className="mt-2 text-sm">A: Partial unique index WHERE deleted_at IS NULL. Allows reuse of deleted values.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
