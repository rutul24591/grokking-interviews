"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-delete-content",
  title: "Delete Content UI",
  description: "Guide to implementing content deletion covering soft delete, confirmation flows, and recovery options.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "delete-content-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "delete", "frontend"],
  relatedTopics: ["soft-delete", "content-lifecycle", "account-settings"],
};

export default function DeleteContentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Delete Content UI</strong> provides users the ability to remove their content 
          while preventing accidental deletion and offering recovery options when appropriate.
        </p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Soft Delete:</strong> Mark as deleted, hide from views, retain in database.</li>
          <li><strong>Confirmation:</strong> Dialog explaining impact ("This will delete 5 comments").</li>
          <li><strong>Undo Window:</strong> 30-second undo option after deletion.</li>
          <li><strong>Bulk Delete:</strong> Select multiple items, confirm once.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Soft delete vs hard delete?</p>
            <p className="mt-2 text-sm">A: Soft delete for user content (allows recovery, maintains referential integrity). Hard delete for GDPR requests, sensitive data.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cascading deletes?</p>
            <p className="mt-2 text-sm">A: Show impact before delete ("This will also delete 10 comments"). Option to delete or orphan children.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
