"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-flow.svg"
          alt="Account Settings Flow"
          caption="Account Settings Flow — showing settings management, privacy controls, and data export"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-gdpr.svg"
          alt="Account Settings Gdpr"
          caption="Account Settings GDPR — showing data access, portability, right to be forgotten"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-security.svg"
          alt="Account Settings Security"
          caption="Account Settings Security — showing password change, session management, and security alerts"
        />
      
        <p>
          For staff and principal engineers, implementing account settings requires
          understanding security verification flows, email/phone change processes,
          account deletion (GDPR right to erasure), data export (GDPR right to
          access), and audit logging. The implementation must provide clear UX while
          preventing unauthorized changes.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready account settings page must handle critical account changes securely.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email Change Flow</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Phone Number Change</h3>
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
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Account Deletion</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Data Export</h3>
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
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Require password/MFA for sensitive changes</li>
          <li>Notify users of account changes</li>
          <li>Log all account changes for audit</li>
          <li>Implement rate limiting for changes</li>
          <li>Use pending state for email changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear confirmation flows</li>
          <li>Show impact before deletion</li>
          <li>Offer data export before deletion</li>
          <li>Provide cooling period for deletion</li>
          <li>Support account reactivation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GDPR Compliance</h3>
        <ul className="space-y-2">
          <li>Support right to erasure (deletion)</li>
          <li>Support right to access (export)</li>
          <li>Provide deletion confirmation</li>
          <li>Anonymize data where required</li>
          <li>Document retention policies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track account change rates</li>
          <li>Monitor deletion requests</li>
          <li>Alert on unusual patterns</li>
          <li>Track export request fulfillment</li>
          <li>Monitor reactivation rates</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No verification:</strong> Email changed without confirmation.
            <br /><strong>Fix:</strong> Require password + MFA, verify new email.
          </li>
          <li>
            <strong>Immediate deletion:</strong> No recovery option.
            <br /><strong>Fix:</strong> Use cooling period (30 days).
          </li>
          <li>
            <strong>No export option:</strong> Users can't get their data.
            <br /><strong>Fix:</strong> Provide data export before deletion.
          </li>
          <li>
            <strong>Poor notifications:</strong> Users unaware of changes.
            <br /><strong>Fix:</strong> Notify old and new email/phone.
          </li>
          <li>
            <strong>No rollback:</strong> Can't cancel pending changes.
            <br /><strong>Fix:</strong> Allow rollback from old email link.
          </li>
          <li>
            <strong>No rate limiting:</strong> Deletion requests abused.
            <br /><strong>Fix:</strong> Rate limit (1/month per account).
          </li>
          <li>
            <strong>Poor subscription handling:</strong> Active subscriptions on deletion.
            <br /><strong>Fix:</strong> Block deletion until subscriptions cancelled.
          </li>
          <li>
            <strong>No audit logging:</strong> Can't track account changes.
            <br /><strong>Fix:</strong> Log all changes with IP/timestamp.
          </li>
          <li>
            <strong>No reactivation:</strong> Can't restore deactivated account.
            <br /><strong>Fix:</strong> Allow login to reactivate within time limit.
          </li>
          <li>
            <strong>Poor UX for deletion:</strong> Too easy to delete accidentally.
            <br /><strong>Fix:</strong> Multiple confirmations, type "DELETE".
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Change Security</h3>
        <p>
          Secure email change process to prevent account takeover.
        </p>
        <ul className="space-y-2">
          <li><strong>Verification:</strong> Require password/MFA before change.</li>
          <li><strong>Double Verification:</strong> Verify both old and new email.</li>
          <li><strong>Pending State:</strong> Email change pending until new email verified.</li>
          <li><strong>Rollback:</strong> Allow canceling from old email link.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Deletion Flow</h3>
        <p>
          Safe account deletion with recovery option.
        </p>
        <ul className="space-y-2">
          <li><strong>Multiple Confirmations:</strong> Type "DELETE" or email to confirm.</li>
          <li><strong>Cooling Period:</strong> 30-day grace period for recovery.</li>
          <li><strong>Data Export:</strong> Offer export before deletion.</li>
          <li><strong>Subscription Handling:</strong> Cancel subscriptions before deletion.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Export</h3>
        <p>
          GDPR-compliant data export functionality.
        </p>
        <ul className="space-y-2">
          <li><strong>Async Processing:</strong> Generate export in background.</li>
          <li><strong>Multiple Formats:</strong> JSON (machine-readable) + HTML (human-readable).</li>
          <li><strong>Secure Delivery:</strong> Email with secure download link.</li>
          <li><strong>Expiry:</strong> Link expires after 24-72 hours.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Reactivation</h3>
        <p>
          Allow users to reactivate deactivated accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>Login to Reactivate:</strong> Simple login reactivates account.</li>
          <li><strong>Time Limit:</strong> Reactivation available within 30 days.</li>
          <li><strong>Data Preservation:</strong> All data preserved during deactivation.</li>
          <li><strong>Notification:</strong> Notify user before permanent deletion.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email changes securely?</p>
            <p className="mt-2 text-sm">
              A: Require password/MFA before change. Verify new email with confirmation link. Send security notice to old email. Keep email change pending until new email verified. Allow rollback from old email link. Log all changes for audit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement account deletion?</p>
            <p className="mt-2 text-sm">
              A: Multiple confirmations (type "DELETE"). Show impact warning (what will be deleted). Offer data export. 30-day cooling period (deactivated, can restore). Permanent deletion after cooling period. Cancel subscriptions before deletion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data export for GDPR?</p>
            <p className="mt-2 text-sm">
              A: Async processing (generate in background). Multiple formats (JSON + HTML). Secure delivery (email with secure link). Link expiry (24-72 hours). Provide within 30 days (GDPR SLA). Free of charge.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle phone number changes?</p>
            <p className="mt-2 text-sm">
              A: Require password/MFA before change. Send OTP to new number, verify before updating. Send security notice to old number. If old number was MFA method, require setting up new MFA. Log all changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent accidental account deletion?</p>
            <p className="mt-2 text-sm">
              A: Multiple confirmations (type "DELETE" or email). Show impact warning. Cooling period (30 days) for recovery. Not easily accessible (Settings → Account → Delete). Require password confirmation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle active subscriptions on deletion?</p>
            <p className="mt-2 text-sm">
              A: Block deletion until subscriptions cancelled. Provide cancellation flow inline. Prorate refund if applicable. Confirm cancellation before proceeding with deletion. Notify user of subscription status.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle account reactivation?</p>
            <p className="mt-2 text-sm">
              A: Login to reactivate within cooling period (30 days). All data preserved during deactivation. Notify user before permanent deletion. Simple reactivation flow (just login). Clear communication about reactivation deadline.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account settings?</p>
            <p className="mt-2 text-sm">
              A: Email change rate, phone change rate, deletion request rate, export request rate, reactivation rate, export fulfillment time. Alert on anomalies (spike in deletion requests).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle account settings on mobile?</p>
            <p className="mt-2 text-sm">
              A: Mobile-optimized layout, touch-friendly controls, clear confirmation dialogs, simplified deletion flow, easy access to export, clear privacy settings. Test on various screen sizes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://gdpr.eu/right-to-be-forgotten/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">GDPR Right to Erasure</a></li>
          <li><a href="https://gdpr.eu/right-of-access/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">GDPR Right of Access</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - Authentication Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://docs.openfga.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenFGA - Fine-Grained Authorization</a></li>
          <li><a href="https://www.cerbos.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Cerbos - Policy as Code</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Account Settings</h3>
        <p>
          Large e-commerce platform with 50M users managing account data and GDPR requests.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> GDPR data export requests (1000s/month). Account deletion with order history retention. Email change for order notifications.</li>
          <li><strong>Solution:</strong> Self-service data export (JSON/PDF). Account deletion with order history anonymization. Email change with order notification transfer.</li>
          <li><strong>Result:</strong> GDPR requests fulfilled in 24 hours (vs 30-day requirement). 90% self-service adoption. Customer satisfaction improved.</li>
          <li><strong>Security:</strong> Identity verification for changes, data encryption, audit logging.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Account Settings</h3>
        <p>
          Online banking with strict security for account changes and closures.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires verification for account changes. Account closure with balance transfer. Regulatory data retention.</li>
          <li><strong>Solution:</strong> Multi-factor verification for changes. Account closure workflow with balance transfer. Data retention per regulations (7 years).</li>
          <li><strong>Result:</strong> Passed regulatory audits. Zero unauthorized account changes. Customer trust maintained.</li>
          <li><strong>Security:</strong> MFA for changes, balance verification, regulatory compliance.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Account Settings</h3>
        <p>
          Social platform with 500M users, account deletion and data portability.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> High deletion requests (user sentiment). Data portability (GDPR). Memorialization for deceased users.</li>
          <li><strong>Solution:</strong> Deletion with cooling period (30 days). Data export (photos, posts, messages). Memorialization option for family requests.</li>
          <li><strong>Result:</strong> 40% deletion requests reversed during cooling period. GDPR compliance maintained. Family satisfaction with memorialization.</li>
          <li><strong>Security:</strong> Identity verification, cooling period enforcement, memorialization verification.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Account Settings</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, admin-managed accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Admin controls user accounts. User can't delete admin-managed accounts. Data export for compliance.</li>
          <li><strong>Solution:</strong> Admin-only account deletion. User data export available. Account transfer between admins. Audit trail for admin actions.</li>
          <li><strong>Result:</strong> Admin control maintained. Compliance requests fulfilled. Zero unauthorized deletions.</li>
          <li><strong>Security:</strong> Admin verification, audit logging, data export controls.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Account Settings</h3>
        <p>
          Online gaming platform with virtual currency and item ownership.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Account deletion with virtual currency. Item ownership transfer. Parental controls for minor accounts.</li>
          <li><strong>Solution:</strong> Deletion with currency forfeiture warning. Item transfer before deletion. Parental approval for minor account changes.</li>
          <li><strong>Result:</strong> Deletion requests reduced (users aware of loss). Parent satisfaction improved. Zero disputes post-deletion.</li>
          <li><strong>Security:</strong> Parental verification, currency handling, item transfer validation.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
