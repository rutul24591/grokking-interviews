"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-admin-dashboard",
  title: "Admin Dashboard",
  description: "Guide to implementing admin dashboards covering metrics, user management, and system health monitoring.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "admin-dashboard",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "dashboard", "monitoring", "frontend"],
  relatedTopics: ["admin-tools", "analytics", "monitoring"],
};

export default function AdminDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Admin Dashboard</strong> provides operators visibility into system 
          health, user metrics, and operational status, enabling quick decision-making 
          and issue detection.
        </p>
      </section>

      <section>
        <h2>Dashboard Components</h2>
        <ul className="space-y-3">
          <li><strong>Metrics:</strong> DAU/MAU, signups, revenue, engagement.</li>
          <li><strong>Health:</strong> System status, error rates, latency.</li>
          <li><strong>Alerts:</strong> Active alerts, recent incidents.</li>
          <li><strong>Queue:</strong> Pending reviews, support tickets.</li>
        </ul>
      </section>

      <section>
        <h2>Access Control</h2>
        <ul className="space-y-3">
          <li><strong>RBAC:</strong> Role-based dashboard access.</li>
          <li><strong>Audit:</strong> Log all admin actions.</li>
          <li><strong>2FA:</strong> Required for admin access.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design dashboards for different roles?</p>
            <p className="mt-2 text-sm">A: Role-specific views, customizable widgets, permission-based data access, executive summary vs operational detail.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle real-time updates?</p>
            <p className="mt-2 text-sm">A: WebSocket for critical metrics, polling for others, cache aggregation, throttle updates.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
