"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-account-settings",
  title: "Account Settings UI",
  description:
    "Comprehensive guide to implementing account settings interfaces covering email changes, phone changes, account deletion, data export (GDPR), password changes, and critical security flows with verification requirements for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-settings-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "account-settings",
    "security",
    "gdpr",
    "frontend",
  ],
  relatedTopics: ["profile-settings-ui", "security-settings-ui", "password-reset"],
};

export default function AccountSettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Settings UI</strong> allows users to manage critical account information
          including email, phone number, account deletion, and data export. Unlike profile settings
          (public-facing), account settings control the underlying account identity and have
          significant security implications. Account settings is where users make changes that
          affect account security and data ownership.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-flow.svg"
          alt="Account Settings Flow"
          caption="Account Settings Flow — showing email change, phone change, account deletion, and data export flows"
        />

        <p>
          For staff and principal engineers, implementing account settings requires deep
          understanding of security verification flows (password/MFA confirmation), email/phone
          change processes (dual verification), account deletion (GDPR right to erasure), data
          export (GDPR right to access/portability), and audit logging. The implementation must
          provide clear UX while preventing unauthorized changes and complying with privacy
          regulations.
        </p>
        <p>
          Modern account settings has evolved from simple forms to comprehensive privacy dashboards
          with GDPR compliance, data portability, and granular privacy controls. Organizations like
          Google, Apple, and Microsoft provide comprehensive account settings — users can change
          email/phone, download their data, delete their account, and manage privacy settings all
          from one place.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Account settings is built on fundamental concepts that determine how account changes are
          made securely. Understanding these concepts is essential for designing effective account
          settings UI.
        </p>
        <p>
          <strong>Email Change Flow:</strong> Current email verification (require password or MFA
          before changing — prevents unauthorized changes), new email input (validate format, check
          not already registered), verification to both (send confirmation to old email as security
          notice, send verification link to new email), pending state (email change pending until
          new email verified — show in UI), rollback (allow canceling pending change from old email
          link).
        </p>
        <p>
          <strong>Phone Number Change:</strong> Similar to email change — verify current phone (SMS
          code), enter new phone, send verification code to new phone, confirm code, update phone.
          Phone changes often require additional verification (email + phone) due to account
          recovery implications.
        </p>
        <p>
          <strong>Account Deletion:</strong> GDPR right to erasure — users can request account
          deletion. Verification required (password + MFA + email confirmation). Grace period (14-30
          days — allow users to change mind). Data backup before deletion (for compliance). Soft
          delete first (mark as deleted, anonymize data), hard delete after grace period.
        </p>
        <p>
          <strong>Data Export:</strong> GDPR right to access/portability — users can download their
          data. Export formats (JSON, CSV, PDF). Include all user data (profile, settings, content,
          activity logs). Asynchronous generation (large exports take time). Email notification when
          export ready. Secure download link (expires after 24-72 hours).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Account settings architecture separates settings UI from backend verification, enabling
          secure changes with clear UX. This architecture is critical for preventing unauthorized
          account changes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-gdpr.svg"
          alt="Account Settings GDPR"
          caption="GDPR Compliance — showing data access, portability, right to erasure, and consent management"
        />

        <p>
          Email change flow: User navigates to account settings, clicks "Change Email". Frontend
          shows current email verification (require password or MFA). User verifies. Frontend shows
          new email input. User enters new email. Frontend validates format, checks availability.
          User submits. Backend sends confirmation to old email (security notice), sends
          verification link to new email. Email change status shows "Pending" until new email
          verified. User clicks verification link in new email. Backend completes email change,
          notifies user. Old email can cancel pending change via link in security notice.
        </p>
        <p>
          Account deletion flow: User navigates to account settings, clicks "Delete Account".
          Frontend shows warning (data loss, irreversible after grace period). User confirms.
          Frontend shows verification (password + MFA + email confirmation). User completes
          verification. Backend marks account as "pending deletion", starts grace period (14-30
          days). User receives email confirmation with cancellation link. After grace period:
          anonymize data, hard delete account, notify user (if possible).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-settings-security.svg"
          alt="Account Settings Security"
          caption="Account Settings Security — showing verification requirements, audit logging, and security notifications"
        />

        <p>
          Security architecture includes: verification requirements (password/MFA for sensitive
          changes), dual verification for email/phone (verify both old and new), audit logging (log
          all account changes), security notifications (email user of changes), grace periods (for
          deletion — allow cancellation), rollback capability (cancel pending email change). This
          architecture enables secure account management — unauthorized changes are prevented, users
          are notified of changes.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing account settings involves trade-offs between security, usability, and
          compliance. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Single vs Dual Verification for Email Change</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single (verify new only):</strong> Simpler UX, faster change. Limitation:
              attacker who gains access can change email, lock out legitimate user.
            </li>
            <li>
              <strong>Dual (verify old + new):</strong> More secure (old email gets notice, can
              cancel). Limitation: more steps, user must access both emails.
            </li>
            <li>
              <strong>Recommendation:</strong> Dual verification for email changes — security
              outweighs convenience. Old email must be able to cancel pending change.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Immediate vs Grace Period Deletion</h3>
          <ul className="space-y-3">
            <li>
              <strong>Immediate:</strong> User request honored immediately. Limitation: no
              recovery if accidental or malicious, compliance risk (some regulations require grace
              period).
            </li>
            <li>
              <strong>Grace Period (14-30 days):</strong> User can change mind, recover from
              accidental deletion, cancel unauthorized deletion. Limitation: data retained longer.
            </li>
            <li>
              <strong>Recommendation:</strong> Grace period (14-30 days) — allows recovery from
              mistakes, required by some regulations. Send confirmation email with cancellation
              link.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Full vs Partial Data Export</h3>
          <ul className="space-y-3">
            <li>
              <strong>Full Export:</strong> All user data in one download. Complete portability.
              Limitation: large files, long generation time, may include sensitive data user didn't
              intend to export.
            </li>
            <li>
              <strong>Partial Export:</strong> User selects what to export (profile, content,
              settings). Smaller files, faster. Limitation: user may not know what data exists.
            </li>
            <li>
              <strong>Recommendation:</strong> Both — full export for compliance, partial export
              for convenience. Show data categories with size estimates.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing account settings requires following established best practices to ensure
          security, usability, and compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Change</h3>
        <p>
          Require current email verification — password or MFA before changing. Send security
          notice to old email — include cancellation link. Send verification link to new email —
          must confirm ownership. Show pending state clearly — "Email change pending, check your
          new email". Allow cancellation from old email — security measure. Expire pending change
          after 7 days — prevent stale pending changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phone Change</h3>
        <p>
          Require current phone verification — SMS code to current phone. Send verification code to
          new phone — confirm ownership. Require additional verification — email + phone for phone
          changes (due to account recovery implications). Show pending state — "Phone change
          pending". Allow cancellation — from verified email.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Deletion</h3>
        <p>
          Show clear warning — data loss, irreversible after grace period. Require strong
          verification — password + MFA + email confirmation. Implement grace period — 14-30 days,
          allow cancellation. Send confirmation email — with cancellation link. Anonymize data
          first — then hard delete after grace period. Audit log deletion — for compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Export</h3>
        <p>
          Support multiple formats — JSON (machine-readable), CSV (spreadsheet), PDF (human-readable).
          Asynchronous generation — large exports take time, don't block. Email notification — when
          export ready. Secure download link — expires after 24-72 hours. Include all data —
          profile, settings, content, activity logs. Show export size — before generation.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing account settings to ensure secure, usable,
          and compliant account management.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No verification for email change:</strong> Attacker can change email, lock out
            user. <strong>Fix:</strong> Require password/MFA verification. Send notice to old email
            with cancellation link.
          </li>
          <li>
            <strong>Immediate account deletion:</strong> No recovery from accidental or malicious
            deletion. <strong>Fix:</strong> Implement grace period (14-30 days). Send confirmation
            with cancellation link.
          </li>
          <li>
            <strong>No data export:</strong> GDPR violation, users can't access their data.{" "}
            <strong>Fix:</strong> Implement data export (JSON, CSV, PDF). Asynchronous generation
            for large exports.
          </li>
          <li>
            <strong>Insecure download links:</strong> Export links don't expire, anyone can
            download. <strong>Fix:</strong> Secure links with expiry (24-72 hours). Require
            authentication to download.
          </li>
          <li>
            <strong>No audit logging:</strong> Can't track who changed what, compliance violation.{" "}
            <strong>Fix:</strong> Log all account changes (who, what, when, IP). Retain for
            compliance period.
          </li>
          <li>
            <strong>No security notifications:</strong> Users unaware of account changes.{" "}
            <strong>Fix:</strong> Email user of all sensitive changes (email, phone, password).
            Include "Was this you?" link.
          </li>
          <li>
            <strong>Complex deletion flow:</strong> Users can't find or complete deletion,
            frustration. <strong>Fix:</strong> Clear deletion path, plain language warnings,
            step-by-step process.
          </li>
          <li>
            <strong>Partial data export:</strong> Missing data categories, incomplete export.{" "}
            <strong>Fix:</strong> Export all user data. Show data categories before export.
          </li>
          <li>
            <strong>No pending state:</strong> Users don't know email/phone change is pending.{" "}
            <strong>Fix:</strong> Show pending state clearly. Allow cancellation. Send reminders.
          </li>
          <li>
            <strong>No rollback:</strong> Can't cancel pending changes. <strong>Fix:</strong> Allow
            cancellation from old email/phone. Show cancellation link prominently.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Account settings is critical for user control and compliance. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users with varying technical knowledge. Need to
          make account management accessible. GDPR compliance critical.
        </p>
        <p>
          <strong>Solution:</strong> Comprehensive account dashboard. Email change with dual
          verification. Data export (Google Takeout). Account deletion with grace period. Security
          notifications for all changes.
        </p>
        <p>
          <strong>Result:</strong> GDPR compliant. Users can manage accounts easily. Unauthorized
          changes detected via notifications.
        </p>
        <p>
          <strong>Security:</strong> Dual verification, security notifications, grace period.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require admin controls. Compliance needs
          audit trails. Data retention policies.
        </p>
        <p>
          <strong>Solution:</strong> Admin account management (admins can manage user accounts).
          Audit logging for all changes. Data retention policies (configurable). Export for
          compliance.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Admin control over user accounts. Compliance
          requirements met.
        </p>
        <p>
          <strong>Security:</strong> Admin controls, audit logging, retention policies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires strict account controls. High-security
          needs for contact changes. Fraud prevention critical.
        </p>
        <p>
          <strong>Solution:</strong> Multi-factor verification for all changes. Phone changes
          require branch visit or notarized form. Email changes require dual verification. Audit
          logging for all changes.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Fraud reduced 90%. Account changes secured.
        </p>
        <p>
          <strong>Security:</strong> Multi-factor verification, branch verification, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires access controls. Account changes
          affect PHI access. Audit trails required.
        </p>
        <p>
          <strong>Solution:</strong> Account changes require verification. Audit logging for all
          changes. Data export for patients (HIPAA right to access). Account deletion restricted
          (retain PHI for compliance).
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Patient data access enabled. PHI retained
          for compliance.
        </p>
        <p>
          <strong>Security:</strong> Verification, audit logging, PHI retention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Platform (Twitter)</h3>
        <p>
          <strong>Challenge:</strong> Millions of users. Account hijacking common. Need to secure
          account changes.
        </p>
        <p>
          <strong>Solution:</strong> Email change with dual verification. Login verification for
          sensitive changes. Security notifications for all changes. Account deactivation (30 days
          before permanent deletion).
        </p>
        <p>
          <strong>Result:</strong> Account hijacking reduced. Users notified of changes.
          Deactivation allows recovery.
        </p>
        <p>
          <strong>Security:</strong> Dual verification, login verification, security notifications.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of account settings UI design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email change securely?</p>
            <p className="mt-2 text-sm">
              A: Require current email verification (password or MFA). Send security notice to old
              email with cancellation link. Send verification link to new email. Show pending state
              until new email verified. Allow cancellation from old email. Expire pending change
              after 7 days.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement account deletion?</p>
            <p className="mt-2 text-sm">
              A: Show clear warning (data loss, irreversible). Require strong verification (password
              + MFA + email confirmation). Implement grace period (14-30 days). Send confirmation
              email with cancellation link. Anonymize data first, then hard delete after grace
              period. Audit log deletion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data export (GDPR)?</p>
            <p className="mt-2 text-sm">
              A: Support multiple formats (JSON, CSV, PDF). Asynchronous generation for large
              exports. Email notification when ready. Secure download link (expires 24-72 hours).
              Include all user data (profile, settings, content, activity logs). Show export size
              before generation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent unauthorized account changes?</p>
            <p className="mt-2 text-sm">
              A: Verification for all sensitive changes (password/MFA). Dual verification for
              email/phone (verify old + new). Security notifications for all changes. Audit logging.
              Allow rollback/cancellation. Grace periods for deletion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle phone number changes?</p>
            <p className="mt-2 text-sm">
              A: Require current phone verification (SMS code). Send verification code to new phone.
              Require additional verification (email + phone — due to account recovery
              implications). Show pending state. Allow cancellation from verified email.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you comply with GDPR right to erasure?</p>
            <p className="mt-2 text-sm">
              A: Allow account deletion request. Verify identity (password + MFA + email).
              Implement grace period (14-30 days). Anonymize data (don't immediately hard delete).
              Retain some data for compliance (financial records, fraud prevention). Document
              retention policies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you notify users of account changes?</p>
            <p className="mt-2 text-sm">
              A: Email notification for all sensitive changes (email, phone, password). Include
              change details (what changed, when, IP). Include "Was this you?" link (report
              unauthorized). Provide quick actions (revert change, secure account).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle pending email changes?</p>
            <p className="mt-2 text-sm">
              A: Show pending state clearly in UI ("Email change pending, check your new email").
              Allow cancellation from old email (security notice link). Send reminders (after 3
              days, 6 days). Expire after 7 days. Log all pending changes for audit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account settings?</p>
            <p className="mt-2 text-sm">
              A: Email/phone change success rate, account deletion rate, data export requests,
              verification failure rate, unauthorized change attempts. Set up alerts for anomalies —
              high deletion rate (possible attack), high verification failures (UX issues).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://gdpr.eu/article-17-right-to-erasure/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR Article 17 - Right to Erasure
            </a>
          </li>
          <li>
            <a
              href="https://gdpr.eu/article-20-right-to-data-portability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR Article 20 - Right to Data Portability
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
