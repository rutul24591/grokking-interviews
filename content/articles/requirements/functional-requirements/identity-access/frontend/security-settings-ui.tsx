"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-security-settings",
  title: "Security Settings UI",
  description: "Comprehensive guide to implementing security settings interfaces covering MFA management, session review, security alerts, login history, and security recommendations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "security-settings-ui",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "security-settings", "mfa", "sessions", "frontend"],
  relatedTopics: ["mfa-setup", "device-session-management", "account-settings", "authentication-service"],
};

export default function SecuritySettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Security Settings UI</strong> provides a centralized dashboard 
          for users to manage their account security including MFA configuration, 
          active sessions, login history, security alerts, and connected apps. It 
          empowers users to monitor and protect their accounts while providing 
          transparency into security status.
        </p>
        <p>
          For staff and principal engineers, implementing security settings requires 
          understanding security UX, risk communication, actionable recommendations, 
          and balancing comprehensiveness with usability. The implementation must 
          make security accessible to non-technical users while providing advanced 
          options for power users.
        </p>
      </section>

      <section>
        <h2>Security Dashboard</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Score/Health</h3>
          <ul className="space-y-3">
            <li>
              <strong>Visual Indicator:</strong> Score (0-100) or status 
              (Excellent/Good/Fair/Poor). Color-coded.
            </li>
            <li>
              <strong>Factors:</strong> MFA enabled (+30), verified email (+20), 
              verified phone (+20), recent password change (+15), no suspicious 
              activity (+15).
            </li>
            <li>
              <strong>Recommendations:</strong> Actionable items to improve score. 
              "Enable MFA for +30 points".
            </li>
            <li>
              <strong>Progress:</strong> Show improvement over time. Gamification 
              for engagement.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Checklist</h3>
          <ul className="space-y-3">
            <li>
              <strong>MFA Enabled:</strong> ✓ or ✗ with enable button.
            </li>
            <li>
              <strong>Email Verified:</strong> ✓ or ✗ with resend verification.
            </li>
            <li>
              <strong>Phone Verified:</strong> ✓ or ✗ with add phone option.
            </li>
            <li>
              <strong>Recent Password:</strong> ✓ if changed in 90 days.
            </li>
            <li>
              <strong>Backup Codes:</strong> ✓ if downloaded.
            </li>
            <li>
              <strong>Review Sessions:</strong> ✓ if reviewed recently.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>MFA Management</h2>
        <ul className="space-y-3">
          <li>
            <strong>Enrolled Methods:</strong> List all MFA methods (TOTP, SMS, 
            WebAuthn). Show status (enabled/disabled).
          </li>
          <li>
            <strong>Add Method:</strong> Button to enroll new method. Guide 
            through setup.
          </li>
          <li>
            <strong>Remove Method:</strong> Require verification before removing. 
            Can't remove last method.
          </li>
          <li>
            <strong>Reorder:</strong> Set default/preferred method. Drag to 
            reorder.
          </li>
          <li>
            <strong>Backup Codes:</strong> Generate new codes. Download/print. 
            Regenerate invalidates old.
          </li>
        </ul>
      </section>

      <section>
        <h2>Login History</h2>
        <ul className="space-y-3">
          <li>
            <strong>Recent Logins:</strong> List last 10-20 logins with date, 
            time, device, location, status.
          </li>
          <li>
            <strong>Failed Attempts:</strong> Show failed login attempts. Help 
            detect attacks.
          </li>
          <li>
            <strong>Map View:</strong> Geographic map of login locations. Visual 
            pattern recognition.
          </li>
          <li>
            <strong>Export:</strong> Download login history for records.
          </li>
          <li>
            <strong>Filter:</strong> Filter by date range, device type, status.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Alerts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Alert Settings:</strong> Configure which events trigger 
            alerts (new device, password change, MFA change).
          </li>
          <li>
            <strong>Delivery Method:</strong> Email, SMS, push notification. 
            Per-alert configuration.
          </li>
          <li>
            <strong>Alert History:</strong> View past security alerts. Dismiss 
            or take action.
          </li>
          <li>
            <strong>Quiet Hours:</strong> Suppress non-critical alerts during 
            specified hours.
          </li>
        </ul>
      </section>

      <section>
        <h2>Connected Apps</h2>
        <ul className="space-y-3">
          <li>
            <strong>OAuth Apps:</strong> List apps with OAuth access. Show 
            permissions granted.
          </li>
          <li>
            <strong>API Keys:</strong> List active API keys. Show last used, 
            permissions.
          </li>
          <li>
            <strong>Revoke Access:</strong> Remove app access. Confirm before 
            revoking.
          </li>
          <li>
            <strong>Activity:</strong> Show recent API activity per app.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Security</h2>
        <ul className="space-y-3">
          <li>
            <strong>Passkeys:</strong> Manage passkeys (FIDO2/WebAuthn). Add/
            remove devices.
          </li>
          <li>
            <strong>Account Recovery:</strong> Configure recovery options. 
            Trusted contacts.
          </li>
          <li>
            <strong>Privacy Settings:</strong> Control data visibility. 
            Third-party sharing.
          </li>
          <li>
            <strong>Data &amp; Privacy:</strong> Download data, delete account, 
            consent management.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage users to enable MFA?</p>
            <p className="mt-2 text-sm">
              A: Security score/health indicator, prominent recommendations, 
              friction for non-MFA users (periodic prompts), incentives 
              (higher limits with MFA), make setup easy (QR code, one-tap). 
              Don't mandate initially—encourage through UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you present security information to non-technical users?</p>
            <p className="mt-2 text-sm">
              A: Use plain language (not jargon), visual indicators (colors, 
              icons), actionable recommendations (not just warnings), 
              progressive disclosure (basic → advanced), help text and 
              tooltips. Test with real users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How often should users be prompted to review security settings?</p>
            <p className="mt-2 text-sm">
              A: Periodic reminders (every 3-6 months), after security incidents, 
              when adding sensitive features (payments), after long inactivity. 
              Don't nag—respectful frequency, easy to dismiss.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle security settings for enterprise accounts?</p>
            <p className="mt-2 text-sm">
              A: Admin-controlled policies (enforce MFA, password requirements), 
              SSO integration, audit logs for compliance, role-based access to 
              security settings, centralized user management.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you show failed login attempts to users?</p>
            <p className="mt-2 text-sm">
              A: Yes, with caveats. Show recent failures (30 days), include 
              location/device info, provide "was this you?" option, don't 
              show too much detail (helps attackers). Balance awareness 
              with not causing unnecessary alarm.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prioritize security recommendations?</p>
            <p className="mt-2 text-sm">
              A: Risk-based: MFA first (highest impact), verified contact info, 
              password age, session review, connected apps. Order by impact × 
              likelihood. Show top 3-5, not overwhelming list.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
