"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-authentication-audit-logs",
  title: "Authentication Audit Logs",
  description: "Guide to implementing authentication audit logs covering log schema, storage, compliance, and analysis patterns.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "authentication-audit-logs",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "audit-logs", "authentication", "compliance"],
  relatedTopics: ["security-audit-logging", "login-attempt-tracking", "admin-moderation"],
};

export default function AuthenticationAuditLogsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Authentication Audit Logs</strong> record all authentication-related events 
          for security analysis, compliance, and forensics. They provide an immutable trail 
          of who authenticated, when, from where, and with what outcome.
        </p>
      </section>

      <section>
        <h2>Logged Events</h2>
        <ul className="space-y-3">
          <li><strong>Login:</strong> Success/failure, method, IP, device.</li>
          <li><strong>Logout:</strong> User-initiated, timeout, admin.</li>
          <li><strong>MFA:</strong> Challenge sent, verified, failed.</li>
          <li><strong>Password:</strong> Change request, success, reset.</li>
          <li><strong>Session:</strong> Created, refreshed, revoked.</li>
        </ul>
      </section>

      <section>
        <h2>Log Schema</h2>
        <ul className="space-y-3">
          <li><strong>event_id:</strong> Unique identifier.</li>
          <li><strong>timestamp:</strong> High-precision ISO 8601.</li>
          <li><strong>event_type:</strong> Categorization.</li>
          <li><strong>user_id:</strong> Associated user (if known).</li>
          <li><strong>outcome:</strong> Success/failure.</li>
          <li><strong>context:</strong> IP, device, location.</li>
        </ul>
      </section>

      <section>
        <h2>Compliance</h2>
        <ul className="space-y-3">
          <li><strong>SOC 2:</strong> All access logged.</li>
          <li><strong>GDPR:</strong> Data access logged.</li>
          <li><strong>HIPAA:</strong> PHI access logged.</li>
          <li><strong>PCI-DSS:</strong> Cardholder data access.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should audit logs be retained?</p>
            <p className="mt-2 text-sm">A: Depends on compliance. SOC 2: 1 year. HIPAA: 6 years. Financial: 7 years.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect audit logs?</p>
            <p className="mt-2 text-sm">A: Immutable storage, restricted access, encryption, separate from application, write-only credentials.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
