"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-permission-validation",
  title: "Permission Validation",
  description: "Guide to implementing permission validation covering authorization checks, middleware patterns, resource-level permissions, and caching strategies.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "permission-validation",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "permissions", "authorization", "backend"],
  relatedTopics: ["rbac", "access-control-policies", "authentication-service"],
};

export default function PermissionValidationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Permission Validation</strong> is the process of verifying that an authenticated 
          user has the required permissions to perform a specific action or access a resource. 
          It is the enforcement layer of authorization that protects against unauthorized access.
        </p>
      </section>

      <section>
        <h2>Validation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Middleware:</strong> Check permissions before handler execution.</li>
          <li><strong>Decorator:</strong> @RequirePermission('create:post').</li>
          <li><strong>Code-level:</strong> if (!user.can('delete')) throw 403.</li>
          <li><strong>Policy-based:</strong> Centralized policy evaluation.</li>
        </ul>
      </section>

      <section>
        <h2>Resource-Level Permissions</h2>
        <ul className="space-y-3">
          <li><strong>Ownership Check:</strong> User can modify own resources.</li>
          <li><strong>Role-based:</strong> Admin can modify all resources.</li>
          <li><strong>Combination:</strong> OR of ownership + permission.</li>
        </ul>
      </section>

      <section>
        <h2>Caching Strategies</h2>
        <ul className="space-y-3">
          <li><strong>JWT Claims:</strong> Embed permissions in token.</li>
          <li><strong>Redis Cache:</strong> Cache user permissions with TTL.</li>
          <li><strong>Invalidation:</strong> Clear cache on role change.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle permission changes?</p>
            <p className="mt-2 text-sm">A: Invalidate cache, force token refresh, eventual consistency acceptable for most cases.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate resource-level permissions?</p>
            <p className="mt-2 text-sm">A: Check global permission OR resource ownership. Query database for ownership if needed.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
