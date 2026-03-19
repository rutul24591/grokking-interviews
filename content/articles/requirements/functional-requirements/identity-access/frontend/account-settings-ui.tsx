"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-account-settings",
  title: "Account Settings UI",
  description: "Comprehensive guide to implementing account settings interfaces covering email changes, phone changes, account deletion, data export, and critical security flows for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-settings-ui",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "account-settings", "security", "gdpr", "frontend"],
  relatedTopics: ["profile-settings-ui", "security-settings", "password-reset", "data-portability"],
};

export default function AccountSettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Settings UI</strong> allows users to manage critical account 
          information including email, phone number, account deletion, and data export. 
          Unlike profile settings (public-facing), account settings control the 
          underlying account identity and have significant security implications.
        </p>
        <p>
          For staff and principal engineers, implementing account settings requires 
          understanding security verification flows, email/phone change processes, 
          account deletion (GDPR right to erasure), data export (GDPR right to 
          access), and audit logging. The implementation must provide clear UX while 
          preventing unauthorized changes.
        </p>
      </section>

      <section>
        <h2>Email Change Flow</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email Change Process</h3>
          <ul className="space-y-3">
            <li>
              <strong>Current Email Verification:</strong> Require password or MFA 
              before changing email. Prevents unauthorized changes.
            </li>
            <li>
              <strong>New Email Input:</strong> Validate format, check not already 
              registered.
            </li>
            <li>
              <strong>Verification to Both:</strong> Send confirmation to old email 
              (security notice) and new email (verification link).
            </li>
            <li>
              <strong>Pending State:</strong> Email change pending until new email 
              verified. Show in UI.
            </li>
            <li>
              <strong>Rollback:</strong> Allow canceling pending change from old 
              email link.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Considerations</h3>
          <ul className="space-y-3">
            <li>
              <strong>Rate Limiting:</strong> Limit email change attempts (3/day). 
              Prevent harassment.
            </li>
            <li>
              <strong>Audit Log:</strong> Log email change request, verification, 
              completion with IP/timestamp.
            </li>
            <li>
              <strong>Session Invalidation:</strong> Optional: require re-login 
              after email change for high-security apps.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Phone Number Change</h2>
        <ul className="space-y-3">
          <li>
            <strong>Verification:</strong> Require password/MFA before change.
          </li>
          <li>
            <strong>New Phone Verification:</strong> Send OTP to new number, 
            verify before updating.
          </li>
          <li>
            <strong>Security Notice:</strong> Send SMS to old number notifying 
            of change.
          </li>
          <li>
            <strong>MFA Impact:</strong> If old number was MFA method, require 
            setting up new MFA.
          </li>
        </ul>
      </section>

      <section>
        <h2>Account Deletion</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Deletion Flow</h3>
          <ul className="space-y-3">
            <li>
              <strong>Location:</strong> Settings → Account → Delete Account. 
              Not easily accessible (prevents accidental deletion).
            </li>
            <li>
              <strong>Confirmation:</strong> Multiple confirmations required. 
              Type "DELETE" or email to confirm.
            </li>
            <li>
              <strong>Impact Warning:</strong> Show what will be deleted (posts, 
              messages, data). Export option before deletion.
            </li>
            <li>
              <strong>Cooling Period:</strong> 30-day grace period. Account 
              deactivated, can be restored. Permanent deletion after.
            </li>
            <li>
              <strong>Subscription Cancellation:</strong> Cancel active 
              subscriptions before deletion.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">GDPR Compliance</h3>
          <ul className="space-y-3">
            <li>
              <strong>Right to Erasure:</strong> Delete all personal data on 
              request. Some exceptions (legal requirements, fraud prevention).
            </li>
            <li>
              <strong>Anonymization:</strong> Some data may be anonymized rather 
              than deleted (audit logs, aggregated analytics).
            </li>
            <li>
              <strong>Third-Party Data:</strong> Delete data shared with partners. 
              Notify third parties of deletion.
            </li>
            <li>
              <strong>Certificate:</strong> Provide deletion confirmation on 
              request.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Data Export</h2>
        <ul className="space-y-3">
          <li>
            <strong>Request Flow:</strong> Settings → Privacy → Download Data. 
            Select data categories.
          </li>
          <li>
            <strong>Export Contents:</strong> Profile, posts, messages, photos, 
            settings, activity log.
          </li>
          <li>
            <strong>Format:</strong> JSON (machine-readable) + HTML (human-readable). 
            ZIP for large exports.
          </li>
          <li>
            <strong>Delivery:</strong> Email when ready (async processing). Secure 
            download link (24-72 hour expiry).
          </li>
          <li>
            <strong>GDPR SLA:</strong> Provide within 30 days. Free of charge.
          </li>
        </ul>
      </section>

      <section>
        <h2>Account Deactivation</h2>
        <ul className="space-y-3">
          <li>
            <strong>Temporary:</strong> Deactivate vs delete. Account hidden, 
            data preserved.
          </li>
          <li>
            <strong>Reactivation:</strong> Login to reactivate. Time limit 
            (1 year) before auto-delete.
          </li>
          <li>
            <strong>Use Case:</strong> Break from platform, military deployment, 
            mental health.
          </li>
          <li>
            <strong>Visibility:</strong> Profile hidden, content hidden or 
            marked "deleted".
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent unauthorized email changes?</p>
            <p className="mt-2 text-sm">
              A: Require password + MFA verification before change. Send confirmation 
              to both old and new email. Pending state until new email verified. 
              Allow rollback from old email. Audit log all changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should account deletion be immediate?</p>
            <p className="mt-2 text-sm">
              A: No, use cooling period (30 days). Account deactivated immediately 
              (hidden), permanently deleted after period. Allows recovery if 
              accidental or hacked. GDPR allows reasonable time for processing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What data do you include in export?</p>
            <p className="mt-2 text-sm">
              A: All user-generated content (posts, comments, messages), profile 
              data, settings, activity log, connected apps, payment history 
              (masked). Exclude: passwords, other users' data, proprietary 
              algorithms.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle account deletion with active subscriptions?</p>
            <p className="mt-2 text-sm">
              A: Block deletion until subscriptions cancelled. Provide cancellation 
              flow inline. Prorate refund if applicable. Confirm cancellation 
              before proceeding with deletion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data retention after deletion?</p>
            <p className="mt-2 text-sm">
              A: Delete personal data, retain anonymized data for analytics. Keep 
              audit logs (without PII) for compliance. Backup retention (90 days) 
              then purge. Document retention policy clearly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent abuse of account deletion?</p>
            <p className="mt-2 text-sm">
              A: Multiple confirmations, cooling period, rate limit deletion 
              requests (1/month), require recent login, verify identity for 
              high-value accounts. Detect patterns (delete → recreate to evade 
              bans).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
