"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-notification-center",
  title: "Notification Center",
  description: "Guide to implementing notification centers covering notification display, filtering, and preferences.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "notification-center",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "notifications", "frontend"],
  relatedTopics: ["push-notifications", "real-time", "preferences"],
};

export default function NotificationCenterArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Notification Center</strong> aggregates and displays all user 
          notifications in one place, enabling users to stay informed about activity 
          relevant to them.
        </p>
      </section>

      <section>
        <h2>Notification Display</h2>
        <ul className="space-y-3">
          <li><strong>List:</strong> Chronological, grouped by type/date.</li>
          <li><strong>Unread:</strong> Visual indicator for unread notifications.</li>
          <li><strong>Actions:</strong> Mark read, delete, take action.</li>
        </ul>
      </section>

      <section>
        <h2>Preferences</h2>
        <ul className="space-y-3">
          <li><strong>Channels:</strong> Email, push, in-app toggles.</li>
          <li><strong>Types:</strong> Per notification type preferences.</li>
          <li><strong>Quiet Hours:</strong> Suppress during specified times.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification overload?</p>
            <p className="mt-2 text-sm">A: Grouping, digest notifications, priority filtering, smart bundling, user preferences.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync notifications across devices?</p>
            <p className="mt-2 text-sm">A: Central notification store, WebSocket for real-time, mark read syncs across devices, conflict resolution.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
