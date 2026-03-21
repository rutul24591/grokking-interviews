"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-audit-logging",
  title: "Audit Logging Service",
  description: "Guide to implementing audit logging covering event capture, immutable storage, and compliance.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "audit-logging-service",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "audit-logging", "compliance", "backend"],
  relatedTopics: ["security", "compliance", "monitoring"],
};

export default function AuditLoggingServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Audit Logging Service</strong> captures all administrative and 
          security-relevant events for compliance, forensics, and accountability.
        </p>
      </section>

      <section>
        <h2>Events to Log</h2>
        <ul className="space-y-3">
          <li><strong>Admin Actions:</strong> All admin operations.</li>
          <li><strong>Auth Events:</strong> Logins, permission changes.</li>
          <li><strong>Data Access:</strong> Sensitive data access.</li>
          <li><strong>Config Changes:</strong> System configuration changes.</li>
        </ul>
      </section>

      <section>
        <h2>Storage Requirements</h2>
        <ul className="space-y-3">
          <li><strong>Immutable:</strong> Append-only, no modifications.</li>
          <li><strong>Retention:</strong> 7+ years for compliance.</li>
          <li><strong>Access:</strong> Restricted access, separate from app.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure log integrity?</p>
            <p className="mt-2 text-sm">A: Hash chaining, write-once storage, separate credentials, regular integrity checks.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle PII in audit logs?</p>
            <p className="mt-2 text-sm">A: Minimize PII, encrypt sensitive fields, access controls, retention policies, anonymization.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
