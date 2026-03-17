"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-crud-apis",
  title: "CRUD APIs",
  description: "Guide to implementing CRUD APIs for content covering REST design, validation, authorization, and scaling patterns.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "crud-apis",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "crud", "api", "backend"],
  relatedTopics: ["content-storage", "content-validation", "permission-validation"],
};

export default function CRUDAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>CRUD APIs</strong> provide the backend interface for creating, reading, 
          updating, and deleting content. They must enforce validation, authorization, and 
          business logic while providing consistent, performant access to content data.
        </p>
      </section>

      <section>
        <h2>API Design</h2>
        <ul className="space-y-3">
          <li><strong>RESTful:</strong> POST /content, GET /content/:id, PUT/PATCH /content/:id, DELETE /content/:id.</li>
          <li><strong>Validation:</strong> Input validation, length limits, required fields.</li>
          <li><strong>Authorization:</strong> Check permissions before each operation.</li>
          <li><strong>Idempotency:</strong> Support idempotency keys for retries.</li>
        </ul>
      </section>

      <section>
        <h2>Scaling Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Read Replicas:</strong> Route reads to replicas, writes to primary.</li>
          <li><strong>Caching:</strong> Cache content by ID, invalidate on update.</li>
          <li><strong>Pagination:</strong> Cursor-based for large collections.</li>
          <li><strong>Rate Limiting:</strong> Per-user, per-IP limits.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent updates?</p>
            <p className="mt-2 text-sm">A: Optimistic locking with version field. Return 409 on conflict, include current version for retry.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design content pagination?</p>
            <p className="mt-2 text-sm">A: Cursor-based (not offset) for consistency. Return next_cursor, has_more. Stable sort order.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
