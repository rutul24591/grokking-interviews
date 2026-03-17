"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-user-management",
  title: "User Management UI",
  description: "Guide to implementing user management covering user search, account actions, and bulk operations.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "user-management-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "user-management", "moderation", "frontend"],
  relatedTopics: ["admin-dashboard", "moderation", "rbac"],
};

export default function UserManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>User Management UI</strong> enables admins to search, view, and 
          manage user accounts including suspensions, bans, and account modifications.
        </p>
      </section>

      <section>
        <h2>User Search</h2>
        <ul className="space-y-3">
          <li><strong>Search:</strong> By email, username, user ID.</li>
          <li><strong>Filters:</strong> Status, signup date, risk score.</li>
          <li><strong>Profile:</strong> Full user details, activity history.</li>
        </ul>
      </section>

      <section>
        <h2>User Actions</h2>
        <ul className="space-y-3">
          <li><strong>Suspend:</strong> Temporary suspension with reason.</li>
          <li><strong>Ban:</strong> Permanent ban (requires approval).</li>
          <li><strong>Restore:</strong> Restore suspended accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent admin abuse?</p>
            <p className="mt-2 text-sm">A: Audit logging, approval workflows, role-based permissions, alerts for sensitive actions.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle bulk operations?</p>
            <p className="mt-2 text-sm">A: Batch processing, progress tracking, rollback capability, confirmation for large batches.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
