"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-security-audit-logging",
  title: "Security Audit Logging",
  description: "Comprehensive guide to implementing security audit logging covering event schemas, immutable storage, compliance requirements, and analysis patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "security-audit-logging",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "audit-logging", "security", "compliance", "backend"],
  relatedTopics: ["authentication-service", "account-settings", "admin-moderation", "authentication-audit-logs"],
};

export default function SecurityAuditLoggingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Security Audit Logging</strong> is the systematic recording of security-relevant 
          events for compliance, forensics, and threat detection. It provides an immutable trail 
          of who did what, when, and from where—essential for incident response and regulatory 
          compliance (SOC 2, GDPR, HIPAA).
        </p>
        <p>
          For staff and principal engineers, implementing audit logging requires understanding 
          event schemas, immutable storage, retention policies, compliance requirements, and 
          analysis patterns. The implementation must capture comprehensive events without 
          impacting performance or exposing sensitive data.
        </p>
      </section>

      <section>
        <h2>Audit Events</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Events</h3>
          <ul className="space-y-3">
            <li>Login success/failure (user_id, IP, device, outcome)</li>
            <li>Logout (user_id, session_id, duration)</li>
            <li>MFA challenge/verify (method, outcome)</li>
            <li>Password reset request/complete</li>
            <li>Session created/revoked</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Account Events</h3>
          <ul className="space-y-3">
            <li>Account created (source, referral)</li>
            <li>Email/phone changed (old, new, verification status)</li>
            <li>Password changed</li>
            <li>MFA enabled/disabled</li>
            <li>Account deleted/deactivated</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Events</h3>
          <ul className="space-y-3">
            <li>Role assigned/removed (user, role, admin)</li>
            <li>Permission granted/revoked</li>
            <li>Access denied (resource, user, reason)</li>
            <li>Privileged action (admin action, config change)</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Access Events</h3>
          <ul className="space-y-3">
            <li>Data export requested/completed</li>
            <li>Data deletion requested/completed</li>
            <li>PII accessed (by admin/support)</li>
            <li>Bulk data operations</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Event Schema</h2>
        <ul className="space-y-3">
          <li>
            <strong>event_id:</strong> UUID, unique identifier.
          </li>
          <li>
            <strong>timestamp:</strong> ISO 8601, high precision.
          </li>
          <li>
            <strong>event_type:</strong> Categorization (auth.login.success).
          </li>
          <li>
            <strong>actor:</strong> user_id, service_id, or "anonymous".
          </li>
          <li>
            <strong>action:</strong> What was done (create, read, update, delete).
          </li>
          <li>
            <strong>resource:</strong> What was acted upon (user:123, post:456).
          </li>
          <li>
            <strong>outcome:</strong> success, failure, denied.
          </li>
          <li>
            <strong>context:</strong> IP, user_agent, device, location.
          </li>
          <li>
            <strong>metadata:</strong> Event-specific details (JSON).
          </li>
        </ul>
      </section>

      <section>
        <h2>Storage &amp; Retention</h2>
        <ul className="space-y-3">
          <li>
            <strong>Immutable Storage:</strong> Write-once-read-many (WORM). 
            Append-only tables.
          </li>
          <li>
            <strong>Retention:</strong> 7 years for financial, 1-3 years typical. 
            Compliance-driven.
          </li>
          <li>
            <strong>Tiered Storage:</strong> Hot (30 days, fast query), warm 
            (1 year), cold (archive).
          </li>
          <li>
            <strong>Encryption:</strong> At rest (AES-256), in transit (TLS).
          </li>
          <li>
            <strong>Access Control:</strong> Restricted access, separate from 
            application database.
          </li>
        </ul>
      </section>

      <section>
        <h2>Compliance Requirements</h2>
        <ul className="space-y-3">
          <li>
            <strong>SOC 2:</strong> Audit trails for all access, change management.
          </li>
          <li>
            <strong>GDPR:</strong> Log data access, deletion requests, consent 
            changes.
          </li>
          <li>
            <strong>HIPAA:</strong> PHI access logs, 6-year retention.
          </li>
          <li>
            <strong>PCI-DSS:</strong> Cardholder data access, admin actions.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure audit logs are tamper-proof?</p>
            <p className="mt-2 text-sm">
              A: Append-only storage, cryptographic hashing (hash chain), 
              separate write-only credentials, write to WORM storage, 
              replicate to separate account/region.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle PII in audit logs?</p>
            <p className="mt-2 text-sm">
              A: Minimize PII, use user_id not email, hash/mask sensitive 
              fields, encrypt logs, restrict access, define retention and 
              deletion policies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you query audit logs efficiently?</p>
            <p className="mt-2 text-sm">
              A: Index on timestamp, event_type, actor_id. Use time-series 
              database or Elasticsearch. Partition by date. Pre-aggregate 
              common queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle high-volume audit logging?</p>
            <p className="mt-2 text-sm">
              A: Async logging via message queue, batch writes, sampling for 
              low-risk events, tiered storage, separate infrastructure from 
              application.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What events should trigger alerts?</p>
            <p className="mt-2 text-sm">
              A: Multiple failed logins, privilege escalation, data export, 
              access from unusual location, admin actions, bulk operations, 
              audit log tampering attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle audit log retention?</p>
            <p className="mt-2 text-sm">
              A: Policy-based retention (7 years financial, 1 year typical), 
              automated deletion job, archive cold data, document retention 
              policy, comply with legal holds.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
